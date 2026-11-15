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
const AC=new Date().getFullYear(),VENT=Array.from({length:8},(_,i)=>AC-7+i);
let Z={deptos:[],mcpios:[],cols:[],anios:[],dep:'',mun:'',dane:'',colNombre:'',sel:[],busy:false,msg:'',rep:null,html:''};
const R=()=>render();
const rpc=async(n,a)=>{const r=await sb.rpc(n,a);if(r.error)throw r.error;return r.data};
async function load(){
  if(Z.deptos.length)return;
  try{Z.deptos=(await rpc('saber_deptos'))||[];Z.anios=(await rpc('saber_anios'))||[];
    Z.sel=Z.anios.filter(a=>VENT.includes(a));
    // intenta ubicar el colegio del rector
    const c=D.school&&D.school.colegios;
    if(c&&c.municipios){const dn=norm(c.municipios.departamentos&&c.municipios.departamentos.nombre),mn=norm(c.municipios.nombre);
      const d=Z.deptos.find(x=>norm(x)===dn||norm(x).startsWith(dn)||dn.startsWith(norm(x)));
      if(d){Z.dep=d;Z.mcpios=await rpc('saber_mcpios',{p_depto:d});const m=Z.mcpios.find(x=>norm(x)===mn);
        if(m){Z.mun=m;Z.cols=await rpc('saber_colegios',{p_depto:d,p_mcpio:m});
          const cn=norm(c.nombre).replace(/\b(INSTITUCION EDUCATIVA|I E|IE|COLEGIO)\b/g,'').trim();
          const k=Z.cols.find(x=>norm(x.nombre).replace(/\b(INSTITUCION EDUCATIVA|I E|IE|COLEGIO)\b/g,'').trim()===cn);
          if(k){Z.dane=k.dane;Z.colNombre=k.nombre}}}}
  }catch(x){Z.msg='No se pudieron cargar los datos del ICFES: '+(x.message||x)}
}
const sel=(id,lab,opts,val,fn)=>`<label style="font-size:13px;font-weight:700;display:block">${lab}<select id="${id}" onchange="${fn}(this.value)" style="display:block;width:100%;margin-top:4px;border:1.5px solid #cbd5e1;border-radius:10px;padding:10px;font-weight:400;font-size:14px;background:#fff"><option value="">Elige…</option>${opts.map(o=>`<option value="${e(o[0])}" ${String(o[0])===String(val)?'selected':''}>${e(o[1])}</option>`).join('')}</select></label>`;
function view(){
  const nSel=Z.sel.length;
  return`<div style="display:grid;gap:14px">
  <div class="aic-card" style="padding:18px"><h2 style="font-weight:800;font-size:19px">📊 Crear análisis de mi institución</h2>
   <p style="font-size:13px;color:#64748b;margin:4px 0 12px">Elige el lugar y los años. La plataforma toma los <b>resultados reales de Saber 11</b> publicados por el ICFES (datos abiertos del Estado colombiano) y arma un informe profesional con comparativos contra el municipio, el departamento y el país, en la ventana de los últimos 8 años.</p>
   ${Z.msg?`<p style="font-size:13px;color:#b45309;margin-bottom:8px">${e(Z.msg)}</p>`:''}
   <div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
    ${sel('an_dep','1. Departamento',Z.deptos.map(d=>[d,d]),Z.dep,'ANA.dep')}
    ${sel('an_mun','2. Municipio',Z.mcpios.map(d=>[d,d]),Z.mun,'ANA.mun')}
    ${sel('an_col','3. Colegio (institución)',Z.cols.map(c=>[c.dane,c.nombre]),Z.dane,'ANA.col')}
   </div>
   <p style="font-size:12px;color:#64748b;margin-top:6px">Si no eliges colegio, el análisis se hace del municipio (o del departamento si tampoco eliges municipio).</p>
   <div style="margin-top:12px"><b style="font-size:13px">4. Años a analizar</b> <span style="font-size:12px;color:#64748b">(${nSel} elegido${nSel===1?'':'s'}; la lista se mueve sola cada año: sale el más antiguo)</span>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">${VENT.map(a=>{const ok=Z.anios.includes(a);return ok?`<label style="border:1.5px solid #cbd5e1;border-radius:10px;padding:8px 12px;font-size:14px;cursor:pointer;${Z.sel.includes(a)?'background:#e8f1ff;border-color:#1e63e9;font-weight:800':''}"><input type="checkbox" ${Z.sel.includes(a)?'checked':''} onchange="ANA.anio(${a},this.checked)"> ${a}</label>`:`<span title="El ICFES aún no publica este año en datos abiertos" style="border:1.5px dashed #e2e8f0;border-radius:10px;padding:8px 12px;font-size:13px;color:#94a3b8">${a} · sin datos</span>`}).join('')}</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px"><button onclick="ANA.ult(3)" style="background:#e8f1ff;color:#1e3a8a;padding:7px 12px;border-radius:9px;font-weight:700;font-size:13px">Últimos 3 años (${VENT[5]}–${VENT[7]})</button><button onclick="ANA.ult(5)" style="background:#e8f1ff;color:#1e3a8a;padding:7px 12px;border-radius:9px;font-weight:700;font-size:13px">Últimos 5 años (${VENT[3]}–${VENT[7]})</button><button onclick="ANA.ult(8)" style="background:#e8f1ff;color:#1e3a8a;padding:7px 12px;border-radius:9px;font-weight:700;font-size:13px">Todos (${VENT[0]}–${VENT[7]})</button><button class="aic-link" onclick="ANA.quitar()">Quitar todos</button></div></div>
   <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px"><button onclick="ANA.generar()" ${Z.busy?'disabled':''} style="background:#1e63e9;color:#fff;padding:12px 18px;border-radius:10px;font-weight:800">${Z.busy?'⏳ Preparando el informe…':'📊 Crear análisis'}</button></div>
   <p style="font-size:12px;color:#64748b;margin-top:10px">Fuente: ICFES · «Resultados únicos Saber 11» (datos.gov.co). Años disponibles en los datos abiertos: ${Z.anios.length?Z.anios[0]+' a '+Z.anios[Z.anios.length-1]:'—'}. Los resultados de años más recientes se agregan en cuanto el ICFES los publique en datos abiertos; mientras tanto puedes cargar los reportes de tu colegio en «Pruebas Saber reales».</p></div>
  ${Z.rep?acciones():''}</div>`}
