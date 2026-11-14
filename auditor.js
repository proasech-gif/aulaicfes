/* AULA360 — Entorno del administrador como AUDITOR de toda la plataforma:
   Panel (vista general) · Cuentas (entrar a cualquier cuenta / borrar) · Salud (revisar y corregir). */
window.AUD=(function(){
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RN={rector:'Rector',coordinador:'Coordinador',prof:'Docente',est:'Estudiante'};
let Z={sub:'panel',r:null,salud:null,cuentas:null,rol:'todos',q:'',max:60,chk:null,corriendo:false,errs:null,rep:null,filtro:'abiertos'};
const fh=d=>d?new Date(d).toLocaleString('es-CO',{dateStyle:'medium',timeStyle:'short'}):'—';
async function cargar(){
  if(Z.sub==='panel'||!Z.r){const r=await sb.rpc('auditor_resumen');if(r.error)throw r.error;Z.r=r.data}
  if(Z.sub==='salud'){const r=await sb.rpc('auditor_salud');if(r.error)throw r.error;Z.salud=r.data||[]}
  if(Z.sub==='errores'){const r=await sb.from('errores_cliente').select('*').order('created_at',{ascending:false}).limit(200);if(r.error)throw r.error;Z.errs=r.data||[]}
  if(Z.sub==='informe'||Z.sub==='panel'){const r=await sb.from('soporte_reportes').select('*').order('created_at',{ascending:false}).limit(300);if(!r.error)Z.rep=r.data||[]}
  if(Z.sub==='cuentas'){
    const r=await sb.from('profiles').select('id,full_name,role,email,school_other,teacher_status,is_admin,document').order('full_name').limit(3000);
    if(r.error)throw r.error;Z.cuentas=r.data||[]}
}
async function load(){await cargar()}
const kpi=(t,v,c,sub)=>`<div class="aic-kpi"><div><small>${t}</small><strong>${v}</strong>${sub?`<span>${sub}</span>`:''}</div></div>`;
function tabs(){
  const T=[['panel','📊 Panel general'],['cuentas','👥 Cuentas'],['salud','🩺 Salud de la plataforma'],['revision','🧰 Revisión de funcionamiento'],['errores','🐞 Errores detectados'],['informe','📨 Informe cliente'+((Z.rep||[]).filter(x=>x.estado==='nuevo').length?' ('+(Z.rep||[]).filter(x=>x.estado==='nuevo').length+')':'')]];
  return`<nav class="aic-tabs" style="margin-bottom:14px">${T.map(([k,l])=>`<button onclick="AUD.ir('${k}')" class="${Z.sub===k?'on':''}">${l}</button>`).join('')}</nav>`}
function vPanel(){
  const d=Z.r;if(!d)return'<div class="aic-card" style="padding:16px">Cargando…</div>';
  const c=d.cuentas||{},p=d.preguntas||{};
  const cu=Object.entries(c).map(([k,n])=>`<div class="aic-row" style="display:flex;justify-content:space-between"><span>${e(k)}</span><b>${n}</b></div>`).join('');
  const nuevos=(Z.rep||[]).filter(x=>x.estado==='nuevo').length;
  return`${nuevos?`<div class="aic-card" style="padding:14px;margin-bottom:12px;border-left:5px solid #dc2626">📨 Hay <b>${nuevos}</b> reporte(s) de soporte sin atender. <button onclick="AUD.ir('informe')" class="aic-link">Ver Informe cliente</button></div>`:''}${d.pendientes?`<div class="aic-card" style="padding:14px;margin-bottom:12px;border-left:5px solid #f59e0b">⏳ Hay <b>${d.pendientes}</b> cuenta(s) esperando aprobación. <button onclick="go('doc')" class="aic-link">Revisar solicitudes</button></div>`:''}
  <div class="aic-kpis">${kpi('Colegios con cuentas',d.colegios_con_cuentas)}${kpi('Cursos',d.cursos)}${kpi('Estudiantes en listas',d.estudiantes_lista)}${kpi('Simulacros',d.simulacros)}</div>
  <div class="aic-kpis" style="margin-top:12px">${kpi('Intentos de estudiantes',d.intentos)}${kpi('Preguntas activas',p.activas+' / '+p.total,0,'en borrador: '+p.borradores)}${kpi('Preguntas hechas por IA',p.ia,0,'hoy: '+d.ia_hoy)}${kpi('Lotes de IA con error',d.ia_errores)}</div>
  <div class="aic-lower-grid" style="margin-top:14px">
   <div class="aic-card" style="padding:16px"><h3 style="font-weight:800;margin-bottom:10px">Cuentas por rol</h3>${cu||'—'}</div>
   <div class="aic-card" style="padding:16px"><h3 style="font-weight:800;margin-bottom:10px">Últimos movimientos de auditoría</h3>${(d.actividad||[]).length?`<div class="aic-table-wrap"><table style="min-width:0"><thead><tr><th>CUÁNDO</th><th>QUIÉN</th><th>QUÉ</th></tr></thead><tbody>${d.actividad.map(a=>`<tr><td>${fh(a.cuando)}</td><td>${e(a.quien)}</td><td>${e(a.accion)} · ${e(a.sobre||'')}</td></tr>`).join('')}</tbody></table></div>`:'<p style="color:#64748b;font-size:13px">Sin movimientos todavía.</p>'}</div></div>`;
}
function filtradas(){
  const q=Z.q.trim().toLowerCase();
  return(Z.cuentas||[]).filter(x=>(Z.rol==='todos'||x.role===Z.rol)&&(!q||[x.full_name,x.email,x.school_other,x.document].some(v=>String(v||'').toLowerCase().includes(q))))}
function vCuentas(){
  if(!Z.cuentas)return'<div class="aic-card" style="padding:16px">Cargando…</div>';
  const L=filtradas(),yo=M&&M.id;
  const roles=['todos','rector','coordinador','prof','est'];
  return`<div class="aic-card" style="padding:16px"><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
   <input id="aud_q" value="${e(Z.q)}" placeholder="Buscar por nombre, correo, colegio o documento" style="flex:1;min-width:220px;padding:10px 12px" oninput="AUD.buscar(this.value)">
   <select onchange="AUD.rol(this.value)" style="padding:10px">${roles.map(r=>`<option value="${r}" ${Z.rol===r?'selected':''}>${r==='todos'?'Todos los roles':RN[r]+'s'}</option>`).join('')}</select></div>
   <p style="font-size:12px;color:#64748b;margin-bottom:8px">${L.length} cuenta(s). <b>Entrar</b> te lleva a su entorno como auditor y lo que cambies SÍ se guarda.</p>
   <div class="aic-table-wrap"><table style="min-width:640px"><thead><tr><th>NOMBRE</th><th>ROL</th><th>COLEGIO / CORREO</th><th>ESTADO</th><th></th></tr></thead><tbody>
   ${L.slice(0,Z.max).map(x=>`<tr><td><b>${e(x.full_name||'—')}</b></td><td>${x.is_admin?'Administrador':RN[x.role]||e(x.role)}</td><td style="font-size:12px">${e(x.school_other||'')}<br><span style="color:#64748b">${e(x.email||'')}</span></td><td>${x.teacher_status&&x.teacher_status!=='aprobado'?'<span class="aic-score score-mid">'+e(x.teacher_status)+'</span>':'<span class="aic-score score-high">activa</span>'}</td>
   <td style="white-space:nowrap">${x.is_admin||x.id===yo?'—':`<button onclick="AUD.entrar('${x.id}')" style="background:#6d28d9;color:#fff;padding:7px 12px;border-radius:10px;font-weight:800;font-size:12px">🛡 Entrar</button> <button onclick="AUD.borrar('${x.id}')" style="background:#dc2626;color:#fff;padding:7px 12px;border-radius:10px;font-weight:800;font-size:12px">🗑 Borrar</button>`}</td></tr>`).join('')||'<tr><td colspan="5" style="color:#64748b">No hay cuentas con ese filtro.</td></tr>'}
   </tbody></table></div>${L.length>Z.max?`<button onclick="AUD.mas()" class="aic-link" style="margin-top:10px">Ver más (${L.length-Z.max} restantes)</button>`:''}</div>`}
function vSalud(){
  const L=Z.salud;if(!L)return'<div class="aic-card" style="padding:16px">Cargando…</div>';
  const mal=L.filter(x=>x.estado!=='ok').length;
  const col={ok:['#dcfce7','#166534','Bien'],aviso:['#fef3c7','#92400e','Aviso'],error:['#fee2e2','#991b1b','Problema']};
  return`<div class="aic-card" style="padding:16px"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px"><div><h3 style="font-weight:800;font-size:16px">${mal?mal+' cosa(s) por revisar':'Todo en orden ✅'}</h3><p style="font-size:12px;color:#64748b">Revisión automática de datos de toda la plataforma.</p></div><button onclick="AUD.salud()" style="background:#246be0;color:#fff;padding:9px 14px;border-radius:10px;font-weight:800">🔄 Revisar de nuevo</button></div>
  ${L.map(x=>{const c=col[x.estado]||col.aviso;return`<div class="aic-row" style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap"><div style="flex:1;min-width:220px"><b>${e(x.titulo)}</b> <span style="background:${c[0]};color:${c[1]};border-radius:999px;padding:2px 9px;font-size:11px;font-weight:800">${c[2]}${x.n>0?' · '+x.n:''}</span><div style="font-size:12px;color:#64748b;margin-top:3px">${e(x.detalle||'')}</div></div>${x.corregible&&x.n>0?`<button onclick="AUD.corregir('${e(x.clave)}')" style="background:#16a34a;color:#fff;padding:8px 14px;border-radius:10px;font-weight:800">🔧 Corregir</button>`:''}</div>`}).join('')}</div>`}
const MODS=['index.html','dashboard.js','colegio.js','docente.js','saberimp.js','periodos.js','informes.js','icfes.js','auditor.js','permisos.js','planillas.js','listados.js','horarios.js','asistencia.js','planeador.js','mensajes.js','reuniones.js','virtual.js','vercomo.js','soporte.js','banco.js','taller_ia.js','clase_ia.js','hoja.js','omr.js','styles.css','aula360-ui.css','manifest.json','sw.js'];
const TABS=['profiles','colegios','courses','simulacros','colegio_membrete','letterheads','perfil_foto','soporte_reportes','errores_cliente','icfes_resultados','sesiones_consulta'];
async function revisar(){
  Z.corriendo=true;Z.chk=[];render();const out=[];
  const add=(grupo,nombre,ok,det,ms)=>out.push({grupo,nombre,ok,det:det||'',ms});
  const t=async(f)=>{const a=performance.now();try{const d=await f();return[true,d,Math.round(performance.now()-a)]}catch(x){return[false,x&&x.message||String(x),Math.round(performance.now()-a)]}};
  let r=await t(async()=>{const x=await sb.auth.getSession();if(!x.data.session)throw new Error('sin sesión');return'sesión activa'});add('Cuenta','Sesión del auditor',r[0],r[1],r[2]);
  for(const f of MODS){r=await t(async()=>{const x=await fetch(f+'?rev='+Date.now(),{cache:'no-store'});if(!x.ok)throw new Error('HTTP '+x.status);const tx=await x.text();if(/\.js$/.test(f))new Function(tx);return'carga bien'});add('Archivos de la página',f,r[0],r[0]?'':r[1],r[2])}
  for(const tb of TABS){r=await t(async()=>{const x=await sb.from(tb).select('*',{count:'exact',head:true});if(x.error)throw x.error;return x.count+' fila(s)'});add('Base de datos (tablas)',tb,r[0],r[1],r[2])}
  for(const fn of ['auditor_resumen','auditor_salud']){r=await t(async()=>{const x=await sb.rpc(fn);if(x.error)throw x.error;return'responde'});add('Base de datos (funciones)',fn,r[0],r[1],r[2])}
  for(const b of ['school-logos','avatars']){r=await t(async()=>{const x=await sb.storage.from(b).list('',{limit:1});if(x.error)throw x.error;return'accesible'});add('Almacenamiento de archivos',b,r[0],r[1],r[2])}
  r=await t(async()=>{const x=await fetch('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',{method:'HEAD'});if(!x.ok)throw new Error('HTTP '+x.status);return'disponible'});add('Servicios externos','Librería de lectura de PDF (pdf.js)',r[0],r[1],r[2]);
  Z.chk=out;Z.corriendo=false;render()}
function vRevision(){
  const L=Z.chk||[],mal=L.filter(x=>!x.ok);
  const g={};L.forEach(x=>(g[x.grupo]=g[x.grupo]||[]).push(x));
  return`<div class="aic-card" style="padding:16px"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><div><h3 style="font-weight:800;font-size:16px">${Z.corriendo?'Revisando…':!L.length?'Revisión de toda la plataforma':mal.length?'⚠️ '+mal.length+' cosa(s) fallaron de '+L.length:'✅ Todo funciona ('+L.length+' pruebas)'}</h3><p style="font-size:12px;color:#64748b">Comprueba que cada archivo de la página cargue sin errores, que las tablas, funciones y carpetas de archivos de la base de datos respondan.</p></div><button onclick="AUD.revisar()" ${Z.corriendo?'disabled':''} style="background:#2563eb;color:#fff;padding:11px 18px;border-radius:12px;font-weight:800">🧰 Revisar toda la plataforma</button></div>
  ${Object.entries(g).map(([k,v])=>`<h4 style="font-weight:800;margin:14px 0 6px;font-size:13px">${e(k)}</h4>${v.map(x=>`<div class="aic-row" style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid #eef2f7;font-size:13px"><span>${x.ok?'✅':'❌'} <b>${e(x.nombre)}</b></span><span style="color:${x.ok?'#64748b':'#b91c1c'};text-align:right">${e(x.det)} <small>${x.ms} ms</small></span></div>`).join('')}`).join('')}</div>`}
function vErrores(){
  const L=Z.errs;if(!L)return'<div class="aic-card" style="padding:16px">Cargando…</div>';
  return`<div class="aic-card" style="padding:16px"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px"><div><h3 style="font-weight:800">${L.length?L.length+' error(es) detectados':'Sin errores registrados ✅'}</h3><p style="font-size:12px;color:#64748b">La página anota sola los errores que les salen a los usuarios (qué se rompió, en qué pantalla y de qué colegio).</p></div>${L.length?'<button onclick="AUD.limpiarErrores()" style="background:#e2e8f0;padding:8px 14px;border-radius:10px;font-weight:700;font-size:12px">Limpiar lista</button>':''}</div>
  ${L.length?`<div class="aic-table-wrap"><table style="min-width:640px"><thead><tr><th>CUÁNDO</th><th>ROL / COLEGIO</th><th>PANTALLA</th><th>ERROR</th></tr></thead><tbody>${L.map(x=>`<tr><td style="font-size:12px;white-space:nowrap">${fh(x.created_at)}</td><td style="font-size:12px">${e(x.rol||'')}<br><span style="color:#64748b">${e(x.colegio||'')}</span></td><td>${e(x.pagina||'')}</td><td style="font-size:12px"><b>${e(x.mensaje)}</b><br><span style="color:#64748b">${e(x.origen||'')}</span></td></tr>`).join('')}</tbody></table></div>`:''}</div>`}
function vInforme(){
  const L=Z.rep;if(!L)return'<div class="aic-card" style="padding:16px">Cargando…</div>';
  const V=L.filter(x=>Z.filtro==='todos'||x.estado!=='resuelto');
  const col={nuevo:['#fee2e2','#991b1b','Nuevo'],en_revision:['#fef3c7','#92400e','En revisión'],resuelto:['#dcfce7','#166534','Resuelto']};
  return`<div class="aic-card" style="padding:16px"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px"><div><h3 style="font-weight:800">📨 Informe cliente</h3><p style="font-size:12px;color:#64748b">Fallas reportadas por docentes, coordinadores y rectores desde el botón «Soporte técnico».</p></div>
  <select onchange="AUD.filtro(this.value)" style="padding:8px"><option value="abiertos" ${Z.filtro==='abiertos'?'selected':''}>Pendientes</option><option value="todos" ${Z.filtro==='todos'?'selected':''}>Todos</option></select></div>
  ${V.length?V.map(x=>{const c=col[x.estado]||col.nuevo;return`<div class="aic-row" style="border:1px solid #e2e8f0;border-radius:14px;padding:12px;margin-bottom:10px">
   <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>${e(x.asunto)}</b><span style="background:${c[0]};color:${c[1]};border-radius:999px;padding:2px 10px;font-size:11px;font-weight:800">${c[2]}</span></div>
   <div style="font-size:13px;margin:6px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:4px"><div><small style="color:#64748b">COLEGIO</small><br><b>${e(x.colegio||'—')}</b></div><div><small style="color:#64748b">${e((x.rol||'USUARIO').toUpperCase())}</small><br><b>${e(x.nombre||'—')}</b></div><div><small style="color:#64748b">CONTACTO</small><br>${e(x.email||'')}${x.telefono?'<br>'+e(x.telefono):''}</div><div><small style="color:#64748b">DÓNDE · CUÁNDO</small><br>${e(x.donde||'—')} · ${fh(x.created_at)}</div></div>
   <div style="background:#f8fafc;border-radius:10px;padding:10px;font-size:13px;white-space:pre-wrap"><small style="color:#64748b">FALLA PRESENTADA</small><br>${e(x.falla)}</div>
   <details style="margin-top:6px"><summary style="font-size:11px;color:#64748b;cursor:pointer">Datos técnicos</summary><div style="font-size:11px;color:#64748b">${e(x.pagina||'')}<br>${e(x.navegador||'')}</div></details>
   <textarea id="rsp_${x.id}" rows="2" placeholder="Respuesta para el usuario (opcional)" style="width:100%;padding:8px;margin-top:8px;font-size:13px">${e(x.respuesta||'')}</textarea>
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px"><button onclick="AUD.estado('${x.id}','en_revision')" style="background:#f59e0b;color:#fff;padding:7px 12px;border-radius:10px;font-weight:800;font-size:12px">En revisión</button><button onclick="AUD.estado('${x.id}','resuelto')" style="background:#16a34a;color:#fff;padding:7px 12px;border-radius:10px;font-weight:800;font-size:12px">✔ Resuelto</button><button onclick="AUD.entrarRep('${x.user_id}','${e(x.nombre||'Cuenta').replace(/'/g,'')}','${e(x.rol||'')}')" style="background:#6d28d9;color:#fff;padding:7px 12px;border-radius:10px;font-weight:800;font-size:12px">🛡 Entrar a su cuenta</button></div></div>`}).join(''):'<p style="font-size:13px;color:#64748b">No hay reportes pendientes. 🎉</p>'}</div>`}
function view(){return tabs()+(Z.sub==='panel'?vPanel():Z.sub==='cuentas'?vCuentas():Z.sub==='revision'?vRevision():Z.sub==='errores'?vErrores():Z.sub==='informe'?vInforme():vSalud())}
const api={load,view,revisar,
  filtro(v){Z.filtro=v;render()},
  async estado(id,est){const rsp=(document.getElementById('rsp_'+id)||{}).value||null;const r=await sb.from('soporte_reportes').update({estado:est,respuesta:rsp,updated_at:new Date().toISOString()}).eq('id',id);if(r.error)return err(r.error);toast('✅','Reporte actualizado','');await cargar();render()},
  async entrarRep(id,nom,rol){const m={Docente:'prof',Rector:'rector',Coordinador:'coordinador'};await loadScript('vercomo.js?v=5');return VC.entrar(id,nom,m[rol]||'prof','aud')},
  async limpiarErrores(){if(!confirm('¿Borrar la lista de errores?'))return;const r=await sb.from('errores_cliente').delete().gte('id',0);if(r.error)return err(r.error);await cargar();render()},
  async ir(k){Z.sub=k;try{await cargar();render()}catch(x){err(x)}},
  buscar(v){Z.q=v;Z.max=60;render();const i=document.getElementById('aud_q');if(i){i.focus();i.setSelectionRange(v.length,v.length)}},
  rol(v){Z.rol=v;Z.max=60;render()},mas(){Z.max+=200;render()},
  async entrar(id){const x=(Z.cuentas||[]).find(c=>c.id===id);if(!x)return;await loadScript('vercomo.js?v=5');return VC.entrar(id,x.full_name||'Cuenta',x.role,'aud')},
  async borrar(id){const x=(Z.cuentas||[]).find(c=>c.id===id);if(!x)return;
    if(!confirm('¿Borrar la cuenta de '+(x.full_name||'esta persona')+' ('+(RN[x.role]||x.role)+')?\n\nSe borra con toda su información. No se puede deshacer.'))return;
    const r=await sb.rpc('admin_borrar_cuenta',{p_id:id});if(r.error)return err(r.error);
    toast('🗑','Cuenta borrada',x.full_name||'');Z.r=null;await cargar();render()},
  async salud(){try{await cargar();render();toast('🩺','Revisión lista','')}catch(x){err(x)}},
  async corregir(k){if(!confirm('¿Aplicar la corrección automática?'))return;const r=await sb.rpc('auditor_corregir',{p_clave:k});if(r.error)return err(r.error);toast('🔧','Corregido',r.data+' fila(s) arregladas');await cargar();render()}
};
return api})();
