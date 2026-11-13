/* AULA360 — Informes profesionales y Planes de mejoramiento (individual y grupal) de simulacros y diagnósticos.
   Todo se calcula con los resultados ya calificados; no gasta IA. Se puede ver, imprimir y se codifica (ISO). */
window.INF=(function(){
const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pc=(c,t)=>t?Math.round(100*c/t):null;
const W={'Lectura Crítica':3,'Matemáticas':3,'Sociales y Ciudadanas':3,'Ciencias Naturales':3,'Inglés':1};
const NIV=p=>p==null?['—','#94a3b8']:p<35?['Nivel 1 · Insuficiente','#dc2626']:p<50?['Nivel 2 · Mínimo','#f59e0b']:p<70?['Nivel 3 · Satisfactorio','#2563eb']:['Nivel 4 · Avanzado','#16a34a'];
const nvl=p=>p==null?0:p<35?1:p<50?2:p<70?3:4;
const ACC={
 'Lectura Crítica':['Leer a diario un texto continuo y uno discontinuo (noticia, infografía, cómic) y escribir la idea central en una línea.','Practicar preguntas de inferencia y de intención del autor: justificar la respuesta con una frase del texto.','Resumir textos argumentativos identificando tesis, argumentos y conclusión.','Simulacro corto semanal de 15 preguntas con retroalimentación inmediata.'],
 'Matemáticas':['Repasar operaciones y proporcionalidad con problemas contextualizados (porcentajes, razones, escalas).','Interpretar tablas y gráficas estadísticas y explicar conclusiones por escrito.','Resolver 5 problemas diarios de razonamiento: plantear, resolver y verificar.','Corregir los errores de cada simulacro en un cuaderno de errores.'],
 'Sociales y Ciudadanas':['Leer casos reales sobre Constitución, derechos y participación y responder preguntas de análisis.','Construir líneas de tiempo y mapas de conceptos de los temas más débiles.','Analizar fuentes (textos, mapas, caricaturas) identificando perspectiva y contexto.','Debatir dilemas ciudadanos con argumentos y evidencias.'],
 'Ciencias Naturales':['Practicar lectura de gráficas y tablas experimentales y formular hipótesis.','Repasar conceptos clave de biología, química y física con esquemas y ejemplos cotidianos.','Resolver preguntas de indagación: variables, control y conclusiones.','Elaborar mapas conceptuales por componente (entorno vivo, físico y químico).'],
 'Inglés':['Escuchar o leer 10 minutos diarios en inglés (canciones, noticias cortas, subtítulos).','Estudiar vocabulario de contexto y practicar las partes 1 a 7 del examen Saber.','Completar conversaciones y avisos identificando el propósito comunicativo.','Un ejercicio de gramática de uso (tiempos verbales, conectores) cada semana.']};
const GEN=['Revisar los temas del área con las preguntas falladas del simulacro.','Practicar ejercicios graduados del nivel básico al avanzado.','Pedir acompañamiento al docente en las dudas frecuentes.','Repetir una prueba corta y comparar el avance.'];
const acc=a=>ACC[a]||GEN;
const DOCE={'Lectura Crítica':'Comprensión de textos continuos y discontinuos; taller de inferencias semanal.','Matemáticas':'Resolución de problemas contextualizados y análisis de datos; clínica de errores.','Sociales y Ciudadanas':'Análisis de casos y fuentes; trabajo con competencias ciudadanas.','Ciencias Naturales':'Indagación y lectura de gráficas; prácticas con situaciones reales.','Inglés':'Lectura y escucha progresivas; vocabulario en contexto.'};
let Zr=null; // {imp, dg, est:[{name,doc,course,areas,grados}], cols, colegio, logo}
const fF=()=>new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'});
const tot=x=>Object.values(x.areas).reduce((s,v)=>({c:s.c+v.c,t:s.t+v.t}),{c:0,t:0});
function glob(areas){let s=0,w=0;Object.keys(W).forEach(a=>{const x=areas[a];if(x&&x.t){s+=W[a]*(x.c/x.t*100);w+=W[a]}});return w?Math.round(s/w*5):null}
function promA(est,a){const v=est.filter(x=>x.areas[a]&&x.areas[a].t).map(x=>pc(x.areas[a].c,x.areas[a].t));return v.length?Math.round(v.reduce((s,y)=>s+y,0)/v.length):null}
const COL='#1e63e9',COL2='#f5b82e';
function barras(items,tit,dos){
  // items:[{l,v,v2}] horizontal SVG (imprime bien)
  const H=34,W0=640,pad=170,n=items.length,h=n*H+30;
  return`<svg viewBox="0 0 ${W0} ${h}" width="100%" style="max-width:640px;font:11px Arial,sans-serif"><text x="0" y="12" font-weight="700" fill="#0f172a">${e(tit)}</text>${items.map((it,i)=>{const y=24+i*H,w=v=>v==null?0:Math.max(2,(W0-pad-50)*v/100);return`<text x="0" y="${y+13}" fill="#334155">${e(it.l)}</text><rect x="${pad}" y="${y}" width="${W0-pad-50}" height="12" fill="#eef2f7" rx="3"/><rect x="${pad}" y="${y}" width="${w(it.v)}" height="12" fill="${COL}" rx="3"/><text x="${pad+w(it.v)+5}" y="${y+10}" fill="#0f172a" font-weight="700">${it.v==null?'—':it.v+'%'}</text>${dos&&it.v2!=null?`<rect x="${pad}" y="${y+14}" width="${w(it.v2)}" height="8" fill="${COL2}" rx="3"/><text x="${pad+w(it.v2)+5}" y="${y+22}" fill="#64748b">${it.v2}%</text>`:''}`}).join('')}</svg>${dos?`<div style="font-size:10px;color:#475569"><span style="color:${COL}">■</span> Estudiante &nbsp; <span style="color:${COL2}">■</span> Promedio del grupo</div>`:''}`;
}
function apiladas(cols){
  // distribución por niveles por área (grupo)
  const C=['#dc2626','#f59e0b','#2563eb','#16a34a'];
  return`<svg viewBox="0 0 640 ${cols.length*30+40}" width="100%" style="max-width:640px;font:11px Arial,sans-serif"><text x="0" y="12" font-weight="700" fill="#0f172a">Estudiantes por nivel de desempeño en cada área</text>${cols.map((c,i)=>{const y=24+i*30;let x=170;const tt=c.n.reduce((a,b)=>a+b,0)||1;return`<text x="0" y="${y+12}" fill="#334155">${e(c.a)}</text>`+c.n.map((k,j)=>{const w=440*k/tt;const r=`<rect x="${x}" y="${y}" width="${w}" height="16" fill="${C[j]}"/>${k?`<text x="${x+w/2}" y="${y+12}" fill="#fff" text-anchor="middle" font-weight="700">${k}</text>`:''}`;x+=w;return r}).join('')}).join('')}<g transform="translate(170,${cols.length*30+30})">${['N1 Insuficiente','N2 Mínimo','N3 Satisfactorio','N4 Avanzado'].map((l,j)=>`<rect x="${j*112}" y="-8" width="9" height="9" fill="${C[j]}"/><text x="${j*112+13}" y="0" fill="#475569" font-size="10">${l}</text>`).join('')}</g></svg>`;
}
const CSS=`<style>.inf{font:11pt/1.4 Arial,sans-serif;color:#0f172a}.inf h2{font-size:15pt;margin:8px 0 2px}.inf h3{font-size:12pt;margin:14px 0 5px;border-bottom:2px solid #1e63e9;padding-bottom:2px}.inf table{width:100%;border-collapse:collapse;margin:6px 0;font-size:10pt}.inf th,.inf td{border:1px solid #94a3b8;padding:4px 6px;text-align:left}.inf th{background:#e8eef8}.inf .k{display:flex;gap:8px;margin:8px 0}.inf .k div{flex:1;border:1px solid #94a3b8;border-radius:6px;padding:6px;text-align:center}.inf .k b{display:block;font-size:16pt}.inf .pg{page-break-after:always}.inf .pg:last-child{page-break-after:auto}.inf .f{display:flex;gap:30px;margin-top:40px}.inf .f div{flex:1;border-top:1px solid #000;text-align:center;font-size:9pt;padding-top:3px}.inf ul{margin:4px 0 4px 18px;list-style:disc;padding-left:4px}.inf li{display:list-item}</style>`;
function enc(titulo,sub){
  const lh=(typeof lhHtml==='function')?lhHtml(16):'';
  return`${lh}<h2>${e(titulo)}</h2><div style="font-size:10pt;color:#475569">${e(sub)}</div>`}
function datosBase(){return`${e(Zr.imp.title)} · ${Zr.dg?'Prueba diagnóstica':'Simulacro Saber 11'}${Zr.imp.exam_date?' · aplicación '+new Date(Zr.imp.exam_date+'T12:00:00').toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'}):''} · Emitido ${fF()}`}
/* ---------- Individual ---------- */
function indHtml(x){
  const g=Zr.est,cols=Zr.cols.filter(a=>x.areas[a]&&x.areas[a].t),T=tot(x),G=Zr.dg?pc(T.c,T.t):glob(x.areas);
  const it=cols.map(a=>({l:a,v:pc(x.areas[a].c,x.areas[a].t),v2:promA(g,a)}));
  const deb=[...it].sort((a,b)=>a.v-b.v).filter(i=>i.v<70),fort=[...it].sort((a,b)=>b.v-a.v).filter(i=>i.v>=50).slice(0,2);
  const gr=Zr.dg?Object.keys(x.grados||{}).sort((a,b)=>a-b).map(k=>({l:'Grado '+k+'.°',v:pc(x.grados[k].c,x.grados[k].t)})):[];
  return`<div class="inf pg">${enc('Informe individual de resultados',datosBase())}
  <table><tr><td><b>Estudiante:</b> ${e(x.name)}</td><td><b>Documento:</b> ${e(x.doc||'')}</td><td><b>Curso:</b> ${e(x.course)}</td></tr></table>
  <div class="k"><div><b>${G==null?'—':G}</b>${Zr.dg?'Porcentaje total':'Puntaje global estimado (0-500)'}</div><div><b>${T.c}/${T.t}</b>Respuestas correctas</div><div><b>${deb.length}</b>Áreas por mejorar</div></div>
  <h3>1. Resultados por área</h3>${barras(it,'Porcentaje de aciertos por área',true)}
  <table><tr><th>Área</th><th>Aciertos</th><th>%</th><th>Grupo</th><th>Nivel (estimado)</th></tr>${it.map(i=>{const n=NIV(i.v);return`<tr><td>${e(i.l)}</td><td>${x.areas[i.l].c}/${x.areas[i.l].t}</td><td><b>${i.v}%</b></td><td>${i.v2}%</td><td style="color:${n[1]};font-weight:700">${n[0]}</td></tr>`}).join('')}</table>
  ${gr.length?`<h3>Dominio por grado anterior</h3>${barras(gr,'Aciertos por grado de referencia')}`:''}
  <h3>2. Lectura de los resultados</h3><ul>${fort.length?`<li><b>Fortalezas:</b> ${fort.map(i=>e(i.l)+' ('+i.v+'%)').join(', ')}.</li>`:'<li>Aún no hay áreas con desempeño satisfactorio; el plan se concentra en construir bases.</li>'}${deb.length?`<li><b>Por mejorar:</b> ${deb.map(i=>e(i.l)+' ('+i.v+'%)').join(', ')}.</li>`:'<li>No hay áreas por debajo del nivel satisfactorio. Mantener el ritmo.</li>'}</ul>
  <p style="font-size:9pt;color:#64748b">Los niveles son una estimación con los porcentajes de aciertos de esta prueba; el resultado oficial del ICFES se calcula con otro método.</p></div>
  <div class="inf pg">${enc('Plan de mejoramiento individual',x.name+' · '+x.course+' · '+datosBase())}
  ${deb.length?deb.map(i=>`<h3>${e(i.l)} — meta: pasar de ${i.v}% a ${Math.min(100,i.v+(i.v<35?20:15))}% en la próxima prueba</h3><ul>${acc(i.l).map(a=>`<li>${e(a)}</li>`).join('')}</ul>`).join(''):`<h3>Mantener y profundizar</h3><ul><li>Seguir con un simulacro corto cada semana y registrar los errores.</li><li>Apoyar a compañeros del grupo en las áreas donde ya tiene fortaleza.</li></ul>`}
  <h3>Cronograma sugerido (4 semanas)</h3><table><tr><th>Semana</th><th>Actividad</th><th>Cumplido</th></tr><tr><td>1</td><td>Repasar los temas más débiles y construir el cuaderno de errores</td><td></td></tr><tr><td>2</td><td>Ejercicios guiados con el docente del área</td><td></td></tr><tr><td>3</td><td>Práctica autónoma: 15 preguntas diarias del área priorizada</td><td></td></tr><tr><td>4</td><td>Nueva prueba corta y comparación con este resultado</td><td></td></tr></table>
  <h3>Compromisos y seguimiento</h3><table><tr><th>Compromiso del estudiante</th><th>Apoyo del docente</th><th>Apoyo de la familia</th></tr><tr><td style="height:60px"></td><td></td><td></td></tr></table>
  <div class="f"><div>Estudiante</div><div>Docente</div><div>Acudiente</div></div></div>`;
}
/* ---------- Grupal ---------- */
function gruHtml(){
  const g=Zr.est,cols=Zr.cols.filter(a=>promA(g,a)!=null);
  const dist=cols.map(a=>{const n=[0,0,0,0];g.forEach(x=>{if(x.areas[a]&&x.areas[a].t){n[nvl(pc(x.areas[a].c,x.areas[a].t))-1]++}});return{a,n}});
  const it=cols.map(a=>({l:a,v:promA(g,a)})),deb=[...it].sort((a,b)=>a.v-b.v).filter(i=>i.v<70),fort=[...it].sort((a,b)=>b.v-a.v)[0];
  const T=g.map(x=>Zr.dg?pc(tot(x).c,tot(x).t):glob(x.areas)).filter(v=>v!=null),pm=T.length?Math.round(T.reduce((a,b)=>a+b,0)/T.length):null;
  const riesgo=a=>g.filter(x=>x.areas[a]&&x.areas[a].t&&pc(x.areas[a].c,x.areas[a].t)<35).map(x=>x.name+' ('+x.course+')');
  const cursos=[...new Set(g.map(x=>x.course))].sort();
  const porCurso=cursos.map(c=>{const m=g.filter(x=>x.course===c);const v=m.map(x=>Zr.dg?pc(tot(x).c,tot(x).t):glob(x.areas)).filter(z=>z!=null);return{l:c+' ('+m.length+')',v:v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):null}});
  const top=[...g].map(x=>({n:x.name,c:x.course,v:Zr.dg?pc(tot(x).c,tot(x).t):glob(x.areas)})).filter(x=>x.v!=null).sort((a,b)=>b.v-a.v);
  const grd={};if(Zr.dg)g.forEach(x=>Object.entries(x.grados||{}).forEach(([k,v])=>{const o=grd[k]=grd[k]||{c:0,t:0};o.c+=v.c;o.t+=v.t}));
  return`<div class="inf pg">${enc('Informe grupal de resultados',datosBase())}
  <div class="k"><div><b>${g.length}</b>Estudiantes evaluados</div><div><b>${pm==null?'—':pm}${Zr.dg?'%':''}</b>${Zr.dg?'Promedio total':'Promedio global estimado (0-500)'}</div><div><b>${deb.length}</b>Áreas por debajo de satisfactorio</div></div>
  <h3>1. Promedio del grupo por área</h3>${barras(it,'Porcentaje promedio de aciertos')}
  <h3>2. Distribución por niveles</h3>${apiladas(dist)}
  ${cursos.length>1?`<h3>3. Comparación entre cursos</h3>${barras(porCurso,Zr.dg?'Promedio total por curso':'Promedio global estimado por curso (sobre 100)'.replace('sobre 100','0-500'))}`:''}
  ${Zr.dg&&Object.keys(grd).length?`<h3>Dominio por grado anterior (grupo)</h3>${barras(Object.keys(grd).sort((a,b)=>a-b).map(k=>({l:'Grado '+k+'.°',v:pc(grd[k].c,grd[k].t)})),'Aciertos por grado de referencia')}`:''}
  <h3>${cursos.length>1?'4':'3'}. Lectura de los resultados</h3><ul>${fort?`<li><b>Mayor fortaleza del grupo:</b> ${e(fort.l)} (${fort.v}%).</li>`:''}${deb.length?`<li><b>Áreas prioritarias:</b> ${deb.map(i=>e(i.l)+' ('+i.v+'%)').join(', ')}.</li>`:'<li>Todas las áreas están en nivel satisfactorio o superior.</li>'}<li><b>Mejores resultados:</b> ${top.slice(0,3).map(t=>e(t.n)+' ('+t.v+')').join(', ')||'—'}.</li></ul>
  <p style="font-size:9pt;color:#64748b">Niveles estimados con los porcentajes de aciertos de esta prueba; no equivalen al puntaje oficial del ICFES.</p></div>
  <div class="inf pg">${enc('Plan de mejoramiento grupal (para docentes)',datosBase())}
  ${deb.length?`<table><tr><th>Área prioritaria</th><th>Promedio</th><th>Estrategia pedagógica</th><th>Actividades</th><th>Estudiantes en nivel 1</th></tr>${deb.map(i=>{const r=riesgo(i.l);return`<tr><td><b>${e(i.l)}</b></td><td>${i.v}%</td><td>${e(DOCE[i.l]||'Refuerzo de los temas con menor desempeño.')}</td><td><ul>${acc(i.l).slice(0,3).map(a=>`<li>${e(a)}</li>`).join('')}</ul></td><td>${r.length?r.map(e).join(', '):'Ninguno'}</td></tr>`}).join('')}</table>`:'<p>El grupo no presenta áreas por debajo del nivel satisfactorio. Se recomienda profundizar en preguntas de mayor complejidad.</p>'}
  <h3>Cronograma institucional sugerido</h3><table><tr><th>Momento</th><th>Acción</th><th>Responsable</th><th>Indicador de logro</th></tr>
  <tr><td>Semanas 1-2</td><td>Socializar resultados con estudiantes y familias; formar grupos de apoyo por área</td><td>Docentes del área / Coordinación</td><td>Acta de socialización</td></tr>
  <tr><td>Semanas 3-6</td><td>Talleres y simulacros cortos semanales en las áreas prioritarias</td><td>Docentes del área</td><td>Aumento de 10 puntos en el promedio del área</td></tr>
  <tr><td>Semana 7</td><td>Nueva prueba diagnóstica o simulacro</td><td>Coordinación</td><td>Comparación con este informe</td></tr>
  <tr><td>Semana 8</td><td>Análisis de avance y ajuste del plan</td><td>Consejo académico</td><td>Informe de seguimiento</td></tr></table>
  <h3>Seguimiento</h3><table><tr><th>Fecha</th><th>Avance observado</th><th>Ajustes</th></tr><tr><td style="height:70px"></td><td></td><td></td></tr></table>
  <div class="f"><div>Docente</div><div>Coordinador(a)</div><div>Rector(a)</div></div></div>`;
}
/* ---------- salida ---------- */
function vista(html,tit,tipo){
  document.getElementById('inf-prev')?.remove();
  const d=document.createElement('div');d.id='inf-prev';d.style.cssText='position:fixed;inset:0;z-index:200;background:#0008;display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:16px';
  d.innerHTML=`<div style="background:#fff;border-radius:14px;max-width:820px;width:100%;padding:16px"><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:10px;position:sticky;top:0;background:#fff;padding:6px 0"><b>${e(tit)} · vista previa</b><div style="display:flex;gap:8px"><button onclick="INF.imprimir()" style="background:#16a34a;color:#fff;padding:9px 14px;border-radius:10px;font-weight:800">🖨️ Imprimir / guardar PDF</button><button onclick="INF.cerrar()" style="background:#e2e8f0;padding:9px 14px;border-radius:10px;font-weight:700">Cerrar</button></div></div><div id="inf-body">${CSS}${html}</div></div>`;
  document.body.appendChild(d);Zr.ult={html,tipo,tit};
}
const api={
  abrir(datos){Zr=datos;Zr.cols=datos.cols;return api},
  individual(i){const x=Zr.est[i];if(!x)return;vista(indHtml(x),'Informe y plan individual · '+x.name,'INF')},
  todosInd(){if(!Zr.est.length)return;vista(Zr.est.map(indHtml).join(''),'Informes individuales ('+Zr.est.length+')','INF')},
  grupal(){if(!Zr.est.length)return toast('⚠️','Sin resultados','Primero califica y guarda las hojas.');vista(gruHtml(),'Informe y plan grupal','INF')},
  imprimir(){if(!Zr.ult)return;doPrint(CSS+Zr.ult.html,{tipo:Zr.ult.tipo,titulo:Zr.ult.tit,hoja:true})},
  cerrar(){document.getElementById('inf-prev')?.remove()}
};
return api})();
