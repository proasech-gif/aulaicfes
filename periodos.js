/* AULA360 — Informes del docente: (1) informe y plan de mejoramiento de cada examen, simulacro o prueba;
   (2) informe por periodo (por estudiante y por grupo) con todas las actividades calificables de su asignatura.
   Todo con los datos que ya existen; sin IA. Vista previa, impresión con código ISO. */
window.PRD=(function(){
const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const R=()=>render();
const norm=d=>String(d||'').replace(/\D/g,'').replace(/^0+/,'');
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
const sd=a=>{if(a.length<2)return 0;const m=avg(a);return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1))};
const med=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y),m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2};
const f1=x=>x==null?'—':(Math.round(x*10)/10).toFixed(1).replace('.',',');
const f2=x=>x==null?'—':(Math.round(x*100)/100).toFixed(2).replace('.',',');
const DES=n=>n==null?['—','#94a3b8']:n<3?['Bajo','#dc2626']:n<4?['Básico','#f59e0b']:n<4.6?['Alto','#2563eb']:['Superior','#16a34a'];
const dIdx=n=>n==null?-1:n<3?0:n<4?1:n<4.6?2:3;
const y0=new Date().getFullYear();
const FECH0={1:[y0+'-01-20',y0+'-03-28'],2:[y0+'-04-01',y0+'-06-13'],3:[y0+'-07-07',y0+'-09-12'],4:[y0+'-09-15',y0+'-11-28']};
let Z={sub:'periodo',cursos:[],cur:'',asig:'todas',per:1,fechas:null,trabajos:true,data:null,busy:false,msg:'',acts:null,ult:null};
function fechasLS(){try{const j=JSON.parse(localStorage.getItem('a360_periodos')||'null');if(j&&j.y===y0)return j.f}catch(x){}return JSON.parse(JSON.stringify(FECH0))}
function guardarFechas(){try{localStorage.setItem('a360_periodos',JSON.stringify({y:y0,f:Z.fechas}))}catch(x){}}
const nm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
function areaDe(a){const t=nm(a);return /lectur|lengua|lenguaje|castellan|espanol/.test(t)?'Lectura Crítica':/matem|geometr|estad|calcul|algebr/.test(t)?'Matemáticas':/social|civic|ciudad|histor|geograf|econom|filosof|politic|democr/.test(t)?'Sociales y Ciudadanas':/natural|biolog|quimic|fisic|ciencias|ambient/.test(t)?'Ciencias Naturales':/ingl|english/.test(t)?'Inglés':''}
async function load(){
  if(!Z.fechas)Z.fechas=fechasLS();
  const c=await sb.from('courses').select('id,grade,name').eq('teacher_id',M.id).order('grade').order('name');
  Z.cursos=c.data||[];if(!Z.cur&&Z.cursos.length)Z.cur=Z.cursos[0].id;
}
const cN=id=>{const c=Z.cursos.find(x=>x.id===id);return c?(c.grade===0?'Transición':c.grade+'°')+' '+c.name:''};
const nota05=(v,esc)=>v==null?null:esc==='100'?Math.round(v/20*10)/10:(v>5?Math.round(v/20*10)/10:+v);
/* ---------- Carga de los datos de un curso ---------- */
async function cargarCurso(cid){
  Z.busy=true;Z.msg='Reuniendo las notas del curso…';R();
  const q=async(p)=>{const r=await p;if(r.error)throw r.error;return r.data||[]};
  try{
    const [ro,pr]=await Promise.all([q(sb.from('roster').select('id,full_name,document,email').eq('course_id',cid).order('full_name')),
      q(sb.from('profiles').select('id,full_name,document,email').eq('course_id',cid).eq('role','est'))]);
    const est=ro.map(r=>({key:r.id,name:r.full_name,doc:r.document||'',email:(r.email||'').toLowerCase()}));
    const byUser={};
    pr.forEach(p=>{const d=norm(p.document),em=(p.email||'').toLowerCase();
      let s=est.find(x=>(d&&norm(x.doc)===d)||(em&&x.email===em));
      if(!s){s={key:'p'+p.id,name:p.full_name,doc:p.document||'',email:em};est.push(s)}byUser[p.id]=s.key});
    const uids=pr.map(p=>p.id),acts=[];
    // 1) Exámenes impresos calificados
    const jobs=await q(sb.from('print_jobs').select('id,title,subject,exam_date,created_at,n_questions').eq('course_id',cid).eq('teacher_id',M.id));
    if(jobs.length){
      const jid=jobs.map(j=>j.id);
      const [ex,rs]=await Promise.all([q(sb.from('print_exams').select('id,job_id,roster_id,question_ids').in('job_id',jid)),q(sb.from('print_results').select('exam_id,job_id,nota,answers,correct,total').in('job_id',jid))]);
      const exById=Object.fromEntries(ex.map(x=>[x.id,x]));
      for(const j of jobs){
        const a={id:'j'+j.id,tipo:'Examen',titulo:j.title,fecha:(j.exam_date||j.created_at||'').slice(0,10),asig:j.subject,notas:{},items:null,nQ:j.n_questions};
        const rj=rs.filter(r=>r.job_id===j.id);if(!rj.length)continue;
        const per={};
        rj.forEach(r=>{const x=exById[r.exam_id];if(!x)return;a.notas[x.roster_id]=nota05(r.nota);
          Object.entries(r.answers||{}).forEach(([pos,v])=>{if(v&&(v.c===1||v.c===0)){const qid=(x.question_ids||[])[+pos-1];const o=per[pos]=per[pos]||{ok:0,n:0,qid};o.n++;if(v.c===1)o.ok++}})});
        a.fails={};rj.forEach(r=>{const x=exById[r.exam_id];if(!x)return;a.fails[x.roster_id]=Object.entries(r.answers||{}).filter(([p,v])=>v&&v.c===0).map(([p])=>+p)});
        a.posQid={};Object.entries(per).forEach(([p,o])=>a.posQid[p]=o.qid);
        a.items=Object.entries(per).map(([pos,o])=>({pos:+pos,pct:Math.round(100*o.ok/o.n),n:o.n,qid:o.qid})).sort((x,y)=>x.pos-y.pos);
        if(Object.keys(a.notas).length)acts.push(a)}
      // etiquetas de competencia / tema de las preguntas
      const qids=[...new Set(acts.flatMap(a=>(a.items||[]).map(i=>i.qid)).filter(Boolean))];
      if(qids.length){try{const qs=await q(sb.from('questions').select('id,competency,component,topic').in('id',qids));const m=Object.fromEntries(qs.map(x=>[x.id,x]));acts.forEach(a=>(a.items||[]).forEach(i=>{const o=m[i.qid];if(o){i.comp=o.competency||o.component||'';i.tema=o.topic||''}}))}catch(x){}}
    }
    // 2) Pruebas de periodo (virtuales)
    const tg=await q(sb.from('periodo_targets').select('prueba_id').eq('course_id',cid));
    if(tg.length&&uids.length){
      const pid=tg.map(t=>t.prueba_id);
      const [pp,it]=await Promise.all([q(sb.from('periodo_pruebas').select('id,titulo,asignatura,periodo,created_at,cierra').in('id',pid)),q(sb.from('periodo_intentos').select('prueba_id,user_id,score').in('prueba_id',pid).in('user_id',uids))]);
      pp.forEach(p=>{const a={id:'p'+p.id,tipo:'Prueba de periodo',titulo:p.titulo,fecha:(p.cierra||p.created_at||'').slice(0,10),asig:p.asignatura,per:p.periodo,notas:{}};
        it.filter(i=>i.prueba_id===p.id).forEach(i=>{const k=byUser[i.user_id];if(!k)return;const n=nota05(+i.score,'100');if(a.notas[k]==null||n>a.notas[k])a.notas[k]=n});
        if(Object.keys(a.notas).length)acts.push(a)})}
    // 3) Simulacros y tareas virtuales
    if(uids.length){
      const si=await q(sb.from('simulacros').select('id,title,subject,kind,created_at,due_at').eq('teacher_id',M.id));
      if(si.length){const at=await q(sb.from('attempts').select('simulacro_id,user_id,score').in('simulacro_id',si.map(s=>s.id)).in('user_id',uids));
        si.forEach(s=>{const a={id:'s'+s.id,tipo:s.kind==='tarea'?'Tarea':'Simulacro',titulo:s.title,fecha:(s.due_at||s.created_at||'').slice(0,10),asig:s.subject,notas:{}};
          at.filter(x=>x.simulacro_id===s.id).forEach(x=>{const k=byUser[x.user_id];if(!k)return;const n=nota05(+x.score,'100');if(a.notas[k]==null||n>a.notas[k])a.notas[k]=n});
          if(Object.keys(a.notas).length)acts.push(a)})}
      // 4) Trabajos virtuales calificados
      const vt=await q(sb.from('virtual_trabajos').select('id,titulo,tipo,fecha_limite,created_at').eq('docente_id',M.id));
      if(vt.length){const en=await q(sb.from('virtual_entregas').select('trabajo_id,user_id,nota').in('trabajo_id',vt.map(t=>t.id)).in('user_id',uids).eq('estado','enviada').not('nota','is',null));
        vt.forEach(t=>{const a={id:'v'+t.id,tipo:'Trabajo virtual',titulo:t.titulo,fecha:(t.fecha_limite||t.created_at||'').slice(0,10),asig:'',notas:{},virtual:true};
          en.filter(x=>x.trabajo_id===t.id).forEach(x=>{const k=byUser[x.user_id];if(!k)return;const n=nota05(+x.nota);if(n!=null)a.notas[k]=n});
          if(Object.keys(a.notas).length)acts.push(a)})}
    }
    acts.sort((a,b)=>String(a.fecha).localeCompare(String(b.fecha)));
    Z.data={cid,curso:cN(cid),est,acts};Z.msg='';
    const sub=new Set(acts.map(a=>a.asig).filter(Boolean));(M.asignaturas||[]).forEach(x=>sub.add(x));Z.asigs=[...sub].sort();
  }catch(x){Z.msg='';Z.data=null;err(x)}
  Z.busy=false;R()}
