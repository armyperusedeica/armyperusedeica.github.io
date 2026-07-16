const FALLBACK_CONFIG = {
  siteName: "ARMY PERÚ Sede Ica",
  discordInviteUrl: "https://discord.gg/TU_INVITACION",
  facebookPageUrl: "https://www.facebook.com/TU_PAGINA",
  xProfileUrl: "https://x.com/TU_USUARIO",
  instagramUrl: "https://www.instagram.com/TU_USUARIO/",
  tiktokUrl: "https://www.tiktok.com/@TU_USUARIO",
  calendarEmbedTimeZone: "America/Lima",
  calendars: [
    {
      key: "sede",
      type: "sede",
      label: "Sede Ica",
      calendarId: "ac1f7aecc7b1d38bcd41ecc85b33f23dab759578e8ca0c87d926ffcab9f74b0c@group.calendar.google.com",
      timeZone: "America/Lima",
      color: "#E91E63",
      credit: "Calendario creado por ARMY Perú Sede Ica",
      sourceUrl: "https://calendar.google.com/calendar/u/3?cid=YWMxZjdhZWNjN2IxZDM4YmNkNDFlY2M4NWIzM2YyM2RhYjc1OTU3OGU4Y2EwYzg3ZDkyNmZmY2FiOWY3NGIwY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
    },
    {
      key: "bts",
      type: "bts",
      label: "BTS oficial",
      calendarId: "foreverpurple130613@gmail.com",
      timeZone: "Asia/Seoul",
      color: "#7E57C2",
      credit: "Calendario BTS oficial compartido por foreverpurple130613@gmail.com",
      sourceUrl: "https://calendar.google.com/calendar/u/0/newembed?src=foreverpurple130613@gmail.com&ctz=Asia/Seoul"
    }
  ]
};

const FALLBACK_SOCIAL = [
  {
    platform: "facebook",
    date: "2026-07-01",
    title: "Convocatoria de voluntarias",
    text: "Publicación destacada para coordinar próximas actividades de la sede.",
    url: "#"
  },
  {
    platform: "facebook",
    date: "2026-07-05",
    title: "Resumen de actividad local",
    text: "Actualizar con el enlace de la publicación de Facebook.",
    url: "#"
  },
  {
    platform: "twitter",
    date: "2026-07-02",
    title: "Hashtags del día",
    text: "Actualización para campañas de difusión y streaming.",
    url: "#"
  },
  {
    platform: "instagram",
    date: "2026-07-03",
    title: "Historias destacadas",
    text: "Recordatorio visual para revisar historias y publicaciones recientes.",
    url: "#"
  },
  {
    platform: "tiktok",
    date: "2026-07-04",
    title: "Nuevo video de la sede",
    text: "Contenido corto para difundir actividades y dinámicas de la comunidad.",
    url: "#"
  }
];

const FALLBACK_STREAMING = [
  {
    platform: "YouTube",
    project: "Meta semanal de reproducciones",
    current: "72% completado",
    target: "100%",
    progress: 72,
    status: "En campaña",
    updated: "2026-07-01",
    note: "Actualizar con el avance real de la base Ica.",
    url: ""
  },
  {
    platform: "Spotify",
    project: "Playlist focus",
    current: "48% completado",
    target: "100%",
    progress: 48,
    status: "En progreso",
    updated: "2026-07-01",
    note: "Registrar metas, playlists y logros semanales.",
    url: ""
  },
  {
    platform: "Apple Music",
    project: "Campaña de apoyo",
    current: "35% completado",
    target: "100%",
    progress: 35,
    status: "Inicio",
    updated: "2026-07-01",
    note: "Agregar datos validados por las admins.",
    url: ""
  }
];

const state = {
  calendarFilter: "all",
  socialFilter: "all",
  streamFilter: "all",
  calendarSources: [],
  social: [],
  streaming: [],
  config: FALLBACK_CONFIG
};

const routes = ["inicio", "calendario", "redes", "streaming", "discord"];

