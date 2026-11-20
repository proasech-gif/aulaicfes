/* AULA360 — Simuladores propios (código propio, sin licencias externas). Son MODELOS simplificados, no experimentos reales. */
window.SIM=(function(){
const $=(el,s)=>el.querySelector(s);
const sl=(id,t,min,max,v,st)=>`<label style="display:block;font-size:12px;font-weight:800;margin-top:8px">${t}: <span id="${id}v">${v}</span></label><input id="${id}" type="range" min="${min}" max="${max}" step="${st||1}" value="${v}" style="width:100%">`;
const bind=(el,ids,f)=>ids.forEach(i=>{const r=$(el,'#'+i);r.oninput=()=>{$(el,'#'+i+'v').textContent=r.value;f()}});
const val=(el,i)=>+$(el,'#'+i).value;
const nota=t=>`<p style="font-size:12px;color:#92400e;background:#fffbeb;border-radius:8px;padding:8px;margin-top:10px">⚠️ Simulación: es un modelo simplificado, no un experimento real. ${t||''}</p>`;
const L=[
{id:'ph',lab:'quimica',t:'Escala de pH y mezcla ácido–base',d:'Mezcla volúmenes de un ácido y una base fuertes y mira el pH resultante y el color del indicador.',
 mount(el){el.innerHTML=`<div id="col" style="height:70px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:#fff"></div>${sl('ma','Ácido fuerte HCl 0,1 M (mL)',0,100,50)}${sl('mb','Base fuerte NaOH 0,1 M (mL)',0,100,20)}<div id="o" style="font-weight:700;margin-top:8px"></div>${nota('Solo ácido y base fuertes monopróticos a 25 °C. En el laboratorio real usa gafas y bata.')}`;
  const col=p=>{const s=['#dc2626','#ea580c','#f59e0b','#facc15','#84cc16','#22c55e','#10b981','#14b8a6','#3b82f6','#6366f1','#7c3aed','#9333ea','#7e22ce','#581c87'];return s[Math.min(13,Math.max(0,Math.round(p)))]};
  const f=()=>{const vt=val(el,'ma')+val(el,'mb');let pH=7;const n=(val(el,'ma')-val(el,'mb'))*0.1/1000,V=vt/1000;if(V>0){const c=n/V;pH=Math.abs(c)<1e-7?7:c>0?-Math.log10(c):14+Math.log10(-c)}
   $(el,'#col').style.background=col(pH);$(el,'#col').textContent='pH '+pH.toFixed(2);$(el,'#o').textContent=pH<6.9?'Solución ácida':pH>7.1?'Solución básica':'Solución neutra'};bind(el,['ma','mb'],f);f()}},
{id:'punnett',lab:'biologia',t:'Cuadro de Punnett (genética)',d:'Cruza dos padres para un gen con alelo dominante y recesivo.',
 mount(el){const o=['AA','Aa','aa'];el.innerHTML=`<div style="display:flex;gap:10px;flex-wrap:wrap"><label>Padre <select id="p1" style="padding:6px">${o.map((x,i)=>`<option ${i==1?'selected':''}>${x}</option>`)}</select></label><label>Madre <select id="p2" style="padding:6px">${o.map((x,i)=>`<option ${i==1?'selected':''}>${x}</option>`)}</select></label></div><div id="t" style="margin-top:10px"></div><div id="o" style="font-weight:700;margin-top:8px"></div>${nota('Herencia mendeliana simple (un gen, dominancia completa).')}`;
  const f=()=>{const a=$(el,'#p1').value,b=$(el,'#p2').value,c=[];let h=0;let t='<table border="1" style="border-collapse:collapse;text-align:center;min-width:180px"><tr><th></th><th>'+a[0]+'</th><th>'+a[1]+'</th></tr>';
   [b[0],b[1]].forEach(m=>{t+='<tr><th>'+m+'</th>';[a[0],a[1]].forEach(p=>{const g=[p,m].sort().join('');const gg=g==='aA'?'Aa':g;c.push(gg);t+='<td style="padding:10px;font-weight:800">'+gg+'</td>'});t+='</tr>'});
   const dom=c.filter(x=>x.includes('A')).length;$(el,'#t').innerHTML=t+'</table>';$(el,'#o').textContent=`Fenotipo dominante: ${dom*25}% · recesivo: ${(4-dom)*25}% · AA ${c.filter(x=>x==='AA').length*25}% · Aa ${c.filter(x=>x==='Aa').length*25}% · aa ${c.filter(x=>x==='aa').length*25}%`};
  $(el,'#p1').onchange=f;$(el,'#p2').onchange=f;f()}},
{id:'celula',lab:'biologia',t:'Explora la célula',d:'Toca cada orgánulo para saber qué hace.',
 mount(el){const O=[['Núcleo','🟣','Guarda el ADN y dirige las actividades de la célula.'],['Mitocondria','🟠','Produce la energía (ATP) por respiración celular.'],['Ribosoma','⚪','Fabrica proteínas.'],['Membrana','🟢','Controla qué entra y sale de la célula.'],['Retículo endoplasmático','🔵','Transporta y modifica sustancias.'],['Cloroplasto (solo en células vegetales)','🌿','Realiza la fotosíntesis.']];
  el.innerHTML=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px">${O.map((o,i)=>`<button data-i="${i}" style="padding:12px;border:1.5px solid #cbd5e1;border-radius:12px;font-weight:700">${o[1]}<br>${o[0]}</button>`).join('')}</div><div id="o" style="font-weight:700;margin-top:10px;min-height:40px"></div>${nota('Esquema didáctico; las células reales no se ven así.')}`;
  el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>$(el,'#o').textContent=O[b.dataset.i][0]+': '+O[b.dataset.i][2])}},
{id:'dados',lab:'matematicas',t:'Probabilidad: lanzar dados',d:'Lanza dos dados muchas veces y compara con la probabilidad teórica.',
 mount(el){el.innerHTML=`<div style="display:flex;gap:8px;flex-wrap:wrap"><button id="b1" style="background:#1e63e9;color:#fff;padding:9px 14px;border-radius:10px;font-weight:800">🎲 Lanzar 1 vez</button><button id="b2" style="background:#16a34a;color:#fff;padding:9px 14px;border-radius:10px;font-weight:800">🎲 Lanzar 100 veces</button><button id="b3" style="background:#64748b;color:#fff;padding:9px 14px;border-radius:10px;font-weight:800">Reiniciar</button></div><div id="o" style="margin-top:10px"></div>${nota('Los resultados son aleatorios de verdad: cambian cada vez.')}`;
  let n=0;const c=Array(13).fill(0);const f=()=>{const m=Math.max(1,...c);$(el,'#o').innerHTML=`<b>Lanzamientos: ${n}</b>`+[2,3,4,5,6,7,8,9,10,11,12].map(s=>{const th=(6-Math.abs(s-7))/36*100;return`<div style="display:flex;align-items:center;gap:6px;font-size:12px;margin-top:3px"><span style="width:22px">${s}</span><div style="background:#7c3aed;height:12px;width:${Math.round(c[s]/m*60)}%;border-radius:4px"></div><span>${n?(c[s]/n*100).toFixed(1):0}% (teórico ${th.toFixed(1)}%)</span></div>`}).join('')};
  const r=k=>{for(let i=0;i<k;i++){c[1+Math.ceil(Math.random()*6)+Math.ceil(Math.random()*6)-1]++;n++}f()};
  $(el,'#b1').onclick=()=>r(1);$(el,'#b2').onclick=()=>r(100);$(el,'#b3').onclick=()=>{c.fill(0);n=0;f()};f()}}];


/* ===== Gráficas profesionales ===== */
(function(){if(document.getElementById('simcss'))return;const st=document.createElement('style');st.id='simcss';st.textContent=`
.sim-grid{display:grid;grid-template-columns:minmax(250px,320px) minmax(0,1fr);gap:14px;align-items:start}
@media(max-width:820px){.sim-grid{grid-template-columns:1fr}}
.sim-panel{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:12px;box-shadow:0 2px 8px rgba(15,23,42,.06);margin-bottom:12px}
.sim-h{font-weight:800;font-size:13px;color:#334155;margin-bottom:6px;letter-spacing:.2px}
.sim-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:4px 0 10px}
.sim-tile{border-radius:12px;padding:9px 11px;color:#fff;box-shadow:0 2px 6px rgba(15,23,42,.12)}
.sim-tile small{display:block;font-size:11px;opacity:.9;font-weight:700}.sim-tile b{font-size:19px}
.sim-eq{background:#0f172a;color:#e2e8f0;border-radius:12px;padding:10px 14px;font-family:ui-monospace,Menlo,monospace;font-size:13px;margin-bottom:8px;overflow:auto;white-space:pre-wrap}
.sim-btn{background:#1e63e9;color:#fff;padding:9px 14px;border-radius:10px;font-weight:800;font-size:13px;margin:8px 6px 0 0}
.sim-tab{width:100%;border-collapse:collapse;font-size:12px;text-align:center}.sim-tab td,.sim-tab th{border:1px solid #e2e8f0;padding:3px 6px}.sim-tab th{background:#f1f5f9}
`;document.head.appendChild(st)})();
const nice=r=>{const e=Math.pow(10,Math.floor(Math.log10(r))),f=r/e;return(f<1.5?1:f<3?2:f<7?5:10)*e};
const fm=v=>{if(Math.abs(v)<1e-9)return'0';const a=Math.abs(v);return String(+(a>=100?v.toFixed(0):a>=10?v.toFixed(1):v.toFixed(2)))};
const tile=(l,v,c)=>`<div class="sim-tile" style="background:${c}"><small>${l}</small><b>${v}</b></div>`;
function plot(cv,o){const dpr=window.devicePixelRatio||1,cw=cv.clientWidth||600,ch=o.h||300;cv.width=Math.round(cw*dpr);cv.height=Math.round(ch*dpr);cv.style.height=ch+'px';
 const x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);const L=50,Rr=16,T=24,Bm=38,pw=cw-L-Rr,ph=ch-T-Bm;
 const X=v=>L+(v-o.xmin)/(o.xmax-o.xmin)*pw,Y=v=>T+ph-(v-o.ymin)/(o.ymax-o.ymin)*ph;
 x.fillStyle='#fff';x.fillRect(0,0,cw,ch);x.font='11px system-ui,Segoe UI,sans-serif';
 const sx=nice((o.xmax-o.xmin)/8),sy=nice((o.ymax-o.ymin)/6);
 x.fillStyle='#f8fafc';x.fillRect(L,T,pw,ph);
 for(let v=Math.ceil(o.xmin/sx)*sx;v<=o.xmax+1e-9;v+=sx){x.strokeStyle=Math.abs(v)<1e-9?'#94a3b8':'#e6ebf2';x.lineWidth=1;x.beginPath();x.moveTo(X(v),T);x.lineTo(X(v),T+ph);x.stroke();x.fillStyle='#475569';x.textAlign='center';x.fillText(fm(v),X(v),T+ph+15)}
 for(let v=Math.ceil(o.ymin/sy)*sy;v<=o.ymax+1e-9;v+=sy){x.strokeStyle=Math.abs(v)<1e-9?'#94a3b8':'#e6ebf2';x.beginPath();x.moveTo(L,Y(v));x.lineTo(L+pw,Y(v));x.stroke();x.fillStyle='#475569';x.textAlign='right';x.fillText(fm(v),L-6,Y(v)+4)}
 x.strokeStyle='#334155';x.lineWidth=1.6;const ay=Math.min(Math.max(0,o.ymin),o.ymax),ax=Math.min(Math.max(0,o.xmin),o.xmax);
 x.beginPath();x.moveTo(L,Y(ay));x.lineTo(L+pw,Y(ay));x.moveTo(X(ax),T);x.lineTo(X(ax),T+ph);x.stroke();x.strokeRect(L,T,pw,ph);
 x.fillStyle='#334155';x.beginPath();x.moveTo(L+pw,Y(ay));x.lineTo(L+pw-7,Y(ay)-4);x.lineTo(L+pw-7,Y(ay)+4);x.fill();x.beginPath();x.moveTo(X(ax),T);x.lineTo(X(ax)-4,T+7);x.lineTo(X(ax)+4,T+7);x.fill();
 x.save();x.beginPath();x.rect(L,T,pw,ph);x.clip();
 (o.areas||[]).forEach(a=>{x.fillStyle=a.color||'rgba(99,102,241,.18)';x.beginPath();x.moveTo(X(a.x0),Y(0));for(let i=0;i<=80;i++){const u=a.x0+(a.x1-a.x0)*i/80;x.lineTo(X(u),Y(a.f(u)))}x.lineTo(X(a.x1),Y(0));x.closePath();x.fill()});
 (o.vlines||[]).forEach(v=>{x.setLineDash([6,4]);x.strokeStyle=v.color||'#64748b';x.lineWidth=1.3;x.beginPath();x.moveTo(X(v.x),T);x.lineTo(X(v.x),T+ph);x.stroke();x.setLineDash([])});
 (o.hlines||[]).forEach(v=>{x.setLineDash([6,4]);x.strokeStyle=v.color||'#64748b';x.lineWidth=1.3;x.beginPath();x.moveTo(L,Y(v.y));x.lineTo(L+pw,Y(v.y));x.stroke();x.setLineDash([])});
 (o.drops||[]).forEach(p=>{x.setLineDash([4,4]);x.strokeStyle='#94a3b8';x.lineWidth=1.2;x.beginPath();x.moveTo(X(p.x),Y(p.y));x.lineTo(X(p.x),Y(0));x.moveTo(X(p.x),Y(p.y));x.lineTo(X(0),Y(p.y));x.stroke();x.setLineDash([])});
 (o.series||[]).forEach(s=>{x.strokeStyle=s.color||'#1e63e9';x.lineWidth=s.w||2.6;x.setLineDash(s.dash||[]);x.lineJoin='round';x.beginPath();let on=false;
   if(s.pts){s.pts.forEach((p,i)=>{i?x.lineTo(X(p[0]),Y(p[1])):x.moveTo(X(p[0]),Y(p[1]))})}
   else{const a=s.x0!=null?s.x0:o.xmin,b=s.x1!=null?s.x1:o.xmax,N=260;for(let i=0;i<=N;i++){const u=a+(b-a)*i/N,y=s.f(u);if(!isFinite(y)){on=false;continue}on?x.lineTo(X(u),Y(y)):x.moveTo(X(u),Y(y));on=true}}
   x.stroke();x.setLineDash([])});
 x.restore();
 (o.pts||[]).forEach(p=>{if(p.x<o.xmin||p.x>o.xmax||p.y<o.ymin||p.y>o.ymax)return;x.beginPath();x.arc(X(p.x),Y(p.y),p.r||5.5,0,7);x.fillStyle=p.fill||'#fff';x.fill();x.lineWidth=2.4;x.strokeStyle=p.color||'#dc2626';x.stroke();
   if(p.label){x.font='bold 11px system-ui,sans-serif';const w=x.measureText(p.label).width+10;let lx=X(p.x)+9,ly=Y(p.y)-(p.below?-18:12);if(lx+w>cw-4)lx=X(p.x)-9-w;if(ly<T+8)ly=Y(p.y)+22;x.fillStyle='rgba(255,255,255,.94)';x.strokeStyle=p.color||'#dc2626';x.lineWidth=1;x.beginPath();x.roundRect?x.roundRect(lx,ly-12,w,17,5):x.rect(lx,ly-12,w,17);x.fill();x.stroke();x.fillStyle='#0f172a';x.textAlign='left';x.fillText(p.label,lx+5,ly)}});
 (o.vlines||[]).forEach(v=>{if(v.label){x.font='bold 10px system-ui,sans-serif';x.fillStyle=v.color||'#475569';x.textAlign='left';x.fillText(v.label,Math.min(X(v.x)+4,cw-120),T+12)}});
 (o.hlines||[]).forEach(v=>{if(v.label){x.font='bold 10px system-ui,sans-serif';x.fillStyle=v.color||'#475569';x.textAlign='left';x.fillText(v.label,L+6,Y(v.y)-4)}});
 x.font='bold 11px system-ui,sans-serif';x.fillStyle='#0f172a';x.textAlign='center';if(o.xl)x.fillText(o.xl,L+pw/2,ch-6);
 if(o.yl){x.save();x.translate(12,T+ph/2);x.rotate(-Math.PI/2);x.fillText(o.yl,0,0);x.restore()}
 let lx=L+8;(o.series||[]).filter(s=>s.name).forEach(s=>{x.fillStyle=s.color||'#1e63e9';x.fillRect(lx,T+5,14,4);x.fillStyle='#334155';x.textAlign='left';x.font='11px system-ui,sans-serif';x.fillText(s.name,lx+18,T+10);lx+=x.measureText(s.name).width+34})}
