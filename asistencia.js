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
let Z={docs:[],rows:[],desde:'',hasta:hoy(),doc:'',busy:false,q:'',cc:'',enc:null,ok:null,cedulas:false,mi:null};
function ini(){const d=new Date();d.setDate(d.getDate()-30);return d.toLocaleDateString('en-CA',{timeZone:'America/Bogota'})}
async function load(){
  Z.desde=Z.desde||ini();
  if(isDir()){const r=await sb.rpc('asistencia_docentes');if(r.error)throw r.error;Z.docs=r.data||[]}
  if(!isDir()){const r=await sb.rpc('asistencia_mi_doc');if(!r.error)Z.mi=r.data||null}
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
const big='style="width:100%;border:2px solid #cbd5e1;border-radius:14px;padding:16px;font-size:24px;text-align:center;letter-spacing:2px"';
function miDoc(){
  if(Z.mi)return`<div class="aic-card" style="padding:14px;margin-bottom:14px"><b>🪪 Tu documento:</b> ${e(Z.mi)} <span style="font-size:12px;color:#64748b">· Con este número marcas tu llegada y salida en el celular de la entrada.</span></div>`;
  return`<div class="aic-card" style="padding:14px;margin-bottom:14px"><h3 style="font-weight:800">🪪 Registra tu número de documento</h3><p style="font-size:13px;color:#64748b;margin:4px 0 8px">Se hace una sola vez. Con este número marcarás tu llegada y salida en el celular que el rector dispone en la entrada.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><input id="asis-mi" inputmode="numeric" placeholder="Número de documento" style="flex:1;min-width:180px;border:1px solid #cbd5e1;border-radius:8px;padding:10px"><button onclick="ASIS.guardarMi()" style="background:#246be0;color:#fff;padding:10px 14px;border-radius:8px;font-weight:700">Guardar</button></div></div>`}
function marcar(){
  const sinDoc=Z.docs.filter(d=>!d.documento).length;
  let c;
  if(Z.ok){
    c=`<div style="text-align:center;padding:18px 8px"><div style="font-size:56px">${Z.ok.tipo==='entrada'?'✅':'👋'}</div><div style="font-size:24px;font-weight:800;margin-top:6px">${e(Z.ok.nombre)}</div><div style="font-size:20px;margin-top:6px">${Z.ok.tipo==='entrada'?'LLEGADA registrada':'SALIDA registrada'}</div><div style="font-size:28px;font-weight:800;color:#0b9865;margin-top:6px">${dia(Z.ok.at)}<br>${hora(Z.ok.at)}</div></div>`;
  }else if(Z.enc){
    const d=Z.enc,est=d.ultimo_tipo==='entrada'?`Hoy llegó a las ${hora(d.ultimo_at)}`:d.ultimo_tipo==='salida'?`Hoy salió a las ${hora(d.ultimo_at)}`:'Hoy aún no ha marcado';
    const b=(t,col,tx)=>`<button ${Z.busy?'disabled':''} onclick="ASIS.m('${t}')" style="flex:1;background:${col};color:#fff;padding:22px 8px;border-radius:14px;font-size:20px;font-weight:800">${tx}</button>`;
    c=`<div style="text-align:center"><div style="font-size:13px;color:#64748b">Docente</div><div style="font-size:24px;font-weight:800">${e(d.full_name)}</div><div style="font-size:14px;color:#64748b;margin:4px 0 4px">${est}</div><div id="asis-reloj" style="font-size:30px;font-weight:800;margin:8px 0 14px"></div><div style="display:flex;gap:12px">${b('entrada','#16a34a','⬇ LLEGADA')}${b('salida','#dc2626','⬆ SALIDA')}</div><button class="aic-link" style="margin-top:14px" onclick="ASIS.limpiar()">Cancelar</button></div>`;
  }else{
    c=`<label style="display:block;text-align:center;font-weight:700;margin-bottom:8px">Escribe tu número de documento</label><input id="asis-cc" inputmode="numeric" autocomplete="off" placeholder="Ej: 1020304050" value="${e(Z.cc)}" ${big} oninput="ASIS.cc=this.value" onkeydown="if(event.key==='Enter')ASIS.buscarCC()"><button onclick="ASIS.buscarCC()" style="width:100%;margin-top:12px;background:#246be0;color:#fff;padding:18px;border-radius:14px;font-size:20px;font-weight:800">Continuar</button>`;
  }
  const ced=sinDoc?`<div style="margin-top:16px;background:#fff7ed;border:1px solid #fdba74;border-radius:10px;padding:10px;font-size:13px"><b>Falta registrar el documento de:</b> ${e(Z.docs.filter(d=>!d.documento).map(d=>d.full_name).join(', '))}.<br>Cada docente lo registra una sola vez entrando a su cuenta → <b>Mi asistencia</b>.</div>`:'';
  return`<div class="aic-card" style="padding:16px;margin-bottom:14px;max-width:520px;margin-left:auto;margin-right:auto"><h2 style="font-weight:800;font-size:20px;text-align:center">🕒 Asistencia de docentes</h2><p style="font-size:13px;color:#64748b;text-align:center;margin:4px 0 14px">Este celular queda en la entrada del colegio. Cada docente escribe su documento y marca su llegada o su salida.</p>${c}${ced}</div>`;
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
  view:()=>`<div>${isDir()?marcar():miDoc()}${historial()}</div>`,
  async guardarMi(){const v=document.getElementById('asis-mi').value;const r=await sb.rpc('asistencia_mi_doc',{p_doc:v});if(r.error)return toast('⚠️','No se guardó',r.error.message);Z.mi=r.data;toast('✅','Documento registrado','Ya puedes marcar tu llegada y salida en el celular de la entrada.');R()},
  set cc(v){Z.cc=v},
  limpiar(){Z.enc=null;Z.ok=null;Z.cc='';clearInterval(Z.t);R()},
  async buscarCC(){
    const v=(document.getElementById('asis-cc')?.value||Z.cc||'').trim();Z.cc=v;
    if(v.replace(/\D/g,'').length<5)return toast('⚠️','Documento','Escribe tu número de documento.');
    const r=await sb.rpc('asistencia_buscar',{p_doc:v});
    if(r.error)return err(r.error);
    if(!r.data||!r.data.length)return toast('⚠️','No encontrado','Ese documento no está registrado. Avisa al rector o coordinador.');
    Z.enc=r.data[0];R();api.reloj();
  },
  reloj(){clearInterval(Z.t);const f=()=>{const el=document.getElementById('asis-reloj');if(!el){clearInterval(Z.t);return}el.textContent=dia(new Date())+' · '+hora(new Date())};f();Z.t=setInterval(f,1000)},
  async f(k,v){Z[k]=v;try{await hist()}catch(x){return err(x)}R()},
  async m(tipo){
    if(Z.busy||!Z.enc)return;Z.busy=true;
    const d=Z.enc;
    const r=await sb.rpc('asistencia_marcar',{p_docente:d.id,p_tipo:tipo});
    Z.busy=false;
    if(r.error){return toast('⚠️','No se marcó',r.error.message)}
    clearInterval(Z.t);Z.enc=null;Z.cc='';Z.ok={nombre:d.full_name,tipo,at:r.data};
    try{await load()}catch(x){err(x)}R();
    setTimeout(()=>{if(Z.ok&&Z.ok.at===r.data){Z.ok=null;R()}},7000);
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
