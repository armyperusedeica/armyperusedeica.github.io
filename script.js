const DEFAULT_CONFIG = {
  siteName: "ARMY PERÚ Sede Ica",
  discordInviteUrl: "",
  discordServerId: "",
  facebookPageUrl: "",
  xProfileUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  calendarEmbedTimeZone: "America/Lima",
  calendars: [
    {
      key: "sede",
      type: "sede",
      label: "Sede Ica",
      calendarId: "ac1f7aecc7b1d38bcd41ecc85b33f23dab759578e8ca0c87d926ffcab9f74b0c@group.calendar.google.com",
      timeZone: "America/Lima",
      color: "#E91E63",
      credit: "Calendario creado por ARMY Perú Sede Ica"
    },
    {
      key: "bts",
      type: "bts",
      label: "BTS oficial",
      calendarId: "foreverpurple130613@gmail.com",
      timeZone: "Asia/Seoul",
      color: "#7E57C2",
      credit: "Calendario BTS oficial compartido por foreverpurple130613@gmail.com"
    }
  ]
};

const state = {
  route: "inicio",
  calendarFilter: "all",
  socialFilter: "all",
  streamFilter: "all",
  config: DEFAULT_CONFIG,
  calendarSources: [],
  socialUpdates: [],
  streaming: []
};

const ROUTES = ["inicio", "calendario", "redes", "streaming", "discord"];
const PLATFORMS = [
  { key: "facebook", label: "Facebook", short: "FB", configKey: "facebookPageUrl", note: "Página de Facebook de la sede." },
  { key: "twitter", label: "X/Twitter", short: "X", configKey: "xProfileUrl", note: "Hilos, avisos rápidos y campañas de difusión." },
  { key: "instagram", label: "Instagram", short: "IG", configKey: "instagramUrl", note: "Posts, historias y contenido visual." },
  { key: "tiktok", label: "TikTok", short: "TT", configKey: "tiktokUrl", note: "Videos cortos y dinámicas para la comunidad." }
];

