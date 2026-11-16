/* AULA360 — Diplomas, certificados de estudio, carnés estudiantiles y menciones de honor.
   Usa el listado de estudiantes que el colegio ya subió (colegio_estudiantes) y el membrete/logo de la institución (LH).
   Solo rector y coordinador. No crea tablas: todo se genera en pantalla y se imprime o guarda como PDF. */
window.CST=(function(){
const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const R=()=>render();
const isDir=()=>M&&(M.role==='rector'||M.role==='coordinador');
const gl=g=>g===0?'Transición':g+'°';
const gg=(g,gr)=>g==null?(gr||''):(gr&&String(gr).startsWith(String(g))?String(gr).replace(/^(\d+)-?0*(\d+)$/,'$1° — grupo $2').replace(/^(\d+)°? — grupo (\d+)$/,'$1° — grupo $2'):gl(g)+(gr?' · grupo '+gr:''));
const MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const hoyISO=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Bogota'});
const fechaLarga=iso=>{const d=new Date((iso||hoyISO())+'T12:00:00');return `a los ${d.getDate()} días del mes de ${MESES[d.getMonth()]} de ${d.getFullYear()}`};
const fechaCorta=iso=>{const d=new Date((iso||hoyISO())+'T12:00:00');return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`};
const DIPG=[0,5,9,11];
const MOTIVOS={
  estudiantes:['Excelencia académica','Mejor puntaje en las pruebas Saber','Esfuerzo y superación personal','Mejor desempeño deportivo','Talento artístico y cultural','Excelente convivencia y valores','Liderazgo y participación'],
  docentes:['Trayectoria y labor docente','Compromiso con la formación de los estudiantes','Innovación pedagógica','Años de servicio a la institución','Mejores resultados de sus estudiantes'],
  administrativos:['Servicio y compromiso con la institución','Años de servicio a la institución','Colaboración y buen trato a la comunidad','Responsabilidad y puntualidad'],
  padres:['Compromiso y acompañamiento a sus hijos','Colaboración con la institución','Participación en el gobierno escolar','Apoyo a las actividades institucionales']};
let Z={t:'dipl',est:[],cargado:false,grado:'',grupo:'',sel:new Set(),manual:'',fecha:hoyISO(),ciudad:'',rector:'',secre:'',res:'',modal:'Académico',
  cert:{tipo:'actual',anio:new Date().getFullYear(),obs:''},
  mc:{persona:'estudiantes',motivo:MOTIVOS.estudiantes[0],otro:'',nombres:'',staff:[]},busy:false};
const inp='style="width:100%;border:1.5px solid #cbd5e1;border-radius:10px;padding:9px;font-size:14px;background:#fff"';
function ctx(){const L=(typeof LH==='function')?LH():{l1:'',l2:'',l3:'',logo:''};
  return{l1:L.l1||(M&&M.school_name)||'',l2:L.l2||'',l3:L.l3||'',logo:L.logo&&typeof LOGO!=='undefined'?LOGO+encodeURI(L.logo):'',hoja:!!L.hoja}}
async function load(t){
  Z.t=t==='mencion'?'menc':(Z.t==='menc'&&t!=='mencion'?'dipl':Z.t);
  if(!Z.rector&&M&&M.role==='rector')Z.rector=M.full_name||'';
  if(!Z.ciudad){const c=ctx().l2;Z.ciudad=(c||'').split(',')[0].trim()}
  if(Z.cargado)return;
  const r=await sb.from('colegio_estudiantes').select('id,grado,grupo,full_name,document').order('grado').order('grupo').order('full_name').limit(5000);
  if(r.error)throw r.error;Z.est=r.data||[];Z.cargado=true;
}
/* ---------- selección de estudiantes ---------- */
const gradosDisp=()=>[...new Set(Z.est.map(x=>x.grado))].sort((a,b)=>a-b);
const gruposDisp=()=>[...new Set(Z.est.filter(x=>String(x.grado)===String(Z.grado)).map(x=>x.grupo))].sort();
const filtrados=()=>Z.est.filter(x=>(Z.grado===''||String(x.grado)===String(Z.grado))&&(!Z.grupo||x.grupo===Z.grupo));
function elegidos(){
  const l=filtrados().filter(x=>Z.sel.has(x.id)).map(x=>({n:x.full_name,d:x.document,g:x.grado,gr:x.grupo}));
  Z.manual.split('\n').map(s=>s.trim()).filter(Boolean).forEach(s=>{const p=s.split(/[,;\t]/);l.push({n:p[0].trim(),d:(p[1]||'').trim(),g:Z.grado===''?null:+Z.grado,gr:Z.grupo||''})});
  return l;
}
/* ---------- piezas de diseño ---------- */
const CSS_CE=`.ce{font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;line-height:1.7;color:#000;padding:0 .3cm}.ce .lh{display:flex;align-items:center;gap:12px;border-bottom:2px solid #000;padding-bottom:5px;margin-bottom:12px}.ce .lh img{height:60px}.ce .lh div{flex:1;text-align:center;line-height:1.3}.ce .lh b{font-size:13pt}
.ce h2{text-align:center;font-size:14pt;margin:22px 0 4px;letter-spacing:.05em}.ce .rc{text-align:center;font-weight:700;margin-bottom:22px}.ce p{text-align:justify;margin:0 0 14px}.ce .sg{margin-top:70px;display:flex;gap:50px;text-align:center}.ce .sg div{flex:1;border-top:1px solid #000;padding-top:4px;font-size:10.5pt}
.ce.pg{page-break-after:always;break-after:page;min-height:24cm}.ce.pg:last-child{page-break-after:auto}`;
const CSS=`*{box-sizing:border-box}html{-webkit-print-color-adjust:exact;print-color-adjust:exact}body{margin:0;font-family:Georgia,'Times New Roman',serif;color:#1f2937;background:#cbd5e1}
.dp{width:27.94cm;height:21.59cm;position:relative;overflow:hidden;background:#fffdf8;margin:0 auto 8px;page-break-after:always;break-after:page;font-family:'EB Garamond','Palatino Linotype','Book Antiqua',Georgia,serif;color:#27324a}
.dp:last-child{page-break-after:auto;break-after:auto}
.dp .bg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}.dp .bg svg{width:20cm;height:20cm}
.dp .wm{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}
.dp .wm img{width:12cm;opacity:.10}.dp .wm div{font:700 36pt 'Cinzel',Georgia,serif;opacity:.06;transform:rotate(-25deg);text-align:center;width:22cm;color:#12306b}
.dp .fr{position:absolute;inset:.55cm;border:.28cm solid #12306b}.dp .fr2{position:absolute;inset:.95cm;border:1.5px solid #b8892b}.dp .fr3{position:absolute;inset:1.15cm;border:.5px solid #b8892b}
.dp .co{position:absolute;width:3cm;height:3cm}.dp .co svg{width:100%;height:100%;display:block}.dp .co.q1{left:.75cm;top:.75cm}.dp .co.q2{right:.75cm;top:.75cm;transform:scaleX(-1)}.dp .co.q3{left:.75cm;bottom:.75cm;transform:scaleY(-1)}.dp .co.q4{right:.75cm;bottom:.75cm;transform:scale(-1,-1)}
.dp .c{position:absolute;inset:1.5cm 2.6cm 1.3cm;text-align:center;display:flex;flex-direction:column;align-items:center}
.dp .lg{height:2.6cm;margin-bottom:.15cm}.dp .ins{font:700 17pt 'Cinzel',Georgia,serif;color:#12306b;letter-spacing:.07em;text-transform:uppercase;line-height:1.2}.dp .sub{font-size:10.5pt;color:#55607a;margin-top:.08cm;letter-spacing:.03em}
.dp .dv{width:9cm;height:.5cm;margin:.28cm 0 .05cm}
.dp .tt{font:700 33pt 'Cinzel',Georgia,serif;color:#12306b;letter-spacing:.09em;margin:.3cm 0 0;text-transform:uppercase;line-height:1.15}.dp .t2{font:600 12.5pt 'Cinzel',Georgia,serif;color:#a67c1f;letter-spacing:.2em;text-transform:uppercase;margin-top:.12cm}
.dp .tx{font-size:15.5pt;line-height:1.55;margin:.45cm 1.2cm;color:#33405c}.dp .tx.s{font-size:12.5pt;color:#55607a;margin-top:.15cm}
.dp .nm{font:400 46pt 'Great Vibes','Monotype Corsiva','Apple Chancery','Lucida Calligraphy','Brush Script MT',cursive;color:#12306b;margin:.5cm 0 0;padding:0 1.5cm;line-height:1.15;border-bottom:1.2px solid #b8892b;min-width:14cm}
.dp .id{font-size:12pt;color:#55607a;margin:.12cm 0 .1cm}
.dp .fm{position:absolute;left:1.2cm;right:1.2cm;bottom:.2cm;display:flex;justify-content:space-between;align-items:flex-end;font-size:12pt}.dp .fm>div{width:7.6cm;border-top:1.2px solid #12306b;padding-top:.12cm;text-align:center}.dp .fm b{display:block;font-weight:600}.dp .fm .se{border:0;width:3.6cm;padding:0;height:3.6cm;position:relative;top:.15cm}
.cd{width:8.56cm;height:5.4cm;border:.6pt solid #94a3b8;border-radius:.3cm;overflow:hidden;position:relative;background:#fff;font-family:Arial,Helvetica,sans-serif}
.cd .bn{background:#1e3a8a;color:#fff;padding:.18cm .3cm;display:flex;gap:.2cm;align-items:center;height:1.35cm}.cd .bn img{height:1cm;background:#fff;border-radius:.1cm;padding:.04cm}.cd .bn b{font-size:7.4pt;line-height:1.15;text-transform:uppercase}.cd .bn i{display:block;font-size:6pt;font-style:normal;opacity:.85}
.cd .ph{position:absolute;left:.3cm;top:1.65cm;width:2.1cm;height:2.7cm;border:.6pt dashed #94a3b8;font-size:6pt;color:#94a3b8;display:flex;align-items:center;justify-content:center;text-align:center}
.cd .ds{position:absolute;left:2.7cm;right:.25cm;top:1.65cm}.cd .ds .t{font-size:6.5pt;color:#64748b;letter-spacing:.1em}.cd .ds .n{font-size:10pt;font-weight:700;color:#1e3a8a;line-height:1.15;margin:.05cm 0 .12cm}.cd .ds .r{font-size:7.5pt;line-height:1.5}
.cd .pie{position:absolute;left:0;right:0;bottom:0;background:#b8892b;color:#fff;font-size:6.5pt;text-align:center;padding:.08cm;font-weight:700;letter-spacing:.08em}
.cd.bk{padding:.35cm;font-size:7.4pt;line-height:1.5;color:#334155}.cd.bk h4{margin:0 0 .15cm;color:#1e3a8a;font-size:8.5pt}.cd.bk .fx{position:absolute;left:.5cm;right:.5cm;bottom:.55cm;text-align:center;border-top:.6pt solid #334155;font-size:6.8pt;padding-top:.08cm}
.cdp{display:grid;grid-template-columns:8.56cm 8.56cm;gap:.35cm .5cm;justify-content:center;padding:1.2cm 0;page-break-after:always;background:#fff;align-content:start}
.cdp:last-child{page-break-after:auto}
`+CSS_CE+``;
const GOLD='#b8892b';
function rosette(){let g='';for(let i=0;i<48;i++)g+=`<ellipse cx="200" cy="200" rx="188" ry="70" transform="rotate(${i*3.75} 200 200)"/>`;
  for(let r=40;r<=190;r+=30)g+=`<circle cx="200" cy="200" r="${r}" stroke-width=".6"/>`;
  return`<svg viewBox="0 0 400 400" fill="none" stroke="#12306b" stroke-width=".45" opacity=".075">${g}</svg>`}
function corner(){return`<svg viewBox="0 0 120 120" fill="none" stroke="${GOLD}" stroke-linecap="round"><path stroke-width="2.4" d="M6 114V34Q6 6 34 6H114"/><path stroke-width="1" d="M16 114V40Q16 16 40 16H114"/><path stroke-width="1.6" d="M30 62Q30 30 62 30"/><circle cx="34" cy="34" r="9" stroke-width="1.6"/><circle cx="34" cy="34" r="3.2" fill="${GOLD}"/><path stroke-width="1.2" d="M46 22Q58 22 62 34M22 46Q22 58 34 62"/><path stroke-width="1" d="M70 16q8 6 16 0M16 70q6 8 0 16"/></svg>`}
function divisor(){return`<svg class="dv" viewBox="0 0 300 20" fill="none" stroke="${GOLD}"><path stroke-width="1.2" d="M6 10H128M172 10H294"/><path stroke-width="1" d="M136 10q7-9 14 0q7 9 14 0"/><path fill="${GOLD}" d="M150 3l5 7-5 7-5-7z"/><circle cx="130" cy="10" r="2" fill="${GOLD}"/><circle cx="170" cy="10" r="2" fill="${GOLD}"/></svg>`}
function sello(c){let p='';for(let i=0;i<32;i++){const a=i*Math.PI/16,r=i%2?44:50;p+=(i?'L':'M')+(60+r*Math.cos(a)).toFixed(1)+' '+(60+r*Math.sin(a)).toFixed(1)}
  let st='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?7:17;st+=(i?'L':'M')+(60+r*Math.cos(a)).toFixed(1)+' '+(52+r*Math.sin(a)).toFixed(1)}
  return`<svg viewBox="0 0 120 150" width="100%" height="100%"><defs><linearGradient id="gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1d98c"/><stop offset=".5" stop-color="#c79a35"/><stop offset="1" stop-color="#8f6a14"/></linearGradient><path id="ar" d="M60 60m-33 0a33 33 0 1 1 66 0a33 33 0 1 1 -66 0"/></defs>
   <path d="M38 96L26 148l22-12 12 14 6-50z" fill="#12306b"/><path d="M82 96l12 52-22-12-12 14-6-50z" fill="#1d4a9c"/>
   <path d="${p}Z" fill="url(#gd)" stroke="#8f6a14" stroke-width=".8"/><circle cx="60" cy="60" r="40" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1"/><circle cx="60" cy="60" r="27" fill="#12306b"/>
   <text font-family="Cinzel,Georgia,serif" font-size="6.6" font-weight="700" fill="#12306b" letter-spacing="1.3"><textPath href="#ar" startOffset="2%">ESFUERZO · EXCELENCIA · SUPERACIÓN ·</textPath></text>
   <path d="${st}Z" fill="url(#gd)"/></svg>`}
function marco(c){return`<div class="bg">${rosette()}</div>${c.logo?`<div class="wm"><img src="${e(c.logo)}" alt=""></div>`:''}<div class="fr"></div><div class="fr2"></div><div class="fr3"></div>${['q1','q2','q3','q4'].map(k=>`<div class="co ${k}">${corner()}</div>`).join('')}`}
function cabecera(c){return`${c.logo?`<img class="lg" src="${e(c.logo)}" alt="">`:''}<div class="ins">${e(c.l1)}</div><div class="sub">${e([c.l2,c.l3].filter(Boolean).join(' · '))}</div>${Z.res?`<div class="sub">${e(Z.res)}</div>`:''}${divisor()}`}
function firmas(c){return`<div class="fm"><div><b>${e(Z.rector||'')}</b>Rector(a)</div><div class="se">${sello(c)}</div><div><b>${e(Z.secre||'')}</b>Secretario(a)</div></div>`}
function diploma(p,c){
  const g=p.g!=null?p.g:(Z.grado===''?null:+Z.grado);
  const T={0:['Diploma de Preescolar','Educación Preescolar','ha culminado satisfactoriamente el grado de <b>Transición</b> del nivel de Educación Preescolar, habiendo alcanzado los propósitos de formación previstos para el nivel.'],
   5:['Diploma','Educación Básica Primaria','ha cursado y aprobado satisfactoriamente el <b>quinto grado</b> y, con él, el ciclo de <b>Educación Básica Primaria</b>.'],
   9:['Diploma','Educación Básica Secundaria','ha cursado y aprobado satisfactoriamente el <b>noveno grado</b> y, con él, el ciclo de <b>Educación Básica Secundaria</b>.'],
   11:['Título de Bachiller','Educación Media'+(Z.modal?' · '+Z.modal:''),'ha cursado y aprobado todos los grados de la Educación Básica y Media y cumplido los requisitos de ley, por lo cual se le confiere el título de <b>BACHILLER'+(Z.modal?' '+e(Z.modal).toUpperCase():'')+'</b>.']}[g]||['Diploma','',''];
  return`<div class="dp">${marco(c)}<div class="c">${cabecera(c)}
   <div class="tt">${T[0]}</div><div class="t2">${T[1]}</div>
   <div class="tx s" style="margin-top:.5cm">El rector y el consejo directivo, en uso de sus atribuciones legales y conforme a la Ley 115 de 1994, hacen constar que</div>
   <div class="nm">${e(titulo(p.n))}</div><div class="id">${p.d?'Documento de identidad N.º '+e(p.d):''}</div>
   <div class="tx" style="margin-top:.4cm">${T[2]}</div><div class="tx s">Se expide en ${e(Z.ciudad||'__________')}, ${fechaLarga(Z.fecha)}.</div>${firmas(c)}</div></div>`}
function mencion(n,c){
  const mot=Z.mc.otro.trim()||Z.mc.motivo;
  return`<div class="dp">${marco(c)}<div class="c">${cabecera(c)}
   <div class="tt" style="font-size:36pt;margin-top:.2cm">Mención de Honor</div>
   <div class="tx s" style="margin-top:.45cm">La institución educativa otorga la presente mención a</div>
   <div class="nm">${e(titulo(n))}</div>
   <div class="tx" style="margin-top:.55cm">en reconocimiento a su <b>${e(mot.charAt(0).toLowerCase()+mot.slice(1))}</b>, con la gratitud y el orgullo de toda la comunidad educativa.</div>
   <div class="tx s">${e(Z.ciudad||'__________')}, ${fechaCorta(Z.fecha)}.</div>${firmas(c)}</div></div>`}
const titulo=n=>String(n||'').toLowerCase().replace(/(^|[\s\-'])([a-záéíóúñü])/g,(m,a,b)=>a+b.toUpperCase());
function carnes(l,c){
  const anio=new Date(Z.fecha+'T12:00:00').getFullYear();let out='';
  for(let i=0;i<l.length;i+=4){
    out+=`<div class="cdp">`+l.slice(i,i+4).map(p=>`<div class="cd"><div class="bn">${c.logo?`<img src="${e(c.logo)}" alt="">`:''}<b>${e(c.l1)}<i>Carné estudiantil</i></b></div><div class="ph">FOTO<br>3 × 4</div><div class="ds"><div class="t">ESTUDIANTE</div><div class="n">${e((p.n||'').toUpperCase())}</div><div class="r">${p.d?'<b>Documento:</b> '+e(p.d)+'<br>':''}${p.g!=null?'<b>Grado:</b> '+e(gg(p.g,p.gr))+'<br>':''}<b>Año lectivo:</b> ${anio}</div></div><div class="pie">${e((c.l2||'').toUpperCase())||'AULA360'}</div></div>
      <div class="cd bk"><h4>${e(c.l1)}</h4>Este carné es personal e intransferible y acredita al portador como estudiante de la institución durante el año ${anio}.<br><br>Si lo encuentra, por favor devuélvalo a:<br><b>${e(c.l1)}</b><br>${e([c.l2,c.l3].filter(Boolean).join(' · '))}<div class="fx">${e(Z.rector||'')}<br>Rector(a)</div></div>`).join('')+`</div>`}
  return out}
function certificado(p,c){
  const cab=c.hoja?'':`<div class="lh">${c.logo?`<img src="${e(c.logo)}" alt="">`:''}<div><b>${e(c.l1)}</b><br>${e(c.l2)}${c.l3?'<br>'+e(c.l3):''}</div></div>`;
  const g=p.g!=null?gg(p.g,p.gr):'__________',a=Z.cert.anio;
  const cuerpo=Z.cert.tipo==='aprobo'?`cursó y <b>aprobó</b> el grado <b>${e(g)}</b> en el año lectivo <b>${a}</b>`:`se encuentra <b>matriculado(a)</b> y cursa el grado <b>${e(g)}</b> en el año lectivo <b>${a}</b>`;
  return`<div class="ce pg">${cab}<h2>EL RECTOR(A) DE ${e((c.l1||'LA INSTITUCIÓN').toUpperCase())}</h2><div class="rc">${Z.res?e(Z.res):''}</div>
   <h2 style="margin-top:6px">CERTIFICA</h2>
   <p>Que <b>${e((p.n||'').toUpperCase())}</b>${p.d?`, identificado(a) con el documento N.º <b>${e(p.d)}</b>,`:''} ${cuerpo}, en esta institución${Z.cert.tipo==='aprobo'?'':', jornada diurna'}.</p>
   ${Z.cert.obs?`<p>${e(Z.cert.obs)}</p>`:''}
   <p>Se expide a solicitud del interesado en ${e(Z.ciudad||'__________')}, ${fechaLarga(Z.fecha)}.</p>
   <div class="sg"><div><b>${e(Z.rector||'')}</b><br>Rector(a)</div><div><b>${e(Z.secre||'')}</b><br>Secretario(a)</div></div></div>`}
/* ---------- documento completo ---------- */
function docHtml(){
  const c=ctx(),l=Z.t==='menc'?null:elegidos();
  let body='',orient='landscape';
  if(Z.t==='dipl')body=l.map(p=>diploma(p,c)).join('');
  else if(Z.t==='carn'){body=carnes(l,c);orient='portrait'}
  else if(Z.t==='cert'){body=l.map(p=>certificado(p,c)).join('');orient='portrait'}
  else{const ns=Z.mc.nombres.split('\n').map(s=>s.trim()).filter(Boolean).concat(Z.mc.staff.filter(s=>s.on).map(s=>s.n));body=ns.map(n=>mencion(n,c)).join('')}
  return{body,orient,n:body?(Z.t==='menc'?Z.mc.nombres.split('\n').filter(s=>s.trim()).length+Z.mc.staff.filter(s=>s.on).length:l.length):0}
}
const full=(d)=>`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${Z.t==='dipl'?'Diplomas':Z.t==='cert'?'Certificados de estudio':Z.t==='carn'?'Carnés estudiantiles':'Menciones de honor'}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Great+Vibes&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap"><style>@page{size:${d.orient==='landscape'?'27.94cm 21.59cm':'21.59cm 27.94cm'};margin:0}${CSS}${d.orient==='portrait'&&Z.t==='cert'?'@page{margin:2cm}.ce.pg{min-height:auto}':''}${d.orient==='landscape'?'':'body{background:#e2e8f0}'}</style></head><body>${d.body}<script>(function(){function z(){var w=innerWidth,k=Math.min(1,(w-8)/${d.orient==='landscape'?1056:820});document.body.style.zoom=k}z();addEventListener('resize',z);addEventListener('beforeprint',function(){document.body.style.zoom=1});addEventListener('afterprint',z)})()<\/script></body></html>`;
function validar(){const d=docHtml();if(!d.n){toast('⚠️',Z.t==='menc'?'Escribe al menos un nombre':'Elige al menos un estudiante',Z.t==='menc'?'Un nombre por línea.':'Marca estudiantes en la lista o escribe nombres abajo.');return null}return d}
function vista(){const d=validar();if(!d)return;
  document.getElementById('cst-prev')?.remove();const m=document.createElement('div');m.id='cst-prev';m.style.cssText='position:fixed;inset:0;z-index:200;background:#0008;display:flex;justify-content:center;padding:10px';
  m.innerHTML=`<div style="background:#fff;border-radius:14px;max-width:1100px;width:100%;height:calc(100vh - 20px);display:flex;flex-direction:column;padding:10px"><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:8px"><b>Vista previa · ${d.n} documento(s)</b><div style="display:flex;gap:6px"><button onclick="CST.imprimir()" style="background:#16a34a;color:#fff;padding:8px 14px;border-radius:10px;font-weight:800">🖨️ Imprimir / guardar PDF</button><button onclick="document.getElementById('cst-prev').remove()" style="background:#e2e8f0;padding:8px 14px;border-radius:10px;font-weight:700">Cerrar</button></div></div><iframe id="cst-if" style="flex:1;border:1px solid #e2e8f0;border-radius:8px;width:100%"></iframe></div>`;
  document.body.appendChild(m);document.getElementById('cst-if').srcdoc=full(d)}
async function imprimir(){
  const d=validar();if(!d)return;
  if(Z.t==='cert'&&typeof doPrint==='function'){ // los certificados llevan código institucional y hoja membretada
    const c=ctx();document.getElementById('cst-prev')?.remove();
    return doPrint(`<style>${CSS_CE.replace(/\.ce/g,'#printarea .ce')}</style>`+d.body,{tipo:'CER',titulo:'Certificados de estudio',hoja:true})}
  document.getElementById('cst-pr')?.remove();const f=document.createElement('iframe');f.id='cst-pr';f.style.cssText='position:fixed;left:-9999px;top:0;width:'+(d.orient==='landscape'?'27.94cm':'21.59cm')+';height:21cm;border:0';f.srcdoc=full(d);
  f.onload=async()=>{try{const im=[...f.contentDocument.images];await Promise.all(im.map(x=>x.complete?1:new Promise(r=>{x.onload=x.onerror=r;setTimeout(r,6000)})));try{await Promise.race([f.contentDocument.fonts.ready,new Promise(r=>setTimeout(r,3000))])}catch(x){}f.contentWindow.focus();f.contentWindow.print()}catch(x){err(x)}};
  document.body.appendChild(f)}
/* ---------- pantalla ---------- */
const TABS=[['dipl','🎓 Diplomas'],['cert','📄 Certificados de estudio'],['carn','🪪 Carnés'],['menc','🏅 Menciones de honor']];
function listaEst(){
  if(!Z.cargado)return'';
  const g=gradosDisp(),L=filtrados(),all=L.length&&L.every(x=>Z.sel.has(x.id));
  const grs=Z.t==='dipl'?g.filter(x=>DIPG.includes(x)):g;
  return`<div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
   <label style="font-size:13px;font-weight:700">Grado<select ${inp} onchange="CST.setGrado(this.value)"><option value="">${Z.t==='dipl'?'Elige…':'Todos'}</option>${(Z.t==='dipl'?DIPG:g).map(x=>`<option value="${x}" ${String(Z.grado)===String(x)?'selected':''}>${gl(x)}${g.includes(x)?'':' (sin lista)'}</option>`).join('')}</select></label>
   <label style="font-size:13px;font-weight:700">Grupo<select ${inp} onchange="CST.setGrupo(this.value)"><option value="">Todos</option>${gruposDisp().map(x=>`<option ${Z.grupo===x?'selected':''}>${e(x)}</option>`).join('')}</select></label></div>
   ${Z.est.length?`<div style="margin-top:10px;border:1px solid #e2e8f0;border-radius:10px;max-height:260px;overflow:auto;padding:8px"><label style="display:block;font-size:13px;font-weight:700;border-bottom:1px solid #e2e8f0;padding-bottom:5px;margin-bottom:4px"><input type="checkbox" ${all?'checked':''} onchange="CST.todos(this.checked)"> Todos los de esta lista (${L.length})</label>${L.map(x=>`<label style="display:block;font-size:13px;padding:2px 0"><input type="checkbox" ${Z.sel.has(x.id)?'checked':''} onchange="CST.uno('${x.id}',this.checked)"> ${e(x.full_name)} <span style="color:#64748b">· ${gl(x.grado)} ${e(x.grupo)}${x.document?' · '+e(x.document):''}</span></label>`).join('')||'<p style="font-size:13px;color:#64748b">No hay estudiantes en ese grado o grupo.</p>'}</div>`:`<p style="font-size:13px;color:#b45309;margin-top:8px">Aún no hay listado de estudiantes cargado en tu colegio (se sube en «Listados de estudiantes»). Mientras tanto puedes escribir los nombres aquí abajo.</p>`}
   <label style="display:block;font-size:13px;font-weight:700;margin-top:10px">Otros nombres (opcional): uno por línea, y si quieres el documento después de una coma<textarea rows="3" ${inp} placeholder="Ana María Pérez Rivas, 1234567890" oninput="CST.set('manual',this.value)">${e(Z.manual)}</textarea></label>`}
function campos(){
  const f=(k,l,ph,tp)=>`<label style="font-size:13px;font-weight:700">${l}<input ${inp} type="${tp||'text'}" value="${e(Z[k])}" placeholder="${ph||''}" oninput="CST.set('${k}',this.value)"></label>`;
  return`<div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin-top:10px">${f('fecha','Fecha del documento','','date')}${f('ciudad','Ciudad','Condoto')}${f('rector','Nombre del rector(a)','')}${Z.t==='carn'?'':f('secre','Nombre del secretario(a)','')}${Z.t==='carn'?'':f('res','Resolución de aprobación (opcional)','Resolución 1234 de 2010')}
   ${Z.t==='dipl'&&String(Z.grado)==='11'?`<label style="font-size:13px;font-weight:700">Modalidad<select ${inp} onchange="CST.set('modal',this.value)">${['Académico','Técnico','Comercial','Técnico Comercial','Agropecuario','Industrial','Pedagógico',''].map(x=>`<option value="${e(x)}" ${Z.modal===x?'selected':''}>${x||'(sin modalidad)'}</option>`).join('')}</select></label>`:''}</div>`}
function vCert(){return`<div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin-top:10px"><label style="font-size:13px;font-weight:700">Tipo de certificado<select ${inp} onchange="CST.setC('tipo',this.value)"><option value="actual" ${Z.cert.tipo==='actual'?'selected':''}>Está matriculado(a) y cursa el grado</option><option value="aprobo" ${Z.cert.tipo==='aprobo'?'selected':''}>Cursó y aprobó el grado</option></select></label><label style="font-size:13px;font-weight:700">Año lectivo<input ${inp} type="number" value="${Z.cert.anio}" oninput="CST.setC('anio',this.value)"></label></div><label style="display:block;font-size:13px;font-weight:700;margin-top:10px">Observaciones (opcional)<textarea rows="2" ${inp} oninput="CST.setC('obs',this.value)">${e(Z.cert.obs)}</textarea></label>`}
function vMenc(){const m=Z.mc;return`<div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))"><label style="font-size:13px;font-weight:700">¿A quién?<select ${inp} onchange="CST.setP(this.value)">${[['estudiantes','Estudiantes'],['docentes','Docentes'],['administrativos','Administrativos'],['padres','Padres de familia']].map(x=>`<option value="${x[0]}" ${m.persona===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></label><label style="font-size:13px;font-weight:700">Motivo del reconocimiento<select ${inp} onchange="CST.setM('motivo',this.value)">${MOTIVOS[m.persona].map(x=>`<option ${m.motivo===x?'selected':''}>${e(x)}</option>`).join('')}</select></label></div>
   <label style="display:block;font-size:13px;font-weight:700;margin-top:10px">O escribe tu propio motivo (opcional)<input ${inp} value="${e(m.otro)}" oninput="CST.setM('otro',this.value)" placeholder="su destacada participación en…"></label>
   ${m.persona==='docentes'?`<div style="margin-top:10px"><button onclick="CST.traerDoc()" style="background:#e8f1ff;color:#1e3a8a;padding:8px 12px;border-radius:9px;font-weight:700;font-size:13px">👩‍🏫 Traer docentes de mi colegio</button>${m.staff.length?`<div style="margin-top:6px;border:1px solid #e2e8f0;border-radius:10px;max-height:180px;overflow:auto;padding:8px">${m.staff.map((s,i)=>`<label style="display:block;font-size:13px"><input type="checkbox" ${s.on?'checked':''} onchange="CST.staff(${i},this.checked)"> ${e(s.n)}</label>`).join('')}</div>`:''}</div>`:''}
   <label style="display:block;font-size:13px;font-weight:700;margin-top:10px">Nombres (uno por línea)<textarea rows="4" ${inp} oninput="CST.setM('nombres',this.value)" placeholder="Nombre completo de cada persona">${e(m.nombres)}</textarea></label>`}
function view(){
  if(!isDir())return'<div class="aic-card" style="padding:18px">Este módulo es para rector y coordinador.</div>';
  const t=Z.t,ayuda={dipl:'Diplomas para Preescolar (Transición), 5.°, 9.° y 11.° (Título de Bachiller). Llevan el logo de la institución como marca de agua y se imprimen en hoja horizontal.',cert:'Certificados de estudio para cualquier grado. Salen en hoja membretada con el código de documento de AULA360.',carn:'Carnés con tamaño de tarjeta (8,6 × 5,4 cm), frente y reverso lado a lado, 4 por hoja. Se pega la foto en el recuadro.',menc:'Menciones de honor para estudiantes, docentes, administrativos y padres de familia, con la marca de agua de la institución.'}[t];
  return`<div style="display:grid;gap:14px"><div class="aic-card" style="padding:18px"><h2 style="font-weight:800;font-size:19px">🎓 Diplomas, certificados, carnés y menciones</h2>
   <div style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0">${TABS.map(x=>`<button onclick="CST.tab('${x[0]}')" style="padding:9px 14px;border-radius:10px;font-weight:800;border:1.5px solid ${t===x[0]?'#1e63e9':'#cbd5e1'};background:${t===x[0]?'#e8f1ff':'#fff'};color:${t===x[0]?'#1e3a8a':'#334155'}">${x[1]}</button>`).join('')}</div>
   <p style="font-size:13px;color:#64748b;margin-bottom:10px">${ayuda}</p>
   ${t==='menc'?vMenc():listaEst()}${t==='cert'?vCert():''}${campos()}
   <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px"><button onclick="CST.vista()" style="background:#1e63e9;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">👁 Vista previa</button><button onclick="CST.imprimir()" style="background:#16a34a;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">🖨️ Imprimir / guardar PDF</button></div>
   <p style="font-size:12px;color:#64748b;margin-top:8px">Se toman el nombre, el logo y los datos de la institución del membrete que ya configuraste. Para guardar en PDF, en la ventana de impresión elige «Guardar como PDF».</p></div></div>`}
return{load,view,vista,imprimir,_t:{docHtml,full,elegidos,Z:()=>Z},
  tab(t){Z.t=t;if(t==='dipl'&&!DIPG.includes(+Z.grado))Z.grado='';R()},
  set(k,v){Z[k]=v},setC(k,v){Z.cert[k]=k==='anio'?+v:v},setM(k,v){Z.mc[k]=v},
  setP(p){Z.mc.persona=p;Z.mc.motivo=MOTIVOS[p][0];Z.mc.staff=[];R()},
  setGrado(v){Z.grado=v;Z.grupo='';Z.sel=new Set();R()},setGrupo(v){Z.grupo=v;R()},
  todos(on){filtrados().forEach(x=>on?Z.sel.add(x.id):Z.sel.delete(x.id));R()},uno(id,on){on?Z.sel.add(id):Z.sel.delete(id)},
  async traerDoc(){try{const r=await sb.rpc('directorio_colegio');if(r.error)throw r.error;Z.mc.staff=(r.data||[]).filter(p=>p.role==='prof'||p.role==='coordinador').map(p=>({n:p.full_name,on:false}));if(!Z.mc.staff.length)toast('ℹ️','No hay docentes registrados','Escribe los nombres a mano.');R()}catch(x){err(x)}},
  staff(i,on){Z.mc.staff[i].on=on}}})();
