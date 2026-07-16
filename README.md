# ARMY PERÚ Sede Ica — GitHub Pages

Página estática para `https://armyperusedeica.github.io/`.

## Qué cambió en esta versión

- El calendario ya **no pide API key**.
- Se volvió al calendario mensual de Google embebido, como el diseño que se veía más bonito.
- El calendario permite alternar entre:
  - `Agenda completa`: muestra el calendario de la sede + el calendario BTS oficial.
  - `Sede Ica`: muestra solo el calendario de ARMY Perú Sede Ica.
  - `BTS oficial`: muestra solo el calendario BTS oficial.
- Se eliminó el calendario rojo interno que estaba debajo, porque ahora los eventos vienen desde Google Calendar.

## Calendarios conectados

### Sede Ica

```txt
ac1f7aecc7b1d38bcd41ecc85b33f23dab759578e8ca0c87d926ffcab9f74b0c@group.calendar.google.com
```

### BTS oficial

```txt
foreverpurple130613@gmail.com
```

## Archivo editable

Edita:

```txt
data/config.json
```

Ahí puedes cambiar:

- Enlace de Discord.
- Enlaces de redes sociales.
- ID del calendario de la sede.
- ID del calendario BTS oficial.
- Créditos visibles debajo del calendario.
- Zona horaria principal del calendario (`calendarEmbedTimeZone`).

## Importante

Para que el calendario se vea públicamente en la página, cada calendario debe estar configurado como público en Google Calendar:

```txt
Settings and sharing → Access permissions for events → Make available to public
```

Si el calendario no está público, Google mostrará un mensaje de permisos dentro del iframe.
