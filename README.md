# ARMY PERÚ Sede Ica — GitHub Pages

Página estática para `https://armyperusedeica.github.io/`.

## Archivos principales

- `index.html`: estructura de la página.
- `styles.css`: diseño visual.
- `script.js`: calendario, filtros, menú y carga de datos.
- `assets/logo-ica.png`: logo.
- `assets/group-photo.png`: imagen principal.
- `data/events.json`: eventos del calendario.
- `data/social-updates.json`: publicaciones destacadas.
- `data/streaming.json`: metas y logros de streaming.
- `data/config.json`: enlaces generales, Discord, redes y calendarios públicos.

## Cómo editar eventos

Edita `data/events.json`.

Usa:

```json
"type": "sede"
```

para eventos de ARMY PERÚ Sede Ica, y:

```json
"type": "bts"
```

para fechas oficiales de BTS.

## Cómo editar redes

Edita `data/social-updates.json` y agrega publicaciones destacadas con estas plataformas:

- `facebook`
- `twitter`
- `instagram`
- `tiktok`

## Cómo editar streaming

Edita `data/streaming.json`. El campo `progress` debe ir de 0 a 100.

## Cómo cambiar enlaces

Edita `data/config.json` para actualizar Discord, Facebook, X/Twitter, Instagram, TikTok y calendarios públicos de Google Calendar.

## Publicación en GitHub Pages

Sube estos archivos directamente a la raíz del repositorio `armyperusedeica.github.io`. El archivo `index.html` debe quedar visible en la primera pantalla del repositorio, no dentro de una carpeta.