/* ---------- Cálculos del periodo ---------- */
function actsPeriodo(){
  if(!Z.data)return[];const [d1,d2]=Z.fechas[Z.per];
  return Z.data.acts.filter(a=>{
    if(a.virtual&&!Z.trabajos)return false;
    if(Z.asig!=='todas'&&a.asig&&nm(a.asig)!==nm(Z.asig))return false;
    if(a.per)return +a.per===+Z.per;
    return a.fecha&&a.fecha>=d1&&a.fecha<=d2})}
function tabla(acts){
  const est=Z.data.est.map(s=>{const ns=acts.map(a=>a.notas[s.key]);const v=ns.filter(x=>x!=null);return{...s,ns,prom:avg(v),n:v.length}});
  return est}
/* ---------- Gráficas ---------- */
function barras5(items,tit,ref){
  const H=30,W0=640,pad=200,n=items.length,h=n*H+28;
  return`<svg viewBox="0 0 ${W0} ${h}" width="100%" style="max-width:640px;font:11px Arial,sans-serif"><text x="0" y="12" font-weight="700">${e(tit)}</text>${items.map((it,i)=>{const y=22+i*H,w=v=>v==null?0:Math.max(2,(W0-pad-50)*v/5);const c=DES(it.v)[1];
    return`<text x="0" y="${y+11}" fill="#334155">${e(String(it.l).slice(0,34))}</text><rect x="${pad}" y="${y}" width="${W0-pad-50}" height="11" fill="#eef2f7" rx="3"/><rect x="${pad}" y="${y}" width="${w(it.v)}" height="11" fill="${c}" rx="3"/><text x="${pad+w(it.v)+5}" y="${y+10}" font-weight="700">${f1(it.v)}</text>${ref&&it.r!=null?`<rect x="${pad}" y="${y+13}" width="${w(it.r)}" height="5" fill="#f5b82e" rx="2"/>`:''}`}).join('')}</svg>${ref?'<div style="font-size:10px;color:#475569"><span style="color:#1e63e9">■</span> Estudiante (color según desempeño) &nbsp; <span style="color:#f5b82e">■</span> Promedio del grupo</div>':''}`}
