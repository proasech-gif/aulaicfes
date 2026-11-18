# AULA360 — Centro de Laboratorios y Experiencias (Etapa 1)

## Etapa 2 (agregada): simuladores propios (sims.js)
Física: lanzamiento de proyectil, Ley de Ohm. Química: pH y mezcla ácido–base. Biología: cuadro de Punnett, explorar la célula. Matemáticas: función cuadrática, probabilidad con dados. Código propio (sin licencias externas), cada uno con aviso de que es un modelo y no un experimento real. El docente puede adjuntar un simulador a una experiencia.

## Etapa 3 (agregada)
- Plantillas listas: 📓 Diario de práctica (Educación Física) y 🖼️ Portafolio (Arte), con rúbrica; el docente las edita y publica como cualquier experiencia.
- 📊 Estadísticas (docente y directivos): por laboratorio/curso, enviadas, calificadas, promedio y acierto automático con datos reales; práctica de English Lab por habilidad.

## Etapa 4 (agregada): actividades para los demás laboratorios
Lectura guiada (literal/inferencial/crítico), Dilema ético (perspectivas, sin respuesta única), Cómo se hace una ley, Ramas y órganos del poder público, Línea de tiempo de Colombia, Pasos para resolver un conflicto. Total 13 actividades/simuladores. Contenido neutral y factual; es material de práctica, no reemplaza el criterio del docente.

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
