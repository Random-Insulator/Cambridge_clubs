// ─── CLUB THEME COLOR ─────────────────────────────────
document.documentElement.style.setProperty('--club-color',  '#d97706');
document.documentElement.style.setProperty('--club-bg',     'rgba(217,119,6,0.1)');
document.documentElement.style.setProperty('--club-border', 'rgba(217,119,6,0.2)');

// ─── CAROUSEL & ACTIVITIES — loaded from API ──────────
const API_BASE = '';
const CLUB_ID  = 'literary';

const phIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;

const track  = document.getElementById('carouselTrack');
const dotsEl = document.getElementById('carouselDots');
let current     = 0;
let totalSlides = 0;

function buildCarousel(slides) {
  const flatSlides = [];
  slides.forEach(s => {
    const imgList = (s.images && s.images.length) ? s.images : [s.img];
    imgList.forEach((imgUrl, idx) => {
      flatSlides.push({
        img: imgUrl,
        title: s.images && s.images.length > 1 ? `${s.title} (${idx + 1}/${s.images.length})` : s.title
      });
    });
  });

  totalSlides = flatSlides.length;
  track.innerHTML  = '';
  dotsEl.innerHTML = '';
  if (!flatSlides.length) {
    const ph = document.createElement('div');
    ph.className = 'carousel-slide';
    ph.innerHTML = `<div class="slide-ph">${phIcon}<span>No photos yet</span></div>`;
    track.appendChild(ph);
    return;
  }
  flatSlides.forEach((s, i) => {
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
  if (typeof window.initCarouselLightbox === 'function') window.initCarouselLightbox(flatSlides);
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

let isPaused = false;
const carouselContainer = document.querySelector('.carousel-wrap');
if (carouselContainer) {
  carouselContainer.addEventListener('mouseenter', () => isPaused = true);
  carouselContainer.addEventListener('mouseleave', () => isPaused = false);
}
setInterval(() => { if (totalSlides > 1 && !isPaused) goTo(current + 1); }, 2500);


// ─── SCROLL ANIMATIONS ────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 100);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

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
      const imagesArr = (a.images && a.images.length) ? a.images : [a.img];

      const imgHtml = imagesArr.length > 1
        ? `<div class="activity-img" style="display:grid; grid-template-columns: repeat(${Math.min(imagesArr.length, 3)}, 1fr); gap:3px;">
            ${imagesArr.map(url => `<img src="${API_BASE}${url}" alt="${a.title}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">`).join('')}
           </div>`
        : `<div class="activity-img">
            <img src="${API_BASE}${a.img}" alt="${a.title}"
                 onload="this.nextElementSibling.style.display='none'"
                 onerror="this.style.display='none'">
            <div class="act-ph">${phIcon}</div>
           </div>`;

      card.innerHTML = `
        ${imgHtml}
        <div>
          <div class="activity-meta">
            <span class="activity-date">${a.date}</span>
            <span class="activity-tag">${a.tag}</span>
            ${imagesArr.length > 1 ? `<span class="activity-tag" style="background:var(--club-bg); color:var(--club-color);">🖼️ ${imagesArr.length} Photos</span>` : ''}
          </div>
          <div class="activity-title">${a.title}</div>
          <div class="activity-desc">${a.desc}</div>
        </div>`;
      actList.appendChild(card);
      
      const cardImgs = card.querySelectorAll('.activity-img img');
      cardImgs.forEach((imgEl, idx) => {
        imgEl.style.cursor = 'zoom-in';
        imgEl.onclick = (e) => {
          e.stopPropagation();
          const slides = imagesArr.map((url, i) => ({
            img: `${API_BASE}${url}`,
            title: imagesArr.length > 1 ? `${a.title} (${i + 1}/${imagesArr.length})` : a.title
          }));
          if (typeof window.openImageLightbox === 'function') {
            window.openImageLightbox(slides, idx);
          }
        };
      });

      observer.observe(card);
    });
  } catch {
    buildCarousel([]);
    actList.innerHTML = '<p style="color:#7a7a9a;font-size:.9rem;padding:16px 0">Could not load activities (is the server running?).</p>';
  }
}
loadActivities();
