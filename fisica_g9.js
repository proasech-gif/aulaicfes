/* AULA360 — Catálogo de Física · NOVENO (laboratorios 46–60 del inventario): óptica y electromagnetismo. */
window.FIS_G9=(function(){
const L=[];
const fm=(v,d)=>(+v).toFixed(d).replace('.',',');
const C1='Uso comprensivo del conocimiento científico',C2='Explicación de fenómenos',C3='Indagación';
const PV='Por verificar con los DBA oficiales del MEN (no se inventan códigos).',EST='Por verificar con los Estándares Básicos de Competencias del MEN.';
const MC=(q,o,ok,fb)=>({q,o,ok,fb});
const add=o=>{o.g=9;o.dba=PV;o.est=EST;o.area='Física';o.mot='banco';o.no=+o.c.slice(-3)+45;
 if(!o.proc){const k=(o.cfg.tareas||[]).length;o.proc=[{t:'Cambia los controles y observa el dibujo.',a:'cambia',n:3}];if(!o.cfg.sinMedir)o.proc.push({t:'Mide y registra al menos 5 datos en la tabla.',a:'mide',n:5});if(k)o.proc.push({t:'Completa las tareas (comprueba cada una).',a:'tarea_ok',n:k});o.proc.push({t:'Resuelve los retos.',a:'todo_ok'})}
 L.push(o)};
const sel=(id,n,opts)=>({id,n,tipo:'sel',opts});
const rg=(id,n,u,min,max,step,v)=>({id,n,u,min,max,step,v});
const R=(q,o,why)=>({q,o,ok:0,why});
const rad=a=>a*Math.PI/180,deg=r=>r*180/Math.PI;

/* 46 */
add({c:'F09-001',n:'Cámara estenopeica (cámara oscura)',tema:'Óptica · propagación rectilínea',dif:2,
 obj:'Construir una cámara con un orificio pequeño y comprobar que la luz viaja en línea recta y forma una imagen invertida.',comp:[C1,C2,C3],
 evid:['Explica por qué la imagen es invertida.','Aplica la semejanza de triángulos h<sub>i</sub>/h<sub>o</sub> = d<sub>p</sub>/d<sub>o</sub>.','Relaciona el tamaño del orificio con la nitidez.'],
 teo:'La luz se propaga en <b>línea recta</b> en un medio homogéneo. Por un orificio pequeño pasan rayos que se cruzan y forman en la pantalla una imagen <b>invertida</b>. Por semejanza de triángulos: <b>h<sub>i</sub> / h<sub>o</sub> = d<sub>p</sub> / d<sub>o</sub></b>, con d<sub>o</sub> la distancia del objeto al orificio y d<sub>p</sub> la del orificio a la pantalla. Un orificio muy grande produce una imagen borrosa (cada punto del objeto forma una mancha).',
 mat:['Caja oscura o tubo','Papel de calco','Alfiler','Vela o linterna como objeto'],
 cfg:{vis:'estenopeica',vars:[rg('do','Distancia objeto–orificio','cm',20,100,10,50),rg('ho','Altura del objeto','cm',5,20,5,10),rg('dp','Distancia orificio–pantalla','cm',5,20,5,10),rg('d','Diámetro del orificio','mm',0.5,3,0.5,1)],
  outs:[{id:'hi',n:'Altura de la imagen',u:'cm',res:0.05,d:2},{id:'bl',n:'Borrosidad del borde',u:'mm',res:0.05,d:2}],tabla:['do','ho','dp','d','hi','bl'],
  fx:v=>({hi:v.ho*v.dp/v.do,bl:v.d*(1+v.dp/v.do),_res:{hi:0.05,bl:0.05},_sd:{hi:0.04,bl:0.02}}),
  graf:{x:'dp',y:'hi',nx:'dₚ (cm)',ny:'hᵢ (cm)',origen:true,u:'cm/cm'},
  tareas:[{t:'valor',txt:'Con objeto de 10 cm a 50 cm y pantalla a 10 cm, ¿qué altura tiene la imagen (cm)?',ans:2,tolA:0.2,u:'cm'},{t:'valor',txt:'Con objeto de 10 cm a 40 cm, mide hᵢ para varias distancias a la pantalla (borra la tabla). ¿Cuál es la pendiente (hᵢ/dₚ)?',ans:0.25,tolA:0.03,u:'',pista:'La pendiente es hₒ/dₒ'},{t:'valor',txt:'Un árbol de 20 cm (modelo) está a 60 cm. ¿A qué distancia de la pantalla (cm) debe estar el orificio para obtener una imagen de 4 cm?',ans:12,tolA:0.6,u:'cm',pista:'hᵢ/hₒ = dₚ/dₒ'},{t:'meta',txt:'Consigue una imagen nítida: borrosidad menor o igual a 0,6 mm.',check:(v,o)=>{const ok=o.bl<=0.6;return{ok,msg:ok?'Imagen nítida: orificio pequeño y pantalla cercana.':'Reduce el diámetro del orificio y acerca la pantalla.'}}}],
  retos:[R('La imagen en la cámara estenopeica sale invertida porque…',['Los rayos se cruzan en el orificio','La luz rebota','El orificio es de vidrio','La pantalla gira'],'La luz viaja en línea recta y se cruza.'),R('Si el objeto se aleja, la imagen…',['Se hace más pequeña','Se hace más grande','No cambia','Desaparece'],'hᵢ = hₒ·dₚ/dₒ.'),R('Un orificio muy grande produce una imagen…',['Más brillante pero borrosa','Más nítida','Invertida dos veces','Sin luz'],'Cada punto forma una mancha.')]},
 ana:['¿Qué ventaja y qué desventaja tiene agrandar el orificio?','¿Cómo explica este experimento que las sombras tengan bordes rectos?'],
 ev:[MC('La luz se propaga…',['En línea recta','En zigzag','Solo en el agua','Solo hacia abajo'],0,'En medios homogéneos.'),MC('La imagen de la cámara oscura es…',['Real e invertida','Virtual y derecha','Virtual e invertida','Derecha y real'],0,'Se forma sobre la pantalla.'),MC('Si dₚ se duplica, hᵢ…',['Se duplica','Se reduce a la mitad','No cambia','Se cuadruplica'],0,'hᵢ es proporcional a dₚ.')],
 conc:'Explica cómo se forma la imagen y cómo depende de las distancias.',lim:'Orificio puntual ideal; se ignora la difracción en orificios muy pequeños.'});

/* 47 */
add({c:'F09-002',n:'Leyes de la reflexión de la luz',tema:'Óptica · reflexión',dif:1,
 obj:'Medir los ángulos de incidencia y de reflexión de un rayo láser en un espejo plano y comprobar las leyes de la reflexión.',comp:[C1,C2,C3],
 evid:['Mide ángulos respecto a la normal.','Verifica que el ángulo de reflexión es igual al de incidencia.','Distingue ángulo con la normal y ángulo con la superficie.'],
 teo:'Leyes de la <b>reflexión</b>: (1) el rayo incidente, el reflejado y la <b>normal</b> están en un mismo plano; (2) el <b>ángulo de reflexión es igual al de incidencia</b>: <b>r = i</b>. Ambos se miden respecto a la normal, la recta perpendicular al espejo. Una incidencia normal (i = 0°) devuelve el rayo sobre sí mismo.',
 mat:['Espejo plano','Puntero láser','Transportador','Hoja blanca'],
 cfg:{vis:'espejo',vars:[rg('ang','Ángulo de incidencia','°',0,80,5,30)],
  outs:[{id:'r',n:'Ángulo de reflexión (medido)',u:'°',d:1}],tabla:['ang','r'],
  fx:v=>({r:v.ang,_res:{r:0.5},_sd:{r:0.4}}),
  graf:{x:'ang',y:'r',nx:'i (°)',ny:'r (°)',origen:true,u:''},
  tareas:[{t:'valor',txt:'Mide r para al menos 6 ángulos de incidencia. ¿Cuál es la pendiente de la gráfica r contra i?',ans:1,tolA:0.05,u:'',pista:'Si r = i la pendiente es 1'},{t:'valor',txt:'Con i = 35°, ¿qué ángulo de reflexión (°) mides?',ans:35,tolA:1.6,u:'°'},{t:'valor',txt:'Con i = 30°, ¿qué ángulo forma el rayo reflejado con la superficie del espejo (°)?',ans:60,tolA:1.5,u:'°',pista:'Es el complemento del ángulo con la normal'},{t:'meta',txt:'Haz que el rayo láser regrese exactamente por donde llegó.',check:(v,o)=>{const ok=v.ang===0;return{ok,msg:ok?'Con incidencia normal (0°) el rayo regresa sobre sí mismo.':'Debe incidir perpendicularmente al espejo.'}}}],
  retos:[R('El ángulo de reflexión es igual al ángulo de…',['Incidencia','Refracción','La superficie','90°'],'r = i.'),R('Los ángulos de incidencia y reflexión se miden respecto a…',['La normal','El espejo','El suelo','El láser'],'La normal es perpendicular al espejo.'),R('Si i = 0°, el rayo reflejado…',['Regresa sobre sí mismo','Sale a 90°','Desaparece','Sigue derecho'],'Incide perpendicularmente.')]},
 ana:['¿Por qué se usa la normal y no el espejo para medir los ángulos?','¿Dónde se aprovecha la reflexión (periscopios, retrovisores)?'],
 ev:[MC('La reflexión especular ocurre en…',['Superficies lisas','Superficies muy rugosas únicamente','El vacío','Líquidos opacos'],0,'En una superficie pulida los rayos reflejados quedan paralelos.'),MC('Si i = 40°, r =',['40°','50°','80°','0°'],0,'r = i.'),MC('El rayo incidente, el reflejado y la normal están…',['En un mismo plano','En planos distintos','Siempre paralelos','Sin relación'],0,'Es la primera ley.')],
 conc:'Explica cómo comprobaste que r = i con tus datos.',lim:'Espejo plano ideal; el ruido de lectura simula la imprecisión del transportador.'});

/* 48 */
add({c:'F09-003',n:'Imágenes en espejos angulares',tema:'Óptica · espejos planos',dif:2,
 obj:'Contar las imágenes que forman dos espejos planos según el ángulo entre ellos y hallar la relación n = 360°/α − 1.',comp:[C1,C2,C3],
 evid:['Cuenta imágenes para distintos ángulos.','Obtiene la relación n = 360°/α − 1.','Predice el número de imágenes para un ángulo dado.'],
 teo:'Dos espejos planos unidos por un borde forman varias <b>imágenes</b> de un objeto (cada imagen se refleja en el otro espejo). Si el ángulo α entre los espejos divide exactamente a 360°, el número de imágenes es <b>n = 360°/α − 1</b>. Con α = 90° hay 3 imágenes (el «espejo de esquina»); con α = 180° (un solo espejo plano) hay 1; con α pequeño hay muchas (caleidoscopio).',
 mat:['Dos espejos planos','Transportador','Objeto pequeño'],
 cfg:{vis:'espejos2',vars:[sel('alpha','Ángulo entre los espejos',[[30,'30°'],[45,'45°'],[60,'60°'],[72,'72°'],[90,'90°'],[120,'120°'],[180,'180°']])],
  outs:[{id:'n',n:'Número de imágenes',u:'',res:1,d:0}],tabla:['alpha','n'],
  fx:v=>({n:Math.round(360/v.alpha-1),_res:{n:1},_sd:{n:0}}),
  graf:{x:'alpha',y:'n',fx:a=>360/a,nx:'360°/α',ny:'n',u:''},
  tareas:[{t:'valor',txt:'Con espejos a 60°, ¿cuántas imágenes se forman?',ans:5,tolA:0.1,u:''},{t:'valor',txt:'Con espejos a 90°, ¿cuántas imágenes se forman?',ans:3,tolA:0.1,u:''},{t:'valor',txt:'Registra todos los ángulos disponibles y mira la gráfica n contra 360°/α. ¿Cuál es la pendiente?',ans:1,tolA:0.05,u:'',pista:'n = 360/α − 1'},{t:'valor',txt:'¿Qué ángulo (°) entre los espejos produce 11 imágenes?',ans:30,tolA:0.5,u:'°',pista:'360/α = 12'}],
  retos:[R('Con un solo espejo plano (180°) se forma…',['1 imagen','2 imágenes','3 imágenes','Ninguna'],'360/180 − 1 = 1.'),R('Al disminuir el ángulo entre los espejos, el número de imágenes…',['Aumenta','Disminuye','No cambia','Es cero'],'n = 360/α − 1.'),R('Un caleidoscopio usa espejos con ángulo…',['Pequeño','Grande','De 180°','De 0 siempre perpendicular'],'Para muchas imágenes simétricas.')]},
 ana:['¿Por qué las imágenes están sobre una circunferencia centrada en el borde común?','¿Qué pasa cuando 360° no es múltiplo exacto de α?'],
 ev:[MC('Con α = 45° hay…',['7 imágenes','8 imágenes','4 imágenes','3 imágenes'],0,'360/45 − 1 = 7.'),MC('La fórmula n = 360°/α − 1 funciona si…',['360° es múltiplo de α','α es 0','Hay un espejo curvo','El objeto está fuera'],0,'Número entero de reflexiones.'),MC('El «espejo de esquina» tiene α =',['90°','45°','180°','30°'],0,'Forma 3 imágenes.')],
 conc:'Explica la relación entre el ángulo y el número de imágenes con tus datos.',lim:'Solo ángulos que dividen exactamente a 360°; objeto sobre la bisectriz.'});

/* 49 */
const ESF={c1:['Cóncavo A',10],c2:['Cóncavo B',15],v1:['Convexo',-12]};
add({c:'F09-004',n:'Espejos esféricos: foco e imágenes',tema:'Óptica · espejos curvos',dif:3,
 obj:'Hallar la distancia focal de espejos cóncavos y convexos y reconocer cuándo forman imágenes reales o virtuales.',comp:[C1,C2,C3],
 evid:['Aplica 1/f = 1/dₒ + 1/dᵢ.','Obtiene f como inverso del intercepto de la gráfica.','Clasifica imágenes en reales/virtuales y derechas/invertidas.'],
 teo:'Un espejo esférico tiene <b>foco</b> F a una distancia f del espejo. Ecuación de los espejos: <b>1/f = 1/d<sub>o</sub> + 1/d<sub>i</sub></b> y aumento <b>m = −d<sub>i</sub>/d<sub>o</sub></b>. Convención: f &gt; 0 en el cóncavo y f &lt; 0 en el convexo; d<sub>i</sub> &gt; 0 imagen <b>real</b> (delante del espejo, invertida), d<sub>i</sub> &lt; 0 imagen <b>virtual</b> (detrás, derecha). Si d<sub>o</sub> = f no se forma imagen (rayos paralelos).',
 mat:['Espejo cóncavo y convexo','Vela','Pantalla','Regla óptica'],
 cfg:{vis:'optica',vars:[sel('esp','Espejo',Object.entries(ESF).map(([k,x])=>[k,x[0]])),rg('do','Distancia del objeto','cm',5,60,5,30)],
  outs:[{id:'di',n:'Distancia de la imagen',u:'cm',d:1},{id:'m',n:'Aumento',u:'',d:2}],tabla:['esp','do','di','m'],
  fx:v=>{const f=ESF[v.esp][1],inv=1/f-1/v.do;if(Math.abs(inv)<1e-9)return{_kind:'espejo',_f:f,_t:ESF[v.esp][0]+': el objeto está en el foco, no hay imagen'};const di=1/inv;return{di,m:-di/v.do,_kind:'espejo',_f:f,_t:ESF[v.esp][0]+' (f = '+(f>0?'+':'−')+Math.abs(f)+' cm)',_res:{di:0.1,m:0.01},_sd:{di:0.15,m:0.01}}},
  graf:{x:'do',y:'di',fx:d=>1/d,fy:d=>1/d,nx:'1/dₒ (cm⁻¹)',ny:'1/dᵢ (cm⁻¹)',u:'cm⁻¹'},
  tareas:[{t:'valor',txt:'Con el CÓNCAVO A, mide dᵢ para varias dₒ (borra la tabla antes). La gráfica 1/dᵢ contra 1/dₒ tiene intercepto 1/f. Calcula f (cm).',ans:10,tol:0.08,u:'cm',pista:'f = 1 ÷ intercepto'},{t:'valor',txt:'Con el CÓNCAVO B y dₒ = 45 cm, ¿cuál es dᵢ (cm)?',ans:22.5,tolA:1.3,u:'cm'},{t:'valor',txt:'Con el CONVEXO y dₒ = 30 cm, ¿cuánto vale dᵢ (cm)? Escribe el signo.',ans:-8.57,tolA:0.6,u:'cm',pista:'Negativo significa imagen virtual'},{t:'valor',txt:'Con el CÓNCAVO A y dₒ = 30 cm, ¿cuánto vale el aumento m?',ans:-0.5,tolA:0.06,u:'',pista:'m = −dᵢ/dₒ'}],
  retos:[R('Un espejo cóncavo con el objeto más allá del foco forma una imagen…',['Real e invertida','Virtual y derecha','Virtual e invertida','Real y derecha'],'dᵢ es positiva.'),R('El espejo convexo siempre forma imágenes…',['Virtuales y más pequeñas','Reales','Invertidas','Más grandes'],'Se usa en retrovisores por su campo amplio.'),R('Si el objeto está en el foco de un cóncavo…',['No se forma imagen','La imagen es enorme y real','La imagen es virtual','El espejo se vuelve plano'],'Los rayos reflejados salen paralelos.')]},
 ana:['¿Por qué el espejo convexo se usa en retrovisores y tiendas?','¿Qué significa que dᵢ sea negativa?'],
 ev:[MC('La ecuación de los espejos es…',['1/f = 1/dₒ + 1/dᵢ','f = dₒ·dᵢ','f = dₒ + dᵢ','1/f = dₒ·dᵢ'],0,'Relaciona f, dₒ y dᵢ.'),MC('Una imagen virtual…',['Se forma detrás del espejo','Se proyecta en una pantalla','Siempre es invertida','No existe'],0,'No se puede proyectar.'),MC('El foco de un espejo cóncavo está…',['Delante del espejo','Detrás del espejo','En el espejo','Infinitamente lejos'],0,'f > 0 en el cóncavo.')],
 conc:'Explica cómo hallaste el foco y cuándo la imagen es real o virtual.',lim:'Espejos delgados con rayos paraxiales (sin aberración esférica).'});

/* 50 */
const MEDS=[[1.33,'Agua (n = 1,33)'],[1.49,'Acrílico (n = 1,49)'],[1.52,'Vidrio (n = 1,52)'],[2.42,'Diamante (n = 2,42)']];
add({c:'F09-005',n:'Refracción de la luz y ley de Snell',tema:'Óptica · refracción',dif:3,
 obj:'Medir el ángulo de refracción de un rayo que pasa del aire a distintos medios y hallar el índice de refracción.',comp:[C1,C2,C3],
 evid:['Aplica n₁·sen θ₁ = n₂·sen θ₂.','Obtiene n como inverso de la pendiente de sen θ₂ contra sen θ₁.','Calcula el ángulo crítico y la rapidez de la luz en un medio.'],
 teo:'Al pasar de un medio a otro la luz cambia de rapidez y se desvía (<b>refracción</b>). <b>Ley de Snell</b>: <b>n<sub>1</sub>·sen θ<sub>1</sub> = n<sub>2</sub>·sen θ<sub>2</sub></b>. El <b>índice de refracción</b> es n = c/v (c = 3×10<sup>8</sup> m/s). Del aire (n = 1) a un medio más denso, el rayo se acerca a la normal: sen θ<sub>2</sub> = sen θ<sub>1</sub>/n. La pendiente de sen θ<sub>2</sub> contra sen θ<sub>1</sub> es 1/n.',
 mat:['Láser','Bloque de acrílico o recipiente con agua','Transportador'],
 cfg:{vis:'snell',vars:[sel('medio','Medio',MEDS),rg('i','Ángulo de incidencia (en el aire)','°',0,80,5,30)],
  outs:[{id:'r',n:'Ángulo de refracción',u:'°',d:1}],tabla:['medio','i','r'],
  fx:v=>({r:deg(Math.asin(Math.sin(rad(v.i))/v.medio)),_res:{r:0.5},_sd:{r:0.4}}),
  graf:{x:'i',y:'r',fx:a=>Math.sin(rad(a)),fy:a=>Math.sin(rad(a)),nx:'sen θ₁',ny:'sen θ₂',origen:true,u:''},
  tareas:[{t:'valor',txt:'Con AGUA, mide θ₂ para al menos 6 ángulos (borra la tabla antes). Calcula n = 1 ÷ pendiente.',ans:1.33,tol:0.05,u:'',pista:'La pendiente de sen θ₂ contra sen θ₁ es 1/n'},{t:'valor',txt:'Con ACRÍLICO e incidencia de 45°, ¿cuál es el ángulo de refracción (°)?',ans:28.3,tolA:1.5,u:'°'},{t:'valor',txt:'Calcula el ángulo crítico (°) del DIAMANTE para luz que sale al aire: sen θc = 1/n.',ans:24.4,tolA:0.6,u:'°'},{t:'valor',txt:'¿A qué rapidez viaja la luz en el agua (en 10⁸ m/s)? v = c/n con c = 3,00.',ans:2.26,tolA:0.06,u:'×10⁸ m/s'}],
  retos:[R('Al pasar del aire al agua, el rayo…',['Se acerca a la normal','Se aleja de la normal','No se desvía','Se refleja siempre'],'El agua tiene mayor n.'),R('A mayor índice de refracción, la luz viaja…',['Más lento','Más rápido','Igual','Al revés'],'n = c/v.'),R('Con incidencia normal (0°) el rayo…',['No se desvía','Se desvía mucho','Se refleja','Desaparece'],'sen 0 = 0.')]},
 ana:['¿Por qué un lápiz parece quebrado dentro del agua?','¿Qué medio desvía más la luz y por qué?'],
 ev:[MC('La ley de Snell es…',['n₁ sen θ₁ = n₂ sen θ₂','n₁ θ₁ = n₂ θ₂','sen θ = n','θ₁ = θ₂'],0,'Relaciona ángulos e índices.'),MC('El índice de refracción del aire es aproximadamente…',['1','1,33','0','2'],0,'Casi igual al vacío.'),MC('Si n₂ > n₁ el rayo se…',['Acerca a la normal','Aleja de la normal','No cambia','Invierte'],0,'Entra a un medio más denso.')],
 conc:'Explica cómo hallaste el índice de refracción con tus datos.',lim:'Medios homogéneos sin dispersión; ruido simula la lectura del transportador.'});

/* 51 */
const MEDF=[[1.33,'Agua (n = 1,33)'],[1.49,'Acrílico (n = 1,49)'],[2.42,'Diamante (n = 2,42)']];
add({c:'F09-006',n:'Reflexión interna total y fibra óptica',tema:'Óptica · reflexión interna',dif:3,
 obj:'Hallar el ángulo crítico para que un rayo que viaja dentro de un medio denso quede atrapado, como en una fibra óptica.',comp:[C1,C2,C3],
 evid:['Identifica el ángulo crítico experimentalmente.','Compara el ángulo crítico de varios medios.','Relaciona la reflexión total con la fibra óptica.'],
 teo:'Cuando un rayo pasa de un medio denso a uno menos denso (agua → aire) se aleja de la normal. Si el ángulo de incidencia supera el <b>ángulo crítico</b> θ<sub>c</sub>, no hay rayo refractado: toda la luz se refleja (<b>reflexión interna total</b>). Se cumple <b>sen θ<sub>c</sub> = 1/n</b>. Así viaja la luz en una <b>fibra óptica</b>, rebotando sin escapar. Antes del ángulo crítico se refleja solo una parte.',
 mat:['Láser','Chorro de agua o acrílico','Transportador'],
 cfg:{vis:'fibra',vars:[sel('medio','Medio',MEDF),rg('i','Ángulo de incidencia dentro del medio','°',0,85,1,20)],
  outs:[{id:'R',n:'Luz reflejada',u:'%',d:1},{id:'r',n:'Ángulo del rayo que sale al aire',u:'°',d:1}],tabla:['medio','i','R'],
  fx:v=>{const n=v.medio,st=n*Math.sin(rad(v.i));if(st>=1)return{R:100,tir:true,_res:{R:0.1},_sd:{R:0}};const t=Math.asin(st),ci=Math.cos(rad(v.i)),ct=Math.cos(t);const rs=(n*ci-ct)/(n*ci+ct),rp=(ci-n*ct)/(ci+n*ct);return{R:100*(rs*rs+rp*rp)/2,r:deg(t),tir:false,_res:{R:0.1,r:0.5},_sd:{R:0.3,r:0.4}}},
  tareas:[{t:'valor',txt:'Con AGUA, aumenta i de a poco hasta que la luz reflejada sea 100 %. ¿Cuál es el primer ángulo (°) con reflexión total?',ans:48.75,tolA:1.2,u:'°',pista:'Revisa la columna «Luz reflejada»'},{t:'valor',txt:'Con ACRÍLICO, ¿cuál es el primer ángulo (°) con reflexión total?',ans:42.2,tolA:1.3,u:'°'},{t:'valor',txt:'Con DIAMANTE, ¿cuál es el primer ángulo (°) con reflexión total?',ans:24.4,tolA:1.2,u:'°',pista:'sen θc = 1/n'},{t:'meta',txt:'Con ACRÍLICO, elige un ángulo de 60° o más y comprueba que el rayo queda atrapado.',check:(v,o)=>{const ok=v.medio===1.49&&v.i>=60&&o.tir;return{ok,msg:ok?'¡Rayo atrapado! Así funciona una fibra óptica.':'Elige acrílico y un ángulo de 60° o más.'}}}],
  retos:[R('La reflexión interna total solo ocurre cuando la luz va de un medio…',['Más denso a uno menos denso','Menos denso a uno más denso','Igual a igual','Del vacío al vidrio'],'Requiere n₁ > n₂.'),R('Si i es mayor que el ángulo crítico…',['Toda la luz se refleja','Toda la luz sale','Se absorbe','Cambia de color'],'No hay rayo refractado.'),R('La fibra óptica transmite señales porque…',['La luz rebota por reflexión total','La luz sale por los lados','Calienta el vidrio','Usa electricidad'],'La luz queda confinada.')]},
 ana:['¿Por qué un medio de mayor índice tiene un ángulo crítico menor?','¿Qué ventajas tiene la fibra óptica sobre el cable de cobre?'],
 ev:[MC('sen θc = 1/n sirve para…',['Hallar el ángulo crítico','Hallar la masa','Hallar la presión','Medir el tiempo'],0,'Es la condición de reflexión total.'),MC('El diamante brilla mucho porque su ángulo crítico es…',['Pequeño','Grande','Cero','Infinito'],0,'Atrapa mucha luz en su interior.'),MC('En una fibra óptica el núcleo tiene…',['Mayor índice que el revestimiento','Menor índice que el revestimiento','Igual índice','Índice cero'],0,'Para que ocurra reflexión total.')],
 conc:'Explica cuándo y por qué se produce la reflexión interna total.',lim:'Reflectancia de Fresnel promedio sin polarización; medios homogéneos.'});

/* 52 */
const LEN={A:['Convergente A',12],B:['Convergente B',20],C:['Divergente',-15]};
add({c:'F09-007',n:'Lentes convergentes y divergentes',tema:'Óptica · lentes',dif:3,
 obj:'Determinar la distancia focal de lentes y analizar las imágenes que forman según la posición del objeto.',comp:[C1,C2,C3],
 evid:['Aplica 1/f = 1/dₒ + 1/dᵢ a lentes delgadas.','Obtiene f del intercepto de la gráfica.','Calcula la potencia en dioptrías.'],
 teo:'Una lente <b>convergente</b> (más gruesa al centro, f &gt; 0) enfoca rayos paralelos en su foco; una <b>divergente</b> (f &lt; 0) los abre. Ecuación de las lentes delgadas: <b>1/f = 1/d<sub>o</sub> + 1/d<sub>i</sub></b>, aumento <b>m = −d<sub>i</sub>/d<sub>o</sub></b>. d<sub>i</sub> &gt; 0: imagen real al otro lado; d<sub>i</sub> &lt; 0: imagen virtual del mismo lado del objeto. La <b>potencia</b> es <b>P = 1/f</b> (f en m) en dioptrías.',
 mat:['Lupa y otras lentes','Vela','Pantalla','Regla'],
 cfg:{vis:'optica',vars:[sel('len','Lente',Object.entries(LEN).map(([k,x])=>[k,x[0]])),rg('do','Distancia del objeto','cm',5,60,5,30)],
  outs:[{id:'di',n:'Distancia de la imagen',u:'cm',d:1},{id:'m',n:'Aumento',u:'',d:2}],tabla:['len','do','di','m'],
  fx:v=>{const f=LEN[v.len][1],inv=1/f-1/v.do;if(Math.abs(inv)<1e-9)return{_kind:'lente',_f:f,_t:LEN[v.len][0]+': el objeto está en el foco, no hay imagen'};const di=1/inv;return{di,m:-di/v.do,_kind:'lente',_f:f,_t:LEN[v.len][0]+' (f = '+(f>0?'+':'−')+Math.abs(f)+' cm)',_res:{di:0.1,m:0.01},_sd:{di:0.15,m:0.01}}},
  graf:{x:'do',y:'di',fx:d=>1/d,fy:d=>1/d,nx:'1/dₒ (cm⁻¹)',ny:'1/dᵢ (cm⁻¹)',u:'cm⁻¹'},
  tareas:[{t:'valor',txt:'Con la LENTE A, mide dᵢ para varias dₒ (borra la tabla antes). Con el intercepto 1/f calcula f (cm).',ans:12,tol:0.08,u:'cm',pista:'f = 1 ÷ intercepto'},{t:'valor',txt:'Con la LENTE B y dₒ = 30 cm, ¿cuál es dᵢ (cm)?',ans:60,tolA:2,u:'cm'},{t:'valor',txt:'Con la lente DIVERGENTE y dₒ = 30 cm, ¿cuánto vale dᵢ (cm)? Escribe el signo.',ans:-10,tolA:0.6,u:'cm'},{t:'valor',txt:'¿Cuál es la potencia (dioptrías) de la lente A? P = 100 ÷ f (f en cm).',ans:8.33,tolA:0.4,u:'D'}],
  retos:[R('Una lupa es una lente…',['Convergente','Divergente','Plana','Opaca'],'Aumenta el tamaño aparente.'),R('Una lente divergente siempre forma imagen…',['Virtual y más pequeña','Real e invertida','Real y mayor','Ninguna'],'dᵢ es negativa y |m| < 1.'),R('Si el objeto está a más de 2f de una convergente, la imagen es…',['Real, invertida y menor','Virtual y mayor','Real y mayor','Del mismo tamaño'],'Es el caso de la cámara fotográfica.')]},
 ana:['¿Por qué una lupa solo agranda cuando el objeto está dentro de f?','¿Cómo corrigen los lentes la miopía y la hipermetropía?'],
 ev:[MC('La potencia de una lente de f = 0,5 m es…',['2 D','0,5 D','5 D','50 D'],0,'P = 1/f.'),MC('Una lente convergente es más…',['Gruesa en el centro','Delgada en el centro','Plana','Opaca en el centro'],0,'Esa forma enfoca los rayos.'),MC('Una imagen virtual con lente se forma…',['Del mismo lado del objeto','En una pantalla al otro lado','Siempre invertida','No existe'],0,'dᵢ < 0.')],
 conc:'Explica cómo hallaste f y qué imagen forma cada lente.',lim:'Lentes delgadas con rayos paraxiales; sin aberraciones.'});

/* 53 */
add({c:'F09-008',n:'Telescopio refractor (lentes convergentes)',tema:'Óptica · instrumentos',dif:3,
 obj:'Combinar un objetivo de gran distancia focal y un ocular de corta distancia focal para ampliar objetos lejanos.',comp:[C1,C2,C3],
 evid:['Calcula el aumento M = fₒ/fₑ.','Relaciona la longitud del tubo con las distancias focales.','Explica por qué la imagen final es invertida.'],
 teo:'Un <b>telescopio refractor</b> usa dos lentes convergentes: el <b>objetivo</b> (distancia focal f<sub>o</sub> grande) forma una imagen real del objeto lejano en su foco; el <b>ocular</b> (f<sub>e</sub> pequeña) actúa como lupa sobre esa imagen. El <b>aumento angular</b> es <b>M = f<sub>o</sub>/f<sub>e</sub></b> y el tubo mide <b>L = f<sub>o</sub> + f<sub>e</sub></b>. La imagen final se ve invertida. (Un microscopio compuesto usa la misma idea con un objetivo de distancia focal muy corta.)',
 mat:['Lente de f = 30 a 100 cm','Lente de f = 2 a 10 cm','Tubo de cartón'],
 cfg:{vis:'telescopio',vars:[rg('fo','Distancia focal del objetivo','cm',30,100,10,60),rg('fe','Distancia focal del ocular','cm',2,10,1,5)],
  outs:[{id:'M',n:'Aumento angular',u:'×',d:1},{id:'L',n:'Longitud del tubo',u:'cm',d:1}],tabla:['fo','fe','M','L'],
  fx:v=>({M:v.fo/v.fe,L:v.fo+v.fe,_res:{M:0.1,L:0.1},_sd:{M:0.15,L:0}}),
  graf:{x:'fe',y:'M',fx:f=>1/f,nx:'1/fₑ (cm⁻¹)',ny:'M',origen:true,u:'cm'},
  tareas:[{t:'valor',txt:'Con fₒ = 80 cm, mide M para varias fₑ entre 2 y 10 cm (borra la tabla antes). ¿Cuál es la pendiente de M contra 1/fₑ (cm)?',ans:80,tol:0.06,u:'cm',pista:'M = fₒ·(1/fₑ)'},{t:'valor',txt:'Con fₒ = 60 cm y fₑ = 5 cm, ¿cuál es el aumento?',ans:12,tolA:0.7,u:'×'},{t:'valor',txt:'Con fₒ = 50 cm y fₑ = 5 cm, ¿qué longitud (cm) debe tener el tubo?',ans:55,tolA:0.5,u:'cm'},{t:'valor',txt:'Con fₒ = 60 cm, ¿qué distancia focal del ocular (cm) da un aumento de 15?',ans:4,tolA:0.3,u:'cm',pista:'M = fₒ/fₑ'}],
  retos:[R('Para aumentar M con el mismo objetivo conviene un ocular con…',['Menor distancia focal','Mayor distancia focal','Ninguna lente','Espejo plano'],'M = fₒ/fₑ.'),R('La imagen en un telescopio refractor simple se ve…',['Invertida','Derecha','Doble','Borrosa siempre'],'Dos lentes convergentes invierten la imagen.'),R('La longitud del tubo es aproximadamente…',['fₒ + fₑ','fₒ − fₑ','fₒ·fₑ','fₒ/fₑ'],'El foco del objetivo coincide con el del ocular.')]},
 ana:['¿Por qué un telescopio necesita un objetivo grande, no solo aumento?','¿Cómo cambia el diseño para un microscopio?'],
 ev:[MC('El aumento de un telescopio es…',['fₒ/fₑ','fₑ/fₒ','fₒ·fₑ','fₒ + fₑ'],0,'Cociente de distancias focales.'),MC('El objetivo forma…',['Una imagen real en su foco','Una imagen virtual en el infinito','Ninguna imagen','Un espejo'],0,'Del objeto lejano.'),MC('Si fₒ = 100 cm y fₑ = 4 cm, M =',['25','4','400','104'],0,'100/4 = 25.')],
 conc:'Explica cómo se relacionan el aumento y las distancias focales en tus datos.',lim:'Telescopio de Kepler con lentes delgadas; objeto en el infinito.'});

/* 54 */
const NP=l=>1.5046+4200/(l*l),DV=(i,l)=>{const n=NP(l),r1=Math.asin(Math.sin(rad(i))/n),r2=rad(60)-r1,s=n*Math.sin(r2);return Math.abs(s)>1?null:i+deg(Math.asin(s))-60};
const IGR=[30,35,40,45,50,55,60,65,70];
add({c:'F09-009',n:'Dispersión de la luz en un prisma',tema:'Óptica · dispersión',dif:3,
 obj:'Medir la desviación que produce un prisma de vidrio a distintos colores y comprobar que el índice de refracción depende de la longitud de onda.',comp:[C1,C2,C3],
 evid:['Describe la dispersión de la luz blanca.','Compara la desviación de colores extremos.','Calcula n a partir de la desviación mínima.'],
 teo:'La luz blanca es una mezcla de colores. En el vidrio, el índice de refracción es mayor para longitudes de onda cortas (violeta) que para largas (rojo), por eso el prisma <b>dispersa</b> la luz y el violeta se desvía más. La <b>desviación</b> total de un prisma de ángulo A es <b>δ = i + e − A</b>; es <b>mínima</b> cuando el rayo atraviesa simétricamente el prisma, y entonces <b>n = sen((A + δ<sub>mín</sub>)/2) / sen(A/2)</b>. Aquí A = 60°.',
 mat:['Prisma de vidrio','Rendija con luz blanca','Pantalla','Filtros de color'],
 cfg:{vis:'prisma',vars:[sel('lam','Color (longitud de onda)',[[400,'Violeta 400 nm'],[470,'Azul 470 nm'],[530,'Verde 530 nm'],[580,'Amarillo 580 nm'],[650,'Rojo 650 nm']]),rg('i','Ángulo de incidencia','°',30,70,5,50)],
  outs:[{id:'d',n:'Desviación total δ',u:'°',d:2}],tabla:['lam','i','d'],
  fx:v=>{const d=DV(v.i,v.lam);return d==null?{}:{d,_res:{d:0.05},_sd:{d:0.05}}},
  tareas:[{t:'valor',txt:'Con VIOLETA e incidencia de 50°, ¿cuánto vale la desviación δ (°)?',ans:()=>DV(50,400),tolA:0.35,u:'°'},{t:'valor',txt:'Con incidencia de 50°, ¿cuánto mayor es la desviación del violeta que la del rojo (°)? (dispersión angular)',ans:()=>DV(50,400)-DV(50,650),tolA:0.3,u:'°',pista:'Mide ambos colores y resta'},{t:'valor',txt:'Con VERDE, busca entre 30° y 70° la menor desviación (δ mínima) en °.',ans:()=>Math.min(...IGR.map(i=>DV(i,530)).filter(x=>x!=null)),tolA:0.35,u:'°'},{t:'valor',txt:'Con la δ mínima del verde calcula n = sen((60° + δmín)/2) ÷ sen 30°.',ans:()=>NP(530),tolA:0.012,u:'',pista:'Usa los grados con la calculadora'}],
  retos:[R('El color que más se desvía en un prisma es…',['Violeta','Rojo','Verde','Todos igual'],'Su índice de refracción es mayor.'),R('La luz blanca se descompone porque…',['n depende de la longitud de onda','El prisma es de colores','La luz es calor','Se refleja'],'Es la dispersión.'),R('El arcoíris se forma por…',['Refracción y dispersión en gotas','Un prisma de hielo','Luz láser','Polarización'],'Las gotas actúan como prismas.')]},
 ana:['¿Por qué el rojo es el color que menos se desvía?','¿Qué relación hay entre el prisma y el arcoíris?'],
 ev:[MC('La dispersión consiste en…',['Separar la luz en colores','Sumar colores','Absorber luz','Reflejar luz'],0,'Cada color tiene distinto índice.'),MC('La desviación mínima ocurre cuando el rayo…',['Atraviesa simétricamente el prisma','Entra perpendicular','Sale rasante','Se refleja'],0,'Trayectoria simétrica.'),MC('El violeta tiene longitud de onda…',['Menor que la del rojo','Mayor que la del rojo','Igual','Infinita'],0,'400 nm frente a 650 nm.')],
 conc:'Explica cómo cambia la desviación con el color y qué indica sobre el índice de refracción.',lim:'Índice dado por una fórmula de Cauchy aproximada para vidrio crown; prisma de 60°.'});

/* 55 */
add({c:'F09-010',n:'Mezcla de colores: luces y pigmentos',tema:'Óptica · color',dif:2,
 obj:'Comparar la síntesis aditiva (luces) y la sustractiva (pigmentos) y predecir el color resultante.',comp:[C1,C2,C3],
 evid:['Predice colores en mezcla de luces.','Predice colores en mezcla de pigmentos.','Explica por qué los resultados son opuestos.'],
 teo:'En la <b>síntesis aditiva</b> se suman luces: rojo + verde = amarillo, verde + azul = cian, rojo + azul = magenta y rojo + verde + azul = <b>blanco</b>. En la <b>sustractiva</b> cada pigmento absorbe (resta) colores de la luz blanca: cian + magenta = azul, cian + amarillo = verde, magenta + amarillo = rojo y los tres juntos dan casi <b>negro</b>. Un objeto se ve de un color porque refleja ese color y absorbe los demás.',
 mat:['Tres linternas con celofán R, G, B','Pinturas cian, magenta y amarilla','Pantalla blanca'],
 cfg:{vis:'color',vars:[sel('modo','Tipo de mezcla',[['luz','Luces (aditiva)'],['pig','Pigmentos (sustractiva)']]),rg('a','Rojo (luz) / Cian (pigmento)','%',0,100,25,0),rg('b','Verde (luz) / Magenta (pigmento)','%',0,100,25,0),rg('c','Azul (luz) / Amarillo (pigmento)','%',0,100,25,0)],
  outs:[{id:'cr',n:'Canal rojo del resultado',u:'0–255',d:0},{id:'cg',n:'Canal verde del resultado',u:'0–255',d:0},{id:'cb',n:'Canal azul del resultado',u:'0–255',d:0}],tabla:['modo','a','b','c','cr','cg','cb'],
  fx:v=>{const l=v.modo==='luz',f=x=>l?2.55*x:255*(1-x/100);return{cr:f(v.a),cg:f(v.b),cb:f(v.c),_res:{cr:1,cg:1,cb:1},_sd:{cr:2,cg:2,cb:2}}},
  tareas:[{t:'meta',txt:'Con LUCES, obtén amarillo: rojo y verde al 75 % o más y azul en 0 %.',check:(v,o)=>{const ok=v.modo==='luz'&&v.a>=75&&v.b>=75&&v.c===0;return{ok,msg:ok?'Rojo + verde = amarillo.':'Usa luces, rojo y verde altos y azul apagado.'}}},{t:'meta',txt:'Con LUCES, obtén luz blanca (las tres al 100 %).',check:(v,o)=>{const ok=v.modo==='luz'&&v.a===100&&v.b===100&&v.c===100;return{ok,msg:ok?'R + G + B = blanco.':'Enciende las tres luces al máximo.'}}},{t:'meta',txt:'Con PIGMENTOS, obtén verde: cian 100 %, magenta 0 % y amarillo 100 %.',check:(v,o)=>{const ok=v.modo==='pig'&&v.a===100&&v.b===0&&v.c===100;return{ok,msg:ok?'Cian + amarillo = verde.':'Cambia a pigmentos y ajusta los tres controles.'}}},{t:'valor',txt:'Con PIGMENTOS cian 100 % + magenta 100 % + amarillo 0 %, mide el canal azul del resultado (0–255).',ans:255,tolA:8,u:'',pista:'El resultado es azul'}],
  retos:[R('Rojo + verde + azul (luces) dan…',['Blanco','Negro','Gris oscuro','Marrón'],'Es la síntesis aditiva.'),R('Cian + magenta + amarillo (pigmentos) dan aproximadamente…',['Negro','Blanco','Verde','Rojo'],'Se absorbe casi toda la luz.'),R('Una camiseta se ve roja porque…',['Refleja el rojo y absorbe el resto','Emite luz roja','Absorbe el rojo','Refracta la luz'],'Absorbe los demás colores.')]},
 ana:['¿Por qué los televisores usan R, G, B y las impresoras C, M, A?','¿Por qué una hoja verde se ve negra bajo luz roja?'],
 ev:[MC('Los colores primarios de la luz son…',['Rojo, verde, azul','Cian, magenta, amarillo','Rojo, amarillo, azul','Blanco y negro'],0,'Para la mezcla aditiva.'),MC('Rojo + verde (luces) =',['Amarillo','Cian','Magenta','Blanco'],0,'Es amarillo.'),MC('Los pigmentos mezclan por síntesis…',['Sustractiva','Aditiva','Nuclear','Magnética'],0,'Absorben colores.')],
 conc:'Explica la diferencia entre mezclar luces y mezclar pigmentos con tus observaciones.',lim:'Modelo de colores ideales; los pigmentos reales no son perfectamente puros.'});

/* 56 */
add({c:'F09-011',n:'Circuito eléctrico simple y ley de Ohm',tema:'Electricidad · circuitos',dif:2,
 obj:'Armar un circuito con pilas, interruptor y bombillo, y comprobar que la corriente es proporcional al voltaje.',comp:[C1,C2,C3],
 evid:['Distingue circuito abierto y cerrado.','Obtiene la resistencia como inverso de la pendiente I contra V.','Aplica V = I·R.'],
 teo:'Un <b>circuito</b> es una trayectoria cerrada por donde circula la corriente. Con el interruptor <b>abierto</b> no circula corriente; <b>cerrado</b>, sí. La <b>ley de Ohm</b> dice <b>V = I·R</b>: con R constante, la corriente es proporcional al voltaje. Cada pila aporta 1,5 V y las pilas en serie suman sus voltajes. La resistencia se mide en ohmios (Ω) y la corriente en amperios (aquí en mA).',
 mat:['Pilas de 1,5 V','Bombillo','Interruptor','Cables','Amperímetro'],
 cfg:{vis:'circuito',vars:[rg('n','Número de pilas en serie','',1,4,1,1),rg('rb','Resistencia del bombillo','Ω',10,40,10,20),sel('sw','Interruptor',[['abierto','Abierto'],['cerrado','Cerrado']])],
  outs:[{id:'I',n:'Corriente',u:'mA',d:0},{id:'V',n:'Voltaje en el bombillo',u:'V',d:2}],tabla:['n','rb','sw','I','V'],
  fx:v=>{const c=v.sw==='cerrado',V=1.5*v.n,I=c?V/v.rb*1000:0;return{I,V:c?V:0,P:c?V*I/1000:0,_res:{I:1,V:0.01},_sd:{I:c?1:0,V:c?0.02:0}}},
  graf:{x:'n',y:'I',fx:n=>1.5*n,nx:'V (voltios)',ny:'I (mA)',origen:true,u:'mA/V'},
  tareas:[{t:'valor',txt:'Cierra el interruptor, deja R = 20 Ω y mide I con 1, 2, 3 y 4 pilas (mínimo 5 medidas, borra datos con interruptor abierto). Calcula R = 1000 ÷ pendiente (Ω).',ans:20,tol:0.07,u:'Ω',pista:'La pendiente está en mA/V'},{t:'valor',txt:'Con 3 pilas y bombillo de 30 Ω (interruptor cerrado), ¿qué corriente (mA) circula?',ans:150,tolA:4,u:'mA',pista:'V = 4,5 V'},{t:'meta',txt:'Enciende el bombillo: interruptor cerrado y corriente mayor que cero.',check:(v,o)=>{const ok=v.sw==='cerrado'&&o.I>0;return{ok,msg:ok?'¡Bombillo encendido!':'Cierra el interruptor para que circule la corriente.'}}}],
  retos:[R('Con el interruptor abierto, la corriente es…',['Cero','Máxima','Igual a V/R','Negativa'],'El circuito no está cerrado.'),R('Si se duplica el voltaje con la misma R, la corriente…',['Se duplica','Se reduce a la mitad','No cambia','Se cuadruplica'],'I = V/R.'),R('Dos pilas de 1,5 V en serie dan…',['3 V','1,5 V','0,75 V','4,5 V'],'Los voltajes se suman.')]},
 ana:['¿Por qué se interrumpe la luz al abrir el interruptor?','¿Qué pasaría con la corriente si se usara un bombillo de mayor resistencia?'],
 ev:[MC('La ley de Ohm es…',['V = I·R','V = I/R','R = V·I','I = V·R'],0,'Relaciona voltaje, corriente y resistencia.'),MC('La resistencia se mide en…',['Ohmios','Amperios','Voltios','Vatios'],0,'Símbolo Ω.'),MC('En un circuito cerrado la corriente…',['Circula','Es cero','Se acumula','Se invierte siempre'],0,'Hay una trayectoria completa.')],
 conc:'Explica cómo comprobaste que la corriente es proporcional al voltaje.',lim:'Bombillo óhmico de resistencia constante (en la realidad R cambia con la temperatura); pilas ideales.'});

/* 57 */
const MAT=[['cu','Cobre',0.05],['al','Aluminio',0.08],['gr','Grafito (mina de lápiz)',30],['ac','Moneda de acero',0.2],['ma','Madera seca',5e8],['pl','Plástico',1e12],['vi','Vidrio',1e11],['de','Agua destilada',5e5],['az','Agua con azúcar',1e6],['sa','Agua con sal',400],['li','Jugo de limón',600]];
add({c:'F09-012',n:'Materiales conductores y aislantes',tema:'Electricidad · conductividad',dif:1,
 obj:'Probar la conductividad eléctrica de sólidos y soluciones con un probador de circuito y clasificar los materiales.',comp:[C1,C2,C3],
 evid:['Clasifica materiales como conductores o aislantes.','Explica por qué las soluciones salinas conducen.','Compara la corriente que permiten distintos materiales.'],
 teo:'Los <b>conductores</b> permiten el paso de la corriente porque tienen cargas libres: los metales tienen electrones libres; las soluciones con sal contienen <b>iones</b> que se mueven. Los <b>aislantes</b> (madera, plástico, vidrio, agua destilada) casi no tienen cargas libres y la corriente es prácticamente nula. Con una pila de 4,5 V y una resistencia de protección de 100 Ω, la corriente es I = V/(100 Ω + R<sub>muestra</sub>).',
 mat:['Pila de 4,5 V','Amperímetro','Bombillo indicador','Muestras sólidas y soluciones'],
 cfg:{vis:'conduct',vars:[sel('mat','Material de prueba',MAT.map(m=>[m[0],m[1]]))],
  outs:[{id:'I',n:'Corriente',u:'mA',d:1}],tabla:['mat','I'],
  fx:v=>{const m=MAT.find(x=>x[0]===v.mat);return{I:4.5/(100+m[2])*1000,_n:m[1],_res:{I:0.1},_sd:{I:0.02}}},
  tareas:[{t:'valor',txt:'Con COBRE, ¿qué corriente (mA) mide el amperímetro?',ans:45,tolA:2,u:'mA'},{t:'valor',txt:'Con AGUA CON SAL, ¿qué corriente (mA) mide el amperímetro?',ans:9,tolA:0.8,u:'mA'},{t:'meta',txt:'De las soluciones (agua destilada, con azúcar, con sal, jugo de limón), selecciona la que mejor conduce.',check:(v,o)=>{const ok=v.mat==='sa';return{ok,msg:ok?'El agua con sal tiene más iones disponibles.':'Compara las corrientes de las cuatro soluciones y elige la mayor.'}}},{t:'tabla',txt:'Prueba al menos 8 materiales distintos.',n:8}],
  retos:[R('Un material conduce si tiene…',['Cargas libres que se mueven','Mucha masa','Color brillante','Bajo precio'],'Electrones libres o iones.'),R('El agua destilada casi no conduce porque…',['No tiene iones','Es fría','Es muy densa','Es incolora'],'Sin iones no hay portadores de carga.'),R('Un cable se recubre de plástico para…',['Aislar y evitar descargas','Aumentar la corriente','Cambiar el voltaje','Calentarlo'],'El plástico es aislante.')]},
 ana:['¿Por qué no se debe tocar un aparato eléctrico con las manos mojadas?','¿Qué diferencia hay entre conducir con electrones y con iones?'],
 ev:[MC('Un buen conductor es…',['El cobre','La madera','El vidrio','El plástico'],0,'Tiene electrones libres.'),MC('Una solución de sal conduce por sus…',['Iones','Átomos neutros','Moléculas de azúcar','Burbujas'],0,'Los iones transportan la carga.'),MC('Un aislante tiene corriente…',['Casi nula','Muy alta','Infinita','Negativa'],0,'No hay cargas libres.')],
 conc:'Clasifica los materiales probados y explica el criterio usado.',lim:'Resistencias de muestra aproximadas con fines didácticos; se ignora la polarización de los electrodos.'});

/* 58 */
add({c:'F09-013',n:'Construcción de un electroimán',tema:'Electromagnetismo · campo magnético de una corriente',dif:2,
 obj:'Enrollar alambre en un clavo, variar vueltas y corriente y contar los clips que levanta.',comp:[C1,C2,C3],
 evid:['Relaciona el número de clips con el número de vueltas y la corriente.','Interpreta la proporcionalidad con N·I.','Explica por qué un electroimán se puede apagar.'],
 teo:'Una corriente eléctrica crea un <b>campo magnético</b>. Al enrollar el alambre en una bobina el campo se suma, y un núcleo de hierro lo refuerza: es un <b>electroimán</b>. La fuerza magnética aumenta con el número de vueltas N y con la corriente I: en este modelo, <b>clips ≈ 0,12·N·I</b>. Al cortar la corriente, desaparece el magnetismo (a diferencia de un imán permanente).',
 mat:['Clavo de hierro','Alambre de cobre esmaltado','Pila y reóstato','Clips'],
 cfg:{vis:'electroiman',vars:[rg('N','Número de vueltas','',10,100,10,30),rg('I','Corriente','A',0.5,3,0.5,1)],
  outs:[{id:'clips',n:'Clips levantados',u:'',d:0}],tabla:['N','I','clips'],
  fx:v=>({clips:0.12*v.N*v.I,_res:{clips:1},_sd:{clips:0.5}}),
  graf:{x:'N',y:'clips',fx:(N,v)=>N*v.I,nx:'N·I (vueltas·A)',ny:'clips',origen:true,u:'clips por (vuelta·A)'},
  tareas:[{t:'valor',txt:'Mide con al menos 6 combinaciones de N e I. ¿Cuál es la pendiente de clips contra N·I?',ans:0.12,tol:0.1,u:'',pista:'Debe ser cercana a 0,12'},{t:'valor',txt:'Con N = 80 vueltas e I = 3 A, ¿cuántos clips levanta?',ans:28.8,tolA:2.5,u:'clips'},{t:'meta',txt:'Consigue que el electroimán levante 20 clips o más.',check:(v,o)=>{const ok=o.clips>=20;return{ok,msg:ok?'¡Lo lograste con N·I = '+fm(v.N*v.I,0)+'!':'Aumenta las vueltas o la corriente.'}}},{t:'valor',txt:'Si se duplica el número de vueltas con la misma corriente, ¿por qué factor se multiplica el número de clips?',ans:2,tolA:0.15,u:''}],
  retos:[R('Un electroimán funciona cuando…',['Circula corriente por la bobina','Está en reposo','Se enfría','Se enrolla al revés'],'La corriente crea el campo.'),R('Para levantar más clips conviene…',['Más vueltas o más corriente','Menos vueltas','Quitar el clavo','Menos pilas'],'Aumenta N·I.'),R('La ventaja del electroimán es que…',['Se puede encender y apagar','Es permanente','No usa energía','No tiene polos'],'Se controla con la corriente.')]},
 ana:['¿Para qué sirve el clavo de hierro dentro de la bobina?','¿Dónde se usan electroimanes (grúas, timbres, trenes)?'],
 ev:[MC('Una corriente produce…',['Un campo magnético','Solo calor','Solo luz','Una masa'],0,'Descubrimiento de Oersted.'),MC('El núcleo de hierro…',['Refuerza el campo','Anula el campo','Quita la corriente','No hace nada'],0,'Se magnetiza.'),MC('Si I = 0…',['El electroimán no atrae','Atrae el doble','Se calienta','Gira'],0,'Sin corriente no hay campo.')],
 conc:'Explica de qué factores depende la fuerza de un electroimán, apoyándote en tus datos.',lim:'Modelo lineal con núcleo sin saturación; se ignoran el calentamiento del alambre y la saturación del hierro.'});

/* 59 */
add({c:'F09-014',n:'Motor homopolar',tema:'Electromagnetismo · fuerza magnética',dif:3,
 obj:'Comprobar que un alambre con corriente en un campo magnético sufre una fuerza que lo hace girar, y que el sentido depende del polo.',comp:[C1,C2,C3],
 evid:['Relaciona la rapidez de giro con el campo magnético y la corriente.','Predice el sentido de giro al invertir el imán.','Explica la fuerza F = B·I·L.'],
 teo:'Un conductor por el que circula una corriente I dentro de un campo magnético B recibe una fuerza <b>F = B·I·L</b> (perpendicular a ambos). En el <b>motor homopolar</b> (pila, imán de neodimio y alambre) la fuerza sobre el alambre produce un giro continuo. Si se <b>invierte el imán</b> (o la pila) cambia el sentido de giro. En este modelo la rapidez es <b>rpm ≈ 300·B·I</b> (B en teslas, I en amperios).',
 mat:['Pila AA','Imán de neodimio','Alambre de cobre'],
 cfg:{vis:'homopolar',vars:[sel('B','Imán',[[0.2,'Débil (0,2 T)'],[0.4,'Medio (0,4 T)'],[0.6,'Fuerte (0,6 T)']]),rg('I','Corriente','A',0.5,3,0.5,1),sel('polo','Polo hacia arriba',[['N','Norte'],['S','Sur']])],
  outs:[{id:'rpm',n:'Velocidad de giro (+ horario, − antihorario)',u:'rpm',d:0}],tabla:['B','I','polo','rpm'],
  fx:v=>({rpm:(v.polo==='N'?1:-1)*300*v.B*v.I,_res:{rpm:1},_sd:{rpm:4}}),
  graf:{x:'B',y:'rpm',fx:(B,v)=>B*v.I,nx:'B·I (T·A)',ny:'rpm',origen:true,u:'rpm por T·A'},
  tareas:[{t:'valor',txt:'Con polo NORTE arriba, mide con al menos 6 combinaciones de B e I (borra datos antes). ¿Cuál es la pendiente de rpm contra B·I?',ans:300,tol:0.07,u:'rpm/(T·A)'},{t:'valor',txt:'Con imán medio (0,4 T), I = 2 A y polo SUR arriba, ¿cuántas rpm mides? Escribe el signo.',ans:-240,tolA:12,u:'rpm'},{t:'valor',txt:'Con imán fuerte (0,6 T), I = 3 A y polo NORTE, ¿cuántas rpm?',ans:540,tolA:16,u:'rpm'},{t:'valor',txt:'Si se duplica la corriente con el mismo imán, ¿por qué factor se multiplica la rapidez?',ans:2,tolA:0.15,u:''}],
  retos:[R('Al invertir el imán, el motor…',['Gira en sentido contrario','Gira igual','Se detiene siempre','Se enciende'],'La fuerza cambia de sentido.'),R('La fuerza sobre el alambre es perpendicular a…',['La corriente y al campo','Solo al suelo','Solo al imán','Ninguno'],'F = I·L × B.'),R('Si se usa un imán más fuerte, la rapidez…',['Aumenta','Disminuye','No cambia','Se anula'],'rpm ∝ B.')]},
 ana:['¿Por qué el motor gira de forma continua sin conmutador?','¿Cómo se relaciona con los motores eléctricos de los carros?'],
 ev:[MC('F = B·I·L es la fuerza sobre…',['Un conductor con corriente en un campo magnético','Una masa en caída','Un resorte','Un gas'],0,'Fuerza de Lorentz sobre una corriente.'),MC('Si I = 0 la fuerza es…',['Cero','Máxima','Infinita','Negativa'],0,'No hay corriente.'),MC('Un motor transforma energía…',['Eléctrica en mecánica','Mecánica en térmica','Luz en sonido','Térmica en eléctrica'],0,'Usa la fuerza magnética para girar.')],
 conc:'Explica de qué depende la velocidad del motor y cómo se invierte su giro.',lim:'Modelo lineal sin rozamiento variable; valores de rpm didácticos.'});

/* 60 */
add({c:'F09-015',n:'Inducción electromagnética (ley de Faraday)',tema:'Electromagnetismo · inducción',dif:3,
 obj:'Mover un imán dentro de una bobina y medir la fuerza electromotriz inducida según la velocidad y el número de espiras.',comp:[C1,C2,C3],
 evid:['Relaciona la fem inducida con la rapidez del imán.','Relaciona la fem con el número de espiras.','Explica el cambio de signo al invertir el movimiento (ley de Lenz).'],
 teo:'Un campo magnético que <b>cambia</b> a través de una bobina induce una fuerza electromotriz (<b>ley de Faraday</b>): <b>ε = −N·ΔΦ/Δt</b>. Cuanto más rápido se mueve el imán y más espiras tiene la bobina, mayor es ε. El <b>signo</b> depende de si el imán entra o sale (ley de Lenz): la corriente inducida se opone al cambio que la produce. Si el imán está quieto, no hay fem. En este modelo: <b>ε ≈ ± 0,02·N·v</b> (mV, v en cm/s).',
 mat:['Bobinas de 100, 200 y 400 espiras','Imán de barra','Galvanómetro'],
 cfg:{vis:'bobina',vars:[sel('N','Espiras de la bobina',[[100,'100 espiras'],[200,'200 espiras'],[400,'400 espiras']]),rg('v','Rapidez del imán','cm/s',5,50,5,20),sel('sentido','Movimiento del imán',[['entra','Entra a la bobina'],['sale','Sale de la bobina']])],
  outs:[{id:'eps',n:'fem inducida',u:'mV',d:0}],tabla:['N','v','sentido','eps'],
  fx:v=>({eps:(v.sentido==='entra'?1:-1)*0.02*v.N*v.v,_res:{eps:1},_sd:{eps:2}}),
  graf:{x:'v',y:'eps',nx:'v (cm/s)',ny:'ε (mV)',origen:true,u:'mV por cm/s'},
  tareas:[{t:'valor',txt:'Con 200 espiras y el imán que ENTRA, mide ε para varias rapideces (borra datos antes). ¿Cuál es la pendiente (mV por cm/s)?',ans:4,tol:0.07,u:'mV/(cm/s)'},{t:'valor',txt:'Con 400 espiras, v = 30 cm/s y el imán que ENTRA, ¿cuánto vale ε (mV)?',ans:240,tolA:9,u:'mV'},{t:'valor',txt:'Con 200 espiras, v = 20 cm/s y el imán que SALE, ¿cuánto vale ε (mV)? Escribe el signo.',ans:-80,tolA:6,u:'mV'},{t:'valor',txt:'Si se duplica el número de espiras con la misma rapidez, ¿por qué factor se multiplica la fem?',ans:2,tolA:0.15,u:''}],
  retos:[R('Si el imán está quieto dentro de la bobina, la fem inducida es…',['Cero','Máxima','Negativa','Infinita'],'No cambia el flujo.'),R('Al mover el imán más rápido, la fem…',['Aumenta','Disminuye','No cambia','Se invierte'],'ε ∝ ΔΦ/Δt.'),R('Al sacar el imán en vez de meterlo, la fem…',['Cambia de signo','Es la misma','Se anula','Se duplica'],'Ley de Lenz.')]},
 ana:['¿Cómo se usa este principio en una planta hidroeléctrica?','¿Por qué el galvanómetro se desvía hacia lados opuestos al entrar y salir el imán?'],
 ev:[MC('La ley de Faraday relaciona la fem con…',['El cambio del flujo magnético','La masa','La temperatura','La densidad'],0,'ε = −N ΔΦ/Δt.'),MC('Un generador transforma…',['Energía mecánica en eléctrica','Eléctrica en luz','Luz en sonido','Calor en sonido'],0,'Aplica la inducción.'),MC('La ley de Lenz dice que la corriente inducida…',['Se opone al cambio que la produce','Refuerza el cambio','Es siempre cero','No tiene sentido'],0,'Conserva la energía.')],
 conc:'Explica de qué depende la fem inducida y cómo lo comprobaste.',lim:'Modelo lineal con imán de campo uniforme; se desprecia la autoinducción.'});

return L})();