function distSvg(cnt,tit){
  const C=['#dc2626','#f59e0b','#2563eb','#16a34a'],N=['Bajo','Básico','Alto','Superior'],t=cnt.reduce((a,b)=>a+b,0)||1,mx=Math.max(...cnt,1);
  return`<svg viewBox="0 0 640 170" width="100%" style="max-width:640px;font:11px Arial,sans-serif"><text x="0" y="12" font-weight="700">${e(tit)}</text>${cnt.map((k,i)=>{const h=120*k/mx,x=60+i*140;return`<rect x="${x}" y="${150-h}" width="90" height="${h}" fill="${C[i]}" rx="3"/><text x="${x+45}" y="${144-h}" text-anchor="middle" font-weight="700">${k} (${Math.round(100*k/t)}%)</text><text x="${x+45}" y="165" text-anchor="middle" fill="#334155">${N[i]}</text>`}).join('')}</svg>`}
const RNG='Bajo: 1,0–2,9 · Básico: 3,0–3,9 · Alto: 4,0–4,5 · Superior: 4,6–5,0 (escala nacional de valoración).';
/* ---------- Plan de mejoramiento ---------- */
const ESTR={
 bajo:['Taller de nivelación guiado por el docente en el aula (2 sesiones por semana).','Cuaderno de errores: reescribir cada ejercicio fallado y explicar el procedimiento correcto.','Compromiso escrito con la familia y seguimiento semanal.','Actividad de recuperación con valoración formativa al final del plan.'],
 basico:['Ejercicios de profundización con situaciones de la vida diaria.','Trabajo por parejas: el estudiante explica un tema a un compañero.','Autoevaluación semanal con lista de verificación de los temas.'],
 alto:['Retos y proyectos de mayor complejidad.','Tutoría a compañeros que lo necesiten.']};
