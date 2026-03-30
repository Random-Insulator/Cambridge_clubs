const clubs = [
  {
    name: "TedEd",
    category: "Speaking",
    desc: "Ideas worth spreading. Student-led talks on topics that matter to you — science, society, art, tech, anything.",
    color: "#e8504a",
    bg: "rgba(232,80,74,0.1)",
    border: "rgba(232,80,74,0.2)",
    img: "images/teded.jpg",
    link: "teded/teded.html"
  },
  {
    name: "Cybersonic",
    category: "Technology",
    desc: ".Cybersonic Club transforms students from digital consumers into sophisticated tech architects by mastering the full computing stack, from Python and AI to robust cybersecurity.",
    color: "#7c6ef7",
    bg: "rgba(124,110,247,0.1)",
    border: "rgba(124,110,247,0.2)",
    img: "images/cybersonic.jpg",
    link: "cybersonic/cybersonic.html"
  },
  {
    name: "Robotics",
    category: "Technology",
    desc: "Build, program, and compete with robots. No experience needed — just curiosity and a willingness to break things.",
    color: "#3b9cf5",
    bg: "rgba(59,156,245,0.1)",
    border: "rgba(59,156,245,0.2)",
    img: "images/robotics.jpg",
    link: "robotics/robotics.html"
  },
  {
    name: "Cookery",
    category: "Life Skills",
    desc: "Provides an engaging platform for students to explore fireless cooking, sustainable practices, and healthy dishes in a fun and creative environment.",
    color: "#f59e3b",
    bg: "rgba(245,158,59,0.1)",
    border: "rgba(245,158,59,0.2)",
    img: "images/cookery.jpg",
    link: "cookery/cookery.html"
  },
  {
    name: "Quizzarders",
    category: "Academic",
    desc: "Quiz champions in the making. Trivia, general knowledge, and inter-school competitions every term.",
    color: "#22c97a",
    bg: "rgba(34,201,122,0.1)",
    border: "rgba(34,201,122,0.2)",
    img: "images/quizzarders.jpg",
    link: "quizzarders/quizzarders.html"
  },
  {
    name: "Finance",
    category: "Finance",
    desc: "Stocks, budgeting, investing. Learn to understand money before you actually need to manage it.",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.2)",
    img: "images/finance.jpg",
    link: "finance/finance.html"
  },
  {
    name: "Theatre",
    category: "Arts",
    desc: "Stage performances, improv nights, and storytelling workshop.",
    color: "#d946b0",
    bg: "rgba(217,70,176,0.1)",
    border: "rgba(217,70,176,0.2)",
    img: "images/Theatre.jpg",
    link: "drama/drama.html"
  },
  {
    name: "Eco",
    category: "Environment",
    desc: "Campus sustainability projects, school gardening, and climate action campaigns that actually make a difference.",
    color: "#65c948",
    bg: "rgba(101,201,72,0.1)",
    border: "rgba(101,201,72,0.2)",
    img: "images/eco.jpg",
    link: "eco/eco.html"
  },
  {
    name: "Technocrates",
    category: "Academic",
    desc: "Technocrates Club transforms students into active innovators through hands-on scientific experimentation and real-world discovery.",
    color: "#f97316",
    bg: "rgba(249,115,22,0.1)",
    border: "rgba(249,115,22,0.2)",
    img: "images/Technocrates.jpg",
    link: "technogrades/technogrades.html"
  },
  {
    name: "Debate",
    category: "Speaking",
    desc: "Acclimatize students and develop their mindset for debating, structuring arguments, presenting facts, and anticipating counter-points.",
    color: "#4f46e5",
    bg: "rgba(79,70,229,0.1)",
    border: "rgba(79,70,229,0.2)",
    img: "images/debate.png",
    link: "debate/debate.html"
  }
];

const imgIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>`;

const list = document.getElementById('clubsList');

clubs.forEach((c, i) => {
  const row = document.createElement('div');
  row.className = 'club-row' + (i % 2 !== 0 ? ' flip' : '');
  row.style.cssText = `--cc:${c.color}; --cb:${c.bg}; --cbr:${c.border}`;

  // whole row is clickable
  row.style.cursor = 'pointer';
  row.addEventListener('click', () => window.location.href = c.link);

  row.innerHTML = `
    <div class="club-img-wrap">
      <img src="${c.img}" alt="${c.name} club photo"
           onload="this.nextElementSibling.style.display='none'"
           onerror="this.style.display='none'">
      <div class="img-placeholder">
        ${imgIcon}
        <span>${c.name}</span>
      </div>
    </div>
    <div class="club-info">
      <div class="club-category">${c.category}</div>
      <div class="club-name">${c.name}</div>
      <div class="club-desc">${c.desc}</div>
      <div class="club-footer">
        <a href="${c.link}" class="learn-btn">Learn more →</a>
      </div>
    </div>
  `;
  list.appendChild(row);
});

// ─── Scroll-triggered fade-in ──────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), idx * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.club-row').forEach(row => observer.observe(row));

// ─── Nav links to club pages ───────────────────────────
const navMap = {
  'TedEd':        'teded/teded.html',
  'Cybersonic':   'cybersonic/cybersonic.html',
  'Robotics':     'robotics/robotics.html',
  'Cookery':      'cookery/cookery.html',
  'Quizzarders':  'quizzarders/quizzarders.html',
  'Finance':      'finance/finance.html',
  'Theatre':        'drama/drama.html',
  'Eco':          'eco/eco.html',
  'Technocrates': 'technogrades/technogrades.html',
  'Debate':       'debate/debate.html',
};

document.querySelectorAll('.nav-links a').forEach(a => {
  const name = a.textContent.trim();
  if (navMap[name]) a.href = navMap[name];
});

// ─── CHATBOT LOGIC ────────────────────────────────────

const chatFab = document.querySelector('.chat-fab');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const heroCta = document.querySelector('.hero-cta');
const navChatBtn = document.querySelector('.nav-chat-btn');

let chatHistory = [];

function toggleChat() {
  chatPanel.classList.toggle('active');
  if (chatPanel.classList.contains('active')) {
    chatInput.focus();
  }
}

chatFab.addEventListener('click', toggleChat);
chatClose.addEventListener('click', toggleChat);
heroCta.addEventListener('click', toggleChat);
navChatBtn.addEventListener('click', toggleChat);

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  addMessage(text, 'user');

  // Loading state
  const loadingMsg = addMessage('...', 'bot typing');
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: chatHistory })
    });

    const data = await response.json();
    loadingMsg.remove();

    if (!response.ok || data.error) {
      throw new Error(data.error || `Server responded with ${response.status}`);
    }

    addMessage(data.response, 'bot');
    chatHistory.push({ role: 'user', content: text });
    chatHistory.push({ role: 'assistant', content: data.response });

    if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

  } catch (err) {
    if (loadingMsg) loadingMsg.remove();
    addMessage(`Sorry, I'm having trouble: ${err.message}`, 'bot');
    console.error(err);
  }

}

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msg;
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