const shell=(el,ctrl,graphs)=>{el.innerHTML=`<div class="sim-grid"><div><div class="sim-panel"><div class="sim-h">🎛️ Controles</div>${ctrl}</div><div class="sim-panel"><div class="sim-h">📐 Ecuaciones</div><div id="eq" class="sim-eq" style="margin:0"></div></div></div><div>${graphs}</div></div><div class="sim-tiles" id="tl"></div>`};
const gph=(id,t,h)=>`<div class="sim-panel"><div class="sim-h">${t}</div><canvas id="${id}" style="width:100%;display:block;border-radius:8px"></canvas></div>`;
L.push(
{id:'proyectil',lab:'fisica',t:'Lanzamiento de proyectil',d:'Trayectoria, alturas, tiempos y velocidades con gráficas y puntos clave.',
 mount(el){shell(el,sl('a','Ángulo (°)',5,85,45)+sl('v','Velocidad inicial (m/s)',5,60,30)+sl('g','Gravedad (m/s²)',2,25,9.8,.1)+sl('h','Altura inicial (m)',0,30,0)+'<button class="sim-btn" id="go">▶ Lanzar</button><button class="sim-btn" id="rs" style="background:#64748b">⟲ Quieto</button>'+nota('Sin resistencia del aire.'),
  gph('cv1','Trayectoria  y(x)')+gph('cv2','Altura en función del tiempo  y(t)')+gph('cv3','Velocidades en función del tiempo'));
  let t0=null,tc=null;const draw=()=>{const a=val(el,'a')*Math.PI/180,v=val(el,'v'),g=val(el,'g'),h0=val(el,'h'),vx=v*Math.cos(a),vy0=v*Math.sin(a),T=(vy0+Math.sqrt(vy0*vy0+2*g*h0))/g,R=vx*T,tH=Math.max(0,vy0/g),H=h0+vy0*tH-.5*g*tH*tH,vyf=vy0-g*T,vf=Math.hypot(vx,vyf);
   const Y=t=>h0+vy0*t-.5*g*t*t,xs=t=>vx*t;const cur=tc==null?null:Math.min(tc,T);
   plot($(el,'#cv1'),{h:300,xmin:-R*.04-.5,xmax:R*1.08+1,ymin:-H*.1-.5,ymax:H*1.28+1,xl:'x — distancia horizontal (m)',yl:'y — altura (m)',
    series:[{f:x=>h0+Math.tan(a)*x-g*x*x/(2*vx*vx),x0:0,x1:R,color:'#2563eb',name:'Trayectoria'}],vlines:[{x:vx*tH,label:'x = '+fm(vx*tH)+' m'}],hlines:[{y:H,color:'#16a34a',label:'H = '+fm(H)+' m'}],
    pts:[{x:0,y:h0,label:'Lanzamiento (0, '+fm(h0)+')',color:'#7c3aed'},{x:vx*tH,y:H,label:'Altura máx. ('+fm(vx*tH)+', '+fm(H)+')',color:'#16a34a'},{x:R,y:0,label:'Impacto  x = '+fm(R)+' m',color:'#dc2626',below:1}].concat(cur!=null?[{x:xs(cur),y:Y(cur),r:7,fill:'#f59e0b',color:'#b45309'}]:[])});
   plot($(el,'#cv2'),{h:230,xmin:0,xmax:T*1.06,ymin:-H*.1-.5,ymax:H*1.28+1,xl:'t — tiempo (s)',yl:'y (m)',series:[{f:Y,x0:0,x1:T,color:'#16a34a',name:'y(t)'}],vlines:[{x:tH,label:'t = '+fm(tH)+' s (sube → baja)'}],
    pts:[{x:tH,y:H,label:'Máx. '+fm(H)+' m',color:'#16a34a'},{x:T,y:0,label:'Cae: T = '+fm(T)+' s',color:'#dc2626',below:1}].concat(cur!=null?[{x:cur,y:Y(cur),r:6,fill:'#f59e0b',color:'#b45309'}]:[])});
   const vmax=Math.max(v,Math.abs(vyf),vf)*1.3+3;plot($(el,'#cv3'),{h:230,xmin:0,xmax:T*1.06,ymin:-vmax,ymax:vmax,xl:'t — tiempo (s)',yl:'v (m/s)',
    series:[{f:()=>vx,x0:0,x1:T,color:'#2563eb',name:'vx (constante)'},{f:t=>vy0-g*t,x0:0,x1:T,color:'#dc2626',name:'vy(t)'},{f:t=>Math.hypot(vx,vy0-g*t),x0:0,x1:T,color:'#7c3aed',dash:[5,4],name:'|v|'}],
    pts:[{x:tH,y:0,label:'vy = 0 en t = '+fm(tH)+' s',color:'#dc2626'},{x:0,y:vy0,label:'vy₀ = '+fm(vy0),color:'#dc2626'},{x:T,y:vyf,label:'vy = '+fm(vyf),color:'#dc2626',below:1}]});
   $(el,'#tl').innerHTML=tile('Alcance R',fm(R)+' m','#2563eb')+tile('Altura máxima H',fm(H)+' m','#16a34a')+tile('Tiempo de vuelo',fm(T)+' s','#f59e0b')+tile('Tiempo en subir',fm(tH)+' s','#0d9488')+tile('Velocidad horizontal vx',fm(vx)+' m/s','#6366f1')+tile('Velocidad vertical inicial',fm(vy0)+' m/s','#8b5cf6')+tile('Velocidad al impacto',fm(vf)+' m/s','#dc2626');
   $(el,'#eq').textContent=`x(t) = v₀·cosθ·t = ${fm(vx)}·t\ny(t) = h₀ + v₀·senθ·t − ½·g·t²\n     = ${fm(h0)} + ${fm(vy0)}·t − ${fm(g/2)}·t²\nvy(t) = ${fm(vy0)} − ${fm(g)}·t`;return T};
  let T=draw();const re=()=>{tc=null;T=draw()};bind(el,['a','v','g','h'],re);
  const loop=ts=>{if(!el.isConnected||t0==null)return;const el_=(ts-t0)/1000,k=Math.min(1,el_/3.2);tc=T*k;T=draw();if(k<1)requestAnimationFrame(loop)};
  $(el,'#go').onclick=()=>{t0=performance.now();requestAnimationFrame(loop)};$(el,'#rs').onclick=()=>{t0=null;re()}}},
{id:'funcion',lab:'matematicas',t:'Función cuadrática',d:'Parábola con vértice, raíces, eje de simetría e intersecciones señalados.',
 mount(el){shell(el,sl('a','a',-5,5,1,.5)+sl('b','b',-10,10,0,.5)+sl('c','c',-10,10,-4,.5)+'<div style="margin-top:8px"><button class="sim-btn" data-p="1,0,-4" style="background:#6366f1">x²−4</button><button class="sim-btn" data-p="-1,4,0" style="background:#0d9488">−x²+4x</button><button class="sim-btn" data-p="1,2,1" style="background:#f59e0b">(x+1)²</button><button class="sim-btn" data-p="1,0,2" style="background:#dc2626">x²+2</button></div>',
  gph('cv1','Gráfica  y = ax² + bx + c')+'<div class="sim-panel"><div class="sim-h">Tabla de valores</div><div id="tb"></div></div>');
  const f=()=>{const a=val(el,'a'),b=val(el,'b'),c=val(el,'c');const F=x=>a*x*x+b*x+c;
   if(a===0){const m=b,hw=10;plot($(el,'#cv1'),{h:340,xmin:-10,xmax:10,ymin:-20,ymax:20,xl:'x',yl:'y',series:[{f:x=>m*x+c,color:'#dc2626'}],pts:[{x:0,y:c,label:'(0, '+fm(c)+')'}]});$(el,'#eq').textContent='a = 0: ya no es parábola.\ny = '+fm(b)+'·x + '+fm(c);$(el,'#tl').innerHTML='';$(el,'#tb').innerHTML='';return}
   const vx=-b/(2*a),vy=F(vx),d=b*b-4*a*c,rs=d>=0?[(-b+Math.sqrt(d))/(2*a),(-b-Math.sqrt(d))/(2*a)]:[];
   let hw=Math.max(4,rs.length?Math.max(Math.abs(rs[0]-vx),Math.abs(rs[1]-vx))*1.5:4);let x0=Math.min(vx-hw,-1.5),x1=Math.max(vx+hw,1.5);
   let yl=Math.min(vy,0,c,F(x0),F(x1)),yh=Math.max(vy,0,c,F(x0),F(x1));if(a>0)yh=Math.min(yh,vy+Math.abs(vy)*2+25);else yl=Math.max(yl,vy-Math.abs(vy)*2-25);const pad=(yh-yl)*.12+1;
   const pts=[{x:vx,y:vy,label:'Vértice ('+fm(vx)+', '+fm(vy)+')',color:a>0?'#16a34a':'#7c3aed'},{x:0,y:c,label:'Corte con y: (0, '+fm(c)+')',color:'#f59e0b',below:1}];
   rs.forEach((r,i)=>{if(i===1&&d===0)return;pts.push({x:r,y:0,label:'Raíz x'+(d===0?'':(i+1))+' = '+fm(r),color:'#dc2626'})});
   plot($(el,'#cv1'),{h:360,xmin:x0,xmax:x1,ymin:yl-pad,ymax:yh+pad,xl:'x',yl:'y',series:[{f:F,color:'#2563eb',name:'y = '+fm(a)+'x² + '+fm(b)+'x + '+fm(c)}],vlines:[{x:vx,label:'Eje de simetría x = '+fm(vx),color:'#7c3aed'}],pts});
   $(el,'#tl').innerHTML=tile('Vértice','('+fm(vx)+', '+fm(vy)+')','#16a34a')+tile('Concavidad',a>0?'Hacia arriba ∪':'Hacia abajo ∩','#6366f1')+tile('Discriminante Δ',fm(d),'#f59e0b')+tile('Raíces',rs.length?(d===0?'x = '+fm(rs[0]):'x₁ = '+fm(rs[0])+' · x₂ = '+fm(rs[1])):'No tiene reales','#dc2626')+tile('Corte con eje y','(0, '+fm(c)+')','#0d9488')+tile(a>0?'Valor mínimo':'Valor máximo','y = '+fm(vy),'#2563eb')+tile('Rango',a>0?'y ≥ '+fm(vy):'y ≤ '+fm(vy),'#8b5cf6');
   $(el,'#eq').textContent=`y = ${fm(a)}x² + ${fm(b)}x + ${fm(c)}\nVértice: x = −b/(2a) = ${fm(vx)}\nΔ = b² − 4ac = ${fm(d)}\n`+(rs.length?`Raíces: x = (−b ± √Δ)/(2a)\n       x₁ = ${fm(rs[0])},  x₂ = ${fm(rs[1])}`:'Δ < 0: no corta el eje x');
   const xs=[];for(let i=-3;i<=3;i++)xs.push(Math.round(vx)+i);$(el,'#tb').innerHTML='<table class="sim-tab"><tr><th>x</th>'+xs.map(v=>'<td>'+fm(v)+'</td>').join('')+'</tr><tr><th>y</th>'+xs.map(v=>'<td>'+fm(F(v))+'</td>').join('')+'</tr></table>'};
  bind(el,['a','b','c'],f);el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const [a,bb,c]=b.dataset.p.split(',');[['a',a],['b',bb],['c',c]].forEach(([i,v])=>{$(el,'#'+i).value=v;$(el,'#'+i+'v').textContent=v});f()});f()}},
{id:'lineal',lab:'matematicas',t:'Función lineal',d:'Pendiente, cortes con los ejes y triángulo de pendiente.',
 mount(el){shell(el,sl('m','Pendiente m',-5,5,2,.5)+sl('b','Ordenada b',-10,10,-3,.5),gph('cv1','Gráfica  y = mx + b'));
  const f=()=>{const m=val(el,'m'),b=val(el,'b'),F=x=>m*x+b,r=m!==0?-b/m:null;const ext=Math.max(6,Math.abs(r||0)*1.4+1,Math.abs(b)/Math.max(.5,Math.abs(m))*1.2);
   const pts=[{x:0,y:b,label:'Corte con y: (0, '+fm(b)+')',color:'#f59e0b',below:1}];if(r!=null)pts.push({x:r,y:0,label:'Raíz: x = '+fm(r),color:'#dc2626'});
   plot($(el,'#cv1'),{h:340,xmin:-ext,xmax:ext,ymin:-ext*1.1,ymax:ext*1.1,xl:'x',yl:'y',series:[{f:F,color:'#2563eb',name:'y = '+fm(m)+'x + '+fm(b)},{pts:[[0,b],[1,b],[1,b+m]],color:'#16a34a',dash:[5,4],w:2,name:'Triángulo de pendiente: Δx = 1, Δy = '+fm(m)}],pts});
   $(el,'#tl').innerHTML=tile('Pendiente m',fm(m),'#2563eb')+tile('Ordenada b',fm(b),'#f59e0b')+tile('Raíz',r!=null?'x = '+fm(r):'No hay (paralela a x)','#dc2626')+tile('Comportamiento',m>0?'Creciente ↗':m<0?'Decreciente ↘':'Constante →','#16a34a')+tile('Ángulo con x',fm(Math.atan(m)*180/Math.PI)+'°','#6366f1');
   $(el,'#eq').textContent=`y = ${fm(m)}x + ${fm(b)}\nm = Δy/Δx = ${fm(m)}\nCorte con y: (0, ${fm(b)})\n`+(r!=null?`Corte con x: y = 0 → x = −b/m = ${fm(r)}`:'m = 0: no corta el eje x')};bind(el,['m','b'],f);f()}},
{id:'ohm',lab:'fisica',t:'Ley de Ohm (circuito simple)',d:'Gráfica corriente–voltaje, potencia y punto de operación.',
 mount(el){shell(el,'<div id="b" style="font-size:54px;text-align:center;line-height:1">💡</div>'+sl('V','Voltaje V (volt)',1,24,9)+sl('R','Resistencia R (Ω)',1,100,30)+nota('Resistencia ideal, sin calentamiento.'),gph('cv1','Corriente en función del voltaje  I(V)')+gph('cv2','Potencia en función del voltaje  P(V)'));
  const f=()=>{const V=val(el,'V'),R=val(el,'R'),I=V/R,P=V*I,Imax=24/Math.max(1,R/2)*1.0;
   plot($(el,'#cv1'),{h:280,xmin:0,xmax:26,ymin:0,ymax:24/Math.max(1,R/2)*1.05,xl:'V — voltaje (V)',yl:'I — corriente (A)',series:[{f:x=>x/R,color:'#2563eb',name:'R = '+fm(R)+' Ω'},{f:x=>x/(R*2),color:'#94a3b8',dash:[5,4],w:1.8,name:'2R'},{f:x=>x/(R/2),color:'#94a3b8',dash:[2,3],w:1.8,name:'R/2'}],drops:[{x:V,y:I}],pts:[{x:V,y:I,label:'V = '+fm(V)+' V · I = '+fm(I)+' A',color:'#dc2626'}]});
   plot($(el,'#cv2'),{h:240,xmin:0,xmax:26,ymin:0,ymax:26*26/R*1.05,xl:'V (V)',yl:'P (W)',series:[{f:x=>x*x/R,color:'#7c3aed',name:'P = V²/R'}],drops:[{x:V,y:P}],pts:[{x:V,y:P,label:'P = '+fm(P)+' W',color:'#dc2626'}]});
   $(el,'#b').style.opacity=Math.min(1,.2+P/8);$(el,'#b').style.filter='drop-shadow(0 0 '+Math.min(24,P*2)+'px #fde047)';
   $(el,'#tl').innerHTML=tile('Corriente I',fm(I)+' A','#2563eb')+tile('Corriente',fm(I*1000)+' mA','#6366f1')+tile('Potencia P',fm(P)+' W','#7c3aed')+tile('Voltaje V',fm(V)+' V','#0d9488')+tile('Resistencia R',fm(R)+' Ω','#f59e0b')+tile('Pendiente de la recta (1/R)',fm(1/R)+' A/V','#dc2626');
   $(el,'#eq').textContent=`V = I · R\nI = V/R = ${fm(V)}/${fm(R)} = ${fm(I)} A\nP = V · I = ${fm(P)} W`};bind(el,['V','R'],f);f()}},
{id:'mru',lab:'fisica',t:'Movimiento rectilíneo (MRU y MRUA)',d:'Posición, velocidad y aceleración contra el tiempo; el área es el desplazamiento.',
 mount(el){shell(el,sl('x0','Posición inicial x₀ (m)',-20,20,0)+sl('v0','Velocidad inicial v₀ (m/s)',-20,20,4)+sl('a','Aceleración a (m/s²)',-6,6,1,.5)+sl('t','Tiempo t (s)',0,10,4,.1),
  gph('cv1','Posición  x(t)')+gph('cv2','Velocidad  v(t)  — el área sombreada es el desplazamiento')+gph('cv3','Aceleración  a(t)'));
  const f=()=>{const x0=val(el,'x0'),v0=val(el,'v0'),a=val(el,'a'),t=val(el,'t');const X=s=>x0+v0*s+.5*a*s*s,Vv=s=>v0+a*s;const xs=[0,5,10].map(X),xl=Math.min(...xs,x0)-5,xh=Math.max(...xs,x0)+5,vs=[Vv(0),Vv(10)],vl=Math.min(...vs,0)-2,vh=Math.max(...vs,0)+2;
   const px=[{x:0,y:x0,label:'x₀ = '+fm(x0),color:'#7c3aed'},{x:t,y:X(t),label:'t = '+fm(t)+' s → x = '+fm(X(t))+' m',color:'#dc2626',r:7,fill:'#f59e0b'}];
   if(a!==0&&-v0/a>0&&-v0/a<10){const tv=-v0/a;px.push({x:tv,y:X(tv),label:'Se detiene en t = '+fm(tv)+' s',color:'#16a34a',below:1})}
   plot($(el,'#cv1'),{h:260,xmin:0,xmax:10,ymin:xl,ymax:xh,xl:'t (s)',yl:'x (m)',series:[{f:X,color:'#2563eb',name:'x(t)'}],vlines:[{x:t}],pts:px});
   plot($(el,'#cv2'),{h:230,xmin:0,xmax:10,ymin:vl,ymax:vh,xl:'t (s)',yl:'v (m/s)',series:[{f:Vv,color:'#16a34a',name:'v(t)'}],areas:[{f:Vv,x0:0,x1:t,color:'rgba(34,197,94,.25)'}],vlines:[{x:t}],pts:[{x:0,y:v0,label:'v₀ = '+fm(v0),color:'#7c3aed'},{x:t,y:Vv(t),label:'v = '+fm(Vv(t))+' m/s',color:'#dc2626',r:7,fill:'#f59e0b'}]});
   plot($(el,'#cv3'),{h:200,xmin:0,xmax:10,ymin:-8,ymax:8,xl:'t (s)',yl:'a (m/s²)',series:[{f:()=>a,color:'#dc2626',name:'a(t) constante'}],pts:[{x:0,y:a,label:'a = '+fm(a)+' m/s²',color:'#dc2626'}]});
   $(el,'#tl').innerHTML=tile('Posición x(t)',fm(X(t))+' m','#2563eb')+tile('Velocidad v(t)',fm(Vv(t))+' m/s','#16a34a')+tile('Desplazamiento Δx',fm(X(t)-x0)+' m','#f59e0b')+tile('Aceleración a',fm(a)+' m/s²','#dc2626')+tile('Tipo',a===0?'MRU (velocidad constante)':'MRUA (aceleración constante)','#6366f1');
   $(el,'#eq').textContent=`x(t) = x₀ + v₀·t + ½·a·t²\n     = ${fm(x0)} + ${fm(v0)}·t + ${fm(a/2)}·t²\nv(t) = v₀ + a·t = ${fm(v0)} + ${fm(a)}·t\nΔx = x(t) − x₀ = ${fm(X(t)-x0)} m`};bind(el,['x0','v0','a','t'],f);f()}}
);

