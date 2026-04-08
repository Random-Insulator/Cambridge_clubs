const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

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

  // Define activities for missing clubs
  const missingActivities = [
    {
      clubId: "cybersonic",
      local: "uploads/cybersonic/python_screensaver.png",
      title: "Python Screensaver Development",
      desc: "Students learn how to build a dynamic, colorful screensaver using Python's math and turtle modules."
    },
    {
      clubId: "cybersonic",
      local: "uploads/cybersonic/gen_ai_presentation.png",
      title: "Gen AI & Future Tech",
      desc: "A deep dive into how Generative AI works, with students discussing its impact on the future of software development."
    },
    {
      clubId: "cybersonic",
      local: "uploads/cybersonic/ai_chatbot.png",
      title: "AI Chatbot Workshop",
      desc: "A hands-on session where students build their own AI-powered chatbot using modern NLP frameworks."
    },
    {
      clubId: "quizzaders",
      local: "uploads/quizzaders/quiz_competition.jpg",
      title: "Intra-School Quiz Championship",
      desc: "A fierce competition between grades testing general knowledge on global events and technology."
    },
    {
      clubId: "quizzaders",
      local: "uploads/quizzaders/indian_heritage.jpg",
      title: "Indian Heritage Quiz",
      desc: "Exploring the rich history and culture of India through an interactive multimedia quiz session."
    },
    {
      clubId: "quizzaders",
      local: "uploads/quizzaders/world_map.jpg",
      title: "Geography & Mapping Contest",
      desc: "Students identifying world capitals and geographical landmarks in a fast-paced map challenge."
    },
    {
      clubId: "finance",
      local: "uploads/finance/stock_market.jpg",
      title: "Stock Market Simulation",
      desc: "Learning the basics of trading and investment by managing a virtual portfolio in real-time."
    },
    {
      clubId: "finance",
      local: "uploads/finance/personal_budgeting.jpg",
      title: "Personal Budgeting Workshop",
      desc: "High schoolers learning to manage their future allowances and the power of compound interest."
    },
    {
      clubId: "finance",
      local: "uploads/finance/crypto_presentation.jpg",
      title: "The Future of Digital Finance",
      desc: "Discussing blockchain, cryptocurrency, and how digital wallets are changing the global economy."
    }
  ];

  // Branded Debate Images
  const debateImages = [
    {
      clubId: "debate",
      local: "/home/random_insulator/.gemini/antigravity/brain/2b56ca45-384b-48f2-821d-5b74ba0c60ca/debate_podium_branded_1775062236829_1775085163446.png",
      title: "Formal School Debate",
      desc: "Students at the CCWS podium debating critical social issues in front of their peers."
    },
    {
      clubId: "debate",
      local: "/home/random_insulator/.gemini/antigravity/brain/2b56ca45-384b-48f2-821d-5b74ba0c60ca/debate_teacher_branded_1775062236829_1775085185319.png",
      title: "Roundtable Discussion",
      desc: "Collaborative debate workshop led by an Indian mentor to refine research skills and strategy."
    },
    {
      clubId: "debate",
      local: "/home/random_insulator/.gemini/antigravity/brain/2b56ca45-384b-48f2-821d-5b74ba0c60ca/debate_script_branded_1775062236829_1775085203047.png",
      title: "Script Writing Session",
      desc: "Detailed drafting of constructive arguments and rebuttals for an upcoming inter-school competition."
    }
  ];

  const allToUpload = [...missingActivities, ...debateImages];

  for (const actData of allToUpload) {
    try {
      console.log(`Uploading ${actData.local}...`);
      const result = await cloudinary.uploader.upload(actData.local, {
        folder: `cambridge_clubs/${actData.clubId}`
      });

      const entry = new Activity({
        id: Math.random().toString(36).substr(2, 9),
        clubId: actData.clubId,
        img: result.secure_url,
        title: actData.title,
        date: new Date().toISOString().split("T")[0],
        tag: "Activity",
        desc: actData.desc,
        approved: true,
        uploadedAt: new Date().toISOString(),
        approvedAt: new Date().toISOString()
      });

      await entry.save();
      console.log(`✅ Saved ${actData.title} to DB`);
    } catch (e) {
      console.error(`❌ Error uploading ${actData.local}:`, e.message);
    }
  }

  // Update activities.json too
  const allActivities = await Activity.find({});
  fs.writeFileSync("./data/activities.json", JSON.stringify(allActivities, null, 2));

  console.log("🚀 Migration Complete!");
  process.exit(0);
}

migrate();
