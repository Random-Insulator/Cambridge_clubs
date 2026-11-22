// ─── AARDVARK-STYLE ORGANIC PAGE TRANSITIONS & SCROLL ANIMATIONS ───────────
// Fluid parabolic wave curtain that sweeps across the screen on link clicks
// and glides away on page load, themed to the target club's color.
// Plus dynamic IntersectionObserver scroll animations for cards and sections.

(function () {
  'use strict';

  // Signature theme colors for each club
  const CLUB_THEMES = {
    'teded': '#e8504a',
    'robotics': '#2563eb',
    'cookery': '#df4615',
    'theatre': '#d946b0',
    'drama': '#d946b0',
    'eco': '#16a34a',
    'science': '#0284c7',
    'technogrades': '#0284c7',
    'technocrates': '#0284c7',
    'literary': '#b45309',
    'home': '#5A390C',
    'index': '#5A390C',
    'default': '#111111'
  };

  function getThemeColor(url, text) {
    const combined = ((url || '') + ' ' + (text || '')).toLowerCase();
    for (const [key, color] of Object.entries(CLUB_THEMES)) {
      if (combined.includes(key)) return color;
    }
    return CLUB_THEMES.default;
  }

  // Create & inject transition curtain
  function createCurtain() {
    if (document.getElementById('v2PageTransition')) return;

    const curtain = document.createElement('div');
    curtain.id = 'v2PageTransition';
    curtain.className = 'v2-page-transition';
    curtain.setAttribute('aria-hidden', 'true');

    curtain.innerHTML = `
      <div class="v2-trans-crest">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
          <path class="v2-trans-crest-path" d="M0,220 C360,60 1080,60 1440,220 L1440,220 L0,220 Z"/>
        </svg>
      </div>
      <div class="v2-trans-fill">
        <div class="v2-trans-center">
          <div class="v2-trans-spinner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div class="v2-trans-title">CCWS <span class="v2-trans-accent">Clubs</span></div>
          <div class="v2-trans-pill" id="v2TransPill">Exploring...</div>
        </div>
      </div>
      <div class="v2-trans-trough">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
          <path class="v2-trans-trough-path" d="M0,0 C360,160 1080,160 1440,0 L1440,0 L0,0 Z"/>
        </svg>
      </div>
    `;

    document.body.appendChild(curtain);

    // Initial page entrance reveal:
    // The curtain sweeps away upwards to reveal the new page
    requestAnimationFrame(() => {
      curtain.classList.add('v2-trans-reveal');
      setTimeout(() => {
        curtain.classList.remove('v2-trans-reveal', 'v2-trans-active');
        curtain.style.display = 'none';
      }, 550);
    });
  }

  // Intercept local link clicks for smooth organic transitions
  function attachLinkInterceptors() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Ignore hash links, external links, mailto, javascript, new tabs
      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        link.target === '_blank' ||
        link.hasAttribute('download') ||
        e.metaKey || e.ctrlKey || e.shiftKey
      ) {
        return;
      }

      // Check if it's an internal site navigation
      const isInternal = !href.includes('://') || href.includes(window.location.host);
      if (!isInternal) return;

      // Prevent immediate jump
      e.preventDefault();

      const curtain = document.getElementById('v2PageTransition');
      if (!curtain) {
        window.location.href = href;
        return;
      }

      const color = getThemeColor(href, link.textContent);
      const pill = document.getElementById('v2TransPill');
      const clubName = link.textContent.trim().replace(/[→\s]+$/, '');
      if (pill) {
        pill.textContent = clubName ? clubName : 'Opening...';
      }

      curtain.style.setProperty('--trans-theme', color);
      curtain.style.display = 'flex';
      curtain.classList.remove('v2-trans-reveal');
      
      // Force layout reflow
      void curtain.offsetWidth;

      curtain.classList.add('v2-trans-active');

      setTimeout(() => {
        window.location.href = href;
      }, 520);
    });
  }

  // Handle browser back/forward buttons (bfcache)
  window.addEventListener('pageshow', () => {
    const curtain = document.getElementById('v2PageTransition');
    if (curtain) {
      curtain.classList.remove('v2-trans-active');
      curtain.classList.add('v2-trans-reveal');
      setTimeout(() => {
        curtain.style.display = 'none';
      }, 550);
    }
  });

  // ─── SCROLL-TRIGGERED ENTRANCE ANIMATIONS ──────────────────────
  function initScrollAnimations() {
    const targets = [
      '.v2-act-card',
      '.v2-reason-card',
      '.v2-detail-card',
      '.v2-details-cta',
      '.v2-scroll-reveal',
      '.v2-section-header',
      '.v2-perfect-for-header',
      '.v2-details-header',
      '.club-row'
    ];
    const selector = targets.join(', ');

    if (!('IntersectionObserver' in window)) {
      // Fallback: reveal all
      document.querySelectorAll(selector).forEach(el => el.classList.add('v2-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('v2-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    function scanAndObserve() {
      document.querySelectorAll(selector).forEach(el => {
        if (el.classList.contains('v2-revealed')) return;

        // If already well in view on initial load, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('v2-revealed');
        } else {
          observer.observe(el);
        }
      });
    }

    scanAndObserve();

    // Re-check after dynamic content renders (e.g. renderActivities, renderClubsList)
    setTimeout(scanAndObserve, 80);
    setTimeout(scanAndObserve, 250);
    setTimeout(scanAndObserve, 600);

    // Dynamic DOM additions observer
    if (window.MutationObserver) {
      const mutObserver = new MutationObserver(() => {
        scanAndObserve();
      });
      mutObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Safety timeout: ensure everything reveals even if observer doesn't fire
    setTimeout(() => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('v2-revealed');
      });
    }, 1800);
  }

  // ─── CONTINUOUS PARABOLIC SHAPES SCROLL PARALLAX ───────────────
  function initParabolicParallax() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const dividers = document.querySelectorAll('.v2-parabolic-divider svg, .v2-activities-parabolic-bg svg, #heroWaves');
          const winH = window.innerHeight;

          dividers.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.bottom > -100 && rect.top < winH + 100) {
              const centerDist = (rect.top + rect.height / 2) - (winH / 2);
              const shift = Math.max(-16, Math.min(16, -centerDist * 0.035));
              el.style.transform = `translateY(${shift.toFixed(1)}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function init() {
    createCurtain();
    attachLinkInterceptors();
    initScrollAnimations();
    initParabolicParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
