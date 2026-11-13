/* AULA360 — Pruebas Saber 11 REALES (rector / coordinador): sube los reportes individuales del ICFES (PDF o ZIP),
   la plataforma los lee, los guarda por año y hace el análisis institucional + plan de mejoramiento + proyección. */
window.ICF=(function(){
const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const AREAS=[['lc','Lectura Crítica','p_lc'],['mat','Matemáticas','p_mat'],['soc','Sociales y Ciudadanas','p_soc'],['cn','Ciencias Naturales','p_cn'],['ing','Inglés','p_ing']];
const NOMBRES={'Lectura Crítica':'lc','Matemáticas':'mat','Sociales y Ciudadanas':'soc','Ciencias Naturales':'cn','Inglés':'ing'};
// Rangos de los niveles de desempeño publicados por el ICFES (puntaje 0-100 por prueba)
const CORTES={lc:[35,50,65],mat:[35,50,70],soc:[40,55,70],cn:[40,55,70],ing:[47,57,67,78]};
const NIVN={lc:['1','2','3','4'],mat:['1','2','3','4'],soc:['1','2','3','4'],cn:['1','2','3','4'],ing:['A-','A1','A2','B1','B+']};
function nivel(k,p){if(p==null)return -1;const c=CORTES[k];let i=0;while(i<c.length&&p>c[i])i++;return i}
const nombreNivel=(k,i)=>i<0?'—':(k==='ing'?NIVN.ing[i]:'Nivel '+NIVN[k][i]);
let Z={regs:[],prev:null,busy:false,msg:'',datos:[],sel:[],anios:[],ult:null};
/* ---------- Lector de los reportes (PDF del ICFES) ---------- */
function parse(items){
  // items: textos del PDF en orden de lectura (uno por fragmento)
  const out=[],idx=[];items.forEach((t,i)=>{if(/^1\.\s*Datos del evaluado/i.test(t))idx.push(i)});
  idx.forEach((a,n)=>{
    const seg=items.slice(a,idx[n+1]||items.length),r={};
    const af=re=>{const i=seg.findIndex(t=>re.test(t.trim()));return i<0?'':(seg[i+1]||'').trim()};
    r.nombre=af(/^Nombre Completo/i);
    r.ident=af(/^Identificaci[oó]n/i);
    r.registro=af(/^N[uú]mero de registro/i);
    const fa=af(/^Aplicaci[oó]n del examen/i);
    if(/^\d{2}\/\d{2}\/\d{4}$/.test(fa)){const[d,m,y]=fa.split('/');r.aplicacion=y+'-'+m+'-'+d;r.anio=+y}
    r.municipio=af(/^Municipio/i);r.dane=af(/^C[oó]digo DANE/i);
    // puntaje global: el número justo antes de "/500"
    const i500=seg.findIndex(t=>/^\/\s*500$/.test(t.trim()));
    if(i500>0)r.global=parseInt(seg[i500-1],10);
    const txt=seg.join(' ');
    const mg=txt.match(/superó al\s*(\d{1,3})\s*%\s*de los\s*estudiantes\s*a nivel/i);if(mg)r.p_global=+mg[1];
    // pruebas
    const ini=seg.findIndex(t=>/Resultados por prueba/i.test(t));
    AREAS.forEach(([k,nm,pk])=>{
      const i=seg.findIndex((t,j)=>j>ini&&t.trim()===nm);if(i<0)return;
      let fin=seg.length;AREAS.forEach(([k2,n2])=>{const j=seg.findIndex((t,jj)=>jj>i&&t.trim()===n2);if(j>0&&j<fin)fin=j});
      const sub=seg.slice(i,fin),i100=sub.findIndex(t=>/^\/\s*100$/.test(t.trim()));
      if(i100>0)r[k]=parseInt(sub[i100-1],10);
      const iN=sub.findIndex(t=>/^Estudiantes a nivel nacional/i.test(t.trim()));
      for(let j=iN-1;j>=Math.max(0,iN-3);j--){if(/^\d{1,3}$/.test(sub[j].trim())){r[pk]=+sub[j];break}}
    });
    out.push(r)});
  return out}
function valido(r){return r.registro&&r.anio&&Number.isFinite(r.global)&&AREAS.some(([k])=>Number.isFinite(r[k]))}
async function textoPdf(buf){
  await loadScript(LIB.pdf);pdfjsLib.GlobalWorkerOptions.workerSrc=LIB.pdfw;
  const pdf=await pdfjsLib.getDocument({data:buf}).promise,items=[];
  for(let p=1;p<=pdf.numPages;p++){const pg=await pdf.getPage(p),tc=await pg.getTextContent();tc.items.forEach(i=>{if(i.str&&i.str.trim())items.push(i.str)})}
  return items}
async function leer(files){
  Z.busy=true;Z.msg='Leyendo archivos…';R();const regs=[],malos=[];
  try{
    for(const f of files){
      const pdfs=[];
      if(/\.zip$/i.test(f.name)){
        if(!window.JSZip)await loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
        const z=await JSZip.loadAsync(await f.arrayBuffer());
        for(const n of Object.keys(z.files)){if(/\.pdf$/i.test(n)&&!z.files[n].dir&&!/__MACOSX/.test(n))pdfs.push({name:n,get:()=>z.files[n].async('arraybuffer')})}
      }else if(/\.pdf$/i.test(f.name))pdfs.push({name:f.name,get:()=>f.arrayBuffer()});
      else malos.push(f.name+' (no es PDF ni ZIP)');
      for(const p of pdfs){
        try{const r=parse(await textoPdf(await p.get()));const ok=r.filter(valido);if(!ok.length)malos.push(p.name+' (no parece un reporte de resultados Saber 11)');regs.push(...ok);
          r.filter(x=>!valido(x)).forEach(()=>malos.push(p.name+' (un reporte incompleto)'))}
        catch(x){malos.push(p.name+' ('+(x.message||'no se pudo leer')+')')}
        Z.msg='Leyendo… '+regs.length+' estudiantes';R();await new Promise(r=>setTimeout(r,10))}
    }
  }catch(x){Z.busy=false;Z.msg='';R();return err(x)}
  const seen=new Set();Z.regs=regs.filter(r=>!seen.has(r.registro)&&seen.add(r.registro));Z.malos=malos;Z.busy=false;Z.msg='';R()}
async function guardar(){
  if(!Z.regs.length)return;Z.busy=true;R();
  try{let n=0;for(let i=0;i<Z.regs.length;i+=100){const r=await sb.rpc('icfes_guardar',{p_rows:Z.regs.slice(i,i+100)});if(r.error)throw r.error;n+=r.data}
    toast('✅','Resultados guardados',n+' estudiante(s).');Z.regs=[];Z.malos=[];await load()}catch(x){err(x)}
  Z.busy=false;R()}
async function load(){
  const r=await sb.from('icfes_resultados').select('*').order('anio');if(r.error)throw r.error;
  Z.datos=r.data||[];Z.anios=[...new Set(Z.datos.map(x=>x.anio))].sort();
  const lim=new Date().getFullYear()-10;Z.anios=Z.anios.filter(a=>a>=lim);
  if(!Z.sel.length||!Z.sel.every(a=>Z.anios.includes(a)))Z.sel=Z.anios.slice(-1)}
/* ---------- Estadística (igual que en los informes institucionales) ---------- */
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
const sd=a=>{if(a.length<2)return 0;const m=avg(a);return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1))};
const med=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y),m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2};
const r1=x=>x==null?'—':(Math.round(x*10)/10).toString().replace('.',',');
const r0=x=>x==null?'—':Math.round(x);
const col=(d,k)=>d.map(x=>x[k]).filter(v=>v!=null&&!isNaN(v));
function globalDe(m){let s=0,w=0;AREAS.forEach(([k])=>{if(m[k]!=null){const p=k==='ing'?1:3;s+=p*m[k];w+=p}});return w?Math.round(s/w*5):null}
function resumen(d){
  const o={n:d.length,g:col(d,'global')};
  o.areas={};AREAS.forEach(([k,nm,pk])=>{const v=col(d,k),pv=col(d,pk),nv=[0,0,0,0,0];v.forEach(x=>nv[nivel(k,x)]++);
    o.areas[k]={nm,prom:avg(v),sd:sd(v),med:med(v),min:v.length?Math.min(...v):null,max:v.length?Math.max(...v):null,perc:avg(pv),niv:nv,n:v.length,lvl:nivel(k,avg(v))}});
  return o}
