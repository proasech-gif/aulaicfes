/* AULA360 — Catálogo de Química · DÉCIMO (laboratorios 67–83 del inventario oficial). Datos de referencia redondeados; cada laboratorio declara sus límites.
   DBA y estándares: solo se citan cuando están verificados contra el MEN; mientras tanto se marcan «por verificar». */
(function(){
const C1='Uso comprensivo del conocimiento científico',C2='Explicación de fenómenos',C3='Indagación',PV='Por verificar con el documento oficial del MEN antes de citarlo',
 EST='Estándares básicos de competencias en Ciencias Naturales (entorno físico, grupos 10°–11°): enunciado exacto por verificar';
const L=[];let n=0;const add=o=>{n++;o.c='Q10-'+String(n).padStart(3,'0');o.g=10;o.no=66+n;o.dba=PV;o.est=EST;o.area='Química';L.push(o)};
const MC=(q,o,ok,fb)=>({q,o,ok,fb});

/* ---- datos de nomenclatura ---- */
const PRE=['','mono','di','tri','tetra','penta','hexa','hepta'],ROM={1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII'};
const TRAD={'Fe2':'óxido ferroso','Fe3':'óxido férrico','Cu1':'óxido cuproso','Cu2':'óxido cúprico','C4':'anhídrido carbónico','C2':'anhídrido carbonoso','S4':'anhídrido sulfuroso','S6':'anhídrido sulfúrico','N3':'anhídrido nitroso','N5':'anhídrido nítrico','P3':'anhídrido fosforoso','P5':'anhídrido fosfórico','Cl1':'anhídrido hipocloroso','Cl7':'anhídrido perclórico'};
const oxido=(s,ox,nm,multi,g,nota)=>{const a=ox%2===0?1:2,b=ox%2===0?ox/2:ox,f=s+(a>1?a:'')+'O'+(b>1?b:'');
 const nombres=[['Stock','óxido de '+nm+(multi?' ('+ROM[ox]+')':'')],['Sistemática',(b===1?'monóxido':PRE[b]+'óxido')+' de '+(a>1?PRE[a]:'')+nm]];if(TRAD[s+ox])nombres.push(['Tradicional',TRAD[s+ox]]);return{f,g,nombres,nota}};
const OXM='Óxido metálico (básico)',OXN='Óxido no metálico (ácido)';
const OX=[oxido('Na',1,'sodio',0,OXM,'Metal + oxígeno → óxido básico: 4 Na + O₂ → 2 Na₂O.'),oxido('Mg',2,'magnesio',0,OXM,'2 Mg + O₂ → 2 MgO.'),oxido('Ca',2,'calcio',0,OXM,'2 Ca + O₂ → 2 CaO (cal viva).'),oxido('Al',3,'aluminio',0,OXM,'4 Al + 3 O₂ → 2 Al₂O₃.'),oxido('Fe',2,'hierro',1,OXM,'El hierro tiene dos números de oxidación: +2 y +3, por eso se indica en el nombre.'),oxido('Fe',3,'hierro',1,OXM,'Es el principal componente del óxido (herrumbre).'),oxido('Cu',1,'cobre',1,OXM,'El cobre tiene +1 y +2.'),oxido('Cu',2,'cobre',1,OXM,'CuO: sólido negro.'),
 oxido('C',2,'carbono',1,OXN,'Gas tóxico formado en combustiones incompletas.'),oxido('C',4,'carbono',1,OXN,'Gas de efecto invernadero; al disolverse en agua forma H₂CO₃.'),oxido('S',4,'azufre',1,OXN,'Contaminante que contribuye a la lluvia ácida.'),oxido('S',6,'azufre',1,OXN,'Con agua forma ácido sulfúrico.'),oxido('N',3,'nitrógeno',1,OXN,'Óxido ácido del nitrógeno (+3).'),oxido('N',5,'nitrógeno',1,OXN,'Con agua forma ácido nítrico.'),oxido('P',5,'fósforo',1,OXN,'Con agua forma ácido fosfórico.'),oxido('Cl',7,'cloro',1,OXN,'Con agua forma ácido perclórico.')];
const HM='Hidruro metálico',HN='Hidruro no metálico';
const HID=[{f:'NaH',g:HM,nombres:[['Stock','hidruro de sodio'],['Sistemática','monohidruro de sodio']],nota:'Metal + H₂ → hidruro; aquí el hidrógeno tiene número de oxidación −1.'},{f:'LiH',g:HM,nombres:[['Stock','hidruro de litio'],['Sistemática','monohidruro de litio']],nota:'El hidrógeno es −1.'},{f:'CaH2',g:HM,nombres:[['Stock','hidruro de calcio'],['Sistemática','dihidruro de calcio']],nota:'Ca (+2) con dos H (−1).'},{f:'AlH3',g:HM,nombres:[['Stock','hidruro de aluminio'],['Sistemática','trihidruro de aluminio']],nota:'Al (+3) con tres H (−1).'},
 {f:'H2O',g:HN,nombres:[['Nombre común','agua'],['Sistemática','monóxido de dihidrógeno']],nota:'Nombre común aceptado.'},{f:'NH3',g:HN,nombres:[['Nombre común','amoníaco'],['Sistemática','trihidruro de nitrógeno']],nota:'Nombre común aceptado.'},{f:'CH4',g:HN,nombres:[['Nombre común','metano'],['Sistemática','tetrahidruro de carbono']],nota:'Nombre común aceptado.'},{f:'H2S',g:HN,nombres:[['Nombre común','sulfuro de hidrógeno'],['Sistemática','sulfuro de dihidrógeno']],nota:'Disuelto en agua se llama ácido sulfhídrico.'},{f:'HCl',g:HN,nombres:[['Nombre común','cloruro de hidrógeno'],['Sistemática','cloruro de hidrógeno']],nota:'Disuelto en agua se llama ácido clorhídrico.'}];
const AH='Hidrácido (en agua)',AO='Oxácido',SAL='Sal';
const ACI=[{f:'HCl',g:AH,nombres:[['Tradicional','ácido clorhídrico'],['Anión que forma','cloruro']],nota:'Terminación -hídrico → sal -uro.'},{f:'HF',g:AH,nombres:[['Tradicional','ácido fluorhídrico'],['Anión que forma','fluoruro']],nota:'Terminación -hídrico → sal -uro.'},{f:'H2S',g:AH,nombres:[['Tradicional','ácido sulfhídrico'],['Anión que forma','sulfuro']],nota:'Terminación -hídrico → sal -uro.'},
 {f:'HNO3',g:AO,nombres:[['Tradicional','ácido nítrico'],['Anión que forma','nitrato']],nota:'-ico → -ato.'},{f:'HNO2',g:AO,nombres:[['Tradicional','ácido nitroso'],['Anión que forma','nitrito']],nota:'-oso → -ito.'},{f:'H2SO4',g:AO,nombres:[['Tradicional','ácido sulfúrico'],['Anión que forma','sulfato']],nota:'-ico → -ato.'},{f:'H2SO3',g:AO,nombres:[['Tradicional','ácido sulfuroso'],['Anión que forma','sulfito']],nota:'-oso → -ito.'},{f:'H2CO3',g:AO,nombres:[['Tradicional','ácido carbónico'],['Anión que forma','carbonato']],nota:'-ico → -ato.'},{f:'H3PO4',g:AO,nombres:[['Tradicional','ácido fosfórico'],['Anión que forma','fosfato']],nota:'-ico → -ato.'},{f:'HClO',g:AO,nombres:[['Tradicional','ácido hipocloroso'],['Anión que forma','hipoclorito']],nota:'hipo-…-oso → hipo-…-ito.'},{f:'HClO3',g:AO,nombres:[['Tradicional','ácido clórico'],['Anión que forma','clorato']],nota:'-ico → -ato.'},{f:'HClO4',g:AO,nombres:[['Tradicional','ácido perclórico'],['Anión que forma','perclorato']],nota:'per-…-ico → per-…-ato.'}];
const sal=(f,nm,from)=>({f,g:SAL,nombres:[['Stock',nm]],nota:'Se forma con '+from+' (el H del ácido se reemplaza por el metal).'});
const SALS=[sal('NaCl','cloruro de sodio','ácido clorhídrico'),sal('CaCl2','cloruro de calcio','ácido clorhídrico'),sal('KNO3','nitrato de potasio','ácido nítrico'),sal('KNO2','nitrito de potasio','ácido nitroso'),sal('Na2SO4','sulfato de sodio','ácido sulfúrico'),sal('Na2SO3','sulfito de sodio','ácido sulfuroso'),sal('CaCO3','carbonato de calcio','ácido carbónico'),sal('Mg(NO3)2','nitrato de magnesio','ácido nítrico'),sal('Al2(SO4)3','sulfato de aluminio','ácido sulfúrico'),sal('Na3PO4','fosfato de sodio','ácido fosfórico'),sal('KClO3','clorato de potasio','ácido clórico'),sal('NaClO','hipoclorito de sodio','ácido hipocloroso'),sal('CuSO4','sulfato de cobre (II)','ácido sulfúrico'),sal('FeCl3','cloruro de hierro (III)','ácido clorhídrico')];
const HO='Obtenido con agua',HP='Obtenido por precipitación';
const hid=(f,nm,trad,g,nota)=>({f,g,nombres:[['Stock',nm]].concat(trad?[['Tradicional',trad]]:[]),nota});
const HIDR=[hid('NaOH','hidróxido de sodio',0,HO,'2 Na + 2 H₂O → 2 NaOH + H₂ (reacción vigorosa).'),hid('KOH','hidróxido de potasio',0,HO,'2 K + 2 H₂O → 2 KOH + H₂.'),hid('LiOH','hidróxido de litio',0,HO,'2 Li + 2 H₂O → 2 LiOH + H₂.'),hid('Ca(OH)2','hidróxido de calcio',0,HO,'Óxido básico + agua → hidróxido: CaO + H₂O → Ca(OH)₂ (cal apagada).'),hid('Mg(OH)2','hidróxido de magnesio',0,HO,'MgO + H₂O → Mg(OH)₂ (poco soluble; antiácido «leche de magnesia»).'),
 hid('Cu(OH)2','hidróxido de cobre (II)','hidróxido cúprico',HP,'CuSO₄ + 2 NaOH → Cu(OH)₂↓ + Na₂SO₄ (sólido azul).'),hid('Fe(OH)2','hidróxido de hierro (II)','hidróxido ferroso',HP,'FeSO₄ + 2 NaOH → Fe(OH)₂↓ + Na₂SO₄.'),hid('Fe(OH)3','hidróxido de hierro (III)','hidróxido férrico',HP,'FeCl₃ + 3 NaOH → Fe(OH)₃↓ + 3 NaCl (sólido pardo-rojizo).'),hid('Al(OH)3','hidróxido de aluminio',0,HP,'AlCl₃ + 3 NaOH → Al(OH)₃↓ + 3 NaCl.'),hid('Zn(OH)2','hidróxido de zinc',0,HP,'ZnSO₄ + 2 NaOH → Zn(OH)₂↓ + Na₂SO₄.')];
const ix=(arr,f)=>{const i=arr.findIndex(x=>x.f===f);if(i<0)throw new Error('falta '+f);return i};

/* 67 */
add({n:'Configuración electrónica avanzada',tema:'Estructura atómica',dif:3,mot:'config',
 obj:'Escribir la configuración electrónica de elementos hasta Z = 36 aplicando el orden de llenado, la regla de Hund y las excepciones del cromo y el cobre.',comp:[C1,C3],
 evid:['Ubica los electrones en subniveles según el orden de energía.','Dibuja el diagrama de orbitales con la regla de Hund.','Explica las excepciones Cr y Cu.'],
 teo:'Los electrones se distribuyen en <b>subniveles</b> siguiendo el principio de <b>Aufbau</b> (de menor a mayor energía): 1s, 2s, 2p, 3s, 3p, <b>4s, 3d</b>, 4p. Cada subnivel tiene una capacidad: s = 2, p = 6, d = 10. La <b>regla de Hund</b> dice que en orbitales de igual energía los electrones se colocan de a uno antes de aparearse. <b>Excepciones:</b> Cr (4s¹ 3d⁵) y Cu (4s¹ 3d¹⁰), porque un subnivel d medio lleno o lleno es especialmente estable. Los electrones de valencia son los del nivel más externo.',
 mat:['Elementos Z = 1 a 36','Contador de electrones por subnivel'],
 proc:[{t:'Agrega al menos 10 electrones a subniveles.',a:'agrega',n:10},{t:'Construye correctamente 3 configuraciones.',a:'config_ok',n:3},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{retos:[{z:8},{z:17},{z:20},{z:24},{z:26},{z:29},{z:33}]},
 ana:['¿Por qué el 4s se llena antes que el 3d?','¿Por qué el cromo y el cobre son excepciones?'],
 ev:[MC('Capacidad máxima del subnivel d…',['10 electrones','6 electrones','2 electrones','14 electrones'],0,'5 orbitales × 2.'),MC('Según la regla de Hund, los electrones…',['Ocupan orbitales vacíos antes de aparearse','Se aparean primero','Se alejan del núcleo','Se anulan'],0,'Primero de a uno.'),MC('El orden de llenado correcto es…',['1s 2s 2p 3s 3p 4s 3d','1s 2s 3s 2p 3p 3d 4s','1s 2p 2s 3s 3p 3d 4s','2s 1s 2p 3s 3p 3d 4s'],0,'Aufbau.')],
 conc:'Escribe la configuración de un elemento y explica cuántos electrones de valencia tiene.',lim:'Solo elementos hasta Z = 36; no incluye iones ni elementos de periodos posteriores (con más excepciones).'});

/* 68 */
add({n:'Números cuánticos',tema:'Estructura atómica',dif:3,mot:'cuantico',
 obj:'Interpretar los cuatro números cuánticos (n, l, ml, ms) y reconocer conjuntos válidos e inválidos.',comp:[C1,C2],
 evid:['Relaciona n y l con el nivel y el subnivel.','Determina los valores permitidos de ml.','Aplica el principio de exclusión de Pauli.'],
 teo:'Cada electrón se describe con cuatro <b>números cuánticos</b>: <b>n</b> (nivel principal: 1, 2, 3…), <b>l</b> (subnivel: de 0 a n−1; 0 = s, 1 = p, 2 = d, 3 = f), <b>ml</b> (orbital: de −l a +l) y <b>ms</b> (espín: +½ o −½). Un nivel n tiene n subniveles y capacidad 2n² electrones; un subnivel tiene 2l+1 orbitales. <b>Pauli:</b> dos electrones de un átomo no pueden tener los cuatro números iguales.',
 mat:['Deslizadores de n, l, ml y ms','Tabla de subniveles y capacidades'],
 proc:[{t:'Cambia los números cuánticos al menos 5 veces.',a:'cambia',n:5},{t:'Explora 4 subniveles distintos.',a:'subnivel_nuevo',n:4},{t:'Resuelve los retos de validez.',a:'todo_ok'}],
 cfg:{retos:[{q:'(n, l, ml, ms) = (2, 1, 0, +½)',o:['Válido','No válido'],ok:0,why:'l = 1 es 2p y ml = 0 está permitido (−1, 0, +1).'},{q:'(n, l, ml, ms) = (2, 2, 0, +½)',o:['Válido','No válido'],ok:1,why:'l debe ser menor que n (máximo n − 1 = 1).'},{q:'(n, l, ml, ms) = (3, 1, −2, −½)',o:['Válido','No válido'],ok:1,why:'Para l = 1, ml solo puede ser −1, 0 o +1.'},{q:'(n, l, ml, ms) = (1, 0, 0, −½)',o:['Válido','No válido'],ok:0,why:'Es un electrón 1s con espín −½.'},{q:'(n, l, ml, ms) = (3, 2, 2, +½)',o:['Válido','No válido'],ok:0,why:'3d: ml puede ser −2 … +2.'},{q:'(n, l, ml, ms) = (2, 0, 1, +½)',o:['Válido','No válido'],ok:1,why:'Para l = 0 solo existe ml = 0.'},{q:'¿Cuántos electrones caben como máximo en el subnivel 3d?',o:['10','6','2','14'],ok:0,why:'5 orbitales × 2 electrones.'}]},
 ana:['¿Por qué no puede existir un subnivel 2d?','¿Cuántos electrones caben en el nivel n = 3 y cómo lo calculas?'],
 ev:[MC('Para n = 3, los valores posibles de l son…',['0, 1 y 2','1, 2 y 3','0 y 3','Solo 3'],0,'De 0 a n−1.'),MC('El número cuántico ms vale…',['+½ o −½','0, 1 o 2','Cualquier valor','Solo 1'],0,'Espín.'),MC('El nivel n = 2 admite como máximo…',['8 electrones','2 electrones','18 electrones','6 electrones'],0,'2n² = 8.')],
 conc:'Explica qué describe cada número cuántico con un ejemplo.',lim:'Modelo cuántico simplificado de átomos con un electrón de referencia; no calcula energías.'});

/* 69 */
add({n:'Orbitales atómicos',tema:'Estructura atómica',dif:3,mot:'orbital',
 obj:'Reconocer las formas de los orbitales s, p y d y relacionarlas con los números cuánticos y los nodos.',comp:[C1,C2],
 evid:['Describe la forma de los orbitales s, p y d.','Relaciona l con el número de nodos angulares.','Calcula los nodos radiales (n − l − 1).'],
 teo:'Un <b>orbital</b> es la región del espacio donde es más probable encontrar un electrón. El orbital <b>s</b> es esférico; los orbitales <b>p</b> tienen dos lóbulos (3 orientaciones: px, py, pz); los <b>d</b> tienen cuatro lóbulos (excepto dz², con dos lóbulos y un anillo). Los colores indican el signo de la función de onda. <b>Nodos:</b> angulares = l, radiales = n − l − 1, totales = n − 1.',
 mat:['8 orbitales: 1s, 2s, 2p, 3d','Dibujo esquemático'],
 proc:[{t:'Observa al menos 5 orbitales distintos.',a:'ver',n:5},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{retos:[{q:'El orbital s tiene forma…',o:['Esférica','De dos lóbulos','De cuatro lóbulos','Triangular'],ok:0,why:'Simetría esférica.'},{q:'¿Cuántos orbitales p hay en un subnivel p?',o:['3','1','5','7'],ok:0,why:'2l+1 con l = 1.'},{q:'¿Cuántos nodos radiales tiene el orbital 2s?',o:['1','0','2','3'],ok:0,why:'n − l − 1 = 2 − 0 − 1 = 1.'},{q:'El orbital dxy tiene…',o:['Cuatro lóbulos','Dos lóbulos','Un lóbulo','Forma esférica'],ok:0,why:'Los orbitales d típicos tienen cuatro lóbulos.'},{q:'¿Cuántos nodos totales tiene un orbital con n = 3?',o:['2','3','1','0'],ok:0,why:'Nodos totales = n − 1.'}]},
 ana:['¿Qué significa que un orbital sea una «región de probabilidad»?','¿Qué diferencia hay entre un orbital 1s y uno 2s?'],
 ev:[MC('Un orbital es…',['Una región donde es probable hallar un electrón','Una órbita circular exacta','El núcleo','Un neutrón'],0,'Región de probabilidad.'),MC('Los orbitales p son…',['Tres, con dos lóbulos cada uno','Uno solo, esférico','Cinco','Siete'],0,'px, py y pz.'),MC('Los nodos son…',['Zonas con probabilidad cero de hallar el electrón','Zonas de máxima probabilidad','Protones','Electrones'],0,'Probabilidad nula.')],
 conc:'Describe la forma de un orbital s, uno p y uno d.',lim:'Dibujos esquemáticos en corte 2D, no cálculos de densidad electrónica.'});

/* 70 */
add({n:'Propiedades periódicas avanzadas',tema:'Tabla periódica',dif:3,mot:'propiedad',
 obj:'Analizar las tendencias del radio atómico, la energía de ionización y la electronegatividad y explicar sus excepciones.',comp:[C1,C2,C3],
 evid:['Describe cómo varían las propiedades en un periodo y en un grupo.','Compara dos elementos con datos.','Explica anomalías como B < Be o O < N en energía de ionización.'],
 teo:'Las propiedades periódicas varían de forma regular. <b>Radio atómico:</b> disminuye en un periodo (de izquierda a derecha, aumenta la carga nuclear efectiva) y aumenta en un grupo hacia abajo (más niveles). <b>Energía de ionización</b> (energía para quitar el primer electrón): aumenta en un periodo y disminuye en un grupo. <b>Electronegatividad:</b> aumenta hacia la derecha y hacia arriba. Hay excepciones: la energía de ionización del B es menor que la del Be (el electrón 2p está más lejos y es menos retenido) y la del O es menor que la del N (repulsión en el orbital con electrones apareados).',
 mat:['Datos de Z = 1 a 36','Gráficas de radio, energía de ionización y electronegatividad'],
 proc:[{t:'Revisa las tres propiedades.',a:'cambia',n:3},{t:'Compara 3 pares de elementos.',a:'compara',n:3},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{retos:[{q:'En un periodo, de izquierda a derecha, el radio atómico…',o:['Disminuye','Aumenta','No cambia','Se duplica'],ok:0,why:'La carga nuclear efectiva atrae más fuerte a los electrones.'},{q:'En un grupo, de arriba hacia abajo, el radio atómico…',o:['Aumenta','Disminuye','No cambia','Es cero'],ok:0,why:'Se agregan niveles de energía.'},{q:'¿Qué elemento tiene mayor energía de ionización?',o:['Helio','Sodio','Potasio','Cesio'],ok:0,why:'Es pequeño, con capa llena y muy atraído por el núcleo.'},{q:'La energía de ionización del boro es menor que la del berilio porque…',o:['El electrón 2p está más lejos y menos retenido que un 2s','El boro es más grande','El boro es un gas','Tiene más neutrones'],ok:0,why:'Un electrón 2p es más fácil de quitar que uno 2s.'},{q:'¿Cuál es el elemento más electronegativo (entre estos)?',o:['Flúor','Cloro','Oxígeno','Sodio'],ok:0,why:'El flúor tiene la mayor electronegatividad de la tabla.'}]},
 ana:['¿Por qué el sodio tiene menor energía de ionización que el cloro?','¿Qué elementos rompen la tendencia y por qué?'],
 ev:[MC('La energía de ionización es la energía para…',['Quitar un electrón a un átomo','Añadir un protón','Romper un enlace iónico','Fundir un metal'],0,'Primer electrón.'),MC('La electronegatividad aumenta…',['Hacia la derecha y hacia arriba','Hacia la izquierda y abajo','Solo hacia abajo','No varía'],0,'Hacia el flúor.'),MC('Un átomo con mayor radio suele tener…',['Menor energía de ionización','Mayor energía de ionización','Igual','Más protones siempre'],0,'Electrón externo más lejos.')],
 conc:'Explica una tendencia periódica con dos elementos como ejemplo.',lim:'Radios atómicos empíricos aproximados; energías de ionización de referencia redondeadas; electronegatividad de Pauling. Sin datos para gases nobles en radio y electronegatividad.'});

/* 71 */
add({n:'Estructuras de Lewis',tema:'Enlace químico',dif:3,mot:'lewis',
 obj:'Construir estructuras de Lewis de moléculas sencillas contando electrones de valencia y completando octetos.',comp:[C1,C3],
 evid:['Cuenta los electrones de valencia de una molécula.','Ubica enlaces y pares libres.','Reconoce enlaces dobles y triples y octetos incompletos.'],
 teo:'Una <b>estructura de Lewis</b> muestra los electrones de valencia como enlaces (líneas) y pares libres (puntos). Pasos: <b>1)</b> suma los electrones de valencia de todos los átomos; <b>2)</b> arma el esqueleto con el átomo menos electronegativo al centro (nunca el H); <b>3)</b> coloca un enlace sencillo entre átomos; <b>4)</b> completa los octetos (dueto en H) con pares libres; <b>5)</b> si faltan electrones en el central, forma enlaces dobles o triples. Excepciones: octeto incompleto (B en BF₃).',
 mat:['Moléculas: H₂O, CO₂, NH₃, CH₄, HCl, O₂, N₂, BF₃, HCN','Dibujo paso a paso'],
 proc:[{t:'Avanza 10 pasos en total.',a:'paso',n:10},{t:'Mira 3 moléculas distintas.',a:'molecula',n:3},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{mols:['H2O','CO2','NH3','CH4','HCl','O2','N2','BF3','HCN'],retos:[{t:'ve',f:'H2O'},{t:'ve',f:'CO2'},{t:'ve',f:'HCN'},{t:'lp',f:'NH3',at:0},{t:'lp',f:'H2O',at:0},{t:'bo',f:'O2',i1:0,i2:1,o:2},{t:'bo',f:'N2',i1:0,i2:1,o:3},{t:'ve',f:'BF3'}]},
 ana:['¿Por qué el N₂ tiene un enlace triple?','¿Por qué el BF₃ es una excepción a la regla del octeto?'],
 ev:[MC('Los electrones de valencia del oxígeno son…',['6','8','2','4'],0,'Grupo 16.'),MC('El enlace triple comparte…',['Tres pares de electrones','Un par','Dos pares','Cuatro pares'],0,'Seis electrones.'),MC('Una estructura de Lewis válida usa…',['Todos los electrones de valencia','Solo los del central','La mitad','Ninguno'],0,'Se verifica el conteo.')],
 conc:'Dibuja y explica la estructura de Lewis de una molécula que elijas.',lim:'Moléculas sin resonancia ni cargas formales. El dibujo es esquemático y no representa ángulos reales.'});

/* 72 */
add({n:'Geometría molecular avanzada',tema:'Enlace químico',dif:3,mot:'geom',
 obj:'Predecir la geometría de moléculas con 2 a 6 dominios de electrones, incluyendo pares libres.',comp:[C1,C2],
 evid:['Cuenta dominios totales y pares libres.','Nombra la geometría molecular.','Diferencia geometría electrónica y molecular.'],
 teo:'Según la teoría <b>RPECV</b> los dominios de electrones alrededor del átomo central se repelen y se ubican lo más lejos posible: 2 dominios <b>lineal</b>; 3 <b>trigonal plana</b>; 4 <b>tetraédrica</b>; 5 <b>bipirámide trigonal</b>; 6 <b>octaédrica</b>. Los <b>pares libres</b> ocupan lugar pero no se ven en la forma de la molécula: 4 dominios con 1 par libre → piramidal; con 2 → angular; 5 con 1 → balancín; con 2 → forma de T; con 3 → lineal; 6 con 1 → pirámide de base cuadrada; con 2 → plana cuadrada.',
 mat:['Contadores de pares enlazantes y libres','Modelo 3D giratorio'],
 proc:[{t:'Cambia los pares al menos 6 veces.',a:'cambia',n:6},{t:'Encuentra 6 geometrías distintas.',a:'geom_nueva',n:6},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{retos:[{q:'<b>PCl₅</b>: ¿pares enlazantes y libres del P?',bp:5,lp:0,why:'5 dominios sin pares libres: bipirámide trigonal.'},{q:'<b>SF₄</b>: ¿pares del S?',bp:4,lp:1,why:'5 dominios con 1 par libre: balancín.'},{q:'<b>ClF₃</b>: ¿pares del Cl?',bp:3,lp:2,why:'5 dominios con 2 pares libres: forma de T.'},{q:'<b>XeF₂</b>: ¿pares del Xe?',bp:2,lp:3,why:'5 dominios con 3 pares libres: lineal.'},{q:'<b>SF₆</b>: ¿pares del S?',bp:6,lp:0,why:'6 dominios: octaédrica.'},{q:'<b>XeF₄</b>: ¿pares del Xe?',bp:4,lp:2,why:'6 dominios con 2 pares libres: plana cuadrada.'},{q:'<b>BrF₅</b>: ¿pares del Br?',bp:5,lp:1,why:'6 dominios con 1 par libre: pirámide de base cuadrada.'}]},
 ana:['¿Por qué el XeF₂ es lineal aunque tiene tres pares libres?','¿Cómo cambia la geometría del SF₄ respecto a la del SF₆?'],
 ev:[MC('Cuatro dominios con un par libre dan una geometría…',['Piramidal trigonal','Tetraédrica','Lineal','Plana'],0,'Como el NH₃.'),MC('Seis dominios sin pares libres son…',['Octaédricos','Tetraédricos','Lineales','Planos'],0,'SF₆.'),MC('Los pares libres…',['Ocupan espacio y repelen más','No ocupan espacio','Son protones','Se ven como átomos'],0,'Repelen más que los enlazantes.')],
 conc:'Elige una molécula y explica cómo predices su forma.',lim:'Modelo cualitativo; los ángulos son valores de referencia y las posiciones de los pares libres siguen la regla usual de menor repulsión.'});

/* 73 */
add({n:'Hibridación de orbitales',tema:'Enlace químico',dif:3,mot:'clasif',
 obj:'Determinar la hibridación del átomo central a partir del número de dominios de electrones y la geometría.',comp:[C1,C2],
 evid:['Relaciona dominios de electrones con la hibridación.','Asocia sp, sp² y sp³ con geometrías.','Aplica el criterio a moléculas comunes.'],
 teo:'La <b>hibridación</b> combina orbitales atómicos del mismo átomo para formar orbitales híbridos equivalentes que explican la geometría. <b>2 dominios → sp</b> (lineal, 180°); <b>3 dominios → sp²</b> (trigonal plana, 120°); <b>4 dominios → sp³</b> (tetraédrica, 109,5°). Los dominios cuentan enlaces (sencillos, dobles o triples cuentan como uno) y pares libres. Ejemplos: CH₄ sp³, C₂H₄ sp² y C₂H₂ sp.',
 mat:['8 moléculas','3 pruebas: dominios, geometría y ángulo'],
 proc:[{t:'Haz al menos 4 pruebas.',a:'prueba',n:4},{t:'Clasifica 4 átomos correctamente.',a:'clasifica_ok',n:4},{t:'Clasifica los 8.',a:'todo_ok'}],
 cfg:{tituloItems:'Átomos centrales',pregunta:'¿Qué hibridación tiene?',
  items:[{k:'a',n:'C en CH₄',e:'🔥'},{k:'b',n:'C en C₂H₄',e:'🧪'},{k:'c',n:'C en C₂H₂',e:'🔦'},{k:'d',n:'B en BF₃',e:'🔷'},{k:'e',n:'N en NH₃',e:'💨'},{k:'f',n:'O en H₂O',e:'💧'},{k:'g',n:'C en CO₂',e:'🫧'},{k:'h',n:'Be en BeCl₂',e:'⚪'}],
  tests:[{k:'do',n:'Contar dominios de electrones'},{k:'ge',n:'Geometría'},{k:'an',n:'Ángulo'}],
  cats:[{k:'sp',n:'sp'},{k:'sp2',n:'sp²'},{k:'sp3',n:'sp³'}],
  ans:{a:'sp3',b:'sp2',c:'sp',d:'sp2',e:'sp3',f:'sp3',g:'sp',h:'sp'},
  res:{a:{do:'4 dominios (4 enlaces).',ge:'Tetraédrica.',an:'109,5°.'},b:{do:'3 dominios (2 enlaces C–H y un enlace doble C=C).',ge:'Trigonal plana.',an:'≈ 120°.'},c:{do:'2 dominios (un enlace C–H y un enlace triple).',ge:'Lineal.',an:'180°.'},d:{do:'3 dominios (3 enlaces).',ge:'Trigonal plana.',an:'120°.'},e:{do:'4 dominios (3 enlaces y 1 par libre).',ge:'Piramidal trigonal (geometría electrónica tetraédrica).',an:'≈ 107°.'},f:{do:'4 dominios (2 enlaces y 2 pares libres).',ge:'Angular (geometría electrónica tetraédrica).',an:'104,5°.'},g:{do:'2 dominios (dos enlaces dobles).',ge:'Lineal.',an:'180°.'},h:{do:'2 dominios (2 enlaces).',ge:'Lineal.',an:'180°.'}},
  why:{a:'4 dominios → sp³.',b:'3 dominios → sp².',c:'2 dominios → sp.',d:'3 dominios → sp².',e:'4 dominios (con el par libre) → sp³.',f:'4 dominios (con 2 pares libres) → sp³.',g:'2 dominios → sp.',h:'2 dominios → sp.'}},
 ana:['¿Por qué el N del NH₃ es sp³ aunque la molécula sea piramidal?','¿Qué cambia en el carbono cuando pasa de enlace sencillo a doble y a triple?'],
 ev:[MC('Un átomo con 3 dominios de electrones tiene hibridación…',['sp²','sp','sp³','sp⁴'],0,'Trigonal plana.'),MC('La geometría del carbono sp es…',['Lineal','Tetraédrica','Plana triangular','Angular'],0,'180°.'),MC('En la hibridación se combinan…',['Orbitales atómicos del mismo átomo','Protones','Moléculas','Núcleos'],0,'Para formar orbitales híbridos.')],
 conc:'Explica cómo determinas la hibridación con un ejemplo.',lim:'Modelo de hibridación sp, sp² y sp³ para el átomo central. No incluye hibridaciones con orbitales d (sp³d, sp³d²).'});

/* 74 */
add({n:'Fuerzas intermoleculares y propiedades',tema:'Moléculas',dif:3,mot:'clasif',
 obj:'Identificar la fuerza intermolecular dominante de una sustancia y relacionarla con su punto de ebullición.',comp:[C1,C2],
 evid:['Reconoce polaridad y presencia de H unido a N, O o F.','Clasifica la fuerza dominante.','Relaciona la intensidad con el punto de ebullición.'],
 teo:'Las <b>fuerzas de London</b> existen en todas las moléculas y dominan en las apolares (aumentan con la masa y el tamaño). En moléculas polares aparecen además las fuerzas <b>dipolo–dipolo</b>. Si hay H unido a N, O o F, se forman <b>puentes de hidrógeno</b>, las más fuertes. A mayor intensidad de las fuerzas, mayor punto de ebullición (a masas comparables).',
 mat:['8 sustancias','3 pruebas: polaridad, punto de ebullición y presencia de H–N/O/F'],
 proc:[{t:'Haz al menos 4 pruebas.',a:'prueba',n:4},{t:'Clasifica 4 sustancias correctamente.',a:'clasifica_ok',n:4},{t:'Clasifica las 8.',a:'todo_ok'}],
 cfg:{tituloItems:'Sustancias',pregunta:'¿Cuál es la fuerza intermolecular dominante?',
  items:[{k:'a',n:'Metano (CH₄)',e:'🔥'},{k:'b',n:'Cloruro de hidrógeno (HCl)',e:'🧪'},{k:'c',n:'Agua (H₂O)',e:'💧'},{k:'d',n:'Amoníaco (NH₃)',e:'💨'},{k:'e',n:'Dióxido de carbono (CO₂)',e:'🫧'},{k:'f',n:'Metanol (CH₃OH)',e:'🍶'},{k:'g',n:'Clorometano (CH₃Cl)',e:'🧴'},{k:'h',n:'Yodo (I₂)',e:'🟣'}],
  tests:[{k:'po',n:'Polaridad de la molécula'},{k:'eb',n:'Punto de ebullición'},{k:'hn',n:'¿H unido a N, O o F?'}],
  cats:[{k:'l',n:'London (dispersión)'},{k:'d',n:'Dipolo–dipolo'},{k:'h',n:'Puentes de hidrógeno'}],
  ans:{a:'l',b:'d',c:'h',d:'h',e:'l',f:'h',g:'d',h:'l'},
  res:{a:{po:'Apolar.',eb:'−162 °C.',hn:'No.'},b:{po:'Polar.',eb:'−85 °C.',hn:'No (el H está unido a Cl).'},c:{po:'Polar.',eb:'100 °C.',hn:'Sí (O–H).'},d:{po:'Polar.',eb:'−33 °C.',hn:'Sí (N–H).'},e:{po:'Apolar (molécula lineal simétrica).',eb:'Sublima a −78 °C.',hn:'No.'},f:{po:'Polar.',eb:'65 °C.',hn:'Sí (O–H).'},g:{po:'Polar.',eb:'−24 °C.',hn:'No.'},h:{po:'Apolar.',eb:'184 °C (molécula grande y muy polarizable).',hn:'No.'}},
  why:{a:'Apolar: solo London.',b:'Polar sin H–N/O/F: dipolo–dipolo.',c:'O–H: puentes de hidrógeno.',d:'N–H: puentes de hidrógeno.',e:'Apolar: solo London.',f:'O–H: puentes de hidrógeno.',g:'Polar sin H–N/O/F: dipolo–dipolo.',h:'Apolar: London (intensas por su tamaño).'}},
 ana:['¿Por qué el yodo, aunque es apolar, hierve a una temperatura alta?','¿Qué diferencia hay entre una fuerza intermolecular y un enlace covalente?'],
 ev:[MC('Los puentes de hidrógeno requieren H unido a…',['N, O o F','C o S','Na','Ninguno'],0,'Átomos muy electronegativos y pequeños.'),MC('En moléculas apolares predominan las fuerzas de…',['London','Puentes de hidrógeno','Enlace metálico','Enlace iónico'],0,'Dispersión.'),MC('A mayor fuerza intermolecular, el punto de ebullición…',['Aumenta','Disminuye','No cambia','Es cero'],0,'Se necesita más energía para separar las moléculas.')],
 conc:'Explica con un ejemplo cómo la fuerza intermolecular determina el punto de ebullición.',lim:'Clasificación de la fuerza dominante; todas las sustancias presentan además fuerzas de London. Puntos de ebullición a 1 atm, redondeados.'});

/* 75 */
add({n:'Nomenclatura de óxidos e hidruros',tema:'Nomenclatura inorgánica',dif:3,mot:'nombra',
 obj:'Nombrar y formular óxidos e hidruros usando las nomenclaturas Stock, sistemática y tradicional.',comp:[C1,C2],
 evid:['Distingue óxidos metálicos y no metálicos.','Usa prefijos y números romanos.','Nombra hidruros metálicos y no metálicos.'],
 teo:'Un <b>óxido</b> es un compuesto de oxígeno (−2) con otro elemento. <b>Sistemática:</b> prefijos (mono, di, tri…): trióxido de dihierro. <b>Stock:</b> número romano de la carga del elemento: óxido de hierro (III). <b>Tradicional:</b> óxido ferroso/férrico (metales) y anhídrido (no metales). Los óxidos metálicos son <b>básicos</b> y los no metálicos <b>ácidos</b>. Un <b>hidruro</b> es un compuesto con hidrógeno: en los metálicos el H es −1 (hidruro de sodio); los no metálicos tienen nombres comunes (agua, amoníaco, metano).',
 mat:['16 óxidos y 9 hidruros','Tres sistemas de nombres'],
 proc:[{t:'Revisa al menos 6 compuestos.',a:'ver',n:6},{t:'Acierta 4 retos.',a:'reto_ok',n:4},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{items:OX.concat(HID),retos:[{t:'f2n',i:ix(OX,'Fe2O3'),s:'Stock'},{t:'f2n',i:ix(OX,'CO2'),s:'Sistemática'},{t:'f2n',i:ix(OX,'SO3'),s:'Tradicional'},{t:'n2f',i:ix(OX,'Cu2O'),s:'Sistemática'},{t:'n2f',i:ix(OX,'Cl2O7'),s:'Sistemática'},{t:'f2n',i:OX.length+ix(HID,'NH3'),s:'Nombre común'},{t:'n2f',i:OX.length+ix(HID,'CaH2'),s:'Stock'},{t:'f2n',i:ix(OX,'Al2O3'),s:'Sistemática'}]},
 ana:['¿Qué diferencia hay entre un óxido básico y un óxido ácido?','¿Por qué el hidrógeno tiene número de oxidación −1 en los hidruros metálicos?'],
 ev:[MC('Un óxido contiene oxígeno con número de oxidación…',['−2','+2','0','−1 siempre'],0,'Normalmente −2.'),MC('El Fe₂O₃ en nomenclatura Stock es…',['Óxido de hierro (III)','Óxido de hierro (II)','Dióxido de hierro','Hierro oxidado'],0,'Fe³⁺.'),MC('Los óxidos no metálicos suelen ser…',['Ácidos','Básicos','Neutros siempre','Metales'],0,'Forman ácidos con el agua.')],
 conc:'Nombra un óxido y un hidruro en dos sistemas.',lim:'Selección de compuestos comunes; el sistema tradicional se muestra solo cuando se usa en la enseñanza escolar.'});

/* 76 */
add({n:'Nomenclatura de ácidos y sales',tema:'Nomenclatura inorgánica',dif:3,mot:'nombra',
 obj:'Nombrar hidrácidos, oxácidos y sales, y relacionar el nombre del ácido con el de su anión.',comp:[C1,C2],
 evid:['Nombra ácidos terminados en -hídrico, -ico y -oso.','Deduce el nombre de la sal a partir del ácido.','Escribe la fórmula de sales comunes.'],
 teo:'Los <b>hidrácidos</b> (H + no metal, en agua) terminan en <b>-hídrico</b>: ácido clorhídrico (HCl). Los <b>oxácidos</b> contienen oxígeno: <b>-ico</b> (mayor número de oxidación) y <b>-oso</b> (menor): ácido sulfúrico (H₂SO₄) y sulfuroso (H₂SO₃); con cloro: hipo-…-oso, -oso, -ico, per-…-ico. Una <b>sal</b> sale de reemplazar el H del ácido por un metal: <b>-hídrico → -uro</b>, <b>-ico → -ato</b>, <b>-oso → -ito</b>. Ejemplo: ácido nítrico → nitrato de potasio (KNO₃).',
 mat:['3 hidrácidos, 9 oxácidos y 14 sales','Regla de terminaciones'],
 proc:[{t:'Revisa al menos 6 compuestos.',a:'ver',n:6},{t:'Acierta 4 retos.',a:'reto_ok',n:4},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{items:ACI.concat(SALS),retos:[{t:'f2n',i:ix(ACI,'HNO3')},{t:'f2n',i:ix(ACI,'H2SO3')},{t:'n2f',i:ix(ACI,'H3PO4')},{t:'n2f',i:ix(ACI,'HClO4')},{t:'f2n',i:ACI.length+ix(SALS,'Na2SO4')},{t:'f2n',i:ACI.length+ix(SALS,'Mg(NO3)2')},{t:'n2f',i:ACI.length+ix(SALS,'Al2(SO4)3')},{t:'n2f',i:ACI.length+ix(SALS,'CaCO3')}]},
 ana:['¿Cómo cambia la terminación del nombre al pasar de ácido a sal?','¿Qué diferencia hay entre H₂SO₃ y H₂SO₄ en el nombre?'],
 ev:[MC('Un ácido terminado en -ico forma sales terminadas en…',['-ato','-ito','-uro','-ido'],0,'-ico → -ato.'),MC('El HCl disuelto en agua es…',['Ácido clorhídrico','Ácido clórico','Cloruro de sodio','Cloro'],0,'Hidrácido.'),MC('KNO₃ se llama…',['Nitrato de potasio','Nitrito de potasio','Nitruro de potasio','Potasio nítrico'],0,'Del ácido nítrico.')],
 conc:'Explica cómo pasas del nombre de un ácido al de su sal con un ejemplo.',lim:'Selección de compuestos comunes con el sistema tradicional/Stock usado en la escuela; no incluye ácidos orgánicos ni sales ácidas.'});

/* 77 */
add({n:'Formación de hidróxidos',tema:'Nomenclatura inorgánica',dif:3,mot:'nombra',
 obj:'Reconocer cómo se forman los hidróxidos (óxido básico + agua o precipitación) y nombrarlos.',comp:[C1,C2],
 evid:['Escribe la reacción de formación de un hidróxido.','Reconoce el grupo OH⁻ y su carga.','Nombra hidróxidos de metales con una o varias cargas.'],
 teo:'Un <b>hidróxido</b> contiene el ion hidróxido (OH⁻). Se forma cuando un <b>óxido básico reacciona con agua</b> (CaO + H₂O → Ca(OH)₂) o cuando un metal muy reactivo reacciona con el agua (2 Na + 2 H₂O → 2 NaOH + H₂). Otros se obtienen por <b>precipitación</b> al mezclar una sal del metal con una base (CuSO₄ + 2 NaOH → Cu(OH)₂↓ + Na₂SO₄). Se nombran «hidróxido de» + metal (con número romano si tiene varias cargas). Las soluciones de hidróxidos son básicas (pH &gt; 7).',
 mat:['10 hidróxidos','Ecuaciones de formación'],
 proc:[{t:'Revisa al menos 6 hidróxidos.',a:'ver',n:6},{t:'Acierta 4 retos.',a:'reto_ok',n:4},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{items:HIDR,retos:[{t:'f2n',i:ix(HIDR,'Ca(OH)2')},{t:'n2f',i:ix(HIDR,'Fe(OH)3')},{t:'f2n',i:ix(HIDR,'Cu(OH)2')},{t:'n2f',i:ix(HIDR,'NaOH')},{t:'f2n',i:ix(HIDR,'Fe(OH)3'),s:'Tradicional'},{t:'n2f',i:ix(HIDR,'Al(OH)3')}]},
 ana:['¿Por qué los paréntesis en Ca(OH)₂?','¿En qué se diferencian los hidróxidos obtenidos con agua de los obtenidos por precipitación?'],
 ev:[MC('Un óxido básico + agua forma…',['Un hidróxido','Un ácido','Una sal','Un hidruro'],0,'CaO + H₂O → Ca(OH)₂.'),MC('El ion hidróxido es…',['OH⁻','H⁺','O²⁻','H₂O'],0,'Carga −1.'),MC('Una solución de NaOH tiene…',['pH mayor que 7','pH menor que 7','pH igual a 0','No tiene pH'],0,'Es una base.')],
 conc:'Escribe la formación de un hidróxido y nómbralo.',lim:'Selección de hidróxidos comunes. Algunos (Mg, Al, Fe, Cu, Zn) son poco solubles. Las ecuaciones muestran los reactivos más usados en el laboratorio.'});

/* 78 */
const RX_=[{n:'Zn + CuSO₄',eq:'Zn + CuSO4 → ZnSO4 + Cu',R:[['Zn',{Zn:0}],['CuSO4',{Cu:2,S:6,O:-2}]],P:[['ZnSO4',{Zn:2,S:6,O:-2}],['Cu',{Cu:0}]]},
 {n:'Mg + O₂',eq:'2 Mg + O2 → 2 MgO',R:[['Mg',{Mg:0}],['O2',{O:0}]],P:[['MgO',{Mg:2,O:-2}]]},
 {n:'Fe + CuSO₄',eq:'Fe + CuSO4 → FeSO4 + Cu',R:[['Fe',{Fe:0}],['CuSO4',{Cu:2,S:6,O:-2}]],P:[['FeSO4',{Fe:2,S:6,O:-2}],['Cu',{Cu:0}]]},
 {n:'Cu + AgNO₃',eq:'Cu + 2 AgNO3 → Cu(NO3)2 + 2 Ag',R:[['Cu',{Cu:0}],['AgNO3',{Ag:1,N:5,O:-2}]],P:[['Cu(NO3)2',{Cu:2,N:5,O:-2}],['Ag',{Ag:0}]]},
 {n:'H₂ + Cl₂',eq:'H2 + Cl2 → 2 HCl',R:[['H2',{H:0}],['Cl2',{Cl:0}]],P:[['HCl',{H:1,Cl:-1}]]},
 {n:'Zn + HCl',eq:'Zn + 2 HCl → ZnCl2 + H2',R:[['Zn',{Zn:0}],['HCl',{H:1,Cl:-1}]],P:[['ZnCl2',{Zn:2,Cl:-1}],['H2',{H:0}]]},
 {n:'CH₄ + O₂ (combustión)',eq:'CH4 + 2 O2 → CO2 + 2 H2O',R:[['CH4',{C:-4,H:1}],['O2',{O:0}]],P:[['CO2',{C:4,O:-2}],['H2O',{H:1,O:-2}]]},
 {n:'Fe₂O₃ + CO',eq:'Fe2O3 + 3 CO → 2 Fe + 3 CO2',R:[['Fe2O3',{Fe:3,O:-2}],['CO',{C:2,O:-2}]],P:[['Fe',{Fe:0}],['CO2',{C:4,O:-2}]]},
 {n:'HCl + NaOH (neutralización)',eq:'HCl + NaOH → NaCl + H2O',R:[['HCl',{H:1,Cl:-1}],['NaOH',{Na:1,O:-2,H:1}]],P:[['NaCl',{Na:1,Cl:-1}],['H2O',{H:1,O:-2}]]}];
add({n:'Reacciones de oxidación-reducción',tema:'Reacciones redox',dif:3,mot:'redox',
 obj:'Identificar reacciones redox mediante los cambios en los números de oxidación e indicar qué sustancia se oxida, cuál se reduce, y los agentes oxidante y reductor.',comp:[C1,C2],
 evid:['Asigna números de oxidación.','Reconoce que una reacción redox tiene transferencia de electrones.','Identifica agente oxidante y reductor.'],
 teo:'En una reacción <b>redox</b> hay transferencia de electrones. El elemento que <b>se oxida</b> pierde electrones: su número de oxidación <b>aumenta</b>. El que <b>se reduce</b> gana electrones: su número <b>disminuye</b>. El <b>agente reductor</b> es la sustancia que se oxida (hace que otra se reduzca) y el <b>agente oxidante</b> es la que se reduce. Reglas: elemento libre = 0; H = +1 (−1 en hidruros metálicos); O = −2 (casi siempre); la suma en un compuesto neutro es 0. Una neutralización ácido-base <b>no</b> es redox.',
 mat:['9 reacciones','Números de oxidación de cada elemento'],
 proc:[{t:'Clasifica 6 cambios (se oxida / se reduce).',a:'clasifica_ok',n:6},{t:'Resuelve 3 reacciones completas.',a:'reaccion_ok',n:3},{t:'Resuelve todas las reacciones y retos.',a:'todo_ok'}],
 cfg:{rx:RX_,retos:[{q:'Un elemento que se oxida…',o:['Aumenta su número de oxidación','Disminuye su número de oxidación','No cambia','Gana electrones'],ok:0,why:'Pierde electrones, por eso su número aumenta.'},{q:'El agente oxidante es la sustancia que…',o:['Se reduce','Se oxida','No cambia','Pierde protones'],ok:0,why:'Gana electrones y hace que otra se oxide.'},{q:'El número de oxidación de un elemento puro (por ejemplo O₂) es…',o:['0','−2','+1','+2'],ok:0,why:'Elemento libre: 0.'},{q:'El número de oxidación del azufre en H₂SO₄ es…',o:['+6','+4','−2','+2'],ok:0,why:'2(+1) + S + 4(−2) = 0 → S = +6.'},{q:'¿Cuál de estas reacciones NO es redox?',o:['HCl + NaOH → NaCl + H₂O','Zn + HCl → ZnCl₂ + H₂','Mg + O₂ → MgO','H₂ + Cl₂ → HCl'],ok:0,why:'Es una neutralización: ningún número de oxidación cambia.'}]},
 ana:['¿Por qué la oxidación y la reducción siempre ocurren juntas?','¿Cómo reconoces el agente reductor en una reacción?'],
 ev:[MC('Reducirse significa…',['Ganar electrones','Perder electrones','Ganar protones','Perder neutrones'],0,'Disminuye el número de oxidación.'),MC('El número de oxidación del O en H₂O es…',['−2','+2','0','−1'],0,'Regla general.'),MC('En Zn + CuSO₄ → ZnSO₄ + Cu, el zinc…',['Se oxida','Se reduce','No cambia','Es el oxidante'],0,'0 → +2.')],
 conc:'Explica con una reacción qué se oxida y qué se reduce.',lim:'Números de oxidación asignados para especies comunes; no incluye casos con números de oxidación fraccionarios ni peróxidos.'});

/* 79 */
add({n:'Balanceo por método redox',tema:'Reacciones redox',dif:4,mot:'balanceo',
 obj:'Balancear ecuaciones redox igualando los electrones perdidos y ganados y comprobando el conteo de átomos.',comp:[C1,C3],
 evid:['Calcula electrones perdidos y ganados.','Iguala los electrones con coeficientes.','Verifica el balance de átomos.'],
 teo:'Método de balanceo por cambio del número de oxidación: <b>1)</b> asigna números de oxidación; <b>2)</b> halla cuántos electrones pierde el que se oxida y cuántos gana el que se reduce (por fórmula, multiplicando por el subíndice); <b>3)</b> multiplica para que los electrones perdidos = ganados; <b>4)</b> coloca esos coeficientes y balancea el resto por tanteo. Cada ecuación incluye una pista con los electrones.',
 mat:['8 ecuaciones redox','Contador de átomos y pista de electrones'],
 proc:[{t:'Cambia coeficientes al menos 6 veces.',a:'cambia',n:6},{t:'Balancea 4 ecuaciones.',a:'balancea',n:4},{t:'Balancea todas.',a:'todo_ok'}],
 cfg:{ecs:[{nombre:'Zn + HCl → ZnCl₂ + H₂',L:['Zn','HCl'],R:['ZnCl2','H2'],pista:'Zn: 0 → +2 (pierde 2 e⁻). H: +1 → 0 (gana 1 e⁻ por átomo; 2 H ganan 2 e⁻). Perdidos = ganados.'},{nombre:'Mg + O₂ → MgO',L:['Mg','O2'],R:['MgO'],pista:'Mg: 0 → +2 (pierde 2 e⁻). O₂: gana 4 e⁻ (2 átomos × 2 e⁻). Se necesitan 2 Mg para perder 4 e⁻.'},{nombre:'H₂ + O₂ → H₂O',L:['H2','O2'],R:['H2O'],pista:'H: 0 → +1 (H₂ pierde 2 e⁻). O₂ gana 4 e⁻. Se necesitan 2 H₂.'},{nombre:'Na + Cl₂ → NaCl',L:['Na','Cl2'],R:['NaCl'],pista:'Na: 0 → +1 (pierde 1 e⁻). Cl₂ gana 2 e⁻. Se necesitan 2 Na.'},{nombre:'Cu + AgNO₃ → Cu(NO₃)₂ + Ag',L:['Cu','AgNO3'],R:['Cu(NO3)2','Ag'],pista:'Cu: 0 → +2 (pierde 2 e⁻). Ag: +1 → 0 (gana 1 e⁻). Se necesitan 2 Ag⁺ por cada Cu.'},{nombre:'Al + Fe₂O₃ → Al₂O₃ + Fe',L:['Al','Fe2O3'],R:['Al2O3','Fe'],pista:'Al: 0 → +3 (pierde 3 e⁻). Fe₂O₃: 2 Fe de +3 → 0 (gana 6 e⁻). Se necesitan 2 Al.'},{nombre:'Fe₂O₃ + CO → Fe + CO₂',L:['Fe2O3','CO'],R:['Fe','CO2'],pista:'Fe₂O₃: gana 6 e⁻. C: +2 → +4 (pierde 2 e⁻ por CO). Se necesitan 3 CO.'},{nombre:'CH₄ + O₂ → CO₂ + H₂O',L:['CH4','O2'],R:['CO2','H2O'],pista:'C: −4 → +4 (pierde 8 e⁻). Cada O₂ gana 4 e⁻ → se necesitan 2 O₂.'}]},
 ana:['¿Por qué los electrones perdidos deben ser iguales a los ganados?','¿Qué elemento balanceaste al final en cada ecuación y por qué?'],
 ev:[MC('En el balanceo redox, los electrones perdidos deben ser…',['Iguales a los ganados','Mayores','Menores','Ninguno'],0,'Se conserva la carga.'),MC('El C del CH₄ pasa de −4 a +4: ¿cuántos electrones pierde?',['8','4','2','0'],0,'Diferencia de 8.'),MC('Tras igualar electrones se balancean…',['Los demás átomos por tanteo','Solo el oxígeno','Solo los metales','Nada'],0,'Para completar el balance.')],
 conc:'Explica con una ecuación cómo igualaste los electrones.',lim:'Ecuaciones sin iones en medio ácido o básico (no se usa el método ion-electrón con semirreacciones). Coeficientes de 1 a 9.'});

/* 80 */
add({n:'Termoquímica y entalpía',tema:'Energía y reacciones',dif:3,mot:'termo',
 obj:'Calcular la variación de entalpía de una reacción con entalpías de formación y clasificarla como exotérmica o endotérmica.',comp:[C1,C2],
 evid:['Calcula ΔH = Σ ΔHf productos − Σ ΔHf reactivos.','Clasifica una reacción según el signo de ΔH.','Calcula el calor para una masa dada.'],
 teo:'La <b>entalpía de reacción (ΔH)</b> es el calor intercambiado a presión constante. Se calcula con las <b>entalpías estándar de formación</b> (ΔHf): <b>ΔH = Σ ΔHf(productos) − Σ ΔHf(reactivos)</b> (cada una multiplicada por su coeficiente; los elementos puros en su forma estable valen 0). Si ΔH &lt; 0 la reacción es <b>exotérmica</b> (libera calor); si ΔH &gt; 0 es <b>endotérmica</b> (absorbe calor). El calor total es proporcional a los moles que reaccionan.',
 mat:['7 reacciones con ΔHf de referencia (kJ/mol)','Diagrama de entalpía'],
 proc:[{t:'Revisa al menos 3 reacciones.',a:'reaccion',n:3},{t:'Cambia la masa al menos 2 veces.',a:'cambia',n:2},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{rxs:[{n:'Combustión del metano',R:[[1,'CH4',-74.8],[2,'O2',0]],P:[[1,'CO2',-393.5],[2,'H2O',-285.8,'l']]},{n:'Combustión del propano',R:[[1,'C3H8',-103.8],[5,'O2',0]],P:[[3,'CO2',-393.5],[4,'H2O',-285.8,'l']]},{n:'Formación de agua líquida',R:[[2,'H2',0],[1,'O2',0]],P:[[2,'H2O',-285.8,'l']]},{n:'Descomposición del carbonato de calcio',R:[[1,'CaCO3',-1206.9]],P:[[1,'CaO',-635.1],[1,'CO2',-393.5]]},{n:'Síntesis del amoníaco',R:[[1,'N2',0],[3,'H2',0]],P:[[2,'NH3',-46.1]]},{n:'Reacción de la termita',R:[[2,'Al',0],[1,'Fe2O3',-824.2]],P:[[1,'Al2O3',-1675.7],[2,'Fe',0]]},{n:'Formación de óxido nítrico',R:[[1,'N2',0],[1,'O2',0]],P:[[2,'NO',90.3]]}],retos:[{t:'dH',i:0},{t:'dH',i:3},{t:'dH',i:5},{t:'tipo',i:6},{t:'tipo',i:2},{t:'q',i:0,m:16},{t:'q',i:4,m:28}]},
 ana:['¿Qué significa que el ΔHf de un elemento puro sea cero?','¿Por qué la combustión libera calor y la descomposición del CaCO₃ lo absorbe?'],
 ev:[MC('Una reacción exotérmica tiene ΔH…',['Negativo','Positivo','Cero siempre','Infinito'],0,'Libera calor.'),MC('ΔH =',['Σ ΔHf productos − Σ ΔHf reactivos','Σ reactivos − Σ productos','Solo productos','Solo reactivos'],0,'Productos menos reactivos.'),MC('Una reacción endotérmica…',['Absorbe calor','Libera calor','No cambia','Es un gas'],0,'ΔH positivo.')],
 conc:'Explica con un ejemplo cómo calculas ΔH y qué significa su signo.',lim:'Entalpías de formación estándar (25 °C, 1 atm) redondeadas de tablas de referencia; ΔH por cada vez que ocurre la ecuación tal como está escrita.'});

/* 81 */
add({n:'Calorimetría virtual',tema:'Energía y reacciones',dif:3,mot:'calor',
 obj:'Medir la temperatura final al mezclar un metal caliente con agua y determinar el calor específico del metal para identificarlo.',comp:[C2,C3],
 evid:['Aplica calor perdido = calor ganado.','Calcula el calor específico.','Identifica un metal desconocido con datos.'],
 teo:'Cuando un metal caliente se sumerge en agua fría el sistema llega a una <b>temperatura final</b> común. Si no hay pérdidas: <b>calor perdido por el metal = calor ganado por el agua</b>: m<sub>m</sub>·c<sub>m</sub>·(T<sub>m</sub> − T<sub>f</sub>) = m<sub>a</sub>·c<sub>a</sub>·(T<sub>f</sub> − T<sub>a</sub>), con c del agua = 4,184 J/g·°C. De ahí se despeja el <b>calor específico</b> del metal, que lo identifica (Cu 0,385; Al 0,897; Fe 0,449; Pb 0,129 J/g·°C).',
 mat:['Metales: Cu, Al, Fe, Pb y dos muestras desconocidas','Calorímetro ideal con agua'],
 proc:[{t:'Haz al menos 3 mezclas.',a:'mezcla',n:3},{t:'Identifica una muestra desconocida.',a:'identifica_ok'},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{misterios:[{n:'Muestra A',m:'Al'},{n:'Muestra B',m:'Pb'}],retos:[{t:'tf',me:'Cu',mm:50,Tm:100,mw:100,Tw:20},{t:'tf',me:'Al',mm:100,Tm:90,mw:150,Tw:25},{t:'id',me:'Fe',mm:80,Tm:100,mw:100,Tw:20},{t:'id',me:'Pb',mm:120,Tm:95,mw:100,Tw:22}]},
 ana:['¿Por qué el metal baja de temperatura y el agua sube?','¿Qué pérdidas de calor tendría un experimento real y cómo afectarían tu c calculado?'],
 ev:[MC('Si no hay pérdidas, el calor perdido por el metal…',['Es igual al ganado por el agua','Es mayor','Es menor','Es cero'],0,'Conservación de la energía.'),MC('El calor específico del agua es…',['4,184 J/g·°C','1 J/g·°C','0,1 J/g·°C','100 J/g·°C'],0,'Valor de referencia.'),MC('Un metal con bajo calor específico…',['Se calienta y enfría fácilmente','Casi no cambia de temperatura','Es un gas','No tiene masa'],0,'Necesita poca energía por grado.')],
 conc:'Explica cómo identificaste un metal desconocido con tus datos.',lim:'Calorímetro ideal sin pérdidas de calor al ambiente ni al recipiente. La forma de las curvas T–tiempo es ilustrativa; la temperatura final sí se calcula con el balance de energía.'});

/* 82 */
add({n:'Leyes de los gases',tema:'Gases',dif:3,mot:'gases',
 obj:'Relacionar presión, volumen, temperatura y cantidad de gas mediante las leyes de Boyle, Charles, Gay-Lussac y el gas ideal.',comp:[C1,C2,C3],
 evid:['Aplica las leyes con temperatura absoluta (kelvin).','Interpreta las gráficas de cada ley.','Resuelve problemas con PV = nRT.'],
 teo:'Para una cantidad fija de gas: <b>Boyle</b> (T constante): P·V = constante, al aumentar P el V disminuye. <b>Charles</b> (P constante): V/T = constante. <b>Gay-Lussac</b> (V constante): P/T = constante. La temperatura debe estar en <b>kelvin</b> (K = °C + 273,15). Combinadas con la cantidad de gas dan la <b>ecuación del gas ideal: PV = nRT</b>, con R = 0,08206 L·atm/(mol·K). A nivel de partículas, mayor temperatura = partículas más rápidas = más choques con las paredes = más presión.',
 mat:['Gas ideal en recipiente de volumen variable','Gráficas P–V, V–T y P–T'],
 proc:[{t:'Cambia los controles al menos 5 veces.',a:'cambia',n:5},{t:'Prueba las 4 leyes.',a:'ley',n:3},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{retos:[{t:'boyle',P1:2,V1:3,P2:6},{t:'boyle',P1:1.5,V1:4,P2:3},{t:'charles',V1:2,T1:27,T2:127},{t:'gay',P1:1,T1:27,T2:127},{t:'n',P:2,V:5,T:300},{t:'charles',V1:5,T1:0,T2:100}]},
 ana:['¿Por qué hay que usar kelvin y no °C en las leyes de los gases?','¿Cómo explican las partículas que al calentar un gas en un recipiente rígido aumente la presión?'],
 ev:[MC('Según Boyle, si el volumen se reduce a la mitad (T constante), la presión…',['Se duplica','Se reduce a la mitad','No cambia','Se anula'],0,'P·V constante.'),MC('La temperatura en las leyes de los gases debe estar en…',['Kelvin','°C','°F','Joules'],0,'Escala absoluta.'),MC('PV = nRT es la ecuación del…',['Gas ideal','Gas real','Líquido','Sólido'],0,'Modelo de gas ideal.')],
 conc:'Explica con una ley cómo cambia una variable al cambiar otra.',lim:'Modelo de gas ideal: no considera fuerzas entre partículas ni volumen propio de las moléculas; falla a altas presiones y bajas temperaturas. El movimiento de partículas es ilustrativo.'});

/* 83 */
add({n:'Laboratorio integrado de química inorgánica',tema:'Integración',dif:4,mot:'incognita',
 obj:'Identificar sustancias desconocidas combinando pruebas de aspecto, pH, precipitación y reactividad.',comp:[C1,C2,C3],
 evid:['Planifica una secuencia de pruebas.','Interpreta pH, precipitados y gases para identificar sustancias.','Justifica una identificación con evidencias.'],
 teo:'Para identificar sustancias desconocidas se combinan pruebas: el <b>aspecto</b> (color), el <b>indicador universal</b> (ácido, neutro o base), la formación de <b>precipitados</b> (AgNO₃ da sólido blanco con cloruros y carbonatos; NaOH da sólido azul con Cu²⁺), y la <b>reactividad</b> (un metal reactivo como el magnesio desprende hidrógeno con ácidos y desplaza al cobre de sus sales). Cada prueba descarta posibilidades; la identificación se justifica con la suma de evidencias.',
 mat:['5 posibles sustancias: HCl, NaOH, NaCl, CuSO₄ y Na₂CO₃','3 casos de 4 frascos cada uno','Pruebas: aspecto, indicador universal, AgNO₃, Mg y NaOH'],
 proc:[{t:'Haz al menos 8 pruebas.',a:'prueba',n:8},{t:'Identifica 4 frascos correctamente.',a:'identifica_ok',n:4},{t:'Resuelve un caso completo.',a:'caso_ok'},{t:'Resuelve los 3 casos.',a:'todo_ok'}],
 cfg:{casos:[['HCl','NaCl','NaOH','CuSO4'],['Na2CO3','HCl','NaCl','CuSO4'],['NaOH','Na2CO3','NaCl','HCl']]},
 ana:['¿Qué prueba te sirvió más para separar el HCl del NaCl?','¿Cómo distinguiste el Na₂CO₃ del NaOH?'],
 ev:[MC('Una solución con pH ≈ 13 es…',['Muy básica','Muy ácida','Neutra','Un gas'],0,'Como el NaOH.'),MC('El AgNO₃ forma un sólido blanco con…',['Cloruros','Nitratos','Sodio','Agua pura'],0,'AgCl.'),MC('El Mg desprende burbujas con…',['Un ácido','Una sal neutra','Una base','Agua pura'],0,'Hidrógeno.')],
 conc:'Describe la secuencia de pruebas que usaste para identificar los frascos y por qué.',lim:'Soluciones diluidas, temperatura ambiente. Resultados de referencia cualitativos (por ejemplo, el CuSO₄ con AgNO₃ puede dar poco sólido de Ag₂SO₄ en soluciones concentradas). Los casos son fijos, no aleatorios.'});

window.QUI_G10=L;
})();
