# ARMY PERÚ Sede Ica — GitHub Pages

Página estática para `https://armyperusedeica.github.io/`.

## Archivos principales

- `index.html`: estructura de la página.
- `styles.css`: diseño visual.
- `script.js`: funcionamiento de menú, calendario y redes.
- `data/config.json`: enlaces generales, Discord y calendarios.
- `data/social-updates.json`: links de publicaciones para incrustar automáticamente.
- `data/streaming.json`: campañas y metas de streaming.

## Calendario

La página usa Google Calendar embebido, sin API key.

En `data/config.json` están configurados:

- Calendario de ARMY Perú Sede Ica.
- Calendario BTS oficial de `foreverpurple130613@gmail.com`.

Para que los eventos se vean, ambos calendarios deben estar públicos.

## Redes sociales

Los enlaces de perfiles van en `data/config.json`:

```json
"facebookPageUrl": "https://www.facebook.com/ArmyPeruSedeIca/",
"xProfileUrl": "https://x.com/ArmyPeruIca",
"instagramUrl": "https://www.instagram.com/armyperu_ica/",
"tiktokUrl": "https://www.tiktok.com/@armyperu_ica"
```

## Publicaciones automáticas por link

Para mostrar posts/reels/videos específicos, solo edita:

```txt
data/social-updates.json
```

Formato simple recomendado:

```json
[
  "https://www.instagram.com/p/CODIGO_REAL/",
  "https://www.instagram.com/reel/CODIGO_REAL/",
  "https://x.com/ArmyPeruIca/status/ID_REAL",
  "https://www.tiktok.com/@armyperu_ica/video/ID_REAL",
  "https://www.facebook.com/ArmyPeruSedeIca/posts/ID_REAL"
]
```

La página detecta automáticamente la red social según el link y genera el embed correspondiente.

También puedes usar formato con texto opcional:

```json
[
  {
    "url": "https://www.instagram.com/p/CODIGO_REAL/",
    "title": "Estamos de regreso",
    "text": "Nueva publicación de la sede.",
    "date": "2026-07-20"
  }
]
```

## Importante

Los posts deben ser públicos. Si Instagram, X/Twitter, Facebook o TikTok bloquean embeds por privacidad, cookies o restricciones del navegador, la página conserva el botón para abrir la publicación original.
