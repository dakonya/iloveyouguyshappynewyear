// ====== Настройки ======
const OWNER = "dakonya";
const REPO = "happy-new-year";

// Таймкапсула откроется в конце 2026 (Asia/Almaty +05:00)
const CAPSULE_OPEN_AT = "2026-12-31T00:00:00+05:00";

// Список друзей — редачь под себя
const FRIENDS = [
  { name: "Аружан", tag: "самый лучший инет друг!" },
  { name: "Азиза, Кымбат, Аяна", tag: "лучшие волонтеры!" },
  { name: "Айбын, Бекиш", tag: "лучшие руммейты" },
  { name: "Карина, Андрей, Нуркамал, Альтаир, Томирис", tag: "лучшие братья!!!" },
  { name: "Темик, Алимгер, Ерали, Лиман, Эльдар", tag: "лучшие достыковские!" },
  { name: "CS 2502", tag: "лучшая группа ever!" },
];

// Итоги года — редачь под себя (очень легко)
const RECAP = [
  { title: "главный апгрейд", pill: "характер", text: "ты смог выдержать этот сложный год, поздравляю!" },
  { title: "чему научился", pill: "скиллы", text: "стал намного сильнее, лучше, другим человеком" },
  { title: "что забираем в 2026", pill: "план", text: "забираем всё в следующем году! пусть он будет ещё лучше чем 25" },
  { title: "что оставляем в 2025", pill: "минус", text: "все плохие черты, привычки, качества, работаем дальше над собой!" },
];

const WISHES = [
  "стань лучшей версией себя! я в тебя верю",
  "никогда не сдавайся и не слушай других, будь собой",
  "будь лучше чем вчера. если идёшь - осилишь дорогу",
  "ты - лучше чем кто либо. если поверишь в это",
];

// ====== Утилиты ======
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function getParam(key) {
  const p = new URLSearchParams(location.search);
  return p.get(key);
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Скопировано ✅");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand("copy");
    ta.remove();
    toast("Скопировано ✅");
  }
}

