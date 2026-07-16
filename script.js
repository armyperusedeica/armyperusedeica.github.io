const FALLBACK_CONFIG = {
  siteName: "ARMY PERÚ Sede Ica",
  discordInviteUrl: "https://discord.gg/TU_INVITACION",
  facebookPageUrl: "https://www.facebook.com/TU_PAGINA",
  xProfileUrl: "https://x.com/TU_USUARIO",
  instagramUrl: "https://www.instagram.com/TU_USUARIO/",
  tiktokUrl: "https://www.tiktok.com/@TU_USUARIO",
  googleCalendarApiKey: "PEGA_AQUI_TU_API_KEY",
  officialCalendarApiKey: "PEGA_AQUI_TU_API_KEY",
  calendars: [
    {
      key: "sede",
      type: "sede",
      label: "Sede Ica",
      calendarId: "ac1f7aecc7b1d38bcd41ecc85b33f23dab759578e8ca0c87d926ffcab9f74b0c@group.calendar.google.com",
      timeZone: "America/Lima",
      credit: "Calendario creado por ARMY Perú Sede Ica",
      sourceUrl: "https://calendar.google.com/calendar/u/3?cid=YWMxZjdhZWNjN2IxZDM4YmNkNDFlY2M4NWIzM2YyM2RhYjc1OTU3OGU4Y2EwYzg3ZDkyNmZmY2FiOWY3NGIwY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
    },
    {
      key: "bts",
      type: "bts",
      label: "BTS oficial",
      calendarId: "foreverpurple130613@gmail.com",
      timeZone: "Asia/Seoul",
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
  calendarSources: [],
  calendarStatuses: [],
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

function isConfiguredApiKey(value) {
  const key = String(value || "").trim();
  return key && !key.includes("PEGA_AQUI") && !key.includes("TU_API_KEY");
}

function stripHTML(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : "";
}

function normalizeCalendarSources(config) {
  if (Array.isArray(config.calendars) && config.calendars.length) {
    return config.calendars
      .map((calendar) => ({
        key: calendar.key || calendar.type,
        type: calendar.type === "bts" ? "bts" : "sede",
        label: calendar.label || (calendar.type === "bts" ? "BTS oficial" : "Sede Ica"),
        calendarId: String(calendar.calendarId || "").trim(),
        timeZone: calendar.timeZone || (calendar.type === "bts" ? "Asia/Seoul" : "America/Lima"),
        credit: calendar.credit || "",
        sourceUrl: calendar.sourceUrl || ""
      }))
      .filter((calendar) => calendar.calendarId);
  }

  return [
    {
      key: "sede",
      type: "sede",
      label: "Sede Ica",
      calendarId: "ac1f7aecc7b1d38bcd41ecc85b33f23dab759578e8ca0c87d926ffcab9f74b0c@group.calendar.google.com",
      timeZone: "America/Lima",
      credit: "Calendario creado por ARMY Perú Sede Ica",
      sourceUrl: "https://calendar.google.com/calendar/u/3?cid=YWMxZjdhZWNjN2IxZDM4YmNkNDFlY2M4NWIzM2YyM2RhYjc1OTU3OGU4Y2EwYzg3ZDkyNmZmY2FiOWY3NGIwY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
    },
    {
      key: "bts",
      type: "bts",
      label: config.officialCalendarLabel || "BTS oficial",
      calendarId: config.officialCalendarId || "foreverpurple130613@gmail.com",
      timeZone: config.officialCalendarTimeZone || "Asia/Seoul",
      credit: config.officialCalendarCredit || "Calendario BTS oficial compartido por foreverpurple130613@gmail.com",
      sourceUrl: config.officialCalendarSourceUrl || "https://calendar.google.com/calendar/u/0/newembed?src=foreverpurple130613@gmail.com&ctz=Asia/Seoul"
    }
  ];
}

function getCalendarApiKey() {
  return state.config.googleCalendarApiKey || state.config.officialCalendarApiKey || "";
}

function getApiFetchRange() {
  const now = new Date();
  return {
    timeMin: new Date(now.getFullYear() - 1, 0, 1).toISOString(),
    timeMax: new Date(now.getFullYear() + 2, 11, 31, 23, 59, 59).toISOString()
  };
}

function googleDatePart(googleDate) {
  if (!googleDate) return "";
  if (googleDate.date) return googleDate.date;
  if (googleDate.dateTime) return googleDate.dateTime.slice(0, 10);
  return "";
}

function googleTimePart(googleDate) {
  if (!googleDate || !googleDate.dateTime) return "";
  return googleDate.dateTime.slice(11, 16);
}

function googleEventToLocalEvent(item, calendar) {
  const date = googleDatePart(item.start);
  if (!date) return null;

  const htmlLink = safeUrl(item.htmlLink);
  const description = stripHTML(item.description || "").slice(0, 320);

  return {
    title: stripHTML(item.summary || `Evento ${calendar.label}`),
    date,
    startTime: googleTimePart(item.start),
    endTime: googleTimePart(item.end),
    type: calendar.type,
    sourceKey: calendar.key,
    sourceLabel: calendar.label,
    timeZone: calendar.timeZone,
    location: stripHTML(item.location || (calendar.type === "bts" ? "Canales oficiales" : "Por confirmar")),
    description: description || `Evento sincronizado desde ${calendar.label}.`,
    link: htmlLink,
    source: "google-calendar"
  };
}

async function loadGoogleCalendarEvents(calendar) {
  const apiKey = String(getCalendarApiKey()).trim();

  if (!calendar.calendarId || !isConfiguredApiKey(apiKey)) {
    return {
      calendar,
      status: {
        type: calendar.type,
        label: calendar.label,
        state: "missing-key",
        count: 0,
        message: "Falta pegar la Google Calendar API key en data/config.json."
      },
      events: []
    };
  }

  try {
    const { timeMin, timeMax } = getApiFetchRange();
    const params = new URLSearchParams({
      key: apiKey,
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "2500",
      timeMin,
      timeMax,
      timeZone: calendar.timeZone
    });

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.calendarId)}/events?${params.toString()}`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Google Calendar respondió ${response.status}. ${detail}`);
    }

    const payload = await response.json();
    const items = Array.isArray(payload.items) ? payload.items : [];
    const events = items.map((item) => googleEventToLocalEvent(item, calendar)).filter(Boolean);

    return {
      calendar,
      status: {
        type: calendar.type,
        label: calendar.label,
        state: "connected",
        count: events.length,
        message: `${events.length} evento${events.length === 1 ? "" : "s"} sincronizado${events.length === 1 ? "" : "s"}.`
      },
      events
    };
  } catch (error) {
    console.warn(error);
    return {
      calendar,
      status: {
        type: calendar.type,
        label: calendar.label,
        state: "error",
        count: 0,
        message: "No se pudo sincronizar. Revisa que el calendario sea público, que la API key sea correcta y que Google Calendar API esté activada."
      },
      events: []
    };
  }
}