/* ---- actividades interactivas (ordenar, clasificar, preguntas, dilema) ---- */
const mez=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BTN='style="background:#1e63e9;color:#fff;padding:9px 14px;border-radius:10px;font-weight:800"';
function orden(id,lab,t,d,items,nt){L.push({id,lab,t,d,mount(el){let a=mez(items);if(a.join()===items.join())a=a.reverse();let res='';
  const f=()=>{el.innerHTML=`<p style="font-weight:700">Ordena de primero a último con las flechas:</p>${a.map((x,i)=>`<div style="display:flex;gap:6px;align-items:center;margin:6px 0;padding:8px;border:1.5px solid #cbd5e1;border-radius:10px"><b>${i+1}.</b><span style="flex:1">${esc(x)}</span><button data-u="${i}" style="padding:2px 9px">▲</button><button data-d="${i}" style="padding:2px 9px">▼</button></div>`).join('')}<button id="ck" ${BTN}>Comprobar</button> <button id="rs" style="padding:9px 14px">Mezclar otra vez</button><div style="margin-top:10px;font-weight:800">${res}</div>${nota(nt)}`;
   el.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{const i=+b.dataset.u;if(i>0){[a[i-1],a[i]]=[a[i],a[i-1]];res='';f()}});el.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const i=+b.dataset.d;if(i<a.length-1){[a[i+1],a[i]]=[a[i],a[i+1]];res='';f()}});
   $(el,'#ck').onclick=()=>{const ok=a.filter((x,i)=>x===items[i]).length;res=ok===items.length?'✅ ¡Perfecto! Todo en orden.':`${ok} de ${items.length} en su lugar. Sigue intentando.`;f()};$(el,'#rs').onclick=()=>{a=mez(items);res='';f()}};f()}})}
function clasif(id,lab,t,d,cats,items,nt){L.push({id,lab,t,d,mount(el){let res='';const it=mez(items);
  el.innerHTML=`<p style="font-weight:700">Clasifica cada función:</p>${it.map((x,i)=>`<div style="margin:6px 0"><div>${esc(x[0])}</div><select data-i="${i}" style="padding:6px;width:100%;border:1.5px solid #cbd5e1;border-radius:8px"><option value="">Elige…</option>${cats.map(c=>`<option>${esc(c)}</option>`).join('')}</select></div>`).join('')}<button id="ck" ${BTN}>Comprobar</button><div id="o" style="margin-top:10px;font-weight:800"></div>${nota(nt)}`;
  $(el,'#ck').onclick=()=>{let ok=0;const m=[];el.querySelectorAll('[data-i]').forEach(s=>{const x=it[+s.dataset.i];if(s.value===x[1])ok++;else m.push(x[0]+' → '+x[1])});$(el,'#o').innerHTML=ok===it.length?'✅ ¡Todas correctas!':`${ok} de ${it.length} correctas.<div style="font-weight:400;font-size:13px;margin-top:4px">Revisa: ${m.map(esc).join('<br>')}</div>`}}})}
function preg(id,lab,t,d,texto,qs,nt){L.push({id,lab,t,d,mount(el){el.innerHTML=`<div style="background:#f8fafc;border-radius:10px;padding:12px;white-space:pre-wrap;line-height:1.5">${esc(texto)}</div>${qs.map((q,i)=>`<div style="margin-top:12px"><b>${i+1}. ${esc(q.p)}</b> <small style="color:#64748b">(${q.n})</small>${q.o.map((o,k)=>`<label style="display:block;margin:4px 0"><input type="radio" name="q${i}" value="${k}"> ${esc(o)}</label>`).join('')}<div id="f${i}" style="font-size:13px;margin-top:3px"></div></div>`).join('')}<div style="margin-top:12px"><button id="ck" ${BTN}>Comprobar</button> <b id="o"></b></div>${nota(nt)}`;
  $(el,'#ck').onclick=()=>{let ok=0;qs.forEach((q,i)=>{const r=el.querySelector('input[name=q'+i+']:checked');const g=r&&+r.value===q.c;if(g)ok++;$(el,'#f'+i).innerHTML=r?(g?'✅ ':'❌ ')+esc(q.e):'Elige una opción'});$(el,'#o').textContent=ok+' de '+qs.length+' correctas'}}})}
