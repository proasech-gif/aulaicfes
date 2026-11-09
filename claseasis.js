/* AulaICFES — Asistencia a clase. Docente: abre la asistencia de un curso; el estudiante escribe su documento
   y queda guardada la fecha y la hora. El docente ve quién asistió, acumulado por clase. */
window.ACL=(function(){
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isDoc=()=>M&&M.role==='prof';
const fH=d=>new Date(d).toLocaleString('es-CO',{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:'America/Bogota'});
const R=()=>render();
let Z={cursos:[],ses:[],cid:'',asig:'',det:null,lista:[],abiertas:[],ok:null,t:null};
const inp='style="border:1px solid #cbd5e1;border-radius:8px;padding:10px;font-size:16px"';
async function load(){
  clearInterval(Z.t);
  if(isDoc()){
    const c=await sb.from('courses').select('id,name,grade').eq('teacher_id',M.id).order('grade').order('name');if(c.error)throw c.error;Z.cursos=c.data||[];
    const s=await sb.from('clase_sesiones').select('id,course_id,asignatura,abierta_at,cerrada_at,clase_asistencia(count)').eq('docente_id',M.id).order('abierta_at',{ascending:false}).limit(60);
    if(s.error)throw s.error;Z.ses=s.data||[];
    const ab=Z.ses.find(x=>!x.cerrada_at);if(ab){Z.det=ab.id;await lista()}
    if(Z.det&&Z.ses.find(x=>x.id===Z.det&&!x.cerrada_at))Z.t=setInterval(async()=>{if(tab!=='aclase'){clearInterval(Z.t);return}try{await lista();R()}catch(x){}},15000);
  }else{const r=await sb.rpc('clase_abiertas');if(r.error)throw r.error;Z.abiertas=r.data||[]}
}
async function lista(){const r=await sb.rpc('clase_lista',{p_ses:Z.det});if(r.error)throw r.error;Z.lista=r.data||[]}
const cN=id=>{const c=Z.cursos.find(x=>x.id===id);return c?(c.grade+'° '+c.name):''};
function docView(){
  const ab=Z.ses.filter(x=>!x.cerrada_at);
  const asigs=(M.asignaturas||[]).filter(Boolean);
  const abrir=`<div class="aic-card" style="padding:16px;margin-bottom:14px"><h2 style="font-weight:800;font-size:20px">✋ Asistencia a clase</h2>
   <p style="font-size:13px;color:#64748b;margin:4px 0 10px">Elige el curso y pulsa <b>Abrir asistencia</b>. Los estudiantes escriben su documento en su celular o computador y queda guardada la fecha y la hora.</p>
   <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:end"><label style="font-size:12px;font-weight:700">Curso<br><select ${inp} onchange="ACL.cid=this.value"><option value="">Elige…</option>${Z.cursos.map(c=>`<option value="${c.id}" ${c.id===Z.cid?'selected':''}>${e(c.grade+'° '+c.name)}</option>`).join('')}</select></label>
   <label style="font-size:12px;font-weight:700">Asignatura<br>${asigs.length?`<select ${inp} onchange="ACL.asig=this.value"><option value="">—</option>${asigs.map(a=>`<option ${a===Z.asig?'selected':''}>${e(a)}</option>`).join('')}</select>`:`<input ${inp} value="${e(Z.asig)}" oninput="ACL.asig=this.value" placeholder="Ej: Matemáticas">`}</label>
   <button onclick="ACL.abrir()" style="background:#16a34a;color:#fff;padding:12px 18px;border-radius:10px;font-weight:800">▶ Abrir asistencia</button></div></div>`;
  let cur='';
  const s=Z.ses.find(x=>x.id===Z.det);
  if(s){
    const pres=Z.lista.filter(x=>x.at).length;
    cur=`<div class="aic-card" style="padding:16px;margin-bottom:14px;border:2px solid ${s.cerrada_at?'#cbd5e1':'#16a34a'}"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h3 style="font-weight:800">${s.cerrada_at?'Clase cerrada':'🟢 Asistencia abierta'} · ${e(cN(s.course_id))} ${e(s.asignatura||'')}</h3>${s.cerrada_at?'':`<button onclick="ACL.cerrar('${s.id}')" style="background:#dc2626;color:#fff;padding:8px 14px;border-radius:8px;font-weight:700">■ Cerrar asistencia</button>`}</div>
    <div style="font-size:13px;color:#64748b;margin:4px 0">Abierta: ${fH(s.abierta_at)} · <b>${pres}</b> de ${Z.lista.length} presentes ${s.cerrada_at?'':'(se actualiza sola)'}</div>
    <div class="aic-table-wrap"><table style="min-width:480px"><thead><tr><th>ESTUDIANTE</th><th>DOCUMENTO</th><th>HORA</th><th></th></tr></thead><tbody>${Z.lista.map(x=>`<tr><td>${e(x.full_name)}</td><td>${e(x.documento||'—')}</td><td>${x.at?'✅ '+fH(x.at)+(x.manual?' (manual)':''):'<span style="color:#b91c1c">Ausente</span>'}</td><td><button class="aic-link" onclick="ACL.manual('${s.id}','${x.id}',${x.at?'false':'true'})">${x.at?'Quitar':'Marcar presente'}</button></td></tr>`).join('')||'<tr><td colspan="4">Este curso no tiene estudiantes.</td></tr>'}</tbody></table></div>
    <button class="aic-link" style="margin-top:8px" onclick="ACL.csv()">⬇ Descargar Excel</button></div>`;
  }
  const hist=`<div class="aic-card" style="padding:16px"><h3 style="font-weight:800;margin-bottom:8px">📋 Clases anteriores</h3><div class="aic-table-wrap"><table style="min-width:480px"><thead><tr><th>FECHA</th><th>CURSO</th><th>ASIGNATURA</th><th>PRESENTES</th><th></th></tr></thead><tbody>${Z.ses.map(x=>`<tr><td>${fH(x.abierta_at)}</td><td>${e(cN(x.course_id))}</td><td>${e(x.asignatura||'')}</td><td>${(x.clase_asistencia&&x.clase_asistencia[0]?x.clase_asistencia[0].count:0)}</td><td><button class="aic-link" onclick="ACL.ver('${x.id}')">Ver lista</button></td></tr>`).join('')||'<tr><td colspan="5">Aún no hay clases.</td></tr>'}</tbody></table></div></div>`;
  return`<div>${abrir}${cur}${hist}</div>`;
}
function estView(){
  const hoy=Z.abiertas;
  if(Z.ok)return`<div class="aic-card" style="padding:24px;text-align:center;max-width:460px;margin:auto"><div style="font-size:56px">✅</div><div style="font-size:22px;font-weight:800">Asistencia registrada</div><div style="font-size:24px;font-weight:800;color:#0b9865;margin-top:8px">${fH(Z.ok)}</div><button class="aic-link" style="margin-top:12px" onclick="ACL.nuevo()">Volver</button></div>`;
  return`<div class="aic-card" style="padding:18px;max-width:520px;margin:auto"><h2 style="font-weight:800;font-size:20px;text-align:center">✋ Asistencia a clase</h2>
  ${hoy.length?hoy.map(s=>s.ya?`<div style="margin-top:12px;border:1px solid #bbf7d0;background:#f0fdf4;border-radius:12px;padding:12px;text-align:center">✅ Ya registraste tu asistencia a ${e(s.asignatura||'la clase')} a las ${fH(s.ya)}</div>`:`<div style="margin-top:14px;border:1px solid #e2e8f0;border-radius:12px;padding:14px"><div style="text-align:center;font-weight:700">${e(s.asignatura||'Clase')} · ${e(s.docente)}</div><input id="acl_${s.id}" inputmode="numeric" placeholder="Escribe tu número de documento" ${inp} style="width:100%;margin-top:10px;font-size:20px;text-align:center;border:2px solid #cbd5e1;border-radius:12px;padding:14px"><button onclick="ACL.marcar('${s.id}')" style="width:100%;margin-top:10px;background:#16a34a;color:#fff;padding:16px;border-radius:12px;font-size:18px;font-weight:800">Registrar mi asistencia</button></div>`).join(''):`<p style="text-align:center;color:#64748b;margin-top:12px">Tu docente aún no ha abierto la asistencia. Cuando la abra, aparecerá aquí.</p><div style="text-align:center"><button class="aic-link" onclick="ACL.recargar()" style="font-size:14px">↻ Actualizar</button></div>`}</div>`;
}
const api={
  load,view:()=>isDoc()?docView():estView(),
  set cid(v){Z.cid=v},set asig(v){Z.asig=v},
  async abrir(){
    if(!Z.cid)return toast('⚠️','Elige el curso','');
    const r=await sb.rpc('clase_abrir',{p_course:Z.cid,p_asig:Z.asig});if(r.error)return err(r.error);
    Z.det=r.data;toast('🟢','Asistencia abierta','Los estudiantes ya pueden registrarse.');await load();R();
  },
  async cerrar(id){const r=await sb.rpc('clase_cerrar',{p_ses:id});if(r.error)return err(r.error);clearInterval(Z.t);await load();R()},
  async ver(id){Z.det=id;try{await lista()}catch(x){return err(x)}R();window.scrollTo(0,0)},
  async manual(ses,est,p){const r=await sb.rpc('clase_manual',{p_ses:ses,p_est:est,p_pres:p});if(r.error)return err(r.error);await lista();R()},
  async marcar(id){
    const v=document.getElementById('acl_'+id).value;
    const r=await sb.rpc('clase_marcar',{p_ses:id,p_doc:v});
    if(r.error)return toast('⚠️','No se registró',r.error.message);
    Z.ok=r.data;R();
  },
  nuevo(){Z.ok=null;api.recargar()},
  async recargar(){try{await load()}catch(x){return err(x)}R()},
  csv(){
    const s=Z.ses.find(x=>x.id===Z.det);
    const l=[['Estudiante','Documento','Asistió','Fecha y hora'],...Z.lista.map(x=>[x.full_name,x.documento||'',x.at?'Sí':'No',x.at?fH(x.at):''])];
    const t='﻿'+l.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(';')).join('\r\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'}));a.download='asistencia_clase.csv';a.click();
  }
};
return api;
})();
