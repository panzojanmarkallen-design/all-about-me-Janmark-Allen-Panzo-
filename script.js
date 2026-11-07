/* =========================================================
   ✏️ EDIT YOUR INFO HERE
   ========================================================= */
const roles = ["Student", "Creative Thinker", "Music Lover", "Future Developer", "Dreamer"];

// notes = MIDI numbers (60 = middle C), 0 = rest
const tracks = [
  { song: "Ikaw lang patutunguhan", artist: "Amiel Sol",   genre: "Pop",     color: "#ff6ec7", wave: "sawtooth", bpm: 73, notes: [ 66,66,66,0, 63,63,63,0, 59,59,59,0, 61,61,61,0 ] },
  { song: "Sagip", artist: "Jan Robert",   genre: "Indie/altenative",     color: "#7afcff", wave: "sine",     bpm: 96,  notes: [57,60,64,60,57,60,64,67,65,64,62,60,59,0,57,0] },
  { song: "Pahintulot", artist: "Shirebound andbusking", genre: "Indie",    color: "#ffe66d", wave: "square",   bpm: 140, notes: [72,0,72,74,76,0,74,72,71,72,74,0,67,0,0,0] },
  { song: "The only exception", artist: "Paramores",  genre: "soft rock", color: "#a66cff", wave: "sawtooth", bpm: 90,  notes: [48,55,60,55,51,58,63,58,46,53,58,53,50,55,62,0] },
  { song: "You make it right", artist: "Amiel Sol",  genre: "Indie pop",    color: "#6bff95", wave: "triangle", bpm: 110, notes: [69,71,72,76,74,72,71,69,67,69,71,74,72,0,69,0] }
];

const themes = [
  { bg1: "#0f0c29", bg2: "#302b63", a: "#ff6ec7", a2: "#7afcff", a3: "#ffe66d" },
  { bg1: "#1a002e", bg2: "#ff512f", a: "#ffd166", a2: "#ef476f", a3: "#06d6a0" },
  { bg1: "#002b36", bg2: "#005f73", a: "#94d2bd", a2: "#ee9b00", a3: "#e9d8a6" },
  { bg1: "#0b0b0b", bg2: "#1f1f1f", a: "#39ff14", a2: "#00e5ff", a3: "#ff00e6" },
  { bg1: "#3a0ca3", bg2: "#f72585", a: "#4cc9f0", a2: "#fefae0", a3: "#ffbe0b" }
];

/* =========================================================
   Helpers
   ========================================================= */
const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
let colors = {};
const readColors = () => colors = { a: cssVar("--accent"), a2: cssVar("--accent2"), a3: cssVar("--accent3") };

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* =========================================================
   Theme switcher (saved in localStorage)
   ========================================================= */
let themeIndex = +localStorage.getItem("theme") || 0;
function applyTheme(i) {
  const t = themes[i], r = document.documentElement.style;
  r.setProperty("--bg1", t.bg1); r.setProperty("--bg2", t.bg2);
  r.setProperty("--accent", t.a); r.setProperty("--accent2", t.a2); r.setProperty("--accent3", t.a3);
  readColors();
}
applyTheme(themeIndex);
$("#themeBtn").addEventListener("click", (e) => {
  themeIndex = (themeIndex + 1) % themes.length;
  localStorage.setItem("theme", themeIndex);
  applyTheme(themeIndex);
  confetti(e.clientX, e.clientY);
  toast(`🎨 Theme ${themeIndex + 1} of ${themes.length}`);
});

/* =========================================================
   Particle background (reacts to the mouse)
   ========================================================= */
const cvs = $("#particles"), ctx2d = cvs.getContext("2d");
const mouse = { x: -999, y: -999 };
let particles = [];
function resize() { cvs.width = innerWidth; cvs.height = innerHeight; }
resize();
for (let i = 0; i < 75; i++) {
  particles.push({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .7, vy: (Math.random() - .5) * .7, r: Math.random() * 2 + 1
  });
}
function drawParticles() {
  ctx2d.clearRect(0, 0, cvs.width, cvs.height);
  ctx2d.fillStyle = ctx2d.strokeStyle = colors.a2;
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > cvs.width) p.vx *= -1;
    if (p.y < 0 || p.y > cvs.height) p.vy *= -1;
    const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
    if (d < 130 && d > 0) { p.x += dx / d * 2.5; p.y += dy / d * 2.5; }
    ctx2d.beginPath(); ctx2d.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx2d.fill();
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 115) {
        ctx2d.globalAlpha = 1 - d / 115; ctx2d.lineWidth = .6;
        ctx2d.beginPath(); ctx2d.moveTo(a.x, a.y); ctx2d.lineTo(b.x, b.y); ctx2d.stroke();
      }
    }
  }
  ctx2d.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* =========================================================
   Custom cursor (smooth trailing ring)
   ========================================================= */
