"use strict";
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express       = require("express");
const cors          = require("cors");
const bcrypt        = require("bcryptjs");
const jwt           = require("jsonwebtoken");
const multer        = require("multer");
const path          = require("path");
const fs            = require("fs");
const { v4: uuidv4 } = require("uuid");
const cloudinary    = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ─── In-Memory Cache (for public activities endpoint) ────────────────────────
const _cache = new Map(); // key: clubId → { data, expiresAt }
const CACHE_TTL_MS = 60 * 1000; // 60 seconds
function getCached(key) {
  const entry = _cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) return null;
  return entry.data;
}
function setCache(key, data) {
  _cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}
function invalidateCache(clubId) {
  _cache.delete(clubId); // call this after approve/reject
}

// ─── Rate Limiter (for expensive AI chat endpoint) ────────────────────────────
const _chatHits = new Map();
function chatRateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 30;
  const entry = _chatHits.get(ip) || { count: 0, start: now };

  if (now - entry.start > windowMs) {
    _chatHits.set(ip, { count: 1, start: now });
    return next();
  }

  entry.count++;
  _chatHits.set(ip, entry);

  if (entry.count > maxRequests) {
    const secondsLeft = Math.ceil((windowMs - (now - entry.start)) / 1000);
    console.warn(`⚠️ Rate limit hit by IP: ${ip} — resets in ${secondsLeft}s`);
    res.setHeader('Retry-After', secondsLeft);
    return res.status(429).json({
      response: `Too many messages! Give it ${secondsLeft} second${secondsLeft !== 1 ? 's' : ''} and try again 😅`
    });
  }

  next();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ─── Config & Data Files ──────────────────────────────────────────────────────
const PORT         = process.env.PORT || 3001;
const JWT_SECRET   = "cambridge_clubs_secret_2026";
const DATA_DIR     = path.join(__dirname, "data");
const UPLOAD_DIR   = path.join(__dirname, "uploads");
const MENTORS      = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "mentors.json"), "utf8"));
const ADMIN_CREDS  = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "admin.json"), "utf8"));
const LOCAL_ACTIVITIES = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "activities.json"), "utf8"));

const CLUB_IDS = MENTORS.map(m => m.clubId);
try {
  CLUB_IDS.forEach(id => fs.mkdirSync(path.join(UPLOAD_DIR, id), { recursive: true }));
} catch (e) {
  console.warn("⚠️ Could not create uploads directory (expected in read-only environments like Vercel).");
}

// ─── App ──────────────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// DB Connection Middleware for serverless API routes
app.use(async (req, res, next) => {
  if (req.path.startsWith("/api")) {
    try {
      await connectDB();
    } catch (e) {
      console.warn("DB connection warning:", e.message);
    }
  }
  next();
});

try {
  const compression = require("compression");
  app.use(compression());
} catch {}

// Static assets
app.use("/uploads", express.static(UPLOAD_DIR));
app.use("/portal", express.static(path.join(__dirname, "portal")));
app.use("/", express.static(path.join(__dirname, "..")));

// ─── MongoDB / Mongoose Setup ───────────────────────────────────────────────
const mongoose = require("mongoose");
let mongoServer;
let dbConnectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (dbConnectionPromise) return dbConnectionPromise;

  dbConnectionPromise = (async () => {
    if (process.env.MONGODB_URI) {
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Connected to MongoDB Atlas');
        return;
      } catch (err) {
        console.error('MongoDB Atlas connection error:', err.message);
      }
    }
    if (!process.env.VERCEL) {
      try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        console.log('✅ Connected to MongoDB Memory Server');
      } catch (err) {
        console.error('MongoDB Memory Server error:', err.message);
      }
    }
  })();

  try {
    await dbConnectionPromise;
  } finally {
    dbConnectionPromise = null;
  }
}

const Activity = mongoose.models.Activity || mongoose.model("Activity", new mongoose.Schema({
  id: String,
  clubId: String,
  img: String,
  title: String,
  date: String,
  tag: String,
  desc: String,
  approved: Boolean,
  uploadedAt: String,
  approvedAt: String
}));

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  try {
    req.mentor = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);
    if (payload.role !== "admin") return res.status(403).json({ error: "Admin access required" });
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ─── Multer Storage ───────────────────────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => `cambridge_clubs/${req.params.clubId}`,
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /api/admin/login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (!password || !bcrypt.compareSync(password, ADMIN_CREDS.passwordHash)) {
    return res.status(401).json({ error: "Invalid admin password" });
  }
  const token = jwt.sign({ role: "admin", username: ADMIN_CREDS.username }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token });
});

