/* AULA360 — Soporte técnico: formulario para docentes, coordinadores y rectores. Llega al auditor en "Informe cliente". */
window.SUP=(function(){
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let F={asunto:'',donde:'',falla:'',tel:'',env:false,mis:null};
const RN={rector:'Rector',coordinador:'Coordinador',prof:'Docente',est:'Estudiante'};
const DONDE=['No sé / otro','Entrar o registrarme','Cursos y estudiantes','Exámenes / simulacros','Imprimir o calificar','Informes y periodos','Planeadores o IA','Mensajes y permisos','Asistencia u horarios','Pruebas Saber reales','Mi perfil / foto','Hoja con membrete'];
async function load(){const r=await sb.from('soporte_reportes').select('id,asunto,estado,respuesta,created_at').eq('user_id',M.id).order('created_at',{ascending:false}).limit(20);F.mis=r.data||[]}
function view(){
  const est={nuevo:'Enviado',en_revision:'En revisión',resuelto:'Resuelto ✅'};
  return`<div class="aic-card" style="padding:18px;max-width:760px"><h2 style="font-weight:800;font-size:20px">🛠️ Soporte técnico</h2>
  <p style="font-size:13px;color:#64748b;margin:6px 0 14px">¿Algo no funciona en la página? Cuéntanos y le llegará al auditor, con tu nombre y tu colegio.</p>
  <label style="display:block;font-size:13px;font-weight:700;margin-bottom:10px">¿Dónde ocurrió?<select id="sup_donde" style="display:block;width:100%;padding:10px;margin-top:4px">${DONDE.map(d=>`<option ${F.donde===d?'selected':''}>${d}</option>`).join('')}</select></label>
  <label style="display:block;font-size:13px;font-weight:700;margin-bottom:10px">Asunto (en pocas palabras)<input id="sup_asunto" value="${e(F.asunto)}" maxlength="120" style="display:block;width:100%;padding:10px;margin-top:4px" placeholder="Ej.: No me deja imprimir el examen"></label>
  <label style="display:block;font-size:13px;font-weight:700;margin-bottom:10px">¿Qué falla se presentó?<textarea id="sup_falla" rows="6" maxlength="3000" style="display:block;width:100%;padding:10px;margin-top:4px" placeholder="Qué estabas haciendo, qué botón pulsaste y qué pasó (mensaje en pantalla, si lo hubo).">${e(F.falla)}</textarea></label>
  <label style="display:block;font-size:13px;font-weight:700;margin-bottom:14px">Teléfono o WhatsApp (opcional)<input id="sup_tel" value="${e(F.tel)}" maxlength="30" style="display:block;width:100%;padding:10px;margin-top:4px"></label>
  <button onclick="SUP.enviar()" ${F.env?'disabled':''} style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:12px;font-weight:800">📨 Enviar a soporte</button></div>
  ${F.mis&&F.mis.length?`<div class="aic-card" style="padding:16px;max-width:760px;margin-top:12px"><h3 style="font-weight:800;margin-bottom:8px">Mis reportes</h3>${F.mis.map(x=>`<div class="aic-row" style="padding:8px 0;border-bottom:1px solid #e5e7eb"><b>${e(x.asunto)}</b> <span style="font-size:12px;color:#64748b">· ${new Date(x.created_at).toLocaleDateString('es-CO')} · ${est[x.estado]||x.estado}</span>${x.respuesta?`<div style="font-size:13px;background:#f0fdf4;border-radius:8px;padding:8px;margin-top:4px">💬 ${e(x.respuesta)}</div>`:''}</div>`).join('')}</div>`:''}`}
function leer(){F.donde=document.getElementById('sup_donde')?.value||F.donde;F.asunto=document.getElementById('sup_asunto')?.value||'';F.falla=document.getElementById('sup_falla')?.value||'';F.tel=document.getElementById('sup_tel')?.value||''}
async function enviar(){
  leer();
  if(F.asunto.trim().length<4)return toast('⚠️','Falta el asunto','Escribe en pocas palabras qué pasó.');
  if(F.falla.trim().length<10)return toast('⚠️','Cuéntanos más','Describe la falla con un poco más de detalle.');
  F.env=true;render();
  const col=M.school_name||M.school_other||'';
  const row={user_id:M.id,nombre:M.full_name||'',rol:RN[M.role]||M.role||'',email:(D&&D.email)||M.email||'',colegio:col,telefono:F.tel.trim()||null,asunto:F.asunto.trim(),falla:F.falla.trim(),donde:F.donde||null,navegador:navigator.userAgent.slice(0,200),pagina:location.pathname+' · '+(typeof tab!=='undefined'?tab:'')};
  const r=await sb.from('soporte_reportes').insert(row);F.env=false;
  if(r.error){render();return err(r.error)}
  F.asunto=F.falla='';await load();render();toast('✅','Enviado a soporte','El auditor ya lo puede ver. Gracias por avisar.');
}
return{load,view,enviar}})();
