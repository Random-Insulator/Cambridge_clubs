// ─── CLUB THEME COLOR ─────────────────────────────────
document.documentElement.style.setProperty('--club-color',  '#d946b0');
document.documentElement.style.setProperty('--club-bg',     'rgba(217,70,176,0.1)');
document.documentElement.style.setProperty('--club-border', 'rgba(217,70,176,0.2)');

// ─── CAROUSEL & ACTIVITIES — loaded from API ──────────
const API_BASE = '';
const CLUB_ID  = 'Theatre';

const phIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="#d946b0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;

const track  = document.getElementById('carouselTrack');
const dotsEl = document.getElementById('carouselDots');
let current     = 0;
let totalSlides = 0;

function buildCarousel(slides) {
  totalSlides = slides.length;
  track.innerHTML  = '';
  dotsEl.innerHTML = '';
  if (!slides.length) {
    const ph = document.createElement('div');
    ph.className = 'carousel-slide';
    ph.innerHTML = `<div class="slide-ph">${phIcon}<span>No photos yet</span></div>`;
    track.appendChild(ph);
    return;
  }
  slides.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `
      <img src="${API_BASE}${s.img}" alt="${s.title}"
           onload="this.nextElementSibling.style.display='none'"
           onerror="this.style.display='none'">
      <div class="slide-ph">${phIcon}<span>Photo ${i + 1}</span></div>
      <div class="slide-label">${s.title}</div>`;
    track.appendChild(slide);
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });
}

function goTo(idx) {
  current = (idx + totalSlides) % totalSlides;
  const slide = track.querySelector('.carousel-slide');
  if (slide) {
    track.style.transform = `translateX(-${current * (slide.offsetWidth + 16)}px)`;
  }
  document.querySelectorAll('.carousel-dots span')
    .forEach((d, i) => d.classList.toggle('active', i === current));
}

document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));
setInterval(() => { if (totalSlides > 1) goTo(current + 1); }, 3000);

// ─── RECENT ACTIVITIES — fetched from API ─────────────
const actList = document.getElementById('activitiesList');

async function loadActivities() {
  try {
    const res  = await fetch(`${API_BASE}/api/activities/${CLUB_ID}`);
    const data = await res.json();
    buildCarousel(data.slice(0, 5));
    actList.innerHTML = '';
    if (!data.length) {
      actList.innerHTML = '<p style="color:#7a7a9a;font-size:.9rem;padding:16px 0">No activities posted yet.</p>';
      return;
    }
    data.forEach(a => {
      const card = document.createElement('div');
      card.className = 'activity-card';
      card.innerHTML = `
        <div class="activity-img">
          <img src="${API_BASE}${a.img}" alt="${a.title}"
               onload="this.nextElementSibling.style.display='none'"
               onerror="this.style.display='none'">
          <div class="act-ph">${phIcon}</div>
        </div>
        <div>
          <div class="activity-meta">
            <span class="activity-date">${a.date}</span>
            <span class="activity-tag">${a.tag}</span>
          </div>
          <div class="activity-title">${a.title}</div>
          <div class="activity-desc">${a.desc}</div>
        </div>`;
      actList.appendChild(card);
      observer.observe(card);
    });
  } catch {
    buildCarousel([]);
    actList.innerHTML = '<p style="color:#7a7a9a;font-size:.9rem;padding:16px 0">Could not load activities (is the server running?).</p>';
  }
}
loadActivities();

// ─── SCROLL ANIMATIONS ────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 100);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.activity-card').forEach(c => observer.observe(c));

// ─── CHATBOT LOGIC ────────────────────────────────────
(function() {
  if (!document.getElementById('chatPanel')) {
    const chatHtml = `
      <div class="chat-panel" id="chatPanel">
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-header-title">Club Finder AI</div>
            <div class="chat-header-status">online</div>
          </div>
          <button class="chat-close" id="chatClose">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="msg bot">
            Hello! I'm here to help you find the perfect club. What are your hobbies or interests?
          </div>
        </div>
        <div class="chat-input-area">
          <input type="text" id="chatInput" placeholder="Type your message..." autocomplete="off">
          <button id="chatSend">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHtml);
  }

  const chatFab = document.querySelector('.chat-fab');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');
  const heroCta = document.querySelector('.hero-cta');
  const navChatBtns = document.querySelectorAll('.nav-chat-btn');

  let chatHistory = [];

  function toggleChat() {
    chatPanel.classList.toggle('active');
    if (chatPanel.classList.contains('active')) {
      chatInput.focus();
    }
  }

  if (chatFab) chatFab.addEventListener('click', toggleChat);
  if (chatClose) chatClose.addEventListener('click', toggleChat);
  if (heroCta) heroCta.addEventListener('click', toggleChat);
  navChatBtns.forEach(btn => btn.addEventListener('click', toggleChat));

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    addMessage(text, 'user');
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

  if (chatSend) chatSend.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
})();
