/* AULA360 — Consultar grupos (rector y coordinador): solo mira, no sube nada.
   Elige grupo y, si quiere, un docente; ve la lista, la asistencia o las notas. */
window.CGR=(function(){
const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fF=d=>d?new Date(d).toLocaleString('es-CO',{timeZone:'America/Bogota',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'';
let Z={ops:[],g:'',doc:'',vista:'lista',rows:[],busy:false,ok:false};
const R=()=>render();
const btn=(c)=>`style="background:${c};color:#fff;padding:7px 11px;border-radius:9px;font-weight:700;font-size:13px"`;
const grupos=()=>{const m={};Z.ops.forEach(o=>{m[o.grado+'|'+o.grupo]=o.grado+'° '+o.grupo});return Object.entries(m).sort((a,b)=>parseInt(a[0])-parseInt(b[0])||a[1].localeCompare(b[1]))};
const docs=()=>{if(!Z.g)return[];const [g,gr]=Z.g.split('|');const m={};Z.ops.filter(o=>o.grado==g&&o.grupo===gr).forEach(o=>{m[o.docente_id]={n:o.docente,a:(o.asignaturas||[]).join(', ')}});return Object.entries(m)};
async function load(){const r=await sb.rpc('grupo_opciones');if(r.error)throw r.error;Z.ops=r.data||[];Z.ok=true}
async function buscar(){Z.rows=[];if(!Z.g)return R();const [g,gr]=Z.g.split('|');Z.busy=true;R();
  try{const r=await sb.rpc('grupo_consulta',{p_grado:+g,p_grupo:gr,p_docente:Z.doc||null,p_vista:Z.vista});if(r.error)throw r.error;Z.rows=r.data||[]}catch(x){err(x)}
  Z.busy=false;R()}
const TB=[['lista','👥 Lista de estudiantes'],['asistencia','✋ Asistencia'],['notas','📊 Notas']];
function tabla(){
  if(!Z.g)return'<p style="font-size:14px;color:#64748b;margin-top:14px">Elige un grupo para ver su información.</p>';
  if(Z.busy)return'<p style="margin-top:14px">⏳ Buscando…</p>';
  if(!Z.rows.length)return'<p style="font-size:14px;color:#b45309;margin-top:14px">No hay información de este tipo para ese grupo todavía.</p>';
  let th,tr;
  if(Z.vista==='lista'){th='<th>#</th><th>NOMBRE</th><th>DOCUMENTO</th><th>CORREO</th>';tr=Z.rows.map((x,i)=>`<tr><td>${i+1}</td><td>${e(x.nombre)}</td><td>${e(x.documento||'')}</td><td>${e(x.correo||'')}</td></tr>`)}
  else if(Z.vista==='asistencia'){th='<th>FECHA</th><th>DOCENTE</th><th>ASIGNATURA</th><th>PRESENTES</th><th>AUSENTES</th><th>QUIÉNES ASISTIERON</th>';tr=Z.rows.map(x=>`<tr><td>${fF(x.fecha)}</td><td>${e(x.docente)}</td><td>${e(x.asignatura)}</td><td>${x.presentes}</td><td>${x.ausentes}</td><td style="font-size:12px">${e((x.estudiantes||[]).join(', '))}</td></tr>`)}
  else{th='<th>ESTUDIANTE</th><th>ASIGNATURA</th><th>PRUEBA</th><th>PERIODO</th><th>DOCENTE</th><th>NOTA</th><th>ACIERTOS</th>';tr=Z.rows.map(x=>`<tr><td>${e(x.estudiante)}</td><td>${e(x.asignatura||'')}</td><td>${e(x.prueba||'')}</td><td>${e(x.periodo||'')}</td><td>${e(x.docente)}</td><td><b>${x.nota==null?'—':Math.round(x.nota*10)/10}</b></td><td>${x.aciertos==null?'':x.aciertos+'/'+x.total}</td></tr>`)}
  return`<div id="cgr-t" class="aic-table-wrap" style="margin-top:12px"><table style="min-width:640px"><thead><tr>${th}</tr></thead><tbody>${tr.join('')}</tbody></table></div><div style="margin-top:10px"><button onclick="CGR.imprimir()" ${btn('#16a34a')}>🖨️ Imprimir</button></div>`}
function view(){
  const sel=(k,l,opts,v)=>`<label style="font-size:12px;font-weight:700">${l}<br><select onchange="CGR.f('${k}',this.value)" style="border:1px solid #cbd5e1;border-radius:8px;padding:9px;min-width:200px">${opts}</select></label>`;
  const og=`<option value="">Elige un grupo…</option>`+grupos().map(([k,n])=>`<option value="${k}" ${k===Z.g?'selected':''}>${e(n)}</option>`).join('');
  const od=`<option value="">Todos los docentes del grupo</option>`+docs().map(([id,d])=>`<option value="${id}" ${id===Z.doc?'selected':''}>${e(d.n)}${d.a?' · '+e(d.a):''}</option>`).join('');
  return`<div class="aic-card" style="padding:18px"><h2 style="font-weight:800;font-size:19px">🔍 Consultar grupos</h2>
  <p style="font-size:13px;color:#64748b;margin:4px 0 10px">Aquí solo se consulta: elige el grupo y, si quieres, el docente (de un área o asignatura) y mira la lista, la asistencia o las notas.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:end">${sel('g','Grupo',og)}${sel('doc','Docente',od)}</div>
  <div style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0">${TB.map(x=>`<button onclick="CGR.v('${x[0]}')" style="padding:9px 14px;border-radius:10px;font-weight:800;border:1.5px solid ${Z.vista===x[0]?'#1e63e9':'#cbd5e1'};background:${Z.vista===x[0]?'#e8f1ff':'#fff'}">${x[1]}</button>`).join('')}</div>${tabla()}</div>`}
return{load,view,
 f(k,v){if(k==='g'){Z.g=v;Z.doc=''}else Z[k]=v;buscar()},
 v(t){Z.vista=t;buscar()},
 imprimir(){const t=document.getElementById('cgr-t');if(!t)return;const g=(grupos().find(x=>x[0]===Z.g)||[])[1]||'';doPrint(`<div style="font-family:Arial,sans-serif"><style>td,th{border:1px solid #000;padding:4px 6px;font-size:10pt}table{border-collapse:collapse;width:100%}</style><h3>${e(TB.find(x=>x[0]===Z.vista)[1].replace(/^\S+\s/,''))} · ${e(g)}</h3>${t.innerHTML}</div>`,{tipo:'LST',titulo:'Grupo '+g,sinCodigo:true})}}})();
