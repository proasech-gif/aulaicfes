/* AULA360 — Revisión de docentes (auditoría del rector y del coordinador)
   Eligen un docente y una fecha, ven sus documentos (planeador, observador, ficha, plan de área),
   los guardan en su entorno, los descargan en PDF o le dejan una nota al docente. No crean ni suben nada. */
window.REV=(function(){
const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hoy=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Bogota'});
const mas=(f,n)=>{const d=new Date(f+'T12:00:00');d.setDate(d.getDate()+n);return d.toLocaleDateString('en-CA')};
const fF=d=>d?new Date(String(d).slice(0,10)+'T12:00:00').toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'}):'';
const TABS0=[['planeador','📒 Planeadores'],['observador','📘 Observador'],['ficha','📑 Ficha de seguimiento'],['plan','🗂️ Plan de área'],['asist','✋ Asistencias'],['guardados','💾 Guardados en mi entorno']];
const ACT=[['cursos','📚 Cursos'],['evaluacion','📝 Evaluación'],['labs','🧪 Laboratorios'],['imprimir','🖨️ Impresiones'],['trabajos','📤 Trabajos'],['talleres','🛠️ Talleres'],['claseia','🤖 Clase con IA'],['aula','🎓 Clases en aula'],['reuniones','📹 Reuniones'],['registro','🗃️ Registro de documentos']];
const AN={};ACT.forEach(x=>AN[x[0]]=x[1]);
const NOM={planeador:'Planeador',observador:'Observador del estudiante',ficha:'Ficha de seguimiento',plan:'Plan de área',asistencia:'Asistencia'};
const COD={planeador:'PLA',observador:'OBS',ficha:'FIC',plan:'PLA',asistencia:'ASI'};
const TABS=()=>TABS0.slice(0,5).concat([['horario','🗓 Horario']],ACT,[TABS0[5]]);
let Z={docs:[],doc:'',tab:'planeador',d:mas(hoy(),-30),h:hoy(),rows:[],gu:[],busy:false,ok:false};
const R=()=>render();
const btn=c=>`style="background:${c};color:#fff;padding:7px 11px;border-radius:9px;font-weight:700;font-size:13px"`;
async function cargaDocs(){let r=await sb.rpc('rev_personas');if(r.error)r=await sb.rpc('asistencia_docentes');if(r.error)throw r.error;Z.docs=r.data||[]}
const ROL=x=>x.role==='coordinador'?' (Coordinador)':'';
async function load(){
  await cargaDocs();await cargaGu();
  if(Z.doc)await buscar(true);
  Z.ok=true;
}
async function cargaGu(){const r=await sb.from('doc_guardados').select('id,docente_nombre,tipo,titulo,fecha,ref_path,created_at').order('created_at',{ascending:false}).limit(300);Z.gu=r.data||[]}
const nomDoc=()=>((Z.docs.find(x=>x.id===Z.doc)||{}).full_name)||'';
async function buscar(quiet){
  Z.rows=[];if(!Z.doc||['asist','guardados'].includes(Z.tab)){if(!quiet)R();return}
  if(Z.tab==='horario'){Z.busy=true;R();try{await loadScript('horarios.js?v=5');await HZUI.cargaAud()}catch(x){err(x)}Z.busy=false;R();return}
  Z.busy=true;R();
  try{
    if(AN[Z.tab]){const r=await sb.rpc('rev_actividad',{p_persona:Z.doc,p_seccion:Z.tab,p_desde:Z.d,p_hasta:Z.h});if(r.error)throw r.error;Z.rows=r.data||[]}else
    if(Z.tab==='planeador'){const r=await sb.from('planeador_diario').select('*').eq('docente_id',Z.doc).gte('fecha',Z.d).lte('fecha',Z.h).order('fecha',{ascending:false}).limit(300);if(r.error)throw r.error;Z.rows=r.data||[]}
    else if(Z.tab==='observador'||Z.tab==='ficha'){const r=await sb.from('obs_registros').select('*').eq('creado_por',Z.doc).eq('clase',Z.tab).gte('updated_at',Z.d+'T00:00:00-05:00').lt('updated_at',mas(Z.h,1)+'T00:00:00-05:00').order('updated_at',{ascending:false}).limit(300);if(r.error)throw r.error;Z.rows=r.data||[]}
    else if(Z.tab==='plan'){const r=await sb.from('planes_area').select('*').eq('docente_id',Z.doc).order('anio',{ascending:false}).order('grado');if(r.error)throw r.error;Z.rows=r.data||[]}
  }catch(x){err(x)}
  Z.busy=false;R();
}
/* ---------- pantalla ---------- */
function tabs(){return`<div style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0">${TABS().map(x=>`<button onclick="REV.tab('${x[0]}')" style="padding:9px 14px;border-radius:10px;font-weight:800;border:1.5px solid ${Z.tab===x[0]?'#1e63e9':'#cbd5e1'};background:${Z.tab===x[0]?'#e8f1ff':'#fff'};color:${Z.tab===x[0]?'#1e3a8a':'#334155'}">${x[1]}</button>`).join('')}</div>`}
function filtros(){
  const dt=(k,l)=>`<label style="font-size:12px;font-weight:700">${l}<br><input type="date" value="${Z[k]}" onchange="REV.f('${k}',this.value)" style="border:1px solid #cbd5e1;border-radius:8px;padding:8px"></label>`;
  return`<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:end"><label style="font-size:12px;font-weight:700">Persona a revisar<br><select onchange="REV.f('doc',this.value)" style="border:1px solid #cbd5e1;border-radius:8px;padding:9px;min-width:230px"><option value="">Elige una persona…</option>${Z.docs.map(x=>`<option value="${x.id}" ${x.id===Z.doc?'selected':''}>${e(x.full_name)}${ROL(x)}</option>`).join('')}</select></label>
  ${['plan'].includes(Z.tab)?'':dt('d','Desde')+dt('h','Hasta')}</div>`}
function acciones(i,ref){return`<button onclick="REV.ver(${i})" ${btn('#1e63e9')}>👁 Ver</button> <button onclick="REV.pdf(${i})" ${btn('#16a34a')}>🖨️ PDF</button> <button onclick="REV.guardar(${i})" ${btn('#0f766e')}>💾 Guardar</button> <button onclick="REV.nota(${i})" ${btn('#7c3aed')}>📝 Nota</button>`}
function acciones2(i){return`<button onclick="REV.ver(${i})" ${btn('#1e63e9')}>👁 Vista previa</button> <button onclick="REV.pdf(${i})" ${btn('#16a34a')}>🖨️ Imprimir</button> <button onclick="REV.nota(${i})" ${btn('#7c3aed')}>📝 Nota</button>`}
function actHtml(x){const d=x.detalle||{};const f=v=>/^\d{4}-\d\d-\d\dT/.test(String(v))?new Date(v).toLocaleString('es-CO',{timeZone:'America/Bogota'}):v;
  return`<div style="font-family:Arial,sans-serif"><h2 style="margin:0 0 4px">${e(x.titulo||'')}</h2><p style="color:#475569;margin:0 0 10px">${e(AN[Z.tab]||'')} · ${e(nomDoc())}${x.fecha?' · '+e(fF(x.fecha)):''}${x.estado?' · '+e(x.estado):''}</p><table style="border-collapse:collapse;width:100%">${Object.keys(d).filter(k=>d[k]!=null&&d[k]!=='').map(k=>`<tr><td style="border:1px solid #94a3b8;padding:6px 8px;font-weight:700;width:34%">${e(k)}</td><td style="border:1px solid #94a3b8;padding:6px 8px">${e(f(d[k]))}</td></tr>`).join('')}</table></div>`}
function lista(){
  if(Z.doc&&!Z.busy&&Z.tab==='horario'&&window.HZUI)return HZUI.docHtml(Z.doc);
  if(Z.doc&&!Z.busy&&AN[Z.tab]){if(!Z.rows.length)return'<p style="font-size:14px;color:#b45309;margin-top:14px">Esta persona no tiene registros en esta sección en esas fechas.</p>';
    return`<div class="aic-table-wrap" style="margin-top:12px"><table style="min-width:640px"><thead><tr><th>FECHA</th><th>TÍTULO</th><th>ESTADO</th><th></th></tr></thead><tbody>${Z.rows.map((x,i)=>`<tr><td>${fF(x.fecha)}</td><td>${e(x.titulo||'')}</td><td>${e(x.estado||'')}</td><td>${acciones2(i)}</td></tr>`).join('')}</tbody></table></div>`}
  if(!Z.doc)return'<p style="font-size:14px;color:#64748b;margin-top:14px">Elige un docente para ver sus documentos.</p>';
  if(Z.busy)return'<p style="margin-top:14px">⏳ Buscando…</p>';
  if(Z.tab==='asist')return`<div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap"><button onclick="go('asistencias')" ${btn('#1e63e9')}>✋ Asistencias a clase de los docentes</button><button onclick="go('asis')" ${btn('#0f766e')}>🕘 Llegada y salida de docentes</button></div><p style="font-size:12.5px;color:#64748b;margin-top:6px">Allí eliges la fecha, la ves, la descargas en PDF o Excel y la guardas en tu entorno.</p>`;
  if(!Z.rows.length)return'<p style="font-size:14px;color:#b45309;margin-top:14px">Este docente no tiene documentos de este tipo en esas fechas.</p>';
  let h='';
  if(Z.tab==='planeador')h=Z.rows.map((x,i)=>`<tr><td>${fF(x.fecha)}</td><td>${e(x.asignatura||'')}</td><td>${e(x.grado||'')} ${e(x.grupo||'')}</td><td>${x.estado==='borrador'?'📝 Borrador':x.estado==='revisado'?'✅ Revisado':'📤 Enviado'}</td><td>${acciones(i)}</td></tr>`).join('');
  else if(Z.tab==='plan')h=Z.rows.map((x,i)=>`<tr><td>${x.anio}</td><td>${e(x.asignatura||'')}</td><td>${e(x.grado||'')}</td><td>${e(x.archivo_nombre||'sin archivo')}</td><td>${x.archivo_path?`<button onclick="REV.bajar(${i})" ${btn('#1e63e9')}>⬇ Descargar</button> `:''}<button onclick="REV.guardar(${i})" ${btn('#0f766e')}>💾 Guardar</button> <button onclick="REV.nota(${i})" ${btn('#7c3aed')}>📝 Nota</button></td></tr>`).join('');
  else h=Z.rows.map((x,i)=>`<tr><td>${fF(x.updated_at)}</td><td>${e(x.est_nombre)}</td><td>${e(x.grado||'')} ${e(x.grupo||'')}</td><td>${x.estado==='enviado'?'📤 Enviado':'📝 Borrador'}</td><td>${acciones(i)}</td></tr>`).join('');
  const th=Z.tab==='planeador'?'<th>FECHA</th><th>ASIGNATURA</th><th>GRADO</th><th>ESTADO</th>':Z.tab==='plan'?'<th>AÑO</th><th>ASIGNATURA</th><th>GRADO</th><th>ARCHIVO</th>':'<th>FECHA</th><th>ESTUDIANTE</th><th>GRUPO</th><th>ESTADO</th>';
  return`<div class="aic-table-wrap" style="margin-top:12px"><table style="min-width:640px"><thead><tr>${th}<th></th></tr></thead><tbody>${h}</tbody></table></div>`}
function guardados(){
  if(!Z.gu.length)return'<p style="font-size:14px;color:#64748b;margin-top:14px">Aún no has guardado documentos. Usa «💾 Guardar» al revisar un documento.</p>';
  return`<div class="aic-table-wrap" style="margin-top:12px"><table style="min-width:640px"><thead><tr><th>GUARDADO</th><th>DOCENTE</th><th>DOCUMENTO</th><th></th></tr></thead><tbody>${Z.gu.map((x,i)=>`<tr><td>${fF(x.created_at)}</td><td>${e(x.docente_nombre||'')}</td><td>${e(x.titulo)}</td><td><button onclick="REV.verG(${i})" ${btn('#1e63e9')}>👁 Ver</button> <button onclick="REV.pdfG(${i})" ${btn('#16a34a')}>🖨️ PDF</button> <button onclick="REV.borrarG(${i})" ${btn('#b91c1c')}>🗑</button></td></tr>`).join('')}</tbody></table></div>`}
function view(){
  return`<div class="aic-card" style="padding:18px"><h2 style="font-weight:800;font-size:19px">🔎 Revisión de coordinador y docentes</h2>
  <p style="font-size:13px;color:#64748b;margin:4px 0 8px">Aquí solo se audita: elige una persona y la fecha, mira lo que ha hecho en cada sección (sin entrar a su entorno), guárdalos en tu entorno, descárgalos en PDF o déjale una nota.</p>
  ${filtros()}${tabs()}${Z.tab==='guardados'?guardados():lista()}</div>`}
/* ---------- documentos ---------- */
async function htmlDe(x){
  if(AN[Z.tab])return actHtml(x);
  if(Z.tab==='planeador'){if(!window.PLN)await loadScript('planeador.js?v=7');return PLN.htmlDe(x)}
  if(Z.tab==='observador'||Z.tab==='ficha'){if(!window.OBS)await loadScript('observador.js?v=2');await OBS.load(Z.tab==='ficha'?'fseg':'obsv');return OBS.docDe(x)}
  return ''}
const titulo=x=>{const d=nomDoc();if(AN[Z.tab])return`${AN[Z.tab].replace(/^\S+\s/,'')} · ${d} · ${x.titulo||''}`;return Z.tab==='planeador'?`Planeador · ${d} · ${fF(x.fecha)} · ${x.asignatura||''}`:Z.tab==='plan'?`Plan de área · ${d} · ${x.asignatura||''} ${x.grado||''} · ${x.anio}`:`${NOM[Z.tab]} · ${d} · ${x.est_nombre||''}`};
const fechaDe=x=>String(x.fecha||x.updated_at||'').slice(0,10)||null;
function modal(h){document.getElementById('rev-m')?.remove();const m=document.createElement('div');m.id='rev-m';m.style.cssText='position:fixed;inset:0;background:rgba(15,23,42,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:12px';m.innerHTML=h;document.body.appendChild(m)}
const cerrar=()=>document.getElementById('rev-m')?.remove();
async function ver(i){const x=Z.rows[i];if(!x)return;try{const h=await htmlDe(x);modal(`<div style="background:#fff;border-radius:14px;max-width:900px;width:100%;max-height:94vh;overflow:auto;padding:14px"><div style="text-align:right;margin-bottom:6px"><button onclick="REV.cerrar()" ${btn('#475569')}>Cerrar</button></div><div class="obs-prev">${h}</div></div>`)}catch(x2){err(x2)}}
async function pdf(i){const x=Z.rows[i];if(!x)return;try{doPrint(await htmlDe(x),{tipo:COD[Z.tab]||'ASI',titulo:titulo(x).slice(0,150),hoja:Z.tab==='planeador',sinCodigo:true})}catch(x2){err(x2)}}
async function guardar(i){const x=Z.rows[i];if(!x)return;
  try{const row={colegio_id:M.colegio_id,docente_id:Z.doc,docente_nombre:nomDoc(),tipo:Z.tab,titulo:titulo(x),fecha:fechaDe(x)};
    if(Z.tab==='plan'){if(!x.archivo_path)return toast('⚠️','Sin archivo','Este plan no tiene archivo.');row.ref_path=x.archivo_path}else row.html=await htmlDe(x);
    const r=await sb.from('doc_guardados').insert(row);if(r.error)throw r.error;await cargaGu();toast('💾','Guardado en tu entorno','Lo encuentras en «Guardados en mi entorno».')}catch(x2){err(x2)}}
async function bajar(i){const x=Z.rows[i];if(!x||!x.archivo_path)return;const u=await sb.storage.from('planes-area').createSignedUrl(x.archivo_path,120,{download:x.archivo_nombre||true});if(u.error)return err(u.error);window.open(u.data.signedUrl,'_blank')}
function nota(i){const x=Z.rows[i];if(!x)return;
  modal(`<div style="background:#fff;border-radius:14px;max-width:460px;width:100%;padding:16px"><b style="font-size:16px">Nota para ${e(nomDoc())}</b><p style="font-size:12.5px;color:#64748b;margin:4px 0 8px">${e(titulo(x))}</p><textarea id="rev-nt" rows="5" style="width:100%;border:1.5px solid #cbd5e1;border-radius:10px;padding:10px;font-size:14px" placeholder="Escribe tu observación o recomendación…"></textarea><div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px"><button onclick="REV.cerrar()" ${btn('#475569')}>Cancelar</button><button onclick="REV.enviarNota(${i})" ${btn('#7c3aed')}>Enviar nota</button></div></div>`)}
async function enviarNota(i){const x=Z.rows[i],t=(document.getElementById('rev-nt')||{}).value||'';if(!t.trim())return toast('⚠️','Escribe la nota','');
  try{const r=await sb.rpc('mensaje_enviar',{p_para:Z.doc,p_tipo:'nota',p_asunto:'Nota sobre: '+titulo(x).slice(0,120),p_texto:t.trim()});if(r.error)throw r.error;cerrar();toast('📝','Nota enviada','El docente la ve en su bandeja de Mensajes.')}catch(x2){err(x2)}}
/* guardados */
async function htmlG(x){if(x.html)return x.html;const r=await sb.from('doc_guardados').select('html').eq('id',x.id).single();return(r.data||{}).html||''}
async function verG(i){const x=Z.gu[i];if(!x)return;
  if(x.ref_path){const u=await sb.storage.from('planes-area').createSignedUrl(x.ref_path,120);if(u.error)return err(u.error);return window.open(u.data.signedUrl,'_blank')}
  const h=await htmlG(x);modal(`<div style="background:#fff;border-radius:14px;max-width:900px;width:100%;max-height:94vh;overflow:auto;padding:14px"><div style="text-align:right;margin-bottom:6px"><button onclick="REV.cerrar()" ${btn('#475569')}>Cerrar</button></div><div class="obs-prev">${h}</div></div>`)}
async function pdfG(i){const x=Z.gu[i];if(!x)return;if(x.ref_path)return verG(i);doPrint(await htmlG(x),{tipo:COD[x.tipo]||'ASI',titulo:x.titulo.slice(0,150),hoja:x.tipo==='planeador',sinCodigo:true})}
async function borrarG(i){const x=Z.gu[i];if(!x||!confirm('¿Quitar este documento de tu entorno?'))return;const r=await sb.from('doc_guardados').delete().eq('id',x.id);if(r.error)return err(r.error);await cargaGu();R()}
/* tablas de asistencia (las usan claseasis.js y asistencia.js) */
function tablaHtml(id){const el=document.getElementById(id);return el?`<div style="font-family:Arial,sans-serif"><style>td,th{border:1px solid #000;padding:4px 6px;font-size:10pt}table{border-collapse:collapse;width:100%}</style>${el.innerHTML}</div>`:''}
async function tPdf(id,tit){const h=tablaHtml(id);if(!h)return toast('⚠️','Nada que descargar','');doPrint(h,{tipo:'ASI',titulo:tit,sinCodigo:true})}
async function tGuardar(id,tit){const h=tablaHtml(id);if(!h)return toast('⚠️','Nada que guardar','');
  try{const r=await sb.from('doc_guardados').insert({colegio_id:M.colegio_id,tipo:'asistencia',titulo:tit+' · '+fF(hoy()),fecha:hoy(),html:h});if(r.error)throw r.error;await cargaGu();toast('💾','Guardado en tu entorno','Lo encuentras en «Revisión de docentes → Guardados en mi entorno».')}catch(x){err(x)}}
return{load,view,cerrar,ver,pdf,guardar,bajar,nota,enviarNota,verG,pdfG,borrarG,tPdf,tGuardar,
  f(k,v){Z[k]=v;if(k==='doc'||Z.tab!=='guardados')buscar()},
  tab(t){Z.tab=t;buscar()}}})();