// ─── File-backed /tmp persistence for Serverless & DB Fallback ───────────────
const TMP_FILE = path.join("/tmp", "cambridge_clubs_activities.json");

function getPersistedActivities() {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, "utf8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Failed reading /tmp activities file:", err.message);
  }
  return JSON.parse(JSON.stringify(LOCAL_ACTIVITIES));
}

function savePersistedActivities(activities) {
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(activities, null, 2), "utf8");
  } catch (err) {
    console.warn("Failed writing /tmp activities file:", err.message);
  }
}

// Global in-memory reference initialized with persisted activities
let STORE = getPersistedActivities();

// GET /api/admin/pending
app.get("/api/admin/pending", requireAdmin, async (_req, res) => {
  STORE = getPersistedActivities();
  let dbPending = [];
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      dbPending = await Activity.find({ approved: false }).sort({ _id: -1 });
    }
  } catch (err) {
    console.warn("Failed to fetch pending from DB:", err.message);
  }

  const dbIds = new Set(dbPending.map(p => p.id));
  const memPending = STORE.filter(a => !a.approved && !dbIds.has(a.id));
  const allPending = [
    ...dbPending.map(p => p.toObject ? p.toObject() : p),
    ...memPending
  ].sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));

  res.json(allPending);
});

// POST /api/admin/approve/:id
app.post("/api/admin/approve/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const now = new Date().toISOString();
  STORE = getPersistedActivities();

  let memItem = STORE.find(a => a.id === id);
  if (memItem) {
    memItem.approved = true;
    memItem.approvedAt = now;
  } else {
    // If not found in current cold-start instance, use payload passed from Admin frontend!
    const bodyAct = req.body?.activity;
    if (bodyAct && (bodyAct.id === id || bodyAct.title)) {
      memItem = {
        ...bodyAct,
        id: bodyAct.id || id,
        approved: true,
        approvedAt: now
      };
      STORE.unshift(memItem);
    }
  }

  if (memItem) {
    savePersistedActivities(STORE);
    invalidateCache(memItem.clubId);
  }

  let dbAct = null;
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      dbAct = await Activity.findOneAndUpdate(
        { id }, 
        { approved: true, approvedAt: now }, 
        { new: true }
      );
      if (dbAct) invalidateCache(dbAct.clubId);
    }
  } catch (err) {
    console.warn("DB approve warning:", err.message);
  }

  if (!memItem && !dbAct) return res.status(404).json({ error: "Activity not found" });

  res.json({ message: "Approved", activity: dbAct || memItem });
});

// DELETE /api/admin/reject/:id
app.delete("/api/admin/reject/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  STORE = getPersistedActivities();

  const idx = STORE.findIndex(a => a.id === id);
  let removedMem = null;
  if (idx !== -1) {
    removedMem = STORE.splice(idx, 1)[0];
    savePersistedActivities(STORE);
    invalidateCache(removedMem.clubId);
  }

  let removedDb = null;
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      removedDb = await Activity.findOneAndDelete({ id });
      if (removedDb) invalidateCache(removedDb.clubId);
    }
  } catch (err) {
    console.warn("DB reject warning:", err.message);
  }

  if (!removedMem && !removedDb) {
    // Graceful response for serverless cold starts
    return res.json({ message: "Rejected and deleted", id });
  }

  res.json({ message: "Rejected and deleted", id });
});

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { clubId, password } = req.body;
  if (!clubId || !password) {
    return res.status(400).json({ error: "clubId and password are required" });
  }
  const mentor = MENTORS.find(m => m.clubId.toLowerCase() === clubId.toLowerCase());
  if (!mentor || !bcrypt.compareSync(password, mentor.passwordHash)) {
    return res.status(401).json({ error: "Invalid club or password" });
  }
  const token = jwt.sign(
    { clubId: mentor.clubId, mentorName: mentor.mentorName, clubName: mentor.name },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
  res.json({ token, clubId: mentor.clubId, clubName: mentor.name, mentorName: mentor.mentorName });
});

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: GROQ_API_KEY });