const ring = $(".cursor"), dot = $(".cursor-dot");
let ringX = 0, ringY = 0;
addEventListener("mousemove", (e) => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px";
});
(function moveRing() {
  ringX += (mouse.x - ringX) * .18; ringY += (mouse.y - ringY) * .18;
  ring.style.left = ringX + "px"; ring.style.top = ringY + "px";
  requestAnimationFrame(moveRing);
})();
document.addEventListener("mouseover", (e) => {
  ring.classList.toggle("grow", !!e.target.closest("button, .hobby-card, .track, .name, .info, .fact"));
});
addEventListener("mousedown", () => ring.style.transform = "translate(-50%,-50%) scale(.7)");
addEventListener("mouseup",   () => ring.style.transform = "translate(-50%,-50%) scale(1)");

/* =========================================================
   Page navigation (+ hash routing + arrow keys)
   ========================================================= */
const pages = ["home", "hobbies", "music"];
let currentPage = "home";
const indicator = $(".nav-indicator");

function moveIndicator() {
  const a = $(".nav-link.active");
  indicator.style.left = a.offsetLeft + "px";
  indicator.style.width = a.offsetWidth + "px";
}
function showPage(id) {
  if (!pages.includes(id)) return;
  $$(".page").forEach(p => p.classList.toggle("active", p.id === id));
  $$(".nav-link").forEach(b => b.classList.toggle("active", b.dataset.page === id));
  currentPage = id;
  history.replaceState(null, "", "#" + id);
  moveIndicator();
  if (id === "home") runCounters();
  scrollTo({ top: 0, behavior: "smooth" });
}
$$(".nav-link").forEach(b => b.addEventListener("click", () => showPage(b.dataset.page)));
$$("[data-goto]").forEach(b => b.addEventListener("click", () => showPage(b.dataset.goto)));
addEventListener("resize", () => { resize(); moveIndicator(); });

addEventListener("keydown", (e) => {
  const i = pages.indexOf(currentPage);
  if (e.key === "ArrowRight") showPage(pages[(i + 1) % pages.length]);
  if (e.key === "ArrowLeft")  showPage(pages[(i - 1 + pages.length) % pages.length]);
  if (e.code === "Space" && currentPage === "music") { e.preventDefault(); togglePlay(); }
});

/* =========================================================
   Page 1: typing effect, name letters, counters, copy
   ========================================================= */
const typed = $("#typed");
let roleI = 0, charI = 0, deleting = false;
(function typeLoop() {
  const word = roles[roleI];
  typed.textContent = word.slice(0, charI);
  if (!deleting && charI < word.length) charI++;
  else if (deleting && charI > 0) charI--;
  else if (!deleting) { deleting = true; return setTimeout(typeLoop, 1400); }
  else { deleting = false; roleI = (roleI + 1) % roles.length; }
  setTimeout(typeLoop, deleting ? 50 : 110);
})();

// Split name into bouncy, colour-waving letters
const nameEl = $("#name");
nameEl.innerHTML = [...nameEl.textContent].map((ch, i) =>
  `<span style="--i:${i}">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
nameEl.addEventListener("click", (e) => { confetti(e.clientX, e.clientY); toast("🎉 Nice to meet you!"); });

function runCounters() {
  $$(".count").forEach(el => {
    const target = +el.dataset.target, start = performance.now(), dur = 1600;
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  });
}
runCounters();

$$(".copy").forEach(el => el.addEventListener("click", () => {
  navigator.clipboard?.writeText(el.dataset.copy);
  toast("📋 Email copied!");
}));

// Magnetic buttons
$$(".magnetic").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * .35}px, ${y * .5}px) scale(1.05)`;
  });
  btn.addEventListener("mouseleave", () => btn.style.transform = "");
});

/* =========================================================
   Confetti burst
   ========================================================= */
function confetti(x, y) {
  const palette = [colors.a, colors.a2, colors.a3];
  for (let i = 0; i < 45; i++) {
    const s = document.createElement("span");
    s.className = "confetti";
    s.style.left = x + "px"; s.style.top = y + "px";
    s.style.background = palette[i % 3];
    document.body.appendChild(s);
    const ang = Math.random() * Math.PI * 2, v = 80 + Math.random() * 220;
    s.animate([
      { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
      { transform: `translate(${Math.cos(ang) * v}px, ${Math.sin(ang) * v + 180}px) rotate(${Math.random() * 900}deg)`, opacity: 0 }
    ], { duration: 1200 + Math.random() * 700, easing: "cubic-bezier(.2,.8,.2,1)" }).onfinish = () => s.remove();
  }
}

/* =========================================================
   Page 2: hobby cards (tilt, flip, filter)
   ========================================================= */
$$(".hobby-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `rotateX(${-y * 18}deg) rotateY(${x * 18}deg) scale(1.04)`;
  });
  card.addEventListener("mouseleave", () => card.style.transform = "");
  card.addEventListener("click", () => card.classList.toggle("flipped"));
});

