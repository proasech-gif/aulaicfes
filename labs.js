/* AULA360 — Centro de Laboratorios y Experiencias de Aprendizaje (v1)
   Estudiante: practica y entrega · Docente: crea, publica, califica · Directivo: audita (solo lectura) */
window.LAB=(function(){
const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LABS=[
['quimica','🧪','Química','Materia, reacciones, mezclas y seguridad en el laboratorio'],
['fisica','⚛️','Física','Movimiento, fuerzas, energía, ondas y electricidad'],
['biologia','🧬','Biología','Células, seres vivos, ecosistemas y cuerpo humano'],
['matematicas','📐','Matemáticas','Números, álgebra, geometría, estadística y probabilidad'],
['lectura','📖','Lectura Crítica','Comprensión, inferencia, argumentos y análisis de textos'],
['ingles','🗣️','English Lab','Listening, speaking, vocabulary, grammar, reading y writing'],
['edfisica','🏃','Educación Física','Movimiento, deporte, salud y diario de práctica'],
['etica','🤔','Ética y Filosofía','Dilemas, valores, argumentación y pensamiento crítico'],
['democracia','🗳️','Democracia y Participación','Participación, derechos, instituciones y ciudadanía'],
['politica','🏛️','Política, Gobierno y Sociedad','Cómo funciona el Estado, con enfoque plural y neutral'],
['sociales','🌎','Ciencias Sociales','Historia, geografía, cultura y sociedad'],
['ciudadanas','🤝','Competencias Ciudadanas','Convivencia, diálogo, empatía y resolución de conflictos'],
['arte','🎨','Arte y Cultura','Expresión artística, portafolio y rúbricas']];
const LN=Object.fromEntries(LABS.map(l=>[l[0],l]));
const isDir=()=>M&&(M.role==='rector'||M.role==='coordinador');
const isProf=()=>M&&M.role==='prof';
const isEst=()=>M&&!isDir()&&!isProf()&&!M.is_admin;
let Z={salas:[],msgs:[],sala:null,v:'home',lab:null,exps:[],ents:{},cursos:[],cfg:{},nom:{},ed:null,cur:null,ent:null,lista:[],chat:[],nivel:'A1',ing:null,ok:false,busy:false};
const card='background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px';
const B=(c,t,x='')=>`<button ${x} style="background:${c};color:#fff;padding:9px 14px;border-radius:10px;font-weight:800;font-size:13px">${t}</button>`;
const inp='width:100%;padding:9px;border:1.5px solid #cbd5e1;border-radius:10px;font-size:14px';
const fF=d=>d?new Date(d).toLocaleString('es-CO',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'';
const ESTADO={borrador:'Borrador',publicada:'Publicada',cerrada:'Cerrada'};

/* ---------- cola sin conexión (se envía al volver internet, sin duplicar) ---------- */
const QK=()=>'lab_pend_'+(M&&M.id);
const qGet=()=>{try{return JSON.parse(localStorage.getItem(QK())||'[]')}catch(_){return[]}};
const qSet=a=>{try{localStorage.setItem(QK(),JSON.stringify(a))}catch(_){}};
async function flush(){
  if(!isEst()||!navigator.onLine)return;let q=qGet();if(!q.length)return;const rest=[];let n=0;
  for(const it of q){const {error}=await sb.rpc('lab_guardar_entrega',{p_exp:it.exp,p_resp:it.resp,p_evid:it.evid,p_enviar:it.enviar});
    if(error){const m=String(error.message||'');if(/intentos|calificada|cerr|dispon/i.test(m))continue;rest.push(it)}else n++}
  qSet(rest);if(n)toast('✅ Se enviaron '+n+' trabajo(s) de laboratorio guardados sin internet');
}
window.addEventListener('online',()=>{try{flush()}catch(_){}});

async function load(){
  Z.ok=false;if(!window.SIM)await loadScript('sims.js?v=3');
  const [x,c]=await Promise.all([sb.from('lab_experiencias').select('*').order('created_at',{ascending:false}),
    isProf()?sb.from('courses').select('id,grade,name').eq('teacher_id',M.id).order('grade').order('name'):Promise.resolve({data:[]})]);
  Z.exps=x.data||[];Z.cursos=c.data||[];
  if(isEst()){const r=await sb.from('lab_entregas').select('*').eq('user_id',M.id);Z.ents=Object.fromEntries((r.data||[]).map(a=>[a.experiencia_id,a]));flush()}
  if(isDir()){const r=await sb.from('lab_config').select('*');Z.cfg=Object.fromEntries((r.data||[]).map(a=>[a.lab,a]));
    const ids=[...new Set(Z.exps.map(a=>a.docente_id))];if(ids.length){const p=await sb.from('profiles').select('id,full_name').in('id',ids);Z.nom=Object.fromEntries((p.data||[]).map(a=>[a.id,a.full_name]))}}
  await cargaSalas();Z.ok=true;
}
const exDe=l=>Z.exps.filter(x=>x.lab===l);

/* ---------- asistencia obligatoria por laboratorio (estudiante) ---------- */
const hoy=()=>new Date(Date.now()-5*3600*1000).toISOString().slice(0,10);
const AK=l=>'lab_asis_'+(M&&M.id)+'_'+l+'_'+hoy();
async function asistio(l){try{if(localStorage.getItem(AK(l))==='1')return true}catch(_){}
  try{const {data,error}=await sb.rpc('lab_asistio',{p_lab:l});if(!error&&data===true){try{localStorage.setItem(AK(l),'1')}catch(_){}return true}}catch(_){}return false}
async function registrarAsis(){const {error}=await sb.rpc('lab_registrar_asistencia',{p_lab:Z.lab});if(error)return err(error);try{localStorage.setItem(AK(Z.lab),'1')}catch(_){}toast('✅ Asistencia registrada');await cargaSalas();Z.v='lab';render()}
function vGate(){const l=LN[Z.lab];return`<div class="aic-card" style="padding:22px;text-align:center"><button onclick="LAB.home()" style="font-weight:700;color:#1e63e9;float:left">← Laboratorios</button><div style="clear:both;font-size:46px;margin-top:8px">${l[1]}</div><h2 style="font-weight:800;font-size:20px;margin:6px 0">${e(l[2])}</h2>
  <p style="color:#475569;margin:8px 0 14px">Para participar hoy en este laboratorio debes <b>registrar tu asistencia</b>. Sin ella no puedes entrar a las experiencias, las salas de debate ni el tutor IA.</p>${B('#16a34a','✋ Registrar mi asistencia de hoy','onclick="LAB.asiste()"')}</div>`}
async function verAsis(){const r=await sb.rpc('lab_asistencia_lista',{p_lab:Z.lab});if(r.error)return err(r.error);Z.alista=r.data||[];Z.v='alista';render()}
function vAlista(){const L=Z.alista||[],p=L.filter(a=>a.presente).length;
  return`<div class="aic-card" style="padding:18px"><button onclick="LAB.open('${Z.lab}')" style="font-weight:700;color:#1e63e9">← ${e(LN[Z.lab][2])}</button><h2 style="font-weight:800;font-size:19px;margin:6px 0">✋ Asistencia de hoy · ${e(LN[Z.lab][2])}</h2><p style="color:#64748b">${p} de ${L.length} estudiantes registraron asistencia hoy.</p>
  <div class="aic-table-wrap"><table style="min-width:420px"><thead><tr><th>CURSO</th><th>ESTUDIANTE</th><th>ASISTENCIA</th><th>HORA</th></tr></thead><tbody>${L.map(a=>`<tr><td>${e(a.curso)}</td><td>${e(a.full_name)}</td><td>${a.presente?'✅ Sí':'—'}</td><td>${a.hora?fF(a.hora):''}</td></tr>`).join('')}</tbody></table></div></div>`}

/* ---------- salas de debate ---------- */
const MODO={companeros:'👥 Entre compañeros',tutor:'🤖 Con el tutor IA',mixto:'👥+🤖 Compañeros y tutor'};
async function cargaSalas(){const r=await sb.from('lab_salas').select('*').order('created_at',{ascending:false});Z.salas=r.data||[]}
function nuevaSala(){Z.v='salaNew';render()}
function vSalaNew(){return`<div class="aic-card" style="padding:18px"><button onclick="LAB.open('${Z.lab}')" style="font-weight:700;color:#1e63e9">← ${e(LN[Z.lab][2])}</button><h2 style="font-weight:800;font-size:19px;margin:6px 0">💬 Nueva sala de debate</h2>
  <label style="display:block;font-weight:800;font-size:12px;margin-top:8px">Título</label><input id="sn_t" style="${inp}" placeholder="Ej.: ¿Es justo copiar en un examen?">
  <label style="display:block;font-weight:800;font-size:12px;margin-top:8px">Tema o pregunta orientadora</label><textarea id="sn_d" rows="3" style="${inp}"></textarea>
  <label style="display:block;font-weight:800;font-size:12px;margin-top:8px">Curso</label><select id="sn_c" style="${inp}">${Z.cursos.map(c=>`<option value="${c.id}">${c.grade}° ${e(c.name)}</option>`).join('')}</select>
  <label style="display:block;font-weight:800;font-size:12px;margin-top:8px">¿Quién participa?</label><select id="sn_m" style="${inp}">${Object.entries(MODO).map(([k,v])=>`<option value="${k}" ${k==='mixto'?'selected':''}>${v}</option>`).join('')}</select>
  <p style="font-size:12px;color:#64748b;margin-top:6px">Tú también puedes escribir y borrar mensajes inapropiados en cualquier momento. El tutor IA solo modera y pregunta; no toma partido.</p>
  <div style="margin-top:12px">${B('#16a34a','Crear sala','onclick="LAB.salaCrear()"')}</div></div>`}
async function salaCrear(){const t=document.getElementById('sn_t').value.trim(),c=document.getElementById('sn_c').value;if(!t)return toast('Escribe un título');if(!c)return toast('Elige un curso');
  const m=document.getElementById('sn_m').value;const {error}=await sb.from('lab_salas').insert({docente_id:M.id,colegio_id:M.colegio_id,curso_id:c,lab:Z.lab,titulo:t,tema:document.getElementById('sn_d').value,modo:m,estado:'abierta',tutor_activo:m!=='companeros'});if(error)return err(error);
  toast('✅ Sala creada');await cargaSalas();Z.v='lab';render()}
async function entrarSala(id){Z.sala=Z.salas.find(a=>a.id===id);Z.msgs=[];await refrescaMsgs(true);Z.v='sala';render();setTimeout(()=>{scrollM();arrancaPoll()},30)}
const scrollM=()=>{const c=document.getElementById('msgs');if(c)c.scrollTop=c.scrollHeight};
async function refrescaMsgs(sinDom){const r=await sb.from('lab_mensajes').select('*').eq('sala_id',Z.sala.id).order('created_at',{ascending:true}).limit(300);if(r.error)return;const d=r.data||[];
  if(d.length!==Z.msgs.length||(d.length&&d[d.length-1].id!==(Z.msgs[Z.msgs.length-1]||{}).id)){Z.msgs=d;if(!sinDom){const c=document.getElementById('msgs');if(c){const bajo=c.scrollTop+c.clientHeight>=c.scrollHeight-40;c.innerHTML=msgsHtml();if(bajo)scrollM()}}}}
function arrancaPoll(){if(Z.poll)clearInterval(Z.poll);Z.poll=setInterval(()=>{if(Z.v!=='sala'||!document.getElementById('msgs')){clearInterval(Z.poll);Z.poll=null;return}refrescaMsgs()},4000)}
function msgsHtml(){if(!Z.msgs.length)return'<p style="color:#64748b">Todavía no hay mensajes. ¡Rompe el hielo!</p>';
  return Z.msgs.map(m=>{const yo=m.user_id===(M&&M.id)&&m.autor!=='ia',c=m.autor==='ia'?'#f3e8ff':m.autor==='doc'?'#dbeafe':yo?'#dcfce7':'#f1f5f9',b=m.autor==='ia'?'🤖 Tutor IA':m.autor==='doc'?'👩‍🏫 '+e(m.nombre):e(m.nombre);
    return`<div style="background:${c};padding:8px 12px;border-radius:12px;max-width:92%;${yo?'justify-self:end':''}"><div style="font-size:11px;font-weight:800;color:#475569">${b} · ${fF(m.created_at)}${isProf()&&m.autor!=='doc'?` <button onclick="LAB.msgDel('${m.id}')" title="Borrar mensaje" style="color:#dc2626">🗑</button>`:''}</div><div style="white-space:pre-wrap;margin-top:2px">${e(m.texto)}</div></div>`}).join('')}
function vSala(){const s=Z.sala,ab=s.estado==='abierta',puede=ab&&(isEst()||(isProf()&&s.docente_id===M.id)),ia=ab&&s.modo!=='companeros'&&s.tutor_activo&&puede;
  return`<div class="aic-card" style="padding:18px"><button onclick="LAB.open('${s.lab}')" style="font-weight:700;color:#1e63e9">← ${e(LN[s.lab][2])}</button><h2 style="font-weight:800;font-size:19px;margin:6px 0">💬 ${e(s.titulo)}</h2>
  <p style="color:#64748b;font-size:13px">${MODO[s.modo]} · ${ab?'Abierta':'Cerrada'}</p>${s.tema?`<p style="margin:6px 0">${e(s.tema)}</p>`:''}
  <p style="font-size:12px;color:#92400e;background:#fffbeb;border-radius:8px;padding:8px">Respeta a tus compañeros: argumenta sin ofender. Tu docente puede leer y borrar mensajes. No escribas datos personales.${s.modo!=='companeros'?' El tutor IA usa un proveedor externo de inteligencia artificial.':''}</p>
  <div id="msgs" style="display:grid;gap:8px;margin:10px 0;max-height:420px;overflow:auto;padding:4px">${msgsHtml()}</div>
  ${puede?`<div style="display:flex;gap:6px"><textarea id="sm" rows="2" style="${inp}" placeholder="Escribe tu argumento…" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();LAB.msgSend()}"></textarea>${B('#1e63e9','Enviar','onclick="LAB.msgSend()"')}</div>`:(ab?'<p style="color:#64748b">Eres observador: puedes leer pero no escribir.</p>':'<p style="color:#64748b">Esta sala está cerrada.</p>')}
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">${ia?B('#7c3aed','🤖 Pedir opinión al tutor IA','onclick="LAB.msgIA()"'):''}${isProf()&&s.docente_id===M.id?B('#b45309',ab?'Cerrar sala':'Reabrir sala','onclick="LAB.salaEstado()"'):''}${B('#475569','↻ Actualizar','onclick="LAB.msgRef()"')}</div></div>`}
async function msgSend(){const t=document.getElementById('sm');const v=(t.value||'').trim();if(!v||Z.busy)return;Z.busy=true;
  try{const {error}=await sb.rpc('lab_enviar_mensaje',{p_sala:Z.sala.id,p_texto:v});if(error)throw error;t.value='';await refrescaMsgs();scrollM();
    if(isEst()&&Z.sala.modo==='tutor'){Z.busy=false;await msgIA(true)}}catch(er){err(er)}Z.busy=false}
async function msgIA(auto){if(Z.busy&&!auto)return;Z.busy=true;if(!auto)toast('🤖 El tutor está pensando…');
  try{const {data,error}=await sb.functions.invoke('lab-tutor',{body:{sala_id:Z.sala.id}});if(error){let m=error.message;try{const b=await error.context.json();if(b&&b.error)m=b.error}catch(_){}throw new Error(m)}
    if(data&&data.sin_clave)throw new Error('El tutor IA aún no está activado en el servidor.');if(data.error)throw new Error(data.error);await refrescaMsgs();scrollM()}catch(er){toast(er.message)}Z.busy=false}
async function msgDel(id){if(!confirm('¿Borrar este mensaje?'))return;const {error}=await sb.from('lab_mensajes').delete().eq('id',id);if(error)return err(error);await refrescaMsgs();}
async function salaEstado(){const n=Z.sala.estado==='abierta'?'cerrada':'abierta';const {error}=await sb.from('lab_salas').update({estado:n}).eq('id',Z.sala.id);if(error)return err(error);Z.sala.estado=n;await cargaSalas();render()}

/* ---------- pantalla principal ---------- */
function home(){
  const bd=(isProf()||isDir())?`<div style="margin:0 0 12px">${B('#475569','📊 Ver estadísticas','onclick="LAB.dash()"')}</div>`:'';
  const rol=isEst()?'Practica, explora y entrega tus experiencias.':isProf()?'Crea experiencias, publícalas a tus cursos y califica.':'Consulta lo que publican los docentes (solo lectura).';
  return`<div class="aic-card" style="padding:18px"><h2 style="font-weight:800;font-size:20px">🔬 Centro de Laboratorios</h2><p style="color:#64748b;margin:4px 0 14px">${rol}</p>
  ${bd}<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px">${LABS.map(l=>{const n=exDe(l[0]).filter(x=>isProf()||isDir()||x.estado!=='borrador').length;
    return`<div onclick="LAB.open('${l[0]}')" style="${card};cursor:pointer"><div style="font-size:30px">${l[1]}</div><div style="font-weight:800;margin-top:4px">${e(l[2])}</div><div style="font-size:12px;color:#64748b;margin:4px 0 8px">${e(l[3])}</div><div style="font-size:12px;font-weight:700;color:#1e63e9">${n} experiencia${n===1?'':'s'}</div></div>`}).join('')}</div></div>`;
}
function labPage(){
  const l=LN[Z.lab],xs=exDe(Z.lab).filter(x=>isProf()||isDir()||x.estado==='publicada'||x.estado==='cerrada');
  const ing=Z.lab==='ingles';
  const tools=`<div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0">${ing&&!isDir()?B('#7c3aed','🗣️ Practicar inglés','onclick="LAB.eng()"'):''}${!isDir()?B('#0ea5e9','🤖 Tutor IA','onclick="LAB.tutor()"'):''}${isProf()?B('#16a34a','➕ Crear experiencia','onclick="LAB.nueva()"'):''}${isProf()?Object.entries(PLA).filter(([k,p])=>p.lab===Z.lab).map(([k,p])=>B('#0d9488',p.nombre+' (plantilla)','onclick="LAB.pla(\''+k+'\')"')).join(''):''}${isDir()?B('#475569','⚙️ Tutor IA del colegio','onclick="LAB.cfgView()"'):''}${(isProf()||isDir())?B('#0d9488','✋ Asistencia de hoy','onclick="LAB.verAsis()"'):''}${isProf()?B('#be185d','💬 Nueva sala de debate','onclick="LAB.nuevaSala()"'):''}</div>`;
  const sa=Z.salas.filter(s=>s.lab===Z.lab);
  const salasH=sa.length?`<h3 style="font-weight:800;margin:6px 0">💬 Salas de debate</h3><div style="display:grid;gap:8px;margin-bottom:14px">${sa.map(s=>`<div style="${card};display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap"><div><b>${e(s.titulo)}</b><div style="font-size:12px;color:#64748b">${MODO[s.modo]} · ${s.estado==='abierta'?'Abierta':'Cerrada'}</div></div>${B('#be185d',s.estado==='abierta'?'Entrar':'Ver',`onclick="LAB.sala('${s.id}')"`)}</div>`).join('')}</div>`:'';
  const lista=xs.length?xs.map(x=>{const en=Z.ents[x.id];const st=isEst()?(en?(en.estado==='calificada'?'Calificada: '+(en.nota??'—')+' / 5':en.estado==='enviada'?'Enviada':'En borrador'):'Pendiente'):ESTADO[x.estado];
    return`<div style="${card};display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div style="min-width:200px"><div style="font-weight:800">${e(x.titulo)}</div><div style="font-size:12px;color:#64748b">${e(x.descripcion||'')}${isDir()?' · Docente: '+e(Z.nom[x.docente_id]||''):''}${x.cierra?' · Cierra '+fF(x.cierra):''}</div><div style="font-size:12px;font-weight:700;color:#1e63e9;margin-top:3px">${st}</div></div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">${isEst()?B('#1e63e9',en?'Abrir':'Empezar',`onclick="LAB.abrir('${x.id}')"`):''}${isProf()?B('#475569','Editar',`onclick="LAB.editar('${x.id}')"`)+B('#1e63e9','Entregas',`onclick="LAB.entregas('${x.id}')"`)+B('#64748b','Duplicar',`onclick="LAB.dup('${x.id}')"`):''}${isDir()?B('#1e63e9','Ver',`onclick="LAB.abrir('${x.id}')"`)+B('#1e63e9','Entregas',`onclick="LAB.entregas('${x.id}')"`):''}</div></div>`}).join(''):`<p style="color:#64748b">${isEst()?'Tu docente aún no ha publicado experiencias en este laboratorio.':'Todavía no hay experiencias aquí.'}</p>`;
  return`<div class="aic-card" style="padding:18px"><button onclick="LAB.home()" style="font-weight:700;color:#1e63e9">← Todos los laboratorios</button><h2 style="font-weight:800;font-size:20px;margin-top:8px">${l[1]} ${e(l[2])}</h2><p style="color:#64748b">${e(l[3])}</p>${tools}
  
  ${(window.SIM&&SIM.list(Z.lab).length)?`<h3 style="font-weight:800;margin:6px 0">🧰 Simuladores</h3><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin-bottom:14px">${SIM.list(Z.lab).map(s=>`<div onclick="LAB.sim('${s.id}')" style="${card};cursor:pointer"><b>${e(s.t)}</b><div style="font-size:12px;color:#64748b;margin-top:4px">${e(s.d)}</div></div>`).join('')}</div><h3 style="font-weight:800;margin:6px 0">📋 Experiencias</h3>`:''}
  ${salasH}<div style="display:grid;gap:10px">${lista}</div></div>`;
}

/* ---------- plantillas (diario de práctica, portafolio) ---------- */
const PLA={
 diario:{lab:'edfisica',nombre:'📓 Diario de práctica',titulo:'Diario de práctica física',descripcion:'Registra tu actividad física de la semana',objetivos:'Reflexionar sobre mi práctica, mi esfuerzo y mi salud.',
  q:[['abierta','¿Qué actividad física hiciste y cuánto tiempo duró?'],['abierta','¿Cómo te sentiste antes, durante y después?'],['abierta','¿Qué mejoraste o qué te costó trabajo?'],['archivo','Foto o evidencia de tu práctica (opcional, solo si te sientes cómodo/a)']],r:['Constancia','Reflexión','Esfuerzo y actitud']},
 portafolio:{lab:'arte',nombre:'🖼️ Portafolio',titulo:'Portafolio artístico',descripcion:'Sube tu obra y explica tu proceso',objetivos:'Crear, explicar y valorar mi proceso artístico.',
  q:[['archivo','Sube foto o archivo de tu obra'],['abierta','Explica tu idea y los materiales o técnicas que usaste'],['abierta','¿Qué aprendiste y qué mejorarías?'],['audio','Opcional: graba una explicación de tu obra']],r:['Creatividad','Técnica','Proceso y reflexión','Presentación']}};
function nuevaPla(k){const p=PLA[k];Z.ed={...nuevaEd(),lab:p.lab,titulo:p.titulo,descripcion:p.descripcion,objetivos:p.objetivos,rubrica:p.r.join('\n'),
  preguntas:p.q.map((q,i)=>({id:'q'+Date.now().toString(36)+i,tipo:q[0],texto:q[1],opciones:[]}))};Z.v='build';render()}

/* ---------- constructor de experiencias (docente) ---------- */
const BL=[['intro','Introducción'],['materiales','Materiales'],['exploracion','Exploración'],['practica','Práctica'],['conclusiones','Conclusiones']];
function nuevaEd(){return{id:null,lab:Z.lab,titulo:'',descripcion:'',objetivos:'',competencias:'',nivel:'A1',cursos:[],bloques:{},preguntas:[],claves:{},rubrica:'',abre:'',cierra:'',intentos:1,tutor_activo:true,evaluable:true,estado:'borrador'}}
const loc=d=>d?new Date(d).toISOString().slice(0,16):'';
async function editar(id){const x=Z.exps.find(a=>a.id===id);const k=await sb.from('lab_claves').select('claves').eq('experiencia_id',id).maybeSingle();
  Z.ed={...x,abre:loc(x.abre),cierra:loc(x.cierra),claves:(k.data&&k.data.claves)||{},rubrica:(x.rubrica||[]).map(r=>r.c).join('\n'),bloques:x.bloques||{},preguntas:x.preguntas||[]};Z.v='build';render()}
function sync(){const g=i=>document.getElementById(i);if(!Z.ed||!g('lb_t'))return;const d=Z.ed;
  d.titulo=g('lb_t').value;d.descripcion=g('lb_d').value;d.objetivos=g('lb_o').value;d.competencias=g('lb_c').value;if(g('lb_n'))d.nivel=g('lb_n').value;if(g('lb_s'))d.sim=g('lb_s').value;
  d.cursos=[...document.querySelectorAll('.lb_cu:checked')].map(c=>c.value);BL.forEach(([k])=>d.bloques[k]=g('lb_b_'+k).value);
  d.rubrica=g('lb_r').value;d.abre=g('lb_ab').value;d.cierra=g('lb_ci').value;d.intentos=Math.max(1,+g('lb_in').value||1);d.tutor_activo=g('lb_tu').checked;d.evaluable=g('lb_ev').checked;
  d.preguntas.forEach((q,i)=>{q.tipo=g('lq_t'+i).value;q.texto=g('lq_x'+i).value;if(q.tipo==='opcion'){q.opciones=g('lq_o'+i).value.split('\n').map(s=>s.trim()).filter(Boolean);const c=document.querySelector('input[name=lq_c'+i+']:checked');d.claves[q.id]=c?c.value:(d.claves[q.id]||'0')}})}
function builder(){const d=Z.ed;if(!d)return'';const ing=d.lab==='ingles';
  const lab=(t,h)=>`<label style="display:block;font-weight:800;font-size:12px;margin:10px 0 3px">${t}</label>${h}`;
  return`<div class="aic-card" style="padding:18px"><button onclick="LAB.open('${d.lab}')" style="font-weight:700;color:#1e63e9">← Volver</button><h2 style="font-weight:800;font-size:19px;margin:6px 0">${LN[d.lab][1]} ${d.id?'Editar':'Nueva'} experiencia · ${e(LN[d.lab][2])}</h2>
  ${lab('Título','<input id="lb_t" style="'+inp+'" value="'+e(d.titulo)+'">')}${lab('Descripción corta','<input id="lb_d" style="'+inp+'" value="'+e(d.descripcion)+'">')}
  ${lab('Objetivos de aprendizaje','<textarea id="lb_o" rows="2" style="'+inp+'">'+e(d.objetivos)+'</textarea>')}${lab('Competencias / DBA (los que tú indiques)','<input id="lb_c" style="'+inp+'" value="'+e(d.competencias)+'">')}
  ${(window.SIM&&SIM.list(d.lab).length)?lab('Simulador para esta experiencia (opcional)','<select id="lb_s" style="'+inp+'"><option value="">Ninguno</option>'+SIM.list(d.lab).map(s=>`<option value="${s.id}" ${d.sim===s.id?'selected':''}>${e(s.t)}</option>`).join('')+'</select>'):''}
  ${ing?lab('Nivel','<select id="lb_n" style="'+inp+'">'+['Pre-A1','A1','A2','B1'].map(n=>`<option ${n===d.nivel?'selected':''}>${n}</option>`).join('')+'</select>'):''}
  ${lab('Cursos a los que se asigna',Z.cursos.length?Z.cursos.map(c=>`<label style="margin-right:12px;font-size:14px"><input type="checkbox" class="lb_cu" value="${c.id}" ${d.cursos.includes(c.id)?'checked':''}> ${c.grade}° ${e(c.name)}</label>`).join(''):'<span style="color:#b91c1c">No tienes cursos creados todavía.</span>')}
  ${BL.map(([k,t])=>lab(t,'<textarea id="lb_b_'+k+'" rows="3" style="'+inp+'">'+e(d.bloques[k]||'')+'</textarea>')).join('')}
  <h3 style="font-weight:800;margin:16px 0 4px">Preguntas y evidencias</h3>
  ${d.preguntas.map((q,i)=>`<div style="${card};margin-bottom:8px"><div style="display:flex;gap:8px;flex-wrap:wrap"><select id="lq_t${i}" onchange="LAB.rq()" style="${inp};width:auto"><option value="opcion" ${q.tipo==='opcion'?'selected':''}>Opción múltiple (se corrige sola)</option><option value="abierta" ${q.tipo==='abierta'?'selected':''}>Respuesta abierta</option><option value="audio" ${q.tipo==='audio'?'selected':''}>Grabación de voz/audio</option><option value="archivo" ${q.tipo==='archivo'?'selected':''}>Subir foto o archivo</option></select>${B('#dc2626','Quitar',`onclick="LAB.qdel(${i})"`)}</div>
   <textarea id="lq_x${i}" rows="2" placeholder="Enunciado" style="${inp};margin-top:6px">${e(q.texto||'')}</textarea>
   ${q.tipo==='opcion'?`<textarea id="lq_o${i}" rows="4" placeholder="Una opción por línea" style="${inp};margin-top:6px">${e((q.opciones||[]).join('\n'))}</textarea><div style="font-size:12px;margin-top:4px">Correcta: ${(q.opciones||[]).map((o,k)=>`<label style="margin-right:8px"><input type="radio" name="lq_c${i}" value="${k}" ${String(d.claves[q.id]??'0')===String(k)?'checked':''}> ${k+1}</label>`).join('')}</div>`:''}</div>`).join('')}
  ${B('#0ea5e9','➕ Agregar pregunta','onclick="LAB.qadd()"')}
  ${lab('Rúbrica (un criterio por línea; el docente lo puntúa de 1 a 5)','<textarea id="lb_r" rows="3" style="'+inp+'">'+e(d.rubrica)+'</textarea>')}
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px">${lab('Abre','<input id="lb_ab" type="datetime-local" style="'+inp+'" value="'+d.abre+'">')}${lab('Cierra','<input id="lb_ci" type="datetime-local" style="'+inp+'" value="'+d.cierra+'">')}${lab('Intentos','<input id="lb_in" type="number" min="1" max="5" style="'+inp+'" value="'+d.intentos+'">')}</div>
  <label style="display:block;margin-top:10px"><input id="lb_tu" type="checkbox" ${d.tutor_activo?'checked':''}> Permitir tutor IA en esta experiencia</label><label style="display:block;margin-top:4px"><input id="lb_ev" type="checkbox" ${d.evaluable?'checked':''}> Es evaluable (la nota aparece en “Mis notas” del estudiante)</label>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">${B('#475569','💾 Guardar borrador','onclick="LAB.guardar(\'borrador\')"')}${B('#16a34a','🚀 Publicar a mis cursos','onclick="LAB.guardar(\'publicada\')"')}${d.id&&d.estado==='publicada'?B('#b45309','Cerrar','onclick="LAB.guardar(\'cerrada\')"'):''}${d.id?B('#dc2626','Eliminar','onclick="LAB.del()"'):''}</div></div>`;
}
async function guardar(estado){sync();const d=Z.ed;if(!d.titulo.trim())return toast('Escribe un título');
  if(estado==='publicada'&&!d.cursos.length)return toast('Elige al menos un curso para publicar');
  if(d.preguntas.some(q=>!q.texto.trim()||(q.tipo==='opcion'&&(q.opciones||[]).length<2)))return toast('Revisa las preguntas: enunciado y mínimo 2 opciones');
  const row={docente_id:M.id,colegio_id:M.colegio_id,lab:d.lab,titulo:d.titulo.trim(),descripcion:d.descripcion,objetivos:d.objetivos,competencias:d.competencias,nivel:d.lab==='ingles'?d.nivel:null,sim:d.sim||null,cursos:d.cursos,bloques:d.bloques,
    preguntas:d.preguntas.map(({id,tipo,texto,opciones})=>({id,tipo,texto,opciones:opciones||[]})),rubrica:d.rubrica.split('\n').map(s=>s.trim()).filter(Boolean).map(c=>({c})),abre:d.abre?new Date(d.abre).toISOString():null,cierra:d.cierra?new Date(d.cierra).toISOString():null,intentos:d.intentos,tutor_activo:d.tutor_activo,evaluable:d.evaluable,estado,updated_at:new Date().toISOString()};
  let id=d.id,r;if(id)r=await sb.from('lab_experiencias').update(row).eq('id',id).select('id').single();else r=await sb.from('lab_experiencias').insert(row).select('id').single();
  if(r.error)return err(r.error);id=r.data.id;
  const cl={};d.preguntas.filter(q=>q.tipo==='opcion').forEach(q=>cl[q.id]=String(d.claves[q.id]??'0'));
  const k=await sb.from('lab_claves').upsert({experiencia_id:id,claves:cl});if(k.error)return err(k.error);
  toast(estado==='publicada'?'✅ Publicada':'💾 Guardado');await load();Z.v='lab';render()}

/* ---------- estudiante: hacer una experiencia ---------- */
let rec=null;
function exp(){const x=Z.cur,en=Z.ents[x.id]||{},bl=x.bloques||{};const cerr=en.estado==='calificada';const ro=cerr||isDir()||(en.estado==='enviada'&&(en.intentos||0)>=x.intentos);
  const R=en.respuestas||{};
  return`<div class="aic-card" style="padding:18px"><button onclick="LAB.open('${x.lab}')" style="font-weight:700;color:#1e63e9">← ${e(LN[x.lab][2])}</button><h2 style="font-weight:800;font-size:19px;margin:6px 0">${e(x.titulo)}</h2>
  ${x.objetivos?`<p><b>Objetivos:</b> ${e(x.objetivos)}</p>`:''}${x.competencias?`<p style="font-size:12px;color:#64748b">Competencias: ${e(x.competencias)}</p>`:''}
  ${BL.filter(([k])=>bl[k]).map(([k,t])=>`<div style="${card};margin:8px 0"><b>${t}</b><div style="white-space:pre-wrap;margin-top:4px">${e(bl[k])}</div></div>`).join('')}
  ${x.sim&&window.SIM&&SIM.get(x.sim)?`<div style="margin:8px 0">${B('#7c3aed','🧰 Abrir simulador: '+e(SIM.get(x.sim).t),'onclick="LAB.sim(\''+x.sim+'\',\'exp\')"')}</div>`:''}
  ${(x.preguntas||[]).map((q,i)=>`<div style="${card};margin:8px 0"><b>${i+1}. ${e(q.texto)}</b>${q.tipo==='opcion'?(q.opciones||[]).map((o,k)=>`<label style="display:block;margin:5px 0"><input type="radio" data-q="${q.id}" name="r_${q.id}" value="${k}" ${String(R[q.id])===String(k)?'checked':''} ${ro?'disabled':''}> ${e(o)}</label>`).join('')
   :q.tipo==='abierta'?`<textarea data-q="${q.id}" rows="3" style="${inp};margin-top:6px" ${ro?'disabled':''}>${e(R[q.id]||'')}</textarea>`
   :`<div style="margin-top:6px">${(en.evidencias||[]).filter(v=>v.q===q.id).map(v=>`<div style="font-size:12px">📎 ${e(v.nombre)}</div>`).join('')}${ro||isDir()?'':q.tipo==='audio'?B('#dc2626','🎙️ Grabar','onclick="LAB.grabar(\''+q.id+'\')"')+' <span id="rec_'+q.id+'" style="font-size:12px"></span>':`<input type="file" onchange="LAB.sube('${q.id}',this)" accept="image/*,application/pdf,audio/*">`}</div>`}</div>`).join('')}
  ${en.estado==='calificada'?`<div style="${card};background:#f0fdf4;margin-top:10px"><b>Nota: ${en.nota} / 5</b>${en.retro?`<div style="margin-top:4px">${e(en.retro)}</div>`:''}</div>`:en.estado==='enviada'?`<p style="color:#15803d;font-weight:700">✅ Enviada ${en.auto_total?'· Preguntas automáticas: '+en.auto_correctas+' de '+en.auto_total:''}</p>`:''}
  ${!ro?`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">${B('#475569','💾 Guardar borrador','onclick="LAB.envia(false)"')}${B('#16a34a','📤 Enviar','onclick="LAB.envia(true)"')}${x.tutor_activo?B('#0ea5e9','🤖 Pedir ayuda al tutor','onclick="LAB.tutor(\''+x.id+'\')"'):''}</div>${navigator.onLine?'':'<p style="font-size:12px;color:#b45309">Sin internet: se guardará en este dispositivo y se enviará al volver la conexión.</p>'}`:''}</div>`;
}
function leer(){const R={};document.querySelectorAll('[data-q]').forEach(el=>{if(el.type==='radio'){if(el.checked)R[el.dataset.q]=el.value}else R[el.dataset.q]=el.value});return R}
async function envia(enviar){const x=Z.cur;if(Z.busy)return;const en=Z.ents[x.id]||{};const resp={...(en.respuestas||{}),...leer()},evid=en.evidencias||[];
  if(enviar&&!confirm('¿Enviar tu trabajo? Después no podrás cambiarlo (salvo que tengas más intentos).'))return;
  Z.busy=true;
  try{if(!navigator.onLine)throw new Error('offline');
    const {data,error}=await sb.rpc('lab_guardar_entrega',{p_exp:x.id,p_resp:resp,p_evid:evid,p_enviar:enviar});if(error)throw error;
    toast(enviar?'✅ Enviado'+(data.total?' · '+data.correctas+' de '+data.total+' automáticas':''):'💾 Guardado');
    const r=await sb.from('lab_entregas').select('*').eq('experiencia_id',x.id).eq('user_id',M.id).maybeSingle();if(r.data)Z.ents[x.id]=r.data;
  }catch(er){
    if(String(er.message)==='offline'||/fetch|network/i.test(String(er.message))){const q=qGet().filter(i=>!(i.exp===x.id&&i.enviar===enviar));q.push({exp:x.id,resp,evid,enviar});qSet(q);Z.ents[x.id]={...en,respuestas:resp,estado:en.estado||'borrador'};toast('📴 Guardado en este dispositivo. Se enviará cuando haya internet.')}else err(er)}
  Z.busy=false;render()}
async function subir(blob,nombre,qid){const x=Z.cur;if(!navigator.onLine)return toast('Para subir archivos necesitas internet');
  const path=`${M.colegio_id}/${M.id}/${x.id}/${Date.now()}_${nombre.replace(/[^\w.\-]/g,'_')}`;
  const {error}=await sb.storage.from('lab-evidencias').upload(path,blob,{contentType:blob.type||'application/octet-stream'});if(error)return err(error);
  const en=Z.ents[x.id]||{respuestas:{},evidencias:[],estado:'borrador'};en.evidencias=[...(en.evidencias||[]),{q:qid,path,nombre}];Z.ents[x.id]=en;
  const r=await sb.rpc('lab_guardar_entrega',{p_exp:x.id,p_resp:{...(en.respuestas||{}),...leer()},p_evid:en.evidencias,p_enviar:false});if(r.error)return err(r.error);
  const g=await sb.from('lab_entregas').select('*').eq('experiencia_id',x.id).eq('user_id',M.id).maybeSingle();if(g.data)Z.ents[x.id]=g.data;toast('📎 Evidencia subida');render()}
async function grabar(qid){const s=document.getElementById('rec_'+qid);
  if(rec){rec.stop();return}
  if(!navigator.mediaDevices||!window.MediaRecorder)return toast('Tu navegador no permite grabar. Sube un archivo de audio.');
  try{const st=await navigator.mediaDevices.getUserMedia({audio:true});const ch=[];rec=new MediaRecorder(st);rec.ondataavailable=ev=>ch.push(ev.data);
    rec.onstop=async()=>{st.getTracks().forEach(t=>t.stop());const t=rec.mimeType||'audio/webm';rec=null;const b=new Blob(ch,{type:t});await subir(b,'audio.'+(t.includes('mp4')?'m4a':'webm'),qid)};
    rec.start();if(s)s.textContent='🔴 Grabando… pulsa de nuevo 🎙️ para terminar (máx. 2 min)';setTimeout(()=>{if(rec)rec.stop()},120000)}
  catch(_){toast('No se pudo usar el micrófono. Revisa el permiso del navegador.')}}

/* ---------- docente: entregas y calificación ---------- */
async function entregas(id){Z.cur=Z.exps.find(a=>a.id===id);const r=await sb.rpc('lab_entregas_exp',{p_exp:id});if(r.error)return err(r.error);Z.lista=r.data||[];Z.v='entregas';render()}
function vEntregas(){const x=Z.cur,L=Z.lista,env=L.filter(a=>a.estado!=='sin iniciar'&&a.estado!=='borrador').length,cal=L.filter(a=>a.nota!=null),prom=cal.length?(cal.reduce((s,a)=>s+Number(a.nota),0)/cal.length).toFixed(1):'—';
  return`<div class="aic-card" style="padding:18px"><button onclick="LAB.open('${x.lab}')" style="font-weight:700;color:#1e63e9">← Volver</button><h2 style="font-weight:800;font-size:19px;margin:6px 0">Entregas · ${e(x.titulo)}</h2>
  <p style="color:#64748b">${L.length} estudiantes · ${env} enviaron · ${cal.length} calificados · promedio ${prom}</p>
  <div class="aic-table-wrap"><table style="min-width:520px"><thead><tr><th>ESTUDIANTE</th><th>ESTADO</th><th>AUTOMÁTICAS</th><th>NOTA</th><th></th></tr></thead><tbody>${L.map(a=>`<tr><td>${e(a.full_name)}</td><td>${e(a.estado)}</td><td>${a.auto_total?a.auto_correctas+'/'+a.auto_total:'—'}</td><td>${a.nota??'—'}</td><td>${a.estado==='enviada'||a.estado==='calificada'?(isProf()?B('#1e63e9','Calificar',`onclick="LAB.calif('${a.user_id}')"`):B('#475569','Ver',`onclick="LAB.calif('${a.user_id}')"`)):''}</td></tr>`).join('')}</tbody></table></div></div>`}
async function calif(uid){const r=await sb.from('lab_entregas').select('*').eq('experiencia_id',Z.cur.id).eq('user_id',uid).single();if(r.error)return err(r.error);Z.ent={...r.data,nombre:(Z.lista.find(a=>a.user_id===uid)||{}).full_name,urls:{}};
  for(const v of (Z.ent.evidencias||[])){const s=await sb.storage.from('lab-evidencias').createSignedUrl(v.path,3600);if(s.data)Z.ent.urls[v.path]=s.data.signedUrl}Z.v='calif';render()}
function vCalif(){const x=Z.cur,n=Z.ent,R=n.respuestas||{},ro=!isProf();
  return`<div class="aic-card" style="padding:18px"><button onclick="LAB.entregas('${x.id}')" style="font-weight:700;color:#1e63e9">← Entregas</button><h2 style="font-weight:800;font-size:18px;margin:6px 0">${e(n.nombre||'')} · ${e(x.titulo)}</h2>
  ${(x.preguntas||[]).map((q,i)=>{const ev=(n.evidencias||[]).filter(v=>v.q===q.id);return`<div style="${card};margin:8px 0"><b>${i+1}. ${e(q.texto)}</b><div style="margin-top:4px">${q.tipo==='opcion'?'Respondió: '+e((q.opciones||[])[R[q.id]]??'—'):q.tipo==='abierta'?'<span style="white-space:pre-wrap">'+e(R[q.id]||'—')+'</span>':ev.length?ev.map(v=>/\.(webm|m4a|mp3|ogg|wav)$/i.test(v.path)?`<audio controls src="${n.urls[v.path]||''}" style="width:100%;margin-top:4px"></audio>`:`<a href="${n.urls[v.path]||'#'}" target="_blank" style="color:#1e63e9">📎 ${e(v.nombre)}</a>`).join('<br>'):'Sin evidencia'}</div></div>`}).join('')}
  ${(x.rubrica||[]).length?`<div style="${card};margin:8px 0"><b>Rúbrica (1 a 5)</b>${x.rubrica.map((r,i)=>`<div style="display:flex;justify-content:space-between;margin-top:5px"><span>${e(r.c)}</span><input id="cr_${i}" type="number" min="1" max="5" step="1" ${ro?'disabled':''} value="${(n.rubrica||[])[i]??''}" style="width:60px;padding:5px;border:1.5px solid #cbd5e1;border-radius:8px"></div>`).join('')}</div>`:''}
  <label style="font-weight:800;font-size:12px">Nota final (0 a 5)</label><input id="cn" type="number" min="0" max="5" step="0.1" style="${inp};max-width:120px" value="${n.nota??''}" ${ro?'disabled':''}>
  <label style="font-weight:800;font-size:12px;display:block;margin-top:8px">Retroalimentación</label><textarea id="cre" rows="3" style="${inp}" ${ro?'disabled':''}>${e(n.retro||'')}</textarea>
  ${ro?'':`<div style="margin-top:10px">${B('#16a34a','💾 Guardar calificación','onclick="LAB.guardaNota()"')}</div><p style="font-size:12px;color:#64748b">La IA nunca cambia notas: solo tú calificas.</p>`}</div>`}
async function guardaNota(){const x=Z.cur,n=Z.ent;const ru=(x.rubrica||[]).map((_,i)=>{const v=document.getElementById('cr_'+i).value;return v===''?null:+v});
  const nota=document.getElementById('cn').value;const {error}=await sb.rpc('lab_calificar',{p_entrega:n.id,p_nota:nota===''?null:+nota,p_retro:document.getElementById('cre').value,p_rubrica:ru});if(error)return err(error);toast('✅ Calificación guardada');await entregas(x.id)}

/* ---------- configuración del tutor IA (directivo) ---------- */
function vCfg(){const c=Z.cfg[Z.lab]||{tutor_activo:true,limite_dia:20};
  return`<div class="aic-card" style="padding:18px"><button onclick="LAB.open('${Z.lab}')" style="font-weight:700;color:#1e63e9">← Volver</button><h2 style="font-weight:800;font-size:18px;margin:6px 0">⚙️ Tutor IA · ${e(LN[Z.lab][2])}</h2>
  <label style="display:block;margin:8px 0"><input id="cf_a" type="checkbox" ${c.tutor_activo?'checked':''}> Tutor IA activo para este laboratorio</label><label style="font-weight:800;font-size:12px">Mensajes por estudiante al día</label><input id="cf_l" type="number" min="1" max="100" style="${inp};max-width:120px" value="${c.limite_dia}">
  <div style="margin-top:10px">${B('#16a34a','Guardar','onclick="LAB.guardaCfg()"')}</div></div>`}
async function guardaCfg(){const {error}=await sb.from('lab_config').upsert({colegio_id:M.colegio_id,lab:Z.lab,tutor_activo:document.getElementById('cf_a').checked,limite_dia:Math.max(1,+document.getElementById('cf_l').value||20)});if(error)return err(error);await load();toast('✅ Guardado');Z.v='lab';render()}

/* ---------- tutor IA (chat) ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const hablar=(t,l)=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=l||'es-CO';u.rate=.9;speechSynthesis.speak(u)}catch(_){toast('Tu navegador no puede leer en voz alta')}};
function vTutor(){const ing=Z.lab==='ingles';
  return`<div class="aic-card" style="padding:18px"><button onclick="LAB.open('${Z.lab}')" style="font-weight:700;color:#1e63e9">← ${e(LN[Z.lab][2])}</button><h2 style="font-weight:800;font-size:18px;margin:6px 0">🤖 Tutor IA · ${e(LN[Z.lab][2])}</h2>
  <p style="font-size:12px;color:#92400e;background:#fffbeb;border-radius:8px;padding:8px">Este tutor usa inteligencia artificial de un proveedor externo. No escribas datos personales (nombre completo, teléfono, dirección). Puede equivocarse: verifica con tu docente. Te guía, no hace tus tareas.</p>
  ${ing?`<label style="font-size:12px;font-weight:800">Nivel </label><select id="tn" onchange="LAB.nv(this.value)" style="padding:6px;border-radius:8px;border:1.5px solid #cbd5e1">${['Pre-A1','A1','A2','B1'].map(n=>`<option ${n===Z.nivel?'selected':''}>${n}</option>`).join('')}</select>`:''}
  <div id="chat" style="margin:10px 0;display:grid;gap:8px;max-height:380px;overflow:auto">${Z.chat.map((m,i)=>`<div style="${m.role==='user'?'justify-self:end;background:#e8f1ff':'justify-self:start;background:#f1f5f9'};padding:9px 12px;border-radius:12px;max-width:88%;white-space:pre-wrap">${e(m.content)}${m.role==='assistant'&&ing?` <button onclick="LAB.leer(${i})" title="Escuchar">🔊</button>`:''}</div>`).join('')||'<p style="color:#64748b">Escribe tu primera pregunta'+(ing?' (en inglés o español) o usa el 🎤':'')+'.</p>'}</div>
  <div style="display:flex;gap:6px"><input id="tm" style="${inp}" placeholder="Escribe aquí…" onkeydown="if(event.key==='Enter')LAB.envT()">${ing&&SR?B('#7c3aed','🎤','onclick="LAB.dictar()"'):''}${B('#1e63e9','Enviar','onclick="LAB.envT()"')}</div></div>`}
async function envT(){const i=document.getElementById('tm');const t=(i.value||'').trim();if(!t||Z.busy)return;Z.chat.push({role:'user',content:t});Z.busy=true;render();
  try{const {data,error}=await sb.functions.invoke('lab-tutor',{body:{lab:Z.lab,nivel:Z.nivel,experiencia_id:Z.tutorExp||null,mensajes:Z.chat}});
    if(error){let m=error.message;try{const b=await error.context.json();if(b&&b.error)m=b.error}catch(_){}throw new Error(m)}
    if(data&&data.sin_clave)throw new Error('El tutor IA aún no está activado en el servidor.');if(data.error)throw new Error(data.error);
    Z.chat.push({role:'assistant',content:data.texto});if(Z.lab==='ingles'&&data.texto)hablar(data.texto.replace(/Tip:.*$/ms,''),'en-US')}
  catch(er){Z.chat.pop();toast(er.message)}Z.busy=false;render();setTimeout(()=>{const c=document.getElementById('chat');if(c)c.scrollTop=c.scrollHeight},50)}
function dictar(){if(!SR)return toast('Tu navegador no tiene dictado por voz. Escribe el mensaje.');const r=new SR();r.lang='en-US';r.onresult=ev=>{document.getElementById('tm').value=ev.results[0][0].transcript};r.onerror=()=>toast('No se pudo escuchar. Revisa el permiso del micrófono.');r.start();toast('🎤 Habla ahora…')}

/* ---------- English Lab: vocabulario, listening, speaking ---------- */
const VOC={
'Pre-A1':[['cat','gato','The cat is small.'],['dog','perro','I have a dog.'],['red','rojo','The apple is red.'],['book','libro','This is my book.'],['school','colegio','I go to school.'],['water','agua','I drink water.'],['mother','mamá','My mother is kind.'],['hello','hola','Hello, my friend!']],
'A1':[['breakfast','desayuno','I eat breakfast at seven.'],['family','familia','I love my family.'],['happy','feliz','She is happy today.'],['teacher','profesor/a','My teacher is nice.'],['weekend','fin de semana','I play soccer on the weekend.'],['kitchen','cocina','Mom is in the kitchen.'],['friend','amigo/a','He is my best friend.'],['market','mercado','We go to the market.']],
'A2':[['borrow','pedir prestado','Can I borrow your pencil?'],['travel','viajar','I want to travel to Spain.'],['weather','clima','The weather is cold today.'],['neighbor','vecino/a','My neighbor has a garden.'],['delicious','delicioso','The soup is delicious.'],['dangerous','peligroso','The road is dangerous.'],['invite','invitar','I invite you to my party.'],['improve','mejorar','I want to improve my English.']],
'B1':[['achieve','lograr','She worked hard to achieve her goals.'],['environment','medio ambiente','We must protect the environment.'],['opportunity','oportunidad','This is a great opportunity.'],['although','aunque','Although it rained, we played.'],['experience','experiencia','I have experience with computers.'],['suggest','sugerir','I suggest we study together.'],['responsible','responsable','He is responsible for the project.'],['develop','desarrollar','Technology helps us develop ideas.']]};
const norm=s=>String(s).toLowerCase().replace(/[^a-z' ]/g,'').trim();
function sim(a,b){a=norm(a).split(/\s+/).filter(Boolean);b=norm(b).split(/\s+/).filter(Boolean);if(!b.length)return 0;return Math.round(100*b.filter(w=>a.includes(w)).length/b.length)}
const mezcla=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
async function guardaPr(skill,pt,tot){try{await sb.from('lab_practica').insert({colegio_id:M.colegio_id,lab:'ingles',skill,nivel:Z.nivel,puntaje:pt,total:tot})}catch(_){}}
function vIng(){const n=Z.nivel,w=VOC[n],S=Z.ing||(Z.ing={tab:'voc',i:0,q:null,res:null,pr:[]});
  const tabs=[['voc','📚 Vocabulary'],['lis','👂 Listening'],['spk','🎤 Speaking'],['res','📊 Mis resultados']].map(([k,t])=>`<button onclick="LAB.it('${k}')" style="padding:8px 12px;border-radius:10px;font-weight:800;border:1.5px solid ${S.tab===k?'#7c3aed':'#cbd5e1'};background:${S.tab===k?'#f3e8ff':'#fff'}">${t}</button>`).join('');
  let c='';
  if(S.tab==='voc'){const [en,es,ej]=w[S.i%w.length];c=`<div style="${card};text-align:center"><div style="font-size:34px;font-weight:800">${e(en)}</div><div style="color:#64748b;margin:4px 0">${e(es)}</div><div style="font-style:italic;margin:8px 0">“${e(ej)}”</div><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${B('#7c3aed','🔊 Listen',`onclick="LAB.say('${en}')"`)}${B('#0ea5e9','🔊 Example',`onclick="LAB.say(\`${ej}\`)"`)}${B('#475569','Next ▶','onclick="LAB.nx()"')}</div></div>`}
  if(S.tab==='lis'){if(!S.q){const t=w[Math.floor(Math.random()*w.length)];const ops=mezcla([t,...mezcla(w.filter(x=>x!==t)).slice(0,2)]);S.q={t,ops}}
    c=`<div style="${card}"><p><b>Escucha y elige la palabra que oíste</b></p>${B('#7c3aed','🔊 Play','onclick="LAB.say(\''+S.q.t[0]+'\')"')}<div style="display:grid;gap:8px;margin-top:10px">${S.q.ops.map(o=>`<button onclick="LAB.lisR('${o[0]}')" style="padding:10px;border:1.5px solid #cbd5e1;border-radius:10px;font-weight:700;text-align:left">${e(o[0])} <span style="color:#64748b;font-weight:400">· ${e(o[1])}</span></button>`).join('')}</div>${S.res?`<p style="margin-top:10px;font-weight:800;color:${S.res.ok?'#15803d':'#b91c1c'}">${S.res.ok?'✅ Correct!':'❌ Era “'+e(S.q.t[0])+'”'}</p>${B('#475569','Siguiente ▶','onclick="LAB.lisN()"')}`:''}</div>`}
  if(S.tab==='spk'){const [en,,ej]=w[S.i%w.length];c=`<div style="${card};text-align:center"><p style="color:#64748b">Lee en voz alta esta frase</p><div style="font-size:22px;font-weight:800;margin:6px 0">${e(ej)}</div>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${B('#7c3aed','🔊 Escuchar modelo',`onclick="LAB.say(\`${ej}\`)"`)}${SR?B('#dc2626','🎤 Hablar','onclick="LAB.spk()"'):''}${B('#475569','Otra ▶','onclick="LAB.nx()"')}</div>
    ${SR?'':'<p style="font-size:12px;color:#92400e;margin-top:8px">Tu navegador no reconoce voz (en iPhone o Firefox es limitado). Usa Chrome en Android/PC, o practica repitiendo y pide a tu docente una actividad con grabación de audio.</p>'}
    ${S.res?`<p style="margin-top:10px;font-weight:800">Escuché: “${e(S.res.heard)}” · Coincidencia: ${S.res.pct}% ${S.res.pct>=80?'🌟':S.res.pct>=50?'👍 Casi':'🔁 Inténtalo otra vez'}</p>`:''}</div>`}
  if(S.tab==='res'){const R=S.pr||[];const by={};R.forEach(r=>{(by[r.skill]=by[r.skill]||{p:0,t:0}).p+=r.puntaje;by[r.skill].t+=r.total});
    c=`<div style="${card}"><b>Tus resultados por habilidad (nivel ${n})</b>${Object.keys(by).length?Object.entries(by).map(([k,v])=>`<div style="margin-top:8px"><div style="display:flex;justify-content:space-between"><span>${({listening:'Listening',speaking:'Speaking'})[k]||k}</span><span>${v.p}/${v.t}</span></div><div style="height:8px;background:#e2e8f0;border-radius:6px"><div style="height:8px;width:${v.t?Math.round(100*v.p/v.t):0}%;background:#7c3aed;border-radius:6px"></div></div></div>`).join(''):'<p style="color:#64748b">Aún no tienes práctica guardada.</p>'}<p style="font-size:12px;color:#64748b;margin-top:8px">Esta práctica libre no cambia tus notas oficiales.</p></div>`}
  return`<div class="aic-card" style="padding:18px"><button onclick="LAB.open('ingles')" style="font-weight:700;color:#1e63e9">← English Lab</button><h2 style="font-weight:800;font-size:19px;margin:6px 0">🗣️ Practicar inglés</h2>
  <label style="font-size:12px;font-weight:800">Nivel </label><select onchange="LAB.nv(this.value)" style="padding:6px;border-radius:8px;border:1.5px solid #cbd5e1">${['Pre-A1','A1','A2','B1'].map(x=>`<option ${x===n?'selected':''}>${x}</option>`).join('')}</select>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0">${tabs}</div>${c}</div>`}
function vSim(){const s=SIM.get(Z.simId);return`<div class="aic-card" style="padding:18px"><button onclick="LAB.${Z.cur&&Z.back==='exp'?'abrir(\''+Z.cur.id+'\')':'open(\''+Z.lab+'\')'}" style="font-weight:700;color:#1e63e9">← Volver</button><h2 style="font-weight:800;font-size:19px;margin:6px 0">🧰 ${e(s.t)}</h2><p style="color:#64748b;margin-bottom:8px">${e(s.d)}</p><div id="simbox"></div></div>`}
async function cargaDash(){const r=await sb.from('lab_entregas').select('experiencia_id,estado,nota,auto_correctas,auto_total');Z.dEnt=r.data||[];
  const p=await sb.from('lab_practica').select('skill,puntaje,total,nivel');Z.dPr=p.data||[];Z.dOk=true;Z.v='dash';render()}
function vDash(){const fl=Z.fLab||'',fc=Z.fCur||'';const xs=Z.exps.filter(x=>(!fl||x.lab===fl)&&(!fc||(x.cursos||[]).includes(fc))&&x.estado!=='borrador');
  const fila=xs.map(x=>{const en=Z.dEnt.filter(a=>a.experiencia_id===x.id&&a.estado!=='borrador'),cal=en.filter(a=>a.nota!=null),pr=cal.length?(cal.reduce((s,a)=>s+Number(a.nota),0)/cal.length).toFixed(1):'—';
    const at=en.filter(a=>a.auto_total),pa=at.length?Math.round(100*at.reduce((s,a)=>s+a.auto_correctas,0)/at.reduce((s,a)=>s+a.auto_total,0))+'%':'—';
    return`<tr><td>${LN[x.lab][1]} ${e(LN[x.lab][2])}</td><td>${e(x.titulo)}${isDir()?'<br><small>'+e(Z.nom[x.docente_id]||'')+'</small>':''}</td><td>${en.length}</td><td>${cal.length}</td><td>${pr}</td><td>${pa}</td></tr>`}).join('');
  const by={};Z.dPr.forEach(r=>{(by[r.skill]=by[r.skill]||{p:0,t:0,n:0}).p+=r.puntaje;by[r.skill].t+=r.total;by[r.skill].n++});
  return`<div class="aic-card" style="padding:18px"><button onclick="LAB.home()" style="font-weight:700;color:#1e63e9">← Laboratorios</button><h2 style="font-weight:800;font-size:19px;margin:6px 0">📊 Estadísticas de laboratorios</h2><p style="font-size:12px;color:#64748b">Datos reales de las entregas de tus estudiantes.</p>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0"><select onchange="LAB.fl(this.value)" style="padding:7px;border-radius:8px;border:1.5px solid #cbd5e1"><option value="">Todos los laboratorios</option>${LABS.map(l=>`<option value="${l[0]}" ${fl===l[0]?'selected':''}>${l[2]}</option>`).join('')}</select>${isProf()?`<select onchange="LAB.fc(this.value)" style="padding:7px;border-radius:8px;border:1.5px solid #cbd5e1"><option value="">Todos mis cursos</option>${Z.cursos.map(c=>`<option value="${c.id}" ${fc===c.id?'selected':''}>${c.grade}° ${e(c.name)}</option>`).join('')}</select>`:''}</div>
  ${fila?`<div class="aic-table-wrap"><table style="min-width:560px"><thead><tr><th>LABORATORIO</th><th>EXPERIENCIA</th><th>ENVIADAS</th><th>CALIFICADAS</th><th>PROMEDIO</th><th>ACIERTO AUTO</th></tr></thead><tbody>${fila}</tbody></table></div>`:'<p style="color:#64748b">Aún no hay experiencias publicadas con estos filtros.</p>'}
  ${Object.keys(by).length?`<h3 style="font-weight:800;margin:14px 0 4px">English Lab · práctica libre por habilidad</h3>${Object.entries(by).map(([k,v])=>`<div>${k}: ${v.p}/${v.t} aciertos (${v.n} intentos)</div>`).join('')}`:''}</div>`}
function vistaActual(){if(!Z.ok)return'<div class="aic-card" style="padding:18px">Cargando laboratorios…</div>';
  return({home,lab:labPage,build:builder,exp,entregas:vEntregas,calif:vCalif,cfg:vCfg,tutor:vTutor,ing:vIng,sim:vSim,dash:vDash,gate:vGate,alista:vAlista,salaNew:vSalaNew,sala:vSala})[Z.v]()}

return{load,view:()=>vistaActual(),
  home(){Z.v='home';render()},
  async open(l){Z.lab=l;if(isEst()&&!(await asistio(l))){Z.v='gate';render();return}if(isEst()||isProf()||isDir())await cargaSalas();Z.v='lab';render()},
  asiste:registrarAsis,verAsis,nuevaSala,salaCrear,sala:entrarSala,msgSend,msgIA,msgDel,msgRef(){refrescaMsgs().then(()=>toast('Actualizado'))},salaEstado,
  nueva(){Z.ed=nuevaEd();Z.v='build';render()},editar,
  async dup(id){const x=Z.exps.find(a=>a.id===id);const {id:_,created_at,updated_at,...r}=x;const k=await sb.from('lab_claves').select('claves').eq('experiencia_id',id).maybeSingle();
    const n=await sb.from('lab_experiencias').insert({...r,titulo:x.titulo+' (copia)',estado:'borrador'}).select('id').single();if(n.error)return err(n.error);
    if(k.data)await sb.from('lab_claves').insert({experiencia_id:n.data.id,claves:k.data.claves});toast('📄 Duplicada como borrador');await load();render()},
  rq(){sync();render()},
  qadd(){sync();Z.ed.preguntas.push({id:'q'+Date.now().toString(36),tipo:'opcion',texto:'',opciones:['','']});render()},
  qdel(i){sync();Z.ed.preguntas.splice(i,1);render()},
  guardar,
  async del(){if(!confirm('¿Eliminar esta experiencia y todas sus entregas? No se puede deshacer.'))return;const {error}=await sb.from('lab_experiencias').delete().eq('id',Z.ed.id);if(error)return err(error);await load();Z.v='lab';render()},
  async abrir(id){Z.cur=Z.exps.find(a=>a.id===id);if(isEst()&&!navigator.onLine===false){const r=await sb.from('lab_entregas').select('*').eq('experiencia_id',id).eq('user_id',M.id).maybeSingle();if(r.data)Z.ents[id]=r.data}Z.v='exp';render()},
  envia,grabar,async sube(q,el){const f=el.files[0];if(f)await subir(f,f.name,q)},
  entregas,calif,guardaNota,
  sim(id,back){Z.simId=id;Z.back=back||'lab';Z.v='sim';render();setTimeout(()=>{const b=document.getElementById('simbox');if(b)SIM.get(id).mount(b)},0)},
  dash:cargaDash,fl(v){Z.fLab=v;render()},fc(v){Z.fCur=v;render()},pla:nuevaPla,
  cfgView(){Z.v='cfg';render()},guardaCfg,
  tutor(expId){Z.tutorExp=expId||null;Z.v='tutor';render()},envT,dictar,
  leer(i){hablar(Z.chat[i].content.replace(/Tip:.*$/ms,''),'en-US')},
  nv(v){Z.nivel=v;Z.ing&&(Z.ing.q=null,Z.ing.res=null,Z.ing.i=0);render()},
  async eng(){Z.v='ing';Z.ing={tab:'voc',i:0,q:null,res:null,pr:[]};const r=await sb.from('lab_practica').select('skill,puntaje,total').eq('user_id',M.id).eq('lab','ingles').eq('nivel',Z.nivel);Z.ing.pr=r.data||[];render()},
  it(k){Z.ing.tab=k;Z.ing.res=null;Z.ing.q=null;if(k==='res')sb.from('lab_practica').select('skill,puntaje,total').eq('user_id',M.id).eq('lab','ingles').eq('nivel',Z.nivel).then(r=>{Z.ing.pr=r.data||[];render()});render()},
  say:t=>hablar(t,'en-US'),
  nx(){Z.ing.i++;Z.ing.res=null;render()},
  lisR(o){const S=Z.ing;S.res={ok:o===S.q.t[0]};guardaPr('listening',S.res.ok?1:0,1);S.pr.push({skill:'listening',puntaje:S.res.ok?1:0,total:1});render()},
  lisN(){Z.ing.q=null;Z.ing.res=null;render()},
  spk(){const S=Z.ing,w=VOC[Z.nivel],ej=w[S.i%w.length][2];const r=new SR();r.lang='en-US';r.maxAlternatives=1;
    r.onresult=ev=>{const h=ev.results[0][0].transcript,p=sim(h,ej);S.res={heard:h,pct:p};guardaPr('speaking',p>=80?1:0,1);S.pr.push({skill:'speaking',puntaje:p>=80?1:0,total:1});render()};
    r.onerror=()=>toast('No se pudo escuchar. Revisa el permiso del micrófono.');r.start();toast('🎤 Habla ahora…')}
};})();