const platformData = {
  facebook: { label: "Facebook", short: "FB", configKey: "facebookPageUrl" },
  twitter: { label: "X/Twitter", short: "X", configKey: "xProfileUrl" },
  instagram: { label: "Instagram", short: "IG", configKey: "instagramUrl" },
  tiktok: { label: "TikTok", short: "TT", configKey: "tiktokUrl" }
};

async function fetchJSON(path, fallback) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
    return await response.json();
  } catch (error) {
    console.warn(error.message);
    return fallback;
  }
}

function escapeHTML(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function safeUrl(value) {
  const url = String(value || "").trim();
  return /^https?:\/\//i.test(url) ? url : "";
}

function normalizeCalendarSources(config) {
  const sources = Array.isArray(config.calendars) && config.calendars.length
    ? config.calendars
    : FALLBACK_CONFIG.calendars;

  return sources
    .map((calendar) => ({
      key: calendar.key || calendar.type,
      type: calendar.type === "bts" ? "bts" : "sede",
      label: calendar.label || (calendar.type === "bts" ? "BTS oficial" : "Sede Ica"),
      calendarId: String(calendar.calendarId || "").trim(),
      timeZone: calendar.timeZone || (calendar.type === "bts" ? "Asia/Seoul" : "America/Lima"),
      color: calendar.color || (calendar.type === "bts" ? "#7E57C2" : "#E91E63"),
      credit: calendar.credit || "",
      sourceUrl: calendar.sourceUrl || ""
    }))
    .filter((calendar) => calendar.calendarId);
}

function selectedCalendars() {
  if (state.calendarFilter === "all") return state.calendarSources;
  return state.calendarSources.filter((calendar) => calendar.type === state.calendarFilter);
}

function buildGoogleCalendarEmbedUrl(calendars) {
  const selected = calendars.length ? calendars : state.calendarSources;
  const params = new URLSearchParams();

  params.set("height", "760");
  params.set("wkst", "2");
  params.set("bgcolor", "#ffffff");
  params.set("showTitle", "0");
  params.set("showNav", "1");
  params.set("showDate", "1");
  params.set("showPrint", "0");
  params.set("showTabs", "0");
  params.set("showCalendars", "0");
  params.set("showTz", "1");
  params.set("mode", "MONTH");

  const timeZone = state.calendarFilter === "bts"
    ? (selected[0]?.timeZone || "Asia/Seoul")
    : (state.config.calendarEmbedTimeZone || "America/Lima");
  params.set("ctz", timeZone);

  selected.forEach((calendar) => {
    params.append("src", calendar.calendarId);
    params.append("color", calendar.color);
  });

  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
}

function updateCalendarEmbed() {
  const iframe = document.querySelector("#googleCalendarFrame");
  const sourceLine = document.querySelector("#calendarSourceLine");
  const credit = document.querySelector("#calendarCredit");
  const openLink = document.querySelector("#openCalendarLink");
  const browserTitle = document.querySelector("#calendarBrowserTitle");
  const viewTitle = document.querySelector("#calendarViewTitle");
  const viewDescription = document.querySelector("#calendarViewDescription");

  if (!iframe) return;

  const calendars = selectedCalendars();
  const embedUrl = buildGoogleCalendarEmbedUrl(calendars);
  iframe.src = embedUrl;

  const labels = calendars.map((calendar) => calendar.label);
  const credits = calendars.map((calendar) => calendar.credit).filter(Boolean);
  const title = state.calendarFilter === "bts"
    ? "BTS oficial"
    : state.calendarFilter === "sede"
      ? "Sede Ica"
      : "Agenda completa";

  const description = state.calendarFilter === "bts"
    ? "Solo eventos del calendario BTS oficial."
    : state.calendarFilter === "sede"
      ? "Solo eventos creados desde el calendario de ARMY Perú Sede Ica."
      : "Se muestran juntos los eventos de la sede y los eventos BTS oficiales.";

  if (browserTitle) browserTitle.textContent = title;
  if (viewTitle) viewTitle.textContent = title;
  if (viewDescription) viewDescription.textContent = description;
  if (openLink) openLink.href = embedUrl;

  if (sourceLine) {
    const tz = state.calendarFilter === "bts"
      ? (calendars[0]?.timeZone || "Asia/Seoul")
      : (state.config.calendarEmbedTimeZone || "America/Lima");
    sourceLine.innerHTML = `
      <div class="source-status-row">
        ${calendars.map((calendar) => `<span class="source-pill ok">${escapeHTML(calendar.label)}</span>`).join("")}
      </div>
      <p class="source-help">Vista mensual de Google Calendar · Zona horaria: ${escapeHTML(tz)} · ${escapeHTML(labels.join(" + "))}</p>
    `;
  }

  if (credit) {
    credit.innerHTML = credits.length
      ? `<strong>Créditos:</strong> ${credits.map(escapeHTML).join(" · ")}`
      : "";
  }
}

function setCalendarFilter(filter) {
  state.calendarFilter = ["all", "sede", "bts"].includes(filter) ? filter : "all";
  document.querySelectorAll(".filter-btn[data-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === state.calendarFilter);
  });
  updateCalendarEmbed();
}

