const FALLBACK_CONFIG = {
  siteName: "ARMY PERÚ Sede Ica",
  discordInviteUrl: "https://discord.gg/TU_INVITACION",
  facebookPageUrl: "https://www.facebook.com/TU_PAGINA",
  xProfileUrl: "https://x.com/TU_USUARIO",
  instagramUrl: "https://www.instagram.com/TU_USUARIO/",
  tiktokUrl: "https://www.tiktok.com/@TU_USUARIO",
  sedeCalendarEmbedUrl: "",
  officialCalendarEmbedUrl: ""
};

const FALLBACK_EVENTS = [
  {
    title: "Reunión de coordinación de admins",
    date: "2026-07-06",
    startTime: "20:00",
    endTime: "21:00",
    type: "sede",
    location: "Discord",
    description: "Revisión de actividades, campañas de streaming y próximos proyectos de la sede.",
    link: ""
  },
  {
    title: "Streaming party — YouTube & Spotify",
    date: "2026-07-12",
    startTime: "19:00",
    endTime: "22:00",
    type: "sede",
    location: "Discord",
    description: "Sesión comunitaria para apoyar las metas de la base Ica.",
    link: ""
  },
  {
    title: "Fecha oficial BTS — actualizar",
    date: "2026-07-18",
    startTime: "",
    endTime: "",
    type: "bts",
    location: "Canales oficiales",
    description: "Ejemplo de evento oficial. Reemplazar por una fecha real o conectarlo a un calendario público.",
    link: ""
  }
];