function porAnio(){return Z.sel.map(a=>({anio:a,d:Z.datos.filter(x=>x.anio===a)}))}
/* ---------- Proyección ---------- */
function tendencia(ys,xs){const n=xs.length;if(n<2)return null;const mx=avg(xs),my=avg(ys);let a=0,b=0;xs.forEach((x,i)=>{a+=(x-mx)*(ys[i]-my);b+=(x-mx)**2});const m=b?a/b:0;return{m,b0:my-m*mx}}
/* ---------- Gráficas SVG ---------- */
function lineas(series,anios,tit,max){
  const W=640,H=230,L=40,B=30,T=20,pw=W-L-20,ph=H-B-T;
  const xs=i=>L+(anios.length===1?pw/2:pw*i/(anios.length-1)),ys=v=>T+ph*(1-v/max);
  const C=['#1e63e9','#16a34a','#f59e0b','#7c3aed','#dc2626','#0891b2'];
  return`<svg viewBox="0 0 ${W} ${H+(series.length>1?26:0)}" width="100%" style="max-width:640px;font:11px Arial,sans-serif"><text x="0" y="12" font-weight="700">${e(tit)}</text>`+
   [0,.25,.5,.75,1].map(f=>`<line x1="${L}" x2="${W-20}" y1="${ys(max*f)}" y2="${ys(max*f)}" stroke="#e2e8f0"/><text x="${L-5}" y="${ys(max*f)+4}" text-anchor="end" fill="#64748b">${Math.round(max*f)}</text>`).join('')+
   anios.map((a,i)=>`<text x="${xs(i)}" y="${H-10}" text-anchor="middle" fill="#334155">${a}</text>`).join('')+
   series.map((s,k)=>{const pts=s.v.map((v,i)=>v==null?null:[xs(i),ys(v)]);return`<polyline fill="none" stroke="${C[k%6]}" stroke-width="2.5" points="${pts.filter(Boolean).map(p=>p.join(',')).join(' ')}"/>`+pts.map((p,i)=>p?`<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${C[k%6]}"/><text x="${p[0]}" y="${p[1]-7}" text-anchor="middle" font-weight="700" fill="${C[k%6]}">${Math.round(s.v[i])}</text>`:'').join('')}).join('')+
   (series.length>1?`<g transform="translate(${L},${H+8})">${series.map((s,k)=>`<rect x="${k*118}" y="-8" width="9" height="9" fill="${C[k%6]}"/><text x="${k*118+13}" y="0" font-size="10" fill="#475569">${e(s.l)}</text>`).join('')}</g>`:'')+`</svg>`}