async function loadAllGoogleCalendarEvents() {
  const results = await Promise.all(state.calendarSources.map(loadGoogleCalendarEvents));
  state.calendarStatuses = results.map((result) => result.status);
  return results.flatMap((result) => result.events);
}

function parseLocalDate(dateString) {
  const [year, month, day] = String(dateString).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatMonth(date) {
  const raw = new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric" }).format(date);
  return raw.charAt(0).toUpperCase() + raw.slice(1);
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
      .sort((a, b) => {
        const typeOrder = a.type.localeCompare(b.type);
        if (a.startTime || b.startTime) return (a.startTime || "99:99").localeCompare(b.startTime || "99:99");
        return typeOrder;
      });

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
      chip.title = `${event.sourceLabel}: ${event.title}`;
      chip.addEventListener("click", () => scrollToEvent(event));
      eventsWrap.appendChild(chip);
    });

    if (dayEvents.length > 3) {
      const more = document.createElement("span");
      more.className = "calendar-chip more";
      more.textContent = `+${dayEvents.length - 3} más`;
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

  const title = document.querySelector("#event-panel-title");
  if (title) {
    title.textContent = state.calendarFilter === "bts"
      ? "Eventos BTS oficiales"
      : state.calendarFilter === "sede"
        ? "Eventos de la sede"
        : "Agenda completa";
  }

  const month = state.date.getMonth();
  const year = state.date.getFullYear();

  const monthEvents = state.events
    .filter((event) => {
      const eventDate = parseLocalDate(event.date);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year && eventMatchesFilter(event);
    })
    .sort((a, b) => {
      const dateDiff = String(a.date).localeCompare(String(b.date));
      if (dateDiff !== 0) return dateDiff;
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

    const typeLabel = event.sourceLabel || (event.type === "bts" ? "BTS oficial" : "Sede Ica");
    const time = event.startTime ? `${event.startTime}${event.endTime ? ` – ${event.endTime}` : ""}` : "Todo el día";
    const title = escapeHTML(event.title || "Evento");
    const description = escapeHTML(event.description || "Sin descripción.");
    const location = escapeHTML(event.location || "");
    const link = safeUrl(event.link);
    const zone = event.timeZone ? ` · ${escapeHTML(event.timeZone)}` : "";

    article.innerHTML = `
      <div class="event-meta">
        <span class="badge ${event.type}">${escapeHTML(typeLabel)}</span>
        <span>${formatDate(event.date)}</span>
        <span>${escapeHTML(time)}${zone}</span>
      </div>
      <h4>${title}</h4>
      <p>${description}</p>
      ${location ? `<p><strong>Lugar:</strong> ${location}</p>` : ""}
      ${link ? `<a class="event-link" href="${link}" target="_blank" rel="noopener">Ver detalle</a>` : ""}
    `;

    eventList.appendChild(article);
  });
}

