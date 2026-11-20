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
  if(Z.sub==='icfes'){try{const r=await sb.rpc('saber_periodos');Z.ic.lista=r.error?null:(r.data||[])}catch(_){Z.ic.lista=null}}
  if(Z.sub==='susc'){await loadScript('suscripcion_admin.js?v=2');await SUBA.load()}
  if(Z.sub==='errores'){const r=await sb.from('errores_cliente').select('*').order('created_at',{ascending:false}).limit(200);if(r.error)throw r.error;Z.errs=r.data||[]}
  if(Z.sub==='informe'||Z.sub==='panel'){const r=await sb.from('soporte_reportes').select('*').order('created_at',{ascending:false}).limit(300);if(!r.error)Z.rep=r.data||[]}
  if(Z.sub==='cuentas'){
    const r=await sb.from('profiles').select('id,full_name,role,email,school_other,teacher_status,is_admin,document,activo,colegio_id').order('full_name').limit(3000);
    if(r.error)throw r.error;Z.cuentas=r.data||[]}
  if(Z.sub==='cuentas'||Z.sub==='colegios'){const c=await sb.rpc('auditor_colegios');if(c.error)throw c.error;Z.cols=c.data||[];Z.colMap={};Z.cols.forEach(x=>Z.colMap[x.id]=x)}
  if(Z.sub==='colegios'&&!Z.cuentas){const r=await sb.from('profiles').select('id,full_name,role,email,school_other,teacher_status,is_admin,document,activo,colegio_id').order('full_name').limit(3000);if(r.error)throw r.error;Z.cuentas=r.data||[]}
}
async function load(){await cargar()}
const kpi=(t,v,c,sub)=>`<div class="aic-kpi"><div><small>${t}</small><strong>${v}</strong>${sub?`<span>${sub}</span>`:''}</div></div>`;
function tabs(){
  const T=[['panel','📊 Panel general'],['colegios','🏫 Colegios y accesos'],['cuentas','👥 Cuentas'],['salud','🩺 Salud de la plataforma'],['revision','🧰 Revisión de funcionamiento'],['errores','🐞 Errores detectados'],['susc','💳 Suscripciones'],['icfes','📥 Datos Saber 11'],['informe','📨 Informe cliente'+((Z.rep||[]).filter(x=>x.estado==='nuevo').length?' ('+(Z.rep||[]).filter(x=>x.estado==='nuevo').length+')':'')]];
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
   ${L.slice(0,Z.max).map(x=>`<tr><td><b>${e(x.full_name||'—')}</b></td><td>${x.is_admin?'Administrador':RN[x.role]||e(x.role)}</td><td style="font-size:12px">${e((Z.colMap&&Z.colMap[x.colegio_id]&&Z.colMap[x.colegio_id].nombre)||x.school_other||'')}<br><span style="color:#64748b">${e(x.email||'')}</span></td><td>${x.activo===false?'<span class="aic-score" style="background:#fee2e2;color:#991b1b">desactivada</span>':x.teacher_status&&x.teacher_status!=='aprobado'?'<span class="aic-score score-mid">'+e(x.teacher_status)+'</span>':'<span class="aic-score score-high">activa</span>'}</td>
   <td style="white-space:nowrap">${x.is_admin||x.id===yo?'—':`<button onclick="AUD.entrar('${x.id}')" style="background:#6d28d9;color:#fff;padding:7px 12px;border-radius:10px;font-weight:800;font-size:12px">🛡 Entrar</button> <button onclick="AUD.act('cuenta','${x.id}',${x.activo===false})" style="background:${x.activo===false?'#16a34a':'#f59e0b'};color:#fff;padding:7px 12px;border-radius:10px;font-weight:800;font-size:12px">${x.activo===false?'✅ Activar':'⏸ Desactivar'}</button> <button onclick="AUD.borrar('${x.id}')" style="background:#dc2626;color:#fff;padding:7px 12px;border-radius:10px;font-weight:800;font-size:12px">🗑 Borrar</button>`}</td></tr>`).join('')||'<tr><td colspan="5" style="color:#64748b">No hay cuentas con ese filtro.</td></tr>'}
   </tbody></table></div>${L.length>Z.max?`<button onclick="AUD.mas()" class="aic-link" style="margin-top:10px">Ver más (${L.length-Z.max} restantes)</button>`:''}</div>`}
function vColegios(){
  if(!Z.cols||!Z.cuentas)return'<div class="aic-card" style="padding:16px">Cargando…</div>';
  const q=(Z.qc||'').toLowerCase(),L=Z.cols.filter(c=>!q||String(c.nombre).toLowerCase().includes(q));
  const sus=c=>c.sus_vence?(new Date(c.sus_vence)>=new Date()?'<span class="aic-score score-high">pagada · vence '+e(String(c.sus_vence).slice(0,10))+'</span>':'<span class="aic-score" style="background:#fee2e2;color:#991b1b">vencida '+e(String(c.sus_vence).slice(0,10))+'</span>'):'<span class="aic-score score-mid">'+e(c.sus_estado||'sin pago')+'</span>';
  return`<div class="aic-card" style="padding:16px"><h3 style="font-weight:800;font-size:16px">🏫 Colegios y accesos</h3>
   <p style="font-size:12px;color:#64748b;margin:4px 0 10px">Activa o desactiva un colegio completo (nadie de ese colegio podrá entrar) o entra a cualquiera de sus cuentas como auditor. Para activar o desactivar rectores, coordinadores, docentes o estudiantes uno por uno, usa la pestaña «Cuentas».</p>
   <input value="${e(Z.qc||'')}" placeholder="Buscar colegio" oninput="AUD.bcol(this.value)" id="aud_qc" style="width:100%;max-width:360px;padding:10px 12px;margin-bottom:10px">
   <div class="aic-table-wrap"><table style="min-width:720px"><thead><tr><th>COLEGIO</th><th>SUSCRIPCIÓN</th><th>RECT.</th><th>COORD.</th><th>DOC.</th><th>EST.</th><th>ESTADO</th><th></th></tr></thead><tbody>
   ${L.map(c=>{const cu=(Z.cuentas||[]).filter(x=>x.colegio_id===c.id&&!x.is_admin);const abierto=Z.abre===c.id;return`<tr><td><b>${e(c.nombre)}</b>${c.es_prueba?' <small style="color:#7c3aed">(prueba)</small>':''}</td><td>${sus(c)}</td><td>${c.rectores}</td><td>${c.coordinadores}</td><td>${c.docentes}</td><td>${c.estudiantes}</td><td>${c.activo?'<span class="aic-score score-high">activo</span>':'<span class="aic-score" style="background:#fee2e2;color:#991b1b">desactivado</span>'}</td>
   <td style="white-space:nowrap"><button onclick="AUD.abrirCol(${c.id})" style="background:#6d28d9;color:#fff;padding:7px 12px;border-radius:10px;font-weight:800;font-size:12px">🛡 Entrar${abierto?' ▲':' ▼'}</button> <button onclick="AUD.act('colegio','${c.id}',${!c.activo})" style="background:${c.activo?'#f59e0b':'#16a34a'};color:#fff;padding:7px 12px;border-radius:10px;font-weight:800;font-size:12px">${c.activo?'⏸ Desactivar':'✅ Activar'}</button></td></tr>
   ${abierto?`<tr><td colspan="8" style="background:#f8fafc">${cu.length?cu.sort((a,b)=>['rector','coordinador','prof','est'].indexOf(a.role)-['rector','coordinador','prof','est'].indexOf(b.role)).slice(0,40).map(x=>`<div style="display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid #e5e7eb;font-size:13px"><span><b>${e(x.full_name||'—')}</b> · ${RN[x.role]||e(x.role)} · <span style="color:#64748b">${e(x.email||'')}</span>${x.activo===false?' · <b style="color:#b91c1c">desactivada</b>':''}</span><button onclick="AUD.entrar('${x.id}')" style="background:#6d28d9;color:#fff;padding:5px 10px;border-radius:8px;font-weight:800;font-size:12px">Entrar a esta cuenta</button></div>`).join('')+(cu.length>40?'<div style="font-size:12px;color:#64748b;padding-top:6px">Se muestran 40. Usa «Cuentas» para ver todas.</div>':''):'<span style="color:#64748b;font-size:13px">Este colegio no tiene cuentas todavía.</span>'}</td></tr>`:''}`}).join('')||'<tr><td colspan="8" style="color:#64748b">No hay colegios con ese nombre.</td></tr>'}
   </tbody></table></div></div>`}
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

/* ---------- Datos Saber 11 (ICFES): carga de resultados agregados por colegio ---------- */
const PERS=['20214','20231','20234','20241','20243','20251','20253'];
Z.ic={log:[],busy:false};
const logI=t=>{Z.ic.log.push(t);render()};
async function enviarPeriodo(per,rows){
  const r=await sb.functions.invoke('saber-ingest',{body:{periodo:per,rows}});
  if(r.error){let m=r.error.message;try{const j=await r.error.context.json();m=j.error||m}catch(x){}throw new Error(m)}
  return r.data}
async function cargarIncluidos(){
  if(Z.ic.busy)return;Z.ic.busy=true;Z.ic.log=[];render();
  for(const p of PERS){
    try{logI('⏳ '+p+': leyendo…');const f=await fetch('saber_'+p+'.json?v='+Date.now());if(!f.ok)throw new Error('no está el archivo saber_'+p+'.json en la página');
      const rows=await f.json();const d=await enviarPeriodo(p,rows);Z.ic.log[Z.ic.log.length-1]='✅ '+p+': '+d.colegios+' colegios guardados'+(d.sinMapa?' ('+d.sinMapa+' filas sin código conocido)':'');render()}
    catch(x){Z.ic.log[Z.ic.log.length-1]='⚠️ '+p+': '+(x.message||x);render()}
  }
  Z.ic.busy=false;render()}
async function cargarExcel(files){
  if(Z.ic.busy||!files||!files.length)return;Z.ic.busy=true;Z.ic.log=[];render();
  try{if(typeof XLSX==='undefined')await loadScript(LIB.xlsx)}catch(x){Z.ic.busy=false;return err(x)}
  for(const f of files){
    try{logI('⏳ '+f.name+': leyendo…');const wb=XLSX.read(await f.arrayBuffer(),{type:'array'});const ws=wb.Sheets[wb.SheetNames[0]];
      const A=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});const hi=A.findIndex(r=>String(r[0]).trim()==='CODINST');if(hi<0)throw new Error('no parece un archivo de resultados agregados del ICFES');
      const H=A[hi].map(c=>String(c).trim()),ix=n=>H.indexOf(n);const need=['CODINST','NOMBREINSTITUCION','NOMBREMUNICIPIO','DEPARTAMENTO','NATURALEZA','EVALUADO','PROMLECTURACRITICA','PROMMATEMATICA','PROMSOCIALESYCIUDADANAS','PROMCIENCIASNATURALES','PROMINGLES','PERIODO'];
      for(const n of need)if(ix(n)<0)throw new Error('falta la columna '+n);
      const por={};
      for(const r of A.slice(hi+1)){if(!r[0])continue;const per=String(r[ix('PERIODO')]).trim();if(!/^\d{5}$/.test(per))continue;
        (por[per]=por[per]||[]).push([String(r[0]),ix('CODIGODANE_SEDE')>=0?String(r[ix('CODIGODANE_SEDE')]):'',r[ix('NOMBREINSTITUCION')],r[ix('NOMBREMUNICIPIO')],r[ix('DEPARTAMENTO')],r[ix('NATURALEZA')],r[ix('EVALUADO')],r[ix('PROMLECTURACRITICA')],r[ix('PROMMATEMATICA')],r[ix('PROMSOCIALESYCIUDADANAS')],r[ix('PROMCIENCIASNATURALES')],r[ix('PROMINGLES')]])}
      const ps=Object.keys(por);if(!ps.length)throw new Error('no encontré el periodo en el archivo');
      let tot=0;for(const p of ps){const d=await enviarPeriodo(p,por[p]);tot+=d.colegios}
      Z.ic.log[Z.ic.log.length-1]='✅ '+f.name+' ('+ps.join(', ')+'): '+tot+' colegios guardados';render()}
    catch(x){Z.ic.log[Z.ic.log.length-1]='⚠️ '+f.name+': '+(x.message||x);render()}
  }
  Z.ic.busy=false;render()}

/* --- una sola institución: se escriben los promedios que trae su reporte del ICFES --- */
Z.ic.m={deptos:null,mcpios:[],cols:[],dep:'',mun:'',dane:'',nom:'',anio:new Date().getFullYear(),cal:'A',ev:'',lec:'',mat:'',soc:'',nat:'',ing:'',danex:''};
const M0=()=>Z.ic.m;
async function mInit(){const m=M0();if(m.deptos)return;try{const r=await sb.rpc('saber_deptos');m.deptos=r.data||[]}catch(x){m.deptos=[]}render()}
async function mDep(v){const m=M0();m.dep=v;m.mun='';m.dane='';m.mcpios=[];m.cols=[];if(v){const r=await sb.rpc('saber_mcpios',{p_depto:v});m.mcpios=r.data||[]}render()}
async function mMun(v){const m=M0();m.mun=v;m.dane='';m.cols=[];if(v){const r=await sb.rpc('saber_colegios',{p_depto:m.dep,p_mcpio:v,p_cal:null});m.cols=r.data||[]}render()}
function mCol(v){const m=M0();m.dane=v;const c=m.cols.find(x=>x.dane===v);m.nom=c?c.nombre:'';render()}
function mSet(k,v){M0()[k]=v}
async function mGuardar(){
  const m=M0(),dane=(m.danex||'').replace(/\D/g,'')||m.dane;
  if(!dane)return toast('⚠️','Elige el colegio o escribe su código DANE','');
  if(!m.dep||!m.mun)return toast('⚠️','Elige departamento y municipio','');
  const n=x=>{const v=String(x).replace(',','.').trim();return v===''?null:Number(v)};
  const ev=n(m.ev);if(!ev||ev<1)return toast('⚠️','Escribe cuántos estudiantes se evaluaron','');
  const pr=[n(m.lec),n(m.mat),n(m.soc),n(m.nat),n(m.ing)];
  if(pr.some(x=>x==null||x<0||x>100))return toast('⚠️','Revisa los promedios','Son 5 números entre 0 y 100.');
  const per=String(m.anio)+(m.cal==='B'?'1':'3');
  try{const d=await enviarPeriodo(per,[['',dane,m.nom||('Institución '+dane),m.mun,m.dep,'',ev,...pr]]);
    toast('✅','Guardado',(m.nom||dane)+' · '+m.anio+' calendario '+m.cal);Z.ic.log=['✅ '+(m.nom||dane)+' · '+m.anio+' · calendario '+m.cal+' guardado']}catch(x){err(x)}render()}
function vUna(){const m=M0();if(!m.deptos){mInit();return''}
  const sel=(lab,opts,val,fn)=>`<label style="font-size:12px;font-weight:700;display:block">${lab}<select onchange="AUD.${fn}(this.value)" style="display:block;width:100%;margin-top:3px;border:1.5px solid #cbd5e1;border-radius:9px;padding:8px;font-weight:400;background:#fff"><option value="">Elige…</option>${opts.map(o=>`<option value="${e(o[0])}" ${o[0]===val?'selected':''}>${e(o[1])}</option>`).join('')}</select></label>`;
  const num=(lab,k)=>`<label style="font-size:12px;font-weight:700">${lab}<input value="${e(m[k])}" oninput="AUD.mSet('${k}',this.value)" inputmode="decimal" style="display:block;width:100%;margin-top:3px;border:1.5px solid #cbd5e1;border-radius:9px;padding:8px;font-weight:400"></label>`;
  const yrs=[];for(let a=new Date().getFullYear()+1;a>=2014;a--)yrs.push(a);
  return`<div style="border:1px solid #e2e8f0;border-radius:12px;padding:14px"><b>3) Cargar los resultados de UNA institución</b>
   <p style="font-size:12px;color:#64748b;margin:4px 0 8px">Para cuando el ICFES ya entregó el reporte del colegio pero todavía no publica el archivo nacional (por ejemplo 2026). Escribe los promedios que trae el reporte de la institución.</p>
   <div style="display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
    ${sel('Departamento',m.deptos.map(d=>[d,d]),m.dep,'mDep')}${sel('Municipio',m.mcpios.map(d=>[d,d]),m.mun,'mMun')}${sel('Colegio',m.cols.map(c=>[c.dane,c.nombre]),m.dane,'mCol')}
    <label style="font-size:12px;font-weight:700">…o escribe su código DANE<input value="${e(m.danex)}" oninput="AUD.mSet('danex',this.value)" placeholder="12 dígitos" style="display:block;width:100%;margin-top:3px;border:1.5px solid #cbd5e1;border-radius:9px;padding:8px;font-weight:400"></label>
    ${m.danex?`<label style="font-size:12px;font-weight:700">Nombre del colegio<input value="${e(m.nom)}" oninput="AUD.mSet('nom',this.value)" style="display:block;width:100%;margin-top:3px;border:1.5px solid #cbd5e1;border-radius:9px;padding:8px;font-weight:400"></label>`:''}
    <label style="font-size:12px;font-weight:700">Año<select onchange="AUD.mSet('anio',this.value)" style="display:block;width:100%;margin-top:3px;border:1.5px solid #cbd5e1;border-radius:9px;padding:8px;background:#fff">${yrs.map(a=>`<option ${String(a)===String(m.anio)?'selected':''}>${a}</option>`).join('')}</select></label>
    <label style="font-size:12px;font-weight:700">Calendario<select onchange="AUD.mSet('cal',this.value)" style="display:block;width:100%;margin-top:3px;border:1.5px solid #cbd5e1;border-radius:9px;padding:8px;background:#fff"><option value="A" ${m.cal==='A'?'selected':''}>A</option><option value="B" ${m.cal==='B'?'selected':''}>B</option></select></label>
    ${num('Estudiantes evaluados','ev')}${num('Lectura Crítica (0–100)','lec')}${num('Matemáticas (0–100)','mat')}${num('Sociales y Ciudadanas (0–100)','soc')}${num('Ciencias Naturales (0–100)','nat')}${num('Inglés (0–100)','ing')}
   </div>
   <div style="margin-top:10px"><button onclick="AUD.mGuardar()" style="background:#16a34a;color:#fff;padding:10px 16px;border-radius:10px;font-weight:800">💾 Guardar esta institución</button></div>
   <p style="font-size:12px;color:#64748b;margin-top:6px">El puntaje global (0–500) lo calcula la plataforma con la fórmula del ICFES. Si ya había datos de ese colegio, año y calendario, se reemplazan.</p></div>`}
async function cargarZonas(files){
  const f=files&&files[0];if(!f||Z.ic.busy)return;Z.ic.busy=true;Z.ic.log=['⏳ '+f.name+': leyendo zonas…'];render();
  try{if(typeof XLSX==='undefined')await loadScript(LIB.xlsx);
    const wb=XLSX.read(await f.arrayBuffer(),{type:'array'});const A=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,defval:''});
    const nm=c=>String(c).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]/g,'');
    let hi=-1,id=-1,iz=-1;
    for(let i=0;i<Math.min(A.length,30)&&hi<0;i++){const H=A[i].map(nm);const a=H.findIndex(c=>/^(CODIGODANE|CODIGOESTABLECIMIENTO|CODDANE|DANE|CODIGODANEESTABLECIMIENTO|CODIGODANESEDE|CODINST)/.test(c)),b=H.findIndex(c=>c==='ZONA'||c.startsWith('ZONA'));if(a>=0&&b>=0){hi=i;id=a;iz=b}}
    if(hi<0)throw new Error('no encontré las columnas del código DANE y de ZONA');
    const rows=[];for(const r of A.slice(hi+1)){const d=String(r[id]).replace(/\D/g,''),z=nm(r[iz]);if(!d)continue;rows.push({dane:d,zona:z.startsWith('RURAL')?'Rural':z.startsWith('URBAN')?'Urbana':''})}
    let ok=0;for(let i=0;i<rows.length;i+=1000){const r=await sb.rpc('colegio_zona_bulk',{p_rows:rows.slice(i,i+1000)});if(r.error)throw r.error;ok+=r.data||0}
    Z.ic.log=['✅ '+f.name+': '+ok+' colegios con zona guardada']
  }catch(x){Z.ic.log=['⚠️ '+(x.message||x)]}
  Z.ic.busy=false;render()}
/* ---- Subir resultados de un año (con vista previa) ---- */
const NEED=['CODINST','NOMBREINSTITUCION','NOMBREMUNICIPIO','DEPARTAMENTO','NATURALEZA','EVALUADO','PROMLECTURACRITICA','PROMMATEMATICA','PROMSOCIALESYCIUDADANAS','PROMCIENCIASNATURALES','PROMINGLES'];
async function anioLeer(files){const f=files&&files[0];if(!f||Z.ic.busy)return;Z.ic.anio=+(document.getElementById('an_a')||{}).value||new Date().getFullYear();Z.ic.ap=(document.getElementById('an_c')||{}).value||'3';Z.ic.busy=true;Z.ic.prev=null;Z.ic.log=['⏳ '+f.name+': leyendo…'];render();
  try{if(typeof XLSX==='undefined')await loadScript(LIB.xlsx);
    const anio=Z.ic.anio,ap=Z.ic.ap;
    const wb=XLSX.read(await f.arrayBuffer(),{type:'array'});const ws=wb.Sheets[wb.SheetNames[0]];const A=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
    const hi=A.findIndex(r=>String(r[0]).trim()==='CODINST');if(hi<0)throw new Error('No encontré la columna CODINST en la primera hoja. Usa el Excel «Resultados agregados Saber 11» del ICFES o descarga la plantilla.');
    const H=A[hi].map(c=>String(c).trim()),ix=n=>H.indexOf(n),falta=NEED.filter(n=>ix(n)<0);if(falta.length)throw new Error('Faltan columnas: '+falta.join(', '));
    const por={},ver={};let sinPer=0;
    for(const r of A.slice(hi+1)){if(!r[0])continue;let per=ix('PERIODO')>=0?String(r[ix('PERIODO')]).trim():'';
      if(!/^\d{5}$/.test(per)){per=anio+ap;sinPer++}
      ver[per]=(ver[per]||0)+1;if(String(per).slice(0,4)!==String(anio))continue;
      (por[per]=por[per]||[]).push([String(r[0]),ix('CODIGODANE_SEDE')>=0?String(r[ix('CODIGODANE_SEDE')]):'',r[ix('NOMBREINSTITUCION')],r[ix('NOMBREMUNICIPIO')],r[ix('DEPARTAMENTO')],r[ix('NATURALEZA')],r[ix('EVALUADO')],r[ix('PROMLECTURACRITICA')],r[ix('PROMMATEMATICA')],r[ix('PROMSOCIALESYCIUDADANAS')],r[ix('PROMCIENCIASNATURALES')],r[ix('PROMINGLES')]])}
    if(!Object.keys(por).length)throw new Error('El archivo no trae datos del año '+anio+'. Trae: '+(Object.keys(ver).map(p=>p+' ('+ver[p]+' filas)').join(', ')||'ninguna fila válida')+'.');
    Z.ic.prev={archivo:f.name,por,sinPer};Z.ic.log=[]}
  catch(x){Z.ic.log=['⚠️ '+(x.message||x)]}
  Z.ic.busy=false;render()}
async function anioGuardar(){const pv=Z.ic.prev;if(!pv||Z.ic.busy)return;Z.ic.busy=true;Z.ic.log=[];render();
  try{for(const p of Object.keys(pv.por)){logI('⏳ Guardando '+p+'…');const d=await enviarPeriodo(p,pv.por[p]);Z.ic.log[Z.ic.log.length-1]='✅ '+p+': '+d.colegios+' colegios guardados'+(d.sinMapa?' ('+d.sinMapa+' sin código conocido)':'')}
    Z.ic.prev=null;const r=await sb.rpc('saber_periodos');Z.ic.lista=r.error?null:(r.data||[])}
  catch(x){Z.ic.log.push('⚠️ '+(x.message||x))}
  Z.ic.busy=false;render()}
async function anioBorrar(p){if(!confirm('¿Borrar todos los datos del periodo '+p+'? Podrás volver a subirlos.'))return;
  try{const r=await sb.rpc('saber_borrar_periodo',{p_periodo:p});if(r.error)throw r.error;toast('🗑','Periodo borrado',p+': '+r.data+' colegios');const l=await sb.rpc('saber_periodos');Z.ic.lista=l.error?null:(l.data||[]);render()}catch(x){err(x)}}
async function anioPlantilla(){try{if(typeof XLSX==='undefined')await loadScript(LIB.xlsx);const hd=NEED.concat(['PERIODO']);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([hd,['000000','COLEGIO EJEMPLO','BOGOTA D.C.','BOGOTA D.C.','OFICIAL',50,55,56,52,54,50,'20263']]),'Resultados');XLSX.writeFile(wb,'plantilla_saber_por_anio.xlsx')}catch(x){err(x)}}
function vAnio(){const ic=Z.ic,yr=new Date().getFullYear(),anios=[];for(let a=yr+1;a>=2014;a--)anios.push(a);const pv=ic.prev;
  return`<div style="border:2px solid #1e63e9;border-radius:12px;padding:14px;background:#f0f6ff"><b style="font-size:15px">📅 Subir resultados Saber de un año (Excel)</b>
   <p style="font-size:12px;color:#64748b;margin:4px 0 8px">1) Elige el año. 2) Elige el Excel. 3) Revisa la vista previa y pulsa «Guardar». Si el año ya estaba cargado, se reemplaza.</p>
   <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:end">
    <label style="font-size:12px;font-weight:700">Año<select id="an_a" style="display:block;margin-top:3px;border:1.5px solid #cbd5e1;border-radius:9px;padding:8px;background:#fff">${anios.map(a=>`<option ${a===(ic.anio||yr)?'selected':''}>${a}</option>`).join('')}</select></label>
    <label style="font-size:12px;font-weight:700">Aplicación (si el Excel no trae PERIODO)<select id="an_c" style="display:block;margin-top:3px;border:1.5px solid #cbd5e1;border-radius:9px;padding:8px;background:#fff">${['1','2','3','4'].map(a=>`<option ${a===(ic.ap||'3')?'selected':''}>${a}</option>`).join('')}</select></label>
    <label style="background:#1e63e9;color:#fff;padding:10px 16px;border-radius:10px;font-weight:800;cursor:pointer">📤 Elegir Excel<input type="file" accept=".xlsx,.xls" ${ic.busy?'disabled':''} onchange="AUD.anioLeer(this.files)" style="display:none"></label>
    <button onclick="AUD.anioPlantilla()" style="background:#475569;color:#fff;padding:10px 14px;border-radius:10px;font-weight:800">⬇️ Plantilla</button></div>
   ${pv?`<div style="margin-top:10px;background:#fff;border:1px solid #cbd5e1;border-radius:10px;padding:10px;font-size:13px"><b>Vista previa de «${e(pv.archivo)}»</b>${Object.keys(pv.por).map(p=>`<div>• Periodo <b>${p}</b>: ${pv.por[p].length} filas</div>`).join('')}${pv.sinPer?`<div style="color:#92400e">${pv.sinPer} filas no traían periodo; se usó ${ic.anio}${ic.ap}.</div>`:''}<button onclick="AUD.anioGuardar()" ${ic.busy?'disabled':''} style="margin-top:8px;background:#16a34a;color:#fff;padding:9px 16px;border-radius:10px;font-weight:800">💾 Guardar estos datos</button></div>`:''}
   <div style="margin-top:12px"><b style="font-size:13px">Años ya cargados</b>${ic.lista?`<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${ic.lista.length?ic.lista.map(x=>`<span style="background:#fff;border:1px solid #cbd5e1;border-radius:999px;padding:4px 10px;font-size:12px"><b>${e(x.periodo)}</b> · ${x.colegios} colegios <button onclick="AUD.anioBorrar('${e(x.periodo)}')" title="Borrar este periodo" style="color:#dc2626">✕</button></span>`).join(''):'<span style="font-size:12px;color:#64748b">Aún no hay años cargados.</span>'}</div>`:'<div style="font-size:12px;color:#64748b">No se pudo leer la lista.</div>'}</div></div>`}
function vIcfes(){return`<div class="aic-card" style="padding:18px"><h3 style="font-weight:800;font-size:17px">📥 Datos Saber 11 del ICFES</h3>
  <p style="font-size:13px;color:#64748b;margin:4px 0 12px">Estos datos alimentan «Crear análisis de mi institución» para todos los colegios. Se cargan una sola vez por año.</p>
  <div style="display:grid;gap:14px">
   ${vAnio()}
   <div style="border:1px solid #e2e8f0;border-radius:12px;padding:14px"><b>1) Cargar los años que ya vienen incluidos (2021, 2023, 2024 y 2025)</b>
    <div style="margin-top:8px"><button onclick="AUD.cargarIncluidos()" ${Z.ic.busy?'disabled':''} style="background:#1e63e9;color:#fff;padding:10px 16px;border-radius:10px;font-weight:800">${Z.ic.busy?'⏳ Cargando…':'📥 Cargar ahora'}</button></div></div>
   <div style="border:1px solid #e2e8f0;border-radius:12px;padding:14px"><b>2) Cargar un año nuevo (por ejemplo 2026)</b>
    <p style="font-size:12px;color:#64748b;margin:4px 0 8px">Elige el archivo Excel «Resultados agregados Saber 11» que publica el ICFES. Puedes elegir varios a la vez.</p>
    <input type="file" accept=".xlsx" multiple ${Z.ic.busy?'disabled':''} onchange="AUD.cargarExcel(this.files)" style="font-size:13px"></div>
   <div style="border:1px solid #e2e8f0;border-radius:12px;padding:14px"><b>3) Zona rural / urbana de los colegios</b>
    <p style="font-size:12px;color:#64748b;margin:4px 0 8px">Sube un Excel con el código DANE y la ZONA (Urbana/Rural) de los establecimientos (por ejemplo, el directorio de establecimientos educativos del MEN). Los colegios también pueden marcarla ellos mismos.</p>
    <input type="file" accept=".xlsx,.xls,.csv" ${Z.ic.busy?'disabled':''} onchange="AUD.cargarZonas(this.files)" style="font-size:13px"></div>
   ${vUna()}
  </div>
  ${Z.ic.log.length?`<div style="margin-top:12px;font-size:13px;line-height:1.7">${Z.ic.log.map(l=>'<div>'+e(l)+'</div>').join('')}</div>`:''}</div>`}
function view(){return tabs()+(Z.sub==='panel'?vPanel():Z.sub==='colegios'?vColegios():Z.sub==='cuentas'?vCuentas():Z.sub==='revision'?vRevision():Z.sub==='errores'?vErrores():Z.sub==='informe'?vInforme():Z.sub==='susc'?(window.SUBA?SUBA.view():''):Z.sub==='icfes'?vIcfes():vSalud())}
const api={anioLeer,anioGuardar,anioBorrar,anioPlantilla,mDep,mMun,mCol,mSet,mGuardar,cargarIncluidos,cargarExcel,cargarZonas,load,view,revisar,
  filtro(v){Z.filtro=v;render()},
  async estado(id,est){const rsp=(document.getElementById('rsp_'+id)||{}).value||null;const r=await sb.from('soporte_reportes').update({estado:est,respuesta:rsp,updated_at:new Date().toISOString()}).eq('id',id);if(r.error)return err(r.error);toast('✅','Reporte actualizado','');await cargar();render()},
  async entrarRep(id,nom,rol){const m={Docente:'prof',Rector:'rector',Coordinador:'coordinador'};await loadScript('vercomo.js?v=6');return VC.entrar(id,nom,m[rol]||'prof','aud')},
  async limpiarErrores(){if(!confirm('¿Borrar la lista de errores?'))return;const r=await sb.from('errores_cliente').delete().gte('id',0);if(r.error)return err(r.error);await cargar();render()},
  async ir(k){Z.sub=k;try{await cargar();render()}catch(x){err(x)}},
  buscar(v){Z.q=v;Z.max=60;render();const i=document.getElementById('aud_q');if(i){i.focus();i.setSelectionRange(v.length,v.length)}},
  rol(v){Z.rol=v;Z.max=60;render()},mas(){Z.max+=200;render()},
  async entrar(id){const x=(Z.cuentas||[]).find(c=>c.id===id);if(!x)return;await loadScript('vercomo.js?v=6');return VC.entrar(id,x.full_name||'Cuenta',x.role,'aud')},
  async borrar(id){const x=(Z.cuentas||[]).find(c=>c.id===id);if(!x)return;
    if(!confirm('¿Borrar la cuenta de '+(x.full_name||'esta persona')+' ('+(RN[x.role]||x.role)+')?\n\nSe borra con toda su información. No se puede deshacer.'))return;
    const r=await sb.rpc('admin_borrar_cuenta',{p_id:id});if(r.error)return err(r.error);
    toast('🗑','Cuenta borrada',x.full_name||'');Z.r=null;await cargar();render()},
  bcol(v){Z.qc=v;render();const i=document.getElementById('aud_qc');if(i){i.focus();i.setSelectionRange(v.length,v.length)}},
  abrirCol(id){Z.abre=Z.abre===id?null:id;render()},
  async act(tipo,id,activar){
    const x=tipo==='colegio'?(Z.colMap||{})[id]:(Z.cuentas||[]).find(c=>c.id===id);const nm=x?(x.nombre||x.full_name):'';
    if(!activar&&!confirm('¿Desactivar '+(tipo==='colegio'?'el colegio ':'la cuenta de ')+nm+'?\n\n'+(tipo==='colegio'?'Nadie de ese colegio podrá entrar hasta que lo actives.':'Esa persona no podrá entrar hasta que la actives.')))return;
    const r=await sb.rpc('admin_set_activo',{p_tipo:tipo,p_id:String(id),p_activo:!!activar});if(r.error)return err(r.error);
    toast(activar?'✅':'⏸',activar?'Activado':'Desactivado',nm||'');Z.cuentas=null;await cargar();render()},
  async salud(){try{await cargar();render();toast('🩺','Revisión lista','')}catch(x){err(x)}},
  async corregir(k){if(!confirm('¿Aplicar la corrección automática?'))return;const r=await sb.rpc('auditor_corregir',{p_clave:k});if(r.error)return err(r.error);toast('🔧','Corregido',r.data+' fila(s) arregladas');await cargar();render()}
};
return api})();
