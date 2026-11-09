/* AulaICFES — Asistencia de docentes.
   Rector/coordinador: desde su celular toca "Llegada" o "Salida" junto al nombre del docente (la hora la pone el servidor).
   Todo queda acumulado: lo ve el rector, el coordinador y cada docente (solo lo suyo). */
window.ASIS=(function(){
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isDir=()=>M&&(M.role==='rector'||M.role==='coordinador');
const hoy=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Bogota'});
const hora=d=>new Date(d).toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:'America/Bogota'});
const dia=d=>new Date(d).toLocaleDateString('es-CO',{weekday:'short',day:'2-digit',month:'short',year:'numeric',timeZone:'America/Bogota'});
const dk=d=>new Date(d).toLocaleDateString('en-CA',{timeZone:'America/Bogota'});
const R=()=>render();
let Z={docs:[],rows:[],desde:'',hasta:hoy(),doc:'',busy:false,q:''};
function ini(){const d=new Date();d.setDate(d.getDate()-30);return d.toLocaleDateString('en-CA',{timeZone:'America/Bogota'})}
async function load(){
  Z.desde=Z.desde||ini();
  if(isDir()){const r=await sb.rpc('asistencia_docentes');if(r.error)throw r.error;Z.docs=r.data||[]}
  await hist();
}
async function hist(){
  const r=await sb.rpc('asistencia_listar',{p_desde:Z.desde,p_hasta:Z.hasta,p_docente:Z.doc||null});
  if(r.error)throw r.error;Z.rows=r.data||[];
}
function resumen(){
  // agrupa por docente y día: primera entrada, última salida, horas
  const m={};
  Z.rows.slice().reverse().forEach(x=>{
    const k=x.docente_id+'|'+dk(x.at);
    const o=m[k]=m[k]||{n:x.full_name,d:x.at,ent:null,sal:null};
    if(x.tipo==='entrada'&&!o.ent)o.ent=x.at;
    if(x.tipo==='salida')o.sal=x.at;
  });
  return Object.values(m).sort((a,b)=>new Date(b.d)-new Date(a.d));
}
function dur(a,b){if(!a||!b)return'—';const m=Math.round((new Date(b)-new Date(a))/60000);return m<0?'—':Math.floor(m/60)+' h '+String(m%60).padStart(2,'0')+' min'}
function marcar(){
  const q=Z.q.toLowerCase();
  const l=Z.docs.filter(d=>!q||d.full_name.toLowerCase().includes(q));
  return`<div class="aic-card" style="padding:14px;margin-bottom:14px">
    <h2 style="font-weight:800;font-size:20px">🕒 Marcar asistencia de hoy</h2>
    <p style="font-size:13px;color:#64748b;margin:4px 0 10px">Toca <b>Llegada</b> cuando el docente entra al colegio y <b>Salida</b> cuando se va. La fecha y la hora se guardan solas.</p>
    <input placeholder="🔍 Buscar docente…" value="${e(Z.q)}" oninput="ASIS.buscar(this.value)" style="width:100%;border:1px solid #cbd5e1;border-radius:10px;padding:12px;font-size:16px;margin-bottom:10px">
    <div id="asis-lista">${lista(l)}</div></div>`;
}
function lista(l){
  return l.map(d=>{
    const est=d.ultimo_tipo==='entrada'?`<span style="color:#0b9865">✅ Llegó ${hora(d.ultimo_at)}</span>`:d.ultimo_tipo==='salida'?`<span style="color:#b87917">🚪 Salió ${hora(d.ultimo_at)}</span>`:`<span style="color:#94a3b8">Sin marcar hoy</span>`;
    const b=(t,c,tx)=>`<button ${Z.busy?'disabled':''} onclick="ASIS.m('${d.id}','${t}')" style="flex:1;background:${c};color:#fff;padding:14px 8px;border-radius:12px;font-size:16px;font-weight:800">${tx}</button>`;
    return`<div style="border:1px solid #e2e8f0;border-radius:12px;padding:12px;margin-bottom:10px"><div style="font-weight:800;font-size:16px">${e(d.full_name)}</div><div style="font-size:13px;margin:4px 0 10px">${est}</div><div style="display:flex;gap:10px">${b('entrada','#16a34a','⬇ LLEGADA')}${b('salida','#dc2626','⬆ SALIDA')}</div></div>`}).join('')||'<p style="color:#64748b">No hay docentes aprobados en tu colegio.</p>';
}
function historial(){
  const rs=resumen();
  const sel=isDir()?`<label style="font-size:12px;font-weight:700">Docente<br><select onchange="ASIS.f('doc',this.value)" style="border:1px solid #cbd5e1;border-radius:8px;padding:8px"><option value="">Todos</option>${Z.docs.map(d=>`<option value="${d.id}" ${d.id===Z.doc?'selected':''}>${e(d.full_name)}</option>`).join('')}</select></label>`:'';
  const inp=(k,v,l)=>`<label style="font-size:12px;font-weight:700">${l}<br><input type="date" value="${v}" onchange="ASIS.f('${k}',this.value)" style="border:1px solid #cbd5e1;border-radius:8px;padding:8px"></label>`;
  return`<div class="aic-card" style="padding:14px"><h2 style="font-weight:800;font-size:18px">📋 Historial acumulado</h2>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin:10px 0">${inp('desde',Z.desde,'Desde')}${inp('hasta',Z.hasta,'Hasta')}${sel}<button onclick="ASIS.csv()" style="align-self:end;background:#246be0;color:#fff;padding:9px 12px;border-radius:8px;font-weight:700;font-size:13px">⬇ Descargar Excel</button></div>
    <div class="aic-table-wrap"><table style="min-width:520px"><thead><tr>${isDir()?'<th>DOCENTE</th>':''}<th>DÍA</th><th>LLEGADA</th><th>SALIDA</th><th>TIEMPO</th></tr></thead><tbody>${rs.map(o=>`<tr>${isDir()?`<td>${e(o.n)}</td>`:''}<td>${dia(o.d)}</td><td>${o.ent?hora(o.ent):'—'}</td><td>${o.sal?hora(o.sal):'—'}</td><td>${dur(o.ent,o.sal)}</td></tr>`).join('')||`<tr><td colspan="5">No hay marcas en estas fechas.</td></tr>`}</tbody></table></div></div>`;
}
const api={
  load,
  view:()=>`<div>${isDir()?marcar():''}${historial()}</div>`,
  buscar(v){Z.q=v;const l=Z.docs.filter(d=>!v||d.full_name.toLowerCase().includes(v.toLowerCase()));document.getElementById('asis-lista').innerHTML=lista(l)},
  async f(k,v){Z[k]=v;try{await hist()}catch(x){return err(x)}R()},
  async m(id,tipo){
    if(Z.busy)return;Z.busy=true;
    const d=Z.docs.find(x=>x.id===id);
    const r=await sb.rpc('asistencia_marcar',{p_docente:id,p_tipo:tipo});
    Z.busy=false;
    if(r.error){R();return toast('⚠️','No se marcó',r.error.message)}
    toast('✅',(tipo==='entrada'?'Llegada':'Salida')+' marcada',(d?d.full_name+' · ':'')+hora(r.data));
    try{await load()}catch(x){err(x)}R();
  },
  csv(){
    const rs=resumen();
    const l=[['Docente','Día','Llegada','Salida','Tiempo'],...rs.map(o=>[o.n,dk(o.d),o.ent?hora(o.ent):'',o.sal?hora(o.sal):'',dur(o.ent,o.sal)])];
    const t='﻿'+l.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(';')).join('\r\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'}));a.download='asistencia_docentes.csv';a.click();
  }
};
return api;
})();
