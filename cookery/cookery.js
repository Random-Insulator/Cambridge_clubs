// ─── CLUB ACTIVITIES DATA ────────────────────────────────────
const CLUB_ACTIVITIES = [
  {
    "title": "Nutrition Month Culinary Showcase",
    "tag": "EXHIBITION",
    "date": "2025-07-12",
    "desc": "Students crafted wholesome macro-balanced meals emphasizing organic local ingredients, mindful seasoning, and modern culinary design.",
    "img": "../images/cookery_act1.jpg",
    "imgPos": "center 25%"
  },
  {
    "title": "The Art of Professional Plating",
    "tag": "MASTERCLASS",
    "date": "2025-11-04",
    "desc": "An intensive workshop dissecting color harmony, negative space, sauce piping, and micro-green garnishing techniques on ceramic plates.",
    "img": "../images/cookery_act2.jpg",
    "imgPos": "center 20%"
  },
  {
    "title": "Fireless Gourmet Dishes Competition",
    "tag": "WORKSHOP",
    "date": "2026-02-14",
    "desc": "Teams engineered intricate cold delicacies, tartines, and infused parfaits without heat sources, judged on texture, presentation, and flavor profile.",
    "img": "../images/cookery_act3.jpg",
    "imgPos": "center center"
  }
];

// ─── MATHEMATICAL SVG PARABOLIC WAVE MORPHING (Serene Flow) ──
(function initFluidWaves() {
  const wave1 = document.getElementById('heroWave1');
  const wave2 = document.getElementById('heroWave2');
  const wave3 = document.getElementById('heroWave3');
  const wave4 = document.getElementById('heroWave4');
  if (!wave1 || !wave2 || !wave3) return;

  let time = 0;
  let isRunning = true;

  function renderWave() {
    if (!isRunning) return;
    // Ultra-slow, serene pacing (16x slower than before)
    time += 0.0012;

    // Layer 1: Deep slow undulation (~35s period, gentle 10px breathing)
    const y1_0 = 510 + Math.sin(time * 0.18) * 10;
    const c1_x1 = 300 + Math.cos(time * 0.12) * 12;
    const c1_y1 = 430 + Math.sin(time * 0.20) * 12;
    const c1_x2 = 680 + Math.sin(time * 0.15) * 14;
    const c1_y2 = 570 + Math.cos(time * 0.18) * 10;
    const mid1_x = 960 + Math.cos(time * 0.14) * 12;
    const mid1_y = 470 + Math.sin(time * 0.22) * 12;
    const end1_y = 490 + Math.sin(time * 0.16) * 8;

    wave1.setAttribute(
      'd',
      `M0,${y1_0} C${c1_x1},${c1_y1} ${c1_x2},${c1_y2} ${mid1_x},${mid1_y} C1200,${mid1_y - 60} 1350,${end1_y + 30} 1440,${end1_y} L1440,900 L0,900 Z`
    );

    // Layer 2: Mid-tone dynamic parabolic curve (~40s period, gentle 10px breathing)
    const y2_0 = 610 + Math.cos(time * 0.16) * 10;
    const c2_x1 = 340 + Math.sin(time * 0.14) * 12;
    const c2_y1 = 540 + Math.cos(time * 0.22) * 10;
    const c2_x2 = 740 + Math.cos(time * 0.15) * 12;
    const c2_y2 = 660 + Math.sin(time * 0.19) * 12;
    const mid2_x = 1060 + Math.sin(time * 0.13) * 14;
    const mid2_y = 570 + Math.cos(time * 0.17) * 10;
    const end2_y = 610 + Math.cos(time * 0.20) * 8;

    wave2.setAttribute(
      'd',
      `M0,${y2_0} C${c2_x1},${c2_y1} ${c2_x2},${c2_y2} ${mid2_x},${mid2_y} C1240,${mid2_y - 40} 1360,${end2_y + 30} 1440,${end2_y} L1440,900 L0,900 Z`
    );

    // Layer 3: Foreground rhythmic wave (~30s period, gentle 8px breathing)
    const y3_0 = 710 + Math.sin(time * 0.22) * 8;
    const c3_x1 = 380 + Math.cos(time * 0.18) * 10;
    const c3_y1 = 650 + Math.sin(time * 0.24) * 8;
    const c3_x2 = 820 + Math.sin(time * 0.16) * 10;
    const c3_y2 = 750 + Math.cos(time * 0.21) * 8;
    const mid3_x = 1160 + Math.cos(time * 0.15) * 10;
    const mid3_y = 670 + Math.sin(time * 0.20) * 8;
    const end3_y = 720 + Math.sin(time * 0.23) * 6;

    wave3.setAttribute(
      'd',
      `M0,${y3_0} C${c3_x1},${c3_y1} ${c3_x2},${c3_y2} ${mid3_x},${mid3_y} C1300,${mid3_y - 20} 1390,${end3_y + 20} 1440,${end3_y} L1440,900 L0,900 Z`
    );

    // Layer 4 (if present): Transition into Activities section
    if (wave4) {
      const y4_0 = 760 + Math.sin(time * 0.15) * 6;
      const c4_x1 = 400 + Math.cos(time * 0.14) * 8;
      const c4_y1 = 700 + Math.sin(time * 0.18) * 6;
      const c4_x2 = 840 + Math.sin(time * 0.12) * 8;
      const c4_y2 = 800 + Math.cos(time * 0.16) * 6;
      const mid4_x = 1180 + Math.cos(time * 0.13) * 8;
      const mid4_y = 720 + Math.sin(time * 0.17) * 6;
      const end4_y = 770 + Math.sin(time * 0.15) * 5;

      wave4.setAttribute(
        'd',
        `M0,${y4_0} C${c4_x1},${c4_y1} ${c4_x2},${c4_y2} ${mid4_x},${mid4_y} C1300,${mid4_y - 20} 1390,${end4_y + 20} 1440,${end4_y} L1440,900 L0,900 Z`
      );
    }

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
        <img src="${a.img}" alt="${a.title}" style="object-position: ${a.imgPos || 'center center'};" loading="lazy" onerror="this.src='../images/cookery.jpg';">
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
