// Promptica landing: hero 3D scene. three.js r187 (MIT), vendored in lp/vendor, loaded through the import map in index.html.
// A gold-framed glass "prompt card" types a Persian prompt, ringed by orbiting gold and violet rings.
// Renders only while visible, caps DPR at 2, draws one still frame for prefers-reduced-motion,
// and leaves the static fallback image in place if WebGL is unavailable.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, PlaneGeometry, TorusGeometry, SphereGeometry,
  ExtrudeGeometry, Shape, MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, CanvasTexture,
  SRGBColorSpace, PMREMGenerator, DirectionalLight, PointLight, BufferGeometry, Float32BufferAttribute,
  Points, PointsMaterial, AdditiveBlending, ACESFilmicToneMapping, Color, MathUtils
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const GOLD = 0xe2a93b, VIOLET = 0x8a7aff;
const PROMPTS = [
  'یک عکس محصول لوکس از بطری سرم بساز؛ نور طلایی، پس‌زمینهٔ تیره و بازتاب نرم.',
  'برای فروشگاه قهوه سه عنوان کوتاه بنویس که حس گرما و کیفیت بدهد.'
];

function cardTexture() {
  const W = 1200, H = 750;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace; tex.anisotropy = 4;

  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  function wrap(text, max) {
    const words = text.split(' '), lines = []; let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > max && line) { lines.push(line); line = w; } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }
  function draw(text, caret) {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#1d1736'); g.addColorStop(1, '#0b0a14');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const rg = ctx.createRadialGradient(W * 0.15, 0, 10, W * 0.15, 0, 620);
    rg.addColorStop(0, 'rgba(138,122,255,.30)'); rg.addColorStop(1, 'rgba(138,122,255,0)');
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);

    ctx.direction = 'rtl'; ctx.textBaseline = 'middle';
    // brand row (right side, RTL)
    const gg = ctx.createLinearGradient(0, 60, 0, 150);
    gg.addColorStop(0, '#ffd978'); gg.addColorStop(1, '#d9962c');
    ctx.fillStyle = gg; rr(W - 156, 62, 92, 92, 24); ctx.fill();
    ctx.fillStyle = '#2a1d03'; ctx.textAlign = 'center'; ctx.font = '62px Lalezar, Vazirmatn, sans-serif';
    ctx.fillText('پ', W - 110, 112);
    ctx.textAlign = 'right'; ctx.fillStyle = '#ffffff'; ctx.font = '800 46px Vazirmatn, Tahoma, sans-serif';
    ctx.fillText('پرامپتیکا', W - 184, 92);
    ctx.fillStyle = '#a7a3bd'; ctx.font = '500 26px Vazirmatn, Tahoma, sans-serif';
    ctx.fillText('پرامپت عکاسی محصول', W - 184, 136);
    // model pill (left)
    ctx.direction = 'ltr'; ctx.textAlign = 'center';
    ctx.strokeStyle = 'rgba(242,193,78,.7)'; ctx.lineWidth = 3; rr(64, 74, 190, 60, 30); ctx.stroke();
    ctx.fillStyle = '#f2c14e'; ctx.font = '700 28px Vazirmatn, Tahoma, sans-serif'; ctx.fillText('Claude', 159, 105);
    ctx.direction = 'rtl';
    // divider
    ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fillRect(64, 190, W - 128, 2);
    // label + prompt
    ctx.textAlign = 'right'; ctx.fillStyle = '#f2c14e'; ctx.font = '700 28px Vazirmatn, Tahoma, sans-serif';
    ctx.fillText('پرامپت', W - 64, 240);
    ctx.fillStyle = '#f1eefb'; ctx.font = '600 52px Vazirmatn, Tahoma, sans-serif';
    const lines = wrap(text, W - 140);
    let y = 312;
    lines.forEach((l) => { ctx.fillText(l, W - 64, y); y += 82; });
    if (caret) {
      const last = lines[lines.length - 1] || '';
      const cx = W - 64 - ctx.measureText(last).width - 10;
      ctx.fillStyle = '#8a7aff'; ctx.fillRect(cx, y - 82 - 30, 6, 60);
    }
    // run button + meta
    const bg = ctx.createLinearGradient(0, 610, 0, 680);
    bg.addColorStop(0, '#ffd36b'); bg.addColorStop(1, '#e09f33');
    ctx.fillStyle = bg; rr(W - 64 - 360, 608, 360, 76, 22); ctx.fill();
    ctx.fillStyle = '#2a1d03'; ctx.textAlign = 'center'; ctx.font = '800 32px Vazirmatn, Tahoma, sans-serif';
    ctx.fillText('اجرا با هیرو ای‌آی', W - 64 - 180, 647);
    ctx.textAlign = 'left'; ctx.fillStyle = '#7f7a99'; ctx.font = '500 26px Vazirmatn, Tahoma, sans-serif';
    ctx.fillText('خروجی در همین صفحه', 64, 647);
    tex.needsUpdate = true;
  }
  return { tex, draw };
}

