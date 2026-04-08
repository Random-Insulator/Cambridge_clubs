const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend', 'data', 'activities.json');
let activities = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const updates = {
  '11bda53c-9bdb-40b0-852a-6b1b2c5047f3': '/uploads/quizzaders/quiz_competition.jpg',
  '647c36b7-3263-4b60-8a2e-09f56ab6c3a0': '/uploads/quizzaders/indian_heritage.jpg',
  'e5a4a892-8fab-4475-990d-b7a42b0a9c94': '/uploads/quizzaders/world_map.jpg',
  '7c06d593-4a75-4491-8b4b-8622fa7e35f9': '/uploads/finance/crypto_presentation.jpg',
  '08ef34a8-609b-4546-ba59-7438ccaf4764': '/uploads/finance/personal_budgeting.jpg',
  '12e75372-388b-4373-a0e2-892b48e14742': '/uploads/finance/stock_market.jpg',
  '2c34c591-e38f-4fbc-bbcd-4f536eb2ad36': '/uploads/debate/formal_debate.jpg',
  'f9a872ea-e12c-4446-99b6-21e5d2aaee23': '/uploads/debate/script_writing.jpg',
  '56e7b56b-7f62-437d-9191-afdc7e709578': '/uploads/debate/roundtable_discussion.jpg'
};

activities = activities.map(a => {
  if (updates[a.id]) {
    return { ...a, img: updates[a.id] };
  }
  return a;
});

fs.writeFileSync(filePath, JSON.stringify(activities, null, 2));
console.log('Updated activities.json');