function nivelesSvg(res){
  const C=['#dc2626','#f59e0b','#2563eb','#16a34a','#0f766e'];
  const rows=AREAS.map(([k,nm])=>({nm,k,n:res.areas[k].niv.slice(0,k==='ing'?5:4)}));
  return`<svg viewBox="0 0 640 ${rows.length*30+50}" width="100%" style="max-width:640px;font:11px Arial,sans-serif"><text x="0" y="12" font-weight="700">Estudiantes por nivel de desempeño en cada prueba</text>${rows.map((c,i)=>{const y=24+i*30;let x=170;const tt=c.n.reduce((a,b)=>a+b,0)||1;return`<text x="0" y="${y+12}" fill="#334155">${e(c.nm)}</text>`+c.n.map((k,j)=>{const w=440*k/tt;const r=`<rect x="${x}" y="${y}" width="${w}" height="16" fill="${C[j]}"/>${w>14?`<text x="${x+w/2}" y="${y+12}" fill="#fff" text-anchor="middle" font-weight="700">${Math.round(100*k/tt)}%</text>`:''}`;x+=w;return r}).join('')}).join('')}<text x="170" y="${rows.length*30+40}" font-size="10" fill="#475569">Rojo = nivel más bajo (1 / A-) · verde = nivel más alto (4 / B+). Inglés usa A-, A1, A2, B1 y B+.</text></svg>`}