function acciones(){return`<div class="aic-card" style="padding:18px"><h3 style="font-weight:800;font-size:17px">✅ Tu análisis está listo</h3>
  <p style="font-size:13px;color:#64748b;margin:4px 0 10px">${e(Z.rep.titulo)} · años ${e(Z.rep.anios.join(', '))}</p>
  <div style="display:flex;flex-wrap:wrap;gap:8px">
   <button onclick="ANA.vista()" style="background:#1e63e9;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">👁 Vista preliminar</button>
   <button onclick="ANA.descargar()" style="background:#0f766e;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">⬇️ Descargar (Word)</button>
   <button onclick="ANA.imprimir()" style="background:#16a34a;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">🖨️ Imprimir / guardar PDF</button>
   <button onclick="ANA.enviar()" style="background:#7c3aed;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">📨 Enviar a docentes o coordinador</button></div>
  <p style="font-size:12px;color:#64748b;margin-top:8px">Sale con el membrete de la institución.</p></div>`}
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
  if(!Z.dep)return toast('⚠️','Elige el departamento','');
  if(!Z.sel.length)return toast('⚠️','Elige al menos un año','');
  if(Z.sel.length>10)return toast('⚠️','Máximo 10 años','Quita algunos años.');
  Z.busy=true;Z.rep=null;R();
  try{
    await prep();
    const an=Z.sel.slice().sort(),nivel=Z.dane?'colegio':Z.mun?'municipio':'departamento';
    const S=n=>rpc('saber_serie',{p_nivel:n,p_depto:Z.dep,p_mcpio:Z.mun||null,p_dane:Z.dane||null,p_anios:an});
    const [pri,mun,dep,pais,ficha]=await Promise.all([S(nivel),Z.mun?S('municipio'):[],S('departamento'),S('pais'),Z.dane?rpc('saber_ficha',{p_dane:Z.dane}):[]]);
    if(!pri.length)throw new Error('No hay resultados publicados para ese lugar en los años elegidos. Prueba con otros años o con el municipio.');
    const ult=pri[pri.length-1].anio;let rank=[];
    try{rank=await rpc('saber_ranking',{p_depto:Z.dep,p_anio:ult})}catch(x){}
    const f=(ficha&&ficha[0])||{};
    const titulo=nivel==='colegio'?(f.nombre||Z.colNombre):nivel==='municipio'?'Municipio de '+Z.mun+' ('+Z.dep+')':'Departamento de '+Z.dep;
    Z.rep={nivel,titulo,anios:pri.map(x=>x.anio),pri,mun,dep,pais,ficha:f,rank,ult,dane:Z.dane};
    Z.html=informe(Z.rep);
  }catch(x){Z.msg=x.message||String(x);toast('⚠️','No se pudo crear el análisis',Z.msg)}
  Z.busy=false;R();
}
async function prep(){if(!window.INF)await loadScript('informes.js?v=2')}
const by=(arr,a)=>arr.find(x=>x.anio===a)||{};
function slope(vs,an){const p=an.map((a,i)=>[a,vs[i]]).filter(x=>x[1]!=null);if(p.length<2)return null;const n=p.length,sx=p.reduce((s,x)=>s+x[0],0),sy=p.reduce((s,x)=>s+x[1],0),sxy=p.reduce((s,x)=>s+x[0]*x[1],0),sxx=p.reduce((s,x)=>s+x[0]*x[0],0);const d=n*sxx-sx*sx;if(!d)return null;const m=(n*sxy-sx*sy)/d;return{m,b:(sy-m*sx)/n}}
function informe(r){
  const U=INF._u,Lh=(typeof LH==='function')?LH():{l1:'',l2:'',l3:''},an=r.anios,ult=r.ult,u=by(r.pri,ult),first=r.pri[0];
  const um=by(r.mun,ult),ud=by(r.dep,ult),up=by(r.pais,ult),colego=r.nivel==='colegio';
  const emit=new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'});
  const enc=U.enc('Análisis de resultados Saber 11 · '+an[0]+(an.length>1?'–'+an[an.length-1]:''),'Emitido el '+emit);
  const dif=(a,b)=>a==null||b==null?null:Math.round((a-b)*10)/10;
  const vP=dif(u.global,up.global),vD=dif(u.global,ud.global),vM=dif(u.global,um.global);
  const evol=first&&first.anio!==ult?dif(u.global,first.global):null;
  // posiciones
  let posM='',posD='';
  if(colego&&r.rank&&r.rank.length){const iD=r.rank.findIndex(x=>x.dane===r.dane);if(iD>=0){posD=`${iD+1} de ${r.rank.length}`;const rm=r.rank.filter(x=>norm(x.mcpio)===norm(r.ficha.mcpio||Z.mun));const iM=rm.findIndex(x=>x.dane===r.dane);if(iM>=0)posM=`${iM+1} de ${rm.length}`}}
  // áreas
  const ar=AREAS.map(([k,nm])=>({k,nm,v:u[k],p:up[k],d:ud[k],m:um[k],bp:dif(u[k],up[k]),first:first?first[k]:null})).filter(a=>a.v!=null);
  const ord=[...ar].sort((a,b)=>b.v-a.v),fort=ord.slice(0,2),deb=[...ar].sort((a,b)=>(a.bp==null?99:a.bp)-(b.bp==null?99:b.bp)).slice(0,2);
  const gl=r.pri.map(x=>x.global),tg=slope(gl,r.pri.map(x=>x.anio)),sig=ult+1;
  const proy=tg?Math.max(0,Math.min(500,tg.m*sig+tg.b)):null;
  const posTxt=(a,b)=>a==null?'':a>0?`<b style="color:#15803d">${f1(a)} puntos por encima</b> ${b}`:a<0?`<b style="color:#b91c1c">${f1(Math.abs(a))} puntos por debajo</b> ${b}`:`igual ${b}`;
  const resumen=`<p style="font-size:10.5pt;text-align:justify">En <b>${ult}</b>, ${colego?'la institución':'el territorio'} <b>${e(r.titulo)}</b> obtuvo un puntaje global promedio de <b>${f1(u.global)}</b> sobre 500, con <b>${f0(u.n)}</b> estudiantes evaluados. Ese resultado está ${posTxt(vP,'del promedio nacional ('+f1(up.global)+')')}${ud.global!=null?', '+posTxt(vD,'del promedio departamental ('+f1(ud.global)+')'):''}${colego&&um.global!=null?' y '+posTxt(vM,'del promedio municipal ('+f1(um.global)+')'):''}.
   ${evol!=null?`Frente a ${first.anio}, el puntaje global ${evol>0?'<b style="color:#15803d">subió '+f1(evol)+'</b>':evol<0?'<b style="color:#b91c1c">bajó '+f1(Math.abs(evol))+'</b>':'se mantuvo'} puntos.`:''}
   ${posD?` En el ranking departamental de ${ult} ocupó el puesto <b>${posD}</b> (instituciones con 5 o más evaluados)${posM?' y el puesto <b>'+posM+'</b> en su municipio':''}.`:''}
   ${fort.length?` Su área más fuerte es <b>${e(fort[0].nm)}</b> (${f1(fort[0].v)}) y las que más requieren atención son <b>${deb.map(a=>e(a.nm)).join('</b> y <b>')}</b>.`:''}</p>`;
  const k=`<div class="k"><div><b>${f1(u.global)}</b>Puntaje global ${ult}</div><div><b>${f0(u.n)}</b>Estudiantes evaluados</div><div><b>${sg(vP)}</b>Frente al país</div><div><b>${evol!=null?sg(evol):'—'}</b>Cambio desde ${first&&first.anio}</div></div>`;
  const ficha=`<table><tr><td><b>${colego?'Institución':'Territorio'}</b></td><td colspan="3">${e(r.titulo)}</td></tr>
   ${colego?`<tr><td><b>Código DANE</b></td><td>${e(r.dane)}</td><td><b>Sector</b></td><td>${e(r.ficha.sector||'—')}</td></tr><tr><td><b>Municipio</b></td><td>${e(r.ficha.mcpio||Z.mun)}</td><td><b>Departamento</b></td><td>${e(r.ficha.depto||Z.dep)}</td></tr>`:`<tr><td><b>Departamento</b></td><td>${e(Z.dep)}</td><td><b>Municipio</b></td><td>${e(Z.mun||'Todos')}</td></tr>`}
   <tr><td><b>Años analizados</b></td><td>${an.join(', ')}</td><td><b>Fuente</b></td><td>ICFES · datos abiertos (datos.gov.co)</td></tr></table>`;
  // tabla global por año
  const lbl=colego?'Institución':'Territorio';
  const tg1=`<table><tr><th>Año</th><th>Evaluados</th><th>${lbl}</th>${r.mun.length?'<th>Municipio</th>':''}<th>Departamento</th><th>País</th><th>Variación anual</th><th>Brecha con el país</th></tr>
   ${r.pri.map((x,i)=>{const pv=i?dif(x.global,r.pri[i-1].global):null,bp=dif(x.global,by(r.pais,x.anio).global);return`<tr><td><b>${x.anio}</b></td><td>${f0(x.n)}</td><td><b>${f1(x.global)}</b></td>${r.mun.length?`<td>${f1(by(r.mun,x.anio).global)}</td>`:''}<td>${f1(by(r.dep,x.anio).global)}</td><td>${f1(by(r.pais,x.anio).global)}</td><td style="color:${col(pv)}">${i?sg(pv):'—'}</td><td style="color:${col(bp)}">${sg(bp)}</td></tr>`}).join('')}</table>`;
  const serG=[{l:colego?'Institución':'Territorio',v:r.pri.map(x=>x.global)}];
  if(r.mun.length&&colego)serG.push({l:'Municipio',v:an.map(a=>by(r.mun,a).global??null)});
  serG.push({l:'Departamento',v:an.map(a=>by(r.dep,a).global??null)},{l:'País',v:an.map(a=>by(r.pais,a).global??null)});
  const g1=lineas(serG,an,'Puntaje global promedio por año (escala 0–500)');
  // áreas último año
  const tA=`<table><tr><th>Prueba</th><th>${lbl}</th>${r.mun.length?'<th>Municipio</th>':''}<th>Departamento</th><th>País</th><th>Brecha con el país</th><th>Valoración</th></tr>${ar.map(a=>{const v=a.bp==null?'—':a.bp>=2?'Fortaleza':a.bp>=-2?'En el promedio':a.bp>=-6?'Por mejorar':'Prioridad';const cc=a.bp==null?'#64748b':a.bp>=2?'#15803d':a.bp>=-2?'#475569':a.bp>=-6?'#b45309':'#b91c1c';return`<tr><td><b>${a.nm}</b></td><td><b>${f1(a.v)}</b></td>${r.mun.length?`<td>${f1(a.m)}</td>`:''}<td>${f1(a.d)}</td><td>${f1(a.p)}</td><td style="color:${col(a.bp)}">${sg(a.bp)}</td><td style="color:${cc};font-weight:700">${v}</td></tr>`}).join('')}</table>`;
  const bA=barras(ar.flatMap(a=>[{l:a.nm+' · '+(colego?'Institución':'Territorio'),v:a.v,c:'#1e63e9'},{l:a.nm+' · País',v:a.p,c:'#94a3b8'}]),'Promedio por prueba en '+ult+' (escala 0–100)',100);
  // evolución por área
  const tE=`<table><tr><th>Prueba</th>${an.map(a=>`<th>${a}</th>`).join('')}<th>Cambio total</th></tr>${AREAS.map(([k,nm])=>{const vs=r.pri.map(x=>x[k]);const ok=vs.filter(v=>v!=null);const ch=ok.length>1?Math.round((ok[ok.length-1]-ok[0])*10)/10:null;return`<tr><td><b>${nm}</b></td>${vs.map(v=>`<td>${f1(v)}</td>`).join('')}<td style="color:${col(ch)};font-weight:700">${sg(ch)}</td></tr>`}).join('')}</table>`;
  const gE=an.length>1?lineas(AREAS.map(([k,nm])=>({l:nm.split(' ')[0]+(k==='soc'?' y C.':''),v:r.pri.map(x=>x[k]??null)})),an,'Evolución por prueba (escala 0–100)'):'';
  // ranking top 10
  let top='';
  if(r.rank&&r.rank.length){const rm=r.rank.filter(x=>Z.mun&&norm(x.mcpio)===norm(Z.mun)).slice(0,10);const lista=rm.length?rm:r.rank.slice(0,10);
    top=`<h3>5. Posición en el ranking ${rm.length?'del municipio':'del departamento'} · ${ult}</h3><table><tr><th>Puesto</th><th>Institución</th><th>Municipio</th><th>Sector</th><th>Evaluados</th><th>Global</th></tr>${lista.map((x,i)=>{const mine=x.dane===r.dane;return`<tr style="${mine?'background:#e8f1ff;font-weight:700':''}"><td>${i+1}</td><td>${e(x.nombre)}${mine?' ◀':''}</td><td>${e(x.mcpio)}</td><td>${e(x.sector||'')}</td><td>${f0(x.n)}</td><td><b>${f1(x.g)}</b></td></tr>`}).join('')}</table><p style="font-size:9pt;color:#64748b">Ranking de ${rm.length?'los establecimientos del municipio':'los establecimientos del departamento'} con 5 o más estudiantes evaluados; el puntaje es el promedio de todas las sedes y jornadas del establecimiento.${colego&&posD?` Posición departamental de la institución: ${posD}${posM?'; en el municipio: '+posM:''}.`:''}</p>`}
  const analisisAreas=`<ul style="font-size:10pt">${ar.map(a=>`<li><b>${a.nm}:</b> promedio ${f1(a.v)}${a.bp!=null?`, ${a.bp>=0?'por encima':'por debajo'} del país por ${f1(Math.abs(a.bp))} puntos`:''}${a.first!=null&&first.anio!==ult?`; frente a ${first.anio} ${a.v>a.first?'avanzó':'retrocedió'} ${f1(Math.abs(a.v-a.first))} puntos`:''}.</li>`).join('')}</ul>`;
  const recom=deb.length?deb.map(a=>`<tr><td><b>${a.nm}</b></td><td>${f1(a.v)}${a.bp!=null?' ('+sg(a.bp)+' vs. país)':''}</td><td><ul>${U.acc(a.nm).slice(0,3).map(t=>`<li>${e(t)}</li>`).join('')}</ul></td></tr>`).join(''):'';
  const concl=`<ul style="font-size:10pt">
   <li>${vP==null?'':vP>=0?`El resultado global supera al promedio nacional en ${f1(vP)} puntos: se recomienda consolidar las prácticas que funcionan y documentarlas.`:`El resultado global está ${f1(Math.abs(vP))} puntos por debajo del promedio nacional: se recomienda un plan de mejoramiento priorizado por áreas.`}</li>
   ${tg&&an.length>=3?`<li>La tendencia de los ${an.length} años analizados es de <b>${tg.m>=0?'+':''}${f1(tg.m)} puntos por año</b>; si se mantiene, el puntaje global de ${sig} sería cercano a <b>${f0(proy)}</b> (estimación estadística, no un resultado oficial).</li>`:''}
   ${fort.length?`<li>Fortalezas: ${fort.map(a=>a.nm+' ('+f1(a.v)+')').join(' y ')}.</li>`:''}
   ${deb.length?`<li>Áreas prioritarias: ${deb.map(a=>a.nm+' ('+f1(a.v)+')').join(' y ')}.</li>`:''}
   <li>Se sugiere socializar este informe con el consejo académico y los docentes de área, fijar metas por prueba y hacer seguimiento con simulacros periódicos en AULA360.</li></ul>`;
  const pie=`<p style="font-size:9pt;color:#64748b">Fuente de los datos: ICFES, «Resultados únicos Saber 11», publicados en datos.gov.co (datos abiertos). Los promedios son ponderados por número de estudiantes evaluados. El puntaje global va de 0 a 500 y el de cada prueba de 0 a 100. ${an.some(a=>a>=2023)?'':'Los años más recientes aún no están en los datos abiertos del ICFES. '}Informe generado por AULA360 el ${emit}.</p>`;
  const pg1=`<div class="inf pg">${enc}${k}<h3>1. Ficha técnica</h3>${ficha}<h3>2. Resumen ejecutivo</h3>${resumen}<h3>3. Evolución del puntaje global</h3>${g1}${tG(tg1)}</div>`;
  const pg2=`<div class="inf pg">${enc}<h3>4. Resultados por prueba en ${ult}</h3>${tA}${bA}<h3>Evolución por prueba</h3>${tE}${gE}</div>`;
  const pg3=`<div class="inf pg">${enc}${top}<h3>6. Análisis por prueba</h3>${analisisAreas}${recom?`<h3>7. Recomendaciones para el plan de mejoramiento</h3><table><tr><th>Prueba prioritaria</th><th>Situación ${ult}</th><th>Estrategias sugeridas</th></tr>${recom}</table>`:''}<h3>8. Conclusiones</h3>${concl}${pie}</div>`;
  return pg1+pg2+pg3;
  function tG(t){return t}
}
/* ---------- acciones ---------- */
function membreteHtml(){const L=(typeof LH==='function')?LH():{l1:'',l2:'',l3:'',logo:''};
  const logo=L.logo&&typeof LOGO!=='undefined'?`<img src="${LOGO}${encodeURI(L.logo)}" style="height:60px;float:left;margin-right:12px">`:'';
  return`<div style="text-align:center;border-bottom:2px solid #1e63e9;padding-bottom:6px;margin-bottom:10px;overflow:hidden">${logo}<div style="font-weight:bold;font-size:13pt">${e(L.l1||M.school_name||'')}</div>${L.l2?`<div>${e(L.l2)}</div>`:''}${L.l3?`<div>${e(L.l3)}</div>`:''}</div>`}
