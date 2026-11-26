/* AULA360 — Catálogo de Física · SÉPTIMO (laboratorios 16–30 del inventario): fuerzas, máquinas simples y fluidos. */
window.FIS_G7=(function(){
const L=[];
const fm=(v,d)=>(+v).toFixed(d).replace('.',',');
const C1='Uso comprensivo del conocimiento científico',C2='Explicación de fenómenos',C3='Indagación';
const PV='Por verificar con los DBA oficiales del MEN (no se inventan códigos).',EST='Por verificar con los Estándares Básicos de Competencias del MEN.';
const MC=(q,o,ok,fb)=>({q,o,ok,fb});
const add=o=>{o.g=7;o.dba=PV;o.est=EST;o.area='Física';o.mot='banco';o.no=+o.c.slice(-3)+15;
 if(!o.proc){const k=(o.cfg.tareas||[]).length;o.proc=[{t:'Cambia los controles y observa el dibujo.',a:'cambia',n:3}];if(!o.cfg.sinMedir)o.proc.push({t:'Mide y registra al menos 5 datos en la tabla.',a:'mide',n:5});if(k)o.proc.push({t:'Completa las tareas (comprueba cada una).',a:'tarea_ok',n:k});o.proc.push({t:'Resuelve los retos.',a:'todo_ok'})}
 L.push(o)};
const sel=(id,n,opts)=>({id,n,tipo:'sel',opts});
const rg=(id,n,u,min,max,step,v)=>({id,n,u,min,max,step,v});
const G=9.8;

/* 16 */
const KS=[[10,'Resorte blando (10 N/m)'],[25,'Resorte medio (25 N/m)'],[50,'Resorte rígido (50 N/m)']];
add({c:'F07-001',n:'Construcción y calibración de un dinamómetro',tema:'Fuerzas · ley de Hooke',dif:2,
 obj:'Calibrar un resorte con pesas conocidas para medir fuerzas en newtons y hallar su constante elástica.',comp:[C1,C2,C3],
 evid:['Calcula el peso F = m·g en newtons.','Obtiene la constante k a partir de la pendiente.','Usa la calibración para medir una fuerza desconocida.'],
 teo:'Un resorte se estira de forma proporcional a la fuerza que lo estira (<b>ley de Hooke</b>): <b>F = k · x</b>. La constante k (N/m) mide qué tan rígido es. El peso de una masa es <b>F = m·g</b> con g ≈ 9,8 N/kg (m en kg). Al colgar pesas conocidas y medir el estiramiento se construye la escala de un <b>dinamómetro</b>. En una gráfica de x contra F la pendiente es 1/k.',
 mat:['Resortes de distinta rigidez','Pesas de 50 g a 300 g','Regla en cm'],
 cfg:{vis:'resorte',vars:[sel('k','Resorte',KS),rg('m','Masa colgada','g',0,300,50,100)],
  outs:[{id:'x',n:'Estiramiento x',u:'cm'}],tabla:['k','m','x'],
  fx:v=>{const F=v.m/1000*G,x=F/v.k*100;return{x,_len:30+x*4,_m:v.m,_res:{x:0.1},_sd:{x:0.05}}},
  graf:{x:'m',y:'x',fx:m=>m/1000*G,nx:'F = m·g (N)',ny:'x (cm)',origen:true,u:'cm/N'},
  tareas:[{t:'valor',txt:'Con el RESORTE MEDIO, mide varias masas y calcula su constante k (N/m). Recuerda: k = 100 ÷ pendiente (pendiente en cm/N).',ans:25,tol:0.08,u:'N/m',pista:'k = 100 ÷ pendiente de la gráfica'},{t:'valor',txt:'Con el resorte de 25 N/m, ¿qué fuerza (N) produce un estiramiento de 6 cm?',ans:1.5,tolA:0.06,u:'N',pista:'F = k·x con x en metros'},{t:'valor',txt:'Un resorte de 50 N/m se estira 8 cm al colgar un objeto. ¿Cuál es su masa (g)?',ans:408,tolA:10,u:'g',pista:'F = k·x y m = F/g'},{t:'tabla',txt:'Registra al menos 6 medidas.',n:6}],
  retos:[{q:'Si duplicas la fuerza sobre un resorte, el estiramiento…',o:['Se duplica','Se reduce a la mitad','No cambia','Se cuadruplica'],ok:0,why:'F = k·x: x es proporcional a F.'},{q:'El peso de una masa de 500 g es aproximadamente…',o:['4,9 N','500 N','0,5 N','49 N'],ok:0,why:'0,5 kg × 9,8 = 4,9 N.'},{q:'Un resorte más rígido tiene…',o:['Mayor k','Menor k','k = 0','Más masa'],ok:0,why:'Se estira menos con la misma fuerza.'}]},
 ana:['¿Qué forma tiene la gráfica x contra F? ¿Qué significa?','¿Qué pasaría con un resorte si lo estiras más allá de su límite elástico?'],
 ev:[MC('La ley de Hooke dice que…',['F = k·x','F = m·a','F = m/g','x = F·k'],0,'La fuerza es proporcional al estiramiento.'),MC('La constante k se mide en…',['N/m','N·m','kg','m/s'],0,'Newton por metro.'),MC('El dinamómetro mide…',['Fuerzas','Masas con balanza de platos','Temperatura','Tiempo'],0,'Mide fuerzas con la elongación de un resorte.')],
 conc:'Explica cómo calibraste el dinamómetro y qué te dice la pendiente.',lim:'Resorte ideal que cumple la ley de Hooke en todo el rango; se desprecian la masa del resorte y las oscilaciones.'});

/* 17 */
add({c:'F07-002',n:'Suma de fuerzas y equilibrio',tema:'Fuerzas · vectores',dif:3,
 obj:'Sumar fuerzas concurrentes con una mesa de fuerzas y hallar la tercera fuerza que equilibra un anillo.',comp:[C1,C2,C3],
 evid:['Descompone fuerzas en componentes.','Calcula la resultante de dos fuerzas.','Reconoce que en equilibrio la suma vectorial es cero.'],
 teo:'La fuerza es una <b>magnitud vectorial</b>: tiene valor, dirección y sentido. La <b>resultante</b> es la suma vectorial. Con ángulo θ medido desde el eje horizontal: F<sub>x</sub> = F·cos θ y F<sub>y</sub> = F·sen θ; la resultante tiene R<sub>x</sub> = ΣF<sub>x</sub>, R<sub>y</sub> = ΣF<sub>y</sub> y R = √(R<sub>x</sub>² + R<sub>y</sub>²). El anillo está en <b>equilibrio</b> si R = 0: la tercera fuerza es igual y opuesta a la suma de las otras dos.',
 mat:['Mesa de fuerzas con 3 poleas','Pesas calibradas','Transportador'],
 cfg:{vis:'fuerzas',vars:[rg('F1','Fuerza F₁','N',0,10,0.5,3),rg('a1','Ángulo de F₁','°',0,355,5,0),rg('F2','Fuerza F₂','N',0,10,0.5,4),rg('a2','Ángulo de F₂','°',0,355,5,90),rg('F3','Fuerza F₃','N',0,10,0.1,0),rg('a3','Ángulo de F₃','°',0,359,1,0)],
  outs:[{id:'R',n:'Resultante de las tres fuerzas',u:'N'}],tabla:['F1','a1','F2','a2','F3','a3','R'],
  fx:v=>{const r=a=>a*Math.PI/180,X=v.F1*Math.cos(r(v.a1))+v.F2*Math.cos(r(v.a2))+v.F3*Math.cos(r(v.a3)),Y=v.F1*Math.sin(r(v.a1))+v.F2*Math.sin(r(v.a2))+v.F3*Math.sin(r(v.a3));return{R:Math.hypot(X,Y),_res:{R:0.01},_sd:{R:0.01}}},
  tareas:[{t:'valor',txt:'Deja F₃ = 0. Con F₁ = 6 N a 0° y F₂ = 8 N a 90°, ¿cuál es la resultante (N)?',ans:10,tolA:0.15,u:'N'},{t:'meta',txt:'Con F₁ = 3 N a 0° y F₂ = 4 N a 90°, ajusta F₃ (valor y ángulo) hasta equilibrar el anillo (resultante menor que 0,2 N).',check:(v,o)=>{const ok=v.F1===3&&v.a1===0&&v.F2===4&&v.a2===90&&o.R<=0.2;return{ok,msg:ok?'¡Equilibrio! F₃ = '+fm(v.F3,1)+' N a '+v.a3+'° (valor esperado: 5 N a 233°).':'Pon F₁ = 3 N a 0° y F₂ = 4 N a 90°; F₃ debe ser igual y opuesta a su suma.'}}},{t:'meta',txt:'Con F₁ = 5 N a 0° y F₂ = 5 N a 120°, equilibra el anillo con F₃.',check:(v,o)=>{const ok=v.F1===5&&v.a1===0&&v.F2===5&&v.a2===120&&o.R<=0.2;return{ok,msg:ok?'¡Equilibrio! F₃ ≈ 5 N a 240°.':'Pon F₁ = 5 N a 0° y F₂ = 5 N a 120°.'}}}],
  retos:[{q:'Dos fuerzas de 6 N y 8 N perpendiculares tienen una resultante de…',o:['10 N','14 N','2 N','48 N'],ok:0,why:'√(6² + 8²) = 10 N.'},{q:'En equilibrio, la resultante de las fuerzas es…',o:['Cero','Máxima','Igual a la mayor','Igual al peso'],ok:0,why:'La suma vectorial es nula.'},{q:'Dos fuerzas iguales y opuestas sobre un cuerpo producen una resultante de…',o:['0 N','El doble','La mitad','Infinita'],ok:0,why:'Se anulan.'}]},
 ana:['¿Cómo calculas F₃ conociendo F₁ y F₂?','¿Por qué el ángulo de F₃ es casi opuesto al de la suma?'],
 ev:[MC('Una fuerza queda definida por…',['Valor, dirección y sentido','Solo su valor','Solo su dirección','Su color'],0,'Es un vector.'),MC('F·cos θ es la componente…',['Horizontal','Vertical','Total','Perpendicular al plano siempre'],0,'Con θ desde el eje horizontal.'),MC('Si R = 0 el anillo…',['Está en equilibrio','Acelera','Gira','Se rompe'],0,'No hay fuerza neta.')],
 conc:'Explica cómo comprobaste el equilibrio de tres fuerzas.',lim:'Fuerzas coplanares y concurrentes; sin rozamiento en las poleas ni peso del anillo.'});

/* 18 */
const SU={lija:['Lija',0.8,0.6,'#a16207'],madera:['Madera',0.5,0.35,'#d6b370'],vidrio:['Vidrio',0.3,0.2,'#bae6fd']};
add({c:'F07-003',n:'Tipos de fricción (estática y cinética)',tema:'Fuerzas · rozamiento',dif:2,
 obj:'Arrastrar un bloque sobre distintas superficies, hallar la fuerza mínima para moverlo y comparar la fricción estática con la cinética.',comp:[C1,C2,C3],
 evid:['Distingue fricción estática y cinética.','Calcula μ = f/N.','Compara superficies por su coeficiente de rozamiento.'],
 teo:'El <b>rozamiento</b> se opone al deslizamiento. Mientras el bloque no se mueve, la fricción <b>estática</b> iguala a la fuerza aplicada (hasta un máximo f<sub>s,máx</sub> = μ<sub>s</sub>·N). Una vez en movimiento actúa la fricción <b>cinética</b> f<sub>k</sub> = μ<sub>k</sub>·N, normalmente menor. En un plano horizontal N = m·g. Para hallar μ<sub>s</sub> se busca la mínima fuerza que inicia el movimiento: μ<sub>s</sub> = F<sub>mín</sub>/(m·g).',
 mat:['Bloque de madera de 0,5 a 2 kg','Superficies de lija, madera y vidrio','Dinamómetro'],
 cfg:{vis:'bloque',vars:[sel('sup','Superficie',Object.entries(SU).map(([k,x])=>[k,x[0]])),rg('m','Masa del bloque','kg',0.5,2,0.5,1),rg('F','Fuerza aplicada','N',0,20,0.5,0)],
  outs:[{id:'f',n:'Fuerza de rozamiento',u:'N'},{id:'a',n:'Aceleración',u:'m/s²'}],tabla:['sup','m','F','f','a'],
  fx:v=>{const s=SU[v.sup],N=v.m*G,fs=s[1]*N;let f,a;if(v.F<=fs){f=v.F;a=0}else{f=s[2]*N;a=(v.F-f)/v.m}return{f,a,_c:s[3],_res:{f:0.05,a:0.01},_sd:{f:0.02,a:a?0.02:0}}},
  tareas:[{t:'valor',txt:'Con MADERA y masa de 1 kg, aumenta la fuerza hasta que el bloque se mueva. Calcula μₛ = Fmín/(m·g).',ans:0.5,tol:0.12,u:'',pista:'Fmín es la menor fuerza con aceleración mayor que 0'},{t:'valor',txt:'Con VIDRIO y 1 kg, ¿cuál es la fuerza de fricción cinética (N) cuando el bloque ya se mueve?',ans:1.96,tolA:0.12,u:'N'},{t:'valor',txt:'Con LIJA y 1 kg en movimiento, calcula μₖ = f/(m·g).',ans:0.6,tol:0.08,u:''}],
  retos:[{q:'La fricción estática máxima es…',o:['Mayor que la cinética','Menor que la cinética','Siempre cero','Igual al peso'],ok:0,why:'Es más difícil iniciar el movimiento que mantenerlo.'},{q:'Si duplicas la masa del bloque, la fuerza de rozamiento…',o:['Se duplica','Se reduce a la mitad','No cambia','Se anula'],ok:0,why:'N = m·g crece al doble.'},{q:'Un bloque en reposo al que se le aplica una fuerza menor que la máxima tiene fricción…',o:['Igual a la fuerza aplicada','Cero','Igual a su peso','Infinita'],ok:0,why:'La fricción estática se ajusta a la fuerza aplicada.'}]},
 ana:['¿Por qué cuesta más empezar a empujar un mueble que mantenerlo en movimiento?','¿Qué superficie tiene el mayor coeficiente de rozamiento?'],
 ev:[MC('Si el bloque no se mueve, la fricción estática es…',['Igual a la fuerza aplicada','Siempre μ·N','Cero','Mayor que la fuerza aplicada'],0,'Equilibra a la fuerza.'),MC('μ = f / N es…',['Coeficiente de rozamiento','Aceleración','Densidad','Presión'],0,'Cociente entre fricción y normal.'),MC('En un plano horizontal, N =',['m·g','m/g','g/m','0'],0,'La normal iguala al peso.')],
 conc:'Explica la diferencia entre fricción estática y cinética y cómo hallaste μ.',lim:'Coeficientes constantes de referencia (valores aproximados); superficies planas, sin velocidad ni área de contacto.'});

/* 19 */
add({c:'F07-004',n:'Centro de gravedad en figuras irregulares',tema:'Fuerzas · equilibrio',dif:2,
 obj:'Encontrar el centro de gravedad de una figura de cartón irregular buscando el punto donde se equilibra horizontalmente.',comp:[C1,C2,C3],
 evid:['Define el centro de gravedad.','Localiza el punto de equilibrio por ensayo.','Relaciona el apoyo con la inclinación de la figura.'],
 teo:'El <b>centro de gravedad</b> es el punto donde se puede considerar aplicado todo el peso de un cuerpo. Una figura apoyada en ese punto queda en <b>equilibrio</b>; si se apoya en otro punto, el peso produce un giro y la figura se inclina. En la práctica se cuelga la figura de dos puntos distintos con una plomada: el centro de gravedad está en el cruce de las verticales.',
 mat:['Cartón irregular','Alfiler y plomada','Regla'],
 cfg:{vis:'cartulina',vars:[rg('x','Apoyo: posición x','cm',0,10,0.1,1),rg('y','Apoyo: posición y','cm',0,10,0.1,1)],
  outs:[{id:'th',n:'Inclinación de la figura',u:'°'}],tabla:['x','y','th'],
  fx:v=>{const d=Math.hypot(v.x-4.3,v.y-3.7);return{th:Math.min(45,9*d),_res:{th:0.1},_sd:{th:0.05}}},
  tareas:[{t:'meta',txt:'Encuentra el centro de gravedad: mueve el apoyo hasta que la inclinación sea 1° o menos.',check:(v,o)=>{const d=Math.hypot(v.x-4.3,v.y-3.7);return{ok:d<=0.12,msg:d<=0.12?'¡Equilibrio! Centro de gravedad en ('+fm(v.x,1)+'; '+fm(v.y,1)+').':'La figura aún se inclina ('+fm(Math.min(45,9*d),1)+'°). Sigue buscando.'}}},{t:'valor',txt:'¿Cuál es la coordenada x del centro de gravedad (cm)?',ans:4.3,tolA:0.15,u:'cm'},{t:'valor',txt:'¿Cuál es la coordenada y del centro de gravedad (cm)?',ans:3.7,tolA:0.15,u:'cm'}],
  retos:[{q:'El centro de gravedad es el punto donde…',o:['Se considera aplicado el peso','Está el color','El cuerpo es más caliente','El cuerpo es más duro'],ok:0,why:'Es el punto de aplicación del peso total.'},{q:'Un cuerpo apoyado en su centro de gravedad…',o:['Queda en equilibrio','Gira siempre','Cae','Se calienta'],ok:0,why:'El peso no produce giro.'},{q:'¿Puede el centro de gravedad estar fuera del cuerpo?',o:['Sí, por ejemplo en un anillo','Nunca','Solo en esferas','Solo en cubos'],ok:0,why:'En un aro está en el centro, que es aire.'}]},
 ana:['¿Cómo te diste cuenta de que te acercabas al centro de gravedad?','¿Por qué una plomada sirve para encontrarlo?'],
 ev:[MC('Una figura apoyada fuera de su centro de gravedad…',['Se inclina','Queda quieta','Flota','Cambia de color'],0,'El peso produce un giro.'),MC('La plomada indica…',['La vertical','La horizontal','El norte','El volumen'],0,'Apunta hacia el centro de la Tierra.'),MC('El centro de gravedad de un objeto simétrico y homogéneo está en…',['Su centro geométrico','Un borde','Fuera del objeto siempre','Su esquina'],0,'Coincide con su centro de simetría.')],
 conc:'Explica cómo encontraste el centro de gravedad de la figura.',lim:'Figura plana y homogénea; la inclinación se modela proporcional a la distancia entre el apoyo y el centro de gravedad.'});

/* 20 */
add({c:'F07-005',n:'Equilibrio de cuerpos y estabilidad',tema:'Fuerzas · estabilidad',dif:2,
 obj:'Hallar el ángulo crítico de inclinación a partir del cual una torre de bloques se vuelca, según su altura y la base de apoyo.',comp:[C1,C2,C3],
 evid:['Relaciona la altura del centro de gravedad con la estabilidad.','Explica el papel de la base de sustentación.','Predice el ángulo crítico.'],
 teo:'Un cuerpo es <b>estable</b> mientras la vertical que baja desde su centro de gravedad cae dentro de su base de apoyo. Al inclinar el plano, la torre se vuelca cuando esa vertical sale de la base: tan θ<sub>c</sub> = (b/2) / h<sub>cg</sub>, donde b es el ancho de la base y h<sub>cg</sub> la altura del centro de gravedad (para n bloques de 5 cm, h<sub>cg</sub> = 2,5·n cm). <b>Base más ancha y centro de gravedad más bajo = más estabilidad.</b>',
 mat:['Bloques de 5 cm de alto','Plano con ángulo ajustable','Bases de 10 y 20 cm'],
 cfg:{vis:'torrebloq',vars:[rg('n','Número de bloques','',1,8,1,4),sel('b','Ancho de la base',[[10,'10 cm'],[20,'20 cm']]),rg('ang','Inclinación del plano','°',0,80,1,0)],
  outs:[{id:'marg',n:'Margen de estabilidad (θc − θ)',u:'°'}],tabla:['n','b','ang','marg'],
  fx:v=>{const tc=Math.atan((+v.b/2)/(2.5*v.n))*180/Math.PI;return{marg:tc-v.ang,cae:v.ang>tc,_res:{marg:0.1},_sd:{marg:0.05}}},
  tareas:[{t:'valor',txt:'Torre de 4 bloques con base de 10 cm: ¿a qué ángulo crítico (°) se vuelca? (busca el primer ángulo donde cae)',ans:26.6,tolA:1.6,u:'°'},{t:'valor',txt:'Torre de 2 bloques con base de 20 cm: ¿ángulo crítico (°)?',ans:63.4,tolA:1.6,u:'°'},{t:'meta',txt:'Con base de 20 cm y 3 bloques inclina el plano a 50°: comprueba que la torre NO se cae.',check:(v,o)=>{const ok=+v.b===20&&v.n===3&&v.ang===50&&!o.cae;return{ok,msg:ok?'Estable: el centro de gravedad queda dentro de la base.':'Usa base de 20 cm, 3 bloques y 50° de inclinación.'}}}],
  retos:[{q:'Para hacer más estable un objeto conviene…',o:['Bajar su centro de gravedad','Subir su centro de gravedad','Estrechar la base','Hacerlo más alto'],ok:0,why:'Base ancha y centro bajo.'},{q:'Una torre se vuelca cuando la vertical del centro de gravedad…',o:['Sale de la base','Cae dentro de la base','Es cero','Coincide con la base'],ok:0,why:'Ese es el criterio de estabilidad.'},{q:'¿Cuál es más estable?',o:['Torre de 2 bloques con base ancha','Torre de 8 bloques con base angosta','Torre de 5 bloques con base angosta','Todas igual'],ok:0,why:'Menor altura y base mayor.'}]},
 ana:['¿Por qué un camión cargado alto se vuelca más fácil?','¿Qué cambia al duplicar el ancho de la base?'],
 ev:[MC('Un cuerpo es más estable cuando su centro de gravedad es…',['Más bajo','Más alto','Más caliente','Más ligero'],0,'Se necesita inclinar más para sacar la vertical de la base.'),MC('La base de sustentación es…',['La superficie de apoyo','El peso','El volumen','La altura'],0,'Es el área limitada por los apoyos.'),MC('Al inclinar un cuerpo, se vuelca si…',['La vertical del centro de gravedad cae fuera de la base','Cambia de color','Aumenta su masa','Se enfría'],0,'Criterio de vuelco.')],
 conc:'Explica de qué dependen el ángulo crítico y la estabilidad de un cuerpo.',lim:'Torre rígida de bloques homogéneos que se vuelca sin deslizar; sin rozamiento con el plano ni vibraciones.'});

/* 21 */
add({c:'F07-006',n:'Palancas de primer, segundo y tercer género',tema:'Máquinas simples · palancas',dif:2,
 obj:'Equilibrar una regla con pesas a distintas distancias y calcular la ventaja mecánica de una palanca.',comp:[C1,C2,C3],
 evid:['Aplica la ley de la palanca F₁·d₁ = F₂·d₂.','Calcula la ventaja mecánica.','Clasifica una palanca según la posición de fuerza, apoyo y resistencia.'],
 teo:'Una <b>palanca</b> es una barra que gira sobre un punto de apoyo. Está en equilibrio cuando los momentos son iguales: <b>m₁·d₁ = m₂·d₂</b> (o F₁·d₁ = F₂·d₂). La <b>ventaja mecánica</b> es VM = brazo de la fuerza ÷ brazo de la resistencia. Géneros: <b>1.º</b> apoyo en medio (balancín, tijeras); <b>2.º</b> resistencia en medio (carretilla); <b>3.º</b> fuerza en medio (pinzas, caña de pescar).',
 mat:['Regla de 100 cm con apoyo central','Pesas de 50 a 500 g','Monedas'],
 cfg:{vis:'palanca',vars:[rg('m1','Masa izquierda','g',50,500,50,200),rg('d1','Distancia izquierda','cm',5,50,5,30),rg('m2','Masa derecha','g',50,500,50,100),rg('d2','Distancia derecha','cm',5,50,5,30)],
  outs:[{id:'th',n:'Inclinación (+ baja la izquierda)',u:'°'}],tabla:['m1','d1','m2','d2','th'],
  fx:v=>{const t=v.m1*v.d1-v.m2*v.d2;return{th:Math.max(-20,Math.min(20,t/200)),_res:{th:0.1},_sd:{th:0.03}}},
  tareas:[{t:'meta',txt:'Deja 200 g a 30 cm a la izquierda y equilibra la regla con la masa derecha y su distancia (inclinación 0).',check:(v,o)=>{const ok=v.m1===200&&v.d1===30&&v.m1*v.d1===v.m2*v.d2;return{ok,msg:ok?'¡Equilibrio! '+v.m1+'·'+v.d1+' = '+v.m2+'·'+v.d2+'.':'Mantén 200 g a 30 cm a la izquierda y busca m₂·d₂ = 6000 g·cm.'}}},{t:'valor',txt:'Para levantar 600 g con un brazo de resistencia de 10 cm y un brazo de fuerza de 30 cm, ¿qué masa (g) necesitas aplicar?',ans:200,tolA:3,u:'g'},{t:'valor',txt:'Ventaja mecánica de una palanca con brazo de fuerza de 40 cm y brazo de resistencia de 10 cm.',ans:4,tolA:0.1,u:''}],
  retos:[{q:'En el equilibrio de una palanca se cumple…',o:['m₁·d₁ = m₂·d₂','m₁ + d₁ = m₂ + d₂','m₁/d₁ = m₂·d₂','d₁ = m₂'],ok:0,why:'Igualdad de momentos.'},{q:'Una carretilla es una palanca de…',o:['Segundo género','Primer género','Tercer género','Ningún género'],ok:0,why:'La carga queda entre el apoyo (rueda) y la fuerza.'},{q:'Una pinza para el hielo es una palanca de…',o:['Tercer género','Primer género','Segundo género','Ninguno'],ok:0,why:'La fuerza se aplica entre el apoyo y la resistencia.'}]},
 ana:['¿Qué ocurre si duplicas la distancia de una masa al apoyo?','¿Por qué un brazo de fuerza largo facilita levantar cargas?'],
 ev:[MC('Para equilibrar 300 g a 20 cm necesitas, a 10 cm del otro lado,…',['600 g','150 g','300 g','60 g'],0,'300·20 = 6000 = m·10 → 600 g.'),MC('La ventaja mecánica es…',['Brazo de fuerza ÷ brazo de resistencia','Masa ÷ distancia','Distancia ÷ masa','Peso × altura'],0,'Cociente de brazos.'),MC('Las tijeras son palancas de…',['Primer género','Segundo género','Tercer género','Ninguno'],0,'El apoyo está entre fuerza y resistencia.')],
 conc:'Explica la ley de la palanca y da un ejemplo cotidiano.',lim:'Regla de masa despreciable y apoyada en su centro; pesas puntuales; la inclinación es proporcional al momento neto.'});

/* 22 */
const PO=[[1,'Polea fija (VM = 1)'],[2,'Polea móvil (VM = 2)'],[4,'Polipasto con 2 poleas móviles (VM = 4)']];
add({c:'F07-007',n:'Sistemas de poleas (polipastos)',tema:'Máquinas simples · poleas',dif:2,
 obj:'Comparar la fuerza necesaria para levantar una carga con polea fija, móvil y polipasto, y la cuerda que se debe recoger.',comp:[C1,C2,C3],
 evid:['Calcula la fuerza necesaria F = W/VM.','Relaciona fuerza y recorrido de la cuerda.','Explica que las máquinas no ahorran trabajo.'],
 teo:'La <b>polea fija</b> solo cambia la dirección de la fuerza (VM = 1). La <b>polea móvil</b> reparte el peso entre dos tramos de cuerda: F = W/2 (VM = 2). Un <b>polipasto</b> combina poleas y reduce más la fuerza (con VM = 4, F = W/4). A cambio hay que <b>recoger más cuerda</b>: para subir la carga 1 m con VM = n se tira n metros. El trabajo (F·d) es el mismo: las máquinas simples <b>no ahorran trabajo</b>.',
 mat:['Poleas fija y móvil','Cuerda','Pesas de 1 a 10 kg','Dinamómetro'],
 cfg:{vis:'poleas',vars:[sel('tipo','Sistema',PO),rg('kg','Carga','kg',1,10,1,6)],
  outs:[{id:'F',n:'Fuerza necesaria',u:'N'},{id:'cuerda',n:'Cuerda que se recoge para subir 1 m',u:'m'}],tabla:['tipo','kg','F','cuerda'],
  fx:v=>{const n=+v.tipo;return{n,F:v.kg*G/n,cuerda:n,_res:{F:0.1,cuerda:0.01},_sd:{F:0.12,cuerda:0.01}}},
  tareas:[{t:'valor',txt:'Con la POLEA MÓVIL y una carga de 6 kg, ¿qué fuerza (N) hace falta?',ans:29.4,tolA:0.8,u:'N'},{t:'valor',txt:'Con el POLIPASTO (VM = 4) y 8 kg, ¿qué fuerza (N)?',ans:19.6,tolA:0.7,u:'N'},{t:'valor',txt:'Con VM = 4, ¿cuántos metros de cuerda debes recoger para subir la carga 1 m?',ans:4,tolA:0.15,u:'m'}],
  retos:[{q:'La polea fija sirve para…',o:['Cambiar la dirección de la fuerza','Reducir la fuerza a la mitad','Aumentar el peso','Ahorrar trabajo'],ok:0,why:'VM = 1.'},{q:'Con una polea móvil, para subir 1 m la carga se recogen…',o:['2 m de cuerda','1 m','0,5 m','4 m'],ok:0,why:'Mayor recorrido a cambio de menor fuerza.'},{q:'El trabajo realizado con un polipasto, comparado con levantar la carga a mano, es…',o:['El mismo (sin rozamiento)','Menor','Mayor siempre','Cero'],ok:0,why:'F·d se conserva.'}]},
 ana:['¿Qué ganas y qué pierdes al usar un polipasto?','¿Cómo se relaciona la fuerza con la longitud de cuerda recogida?'],
 ev:[MC('Con VM = 2 y carga de 100 N, la fuerza necesaria es…',['50 N','200 N','100 N','25 N'],0,'F = W/VM.'),MC('Las máquinas simples…',['No ahorran trabajo','Crean energía','Ahorran siempre trabajo','Disminuyen la masa'],0,'Solo cambian fuerza y recorrido.'),MC('Un polipasto con VM = 4 exige recoger…',['4 m de cuerda por metro subido','1 m','2 m','0,25 m'],0,'El recorrido aumenta en igual proporción que se reduce la fuerza.')],
 conc:'Explica cómo cambian la fuerza y la cuerda recogida con cada sistema de poleas.',lim:'Poleas y cuerda ideales (sin rozamiento ni masa); g = 9,8 N/kg.'});

/* 23 */
add({c:'F07-008',n:'El plano inclinado',tema:'Máquinas simples · plano inclinado',dif:2,
 obj:'Medir cómo cambia la fuerza para subir un carrito por una rampa según su ángulo y su masa.',comp:[C1,C2,C3],
 evid:['Calcula F = m·g·sen θ.','Interpreta la gráfica F contra sen θ.','Explica por qué una rampa suave requiere menos fuerza.'],
 teo:'En un plano inclinado sin rozamiento, la fuerza paralela a la rampa necesaria para sostener o subir a velocidad constante un cuerpo de masa m es <b>F = m·g·sen θ</b>. Cuanto menor es el ángulo, menor es la fuerza, pero la distancia a recorrer es mayor. En la gráfica F contra sen θ la <b>pendiente es el peso m·g</b>.',
 mat:['Rampa con ángulo ajustable','Carrito de 0,5 a 3 kg','Dinamómetro'],
 cfg:{vis:'plano',vars:[rg('ang','Ángulo de la rampa','°',0,60,5,30),rg('m','Masa del carrito','kg',0.5,3,0.5,2)],
  outs:[{id:'F',n:'Fuerza paralela a la rampa',u:'N'}],tabla:['ang','m','F'],
  fx:v=>{const F=v.m*G*Math.sin(v.ang*Math.PI/180);return{F,_res:{F:0.05},_sd:{F:0.03}}},
  graf:{x:'ang',y:'F',fx:a=>Math.sin(a*Math.PI/180),nx:'sen θ',ny:'F (N)',origen:true,u:'N'},
  tareas:[{t:'valor',txt:'Con 2 kg y 30°, ¿qué fuerza (N) se necesita?',ans:9.8,tol:0.06,u:'N'},{t:'valor',txt:'Con 2 kg, ¿a qué ángulo (°) la fuerza es la mitad del peso (peso = 19,6 N)?',ans:30,tolA:2,u:'°'},{t:'valor',txt:'Borra la tabla y mide solo con 1 kg y distintos ángulos. ¿Cuál es la pendiente de la gráfica F–sen θ (N)?',ans:9.8,tol:0.08,u:'N',pista:'es el peso de 1 kg'}],
  retos:[{q:'Una rampa menos inclinada requiere…',o:['Menos fuerza','Más fuerza','La misma fuerza','Fuerza infinita'],ok:0,why:'F = m·g·sen θ disminuye al reducir θ.'},{q:'A 90° la fuerza necesaria es…',o:['El peso completo','Cero','La mitad','El doble'],ok:0,why:'sen 90° = 1.'},{q:'La rampa permite…',o:['Menor fuerza a cambio de mayor distancia','Menos trabajo','Más energía','Menos masa'],ok:0,why:'No ahorra trabajo.'}]},
 ana:['¿Por qué las carreteras de montaña dan vueltas en lugar de subir derecho?','¿Qué significa la pendiente de la gráfica?'],
 ev:[MC('F = …',['m·g·sen θ','m·g·cos θ siempre','m/g','g·sen θ'],0,'Componente del peso paralela al plano.'),MC('A 0° la fuerza para sostener el carrito es…',['0 N','Su peso','La mitad del peso','Infinita'],0,'sen 0° = 0.'),MC('Si se duplica la masa, la fuerza…',['Se duplica','Se reduce','No cambia','Se cuadruplica'],0,'F es proporcional a m.')],
 conc:'Explica cómo depende la fuerza del ángulo y de la masa.',lim:'Plano sin rozamiento; carrito que sube a velocidad constante; g = 9,8 N/kg.'});

/* 24 */
add({c:'F07-009',n:'Presión en sólidos',tema:'Fluidos · presión',dif:2,
 obj:'Relacionar presión, fuerza y área con bloques sobre espuma y calcular p = F/A.',comp:[C1,C2,C3],
 evid:['Calcula la presión en pascales.','Explica por qué una punta fina penetra más.','Compara presiones con la misma fuerza y distinta área.'],
 teo:'La <b>presión</b> es la fuerza que actúa perpendicularmente por unidad de área: <b>p = F / A</b>. Se mide en pascales (Pa = N/m²); 1 kPa = 1000 Pa; 1 cm² = 0,0001 m². Con la misma fuerza, <b>a menor área mayor presión</b>: por eso un cuchillo afilado corta y unas raquetas de nieve evitan hundirse.',
 mat:['Bloques de 1 a 10 kg','Espuma o plastilina','Caras de 4, 25 y 100 cm²'],
 cfg:{vis:'presion',vars:[rg('m','Masa del bloque','kg',1,10,1,5),sel('A','Área de apoyo',[[4,'4 cm²'],[25,'25 cm²'],[100,'100 cm²']])],
  outs:[{id:'p',n:'Presión',u:'kPa'},{id:'hund',n:'Hundimiento en la espuma',u:'mm'}],tabla:['m','A','p','hund'],
  fx:v=>{const p=v.m*G/(+v.A*1e-4)/1000;return{p,hund:p/10,_res:{p:0.1,hund:0.1},_sd:{p:0.1,hund:0.05}}},
  tareas:[{t:'valor',txt:'Con 5 kg apoyados en la cara de 25 cm², ¿qué presión (kPa) ejercen?',ans:19.6,tol:0.04,u:'kPa'},{t:'valor',txt:'Con la misma masa, ¿cuántas veces mayor es la presión de la cara de 4 cm² que la de 100 cm²?',ans:25,tol:0.08,u:'veces'},{t:'valor',txt:'¿Cuánto se hunde (mm) un bloque de 10 kg sobre 4 cm²?',ans:24.5,tol:0.06,u:'mm'}],
  retos:[{q:'La unidad de presión en el SI es…',o:['Pascal','Newton','Joule','Watt'],ok:0,why:'1 Pa = 1 N/m².'},{q:'Con la misma fuerza, menor área implica…',o:['Mayor presión','Menor presión','Igual presión','Presión cero'],ok:0,why:'p = F/A.'},{q:'Los esquís son anchos para…',o:['Disminuir la presión sobre la nieve','Aumentar la presión','Pesar más','Decorar'],ok:0,why:'Reparten el peso en mayor área.'}]},
 ana:['¿Por qué un clavo se entierra con la punta y no con la cabeza?','¿Qué hiciste para disminuir el hundimiento sin cambiar la masa?'],
 ev:[MC('p = …',['F ÷ A','F × A','A ÷ F','F + A'],0,'Fuerza dividida por área.'),MC('2 N sobre 0,5 m² dan una presión de…',['4 Pa','1 Pa','0,25 Pa','2,5 Pa'],0,'2 ÷ 0,5 = 4 Pa.'),MC('Duplicar el área con la misma fuerza hace la presión…',['La mitad','El doble','Igual','Cuatro veces mayor'],0,'p es inversamente proporcional al área.')],
 conc:'Explica cómo dependen la presión y el hundimiento de la fuerza y del área.',lim:'Hundimiento modelado proporcional a la presión (espuma ideal); fuerza igual al peso del bloque con g = 9,8 N/kg.'});

/* 25 */
add({c:'F07-010',n:'Presión hidrostática y profundidad',tema:'Fluidos · presión hidrostática',dif:3,
 obj:'Medir la presión del agua a distintas profundidades y el alcance de los chorros de una botella perforada.',comp:[C1,C2,C3],
 evid:['Calcula p = ρ·g·h.','Relaciona profundidad y alcance del chorro.','Identifica el orificio de máximo alcance.'],
 teo:'La presión que ejerce un líquido en reposo a profundidad h es <b>p = ρ · g · h</b> (ρ = 1000 kg/m³ para el agua). Aumenta con la profundidad, por eso el chorro de un orificio más bajo sale con más rapidez. El alcance horizontal depende de la rapidez y de la altura de caída: <b>x = 2·√(h·y)</b>, donde h es la profundidad del orificio y y su altura sobre la mesa. Es máximo cuando el orificio está a media altura del nivel del agua (y = H/2).',
 mat:['Botella con agujeros','Agua','Cinta métrica'],
 cfg:{vis:'botella',vars:[rg('H','Nivel del agua','cm',20,40,5,30),rg('y','Altura del orificio','cm',5,25,5,15)],
  outs:[{id:'P',n:'Presión manométrica en el orificio',u:'kPa'},{id:'xr',n:'Alcance del chorro',u:'cm'}],tabla:['H','y','P','xr'],
  fx:v=>{const h=Math.max(0,v.H-v.y);return{h,P:0.098*h,xr:2*Math.sqrt(h*v.y),_res:{P:0.01,xr:0.5},_sd:{P:0.008,xr:0.3}}},
  tareas:[{t:'valor',txt:'¿Qué presión (kPa) hay a 15 cm de profundidad? (nivel 30 cm, orificio a 15 cm)',ans:1.47,tol:0.05,u:'kPa'},{t:'valor',txt:'Con el nivel en 30 cm, ¿cuál es el alcance máximo (cm) que consigues cambiando la altura del orificio?',ans:30,tolA:1.5,u:'cm'},{t:'valor',txt:'Con el nivel en 40 cm y el orificio a 20 cm, ¿qué alcance (cm) tiene el chorro?',ans:40,tolA:2,u:'cm'}],
  retos:[{q:'La presión de un líquido aumenta con…',o:['La profundidad','La altura sobre la superficie','El color','El volumen del recipiente solamente'],ok:0,why:'p = ρ·g·h.'},{q:'El chorro de mayor alcance sale por el orificio…',o:['A media altura del nivel del agua','Más alto','Más bajo','Todos igual'],ok:0,why:'x = 2√(h·y) es máximo con h = y.'},{q:'A 10 m de profundidad en agua la presión manométrica es cerca de…',o:['98 kPa','10 kPa','1 kPa','980 kPa'],ok:0,why:'1000·9,8·10 = 98 000 Pa.'}]},
 ana:['¿Por qué las presas son más gruesas en la base?','¿Qué ocurre con el alcance si el orificio está en la superficie? ¿Y en el fondo?'],
 ev:[MC('p = …',['ρ·g·h','ρ/h','g/h','ρ+g+h'],0,'Presión hidrostática.'),MC('La presión depende de la forma del recipiente…',['No, solo de la profundidad','Sí, siempre','Solo si es de vidrio','Solo si es angosto'],0,'Depende de ρ, g y h.'),MC('Un buzo siente más presión al…',['Descender','Ascender','Quedarse en la superficie','Aplaudir'],0,'Aumenta h.')],
 conc:'Explica cómo cambia la presión con la profundidad y cuál orificio tiene mayor alcance.',lim:'Líquido ideal sin viscosidad; salida sin pérdidas (teorema de Torricelli) y nivel constante durante la medida.'});

/* 26 */
const LI=[[1,'Agua (1,00 g/mL)'],[0.92,'Aceite (0,92 g/mL)'],[1.2,'Salmuera (1,20 g/mL)']];
add({c:'F07-011',n:'Vasos comunicantes',tema:'Fluidos · equilibrio de líquidos',dif:2,
 obj:'Comprobar que un mismo líquido alcanza el mismo nivel en vasos conectados y relacionar las alturas de dos líquidos distintos con sus densidades.',comp:[C1,C2,C3],
 evid:['Explica por qué el nivel es igual en vasos comunicantes.','Aplica ρ₁·h₁ = ρ₂·h₂.','Predice la altura de un líquido menos denso.'],
 teo:'En <b>vasos comunicantes</b> con un solo líquido, el nivel es el mismo en todos los recipientes, sin importar su forma: la presión a la misma profundidad debe ser igual. Con dos líquidos que no se mezclan en un tubo en U, las presiones en la superficie de separación son iguales: <b>ρ₁·h₁ = ρ₂·h₂</b>, es decir, el menos denso alcanza mayor altura.',
 mat:['Tubo en U','Agua, aceite y salmuera'],
 cfg:{vis:'tubou',vars:[rg('hw','Altura del agua','cm',5,20,1,10),sel('liq2','Líquido del otro lado',LI)],
  outs:[{id:'h2',n:'Altura del otro líquido',u:'cm'}],tabla:['hw','liq2','h2'],
  fx:v=>{const r=+v.liq2;return{h2:v.hw/r,_res:{h2:0.1},_sd:{h2:0.05},_n:(LI.find(x=>x[0]===r)||['','Líquido'])[1].split(' ')[0],_c:r===1?'rgba(56,189,248,.55)':r<1?'rgba(250,204,21,.6)':'rgba(167,139,250,.55)'}},
  tareas:[{t:'valor',txt:'Con agua a 10 cm, ¿qué altura (cm) alcanza el ACEITE en el otro lado?',ans:10.87,tolA:0.25,u:'cm'},{t:'valor',txt:'Con agua a 15 cm, ¿qué altura (cm) alcanza la SALMUERA?',ans:12.5,tolA:0.25,u:'cm'},{t:'valor',txt:'Si ambos lados tienen agua y el nivel de un lado es 12 cm, ¿cuál es la altura del otro (cm)?',ans:12,tolA:0.2,u:'cm'}],
  retos:[{q:'Con el mismo líquido en vasos comunicantes, el nivel…',o:['Es igual en todos','Es mayor en el más ancho','Es mayor en el más delgado','Depende de la forma'],ok:0,why:'La presión a igual profundidad es la misma.'},{q:'El líquido menos denso alcanza…',o:['Mayor altura','Menor altura','La misma altura','Altura cero'],ok:0,why:'ρ₁·h₁ = ρ₂·h₂.'},{q:'Un nivel de manguera sirve para…',o:['Marcar puntos a la misma altura','Medir temperatura','Pesar','Cortar'],ok:0,why:'Aprovecha que el nivel es igual en ambos extremos.'}]},
 ana:['¿Por qué importa que los dos líquidos no se mezclen?','¿Cómo usarías este principio para nivelar una pared?'],
 ev:[MC('ρ₁·h₁ = ρ₂·h₂ se cumple cuando…',['Las presiones en la superficie de separación son iguales','Los líquidos tienen igual volumen','Las temperaturas son distintas','Los tubos son del mismo ancho'],0,'Equilibrio de presiones.'),MC('Con agua (1,0) y aceite (0,92), el aceite alcanza una altura…',['Mayor','Menor','Igual','Cero'],0,'Menor densidad, mayor altura.'),MC('El nivel en vasos comunicantes con un solo líquido…',['Es el mismo','Cambia con la forma','Es mayor en el más grande','No existe'],0,'Mismo líquido, mismo nivel.')],
 conc:'Explica la relación entre las alturas y las densidades en vasos comunicantes.',lim:'Líquidos que no se mezclan, tubos anchos (sin capilaridad) y a la misma temperatura.'});

/* 27 */
add({c:'F07-012',n:'Principio de Pascal (prensa hidráulica)',tema:'Fluidos · Pascal',dif:3,
 obj:'Usar una prensa hidráulica con dos émbolos y calcular la fuerza que multiplica según la relación de áreas.',comp:[C1,C2,C3],
 evid:['Aplica F₂/A₂ = F₁/A₁.','Calcula la ventaja de la prensa.','Relaciona fuerza multiplicada y recorrido.'],
 teo:'<b>Principio de Pascal:</b> la presión aplicada a un fluido encerrado se transmite sin pérdida a todos sus puntos. En una prensa hidráulica p<sub>1</sub> = p<sub>2</sub>, entonces <b>F₂ = F₁ · (A₂/A₁) = F₁ · (D₂/D₁)²</b>. La fuerza se multiplica, pero el émbolo grande se desplaza menos: el volumen de líquido desplazado es el mismo (A₁·x₁ = A₂·x₂).',
 mat:['Dos jeringas de distinto diámetro','Manguera','Agua'],
 cfg:{vis:'prensa',vars:[sel('D1','Diámetro del émbolo pequeño',[[1,'1 cm'],[2,'2 cm']]),sel('D2','Diámetro del émbolo grande',[[4,'4 cm'],[6,'6 cm'],[8,'8 cm']]),rg('F1','Fuerza en el émbolo pequeño','N',1,120,1,10)],
  outs:[{id:'F2',n:'Fuerza en el émbolo grande',u:'N'},{id:'dx',n:'Subida del émbolo grande si el pequeño baja 10 cm',u:'cm'}],tabla:['D1','D2','F1','F2','dx'],
  fx:v=>{const r=(v.D2/v.D1)**2;return{F2:v.F1*r,dx:10/r,_res:{F2:0.1,dx:0.01},_sd:{F2:v.F1*r*0.008,dx:0.01}}},
  tareas:[{t:'valor',txt:'Con F₁ = 20 N, D₁ = 2 cm y D₂ = 8 cm, ¿cuánta fuerza (N) se obtiene en el émbolo grande?',ans:320,tol:0.04,u:'N'},{t:'valor',txt:'Con D₁ = 1 cm y D₂ = 4 cm, ¿cuánto sube (cm) el émbolo grande cuando el pequeño baja 10 cm?',ans:0.625,tolA:0.04,u:'cm'},{t:'valor',txt:'¿Qué fuerza F₁ (N) necesitas para levantar 1000 N con D₁ = 2 cm y D₂ = 6 cm?',ans:111,tolA:3,u:'N',pista:'F₁ = F₂ ÷ (D₂/D₁)²'}],
  retos:[{q:'El principio de Pascal dice que la presión en un fluido encerrado…',o:['Se transmite por igual a todos los puntos','Solo actúa en el émbolo','Se pierde','Aumenta sin límite'],ok:0,why:'Se transmite sin pérdida.'},{q:'Si el área del émbolo grande es 16 veces la del pequeño, la fuerza se multiplica por…',o:['16','4','32','1'],ok:0,why:'F₂/F₁ = A₂/A₁.'},{q:'A cambio de multiplicar la fuerza, el émbolo grande…',o:['Se mueve menos','Se mueve más','Se mueve igual','No se mueve'],ok:0,why:'Conservación del volumen desplazado.'}]},
 ana:['¿Qué ganas y qué pierdes con la prensa hidráulica?','¿Dónde se usa este principio en la vida diaria?'],
 ev:[MC('F₂ = …',['F₁·(A₂/A₁)','F₁·(A₁/A₂)','F₁ + A₂','F₁·A₁'],0,'Presiones iguales.'),MC('Los frenos hidráulicos usan…',['El principio de Pascal','La ley de Hooke','La dilatación','El efecto Doppler'],0,'Transmiten la presión por el líquido.'),MC('Si duplicas el diámetro del émbolo grande, la fuerza se multiplica por…',['4','2','8','1'],0,'El área crece con el cuadrado del diámetro.')],
 conc:'Explica cómo funciona una prensa hidráulica y qué relación hay entre fuerza y recorrido.',lim:'Fluido incompresible y sin fugas; se desprecian el rozamiento de los émbolos y el peso del líquido.'});

/* 28 */
const OA={al:['Cilindro de aluminio',2.70,'#cbd5e1'],fe:['Cilindro de hierro',7.87,'#475569'],cu:['Cilindro de cobre',8.96,'#c2410c']};
add({c:'F07-013',n:'Principio de Arquímedes y flotabilidad',tema:'Fluidos · empuje',dif:3,
 obj:'Medir el peso aparente de un cuerpo sumergido y calcular el empuje que recibe del líquido.',comp:[C1,C2,C3],
 evid:['Calcula el empuje E = ρ·g·V.','Relaciona peso aparente y empuje.','Compara el empuje en distintos líquidos.'],
 teo:'Un cuerpo sumergido en un fluido recibe un <b>empuje</b> hacia arriba igual al <b>peso del fluido desplazado</b> (Arquímedes): <b>E = ρ<sub>líquido</sub> · g · V<sub>sumergido</sub></b>. El dinamómetro marca el <b>peso aparente</b> = W − E. Si el empuje iguala al peso el cuerpo flota; en la salmuera (más densa) el empuje es mayor que en el agua.',
 mat:['Dinamómetro','Cilindros de 50 cm³ de aluminio, hierro y cobre','Vaso con agua, aceite o salmuera'],
 cfg:{vis:'dinamo',vars:[sel('obj','Cuerpo (50 cm³)',Object.entries(OA).map(([k,x])=>[k,x[0]])),sel('liq','Líquido',LI),rg('Vs','Volumen sumergido','cm³',0,50,5,0)],
  outs:[{id:'Wap',n:'Peso aparente',u:'N'}],tabla:['obj','liq','Vs','Wap'],
  fx:v=>{const o=OA[v.obj],W=o[1]*50*G/1000,E=+v.liq*v.Vs*G/1000;return{Wap:W-E,E,_c:o[2],_n:o[0],_res:{Wap:0.01},_sd:{Wap:0.008}}},
  tareas:[{t:'valor',txt:'Cilindro de ALUMINIO totalmente sumergido (50 cm³) en AGUA: ¿cuánto vale el empuje (N)? (E = peso en el aire − peso aparente; mide con Vs = 0 y con Vs = 50)',ans:0.49,tolA:0.03,u:'N'},{t:'valor',txt:'Cilindro de HIERRO totalmente sumergido en agua: ¿qué peso aparente marca (N)?',ans:3.366,tolA:0.04,u:'N'},{t:'valor',txt:'¿Cuántas veces mayor es el empuje en la SALMUERA que en el agua sobre el mismo cuerpo totalmente sumergido?',ans:1.2,tol:0.06,u:'veces'}],
  retos:[{q:'El empuje es igual a…',o:['El peso del fluido desplazado','El peso del cuerpo siempre','La masa del cuerpo','El volumen del cuerpo'],ok:0,why:'Principio de Arquímedes.'},{q:'El peso aparente de un cuerpo sumergido es…',o:['Menor que su peso real','Mayor que su peso real','Igual','Cero siempre'],ok:0,why:'W − E.'},{q:'Un cuerpo flota cuando…',o:['El empuje iguala a su peso','Su masa es cero','Está caliente','Es de metal'],ok:0,why:'Equilibrio entre peso y empuje.'}]},
 ana:['¿Por qué te sientes más liviano dentro de una piscina?','¿Qué ocurre con el empuje al sumergir solo la mitad del cuerpo?'],
 ev:[MC('E = …',['ρ·g·V','m·g','ρ/V','g/V'],0,'Peso del volumen de fluido desplazado.'),MC('Un cuerpo de 50 cm³ totalmente en agua recibe un empuje de cerca de…',['0,49 N','4,9 N','49 N','0,049 N'],0,'1·50·9,8/1000 = 0,49 N.'),MC('En un líquido más denso, el empuje es…',['Mayor','Menor','Igual','Cero'],0,'E es proporcional a la densidad.')],
 conc:'Explica cómo se relacionan peso real, peso aparente y empuje.',lim:'Cuerpos totalmente rígidos y líquido en reposo; se desprecia el empuje del aire.'});

/* 29 */
const TS=[[72,'Agua (72 mN/m)'],[30,'Agua con jabón (30 mN/m)'],[22,'Alcohol (22 mN/m)']];
add({c:'F07-014',n:'Tensión superficial del agua',tema:'Fluidos · tensión superficial',dif:2,
 obj:'Hallar la masa máxima de una aguja que puede flotar sobre distintos líquidos y mostrar el efecto del jabón.',comp:[C1,C2,C3],
 evid:['Explica la tensión superficial.','Calcula la fuerza máxima que sostiene una película.','Predice el efecto del jabón.'],
 teo:'Las moléculas de la superficie de un líquido son atraídas hacia el interior y forman una película elástica: la <b>tensión superficial γ</b> (agua ≈ 72 mN/m a 20 °C). Una aguja de longitud L puede flotar si su peso es menor que la fuerza de la película en sus dos lados: <b>m·g ≤ 2·γ·L</b>. El jabón reduce γ y la aguja se hunde.',
 mat:['Aguja de 3 cm','Agua, agua con jabón y alcohol','Balanza de miligramos'],
 cfg:{vis:'tension',vars:[sel('liq','Líquido',TS),rg('m','Masa de la aguja','mg',0,600,10,100)],
  outs:[{id:'marg',n:'Margen (fuerza de la película − peso)',u:'mN'}],tabla:['liq','m','marg'],
  fx:v=>{const fmax=2*(+v.liq)*0.03,peso=v.m*9.8e-3;return{marg:fmax-peso,fmax,peso,_res:{marg:0.01},_sd:{marg:0.004}}},
  tareas:[{t:'valor',txt:'¿Cuál es la masa máxima (mg) de la aguja que flota en AGUA? (la mayor masa con margen positivo)',ans:440,tolA:12,u:'mg'},{t:'valor',txt:'¿Y en AGUA CON JABÓN (mg)?',ans:184,tolA:12,u:'mg'},{t:'valor',txt:'¿Y en ALCOHOL (mg)?',ans:135,tolA:12,u:'mg'}],
  retos:[{q:'La tensión superficial se debe a…',o:['La atracción entre moléculas del líquido','La gravedad solamente','El aire','El color'],ok:0,why:'Fuerzas de cohesión.'},{q:'El jabón hace que la tensión superficial…',o:['Disminuya','Aumente','No cambie','Se vuelva cero siempre'],ok:0,why:'Por eso se rompe la película.'},{q:'Un insecto camina sobre el agua gracias a…',o:['La tensión superficial','El empuje de Arquímedes únicamente','El magnetismo','La presión del aire'],ok:0,why:'La película sostiene su peso.'}]},
 ana:['¿Por qué un clip flota con cuidado pero se hunde si lo dejas caer?','¿Qué pasaría con una gota de jabón en el centro de la película?'],
 ev:[MC('A mayor γ, la aguja que puede flotar es…',['Más pesada','Más liviana','Igual','Imposible'],0,'Fuerza máxima 2·γ·L.'),MC('La tensión superficial se mide en…',['N/m','N','kg','Pa·m³'],0,'Fuerza por unidad de longitud.'),MC('El alcohol, comparado con el agua, tiene tensión superficial…',['Menor','Mayor','Igual','Infinita'],0,'22 contra 72 mN/m.')],
 conc:'Explica qué es la tensión superficial y cómo la modificó el jabón.',lim:'Aguja larga de 3 cm, sin considerar el ángulo de contacto ni la deformación de la superficie.'});

/* 30 */
const CP=[['Agua',72,1000],['Alcohol',22,790]];
add({c:'F07-015',n:'Capilaridad en tubos y papel',tema:'Fluidos · capilaridad',dif:2,
 obj:'Medir el ascenso de líquidos en tubos delgados y relacionarlo con el diámetro del tubo.',comp:[C1,C2,C3],
 evid:['Explica el ascenso capilar.','Relaciona la altura con el inverso del diámetro.','Compara líquidos.'],
 teo:'En un tubo muy delgado, la adhesión del líquido a las paredes y la tensión superficial lo hacen subir. La altura es <b>h = 4·γ·cos θ / (ρ·g·d)</b> (d = diámetro). Cuanto <b>más estrecho el tubo</b>, mayor la altura: h es inversamente proporcional a d. Así sube el agua por las raíces y por una toalla de papel.',
 mat:['Tubos capilares de 0,5 a 3 mm','Agua coloreada y alcohol','Regla'],
 cfg:{vis:'capilar',vars:[rg('d','Diámetro del tubo','mm',0.5,3,0.25,1),sel('liq','Líquido',CP.map(x=>[x[0],x[0]]))],
  outs:[{id:'h',n:'Ascenso capilar (tubo elegido)',u:'mm'}],tabla:['liq','d','h'],
  fx:v=>{const c=CP.find(x=>x[0]===v.liq),h=4*c[1]*1e-3/(c[2]*G*v.d*1e-3)*1000;return{h,_res:{h:0.1},_sd:{h:h*0.01+0.05}}},
  graf:{x:'d',y:'h',fx:d=>1/d,nx:'1/d (mm⁻¹)',ny:'h (mm)',origen:true,u:'mm²'},
  tareas:[{t:'valor',txt:'Con AGUA y un tubo de 2 mm de diámetro, ¿cuántos mm asciende?',ans:14.7,tol:0.05,u:'mm'},{t:'valor',txt:'Para el agua, el producto h·d es constante. ¿Cuánto vale (mm²)? (usa tus medidas)',ans:29.4,tol:0.06,u:'mm²'},{t:'valor',txt:'Con ALCOHOL y un tubo de 1 mm, ¿cuántos mm asciende?',ans:11.4,tol:0.07,u:'mm'}],
  retos:[{q:'En un tubo más estrecho el líquido sube…',o:['Más','Menos','Igual','Nada'],ok:0,why:'h ∝ 1/d.'},{q:'La capilaridad permite que el agua suba…',o:['Por las raíces y el papel','Por el vacío','Por el viento','Solo en el mar'],ok:0,why:'Es el mismo fenómeno.'},{q:'Si duplicas el diámetro del tubo, la altura se…',o:['Reduce a la mitad','Duplica','Cuadruplica','No cambia'],ok:0,why:'h·d = constante.'}]},
 ana:['¿Por qué el agua sube en un tubo de vidrio muy fino?','¿Qué diferencia observas entre el agua y el alcohol?'],
 ev:[MC('La altura capilar es proporcional a…',['1/d','d','d²','No depende de d'],0,'h = 4γcosθ/(ρgd).'),MC('La toalla de papel absorbe agua por…',['Capilaridad','Convección','Radiación','Inducción'],0,'Poros diminutos.'),MC('Un tubo más fino produce un ascenso…',['Mayor','Menor','Igual','Cero'],0,'Más estrecho, más alto.')],
 conc:'Explica de qué depende el ascenso capilar y da un ejemplo de la naturaleza.',lim:'Ángulo de contacto de 0° y tubos muy limpios; los tubos adicionales del dibujo son solo ilustrativos.'});

return L;})();
