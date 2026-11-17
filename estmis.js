/* AULA360 — Estudiante: mis asistencias y mis notas (se ven y se descargan) */
window.EMI=(function(){
const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fF=d=>d?new Date(d).toLocaleString('es-CO',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'';
let Z={asis:[],notas:[],tab:'asis',ok:false};
async function load(){const [a,n]=await Promise.all([sb.rpc('mis_asistencias'),sb.rpc('mis_notas')]);Z.asis=a.data||[];Z.notas=n.data||[];Z.ok=true}
const btn=c=>`style="background:${c};color:#fff;padding:9px 14px;border-radius:10px;font-weight:800;font-size:13px"`;
function tabla(){
  if(Z.tab==='asis')return Z.asis.length?`<div class="aic-table-wrap"><table style="min-width:520px"><thead><tr><th>FECHA</th><th>ASIGNATURA</th><th>DOCENTE</th><th>ASISTENCIA</th></tr></thead><tbody>${Z.asis.map(x=>`<tr><td>${fF(x.fecha)}</td><td>${e(x.asignatura||'')}</td><td>${e(x.docente||'')}</td><td>${x.estado==='Asistió'?'✅ Asistió':x.estado==='No asistió'?'<span style="color:#b91c1c">❌ No asistió</span>':'—'}</td></tr>`).join('')}</tbody></table></div>`:'<p style="color:#64748b;font-size:14px">Aún no hay clases registradas.</p>';
  return Z.notas.length?`<div class="aic-table-wrap"><table style="min-width:520px"><thead><tr><th>FECHA</th><th>TIPO</th><th>ACTIVIDAD</th><th>ASIGNATURA</th><th>NOTA</th></tr></thead><tbody>${Z.notas.map(x=>`<tr><td>${fF(x.fecha)}</td><td>${e(x.tipo)}</td><td>${e(x.titulo)}</td><td>${e(x.asignatura||'')}</td><td><b>${e(x.nota)}</b></td></tr>`).join('')}</tbody></table></div>`:'<p style="color:#64748b;font-size:14px">Aún no tienes notas registradas.</p>';
}
function view(){
  const b=(k,l)=>`<button onclick="EMI.tab('${k}')" style="padding:9px 14px;border-radius:10px;font-weight:800;border:1.5px solid ${Z.tab===k?'#1e63e9':'#cbd5e1'};background:${Z.tab===k?'#e8f1ff':'#fff'}">${l}</button>`;
  return`<div class="aic-card" style="padding:18px"><h2 style="font-weight:800;font-size:20px">📋 Mis asistencias y notas</h2>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0">${b('asis','✋ Mis asistencias')}${b('notas','📊 Mis notas')}</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"><button onclick="EMI.pdf()" ${btn('#16a34a')}>🖨️ Descargar PDF</button><button onclick="EMI.csv()" ${btn('#246be0')}>⬇ Descargar Excel</button></div>${tabla()}</div>`}
const titulo=()=>(Z.tab==='asis'?'Mis asistencias':'Mis notas')+' · '+(M.full_name||'');
const filas=()=>Z.tab==='asis'?[['Fecha','Asignatura','Docente','Asistencia'],...Z.asis.map(x=>[fF(x.fecha),x.asignatura||'',x.docente||'',x.estado])]:[['Fecha','Tipo','Actividad','Asignatura','Nota'],...Z.notas.map(x=>[fF(x.fecha),x.tipo,x.titulo,x.asignatura||'',x.nota])];
return{load,view,
  tab(t){Z.tab=t;render()},
  pdf(){const f=filas();doPrint(`<div style="font-family:Arial,sans-serif"><h2>${e(titulo())}</h2><table style="width:100%;border-collapse:collapse;font-size:11px" border="1">${f.map((r,i)=>`<tr>${r.map(c=>i?`<td style="padding:4px">${e(c)}</td>`:`<th style="padding:4px;background:#e2e8f0">${e(c)}</th>`).join('')}</tr>`).join('')}</table></div>`,{tipo:'ASI',titulo:titulo(),sinCodigo:true})},
  csv(){const t='﻿'+filas().map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(';')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'}));a.download=(Z.tab==='asis'?'mis_asistencias':'mis_notas')+'.csv';a.click()}}})();
