/* AULA360 — Observador del estudiante y Ficha de seguimiento.
   Dos modalidades: (1) formato institucional AULA360 (basado en la Ley 1620 de 2013 y el Decreto 1965 de 2013, compilado en el Decreto 1075 de 2015)
   y (2) formato propio de la institución: el rector/coordinador sube su Word, Excel, PDF o imagen y los docentes lo diligencian en línea.
   Se guarda como borrador, se imprime con el membrete y se envía al rector o coordinador por Mensajes. */
window.OBS=(function(){
const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const R=()=>render();
const isDir=()=>M&&(M.role==='rector'||M.role==='coordinador');
const hoy=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Bogota'});
const fc=x=>x?new Date(String(x).length===10?x+'T12:00:00':x).toLocaleDateString('es-CO',{day:'2-digit',month:'long',year:'numeric'}):'';
const TIPOS_OBS=['Situación positiva / reconocimiento','Académica','Convivencia — Situación Tipo I','Convivencia — Situación Tipo II','Convivencia — Situación Tipo III','Asistencia / puntualidad','Otra'];
const FORM={
 observador:{titulo:'OBSERVADOR DEL ESTUDIANTE',ic:'📘',secs:[
  {t:'1. Datos del estudiante',f:[{k:'fnac',l:'Fecha de nacimiento',t:'date'},{k:'edad',l:'Edad',t:'text'},{k:'eps',l:'EPS / seguro de salud',t:'text'},{k:'rh',l:'Grupo sanguíneo (RH)',t:'text'},{k:'dir',l:'Dirección',t:'text'},{k:'tel',l:'Teléfono',t:'text'}]},
  {t:'2. Datos familiares y acudiente',f:[{k:'acu',l:'Nombre del acudiente',t:'text'},{k:'par',l:'Parentesco',t:'text'},{k:'tela',l:'Teléfono del acudiente',t:'text'},{k:'ocu',l:'Ocupación del acudiente',t:'text'},{k:'vive',l:'Vive con',t:'text'},{k:'her',l:'Número de hermanos',t:'text'}]},
  {t:'3. Aspectos relevantes',f:[{k:'salud',l:'Salud, diagnósticos o necesidades educativas especiales',t:'area'},{k:'fort',l:'Fortalezas e intereses del estudiante',t:'area'}]},
  {t:'4. Registro de observaciones',nota:'Situaciones según la Ley 1620 de 2013 y el Decreto 1965 de 2013: Tipo I = conflictos manejados inadecuadamente y situaciones esporádicas que no causan daño al cuerpo o a la salud; Tipo II = agresión escolar, acoso o ciberacoso, sin ser delito, que se repite o causa daños al cuerpo o a la salud sin incapacidad; Tipo III = situaciones que pueden ser delitos contra la libertad, integridad y formación sexual, o cualquier otro delito. Aplica el debido proceso de tu Manual de Convivencia.',
   f:[{k:'obs',t:'tab',c:[['fecha','Fecha','date'],['per','Periodo','text'],['tipo','Tipo','sel',TIPOS_OBS],['desc','Descripción de lo ocurrido','area'],['desc2','Descargos del estudiante','area'],['comp','Compromisos / acciones','area'],['resp','Responsable','text']]}]},
  {t:'5. Remisiones y atención',f:[{k:'rem',l:'Remisiones (orientación escolar, comisaría, salud, otras) y seguimiento',t:'area'}]}],
  firmas:['Docente / director de grupo','Estudiante','Acudiente','Rector(a) o coordinador(a)']},
 ficha:{titulo:'FICHA DE SEGUIMIENTO AL ESTUDIANTE',ic:'📑',secs:[
  {t:'1. Datos generales',f:[{k:'fecha',l:'Fecha de apertura',t:'date'},{k:'acu',l:'Acudiente',t:'text'},{k:'tela',l:'Teléfono del acudiente',t:'text'},{k:'periodo',l:'Periodo',t:'text'}]},
  {t:'2. Motivo del seguimiento',f:[{k:'mot',l:'Marca los que apliquen',t:'chk',o:['Académico','Convivencial','Asistencia','Salud','Familiar','Otro']},{k:'motd',l:'Descripción de la situación',t:'area'}]},
  {t:'3. Diagnóstico',f:[{k:'fort',l:'Fortalezas',t:'area'},{k:'dif',l:'Dificultades identificadas',t:'area'}]},
  {t:'4. Plan de acción',f:[{k:'plan',t:'tab',c:[['acc','Acción o estrategia','area'],['resp','Responsable','text'],['fecha','Fecha','date'],['est','Estado','sel',['Pendiente','En proceso','Cumplida']]]}]},
  {t:'5. Seguimiento por periodo',f:[{k:'seg',t:'tab',c:[['fecha','Fecha','date'],['per','Periodo','text'],['av','Avances y observaciones','area'],['sig','Siguiente paso','area']]}]},
  {t:'6. Compromisos',f:[{k:'cacu',l:'Compromisos del acudiente',t:'area'},{k:'cest',l:'Compromisos del estudiante',t:'area'}]},
  {t:'7. Cierre',f:[{k:'res',l:'Resultado',t:'sel',o:['','Superado','En proceso','Sin cambios','Remitido a orientación o comisión de evaluación','Remitido a otra entidad']},{k:'cier',l:'Observaciones de cierre',t:'area'}]}],
  firmas:['Docente / director de grupo','Estudiante','Acudiente','Rector(a) o coordinador(a)']}};
let Z={t:'observador',lista:[],est:[],fm:{},dir:[],cur:null,sel:'',busy:false,cargado:false,res:[]};
const inp='style="width:100%;border:1.5px solid #cbd5e1;border-radius:10px;padding:8px;font-size:14px;background:#fff"';
const btn=(c)=>`style="background:${c};color:#fff;padding:10px 14px;border-radius:10px;font-weight:800"`;
async function load(t){
  Z.t=t==='fseg'?'ficha':'observador';Z.cur=null;
  const [a,b,c]=await Promise.all([
    sb.from('obs_registros').select('*').order('updated_at',{ascending:false}).limit(500),
    sb.from('doc_formatos_propios').select('*'),
    sb.rpc('obs_estudiantes')]);
  Z.lista=a.data||[];Z.fm={};(b.data||[]).forEach(x=>Z.fm[x.clase]=x);Z.est=c.data||[];
  try{const d=await sb.rpc('directorio_colegio');Z.dir=d.data||[]}catch(x){Z.dir=[]}
  Z.cargado=true;
}
const nomP=id=>((Z.dir.find(p=>p.id===id)||{}).full_name)||(id===M.id?M.full_name:'—');
/* ---------- Documento imprimible ---------- */
const CSS=`<style>#printarea .obs,.obs-prev .obs{font-family:Arial,Helvetica,sans-serif;color:#000;font-size:10pt}
.obs h2{text-align:center;font-size:14pt;margin:8px 0 6px}.obs h3{font-weight:700;font-size:10.5pt;background:#e5e7eb;border:1px solid #000;padding:4px 6px;margin:10px 0 0}
.obs table{width:100%;border-collapse:collapse}.obs td,.obs th{border:1px solid #000;padding:4px 6px;vertical-align:top;font-size:9.5pt}.obs th{background:#f1f5f9}
.obs .k{width:30%;font-weight:700;background:#f8fafc}.obs .fi{display:flex;justify-content:space-between;gap:20px;margin-top:46px}.obs .fi div{flex:1;border-top:1px solid #000;text-align:center;padding-top:3px;font-size:9pt}
.obs .nt{font-size:8pt;color:#475569;margin:3px 0}.obs-doc table{border-collapse:collapse}.obs-doc td,.obs-doc th{border:1px solid #000;padding:3px 5px}.obs-doc img{max-width:100%}
.obs .pg{position:relative;width:100%;page-break-after:always;container-type:inline-size}.obs .pg img{width:100%;display:block}.obs .bx{position:absolute;font-size:1.5cqw;line-height:1.15;white-space:pre-wrap;color:#0a2a8a;font-family:Arial,sans-serif}</style>`;
function cab(r){return`<table style="margin-top:6px"><tr><td class="k">Estudiante</td><td>${e(r.est_nombre)}</td><td class="k">Documento</td><td>${e(r.est_doc)}</td></tr><tr><td class="k">Grado</td><td>${e(r.grado)}</td><td class="k">Grupo</td><td>${e(r.grupo)}</td></tr></table>`}
function valF(f,v){if(f.t==='chk')return (f.o||[]).map(o=>((v||[]).includes(o)?'☒ ':'☐ ')+e(o)).join(' &nbsp; ');if(f.t==='date')return e(fc(v));return e(v).replace(/\n/g,'<br>')}
function instHtml(r){
  const F=FORM[r.clase],d=r.datos||{};let h=`${typeof lhHtml==='function'?lhHtml(18):''}<h2>${F.titulo}</h2><p style="text-align:right;font-size:9pt">Fecha: ${fc(d.fecha_doc||hoy())}</p>${cab(r)}`;
  F.secs.forEach(s=>{h+=`<h3>${e(s.t)}</h3>`;if(s.nota)h+=`<div class="nt">${e(s.nota)}</div>`;
    const simples=s.f.filter(f=>f.t!=='tab');
    if(simples.length)h+='<table>'+simples.map(f=>`<tr><td class="k">${e(f.l)}</td><td>${valF(f,d[f.k])||'&nbsp;'}</td></tr>`).join('')+'</table>';
    s.f.filter(f=>f.t==='tab').forEach(f=>{const rows=(d[f.k]||[]).filter(x=>Object.values(x).some(v=>v));const n=Math.max(rows.length,3);
      h+='<table><tr>'+f.c.map(c=>`<th>${e(c[1])}</th>`).join('')+'</tr>';
      for(let i=0;i<n;i++){const x=rows[i]||{};h+='<tr>'+f.c.map(c=>`<td>${c[2]==='date'?e(fc(x[c[0]])):e(x[c[0]]).replace(/\n/g,'<br>')||'&nbsp;'}</td>`).join('')+'</tr>'}
      h+='</table>'});});
  h+=`<div class="fi">${F.firmas.map((x,i)=>`<div>${e(x)}${i===0?'<br>'+e(d.docente||''):''}</div>`).join('')}</div>`;
  return`<div class="obs">${h}</div>`}
function propioPages(r,fm){const P=fm.plantilla,d=r.datos||{};const A4=P.h/P.w>1.36;const w=A4?'21cm':'21.59cm';
  return{w:A4?'21cm 29.7cm':'21.59cm 27.94cm',html:`<div class="obs">`+(P.pages||[]).map((src,i)=>`<div class="pg" style="width:${w}"><img src="${src}">${(d.cajas||[]).filter(b=>b.p===i).map(b=>`<div class="bx" style="left:${b.x}%;top:${b.y}%;width:${b.w||30}%">${e(b.t)}</div>`).join('')}</div>`).join('')+'</div>'}}
function docHtml(r){
  if(r.modalidad==='propio'){const fm=Z.fm[r.clase];if(!fm)return'<p>El formato de la institución ya no está disponible.</p>';
    if(fm.tipo==='html')return`${CSS}<div class="obs">${typeof lhHtml==='function'?'':''}<div class="obs-doc">${(r.datos||{}).html||fm.plantilla.html||''}</div></div>`;
    return CSS+propioPages(r,fm).html}
  return CSS+instHtml(r)}
/* ---------- Pantalla ---------- */
function tabsUi(){return`<div style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0">${[['observador','📘 Observador del estudiante'],['ficha','📑 Ficha de seguimiento']].map(x=>`<button onclick="OBS.tab('${x[0]}')" style="padding:9px 14px;border-radius:10px;font-weight:800;border:1.5px solid ${Z.t===x[0]?'#1e63e9':'#cbd5e1'};background:${Z.t===x[0]?'#e8f1ff':'#fff'};color:${Z.t===x[0]?'#1e3a8a':'#334155'}">${x[1]}</button>`).join('')}</div>`}
function listaUi(){
  const L=Z.lista.filter(r=>r.clase===Z.t),fm=Z.fm[Z.t];
  const nuevo=`<div style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0"><button onclick="OBS.nuevo('institucional')" ${btn('#1e63e9')}>➕ Nuevo con el formato AULA360</button>${fm?`<button onclick="OBS.nuevo('propio')" ${btn('#0f766e')}>➕ Nuevo con el formato de la institución${fm.nombre?' ('+e(fm.nombre)+')':''}</button>`:''}</div>`;
  const tabla=L.length?`<div style="overflow:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#f1f5f9;text-align:left"><th style="padding:7px">Estudiante</th><th>Grupo</th><th>Formato</th><th>${isDir()?'Hecho por':'Actualizado'}</th><th>Estado</th><th></th></tr>${L.map(r=>`<tr style="border-top:1px solid #e2e8f0"><td style="padding:7px"><b>${e(r.est_nombre)}</b></td><td>${e(r.grupo||r.grado)}</td><td>${r.modalidad==='propio'?'De la institución':'AULA360'}</td><td>${isDir()?e(nomP(r.creado_por)):e(fc((r.updated_at||'').slice(0,10)))}</td><td>${r.estado==='enviado'?'<span style="color:#16a34a;font-weight:800">Enviado</span>':'Borrador'}</td><td style="white-space:nowrap"><button class="aic-link" onclick="OBS.abrir('${r.id}')">${r.creado_por===M.id?'Abrir':'Ver'}</button> · <button class="aic-link" onclick="OBS.imprimirId('${r.id}')">Imprimir</button>${r.creado_por===M.id?` · <button class="aic-link" style="color:#dc2626" onclick="OBS.borrar('${r.id}')">Borrar</button>`:''}</td></tr>`).join('')}</table></div>`:'<p style="color:#64748b;font-size:14px;margin:10px 0">Todavía no hay registros. Crea el primero con el botón de arriba.</p>';
  return nuevo+tabla+(isDir()?propioUi():'')}
function propioUi(){const fm=Z.fm[Z.t];
  return`<div style="border:1.5px dashed #94a3b8;border-radius:12px;padding:12px;margin-top:16px"><b>Formato propio de la institución</b>
  <p style="font-size:12.5px;color:#64748b;margin:4px 0 8px">Sube el formato de tu colegio (Word, Excel, PDF o imagen). Los docentes lo diligenciarán en línea y podrán guardarlo, imprimirlo y enviártelo. Con Word y Excel el texto queda editable; con PDF o imagen se escribe encima del formato.</p>
  ${fm?`<p style="font-size:13px">Formato actual: <b>${e(fm.nombre||'sin nombre')}</b> (${fm.tipo==='html'?'editable':'PDF o imagen'}) · <button class="aic-link" style="color:#dc2626" onclick="OBS.quitarFmt()">Quitar</button></p>`:''}
  <label style="display:inline-block;${'background:#475569;color:#fff;padding:9px 13px;border-radius:10px;font-weight:800;cursor:pointer'}">📤 ${fm?'Cambiar':'Subir'} formato<input type="file" accept=".docx,.xlsx,.xls,.pdf,.png,.jpg,.jpeg" style="display:none" onchange="OBS.subirFmt(this)"></label></div>`}
function campoUi(f,v,ro){
  const id=f.k;
  if(f.t==='area')return`<textarea ${inp} rows="3" ${ro?'disabled':''} oninput="OBS.f('${id}',this.value)">${e(v)}</textarea>`;
  if(f.t==='date')return`<input type="date" ${inp} value="${e(v)}" ${ro?'disabled':''} oninput="OBS.f('${id}',this.value)">`;
  if(f.t==='sel')return`<select ${inp} ${ro?'disabled':''} onchange="OBS.f('${id}',this.value)">${f.o.map(o=>`<option ${v===o?'selected':''}>${e(o)}</option>`).join('')}</select>`;
  if(f.t==='chk')return`<div style="display:flex;flex-wrap:wrap;gap:10px">${f.o.map(o=>`<label style="font-size:13px"><input type="checkbox" ${(v||[]).includes(o)?'checked':''} ${ro?'disabled':''} onchange="OBS.ck('${id}','${e(o)}',this.checked)"> ${e(o)}</label>`).join('')}</div>`;
  return`<input ${inp} value="${e(v)}" ${ro?'disabled':''} oninput="OBS.f('${id}',this.value)">`}
function tabUi(f,rows,ro){rows=rows||[];
  const cel=(c,x,i)=>{const t=c[2],v=x[c[0]]||'';const a=`oninput="OBS.c('${f.k}',${i},'${c[0]}',this.value)"`;
    if(t==='area')return`<textarea ${inp} rows="2" ${ro?'disabled':''} ${a}>${e(v)}</textarea>`;
    if(t==='date')return`<input type="date" ${inp} value="${e(v)}" ${ro?'disabled':''} ${a}>`;
    if(t==='sel')return`<select ${inp} ${ro?'disabled':''} onchange="OBS.c('${f.k}',${i},'${c[0]}',this.value)">${['',...c[3]].map(o=>`<option ${v===o?'selected':''}>${e(o)}</option>`).join('')}</select>`;
    return`<input ${inp} value="${e(v)}" ${ro?'disabled':''} ${a}>`};
  return`${rows.map((x,i)=>`<div style="border:1px solid #e2e8f0;border-radius:10px;padding:8px;margin-bottom:8px;background:#fafcff"><div style="display:flex;justify-content:space-between;font-size:12px;color:#64748b;margin-bottom:4px"><b>Registro ${i+1}</b>${ro?'':`<button class="aic-link" style="color:#dc2626" onclick="OBS.quitarFila('${f.k}',${i})">Quitar</button>`}</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px">${f.c.map(c=>`<label style="font-size:12px;font-weight:700">${e(c[1])}${cel(c,x,i)}</label>`).join('')}</div></div>`).join('')}${ro?'':`<button onclick="OBS.fila('${f.k}')" ${btn('#475569')}>➕ Agregar registro</button>`}`}
function estPick(r,ro){
  return`<div style="border:1px solid #e2e8f0;border-radius:12px;padding:12px;background:#f8fafc"><b>Estudiante</b>
  ${ro?'':`<input id="obs-q" ${inp} placeholder="🔎 Escribe el nombre o el documento para buscar en tu lista…" oninput="OBS.buscar(this.value)"><div id="obs-res"></div>`}
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-top:8px">${[['est_nombre','Nombre completo'],['est_doc','Documento'],['grado','Grado'],['grupo','Grupo']].map(x=>`<label style="font-size:12px;font-weight:700">${x[1]}<input ${inp} value="${e(r[x[0]])}" ${ro?'disabled':''} oninput="OBS.top('${x[0]}',this.value)"></label>`).join('')}</div></div>`}
function formUi(){
  const r=Z.cur,ro=r.creado_por&&r.creado_por!==M.id,F=FORM[r.clase],fm=Z.fm[r.clase];let cuerpo='';
  if(r.modalidad==='propio'&&fm){
    if(fm.tipo==='html')cuerpo=`<p style="font-size:12.5px;color:#64748b;margin:8px 0">Haz clic dentro del formato y escribe donde corresponda.</p><div id="obs-ed" class="obs-doc" ${ro?'':'contenteditable="true"'} style="border:1.5px solid #cbd5e1;border-radius:10px;padding:14px;background:#fff;max-height:70vh;overflow:auto;font-size:13px" oninput="OBS.ed(this)">${(r.datos||{}).html||fm.plantilla.html||''}</div>`;
    else cuerpo=`<p style="font-size:12.5px;color:#64748b;margin:8px 0">Haz clic sobre el formato donde quieras escribir. Para quitar un texto, bórralo o pulsa la ✕ roja.</p>`+(fm.plantilla.pages||[]).map((src,i)=>`<div style="position:relative;max-width:760px;margin:0 auto 14px;border:1px solid #cbd5e1;container-type:inline-size;${ro?'':'cursor:text'}" onclick="OBS.clic(event,${i})"><img src="${src}" style="width:100%;display:block;user-select:none" draggable="false">${((r.datos||{}).cajas||[]).map((b,j)=>b.p!==i?'':`<div style="position:absolute;left:${b.x}%;top:${b.y}%;width:${b.w||30}%;min-width:40px" onclick="event.stopPropagation()"><div id="bx${j}" ${ro?'':'contenteditable="true"'} oninput="OBS.bx(${j},this.innerText)" style="font-size:1.5cqw;line-height:1.15;color:#0a2a8a;background:rgba(255,255,200,.55);outline:1px dashed #94a3b8;min-height:1.3em;white-space:pre-wrap">${e(b.t)}</div>${ro?'':`<span onclick="OBS.quitarBx(${j})" style="position:absolute;right:-8px;top:-8px;background:#dc2626;color:#fff;border-radius:50%;width:16px;height:16px;font-size:10px;text-align:center;line-height:16px;cursor:pointer">✕</span>`}</div>`).join('')}</div>`).join('')}
  else{
    cuerpo=`<div style="margin-top:10px"><label style="font-size:12px;font-weight:700">Fecha del documento<input type="date" ${inp} value="${e(r.datos.fecha_doc||hoy())}" ${ro?'disabled':''} oninput="OBS.f('fecha_doc',this.value)"></label></div>`+F.secs.map(s=>`<div style="margin-top:14px"><h3 style="font-weight:800;font-size:15px;color:#1e3a8a">${e(s.t)}</h3>${s.nota?`<p style="font-size:12px;color:#64748b;margin:3px 0 8px">${e(s.nota)}</p>`:''}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(${s.f.some(f=>f.t==='area'||f.t==='chk'||f.t==='tab')?'100%':'220px'},1fr));gap:10px">${s.f.map(f=>f.t==='tab'?tabUi(f,r.datos[f.k],ro):`<label style="font-size:12.5px;font-weight:700">${e(f.l)}${campoUi(f,r.datos[f.k],ro)}</label>`).join('')}</div></div>`).join('');}
  return`<div class="aic-card" style="padding:18px"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 style="font-weight:800;font-size:19px">${F.ic} ${e(F.titulo)}${r.modalidad==='propio'?' · formato de la institución':''}</h2><button class="aic-link" onclick="OBS.volver()">← Volver a la lista</button></div>
  ${ro?'<p style="background:#fef9c3;border-radius:8px;padding:8px;font-size:13px;margin-top:8px">Este registro lo hizo otra persona: puedes verlo e imprimirlo, pero no cambiarlo.</p>':''}
  <div style="margin-top:10px">${estPick(r,ro)}</div>${cuerpo}
  <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px">${ro?'':`<button onclick="OBS.guardar()" ${btn('#1e63e9')}>💾 Guardar</button>`}<button onclick="OBS.vista()" ${btn('#475569')}>👁 Vista previa</button><button onclick="OBS.imprimir()" ${btn('#16a34a')}>🖨️ Imprimir</button>${ro?'':`<button onclick="OBS.enviarUi()" ${btn('#7c3aed')}>📨 Enviar al rector o coordinador</button>`}</div>
  <p style="font-size:12px;color:#64748b;margin-top:8px">Es un documento confidencial: solo lo ven quien lo crea, el rector y los coordinadores de tu institución.</p></div>`}
function view(){
  if(!M)return'';
  if(Z.cur)return`<div style="display:grid;gap:14px">${formUi()}</div>`;
  return`<div style="display:grid;gap:14px"><div class="aic-card" style="padding:18px"><h2 style="font-weight:800;font-size:19px">📘 Observador del estudiante y ficha de seguimiento</h2>${tabsUi()}
  <p style="font-size:13px;color:#64748b">${Z.t==='observador'?'Registro de situaciones positivas, académicas y de convivencia de cada estudiante, con el formato institucional de AULA360 o con el formato de tu colegio.':'Ficha para hacer seguimiento a un estudiante: motivo, plan de acción, avances por periodo y cierre.'}</p>${listaUi()}</div></div>`}
/* ---------- Acciones ---------- */
function nuevo(mod){const d={docente:M.full_name||'',fecha_doc:hoy()};if(Z.t==='ficha')d.fecha=hoy();
  Z.cur={clase:Z.t,modalidad:mod,est_nombre:'',est_doc:'',grado:'',grupo:'',datos:d,estado:'borrador'};R();window.scrollTo(0,0)}
function buscar(q){const box=document.getElementById('obs-res');if(!box)return;q=(q||'').toLowerCase().trim();
  if(q.length<2){box.innerHTML='';return}
  Z.res=Z.est.filter(s=>(s.full_name||'').toLowerCase().includes(q)||(s.documento||'').includes(q)).slice(0,8);
  box.innerHTML=Z.res.length?Z.res.map((s,i)=>`<div onclick="OBS.pick(${i})" style="padding:7px 9px;border:1px solid #e2e8f0;border-radius:8px;margin-top:4px;background:#fff;cursor:pointer;font-size:13px"><b>${e(s.full_name)}</b> · ${e(s.grupo||s.grado)} ${s.documento?'· '+e(s.documento):''}</div>`).join(''):'<p style="font-size:12px;color:#64748b;margin-top:4px">Sin coincidencias: escribe los datos a mano en los cuadros de abajo.</p>'}
function pick(i){const s=Z.res[i];if(!s)return;Object.assign(Z.cur,{est_nombre:s.full_name||'',est_doc:s.documento||'',grado:s.grado||'',grupo:s.grupo||''});R()}
function validar(){const r=Z.cur;if(!r.est_nombre.trim()){toast('⚠️','Falta el estudiante','Busca o escribe el nombre del estudiante.');return false}return true}
async function guardar(quiet){
  const r=Z.cur;if(!validar())return false;
  const row={colegio_id:M.colegio_id,clase:r.clase,modalidad:r.modalidad,est_nombre:r.est_nombre.trim(),est_doc:r.est_doc||null,grado:r.grado||null,grupo:r.grupo||null,datos:r.datos,updated_at:new Date().toISOString()};
  try{let q;if(r.id)q=sb.from('obs_registros').update(row).eq('id',r.id).select().single();else q=sb.from('obs_registros').insert(row).select().single();
    const x=await q;if(x.error)throw x.error;Z.cur=Object.assign({},x.data);
    const i=Z.lista.findIndex(y=>y.id===x.data.id);if(i>=0)Z.lista[i]=x.data;else Z.lista.unshift(x.data);
    if(!quiet)toast('✅','Guardado','Quedó como borrador. Puedes imprimirlo o enviarlo.');return true}catch(x){err(x);return false}}
function abrir(id){const r=Z.lista.find(x=>x.id===id);if(!r)return;Z.cur=JSON.parse(JSON.stringify(r));Z.t=r.clase;R();window.scrollTo(0,0)}
function volver(){Z.cur=null;R()}
async function borrar(id){if(!confirm('¿Borrar este registro? No se puede recuperar.'))return;
  const x=await sb.from('obs_registros').delete().eq('id',id);if(x.error)return err(x.error);Z.lista=Z.lista.filter(y=>y.id!==id);R()}
function modal(html){const m=document.createElement('div');m.id='obs-m';m.style.cssText='position:fixed;inset:0;background:rgba(15,23,42,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:10px';m.innerHTML=html;document.body.appendChild(m);return m}
function vista(r){r=r||Z.cur;document.getElementById('obs-m')?.remove();
  modal(`<div style="background:#fff;border-radius:14px;max-width:900px;width:100%;max-height:94vh;overflow:auto;padding:14px"><div style="text-align:right;margin-bottom:6px"><button onclick="document.getElementById('obs-m').remove()" ${btn('#475569')}>Cerrar</button></div><div class="obs-prev">${docHtml(r)}</div></div>`)}
async function imprimir(r){r=r||Z.cur;const fm=Z.fm[r.clase];
  const pag=r.modalidad==='propio'&&fm&&fm.tipo==='paginas';
  let h=docHtml(r);h=`<style>@media print{@page{size:${pag?propioPages(r,fm).w:'letter'};margin:${pag?'0':'1cm'}}}</style>`+h;
  await doPrint(h,{tipo:r.clase==='ficha'?'FIC':'OBS',titulo:(FORM[r.clase].titulo+' · '+r.est_nombre).slice(0,150),hoja:!pag&&r.modalidad!=='propio',sinCodigo:pag})}
function imprimirId(id){const r=Z.lista.find(x=>x.id===id);if(r)imprimir(r)}
/* edición */
const D_=()=>Z.cur.datos;
function f(k,v){D_()[k]=v}
function ck(k,o,on){const a=D_()[k]=D_()[k]||[];const i=a.indexOf(o);if(on&&i<0)a.push(o);if(!on&&i>=0)a.splice(i,1)}
function c(k,i,col,v){(D_()[k]=D_()[k]||[])[i]=(D_()[k][i]||{});D_()[k][i][col]=v}
function fila(k){(D_()[k]=D_()[k]||[]).push({});R()}
function quitarFila(k,i){D_()[k].splice(i,1);R()}
function top(k,v){Z.cur[k]=v}
function ed(el){D_().html=el.innerHTML}
function clic(ev,p){if(Z.cur.creado_por&&Z.cur.creado_por!==M.id)return;const b=ev.currentTarget.getBoundingClientRect();
  const x=Math.max(0,Math.min(85,(ev.clientX-b.left)/b.width*100)),y=Math.max(0,Math.min(97,(ev.clientY-b.top)/b.height*100));
  const a=D_().cajas=D_().cajas||[];a.push({p,x:+x.toFixed(2),y:+y.toFixed(2),w:30,t:''});R();setTimeout(()=>document.getElementById('bx'+(a.length-1))?.focus(),30)}
function bx(j,t){D_().cajas[j].t=t}
function quitarBx(j){D_().cajas.splice(j,1);R()}
function tab(t){Z.t=t;Z.cur=null;R()}
/* formato propio */
async function aHtmlLimpio(h){const d=new DOMParser().parseFromString(h,'text/html');d.querySelectorAll('script,style,iframe,object,embed,link,meta,form').forEach(n=>n.remove());
  d.querySelectorAll('*').forEach(n=>{[...n.attributes].forEach(a=>{if(/^on/i.test(a.name)||/^\s*javascript:/i.test(a.value))n.removeAttribute(a.name)})});return d.body.innerHTML}
async function subirFmt(inp_){
  const file=inp_.files[0];inp_.value='';if(!file)return;const n=file.name.toLowerCase();let tipo,pl;
  toast('⏳','Leyendo el formato','Un momento…');
  try{
    if(n.endsWith('.docx')){await loadScript(LIB.mammoth);const x=await mammoth.convertToHtml({arrayBuffer:await file.arrayBuffer()});tipo='html';pl={html:await aHtmlLimpio(x.value)}}
    else if(n.endsWith('.xlsx')||n.endsWith('.xls')){await loadScript(LIB.xlsx);const wb=XLSX.read(await file.arrayBuffer(),{type:'array'});tipo='html';
      pl={html:await aHtmlLimpio(wb.SheetNames.map(s=>(wb.SheetNames.length>1?'<h4>'+e(s)+'</h4>':'')+XLSX.utils.sheet_to_html(wb.Sheets[s],{editable:false})).join('<br>'))}}
    else if(n.endsWith('.pdf')){await loadScript(LIB.pdf);pdfjsLib.GlobalWorkerOptions.workerSrc=LIB.pdfw;const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;
      if(pdf.numPages>6)throw new Error('El PDF tiene '+pdf.numPages+' páginas. Sube uno de máximo 6 páginas.');const pages=[];let w=0,h=0;
      for(let i=1;i<=pdf.numPages;i++){const pg=await pdf.getPage(i),vp=pg.getViewport({scale:1.5}),cv=document.createElement('canvas');cv.width=vp.width;cv.height=vp.height;await pg.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;pages.push(cv.toDataURL('image/jpeg',.72));w=vp.width;h=vp.height}
      tipo='paginas';pl={pages,w,h}}
    else if(/\.(png|jpe?g)$/.test(n)){const url=await new Promise((ok,ko)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=ko;r.readAsDataURL(file)});
      const im=await new Promise((ok,ko)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=ko;i.src=url});const s=Math.min(1,1200/im.width),cv=document.createElement('canvas');cv.width=im.width*s;cv.height=im.height*s;cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);
      tipo='paginas';pl={pages:[cv.toDataURL('image/jpeg',.75)],w:cv.width,h:cv.height}}
    else throw new Error('Tipo de archivo no permitido. Usa Word, Excel, PDF o imagen.');
    if(JSON.stringify(pl).length>6e6)throw new Error('El formato es muy pesado. Sube una versión más liviana.');
    const x=await sb.from('doc_formatos_propios').upsert({colegio_id:M.colegio_id,clase:Z.t,nombre:file.name,tipo,plantilla:pl,updated_by:M.id,updated_at:new Date().toISOString()});if(x.error)throw x.error;
    Z.fm[Z.t]={clase:Z.t,nombre:file.name,tipo,plantilla:pl};toast('✅','Formato guardado','Los docentes ya pueden diligenciarlo en línea.');R()}catch(x){err(x)}}
