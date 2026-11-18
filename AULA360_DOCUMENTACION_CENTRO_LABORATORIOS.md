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
