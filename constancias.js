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
let Z={estilo:'clasico',aut:'',tdoc:'T.I.',expd:'',folio:'',libro:'',acta:'',nr:true,escudo:'',sello:'',t:'dipl',est:[],cargado:false,grado:'',grupo:'',sel:new Set(),manual:'',fecha:hoyISO(),ciudad:'',rector:'',secre:'',res:'',modal:'Académico',
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
const FG="'UnifrakturCook','UnifrakturMaguntia','Old English Text MT','Engravers Old English','DejaVu Serif',Georgia,serif";
const FS="'Cormorant Garamond','EB Garamond','Palatino Linotype',Georgia,serif",FC="'Great Vibes','Monotype Corsiva','Apple Chancery','Lucida Calligraphy','Brush Script MT',cursive";
const CSS_P=`.pt{width:21.59cm;height:27.94cm;position:relative;overflow:hidden;margin:0 auto 8px;page-break-after:always;break-after:page;color:#111;text-align:center}
.pt:last-child{page-break-after:auto;break-after:auto}
.pt .bgx{position:absolute;inset:0}.pt .wmk{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}.pt .wmk img{width:12cm;max-height:12cm;object-fit:contain}
.pt .pc{position:absolute;inset:1cm 1.6cm .9cm;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}
.pt .esc{height:3.5cm;display:flex;align-items:center;justify-content:center;margin-bottom:.3cm}.pt .esc img{max-height:3.5cm;max-width:6cm;object-fit:contain}
.pt .rep{font-size:15pt;line-height:1.15;margin:.2cm 0}.pt .rep small{display:block;font-size:12pt}
.pt .lab{font-size:15pt;margin:.2cm 0 0;line-height:1.2}.pt .ins{font-size:27pt;line-height:1.1;margin:.1cm 0 .05cm;font-weight:700}.pt .mun{font-size:12pt}
.pt .aut{font-size:11pt;line-height:1.35;margin:.25cm 0 .1cm;max-width:16.5cm}
.pt .nm{font-size:32pt;line-height:1.12;margin:.35cm 0 .05cm;max-width:18cm;border-bottom:1px solid #111;padding:0 .5cm .08cm;min-width:12cm}.pt .nm.lg{font-size:23pt}
.pt .idt{font-size:10.5pt;margin:.1cm 0 .2cm}.pt .ttl{font-size:40pt;line-height:1.1;margin:.15cm 0 .2cm;font-weight:700}.pt .ttl.lg{font-size:28pt}
.pt .por{font-size:12.5pt;line-height:1.4;margin:.1cm 0;max-width:16.5cm;font-weight:600}.pt .acta{font-size:9.5pt;margin:.3cm 0 0;line-height:1.5}
.pt .firm{display:flex;width:100%;justify-content:space-between;align-items:flex-end;margin-top:auto;padding-top:.6cm}.pt .firm .fs{width:4.2cm;height:5cm;flex:none;margin-bottom:-.2cm}.pt .firm .fs.v{visibility:hidden}
.pt .firm .fx{flex:1;margin:0 .3cm;border-top:1px solid #111;padding-top:.12cm;font-size:10.5pt;line-height:1.25;min-width:0}.pt .firm .fx b{display:block}
.pt .dado{font-size:11.5pt;margin:.35cm 0 .1cm}.pt .nr{font-size:8pt;margin:0 0 .1cm;color:#333}
.pt.s1,.pt.s3,.pt.s4{font-family:${FG}}.pt.s1 .nm,.pt.s1 .ttl,.pt.s4 .nm,.pt.s4 .ttl{font-weight:400}
.pt.s1{background:radial-gradient(ellipse at center,#fffdf4 0%,#fbf4de 70%,#efe3bd 100%)}.pt.s1 .wmk img{opacity:.08}
.pt.s2{font-family:${FS};background:#fff}.pt.s2 .rep,.pt.s2 .lab{font-style:italic}.pt.s2 .ins{font-size:29pt;font-weight:600}.pt.s2 .nm{font:italic 700 34pt ${FS};border:0;margin-top:.5cm}.pt.s2 .ttl{font:700 42pt ${FS}}.pt.s2 .por{font-weight:500;font-size:13pt}.pt.s2 .wmk img{opacity:.07}
.pt.s3{background-color:#fbf4d6}.pt.s3 .nm{font:400 34pt ${FC};border:0}.pt.s3 .ins{font-weight:400;font-size:25pt}.pt.s3 .wmk img{opacity:.10}
.pt.s4{background:#fff}.pt.s4 .wmk img{opacity:.22;width:14cm;max-height:14cm}.pt.s4 .ins,.pt.s4 .nm,.pt.s4 .ttl{font-weight:400}.pt.s4 .nm{border:0;font-size:36pt}.pt.s4 .nm.lg{font-size:27pt}.pt.s4 .ttl{font-size:42pt}.pt.s4 .ins{font-size:27pt}
.pt.s5{font-family:${FS};background:#eceff2}.pt.s5 .bgx{background:repeating-radial-gradient(circle at 50% 22%,rgba(120,130,145,.16) 0 1px,rgba(255,255,255,.0) 1px 4px),conic-gradient(from 0deg at 50% 22%,#f6f8fa,#d9dee4,#f6f8fa 8%,#d9dee4 16%,#f6f8fa 24%,#d9dee4 32%,#f6f8fa 40%,#d9dee4 48%,#f6f8fa 56%,#d9dee4 64%,#f6f8fa 72%,#d9dee4 80%,#f6f8fa 88%,#d9dee4 96%,#f6f8fa)}
.pt.s5 .ins{font:700 28pt ${FS}}.pt.s5 .nm{font:700 36pt ${FC};border:0;font-weight:400}.pt.s5 .ttl{font:italic 700 40pt ${FS}}.pt.s5 .rep,.pt.s5 .lab{font-style:italic}.pt.s5 .por{font-weight:500;font-style:italic}.pt.s5 .wmk img{opacity:.08}`;
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
`+CSS_CE+CSS_P;
const GOLD='#b8892b';
function rosette(){let g='';for(let i=0;i<48;i++)g+=`<ellipse cx="200" cy="200" rx="188" ry="70" transform="rotate(${i*3.75} 200 200)"/>`;
  for(let r=40;r<=190;r+=30)g+=`<circle cx="200" cy="200" r="${r}" stroke-width=".6"/>`;
  return`<svg viewBox="0 0 400 400" fill="none" stroke="#12306b" stroke-width=".45" opacity=".075">${g}</svg>`}
function corner(){return`<svg viewBox="0 0 120 120" fill="none" stroke="${GOLD}" stroke-linecap="round"><path stroke-width="2.4" d="M6 114V34Q6 6 34 6H114"/><path stroke-width="1" d="M16 114V40Q16 16 40 16H114"/><path stroke-width="1.6" d="M30 62Q30 30 62 30"/><circle cx="34" cy="34" r="9" stroke-width="1.6"/><circle cx="34" cy="34" r="3.2" fill="${GOLD}"/><path stroke-width="1.2" d="M46 22Q58 22 62 34M22 46Q22 58 34 62"/><path stroke-width="1" d="M70 16q8 6 16 0M16 70q6 8 0 16"/></svg>`}
function divisor(){return`<svg class="dv" viewBox="0 0 300 20" fill="none" stroke="${GOLD}"><path stroke-width="1.2" d="M6 10H128M172 10H294"/><path stroke-width="1" d="M136 10q7-9 14 0q7 9 14 0"/><path fill="${GOLD}" d="M150 3l5 7-5 7-5-7z"/><circle cx="130" cy="10" r="2" fill="${GOLD}"/><circle cx="170" cy="10" r="2" fill="${GOLD}"/></svg>`}
function sello(c,tri){let p='';for(let i=0;i<32;i++){const a=i*Math.PI/16,r=i%2?44:50;p+=(i?'L':'M')+(60+r*Math.cos(a)).toFixed(1)+' '+(60+r*Math.sin(a)).toFixed(1)}
  let st='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?7:17;st+=(i?'L':'M')+(60+r*Math.cos(a)).toFixed(1)+' '+(52+r*Math.sin(a)).toFixed(1)}
  const im=Z.selloOff?'':(Z.sello||c.logo);
  const cinta=tri?`<clipPath id="cv"><path d="M40 80H80V148L60 134 40 148Z"/></clipPath><g clip-path="url(#cv)"><rect x="40" y="80" width="20" height="70" fill="#f7d117"/><rect x="60" y="80" width="10" height="70" fill="#1c3f94"/><rect x="70" y="80" width="10" height="70" fill="#d52b1e"/></g>`:`<path d="M38 96L26 148l22-12 12 14 6-50z" fill="#12306b"/><path d="M82 96l12 52-22-12-12 14-6-50z" fill="#1d4a9c"/>`;
  return`<svg viewBox="0 0 120 150" width="100%" height="100%"><defs><linearGradient id="gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1d98c"/><stop offset=".5" stop-color="#c79a35"/><stop offset="1" stop-color="#8f6a14"/></linearGradient><path id="ar" d="M60 60m-33 0a33 33 0 1 1 66 0a33 33 0 1 1 -66 0"/><clipPath id="ci"><circle cx="60" cy="60" r="24"/></clipPath></defs>${cinta}
   <path d="${p}Z" fill="url(#gd)" stroke="#8f6a14" stroke-width=".8"/><circle cx="60" cy="60" r="40" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1"/>
   ${tri&&im?`<circle cx="60" cy="60" r="27" fill="#fff"/><image href="${e(im)}" x="36" y="36" width="48" height="48" preserveAspectRatio="xMidYMid meet" clip-path="url(#ci)"/>`:`<circle cx="60" cy="60" r="27" fill="#12306b"/><text font-family="Cinzel,Georgia,serif" font-size="6.6" font-weight="700" fill="#12306b" letter-spacing="1.3"><textPath href="#ar" startOffset="2%">ESFUERZO · EXCELENCIA · SUPERACIÓN ·</textPath></text><path d="${st}Z" fill="url(#gd)"/>`}</svg>`}
function marco(c){return`<div class="bg">${rosette()}</div>${c.logo?`<div class="wm"><img src="${e(c.logo)}" alt=""></div>`:''}<div class="fr"></div><div class="fr2"></div><div class="fr3"></div>${['q1','q2','q3','q4'].map(k=>`<div class="co ${k}">${corner()}</div>`).join('')}`}
function cabecera(c){const lg=Z.escudoOff?'':(Z.escudo||c.logo);return`${lg?`<img class="lg" src="${e(lg)}" alt="">`:''}<div class="ins">${e(c.l1)}</div><div class="sub">${e([c.l2,c.l3].filter(Boolean).join(' · '))}</div>${Z.res?`<div class="sub">${e(Z.res)}</div>`:''}${divisor()}`}
function firmas(c){return`<div class="fm"><div><b>${e(Z.rector||'')}</b>Rector(a)</div><div class="se">${sello(c)}</div><div><b>${e(Z.secre||'')}</b>Secretario(a)</div></div>`}
const ESTILOS=[['clasico','Clásico gótico','Letra gótica negra sobre papel crema, escudo arriba y sello con cinta tricolor.','s1',true],
 ['serif','Clásico con sello','Letra clásica elegante, fondo blanco, sello dorado con cinta tricolor.','s2',true],
 ['textura','Gótico con fondo de texto','Papel amarillento con el nombre del colegio repetido de fondo y nombre en letra de firma.','s3',true],
 ['moderno','Moderno con logo grande','Letra gótica grande y el logo del colegio como marca de agua a todo color.','s4',false],
 ['plata','Guilloche plateado','Fondo plateado con rayos y ondas de seguridad, letra clásica.','s5',true],
 ['elegante','Elegante horizontal','Marco azul y dorado, rosetón y sello, en hoja horizontal.','',false]];
const esRetrato=()=>Z.estilo!=='elegante';
function fondoTexto(c){const t=(c.l1||'').toUpperCase(),w=520,h=34;let r='';for(let i=0;i<30;i++)r+=`<text x="${i%2?-120:-20}" y="${14+i*h}" font-size="13" font-family="Arial,sans-serif" fill="#7a6a2a" fill-opacity=".16" letter-spacing="1">${(t+' · ').repeat(14)}</text>`;
  return`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 816 1056">${r}</svg>`}
function diplomaP(p,c,est){
  const g=p.g!=null?p.g:(Z.grado===''?null:+Z.grado),st=(ESTILOS.find(x=>x[0]===est)||ESTILOS[0]);
  const T={0:['Diploma de Preescolar','Por haber culminado satisfactoriamente el grado de Transición del nivel de Educación Preescolar, según los planes y programas vigentes.'],
   5:['Básica Primaria','Por haber cursado y aprobado los estudios correspondientes al ciclo de Educación Básica Primaria, según los planes y programas vigentes.'],
   9:['Básica Secundaria','Por haber cursado y aprobado los estudios correspondientes al ciclo de Educación Básica Secundaria, según los planes y programas vigentes.'],
   11:['Bachiller'+(Z.modal?' '+Z.modal:''),'Por haber cursado y aprobado los estudios correspondientes al nivel de Educación Media'+(Z.modal?' '+Z.modal:'')+', según los planes y programas vigentes.']}[g]||['Diploma','Por haber cursado y aprobado los estudios correspondientes, según los planes y programas vigentes.'];
  const mun=(c.l2||'').replace(/,\s*/,' – '),aut=Z.aut||(Z.res?'Autorizada por la Secretaría de Educación, según '+Z.res:''),nombre=titulo(p.n);
  const esc=Z.escudoOff?'':(Z.escudo||c.logo),tri=st[4],wmImg=c.logo||Z.escudo;
  const bg=est==='textura'?`<div class="bgx">${fondoTexto(c)}</div>`:'<div class="bgx"></div>';
  const fi=(k,l)=>Z[k]?`${l} <b>${e(Z[k])}</b>`:`${l} ______`;
  const dt=new Date((Z.fecha||hoyISO())+'T12:00:00');
  return`<div class="pt ${st[3]}">${bg}${wmImg?`<div class="wmk"><img src="${e(wmImg)}" alt=""></div>`:''}<div class="pc">
   <div class="esc">${esc?`<img src="${e(esc)}" alt="">`:''}</div>
   <div class="rep">República de Colombia<small>y en su nombre</small></div>
   <div class="lab">La Institución Educativa</div><div class="ins">${e(c.l1)}</div><div class="mun">${e(mun)}</div>
   ${aut?`<div class="aut">${e(aut)}</div>`:''}
   <div class="lab" style="margin-top:.3cm">Confiere a:</div>
   <div class="nm ${nombre.length>30?'lg':''}">${e(nombre)}</div>
   <div class="idt">${p.d?`Identificado(a) con ${e(Z.tdoc)} No. <b>${e(p.d)}</b>${Z.expd?' de '+e(Z.expd):''}`:'&nbsp;'}</div>
   <div class="lab">El título de:</div><div class="ttl ${T[0].length>22?'lg':''}">${e(T[0])}</div>
   <div class="por">${e(T[1])}</div>
   <div class="acta">${Z.acta?`Acta general de graduación No. <b>${e(Z.acta)}</b> · `:''}${fi('libro','Libro de registro No.')} · ${fi('folio','Folio No.')}</div>
   <div class="firm">${tri?`<div class="fs">${sello(c,true)}</div>`:'<div class="fs v"></div>'}<div class="fx"><b>${e(Z.rector||'')}</b>Rector(a)</div><div class="fx"><b>${e(Z.secre||'')}</b>Secretario(a)</div></div>
   <div class="dado">Dado en ${e(Z.ciudad||'__________')} a los ${dt.getDate()} días del mes de ${MESES[dt.getMonth()]} de ${dt.getFullYear()}</div>
   ${Z.nr?'<div class="nr">No requiere registro, según Decreto No. 921 del 6 de mayo de 1994, expedido por el M.E.N.</div>':''}</div></div>`}
function diploma(p,c){
  if(esRetrato())return diplomaP(p,c,Z.estilo);
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
  if(Z.t==='dipl'){body=l.map(p=>diploma(p,c)).join('');if(esRetrato())orient='portrait'}
  else if(Z.t==='carn'){body=carnes(l,c);orient='portrait'}
  else if(Z.t==='cert'){body=l.map(p=>certificado(p,c)).join('');orient='portrait'}
  else{const ns=Z.mc.nombres.split('\n').map(s=>s.trim()).filter(Boolean).concat(Z.mc.staff.filter(s=>s.on).map(s=>s.n)).concat(Z.mc.persona==='estudiantes'?filtrados().filter(x=>Z.sel.has(x.id)).map(x=>x.full_name):[]);body=ns.map(n=>mencion(n,c)).join('')}
  return{body,orient,n:body?(Z.t==='menc'?Z.mc.nombres.split('\n').filter(s=>s.trim()).length+Z.mc.staff.filter(s=>s.on).length+(Z.mc.persona==='estudiantes'?filtrados().filter(x=>Z.sel.has(x.id)).length:0):l.length):0}
}
const full=(d)=>`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${Z.t==='dipl'?'Diplomas':Z.t==='cert'?'Certificados de estudio':Z.t==='carn'?'Carnés estudiantiles':'Menciones de honor'}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Great+Vibes&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=UnifrakturCook:wght@700&family=UnifrakturMaguntia&family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500;1,700&display=swap"><style>@page{size:${d.orient==='landscape'?'27.94cm 21.59cm':'21.59cm 27.94cm'};margin:0}${CSS}${d.orient==='portrait'&&Z.t==='cert'?'@page{margin:2cm}.ce.pg{min-height:auto}':''}${d.orient==='landscape'?'':'body{background:#e2e8f0}'}</style></head><body>${d.body}<script>(function(){function z(){var w=innerWidth,k=Math.min(1,(w-8)/${d.orient==='landscape'?1056:820});document.body.style.zoom=k}z();addEventListener('resize',z);addEventListener('beforeprint',function(){document.body.style.zoom=1});addEventListener('afterprint',z)})()<\/script></body></html>`;
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
function estiloUi(){
  const f=(k,l,ph,w)=>`<label style="font-size:13px;font-weight:700">${l}<input ${inp} value="${e(Z[k])}" placeholder="${ph||''}" oninput="CST.set('${k}',this.value)"></label>`;
  const st=ESTILOS.find(x=>x[0]===Z.estilo)||ESTILOS[0];
  const c0=ctx();const img=(k,l)=>{const eff=Z[k+'Off']?'':(Z[k]||c0.logo),src=Z[k]?'Imagen subida desde tu computador':Z[k+'Off']?'Sin imagen':(c0.logo?'Tomada del membrete de tu colegio':'Tu membrete no tiene logo');return`<div style="font-size:13px;font-weight:700">${l}<div style="display:flex;gap:8px;align-items:center;margin-top:4px;flex-wrap:wrap">${eff?`<img src="${eff}" style="height:44px;max-width:80px;object-fit:contain;border:1px solid #cbd5e1;border-radius:6px;background:#fff">`:`<span style="width:44px;height:44px;border:1px dashed #cbd5e1;border-radius:6px"></span>`}<div style="font-weight:400;font-size:12px;color:#64748b">${src}</div></div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><label style="background:#e8f1ff;color:#1e3a8a;padding:6px 10px;border-radius:9px;font-weight:700;font-size:12px;cursor:pointer">Subir desde el computador<input type="file" accept="image/*" style="display:none" onchange="CST.img('${k}',this)"></label>${Z[k]||Z[k+'Off']?`<button onclick="CST.membrete('${k}')" style="background:#f1f5f9;padding:6px 10px;border-radius:9px;font-weight:700;font-size:12px">Usar el del membrete</button>`:''}${!Z[k+'Off']?`<button onclick="CST.quitarImg('${k}')" style="background:#f1f5f9;color:#b91c1c;padding:6px 10px;border-radius:9px;font-weight:700;font-size:12px">Sin imagen</button>`:''}</div></div>`};
  return`<div style="border:1.5px solid #e2e8f0;border-radius:12px;padding:12px;margin-bottom:10px"><b style="font-size:14px">Estilo del diploma</b>
   <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px"><select ${inp} style="max-width:320px;border:1.5px solid #cbd5e1;border-radius:10px;padding:9px" onchange="CST.setEstilo(this.value)">${ESTILOS.map(x=>`<option value="${x[0]}" ${Z.estilo===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select><button onclick="CST.estilos()" style="background:#e8f1ff;color:#1e3a8a;padding:9px 12px;border-radius:9px;font-weight:700;font-size:13px">🖼 Ver todos los estilos</button></div>
   <p style="font-size:12px;color:#64748b;margin-top:6px">${e(st[2])}</p>
   ${esRetrato()?`<div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin-top:8px">
    ${f('aut','Texto de autorización (opcional)','Autorizada por la Secretaría de Educación de…, según Resolución No. … del …')}
    <label style="font-size:13px;font-weight:700">Documento del estudiante<select ${inp} onchange="CST.set('tdoc',this.value)">${['T.I.','C.C.','R.C.','C.E.'].map(x=>`<option ${Z.tdoc===x?'selected':''}>${x}</option>`).join('')}</select></label>
    ${f('expd','Documento expedido en','Condoto')}${f('acta','Acta de graduación No.','')}${f('libro','Libro de registro No.','')}${f('folio','Folio No.','')}
    ${img('escudo','Escudo superior')}${img('sello','Imagen del sello')}</div>
    <label style="display:block;font-size:13px;margin-top:8px"><input type="checkbox" ${Z.nr?'checked':''} onchange="CST.set('nr',this.checked)"> Incluir «No requiere registro, según Decreto 921 de 1994»</label>`:''}</div>`}
function view(){
  if(!isDir())return'<div class="aic-card" style="padding:18px">Este módulo es para rector y coordinador.</div>';
  const t=Z.t,ayuda={dipl:'Diplomas para Preescolar (Transición), 5.°, 9.° y 11.° (Título de Bachiller). Llevan el logo de la institución como marca de agua y se imprimen en hoja horizontal.',cert:'Certificados de estudio para cualquier grado. Salen en hoja membretada con el código de documento de AULA360.',carn:'Carnés con tamaño de tarjeta (8,6 × 5,4 cm), frente y reverso lado a lado, 4 por hoja. Se pega la foto en el recuadro.',menc:'Menciones de honor para estudiantes, docentes, administrativos y padres de familia, con la marca de agua de la institución.'}[t];
  return`<div style="display:grid;gap:14px"><div class="aic-card" style="padding:18px"><h2 style="font-weight:800;font-size:19px">🎓 Diplomas, certificados, carnés y menciones</h2>
   <div style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0">${TABS.map(x=>`<button onclick="CST.tab('${x[0]}')" style="padding:9px 14px;border-radius:10px;font-weight:800;border:1.5px solid ${t===x[0]?'#1e63e9':'#cbd5e1'};background:${t===x[0]?'#e8f1ff':'#fff'};color:${t===x[0]?'#1e3a8a':'#334155'}">${x[1]}</button>`).join('')}</div>
   <p style="font-size:13px;color:#64748b;margin-bottom:10px">${ayuda}</p>
   ${t==='dipl'?estiloUi():''}${t==='menc'?vMenc()+(Z.mc.persona==='estudiantes'?'<div style="margin-top:12px"><b style="font-size:14px">Elige los estudiantes de cualquier grado y grupo</b><div style="margin-top:6px">'+listaEst().replace(/<label[^>]*>Otros nombres[\s\S]*<\/label>\s*$/,'')+'</div></div>':''):listaEst()}${t==='cert'?vCert():''}${campos()}
   <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px"><button onclick="CST.vista()" style="background:#1e63e9;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">👁 Vista previa</button><button onclick="CST.imprimir()" style="background:#16a34a;color:#fff;padding:11px 16px;border-radius:10px;font-weight:800">🖨️ Imprimir / guardar PDF</button></div>
   <p style="font-size:12px;color:#64748b;margin-top:8px">Se toman el nombre, el logo y los datos de la institución del membrete que ya configuraste. Para guardar en PDF, en la ventana de impresión elige «Guardar como PDF».</p></div></div>`}
return{load,view,vista,imprimir,_t:{docHtml,full,elegidos,Z:()=>Z},
  setEstilo(v){Z.estilo=v;R()},
  quitarImg(k){Z[k]='';Z[k+'Off']=true;R()},
  membrete(k){Z[k]='';Z[k+'Off']=false;R()},
  img(k,inp){const f=inp.files&&inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const m=Math.min(1,700/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*m);c.height=Math.round(im.height*m);c.getContext('2d').drawImage(im,0,0,c.width,c.height);Z[k]=c.toDataURL('image/png');Z[k+'Off']=false;R()};im.onerror=()=>toast('⚠️','No se pudo leer la imagen','Prueba con un PNG o JPG.');im.src=r.result};r.readAsDataURL(f);inp.value=''},
  estilos(){
    document.getElementById('cst-est')?.remove();const m=document.createElement('div');m.id='cst-est';m.style.cssText='position:fixed;inset:0;z-index:210;background:#0009;display:flex;justify-content:center;padding:10px';
    const ejemplo={n:'María Fernanda Rentería Mosquera',d:'1001234567',g:Z.grado===''||!DIPG.includes(+Z.grado)?11:+Z.grado,gr:''};const c=ctx();const old=Z.estilo;
    const tarjetas=ESTILOS.map(x=>{Z.estilo=x[0];const h=diploma(ejemplo,c);const land=x[0]==='elegante';return`<div style="border:2px solid ${old===x[0]?'#1e63e9':'#e2e8f0'};border-radius:12px;padding:8px;background:#fff"><div style="width:100%;height:${land?'190px':'250px'};overflow:hidden;position:relative;background:#f1f5f9;border-radius:8px"><iframe tabindex="-1" style="border:0;width:${land?1056:816}px;height:${land?816:1056}px;transform:scale(${land?0.24:0.235});transform-origin:0 0;position:absolute;left:50%;margin-left:${land?-127:-96}px;top:0;pointer-events:none" srcdoc="${e(full({body:h,orient:land?'landscape':'portrait'}))}"></iframe></div><b style="display:block;margin:6px 0 2px;font-size:14px">${x[1]}</b><p style="font-size:12px;color:#64748b;min-height:32px">${x[2]}</p><button onclick="CST.elegir('${x[0]}')" style="background:#1e63e9;color:#fff;padding:8px 12px;border-radius:9px;font-weight:800;font-size:13px;width:100%">Usar este estilo</button></div>`}).join('');
    Z.estilo=old;
    m.innerHTML=`<div style="background:#fff;border-radius:14px;max-width:1000px;width:100%;height:calc(100vh - 20px);overflow:auto;padding:14px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b style="font-size:17px">Elige el estilo del diploma</b><button onclick="document.getElementById('cst-est').remove()" style="background:#e2e8f0;padding:8px 14px;border-radius:10px;font-weight:700">Cerrar</button></div><div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))">${tarjetas}</div></div>`;document.body.appendChild(m)},
  elegir(k){Z.estilo=k;document.getElementById('cst-est')?.remove();R()},

  tab(t){Z.t=t;if(t==='dipl'&&!DIPG.includes(+Z.grado))Z.grado='';R()},
  set(k,v){Z[k]=v},setC(k,v){Z.cert[k]=k==='anio'?+v:v},setM(k,v){Z.mc[k]=v},
  setP(p){Z.mc.persona=p;Z.mc.motivo=MOTIVOS[p][0];Z.mc.staff=[];R()},
  setGrado(v){Z.grado=v;Z.grupo='';Z.sel=new Set();R()},setGrupo(v){Z.grupo=v;R()},
  todos(on){filtrados().forEach(x=>on?Z.sel.add(x.id):Z.sel.delete(x.id));R()},uno(id,on){on?Z.sel.add(id):Z.sel.delete(id)},
  async traerDoc(){try{const r=await sb.rpc('directorio_colegio');if(r.error)throw r.error;Z.mc.staff=(r.data||[]).filter(p=>p.role==='prof'||p.role==='coordinador').map(p=>({n:p.full_name,on:false}));if(!Z.mc.staff.length)toast('ℹ️','No hay docentes registrados','Escribe los nombres a mano.');R()}catch(x){err(x)}},
  staff(i,on){Z.mc.staff[i].on=on}}})();