function toast(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.position = "fixed";
  el.style.left = "50%";
  el.style.bottom = "18px";
  el.style.transform = "translateX(-50%)";
  el.style.padding = "10px 14px";
  el.style.borderRadius = "14px";
  el.style.zIndex = "50";
  el.style.background = "rgba(255,255,255,.10)";
  el.style.border = "1px solid rgba(255,255,255,.14)";
  el.style.backdropFilter = "blur(10px)";
  el.style.color = "rgba(243,245,255,.95)";
  el.style.boxShadow = "0 20px 70px rgba(0,0,0,.55)";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

// маленькая защита для текста в модалке
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ====== Персонализация ======
function initPersonal() {
  const name = getParam("name");
  const heroTitle = $("#heroTitle");
  const heroText = $("#heroText");
  const wish = $("#wish");

  wish.textContent = WISHES[Math.floor(Math.random() * WISHES.length)];

  if (name) {
    const safe = String(name).slice(0, 24);
    heroTitle.textContent = `С Новым годом, ${safe}! 🎄`;
    heroText.textContent =
      `Желаю тебе в 2026 году здоровья, кайфа и сильных побед. Ты реально можешь больше, чем думаешь.`;
    markGreeted(safe);
  }
}

function markGreeted(name) {
  const key = "ng_greeted_v1";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  if (!list.includes(name)) list.push(name);
  localStorage.setItem(key, JSON.stringify(list));
}

function isGreeted(name) {
  const key = "ng_greeted_v1";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  return list.includes(name);
}

// ====== Анимация счётчиков ======
function animateCounters() {
  const els = $$(".statNum");
  const start = performance.now();
  const duration = 900;

  function step(t) {
    const k = clamp((t - start) / duration, 0, 1);
    const ease = 1 - Math.pow(1 - k, 3);
    for (const el of els) {
      const target = Number(el.dataset.count || 0);
      el.textContent = String(Math.round(target * ease));
    }
    if (k < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ====== Рендер ======
function renderFriends() {
  const root = $("#friendsList");
  root.innerHTML = "";

  FRIENDS.forEach((f) => {
    const card = document.createElement("div");
    card.className = "friend";
    card.innerHTML = `
      <div>
        <div class="friendName">${f.name}</div>
        <div class="friendMeta">${f.tag}${isGreeted(f.name) ? " • ✅ поздравлен" : ""}</div>
      </div>
      <div class="friendMeta">→</div>
    `;
    card.addEventListener("click", () => openFriendModal(f));
    root.appendChild(card);
  });
}

function renderRecap() {
  const root = $("#recapCards");
  root.innerHTML = "";

  RECAP.forEach((r) => {
    const el = document.createElement("div");
    el.className = "recapCard";
    el.innerHTML = `
      <div class="recapTop">
        <div class="recapTitle">${r.title}</div>
        <div class="pill">${r.pill}</div>
      </div>
      <div class="recapText">${r.text}</div>
    `;
    root.appendChild(el);
  });
}

// ====== Модалка ======
const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalSub = $("#modalSub");
const modalBody = $("#modalBody");
const modalPrimary = $("#modalPrimary");
const modalSecondary = $("#modalSecondary");

function openModal({ title, sub, bodyHTML, primaryText = "Ок", secondaryText = "Закрыть", onPrimary = null }) {
  modalTitle.textContent = title;
  modalSub.textContent = sub || "";
  modalBody.innerHTML = bodyHTML || "";
  modalPrimary.textContent = primaryText;
  modalSecondary.textContent = secondaryText;

  modalPrimary.onclick = () => {
    if (onPrimary) onPrimary();
    closeModal();
  };
  modalSecondary.onclick = closeModal;

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

$("#modalClose").addEventListener("click", closeModal);
$("#modalBack").addEventListener("click", closeModal);

// ====== Персональная ссылка другу ======
function friendLink(name) {
  const base = `https://${OWNER}.github.io/${REPO}/`;
  const u = new URL(base);
  u.searchParams.set("name", name);
  return u.toString();
}

function openFriendModal(f) {
  const link = friendLink(f.name);
  openModal({
    title: `🎁 Поздравить: ${f.name}`,
    sub: `Тег: ${f.tag}`,
    bodyHTML: `
      <div style="display:grid; gap:10px;">
        <div>Вот персональная ссылка:</div>
        <div style="padding:10px 12px;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:rgba(0,0,0,.18);word-break:break-all;">
          ${link}
        </div>
        <div class="muted" style="font-size:12px;">
          После открытия у друга, у тебя (в этом браузере) он отметится как “✅ поздравлен”.
        </div>
      </div>
    `,
    primaryText: "Скопировать ссылку",
    secondaryText: "Закрыть",
    onPrimary: () => copy(link)
  });
}

// ====== FX: конфетти на Canvas ======
const canvas = $("#fx");
const ctx = canvas.getContext("2d");
let W = 0, H = 0;
let particles = [];
let running = true;

function resize() {
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  W = Math.floor(window.innerWidth);
  H = Math.floor(window.innerHeight);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);

function burst(x = W / 2, y = H / 3, power = 140) {
  const count = 160;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = (Math.random() * 1 + 0.35) * power / 10;
    particles.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - (Math.random() * 2),
      g: 0.12 + Math.random() * 0.08,
      r: 2 + Math.random() * 3,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      life: 180 + Math.random() * 60,
      t: 0,
      shape: Math.random() < 0.5 ? "rect" : "circle",
      hue: Math.random() * 360
    });
  }
}

function tick() {
  if (!running) return;
  ctx.clearRect(0, 0, W, H);

  // лёгкий “звёздный” шум
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 40; i++) {
    const x = (Math.random() * W) | 0;
    const y = (Math.random() * H) | 0;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalAlpha = 1;

  particles = particles.filter(p => p.t < p.life);
  for (const p of particles) {
    p.t += 1;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g;
    p.rot += p.vr;

    const alpha = 1 - (p.t / p.life);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = alpha;

    ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${alpha})`;
    if (p.shape === "rect") {
      ctx.fillRect(-p.r, -p.r, p.r * 2.2, p.r * 1.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  requestAnimationFrame(tick);
}

// ====== Музыка ======
let musicOn = false;
let userStartedMusic = false;

function initMusic() {
  const audio = $("#bgm");
  const btn = $("#btnMusic");
  const slider = $("#musicVolume");

  if (!audio || !btn) return;

  // стартовая громкость
  if (slider) {
    audio.volume = Number(slider.value || 35) / 100;
    slider.addEventListener("input", () => {
      audio.volume = Number(slider.value) / 100;
      if (userStartedMusic) toast("Громкость: " + slider.value + "%");
    });
  } else {
    audio.volume = 0.35;
  }

  function setLabel() {
    btn.textContent = musicOn ? "Музыка: ON" : "Музыка: OFF";
  }

  async function toggle() {
    try {
      if (!musicOn) {
        await audio.play(); // разрешено только после клика
        musicOn = true;
        userStartedMusic = true;
        toast("🎵 Музыка включена");
      } else {
        audio.pause();
        musicOn = false;
        toast("⏸ Музыка выключена");
      }
      setLabel();
    } catch (e) {
      toast("Не могу включить музыку. Проверь assets/song.mp3");
      console.warn(e);
    }
  }

  btn.addEventListener("click", toggle);
  setLabel();
}

// ====== Таймкапсула ======
const CAPSULE_KEY = "ng_capsule_v1";

function initCapsule() {
  const toEl = $("#capsuleTo");
  const textEl = $("#capsuleText");
  const saveBtn = $("#btnSaveCapsule");
  const clearBtn = $("#btnClearCapsule");
  const openBtn = $("#btnOpenCapsule");
  const dateLabel = $("#capsuleDateLabel");

  if (dateLabel) dateLabel.textContent = new Date(CAPSULE_OPEN_AT).toLocaleString();

  function load() {
    const raw = localStorage.getItem(CAPSULE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (toEl) toEl.value = data.to || "";
      if (textEl) textEl.value = data.text || "";
    } catch { }
  }

  function save() {
    const to = (toEl?.value || "").trim();
    const text = (textEl?.value || "").trim();

    if (!text) {
      toast("Напиши сообщение 🙂");
      return;
    }

    const data = { to, text, createdAt: new Date().toISOString() };
    localStorage.setItem(CAPSULE_KEY, JSON.stringify(data));
    toast("✅ Таймкапсула сохранена");
  }

  function clear() {
    localStorage.removeItem(CAPSULE_KEY);
    if (toEl) toEl.value = "";
    if (textEl) textEl.value = "";
    toast("🧹 Удалено");
  }

  function canOpen() {
    return Date.now() >= new Date(CAPSULE_OPEN_AT).getTime();
  }

  function openCapsule() {
    const raw = localStorage.getItem(CAPSULE_KEY);
    if (!raw) {
      openModal({
        title: "Таймкапсула пуста",
        sub: "Сначала сохрани сообщение",
        bodyHTML: `<div>Напиши текст и нажми “Сохранить”.</div>`,
        primaryText: "Ок"
      });
      return;
    }

    const data = JSON.parse(raw);

    if (!canOpen()) {
      openModal({
        title: "🔒 Ещё рано",
        sub: "Капсула запечатана",
        bodyHTML: `
          <div style="display:grid;gap:10px;">
            <div>Откроется после:</div>
            <div class="code">${new Date(CAPSULE_OPEN_AT).toLocaleString()}</div>
            <div class="muted" style="font-size:12px;">
              Хочешь протестить сразу? Поменяй <span class="code">CAPSULE_OPEN_AT</span> на вчерашнюю дату.
            </div>
          </div>
        `,
        primaryText: "Понял"
      });
      return;
    }

    openModal({
      title: "🎁 Таймкапсула открыта!",
      sub: data.to ? `Кому: ${escapeHtml(data.to)}` : "Сообщение из прошлого",
      bodyHTML: `
        <div style="white-space:pre-wrap; padding:10px 12px; border:1px solid rgba(255,255,255,.12); border-radius:14px; background:rgba(0,0,0,.18); color:rgba(243,245,255,.92);">
${escapeHtml(data.text)}
        </div>
        <div class="muted" style="font-size:12px; margin-top:10px;">
          Создано: ${new Date(data.createdAt).toLocaleString()}
        </div>
      `,
      primaryText: "🧨 Салют",
      onPrimary: () => burst(W * 0.5, H * 0.28, 180)
    });
  }

  saveBtn?.addEventListener("click", save);
  clearBtn?.addEventListener("click", clear);
  openBtn?.addEventListener("click", openCapsule);

  load();
}

// ====== Кнопки UX ======
$("#btnConfetti").addEventListener("click", () => {
  burst(Math.random() * W, H * 0.25 + Math.random() * H * 0.15, 170);
  toast("🎆 Бум!");
});

$("#btnShare").addEventListener("click", () => {
  const link = `https://${OWNER}.github.io/${REPO}/`;
  copy(link);
});

$("#btnOpenFriends").addEventListener("click", () => {
  openModal({
    title: "Друзья 🎄",
    sub: "Нажми на любого в списке — и получишь персональную ссылку",
    bodyHTML: `<div class="muted">Список ниже на странице. Просто кликай по карточкам друзей.</div>`,
    primaryText: "Ок"
  });
});

$("#btnOpenRecap").addEventListener("click", () => {
  openModal({
    title: "Итоги года ✨",
    sub: "Хочешь сделать прям персонально?",
    bodyHTML: `
      <div style="display:grid;gap:10px;">
        <div>Открой <span class="code">app.js</span> → массив <span class="code">RECAP</span> и впиши свои итоги.</div>
        <div class="muted" style="font-size:12px;">Например: “проекты”, “новые люди”, “главный урок”, “план на 2026”.</div>
      </div>
    `,
    primaryText: "Понял"
  });
});

// ====== Старт ======
resize();
initPersonal();
animateCounters();
renderFriends();
renderRecap();
initMusic();
initCapsule();
tick();

// маленький авто-салют при заходе
setTimeout(() => burst(W * 0.55, H * 0.28, 150), 350);
setTimeout(() => burst(W * 0.35, H * 0.32, 140), 650);
