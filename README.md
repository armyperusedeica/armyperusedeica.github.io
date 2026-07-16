# ARMY PERÚ Sede Ica — web GitHub Pages

Esta versión no usa API key. El calendario se muestra con Google Calendar embebido y los botones cambian entre:

- Agenda completa: Sede Ica + BTS oficial
- Sede Ica
- BTS oficial

## Archivos principales

- `index.html`: estructura de la página.
- `styles.css`: diseño visual.
- `script.js`: navegación, filtros y carga de datos.
- `data/config.json`: enlaces reales, Discord y calendarios.
- `data/social-updates.json`: publicaciones destacadas manuales.
- `data/streaming.json`: metas de streaming.

## Configurar enlaces reales

Edita `data/config.json` y coloca los enlaces reales:

```json
"discordInviteUrl": "https://discord.gg/XXXXX",
"discordServerId": "123456789012345678",
"facebookPageUrl": "https://www.facebook.com/TU_PAGINA",
"xProfileUrl": "https://x.com/TU_USUARIO",
"instagramUrl": "https://www.instagram.com/TU_USUARIO/",
"tiktokUrl": "https://www.tiktok.com/@TU_USUARIO"
```

Si un enlace queda vacío, la web no inventa contenido: muestra el botón como pendiente.

## Agregar publicaciones destacadas

Edita `data/social-updates.json`:

```json
[
  {
    "platform": "facebook",
    "date": "2026-07-20",
    "title": "Cupsleeve por aniversario",
    "text": "Resumen breve de la publicación.",
    "url": "https://www.facebook.com/..."
  }
]
```

`platform` puede ser: `facebook`, `twitter`, `instagram` o `tiktok`.

## Agregar metas de streaming

Edita `data/streaming.json`:

```json
[
  {
    "platform": "YouTube",
    "project": "Meta semanal - MV oficial",
    "current": "7,200 reproducciones registradas",
    "target": "10,000 reproducciones",
    "progress": 72,
    "status": "Activa",
    "updated": "2026-07-20",
    "note": "Reforzar playlist de la tarde.",
    "url": "https://youtube.com/..."
  }
]
```

## Calendarios

Los calendarios están en `data/config.json`. Para que se vean en la web, deben estar públicos en Google Calendar:

Settings and sharing → Access permissions for events → Make available to public

## Subir a GitHub

Sube directamente estos archivos y carpetas a la raíz del repositorio `armyperusedeica.github.io`:

- `index.html`
- `styles.css`
- `script.js`
- `.nojekyll`
- `assets/`
- `data/`
- `README.md`