const FALLBACK_SOCIAL = [
  {
    platform: "facebook",
    date: "2026-07-01",
    title: "Convocatoria de voluntarias",
    text: "Publicación destacada para coordinar próximas actividades de la sede.",
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
  date: new Date(),
  calendarFilter: "all",
  socialFilter: "all",
  streamFilter: "all",
  events: [],
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

function parseLocalDate(dateString) {
  const [year, month, day] = String(dateString).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatMonth(date) {
  return new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric" }).format(date);
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("es-PE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(parseLocalDate(dateString));
}

function getMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const cells = [];

  for (let i = 0; i < totalCells; i += 1) {
    const dayNumber = i - startOffset + 1;
    cells.push(new Date(year, month, dayNumber));
  }

  return cells;
}

function eventMatchesFilter(event) {
  return state.calendarFilter === "all" || event.type === state.calendarFilter;
}

function renderCalendar() {
  const calendarGrid = document.querySelector("#calendarGrid");
  const currentMonth = document.querySelector("#currentMonth");
  if (!calendarGrid || !currentMonth) return;

  const cells = getMonthDays(state.date);
  const viewMonth = state.date.getMonth();
  const today = new Date();

  currentMonth.textContent = formatMonth(state.date);
  calendarGrid.innerHTML = "";

  cells.forEach((cellDate) => {
    const dateKey = toDateKey(cellDate);
    const dayEvents = state.events
      .filter((event) => event.date === dateKey && eventMatchesFilter(event))
      .sort((a, b) => (a.startTime || "99:99").localeCompare(b.startTime || "99:99"));

    const day = document.createElement("div");
    day.className = "calendar-day";

    if (cellDate.getMonth() !== viewMonth) day.classList.add("muted");
    if (
      cellDate.getFullYear() === today.getFullYear() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getDate() === today.getDate()
    ) {
      day.classList.add("today");
    }

    const dayNumber = document.createElement("span");
    dayNumber.className = "day-number";
    dayNumber.textContent = cellDate.getDate();
    day.appendChild(dayNumber);

    const eventsWrap = document.createElement("div");
    eventsWrap.className = "day-events";

    dayEvents.slice(0, 3).forEach((event) => {
      const chip = document.createElement("button");
      chip.className = `calendar-chip ${event.type}`;
      chip.textContent = event.title;
      chip.title = event.title;
      chip.addEventListener("click", () => scrollToEvent(event));
      eventsWrap.appendChild(chip);
    });

    if (dayEvents.length > 3) {
      const more = document.createElement("span");
      more.className = "calendar-chip sede";
      more.textContent = `+${dayEvents.length - 3}`;
      eventsWrap.appendChild(more);
    }

    day.appendChild(eventsWrap);
    calendarGrid.appendChild(day);
  });

  renderEventList();
}

function renderEventList() {
  const eventList = document.querySelector("#eventList");
  if (!eventList) return;

  const month = state.date.getMonth();
  const year = state.date.getFullYear();

  const monthEvents = state.events
    .filter((event) => {
      const eventDate = parseLocalDate(event.date);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year && eventMatchesFilter(event);
    })
    .sort((a, b) => {
      const byDate = a.date.localeCompare(b.date);
      if (byDate !== 0) return byDate;
      return (a.startTime || "99:99").localeCompare(b.startTime || "99:99");
    });

  eventList.innerHTML = "";

  if (!monthEvents.length) {
    eventList.innerHTML = `<div class="empty-state">No hay eventos para este filtro en el mes seleccionado.</div>`;
    return;
  }

  monthEvents.forEach((event) => {
    const article = document.createElement("article");
    article.className = "event-item";
    article.dataset.eventKey = `${event.date}-${event.title}`;

    const typeLabel = event.type === "bts" ? "BTS oficial" : "Sede Ica";
    const time = event.startTime ? `${event.startTime}${event.endTime ? ` – ${event.endTime}` : ""}` : "Todo el día";

    article.innerHTML = `
      <div class="event-meta">
        <span class="badge ${event.type}">${typeLabel}</span>
        <span>${formatDate(event.date)}</span>
        <span>${time}</span>
      </div>
      <h4>${event.title}</h4>
      <p>${event.description || "Sin descripción."}</p>
      ${event.location ? `<p><strong>Lugar:</strong> ${event.location}</p>` : ""}
      ${event.link ? `<a class="event-link" href="${event.link}" target="_blank" rel="noopener">Ver detalle</a>` : ""}
    `;

    eventList.appendChild(article);
  });
}

function scrollToEvent(event) {
  const key = `${event.date}-${event.title}`;
  const target = document.querySelector(`[data-event-key="${CSS.escape(key)}"]`);
  if (!target) return;
  target.classList.add("highlight");
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => target.classList.remove("highlight"), 1700);
}

function setCalendarFilter(filter) {
  state.calendarFilter = filter;
  document.querySelectorAll(".filter-btn[data-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
  renderCalendar();
}

function normalizePlatform(value) {
  return String(value || "").trim().toLowerCase();
}

function setSocialFilter(filter) {
  state.socialFilter = filter;
  document.querySelectorAll(".social-filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.socialButton === filter);
  });
  renderSocial();
}

function setStreamFilter(filter) {
  state.streamFilter = filter;
  document.querySelectorAll(".stream-filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.streamButton === filter);
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
        <span class="platform-icon">${data.short}</span>
        <span class="platform-label">${data.label}</span>
      </div>
      <div class="card-meta"><span>${item.date ? formatDate(item.date) : "Sin fecha"}</span></div>
      <h3>${item.title || "Actualización"}</h3>
      <p>${item.text || "Agregar descripción de la publicación."}</p>
      <a class="card-link" href="${updateUrl}" target="_blank" rel="noopener">Abrir publicación</a>
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
    const platform = item.platform || "Plataforma";
    const short = platform
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();

    const card = document.createElement("article");
    card.className = "streaming-card";
    card.innerHTML = `
      <div class="platform-head">
        <span class="platform-icon">${short}</span>
        <span class="platform-label">${platform}</span>
      </div>
      <div class="card-meta">
        <span>${item.status || "En actualización"}</span>
        <span>Actualizado: ${item.updated ? formatDate(item.updated) : "sin fecha"}</span>
      </div>
      <h3>${item.project || "Meta de streaming"}</h3>
      <p>${item.note || "Agregar indicaciones de campaña."}</p>
      <div class="progress-wrap" aria-label="Avance ${progress}%">
        <div class="progress-label"><span>${item.current || `${progress}%`}</span><span>Meta: ${item.target || "100%"}</span></div>
        <div class="progress-bar"><span style="width: ${progress}%"></span></div>
      </div>
      ${item.url ? `<a class="card-link" href="${item.url}" target="_blank" rel="noopener">Abrir campaña</a>` : ""}
    `;
    streamingGrid.appendChild(card);
  });
}

function renderCalendarEmbeds() {
  const wrap = document.querySelector("#calendarEmbedWrap");
  const grid = document.querySelector("#calendarEmbeds");
  if (!wrap || !grid) return;

  const embeds = [
    { title: "Sede Ica", url: state.config.sedeCalendarEmbedUrl },
    { title: "BTS oficial", url: state.config.officialCalendarEmbedUrl }
  ].filter((item) => item.url);

  if (!embeds.length) {
    wrap.hidden = true;
    return;
  }

  wrap.hidden = false;
  grid.innerHTML = embeds
    .map((item) => `<iframe title="Calendario ${item.title}" src="${item.url}" loading="lazy"></iframe>`)
    .join("");
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

  document.querySelector("#prevMonth")?.addEventListener("click", () => {
    state.date = new Date(state.date.getFullYear(), state.date.getMonth() - 1, 1);
    renderCalendar();
  });

  document.querySelector("#nextMonth")?.addEventListener("click", () => {
    state.date = new Date(state.date.getFullYear(), state.date.getMonth() + 1, 1);
    renderCalendar();
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
  const [config, events, social, streaming] = await Promise.all([
    fetchJSON("data/config.json", FALLBACK_CONFIG),
    fetchJSON("data/events.json", FALLBACK_EVENTS),
    fetchJSON("data/social-updates.json", FALLBACK_SOCIAL),
    fetchJSON("data/streaming.json", FALLBACK_STREAMING)
  ]);

  state.config = { ...FALLBACK_CONFIG, ...config };
  state.events = Array.isArray(events) ? events : FALLBACK_EVENTS;
  state.social = Array.isArray(social) ? social : FALLBACK_SOCIAL;
  state.streaming = Array.isArray(streaming) ? streaming : FALLBACK_STREAMING;

  setLinks();
  bindUI();
  renderCalendar();
  renderSocial();
  renderStreaming();
  renderCalendarEmbeds();
  showRoute(currentRouteFromHash(), { preserveScroll: true });
}

init();