// POST /api/chat — Chatbot endpoint
app.post("/api/chat", chatRateLimit, async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });
  if (!GROQ_API_KEY || GROQ_API_KEY === "") {
    return res.json({ response: "I'm in 'Demo Mode' (No Groq API key found). Use Groq for lightning speed and smart recommendations!" });
  }

  try {
    const inappropriateKeywords = [
      "porn", "sex", "naked", "xxx", "fuck", "dick", "pussy", "nude", "hentai", "dih", "dihh",
      "shit", "bitch", "asshole", "bastard", "slut", "whore", "cunt", "faggot", "nigger", "nigga",
      "cock", "boobs", "tits", "vagina", "penis", "cum", "jerk", "wank", "rape", "blowjob", "handjob",
      "horny", "milf", "thot", "simp", "incel", "masturbate", "orgasm", "kink", "fetish", "smut",
      "erotica", "stripper", "prostitute", "bukkake", "douche", "twat", "chode", "schlong", "pecker",
      "motherfucker", "fucker", "shitty", "bullshit", "dumbass", "jackass", "fag", "dyke", "tranny",
      "retard", "skank", "hoe", "hooker", "clit", "anal", "dildo", "vibrator", "scrotum", "testicles",
      "ballsack", "nutting", "cameltoe", "shat", "crap", "piss", "wanker", "arsehole", "prick",
      "snatch", "coochie", "cooter", "kys", "suicide", "hitler", "nazi", "terrorist", "bomb",
      "bhenchod", "madarchod", "chutiya", "bhosdike", "randi", "gandu", "kamina", "saala", "harami", "muthi",
      "shag", "whoring", "pedophile", "pedo", "incest", "stepmom", "stepdad", "stepbro", "stepsis",
      "dickhead", "fucking", "fucks", "shithead", "shitting", "bitching", "assholes", "cunts", "sluts",
      "nudes", "nudez", "nudity", "booty", "ass", "arses", "arse", "boob", "titties", "titty", "foreskin",
      "smegma", "queer", "homo", "lesbo", "shite", "shitebag", "wankstain", "jerkoff", "toss", "tossing",
      "deepthroat", "gangbang", "threesome", "orgy", "squirt", "scat", "golden shower", "gooning"
    ];
    const lowerMessage = message.toLowerCase();
    if (inappropriateKeywords.some(word => lowerMessage.includes(word))) {
      return res.json({ response: "I'm sorry, I cannot respond to that. Please keep our conversation school-appropriate and focused on finding a club!" });
    }

    const turnCount = Math.floor((history || []).length / 2) + 1;
    const isFinalRecommendation = turnCount >= 4;

    const systemInstruction = `You are the "Cambridge Clubs Bot". 
Role: Help students find ONE official club from this list: Robotics, Cybersonic, Technocrates, Finance, Eco, TedEd, Theatre, Quizzaders, Cookery, Debate, Literary.
Phase Control:
- Turn 1: Ask a broad question to understand their area of interest.
- Turn 2: Ask a targeted follow-up.
- Turn 3: Ask ONE more narrowing question.
- Turn 4: RECOMMEND EXACTLY ONE CLUB. Never ask another question.
Rules:
- try to yap with the students, just try to keep the conversation like a human fun conversation.
- Never ask the user to 'propose' or 'create' a club.
- Use explicit mapping: Computers -> Cybersonic; Hardware -> Robotics; Science -> Technocrates; Money -> Finance; Art -> Eco; Speaking -> TedEd; Drama -> Theatre; Facts -> Quizzaders; Cooking -> Cookery; Discussion -> Debate; Writing/Poetry -> Literary.
- CURRENT TURN: ${turnCount}/3. ${isFinalRecommendation ? "STOP QUESTIONS. MUST RECOMMEND CLUB NOW." : ""}`;

    const groqHistory = (history || []).map(h => ({
      role: h.role === "assistant" ? "assistant" : "user",
      content: h.content,
    }));

    const GROQ_MODELS = [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "llama3-70b-8192",
      "llama3-8b-8192",
      "mixtral-8x7b-32768",
      "openai/gpt-oss-120b",
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-20b",
      "canopylabs/orpheus-v1-english"
    ];

    let content = null;
    let lastError = null;

    for (const model of GROQ_MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemInstruction },
            ...groqHistory,
            { role: "user", content: message }
          ],
          model,
          temperature: 0.7,
          max_tokens: 150,
          top_p: 1,
        });
        if (completion?.choices?.[0]?.message?.content) {
          content = completion.choices[0].message.content;
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Groq model '${model}' failed:`, err.message);
      }
    }

    if (content) {
      return res.json({ response: content });
    }

    throw lastError || new Error("All Groq models failed");
  } catch (error) {
    console.error("Groq API Error details:", error);

    const isRateLimit = error?.status === 429 || error?.statusCode === 429 ||
                        (error?.message || "").toLowerCase().includes("rate limit");
    if (isRateLimit) {
      return res.json({
        response: "The chatbot is a little busy right now — lots of people exploring clubs at once! 😊 Give it 30 seconds and try again, or just browse the club pages directly above."
      });
    }

    const errMsg = error.message || "Unknown error";
    res.status(500).json({ error: `The Groq bot is having a high-speed nap (Reason: ${errMsg}). Please try again soon!` });
  }
});

const LEGACY_UPLOADS_MAP = {
  "/uploads/cybersonic/ai_chatbot.png": "https://res.cloudinary.com/dynno0f9q/image/upload/v1775085309/cambridge_clubs/cybersonic/onrgs2czacfmntx5f0jg.jpg",
  "/uploads/cybersonic/gen_ai_presentation.png": "https://res.cloudinary.com/dynno0f9q/image/upload/v1775085308/cambridge_clubs/cybersonic/fuu5stzeidvgrdafk9ev.jpg",
  "/uploads/cybersonic/python_screensaver.png": "https://res.cloudinary.com/dynno0f9q/image/upload/v1775085307/cambridge_clubs/cybersonic/kvgxoj6qnukyxkcfaxt8.jpg",
  "/uploads/finance/stock_market.jpg": "https://res.cloudinary.com/dynno0f9q/image/upload/v1775085313/cambridge_clubs/finance/syvim5ws7csz5umfdmu6.jpg",
  "/uploads/finance/personal_budgeting.jpg": "https://res.cloudinary.com/dynno0f9q/image/upload/v1775085314/cambridge_clubs/finance/att2vuwgu4ip6h0e08pw.jpg",
  "/uploads/finance/crypto_presentation.jpg": "https://res.cloudinary.com/dynno0f9q/image/upload/v1775085315/cambridge_clubs/finance/voiwgmsqj3dkw6vqqn3n.jpg",
  "/uploads/debate/roundtable_discussion.jpg": "https://res.cloudinary.com/dynno0f9q/image/upload/v1775085317/cambridge_clubs/debate/osrtyq140qmq2kvqxqa3.jpg",
  "/uploads/debate/script_writing.jpg": "https://res.cloudinary.com/dynno0f9q/image/upload/v1775085318/cambridge_clubs/debate/k7vbddutkw5lgbkshciy.jpg",
  "/uploads/debate/formal_debate.jpg": "https://res.cloudinary.com/dynno0f9q/image/upload/v1775085316/cambridge_clubs/debate/zjdqrtya80ghmidhjfpz.jpg",
  "/uploads/quizzaders/world_map.jpg": "https://res.cloudinary.com/dynno0f9q/image/upload/v1775085312/cambridge_clubs/quizzaders/zro9htf6fuuqdsqubag3.jpg",
  "/uploads/quizzaders/indian_heritage.jpg": "https://res.cloudinary.com/dynno0f9q/image/upload/v1775085311/cambridge_clubs/quizzaders/m1tbkyv86xfsasagxyoh.jpg",
  "/uploads/quizzaders/quiz_competition.jpg": "https://res.cloudinary.com/dynno0f9q/image/upload/v1775085310/cambridge_clubs/quizzaders/ygs7ijjmfqexd64e6vpn.jpg"
};

// GET /api/activities/:clubId — public or mentor full list (with 60-second cache & fallback)
app.get("/api/activities/:clubId", async (req, res) => {
  const rawClubId = (req.params.clubId || "").toLowerCase();
  const showAll = req.query.all === "true" || req.query.includePending === "true";

  let normalizedId = rawClubId;
  if (rawClubId === "drama") normalizedId = "theatre";
  if (rawClubId === "technogrades") normalizedId = "technocrates";

  if (!showAll) {
    const cached = getCached(normalizedId);
    if (cached && cached.length > 0) {
      res.setHeader("X-Cache", "HIT");
      return res.json(cached);
    }
  }

  let dbActivities = [];
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      const query = { clubId: { $regex: new RegExp(`^${normalizedId}$`, 'i') } };
      if (!showAll) query.approved = true;
      dbActivities = await Activity.find(query).sort({ _id: -1 });
    }
  } catch (err) {
    console.warn("MongoDB fetch error, falling back to STORE:", err.message);
  }

  const memActivities = STORE.filter(a => {
    const clubMatch = (a.clubId || "").toLowerCase() === normalizedId || (a.clubId || "").toLowerCase() === rawClubId;
    return clubMatch && (showAll || a.approved);
  });

  const dbIds = new Set(dbActivities.map(a => a.id));
  const mergedRaw = [
    ...dbActivities.map(a => a.toObject ? a.toObject() : a),
    ...memActivities.filter(a => !dbIds.has(a.id))
  ];

  const seenTitles = new Set();
  const cleanList = [];

  for (const act of mergedRaw) {
    const item = { ...act };
    if (item.img && LEGACY_UPLOADS_MAP[item.img]) {
      item.img = LEGACY_UPLOADS_MAP[item.img];
    } else if (item.img && item.img.startsWith("/uploads/")) {
      const match = STORE.find(l => (l.title === item.title || l.desc === item.desc) && l.img && l.img.startsWith("http"));
      if (match) {
        item.img = match.img;
      } else {
        const fallback = STORE.find(l => (l.clubId || "").toLowerCase() === normalizedId && l.img && l.img.startsWith("http"));
        if (fallback) item.img = fallback.img;
      }
    }

    if (item.img && !item.img.startsWith("/uploads/")) {
      const key = `${(item.title || "").toLowerCase()}-${item.id || ""}`;
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        cleanList.push(item);
      }
    }
  }

  const finalActivities = cleanList.length > 0 ? cleanList : memActivities;

  if (!showAll) setCache(normalizedId, finalActivities);
  res.setHeader("X-Cache", showAll ? "BYPASS" : "MISS");
  res.json(finalActivities);
});

// POST /api/upload/:clubId — protected
app.post("/api/upload/:clubId", requireAuth, (req, res, next) => {
  const { clubId } = req.params;
  const reqClub = (req.mentor.clubId || "").toLowerCase();
  if (reqClub !== clubId.toLowerCase()) return res.status(403).json({ error: "You can only upload photos to your own club" });
  
  upload.single("image")(req, res, async err => {
    if (err) return next(err);
    if (!req.file) return res.status(400).json({ error: "No image file provided" });
    const { title, date, tag, desc } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });

    const activityObj = {
      id:       uuidv4(),
      clubId:   clubId.toLowerCase(),
      img:      req.file.path,
      title:    title.trim(),
      date:     (date || new Date().toISOString().split("T")[0]).trim(),
      tag:      (tag  || "Activity").trim(),
      desc:     (desc || "").trim(),
      approved: false, // goes to admin approval queue
      uploadedAt: new Date().toISOString()
    };

    // Store in-memory and in file persistence immediately so it never vanishes!
    STORE = getPersistedActivities();
    STORE.unshift(activityObj);
    savePersistedActivities(STORE);
    invalidateCache(clubId.toLowerCase());

    // Also persist to MongoDB Atlas if connected
    try {
      await connectDB();
      if (mongoose.connection.readyState === 1) {
        const activity = new Activity(activityObj);
        await activity.save();
      }
    } catch (dbErr) {
      console.warn("MongoDB save error (stored in memory fallback):", dbErr.message);
    }

    res.status(201).json(activityObj);
  });
});

// DELETE /api/activities/:clubId/:id — protected
app.delete("/api/activities/:clubId/:id", requireAuth, async (req, res) => {
  const { clubId, id } = req.params;
  if (req.mentor.clubId.toLowerCase() !== clubId.toLowerCase()) {
    return res.status(403).json({ error: "You can only delete activities from your own club" });
  }

  const idx = STORE.findIndex(a => a.id === id);
  let removedMem = null;
  if (idx !== -1) {
    removedMem = STORE.splice(idx, 1)[0];
    invalidateCache(clubId.toLowerCase());
  }

  let removedDb = null;
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      removedDb = await Activity.findOneAndDelete({ id, clubId });
      if (removedDb) invalidateCache(clubId.toLowerCase());
    }
  } catch (dbErr) {
    console.warn("DB delete warning:", dbErr.message);
  }

  if (!removedMem && !removedDb) return res.status(404).json({ error: "Activity not found" });

  res.json({ message: "Activity deleted", id });
});

// ─── 404 Fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, "..", "404.html"));
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(400).json({ error: err.message });
});

// ─── Start ────────────────────────────────────────────────────────────────────
module.exports = app;

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`\n✅ Cambridge Clubs backend running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
} else {
  connectDB().catch(console.error);
}