function scrollToEvent(event) {
  renderEventList();
  const key = `${event.date}-${event.title}`;
  const target = Array.from(document.querySelectorAll(".event-item")).find((item) => item.dataset.eventKey === key);
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
  renderCalendarSources();
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

function renderCalendarSources() {
  const line = document.querySelector("#calendarSourceLine");
  if (!line) return;

  const relevantStatuses = state.calendarStatuses.filter((status) => {
    return state.calendarFilter === "all" || status.type === state.calendarFilter;
  });

  if (!relevantStatuses.length) {
    line.innerHTML = "";
    return;
  }

  const hasIssue = relevantStatuses.some((status) => status.state !== "connected");
  const statusHTML = relevantStatuses.map((status) => {
    const className = status.state === "connected" ? "ok" : "warning";
    const text = status.state === "connected"
      ? `${status.label}: ${status.count} evento${status.count === 1 ? "" : "s"}`
      : `${status.label}: ${status.message}`;
    return `<span class="source-pill ${className}">${escapeHTML(text)}</span>`;
  }).join("");

  const credits = state.calendarSources
    .filter((calendar) => state.calendarFilter === "all" || calendar.type === state.calendarFilter)
    .map((calendar) => calendar.credit)
    .filter(Boolean);

  line.innerHTML = `
    <div class="source-status-row">${statusHTML}</div>
    <p class="${hasIssue ? "source-help warning" : "source-help"}">
      ${hasIssue
        ? "Los eventos se mostrarán aquí cuando la API key esté configurada y los calendarios estén públicos."
        : `Fuentes: ${credits.map(escapeHTML).join(" · ")}`}
    </p>
  `;
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
  const [config, social, streaming] = await Promise.all([
    fetchJSON("data/config.json", FALLBACK_CONFIG),
    fetchJSON("data/social-updates.json", FALLBACK_SOCIAL),
    fetchJSON("data/streaming.json", FALLBACK_STREAMING)
  ]);

  state.config = { ...FALLBACK_CONFIG, ...config };
  state.calendarSources = normalizeCalendarSources(state.config);
  state.events = await loadAllGoogleCalendarEvents();
  state.social = Array.isArray(social) ? social : FALLBACK_SOCIAL;
  state.streaming = Array.isArray(streaming) ? streaming : FALLBACK_STREAMING;

  setLinks();
  bindUI();
  renderCalendar();
  renderCalendarSources();
  renderSocial();
  renderStreaming();
  showRoute(currentRouteFromHash(), { preserveScroll: true });
}

init();