/* ---------- Informe ---------- */
function informe(){
  const U=INF._u,Lh=(typeof LH==='function')?LH():{l1:''},ys=porAnio().filter(x=>x.d.length);
  if(!ys.length)return'<p>No hay resultados guardados para los años elegidos.</p>';
  const ult=ys[ys.length-1],R_=resumen(ult.d),aniosTxt=ys.map(x=>x.anio).join(', ');
  const gm=avg(R_.g),gs=sd(R_.g),gmed=med(R_.g);
  const rangos=[[0,200],[201,250],[251,300],[301,350],[351,400],[401,500]].map(([a,b])=>({l:a+'–'+b,v:R_.g.length?Math.round(100*R_.g.filter(x=>x>=a&&x<=b).length/R_.g.length):0}));
  const pg=avg(col(ult.d,'p_global'));
  const filas=AREAS.map(([k])=>R_.areas[k]);
  const rank=[...filas].filter(a=>a.prom!=null).sort((a,b)=>a.prom-b.prom);
  const pri=rank.filter(a=>a.lvl<=1||a.prom<55).slice(0,3).length?rank.filter(a=>a.lvl<=1||a.prom<55):rank.slice(0,2);
  const top=[...ult.d].sort((a,b)=>b.global-a.global).slice(0,10);
  const riesgo=ult.d.filter(x=>AREAS.filter(([k])=>x[k]!=null&&nivel(k,x[k])===0).length>=2);
  // proyección
  let proy='';
  const anios=ys.map(x=>x.anio),sig=anios[anios.length-1]+1;
  const mediasY=ys.map(x=>avg(col(x.d,'global')));
  const tg=tendencia(mediasY,anios);
  const base=Object.fromEntries(AREAS.map(([k])=>[k,R_.areas[k].prom]));
  const esc=[0,3,5,8].map(inc=>{const m={};AREAS.forEach(([k])=>m[k]=base[k]==null?null:Math.min(100,base[k]+inc));return{inc,g:globalDe(m)}});
  proy=`<h3>5. Proyección para ${sig}</h3>${ys.length>=2?lineas([{l:'Puntaje global',v:[...mediasY,tg?Math.max(0,Math.min(500,tg.m*sig+tg.b0)):null]}],[...anios,sig+' (proy.)'],'Puntaje global promedio: histórico y proyección',500):''}
  <table><tr><th>Escenario para ${sig}</th><th>Supuesto</th><th>Global estimado (0-500)</th></tr>
  ${tg&&ys.length>=2?`<tr><td><b>Tendencia histórica</b></td><td>Continúa el ritmo de cambio de ${ys.length} años (${r1(tg.m)} puntos por año)</td><td><b>${r0(Math.max(0,Math.min(500,tg.m*sig+tg.b0)))}</b></td></tr>`:''}
  ${esc.map(s=>`<tr><td>${s.inc===0?'<b>Sin cambios</b>':'<b>Mejora de +'+s.inc+' puntos por prueba</b>'}</td><td>${s.inc===0?'Los resultados se mantienen como en '+ult.anio:'Cada prueba sube '+s.inc+' puntos sobre el promedio de '+ult.anio+' (plan de mejoramiento)'}</td><td><b>${s.g==null?'—':s.g}</b></td></tr>`).join('')}</table>
  <p style="font-size:9pt;color:#64748b">${ys.length<3?'Con menos de 3 años de datos la proyección por tendencia es solo orientativa; los escenarios muestran el efecto de las metas del plan. ':''}El puntaje global se calcula como el ICFES: promedio ponderado (Inglés ×1, las demás pruebas ×3) multiplicado por 5. Son estimaciones, no resultados oficiales.</p>`;
  const cabecera=`${U.enc('Análisis de resultados Saber 11 · '+aniosTxt,(Lh.l1||'')+' · Emitido '+new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'}))}`;
  const sec1=`<div class="inf pg">${cabecera}
  <div class="k"><div><b>${R_.n}</b>Estudiantes (${ult.anio})</div><div><b>${r0(gm)}</b>Puntaje global promedio</div><div><b>${r0(gmed)}</b>Mediana</div><div><b>${r1(gs)}</b>Desviación estándar</div></div>
  <div class="k"><div><b>${r0(Math.min(...R_.g))}</b>Puntaje global más bajo</div><div><b>${r0(Math.max(...R_.g))}</b>Puntaje global más alto</div><div><b>${r0(pg)}</b>Percentil nacional promedio</div></div>
  <h3>1. Ficha técnica</h3><table><tr><td><b>Institución</b></td><td>${e(Lh.l1||'')}</td><td><b>Años analizados</b></td><td>${e(aniosTxt)}</td></tr><tr><td><b>Fuente</b></td><td colspan="3">Reportes individuales de resultados del examen Saber 11 (ICFES), cargados por el colegio. ${ys.map(x=>x.anio+': '+x.d.length+' estudiantes').join(' · ')}.</td></tr></table>
  <h3>2. Resultado global (${ult.anio})</h3>${U.barras(rangos,'Porcentaje de estudiantes por rango de puntaje global')}
  <p style="font-size:10pt">El puntaje global promedio es <b>${r0(gm)}</b> sobre 500 y en promedio los estudiantes superaron al <b>${r0(pg)} %</b> de los evaluados del país (percentil nacional).</p>
  <h3>3. Resultados por prueba (${ult.anio})</h3>
  <table><tr><th>Prueba</th><th>Promedio</th><th>Desv.</th><th>Mín.</th><th>Máx.</th><th>Percentil nac.</th><th>Nivel del promedio</th></tr>${filas.map(a=>`<tr><td>${e(a.nm)}</td><td><b>${r1(a.prom)}</b></td><td>${r1(a.sd)}</td><td>${r0(a.min)}</td><td>${r0(a.max)}</td><td>${r0(a.perc)}</td><td>${e(nombreNivel(NOMBRES[a.nm],a.lvl))}</td></tr>`).join('')}</table>
  ${U.barras(filas.map(a=>({l:a.nm,v:a.prom==null?null:Math.round(a.prom)})),'Puntaje promedio por prueba (0-100)',false,'')}${nivelesSvg(R_)}
  <p style="font-size:9pt;color:#64748b">Los niveles se calculan con los rangos de puntaje que el ICFES publica para cada prueba.</p></div>`;
  const sec4=ys.length>=2?`<div class="inf pg">${cabecera}<h3>4. Comparativo entre años</h3>
   <table><tr><th>Año</th><th>Estudiantes</th><th>Global</th>${AREAS.map(([k,nm])=>`<th>${e(nm.split(' ')[0])}</th>`).join('')}</tr>${ys.map(y=>{const rs=resumen(y.d);return`<tr><td><b>${y.anio}</b></td><td>${rs.n}</td><td><b>${r0(avg(rs.g))}</b></td>${AREAS.map(([k])=>`<td>${r1(rs.areas[k].prom)}</td>`).join('')}</tr>`}).join('')}</table>
   ${lineas([{l:'Global (0-500)',v:mediasY}],anios,'Evolución del puntaje global promedio',500)}
   ${lineas(AREAS.map(([k,nm])=>({l:nm.split(' ')[0],v:ys.map(y=>avg(col(y.d,k)))})),anios,'Evolución del promedio por prueba (0-100)',100)}
   ${(()=>{const a=ys[0],b=ys[ys.length-1];return`<p style="font-size:10pt">Entre ${a.anio} y ${b.anio} el puntaje global promedio ${avg(col(b.d,'global'))>=avg(col(a.d,'global'))?'subió':'bajó'} <b>${r1(Math.abs(avg(col(b.d,'global'))-avg(col(a.d,'global'))))}</b> puntos.</p>`})()}</div>`:'';
  const sec6=`<div class="inf pg">${cabecera}${proy}
  <h3>6. Estudiantes destacados y en riesgo (${ult.anio})</h3>
  <table><tr><th>#</th><th>Mejores puntajes globales</th><th>Global</th></tr>${top.map((x,i)=>`<tr><td>${i+1}</td><td>${e(x.nombre)}</td><td><b>${x.global}</b></td></tr>`).join('')}</table>
  <p style="font-size:10pt"><b>En riesgo:</b> ${riesgo.length} estudiante(s) con nivel más bajo en dos o más pruebas${riesgo.length?': '+riesgo.slice(0,25).map(x=>e(x.nombre)).join(', ')+(riesgo.length>25?'…':''):'.'}</p></div>`;
  const meta=a=>Math.min(100,Math.round(a.prom+(a.lvl<=1?10:6)));
  const plan=`<div class="inf pg">${cabecera}<h3>7. Plan de mejoramiento institucional ${sig}</h3>
  <p style="font-size:10pt">Objetivo general: aumentar el puntaje global promedio de <b>${r0(gm)}</b> a <b>${esc[2].g==null?'—':esc[2].g}</b> en ${sig}, priorizando las pruebas con menor desempeño y reduciendo el número de estudiantes en el nivel más bajo.</p>
  <table><tr><th>Prueba prioritaria</th><th>Situación ${ult.anio}</th><th>Meta ${sig}</th><th>Estrategias</th><th>Responsables</th></tr>${pri.map(a=>`<tr><td><b>${e(a.nm)}</b></td><td>Promedio ${r1(a.prom)} · ${Math.round(100*a.niv[0]/(a.n||1))}% en nivel más bajo</td><td>Promedio ${meta(a)} · reducir a la mitad el nivel más bajo</td><td><ul>${U.acc(a.nm).slice(0,3).map(t=>`<li>${e(t)}</li>`).join('')}<li>${e(U.DOCE[a.nm]||'')}</li></ul></td><td>Docentes de ${e(a.nm)} y coordinación académica</td></tr>`).join('')}</table>
  <h3>Estrategias transversales</h3><ul><li>Aplicar simulacros y diagnósticos periódicos en AULA360 y generar los informes y planes individuales y grupales después de cada aplicación.</li><li>Socializar este análisis con todos los docentes y con las familias; definir compromisos por área.</li><li>Alinear planes de área y planeadores con las competencias evaluadas (lectura crítica, razonamiento cuantitativo, competencias ciudadanas, indagación, inglés).</li><li>Acompañamiento especial a los ${riesgo.length} estudiante(s) en riesgo.</li></ul>
  <h3>Cronograma anual</h3><table><tr><th>Periodo</th><th>Acción</th><th>Responsable</th><th>Indicador</th></tr>
  <tr><td>Enero–febrero</td><td>Socialización de resultados y ajuste de planes de área</td><td>Rector / Coordinación</td><td>Acta y planes ajustados</td></tr>
  <tr><td>Marzo</td><td>Diagnóstico inicial en grado 11 (y 10)</td><td>Docentes de área</td><td>Informe grupal por curso</td></tr>
  <tr><td>Abril–mayo</td><td>Talleres de refuerzo y simulacro 1</td><td>Docentes de área</td><td>+3 puntos promedio por prueba</td></tr>
  <tr><td>Junio–julio</td><td>Simulacro 2 y plan individual a estudiantes en riesgo</td><td>Coordinación</td><td>Estudiantes en riesgo −25 %</td></tr>
  <tr><td>Agosto</td><td>Simulacro 3 (formato real) y ajuste del plan</td><td>Consejo académico</td><td>+5 puntos promedio por prueba</td></tr>
  <tr><td>Septiembre</td><td>Examen Saber 11 · acompañamiento y orientación</td><td>Rector</td><td>Asistencia del 100 %</td></tr>
  <tr><td>Noviembre</td><td>Análisis de resultados oficiales y balance del plan</td><td>Rector / Consejo académico</td><td>Comparación con la meta ${sig}</td></tr></table>
  <div class="f"><div>Rector(a)</div><div>Coordinador(a) académico(a)</div><div>Consejo académico</div></div></div>`;
  return sec1+sec4+sec6+plan}
