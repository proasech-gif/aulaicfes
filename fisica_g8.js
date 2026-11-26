/* AULA360 — Catálogo de Física · OCTAVO (laboratorios 31–45 del inventario): calor, ondas y sonido. */
window.FIS_G8=(function(){
const L=[];
const fm=(v,d)=>(+v).toFixed(d).replace('.',',');
const C1='Uso comprensivo del conocimiento científico',C2='Explicación de fenómenos',C3='Indagación';
const PV='Por verificar con los DBA oficiales del MEN (no se inventan códigos).',EST='Por verificar con los Estándares Básicos de Competencias del MEN.';
const MC=(q,o,ok,fb)=>({q,o,ok,fb});
const add=o=>{o.g=8;o.dba=PV;o.est=EST;o.area='Física';o.mot='banco';o.no=+o.c.slice(-3)+30;
 if(!o.proc){const k=(o.cfg.tareas||[]).length;o.proc=[{t:'Cambia los controles y observa el dibujo.',a:'cambia',n:3}];if(!o.cfg.sinMedir)o.proc.push({t:'Mide y registra al menos 5 datos en la tabla.',a:'mide',n:5});if(k)o.proc.push({t:'Completa las tareas (comprueba cada una).',a:'tarea_ok',n:k});o.proc.push({t:'Resuelve los retos.',a:'todo_ok'})}
 L.push(o)};
const sel=(id,n,opts)=>({id,n,tipo:'sel',opts});
const rg=(id,n,u,min,max,step,v)=>({id,n,u,min,max,step,v});
const R=(q,o,why)=>({q,o,ok:0,why});

/* 31 */
add({c:'F08-001',n:'Escalas termométricas: Celsius, Fahrenheit y Kelvin',tema:'Calor · temperatura',dif:1,
 obj:'Comparar las escalas Celsius y Fahrenheit con dos termómetros y encontrar la relación lineal entre ellas.',comp:[C1,C2,C3],
 evid:['Convierte temperaturas entre °C y °F.','Obtiene la pendiente 1,8 de la gráfica °F contra °C.','Identifica el punto donde ambas escalas coinciden.'],
 teo:'La <b>temperatura</b> mide qué tan caliente está un cuerpo (la energía de agitación de sus partículas). En la escala <b>Celsius</b> el agua se congela a 0 °C y hierve a 100 °C; en la <b>Fahrenheit</b>, a 32 °F y 212 °F. Entre los dos puntos hay 100 divisiones Celsius y 180 Fahrenheit, por eso <b>°F = 1,8·°C + 32</b>. La escala <b>Kelvin</b> es absoluta: <b>K = °C + 273,15</b>.',
 mat:['Dos termómetros (°C y °F)','Baño de agua con hielo y agua caliente'],
 cfg:{vis:'escalas',vars:[rg('T','Temperatura del baño','°C',-40,110,5,20)],
  outs:[{id:'C',n:'Termómetro Celsius',u:'°C',d:1},{id:'F',n:'Termómetro Fahrenheit',u:'°F',d:0}],tabla:['T','C','F'],
  fx:v=>({C:v.T,F:1.8*v.T+32,_res:{C:0.5,F:1},_sd:{C:0.3,F:0.6}}),
  graf:{x:'C',y:'F',nx:'T (°C)',ny:'T (°F)',u:'°F por °C'},
  tareas:[{t:'valor',txt:'Mide al menos 6 temperaturas distintas entre −40 y 110 °C. ¿Cuál es la pendiente de la gráfica °F contra °C?',ans:1.8,tolA:0.1,u:'°F/°C',pista:'Debe aparecer cerca de 1,8'},{t:'valor',txt:'La temperatura normal del cuerpo es 37 °C. Con la relación hallada, ¿cuánto es en °F?',ans:98.6,tolA:0.4,u:'°F',pista:'°F = 1,8·°C + 32'},{t:'meta',txt:'Busca la temperatura en la que los dos termómetros marcan el mismo número.',check:(v,o)=>{const ok=v.T===-40;return{ok,msg:ok?'¡Exacto! A −40 °C = −40 °F las escalas coinciden.':'Prueba con temperaturas muy bajas; la coincidencia es un número negativo.'}}}],
  retos:[R('El agua hierve a…',['100 °C = 212 °F','100 °C = 100 °F','212 °C = 100 °F','0 °C = 212 °F'],'Los puntos fijos son 100 °C y 212 °F.'),R('0 °C equivale a…',['32 °F','0 °F','273 °F','100 °F'],'El punto de congelación del agua es 32 °F.'),R('Para pasar de °C a K se…',['Suma 273,15','Resta 273,15','Multiplica por 1,8','Divide entre 1,8'],'K = °C + 273,15.')]},
 ana:['¿Por qué la gráfica es una recta que no pasa por el origen?','¿Qué significa que −40 °C y −40 °F sean iguales?'],
 ev:[MC('La escala absoluta de temperatura es…',['Kelvin','Celsius','Fahrenheit','Ninguna'],0,'Su cero es el cero absoluto.'),MC('°F = 1,8·°C + 32 significa que cada grado Celsius equivale a…',['1,8 °F','0,5 °F','32 °F','100 °F'],0,'La pendiente es 1,8.'),MC('Una temperatura de 50 °C corresponde a…',['122 °F','82 °F','90 °F','50 °F'],0,'1,8·50 + 32 = 122.')],
 conc:'Explica cómo obtuviste la fórmula de conversión a partir de tus datos.',lim:'Termómetros ideales con pequeño ruido de lectura; se ignora el retardo de respuesta del termómetro.'});

/* 32 */
const MET={al:['Aluminio',0.90,'#cbd5e1'],cu:['Cobre',0.385,'#b45309'],fe:['Hierro',0.45,'#475569'],pb:['Plomo',0.13,'#1f2937']};
add({c:'F08-002',n:'Calor específico de metales',tema:'Calor · calorimetría',dif:3,
 obj:'Determinar el calor específico de varios metales sumergiéndolos calientes en agua dentro de un calorímetro.',comp:[C1,C2,C3],
 evid:['Aplica que el calor cedido es igual al calor ganado.','Calcula c a partir de la temperatura final.','Compara metales por su capacidad de almacenar calor.'],
 teo:'El <b>calor</b> Q es energía que pasa de un cuerpo caliente a uno frío. Para un cuerpo de masa m: <b>Q = m·c·ΔT</b>, donde c es el <b>calor específico</b> (J/g·°C). El agua tiene c = 4,18 J/g·°C. En un calorímetro aislado, el calor que cede el metal lo gana el agua: <b>m<sub>m</sub>·c<sub>m</sub>·(100 − T<sub>f</sub>) = m<sub>a</sub>·4,18·(T<sub>f</sub> − 20)</b>. Despejando: c<sub>m</sub> = m<sub>a</sub>·4,18·(T<sub>f</sub> − 20) / [m<sub>m</sub>·(100 − T<sub>f</sub>)].',
 mat:['Calorímetro','Muestras de aluminio, cobre, hierro y plomo','Termómetro','Balanza'],
 cfg:{vis:'calorimetro',vars:[sel('metal','Metal (a 100 °C)',Object.entries(MET).map(([k,x])=>[k,x[0]])),rg('mm','Masa del metal','g',50,300,50,300),rg('ma','Masa de agua (a 20 °C)','g',100,300,50,100)],
  outs:[{id:'Tf',n:'Temperatura final',u:'°C',d:1}],tabla:['metal','mm','ma','Tf'],
  fx:v=>{const m=MET[v.metal],c=m[1],Tf=(v.mm*c*100+v.ma*4.18*20)/(v.mm*c+v.ma*4.18);return{Tf,_metal:1,_mc:m[2],_lab:m[0]+' '+v.mm+' g en '+v.ma+' g de agua',_res:{Tf:0.1},_sd:{Tf:0.1}}},
  tareas:[{t:'valor',txt:'Con ALUMINIO, 300 g de metal y 100 g de agua, mide Tf y calcula el calor específico del aluminio (J/g·°C).',ans:0.9,tol:0.08,u:'J/g·°C',pista:'c = ma·4,18·(Tf−20) / [mm·(100−Tf)]'},{t:'valor',txt:'Repite con HIERRO (300 g de metal, 100 g de agua). ¿Cuál es su calor específico?',ans:0.45,tol:0.08,u:'J/g·°C'},{t:'valor',txt:'Con COBRE (300 g y 100 g de agua), ¿a qué temperatura final (°C) llega el agua?',ans:37.3,tolA:0.6,u:'°C'}],
  retos:[R('Si un metal tiene calor específico bajo, al recibir calor su temperatura…',['Sube rápido','Sube lento','No cambia','Baja'],'Con poca energía por gramo ya se calienta mucho.'),R('En el calorímetro aislado, el calor cedido por el metal…',['Es igual al ganado por el agua','Es mayor que el ganado','Desaparece','Es cero'],'Se conserva la energía.'),R('El agua tiene un calor específico alto, por eso…',['Tarda en calentarse y en enfriarse','Se calienta muy rápido','No almacena calor','Hierve a 0 °C'],'Almacena mucha energía por grado.')]},
 ana:['¿Qué metal almacena más energía por gramo y grado?','¿Qué errores reales harían que tu valor de c sea distinto del de la tabla?'],
 ev:[MC('Q = m·c·ΔT se usa para…',['Calcular el calor ganado o perdido','Calcular la densidad','Medir la presión','Hallar la velocidad'],0,'Relaciona calor, masa, c y cambio de temperatura.'),MC('La unidad del calor específico es…',['J/g·°C','N/m','g/mL','W'],0,'Julios por gramo y por grado Celsius.'),MC('Si el metal está a 100 °C y el agua a 20 °C, la temperatura final queda…',['Entre 20 y 100 °C','Por encima de 100 °C','Por debajo de 20 °C','Igual a 100 °C'],0,'Es un valor intermedio.')],
 conc:'Explica cómo usaste la conservación de la energía para hallar c.',lim:'Calorímetro ideal: se desprecian las pérdidas de calor y la capacidad calorífica del recipiente.'});

/* 33 */
add({c:'F08-003',n:'Calor latente de fusión del hielo',tema:'Calor · cambios de estado',dif:3,
 obj:'Hallar el calor latente de fusión del hielo mezclándolo con agua tibia en un calorímetro.',comp:[C1,C2,C3],
 evid:['Distingue calor sensible y calor latente.','Plantea el balance de energía con cambio de estado.','Calcula L a partir de la temperatura final.'],
 teo:'Durante un <b>cambio de estado</b> la temperatura no varía: el calor se invierte en romper uniones entre partículas. El <b>calor latente de fusión</b> L es el calor por gramo necesario para fundir: <b>Q = m·L</b> (para el hielo L ≈ 334 J/g). Balance: el agua cede <b>m<sub>a</sub>·4,18·(T<sub>0</sub> − T<sub>f</sub>)</b>; el hielo gasta <b>m<sub>h</sub>·L</b> para fundirse y luego <b>m<sub>h</sub>·4,18·T<sub>f</sub></b> para calentarse hasta T<sub>f</sub>. Si queda hielo, la mezcla se queda en 0 °C.',
 mat:['Calorímetro','Hielo a 0 °C','Agua tibia (200 g)','Termómetro'],
 cfg:{vis:'calorimetro',vars:[rg('mh','Masa de hielo (0 °C)','g',25,200,25,100),rg('T0','Temperatura inicial del agua (200 g)','°C',30,80,5,60)],
  outs:[{id:'Tf',n:'Temperatura final',u:'°C',d:1}],tabla:['mh','T0','Tf'],
  fx:v=>{const Tf=Math.max(0,(200*4.18*v.T0-v.mh*334)/((200+v.mh)*4.18));return{Tf,_ice:Tf>0?v.mh*0.5:v.mh,_lab:v.mh+' g de hielo + 200 g de agua a '+v.T0+' °C'+(Tf===0?' (queda hielo)':''),_res:{Tf:0.1},_sd:{Tf:0.1}}},
  tareas:[{t:'valor',txt:'Con 100 g de hielo y agua a 60 °C, mide Tf y calcula L (J/g): L = [200·4,18·(60−Tf) − 100·4,18·Tf] / 100.',ans:334,tol:0.07,u:'J/g',pista:'Usa el balance de energía indicado'},{t:'valor',txt:'Con 50 g de hielo y agua a 40 °C, ¿cuál es la temperatura final (°C)?',ans:16,tolA:0.6,u:'°C'},{t:'valor',txt:'Calcula la masa máxima de hielo (g) que 200 g de agua a 50 °C pueden fundir por completo.',ans:125,tolA:6,u:'g',pista:'200·4,18·50 = m·334'}],
  retos:[R('Mientras el hielo se funde a 0 °C, su temperatura…',['No cambia','Sube','Baja','Se vuelve negativa'],'El calor se usa en el cambio de estado.'),R('Si se agrega demasiado hielo, la mezcla final queda en…',['0 °C con hielo sin fundir','100 °C','20 °C','−10 °C'],'No alcanza energía para fundirlo todo.'),R('El calor latente de fusión del hielo es aproximadamente…',['334 J/g','4,18 J/g','0,9 J/g','2260 J/g'],'L ≈ 334 J/g.')]},
 ana:['¿Por qué el hielo enfría más que el mismo peso de agua fría?','¿Qué pasaría si el hielo estuviera a −10 °C?'],
 ev:[MC('El calor latente se emplea para…',['Cambiar de estado','Subir la temperatura siempre','Medir masa','Producir luz'],0,'No cambia T durante el cambio de fase.'),MC('Q = m·L sirve para…',['Fundir o evaporar una masa','Calentar sin cambio de estado','Hallar presión','Medir volumen'],0,'L es calor por unidad de masa.'),MC('Una mezcla con hielo y agua en equilibrio está a…',['0 °C','10 °C','100 °C','−5 °C'],0,'Es la temperatura de fusión del hielo.')],
 conc:'Explica el balance de energía que usaste y por qué el hielo enfría tanto el agua.',lim:'Calorímetro ideal; se ignora el intercambio con el aire y el recipiente.'});

/* 34 */
const TAU={sin:[25,'Sin envolver','#ef4444'],al:[24,'Papel de aluminio','#94a3b8'],lana:[60,'Lana','#f59e0b'],ico:[90,'Icopor','#2563eb']};
add({c:'F08-004',n:'Aislantes y conductores térmicos',tema:'Calor · transferencia',dif:2,
 obj:'Comparar cuánto tardan en enfriarse vasos de agua caliente envueltos con distintos materiales.',comp:[C1,C2,C3],
 evid:['Compara materiales aislantes y conductores.','Interpreta curvas de enfriamiento.','Relaciona la rapidez de enfriamiento con la diferencia de temperatura.'],
 teo:'El calor pasa por <b>conducción</b>, <b>convección</b> y <b>radiación</b>. Un <b>aislante</b> (icopor, lana, aire atrapado) dificulta el paso del calor; un <b>conductor</b> (metales) lo facilita. Según la ley de enfriamiento de Newton, un cuerpo se enfría más rápido cuando la diferencia con el ambiente es grande: <b>T(t) = T<sub>amb</sub> + (T<sub>0</sub> − T<sub>amb</sub>)·e<sup>−t/τ</sup></b>. Un τ grande indica un mejor aislante.',
 mat:['4 vasos con agua a 80 °C','Icopor, lana y papel aluminio','Termómetros','Cronómetro'],
 cfg:{vis:'enfria',curvas:Object.values(TAU).map(a=>({n:a[1],c:a[2],f:t=>20+60*Math.exp(-t/a[0])})),
  vars:[sel('mat','Material del envoltorio',Object.entries(TAU).map(([k,x])=>[k,x[1]])),rg('t','Tiempo','min',0,60,5,0)],anim:{v:'t',dur:7000},
  outs:[{id:'T',n:'Temperatura del agua',u:'°C',d:1}],tabla:['mat','t','T'],
  fx:v=>({T:20+60*Math.exp(-v.t/TAU[v.mat][0]),_res:{T:0.1},_sd:{T:0.2}}),
  tareas:[{t:'valor',txt:'Sin envolver, ¿qué temperatura (°C) tiene el agua a los 30 minutos?',ans:38.1,tolA:1.2,u:'°C'},{t:'valor',txt:'Con ICOPOR, ¿qué temperatura (°C) tiene el agua a los 30 minutos?',ans:63,tolA:1.5,u:'°C'},{t:'valor',txt:'A los 60 minutos, ¿cuántos grados más caliente está el vaso de icopor que el vaso sin envolver?',ans:25.4,tolA:1.8,u:'°C',pista:'Mide ambos a 60 min y resta'}],
  retos:[R('El mejor aislante de la prueba es…',['Icopor','Papel aluminio','Sin envolver','Ninguno'],'Es el que más lentamente deja salir el calor.'),R('El agua se enfría más rápido cuando…',['Está mucho más caliente que el ambiente','Está casi a la temperatura ambiente','Está tapada con icopor','Hay vacío'],'La rapidez depende de la diferencia de temperatura.'),R('Al final, todos los vasos tienden a…',['La temperatura ambiente','0 °C','80 °C','100 °C'],'Se alcanza el equilibrio térmico.')]},
 ana:['¿Por qué el aluminio casi no aísla?','¿Qué pasa con la rapidez de enfriamiento a medida que el agua se acerca a los 20 °C?'],
 ev:[MC('Un buen aislante térmico…',['Conduce poco calor','Conduce mucho calor','Genera calor','Atrae el frío'],0,'Reduce la transferencia de energía.'),MC('Los metales son…',['Buenos conductores','Buenos aislantes','Aislantes perfectos','Radiactivos'],0,'Conducen bien el calor.'),MC('La temperatura ambiente en la simulación es…',['20 °C','0 °C','80 °C','60 °C'],0,'El agua tiende a 20 °C.')],
 conc:'Explica qué material usarías para conservar caliente una bebida y por qué.',lim:'Modelo exponencial de Newton con constantes de tiempo didácticas; se ignora la evaporación.'});

/* 35 */
add({c:'F08-005',n:'Pulsos en un resorte (slinky)',tema:'Ondas · propagación',dif:2,
 obj:'Medir la rapidez de un pulso en un resorte y descubrir de qué depende.',comp:[C1,C2,C3],
 evid:['Distingue ondas transversales y longitudinales.','Calcula la rapidez como pendiente de x contra t.','Relaciona la rapidez con la tensión y la masa por longitud.'],
 teo:'Una <b>onda</b> transporta energía sin transportar materia. En una onda <b>transversal</b> las partículas oscilan perpendicularmente a la propagación; en una <b>longitudinal</b>, paralelamente. La rapidez del pulso en una cuerda o resorte tensado es <b>v = √(T/μ)</b> (T tensión en N, μ masa por metro en kg/m): crece con la tensión y disminuye con la densidad lineal. No depende del tamaño del pulso ni del tipo de onda.',
 mat:['Slinky o resorte largo','Dinamómetro','Cronómetro','Cinta métrica'],
 cfg:{vis:'pulso',vars:[sel('tipo','Tipo de pulso',[['transversal','Transversal'],['longitudinal','Longitudinal']]),rg('T','Tensión','N',2,20,2,8),sel('mu','Masa por metro',[[0.02,'Ligero (0,02 kg/m)'],[0.05,'Pesado (0,05 kg/m)']]),rg('t','Tiempo','s',0,0.3,0.01,0)],anim:{v:'t',dur:5000},
  outs:[{id:'x',n:'Posición del frente del pulso',u:'m',d:2}],tabla:['T','mu','t','x'],
  fx:v=>{const vel=Math.sqrt(v.T/v.mu);return{x:vel*v.t,_v:vel,_res:{x:0.01},_sd:{x:0.03}}},
  graf:{x:'t',y:'x',nx:'t (s)',ny:'x (m)',origen:true,u:'m/s'},
  tareas:[{t:'valor',txt:'Con T = 8 N y masa por metro 0,02 kg/m, mide x para varios tiempos. ¿Cuál es la rapidez (pendiente, m/s)?',ans:20,tol:0.1,u:'m/s',pista:'La pendiente de x contra t es la rapidez'},{t:'valor',txt:'Con T = 2 N y masa por metro 0,05 kg/m, ¿cuál es la rapidez (m/s)? (borra la tabla antes de medir)',ans:6.32,tol:0.12,u:'m/s',pista:'v = √(T/μ)'},{t:'valor',txt:'Si la tensión se cuadruplica con la misma masa por metro, ¿por qué factor se multiplica la rapidez?',ans:2,tolA:0.15,u:'',pista:'v = √(T/μ)'}],
  retos:[R('En una onda transversal, las partículas se mueven…',['Perpendicular a la propagación','Paralelo a la propagación','En círculos únicamente','No se mueven'],'Esa es la definición.'),R('Al aumentar la tensión, el pulso viaja…',['Más rápido','Más lento','Igual','Hacia atrás'],'v = √(T/μ).'),R('Una onda transporta…',['Energía','Materia','Carga','Masa'],'La materia solo oscila.')]},
 ana:['¿Por qué un resorte pesado transmite el pulso más lento?','¿Cambia la rapidez si el pulso es longitudinal en lugar de transversal?'],
 ev:[MC('La rapidez de una onda en una cuerda depende de…',['La tensión y la masa por longitud','El color','La altura del pulso','Quién la produce'],0,'v = √(T/μ).'),MC('El sonido en el aire es una onda…',['Longitudinal','Transversal','Electromagnética','Estática'],0,'Las moléculas oscilan en la dirección de propagación.'),MC('Una onda transporta energía sin…',['Transportar materia','Transportar movimiento','Existir','Reflejarse'],0,'El medio solo oscila.')],
 conc:'Explica de qué depende la rapidez de un pulso y qué evidencia tienes.',lim:'Resorte ideal sin pérdidas; el pulso conserva su forma.'});

/* 36 */
const MED={fijo:[-1,0,1],libre:[1,0,1],pesada:[-1/3,2/3,0.5],ligera:[1/3,4/3,2]};
add({c:'F08-006',n:'Reflexión y transmisión de ondas',tema:'Ondas · reflexión',dif:3,
 obj:'Observar cómo se reflejan y transmiten pulsos en extremos fijos, libres y en el cambio entre dos cuerdas.',comp:[C1,C2,C3],
 evid:['Describe la inversión del pulso en el extremo fijo.','Calcula amplitudes reflejada y transmitida.','Relaciona la reflexión con el cambio de medio.'],
 teo:'Cuando un pulso llega a un límite, parte se <b>refleja</b> y parte se <b>transmite</b>. En un extremo <b>fijo</b> el pulso vuelve <b>invertido</b>; en uno <b>libre</b> vuelve <b>sin invertir</b>. Si la cuerda cambia a una más <b>pesada</b>, el pulso reflejado se invierte (r = −1/3 en este modelo) y el transmitido es más lento; si cambia a una más <b>ligera</b>, el reflejado no se invierte (r = +1/3) y el transmitido es más rápido. Amplitudes: A<sub>r</sub> = r·A<sub>0</sub> y A<sub>t</sub> = t·A<sub>0</sub>.',
 mat:['Cuerda larga','Cuerdas de distinto grosor','Argolla en una varilla (extremo libre)'],
 cfg:{vis:'reflex',vars:[sel('medio','Límite',[['fijo','Extremo fijo'],['libre','Extremo libre'],['pesada','Cambio a cuerda más pesada'],['ligera','Cambio a cuerda más ligera']]),rg('A0','Amplitud del pulso incidente','cm',2,8,1,4),rg('t','Tiempo','s',0,4,0.1,0)],anim:{v:'t',dur:7000},
  outs:[{id:'Ar',n:'Amplitud reflejada',u:'cm',d:1},{id:'At',n:'Amplitud transmitida',u:'cm',d:1}],tabla:['medio','A0','Ar','At'],
  fx:v=>{const m=MED[v.medio];return{Ar:m[0]*v.A0,At:m[1]*v.A0,_vt:m[2],_res:{Ar:0.05,At:0.05},_sd:{Ar:0.04,At:0.04}}},
  graf:{x:'A0',y:'Ar',nx:'A₀ (cm)',ny:'Aᵣ (cm)',origen:true,u:''},
  tareas:[{t:'valor',txt:'En el EXTREMO FIJO con A₀ = 4 cm, ¿cuál es la amplitud reflejada (cm)? Escribe el signo.',ans:-4,tolA:0.3,u:'cm',pista:'Se invierte: el signo es negativo'},{t:'valor',txt:'Con la CUERDA MÁS PESADA y A₀ = 6 cm, ¿cuál es la amplitud reflejada (cm)?',ans:-2,tolA:0.3,u:'cm'},{t:'valor',txt:'Con la cuerda más pesada y A₀ = 6 cm, ¿cuál es la amplitud transmitida (cm)?',ans:4,tolA:0.3,u:'cm'},{t:'valor',txt:'Con la CUERDA MÁS LIGERA, mide Aᵣ para varias A₀ (borra la tabla). ¿Cuál es la pendiente de Aᵣ contra A₀?',ans:0.333,tolA:0.04,u:'',pista:'Es el coeficiente de reflexión r'}],
  retos:[R('En un extremo fijo, el pulso reflejado…',['Se invierte','No se invierte','Desaparece','Se duplica'],'La pared ejerce una fuerza hacia abajo.'),R('En un extremo libre, el pulso reflejado…',['No se invierte','Se invierte','Desaparece','Cambia de color'],'El extremo puede moverse libremente.'),R('Al pasar a una cuerda más ligera, el pulso transmitido viaja…',['Más rápido','Más lento','Igual','No viaja'],'v = √(T/μ) aumenta.')]},
 ana:['¿Por qué el pulso se invierte al reflejarse en una pared?','¿Dónde se aplica esto en la vida real (por ejemplo ecos o cables)?'],
 ev:[MC('Un pulso reflejado invertido indica…',['Extremo fijo o medio más pesado','Extremo libre','Vacío','Más energía'],0,'Hay inversión de fase.'),MC('Transmitir significa…',['Pasar al otro medio','Rebotar','Absorberse','Detenerse'],0,'Parte de la onda sigue.'),MC('Un coeficiente r = +1/3 corresponde a…',['Cuerda más ligera','Pared fija','Cuerda más pesada','Vacío'],0,'No se invierte.')],
 conc:'Explica cuándo se invierte un pulso al reflejarse y por qué.',lim:'Pulsos sin pérdidas; coeficientes ±1/3 y 2/3, 4/3 como ejemplo didáctico.'});

/* 37 */
add({c:'F08-007',n:'Cubeta de ondas: rapidez y longitud de onda',tema:'Ondas · agua',dif:2,
 obj:'Medir la longitud de onda de ondas en agua y comprobar v = λ·f y su dependencia de la profundidad.',comp:[C1,C2,C3],
 evid:['Relaciona v, λ y f.','Obtiene v como pendiente de λ contra 1/f.','Explica por qué las ondas son más lentas en aguas someras.'],
 teo:'Una onda periódica cumple <b>v = λ·f</b>: λ es la distancia entre dos crestas y f el número de ondas por segundo (Hz). En agua poco profunda la rapidez es <b>v = √(g·h)</b> (g = 980 cm/s², h profundidad), por eso al disminuir la profundidad las ondas se acortan. Con un vibrador plano se forman frentes rectos; con uno puntual, círculos concéntricos.',
 mat:['Cubeta de ondas con luz estroboscópica','Vibrador plano o puntual','Regla'],
 cfg:{vis:'cubeta',vars:[sel('fuente','Fuente',[['plana','Plana (frentes rectos)'],['puntual','Puntual (círculos)']]),rg('f','Frecuencia','Hz',2,10,1,5),rg('h','Profundidad','cm',0.5,2,0.5,1)],
  outs:[{id:'lam',n:'Longitud de onda',u:'cm',d:2}],tabla:['fuente','f','h','lam'],
  fx:v=>{const vel=Math.sqrt(980*v.h);return{lam:vel/v.f,_res:{lam:0.01},_sd:{lam:0.03}}},
  graf:{x:'f',y:'lam',fx:f=>1/f,nx:'1/f (s)',ny:'λ (cm)',origen:true,u:'cm/s'},
  tareas:[{t:'valor',txt:'Con h = 1 cm, mide λ para varias frecuencias. La pendiente de λ contra 1/f es la rapidez v (cm/s). ¿Cuánto vale?',ans:31.3,tol:0.07,u:'cm/s',pista:'Registra al menos 5 frecuencias distintas con h = 1'},{t:'valor',txt:'Con f = 10 Hz y h = 2 cm, ¿cuál es la longitud de onda (cm)?',ans:4.43,tolA:0.15,u:'cm'},{t:'valor',txt:'Si la profundidad se cuadruplica, ¿por qué factor se multiplica la rapidez?',ans:2,tolA:0.1,u:'',pista:'v = √(g·h)'}],
  retos:[R('Si la frecuencia aumenta con la misma rapidez, la longitud de onda…',['Disminuye','Aumenta','No cambia','Se anula'],'λ = v/f.'),R('En aguas más someras las ondas viajan…',['Más lento','Más rápido','Igual','Al revés'],'v = √(g·h).'),R('Una fuente puntual produce frentes…',['Circulares','Rectos','Cuadrados','Ninguno'],'La onda se expande en todas direcciones.')]},
 ana:['¿Cómo cambia λ al aumentar f? ¿Por qué?','¿Qué ocurre con las olas del mar cuando llegan a la orilla?'],
 ev:[MC('La relación entre rapidez, frecuencia y longitud de onda es…',['v = λ·f','v = λ/f','v = f/λ²','v = λ + f'],0,'Una onda avanza una longitud en un periodo.'),MC('La frecuencia se mide en…',['Hertz','Metros','Newton','Joule'],0,'1 Hz = 1 oscilación por segundo.'),MC('Si el periodo es 0,1 s, la frecuencia es…',['10 Hz','0,1 Hz','1 Hz','100 Hz'],0,'f = 1/T.')],
 conc:'Explica cómo obtuviste la rapidez y de qué factores depende en el agua.',lim:'Aproximación de aguas someras (h pequeña frente a λ); se desprecia la tensión superficial.'});

/* 38 */
const LL=40;
const DIF=v=>{const dob=v.tipo==='doble',dy=dob?v.lam*LL/v.d:2*v.lam*LL/v.d,ym=dob?3*dy:2.5*dy;
 const sinc=x=>Math.abs(x)<1e-9?1:Math.sin(x)/x;
 const I=y=>dob?Math.pow(Math.cos(Math.PI*v.d*y/(v.lam*LL)),2)*Math.pow(sinc(Math.PI*1.2*y/(v.lam*LL)),2)*1:Math.pow(sinc(Math.PI*v.d*y/(v.lam*LL)),2);
 return{dy,_I:I,_ymax:ym,_txt:(dob?'Separación entre franjas Δy = ':'Ancho del máximo central = ')+fm(dy,1)+' cm',_res:{dy:0.1},_sd:{dy:0.2}}};
add({c:'F08-008',n:'Difracción e interferencia',tema:'Ondas · interferencia',dif:3,
 obj:'Medir el patrón que producen una rendija y dos rendijas y relacionarlo con la longitud de onda.',comp:[C1,C2,C3],
 evid:['Describe franjas de interferencia constructiva y destructiva.','Aplica Δy = λL/d.','Diferencia el patrón de una y de dos rendijas.'],
 teo:'Las ondas se <b>difractan</b> al pasar por aberturas y se <b>superponen</b> (interferencia). Con <b>dos rendijas</b> separadas una distancia d, en una pantalla a distancia L aparecen franjas brillantes separadas <b>Δy = λ·L/d</b>. Con <b>una rendija</b> de ancho a, el máximo central tiene un ancho <b>2·λ·L/a</b>. Cuanto más pequeña es la abertura, más se abre el patrón. Aquí L = 40 cm (ondas en una cubeta).',
 mat:['Cubeta de ondas o láser','Barrera con una y dos rendijas','Pantalla'],
 cfg:{vis:'difrac',vars:[sel('tipo','Barrera',[['doble','Dos rendijas'],['simple','Una rendija']]),rg('lam','Longitud de onda','cm',1,3,0.5,2),rg('d','Separación d (doble) o ancho a (simple)','cm',3,8,1,4)],
  outs:[{id:'dy',n:'Δy (doble) o ancho del máximo central (simple)',u:'cm',d:1}],tabla:['tipo','lam','d','dy'],
  fx:DIF,graf:{x:'lam',y:'dy',nx:'λ (cm)',ny:'Δy (cm)',origen:true,u:'cm/cm'},
  tareas:[{t:'valor',txt:'Con DOS rendijas, λ = 2 cm y d = 4 cm, ¿cuánto vale la separación entre franjas Δy (cm)?',ans:20,tolA:1,u:'cm'},{t:'valor',txt:'Con dos rendijas y d = 5 cm, mide Δy para varias λ (borra la tabla). ¿Cuánto vale la pendiente (L/d)?',ans:8,tol:0.08,u:'',pista:'Pendiente de Δy contra λ'},{t:'valor',txt:'Con UNA rendija, λ = 3 cm y ancho 6 cm, ¿cuál es el ancho del máximo central (cm)?',ans:40,tolA:2,u:'cm'},{t:'valor',txt:'Con dos rendijas, si se duplica la separación d, ¿por qué factor se multiplica Δy?',ans:0.5,tolA:0.06,u:'',pista:'Δy = λL/d'}],
  retos:[R('Con dos rendijas, al aumentar la longitud de onda las franjas…',['Se separan más','Se juntan','No cambian','Desaparecen'],'Δy es proporcional a λ.'),R('Al estrechar una sola rendija, el máximo central…',['Se ensancha','Se estrecha','No cambia','Se vuelve punto'],'La difracción aumenta con aberturas pequeñas.'),R('Dos crestas que coinciden producen interferencia…',['Constructiva','Destructiva','Ninguna','Nula siempre'],'Se suman las amplitudes.')]},
 ana:['¿Qué pasaría con un láser rojo y uno azul en la misma doble rendija?','¿Por qué el patrón demuestra que la luz es una onda?'],
 ev:[MC('La interferencia destructiva ocurre cuando…',['Una cresta coincide con un valle','Dos crestas coinciden','No hay ondas','Solo hay una onda'],0,'Las amplitudes se cancelan.'),MC('La difracción es…',['La desviación al pasar por una abertura','El rebote en un espejo','La absorción','La producción de calor'],0,'Las ondas se abren al pasar por aberturas.'),MC('Δy = λL/d indica que Δy…',['Aumenta si d disminuye','Aumenta si d aumenta','No depende de λ','Es siempre cero'],0,'Δy es inversa a d.')],
 conc:'Explica cómo cambian las franjas al variar λ y d, con tus datos.',lim:'Pantalla lejana (aproximación de campo lejano); modelo escalar sin pérdidas.'});

/* 39 */
const MDC={aire:['Aire',343,3,'el aire'],agua:['Agua',1480,60,'el agua'],tenso:['Hilo tenso',1800,40,'el hilo tenso'],acero:['Alambre de acero',5000,120,'el alambre'],flojo:['Hilo flojo',400,1.5,'el hilo flojo']};
add({c:'F08-009',n:'Teléfono de vasos: el sonido en sólidos y líquidos',tema:'Sonido · propagación',dif:2,
 obj:'Comparar el tiempo de viaje y la intensidad del sonido en aire, agua, hilos tensos, alambre y hilo flojo.',comp:[C1,C2,C3],
 evid:['Calcula la rapidez del sonido a partir de t y L.','Compara medios sólidos, líquidos y gaseosos.','Explica por qué un hilo flojo no transmite bien.'],
 teo:'El <b>sonido</b> es una onda mecánica longitudinal que necesita un medio. Su rapidez es mayor en sólidos que en líquidos y gases porque las partículas están más unidas: aire ≈ 343 m/s, agua ≈ 1480 m/s, acero ≈ 5000 m/s. El tiempo de viaje es <b>t = L/v</b>. Además, la <b>intensidad</b> disminuye con la distancia; en un hilo flojo se pierde casi toda. (Valores didácticos aproximados.)',
 mat:['Dos vasos','Hilo, alambre o tubo con agua','Cronómetro simulado'],
 cfg:{vis:'telefono',vars:[sel('medio','Medio entre los vasos',Object.entries(MDC).map(([k,x])=>[k,x[0]])),rg('L','Distancia L','m',2,20,2,6)],
  outs:[{id:'t',n:'Tiempo de viaje',u:'ms',d:2},{id:'amp',n:'Intensidad recibida',u:'%',d:1}],tabla:['medio','L','t','amp'],
  fx:v=>{const m=MDC[v.medio];return{t:v.L/m[1]*1000,amp:100*Math.exp(-v.L/m[2]),_n:m[3],_sag:v.medio==='flojo'?18:3,_res:{t:0.01,amp:0.5},_sd:{t:0.02,amp:0.5}}},
  graf:{x:'L',y:'t',nx:'L (m)',ny:'t (ms)',origen:true,u:'ms/m'},
  tareas:[{t:'valor',txt:'Con AIRE, mide t para varias distancias. La pendiente de t contra L está en ms/m; calcula la rapidez v = 1000 ÷ pendiente (m/s).',ans:343,tol:0.06,u:'m/s',pista:'Registra al menos 5 distancias con aire'},{t:'valor',txt:'Con HILO TENSO y L = 20 m, ¿cuánto tarda el sonido (ms)?',ans:11.1,tolA:0.6,u:'ms'},{t:'valor',txt:'Con HILO TENSO y L = 10 m, ¿qué porcentaje de la intensidad llega al otro vaso?',ans:77.9,tolA:3,u:'%'}],
  retos:[R('El sonido viaja más rápido en…',['Sólidos','Gases','El vacío','Todos igual'],'Las partículas están más unidas.'),R('En el vacío el sonido…',['No se propaga','Va más rápido','Va igual que en el aire','Se amplifica'],'Necesita un medio material.'),R('Un hilo flojo transmite mal porque…',['No puede transmitir la vibración','Es muy rápido','Es muy pesado','Produce luz'],'La vibración se disipa en el hilo sin tensión.')]},
 ana:['¿Por qué se tensa el hilo en un teléfono de vasos?','¿Cómo se explica que se oiga primero el golpe por el riel que por el aire?'],
 ev:[MC('El sonido es una onda…',['Mecánica longitudinal','Electromagnética','Transversal en el aire','Luminosa'],0,'Requiere medio material.'),MC('t = L/v permite calcular…',['El tiempo de viaje','La frecuencia','La masa','El volumen'],0,'Tiempo = distancia ÷ rapidez.'),MC('El orden de rapidez es…',['Sólido > líquido > gas','Gas > líquido > sólido','Todos iguales','Líquido > sólido > gas'],0,'Las partículas más cercanas transmiten antes.')],
 conc:'Explica cómo cambia la rapidez del sonido entre medios y por qué.',lim:'Rapideces y atenuaciones aproximadas con fines didácticos; no incluyen dispersión.'});

/* 40 */
add({c:'F08-010',n:'El sonido en el vacío (campana de vacío)',tema:'Sonido · medio material',dif:2,
 obj:'Disminuir la presión del aire en una campana y comprobar que el sonido necesita materia para propagarse.',comp:[C1,C2,C3],
 evid:['Relaciona el nivel sonoro con la presión del aire.','Interpreta una gráfica semilogarítmica.','Concluye que el sonido no se propaga en el vacío.'],
 teo:'El sonido es vibración de las partículas del medio. Si se extrae el aire de una campana, hay menos partículas que transmitan la vibración y el sonido se apaga; en el <b>vacío</b> no se propaga (a diferencia de la luz). En este modelo el nivel sonoro es <b>L = 70 + 20·log<sub>10</sub>(p/101)</b> dB, con p en kPa: cada vez que la presión se divide entre 10, el nivel baja 20 dB.',
 mat:['Campana de vacío','Bomba de vacío','Timbre','Sonómetro'],
 cfg:{vis:'vacio',vars:[rg('p','Presión del aire','kPa',1,101,1,101)],
  outs:[{id:'L',n:'Nivel sonoro',u:'dB',d:1}],tabla:['p','L'],
  fx:v=>{const L=70+20*Math.log10(v.p/101);return{L,frac:Math.max(0,L-25)/45,_res:{L:0.1},_sd:{L:0.3}}},
  graf:{x:'p',y:'L',fx:p=>Math.log10(p),nx:'log₁₀ p',ny:'L (dB)',u:'dB por década'},
  tareas:[{t:'valor',txt:'Mide el nivel sonoro para al menos 6 presiones entre 1 y 101 kPa. ¿Cuál es la pendiente de L contra log₁₀(p)?',ans:20,tolA:1.5,u:'dB',pista:'Debe ser cercana a 20'},{t:'valor',txt:'Con p = 50 kPa, ¿cuál es el nivel sonoro (dB)?',ans:63.9,tolA:1,u:'dB'},{t:'meta',txt:'Reduce la presión hasta que el nivel sonoro sea menor que 36 dB.',check:(v,o)=>{const ok=o.L<36;return{ok,msg:ok?'Casi no se oye: hay muy poco aire.':'Aún se oye bastante; baja más la presión.'}}}],
  retos:[R('Al sacar el aire de la campana, el timbre se oye…',['Cada vez más débil','Cada vez más fuerte','Igual','Con otro color'],'Hay menos partículas que transmitan el sonido.'),R('En el vacío perfecto el sonido…',['No se propaga','Se propaga más rápido','Se propaga igual','Se amplifica'],'No hay medio material.'),R('La luz del Sol llega a la Tierra y el sonido no porque…',['La luz no necesita medio material','El sonido es más rápido','La luz es mecánica','El sonido es electromagnético'],'La luz es una onda electromagnética.')]},
 ana:['¿Por qué en el espacio no se escucha una explosión?','¿Qué ocurre con el timbre cuando entra aire de nuevo?'],
 ev:[MC('El sonido necesita…',['Un medio material','Vacío','Luz','Electricidad'],0,'Es una onda mecánica.'),MC('En la campana, al bajar la presión el nivel sonoro…',['Disminuye','Aumenta','No cambia','Se hace infinito'],0,'Menos partículas, menos transmisión.'),MC('Una disminución de 20 dB corresponde a dividir la presión entre…',['10','2','20','100'],0,'20·log₁₀(10) = 20.')],
 conc:'Explica qué demuestra el experimento y cómo lo sustentan tus datos.',lim:'Modelo logarítmico simplificado del nivel sonoro; no considera la transmisión por el soporte de la campana.'});

/* 41 */
add({c:'F08-011',n:'Tono y frecuencia: la botella sonora',tema:'Sonido · tono',dif:3,
 obj:'Soplar sobre una botella con distintos niveles de agua y relacionar el tono con la longitud de la columna de aire.',comp:[C1,C2,C3],
 evid:['Relaciona frecuencia y longitud de la columna de aire.','Obtiene v/4 como pendiente de f contra 1/L.','Predice el nivel de agua para un tono dado.'],
 teo:'El <b>tono</b> depende de la <b>frecuencia</b> (Hz): agudo = frecuencia alta. La columna de aire en una botella es un tubo cerrado en un extremo cuya frecuencia fundamental es <b>f = v/(4·L)</b>, con v ≈ 343 m/s y L la longitud de la columna de aire. Al agregar agua L disminuye y el tono sube. Una gráfica f contra 1/L es una recta con pendiente v/4 ≈ 85,75 Hz·m.',
 mat:['Botella de 25 cm','Agua','Aplicación de afinador'],
 cfg:{vis:'botella2',vars:[rg('w','Nivel de agua','cm',0,22,1,0)],
  outs:[{id:'f',n:'Frecuencia del sonido',u:'Hz',d:0}],tabla:['w','f'],
  fx:v=>({f:343/(4*(0.25-v.w/100)),_res:{f:1},_sd:{f:3}}),
  graf:{x:'w',y:'f',fx:w=>1/((25-w)/100),nx:'1/L (m⁻¹)',ny:'f (Hz)',origen:true,u:'Hz·m'},
  tareas:[{t:'valor',txt:'Mide f para al menos 6 niveles de agua. ¿Cuánto vale la pendiente de f contra 1/L (Hz·m)?',ans:85.75,tol:0.07,u:'Hz·m',pista:'La pendiente es v/4'},{t:'valor',txt:'Con el agua a 10 cm, ¿qué frecuencia (Hz) se produce?',ans:571.7,tol:0.03,u:'Hz'},{t:'valor',txt:'¿A qué nivel de agua (cm) se produce un sonido de 800 Hz? (puede tener decimales)',ans:14.3,tolA:0.7,u:'cm',pista:'L = 343/(4·800) m; agua = 25 − L'}],
  retos:[R('Al echar más agua en la botella, el sonido se vuelve…',['Más agudo','Más grave','Igual','Inaudible'],'L disminuye y f aumenta.'),R('Un tono agudo tiene…',['Frecuencia alta','Frecuencia baja','Amplitud baja','Rapidez baja'],'El tono depende de la frecuencia.'),R('En una botella (tubo cerrado), f = v/(4L) porque…',['La longitud equivale a un cuarto de longitud de onda','L es media longitud de onda','L es una longitud de onda','L no importa'],'Fundamental del tubo cerrado: L = λ/4.')]},
 ana:['¿Por qué una botella con más agua suena más aguda?','¿Cómo usarías esto para afinar una botella con una nota musical?'],
 ev:[MC('El tono depende de…',['La frecuencia','La amplitud','La temperatura del color','La masa'],0,'Mayor frecuencia, tono más agudo.'),MC('La rapidez del sonido en el aire es de aproximadamente…',['343 m/s','34 m/s','3430 m/s','3·10⁸ m/s'],0,'A 20 °C.'),MC('Si L se reduce a la mitad, f…',['Se duplica','Se reduce a la mitad','No cambia','Se cuadruplica'],0,'f es inversamente proporcional a L.')],
 conc:'Explica la relación entre el nivel de agua y el tono, respaldándote con tu gráfica.',lim:'Tubo cerrado ideal sin corrección de extremo; v = 343 m/s.'});

/* 42 */
const Q=50,F0=440,AR=f=>100/Math.sqrt(1+Q*Q*Math.pow(f/F0-F0/f,2));
add({c:'F08-012',n:'Resonancia con diapasones',tema:'Sonido · resonancia',dif:2,
 obj:'Hacer vibrar un segundo diapasón por resonancia y estudiar cómo depende su respuesta de la diferencia de frecuencias.',comp:[C1,C2,C3],
 evid:['Explica la resonancia como vibración forzada.','Identifica la frecuencia de máxima respuesta.','Interpreta el ancho de la curva de resonancia.'],
 teo:'Un cuerpo tiene una <b>frecuencia natural</b>. Si recibe vibraciones con esa misma frecuencia, su amplitud crece mucho: es la <b>resonancia</b>. Un diapasón de 440 Hz hace vibrar a otro idéntico, pero casi nada a uno de 400 Hz. La respuesta es máxima cuando f<sub>B</sub> = 440 Hz y decae rápido al separarse de ese valor. La resonancia explica desde las cajas de guitarras hasta el colapso de puentes.',
 mat:['Dos diapasones de 440 Hz','Un diapasón de otra frecuencia','Caja de resonancia'],
 cfg:{vis:'diapason',vars:[rg('fb','Frecuencia del 2.º diapasón','Hz',400,480,2,400)],
  outs:[{id:'A',n:'Amplitud del 2.º diapasón',u:'%',d:0}],tabla:['fb','A'],
  fx:v=>({A:AR(v.fb),_res:{A:1},_sd:{A:1}}),
  tareas:[{t:'meta',txt:'Ajusta el 2.º diapasón para obtener la máxima respuesta (resonancia).',check:(v,o)=>{const ok=v.fb===440;return{ok,msg:ok?'¡Resonancia! Ambos diapasones tienen 440 Hz.':'Aún no. Busca la frecuencia donde la amplitud sea máxima.'}}},{t:'valor',txt:'Con el 2.º diapasón en 436 Hz, ¿qué amplitud (%) tiene?',ans:()=>AR(436),tolA:3.5,u:'%'},{t:'valor',txt:'Por encima de 440 Hz, ¿a qué frecuencia (Hz) la amplitud cae a la mitad (50 %)? Aproxima con el control.',ans:()=>F0*((Math.sqrt(3)/Q+Math.sqrt(3/(Q*Q)+4))/2),tolA:2.5,u:'Hz'}],
  retos:[R('La resonancia ocurre cuando la frecuencia de la fuerza coincide con…',['La frecuencia natural del cuerpo','El doble de la natural','La mitad de la natural','La amplitud'],'Es la condición de resonancia.'),R('Un diapasón de 440 Hz y otro de 400 Hz…',['Casi no resuenan','Resuenan al máximo','Se destruyen','Producen luz'],'Están lejos de resonar.'),R('Un ejemplo de resonancia es…',['Una copa que se rompe con un sonido agudo','Una piedra cayendo','Un imán','Una sombra'],'Con la frecuencia natural del vidrio.')]},
 ana:['¿Por qué el segundo diapasón empieza a sonar sin tocarlo?','¿Qué riesgos tiene la resonancia en puentes y edificios?'],
 ev:[MC('La resonancia produce…',['Gran amplitud de vibración','Menor amplitud','Cero amplitud','Luz'],0,'La energía se transfiere eficientemente.'),MC('La frecuencia natural es…',['La de vibración libre del cuerpo','La del ruido ambiente','La del oyente','Siempre 100 Hz'],0,'Depende de las características del cuerpo.'),MC('Con diferencias grandes de frecuencia, la amplitud…',['Es pequeña','Es máxima','Es infinita','No existe'],0,'No hay transferencia efectiva.')],
 conc:'Explica qué es la resonancia y qué evidencia obtuviste.',lim:'Respuesta tipo oscilador amortiguado con factor de calidad 50; sin interacciones con el aire de la sala.'});

/* 43 */
add({c:'F08-013',n:'Velocidad del sonido por el eco',tema:'Sonido · rapidez',dif:2,
 obj:'Medir el tiempo de ida y vuelta de un eco para hallar la rapidez del sonido y cómo cambia con la temperatura.',comp:[C1,C2,C3],
 evid:['Aplica t = 2d/v.','Obtiene v como 2 ÷ pendiente de t contra d.','Relaciona la rapidez con la temperatura del aire.'],
 teo:'Un <b>eco</b> es el sonido reflejado que se oye después del original. Como el sonido va y vuelve, <b>t = 2d/v</b>. La rapidez del sonido en el aire depende de la temperatura: <b>v ≈ 331,4 + 0,6·T</b> (m/s, T en °C). A 20 °C vale 343,4 m/s. Una gráfica de t contra d es una recta con pendiente 2/v. (El oído distingue un eco si llega al menos 0,1 s después.)',
 mat:['Pared grande y lejana','Cronómetro','Cinta métrica'],
 cfg:{vis:'eco',vars:[rg('d','Distancia a la pared','m',20,120,5,50),rg('T','Temperatura del aire','°C',0,40,5,20)],
  outs:[{id:'t',n:'Tiempo de ida y vuelta',u:'s',d:3}],tabla:['d','T','t'],
  fx:v=>{const vel=331.4+0.6*v.T;return{t:2*v.d/vel,_res:{t:0.001},_sd:{t:0.002}}},
  graf:{x:'d',y:'t',fy:t=>t*1000,nx:'d (m)',ny:'t (ms)',origen:true,u:'ms/m'},
  tareas:[{t:'valor',txt:'Con T = 20 °C, mide t para varias distancias. La pendiente de t (ms) contra d (m) es 2000/v. Calcula v = 2000 ÷ pendiente (m/s).',ans:343.4,tol:0.03,u:'m/s',pista:'Fija T = 20 °C y registra al menos 5 distancias'},{t:'valor',txt:'A 20 °C, ¿cuánto tarda en volver el eco de una pared a 85 m (s)?',ans:0.495,tolA:0.012,u:'s'},{t:'valor',txt:'A 0 °C, mide t para d = 100 m y calcula la rapidez del sonido (m/s).',ans:331.4,tol:0.025,u:'m/s',pista:'v = 2d/t'}],
  retos:[R('Un eco se produce por…',['Reflexión del sonido','Refracción de la luz','Absorción','Polarización'],'El sonido rebota en una superficie.'),R('Si la pared está al doble de distancia, el tiempo del eco…',['Se duplica','Se reduce a la mitad','Igual','Se cuadruplica'],'t = 2d/v.'),R('Al subir la temperatura del aire, la rapidez del sonido…',['Aumenta','Disminuye','No cambia','Se anula'],'v ≈ 331,4 + 0,6·T.')]},
 ana:['¿Por qué se usa 2d y no d?','¿Cómo usan el eco los murciélagos y los sonares?'],
 ev:[MC('t = 2d/v porque el sonido…',['Va y vuelve','Va dos veces más rápido','Se duplica','Se absorbe'],0,'Recorre la distancia dos veces.'),MC('A 20 °C la rapidez del sonido es cercana a…',['343 m/s','34 m/s','3430 m/s','300 000 km/s'],0,'331,4 + 0,6·20.'),MC('El sonar emplea…',['Ecos del sonido','Ecos de la luz','Imanes','Resortes'],0,'Mide el tiempo del eco bajo el agua.')],
 conc:'Explica cómo calculaste la rapidez del sonido con el eco y qué influye en ella.',lim:'Aire en reposo, sin viento; v lineal con la temperatura.'});

/* 44 */
const AT=(L,f)=>{const lam=343/f*100;let a=0;for(let n=1;n<=4;n++){const Lr=(2*n-1)*lam/4,d=(L-Lr)/(0.035*lam);a=Math.max(a,Math.exp(-d*d))}return a};
add({c:'F08-014',n:'Tubo de resonancia',tema:'Sonido · ondas estacionarias',dif:3,
 obj:'Encontrar las longitudes de un tubo cerrado en que resuena un diapasón y calcular la rapidez del sonido.',comp:[C1,C2,C3],
 evid:['Identifica posiciones de resonancia L₁ y L₂.','Calcula v = 4·f·L₁.','Relaciona λ con la longitud del tubo.'],
 teo:'En un tubo cerrado por el agua se forman <b>ondas estacionarias</b>. Hay resonancia (el sonido se refuerza) cuando la longitud de aire es un múltiplo impar de un cuarto de la longitud de onda: <b>L = λ/4, 3λ/4, 5λ/4…</b> De L<sub>1</sub> = λ/4 se obtiene <b>v = 4·f·L<sub>1</sub></b>; además L<sub>2</sub> − L<sub>1</sub> = λ/2. Con f en Hz y L en m, v sale en m/s.',
 mat:['Tubo de vidrio con depósito de agua','Diapasones de 256 a 512 Hz'],
 cfg:{vis:'tubo',vars:[sel('f','Frecuencia del diapasón',[[256,'256 Hz (Do)'],[320,'320 Hz (Mi)'],[384,'384 Hz (Sol)'],[440,'440 Hz (La)'],[512,'512 Hz (Do agudo)']]),rg('L','Longitud de la columna de aire','cm',5,60,0.5,5)],
  outs:[{id:'A',n:'Volumen relativo',u:'',d:2}],tabla:['f','L','A'],
  fx:v=>({A:AT(v.L,v.f),_res:{A:0.01},_sd:{A:0.02}}),
  tareas:[{t:'valor',txt:'Con 440 Hz, busca la primera longitud donde el sonido es más fuerte (L₁) y calcula v = 4·f·L₁ (m/s). Recuerda pasar L₁ a metros.',ans:343,tol:0.06,u:'m/s',pista:'v = 4 × 440 × L₁ (en m)'},{t:'valor',txt:'Con 440 Hz, ¿en qué longitud (cm) ocurre la SEGUNDA resonancia (L₂ = 3λ/4)?',ans:58.5,tolA:1.8,u:'cm',pista:'λ = v/f'},{t:'valor',txt:'Con 256 Hz, ¿cuál es la primera longitud de resonancia (cm)?',ans:33.5,tolA:1.8,u:'cm'}],
  retos:[R('En un tubo cerrado, la primera resonancia ocurre cuando L es…',['λ/4','λ/2','λ','2λ'],'Nodo en el agua y vientre en la boca.'),R('Entre dos resonancias consecutivas, la longitud cambia en…',['λ/2','λ/4','λ','2λ'],'L₂ − L₁ = λ/2.'),R('Si la frecuencia sube, las longitudes de resonancia…',['Disminuyen','Aumentan','No cambian','Se anulan'],'λ = v/f es menor.')]},
 ana:['¿Por qué hay un nodo en la superficie del agua?','¿Cómo cambian las posiciones de resonancia al cambiar de diapasón?'],
 ev:[MC('Una onda estacionaria se forma por…',['Superposición de ondas que van y vuelven','Una onda sola','El silencio','Un imán'],0,'Interferencia de la onda y su reflejada.'),MC('v = 4·f·L₁ se usa en un tubo…',['Cerrado en un extremo','Abierto en ambos extremos','Sin aire','Con presión cero'],0,'L₁ = λ/4.'),MC('Si f = 512 Hz y v = 343 m/s, λ ≈',['0,67 m','1,5 m','0,17 m','3 m'],0,'λ = 343/512 ≈ 0,67 m.')],
 conc:'Explica cómo hallaste la rapidez del sonido con el tubo de resonancia.',lim:'Sin corrección de extremo del tubo; v = 343 m/s.'});

/* 45 */
add({c:'F08-015',n:'Efecto Doppler acústico',tema:'Sonido · efecto Doppler',dif:3,
 obj:'Comparar la frecuencia que percibe un observador cuando una fuente sonora se acerca y cuando se aleja.',comp:[C1,C2,C3],
 evid:['Explica por qué cambia la frecuencia percibida.','Calcula f_acerca y f_aleja con las fórmulas.','Relaciona el cambio con la rapidez de la fuente.'],
 teo:'Si una fuente sonora se mueve respecto al observador, este percibe una frecuencia distinta de la emitida (<b>efecto Doppler</b>). Con v = 343 m/s y la fuente a rapidez v<sub>s</sub>: se <b>acerca</b>: <b>f′ = f₀·v/(v − v<sub>s</sub>)</b> (más agudo); se <b>aleja</b>: <b>f′ = f₀·v/(v + v<sub>s</sub>)</b> (más grave). Por eso la sirena de una ambulancia cambia de tono al pasar.',
 mat:['Fuente sonora giratoria o móvil','Micrófono','Afinador'],
 cfg:{vis:'doppler',vars:[sel('f0','Frecuencia emitida',[[400,'400 Hz'],[500,'500 Hz'],[800,'800 Hz']]),rg('vs','Rapidez de la fuente','m/s',5,50,5,20)],
  outs:[{id:'fa',n:'Frecuencia cuando se acerca',u:'Hz',d:0},{id:'fl',n:'Frecuencia cuando se aleja',u:'Hz',d:0}],tabla:['f0','vs','fa','fl'],
  fx:v=>({fa:v.f0*343/(343-v.vs),fl:v.f0*343/(343+v.vs),_sh:v.vs/50*1.6+0.4,_res:{fa:1,fl:1},_sd:{fa:1.5,fl:1.5}}),
  tareas:[{t:'valor',txt:'Con f₀ = 500 Hz y rapidez 30 m/s, ¿qué frecuencia (Hz) percibe el observador cuando la fuente SE ACERCA?',ans:547.9,tolA:7,u:'Hz'},{t:'valor',txt:'Con los mismos valores (500 Hz, 30 m/s), ¿qué frecuencia (Hz) percibe cuando la fuente SE ALEJA?',ans:459.8,tolA:7,u:'Hz'},{t:'valor',txt:'Con f₀ = 800 Hz y rapidez 20 m/s, ¿cuánto vale la diferencia f_acerca − f_aleja (Hz)?',ans:93.6,tolA:10,u:'Hz'}],
  retos:[R('Cuando la fuente se acerca, el tono percibido es…',['Más agudo','Más grave','Igual','Inaudible'],'La frecuencia percibida aumenta.'),R('Cuando la fuente se aleja, la frecuencia percibida…',['Disminuye','Aumenta','No cambia','Se duplica'],'Las ondas llegan más espaciadas.'),R('Si la fuente está en reposo, f′ es…',['Igual a f₀','Mayor que f₀','Menor que f₀','Cero'],'No hay efecto Doppler.')]},
 ana:['¿Por qué la sirena de una ambulancia suena más grave al alejarse?','¿Qué usos tiene el efecto Doppler (radar, medicina)?'],
 ev:[MC('El efecto Doppler es un cambio en…',['La frecuencia percibida','La rapidez del sonido en el aire','La masa de la fuente','El color'],0,'Depende del movimiento relativo.'),MC('Una fuente que se acerca produce una frecuencia percibida…',['Mayor','Menor','Igual','Nula'],0,'Se acortan las longitudes de onda recibidas.'),MC('Al aumentar la rapidez de la fuente, la diferencia entre acercarse y alejarse…',['Aumenta','Disminuye','Es cero','No existe'],0,'Mayor corrimiento de frecuencia.')],
 conc:'Explica por qué cambia el tono percibido y qué mide la rapidez de la fuente.',lim:'Observador en reposo, aire sin viento y v = 343 m/s; la fuente se mueve en línea recta con el observador.'});

return L})();