function dilema(id,lab,t,d,caso,lentes,nt){L.push({id,lab,t,d,mount(el){el.innerHTML=`<div style="background:#f8fafc;border-radius:10px;padding:12px;white-space:pre-wrap">${esc(caso)}</div><p style="font-weight:700;margin-top:10px">Mira el caso desde distintas perspectivas:</p>${lentes.map(l=>`<div style="border:1.5px solid #cbd5e1;border-radius:10px;padding:10px;margin:6px 0"><b>${esc(l[0])}</b><div style="font-size:14px;margin-top:3px">${esc(l[1])}</div></div>`).join('')}<label style="display:block;font-weight:800;font-size:12px;margin-top:10px">Tu reflexión (no hay una única respuesta correcta; argumenta con respeto)</label><textarea rows="4" style="width:100%;padding:9px;border:1.5px solid #cbd5e1;border-radius:10px" placeholder="Yo pienso que… porque…"></textarea><p style="font-size:12px;color:#64748b">Esta reflexión no se guarda aquí. Si tu docente la pide, cópiala en la experiencia.</p>${nota(nt)}`}})}
preg('lectura1','lectura','Lectura guiada: nivel literal, inferencial y crítico','Lee un texto breve y responde tres preguntas de distinto nivel.',
 'La biblioteca del barrio\n\nDurante años, la biblioteca del barrio abría solo los sábados. Doña Marta, la bibliotecaria, notó que los niños llegaban temprano, pero la puerta seguía cerrada hasta las nueve. Un día, un grupo de vecinos propuso abrir también los martes por la tarde. Algunos dijeron que no había presupuesto; otros, que los niños preferían jugar en la calle. Después de tres meses de prueba, los martes se llenaron de estudiantes haciendo tareas y los préstamos de libros se duplicaron.',
 [{p:'¿Qué días abría la biblioteca al principio?',n:'literal',o:['Todos los días','Solo los sábados','Los martes y sábados'],c:1,e:'El texto dice que abría solo los sábados.'},
  {p:'¿Qué se puede inferir de que los martes "se llenaron de estudiantes"?',n:'inferencial',o:['Había una necesidad que antes no se atendía','A los niños no les gustaba jugar','La biblioteca cerró los sábados'],c:0,e:'Que se llenara muestra que existía una necesidad sin atender.'},
  {p:'¿Cuál es un argumento sólido a favor de abrir más días, según el texto?',n:'crítico',o:['Los vecinos lo pidieron','Tras la prueba, aumentó el uso y se duplicaron los préstamos','Doña Marta quería trabajar más'],c:1,e:'Es la única que presenta evidencia (datos del resultado de la prueba).'}],'Texto creado para esta actividad.');
dilema('dilema1','etica','Dilema: la billetera encontrada','Analiza un caso con distintas perspectivas éticas.',
 'Encuentras en el patio del colegio una billetera con dinero, un carné y fotos de una familia. Nadie te vio recogerla. Tienes una necesidad real de dinero esta semana.',
 [['Consecuencias','¿Qué pasa si la devuelves? ¿Y si te la quedas? ¿Quiénes se afectan y cómo?'],['Deberes y reglas','¿Qué deberes tienes con quien perdió la billetera? ¿Qué regla te gustaría que todos siguieran?'],['Virtudes','¿Qué haría una persona honesta y justa? ¿Qué tipo de persona quieres ser?'],['Cuidado y empatía','¿Cómo se sentiría el dueño? ¿Cómo te sentirías tú en su lugar?']],'Ejercicio de reflexión: no hay una única respuesta.');
orden('ley1','democracia','Cómo se hace una ley (en general)','Ordena los pasos básicos de una ley ordinaria en Colombia.',
 ['Se presenta el proyecto de ley','Debate en la comisión de la primera cámara','Debate en la plenaria de la primera cámara','Debates en comisión y plenaria de la segunda cámara','Conciliación entre las cámaras si hay diferencias','Sanción del Presidente'],'Esquema simplificado; existen leyes con trámites especiales.');
clasif('ramas1','politica','Las ramas y órganos del poder público','Clasifica funciones según el órgano que las cumple.',
 ['Rama legislativa','Rama ejecutiva','Rama judicial','Órganos de control','Organización electoral'],
 [['Aprobar leyes','Rama legislativa'],['Hacer cumplir las leyes y administrar el gobierno','Rama ejecutiva'],['Juzgar y resolver conflictos con base en la ley','Rama judicial'],['Vigilar el uso de los recursos públicos (Contraloría)','Órganos de control'],['Organizar las elecciones (Registraduría)','Organización electoral']],'Resumen simplificado de la Constitución de 1991.');
orden('tiempo1','sociales','Línea de tiempo de Colombia','Ordena cinco hechos de la historia de Colombia, del más antiguo al más reciente.',
 ['1810 · Grito de Independencia','1819 · Batalla de Boyacá','1886 · Constitución Política de 1886','1948 · Asesinato de Jorge Eliécer Gaitán (9 de abril)','1991 · Nueva Constitución Política'],'Hechos de referencia; la historia tiene muchas más perspectivas y procesos.');
orden('conflicto1','ciudadanas','Pasos para resolver un conflicto con diálogo','Ordena los pasos de una conversación para resolver un conflicto.',
 ['Calmarme y escuchar a la otra persona','Decir lo que siento sin ofender ("yo siento… cuando…")','Identificar cuál es el problema y qué necesita cada uno','Proponer varias opciones de solución','Elegir juntos una solución y acordarla','Revisar después si la solución funcionó'],'Una ruta posible; en situaciones de violencia o acoso, busca ayuda de un adulto o del docente.');

/* ---- ampliación de actividades (etapa 5) ---- */
preg('lectura2','lectura','Texto argumentativo: ¿celulares en clase?','Identifica la tesis, los argumentos y las falacias en un texto de opinión.',
 'Opinión: celulares en el salón\n\nCreo que el colegio debería permitir el celular en clase solo para actividades guiadas por el docente. Primero, el celular permite consultar información al instante, como el significado de una palabra o un mapa. Segundo, muchos estudiantes ya lo usan para tomar fotos al tablero, lo que les ahorra tiempo. Sin embargo, reconozco que puede distraer; por eso propongo reglas claras, como guardarlo cuando el docente lo indique. Quienes se oponen dicen que "todos los jóvenes son adictos a las pantallas", pero esa afirmación generaliza sin pruebas.',
 [{p:'¿Cuál es la tesis del autor?',n:'literal',o:['El celular debe prohibirse siempre','El celular debería permitirse solo para actividades guiadas por el docente','Los jóvenes son adictos a las pantallas'],c:1,e:'La tesis es la postura central, que aparece en la primera oración.'},
  {p:'¿Qué hace el autor cuando dice "reconozco que puede distraer"?',n:'inferencial',o:['Se contradice','Admite una objeción para fortalecer su propuesta','Cambia de tema'],c:1,e:'Reconocer una objeción y responderla con reglas hace más sólida su argumentación.'},
  {p:'La frase "todos los jóvenes son adictos a las pantallas" es un ejemplo de…',n:'crítico',o:['Generalización apresurada','Dato estadístico verificado','Argumento de autoridad'],c:0,e:'Afirma algo sobre "todos" sin pruebas: es una generalización apresurada.'}],'Texto creado para esta actividad.');
preg('lectura3','lectura','Lectura narrativa: el pozo seco','Infiere intenciones, causas y el sentido del texto.',
 'El pozo seco\n\nCada tarde, Mateo caminaba hasta el pozo del patio y dejaba caer una piedra. Contaba hasta que oía el golpe. Cuando su abuela le preguntó por qué lo hacía, él respondió: "Para saber si el agua ya volvió". Ella sonrió, le acarició la cabeza y esa noche guardó un balde bajo el alero para recoger la lluvia.',
 [{p:'¿Qué hacía Mateo cada tarde?',n:'literal',o:['Sacaba agua del pozo','Dejaba caer una piedra en el pozo','Limpiaba el patio'],c:1,e:'El texto lo dice en la primera oración.'},
  {p:'¿Por qué la abuela guardó un balde bajo el alero?',n:'inferencial',o:['Para jugar con Mateo','Porque entendió que hacía falta agua y quiso recogerla','Porque el balde estaba roto'],c:1,e:'Al escuchar a Mateo entendió la escasez de agua y actuó.'},
  {p:'¿Qué muestra el texto sobre la actitud de Mateo?',n:'crítico',o:['Que le preocupa algo de su entorno y lo observa con constancia','Que es desobediente','Que no sabe contar'],c:0,e:'Su rutina de observar el pozo revela preocupación y atención por el agua.'}],'Texto creado para esta actividad.');
dilema('dilema2','etica','Dilema: copiar en un examen','Analiza qué es justo cuando hay presión por las notas.',
 'Un compañero al que aprecias te pide que le dejes ver tus respuestas porque, si pierde la materia, sus papás no lo dejarán seguir en el equipo de fútbol. Sabes que copiar no está permitido.',
 [['Consecuencias','¿Qué pasa con tu compañero, contigo y con el grupo si lo permites? ¿Y si no?'],['Deberes y reglas','¿Qué pasaría si todos copiaran? ¿Qué valor tiene la regla del examen?'],['Virtudes','¿Cómo se ven la honestidad y la lealtad aquí? ¿Pueden ayudarse sin copiar?'],['Alternativas','¿Podrías ofrecer estudiar juntos o hablar con el docente sobre su situación?']],'Ejercicio de reflexión: no hay una única respuesta.');
dilema('dilema3','etica','Dilema: un secreto que preocupa','¿Cuándo guardar un secreto y cuándo pedir ayuda?',
 'Una amiga te cuenta que se siente muy triste hace semanas y te pide que no se lo digas a nadie. Tú te preocupas por ella.',
 [['Cuidado y empatía','¿Cómo puedes acompañarla y escucharla sin juzgar?'],['Deberes','¿Qué deberes tienes con su bienestar y con su confianza?'],['Consecuencias','¿Qué puede pasar si nadie más lo sabe? ¿Y si lo cuentas a un adulto de confianza?'],['Virtudes','¿Qué haría una persona prudente y valiente?']],'Si te sientes triste o conoces a alguien así, habla con tu docente, orientador o un adulto de confianza. No estás solo/a.');
clasif('regiones1','sociales','Regiones naturales de Colombia','Clasifica ciudades y lugares según su región natural.',
 ['Región Andina','Región Caribe','Región Pacífica','Región de la Orinoquía','Región Amazónica'],
 [['Bogotá','Región Andina'],['Medellín','Región Andina'],['Cartagena','Región Caribe'],['Sierra Nevada de Santa Marta','Región Caribe'],['Buenaventura','Región Pacífica'],['Villavicencio','Región de la Orinoquía'],['Leticia','Región Amazónica']],'Clasificación general; hay zonas de transición entre regiones.');
clasif('fuentes1','sociales','Fuentes históricas: primarias y secundarias','Distingue fuentes de la época de los hechos y fuentes que los interpretan después.',
 ['Fuente primaria','Fuente secundaria'],
 [['Carta escrita por un soldado en 1819','Fuente primaria'],['Libro de texto sobre la Independencia','Fuente secundaria'],['Fotografía tomada en 1930 de una plaza','Fuente primaria'],['Documental hecho en 2015 sobre la Constitución de 1991','Fuente secundaria'],['Acta de una reunión del concejo municipal de 1850','Fuente primaria']],'Una fuente primaria viene de la época estudiada; una secundaria la analiza después.');
clasif('mecanismos1','democracia','Mecanismos de participación ciudadana','Relaciona cada descripción con el mecanismo (Ley 134 de 1994 y Constitución de 1991).',
 ['Voto','Plebiscito','Referendo','Consulta popular','Cabildo abierto','Revocatoria del mandato'],
 [['Los ciudadanos eligen a sus gobernantes en las urnas','Voto'],['Se pide al pueblo apoyar o rechazar una decisión del Presidente','Plebiscito'],['Los ciudadanos aprueban o rechazan un proyecto de norma','Referendo'],['Se consulta a la comunidad sobre un asunto de interés general de la nación, el departamento o el municipio','Consulta popular'],['Reunión pública del concejo o la asamblea donde la comunidad discute asuntos de su interés','Cabildo abierto'],['Los ciudadanos deciden si terminan el mandato de un alcalde o gobernador','Revocatoria del mandato']],'Definiciones generales; los requisitos exactos los fija la ley.');
preg('politica2','politica','Separación de poderes y controles','Lee y razona sobre por qué existen varias ramas del poder.',
 'En muchos países el poder público no está concentrado en una sola persona o institución. En Colombia, una rama hace las leyes, otra las ejecuta y administra el Estado, y otra resuelve conflictos aplicando la ley. Además, existen órganos de control que vigilan, por ejemplo, el manejo de los recursos públicos. Esta división busca que unas instituciones puedan equilibrar y vigilar a las otras.',
 [{p:'¿Qué rama aplica la ley para resolver conflictos?',n:'literal',o:['La legislativa','La ejecutiva','La judicial'],c:2,e:'La rama judicial resuelve conflictos aplicando la ley.'},
  {p:'¿Para qué sirve, según el texto, dividir el poder?',n:'inferencial',o:['Para que unas instituciones equilibren y vigilen a otras','Para que todas hagan lo mismo','Para eliminar los controles'],c:0,e:'El texto dice que la división busca equilibrio y vigilancia mutua.'},
  {p:'¿Qué pregunta ayudaría a analizar este tema con pensamiento crítico?',n:'crítico',o:['¿Quién me cae mejor?','¿Qué pasaría si todo el poder estuviera en una sola institución?','¿De qué color es el edificio del Congreso?'],c:1,e:'Es una pregunta que invita a analizar consecuencias, no a opinar sobre personas.'}],'Texto creado para esta actividad; presenta hechos generales, sin posturas partidistas.');
