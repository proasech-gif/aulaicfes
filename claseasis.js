/* AulaICFES — Asistencia a clase. Docente: abre la asistencia de un curso; el estudiante escribe su documento
   y queda guardada la fecha y la hora. El docente ve quién asistió, acumulado por clase. */
window.ACL=(function(){
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isDoc=()=>M&&M.role==='prof';
const isDir=()=>M&&(M.role==='rector'||M.role==='coordinador');
const d30=()=>{const d=new Date();d.setDate(d.getDate()-30);return d.toLocaleDateString('en-CA',{timeZone:'America/Bogota'})};
const fH=d=>new Date(d).toLocaleString('es-CO',{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:'America/Bogota'});
const R=()=>render();
let Z={areas:[],asigs:[],docs:[],rep:[],F:{d:'',h:new Date().toLocaleDateString('en-CA',{timeZone:'America/Bogota'}),area:'',asig:'',doc:''},cursos:[],ses:[],cid:'',asig:'',det:null,lista:[],abiertas:[],ok:null,t:null};
const inp='style="border:1px solid #cbd5e1;border-radius:8px;padding:10px;font-size:16px"';
async function repLoad(){
  Z.F.d=Z.F.d||d30();
  const r=await sb.rpc('clase_reporte',{p_desde:Z.F.d,p_hasta:Z.F.h,p_area:Z.F.area||null,p_asig:Z.F.asig||null,p_docente:Z.F.doc||null});
  if(r.error)throw r.error;Z.rep=r.data||[];
}
async function load(){
  clearInterval(Z.t);
  if(!Z.areas.length){const a=await sb.from('areas').select('nombre').order('nombre');Z.areas=(a.data||[]).map(x=>x.nombre);const g=await sb.from('asignaturas').select('nombre').order('nombre');Z.asigs=(g.data||[]).map(x=>x.nombre)}
  if(isDir()){const r=await sb.rpc('asistencia_docentes');if(!r.error)Z.docs=r.data||[];await repLoad();return}
  if(isDoc()){
    await repLoad();
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
   <p style="font-size:13px;color:#64748b;margin:4px 0 10px">Elige el curso y pulsa <b>Abrir asistencia</b>. Aparece un campo donde cada estudiante escribe su número de documento en este dispositivo; la fecha y la hora quedan guardadas.</p>
   <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:end"><label style="font-size:12px;font-weight:700">Curso<br><select ${inp} onchange="ACL.cid=this.value"><option value="">Elige…</option>${Z.cursos.map(c=>`<option value="${c.id}" ${c.id===Z.cid?'selected':''}>${e(c.grade+'° '+c.name)}</option>`).join('')}</select></label>
   <label style="font-size:12px;font-weight:700">Asignatura<br>${asigs.length?`<select ${inp} onchange="ACL.asig=this.value"><option value="">—</option>${asigs.map(a=>`<option ${a===Z.asig?'selected':''}>${e(a)}</option>`).join('')}</select>`:`<input ${inp} value="${e(Z.asig)}" oninput="ACL.asig=this.value" placeholder="Ej: Matemáticas">`}</label>
   <button onclick="ACL.abrir()" style="background:#16a34a;color:#fff;padding:12px 18px;border-radius:10px;font-weight:800">▶ Abrir asistencia</button></div></div>`;
  let cur='';
  const s=Z.ses.find(x=>x.id===Z.det);
  if(s){
    const pres=Z.lista.filter(x=>x.at).length;
    const kio=s.cerrada_at?'':(Z.okE?`<div style="text-align:center;padding:12px;border:2px solid #16a34a;border-radius:14px;margin-bottom:12px;background:#f0fdf4"><div style="font-size:50px">${Z.okE.rep?'ℹ️':'✅'}</div><div style="font-size:20px;font-weight:800">Querido(a) estudiante ${e(Z.okE.nombre)}</div><div style="font-size:22px;font-weight:700;margin-top:4px">${Z.okE.rep?'Ya tenías tu asistencia registrada':'Bienvenido(a)'}</div><div style="font-size:15px;margin-top:2px">${Z.okE.rep?'Quedó registrada el':'Tu asistencia quedó registrada el'}</div><div style="font-size:24px;font-weight:800;color:#0b9865">${fH(Z.okE.at)}</div></div>`:`<div style="max-width:420px;margin:0 auto 14px;padding:12px;border:2px solid #cbd5e1;border-radius:14px;text-align:center"><div style="font-weight:700;margin-bottom:6px">Estudiante: escribe tu número de documento</div><input id="acl_doc" inputmode="numeric" autocomplete="off" placeholder="Número de documento" onkeydown="if(event.key==='Enter')ACL.enviar('${s.id}')" style="width:100%;font-size:22px;text-align:center;border:2px solid #cbd5e1;border-radius:12px;padding:12px"><button onclick="ACL.enviar('${s.id}')" style="width:100%;margin-top:10px;background:#16a34a;color:#fff;padding:14px;border-radius:12px;font-size:18px;font-weight:800">Enviar y ver asistencia</button>${Z.errE?`<div style="margin-top:10px;color:#b91c1c;font-weight:700">${e(Z.errE)}</div>`:''}</div>`);
    cur=`<div class="aic-card" style="padding:16px;margin-bottom:14px;border:2px solid ${s.cerrada_at?'#cbd5e1':'#16a34a'}">${kio}<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h3 style="font-weight:800">${s.cerrada_at?'Clase cerrada':'🟢 Asistencia abierta'} · ${e(cN(s.course_id))} ${e(s.asignatura||'')}</h3>${s.cerrada_at?'':`<button onclick="ACL.cerrar('${s.id}')" style="background:#dc2626;color:#fff;padding:8px 14px;border-radius:8px;font-weight:700">■ Cerrar asistencia</button>`}</div>
    <div style="font-size:13px;color:#64748b;margin:4px 0">Abierta: ${fH(s.abierta_at)} · <b>${pres}</b> de ${Z.lista.length} presentes ${s.cerrada_at?'':'(se actualiza sola)'}</div>
    <div class="aic-table-wrap"><table style="min-width:480px"><thead><tr><th>ESTUDIANTE</th><th>DOCUMENTO</th><th>HORA</th><th></th></tr></thead><tbody>${Z.lista.map(x=>`<tr><td>${e(x.full_name)}</td><td>${e(x.documento||'—')}</td><td>${x.at?'✅ '+fH(x.at)+(x.manual?' (manual)':''):'<span style="color:#b91c1c">Ausente</span>'}</td><td><button class="aic-link" onclick="ACL.manual('${s.id}','${x.id}',${x.at?'false':'true'})">${x.at?'Quitar':'Marcar presente'}</button></td></tr>`).join('')||'<tr><td colspan="4">Este curso no tiene estudiantes.</td></tr>'}</tbody></table></div>
    <button class="aic-link" style="margin-top:8px" onclick="ACL.csv()">⬇ Descargar Excel</button></div>`;
  }
  const hist=repHtml();
  return`<div>${abrir}${cur}${hist}</div>`;
}
function repHtml(){
  const F=Z.F,sel=(k,l,opts,all)=>`<label style="font-size:12px;font-weight:700">${l}<br><select ${inp} style="border:1px solid #cbd5e1;border-radius:8px;padding:8px;max-width:200px" onchange="ACL.f('${k}',this.value)"><option value="">${all}</option>${opts.map(o=>`<option value="${e(o[0])}" ${F[k]===o[0]?'selected':''}>${e(o[1])}</option>`).join('')}</select></label>`;
  const dt=(k,l)=>`<label style="font-size:12px;font-weight:700">${l}<br><input type="date" value="${F[k]}" onchange="ACL.f('${k}',this.value)" style="border:1px solid #cbd5e1;border-radius:8px;padding:8px"></label>`;
  const tot=Z.rep.reduce((a,x)=>({p:a.p+Number(x.presentes),t:a.t+Number(x.total)}),{p:0,t:0});
  return`<div class="aic-card" style="padding:16px"><h3 style="font-weight:800;margin-bottom:8px">📋 Asistencias a clase${isDir()?' de los docentes del colegio':''}</h3>
   <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px">${dt('d','Desde')}${dt('h','Hasta')}${sel('area','Área',Z.areas.map(x=>[x,x]),'Todas')}${sel('asig','Asignatura',Z.asigs.map(x=>[x,x]),'Todas')}${isDir()?sel('doc','Docente',Z.docs.map(x=>[x.id,x.full_name]),'Todos'):''}<button onclick="ACL.csvRep()" style="align-self:end;background:#246be0;color:#fff;padding:9px 12px;border-radius:8px;font-weight:700;font-size:13px">⬇ Excel</button></div>
   <div style="font-size:13px;color:#64748b;margin-bottom:6px">${Z.rep.length} clase(s) · asistencia promedio ${tot.t?Math.round(100*tot.p/tot.t):0} %</div>
   <div class="aic-table-wrap"><table style="min-width:640px"><thead><tr><th>FECHA</th>${isDir()?'<th>DOCENTE</th>':''}<th>ÁREA</th><th>ASIGNATURA</th><th>CURSO</th><th>PRESENTES</th><th></th></tr></thead><tbody>${Z.rep.map(x=>`<tr><td>${fH(x.fecha)}</td>${isDir()?`<td>${e(x.docente)}</td>`:''}<td>${e(x.area)}</td><td>${e(x.asignatura)}</td><td>${e(x.curso)}</td><td>${x.presentes} de ${x.total}</td><td><button class="aic-link" onclick="ACL.ver('${x.sesion_id}')">Ver lista</button></td></tr>`).join('')||'<tr><td colspan="7">No hay clases con esos filtros.</td></tr>'}</tbody></table></div>
   ${Z.det&&!isDoc()?detDir():''}</div>`;
}
function detDir(){return`<div style="margin-top:12px;border-top:1px solid #e2e8f0;padding-top:10px"><b>Lista de la clase</b><div class="aic-table-wrap"><table style="min-width:480px"><thead><tr><th>ESTUDIANTE</th><th>DOCUMENTO</th><th>HORA</th></tr></thead><tbody>${Z.lista.map(x=>`<tr><td>${e(x.full_name)}</td><td>${e(x.documento||'—')}</td><td>${x.at?'✅ '+fH(x.at):'<span style="color:#b91c1c">Ausente</span>'}</td></tr>`).join('')}</tbody></table></div></div>`}
function estView(){
  return`<div class="aic-card" style="padding:18px;max-width:520px;margin:auto;text-align:center"><h2 style="font-weight:800">✋ Asistencia a clase</h2><p style="margin-top:8px;color:#64748b">Tu asistencia se registra en el dispositivo de tu docente, escribiendo tu número de documento al llegar a clase.</p></div>`;
}
function estViewViejo(){
  const hoy=Z.abiertas;
  if(Z.ok)return`<div class="aic-card" style="padding:24px;text-align:center;max-width:460px;margin:auto"><div style="font-size:56px">✅</div><div style="font-size:22px;font-weight:800">Asistencia registrada</div><div style="font-size:24px;font-weight:800;color:#0b9865;margin-top:8px">${fH(Z.ok)}</div><button class="aic-link" style="margin-top:12px" onclick="ACL.nuevo()">Volver</button></div>`;
  return`<div class="aic-card" style="padding:18px;max-width:520px;margin:auto"><h2 style="font-weight:800;font-size:20px;text-align:center">✋ Asistencia a clase</h2>
  ${hoy.length?hoy.map(s=>s.ya?`<div style="margin-top:12px;border:1px solid #bbf7d0;background:#f0fdf4;border-radius:12px;padding:12px;text-align:center">✅ Ya registraste tu asistencia a ${e(s.asignatura||'la clase')} a las ${fH(s.ya)}</div>`:`<div style="margin-top:14px;border:1px solid #e2e8f0;border-radius:12px;padding:14px"><div style="text-align:center;font-weight:700">${e(s.asignatura||'Clase')} · ${e(s.docente)}</div><input id="acl_${s.id}" inputmode="numeric" placeholder="Escribe tu número de documento" ${inp} style="width:100%;margin-top:10px;font-size:20px;text-align:center;border:2px solid #cbd5e1;border-radius:12px;padding:14px"><button onclick="ACL.marcar('${s.id}')" style="width:100%;margin-top:10px;background:#16a34a;color:#fff;padding:16px;border-radius:12px;font-size:18px;font-weight:800">Registrar mi asistencia</button></div>`).join(''):`<p style="text-align:center;color:#64748b;margin-top:12px">Tu docente aún no ha abierto la asistencia. Cuando la abra, aparecerá aquí.</p><div style="text-align:center"><button class="aic-link" onclick="ACL.recargar()" style="font-size:14px">↻ Actualizar</button></div>`}</div>`;
}
const api={
  load,view:()=>isDoc()?docView():isDir()?`<div>${repHtml()}</div>`:estView(),
  async f(k,v){Z.F[k]=v;try{await repLoad()}catch(x){return err(x)}R()},
  csvRep(){const l=[['Fecha','Docente','Área','Asignatura','Curso','Presentes','Total'],...Z.rep.map(x=>[fH(x.fecha),x.docente,x.area,x.asignatura,x.curso,x.presentes,x.total])];const t='\ufeff'+l.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(';')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'}));a.download='asistencia_clases.csv';a.click()},
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
  async enviar(id){
    const v=(document.getElementById('acl_doc')?.value||'').trim();Z.errE='';
    if(v.replace(/\D/g,'').length<5){Z.errE='Escribe el número de documento completo.';return R()}
    const r=await sb.rpc('clase_marcar_doc',{p_ses:id,p_doc:v});
    if(r.error){Z.errE=r.error.message;R();setTimeout(()=>{if(Z.errE){Z.errE='';R()}},6000);return}
    const x=(r.data||[])[0];Z.okE={nombre:x.nombre,at:x.at,rep:x.repetida};
    try{await lista();const h=Z.ses.find(y=>y.id===id);}catch(y){}
    R();setTimeout(()=>{Z.okE=null;R()},7000);
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
