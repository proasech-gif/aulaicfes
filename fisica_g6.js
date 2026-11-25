/* AULA360 — Catálogo de Física · SEXTO (laboratorios 1–15 del inventario). Modelos con las leyes reales; cada laboratorio declara sus límites. */
window.FIS_G6=(function(){
const L=[];
const fm=(v,d)=>(+v).toFixed(d).replace('.',',');
const C1='Uso comprensivo del conocimiento científico',C2='Explicación de fenómenos',C3='Indagación';
const PV='Por verificar con los DBA oficiales del MEN (no se inventan códigos).',EST='Por verificar con los Estándares Básicos de Competencias del MEN.';
const MC=(q,o,ok,fb)=>({q,o,ok,fb});
const add=o=>{o.g=6;o.dba=PV;o.est=EST;o.area='Física';o.mot='banco';o.no=+o.c.slice(-3);
 if(!o.proc){const k=(o.cfg.tareas||[]).length;o.proc=[{t:'Cambia los controles y observa el dibujo.',a:'cambia',n:3}];if(!o.cfg.sinMedir)o.proc.push({t:'Mide y registra al menos 5 datos en la tabla.',a:'mide',n:5});if(k)o.proc.push({t:'Completa las tareas (comprueba cada una).',a:'tarea_ok',n:k});o.proc.push({t:'Resuelve los retos.',a:'todo_ok'})}
 L.push(o)};
const sel=(id,n,opts)=>({id,n,tipo:'sel',opts});
const rg=(id,n,u,min,max,step,v)=>({id,n,u,min,max,step,v});

/* 1 */
const OB={lapiz:['Lápiz',17.5,'#facc15'],borrador:['Borrador',4.2,'#f9a8d4'],moneda:['Moneda (diámetro)',2.403,'#d1d5db'],cuaderno:['Cuaderno (largo)',21.6,'#60a5fa'],llave:['Llave',5.832,'#a3a3a3']};
add({c:'F06-001',n:'Medición de longitudes',tema:'Medición · longitud',dif:1,
 obj:'Medir objetos cotidianos con regla y calibrador, expresar la medida con las cifras que permite el instrumento y comparar su precisión.',comp:[C1,C3],
 evid:['Lee correctamente una regla en milímetros.','Expresa la medida con la cifra decimal adecuada.','Explica por qué el calibrador es más preciso que la regla.'],
 teo:'<b>Medir</b> es comparar una magnitud con una unidad. La longitud se mide en metros (m), centímetros (cm) o milímetros (mm). Cada instrumento tiene una <b>resolución</b>: la regla común distingue 1 mm (0,1 cm) y el calibrador 0,05 mm (0,005 cm). La medida se escribe con tantas cifras decimales como permite el instrumento. Medir varias veces y promediar reduce el efecto del error aleatorio.',
 mat:['Regla de 25 cm (resolución 1 mm)','Calibrador básico (0,05 mm)','Lápiz, borrador, moneda, cuaderno y llave'],
 cfg:{vis:'regla',vars:[sel('obj','Objeto',Object.entries(OB).map(([k,x])=>[k,x[0]])),sel('inst','Instrumento',[['regla','Regla (1 mm)'],['cal','Calibrador (0,05 mm)']])],
  outs:[{id:'L',n:'Longitud',u:'cm'}],tabla:['obj','inst','L'],
  fx:v=>{const o=OB[v.obj];return{L:o[1],_res:{L:v.inst==='cal'?0.005:0.1},_sd:{L:v.inst==='cal'?0.002:0.04},_vmax:25,_x0:1,_c:o[2],_n:o[0],_cal:v.inst==='cal'}},
  tareas:[{t:'valor',txt:'Elige la MONEDA y el CALIBRADOR. Mide su diámetro y escribe el valor en cm.',ans:2.403,tolA:0.02,u:'cm'},{t:'valor',txt:'Mide el largo del CUADERNO con la regla (cm).',ans:21.6,tolA:0.15,u:'cm'},{t:'tabla',txt:'Registra al menos 5 medidas (puedes repetir un objeto con los dos instrumentos).',n:5}],
  retos:[{q:'Una regla con divisiones de 1 mm tiene una resolución de…',o:['0,1 cm','1 cm','0,01 cm','10 cm'],ok:0,why:'1 mm = 0,1 cm.'},{q:'Para medir el diámetro de una moneda con mayor precisión conviene usar…',o:['El calibrador','Una cuerda','La regla','El pie'],ok:0,why:'El calibrador distingue 0,05 mm.'},{q:'Si mides 17,53 cm con una regla de 1 mm, el último dígito…',o:['No tiene sentido: la regla no lo distingue','Es el más exacto','Es obligatorio','Es la unidad'],ok:0,why:'Con regla de 1 mm solo se justifica un decimal en cm (17,5).'}]},
 ana:['¿Qué diferencia hay entre medir con la regla y con el calibrador la misma moneda?','¿Por qué al repetir la medida no siempre obtienes el mismo valor?'],
 ev:[MC('La resolución de un instrumento es…',['El cambio mínimo que puede distinguir','El tamaño del objeto','El peso del instrumento','La unidad de medida'],0,'Es el cambio mínimo que puede mostrar.'),MC('25 mm equivalen a…',['2,5 cm','25 cm','0,25 cm','250 cm'],0,'10 mm = 1 cm.'),MC('Repetir una medida y promediar sirve para…',['Reducir el efecto del error aleatorio','Cambiar la unidad','Aumentar la resolución','Hacer el objeto más largo'],0,'El promedio atenúa las variaciones al azar.')],
 conc:'Escribe cómo mides correctamente una longitud y qué determina cuántas cifras puedes escribir.',lim:'Las medidas tienen ruido aleatorio pequeño simulado (distribución normal). No incluye error de paralaje ni cero mal ajustado.'});

/* 2 */
const SO={piedra:['Piedra',18.4,'#78716c'],llave:['Llave de hierro',6.2,'#a3a3a3'],tuerca:['Tuerca',3.1,'#9ca3af'],canica:['Canica',4.7,'#34d399']};
add({c:'F06-002',n:'Volumen de sólidos por desplazamiento',tema:'Medición · volumen',dif:1,
 obj:'Hallar el volumen de sólidos irregulares sumergiéndolos en agua y restando las lecturas de la probeta (principio de Arquímedes básico).',comp:[C1,C3],
 evid:['Lee el nivel de agua en la probeta.','Calcula V = V₂ − V₁.','Explica por qué el agua desplazada es igual al volumen del cuerpo.'],
 teo:'Un cuerpo sumergido <b>desplaza</b> un volumen de agua igual a su propio volumen. Se lee el nivel inicial V₁ y el final V₂ en la probeta; el volumen del cuerpo es <b>V = V₂ − V₁</b>. Se lee el menisco en su parte baja con el ojo a la altura del nivel. 1 mL = 1 cm³.',
 mat:['Probeta de 100 mL (1 mL)','Agua','Piedra, llave, tuerca y canica'],
 cfg:{vis:'probeta',vars:[sel('obj','Cuerpo',Object.entries(SO).map(([k,x])=>[k,x[0]]))],
  outs:[{id:'V1',n:'V₁ (nivel inicial)',u:'mL'},{id:'V2',n:'V₂ (con el cuerpo)',u:'mL'}],tabla:['obj','V1','V2'],
  fx:v=>{const o=SO[v.obj];return{V1:50,V2:50+o[1],_res:{V1:1,V2:1},_sd:{V1:0.25,V2:0.3},_V0:50,_V2:50+o[1],_cap:100,_c:o[2],_n:o[0]}},
  tareas:[{t:'valor',txt:'Con el cuerpo elegido, calcula su volumen V = V₂ − V₁ (mL). Puedes cambiar de cuerpo cuando quieras.',ans:(v)=>SO[v.obj][1],tolA:1.6,u:'mL',pista:'resta las dos lecturas'},{t:'tabla',txt:'Mide los 4 cuerpos (mínimo 4 medidas).',n:4}],
  retos:[{q:'El nivel pasa de 50 mL a 68 mL al sumergir un cuerpo. Su volumen es…',o:['18 mL','68 mL','50 mL','118 mL'],ok:0,why:'68 − 50 = 18 mL = 18 cm³.'},{q:'El menisco se lee…',o:['En su parte baja, con el ojo a su altura','En su parte alta','Desde arriba','Sin mirar'],ok:0,why:'Así se evita el error de paralaje.'},{q:'1 mL equivale a…',o:['1 cm³','1 m³','1 dm³','10 cm³'],ok:0,why:'1 mL = 1 cm³.'}]},
 ana:['¿Por qué sube el agua cuando sumerges el cuerpo?','¿Este método sirve para un trozo de madera que flota? ¿Por qué?'],
 ev:[MC('El volumen de un sólido irregular se halla con…',['V₂ − V₁','V₂ + V₁','V₂ × V₁','V₁ ÷ V₂'],0,'Se resta el nivel inicial al final.'),MC('Un cuerpo sumergido desplaza…',['Su propio volumen de agua','Su propia masa de agua','Nada','El doble de su volumen'],0,'Principio de desplazamiento.'),MC('La unidad equivalente al mL es…',['cm³','m²','kg','°C'],0,'1 mL = 1 cm³.')],
 conc:'Explica cómo se mide el volumen de un objeto irregular.',lim:'Cuerpos que se hunden y no absorben agua. Lecturas con resolución de 1 mL y pequeño ruido simulado.'});

/* 3 */
const MA={madera:['Madera de pino',0.65,'#a16207'],aluminio:['Aluminio',2.70,'#cbd5e1'],hierro:['Hierro',7.87,'#475569'],plastico:['Plástico PVC',1.20,'#93c5fd'],cobre:['Cobre',8.96,'#c2410c']};
add({c:'F06-003',n:'Uso de la balanza y medición de masa',tema:'Medición · masa',dif:1,
 obj:'Comparar las masas de cubos de distintos materiales con el mismo volumen y reconocer que la masa depende del material.',comp:[C1,C3],
 evid:['Lee la masa en la balanza.','Compara masas de igual volumen.','Relaciona masa y tipo de material.'],
 teo:'La <b>masa</b> mide la cantidad de materia y se expresa en gramos (g) o kilogramos (kg). La balanza compara la masa con patrones. Dos cuerpos con el <b>mismo volumen</b> pueden tener masas muy distintas porque están hechos de materiales diferentes: cada material tiene una cantidad de masa por unidad de volumen (su densidad).',
 mat:['Balanza (0,1 g)','Cubos de 20 cm³ de madera, aluminio, hierro, PVC y cobre'],
 cfg:{vis:'balanza',vars:[sel('mat','Material del cubo (20 cm³)',Object.entries(MA).map(([k,x])=>[k,x[0]]))],
  outs:[{id:'m',n:'Masa',u:'g'}],tabla:['mat','m'],
  fx:v=>{const o=MA[v.mat];return{m:o[1]*20,_res:{m:0.1},_sd:{m:0.05},_side:44,_c:o[2],_n:o[0]}},
  tareas:[{t:'valor',txt:'Mide el cubo de HIERRO de 20 cm³ y escribe su masa (g).',ans:157.4,tolA:1,u:'g'},{t:'valor',txt:'Mide el cubo de ALUMINIO y escribe su masa (g).',ans:54,tolA:0.6,u:'g'},{t:'tabla',txt:'Mide los 5 materiales.',n:5}],
  retos:[{q:'Cubos del mismo volumen, uno de hierro y otro de madera. ¿Cuál tiene mayor masa?',o:['El de hierro','El de madera','Igual','Depende del color'],ok:0,why:'El hierro es más denso.'},{q:'1 kg equivale a…',o:['1000 g','100 g','10 g','10 000 g'],ok:0,why:'1 kg = 1000 g.'},{q:'La masa de un cuerpo en la Luna comparada con la de la Tierra es…',o:['La misma','Seis veces menor','Seis veces mayor','Cero'],ok:0,why:'La masa no cambia; el peso sí.'}]},
 ana:['¿Por qué cubos del mismo tamaño tienen masas diferentes?','Ordena los materiales de menor a mayor masa.'],
 ev:[MC('Dos cuerpos con igual volumen tienen igual masa si…',['Son del mismo material','Tienen el mismo color','Están a la misma altura','Son lisos'],0,'La masa depende del material y del volumen.'),MC('La balanza mide…',['Masa','Volumen','Temperatura','Longitud'],0,'La balanza compara masas.'),MC('2,5 kg son…',['2500 g','250 g','25 g','25 000 g'],0,'2,5 × 1000.')],
 conc:'Explica por qué la masa depende del material aunque el volumen sea igual.',lim:'Balanza ideal con resolución de 0,1 g y ruido pequeño simulado; sin deriva ni corrientes de aire.'});

/* 4 */
add({c:'F06-004',n:'Determinación de la densidad de sólidos',tema:'Materia · densidad',dif:2,
 obj:'Calcular la densidad ρ = m/V de cubos de distintos materiales midiendo su arista y su masa.',comp:[C1,C2,C3],
 evid:['Calcula el volumen de un cubo (V = a³).','Calcula la densidad ρ = m/V.','Identifica un material por su densidad.'],
 teo:'La <b>densidad</b> es la masa por unidad de volumen: <b>ρ = m / V</b>. Para un cubo de arista a, V = a³. Se expresa en g/cm³. Cada material tiene una densidad característica (madera de pino ≈ 0,65; PVC ≈ 1,2; aluminio ≈ 2,70; hierro ≈ 7,87 g/cm³). En una gráfica de m contra V la <b>pendiente</b> es la densidad.',
 mat:['Cubos de madera, aluminio, hierro y PVC de distinta arista','Calibrador','Balanza (0,1 g)'],
 cfg:{vis:'balanza',vars:[sel('mat','Material',['madera','aluminio','hierro','plastico'].map(k=>[k,MA[k][0]])),rg('a','Arista del cubo','cm',2,5,0.5,3)],
  outs:[{id:'a',n:'Arista medida',u:'cm'},{id:'m',n:'Masa',u:'g'}],tabla:['mat','a','m'],
  fx:v=>{const o=MA[v.mat];return{a:v.a,m:o[1]*v.a**3,_res:{a:0.01,m:0.1},_sd:{a:0.006,m:0.05},_side:20+v.a*10,_c:o[2],_n:o[0]}},
  graf:{x:'a',y:'m',fx:a=>a**3,nx:'V = a³ (cm³)',ny:'m (g)',origen:true,u:'g/cm³'},
  tareas:[{t:'valor',txt:'Calcula la densidad del ALUMINIO (g/cm³): mide su arista y su masa, y usa ρ = m/a³.',ans:2.70,tol:0.07,u:'g/cm³',pista:'ρ = m ÷ (arista)³'},{t:'valor',txt:'Calcula la densidad del HIERRO (g/cm³).',ans:7.87,tol:0.07,u:'g/cm³'},{t:'valor',txt:'Calcula la densidad de la MADERA (g/cm³).',ans:0.65,tol:0.09,u:'g/cm³'}],
  retos:[{q:'Un cubo de 2 cm de arista tiene 21,6 g. Su densidad es…',o:['2,7 g/cm³','10,8 g/cm³','5,4 g/cm³','1,35 g/cm³'],ok:0,why:'V = 8 cm³; 21,6 ÷ 8 = 2,7.'},{q:'Si el cubo es de madera (ρ ≈ 0,65 g/cm³), en el agua (1,00 g/cm³)…',o:['Flota','Se hunde','Se disuelve','Queda a media altura'],ok:0,why:'Menor densidad que el agua → flota.'},{q:'La pendiente de la gráfica m contra V es…',o:['La densidad','La masa','El volumen','La temperatura'],ok:0,why:'m = ρ·V.'}]},
 ana:['¿Cómo cambia la masa cuando duplicas la arista? ¿Y la densidad?','¿Qué material tendría densidad 8,96 g/cm³?'],
 ev:[MC('La densidad se calcula con…',['m ÷ V','m × V','V ÷ m','m − V'],0,'ρ = m/V.'),MC('El volumen de un cubo de arista a es…',['a³','3a','a²','6a²'],0,'Largo × ancho × alto.'),MC('Si duplicas la arista de un cubo de hierro, la densidad…',['No cambia','Se duplica','Se reduce a la mitad','Se hace 8 veces mayor'],0,'La densidad depende del material, no del tamaño.')],
 conc:'Explica por qué la densidad sirve para identificar materiales.',lim:'Cubos perfectos con densidades de referencia redondeadas; sin huecos ni impurezas.'});

/* 5 */
const LQ={miel:['Miel',1.42,'#f59e0b'],agua:['Agua',1.00,'#38bdf8'],aceite:['Aceite',0.92,'#fde047'],alcohol:['Alcohol',0.79,'#c7d2fe']};
add({c:'F06-005',n:'Torre de densidades líquidas',tema:'Materia · densidad',dif:2,
 obj:'Armar una columna de líquidos que no se mezclan y explicar su orden por densidad.',comp:[C1,C2],
 evid:['Ordena líquidos por densidad.','Predice qué capa queda arriba y cuál abajo.','Calcula la masa de líquidos usando m = ρ·V.'],
 teo:'Al verter líquidos que no se mezclan, el más <b>denso</b> queda abajo y el menos denso arriba, porque cada capa solo puede estar sobre otra de mayor densidad. Densidades aproximadas: miel 1,42; agua 1,00; aceite 0,92; alcohol 0,79 g/mL. La masa de cada capa se calcula con <b>m = ρ · V</b>.',
 mat:['Probeta alta','Miel, agua, aceite y alcohol'],
 cfg:{vis:'torre',sinMedir:true,vars:Object.entries(LQ).map(([k,x])=>rg(k,x[0],'mL',0,30,5,0)),
  fx:v=>{const ls=Object.entries(LQ).filter(([k])=>v[k]>0).map(([k,x])=>({n:x[0],rho:x[1],c:x[2],V:v[k]})).sort((a,b)=>b.rho-a.rho);return{_layers:ls}},
  leyenda:()=>'Densidades (g/mL): miel 1,42 · agua 1,00 · aceite 0,92 · alcohol 0,79',
  tareas:[{t:'meta',txt:'Forma una torre con los CUATRO líquidos (al menos 10 mL de cada uno).',check:v=>({ok:Object.keys(LQ).every(k=>v[k]>=10),msg:Object.keys(LQ).every(k=>v[k]>=10)?'Torre completa: de abajo hacia arriba miel, agua, aceite y alcohol.':'Faltan líquidos (cada uno al menos 10 mL).'})},{t:'valor',txt:'¿Cuál es la densidad (g/mL) del líquido que queda en la capa SUPERIOR de tu torre de cuatro líquidos?',ans:0.79,tolA:0.02,u:'g/mL'},{t:'valor',txt:'Calcula la masa (g) de 20 mL de agua más 20 mL de aceite: m = ρ·V de cada uno.',ans:38.4,tolA:0.6,u:'g'}],
  retos:[{q:'¿Qué líquido queda abajo?',o:['El más denso','El más caliente','El más viscoso siempre','El de menor volumen'],ok:0,why:'La capa más densa va al fondo.'},{q:'El aceite (0,92) respecto del agua (1,00) queda…',o:['Arriba','Abajo','Mezclado','Igual'],ok:0,why:'Menor densidad → arriba.'},{q:'La masa de 50 mL de miel (1,42 g/mL) es…',o:['71 g','35 g','0,03 g','142 g'],ok:0,why:'1,42 × 50 = 71 g.'}]},
 ana:['¿Qué pasaría si vertieras primero el alcohol y luego la miel?','¿Por qué el orden de las capas no depende de cuál vertiste primero?'],
 ev:[MC('En una torre de líquidos, el que está más arriba tiene…',['La menor densidad','La mayor densidad','El mayor volumen','El mayor color'],0,'La capa superior es la menos densa.'),MC('Masa = …',['ρ · V','ρ ÷ V','V ÷ ρ','ρ − V'],0,'m = ρ·V.'),MC('Si dos líquidos no se mezclan y tienen igual densidad…',['Quedarían a la misma altura mezclados','Uno flota','Se evaporan','Se hunden'],0,'Sin diferencia de densidad no se separan en capas.')],
 conc:'Explica con densidades por qué se forman las capas.',lim:'Se ordena por densidad y se supone que los líquidos se vierten con cuidado. En la realidad el alcohol se mezcla con el agua; aquí se trata como una capa separada con fines de aprendizaje.'});

/* 6 */
const PW=[80,120,160];
const Tcur=(t,P)=>{const t1=21/P,t2=t1+334/P,t3=t2+418/P,t4=t3+2260/P;if(t<=t1)return-10+10*t/t1;if(t<=t2)return 0;if(t<=t3)return 100*(t-t2)/(t3-t2);if(t<=t4)return 100;return 100+(t-t4)*P/2.0};
const fase=(t,P)=>{const t1=21/P,t2=t1+334/P,t3=t2+418/P,t4=t3+2260/P;return t<=t1?'Hielo calentándose':t<=t2?'Fusión (hielo + agua)':t<=t3?'Agua líquida calentándose':t<=t4?'Ebullición (agua + vapor)':'Vapor calentándose'};
add({c:'F06-006',n:'Estados de la materia y cambios de fase',tema:'Calor · cambios de estado',dif:2,
 obj:'Medir la temperatura del agua mientras se calienta desde hielo hasta vapor y reconocer las mesetas de fusión y ebullición.',comp:[C1,C2,C3],
 evid:['Construye una curva de calentamiento.','Identifica las temperaturas de fusión y ebullición.','Explica por qué la temperatura se mantiene constante en un cambio de fase.'],
 teo:'Al calentar hielo, la temperatura sube hasta 0 °C; allí se <b>funde</b> y la temperatura <b>no cambia</b> mientras haya hielo: el calor se usa para romper la estructura del sólido (calor latente de fusión, 334 J/g). Luego el agua líquida sube hasta 100 °C, donde <b>hierve</b> y otra vez la temperatura se mantiene (calor latente de vaporización, 2260 J/g). Después el vapor se calienta. Con mayor potencia el proceso es más rápido.',
 mat:['1 g de hielo a −10 °C','Fuente de calor de potencia ajustable','Termómetro (0,5 °C)','Cronómetro'],
 cfg:{vis:'curva',tmax:40,Tmax:130,Tmin:-20,curvaT:(t,v)=>Tcur(t,v.P),anim:{v:'t',dur:7000},
  vars:[rg('t','Tiempo','min',0,40,0.5,0),sel('P','Potencia del calentador',PW.map(p=>[p,p+' J/g por min']))],
  outs:[{id:'T',n:'Temperatura',u:'°C'}],tabla:['P','t','T'],
  fx:v=>{const T=Tcur(v.t,+v.P);return{T,_res:{T:0.5},_sd:{T:0.3},_fase:fase(v.t,+v.P)}},
  graf:{x:'t',y:'T',nx:'t (min)',ny:'T (°C)',u:''},
  tareas:[{t:'valor',txt:'Con la potencia de 120 J/g por min, ¿a qué temperatura (°C) se mantiene el agua durante la FUSIÓN?',ans:0,tolA:1,u:'°C'},{t:'valor',txt:'¿A qué temperatura (°C) se mantiene durante la EBULLICIÓN?',ans:100,tolA:1.5,u:'°C'},{t:'valor',txt:'Con 120 J/g por min, ¿cuántos minutos dura la fusión? (de que llega a 0 °C hasta que termina de fundirse)',ans:2.78,tolA:0.7,u:'min',pista:'busca el intervalo en que T = 0 °C'}],
  retos:[{q:'Durante la fusión del hielo la temperatura…',o:['Se mantiene en 0 °C','Sube siempre','Baja','Es 100 °C'],ok:0,why:'El calor se usa en cambiar de estado.'},{q:'La temperatura de ebullición del agua al nivel del mar es…',o:['100 °C','0 °C','50 °C','212 °C'],ok:0,why:'100 °C a 1 atm.'},{q:'Si duplicas la potencia, la meseta de ebullición…',o:['Se acorta','Se alarga','No cambia de temperatura ni de duración','Desaparece'],ok:0,why:'Más calor por minuto: el mismo proceso dura menos; la temperatura no cambia.'}]},
 ana:['¿Por qué el termómetro no sube durante las mesetas aunque sigas calentando?','¿Qué cambia en la gráfica al aumentar la potencia?'],
 ev:[MC('Un cambio de fase ocurre a temperatura…',['Constante','Creciente','Decreciente','Variable al azar'],0,'La temperatura se mantiene mientras cambia el estado.'),MC('El paso de sólido a líquido se llama…',['Fusión','Evaporación','Condensación','Sublimación'],0,'Fusión.'),MC('El agua hierve a 100 °C a…',['Nivel del mar','Cualquier altura','Mayor altura','Menor presión siempre'],0,'Depende de la presión.')],
 conc:'Describe la curva de calentamiento del agua y explica sus mesetas.',lim:'Modelo ideal de 1 g de agua con calores específicos y latentes de referencia, sin pérdidas al ambiente ni subenfriamiento.'});

/* 7 */
const AL={al:['Aluminio',23.1],ac:['Acero',11.7],cu:['Cobre',16.5]};const RING=20.058;
add({c:'F06-007',n:'Dilatación térmica en sólidos',tema:'Calor · dilatación',dif:2,
 obj:'Comprobar que los sólidos se dilatan al calentarse con el experimento de la esfera y el anillo y calcular la variación de diámetro.',comp:[C1,C2,C3],
 evid:['Describe cómo cambia el tamaño con la temperatura.','Calcula ΔL = α·L₀·ΔT.','Compara la dilatación de distintos metales.'],
 teo:'Al aumentar la temperatura, las partículas de un sólido vibran más y ocupan más espacio: el sólido se <b>dilata</b>. Para un tamaño L₀ la variación es <b>ΔL = α · L₀ · ΔT</b>, donde α es el coeficiente de dilatación lineal (aluminio 23,1; acero 11,7; cobre 16,5 ×10⁻⁶ por °C). En el experimento una esfera de 20,000 mm a 20 °C pasa por un anillo de 20,058 mm solo mientras no se dilate más que el anillo.',
 mat:['Esfera metálica de 20 mm de diámetro','Anillo de 20,058 mm','Mechero y termómetro','Micrómetro (0,001 mm)'],
 cfg:{vis:'anillo',vars:[sel('mat','Metal de la esfera',Object.entries(AL).map(([k,x])=>[k,x[0]])),rg('T','Temperatura de la esfera','°C',20,300,10,20)],
  outs:[{id:'D',n:'Diámetro de la esfera',u:'mm'}],tabla:['mat','T','D'],
  fx:v=>{const D=20*(1+AL[v.mat][1]*1e-6*(v.T-20));return{D,pasa:D<=RING,_ring:RING,_res:{D:0.001},_sd:{D:0.002}}},
  tareas:[{t:'valor',txt:'Esfera de ALUMINIO: ¿cuánto aumenta su diámetro (mm) al pasar de 20 °C a 220 °C? (mide los dos diámetros y resta)',ans:0.0924,tolA:0.012,u:'mm',pista:'ΔD = D(220 °C) − D(20 °C)'},{t:'meta',txt:'Encuentra la temperatura mínima (múltiplo de 10 °C) a la que la esfera de ALUMINIO YA NO pasa por el anillo.',check:(v,o)=>({ok:v.mat==='al'&&v.T===150,msg:v.mat==='al'&&v.T===150?'Correcto: a 150 °C el diámetro supera 20,058 mm.':'Prueba con la esfera de aluminio y sube la temperatura de 10 en 10 °C hasta que deje de pasar.'})},{t:'tabla',txt:'Registra al menos 6 medidas con distintos metales y temperaturas.',n:6}],
  retos:[{q:'Al calentar un metal, su tamaño…',o:['Aumenta ligeramente','Disminuye','No cambia','Se duplica'],ok:0,why:'Se dilata.'},{q:'Un metal con α mayor se dilata…',o:['Más','Menos','Igual','No se dilata'],ok:0,why:'ΔL es proporcional a α.'},{q:'¿Por qué hay juntas de dilatación en puentes y rieles?',o:['Para que se dilaten sin deformarse','Para decorar','Para pesar menos','Para evitar el óxido'],ok:0,why:'El espacio absorbe la dilatación.'}]},
 ana:['¿Qué le pasa a la esfera si enfrías el anillo en lugar de calentar la esfera?','¿Qué metal necesita más temperatura para dejar de pasar?'],
 ev:[MC('ΔL = …',['α · L₀ · ΔT','α + L₀ + ΔT','L₀ ÷ ΔT','α ÷ ΔT'],0,'Ley de dilatación lineal.'),MC('Al calentar un anillo metálico, el hueco…',['Aumenta','Disminuye','Desaparece','No cambia'],0,'Todo el anillo se dilata, incluido el hueco.'),MC('La dilatación se debe a…',['Mayor vibración de las partículas','Más masa','Menos partículas','Cambio de color'],0,'Aumenta la agitación y la separación media.')],
 conc:'Explica por qué se dilatan los sólidos y cómo se calcula el cambio de tamaño.',lim:'Dilatación lineal con α constante (válida en este rango). Se desprecian el calentamiento desigual y la oxidación.'});

/* 8 */
const VA=[{id:'Lcu',n:'Cobre',k:401,c:'#c2410c'},{id:'Lal',n:'Aluminio',k:237,c:'#94a3b8'},{id:'Lfe',n:'Hierro',k:80,c:'#475569'},{id:'Lvi',n:'Vidrio',k:1,c:'#93c5fd'}];
add({c:'F06-008',n:'Transferencia de calor por conducción',tema:'Calor · conducción',dif:2,
 obj:'Comparar la rapidez con que el calor viaja por varillas de cobre, aluminio, hierro y vidrio midiendo hasta dónde se derrite la cera.',comp:[C1,C2,C3],
 evid:['Compara conductores y aislantes.','Relaciona la distancia con el tiempo.','Interpreta la conductividad térmica.'],
 teo:'La <b>conducción</b> transmite calor por contacto entre partículas vecinas, sin que el material se desplace. La rapidez depende de la <b>conductividad térmica k</b> (cobre 401; aluminio 237; hierro 80; vidrio ≈1 W/m·K). Los metales son buenos conductores; el vidrio, la madera y el plástico son aislantes. En una varilla calentada por un extremo, la distancia alcanzada crece como la raíz del tiempo y como la raíz de k.',
 mat:['4 varillas del mismo tamaño','Cera en puntos cada centímetro','Mechero','Cronómetro'],
 cfg:{vis:'varillas',varillas:VA,anim:{v:'t',dur:7000},vars:[rg('t','Tiempo de calentamiento','min',0,10,0.5,0)],
  outs:VA.map(r=>({id:r.id,n:'Cera derretida en '+r.n.toLowerCase(),u:'cm'})),tabla:['t','Lcu','Lal','Lfe','Lvi'],
  fx:v=>{const o={};VA.forEach(r=>o[r.id]=1.2*Math.sqrt(r.k/401*v.t));o._res={Lcu:0.1,Lal:0.1,Lfe:0.1,Lvi:0.1};o._sd={Lcu:0.04,Lal:0.04,Lfe:0.04,Lvi:0.02};return o},
  graf:{x:'t',y:'Lcu',fx:t=>Math.sqrt(t),nx:'√t (min^½)',ny:'L cobre (cm)',origen:true,u:'cm/min^½'},
  tareas:[{t:'valor',txt:'¿Hasta dónde llega la cera derretida en la varilla de COBRE a los 9 minutos (cm)?',ans:3.6,tolA:0.25,u:'cm'},{t:'valor',txt:'A los 9 minutos, ¿cuántas veces más lejos llegó la cera en el cobre que en el hierro? (cociente L cobre ÷ L hierro)',ans:2.24,tol:0.1,u:'veces'},{t:'valor',txt:'La pendiente de la gráfica L del cobre contra √t es…',ans:1.2,tol:0.1,u:'cm/min^½'}],
  retos:[{q:'¿Cuál es el mejor conductor del calor?',o:['Cobre','Vidrio','Madera','Plástico'],ok:0,why:'Es el de mayor k.'},{q:'Una varilla de vidrio sirve para…',o:['Aislar o agitar sin quemarse','Conducir calor muy rápido','Hacer imanes','Producir luz'],ok:0,why:'El vidrio conduce muy poco.'},{q:'En la conducción, el calor se transmite…',o:['Por contacto, sin transporte de materia','Por movimiento de la sustancia','Por luz','Por ondas de sonido'],ok:0,why:'Choques entre partículas vecinas.'}]},
 ana:['¿Por qué las ollas tienen mango de madera o plástico?','¿Qué pasaría con la distancia si se cuadruplica el tiempo?'],
 ev:[MC('Un buen aislante térmico es…',['Madera o vidrio','Cobre','Aluminio','Hierro'],0,'Tienen k pequeña.'),MC('La conducción ocurre principalmente en…',['Sólidos','Vacío','Gases enrarecidos','Luz'],0,'Sobre todo en sólidos, por contacto.'),MC('Si el tiempo se cuadruplica, la distancia alcanzada (∝ √t) se…',['Duplica','Cuadruplica','Reduce a la mitad','No cambia'],0,'√4 = 2.')],
 conc:'Explica qué es la conducción y qué materiales conducen mejor.',lim:'Modelo simplificado de difusión del calor con L ∝ √(k·t); se desprecian pérdidas al aire y el calor latente de la cera.'});

/* 9 */
add({c:'F06-009',n:'Corrientes de convección en líquidos',tema:'Calor · convección',dif:2,
 obj:'Observar el movimiento de un líquido por diferencias de temperatura y relacionar la rapidez de la corriente con la diferencia de temperatura.',comp:[C1,C2,C3],
 evid:['Explica por qué sube el líquido caliente.','Relaciona densidad y temperatura.','Calcula el tiempo de recorrido de la corriente.'],
 teo:'En la <b>convección</b> el calor se transporta con el movimiento del fluido. El agua caliente se dilata, es <b>menos densa</b> y sube; el agua fría es más densa y baja, formando una corriente circular. Cuanto mayor es la diferencia de temperatura ΔT, más rápida la corriente. Aquí se modela la rapidez como u = 0,03·ΔT (cm/s), una aproximación para el recipiente del experimento.',
 mat:['Recipiente de vidrio','Agua fría y caliente','Colorante vegetal','Termómetros y cronómetro'],
 cfg:{vis:'convec',vars:[rg('dT','Diferencia de temperatura ΔT','°C',10,60,5,30)],
  outs:[{id:'t',n:'Tiempo del colorante en recorrer 10 cm',u:'s'}],tabla:['dT','t'],
  fx:v=>{const u=0.03*v.dT;return{u,t:10/u,_res:{t:0.1},_sd:{t:0.2}}},
  graf:{x:'dT',y:'t',nx:'ΔT (°C)',ny:'t (s)',u:''},
  tareas:[{t:'valor',txt:'Con ΔT = 40 °C, ¿cuántos segundos tarda el colorante en recorrer 10 cm?',ans:8.33,tolA:0.7,u:'s'},{t:'valor',txt:'¿Cuál es la rapidez de la corriente (cm/s) con ΔT = 50 °C? (u = 10 cm ÷ t)',ans:1.5,tol:0.08,u:'cm/s'},{t:'tabla',txt:'Registra al menos 5 medidas con distintas diferencias de temperatura.',n:5}],
  retos:[{q:'El agua caliente sube porque…',o:['Es menos densa','Es más pesada','Tiene menos volumen','No tiene masa'],ok:0,why:'Al calentarse se dilata y su densidad baja.'},{q:'Si aumentas ΔT, el tiempo en recorrer 10 cm…',o:['Disminuye','Aumenta','Es el mismo','Se hace infinito'],ok:0,why:'La corriente es más rápida.'},{q:'La calefacción de una habitación calienta el aire por…',o:['Convección','Conducción en el vidrio','Radiación solar','Sonido'],ok:0,why:'El aire caliente sube y circula.'}]},
 ana:['¿Hacia dónde se mueve el colorante cerca del agua caliente? ¿Y cerca de la fría?','¿Por qué los aires acondicionados se ponen arriba y las estufas abajo?'],
 ev:[MC('La convección ocurre en…',['Fluidos (líquidos y gases)','Solo sólidos','El vacío','Solo metales'],0,'Necesita un fluido que se mueva.'),MC('El fluido caliente tiende a…',['Subir','Bajar','Quedarse quieto','Congelarse'],0,'Es menos denso.'),MC('Mayor ΔT implica corriente…',['Más rápida','Más lenta','Igual','Sin movimiento'],0,'Más diferencia de densidad.')],
 conc:'Explica cómo se forman las corrientes de convección.',lim:'Rapidez modelada como proporcional a ΔT; no simula turbulencia ni la forma exacta del recipiente.'});

/* 10 */
add({c:'F06-010',n:'Construcción de un termómetro casero',tema:'Calor · temperatura',dif:2,
 obj:'Calibrar un termómetro de alcohol y pitillo y hallar cuántos milímetros sube la columna por cada grado.',comp:[C1,C2,C3],
 evid:['Explica el principio de un termómetro de líquido.','Calcula la sensibilidad (mm por °C).','Usa la calibración para estimar una temperatura.'],
 teo:'Un termómetro de líquido funciona porque el líquido se <b>dilata</b> al calentarse y sube por un tubo delgado. Con una botella de volumen V₀ de alcohol (β ≈ 1,1×10⁻³ °C⁻¹) el volumen aumenta ΔV = β·V₀·ΔT. En un tubo de sección A la columna sube h = ΔV / A: <b>cuanto más fino el tubo, más sensible el termómetro</b>. Para usarlo se calibra con puntos conocidos (0 °C y 100 °C).',
 mat:['Botella con 5 mL de alcohol coloreado','Pitillos de 2, 3 y 4 mm','Hielo y agua caliente','Regla'],
 cfg:{vis:'termo',vars:[rg('T','Temperatura del agua','°C',0,100,5,0),sel('d','Diámetro del tubo',[[2,'2 mm'],[3,'3 mm'],[4,'4 mm']])],
  outs:[{id:'h',n:'Altura de la columna',u:'mm'}],tabla:['d','T','h'],
  fx:v=>{const A=Math.PI*(+v.d)**2/4,h=5000*1.1e-3*v.T/A;return{h,_frac:h/200,_res:{h:0.5},_sd:{h:0.3}}},
  graf:{x:'T',y:'h',nx:'T (°C)',ny:'h (mm)',origen:true,u:'mm/°C'},
  tareas:[{t:'valor',txt:'Con el tubo de 3 mm, ¿cuántos mm sube la columna por cada °C? (pendiente de la gráfica h–T; mide solo con el tubo de 3 mm)',ans:0.778,tol:0.08,u:'mm/°C'},{t:'valor',txt:'Con el tubo de 3 mm, la columna marca 39 mm sobre el nivel de 0 °C. ¿Qué temperatura (°C) hay?',ans:50.1,tol:0.06,u:'°C'},{t:'tabla',txt:'Registra al menos 6 medidas.',n:6}],
  retos:[{q:'Un tubo más delgado hace que el termómetro sea…',o:['Más sensible','Menos sensible','Igual','Inservible'],ok:0,why:'La misma dilatación sube más en un tubo estrecho.'},{q:'Los puntos fijos para calibrar son…',o:['Fusión del hielo (0 °C) y ebullición del agua (100 °C)','Temperatura ambiente y corporal','Solo 37 °C','Ninguno'],ok:0,why:'Son estables y reproducibles.'},{q:'Un termómetro de líquido funciona por…',o:['Dilatación del líquido','Presión del aire','Magnetismo','Luz'],ok:0,why:'El líquido se dilata al calentarse.'}]},
 ana:['¿Qué ventaja y qué desventaja tiene un tubo muy fino?','¿Por qué hay que calibrar el termómetro antes de usarlo?'],
 ev:[MC('Al aumentar la temperatura, el alcohol del termómetro…',['Se dilata y sube','Se contrae','Se evapora siempre','Cambia de color'],0,'Aumenta su volumen.'),MC('La sensibilidad se mide en…',['mm por °C','°C por mm','g por mL','N por m'],0,'Cuánto sube por cada grado.'),MC('Para el mismo cambio de volumen, un tubo de menor diámetro da una columna…',['Más alta','Más baja','Igual','Sin altura'],0,'h = ΔV/A, con A menor.')],
 conc:'Explica cómo funciona y cómo se calibra tu termómetro casero.',lim:'Se desprecia la dilatación de la botella y del tubo; coeficiente β constante en 0–100 °C.'});

/* 11 */
const TR={lana:['Lana',12],seda:['Seda',7],algodon:['Algodón',2],cuero:['Cuero',9]};
add({c:'F06-011',n:'Electricidad estática con globos',tema:'Electricidad · cargas',dif:1,
 obj:'Cargar un globo por frotamiento con distintos materiales, medir su carga y observar la atracción de papelitos.',comp:[C1,C2,C3],
 evid:['Explica la carga por frotamiento.','Ordena materiales según cuánta carga transfieren.','Reconoce que la carga se acumula hasta un máximo.'],
 teo:'Al frotar dos materiales se transfieren <b>electrones</b> de uno a otro: uno queda con carga positiva y el otro negativa (serie triboeléctrica). Un globo frotado con lana queda cargado negativamente y atrae objetos neutros livianos, como papelitos, por <b>polarización</b>. Cargas iguales se repelen y opuestas se atraen. La carga crece con los frotamientos hasta un valor máximo: q = q_máx·(1 − e^(−n/8)).',
 mat:['Globo','Lana, seda, algodón y cuero','Papelitos','Medidor de carga (0,1 nC)'],
 cfg:{vis:'carga',vars:[sel('mat','Material para frotar',Object.entries(TR).map(([k,x])=>[k,x[0]])),rg('n','Número de frotamientos','',0,30,1,0)],
  outs:[{id:'q',n:'Carga del globo',u:'nC'}],tabla:['mat','n','q'],
  fx:v=>{const q=-TR[v.mat][1]*(1-Math.exp(-v.n/8));return{q,F:Math.abs(q)/4,_res:{q:0.1},_sd:{q:0.15}}},
  tareas:[{t:'valor',txt:'Con LANA y 15 frotamientos, ¿cuál es la carga del globo (nC, con signo)?',ans:-10.15,tol:0.08,u:'nC'},{t:'meta',txt:'Con LANA, carga el globo hasta que atraiga al menos 8 papelitos (carga de 7,5 nC o más en valor absoluto).',check:(v,o)=>({ok:v.mat==='lana'&&Math.abs(o.q)>=7.5,msg:(v.mat==='lana'&&Math.abs(o.q)>=7.5)?'¡Lo lograste! Carga de '+fm(o.q,1)+' nC.':'Usa lana y aumenta los frotamientos.'})},{t:'tabla',txt:'Registra al menos 6 medidas con distintos materiales.',n:6}],
  retos:[{q:'Un globo frotado con lana adquiere carga…',o:['Negativa','Positiva','Neutra','Magnética'],ok:0,why:'Recibe electrones.'},{q:'Cargas iguales…',o:['Se repelen','Se atraen','No interactúan','Se anulan sin contacto'],ok:0,why:'Ley de cargas.'},{q:'El globo atrae papelitos neutros porque…',o:['Los polariza','Los imanta','Los calienta','Tiene pegamento'],ok:0,why:'Induce una separación de cargas en ellos.'}]},
 ana:['¿Por qué la carga deja de aumentar después de muchos frotamientos?','¿Qué material transfirió menos carga? ¿Cómo lo sabes?'],
 ev:[MC('Al frotar se transfieren…',['Electrones','Protones','Neutrones','Átomos completos'],0,'Los electrones son los que se mueven.'),MC('Un cuerpo con exceso de electrones está…',['Cargado negativamente','Cargado positivamente','Neutro','Sin masa'],0,'Los electrones tienen carga negativa.'),MC('Cargas opuestas…',['Se atraen','Se repelen','No se ven','Se mezclan'],0,'Ley de las cargas.')],
 conc:'Explica cómo se carga un cuerpo por frotamiento.',lim:'Modelo de saturación exponencial con valores de carga ilustrativos; no incluye humedad ni descarga por el aire.'});

/* 12 */
add({c:'F06-012',n:'Construcción de un electroscopio sencillo',tema:'Electricidad · detección de cargas',dif:2,
 obj:'Usar un electroscopio de hojas de aluminio para detectar y comparar cargas por el ángulo que se separan las hojas.',comp:[C1,C2,C3],
 evid:['Explica por qué se separan las hojas.','Relaciona ángulo y carga.','Interpreta el electroscopio como detector, no como medidor exacto.'],
 teo:'Un <b>electroscopio</b> tiene dos hojas metálicas ligeras unidas a una varilla. Al acercar o tocar con un cuerpo cargado, las hojas adquieren la misma carga y se <b>repelen</b>: se abren. Cuanta más carga, mayor ángulo. El signo de la carga no se ve por el ángulo; se averigua con una carga conocida. Aquí θ ≈ 12°·√|q| (q en nC) como modelo ilustrativo.',
 mat:['Frasco de vidrio','Alambre y papel aluminio','Globo cargado'],
 cfg:{vis:'electroscopio',vars:[rg('q','Carga entregada','nC',-10,10,0.5,0)],
  outs:[{id:'th',n:'Ángulo entre cada hoja y la vertical',u:'°'}],tabla:['q','th'],
  fx:v=>({th:Math.min(75,12*Math.sqrt(Math.abs(v.q))),_res:{th:1},_sd:{th:0.8}}),
  graf:{x:'q',y:'th',fx:q=>Math.sqrt(Math.abs(q)),nx:'√|q| (nC^½)',ny:'θ (°)',origen:true,u:'°/nC^½'},
  tareas:[{t:'valor',txt:'Con q = 4 nC, ¿qué ángulo (°) marcan las hojas?',ans:24,tol:0.1,u:'°'},{t:'meta',txt:'Logra que las hojas se separen 30° o más con una carga NEGATIVA.',check:(v,o)=>({ok:v.q<0&&o.th>=29,msg:(v.q<0&&o.th>=29)?'Ángulo de '+fm(o.th,0)+'°.':'Usa carga negativa y aumenta su valor absoluto.'})},{t:'valor',txt:'La pendiente de la gráfica θ contra √|q| es…',ans:12,tol:0.1,u:'°/nC^½'}],
  retos:[{q:'Las hojas del electroscopio se separan porque…',o:['Tienen cargas del mismo signo','Tienen cargas opuestas','Están calientes','Se imantan'],ok:0,why:'Se repelen.'},{q:'Con más carga, el ángulo…',o:['Aumenta','Disminuye','Es el mismo','Es cero'],ok:0,why:'Mayor repulsión.'},{q:'Un electroscopio sin carga tiene las hojas…',o:['Juntas','Abiertas','Rojas','Caídas'],ok:0,why:'Sin carga no hay repulsión.'}]},
 ana:['¿Puede el electroscopio indicar el signo de la carga por sí solo? ¿Cómo lo averiguarías?','¿Por qué las hojas deben ser de un material muy liviano?'],
 ev:[MC('El electroscopio detecta…',['Presencia de carga eléctrica','Temperatura','Masa','Sonido'],0,'Por la separación de sus hojas.'),MC('Si acercas un cuerpo muy cargado, las hojas…',['Se abren más','Se cierran','No se mueven','Se queman'],0,'Mayor carga, mayor repulsión.'),MC('La separación de las hojas se debe a…',['Repulsión entre cargas iguales','Gravedad','Magnetismo','Viento'],0,'Ley de cargas.')],
 conc:'Explica cómo funciona el electroscopio y qué indica el ángulo.',lim:'Modelo ilustrativo θ ∝ √|q|; no incluye la geometría real del frasco ni la fuga de carga por humedad.'});

/* 13 */
const IM={imop:['Otro imán (polos opuestos)',600,'#2563eb'],imig:['Otro imán (polos iguales)',-600,'#ef4444'],fe:['Clip de hierro',150,'#94a3b8'],ni:['Moneda con níquel',90,'#cbd5e1'],cu:['Moneda de cobre',0,'#c2410c'],al:['Papel de aluminio',0,'#e2e8f0']};
add({c:'F06-013',n:'Propiedades de los imanes',tema:'Magnetismo · imanes',dif:1,
 obj:'Identificar polos, atracción y repulsión, y qué materiales son atraídos por un imán; medir cómo cae la fuerza con la distancia.',comp:[C1,C2,C3],
 evid:['Distingue polos iguales y opuestos.','Clasifica materiales en ferromagnéticos y no magnéticos.','Describe cómo decrece la fuerza con la distancia (F ≈ k/d²).'],
 teo:'Todo imán tiene dos <b>polos</b>, norte y sur. Polos iguales se <b>repelen</b> y polos opuestos se <b>atraen</b>. Los imanes atraen materiales <b>ferromagnéticos</b> (hierro, níquel, cobalto) pero no cobre, aluminio, plástico o papel. La fuerza disminuye rápido con la distancia; en este modelo F = k/d² (d en cm, F en mN).',
 mat:['Imán de barra','Clip de hierro, moneda con níquel, moneda de cobre, aluminio','Dinamómetro sensible (0,1 mN)'],
 cfg:{vis:'iman',vars:[sel('mat','Objeto',Object.entries(IM).map(([k,x])=>[k,x[0]])),rg('d','Distancia al imán','cm',1,15,0.5,5)],
  outs:[{id:'F',n:'Fuerza (+ atrae, − repele)',u:'mN'}],tabla:['mat','d','F'],
  fx:v=>{const o=IM[v.mat],F=o[1]/(v.d*v.d);return{F,_res:{F:0.1},_sd:{F:Math.abs(F)*0.02+0.03},_c:o[2],_n:o[0]}},
  graf:{x:'d',y:'F',fx:d=>1/(d*d),nx:'1/d² (cm⁻²)',ny:'F (mN)',origen:true,u:'mN·cm²'},
  tareas:[{t:'valor',txt:'Con OTRO IMÁN (polos opuestos) a 4 cm, ¿cuánta fuerza hay (mN)?',ans:37.5,tol:0.06,u:'mN'},{t:'valor',txt:'Con OTRO IMÁN (polos iguales) a 5 cm, ¿cuál es la fuerza (mN, con signo negativo si repele)?',ans:-24,tol:0.06,u:'mN'},{t:'tabla',txt:'Prueba todos los objetos: al menos 6 medidas.',n:6}],
  retos:[{q:'Polos iguales…',o:['Se repelen','Se atraen','No interactúan','Se funden'],ok:0,why:'Norte con norte o sur con sur se repelen.'},{q:'¿Cuál de estos NO es atraído por un imán?',o:['Cobre','Hierro','Níquel','Acero'],ok:0,why:'El cobre no es ferromagnético.'},{q:'Si duplicas la distancia, la fuerza (F ∝ 1/d²) se…',o:['Reduce a la cuarta parte','Reduce a la mitad','Duplica','No cambia'],ok:0,why:'1/2² = 1/4.'}]},
 ana:['¿Qué tienen en común los materiales atraídos por el imán?','¿Qué ocurre con la fuerza al alejar el objeto?'],
 ev:[MC('Un imán atrae…',['Hierro','Madera','Vidrio','Aluminio'],0,'El hierro es ferromagnético.'),MC('Si partes un imán en dos…',['Cada trozo tiene dos polos','Quedan polos separados','Pierde sus polos','Se vuelve de hierro'],0,'No existen monopolos magnéticos aislados.'),MC('La fuerza magnética con la distancia…',['Disminuye','Aumenta','No cambia','Se vuelve eléctrica'],0,'Es más fuerte cerca del imán.')],
 conc:'Resume las propiedades de los imanes que comprobaste.',lim:'Interacción simplificada F = k/d² (no es exacta para imanes reales a corta distancia); constantes ilustrativas.'});

/* 14 */
const TI={barra:['Imán de barra',500],her:['Imán de herradura',900]};
add({c:'F06-014',n:'Visualización de líneas de campo magnético',tema:'Magnetismo · campo magnético',dif:2,
 obj:'Representar las líneas de campo de un imán y medir cómo disminuye la intensidad del campo con la distancia.',comp:[C1,C2,C3],
 evid:['Describe el recorrido de las líneas de campo (de N a S por fuera).','Relaciona la densidad de líneas con la intensidad.','Calcula la constante del campo a partir de datos.'],
 teo:'El <b>campo magnético</b> es la región donde un imán ejerce fuerza. Se representa con <b>líneas de campo</b> que salen del polo norte y entran al sur; donde están más juntas el campo es más intenso. Las limaduras de hierro se alinean con las líneas. A lo largo del eje de un imán de barra el campo cae aproximadamente como B = k/r³ (B en mT, r en cm).',
 mat:['Limaduras de hierro y papel','Imán de barra y de herradura','Magnetómetro (0,01 mT)'],
 cfg:{vis:'campo',vars:[sel('tipo','Imán',Object.entries(TI).map(([k,x])=>[k,x[0]])),rg('r','Distancia al polo','cm',2,14,1,4)],
  outs:[{id:'B',n:'Campo B',u:'mT'}],tabla:['tipo','r','B'],
  fx:v=>{const B=TI[v.tipo][1]/v.r**3;return{B,_res:{B:0.01},_sd:{B:B*0.015+0.005}}},
  graf:{x:'r',y:'B',fx:r=>1/r**3,nx:'1/r³ (cm⁻³)',ny:'B (mT)',origen:true,u:'mT·cm³'},
  tareas:[{t:'valor',txt:'Con el imán de BARRA, ¿cuál es el campo B (mT) a 5 cm?',ans:4,tol:0.08,u:'mT'},{t:'valor',txt:'Constante del imán de barra, k = B·r³ (mT·cm³). Calcúlala con tus datos.',ans:500,tol:0.1,u:'mT·cm³'},{t:'tabla',txt:'Registra al menos 6 medidas.',n:6}],
  retos:[{q:'Las líneas de campo fuera del imán van…',o:['Del polo norte al sur','Del sur al norte','En círculos sin dirección','Solo hacia arriba'],ok:0,why:'Convención: salen del N y entran al S.'},{q:'Donde las líneas están más juntas, el campo es…',o:['Más intenso','Más débil','Cero','Igual'],ok:0,why:'Mayor densidad de líneas = mayor intensidad.'},{q:'Al duplicar la distancia en el eje, B (∝ 1/r³) se…',o:['Reduce 8 veces','Reduce 2 veces','Reduce 4 veces','Duplica'],ok:0,why:'(1/2)³ = 1/8.'}]},
 ana:['¿Por qué las limaduras forman curvas y no puntos?','¿En qué zona del imán el campo es más intenso?'],
 ev:[MC('Las líneas de campo nunca…',['Se cruzan','Salen del imán','Son curvas','Son más densas en los polos'],0,'Cada punto tiene una sola dirección de campo.'),MC('Las limaduras de hierro sirven para…',['Visualizar el campo','Medir masa','Calentar','Producir luz'],0,'Se alinean con las líneas.'),MC('El campo es más intenso en…',['Los polos','El centro lejos del imán','El aire','El vacío lejos del imán'],0,'Las líneas se concentran en los polos.')],
 conc:'Explica cómo se ve el campo de un imán y cómo cambia con la distancia.',lim:'Ley B = k/r³ sobre el eje (aproximación de dipolo); no se calcula el campo fuera del eje.'});

/* 15 */
const AG={ac:['Aguja de acero',1],al:['Aguja de aluminio',0],cu:['Aguja de cobre',0]};
add({c:'F06-015',n:'Construcción de una brújula casera',tema:'Magnetismo · campo terrestre',dif:2,
 obj:'Magnetizar una aguja frotándola con un imán y comprobar que, flotando, se orienta con el campo magnético terrestre.',comp:[C1,C2,C3],
 evid:['Explica por qué la aguja se orienta al norte.','Reconoce que solo algunos materiales se magnetizan.','Relaciona magnetización y número de frotamientos.'],
 teo:'La Tierra se comporta como un enorme imán: su campo orienta una aguja imantada de modo que un extremo apunta al <b>norte geográfico</b> (aproximadamente). Al frotar una aguja de <b>acero</b> siempre en el mismo sentido con un polo del imán, sus dominios magnéticos se alinean y queda magnetizada. El aluminio y el cobre no se magnetizan. En el modelo, la desviación respecto del norte es 55°·e^(−n/10).',
 mat:['Aguja de coser (acero)','Imán','Recipiente con agua y un corcho o papel'],
 cfg:{vis:'brujula',vars:[sel('ag','Aguja',Object.entries(AG).map(([k,x])=>[k,x[0]])),rg('n','Frotamientos con el imán','',0,40,2,0)],
  outs:[{id:'err',n:'Desviación del norte',u:'°'}],tabla:['ag','n','err'],
  fx:v=>{const M=AG[v.ag][1]*(1-Math.exp(-v.n/10));return{err:55*(1-M),_res:{err:1},_sd:{err:0.7}}},
  tareas:[{t:'valor',txt:'Con la aguja de ACERO y 10 frotamientos, ¿cuántos grados se desvía del norte?',ans:20.2,tol:0.12,u:'°'},{t:'meta',txt:'Magnetiza la aguja de acero hasta que apunte al norte con una desviación de 5° o menos.',check:(v,o)=>({ok:v.ag==='ac'&&o.err<=5,msg:(v.ag==='ac'&&o.err<=5)?'¡Brújula lista con '+v.n+' frotamientos!':'Usa la aguja de acero y aumenta los frotamientos.'})},{t:'tabla',txt:'Registra al menos 6 medidas con distintos materiales y frotamientos.',n:6}],
  retos:[{q:'La aguja de la brújula se orienta porque…',o:['La Tierra tiene un campo magnético','El agua la empuja','El Sol la atrae','Tiene motor'],ok:0,why:'Se alinea con el campo terrestre.'},{q:'¿Qué aguja no se magnetiza?',o:['La de aluminio','La de acero','La de hierro','La de níquel'],ok:0,why:'El aluminio no es ferromagnético.'},{q:'Para magnetizar la aguja hay que frotarla…',o:['Siempre en el mismo sentido','En ambos sentidos','Sin moverla','Calentándola mucho'],ok:0,why:'Así se alinean los dominios magnéticos.'}]},
 ana:['¿Qué pasaría si frotaras la aguja en los dos sentidos?','¿Por qué el norte de la brújula apunta hacia el norte geográfico?'],
 ev:[MC('Una brújula señala…',['La dirección del campo magnético terrestre','El Sol','La Luna','El viento'],0,'Se alinea con el campo.'),MC('Un material que se magnetiza fácilmente es…',['Acero','Plástico','Vidrio','Cobre'],0,'Ferromagnético.'),MC('Un imán cerca de una brújula…',['Desvía la aguja','No la afecta','La enfría','La detiene siempre'],0,'Su campo supera al terrestre.')],
 conc:'Explica cómo construyes una brújula casera y por qué funciona.',lim:'La desviación se modela con una exponencial decreciente; no incluye la declinación magnética local ni el rozamiento con el agua.'});

return L;})();