dilema('conflicto2','ciudadanas','Caso: burlas en el grupo','Analiza una situación de burlas y qué puede hacer cada persona.',
 'En el chat del curso, varios compañeros se burlan de las fotos de una estudiante. Ella ha dejado de participar en clase. Tú viste los mensajes y no los escribiste.',
 [['Quien recibe las burlas','¿Cómo se puede sentir? ¿Qué necesita de sus compañeros y de los adultos?'],['Quien observa','¿Qué puedes hacer? (no reírte, apoyar a tu compañera, no reenviar, avisar a un adulto)'],['Quien se burla','¿Qué efectos tiene lo que escribe? ¿Cómo puede reparar el daño?'],['Los adultos y el colegio','¿A quién puede acudir el grupo? ¿Qué rutas de convivencia existen?']],'Si ves o sufres acoso, cuéntaselo a tu docente, coordinador u orientador. Pedir ayuda no es "chismosear".');
clasif('color1','arte','Elementos del arte: el color','Clasifica colores según su familia.',
 ['Colores primarios','Colores secundarios','Colores cálidos','Colores fríos'],
 [['Rojo, azul y amarillo (base de las mezclas)','Colores primarios'],['Naranja, verde y violeta (mezcla de dos primarios)','Colores secundarios'],['Rojo, naranja y amarillo (sensación de calor)','Colores cálidos'],['Azul, verde y violeta (sensación de calma)','Colores fríos']],'Clasificación básica del círculo cromático tradicional.');
clasif('capacidades1','edfisica','Capacidades físicas','Relaciona cada ejercicio con la capacidad física que trabaja.',
 ['Fuerza','Resistencia','Velocidad','Flexibilidad'],
 [['Hacer sentadillas con el peso del cuerpo','Fuerza'],['Trotar 20 minutos sin parar','Resistencia'],['Correr 50 metros lo más rápido posible','Velocidad'],['Estirar el tronco hasta tocar la punta de los pies','Flexibilidad']],'Información general; consulta a tu docente si tienes alguna limitación de salud.');
orden('calentamiento1','edfisica','Cómo estructurar una sesión de ejercicio','Ordena las partes de una sesión segura.',
 ['Movilidad de articulaciones','Trote suave para subir la temperatura','Estiramiento dinámico','Ejercicio o juego principal','Vuelta a la calma y estiramiento final'],'Orientación general; ajústala con tu docente.');
/* ===== Laboratorio de Química: titulación ácido–base (reemplaza al simulador básico 'ph'; respaldo: sims.js.pre_lab) ===== */
(function(){
const i0=L.findIndex(s=>s.id==='ph');if(i0<0)return;
const U=['#dc2626','#ef4444','#ea580c','#f97316','#f59e0b','#facc15','#a3e635','#22c55e','#10b981','#14b8a6','#3b82f6','#6366f1','#7c3aed','#9333ea','#581c87'];
const hx=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));const rgb=c=>`rgb(${c[0]},${c[1]},${c[2]})`;
const IND={
 fen:{n:'Fenolftaleína',lo:8.2,hi:10,c1:[236,246,250],c2:[236,72,153],n1:'incoloro',n2:'rosa intenso'},
 azb:{n:'Azul de bromotimol',lo:6,hi:7.6,c1:[250,204,21],c2:[37,99,235],n1:'amarillo',n2:'azul'},
 nmt:{n:'Naranja de metilo',lo:3.1,hi:4.4,c1:[220,38,38],c2:[250,204,21],n1:'rojo',n2:'amarillo'},
 uni:{n:'Indicador universal'}};
const colorOf=(k,pH)=>{const I=IND[k];if(k==='uni'){const p=Math.max(0,Math.min(14,pH)),a=Math.floor(p),b=Math.min(14,a+1);return mix(hx(U[a]),hx(U[b]),p-a)}
 const t=Math.max(0,Math.min(1,(pH-I.lo)/(I.hi-I.lo)));return mix(I.c1,I.c2,t)};
const nameOf=(k,pH)=>{if(k==='uni')return pH<3?'rojo':pH<5?'naranja':pH<6.5?'amarillo':pH<7.5?'verde':pH<10?'azul':'violeta';const I=IND[k];return pH<I.lo?I.n1:pH>I.hi?I.n2:'en transición'};
const KA=1.8e-5,KW=1e-14;
function phAt(P,vb){const Va=P.Va/1000,Vb=vb/1000,V=Va+Vb,ca=P.Ca*Va/V,na=P.Cb*Vb/V;
 const g=p=>{const H=Math.pow(10,-p);return H+na-KW/H-(P.weak?ca*KA/(KA+H):ca)};let lo=-1,hi=15;for(let i=0;i<60;i++){const m=(lo+hi)/2;g(m)>0?lo=m:hi=m}return(lo+hi)/2}
const f2=(v,d)=>(+v).toFixed(d==null?2:d).replace('.',',');
const QZ=[['En la titulación de un ácido fuerte con una base fuerte, el pH en el punto de equivalencia es…',['menor que 7','igual a 7','mayor que 7'],1,'Se forma una sal neutra (NaCl) y agua: pH ≈ 7.'],
 ['Para titular ácido acético (débil) con NaOH, el indicador más adecuado es…',['Naranja de metilo (cambia en pH 3–4)','Fenolftaleína (cambia en pH 8–10)'],1,'La sal formada es básica (pH ≈ 8,7 en el equivalente); la fenolftaleína cambia justo en esa zona.'],
 ['Si duplicas la concentración del ácido, el volumen de base necesario para neutralizarlo…',['se reduce a la mitad','no cambia','se duplica'],2,'Ca·Va = Cb·Vb: si Ca se duplica y lo demás igual, Vb se duplica.']];
