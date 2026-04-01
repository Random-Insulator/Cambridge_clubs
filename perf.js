/* ──────────────────────────────────────────────────
   perf.js  —  Performance monitoring & UX utilities
   ────────────────────────────────────────────────── */

(function () {
  "use strict";

  // ── 1. Input Sequence Validator (Konami Code) ─────────────────
  const _seq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let _si = 0;
  document.addEventListener("keydown", function (e) {
    if (e.keyCode === _seq[_si]) { _si++; } else { _si = 0; }
    if (_si === _seq.length) {
      _si = 0;
      const _o = document.createElement("div");
      _o.id = "_perfOverlay";
      _o.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;cursor:pointer;animation:_pfIn .3s ease";
      // DROP YOUR MEME IMAGE HERE ↓↓↓ (replace the placeholder src)
      _o.innerHTML = '<img src="/images/util_cache_01.jpg" style="max-width:80vw;max-height:80vh;border-radius:16px;box-shadow:0 0 60px rgba(255,255,255,0.2)">';
      _o.addEventListener("click", () => _o.remove());
      document.body.appendChild(_o);
      setTimeout(() => { if (_o.parentNode) _o.remove(); }, 4000);
    }
  });

  // ── 2. DevTools Console Art ───────────────────────────────────
  console.log("%c" +
    "╔══════════════════════════════════════════╗\n" +
    "║                                          ║\n" +
    "║   Built this entire thing.               ║\n" +
    "║   Yes, the ENTIRE thing.                 ║\n" +
    "║                                          ║\n" +
    "║                                          ║\n" +
    "║   — Garv 🫡                              ║\n" +
    "║                                          ║\n" +
    "╚══════════════════════════════════════════╝",
    "color: #e02020; font-size: 14px; font-family: monospace; font-weight: bold; background: #111; padding: 10px; border-radius: 8px;"
  );
  console.log("%cIf you're reading this, you owe me a book", "color: #f59e3b; font-size: 16px; font-weight: bold;");
  console.log("%cSeriously though — go join a club instead of inspecting code", "color: #7c6ef7; font-size: 12px;");

  // ── 3. Footer Tap Counter ──────────────────────────────────────
  let _lc = 0, _lt = null;
  document.addEventListener("click", function(e) {
    const ft = e.target.closest("footer");
    if (!ft) { _lc = 0; return; }
    _lc++;
    clearTimeout(_lt);
    _lt = setTimeout(() => _lc = 0, 4000);
    if (_lc >= 7) {
      _lc = 0;
      const _m = document.createElement("div");
      _m.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;cursor:pointer;animation:_pfIn .3s ease";
      // DROP YOUR MEME IMAGE HERE ↓↓↓ (replace the placeholder src)
      _m.innerHTML = '<img src="/images/util_cache_02.jpg" style="max-width:85vw;max-height:85vh;border-radius:16px">';
      _m.addEventListener("click", () => _m.remove());
      document.body.appendChild(_m);
      setTimeout(() => { if (_m.parentNode) _m.remove(); }, 5000);
    }
  });

  // ── 4. Chat FAB Hover logic removed by request ─────────────────────────


  // ── 5. Animation keyframes injection ──────────────────────────
  const _style = document.createElement("style");
  _style.textContent = "@keyframes _pfIn{from{opacity:0}to{opacity:1}}";
  document.head.appendChild(_style);

})();