function estrArea(asig){const a=areaDe(asig);const U=INF._u;return a?U.acc(a):[]}
function planInd(s,acts,asig){
  const bajas=acts.filter(a=>a.notas[s.key]!=null&&a.notas[s.key]<3);
  const nv=dIdx(s.prom);const lvl=nv<=0?'bajo':nv===1?'basico':'alto';
  return`<h3>Plan de mejoramiento individual</h3>
  <table><tr><th>Dificultad detectada</th><th>Meta</th><th>Estrategias y actividades</th><th>Fecha de seguimiento</th></tr><tr><td>${bajas.length?'Valoración baja en: '+bajas.map(a=>e(a.titulo)+' ('+f1(a.notas[s.key])+')').join('; '):s.prom==null?'Sin actividades calificadas en el periodo.':nv===1?'Desempeño básico: oportunidad de afianzar.':'Sin dificultades relevantes.'}</td><td>${nv<=0?'Alcanzar mínimo 3,0 (desempeño básico)':nv===1?'Subir a desempeño alto (4,0 o más)':'Mantener el desempeño'}</td><td><ul>${[...ESTR[lvl],...(nv<=1?estrArea(asig).slice(0,2):[])].map(t=>`<li>${e(t)}</li>`).join('')}</ul></td><td style="width:90px"></td></tr></table>
  <div class="f"><div>Estudiante</div><div>Docente</div><div>Acudiente</div></div>`}
function planGrupo(acts,est,asig,dc){
  const bajos=est.filter(x=>x.prom!=null&&x.prom<3);const crit=acts.map(a=>({a,p:avg(Object.values(a.notas))})).filter(x=>x.p!=null&&x.p<3.5).sort((x,y)=>x.p-y.p);
  const items=[];acts.forEach(a=>(a.items||[]).forEach(i=>items.push({...i,act:a.titulo})));
  const crit_q=items.filter(i=>i.pct<40);const temas={};crit_q.forEach(i=>{const k=(i.tema||i.comp||'').trim();if(k)temas[k]=(temas[k]||0)+1});
  return`<h3>Plan de mejoramiento grupal (para el docente)</h3>
  <table><tr><th>Situación detectada</th><th>Estrategia pedagógica</th><th>Actividades</th></tr>
  <tr><td>${bajos.length} estudiante(s) con desempeño bajo (${est.filter(x=>x.prom!=null).length?Math.round(100*bajos.length/est.filter(x=>x.prom!=null).length):0}%).${crit.length?' Actividades con promedio bajo: '+crit.slice(0,4).map(x=>e(x.a.titulo)+' ('+f1(x.p)+')').join(', ')+'.':''}</td><td>Refuerzo diferenciado: nivelación para el grupo en riesgo y profundización para el resto.</td><td><ul>${ESTR.bajo.slice(0,3).map(t=>`<li>${e(t)}</li>`).join('')}</ul></td></tr>
  ${Object.keys(temas).length?`<tr><td>Temas/competencias con menos del 40 % de aciertos: <b>${Object.entries(temas).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,n])=>e(k)).join(', ')}</b>.</td><td>Reenseñar con otro enfoque y practicar con preguntas tipo Saber.</td><td><ul>${estrArea(asig).slice(0,3).map(t=>`<li>${e(t)}</li>`).join('')||'<li>Retroalimentar las preguntas con menor acierto en clase.</li>'}</ul></td></tr>`:''}</table>
  <h3>Cronograma de seguimiento</h3><table><tr><th>Semana</th><th>Acción</th><th>Indicador</th></tr><tr><td>1</td><td>Socializar resultados con el grupo y las familias</td><td>Acta de socialización</td></tr><tr><td>2–3</td><td>Talleres de nivelación y profundización</td><td>Asistencia y entrega de talleres</td></tr><tr><td>4</td><td>Nueva evaluación corta y cierre del plan</td><td>Reducir los desempeños bajos a la mitad</td></tr></table>
  <div class="f"><div>Docente</div><div>Coordinador(a)</div></div>`}
/* ---------- Informe por periodo ---------- */
function infoCab(tit,sub){return INF._u.enc(tit,sub)}
function periodoInd(s,acts,all){
  const asig=Z.asig==='todas'?'':Z.asig;
  const its=acts.map(a=>({l:a.titulo+' ('+a.tipo+')',v:a.notas[s.key]??null,r:avg(Object.values(a.notas))}));
  const d=DES(s.prom),pos=[...all].filter(x=>x.prom!=null).sort((a,b)=>b.prom-a.prom).findIndex(x=>x.key===s.key)+1;
  return`<div class="inf pg">${infoCab('Informe de periodo '+Z.per+' · '+(asig||'todas las asignaturas'),Z.data.curso+' · Emitido '+new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'}))}
  <table><tr><td><b>Estudiante:</b> ${e(s.name)}</td><td><b>Documento:</b> ${e(s.doc)}</td><td><b>Curso:</b> ${e(Z.data.curso)}</td></tr></table>
  <div class="k"><div><b>${f1(s.prom)}</b>Promedio del periodo</div><div><b style="color:${d[1]}">${d[0]}</b>Desempeño</div><div><b>${s.n}/${acts.length}</b>Actividades calificadas</div><div><b>${pos||'—'}/${all.filter(x=>x.prom!=null).length}</b>Puesto en el grupo</div></div>
  <h3>Notas por actividad</h3>${its.length?barras5(its,'Nota de cada actividad (0 a 5) frente al promedio del grupo',true):'<p>No hay actividades calificadas en este periodo.</p>'}
  <table><tr><th>Fecha</th><th>Actividad</th><th>Tipo</th><th>Nota</th><th>Promedio grupo</th></tr>${acts.map(a=>`<tr><td>${e(a.fecha)}</td><td>${e(a.titulo)}</td><td>${e(a.tipo)}</td><td><b>${f1(a.notas[s.key])}</b></td><td>${f1(avg(Object.values(a.notas)))}</td></tr>`).join('')}</table>
  <p style="font-size:9pt;color:#64748b">Promedio simple de las actividades calificadas del periodo. ${RNG}</p>
  ${planInd(s,acts,asig)}</div>`}