const NEW={id:'ph',lab:'quimica',t:'Titulación ácido–base y escala de pH',d:'Mesa de laboratorio con bureta, matraz, indicador y pH-metro. Añade base gota a gota, observa el color y construye la curva de titulación.',
 mount(el){
  const S={vb:0,run:false,drop:0,log:[],mode:'libre',hid:0.1,tries:0,key:'',cur:null};
  const rnd=()=>{S.hid=Math.round((0.05+Math.random()*0.10)*100)/100;S.tries=0};rnd();
  const sel=(id,opts)=>`<select id="${id}" style="width:100%;padding:7px;border:1.5px solid #cbd5e1;border-radius:9px;font-weight:700;margin-top:3px">${opts.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join('')}</select>`;
  const lb=t=>`<label style="display:block;font-size:12px;font-weight:800;margin-top:8px">${t}</label>`;
  shell(el,
   lb('Modo')+sel('q_mode',[['libre','Libre: explora y observa'],['reto','Reto: ¿cuál es la concentración del ácido?']])+
   lb('Sustancia en el matraz')+sel('q_sus',[['f','HCl — ácido fuerte'],['d','CH₃COOH — ácido débil (vinagre)']])+
   lb('Indicador')+sel('q_ind',[['fen','Fenolftaleína'],['azb','Azul de bromotimol'],['nmt','Naranja de metilo'],['uni','Indicador universal']])+
   '<div id="q_cawrap">'+sl('q_ca','Concentración del ácido (mol/L)',0.05,0.15,0.1,0.01)+'</div>'+
   sl('q_va','Volumen de ácido en el matraz (mL)',10,30,25,1)+
   sl('q_vb','Base NaOH 0,1 mol/L añadida (mL)',0,50,0,0.1)+
   '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px"><button class="sim-btn" id="q_p1">+1 mL</button><button class="sim-btn" id="q_p01" style="background:#0d9488">+0,1 mL</button><button class="sim-btn" id="q_run" style="background:#16a34a">▶ Goteo continuo</button><button class="sim-btn" id="q_rs" style="background:#64748b">⟲ Reiniciar</button></div>'+
   '<button class="sim-btn" id="q_reg" style="background:#7c3aed;margin-top:8px">📝 Registrar observación</button>'+
   '<div id="q_reto" style="display:none;margin-top:10px;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:10px"><div style="font-size:12px;font-weight:800;color:#92400e">🎯 Reto</div><div style="font-size:12px;margin:4px 0">Titula hasta que el indicador cambie de color y calcula la concentración del ácido con <b>C·Va = 0,1·Vb</b>.</div><input id="q_ans" type="number" step="0.001" placeholder="Concentración (mol/L)" style="width:100%;padding:8px;border:1.5px solid #cbd5e1;border-radius:9px"><div style="display:flex;gap:6px;margin-top:6px"><button class="sim-btn" id="q_chk">Comprobar</button><button class="sim-btn" id="q_new" style="background:#64748b">Nuevo reto</button></div><div id="q_res" style="font-size:13px;font-weight:700;margin-top:6px"></div></div>'+
   nota('Modelo con disoluciones diluidas a 25 °C; Ka del ácido acético = 1,8×10⁻⁵.'),
   `<div class="sim-panel"><div class="sim-h">🧪 Mesa de laboratorio</div><div id="q_bench" style="max-width:380px;margin:auto"></div><div id="q_state" style="text-align:center;font-weight:800;margin-top:4px"></div><div id="q_scale" style="margin-top:12px"></div></div>`+
   gph('q_cv','📈 Curva de titulación: pH según el volumen de NaOH añadido')+
   `<div class="sim-panel"><div class="sim-h">📋 Registro de observaciones</div><div id="q_log" style="overflow:auto"></div></div>`+
   `<div class="sim-panel"><div class="sim-h">🎯 Objetivos y procedimiento</div><div style="font-size:13px;line-height:1.5"><b>Objetivos:</b> relacionar pH con la concentración de H⁺; reconocer el punto de equivalencia; elegir un indicador adecuado.<br><b>Procedimiento:</b> 1) Elige el ácido y el indicador. 2) Añade base poco a poco (usa gotas de 0,1 mL cerca del cambio de color). 3) Registra volumen, pH y color. 4) Identifica el volumen donde el pH sube bruscamente. 5) Responde el cuestionario.</div></div>`+
   `<div class="sim-panel"><div class="sim-h">❓ Preguntas de comprensión</div><div id="q_quiz"></div><button class="sim-btn" id="q_qc" style="margin-top:8px">Comprobar respuestas</button><div id="q_qr" style="font-size:13px;margin-top:8px"></div></div>`);
  const P=()=>({Ca:S.mode==='reto'?S.hid:val(el,'q_ca'),Va:val(el,'q_va'),Cb:0.1,weak:$(el,'#q_sus').value==='d'});
  const setVb=v=>{S.vb=Math.max(0,Math.min(50,Math.round(v*100)/100));const r=$(el,'#q_vb');r.value=S.vb;$(el,'#q_vbv').textContent=f2(S.vb,1)};
  const bench=(p,pH,ik)=>{const c=colorOf(ik,pH),W=3,top=40,vb=S.vb,tot=p.Va+vb,yl=300-(18+tot/80*50),ly=top+vb*W;
   let t='';for(let m=0;m<=50;m+=10)t+=`<line x1="118" x2="${m%50===0?146:142}" y1="${top+m*W}" y2="${top+m*W}" stroke="#475569"/><text x="150" y="${top+m*W+4}" font-size="10" fill="#475569">${m}</text>`;
   for(let m=5;m<50;m+=10)t+=`<line x1="118" x2="130" y1="${top+m*W}" y2="${top+m*W}" stroke="#94a3b8"/>`;
   const dr=S.run&&vb<50?`<circle cx="128" cy="${214+(S.drop%4)*7}" r="3.2" fill="#7dd3fc"/>`:'';
   return`<svg viewBox="0 0 340 330" style="width:100%;height:auto"><defs><clipPath id="q_fc"><path d="M115 228 L115 250 L88 300 L168 300 L141 250 L141 228 Z"/></clipPath><linearGradient id="q_gl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient></defs>
   <rect x="25" y="316" width="175" height="9" rx="3" fill="#334155"/><rect x="42" y="20" width="7" height="298" fill="#64748b"/><rect x="42" y="72" width="76" height="7" rx="2" fill="#475569"/><rect x="112" y="66" width="30" height="19" rx="4" fill="#334155"/>
   <rect x="118" y="${top}" width="20" height="150" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/><rect x="119.5" y="${ly}" width="17" height="${150-vb*W}" fill="#bae6fd"/>${t}
   <rect x="120" y="190" width="16" height="9" rx="2" fill="#f97316"/><rect x="127" y="199" width="2" height="14" fill="#94a3b8"/>${dr}
   <rect x="70" y="302" width="116" height="14" rx="4" fill="#475569"/><circle cx="170" cy="309" r="3" fill="#22c55e"/>
   <g clip-path="url(#q_fc)"><rect x="80" y="${yl}" width="96" height="${300-yl}" fill="${rgb(c)}"/><rect x="80" y="${yl}" width="96" height="3" fill="#fff" opacity=".45"/></g>
   <path d="M115 228 L115 250 L88 300 L168 300 L141 250 L141 228 Z" fill="url(#q_gl)" stroke="#64748b" stroke-width="2" stroke-linejoin="round"/><rect x="111" y="224" width="34" height="6" rx="2" fill="#cbd5e1" stroke="#64748b"/>
   <ellipse cx="128" cy="297" rx="9" ry="2.6" fill="#fff" stroke="#94a3b8"/>
   <path d="M215 170 C190 190 175 230 148 276" fill="none" stroke="#475569" stroke-width="3"/><rect x="144" y="270" width="8" height="26" rx="3" fill="#94a3b8"/>
   <rect x="215" y="120" width="118" height="96" rx="10" fill="#1e293b"/><rect x="224" y="130" width="100" height="44" rx="6" fill="#052e16"/><text x="274" y="161" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="26" font-weight="700" fill="#4ade80">${f2(Math.max(0,Math.min(14,pH)))}</text><text x="230" y="143" font-size="9" fill="#86efac">pH</text>
   <text x="274" y="197" text-anchor="middle" font-size="10" fill="#cbd5e1" font-weight="700">pH-metro</text><circle cx="236" cy="205" r="3" fill="#ef4444"/><circle cx="248" cy="205" r="3" fill="#facc15"/></svg>`};
  const scale=pH=>{const x=Math.max(0,Math.min(14,pH))/14*100;return`<div style="position:relative;height:18px;border-radius:9px;background:linear-gradient(90deg,${U.join(',')});box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)"><div style="position:absolute;left:${x}%;top:-6px;transform:translateX(-50%);font-size:14px">▼</div></div><div style="display:flex;justify-content:space-between;font-size:10px;font-weight:700;color:#475569;margin-top:2px"><span>0 ácido</span><span>7 neutro</span><span>14 básico</span></div><div style="font-size:11px;color:#64748b;margin-top:4px">🍋 Limón ≈ 2 · 🥛 Leche ≈ 6,5 · 💧 Agua = 7 · 🧼 Jabón ≈ 10 · 🧴 Lejía ≈ 13</div>`};
  const curve=p=>{const k=[p.Ca,p.Va,p.weak].join();if(S.key!==k){const pts=[];for(let i=0;i<=250;i++){const v=i/5;pts.push([v,phAt(p,v)])}S.cur=pts;S.key=k}return S.cur};
  const draw=()=>{const p=P(),ik=$(el,'#q_ind').value,pH=phAt(p,S.vb),Ve=p.Ca*p.Va/p.Cb,reto=S.mode==='reto',I=IND[ik];
   $(el,'#q_bench').innerHTML=bench(p,pH,ik);
   $(el,'#q_state').innerHTML=`<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${rgb(colorOf(ik,pH))};border:1px solid #94a3b8;vertical-align:-2px"></span> ${I.n}: <b>${nameOf(ik,pH)}</b> · ${pH<6.9?'solución ácida':pH>7.1?'solución básica':'solución neutra'}`;
   $(el,'#q_scale').innerHTML=scale(pH);
   const ser=[],pts=[],hl=[],vl=[];const lg=S.log.slice().sort((a,b)=>a.v-b.v);
   if(!reto){ser.push({pts:curve(p),color:'#2563eb',name:'pH calculado'});vl.push({x:Ve,color:'#16a34a',label:'Equivalencia: '+f2(Ve,1)+' mL'});const pe=phAt(p,Ve);
     pts.push({x:0,y:phAt(p,0),label:'Inicio pH '+f2(phAt(p,0)),color:'#7c3aed'},{x:Ve,y:pe,label:'Punto de equivalencia pH '+f2(pe),color:'#16a34a',below:1});
     if(p.weak)pts.push({x:Ve/2,y:phAt(p,Ve/2),label:'Semi-equivalencia pH = pKa ≈ 4,74',color:'#f59e0b'})}
   else if(lg.length)ser.push({pts:lg.map(o=>[o.v,o.pH]),color:'#2563eb',name:'Tus observaciones'});
   if(ik!=='uni'){hl.push({y:I.lo,color:'#f472b6',label:I.n+' cambia en pH '+I.lo+'–'+I.hi},{y:I.hi,color:'#f472b6'})}
   pts.push({x:S.vb,y:pH,r:7,fill:'#f59e0b',color:'#b45309',label:'V = '+f2(S.vb,1)+' mL · pH '+f2(pH)});
   lg.forEach(o=>pts.push({x:o.v,y:o.pH,r:4,fill:'#fff',color:'#7c3aed'}));
   plot($(el,'#q_cv'),{h:320,xmin:0,xmax:50,ymin:0,ymax:14,xl:'Volumen de NaOH añadido (mL)',yl:'pH',series:ser,vlines:vl,hlines:hl,pts});
   const H=Math.pow(10,-pH);
   $(el,'#tl').innerHTML=tile('pH actual',f2(pH),'#2563eb')+tile('[H⁺] (mol/L)',H.toExponential(1).replace('.',','),'#7c3aed')+tile('Base añadida',f2(S.vb,1)+' mL','#0d9488')+tile('Volumen de equivalencia',reto?'¿?':f2(Ve,1)+' mL','#16a34a')+tile('Avance de la neutralización',reto?'—':Math.min(100,S.vb/Ve*100).toFixed(0)+' %','#f59e0b')+tile('Estado',pH<6.9?'Ácido':pH>7.1?'Básico':'Neutro',pH<6.9?'#dc2626':pH>7.1?'#6366f1':'#16a34a');
   $(el,'#eq').textContent=(p.weak?'CH₃COOH + NaOH → CH₃COONa + H₂O\nKa = 1,8×10⁻⁵ → pKa = 4,74\n':'HCl + NaOH → NaCl + H₂O\n')+'pH = −log[H⁺]\nEquivalencia: Cₐ·Vₐ = C_b·V_b'+(reto?'\n(el volumen de equivalencia es lo que debes encontrar)':'\nV_b,eq = '+f2(p.Ca,2)+'·'+p.Va+' / 0,1 = '+f2(Ve,1)+' mL')+(p.weak?'\nEn la equivalencia la sal es básica: pH > 7':'\nEn la equivalencia: pH = 7');
   $(el,'#q_log').innerHTML=S.log.length?`<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#f1f5f9"><th style="padding:5px;text-align:left">NaOH (mL)</th><th>pH</th><th style="text-align:left">Color del indicador</th></tr>${lg.map(o=>`<tr style="border-top:1px solid #e2e8f0"><td style="padding:5px">${f2(o.v,1)}</td><td style="text-align:center">${f2(o.pH)}</td><td>${esc(o.c)}</td></tr>`).join('')}</table><button class="sim-btn" id="q_clr" style="background:#64748b;margin-top:6px">Borrar registro</button>`:'<div style="font-size:13px;color:#64748b">Aún no hay observaciones. Pulsa «Registrar observación» en distintos volúmenes para armar tu tabla y tu curva.</div>';
   const cl=$(el,'#q_clr');if(cl)cl.onclick=()=>{S.log=[];draw()}};
  const stop=()=>{S.run=false;const b=$(el,'#q_run');if(b)b.textContent='▶ Goteo continuo'};
  const tick=()=>{if(!el.isConnected){S.run=false;return}if(!S.run)return;const p=P(),Ve=p.Ca*p.Va/p.Cb;S.drop++;const near=Math.abs(S.vb-Ve)<2;setVb(S.vb+(near?0.05:0.2));if(S.vb>=50)stop();draw();if(S.run)setTimeout(tick,100)};
  const reset=()=>{stop();setVb(0);draw()};
  bind(el,['q_ca','q_va'],()=>{stop();draw()});
  const rv=$(el,'#q_vb');rv.oninput=()=>{stop();setVb(+rv.value);draw()};
  $(el,'#q_p1').onclick=()=>{stop();setVb(S.vb+1);draw()};$(el,'#q_p01').onclick=()=>{stop();setVb(S.vb+0.1);draw()};
  $(el,'#q_run').onclick=()=>{if(S.run){stop();return}if(S.vb>=50)setVb(0);S.run=true;$(el,'#q_run').textContent='⏸ Pausar';tick()};
  $(el,'#q_rs').onclick=reset;
  $(el,'#q_sus').onchange=()=>{rnd();$(el,'#q_res').textContent='';reset()};$(el,'#q_ind').onchange=draw;
  $(el,'#q_mode').onchange=()=>{S.mode=$(el,'#q_mode').value;rnd();S.log=[];$(el,'#q_res').textContent='';$(el,'#q_ans').value='';$(el,'#q_reto').style.display=S.mode==='reto'?'block':'none';$(el,'#q_cawrap').style.display=S.mode==='reto'?'none':'block';reset()};
  $(el,'#q_new').onclick=()=>{rnd();S.log=[];$(el,'#q_res').textContent='';$(el,'#q_ans').value='';reset()};
  $(el,'#q_reg').onclick=()=>{const p=P(),ik=$(el,'#q_ind').value,pH=phAt(p,S.vb);if(S.log.length>=40)S.log.shift();S.log.push({v:S.vb,pH,c:nameOf(ik,pH)});draw()};
  $(el,'#q_chk').onclick=()=>{const a=parseFloat($(el,'#q_ans').value),r=$(el,'#q_res');if(!(a>0)){r.style.color='#b45309';r.textContent='Escribe tu cálculo en mol/L.';return}S.tries++;
   if(Math.abs(a-S.hid)/S.hid<=0.05){r.style.color='#16a34a';r.textContent='✅ ¡Correcto! La concentración era '+f2(S.hid,3)+' mol/L. Usaste C·Va = Cb·Vb.'}
   else{r.style.color='#dc2626';r.textContent=S.tries>=3?'❌ Aún no. La concentración era '+f2(S.hid,3)+' mol/L. Revisa en qué volumen cambió el color y usa C = 0,1·Vb / Va.':'❌ Aún no. Busca el volumen donde el indicador cambia y usa C = 0,1·Vb / Va.'}};
  $(el,'#q_quiz').innerHTML=QZ.map((q,i)=>`<div style="margin-bottom:10px"><div style="font-weight:700;font-size:13px">${i+1}. ${esc(q[0])}</div>${q[1].map((o,j)=>`<label style="display:block;font-size:13px;padding:3px 0"><input type="radio" name="q_q${i}" value="${j}"> ${esc(o)}</label>`).join('')}</div>`).join('');
  $(el,'#q_qc').onclick=()=>{let ok=0;const out=QZ.map((q,i)=>{const s=el.querySelector(`input[name=q_q${i}]:checked`);const good=s&&+s.value===q[2];if(good)ok++;return`<div style="margin-bottom:4px">${s?(good?'✅':'❌'):'⚪'} <b>${i+1}.</b> ${good?'Correcto. ':s?'Revisa: ':'Sin responder. '}${esc(q[3])}</div>`}).join('');$(el,'#q_qr').innerHTML=`<b>${ok} de ${QZ.length} correctas</b><br>`+out};
  draw()}};
L[i0]=NEW;
})();

/* ===== Constructor de laboratorios propios (sin IA). Respaldo: sims.js.pre_constructor ===== */
const MFN={sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,sqrt:Math.sqrt,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,min:Math.min,max:Math.max,pow:Math.pow,floor:Math.floor,ceil:Math.ceil,round:Math.round};
const RESERV=Object.keys(MFN).concat(['pi','e']);
function fcomp(src,names){
 const s=String(src==null?'':src).replace(/\s+/g,'').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/\*\*/g,'^');
 if(!s)throw new Error('Escribe una fórmula');
 const re=/(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+)|([A-Za-z_][A-Za-z_0-9]*)|([+\-*\/^(),])/y,T=[];let i=0;
 while(i<s.length){re.lastIndex=i;const m=re.exec(s);if(!m)throw new Error('Símbolo no válido cerca de «'+s.slice(i,i+3)+'». Usa punto para decimales y * para multiplicar.');T.push(m[1]!==undefined?{n:parseFloat(m[1])}:m[2]!==undefined?{id:m[2]}:{op:m[3]});i=re.lastIndex}
 let p=0;const pk=()=>T[p],nx=()=>T[p++],isop=o=>pk()&&pk().op===o;
 const need=o=>{if(!isop(o))throw new Error('Falta «'+o+'» en la fórmula');p++};
 const atom=()=>{const t=nx();if(!t)throw new Error('La fórmula termina antes de tiempo');
  if(t.n!==undefined)return()=>t.n;
  if(t.op==='('){const a=exp();need(')');return a}
  if(t.id){if(isop('(')){p++;const fn=MFN[t.id];if(!fn)throw new Error('Función desconocida «'+t.id+'»');const A=[];if(!isop(')')){A.push(exp());while(isop(',')){p++;A.push(exp())}}need(')');return e=>fn(...A.map(g=>g(e)))}
   if(t.id==='pi')return()=>Math.PI;if(t.id==='e'&&names.indexOf('e')<0)return()=>Math.E;
   if(names.indexOf(t.id)<0)throw new Error('No existe la variable «'+t.id+'». Usa solo los símbolos de tus variables y resultados anteriores.');const k=t.id;return e=>e[k]}
  throw new Error('Símbolo inesperado «'+(t.op||'')+'»')};
 const pw=()=>{const b=atom();if(isop('^')){p++;const x=un();return e=>Math.pow(b(e),x(e))}return b};
 const un=()=>{if(isop('-')){p++;const a=un();return e=>-a(e)}if(isop('+')){p++;return un()}return pw()};
 const term=()=>{let a=un();while(isop('*')||isop('/')){const o=nx().op,b=un(),l=a;a=o==='*'?e=>l(e)*b(e):e=>l(e)/b(e)}return a};
 const exp=()=>{let a=term();while(isop('+')||isop('-')){const o=nx().op,b=term(),l=a;a=o==='+'?e=>l(e)+b(e):e=>l(e)-b(e)}return a};
 const f=exp();if(p<T.length)throw new Error('Sobran símbolos al final de la fórmula');return f}