async function quitarFmt(){if(!confirm('¿Quitar el formato de la institución? Los registros ya hechos con él se conservan.'))return;
  const x=await sb.from('doc_formatos_propios').delete().eq('colegio_id',M.colegio_id).eq('clase',Z.t);if(x.error)return err(x.error);delete Z.fm[Z.t];R()}
/* enviar */
function enviarUi(){
  const ds=Z.dir.filter(p=>(p.role==='rector'||p.role==='coordinador')&&p.id!==M.id);
  if(!ds.length)return toast('⚠️','No hay a quién enviar','No encontré rector o coordinador aprobado en tu institución.');
  document.getElementById('obs-m')?.remove();
  modal(`<div style="background:#fff;border-radius:14px;max-width:460px;width:100%;padding:16px"><b style="font-size:16px">Enviar a…</b><div style="margin:10px 0">${ds.map(p=>`<label style="display:block;padding:5px 0;font-size:14px"><input type="checkbox" class="obs-p" value="${p.id}"> ${e(p.full_name)} <span style="color:#64748b">(${p.role==='rector'?'Rector':'Coordinador'})</span></label>`).join('')}</div><div style="display:flex;gap:8px;justify-content:flex-end"><button onclick="document.getElementById('obs-m').remove()" ${btn('#94a3b8')}>Cancelar</button><button id="obs-go" onclick="OBS.enviar()" ${btn('#7c3aed')}>Enviar</button></div></div>`)}