function periodoGrupo(acts,est){
  const asig=Z.asig==='todas'?'':Z.asig,con=est.filter(x=>x.prom!=null),cnt=[0,0,0,0];con.forEach(x=>cnt[dIdx(x.prom)]++);
  const ps=con.map(x=>x.prom),ap=con.filter(x=>x.prom>=3).length;
  const ord=[...con].sort((a,b)=>b.prom-a.prom);
  return`<div class="inf pg">${infoCab('Informe grupal de periodo '+Z.per+' · '+(asig||'todas las asignaturas'),Z.data.curso+' · Emitido '+new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'}))}
  <div class="k"><div><b>${con.length}/${est.length}</b>Estudiantes con notas</div><div><b>${f2(avg(ps))}</b>Promedio del grupo</div><div><b>${f2(med(ps))}</b>Mediana</div><div><b>${f2(sd(ps))}</b>Desviación estándar</div><div><b>${con.length?Math.round(100*ap/con.length):0}%</b>Aprueban (≥ 3,0)</div></div>
  <h3>1. Desempeño del grupo</h3>${distSvg(cnt,'Estudiantes por nivel de desempeño')}
  <h3>2. Resultados por actividad</h3>${acts.length?barras5(acts.map(a=>({l:a.titulo,v:avg(Object.values(a.notas))})),'Promedio del grupo en cada actividad'):'<p>Sin actividades.</p>'}
  <table><tr><th>Actividad</th><th>Tipo</th><th>Fecha</th><th>Calificados</th><th>Promedio</th><th>Aprueban</th></tr>${acts.map(a=>{const v=Object.values(a.notas);return`<tr><td>${e(a.titulo)}</td><td>${e(a.tipo)}</td><td>${e(a.fecha)}</td><td>${v.length}</td><td><b>${f2(avg(v))}</b></td><td>${Math.round(100*v.filter(x=>x>=3).length/(v.length||1))}%</td></tr>`}).join('')}</table>
  <h3>3. Listado de estudiantes</h3><table><tr><th>#</th><th>Estudiante</th>${acts.map((a,i)=>`<th>A${i+1}</th>`).join('')}<th>Promedio</th><th>Desempeño</th></tr>${est.map((s,i)=>`<tr><td>${i+1}</td><td>${e(s.name)}</td>${s.ns.map(x=>`<td>${f1(x)}</td>`).join('')}<td><b>${f2(s.prom)}</b></td><td style="color:${DES(s.prom)[1]};font-weight:700">${DES(s.prom)[0]}</td></tr>`).join('')}</table>
  <p style="font-size:9pt;color:#64748b">${acts.map((a,i)=>'A'+(i+1)+' = '+e(a.titulo)).join(' · ')}. ${RNG}</p>
  <p style="font-size:10pt"><b>Mejores promedios:</b> ${ord.slice(0,3).map(x=>e(x.name)+' ('+f1(x.prom)+')').join(', ')||'—'}. <b>En riesgo (&lt; 3,0):</b> ${con.filter(x=>x.prom<3).map(x=>e(x.name)).join(', ')||'ninguno'}.</p>
  ${planGrupo(acts,est,asig)}</div>`}
