# PROYECTO: IMPLEMENTACIÓN DE 100 LABORATORIOS VIRTUALES PROFESIONALES DE QUÍMICA EN AULA360

## 1. TU MISIÓN

Actúa como arquitecto de software sénior, ingeniero full-stack, especialista en simulaciones científicas, diseñador UX/UI y experto en tecnología educativa.

Debes implementar dentro de AULA360 un catálogo de 100 laboratorios virtuales profesionales de Química, correspondientes a los grados sexto, séptimo, octavo, noveno, décimo y undécimo, utilizando el inventario curricular que te proporcionaré.

**ATENCIÓN: EL LABORATORIO DE QUÍMICA YA EXISTE EN AULA360.**

No debes crear un segundo laboratorio de Química, ni reemplazar, reconstruir o eliminar el que ya está funcionando.

Tu trabajo consiste en AMPLIAR Y PERFECCIONAR EL LABORATORIO DE QUÍMICA EXISTENTE, incorporando los 100 laboratorios como experiencias independientes dentro de su estructura actual.

## 2. REGLA INNEGOCIABLE: PROTECCIÓN TOTAL DE AULA360

AULA360 es una aplicación existente, desarrollada y funcional.

Está prohibido realizar cambios que puedan afectar sus funcionalidades actuales.

NO debes:

- Reconstruir la aplicación.
- Cambiar la arquitectura general.
- Modificar el dashboard principal.
- Modificar el menú lateral.
- Cambiar las rutas existentes.
- Modificar autenticación o registro de usuarios.
- Cambiar roles o permisos.
- Alterar el sistema de suscripciones.
- Modificar pagos o facturación.
- Alterar la base de datos existente.
- Eliminar tablas, registros, columnas o políticas.
- Cambiar las conexiones de Supabase.
- Modificar variables de entorno.
- Cambiar configuraciones de Vercel.
- Alterar otros laboratorios.
- Modificar módulos de otras asignaturas.
- Cambiar funcionalidades de docentes o estudiantes.
- Eliminar componentes existentes.
- Sustituir código funcional por prototipos.
- Actualizar dependencias generales sin necesidad demostrada.

No hagas refactorizaciones generales.

No realices migraciones destructivas.

No cambies archivos que no sean necesarios para esta implementación.

## 3. PRIMER PASO: AUDITORÍA DEL LABORATORIO EXISTENTE

Antes de modificar cualquier código:

1. Localiza el laboratorio de Química actual.
2. Inspecciona sus componentes.
3. Identifica cómo se accede desde AULA360.
4. Identifica sus rutas.
5. Revisa su diseño actual.
6. Identifica los simuladores que ya contiene.
7. Analiza sus funcionalidades.
8. Identifica sus conexiones con la base de datos.
9. Identifica sus componentes compartidos.
10. Comprueba cómo se registran los resultados de los estudiantes.

Presenta un diagnóstico técnico que identifique:

- Qué existe actualmente.
- Qué funcionalidades funcionan.
- Qué debe conservarse.
- Qué se puede ampliar.
- Qué archivos sería necesario modificar.
- Qué archivos nuevos sería necesario crear.
- Qué riesgos técnicos existen.
- Cómo se garantizará la recuperación de la versión anterior.

NO MODIFIQUES NADA DURANTE ESTA PRIMERA ETAPA.

Espera la autorización para comenzar la implementación.

## 4. ESTRATEGIA DE IMPLEMENTACIÓN

Una vez autorizado:

Utiliza el laboratorio de Química existente como contenedor principal.

Organiza los 100 laboratorios en seis categorías:

- Grado sexto: 16 laboratorios.
- Grado séptimo: 16 laboratorios.
- Grado octavo: 17 laboratorios.
- Grado noveno: 17 laboratorios.
- Grado décimo: 17 laboratorios.
- Grado undécimo: 17 laboratorios.

Total: 100 laboratorios.

Cada laboratorio debe funcionar de manera independiente, pero conservar el diseño y la navegación general del módulo de Química.

No crees 100 módulos independientes en el menú lateral.

No dupliques el laboratorio principal.

Utiliza una estructura interna organizada que permita seleccionar un grado y acceder a sus respectivos experimentos.

## 5. DISEÑO DE LA INTERFAZ

El laboratorio existente debe evolucionar hacia una experiencia profesional.

Debe incluir:

- Catálogo de laboratorios por grado.
- Buscador de experimentos.
- Filtros por tema.
- Indicadores de dificultad.
- Tarjetas visuales profesionales.
- Identificación de laboratorios completados.
- Indicadores de progreso.
- Escenario principal de experimentación.
- Panel de instrumentos y materiales.
- Panel de instrucciones.
- Panel de observaciones.
- Panel de resultados.
- Botones de iniciar, pausar y reiniciar.
- Acceso a la fundamentación científica.
- Acceso a la evaluación.

No cambies la identidad visual global de AULA360.

Mantén la coherencia con los colores, tipografía, componentes y estilo de la plataforma.

El diseño debe ser responsive y funcionar correctamente en computadores, tabletas y celulares.

