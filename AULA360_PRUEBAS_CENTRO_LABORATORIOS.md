# Pruebas — Centro de Laboratorios (Etapa 1)
Automáticas (navegador simulado, 17 comprobaciones, todas OK): 13 tarjetas; docente crea y publica con 2 preguntas + clave oculta + rúbrica; duplicar; estudiante ve solo publicadas; abre, responde y envía; tutor IA llama a la función con el laboratorio correcto; English Lab (vocabulary, listening, speaking); docente ve entregas y califica; rector ve en solo lectura y abre configuración del tutor. Regresión: revisión de docentes y documentos pedagógicos siguen OK; sin errores de consola. Base de datos: migraciones aplicadas sin error; permisos de ejecución de funciones restringidos a usuarios con sesión.
Pendientes de prueba manual con cuentas reales (colegio 2084): grabación de audio con micrófono real, voz en celular, tutor IA con crédito, envío sin internet.

Etapa 2: los 7 simuladores abren y calculan bien (alcance 90 m con 45°/30 m/s/g=10; pH 7,00 y 1,00; Punnett Aa×Aa = 75%; raíces ±2; dados 100 lanzamientos); selector de simulador en el constructor. Detectado y corregido un conflicto de nombres en el simulador de función.

Etapa 3: plantillas (diario y portafolio) crean 4 preguntas + rúbrica; botón y tablero de estadísticas funcionan para docente y rector, con filtro por laboratorio.

Etapa 4: las 13 actividades abren; ordenar, clasificar, lectura (3/3) y dilema funcionan.

Pruebas de permisos en la base de datos real (usuarios temporales, deshechas al terminar): el estudiante ve su experiencia pero no las claves; no puede enviar dos veces ni editar su nota; un estudiante de otro colegio no ve nada y no puede guardar; el docente no puede guardar como estudiante; la nota 6 se rechaza; una entrega calificada no se puede cambiar; la nota aparece en mis_notas. Se encontró y corrigió un hueco (comparación con curso nulo) en lab_guardar_entrega.

Etapa 5 (base de datos real, usuarios temporales deshechos): sin asistencia el estudiante no puede guardar entregas ni escribir en salas; con asistencia sí; no puede inyectar mensajes del tutor ni borrar; el docente ve presentes, borra mensajes y cierra la sala (después nadie escribe); otro colegio no ve salas ni mensajes y no puede escribir ni registrar asistencia. Pantallas (simuladas): compuerta, registro, lista de asistencia, crear sala, escribir, pedir tutor, borrar, cerrar, rector solo lectura; 25 actividades abren. Se corrigió un error de nombres en lab_enviar_mensaje.
Pendiente con cuentas reales: respuesta real del tutor en la sala (requiere crédito de Anthropic).

Etapa 6 (base de datos real, usuarios temporales deshechos): tipos de mensaje válidos; el estudiante no puede enviar 'moderación'; silenciado no escribe; el resumen cuenta mensajes, interacciones y voz; nota 7 rechazada; el estudiante no califica; no ve su resumen hasta que se publica; después ve su nota y aparece en mis_notas. Pantallas (simuladas con canales en vivo falsos): conexión a canales, participantes en línea, refutar exige responder a un mensaje, panel 'Respuestas a tus ideas', docente modera/silencia/califica y publica, estudiante ve su resultado solo al publicar, el canal se cierra al salir. Gráficas revisadas con capturas de pantalla.
NO probado aún: tiempo real contra Supabase de verdad (sin acceso desde aquí) ni voz con micrófono real.

Etapa 7 (simulada con LiveKit falso): el botón aparece, avisa si el servidor no está configurado, conecta, muestra participantes, pedir la palabra, recibir permiso y activar micrófono, salir, el docente ve la mano levantada y da la palabra, el audio se desconecta al salir de la sala. NO probado con audio real ni con credenciales reales de LiveKit.