function parseLocalDate(dateString) {
  const [year, month, day] = String(dateString).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(dateString) {
  const date = parseLocalDate(dateString);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return new Intl.DateTimeFormat("es-PE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function normalizePlatform(value) {
  return String(value || "").trim().toLowerCase();
}

function setSocialFilter(filter) {
  state.socialFilter = filter || "all";
  document.querySelectorAll(".social-filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.socialButton === state.socialFilter);
  });
  renderSocial();
}

function setStreamFilter(filter) {
  state.streamFilter = filter || "all";
  document.querySelectorAll(".stream-filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.streamButton === state.streamFilter);
  });
  renderStreaming();
}

function renderSocial() {
  const socialGrid = document.querySelector("#socialGrid");
  if (!socialGrid) return;

  const filtered = state.social
    .filter((item) => state.socialFilter === "all" || normalizePlatform(item.platform) === state.socialFilter)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  socialGrid.innerHTML = "";

  if (!filtered.length) {
    socialGrid.innerHTML = `<div class="empty-state">No hay actualizaciones para esta red todavía.</div>`;
    return;
  }

  filtered.forEach((item) => {
    const key = normalizePlatform(item.platform);
    const data = platformData[key] || { label: item.platform || "Red", short: "★", configKey: "" };
    const profileUrl = data.configKey ? state.config[data.configKey] : "";
    const updateUrl = item.url && item.url !== "#" ? item.url : profileUrl || "#";

    const card = document.createElement("article");
    card.className = "social-card";
    card.innerHTML = `
      <div class="platform-head">
        <span class="platform-icon">${escapeHTML(data.short)}</span>
        <span class="platform-label">${escapeHTML(data.label)}</span>
      </div>
      <div class="card-meta"><span>${item.date ? formatDate(item.date) : "Sin fecha"}</span></div>
      <h3>${escapeHTML(item.title || "Actualización")}</h3>
      <p>${escapeHTML(item.text || "Agregar descripción de la publicación.")}</p>
      <a class="card-link" href="${safeUrl(updateUrl) || '#'}" target="_blank" rel="noopener">Abrir publicación</a>
    `;
    socialGrid.appendChild(card);
  });
}