## 6. FUNCIONALIDAD CIENTÍFICA

Cada uno de los 100 laboratorios debe ser un simulador funcional, no una página informativa.

Según el experimento, debe permitir:

- Manipular instrumentos virtuales.
- Seleccionar materiales.
- Modificar variables.
- Ejecutar procedimientos.
- Observar fenómenos.
- Registrar mediciones.
- Generar resultados.
- Visualizar gráficos.
- Realizar cálculos.
- Comparar experimentos.
- Repetir procedimientos.
- Obtener explicaciones científicas.

Las simulaciones deben utilizar modelos matemáticos y científicos apropiados.

No generes resultados aleatorios para aparentar experimentación real.

No presentes modelos simplificados como si fueran representaciones científicas exactas.

Identifica las aproximaciones y limitaciones de cada simulación.

## 7. ESTRUCTURA PEDAGÓGICA OBLIGATORIA

Cada laboratorio debe tener:

1. Código identificador único.
2. Nombre.
3. Grado.
4. Área.
5. Tema.
6. Nivel de dificultad.
7. Objetivo de aprendizaje.
8. Competencias científicas.
9. DBA relacionado.
10. Estándar del grupo de grados correspondiente.
11. Evidencias de aprendizaje.
12. Fundamentación teórica.
13. Materiales e instrumentos.
14. Procedimiento.
15. Experimentación interactiva.
16. Registro de observaciones.
17. Resultados.
18. Análisis de resultados.
19. Preguntas de interpretación.
20. Conclusiones.
21. Evaluación.
22. Retroalimentación.

No inventes códigos oficiales de DBA ni atribuyas estándares que no correspondan. Verifica los referentes curriculares y establece las relaciones justificadas.

## 8. DOS MODALIDADES DE EXPERIMENTACIÓN

Implementa dentro de cada laboratorio:

MODO GUIADO:

El estudiante sigue instrucciones paso a paso, aprende a utilizar los instrumentos y completa un procedimiento experimental.

MODO LIBRE:

El estudiante puede modificar variables, probar diferentes condiciones, realizar experimentos y observar sus consecuencias.

Ambas modalidades deben funcionar correctamente.

## 9. SEGUIMIENTO DEL ESTUDIANTE

Integra el seguimiento utilizando los mecanismos que AULA360 ya tenga disponibles.

Cuando la arquitectura existente lo permita, registra:

- Laboratorio iniciado.
- Laboratorio completado.
- Fecha de realización.
- Tiempo de experimentación.
- Procedimientos realizados.
- Resultados obtenidos.
- Preguntas respondidas.
- Calificación.
- Retroalimentación.

Respeta los permisos y la privacidad de los estudiantes.

No crees nuevas tablas ni modifiques las existentes sin presentar previamente una justificación y solicitar autorización.

## 10. INVENTARIO DE LOS 100 LABORATORIOS

Utiliza exactamente el siguiente inventario como catálogo de referencia.

### SEXTO

1. Explorador de la materia.
2. Estados de la materia.
3. Cambios de estado.
4. Propiedades físicas de la materia.
5. Laboratorio de medición de masa.
6. Laboratorio de volumen.
7. Laboratorio de densidad.
8. Flotación y hundimiento.
9. Sustancias puras y mezclas.
10. Mezclas homogéneas y heterogéneas.
11. Separación de mezclas por filtración.
12. Separación por decantación.
13. Separación por evaporación.
14. Separación por destilación.
15. Transformaciones físicas y químicas.
16. Conservación de la materia.

### SÉPTIMO

17. Construcción del átomo.
18. Modelos atómicos históricos.
19. Número atómico y masa atómica.
20. Isótopos atómicos.
21. Distribución electrónica básica.
22. Explorador de la tabla periódica.
23. Familias de la tabla periódica.
24. Metales, no metales y metaloides.
25. Radio atómico.
26. Electronegatividad.
27. Formación de iones.
28. Elementos químicos en la vida cotidiana.
29. Símbolos y nombres químicos.
30. Clasificación de sustancias.
31. Lenguaje químico.
32. Estructura de materiales.

### OCTAVO

33. Enlace iónico.
34. Enlace covalente.
35. Enlace metálico.
36. Formación de moléculas.
37. Geometría molecular.
38. Polaridad molecular.
39. Fuerzas intermoleculares.
40. Fórmulas químicas.
41. Compuestos binarios.
42. Nomenclatura química básica.
43. Reacciones químicas.
44. Evidencias de cambios químicos.
45. Balanceo de ecuaciones químicas.
46. Conservación de la masa.
47. Reacciones de síntesis y descomposición.
48. Reacciones de desplazamiento.
49. Velocidad de reacción introductoria.

### NOVENO

50. El mol y el número de Avogadro.
51. Masa molar.
52. Conversión masa-mol-partículas.
53. Estequiometría de reacciones.
54. Reactivo limitante.
55. Rendimiento teórico y porcentual.
56. Preparación de soluciones.
57. Concentración porcentual.
58. Molaridad.
59. Diluciones.
60. Solubilidad.
61. Curvas de solubilidad.
62. Escala de pH.
63. Indicadores ácido-base.
64. Neutralización ácido-base.
65. Química del agua.
66. Contaminación química ambiental.