/* ---------- Informe de una actividad (examen / simulacro / prueba) ---------- */
function actGrupo(a){
  const est=Z.data.est,ns=Object.values(a.notas),cnt=[0,0,0,0];ns.forEach(n=>cnt[dIdx(n)]++);
  const items=a.items||[],crit=items.filter(i=>i.pct<40),por={};items.forEach(i=>{const k=(i.comp||i.tema||'Sin clasificar').trim()||'Sin clasificar';const o=por[k]=por[k]||{s:0,n:0};o.s+=i.pct;o.n++});
  const comps=Object.entries(por).map(([k,o])=>({l:k,v:Math.round(o.s/o.n)}));
  const sinNota=est.filter(s=>a.notas[s.key]==null);
  const asig=a.asig||'';
  const rows=est.map(s=>({...s,n:a.notas[s.key]??null}));
  return`<div class="inf pg">${infoCab('Informe de resultados · '+a.titulo,a.tipo+' · '+(a.asig||'')+' · '+Z.data.curso+' · '+a.fecha)}
  <div class="k"><div><b>${ns.length}/${est.length}</b>Estudiantes calificados</div><div><b>${f2(avg(ns))}</b>Promedio</div><div><b>${f2(med(ns))}</b>Mediana</div><div><b>${f2(sd(ns))}</b>Desv. estándar</div><div><b>${Math.round(100*ns.filter(x=>x>=3).length/(ns.length||1))}%</b>Aprueban (≥ 3,0)</div></div>
  <h3>1. Desempeño del grupo</h3>${distSvg(cnt,'Estudiantes por nivel de desempeño')}
  ${items.length?`<h3>2. Análisis por pregunta</h3>${INF._u.barras(items.map(i=>({l:'Pregunta '+i.pos+(i.tema?' · '+i.tema.slice(0,22):''),v:i.pct})),'Porcentaje de estudiantes que acertó cada pregunta')}
  <p style="font-size:10pt"><b>Preguntas críticas (menos del 40 % de aciertos):</b> ${crit.length?crit.map(i=>i.pos).join(', '):'ninguna'}.</p>
  ${comps.length>1||(comps[0]&&comps[0].l!=='Sin clasificar')?`<h3>3. Por competencia o componente</h3>${INF._u.barras(comps,'Porcentaje de acierto promedio')}`:''}`:''}
  <h3>${items.length?'4':'2'}. Listado</h3><table><tr><th>#</th><th>Estudiante</th><th>Nota</th><th>Desempeño</th></tr>${rows.map((s,i)=>`<tr><td>${i+1}</td><td>${e(s.name)}</td><td><b>${f1(s.n)}</b></td><td style="color:${DES(s.n)[1]};font-weight:700">${s.n==null?'Sin calificar':DES(s.n)[0]}</td></tr>`).join('')}</table>
  ${sinNota.length?`<p style="font-size:9pt;color:#b45309">Sin calificar: ${sinNota.map(s=>e(s.name)).join(', ')}.</p>`:''}<p style="font-size:9pt;color:#64748b">${RNG}</p></div>
  <div class="inf pg">${infoCab('Plan de mejoramiento grupal · '+a.titulo,a.tipo+' · '+Z.data.curso)}${planGrupo([a],rows.map(r=>({...r,prom:r.n})),asig)}</div>`}
function actInd(a,s){
  const n=a.notas[s.key],f=(a.fails||{})[s.key]||[];const d=DES(n),ns=Object.values(a.notas);
  const itm=Object.fromEntries((a.items||[]).map(i=>[i.pos,i]));
  const fl=f.map(p=>itm[p]).filter(Boolean);const temas=[...new Set(fl.map(i=>(i.tema||i.comp||'').trim()).filter(Boolean))];
  return`<div class="inf pg">${infoCab('Informe individual · '+a.titulo,a.tipo+' · '+(a.asig||'')+' · '+Z.data.curso+' · '+a.fecha)}
  <table><tr><td><b>Estudiante:</b> ${e(s.name)}</td><td><b>Documento:</b> ${e(s.doc)}</td></tr></table>
  <div class="k"><div><b>${f1(n)}</b>Nota</div><div><b style="color:${d[1]}">${d[0]}</b>Desempeño</div><div><b>${f1(avg(ns))}</b>Promedio del grupo</div></div>
  ${barras5([{l:'Estudiante',v:n,r:avg(ns)},{l:'Promedio del grupo',v:avg(ns)}],'Nota frente al grupo',false)}
  ${f.length?`<h3>Preguntas falladas</h3><p style="font-size:10pt">${f.sort((x,y)=>x-y).join(', ')}.${temas.length?' <b>Temas por reforzar:</b> '+temas.map(e).join(', ')+'.':''}</p>`:''}
  ${planInd({key:s.key,prom:n,n:1},[a],a.asig)}</div>`}
/* ---------- Salida ---------- */
function mostrar(html,tit){
  Z.ult={html,tit};document.getElementById('prd-prev')?.remove();
  const d=document.createElement('div');d.id='prd-prev';d.style.cssText='position:fixed;inset:0;z-index:200;background:#0008;display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:16px';
  d.innerHTML=`<div style="background:#fff;border-radius:14px;max-width:820px;width:100%;padding:16px"><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:10px;position:sticky;top:0;background:#fff;padding:6px 0"><b>${e(tit)} · vista previa</b><div style="display:flex;gap:8px"><button onclick="PRD.imprimir()" style="background:#16a34a;color:#fff;padding:9px 14px;border-radius:10px;font-weight:800">🖨️ Imprimir / guardar PDF</button><button onclick="PRD.cerrar()" style="background:#e2e8f0;padding:9px 14px;border-radius:10px;font-weight:700">Cerrar</button></div></div>${INF._u.CSS}${html}</div>`;
  document.body.appendChild(d)}
