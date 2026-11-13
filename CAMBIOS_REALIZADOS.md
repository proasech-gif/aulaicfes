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

## Etapa 3: códigos de documentos y subida de documentos
- Códigos tipo ISO 9001: todo documento que se imprime lleva arriba "Código A360-<colegio>-<TIPO>-<año>-<consecutivo> · Versión 01 · fecha". El consecutivo lo lleva la base de datos (tabla `doc_registro`, función `doc_codigo`). Tipos: EXA, CUA, CLV (claves), SIM, DIA, LST, PER, PLA, NOT, ASI, REU, CLA, TAL, INF.
- Las hojas de respuestas (OMR) NO llevan la banda para no mover los cuadros de lectura; ya traen su propio código.
- Rectores y coordinadores: se quitó la subida de formatos de permisos, planillas y formato de preparación de clase (permisos.js). Los documentos los suben los docentes.
- Se mantienen (no son subida de documentos de rector): registrar el número de documento de los docentes (para la llegada), listas de estudiantes, horarios, membrete del colegio.

## Etapa 4: informes y planes de mejoramiento
- `informes.js` (nuevo) + botones en Simulacros Saber 11 y Diagnósticos (después de calificar): "📄 Informe" por estudiante, "📊 Informe y plan grupal", "🧾 Informes individuales (todos)".
- Informe individual: resultados por área con gráfico contra el grupo, nivel estimado, fortalezas, plan de mejoramiento individual (acciones por área, meta, cronograma de 4 semanas, compromisos y firmas).
- Informe grupal: promedios por área, distribución por niveles, comparación entre cursos, plan de mejoramiento grupal para docentes (estrategias, actividades, estudiantes en riesgo, cronograma y seguimiento).
- Vista previa, imprimir/guardar PDF, con código ISO. No usa IA (sin costo).
- Pendiente: exámenes de "Imprimir/Calificar" simples (no simulacro/diagnóstico), análisis de pruebas reales ICFES del rector, histórico de 10 años.

## Etapa 5: Pruebas Saber 11 reales (rector / coordinador)
- `icfes.js` (nuevo) + menú "Pruebas Saber reales". Lee los reportes individuales del ICFES (PDF suelto, varios PDF, un PDF con varios estudiantes o un ZIP), guarda por año (tabla `icfes_resultados`, funciones `icfes_guardar` / `icfes_borrar_anio`), y genera: análisis institucional (promedio, mediana, desviación, rangos, niveles por prueba, percentiles), comparativo entre años (hasta 10 años atrás), proyección del año siguiente (tendencia + escenarios), estudiantes destacados/en riesgo y plan de mejoramiento institucional con cronograma. Botones: Hacer análisis, Vista previa, Imprimir, Enviar a docentes (resumen por Mensajes, sin nombres de estudiantes).
- Probado con el PDF real entregado por el usuario (lectura correcta de nombre, documento, registro, fecha, global, 5 pruebas y percentiles).
- Niveles de desempeño: calculados con los rangos del ICFES (verificados con el PDF real: LC 58→3, Mat 62→3, Soc 54→2, CN 41→2, Inglés 58→A2).
- Límite: solo el formato de reporte individual 2020 en adelante (el del PDF entregado). Años anteriores con otro formato no se leen todavía.

## Etapa 6: Informes y periodos del docente
- `periodos.js` (nuevo) + menú del docente "Informes y periodos".
- Informe por periodo (por estudiante y por grupo): junta exámenes impresos, pruebas de periodo, simulacros, tareas y trabajos virtuales calificados del docente en su asignatura. Promedio simple, desempeño (Bajo/Básico/Alto/Superior), gráficos, plan de mejoramiento individual y grupal con cronograma. Las fechas de cada periodo son editables (se recuerdan en el navegador).
- Informe de un examen/simulacro/prueba (grupal e individual): promedio, mediana, desviación, % de aprobados, distribución por desempeño, análisis por pregunta y por competencia/tema (exámenes impresos), preguntas críticas, plan de mejoramiento.
- Escala: nota 0 a 5; pruebas con puntaje 0-100 se convierten dividiendo por 20; notas de trabajos virtuales mayores a 5 se asumen sobre 100.
- Probado con datos simulados (sin datos reales, la base aún no tiene notas de estudiantes). Impresión con código ISO.
