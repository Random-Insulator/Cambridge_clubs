// ─── CLUB ACTIVITIES DATA ────────────────────────────────────
const CLUB_ACTIVITIES = [
  {
    "title": "The Sink or Float Density Experiment",
    "tag": "PHYSICS LAB",
    "date": "2025-09-08",
    "desc": "Students investigated fluid mechanics and buoyant force principles using salinity gradients and variable density liquid columns.",
    "img": "../images/science_act1.jpg",
    "imgPos": "center center"
  },
  {
    "title": "Exploring the Science of Osmosis & Cell Walls",
    "tag": "BIOLOGY",
    "date": "2025-12-10",
    "desc": "Microscopic slide preparations tracking semi-permeable membrane solute flow, osmotic pressure, and plant cellular turgidity.",
    "img": "../images/science_act2.jpg",
    "imgPos": "center center"
  },
  {
    "title": "Mechanics on Wheels & Physics Photogame",
    "tag": "MECHANICS",
    "date": "2026-02-18",
    "desc": "Analyzing kinetic energy transfer, friction coefficients, and projectile trajectories with high-speed photo timing gates.",
    "img": "../images/science_act3.jpg",
    "imgPos": "center center"
  }
];

// ─── MATHEMATICAL SVG PARABOLIC WAVE MORPHING (60 FPS) ──────
(function initFluidWaves() {
  const wave1 = document.getElementById('heroWave1');
  const wave2 = document.getElementById('heroWave2');
  const wave3 = document.getElementById('heroWave3');
  if (!wave1 || !wave2 || !wave3) return;

  let time = 0;
  let isRunning = true;

  function renderWave() {
    if (!isRunning) return;
    time += 0.016;

    // Layer 1: Deep slow undulation
    const y1_0 = 500 + Math.sin(time * 0.7) * 35;
    const c1_x1 = 300 + Math.cos(time * 0.5) * 40;
    const c1_y1 = 430 + Math.sin(time * 0.8) * 45;
    const c1_x2 = 680 + Math.sin(time * 0.6) * 50;
    const c1_y2 = 570 + Math.cos(time * 0.7) * 35;
    const mid1_x = 960 + Math.cos(time * 0.45) * 40;
    const mid1_y = 470 + Math.sin(time * 0.75) * 40;
    const end1_y = 490 + Math.sin(time * 0.6) * 30;

    wave1.setAttribute(
      'd',
      `M0,${y1_0} C${c1_x1},${c1_y1} ${c1_x2},${c1_y2} ${mid1_x},${mid1_y} C1200,${mid1_y - 60} 1350,${end1_y + 30} 1440,${end1_y} L1440,900 L0,900 Z`
    );

    // Layer 2: Mid-tone dynamic parabolic curve
    const y2_0 = 600 + Math.cos(time * 0.85) * 30;
    const c2_x1 = 340 + Math.sin(time * 0.7) * 45;
    const c2_y1 = 530 + Math.cos(time * 0.95) * 35;
    const c2_x2 = 740 + Math.cos(time * 0.65) * 40;
    const c2_y2 = 660 + Math.sin(time * 0.85) * 40;
    const mid2_x = 1060 + Math.sin(time * 0.55) * 50;
    const mid2_y = 560 + Math.cos(time * 0.65) * 35;
    const end2_y = 610 + Math.cos(time * 0.75) * 25;

    wave2.setAttribute(
      'd',
      `M0,${y2_0} C${c2_x1},${c2_y1} ${c2_x2},${c2_y2} ${mid2_x},${mid2_y} C1240,${mid2_y - 40} 1360,${end2_y + 30} 1440,${end2_y} L1440,900 L0,900 Z`
    );

    // Layer 3: Foreground rhythmic wave
    const y3_0 = 700 + Math.sin(time * 1.05) * 25;
    const c3_x1 = 380 + Math.cos(time * 0.9) * 35;
    const c3_y1 = 640 + Math.sin(time * 1.1) * 30;
    const c3_x2 = 820 + Math.sin(time * 0.8) * 40;
    const c3_y2 = 750 + Math.cos(time * 0.95) * 30;
    const mid3_x = 1160 + Math.cos(time * 0.65) * 40;
    const mid3_y = 670 + Math.sin(time * 0.85) * 30;
    const end3_y = 720 + Math.sin(time * 1.0) * 20;

    wave3.setAttribute(
      'd',
      `M0,${y3_0} C${c3_x1},${c3_y1} ${c3_x2},${c3_y2} ${mid3_x},${mid3_y} C1300,${mid3_y - 20} 1390,${end3_y + 20} 1440,${end3_y} L1440,900 L0,900 Z`
    );

    requestAnimationFrame(renderWave);
  }

  requestAnimationFrame(renderWave);

  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
    if (isRunning) requestAnimationFrame(renderWave);
  });
})();

