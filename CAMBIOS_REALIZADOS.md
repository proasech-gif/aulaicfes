# Cambios realizados
1. `aula360-ui.css` (nuevo): colores institucionales (azul marino, azul vivo, turquesa/verde, dorado), botones 3D con relieve/sombra/animación al pasar y al presionar (azul, verde, rojo, dorado, violeta, secundario), tarjetas con sombra suave y elevación, KPIs con franja de color, tablas con encabezado degradado y fila resaltada, formularios con foco azul, ventanas emergentes con animación, pestañas en relieve, login con portada, responsive y `prefers-reduced-motion`.
2. `dashboard.js`: íconos SVG de línea en el menú (diccionario por emoji; si no hay ícono se muestra el emoji de antes). Sin cambios de lógica.
3. `index.html`: enlace al nuevo CSS (v2), `authWrap()` con logo AULA360 y 3 tarjetas (Simulacros/Resultados/Gestión), versión de dashboard.js 17.
4. `sw.js`: caché v22 e incluye el CSS nuevo.
Cambios funcionales inevitables: ninguno.

## Entorno del administrador (auditor)
- `auditor.js` (nuevo): Panel general, Cuentas (buscar, Entrar, Borrar) y Salud (revisar y corregir).
- `vercomo.js`: si entra el administrador, la sesión es editable (los cambios se guardan) y el aviso morado lo dice; "Volver al panel de auditor".
- `dashboard.js` / `index.html`: menú propio del administrador; al iniciar sesión cae en el Panel del auditor.
