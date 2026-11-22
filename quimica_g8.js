/* AULA360 — Catálogo de Química · OCTAVO (laboratorios 33–49 del inventario oficial). Datos de referencia redondeados; cada laboratorio declara sus límites.
   DBA y estándares: solo se citan cuando están verificados contra el MEN; mientras tanto se marcan «por verificar». */
(function(){
const C1='Uso comprensivo del conocimiento científico',C2='Explicación de fenómenos',C3='Indagación',PV='Por verificar con el documento oficial del MEN antes de citarlo',
 EST='Estándares básicos de competencias en Ciencias Naturales (entorno físico, grupos 8°–9°): enunciado exacto por verificar';
const L=[];let n=0;const add=o=>{n++;o.c='Q08-'+String(n).padStart(3,'0');o.g=8;o.no=32+n;o.dba=PV;o.est=EST;o.area='Química';L.push(o)};
const MC=(q,o,ok,fb)=>({q,o,ok,fb});

/* 33 */
add({n:'Enlace iónico',tema:'Enlace químico',dif:2,mot:'enlace',
 obj:'Predecir cuándo se forma un enlace iónico a partir de la diferencia de electronegatividad y escribir la fórmula del compuesto resultante.',comp:[C1,C2],
 evid:['Calcula la diferencia de electronegatividad (ΔEN) entre dos elementos.','Identifica que un metal y un no metal con ΔEN grande forman enlace iónico.','Escribe la fórmula de un compuesto iónico sencillo.'],
 teo:'En el <b>enlace iónico</b> un átomo cede electrones y otro los recibe: se forman <b>cationes (+)</b> y <b>aniones (−)</b> que se atraen. Ocurre entre un <b>metal</b> y un <b>no metal</b> cuando la diferencia de electronegatividad (ΔEN) es grande (en este laboratorio, ΔEN ≥ 1,7). Los compuestos iónicos forman redes cristalinas, tienen puntos de fusión altos y conducen la electricidad cuando están fundidos o disueltos. La fórmula resulta de que las cargas se compensen: Mg²⁺ + 2 Cl⁻ → MgCl₂.',
 mat:['Elementos: Na, K, Li, Mg, Ca, O, F, Cl, Br, S','Tabla de electronegatividad (escala de Pauling)'],
 proc:[{t:'Une al menos 4 parejas de elementos y mira la ΔEN.',a:'une',n:4},{t:'Encuentra 3 uniones que den enlace iónico.',a:'tipo_ionico',n:3},{t:'Resuelve los retos de tipo de enlace y fórmula.',a:'todo_ok'}],
 cfg:{elems:['Na','K','Li','Mg','Ca','O','F','Cl','Br','S'],retos:[
  {tipo:'tipo',q:'¿Qué enlace forman <b>Na</b> y <b>Cl</b>?',a:'Na',b:'Cl',why:'Metal + no metal con ΔEN grande: iónico.'},
  {tipo:'tipo',q:'¿Qué enlace forman <b>K</b> y <b>Br</b>?',a:'K',b:'Br',why:'Metal alcalino + halógeno: iónico.'},
  {tipo:'formula',q:'¿Cuál es la fórmula del compuesto de <b>Mg</b> y <b>Cl</b>?',a:'Mg',b:'Cl',opts:['MgCl','MgCl2','Mg2Cl','Mg2Cl2'],why:'Mg²⁺ necesita dos Cl⁻.'},
  {tipo:'formula',q:'¿Cuál es la fórmula del compuesto de <b>Na</b> y <b>S</b>?',a:'Na',b:'S',opts:['NaS','Na2S','NaS2','Na2S2'],why:'Dos Na⁺ compensan un S²⁻.'},
  {tipo:'formula',q:'¿Cuál es la fórmula del compuesto de <b>Ca</b> y <b>O</b>?',a:'Ca',b:'O',opts:['CaO','Ca2O','CaO2','Ca2O2'],why:'Ca²⁺ y O²⁻ se compensan 1 a 1.'}]},
 ana:['¿Por qué un metal y un no metal tienden a formar enlace iónico?','¿Por qué en MgCl₂ hay dos cloros por cada magnesio?'],
 ev:[MC('En un enlace iónico…',['Se comparten electrones','Un átomo cede electrones a otro','Hay un mar de electrones','No hay interacción'],1,'Se forman iones con cargas opuestas.'),MC('¿Qué par forma enlace iónico?',['Cl y Cl','Na y Cl','H y H','O y O'],1,'Metal y no metal con ΔEN grande.'),MC('La fórmula del óxido de calcio es…',['CaO','Ca2O','CaO2','Ca2O2'],0,'Ca²⁺ + O²⁻.')],
 conc:'Explica con un ejemplo cómo la ΔEN te ayuda a predecir el tipo de enlace.',lim:'Criterio simplificado (ΔEN ≥ 1,7). El carácter iónico es gradual; muchos enlaces reales tienen carácter intermedio. Valores de electronegatividad de Pauling redondeados.'});

/* 34 */
add({n:'Enlace covalente',tema:'Enlace químico',dif:2,mot:'enlace',
 obj:'Distinguir enlaces covalentes polares y apolares y relacionar el número de pares compartidos con la molécula formada.',comp:[C1,C2],
 evid:['Clasifica un enlace como covalente polar o apolar según la ΔEN.','Identifica que los átomos comparten pares de electrones.','Escribe la fórmula de moléculas sencillas.'],
 teo:'En el <b>enlace covalente</b> los átomos de no metales <b>comparten pares de electrones</b>. Si los átomos son iguales o su electronegatividad es parecida (ΔEN < 0,4) el enlace es <b>apolar</b>; si hay diferencia moderada, los electrones se desplazan hacia el átomo más electronegativo y el enlace es <b>polar</b>. Pueden compartirse 1, 2 o 3 pares (enlace sencillo, doble o triple).',
 mat:['Elementos: H, C, N, O, F, Cl, S, Br','Escala de electronegatividad de Pauling'],
 proc:[{t:'Une al menos 4 parejas de no metales.',a:'une',n:4},{t:'Encuentra una unión covalente polar.',a:'tipo_covalente_polar'},{t:'Encuentra una unión covalente apolar.',a:'tipo_covalente_apolar'},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{elems:['H','C','N','O','F','Cl','S','Br'],retos:[
  {tipo:'tipo',q:'¿Qué enlace forman <b>Cl</b> y <b>Cl</b>?',a:'Cl',b:'Cl',why:'Átomos iguales: ΔEN = 0, covalente apolar.'},
  {tipo:'tipo',q:'¿Qué enlace forman <b>H</b> y <b>Cl</b>?',a:'H',b:'Cl',why:'ΔEN intermedia: los electrones se acercan al Cl, polar.'},
  {tipo:'tipo',q:'¿Qué enlace forman <b>O</b> y <b>H</b>?',a:'O',b:'H',why:'El O atrae más los electrones: covalente polar.'},
  {tipo:'tipo',q:'¿Qué enlace forman <b>C</b> y <b>H</b>?',a:'C',b:'H',why:'ΔEN pequeña (0,35): se trata como apolar.'}]},
 ana:['¿Qué diferencia hay entre compartir electrones y ceder electrones?','¿Por qué el enlace H–Cl es polar y el Cl–Cl no?'],
 ev:[MC('En un enlace covalente los átomos…',['Ceden electrones','Comparten electrones','Pierden protones','Se funden'],1,'Comparten pares de electrones.'),MC('Un enlace entre átomos iguales es…',['Iónico','Covalente apolar','Metálico','Covalente polar'],1,'ΔEN = 0.'),MC('El enlace H–Cl es…',['Covalente polar','Iónico','Metálico','Apolar'],0,'El Cl atrae más los electrones.')],
 conc:'Explica con dos ejemplos la diferencia entre enlace covalente polar y apolar.',lim:'Clasificación simplificada por ΔEN (umbral 0,4). El carbono con hidrógeno se trata como apolar por convención escolar.'});

/* 35 */
add({n:'Enlace metálico',tema:'Enlace químico',dif:2,mot:'metalico',
 obj:'Explicar con el modelo del mar de electrones por qué los metales conducen la electricidad y se deforman, a diferencia de los cristales iónicos.',comp:[C1,C2],
 evid:['Describe el enlace metálico como cationes en un mar de electrones.','Explica la conducción eléctrica de los metales.','Contrasta la deformación de un metal con la ruptura de un cristal iónico.'],
 teo:'En el <b>enlace metálico</b> los átomos del metal ceden electrones de valencia que quedan <b>libres</b> y forman un «mar de electrones» alrededor de los cationes. Por eso los metales <b>conducen la electricidad</b> (los electrones se mueven) y son <b>maleables y dúctiles</b> (las capas de cationes se deslizan sin romper el enlace). En un cristal iónico los iones están fijos: no conduce en estado sólido y al golpearlo se <b>fractura</b>, porque se enfrentan cargas iguales.',
 mat:['Modelo de un metal y de un cristal iónico','Fuente de voltaje y martillo virtuales'],
 proc:[{t:'Aplica voltaje a los dos materiales y compara.',a:'voltaje'},{t:'Golpea ambos materiales.',a:'golpea',n:2}],
 cfg:{},
 ana:['¿Por qué el metal conduce y el cristal iónico sólido no?','¿Por qué el metal se deforma y el cristal iónico se rompe?'],
 ev:[MC('Los electrones libres de un metal…',['Están fijos en un ion','Se mueven entre los cationes','No existen','Son neutrones'],1,'Forman el mar de electrones.'),MC('Un cristal iónico al golpearlo…',['Se deforma','Se fractura','Conduce','Se disuelve'],1,'Se enfrentan iones de igual carga.'),MC('Los metales son maleables porque…',['Los cationes pueden deslizarse en el mar de electrones','Son gases','Tienen enlaces covalentes','Tienen iones fijos'],0,'El enlace no se rompe al deslizarse.')],
 conc:'Resume en tres frases las diferencias entre un metal y un cristal iónico.',lim:'Modelo cualitativo y bidimensional: no calcula conductividades reales ni considera defectos del cristal.'});

/* 36 */
add({n:'Formación de moléculas',tema:'Moléculas',dif:2,mot:'molecula',
 obj:'Combinar átomos de no metales para formar moléculas sencillas, relacionando el número de enlaces de cada átomo con la fórmula.',comp:[C1,C3],
 evid:['Relaciona la valencia (enlaces que forma) con la fórmula molecular.','Forma moléculas como H₂O, CO₂, NH₃ y CH₄.','Explica por qué cada átomo completa su capa de valencia.'],
 teo:'Una <b>molécula</b> es un grupo de átomos unidos por enlaces covalentes. Cada átomo tiende a completar su capa de valencia: el <b>H</b> forma 1 enlace, el <b>O</b> 2, el <b>N</b> 3 y el <b>C</b> 4; el <b>Cl</b> y el <b>F</b> forman 1. Por eso el agua es H₂O (un O con dos H), el amoníaco NH₃ y el metano CH₄. La <b>fórmula molecular</b> indica cuántos átomos de cada elemento hay en la molécula.',
 mat:['Átomos disponibles: H, O, C, N, Cl, F','Tablero de construcción'],
 proc:[{t:'Agrega átomos al tablero.',a:'agrega',n:4},{t:'Forma al menos 3 moléculas distintas.',a:'molecula_ok',n:3},{t:'Resuelve los retos de construcción.',a:'todo_ok'}],
 cfg:{atomos:['H','O','C','N','Cl','F'],retos:[
  {q:'Construye una molécula de <b>agua</b> (H₂O).',f:'H2O',hint:'el oxígeno forma 2 enlaces.'},
  {q:'Construye <b>dióxido de carbono</b> (CO₂).',f:'CO2',hint:'el carbono forma 4 enlaces: dos dobles con O.'},
  {q:'Construye <b>amoníaco</b> (NH₃).',f:'NH3',hint:'el nitrógeno forma 3 enlaces.'},
  {q:'Construye <b>metano</b> (CH₄).',f:'CH4',hint:'el carbono forma 4 enlaces.'},
  {q:'Construye <b>cloruro de hidrógeno</b> (HCl).',f:'HCl',hint:'cada uno forma 1 enlace.'}]},
 ana:['¿Por qué el oxígeno se une a dos hidrógenos y no a uno o tres?','¿Qué indica el subíndice en una fórmula como CO₂?'],
 ev:[MC('¿Cuántos enlaces forma normalmente el carbono?',['1','2','3','4'],3,'Cuatro.'),MC('La fórmula del amoníaco es…',['NH','NH2','NH3','N3H'],2,'El N forma tres enlaces.'),MC('El subíndice de una fórmula indica…',['La carga','El número de átomos','La masa','El color'],1,'Cuántos átomos hay de ese elemento.')],
 conc:'Explica cómo la valencia de un átomo determina la fórmula de una molécula.',lim:'Solo se construyen moléculas covalentes sencillas con enlaces sencillos, dobles y triples; no modela cargas formales ni resonancia.'});

/* 37 */
add({n:'Geometría molecular',tema:'Moléculas',dif:3,mot:'vsepr',
 obj:'Predecir la geometría de una molécula contando los pares de electrones enlazantes y no enlazantes alrededor del átomo central.',comp:[C1,C2],
 evid:['Cuenta pares enlazantes y libres alrededor del átomo central.','Relaciona el número de pares con la geometría.','Explica por qué el agua es angular y el CO₂ lineal.'],
 teo:'El modelo <b>RPECV (VSEPR)</b> dice que los pares de electrones alrededor de un átomo se <b>repelen</b> y se ubican lo más lejos posible. Los pares <b>libres</b> ocupan más espacio que los enlazantes. Con 2 pares enlazantes y 0 libres: <b>lineal</b> (180°); 3-0: <b>trigonal plana</b> (120°); 4-0: <b>tetraédrica</b> (109,5°); 3-1: <b>piramidal</b> (≈107°); 2-2: <b>angular</b> (104,5°); 2-1: angular (≈118°).',
 mat:['Contadores de pares enlazantes y libres','Modelo 3D que gira'],
 proc:[{t:'Cambia el número de pares y observa el modelo.',a:'cambia',n:5},{t:'Encuentra al menos 4 geometrías distintas.',a:'geom_nueva',n:4},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{retos:[
  {q:'<b>H₂O</b>: ¿cuántos pares enlazantes y libres tiene el O?',bp:2,lp:2,why:'2 enlazantes y 2 libres: angular (104,5°).'},
  {q:'<b>NH₃</b>: ¿pares del N?',bp:3,lp:1,why:'3 enlazantes y 1 libre: piramidal.'},
  {q:'<b>CH₄</b>: ¿pares del C?',bp:4,lp:0,why:'4 enlazantes: tetraédrica.'},
  {q:'<b>CO₂</b>: ¿regiones de enlace del C?',bp:2,lp:0,why:'2 regiones y ningún par libre: lineal.'},
  {q:'<b>BF₃</b>: ¿pares del B?',bp:3,lp:0,why:'3 enlazantes: trigonal plana.'},
  {q:'<b>SO₂</b>: ¿pares del S?',bp:2,lp:1,why:'2 enlazantes y 1 libre: angular.'}]},
 ana:['¿Por qué los pares libres cambian el ángulo de enlace?','¿Por qué H₂O y CO₂ tienen tres átomos pero forma distinta?'],
 ev:[MC('La geometría del metano (CH₄) es…',['Lineal','Tetraédrica','Angular','Plana'],1,'4 pares enlazantes.'),MC('El agua es angular porque el O tiene…',['Dos pares libres','Ningún par libre','Un neutrón extra','Carga positiva'],0,'2 pares libres empujan a los enlaces.'),MC('2 pares enlazantes sin pares libres dan geometría…',['Lineal','Piramidal','Tetraédrica','Angular'],0,'180°.')],
 conc:'Explica con el agua y el CO₂ cómo los pares de electrones determinan la forma.',lim:'Modelo cualitativo; los ángulos son valores de referencia redondeados y no se calculan por energía.'});

/* 38 */
add({n:'Polaridad molecular',tema:'Moléculas',dif:3,mot:'polar',
 obj:'Decidir si una molécula es polar o apolar combinando la polaridad de sus enlaces con su geometría.',comp:[C1,C2],
 evid:['Reconoce enlaces polares y sus dipolos.','Explica por qué una molécula con enlaces polares puede ser apolar.','Clasifica moléculas como polar o apolar.'],
 teo:'Un enlace es <b>polar</b> cuando sus electrones se desplazan hacia el átomo más electronegativo, formando un <b>dipolo</b>. Una molécula es <b>polar</b> si la suma de sus dipolos <b>no es cero</b> (depende de la geometría). Así, <b>CO₂</b> y <b>CH₄</b> tienen enlaces polares o casi apolares pero dipolos que se cancelan: moléculas apolares; <b>H₂O</b> y <b>NH₃</b> no se cancelan: polares. La polaridad influye en la solubilidad («lo semejante disuelve a lo semejante»).',
 mat:['Moléculas: CO₂, H₂O, CH₄, NH₃, BF₃, CCl₄, CH₃Cl, HCl','Vista de dipolos'],
 proc:[{t:'Observa 3 moléculas y sus dipolos.',a:'ver',n:3},{t:'Haz predicciones antes de ver el resultado.',a:'predice',n:3},{t:'Acierta al menos 3 predicciones.',a:'predice_ok',n:3},{t:'Completa todas las moléculas.',a:'todo_ok'}],
 cfg:{mols:['CO2','H2O','CH4','NH3','BF3','CCl4','CH3Cl','HCl']},
 ana:['¿Por qué el CO₂ es apolar si sus enlaces C=O son polares?','¿Cómo cambia la polaridad si sustituyes un H del metano por Cl?'],
 ev:[MC('El agua es una molécula…',['Apolar','Polar','Iónica','Metálica'],1,'Geometría angular: dipolos no se cancelan.'),MC('El CCl₄ es apolar porque…',['Sus dipolos se cancelan por la forma tetraédrica','No tiene enlaces','Es iónico','Tiene H'],0,'Simetría.'),MC('Una molécula es polar cuando…',['La suma de dipolos no es cero','Tiene muchos átomos','Es un gas','Tiene carbono'],0,'Depende de la geometría.')],
 conc:'Explica la diferencia entre enlace polar y molécula polar con un ejemplo.',lim:'Se usan geometrías y dipolos cualitativos; no se calculan momentos dipolares reales.'});

/* 39 */
add({n:'Fuerzas intermoleculares',tema:'Moléculas',dif:3,mot:'intermol',
 obj:'Relacionar el punto de ebullición de sustancias moleculares con las fuerzas entre moléculas (London, dipolo–dipolo y puentes de hidrógeno).',comp:[C1,C2],
 evid:['Interpreta gráficas de punto de ebullición de familias de hidruros.','Identifica anomalías causadas por puentes de hidrógeno.','Relaciona la masa y la polaridad con las fuerzas entre moléculas.'],
 teo:'Las <b>fuerzas intermoleculares</b> actúan <i>entre</i> moléculas y determinan propiedades como el punto de ebullición. Hay tres tipos: <b>fuerzas de London</b> (en todas las moléculas; crecen con la masa y el tamaño), <b>dipolo–dipolo</b> (moléculas polares) y <b>puentes de hidrógeno</b> (H unido a N, O o F con un par libre de otra molécula), que son las más fuertes. Por eso H₂O, NH₃ y HF hierven mucho más alto que sus compañeros de grupo.',
 mat:['Datos de puntos de ebullición de hidruros de los grupos 14 al 17','Gráfica interactiva'],
 proc:[{t:'Revisa las gráficas de al menos 3 familias.',a:'serie',n:3},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{retos:[
  {q:'El agua hierve a 100 °C y el H₂S a −60 °C. ¿Por qué?',o:['El agua forma puentes de hidrógeno','El H₂S es más pesado','El agua es iónica','El H₂S es un metal'],ok:0,why:'Los puentes de hidrógeno del agua son fuerzas intermoleculares muy intensas.'},
  {q:'En el grupo 14 (CH₄ … SnH₄) el punto de ebullición sube porque…',o:['Aumentan la masa y las fuerzas de London','Forman puentes de hidrógeno','Son iónicos','Disminuye la masa'],ok:0,why:'Moléculas apolares: solo London, que crecen con el tamaño.'},
  {q:'¿Cuál hierve a mayor temperatura: HF (19,5 °C) o HCl (−85 °C)?',o:['HF, por puentes de hidrógeno','HCl, por mayor masa','Igual','HCl, por ser iónico'],ok:0,why:'El F es muy electronegativo: forma puentes de hidrógeno.'},
  {q:'Los puentes de hidrógeno aparecen cuando el H está unido a…',o:['N, O o F','C o Si','Na o K','He o Ne'],ok:0,why:'Son los átomos pequeños y muy electronegativos.'},
  {q:'El NH₃ hierve a −33 °C y el PH₃ a −88 °C. La diferencia se explica por…',o:['Puentes de hidrógeno en el NH₃','Enlace metálico','Enlace iónico','No hay diferencia real'],ok:0,why:'El N forma puentes de hidrógeno; el P casi no.'}]},
 ana:['¿Por qué el punto de ebullición del agua no sigue la tendencia de su grupo?','¿Se rompen los enlaces covalentes cuando hierve el agua?'],
 ev:[MC('Las fuerzas intermoleculares actúan…',['Entre moléculas','Dentro del núcleo','Entre electrones de un mismo átomo','Solo en metales'],0,'Entre moléculas.'),MC('Los puentes de hidrógeno son más fuertes que…',['Las fuerzas de London típicas','El enlace covalente','El enlace iónico','Todas las anteriores'],0,'Son fuerzas intermoleculares intensas, pero más débiles que los enlaces.'),MC('Al hervir agua se rompen principalmente…',['Enlaces covalentes O–H','Fuerzas intermoleculares','Núcleos','Electrones'],1,'Las moléculas se separan, no se rompen.')],
 conc:'Explica con un ejemplo cómo las fuerzas intermoleculares determinan un punto de ebullición.',lim:'Valores de ebullición de referencia redondeados (1 atm). El modelo no calcula energías de interacción.'});

/* 40 */
add({n:'Fórmulas químicas',tema:'Compuestos',dif:2,mot:'nomen',
 obj:'Construir fórmulas de compuestos iónicos combinando las cargas de sus iones y comprobar que el compuesto es neutro.',comp:[C1,C3],
 evid:['Escribe la fórmula intercambiando cargas y simplificando.','Usa paréntesis para iones de varios átomos.','Verifica que la carga total sea cero.'],
 teo:'La <b>fórmula química</b> indica qué elementos hay en un compuesto y en qué proporción. En un compuesto iónico la carga positiva total debe igualar la negativa. Se <b>cruzan las cargas</b> (la carga del catión pasa a subíndice del anión y viceversa) y se <b>simplifica</b>. Si el ion tiene varios átomos (OH⁻, NO₃⁻, SO₄²⁻) y el subíndice es mayor que 1, se usan <b>paréntesis</b>: Ca(OH)₂, Al₂(SO₄)₃.',
 mat:['Cationes: Na⁺, K⁺, Mg²⁺, Ca²⁺, Al³⁺, Zn²⁺, Ag⁺, NH₄⁺','Aniones: Cl⁻, O²⁻, S²⁻, OH⁻, NO₃⁻, SO₄²⁻, CO₃²⁻'],
 proc:[{t:'Construye al menos 5 compuestos distintos.',a:'forma',n:5},{t:'Acierta 3 retos de fórmula.',a:'reto_ok',n:3},{t:'Completa los retos.',a:'todo_ok'}],
 cfg:{cats:['Na','K','Mg','Ca','Al','Zn','Ag','NH4'],anis:['Cl','O','S','OH','NO3','SO4','CO3'],retos:[{t:'f',c:'Ca',a:'Cl'},{t:'f',c:'Al',a:'O'},{t:'f',c:'Mg',a:'OH'},{t:'f',c:'Na',a:'SO4'},{t:'f',c:'Al',a:'SO4'},{t:'f',c:'Ca',a:'NO3'},{t:'f',c:'NH4',a:'CO3'}]},
 ana:['¿Por qué se usan paréntesis en Ca(OH)₂ y no en NaOH?','¿Cómo compruebas que una fórmula está bien escrita?'],
 ev:[MC('La fórmula del cloruro de calcio es…',['CaCl','CaCl2','Ca2Cl','Ca2Cl2'],1,'Ca²⁺ necesita dos Cl⁻.'),MC('En un compuesto iónico la carga total es…',['Positiva','Negativa','Cero','Variable'],2,'Neutro.'),MC('Los paréntesis se usan cuando…',['Hay un ion poliatómico con subíndice mayor que 1','Siempre','Nunca','Solo con metales'],0,'Para que el subíndice afecte a todo el grupo.')],
 conc:'Explica con un ejemplo cómo cruzas las cargas para escribir una fórmula.',lim:'Solo compuestos iónicos con las cargas habituales; no incluye compuestos covalentes ni sales hidratadas.'});

/* 41 */
add({n:'Compuestos binarios',tema:'Compuestos',dif:2,mot:'nomen',
 obj:'Escribir y nombrar compuestos binarios (un metal y un no metal) usando las cargas de los iones.',comp:[C1,C2],
 evid:['Reconoce que un compuesto binario tiene solo dos elementos.','Escribe la fórmula de cloruros, óxidos, sulfuros y similares.','Nombra el compuesto como «no metal-uro de metal».'],
 teo:'Un <b>compuesto binario</b> está formado por dos elementos. Se nombra con el no metal terminado en <b>-uro</b> (cloruro, bromuro, fluoruro, sulfuro) o como <b>óxido</b> para el oxígeno, seguido de <b>«de» + metal</b>: NaCl, cloruro de sodio; CaO, óxido de calcio; Al₂S₃, sulfuro de aluminio. La fórmula sale de equilibrar las cargas.',
 mat:['Metales: Na, K, Li, Mg, Ca, Al, Zn, Ag','No metales: Cl, Br, F, S, O'],
 proc:[{t:'Construye al menos 6 compuestos binarios.',a:'forma',n:6},{t:'Acierta 4 retos.',a:'reto_ok',n:4},{t:'Completa los retos.',a:'todo_ok'}],
 cfg:{cats:['Na','K','Li','Mg','Ca','Al','Zn','Ag'],anis:['Cl','Br','F','S','O'],retos:[{t:'f',c:'Mg',a:'Cl'},{t:'n',c:'Na',a:'Cl'},{t:'f',c:'Al',a:'O'},{t:'n',c:'Ca',a:'O'},{t:'f',c:'K',a:'S'},{t:'n',c:'Al',a:'S'},{t:'f',c:'Zn',a:'Br'},{t:'n',c:'Ag',a:'F'}]},
 ana:['¿Qué terminación recibe el no metal en un compuesto binario?','¿Por qué el óxido de aluminio es Al₂O₃?'],
 ev:[MC('NaCl se llama…',['Cloruro de sodio','Sodio de cloruro','Clorato de sodio','Cloro sódico'],0,'No metal-uro de metal.'),MC('Un compuesto binario tiene…',['Dos elementos','Tres elementos','Un elemento','Cuatro elementos'],0,'Dos elementos.'),MC('La fórmula del sulfuro de potasio es…',['KS','K2S','KS2','K2S2'],1,'Dos K⁺ por un S²⁻.')],
 conc:'Explica cómo se escribe y se nombra un compuesto binario con un ejemplo.',lim:'Solo metales con una carga habitual; los de varias cargas se tratan en el laboratorio de nomenclatura.'});

/* 42 */
add({n:'Nomenclatura química básica',tema:'Compuestos',dif:3,mot:'nomen',
 obj:'Nombrar y formular compuestos iónicos sencillos, incluidos metales con más de una carga (nomenclatura Stock) e iones poliatómicos.',comp:[C1,C2],
 evid:['Usa el número romano para indicar la carga de hierro y cobre.','Nombra hidróxidos, nitratos, sulfatos y carbonatos.','Deduce la fórmula a partir del nombre.'],
 teo:'La nomenclatura <b>Stock</b> indica la carga del metal con un número romano cuando puede tener varias: <b>FeCl₂</b> es cloruro de hierro (II) y <b>FeCl₃</b> cloruro de hierro (III); <b>Cu₂O</b> es óxido de cobre (I) y <b>CuO</b> óxido de cobre (II). Los iones poliatómicos tienen nombre propio: OH⁻ hidróxido, NO₃⁻ nitrato, SO₄²⁻ sulfato, CO₃²⁻ carbonato, NH₄⁺ amonio.',
 mat:['Cationes: Na⁺, Mg²⁺, Ca²⁺, Al³⁺, Fe²⁺, Fe³⁺, Cu⁺, Cu²⁺, NH₄⁺','Aniones: Cl⁻, O²⁻, OH⁻, NO₃⁻, SO₄²⁻, CO₃²⁻'],
 proc:[{t:'Construye al menos 6 compuestos distintos.',a:'forma',n:6},{t:'Acierta 4 retos.',a:'reto_ok',n:4},{t:'Completa los retos.',a:'todo_ok'}],
 cfg:{cats:['Na','Mg','Ca','Al','Fe2','Fe3','Cu1','Cu2','NH4'],anis:['Cl','O','OH','NO3','SO4','CO3'],retos:[{t:'n',c:'Fe2',a:'Cl'},{t:'n',c:'Fe3',a:'Cl'},{t:'f',c:'Cu2',a:'O'},{t:'n',c:'Cu1',a:'O'},{t:'f',c:'Fe3',a:'OH'},{t:'n',c:'Ca',a:'CO3'},{t:'f',c:'Mg',a:'NO3'},{t:'n',c:'Al',a:'SO4'}]},
 ana:['¿Qué indica el número romano en «óxido de hierro (III)»?','¿Cómo se nombra Ca(OH)₂?'],
 ev:[MC('FeCl₃ se llama…',['Cloruro de hierro (II)','Cloruro de hierro (III)','Cloruro férrico simple','Hierro cloro'],1,'Hierro con carga 3+.'),MC('El ion SO₄²⁻ se llama…',['Sulfuro','Sulfato','Sulfito','Sulfuro ácido'],1,'Sulfato.'),MC('El número romano indica…',['La carga del metal','El número de átomos','La masa','El periodo'],0,'La carga del metal.')],
 conc:'Explica con un ejemplo por qué algunos metales necesitan número romano en su nombre.',lim:'Solo nomenclatura Stock para compuestos iónicos sencillos; no incluye ácidos ni compuestos covalentes.'});

/* 43 */
add({n:'Reacciones químicas',tema:'Reacciones',dif:2,mot:'labrx',
 obj:'Mezclar sustancias, observar si ocurre una reacción y representarla con una ecuación química.',comp:[C2,C3],
 evid:['Registra observaciones al mezclar sustancias.','Identifica reactivos y productos.','Distingue mezclas con reacción de mezclas sin reacción.'],
 teo:'En una <b>reacción química</b> unas sustancias (<b>reactivos</b>) se transforman en otras (<b>productos</b>) con propiedades distintas. Se representa con una <b>ecuación química</b>: reactivos → productos. Para saber si hubo reacción se buscan evidencias: gas, precipitado, cambio de color o de temperatura. Algunas mezclas no reaccionan: solo se mezclan.',
 mat:['Soluciones diluidas: HCl, NaOH, CuSO₄, AgNO₃, NaCl','Sólidos: CaCO₃, Mg, Zn, Fe, Cu'],
 proc:[{t:'Haz al menos 4 mezclas.',a:'mezcla',n:4},{t:'Encuentra 3 mezclas con reacción.',a:'reacciona',n:3},{t:'Encuentra una mezcla sin reacción.',a:'noreacciona'},{t:'Registra 6 mezclas distintas.',a:'todo_ok'}],
 cfg:{meta:6},
 ana:['¿Qué evidencia viste en cada reacción?','¿Cómo sabes que una mezcla sin cambios visibles realmente no reaccionó?'],
 ev:[MC('Las sustancias que se transforman se llaman…',['Productos','Reactivos','Catalizadores','Mezclas'],1,'Reactivos.'),MC('Una evidencia de reacción es…',['Burbujas de gas','Cambiar de lugar el tubo','Agitar','Pesar'],0,'Gas, precipitado, color o temperatura.'),MC('Una ecuación química muestra…',['Reactivos → productos','Solo productos','Solo reactivos','La temperatura'],0,'Lo que se transforma en qué.')],
 conc:'Describe una reacción que hayas observado y escribe su ecuación.',lim:'Se modela una selección de reacciones a temperatura ambiente con soluciones diluidas. Que el modelo diga «sin reacción» no significa que sea imposible en otras condiciones.'});

/* 44 */
add({n:'Evidencias de cambios químicos',tema:'Reacciones',dif:2,mot:'clasif',
 obj:'Clasificar fenómenos según la evidencia principal que indica un cambio químico y distinguirlos de los cambios físicos.',comp:[C2,C3],
 evid:['Reconoce gas, precipitado, cambio de color y energía como evidencias.','Distingue un cambio físico de uno químico.','Justifica su clasificación con observaciones.'],
 teo:'Un <b>cambio químico</b> forma sustancias nuevas. Evidencias comunes: <b>desprendimiento de gas</b> (burbujas), <b>formación de un precipitado</b> (sólido que aparece en una solución), <b>cambio de color</b>, y <b>liberación o absorción de energía</b> (calor, luz). En un <b>cambio físico</b> (fundir, disolver) la sustancia sigue siendo la misma y suele poder recuperarse.',
 mat:['8 fenómenos','3 pruebas: observar, medir temperatura y ver si es reversible'],
 proc:[{t:'Elige un fenómeno y haz al menos 3 pruebas en total.',a:'prueba',n:3},{t:'Clasifica 4 fenómenos correctamente.',a:'clasifica_ok',n:4},{t:'Clasifica los 8 fenómenos.',a:'todo_ok'}],
 cfg:{tituloItems:'Fenómenos',pregunta:'¿Cuál es la evidencia principal?',
  items:[{k:'vb',n:'Vinagre + bicarbonato',e:'🫧'},{k:'pl',n:'AgNO₃ + NaCl',e:'⚪'},{k:'cu',n:'CuSO₄ + NaOH',e:'🔵'},{k:'cl',n:'Clavo en CuSO₄',e:'🔩'},{k:'mg',n:'Magnesio quemándose',e:'🔥'},{k:'hi',n:'Hielo derritiéndose',e:'🧊'},{k:'sa',n:'Sal disuelta en agua',e:'🧂'},{k:'zn',n:'Zinc + HCl',e:'🧪'}],
  tests:[{k:'ob',n:'Observar'},{k:'te',n:'Medir temperatura'},{k:'re',n:'¿Se puede revertir?'}],
  cats:[{k:'g',n:'Gas'},{k:'p',n:'Precipitado'},{k:'c',n:'Cambio de color'},{k:'e',n:'Luz o calor'},{k:'f',n:'Cambio físico'}],
  ans:{vb:'g',pl:'p',cu:'p',cl:'c',mg:'e',hi:'f',sa:'f',zn:'g'},
  res:{vb:{ob:'Aparecen burbujas que suben.',te:'La mezcla se enfría ligeramente.',re:'No: el bicarbonato no se recupera.'},pl:{ob:'Aparece un sólido blanco que se deposita.',te:'Sin cambio apreciable.',re:'No: se formó una sustancia nueva.'},cu:{ob:'Aparece un sólido azul gelatinoso.',te:'Sin cambio apreciable.',re:'No: se formó una sustancia nueva.'},cl:{ob:'El clavo se cubre de un depósito rojizo y el azul se aclara.',te:'Sin cambio apreciable.',re:'No: se formó cobre metálico.'},mg:{ob:'Luz blanca muy intensa y un polvo blanco.',te:'Se libera mucho calor.',re:'No: se formó óxido de magnesio.'},hi:{ob:'El hielo pasa a líquido; es la misma sustancia.',te:'0 °C mientras se derrite.',re:'Sí: al enfriar vuelve a ser hielo.'},sa:{ob:'La sal desaparece a la vista, pero el agua sabe salada.',te:'Sin cambio apreciable.',re:'Sí: al evaporar el agua reaparece la sal.'},zn:{ob:'Burbujas continuas sobre el metal.',te:'La mezcla se calienta ligeramente.',re:'No: el zinc se transforma en una sal.'}},
  why:{vb:'Se desprende CO₂.',pl:'Se forma AgCl, insoluble.',cu:'Se forma Cu(OH)₂, insoluble.',cl:'El hierro desplaza al cobre: depósito rojizo.',mg:'La combustión libera luz y calor intensos.',hi:'Es un cambio de estado: cambio físico.',sa:'Disolver es un cambio físico: la sal se recupera.',zn:'Se desprende H₂.'}},
 ana:['¿Qué evidencia es más confiable para saber que hubo una reacción?','¿Por qué disolver sal es un cambio físico y no químico?'],
 ev:[MC('Burbujas al mezclar dos sustancias indican…',['Formación de un gas','Un cambio de estado','Nada','Un precipitado'],0,'Desprendimiento de gas.'),MC('Un cambio físico…',['Forma sustancias nuevas','No forma sustancias nuevas','Siempre libera luz','Siempre forma gas'],1,'La sustancia sigue siendo la misma.'),MC('Un sólido que aparece en una solución es…',['Un precipitado','Un gas','Un catalizador','Un solvente'],0,'Precipitado.')],
 conc:'Explica con dos ejemplos cómo distingues un cambio químico de uno físico.',lim:'Algunos fenómenos reales muestran varias evidencias a la vez; aquí se pide la principal. Las observaciones son descripciones, no mediciones.'});

/* 45 */
add({n:'Balanceo de ecuaciones químicas',tema:'Reacciones',dif:3,mot:'balanceo',
 obj:'Balancear ecuaciones sencillas por tanteo, igualando el número de átomos de cada elemento a ambos lados.',comp:[C1,C3],
 evid:['Cuenta átomos de cada elemento en reactivos y productos.','Ajusta coeficientes sin cambiar subíndices.','Obtiene los coeficientes enteros más pequeños.'],
 teo:'Una ecuación está <b>balanceada</b> cuando hay el <b>mismo número de átomos de cada elemento</b> en los reactivos y en los productos. Se ajustan los <b>coeficientes</b> (números delante de las fórmulas) y <b>nunca los subíndices</b>, porque cambiarlos cambiaría la sustancia. Se buscan los coeficientes enteros más pequeños. Ejemplo: 2 H₂ + O₂ → 2 H₂O.',
 mat:['8 ecuaciones sencillas','Contador de átomos'],
 proc:[{t:'Cambia coeficientes y observa el conteo.',a:'cambia',n:6},{t:'Balancea 3 ecuaciones.',a:'balancea',n:3},{t:'Balancea todas las ecuaciones.',a:'todo_ok'}],
 cfg:{ecs:[{nombre:'H₂ + O₂ → H₂O',L:['H2','O2'],R:['H2O']},{nombre:'N₂ + H₂ → NH₃',L:['N2','H2'],R:['NH3']},{nombre:'Na + Cl₂ → NaCl',L:['Na','Cl2'],R:['NaCl']},{nombre:'CH₄ + O₂ → CO₂ + H₂O',L:['CH4','O2'],R:['CO2','H2O']},{nombre:'Fe + O₂ → Fe₂O₃',L:['Fe','O2'],R:['Fe2O3']},{nombre:'Al + HCl → AlCl₃ + H₂',L:['Al','HCl'],R:['AlCl3','H2']},{nombre:'C₃H₈ + O₂ → CO₂ + H₂O',L:['C3H8','O2'],R:['CO2','H2O']},{nombre:'KClO₃ → KCl + O₂',L:['KClO3'],R:['KCl','O2']}]},
 ana:['¿Por qué no se pueden cambiar los subíndices al balancear?','¿Qué elemento conviene balancear al final y por qué?'],
 ev:[MC('Balancear significa…',['Igualar átomos de cada elemento a ambos lados','Igualar moléculas','Cambiar subíndices','Quitar productos'],0,'Mismos átomos a cada lado.'),MC('Los coeficientes se ponen…',['Delante de las fórmulas','Como subíndices','Solo en productos','Dentro de la fórmula'],0,'Delante de las fórmulas.'),MC('En 2 H₂ + O₂ → 2 H₂O hay…',['4 átomos de H a cada lado','2 de H a la izquierda','3 de O','Ninguna'],0,'4 H y 2 O a cada lado.')],
 conc:'Explica los pasos que seguiste para balancear una ecuación.',lim:'Balanceo por tanteo con coeficientes de 1 a 9; no incluye métodos de óxido-reducción ni cargas.'});

/* 46 */
add({n:'Conservación de la masa',tema:'Reacciones',dif:3,mot:'balanceo',
 obj:'Comprobar que la masa total de reactivos y productos se conserva cuando la ecuación está balanceada.',comp:[C1,C2,C3],
 evid:['Calcula la masa total de reactivos y productos con masas atómicas relativas.','Explica que la masa se conserva solo si los átomos se conservan.','Relaciona la ley de Lavoisier con el balanceo.'],
 teo:'La <b>ley de conservación de la masa</b> (Lavoisier): en una reacción química la masa total de los reactivos es igual a la masa total de los productos, porque <b>los átomos no se crean ni se destruyen</b>, solo se reordenan. Para comprobarlo se suman las masas atómicas relativas (u) de todos los átomos multiplicadas por los coeficientes. Una ecuación sin balancear <b>no</b> conserva la masa.',
 mat:['Ecuaciones: formación de agua, combustión del metano, del magnesio, descomposición del carbonato de calcio, zinc con HCl','Masas atómicas relativas redondeadas'],
 proc:[{t:'Cambia coeficientes y compara la masa de ambos lados.',a:'cambia',n:6},{t:'Balancea y comprueba la masa en 3 ecuaciones.',a:'compara_masa',n:3},{t:'Completa las 5 ecuaciones.',a:'todo_ok'}],
 cfg:{masa:true,ecs:[{nombre:'H₂ + O₂ → H₂O',L:['H2','O2'],R:['H2O']},{nombre:'CH₄ + O₂ → CO₂ + H₂O',L:['CH4','O2'],R:['CO2','H2O']},{nombre:'Mg + O₂ → MgO',L:['Mg','O2'],R:['MgO']},{nombre:'CaCO₃ → CaO + CO₂',L:['CaCO3'],R:['CaO','CO2']},{nombre:'Zn + HCl → ZnCl₂ + H₂',L:['Zn','HCl'],R:['ZnCl2','H2']}]},
 ana:['¿Qué pasa con la masa total si la ecuación no está balanceada?','¿Cómo explicarías con átomos que la masa se conserva?'],
 ev:[MC('La ley de conservación de la masa dice que…',['La masa de los reactivos es igual a la de los productos','La masa aumenta','La masa desaparece','Solo se conserva en gases'],0,'Lavoisier.'),MC('Los átomos en una reacción…',['Se reordenan','Se destruyen','Se crean','Se vuelven energía'],0,'Solo se reordenan.'),MC('Una ecuación no balanceada…',['No conserva la masa','Siempre conserva la masa','No tiene productos','No es química'],0,'Faltan o sobran átomos.')],
 conc:'Explica con una ecuación balanceada por qué la masa se conserva.',lim:'Se usan masas atómicas relativas redondeadas; en reacciones reales abiertas parte de la masa puede escapar como gas y parecer que se pierde.'});

/* 47 */
add({n:'Reacciones de síntesis y descomposición',tema:'Tipos de reacción',dif:2,mot:'clasif',
 obj:'Clasificar reacciones como de síntesis o de descomposición según el número de reactivos y productos.',comp:[C1,C2],
 evid:['Reconoce que en la síntesis varios reactivos forman un solo producto.','Reconoce que en la descomposición un reactivo forma varios productos.','Clasifica ecuaciones químicas sencillas.'],
 teo:'En una reacción de <b>síntesis</b> (o combinación) dos o más sustancias se unen para formar <b>una sola</b>: A + B → AB. En una reacción de <b>descomposición</b> una sustancia se separa en <b>dos o más</b>: AB → A + B. La descomposición suele necesitar energía (calor, luz o electricidad).',
 mat:['8 reacciones','3 pruebas: ver ecuación, contar sustancias y ver cómo se produce'],
 proc:[{t:'Haz al menos 3 pruebas.',a:'prueba',n:3},{t:'Clasifica 4 reacciones correctamente.',a:'clasifica_ok',n:4},{t:'Clasifica las 8.',a:'todo_ok'}],
 cfg:{tituloItems:'Reacciones',pregunta:'¿Síntesis o descomposición?',
  items:[{k:'a',n:'Formación de agua',e:'💧'},{k:'b',n:'Electrólisis del agua',e:'⚡'},{k:'c',n:'Calcinación de caliza',e:'🪨'},{k:'d',n:'Combustión del magnesio',e:'🔥'},{k:'e',n:'Síntesis del amoníaco',e:'🧪'},{k:'f',n:'Descomposición del KClO₃',e:'🧫'},{k:'g',n:'Sodio + cloro',e:'🧂'},{k:'h',n:'Peróxido de hidrógeno',e:'🧴'}],
  tests:[{k:'ec',n:'Ver la ecuación'},{k:'co',n:'Contar reactivos y productos'},{k:'ex',n:'¿Cómo se produce?'}],
  cats:[{k:'s',n:'Síntesis'},{k:'d',n:'Descomposición'}],
  ans:{a:'s',b:'d',c:'d',d:'s',e:'s',f:'d',g:'s',h:'d'},
  res:{a:{ec:'2 H₂ + O₂ → 2 H₂O',co:'2 reactivos → 1 producto.',ex:'Chispa o llama.'},b:{ec:'2 H₂O → 2 H₂ + O₂',co:'1 reactivo → 2 productos.',ex:'Corriente eléctrica.'},c:{ec:'CaCO₃ → CaO + CO₂',co:'1 reactivo → 2 productos.',ex:'Calor intenso.'},d:{ec:'2 Mg + O₂ → 2 MgO',co:'2 reactivos → 1 producto.',ex:'Se enciende con llama.'},e:{ec:'N₂ + 3 H₂ → 2 NH₃',co:'2 reactivos → 1 producto.',ex:'Presión, temperatura y catalizador.'},f:{ec:'2 KClO₃ → 2 KCl + 3 O₂',co:'1 reactivo → 2 productos.',ex:'Calor.'},g:{ec:'2 Na + Cl₂ → 2 NaCl',co:'2 reactivos → 1 producto.',ex:'Reacción muy exotérmica.'},h:{ec:'2 H₂O₂ → 2 H₂O + O₂',co:'1 reactivo → 2 productos.',ex:'Luz, calor o catalizador.'}},
  why:{a:'Dos sustancias dan una.',b:'Una sustancia da dos.',c:'Una sustancia da dos.',d:'Dos sustancias dan una.',e:'Dos sustancias dan una.',f:'Una sustancia da dos.',g:'Dos sustancias dan una.',h:'Una sustancia da dos.'}},
 ana:['¿Qué tienen en común las reacciones de descomposición?','¿Qué reacción de síntesis ocurre en tu vida diaria?'],
 ev:[MC('A + B → AB es una reacción de…',['Síntesis','Descomposición','Desplazamiento','Neutralización'],0,'Se unen para formar uno.'),MC('AB → A + B es…',['Síntesis','Descomposición','Combustión','Disolución'],1,'Uno se separa en varios.'),MC('Una reacción de descomposición suele requerir…',['Energía','Frío','Silencio','Nada'],0,'Calor, luz o electricidad.')],
 conc:'Explica con una ecuación de cada tipo cómo reconoces síntesis y descomposición.',lim:'Clasificación básica por número de reactivos y productos; hay reacciones que encajan en más de un tipo.'});

/* 48 */
add({n:'Reacciones de desplazamiento',tema:'Tipos de reacción',dif:3,mot:'desplaza',
 obj:'Predecir si un metal desplaza a otro de su sal usando la serie de reactividad y escribir la ecuación balanceada.',comp:[C1,C2,C3],
 evid:['Usa la serie de actividad para predecir reacciones.','Escribe la ecuación de desplazamiento balanceada.','Explica el depósito del metal desplazado.'],
 teo:'En una reacción de <b>desplazamiento simple</b> un elemento más reactivo reemplaza a otro en un compuesto: A + BC → AC + B. Un <b>metal más reactivo</b> desplaza a uno menos reactivo de su sal. La <b>serie de actividad</b> ordena los metales de mayor a menor reactividad; aquí: Mg > Zn > Fe > Cu > Ag. Si el metal sólido es menos reactivo que el de la solución, no hay reacción.',
 mat:['Láminas: Mg, Zn, Fe, Cu, Ag','Soluciones de sus nitratos'],
 proc:[{t:'Haz al menos 5 pruebas.',a:'prueba',n:5},{t:'Encuentra 2 combinaciones con reacción.',a:'reacciona',n:2},{t:'Encuentra 2 combinaciones sin reacción.',a:'noreacciona',n:2},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{metales:['Mg','Zn','Fe','Cu','Ag'],meta:6,retos:[
  {q:'Una lámina de <b>cobre</b> en solución de AgNO₃: ¿qué ocurre?',o:['Se deposita plata y la solución se vuelve azul','No pasa nada','Se desprende hidrógeno','Se forma un sólido blanco'],ok:0,why:'El cobre es más reactivo que la plata: la desplaza.'},
  {q:'Una lámina de <b>plata</b> en solución de Cu(NO₃)₂: ¿qué ocurre?',o:['No hay reacción','Se deposita cobre','La plata se disuelve','Se forma un gas'],ok:0,why:'La plata es menos reactiva que el cobre.'},
  {q:'¿Cuál es el metal más reactivo de esta serie?',o:['Magnesio','Cobre','Plata','Hierro'],ok:0,why:'Mg > Zn > Fe > Cu > Ag.'},
  {q:'El hierro desplaza al cobre de su sal porque…',o:['El hierro es más reactivo','El cobre es más reactivo','Son igual de reactivos','El hierro es un gas'],ok:0,why:'Un metal más reactivo desplaza a otro menos reactivo.'}]},
 ana:['¿Cómo usas la serie de actividad para predecir una reacción?','¿Qué evidencia viste cuando un metal fue desplazado?'],
 ev:[MC('Un metal más reactivo…',['Desplaza a uno menos reactivo de su sal','No reacciona','Se vuelve gas','Es siempre más pesado'],0,'Desplazamiento.'),MC('Zn + CuSO₄ produce…',['ZnSO₄ + Cu','Zn + Cu','ZnCu + SO₄','Nada'],0,'El zinc desplaza al cobre.'),MC('Cu en solución de ZnSO₄…',['Reacciona','No reacciona','Explota','Se vuelve gas'],1,'El cobre es menos reactivo que el zinc.')],
 conc:'Explica con una ecuación cómo funciona un desplazamiento simple.',lim:'Serie reducida de cinco metales a temperatura ambiente; la velocidad real depende de superficie, concentración y temperatura. Se usan cargas habituales (Fe²⁺).'});

/* 49 */
add({n:'Velocidad de reacción introductoria',tema:'Cinética',dif:3,mot:'cinetica',
 obj:'Investigar cómo la concentración, la temperatura, el tamaño de las partículas y un catalizador afectan la rapidez de una reacción, cambiando una sola variable a la vez.',comp:[C2,C3],
 evid:['Cambia una sola variable por corrida (control de variables).','Compara velocidades usando curvas y tablas.','Explica los factores con el modelo de colisiones.'],
 teo:'La <b>velocidad de reacción</b> indica qué tan rápido se consumen los reactivos o se forman los productos. Aumenta con la <b>concentración</b> (más partículas, más choques), la <b>temperatura</b> (choques más fuertes y frecuentes), la <b>superficie de contacto</b> (polvo reacciona más rápido que un trozo) y con un <b>catalizador</b> (acelera sin consumirse). Estos factores cambian <i>cuán rápido</i> se llega al resultado, no la cantidad máxima que puede formarse.',
 mat:['Reacción 1: CaCO₃ + HCl (gas CO₂)','Reacción 2: descomposición del H₂O₂ con catalizador MnO₂'],
 proc:[{t:'Haz al menos 3 corridas.',a:'corre',n:3},{t:'Haz 2 corridas cambiando solo una variable respecto a la anterior.',a:'un_cambio',n:2},{t:'Encuentra una condición que haga la reacción más rápida.',a:'mas_rapida'},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{rxs:[
  {n:'Carbonato de calcio + ácido clorhídrico',eq:'CaCO3 + 2 HCl → CaCl2 + H2O + CO2↑',k0:0.03,vmax:240,conc:{label:'Concentración del ácido (mol/L)',min:0.5,max:3,def:1,st:0.5},sa:1,nota:'Modelo empírico: velocidad proporcional a la concentración y a la superficie, y se duplica aprox. cada 10 °C. Ácido en exceso.'},
  {n:'Descomposición del peróxido de hidrógeno',eq:'2 H2O2 → 2 H2O + O2↑',k0:0.004,vmax:100,conc:{label:'Concentración de H₂O₂ (%)',min:1.5,max:6,def:3,st:0.5},sa:0,cat:'MnO₂',catf:40,nota:'Modelo empírico: el MnO₂ multiplica la velocidad (aprox. ×40) sin consumirse; el gas máximo depende solo de la cantidad de H₂O₂.'}],
  retos:[
  {q:'Al aumentar la temperatura, la velocidad de reacción…',o:['Aumenta','Disminuye','No cambia','Se vuelve cero'],ok:0,why:'Los choques son más frecuentes y más energéticos.'},
  {q:'El polvo de un sólido reacciona más rápido que un trozo porque…',o:['Tiene más superficie expuesta','Tiene más masa','Es menos puro','Tiene menos átomos'],ok:0,why:'Hay más contacto con el reactivo.'},
  {q:'Un catalizador…',o:['Acelera la reacción sin consumirse','Aumenta el gas final','Se gasta del todo','Frena la reacción'],ok:0,why:'Ofrece un camino más rápido.'},
  {q:'Con polvo en vez de trozo, el volumen máximo de gas…',o:['Es el mismo, solo se alcanza antes','Aumenta mucho','Disminuye','Se duplica'],ok:0,why:'La cantidad de reactivo no cambió.'}]},
 ana:['¿Por qué es importante cambiar una sola variable por corrida?','¿Cómo cambia la curva cuando aumentas la temperatura?'],
 ev:[MC('Un catalizador…',['Se consume por completo','Acelera la reacción','Cambia los productos','Enfría la reacción'],1,'Acelera sin consumirse.'),MC('Más concentración suele dar…',['Mayor velocidad','Menor velocidad','Nada','Más masa final'],0,'Más choques.'),MC('El polvo reacciona más rápido por…',['Mayor superficie de contacto','Mayor volumen','Menor temperatura','Color'],0,'Más partículas expuestas.')],
 conc:'Resume qué factor tuvo más efecto en tus corridas y por qué.',lim:'Modelo empírico de regla práctica (duplicación por cada 10 °C, proporcionalidad a la concentración y la superficie); no son leyes de velocidad medidas de una reacción real. Tiempo y volumen en unidades de referencia.'});

window.QUI_G8=L;
})();
