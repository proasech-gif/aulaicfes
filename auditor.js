/* AULA360 — Entorno del administrador como AUDITOR de toda la plataforma:
   Panel (vista general) · Cuentas (entrar a cualquier cuenta / borrar) · Salud (revisar y corregir). */
window.AUD=(function(){
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RN={rector:'Rector',coordinador:'Coordinador',prof:'Docente',est:'Estudiante'};
let Z={sub:'panel',r:null,salud:null,cuentas:null,rol:'todos',q:'',max:60};
const fh=d=>d?new Date(d).toLocaleString('es-CO',{dateStyle:'medium',timeStyle:'short'}):'—';
async function cargar(){
  if(Z.sub==='panel'||!Z.r){const r=await sb.rpc('auditor_resumen');if(r.error)throw r.error;Z.r=r.data}
  if(Z.sub==='salud'){const r=await sb.rpc('auditor_salud');if(r.error)throw r.error;Z.salud=r.data||[]}
  if(Z.sub==='cuentas'){
    const r=await sb.from('profiles').select('id,full_name,role,email,school_other,teacher_status,is_admin,document').order('full_name').limit(3000);
    if(r.error)throw r.error;Z.cuentas=r.data||[]}
}
async function load(){await cargar()}
const kpi=(t,v,c,sub)=>`<div class="aic-kpi"><div><small>${t}</small><strong>${v}</strong>${sub?`<span>${sub}</span>`:''}</div></div>`;
function tabs(){
  const T=[['panel','📊 Panel general'],['cuentas','👥 Cuentas'],['salud','🩺 Salud de la plataforma']];
  return`<nav class="aic-tabs" style="margin-bottom:14px">${T.map(([k,l])=>`<button onclick="AUD.ir('${k}')" class="${Z.sub===k?'on':''}">${l}</button>`).join('')}</nav>`}
function vPanel(){
  const d=Z.r;if(!d)return'<div class="aic-card" style="padding:16px">Cargando…</div>';
  const c=d.cuentas||{},p=d.preguntas||{};
  const cu=Object.entries(c).map(([k,n])=>`<div class="aic-row" style="display:flex;justify-content:space-between"><span>${e(k)}</span><b>${n}</b></div>`).join('');
  return`${d.pendientes?`<div class="aic-card" style="padding:14px;margin-bottom:12px;border-left:5px solid #f59e0b">⏳ Hay <b>${d.pendientes}</b> cuenta(s) esperando aprobación. <button onclick="go('doc')" class="aic-link">Revisar solicitudes</button></div>`:''}
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
function view(){return tabs()+(Z.sub==='panel'?vPanel():Z.sub==='cuentas'?vCuentas():vSalud())}
const api={load,view,
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