/* ---------- Acciones ---------- */
async function prep(){if(!window.INF)await loadScript('informes.js?v=2')}
async function vista(){await prep();if(!Z.sel.length)return toast('⚠️','Elige al menos un año','');
  const h=informe();Z.ult={html:h,tipo:'ICF',tit:'Análisis Saber 11 · '+Z.sel.join(', ')};INF._u.vista(h,Z.ult.tit,'ICF');INF._u.setUlt(Z.ult)}
async function imprimir(){await prep();const h=informe();doPrint(INF._u.CSS+h,{tipo:'ICF',titulo:'Análisis Saber 11 '+Z.sel.join(', '),hoja:true})}
async function enviar(){
  const ys=porAnio().filter(x=>x.d.length);if(!ys.length)return;
  const ult=ys[ys.length-1],R_=resumen(ult.d);
  const d=await sb.rpc('directorio_colegio');if(d.error)return err(d.error);
  const docs=(d.data||[]).filter(p=>p.role==='prof');if(!docs.length)return toast('⚠️','No hay docentes','Aún no hay docentes aprobados en tu colegio.');
  if(!confirm('¿Enviar un resumen del análisis Saber 11 '+ult.anio+' a '+docs.length+' docente(s)?'))return;
  const pri=AREAS.map(([k,nm])=>({nm,p:R_.areas[k].prom})).filter(x=>x.p!=null).sort((a,b)=>a.p-b.p).slice(0,2);
  const txt=`Análisis de resultados Saber 11 · ${ult.anio}\n\nEstudiantes evaluados: ${R_.n}\nPuntaje global promedio: ${r0(avg(R_.g))} / 500\n\nPromedio por prueba:\n${AREAS.map(([k,nm])=>'• '+nm+': '+r1(R_.areas[k].prom)).join('\n')}\n\nPruebas prioritarias para el plan de mejoramiento: ${pri.map(x=>x.nm).join(' y ')}.\n\nEl análisis completo y el plan de mejoramiento los presenta la rectoría; revisa tu planeación para fortalecer estas competencias.`;
  let ok=0;for(const p of docs){const r=await sb.rpc('mensaje_enviar',{p_para:p.id,p_tipo:'nota',p_asunto:'Análisis Saber 11 · '+ult.anio,p_texto:txt});if(!r.error)ok++}
  toast('📨','Enviado','Resumen enviado a '+ok+' docente(s). Lo verán en Mensajes.')}