async function prep(){if(!window.INF)await loadScript('informes.js?v=2')}
/* ---------- Pantalla ---------- */
const inp='style="padding:9px;border:1.5px solid #d5dfef;border-radius:10px"';
function viewPeriodo(){
  const d=Z.data,acts=d?actsPeriodo():[],est=d?tabla(acts):[];
  const [d1,d2]=Z.fechas[Z.per];
  return`<div class="aic-card" style="padding:18px"><h3 style="font-weight:800;font-size:17px">📅 Informe por periodo</h3>
  <p style="font-size:13px;color:#64748b;margin:4px 0 12px">Junta todas tus actividades calificadas (exámenes, simulacros, tareas, pruebas de periodo y trabajos virtuales) en un informe por estudiante y por grupo.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px">
   <label style="font-size:13px">Curso<select ${inp} onchange="PRD.set('cur',this.value)">${Z.cursos.map(c=>`<option value="${c.id}" ${Z.cur===c.id?'selected':''}>${e(cN(c.id))}</option>`).join('')||'<option>Sin cursos</option>'}</select></label>
   <label style="font-size:13px">Asignatura<select ${inp} onchange="PRD.set('asig',this.value)"><option value="todas">Todas las mías</option>${(Z.asigs||M.asignaturas||[]).map(a=>`<option ${Z.asig===a?'selected':''}>${e(a)}</option>`).join('')}</select></label>
   <label style="font-size:13px">Periodo<select ${inp} onchange="PRD.set('per',+this.value)">${[1,2,3,4].map(n=>`<option value="${n}" ${Z.per===n?'selected':''}>Periodo ${n}</option>`).join('')}</select></label>
   <label style="font-size:13px">Desde<input type="date" ${inp} value="${d1}" onchange="PRD.fecha(0,this.value)"></label>
   <label style="font-size:13px">Hasta<input type="date" ${inp} value="${d2}" onchange="PRD.fecha(1,this.value)"></label></div>
  <label style="font-size:13px;display:block;margin-top:8px"><input type="checkbox" ${Z.trabajos?'checked':''} onchange="PRD.set('trabajos',this.checked)"> Incluir trabajos virtuales calificados (si tus trabajos son de varias asignaturas, desmárcalo)</label>
  <div style="margin-top:10px"><button onclick="PRD.cargar()" ${Z.busy?'disabled':''} style="background:#1e63e9;color:#fff;padding:10px 16px;border-radius:10px;font-weight:800">🔄 ${d?'Actualizar notas':'Reunir notas del curso'}</button> ${Z.msg?`<span style="font-size:13px">⏳ ${e(Z.msg)}</span>`:''}</div></div>
  ${d?`<div class="aic-card" style="padding:18px;margin-top:14px"><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;align-items:center"><b>${acts.length} actividad(es) en el periodo ${Z.per} · ${est.length} estudiantes</b>
   <div style="display:flex;flex-wrap:wrap;gap:8px"><button onclick="PRD.grupo()" style="background:#1e63e9;color:#fff;padding:8px 14px;border-radius:10px;font-weight:800">📊 Informe y plan grupal</button><button onclick="PRD.todos()" style="background:#16a34a;color:#fff;padding:8px 14px;border-radius:10px;font-weight:800">🧾 Informes individuales (todos)</button></div></div>
   ${acts.length?'':'<p style="font-size:13px;color:#b45309;margin-top:8px">No encontré actividades calificadas en esas fechas. Revisa el rango de fechas del periodo o califica primero tus actividades.</p>'}
   <div class="aic-table-wrap" style="margin-top:10px"><table style="min-width:520px"><thead><tr><th>ESTUDIANTE</th>${acts.map((a,i)=>`<th title="${e(a.titulo)}">A${i+1}</th>`).join('')}<th>PROMEDIO</th><th></th></tr></thead><tbody>${est.map((s,i)=>`<tr><td><b>${e(s.name)}</b></td>${s.ns.map(x=>`<td>${f1(x)}</td>`).join('')}<td><b style="color:${DES(s.prom)[1]}">${f2(s.prom)}</b></td><td><button class="aic-link" onclick="PRD.ind(${i})">📄 Informe</button></td></tr>`).join('')}</tbody></table></div>
   <p style="font-size:12px;color:#64748b;margin-top:6px">${acts.map((a,i)=>'A'+(i+1)+' = '+e(a.titulo)+' ('+e(a.tipo)+')').join(' · ')}</p></div>`:''}`}
