/* AULA360 — Catálogo de Química · SÉPTIMO (laboratorios 17–32 del inventario oficial). Datos de referencia redondeados; cada laboratorio declara sus límites.
   DBA y estándares: solo se citan cuando están verificados contra el MEN; mientras tanto se marcan «por verificar». */
(function(){
const C1='Uso comprensivo del conocimiento científico',C2='Explicación de fenómenos',C3='Indagación',PV='Por verificar con el documento oficial del MEN antes de citarlo',
 EST='Estándares básicos de competencias en Ciencias Naturales (entorno físico, grupos 6°–7°): enunciado exacto por verificar';
const L=[];let n=0;const add=o=>{n++;o.c='Q07-'+String(n).padStart(3,'0');o.g=7;o.no=16+n;o.dba=PV;o.est=EST;o.area='Química';L.push(o)};
const MC=(q,o,ok,fb)=>({q,o,ok,fb});

add({n:'Construcción del átomo',tema:'Átomo · estructura',dif:1,mot:'atomo',
 obj:'Construir átomos con protones, neutrones y electrones y relacionar el número de protones con el elemento.',comp:[C1,C3],
 evid:['Relaciona el número de protones con el elemento.','Ubica los electrones en capas.','Reconoce que un átomo neutro tiene igual número de protones y electrones.'],
 teo:'El <b>átomo</b> tiene un núcleo con <b>protones</b> (carga +) y <b>neutrones</b> (sin carga) y a su alrededor <b>electrones</b> (carga −) en capas. El número de protones (<b>Z</b>, número atómico) define el elemento. En un átomo neutro, protones = electrones. Los electrones se acomodan en capas con capacidad 2, 8, 8…',
 mat:['Protones, neutrones y electrones virtuales','Lienzo del átomo','Ficha del elemento'],
 proc:[{t:'Agrega y quita partículas y mira cómo cambia el elemento.',a:'agrega',n:6},{t:'Resuelve el primer reto de construcción.',a:'reto_ok'},{t:'Resuelve los 5 retos.',a:'todo_ok'}],
 cfg:{modo:'construir',retos:[{q:'Construye un átomo <b>neutro de helio-4</b>.',t:{p:2,n:2},why:'Helio: Z = 2, A = 4 → 2 p, 2 n y 2 e⁻.'},{q:'Construye un átomo <b>neutro de carbono-12</b>.',t:{p:6,n:6},why:'Carbono: Z = 6; A = 12 → 6 n.'},{q:'Construye un átomo <b>neutro de oxígeno-16</b>.',t:{p:8,n:8},why:'Oxígeno: Z = 8; A = 16 → 8 n.'},{q:'Construye un átomo <b>neutro de sodio-23</b>.',t:{p:11,n:12},why:'Sodio: Z = 11; A = 23 → 12 n.'},{q:'Construye un átomo <b>neutro de calcio-40</b>.',t:{p:20,n:20},why:'Calcio: Z = 20; A = 40 → 20 n. Capas: 2–8–8–2.'}]},
 ana:['¿Qué cambia cuando agregas un protón? ¿Y cuando agregas un neutrón?','¿Por qué un átomo neutro tiene el mismo número de protones y de electrones?'],
 ev:[MC('El número de protones de un átomo se llama…',['Número de masa','Número atómico','Isótopo','Carga'],1,'Z identifica al elemento.'),MC('Un átomo con 6 protones es siempre…',['Oxígeno','Carbono','Nitrógeno','Boro'],1,'Z = 6 es carbono.'),MC('En un átomo neutro…',['Hay más protones que electrones','Hay igual número de protones y electrones','No hay neutrones','Solo hay electrones'],1,'Las cargas se compensan.')],
 conc:'Explica con un ejemplo cómo se construye un átomo neutro de un elemento.',lim:'Modelo de capas de Bohr simplificado (hasta Z = 20, capas 2–8–8–2): no representa orbitales ni la posición real de los electrones.'});

add({n:'Modelos atómicos históricos',tema:'Átomo · modelos',dif:2,mot:'rutherford',
 obj:'Explicar cómo el experimento de dispersión de partículas alfa llevó al modelo nuclear del átomo.',comp:[C1,C2,C3],
 evid:['Relaciona la desviación con la cercanía al núcleo.','Contrasta lo esperado por Thomson con lo observado.','Explica por qué el átomo es casi vacío con un núcleo pequeño y denso.'],
 teo:'<b>Dalton</b> (1803) imaginó átomos como esferas indivisibles. <b>Thomson</b> (1897) descubrió el electrón y propuso un «pastel de pasas»: carga positiva difusa con electrones incrustados. En 1911 <b>Rutherford</b>, con los datos de Geiger y Marsden, vio que unas pocas partículas alfa rebotaban hacia atrás: la carga positiva y casi toda la masa están en un <b>núcleo diminuto</b>. <b>Bohr</b> (1913) puso los electrones en niveles de energía y el modelo actual los describe como nubes de probabilidad.',
 mat:['Fuente de partículas alfa de 5 MeV','Lámina de oro','Pantalla detectora (modelo)'],
 proc:[{t:'Lanza partículas con b grande (mayor de 80 fm) y observa que casi no se desvían.',a:'tipo_leve'},{t:'Lanza una con b pequeño (menor de 20 fm) y observa que rebota.',a:'tipo_retro'},{t:'Lanza al menos 5 partículas con distintos b.',a:'lanza',n:5}],
 cfg:{},
 ana:['¿Qué esperaba el modelo de Thomson y qué se observó?','¿Qué indica que muy pocas partículas rebotaran? ¿Cómo es el núcleo comparado con el átomo?'],
 ev:[MC('Rutherford concluyó que el átomo tiene…',['Una esfera maciza','Un núcleo pequeño, denso y positivo','Electrones incrustados en una masa positiva','Solo neutrones'],1,'Las alfas rebotaban al acercarse a un núcleo diminuto.'),MC('Una partícula alfa rebota hacia atrás cuando…',['Pasa lejos del núcleo','Pasa muy cerca del núcleo','No tiene energía','Atraviesa un electrón'],1,'Cuanto menor es b, mayor la desviación.'),MC('El modelo de «pastel de pasas» es de…',['Dalton','Thomson','Bohr','Rutherford'],1,'J. J. Thomson.')],
 conc:'Resume qué observó Rutherford, qué modelo descartó y por qué.',lim:'Modelo clásico de dispersión por un núcleo puntual (sin apantallamiento por electrones ni efectos cuánticos). Los valores de fracción de rebotes son órdenes de magnitud; el experimento real usó láminas de otros espesores.'});

add({n:'Número atómico y masa atómica',tema:'Átomo · números',dif:1,mot:'atomo',
 obj:'Calcular protones, neutrones y electrones a partir del número atómico (Z) y el número de masa (A).',comp:[C1,C3],
 evid:['Usa A = Z + neutrones.','Identifica el elemento con Z.','Representa el átomo con su notación.'],
 teo:'El <b>número atómico Z</b> es el número de protones. El <b>número de masa A</b> es protones + neutrones. Por tanto, neutrones = A − Z. En un átomo neutro, electrones = Z. La <b>masa atómica</b> que aparece en la tabla periódica es un promedio de los isótopos naturales, por eso no es un número entero.',
 mat:['Constructor de átomos','Retos con Z y A'],
 proc:[{t:'Ajusta partículas hasta resolver el primer reto.',a:'reto_ok'},{t:'Usa neutrones = A − Z en al menos 3 retos.',a:'reto_ok',n:3},{t:'Resuelve los 5 retos.',a:'todo_ok'}],
 cfg:{modo:'construir',retos:[{q:'Un átomo neutro tiene <b>Z = 7 y A = 14</b>. Constrúyelo.',t:{p:7,n:7},why:'n = 14 − 7 = 7 (nitrógeno-14).'},{q:'Un átomo neutro tiene <b>Z = 11 y A = 23</b>. Constrúyelo.',t:{p:11,n:12},why:'n = 23 − 11 = 12.'},{q:'Un átomo neutro tiene <b>Z = 17 y A = 35</b>. Constrúyelo.',t:{p:17,n:18},why:'n = 35 − 17 = 18 (cloro-35).'},{q:'Un átomo neutro tiene <b>Z = 20 y A = 40</b>. Constrúyelo.',t:{p:20,n:20},why:'n = 40 − 20 = 20.'},{q:'Un átomo neutro tiene <b>Z = 6 y A = 14</b>. Constrúyelo.',t:{p:6,n:8},why:'n = 14 − 6 = 8 (carbono-14).'}]},
 ana:['¿Cómo calculas los neutrones si conoces Z y A?','¿Por qué la masa atómica de la tabla no es un número entero?'],
 ev:[MC('Un átomo con Z = 9 y A = 19 tiene…',['9 neutrones','10 neutrones','19 neutrones','28 neutrones'],1,'n = 19 − 9 = 10.'),MC('El número de masa A es…',['Solo protones','Protones + neutrones','Neutrones + electrones','Solo electrones'],1,'Nucleones del núcleo.'),MC('La masa atómica de la tabla periódica es…',['Siempre entera','Un promedio de isótopos','Solo de protones','De los electrones'],1,'Promedia las masas y abundancias.')],
 conc:'Escribe el procedimiento para hallar protones, neutrones y electrones de un átomo neutro a partir de Z y A.',lim:'Se trabaja hasta Z = 20; la masa de los electrones es despreciable y no se modela la energía de enlace nuclear.'});

add({n:'Isótopos atómicos',tema:'Átomo · isótopos',dif:2,mot:'isotopos',
 obj:'Explicar qué son los isótopos y calcular la masa atómica promedio a partir de masas y abundancias.',comp:[C1,C2,C3],
 evid:['Distingue isótopos por su número de masa.','Calcula una media ponderada.','Explica por qué la masa de la tabla no es entera.'],
 teo:'Los <b>isótopos</b> son átomos del mismo elemento (mismo Z) con distinto número de neutrones. La masa atómica promedio es una <b>media ponderada</b>: Σ(masa del isótopo × abundancia) ÷ 100. Por ejemplo, el cloro tiene 75,76 % de Cl-35 y 24,24 % de Cl-37, y su masa promedio es ≈ 35,45 u.',
 mat:['5 elementos con sus isótopos naturales','Espectro de masas'],
 proc:[{t:'Pulsa «Abundancias reales» y observa el espectro.',a:'real'},{t:'Cambia las abundancias con los deslizadores (al menos 3 ajustes).',a:'ajusta',n:3},{t:'Calcula la masa promedio con abundancias que sumen 100 %.',a:'prom_ok'}],
 cfg:{elems:[{s:'B',n:'Boro',tabla:10.81,isos:[{A:10,m:10.0129,ab:19.9},{A:11,m:11.0093,ab:80.1}]},{s:'C',n:'Carbono',tabla:12.011,isos:[{A:12,m:12.0000,ab:98.93},{A:13,m:13.0034,ab:1.07}]},{s:'Mg',n:'Magnesio',tabla:24.305,isos:[{A:24,m:23.9850,ab:78.99},{A:25,m:24.9858,ab:10.00},{A:26,m:25.9826,ab:11.01}]},{s:'Cl',n:'Cloro',tabla:35.45,isos:[{A:35,m:34.9689,ab:75.76},{A:37,m:36.9659,ab:24.24}]},{s:'Cu',n:'Cobre',tabla:63.546,isos:[{A:63,m:62.9296,ab:69.15},{A:65,m:64.9278,ab:30.85}]}]},
 ana:['Si el cloro tuviera 50 % de Cl-35 y 50 % de Cl-37, ¿cuál sería su masa promedio? ¿Por qué cambia?','¿Por qué la masa de la tabla del carbono (12,011) está tan cerca de 12?'],
 ev:[MC('Los isótopos de un elemento tienen…',['Distinto número de protones','Distinto número de neutrones','Distinto número de electrones en el núcleo','Distinto elemento'],1,'Mismo Z, distinto A.'),MC('La masa atómica promedio se calcula con…',['Una suma simple','Una media ponderada con las abundancias','Solo el isótopo más pesado','Solo los neutrones'],1,'Σ masa × abundancia.'),MC('Si un elemento tiene un isótopo muy dominante, su masa promedio…',['Se acerca a la masa de ese isótopo','Se aleja de ella','Es cero','No existe'],0,'Pesa más en el promedio.')],
 conc:'Explica con un cálculo por qué la masa atómica de un elemento no es un número entero.',lim:'Abundancias naturales redondeadas (pueden variar según la fuente de la muestra); masas isotópicas con cuatro decimales.'});

add({n:'Distribución electrónica básica',tema:'Átomo · electrones',dif:2,mot:'atomo',
 obj:'Distribuir los electrones de los primeros 20 elementos en capas: 2, 8, 8, 2.',comp:[C1,C2],
 evid:['Aplica la capacidad de cada capa.','Escribe la distribución en capas.','Relaciona electrones de la última capa con la posición en la tabla.'],
 teo:'Los electrones se ubican en <b>capas</b> (niveles de energía). Para los primeros 20 elementos se llenan en orden: primera capa hasta 2 electrones, segunda hasta 8, tercera hasta 8 y cuarta recibe el resto (hasta 2). Los electrones de la última capa (<b>electrones de valencia</b>) explican el comportamiento químico y coinciden con el grupo del elemento (1, 2, 13–18).',
 mat:['Capas K, L, M y N','Contador de electrones'],
 proc:[{t:'Coloca electrones en las capas con los botones + y −.',a:'coloca',n:5},{t:'Comprueba tu primera distribución.',a:'reto_ok'},{t:'Resuelve los 6 retos.',a:'todo_ok'}],
 cfg:{modo:'capas',retos:[{q:'Distribuye los <b>3 electrones del litio</b> (Z = 3).',z:3},{q:'Distribuye los <b>9 electrones del flúor</b> (Z = 9).',z:9},{q:'Distribuye los <b>11 electrones del sodio</b> (Z = 11).',z:11},{q:'Distribuye los <b>15 electrones del fósforo</b> (Z = 15).',z:15},{q:'Distribuye los <b>18 electrones del argón</b> (Z = 18).',z:18},{q:'Distribuye los <b>20 electrones del calcio</b> (Z = 20).',z:20}]},
 ana:['¿Qué tienen en común el litio y el sodio en su última capa?','¿Por qué el argón (2–8–8) casi no reacciona?'],
 ev:[MC('La primera capa admite hasta…',['2 electrones','8 electrones','18 electrones','1 electrón'],0,'K = 2.'),MC('El sodio (Z = 11) se distribuye…',['2–8–1','2–9','2–8–2','11'],0,'Un electrón de valencia.'),MC('Los electrones de la última capa se llaman…',['De valencia','Neutrones','Isótopos','Protones'],0,'Determinan cómo reacciona el elemento.')],
 conc:'Describe cómo distribuyes los electrones de un átomo en capas y da un ejemplo.',lim:'Regla simplificada válida hasta Z = 20; desde Z = 21 la distribución real incluye subniveles (se estudia en décimo).'});

add({n:'Explorador de la tabla periódica',tema:'Tabla periódica · exploración',dif:1,mot:'tabla',
 obj:'Explorar la tabla periódica (elementos 1–36) y localizar elementos por periodo, grupo, número atómico y familia.',comp:[C1,C3],
 evid:['Lee grupo y periodo en la tabla.','Usa el número atómico para ubicar un elemento.','Interpreta colores por familia o tipo.'],
 teo:'La <b>tabla periódica</b> ordena los elementos por número atómico creciente. Las <b>filas</b> son <b>periodos</b> (1 a 7) y las <b>columnas</b> son <b>grupos</b> (1 a 18). Los elementos de un grupo tienen propiedades parecidas porque tienen el mismo número de electrones de valencia.',
 mat:['Tabla con los elementos 1–36','Ficha por elemento','Colores por familia, tipo, radio o electronegatividad'],
 proc:[{t:'Toca al menos 8 elementos distintos y lee sus fichas.',a:'ver',n:8},{t:'Cambia el color de la tabla al menos una vez.',a:'colorea'},{t:'Resuelve el primer reto.',a:'reto_ok'},{t:'Acierta al menos 5 de los 6 retos.',a:'todo_ok'}],
 cfg:{modo:'retos',vista:'neutro',selector:true,uso:true,retos:[{q:'Encuentra el elemento del <b>periodo 2, grupo 17</b>.',ok:{p:2,g:17},why:'Es el flúor.'},{q:'Encuentra el elemento con <b>número atómico 26</b>.',ok:{z:26},why:'Es el hierro.'},{q:'Encuentra un <b>gas noble del periodo 3</b>.',ok:{f:'noble',p:3},why:'Es el argón.'},{q:'Encuentra el <b>metal alcalino del periodo 4</b>.',ok:{f:'alcalino',p:4},why:'Es el potasio.'},{q:'Encuentra el elemento de símbolo <b>Cu</b>.',ok:{s:'Cu'},why:'Es el cobre.'},{q:'Encuentra el primer elemento del <b>grupo 14</b>.',ok:{g:14,p:2},why:'Es el carbono.'}]},
 ana:['¿Qué tienen en común los elementos de una misma columna?','¿Cómo se ordenan los elementos a lo largo de una fila?'],
 ev:[MC('Las filas horizontales de la tabla se llaman…',['Grupos','Periodos','Familias','Isótopos'],1,'Periodos.'),MC('La tabla ordena los elementos por…',['Masa alfabética','Número atómico creciente','Color','Densidad'],1,'Z creciente.'),MC('Hay…',['18 grupos','8 grupos','7 grupos','10 grupos'],0,'Numeración IUPAC de 1 a 18.')],
 conc:'Explica cómo ubicar un elemento en la tabla con su grupo y su periodo.',lim:'Solo los elementos 1–36; masas atómicas redondeadas; radio atómico empírico (Slater) y electronegatividad de Pauling.'});

add({n:'Familias de la tabla periódica',tema:'Tabla periódica · familias',dif:2,mot:'tabla',
 obj:'Reconocer las familias (alcalinos, alcalinotérreos, halógenos, gases nobles…) y asociarlas a su grupo.',comp:[C1,C2],
 evid:['Ubica familias en la tabla.','Relaciona familia con grupo.','Describe propiedades generales de cada familia.'],
 teo:'Las familias agrupan elementos de comportamiento parecido: <b>alcalinos</b> (grupo 1, muy reactivos), <b>alcalinotérreos</b> (2), familia del <b>boro</b> (13), del <b>carbono</b> (14), del <b>nitrógeno</b> (15), <b>anfígenos</b> (16), <b>halógenos</b> (17, muy reactivos y con 7 electrones de valencia) y <b>gases nobles</b> (18, muy poco reactivos).',
 mat:['Tabla coloreada por familia','Retos de ubicación'],
 proc:[{t:'Toca al menos 6 elementos y lee su familia.',a:'ver',n:6},{t:'Resuelve el primer reto.',a:'reto_ok'},{t:'Acierta al menos 5 de los 6 retos.',a:'todo_ok'}],
 cfg:{modo:'retos',vista:'fam',uso:true,retos:[{q:'Elige un <b>halógeno</b>.',ok:{f:'halogeno'},why:'Los halógenos son el grupo 17: F, Cl, Br…'},{q:'Elige un <b>metal alcalino</b>.',ok:{f:'alcalino'},why:'Grupo 1: Li, Na, K…'},{q:'Elige un <b>gas noble</b>.',ok:{f:'noble'},why:'Grupo 18: He, Ne, Ar, Kr.'},{q:'Elige el <b>alcalinotérreo del periodo 3</b>.',ok:{f:'alcalinoterreo',p:3},why:'Es el magnesio.'},{q:'Elige el elemento de la <b>familia del carbono del periodo 3</b>.',ok:{f:'carbono',p:3},why:'Es el silicio.'},{q:'Elige el <b>anfígeno del periodo 2</b>.',ok:{f:'anfigeno',p:2},why:'Es el oxígeno.'}]},
 ana:['¿Por qué los gases nobles casi no reaccionan?','¿En qué grupo están los halógenos y cuántos electrones de valencia tienen?'],
 ev:[MC('Los metales alcalinos están en el grupo…',['1','2','17','18'],0,'Grupo 1.'),MC('Los halógenos son…',['Muy reactivos y del grupo 17','Gases nobles','Metales de transición','Del grupo 2'],0,'F, Cl, Br, I.'),MC('Los gases nobles se caracterizan por…',['Ser muy reactivos','Reaccionar muy poco','Ser metales','Ser líquidos'],1,'Capa externa completa.')],
 conc:'Elige dos familias y describe su ubicación y una propiedad de cada una.',lim:'Clasificación habitual por grupos; el hidrógeno se muestra aparte porque no pertenece a ninguna familia.'});

add({n:'Metales, no metales y metaloides',tema:'Tabla periódica · clasificación',dif:2,mot:'tabla',
 obj:'Clasificar elementos como metales, no metales o metaloides y ubicar su región en la tabla.',comp:[C1,C2,C3],
 evid:['Ubica la región de cada tipo.','Relaciona tipo con propiedades.','Reconoce metaloides como intermedios.'],
 teo:'La mayoría de los elementos son <b>metales</b> (brillo, buenos conductores, maleables) y están a la izquierda y en el centro. Los <b>no metales</b> están a la derecha (opacos, malos conductores, frágiles en estado sólido). Los <b>metaloides</b> (como B, Si, Ge, As) están en la frontera y tienen propiedades intermedias: el silicio es semiconductor.',
 mat:['Tabla con colores por tipo','Retos de ubicación'],
 proc:[{t:'Activa los colores por tipo (metal/no metal/metaloide).',a:'colorea'},{t:'Resuelve el primer reto.',a:'reto_ok'},{t:'Acierta al menos 4 de los 5 retos.',a:'todo_ok'}],
 cfg:{modo:'retos',vista:'neutro',selector:true,uso:true,retos:[{q:'Elige un <b>metaloide del periodo 2</b>.',ok:{t:'metaloide',p:2},why:'Es el boro.'},{q:'Elige el <b>no metal del grupo 16 en el periodo 3</b>.',ok:{t:'no metal',g:16,p:3},why:'Es el azufre.'},{q:'Elige un <b>metal del grupo 13</b>.',ok:{t:'metal',g:13},why:'Al y Ga son metales del grupo 13.'},{q:'Elige el <b>metaloide del periodo 4 y grupo 14</b>.',ok:{t:'metaloide',p:4,g:14},why:'Es el germanio.'},{q:'Elige el <b>gas noble del periodo 2</b> (un no metal).',ok:{f:'noble',p:2},why:'Es el neón.'}]},
 ana:['¿Dónde están los metales y dónde los no metales en la tabla?','¿Por qué el silicio se usa en chips de computador?'],
 ev:[MC('Los metaloides tienen propiedades…',['Solo de metal','Intermedias entre metales y no metales','Solo de gas','De ningún tipo'],1,'Están en la frontera.'),MC('Un buen conductor de la electricidad suele ser…',['Un metal','Un gas noble','Un no metal sólido','Un aislante'],0,'Los metales conducen.'),MC('El silicio es un…',['Metal alcalino','Metaloide','Halógeno','Gas'],1,'Metaloide semiconductor.')],
 conc:'Explica cómo distingues un metal de un no metal usando la tabla y sus propiedades.',lim:'Clasificación habitual (B, Si, Ge, As como metaloides); algunas fuentes incluyen otros elementos o los cuentan distinto.'});

add({n:'Radio atómico',tema:'Tabla periódica · propiedades',dif:2,mot:'tabla',
 obj:'Describir cómo varía el radio atómico en un periodo y en un grupo y explicarlo con la carga nuclear y el número de capas.',comp:[C1,C2,C3],
 evid:['Lee una tendencia en una gráfica.','Predice qué elemento tiene mayor radio.','Explica por qué baja en un periodo y sube en un grupo.'],
 teo:'El <b>radio atómico</b> es la distancia aproximada del núcleo al electrón más externo. En un <b>periodo</b> (de izquierda a derecha) disminuye porque aumenta la carga nuclear y atrae más los electrones de la misma capa. En un <b>grupo</b> (de arriba a abajo) aumenta porque se agregan capas.',
 mat:['Tabla coloreada por radio','Gráfica por periodo o por grupo'],
 proc:[{t:'Observa la gráfica de un periodo.',a:'grafica'},{t:'Cambia la gráfica a un grupo y compara.',a:'grafica',n:2},{t:'Resuelve el primer reto.',a:'reto_ok'},{t:'Acierta al menos 4 de los 5 retos.',a:'todo_ok'}],
 cfg:{modo:'retos',vista:'radio',grafica:'radio',grafN:3,uso:false,retos:[{q:'Elige el elemento de <b>mayor radio del periodo 3</b> (con dato).',ok:{p:3,max:'r'},why:'Es el sodio: al inicio del periodo la carga nuclear es menor.'},{q:'Elige el elemento de <b>menor radio del periodo 2</b> (con dato).',ok:{p:2,min:'r'},why:'Es el flúor.'},{q:'Elige el elemento de <b>mayor radio del grupo 1</b>.',ok:{g:1,max:'r'},why:'Es el potasio (de los mostrados): tiene más capas.'},{q:'Elige el elemento de <b>menor radio del grupo 17</b>.',ok:{g:17,min:'r'},why:'Es el flúor: tiene menos capas.'},{q:'Elige el elemento de <b>mayor radio del periodo 4</b> (con dato).',ok:{p:4,max:'r'},why:'Es el potasio.'}]},
 ana:['¿Por qué el radio disminuye al recorrer un periodo?','¿Por qué el radio aumenta al bajar en un grupo?'],
 ev:[MC('En un periodo, de izquierda a derecha, el radio atómico…',['Aumenta','Disminuye','No cambia','Se duplica'],1,'Mayor carga nuclear efectiva.'),MC('En un grupo, de arriba a abajo, el radio…',['Aumenta','Disminuye','Es constante','Es cero'],0,'Hay más capas.'),MC('¿Cuál tiene mayor radio?',['Na','Cl','F','O'],0,'Na 180 pm; Cl 100; O 60; F 50.')],
 conc:'Resume la tendencia del radio atómico en periodos y grupos y su explicación.',lim:'Radios empíricos de Slater (pm); no están los gases nobles. Los metales de transición varían poco entre sí.'});

add({n:'Electronegatividad',tema:'Tabla periódica · propiedades',dif:2,mot:'tabla',
 obj:'Describir la tendencia de la electronegatividad (escala de Pauling) y predecir qué elemento atrae más los electrones.',comp:[C1,C2,C3],
 evid:['Interpreta la gráfica de electronegatividad.','Compara dos elementos.','Relaciona electronegatividad con la tendencia en la tabla.'],
 teo:'La <b>electronegatividad</b> mide la tendencia de un átomo a atraer los electrones de un enlace (escala de Pauling, F = 3,98). Aumenta de izquierda a derecha en un periodo y disminuye al bajar en un grupo. Los elementos más electronegativos son F, O, N y Cl; los menos, los metales alcalinos. Los gases nobles no tienen valor en esta tabla.',
 mat:['Tabla coloreada por electronegatividad','Gráfica por periodo o grupo'],
 proc:[{t:'Observa la gráfica de un periodo.',a:'grafica'},{t:'Cambia a un grupo y compara.',a:'grafica',n:2},{t:'Resuelve el primer reto.',a:'reto_ok'},{t:'Acierta al menos 4 de los 5 retos.',a:'todo_ok'}],
 cfg:{modo:'retos',vista:'en',grafica:'en',grafN:2,uso:false,retos:[{q:'Elige el elemento <b>más electronegativo del periodo 2</b>.',ok:{p:2,max:'en'},why:'Es el flúor (3,98).'},{q:'Elige el elemento <b>menos electronegativo del grupo 1</b> (de los mostrados).',ok:{g:1,min:'en'},why:'Es el potasio (0,82).'},{q:'Elige el elemento <b>más electronegativo del periodo 3</b> (con dato).',ok:{p:3,max:'en'},why:'Es el cloro (3,16).'},{q:'Elige el <b>más electronegativo del grupo 16</b>.',ok:{g:16,max:'en'},why:'Es el oxígeno (3,44).'},{q:'Elige el <b>menos electronegativo del periodo 3</b>.',ok:{p:3,min:'en'},why:'Es el sodio (0,93).'}]},
 ana:['¿Por qué el flúor es el más electronegativo?','¿Qué relación observas entre electronegatividad y radio atómico?'],
 ev:[MC('La electronegatividad mide…',['La masa del átomo','La tendencia a atraer electrones en un enlace','La carga del núcleo','El número de neutrones'],1,'Capacidad de atraer electrones.'),MC('El elemento más electronegativo es…',['Flúor','Sodio','Oxígeno','Cloro'],0,'F = 3,98.'),MC('En un grupo, al bajar, la electronegatividad…',['Aumenta','Disminuye','Es igual','Se vuelve negativa'],1,'Los electrones están más lejos del núcleo.')],
 conc:'Resume cómo cambia la electronegatividad en la tabla y por qué.',lim:'Escala de Pauling con valores redondeados; los gases nobles (sin compuestos comunes) se muestran sin dato.'});

add({n:'Formación de iones',tema:'Átomo · iones',dif:2,mot:'atomo',
 obj:'Formar iones ganando o perdiendo electrones y relacionar la carga con el número de protones y electrones.',comp:[C1,C2,C3],
 evid:['Calcula la carga como protones − electrones.','Forma cationes y aniones.','Relaciona el ion con la configuración de un gas noble.'],
 teo:'Un <b>ion</b> es un átomo con carga. Si <b>pierde</b> electrones queda positivo (<b>catión</b>); si <b>gana</b> electrones queda negativo (<b>anión</b>). Los protones no cambian. Los metales tienden a formar cationes (Na⁺, Mg²⁺, Al³⁺) y los no metales aniones (Cl⁻, O²⁻); así logran la distribución electrónica de un gas noble (2 u 8 electrones en la última capa).',
 mat:['Constructor de átomos','Retos de iones'],
 proc:[{t:'Quita o agrega electrones y mira cómo cambia la carga.',a:'agrega_e',n:4},{t:'Resuelve el primer reto.',a:'reto_ok'},{t:'Resuelve los 6 retos.',a:'todo_ok'}],
 cfg:{modo:'iones',retos:[{q:'Forma el ion <b>Na⁺</b> (sodio con carga +1).',t:{p:11,e:10},why:'Perdió 1 electrón: queda con 2–8, como el neón.'},{q:'Forma el ion <b>Cl⁻</b> (cloro con carga −1).',t:{p:17,e:18},why:'Ganó 1 electrón: queda con 2–8–8, como el argón.'},{q:'Forma el ion <b>Mg²⁺</b>.',t:{p:12,e:10},why:'Perdió 2 electrones: queda con 2–8.'},{q:'Forma el ion <b>O²⁻</b>.',t:{p:8,e:10},why:'Ganó 2 electrones: queda con 2–8.'},{q:'Forma el ion <b>Al³⁺</b>.',t:{p:13,e:10},why:'Perdió 3 electrones: queda con 2–8.'},{q:'Forma el ion <b>Li⁺</b>.',t:{p:3,e:2},why:'Perdió 1 electrón: queda con 2, como el helio.'}]},
 ana:['¿Qué cambia en un átomo cuando se convierte en ion y qué no cambia?','¿Por qué el sodio forma Na⁺ y el cloro forma Cl⁻?'],
 ev:[MC('Un átomo que pierde electrones queda…',['Positivo','Negativo','Neutro','Sin protones'],0,'Catión.'),MC('El ion Mg²⁺ tiene…',['12 p y 10 e','10 p y 12 e','12 p y 14 e','2 p y 2 e'],0,'Perdió 2 electrones.'),MC('La carga de un ion es…',['Protones − electrones','Protones + electrones','Neutrones − protones','Electrones − neutrones'],0,'Carga neta.')],
 conc:'Explica cómo se forma un catión y un anión con un ejemplo de cada uno.',lim:'Modelo de capas hasta Z = 20; solo iones monoatómicos comunes.'});

add({n:'Elementos químicos en la vida cotidiana',tema:'Elementos · aplicaciones',dif:1,mot:'tabla',
 obj:'Asociar elementos con sus usos y su presencia en objetos y materiales de la vida diaria.',comp:[C1,C2],
 evid:['Relaciona elemento y uso.','Identifica elementos en objetos cotidianos.','Distingue el elemento del compuesto que lo contiene.'],
 teo:'Los elementos están a nuestro alrededor, casi siempre formando <b>compuestos</b> o <b>mezclas</b>: el sodio y el cloro forman la sal de mesa, el oxígeno es cerca del 21 % del aire, el hierro es la base del acero y el calcio está en huesos y dientes. Muchos elementos puros se usan directamente: cobre en cables, aluminio en latas, helio en globos.',
 mat:['Tabla con ficha de usos','Retos de «¿qué elemento es?»'],
 proc:[{t:'Lee las fichas de al menos 8 elementos.',a:'ver',n:8},{t:'Resuelve el primer reto.',a:'reto_ok'},{t:'Acierta al menos 6 de los 8 retos.',a:'todo_ok'}],
 cfg:{modo:'vida',vista:'neutro',uso:true,retos:[{q:'Se usa en <b>cables eléctricos y tuberías</b>.',ok:{s:'Cu'},why:'Es el cobre.'},{q:'Es cerca del <b>21 % del aire</b> y lo respiramos.',ok:{s:'O'},why:'Es el oxígeno.'},{q:'Es el metal de las <b>latas y el papel aluminio</b>.',ok:{s:'Al'},why:'Es el aluminio.'},{q:'Fortalece <b>huesos y dientes</b> y está en la cal y el cemento.',ok:{s:'Ca'},why:'Es el calcio.'},{q:'Es la base del <b>acero</b> y está en la hemoglobina de la sangre.',ok:{s:'Fe'},why:'Es el hierro.'},{q:'Se usa en <b>globos</b> y es un gas noble.',ok:{s:'He'},why:'Es el helio.'},{q:'Es el elemento principal del <b>carbón y del grafito de los lápices</b>.',ok:{s:'C'},why:'Es el carbono.'},{q:'Está en la <b>arena</b> y en los <b>chips de computador</b>.',ok:{s:'Si'},why:'Es el silicio.'}]},
 ana:['¿Qué elementos hay en tu casa y cómo se usan?','¿Por qué el sodio y el cloro, tan peligrosos puros, forman la sal que comemos?'],
 ev:[MC('El gas más abundante del aire es…',['Oxígeno','Nitrógeno','Helio','Hidrógeno'],1,'Cerca del 78 %.'),MC('El cobre se usa en cables porque…',['Es transparente','Conduce muy bien la electricidad','Es gaseoso','Es muy liviano'],1,'Buen conductor.'),MC('La sal de mesa está formada por…',['Sodio y cloro','Calcio y oxígeno','Hierro y azufre','Carbono y hidrógeno'],0,'NaCl.')],
 conc:'Escribe tres elementos que uses en tu vida diaria, el objeto donde están y su propiedad principal.',lim:'Solo elementos 1–36; los usos son ejemplos generales y no una lista completa.'});

add({n:'Símbolos y nombres químicos',tema:'Lenguaje · símbolos',dif:1,mot:'tabla',
 obj:'Asociar símbolos con los nombres de los elementos y reconocer las reglas de escritura (mayúscula + minúscula).',comp:[C1],
 evid:['Escribe correctamente los símbolos.','Relaciona símbolo y nombre.','Reconoce símbolos que vienen del latín.'],
 teo:'Cada elemento tiene un <b>símbolo</b> de una o dos letras: la primera en mayúscula y la segunda en minúscula (Co es cobalto; CO es el monóxido de carbono, un compuesto). Algunos vienen del latín: Na (natrium, sodio), K (kalium, potasio), Fe (ferrum, hierro), Cu (cuprum, cobre).',
 mat:['Tabla con símbolos','10 retos de opción múltiple'],
 proc:[{t:'Responde el primer reto.',a:'simbolo_ok'},{t:'Acierta al menos 5 símbolos.',a:'simbolo_ok',n:5},{t:'Completa los 10 retos con al menos 7 aciertos.',a:'todo_ok'}],
 cfg:{modo:'simbolos',vista:'neutro'},
 ana:['¿Por qué algunos símbolos no se parecen al nombre en español (Na, K, Fe, Cu)?','¿Qué diferencia hay entre Co y CO?'],
 ev:[MC('El símbolo del sodio es…',['So','Na','S','N'],1,'Natrium.'),MC('El símbolo del hierro es…',['Hi','Fe','Ir','H'],1,'Ferrum.'),MC('Los símbolos se escriben con…',['Dos mayúsculas','Mayúscula y minúscula','Minúsculas','Números'],1,'Ej.: Ca, Mg.')],
 conc:'Escribe cinco símbolos con su nombre y explica la regla de escritura.',lim:'Se evalúan los primeros 30 elementos; los nombres siguen el español de uso común en Colombia.'});

add({n:'Clasificación de sustancias',tema:'Materia · sustancias',dif:2,mot:'clasif',
 obj:'Clasificar sustancias como elementos, compuestos o mezclas con base en pruebas conceptuales.',comp:[C1,C2,C3],
 evid:['Distingue elemento de compuesto.','Usa composición fija y tipos de átomos como criterios.','Reconoce mezclas.'],
 teo:'Un <b>elemento</b> tiene un solo tipo de átomo (O₂, Fe). Un <b>compuesto</b> tiene dos o más tipos de átomos unidos en proporción fija (H₂O, NaCl, CO₂) y solo se descompone por <b>medios químicos</b>. Una <b>mezcla</b> reúne sustancias sin proporción fija y se separa por <b>medios físicos</b> (aire, agua con sal, acero).',
 mat:['8 muestras','3 preguntas guía'],
 proc:[{t:'Elige una muestra y haz al menos dos pruebas.',a:'prueba',n:2},{t:'Clasifícala y lee la retroalimentación.',a:'clasifica_ok'},{t:'Clasifica bien las 8 muestras.',a:'todo_ok'}],
 cfg:{tituloItems:'Muestras',pregunta:'¿Es elemento, compuesto o mezcla?',
  items:[{k:'o2',n:'Oxígeno (O₂)',e:'🫧'},{k:'ag',n:'Agua (H₂O)',e:'💧'},{k:'sa',n:'Sal (NaCl)',e:'🧂'},{k:'ai',n:'Aire',e:'🌬️'},{k:'fe',n:'Hierro (Fe)',e:'🔩'},{k:'as',n:'Agua con sal',e:'🥣'},{k:'co',n:'Dióxido de carbono (CO₂)',e:'🫧'},{k:'ac',n:'Acero',e:'⚙️'}],
  tests:[{k:'ti',n:'¿Cuántos tipos de átomos tiene?'},{k:'de',n:'¿Se descompone en sustancias más simples?'},{k:'fi',n:'¿Su composición es fija?'}],
  cats:[{k:'e',n:'Elemento'},{k:'c',n:'Compuesto'},{k:'m',n:'Mezcla'}],
  ans:{o2:'e',ag:'c',sa:'c',ai:'m',fe:'e',as:'m',co:'c',ac:'m'},
  res:{o2:{ti:'Un solo tipo: O.',de:'No: ya es un elemento.',fi:'Sí.'},ag:{ti:'Dos tipos: H y O (2 : 1).',de:'Sí: por electrólisis se obtienen H₂ y O₂.',fi:'Sí: siempre 2 H por 1 O.'},sa:{ti:'Dos tipos: Na y Cl (1 : 1).',de:'Sí: al electrolizarla fundida se obtienen Na y Cl₂.',fi:'Sí: 1 : 1.'},ai:{ti:'Varios: N, O, Ar, C…',de:'Se separa por medios físicos (destilación del aire líquido).',fi:'No: varía con el lugar y la altura.'},fe:{ti:'Un solo tipo: Fe.',de:'No.',fi:'Sí.'},as:{ti:'Varios: H, O, Na, Cl.',de:'Se separa por evaporación (medio físico).',fi:'No: puedes poner más o menos sal.'},co:{ti:'Dos tipos: C y O (1 : 2).',de:'Sí, mediante reacciones químicas se obtienen carbono y oxígeno.',fi:'Sí: 1 C por 2 O.'},ac:{ti:'Sobre todo Fe y C (y otros).',de:'No se separa con filtros: es una aleación.',fi:'No: cambia con el tipo de acero.'}},
  why:{o2:'Un solo tipo de átomo.',ag:'Dos elementos en proporción fija.',sa:'Dos elementos en proporción fija.',ai:'Varios gases sin proporción fija.',fe:'Un solo tipo de átomo.',as:'Proporción variable y separable por medios físicos.',co:'Dos elementos en proporción fija.',ac:'Aleación: mezcla homogénea de proporción variable.'}},
 ana:['¿Cómo distingues un compuesto de una mezcla?','¿Por qué el O₂ es un elemento y no un compuesto aunque tenga dos átomos?'],
 ev:[MC('Un compuesto tiene…',['Un solo tipo de átomo','Dos o más tipos de átomos en proporción fija','Cualquier proporción','Solo gases'],1,'Composición fija.'),MC('El aire es…',['Elemento','Compuesto','Mezcla','Ion'],2,'Mezcla de gases.'),MC('Un compuesto se separa en sus elementos por…',['Filtración','Medios químicos','Evaporación','Decantación'],1,'Se necesita una reacción.')],
 conc:'Explica con un ejemplo cómo distingues elementos, compuestos y mezclas.',lim:'Resultados descritos; algunos materiales reales (como el aire o el acero) tienen composición variable según su origen.'});

add({n:'Lenguaje químico',tema:'Lenguaje · fórmulas',dif:2,mot:'formula',
 obj:'Interpretar fórmulas químicas: subíndices, paréntesis y coeficientes, y calcular átomos y masa molar.',comp:[C1,C3],
 evid:['Lee subíndices y paréntesis.','Calcula átomos con un coeficiente.','Calcula una masa molar.'],
 teo:'Una <b>fórmula</b> indica qué elementos hay y cuántos átomos de cada uno: H₂O tiene 2 H y 1 O. El <b>subíndice</b> afecta al átomo que lo precede; un <b>paréntesis</b> con subíndice multiplica todo lo que contiene (Ca(OH)₂ tiene 2 O y 2 H). El <b>coeficiente</b> multiplica toda la fórmula (3 H₂O tiene 6 H y 3 O). La <b>masa molar</b> es la suma de las masas atómicas (g/mol).',
 mat:['10 compuestos','Coeficiente de 1 a 6','Tabla de átomos y masa molar'],
 proc:[{t:'Explora al menos 3 compuestos distintos.',a:'explora',n:3},{t:'Cambia el coeficiente.',a:'coef'},{t:'Resuelve el primer reto.',a:'reto_ok'},{t:'Acierta al menos 5 de los 7 retos.',a:'todo_ok'}],
 cfg:{comp:[{f:'H2O',n:'Agua',tipo:'compuesto',at:{H:2,O:1}},{f:'CO2',n:'Dióxido de carbono',tipo:'compuesto',at:{C:1,O:2}},{f:'NaCl',n:'Cloruro de sodio',tipo:'compuesto',at:{Na:1,Cl:1}},{f:'NH3',n:'Amoníaco',tipo:'compuesto',at:{N:1,H:3}},{f:'CH4',n:'Metano',tipo:'compuesto',at:{C:1,H:4}},{f:'H2SO4',n:'Ácido sulfúrico',tipo:'compuesto',at:{H:2,S:1,O:4}},{f:'Ca(OH)2',n:'Hidróxido de calcio',tipo:'compuesto',at:{Ca:1,O:2,H:2}},{f:'Al2O3',n:'Óxido de aluminio',tipo:'compuesto',at:{Al:2,O:3}},{f:'Mg(NO3)2',n:'Nitrato de magnesio',tipo:'compuesto',at:{Mg:1,N:2,O:6}},{f:'C6H12O6',n:'Glucosa',tipo:'compuesto',at:{C:6,H:12,O:6}}],
  retos:[{f:'H2O',el:'H',k:3},{f:'CO2',el:'O',k:4},{f:'Ca(OH)2',el:'O',k:2},{f:'H2SO4',el:'O',k:1},{f:'Al2O3',el:'Al',k:3},{f:'Mg(NO3)2',el:'O',k:2},{f:'C6H12O6',el:'H',k:1}]},
 ana:['¿Qué diferencia hay entre un subíndice y un coeficiente?','¿Por qué en Ca(OH)₂ hay dos átomos de oxígeno?'],
 ev:[MC('En H₂SO₄ hay…',['2 H, 1 S y 4 O','1 H, 2 S y 4 O','2 H, 4 S y 1 O','7 átomos de H'],0,'Los subíndices dicen cuántos.'),MC('3 H₂O tiene…',['3 H y 1 O','6 H y 3 O','2 H y 3 O','5 átomos en total'],1,'El coeficiente multiplica todo.'),MC('La masa molar se obtiene…',['Sumando las masas atómicas de la fórmula','Restando masas','Contando protones','Contando neutrones'],0,'En g/mol.')],
 conc:'Explica cómo contar los átomos de una fórmula con paréntesis y coeficiente, con un ejemplo.',lim:'Masas molares con masas atómicas redondeadas de la tabla (dos decimales); no se tratan aún iones ni nomenclatura (octavo).'});

add({n:'Estructura de materiales',tema:'Materia · estructura',dif:2,mot:'clasif',
 obj:'Distinguir materiales cristalinos de amorfos según el orden de sus partículas y sus propiedades.',comp:[C1,C2,C3],
 evid:['Relaciona orden interno con fractura y fusión.','Clasifica materiales cotidianos.','Explica por qué el vidrio se ablanda gradualmente.'],
 teo:'En un material <b>cristalino</b> las partículas forman una red ordenada y repetida: se parte en caras planas y funde a una temperatura definida (sal, cuarzo, hielo, diamante). En un material <b>amorfo</b> las partículas no tienen orden de largo alcance: se fractura de forma curva y se ablanda poco a poco al calentar (vidrio, caucho, muchos plásticos).',
 mat:['8 materiales','3 pruebas: fractura, fusión y modelo de partículas'],
 proc:[{t:'Elige un material y haz al menos dos pruebas.',a:'prueba',n:2},{t:'Clasifícalo y lee la retroalimentación.',a:'clasifica_ok'},{t:'Clasifica bien los 8 materiales.',a:'todo_ok'}],
 cfg:{tituloItems:'Materiales',pregunta:'¿Cristalino o amorfo?',
  items:[{k:'sa',n:'Sal de mesa',e:'🧂'},{k:'cu',n:'Cuarzo',e:'💎'},{k:'hi',n:'Hielo',e:'🧊'},{k:'di',n:'Diamante',e:'💠'},{k:'vi',n:'Vidrio de ventana',e:'🪟'},{k:'ca',n:'Caucho',e:'🛞'},{k:'pv',n:'Plástico PVC',e:'🧴'},{k:'ob',n:'Obsidiana',e:'🌋'}],
  tests:[{k:'fr',n:'Mirar la fractura'},{k:'fu',n:'¿Funde a una temperatura definida?'},{k:'mo',n:'Modelo de partículas'}],
  cats:[{k:'c',n:'Cristalino'},{k:'a',n:'Amorfo'}],
  ans:{sa:'c',cu:'c',hi:'c',di:'c',vi:'a',ca:'a',pv:'a',ob:'a'},
  res:{sa:{fr:'Se parte en cubos de caras planas.',fu:'Sí: 801 °C.',mo:'Partículas ordenadas en una red cúbica.'},cu:{fr:'Cristales con caras planas y ángulos definidos.',fu:'Sí: a una temperatura definida y muy alta.',mo:'Red ordenada de átomos de Si y O.'},hi:{fr:'Cristales hexagonales (copos de nieve).',fu:'Sí: 0 °C.',mo:'Red ordenada hexagonal.'},di:{fr:'Se parte siguiendo planos definidos.',fu:'Resiste temperaturas muy altas sin ablandarse gradualmente.',mo:'Red ordenada de átomos de carbono.'},
   vi:{fr:'Fractura curva, sin caras planas.',fu:'No: se ablanda poco a poco.',mo:'Partículas sin orden de largo alcance.'},ca:{fr:'Se estira; no se parte en caras planas.',fu:'No: se ablanda y se degrada.',mo:'Cadenas largas enredadas, sin orden.'},pv:{fr:'Fractura irregular, sin caras planas.',fu:'No: se ablanda en un intervalo de temperatura.',mo:'Cadenas enredadas sin orden regular.'},ob:{fr:'Fractura curva con filos de vidrio.',fu:'No: se ablanda poco a poco (vidrio volcánico).',mo:'Sin orden de largo alcance.'}},
  why:{sa:'Red ordenada.',cu:'Red ordenada.',hi:'Red ordenada.',di:'Red ordenada de carbono.',vi:'Sin orden de largo alcance.',ca:'Cadenas desordenadas.',pv:'Cadenas desordenadas.',ob:'Vidrio natural: amorfo.'}},
 ana:['¿Por qué la sal se parte en cubos y el vidrio no?','¿Qué significa que un material se «ablande» en vez de fundirse a una temperatura exacta?'],
 ev:[MC('Un sólido cristalino tiene partículas…',['Ordenadas en una red','Totalmente desordenadas','Solo líquidas','Sin masa'],0,'Orden repetido.'),MC('El vidrio es…',['Cristalino','Amorfo','Un metal','Un gas'],1,'Sin orden de largo alcance.'),MC('Funde a una temperatura definida…',['El material cristalino','El material amorfo','Todos','Ninguno'],0,'Su red se rompe a una T concreta.')],
 conc:'Explica con dos ejemplos cómo el orden de las partículas cambia las propiedades.',lim:'Clasificación idealizada: muchos plásticos y metales reales son semicristalinos o policristalinos.'});

window.QUI_G7=L;
})();