function cerrar(){document.getElementById('ana-prev')?.remove()}
async function vista(){if(!Z.rep)return;await prep();
  cerrar();const d=document.createElement('div');d.id='ana-prev';d.style.cssText='position:fixed;inset:0;z-index:200;background:#0008;display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:16px';
  d.innerHTML=`<div style="background:#fff;border-radius:14px;max-width:860px;width:100%;padding:16px"><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:10px;position:sticky;top:0;background:#fff;padding:6px 0;z-index:2"><b>Vista preliminar · ${e(Z.rep.titulo)}</b><div style="display:flex;gap:6px;flex-wrap:wrap"><button onclick="ANA.descargar()" style="background:#0f766e;color:#fff;padding:8px 12px;border-radius:10px;font-weight:800">⬇️ Descargar</button><button onclick="ANA.imprimir()" style="background:#16a34a;color:#fff;padding:8px 12px;border-radius:10px;font-weight:800">🖨️ Imprimir</button><button onclick="ANA.enviar()" style="background:#7c3aed;color:#fff;padding:8px 12px;border-radius:10px;font-weight:800">📨 Enviar</button><button onclick="ANA.cerrar()" style="background:#e2e8f0;padding:8px 12px;border-radius:10px;font-weight:700">Cerrar</button></div></div><div>${membreteHtml()}${INF._u.CSS}${Z.html}</div></div>`;
  document.body.appendChild(d)}
