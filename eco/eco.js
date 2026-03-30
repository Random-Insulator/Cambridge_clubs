// ─── CLUB THEME COLOR ─────────────────────────────────
document.documentElement.style.setProperty('--club-color',  '#65c948');
document.documentElement.style.setProperty('--club-bg',     'rgba(101,201,72,0.1)');
document.documentElement.style.setProperty('--club-border', 'rgba(101,201,72,0.2)');

// ─── CAROUSEL & ACTIVITIES — loaded from API ──────────
const API_BASE = '';
const CLUB_ID  = 'eco';

const phIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="#65c948" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;

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
  track.style.transform = `translateX(calc(-${current} * (560px + 16px)))`;
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

// ─── MEMBERS ──────────────────────────────────────────
const members = [
  { name: "Aanya Sharma",    initials: "AS" },
  { name: "James Okafor",    initials: "JO" },
  { name: "Priya Nair",      initials: "PN" },
  { name: "Luca Bianchi",    initials: "LB" },
  { name: "Sofia Al-Hassan", initials: "SA" },
  { name: "Ethan Park",      initials: "EP" },
];

const membersList = document.getElementById('membersList');
members.forEach(m => {
  const row = document.createElement('div');
  row.className = 'member-row';
  row.innerHTML = `<div class="member-avatar">${m.initials}</div><div class="member-name">${m.name}</div>`;
  membersList.appendChild(row);
});

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
