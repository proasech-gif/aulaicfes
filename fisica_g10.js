/* AULA360 — Catálogo de Física · DÉCIMO (laboratorios 61–80 del inventario): mecánica clásica. */
window.FIS_G10=(function(){
const L=[];
const fm=(v,d)=>(+v).toFixed(d).replace('.',',');
const C1='Uso comprensivo del conocimiento científico',C2='Explicación de fenómenos',C3='Indagación';
const PV='Por verificar con los DBA oficiales del MEN (no se inventan códigos).',EST='Por verificar con los Estándares Básicos de Competencias del MEN.';
const MC=(q,o,ok,fb)=>({q,o,ok,fb});
const add=o=>{o.g=10;o.dba=PV;o.est=EST;o.area='Física';o.mot='banco';o.no=+o.c.slice(-3)+60;
 if(!o.proc){const k=(o.cfg.tareas||[]).length;o.proc=[{t:'Cambia los controles y observa el dibujo.',a:'cambia',n:3}];if(!o.cfg.sinMedir)o.proc.push({t:'Mide y registra al menos 5 datos en la tabla.',a:'mide',n:5});if(k)o.proc.push({t:'Completa las tareas (comprueba cada una).',a:'tarea_ok',n:k});o.proc.push({t:'Resuelve los retos.',a:'todo_ok'})}
 L.push(o)};
const sel=(id,n,opts)=>({id,n,tipo:'sel',opts});
const rg=(id,n,u,min,max,step,v)=>({id,n,u,min,max,step,v});
const R=(q,o,why)=>({q,o,ok:0,why});
const rad=a=>a*Math.PI/180,deg=r=>r*180/Math.PI,G=9.8;
const MAT=['Balanza o dinamómetro','Cronómetro','Cinta métrica'];

/* 61 */
add({c:'F10-001',n:'Movimiento rectilíneo uniforme (burbuja en un tubo)',tema:'Cinemática · MRU',dif:1,
 obj:'Medir la posición de una burbuja que sube por un tubo inclinado con aceite y comprobar que su velocidad es constante.',comp:[C1,C2,C3],
 evid:['Representa x contra t y reconoce una recta.','Obtiene la velocidad como pendiente.','Predice posiciones con x = v·t.'],
 teo:'En el <b>movimiento rectilíneo uniforme (MRU)</b> la velocidad es constante y la posición crece de forma lineal: <b>x = x₀ + v·t</b>. En la gráfica x contra t la <b>pendiente</b> es la velocidad. Una burbuja en un tubo con aceite sube con velocidad casi constante (la fuerza de empuje se equilibra con la resistencia del aceite); al inclinar más el tubo, sube más rápido (en este modelo v = 4·sen θ cm/s).',
 mat:['Tubo de 60 cm con aceite','Cronómetro','Transportador'],
 cfg:{vis:'tuboburb',vars:[rg('ang','Inclinación del tubo','°',10,60,10,30),rg('t','Tiempo','s',0,15,1,0)],anim:{v:'t',dur:7000},
  outs:[{id:'x',n:'Posición de la burbuja',u:'cm',d:1}],tabla:['ang','t','x'],
  fx:v=>({x:4*Math.sin(rad(v.ang))*v.t,_res:{x:0.1},_sd:{x:0.15}}),
  graf:{x:'t',y:'x',nx:'t (s)',ny:'x (cm)',origen:true,u:'cm/s'},
  tareas:[{t:'valor',txt:'Con 30° mide x para varios tiempos. ¿Cuál es la velocidad (pendiente, cm/s)?',ans:2,tol:0.07,u:'cm/s'},{t:'valor',txt:'Con 60° (borra la tabla antes), ¿cuál es la velocidad (cm/s)?',ans:3.46,tol:0.07,u:'cm/s'},{t:'valor',txt:'Con 40° y t = 12 s, ¿qué posición (cm) alcanza la burbuja?',ans:30.85,tolA:1.2,u:'cm'}],
  retos:[R('En un MRU la gráfica x–t es…',['Una recta','Una parábola','Una curva decreciente','Un punto'],'La velocidad es constante.'),R('La pendiente de la gráfica x–t representa…',['La velocidad','La aceleración','La masa','La fuerza'],'Δx/Δt.'),R('Si se duplica el tiempo en un MRU, la distancia recorrida…',['Se duplica','Se cuadruplica','No cambia','Se reduce a la mitad'],'x = v·t.')]},
 ana:['¿Cómo sabes con tus datos que la velocidad es constante?','¿Por qué influye la inclinación del tubo?'],
 ev:[MC('Un MRU tiene…',['Velocidad constante','Aceleración constante distinta de cero','Velocidad creciente','Fuerza creciente'],0,'a = 0.'),MC('Si v = 2 cm/s, en 10 s recorre…',['20 cm','2 cm','5 cm','12 cm'],0,'x = v·t.'),MC('La unidad de velocidad es…',['cm/s','cm','s','N'],0,'Distancia entre tiempo.')],
 conc:'Explica cómo comprobaste que el movimiento es uniforme y cuál fue la velocidad.',lim:'Velocidad constante ideal; se ignora el arranque de la burbuja.'});

/* 62 */
add({c:'F10-002',n:'Movimiento uniformemente acelerado (plano inclinado)',tema:'Cinemática · MRUA',dif:2,
 obj:'Medir la posición de un carrito que baja por un plano inclinado y hallar su aceleración a partir de x contra t².',comp:[C1,C2,C3],
 evid:['Reconoce la relación cuadrática x–t.','Obtiene a como el doble de la pendiente de x contra t².','Relaciona a con la inclinación (a = g·sen θ).'],
 teo:'En el <b>MRUA</b> con partida desde el reposo: <b>x = ½·a·t²</b> y <b>v = a·t</b>. Por eso la gráfica x contra t² es una recta de pendiente a/2. En un plano inclinado sin rozamiento la aceleración es <b>a = g·sen θ</b>. Galileo usó este método para estudiar la caída de los cuerpos «diluyendo» la gravedad.',
 mat:['Riel o plano inclinado','Carrito','Marcas de tiempo o sensores'],
 cfg:{vis:'rampa',vars:[rg('ang','Inclinación','°',5,30,5,10),rg('t','Tiempo','s',0,3,0.25,0)],anim:{v:'t',dur:6000},
  outs:[{id:'x',n:'Distancia recorrida',u:'m',d:3}],tabla:['ang','t','x'],
  fx:v=>{const a=G*Math.sin(rad(v.ang)),x=0.5*a*v.t*v.t,xm=0.5*a*9;return{x,pos:Math.min(1,x/xm),_txt:'a = g·sen θ = '+fm(a,2)+' m/s²',_res:{x:0.001},_sd:{x:0.004}}},
  graf:{x:'t',y:'x',fx:t=>t*t,nx:'t² (s²)',ny:'x (m)',origen:true,u:'m/s²'},
  tareas:[{t:'valor',txt:'Con 10°, mide x para varios tiempos. La pendiente de x contra t² es a/2. ¿Cuál es la aceleración a (m/s²)?',ans:1.7,tol:0.07,u:'m/s²',pista:'a = 2 × pendiente'},{t:'valor',txt:'Con 20° y t = 2,5 s, ¿qué distancia (m) ha recorrido?',ans:10.47,tolA:0.2,u:'m'},{t:'valor',txt:'Con 30° (borra la tabla antes), ¿cuál es la aceleración (m/s²)?',ans:4.9,tol:0.07,u:'m/s²'}],
  retos:[R('En un MRUA desde el reposo, si el tiempo se duplica la distancia…',['Se cuadruplica','Se duplica','Se reduce a la mitad','No cambia'],'x ∝ t².'),R('En un plano inclinado sin rozamiento a vale…',['g·sen θ','g·cos θ','g','g/sen θ'],'Componente del peso a lo largo del plano.'),R('La pendiente de x contra t² es…',['a/2','a','2a','v'],'x = ½at².')]},
 ana:['¿Por qué x–t no es recta pero x–t² sí?','¿Qué pasa con a si la inclinación llega a 90°?'],
 ev:[MC('Con a = 2 m/s² desde el reposo, en 3 s recorre…',['9 m','6 m','12 m','18 m'],0,'½·2·9 = 9.'),MC('La velocidad en MRUA crece…',['Linealmente con t','Con t²','Es constante','Decrece'],0,'v = a·t.'),MC('Si θ aumenta, la aceleración…',['Aumenta','Disminuye','No cambia','Es cero'],0,'sen θ crece.')],
 conc:'Explica cómo obtuviste la aceleración y compárala con g·sen θ.',lim:'Sin rozamiento ni rotación de las ruedas.'});

/* 63 */
add({c:'F10-003',n:'Determinación de la aceleración de la gravedad',tema:'Cinemática · caída libre',dif:2,
 obj:'Medir el tiempo de caída de una esfera desde distintas alturas con fotopuertas y calcular g.',comp:[C1,C2,C3],
 evid:['Linealiza h = ½g·t² graficando t² contra h.','Obtiene g = 2/pendiente.','Predice tiempos o alturas.'],
 teo:'En <b>caída libre</b> desde el reposo, <b>h = ½·g·t²</b>, por lo tanto <b>t² = (2/g)·h</b>. En una gráfica de t² contra h la pendiente es 2/g, de donde <b>g = 2/pendiente</b>. La aceleración de la gravedad cerca de la Tierra es aproximadamente 9,8 m/s², independiente de la masa del cuerpo.',
 mat:['Esfera de acero','Dos fotopuertas','Cinta métrica'],
 cfg:{vis:'caida',vars:[rg('h','Altura de caída','m',0.2,2,0.2,1)],
  outs:[{id:'t',n:'Tiempo de caída',u:'s',d:3}],tabla:['h','t'],
  fx:v=>({t:Math.sqrt(2*v.h/G),_res:{t:0.001},_sd:{t:0.002}}),
  graf:{x:'h',y:'t',fy:t=>t*t,nx:'h (m)',ny:'t² (s²)',origen:true,u:'s²/m'},
  tareas:[{t:'valor',txt:'Mide t para al menos 6 alturas. Con la pendiente de t² contra h, calcula g = 2 ÷ pendiente (m/s²).',ans:9.8,tol:0.04,u:'m/s²'},{t:'valor',txt:'Con h = 1,4 m, ¿cuánto tarda en caer (s)?',ans:0.535,tolA:0.012,u:'s'},{t:'valor',txt:'¿Desde qué altura (m) debe caer la esfera para tardar 0,5 s? (h = ½·g·t²)',ans:1.225,tolA:0.06,u:'m'}],
  retos:[R('En caída libre, si la altura se cuadruplica el tiempo…',['Se duplica','Se cuadruplica','Se reduce a la mitad','No cambia'],'t ∝ √h.'),R('La aceleración de la gravedad depende de…',['El lugar, no de la masa','La masa del cuerpo','El color','El tiempo'],'Todos los cuerpos caen igual (sin aire).'),R('La pendiente de t² contra h es…',['2/g','g','g/2','1/g²'],'t² = 2h/g.')]},
 ana:['¿Por qué se grafica t² y no t?','¿Qué errores experimentales cambiarían tu valor de g?'],
 ev:[MC('g ≈',['9,8 m/s²','98 m/s²','0,98 m/s²','1 m/s²'],0,'Valor estándar.'),MC('Dos cuerpos de distinta masa en caída libre (sin aire)…',['Caen igual','El más pesado cae antes','El más liviano cae antes','No caen'],0,'a = g para todos.'),MC('h = ½gt² con t = 2 s da…',['19,6 m','9,8 m','4,9 m','39,2 m'],0,'½·9,8·4.')],
 conc:'Explica cómo obtuviste g y compáralo con el valor de referencia.',lim:'Sin resistencia del aire; g = 9,8 m/s² (varía levemente con la altitud).'});

/* 64 */
add({c:'F10-004',n:'Tiro horizontal',tema:'Cinemática · movimiento en dos dimensiones',dif:3,
 obj:'Predecir el punto de impacto de una esfera lanzada horizontalmente desde el borde de una mesa.',comp:[C1,C2,C3],
 evid:['Independiza los movimientos horizontal (MRU) y vertical (caída libre).','Calcula el tiempo de vuelo y el alcance.','Valida la predicción con la medida.'],
 teo:'En el <b>tiro horizontal</b> los movimientos son independientes: horizontalmente hay MRU (<b>x = v₀·t</b>) y verticalmente caída libre (<b>y = ½·g·t²</b>). El <b>tiempo de vuelo</b> solo depende de la altura: <b>t = √(2h/g)</b>. El <b>alcance</b> es <b>x = v₀·√(2h/g)</b>.',
 mat:['Rampa curva','Esfera','Mesa','Papel carbón'],
 cfg:{vis:'proy',vars:[rg('h','Altura de la mesa','m',0.5,1.5,0.25,1),rg('v0','Velocidad de salida','m/s',1,5,0.5,3)],
  outs:[{id:'x',n:'Alcance horizontal',u:'m',d:2},{id:'T',n:'Tiempo de vuelo',u:'s',d:3}],tabla:['h','v0','x','T'],
  fx:v=>{const T=Math.sqrt(2*v.h/G);return{x:v.v0*T,T,_vx:v.v0,_vy:0,_h0:v.h,_T:T,_txt:'alcance = '+fm(v.v0*T,2)+' m',_res:{x:0.01,T:0.001},_sd:{x:0.01,T:0.002}}},
  graf:{x:'v0',y:'x',nx:'v₀ (m/s)',ny:'x (m)',origen:true,u:'s'},
  tareas:[{t:'valor',txt:'Con h = 1 m, mide x para varias v₀ (borra la tabla antes). ¿Cuál es la pendiente (el tiempo de vuelo, s)?',ans:0.452,tolA:0.02,u:'s'},{t:'valor',txt:'Predice el alcance (m) con h = 0,8 m y v₀ = 2,5 m/s antes de medirlo.',ans:1.01,tolA:0.05,u:'m',pista:'t = √(2h/g); x = v₀·t'},{t:'valor',txt:'¿Cuánto dura el vuelo (s) si la mesa mide 1,5 m?',ans:0.553,tolA:0.012,u:'s'}],
  retos:[R('El tiempo de vuelo depende de…',['La altura','La velocidad horizontal','La masa','El color'],'t = √(2h/g).'),R('En la dirección horizontal el movimiento es…',['Uniforme','Acelerado','Circular','Nulo'],'No hay fuerza horizontal.'),R('Si v₀ se duplica, el alcance…',['Se duplica','Se cuadruplica','No cambia','Se reduce'],'x ∝ v₀ con t constante.')]},
 ana:['¿Por qué dos esferas, una soltada y otra lanzada horizontalmente, llegan al suelo a la vez?','¿Cómo harías para predecir el impacto con mayor precisión?'],
 ev:[MC('La trayectoria del tiro horizontal es…',['Una parábola','Una recta','Una circunferencia','Una elipse cerrada'],0,'x ∝ t, y ∝ t².'),MC('Con h = 0,8 m, el tiempo de vuelo es aproximadamente…',['0,4 s','0,8 s','1,6 s','4 s'],0,'√(1,6/9,8)=0,4.'),MC('La velocidad vertical al salir de la mesa es…',['Cero','v₀','g','Infinita'],0,'Sale horizontalmente.')],
 conc:'Explica cómo predijiste el punto de impacto y cómo lo validaste.',lim:'Sin resistencia del aire; esfera puntual.'});

/* 65 */
add({c:'F10-005',n:'Movimiento parabólico: ángulo y alcance',tema:'Cinemática · tiro oblicuo',dif:3,
 obj:'Relacionar el ángulo de lanzamiento con el alcance y la altura máxima, y hallar el ángulo de alcance máximo.',comp:[C1,C2,C3],
 evid:['Descompone la velocidad inicial.','Verifica R = v₀²·sen 2θ/g.','Reconoce ángulos complementarios con igual alcance.'],
 teo:'En el <b>tiro oblicuo</b> la velocidad inicial se descompone: v<sub>x</sub> = v₀·cos θ y v<sub>y</sub> = v₀·sen θ. <b>Alcance:</b> <b>R = v₀²·sen(2θ)/g</b>. <b>Altura máxima:</b> <b>h = (v₀·sen θ)²/(2g)</b>. El alcance es máximo con <b>θ = 45°</b>, y dos ángulos complementarios (por ejemplo 30° y 60°) dan el mismo alcance.',
 mat:['Cañón de resorte','Transportador','Papel carbón'],
 cfg:{vis:'proy',vars:[rg('ang','Ángulo de lanzamiento','°',10,80,5,45),rg('v0','Velocidad inicial','m/s',5,20,5,10)],
  outs:[{id:'R',n:'Alcance',u:'m',d:2},{id:'hm',n:'Altura máxima',u:'m',d:2}],tabla:['ang','v0','R','hm'],
  fx:v=>{const vy=v.v0*Math.sin(rad(v.ang)),vx=v.v0*Math.cos(rad(v.ang)),T=2*vy/G;return{R:vx*T,hm:vy*vy/(2*G),_vx:vx,_vy:vy,_h0:0,_T:T,_txt:'alcance = '+fm(vx*T,2)+' m · altura máx. = '+fm(vy*vy/(2*G),2)+' m',_res:{R:0.01,hm:0.01},_sd:{R:0.03,hm:0.02}}},
  graf:{x:'ang',y:'R',fx:a=>Math.sin(rad(2*a)),nx:'sen 2θ',ny:'R (m)',origen:true,u:'m'},
  tareas:[{t:'valor',txt:'Con v₀ = 10 m/s, mide R para varios ángulos (borra la tabla antes). ¿Cuál es la pendiente de R contra sen 2θ (m)?',ans:10.2,tol:0.06,u:'m',pista:'Debe ser v₀²/g'},{t:'valor',txt:'¿Con qué ángulo (°) se logra el alcance máximo?',ans:45,tolA:2.6,u:'°'},{t:'valor',txt:'Con v₀ = 10 m/s y θ = 30°, ¿cuál es el alcance (m)? (igual al de 60°)',ans:8.84,tolA:0.3,u:'m'},{t:'valor',txt:'Con v₀ = 20 m/s y θ = 60°, ¿qué altura máxima (m) alcanza?',ans:15.3,tolA:0.6,u:'m'}],
  retos:[R('El alcance máximo se logra con…',['45°','30°','60°','90°'],'sen 2θ = 1.'),R('Los ángulos 30° y 60° dan…',['El mismo alcance','Alcances distintos','Alcance cero','Altura igual'],'Son complementarios.'),R('A 90° el alcance horizontal es…',['Cero','Máximo','v₀','g'],'sen 180° = 0.')]},
 ana:['¿Por qué la altura máxima no coincide con el alcance máximo?','¿Qué cambiaría si hay resistencia del aire?'],
 ev:[MC('R = v₀² sen 2θ / g se usa para…',['El alcance horizontal','El tiempo de caída solamente','La masa','La energía'],0,'Para terreno horizontal.'),MC('En el punto más alto de la trayectoria la velocidad vertical es…',['Cero','Máxima','v₀','g'],0,'Cambia de signo.'),MC('Si v₀ se duplica, R…',['Se cuadruplica','Se duplica','No cambia','Se reduce'],0,'R ∝ v₀².')],
 conc:'Explica cómo depende el alcance del ángulo con tus datos.',lim:'Sin aire; lanzamiento y aterrizaje a la misma altura.'});

/* 66 */
add({c:'F10-006',n:'Equilibrio de tres fuerzas con dinamómetros',tema:'Estática · vectores',dif:3,
 obj:'Medir las tensiones de dos cuerdas que sostienen un peso y comprobar la suma vectorial y el equilibrio.',comp:[C1,C2,C3],
 evid:['Aplica ΣFx = 0 y ΣFy = 0.','Calcula tensiones con trigonometría.','Explica por qué la tensión aumenta cuando el ángulo es pequeño.'],
 teo:'Un peso W cuelga de dos cuerdas que forman ángulos α₁ y α₂ con la horizontal. En equilibrio ΣF = 0: <b>T₁·cos α₁ = T₂·cos α₂</b> y <b>T₁·sen α₁ + T₂·sen α₂ = W</b>. De allí: <b>T₁ = W·cos α₂ / sen(α₁ + α₂)</b> y <b>T₂ = W·cos α₁ / sen(α₁ + α₂)</b>. Cuanto más «abiertas» las cuerdas (α pequeño), mayores son las tensiones.',
 mat:['2 dinamómetros','Cuerdas','Pesas','Transportador'],
 cfg:{vis:'colgante',vars:[rg('m','Masa colgada','g',200,1000,100,500),rg('a1','Ángulo α₁','°',20,70,5,45),rg('a2','Ángulo α₂','°',20,70,5,45)],
  outs:[{id:'T1',n:'Tensión T₁',u:'N',d:2},{id:'T2',n:'Tensión T₂',u:'N',d:2}],tabla:['m','a1','a2','T1','T2'],
  fx:v=>{const W=v.m/1000*G,s=Math.sin(rad(v.a1+v.a2));return{T1:W*Math.cos(rad(v.a2))/s,T2:W*Math.cos(rad(v.a1))/s,_res:{T1:0.01,T2:0.01},_sd:{T1:0.03,T2:0.03}}},
  tareas:[{t:'valor',txt:'Con 500 g y α₁ = α₂ = 45°, ¿cuál es la tensión T₁ (N)?',ans:3.46,tolA:0.12,u:'N'},{t:'valor',txt:'Con 500 g, α₁ = 30° y α₂ = 60°, ¿cuál es T₁ (N)?',ans:2.45,tolA:0.1,u:'N'},{t:'valor',txt:'Con 500 g y α₁ = α₂ = 20°, ¿cuál es T₁ (N)?',ans:7.16,tolA:0.2,u:'N'},{t:'meta',txt:'Consigue que las dos tensiones sean iguales.',check:(v,o)=>{const ok=v.a1===v.a2;return{ok,msg:ok?'Con ángulos iguales las tensiones son iguales.':'¿Qué debe pasar con los ángulos?'}}}],
  retos:[R('En equilibrio, la suma vectorial de las fuerzas es…',['Cero','Igual al peso','Máxima','Infinita'],'ΣF = 0.'),R('Si los ángulos α disminuyen, las tensiones…',['Aumentan','Disminuyen','No cambian','Se anulan'],'T = W cos α₂/ sen(α₁+α₂) crece.'),R('La suma de las componentes verticales de las tensiones es…',['El peso','Cero','El doble del peso','La masa'],'T₁ sen α₁ + T₂ sen α₂ = W.')]},
 ana:['¿Por qué un cable casi horizontal soporta tensiones enormes?','¿Cómo comprobarías la suma vectorial gráficamente?'],
 ev:[MC('Con α₁ = α₂ = 45° y W = 4,9 N, T =',['3,46 N','4,9 N','2,45 N','9,8 N'],0,'W/(2 sen 45°).'),MC('Una fuerza se descompone en…',['Componentes','Masas','Tiempos','Voltajes'],0,'Fx y Fy.'),MC('ΣFx = 0 significa que las fuerzas horizontales…',['Se equilibran','Suman el peso','Son cero cada una','Son iguales al peso'],0,'T₁cosα₁ = T₂cosα₂.')],
 conc:'Explica cómo comprobaste el equilibrio de las tres fuerzas.',lim:'Cuerdas ideales sin masa; fuerzas coplanares.'});

/* 67 */
add({c:'F10-007',n:'Primera ley de Newton: inercia',tema:'Dinámica · inercia',dif:2,
 obj:'Frenar un carrito con un bloque encima y determinar cuándo el bloque se desliza por su inercia.',comp:[C1,C2,C3],
 evid:['Explica el comportamiento del bloque con la inercia.','Compara la aceleración del carrito con μ·g.','Calcula el desplazamiento relativo.'],
 teo:'<b>Primera ley de Newton:</b> un cuerpo permanece en reposo o en MRU si la fuerza neta sobre él es cero (<b>inercia</b>). Si el carrito frena, el bloque tiende a seguir moviéndose. La única fuerza horizontal sobre el bloque es la fricción, que le puede dar como máximo una desaceleración de <b>μ·g</b>. Si la desaceleración del carrito <b>a &gt; μ·g</b>, el bloque se desliza; si no, frena con el carrito. El desplazamiento relativo es <b>d = v₀²/(2μg) − v₀²/(2a)</b>.',
 mat:['Carrito','Bloque con distintas superficies','Tope para frenar'],
 cfg:{vis:'carro',vars:[rg('v0','Velocidad inicial','m/s',0.5,2,0.5,1),rg('a','Desaceleración del carrito','m/s²',1,10,1,8),sel('mu','Superficie entre bloque y carrito',[[0.1,'Hielo seco (μ = 0,1)'],[0.3,'Madera (μ = 0,3)'],[0.6,'Goma (μ = 0,6)']])],
  outs:[{id:'d',n:'Desplazamiento del bloque sobre el carrito',u:'cm',d:1}],tabla:['v0','a','mu','d'],
  fx:v=>{const sl=v.a>v.mu*G,d=sl?100*(v.v0*v.v0/(2*v.mu*G)-v.v0*v.v0/(2*v.a)):0;return{d,slip:sl,_res:{d:0.1},_sd:{d:sl?0.15:0}}},
  tareas:[{t:'valor',txt:'Con v₀ = 1 m/s, a = 8 m/s² y madera, ¿cuánto se desliza el bloque (cm)?',ans:10.8,tolA:0.7,u:'cm'},{t:'valor',txt:'Con madera (μ = 0,3), ¿cuál es el menor valor entero de a (m/s²) con que el bloque empieza a deslizarse?',ans:3,tolA:0.1,u:'m/s²',pista:'Busca d mayor que 0; μ·g = 2,94'},{t:'meta',txt:'Con a = 5 m/s², elige la superficie con que el bloque NO se desliza.',check:(v,o)=>{const ok=v.a===5&&!o.slip;return{ok,msg:ok?'La fricción de la goma alcanza para frenar el bloque con el carrito.':'Pon a = 5 y busca la superficie con μ·g mayor que 5.'}}}],
  retos:[R('La inercia es la tendencia de un cuerpo a…',['Mantener su estado de movimiento','Detenerse','Acelerar','Caer'],'Primera ley de Newton.'),R('El bloque se desliza hacia delante cuando el carrito frena porque…',['La fricción no alcanza a frenarlo igual','Una fuerza lo empuja','Pesa más','La inercia desaparece'],'Su inercia lo mantiene en movimiento.'),R('Con mayor μ el bloque…',['Se desliza menos','Se desliza más','No tiene peso','Acelera'],'Mayor fricción disponible.')]},
 ana:['¿Por qué usamos el cinturón de seguridad?','¿Qué pasa cuando la fuerza neta es cero?'],
 ev:[MC('Un cuerpo en reposo permanece así si…',['La fuerza neta es cero','Tiene mucha masa','Está caliente','Es pequeño'],0,'Ley de inercia.'),MC('La masa mide…',['La inercia de un cuerpo','Su color','Su volumen','Su altura'],0,'Mayor masa, mayor inercia.'),MC('Si a < μ·g, el bloque…',['Frena con el carrito','Se desliza','Sale volando','Se detiene antes'],0,'La fricción es suficiente.')],
 conc:'Explica el comportamiento del bloque usando la inercia y la fricción.',lim:'Bloque puntual; fricción cinética igual a la estática.'});

/* 68 */
add({c:'F10-008',n:'Segunda ley de Newton: F = m·a',tema:'Dinámica · segunda ley',dif:3,
 obj:'Halar un carrito con una pesa colgante y estudiar cómo varía la aceleración con la fuerza y con la masa.',comp:[C1,C2,C3],
 evid:['Aplica a = m·g/(M + m).','Obtiene g como pendiente de a contra m/(M+m).','Predice aceleraciones.'],
 teo:'<b>Segunda ley:</b> la aceleración es proporcional a la fuerza neta e inversamente proporcional a la masa: <b>a = F/m</b>. Para un carrito de masa M halado por una pesa de masa m (sin fricción), el sistema total tiene masa M + m y la fuerza neta es el peso de la pesa: <b>a = m·g/(M + m)</b>. En la gráfica de a contra m/(M+m) la pendiente es g.',
 mat:['Carrito','Polea','Pesas','Cronómetro y sensores'],
 cfg:{vis:'atwood',vars:[rg('M','Masa del carrito','g',200,1000,100,500),rg('m','Masa de la pesa colgante','g',20,200,20,100)],
  outs:[{id:'a',n:'Aceleración',u:'m/s²',d:2}],tabla:['M','m','a'],
  fx:v=>({a:v.m*G/(v.M+v.m),_res:{a:0.01},_sd:{a:0.02}}),
  graf:{x:'m',y:'a',fx:(m,v)=>m/(v.M+m),nx:'m/(M+m)',ny:'a (m/s²)',origen:true,u:'m/s²'},
  tareas:[{t:'valor',txt:'Con M = 500 g, mide a para al menos 6 pesas distintas (borra la tabla antes). ¿Cuál es la pendiente (m/s²)?',ans:9.8,tol:0.06,u:'m/s²'},{t:'valor',txt:'Con M = 500 g y m = 100 g, ¿cuál es la aceleración (m/s²)?',ans:1.63,tolA:0.08,u:'m/s²'},{t:'valor',txt:'Con M = 500 g, ¿qué masa de pesa (g) se necesita para a = 2 m/s²?',ans:128,tolA:9,u:'g',pista:'m·g = a·(M + m)'}],
  retos:[R('Si la fuerza neta se duplica con la misma masa, a…',['Se duplica','Se reduce a la mitad','No cambia','Se cuadruplica'],'a = F/m.'),R('Si la masa total se duplica con la misma fuerza, a…',['Se reduce a la mitad','Se duplica','No cambia','Se cuadruplica'],'a = F/m.'),R('La aceleración del carrito siempre es…',['Menor que g','Mayor que g','Igual a g','Cero'],'a = g·m/(M+m) < g.')]},
 ana:['¿Por qué la aceleración no es g aunque la pesa caiga?','¿Qué pasa con a si se agregan masas al carrito?'],
 ev:[MC('La segunda ley es…',['F = m·a','F = m/a','a = F·m','F = a/m'],0,'Fuerza neta = masa × aceleración.'),MC('1 N =',['1 kg·m/s²','1 kg·m','1 kg/s','1 m/s²'],0,'Definición del newton.'),MC('Con F = 10 N y m = 2 kg, a =',['5 m/s²','20 m/s²','0,2 m/s²','12 m/s²'],0,'a = F/m.')],
 conc:'Explica cómo comprobaste F = m·a con tus datos.',lim:'Sin rozamiento, cuerda inextensible y polea sin masa.'});

/* 69 */
add({c:'F10-009',n:'Tercera ley de Newton: acción y reacción',tema:'Dinámica · tercera ley',dif:2,
 obj:'Soltar dos carritos unidos por un resorte comprimido y comprobar que reciben fuerzas iguales y opuestas.',comp:[C1,C2,C3],
 evid:['Explica la pareja acción–reacción.','Comprueba que los momentos lineales son iguales y opuestos.','Relaciona la velocidad con la masa.'],
 teo:'<b>Tercera ley:</b> si un cuerpo ejerce una fuerza sobre otro, este ejerce sobre el primero una fuerza <b>igual en magnitud y de sentido contrario</b> (actúan sobre cuerpos distintos). Al soltar el resorte entre dos carritos, las fuerzas son iguales y opuestas durante el mismo tiempo, por lo que los <b>momentos lineales</b> (p = m·v) también: <b>m₁·v₁ = m₂·v₂</b>. El carrito más liviano sale con mayor velocidad. (Energía del resorte: 0,5 J.)',
 mat:['2 carritos','Resorte','Cronómetro'],
 cfg:{vis:'choque',vars:[rg('m1','Masa del carrito 1','g',200,1000,200,400),rg('m2','Masa del carrito 2','g',200,1000,200,400)],
  outs:[{id:'v1',n:'Rapidez del carrito 1',u:'m/s',d:2},{id:'v2',n:'Rapidez del carrito 2',u:'m/s',d:2}],tabla:['m1','m2','v1','v2'],
  fx:v=>{const a=v.m1/1000,b=v.m2/1000,E=0.5,v1=Math.sqrt(2*E*b/(a*(a+b))),v2=a/b*v1;return{v1,v2,_m1:v.m1,_m2:v.m2,_u1:0,_u2:0,_v1:-v1,_v2:v2,_res:{v1:0.01,v2:0.01},_sd:{v1:0.01,v2:0.01}}},
  tareas:[{t:'valor',txt:'Con m₁ = 200 g y m₂ = 600 g, mide las rapideces y calcula el momento lineal del carrito 1, p₁ = m₁·v₁ (kg·m/s).',ans:0.387,tolA:0.02,u:'kg·m/s'},{t:'valor',txt:'Con las mismas masas, ¿cuánto vale el cociente v₁/v₂?',ans:3,tolA:0.15,u:''},{t:'meta',txt:'Consigue que los dos carritos salgan con la misma rapidez.',check:(v,o)=>{const ok=v.m1===v.m2;return{ok,msg:ok?'Con masas iguales, las rapideces son iguales.':'¿Qué debe pasar con las masas?'}}},{t:'valor',txt:'Con m₁ = 400 g y m₂ = 800 g, calcula p₁ − p₂ (kg·m/s) con tus medidas.',ans:0,tolA:0.02,u:'kg·m/s'}],
  retos:[R('Las fuerzas de acción y reacción…',['Actúan sobre cuerpos distintos','Se anulan entre sí','Actúan sobre el mismo cuerpo','Son distintas en magnitud'],'Por eso no se cancelan.'),R('Al soltar el resorte, el carrito más liviano sale…',['Más rápido','Más lento','Igual','No sale'],'m₁v₁ = m₂v₂.'),R('Un cohete avanza porque…',['Expulsa gases hacia atrás','Empuja el aire','Usa el viento','Pesa menos'],'Acción y reacción.')]},
 ana:['¿Por qué las fuerzas de acción y reacción no se cancelan?','¿Cómo explica esto el retroceso de un arma o el impulso de un nadador?'],
 ev:[MC('Si A empuja a B con 10 N, B empuja a A con…',['10 N en sentido contrario','5 N','20 N','0 N'],0,'Tercera ley.'),MC('El momento lineal es…',['m·v','m·a','F·t²','m/v'],0,'p = m v.'),MC('Con carritos iguales, tras soltarse…',['Salen con igual rapidez','Uno queda quieto','Ambos van al mismo lado','Se detienen'],0,'Simetría.')],
 conc:'Explica cómo tus medidas evidencian la tercera ley de Newton.',lim:'Sin fricción; resorte ideal que libera 0,5 J.'});

/* 70 */
const SUP10={0.8:'Lija',0.5:'Madera',0.3:'Vidrio'};
add({c:'F10-010',n:'Coeficiente de rozamiento estático (ángulo crítico)',tema:'Dinámica · fricción',dif:3,
 obj:'Inclinar una rampa hasta que el bloque empiece a deslizar y calcular μₛ = tan θ.',comp:[C1,C2,C3],
 evid:['Descompone el peso en el plano inclinado.','Obtiene μₛ = tan θc.','Compara superficies.'],
 teo:'En una rampa de ángulo θ el bloque está a punto de deslizar cuando la componente del peso a lo largo del plano iguala la fricción estática máxima: <b>m·g·sen θ = μₛ·m·g·cos θ</b>, es decir, <b>μₛ = tan θ<sub>c</sub></b>. El ángulo crítico θ<sub>c</sub> no depende de la masa. Más allá de θ<sub>c</sub> el bloque acelera: <b>a = g(sen θ − μₖ cos θ)</b>.',
 mat:['Rampa de ángulo variable','Bloque','Superficies de lija, madera y vidrio','Transportador'],
 cfg:{vis:'rampa',vars:[sel('mu','Superficie',Object.entries(SUP10).map(([k,x])=>[+k,x])),rg('ang','Ángulo de la rampa','°',0,60,1,10)],
  outs:[{id:'a',n:'Aceleración del bloque',u:'m/s²',d:2}],tabla:['mu','ang','a'],
  fx:v=>{const sl=Math.tan(rad(v.ang))>v.mu,a=sl?G*(Math.sin(rad(v.ang))-0.8*v.mu*Math.cos(rad(v.ang))):0;return{a,pos:sl?0.6:0,slip:sl,_txt:sl?'El bloque desliza':'El bloque permanece en reposo',_res:{a:0.01},_sd:{a:sl?0.02:0}}},
  tareas:[{t:'valor',txt:'Con MADERA, aumenta el ángulo de a 1° hasta que a sea mayor que 0. ¿Cuál es ese ángulo crítico (°)?',ans:26.6,tolA:1.2,u:'°'},{t:'valor',txt:'Con VIDRIO, halla el ángulo crítico y calcula μₛ = tan θc.',ans:0.3,tolA:0.02,u:'',pista:'Usa la tangente del ángulo en que empieza a deslizar'},{t:'valor',txt:'Con LIJA, halla el ángulo crítico y calcula μₛ = tan θc.',ans:0.8,tolA:0.03,u:''}],
  retos:[R('El bloque está a punto de deslizar cuando…',['m g sen θ = μₛ m g cos θ','m g = N','F = 0','θ = 90°'],'Fricción máxima = componente del peso.'),R('El ángulo crítico depende de…',['La superficie, no de la masa','La masa','El tamaño','El color'],'μₛ = tan θc.'),R('Una superficie más rugosa tiene ángulo crítico…',['Mayor','Menor','Igual','Cero'],'Mayor μₛ.')]},
 ana:['¿Por qué la masa no influye en el ángulo crítico?','¿Cómo se aplica esto a la seguridad de las vías con pendiente?'],
 ev:[MC('μₛ = tan θc significa que…',['Se calcula con el ángulo crítico','Depende de la masa','Es siempre 1','Es negativo'],0,'Es adimensional.'),MC('Si θc = 45°, μₛ =',['1','0,5','0,7','2'],0,'tan 45° = 1.'),MC('Si θ > θc, el bloque…',['Acelera hacia abajo','Sube','Se detiene','Se rompe'],0,'La fricción no basta.')],
 conc:'Explica cómo obtuviste μₛ y qué superficie es más rugosa.',lim:'Fricción cinética aproximada como 0,8·μₛ; superficies ideales.'});

/* 71 */
add({c:'F10-011',n:'Fuerza centrípeta en el movimiento circular uniforme',tema:'Dinámica · movimiento circular',dif:3,
 obj:'Hacer girar un tapón con un hilo, medir la fuerza centrípeta necesaria y comprobar Fc = m·(2πf)²·r.',comp:[C1,C2,C3],
 evid:['Relaciona Fc con la frecuencia y el radio.','Obtiene la pendiente de Fc contra f².','Calcula la pesa que equilibra la fuerza.'],
 teo:'Un cuerpo en <b>movimiento circular uniforme</b> tiene aceleración centrípeta <b>a<sub>c</sub> = v²/r = (2πf)²·r</b> dirigida al centro. La fuerza neta hacia el centro es la <b>fuerza centrípeta</b>: <b>F<sub>c</sub> = m·a<sub>c</sub> = m·(2π·f)²·r</b>. En el montaje del tubo, la fuerza la ejerce el hilo, y su tensión equilibra el peso de la pesa colgante (m<sub>c</sub>·g).',
 mat:['Tubo de vidrio o plástico','Hilo','Tapón','Pesa colgante','Cronómetro'],
 cfg:{vis:'centripeta',vars:[rg('r','Radio','m',0.3,1,0.1,0.5),rg('f','Frecuencia','Hz',0.5,3,0.5,1),rg('m','Masa del tapón','g',20,100,20,40)],
  outs:[{id:'Fc',n:'Fuerza centrípeta',u:'N',d:2}],tabla:['m','r','f','Fc'],
  fx:v=>{const Fc=v.m/1000*Math.pow(2*Math.PI*v.f,2)*v.r;return{Fc,mc:Fc/G*1000,_res:{Fc:0.01},_sd:{Fc:0.02}}},
  graf:{x:'f',y:'Fc',fx:f=>f*f,nx:'f² (Hz²)',ny:'Fc (N)',origen:true,u:'N/Hz²'},
  tareas:[{t:'valor',txt:'Con m = 40 g, r = 0,5 m y f = 1 Hz, ¿cuál es la fuerza centrípeta (N)?',ans:0.79,tolA:0.05,u:'N'},{t:'valor',txt:'Con m = 40 g y r = 0,5 m, mide Fc para varias f (borra la tabla antes). ¿Cuál es la pendiente de Fc contra f² (N/Hz²)?',ans:0.79,tol:0.07,u:'N/Hz²'},{t:'valor',txt:'Si la frecuencia se duplica (mismos m y r), ¿por qué factor se multiplica Fc?',ans:4,tolA:0.2,u:''},{t:'valor',txt:'Con m = 60 g, r = 0,4 m y f = 2 Hz, ¿qué pesa colgante (g) equilibra la fuerza?',ans:387,tolA:12,u:'g',pista:'Fc/g, en gramos'}],
  retos:[R('La fuerza centrípeta apunta…',['Hacia el centro','Hacia afuera','Tangente','Hacia arriba'],'Mantiene el giro.'),R('Si el radio se duplica (mismo f y m), Fc…',['Se duplica','Se cuadruplica','No cambia','Se reduce'],'Fc ∝ r.'),R('Si el hilo se corta, el tapón sale…',['Tangente a la circunferencia','Hacia el centro','Hacia afuera radialmente','En espiral'],'Por inercia sigue en línea recta.')]},
 ana:['¿Por qué no existe la «fuerza centrífuga» real sobre el tapón?','¿Qué papel cumple la tensión del hilo?'],
 ev:[MC('Fc = m·v²/r es una fuerza…',['Dirigida al centro','Hacia afuera','Nula','Tangente'],0,'Es la fuerza neta radial.'),MC('Con f = 2 Hz el periodo es…',['0,5 s','2 s','1 s','4 s'],0,'T = 1/f.'),MC('Si v se duplica, Fc…',['Se cuadruplica','Se duplica','No cambia','Se reduce'],0,'Fc ∝ v².')],
 conc:'Explica de qué factores depende la fuerza centrípeta con tus datos.',lim:'Giro horizontal ideal sin rozamiento; tapón puntual.'});

/* 72 */
const K1=20,K2=30;
add({c:'F10-012',n:'Ley de Hooke: resortes en serie y en paralelo',tema:'Dinámica · fuerzas elásticas',dif:3,
 obj:'Medir la constante elástica de un resorte y de dos combinaciones de resortes.',comp:[C1,C2,C3],
 evid:['Obtiene k = 100/pendiente.','Calcula k de resortes en serie y en paralelo.','Compara rigideces.'],
 teo:'<b>Ley de Hooke:</b> <b>F = k·x</b>. Con pesas, F = m·g y en la gráfica x contra F la pendiente es 1/k (aquí x en cm: k = 100/pendiente). En <b>paralelo</b> las constantes se suman: <b>k = k₁ + k₂</b> (más rígido). En <b>serie</b> se suman los estiramientos: <b>1/k = 1/k₁ + 1/k₂</b> (menos rígido que cada uno).',
 mat:['2 resortes','Pesas','Regla'],
 cfg:{vis:'resortes2',vars:[sel('cfg','Montaje',[['s1','Resorte 1'],['s2','Resorte 2'],['ser','Los dos en serie'],['par','Los dos en paralelo']]),rg('m','Masa colgada','g',50,500,50,200)],
  outs:[{id:'x',n:'Estiramiento',u:'cm',d:1}],tabla:['cfg','m','x'],
  fx:v=>{const k={s1:K1,s2:K2,ser:K1*K2/(K1+K2),par:K1+K2}[v.cfg];return{x:v.m/1000*G/k*100,_res:{x:0.1},_sd:{x:0.05}}},
  graf:{x:'m',y:'x',fx:m=>m/1000*G,nx:'F = m·g (N)',ny:'x (cm)',origen:true,u:'cm/N'},
  tareas:[{t:'valor',txt:'Con el RESORTE 1, mide x para varias masas (borra la tabla antes). Calcula k = 100 ÷ pendiente (N/m).',ans:20,tol:0.07,u:'N/m'},{t:'valor',txt:'Con los dos resortes EN SERIE (borra la tabla antes), calcula k (N/m).',ans:12,tol:0.07,u:'N/m'},{t:'valor',txt:'Con los dos resortes EN PARALELO (borra la tabla antes), calcula k (N/m).',ans:50,tol:0.07,u:'N/m'}],
  retos:[R('Dos resortes en paralelo tienen una constante…',['Mayor que cada uno','Menor que cada uno','Igual a k₁','Cero'],'k = k₁ + k₂.'),R('Dos resortes en serie son…',['Menos rígidos que cada uno','Más rígidos','Iguales','Infinitos'],'1/k = 1/k₁ + 1/k₂.'),R('La gráfica x–F de un resorte es…',['Una recta','Una parábola','Una hipérbola','Un círculo'],'Proporcionalidad directa.')]},
 ana:['¿Por qué en serie el estiramiento total es mayor?','¿Dónde se usan combinaciones de resortes (suspensión de un carro)?'],
 ev:[MC('Con k₁ = 20 N/m y k₂ = 30 N/m en paralelo, k =',['50 N/m','12 N/m','10 N/m','25 N/m'],0,'Se suman.'),MC('F = k·x se cumple…',['Dentro del límite elástico','Siempre','Nunca','Solo con masas grandes'],0,'Ley de Hooke.'),MC('En serie, 1/k =',['1/k₁ + 1/k₂','k₁ + k₂','k₁·k₂','k₁ − k₂'],0,'Se suman los estiramientos.')],
 conc:'Explica cómo cambia la rigidez al combinar resortes y apóyate en tus gráficas.',lim:'Resortes ideales sin masa ni deformación permanente.'});

/* 73 */
add({c:'F10-013',n:'Conservación de la energía mecánica (montaña rusa)',tema:'Energía · conservación',dif:3,
 obj:'Medir la energía potencial y cinética de un carrito en una pista sin fricción y verificar que su suma es constante.',comp:[C1,C2,C3],
 evid:['Calcula Ep = m·g·h y Ec = ½·m·v².','Verifica que Ep + Ec es constante.','Obtiene la velocidad con v² = 2g(H − h).'],
 teo:'La <b>energía potencial gravitatoria</b> es <b>Ep = m·g·h</b> y la <b>cinética</b>, <b>Ec = ½·m·v²</b>. Sin rozamiento la <b>energía mecánica</b> E = Ep + Ec se conserva: al bajar, la potencial se transforma en cinética. Si el carrito parte del reposo desde la altura H, a la altura h: <b>v = √(2g(H − h))</b>. Por eso la gráfica de v² contra (H − h) es una recta con pendiente 2g.',
 mat:['Pista curva o de montaña rusa','Esfera o carrito','Fotopuerta'],
 cfg:{vis:'montana',vars:[rg('H','Altura inicial','m',1,5,0.5,4),rg('h','Altura del punto de medida','m',0,5,0.5,2),rg('m','Masa','kg',0.1,1,0.1,0.5)],
  outs:[{id:'Ep',n:'Energía potencial',u:'J',d:2},{id:'Ec',n:'Energía cinética',u:'J',d:2},{id:'v',n:'Velocidad',u:'m/s',d:2}],tabla:['H','h','m','Ep','Ec','v'],
  fx:v=>{const h=Math.min(v.h,v.H);return{Ep:v.m*G*h,Ec:v.m*G*(v.H-h),v:Math.sqrt(2*G*(v.H-h)),_res:{Ep:0.01,Ec:0.01,v:0.01},_sd:{Ep:0.02,Ec:0.02,v:0.03}}},
  graf:{x:'h',y:'v',fx:(h,v)=>v.H-Math.min(h,v.H),fy:x=>x*x,nx:'H − h (m)',ny:'v² (m²/s²)',origen:true,u:'m/s²'},
  tareas:[{t:'valor',txt:'Con H = 4 m, mide v para varias alturas h (borra la tabla antes). ¿Cuál es la pendiente de v² contra (H − h) (m/s²)?',ans:19.6,tol:0.07,u:'m/s²',pista:'Es 2g'},{t:'valor',txt:'Con H = 4 m, h = 0 y cualquier masa, ¿qué velocidad (m/s) tiene en la base?',ans:8.85,tolA:0.3,u:'m/s'},{t:'valor',txt:'Con H = 4 m, h = 2 m y m = 0,5 kg, calcula la energía mecánica total Ep + Ec (J).',ans:19.6,tolA:0.5,u:'J'},{t:'valor',txt:'Con H = 3 m, h = 1,5 m y m = 0,5 kg, ¿cuánto vale Ec (J)?',ans:7.35,tolA:0.4,u:'J'}],
  retos:[R('Sin rozamiento, la energía mecánica…',['Se conserva','Aumenta','Disminuye','Desaparece'],'Ep + Ec = constante.'),R('En el punto más bajo la energía cinética es…',['Máxima','Cero','Igual a Ep','Negativa'],'Toda la Ep se convirtió.'),R('La velocidad en la base depende de…',['La altura inicial, no de la masa','La masa','El color','La forma de la pista solamente'],'v = √(2gH).')]},
 ana:['¿Qué pasa con la energía si hay rozamiento?','¿Por qué la forma de la pista no cambia la velocidad en la base?'],
 ev:[MC('Ep = m g h con m = 2 kg y h = 5 m es…',['98 J','10 J','49 J','19,6 J'],0,'2·9,8·5.'),MC('La energía cinética depende de…',['La masa y el cuadrado de la velocidad','Solo la masa','Solo la altura','La temperatura'],0,'½mv².'),MC('Al subir un carrito, su energía potencial…',['Aumenta','Disminuye','No cambia','Se anula'],0,'Depende de h.')],
 conc:'Explica cómo comprobaste que la energía mecánica se conserva.',lim:'Sin rozamiento ni resistencia del aire; carrito puntual.'});

/* 74 */
add({c:'F10-014',n:'Teorema del trabajo y la energía cinética',tema:'Energía · trabajo',dif:3,
 obj:'Frenar un bloque con fricción y verificar que el trabajo de la fricción es igual al cambio de energía cinética.',comp:[C1,C2,C3],
 evid:['Calcula el trabajo W = F·d.','Verifica W = ΔEc.','Obtiene μ a partir de la pendiente de d contra v₀².'],
 teo:'<b>Trabajo</b> de una fuerza constante: <b>W = F·d·cos θ</b>. <b>Teorema trabajo–energía:</b> el trabajo neto sobre un cuerpo es igual al cambio de su energía cinética: <b>W<sub>neto</sub> = ΔEc = ½mv² − ½mv₀²</b>. Un bloque que frena por fricción pierde toda su energía: <b>μ·m·g·d = ½·m·v₀²</b>, de modo que <b>d = v₀²/(2μg)</b>.',
 mat:['Bloque','Superficie horizontal','Cinta métrica','Lanzador de velocidad'],
 cfg:{vis:'frenado',vars:[rg('m','Masa del bloque','kg',0.5,2,0.5,1),rg('v0','Velocidad inicial','m/s',1,6,1,4),sel('mu','Superficie',[[0.2,'Lisa (μ = 0,2)'],[0.4,'Media (μ = 0,4)'],[0.6,'Rugosa (μ = 0,6)']])],
  outs:[{id:'d',n:'Distancia de frenado',u:'m',d:2},{id:'W',n:'Trabajo de la fricción',u:'J',d:1}],tabla:['m','v0','mu','d','W'],
  fx:v=>{const d=v.v0*v.v0/(2*v.mu*G);return{d,W:v.mu*v.m*G*d,_res:{d:0.01,W:0.1},_sd:{d:0.03,W:0.15}}},
  graf:{x:'v0',y:'d',fx:v=>v*v,nx:'v₀² (m²/s²)',ny:'d (m)',origen:true,u:'s²/m'},
  tareas:[{t:'valor',txt:'Con m = 2 kg y v₀ = 4 m/s, ¿cuánto vale el trabajo de la fricción (J)? (compáralo con ½·m·v₀²)',ans:16,tolA:1,u:'J'},{t:'valor',txt:'Con μ = 0,4 mide d para varias v₀ (borra la tabla antes). Con la pendiente de d contra v₀² calcula μ = 1 ÷ (2·g·pendiente).',ans:0.4,tol:0.08,u:''},{t:'valor',txt:'Con μ = 0,2 y v₀ = 5 m/s, ¿qué distancia (m) recorre antes de detenerse?',ans:6.38,tolA:0.3,u:'m'}],
  retos:[R('El trabajo de la fricción sobre el bloque es…',['Negativo','Positivo','Cero','Infinito'],'Se opone al desplazamiento.'),R('Si v₀ se duplica, la distancia de frenado…',['Se cuadruplica','Se duplica','No cambia','Se reduce'],'d ∝ v₀².'),R('El trabajo neto es igual a…',['El cambio de energía cinética','La masa','La fuerza','El tiempo'],'Teorema trabajo–energía.')]},
 ana:['¿A dónde va la energía cinética que pierde el bloque?','¿Cómo influye la masa en la distancia de frenado?'],
 ev:[MC('El trabajo se mide en…',['Julios','Newtons','Vatios','Metros'],0,'1 J = 1 N·m.'),MC('Si el bloque no cambia de velocidad, el trabajo neto es…',['Cero','Positivo','Negativo','Infinito'],0,'ΔEc = 0.'),MC('La masa del bloque en d = v₀²/(2μg)…',['No aparece','Se duplica','Se eleva al cuadrado','Se resta'],0,'Se cancela.')],
 conc:'Explica cómo tus datos verifican el teorema trabajo–energía.',lim:'Fricción cinética constante; superficie horizontal.'});

/* 75 */
add({c:'F10-015',n:'Potencia mecánica al subir escaleras',tema:'Energía · potencia',dif:2,
 obj:'Calcular la potencia que desarrolla una persona al subir escaleras a partir del trabajo realizado y el tiempo.',comp:[C1,C2,C3],
 evid:['Calcula el trabajo W = m·g·h.','Calcula P = W/t.','Interpreta la gráfica P contra 1/t.'],
 teo:'La <b>potencia</b> es la rapidez con que se realiza trabajo: <b>P = W/t</b>, medida en vatios (1 W = 1 J/s). Al subir una escalera de altura h, el trabajo contra la gravedad es <b>W = m·g·h</b>, así que <b>P = m·g·h/t</b>. Con W constante, la gráfica de P contra 1/t es una recta de pendiente W. (1 caballo de fuerza ≈ 746 W.)',
 mat:['Escalera','Cronómetro','Cinta métrica','Balanza'],
 cfg:{vis:'escalera',vars:[rg('m','Masa de la persona','kg',40,90,10,60),rg('h','Altura de la escalera','m',2,6,1,3),rg('t','Tiempo de subida','s',3,20,1,6)],
  outs:[{id:'W',n:'Trabajo realizado',u:'J',d:0},{id:'P',n:'Potencia',u:'W',d:1}],tabla:['m','h','t','W','P'],
  fx:v=>({W:v.m*G*v.h,P:v.m*G*v.h/v.t,_res:{W:1,P:0.1},_sd:{W:0,P:2}}),
  graf:{x:'t',y:'P',fx:t=>1/t,nx:'1/t (s⁻¹)',ny:'P (W)',origen:true,u:'J'},
  tareas:[{t:'valor',txt:'Con m = 60 kg, h = 3 m y t = 6 s, ¿cuál es la potencia (W)?',ans:294,tolA:12,u:'W'},{t:'valor',txt:'Con m = 60 kg y h = 3 m mide P para varios tiempos (borra la tabla antes). ¿Cuál es la pendiente de P contra 1/t (J)?',ans:1764,tol:0.06,u:'J'},{t:'valor',txt:'Una persona de 70 kg sube 4 m. ¿En cuántos segundos debe subir para desarrollar 400 W?',ans:6.86,tolA:0.4,u:'s'}],
  retos:[R('La potencia mide…',['Qué tan rápido se hace trabajo','La fuerza','La energía total','La masa'],'P = W/t.'),R('Si subes la misma escalera en la mitad del tiempo, tu potencia…',['Se duplica','Se reduce a la mitad','No cambia','Se cuadruplica'],'P ∝ 1/t.'),R('1 vatio es…',['1 J/s','1 N','1 kg','1 m/s'],'Definición.')]},
 ana:['¿Por qué el trabajo es el mismo si subes despacio o rápido pero la potencia no?','¿Cuánta potencia desarrolla un atleta y qué la limita?'],
 ev:[MC('W = m·g·h para m = 50 kg, h = 4 m es…',['1960 J','200 J','490 J','50 J'],0,'50·9,8·4.'),MC('P = W/t con W = 600 J y t = 3 s es…',['200 W','1800 W','2 W','20 W'],0,'600/3.'),MC('Un kilovatio-hora es una unidad de…',['Energía','Potencia','Fuerza','Tiempo'],0,'1 kWh = 3,6 MJ.')],
 conc:'Explica la diferencia entre trabajo y potencia con tus resultados.',lim:'Solo se cuenta el trabajo contra la gravedad (sin energía interna del cuerpo).'});

/* 76 */
add({c:'F10-016',n:'Conservación del momento lineal: choques elásticos',tema:'Momento lineal · choques',dif:3,
 obj:'Estudiar colisiones frontales elásticas entre dos deslizadores y comprobar la conservación del momento y de la energía.',comp:[C1,C2,C3],
 evid:['Calcula las velocidades finales.','Verifica que p y Ec se conservan.','Predice el resultado para masas distintas.'],
 teo:'El <b>momento lineal</b> es <b>p = m·v</b>. En un sistema aislado se conserva: <b>m₁v₁ + m₂v₂ = m₁v₁′ + m₂v₂′</b>. En un choque <b>elástico</b> también se conserva la energía cinética. Con el cuerpo 2 en reposo: <b>v₁′ = (m₁ − m₂)/(m₁ + m₂)·v₁</b> y <b>v₂′ = 2m₁/(m₁ + m₂)·v₁</b>. Con masas iguales se intercambian las velocidades (como en la cuna de Newton).',
 mat:['Riel de aire o carritos','Cuna de Newton','Sensores de velocidad'],
 cfg:{vis:'choque',vars:[rg('m1','Masa 1','g',100,500,100,200),rg('m2','Masa 2 (en reposo)','g',100,500,100,200),rg('u','Velocidad inicial de la masa 1','m/s',0.5,2,0.5,2)],
  outs:[{id:'v1',n:'Velocidad final de 1',u:'m/s',d:2},{id:'v2',n:'Velocidad final de 2',u:'m/s',d:2}],tabla:['m1','m2','u','v1','v2'],
  fx:v=>{const v1=(v.m1-v.m2)/(v.m1+v.m2)*v.u,v2=2*v.m1/(v.m1+v.m2)*v.u;return{v1,v2,_m1:v.m1,_m2:v.m2,_u1:v.u,_u2:0,_v1:v1,_v2:v2,_res:{v1:0.01,v2:0.01},_sd:{v1:0.015,v2:0.015}}},
  tareas:[{t:'valor',txt:'Con m₁ = m₂ = 200 g y u = 2 m/s, ¿cuál es la velocidad final de la masa 2 (m/s)?',ans:2,tolA:0.08,u:'m/s'},{t:'valor',txt:'Con m₁ = 300 g, m₂ = 100 g y u = 2 m/s, ¿cuál es la velocidad final de la masa 1 (m/s)?',ans:1,tolA:0.08,u:'m/s'},{t:'valor',txt:'Con m₁ = 100 g, m₂ = 300 g y u = 2 m/s, ¿cuál es la velocidad final de la masa 1 (m/s)? Escribe el signo.',ans:-1,tolA:0.08,u:'m/s'},{t:'valor',txt:'Con m₁ = m₂ = 200 g y u = 2 m/s, ¿cuánta energía cinética total (J) hay después del choque?',ans:0.4,tolA:0.03,u:'J',pista:'Ec = ½·m₁·v₁² + ½·m₂·v₂²'}],
  retos:[R('En un choque elástico se conserva…',['Momento y energía cinética','Solo el momento','Solo la energía','Nada'],'Definición de choque elástico.'),R('Con masas iguales y una en reposo, tras el choque…',['Se intercambian las velocidades','Ambas se detienen','Ambas avanzan igual','Rebotan'],'v₁′ = 0 y v₂′ = u.'),R('Si m₁ < m₂, la masa 1 tras el choque…',['Rebota','Sigue igual','Se detiene','Se acelera'],'v₁′ es negativa.')]},
 ana:['¿Cómo se ve la conservación del momento en la cuna de Newton?','¿Qué pasa si la masa 1 es mucho mayor que la 2?'],
 ev:[MC('p = m·v se conserva si…',['No hay fuerzas externas','Hay fricción','La masa cambia','Hay calor'],0,'Sistema aislado.'),MC('En un choque elástico la energía cinética total…',['Se conserva','Aumenta','Se pierde','Se duplica'],0,'No se disipa.'),MC('El momento tiene unidades de…',['kg·m/s','N','J','W'],0,'Masa por velocidad.')],
 conc:'Explica cómo verificaste la conservación del momento y de la energía.',lim:'Choque unidimensional ideal sin fricción.'});

/* 77 */
const EREST={ten:['Pelota de tenis',0.75],gom:['Pelota de goma',0.85],mad:['Bola de madera',0.5],pla:['Bola de plastilina',0.1]};
add({c:'F10-017',n:'Choques inelásticos y coeficiente de restitución',tema:'Momento lineal · restitución',dif:3,
 obj:'Medir la altura de rebote de pelotas de distintos materiales y hallar su coeficiente de restitución.',comp:[C1,C2,C3],
 evid:['Relaciona la altura de rebote con e².','Obtiene e como la raíz de la pendiente de h contra h₀.','Compara materiales.'],
 teo:'El <b>coeficiente de restitución</b> e mide qué tan elástico es un choque: <b>e = v<sub>después</sub>/v<sub>antes</sub></b> (e = 1 elástico; e = 0 perfectamente inelástico). Una pelota que cae desde h₀ llega con v = √(2g·h₀) y rebota hasta <b>h = e²·h₀</b>. La gráfica h contra h₀ es una recta de pendiente <b>e²</b>. La energía que se pierde se disipa en calor y deformación.',
 mat:['Pelotas de tenis, goma, madera y plastilina','Regla métrica'],
 cfg:{vis:'rebote',vars:[sel('mat','Pelota',Object.entries(EREST).map(([k,x])=>[k,x[0]])),rg('h0','Altura de caída','m',0.5,2,0.25,1)],
  outs:[{id:'hr',n:'Altura de rebote',u:'m',d:2}],tabla:['mat','h0','hr'],
  fx:v=>({hr:EREST[v.mat][1]*EREST[v.mat][1]*v.h0,_res:{hr:0.01},_sd:{hr:0.01}}),
  graf:{x:'h0',y:'hr',nx:'h₀ (m)',ny:'h (m)',origen:true,u:''},
  tareas:[{t:'valor',txt:'Con la PELOTA DE TENIS, mide h para varias alturas (borra la tabla antes). Con la pendiente calcula e = √pendiente.',ans:0.75,tol:0.06,u:''},{t:'valor',txt:'Con la PELOTA DE GOMA y h₀ = 1,5 m, ¿qué altura de rebote (m) mides?',ans:1.08,tolA:0.05,u:'m'},{t:'valor',txt:'Con la BOLA DE MADERA y h₀ = 2 m, ¿qué altura de rebote (m) mides?',ans:0.5,tolA:0.04,u:'m'}],
  retos:[R('Si e = 1 el choque es…',['Elástico','Perfectamente inelástico','Imposible','Explosivo'],'No se pierde energía cinética.'),R('La bola de plastilina rebota casi nada porque…',['Su e es muy pequeño','Su e es 1','No tiene masa','Es muy liviana'],'Disipa casi toda la energía.'),R('Si h₀ se duplica, la altura de rebote…',['Se duplica','Se cuadruplica','No cambia','Se reduce'],'h = e²h₀.')]},
 ana:['¿A dónde va la energía que no se recupera en el rebote?','¿Qué pelota conviene para un deporte de rebote y por qué?'],
 ev:[MC('h = e²·h₀ permite calcular…',['La altura de rebote','El tiempo de caída','La masa','La potencia'],0,'Con h₀ y e.'),MC('Un choque perfectamente inelástico tiene e =',['0','1','0,5','2'],0,'Los cuerpos quedan unidos.'),MC('En un choque inelástico el momento lineal…',['Se conserva','Se pierde','Se duplica','Aumenta'],0,'Si no hay fuerzas externas.')],
 conc:'Explica cómo hallaste e y qué material es más elástico.',lim:'Rebote vertical ideal; sin resistencia del aire.'});

/* 78 */
const CAN={A:['Cañón A',60],B:['Cañón B',90],C:['Cañón C',120]};
add({c:'F10-018',n:'Péndulo balístico',tema:'Momento lineal · choque perfectamente inelástico',dif:4,
 obj:'Determinar la velocidad de un proyectil a partir de la altura que sube un bloque en el que queda incrustado.',comp:[C1,C2,C3],
 evid:['Aplica conservación del momento en el choque.','Aplica conservación de la energía después del choque.','Calcula la velocidad del proyectil.'],
 teo:'El proyectil (masa m, velocidad v) se incrusta en el bloque (masa M) — choque perfectamente inelástico. <b>Conservación del momento:</b> m·v = (m + M)·V. Luego el conjunto sube sin pérdidas: <b>½(m + M)V² = (m + M)·g·h</b>, o sea <b>V = √(2g·h)</b>. Despejando: <b>v = (m + M)/m · √(2g·h)</b>. Se usa para medir velocidades de balas con instrumentos sencillos.',
 mat:['Péndulo con bloque de madera','Proyectil','Regla'],
 cfg:{vis:'balistico',vars:[sel('can','Cañón',Object.entries(CAN).map(([k,x])=>[k,x[0]])),rg('m','Masa del proyectil','g',5,20,5,20),rg('M','Masa del bloque','kg',0.4,1,0.2,0.4)],
  outs:[{id:'h',n:'Altura alcanzada por el bloque',u:'cm',d:1}],tabla:['can','m','M','h'],
  fx:v=>{const V=v.m/1000*CAN[v.can][1]/(v.m/1000+v.M),h=V*V/(2*G)*100;return{h,th:Math.acos(Math.max(-1,1-h/300)),_res:{h:0.1},_sd:{h:0.15}}},
  tareas:[{t:'valor',txt:'Con el CAÑÓN A (usa m = 20 g y M = 0,4 kg), mide h y calcula la velocidad v del proyectil (m/s): v = (m + M)/m · √(2·g·h), h en metros.',ans:60,tol:0.06,u:'m/s'},{t:'valor',txt:'Calcula la velocidad (m/s) del proyectil del CAÑÓN B.',ans:90,tol:0.06,u:'m/s'},{t:'valor',txt:'Calcula la velocidad (m/s) del proyectil del CAÑÓN C.',ans:120,tol:0.06,u:'m/s'}],
  retos:[R('En el choque proyectil–bloque se conserva…',['El momento lineal','La energía cinética','La temperatura','Nada'],'Es inelástico: la energía no se conserva.'),R('Después del choque, mientras sube el péndulo se conserva…',['La energía mecánica','El momento lineal','La velocidad','La masa del proyectil solamente'],'Sin rozamiento.'),R('Si el proyectil va más rápido, el bloque sube…',['Más alto','Menos','Igual','Cae'],'h ∝ v².')]},
 ana:['¿Cuánta energía se pierde en el choque? ¿Dónde va?','¿Por qué es mejor usar un bloque pesado para balas rápidas?'],
 ev:[MC('El péndulo balístico sirve para medir…',['La velocidad de un proyectil','La gravedad','La masa del aire','La potencia'],0,'A partir de h.'),MC('Un choque perfectamente inelástico es aquel en que los cuerpos…',['Quedan unidos','Rebotan','Se destruyen','Se alejan'],0,'e = 0.'),MC('La energía cinética en el choque…',['Disminuye','Se conserva','Aumenta','Se duplica'],0,'Se disipa como deformación y calor.')],
 conc:'Explica cómo usaste dos conservaciones distintas para hallar la velocidad.',lim:'Bloque de longitud de cuerda fija (3 m); se ignora el rozamiento del aire.'});

/* 79 */
add({c:'F10-019',n:'Torque y equilibrio rotacional',tema:'Estática · rotación',dif:3,
 obj:'Colgar pesas a distintas distancias del eje de una regla y encontrar las condiciones de equilibrio rotacional.',comp:[C1,C2,C3],
 evid:['Calcula el torque τ = F·d.','Aplica Στ = 0.','Predice la masa o la posición que equilibra.'],
 teo:'El <b>torque</b> (momento de una fuerza) mide su capacidad de producir giro: <b>τ = F·d</b>, con d la distancia perpendicular al eje. Un cuerpo está en <b>equilibrio rotacional</b> si la suma de torques es cero: <b>Στ = 0</b>. Para dos pesas a ambos lados: <b>m₁·d₁ = m₂·d₂</b>. El torque neto positivo hace girar la regla hacia la izquierda en este simulador.',
 mat:['Regla perforada','Eje','Pesas','Ganchos'],
 cfg:{vis:'palanca',vars:[rg('m1','Masa izquierda','g',50,500,50,200),rg('d1','Distancia izquierda','cm',10,50,10,30),rg('m2','Masa derecha','g',50,500,50,200),rg('d2','Distancia derecha','cm',10,50,10,20)],
  outs:[{id:'tau',n:'Torque neto (izq. − der.)',u:'N·m',d:3}],tabla:['m1','d1','m2','d2','tau'],
  fx:v=>{const tau=(v.m1*v.d1-v.m2*v.d2)*G/1e5;return{tau,th:Math.max(-25,Math.min(25,tau*60)),_res:{tau:0.001},_sd:{tau:0.002}}},
  tareas:[{t:'valor',txt:'Con m₁ = 150 g a 40 cm y m₂ = 100 g a 20 cm, ¿cuál es el torque neto (N·m)?',ans:0.392,tolA:0.015,u:'N·m'},{t:'meta',txt:'Con m₁ = 200 g a 30 cm y la masa derecha a 20 cm, equilibra la regla (torque neto casi cero).',check:(v,o)=>{const ok=v.m1===200&&v.d1===30&&v.d2===20&&Math.abs(o.tau)<0.005;return{ok,msg:ok?'¡Equilibrio! m₂ = '+v.m2+' g.':'Coloca m₁ = 200 g a 30 cm, d₂ = 20 cm y busca m₂.'}}},{t:'meta',txt:'Con m₁ = 300 g a 20 cm, equilibra la regla con otra combinación de masa y distancia derecha.',check:(v,o)=>{const ok=v.m1===300&&v.d1===20&&Math.abs(o.tau)<0.005;return{ok,msg:ok?'¡Equilibrio con m₂ = '+v.m2+' g a '+v.d2+' cm!':'Pon m₁ = 300 g a 20 cm y busca m₂·d₂ = 6000 g·cm.'}}},{t:'valor',txt:'Con m₁ = 250 g a 40 cm y d₂ = 50 cm, ¿qué masa m₂ (g) equilibra la regla?',ans:200,tolA:5,u:'g'}],
  retos:[R('El torque depende de…',['La fuerza y la distancia al eje','Solo la fuerza','Solo la masa','El color'],'τ = F·d.'),R('Para equilibrar una pesa más lejana del eje se necesita…',['Menos masa del otro lado a igual distancia','Más masa','Igual masa','No hay equilibrio'],'m₁d₁ = m₂d₂.'),R('En equilibrio rotacional Στ es…',['Cero','Máxima','Igual al peso','Negativa siempre'],'No hay giro neto.')]},
 ana:['¿Por qué una puerta se abre más fácil empujando lejos de las bisagras?','¿Cómo funciona una balanza de brazos?'],
 ev:[MC('La unidad del torque es…',['N·m','N','J/s','kg'],0,'Fuerza por distancia.'),MC('Con 200 g a 30 cm equilibran 300 g a…',['20 cm','45 cm','10 cm','60 cm'],0,'200·30 = 300·20.'),MC('El eje de giro es…',['El punto respecto al que se calcula el torque','El peso','La masa','La fuerza'],0,'Punto fijo.')],
 conc:'Explica la condición de equilibrio rotacional con tus datos.',lim:'Regla uniforme sin masa propia; g = 9,8 m/s².'});

/* 80 */
const II=(m,r)=>1.5+2*m*r*r;
add({c:'F10-020',n:'Conservación del momento angular',tema:'Rotación · momento angular',dif:4,
 obj:'Variar la posición de las pesas en las manos sobre una silla giratoria y comprobar que I·ω se conserva.',comp:[C1,C2,C3],
 evid:['Calcula I = I₀ + 2·m·r².','Aplica I₁ω₁ = I₂ω₂.','Explica el aumento de energía cinética.'],
 teo:'El <b>momento angular</b> es <b>L = I·ω</b>. Sin torques externos se conserva: <b>I₁·ω₁ = I₂·ω₂</b>. El momento de inercia de la persona con las pesas es <b>I = I₀ + 2·m·r²</b> (I₀ = 1,5 kg·m² el cuerpo y la silla; dos pesas de masa m a distancia r del eje). Al acercar las pesas, I disminuye y ω aumenta, como un patinador que cierra los brazos. La energía cinética aumenta porque la persona realiza trabajo al recoger los brazos.',
 mat:['Silla giratoria','2 pesas de 1 a 4 kg'],
 cfg:{vis:'silla',vars:[rg('m','Masa de cada pesa','kg',1,4,1,2),rg('r1','Radio inicial (brazos extendidos)','m',0.4,0.8,0.1,0.8),rg('r2','Radio final (brazos recogidos)','m',0.2,0.8,0.1,0.2),rg('w1','Velocidad angular inicial','rad/s',1,3,0.5,1)],
  outs:[{id:'w2',n:'Velocidad angular final',u:'rad/s',d:2},{id:'K',n:'Cociente de energías cinéticas Ec₂/Ec₁',u:'',d:2}],tabla:['m','r1','r2','w1','w2','K'],
  fx:v=>{const i1=II(v.m,v.r1),i2=II(v.m,v.r2);return{w2:v.w1*i1/i2,K:i1/i2,_res:{w2:0.01,K:0.01},_sd:{w2:0.02,K:0.015}}},
  tareas:[{t:'valor',txt:'Con m = 2 kg, r₁ = 0,8 m, r₂ = 0,2 m y ω₁ = 1 rad/s, ¿cuánto vale ω₂ (rad/s)?',ans:2.45,tolA:0.12,u:'rad/s'},{t:'valor',txt:'Con las mismas condiciones, ¿cuánto vale el cociente de energías cinéticas Ec₂/Ec₁?',ans:2.45,tolA:0.12,u:'',pista:'Es igual a I₁/I₂'},{t:'valor',txt:'Con m = 2 kg, r₁ = 0,8 m y ω₁ = 1 rad/s, ¿qué radio final r₂ (m) da ω₂ = 2 rad/s? (puede tener decimales)',ans:0.36,tolA:0.03,u:'m',pista:'I₂ = I₁·ω₁/ω₂'}],
  retos:[R('Al recoger los brazos, la velocidad angular…',['Aumenta','Disminuye','No cambia','Se anula'],'I disminuye, ω aumenta.'),R('Se conserva el momento angular cuando…',['No hay torque externo','Hay mucha fricción','La masa cambia','Hay viento'],'Στ_ext = 0.'),R('La energía cinética de rotación al recoger los brazos…',['Aumenta','Disminuye','No cambia','Se anula'],'La persona hace trabajo.')]},
 ana:['¿Cómo hace un patinador para girar más rápido?','¿De dónde sale la energía que aumenta?'],
 ev:[MC('L = I·ω es…',['El momento angular','La fuerza','La energía','El torque'],0,'Análogo a p = m v.'),MC('Si I se reduce a la mitad con L constante, ω…',['Se duplica','Se reduce','No cambia','Se anula'],0,'ω = L/I.'),MC('La unidad del momento de inercia es…',['kg·m²','kg·m','N·m','m/s²'],0,'Masa por distancia al cuadrado.')],
 conc:'Explica cómo cambian I y ω al mover las pesas y qué se conserva.',lim:'I₀ fijo de 1,5 kg·m²; se ignora el rozamiento de la silla.'});

return L})();
