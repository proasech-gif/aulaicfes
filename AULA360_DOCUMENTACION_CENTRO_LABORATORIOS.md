# AULA360 — Centro de Laboratorios y Experiencias (Etapa 1)

## Etapa 2 (agregada): simuladores propios (sims.js)
Física: lanzamiento de proyectil, Ley de Ohm. Química: pH y mezcla ácido–base. Biología: cuadro de Punnett, explorar la célula. Matemáticas: función cuadrática, probabilidad con dados. Código propio (sin licencias externas), cada uno con aviso de que es un modelo y no un experimento real. El docente puede adjuntar un simulador a una experiencia.

## Etapa 3 (agregada)
- Plantillas listas: 📓 Diario de práctica (Educación Física) y 🖼️ Portafolio (Arte), con rúbrica; el docente las edita y publica como cualquier experiencia.
- 📊 Estadísticas (docente y directivos): por laboratorio/curso, enviadas, calificadas, promedio y acierto automático con datos reales; práctica de English Lab por habilidad.

## Etapa 4 (agregada): actividades para los demás laboratorios
Lectura guiada (literal/inferencial/crítico), Dilema ético (perspectivas, sin respuesta única), Cómo se hace una ley, Ramas y órganos del poder público, Línea de tiempo de Colombia, Pasos para resolver un conflicto. Total 13 actividades/simuladores. Contenido neutral y factual; es material de práctica, no reemplaza el criterio del docente.

## Etapa 5 (agregada)
- **Asistencia obligatoria**: el estudiante debe pulsar "Registrar mi asistencia de hoy" en cada laboratorio; sin ella no entra a experiencias, salas ni tutor IA (se exige también en el servidor). Es independiente de la asistencia a clase. Docente y directivos ven la lista del día.
- **Salas de debate**: las crea el docente por curso y laboratorio. Modos: entre compañeros, con el tutor IA, o mixto. El docente puede escribir, borrar mensajes y cerrar la sala; el rector/coordinador solo lee. El tutor IA modera con neutralidad, sin tomar partido. Los mensajes se actualizan cada 4 segundos. Los estudiantes aparecen con nombre e inicial del apellido.
- Más actividades: 2 lecturas y 1 texto argumentativo, 2 dilemas éticos más, regiones naturales, fuentes históricas, mecanismos de participación, separación de poderes, caso de burlas, color, capacidades físicas y estructura de una sesión (25 actividades en total).
- Documento aparte: AULA360_SUGERENCIAS_MEJORAS_LABORATORIOS.md.

## Etapa 6 (agregada): laboratorios en vivo, debate con nota, gráficas profesionales
- **En vivo** (Supabase Realtime): mensajes de la sala, estado de la sala, lista de asistencia del docente, entregas y experiencias se actualizan solos. Hay respaldo automático por consulta periódica si el tiempo real falla.
- **Participantes en línea** (presencia): docente y estudiantes ven quién está conectado, cuántos mensajes lleva cada uno y de qué tipo (💡 aporte, ⚔️ refutación, 👍 apoyo, ❓ pregunta). El docente ve también quién aún no ha participado.
- **Refutar y apoyar**: cada mensaje puede responder a otro; se muestra "Ana refuta a Luis" y cada estudiante ve el panel "Respuestas a tus ideas" (quién lo refutó, apoyó o le preguntó).
- **Voz**: "🎤 Hablar" convierte la voz en texto (con marca 🎤) y "🔊 Escuchar" lee cualquier mensaje en voz alta; opción de escuchar automáticamente lo que escriben los demás. Es voz↔texto del navegador (gratis), NO una llamada de audio en directo.
- **Docente**: puede escribir, borrar mensajes, silenciar/devolver la palabra a un estudiante, cerrar/reabrir la sala y elegir ser el moderador (el tutor IA queda en pausa) o dejar moderar al tutor IA.
- **Nota del debate**: al final, el docente ve por estudiante mensajes, aportes, refutaciones, apoyos, preguntas e interacciones, con una nota sugerida por regla fija (40% participación, 30% interacción con compañeros, 30% desarrollo de ideas) y decide la nota final y un comentario. Se guarda en el registro del docente y el estudiante la ve (con el detalle) cuando el docente la publica; también aparece en "Mis notas". La IA nunca califica.
- **Gráficas profesionales** (Física y Matemáticas): proyectil (trayectoria, y(t), velocidades, animación), movimiento rectilíneo, Ley de Ohm, función cuadrática y función lineal, con ejes, cuadrícula, números, puntos clave rotulados (vértice, raíces, cortes, máximos, impacto), líneas de referencia, ecuaciones y tarjetas de datos.
- Diseño renovado de laboratorios (color por laboratorio, tarjetas con relieve).
- Límite: la voz en directo entre varios (llamada de audio) requiere un servicio externo (p. ej., Jitsi o LiveKit); no se activó sin tu aprobación por privacidad de menores y posible costo.