function starGeometry() {
  const s = new Shape(), R = 0.5, r = 0.12;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 2, rad = i % 2 ? r : R;
    const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
    i ? s.lineTo(x, y) : s.moveTo(x, y);
  }
  s.closePath();
  const g = new ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 3 });
  g.center();
  return g;
}

function dotTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
}

export function initHero(canvas, stage) {
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return false;
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { return false; }
  if (!renderer.getContext()) return false;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pm = new PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  pm.dispose();
  scene.environmentIntensity = 0.9;

  const camera = new PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(0, 0.2, 10);

  const key = new DirectionalLight(0xffe2a8, 2.2); key.position.set(-4, 5, 6); scene.add(key);
  const back = new PointLight(VIOLET, 30, 20, 2); back.position.set(2.5, -1, -3); scene.add(back);

  const root = new Group(); scene.add(root);

  // card
  const gold = new MeshPhysicalMaterial({ color: GOLD, metalness: 1, roughness: 0.26, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  const card = new Group(); root.add(card);
  const body = new Mesh(new RoundedBoxGeometry(3.36, 2.16, 0.14, 5, 0.08), gold);
  card.add(body);
  const face = cardTexture();
  const faceMat = new MeshBasicMaterial({ map: face.tex, toneMapped: false });
  const facePlane = new Mesh(new PlaneGeometry(3.2, 2.0), faceMat);
  facePlane.position.z = 0.0725; card.add(facePlane);
  // glass sheen: a soft diagonal band that slides across the face with the pointer
  const sc = document.createElement('canvas'); sc.width = 512; sc.height = 320;
  const sx = sc.getContext('2d'), sg = sx.createLinearGradient(150, 0, 362, 320);
  sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,.13)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
  sx.fillStyle = sg; sx.fillRect(0, 0, 512, 320);
  const sheenTex = new CanvasTexture(sc);
  const sheen = new Mesh(new PlaneGeometry(3.2, 2.0), new MeshBasicMaterial({ map: sheenTex, transparent: true, blending: AdditiveBlending, depthWrite: false, toneMapped: false }));
  sheen.position.z = 0.074; card.add(sheen);

  // rings with beads
  const rings = [];
  // Rings are tilted so their front arcs pass above and below the card, never across its text.
  const ringDefs = [
    { r: 2.2, t: 0.026, pos: [0, -0.62, 0], rx: -1.3, rz: 0.07, speed: 0.3, mat: gold, bead: 0xffd27a },
    { r: 1.95, t: 0.02, pos: [0, 0.62, 0], rx: 1.3, rz: -0.06, speed: -0.24, mat: gold, bead: 0xffe3a3 },
    { r: 2.55, t: 0.014, pos: [0, 0, -1.2], rx: 0.22, ry: 0.5, rz: 0.35, speed: 0.14, mat: new MeshBasicMaterial({ color: VIOLET, toneMapped: false }), bead: 0xb7abff }
  ];
  for (const d of ringDefs) {
    const holder = new Group(); holder.position.set(...d.pos); holder.rotation.set(d.rx, d.ry || 0, d.rz || 0); root.add(holder);
    const spin = new Group(); holder.add(spin);
    spin.add(new Mesh(new TorusGeometry(d.r, d.t, 12, 180), d.mat));
    const bead = new Mesh(new SphereGeometry(0.075, 20, 16), new MeshStandardMaterial({ color: d.bead, emissive: d.bead, emissiveIntensity: 0.9, metalness: 0.4, roughness: 0.3 }));
    bead.position.x = d.r; spin.add(bead);
    rings.push({ spin, speed: d.speed });
  }

  // sparkles
  const sgeo = starGeometry();
  const stars = [[-2.05, 1.4, 0.6, 0.42], [2.1, -1.45, 0.9, 0.34], [1.9, 1.55, -0.6, 0.26]].map(([x, y, z, s]) => {
    const m = new Mesh(sgeo, gold); m.position.set(x, y, z); m.scale.setScalar(s); root.add(m); return m;
  });

  // dust
  const N = 140, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const cg = new Color(0xffcf6a), cv = new Color(VIOLET), tmp = new Color();
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2, rad = 1.9 + Math.random() * 2.4;
    pos[i * 3] = Math.cos(a) * rad; pos[i * 3 + 1] = (Math.random() - 0.5) * 3.8; pos[i * 3 + 2] = Math.sin(a) * rad * 0.6 - 0.5;
    tmp.copy(Math.random() < 0.55 ? cg : cv); col.set([tmp.r, tmp.g, tmp.b], i * 3);
  }
  const pgeo = new BufferGeometry();
  pgeo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  pgeo.setAttribute('color', new Float32BufferAttribute(col, 3));
  const dust = new Points(pgeo, new PointsMaterial({ size: 0.07, map: dotTexture(), vertexColors: true, transparent: true, depthWrite: false, blending: AdditiveBlending, toneMapped: false }));
  root.add(dust);

  // pointer parallax (mouse/pen only; touch gets a gentle idle sway)
  let px = 0, py = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5;
  }, { passive: true });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 1.05 ? 7.2 / Math.max(w / h, 0.72) : 7.9;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  // typing state
  let pIndex = 0, shown = -1, caretOn = true, lastCaret = -1;
  function typed(t) {
    const full = PROMPTS[pIndex], typeDur = full.length * 0.045, hold = 3.2, cycle = typeDur + hold;
    if (t > cycle) return -1; // signals next prompt
    return Math.min(full.length, Math.floor(t / 0.045));
  }

  function pose(t) {
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;
    const idle = Math.sin(t * 0.5) * 0.12;
    root.rotation.y = -0.22 + px * 0.55 + idle * 0.5;
    root.rotation.x = 0.06 + py * 0.3;
    card.position.y = Math.sin(t * 1.1) * 0.08;
    card.rotation.z = Math.sin(t * 0.7) * 0.015;
    for (const r of rings) r.spin.rotation.z = t * r.speed;
    stars.forEach((s, i) => { s.rotation.y = t * (0.6 + i * 0.2); s.position.y += Math.sin(t * 1.3 + i) * 0.0015; });
    dust.rotation.y = t * 0.03;
    sheenTex.offset.x = MathUtils.clamp(0.9 - ((t * 0.12) % 1.8) - px * 0.5, -1, 1);
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true, raf = 0, start = performance.now(), promptStart = start;

  function frame(now) {
    const t = (now - start) / 1000;
    let n = typed((now - promptStart) / 1000);
    if (n < 0) { pIndex = (pIndex + 1) % PROMPTS.length; promptStart = now; n = 0; shown = -1; }
    const blink = Math.floor(t * 2) % 2 === 0;
    if (n !== shown || blink !== lastCaret) { face.draw(PROMPTS[pIndex].slice(0, n), blink); shown = n; lastCaret = blink; }
    pose(t);
    renderer.render(scene, camera);
    if (visible && !reduce.matches && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function still() {
    face.draw(PROMPTS[0], false);
    tx = ty = 0; px = py = 0; pose(1.4);
    renderer.render(scene, camera);
  }
  function play() {
    cancelAnimationFrame(raf);
    if (reduce.matches) still(); else raf = requestAnimationFrame(frame);
  }

  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) play(); else cancelAnimationFrame(raf); }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else if (visible) play(); });
  if (reduce.addEventListener) reduce.addEventListener('change', play);
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); cancelAnimationFrame(raf); stage.classList.remove('is-live'); });

  still();
  stage.classList.add('is-live');
  play();
  return true;
}

const canvas = document.getElementById('hero-canvas');
const stage = canvas && canvas.closest('.stage3d');
if (canvas && stage) {
  const fonts = document.fonts ? Promise.race([
    Promise.all([document.fonts.load('500 40px Vazirmatn'), document.fonts.load('62px Lalezar')]),
    new Promise((r) => setTimeout(r, 1500))
  ]) : Promise.resolve();
  fonts.catch(() => {}).then(() => {
    try { initHero(canvas, stage); } catch (e) { stage.classList.remove('is-live'); }
  });
}
