# ARMY PERÚ Sede Ica — GitHub Pages

Página estática para `https://armyperusedeica.github.io/`.

## Qué cambió en esta versión

- El calendario visual de la página ahora puede sincronizar **dos calendarios de Google**:
  - `Sede Ica`: eventos creados por ARMY Perú Sede Ica.
  - `BTS oficial`: eventos compartidos por `foreverpurple130613@gmail.com`.
- Se eliminó el calendario embebido de Google.
- Los botones del calendario permiten ver:
  - `Agenda completa`
  - `Sede Ica`
  - `BTS oficial`

## Archivo principal para configurar calendarios

Edita:

```txt
data/config.json
```

La API key va aquí:

```json
"googleCalendarApiKey": "PEGA_AQUI_TU_API_KEY"
```

El calendario de la sede ya está agregado con este ID:

```txt
ac1f7aecc7b1d38bcd41ecc85b33f23dab759578e8ca0c87d926ffcab9f74b0c@group.calendar.google.com
```

El calendario BTS oficial está agregado con este ID:

```txt
foreverpurple130613@gmail.com
```

## Requisitos para que los eventos se vean

1. Activar **Google Calendar API** en Google Cloud.
2. Crear una **API key**.
3. Pegar la API key en `data/config.json`.
4. Hacer públicos ambos calendarios con permiso de ver detalles:
   - Settings and sharing
   - Access permissions for events
   - Make available to public
   - See all event details

## Subir a GitHub

Sube el contenido de esta carpeta directamente a la raíz del repositorio:

```txt
index.html
styles.css
script.js
README.md
assets/
data/
.nojekyll
```

No subas la carpeta completa. El archivo `index.html` debe quedar visible en la primera vista del repositorio.