## Etapa 7 (agregada): audio en vivo con LiveKit
- Botón **🎧 Entrar al audio en vivo** dentro de cada sala de debate. Todos entran con el micrófono apagado; el docente decide quién habla ("Dar la palabra" / "Quitar voz"); el estudiante puede "✋ Pedir la palabra"; se ve quién está hablando.
- Seguridad: la clave de LiveKit vive solo en el servidor (función lab-audio). El servidor entrega una clave temporal de 2 horas solo a quien pertenece al curso de la sala (o a su docente / rector / coordinador, solo escucha), con la sala abierta y, para estudiantes, con asistencia registrada y sin estar silenciado. El rector/coordinador solo escucha.
- Para activarlo hay que crear un proyecto gratis en LiveKit Cloud y guardar tres secretos en Supabase: LIVEKIT_URL, LIVEKIT_API_KEY y LIVEKIT_API_SECRET. Mientras no existan, el botón avisa que el audio aún no está activado.
- Costo: plan gratis de LiveKit = 5.000 minutos de participante al mes (≈ 4 debates de 40 min con 30 personas). Si se supera, el servicio puede cobrar o dejar de funcionar según el plan; revisar el panel de LiveKit.
- El audio no se graba ni se guarda en la plataforma.

## Qué incluye la etapa 1
- Menú "🔬 Laboratorios" para estudiante (pestaña), docente (grupo Evaluar) y rector/coordinador (grupo Seguimiento, solo lectura).
- Centro principal con los 13 laboratorios (Química, Física, Biología, Matemáticas, Lectura Crítica, English Lab, Educación Física, Ética y Filosofía, Democracia, Política, Ciencias Sociales, Competencias Ciudadanas, Arte y Cultura).
- Constructor de experiencias (docente): introducción, materiales, exploración, práctica, conclusiones, preguntas (opción múltiple autocorregida, abierta, audio, archivo), rúbrica, fechas, intentos, tutor IA sí/no, evaluable sí/no; borrador, publicar, cerrar, duplicar, eliminar.
- Estudiante: abre experiencias de sus cursos, guarda borrador, envía, sube foto/archivo o graba audio (evidencia).
- Calificación del docente (nota 0–5, rúbrica 1–5, retroalimentación). La nota aparece en "Mis asistencias y notas" del estudiante (se integró a la función existente `mis_notas`; no hay sistema de notas paralelo).
- Tutor IA por laboratorio (función `lab-tutor`): el rector/coordinador puede activarlo/desactivarlo y fijar el límite diario por laboratorio; el docente puede apagarlo por experiencia. Nunca cambia notas ni da la respuesta de actividades evaluables.
- English Lab: Vocabulary (escuchar con voz del navegador), Listening, Speaking (micrófono del navegador, compara lo dicho con la frase), conversación con tutor IA (texto o dictado, lectura en voz alta), niveles Pre-A1/A1/A2/B1, resultados separados por habilidad. Grabaciones de audio para el docente vía experiencias.
- Sin internet: el envío/borrador se guarda en el dispositivo y se envía al volver la conexión (sin duplicar; el servidor solo guarda una entrega por estudiante y experiencia).

## Base de datos (aditiva, no modifica lo existente)
Tablas: lab_experiencias, lab_claves (respuestas correctas ocultas al estudiante), lab_entregas, lab_config, lab_practica. Bucket privado lab-evidencias (20 MB). Funciones: lab_guardar_entrega, lab_calificar, lab_entregas_exp, lab_asignada, lab_es_dueno. RLS por colegio/curso; modo consulta (auditor) no puede escribir. Edge function: lab-tutor. Política nueva en ia_uso solo para tipos `lab_*`.

## Seguridad y menores
- La clave de IA vive solo en el servidor (ANTHROPIC_API_KEY); el navegador nunca la ve.
- Aviso visible de que el tutor usa IA de un proveedor externo; se pide no escribir datos personales.
- Laboratorios de política/democracia/sociales/ciudadanas: el tutor tiene instrucción de neutralidad y pluralismo.

