/*!
 * GAZE — Grow beyond the scroll
 * Copyright (c) 2026 GAZE. All rights reserved.
 *
 * This file and its contents are proprietary and confidential.
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited without prior written permission.
 */

/* ===== RIVE RUNTIME ===== */
(function(){
  const canvas = document.getElementById("rive-canvas");

  // decode the embedded base64 .riv into an ArrayBuffer (works on file:// and when hosted)
  function b64ToBytes(b64){
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  const riveBuffer = b64ToBytes(window.INTRO_RIV_B64).buffer;

  const r = new rive.Rive({
    buffer: riveBuffer,
    canvas: canvas,
    autoplay: true,
    stateMachines: "State Machine 1",
    onLoad: () => {
      resizeCanvas();
      r.resizeDrawingSurfaceToCanvas();
    },
    onLoadError: (e) => console.error("Rive failed to load:", e),
  });

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    r.resizeDrawingSurfaceToCanvas();
  });

  // parallax tilt on the intro canvas (throttled)
  let lastTime = 0;
  const throttleMs = 16; // ~60fps
  let pendingTransform = false;
  
  window.addEventListener("mousemove", (e) => {
    if (document.getElementById("intro").classList.contains("hidden")) return;
    const now = Date.now();
    if (now - lastTime < throttleMs) return;
    lastTime = now;
    
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    const rotateY = (x - 0.5) * 20;
    const rotateX = (0.5 - y) * 20;
    const moveX = (x - 0.5) * 40;
    const moveY = (y - 0.5) * 40;
    canvas.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${moveX}px) translateY(${moveY}px)`;
  }, { passive: true });
  
  window.addEventListener("mouseleave", () => {
    canvas.style.transform = `rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px)`;
  }, { passive: true });
})();

/* ===== SITE LOGIC ===== */
(function(){
  // intro -> site transition
  const intro = document.getElementById("intro");
  const site = document.getElementById("site");
  function enterSite(){
    if (intro.classList.contains("hidden")) return;
    intro.classList.add("hidden");
    site.classList.add("shown");
    document.body.style.overflow = "auto";
  }
  document.getElementById("enter-btn").addEventListener("click", enterSite);
  // skip intro if arriving via a deep link (e.g. /#privacy for Apple review)
  if (location.hash && location.hash !== "#home") {
    enterSite();
  }

  // tabbed navigation
  const tabs = document.querySelectorAll('[data-tab]');
  const sections = document.querySelectorAll('#site section');
  const navTabs = document.querySelectorAll('header .tab');

  function show(name){
    sections.forEach(s => s.classList.toggle('active', s.id === name));
    navTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    window.scrollTo({top:0, behavior:'smooth'});
    if(history.replaceState){ history.replaceState(null,'','#'+name); }
  }

  tabs.forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    show(btn.dataset.tab);
  }));

  const initial = (location.hash || '#home').slice(1);
  if(document.getElementById(initial)) show(initial);
})();

/* ===== GROW-BEYOND VINE ===== */
(function(){
  const section = document.getElementById('grow-section');
  const svg = document.getElementById('vineSvg');
  const BP = 760;

  const hCfg = {
    vb: '0 0 1200 340',
    mainD: 'M -50 170 Q 100 140, 200 160 T 400 130 T 600 170 T 800 140 T 1000 170 T 1250 155',
    curls: [
      'M 200 160 Q 180 110, 220 75',
      'M 400 130 Q 420 175, 380 205',
      'M 600 170 Q 580 120, 620 85',
      'M 800 140 Q 820 185, 780 220',
      'M 1000 170 Q 980 120, 1020 85',
    ],
    leaves: [
      {t:0.06,cx:150, cy:148,rx:25,ry:12,rot:-30,v:true},
      {t:0.12,cx:220, cy:90, rx:20,ry:10,rot:-60,v:true},
      {t:0.19,cx:300, cy:155,rx:28,ry:14,rot:20, v:true},
      {t:0.24,cx:380, cy:200,rx:22,ry:11,rot:45, v:true},
      {t:0.30,cx:450, cy:115,rx:26,ry:13,rot:-25,v:true},
      {t:0.37,cx:550, cy:165,rx:24,ry:12,rot:15, v:true},
      {t:0.43,cx:620, cy:100,rx:22,ry:11,rot:-50,v:true},
      {t:0.50,cx:700, cy:160,rx:30,ry:15,rot:30, v:true},
      {t:0.57,cx:780, cy:212,rx:24,ry:12,rot:50, v:true},
      {t:0.64,cx:850, cy:120,rx:20,ry:10,rot:-40,v:true},
      {t:0.71,cx:950, cy:165,rx:28,ry:14,rot:25, v:true},
      {t:0.78,cx:1020,cy:98, rx:22,ry:11,rot:-55,v:true},
      {t:0.86,cx:1100,cy:162,rx:26,ry:13,rot:20, v:true},
      {t:0.15,cx:215, cy:72, rx:15,ry:8, rot:-70,v:false},
      {t:0.26,cx:385, cy:210,rx:15,ry:8, rot:60, v:false},
      {t:0.44,cx:615, cy:80, rx:15,ry:8, rot:-80,v:false},
      {t:0.59,cx:785, cy:228,rx:15,ry:8, rot:70, v:false},
      {t:0.79,cx:1015,cy:78, rx:15,ry:8, rot:-75,v:false},
    ]
  };

  const vCfg = {
    vb: '0 0 400 800',
    mainD: 'M 200 -20 Q 170 100, 190 200 T 175 380 T 200 560 T 185 720 T 200 830',
    curls: [
      'M 190 200 Q 125 185, 85 208',
      'M 175 380 Q 240 368, 275 390',
      'M 200 560 Q 135 547, 95 568',
      'M 185 720 Q 248 708, 280 730',
      'M 200 830 Q 138 820, 100 840',
    ],
    leaves: [
      {t:0.06,cx:135, cy:148,rx:25,ry:12,rot:60, v:true},
      {t:0.12,cx:80,  cy:205,rx:20,ry:10,rot:30, v:true},
      {t:0.19,cx:185, cy:280,rx:28,ry:14,rot:-20,v:true},
      {t:0.24,cx:272, cy:378,rx:22,ry:11,rot:-45,v:true},
      {t:0.30,cx:140, cy:450,rx:26,ry:13,rot:25, v:true},
      {t:0.37,cx:188, cy:510,rx:24,ry:12,rot:-15,v:true},
      {t:0.43,cx:95,  cy:562,rx:22,ry:11,rot:50, v:true},
      {t:0.50,cx:185, cy:628,rx:30,ry:15,rot:-30,v:true},
      {t:0.57,cx:276, cy:680,rx:24,ry:12,rot:-50,v:true},
      {t:0.64,cx:140, cy:718,rx:20,ry:10,rot:40, v:true},
      {t:0.71,cx:192, cy:768,rx:28,ry:14,rot:-25,v:true},
      {t:0.78,cx:278, cy:808,rx:22,ry:11,rot:55, v:true},
      {t:0.86,cx:138, cy:838,rx:26,ry:13,rot:-20,v:true},
      {t:0.15,cx:83,  cy:218,rx:15,ry:8, rot:20, v:false},
      {t:0.26,cx:274, cy:390,rx:15,ry:8, rot:-60,v:false},
      {t:0.44,cx:93,  cy:575,rx:15,ry:8, rot:40, v:false},
      {t:0.59,cx:280, cy:742,rx:15,ry:8, rot:-70,v:false},
      {t:0.79,cx:97,  cy:848,rx:15,ry:8, rot:35, v:false},
    ]
  };

  let mainPath, curlPaths, leafEls, mainLen, currentMode;

  function build(mode) {
    const cfg = mode === 'vertical' ? vCfg : hCfg;
    svg.setAttribute('viewBox', cfg.vb);
    svg.innerHTML = `
      <defs>
        <linearGradient id="vg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1e6f3c"/>
          <stop offset="50%" stop-color="#2d8a4e"/>
          <stop offset="100%" stop-color="#3aa65a"/>
        </linearGradient>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3aa65a"/><stop offset="100%" stop-color="#2d8a4e"/>
        </linearGradient>
        <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7ed957"/><stop offset="100%" stop-color="#3aa65a"/>
        </linearGradient>
      </defs>
      <path id="mv" fill="none" stroke="url(#vg)" stroke-width="12" stroke-linecap="round" d="${cfg.mainD}"/>
      ${cfg.curls.map((d,i)=>`<path id="cv${i}" fill="none" stroke="#3aa65a" stroke-width="8" stroke-linecap="round" d="${d}"/>`).join('')}
      ${cfg.leaves.map((l,i)=>`
        <g class="leaf hidden" data-t="${l.t}" id="lf${i}">
          <ellipse cx="${l.cx}" cy="${l.cy}" rx="${l.rx}" ry="${l.ry}" fill="url(#lg${i%2===0?1:2})" transform="rotate(${l.rot} ${l.cx} ${l.cy})"/>
          ${l.v?`<line x1="${l.cx-l.rx*0.6}" y1="${l.cy}" x2="${l.cx+l.rx*0.6}" y2="${l.cy}" stroke="#1e6f3c" stroke-width="2" transform="rotate(${l.rot} ${l.cx} ${l.cy})"/>`:''}
        </g>`).join('')}
    `;
    mainPath = svg.getElementById('mv');
    curlPaths = cfg.curls.map((_,i)=>svg.getElementById('cv'+i));
    leafEls = cfg.leaves.map((_,i)=>svg.getElementById('lf'+i));
    mainLen = mainPath.getTotalLength();
    mainPath.style.strokeDasharray = mainLen;
    mainPath.style.strokeDashoffset = mainLen;
    curlPaths.forEach(c=>{ const l=c.getTotalLength(); c.style.strokeDasharray=l; c.style.strokeDashoffset=l; });
    currentMode = mode;
  }

  function update(p) {
    if (!mainPath) return;
    mainPath.style.strokeDashoffset = mainLen * (1 - p);
    curlPaths.forEach((c,i)=>{
      const cLen = c.getTotalLength();
      const start = 0.1 + i * 0.15;
      const cp = Math.max(0, Math.min(1, (p - start) / 0.15));
      c.style.strokeDashoffset = cLen * (1 - cp);
    });
    leafEls.forEach(leaf=>{
      const t = parseFloat(leaf.dataset.t);
      if (p >= t) { leaf.classList.remove('hidden'); leaf.classList.add('visible'); }
      else { leaf.classList.remove('visible'); leaf.classList.add('hidden'); }
    });
  }

  function checkMode() {
    const mode = window.innerWidth < BP ? 'vertical' : 'horizontal';
    if (mode !== currentMode) { build(mode); onScroll(); }
  }

  // progress = 0 when the section's top reaches the bottom of the viewport,
  // 1 by the time the section's top reaches the top of the viewport
  // (so the full vine is drawn while the section is in view)
  function onScroll() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.max(0, Math.min(1, (vh - rect.top) / vh));
    update(p);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { checkMode(); onScroll(); });

  checkMode();
  onScroll();
})();
