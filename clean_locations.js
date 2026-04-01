const fs = require('fs');
const path = require('path');

const clubs = [
  'teded/teded.html',
  'cybersonic/cybersonic.html',
  'robotics/robotics.html',
  'cookery/cookery.html',
  'quizzarders/quizzarders.html',
  'finance/finance.html',
  'drama/drama.html',
  'eco/eco.html',
  'technogrades/technogrades.html',
  'debate/debate.html'
];

clubs.forEach(fileRelPath => {
  const filePath = path.join(__dirname, fileRelPath);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Skipping ${fileRelPath} (not found)`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove location from meeting tag (e.g. "· Computer Lab")
  // Handles patterns like "Every Friday · 7th Floor, Glassroom" -> "Every Friday"
  content = content.replace(/(Every\s+[\w\/]+\s*)·\s*[^<]+/g, '$1');

  // 2. Remove Room row from sidebar
  // Handles both single line <div class="info-row">...</div> and multiline
  content = content.replace(/<div class="info-row">\s*<span class="info-label">Room<\/span>[\s\S]*?<\/div>/g, '');

  fs.writeFileSync(filePath, content);
  console.log(`✅ Cleaned ${fileRelPath}`);
});