## Límites conocidos (honestos)
- Los simuladores son pocos (7). Lectura, Educación Física, Ética, Democracia, Política, Sociales, Ciudadanas y Arte funcionan con experiencias del docente y tutor IA; falta portafolio/diario dedicados y un tablero analítico docente más completo.
- Voz: usa el navegador (gratis). Reconocimiento de voz funciona bien en Chrome (PC/Android); limitado en iPhone y Firefox. Evaluación de pronunciación = coincidencia de palabras, no análisis fonético.
- Sin internet no se pueden subir archivos/audio; solo texto y respuestas. No se implementó un motor de sincronización nuevo: se usa una cola simple local.
- Costo: el tutor usa la API de Anthropic ya configurada (se descuenta de tu crédito); límite por estudiante/día controlable.
- Educación Física (diario de práctica) y Arte (portafolio) se manejan hoy con experiencias de tipo audio/archivo/abierta.

## Etapa 8 — Laboratorio de Química profesional (titulación ácido–base)
- Reemplaza al simulador básico `ph` (mismo identificador, así las experiencias ya creadas siguen funcionando).
- Mesa de laboratorio dibujada (bureta, matraz, agitador, pH-metro), 4 indicadores, ácido fuerte y débil, curva de titulación con puntos clave, registro de observaciones, modo Reto, objetivos, procedimiento y preguntas de comprensión.
- Archivos modificados: `sims.js` (bloque nuevo al final; el viejo se reemplaza en memoria), `labs.js` (versión de sims 4→5), `index.html` (labs.js v7→v8), `sw.js` (v51→v52).
- Recuperar la versión anterior: usar `BACKUP_original/sims.js.pre_lab` como `sims.js`.
- Pruebas: cálculos verificados (pH 7,00 en equivalencia fuerte; pH 4,75 a medio camino del ácido débil; pH 8,72 en equivalencia débil), controles, goteo, modo reto, registro, cuestionario, vista móvil y suite de laboratorios (27 simuladores abren) sin errores.

## Etapa 9 — Constructor de laboratorios propios (sin IA)
- El docente crea un laboratorio sobre cualquier tema: define variables (mín, máx, valor inicial, paso), resultados con fórmula, gráfica (eje X/Y), fundamento teórico y procedimiento; puede partir de una de 13 plantillas (Química: celda galvánica/Nernst, gases, dilución, cinética; Física: caída libre, resorte, péndulo, energía; Matemáticas: exponencial, seno; Biología: logístico, Hardy–Weinberg; Educación Física: frecuencia cardíaca).
- Dónde: tarjeta «✏️ Crear mi propio laboratorio» en cada laboratorio (solo docentes) y botón «Diseñar un laboratorio propio» dentro de «Nueva experiencia». Incluye «Probar como estudiante».
- Seguridad: las fórmulas las calcula un evaluador propio (no usa eval ni ejecuta código); solo permite números, operaciones + − * / ^, paréntesis y funciones matemáticas (sqrt, sin, cos, tan, ln, log, exp, abs, min, max, pow, floor, ceil, round, pi). Todo el texto se escapa antes de mostrarse. Máx. 8 variables y 8 resultados.
- Almacenamiento: dentro de la experiencia ya existente (columna `sim` con prefijo `c:` + JSON). SIN cambios en la base de datos.
- Archivos modificados: `sims.js` (bloque nuevo + API), `labs.js` (tarjeta, botón, vista de diseño, apertura del simulador propio), `index.html` (labs v9), `sw.js` (v53).
- Recuperar versión anterior: `BACKUP_original/sims.js.pre_constructor` y `labs.js.pre_constructor`.
- Pruebas: 13 plantillas calculan valores correctos (p. ej. celda Zn/Cu E°=1,10 V; gases P=1,099 atm); fórmulas inválidas muestran error claro (variable inexistente, función desconocida, paréntesis, símbolo raro); flujo docente completo (plantilla → editar → probar → usar → guardar) y suites anteriores (27 simuladores, salas, audio) sin errores.
- Límite: modelos numéricos y gráficas, no escenas realistas; plantillas de humanidades (casos, línea de tiempo, mapas) quedan para la siguiente etapa.

