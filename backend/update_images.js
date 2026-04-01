const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const Activity = mongoose.model('Activity', new mongoose.Schema({
  id: String,
  img: String
}));

async function update() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const updates = [
      // Quizzarders
      { id: '11bda53c-9bdb-40b0-852a-6b1b2c5047f3', img: '/uploads/quizzarders/quiz_competition.jpg' },
      { id: '647c36b7-3263-4b60-8a2e-09f56ab6c3a0', img: '/uploads/quizzarders/indian_heritage.jpg' },
      { id: 'e5a4a892-8fab-4475-990d-b7a42b0a9c94', img: '/uploads/quizzarders/world_map.jpg' },
      // Finance
      { id: '7c06d593-4a75-4491-8b4b-8622fa7e35f9', img: '/uploads/finance/crypto_presentation.jpg' },
      { id: '08ef34a8-609b-4546-ba59-7438ccaf4764', img: '/uploads/finance/personal_budgeting.jpg' },
      { id: '12e75372-388b-4373-a0e2-892b48e14742', img: '/uploads/finance/stock_market.jpg' },
      // Debate
      { id: '2c34c591-e38f-4fbc-bbcd-4f536eb2ad36', img: '/uploads/debate/formal_debate.jpg' },
      { id: 'f9a872ea-e12c-4446-99b6-21e5d2aaee23', img: '/uploads/debate/script_writing.jpg' },
      { id: '56e7b56b-7f62-437d-9191-afdc7e709578', img: '/uploads/debate/roundtable_discussion.jpg' }
    ];

    for (const u of updates) {
      const res = await Activity.findOneAndUpdate({ id: u.id }, { img: u.img });
      if (res) console.log(`Updated ${u.id}`);
      else console.log(`Could not find ${u.id}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
update();