async function enviar(){
  const ids=[...document.querySelectorAll('.obs-p:checked')].map(x=>x.value);if(!ids.length)return toast('⚠️','Elige al menos una persona','');
  const b=document.getElementById('obs-go');b.disabled=true;b.textContent='Enviando…';
  try{if(!(await guardar(true))){b.disabled=false;b.textContent='Enviar';return}
    const r=Z.cur,F=FORM[r.clase];
    const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8">${CSS}</head><body>${docHtml(r).replace(CSS,'')}</body></html>`;
    const nombre=(F.titulo.split(' ')[0]==='OBSERVADOR'?'Observador':'Ficha de seguimiento')+' - '+r.est_nombre.replace(/[^\wÁÉÍÓÚáéíóúñÑ ]/g,'').trim()+'.doc';
    const path=(M.colegio_id||'sin')+'/'+M.id+'/'+Date.now()+'-'+nombre.replace(/[^\w.\- ]/g,'_');
    const up=await sb.storage.from('mensajes').upload(path,new Blob(['﻿'+html],{type:'application/msword'}),{contentType:'application/msword'});if(up.error)throw up.error;
    let ok=0;for(const id of ids){const x=await sb.rpc('mensaje_enviar',{p_para:id,p_tipo:'documento',p_asunto:(r.clase==='ficha'?'Ficha de seguimiento · ':'Observador · ')+r.est_nombre,p_texto:'Te envío '+(r.clase==='ficha'?'la ficha de seguimiento':'el observador')+' de '+r.est_nombre+' ('+(r.grupo||r.grado||'')+'). Documento confidencial adjunto.',p_path:path,p_nombre:nombre});if(!x.error)ok++}
    if(!ok)throw new Error('No se pudo enviar el mensaje.');
    const u=await sb.from('obs_registros').update({estado:'enviado',enviado_a:ids[0],enviado_at:new Date().toISOString()}).eq('id',r.id).select().single();if(!u.error){Z.cur=u.data;const i=Z.lista.findIndex(y=>y.id===r.id);if(i>=0)Z.lista[i]=u.data}
    document.getElementById('obs-m')?.remove();toast('📨','Enviado','Lo recibieron '+ok+' persona(s) en su bandeja de Mensajes.');R()}catch(x){b.disabled=false;b.textContent='Enviar';err(x)}}
return{load,view,nuevo,buscar,pick,guardar,abrir,volver,borrar,vista,imprimir,imprimirId,f,ck,c,fila,quitarFila,top,ed,clic,bx,quitarBx,tab,subirFmt,quitarFmt,enviarUi,enviar,_t:{docHtml,Z:()=>Z,FORM}};
})();
