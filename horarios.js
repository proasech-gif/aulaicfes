/* AulaICFES · horarios.js
   Horarios del colegio (Fase 2). Se carga solo cuando se abre la pestaña "Horarios" o "Mi horario".
   Rector y coordinador arman y publican. El docente solo ve el horario publicado.
   El motor que genera el horario está en horario.js (window.HZ). */
(function(){
'use strict';
const DN=['','Lun','Mar','Mié','Jue','Vie','Sáb'],DL=['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const SEC=[['jornada','⏰ Jornada'],['grupos','🏫 Grupos'],['asigs','📚 Asignaturas'],['docs','👩‍🏫 Docentes'],['aulas','🚪 Aulas'],['asign','🔗 Asignaciones'],['restr','📏 Restricciones'],['gen','⚡ Generar'],['vers','🗂️ Versiones']];
const S={sec:'jornada',colegio:'',dias:[1,2,3,4,5],franjas:[],grupos:[],docentes:[],asigs:[],aulas:[],asigns:[],nd:[],restr:[],vers:[],
  gen:null,rev:null,busy:false,vw:{clases:[],titulo:''},verId:'',modo:'grupo',item:'',dispDoc:'',pubOk:false,miDoc:null,iniMi:false,pegarMsg:''};

/* estilos propios (la hoja de estilos de la app no trae todas las clases) */
if(!document.getElementById('hz-css')){const st=document.createElement('style');st.id='hz-css';st.textContent='.hz-gap1{gap:.25rem}.hz-end{align-items:flex-end}.hz-mb1{margin-bottom:.25rem}.hz-mb3{margin-bottom:.75rem}.hz-mr1{margin-right:.25rem}.hz-mt3{margin-top:.75rem}.hz-px2{padding-left:.5rem;padding-right:.5rem}.hz-sy1>*+*{margin-top:.25rem}.hz-amber{color:#b45309}.hz-emerald{color:#047857}';document.head.appendChild(st)}
/* ---------- utilidades ---------- */
const q=id=>document.getElementById(id);
const val=id=>{const e=q(id);return e?String(e.value).trim():''};
const chk=id=>{const e=q(id);return!!(e&&e.checked)};
const ok=r=>{if(r&&r.error)throw r.error;return(r&&r.data)||[]};
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const fd=x=>x?new Date(x).toLocaleDateString('es-CO'):'—';
const card=h=>`<div class="bg-white rounded-2xl p-4 shadow">${h}</div>`;
const btn=(fn,t,c)=>`<button onclick="${fn}" class="px-3 py-1.5 rounded-lg text-xs ${c||'bg-slate-200'}">${t}</button>`;
const BTN='bg-indigo-600 text-white';
const IN='border rounded-lg p-2';
const nGr=g=>g.grado+'° '+g.nombre;
const hora=f=>f.inicio&&f.fin?String(f.inicio).slice(0,5)+'–'+String(f.fin).slice(0,5):'';
const clasesF=()=>S.franjas.filter(f=>f.es_clase);
const dicc=a=>new Map(a.map(x=>[x.id,x]));
async function todas(mk){let out=[],d=0;for(;;){const r=await mk().range(d,d+999);if(r.error)throw r.error;out=out.concat(r.data||[]);if(!r.data||r.data.length<1000)break;d+=1000}return out}
async function run(fn){try{await fn()}catch(e){S.busy=false;err(e);render()}}
function cambio(){S.gen=null;S.rev=null}
async function engine(){await loadScript('horario.js?v=1');return window.HZ}

/* ---------- carga de datos ---------- */
async function cargar(){
  const c=M.colegio_id;if(!c)return;
  const f=t=>todas(()=>sb.from(t).select('*').eq('colegio_id',c));
  const [col,cfg,fr,gr,dc,as,au,asg,nd,rs,vs]=await Promise.all([
    sb.from('colegios').select('nombre').eq('id',c).single(),
    sb.from('hz_config').select('dias').eq('colegio_id',c).maybeSingle(),
    f('hz_franjas'),f('hz_grupos'),f('hz_docentes'),f('hz_asignaturas'),f('hz_aulas'),f('hz_asignaciones'),f('hz_no_disponible'),f('hz_restricciones'),
    sb.from('hz_versiones').select('id,nombre,estado,puntuacion,resumen,created_at,publicado_at').eq('colegio_id',c).order('created_at',{ascending:false})]);
  S.colegio=(col.data&&col.data.nombre)||'';
  S.dias=(cfg.data&&cfg.data.dias&&cfg.data.dias.length?cfg.data.dias:[1,2,3,4,5]).slice().sort();
  S.franjas=fr.sort((a,b)=>a.orden-b.orden);
  S.grupos=gr.sort((a,b)=>a.grado-b.grado||a.nombre.localeCompare(b.nombre));
  S.docentes=dc.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  S.asigs=as.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  S.aulas=au.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  S.asigns=asg;S.nd=nd;S.restr=rs.sort((a,b)=>String(a.created_at).localeCompare(String(b.created_at)));
  S.vers=ok(vs);
}
async function cargarPublicado(){
  const v=S.vers.find(x=>x.estado==='publicado');
  S.pubOk=!!v;
  if(v){const cl=await todas(()=>sb.from('hz_clases').select('asignacion_id,dia,franja_id,aula_id').eq('version_id',v.id));S.vw={clases:cl,titulo:v.nombre}}
  else S.vw={clases:[],titulo:''};
  S.miDoc=S.docentes.find(d=>d.user_id===M.id)||null;
}
function entrada(){
  return{dias:S.dias,
    franjas:S.franjas.map(f=>({id:f.id,orden:f.orden,es_clase:f.es_clase})),
    grupos:S.grupos.map(g=>({id:g.id,grado:g.grado,nombre:g.nombre})),
    asignaturas:S.asigs.map(a=>({id:a.id,nombre:a.nombre,area:a.area,aula_tipo:a.aula_tipo})),
    docentes:S.docentes.map(d=>({id:d.id,nombre:d.nombre})),
    asignaciones:S.asigns.map(a=>({id:a.id,docente_id:a.docente_id,grupo_id:a.grupo_id,asignatura_id:a.asignatura_id,horas:a.horas})),
    aulas:S.aulas.map(a=>({id:a.id,tipo:a.tipo,activa:a.activa})),
    noDisponible:S.nd.map(n=>({docente_id:n.docente_id,dia:n.dia,franja_id:n.franja_id})),
    restricciones:S.restr.map(r=>({id:r.id,alcance:r.alcance,grado:r.grado,grupo_id:r.grupo_id,sobre:r.sobre,objetivo:r.objetivo,tipo:r.tipo,dias:r.dias||[],franjas:r.franjas||[],valor:r.valor,fuerza:r.fuerza}))};
}

/* ---------- cuadrícula del horario (también sirve para imprimir) ---------- */
function opciones(){
  if(S.modo==='grupo')return S.grupos.map(g=>[g.id,nGr(g)]);
  if(S.modo==='docente')return S.docentes.map(d=>[d.id,d.nombre]);
  return S.aulas.map(a=>[a.id,a.nombre]);
}
const TD='style="border:1px solid #cbd5e1;padding:6px;vertical-align:top"';
function tabla(modo,id){
  const A=dicc(S.asigns),AS=dicc(S.asigs),DC=dicc(S.docentes),GR=dicc(S.grupos),AU=dicc(S.aulas),cel=new Map();
  for(const c of S.vw.clases){
    const a=A.get(c.asignacion_id);if(!a)continue;
    const es=modo==='grupo'?a.grupo_id===id:modo==='docente'?a.docente_id===id:c.aula_id===id;if(!es)continue;
    const as=AS.get(a.asignatura_id),g=GR.get(a.grupo_id),d=DC.get(a.docente_id),au=c.aula_id?AU.get(c.aula_id):null;
    const l2=modo==='grupo'?(d?d.nombre:''):modo==='docente'?(g?nGr(g):''):((g?nGr(g):'')+' · '+(d?d.nombre:''));
    const l3=modo!=='aula'&&au?au.nombre:'';
    const k=c.dia+'|'+c.franja_id;
    cel.set(k,(cel.get(k)||[]).concat(`<div class="font-semibold">${E(as?as.nombre:'?')}</div><div class="text-xs text-slate-500">${E(l2)}${l3?' · '+E(l3):''}</div>`));
  }
  const nd=S.dias.length+1;
  return`<table class="w-full text-sm" style="border-collapse:collapse;min-width:520px"><tr><th ${TD}>Hora</th>${S.dias.map(d=>`<th ${TD}>${DL[d]}</th>`).join('')}</tr>${S.franjas.map(f=>f.es_clase
    ?`<tr><td ${TD}><b>${E(f.nombre)}</b><div class="text-xs text-slate-500">${hora(f)}</div></td>${S.dias.map(d=>`<td ${TD}>${(cel.get(d+'|'+f.id)||[]).join('')}</td>`).join('')}</tr>`
    :`<tr><td ${TD} colspan="${nd}" style="border:1px solid #cbd5e1;padding:4px;text-align:center;background:#f1f5f9">${E(f.nombre)} ${hora(f)}</td></tr>`).join('')}</table>`;
}
function vGrid(){
  const ops=opciones();if(!ops.find(o=>o[0]===S.item))S.item=ops[0]?ops[0][0]:'';
  const modos=[['grupo','Grupo'],['docente','Docente'],['aula','Aula']];
  return card(`<div class="flex flex-wrap gap-2 items-center hz-mb3"><b class="text-sm">Ver por</b>
    <select class="${IN}" onchange="HZUI.setModo(this.value)">${modos.map(([k,l])=>`<option value="${k}" ${S.modo===k?'selected':''}>${l}</option>`).join('')}</select>
    <select class="${IN}" onchange="HZUI.setItem(this.value)">${ops.map(([k,l])=>`<option value="${k}" ${S.item===k?'selected':''}>${E(l)}</option>`).join('')}</select>
    ${btn('HZUI.print(0)','🖨️ Imprimir este')}${btn('HZUI.print(1)','🖨️ Imprimir todos')}</div>
    <p class="text-xs text-slate-500 mb-2">${E(S.vw.titulo||'')}</p>
    <div class="overflow-x-auto">${ops.length?tabla(S.modo,S.item):'<p class="text-sm text-slate-500">No hay nada que mostrar todavía.</p>'}</div>`);
}

/* ---------- secciones ---------- */
function vJornada(){
  const fr=S.franjas.map(f=>`<tr class="border-t"><td class="py-1">${f.orden}</td><td>${E(f.nombre)}</td><td>${hora(f)||'—'}</td><td>${f.es_clase?'Clase':'Descanso'}</td><td>${btn(`HZUI.delFranja('${f.id}')`,'Quitar')}</td></tr>`).join('');
  return`<div class="space-y-4">${card(`<h3 class="font-semibold mb-2">📅 Días de clase</h3><div class="flex flex-wrap gap-3">${[1,2,3,4,5,6].map(d=>`<label class="text-sm flex items-center hz-gap1"><input type="checkbox" ${S.dias.includes(d)?'checked':''} onchange="HZUI.toggleDia(${d},this.checked)"> ${DL[d]}</label>`).join('')}</div>`)}
  ${card(`<h3 class="font-semibold mb-2">⏰ Franjas de la jornada</h3><p class="text-xs text-slate-500 mb-2">Crea cada hora de clase y cada descanso, en orden. Los descansos no llevan clase.</p>
    ${S.franjas.length?`<div class="overflow-x-auto"><table class="w-full text-sm"><tr class="text-left text-slate-500"><th>N.º</th><th>Nombre</th><th>Horario</th><th>Tipo</th><th></th></tr>${fr}</table></div>`:'<p class="text-sm text-slate-500 mb-2">Todavía no hay franjas.</p>'}
    <div class="flex flex-wrap gap-2 hz-end hz-mt3"><input id="hz_fnom" class="${IN}" placeholder="Nombre (ej. 1ª hora)"><input id="hz_fini" type="time" class="${IN}"><input id="hz_ffin" type="time" class="${IN}"><label class="text-sm flex items-center hz-gap1"><input id="hz_fcl" type="checkbox" checked> Es hora de clase</label>${btn('HZUI.addFranja()','Agregar',BTN)}</div>
    ${S.franjas.length?'':`<div class="hz-mt3">${btn('HZUI.jornadaEjemplo()','✨ Crear una jornada de ejemplo (6 horas y un descanso)','bg-emerald-600 text-white')}</div>`}`)}</div>`;
}
function vGrupos(){
  const porGrado={};S.grupos.forEach(g=>(porGrado[g.grado]=porGrado[g.grado]||[]).push(g));
  const lista=Object.keys(porGrado).sort((a,b)=>a-b).map(k=>`<div class="mb-2"><b class="text-sm">${k}°</b> ${porGrado[k].map(g=>`<span class="inline-block bg-slate-100 rounded-lg hz-px2 py-1 text-sm hz-mr1">${E(g.nombre)} <button onclick="HZUI.delGrupo('${g.id}')" title="Quitar" style="color:#dc2626">✕</button></span>`).join('')}</div>`).join('');
  const sel=id=>`<select id="${id}" class="${IN}">${[0,1,2,3,4,5,6,7,8,9,10,11].map(g=>`<option value="${g}" ${g===(id==='hz_gd'?6:11)?'selected':''}>${g}°</option>`).join('')}</select>`;
  return card(`<h3 class="font-semibold mb-2">🏫 Grupos del colegio</h3>${lista||'<p class="text-sm text-slate-500 mb-2">Todavía no hay grupos.</p>'}
    <div class="flex flex-wrap gap-2 hz-end hz-mt3"><label class="text-sm">Desde ${sel('hz_gd')}</label><label class="text-sm">Hasta ${sel('hz_gh')}</label><label class="text-sm">Letras o números de los grupos<input id="hz_gl" class="${IN}" value="A,B" placeholder="A,B,C"></label>${btn('HZUI.crearGrupos()','Crear grupos',BTN)}</div>
    <p class="text-xs text-slate-500 mt-2">Ejemplo: de 6° a 11° con "A,B" crea 6°A, 6°B, 7°A… 11°B.</p>`);
}
function vAsigs(){
  const l=S.asigs.map(a=>`<tr class="border-t"><td class="py-1">${E(a.nombre)}</td><td>${E(a.area)}</td><td>${E(a.aula_tipo||'—')}</td><td>${btn(`HZUI.delAsig('${a.id}')`,'Quitar')}</td></tr>`).join('');
  return card(`<h3 class="font-semibold mb-2">📚 Asignaturas</h3>${S.asigs.length?`<div class="overflow-x-auto"><table class="w-full text-sm"><tr class="text-left text-slate-500"><th>Asignatura</th><th>Área</th><th>Aula especial</th><th></th></tr>${l}</table></div>`:'<p class="text-sm text-slate-500 mb-2">Todavía no hay asignaturas.</p>'}
    <div class="flex flex-wrap gap-2 hz-end hz-mt3"><input id="hz_anom" class="${IN}" placeholder="Asignatura"><input id="hz_aare" class="${IN}" placeholder="Área (ej. Ciencias Naturales)"><input id="hz_atip" class="${IN}" placeholder="Tipo de aula (opcional)">${btn('HZUI.addAsig()','Agregar',BTN)}</div>
    <div class="hz-mt3">${btn('HZUI.cargarCatalogo()','📥 Cargar las asignaturas del catálogo de AulaICFES','bg-emerald-600 text-white')}</div>
    <p class="text-xs text-slate-500 mt-2">El área es importante: con ella puedes poner reglas como "Matemáticas solo lunes y miércoles". Si una asignatura necesita un aula especial (laboratorio, sala de sistemas), escribe su tipo.</p>`);
}
function vDocs(){
  const hrs={};S.asigns.forEach(a=>{hrs[a.docente_id]=(hrs[a.docente_id]||0)+a.horas});
  const l=S.docentes.map(d=>{const nb=S.nd.filter(n=>n.docente_id===d.id).length;
    return`<div class="border rounded-xl p-3 flex flex-wrap items-center justify-between gap-2"><div><div class="font-semibold">${E(d.nombre)} ${d.user_id?'<span class="text-xs hz-emerald">· con cuenta</span>':''}</div><div class="text-xs text-slate-500">${hrs[d.id]||0} hora(s) asignadas · ${nb?nb+' franja(s) en las que no puede':'disponible siempre'}</div></div><div class="flex gap-2">${btn(`HZUI.abrirDisp('${d.id}')`,'🗓 Disponibilidad')}${btn(`HZUI.delDoc('${d.id}')`,'Quitar')}</div></div>`}).join('');
  let disp='';
  const dd=S.docentes.find(d=>d.id===S.dispDoc);
  if(dd)disp=card(`<h3 class="font-semibold hz-mb1">Disponibilidad de ${E(dd.nombre)}</h3><p class="text-xs text-slate-500 mb-2">Toca las casillas en las que <b>NO</b> puede dar clase (quedan en rojo).</p><div class="overflow-x-auto"><table class="text-sm" style="border-collapse:collapse"><tr><th></th>${S.dias.map(d=>`<th ${TD}>${DN[d]}</th>`).join('')}</tr>${clasesF().map(f=>`<tr><td ${TD}>${E(f.nombre)}</td>${S.dias.map(d=>{const no=S.nd.some(n=>n.docente_id===dd.id&&n.dia===d&&n.franja_id===f.id);return`<td onclick="HZUI.toggleND('${dd.id}',${d},'${f.id}')" style="border:1px solid #cbd5e1;padding:10px;cursor:pointer;text-align:center;background:${no?'#fecaca':'#ecfdf5'}">${no?'✕':'✓'}</td>`}).join('')}</tr>`).join('')}</table></div><div class="mt-2">${btn('HZUI.cerrarDisp()','Cerrar')}</div>`);
  return`<div class="space-y-4">${card(`<h3 class="font-semibold mb-2">👩‍🏫 Docentes del horario</h3><div class="space-y-2">${l||'<p class="text-sm text-slate-500">Todavía no hay docentes.</p>'}</div>
    <div class="flex flex-wrap gap-2 hz-end hz-mt3"><input id="hz_dnom" class="${IN}" placeholder="Nombre del docente">${btn('HZUI.addDoc()','Agregar',BTN)}</div>
    <div class="hz-mt3">${btn('HZUI.traerDocentes()','📥 Traer los docentes registrados en AulaICFES de mi colegio','bg-emerald-600 text-white')}</div>
    <p class="text-xs text-slate-500 mt-2">Los docentes con cuenta podrán ver su propio horario en la pestaña "Mi horario". Puedes agregar también docentes que aún no tienen cuenta.</p>`)}${disp}</div>`;
}
function vAulas(){
  const l=S.aulas.map(a=>`<tr class="border-t"><td class="py-1">${E(a.nombre)}</td><td>${E(a.tipo)}</td><td>${btn(`HZUI.delAula('${a.id}')`,'Quitar')}</td></tr>`).join('');
  return card(`<h3 class="font-semibold mb-2">🚪 Aulas (opcional)</h3><p class="text-xs text-slate-500 mb-2">Si no registras aulas, el horario no controla los salones. Regístralas solo si quieres evitar que dos grupos usen el mismo laboratorio a la vez.</p>
    ${S.aulas.length?`<table class="w-full text-sm"><tr class="text-left text-slate-500"><th>Aula</th><th>Tipo</th><th></th></tr>${l}</table>`:''}
    <div class="flex flex-wrap gap-2 hz-end hz-mt3"><input id="hz_unom" class="${IN}" placeholder="Nombre (ej. Laboratorio 1)"><input id="hz_utip" class="${IN}" value="general" placeholder="Tipo (general, laboratorio…)">${btn('HZUI.addAula()','Agregar',BTN)}</div>`);
}
function vAsign(){
  const GR=dicc(S.grupos),AS=dicc(S.asigs),DC=dicc(S.docentes);
  const lista=S.asigns.slice().sort((a,b)=>{const ga=GR.get(a.grupo_id),gb=GR.get(b.grupo_id);return(ga?ga.grado:0)-(gb?gb.grado:0)||String(ga&&ga.nombre).localeCompare(String(gb&&gb.nombre))}).map(a=>{const g=GR.get(a.grupo_id),s=AS.get(a.asignatura_id),d=DC.get(a.docente_id);
    return`<tr class="border-t"><td class="py-1">${g?E(nGr(g)):'?'}</td><td>${s?E(s.nombre):'?'}</td><td>${d?E(d.nombre):'?'}</td><td>${a.horas}</td><td>${btn(`HZUI.delAsign('${a.id}')`,'Quitar')}</td></tr>`}).join('');
  const cap=S.dias.length*clasesF().length,porG={};S.asigns.forEach(a=>{porG[a.grupo_id]=(porG[a.grupo_id]||0)+a.horas});
  const resumen=S.grupos.filter(g=>porG[g.id]).map(g=>`<span class="inline-block rounded-lg hz-px2 py-1 text-xs hz-mr1 hz-mb1" style="background:${porG[g.id]>cap?'#fecaca':'#e2e8f0'}">${E(nGr(g))}: ${porG[g.id]}/${cap} h</span>`).join('');
  const grados=[...new Set(S.grupos.map(g=>g.grado))].sort((a,b)=>a-b);
  return`<div class="space-y-4">${card(`<h3 class="font-semibold mb-2">🔗 Quién dicta qué, a qué grupo y cuántas horas</h3>
    <div class="flex flex-wrap gap-2 hz-end"><label class="text-sm block">Grupo<select id="hz_ag" class="${IN}">${grados.map(g=>`<option value="grado:${g}">Todos los grupos de ${g}°</option>`).join('')}${S.grupos.map(g=>`<option value="g:${g.id}">${E(nGr(g))}</option>`).join('')}</select></label>
    <label class="text-sm block">Asignatura<select id="hz_aa" class="${IN}">${S.asigs.map(a=>`<option value="${a.id}">${E(a.nombre)}</option>`).join('')}</select></label>
    <label class="text-sm block">Docente<select id="hz_ad" class="${IN}">${S.docentes.map(d=>`<option value="${d.id}">${E(d.nombre)}</option>`).join('')}</select></label>
    <label class="text-sm block">Horas por semana<input id="hz_ah" type="number" min="1" max="20" value="3" class="${IN}" style="width:6rem"></label>${btn('HZUI.addAsign()','Agregar',BTN)}</div>
    ${resumen?`<p class="text-xs text-slate-500 hz-mt3">Horas por grupo frente a las que caben en la semana: ${resumen}</p>`:''}`)}
  ${card(`<h3 class="font-semibold mb-2">📋 Lista de asignaciones (${S.asigns.length})</h3>${S.asigns.length?`<div class="overflow-x-auto"><table class="w-full text-sm"><tr class="text-left text-slate-500"><th>Grupo</th><th>Asignatura</th><th>Docente</th><th>Horas</th><th></th></tr>${lista}</table></div>`:'<p class="text-sm text-slate-500">Todavía no hay asignaciones.</p>'}`)}
  ${card(`<h3 class="font-semibold hz-mb1">⚡ Cargar muchas de una vez</h3><p class="text-xs text-slate-500 mb-2">Pega una línea por asignación, separando con punto y coma: <b>Grupo; Asignatura; Docente; Horas</b>. Ejemplo: <code>9A; Matemáticas; Ana Pérez; 4</code></p>
    <textarea id="hz_paste" rows="5" class="w-full border rounded-lg p-2" placeholder="9A; Matemáticas; Ana Pérez; 4&#10;9B; Matemáticas; Ana Pérez; 4"></textarea>
    <label class="text-sm flex items-center hz-gap1 mt-1"><input id="hz_pcrear" type="checkbox" checked> Crear los docentes y asignaturas que no existan</label>
    <div class="mt-2">${btn('HZUI.pegar()','Cargar lista',BTN)}</div>${S.pegarMsg?`<div class="text-sm mt-2">${S.pegarMsg}</div>`:''}`)}</div>`;
}
const SOBRE={area:'Área',asignatura:'Asignatura',docente:'Docente'};
function nombreObj(r){if(r.sobre==='area')return r.objetivo;if(r.sobre==='asignatura'){const a=S.asigs.find(x=>x.id===r.objetivo);return a?a.nombre:'(borrada)'}const d=S.docentes.find(x=>x.id===r.objetivo);return d?d.nombre:'(borrado)'}
function descR(r){
  const g=r.alcance==='grupo'?S.grupos.find(x=>x.id===r.grupo_id):null;
  const ambito=r.alcance==='colegio'?'en todo el colegio':r.alcance==='grado'?'en '+r.grado+'°':'en '+(g?nGr(g):'un grupo');
  const fr=n=>(r.franjas||[]).slice().sort((a,b)=>a-b).join(', ');
  const q={solo_dias:'solo los días '+(r.dias||[]).map(d=>DN[d]).join(', '),nunca_dias:'nunca los días '+(r.dias||[]).map(d=>DN[d]).join(', '),solo_franjas:'solo en las horas n.º '+fr(),nunca_franjas:'nunca en las horas n.º '+fr(),max_por_dia:'máximo '+r.valor+' hora(s) por día',bloque_doble:'en bloques de 2 horas seguidas'}[r.tipo];
  return`${SOBRE[r.sobre]} <b>${E(nombreObj(r))}</b> ${E(ambito)}: ${E(q)} <span class="text-xs ${r.fuerza==='obligatoria'?'text-red-700':'hz-amber'}">(${r.fuerza})</span>`;
}
function vRestr(){
  const l=S.restr.map(r=>`<div class="border rounded-xl p-3 flex flex-wrap items-center justify-between gap-2"><div class="text-sm">${descR(r)}${r.nota?`<div class="text-xs text-slate-500">${E(r.nota)}</div>`:''}</div>${btn(`HZUI.delRestr('${r.id}')`,'Quitar')}</div>`).join('');
  const areas=[...new Set(S.asigs.map(a=>a.area))].sort();
  const grados=[...new Set(S.grupos.map(g=>g.grado))].sort((a,b)=>a-b);
  return`<div class="space-y-4">${card(`<h3 class="font-semibold mb-2">📏 Restricciones del horario (${S.restr.length})</h3><div class="space-y-2">${l||'<p class="text-sm text-slate-500">Todavía no hay restricciones. Son opcionales.</p>'}</div>`)}
  ${card(`<h3 class="font-semibold hz-mb1">➕ Nueva restricción</h3><p class="text-xs text-slate-500 mb-2">Una <b>obligatoria</b> siempre se cumple (si es imposible, te lo avisa). Una <b>preferida</b> se intenta cumplir, pero puede ceder.</p>
    <div class="grid sm:grid-cols-2 gap-2">
    <label class="text-sm block">Se aplica a<select id="hz_rs" class="${IN} w-full" onchange="HZUI.cambiaSobre()"><option value="area">Un área</option><option value="asignatura">Una asignatura</option><option value="docente">Un docente</option></select></label>
    <label class="text-sm block">¿Cuál?<select id="hz_ro" class="${IN} w-full">${areas.map(a=>`<option value="${E(a)}">${E(a)}</option>`).join('')}</select></label>
    <label class="text-sm block">En<select id="hz_ra" class="${IN} w-full" onchange="HZUI.cambiaAlcance()"><option value="colegio">Todo el colegio</option><option value="grado">Un grado</option><option value="grupo">Un grupo</option></select></label>
    <label class="text-sm block" id="hz_rgw" style="display:none">Grado<select id="hz_rg" class="${IN} w-full">${grados.map(g=>`<option value="${g}">${g}°</option>`).join('')}</select></label>
    <label class="text-sm block" id="hz_rpw" style="display:none">Grupo<select id="hz_rp" class="${IN} w-full">${S.grupos.map(g=>`<option value="${g.id}">${E(nGr(g))}</option>`).join('')}</select></label>
    <label class="text-sm block">Regla<select id="hz_rt" class="${IN} w-full" onchange="HZUI.cambiaTipo()"><option value="solo_dias">Solo se dicta estos días</option><option value="nunca_dias">Nunca se dicta estos días</option><option value="solo_franjas">Solo en estas horas del día</option><option value="nunca_franjas">Nunca en estas horas del día</option><option value="max_por_dia">Máximo de horas por día</option><option value="bloque_doble">En bloques de 2 horas seguidas</option></select></label>
    <label class="text-sm block">Fuerza<select id="hz_rf" class="${IN} w-full"><option value="obligatoria">Obligatoria</option><option value="preferida">Preferida</option></select></label></div>
    <div id="hz_rdw" class="mt-2 flex flex-wrap gap-3">${S.dias.map(d=>`<label class="text-sm flex items-center hz-gap1"><input type="checkbox" class="hz_d" value="${d}"> ${DL[d]}</label>`).join('')}</div>
    <div id="hz_rfw" class="mt-2 flex flex-wrap gap-3" style="display:none">${clasesF().map(f=>`<label class="text-sm flex items-center hz-gap1"><input type="checkbox" class="hz_f" value="${f.orden}"> ${E(f.nombre)}</label>`).join('')}</div>
    <label id="hz_rvw" class="text-sm block mt-2" style="display:none">Máximo de horas por día<input id="hz_rv" type="number" min="1" max="12" value="1" class="${IN}" style="width:6rem"></label>
    <input id="hz_rn" class="${IN} w-full mt-2" placeholder="Nota (opcional)" maxlength="200">
    <div class="hz-mt3">${btn('HZUI.addRestr()','Agregar restricción',BTN)}</div>`)}</div>`;
}
function vGen(){
  const E0=entrada(),total=E0.asignaciones.reduce((s,a)=>s+a.horas,0);
  const rev=S.rev?(S.rev.length?`<div class="space-y-2">${S.rev.map(p=>`<div class="border rounded-xl p-3 text-sm" style="border-color:#fca5a5"><div class="font-semibold">⚠️ ${E(p.problema)}</div><div class="text-xs text-slate-600">Causa: ${E(p.causa)}</div><div class="text-xs hz-emerald">Qué hacer: ${E(p.solucion)}</div></div>`).join('')}</div>`:'<p class="text-sm hz-emerald">✅ Todo en orden: no se detectaron problemas de antemano.</p>'):'';
  let res='';
  if(S.busy)res=card('<p class="text-sm">⏳ Armando el horario… un momento.</p>');
  else if(S.gen){
    const g=S.gen,falta=g.total-g.clases.length;
    res=`${card(`<h3 class="font-semibold hz-mb1">Resultado</h3>
      <p class="text-sm">Se ubicaron <b>${g.clases.length}</b> de <b>${g.total}</b> horas · puntuación <b>${g.puntuacion}</b>/100 · revisión independiente: ${g.errores.length?`<span style="color:#dc2626">${g.errores.length} problema(s)</span>`:'<span style="color:#059669">sin choques ni reglas rotas ✅</span>'}</p>
      ${g.conflictos.length?`<div class="mt-2 hz-sy1">${g.conflictos.slice(0,15).map(c=>`<div class="text-xs ${c.severidad==='critico'?'text-red-700':'hz-amber'}">• ${E(c.descripcion)}</div>`).join('')}${g.conflictos.length>15?`<div class="text-xs text-slate-500">… y ${g.conflictos.length-15} más</div>`:''}</div>`:''}
      <div class="flex flex-wrap gap-2 hz-end hz-mt3"><input id="hz_vn" class="${IN}" value="Horario ${new Date().toLocaleDateString('es-CO')}" maxlength="80" style="min-width:14rem">${btn('HZUI.guardar(0)','💾 Guardar como borrador')}${btn('HZUI.guardar(1)','📢 Guardar y publicar',BTN)}</div>
      ${falta?`<p class="text-xs hz-amber mt-2">Faltan ${falta} hora(s) por ubicar. Puedes ajustar restricciones o disponibilidad y volver a generar.</p>`:''}`)}${vGrid()}`;
  }
  return`<div class="space-y-4">${card(`<h3 class="font-semibold hz-mb1">⚡ Generar el horario</h3><p class="text-sm text-slate-600">${S.grupos.length} grupos · ${S.docentes.length} docentes · ${S.asigns.length} asignaciones · ${total} horas por ubicar · ${S.restr.length} restricciones</p>
    <div class="flex flex-wrap gap-2 hz-mt3">${btn('HZUI.revisar()','🔍 Revisar antes de generar')}${btn('HZUI.generar()','⚡ Generar horario',BTN)}</div>${rev?`<div class="hz-mt3">${rev}</div>`:''}`)}${res}</div>`;
}
function vVers(){
  const l=S.vers.map(v=>`<tr class="border-t"><td class="py-1">${E(v.nombre)}</td><td>${v.estado==='publicado'?'<b style="color:#059669">Publicado</b>':v.estado==='archivado'?'Archivado':'Borrador'}</td><td>${v.puntuacion==null?'—':v.puntuacion}</td><td>${fd(v.created_at)}</td><td><div class="flex hz-gap1 flex-wrap">${btn(`HZUI.verVersion('${v.id}')`,'Ver')}${v.estado!=='publicado'?btn(`HZUI.publicar('${v.id}')`,'Publicar','bg-emerald-600 text-white'):''}${v.estado!=='publicado'?btn(`HZUI.borrarVersion('${v.id}')`,'Borrar'):''}</div></td></tr>`).join('');
  return`<div class="space-y-4">${card(`<h3 class="font-semibold mb-2">🗂️ Horarios guardados</h3>${S.vers.length?`<div class="overflow-x-auto"><table class="w-full text-sm"><tr class="text-left text-slate-500"><th>Nombre</th><th>Estado</th><th>Puntos</th><th>Creado</th><th></th></tr>${l}</table></div>`:'<p class="text-sm text-slate-500">Todavía no has guardado ningún horario.</p>'}<p class="text-xs text-slate-500 mt-2">El horario <b>publicado</b> es el que ven los docentes. Al publicar uno nuevo, el anterior queda archivado.</p>`)}${S.verId?vGrid():''}</div>`;
}
function vHor(){
  if(!M.colegio_id)return card('<h2 class="text-xl font-bold">🗓 Horarios</h2><p class="text-sm text-red-600">Tu cuenta no tiene un colegio del catálogo. Escribe al administrador para vincularla.</p>');
  const nav=SEC.map(([k,l])=>`<button onclick="HZUI.sec('${k}')" class="px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-sm ${S.sec===k?'on':'bg-white'}">${l}</button>`).join('');
  const body=({jornada:vJornada,grupos:vGrupos,asigs:vAsigs,docs:vDocs,aulas:vAulas,asign:vAsign,restr:vRestr,gen:vGen,vers:vVers}[S.sec]||vJornada)();
  return`<div class="space-y-4">${card(`<h2 class="text-xl font-bold">🗓 Horarios del colegio</h2><p class="text-sm text-slate-600">${E(S.colegio)}</p><p class="text-xs text-slate-500 mt-1">Recorre las pestañas de izquierda a derecha: arma la jornada, los grupos, las asignaturas, los docentes y las asignaciones; agrega restricciones si quieres; y genera el horario.</p>`)}<nav class="flex gap-2 overflow-x-auto">${nav}</nav>${body}</div>`;
}
function vMi(){
  if(!M.colegio_id)return card('<h2 class="text-xl font-bold">🗓 Mi horario</h2><p class="text-sm text-slate-600">Tu cuenta no tiene un colegio del catálogo, así que no hay horario para mostrar.</p>');
  if(!S.pubOk)return card('<h2 class="text-xl font-bold">🗓 Mi horario</h2><p class="text-sm text-slate-600">Todavía no hay un horario publicado en tu colegio. Cuando el rector o el coordinador lo publique, aparecerá aquí.</p>');
  if(S.miDoc&&!S.iniMi){S.modo='docente';S.item=S.miDoc.id;S.iniMi=true}
  const aviso=S.miDoc?'':'<p class="text-xs mt-1" style="color:#b45309">Tu cuenta todavía no está vinculada a un docente del horario. Pídele al rector o coordinador que use "Traer docentes registrados". Mientras tanto puedes ver el horario de cualquier grupo.</p>';
  return`<div class="space-y-4">${card(`<h2 class="text-xl font-bold">🗓 Mi horario</h2><p class="text-sm text-slate-600">${E(S.colegio)}</p>${aviso}`)}${vGrid()}</div>`;
}

/* ---------- acciones ---------- */
const mut=async(fn)=>{await run(async()=>{await fn();cambio();await cargar();render()})};
function parseGrupo(s){const m=String(s).trim().match(/^(\d{1,2})\s*[°ºo\-.]?\s*([A-Za-z0-9]+)$/);return m?{grado:+m[1],nombre:m[2].toUpperCase()}:null}
window.HZUI={
  async load(t){await cargar();if(t==='mhor')await cargarPublicado();else if(t==='dhor'&&S.sec==='gen'){/* nada */}},
  view(t){return t==='mhor'?vMi():vHor()},
  sec(k){S.sec=k;S.dispDoc='';render()},
  setModo(m){S.modo=m;S.item='';render()},
  setItem(i){S.item=i;render()},
  /* jornada */
  toggleDia(d,on){return run(async()=>{let ds=S.dias.filter(x=>x!==d);if(on)ds.push(d);ds.sort();
    if(!ds.length){toast('⚠️','Falta un día','Debe haber al menos un día de clase.');return render()}
    ok(await sb.from('hz_config').upsert({colegio_id:M.colegio_id,dias:ds,updated_at:new Date().toISOString()},{onConflict:'colegio_id'}));S.dias=ds;cambio();render()})},
  addFranja(){return mut(async()=>{const nombre=val('hz_fnom');if(!nombre)throw new Error('Escribe el nombre de la franja.');
    const orden=S.franjas.reduce((m,f)=>Math.max(m,f.orden),0)+1;if(orden>20)throw new Error('Máximo 20 franjas.');
    ok(await sb.from('hz_franjas').insert({colegio_id:M.colegio_id,orden,nombre,inicio:val('hz_fini')||null,fin:val('hz_ffin')||null,es_clase:chk('hz_fcl')}))})},
  jornadaEjemplo(){return mut(async()=>{const J=[['1ª hora','06:30','07:20',true],['2ª hora','07:20','08:10',true],['3ª hora','08:10','09:00',true],['Descanso','09:00','09:30',false],['4ª hora','09:30','10:20',true],['5ª hora','10:20','11:10',true],['6ª hora','11:10','12:00',true]];
    ok(await sb.from('hz_franjas').insert(J.map((j,i)=>({colegio_id:M.colegio_id,orden:i+1,nombre:j[0],inicio:j[1],fin:j[2],es_clase:j[3]}))))})},
  delFranja(id){if(!confirm('¿Quitar esta franja? También se quitarán sus clases de los horarios guardados.'))return;return mut(async()=>{ok(await sb.from('hz_franjas').delete().eq('id',id))})},
  /* grupos */
  crearGrupos(){return mut(async()=>{const d=+val('hz_gd'),h=+val('hz_gh'),ls=val('hz_gl').split(/[,;\s]+/).filter(Boolean).map(s=>s.toUpperCase().slice(0,20));
    if(h<d)throw new Error('El grado final debe ser mayor o igual al inicial.');if(!ls.length)throw new Error('Escribe al menos una letra o número de grupo.');
    const rows=[];for(let g=d;g<=h;g++)for(const l of ls)rows.push({colegio_id:M.colegio_id,grado:g,nombre:l});
    ok(await sb.from('hz_grupos').upsert(rows,{onConflict:'colegio_id,grado,nombre',ignoreDuplicates:true}))})},
  delGrupo(id){if(!confirm('¿Quitar este grupo? También se quitarán sus asignaciones y clases.'))return;return mut(async()=>{ok(await sb.from('hz_grupos').delete().eq('id',id))})},
  /* asignaturas */
  addAsig(){return mut(async()=>{const nombre=val('hz_anom');if(nombre.length<2)throw new Error('Escribe el nombre de la asignatura.');
    ok(await sb.from('hz_asignaturas').insert({colegio_id:M.colegio_id,nombre,area:val('hz_aare')||nombre,aula_tipo:val('hz_atip')||null}))})},
  cargarCatalogo(){return mut(async()=>{const r=ok(await sb.from('asignaturas').select('nombre,areas(nombre)'));
    const ya=new Set(S.asigs.map(a=>norm(a.nombre)));
    const rows=r.filter(x=>!ya.has(norm(x.nombre))).map(x=>({colegio_id:M.colegio_id,nombre:x.nombre,area:(x.areas&&x.areas.nombre)||x.nombre}));
    if(!rows.length){toast('ℹ️','Sin cambios','Ya tienes todas las asignaturas del catálogo.');return}
    ok(await sb.from('hz_asignaturas').insert(rows));toast('✅','Listo',rows.length+' asignatura(s) cargadas.')})},
  delAsig(id){if(!confirm('¿Quitar esta asignatura? También se quitarán sus asignaciones.'))return;return mut(async()=>{ok(await sb.from('hz_asignaturas').delete().eq('id',id))})},
  /* docentes */
  addDoc(){return mut(async()=>{const nombre=val('hz_dnom');if(nombre.length<3)throw new Error('Escribe el nombre del docente.');ok(await sb.from('hz_docentes').insert({colegio_id:M.colegio_id,nombre}))})},
  traerDocentes(){return mut(async()=>{const r=ok(await sb.from('profiles').select('id,full_name').eq('role','prof').eq('colegio_id',M.colegio_id).eq('teacher_status','aprobado'));
    const ya=new Set(S.docentes.map(d=>d.user_id).filter(Boolean));
    const rows=r.filter(p=>!ya.has(p.id)&&String(p.full_name||'').length>=3).map(p=>({colegio_id:M.colegio_id,nombre:p.full_name,user_id:p.id}));
    if(!rows.length){toast('ℹ️','Sin cambios','No hay docentes registrados nuevos para traer.');return}
    ok(await sb.from('hz_docentes').insert(rows));toast('✅','Listo',rows.length+' docente(s) traídos.')})},
  delDoc(id){if(!confirm('¿Quitar este docente? También se quitarán sus asignaciones.'))return;return mut(async()=>{ok(await sb.from('hz_docentes').delete().eq('id',id));if(S.dispDoc===id)S.dispDoc=''})},
  abrirDisp(id){S.dispDoc=id;render()},cerrarDisp(){S.dispDoc='';render()},
  toggleND(did,dia,fid){return run(async()=>{const i=S.nd.findIndex(n=>n.docente_id===did&&n.dia===dia&&n.franja_id===fid);
    if(i>=0){ok(await sb.from('hz_no_disponible').delete().eq('docente_id',did).eq('dia',dia).eq('franja_id',fid));S.nd.splice(i,1)}
    else{ok(await sb.from('hz_no_disponible').insert({colegio_id:M.colegio_id,docente_id:did,dia,franja_id:fid}));S.nd.push({colegio_id:M.colegio_id,docente_id:did,dia,franja_id:fid})}
    cambio();render()})},
  /* aulas */
  addAula(){return mut(async()=>{const nombre=val('hz_unom');if(!nombre)throw new Error('Escribe el nombre del aula.');ok(await sb.from('hz_aulas').insert({colegio_id:M.colegio_id,nombre,tipo:val('hz_utip')||'general'}))})},
  delAula(id){if(!confirm('¿Quitar esta aula?'))return;return mut(async()=>{ok(await sb.from('hz_aulas').delete().eq('id',id))})},
  /* asignaciones */
  addAsign(){return mut(async()=>{const g=val('hz_ag'),a=val('hz_aa'),d=val('hz_ad'),h=Math.round(+val('hz_ah'));
    if(!g||!a||!d)throw new Error('Primero crea los grupos, las asignaturas y los docentes.');if(!(h>=1&&h<=20))throw new Error('Las horas deben estar entre 1 y 20.');
    const gs=g.startsWith('grado:')?S.grupos.filter(x=>x.grado===+g.slice(6)):S.grupos.filter(x=>x.id===g.slice(2));
    ok(await sb.from('hz_asignaciones').upsert(gs.map(x=>({colegio_id:M.colegio_id,grupo_id:x.id,asignatura_id:a,docente_id:d,horas:h})),{onConflict:'colegio_id,grupo_id,asignatura_id'}))})},
  delAsign(id){return mut(async()=>{ok(await sb.from('hz_asignaciones').delete().eq('id',id))})},
  pegar(){return mut(async()=>{S.pegarMsg='';const lines=val('hz_paste').split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
    if(!lines.length)throw new Error('Pega al menos una línea.');if(lines.length>600)throw new Error('Máximo 600 líneas por vez.');
    const crear=chk('hz_pcrear'),errores=[],filas=[];
    lines.forEach((l,i)=>{const sep=l.includes('\t')?'\t':l.includes(';')?';':',';const c=l.split(sep).map(x=>x.trim());
      const gr=parseGrupo(c[0]),h=Math.round(+c[3]);
      if(c.length<4||!gr)return errores.push(`Línea ${i+1}: formato no válido (Grupo; Asignatura; Docente; Horas).`);
      if(!(h>=1&&h<=20))return errores.push(`Línea ${i+1}: las horas deben estar entre 1 y 20.`);
      if(c[1].length<2||c[2].length<3)return errores.push(`Línea ${i+1}: falta la asignatura o el docente.`);
      filas.push({gr,asig:c[1],doc:c[2],horas:h,ln:i+1})});
    const mapG=new Map(S.grupos.map(g=>[g.grado+'|'+g.nombre.toUpperCase(),g.id]));
    const mapA=new Map(S.asigs.map(a=>[norm(a.nombre),a.id])),mapD=new Map(S.docentes.map(d=>[norm(d.nombre),d.id]));
    const nuevasA=new Map(),nuevosD=new Map();
    for(const f of filas){
      if(!mapG.has(f.gr.grado+'|'+f.gr.nombre)){errores.push(`Línea ${f.ln}: el grupo ${f.gr.grado}°${f.gr.nombre} no existe (créalo en "Grupos").`);f.mal=1;continue}
      if(!mapA.has(norm(f.asig))){if(crear)nuevasA.set(norm(f.asig),f.asig);else{errores.push(`Línea ${f.ln}: la asignatura "${f.asig}" no existe.`);f.mal=1}}
      if(!mapD.has(norm(f.doc))){if(crear)nuevosD.set(norm(f.doc),f.doc);else{errores.push(`Línea ${f.ln}: el docente "${f.doc}" no existe.`);f.mal=1}}}
    if(nuevasA.size){const r=ok(await sb.from('hz_asignaturas').insert([...nuevasA.values()].map(n=>({colegio_id:M.colegio_id,nombre:n,area:n}))).select());r.forEach(a=>mapA.set(norm(a.nombre),a.id))}
    if(nuevosD.size){const r=ok(await sb.from('hz_docentes').insert([...nuevosD.values()].map(n=>({colegio_id:M.colegio_id,nombre:n}))).select());r.forEach(d=>mapD.set(norm(d.nombre),d.id))}
    const rows=new Map();
    filas.filter(f=>!f.mal).forEach(f=>{const g=mapG.get(f.gr.grado+'|'+f.gr.nombre),a=mapA.get(norm(f.asig)),d=mapD.get(norm(f.doc));rows.set(g+'|'+a,{colegio_id:M.colegio_id,grupo_id:g,asignatura_id:a,docente_id:d,horas:f.horas})});
    if(rows.size)ok(await sb.from('hz_asignaciones').upsert([...rows.values()],{onConflict:'colegio_id,grupo_id,asignatura_id'}));
    S.pegarMsg=`<div style="color:#059669">✅ ${rows.size} asignación(es) cargadas.${nuevasA.size?` Se crearon ${nuevasA.size} asignatura(s) nuevas (revisa su área en "Asignaturas").`:''}${nuevosD.size?` Se crearon ${nuevosD.size} docente(s) nuevos.`:''}</div>${errores.length?`<div style="color:#b91c1c">${errores.slice(0,12).map(E).join('<br>')}${errores.length>12?'<br>…':''}</div>`:''}`})},
  /* restricciones */
  cambiaSobre(){const s=val('hz_rs'),o=q('hz_ro');if(!o)return;
    const ops=s==='area'?[...new Set(S.asigs.map(a=>a.area))].sort().map(a=>[a,a]):s==='asignatura'?S.asigs.map(a=>[a.id,a.nombre]):S.docentes.map(d=>[d.id,d.nombre]);
    o.innerHTML=ops.map(([v,l])=>`<option value="${E(v)}">${E(l)}</option>`).join('')},
  cambiaAlcance(){const a=val('hz_ra');q('hz_rgw').style.display=a==='grado'?'':'none';q('hz_rpw').style.display=a==='grupo'?'':'none'},
  cambiaTipo(){const t=val('hz_rt');q('hz_rdw').style.display=(t==='solo_dias'||t==='nunca_dias')?'':'none';q('hz_rfw').style.display=(t==='solo_franjas'||t==='nunca_franjas')?'':'none';q('hz_rvw').style.display=t==='max_por_dia'?'':'none'},
  addRestr(){return mut(async()=>{const sobre=val('hz_rs'),objetivo=val('hz_ro'),alcance=val('hz_ra'),tipo=val('hz_rt');
    if(!objetivo)throw new Error('Elige a qué se aplica la regla (primero crea las asignaturas o los docentes).');
    const dias=[...document.querySelectorAll('.hz_d:checked')].map(e=>+e.value),franjas=[...document.querySelectorAll('.hz_f:checked')].map(e=>+e.value);
    if((tipo==='solo_dias'||tipo==='nunca_dias')&&!dias.length)throw new Error('Marca al menos un día.');
    if((tipo==='solo_franjas'||tipo==='nunca_franjas')&&!franjas.length)throw new Error('Marca al menos una hora del día.');
    if(alcance==='grado'&&!val('hz_rg'))throw new Error('Elige el grado.');if(alcance==='grupo'&&!val('hz_rp'))throw new Error('Elige el grupo.');
    ok(await sb.from('hz_restricciones').insert({colegio_id:M.colegio_id,alcance,grado:alcance==='grado'?+val('hz_rg'):null,grupo_id:alcance==='grupo'?val('hz_rp'):null,sobre,objetivo,tipo,
      dias:(tipo==='solo_dias'||tipo==='nunca_dias')?dias:[],franjas:(tipo==='solo_franjas'||tipo==='nunca_franjas')?franjas:[],valor:tipo==='max_por_dia'?Math.max(1,Math.round(+val('hz_rv')||1)):null,fuerza:val('hz_rf'),nota:val('hz_rn')||null}))})},
  delRestr(id){return mut(async()=>{ok(await sb.from('hz_restricciones').delete().eq('id',id))})},
  /* generar */
  async revisar(){return run(async()=>{const H=await engine();S.rev=H.validarFactibilidad(entrada());render()})},
  async generar(){return run(async()=>{
    const H=await engine();S.busy=true;S.gen=null;render();await new Promise(r=>setTimeout(r,30));
    try{const e=entrada(),g=H.generar(e,{maxMs:3000}),v=H.verificar(e,g.clases);
      S.rev=H.validarFactibilidad(e);
      S.gen={...g,errores:v.filter(x=>x.tipo!=='horas'),total:e.asignaciones.reduce((s,a)=>s+a.horas,0)};
      S.vw={clases:g.clases.map(c=>({asignacion_id:c.asignacion_id,dia:c.dia_semana,franja_id:c.franja_id,aula_id:c.aula_id})),titulo:'Horario generado (todavía sin guardar)'};
      S.modo='grupo';S.item='';S.verId=''}finally{S.busy=false}
    render()})},
  guardar(publicar){return run(async()=>{const g=S.gen;if(!g)return;
    if(g.errores.length&&!confirm('La revisión encontró problemas en este horario. ¿Guardarlo de todos modos?'))return;
    if(publicar&&g.clases.length<g.total&&!confirm('Faltan '+(g.total-g.clases.length)+' hora(s) por ubicar. ¿Publicar de todos modos?'))return;
    const nombre=val('hz_vn')||('Horario '+new Date().toLocaleDateString('es-CO'));
    const cl=g.clases.map(c=>({asignacion_id:c.asignacion_id,dia:c.dia_semana,franja_id:c.franja_id,aula_id:c.aula_id}));
    const r=await sb.rpc('hz_guardar_version',{p_colegio:M.colegio_id,p_nombre:nombre,p_puntuacion:g.puntuacion,p_resumen:{ubicadas:g.clases.length,total:g.total,conflictos:g.conflictos.slice(0,30).map(c=>c.descripcion)},p_clases:cl});
    if(r.error)throw r.error;
    if(publicar){const p=await sb.rpc('hz_publicar',{p_version:r.data});if(p.error)throw p.error}
    toast('✅',publicar?'Horario publicado':'Horario guardado',publicar?'Los docentes ya pueden verlo en "Mi horario".':'Quedó como borrador en "Versiones".');
    S.gen=null;S.sec='vers';await cargar();S.verId=r.data;S.vw={clases:cl,titulo:nombre};render()})},
  /* versiones */
  verVersion(id){return run(async()=>{const v=S.vers.find(x=>x.id===id);
    const cl=await todas(()=>sb.from('hz_clases').select('asignacion_id,dia,franja_id,aula_id').eq('version_id',id));
    S.vw={clases:cl,titulo:v?v.nombre:''};S.verId=id;S.modo='grupo';S.item='';render()})},
  publicar(id){if(!confirm('¿Publicar este horario? Los docentes verán este y el anterior quedará archivado.'))return;
    return run(async()=>{const p=await sb.rpc('hz_publicar',{p_version:id});if(p.error)throw p.error;toast('✅','Horario publicado','Los docentes ya pueden verlo en "Mi horario".');await cargar();render()})},
  borrarVersion(id){if(!confirm('¿Borrar este horario guardado?'))return;
    return run(async()=>{ok(await sb.from('hz_versiones').delete().eq('id',id));if(S.verId===id)S.verId='';await cargar();render()})},
  /* imprimir */
  print(todos){
    const nom={grupo:'Grupo',docente:'Docente',aula:'Aula'}[S.modo];
    const items=todos?opciones():opciones().filter(o=>o[0]===S.item);
    if(!items.length)return toast('ℹ️','Nada para imprimir','Todavía no hay datos.');
    const pag=items.map(([id,n])=>`<section style="page-break-after:always"><h2>${E(S.colegio)}</h2><h3>${E(S.vw.titulo)} · ${nom}: ${E(n)}</h3>${tabla(S.modo,id)}</section>`).join('');
    const w=window.open('','_blank');if(!w)return toast('⚠️','Ventana bloqueada','Permite las ventanas emergentes para poder imprimir.');
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Horario</title><style>body{font-family:Arial,sans-serif;margin:16px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:5px;vertical-align:top;font-size:12px}th{background:#eee}.text-xs{font-size:10px;color:#555}.font-semibold{font-weight:bold}h2,h3{margin:4px 0}</style></head><body>'+pag+'<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body></html>');
    w.document.close()}
};
})();
