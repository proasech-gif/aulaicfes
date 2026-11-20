/* AULA360 — Motor del informe Saber 11 (estadística + redacción + diseño A4).
   Funciones puras: reciben los datos que ya carga analisis.js y devuelven un documento HTML.
   No toca la base de datos ni la carga de resultados. Se puede probar en Node. */
(function(root){
'use strict';
const AREAS=[['lec','Lectura Crítica'],['mat','Matemáticas'],['soc','Sociales y Ciudadanas'],['nat','Ciencias Naturales'],['ing','Inglés']];
const ROL={lec:'Jefe del área de Lenguaje',mat:'Jefe del área de Matemáticas',soc:'Jefe del área de Ciencias Sociales',nat:'Jefe del área de Ciencias Naturales',ing:'Jefe del área de Idiomas'};
const SECC=[['resumen','Resumen ejecutivo'],['ficha','Ficha técnica y metodología'],['evolucion','Evolución histórica'],['territorial','Comparación territorial'],['areas','Análisis por áreas'],['diagnostico','Diagnóstico y prioridades'],['proyeccion','Proyección con escenarios'],['pmi','Plan de Mejoramiento Institucional'],['conclusiones','Conclusiones y recomendaciones'],['anexos','Anexos']];
const C={navy:'#0b2a5b',blue:'#2563eb',teal:'#0d9488',amber:'#d97706',red:'#b91c1c',ink:'#1e293b',mut:'#64748b',line:'#e2e8f0',soft:'#f1f5f9',gray:'#475569'};
const T95={1:12.71,2:4.30,3:3.18,4:2.78,5:2.57,6:2.45,7:2.36,8:2.31,9:2.26,10:2.23};
const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const critTxt=r=>{const c=r&&r.crit||{},t=[];if(c.sector)t.push(c.sector==='OFICIAL'?'sector oficial':'sector privado');if(c.zona)t.push('zona '+c.zona.toLowerCase());return t.length?' ('+t.join(', ')+')':''};
const num=(x,d)=>{if(x==null||isNaN(x))return'—';const s=(Math.round(x*Math.pow(10,d))/Math.pow(10,d)).toFixed(d);const [i,f]=s.split('.');return i.replace(/\B(?=(\d{3})+(?!\d))/g,'.')+(f?','+f:'')};
const f1=x=>num(x,1),f0=x=>num(x,0),f2=x=>num(x,2);
const sg=(x,d)=>x==null||isNaN(x)?'—':(Math.abs(x)<0.05&&(d==null||d===1)?'0,0':(x>0?'+':'−')+num(Math.abs(x),d==null?1:d));
const clean=s=>String(s||'').replace(/\s*-\s*SEDE PRINCIPAL\s*$/i,'').replace(/\s+/g,' ').trim();
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/[^A-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const by=(arr,y)=>(arr||[]).find(x=>x.anio===y)||{};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const r1=x=>Math.round(x*10)/10;

/* ============ 1. MOTOR ESTADÍSTICO ============ */
function ols(pts){
  const n=pts.length;if(n<2)return null;
  const mx=pts.reduce((s,p)=>s+p[0],0)/n,my=pts.reduce((s,p)=>s+p[1],0)/n;
  let sxx=0,sxy=0,syy=0;pts.forEach(p=>{sxx+=(p[0]-mx)*(p[0]-mx);sxy+=(p[0]-mx)*(p[1]-my);syy+=(p[1]-my)*(p[1]-my)});
  if(!sxx)return null;const b=sxy/sxx,a=my-b*mx;
  let sse=0;pts.forEach(p=>{const q=p[1]-(a+b*p[0]);sse+=q*q});
  return{n,mx,my,sxx,b,a,se:n>2?Math.sqrt(sse/(n-2)):null,r2:syy>0?1-sse/syy:null};
}
function pred(m,x,lim){
  const v=m.a+m.b*x;if(m.se==null)return{v,lo:null,hi:null};
  const t=T95[Math.max(1,Math.min(10,m.n-2))]||2.2,h=t*m.se*Math.sqrt(1+1/m.n+Math.pow(x-m.mx,2)/m.sxx);
  return{v:clamp(v,0,lim),lo:clamp(v-h,0,lim),hi:clamp(v+h,0,lim),h};
}
/* tendencia de una serie [[año,valor]] — cambio acumulado, puntos por año real y recta OLS */
function tendencia(pts,umbral){
  pts=pts.filter(p=>p[1]!=null);
  if(pts.length<2)return{n:pts.length,ok:false};
  const a=pts[0],z=pts[pts.length-1],span=z[0]-a[0],cum=z[1]-a[1],porAnio=span?cum/span:null;
  const m=pts.length>=4?ols(pts):null;
  const uso=m?m.b:porAnio;
  const dir=uso>umbral?'mejora':uso<-umbral?'descenso':'estable';
  return{n:pts.length,ok:true,desde:a[0],hasta:z[0],span,cum,porAnio,m,pendiente:uso,metodo:m?'recta de tendencia (mínimos cuadrados, años reales)':'cambio acumulado ÷ años transcurridos',dir,r2:m?m.r2:null};
}
/* regla de prioridad transparente: brecha relativa contra el país + tendencia */
function prioridad(gapRel,dir,n){
  if(gapRel==null)return{p:'Sin dato',o:9};
  if(gapRel<=-10)return dir==='descenso'?{p:'Crítica',o:0}:{p:'Alta',o:1};
  if(gapRel<=-5)return dir==='descenso'?{p:'Alta',o:1}:{p:'Media',o:2};
  if(gapRel<-2)return dir==='descenso'?{p:'Media',o:2}:{p:'Media',o:2};
  return{p:'Seguimiento',o:3};
}
const PCOL={'Crítica':C.red,'Alta':C.amber,'Media':C.blue,'Seguimiento':C.teal,'Sin dato':C.mut};

function analizar(r,o){
  o=o||{};
  const an=r.anios.slice(),ult=r.ult,pri=r.pri;
  const u=by(pri,ult),p=by(r.pais,ult),d=by(r.dep,ult),m=by(r.mun,ult),colego=r.nivel==='colegio';
  const A={r,an,ult,u,p,d,m,colego,nombre:clean(r.titulo),adv:[],emit:o.emit||''};
  A.faltan=[];for(let y=an[0];y<=ult;y++)if(!an.includes(y))A.faltan.push(y);
  // muestra
  A.nUlt=u.n;A.muestra=u.n==null?'sin dato':u.n<10?'insuficiente':u.n<30?'pequeña':'adecuada';
  if(A.muestra==='insuficiente')A.adv.push('En '+ult+' solo hubo '+u.n+' estudiantes evaluados: con menos de 10 evaluados las cifras son apenas indicativas y no deben usarse para decisiones.');
  else if(A.muestra==='pequeña')A.adv.push('En '+ult+' hubo '+u.n+' estudiantes evaluados (menos de 30): los promedios varían mucho de un año a otro por azar; interprete las tendencias con cautela.');
  const chicos=pri.filter(x=>x.n!=null&&x.n<10).map(x=>x.anio);if(chicos.length&&A.muestra!=='insuficiente')A.adv.push('Los años '+chicos.join(', ')+' tienen menos de 10 evaluados y su resultado es solo indicativo.');
  const pm=r.manuales||[],pp=(r.propios||[]).filter(a=>!pm.includes(a));
  if(pp.length)A.adv.push('Los años '+pp.join(', ')+' salen de los resultados individuales cargados por la propia institución: el ICFES aún no publica los agregados oficiales, por eso no tienen comparativo con municipio, departamento ni país ni puesto en el ranking.');
  if(pm.length)A.adv.push('Los años '+pm.join(', ')+' fueron subidos manualmente. Cuando la plataforma suba los resultados desde las páginas oficiales, este informe se actualizará; mientras tanto no tienen comparativo con municipio, departamento ni país ni puesto en el ranking.');
  if(A.faltan.length)A.adv.push('No hay resultados publicados para '+A.faltan.join(', ')+'; el cálculo de variaciones usa los años reales entre observaciones, no años consecutivos.');
  // global
  const gp=pri.map(x=>[x.anio,x.global]).filter(x=>x[1]!=null);
  A.gp=gp;A.tg=tendencia(gp,1.5);
  A.gap={p:u.global!=null&&p.global!=null?r1(u.global-p.global):null,d:u.global!=null&&d.global!=null?r1(u.global-d.global):null,m:u.global!=null&&m.global!=null?r1(u.global-m.global):null};
  A.gapRel=A.gap.p!=null?A.gap.p/p.global*100:null;
  // mayor caída / mejor año / cambios año a año
  A.yoy=[];for(let i=1;i<gp.length;i++)A.yoy.push({de:gp[i-1][0],a:gp[i][0],d:r1(gp[i][1]-gp[i-1][1]),pa:(gp[i][1]-gp[i-1][1])/(gp[i][0]-gp[i-1][0])});
  A.peor=A.yoy.length?A.yoy.reduce((a,b)=>b.d<a.d?b:a):null;A.mejor=A.yoy.length?A.yoy.reduce((a,b)=>b.d>a.d?b:a):null;
  A.pico=gp.length?gp.reduce((a,b)=>b[1]>a[1]?b:a):null;
  // brechas históricas contra cada referencia
  const brecha=(ref,y)=>{const a=by(pri,y).global,b=by(ref,y).global;return a==null||b==null?null:r1(a-b)};
  A.brechaIni={p:brecha(r.pais,an[0]),d:brecha(r.dep,an[0]),m:brecha(r.mun,an[0])};
  A.deltaRef={p:cambio(r.pais),d:cambio(r.dep),m:cambio(r.mun)};
  function cambio(ref){const s=(ref||[]).filter(x=>x.global!=null&&an.includes(x.anio));return s.length>1?r1(s[s.length-1].global-s[0].global):null}
  // áreas
  A.areas=AREAS.map(([k,nm])=>{
    const v=u[k];if(v==null)return null;
    const pts=pri.map(x=>[x.anio,x[k]]),t=tendencia(pts,0.3);
    const gp_=r1(v-p[k]),gd=d[k]!=null?r1(v-d[k]):null,gm=m[k]!=null?r1(v-m[k]):null,rel=p[k]?gp_/p[k]*100:null;
    const pr=prioridad(rel,t.dir,u.n);
    return{k,nm,v,p:p[k],d:d[k],m:m[k],gp:gp_,gd,gm,rel,t,pr:pr.p,ord:pr.o,pts,first:(t.ok?pts.find(x=>x[1]!=null)[1]:null)};
  }).filter(Boolean);
  A.orden=A.areas.slice().sort((a,b)=>a.ord-b.ord||a.rel-b.rel);
  A.relativa=A.areas.length?A.areas.slice().sort((a,b)=>b.rel-a.rel)[0]:null; // fortaleza relativa interna
  A.menor=A.areas.length?A.areas.slice().sort((a,b)=>a.rel-b.rel)[0]:null;
  A.nCrit=A.areas.filter(a=>a.pr==='Crítica').length;
  // proyecciones (global)
  const hs=(o.horizontes&&o.horizontes.length?o.horizontes:[1,3]);
  A.hor=hs;A.proy=null;
  const base=u.global;
  const metaAnual=A.gap.p==null?2:(A.gap.p<0?clamp(0.15*Math.abs(A.gap.p),2,8):2);
  A.metaAnual=metaAnual;
  A.proy={ok:!!A.tg.m,esc:hs.map(h=>{
    const y=ult+h;let tend=null;
    if(A.tg.m){tend=pred(A.tg.m,y,500)}
    const mej=base==null?null:clamp(base+(h===1?metaAnual:Math.max(metaAnual*h*0.8,Math.min(0.4*Math.abs(A.gap.p||0),25))),0,500);
    return{h,y,sin:base,tend,mej};
  })};
  // ranking limpio
  
  const rk=(r.rank||[]).filter(x=>x.g!=null&&x.n>=5).slice().sort((a,b)=>b.g-a.g);
  A.rank=rk;
  if(colego){const i=rk.findIndex(x=>x.dane===r.dane);A.posD=i>=0?{i:i+1,n:rk.length}:null;
    const mun=norm(r.ficha&&r.ficha.mcpio||'');const rm=rk.filter(x=>norm(x.mcpio)===mun);A.rankMun=rm;
    const j=rm.findIndex(x=>x.dane===r.dane);A.posM=j>=0?{i:j+1,n:rm.length}:null;}
  A.rankExcl=(r.rank||[]).length-rk.length;
  return A;
}

/* Plan de mejoramiento: metas por área según la brecha */
function metaArea(a,h){
  const gapAbs=Math.abs(Math.min(a.gp,0));
  const un=clamp(0.2*gapAbs,1,3);
  const inc=h===1?un:Math.max(un*h*0.9,0.4*gapAbs);
  return r1(Math.min(100,a.v+(a.gp<0?inc:1)));
}

/* ============ 2. REDACCIÓN (reglas sobre los números) ============ */
const dirTxt=t=>t.dir==='mejora'?'tendencia al alza':t.dir==='descenso'?'tendencia a la baja':'tendencia estable';
function textoComparacion(A){
  const par=(x,ref,lab)=>x==null?'':x>0?`${f1(x)} puntos por encima ${lab}`:x<0?`${f1(-x)} puntos por debajo ${lab}`:`igual ${lab}`;
  const parts=[par(A.gap.p,A.p.global,'del promedio nacional ('+f1(A.p.global)+')')];
  if(A.gap.d!=null)parts.push(par(A.gap.d,0,'del departamental ('+f1(A.d.global)+')'));
  if(A.colego&&A.gap.m!=null)parts.push(par(A.gap.m,0,'del municipal ('+f1(A.m.global)+')'));
  return parts.filter(Boolean).join('; ');
}
function hallazgos(A){
  const h=[],t=A.tg,u=A.u;
  h.push(`En ${A.ult} el puntaje global fue de <b>${f1(u.global)}</b> sobre 500 (${f0(u.n)} evaluados): ${textoComparacion(A)}. Equivale a ${f1(Math.abs(A.gapRel))}% ${A.gapRel<0?'menos':'más'} que el país.`);
  if(t.ok)h.push(`Entre ${t.desde} y ${t.hasta} el puntaje ${t.cum>=0?'subió':'bajó'} <b>${f1(Math.abs(t.cum))} puntos en total</b> (${sg(t.porAnio,2)} puntos por año en ${t.span} años${A.faltan.length?', contando los años reales sin dato':''}). ${t.m?`La recta de tendencia calculada con los años reales indica ${sg(t.m.b,2)} puntos por año (${dirTxt(t)}).`:'Con menos de 4 observaciones no se calcula una recta de tendencia.'}`);
  if(A.deltaRef.p!=null&&t.ok)h.push(`En el mismo periodo el promedio nacional cambió ${sg(A.deltaRef.p)} puntos${A.deltaRef.d!=null?' y el departamental '+sg(A.deltaRef.d):''}. La brecha con el país pasó de ${sg(A.brechaIni.p)} (${A.an[0]}) a ${sg(A.gap.p)} (${A.ult}).`);
  if(A.peor&&A.peor.d<-3)h.push(`La mayor caída entre observaciones fue de ${f1(-A.peor.d)} puntos (${A.peor.de}→${A.peor.a}); el mejor punto del periodo fue ${A.pico[0]} con ${f1(A.pico[1])}.`);
  if(A.menor)h.push(`Por áreas, la mayor distancia relativa con el país está en <b>${e(A.menor.nm)}</b> (${sg(A.menor.rel,0)}%) y la menor en <b>${e(A.relativa.nm)}</b> (${sg(A.relativa.rel,0)}%): es una fortaleza solo relativa dentro de la institución, no frente al país.`);
  return h;
}
function lecturaArea(a,A){
  const tr=a.t.ok?`${a.t.cum>=0?'subió':'bajó'} ${f1(Math.abs(a.t.cum))} puntos entre ${a.t.desde} y ${a.t.hasta} (${sg(a.t.porAnio,2)} por año)`:'sin serie suficiente para medir cambio';
  return `<b>${a.nm}:</b> ${f1(a.v)} en ${A.ult}, ${a.gp<0?f1(-a.gp)+' puntos por debajo':f1(a.gp)+' por encima'} del país (${sg(a.rel,1)}%); ${tr}. Prioridad <b style="color:${PCOL[a.pr]}">${a.pr}</b>.`;
}

/* ============ 3. GRÁFICOS SVG ============ */
const FONT="font-family:'Segoe UI',Arial,sans-serif";
function lc(o){
  const W=o.W||640,H=o.H||250,L=o.L||44,R=o.R||22,T=o.T||(o.leg===false?(o.titulo?22:14):40),B=o.B||34;
  const xs=o.xs,ys=o.series.flatMap(s=>s.pts.map(p=>p[1])).concat(o.extraY||[]).filter(v=>v!=null);
  if(!ys.length)return'';
  const step=o.step||10;let lo=o.ymin!=null?o.ymin:Math.floor((Math.min(...ys)-step*.6)/step)*step,hi=o.ymax!=null?o.ymax:Math.ceil((Math.max(...ys)+step*.6)/step)*step;if(hi===lo)hi=lo+step;
  const x0=o.x0,x1=o.x1,X=x=>L+(x-x0)/(x1-x0)*(W-L-R),Y=v=>T+(H-T-B)*(1-(v-lo)/(hi-lo));
  let g='';const nt=4;for(let i=0;i<=nt;i++){const v=lo+(hi-lo)*i/nt;g+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="${C.line}"/><text x="${L-6}" y="${Y(v)+3.5}" text-anchor="end" font-size="9.5" fill="${C.mut}">${Math.round(v)}</text>`}
  (o.miss||[]).forEach(y=>{g+=`<rect x="${X(y-.35)}" y="${T}" width="${X(y+.35)-X(y-.35)}" height="${H-T-B}" fill="#f8fafc" stroke="#cbd5e1" stroke-dasharray="3 3"/><text x="${X(y)}" y="${T+12}" text-anchor="middle" font-size="8.5" fill="${C.mut}">sin datos</text>`});
  (o.bands||[]).forEach(b=>{g+=`<polygon points="${b.pts.map(p=>X(p[0])+','+Y(p[1])).join(' ')}" fill="${b.c}" opacity=".16"/>`});
  (o.vlines||[]).forEach(v=>{g+=`<line x1="${X(v)}" x2="${X(v)}" y1="${T}" y2="${H-B}" stroke="${C.mut}" stroke-dasharray="4 3"/>`});
  (o.ticks||[]).forEach(y=>{g+=`<text x="${X(y)}" y="${H-B+14}" text-anchor="middle" font-size="9.5" fill="${C.gray}">${y}</text>`});
  let ln='';
  o.series.forEach(s=>{
    const P=s.pts.filter(p=>p[1]!=null);
    for(let i=1;i<P.length;i++){const gap=P[i][0]-P[i-1][0]>1&&!s.nogap;ln+=`<line x1="${X(P[i-1][0])}" y1="${Y(P[i-1][1])}" x2="${X(P[i][0])}" y2="${Y(P[i][1])}" stroke="${s.c}" stroke-width="${s.w||2}" ${s.dash||gap?`stroke-dasharray="${gap?'2 4':s.dash}"`:''} stroke-linecap="round"/>`}
    if(!s.noDots)P.forEach(p=>{ln+=`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="${s.w>2?3.6:2.6}" fill="${s.hollow?'#fff':s.c}" stroke="${s.c}" stroke-width="1.6"/>`});
    if(s.lab)P.forEach(p=>{ln+=`<text x="${X(p[0])}" y="${Y(p[1])-9}" text-anchor="middle" font-size="9.5" font-weight="700" fill="${s.c}">${num(p[1],s.dec==null?1:s.dec)}</text>`});
  });
  let lg='';if(o.leg!==false){let x=L;o.series.filter(s=>s.l).forEach(s=>{lg+=`<g transform="translate(${x},27)"><line x1="0" x2="16" y1="0" y2="0" stroke="${s.c}" stroke-width="${s.w||2}" ${s.dash?`stroke-dasharray="${s.dash}"`:''}/><circle cx="8" cy="0" r="2.6" fill="${s.hollow?'#fff':s.c}" stroke="${s.c}"/><text x="21" y="3.5" font-size="9.5" fill="${C.ink}">${e(s.l)}</text></g>`;x+=26+s.l.length*5.4})}
  return`<svg viewBox="0 0 ${W} ${H}" width="100%" style="${FONT};display:block" role="img" aria-label="${e(o.alt||o.titulo||'Gráfico')}">${o.titulo?`<text x="${L}" y="11" font-size="10.5" font-weight="700" fill="${C.navy}">${e(o.titulo)}</text>`:''}${g}${ln}${lg}</svg>`;
}
function gGlobal(A,o){
  o=o||{};const r=A.r,an=A.an;
  const mk=(arr)=>an.map(y=>[y,by(arr,y).global]);
  const s=[{l:A.colego?'Institución':'Territorio',pts:mk(r.pri),c:C.navy,w:3.2,lab:true}];
  if(A.colego&&r.mun&&r.mun.length)s.push({l:'Municipio',pts:mk(r.mun),c:C.teal,w:2});
  s.push({l:'Departamento',pts:mk(r.dep),c:C.amber,w:2,dash:'6 3'},{l:'País',pts:mk(r.pais),c:C.gray,w:2,dash:'2 3',hollow:true});
  if(o.tend&&A.tg.m){const m=A.tg.m;s.push({l:'Tendencia',pts:[[an[0],m.a+m.b*an[0]],[A.ult,m.a+m.b*A.ult]],c:C.red,w:1.4,dash:'4 3',noDots:true,nogap:true})}
  return lc({series:s,x0:an[0]-.5,x1:A.ult+.5,ticks:an,miss:A.faltan,H:o.H||265,titulo:'Puntaje global promedio por año (escala 0–500)',alt:'Evolución del puntaje global frente al municipio, departamento y país',step:10});
}
function gBrechas(A){
  const items=A.orden.slice().sort((a,b)=>a.rel-b.rel),W=640,rowH=34,H=items.length*rowH+56,L=190,mid=L+(W-L-60)*0.62;
  const mn=Math.min(0,...items.map(a=>a.gp)),mx=Math.max(0,...items.map(a=>a.gp));const sc=(mid-L-6)/Math.max(1,-mn||1);
  const sp=(W-60-mid)/Math.max(1,mx||1);const X=v=>v<0?mid+v*sc:mid+v*Math.min(sp,sc);
  let g=`<text x="0" y="11" font-size="10.5" font-weight="700" fill="${C.navy}">Brecha frente al promedio nacional por prueba (puntos, escala 0–100)</text><line x1="${mid}" x2="${mid}" y1="22" y2="${H-18}" stroke="${C.ink}"/>`;
  items.forEach((a,i)=>{const y=30+i*rowH,x=X(a.gp),w=Math.abs(x-mid);g+=`<text x="0" y="${y+16}" font-size="10.5" fill="${C.ink}">${e(a.nm)}</text><rect x="${Math.min(x,mid)}" y="${y+3}" width="${Math.max(1,w)}" height="20" rx="3" fill="${PCOL[a.pr]}"/><text x="${a.gp<0?Math.min(x,mid)-5:Math.max(x,mid)+5}" y="${y+17}" text-anchor="${a.gp<0?'end':'start'}" font-size="10.5" font-weight="700" fill="${C.ink}">${sg(a.gp)} (${sg(a.rel,0)}%)</text>`});
  g+=`<text x="${mid}" y="${H-5}" text-anchor="middle" font-size="9" fill="${C.mut}">0 = igual al país · a la izquierda: por debajo</text>`;
  return`<svg viewBox="0 0 ${W} ${H}" width="100%" style="${FONT};display:block" role="img" aria-label="Brecha por prueba frente al país">${g}</svg>`;
}
function gPuntos(A){
  const rows=A.areas.map(a=>({l:a.nm,v:[['Institución',a.v,C.navy,'c'],['Municipio',a.m,C.teal,'s'],['Departamento',a.d,C.amber,'d'],['País',a.p,C.gray,'t']]}));
  const all=rows.flatMap(r=>r.v.map(x=>x[1])).filter(x=>x!=null);if(!all.length)return'';
  const lo=Math.floor(Math.min(...all)/5)*5-2,hi=Math.ceil(Math.max(...all)/5)*5+2,W=640,L=150,R=20,rh=36,H=rows.length*rh+60,X=v=>L+(v-lo)/(hi-lo)*(W-L-R);
  let g=`<text x="0" y="11" font-size="10.5" font-weight="700" fill="${C.navy}">Promedio por prueba en ${A.ult}: institución frente a cada referencia</text>`;
  for(let v=Math.ceil(lo/5)*5;v<=hi;v+=5)g+=`<line x1="${X(v)}" x2="${X(v)}" y1="26" y2="${H-26}" stroke="${C.line}"/><text x="${X(v)}" y="${H-12}" text-anchor="middle" font-size="9.5" fill="${C.mut}">${v}</text>`;
  const mark=(sh,x,y,c)=>sh==='c'?`<circle cx="${x}" cy="${y}" r="6" fill="${c}"/>`:sh==='s'?`<rect x="${x-5}" y="${y-5}" width="10" height="10" fill="${c}"/>`:sh==='d'?`<polygon points="${x},${y-6.5} ${x+6.5},${y} ${x},${y+6.5} ${x-6.5},${y}" fill="${c}"/>`:`<polygon points="${x},${y-6} ${x+6},${y+5} ${x-6},${y+5}" fill="${c}"/>`;
  rows.forEach((r,i)=>{const y=40+i*rh;g+=`<text x="0" y="${y+4}" font-size="10.5" fill="${C.ink}">${e(r.l)}</text><line x1="${X(lo)}" x2="${X(hi)}" y1="${y}" y2="${y}" stroke="#eef2f7"/>`;r.v.filter(x=>x[1]!=null).forEach(x=>{g+=mark(x[3],X(x[1]),y,x[2])})});
  let lg='',lx=L;[['Institución',C.navy,'c'],['Municipio',C.teal,'s'],['Departamento',C.amber,'d'],['País',C.gray,'t']].forEach(x=>{lg+=`${mark(x[2],lx+6,22,x[1])}<text x="${lx+16}" y="25" font-size="9.5" fill="${C.ink}">${x[0]}</text>`;lx+=26+x[0].length*5.6});
  return`<svg viewBox="0 0 ${W} ${H}" width="100%" style="${FONT};display:block" role="img" aria-label="Comparación territorial por prueba">${g}${lg}</svg>`;
}
function gMini(A,a){
  const an=A.an,r=A.r,s=[{pts:an.map(y=>[y,by(r.pri,y)[a.k]]),c:C.navy,w:2.4,lab:true,dec:0},{pts:an.map(y=>[y,by(r.pais,y)[a.k]]),c:C.gray,w:1.6,dash:'3 3',hollow:true}];
  return lc({W:300,H:150,L:30,R:12,B:26,T:20,series:s,x0:an[0]-.5,x1:A.ult+.5,ticks:an.length>6?an.filter((y,i)=>i%2===0||y===A.ult):an,miss:A.faltan,leg:false,step:5,titulo:a.nm,alt:'Evolución de '+a.nm});
}
function gAbanico(A){
  const an=A.an,u=A.r.pri,hmax=Math.max(...A.hor),x1=A.ult+hmax+.5;
  const hist=an.map(y=>[y,by(u,y).global]),last=[A.ult,A.u.global];
  const s=[{l:'Resultados reales',pts:hist,c:C.navy,w:3,lab:true,dec:0}];
  const pe=A.proy.esc;
  s.push({l:'Sin cambios',pts:[last].concat(pe.map(x=>[x.y,x.sin])),c:C.gray,w:1.8,dash:'5 3',nogap:true,hollow:true});
  const ext=[];
  if(A.proy.ok){const ptsT=[last].concat(pe.map(x=>[x.y,x.tend.v]));s.push({l:'Tendencial',pts:ptsT,c:C.red,w:1.8,dash:'2 3',nogap:true});
    const up=[last].concat(pe.map(x=>[x.y,x.tend.hi])),dn=[last].concat(pe.map(x=>[x.y,x.tend.lo])).reverse();
    var bands=[{pts:up.concat(dn),c:C.red}];pe.forEach(x=>{ext.push(x.tend.hi,x.tend.lo)})}
  s.push({l:'Meta de mejoramiento',pts:[last].concat(pe.map(x=>[x.y,x.mej])),c:C.teal,w:2.2,nogap:true});
  const ticks=an.concat(pe.map(x=>x.y));
  return lc({series:s,bands:bands||[],x0:an[0]-.5,x1:x1,ticks:ticks.filter((y,i)=>ticks.length<=9||i%2===0||y>A.ult),miss:A.faltan,vlines:[A.ult+.5],H:275,extraY:ext,titulo:'Puntaje global: resultados reales y escenarios a futuro (banda = intervalo de incertidumbre 95%)',step:10,alt:'Proyección con escenarios'});
}
function gMatriz(A){
  const W=640,H=300,L=56,R=20,T=30,B=40,xs=1.6,ylo=Math.min(-35,Math.floor(Math.min(...A.areas.map(a=>a.rel))/5)*5-5),yhi=Math.max(5,Math.ceil(Math.max(...A.areas.map(a=>a.rel))/5)*5+3);
  const X=v=>L+(clamp(v,-xs,xs)+xs)/(2*xs)*(W-L-R),Y=v=>T+(yhi-v)/(yhi-ylo)*(H-T-B);
  let g=`<text x="${L}" y="12" font-size="10.5" font-weight="700" fill="${C.navy}">Matriz de prioridad: distancia con el país vs. tendencia propia</text>`;
  g+=`<rect x="${L}" y="${Y(-10)}" width="${X(-.3)-L}" height="${Y(ylo)-Y(-10)}" fill="${C.red}" opacity=".10"/><rect x="${X(-.3)}" y="${T}" width="${X(.3)-X(-.3)}" height="${H-T-B}" fill="#94a3b8" opacity=".07"/>`;
  g+=`<line x1="${X(-.3)}" x2="${X(-.3)}" y1="${T}" y2="${H-B}" stroke="${C.mut}" stroke-dasharray="3 3"/><line x1="${X(.3)}" x2="${X(.3)}" y1="${T}" y2="${H-B}" stroke="${C.mut}" stroke-dasharray="3 3"/>`;
  [[-10,'−10% (Crítica/Alta)'],[-5,'−5%'],[-2,'−2%']].forEach(v=>{if(v[0]>ylo)g+=`<line x1="${L}" x2="${W-R}" y1="${Y(v[0])}" y2="${Y(v[0])}" stroke="${C.line}" stroke-dasharray="4 3"/><text x="${L-5}" y="${Y(v[0])+3}" text-anchor="end" font-size="9" fill="${C.mut}">${v[0]}%</text>`});
  g+=`<text x="${L}" y="${H-8}" font-size="9.5" fill="${C.mut}">← baja ${'('+sg(-xs)+' pts/año)'}</text><text x="${W-R}" y="${H-8}" text-anchor="end" font-size="9.5" fill="${C.mut}">sube ${'('+sg(xs)+' pts/año) →'}</text><text x="${(L+W-R)/2}" y="${H-8}" text-anchor="middle" font-size="9.5" fill="${C.mut}">estable (±0,3)</text>`;
  g+=`<text x="14" y="${(T+H-B)/2}" font-size="9.5" fill="${C.mut}" transform="rotate(-90 14 ${(T+H-B)/2})" text-anchor="middle">brecha relativa con el país (%)</text>`;
  const used=[];A.areas.forEach(a=>{let x=X(a.t.pendiente==null?0:a.t.pendiente),y=Y(a.rel);let k=0;while(used.some(u=>Math.abs(u[0]-x)<90&&Math.abs(u[1]-y)<15)&&k<10){y+=15;k++}used.push([x,y]);
    g+=`<circle cx="${x}" cy="${y}" r="7" fill="${PCOL[a.pr]}" opacity=".9"/><text x="${x+11}" y="${y+4}" font-size="10" font-weight="600" fill="${C.ink}">${e(a.nm.split(' ')[0])}${a.k==='soc'?' y C.':''}</text>`});
  return`<svg viewBox="0 0 ${W} ${H}" width="100%" style="${FONT};display:block" role="img" aria-label="Matriz de prioridad">${g}</svg>`;
}
function geometria(){
  let s='';for(let i=0;i<9;i++){const h=40+i*26+(i%3)*10;s+=`<rect x="${40+i*46}" y="${300-h}" width="30" height="${h}" rx="4" fill="#fff" opacity="${.07+i*.02}"/>`}
  s+=`<polyline points="30,250 110,205 190,222 270,160 350,175 430,110 510,95" fill="none" stroke="#5eead4" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`+[[30,250],[110,205],[190,222],[270,160],[350,175],[430,110],[510,95]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="#0b2a5b" stroke="#5eead4" stroke-width="3"/>`).join('');
  s+=`<circle cx="520" cy="60" r="110" fill="none" stroke="#fff" opacity=".10" stroke-width="2"/><circle cx="520" cy="60" r="70" fill="none" stroke="#fff" opacity=".12" stroke-width="2"/><circle cx="60" cy="40" r="26" fill="#d97706" opacity=".85"/>`;
  return`<svg viewBox="0 0 600 320" width="100%" aria-hidden="true">${s}</svg>`;
}

/* ============ 4. DOCUMENTO A4 ============ */
const CSS=`@page{size:A4;margin:0}*{box-sizing:border-box}html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;background:#cbd5e1;font:9.6pt/1.5 'Segoe UI',Arial,Helvetica,sans-serif;color:${C.ink}}
.sheet{width:210mm;height:296mm;margin:0 auto 6mm;background:#fff;position:relative;padding:24mm 17mm 20mm;overflow:hidden;page-break-after:always;break-after:page}
.sheet:last-child{page-break-after:auto;break-after:auto;margin-bottom:0}
@media print{body{background:#fff}.sheet{margin:0}}
.hd{position:absolute;left:17mm;right:17mm;top:9mm;display:flex;justify-content:space-between;align-items:flex-end;font-size:7.8pt;color:${C.mut};border-bottom:1.2pt solid ${C.navy};padding-bottom:2mm}
.hd b{color:${C.navy};font-size:8.6pt}
.ft{position:absolute;left:17mm;right:17mm;bottom:8mm;display:flex;justify-content:space-between;font-size:7.6pt;color:${C.mut};border-top:.6pt solid ${C.line};padding-top:2mm}
h1{font-size:21pt;color:${C.navy};margin:0 0 2mm;line-height:1.15}
h2{font-size:15pt;color:${C.navy};margin:0 0 1mm;border-left:3mm solid ${C.teal};padding-left:3mm;line-height:1.2}
h3{font-size:10.8pt;color:${C.navy};margin:4mm 0 1.5mm}
p{margin:0 0 2.2mm;text-align:justify}.sub{color:${C.mut};font-size:8.8pt;margin:0 0 4mm 6mm}
table{border-collapse:collapse;width:100%;font-size:8.6pt;margin:1.5mm 0 3mm}
th{background:${C.navy};color:#fff;text-align:left;padding:1.6mm 2mm;font-weight:600}
td{padding:1.5mm 2mm;border-bottom:.6pt solid ${C.line};vertical-align:top}
tr:nth-child(even) td{background:#f8fafc}
td.n,th.n{text-align:right;white-space:nowrap}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin:3mm 0 4mm}
.kpi{border:.8pt solid ${C.line};border-top:2.2mm solid ${C.navy};border-radius:2mm;padding:2.5mm 3mm;background:#fff}
.kpi b{display:block;font-size:16pt;color:${C.navy};line-height:1.15}.kpi span{font-size:7.8pt;color:${C.mut}}
.box{border-left:2.4mm solid ${C.teal};background:#f0fdfa;padding:2.5mm 3.5mm;margin:2mm 0 3mm;border-radius:0 2mm 2mm 0;font-size:9pt}
.box.w{border-color:${C.amber};background:#fffbeb}.box.r{border-color:${C.red};background:#fef2f2}.box.b{border-color:${C.blue};background:#eff6ff}
ul{margin:0 0 2.5mm;padding-left:5mm}li{margin-bottom:1.3mm;text-align:justify}
.tag{display:inline-block;color:#fff;border-radius:2mm;padding:.4mm 2mm;font-size:7.8pt;font-weight:700;white-space:nowrap}
.note{font-size:7.9pt;color:${C.mut}}
.cover{padding:0;background:${C.navy};color:#fff}
.cover .top{position:absolute;left:17mm;right:17mm;top:12mm;display:flex;gap:4mm;align-items:center;color:#fff}
.cover .top img{height:17mm;background:#fff;border-radius:2mm;padding:1mm}
.cover .art{position:absolute;left:0;right:0;top:34mm}
.cover .tit{position:absolute;left:17mm;right:17mm;top:158mm}
.cover .tit .k{letter-spacing:.25em;font-size:9pt;color:#5eead4;font-weight:700}
.cover .tit h1{color:#fff;font-size:27pt;margin:3mm 0 3mm}
.cover .tit .n{font-size:15pt;font-weight:600;line-height:1.25}
.cover .meta{position:absolute;left:17mm;right:17mm;bottom:14mm;display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;font-size:8.6pt;border-top:.6pt solid #ffffff55;padding-top:4mm}
.cover .meta b{display:block;color:#5eead4;font-size:7.4pt;letter-spacing:.12em}
.toc td{border-bottom:.6pt dotted #94a3b8;font-size:10pt;padding:2mm}.toc tr:nth-child(even) td{background:#fff}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}
.pmi td:first-child{width:34mm;font-weight:700;color:${C.navy};background:#f1f5f9}
.pmi tr:nth-child(even) td{background:#fff}.pmi tr:nth-child(even) td:first-child{background:#f1f5f9}
.sig{display:grid;grid-template-columns:1fr 1fr;gap:14mm;margin-top:16mm;text-align:center;font-size:8.6pt}.sig div{border-top:.8pt solid ${C.ink};padding-top:1.5mm}
svg{max-width:100%}`;

function build(r,ctx){
  ctx=ctx||{};
  const A=analizar(r,ctx),Lh=ctx.membrete||{},emit=ctx.emit||'';
  const sec=ctx.sec||{};const on=k=>sec[k]!==false;
  const pages=[];const P=(s,html)=>pages.push({s,html});
  const per=A.an[0]+(A.an.length>1?'–'+A.ult:'');
  const nm=A.nombre;
  const wcol=!!ctx.word;

  /* --- Resumen --- */
  if(on('resumen')){
    const t=A.tg,hz=hallazgos(A);
    const kp=`<div class="kpis"><div class="kpi"><b>${f1(A.u.global)}</b><span>Puntaje global ${A.ult} (de 500)</span></div><div class="kpi"><b>${sg(A.gap.p)}</b><span>Brecha con el país (${sg(A.gapRel,0)}%)</span></div><div class="kpi"><b>${t.ok?sg(t.cum):'—'}</b><span>Cambio acumulado ${t.ok?t.desde+'→'+t.hasta:''}</span></div><div class="kpi"><b>${f0(A.u.n)}</b><span>Estudiantes evaluados · muestra ${A.muestra}</span></div></div>`;
    const prios=A.orden.filter(a=>a.pr!=='Seguimiento').map(a=>`<li><b>${a.nm}</b> — <span class="tag" style="background:${PCOL[a.pr]}">${a.pr}</span> ${f1(a.v)} (${sg(a.gp)} vs. país; ${dirTxt(a.t)})</li>`).join('');
    P('resumen',`<h2>Resumen ejecutivo</h2><p class="sub">${e(nm)} · Saber 11 · calendario ${r.cal||'A'} · ${per}</p>${kp}
    <h3>Hallazgos principales</h3><ul>${hz.map(x=>`<li>${x}</li>`).join('')}</ul>
    ${A.orden.length?`<h3>Prioridades de mejoramiento</h3><ul style="list-style:none;padding-left:0">${prios||'<li>Ninguna prueba requiere prioridad alta con la regla aplicada.</li>'}</ul><p class="note">Regla: brecha relativa contra el país combinada con la tendencia propia de cada prueba (ver sección «Diagnóstico y prioridades»).</p>`:''}
    ${A.adv.length?`<div class="box w"><b>Advertencias de lectura</b><ul style="margin:1mm 0 0">${A.adv.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>`:''}
    ${A.posD?`<div class="box b">Posición en el ranking departamental ${r.rankAnio||A.ult}${critTxt(r)}: <b>${A.posD.i} de ${A.posD.n}</b> establecimientos con resultado${A.posM?` · en su municipio: <b>${A.posM.i} de ${A.posM.n}</b>`:''}.</div>`:''}
    <div class="box"><b>Lectura general.</b> ${A.gap.p!=null&&A.gap.p<0?`El resultado global se mantiene por debajo del promedio nacional y ${t.ok&&t.dir==='descenso'?'la tendencia propia es descendente, lo que justifica un plan de mejoramiento inmediato y con seguimiento trimestral.':'requiere un plan de mejoramiento sostenido con metas por prueba.'}`:'El resultado global está en o por encima del promedio nacional; la prioridad es consolidar y documentar las prácticas que funcionan.'}</div>`);
  }
  /* --- Ficha técnica y metodología --- */
  if(on('ficha')){
    const f=r.ficha||{};
    P('ficha',`<h2>Ficha técnica y metodología</h2><p class="sub">Qué datos se usaron y cómo se calcularon las cifras</p>
    <table><tr><td style="width:32mm"><b>${A.colego?'Institución':'Territorio'}</b></td><td colspan="3">${e(nm)}</td></tr>
    ${A.colego?`<tr><td><b>Código DANE</b></td><td>${e(r.dane||'—')}</td><td><b>Sector</b></td><td>${e(f.sector||'—')}</td></tr><tr><td><b>Municipio</b></td><td>${e(f.mcpio||'—')}</td><td><b>Departamento</b></td><td>${e(f.depto||'—')}</td></tr>`:''}
    ${A.colego?`<tr><td><b>Zona</b></td><td colspan="3">${e(r.zona||'Sin dato (el colegio no la ha registrado)')}</td></tr>`:''}<tr><td><b>Calendario</b></td><td>${r.cal||'A'}</td><td><b>Años analizados</b></td><td>${A.an.join(', ')}</td></tr>
    <tr><td><b>Años sin datos</b></td><td colspan="3">${A.faltan.length?A.faltan.join(', ')+' (no publicados por el ICFES o no disponibles)':'Ninguno dentro del periodo'}</td></tr>
    <tr><td><b>Evaluados</b></td><td colspan="3">${f0(A.u.n)} en ${A.ult} · muestra ${A.muestra}</td></tr></table>
    <h3>Fuentes</h3><ul><li>ICFES, «Resultados únicos Saber 11» (datos abiertos, datos.gov.co): años 2019–2022, agregados por establecimiento, municipio, departamento y país; promedios con un decimal.</li><li>ICFES, archivos oficiales de resultados agregados por establecimiento (publicados en el sitio del ICFES): años 2023 en adelante; los promedios por área llegan como números enteros.</li></ul>
    <h3>Cómo se calcularon las cifras</h3><ul>
    <li><b>Puntaje global (0–500):</b> promedio de los resultados de las sedes y jornadas del establecimiento, ponderado por número de evaluados. Cada prueba va de 0 a 100.</li>
    <li><b>Brecha:</b> diferencia entre el resultado de la institución y el de cada referencia (municipio, departamento, país) en el mismo año; la brecha relativa es esa diferencia dividida por el valor nacional.</li>
    <li><b>Cambio por año:</b> diferencia entre dos observaciones dividida por los años <i>reales</i> transcurridos (si falta un año, no se trata como consecutivo).</li>
    <li><b>Tendencia:</b> con 4 o más observaciones se ajusta una recta de mínimos cuadrados sobre los años reales; con menos, se usa el cambio acumulado dividido por los años transcurridos. Se considera «estable» un cambio menor a ±0,3 puntos por año en las pruebas y ±1,5 en el global.</li>
    <li><b>Proyección:</b> la recta se extiende con un intervalo de incertidumbre del 95 %. Si hay menos de 4 observaciones <b>no</b> se proyecta tendencia. Es un ejercicio estadístico, no un resultado oficial.</li>
    <li><b>Prioridad:</b> regla fija y pública: brecha relativa ≤ −10 % y tendencia a la baja = Crítica; ≤ −10 % sin descenso o ≤ −5 % con descenso = Alta; hasta −2 % = Media; mejor que −2 % = Seguimiento.</li></ul>
    <div class="box w"><b>Alcance y limitaciones</b><ul style="margin:1mm 0 0"><li>Las fuentes agregadas no incluyen desviación estándar, niveles de desempeño ni resultados por competencia: por eso este informe <b>no</b> analiza competencias ni dispersión.</li><li>Los datos de 2019–2022 y los de 2023 en adelante provienen de publicaciones distintas (precisión de decimales diferente); las diferencias menores a 1 punto en un área pueden deberse a este redondeo.</li><li>Un resultado de una cohorte pequeña varía por azar; las causas de los cambios no se pueden determinar con estos datos.</li></ul></div>`);
  }
  /* --- Evolución --- */
  if(on('evolucion')){
    const t=A.tg;
    const filas=A.r.pri.map((x,i)=>{const prev=i?A.r.pri[i-1]:null,dy=prev&&x.global!=null&&prev.global!=null?x.global-prev.global:null,py=dy!=null?dy/(x.anio-prev.anio):null,bp=x.global!=null&&by(A.r.pais,x.anio).global!=null?r1(x.global-by(A.r.pais,x.anio).global):null;
      return`<tr><td><b>${x.anio}</b></td><td class="n">${f0(x.n)}</td><td class="n"><b>${f1(x.global)}</b></td>${A.colego&&A.r.mun&&A.r.mun.length?`<td class="n">${f1(by(A.r.mun,x.anio).global)}</td>`:''}<td class="n">${f1(by(A.r.dep,x.anio).global)}</td><td class="n">${f1(by(A.r.pais,x.anio).global)}</td><td class="n">${prev?sg(dy)+(x.anio-prev.anio>1?'<sup>*</sup>':''):'—'}</td><td class="n">${prev?sg(py,2):'—'}</td><td class="n">${sg(bp)}</td></tr>`}).join('');
    P('evolucion',`<h2>Evolución histórica del puntaje global</h2><p class="sub">${per} · ${A.an.length} observaciones${A.faltan.length?' · sin datos: '+A.faltan.join(', '):''}</p>
    ${gGlobal(A,{tend:true})}
    <table><tr><th>Año</th><th class="n">Evaluados</th><th class="n">${A.colego?'Institución':'Territorio'}</th>${A.colego&&A.r.mun&&A.r.mun.length?'<th class="n">Municipio</th>':''}<th class="n">Depto.</th><th class="n">País</th><th class="n">Δ puntos</th><th class="n">Δ por año</th><th class="n">Brecha país</th></tr>${filas}</table>
    <p class="note"><sup>*</sup> Variación entre observaciones separadas por más de un año; «Δ por año» ya la divide por los años reales transcurridos.</p>
    <h3>Lectura</h3><ul>${t.ok?`<li>Cambio acumulado de ${t.desde} a ${t.hasta}: <b>${sg(t.cum)} puntos</b> (${sg(t.porAnio,2)} por año en ${t.span} años).</li>`:''}${t.m?`<li>Recta de tendencia (años reales): <b>${sg(t.m.b,2)} puntos por año</b>, R² = ${f2(t.m.r2)} — ${t.m.r2<0.5?'ajuste débil: la serie es irregular y la tendencia es poco concluyente':'ajuste aceptable'}.</li>`:'<li>Con menos de 4 observaciones no se ajusta recta de tendencia.</li>'}${A.peor&&A.peor.d<0?`<li>Mayor caída entre observaciones: <b>${f1(-A.peor.d)} puntos</b> (${A.peor.de}→${A.peor.a}).</li>`:''}${A.mejor&&A.mejor.d>0?`<li>Mayor avance entre observaciones: <b>+${f1(A.mejor.d)} puntos</b> (${A.mejor.de}→${A.mejor.a}).</li>`:''}${A.deltaRef.p!=null?`<li>Mientras la institución cambió ${sg(t.cum)} puntos, el promedio nacional cambió ${sg(A.deltaRef.p)}${A.deltaRef.d!=null?' y el departamental '+sg(A.deltaRef.d):''}.</li>`:''}</ul>`);
  }
  /* --- Territorial --- */
  if(on('territorial')){
    const gp=(x,y)=>x==null||y==null?null:r1(x-y);
    const filas=[['Global (0–500)',A.u.global,A.m.global,A.d.global,A.p.global]].concat(A.areas.map(a=>[a.nm,a.v,a.m,a.d,a.p])).map(x=>`<tr><td><b>${x[0]}</b></td><td class="n"><b>${f1(x[1])}</b></td>${A.colego&&A.r.mun&&A.r.mun.length?`<td class="n">${f1(x[2])}</td>`:''}<td class="n">${f1(x[3])}</td><td class="n">${f1(x[4])}</td>${A.colego&&A.r.mun&&A.r.mun.length?`<td class="n">${sg(gp(x[1],x[2]))}</td>`:''}<td class="n">${sg(gp(x[1],x[3]))}</td><td class="n">${sg(gp(x[1],x[4]))}</td></tr>`).join('');
    const rm=A.rankMun&&A.rankMun.length?A.rankMun:null,lista=rm||A.rank.slice(0,10);
    const rk=A.rank.length?`<h3>Ranking ${rm?'del municipio':'del departamento'} · ${r.rankAnio||A.ult}${critTxt(r)}</h3><table><tr><th>Puesto</th><th>Establecimiento</th><th>Sector</th><th class="n">Evaluados</th><th class="n">Global</th></tr>${lista.slice(0,9).map((x,i)=>{const mine=x.dane===r.dane;return`<tr ${mine?`style="font-weight:700"`:''}><td ${mine?`style="background:#dbeafe"`:''}>${i+1}</td><td ${mine?`style="background:#dbeafe"`:''}>${e(clean(x.nombre))}${mine?' ◀':''}</td><td ${mine?`style="background:#dbeafe"`:''}>${e(x.sector||'')}</td><td class="n" ${mine?`style="background:#dbeafe"`:''}>${f0(x.n)}</td><td class="n" ${mine?`style="background:#dbeafe"`:''}><b>${f1(x.g)}</b></td></tr>`}).join('')}</table><p class="note">Solo establecimientos con 5 o más evaluados y puntaje global publicado${A.rankExcl?` (se excluyeron ${A.rankExcl} sin resultado o con muestra menor)`:''}. ${A.posD?`Posición departamental: ${A.posD.i} de ${A.posD.n}${A.posM?'; municipal: '+A.posM.i+' de '+A.posM.n:''}.`:''}</p>`:'';
    P('territorial',`<h2>Comparación territorial</h2><p class="sub">Institución frente al municipio, el departamento y el país · ${A.ult}</p>${gPuntos(A)}
    <table><tr><th>Prueba</th><th class="n">Inst.</th>${A.colego&&A.r.mun&&A.r.mun.length?'<th class="n">Munic.</th>':''}<th class="n">Depto.</th><th class="n">País</th>${A.colego&&A.r.mun&&A.r.mun.length?'<th class="n">Brecha munic.</th>':''}<th class="n">Brecha depto.</th><th class="n">Brecha país</th></tr>${filas}</table>
    <div class="box b">${A.gap.d!=null&&A.brechaIni.d!=null?`Frente al departamento, la brecha pasó de <b>${sg(A.brechaIni.d)}</b> en ${A.an[0]} a <b>${sg(A.gap.d)}</b> en ${A.ult}. `:''}${A.gap.m!=null&&A.brechaIni.m!=null?`Frente al municipio, de <b>${sg(A.brechaIni.m)}</b> a <b>${sg(A.gap.m)}</b>. `:''}Esto indica si la institución se mueve con su entorno o se separa de él.</div>${rk}`);
  }
  /* --- Áreas --- */
  if(on('areas')&&A.areas.length){
    const fil=A.orden.map(a=>`<tr><td><b>${a.nm}</b></td><td class="n"><b>${f1(a.v)}</b></td><td class="n">${f1(a.p)}</td><td class="n">${sg(a.gp)}</td><td class="n">${sg(a.rel,0)}%</td><td class="n">${a.t.ok?sg(a.t.cum):'—'}</td><td class="n">${a.t.ok?sg(a.t.porAnio,2):'—'}</td><td>${a.t.ok?dirTxt(a.t).replace('tendencia ',''):'—'}</td><td><span class="tag" style="background:${PCOL[a.pr]}">${a.pr}</span></td></tr>`).join('');
    P('areas',`<h2>Análisis por áreas</h2><p class="sub">Resultados ${A.ult} por prueba (escala 0–100) y su cambio en el periodo</p>${gBrechas(A)}
    <table><tr><th>Prueba</th><th class="n">Inst.</th><th class="n">País</th><th class="n">Brecha</th><th class="n">Brecha %</th><th class="n">Δ acum.</th><th class="n">Δ por año</th><th>Tendencia</th><th>Prioridad</th></tr>${fil}</table>
    <div class="box">La prueba con <b>menor distancia relativa</b> con el país es <b>${A.relativa?e(A.relativa.nm):'—'}</b> (${A.relativa?sg(A.relativa.rel,0):''}%). Es una «fortaleza relativa interna»: no significa que supere al país, sino que es donde la institución está más cerca de él.</div>
    <h3>Lectura por prueba</h3><ul>${A.orden.map(a=>`<li>${lecturaArea(a,A)}</li>`).join('')}</ul>`);
    P('areas',`<h2>Evolución por prueba</h2><p class="sub">Institución (línea continua) frente al país (línea punteada)</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm">${A.areas.map(a=>`<div style="border:.6pt solid ${C.line};border-radius:2mm;padding:2mm">${gMini(A,a)}<div class="note" style="text-align:center">${a.t.ok?`${sg(a.t.cum)} puntos (${sg(a.t.porAnio,2)}/año)`:'—'} · <b style="color:${PCOL[a.pr]}">${a.pr}</b></div></div>`).join('')}</div>
    <h3>Valores por año</h3><table><tr><th>Prueba</th>${A.an.map(y=>`<th class="n">${y}</th>`).join('')}</tr>${A.areas.map(a=>`<tr><td><b>${a.nm}</b></td>${A.an.map(y=>`<td class="n">${f1(by(A.r.pri,y)[a.k])}</td>`).join('')}</tr>`).join('')}</table>`);
  }
  /* --- Diagnóstico --- */
  if(on('diagnostico')&&A.areas.length){
    const fort=A.areas.filter(a=>a.pr==='Seguimiento');
    P('diagnostico',`<h2>Diagnóstico y prioridades</h2><p class="sub">Qué atender primero y por qué</p>${gMatriz(A)}
    <p class="note">Cada círculo es una prueba: la altura es su distancia relativa con el país; la posición horizontal, su tendencia en puntos por año. El color es la prioridad.</p>
    <table><tr><th>Orden</th><th>Prueba</th><th>Prioridad</th><th>Criterio que la activó</th></tr>${A.orden.map((a,i)=>`<tr><td>${i+1}</td><td><b>${a.nm}</b></td><td><span class="tag" style="background:${PCOL[a.pr]}">${a.pr}</span></td><td>Brecha ${sg(a.rel,1)}% con el país${a.t.ok?'; tendencia '+dirTxt(a.t).replace('tendencia ','')+' ('+sg(a.t.pendiente,2)+' pts/año)':''}.</td></tr>`).join('')}</table>
    <div class="box ${A.nCrit?'r':'w'}"><b>Conclusión del diagnóstico.</b> ${A.nCrit?`${A.nCrit} de ${A.areas.length} pruebas están en prioridad <b>Crítica</b> (brecha de 10 % o más con el país y tendencia a la baja sostenida).`:'Ninguna prueba cumple a la vez brecha grande y descenso sostenido; aun así'} ${A.orden.filter(a=>a.ord<=1).length?`Las pruebas con prioridad Crítica o Alta son: ${A.orden.filter(a=>a.ord<=1).map(a=>'<b>'+a.nm+'</b>').join(', ')}.`:''} ${fort.length?`En seguimiento: ${fort.map(a=>a.nm).join(', ')}.`:'No hay pruebas en la categoría de seguimiento: la brecha con el país es amplia en todas.'}</div>
    ${A.relativa?`<p>La <b>fortaleza relativa interna</b> es <b>${e(A.relativa.nm)}</b> y la mayor distancia está en <b>${e(A.menor.nm)}</b>; las acciones deben partir de la prueba más distante pero apoyarse en las prácticas de la más cercana.</p>`:''}`);
  }
  /* --- Proyección --- */
  if(on('proyeccion')&&A.u.global!=null){
    const fil=A.proy.esc.map(x=>`<tr><td><b>${x.y}</b> (+${x.h} año${x.h>1?'s':''})</td><td class="n">${f1(x.sin)}</td><td class="n">${x.tend?f1(x.tend.v)+(x.tend.lo!=null?`<br><span class="note">(${f0(x.tend.lo)}–${f0(x.tend.hi)})</span>`:''):'—'}</td><td class="n"><b>${f1(x.mej)}</b></td></tr>`).join('');
    P('proyeccion',`<h2>Proyección con escenarios</h2><p class="sub">Puntaje global esperable si... (no es un pronóstico oficial)</p>${gAbanico(A)}
    <table><tr><th>Año</th><th class="n">Sin cambios</th><th class="n">Tendencial (banda 95 %)</th><th class="n">Meta de mejoramiento</th></tr>${fil}</table>
    <ul><li><b>Sin cambios:</b> se repite el último resultado (${f1(A.u.global)}).</li><li><b>Tendencial:</b> ${A.proy.ok?`continúa la recta ajustada (${sg(A.tg.m.b,2)} puntos por año). La banda muestra la incertidumbre estadística: ${A.tg.m.r2<0.5?'es amplia porque la serie es irregular, de modo que la tendencia no es concluyente.':'es la esperable con este ajuste.'}`:'<b>no se calcula</b>: se necesitan al menos 4 observaciones.'}</li><li><b>Meta de mejoramiento:</b> objetivo propuesto, no pronóstico: +${f1(A.metaAnual)} puntos el primer año (15 % de la brecha con el país, entre 2 y 8 puntos) y un avance mayor a 3 años si se ejecuta el plan.</li></ul>
    <div class="box w">Con cohortes de ${f0(A.u.n)} estudiantes, el puntaje de un año puede moverse varios puntos por azar. Use las proyecciones para fijar metas, no para predecir un resultado exacto.</div>`);
  }
  /* --- PMI --- */
  if(on('pmi')&&A.areas.length){
    const prio=A.orden.filter(a=>a.pr!=='Seguimiento'),acc=ctx.acc||(()=>[]);
    const res=a=>[ROL[a.k],'Coordinación académica (seguimiento)','Rectoría (aprobación y recursos)'];
    P('pmi',`<h2>Plan de Mejoramiento Institucional</h2><p class="sub">Metas, responsables y seguimiento por prueba prioritaria · año base ${A.ult}</p>
    <div class="box b"><b>Objetivo general.</b> Reducir de forma sostenida la brecha con el promedio nacional en Saber 11, empezando por las pruebas de mayor prioridad, con metas medibles a 1 y 3 años y seguimiento trimestral con simulacros en AULA360.</div>
    <table><tr><th>Prueba</th><th>Prioridad</th><th class="n">Línea base ${A.ult}</th><th class="n">Meta 1 año</th><th class="n">Meta 3 años</th><th>Responsable</th></tr>${prio.map(a=>`<tr><td><b>${a.nm}</b></td><td><span class="tag" style="background:${PCOL[a.pr]}">${a.pr}</span></td><td class="n">${f1(a.v)}</td><td class="n"><b>${f1(metaArea(a,1))}</b></td><td class="n"><b>${f1(metaArea(a,3))}</b></td><td>${ROL[a.k]}</td></tr>`).join('')}</table>
    <p class="note">Meta 1 año = línea base + 20 % de la brecha con el país (mínimo 1 y máximo 3 puntos). Meta 3 años ≈ 40 % de la brecha. Son metas propuestas para el consejo académico, que puede ajustarlas.</p>
    <h3>Meta global</h3><p>Puntaje global: de <b>${f1(A.u.global)}</b> a <b>${f1(A.proy.esc[0]?A.proy.esc[0].mej:null)}</b> en ${A.ult+1}${A.proy.esc.find(x=>x.h===3)?` y <b>${f1(A.proy.esc.find(x=>x.h===3).mej)}</b> en ${A.ult+3}`:''}.</p>
    <h3>Seguimiento y evaluación (aplica a todas las pruebas)</h3><ul><li><b>Trimestral:</b> simulacro por prueba en AULA360 y comparación con la línea base.</li><li><b>Semestral:</b> informe del jefe de área al consejo académico con avance de actividades y resultados.</li><li><b>Anual:</b> nuevo informe Saber 11 con los resultados oficiales y revisión de metas.</li></ul>`);
    prio.forEach(a=>{
      const ac=(acc(a.nm)||[]).slice(0,4);
      const acts=ac.length?ac:['Diagnóstico por componente con simulacro inicial','Plan de aula con refuerzo focalizado','Banco de preguntas tipo Saber por competencia','Retroalimentación individual y seguimiento de estudiantes en riesgo'];
      P('pmi',`<h2>PMI · ${a.nm}</h2><p class="sub"><span class="tag" style="background:${PCOL[a.pr]}">${a.pr}</span> &nbsp;Brecha ${sg(a.gp)} puntos (${sg(a.rel,0)}%) con el país</p>
      <table class="pmi"><tr><td>Hallazgo y evidencia</td><td>${f1(a.v)} en ${A.ult}; país ${f1(a.p)}${a.d!=null?', departamento '+f1(a.d):''}${a.m!=null?', municipio '+f1(a.m):''}. ${a.t.ok?`Entre ${a.t.desde} y ${a.t.hasta} ${a.t.cum>=0?'subió':'bajó'} ${f1(Math.abs(a.t.cum))} puntos (${sg(a.t.porAnio,2)} por año; ${dirTxt(a.t)}).`:''} Fuente: ICFES.</td></tr>
      <tr><td>Objetivo</td><td>Elevar el promedio de ${a.nm} de ${f1(a.v)} a ${f1(metaArea(a,3))} en tres años, reduciendo la brecha con el país.</td></tr>
      <tr><td>Línea base</td><td>${f1(a.v)} puntos (${A.ult}, ${f0(A.u.n)} evaluados).</td></tr>
      <tr><td>Metas</td><td><b>1 año (${A.ult+1}):</b> ${f1(metaArea(a,1))} · <b>3 años (${A.ult+3}):</b> ${f1(metaArea(a,3))}</td></tr>
      <tr><td>Indicador y fórmula</td><td>Promedio institucional en ${a.nm} (0–100). Avance = (resultado actual − línea base) ÷ (meta − línea base) × 100. Complementario: % de estudiantes con puntaje ≥ promedio nacional en el simulacro del periodo.</td></tr>
      <tr><td>Actividades</td><td><ul style="margin:0">${acts.map(x=>`<li>${e(x)}</li>`).join('')}</ul></td></tr>
      <tr><td>Responsables</td><td>${res(a).map(e).join(' · ')}</td></tr>
      <tr><td>Recursos</td><td>Horas de refuerzo en la jornada, simulacros y banco de preguntas en AULA360, material impreso por estudiante, tiempo de planeación de área.</td></tr>
      <tr><td>Cronograma</td><td>T1: diagnóstico y plan de aula · T2: refuerzo focalizado y 1.er simulacro · T3: 2.º simulacro y ajustes · T4: simulacro final, balance y metas del año siguiente.</td></tr>
      <tr><td>Seguimiento y evidencia</td><td>Resultados de simulacros por trimestre, actas del consejo académico, planes de aula, listados de asistencia a refuerzos.</td></tr>
      <tr><td>Estado / avance</td><td>Pendiente · 0 % <span class="note">(se actualiza en cada seguimiento)</span></td></tr></table>`);
    });
  }
  /* --- Conclusiones --- */
  if(on('conclusiones')){
    const t=A.tg;
    P('conclusiones',`<h2>Conclusiones y recomendaciones</h2><p class="sub">Resumen para la toma de decisiones</p>
    <h3>Conclusiones</h3><ul>${hallazgos(A).slice(0,4).map(x=>`<li>${x}</li>`).join('')}${A.proy.ok?`<li>Si la tendencia reciente se mantuviera, el puntaje global de ${A.ult+1} estaría cerca de ${f0(A.proy.esc[0].tend.v)} (rango ${f0(A.proy.esc[0].tend.lo)}–${f0(A.proy.esc[0].tend.hi)}); es una estimación con alta incertidumbre.</li>`:''}</ul>
    <h3>Recomendaciones</h3><ul><li>Aprobar el Plan de Mejoramiento en consejo académico y asignar un responsable por prueba prioritaria${A.orden.filter(a=>a.ord<=1).length?' ('+A.orden.filter(a=>a.ord<=1).map(a=>a.nm).join(', ')+')':''}.</li><li>Medir el avance con simulacros trimestrales y comparar con la línea base de este informe.</li><li>Socializar los resultados con docentes, estudiantes y familias, destacando las metas a 1 año.</li>${A.muestra!=='adecuada'?'<li>Complementar este análisis con los resultados internos de simulacros, dado el tamaño reducido de la cohorte.</li>':''}<li>Actualizar este informe cuando el ICFES publique el siguiente año.</li></ul>
    ${ctx.obs?`<h3>Observaciones de la institución</h3><div class="box b" style="white-space:pre-wrap">${e(ctx.obs)}</div>`:''}
    <div class="sig"><div>Rector(a)</div><div>Coordinación académica</div></div>`);
  }
  /* --- Anexos --- */
  if(on('anexos')){
    const bloque=(tit,arr)=>arr&&arr.length?`<tr><td colspan="${A.an.length+1}" style="background:#e2e8f0"><b>${tit}</b></td></tr>`:'';
    const SER=[['Institución',A.r.pri],['Municipio',A.r.mun],['Departamento',A.r.dep],['País',A.r.pais]].filter(x=>x[1]&&x[1].length);
    const hdr=`<tr><th>Serie</th>${A.an.map(y=>`<th class="n">${y}</th>`).join('')}</tr>`,cs=A.an.length+1;
    const blk=([k,nmk])=>`<tr><td colspan="${cs}" style="background:#e2e8f0"><b>${nmk}</b></td></tr>`+SER.map(([l,arr])=>`<tr><td>${l}</td>${A.an.map(y=>`<td class="n">${f1(by(arr,y)[k])}</td>`).join('')}</tr>`).join('');
    const ev=`<tr><td colspan="${cs}" style="background:#e2e8f0"><b>Evaluados</b></td></tr>`+SER.map(([l,arr])=>`<tr><td>${l}</td>${A.an.map(y=>`<td class="n">${f0(by(arr,y).n)}</td>`).join('')}</tr>`).join('');
    const G=[['global','Global (0–500)']].concat(AREAS);
    P('anexos',`<h2>Anexo A · Tablas completas (1/2)</h2><p class="sub">Promedios por año (global 0–500; pruebas 0–100)</p><table>${hdr}${G.slice(0,3).map(blk).join('')}</table>`);
    P('anexos',`<h2>Anexo A · Tablas completas (2/2)</h2><p class="sub">Promedios por año y evaluados</p><table>${hdr}${G.slice(3).map(blk).join('')}${ev}</table>`);
    const rm=A.rankMun&&A.rankMun.length?A.rankMun:[];
    P('anexos',`<h2>Anexo B · Glosario, fuentes y advertencias</h2>
    ${rm.length?`<h3>Ranking completo del municipio · ${r.rankAnio||A.ult}${critTxt(r)}</h3><table><tr><th>Puesto</th><th>Establecimiento</th><th class="n">Evaluados</th><th class="n">Global</th></tr>${rm.map((x,i)=>`<tr><td>${i+1}</td><td>${e(clean(x.nombre))}${x.dane===r.dane?' ◀':''}</td><td class="n">${f0(x.n)}</td><td class="n">${f1(x.g)}</td></tr>`).join('')}</table>`:''}
    <h3>Glosario</h3><ul><li><b>Puntaje global:</b> índice de 0 a 500 que pondera las cinco pruebas (Lectura, Matemáticas, Sociales y Naturales con peso 3; Inglés con peso 1).</li><li><b>Brecha:</b> diferencia entre la institución y una referencia; la relativa se expresa como porcentaje de la referencia.</li><li><b>Δ por año:</b> cambio dividido por los años reales transcurridos.</li><li><b>Recta de tendencia:</b> línea de mínimos cuadrados sobre los años reales de la serie.</li><li><b>Banda de incertidumbre (95 %):</b> rango dentro del cual caería el resultado esperado según la variación histórica de la serie.</li><li><b>Fortaleza relativa interna:</b> la prueba más cercana al país dentro de la propia institución.</li></ul>
    <h3>Fuentes y advertencias</h3><ul><li>ICFES · Resultados únicos Saber 11 (datos.gov.co) y archivos oficiales de resultados agregados por establecimiento.</li><li>${A.adv.length?A.adv.map(e).join('</li><li>'):'Sin advertencias adicionales de muestra.'}</li><li>Este informe describe resultados; no establece causas. Informe generado por AULA360 el ${e(emit)}.</li></ul>`);
  }

  /* --- ensamblaje con portada, índice y numeración --- */
  const out=[];
  const logo=Lh.logo?`<img src="${e(Lh.logo)}" alt="">`:'';
  out.push({s:'portada',html:`<div class="sheet cover"><div class="top">${logo}<div><div style="font-weight:700;font-size:12pt">${e(Lh.l1||'')}</div><div style="font-size:8.6pt;opacity:.85">${e([Lh.l2,Lh.l3].filter(Boolean).join(' · '))}</div></div></div><div class="art">${geometria()}</div><div class="tit"><div class="k">INFORME DE RESULTADOS</div><h1>Saber 11</h1><div class="n">${e(nm)}</div><div style="margin-top:3mm;font-size:10.5pt;opacity:.9">Análisis ${per} · Calendario ${e(r.cal||'A')}</div></div><div class="meta"><div><b>${A.colego?'INSTITUCIÓN':'TERRITORIO'}</b>${e(A.colego?((r.ficha&&r.ficha.mcpio)||'')+' · '+((r.ficha&&r.ficha.depto)||''):'')}${A.colego&&r.dane?'<br>DANE '+e(r.dane):''}</div><div><b>EMISIÓN</b>${e(emit)}<br>Documento ${ctx.conf===false?'':'confidencial'}</div><div><b>ELABORADO POR</b>AULA360<br>Análisis estadístico institucional</div></div></div>`});
  const first={};pages.forEach((p,i)=>{if(first[p.s]==null)first[p.s]=i+3}); // portada=1, índice=2
  const toc=SECC.filter(x=>first[x[0]]!=null).map(x=>`<tr><td>${x[1]}</td><td class="n" style="width:14mm">${first[x[0]]}</td></tr>`).join('');
  out.push({s:'indice',html:`<div class="sheet"><HD/><h2>Contenido</h2><p class="sub">Informe Saber 11 · ${e(nm)} · ${per}</p><table class="toc"><tbody>${toc}</tbody></table><div class="box b"><b>Cómo leer este informe</b><ul style="margin:1mm 0 0"><li>Los puntajes globales van de 0 a 500; los de cada prueba, de 0 a 100.</li><li>«Brecha» es la diferencia con una referencia (+ por encima, − por debajo).</li><li>Los colores de prioridad siguen una regla fija explicada en la ficha técnica; el rojo solo aparece en alertas críticas sostenidas.</li><li>Las proyecciones son escenarios estadísticos, no resultados oficiales.</li></ul></div><div class="box"><b>Datos usados.</b> Resultados agregados de Saber 11 publicados por el ICFES (calendario ${e(r.cal||'A')}). No se usan datos de estudiantes individuales.</div></div>`});
  pages.forEach(p=>out.push({s:p.s,html:`<div class="sheet"><HD/>${p.html}</div>`}));
  const total=out.length;
  const html=out.map((p,i)=>p.s==='portada'?p.html:p.html.replace('<HD/>',`<div class="hd"><span><b>${e(Lh.l1||'AULA360')}</b> · Informe Saber 11 · Cal. ${e(r.cal||'A')} · ${per}</span><span>Documento confidencial</span></div>`).replace(/<\/div>$/,`<div class="ft"><span>AULA360 · Análisis estadístico institucional · ${e(emit)}</span><span>Página ${i+1} de ${total}</span></div></div>`)).join('');
  return{css:CSS,body:html,pages:total,A,doc:`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Informe Saber 11 · ${e(nm)}</title><style>${CSS}</style></head><body>${html}<script>(function(){function z(){var w=window.innerWidth,k=Math.min(1,(w-8)/794);document.body.style.zoom=k}z();addEventListener('resize',z);addEventListener('beforeprint',function(){document.body.style.zoom=1});addEventListener('afterprint',z)})()<\/script></body></html>`};
}
const API={build,analizar,ols,pred,tendencia,prioridad,metaArea,clean,f1,sg,SECC,AREAS};
if(typeof module!=='undefined'&&module.exports)module.exports=API;
root.ANAM=API;
})(typeof window!=='undefined'?window:globalThis);