### DÉCIMO

67. Configuración electrónica avanzada.
68. Números cuánticos.
69. Orbitales atómicos.
70. Propiedades periódicas avanzadas.
71. Estructuras de Lewis.
72. Geometría molecular avanzada.
73. Hibridación de orbitales.
74. Fuerzas intermoleculares y propiedades.
75. Nomenclatura de óxidos e hidruros.
76. Nomenclatura de ácidos y sales.
77. Formación de hidróxidos.
78. Reacciones de oxidación-reducción.
79. Balanceo por método redox.
80. Termoquímica y entalpía.
81. Calorimetría virtual.
82. Leyes de los gases.
83. Laboratorio integrado de química inorgánica.

### UNDÉCIMO

84. Cinética química avanzada.
85. Teoría de colisiones.
86. Energía de activación.
87. Equilibrio químico.
88. Principio de Le Châtelier.
89. Constante de equilibrio.
90. Equilibrio ácido-base.
91. Teorías de ácidos y bases.
92. Soluciones amortiguadoras.
93. Valoraciones ácido-base.
94. Electroquímica: celdas galvánicas.
95. Electrólisis.
96. Hidrocarburos.
97. Grupos funcionales orgánicos.
98. Isomería orgánica.
99. Biomoléculas y química orgánica.
100. Laboratorio integrador de química aplicada.

## 11. METODOLOGÍA DE DESARROLLO Y CONTROL

No implementes los 100 laboratorios de manera desordenada.

Trabaja en lotes pequeños y controlados.

Orden de trabajo:

PRIMERA ETAPA:
Implementar y validar los laboratorios 1 al 16.

SEGUNDA ETAPA:
Implementar y validar los laboratorios 17 al 32.

TERCERA ETAPA:
Implementar y validar los laboratorios 33 al 49.

CUARTA ETAPA:
Implementar y validar los laboratorios 50 al 66.

QUINTA ETAPA:
Implementar y validar los laboratorios 67 al 83.

SEXTA ETAPA:
Implementar y validar los laboratorios 84 al 100.

Al terminar cada etapa:

- Ejecuta las pruebas.
- Verifica los experimentos.
- Revisa el funcionamiento del módulo.
- Comprueba que no existan errores nuevos.
- Comprueba que los otros módulos de AULA360 continúan funcionando.
- Conserva un registro de los cambios.

Si una etapa presenta errores, no avances hasta resolverlos.

## 12. PROTECCIÓN DE BASE DE DATOS Y SERVICIOS

La implementación debe reutilizar preferentemente la infraestructura existente.

No modifiques Supabase, las políticas RLS, las tablas, los servicios de autenticación ni los permisos sin autorización expresa.

Si necesitas persistir información adicional, presenta primero:

- La necesidad técnica.
- El esquema propuesto.
- Los datos que se almacenarían.
- El impacto potencial.
- El procedimiento de reversión.

No ejecutes migraciones por iniciativa propia.

## 13. CRITERIOS DE ACEPTACIÓN

Un laboratorio solo puede considerarse terminado cuando:

- Abre correctamente.
- Presenta el contenido científico.
- Permite experimentar.
- Sus instrumentos funcionan.
- Sus variables responden.
- Sus resultados son coherentes.
- Sus gráficos y cálculos funcionan.
- Su evaluación funciona.
- Su interfaz se adapta a dispositivos.
- No genera errores nuevos.
- No afecta otras funcionalidades.

Un laboratorio que solamente muestra una imagen, una animación o una explicación NO cumple los requisitos.

## 14. INFORME DE ENTREGA

Presenta un informe con:

- Laboratorios implementados.
- Laboratorios pendientes.
- Funcionalidades incorporadas.
- Archivos creados.
- Archivos modificados.
- Pruebas realizadas.
- Resultados de las pruebas.
- Errores encontrados.
- Soluciones aplicadas.
- Confirmación de integridad de AULA360.
- Instrucciones de recuperación.

Nunca afirmes que una prueba fue exitosa si no la ejecutaste.

# INSTRUCCIÓN FINAL

NO OLVIDES:

EL LABORATORIO DE QUÍMICA YA EXISTE.

NO DEBES CREAR OTRO.

DEBES AMPLIAR EL EXISTENTE HASTA INCORPORAR LOS 100 LABORATORIOS.

LA PRIORIDAD ES CONSERVAR TODO LO QUE YA FUNCIONA EN AULA360.

NO RECONSTRUYAS, NO ELIMINES, NO REEMPLACES Y NO ALTERES MÓDULOS AJENOS A ESTA TAREA.

PRIMERO PRESENTA EL DIAGNÓSTICO Y EL PLAN DE INTERVENCIÓN.

ESPERA MI AUTORIZACIÓN ANTES DE MODIFICAR EL CÓDIGO.