## Etapa 10 — Generar laboratorios con IA (el docente decide el tema)
- En la pantalla de diseño (✏️ Crear mi propio laboratorio) hay un panel «✨ Generar con IA»: tema + grado + indicaciones opcionales → la IA devuelve un borrador (variables, fórmulas, gráfica, teoría, procedimiento) que se carga en el formulario; el docente lo revisa, lo prueba como estudiante y lo usa. El constructor manual y las plantillas siguen disponibles.
- La IA NO ejecuta código: solo propone datos y fórmulas; las calcula el mismo evaluador seguro del constructor. Si la fórmula es inválida, se muestra el error y el docente la corrige. Se muestra siempre el aviso «Borrador generado con IA: revísalo».
- Edge function nueva `lab-generar` (JWT; solo docentes aprobados; límite 10 generaciones/día por docente en `ia_uso` tipo `lab_generar`; modelo claude-sonnet-5-5; usa ANTHROPIC_API_KEY ya existente). Temas no modelables devuelven un mensaje con sugerencia. Sin cambios de tablas.
- Archivos: `labs.js` (v11), `index.html`, `sw.js` (v55); respaldo `labs.js.pre_ia`.
- Pruebas (con respuestas simuladas de la IA): carga del borrador, vista previa con gráfica, fórmula inválida, tema no modelable, límite diario, sin clave y flujo completo hasta «Usar este laboratorio» sin errores. NO probado con la IA real (requiere crédito en Anthropic).

## Catálogo de 100 laboratorios de Química — Etapa 1 (Sexto, labs 1–16)
Archivos nuevos: quimica_motor.js (7 motores de simulación), quimica_g6.js (16 laboratorios), quimica_ui.js (catálogo, laboratorio, evaluación).
Cambios en labs.js (mínimos): botón «Catálogo», vista `qcat`, soporte `q:CÓDIGO` en experiencias, y el panel de estadísticas ahora cuenta solo inglés en «práctica libre».
Progreso: tabla existente `lab_practica` (lab='quimica', skill=código). DBA y estándares: marcados «por verificar» hasta contrastarlos con el MEN.
Respaldo: BACKUP_zip/labs.js.pre_q100.

## Acceso gratis por zona (auditor)
Tabla `zonas_gratis`; funciones `colegio_gratis`, `hay_zona_gratis`; `_acceso_email` y `acceso_vigente` actualizadas. Panel: Auditor → Suscripciones → «🎁 Acceso gratis por zona». Respaldo: BACKUP_zip/suscripcion_admin.js.pre_zonas.

## Auditor · Datos Saber 11 · «Subir resultados Saber de un año»
En Auditor → «📥 Datos Saber 11»: elegir año, elegir Excel (formato ICFES «Resultados agregados»), vista previa y guardar; lista de años cargados con botón ✕ para borrar un periodo; botón de plantilla Excel. Funciones nuevas en la base: saber_periodos(), saber_borrar_periodo(). Respaldo: BACKUP_zip/auditor.js.pre_anio.

## Auditor · Informe de un colegio
Pestaña «📄 Informe de un colegio» del auditor: reutiliza el análisis Saber (analisis.js) eligiendo departamento, municipio y colegio; el membrete usa el nombre del colegio elegido. Respaldo: BACKUP_zip/analisis.js.pre_auditor.

## Saber: años subidos manualmente
saber_agg.manual (true cuando el auditor sube un colegio a mano; saber-ingest y saber-sync lo ponen en false al cargar datos oficiales, así se actualiza solo). RPC saber_manual(dane). El análisis muestra el año como «✍️ subido manualmente», incluye ese año en el informe y avisa que se actualizará. Respaldos: BACKUP_zip/*.pre_manual.

## Roles, logo y auditoría del rector (noviembre 2026)
- Informe Saber (analisis.js): rector y coordinador solo crean el de su propia institución (caja fija, bloqueo también en servidor con `saber_mi_colegio`/`saber_manual`); docentes y estudiantes no pueden. Años subidos por el propio colegio salen con la marca "✍️ subido manualmente".
- Logo: `LGU()` en index.html devuelve el logo de la institución si lo subió, si no el de AULA360; lo usan encabezados, exámenes, constancias, periodos y el informe.
- Revisión (revision.js v2): el rector elige coordinador o docente, el coordinador elige docentes. Además de planeador/observador/ficha/plan, hay secciones de actividad (cursos, evaluación, laboratorios, impresiones, trabajos, talleres, clase con IA, clases en aula, reuniones, registro de documentos) con vista previa, imprimir y nota. No entra al entorno de la persona; los mensajes privados no se muestran.
- Base de datos: funciones `rev_personas()` y `rev_actividad(persona, sección, desde, hasta)` (SECURITY DEFINER, solo mismo colegio y jerarquía).
