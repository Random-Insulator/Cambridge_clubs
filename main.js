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
      desc: "Build, program, and compete with robots. No experience needed — just curiosity and a willingness to set new milestones.",
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
    {
      name: "Literary",
      formattedName: "Liter<em>ary.</em>",
      category: "Arts",
      desc: "Sanctuary for passionate readers and book lovers. Engage in book circles, novel analysis, chapter reviews, and thoughtful group discussions.",
      color: "#d97706",
      bg: "rgba(217,119,6,0.1)",
      border: "rgba(217,119,6,0.2)",
      img: "images/literary.jpg",
      link: "literary/literary.html"
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
    'Literary': 'literary/literary.html',
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
  (function() {
    if (!document.getElementById('chatPanel')) {
      const chatHtml = `
        <div class="chat-panel" id="chatPanel">
          <div class="chat-header">
            <div class="chat-header-info">
              <div class="chat-header-title"><span style="font-size:18px; margin-right:4px;">✨</span> Club Buddy</div>
              <div class="chat-header-status">Online</div>
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
    let _chatLocked = false;

    // ── Open / Close / Toggle ─────────────────────────────
    function openChat() {
      if (!chatPanel) return;
      chatPanel.classList.add('active');
      if (chatInput && !_chatLocked) chatInput.focus();
      if (chatFab) {
        chatFab.style.animation = 'none';
        chatFab.style.webkitAnimation = 'none';
        setTimeout(() => { chatFab.style.bottom = '70px'; }, 50);
        chatFab.style.transform = 'none';
        chatFab.style.boxShadow = 'none';
      }
      const chatPulse = document.querySelector('.chat-pulse');
      if (chatPulse) chatPulse.style.display = 'none';
    }

    function closeChat() {
      if (!chatPanel) return;
      chatPanel.classList.remove('active');
      if (chatFab) {
        chatFab.style.bottom = '24px';
        setTimeout(() => {
          chatFab.style.animation = 'mascotBob 3s ease-in-out infinite';
          chatFab.style.webkitAnimation = 'mascotBob 3s ease-in-out infinite';
        }, 50);
        chatFab.style.transform = 'none';
        chatFab.style.boxShadow = '';
      }
      const chatPulse = document.querySelector('.chat-pulse');
      if (chatPulse) chatPulse.style.display = '';
    }

    function toggleChat() {
      if (!chatPanel) return;
      chatPanel.classList.contains('active') ? closeChat() : openChat();
    }

    if (chatFab)   chatFab.addEventListener('click', toggleChat);
    if (chatClose) chatClose.addEventListener('click', closeChat);
    if (heroCta)   heroCta.addEventListener('click', openChat);
    navChatBtns.forEach(btn => btn.addEventListener('click', openChat));

    // ── Markdown Formatter ────────────────────────────────
    function formatMarkdown(text) {
      if (!text) return '';
      let safe = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      
      // **bold** or __bold__ -> <strong>bold</strong>
      safe = safe.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
      // *italic* or _italic_ -> <em>italic</em>
      safe = safe.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
      // line breaks -> <br>
      safe = safe.replace(/\n/g, '<br>');
      
      return safe;
    }

    // ── Recommendation detection ──────────────────────────
    function _isRecommendation(text) {
      if (!text) return false;
      const t = text.toLowerCase();
      const clubNames = ['robotics','cybersonic','technocrates','technogrades','finance','eco','teded','ted ed','theatre','theater','drama','quizzaders','quizzarders','cookery','debate','literary'];
      const explicitPhrases = [
        'i recommend',
        'my recommendation',
        'top recommendation',
        'strongly recommend',
        'would recommend',
        'highly recommend',
        'perfect club for you',
        'ideal club for you',
        'best club for you',
        'club for you is',
        'you should join the',
        'i suggest you join',
        'the right club for you is',
        'greatest fit for you is'
      ];
      const hasClub = clubNames.some(c => t.includes(c));
      const hasExplicitPhrase = explicitPhrases.some(p => t.includes(p));
      return hasClub && hasExplicitPhrase;
    }

    function _lockChat() {
      _chatLocked = true;
      const inputArea = document.querySelector('.chat-input-area');
      if (inputArea) inputArea.classList.add('locked');
      if (chatInput) { 
        chatInput.value = '';
        chatInput.disabled = true; 
        chatInput.readOnly = true;
        chatInput.placeholder = 'Chat ended — club recommended!'; 
        chatInput.blur();
      }
      if (chatSend) { 
        chatSend.disabled = true; 
        chatSend.style.opacity = '0.3'; 
        chatSend.style.cursor = 'not-allowed';
        chatSend.style.pointerEvents = 'none';
      }
      if (chatFab) { 
        chatFab.style.opacity = '0.7'; 
        chatFab.title = 'Chat session ended'; 
      }
    }

    // ── Send message ──────────────────────────────────────
    async function sendMessage() {
      if (_chatLocked) return;
      const text = chatInput.value.trim();
      if (!text) return;

      // ── English Language Pre-Check ──
      const nonEnglishScriptRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0E00-\u0E7F\u1000-\u109F\u1100-\u11FF\u3040-\u309F\u30A0-\u30FF\u3130-\u318F\u4E00-\u9FFF\uAC00-\uD7AF\u0400-\u04FF]/;
      if (nonEnglishScriptRegex.test(text)) {
        chatInput.value = '';
        addMessage(text, 'user');
        addMessage("I can only understand and respond in English! Please write your message in English. 🌐", 'bot');
        return;
      }

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

        const isRec = data.isFinal || _isRecommendation(data.response);

        addMessage(data.response, 'bot');
        chatHistory.push({ role: 'user', content: text });
        chatHistory.push({ role: 'assistant', content: data.response });
        if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

        // ── End conversation immediately after club recommendation is given ──
        if (isRec) {
          _lockChat();
          setTimeout(() => {
            addMessage(
              "🎉 That's my top recommendation! This chat session is now complete — feel free to explore the club page above and get involved! 👋",
              'bot'
            );
          }, 400);
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
      if (type.includes('typing')) {
        msg.textContent = text;
      } else {
        msg.innerHTML = formatMarkdown(text);
      }
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return msg;
    }

    if (chatSend) chatSend.addEventListener('click', sendMessage);
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (_chatLocked) {
          e.preventDefault();
          return false;
        }
        if (e.key === 'Enter') sendMessage();
      });
    }
  })();
})();

// ─── CAROUSEL & ACTIVITY LIGHTBOX ─────────────────────
window.openImageLightbox = function(slides, initialIdx = 0) {
  if (!slides || !slides.length) return;
  const list = slides.map(s => typeof s === 'string' ? { img: s, title: '' } : s);

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
  let lbIndex    = initialIdx;

  function showSlide(idx) {
    lbIndex = (idx + list.length) % list.length;
    const s = list[lbIndex];
    lbImg.src = s.img;
    lbImg.alt = s.title || '';
    if (s.title) {
      lbCap.textContent = s.title;
      lbCap.style.display = 'block';
    } else {
      lbCap.style.display = 'none';
    }
    lbCount.textContent = list.length > 1 ? `${lbIndex + 1} / ${list.length}` : '';
    lbPrev.style.display = list.length > 1 ? 'flex' : 'none';
    lbNext.style.display = list.length > 1 ? 'flex' : 'none';
  }

  function closeLb() {
    overlay.classList.remove('lb-open');
    document.body.style.overflow = '';
  }

  const newClose = lbClose.cloneNode(true);
  const newPrev  = lbPrev.cloneNode(true);
  const newNext  = lbNext.cloneNode(true);
  lbClose.parentNode.replaceChild(newClose, lbClose);
  lbPrev.parentNode.replaceChild(newPrev, lbPrev);
  lbNext.parentNode.replaceChild(newNext, lbNext);

  newClose.addEventListener('click', closeLb);
  newPrev.addEventListener('click', () => showSlide(lbIndex - 1));
  newNext.addEventListener('click', () => showSlide(lbIndex + 1));

  overlay.onclick = (e) => { if (e.target === overlay) closeLb(); };

  document.removeEventListener('keydown', window._lbKeyHandler);
  window._lbKeyHandler = (e) => {
    if (!overlay.classList.contains('lb-open')) return;
    if (e.key === 'Escape')      closeLb();
    if (e.key === 'ArrowLeft' && list.length > 1)  showSlide(lbIndex - 1);
    if (e.key === 'ArrowRight' && list.length > 1) showSlide(lbIndex + 1);
  };
  document.addEventListener('keydown', window._lbKeyHandler);

  showSlide(lbIndex);
  overlay.classList.add('lb-open');
  document.body.style.overflow = 'hidden';
};

window.initCarouselLightbox = function(slides) {
  if (!slides || !slides.length) return;
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  track.querySelectorAll('.carousel-slide img').forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.onclick = () => window.openImageLightbox(slides, i);
  });
};

