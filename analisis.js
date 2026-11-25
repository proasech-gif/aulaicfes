/* AULA360 — Crear análisis de mi institución (Saber 11 con datos reales del ICFES / datos.gov.co)
   El rector elige departamento, municipio, colegio y años; la plataforma arma un informe profesional con comparativos. */
window.ANA=(function(){
const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const AREAS=[['lec','Lectura Crítica'],['mat','Matemáticas'],['soc','Sociales y Ciudadanas'],['nat','Ciencias Naturales'],['ing','Inglés']];
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/[^A-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const f1=x=>x==null?'—':(Math.round(x*10)/10).toLocaleString('es-CO',{minimumFractionDigits:1,maximumFractionDigits:1});
const f0=x=>x==null?'—':Math.round(x).toLocaleString('es-CO');
const sg=x=>x==null?'—':(x>0?'▲ +':x<0?'▼ ':'= ')+f1(x);
const col=x=>x==null?'#64748b':x>0?'#15803d':x<0?'#b91c1c':'#64748b';
const AC=new Date().getFullYear(),VENT=Array.from({length:Math.max(1,AC-2020)},(_,i)=>2021+i);
let Z={sec:{},obs:'',hor:[1,3],out:null,cal:'A',deptos:[],mcpios:[],cols:[],anios:[],dep:'',mun:'',dane:'',colNombre:'',sel:[],zona:'',own:[],ownDane:'',man:[],rk:{anio:'',mun:'',sector:'',zona:'',lista:null,busy:false,max:30,zt:null},busy:false,msg:'',rep:null,html:''};
const R=()=>render();
const esAud=()=>!!(M&&M.is_admin),puede=()=>esAud()||(M&&(M.role==='rector'||M.role==='coordinador'));
const rpc=async(n,a)=>{const r=await sb.rpc(n,a);if(r.error)throw r.error;return r.data};
async function load(){
  if(Z.deptos.length)return;
  try{Z.deptos=(await rpc('saber_deptos'))||[];Z.anios=(await rpc('saber_anios',{p_cal:Z.cal}))||[];
    Z.sel=Z.anios.filter(a=>VENT.includes(a));
    // intenta ubicar el colegio del rector
    const c=D.school&&D.school.colegios;
    if(c&&c.municipios){const dn=norm(c.municipios.departamentos&&c.municipios.departamentos.nombre),mn=norm(c.municipios.nombre);
      const d=Z.deptos.find(x=>norm(x)===dn||norm(x).startsWith(dn)||dn.startsWith(norm(x)));
      if(d){Z.dep=d;Z.mcpios=await rpc('saber_mcpios',{p_depto:d});const m=Z.mcpios.find(x=>norm(x)===mn);
        if(m){Z.mun=m;Z.cols=await rpc('saber_colegios',{p_depto:d,p_mcpio:m,p_cal:Z.cal});
          const cn=norm(c.nombre).replace(/\b(INSTITUCION EDUCATIVA|I E|IE|COLEGIO)\b/g,'').trim();
          const k=Z.cols.find(x=>norm(x.nombre).replace(/\b(INSTITUCION EDUCATIVA|I E|IE|COLEGIO)\b/g,'').trim()===cn);
          if(k){Z.dane=k.dane;Z.colNombre=k.nombre}}}}
  }catch(x){Z.msg='No se pudieron cargar los datos del ICFES: '+(x.message||x)}
  if(!esAud()&&puede()){try{const mi=await rpc('saber_mi_colegio');if(mi&&mi.dane){Z.dane=mi.dane;Z.colNombre=mi.nombre||Z.colNombre||M.school_name||'';if(mi.depto){Z.dep=Z.deptos.find(d=>norm(d)===norm(mi.depto))||mi.depto;Z.mcpios=await rpc('saber_mcpios',{p_depto:Z.dep});Z.mun=Z.mcpios.find(m=>norm(m)===norm(mi.mcpio))||mi.mcpio}Z.cols=[{dane:mi.dane,nombre:Z.colNombre}]}}catch(x){}
    if(!Z.dane)Z.msg='No pudimos ubicar tu institución en los datos del ICFES. Escribe a soporte para que la vinculen; mientras tanto no se puede crear el informe.'}
  Z.ownDane=Z.dane;await cargaExtra();
  Z.man.forEach(m=>{if(manOk(m.anio)&&!Z.sel.includes(m.anio))Z.sel.push(m.anio)});Z.sel.sort();
  if(!Z.rk.anio)Z.rk.anio=String(Z.anios.filter(a=>a>=2021).slice(-1)[0]||'');
}
async function cargaExtra(){
  Z.zona='';Z.own=[];Z.man=[];
  if(Z.dane){try{Z.man=(await rpc('saber_manual',{p_dane:Z.dane}))||[]}catch(x){}}
  if(Z.dane){try{Z.zona=(await rpc('saber_ficha_zona',{p_dane:Z.dane}))||''}catch(x){}}
  try{Z.rk.zt=await rpc('saber_zonas_total')}catch(x){}
  if(M&&M.colegio_id&&Z.dane&&Z.dane===Z.ownDane){
    try{const r=await sb.from('icfes_resultados').select('anio,global,lc,mat,soc,cn,ing').eq('colegio_id',M.colegio_id).limit(5000);
      if(!r.error&&r.data){const g={};r.data.forEach(x=>{(g[x.anio]=g[x.anio]||[]).push(x)});
        const mean=(a,k)=>{const v=a.map(x=>x[k]).filter(x=>x!=null);return v.length?Math.round(v.reduce((s,x)=>s+x,0)/v.length*10)/10:null};
        Z.own=Object.keys(g).map(a=>({anio:+a,n:g[a].length,global:mean(g[a],'global'),lec:mean(g[a],'lc'),mat:mean(g[a],'mat'),soc:mean(g[a],'soc'),nat:mean(g[a],'cn'),ing:mean(g[a],'ing')})).filter(x=>x.global!=null)}}catch(x){}}
}
const ownOk=a=>!Z.anios.includes(a)&&VENT.includes(a)&&!!Z.dane&&Z.dane===Z.ownDane&&Z.own.some(x=>x.anio===a);
const manOk=a=>!Z.anios.includes(a)&&VENT.includes(a)&&!!Z.dane&&Z.man.some(x=>x.anio===a);
const avail=a=>Z.anios.includes(a)||ownOk(a)||manOk(a);
const sel=(id,lab,opts,val,fn)=>`<label style="font-size:13px;font-weight:700;display:block">${lab}<select id="${id}" onchange="${fn}(this.value)" style="display:block;width:100%;margin-top:4px;border:1.5px solid #cbd5e1;border-radius:10px;padding:10px;font-weight:400;font-size:14px;background:#fff"><option value="">Elige…</option>${opts.map(o=>`<option value="${e(o[0])}" ${String(o[0])===String(val)?'selected':''}>${e(o[1])}</option>`).join('')}</select></label>`;
function view(){
  if(!puede())return`<div class="aic-card" style="padding:18px"><h2 style="font-weight:800">🔒 Informe de pruebas Saber</h2><p style="color:#64748b;margin-top:6px">Solo el rector o el coordinador de la institución pueden crear este informe.</p></div>`;
  const nSel=Z.sel.length;
  return`<div style="display:grid;gap:14px">
  <div class="aic-card" style="padding:18px"><h2 style="font-weight:800;font-size:19px">📊 Crear análisis de mi institución</h2>
   <p style="font-size:13px;color:#64748b;margin:4px 0 12px">Elige el lugar y los años. La plataforma toma los <b>resultados reales de Saber 11</b> publicados por el ICFES (datos abiertos del Estado colombiano) y arma un informe profesional con comparativos contra el municipio, el departamento y el país, desde 2021 en adelante.</p>
   ${Z.msg?`<p style="font-size:13px;color:#b45309;margin-bottom:8px">${e(Z.msg)}</p>`:''}
   <div style="margin-bottom:12px"><b style="font-size:13px">Calendario del colegio</b><div style="display:flex;gap:8px;margin-top:6px">${['A','B'].map(c=>`<button onclick="ANA.setCal('${c}')" style="padding:9px 16px;border-radius:10px;font-weight:800;border:1.5px solid ${Z.cal===c?'#1e63e9':'#cbd5e1'};background:${Z.cal===c?'#e8f1ff':'#fff'};color:${Z.cal===c?'#1e3a8a':'#334155'}">Calendario ${c}</button>`).join('')}</div><p style="font-size:12px;color:#64748b;margin-top:4px">${Z.cal==='A'?'Calendario A: la mayoría de colegios (el examen se presenta en el segundo semestre).':'Calendario B: colegios que presentan el examen en el primer semestre (en su mayoría privados).'} Los análisis de A y de B se hacen por separado.</p></div>
   ${esAud()?`<div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
    ${sel('an_dep','1. Departamento',Z.deptos.map(d=>[d,d]),Z.dep,'ANA.dep')}
    ${sel('an_mun','2. Municipio',Z.mcpios.map(d=>[d,d]),Z.mun,'ANA.mun')}
    ${sel('an_col','3. Colegio (institución)',Z.cols.map(c=>[c.dane,c.nombre]),Z.dane,'ANA.col')}
   </div>`:`<div style="border:1.5px solid #bfdbfe;background:#eff6ff;border-radius:12px;padding:12px;font-size:14px">🏫 <b>${e(Z.colNombre||M.school_name||'Tu institución')}</b>${Z.mun?'<br><span style="font-size:12px;color:#475569">'+e(Z.mun)+(Z.dep?', '+e(Z.dep):'')+'</span>':''}<div style="font-size:12px;color:#64748b;margin-top:4px">Solo puedes crear el informe de tu propia institución.</div></div>`}
   <p style="font-size:12px;color:#64748b;margin-top:6px">Si no eliges colegio, el análisis se hace del municipio (o del departamento si tampoco eliges municipio).</p>
   ${zonaUi()}
   <div style="margin-top:12px"><b style="font-size:13px">4. Años a analizar</b> <span style="font-size:12px;color:#64748b">(${nSel} elegido${nSel===1?'':'s'}; desde 2021; cada año se agrega el nuevo)</span>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">${VENT.map(a=>{const ok=Z.anios.includes(a);if(manOk(a))return`<label title="Estos resultados fueron subidos manualmente por el auditor" style="border:1.5px solid #cbd5e1;border-radius:10px;padding:8px 12px;font-size:14px;cursor:pointer;${Z.sel.includes(a)?'background:#ede9fe;border-color:#7c3aed;font-weight:800':''}"><input type="checkbox" ${Z.sel.includes(a)?'checked':''} onchange="ANA.anio(${a},this.checked)"> ✍️ ${a} · subido manualmente</label>`;if(ownOk(a))return`<label title="Resultados subidos manualmente (el ICFES aún no publica el año)" style="border:1.5px solid #cbd5e1;border-radius:10px;padding:8px 12px;font-size:14px;cursor:pointer;${Z.sel.includes(a)?'background:#fef3c7;border-color:#d97706;font-weight:800':''}"><input type="checkbox" ${Z.sel.includes(a)?'checked':''} onchange="ANA.anio(${a},this.checked)"> ✍️ ${a} · subido manualmente</label>`;return ok?`<label style="border:1.5px solid #cbd5e1;border-radius:10px;padding:8px 12px;font-size:14px;cursor:pointer;${Z.sel.includes(a)?'background:#e8f1ff;border-color:#1e63e9;font-weight:800':''}"><input type="checkbox" ${Z.sel.includes(a)?'checked':''} onchange="ANA.anio(${a},this.checked)"> ${a}</label>`:`<span title="El ICFES aún no publica este año" style="border:1.5px dashed #e2e8f0;border-radius:10px;padding:8px 12px;font-size:13px;color:#94a3b8">${a} · sin datos</span>`}).join('')}</div>
    ${Z.dane&&(Z.man.some(x=>manOk(x.anio))||VENT.some(ownOk))?`<div style="margin-top:8px;background:#f5f3ff;border:1px solid #c4b5fd;border-radius:10px;padding:9px 12px;font-size:13px;color:#4c1d95">✍️ <b>Subido manualmente (${[...new Set(Z.man.filter(x=>manOk(x.anio)).map(x=>x.anio).concat(VENT.filter(ownOk)))].sort().join(', ')}).</b> Cuando la plataforma suba los resultados desde las páginas oficiales, su informe se actualizará automáticamente.</div>`:''}
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px"><button onclick="ANA.ult(3)" style="background:#e8f1ff;color:#1e3a8a;padding:7px 12px;border-radius:9px;font-weight:700;font-size:13px">Últimos 3 años</button><button onclick="ANA.ult(5)" style="background:#e8f1ff;color:#1e3a8a;padding:7px 12px;border-radius:9px;font-weight:700;font-size:13px">Últimos 5 años</button><button onclick="ANA.ult(99)" style="background:#e8f1ff;color:#1e3a8a;padding:7px 12px;border-radius:9px;font-weight:700;font-size:13px">Todos (desde 2021)</button><button class="aic-link" onclick="ANA.quitar()">Quitar todos</button></div></div>
   <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px"><button onclick="ANA.generar()" ${Z.busy?'disabled':''} style="background:#1e63e9;color:#fff;padding:12px 18px;border-radius:10px;font-weight:800">${Z.busy?'⏳ Preparando el informe…':'📊 Crear análisis'}</button></div>
   <p style="font-size:12px;color:#64748b;margin-top:10px">Fuente: ICFES, resultados oficiales de Saber 11 (calendario ${Z.cal}). Años con datos: ${Z.anios.length?Z.anios.join(', '):'—'}. Los años nuevos (como 2026) se agregan en cuanto el ICFES los publica. Mientras tanto, si tu colegio subió los resultados individuales de sus estudiantes (en «Pruebas Saber reales»), aparecen como «resultados propios» y los puedes incluir como opción.</p></div>
  <div class="aic-card" style="padding:16px"><b style="font-size:15px">📥 Pruebas Saber reales (año en curso)</b><p style="font-size:13px;color:#64748b;margin:4px 0 8px">Si el ICFES aún no publica los resultados de tu colegio, sube aquí los resultados individuales de tus estudiantes. Luego aparecen como «resultados propios» en los años y puedes usarlos para crear el informe.</p><button onclick="go('icfes')" style="background:#0f766e;color:#fff;padding:10px 14px;border-radius:10px;font-weight:800">⬆️ Subir resultados de mis estudiantes</button></div>
  ${Z.rep?acciones():''}${rankUi()}</div>`}
function zonaUi(){
  if(!Z.dane)return'';
  const b=z=>`<button onclick="ANA.setZona('${z}')" style="padding:8px 14px;border-radius:10px;font-weight:800;border:1.5px solid ${Z.zona===z?'#1e63e9':'#cbd5e1'};background:${Z.zona===z?'#e8f1ff':'#fff'};color:${Z.zona===z?'#1e3a8a':'#334155'}">${z==='Urbana'?'🏙️ Urbano':'🌾 Rural'}</button>`;
  return`<div style="margin-top:12px"><b style="font-size:13px">Zona del colegio</b> <span style="font-size:12px;color:#64748b">(${Z.zona?'registrada: '+Z.zona:'aún sin dato: márcala'})</span><div style="display:flex;gap:8px;margin-top:6px">${b('Urbana')}${b('Rural')}</div><p style="font-size:12px;color:#64748b;margin-top:4px">Sale en la ficha del informe y sirve para filtrar el ranking.</p></div>`}
const SEC=[['','Todos'],['OFICIAL','Oficial'],['NO OFICIAL','Privado']],ZON=[['','Todas'],['Urbana','Urbana'],['Rural','Rural']];
function rankUi(){
  const k=Z.rk,ch=(arr,key)=>arr.map(o=>`<button onclick="ANA.rkSet('${key}','${o[0]}')" style="padding:7px 12px;border-radius:9px;font-weight:700;font-size:13px;border:1.5px solid ${k[key]===o[0]?'#1e63e9':'#cbd5e1'};background:${k[key]===o[0]?'#e8f1ff':'#fff'}">${o[1]}</button>`).join('');
  const yrs=Z.anios.filter(a=>a>=2021).slice().reverse();
  let tabla='';
  if(k.lista){const L=k.lista,mi=L.findIndex(x=>x.dane===Z.dane);
    tabla=!L.length?'<p style="font-size:13px;color:#b45309;margin-top:10px">No hay colegios con esos criterios.</p>':`<p style="font-size:13px;margin-top:10px"><b>${L.length}</b> establecimientos con resultado${mi>=0?` · tu colegio: puesto <b>${mi+1}</b>`:''}.</p><div class="aic-table-wrap"><table style="min-width:560px"><thead><tr><th>PUESTO</th><th>ESTABLECIMIENTO</th><th>MUNICIPIO</th><th>SECTOR</th><th>ZONA</th><th>EVAL.</th><th>GLOBAL</th></tr></thead><tbody>${L.slice(0,k.max).map((x,i)=>{const m=x.dane===Z.dane;return`<tr style="${m?'background:#dbeafe;font-weight:700':''}"><td>${i+1}</td><td>${e(x.nombre)}${m?' ◀':''}</td><td>${e(x.mcpio||'')}</td><td>${x.sector==='OFICIAL'?'Oficial':'Privado'}</td><td>${e(x.zona||'sin dato')}</td><td>${f0(x.n)}</td><td><b>${f1(x.g)}</b></td></tr>`}).join('')}</tbody></table></div>${L.length>k.max?`<button class="aic-link" onclick="ANA.rkMas()">Ver más</button>`:''}${k.zona&&k.zt!=null?`<p style="font-size:12px;color:#64748b;margin-top:6px">Zona registrada para ${k.zt} colegios en la plataforma; los que no la tienen no salen al filtrar por zona.</p>`:''}`}
  return`<div class="aic-card" style="padding:18px"><h2 style="font-weight:800;font-size:19px">🏆 Ranking de instituciones</h2>
  <p style="font-size:13px;color:#64748b;margin:4px 0 10px">De la mejor a la peor por puntaje global. Escoge el año y los criterios.</p>
  <div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
   ${sel('rk_dep','Departamento',Z.deptos.map(d=>[d,d]),Z.dep,'ANA.dep')}
   ${sel('rk_mun','Municipio (opcional)',Z.mcpios.map(d=>[d,d]),k.mun,'ANA.rkMun')}
   ${sel('rk_an','Año',yrs.map(a=>[a,a]),k.anio,'ANA.rkAnio')}</div>
  <div style="margin-top:10px"><b style="font-size:13px">Sector</b><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">${ch(SEC,'sector')}</div></div>
  <div style="margin-top:10px"><b style="font-size:13px">Zona</b><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">${ch(ZON,'zona')}</div></div>
  <button onclick="ANA.rkGo()" ${k.busy?'disabled':''} style="margin-top:12px;background:#1e63e9;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">${k.busy?'⏳ Buscando…':'🏆 Ver ranking'}</button>${tabla}</div>`}
const rkCall=(anio,mun)=>rpc('saber_ranking2',{p_depto:Z.dep,p_mcpio:mun||null,p_anio:+anio,p_cal:Z.cal,p_sector:Z.rk.sector||null,p_zona:Z.rk.zona||null});
function acciones(){return`<div class="aic-card" style="padding:18px"><h3 style="font-weight:800;font-size:17px">✅ Tu análisis está listo</h3>
  <p style="font-size:13px;color:#64748b;margin:4px 0 10px">${e(Z.rep.titulo)} · años ${e(Z.rep.anios.join(', '))}</p>
  <div style="display:flex;flex-wrap:wrap;gap:8px">
   <button onclick="ANA.vista()" style="background:#1e63e9;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">👁 Vista preliminar</button>
   <button onclick="ANA.descargar()" style="background:#0f766e;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">⬇️ Descargar (Word)</button>
   <button onclick="ANA.imprimir()" style="background:#16a34a;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">🖨️ Imprimir / guardar PDF</button>
   <button onclick="ANA.enviar()" style="background:#7c3aed;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">📨 Enviar a docentes o coordinador</button></div>
  ${window.ANAM?secUi():''}<p style="font-size:12px;color:#64748b;margin-top:8px">Sale con el membrete de la institución. El PDF se obtiene con «Imprimir / guardar PDF» (es el formato con todos los gráficos); el archivo Word es editable pero con menos fidelidad.</p></div>`}
/* ---------- gráficos ---------- */
function lineas(series,labels,titulo,max,min){
  const W=640,H=230,L=44,B=34,T=26,C=['#1e63e9','#16a34a','#f59e0b','#7c3aed','#dc2626'];
  const vals=series.flatMap(s=>s.v).filter(v=>v!=null);if(!vals.length)return'';
  const hi=max||Math.ceil(Math.max(...vals)/10)*10+10,lo=min!=null?min:Math.max(0,Math.floor(Math.min(...vals)/10)*10-10);
  const xs=i=>L+(labels.length<2?(W-L-20)/2:i*(W-L-20)/(labels.length-1)),ys=v=>T+(H-T-B)*(1-(v-lo)/((hi-lo)||1));
  const grid=[0,.25,.5,.75,1].map(f=>{const v=lo+(hi-lo)*f;return`<line x1="${L}" x2="${W-20}" y1="${ys(v)}" y2="${ys(v)}" stroke="#e2e8f0"/><text x="${L-6}" y="${ys(v)+4}" text-anchor="end" fill="#64748b">${Math.round(v)}</text>`}).join('');
  const lines=series.map((s,k)=>{const pts=s.v.map((v,i)=>v==null?null:[xs(i),ys(v)]);const ok=pts.filter(Boolean);
    return`<polyline fill="none" stroke="${C[k%5]}" stroke-width="${k===0?3:2}" ${k>0?'stroke-dasharray="5 3"':''} points="${ok.map(p=>p.join(',')).join(' ')}"/>`+pts.map((p,i)=>p?`<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${C[k%5]}"/>${k===0?`<text x="${p[0]}" y="${p[1]-8}" text-anchor="middle" font-weight="700" fill="${C[0]}">${Math.round(s.v[i])}</text>`:''}`:'').join('')}).join('');
  const leg=series.map((s,k)=>`<g transform="translate(${L+k*135},${H-4})"><rect y="-9" width="10" height="10" fill="${C[k%5]}"/><text x="14" font-size="10" fill="#334155">${e(s.l)}</text></g>`).join('');
  return`<svg viewBox="0 0 ${W} ${H+8}" width="100%" style="max-width:660px;font:11px Arial,sans-serif"><text x="0" y="12" font-weight="700" font-size="12">${e(titulo)}</text>${grid}${labels.map((a,i)=>`<text x="${xs(i)}" y="${H-B+16}" text-anchor="middle" fill="#334155">${a}</text>`).join('')}${lines}${leg}</svg>`}
function barras(items,titulo,max){
  const W=640,rowH=26,H=items.length*rowH+30;const C=['#1e63e9','#16a34a','#f59e0b','#94a3b8'];
  return`<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:660px;font:11px Arial,sans-serif"><text x="0" y="12" font-weight="700" font-size="12">${e(titulo)}</text>${items.map((it,i)=>{const y=24+i*rowH,w=(W-230)*(it.v||0)/max;return`<text x="0" y="${y+14}" fill="#334155">${e(it.l)}</text><rect x="190" y="${y}" width="${Math.max(0,w)}" height="18" fill="${it.c||C[i%4]}" rx="3"/><text x="${190+w+6}" y="${y+13}" font-weight="700" fill="#0f172a">${f1(it.v)}</text>`}).join('')}</svg>`}
/* ---------- datos ---------- */
async function generar(){
  if(!puede())return toast('⛔','Sin permiso','Solo el rector o el coordinador pueden crear este informe.');
  if(!esAud()&&(!Z.dane||Z.dane!==Z.ownDane))return toast('⛔','Solo tu institución','Solo puedes crear el informe de tu propia institución.');
  if(!Z.dep)return toast('⚠️','Elige el departamento','');
  if(!Z.sel.length)return toast('⚠️','Elige al menos un año','');
  if(Z.sel.length>10)return toast('⚠️','Máximo 10 años','Quita algunos años.');
  Z.busy=true;Z.rep=null;R();
  try{
    await prep();
    const an=Z.sel.slice().sort(),nivel=Z.dane?'colegio':Z.mun?'municipio':'departamento';
    const anOf=an.filter(a=>Z.anios.includes(a)),anOwn=an.filter(a=>ownOk(a)),anMan=an.filter(a=>manOk(a)&&!ownOk(a));
    const S=n=>anOf.length?rpc('saber_serie',{p_nivel:n,p_depto:Z.dep,p_mcpio:Z.mun||null,p_dane:Z.dane||null,p_anios:anOf,p_cal:Z.cal}):Promise.resolve([]);
    let [pri,mun,dep,pais,ficha]=await Promise.all([S(nivel),Z.mun?S('municipio'):[],S('departamento'),S('pais'),Z.dane?rpc('saber_ficha',{p_dane:Z.dane}):[]]);
    if(anOwn.length&&nivel==='colegio'){pri=pri.concat(Z.own.filter(x=>anOwn.includes(x.anio)).map(x=>({anio:x.anio,n:x.n,global:x.global,mat:x.mat,lec:x.lec,nat:x.nat,soc:x.soc,ing:x.ing,propio:true}))).sort((a,b)=>a.anio-b.anio)}
    if(anMan.length&&nivel==='colegio'){pri=pri.concat(Z.man.filter(x=>anMan.includes(x.anio)).map(x=>({anio:x.anio,n:x.n,global:x.g==null?null:+x.g,mat:x.mat==null?null:+x.mat,lec:x.lec==null?null:+x.lec,nat:x.nat==null?null:+x.nat,soc:x.soc==null?null:+x.soc,ing:x.ing==null?null:+x.ing,propio:true,manual:true}))).sort((a,b)=>a.anio-b.anio)}
    if(!pri.length)throw new Error('No hay resultados publicados para ese lugar en los años elegidos. Prueba con otros años o con el municipio.');
    const ult=pri[pri.length-1].anio;let rank=[];const rkA=anOf.length?Math.max(...anOf.filter(a=>pri.some(p=>p.anio===a))):null;
    if(rkA){try{rank=await rkCall(rkA,'')}catch(x){}}
    const f=(ficha&&ficha[0])||{};
    const titulo=nivel==='colegio'?(f.nombre||Z.colNombre):nivel==='municipio'?'Municipio de '+Z.mun+' ('+Z.dep+')':'Departamento de '+Z.dep;
    Z.rep={cal:Z.cal,nivel,titulo,anios:pri.map(x=>x.anio),pri,mun,dep,pais,ficha:f,rank,ult,dane:Z.dane,zona:Z.zona,propios:anOwn.concat(anMan),manuales:anMan.concat(anOwn),rankAnio:rkA,crit:{sector:Z.rk.sector,zona:Z.rk.zona}};
    Z.html=informe(Z.rep);
  }catch(x){Z.msg=x.message||String(x);toast('⚠️','No se pudo crear el análisis',Z.msg)}
  Z.busy=false;R();
}
async function prep(){if(!window.INF)await loadScript('informes.js?v=2');if(!window.ANAM)await loadScript('analisis_motor.js?v=5')}
const by=(arr,a)=>arr.find(x=>x.anio===a)||{};
function slope(vs,an){const p=an.map((a,i)=>[a,vs[i]]).filter(x=>x[1]!=null);if(p.length<2)return null;const n=p.length,sx=p.reduce((s,x)=>s+x[0],0),sy=p.reduce((s,x)=>s+x[1],0),sxy=p.reduce((s,x)=>s+x[0]*x[1],0),sxx=p.reduce((s,x)=>s+x[0]*x[0],0);const d=n*sxx-sx*sx;if(!d)return null;const m=(n*sxy-sx*sy)/d;return{m,b:(sy-m*sx)/n}}
function ctxDoc(){const L=(typeof LH==='function')?LH():{l1:'',l2:'',l3:'',logo:''};
  return{emit:new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'}),membrete:{l1:L.l1||(M.is_admin&&Z.colNombre?Z.colNombre:M.school_name)||'',l2:L.l2||'',l3:L.l3||'',logo:LGU(L.logo)},acc:n=>{try{return INF._u.acc(n)}catch(x){return[]}},sec:Z.sec,obs:Z.obs,horizontes:Z.hor}}
function informe(r){Z.out=ANAM.build(r,ctxDoc());return Z.out.doc}
function rehacer(){if(!Z.rep)return;Z.html=informe(Z.rep);const f=document.getElementById('ana-if');if(f)f.srcdoc=Z.html;R()}
function setSec(k,on){Z.sec[k]=on;Z.html=informe(Z.rep)}
function setObs(v){Z.obs=v;Z.html=informe(Z.rep)}
function secUi(){return`<details style="margin-top:12px" open><summary style="font-weight:700;font-size:13px;cursor:pointer">Elegir qué secciones incluir</summary><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">${ANAM.SECC.map(([k,n])=>`<label style="border:1.5px solid #cbd5e1;border-radius:9px;padding:6px 10px;font-size:13px"><input type="checkbox" ${Z.sec[k]===false?'':'checked'} onchange="ANA.setSec('${k}',this.checked)"> ${n}</label>`).join('')}</div>
  <label style="display:block;font-size:13px;font-weight:700;margin-top:10px">Observaciones de la institución (opcional, salen en las conclusiones)<textarea oninput="ANA.setObs(this.value)" rows="3" style="width:100%;margin-top:4px;border:1.5px solid #cbd5e1;border-radius:10px;padding:8px;font-weight:400">${e(Z.obs)}</textarea></label></details>`}
/* ---------- acciones ---------- */
function membreteHtml(){const L=(typeof LH==='function')?LH():{l1:'',l2:'',l3:'',logo:''};
  const logo=L.logo?`<img src="${LGU(L.logo)}" style="height:60px;float:left;margin-right:12px">`:'<span class="nologo" style="float:left">Subir membrete</span>';
  return`<div style="text-align:center;border-bottom:2px solid #1e63e9;padding-bottom:6px;margin-bottom:10px;overflow:hidden">${logo}<div style="font-weight:bold;font-size:13pt">${e(L.l1||M.school_name||'')}</div>${L.l2?`<div>${e(L.l2)}</div>`:''}${L.l3?`<div>${e(L.l3)}</div>`:''}</div>`}
function cerrar(){document.getElementById('ana-prev')?.remove()}
async function vista(){if(!Z.rep)return;await prep();Z.html=informe(Z.rep);
  cerrar();const d=document.createElement('div');d.id='ana-prev';d.style.cssText='position:fixed;inset:0;z-index:200;background:#0008;display:flex;align-items:flex-start;justify-content:center;padding:10px';
  d.innerHTML=`<div style="background:#fff;border-radius:14px;max-width:900px;width:100%;height:calc(100vh - 20px);display:flex;flex-direction:column;padding:10px"><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:8px"><b>Vista preliminar · ${e(Z.rep.titulo)} · ${Z.out.pages} páginas</b><div style="display:flex;gap:6px;flex-wrap:wrap"><button onclick="ANA.descargar()" style="background:#0f766e;color:#fff;padding:8px 12px;border-radius:10px;font-weight:800">⬇️ Descargar</button><button onclick="ANA.imprimir()" style="background:#16a34a;color:#fff;padding:8px 12px;border-radius:10px;font-weight:800">🖨️ Imprimir / PDF</button><button onclick="ANA.enviar()" style="background:#7c3aed;color:#fff;padding:8px 12px;border-radius:10px;font-weight:800">📨 Enviar</button><button onclick="ANA.cerrar()" style="background:#e2e8f0;padding:8px 12px;border-radius:10px;font-weight:700">Cerrar</button></div></div><iframe id="ana-if" style="flex:1;border:1px solid #e2e8f0;border-radius:8px;width:100%"></iframe></div>`;
  document.body.appendChild(d);document.getElementById('ana-if').srcdoc=Z.html}
async function imprimir(){if(!Z.rep)return;await prep();Z.html=informe(Z.rep);
  document.getElementById('ana-pr')?.remove();const f=document.createElement('iframe');f.id='ana-pr';f.style.cssText='position:fixed;left:-9999px;top:0;width:210mm;height:297mm;border:0';f.srcdoc=Z.html;
  f.onload=()=>setTimeout(()=>{try{f.contentWindow.focus();f.contentWindow.print()}catch(x){err(x)}},400);document.body.appendChild(f)}
async function svgPng(html){ // Word no dibuja SVG: se convierten a imagen
  const box=document.createElement('div');box.innerHTML=html;
  for(const s of [...box.querySelectorAll('svg')]){try{
    const vb=(s.getAttribute('viewBox')||'0 0 640 250').split(' ').map(Number),w=vb[2],h=vb[3];
    s.setAttribute('xmlns','http://www.w3.org/2000/svg');s.setAttribute('width',w);s.setAttribute('height',h);
    const img=new Image();await new Promise((ok,ko)=>{img.onload=ok;img.onerror=ko;img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s.outerHTML)});
    const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);
    const im=document.createElement('img');im.src=c.toDataURL('image/png');im.width=Math.min(640,w);im.height=Math.round(Math.min(640,w)*h/w);s.replaceWith(im)}catch(x){}}
  return box.innerHTML}
async function docBlob(){Z.html=informe(Z.rep);const o=Z.out;let body=await svgPng(o.body);
  const css=o.css.replace('.sheet{width:210mm;height:296mm;','.sheet{width:auto;height:auto;').replace(/overflow:hidden;page-break-after:always/,'page-break-after:always');
  const h=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Informe Saber 11</title><style>${css}.hd,.ft{position:static!important}.cover{background:#fff!important;color:#000!important}.cover *{color:#000!important}</style></head><body>${body}</body></html>`;return new Blob(['\ufeff',h],{type:'application/msword'})}
const nombreArchivo=()=>('Analisis_Saber11_'+Z.rep.titulo.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^\w]+/g,'_').slice(0,50)+'_'+Z.rep.anios[0]+'-'+Z.rep.anios[Z.rep.anios.length-1]+'.doc');
async function descargar(){if(!Z.rep)return;await prep();const bl=await docBlob();const a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=nombreArchivo();document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);toast('⬇️','Descargado','El archivo se abre con Word. Para PDF usa «Imprimir / guardar PDF».')}
async function enviar(){
  if(!Z.rep)return;await prep();
  let dir=[];try{dir=await rpc('directorio_colegio')}catch(x){return err(x)}
  dir=(dir||[]).filter(p=>p.id!==M.id&&(p.role==='prof'||p.role==='coordinador'));
  if(!dir.length)return toast('⚠️','No hay a quién enviar','Aún no hay docentes ni coordinador registrados en tu colegio.');
  document.getElementById('ana-env')?.remove();const d=document.createElement('div');d.id='ana-env';d.style.cssText='position:fixed;inset:0;z-index:300;background:#0009;display:flex;align-items:center;justify-content:center;padding:16px';
  d.innerHTML=`<div style="background:#fff;border-radius:14px;max-width:460px;width:100%;padding:18px;max-height:90vh;overflow:auto"><h3 style="font-weight:800;font-size:17px">📨 Enviar el análisis</h3><p style="font-size:13px;color:#64748b;margin:4px 0 8px">Elige quién lo recibe. Lo verán en su bandeja de Mensajes.</p>
   <label style="display:block;font-size:13px;margin-bottom:6px"><input type="checkbox" onchange="document.querySelectorAll('.ana-p').forEach(c=>c.checked=this.checked)"> <b>Todos (${dir.length})</b></label>
   <div style="max-height:260px;overflow:auto;border:1px solid #e2e8f0;border-radius:10px;padding:8px">${dir.map(p=>`<label style="display:block;font-size:13px;padding:3px 0"><input class="ana-p" type="checkbox" value="${p.id}"> ${e(p.full_name)} <span style="color:#64748b">· ${p.role==='coordinador'?'Coordinador':'Docente'}</span></label>`).join('')}</div>
   <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px"><button onclick="document.getElementById('ana-env').remove()" style="background:#e2e8f0;padding:9px 14px;border-radius:10px;font-weight:700">Cancelar</button><button id="ana-go" onclick="ANA.enviarYa()" style="background:#7c3aed;color:#fff;padding:9px 14px;border-radius:10px;font-weight:800">Enviar</button></div></div>`;
  document.body.appendChild(d)}
async function enviarYa(){
  const ids=[...document.querySelectorAll('.ana-p:checked')].map(c=>c.value);if(!ids.length)return toast('⚠️','Elige al menos una persona','');
  const b=document.getElementById('ana-go');if(b){b.disabled=true;b.textContent='Enviando…'}
  try{
    const nombre=nombreArchivo(),path=(M.colegio_id||'sin')+'/'+M.id+'/'+Date.now()+'-'+nombre;
    const up=await sb.storage.from('mensajes').upload(path,await docBlob(),{contentType:'application/msword'});if(up.error)throw up.error;
    let ok=0;const u=Z.rep.pri[Z.rep.pri.length-1];
    const txt=`Te comparto el análisis de resultados Saber 11 de ${Z.rep.titulo}, años ${Z.rep.anios.join(', ')}.\nPuntaje global ${Z.rep.ult}: ${f1(u.global)} / 500.\nEl informe completo va adjunto.`;
    for(const id of ids){const r=await sb.rpc('mensaje_enviar',{p_para:id,p_tipo:'documento',p_asunto:'Análisis Saber 11 · '+Z.rep.titulo,p_texto:txt,p_path:path,p_nombre:nombre});if(!r.error)ok++}
    document.getElementById('ana-env')?.remove();toast('📨','Enviado','Lo recibieron '+ok+' persona(s) en su bandeja de Mensajes.');
  }catch(x){if(b){b.disabled=false;b.textContent='Enviar'}err(x)}}
async function setCal(c){Z.cal=c;Z.rep=null;Z.msg='';
  try{Z.anios=(await rpc('saber_anios',{p_cal:c}))||[];Z.sel=Z.anios.filter(a=>VENT.includes(a));Z.rk.anio=String(Z.anios.filter(a=>a>=2021).slice(-1)[0]||'');Z.rk.lista=null;
    if(esAud()&&Z.dep&&Z.mun){Z.cols=await rpc('saber_colegios',{p_depto:Z.dep,p_mcpio:Z.mun,p_cal:c});if(Z.dane&&!Z.cols.some(x=>x.dane===Z.dane)){Z.dane='';Z.colNombre=''}}}catch(x){err(x)}R()}
return{setSec,setObs,rehacer,setCal,load,view,generar,vista,imprimir,descargar,enviar,enviarYa,cerrar,
  async dep(v){if(!esAud())return;Z.rk.lista=null;Z.rk.mun='';Z.dep=v;Z.mun='';Z.dane='';Z.cols=[];Z.mcpios=[];Z.rep=null;Z.msg='';if(v){try{Z.mcpios=await rpc('saber_mcpios',{p_depto:v})}catch(x){err(x)}}R()},
  async mun(v){if(!esAud())return;Z.mun=v;Z.dane='';Z.cols=[];Z.rep=null;if(v){try{Z.cols=await rpc('saber_colegios',{p_depto:Z.dep,p_mcpio:v,p_cal:Z.cal})}catch(x){err(x)}}R()},
  async col(v){if(!esAud())return;Z.dane=v;const c=Z.cols.find(x=>x.dane===v);Z.colNombre=c?c.nombre:'';Z.rep=null;Z.sel=Z.sel.filter(a=>Z.anios.includes(a));await cargaExtra();Z.man.forEach(m=>{if(manOk(m.anio)&&!Z.sel.includes(m.anio))Z.sel.push(m.anio)});Z.sel.sort();R()},
  async setZona(z){try{await rpc('colegio_zona_set',{p_dane:Z.dane,p_zona:z});Z.zona=z;Z.rep=null;Z.rk.lista=null;toast('✅','Zona guardada',z)}catch(x){err(x)}R()},
  rkSet(k,v){Z.rk[k]=v;Z.rk.lista=null;R()},rkMun(v){Z.rk.mun=v;Z.rk.lista=null;R()},rkAnio(v){Z.rk.anio=v;Z.rk.lista=null;R()},rkMas(){Z.rk.max+=40;R()},
  async rkGo(){if(!Z.dep)return toast('⚠️','Elige el departamento','');if(!Z.rk.anio)return toast('⚠️','Elige el año','');Z.rk.busy=true;Z.rk.max=30;R();try{Z.rk.lista=await rkCall(Z.rk.anio,Z.rk.mun)}catch(x){err(x)}Z.rk.busy=false;R()},
  anio(a,on){const s=new Set(Z.sel);on?s.add(a):s.delete(a);Z.sel=[...s].sort();Z.rep=null;R()},
  ult(n){Z.sel=VENT.slice(-n).filter(avail);Z.rep=null;if(!Z.sel.length)Z.msg='Para esos años el ICFES aún no ha publicado resultados en datos abiertos.';else Z.msg='';R()},quitar(){Z.sel=[];Z.rep=null;R()},
  _t:{informe,set:async x=>{await prep();Z.rep=x;Z.html=informe(x)},html:()=>Z.html,out:()=>Z.out}}})();
