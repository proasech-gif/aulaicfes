# Pruebas y regresiones
PROBADO (Playwright, Chromium):
- Sintaxis de los 33 archivos .js: sin errores.
- Login y panel a 1440, 1024, 768 y 390 px: capturas en CAPTURAS/.
- Menú lateral de rector (11 ítems), coordinador (10), docente (19) y administrador (24): todos con ícono SVG y sin errores de JavaScript.
- IDs duplicados en index.html: 2, iguales al original (no se agregaron).
- Botones 3D verificados visualmente (azul, verde, rojo, secundario) en escritorio y celular.
SOLO INSPECCIONADO (no se pudo probar sin cuentas reales ni red a Supabase desde mi entorno):
- Pantallas internas con datos reales de cada módulo (planeador, saber, OMR, virtual, etc.): heredan estilos por clase; conviene que usted las recorra.
- Impresión y PWA: reglas de impresión del index.html intactas; el CSS nuevo oculta menú al imprimir.
PENDIENTE:
- Gráficas Chart.js con datos reales y pulido fino módulo por módulo (segunda pasada tras su revisión).
- Modo oscuro no incluido.
