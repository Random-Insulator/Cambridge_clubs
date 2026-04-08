"use strict";
require("dotenv").config({ path: require("path").join(__dirname, ".env") });


const express    = require("express");
const cors       = require("cors");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const multer     = require("multer");
const path       = require("path");
const fs         = require("fs");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ─── Config ──────────────────────────────────────────────────────────────────
const PORT         = process.env.PORT || 3001;
const JWT_SECRET   = "cambridge_clubs_secret_2026"; // change in production
const DATA_DIR     = path.join(__dirname, "data");
const UPLOAD_DIR   = path.join(__dirname, "uploads");
const MENTORS      = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "mentors.json"), "utf8"));
const ADMIN_CREDS  = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "admin.json"), "utf8"));





// Ensure uploads directory and per-club sub-dirs exist
const CLUB_IDS = MENTORS.map(m => m.clubId);
CLUB_IDS.forEach(id => fs.mkdirSync(path.join(UPLOAD_DIR, id), { recursive: true }));

// ─── App ──────────────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(UPLOAD_DIR));

// Serve the mentor portal statically
app.use("/portal", express.static(path.join(__dirname, "portal")));

// Serve the main club website (parent folder) at the root
app.use("/", express.static(path.join(__dirname, "..")));

// ─── MongoDB / Mongoose Setup ───────────────────────────────────────────────
const mongoose = require("mongoose");

let mongoServer;

async function connectDB() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB Atlas');
      return;
    } catch (err) {
      console.error('MongoDB Atlas connection error:', err.message);
    }
  }
  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    console.log('✅ Connected to MongoDB Memory Server');
  } catch (err) {
    console.error('MongoDB Memory Server error:', err.message);
    console.log('⚠️  Running without database');
  }
}

const Activity = mongoose.model("Activity", new mongoose.Schema({
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
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

// GET /api/admin/pending
app.get("/api/admin/pending", requireAdmin, async (_req, res) => {
  const all = await Activity.find({ approved: false }).sort({ _id: -1 });
  res.json(all);
});

// POST /api/admin/approve/:id
app.post("/api/admin/approve/:id", requireAdmin, async (req, res) => {
  const act = await Activity.findOneAndUpdate(
    { id: req.params.id }, 
    { approved: true, approvedAt: new Date().toISOString() }, 
    { new: true }
  );
  if (!act) return res.status(404).json({ error: "Activity not found" });
  res.json({ message: "Approved", activity: act });
});

// DELETE /api/admin/reject/:id
app.delete("/api/admin/reject/:id", requireAdmin, async (req, res) => {
  const removed = await Activity.findOneAndDelete({ id: req.params.id });
  if (!removed) return res.status(404).json({ error: "Activity not found" });
  res.json({ message: "Rejected and deleted", id: req.params.id });
});

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { clubId, password } = req.body;
  if (!clubId || !password) {
    return res.status(400).json({ error: "clubId and password are required" });
  }
  const mentor = MENTORS.find(m => m.clubId === clubId);
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

// POST /api/chat — Chatbot endpoint (Upgraded to Groq for speed)
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });
  if (!GROQ_API_KEY || GROQ_API_KEY === "") {
    return res.json({ response: "I'm in 'Demo Mode' (No Groq API key found). Use Groq for lightning speed and smart recommendations!" });
  }

  try {
    // Hardcoded Safety Filter
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
Role: Help students find ONE official club from this list: Robotics, Cybersonic, Technocrates, Finance, Eco, TedEd, Theatre, Quizzarders, Cookery, Debate.
Phase Control:
- Turn 1: Ask a broad question to understand their area of interest.
- Turn 2: Ask a targeted follow-up.
- Turn 3: Ask ONE more narrowing question.
- Turn 4: RECOMMEND EXACTLY ONE CLUB. Never ask another question.
Rules:
- Never ask the user to 'propose' or 'create' a club.
- Use explicit mapping: Computers -> Cybersonic; Hardware -> Robotics; Science -> Technocrates; Money -> Finance; Art -> Eco; Speaking -> TedEd; Drama -> Theatre; Facts -> Quizzarders; Cooking -> Cookery; Discussion -> Debate.
- Max 35 words per response.
- CURRENT TURN: ${turnCount}/3. ${isFinalRecommendation ? "STOP QUESTIONS. MUST RECOMMEND CLUB NOW." : ""}`;

    const groqHistory = (history || []).map(h => ({
      role: h.role === "assistant" ? "assistant" : "user",
      content: h.content,
    }));

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        ...groqHistory,
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    const errMsg = error.message || "Unknown error";
    console.error("Groq API Error details:", error);
    res.status(500).json({ error: `The Groq bot is having a high-speed nap (Reason: ${errMsg}). Please try again soon!` });
  }
});


// GET /api/activities/:clubId  — public
app.get("/api/activities/:clubId", async (req, res) => {
  const { clubId } = req.params;
  if (!CLUB_IDS.includes(clubId)) return res.status(404).json({ error: "Unknown club" });
  const all = await Activity.find({ clubId, approved: true }).sort({ _id: -1 });
  res.json(all);
});

// POST /api/upload/:clubId  — protected
app.post("/api/upload/:clubId", requireAuth, (req, res, next) => {
  const { clubId } = req.params;
  if (req.mentor.clubId !== clubId) return res.status(403).json({ error: "You can only upload photos to your own club" });
  if (!CLUB_IDS.includes(clubId)) return res.status(404).json({ error: "Unknown club" });
  upload.single("image")(req, res, async err => {
    if (err) return next(err);
    if (!req.file) return res.status(400).json({ error: "No image file provided" });
    const { title, date, tag, desc } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });
    const activity = new Activity({
      id:       uuidv4(),
      clubId,
      img:      req.file.path,
      title:    title.trim(),
      date:     (date || new Date().toISOString().split("T")[0]).trim(),
      tag:      (tag  || "Activity").trim(),
      desc:     (desc || "").trim(),
      approved: false,
      uploadedAt: new Date().toISOString()
    });
    await activity.save();
    res.status(201).json(activity);
  });
});

// DELETE /api/activities/:clubId/:id  — protected
app.delete("/api/activities/:clubId/:id", requireAuth, async (req, res) => {
  const { clubId, id } = req.params;
  if (req.mentor.clubId !== clubId) return res.status(403).json({ error: "You can only delete activities from your own club" });
  const removed = await Activity.findOneAndDelete({ id, clubId });
  if (!removed) return res.status(404).json({ error: "Activity not found" });
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
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅  Cambridge Clubs backend running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
