(() => {
  const clubs = [
    {
      name: "TedEd",
      formattedName: "Ted<em>Ed.</em>",
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
      formattedName: "Cyber<em>sonic.</em>",
      category: "Technology",
      desc: "Cybersonic Club transforms students from digital consumers into sophisticated tech architects by mastering the full computing stack, from Python and AI to robust cybersecurity.",
      color: "#7c6ef7",
      bg: "rgba(124,110,247,0.1)",
      border: "rgba(124,110,247,0.2)",
      img: "images/cybersonic.jpg",
      link: "cybersonic/cybersonic.html"
    },
    {
      name: "Robotics",
      formattedName: "Robot<em>ics.</em>",
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
      formattedName: "Cook<em>ery.</em>",
      category: "Life Skills",
      desc: "Provides an engaging platform for students to explore fireless cooking, sustainable practices, and healthy dishes in a fun and creative environment.",
      color: "#df4615",
      bg: "rgba(223,70,21,0.1)",
      border: "rgba(223,70,21,0.2)",
      img: "images/cookery.jpg",
      link: "cookery/cookery.html"
    },
    {
      name: "Quizzaders",
      formattedName: "Quiz<em>zaders.</em>",
      category: "Academic",
      desc: "Quiz champions in the making. Trivia, general knowledge, and inter-school competitions.",
      color: "#22c97a",
      bg: "rgba(34,201,122,0.1)",
      border: "rgba(34,201,122,0.2)",
      img: "images/quizzarders.jpg",
      link: "quizzarders/quizzarders.html"
    },
    {
      name: "Finance",
      formattedName: "Fin<em>ance.</em>",
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
      formattedName: "Thea<em>tre.</em>",
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
      formattedName: "Eco<em>.</em>",
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
      formattedName: "Techno<em>crates.</em>",
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
      formattedName: "De<em>bate.</em>",
      category: "Speaking",
      desc: "Acclimatize students and develop their mindset for debating, structuring arguments, presenting facts, and anticipating counter-points.",
      color: "#4f46e5",
      bg: "rgba(79,70,229,0.1)",
      border: "rgba(79,70,229,0.2)",
      img: "images/debate.png",
      link: "debate/debate.html"
    },
  ];

  const imgIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>`;

  const list = document.getElementById('clubsList');

  if (list) {
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
        <div class="club-name">${c.formattedName}</div>
        <div class="club-desc">${c.desc}</div>
        <div class="club-footer">
          <a href="${c.link}" class="learn-btn">Learn more →</a>
        </div>
      </div>
    `;
      list.appendChild(row);
    });
  }

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
    'TedEd': 'teded/teded.html',
    'Cybersonic': 'cybersonic/cybersonic.html',
    'Robotics': 'robotics/robotics.html',
    'Cookery': 'cookery/cookery.html',
    'Quizzaders': 'quizzarders/quizzarders.html',
    'Finance': 'finance/finance.html',
    'Theatre': 'drama/drama.html',
    'Eco': 'eco/eco.html',
    'Technocrates': 'technogrades/technogrades.html',
    'Debate': 'debate/debate.html',
  };

  // Detect if we are in a subdirectory (club page) vs root (index)
  const _pathDepth = window.location.pathname.split('/').filter(Boolean).length;
  const _isSubPage = _pathDepth > 1 || (window.location.protocol === 'file:' && window.location.href.includes('/cambridge_clubs/') && !window.location.href.endsWith('/cambridge_clubs/index.html') && !window.location.href.endsWith('/cambridge_clubs/'));
  const _prefix = _isSubPage ? '../' : '';

  document.querySelectorAll('.nav-links a').forEach(a => {
    const name = a.textContent.trim();
    if (navMap[name]) a.href = _prefix + navMap[name];
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
  let _postRecoBonusCount = 0;  // how many extra chats after club recommendation
  const MAX_BONUS_CHATS = 2;    // close after this many post-recommendation exchanges
  let _chatLocked = false;

  // Detects if the bot's message is a final club recommendation (turn 4)
  function _isRecommendation(text) {
    const t = text.toLowerCase();
    const clubNames = ['robotics','cybersonic','technocrates','finance','eco','teded','ted ed','theatre','theater','quizzaders','cookery','debate'];
    const recommendWords = ['recommend','join','perfect for you','check out','suggest','go for','i think you','you should'];
    return clubNames.some(c => t.includes(c)) && recommendWords.some(w => t.includes(w));
  }

  function _lockChat() {
    _chatLocked = true;
    if (chatInput)  { chatInput.disabled = true; chatInput.placeholder = 'Chat ended for this session'; }
    if (chatSend)   { chatSend.disabled = true; chatSend.style.opacity = '0.4'; }
    // Dim the FAB so people know it's done
    if (chatFab)    { chatFab.style.opacity = '0.5'; chatFab.title = 'Chat session ended'; }
  }

  async function sendMessage() {
    if (_chatLocked) return;
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

      // ── Post-recommendation session limiter ──────────────
      // If the bot just gave a recommendation, start tracking bonus chats
      if (_isRecommendation(data.response)) {
        _postRecoBonusCount = 0; // reset / mark we're in bonus territory
      } else if (chatHistory.length >= 8) {
        // We're past the 4-turn recommendation phase — count bonus exchanges
        _postRecoBonusCount++;
        if (_postRecoBonusCount >= MAX_BONUS_CHATS) {
          setTimeout(() => {
            addMessage(
              "Alright, that's a wrap from me! 🎉 You've got everything you need — go check out the club and show them what you've got. See you around! 👋",
              'bot'
            );
            _lockChat();
          }, 800);
        }
      }

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
})();

// ─── CAROUSEL LIGHTBOX ────────────────────────────────
// Called by each club's buildCarousel() after slides are ready.
// slides: array of { img, title } as used by buildCarousel.
window.initCarouselLightbox = function(slides) {
  if (!slides || !slides.length) return;

  // Build overlay once
  if (!document.getElementById('lightbox-overlay')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="lightbox-overlay" role="dialog" aria-modal="true" aria-label="Image viewer">
        <div id="lb-counter"></div>
        <button id="lb-close" title="Close (Esc)">✕</button>
        <button class="lb-nav" id="lb-prev" title="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <img id="lb-img" src="" alt="">
        <button class="lb-nav" id="lb-next" title="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <div id="lb-caption"></div>
      </div>
    `);
  }

  const overlay  = document.getElementById('lightbox-overlay');
  const lbImg    = document.getElementById('lb-img');
  const lbCap    = document.getElementById('lb-caption');
  const lbCount  = document.getElementById('lb-counter');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');
  let lbIndex    = 0;

  function showSlide(idx) {
    lbIndex = (idx + slides.length) % slides.length;
    const s = slides[lbIndex];
    lbImg.src = s.img;
    lbImg.alt = s.title || '';
    lbCap.textContent = s.title || '';
    lbCount.textContent = `${lbIndex + 1} / ${slides.length}`;
  }

  function openLightbox(idx) {
    showSlide(idx);
    overlay.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('lb-open');
    document.body.style.overflow = '';
  }

  // Wire up controls (replace old listeners by cloning nodes)
  [lbClose, lbPrev, lbNext].forEach(el => {
    const clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el);
  });
  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', () => showSlide(lbIndex - 1));
  document.getElementById('lb-next').addEventListener('click', () => showSlide(lbIndex + 1));

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });

  // Keyboard nav
  document.removeEventListener('keydown', window._lbKeyHandler);
  window._lbKeyHandler = (e) => {
    if (!overlay.classList.contains('lb-open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showSlide(lbIndex - 1);
    if (e.key === 'ArrowRight')  showSlide(lbIndex + 1);
  };
  document.addEventListener('keydown', window._lbKeyHandler);

  // Attach click handlers to carousel slide images
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  track.querySelectorAll('.carousel-slide img').forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
  });
};