async function fetchJSON(path, fallback) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(path);
    return await response.json();
  } catch (_) {
    return fallback;
  }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function validUrl(value) {
  const url = String(value || "").trim();
  if (!/^https?:\/\//i.test(url)) return "";
  if (/TU_|CAMBIAR|PENDIENTE|example\.com/i.test(url)) return "";
  return url;
}

function formatDate(dateString) {
  if (!dateString) return "Fecha por confirmar";
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function normalizeCalendars(config) {
  const calendars = Array.isArray(config.calendars) ? config.calendars : DEFAULT_CONFIG.calendars;
  return calendars
    .map((calendar) => ({
      key: calendar.key || calendar.type,
      type: calendar.type === "bts" ? "bts" : "sede",
      label: calendar.label || (calendar.type === "bts" ? "BTS oficial" : "Sede Ica"),
      calendarId: String(calendar.calendarId || "").trim(),
      timeZone: calendar.timeZone || (calendar.type === "bts" ? "Asia/Seoul" : "America/Lima"),
      color: calendar.color || (calendar.type === "bts" ? "#7E57C2" : "#E91E63"),
      credit: calendar.credit || ""
    }))
    .filter((calendar) => calendar.calendarId);
}

function selectedCalendars() {
  if (state.calendarFilter === "all") return state.calendarSources;
  return state.calendarSources.filter((calendar) => calendar.type === state.calendarFilter);
}

function buildCalendarUrl(calendars) {
  const params = new URLSearchParams({
    height: "760",
    wkst: "2",
    bgcolor: "#ffffff",
    showTitle: "0",
    showNav: "1",
    showDate: "1",
    showPrint: "0",
    showTabs: "0",
    showCalendars: "0",
    showTz: "1",
    mode: "MONTH",
    ctz: state.calendarFilter === "bts" ? (calendars[0]?.timeZone || "Asia/Seoul") : (state.config.calendarEmbedTimeZone || "America/Lima")
  });

  calendars.forEach((calendar) => {
    params.append("src", calendar.calendarId);
    params.append("color", calendar.color);
  });

  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
}

function setCalendarFilter(filter) {
  state.calendarFilter = ["all", "sede", "bts"].includes(filter) ? filter : "all";
  document.querySelectorAll("[data-calendar-button]").forEach((button) => {
    button.classList.toggle("active", button.dataset.calendarButton === state.calendarFilter);
  });
  updateCalendar();
}

function updateCalendar() {
  const calendars = selectedCalendars();
  const frame = document.querySelector("#googleCalendarFrame");
  const label = document.querySelector("#calendarFrameLabel");
  const title = document.querySelector("#calendarViewTitle");
  const desc = document.querySelector("#calendarViewDescription");
  const credit = document.querySelector("#calendarCredit");
  const openLink = document.querySelector("#calendarOpenLink");

  const labels = calendars.map((calendar) => calendar.label).join(" + ");
  const viewTitle = state.calendarFilter === "sede" ? "Sede Ica" : state.calendarFilter === "bts" ? "BTS oficial" : "Agenda completa";
  const viewDesc = state.calendarFilter === "sede" ? "Solo eventos creados por la sede." : state.calendarFilter === "bts" ? "Solo eventos del calendario BTS oficial." : "Sede Ica + BTS oficial";
  const url = buildCalendarUrl(calendars.length ? calendars : state.calendarSources);

  if (frame) frame.src = url;
  if (label) label.textContent = viewTitle;
  if (title) title.textContent = viewTitle;
  if (desc) desc.textContent = viewDesc;
  if (openLink) openLink.href = url;
  if (credit) {
    const credits = calendars.map((calendar) => calendar.credit).filter(Boolean);
    credit.innerHTML = credits.length ? `<strong>Créditos:</strong> ${credits.map(escapeHTML).join(" · ")}` : "";
  }
}

function renderPlatforms() {
  const grid = document.querySelector("#platformGrid");
  if (!grid) return;

  const platforms = PLATFORMS.filter((platform) => state.socialFilter === "all" || platform.key === state.socialFilter);
  grid.innerHTML = platforms.map((platform) => {
    const url = validUrl(state.config[platform.configKey]);
    return `
      <article class="platform-card">
        <div class="platform-top">
          <span class="platform-badge">${platform.short}</span>
          <span>${url ? "Conectado" : "Pendiente"}</span>
        </div>
        <h3>${platform.label}</h3>
        <p>${platform.note}</p>
        <a class="btn ${url ? "secondary" : "secondary disabled"}" ${url ? `href="${escapeHTML(url)}" target="_blank" rel="noopener"` : `href="#" aria-disabled="true"`}>${url ? "Abrir perfil" : "Agregar enlace"}</a>
      </article>
    `;
  }).join("");
}

function renderSocialEmbeds() {
  const grid = document.querySelector("#socialEmbedGrid");
  if (!grid) return;

  const cards = [];
  const facebookUrl = validUrl(state.config.facebookPageUrl);
  const xUrl = validUrl(state.config.xProfileUrl);
  const tiktokUrl = validUrl(state.config.tiktokUrl);
  const instagramUrl = validUrl(state.config.instagramUrl);

  if ((state.socialFilter === "all" || state.socialFilter === "facebook") && facebookUrl) {
    const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookUrl)}&tabs=timeline&width=500&height=560&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false`;
    cards.push(`<section class="embed-card"><h3>Facebook</h3><iframe title="Facebook ARMY Perú Sede Ica" src="${src}" height="560" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></section>`);
  }

  if ((state.socialFilter === "all" || state.socialFilter === "twitter") && xUrl) {
    cards.push(`<section class="embed-card"><h3>X/Twitter</h3><a class="twitter-timeline" data-height="560" data-theme="dark" href="${escapeHTML(xUrl)}">Tweets de ARMY Perú Sede Ica</a></section>`);
    loadScriptOnce("https://platform.twitter.com/widgets.js", "twitter-widgets");
  }

  if ((state.socialFilter === "all" || state.socialFilter === "instagram") && instagramUrl) {
    cards.push(`<section class="embed-card"><h3>Instagram</h3><div class="empty-box">Instagram no permite insertar un perfil completo de forma estable en webs externas. Usa el botón de perfil o agrega enlaces directos a posts en <strong>data/social-updates.json</strong>.</div></section>`);
  }

  if ((state.socialFilter === "all" || state.socialFilter === "tiktok") && tiktokUrl) {
    const user = tiktokUrl.split("/@")[1]?.replace(/\/$/, "") || "";
    if (user) {
      cards.push(`<section class="embed-card"><h3>TikTok</h3><blockquote class="tiktok-embed" cite="${escapeHTML(tiktokUrl)}" data-unique-id="${escapeHTML(user)}" data-embed-type="creator" style="max-width: 780px; min-width: 288px;"><section><a target="_blank" href="${escapeHTML(tiktokUrl)}">@${escapeHTML(user)}</a></section></blockquote></section>`);
      loadScriptOnce("https://www.tiktok.com/embed.js", "tiktok-embed-js");
    }
  }

  grid.innerHTML = cards.join("");
  grid.style.display = cards.length ? "grid" : "none";
}

function renderSocialUpdates() {
  const grid = document.querySelector("#socialUpdatesGrid");
  if (!grid) return;

  const items = state.socialUpdates
    .filter((item) => item && item.title)
    .filter((item) => state.socialFilter === "all" || String(item.platform || "").toLowerCase() === state.socialFilter);

  if (!items.length) {
    grid.innerHTML = `<div class="empty-box">No hay publicaciones destacadas registradas todavía. Cuando agreguen enlaces reales en <strong>data/social-updates.json</strong>, aparecerán aquí.</div>`;
    grid.style.display = "block";
    return;
  }

  grid.style.display = "grid";
  grid.innerHTML = items.map((item) => {
    const platform = String(item.platform || "red").toUpperCase();
    const url = validUrl(item.url);
    return `
      <article class="social-card">
        <span class="platform-badge">${escapeHTML(platform)}</span>
        <h3>${escapeHTML(item.title)}</h3>
        <time>${escapeHTML(formatDate(item.date))}</time>
        <p>${escapeHTML(item.text || "")}</p>
        ${url ? `<a class="btn secondary" href="${escapeHTML(url)}" target="_blank" rel="noopener">Ver publicación</a>` : ""}
      </article>
    `;
  }).join("");
}

function setSocialFilter(filter) {
  state.socialFilter = ["all", "facebook", "twitter", "instagram", "tiktok"].includes(filter) ? filter : "all";
  document.querySelectorAll("[data-social-button]").forEach((button) => button.classList.toggle("active", button.dataset.socialButton === state.socialFilter));
  renderPlatforms();
  renderSocialEmbeds();
  renderSocialUpdates();
}

function renderStreaming() {
  const grid = document.querySelector("#streamingGrid");
  if (!grid) return;

  const items = state.streaming
    .filter((item) => item && item.project)
    .filter((item) => state.streamFilter === "all" || String(item.platform || "").toLowerCase() === state.streamFilter);

  if (!items.length) {
    grid.innerHTML = `<div class="empty-box">Todavía no hay metas de streaming registradas. Agrega campañas reales en <strong>data/streaming.json</strong> para mostrar avances por plataforma.</div>`;
    grid.style.display = "block";
    return;
  }

  grid.style.display = "grid";
  grid.innerHTML = items.map((item) => {
    const progress = Math.max(0, Math.min(100, Number(item.progress || 0)));
    const url = validUrl(item.url);
    return `
      <article class="stream-card">
        <div class="stream-head">
          <span class="platform-badge">${escapeHTML(item.platform || "Streaming")}</span>
          <span class="percent">${progress}%</span>
        </div>
        <h3>${escapeHTML(item.project)}</h3>
        <p class="meta">Actualizado: ${escapeHTML(formatDate(item.updated))}</p>
        <div class="progress" aria-label="${progress}% completado"><span style="--progress:${progress}%"></span></div>
        <p><strong>${escapeHTML(item.current || "")}</strong>${item.target ? ` · Meta: ${escapeHTML(item.target)}` : ""}</p>
        <p>${escapeHTML(item.note || "")}</p>
        ${url ? `<a class="btn secondary" href="${escapeHTML(url)}" target="_blank" rel="noopener">Apoyar campaña</a>` : ""}
      </article>
    `;
  }).join("");
}

function setStreamFilter(filter) {
  state.streamFilter = ["all", "youtube", "spotify", "apple music"].includes(filter) ? filter : "all";
  document.querySelectorAll("[data-stream-button]").forEach((button) => button.classList.toggle("active", button.dataset.streamButton === state.streamFilter));
  renderStreaming();
}

function setupDiscord() {
  const inviteButton = document.querySelector("#discordInviteButton");
  const content = document.querySelector("#discordWidgetContent");
  const invite = validUrl(state.config.discordInviteUrl);
  const serverId = String(state.config.discordServerId || "").trim();

  if (inviteButton) {
    if (invite) {
      inviteButton.href = invite;
      inviteButton.classList.remove("disabled");
      inviteButton.removeAttribute("aria-disabled");
    } else {
      inviteButton.href = "#";
      inviteButton.classList.add("disabled");
      inviteButton.setAttribute("aria-disabled", "true");
      inviteButton.textContent = "Agregar invitación";
    }
  }

  if (content) {
    content.innerHTML = serverId
      ? `<iframe title="Discord ARMY Perú Sede Ica" src="https://discord.com/widget?id=${encodeURIComponent(serverId)}&theme=dark" allowtransparency="true" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>`
      : `Activa el widget de Discord y coloca el <strong>discordServerId</strong> en <strong>data/config.json</strong> para mostrar el estado del servidor aquí.`;
  }
}

function loadScriptOnce(src, id) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
}

function showRoute(route) {
  state.route = ROUTES.includes(route) ? route : "inicio";
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === state.route));
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("active", href === `#${state.route}`);
  });
  document.querySelector("#mainNav")?.classList.remove("open");
  document.querySelector("#menuToggle")?.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "instant" });
}

