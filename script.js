(function () {
  const { config, days } = window.CALENDAR;
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const STORE = "advent-opened-" + config.year;

  /* ---------- What day is it? ----------
     Testing helpers (add to the URL):
       ?preview=all  → every window unlocked
       ?preview=12   → pretend it's 12 December
       ?reset        → close all windows again            */
  if (params.has("reset")) localStorage.removeItem(STORE);

  function today() {
    const p = params.get("preview");
    if (p === "all") return 99;
    if (p && Number(p) >= 1) return Number(p);
    const now = new Date();
    const start = new Date(config.year, 11, 1);
    if (now < start) return 0;                                   // not December yet
    if (now.getFullYear() > config.year) return 99;              // it's over: all open
    return now.getDate();
  }

  let opened;
  try { opened = new Set(JSON.parse(localStorage.getItem(STORE)) || []); }
  catch (e) { opened = new Set(); }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify([...opened])); } catch (e) {} };

  /* ---------- Header ---------- */
  document.title = config.title;
  $("title").textContent = config.title;
  $("subtitle").textContent = "for " + config.recipient + " ♥";
  $("tagTo").textContent = "To: " + config.recipient;
  $("tagFrom").textContent = "From: " + config.from;

  function updateCountdown() {
    const d = today();
    let text;
    if (d === 0) {
      const ms = new Date(config.year, 11, 1) - new Date();
      const n = Math.ceil(ms / 864e5);
      text = `❄️ The first window opens in ${n} sleep${n === 1 ? "" : "s"}`;
    } else if (d < 24) text = `🎄 ${25 - d} sleeps until Christmas`;
    else if (d === 24) text = "🕯️ One more sleep until Christmas";
    else if (d === 25) text = "🎅 Merry Christmas!";
    else text = "⭐ Every window is open. Hope it was magical";
    $("countdown").textContent = text;
  }

  /* ---------- Build the doors ---------- */
  // Classic advent calendars scatter their numbers
  const ORDER = [7, 18, 3, 22, 11, 1, 15, 9, 24, 5, 20, 13, 2, 17, 6, 21, 10, 4, 14, 23, 8, 19, 12, 16];
  const doors = {};

  function makeDoor(day, i, big) {
    const b = document.createElement("button");
    b.className = "door " + (big ? "big" : "c" + (i % 6));
    b.style.setProperty("--i", i);
    const emoji = (days[day] && days[day].emoji) || "🎁";
    b.innerHTML = big
      ? `<span class="door-inside"><span>${emoji}</span></span>
         <span class="door-front"></span><span class="door-front right"></span>
         <span class="big-badge">25</span>`
      : `<span class="door-inside"><span>${emoji}</span></span>
         <span class="door-front"><span class="num">${day}</span></span>`;
    b.addEventListener("click", () => clickDoor(day));
    doors[day] = b;
    return b;
  }

  ORDER.forEach((day, i) => $("calendar").appendChild(makeDoor(day, i, false)));
  $("finale").appendChild(makeDoor(25, 24, true));

  function refresh() {
    const d = today();
    for (let day = 1; day <= 25; day++) {
      const el = doors[day];
      const locked = day > d;
      el.classList.toggle("locked", locked);
      el.classList.toggle("open", !locked && opened.has(day));
      el.classList.toggle("today", day === d);
      el.setAttribute("aria-label",
        `December ${day}` + (locked ? ", locked" : opened.has(day) ? ", opened" : ", ready to open"));
    }
    updateCountdown();
  }

  /* ---------- Clicking ---------- */
  const LOCKED_LINES = [
    "🔒 Patience! This one opens on December {d}",
    "🎅 Santa's watching. Come back on December {d}",
    "❄️ Not yet! December {d} will be here soon",
    "🦌 The reindeer say no peeking until December {d}"
  ];

  function clickDoor(day) {
    const el = doors[day];
    if (day > today()) {
      el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
      toast(LOCKED_LINES[Math.floor(Math.random() * LOCKED_LINES.length)].replace("{d}", day));
      return;
    }
    if (opened.has(day)) return showModal(day);

    opened.add(day); save(); refresh();
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (day === 25) {
      Music.chime(["C5", "E5", "G5", "C6", "E6", "G6", "C7"]);
      confetti(cx, cy, 60);
      setTimeout(() => confetti(innerWidth * .2, innerHeight * .35, 40), 400);
      setTimeout(() => confetti(innerWidth * .8, innerHeight * .35, 40), 700);
    } else {
      Music.chime(["G5", "C6", "E6"]);
      confetti(cx, cy, 16);
    }
    setTimeout(() => showModal(day), day === 25 ? 1300 : 950);
  }

  /* ---------- Modal ---------- */
  let lastFocus;
  function showModal(day) {
    const c = days[day] || {};
    $("modalDay").textContent = "December " + day;
    $("modalEmoji").textContent = c.emoji || "🎁";
    $("modalTitle").textContent = c.title || "";
    $("modalMessage").textContent = c.message || "";
    const img = $("modalImage"), link = $("modalLink");
    img.hidden = !c.image;
    if (c.image) img.src = c.image; else img.removeAttribute("src");
    link.hidden = !c.link;
    if (c.link) { link.href = c.link; link.textContent = c.linkLabel || "Open"; }
    document.querySelector(".modal-card").classList.toggle("coupon", !!c.coupon);
    lastFocus = document.activeElement;
    $("modal").hidden = false;
    $("modalClose").focus();
  }
  function hideModal() {
    $("modal").hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  $("modalClose").addEventListener("click", hideModal);
  $("modal").addEventListener("click", e => { if (e.target === $("modal")) hideModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("modal").hidden) hideModal(); });

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- Confetti ---------- */
  const BITS = ["❄️", "⭐", "✨", "🎄", "❤️", "🔔", "🍬", "🎁"];
  function confetti(x, y, n) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "confetti";
      s.textContent = BITS[Math.floor(Math.random() * BITS.length)];
      const a = Math.random() * Math.PI * 2, dist = 80 + Math.random() * (n > 20 ? 320 : 160);
      s.style.left = x + "px"; s.style.top = y + "px";
      s.style.setProperty("--x", Math.cos(a) * dist + "px");
      s.style.setProperty("--y", Math.sin(a) * dist + 60 + "px");
      s.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      s.style.setProperty("--s", 14 + Math.random() * 18 + "px");
      s.style.setProperty("--t", 1 + Math.random() * 1.2 + "s");
      document.body.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
  }

  /* ---------- Music + splash ---------- */
  const musicBtn = $("musicBtn");
  const syncBtn = () => {
    musicBtn.classList.toggle("playing", Music.playing);
    musicBtn.textContent = Music.playing ? "🔔" : "🔕";
  };
  musicBtn.addEventListener("click", () => { Music.toggle(); syncBtn(); });
  $("giftBtn").addEventListener("click", () => {
    Music.play(); syncBtn();
    $("splash").classList.add("gone");
    confetti(innerWidth / 2, innerHeight / 2, 40);
  });
  syncBtn();

  /* ---------- Stars & lights ---------- */
  const stars = $("stars");
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("i");
    s.className = "star";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 70 + "%";
    s.style.animationDelay = Math.random() * 3 + "s";
    s.style.animationDuration = 2 + Math.random() * 3 + "s";
    if (Math.random() < .3) s.style.width = s.style.height = "2px";
    stars.appendChild(s);
  }
  const COLORS = ["#ff5b5b", "#ffd24d", "#5be37d", "#5bb8ff", "#ff8be0"];
  const nBulbs = Math.max(10, Math.floor(innerWidth / 55));
  for (let i = 0; i < nBulbs; i++) {
    const b = document.createElement("i");
    b.className = "bulb";
    b.style.setProperty("--c", COLORS[i % COLORS.length]);
    b.style.animationDelay = (i % 3) * .6 + "s";
    $("lights").appendChild(b);
  }

  /* ---------- Snow ---------- */
  const canvas = $("snow"), g = canvas.getContext("2d");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, flakes = [];
  function resize() {
    W = canvas.width = innerWidth; H = canvas.height = innerHeight;
    const n = Math.round(Math.min(160, W / 9) * (calm ? .3 : 1));
    flakes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 1 + Math.random() * 3, v: .4 + Math.random() * 1.2,
      sway: Math.random() * Math.PI * 2
    }));
  }
  function snow() {
    g.clearRect(0, 0, W, H);
    g.fillStyle = "rgba(255,255,255,.85)";
    for (const f of flakes) {
      f.y += f.v; f.sway += .01;
      f.x += Math.sin(f.sway) * .5;
      if (f.y > H + 5) { f.y = -5; f.x = Math.random() * W; }
      g.beginPath(); g.arc(f.x, f.y, f.r, 0, 6.3); g.fill();
    }
    requestAnimationFrame(snow);
  }
  addEventListener("resize", resize);
  resize(); snow();

  refresh();
  setInterval(refresh, 60000); // unlocks at midnight without a reload
})();