function viewAct(){
  const d=Z.data;
  return`<div class="aic-card" style="padding:18px"><h3 style="font-weight:800;font-size:17px">📝 Informe de un examen, simulacro o prueba</h3>
  <p style="font-size:13px;color:#64748b;margin:4px 0 12px">Elige el curso, reúne las notas y genera el informe del grupo o de cada estudiante, con análisis por pregunta (en exámenes impresos) y plan de mejoramiento. Los diagnósticos y simulacros Saber 11 tienen su informe en su propia pantalla.</p>
  <label style="font-size:13px">Curso <select ${inp} onchange="PRD.set('cur',this.value)">${Z.cursos.map(c=>`<option value="${c.id}" ${Z.cur===c.id?'selected':''}>${e(cN(c.id))}</option>`).join('')||'<option>Sin cursos</option>'}</select></label>
  <button onclick="PRD.cargar()" ${Z.busy?'disabled':''} style="margin-left:8px;background:#1e63e9;color:#fff;padding:10px 16px;border-radius:10px;font-weight:800">🔄 ${d?'Actualizar':'Reunir actividades'}</button> ${Z.msg?`<span style="font-size:13px">⏳ ${e(Z.msg)}</span>`:''}</div>
  ${d?`<div class="aic-card" style="padding:18px;margin-top:14px"><b>${d.acts.length} actividad(es) calificada(s)</b>${d.acts.length?'':'<p style="font-size:13px;color:#b45309;margin-top:6px">Todavía no hay actividades con notas en este curso.</p>'}
   ${d.acts.map((a,i)=>`<div style="border:1px solid #e3eaf5;border-radius:12px;padding:10px 12px;margin-top:8px;display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;align-items:center"><div><b>${e(a.titulo)}</b> <span style="font-size:12px;color:#64748b">${e(a.tipo)} · ${e(a.asig||'')} · ${e(a.fecha)} · ${Object.keys(a.notas).length} calificados · promedio ${f1(avg(Object.values(a.notas)))}</span></div><div style="display:flex;gap:8px"><button onclick="PRD.actG(${i})" style="background:#1e63e9;color:#fff;padding:7px 12px;border-radius:10px;font-weight:800;font-size:13px">📊 Informe y plan grupal</button><button onclick="PRD.actT(${i})" style="background:#16a34a;color:#fff;padding:7px 12px;border-radius:10px;font-weight:800;font-size:13px">🧾 Individuales (todos)</button></div></div>`).join('')}</div>`:''}`}
function view(){
  if(!Z.cursos.length)return`<div class="aic-card" style="padding:18px;font-size:14px;color:#64748b">Primero crea tus cursos y estudiantes; después aquí podrás generar los informes.</div>`;
  return`<nav class="aic-tabs" style="margin-bottom:14px"><button class="${Z.sub==='periodo'?'on':''}" onclick="PRD.sub('periodo')">📅 Informe por periodo</button><button class="${Z.sub==='act'?'on':''}" onclick="PRD.sub('act')">📝 Examen, simulacro o prueba</button></nav>${Z.sub==='periodo'?viewPeriodo():viewAct()}`}
const api={load,view,
  sub(k){Z.sub=k;R()},
  set(k,v){Z[k]=v;if(k==='cur'){Z.data=null}R()},
  fecha(i,v){Z.fechas[Z.per][i]=v;guardarFechas();R()},
  cargar(){if(!Z.cur)return toast('⚠️','Elige un curso','');return cargarCurso(Z.cur)},
  async grupo(){await prep();const a=actsPeriodo(),est=tabla(a);mostrar(periodoGrupo(a,est),'Informe grupal · periodo '+Z.per)},
  async todos(){await prep();const a=actsPeriodo(),est=tabla(a);if(!est.length)return;mostrar(est.map(s=>periodoInd(s,a,est)).join(''),'Informes individuales · periodo '+Z.per)},
  async ind(i){await prep();const a=actsPeriodo(),est=tabla(a);mostrar(periodoInd(est[i],a,est),'Informe de '+est[i].name)},
  async actG(i){await prep();mostrar(actGrupo(Z.data.acts[i]),'Informe · '+Z.data.acts[i].titulo)},
  async actT(i){await prep();const a=Z.data.acts[i];mostrar(Z.data.est.filter(s=>a.notas[s.key]!=null).map(s=>actInd(a,s)).join(''),'Informes individuales · '+a.titulo)},
  imprimir(){if(Z.ult)doPrint(INF._u.CSS+Z.ult.html,{tipo:'INF',titulo:Z.ult.tit,hoja:true})},
  cerrar(){document.getElementById('prd-prev')?.remove()},
  _t:{set:d=>{Z.data=d;Z.fechas=Z.fechas||JSON.parse(JSON.stringify(FECH0))},periodoGrupo:()=>{const a=actsPeriodo(),est=tabla(a);return periodoGrupo(a,est)},periodoInd:(i)=>{const a=actsPeriodo(),est=tabla(a);return periodoInd(est[i],a,est)},actGrupo:i=>actGrupo(Z.data.acts[i]),actInd:(i,j)=>actInd(Z.data.acts[i],Z.data.est[j]),state:Z}
};
return api})();