function setupNavigation() {
  const menuToggle = document.querySelector("#menuToggle");
  const nav = document.querySelector("#mainNav");
  menuToggle?.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (event) => {
    const calendarFilter = event.target.closest("[data-calendar-filter]")?.dataset.calendarFilter;
    const socialFilter = event.target.closest("[data-social-filter]")?.dataset.socialFilter;
    const streamFilter = event.target.closest("[data-stream-filter]")?.dataset.streamFilter;
    if (calendarFilter) setCalendarFilter(calendarFilter);
    if (socialFilter) setSocialFilter(socialFilter);
    if (streamFilter) setStreamFilter(streamFilter);
  });

  document.querySelectorAll("[data-calendar-button]").forEach((button) => button.addEventListener("click", () => setCalendarFilter(button.dataset.calendarButton)));
  document.querySelectorAll("[data-social-button]").forEach((button) => button.addEventListener("click", () => setSocialFilter(button.dataset.socialButton)));
  document.querySelectorAll("[data-stream-button]").forEach((button) => button.addEventListener("click", () => setStreamFilter(button.dataset.streamButton)));

  window.addEventListener("hashchange", () => showRoute(location.hash.replace("#", "") || "inicio"));
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      const route = (link.getAttribute("href") || "#inicio").replace("#", "");
      if (ROUTES.includes(route)) setTimeout(() => showRoute(route), 0);
    });
  });
}

async function init() {
  const [config, socialUpdates, streaming] = await Promise.all([
    fetchJSON("data/config.json", DEFAULT_CONFIG),
    fetchJSON("data/social-updates.json", []),
    fetchJSON("data/streaming.json", [])
  ]);

  state.config = { ...DEFAULT_CONFIG, ...config };
  state.calendarSources = normalizeCalendars(state.config);
  state.socialUpdates = Array.isArray(socialUpdates) ? socialUpdates : [];
  state.streaming = Array.isArray(streaming) ? streaming : [];

  setupNavigation();
  setCalendarFilter("all");
  setSocialFilter("all");
  setStreamFilter("all");
  setupDiscord();
  showRoute(location.hash.replace("#", "") || "inicio");
}

init();