// ─── 3D PERSPECTIVE INTERACTIVE MOUSE PARALLAX ───────────────
(function init3dParallax() {
  const visualWrap = document.getElementById('heroVisualWrap');
  const card3d     = document.getElementById('hero3dCard');
  if (!visualWrap || !card3d) return;

  visualWrap.addEventListener('mousemove', (e) => {
    const rect = visualWrap.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotY = (x / (rect.width / 2)) * 14;
    const rotX = -(y / (rect.height / 2)) * 12;
    card3d.style.transform = `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(15px)`;
  });

  visualWrap.addEventListener('mouseleave', () => {
    card3d.style.transform = '';
  });
})();

// ─── ACTIVITIES RENDERER (Clean Editorial Cards) ─────────────
const scrollEl = document.getElementById('activitiesScroll');

function renderActivities() {
  if (!scrollEl) return;
  scrollEl.innerHTML = '';

  CLUB_ACTIVITIES.forEach((a, index) => {
    const card = document.createElement('div');
    card.className = 'v2-act-card';

    card.innerHTML = `
      <div class="v2-act-card-img">
        <img src="${a.img}" alt="${a.title}" style="object-position: ${a.imgPos || 'center center'};" loading="lazy" onerror="this.src='../images/Technocrates.jpg';">
      </div>
      <div class="v2-act-card-body">
        <div class="v2-act-card-glyph">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
          </svg>
        </div>
        <div class="v2-act-card-meta">
          <span class="v2-act-date-pill">${a.date}</span>
          <span class="v2-act-tag">${a.tag}</span>
        </div>
        <h3 class="v2-act-card-title">${a.title}</h3>
        <p class="v2-act-card-desc">${a.desc}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      const slides = CLUB_ACTIVITIES.map(item => ({
        img: item.img,
        title: item.title + ' (' + item.tag + ')'
      }));
      if (typeof window.openImageLightbox === 'function') {
        window.openImageLightbox(slides, index);
      }
    });

    scrollEl.appendChild(card);
  });
}

renderActivities();

// ─── HORIZONTAL SCROLL NAVIGATION ────────────────────────────
const actPrevBtn = document.getElementById('actPrevBtn');
const actNextBtn = document.getElementById('actNextBtn');

if (actPrevBtn && scrollEl) {
  actPrevBtn.addEventListener('click', () => {
    scrollEl.scrollBy({ left: -400, behavior: 'smooth' });
  });
}
if (actNextBtn && scrollEl) {
  actNextBtn.addEventListener('click', () => {
    scrollEl.scrollBy({ left: 400, behavior: 'smooth' });
  });
}

// ─── PARALLAX ON SCROLL FOR WAVE SECTION ──────────────────────
(function initScrollParallax() {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroSection = document.getElementById('heroSection');
        if (heroSection) {
          const heroH = heroSection.offsetHeight;
          if (scrollY <= heroH) {
            const ratio = scrollY / heroH;
            const heroWaves = document.getElementById('heroWaves');
            if (heroWaves) {
              heroWaves.style.transform = `translateY(${ratio * 30}px)`;
            }
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();
