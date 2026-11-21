(function() {
  const clubsData = {
    'TedEd': {
      tag: 'Speaking',
      img: 'images/teded.jpg',
      desc: 'Ideas worth spreading. Student-led talks on topics that matter to you.'
    },
    'Robotics': {
      tag: 'Technology',
      img: 'images/robotics.jpg',
      desc: 'Build, program, and compete with robots. Hands-on microcontrollers and autonomous machines.'
    },
    'Cookery': {
      tag: 'Life Skills',
      img: 'images/cookery.jpg',
      desc: 'Master essential culinary techniques, explore global flavors, and learn fireless gourmet cooking.'
    },
    'Theatre': {
      tag: 'Arts',
      img: 'images/Theatre.jpg',
      desc: 'Stage performances, improv nights, voice projection, and dramatic storytelling workshops.'
    },
    'Eco': {
      tag: 'Environment',
      img: 'images/eco.jpg',
      desc: 'Campus sustainability projects, circular upcycling, and climate action campaigns.'
    },
    'Science': {
      tag: 'Science',
      img: 'images/Technocrates.jpg',
      desc: 'Hands-on empirical experimentation, physics apparatus testing, and natural law discovery.'
    },
    'Literary': {
      tag: 'Arts',
      img: 'images/literary.jpg',
      desc: 'Book circles, chapter reviews, and thoughtful group discussions on classic and world literature.'
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
  const pathDepth = window.location.pathname.split('/').filter(Boolean).length;
  const pathPrefix = (pathDepth > 1 || 
                     window.location.pathname.includes('/debate/') || 
                     window.location.pathname.includes('/literary/') || 
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
