# ARMY PERÚ Sede Ica — página para GitHub Pages

Esta carpeta contiene una página web estática lista para subir a GitHub Pages.

## Archivos principales

- `index.html`: estructura de la página.
- `styles.css`: diseño visual.
- `script.js`: calendario, filtros, redes y panel de streaming.
- `assets/logo-ica.png`: logo de la sede.
- `assets/group-photo.png`: foto grupal destacada.
- `data/config.json`: enlaces de Discord, redes y calendarios.
- `data/events.json`: eventos de la sede y eventos oficiales.
- `data/social-updates.json`: actualizaciones destacadas de redes.
- `data/streaming.json`: logros y metas de streaming.

## Dominio gratuito recomendado

Como tu usuario es `armyperusedeica`, crea un repositorio con este nombre exacto:

```txt
armyperusedeica.github.io
```

La página quedará en:

```txt
https://armyperusedeica.github.io/
```

Si usas otro nombre de repositorio, por ejemplo `web`, el enlace será:

```txt
https://armyperusedeica.github.io/web/
```

## Cómo subir los archivos desde GitHub sin instalar nada

1. Entra a GitHub con la cuenta `armyperusedeica`.
2. Crea un repositorio nuevo llamado `armyperusedeica.github.io`.
3. Marca el repositorio como **Public**.
4. Descarga y descomprime este ZIP.
5. En el repositorio, presiona **Add file → Upload files**.
6. Arrastra todos los archivos y carpetas de esta página.
7. Presiona **Commit changes**.
8. Entra a **Settings → Pages**.
9. En **Build and deployment**, elige:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
10. Guarda. Espera unos minutos y abre `https://armyperusedeica.github.io/`.

## Cómo editar eventos

Abre `data/events.json` y agrega eventos con este formato:

```json
{
  "title": "Nombre del evento",
  "date": "2026-07-12",
  "startTime": "19:00",
  "endTime": "22:00",
  "type": "sede",
  "location": "Discord",
  "description": "Descripción breve del evento.",
  "link": "https://enlace-opcional.com"
}
```

Usa estos valores en `type`:

```txt
sede = evento de ARMY PERÚ Sede Ica
bts = evento oficial BTS
```

## Cómo editar redes

Abre `data/config.json` y reemplaza los enlaces que dicen `TU_...`.

Ejemplo:

```json
"instagramUrl": "https://www.instagram.com/army.peru.sedeica/"
```

Luego abre `data/social-updates.json` para agregar publicaciones destacadas.

## Sobre Instagram y TikTok

Facebook y X/Twitter pueden incrustarse con widgets públicos. Instagram y TikTok suelen limitar el feed completo en páginas externas sin usar API o widgets de terceros. Por eso esta página deja una sección manual para destacar publicaciones con enlace.

## Cómo editar streaming

Abre `data/streaming.json` y cambia:

- `platform`: YouTube, Spotify, Apple Music, etc.
- `project`: nombre de la campaña.
- `progress`: porcentaje numérico, de 0 a 100.
- `current`: avance actual visible.
- `target`: meta.
- `note`: explicación breve.
- `url`: enlace a evidencia, playlist o publicación.

## Calendario oficial BTS

La versión gratuita y segura es registrar en `data/events.json` los eventos oficiales con `type: "bts"`.

Si luego consiguen un calendario público de Google Calendar, pueden pegar el enlace de inserción en `data/config.json`:

```json
"officialCalendarEmbedUrl": "PEGAR_AQUI_EL_ENLACE_IFRAME_DE_GOOGLE_CALENDAR"
```

## Nota importante

Al publicar imágenes de artistas, logos o marcas, asegúrense de que tienen autorización o que el uso sea permitido por las normas de la comunidad/plataforma correspondiente.