async function borrarAnio(a){if(!confirm('¿Borrar TODOS los resultados guardados del año '+a+'? No se puede deshacer.'))return;
  const r=await sb.rpc('icfes_borrar_anio',{p_anio:a});if(r.error)return err(r.error);toast('🗑','Borrado',r.data+' registro(s).');await load();R()}
const R=()=>render();
/* ---------- Pantalla ---------- */
function view(){
  const hay=Z.datos.length;
  return`<div style="display:grid;gap:14px">
  <div class="aic-card" style="padding:18px"><h2 style="font-weight:800;font-size:19px">📈 Pruebas Saber 11 reales (ICFES)</h2>
   <p style="font-size:13px;color:#64748b;margin:4px 0 12px">1) Sube los reportes de resultados que descargas del ICFES: varios PDF, un solo PDF con todos los estudiantes, o un ZIP con los PDF. 2) Revisa lo que leyó la plataforma. 3) Guarda. Puedes subir años anteriores (hasta 10 años atrás) para ver la evolución.</p>
   <input id="icf_files" type="file" multiple accept=".pdf,.zip,application/pdf,application/zip" style="font-size:13px" onchange="ICF.leer(this.files)">
   ${Z.msg?`<p style="margin-top:8px;font-size:13px">⏳ ${e(Z.msg)}</p>`:''}
   ${Z.malos&&Z.malos.length?`<div style="margin-top:8px;font-size:12px;color:#b45309">⚠️ No se pudieron leer: ${Z.malos.slice(0,8).map(e).join('; ')}${Z.malos.length>8?'…':''}</div>`:''}
   ${Z.regs.length?`<div style="margin-top:12px"><b>${Z.regs.length} estudiante(s) leídos</b> · años: ${[...new Set(Z.regs.map(r=>r.anio))].join(', ')}
    <div class="aic-table-wrap" style="margin-top:6px;max-height:260px;overflow:auto"><table style="min-width:640px"><thead><tr><th>ESTUDIANTE</th><th>AÑO</th><th>GLOBAL</th><th>LC</th><th>MAT</th><th>SOC</th><th>CN</th><th>ING</th></tr></thead><tbody>${Z.regs.slice(0,60).map(r=>`<tr><td>${e(r.nombre)}</td><td>${r.anio}</td><td><b>${r.global}</b></td><td>${r.lc??'—'}</td><td>${r.mat??'—'}</td><td>${r.soc??'—'}</td><td>${r.cn??'—'}</td><td>${r.ing??'—'}</td></tr>`).join('')}</tbody></table></div>
    <button onclick="ICF.guardar()" ${Z.busy?'disabled':''} style="margin-top:10px;background:#16a34a;color:#fff;padding:10px 16px;border-radius:10px;font-weight:800">💾 Guardar estos resultados</button></div>`:''}</div>
  ${hay?`<div class="aic-card" style="padding:18px"><h3 style="font-weight:800;font-size:17px">Análisis y plan de mejoramiento</h3>
   <p style="font-size:13px;color:#64748b;margin:4px 0 8px">Elige los años del informe (puedes marcar varios para ver la evolución y la proyección).</p>
   <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">${Z.anios.map(a=>`<label style="border:1.5px solid #cbd5e1;border-radius:10px;padding:8px 12px;font-size:14px;cursor:pointer;${Z.sel.includes(a)?'background:#e8f1ff;border-color:#1e63e9;font-weight:800':''}"><input type="checkbox" ${Z.sel.includes(a)?'checked':''} onchange="ICF.anio(${a},this.checked)"> ${a} <span style="font-size:11px;color:#64748b">(${Z.datos.filter(x=>x.anio===a).length})</span> <button class="aic-link" onclick="event.preventDefault();ICF.borrarAnio(${a})" title="Borrar este año">🗑</button></label>`).join('')}
    <button class="aic-link" onclick="ICF.rango(${Z.anios.length})">Marcar todos</button></div>
   <div style="display:flex;flex-wrap:wrap;gap:8px"><button onclick="ICF.vista()" style="background:#1e63e9;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">📊 Hacer análisis y plan de mejoramiento completos</button><button onclick="ICF.vista()" style="background:#e2e8f0;padding:11px 16px;border-radius:10px;font-weight:700">👁 Vista previa</button><button onclick="ICF.imprimir()" style="background:#f59e0b;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">🖨️ Imprimir</button><button onclick="ICF.enviar()" style="background:#7c3aed;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">📨 Enviar a docentes</button></div>
   <p style="font-size:12px;color:#64748b;margin-top:8px">El informe incluye: resultados globales y por prueba, niveles de desempeño, comparación entre años, proyección del año siguiente y plan de mejoramiento con cronograma.</p></div>`:`<div class="aic-card" style="padding:18px;font-size:14px;color:#64748b">Todavía no hay resultados guardados. Sube los PDF del ICFES para empezar.</div>`}</div>`}
const api={load,view,leer,guardar,vista,imprimir,enviar,borrarAnio,
  anio(a,on){const s=new Set(Z.sel);on?s.add(a):s.delete(a);Z.sel=[...s].sort();R()},
  rango(){Z.sel=[...Z.anios];R()},
  _t:{parse,nivel,informe:()=>informe(),set:d=>{Z.datos=d;Z.anios=[...new Set(d.map(x=>x.anio))].sort();Z.sel=Z.anios.slice()}}};
return api})();