const KOK=k=>/^[A-Za-z_][A-Za-z_0-9]{0,15}$/.test(k)&&RESERV.indexOf(k)<0;
const num=(v,d)=>{v=parseFloat(String(v).replace(',','.'));return isFinite(v)?v:d};
function norm(sp){sp=sp||{};const V=(sp.vars||[]).slice(0,8).map(v=>({k:String(v.k||'').trim(),l:String(v.l||'').slice(0,60),u:String(v.u||'').slice(0,16),min:num(v.min,0),max:num(v.max,10),v:num(v.v,0),st:num(v.st,1)}));
 const O=(sp.outs||[]).slice(0,8).map(o=>({k:String(o.k||'').trim(),l:String(o.l||'').slice(0,60),u:String(o.u||'').slice(0,16),f:String(o.f||'').slice(0,200),dec:Math.max(0,Math.min(6,Math.round(num(o.dec,2))))}));
 return{lab:sp.lab||'',t:String(sp.t||'').slice(0,120),d:String(sp.d||'').slice(0,300),vars:V,outs:O,gx:sp.gx||'',gy:sp.gy||'',te:String(sp.te||'').slice(0,3000),pr:String(sp.pr||'').slice(0,3000)}}
function compile(sp){sp=norm(sp);const names=[],seen={},fs=[];
 if(!sp.vars.length)return{err:'Agrega al menos una variable.'};if(!sp.outs.length)return{err:'Agrega al menos un resultado.'};
 for(const v of sp.vars){if(!KOK(v.k))return{err:'El símbolo «'+v.k+'» no es válido (letras, números y _; sin espacios; no puede ser nombre de función).'};if(seen[v.k])return{err:'El símbolo «'+v.k+'» está repetido.'};seen[v.k]=1;names.push(v.k);
  if(!(v.max>v.min))return{err:'En «'+v.k+'» el máximo debe ser mayor que el mínimo.'};if(!(v.st>0))return{err:'En «'+v.k+'» el paso debe ser mayor que 0.'}}
 for(const o of sp.outs){if(!KOK(o.k))return{err:'El símbolo del resultado «'+o.k+'» no es válido.'};if(seen[o.k])return{err:'El símbolo «'+o.k+'» está repetido.'};
  try{fs.push([o.k,fcomp(o.f,names.slice())])}catch(x){return{err:'Resultado «'+o.k+'»: '+x.message}}seen[o.k]=1;names.push(o.k)}
 return{sp,run(vals){const env=Object.assign(Object.create(null),vals);fs.forEach(([k,f])=>{env[k]=f(env)});return env}}}
const ffm=(x,d)=>isFinite(x)?(+x).toFixed(d==null?2:d).replace('.',','):'—';
const PAL=['#2563eb','#16a34a','#f59e0b','#7c3aed','#0d9488','#dc2626','#6366f1','#8b5cf6'];
function custom(spec){const C0=compile(spec),sp=C0.sp||norm(spec);
 return{id:'c:custom',lab:sp.lab,t:sp.t||'Laboratorio propio',d:sp.d||'Laboratorio creado por tu docente.',custom:true,
 mount(el){
  if(C0.err){el.innerHTML='<div style="background:#fef2f2;border:1px solid #fecaca;color:#991b1b;border-radius:10px;padding:12px;font-weight:700">⚠️ '+esc(C0.err)+'</div>';return}
  const V=sp.vars,O=sp.outs,S={log:[]},hasG=!!(sp.gx&&sp.gy&&(V.some(v=>v.k===sp.gx))&&(V.concat(O).some(v=>v.k===sp.gy)));
  const lab=x=>esc(x.l||x.k)+(x.u?' ('+esc(x.u)+')':'');
  shell(el,V.map(v=>sl('cs_'+v.k,lab(v),v.min,v.max,Math.min(v.max,Math.max(v.min,v.v)),v.st)).join('')+'<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px"><button class="sim-btn" id="cs_reg" style="background:#7c3aed">📝 Registrar observación</button><button class="sim-btn" id="cs_rs" style="background:#64748b">⟲ Valores iniciales</button></div>'+nota('Modelo creado por tu docente con fórmulas propias.'),
   (hasG?gph('cs_cv','📈 Gráfica'):'')+(sp.te?'<div class="sim-panel"><div class="sim-h">📚 Fundamento teórico</div><div style="white-space:pre-wrap;font-size:13px;line-height:1.5">'+esc(sp.te)+'</div></div>':'')+(sp.pr?'<div class="sim-panel"><div class="sim-h">🧭 Procedimiento</div><div style="white-space:pre-wrap;font-size:13px;line-height:1.5">'+esc(sp.pr)+'</div></div>':'')+'<div class="sim-panel"><div class="sim-h">📋 Registro de observaciones</div><div id="cs_log" style="overflow:auto"></div></div>');
  const get=()=>{const o={};V.forEach(v=>{o[v.k]=val(el,'cs_'+v.k)});return o};
  const draw=()=>{const vals=get(),env=C0.run(vals);
   $(el,'#tl').innerHTML=O.map((o,i)=>tile(esc(o.l||o.k),ffm(env[o.k],o.dec)+(o.u?' '+esc(o.u):''),PAL[i%PAL.length])).join('');
   $(el,'#eq').textContent=O.map(o=>(o.l||o.k)+'  ('+o.k+') = '+o.f).join('\n');
   if(hasG){const xv=V.find(v=>v.k===sp.gx),yo=V.concat(O).find(v=>v.k===sp.gy),pts=[];let lo=Infinity,hi=-Infinity;
    for(let i=0;i<=160;i++){const x=xv.min+(xv.max-xv.min)*i/160,en=C0.run(Object.assign({},vals,{[sp.gx]:x})),y=en[sp.gy];if(isFinite(y)){pts.push([x,y]);lo=Math.min(lo,y);hi=Math.max(hi,y)}}
    if(!pts.length){lo=0;hi=1}if(hi-lo<1e-9){hi+=1;lo-=1}const pad=(hi-lo)*0.12,cy=env[sp.gy];
    plot($(el,'#cs_cv'),{h:320,xmin:xv.min,xmax:xv.max,ymin:lo-pad,ymax:hi+pad,xl:lab(xv),yl:lab(yo),series:[{pts,color:'#2563eb',name:esc(yo.l||yo.k)}],
     pts:isFinite(cy)?[{x:vals[sp.gx],y:cy,r:7,fill:'#f59e0b',color:'#b45309',label:sp.gx+' = '+ffm(vals[sp.gx],2)+' · '+sp.gy+' = '+ffm(cy,(O.find(o=>o.k===sp.gy)||{dec:2}).dec)}]:[]})}
   $(el,'#cs_log').innerHTML=S.log.length?'<table style="width:100%;border-collapse:collapse;font-size:12px"><tr style="background:#f1f5f9">'+V.concat(O).map(x=>'<th style="padding:5px;text-align:left">'+esc(x.l||x.k)+'</th>').join('')+'</tr>'+S.log.map(r=>'<tr style="border-top:1px solid #e2e8f0">'+V.concat(O).map(x=>'<td style="padding:5px">'+ffm(r[x.k],x.dec==null?2:x.dec)+'</td>').join('')+'</tr>').join('')+'</table><button class="sim-btn" id="cs_clr" style="background:#64748b;margin-top:6px">Borrar registro</button>':'<div style="font-size:13px;color:#64748b">Aún no hay observaciones. Mueve las variables y pulsa «Registrar observación».</div>';
   const cl=$(el,'#cs_clr');if(cl)cl.onclick=()=>{S.log=[];draw()}};
  bind(el,V.map(v=>'cs_'+v.k),draw);
  $(el,'#cs_reg').onclick=()=>{if(S.log.length>=40)S.log.shift();S.log.push(C0.run(get()));draw()};
  $(el,'#cs_rs').onclick=()=>{V.forEach(v=>{const r=$(el,'#cs_'+v.k);r.value=Math.min(v.max,Math.max(v.min,v.v));$(el,'#cs_'+v.k+'v').textContent=r.value});draw()};
  draw()}}}