$$(".chip").forEach(chip => chip.addEventListener("click", () => {
  $$(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  const f = chip.dataset.filter;
  $$(".hobby-card").forEach(card => {
    const show = f === "all" || card.dataset.cat === f;
    card.classList.toggle("hide", !show);
    if (show) { card.style.animation = "none"; card.offsetHeight; card.style.animation = ""; } // replay pop-in
  });
}));

/* =========================================================
   Page 3: music player (Web Audio synth + visualizer)
   ========================================================= */
const playlistEl = $("#playlist");
const liked = JSON.parse(localStorage.getItem("liked") || "[]");

tracks.forEach((t, i) => {
  const li = document.createElement("li");
  li.className = "track";
  li.style.animationDelay = i * .08 + "s";
  li.innerHTML = `
    <span class="num">${String(i + 1).padStart(2, "0")}</span>
    <div class="info-t"><strong>${t.song}</strong><small>${t.artist} · ${t.genre}</small></div>
    <div class="eq"><i></i><i></i><i></i></div>
    <button class="like">${liked.includes(i) ? "♥" : "♡"}</button>`;
  li.addEventListener("click", (e) => {
    if (e.target.classList.contains("like")) return;
    playTrack(i);
  });
  li.querySelector(".like").addEventListener("click", (e) => {
    const b = e.currentTarget, k = liked.indexOf(i);
    if (k > -1) { liked.splice(k, 1); b.textContent = "♡"; }
    else { liked.push(i); b.textContent = "♥"; confetti(e.clientX, e.clientY); toast(`💖 You love ${t.artist}!`); }
    b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
    localStorage.setItem("liked", JSON.stringify(liked));
  });
  playlistEl.appendChild(li);
});

let actx, master, analyser, oscs = [], loaded = false, playing = false;
let current = 0, startTime = 0, duration = 0;
const freqData = new Uint8Array(32);
const midiToHz = (n) => 440 * Math.pow(2, (n - 69) / 12);

function initAudio() {
  if (actx) return;
  actx = new (window.AudioContext || window.webkitAudioContext)();
  master = actx.createGain(); master.gain.value = .45;
  analyser = actx.createAnalyser(); analyser.fftSize = 64;
  master.connect(analyser); analyser.connect(actx.destination);
}
function stopTrack() {
  oscs.forEach(o => { try { o.stop(); } catch (e) {} });
  oscs = [];
}
function playTrack(i) {
  initAudio(); stopTrack();
  if (actx.state === "suspended") actx.resume();
  current = i;
  const t = tracks[i], step = 60 / t.bpm / 2, now = actx.currentTime + .05;
  const notes = t.notes.concat(t.notes); // play the melody twice
  notes.forEach((n, k) => {
    if (!n) return;
    const at = now + k * step, o = actx.createOscillator(), g = actx.createGain();
    o.type = t.wave; o.frequency.value = midiToHz(n);
    g.gain.setValueAtTime(.0001, at);
    g.gain.exponentialRampToValueAtTime(.3, at + .02);
    g.gain.exponentialRampToValueAtTime(.0001, at + step * .95);
    o.connect(g); g.connect(master);
    o.start(at); o.stop(at + step);
    oscs.push(o);
  });
  startTime = now; duration = notes.length * step;
  loaded = true; playing = true;
  updatePlayerUI();
}
function togglePlay() {
  if (!loaded) return playTrack(current);
  if (playing) { actx.suspend(); playing = false; }
  else { actx.resume(); playing = true; }
  updatePlayerUI();
}
function updatePlayerUI() {
  const t = tracks[current];
  $("#nowTitle").textContent = t.song;
  $("#nowArtist").textContent = `${t.artist} · ${t.genre}`;
  $("#vinyl").style.setProperty("--track", t.color);
  $("#vinyl").classList.toggle("playing", playing);
  $("#playBtn").textContent = playing ? "⏸" : "▶";
  $$(".track").forEach((li, i) => {
    li.classList.toggle("active", i === current);
    li.classList.toggle("playing", i === current && playing);
  });
}
$("#playBtn").addEventListener("click", togglePlay);
$("#nextBtn").addEventListener("click", () => playTrack((current + 1) % tracks.length));
$("#prevBtn").addEventListener("click", () => playTrack((current - 1 + tracks.length) % tracks.length));

const vis = $("#visualizer"), vctx = vis.getContext("2d");
(function drawVisualizer() {
  vctx.clearRect(0, 0, vis.width, vis.height);
  if (analyser && playing) analyser.getByteFrequencyData(freqData);
  const bars = 32, w = vis.width / bars;
  const grad = vctx.createLinearGradient(0, vis.height, 0, 0);
  grad.addColorStop(0, colors.a); grad.addColorStop(1, colors.a2);
  vctx.fillStyle = grad;
  for (let i = 0; i < bars; i++) {
    const v = playing ? freqData[i] / 255 : ((Math.sin(Date.now() / 400 + i / 2) + 1) / 2) * .12 + .03;
    const h = Math.max(3, v * vis.height);
    vctx.fillRect(i * w + 1, vis.height - h, w - 2, h);
  }
  if (loaded && playing) {
    const p = (actx.currentTime - startTime) / duration;
    $("#progressBar").style.width = Math.min(100, Math.max(0, p * 100)) + "%";
    if (p >= 1) playTrack((current + 1) % tracks.length); // auto-next
  }
  requestAnimationFrame(drawVisualizer);
})();

/* =========================================================
   Start on the page in the URL (#home, #hobbies, #music)
   ========================================================= */
showPage(location.hash.slice(1) || "home");
