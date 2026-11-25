/* AULA360 — Catálogo de Química · NOVENO (laboratorios 50–66 del inventario oficial). Datos de referencia redondeados; cada laboratorio declara sus límites.
   DBA y estándares: solo se citan cuando están verificados contra el MEN; mientras tanto se marcan «por verificar». */
(function(){
const C1='Uso comprensivo del conocimiento científico',C2='Explicación de fenómenos',C3='Indagación',PV='Por verificar con el documento oficial del MEN antes de citarlo',
 EST='Estándares básicos de competencias en Ciencias Naturales (entorno físico, grupos 8°–9°): enunciado exacto por verificar';
const L=[];let n=0;const add=o=>{n++;o.c='Q09-'+String(n).padStart(3,'0');o.g=9;o.no=49+n;o.dba=PV;o.est=EST;o.area='Química';L.push(o)};
const MC=(q,o,ok,fb)=>({q,o,ok,fb});

/* 50 */
add({n:'El mol y el número de Avogadro',tema:'Cantidad de sustancia',dif:2,mot:'mol',
 obj:'Comprender el mol como unidad que relaciona la cantidad de partículas con la masa y calcular el número de partículas de una muestra.',comp:[C1,C2],
 evid:['Explica que un mol contiene 6,022 × 10²³ partículas.','Calcula el número de partículas a partir de moles.','Relaciona el mol con la masa de la muestra.'],
 teo:'Los átomos y moléculas son tan pequeños que se cuentan en grupos enormes llamados <b>mol</b>, igual que se cuentan huevos por docenas. Un <b>mol</b> es la cantidad de sustancia que contiene <b>6,022 × 10²³</b> partículas (<b>número de Avogadro</b>). Así, 1 mol de agua tiene 6,022 × 10²³ moléculas, y 2 mol tienen el doble. Para hallar partículas: <b>N = n × 6,022 × 10²³</b>.',
 mat:['Sustancias: H₂O, NaCl, CO₂, Fe, Al, Cu, glucosa','Calculadora de moles y partículas'],
 proc:[{t:'Cambia la sustancia y la cantidad en mol al menos 4 veces.',a:'cambia',n:4},{t:'Pulsa «Mostrar el cálculo» y compara.',a:'calcula'},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{unidad:'mol',sust:['H2O','NaCl','CO2','Fe','Al','Cu','C6H12O6'],retos:[{t:'mol2p',f:'H2O',v:2},{t:'mol2p',f:'Fe',v:0.5},{t:'mol2p',f:'CO2',v:3},{t:'mol2g',f:'H2O',v:2},{t:'mol2g',f:'NaCl',v:0.5}]},
 ana:['¿Por qué se usa el mol en química en lugar de contar átomos uno por uno?','Si duplicas los moles, ¿qué pasa con el número de partículas?'],
 ev:[MC('Un mol contiene…',['6,022 × 10²³ partículas','100 partículas','1 gramo','1 litro'],0,'Número de Avogadro.'),MC('2 mol de una sustancia tienen…',['El doble de partículas que 1 mol','La mitad','Las mismas','Cero'],0,'Es proporcional.'),MC('El mol mide…',['Cantidad de sustancia','Temperatura','Tiempo','Longitud'],0,'Es unidad de cantidad de sustancia.')],
 conc:'Explica con tus palabras qué es un mol y por qué es útil.',lim:'Se usa 6,022 × 10²³ (valor redondeado). Los resultados son valores de referencia, no mediciones de laboratorio.'});

/* 51 */
add({n:'Masa molar',tema:'Cantidad de sustancia',dif:2,mot:'mol',
 obj:'Calcular la masa molar de una sustancia sumando las masas atómicas de sus átomos.',comp:[C1,C3],
 evid:['Suma masas atómicas multiplicadas por el subíndice.','Interpreta la masa molar en g/mol.','Calcula la masa molar de compuestos comunes.'],
 teo:'La <b>masa molar (M)</b> es la masa de un mol de sustancia, en <b>g/mol</b>. Se obtiene sumando las masas atómicas (de la tabla periódica) de todos los átomos de la fórmula: para H₂O, M = 2 × 1,008 + 16,00 = 18,02 g/mol. Es el puente entre gramos y moles.',
 mat:['Sustancias: H₂O, NaCl, CO₂, glucosa, CaCO₃, NH₃, H₂SO₄, NaOH','Masas atómicas de referencia'],
 proc:[{t:'Elige 4 sustancias distintas y mira cómo se suma su masa molar.',a:'cambia',n:4},{t:'Pulsa «Mostrar el cálculo».',a:'calcula'},{t:'Resuelve los retos de masa molar.',a:'todo_ok'}],
 cfg:{unidad:'g',sust:['H2O','NaCl','CO2','C6H12O6','CaCO3','NH3','H2SO4','NaOH'],retos:[{t:'M',f:'H2O'},{t:'M',f:'CO2'},{t:'M',f:'NaCl'},{t:'M',f:'CaCO3'},{t:'M',f:'H2SO4'},{t:'M',f:'C6H12O6'}]},
 ana:['¿Por qué la masa molar del CO₂ es mayor que la del H₂O?','¿Qué significa que M(NaCl) = 58,44 g/mol?'],
 ev:[MC('La masa molar se expresa en…',['g/mol','mol/L','g/L','°C'],0,'Gramos por mol.'),MC('La masa molar del H₂O es aproximadamente…',['18 g/mol','10 g/mol','32 g/mol','2 g/mol'],0,'2 × 1,008 + 16,00.'),MC('Para calcularla se suman…',['Masas atómicas de cada átomo de la fórmula','Solo la masa del oxígeno','Los números atómicos','Los neutrones'],0,'Cada átomo cuenta por su subíndice.')],
 conc:'Explica cómo se calcula la masa molar con un ejemplo.',lim:'Masas atómicas redondeadas de la tabla periódica; pueden diferir en el último decimal según la fuente.'});

/* 52 */
add({n:'Conversión masa–mol–partículas',tema:'Cantidad de sustancia',dif:3,mot:'mol',
 obj:'Convertir entre masa, cantidad de sustancia y número de partículas usando masa molar y número de Avogadro.',comp:[C1,C3],
 evid:['Convierte gramos a moles dividiendo entre la masa molar.','Convierte moles a partículas multiplicando por el número de Avogadro.','Resuelve problemas de varios pasos.'],
 teo:'Se pasa de una magnitud a otra con la masa molar y el número de Avogadro: <b>gramos → mol: n = m / M</b>; <b>mol → gramos: m = n × M</b>; <b>mol → partículas: N = n × 6,022 × 10²³</b>; para ir de gramos a partículas se hacen los dos pasos: g → mol → partículas.',
 mat:['Sustancias: H₂O, NaCl, CO₂, glucosa, CaCO₃, Fe, Al, Cu','Calculadora paso a paso'],
 proc:[{t:'Prueba las tres cantidades conocidas (g, mol, partículas).',a:'cambia',n:5},{t:'Mira el cálculo paso a paso.',a:'calcula'},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{unidad:'g',sust:['H2O','NaCl','CO2','C6H12O6','CaCO3','Fe','Al','Cu'],retos:[{t:'g2mol',f:'H2O',v:36},{t:'g2mol',f:'NaCl',v:117},{t:'mol2g',f:'CO2',v:2},{t:'g2p',f:'H2O',v:9},{t:'mol2p',f:'NaCl',v:0.25},{t:'g2mol',f:'CaCO3',v:50}]},
 ana:['¿Por qué para pasar de gramos a partículas hay que pasar primero por moles?','¿Qué error común se comete al convertir gramos a moles?'],
 ev:[MC('Para pasar de gramos a mol se…',['Divide entre la masa molar','Multiplica por la masa molar','Suma la masa molar','Resta la masa molar'],0,'n = m / M.'),MC('Para pasar de mol a partículas se multiplica por…',['6,022 × 10²³','18','100','1'],0,'Número de Avogadro.'),MC('36 g de H₂O (M = 18 g/mol) son…',['2 mol','0,5 mol','648 mol','18 mol'],0,'36 / 18.')],
 conc:'Explica los pasos para convertir una masa en número de moléculas.',lim:'Valores de masa molar y número de Avogadro redondeados; los resultados se muestran con pocas cifras.'});

/* 53 */
add({n:'Estequiometría de reacciones',tema:'Estequiometría',dif:3,mot:'estequio',
 obj:'Calcular la masa de un producto a partir de la masa de un reactivo usando los coeficientes de una ecuación balanceada.',comp:[C1,C3],
 evid:['Convierte la masa del reactivo a moles.','Usa la relación de coeficientes para hallar moles del producto.','Convierte los moles del producto a masa.'],
 teo:'La <b>estequiometría</b> estudia las relaciones de cantidad en una reacción. Los coeficientes de la ecuación balanceada indican la relación en <b>moles</b> (no en gramos). Método: <b>1)</b> pasa los gramos a moles (n = m/M); <b>2)</b> usa la razón de coeficientes; <b>3)</b> pasa los moles del producto a gramos (m = n × M). Ejemplo: en 2 H₂ + O₂ → 2 H₂O, por cada 2 mol de H₂ se forman 2 mol de H₂O.',
 mat:['Reacciones balanceadas: agua, amoníaco, metano, magnesio, zinc','Calculadora de masas'],
 proc:[{t:'Cambia de reacción y de masa al menos 3 veces.',a:'cambia',n:3},{t:'Pulsa «Calcular» y lee el procedimiento.',a:'calcula'},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{modo:'est',retos:[{t:'prod',rx:0,a:4},{t:'prod',rx:3,a:24},{t:'prod',rx:4,a:65},{t:'prod',rx:1,a:28},{t:'prod',rx:2,a:16}]},
 ana:['¿Por qué los coeficientes se usan con moles y no con gramos?','¿Qué pasaría si usaras una ecuación sin balancear?'],
 ev:[MC('Los coeficientes de una ecuación balanceada indican la relación en…',['Moles','Gramos','Litros siempre','Segundos'],0,'Relación molar.'),MC('El primer paso de un cálculo estequiométrico es…',['Pasar la masa a moles','Hallar el volumen','Medir la temperatura','Cambiar los subíndices'],0,'n = m/M.'),MC('En 2 H₂ + O₂ → 2 H₂O, 4 mol de H₂ producen…',['4 mol de H₂O','2 mol de H₂O','8 mol de H₂O','1 mol de H₂O'],0,'Relación 2:2.')],
 conc:'Resume los pasos para calcular la masa de un producto.',lim:'Se asume reacción completa y reactivos puros. Ecuaciones ya balanceadas; masas molares redondeadas.'});

/* 54 */
add({n:'Reactivo limitante',tema:'Estequiometría',dif:3,mot:'estequio',
 obj:'Identificar el reactivo limitante comparando moles ÷ coeficiente y calcular cuánto producto se forma y cuánto reactivo sobra.',comp:[C1,C3],
 evid:['Compara moles dividido entre coeficiente de cada reactivo.','Identifica el reactivo limitante y el que está en exceso.','Calcula la masa de producto según el limitante.'],
 teo:'El <b>reactivo limitante</b> es el que se agota primero y determina cuánto producto se forma; el otro está <b>en exceso</b> y sobra. Para identificarlo se calculan los moles de cada reactivo y se divide cada uno entre su coeficiente: <b>el menor valor corresponde al limitante</b>. Con él se calcula el producto.',
 mat:['Reacciones balanceadas','Barras de moles ÷ coeficiente'],
 proc:[{t:'Ajusta las masas de los dos reactivos y observa las barras.',a:'cambia',n:4},{t:'Pulsa «Calcular» y mira cuál es limitante.',a:'limitante',n:2},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{modo:'lim',retos:[{t:'lim',rx:0,a:4,b:16},{t:'lim',rx:1,a:28,b:3},{t:'lim',rx:3,a:12,b:16},{t:'lim',rx:4,a:13,b:10}]},
 ana:['¿Por qué no basta comparar las masas de los reactivos?','¿Qué pasa con el reactivo en exceso al terminar la reacción?'],
 ev:[MC('El reactivo limitante es el que…',['Se agota primero','Sobra al final','Tiene mayor masa','Es el producto'],0,'Se acaba primero.'),MC('Para hallarlo se compara…',['Moles ÷ coeficiente','Solo gramos','Solo densidades','El color'],0,'El menor es el limitante.'),MC('El producto formado depende del…',['Reactivo limitante','Reactivo en exceso','Recipiente','Color'],0,'El limitante marca el máximo.')],
 conc:'Explica con un ejemplo cómo identificas el reactivo limitante.',lim:'Reacción completa y reactivos puros. Se consideran solo dos reactivos.'});

/* 55 */
add({n:'Rendimiento teórico y porcentual',tema:'Estequiometría',dif:3,mot:'estequio',
 obj:'Calcular el rendimiento teórico de una reacción y el rendimiento porcentual a partir de la masa realmente obtenida.',comp:[C1,C2,C3],
 evid:['Calcula el rendimiento teórico con el reactivo limitante.','Calcula el rendimiento porcentual.','Explica por qué el rendimiento real suele ser menor al teórico.'],
 teo:'El <b>rendimiento teórico</b> es la máxima masa de producto que se puede obtener (calculada con el limitante). El <b>rendimiento real</b> es lo que se obtiene en el laboratorio, normalmente menor por pérdidas, reacciones incompletas o impurezas. <b>Rendimiento porcentual = (real / teórico) × 100</b>. No puede superar el 100 %.',
 mat:['Reacciones balanceadas','Masa obtenida en el laboratorio (deslizador)'],
 proc:[{t:'Ajusta masas y la masa obtenida.',a:'cambia',n:4},{t:'Calcula el rendimiento porcentual.',a:'rend'},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{modo:'rend',retos:[{t:'rend',rx:0,a:4,b:32,real:30},{t:'rend',rx:3,a:24,b:16,real:30},{t:'rend',rx:4,a:65,b:73,real:100},{t:'rend',rx:1,a:28,b:6,real:25}]},
 ana:['¿Por qué el rendimiento real suele ser menor que el teórico?','¿Qué significaría un rendimiento mayor a 100 %?'],
 ev:[MC('El rendimiento porcentual es…',['Real / teórico × 100','Teórico / real × 100','Real + teórico','Real − teórico'],0,'Real sobre teórico.'),MC('Un rendimiento mayor a 100 % indica…',['Un error o producto impuro/húmedo','Una reacción perfecta','Mayor temperatura','Un catalizador'],0,'No es posible.'),MC('El rendimiento teórico se calcula con…',['El reactivo limitante','El reactivo en exceso','El promedio','El producto'],0,'Es el máximo posible.')],
 conc:'Explica qué mide el rendimiento porcentual y por qué suele ser menor a 100 %.',lim:'El «rendimiento real» lo eliges tú con el deslizador: no es una medición experimental.'});

/* 56 */
add({n:'Preparación de soluciones',tema:'Soluciones',dif:2,mot:'mesa',
 obj:"Preparar 100 mL de una solución 0,100 M: pesar el soluto, disolverlo, pasarlo al matraz aforado y enrasar.",comp:[C2,C3],
 evid:['Calcula la concentración a partir de masa y volumen.','Describe el procedimiento para preparar una solución.','Interpreta la concentración en g/L, % m/v y mol/L.'],
 teo:'Una <b>solución</b> es una mezcla homogénea de <b>soluto</b> (lo que se disuelve) y <b>disolvente</b> (generalmente agua). Para prepararla con concentración conocida: <b>1)</b> se pesa el soluto, <b>2)</b> se disuelve en un poco de agua, <b>3)</b> se pasa a un balón aforado, <b>4)</b> se completa con agua hasta la marca (aforo) y <b>5)</b> se mezcla. Cuanto más soluto por volumen de solución, mayor la concentración.',
 mat:["Balanza analítica (0,001 g)", "Vaso de 100 mL", "Matraz aforado de 100 mL", "Espátula, varilla y agua destilada"],
 proc:[{"t": "Pesa en el vaso la masa de NaCl que necesitas (tarea 1).", "a": "pesar", "n": 3}, {"t": "Agrega unos 30 mL de agua, agita y pasa la solución al matraz aforado.", "a": "trasvasa"}, {"t": "Completa con agua hasta el aforo (gotero) y comprueba la tarea 2.", "a": "tarea_ok", "n": 2}, {"t": "Resuelve los retos.", "a": "todo_ok"}],
 cfg:{"T0": 22, "inst": ["balanza", "verter", "agitar"], "bal": {"res": 0.001, "n": "Balanza analítica"}, "reag": [{"id": "nacl", "n": "Cloruro de sodio (sólido)", "tipo": "sol", "M": 58.44, "solute": "NaCl"}, {"id": "agua", "n": "Agua destilada", "tipo": "liq", "rho": 1.0, "kind": "agua"}], "vasos": [{"id": "va", "n": "Vaso 100 mL", "tipo": "vaso", "cap": 100, "tara": 48.372}, {"id": "af", "n": "Matraz aforado 100 mL", "tipo": "aforado", "cap": 100, "aforo": 100, "tara": 71.5}], "tareas": [{"t": "masa", "vaso": "va", "r": "nacl", "g": 0.585, "tol": 0.005, "txt": "Para 100 mL de NaCl 0,100 M calcula la masa (M = 58,44 g/mol) y pésala en el vaso: debe dar 0,585 g.", "tab": "balanza"}, {"t": "conc", "vaso": "af", "sol": "NaCl", "c": 0.1, "V": 100, "tolV": 0.3, "rel": 0.03, "txt": "Disuelve, pasa al matraz aforado y enrasa a 100 mL: la solución debe quedar 0,100 M.", "tab": "agitar"}], "retos": [{"q": "¿Por qué se completa con agua en el matraz aforado y no se agrega un volumen fijo?", "o": ["Porque el volumen final de la solución debe ser exacto", "Para gastar menos agua", "Para que se disuelva más rápido", "No hay razón"], "ok": 0, "why": "La concentración depende del volumen final de solución."}, {"q": "0,585 g de NaCl (58,44 g/mol) son…", "o": ["0,0100 mol", "0,585 mol", "0,100 mol", "34,2 mol"], "ok": 0, "why": "0,585 ÷ 58,44 = 0,0100 mol."}]},
 ana:['¿Por qué se completa el volumen en el balón aforado en vez de agregar un volumen fijo de agua?','¿Cómo cambia el color de la solución de CuSO₄ cuando aumenta la masa de soluto?'],
 ev:[MC('El soluto es…',['Lo que se disuelve','El disolvente','El recipiente','El aforo'],0,'Se disuelve en el disolvente.'),MC('El balón aforado sirve para…',['Completar un volumen exacto','Calentar','Pesar','Filtrar'],0,'Tiene marca de aforo.'),MC('Con más soluto y el mismo volumen, la concentración…',['Aumenta','Disminuye','Igual','Se anula'],0,'Hay más soluto por litro.')],
 conc:'Describe los pasos para preparar una solución y qué cálculo hiciste.',lim:'El color es solo ilustrativo. Se ignora el cambio de volumen por disolución. No incluye seguridad real: NaOH y KMnO₄ requieren protección en el laboratorio.'});

/* 57 */
add({n:'Concentración porcentual',tema:'Soluciones',dif:2,mot:'mesa',
 obj:'Calcular concentraciones porcentuales (% m/m y % m/v) y ppm de una solución.',comp:[C1,C3],
 evid:['Calcula % m/m comparando masas.','Calcula % m/v comparando masa y volumen.','Distingue las dos formas de expresarlo.'],
 teo:'La <b>concentración porcentual</b> expresa cuánto soluto hay por cada 100 partes de solución. <b>% m/m</b> = masa de soluto / masa de solución × 100. <b>% m/v</b> = masa de soluto (g) / volumen de solución (mL) × 100. Para concentraciones muy pequeñas se usan <b>ppm</b> (mg de soluto por kg de solución).',
 mat:["Balanza", "Vaso y probeta", "NaCl y agua destilada"],
 proc:[{"t": "Pesa 10,00 g de NaCl en el vaso (tara primero).", "a": "pesar", "n": 3}, {"t": "Agrega agua hasta que la solución tenga 100 g en total (usa la balanza).", "a": "verter", "n": 3}, {"t": "Agita y comprueba las tareas.", "a": "tarea_ok", "n": 2}, {"t": "Resuelve los retos.", "a": "todo_ok"}],
 cfg:{"T0": 22, "inst": ["balanza", "verter", "agitar"], "bal": {"res": 0.01, "n": "Balanza"}, "reag": [{"id": "nacl", "n": "Cloruro de sodio (sólido)", "tipo": "sol", "M": 58.44, "solute": "NaCl"}, {"id": "agua", "n": "Agua destilada", "tipo": "liq", "rho": 1.0, "kind": "agua"}], "vasos": [{"id": "va", "n": "Vaso 250 mL", "tipo": "vaso", "cap": 250, "tara": 92.15}, {"id": "pr", "n": "Probeta 100 mL", "tipo": "probeta", "cap": 100, "tara": 118.4}], "tareas": [{"t": "masa", "vaso": "va", "r": "nacl", "g": 10.0, "tol": 0.06, "txt": "Para preparar una solución al 10 % m/v en 100 mL necesitas 10,0 g de NaCl. Pésalos en el vaso.", "tab": "balanza"}, {"t": "vol", "vaso": "pr", "V": 90, "tol": 0.6, "r": "agua", "txt": "Mide 90 mL de agua en la probeta (≈ 90 g): con 10 g de soluto la solución tendrá cerca de 100 g, es decir ≈ 10 % m/m.", "tab": "verter"}], "retos": [{"q": "Una solución con 10 g de NaCl en 100 g de solución es…", "o": ["10 % m/m", "10 % m/v", "1 % m/m", "100 % m/m"], "ok": 0, "why": "Masa de soluto ÷ masa de solución × 100."}, {"q": "El % m/v compara…", "o": ["Masa de soluto con volumen de solución", "Dos masas", "Dos volúmenes", "Masa con temperatura"], "ok": 0, "why": "g de soluto por 100 mL de solución."}, {"q": "5 g de glucosa en 250 mL de solución son…", "o": ["2 % m/v", "5 % m/v", "0,2 % m/v", "20 % m/v"], "ok": 0, "why": "5 ÷ 250 × 100 = 2 %."}]},
 ana:['¿Por qué % m/m y % m/v pueden dar valores diferentes?','¿Cuándo es útil expresar la concentración en ppm?'],
 ev:[MC('Una solución al 10 % m/m tiene…',['10 g de soluto en 100 g de solución','10 g de soluto en 10 g de agua','10 mL de soluto','10 mol'],0,'Por cada 100 g de solución.'),MC('% m/v compara…',['Masa de soluto con volumen de solución','Dos masas','Dos volúmenes','Temperatura y masa'],0,'Masa / volumen.'),MC('ppm se usa para concentraciones…',['Muy pequeñas','Muy grandes','Negativas','Iguales a 100 %'],0,'Partes por millón.')],
 conc:'Explica la diferencia entre % m/m y % m/v con un ejemplo.',lim:'Se usa la masa total como suma de soluto y agua. El % m/v no usa densidad: el volumen lo eliges tú.'});

/* 58 */
add({n:'Molaridad',tema:'Soluciones',dif:3,mot:'mesa',
 obj:'Calcular la molaridad de una solución y la masa de soluto necesaria para una molaridad dada.',comp:[C1,C3],
 evid:['Calcula moles de soluto a partir de la masa.','Calcula M = n / V(L).','Despeja la masa para preparar una solución de molaridad conocida.'],
 teo:'La <b>molaridad (M)</b> es la cantidad de soluto en moles por litro de solución: <b>M = n / V</b> (V en litros). Para hallar n se usa n = m / masa molar. Ejemplo: 5,84 g de NaCl (M = 58,44 g/mol) son 0,10 mol; en 100 mL (0,100 L) la molaridad es 1,0 mol/L.',
 mat:["Balanza (0,01 g)", "Vaso y matraz aforado de 250 mL", "Glucosa y agua destilada"],
 proc:[{"t": "Calcula la masa de glucosa para 250 mL de 0,200 M y pésala en el vaso.", "a": "pesar", "n": 3}, {"t": "Agrega agua, agita y pasa la solución al matraz aforado.", "a": "trasvasa"}, {"t": "Enrasa a 250 mL y comprueba las tareas.", "a": "tarea_ok", "n": 2}, {"t": "Resuelve los retos.", "a": "todo_ok"}],
 cfg:{"T0": 22, "inst": ["balanza", "verter", "agitar"], "bal": {"res": 0.01, "n": "Balanza granataria"}, "reag": [{"id": "glu", "n": "Glucosa (sólido)", "tipo": "sol", "M": 180.16, "solute": "C6H12O6"}, {"id": "agua", "n": "Agua destilada", "tipo": "liq", "rho": 1.0, "kind": "agua"}], "vasos": [{"id": "va", "n": "Vaso 250 mL", "tipo": "vaso", "cap": 250, "tara": 92.15}, {"id": "af", "n": "Matraz aforado 250 mL", "tipo": "aforado", "cap": 250, "aforo": 250, "tara": 118.6}], "tareas": [{"t": "masa", "vaso": "va", "r": "glu", "g": 9.01, "tol": 0.06, "txt": "Para 250 mL de glucosa 0,200 M: n = 0,200 × 0,250 = 0,0500 mol → m = n × 180,16 g/mol = 9,01 g. Pésala.", "tab": "balanza"}, {"t": "conc", "vaso": "af", "sol": "C6H12O6", "c": 0.2, "V": 250, "tolV": 0.4, "rel": 0.03, "txt": "Disuelve, pasa al matraz aforado y enrasa a 250 mL: debe quedar 0,200 M.", "tab": "agitar"}], "retos": [{"q": "M = …", "o": ["n ÷ V(L)", "m ÷ M", "V ÷ n", "n × V"], "ok": 0, "why": "Moles de soluto por litro de solución."}, {"q": "5,84 g de NaCl (58,44 g/mol) en 100 mL de solución dan una molaridad de…", "o": ["1,00 M", "0,100 M", "10,0 M", "0,584 M"], "ok": 0, "why": "n = 0,100 mol; V = 0,100 L → 1,00 M."}, {"q": "Si agregas agua a una solución ya preparada, la molaridad…", "o": ["Disminuye", "Aumenta", "No cambia", "Se duplica"], "ok": 0, "why": "Los mismos moles quedan en más volumen."}]},
 ana:['¿Por qué el volumen debe estar en litros?','¿Qué pasa con la molaridad si agregas agua a la solución?'],
 ev:[MC('La molaridad se expresa en…',['mol/L','g/mol','%','°C'],0,'Moles por litro.'),MC('M = …',['n / V (L)','m / M','V / n','n × V'],0,'Moles sobre litros.'),MC('Si agregas agua a una solución, la molaridad…',['Disminuye','Aumenta','Igual','Se duplica'],0,'Hay el mismo soluto en más volumen.')],
 conc:'Explica cómo calculas la molaridad con un ejemplo.',lim:'Se ignora la variación de volumen al disolver. Valores de referencia con masas molares redondeadas.'});

/* 59 */
add({n:'Diluciones',tema:'Soluciones',dif:3,mot:'mesa',
 obj:'Calcular el volumen de solución concentrada necesario para preparar una solución diluida con C₁V₁ = C₂V₂.',comp:[C1,C3],
 evid:['Aplica C₁V₁ = C₂V₂.','Calcula el agua que se agrega.','Explica que al diluir cambia la concentración pero no los moles de soluto.'],
 teo:'Al <b>diluir</b> se agrega disolvente: el volumen aumenta y la concentración disminuye, pero la cantidad de soluto (moles) <b>no cambia</b>. Por eso <b>C₁V₁ = C₂V₂</b>, donde 1 es la solución concentrada (madre) y 2 la diluida. Se despeja V₁ = C₂V₂ / C₁. <b>Seguridad:</b> al diluir un ácido concentrado se agrega el ácido al agua, nunca el agua al ácido.',
 mat:["Pipetas aforadas de 25 y 10 mL", "Matraz aforado de 250 mL", "Solución madre NaCl 1,00 M y agua destilada"],
 proc:[{"t": "Aspira 25 mL de la solución madre con la pipeta aforada y descárgalos en el matraz aforado.", "a": "pipetea"}, {"t": "Agrega agua hasta el aforo (250 mL).", "a": "verter"}, {"t":"Comprueba la tarea.","a":"tarea_ok"}, {"t": "Resuelve los retos.", "a": "todo_ok"}],
 cfg:{"T0": 22, "inst": ["pipeta", "verter", "agitar"], "reag": [{"id": "madre", "n": "Solución madre NaCl 1,00 M", "tipo": "liq", "rho": 1.0, "kind": "agua", "solute": "NaCl", "c": 1.0}, {"id": "agua", "n": "Agua destilada", "tipo": "liq", "rho": 1.0, "kind": "agua"}], "pipetas": [{"id": "p25", "n": "Pipeta aforada 25 mL", "V": 25, "cap": 25, "div": 25}, {"id": "p10", "n": "Pipeta aforada 10 mL", "V": 10, "cap": 10, "div": 10}], "vasos": [{"id": "af", "n": "Matraz aforado 250 mL", "tipo": "aforado", "cap": 250, "aforo": 250, "tara": 118.6}, {"id": "vb", "n": "Vaso 100 mL (residuos)", "tipo": "vaso", "cap": 100, "tara": 48.4}], "tareas": [{"t": "conc", "vaso": "af", "sol": "NaCl", "c": 0.1, "V": 250, "tolV": 0.4, "rel": 0.03, "txt": "Prepara 250 mL de NaCl 0,100 M a partir de la solución madre 1,00 M. Calcula: V₁ = C₂V₂/C₁ = 0,100 × 250 ÷ 1,00 = 25 mL.", "tab": "pipeta"}], "retos": [{"q": "¿Qué volumen de solución 6,0 M se necesita para preparar 250 mL de 1,0 M?", "o": ["41,7 mL", "1,5 mL", "150 mL", "24 mL"], "ok": 0, "why": "V₁ = 1,0 × 250 ÷ 6,0 = 41,7 mL."}, {"q": "Al diluir, la cantidad de soluto (moles)…", "o": ["No cambia", "Aumenta", "Disminuye", "Se duplica"], "ok": 0, "why": "Solo se agrega disolvente: C₁V₁ = C₂V₂."}, {"q": "Para diluir un ácido concentrado se debe…", "o": ["Agregar el ácido al agua", "Agregar agua al ácido", "Calentarlo antes", "Usar un vaso cerrado"], "ok": 0, "why": "Por seguridad, siempre el ácido al agua."}]},
 ana:['¿Por qué no cambian los moles de soluto al diluir?','¿Qué pasa con el color al diluir una solución coloreada?'],
 ev:[MC('Al diluir una solución…',['La concentración disminuye','La concentración aumenta','Cambian los moles de soluto','El soluto desaparece'],0,'Se agrega disolvente.'),MC('La relación de diluciones es…',['C₁V₁ = C₂V₂','C₁ + V₁ = C₂ + V₂','C₁ = V₂','C₁/V₁ = 1'],0,'Los moles se conservan.'),MC('Para diluir un ácido concentrado…',['Se agrega el ácido al agua','Se agrega agua al ácido','Se calienta','Se agita sin agua'],0,'Por seguridad.')],
 conc:'Explica con un ejemplo cómo calculas cuánta solución madre necesitas.',lim:'Se suponen volúmenes aditivos. En el laboratorio real hay que usar protección y material aforado.'});

/* 60 */
add({n:'Solubilidad',tema:'Soluciones',dif:2,mot:'solub',
 obj:'Interpretar la solubilidad de una sal en agua y distinguir soluciones saturadas y no saturadas según la temperatura.',comp:[C2,C3],
 evid:['Lee la solubilidad de una sal en una gráfica.','Predice si una cantidad de sal se disuelve por completo.','Explica el efecto de la temperatura en la solubilidad.'],
 teo:'La <b>solubilidad</b> es la máxima cantidad de soluto que se disuelve en una cantidad dada de disolvente a una temperatura. Se mide en g de soluto por 100 g de agua. Una solución es <b>no saturada</b> si puede disolver más, <b>saturada</b> si ya tiene el máximo (y lo que sobra queda sin disolver). En la mayoría de las sales sólidas la solubilidad <b>aumenta</b> con la temperatura, pero no en todas por igual.',
 mat:['Sales: KNO₃, NaCl, KCl','Datos de solubilidad de referencia'],
 proc:[{t:'Cambia la temperatura y la masa de sal agregada.',a:'cambia',n:5},{t:'Logra una solución saturada con sólido sin disolver.',a:'satura'},{t:'Cambia de sal y compara.',a:'sal'},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{sales:['KNO3','NaCl','KCl'],retos:[{t:'s',sal:'KNO3',T:60},{t:'s',sal:'NaCl',T:20},{t:'est',sal:'KNO3',T:20,m:50},{t:'est',sal:'KCl',T:60,m:40},{t:'s',sal:'KCl',T:80}]},
 ana:['¿Por qué el KNO₃ cambia mucho su solubilidad con la temperatura y el NaCl casi nada?','¿Qué ves cuando una solución está saturada?'],
 ev:[MC('Una solución saturada…',['Ya no disuelve más soluto','Puede disolver más','No tiene soluto','Es un gas'],0,'Tiene el máximo disuelto.'),MC('La solubilidad se expresa en…',['g de soluto / 100 g de agua','°C','mol/s','kg'],0,'Es una cantidad de soluto por cantidad de agua.'),MC('En la mayoría de las sales sólidas, al subir la temperatura la solubilidad…',['Aumenta','Disminuye siempre','No existe','Es cero'],0,'Tendencia general, con excepciones.')],
 conc:'Explica con un ejemplo la diferencia entre solución saturada y no saturada.',lim:'Datos aproximados de tablas de solubilidad, interpolados linealmente entre 0, 20, 40, 60, 80 y 100 °C. No incluye sobresaturación ni gases.'});

/* 61 */
add({n:'Curvas de solubilidad',tema:'Soluciones',dif:3,mot:'solub',
 obj:'Interpretar curvas de solubilidad para comparar sales y predecir cuánta sal cristaliza al enfriar una solución saturada.',comp:[C1,C2,C3],
 evid:['Compara curvas de varias sales.','Lee valores de solubilidad a distintas temperaturas.','Calcula la masa que cristaliza al enfriar.'],
 teo:'Una <b>curva de solubilidad</b> grafica la solubilidad de una sustancia contra la temperatura. Un punto <b>sobre</b> la curva indica solución saturada; <b>debajo</b>, no saturada; <b>encima</b>, hay soluto sin disolver. Si se enfría una solución saturada de una sal cuya solubilidad disminuye al bajar la temperatura, la diferencia entre las solubilidades <b>cristaliza</b>: masa cristalizada = solubilidad(T₁) − solubilidad(T₂).',
 mat:['Sales: KNO₃, NaCl, KCl, NH₄Cl, NaNO₃','Controles de enfriamiento'],
 proc:[{t:'Revisa las curvas y cambia la sal y la temperatura.',a:'cambia',n:5},{t:'Enfría la solución y observa los gramos que cristalizan.',a:'enfria'},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{enfria:true,sales:['KNO3','NaCl','KCl','NH4Cl','NaNO3'],retos:[{t:'s',sal:'NH4Cl',T:40},{t:'s',sal:'NaNO3',T:60},{t:'cool',sal:'KNO3',m:110,T:60,T2:20},{t:'cool',sal:'NaCl',m:37.1,T:60,T2:20},{t:'cool',sal:'KCl',m:45.5,T:60,T2:20}]},
 ana:['¿Qué sal es mejor para cristalizar por enfriamiento y por qué?','¿Por qué el NaCl casi no cristaliza al enfriarse?'],
 ev:[MC('Un punto por encima de la curva significa…',['Hay soluto sin disolver','Solución no saturada','No hay soluto','Es un gas'],0,'Supera la solubilidad.'),MC('Al enfriar una solución saturada de KNO₃…',['Cristaliza parte de la sal','Se disuelve más sal','Nada cambia','Se evapora'],0,'Disminuye su solubilidad.'),MC('Una curva casi plana indica que la solubilidad…',['Cambia poco con la temperatura','Es cero','Es infinita','Disminuye mucho'],0,'Como el NaCl.')],
 conc:'Explica cómo usas una curva de solubilidad para predecir la cristalización.',lim:'Interpolación lineal de datos de referencia redondeados; no incluye sobresaturación ni velocidad de cristalización.'});

/* 62 */
add({n:'Escala de pH',tema:'Ácidos y bases',dif:2,mot:'ph',
 obj:'Interpretar la escala de pH y relacionarla con la concentración de iones H⁺ en sustancias cotidianas.',comp:[C1,C2],
 evid:['Clasifica sustancias como ácidas, neutras o básicas según su pH.','Relaciona pH con [H⁺].','Explica que cada unidad de pH es un factor de 10.'],
 teo:'El <b>pH</b> mide la acidez: <b>pH = −log[H⁺]</b>. En agua a 25 °C: pH &lt; 7 <b>ácido</b>, pH = 7 <b>neutro</b>, pH &gt; 7 <b>básico</b>; además pH + pOH = 14. La escala es logarítmica: una disminución de 1 unidad de pH significa <b>10 veces</b> más H⁺. Un pH 3 es 100 veces más ácido que un pH 5.',
 mat:['15 sustancias cotidianas con pH típico','Escala de color de indicador universal'],
 proc:[{t:'Elige al menos 5 sustancias y lee su pH.',a:'elige',n:5},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{modo:'escala',retos:[{q:'Una solución con pH 3 es…',o:['Ácida','Básica','Neutra','No se puede saber'],ok:0,why:'pH menor que 7: ácida.'},{q:'Si el pH baja de 5 a 3, la concentración de H⁺…',o:['Aumenta 100 veces','Aumenta 2 veces','Disminuye 100 veces','No cambia'],ok:0,why:'Cada unidad de pH es un factor de 10: dos unidades, 100 veces.'},{q:'¿Cuál es más ácida: jugo de limón (pH 2,3) o leche (pH 6,6)?',o:['Jugo de limón','Leche','Igual','Depende de la marca'],ok:0,why:'Menor pH, mayor acidez.'},{q:'A 25 °C, pH + pOH es igual a…',o:['14','7','0','1'],ok:0,why:'Relación del agua a 25 °C.'},{q:'El agua pura a 25 °C tiene pH…',o:['7','0','14','1'],ok:0,why:'Es neutra.'}]},
 ana:['¿Por qué una diferencia de 2 unidades de pH es una diferencia de 100 veces en [H⁺]?','¿Qué sustancias de tu casa son ácidas y cuáles básicas?'],
 ev:[MC('El pH de una solución neutra a 25 °C es…',['7','0','14','10'],0,'Neutro.'),MC('Un pH de 10 corresponde a una solución…',['Básica','Ácida','Neutra','Gaseosa'],0,'Mayor que 7.'),MC('pH = …',['−log[H⁺]','log[OH⁻]','[H⁺]','14 − [H⁺]'],0,'Definición.')],
 conc:'Explica qué mide el pH y cómo se interpreta la escala.',lim:'Valores de pH típicos y aproximados de sustancias cotidianas; el pH real varía con la marca y la preparación. A 25 °C.'});

/* 63 */
add({n:'Indicadores ácido-base',tema:'Ácidos y bases',dif:2,mot:'ph',
 obj:'Usar indicadores para estimar el rango de pH de una muestra a partir del color observado.',comp:[C2,C3],
 evid:['Describe el cambio de color de cada indicador.','Usa varios indicadores para acotar el pH.','Elige el indicador adecuado para un rango de pH.'],
 teo:'Un <b>indicador ácido-base</b> es una sustancia que cambia de color según el pH. Cada indicador tiene un <b>intervalo de viraje</b>: fenolftaleína (incolora hasta pH 8,2 → fucsia desde pH 10), azul de bromotimol (amarillo bajo pH 6 → azul sobre pH 7,6), rojo de metilo (rojo bajo 4,4 → amarillo sobre 6,2), naranja de metilo (rojo bajo 3,1 → amarillo sobre 4,4). Con varios indicadores se acota el pH. El <b>indicador universal</b> mezcla varios y da una escala de colores.',
 mat:['4 indicadores y el indicador universal','Muestra con pH ajustable'],
 proc:[{t:'Agrega al menos 3 indicadores distintos a una muestra.',a:'agrega',n:3},{t:'Prueba el indicador universal.',a:'universal'},{t:'Resuelve los retos.',a:'todo_ok'}],
 cfg:{modo:'indic',retos:[{q:'La fenolftaleína se vuelve rosa/fucsia cuando el pH es…',o:['Mayor que 10','Menor que 3','Igual a 5','Igual a 7'],ok:0,why:'Vira entre 8,2 y 10.'},{q:'Una muestra con azul de bromotimol azul y fenolftaleína incolora tiene un pH entre…',o:['7,6 y 8,2','1 y 3','10 y 14','4 y 5'],ok:0,why:'Azul de bromotimol azul: pH mayor que 7,6; fenolftaleína incolora: pH menor que 8,2.'},{q:'Si el naranja de metilo se ve rojo, el pH es…',o:['Menor que 3,1','Mayor que 4,4','Mayor que 10','Igual a 7'],ok:0,why:'Es rojo por debajo de 3,1.'},{q:'¿Qué indicador usarías para detectar un pH cercano a 9?',o:['Fenolftaleína','Naranja de metilo','Rojo de metilo','Ninguno'],ok:0,why:'Su viraje (8,2–10) incluye el pH 9.'}]},
 ana:['¿Por qué un solo indicador no basta para saber el pH exacto?','¿Qué indicador te sirve para una solución de pH cercano a 7?'],
 ev:[MC('Un indicador ácido-base…',['Cambia de color según el pH','Mide la masa','Mide la temperatura','Es un gas'],0,'Viraje de color.'),MC('El intervalo de viraje es…',['El rango de pH donde cambia de color','Su masa','Su temperatura','Su volumen'],0,'Zona de transición.'),MC('El indicador universal…',['Muestra varios colores según el pH','Solo tiene un color','No cambia','Mide la masa'],0,'Mezcla de indicadores.')],
 conc:'Explica cómo usarías indicadores para estimar el pH de una muestra.',lim:'Intervalos de viraje de referencia redondeados; los colores son una aproximación visual. La muestra se simula con un pH que tú eliges.'});

/* 64 */
add({n:'Neutralización ácido-base',tema:'Ácidos y bases',dif:3,mot:'mesa',
 obj:'Realizar una titulación virtual de un ácido fuerte con una base fuerte, identificar el punto de equivalencia y calcular el volumen de base necesario.',comp:[C1,C2,C3],
 evid:['Interpreta la curva de titulación.','Calcula el volumen de base en el punto de equivalencia.','Elige un indicador cuyo viraje incluya el pH de equivalencia.'],
 teo:'En una <b>neutralización</b> un ácido reacciona con una base y forman sal y agua: HCl + NaOH → NaCl + H₂O. En una <b>titulación</b> se agrega base poco a poco a un ácido hasta el <b>punto de equivalencia</b>, donde los moles de ácido igualan a los de base: <b>C<sub>a</sub>V<sub>a</sub> = C<sub>b</sub>V<sub>b</sub></b>. Con ácido y base fuertes el pH de equivalencia es 7 y cambia bruscamente cerca de ese punto.',
 mat:["Bureta de 50 mL con NaOH 0,100 M", "Pipeta aforada de 10 mL", "Erlenmeyer, fenolftaleína y pH-metro"],
 proc:[{"t": "Con la pipeta aforada pasa 10 mL del ácido (HCl desconocido) al Erlenmeyer.", "a": "pipetea"}, {"t": "Agrega el indicador fenolftaleína.", "a": "indicador"}, {"t": "Llena la bureta con NaOH 0,100 M.", "a": "llena_bureta"}, {"t": "Dispensa base hasta que aparezca el rosa permanente.", "a": "dispensa", "n": 6}, {"t": "Anota el volumen gastado y calcula la concentración del ácido (tarea 1).", "a": "tarea_ok"}, {"t": "Resuelve los retos.", "a": "todo_ok"}],
 cfg:{"T0": 22, "inst": ["pipeta", "bureta", "agitar", "ph"], "indicador": "fenolftaleína", "pipetas": [{"id": "pa", "n": "Pipeta aforada 10 mL", "V": 10, "cap": 10, "div": 10}], "bureta": {"reag": "naoh", "cap": 50}, "reag": [{"id": "hcl", "n": "HCl (concentración desconocida)", "tipo": "liq", "rho": 1.0, "kind": "acid", "solute": "HCl", "c": 0.0873}, {"id": "naoh", "n": "NaOH 0,100 M", "tipo": "liq", "rho": 1.0, "kind": "base", "solute": "NaOH", "c": 0.1}, {"id": "agua", "n": "Agua destilada", "tipo": "liq", "rho": 1.0, "kind": "agua"}], "vasos": [{"id": "er", "n": "Erlenmeyer 250 mL", "tipo": "erlen", "cap": 250, "tara": 96.2}], "tareas": [{"t": "titul", "vaso": "er", "Ca": 0.0873, "rel": 0.03, "txt": "Titula 10,00 mL de HCl con NaOH 0,100 M hasta el punto final y calcula la concentración del HCl: C = Cb × Vb ÷ Va.", "tab": "bureta"}], "retos": [{"q": "En el punto de equivalencia de HCl con NaOH, el pH es aproximadamente…", "o": ["7", "1", "13", "0"], "ok": 0, "why": "Ácido fuerte con base fuerte: queda neutra."}, {"q": "Se gastan 8,73 mL de NaOH 0,100 M para 10,00 mL de HCl. La concentración del HCl es…", "o": ["0,0873 M", "0,115 M", "0,873 M", "0,0100 M"], "ok": 0, "why": "0,100 × 8,73 ÷ 10,00 = 0,0873 M."}, {"q": "La fenolftaleína se usa aquí porque…", "o": ["Vira cerca del punto de equivalencia", "Es incolora siempre", "Neutraliza el ácido", "Aumenta el pH"], "ok": 0, "why": "Cambia de incolora a rosa cerca de pH 8,2–10."}]},
 ana:['¿Por qué el pH cambia tan rápido cerca del punto de equivalencia?','¿Por qué conviene un indicador cuyo viraje esté cerca de pH 7 en esta titulación?'],
 ev:[MC('En el punto de equivalencia…',['Moles de ácido = moles de base','Moles de ácido > moles de base','No hay reacción','El pH es 0'],0,'Se neutralizan exactamente.'),MC('HCl + NaOH produce…',['NaCl + H₂O','NaOH + H₂','Cl₂ + Na','Solo agua'],0,'Sal y agua.'),MC('Una titulación sirve para…',['Hallar una concentración desconocida','Medir la masa','Cambiar la temperatura','Filtrar'],0,'Se calcula con CaVa = CbVb.')],
 conc:'Explica qué ocurre en la neutralización y cómo hallas el volumen de equivalencia.',lim:'Solo ácido fuerte con base fuerte, a 25 °C, volúmenes aditivos; no incluye ácidos o bases débiles ni soluciones amortiguadoras.'});

/* 65 */
add({n:'Química del agua',tema:'Agua',dif:2,mot:'clasif',
 obj:'Evaluar muestras de agua con pruebas de pH, turbiedad y dureza y decidir si cumplen valores de referencia para consumo humano.',comp:[C2,C3],
 evid:['Interpreta resultados de pH, turbiedad y dureza.','Compara con valores de referencia.','Justifica por qué una muestra no es apta.'],
 teo:'El agua es un <b>disolvente polar</b>: disuelve sales, ácidos y muchos gases, por eso en la naturaleza nunca es pura. Para evaluar su calidad se miden, entre otros: <b>pH</b> (acidez), <b>turbiedad</b> (partículas suspendidas) y <b>dureza</b> (calcio y magnesio disueltos, en mg/L de CaCO₃). Valores de referencia usados aquí (por verificar con la Resolución 2115 de 2007): pH 6,5–9,0; turbiedad ≤ 2 UNT; dureza ≤ 300 mg/L.',
 mat:['8 muestras simuladas','3 pruebas: pH, turbiedad y dureza'],
 proc:[{t:'Haz al menos 4 pruebas en total.',a:'prueba',n:4},{t:'Clasifica 4 muestras correctamente.',a:'clasifica_ok',n:4},{t:'Clasifica las 8 muestras.',a:'todo_ok'}],
 cfg:{tituloItems:'Muestras de agua',pregunta:'¿Es apta para consumo humano?',
  items:[{k:'a',n:'Agua de acueducto',e:'🚰'},{k:'b',n:'Lluvia ácida',e:'🌧️'},{k:'c',n:'Agua de río turbia',e:'🌊'},{k:'d',n:'Agua de pozo muy dura',e:'🕳️'},{k:'e',n:'Agua embotellada',e:'🧴'},{k:'f',n:'Agua de charco',e:'💦'},{k:'g',n:'Agua muy alcalina industrial',e:'🏭'},{k:'h',n:'Agua de manantial',e:'⛰️'}],
  tests:[{k:'ph',n:'Medir pH'},{k:'tu',n:'Medir turbiedad'},{k:'du',n:'Medir dureza'}],
  cats:[{k:'s',n:'Apta'},{k:'n',n:'No apta'}],
  ans:{a:'s',b:'n',c:'n',d:'n',e:'s',f:'n',g:'n',h:'s'},
  res:{a:{ph:'pH 7,2 (dentro de 6,5–9,0)',tu:'0,8 UNT (≤ 2)',du:'80 mg/L (≤ 300)'},b:{ph:'pH 4,5 (fuera del rango)',tu:'0,5 UNT',du:'5 mg/L'},c:{ph:'pH 7,5',tu:'45 UNT (muy por encima de 2)',du:'120 mg/L'},d:{ph:'pH 7,8',tu:'1,0 UNT',du:'420 mg/L (supera 300)'},e:{ph:'pH 7,0',tu:'0,3 UNT',du:'50 mg/L'},f:{ph:'pH 6,0 (fuera del rango)',tu:'30 UNT (muy por encima de 2)',du:'60 mg/L'},g:{ph:'pH 10,5 (fuera del rango)',tu:'1,0 UNT',du:'100 mg/L'},h:{ph:'pH 7,6',tu:'1,5 UNT (≤ 2)',du:'150 mg/L (≤ 300)'}},
  why:{a:'Cumple los tres valores de referencia.',b:'Su pH es demasiado ácido.',c:'Turbiedad muy alta.',d:'Dureza por encima de lo permitido.',e:'Cumple los tres valores.',f:'pH bajo y turbiedad alta.',g:'pH demasiado básico.',h:'Cumple los tres valores.'}},
 ana:['¿Por qué el agua de lluvia puede ser ácida si parece limpia?','¿Qué significa que el agua sea «dura»?'],
 ev:[MC('El agua es un buen disolvente porque es…',['Polar','Apolar','Un metal','Un gas noble'],0,'Sus moléculas son polares.'),MC('La turbiedad mide…',['Partículas suspendidas','La acidez','La temperatura','El sabor'],0,'Qué tan turbia es.'),MC('La dureza se debe sobre todo a…',['Calcio y magnesio disueltos','Cloro','Oxígeno','Hierro metálico'],0,'Iones Ca²⁺ y Mg²⁺.')],
 conc:'Explica por qué una de las muestras no fue apta, usando las pruebas.',lim:'Muestras y valores simulados con fines didácticos; el análisis real de potabilidad incluye muchos más parámetros (microbiología, cloro residual, metales). Valores de referencia por verificar con la norma vigente.'});

/* 66 */
add({n:'Contaminación química ambiental',tema:'Ambiente',dif:2,mot:'clasif',
 obj:'Clasificar contaminantes químicos según su naturaleza y relacionarlos con su efecto ambiental.',comp:[C2,C3],
 evid:['Reconoce fuentes y efectos de contaminantes comunes.','Clasifica contaminantes por tipo.','Propone una medida para reducir uno de ellos.'],
 teo:'Los <b>contaminantes químicos</b> son sustancias que, en cantidad suficiente, dañan los seres vivos o los ecosistemas. Ejemplos: <b>ácidos</b> (lluvia ácida por SO₂ y NOₓ), <b>metales pesados</b> (mercurio de la minería, plomo de baterías), <b>nutrientes</b> en exceso (nitratos y fosfatos que causan eutrofización), <b>hidrocarburos</b> (derrames de petróleo) y <b>gases de efecto invernadero</b> (CO₂ de la combustión). Conocer su naturaleza ayuda a prevenirlos y a tratarlos.',
 mat:['8 situaciones de contaminación','3 pruebas: fuente, efecto y medida de control'],
 proc:[{t:'Haz al menos 4 pruebas.',a:'prueba',n:4},{t:'Clasifica 4 situaciones correctamente.',a:'clasifica_ok',n:4},{t:'Clasifica las 8.',a:'todo_ok'}],
 cfg:{tituloItems:'Situaciones',pregunta:'¿Qué tipo de contaminante es?',
  items:[{k:'a',n:'Lluvia ácida (SO₂, NOₓ)',e:'🌧️'},{k:'b',n:'Mercurio de minería de oro',e:'⛏️'},{k:'c',n:'Fertilizantes en un lago',e:'🌱'},{k:'d',n:'Derrame de petróleo',e:'🛢️'},{k:'e',n:'CO₂ de la combustión',e:'🏭'},{k:'f',n:'Plomo de baterías',e:'🔋'},{k:'g',n:'Vertido de ácido sulfúrico',e:'⚗️'},{k:'h',n:'Detergentes con fosfatos',e:'🧼'}],
  tests:[{k:'fu',n:'Fuente'},{k:'ef',n:'Efecto'},{k:'me',n:'Medida de control'}],
  cats:[{k:'a',n:'Ácido'},{k:'m',n:'Metal pesado'},{k:'n',n:'Nutriente en exceso'},{k:'h',n:'Hidrocarburo'},{k:'g',n:'Gas de efecto invernadero'}],
  ans:{a:'a',b:'m',c:'n',d:'h',e:'g',f:'m',g:'a',h:'n'},
  res:{a:{fu:'Combustión de carbón y petróleo (SO₂ y NOₓ).',ef:'Acidifica lagos y suelos y daña la vegetación.',me:'Filtros y combustibles con menos azufre.'},b:{fu:'Minería que usa mercurio para separar el oro.',ef:'Se acumula en peces y afecta la salud humana.',me:'Técnicas sin mercurio y control de vertimientos.'},c:{fu:'Escorrentía de campos agrícolas.',ef:'Crecen algas en exceso y baja el oxígeno (eutrofización).',me:'Fertilizar en las dosis necesarias.'},d:{fu:'Accidentes o fugas en la extracción y el transporte.',ef:'Capa aceitosa que impide el paso de oxígeno y daña fauna.',me:'Barreras de contención y limpieza.'},e:{fu:'Quema de combustibles fósiles.',ef:'Retiene calor y contribuye al calentamiento global.',me:'Eficiencia energética y energías renovables.'},f:{fu:'Baterías mal desechadas.',ef:'Metal tóxico que se acumula en el suelo y el agua.',me:'Reciclaje en puntos autorizados.'},g:{fu:'Vertidos industriales sin tratar.',ef:'Baja mucho el pH del agua y mata organismos.',me:'Neutralizar antes de verter.'},h:{fu:'Aguas residuales domésticas con detergentes.',ef:'Aportan fósforo que favorece el crecimiento de algas.',me:'Detergentes sin fosfatos y tratamiento de aguas.'}},
  why:{a:'Los óxidos de azufre y nitrógeno forman ácidos en la atmósfera.',b:'El mercurio es un metal pesado tóxico.',c:'Nitratos y fosfatos son nutrientes.',d:'Es una mezcla de hidrocarburos.',e:'El CO₂ es un gas de efecto invernadero.',f:'El plomo es un metal pesado.',g:'Es un ácido fuerte.',h:'El fósforo es un nutriente.'}},
 ana:['¿Qué contaminante de esta lista crees que afecta más a tu región y por qué?','¿Qué medida de tu casa o colegio podría reducir uno de ellos?'],
 ev:[MC('El mercurio es un…',['Metal pesado','Gas noble','Ácido','Nutriente'],0,'Es tóxico y se acumula.'),MC('La eutrofización la causan…',['Exceso de nutrientes','Exceso de oxígeno','Falta de luz','Metales'],0,'Nitratos y fosfatos.'),MC('La lluvia ácida se origina por…',['SO₂ y NOₓ en la atmósfera','O₂','N₂','Vapor de agua'],0,'Forman ácidos con el agua.')],
 conc:'Elige un contaminante y explica su fuente, efecto y una medida para reducirlo.',lim:'Clasificación simplificada: un mismo contaminante puede pertenecer a varias categorías. Descripciones generales, sin cifras locales.'});

window.QUI_G9=L;
})();