const cache={};const cget=id=>{if(cache[id])return cache[id];try{return cache[id]=custom(JSON.parse(id.slice(2)))}catch(x){return null}};
/* ---- plantillas listas para modificar ---- */
const v_=(k,l,u,min,max,v,st)=>({k,l,u,min,max,v,st}),o_=(k,l,u,f,dec)=>({k,l,u,f,dec});
const PLT=[
{lab:'quimica',t:'Celda galvánica (ecuación de Nernst)',d:'Calcula el voltaje de una pila según los metales y las concentraciones.',vars:[v_('Ec','E° del cátodo','V',-2.4,0.9,0.34,0.01),v_('Ea','E° del ánodo','V',-2.4,0.9,-0.76,0.01),v_('n','Electrones transferidos','',1,6,2,1),v_('T','Temperatura','K',273,373,298,1),v_('Cc','Concentración del ion en el cátodo','mol/L',0.01,2,1,0.01),v_('Ca','Concentración del ion en el ánodo','mol/L',0.01,2,1,0.01)],
 outs:[o_('E0','Voltaje estándar E°','V','Ec-Ea',2),o_('Q','Cociente de reacción Q','','Ca/Cc',3),o_('E','Voltaje real de la celda','V','E0-(8.314*T/(n*96485))*ln(Q)',3),o_('G','Energía libre ΔG','kJ/mol','-n*96485*E/1000',1)],gx:'Cc',gy:'E',
 te:'Una celda galvánica convierte energía química en eléctrica. E° = E°cátodo − E°ánodo. La ecuación de Nernst corrige el voltaje cuando las concentraciones no son 1 mol/L: E = E° − (RT/nF)·ln Q. Si E > 0 la reacción es espontánea.\nPotenciales estándar de reducción (V): Mg²⁺ −2,37 · Zn²⁺ −0,76 · Fe²⁺ −0,44 · Cu²⁺ +0,34 · Ag⁺ +0,80.',pr:'1) Deja el cátodo en Cu (0,34 V) y el ánodo en Zn (−0,76 V). 2) Con concentraciones 1 mol/L anota el voltaje. 3) Aumenta la concentración del ion en el cátodo y observa el efecto. 4) Cambia los metales usando la tabla de potenciales. 5) Registra y concluye.'},
{lab:'quimica',t:'Leyes de los gases (PV = nRT)',d:'Relaciona presión, volumen, temperatura y cantidad de gas.',vars:[v_('n','Cantidad de gas','mol',0.1,5,1,0.1),v_('T','Temperatura','K',200,500,300,1),v_('V','Volumen','L',1,50,22.4,0.1)],outs:[o_('P','Presión','atm','n*0.082057*T/V',3),o_('PV','Producto P·V','atm·L','P*V',2)],gx:'V',gy:'P',te:'Ley de los gases ideales: P·V = n·R·T con R = 0,082057 atm·L/(mol·K). A T constante, P y V son inversamente proporcionales (Boyle).',pr:'1) Fija n y T. 2) Cambia V y observa P. 3) Registra 5 datos. 4) Cambia T y repite. 5) Concluye qué relación hay entre P y V.'},
{lab:'quimica',t:'Dilución de soluciones',d:'Calcula la concentración final al diluir con agua.',vars:[v_('C1','Concentración inicial','mol/L',0.1,12,2,0.1),v_('V1','Volumen de solución concentrada','mL',1,100,25,1),v_('V2','Volumen final','mL',50,1000,250,5)],outs:[o_('C2','Concentración final','mol/L','C1*V1/V2',3),o_('F','Factor de dilución','','V2/V1',1),o_('Ag','Agua que se añade','mL','V2-V1',0)],gx:'V2',gy:'C2',te:'En una dilución se conservan los moles de soluto: C₁·V₁ = C₂·V₂.',pr:'1) Elige C₁ y V₁. 2) Aumenta V₂ y observa C₂. 3) Registra datos y concluye.'},
{lab:'quimica',t:'Cinética química de primer orden',d:'Concentración de un reactivo que se consume con el tiempo.',vars:[v_('k','Constante de velocidad','1/s',0.01,1,0.1,0.01),v_('A0','Concentración inicial','mol/L',0.1,2,1,0.1),v_('t','Tiempo','s',0,60,20,1)],outs:[o_('A','Concentración en t','mol/L','A0*exp(-k*t)',3),o_('t12','Vida media','s','ln(2)/k',2),o_('P','Porcentaje que queda','%','A/A0*100',1)],gx:'t',gy:'A',te:'Para una reacción de primer orden: [A] = [A]₀·e^(−kt). La vida media es t½ = ln 2 / k y no depende de la concentración inicial.',pr:'1) Fija k. 2) Mueve t y observa [A]. 3) Cambia A₀ y comprueba que t½ no cambia.'},
{lab:'fisica',t:'Caída libre',d:'Altura y velocidad de un cuerpo que cae.',vars:[v_('h0','Altura inicial','m',1,100,20,1),v_('g','Gravedad','m/s²',1.6,25,9.8,0.1),v_('t','Tiempo','s',0,5,1,0.05)],outs:[o_('tc','Tiempo de caída','s','sqrt(2*h0/g)',2),o_('y','Altura en t','m','max(0,h0-0.5*g*t^2)',2),o_('v','Velocidad en t','m/s','g*min(t,tc)',2)],gx:'t',gy:'y',te:'Sin rozamiento: y = h₀ − ½·g·t²; v = g·t. El tiempo de caída es √(2h₀/g).',pr:'1) Elige h₀. 2) Mueve t y mide y y v. 3) Cambia g (Luna 1,6; Tierra 9,8) y compara.'},
{lab:'fisica',t:'Resorte y ley de Hooke',d:'Estiramiento, energía y periodo de un resorte con una masa.',vars:[v_('k','Constante del resorte','N/m',10,500,100,5),v_('m','Masa','kg',0.1,5,1,0.1)],outs:[o_('x','Estiramiento','m','m*9.8/k',3),o_('Ee','Energía elástica','J','0.5*k*x^2',3),o_('T','Periodo de oscilación','s','2*pi*sqrt(m/k)',3)],gx:'m',gy:'x',te:'Hooke: F = k·x. En equilibrio m·g = k·x. Periodo T = 2π√(m/k).',pr:'1) Fija k. 2) Aumenta m y mide x. 3) Cambia k y compara.'},
{lab:'fisica',t:'Péndulo simple',d:'Periodo y frecuencia según la longitud y la gravedad.',vars:[v_('L','Longitud','m',0.1,3,1,0.05),v_('g','Gravedad','m/s²',1.6,25,9.8,0.1)],outs:[o_('T','Periodo','s','2*pi*sqrt(L/g)',3),o_('f','Frecuencia','Hz','1/T',3)],gx:'L',gy:'T',te:'Para ángulos pequeños T = 2π√(L/g). El periodo no depende de la masa.',pr:'1) Mide T con distintas L. 2) Cambia g. 3) Concluye cómo varía T.'},
{lab:'fisica',t:'Energía mecánica',d:'Energía potencial, cinética y total.',vars:[v_('m','Masa','kg',0.1,10,2,0.1),v_('h','Altura','m',0,50,10,1),v_('v','Velocidad','m/s',0,40,5,0.5)],outs:[o_('Ep','Energía potencial','J','m*9.8*h',1),o_('Ec','Energía cinética','J','0.5*m*v^2',1),o_('Et','Energía mecánica total','J','Ep+Ec',1)],gx:'h',gy:'Ep',te:'Ep = m·g·h; Ec = ½·m·v²; Et = Ep + Ec.',pr:'1) Mueve h y v. 2) Observa cómo se reparte la energía. 3) Registra y concluye.'},
{lab:'matematicas',t:'Crecimiento exponencial (interés compuesto)',d:'Cómo crece un capital o una población.',vars:[v_('P','Valor inicial','',100,10000,1000,100),v_('r','Tasa por periodo','%',0,20,5,0.5),v_('t','Periodos','',0,30,10,1)],outs:[o_('M','Valor final','','P*(1+r/100)^t',2),o_('G','Ganancia','','M-P',2)],gx:'t',gy:'M',te:'M = P·(1 + r/100)^t. Crece cada vez más rápido: es una función exponencial.',pr:'1) Fija P y r. 2) Mueve t. 3) Cambia r y compara las curvas.'},
{lab:'matematicas',t:'Función seno',d:'Amplitud, frecuencia y desfase de una onda.',vars:[v_('A','Amplitud','',0.5,5,2,0.1),v_('w','Frecuencia angular','rad',0.5,5,1,0.1),v_('p','Desfase','rad',-3.14,3.14,0,0.1),v_('x','Ángulo x','rad',0,6.28,1,0.05)],outs:[o_('y','y = A·sen(w·x + p)','','A*sin(w*x+p)',3),o_('T','Periodo','','2*pi/w',3)],gx:'x',gy:'y',te:'y = A·sen(w·x + φ). A es la altura máxima, w cambia cuántas ondas caben y φ desplaza la gráfica. Periodo = 2π/w.',pr:'1) Cambia A y mira la altura. 2) Cambia w y mira el periodo. 3) Cambia el desfase.'},
{lab:'biologia',t:'Crecimiento poblacional logístico',d:'Una población que crece hasta la capacidad del ambiente.',vars:[v_('N0','Población inicial','',1,100,10,1),v_('r','Tasa de crecimiento','',0.05,1.5,0.4,0.05),v_('K','Capacidad de carga','',50,1000,500,10),v_('t','Tiempo','',0,40,10,1)],outs:[o_('N','Población en t','','K/(1+((K-N0)/N0)*exp(-r*t))',1),o_('P','Porcentaje de K','%','N/K*100',1)],gx:'t',gy:'N',te:'Al principio la población crece casi exponencialmente, y luego se frena al acercarse a la capacidad de carga K (curva en S).',pr:'1) Fija N₀ y r. 2) Mueve t. 3) Cambia K y r y compara.'},
{lab:'biologia',t:'Equilibrio de Hardy–Weinberg',d:'Frecuencias genotípicas a partir de la frecuencia de un alelo.',vars:[v_('p','Frecuencia del alelo A','',0,1,0.5,0.01)],outs:[o_('q','Frecuencia del alelo a','','1-p',2),o_('AA','Genotipo AA','','p^2',3),o_('Aa','Genotipo Aa','','2*p*q',3),o_('aa','Genotipo aa','','q^2',3)],gx:'p',gy:'Aa',te:'p + q = 1 y p² + 2pq + q² = 1. Los heterocigotos (2pq) son más frecuentes cuando p = q = 0,5.',pr:'1) Mueve p. 2) Registra AA, Aa y aa. 3) Encuentra dónde Aa es máximo.'},
{lab:'edfisica',t:'Frecuencia cardíaca y esfuerzo',d:'Zona de trabajo según la edad y la intensidad.',vars:[v_('edad','Edad','años',10,60,15,1),v_('I','Intensidad del ejercicio','%',50,95,70,1)],outs:[o_('FM','Frecuencia cardíaca máxima estimada','lat/min','220-edad',0),o_('FO','Frecuencia cardíaca objetivo','lat/min','FM*I/100',0),o_('S','Límite superior de zona aeróbica (80 %)','lat/min','FM*0.8',0)],gx:'I',gy:'FO',te:'Estimación general: FCmáx ≈ 220 − edad. Zona aeróbica ≈ 60–80 % de la FCmáx. Es una guía, no un diagnóstico.',pr:'1) Toma tu pulso en reposo y después de 30 s de ejercicio. 2) Compáralo con la zona calculada. 3) Registra.'}];
const blank=lab=>({lab:lab||'',t:'',d:'',vars:[v_('x','Variable','',0,10,5,1)],outs:[o_('y','Resultado','','2*x',2)],gx:'x',gy:'y',te:'',pr:''});
/* ---- diseñador (formulario del docente) ---- */
const ip='style="width:100%;padding:6px;border:1.5px solid #cbd5e1;border-radius:8px;font-size:13px"';
function dHtml(sp,lab){sp=norm(sp);const pl=PLT.filter(p=>!lab||p.lab===lab);const vs=sp.vars.concat(sp.outs);
 const fld=(t,h)=>'<label style="display:block;font-weight:800;font-size:12px;margin:10px 0 3px">'+t+'</label>'+h;
 return '<div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:10px;font-size:13px">💡 <b>Cómo funciona:</b> define las <b>variables</b> que moverá el estudiante y los <b>resultados</b> con una fórmula. Ejemplo: resultado <code>V</code> = <code>I*R</code>. Usa <b>*</b> para multiplicar, <b>/</b> para dividir, <b>^</b> para potencias, punto para decimales, y funciones como <code>sqrt()</code>, <code>sin()</code>, <code>ln()</code>, <code>exp()</code>, <code>pi</code>.</div>'+
 (pl.length?fld('Empezar desde una plantilla (reemplaza lo que tengas)','<select id="sd_tpl" onchange="LAB.sdA(\'tpl\',this.value)" '+ip+'><option value="">— elegir plantilla —</option>'+pl.map(p=>'<option value="'+PLT.indexOf(p)+'">'+esc(p.t)+'</option>').join('')+'</select>'):'')+
 fld('Título del laboratorio','<input id="sd_t" '+ip+' value="'+esc(sp.t)+'">')+fld('Descripción corta','<input id="sd_d" '+ip+' value="'+esc(sp.d)+'">')+
 '<h4 style="font-weight:800;margin:14px 0 4px">🎚️ Variables (lo que mueve el estudiante)</h4>'+
 sp.vars.map((v,i)=>'<div style="border:1px solid #e2e8f0;border-radius:10px;padding:8px;margin-bottom:6px"><div style="display:grid;grid-template-columns:70px 1fr 80px;gap:6px"><input id="sd_vk'+i+'" '+ip+' placeholder="símbolo" value="'+esc(v.k)+'"><input id="sd_vl'+i+'" '+ip+' placeholder="nombre (ej. Temperatura)" value="'+esc(v.l)+'"><input id="sd_vu'+i+'" '+ip+' placeholder="unidad" value="'+esc(v.u)+'"></div><div style="display:grid;grid-template-columns:repeat(4,1fr) auto;gap:6px;margin-top:6px;align-items:center">'+[['min','Mínimo'],['max','Máximo'],['v','Valor inicial'],['st','Paso']].map(([k,t])=>'<div><div style="font-size:10px;font-weight:700;color:#64748b">'+t+'</div><input id="sd_v'+k+i+'" '+ip+' placeholder="'+t+'" value="'+esc(v[k])+'"></div>').join('')+'<button onclick="LAB.sdA(\'delv\','+i+')" style="color:#dc2626;font-weight:800">✕</button></div></div>').join('')+
 (sp.vars.length<8?'<button onclick="LAB.sdA(\'addv\')" style="background:#0ea5e9;color:#fff;padding:7px 12px;border-radius:9px;font-weight:800;font-size:13px">➕ Agregar variable</button>':'')+
 '<h4 style="font-weight:800;margin:16px 0 4px">🧮 Resultados (se calculan con fórmula)</h4>'+
 sp.outs.map((o,i)=>'<div style="border:1px solid #e2e8f0;border-radius:10px;padding:8px;margin-bottom:6px"><div style="display:grid;grid-template-columns:70px 1fr 80px;gap:6px"><input id="sd_ok'+i+'" '+ip+' placeholder="símbolo" value="'+esc(o.k)+'"><input id="sd_ol'+i+'" '+ip+' placeholder="nombre (ej. Voltaje)" value="'+esc(o.l)+'"><input id="sd_ou'+i+'" '+ip+' placeholder="unidad" value="'+esc(o.u)+'"></div><div style="display:grid;grid-template-columns:1fr 70px auto;gap:6px;margin-top:6px;align-items:center"><div><div style="font-size:10px;font-weight:700;color:#64748b">Fórmula</div><input id="sd_of'+i+'" '+ip+' placeholder="fórmula, ej. I*R" value="'+esc(o.f)+'"></div><div><div style="font-size:10px;font-weight:700;color:#64748b">Decimales</div><input id="sd_od'+i+'" '+ip+' placeholder="decimales" value="'+esc(o.dec)+'"></div><button onclick="LAB.sdA(\'delo\','+i+')" style="color:#dc2626;font-weight:800">✕</button></div></div>').join('')+
 (sp.outs.length<8?'<button onclick="LAB.sdA(\'addo\')" style="background:#0ea5e9;color:#fff;padding:7px 12px;border-radius:9px;font-weight:800;font-size:13px">➕ Agregar resultado</button>':'')+
 '<div style="font-size:12px;color:#64748b;margin-top:6px">Símbolos que puedes usar en las fórmulas: <b>'+(esc(sp.vars.map(v=>v.k).filter(Boolean).join(', '))||'—')+'</b> y los resultados que estén antes en la lista.</div>'+
 '<h4 style="font-weight:800;margin:16px 0 4px">📈 Gráfica</h4><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><label style="font-size:12px;font-weight:700">Eje horizontal (variable)</label><select id="sd_gx" '+ip+'><option value="">Sin gráfica</option>'+sp.vars.map(v=>'<option value="'+esc(v.k)+'" '+(sp.gx===v.k?'selected':'')+'>'+esc(v.l||v.k)+'</option>').join('')+'</select></div><div><label style="font-size:12px;font-weight:700">Eje vertical (resultado)</label><select id="sd_gy" '+ip+'><option value="">Sin gráfica</option>'+vs.map(v=>'<option value="'+esc(v.k)+'" '+(sp.gy===v.k?'selected':'')+'>'+esc(v.l||v.k)+'</option>').join('')+'</select></div></div>'+
 fld('Fundamento teórico (lo verá el estudiante)','<textarea id="sd_te" rows="4" '+ip+'>'+esc(sp.te)+'</textarea>')+fld('Procedimiento (pasos que debe seguir)','<textarea id="sd_pr" rows="4" '+ip+'>'+esc(sp.pr)+'</textarea>')+
 '<div id="sd_err" style="margin-top:8px"></div>'}
function dRead(root,sp){const g=i=>{const x=root.querySelector('#'+i);return x?x.value:''};sp.t=g('sd_t');sp.d=g('sd_d');sp.te=g('sd_te');sp.pr=g('sd_pr');sp.gx=g('sd_gx');sp.gy=g('sd_gy');
 sp.vars=sp.vars.map((v,i)=>({k:g('sd_vk'+i).trim(),l:g('sd_vl'+i),u:g('sd_vu'+i),min:g('sd_vmin'+i),max:g('sd_vmax'+i),v:g('sd_vv'+i),st:g('sd_vst'+i)}));
 sp.outs=sp.outs.map((o,i)=>({k:g('sd_ok'+i).trim(),l:g('sd_ol'+i),u:g('sd_ou'+i),f:g('sd_of'+i),dec:g('sd_od'+i)}));return sp}
const dCheck=sp=>{const c=compile(sp);if(c.err)return c.err;const s=c.sp;if(!s.t.trim())return'Escribe un título para tu laboratorio.';
 if((s.gx&&!s.gy)||(!s.gx&&s.gy))return'Para la gráfica elige los dos ejes (o ninguno).';return''};

return{list:lab=>L.filter(s=>s.lab===lab),get:id=>(typeof id==='string'&&id.slice(0,2)==='c:')?cget(id):L.find(s=>s.id===id),all:L,custom,plantillas:PLT,blank,dHtml,dRead,dCheck,compile,norm,fcomp,plot,tile};})();