function renderStreaming() {
  const streamingGrid = document.querySelector("#streamingGrid");
  if (!streamingGrid) return;

  const filtered = state.streaming.filter((item) => {
    const platform = normalizePlatform(item.platform);
    return state.streamFilter === "all" || platform === state.streamFilter;
  });

  streamingGrid.innerHTML = "";

  if (!filtered.length) {
    streamingGrid.innerHTML = `<div class="empty-state">No hay campañas para esta plataforma todavía.</div>`;
    return;
  }

  filtered.forEach((item) => {
    const progress = Math.max(0, Math.min(100, Number(item.progress) || 0));
    const platform = item.platform || "Streaming";
    const short = platform.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();

    const card = document.createElement("article");
    card.className = "stream-card";
    card.innerHTML = `
      <div class="platform-head">
        <span class="platform-icon">${escapeHTML(short)}</span>
        <span class="platform-label">${escapeHTML(platform)}</span>
      </div>
      <div class="card-meta">
        <span>${escapeHTML(item.status || "En actualización")}</span>
        <span>Actualizado: ${item.updated ? formatDate(item.updated) : "sin fecha"}</span>
      </div>
      <h3>${escapeHTML(item.project || "Meta de streaming")}</h3>
      <p>${escapeHTML(item.note || "Agregar indicaciones de campaña.")}</p>
      <div class="progress-wrap" aria-label="Avance ${progress}%">
        <div class="progress-label"><span>${escapeHTML(item.current || `${progress}%`)}</span><span>Meta: ${escapeHTML(item.target || "100%")}</span></div>
        <div class="progress-bar"><span style="width: ${progress}%"></span></div>
      </div>
      ${item.url ? `<a class="card-link" href="${safeUrl(item.url)}" target="_blank" rel="noopener">Abrir campaña</a>` : ""}
    `;
    streamingGrid.appendChild(card);
  });
}

function setLinks() {
  const discordUrl = state.config.discordInviteUrl || "#discord";
  document.querySelectorAll("#discordBtn, #discordHeroBtn").forEach((link) => {
    link.href = discordUrl;
    if (discordUrl.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noopener";
    }
  });
}

function showRoute(route, options = {}) {
  const validRoute = routes.includes(route) ? route : "inicio";

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === validRoute);
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("active", href === `#${validRoute}`);
  });

  const nav = document.querySelector("#mainNav");
  const toggle = document.querySelector("#menuToggle");
  nav?.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");

  if (!options.preserveScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function currentRouteFromHash() {
  const hash = decodeURIComponent(window.location.hash.replace("#", "")).trim();
  return routes.includes(hash) ? hash : "inicio";
}

function bindUI() {
  document.querySelector("#menuToggle")?.addEventListener("click", () => {
    const nav = document.querySelector("#mainNav");
    const isOpen = nav.classList.toggle("open");
    document.querySelector("#menuToggle")?.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".filter-btn[data-filter]").forEach((button) => {
    button.addEventListener("click", () => setCalendarFilter(button.dataset.filter));
  });

  document.querySelectorAll(".social-filter").forEach((button) => {
    button.addEventListener("click", () => setSocialFilter(button.dataset.socialButton));
  });

  document.querySelectorAll(".stream-filter").forEach((button) => {
    button.addEventListener("click", () => setStreamFilter(button.dataset.streamButton));
  });

  document.addEventListener("click", (event) => {
    const calendarLink = event.target.closest("[data-calendar-filter]");
    if (calendarLink) setCalendarFilter(calendarLink.dataset.calendarFilter);

    const socialLink = event.target.closest("[data-social-filter]");
    if (socialLink) setSocialFilter(socialLink.dataset.socialFilter);

    const streamLink = event.target.closest("[data-stream-filter]");
    if (streamLink) setStreamFilter(streamLink.dataset.streamFilter);
  });

  window.addEventListener("hashchange", () => showRoute(currentRouteFromHash()));
}

async function init() {
  const [config, social, streaming] = await Promise.all([
    fetchJSON("data/config.json", FALLBACK_CONFIG),
    fetchJSON("data/social-updates.json", FALLBACK_SOCIAL),
    fetchJSON("data/streaming.json", FALLBACK_STREAMING)
  ]);

  state.config = { ...FALLBACK_CONFIG, ...config };
  state.calendarSources = normalizeCalendarSources(state.config);
  state.social = Array.isArray(social) ? social : FALLBACK_SOCIAL;
  state.streaming = Array.isArray(streaming) ? streaming : FALLBACK_STREAMING;

  setLinks();
  bindUI();
  setCalendarFilter("all");
  renderSocial();
  renderStreaming();
  showRoute(currentRouteFromHash(), { preserveScroll: true });
}

init();