async function imprimir(){if(!Z.rep)return;await prep();doPrint(INF._u.CSS+Z.html,{tipo:'ANA',titulo:'Análisis Saber 11 · '+Z.rep.titulo,hoja:true})}
function docBlob(){const h=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Análisis Saber 11</title></head><body>${membreteHtml()}${INF._u.CSS}${Z.html}</body></html>`;return new Blob(['﻿',h],{type:'application/msword'})}
const nombreArchivo=()=>('Analisis_Saber11_'+Z.rep.titulo.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^\w]+/g,'_').slice(0,50)+'_'+Z.rep.anios[0]+'-'+Z.rep.anios[Z.rep.anios.length-1]+'.doc');
async function descargar(){if(!Z.rep)return;await prep();const a=document.createElement('a');a.href=URL.createObjectURL(docBlob());a.download=nombreArchivo();document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);toast('⬇️','Descargado','El archivo se abre con Word. Para PDF usa «Imprimir / guardar PDF».')}
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
    const up=await sb.storage.from('mensajes').upload(path,docBlob(),{contentType:'application/msword'});if(up.error)throw up.error;
    let ok=0;const u=Z.rep.pri[Z.rep.pri.length-1];
    const txt=`Te comparto el análisis de resultados Saber 11 de ${Z.rep.titulo}, años ${Z.rep.anios.join(', ')}.\nPuntaje global ${Z.rep.ult}: ${f1(u.global)} / 500.\nEl informe completo va adjunto.`;
    for(const id of ids){const r=await sb.rpc('mensaje_enviar',{p_para:id,p_tipo:'documento',p_asunto:'Análisis Saber 11 · '+Z.rep.titulo,p_texto:txt,p_path:path,p_nombre:nombre});if(!r.error)ok++}
    document.getElementById('ana-env')?.remove();toast('📨','Enviado','Lo recibieron '+ok+' persona(s) en su bandeja de Mensajes.');
  }catch(x){if(b){b.disabled=false;b.textContent='Enviar'}err(x)}}
return{load,view,generar,vista,imprimir,descargar,enviar,enviarYa,cerrar,
  async dep(v){Z.dep=v;Z.mun='';Z.dane='';Z.cols=[];Z.mcpios=[];Z.rep=null;Z.msg='';if(v){try{Z.mcpios=await rpc('saber_mcpios',{p_depto:v})}catch(x){err(x)}}R()},
  async mun(v){Z.mun=v;Z.dane='';Z.cols=[];Z.rep=null;if(v){try{Z.cols=await rpc('saber_colegios',{p_depto:Z.dep,p_mcpio:v})}catch(x){err(x)}}R()},
  col(v){Z.dane=v;const c=Z.cols.find(x=>x.dane===v);Z.colNombre=c?c.nombre:'';Z.rep=null;R()},
  anio(a,on){const s=new Set(Z.sel);on?s.add(a):s.delete(a);Z.sel=[...s].sort();Z.rep=null;R()},
  ult(n){Z.sel=VENT.slice(-n).filter(a=>Z.anios.includes(a));Z.rep=null;if(!Z.sel.length)Z.msg='Para esos años el ICFES aún no ha publicado resultados en datos abiertos.';else Z.msg='';R()},quitar(){Z.sel=[];Z.rep=null;R()},
  _t:{informe,set:x=>{Z.rep=x;Z.html=informe(x)},html:()=>Z.html}}})();
