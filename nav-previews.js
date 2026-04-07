(function() {
  const clubsData = {
    'TedEd': {
      tag: 'Speaking',
      img: 'images/teded.jpg',
      desc: 'Ideas worth spreading. Student-led talks on topics that matter to you.'
    },
    'Cybersonic': {
      tag: 'Technology',
      img: 'images/cybersonic.jpg',
      desc: 'Master the computing stack, from Python and AI to robust cybersecurity.'
    },
    'Robotics': {
      tag: 'Technology',
      img: 'images/robotics.jpg',
      desc: 'Build, program, and compete with robots. No experience needed — just curiosity.'
    },
    'Cookery': {
      tag: 'Life Skills',
      img: 'images/cookery.jpg',
      desc: 'Engaging platform to explore fireless cooking and sustainable practices.'
    },
    'Quizzarders': {
      tag: 'Academic',
      img: 'images/quizzarders.jpg',
      desc: 'Quiz champions in the making. Trivia, general knowledge, and competitions.'
    },
    'Finance': {
      tag: 'Finance',
      img: 'images/finance.jpg',
      desc: 'Stocks, budgeting, investing. Learn to manage money early.'
    },
    'Theatre': {
      tag: 'Arts',
      img: 'images/Theatre.jpg',
      desc: 'Stage performances, improv nights, and storytelling workshops.'
    },
    'Eco': {
      tag: 'Environment',
      img: 'images/eco.jpg',
      desc: 'Campus sustainability projects and climate action campaigns.'
    },
    'Technocrates': {
      tag: 'Academic',
      img: 'images/Technocrates.jpg',
      desc: 'Active innovators exploring scientific experimentation and discovery.'
    },
    'Debate': {
      tag: 'Speaking',
      img: 'images/debate.png',
      desc: 'Mindset for debating, structuring arguments, and presenting facts.'
    }
  };

  // Create preview card element
  const card = document.createElement('div');
  card.className = 'nav-preview-card';
  card.innerHTML = `
    <img class="nav-preview-img" src="" alt="">
    <div class="nav-preview-content">
      <div class="nav-preview-tag"></div>
      <div class="nav-preview-title"></div>
      <div class="nav-preview-desc"></div>
    </div>
  `;
  document.body.appendChild(card);

  const img = card.querySelector('.nav-preview-img');
  const tag = card.querySelector('.nav-preview-tag');
  const title = card.querySelector('.nav-preview-title');
  const desc = card.querySelector('.nav-preview-desc');

  let hideTimeout;

  // Detect if we are in a subfolder (club page)
  // All club pages are in a sub-directory, index is at root
  const pathPrefix = (window.location.pathname.split('/').filter(p => p).length > 1 || 
                     window.location.pathname.includes('/debate/') || 
                     window.location.pathname.includes('/robotics/') ||
                     window.location.pathname.includes('/cookery/')) ? '../' : '';
  
  // Alternative detection for local files (file://)
  const isLocalFileSub = window.location.href.split('/').slice(-2)[0] !== 'cambridge_clubs';
  const finalPrefix = (window.location.protocol === 'file:' ? (isLocalFileSub ? '../' : '') : pathPrefix);

  document.querySelectorAll('.nav-links a').forEach(link => {
    const clubName = link.textContent.trim();
    const data = clubsData[clubName];

    if (!data) return;

    link.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
      
      // Update content
      img.src = finalPrefix + data.img;
      tag.textContent = data.tag;
      title.textContent = clubName;
      desc.textContent = data.desc;

      // Position card
      const rect = link.getBoundingClientRect();
      const cardX = Math.max(20, rect.left + (rect.width / 2) - 110);
      card.style.left = `${cardX}px`;
      
      card.classList.add('visible');
    });

    link.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        card.classList.remove('visible');
      }, 100);
    });
  });

  // Keep visible when hovering card itself
  card.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
  card.addEventListener('mouseleave', () => {
    hideTimeout = setTimeout(() => {
      card.classList.remove('visible');
    }, 100);
  });

})();
