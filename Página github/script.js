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
  filter: "all",
  events: [],
  social: [],
  streaming: [],
  config: FALLBACK_CONFIG
};

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
  const [year, month, day] = dateString.split("-").map(Number);
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
    const current = new Date(year, month, dayNumber);
    cells.push(current);
  }

  return cells;
}

function eventMatchesFilter(event) {
  return state.filter === "all" || event.type === state.filter;
}

function renderCalendar() {
  const calendarGrid = document.querySelector("#calendarGrid");
  const currentMonth = document.querySelector("#currentMonth");
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

  if (!monthEvents.length) {
    eventList.innerHTML = '<div class="empty-state">No hay eventos registrados para este filtro en el mes seleccionado.</div>';
    return;
  }

  eventList.innerHTML = monthEvents.map((event, index) => `
    <article class="event-card ${event.type}" id="event-${index}-${event.date.replaceAll("-", "")}">
      <time>${formatDate(event.date)}${event.startTime ? ` · ${event.startTime}${event.endTime ? `–${event.endTime}` : ""}` : ""}</time>
      <h4>${escapeHTML(event.title)}</h4>
      <p>${escapeHTML(event.description || "")}</p>
      ${event.location ? `<p><strong>Lugar:</strong> ${escapeHTML(event.location)}</p>` : ""}
      ${event.link ? `<a href="${event.link}" target="_blank" rel="noopener">Ver enlace</a>` : ""}
    </article>
  `).join("");
}

function scrollToEvent(event) {
  const eventCards = [...document.querySelectorAll(".event-card")];
  const target = eventCards.find((card) => card.textContent.includes(event.title));
  if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
}

function renderCalendarEmbeds() {
  const wrap = document.querySelector("#calendarEmbedWrap");
  const embeds = document.querySelector("#calendarEmbeds");
  const items = [
    { title: "Calendario Sede Ica", url: state.config.sedeCalendarEmbedUrl },
    { title: "Calendario BTS oficial", url: state.config.officialCalendarEmbedUrl }
  ].filter((item) => item.url && !item.url.includes("TU_") && item.url.trim() !== "");

  if (!items.length) {
    wrap.hidden = true;
    return;
  }

  wrap.hidden = false;
  embeds.innerHTML = items.map((item) => `
    <div class="embed-frame" title="${escapeHTML(item.title)}">
      <iframe src="${item.url}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  `).join("");
}

function renderSocial() {
  const socialGrid = document.querySelector("#socialGrid");
  const platforms = Object.keys(platformData);

  socialGrid.innerHTML = platforms.map((platform) => {
    const data = platformData[platform];
    const profileUrl = state.config[data.configKey] || "#";
    const updates = state.social
      .filter((item) => item.platform === platform)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3);

    return `
      <article class="social-card">
        <div class="social-card-header">
          <span class="social-icon">${data.short}</span>
          <h3>${data.label}</h3>
          <a class="profile-link" href="${profileUrl}" target="_blank" rel="noopener">Perfil</a>
        </div>
        ${renderPlatformEmbed(platform, profileUrl)}
        <div class="social-updates">
          ${updates.length ? updates.map(renderSocialUpdate).join("") : '<div class="empty-state">Aún no hay actualizaciones destacadas.</div>'}
        </div>
      </article>
    `;
  }).join("");

  loadTwitterWidgetIfNeeded();
}

function renderPlatformEmbed(platform, profileUrl) {
  const hasRealProfile = profileUrl && profileUrl !== "#" && !profileUrl.includes("TU_");

  if (platform === "facebook" && hasRealProfile) {
    const encoded = encodeURIComponent(profileUrl);
    return `
      <div class="embed-box">
        <iframe
          title="Facebook feed"
          src="https://www.facebook.com/plugins/page.php?href=${encoded}&tabs=timeline&width=360&height=260&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
        </iframe>
      </div>
    `;
  }

  if (platform === "twitter" && hasRealProfile) {
    return `
      <div class="embed-box">
        <a class="twitter-timeline" data-height="260" data-theme="dark" href="${profileUrl}">Tweets by la sede</a>
      </div>
    `;
  }

  const helper = platform === "instagram" || platform === "tiktok"
    ? "El feed completo suele requerir API o widget externo; aquí pueden destacar publicaciones manualmente."
    : "Coloca el enlace real en data/config.json para activar el widget.";

  return `<div class="embed-box"><span>${helper}</span></div>`;
}

function renderSocialUpdate(item) {
  return `
    <article class="social-update">
      <time>${formatDate(item.date)}</time>
      <h4>${escapeHTML(item.title)}</h4>
      <p>${escapeHTML(item.text || "")}</p>
      ${item.url && item.url !== "#" ? `<a href="${item.url}" target="_blank" rel="noopener">Ver publicación</a>` : ""}
    </article>
  `;
}

function loadTwitterWidgetIfNeeded() {
  if (!document.querySelector(".twitter-timeline")) return;
  if (window.twttr?.widgets) {
    window.twttr.widgets.load();
    return;
  }
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://platform.twitter.com/widgets.js";
  script.charset = "utf-8";
  document.body.appendChild(script);
}

function renderStreaming() {
  const streamingGrid = document.querySelector("#streamingGrid");

  streamingGrid.innerHTML = state.streaming.map((item) => {
    const progress = Math.max(0, Math.min(Number(item.progress) || 0, 100));
    const initials = item.platform.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();

    return `
      <article class="streaming-card">
        <div class="streaming-platform">
          <span class="platform-badge">${initials}</span>
          <div>
            <h3>${escapeHTML(item.platform)}</h3>
            <time>Actualizado: ${formatDate(item.updated)}</time>
          </div>
        </div>
        <h4>${escapeHTML(item.project)}</h4>
        <p>${escapeHTML(item.note || "")}</p>
        <div class="progress-meta">
          <span>${escapeHTML(item.current || "")}</span>
          <span>Meta: ${escapeHTML(item.target || "")}</span>
        </div>
        <div class="progress-bar" aria-label="${progress}% de avance">
          <span style="--progress:${progress}%"></span>
        </div>
        <p><strong>Estado:</strong> ${escapeHTML(item.status || "")}</p>
        ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener">Ver evidencia</a>` : ""}
      </article>
    `;
  }).join("");
}

function applyConfig() {
  document.title = state.config.siteName || "ARMY PERÚ Sede Ica";
  const discordUrl = state.config.discordInviteUrl || "#";
  document.querySelector("#discordBtn").href = discordUrl;
  document.querySelector("#discordHeroBtn").href = discordUrl && !discordUrl.includes("TU_") ? discordUrl : "#discord";
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setupEvents() {
  document.querySelector("#prevMonth").addEventListener("click", () => {
    state.date = new Date(state.date.getFullYear(), state.date.getMonth() - 1, 1);
    renderCalendar();
  });

  document.querySelector("#nextMonth").addEventListener("click", () => {
    state.date = new Date(state.date.getFullYear(), state.date.getMonth() + 1, 1);
    renderCalendar();
  });

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      state.filter = button.dataset.filter;
      renderCalendar();
    });
  });

  const menuToggle = document.querySelector("#menuToggle");
  const mainNav = document.querySelector("#mainNav");
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

async function init() {
  setupEvents();

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

  applyConfig();
  renderCalendar();
  renderCalendarEmbeds();
  renderSocial();
  renderStreaming();
}

init();
