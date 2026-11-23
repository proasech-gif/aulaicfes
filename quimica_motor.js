/* AULA360 — Motores de simulación del catálogo de Química (modelos propios, sin dependencias externas).
   Cada motor es un MODELO simplificado con valores de referencia reales; sus límites se declaran en cada laboratorio. */
window.QMOT=(function(){
const E={};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fm=(v,d)=>isFinite(v)?(+v).toFixed(d==null?2:d).replace('.',','):'—';
const $=(el,s)=>el.querySelector(s);
const btn=(id,t,c)=>`<button id="${id}" class="sim-btn" style="background:${c||'#1e63e9'}">${t}</button>`;
const lab=t=>`<label style="display:block;font-size:12px;font-weight:800;margin-top:8px">${t}</label>`;
const sel=(id,opts,v)=>`<select id="${id}" style="width:100%;padding:7px;border:1.5px solid #cbd5e1;border-radius:9px;font-weight:700;margin-top:3px">${opts.map(o=>`<option value="${esc(o[0])}" ${String(o[0])===String(v)?'selected':''}>${esc(o[1])}</option>`).join('')}</select>`;
const rng=(id,t,min,max,v,st)=>`<label style="display:block;font-size:12px;font-weight:800;margin-top:8px">${t}: <b id="${id}v">${v}</b></label><input id="${id}" type="range" min="${min}" max="${max}" step="${st||1}" value="${v}" style="width:100%">`;
const panel=(t,h)=>`<div class="sim-panel"><div class="sim-h">${t}</div>${h}</div>`;
const grid=(c,g)=>`<div class="sim-grid"><div>${c}</div><div>${g}</div></div>`;
const tiles=a=>`<div class="sim-tiles">${a.map(x=>SIM.tile(x[0],x[1],x[2])).join('')}</div>`;
const rd=(x,r)=>{const d=Math.max(0,Math.ceil(-Math.log10(r)-1e-9));return +(Math.round(x/r)*r).toFixed(d)};
const dec=r=>Math.max(0,Math.ceil(-Math.log10(r)-1e-9));
const live=el=>el.isConnected;
const frame=(el,f)=>{const root=el.firstElementChild;let on=true,t0=null;const loop=ts=>{if(!on||!root||!root.isConnected)return;f(ts);requestAnimationFrame(loop)};requestAnimationFrame(loop);return{stop(){on=false},run(){if(!on){on=true;requestAnimationFrame(loop)}}}};
const rnd=seed=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
/* ========== MEDIR: balanza, probeta y densidad ========== */
E.medir=(el,cfg,ctx)=>{const O=cfg.objs,DIV={25:0.5,100:1,250:2};
 const S={i:0,res:cfg.res||0.1,tare:false,cyl:cfg.cyl||100,w0:0,m:null,v:null,tab:[]};S.w0=Math.round(S.cyl*0.4);
 const mat=o=>o.m!=null?o.m:o.rho*o.v;
 el.innerHTML=grid(panel('🎛️ Instrumentos',lab('Objeto o muestra')+sel('m_o',O.map((o,i)=>[i,o.n]),0)+
  (cfg.balanza?lab('Resolución de la balanza')+sel('m_res',[[1,'1 g (balanza de cocina)'],[0.1,'0,1 g (balanza de laboratorio)'],[0.01,'0,01 g (balanza analítica)']],S.res)+(cfg.vaso?`<label style="display:block;font-size:13px;margin-top:6px"><input type="checkbox" id="m_t"> Tarar (balanza en cero con el vaso de ${cfg.vaso} g)</label>`:''):'')+
  (cfg.probeta?lab('Probeta')+sel('m_c',[[25,'25 mL (divisiones de 0,5 mL)'],[100,'100 mL (divisiones de 1 mL)'],[250,'250 mL (divisiones de 2 mL)']],S.cyl)+rng('m_w','Agua inicial (mL)',10,Math.round(S.cyl*0.7),S.w0,1):'')+
  `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">${cfg.balanza?btn('m_pw','⚖️ Pesar','#0d9488'):''}${cfg.probeta?btn('m_pv','💧 Medir volumen','#2563eb'):''}${cfg.densidad?btn('m_pd','🧮 Calcular densidad','#7c3aed'):''}${btn('m_rg','📝 Registrar','#475569')}</div>`+
  (cfg.reto?`<div style="margin-top:10px;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:8px"><div style="font-size:12px;font-weight:800;color:#92400e">🎯 Reto: ¿qué material es la «Muestra X»?</div>${sel('m_ans',[['','— elige —']].concat(cfg.reto.opts.map(k=>[k,k])),'')}<button id="m_ck" class="sim-btn" style="margin-top:6px">Comprobar</button><div id="m_rs" style="font-size:13px;font-weight:700;margin-top:4px"></div></div>`:''))+
  `<div class="sim-panel"><div class="sim-h">📋 Tabla de mediciones</div><div id="m_tb" style="overflow:auto"></div></div>`,
  panel('🔬 Mesa de trabajo','<svg id="m_sv" viewBox="0 0 420 270" style="width:100%;height:auto"></svg>')+'<div id="m_tl"></div>'+(cfg.grafica?panel('📈 Masa en función del volumen','<canvas id="m_cv" style="width:100%;display:block"></canvas>'):''));
 const cur=()=>O[S.i],tr=()=>cfg.vaso?(S.tare?0:cfg.vaso):0;
 const draw=()=>{const o=cur(),m=mat(o),rr=S.res;let h='';
  if(cfg.balanza){const lec=S.m?S.m.l:rd(tr()+0,rr);h+=`<rect x="20" y="200" width="170" height="14" rx="5" fill="#475569"/><rect x="30" y="150" width="150" height="50" rx="8" fill="#e2e8f0" stroke="#94a3b8"/><rect x="40" y="158" width="130" height="30" rx="4" fill="#052e16"/><text x="105" y="181" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="18" font-weight="700" fill="#4ade80">${fm(S.m?S.m.l:rd(tr(),rr),dec(rr))} g</text><rect x="45" y="138" width="120" height="10" rx="3" fill="#94a3b8"/>`;
   if(cfg.vaso)h+=`<path d="M70 138 L75 108 L135 108 L140 138Z" fill="#dbeafe" stroke="#64748b" opacity=".8"/>`;
   h+=S.m?`<circle cx="105" cy="${cfg.vaso?124:122}" r="${Math.max(8,Math.min(22,6+Math.cbrt(o.v||o.m/(o.rho||1))*5))}" fill="${o.c||'#94a3b8'}" stroke="#334155"/>`:'';
   h+=`<text x="105" y="235" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">Balanza · resolución ${fm(rr,dec(rr))} g</text>`}
  if(cfg.probeta){const C=S.cyl,x0=cfg.balanza?250:150,top=20,H=200,vy=v=>top+H-(v/C)*H,w=S.v?S.v.w:S.w0;
   h+=`<rect x="${x0}" y="${top}" width="56" height="${H}" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="2"/><rect x="${x0+1.5}" y="${vy(S.v?S.v.real2:S.w0)}" width="53" height="${top+H-vy(S.v?S.v.real2:S.w0)}" fill="#7dd3fc" opacity=".85"/>`;
   const stepM=C===25?5:C===100?10:50;for(let v=0;v<=C;v+=stepM)h+=`<line x1="${x0}" x2="${x0+14}" y1="${vy(v)}" y2="${vy(v)}" stroke="#334155"/><text x="${x0+60}" y="${vy(v)+4}" font-size="10" fill="#334155">${v}</text>`;
   if(S.v)h+=`<circle cx="${x0+28}" cy="${top+H-12}" r="${Math.max(7,Math.min(16,5+Math.cbrt(o.v||1)*3))}" fill="${o.c||'#94a3b8'}" stroke="#334155"/>`;
   h+=`<text x="${x0+28}" y="245" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">Probeta ${C} mL (mL)</text>`}
  $(el,'#m_sv').innerHTML=h;
  const m2=S.m,v2=S.v,ro=m2&&v2?m2.l/v2.dv:null;
  $(el,'#m_tl').innerHTML=tiles([['Masa leída',m2?fm(m2.l,dec(S.res))+' g':'—','#0d9488'],['Volumen leído',v2?fm(v2.dv,dec(DIV[S.cyl]))+' mL':'—','#2563eb'],['Densidad',ro!=null&&cfg.densidad&&S.d?fm(ro,2)+' g/mL':'—','#7c3aed']]);
  $(el,'#m_tb').innerHTML=S.tab.length?`<table style="width:100%;border-collapse:collapse;font-size:12px"><tr style="background:#f1f5f9"><th style="text-align:left;padding:4px">Objeto</th><th>Masa (g)</th><th>Volumen (mL)</th><th>Densidad (g/mL)</th></tr>${S.tab.map(r=>`<tr style="border-top:1px solid #e2e8f0"><td style="padding:4px">${esc(r.n)}</td><td>${r.m!=null?fm(r.m,dec(r.res)):'—'}</td><td>${r.v!=null?fm(r.v,dec(r.div)):'—'}</td><td>${r.d!=null?fm(r.d,2)+' ± '+fm(r.u,2):'—'}</td></tr>`).join('')}</table>`:'<div style="font-size:12px;color:#64748b">Aún no registras mediciones. Mide y pulsa «Registrar».</div>';
  if(cfg.grafica){const pts=S.tab.filter(r=>r.m!=null&&r.v!=null&&r.mat===cur().mat);const cv=$(el,'#m_cv');
   if(cv){let sl=null;if(pts.length>=2){let sxy=0,sxx=0;pts.forEach(r=>{sxy+=r.m*r.v;sxx+=r.v*r.v});sl=sxy/sxx}
    const vm=Math.max(10,...S.tab.map(r=>r.v||0))*1.2,mm=Math.max(20,...S.tab.map(r=>r.m||0))*1.2;
    SIM.plot(cv,{h:280,xmin:0,xmax:vm,ymin:0,ymax:mm,xl:'Volumen (mL)',yl:'Masa (g)',series:sl?[{f:x=>sl*x,x0:0,x1:vm,color:'#7c3aed',name:'Pendiente = densidad ≈ '+fm(sl,2)+' g/mL'}]:[],pts:pts.map(r=>({x:r.v,y:r.m,color:'#0d9488'}))})}}};
 const rrk=()=>{S.m=null;S.v=null;S.d=false};
 $(el,'#m_o').onchange=e=>{S.i=+e.target.value;rrk();draw()};
 if(cfg.balanza){$(el,'#m_res').onchange=e=>{S.res=+e.target.value;S.m=null;draw()};const t=$(el,'#m_t');if(t)t.onchange=()=>{S.tare=t.checked;S.m=null;draw()};
  $(el,'#m_pw').onclick=()=>{const o=cur(),tot=mat(o)+tr();S.m={l:rd(tot-(cfg.vaso&&!S.tare?0:0),S.res),real:mat(o)};if(cfg.vaso&&!S.tare)S.m.l=rd(tot,S.res);S.m.net=cfg.vaso&&!S.tare?S.m.l-cfg.vaso:S.m.l;if(cfg.vaso&&!S.tare)ctx.obs('Sin tarar, la balanza marca la masa del vaso más la del objeto ('+fm(S.m.l,dec(S.res))+' g).');ctx.act('pesar',{});draw()}}
 if(cfg.probeta){const rs=()=>{const w=$(el,'#m_w');w.max=Math.round(S.cyl*0.7);S.w0=Math.min(+w.value,+w.max);w.value=S.w0;$(el,'#m_wv').textContent=S.w0};
  $(el,'#m_c').onchange=e=>{S.cyl=+e.target.value;S.w0=Math.round(S.cyl*0.4);$(el,'#m_w').value=S.w0;rs();S.v=null;draw()};
  $(el,'#m_w').oninput=e=>{S.w0=+e.target.value;$(el,'#m_wv').textContent=S.w0;S.v=null;draw()};
  $(el,'#m_pv').onclick=()=>{const o=cur(),dv=DIV[S.cyl];if(o.liq){S.v={w:S.w0,real2:S.w0,dv:rd(o.liq,dv),liq:true};ctx.act('volumen',{});draw();return}
   const vo=o.v!=null?o.v:o.m/o.rho;if(S.w0+vo>S.cyl*0.98){ctx.obs('«'+o.n+'» no cabe: sube la probeta o baja el agua.');return}
   const a=rd(S.w0,dv),b=rd(S.w0+vo,dv);S.v={w:S.w0,real2:S.w0+vo,dv:+(b-a).toFixed(dec(dv)),real:vo};ctx.act('volumen',{});draw()}}
 if(cfg.densidad)$(el,'#m_pd').onclick=()=>{if(!S.m||!S.v){ctx.obs('Primero pesa y mide el volumen del mismo objeto.');return}S.d=true;ctx.act('densidad',{});draw()};
 $(el,'#m_rg').onclick=()=>{const o=cur();if(!S.m&&!S.v)return;const dv=DIV[S.cyl],mn=S.m?(cfg.vaso&&!S.tare?S.m.l-cfg.vaso:S.m.l):null,vv=S.v?S.v.dv:null;let d=null,u=null;if(mn!=null&&vv!=null&&vv>0&&cfg.densidad&&S.d){d=mn/vv;u=d*((S.res/2)/Math.max(mn,1e-9)+dv/vv)}
  S.tab.push({n:o.n,mat:o.mat,m:mn,v:vv,d,u,res:S.res,div:dv});if(d!=null)ctx.obs(o.n+': ρ = '+fm(d,2)+' ± '+fm(u,2)+' g/mL');ctx.act('registrar',{});draw()};
 if(cfg.reto)$(el,'#m_ck').onclick=()=>{const a=$(el,'#m_ans').value,r=$(el,'#m_rs');if(!a){r.textContent='Elige una respuesta.';return}if(a===cfg.reto.ok){r.style.color='#16a34a';r.textContent='✅ Correcto: es '+a+' (densidad real '+cfg.reto.rho+' g/mL).';ctx.act('reto',{ok:true})}else{r.style.color='#dc2626';r.textContent='❌ No coincide con tu densidad medida. Revisa los valores de referencia.'}};
 draw();return{reset(){S.tab=[];rrk();draw()}}};
/* ========== PARTÍCULAS: estados de la materia ========== */
E.particulas=(el,cfg,ctx)=>{const SU=cfg.subs;let S={k:0,T:cfg.T0!=null?cfg.T0:20,run:true,vis:{}};
 el.innerHTML=grid(panel('🎛️ Controles',lab('Sustancia')+sel('p_s',SU.map((s,i)=>[i,s.n]),0)+'<div id="p_tw"></div><div style="display:flex;gap:6px;margin-top:10px">'+btn('p_c','❄️ −10 °C','#2563eb')+btn('p_h','🔥 +10 °C','#dc2626')+'</div><div style="font-size:12px;color:#64748b;margin-top:8px">Presión: 1 atm (constante). Mueve la temperatura y observa las partículas.</div>'),
  panel('🔬 Vista de las partículas (modelo)','<canvas id="p_cv" width="400" height="260" style="width:100%;max-width:520px;display:block;margin:auto;border-radius:10px;background:#0f172a"></canvas><div id="p_st" style="text-align:center;font-weight:800;margin-top:6px"></div>')+'<div id="p_tl"></div>');
 const N=48,R=rnd(7),P=[];for(let i=0;i<N;i++)P.push({hx:30+(i%8)*44,hy:150+Math.floor(i/8)*36,x:0,y:0,vx:(R()-.5),vy:(R()-.5)});P.forEach(p=>{p.x=p.hx;p.y=p.hy});
 const sub=()=>SU[S.k],state=()=>S.T<sub().mp?'sólido':S.T<sub().bp?'líquido':'gas';
 const rg=()=>({lo:Math.round(sub().mp-70),hi:Math.round(sub().bp+70)});
 const mkT=()=>{const r=rg();S.T=Math.min(r.hi,Math.max(r.lo,S.T));$(el,'#p_tw').innerHTML=rng('p_t','Temperatura (°C)',r.lo,r.hi,Math.round(S.T),1);$(el,'#p_t').oninput=e=>{S.T=+e.target.value;$(el,'#p_tv').textContent=S.T;upd()}};
 const upd=()=>{const st=state();S.vis[st]=1;ctx.act('estado_'+st,{});ctx.act('visto_'+Object.keys(S.vis).length,{});$(el,'#p_st').innerHTML=`${esc(sub().n)} a ${fm(S.T,0)} °C (${fm(S.T+273.15,1)} K): <span style="color:${st==='sólido'?'#2563eb':st==='líquido'?'#0d9488':'#dc2626'}">${st.toUpperCase()}</span>`;
  $(el,'#p_tl').innerHTML=tiles([['Estado',st,'#7c3aed'],['Punto de fusión',fm(sub().mp,1)+' °C','#2563eb'],['Punto de ebullición',fm(sub().bp,1)+' °C','#dc2626'],['Energía cinética relativa',fm((S.T+273.15)/293.15,2)+' ×','#f59e0b']])};
 $(el,'#p_s').onchange=e=>{S.k=+e.target.value;S.T=Math.round(sub().mp-20);mkT();upd()};
 $(el,'#p_c').onclick=()=>{S.T-=10;mkT();upd()};$(el,'#p_h').onclick=()=>{S.T+=10;mkT();upd()};
 const cv=$(el,'#p_cv'),cx=cv.getContext('2d');let last=null;
 const fr=frame(el,ts=>{if(!S.run)return;const st=state(),vk=Math.sqrt((S.T+273.15)/293.15),W=400,H=260,col=sub().c||'#38bdf8';cx.fillStyle='#0f172a';cx.fillRect(0,0,W,H);cx.strokeStyle='#334155';cx.strokeRect(10,10,W-20,H-20);
  P.forEach(p=>{if(st==='sólido'){const a=0.8+2.2*Math.max(0,Math.min(1,(S.T-(sub().mp-70))/70));p.x+=(p.hx-p.x)*0.2+(R()-.5)*a;p.y+=(p.hy-p.y)*0.2+(R()-.5)*a}
   else{const sp=st==='líquido'?1.2*vk:4*vk;p.vx+=(R()-.5)*0.6;p.vy+=(R()-.5)*0.6;const m=Math.hypot(p.vx,p.vy)||1;p.vx=p.vx/m*sp;p.vy=p.vy/m*sp;p.x+=p.vx;p.y+=p.vy;const top=st==='líquido'?130:14;
    if(p.x<16){p.x=16;p.vx=Math.abs(p.vx)}if(p.x>W-16){p.x=W-16;p.vx=-Math.abs(p.vx)}if(p.y<top){p.y=top;p.vy=Math.abs(p.vy)}if(p.y>H-16){p.y=H-16;p.vy=-Math.abs(p.vy)}}
   cx.beginPath();cx.arc(p.x,p.y,8,0,7);cx.fillStyle=col;cx.fill();cx.strokeStyle='rgba(255,255,255,.5)';cx.stroke()})});
 mkT();upd();return{reset(){S.T=Math.round(sub().mp-20);mkT();upd()},pause(){S.run=false},start(){S.run=true}}};
/* ========== CURVA DE CALENTAMIENTO ========== */
E.curva=(el,cfg,ctx)=>{const SU=cfg.subs;const S={k:0,m:100,P:300,T0:-30,t:0,run:false,seen:{}};
 el.innerHTML=grid(panel('🎛️ Controles',lab('Sustancia')+sel('c_s',SU.map((s,i)=>[i,s.n]),0)+rng('c_m','Masa (g)',10,500,100,10)+rng('c_p','Potencia del calentador (W)',50,1000,300,10)+rng('c_t','Temperatura inicial (°C)',-60,20,-30,5)+'<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">'+btn('c_go','▶ Calentar','#16a34a')+btn('c_ps','⏸ Pausar','#f59e0b')+btn('c_rs','⟲ Reiniciar','#64748b')+'</div><div id="c_nt" style="font-size:12px;color:#92400e;margin-top:8px"></div>'),
  panel('📈 Temperatura en función del tiempo','<canvas id="c_cv" style="width:100%;display:block"></canvas>')+'<div id="c_tl"></div>');
 const sub=()=>SU[S.k];
 const seg=()=>{const s=sub(),m=S.m,P=S.P,L=[];let T=Math.min(S.T0,s.bp+30),t=0;const add=(n,T1,Q,pl)=>{const dt=Q/P;L.push({n,t0:t,t1:t+dt,T0:T,T1,pl,Q});t+=dt;T=T1};
  if(T<s.mp){add('Calentando el sólido',s.mp,m*s.cs*(s.mp-T),false);add('Fusión (sólido → líquido)',s.mp,m*s.Lf,true)}else if(T===s.mp){add('Fusión (sólido → líquido)',s.mp,m*s.Lf,true)}
  if(T<s.bp){add('Calentando el líquido',s.bp,m*s.cl*(s.bp-T),false);add('Ebullición (líquido → gas)',s.bp,m*s.Lv,true)}
  add('Calentando el gas',s.bp+40,m*s.cg*40,false);return L};
 const TT=(L,t)=>{for(const g of L){if(t<=g.t1)return g.T0+(g.T1-g.T0)*(g.t1>g.t0?(t-g.t0)/(g.t1-g.t0):1)}return L[L.length-1].T1};
 const phase=(L,t)=>{for(const g of L){if(t<=g.t1)return g}return L[L.length-1]};
 const draw=()=>{const L=seg(),tm=L[L.length-1].t1,s=sub(),T=TT(L,S.t),g=phase(L,S.t);
  const pts=[[0,L[0].T0]];L.forEach(x=>pts.push([x.t1,x.T1]));const E=P=>P;
  SIM.plot($(el,'#c_cv'),{h:320,xmin:0,xmax:tm*1.04,ymin:Math.min(L[0].T0,s.mp)-15,ymax:s.bp+60,xl:'Tiempo (s)',yl:'Temperatura (°C)',series:[{pts,color:'#2563eb',name:'Curva de calentamiento'}],
   hlines:[{y:s.mp,color:'#0d9488',label:'Fusión '+fm(s.mp,1)+' °C'},{y:s.bp,color:'#dc2626',label:'Ebullición '+fm(s.bp,1)+' °C'}],pts:[{x:S.t,y:T,r:7,fill:'#f59e0b',color:'#b45309',label:fm(T,1)+' °C'}]});
  const Q=S.P*S.t;$(el,'#c_tl').innerHTML=tiles([['Temperatura',fm(T,1)+' °C','#dc2626'],['Proceso',g.n,'#7c3aed'],['Energía suministrada',fm(Q/1000,1)+' kJ','#f59e0b'],['Tiempo transcurrido',fm(S.t,0)+' s','#0d9488'],['Meseta de fusión',fm(L.filter(x=>x.pl)[0]?L.filter(x=>x.pl)[0].t1-L.filter(x=>x.pl)[0].t0:0,0)+' s','#2563eb'],['Meseta de ebullición',fm((L.filter(x=>x.pl).pop()||{t1:0,t0:0}).t1-(L.filter(x=>x.pl).pop()||{t1:0,t0:0}).t0,0)+' s','#16a34a']]);
  $(el,'#c_nt').textContent=s.nota||'';
  if(g.pl&&S.run&&!S.seen[g.n]){S.seen[g.n]=1;ctx.act('meseta',{});ctx.obs('En «'+g.n+'» la temperatura se mantiene en '+fm(T,1)+' °C aunque se sigue entregando energía.')}
  return tm};
 let tmax=draw();const upd=()=>{S.t=0;S.run=false;tmax=draw()};
 $(el,'#c_s').onchange=e=>{S.k=+e.target.value;upd()};
 [['c_m','m'],['c_p','P'],['c_t','T0']].forEach(([i,k])=>{$(el,'#'+i).oninput=e=>{S[k]=+e.target.value;$(el,'#'+i+'v').textContent=e.target.value;upd()}});
 let last=null;const fr=frame(el,ts=>{if(!S.run){last=null;return}if(last==null)last=ts;const dt=(ts-last)/1000;last=ts;S.t=Math.min(tmax,S.t+dt*tmax/14);tmax=draw();if(S.t>=tmax){S.run=false;ctx.act('curva_completa',{})}});
 $(el,'#c_go').onclick=()=>{if(S.t>=tmax)S.t=0;S.run=true;ctx.act('calentar',{})};$(el,'#c_ps').onclick=()=>{S.run=false};$(el,'#c_rs').onclick=upd;
 return{reset:upd,pause(){S.run=false},start(){S.run=true}}};
/* ========== FLOTACIÓN Y HUNDIMIENTO ========== */
E.flota=(el,cfg,ctx)=>{const S={o:0,l:0,s:0,seen:{}};const OB=cfg.objs,LQ=cfg.liqs;
 el.innerHTML=grid(panel('🎛️ Controles',lab('Líquido')+sel('f_l',LQ.map((l,i)=>[i,l.n+' ('+l.rho+' g/mL)']),0)+'<div id="f_sw">'+rng('f_s','Sal disuelta en el agua (g por litro)',0,250,0,5)+'</div>'+lab('Objeto (todos de 100 cm³)')+sel('f_o',OB.map((o,i)=>[i,o.n+' ('+o.rho+' g/mL)']),0)+'<div style="margin-top:10px">'+btn('f_p','🧪 Probar','#16a34a')+'</div><div id="f_vd" style="margin-top:10px;font-weight:800"></div>'),
  panel('🔬 Recipiente','<svg id="f_svg" viewBox="0 0 320 260" style="width:100%;max-width:420px;display:block;margin:auto"></svg>')+'<div id="f_tl"></div>');
 const rl=()=>{const l=LQ[S.l];return l.agua?0.9982+0.00068*S.s:l.rho};
 const draw=()=>{const o=OB[S.o],rl_=rl(),ro=o.rho,flota=ro<=rl_,fr=Math.min(1,ro/rl_),L=60,ly=90,W=320;
  $(el,'#f_sw').style.display=LQ[S.l].agua?'block':'none';
  const surf=ly,bot=230;let by=flota?surf-L*(1-fr):bot-L;
  $(el,'#f_svg').innerHTML=`<rect x="60" y="40" width="200" height="${bot-40+10}" rx="10" fill="#f8fafc" stroke="#64748b" stroke-width="3"/><rect x="63" y="${surf}" width="194" height="${bot+10-surf-3}" fill="${LQ[S.l].c}" opacity=".75"/><line x1="63" x2="257" y1="${surf}" y2="${surf}" stroke="#0369a1" stroke-dasharray="4 3"/><rect x="130" y="${by}" width="${L}" height="${L}" rx="5" fill="${o.c}" stroke="#334155" stroke-width="2"/><text x="160" y="${by+L/2+4}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">${esc(o.n.split(' ')[0])}</text><text x="160" y="22" text-anchor="middle" font-size="13" font-weight="800" fill="${flota?'#16a34a':'#dc2626'}">${flota?'FLOTA':'SE HUNDE'}</text>`;
  const Wn=ro*100*9.8/1000,Em=rl_*100*9.8/1000,Es=flota?Wn:Em;
  $(el,'#f_tl').innerHTML=tiles([['Densidad del objeto',fm(ro,2)+' g/mL','#7c3aed'],['Densidad del líquido',fm(rl_,3)+' g/mL','#2563eb'],['Parte sumergida',flota?fm(fr*100,0)+' %':'100 %','#0d9488'],['Peso',fm(Wn,2)+' N','#dc2626'],['Empuje que recibe',fm(Es,2)+' N','#16a34a']]);
  $(el,'#f_vd').innerHTML=flota?`Como ρ objeto (${fm(ro,2)}) ≤ ρ líquido (${fm(rl_,3)}), el empuje equilibra el peso y flota con ${fm(fr*100,0)} % sumergido.`:`Como ρ objeto (${fm(ro,2)}) > ρ líquido (${fm(rl_,3)}), el empuje máximo (${fm(Em,2)} N) es menor que el peso (${fm(Wn,2)} N): se hunde.`;
  return{flota}};
 const prob=()=>{const r=draw(),k=OB[S.o].n+'|'+LQ[S.l].n;ctx.act('probar',{});if(!S.seen[k]){S.seen[k]=1;ctx.obs(OB[S.o].n+' en '+LQ[S.l].n+(LQ[S.l].agua&&S.s?' (sal '+S.s+' g/L)':'')+': '+(r.flota?'flota':'se hunde')+'.')}
  if(LQ[S.l].agua&&S.s>0&&OB[S.o].huevo&&r.flota)ctx.act('huevo_flota',{})};
 $(el,'#f_l').onchange=e=>{S.l=+e.target.value;draw()};$(el,'#f_o').onchange=e=>{S.o=+e.target.value;draw()};$(el,'#f_s').oninput=e=>{S.s=+e.target.value;$(el,'#f_sv').textContent=e.target.value;draw()};
 $(el,'#f_p').onclick=prob;draw();return{reset(){S.s=0;S.o=0;S.l=0;$(el,'#f_s').value=0;$(el,'#f_sv').textContent='0';$(el,'#f_o').value=0;$(el,'#f_l').value=0;draw()}}};
/* ========== CLASIFICAR: pruebas + decisión con retroalimentación ========== */
E.clasif=(el,cfg,ctx)=>{const S={i:0,done:{},ok:{},tested:{}};const IT=cfg.items;
 el.innerHTML=grid(panel('🧰 '+esc(cfg.tituloItems||'Muestras'),`<div id="k_it" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px"></div>`+lab('Pruebas que puedes hacer')+`<div id="k_ts" style="display:flex;flex-wrap:wrap;gap:6px"></div>`),
  panel('🔬 Resultados de la muestra seleccionada','<div id="k_rs"></div>')+panel('🧩 '+esc(cfg.pregunta||'¿Cómo la clasificas?'),'<div id="k_ct" style="display:flex;flex-wrap:wrap;gap:6px"></div><div id="k_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>')+'<div id="k_tl"></div>');
 const cur=()=>IT[S.i];
 const draw=()=>{const o=cur();$(el,'#k_it').innerHTML=IT.map((x,i)=>`<button data-i="${i}" style="padding:8px;border-radius:10px;border:2px solid ${i===S.i?'#1e63e9':'#e2e8f0'};background:${S.ok[x.k]?'#f0fdf4':'#fff'};font-weight:700;font-size:12px;text-align:center">${x.e||'🧪'}<br>${esc(x.n)}${S.ok[x.k]?' ✅':''}</button>`).join('');
  el.querySelectorAll('#k_it [data-i]').forEach(b=>b.onclick=()=>{S.i=+b.dataset.i;$(el,'#k_fb').textContent='';draw()});
  $(el,'#k_ts').innerHTML=cfg.tests.map(t=>`<button data-t="${t.k}" class="sim-btn" style="background:#0d9488">${esc(t.n)}</button>`).join('');
  el.querySelectorAll('#k_ts [data-t]').forEach(b=>b.onclick=()=>{const t=cfg.tests.find(x=>x.k===b.dataset.t),r=(cfg.res[o.k]||{})[t.k];(S.tested[o.k]=S.tested[o.k]||{})[t.k]=1;ctx.act('prueba',{});ctx.obs(o.n+' — '+t.n+': '+r);draw()});
  const tt=S.tested[o.k]||{};$(el,'#k_rs').innerHTML=`<div style="font-weight:800;margin-bottom:4px">${o.e||''} ${esc(o.n)}</div>`+(Object.keys(tt).length?`<table style="width:100%;border-collapse:collapse;font-size:13px">${cfg.tests.filter(t=>tt[t.k]).map(t=>`<tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;font-weight:700;width:40%">${esc(t.n)}</td><td>${esc(cfg.res[o.k][t.k])}</td></tr>`).join('')}</table>`:'<div style="font-size:13px;color:#64748b">Aún no has hecho pruebas con esta muestra. Pulsa una prueba.</div>');
  $(el,'#k_ct').innerHTML=cfg.cats.map(c=>`<button data-c="${c.k}" class="sim-btn" style="background:#7c3aed">${esc(c.n)}</button>`).join('');
  el.querySelectorAll('#k_ct [data-c]').forEach(b=>b.onclick=()=>{if(!Object.keys(S.tested[o.k]||{}).length){$(el,'#k_fb').style.color='#b45309';$(el,'#k_fb').textContent='Antes de clasificar, haz al menos una prueba con la muestra.';return}
   const ok=b.dataset.c===cfg.ans[o.k];S.done[o.k]=1;if(ok){S.ok[o.k]=1;ctx.act('clasifica_ok',{})}$(el,'#k_fb').style.color=ok?'#16a34a':'#dc2626';$(el,'#k_fb').textContent=(ok?'✅ Correcto. ':'❌ Revisa tus pruebas. ')+(cfg.why[o.k]||'');
   if(Object.keys(S.ok).length===IT.length)ctx.act('todo_ok',{});draw()});
  const n=Object.keys(S.ok).length;$(el,'#k_tl').innerHTML=tiles([['Muestras clasificadas bien',n+' / '+IT.length,'#16a34a'],['Pruebas realizadas',Object.values(S.tested).reduce((a,b)=>a+Object.keys(b).length,0),'#0d9488']])};
 draw();return{reset(){S.done={};S.ok={};S.tested={};S.i=0;$(el,'#k_fb').textContent='';draw()}}};
/* ========== SEPARACIÓN DE MEZCLAS: filtro, decantación, evaporación, destilación ========== */
const MU=T=>2.414e-5*Math.pow(10,247.8/(T+273.15-140));
E.separa=(el,cfg,ctx)=>{const M=cfg.modo,S={};
 if(M==='filtro'){const C=cfg.comps,F=cfg.filtros;S.f=0;S.m=C.map(c=>c.m);S.done=false;
  el.innerHTML=grid(panel('🎛️ Mezcla y filtro',C.map((c,i)=>rng('s_c'+i,c.n+' (g)',0,50,c.m,1)).join('')+lab('Filtro')+sel('s_f',F.map((f,i)=>[i,f.n+' — poro ≈ '+f.p+' µm']),0)+'<div style="margin-top:10px">'+btn('s_go','💧 Verter la mezcla','#16a34a')+'</div>'),
   panel('🔬 Embudo y recipientes','<svg id="s_sv" viewBox="0 0 360 260" style="width:100%;max-width:440px;display:block;margin:auto"></svg>')+'<div id="s_tl"></div><div id="s_tx" style="font-size:13px;font-weight:700;margin-top:6px"></div>');
  const calc=()=>{const f=F[S.f];const ret=[],pas=[];C.forEach((c,i)=>{const pasa=c.dis||c.tam<f.p;(pasa?pas:ret).push({c,m:S.m[i]})});return{ret,pas}};
  const draw=()=>{const r=calc(),mr=r.ret.reduce((a,x)=>a+x.m,0),turb=r.pas.filter(x=>!x.c.dis&&x.m>0).length>0,sal=r.pas.filter(x=>x.c.dis&&x.m>0).length>0;
   const fc=turb?'#d6c9a8':sal?'#e0f2fe':'#bae6fd';
   $(el,'#s_sv').innerHTML=`<path d="M110 30 L250 30 L190 110 L170 110Z" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/><path d="M125 34 L235 34 L188 100 L172 100Z" fill="${S.done?'#fff':'#e2e8f0'}" opacity=".6"/>${S.done?`<path d="M135 40 L225 40 L186 96 L174 96Z" fill="${r.ret[0]?r.ret[0].c.c:'#e2e8f0'}" opacity=".9"/>`:''}<rect x="178" y="110" width="4" height="40" fill="#94a3b8"/><path d="M130 150 L230 150 L222 240 L138 240Z" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>${S.done?`<path d="M133 ${240-Math.min(70,20+30)} L227 ${240-50} L221 238 L139 238Z" fill="${fc}" opacity=".85"/>`:''}<text x="180" y="256" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">Filtrado</text><text x="180" y="20" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">Papel de filtro: ${esc(F[S.f].n)}</text>`;
   $(el,'#s_tl').innerHTML=S.done?tiles([['Queda en el filtro',fm(mr,0)+' g','#7c3aed'],['Pasa al filtrado (sólidos finos)',fm(r.pas.filter(x=>!x.c.dis).reduce((a,x)=>a+x.m,0),0)+' g','#f59e0b'],['Disuelto en el filtrado',fm(r.pas.filter(x=>x.c.dis).reduce((a,x)=>a+x.m,0),0)+' g','#2563eb'],['Aspecto del filtrado',turb?'turbio':'transparente','#0d9488']]):'';
   $(el,'#s_tx').textContent=S.done?(sal?'El filtrado es transparente pero NO es agua pura: la sal sigue disuelta (los iones son mucho más pequeños que el poro).':turb?'Partículas finas atravesaron el filtro: prueba con un poro más pequeño.':'Filtrado sin sólidos visibles.'):''};
  C.forEach((c,i)=>{$(el,'#s_c'+i).oninput=e=>{S.m[i]=+e.target.value;$(el,'#s_c'+i+'v').textContent=e.target.value;S.done=false;draw()}});
  $(el,'#s_f').onchange=e=>{S.f=+e.target.value;S.done=false;draw()};
  $(el,'#s_go').onclick=()=>{S.done=true;ctx.act('filtrar',{});const r=calc();ctx.obs('Filtro '+F[S.f].n+': retiene '+r.ret.map(x=>x.c.n).join(', ')+'; pasa '+(r.pas.map(x=>x.c.n).join(', ')||'nada')+'.');if(r.pas.every(x=>x.c.dis)&&r.ret.length)ctx.act('filtro_bueno',{});draw()};
  draw();return{reset(){S.done=false;draw()}}}
 if(M==='decanta'){S.vo=60;S.vw=100;S.d=0;S.r=20;S.h=10;S.T=20;S.t=0;S.run=false;S.sub='liq';
  el.innerHTML=grid(panel('🎛️ Controles',lab('Tipo de mezcla')+sel('d_m',[['liq','Aceite + agua (embudo de decantación)'],['sol','Arena en agua (sedimentación)']],'liq')+'<div id="d_c"></div>'),panel('🔬 Montaje','<div id="d_v"></div>')+'<div id="d_tl"></div>');
  const ctl=()=>{$(el,'#d_c').innerHTML=S.sub==='liq'?rng('d_o','Aceite (mL)',10,150,S.vo,5)+rng('d_w','Agua (mL)',10,150,S.vw,5)+rng('d_d','Volumen drenado por la llave (mL)',0,300,S.d,1)+'<div style="font-size:12px;color:#64748b;margin-top:6px">El agua (1,00 g/mL) es más densa que el aceite (0,92 g/mL) y queda abajo.</div>':rng('d_r','Radio de la partícula (µm)',1,50,S.r,1)+rng('d_h','Altura del agua (cm)',3,20,S.h,1)+rng('d_t','Temperatura del agua (°C)',5,60,S.T,1)+'<div style="margin-top:8px">'+btn('d_go','▶ Dejar reposar','#16a34a')+btn('d_ps','⏸','#f59e0b')+'</div>';
   const b=(i,k)=>{const x=$(el,'#'+i);if(x)x.oninput=e=>{S[k]=+e.target.value;$(el,'#'+i+'v').textContent=e.target.value;S.t=0;S.run=false;draw()}};b('d_o','vo');b('d_w','vw');b('d_d','d');b('d_r','r');b('d_h','h');b('d_t','T');
   const g=$(el,'#d_go');if(g){g.onclick=()=>{if(S.t>=tt())S.t=0;S.run=true;ctx.act('reposar',{})};$(el,'#d_ps').onclick=()=>{S.run=false}}};
  const stokes=()=>{const r=S.r*1e-6,mu=MU(S.T),v=2/9*(2650-998)*9.8*r*r/mu,Re=998*v*2*r/mu;return{v,Re,mu}};const tt=()=>{const s=stokes();return S.h/100/s.v};
  const draw=()=>{if(S.sub==='liq'){const tot=S.vo+S.vw,H=190,y=v=>200-(v/tot)*H,pw=Math.min(S.d,S.vw),lostO=Math.max(0,S.d-S.vw),leftW=Math.max(0,S.vw-S.d),collW=pw,pur=S.d>0?100*pw/(pw+lostO):0;
    $(el,'#d_v').innerHTML=`<svg viewBox="0 0 360 260" style="width:100%;max-width:420px;display:block;margin:auto"><path d="M110 20 L250 20 L196 215 L164 215Z" fill="#f8fafc" stroke="#64748b" stroke-width="2.5"/><path d="M${112+ (tot?0:0)} ${y(S.vw)} L248 ${y(S.vw)} L196 215 L164 215Z" fill="#7dd3fc" opacity=".75"/><rect x="114" y="${y(S.vw)-(S.vo/tot)*H}" width="132" height="${(S.vo/tot)*H}" fill="#facc15" opacity=".8"/><line x1="130" x2="230" y1="${y(S.vw)}" y2="${y(S.vw)}" stroke="#334155" stroke-dasharray="4 3"/><text x="180" y="${y(S.vw)-(S.vo/tot)*H/2+4}" text-anchor="middle" font-size="12" font-weight="700">Aceite</text><text x="180" y="${y(S.vw)+30}" text-anchor="middle" font-size="12" font-weight="700">Agua</text><rect x="172" y="215" width="16" height="10" fill="#f97316"/><rect x="150" y="228" width="60" height="26" rx="4" fill="${S.d>0?'#7dd3fc':'#f1f5f9'}" stroke="#64748b"/></svg>`;
    $(el,'#d_tl').innerHTML=tiles([['Agua recogida',fm(collW,0)+' mL','#2563eb'],['Aceite que se fue con el agua',fm(lostO,0)+' mL','#dc2626'],['Agua que quedó en el aceite',fm(leftW,0)+' mL','#f59e0b'],['Pureza del agua recogida',S.d>0?fm(pur,0)+' %':'—','#16a34a']]);
    if(S.d>0&&Math.abs(S.d-S.vw)<=0.5)ctx.act('corte_exacto',{});ctx.act('drenar',{})}
   else{const s=stokes(),T=tt(),cl=Math.min(S.h,S.t*s.v*100);
    $(el,'#d_v').innerHTML=`<svg viewBox="0 0 300 250" style="width:100%;max-width:340px;display:block;margin:auto"><rect x="90" y="20" width="120" height="210" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="2.5"/><rect x="92" y="${230-S.h*9}" width="116" height="${S.h*9-2}" fill="${cl>=S.h?'#bae6fd':'#d6c9a8'}" opacity=".85"/><rect x="92" y="${230-S.h*9}" width="116" height="${cl*9}" fill="#bae6fd" opacity=".9"/><rect x="92" y="226" width="116" height="${Math.min(4+0.02*S.t,10)}" fill="#a8956a"/><text x="150" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">Agua clara: ${fm(cl,1)} cm</text></svg>`;
    $(el,'#d_tl').innerHTML=tiles([['Velocidad de caída',fm(s.v*1000,2)+' mm/s','#2563eb'],['Tiempo para aclarar',T<120?fm(T,1)+' s':fm(T/60,1)+' min','#7c3aed'],['Viscosidad del agua',fm(s.mu*1000,2)+' mPa·s','#f59e0b'],['Número de Reynolds',fm(s.Re,3),s.Re<0.1?'#16a34a':'#dc2626']])+(s.Re>=0.1?'<div style="font-size:12px;color:#b91c1c;font-weight:700;margin-top:4px">⚠️ Re ≥ 0,1: la ley de Stokes ya no es válida para esta partícula; el tiempo real sería mayor.</div>':'')}};
  const lp=frame(el,ts=>{if(!S.run||S.sub!=='sol')return;S.t+=tt()/9/60;if(S.t>=tt()){S.t=tt();S.run=false;ctx.act('sedimentado',{})}draw()});
  $(el,'#d_m').onchange=e=>{S.sub=e.target.value;S.t=0;S.run=false;ctl();draw()};ctl();draw();return{reset(){S.t=0;S.run=false;S.d=0;ctl();draw()},pause(){S.run=false}}}
 if(M==='evapora'){S.V=200;S.c=100;S.T=60;S.A=50;S.t=0;S.run=false;const SOL=360;
  el.innerHTML=grid(panel('🎛️ Controles',rng('e_v','Volumen de solución (mL)',50,500,S.V,10)+rng('e_c','Sal disuelta (g por litro)',10,340,S.c,10)+rng('e_t','Temperatura de la plancha (°C)',20,100,S.T,5)+rng('e_a','Área del plato (cm²)',20,100,S.A,5)+'<div style="margin-top:10px">'+btn('e_go','▶ Evaporar','#16a34a')+btn('e_ps','⏸','#f59e0b')+btn('e_rs','⟲','#64748b')+'</div><div style="font-size:12px;color:#64748b;margin-top:8px">Modelo empírico: la rapidez de evaporación crece ≈ 5 % por °C y es proporcional al área. Solubilidad de la sal ≈ 360 g/L.</div>'),
   panel('📈 Volumen restante y cristales','<canvas id="e_cvs" style="width:100%;display:block"></canvas>')+'<div id="e_tl"></div>');
  const rate=()=>0.0005*S.A*Math.exp(0.0527*(S.T-20)),tend=()=>S.V/rate();
  const draw=()=>{const r=rate(),te=tend(),salt=S.c*S.V/1000,V=Math.max(0,S.V-r*S.t),cry=Math.max(0,salt-SOL*V/1000),conc=V>0?salt/(V/1000):0,t1=Math.max(0,(S.V-salt/SOL*1000)/r);
   const tm=Math.max(te,1),vs=x=>Math.max(0,S.V-r*x),cs=x=>Math.max(0,salt-SOL*vs(x)/1000);
   SIM.plot($(el,'#e_cvs'),{h:300,xmin:0,xmax:tm*1.05,ymin:0,ymax:Math.max(S.V,salt)*1.1,xl:'Tiempo (min)',yl:'Volumen (mL) / cristales (g)',series:[{f:vs,x0:0,x1:tm,color:'#2563eb',name:'Volumen de agua (mL)'},{f:cs,x0:0,x1:tm,color:'#dc2626',name:'Sal cristalizada (g)'}],vlines:[{x:t1,color:'#f59e0b',label:'Empieza a cristalizar'}],pts:[{x:S.t,y:V,r:6,fill:'#f59e0b',color:'#b45309'}]});
   $(el,'#e_tl').innerHTML=tiles([['Rapidez de evaporación',fm(r,2)+' mL/min','#2563eb'],['Concentración ahora',fm(Math.min(conc,9999),0)+' g/L','#7c3aed'],['Cristales formados',fm(cry,1)+' g','#dc2626'],['Tiempo total',fm(te,0)+' min','#0d9488'],['Sal en la solución',fm(salt,1)+' g','#f59e0b']]);return te};
  let te=draw();const up=()=>{S.t=0;S.run=false;te=draw()};[['e_v','V'],['e_c','c'],['e_t','T'],['e_a','A']].forEach(([i,k])=>{$(el,'#'+i).oninput=e=>{S[k]=+e.target.value;$(el,'#'+i+'v').textContent=e.target.value;up()}});
  const lp=frame(el,ts=>{if(!S.run)return;S.t=Math.min(te,S.t+te/300);te=draw();if(S.t>=te){S.run=false;ctx.act('seco',{});ctx.obs('Se evaporó toda el agua y quedaron '+fm(S.c*S.V/1000,1)+' g de sal.')}});
  $(el,'#e_go').onclick=()=>{if(S.t>=te)S.t=0;S.run=true;ctx.act('evaporar',{})};$(el,'#e_ps').onclick=()=>{S.run=false};$(el,'#e_rs').onclick=up;return{reset:up,pause(){S.run=false}}}
 if(M==='destila'){const MX=cfg.mezclas;S.k=0;S.v1=100;S.v2=100;S.P=400;S.cut=90;S.t=0;S.run=false;
  el.innerHTML=grid(panel('🎛️ Controles',lab('Mezcla')+sel('t_m',MX.map((m,i)=>[i,m.n]),0)+rng('t_a','Volumen del componente volátil (mL)',20,200,S.v1,10)+'<div id="t_bw"></div>'+rng('t_p','Potencia (W)',100,1000,S.P,50)+rng('t_c','Temperatura de corte del recolector (°C)',20,110,S.cut,1)+'<div style="margin-top:10px">'+btn('t_go','▶ Destilar','#16a34a')+btn('t_ps','⏸','#f59e0b')+btn('t_rs','⟲','#64748b')+'</div><div id="t_nt" style="font-size:12px;color:#92400e;margin-top:8px"></div>'),
   panel('📈 Temperatura del matraz','<canvas id="t_cvs" style="width:100%;display:block"></canvas>')+'<div id="t_tl"></div>');
  const mx=()=>MX[S.k];
  const seg=()=>{const x=mx(),m1=S.v1*x.d1,m2=x.nv?0:S.v2*x.d2,L=[];let T=20,t=0;const add=(n,T1,Q,pl,col)=>{const dt=Q/S.P;L.push({n,t0:t,t1:t+dt,T0:T,T1,pl,col});t+=dt;T=T1};
   const ce=(m1*x.c1+m2*x.c2)+(x.nv?S.v2*1.0*x.c2:0);add('Calentando la mezcla',x.b1,ce*(x.b1-20),false);add('Destila el componente 1 ('+x.n1+')',x.b1,m1*x.L1,true,1);
   if(!x.nv){add('Calentando el resto',x.b2,m2*x.c2*(x.b2-x.b1),false);add('Destila el componente 2 ('+x.n2+')',x.b2,m2*x.L2,true,2);add('Matraz casi seco',x.b2+20,1,false)}else add('Quedan sales sólidas',x.b1+15,1,false);return{L,m1,m2}};
  const TT=(L,t)=>{for(const g of L){if(t<=g.t1)return g.T0+(g.T1-g.T0)*(g.t1>g.t0?(t-g.t0)/(g.t1-g.t0):1)}return L[L.length-1].T1};
  const draw=()=>{const x=mx(),{L,m1,m2}=seg(),tm=L[L.length-1].t1,T=TT(L,S.t);$(el,'#t_bw').innerHTML=x.nv?'':rng('t_b','Volumen del componente menos volátil (mL)',20,200,S.v2,10);const tb=$(el,'#t_b');if(tb)tb.oninput=e=>{S.v2=+e.target.value;$(el,'#t_bv').textContent=e.target.value;up()};
   const col=T<=S.cut?1:2;let f1=0,f2=0,fa=0,fb=0;
   // masa destilada hasta el tiempo actual
   L.forEach(g=>{if(g.pl){const fr=Math.max(0,Math.min(1,(S.t-g.t0)/(g.t1-g.t0||1))),mm=(g.col===1?m1:m2)*fr;const coll=(g.T1<=S.cut)?1:2;if(g.col===1){if(coll===1)f1+=mm;else f2+=mm}else{if(coll===1)fa+=mm;else fb+=mm}}});
   const ent=[['Recolector 1',(f1+fa).toFixed(1),f1,fa],['Recolector 2',(f2+fb).toFixed(1),f2,fb]];
   const pur1=(f1+fa)>0?f1/(f1+fa)*100:0;
   SIM.plot($(el,'#t_cvs'),{h:300,xmin:0,xmax:tm*1.04,ymin:10,ymax:(x.nv?x.b1:x.b2)+40,xl:'Tiempo (s)',yl:'Temperatura (°C)',series:[{pts:[[0,20]].concat(L.map(g=>[g.t1,g.T1])),color:'#2563eb',name:'Temperatura'}],hlines:[{y:S.cut,color:'#f59e0b',label:'Corte del recolector '+S.cut+' °C'},{y:x.b1,color:'#0d9488',label:x.n1+' '+x.b1+' °C'}].concat(x.nv?[]:[{y:x.b2,color:'#dc2626',label:x.n2+' '+x.b2+' °C'}]),pts:[{x:S.t,y:T,r:7,fill:'#f59e0b',color:'#b45309',label:fm(T,1)+' °C'}]});
   $(el,'#t_tl').innerHTML=tiles([['Temperatura',fm(T,1)+' °C','#dc2626'],['Recolector 1: '+esc(x.n1),fm(f1/x.d1,0)+' mL'+(fa>0?' + '+fm(fa/x.d2,0)+' mL de '+esc(x.n2):''),'#2563eb'],['Recolector 2',fm((f2/x.d1),0)+' mL de '+esc(x.n1)+(fb>0?' · '+fm(fb/x.d2,0)+' mL de '+esc(x.n2):''),'#7c3aed'],['Pureza del recolector 1',(f1+fa)>0?fm(pur1,0)+' %':'—','#16a34a']]);
   $(el,'#t_nt').textContent=x.nota;return{tm,pur1,fa}};
  let r=draw(),tm=r.tm;const up=()=>{S.t=0;S.run=false;r=draw();tm=r.tm};
  $(el,'#t_m').onchange=e=>{S.k=+e.target.value;S.cut=Math.round((MX[S.k].b1+(MX[S.k].nv?MX[S.k].b1+5:MX[S.k].b2))/2);$(el,'#t_c').value=S.cut;$(el,'#t_cv').textContent=S.cut;up()};
  [['t_a','v1'],['t_p','P'],['t_c','cut']].forEach(([i,k])=>{$(el,'#'+i).oninput=e=>{S[k]=+e.target.value;$(el,'#'+i+'v').textContent=e.target.value;up()}});
  const lp=frame(el,ts=>{if(!S.run)return;S.t=Math.min(tm,S.t+tm/350);r=draw();if(S.t>=tm){S.run=false;ctx.act('destilado',{});if(r.fa<=0&&r.pur1>=99)ctx.act('corte_bueno',{});ctx.obs('Destilación terminada: pureza del recolector 1 = '+fm(r.pur1,0)+' %.')}});
  $(el,'#t_go').onclick=()=>{if(S.t>=tm)S.t=0;S.run=true;ctx.act('calentar',{})};$(el,'#t_ps').onclick=()=>{S.run=false};$(el,'#t_rs').onclick=up;return{reset:up,pause(){S.run=false}}}};

/* ========== CONSERVA: conservación de la masa (NaHCO3 + CH3COOH) ========== */
E.conserva=(el,cfg,ctx)=>{
 const MB=84.007,MA=60.052,MC=44.009,MW=18.015,MS=82.034,RV=1.005,PA=0.05; /* vinagre 5 % m/m, d≈1,005 g/mL */
 const S={g:5,v:60,cerr:true,done:false,m0:null,m1:null,tab:[]};
 el.innerHTML=grid(panel('🎛️ Montaje',rng('c_g','Bicarbonato de sodio (g)',1,12,S.g,0.5)+rng('c_v','Vinagre 5 % (mL)',20,150,S.v,5)+lab('Sistema')+sel('c_s',[[1,'Cerrado (globo sellado en la boca del matraz)'],[0,'Abierto (matraz destapado)']],1)+'<div style="margin-top:10px">'+btn('c_go','⚗️ Mezclar y pesar','#16a34a')+btn('c_rs','⟲ Reiniciar','#64748b')+'</div><div style="font-size:12px;color:#92400e;margin-top:8px">Modelo: NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂. Se desprecia el empuje del aire sobre el globo (en la vida real altera la lectura unas centésimas de gramo).</div>'),
  panel('⚖️ Balanza','<svg id="c_sv" viewBox="0 0 420 220" style="width:100%;height:auto"></svg>')+'<div id="c_tl"></div><div class="sim-panel"><div class="sim-h">📋 Registro</div><div id="c_tb" style="overflow:auto"></div></div>');
 const calc=()=>{const nb=S.g/MB,na=S.v*RV*PA/MA,nr=Math.min(nb,na),mT=S.g+S.v*RV;return{nb,na,nr,co2:nr*MC,lim:nb<na?'bicarbonato':(na<nb?'ácido acético':'ninguno (cantidades exactas)'),mT}};
 const draw=()=>{const c=calc(),show=S.done?(S.cerr?c.mT:c.mT-c.co2):c.mT;
  $(el,'#c_sv').innerHTML=`<rect x="60" y="170" width="300" height="16" rx="6" fill="#94a3b8"/><rect x="150" y="60" width="120" height="110" rx="12" fill="#e0f2fe" stroke="#0369a1" stroke-width="3"/><rect x="150" y="${S.done?100:120}" width="120" height="${S.done?70:50}" fill="${S.done?'#bae6fd':'#fef3c7'}" opacity=".8"/>${S.cerr?`<ellipse cx="210" cy="${S.done?30:52}" rx="${S.done?60:14}" ry="${S.done?34:10}" fill="#fb7185" opacity=".75"/>`:(S.done?'<g fill="#94a3b8"><circle cx="190" cy="40" r="5"/><circle cx="220" cy="28" r="7"/><circle cx="245" cy="44" r="4"/></g>':'')}<rect x="150" y="196" width="120" height="22" rx="5" fill="#0f172a"/><text x="210" y="212" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="15" font-weight="800">${fm(show,2)} g</text>`;
  $(el,'#c_tl').innerHTML=tiles([['Masa de reactivos',fm(c.mT,2)+' g','#2563eb'],['CO₂ que se produce',fm(c.co2,2)+' g','#dc2626'],['Reactivo limitante',c.lim,'#7c3aed']]);
  $(el,'#c_tb').innerHTML=S.tab.length?'<table style="width:100%;border-collapse:collapse;font-size:13px"><tr><th>#</th><th>Sistema</th><th>Masa antes</th><th>Masa después</th><th>Diferencia</th></tr>'+S.tab.map((r,i)=>`<tr><td>${i+1}</td><td>${r.s}</td><td>${fm(r.a,2)} g</td><td>${fm(r.d,2)} g</td><td>${fm(r.d-r.a,2)} g</td></tr>`).join('')+'</table>':'<div style="color:#64748b;font-size:13px">Aún no hay mediciones.</div>'};
 const up=()=>{S.done=false;draw()};
 $(el,'#c_g').oninput=e=>{S.g=+e.target.value;$(el,'#c_gv').textContent=S.g;up()};
 $(el,'#c_v').oninput=e=>{S.v=+e.target.value;$(el,'#c_vv').textContent=S.v;up()};
 $(el,'#c_s').onchange=e=>{S.cerr=e.target.value==='1';up()};
 $(el,'#c_go').onclick=()=>{const c=calc();S.done=true;const d=S.cerr?c.mT:c.mT-c.co2;S.tab.push({s:S.cerr?'Cerrado':'Abierto',a:c.mT,d});draw();ctx.act(S.cerr?'cerrado':'abierto',{});if(S.tab.some(r=>r.s==='Cerrado')&&S.tab.some(r=>r.s==='Abierto'))ctx.act('comparado',{});ctx.obs((S.cerr?'Sistema cerrado: la masa no cambió ('+fm(c.mT,2)+' g).':'Sistema abierto: la balanza bajó '+fm(c.co2,2)+' g porque el CO₂ escapó.'))};
 $(el,'#c_rs').onclick=()=>{S.tab=[];up()};draw();return{reset(){S.tab=[];up()},pause(){}}};

/* ========== DATOS: elementos 1–36 (masas atómicas redondeadas IUPAC; electronegatividad de Pauling; radio atómico empírico de Slater en pm) ========== */
const ELEM=[[1,'H','Hidrógeno',1.008,1,1,'hidrogeno','no metal',2.20,25,'En el agua (H₂O); combustible en celdas de hidrógeno.'],[2,'He','Helio',4.0026,18,1,'noble','no metal',null,null,'Se usa en globos y en mezclas de buceo profundo.'],[3,'Li','Litio',6.94,1,2,'alcalino','metal',0.98,145,'Baterías de celulares y computadores.'],[4,'Be','Berilio',9.0122,2,2,'alcalinoterreo','metal',1.57,105,'Aleaciones livianas y resistentes para la industria aeronáutica.'],[5,'B','Boro',10.81,13,2,'boro','metaloide',2.04,85,'Bórax y vidrio resistente al calor (borosilicato).'],[6,'C','Carbono',12.011,14,2,'carbono','no metal',2.55,70,'Carbón, grafito de los lápices, diamante y los compuestos de los seres vivos.'],[7,'N','Nitrógeno',14.007,15,2,'nitrogeno','no metal',3.04,65,'Es cerca del 78 % del aire; se usa en fertilizantes.'],[8,'O','Oxígeno',15.999,16,2,'anfigeno','no metal',3.44,60,'Lo respiramos: es cerca del 21 % del aire.'],[9,'F','Flúor',18.998,17,2,'halogeno','no metal',3.98,50,'Fluoruros de la crema dental.'],[10,'Ne','Neón',20.180,18,2,'noble','no metal',null,null,'Avisos luminosos.'],
[11,'Na','Sodio',22.990,1,3,'alcalino','metal',0.93,180,'Sal de mesa (cloruro de sodio, NaCl).'],[12,'Mg','Magnesio',24.305,2,3,'alcalinoterreo','metal',1.31,150,'Está en la clorofila de las plantas; antiácidos y aleaciones livianas.'],[13,'Al','Aluminio',26.982,13,3,'boro','metal',1.61,125,'Latas, papel aluminio y ollas.'],[14,'Si','Silicio',28.085,14,3,'carbono','metaloide',1.90,110,'Arena, vidrio y chips de computador.'],[15,'P','Fósforo',30.974,15,3,'nitrogeno','no metal',2.19,100,'Huesos y dientes (fosfatos), fertilizantes y fósforos.'],[16,'S','Azufre',32.06,16,3,'anfigeno','no metal',2.58,100,'Vulcanizado del caucho, fósforos y ácido sulfúrico.'],[17,'Cl','Cloro',35.45,17,3,'halogeno','no metal',3.16,100,'Desinfección de piscinas y del agua; forma parte de la sal de mesa.'],[18,'Ar','Argón',39.948,18,3,'noble','no metal',null,null,'Atmósfera inerte en bombillos y en soldadura.'],[19,'K','Potasio',39.098,1,4,'alcalino','metal',0.82,220,'Nutriente del banano y de fertilizantes.'],[20,'Ca','Calcio',40.078,2,4,'alcalinoterreo','metal',1.00,180,'Huesos y dientes, leche, cal y cemento.'],
[21,'Sc','Escandio',44.956,3,4,'transicion','metal',1.36,160,'Aleaciones livianas de uso especializado.'],[22,'Ti','Titanio',47.867,4,4,'transicion','metal',1.54,140,'Prótesis y piezas de aviones.'],[23,'V','Vanadio',50.942,5,4,'transicion','metal',1.63,135,'Aceros especiales para herramientas.'],[24,'Cr','Cromo',51.996,6,4,'transicion','metal',1.66,140,'Cromado y acero inoxidable.'],[25,'Mn','Manganeso',54.938,7,4,'transicion','metal',1.55,140,'Pilas y fabricación de acero.'],[26,'Fe','Hierro',55.845,8,4,'transicion','metal',1.83,140,'Acero; también está en la hemoglobina de la sangre.'],[27,'Co','Cobalto',58.933,9,4,'transicion','metal',1.88,135,'Imanes y pigmento azul.'],[28,'Ni','Níquel',58.693,10,4,'transicion','metal',1.91,135,'Monedas y acero inoxidable.'],[29,'Cu','Cobre',63.546,11,4,'transicion','metal',1.90,135,'Cables eléctricos y tuberías.'],[30,'Zn','Cinc',65.38,12,4,'transicion','metal',1.65,135,'Galvanizado de techos y pilas.'],
[31,'Ga','Galio',69.723,13,4,'boro','metal',1.81,130,'Diodos LED y electrónica.'],[32,'Ge','Germanio',72.630,14,4,'carbono','metaloide',2.01,125,'Electrónica y fibra óptica.'],[33,'As','Arsénico',74.922,15,4,'nitrogeno','metaloide',2.18,115,'Tóxico; se usó históricamente como veneno y hoy en semiconductores.'],[34,'Se','Selenio',78.971,16,4,'anfigeno','no metal',2.55,115,'Champús anticaspa (sulfuro de selenio) y celdas.'],[35,'Br','Bromo',79.904,17,4,'halogeno','no metal',2.96,115,'Retardantes de llama.'],[36,'Kr','Kriptón',83.798,18,4,'noble','no metal',3.00,null,'Lámparas especiales.']].map(a=>({z:a[0],s:a[1],n:a[2],m:a[3],g:a[4],p:a[5],f:a[6],t:a[7],en:a[8],r:a[9],u:a[10]}));
const FAM={hidrogeno:['Hidrógeno','#94a3b8'],alcalino:['Metales alcalinos','#ef4444'],alcalinoterreo:['Alcalinotérreos','#f97316'],transicion:['Metales de transición','#eab308'],boro:['Familia del boro','#22c55e'],carbono:['Familia del carbono','#14b8a6'],nitrogeno:['Familia del nitrógeno','#06b6d4'],anfigeno:['Anfígenos (calcógenos)','#3b82f6'],halogeno:['Halógenos','#8b5cf6'],noble:['Gases nobles','#ec4899']};
const TIPO={metal:['Metal','#f59e0b'],'no metal':['No metal','#0ea5e9'],metaloide:['Metaloide','#10b981']};
const EL=s=>ELEM.find(x=>x.s===s);
const sub=s=>String(s).replace(/\d+/g,d=>d.split('').map(c=>'₀₁₂₃₄₅₆₇₈₉'[+c]).join(''));
const sup=n=>{const t=String(Math.abs(n)).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');return(n===0?'':(Math.abs(n)===1?'':t))+(n>0?'⁺':n<0?'⁻':'')};
const shells=n=>{const cap=[2,8,8,2],r=[];let k=n;for(const c of cap){const x=Math.min(k,c);r.push(x);k-=x}return r};
/* conjunto de elementos que cumplen un reto: {fam,t,g,p} igualdades; max/min sobre en o r */
const retoSet=sp=>{let C=ELEM.filter(e=>Object.keys(sp).every(k=>k==='max'||k==='min'||k==='q'||e[k]===sp[k]));
 const key=sp.max||sp.min;if(key){const v=C.filter(e=>e[key]!=null);const b=sp.max?Math.max(...v.map(e=>e[key])):Math.min(...v.map(e=>e[key]));C=v.filter(e=>e[key]===b)}return C};
/* ========== TABLA PERIÓDICA (elementos 1–36) ========== */
E.tabla=(el,cfg,ctx)=>{const S={sel:null,vista:cfg.vista||'fam',k:0,ok:0,seen:{},gr:{tipo:'periodo',n:cfg.grafN||3}};
 const RT=cfg.retos||[],modo=cfg.modo||'retos';let SIMB=null;
 if(modo==='simbolos'){const R=rnd(11),pool=ELEM.filter(e=>e.z<=30);SIMB=[];for(let i=0;i<10;i++){const e=pool[Math.floor(R()*pool.length)],dir=i%2,ds=[];while(ds.length<3){const d=pool[Math.floor(R()*pool.length)];if(d!==e&&!ds.includes(d))ds.push(d)}const op=ds.concat(e).sort(()=>R()-.5);SIMB.push({e,dir,op})}}
 const nR=()=>modo==='simbolos'?SIMB.length:RT.length;
 const sc=v=>{const k=S.vista;const arr=ELEM.filter(e=>e[k==='en'?'en':'r']!=null).map(e=>e[k==='en'?'en':'r']);const lo=Math.min(...arr),hi=Math.max(...arr),t=(v-lo)/(hi-lo||1);return `rgb(${Math.round(219-189*t)},${Math.round(234-176*t)},${Math.round(254-110*t)})`};
 const col=e=>{const v=S.vista;if(v==='fam')return FAM[e.f][1];if(v==='tipo')return TIPO[e.t][1];if(v==='radio'){return e.r==null?'#e2e8f0':sc(e.r)}if(v==='en'){return e.en==null?'#e2e8f0':sc(e.en)}return '#cbd5e1'};
 const selOpts=cfg.selector?lab('Colorear por')+sel('t_v',[['neutro','Sin colores'],['fam','Familia'],['tipo','Metal / no metal / metaloide'],['radio','Radio atómico'],['en','Electronegatividad']],S.vista):'';
 const reto=()=>{if(modo==='simbolos'){const q=SIMB[S.k];return q?(q.dir?`¿Qué elemento tiene el símbolo <b>${q.e.s}</b>?`:`¿Cuál es el símbolo de <b>${esc(q.e.n)}</b>?`):''}const r=RT[S.k];return r?r.q:''};
 el.innerHTML=grid(panel('🎛️ Controles',selOpts+(modo==='vida'||modo==='retos'||modo==='simbolos'?`<div id="t_rt" style="margin-top:8px;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:8px;font-size:13px"></div>`:'')+(cfg.grafica?lab('Gráfica de la propiedad por')+sel('t_gt',[['periodo','Un periodo (izquierda → derecha)'],['grupo','Un grupo (arriba → abajo)']],S.gr.tipo)+`<div id="t_gn"></div>`:'')+'<div id="t_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>')+'<div id="t_dt" style="margin-top:8px"></div>',
  panel('🧪 Tabla periódica (elementos 1–36)','<div id="t_g"></div><div id="t_lg" style="font-size:11px;margin-top:6px"></div>')+(cfg.grafica?panel('📈 '+(cfg.grafica==='en'?'Electronegatividad (Pauling)':'Radio atómico empírico (pm)'),'<canvas id="t_cv" style="width:100%;display:block"></canvas>'):'')+'<div id="t_tl"></div>');
 const gridH=()=>{let h='<div style="display:grid;grid-template-columns:repeat(18,minmax(0,1fr));gap:2px">';const map={};ELEM.forEach(e=>map[e.p+'_'+e.g]=e);
  for(let p=1;p<=4;p++)for(let g=1;g<=18;g++){const e=map[p+'_'+g];h+=e?`<button data-z="${e.z}" title="${esc(e.n)}" style="aspect-ratio:1/1.05;border-radius:5px;border:${S.sel===e.z?'3px solid #0f172a':'1px solid #94a3b8'};background:${col(e)};color:${(S.vista==='en'||S.vista==='radio')&&col(e)!=='#e2e8f0'&&(Number((col(e).match(/\d+/g)||[255])[0])<130)?'#fff':'#0f172a'};font-weight:800;font-size:clamp(8px,1.9vw,13px);padding:0;line-height:1.05">${modo==='simbolos'?'':`<span style="font-size:.62em;font-weight:600;display:block">${e.z}</span>`}${e.s}</button>`:'<div></div>'}return h+'</div>'};
 const legend=()=>{const v=S.vista;if(v==='fam')return Object.values(FAM).map(f=>`<span style="display:inline-block;margin:2px 8px 2px 0"><i style="display:inline-block;width:11px;height:11px;border-radius:3px;background:${f[1]};vertical-align:-1px"></i> ${f[0]}</span>`).join('');
  if(v==='tipo')return Object.values(TIPO).map(f=>`<span style="margin-right:10px"><i style="display:inline-block;width:11px;height:11px;border-radius:3px;background:${f[1]};vertical-align:-1px"></i> ${f[0]}</span>`).join('');
  if(v==='radio'||v==='en')return 'Más claro = valor menor · más oscuro = valor mayor · gris = sin dato (los gases nobles no tienen electronegatividad ni radio de esta tabla).';return 'Toca un elemento para ver su ficha.'};
 const det=()=>{const e=ELEM.find(x=>x.z===S.sel);if(!e){$(el,'#t_dt').innerHTML='<div style="font-size:12px;color:#64748b">Toca un elemento para ver su ficha.</div>';return}
  const hide=modo==='simbolos';
  $(el,'#t_dt').innerHTML=`<div style="border:2px solid ${FAM[e.f][1]};border-radius:12px;padding:10px"><div style="font-size:30px;font-weight:900">${e.s}</div><div style="font-weight:800">${hide?'(elige tu respuesta arriba)':esc(e.n)}</div>
  ${hide?'':`<div style="font-size:12px;margin-top:4px;line-height:1.5">Número atómico (Z): <b>${e.z}</b><br>Masa atómica: <b>${fm(e.m,3)}</b><br>Grupo <b>${e.g}</b> · Periodo <b>${e.p}</b><br>Familia: <b>${FAM[e.f][0]}</b><br>Tipo: <b>${TIPO[e.t][0]}</b><br>Electronegatividad: <b>${e.en==null?'sin dato':fm(e.en,2)}</b><br>Radio atómico: <b>${e.r==null?'sin dato':e.r+' pm'}</b>${modo==='vida'&&false?'':''}</div>${cfg.uso?`<div style="font-size:12px;margin-top:4px">🏠 ${esc(e.u)}</div>`:''}`}
  ${modo==='vida'||modo==='retos'||modo==='simbolos'?`<button id="t_ans" class="sim-btn" style="background:#7c3aed;margin-top:8px">✔ Es mi respuesta</button>`:''}</div>`;
  const b=$(el,'#t_ans');if(b)b.onclick=resp};
 const rt=()=>{const d=$(el,'#t_rt');if(!d)return;if(S.k>=nR()){d.innerHTML='🏁 <b>¡Retos completados!</b> '+S.ok+' de '+nR()+' acertados.';return}
  if(modo==='simbolos'){const q=SIMB[S.k];d.innerHTML=`<b>Reto ${S.k+1}/${nR()}:</b> ${reto()}<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${q.op.map((o,i)=>`<button data-o="${i}" class="sim-btn" style="background:#0d9488">${q.dir?esc(o.n):o.s}</button>`).join('')}</div>`;d.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const o=q.op[+b.dataset.o];fin(o===q.e,o)});return}
  d.innerHTML=`<b>Reto ${S.k+1}/${nR()}:</b> ${reto()}<br><span style="color:#64748b">Toca un elemento y pulsa «Es mi respuesta».</span>`};
 const fin=(ok,e)=>{const f=$(el,'#t_fb');const sol=modo==='simbolos'?SIMB[S.k].e:null;
  if(ok){S.ok++;ctx.act(modo==='simbolos'?'simbolo_ok':'reto_ok',{});f.style.color='#16a34a';f.textContent='✅ Correcto.'+(modo==='simbolos'?' '+sol.s+' = '+sol.n+'.':(RT[S.k].why?' '+RT[S.k].why:''))}
  else{f.style.color='#dc2626';f.textContent='❌ No es esa. '+(modo==='simbolos'?'Era '+sol.n+' ('+sol.s+').':(RT[S.k].why||'Revisa las propiedades en la ficha.'))}
  ctx.obs((modo==='simbolos'?'Reto '+(S.k+1)+': ':'Reto '+(S.k+1)+': ')+(ok?'acierto':'error')+(e?' ('+e.s+')':''));S.k++;if(S.k>=nR()&&S.ok>=Math.ceil(nR()*0.7))ctx.act('todo_ok',{});rt();draw()};
 const resp=()=>{if(S.k>=nR()||S.sel==null)return;const e=ELEM.find(x=>x.z===S.sel);if(modo==='simbolos')return;const set=retoSet(RT[S.k].ok);fin(set.includes(e),e)};
 const plot=()=>{if(!cfg.grafica)return;const key=cfg.grafica==='en'?'en':'r',g=S.gr;
  const pts=ELEM.filter(e=>e[key]!=null&&(g.tipo==='periodo'?e.p===g.n:e.g===g.n)).sort((a,b)=>g.tipo==='periodo'?a.g-b.g:a.p-b.p).map(e=>({e,x:g.tipo==='periodo'?e.g:e.p,y:e[key]}));
  $(el,'#t_gn').innerHTML=sel('t_gv',(g.tipo==='periodo'?[2,3,4]:[1,2,13,14,15,16,17]).map(v=>[v,(g.tipo==='periodo'?'Periodo ':'Grupo ')+v]),g.n);$(el,'#t_gv').onchange=e=>{g.n=+e.target.value;plot()};ctx.act('grafica',{});
  if(!pts.length){return}
  const ys=pts.map(p=>p.y),lo=Math.min(...ys),hi=Math.max(...ys),pd=(hi-lo)*0.25||0.5,xs=pts.map(p=>p.x);
  SIM.plot($(el,'#t_cv'),{h:260,xmin:Math.min(...xs)-0.5,xmax:Math.max(...xs)+0.5,ymin:Math.max(0,lo-pd),ymax:hi+pd,xl:g.tipo==='periodo'?'Grupo':'Periodo',yl:cfg.grafica==='en'?'Electronegatividad':'Radio (pm)',series:[{pts:pts.map(p=>[p.x,p.y]),color:'#2563eb'}],pts:pts.map(p=>({x:p.x,y:p.y,r:5,fill:'#fff',color:'#2563eb',label:p.e.s+' '+(cfg.grafica==='en'?fm(p.y,2):p.y)}))});
  const tr=pts.length>1?(pts[pts.length-1].y-pts[0].y):0;$(el,'#t_tl').innerHTML=tiles([['De '+pts[0].e.s+' a '+pts[pts.length-1].e.s,(tr>=0?'+':'')+fm(tr,cfg.grafica==='en'?2:0)+(cfg.grafica==='en'?'':' pm'),tr>=0?'#16a34a':'#dc2626'],['Tendencia',tr>0?'aumenta':tr<0?'disminuye':'constante','#7c3aed']]);
  if(Math.abs(tr)>0)ctx.obs((g.tipo==='periodo'?'Periodo ':'Grupo ')+g.n+': la propiedad '+(tr>0?'aumenta':'disminuye')+' de '+pts[0].e.s+' a '+pts[pts.length-1].e.s+'.')};
 const draw=()=>{$(el,'#t_g').innerHTML=gridH();$(el,'#t_lg').innerHTML=legend();det();el.querySelectorAll('#t_g [data-z]').forEach(b=>b.onclick=()=>{S.sel=+b.dataset.z;if(!S.seen[S.sel]){S.seen[S.sel]=1;ctx.act('ver',{})}draw()});
  if(!cfg.grafica)$(el,'#t_tl').innerHTML=tiles([['Elementos vistos',Object.keys(S.seen).length+' / 36','#0d9488'],['Retos acertados',S.ok+' / '+nR(),'#16a34a']])};
 const sv=$(el,'#t_v');if(sv)sv.onchange=e=>{S.vista=e.target.value;ctx.act('colorea',{});draw()};
 const gt=$(el,'#t_gt');if(gt)gt.onchange=e=>{S.gr.tipo=e.target.value;S.gr.n=e.target.value==='periodo'?3:1;plot()};
 draw();rt();plot();return{reset(){S.sel=null;S.k=0;S.ok=0;S.seen={};$(el,'#t_fb').textContent='';draw();rt();plot()}}};
/* ========== ÁTOMO: construir, números, iones y capas ========== */
E.atomo=(el,cfg,ctx)=>{const S={p:1,n:0,e:1,k:0,ok:0,sh:[0,0,0,0]};const RT=cfg.retos||[],modo=cfg.modo||'construir';
 const byZ=z=>ELEM.find(x=>x.z===z);
 const stepper=(id,t,v)=>`<div style="display:flex;align-items:center;gap:6px;margin-top:6px"><b style="width:105px;font-size:12px">${t}</b><button data-s="${id}-" class="sim-btn" style="background:#64748b">−</button><b id="a_${id}" style="min-width:28px;text-align:center;font-size:18px">${v}</b><button data-s="${id}+" class="sim-btn" style="background:#1e63e9">+</button></div>`;
 const ctl=modo==='capas'?['K (1.ª capa)','L (2.ª capa)','M (3.ª capa)','N (4.ª capa)'].map((t,i)=>stepper('c'+i,t,0)).join(''):stepper('p','🔴 Protones',1)+stepper('n','⚪ Neutrones',0)+stepper('e','🔵 Electrones',1);
 el.innerHTML=grid(panel('🎛️ Controles',ctl+'<div style="display:flex;gap:6px;margin-top:10px">'+btn('a_ck','✔ Comprobar','#16a34a')+btn('a_rs','⟲ Borrar','#64748b')+'</div><div id="a_rt" style="margin-top:8px;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:8px;font-size:13px"></div><div id="a_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'),
  panel('⚛️ Átomo (modelo de Bohr simplificado)','<canvas id="a_cv" width="420" height="300" style="width:100%;max-width:520px;display:block;margin:auto;border-radius:10px;background:#0f172a"></canvas>')+'<div id="a_tl"></div>');
 const cur=()=>RT[S.k];
 const info=()=>{const e=byZ(S.p);return e};
 const draw=()=>{
  if(modo==='capas'){S.sh.forEach((v,i)=>$(el,'#a_c'+i).textContent=v);const tot=S.sh.reduce((a,b)=>a+b,0);const r=cur();
   const cv=$(el,'#a_cv'),x=cv.getContext('2d');x.fillStyle='#0f172a';x.fillRect(0,0,420,300);const cx=210,cy=150;x.fillStyle='#ef4444';x.beginPath();x.arc(cx,cy,16,0,7);x.fill();x.fillStyle='#fff';x.font='bold 11px sans-serif';x.textAlign='center';x.fillText(r?'Z='+r.z:'',cx,cy+4);
   [2,8,8,2].forEach((cap,i)=>{const R=40+i*30;x.strokeStyle='#475569';x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();for(let j=0;j<S.sh[i];j++){const a=j/Math.max(S.sh[i],1)*6.2832-1.57;x.fillStyle=S.sh[i]>cap?'#f59e0b':'#38bdf8';x.beginPath();x.arc(cx+R*Math.cos(a),cy+R*Math.sin(a),6,0,7);x.fill()}});
   $(el,'#a_tl').innerHTML=tiles([['Electrones colocados',tot+(r?' / '+r.z:''),'#2563eb'],['Distribución',S.sh.filter((v,i)=>v>0||i<2).join(' – ')||'—','#7c3aed']]);return}
  const e=info(),Z=S.p,A=S.p+S.n,q=S.p-S.e,sh=shells(S.e),cv=$(el,'#a_cv'),x=cv.getContext('2d');
  $(el,'#a_p').textContent=S.p;$(el,'#a_n').textContent=S.n;$(el,'#a_e').textContent=S.e;
  x.fillStyle='#0f172a';x.fillRect(0,0,420,300);const cx=210,cy=150,nuc=Math.min(46,10+Math.sqrt(S.p+S.n)*5);
  const R0=rnd(5);for(let i=0;i<S.p+S.n;i++){const a=R0()*6.28,rr=Math.sqrt(R0())*(nuc-6);x.fillStyle=i<S.p?'#ef4444':'#cbd5e1';x.beginPath();x.arc(cx+rr*Math.cos(a),cy+rr*Math.sin(a),4.2,0,7);x.fill()}
  [2,8,8,2].forEach((cap,i)=>{if(sh[i]===0&&!(i<2))return;const R=60+i*28;x.strokeStyle='#475569';x.lineWidth=1;x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();for(let j=0;j<sh[i];j++){const a=j/sh[i]*6.2832-1.57;x.fillStyle='#38bdf8';x.beginPath();x.arc(cx+R*Math.cos(a),cy+R*Math.sin(a),6,0,7);x.fill()}});
  const sym=e?e.s:'?',nm=e?e.n:'sin elemento (Z=0)';
  $(el,'#a_tl').innerHTML=tiles([['Elemento',e?e.n+' ('+e.s+')':'—','#7c3aed'],['Número atómico Z',Z,'#ef4444'],['Número de masa A',A,'#475569'],['Carga neta',(q>0?'+':'')+q,q===0?'#16a34a':'#f59e0b'],['Distribución e⁻',sh.filter((v,i)=>v>0).join(' – ')||'—','#2563eb'],['Símbolo',(e?'<sup>'+A+'</sup><sub>'+Z+'</sub>'+sym+(q?'<sup>'+sup(q)+'</sup>':''):'—'),'#0d9488']]);
  if(e){const iso=Math.round(e.m)===A?'es el isótopo más abundante':'es otro isótopo del '+e.n;$(el,'#a_fb').style.color='#334155';if(!$(el,'#a_fb').dataset.f)$(el,'#a_fb').textContent=(q===0?'Átomo neutro':'Ion '+(q>0?'positivo (catión)':'negativo (anión)'))+' · '+e.n+'-'+A+': '+iso+'.'}};
 const rt=()=>{const d=$(el,'#a_rt'),r=cur();d.innerHTML=r?`<b>Reto ${S.k+1}/${RT.length}:</b> ${r.q}`:'🏁 <b>¡Retos completados!</b> '+S.ok+' de '+RT.length;draw()};
 const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
 el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const k=b.dataset.s,d=k.slice(-1)==='+'?1:-1,id=k.slice(0,-1);
  if(modo==='capas'){const i=+id.slice(1);S.sh[i]=cl(S.sh[i]+d,0,18);ctx.act('coloca',{})}
  else{if(id==='p')S.p=cl(S.p+d,0,20);if(id==='n')S.n=cl(S.n+d,0,30);if(id==='e')S.e=cl(S.e+d,0,22);ctx.act('agrega_'+id,{});ctx.act('agrega',{})}
  $(el,'#a_fb').dataset.f='';draw()});
 $(el,'#a_rs').onclick=()=>{S.p=1;S.n=0;S.e=1;S.sh=[0,0,0,0];$(el,'#a_fb').textContent='';$(el,'#a_fb').dataset.f='';draw()};
 $(el,'#a_ck').onclick=()=>{const r=cur(),f=$(el,'#a_fb');f.dataset.f='1';if(!r){f.textContent='Ya terminaste los retos.';return}let ok,why;
  if(modo==='capas'){const want=shells(r.z);ok=S.sh.every((v,i)=>v===want[i]);why='Distribución correcta de Z='+r.z+': '+want.filter(v=>v>0).join(' – ')+'. Cada capa admite 2, 8, 8 y luego se llena la siguiente.'}
  else{const t=r.t;ok=S.p===t.p&&(t.n==null||S.n===t.n)&&(t.e==null?S.e===t.p:S.e===t.e);why=r.why||''}
  if(ok){S.ok++;ctx.act('reto_ok',{});f.style.color='#16a34a';f.textContent='✅ Correcto. '+why}else{f.style.color='#dc2626';f.textContent='❌ Todavía no coincide. '+(modo==='capas'?'Revisa cuántos electrones caben en cada capa.':'Revisa protones (Z), neutrones (A − Z) y electrones.')}
  ctx.obs('Reto '+(S.k+1)+': '+(ok?'acierto':'error'));if(ok){S.k++;if(S.k>=RT.length)ctx.act('todo_ok',{})}rt()};
 rt();return{reset(){$(el,'#a_rs').click();S.k=0;S.ok=0;rt()}}};
/* ========== RUTHERFORD: dispersión de partículas alfa ========== */
E.rutherford=(el,cfg,ctx)=>{const Z=79,E0=5,d=2*Z*1.44/E0;const S={b:30,t:0.4,tried:{}};
 el.innerHTML=grid(panel('🎛️ Controles',rng('r_b','Parámetro de impacto b (fm)',2,120,S.b,1)+rng('r_t','Espesor de la lámina de oro (μm)',0.1,1,S.t,0.1)+'<div style="font-size:12px;margin-top:8px;color:#475569">Partícula alfa de 5 MeV contra un núcleo de oro (Z = 79). 1 fm = 10⁻¹⁵ m; el núcleo de oro mide unos 7 fm.</div><div style="display:flex;gap:6px;margin-top:10px">'+btn('r_go','▶ Lanzar partícula','#16a34a')+'</div><div id="r_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'),
  panel('🔬 Trayectoria de la partícula alfa (integración numérica de la fuerza de Coulomb)','<canvas id="r_cv" width="460" height="300" style="width:100%;max-width:560px;display:block;margin:auto;border-radius:10px;background:#0f172a"></canvas>')+'<div id="r_tl"></div>');
 const traj=b=>{const k=0.5*d,X0=1500,pts=[];let x=-X0,y=b,vx=1,vy=0;const dt=0.1;for(let i=0;i<200000;i++){const r2=x*x+y*y,r=Math.sqrt(r2),a=k/(r2*r),h=r<150?0.01:dt;vx+=a*x*h;vy+=a*y*h;x+=vx*h;y+=vy*h;if(i%25===0&&Math.abs(x)<320&&Math.abs(y)<320)pts.push([x,y]);if(x>0&&r>X0)break}
  return{pts,ang:Math.abs(Math.atan2(vy,vx)*180/Math.PI)}};
 const draw=()=>{const b=S.b,th=2*Math.atan(d/(2*b))*180/Math.PI,tr=traj(b),cv=$(el,'#r_cv'),x=cv.getContext('2d');x.fillStyle='#0f172a';x.fillRect(0,0,460,300);
  const sx=v=>230+v*0.82,sy=v=>150-v*0.82;x.strokeStyle='#334155';x.setLineDash([4,4]);x.beginPath();x.moveTo(0,sy(0));x.lineTo(460,sy(0));x.stroke();x.setLineDash([]);
  x.strokeStyle='#38bdf8';x.lineWidth=2.4;x.beginPath();tr.pts.forEach((p,i)=>{const X=sx(p[0]),Y=sy(p[1]);i?x.lineTo(X,Y):x.moveTo(X,Y)});x.stroke();
  x.fillStyle='#f59e0b';x.beginPath();x.arc(sx(0),sy(0),8,0,7);x.fill();x.fillStyle='#fff';x.font='11px sans-serif';x.fillText('núcleo Au',sx(0)+12,sy(0)+4);
  const dtha=tr.ang;
  const nA=5.9e28*S.t*1e-6,sig=Math.PI*Math.pow(d/2*1e-15,2),fr=nA*sig;
  $(el,'#r_tl').innerHTML=tiles([['Ángulo de desviación (fórmula)',fm(th,1)+'°','#dc2626'],['Ángulo en la simulación',fm(Math.abs(dtha),1)+'°','#2563eb'],['Acercamiento máximo (choque frontal)',fm(d,1)+' fm','#7c3aed'],['Modelo de Thomson (desviación máx.)','≈ '+fm(d/1e5*180/Math.PI,3)+'°','#0d9488'],['Fracción con desviación > 90°',fm(fr*100,4)+' %','#f59e0b'],['De 100 000 alfas, > 90°','≈ '+fm(fr*1e5,1),'#16a34a']]);
  return th};
 $(el,'#r_b').oninput=e=>{S.b=+e.target.value;$(el,'#r_bv').textContent=S.b;draw()};$(el,'#r_t').oninput=e=>{S.t=+e.target.value;$(el,'#r_tv').textContent=S.t;draw()};
 $(el,'#r_go').onclick=()=>{const th=draw();ctx.act('lanza',{});const k=th>90?'retro':th>30?'media':'leve';if(!S.tried[k]){S.tried[k]=1;ctx.act('tipo_'+k,{})}ctx.obs('b = '+S.b+' fm → desviación de '+fm(th,1)+'°'+(th>90?' (rebota hacia atrás)':th>30?' (desviación apreciable)':' (desviación pequeña)'));
  $(el,'#r_fb').textContent=th>90?'La alfa rebota casi hacia atrás: solo ocurre si pasa muy cerca del núcleo.':th>30?'Desviación apreciable: pasó relativamente cerca del núcleo.':'Desviación pequeña: pasó lejos del núcleo.'};
 draw();return{reset(){S.b=30;$(el,'#r_b').value=30;$(el,'#r_bv').textContent='30';S.tried={};draw()}}};
/* ========== ISÓTOPOS: masa atómica promedio ========== */
E.isotopos=(el,cfg,ctx)=>{const EL_=cfg.elems;const S={k:0,ab:[],done:{}};
 el.innerHTML=grid(panel('🎛️ Controles',lab('Elemento')+sel('i_e',EL_.map((x,i)=>[i,x.n+' ('+x.s+')']),0)+'<div id="i_sl"></div><div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">'+btn('i_real','🌍 Abundancias reales','#0d9488')+btn('i_calc','🧮 Calcular masa promedio','#16a34a')+'</div><div id="i_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'),
  panel('📊 Espectro de masas','<canvas id="i_cv" style="width:100%;display:block"></canvas>')+'<div id="i_tl"></div>');
 const cur=()=>EL_[S.k];
 const setReal=()=>{S.ab=cur().isos.map(i=>i.ab)};
 const mk=()=>{$(el,'#i_sl').innerHTML=cur().isos.map((i,j)=>rng('i_a'+j,'Abundancia de '+cur().s+'-'+i.A+' (%) · masa '+fm(i.m,4)+' u',0,100,S.ab[j],0.01)).join('');
  cur().isos.forEach((i,j)=>{$(el,'#i_a'+j).oninput=e=>{S.ab[j]=+e.target.value;$(el,'#i_a'+j+'v').textContent=fm(S.ab[j],2);ctx.act('ajusta',{});draw()}});cur().isos.forEach((i,j)=>$(el,'#i_a'+j+'v').textContent=fm(S.ab[j],2))};
 const prom=()=>{const sum=S.ab.reduce((a,b)=>a+b,0);return{sum,m:sum?cur().isos.reduce((a,i,j)=>a+i.m*S.ab[j],0)/sum:0}};
 const draw=()=>{const c=cur(),p=prom(),A=c.isos.map(i=>i.A),mn=Math.min(...A)-1.5,mx=Math.max(...A)+1.5;
  SIM.plot($(el,'#i_cv'),{h:240,xmin:mn,xmax:mx,ymin:0,ymax:100,xl:'Número de masa A',yl:'Abundancia (%)',series:c.isos.map((i,j)=>({pts:[[i.A,0],[i.A,S.ab[j]]],color:['#2563eb','#dc2626','#16a34a'][j],w:9})),pts:c.isos.map((i,j)=>({x:i.A,y:S.ab[j],r:4,fill:'#fff',color:['#2563eb','#dc2626','#16a34a'][j],label:fm(S.ab[j],1)+' %'}))});
  $(el,'#i_tl').innerHTML=tiles([['Suma de abundancias',fm(p.sum,2)+' %',Math.abs(p.sum-100)<0.05?'#16a34a':'#dc2626'],['Masa atómica promedio',fm(p.m,3)+' u','#7c3aed'],['Valor de la tabla periódica',fm(c.tabla,3)+' u','#0d9488']])};
 $(el,'#i_e').onchange=e=>{S.k=+e.target.value;setReal();S.ab=cur().isos.map(i=>Math.round(100/cur().isos.length*100)/100);mk();$(el,'#i_fb').textContent='';draw()};
 $(el,'#i_real').onclick=()=>{setReal();mk();draw();ctx.act('real',{});ctx.obs(cur().n+': con las abundancias reales la masa promedio es '+fm(prom().m,3)+' u.')};
 $(el,'#i_calc').onclick=()=>{const p=prom(),f=$(el,'#i_fb');ctx.act('calcula',{});if(Math.abs(p.sum-100)>0.05){f.style.color='#dc2626';f.textContent='Las abundancias deben sumar 100 %.';return}
  f.style.color='#16a34a';f.textContent='Masa promedio = Σ (masa × abundancia) ÷ 100 = '+fm(p.m,3)+' u.'+(Math.abs(p.m-cur().tabla)<0.02?' Coincide con la tabla periódica.':' Es distinta de la tabla porque cambiaste las abundancias reales.');ctx.act('prom_ok',{});if(Math.abs(p.m-cur().tabla)<0.02)ctx.act('coincide',{});ctx.obs(cur().s+': masa promedio calculada = '+fm(p.m,3)+' u.')};
 S.k=0;setReal();mk();draw();return{reset(){S.k=0;$(el,'#i_e').value=0;setReal();mk();$(el,'#i_fb').textContent='';draw()}}};
/* ========== FÓRMULAS: átomos, coeficientes y masa molar ========== */
E.formula=(el,cfg,ctx)=>{const C=cfg.comp,RT=cfg.retos;const S={k:0,coef:1,r:0,ok:0};
 el.innerHTML=grid(panel('🎛️ Controles',lab('Compuesto')+sel('f_c',C.map((c,i)=>[i,c.n+' — '+c.f]),0)+rng('f_k','Coeficiente (moléculas o unidades)',1,6,1,1)+'<div id="f_rt" style="margin-top:10px;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:8px;font-size:13px"></div><div id="f_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'),
  panel('🧪 Fórmula y composición','<div id="f_vw"></div>')+'<div id="f_tl"></div>');
 const cur=()=>C[S.k],mm=c=>Object.keys(c.at).reduce((a,s)=>a+EL(s).m*c.at[s],0);
 const draw=()=>{const c=cur(),k=S.coef;$(el,'#f_vw').innerHTML=`<div style="font-size:34px;font-weight:900;text-align:center;margin:6px 0">${k>1?k+' ':''}${sub(c.f)}</div><div style="text-align:center;font-size:13px;color:#475569">${esc(c.n)} · ${c.tipo}</div>
  <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px"><tr style="background:#f1f5f9"><th style="padding:5px;text-align:left">Elemento</th><th>Átomos en 1 unidad</th><th>Átomos en ${k}</th></tr>${Object.keys(c.at).map(s=>`<tr style="border-top:1px solid #e2e8f0"><td style="padding:5px"><b>${s}</b> (${esc(EL(s).n)})</td><td style="text-align:center">${c.at[s]}</td><td style="text-align:center"><b>${c.at[s]*k}</b></td></tr>`).join('')}</table>`;
  $(el,'#f_tl').innerHTML=tiles([['Átomos por unidad',Object.values(c.at).reduce((a,b)=>a+b,0),'#2563eb'],['Átomos en total',Object.values(c.at).reduce((a,b)=>a+b,0)*k,'#7c3aed'],['Masa molar',fm(mm(c),2)+' g/mol','#0d9488'],['Masa de '+k+' mol',fm(mm(c)*k,1)+' g','#f59e0b']])};
 const rt=()=>{const d=$(el,'#f_rt'),r=RT[S.r];d.innerHTML=r?`<b>Reto ${S.r+1}/${RT.length}:</b> ¿Cuántos átomos de <b>${r.el}</b> hay en <b>${r.k>1?r.k+' ':''}${sub(r.f)}</b>?<div style="display:flex;gap:6px;margin-top:6px"><input id="f_a" type="number" min="0" style="width:90px;padding:7px;border:1.5px solid #cbd5e1;border-radius:9px;font-weight:700"> <button id="f_ck" class="sim-btn" style="background:#16a34a">✔ Responder</button></div>`:'🏁 <b>¡Retos completados!</b> '+S.ok+' de '+RT.length;
  const b=$(el,'#f_ck');if(b)b.onclick=()=>{const v=+$(el,'#f_a').value,c=C.find(x=>x.f===r.f),ans=c.at[r.el]*r.k,f=$(el,'#f_fb');const ok=v===ans;if(ok){S.ok++;ctx.act('reto_ok',{});f.style.color='#16a34a';f.textContent='✅ Correcto: '+c.at[r.el]+' × '+r.k+' = '+ans+'.'}else{f.style.color='#dc2626';f.textContent='❌ Piensa: el subíndice dice cuántos átomos hay en una unidad (los paréntesis multiplican) y el coeficiente multiplica todo. Respuesta: '+ans+'.'}
   ctx.obs('Reto '+(S.r+1)+': '+r.f+' → '+r.el+' = '+ans+(ok?' (acierto)':' (error)'));S.r++;if(S.r>=RT.length&&S.ok>=Math.ceil(RT.length*0.7))ctx.act('todo_ok',{});rt()}};
 $(el,'#f_c').onchange=e=>{S.k=+e.target.value;ctx.act('explora',{});draw()};$(el,'#f_k').oninput=e=>{S.coef=+e.target.value;$(el,'#f_kv').textContent=S.coef;ctx.act('coef',{});draw()};
 draw();rt();return{reset(){S.r=0;S.ok=0;$(el,'#f_fb').textContent='';rt()}}};


/* ================= ETAPA 3 (octavo): enlaces, moléculas, nomenclatura y reacciones ================= */
const CPK={H:'#e2e8f0',C:'#64748b',N:'#3b82f6',O:'#ef4444',Cl:'#22c55e',F:'#86efac',S:'#facc15',Na:'#a78bfa',K:'#c084fc',Li:'#f0abfc',Mg:'#34d399',Ca:'#fb923c',B:'#f9a8d4',Be:'#bef264',Br:'#b45309'};
const VAL=s=>{const e=EL(s);if(!e)return 0;return e.g===1?1:e.g===2?2:e.g>=13?e.g-10:e.g};
const gcd=(a,b)=>b?gcd(b,a%b):a;
const catColor=s=>CPK[s]||'#94a3b8';
const rot3=(p,a,b)=>{let x=p[0],y=p[1],z=p[2],c=Math.cos(a),s=Math.sin(a),t=x*c+z*s;z=-x*s+z*c;x=t;c=Math.cos(b);s=Math.sin(b);t=y*c-z*s;z=y*s+z*c;y=t;return[x,y,z]};
const pj=(p,W,H,sc)=>{const f=1+p[2]*0.07;return[W/2+p[0]*sc*f,H/2-p[1]*sc*f,p[2]]};
const TET=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>v.map(x=>x/Math.sqrt(3)));
/* ========== ENLACE: iónico, covalente, metálico (predicción por electronegatividad) ========== */
E.enlace=(el,cfg,ctx)=>{const EM=cfg.elems,RT=cfg.retos||[];const S={a:EM[0],b:EM[1],k:0,ok:0,res:null,seen:{}};
 const ty=(A,B)=>{const a=EL(A),b=EL(B);if(a.en==null||b.en==null)return{t:'noble'};const d=Math.abs(a.en-b.en);if(a.t==='metal'&&b.t==='metal')return{t:'metalico',d};
  if(a.t==='metal'||b.t==='metal')return{t:d>=1.7?'ionico':'covalente_polar',d};return{t:d>=1.7?'ionico':d>=0.4?'covalente_polar':'covalente_apolar',d}};
 const form=(A,B)=>{const a=EL(A),b=EL(B),ty_=ty(A,B);if(ty_.t==='noble')return{f:'—'};
  if(A===B){const c=a.g===1?1:8-VAL(A);return{f:A+'2',bonds:c,ion:false}}
  if(ty_.t==='ionico'){const M=a.t==='metal'?a:b,X=a===M?b:a,qm=VAL(M.s),qx=8-VAL(X.s),g=gcd(qm,qx),nm=qx/g,nx=qm/g;return{f:M.s+(nm>1?nm:'')+X.s+(nx>1?nx:''),qm,qx,M,X,nm,nx,ion:true}}
  if(ty_.t==='metalico')return{f:A+'–'+B+' (aleación)'};
  const ca=a.g===1?1:8-VAL(A),cb=b.g===1?1:8-VAL(B),g=gcd(ca,cb),na=cb/g,nb=ca/g;return{f:A+(na>1?na:'')+B+(nb>1?nb:''),bonds:ca*na,ion:false}};
 const NT={ionico:'Iónico',covalente_polar:'Covalente polar',covalente_apolar:'Covalente apolar',metalico:'Metálico',noble:'No forma enlace'};
 const opts=EM.map(s=>[s,s+' — '+EL(s).n]);
 el.innerHTML=grid(panel('🎛️ Controles',lab('Elemento A')+sel('e_a',opts,S.a)+lab('Elemento B')+sel('e_b',opts,S.b)+'<div style="margin-top:10px">'+btn('e_go','🔗 Unir átomos','#16a34a')+'</div><div id="e_rt" style="margin-top:10px;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:8px;font-size:13px"></div><div id="e_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'),
  panel('⚛️ Enlace entre los átomos','<canvas id="e_cv" width="460" height="230" style="width:100%;max-width:560px;display:block;margin:auto;border-radius:10px;background:#0f172a"></canvas>')+'<div id="e_tl"></div>');
 const dots=(x,cx,px,py,n,col)=>{for(let i=0;i<n;i++){const a=i/8*6.2832-1.2;x.fillStyle=col||'#fde68a';x.beginPath();x.arc(px+34*Math.cos(a),py+34*Math.sin(a),3.4,0,7);x.fill()}};
 const draw=(un)=>{const cv=$(el,'#e_cv'),x=cv.getContext('2d');x.fillStyle='#0f172a';x.fillRect(0,0,460,230);const A=EL(S.a),B=EL(S.b),t=ty(S.a,S.b),f=form(S.a,S.b);
  const atom=(px,py,e,n,ch)=>{x.fillStyle=catColor(e.s);x.beginPath();x.arc(px,py,24,0,7);x.fill();x.fillStyle='#0f172a';x.font='bold 15px sans-serif';x.textAlign='center';x.fillText(e.s,px,py+5);dots(x,0,px,py,n);if(ch){x.fillStyle='#fff';x.font='bold 13px sans-serif';x.fillText(ch,px+30,py-28)}};
  if(!un||t.t==='noble'){atom(120,115,A,VAL(S.a));atom(340,115,B,VAL(S.b));x.fillStyle='#94a3b8';x.font='12px sans-serif';x.textAlign='center';x.fillText('electrones de valencia (puntos amarillos)',230,215)}
  else if(t.t==='ionico'){const M=f.M,X=f.X,pm=M.s===S.a?120:340,px=M.s===S.a?340:120;atom(pm,115,M,0,'+'+f.qm);atom(px,115,X,8,'−'+f.qx);x.strokeStyle='#38bdf8';x.lineWidth=3;x.beginPath();x.moveTo(pm+30,100);x.lineTo(px-30,100);x.stroke();x.fillStyle='#38bdf8';x.font='12px sans-serif';x.fillText(f.qm+' e⁻ pasan de '+M.s+' a '+X.s+' (transferencia)',230,70);x.fillText('Atracción electrostática entre iones',230,205)}
  else if(t.t==='metalico'){for(let i=0;i<6;i++)for(let j=0;j<3;j++){const px=70+i*64,py=60+j*55,e=(i+j)%2?B:A;x.fillStyle=catColor(e.s);x.beginPath();x.arc(px,py,16,0,7);x.fill();x.fillStyle='#0f172a';x.font='bold 11px sans-serif';x.textAlign='center';x.fillText(e.s+'⁺',px,py+4)}x.fillStyle='#fde68a';for(let k=0;k<26;k++){x.beginPath();x.arc(60+(k*53)%350,40+(k*37)%140,3,0,7);x.fill()}x.fillStyle='#94a3b8';x.font='12px sans-serif';x.fillText('Cationes en red + «mar» de electrones libres',230,215)}
  else{atom(160,115,A,VAL(S.a));atom(300,115,B,VAL(S.b));x.strokeStyle='#38bdf8';x.lineWidth=3;const n=f.bonds||1;for(let i=0;i<Math.min(n,3);i++){x.beginPath();x.moveTo(184,105+i*10-(Math.min(n,3)-1)*5);x.lineTo(276,105+i*10-(Math.min(n,3)-1)*5);x.stroke()}x.fillStyle='#38bdf8';x.font='12px sans-serif';x.textAlign='center';x.fillText('Se comparten pares de electrones'+(t.t==='covalente_polar'?' (más cerca de '+(A.en>B.en?A.s:B.s)+')':''),230,70)}
  const tl=[['Tipo de enlace (ΔEN)',t.t==='noble'?'—':NT[t.t],'#7c3aed']];if(t.d!=null)tl.push(['ΔEN = |'+fm(EL(S.a).en,2)+' − '+fm(EL(S.b).en,2)+'|',fm(t.d,2),'#2563eb']);tl.push(['Fórmula',f.f?sub(f.f):'—','#0d9488']);if(f.ion)tl.push(['Iones',f.M.s+sup(f.qm)+' y '+f.X.s+sup(-f.qx),'#f59e0b']);if(f.bonds)tl.push(['Pares compartidos',f.bonds,'#f59e0b']);
  $(el,'#e_tl').innerHTML=tiles(tl)};
 const cur=()=>RT[S.k];
 const rt=()=>{const d=$(el,'#e_rt'),r=cur();if(!r){d.innerHTML='🏁 <b>¡Retos completados!</b> '+S.ok+' de '+RT.length;return}
  const op=r.tipo==='formula'?r.opts:Object.values(NT).filter(x=>x!=='No forma enlace');d.innerHTML=`<b>Reto ${S.k+1}/${RT.length}:</b> ${r.q}<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${op.map((o,i)=>`<button data-o="${i}" class="sim-btn" style="background:#7c3aed">${r.tipo==='formula'?sub(o):o}</button>`).join('')}</div>`;
  d.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const v=op[+b.dataset.o],real=r.tipo==='formula'?form(r.a,r.b).f:NT[ty(r.a,r.b).t],ok=v===real,f=$(el,'#e_fb');if(ok){S.ok++;ctx.act('reto_ok',{});f.style.color='#16a34a';f.textContent='✅ Correcto. '+(r.why||'')}else{f.style.color='#dc2626';f.textContent='❌ Revisa la ΔEN y si hay un metal. Respuesta: '+(r.tipo==='formula'?real:real)+'. '+(r.why||'')}
   ctx.obs('Reto '+(S.k+1)+': '+r.a+' + '+r.b+' → '+real+(ok?' (acierto)':' (error)'));S.k++;if(S.k>=RT.length&&S.ok>=Math.ceil(RT.length*0.7))ctx.act('todo_ok',{});rt()})};
 $(el,'#e_a').onchange=e=>{S.a=e.target.value;draw(false)};$(el,'#e_b').onchange=e=>{S.b=e.target.value;draw(false)};
 $(el,'#e_go').onclick=()=>{const t=ty(S.a,S.b);ctx.act('une',{});if(!S.seen[S.a+S.b]){S.seen[S.a+S.b]=1;ctx.act('une_distinto',{})}ctx.act('tipo_'+t.t,{});ctx.obs(S.a+' + '+S.b+': '+NT[t.t]+(t.d!=null?' (ΔEN = '+fm(t.d,2)+')':'')+' → '+form(S.a,S.b).f);draw(true)};
 draw(false);rt();return{reset(){S.k=0;S.ok=0;S.seen={};$(el,'#e_fb').textContent='';rt();draw(false)}}};
/* ========== ENLACE METÁLICO: mar de electrones frente a cristal iónico ========== */
E.metalico=(el,cfg,ctx)=>{const S={v:false,hit:0,t:0};
 el.innerHTML=grid(panel('🎛️ Controles','<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">'+btn('m_v','⚡ Aplicar voltaje','#f59e0b')+btn('m_h','🔨 Golpear','#dc2626')+btn('m_r','⟲ Restablecer','#64748b')+'</div><div id="m_fb" style="margin-top:10px;font-size:13px;font-weight:700"></div>'+'<div style="font-size:12px;color:#475569;margin-top:8px">Izquierda: metal (cationes + electrones libres). Derecha: cristal iónico (cationes y aniones fijos).</div>'),
  panel('🔬 Dos materiales','<canvas id="m_cv" width="520" height="260" style="width:100%;max-width:640px;display:block;margin:auto;border-radius:10px;background:#0f172a"></canvas>')+'<div id="m_tl"></div>');
 const R=rnd(3),EE=[];for(let i=0;i<22;i++)EE.push({x:20+R()*220,y:30+R()*190,vx:0,vy:0});
 const cv=$(el,'#m_cv'),x=cv.getContext('2d');
 const draw=()=>{x.fillStyle='#0f172a';x.fillRect(0,0,520,260);
  for(let r=0;r<4;r++)for(let c=0;c<5;c++){const shift=S.hit&&r>=2?24:0,px=45+c*46+shift,py=45+r*46;x.fillStyle='#fb923c';x.beginPath();x.arc(px,py,14,0,7);x.fill();x.fillStyle='#0f172a';x.font='bold 11px sans-serif';x.textAlign='center';x.fillText('+',px,py+4)}
  EE.forEach(e=>{e.vx+=(R()-.5)*.6+(S.v?.35:0);e.vy+=(R()-.5)*.6;e.vx*=.8;e.vy*=.8;e.x+=e.vx;e.y+=e.vy;if(e.x<12)e.x=238;if(e.x>238)e.x=12;if(e.y<12)e.y=222;if(e.y>222)e.y=12;x.fillStyle='#fde68a';x.beginPath();x.arc(e.x,e.y,3,0,7);x.fill()});
  x.fillStyle='#cbd5e1';x.font='12px sans-serif';x.textAlign='center';x.fillText('METAL',140,250);
  for(let r=0;r<4;r++)for(let c=0;c<5;c++){const shift=S.hit&&r>=2?23:0,px=290+c*46+shift,py=45+r*46,pos=(r+c)%2===0;x.fillStyle=pos?'#fb923c':'#22c55e';x.beginPath();x.arc(px,py,pos?13:16,0,7);x.fill();x.fillStyle='#0f172a';x.font='bold 11px sans-serif';x.fillText(pos?'+':'−',px,py+4)}
  if(S.hit){x.strokeStyle='#ef4444';x.lineWidth=3;x.setLineDash([5,4]);x.beginPath();x.moveTo(280,92);x.lineTo(530,92);x.stroke();x.setLineDash([]);x.fillStyle='#fca5a5';x.fillText('¡grieta! (cargas iguales quedan enfrentadas)',405,112)}
  if(S.v){x.strokeStyle='#fde68a';x.lineWidth=2;x.beginPath();x.moveTo(30,14);x.lineTo(230,14);x.stroke();x.fillStyle='#fde68a';x.fillText('corriente →',130,10)}
  x.fillStyle='#cbd5e1';x.fillText('CRISTAL IÓNICO',405,250);
  $(el,'#m_tl').innerHTML=tiles([['Conduce electricidad','Metal: sí · Iónico sólido: no','#f59e0b'],['Al golpear','Metal: se deforma · Iónico: se rompe','#dc2626']])};
 const fr=frame(el,()=>draw());
 $(el,'#m_v').onclick=()=>{S.v=!S.v;ctx.act('voltaje',{});$(el,'#m_fb').textContent=S.v?'Con voltaje, los electrones libres del metal derivan en una dirección: hay corriente. El cristal iónico no tiene electrones libres.':'';ctx.obs('Voltaje '+(S.v?'aplicado':'apagado')+': el metal conduce porque sus electrones se mueven libres.')};
 $(el,'#m_h').onclick=()=>{S.hit=1;{ctx.act('golpea',{});$(el,'#m_fb').textContent='Las capas del metal se deslizan y los electrones libres mantienen el enlace (es maleable). En el cristal iónico se enfrentan cargas iguales y se rompe (es frágil).';ctx.obs('Golpe: el metal se deforma; el cristal iónico se rompe.')}};
 $(el,'#m_r').onclick=()=>{S.v=false;S.hit=0;$(el,'#m_fb').textContent=''};
 return{reset(){$(el,'#m_r').click()},pause(){},start(){}}};
/* ========== MOLÉCULAS: construir por valencias ========== */
const MOLS=[{f:'H2',n:'Hidrógeno',c:{H:2},g:'lineal',at:[['H',-1,0],['H',1,0]],b:[[0,1,1]]},{f:'O2',n:'Oxígeno',c:{O:2},g:'lineal',at:[['O',-1,0],['O',1,0]],b:[[0,1,2]]},{f:'N2',n:'Nitrógeno',c:{N:2},g:'lineal',at:[['N',-1,0],['N',1,0]],b:[[0,1,3]]},{f:'Cl2',n:'Cloro',c:{Cl:2},g:'lineal',at:[['Cl',-1,0],['Cl',1,0]],b:[[0,1,1]]},{f:'HCl',n:'Cloruro de hidrógeno',c:{H:1,Cl:1},g:'lineal',at:[['H',-1,0],['Cl',1,0]],b:[[0,1,1]]},{f:'HF',n:'Fluoruro de hidrógeno',c:{H:1,F:1},g:'lineal',at:[['H',-1,0],['F',1,0]],b:[[0,1,1]]},
 {f:'H2O',n:'Agua',c:{H:2,O:1},g:'angular',at:[['O',0,-.6],['H',-1.1,.5],['H',1.1,.5]],b:[[0,1,1],[0,2,1]]},{f:'CO2',n:'Dióxido de carbono',c:{C:1,O:2},g:'lineal',at:[['C',0,0],['O',-1.6,0],['O',1.6,0]],b:[[0,1,2],[0,2,2]]},{f:'NH3',n:'Amoníaco',c:{N:1,H:3},g:'piramidal',at:[['N',0,-.3],['H',-1.2,.7],['H',0,1.1],['H',1.2,.7]],b:[[0,1,1],[0,2,1],[0,3,1]]},{f:'CH4',n:'Metano',c:{C:1,H:4},g:'tetraédrica',at:[['C',0,0],['H',-1.1,-1.1],['H',1.1,-1.1],['H',-1.1,1.1],['H',1.1,1.1]],b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]}];
E.molecula=(el,cfg,ctx)=>{const AT=cfg.atomos,RT=cfg.retos||[];const S={n:{},k:0,ok:0,seen:{}};AT.forEach(s=>S.n[s]=0);
 const cap=s=>s==='H'||s==='F'||s==='Cl'?1:s==='O'?2:s==='N'?3:s==='C'?4:1;
 const st=(s,id)=>`<div style="display:flex;align-items:center;gap:6px;margin-top:5px"><b style="width:92px;font-size:12px">${s} <span style="color:#64748b;font-weight:600">(forma ${cap(s)} enl.)</span></b><button data-s="${s}-" class="sim-btn" style="background:#64748b">−</button><b id="${id}" style="min-width:24px;text-align:center;font-size:17px">0</b><button data-s="${s}+" class="sim-btn" style="background:#1e63e9">+</button></div>`;
 el.innerHTML=grid(panel('🎛️ Átomos disponibles',AT.map(s=>st(s,'m_n'+s)).join('')+'<div style="margin-top:8px">'+btn('m_c','⟲ Vaciar','#64748b')+'</div><div id="m_rt" style="margin-top:10px;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:8px;font-size:13px"></div><div id="m_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'),
  panel('🧬 Molécula','<canvas id="m_cv" width="420" height="260" style="width:100%;max-width:520px;display:block;margin:auto;border-radius:10px;background:#0f172a"></canvas>')+'<div id="m_tl"></div>');
 const key=()=>AT.filter(s=>S.n[s]>0).map(s=>s+S.n[s]).join('');
 const find=()=>MOLS.find(m=>Object.keys(m.c).length===AT.filter(s=>S.n[s]>0).length&&Object.keys(m.c).every(s=>S.n[s]===m.c[s]));
 const draw=()=>{AT.forEach(s=>$(el,'#m_n'+s).textContent=S.n[s]);const m=find(),cv=$(el,'#m_cv'),x=cv.getContext('2d');x.fillStyle='#0f172a';x.fillRect(0,0,420,260);const tot=AT.reduce((a,s)=>a+S.n[s]*cap(s),0);
  const atom=(px,py,s)=>{x.fillStyle=catColor(s);x.beginPath();x.arc(px,py,s==='H'?15:21,0,7);x.fill();x.fillStyle='#0f172a';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText(s,px,py+5)};
  if(m){m.b.forEach(b=>{const A=m.at[b[0]],B=m.at[b[1]];for(let i=0;i<b[2];i++){const o=(i-(b[2]-1)/2)*7;x.strokeStyle='#e2e8f0';x.lineWidth=3;x.beginPath();x.moveTo(210+A[1]*55+o,130+A[2]*55);x.lineTo(210+B[1]*55+o,130+B[2]*55);x.stroke()}});m.at.forEach(a=>atom(210+a[1]*55,130+a[2]*55,a[0]))}
  else{let i=0;AT.forEach(s=>{for(let j=0;j<S.n[s];j++){atom(40+(i%8)*48,60+Math.floor(i/8)*60,s);i++}})}
  $(el,'#m_tl').innerHTML=tiles([['Fórmula',m?sub(m.f):(key()?'(sin molécula conocida)':'—'),'#0d9488'],['Nombre',m?m.n:'—','#7c3aed'],['Geometría',m?m.g:'—','#2563eb'],['Enlaces que necesitan los átomos',tot,tot%2===0?'#16a34a':'#dc2626']]);
  if(m&&!S.seen[m.f]){S.seen[m.f]=1;ctx.act('molecula_ok',{});ctx.obs('Formaste '+m.f+' ('+m.n+').')}};
 const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
 el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const k=b.dataset.s,s=k.slice(0,-1),d=k.slice(-1)==='+'?1:-1;S.n[s]=cl(S.n[s]+d,0,6);ctx.act('agrega',{});draw()});
 $(el,'#m_c').onclick=()=>{AT.forEach(s=>S.n[s]=0);draw()};
 const rt=()=>{const d=$(el,'#m_rt'),r=RT[S.k];d.innerHTML=r?`<b>Reto ${S.k+1}/${RT.length}:</b> ${r.q} <button id="m_ck" class="sim-btn" style="background:#16a34a;margin-left:6px">✔ Comprobar</button>`:'🏁 <b>¡Retos completados!</b> '+S.ok+' de '+RT.length;
  const b=$(el,'#m_ck');if(b)b.onclick=()=>{const m=find(),f=$(el,'#m_fb'),ok=m&&m.f===r.f;if(ok){S.ok++;ctx.act('reto_ok',{});f.style.color='#16a34a';f.textContent='✅ Correcto: '+m.n+'.'}else{f.style.color='#dc2626';f.textContent='❌ Aún no. Piensa en cuántos enlaces forma cada átomo: '+(r.hint||'')}ctx.obs('Reto '+(S.k+1)+': '+(ok?'acierto':'error'));if(ok){S.k++;if(S.k>=RT.length)ctx.act('todo_ok',{});rt()}}};
 draw();rt();return{reset(){$(el,'#m_c').click();S.k=0;S.ok=0;rt()}}};
/* ========== VSEPR: geometría molecular ========== */
E.vsepr=(el,cfg,ctx)=>{const RT=cfg.retos||[];const S={bp:2,lp:0,k:0,ok:0,a:0,seen:{}};
 const TB={'2-0':['Lineal','180°','CO₂, BeH₂'],'3-0':['Trigonal plana','120°','BF₃'],'2-1':['Angular','≈ 118°','SO₂'],'4-0':['Tetraédrica','109,5°','CH₄'],'3-1':['Piramidal trigonal','≈ 107°','NH₃'],'2-2':['Angular','104,5°','H₂O']};
 const stp=(id,t)=>`<div style="display:flex;align-items:center;gap:6px;margin-top:6px"><b style="width:140px;font-size:12px">${t}</b><button data-s="${id}-" class="sim-btn" style="background:#64748b">−</button><b id="v_${id}" style="min-width:24px;text-align:center;font-size:18px">0</b><button data-s="${id}+" class="sim-btn" style="background:#1e63e9">+</button></div>`;
 el.innerHTML=grid(panel('🎛️ Átomo central',stp('bp','Pares de enlace')+stp('lp','Pares libres')+'<div style="font-size:12px;color:#64748b;margin-top:6px">Máximo 4 pares en total alrededor del átomo central.</div><div id="v_rt" style="margin-top:10px;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:8px;font-size:13px"></div><div id="v_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'),
  panel('🔬 Modelo 3D (gira solo)','<canvas id="v_cv" width="420" height="300" style="width:100%;max-width:520px;display:block;margin:auto;border-radius:10px;background:#0f172a"></canvas>')+'<div id="v_tl"></div>');
 const dirs=()=>{const n=S.bp+S.lp;if(n===2)return[[1,0,0],[-1,0,0]];if(n===3)return[[1,0,0],[-.5,.866,0],[-.5,-.866,0]];return TET};
 const info=()=>TB[S.bp+'-'+S.lp];
 const draw=()=>{$(el,'#v_bp').textContent=S.bp;$(el,'#v_lp').textContent=S.lp;const x=$(el,'#v_cv').getContext('2d');x.fillStyle='#0f172a';x.fillRect(0,0,420,300);const D=dirs().slice(0,S.bp+S.lp),items=[];
  D.forEach((d,i)=>{const p=rot3(d,S.a,0.5);items.push({p,t:i<S.bp?'b':'l'})});items.push({p:rot3([0,0,0],0,0),t:'c'});items.sort((a,b)=>a.p[2]-b.p[2]);
  const c0=pj([0,0,0],420,300,100);items.forEach(it=>{const q=pj(it.p,420,300,100);if(it.t==='c'){x.fillStyle='#f59e0b';x.beginPath();x.arc(q[0],q[1],20,0,7);x.fill();return}
   x.strokeStyle=it.t==='b'?'#e2e8f0':'#38bdf8';x.lineWidth=it.t==='b'?4:2;x.beginPath();x.moveTo(c0[0],c0[1]);x.lineTo(q[0],q[1]);x.stroke();
   if(it.t==='b'){x.fillStyle='#38bdf8';x.beginPath();x.arc(q[0],q[1],13,0,7);x.fill()}else{x.fillStyle='rgba(56,189,248,.45)';x.beginPath();x.ellipse((c0[0]+q[0])/2+(q[0]-c0[0])*.15,(c0[1]+q[1])/2+(q[1]-c0[1])*.15,18,12,Math.atan2(q[1]-c0[1],q[0]-c0[0]),0,7);x.fill();x.fillStyle='#fff';x.font='11px sans-serif';x.textAlign='center';x.fillText('••',q[0]*.85+c0[0]*.15,q[1]*.85+c0[1]*.15+4)}});
  const f=info();$(el,'#v_tl').innerHTML=tiles([['Geometría',f[0],'#7c3aed'],['Ángulo aproximado',f[1],'#2563eb'],['Ejemplo',f[2],'#0d9488'],['Pares de enlace / libres',S.bp+' / '+S.lp,'#f59e0b']])};
 const fr=frame(el,()=>{S.a+=0.02;draw()});
 const chg=()=>{const k=S.bp+'-'+S.lp;if(!S.seen[k]){S.seen[k]=1;ctx.act('geom_nueva',{})}ctx.act('cambia',{})};
 el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const k=b.dataset.s,id=k.slice(0,-1),d=k.slice(-1)==='+'?1:-1;if(id==='bp')S.bp=Math.max(2,Math.min(4,S.bp+d));else S.lp=Math.max(0,S.lp+d);if(S.bp+S.lp>4){if(id==='bp')S.lp=4-S.bp;else S.lp=4-S.bp}chg();draw()});
 const rt=()=>{const d=$(el,'#v_rt'),r=RT[S.k];d.innerHTML=r?`<b>Reto ${S.k+1}/${RT.length}:</b> ${r.q} <button id="v_ck" class="sim-btn" style="background:#16a34a;margin-left:6px">✔ Comprobar</button>`:'🏁 <b>¡Retos completados!</b> '+S.ok+' de '+RT.length;
  const b=$(el,'#v_ck');if(b)b.onclick=()=>{const f=$(el,'#v_fb'),ok=S.bp===r.bp&&S.lp===r.lp;if(ok){S.ok++;ctx.act('reto_ok',{});f.style.color='#16a34a';f.textContent='✅ Correcto. '+(r.why||'')}else{f.style.color='#dc2626';f.textContent='❌ Cuenta los pares de electrones alrededor del átomo central. '+(r.why||'')}ctx.obs('Reto '+(S.k+1)+': '+(ok?'acierto':'error'));if(ok){S.k++;if(S.k>=RT.length)ctx.act('todo_ok',{});rt()}}};
 rt();draw();return{reset(){S.bp=2;S.lp=0;S.k=0;S.ok=0;S.seen={};rt();draw()},pause(){},start(){}}};
/* ========== POLARIDAD MOLECULAR ========== */
const sp3=(n,r)=>TET.slice(0,n).map(v=>v.map(c=>c*r));
const PM=[{f:'CO2',n:'Dióxido de carbono',c:'C',a:[['O',[1.16,0,0]],['O',[-1.16,0,0]]]},{f:'H2O',n:'Agua',c:'O',a:[['H',[.76,-.59,0]],['H',[-.76,-.59,0]]]},{f:'CH4',n:'Metano',c:'C',a:sp3(4,1.09).map(v=>['H',v])},{f:'NH3',n:'Amoníaco',c:'N',a:[0,1,2].map(i=>['H',[.938*Math.cos(i*2.0944),.938*Math.sin(i*2.0944),-.375]])},{f:'BF3',n:'Trifluoruro de boro',c:'B',a:[0,1,2].map(i=>['F',[1.3*Math.cos(i*2.0944),1.3*Math.sin(i*2.0944),0]])},{f:'CCl4',n:'Tetracloruro de carbono',c:'C',a:sp3(4,1.77).map(v=>['Cl',v])},{f:'CH3Cl',n:'Clorometano',c:'C',a:[['Cl',TET[0].map(c=>c*1.78)]].concat(sp3(4,1.09).slice(1).map(v=>['H',v]))},{f:'HCl',n:'Cloruro de hidrógeno',c:'Cl',a:[['H',[-1.27,0,0]]]}];
E.polar=(el,cfg,ctx)=>{const L=PM.filter(m=>cfg.mols.includes(m.f));const S={i:0,a:0,seen:{},ok:0,done:{}};
 el.innerHTML=grid(panel('🎛️ Molécula',lab('Elige una molécula')+sel('p_m',L.map((m,i)=>[i,m.n+' — '+m.f]),0)+'<div id="p_q" style="margin-top:10px;font-size:13px;font-weight:700">¿Es polar o apolar? Predice y luego comprueba.</div><div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">'+btn('p_p','Es polar','#dc2626')+btn('p_a','Es apolar','#2563eb')+btn('p_v','🔍 Mostrar dipolos','#16a34a')+'</div><div id="p_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'),
  panel('🔬 Dipolos de enlace y dipolo neto (3D)','<canvas id="p_cv" width="420" height="300" style="width:100%;max-width:520px;display:block;margin:auto;border-radius:10px;background:#0f172a"></canvas>')+'<div id="p_tl"></div>');
 const cm=()=>L[S.i],net=m=>{const C=EL(m.c);let v=[0,0,0];const bonds=m.a.map(([s,p])=>{const X=EL(s),l=Math.hypot(...p),u=p.map(c=>c/l),dm=(X.en-C.en),vec=u.map(c=>c*dm);v=v.map((c,i)=>c+vec[i]);return{s,p,dm,vec}});return{v,mag:Math.hypot(...v),bonds}};
 let show=false;
 const draw=()=>{const m=cm(),N=net(m),x=$(el,'#p_cv').getContext('2d');x.fillStyle='#0f172a';x.fillRect(0,0,420,300);const sc=64,c0=pj([0,0,0],420,300,sc);const items=[{t:'c',s:m.c,p:rot3([0,0,0],S.a,.35)}].concat(m.a.map(([s,p])=>({t:'a',s,p:rot3(p,S.a,.35)})));items.sort((a,b)=>a.p[2]-b.p[2]);
  items.forEach(it=>{const q=pj(it.p,420,300,sc);if(it.t==='a'){x.strokeStyle='#e2e8f0';x.lineWidth=3;x.beginPath();x.moveTo(c0[0],c0[1]);x.lineTo(q[0],q[1]);x.stroke()}
   x.fillStyle=catColor(it.s);x.beginPath();x.arc(q[0],q[1],it.s==='H'?11:it.t==='c'?19:17,0,7);x.fill();x.fillStyle='#0f172a';x.font='bold 12px sans-serif';x.textAlign='center';x.fillText(it.s,q[0],q[1]+4)});
  if(show){N.bonds.forEach(b=>{const q=rot3(b.vec.map(c=>c*0.9),S.a,.35),r=pj(q,420,300,sc*.8);if(Math.hypot(b.vec[0],b.vec[1],b.vec[2])<.02)return;arrow(x,c0[0],c0[1],r[0],r[1],'#facc15',2.4)});
   if(N.mag>0.05){const q=rot3(N.v.map(c=>c*0.9),S.a,.35),r=pj(q,420,300,sc*.8);arrow(x,c0[0],c0[1],r[0],r[1],'#f43f5e',4.5)}}
  $(el,'#p_tl').innerHTML=tiles([['ΔEN de cada enlace',N.bonds.map(b=>fm(Math.abs(b.dm),2)).filter((v,i,a)=>a.indexOf(v)===i).join(' · '),'#2563eb'],['Dipolo neto (unidades relativas)',show?fm(N.mag,2):'¿?','#f43f5e'],['Resultado',show?(N.mag>0.05?'Molécula polar':'Molécula apolar'):'¿?','#7c3aed']])};
 const arrow=(x,x0,y0,x1,y1,c,w)=>{x.strokeStyle=c;x.fillStyle=c;x.lineWidth=w;x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke();const a=Math.atan2(y1-y0,x1-x0);x.beginPath();x.moveTo(x1,y1);x.lineTo(x1-10*Math.cos(a-.4),y1-10*Math.sin(a-.4));x.lineTo(x1-10*Math.cos(a+.4),y1-10*Math.sin(a+.4));x.fill()};
 const fr=frame(el,()=>{S.a+=0.015;draw()});
 const pred=v=>{const m=cm(),N=net(m),real=N.mag>0.05,f=$(el,'#p_fb');show=true;ctx.act('predice',{});const ok=v===real;if(ok){ctx.act('predice_ok',{});if(!S.done[m.f]){S.done[m.f]=1;S.ok++;if(S.ok>=Math.ceil(L.length*0.75))ctx.act('todo_ok',{})}}
  f.style.color=ok?'#16a34a':'#dc2626';f.textContent=(ok?'✅ Correcto. ':'❌ No. ')+(real?'Los dipolos de enlace no se cancelan por la geometría: la molécula es polar.':'Los dipolos de enlace se cancelan por la geometría simétrica (o no hay dipolos): es apolar.');ctx.obs(m.f+': '+(real?'polar':'apolar')+(ok?' (acierto)':' (error)'))};
 $(el,'#p_p').onclick=()=>pred(true);$(el,'#p_a').onclick=()=>pred(false);$(el,'#p_v').onclick=()=>{show=true;ctx.act('ver',{})};
 $(el,'#p_m').onchange=e=>{S.i=+e.target.value;show=false;$(el,'#p_fb').textContent='';ctx.act('cambia',{})};
 draw();return{reset(){S.done={};S.ok=0;show=false;$(el,'#p_fb').textContent=''},pause(){},start(){}}};
/* ========== FUERZAS INTERMOLECULARES: puntos de ebullición de hidruros ========== */
const HY={14:{n:'Grupo 14 (CH₄, SiH₄, GeH₄, SnH₄)',s:[['CH4',2,-161.5,16.04,'London (dispersión)'],['SiH4',3,-111.9,32.12,'London (dispersión)'],['GeH4',4,-88.5,76.67,'London (dispersión)'],['SnH4',5,-52,122.7,'London (dispersión)']]},15:{n:'Grupo 15 (NH₃, PH₃, AsH₃, SbH₃)',s:[['NH3',2,-33.3,17.03,'Puente de hidrógeno'],['PH3',3,-87.7,34.0,'London y dipolo débil'],['AsH3',4,-62.5,77.95,'London y dipolo-dipolo'],['SbH3',5,-17,124.8,'London y dipolo-dipolo']]},16:{n:'Grupo 16 (H₂O, H₂S, H₂Se, H₂Te)',s:[['H2O',2,100,18.02,'Puente de hidrógeno'],['H2S',3,-60.3,34.08,'Dipolo-dipolo y London'],['H2Se',4,-41.4,80.98,'Dipolo-dipolo y London'],['H2Te',5,-2,129.6,'Dipolo-dipolo y London']]},17:{n:'Grupo 17 (HF, HCl, HBr, HI)',s:[['HF',2,19.5,20.01,'Puente de hidrógeno'],['HCl',3,-85,36.46,'Dipolo-dipolo y London'],['HBr',4,-66.8,80.91,'Dipolo-dipolo y London'],['HI',5,-35.4,127.9,'Dipolo-dipolo y London']]}};
E.intermol=(el,cfg,ctx)=>{const RT=cfg.retos||[];const S={g:16,k:0,ok:0};
 el.innerHTML=grid(panel('🎛️ Controles',lab('Familia de hidruros')+sel('i_g',Object.keys(HY).map(g=>[g,HY[g].n]),16)+'<div id="i_rt" style="margin-top:10px;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:8px;font-size:13px"></div><div id="i_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'),
  panel('📈 Punto de ebullición según el periodo del elemento','<canvas id="i_cv" style="width:100%;display:block"></canvas>')+'<div id="i_tb"></div>');
 const all=()=>Object.values(HY).flatMap(h=>h.s);
 const draw=()=>{const h=HY[S.g].s;SIM.plot($(el,'#i_cv'),{h:270,xmin:1.5,xmax:5.5,ymin:-180,ymax:120,xl:'Periodo del elemento (más grande = más masa)',yl:'Punto de ebullición (°C)',series:[{pts:h.map(a=>[a[1],a[2]]),color:'#2563eb'}],pts:h.map(a=>({x:a[1],y:a[2],r:5,fill:a[4].startsWith('Puente')?'#fecaca':'#fff',color:a[4].startsWith('Puente')?'#dc2626':'#2563eb',label:a[0].replace(/\d/g,d=>'₀₁₂₃₄₅₆₇₈₉'[+d])+' '+a[2]})),hlines:[{y:0,color:'#94a3b8',label:''}]});
  $(el,'#i_tb').innerHTML=`<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:6px"><tr style="background:#f1f5f9"><th style="padding:5px;text-align:left">Sustancia</th><th>Masa molar (g/mol)</th><th>P. ebullición (°C)</th><th style="text-align:left">Fuerza dominante</th></tr>${h.map(a=>`<tr style="border-top:1px solid #e2e8f0"><td style="padding:5px"><b>${sub(a[0])}</b></td><td style="text-align:center">${fm(a[3],1)}</td><td style="text-align:center">${fm(a[2],1)}</td><td>${a[4]}</td></tr>`).join('')}</table>`};
 $(el,'#i_g').onchange=e=>{S.g=+e.target.value;ctx.act('serie',{});draw()};
 const rt=()=>{const d=$(el,'#i_rt'),r=RT[S.k];if(!r){d.innerHTML='🏁 <b>¡Retos completados!</b> '+S.ok+' de '+RT.length;return}
  d.innerHTML=`<b>Reto ${S.k+1}/${RT.length}:</b> ${r.q}<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${r.o.map((o,i)=>`<button data-o="${i}" class="sim-btn" style="background:#7c3aed">${sub(o)}</button>`).join('')}</div>`;
  d.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const ok=+b.dataset.o===r.ok,f=$(el,'#i_fb');if(ok){S.ok++;ctx.act('reto_ok',{});f.style.color='#16a34a';f.textContent='✅ '+r.why}else{f.style.color='#dc2626';f.textContent='❌ '+r.why}ctx.obs('Reto '+(S.k+1)+': '+(ok?'acierto':'error'));S.k++;if(S.k>=RT.length&&S.ok>=Math.ceil(RT.length*0.7))ctx.act('todo_ok',{});rt()})};
 draw();rt();return{reset(){S.k=0;S.ok=0;$(el,'#i_fb').textContent='';rt()}}};

/* ========== helpers etapa 3b ========== */
const dsub=s=>String(s).replace(/([A-Za-z)])(\d+)/g,(m,a,d)=>a+d.split('').map(c=>'₀₁₂₃₄₅₆₇₈₉'[+c]).join(''));
const mkRetoUI=(el,RT,ctx,P,onDone)=>{/* reto de opción múltiple genérico: P = prefijo de ids */const S={k:0,ok:0};el.__rt=RT;
 const draw=()=>{const d=$(el,'#'+P+'_rt'),r=RT[S.k];if(!d)return;if(!r){d.innerHTML='🏁 <b>¡Retos completados!</b> '+S.ok+' de '+RT.length;return}
  d.innerHTML=`<b>Reto ${S.k+1}/${RT.length}:</b> ${r.q}<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${r.o.map((o,i)=>`<button data-o="${i}" class="sim-btn" style="background:#7c3aed">${dsub(esc(o))}</button>`).join('')}</div>`;
  d.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const ok=+b.dataset.o===r.ok,f=$(el,'#'+P+'_fb');if(ok){S.ok++;ctx.act('reto_ok',{});f.style.color='#16a34a';f.textContent='✅ '+(r.why||'')}else{f.style.color='#dc2626';f.textContent='❌ '+(r.why||'')}
   ctx.obs('Reto '+(S.k+1)+': '+(ok?'acierto':'error'));S.k++;if(S.k>=RT.length&&S.ok>=Math.ceil(RT.length*0.7))ctx.act('todo_ok',{});draw()})};
 return{draw,reset(){S.k=0;S.ok=0;const f=$(el,'#'+P+'_fb');if(f)f.textContent='';draw()}}};
const rhold=P=>`<div id="${P}_rt" style="margin-top:10px;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:8px;font-size:13px"></div><div id="${P}_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>`;
const shuf=(a,seed)=>{const r=rnd(seed),b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};

/* ========== NOMEN: fórmulas y nombres de compuestos binarios y ternarios simples ========== */
const CAT={Na:{s:'Na',q:1,n:'sodio'},K:{s:'K',q:1,n:'potasio'},Li:{s:'Li',q:1,n:'litio'},Mg:{s:'Mg',q:2,n:'magnesio'},Ca:{s:'Ca',q:2,n:'calcio'},Al:{s:'Al',q:3,n:'aluminio'},Zn:{s:'Zn',q:2,n:'zinc'},Ag:{s:'Ag',q:1,n:'plata'},
 Fe2:{s:'Fe',q:2,n:'hierro (II)'},Fe3:{s:'Fe',q:3,n:'hierro (III)'},Cu1:{s:'Cu',q:1,n:'cobre (I)'},Cu2:{s:'Cu',q:2,n:'cobre (II)'},NH4:{s:'NH4',q:1,n:'amonio',poly:1}};
const ANI={Cl:{s:'Cl',q:1,n:'cloruro'},Br:{s:'Br',q:1,n:'bromuro'},F:{s:'F',q:1,n:'fluoruro'},S:{s:'S',q:2,n:'sulfuro'},O:{s:'O',q:2,n:'óxido'},OH:{s:'OH',q:1,n:'hidróxido',poly:1},NO3:{s:'NO3',q:1,n:'nitrato',poly:1},SO4:{s:'SO4',q:2,n:'sulfato',poly:1},CO3:{s:'CO3',q:2,n:'carbonato',poly:1}};
const nfor=(c,a)=>{const C=CAT[c],A=ANI[a],g=gcd(C.q,A.q),nc=A.q/g,na=C.q/g;const part=(X,k)=>k>1?(X.poly?'('+X.s+')'+k:X.s+k):X.s;return{f:part(C,nc)+part(A,na),nc,na,g}};
const nnom=(c,a)=>ANI[a].n+' de '+CAT[c].n;
E.nomen=(el,cfg,ctx)=>{const CL=cfg.cats,AL=cfg.anis;const S={c:CL[0],a:AL[0],seen:{}};const RT=[];
 (cfg.retos||[]).forEach((r,i)=>{const R=nfor(r.c,r.a);let opts,ok;
  if(r.t==='f'){const q=CAT[r.c].q,w=ANI[r.a].q,P=(X,k)=>k>1?(X.poly?'('+X.s+')'+k:X.s+k):X.s,fo=(x,y)=>P(CAT[r.c],x)+P(ANI[r.a],y);
   const cand=[R.f,fo(1,1),fo(q,w),fo(R.na,R.nc),fo(2,1),fo(1,2),fo(3,1)];const u=[];cand.forEach(x=>{if(!u.includes(x))u.push(x)});opts=shuf(u.slice(0,4),i+3);ok=opts.indexOf(R.f);
   RT.push({q:`¿Cuál es la fórmula de <b>${nnom(r.c,r.a)}</b>?`,o:opts,ok,why:`${CAT[r.c].s}${sup(CAT[r.c].q)} + ${ANI[r.a].s}${sup(-ANI[r.a].q)} → intercambias las cargas y simplificas: ${dsub(R.f)}.`})}
  else{const cand=[nnom(r.c,r.a)];CL.forEach(c=>{if(c!==r.c)cand.push(nnom(c,r.a))});AL.forEach(a=>{if(a!==r.a)cand.push(nnom(r.c,a))});if(r.c==='Fe2')cand.push(nnom('Fe3',r.a));if(r.c==='Cu2')cand.push(nnom('Cu1',r.a));
   const u=[];cand.forEach(x=>{if(!u.includes(x))u.push(x)});const w=[u[0]].concat(shuf(u.slice(1),i+9).slice(0,3));opts=shuf(w,i+5);ok=opts.indexOf(u[0]);
   RT.push({q:`¿Cómo se llama el compuesto <b>${dsub(R.f)}</b>?`,o:opts,ok,why:`${dsub(R.f)} contiene ${CAT[r.c].s}${sup(CAT[r.c].q)} y ${ANI[r.a].s}${sup(-ANI[r.a].q)}: ${nnom(r.c,r.a)}.`})}});
 el.innerHTML=grid(panel('🎛️ Construye un compuesto',lab('Catión (ion positivo)')+sel('n_c',CL.map(c=>[c,CAT[c].n+' ('+CAT[c].s+sup(CAT[c].q)+')']),S.c)+lab('Anión (ion negativo)')+sel('n_a',AL.map(a=>[a,ANI[a].n+' ('+ANI[a].s+sup(-ANI[a].q)+')']),S.a)+(RT.length?rhold('n'):'<div id="n_rt"></div><div id="n_fb"></div>')),
  panel('🧩 Cruce de cargas','<div id="n_cv" style="font-size:15px;line-height:1.7"></div>')+'<div id="n_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'n');
 const draw=()=>{const C=CAT[S.c],A=ANI[S.a],R=nfor(S.c,S.a),tot=R.nc*C.q-R.na*A.q;S.seen[R.f]=1;
  $(el,'#n_cv').innerHTML=`<div>1) Catión: <b>${C.s}${sup(C.q)}</b> (carga +${C.q}) · Anión: <b>${A.s}${sup(-A.q)}</b> (carga −${A.q})</div><div>2) Cruzas las cargas: el catión necesita <b>${R.nc}</b> y el anión <b>${R.na}</b> (después de simplificar${R.g>1?' entre '+R.g:''}).</div><div>3) Fórmula: <span style="font-size:22px;font-weight:900;color:#1e63e9">${dsub(R.f)}</span>${R.nc>1&&A.poly===undefined&&false?'':''}</div><div>4) Carga total: ${R.nc}×(+${C.q}) + ${R.na}×(−${A.q}) = <b>${tot}</b> ${tot===0?'✅ neutro':'❌'}</div><div>5) Nombre: <b>${esc(nnom(S.c,S.a))}</b>${(S.c==='Fe2'||S.c==='Fe3'||S.c==='Cu1'||S.c==='Cu2')?'<div style="font-size:12px;color:#64748b">El número romano indica la carga del metal (nomenclatura Stock): el hierro y el cobre tienen más de una carga posible.</div>':''}${(A.poly&&R.na>1||C.poly&&R.nc>1)?'<div style="font-size:12px;color:#64748b">Los paréntesis agrupan un ion de varios átomos para que el subíndice afecte a todo el grupo.</div>':''}</div>`;
  $(el,'#n_tl').innerHTML=tiles([['Compuestos construidos',Object.keys(S.seen).length,'#2563eb']])};
 const ch=()=>{S.c=$(el,'#n_c').value;S.a=$(el,'#n_a').value;const R=nfor(S.c,S.a);ctx.act('forma',{});ctx.obs('Construido: '+R.f+' ('+nnom(S.c,S.a)+')');draw()};
 $(el,'#n_c').onchange=ch;$(el,'#n_a').onchange=ch;draw();U.draw();return{reset(){S.seen={};draw();U.reset()}}};

/* ========== LABRX: mezclas de sustancias y evidencias de reacción ========== */
const RX={HCl:{n:'Ácido clorhídrico (HCl) diluido',c:'#e0f2fe',sol:1},NaOH:{n:'Hidróxido de sodio (NaOH) diluido',c:'#e0f2fe',sol:1},CaCO3:{n:'Carbonato de calcio (CaCO₃) sólido',c:'#f8fafc',sol:0},Mg:{n:'Magnesio (Mg) metal',c:'#cbd5e1',sol:0},Zn:{n:'Zinc (Zn) metal',c:'#94a3b8',sol:0},Fe:{n:'Hierro (Fe) metal',c:'#64748b',sol:0},Cu:{n:'Cobre (Cu) metal',c:'#c2410c',sol:0},
 CuSO4:{n:'Sulfato de cobre (CuSO₄) disuelto',c:'#60a5fa',sol:1},AgNO3:{n:'Nitrato de plata (AgNO₃) disuelto',c:'#e0f2fe',sol:1},NaCl:{n:'Cloruro de sodio (NaCl) disuelto',c:'#e0f2fe',sol:1}};
const RXP={'CaCO3|HCl':{t:'gas',eq:'CaCO3 + 2 HCl → CaCl2 + H2O + CO2↑',o:'Se forman burbujas (CO₂): efervescencia. El sólido se va consumiendo.',col:'#e0f2fe',gas:1},
 'HCl|Mg':{t:'gas',eq:'Mg + 2 HCl → MgCl2 + H2↑',o:'Burbujas rápidas (H₂) y el tubo se calienta. El magnesio se consume.',col:'#e0f2fe',gas:2,heat:1},
 'HCl|Zn':{t:'gas',eq:'Zn + 2 HCl → ZnCl2 + H2↑',o:'Burbujas de H₂ moderadas sobre el zinc.',col:'#e0f2fe',gas:1},
 'Fe|HCl':{t:'gas',eq:'Fe + 2 HCl → FeCl2 + H2↑',o:'Burbujas lentas de H₂; la solución toma un tono verdoso pálido con el tiempo.',col:'#dcfce7',gas:1},
 'HCl|NaOH':{t:'calor',eq:'HCl + NaOH → NaCl + H2O',o:'No hay burbujas ni sólido; el recipiente se calienta ligeramente (neutralización exotérmica).',col:'#e0f2fe',heat:1},
 'AgNO3|NaCl':{t:'ppt',eq:'AgNO3 + NaCl → AgCl↓ + NaNO3',o:'Aparece un sólido blanco (AgCl) que se deposita: precipitado.',col:'#f1f5f9',ppt:'#ffffff'},
 'AgNO3|HCl':{t:'ppt',eq:'AgNO3 + HCl → AgCl↓ + HNO3',o:'Aparece un sólido blanco (AgCl): precipitado.',col:'#f1f5f9',ppt:'#ffffff'},
 'CuSO4|NaOH':{t:'ppt',eq:'CuSO4 + 2 NaOH → Cu(OH)2↓ + Na2SO4',o:'Se forma un sólido azul gelatinoso, Cu(OH)₂: precipitado.',col:'#bfdbfe',ppt:'#3b82f6'},
 'AgNO3|NaOH':{t:'ppt',eq:'2 AgNO3 + 2 NaOH → Ag2O↓ + 2 NaNO3 + H2O',o:'Aparece un sólido pardo oscuro (Ag₂O): precipitado.',col:'#f1f5f9',ppt:'#78350f'},
 'CuSO4|Zn':{t:'color',eq:'CuSO4 + Zn → ZnSO4 + Cu',o:'El azul se aclara y el zinc se cubre de un depósito rojizo (cobre metálico): cambio de color.',col:'#bfdbfe',dep:'#c2410c'},
 'CuSO4|Fe':{t:'color',eq:'CuSO4 + Fe → FeSO4 + Cu',o:'El azul se desvanece y el hierro se cubre de cobre rojizo: cambio de color.',col:'#d1fae5',dep:'#c2410c'},
 'CuSO4|Mg':{t:'color',eq:'CuSO4 + Mg → MgSO4 + Cu',o:'El azul se decolora, se forma cobre rojizo sobre el magnesio y el tubo se calienta.',col:'#f1f5f9',dep:'#c2410c',heat:1},
 'AgNO3|Cu':{t:'color',eq:'Cu + 2 AgNO3 → Cu(NO3)2 + 2 Ag',o:'La plata se deposita como cristales brillantes sobre el cobre y la solución se vuelve azul: cambio de color.',col:'#93c5fd',dep:'#e2e8f0'},
 'AgNO3|Zn':{t:'color',eq:'Zn + 2 AgNO3 → Zn(NO3)2 + 2 Ag',o:'Se forma un depósito plateado (Ag) sobre el zinc.',col:'#f1f5f9',dep:'#e2e8f0'},
 'AgNO3|Fe':{t:'color',eq:'Fe + 2 AgNO3 → Fe(NO3)2 + 2 Ag',o:'Se forma un depósito plateado (Ag) sobre el hierro.',col:'#ecfccb',dep:'#e2e8f0'},
 'AgNO3|Mg':{t:'color',eq:'Mg + 2 AgNO3 → Mg(NO3)2 + 2 Ag',o:'Se forma un depósito plateado sobre el magnesio y el tubo se calienta.',col:'#f1f5f9',dep:'#e2e8f0',heat:1}};
const RXT={gas:'🫧 Desprendimiento de gas',ppt:'⚪ Formación de precipitado',color:'🎨 Cambio de color / depósito',calor:'🌡️ Cambio de temperatura (sin otros signos)',none:'🚫 No se observa reacción'};
E.labrx=(el,cfg,ctx)=>{const L=cfg.reac||Object.keys(RX);const S={a:L[0],b:L[1],log:[],pred:'',pairs:{}};
 el.innerHTML=grid(panel('🎛️ Mezcla',lab('Sustancia A')+sel('x_a',L.map(k=>[k,RX[k].n]),S.a)+lab('Sustancia B')+sel('x_b',L.map(k=>[k,RX[k].n]),S.b)+lab('Mi predicción (opcional)')+sel('x_p',[['','— sin predicción —']].concat(Object.keys(RXT).map(k=>[k,RXT[k]])),'')+`<div style="display:flex;gap:6px;margin-top:10px">${btn('x_go','🧪 Mezclar','#0d9488')}${btn('x_cl','Limpiar registro','#64748b')}</div><div id="x_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>`),
  panel('🔬 Tubo de ensayo','<svg id="x_sv" viewBox="0 0 300 220" style="width:100%;height:auto;max-height:260px"></svg><div id="x_ob" style="font-size:13px;margin-top:4px"></div>')+panel('📋 Registro de observaciones','<div id="x_lg" style="overflow:auto"></div>')+'<div id="x_tl"></div>');
 const key=(a,b)=>[a,b].sort().join('|');
 const tube=(col,o)=>{const o2=o||{};let g='';if(o2.gas)for(let i=0;i<8*o2.gas;i++)g+=`<circle cx="${112+(i*37%76)}" cy="${60+(i*53%100)}" r="${2+(i%3)}" fill="#fff" stroke="#38bdf8"/>`;
  $(el,'#x_sv').innerHTML=`<path d="M100 20 L100 170 Q150 215 200 170 L200 20" fill="none" stroke="#64748b" stroke-width="4"/><path d="M104 70 L104 168 Q150 208 196 168 L196 70 Z" fill="${col}" opacity=".9"/>${o2.ppt?`<path d="M112 178 Q150 200 188 178 L190 158 L110 158 Z" fill="${o2.ppt}" stroke="#94a3b8"/>`:''}${o2.dep?`<rect x="140" y="50" width="16" height="108" rx="4" fill="${o2.dep}" stroke="#7c2d12"/>`:''}${g}${o2.heat?'<text x="212" y="120" font-size="22">🌡️</text>':''}`};
 const upd=()=>{S.a=$(el,'#x_a').value;S.b=$(el,'#x_b').value;tube(RX[S.a].c)};
 const lg=()=>{$(el,'#x_lg').innerHTML=S.log.length?`<table style="width:100%;border-collapse:collapse;font-size:12.5px"><tr style="background:#f1f5f9"><th style="padding:5px;text-align:left">Mezcla</th><th style="text-align:left">Evidencia</th><th style="text-align:left">Ecuación</th></tr>${S.log.map(r=>`<tr style="border-top:1px solid #e2e8f0"><td style="padding:5px">${dsub(r.a)} + ${dsub(r.b)}</td><td>${esc(RXT[r.t])}</td><td>${dsub(esc(r.eq))}</td></tr>`).join('')}</table>`:'<div style="color:#64748b;font-size:13px">Aún no has mezclado nada.</div>';
  $(el,'#x_tl').innerHTML=tiles([['Mezclas hechas',S.log.length,'#2563eb'],['Con reacción',S.log.filter(r=>r.t!=='none').length,'#16a34a'],['Sin reacción',S.log.filter(r=>r.t==='none').length,'#64748b']])};
 $(el,'#x_a').onchange=upd;$(el,'#x_b').onchange=upd;
 $(el,'#x_cl').onclick=()=>{S.log=[];S.pairs={};lg()};
 $(el,'#x_go').onclick=()=>{const f=$(el,'#x_fb');if(S.a===S.b){f.style.color='#b45309';f.textContent='Elige dos sustancias distintas.';return}
  const k=key(S.a,S.b),r=RXP[k],pe=$(el,'#x_p').value;let t,eq,ob,col,o;
  if(r){t=r.t;eq=r.eq;ob=r.o;col=r.col;o=r}else{const s1=RX[S.a].sol,s2=RX[S.b].sol;t='none';eq='sin reacción';ob=(!s1&&!s2)?'Dos sólidos secos no reaccionan a temperatura ambiente: no hay contacto entre partículas.':'No se observa burbujas, sólido nuevo, cambio de color ni de temperatura en las condiciones del modelo (soluciones diluidas, temperatura ambiente).';col=RX[S.a].sol?RX[S.a].c:RX[S.b].c;o={}}
  tube(col,o);$(el,'#x_ob').innerHTML='<b>Observación:</b> '+esc(ob)+(t!=='none'?'<br><b>Ecuación:</b> '+dsub(esc(eq)):'');
  S.log.push({a:S.a,b:S.b,t,eq});S.pairs[k]=1;ctx.act('mezcla',{});if(t!=='none')ctx.act('reacciona',{});else ctx.act('noreacciona',{});ctx.act('mezcla_'+(t),{});
  ctx.obs(S.a+' + '+S.b+': '+RXT[t]);
  if(pe){const ok=pe===t;ctx.act(ok?'pred_ok':'pred_mal',{});f.style.color=ok?'#16a34a':'#dc2626';f.textContent=ok?'✅ Tu predicción coincide con lo observado.':'❌ Lo observado fue distinto: '+RXT[t]+'. Revisa por qué.'}else{f.style.color='#475569';f.textContent=''}
  if(Object.keys(S.pairs).length>=cfg.meta)ctx.act('todo_ok',{});lg()};
 upd();lg();return{reset(){S.log=[];S.pairs={};lg()}}};

/* ========== BALANCEO: conteo de átomos y conservación de la masa ========== */
const parseF=f=>{const st=[{}];let i=0;const num=()=>{let n='';while(/\d/.test(f[i]||''))n+=f[i++];return n?+n:1};
 while(i<f.length){const c=f[i];if(c==='('){st.push({});i++}else if(c===')'){i++;const k=num(),t=st.pop();for(const e in t)st[st.length-1][e]=(st[st.length-1][e]||0)+t[e]*k}
  else{let s=c;i++;if(/[a-z]/.test(f[i]||'')){s+=f[i];i++}const k=num();st[st.length-1][s]=(st[st.length-1][s]||0)+k}}return st[0]};
const mmF=f=>{const a=parseF(f);let m=0;for(const e in a)m+=EL(e).m*a[e];return m};
E.balanceo=(el,cfg,ctx)=>{const EQ=cfg.ecs;const S={i:0,co:[],done:{}};
 const eq=()=>EQ[S.i];const init=()=>{S.co=eq().L.concat(eq().R).map(()=>1)};init();
 el.innerHTML=grid(panel('🎛️ Ecuación',lab('Elige una ecuación')+sel('b_e',EQ.map((e,i)=>[i,e.nombre]),0)+'<div id="b_co" style="margin-top:8px"></div>'+`<div style="display:flex;gap:6px;margin-top:10px">${btn('b_ver','✔️ Verificar','#0d9488')}${btn('b_rs','↺ Reiniciar coeficientes','#64748b')}</div><div id="b_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>`),
  panel('⚖️ Conteo de átomos'+(cfg.masa?' y masa':''),'<div id="b_tb" style="overflow:auto"></div>')+'<div id="b_tl"></div>');
 const sp=()=>eq().L.concat(eq().R);
 const cnt=side=>{const t={},A=side==='L'?eq().L:eq().R,off=side==='L'?0:eq().L.length;A.forEach((f,i)=>{const a=parseF(f);for(const e in a)t[e]=(t[e]||0)+a[e]*S.co[off+i]});return t};
 const bal=()=>{const l=cnt('L'),r=cnt('R'),ks=new Set(Object.keys(l).concat(Object.keys(r)));let ok=true;ks.forEach(k=>{if((l[k]||0)!==(r[k]||0))ok=false});return ok};
 const mass=side=>{const A=side==='L'?eq().L:eq().R,off=side==='L'?0:eq().L.length;return A.reduce((s,f,i)=>s+mmF(f)*S.co[off+i],0)};
 const draw=()=>{const E_=eq(),all=sp(),nL=E_.L.length;
  $(el,'#b_co').innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:16px;font-weight:800">${all.map((f,i)=>`${i===nL?'<span>→</span>':i>0?'<span>+</span>':''}<span style="display:inline-flex;align-items:center;gap:3px;border:2px solid #e2e8f0;border-radius:10px;padding:3px 6px"><button data-d="${i}" style="width:24px;height:24px;border-radius:6px;border:1px solid #cbd5e1;background:#f8fafc;font-weight:900">−</button><b style="min-width:18px;text-align:center;color:#1e63e9">${S.co[i]}</b><button data-u="${i}" style="width:24px;height:24px;border-radius:6px;border:1px solid #cbd5e1;background:#f8fafc;font-weight:900">+</button>${dsub(f)}</span>`).join('')}</div>${E_.pista?`<div style="font-size:12.5px;background:#f0fdf4;border-radius:8px;padding:6px;margin-top:8px">${esc(E_.pista)}</div>`:''}`;
  el.querySelectorAll('#b_co [data-d]').forEach(b=>b.onclick=()=>{const i=+b.dataset.d;if(S.co[i]>1){S.co[i]--;ctx.act('cambia',{});draw()}});
  el.querySelectorAll('#b_co [data-u]').forEach(b=>b.onclick=()=>{const i=+b.dataset.u;if(S.co[i]<9){S.co[i]++;ctx.act('cambia',{});draw()}});
  const l=cnt('L'),r=cnt('R'),ks=Array.from(new Set(Object.keys(l).concat(Object.keys(r))));
  let h=`<table style="width:100%;border-collapse:collapse;font-size:13.5px"><tr style="background:#f1f5f9"><th style="padding:5px;text-align:left">Elemento</th><th>Reactivos</th><th>Productos</th><th></th></tr>${ks.map(k=>{const ok=(l[k]||0)===(r[k]||0);return`<tr style="border-top:1px solid #e2e8f0"><td style="padding:5px"><b>${k}</b></td><td style="text-align:center">${l[k]||0}</td><td style="text-align:center">${r[k]||0}</td><td style="text-align:center">${ok?'✅':'❌'}</td></tr>`}).join('')}`;
  if(cfg.masa){const ml=mass('L'),mr=mass('R');h+=`<tr style="border-top:2px solid #94a3b8;background:#fffbeb"><td style="padding:5px"><b>Masa total (u)</b></td><td style="text-align:center">${fm(ml,2)}</td><td style="text-align:center">${fm(mr,2)}</td><td style="text-align:center">${Math.abs(ml-mr)<0.005?'✅':'❌'}</td></tr>`}
  $(el,'#b_tb').innerHTML=h+'</table>'+(cfg.masa?'<div style="font-size:12px;color:#64748b;margin-top:4px">Masa calculada con masas atómicas relativas (u) redondeadas de la tabla periódica. Solo hay conservación si el número de átomos de cada elemento coincide.</div>':'');
  $(el,'#b_tl').innerHTML=tiles([['Ecuaciones balanceadas',Object.keys(S.done).length+' / '+EQ.length,'#16a34a'],['Átomos iguales',bal()?'Sí':'No',bal()?'#16a34a':'#dc2626']])};
 $(el,'#b_e').onchange=e=>{S.i=+e.target.value;init();$(el,'#b_fb').textContent='';draw()};
 $(el,'#b_rs').onclick=()=>{init();$(el,'#b_fb').textContent='';draw()};
 $(el,'#b_ver').onclick=()=>{const f=$(el,'#b_fb'),b=bal(),g=S.co.reduce((a,c)=>gcd(a,c),0);
  if(b&&g===1){f.style.color='#16a34a';f.textContent='✅ ¡Balanceada con los coeficientes más pequeños!';S.done[S.i]=1;ctx.act('balancea',{});if(cfg.masa)ctx.act('compara_masa',{});ctx.obs(eq().nombre+': '+S.co.join(','));if(Object.keys(S.done).length>=EQ.length)ctx.act('todo_ok',{})}
  else if(b){f.style.color='#b45309';f.textContent='Los átomos coinciden, pero se puede simplificar: divide todos los coeficientes entre '+g+'.'}
  else{f.style.color='#dc2626';f.textContent='❌ Aún no coinciden los átomos. Mira qué elemento tiene ❌ y cambia el coeficiente de la sustancia que lo contiene.';ctx.act('intento_mal',{})}
  draw()};
 draw();return{reset(){S.done={};init();draw()}}};

/* ========== DESPLAZA: reacciones de desplazamiento y serie de actividad ========== */
const MET={Mg:{q:2,n:'Magnesio',c:'#cbd5e1',rank:5,d:'gris plateado',sol:'#f8fafc'},Zn:{q:2,n:'Zinc',c:'#94a3b8',rank:4,d:'gris',sol:'#f8fafc'},Fe:{q:2,n:'Hierro',c:'#475569',rank:3,d:'gris oscuro',sol:'#dcfce7'},Cu:{q:2,n:'Cobre',c:'#c2410c',rank:2,d:'rojizo',sol:'#93c5fd'},Ag:{q:1,n:'Plata',c:'#e2e8f0',rank:1,d:'plateado brillante',sol:'#f8fafc'}};
const ar=m=>(m==='Ag'?'la plata':'el '+MET[m].n.toLowerCase()),AR=m=>ar(m)[0].toUpperCase()+ar(m).slice(1);
const salt=m=>{const q=MET[m].q;return q>1?m+'(NO3)'+q:m+'NO3'};
E.desplaza=(el,cfg,ctx)=>{const ML=cfg.metales||Object.keys(MET);const S={m:ML[0],s:ML[ML.length-1],log:[],seen:{}};
 el.innerHTML=grid(panel('🎛️ Montaje',lab('Metal sólido (lámina)')+sel('d_m',ML.map(m=>[m,MET[m].n+' ('+m+')']),S.m)+lab('Solución de nitrato del metal…')+sel('d_s',ML.map(m=>[m,MET[m].n+' — '+dsub(salt(m))]),S.s)+`<div style="display:flex;gap:6px;margin-top:10px">${btn('d_go','🧪 Sumergir','#0d9488')}</div>`+rhold('d')),
  panel('🔬 Vaso','<svg id="d_sv" viewBox="0 0 300 200" style="width:100%;height:auto;max-height:230px"></svg><div id="d_ob" style="font-size:13px;margin-top:4px"></div>')+panel('📋 Registro y serie de actividad','<div id="d_lg" style="overflow:auto"></div>')+'<div id="d_tl"></div>');
 const U=mkRetoUI(el,cfg.retos||[],ctx,'d');
 const vaso=(col,dep,metal)=>{$(el,'#d_sv').innerHTML=`<path d="M70 30 L80 170 Q150 190 220 170 L230 30" fill="none" stroke="#64748b" stroke-width="4"/><path d="M76 70 L82 168 Q150 186 218 168 L224 70 Z" fill="${col}" opacity=".85"/><rect x="140" y="20" width="20" height="130" rx="3" fill="${metal}" stroke="#334155"/>${dep?`<g fill="${dep}">${[40,60,80,100,120].map((y,i)=>`<circle cx="${139+(i%2)*22}" cy="${y+30}" r="4"/>`).join('')}</g>`:''}`};
 const upd=()=>{S.m=$(el,'#d_m').value;S.s=$(el,'#d_s').value;vaso(MET[S.s].sol,null,MET[S.m].c)};
 const lg=()=>{$(el,'#d_lg').innerHTML=(S.log.length?`<table style="width:100%;border-collapse:collapse;font-size:12.5px"><tr style="background:#f1f5f9"><th style="padding:5px;text-align:left">Metal + solución</th><th>¿Reacciona?</th><th style="text-align:left">Ecuación</th></tr>${S.log.map(r=>`<tr style="border-top:1px solid #e2e8f0"><td style="padding:5px">${r.m} + ${dsub(salt(r.s))}</td><td style="text-align:center">${r.ok?'✅ Sí':'🚫 No'}</td><td>${dsub(esc(r.eq))}</td></tr>`).join('')}</table>`:'<div style="color:#64748b;font-size:13px">Aún no has hecho pruebas.</div>')+
   `<div style="margin-top:8px;font-size:12.5px"><b>Serie de actividad (de más a menos reactivo):</b> ${ML.slice().sort((a,b)=>MET[b].rank-MET[a].rank).map(m=>`<span style="padding:2px 7px;border-radius:8px;background:#eef2ff;font-weight:800">${m}</span>`).join(' › ')}<div style="color:#64748b">Un metal desplaza a otro de su sal solo si es más reactivo.</div></div>`;
  $(el,'#d_tl').innerHTML=tiles([['Pruebas',S.log.length,'#2563eb'],['Con reacción',S.log.filter(r=>r.ok).length,'#16a34a']])};
 $(el,'#d_m').onchange=upd;$(el,'#d_s').onchange=upd;
 $(el,'#d_go').onclick=()=>{const m=S.m,n=S.s,M=MET[m],N=MET[n];let ok=false,eq,ob;
  if(m===n){eq='sin cambio';ob='Es el mismo metal que está en la solución: no hay cambio neto.'}
  else if(M.rank>N.rank){ok=true;const g=gcd(M.q,N.q),a=N.q/g,b=M.q/g,c=x=>x>1?x+' ':'';eq=`${c(a)}${m} + ${c(b)}${salt(n)} → ${c(a)}${salt(m)} + ${c(b)}${n}`;
   ob=`${AR(m)} es más reactivo que ${ar(n)}: se disuelve (se oxida) y ${ar(n)} se deposita como sólido (${N.d}).`}
  else{eq='sin reacción';ob=`${AR(m)} es menos reactivo que ${ar(n)}: no puede desplazarlo de su sal. No se observa cambio.`}
  vaso(ok?MET[m].sol:N.sol,ok?N.c:null,M.c);$(el,'#d_ob').innerHTML='<b>Observación:</b> '+esc(ob)+(ok?'<br><b>Ecuación:</b> '+dsub(esc(eq)):'');
  S.log.push({m,s:n,ok,eq});S.seen[m+n]=1;ctx.act('prueba',{});if(ok)ctx.act('reacciona',{});else ctx.act('noreacciona',{});ctx.obs(m+' + '+salt(n)+': '+(ok?'reacciona':'no reacciona'));
  if(Object.keys(S.seen).length>=cfg.meta&&!(cfg.retos||[]).length)ctx.act('todo_ok',{});lg()};
 upd();lg();U.draw();return{reset(){S.log=[];S.seen={};lg();U.reset()}}};



/* ========== CINETICA: factores que cambian la velocidad de reacción (modelo empírico) ========== */
E.cinetica=(el,cfg,ctx)=>{const RXS=cfg.rxs;const COL=['#2563eb','#dc2626','#16a34a','#f59e0b','#7c3aed','#0d9488'];
 const S={r:0,runs:[],conc:RXS[0].conc.def,T:25,sa:'1',cat:0};
 const R=()=>RXS[S.r];
 const kOf=c=>{const r=RXS[c.r];return r.k0*(c.conc/r.conc.def)*(r.sa?+c.sa:1)*Math.pow(2,(c.T-25)/10)*(r.cat&&c.cat?r.catf:1)};
 el.innerHTML=grid(panel('🎛️ Condiciones',lab('Reacción')+sel('v_r',RXS.map((r,i)=>[i,r.n]),0)+'<div id="v_ct"></div>'+`<div style="display:flex;gap:6px;margin-top:10px">${btn('v_go','▶️ Hacer la corrida','#0d9488')}${btn('v_cl','Borrar corridas','#64748b')}</div><div id="v_info" style="font-size:12px;color:#64748b;margin-top:6px"></div>`+rhold('v')),
  panel('📈 Volumen de gas producido en el tiempo','<canvas id="v_plot" style="width:100%;display:block"></canvas>')+'<div id="v_tb" style="overflow:auto"></div><div id="v_tl"></div>');
 const U=mkRetoUI(el,cfg.retos||[],ctx,'v');
 const ctl=()=>{const r=R();
  $(el,'#v_ct').innerHTML=rng('v_c',r.conc.label,r.conc.min,r.conc.max,S.conc,r.conc.st)+rng('v_t','Temperatura (°C)',10,60,S.T,5)
   +(r.sa?lab('Tamaño de las partículas del sólido')+sel('v_s',[['0.35','Trozo grande'],['1','Granulado'],['4','Polvo fino']],S.sa):'')
   +(r.cat?`<label style="display:flex;align-items:center;gap:6px;margin-top:8px;font-weight:800;font-size:13px"><input id="v_k" type="checkbox" ${S.cat?'checked':''}> Añadir catalizador (${esc(r.cat)})</label>`:'');
  $(el,'#v_info').innerHTML=dsub(esc(r.eq))+'<br>'+esc(r.nota);
  $(el,'#v_c').oninput=e=>{S.conc=+e.target.value;$(el,'#v_cv').textContent=fm(S.conc,R().conc.st<1?1:0)};
  $(el,'#v_t').oninput=e=>{S.T=+e.target.value;$(el,'#v_tv').textContent=S.T};
  const s=$(el,'#v_s');if(s)s.onchange=e=>{S.sa=e.target.value};
  const k=$(el,'#v_k');if(k)k.onchange=e=>{S.cat=e.target.checked?1:0}};
 const draw=()=>{const r=R(),runs=S.runs.filter(x=>x.r===S.r);
  const tm=Math.min(1200,Math.max(60,...runs.map(x=>4.6/x.k)));
  SIM.plot($(el,'#v_plot'),{h:280,xmin:0,xmax:tm,ymin:0,ymax:r.vmax*1.08,xl:'Tiempo (s)',yl:'Volumen de gas (mL)',series:runs.map(x=>({f:t=>r.vmax*(1-Math.exp(-x.k*t)),x0:0,x1:tm,color:COL[x.id%COL.length],name:'Corrida '+(x.id+1)})),hlines:[{y:r.vmax,color:'#94a3b8',label:'Máximo posible'}]});
  $(el,'#v_tb').innerHTML=runs.length?`<table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:6px"><tr style="background:#f1f5f9"><th style="padding:5px">#</th><th style="text-align:left">Condiciones</th><th>Velocidad inicial (mL/s)</th><th>Tiempo a la mitad (s)</th></tr>${runs.map(x=>`<tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;text-align:center;color:${COL[x.id%COL.length]};font-weight:900">${x.id+1}</td><td>${esc(x.txt)}</td><td style="text-align:center">${fm(r.vmax*x.k,2)}</td><td style="text-align:center">${fm(Math.LN2/x.k,1)}</td></tr>`).join('')}</table><div style="font-size:12px;color:#64748b;margin-top:4px">Fíjate: el volumen máximo es el mismo; lo que cambia es qué tan rápido se alcanza.</div>`:'<div style="color:#64748b;font-size:13px;margin-top:6px">Haz una corrida para ver la curva.</div>';
  $(el,'#v_tl').innerHTML=tiles([['Corridas',S.runs.length,'#2563eb']])};
 const txtOf=c=>{const r=RXS[c.r];return r.conc.label.split('(')[0].trim()+' '+fm(c.conc,r.conc.st<1?1:0)+' · '+c.T+' °C'+(r.sa?' · '+({'0.35':'trozo','1':'granulado','4':'polvo'}[c.sa]):'')+(r.cat&&c.cat?' · con catalizador':'')};
 $(el,'#v_r').onchange=e=>{S.r=+e.target.value;S.conc=R().conc.def;S.T=25;S.sa='1';S.cat=0;ctl();draw()};
 $(el,'#v_cl').onclick=()=>{S.runs=[];draw()};
 $(el,'#v_go').onclick=()=>{const c={r:S.r,conc:S.conc,T:S.T,sa:S.sa,cat:S.cat};c.k=kOf(c);c.txt=txtOf(c);c.id=S.runs.length;
  const prev=S.runs.filter(x=>x.r===S.r).slice(-1)[0];S.runs.push(c);ctx.act('corre',{});
  if(prev){const d=['conc','T','sa','cat'].filter(k=>String(prev[k])!==String(c[k]));if(d.length===1)ctx.act('un_cambio',{});if(d.length===1)ctx.act('var_'+d[0],{});if(d.length>=1&&c.k>prev.k)ctx.act('mas_rapida',{})}
  ctx.obs('Corrida '+(c.id+1)+': '+c.txt+' → velocidad inicial '+fm(R().vmax*c.k,2)+' mL/s');draw()};
 ctl();draw();U.draw();return{reset(){S.runs=[];draw();U.reset()}}};


/* ========== helpers etapa 4 ========== */
const NA_=6.022e23;
const SUPD='⁰¹²³⁴⁵⁶⁷⁸⁹';
const sciU=x=>{if(!isFinite(x)||x===0)return'0';const e=Math.floor(Math.log10(Math.abs(x))+1e-12),m=x/Math.pow(10,e);return fm(m,2)+' × 10'+String(Math.abs(e)).split('').map(c=>SUPD[+c]).join('').replace(/^/,e<0?'⁻':'')};
const numReto=(q,c,w,u,d,why,seed)=>{const f=x=>u==='sci'?sciU(x):fm(x,d)+' '+u;const o=[c],fs=[f(c)];
 w.forEach(x=>{if(isFinite(x)&&!fs.includes(f(x))){o.push(x);fs.push(f(x))}});
 let k=2;while(o.length<4&&k<40){const x=c!==0?c*k:k;if(!fs.includes(f(x))){o.push(x);fs.push(f(x))}k+=1}
 const lst=shuf(o.slice(0,4),seed);return{q:dsub(q),o:lst.map(f),ok:lst.indexOf(c),why}};
const NAMEF={H2O:'Agua',NaCl:'Cloruro de sodio',CO2:'Dióxido de carbono',C6H12O6:'Glucosa',CaCO3:'Carbonato de calcio',NH3:'Amoníaco',O2:'Oxígeno',Fe:'Hierro',Al:'Aluminio',Cu:'Cobre',H2SO4:'Ácido sulfúrico',NaOH:'Hidróxido de sodio',CuSO4:'Sulfato de cobre',KMnO4:'Permanganato de potasio',CH4:'Metano',N2:'Nitrógeno',H2:'Hidrógeno',Mg:'Magnesio',MgO:'Óxido de magnesio',Zn:'Zinc',HCl:'Ácido clorhídrico',ZnCl2:'Cloruro de zinc',Na:'Sodio',Cl2:'Cloro'};
const mixc=(a,b,t)=>{const h=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=h(a),B=h(b),t_=Math.max(0,Math.min(1,t));return'#'+A.map((x,i)=>Math.round(x+(B[i]-x)*t_).toString(16).padStart(2,'0')).join('')};
const genR=(list,mk)=>list.map((r,i)=>r.t?mk(r,i):r);

/* ========== MOL: mol, masa molar y conversiones ========== */
E.mol=(el,cfg,ctx)=>{const SU_=cfg.sust,M_=f=>mmF(f);const S={f:SU_[0],u:cfg.unidad||'g',v:cfg.unidad==='mol'?1:36,calc:0};
 const RT=genR(cfg.retos||[],(r,i)=>{const M=M_(r.f),nm=NAMEF[r.f]||r.f;
  if(r.t==='M')return numReto(`¿Cuál es la masa molar de <b>${r.f}</b> (${nm})?`,M,[M*2,M/2,M+1.008*2,M-16],'g/mol',1,`Suma las masas atómicas de todos los átomos: ${r.f} = ${fm(M,2)} g/mol.`,i+1);
  if(r.t==='g2mol'){const n=r.v/M;return numReto(`¿Cuántos mol hay en <b>${r.v} g</b> de ${r.f}?`,n,[r.v*M,M/r.v,r.v/M/2],'mol',2,`n = m / M = ${r.v} g / ${fm(M,2)} g/mol = ${fm(n,2)} mol.`,i+2)}
  if(r.t==='mol2g'){const m=r.v*M;return numReto(`¿Cuántos gramos son <b>${r.v} mol</b> de ${r.f}?`,m,[r.v/M,M/r.v,m/2],'g',1,`m = n × M = ${r.v} mol × ${fm(M,2)} g/mol = ${fm(m,1)} g.`,i+3)}
  if(r.t==='mol2p'){const N=r.v*NA_;return numReto(`¿Cuántas partículas hay en <b>${r.v} mol</b> de ${r.f}?`,N,[N/6.022e23*1e22,N*10,N/10],'sci',2,`N = n × 6,022 × 10²³ = ${sciU(N)}.`,i+4)}
  if(r.t==='g2p'){const N=r.v/M*NA_;return numReto(`¿Cuántas moléculas o unidades hay en <b>${r.v} g</b> de ${r.f}?`,N,[N/NA_,r.v*NA_,N*M],'sci',2,`Primero n = ${r.v}/${fm(M,2)} = ${fm(r.v/M,3)} mol; luego N = n × 6,022 × 10²³ = ${sciU(N)}.`,i+5)}
  return r});
 const rg=()=>S.u==='g'?[1,300,1]:S.u==='mol'?[0.1,5,0.1]:[1,30,0.5];
 const sl=()=>{const r=rg();S.v=Math.min(r[1],Math.max(r[0],S.v));$(el,'#o_vw').innerHTML=rng('o_v',S.u==='g'?'Masa (g)':S.u==='mol'?'Cantidad (mol)':'Partículas (× 10²³)',r[0],r[1],S.v,r[2]);$(el,'#o_v').oninput=e=>{S.v=+e.target.value;$(el,'#o_vv').textContent=S.v;ctx.act('cambia',{});out()}};
 el.innerHTML=grid(panel('🎛️ Muestra',lab('Sustancia')+sel('o_s',SU_.map(f=>[f,(NAMEF[f]||f)+' — '+f]),S.f)+lab('Cantidad conocida')+sel('o_u',[['g','Masa en gramos'],['mol','Cantidad en mol'],['p','Número de partículas']],S.u)+'<div id="o_vw"></div>'+`<div style="margin-top:10px">${btn('o_c','🧮 Mostrar el cálculo','#0d9488')}</div>`+(RT.length?rhold('o'):'<div id="o_rt"></div><div id="o_fb"></div>')),
  panel('📋 Resultados','<div id="o_out"></div>')+'<div id="o_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'o');
 const get=()=>{const M=M_(S.f);let n;if(S.u==='g')n=S.v/M;else if(S.u==='mol')n=S.v;else n=S.v*1e23/NA_;return{M,n,m:n*M,N:n*NA_}};
 const out=()=>{const g=get(),at=parseF(S.f);const comp=Object.keys(at).map(e=>`${at[e]} × ${fm(EL(e).m,3)}`).join(' + ');
  $(el,'#o_out').innerHTML=`<table style="width:100%;border-collapse:collapse;font-size:14px"><tr><td style="padding:5px;font-weight:700">Fórmula</td><td><b>${dsub(S.f)}</b></td></tr><tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;font-weight:700">Masa molar</td><td>${comp} = <b>${fm(g.M,2)} g/mol</b></td></tr><tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;font-weight:700">Masa</td><td><b>${fm(g.m,2)} g</b></td></tr><tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;font-weight:700">Cantidad</td><td><b>${fm(g.n,3)} mol</b></td></tr><tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;font-weight:700">Partículas</td><td><b>${sciU(g.N)}</b></td></tr></table><div id="o_cc" style="margin-top:8px;font-size:13px;background:#f8fafc;border-radius:10px;padding:8px;display:${S.calc?'block':'none'}">${S.calc?cc(g):''}</div><div style="font-size:12px;color:#64748b;margin-top:6px">Un mol contiene 6,022 × 10²³ partículas (número de Avogadro); su masa en gramos es la masa molar.</div>`;
  $(el,'#o_tl').innerHTML=tiles([['Masa molar',fm(g.M,2)+' g/mol','#2563eb'],['Moles',fm(g.n,3),'#16a34a']])};
 const cc=g=>S.u==='g'?`n = m / M = ${fm(S.v,1)} g / ${fm(g.M,2)} g/mol = <b>${fm(g.n,3)} mol</b><br>N = n × N<sub>A</sub> = ${fm(g.n,3)} × 6,022 × 10²³ = <b>${sciU(g.N)}</b>`:S.u==='mol'?`m = n × M = ${fm(S.v,2)} mol × ${fm(g.M,2)} g/mol = <b>${fm(g.m,2)} g</b><br>N = n × N<sub>A</sub> = <b>${sciU(g.N)}</b>`:`n = N / N<sub>A</sub> = ${sciU(g.N)} / 6,022 × 10²³ = <b>${fm(g.n,3)} mol</b><br>m = n × M = <b>${fm(g.m,2)} g</b>`;
 $(el,'#o_s').onchange=e=>{S.f=e.target.value;ctx.act('cambia',{});out()};
 $(el,'#o_u').onchange=e=>{S.u=e.target.value;S.v=S.u==='g'?36:S.u==='mol'?1:6;sl();ctx.act('cambia',{});out()};
 $(el,'#o_c').onclick=()=>{S.calc=1;ctx.act('calcula',{});const g=get();ctx.obs(`${S.f}: M = ${fm(g.M,2)} g/mol; ${fm(g.n,3)} mol; ${fm(g.m,2)} g; ${sciU(g.N)} partículas`);out()};
 sl();out();U.draw();return{reset(){S.calc=0;out();U.reset()}}};

/* ========== ESTEQUIO: estequiometría, reactivo limitante y rendimiento ========== */
const RXN=[{n:'Formación de agua',L:[[2,'H2'],[1,'O2']],R:[[2,'H2O']]},{n:'Síntesis del amoníaco',L:[[1,'N2'],[3,'H2']],R:[[2,'NH3']]},{n:'Combustión del metano',L:[[1,'CH4'],[2,'O2']],R:[[1,'CO2'],[2,'H2O']]},{n:'Combustión del magnesio',L:[[2,'Mg'],[1,'O2']],R:[[2,'MgO']]},{n:'Zinc con ácido clorhídrico',L:[[1,'Zn'],[2,'HCl']],R:[[1,'ZnCl2'],[1,'H2']]},{n:'Sodio con cloro',L:[[2,'Na'],[1,'Cl2']],R:[[2,'NaCl']]}];
const eqS=r=>dsub(r.L.map(x=>(x[0]>1?x[0]+' ':'')+x[1]).join(' + ')+' → '+r.R.map(x=>(x[0]>1?x[0]+' ':'')+x[1]).join(' + '));
const rxCalc=(r,mA,mB)=>{const a=r.L[0],b=r.L[1],nA=mA/mmF(a[1]),nB=mB==null?Infinity:mB/mmF(b[1]),xA=nA/a[0],xB=nB/b[0],x=Math.min(xA,xB),lim=xA<=xB?0:1;
 const prods=r.R.map(p=>({f:p[1],n:x*p[0],m:x*p[0]*mmF(p[1])}));const ex=lim===0?(xB===Infinity?null:{f:b[1],m:(xB-x)*b[0]*mmF(b[1])}):{f:a[1],m:(xA-x)*a[0]*mmF(a[1])};return{nA,nB,xA,xB,x,lim,prods,ex}};
E.estequio=(el,cfg,ctx)=>{const modo=cfg.modo;const S={i:0,a:20,b:20,real:0,calc:0};
 const RT=genR(cfg.retos||[],(r,i)=>{const rx=RXN[r.rx],A=rx.L[0][1],B=rx.L[1]?rx.L[1][1]:'',c=rxCalc(rx,r.a,r.t==='prod'?null:r.b),P=rx.R[0][1];
  if(r.t==='prod'){const p=c.prods[0],nA=c.nA;return numReto(`En <b>${rx.n}</b> (${eqS(rx)}) reaccionan ${r.a} g de ${A} con exceso del otro reactivo. ¿Cuántos gramos de <b>${P}</b> se forman?`,p.m,[nA*mmF(P),r.a,p.m*2,p.m/2],'g',1,`${fm(nA,3)} mol de ${A} → ${fm(p.n,3)} mol de ${P} → ${fm(p.m,1)} g (usa los coeficientes de la ecuación).`,i+1)}
  if(r.t==='lim'){const L=c.lim;const o=[dsub(A),dsub(B)];return{q:`<b>${rx.n}</b> (${eqS(rx)}): se mezclan ${r.a} g de ${dsub(A)} con ${r.b} g de ${dsub(B)}. ¿Cuál es el reactivo limitante?`,o,ok:L,why:`Compara moles ÷ coeficiente: ${dsub(A)} = ${fm(c.xA,3)}, ${dsub(B)} = ${fm(c.xB,3)}. El menor se acaba primero.`}}
  if(r.t==='rend'){const th=c.prods[0].m,pc=r.real/th*100;return numReto(`En <b>${rx.n}</b> se mezclan ${r.a} g de ${A} con ${r.b} g de ${B}. El rendimiento teórico de ${P} es ${fm(th,1)} g y en el laboratorio se obtienen ${r.real} g. ¿Cuál es el rendimiento porcentual?`,pc,[th/r.real*100,r.real,100-pc],'%',1,`% = real / teórico × 100 = ${r.real} / ${fm(th,1)} × 100 = ${fm(pc,1)} %.`,i+3)}
  return r});
 const two=modo!=='est';
 el.innerHTML=grid(panel('🎛️ Reacción',lab('Reacción')+sel('s_r',RXN.map((r,i)=>[i,r.n]),0)+`<div id="s_eq" style="font-weight:800;margin-top:6px"></div><div id="s_sl"></div>`+`<div style="margin-top:10px">${btn('s_c','🧮 Calcular','#0d9488')}</div>`+(RT.length?rhold('s'):'<div id="s_rt"></div><div id="s_fb"></div>')),
  panel('📋 Cálculo paso a paso','<div id="s_out"></div>')+panel('📊 Moles ÷ coeficiente (el menor es el limitante)','<div id="s_bar"></div>')+'<div id="s_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'s');
 const rx=()=>RXN[S.i];
 const sliders=()=>{const r=rx();$(el,'#s_eq').innerHTML=eqS(r);$(el,'#s_sl').innerHTML=rng('s_a','Masa de '+dsub(r.L[0][1])+' (g)',1,100,S.a,1)+(two?rng('s_b','Masa de '+dsub(r.L[1][1])+' (g)',1,100,S.b,1):'<div style="font-size:12px;color:#64748b;margin-top:6px">El otro reactivo está en exceso.</div>')+(modo==='rend'?rng('s_x','Masa obtenida en el laboratorio (g)',0,150,S.real,0.5):'');
  $(el,'#s_a').oninput=e=>{S.a=+e.target.value;$(el,'#s_av').textContent=S.a;ctx.act('cambia',{});out()};
  if(two)$(el,'#s_b').oninput=e=>{S.b=+e.target.value;$(el,'#s_bv').textContent=S.b;ctx.act('cambia',{});out()};
  if(modo==='rend')$(el,'#s_x').oninput=e=>{S.real=+e.target.value;$(el,'#s_xv').textContent=S.real;out()}};
 const out=()=>{const r=rx(),c=rxCalc(r,S.a,two?S.b:null),A=r.L[0][1],B=r.L[1][1];
  if(!S.calc){$(el,'#s_out').innerHTML='<div style="color:#64748b;font-size:13px">Ajusta las masas y pulsa <b>Calcular</b> para ver el procedimiento.</div>';$(el,'#s_bar').innerHTML='';return}
  let h=`<div style="font-size:13.5px;line-height:1.7">1) Moles: ${dsub(A)}: ${fm(S.a,1)} g / ${fm(mmF(A),2)} g/mol = <b>${fm(c.nA,3)} mol</b>`+(two?` · ${dsub(B)}: ${fm(S.b,1)} g / ${fm(mmF(B),2)} g/mol = <b>${fm(c.nB,3)} mol</b>`:'')+'<br>';
  if(two)h+=`2) Moles ÷ coeficiente: ${dsub(A)} = ${fm(c.xA,3)} · ${dsub(B)} = ${fm(c.xB,3)} → <b>limitante: ${dsub(c.lim===0?A:B)}</b><br>`;else h+=`2) Se usa ${dsub(A)} como base de cálculo (el otro está en exceso).<br>`;
  h+=`3) Producto(s): ${c.prods.map(p=>`${dsub(p.f)}: ${fm(p.n,3)} mol = <b>${fm(p.m,2)} g</b>`).join(' · ')}<br>`;
  if(c.ex&&two)h+=`4) Sobra de ${dsub(c.ex.f)}: <b>${fm(c.ex.m,2)} g</b><br>`;
  if(modo==='rend'){const th=c.prods[0].m,pc=S.real/th*100;h+=`5) Rendimiento teórico de ${dsub(c.prods[0].f)}: ${fm(th,2)} g · obtenido: ${fm(S.real,1)} g → <b>${fm(pc,1)} %</b>${pc>100.001?' ⚠️ no puede ser mayor que 100 %: revisa la medición (producto húmedo o impuro).':''}`}
  $(el,'#s_out').innerHTML=h+'</div>';
  const mx=Math.max(c.xA,two?c.xB:c.xA);$(el,'#s_bar').innerHTML=[[A,c.xA,c.lim===0||!two]].concat(two?[[B,c.xB,c.lim===1]]:[]).map(x=>`<div style="margin:6px 0"><div style="font-size:12px;font-weight:700">${dsub(x[0])} ${x[2]?'⬅ limitante':''}</div><div style="background:#e2e8f0;border-radius:6px;height:16px"><div style="width:${Math.max(3,x[1]/mx*100)}%;height:16px;border-radius:6px;background:${x[2]?'#dc2626':'#2563eb'}"></div></div><div style="font-size:11px;color:#64748b">${fm(x[1],3)}</div></div>`).join('');
  $(el,'#s_tl').innerHTML=tiles([['Producto teórico',fm(c.prods[0].m,2)+' g','#16a34a']].concat(modo==='rend'&&c.prods[0].m>0?[['Rendimiento',fm(S.real/c.prods[0].m*100,1)+' %','#f59e0b']]:[]))};
 $(el,'#s_r').onchange=e=>{S.i=+e.target.value;S.calc=0;sliders();out();ctx.act('cambia',{})};
 $(el,'#s_c').onclick=()=>{S.calc=1;const r=rx(),c=rxCalc(r,S.a,two?S.b:null);ctx.act('calcula',{});if(two)ctx.act('limitante',{});if(modo==='rend'&&S.real>0)ctx.act('rend',{});ctx.obs(r.n+': '+fm(c.prods[0].m,2)+' g de '+c.prods[0].f+(two?'; limitante '+r.L[c.lim][1]:''));out()};
 sliders();out();U.draw();return{reset(){S.calc=0;out();U.reset()}}};

/* ========== SOLUCION: preparación, % , molaridad y diluciones ========== */
const SOLS={NaCl:'#bfdbfe',NaOH:'#bfdbfe',C6H12O6:'#e0f2fe',CuSO4:'#3b82f6',KMnO4:'#a21caf'};
E.solucion=(el,cfg,ctx)=>{const modo=cfg.modo,SL=cfg.solutos||['NaCl'];const S={f:SL[0],m:10,V:250,mw:90,C1:6,C2:1,V2:250,calc:0};
 const RT=genR(cfg.retos||[],(r,i)=>{const M=mmF(r.f||'NaCl');
  if(r.t==='M'){const c=r.m/M/(r.V/1000);return numReto(`Se disuelven ${r.m} g de ${r.f} en agua hasta completar ${r.V} mL de solución. ¿Cuál es la molaridad?`,c,[r.m/M,r.m/M*(r.V/1000),r.m/(r.V/1000)/M/2],'mol/L',2,`n = ${r.m}/${fm(M,2)} = ${fm(r.m/M,3)} mol; M = n / V(L) = ${fm(c,2)} mol/L.`,i+1)}
  if(r.t==='g'){const m=r.C*(r.V/1000)*M;return numReto(`¿Cuántos gramos de ${r.f} se necesitan para preparar ${r.V} mL de solución ${fm(r.C,2)} mol/L?`,m,[r.C*M,m*2,m/(r.V/1000)],'g',1,`n = M × V = ${fm(r.C,2)} × ${r.V/1000} L = ${fm(r.C*r.V/1000,3)} mol; m = n × M = ${fm(m,1)} g.`,i+2)}
  if(r.t==='V1'){const v=r.C2*r.V2/r.C1;return numReto(`Con una solución madre ${fm(r.C1,1)} mol/L se quieren preparar ${r.V2} mL de solución ${fm(r.C2,2)} mol/L. ¿Qué volumen de la madre se toma?`,v,[r.V2-v,r.C1*r.V2/r.C2,r.V2],'mL',1,`C₁V₁ = C₂V₂ → V₁ = ${fm(r.C2,2)} × ${r.V2} / ${fm(r.C1,1)} = ${fm(v,1)} mL.`,i+3)}
  if(r.t==='pct'){const p=r.m/(r.m+r.mw)*100;return numReto(`Se disuelven ${r.m} g de ${r.f} en ${r.mw} g de agua. ¿Cuál es el porcentaje en masa (% m/m)?`,p,[r.m/r.mw*100,100-p,r.m],'%',1,`% m/m = soluto / (soluto + disolvente) × 100 = ${r.m} / ${r.m+r.mw} × 100 = ${fm(p,1)} %.`,i+4)}
  return r});
 const ctl=()=>{let h=lab('Soluto')+sel('c_s',SL.map(f=>[f,(NAMEF[f]||f)+' — '+f]),S.f);
  if(modo==='prep')h+=rng('c_m','Masa de soluto (g)',0.5,100,S.m,0.5)+rng('c_V','Volumen final de la solución (mL)',100,1000,S.V,50);
  if(modo==='pct')h+=rng('c_m','Masa de soluto (g)',1,100,S.m,1)+rng('c_w','Masa de agua (g)',20,500,S.mw,10)+rng('c_V','Volumen de la solución (mL) para % m/v',50,500,S.V,10);
  if(modo==='molar')h+=rng('c_m','Masa de soluto (g)',0.5,100,S.m,0.5)+rng('c_V','Volumen de la solución (mL)',100,1000,S.V,50);
  if(modo==='dilu')h+=rng('c_1','Concentración de la solución madre (mol/L)',1,12,S.C1,0.5)+rng('c_2','Concentración final deseada (mol/L)',0.1,5,S.C2,0.1)+rng('c_3','Volumen final (mL)',50,1000,S.V2,50);
  $(el,'#c_ct').innerHTML=h;
  const hk=(id,k,lb)=>{const x=$(el,'#'+id);if(x)x.oninput=e=>{S[k]=+e.target.value;$(el,'#'+id+'v').textContent=S[k];ctx.act('cambia',{});out()}};hk('c_m','m');hk('c_V','V');hk('c_w','mw');hk('c_1','C1');hk('c_2','C2');hk('c_3','V2');
  $(el,'#c_s').onchange=e=>{S.f=e.target.value;ctx.act('cambia',{});out()}};
 el.innerHTML=grid(panel('🎛️ Preparación','<div id="c_ct"></div>'+`<div style="margin-top:10px">${btn('c_c','🧮 Mostrar el cálculo','#0d9488')}</div>`+(RT.length?rhold('c'):'<div id="c_rt"></div><div id="c_fb"></div>')),
  panel('🧪 Balón aforado','<svg id="c_sv" viewBox="0 0 220 220" style="width:100%;max-width:240px;display:block;margin:auto"></svg>')+panel('📋 Resultados','<div id="c_out"></div>')+'<div id="c_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'c');
 const flask=(frac,col,op)=>{$(el,'#c_sv').innerHTML=`<path d="M90 10 L90 70 Q30 110 30 160 Q30 205 110 205 Q190 205 190 160 Q190 110 130 70 L130 10" fill="#f8fafc" stroke="#475569" stroke-width="3"/><path d="M${40+(1-frac)*10} ${210-frac*115} L${180-(1-frac)*10} ${210-frac*115} L180 160 Q180 200 110 200 Q40 200 40 160 Z" fill="${col}" opacity="${op}"/><line x1="90" y1="40" x2="130" y2="40" stroke="#dc2626" stroke-width="2"/><text x="136" y="44" font-size="10" fill="#dc2626">aforo</text>`};
 const out=()=>{const M=mmF(S.f),col=SOLS[S.f]||'#93c5fd';let h='',op=0.5,tiles_;
  if(modo==='prep'||modo==='molar'){const n=S.m/M,C=n/(S.V/1000);op=Math.min(.9,.2+C/2*.7);flask(S.V/1000*0.8+.2,col,op);
   h=`<table style="width:100%;border-collapse:collapse;font-size:14px"><tr><td style="padding:5px;font-weight:700">Masa molar</td><td>${fm(M,2)} g/mol</td></tr><tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;font-weight:700">Moles de soluto</td><td>${fm(n,3)} mol</td></tr><tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;font-weight:700">Concentración</td><td><b>${fm(C,3)} mol/L</b> · ${fm(S.m/(S.V/1000),1)} g/L · ${fm(S.m/S.V*100,2)} % m/v</td></tr></table>`;
   if(S.calc)h+=`<div style="margin-top:8px;font-size:13px;background:#f8fafc;border-radius:10px;padding:8px">n = m / M = ${fm(S.m,1)} / ${fm(M,2)} = ${fm(n,3)} mol<br>M = n / V = ${fm(n,3)} mol / ${fm(S.V/1000,3)} L = <b>${fm(C,3)} mol/L</b></div>`;
   if(modo==='prep')h+='<div style="font-size:12.5px;margin-top:6px;color:#475569"><b>Cómo se prepara:</b> 1) pesa el soluto; 2) disuélvelo en un poco de agua; 3) pásalo al balón aforado; 4) completa con agua hasta la marca de aforo; 5) mezcla.</div>';
   tiles_=[['Molaridad',fm(C,3)+' mol/L','#2563eb'],['g/L',fm(S.m/(S.V/1000),1),'#16a34a']]}
  if(modo==='pct'){const t=S.m+S.mw,p=S.m/t*100,pv=S.m/S.V*100;op=Math.min(.9,.15+p/30);flask(.6,col,op);
   h=`<table style="width:100%;border-collapse:collapse;font-size:14px"><tr><td style="padding:5px;font-weight:700">% m/m</td><td><b>${fm(p,2)} %</b> = ${fm(S.m,1)} / (${fm(S.m,1)} + ${fm(S.mw,0)}) × 100</td></tr><tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;font-weight:700">% m/v</td><td><b>${fm(pv,2)} %</b> = ${fm(S.m,1)} g / ${S.V} mL × 100</td></tr><tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;font-weight:700">ppm (mg/kg)</td><td>${fm(S.m/t*1e6,0)}</td></tr></table><div style="font-size:12px;color:#64748b;margin-top:6px">% m/m compara masas; % m/v compara masa de soluto con volumen de solución.</div>`;
   tiles_=[['% m/m',fm(p,2)+' %','#2563eb'],['% m/v',fm(pv,2)+' %','#16a34a']]}
  if(modo==='dilu'){const v1=S.C2*S.V2/S.C1,ok=S.C2<=S.C1;op=Math.min(.9,.15+S.C2/5*.75);flask(S.V2/1000*0.8+.2,col,op);
   h=ok?`<div style="font-size:14px;line-height:1.7">C₁V₁ = C₂V₂<br>V₁ = C₂ × V₂ / C₁ = ${fm(S.C2,2)} × ${S.V2} / ${fm(S.C1,1)} = <b>${fm(v1,1)} mL</b> de solución madre<br>Agua que se agrega: ${S.V2} − ${fm(v1,1)} = <b>${fm(S.V2-v1,1)} mL</b> (aprox., volúmenes aditivos)</div><div style="font-size:12px;color:#475569;margin-top:6px">En diluciones de ácidos concentrados se agrega siempre el ácido al agua, nunca al revés.</div>`:'<div style="color:#b45309;font-weight:700">La solución final no puede ser más concentrada que la madre: eso sería concentrar, no diluir.</div>';
   tiles_=[['Volumen de madre',ok?fm(v1,1)+' mL':'—','#2563eb'],['Agua',ok?fm(S.V2-v1,1)+' mL':'—','#16a34a']]}
  $(el,'#c_out').innerHTML=h;$(el,'#c_tl').innerHTML=tiles(tiles_)};
 $(el,'#c_c').onclick=()=>{S.calc=1;ctx.act('calcula',{});ctx.obs('Cálculo mostrado ('+modo+') con '+S.f);out()};
 ctl();out();U.draw();return{reset(){S.calc=0;out();U.reset()}}};

/* ========== SOLUB: solubilidad y curvas de solubilidad ========== */
const SOLU={KNO3:{n:'KNO₃',c:'#dc2626',T:[0,20,40,60,80,100],s:[13.3,31.6,63.9,110,169,246]},NaCl:{n:'NaCl',c:'#2563eb',T:[0,20,40,60,80,100],s:[35.7,35.9,36.4,37.1,38.0,39.2]},KCl:{n:'KCl',c:'#16a34a',T:[0,20,40,60,80,100],s:[28.0,34.0,40.0,45.5,51.1,56.7]},NH4Cl:{n:'NH₄Cl',c:'#f59e0b',T:[0,20,40,60,80,100],s:[29.4,37.2,45.8,55.3,65.6,77.3]},NaNO3:{n:'NaNO₃',c:'#7c3aed',T:[0,20,40,60,80,100],s:[73,88,104,124,148,180]}};
const sInt=(k,t)=>{const d=SOLU[k];for(let i=0;i<d.T.length-1;i++)if(t<=d.T[i+1])return d.s[i]+(d.s[i+1]-d.s[i])*(t-d.T[i])/(d.T[i+1]-d.T[i]);return d.s[d.s.length-1]};
E.solub=(el,cfg,ctx)=>{const SL=cfg.sales,S={k:SL[0],T:20,m:20,T2:20};
 const RT=genR(cfg.retos||[],(r,i)=>{const s=sInt(r.sal,r.T);
  if(r.t==='s')return numReto(`Según la curva, ¿cuántos gramos de ${SOLU[r.sal].n} se disuelven como máximo en 100 g de agua a ${r.T} °C?`,s,[s*2,s/2,sInt(r.sal,r.T+20)],'g',1,`Se lee en la curva: ${fm(s,1)} g por 100 g de agua.`,i+1);
  if(r.t==='est'){const sat=r.m>s;return{q:`A ${r.T} °C se agregan ${r.m} g de ${SOLU[r.sal].n} a 100 g de agua. ¿Qué se observa?`,o:['Todo se disuelve (solución no saturada)','Queda sólido sin disolver (solución saturada)','Se evapora el agua','Se forma otro compuesto'],ok:sat?1:0,why:`La solubilidad a ${r.T} °C es ${fm(s,1)} g/100 g; ${r.m} g ${sat?'supera':'no supera'} ese valor.`}}
  if(r.t==='cool'){const x=Math.max(0,Math.min(r.m,sInt(r.sal,r.T))-sInt(r.sal,r.T2));return numReto(`Una solución saturada de ${SOLU[r.sal].n} con ${r.m} g disueltos en 100 g de agua a ${r.T} °C se enfría hasta ${r.T2} °C. ¿Cuántos gramos cristalizan?`,x,[x*2,sInt(r.sal,r.T2),r.m-x],'g',1,`Disuelto a ${r.T2} °C como máximo ${fm(sInt(r.sal,r.T2),1)} g; cristaliza la diferencia: ${fm(x,1)} g.`,i+3)}
  return r});
 el.innerHTML=grid(panel('🎛️ Controles',lab('Sal')+sel('u_k',SL.map(k=>[k,SOLU[k].n]),S.k)+rng('u_t','Temperatura (°C)',0,100,S.T,5)+rng('u_m','Sal agregada a 100 g de agua (g)',0,250,S.m,1)+(cfg.enfria?rng('u_2','Enfriar hasta (°C)',0,100,S.T2,5):'')+'<div id="u_st" style="margin-top:8px;font-size:14px;font-weight:800"></div>'+(RT.length?rhold('u'):'<div id="u_rt"></div><div id="u_fb"></div>')),
  panel('📈 Curvas de solubilidad (g de sal por 100 g de agua)','<canvas id="u_cv" style="width:100%;display:block"></canvas>')+'<div id="u_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'u');
 const draw=()=>{const s=sInt(S.k,S.T),dis=Math.min(S.m,s),exc=Math.max(0,S.m-s);
  SIM.plot($(el,'#u_cv'),{h:290,xmin:0,xmax:100,ymin:0,ymax:260,xl:'Temperatura (°C)',yl:'Solubilidad (g / 100 g de agua)',series:SL.map(k=>({pts:SOLU[k].T.map((t,i)=>[t,SOLU[k].s[i]]),color:SOLU[k].c,name:SOLU[k].n})),pts:[{x:S.T,y:S.m,r:7,fill:'#fff',color:'#0f172a',label:'tu mezcla'}],vlines:[{x:S.T,color:'#94a3b8',label:''}]});
  const st=exc>0.05?`⚠️ Saturada: se disuelven ${fm(s,1)} g y quedan ${fm(exc,1)} g sin disolver.`:Math.abs(S.m-s)<=0.05?'✅ Justo saturada.':`✅ No saturada: todo se disuelve (puedes disolver ${fm(s-S.m,1)} g más).`;
  let t2='';if(cfg.enfria){const s2=sInt(S.k,S.T2),cr=Math.max(0,dis-s2);t2=` · Al enfriar a ${S.T2} °C cristalizan ${fm(cr,1)} g.`}
  $(el,'#u_st').textContent=st+t2;$(el,'#u_tl').innerHTML=tiles([['Solubilidad a '+S.T+' °C',fm(s,1)+' g','#2563eb'],['Sin disolver',fm(exc,1)+' g','#dc2626']])};
 const hk=(id,k)=>{const x=$(el,'#'+id);if(x)x.oninput=e=>{S[k]=+e.target.value;$(el,'#'+id+'v').textContent=S[k];ctx.act('cambia',{});if(k==='m'||k==='T'){if(S.m>sInt(S.k,S.T))ctx.act('satura',{})}if(k==='T2')ctx.act('enfria',{});draw()}};hk('u_t','T');hk('u_m','m');hk('u_2','T2');
 $(el,'#u_k').onchange=e=>{S.k=e.target.value;ctx.act('sal',{});draw()};
 draw();U.draw();return{reset(){draw();U.reset()}}};

/* ========== PH: escala, indicadores y neutralización ========== */
const PHS=[['Ácido de batería',0.5],['Jugo gástrico',1.5],['Jugo de limón',2.3],['Vinagre',2.9],['Gaseosa',3.0],['Café',5.0],['Lluvia normal',5.6],['Leche',6.6],['Agua pura',7.0],['Sangre',7.4],['Bicarbonato',8.3],['Jabón de manos',10.0],['Amoníaco casero',11.5],['Blanqueador',12.5],['Destapacaños (NaOH)',13.5]];
const UNIV=['#dc2626','#ea580c','#f59e0b','#facc15','#84cc16','#22c55e','#16a34a','#0d9488','#3b82f6','#6366f1','#7c3aed','#7c3aed','#6d28d9','#581c87','#3b0764'];
const phCol=p=>{const i=Math.max(0,Math.min(13.999,p)),a=Math.floor(i);return mixc(UNIV[a],UNIV[a+1],i-a)};
const IND={fenolftaleina:{n:'Fenolftaleína',lo:8.2,hi:10,c1:'#f1f5f9',c2:'#db2777',t:'incolora (pH < 8,2) → rosa/fucsia (pH > 10)'},bromotimol:{n:'Azul de bromotimol',lo:6.0,hi:7.6,c1:'#facc15',c2:'#2563eb',t:'amarillo (pH < 6) → azul (pH > 7,6)'},rojometilo:{n:'Rojo de metilo',lo:4.4,hi:6.2,c1:'#dc2626',c2:'#facc15',t:'rojo (pH < 4,4) → amarillo (pH > 6,2)'},naranjametilo:{n:'Naranja de metilo',lo:3.1,hi:4.4,c1:'#dc2626',c2:'#f59e0b',t:'rojo (pH < 3,1) → naranja-amarillo (pH > 4,4)'}};
const indCol=(k,p)=>{const d=IND[k];return mixc(d.c1,d.c2,(p-d.lo)/(d.hi-d.lo))};
const titpH=(Ca,Va,Cb,Vb)=>{const n=Ca*Va-Cb*Vb,V=Va+Vb;if(Math.abs(n)<1e-9)return 7;return n>0?-Math.log10(n/V):14+Math.log10(-n/V)};
E.ph=(el,cfg,ctx)=>{const modo=cfg.modo;const S={i:8,p:7,ind:{},Ca:0.1,Va:25,Cb:0.1,Vb:0,k:'fenolftaleina',eq:0};
 const RT=genR(cfg.retos||[],(r,i)=>{if(r.t==='veq'){const v=r.Ca*r.Va/r.Cb;return numReto(`Se titulan ${r.Va} mL de HCl ${fm(r.Ca,2)} mol/L con NaOH ${fm(r.Cb,2)} mol/L. ¿Qué volumen de NaOH se necesita para neutralizar?`,v,[v*2,v/2,r.Va],'mL',1,`En el punto de equivalencia moles de ácido = moles de base: ${fm(r.Ca,2)} × ${r.Va} = ${fm(r.Cb,2)} × V → V = ${fm(v,1)} mL.`,i+1)}return r});
 const ctl={escala:()=>lab('Sustancia')+sel('h_s',PHS.map((x,i)=>[i,x[0]]),S.i)+'<div style="font-size:12px;color:#64748b;margin-top:6px">Valores típicos aproximados: el pH real varía con la marca y la preparación.</div>',
  indic:()=>rng('h_p','pH de la muestra',0,14,S.p,0.5)+lab('Indicador')+sel('h_k',Object.keys(IND).map(k=>[k,IND[k].n]),S.k)+`<div style="margin-top:8px">${btn('h_a','💧 Agregar gotas del indicador','#0d9488')}${btn('h_u','🌈 Indicador universal','#7c3aed')}</div>`,
  neutral:()=>rng('h_ca','Concentración del ácido HCl (mol/L)',0.05,0.2,S.Ca,0.05)+rng('h_va','Volumen de ácido (mL)',10,50,S.Va,5)+rng('h_cb','Concentración de la base NaOH (mol/L)',0.05,0.2,S.Cb,0.05)+lab('Indicador')+sel('h_k',Object.keys(IND).map(k=>[k,IND[k].n]),S.k)+`<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">${btn('h_1','+0,1 mL','#2563eb')}${btn('h_2','+1 mL','#2563eb')}${btn('h_3','+5 mL','#2563eb')}${btn('h_r','↺ Vaciar','#64748b')}</div>`}[modo]();
 el.innerHTML=grid(panel('🎛️ Controles',ctl+(RT.length?rhold('h'):'<div id="h_rt"></div><div id="h_fb"></div>')),panel(modo==='neutral'?'🧪 Matraz y curva de titulación':'🔬 Vista','<div id="h_vw"></div>')+'<div id="h_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'h');
 const beaker=(col,txt)=>`<svg viewBox="0 0 200 140" style="width:100%;max-width:230px;display:block;margin:auto"><path d="M50 15 L55 120 Q100 135 145 120 L150 15" fill="none" stroke="#475569" stroke-width="3"/><path d="M54 55 L57 118 Q100 131 143 118 L146 55 Z" fill="${col}" opacity=".9"/><text x="100" y="95" text-anchor="middle" font-size="12" font-weight="800" fill="#0f172a">${txt}</text></svg>`;
 const draw=()=>{
  if(modo==='escala'){const x=PHS[S.i],p=x[1],H=Math.pow(10,-p),OH=Math.pow(10,-(14-p));
   $(el,'#h_vw').innerHTML=beaker(phCol(p),'pH '+fm(p,1))+`<div style="position:relative;height:26px;border-radius:13px;margin:10px 4px;background:linear-gradient(90deg,${UNIV.join(',')})"><div style="position:absolute;left:${p/14*100}%;top:-6px;width:4px;height:38px;background:#0f172a;border-radius:2px"></div></div><div style="display:flex;justify-content:space-between;font-size:11px;color:#475569"><span>0 ácido</span><span>7 neutro</span><span>14 básico</span></div><table style="width:100%;font-size:14px;margin-top:8px"><tr><td><b>Carácter</b></td><td>${p<6.95?'Ácido':p>7.05?'Básico':'Neutro'}</td></tr><tr><td><b>[H⁺]</b></td><td>${sciU(H)} mol/L</td></tr><tr><td><b>[OH⁻]</b></td><td>${sciU(OH)} mol/L</td></tr></table>`;
   $(el,'#h_tl').innerHTML=tiles([['pH',fm(p,1),'#2563eb'],['pH + pOH','14','#64748b']])}
  if(modo==='indic'){const d=IND[S.k];
   $(el,'#h_vw').innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">${Object.keys(IND).map(k=>`<div style="text-align:center;font-size:11px;font-weight:700"><div style="width:54px;height:54px;border-radius:12px;border:2px solid #cbd5e1;background:${S.ind[k]?indCol(k,S.p):'#f8fafc'}"></div>${IND[k].n.split(' ')[0]}</div>`).join('')}${S.univ?`<div style="text-align:center;font-size:11px;font-weight:700"><div style="width:54px;height:54px;border-radius:12px;border:2px solid #cbd5e1;background:${phCol(S.p)}"></div>Universal</div>`:''}</div><div style="margin-top:8px;font-size:13px;background:#f8fafc;border-radius:10px;padding:8px"><b>${d.n}:</b> ${d.t}.</div><div style="font-size:12px;color:#64748b;margin-top:6px">pH de la muestra oculto en el análisis: agrega indicadores y deduce el rango.</div>`;
   $(el,'#h_tl').innerHTML=tiles([['pH de la muestra',fm(S.p,1),'#2563eb'],['Indicadores usados',Object.keys(S.ind).length,'#16a34a']])}
  if(modo==='neutral'){const pH=titpH(S.Ca,S.Va,S.Cb,S.Vb),veq=S.Ca*S.Va/S.Cb,col=indCol(S.k,pH);
   $(el,'#h_vw').innerHTML=beaker(col,'pH '+fm(pH,2))+'<canvas id="h_cv" style="width:100%;display:block"></canvas>';
   const vmax=veq*2;SIM.plot($(el,'#h_cv'),{h:240,xmin:0,xmax:vmax,ymin:0,ymax:14,xl:'Volumen de NaOH agregado (mL)',yl:'pH',series:[{f:v=>titpH(S.Ca,S.Va,S.Cb,v),x0:0,x1:vmax,color:'#2563eb',name:'Curva de titulación'}],pts:[{x:Math.min(S.Vb,vmax),y:pH,r:6,fill:'#f59e0b',color:'#b45309'}],vlines:[{x:veq,color:'#16a34a',label:'equivalencia '+fm(veq,1)+' mL'}]});
   $(el,'#h_tl').innerHTML=tiles([['NaOH agregado',fm(S.Vb,1)+' mL','#2563eb'],['pH',fm(pH,2),'#f59e0b'],['Equivalencia',fm(veq,1)+' mL','#16a34a']]);
   if(Math.abs(S.Vb-veq)<=0.25&&!S.eq){S.eq=1;ctx.act('equivalencia',{});ctx.obs('Llegaste al punto de equivalencia: '+fm(S.Vb,1)+' mL de NaOH; pH = '+fm(pH,2))}}};
 const hk=(id,k)=>{const x=$(el,'#'+id);if(x)x.oninput=e=>{S[k]=+e.target.value;$(el,'#'+id+'v').textContent=S[k];if(k!=='p'){S.Vb=0;S.eq=0}ctx.act('cambia',{});draw()}};hk('h_p','p');hk('h_ca','Ca');hk('h_va','Va');hk('h_cb','Cb');
 const sS=$(el,'#h_s');if(sS)sS.onchange=e=>{S.i=+e.target.value;ctx.act('elige',{});ctx.obs(PHS[S.i][0]+': pH '+PHS[S.i][1]);draw()};
 const sK=$(el,'#h_k');if(sK)sK.onchange=e=>{S.k=e.target.value;ctx.act('indicador',{});draw()};
 const ba=$(el,'#h_a');if(ba)ba.onclick=()=>{S.ind[S.k]=1;ctx.act('agrega',{});ctx.obs(IND[S.k].n+' en pH '+fm(S.p,1));draw()};
 const bu=$(el,'#h_u');if(bu)bu.onclick=()=>{S.univ=1;ctx.act('universal',{});draw()};
 [['h_1',0.1],['h_2',1],['h_3',5]].forEach(([id,v])=>{const b=$(el,'#'+id);if(b)b.onclick=()=>{S.Vb=Math.round((S.Vb+v)*10)/10;ctx.act('agrega',{});draw()}});
 const br=$(el,'#h_r');if(br)br.onclick=()=>{S.Vb=0;S.eq=0;draw()};
 draw();U.draw();return{reset(){S.Vb=0;S.eq=0;S.ind={};S.univ=0;draw();U.reset()}}};


/* ========== etapa 5a: configuración electrónica, números cuánticos, orbitales, propiedades periódicas, Lewis, geometría avanzada ========== */
const SUPN='⁰¹²³⁴⁵⁶⁷⁸⁹';const supn=n=>String(n).split('').map(c=>SUPN[+c]).join('');
const SUBS=[['1s',2,1,0],['2s',2,2,0],['2p',6,2,1],['3s',2,3,0],['3p',6,3,1],['4s',2,4,0],['3d',10,3,2],['4p',6,4,1]];
const cfgOf=z=>{const c={};let r=z;SUBS.forEach(s=>{const k=Math.min(s[1],r);c[s[0]]=k;r-=k});if(z===24){c['4s']=1;c['3d']=5}if(z===29){c['4s']=1;c['3d']=10}return c};
const ORD=['1s','2s','2p','3s','3p','3d','4s','4p'];
const cfgStr=c=>ORD.filter(k=>c[k]>0).map(k=>k+supn(c[k])).join(' ');
const NOBLE=[[36,'Kr'],[18,'Ar'],[10,'Ne'],[2,'He']];
const cfgShort=z=>{const n=NOBLE.find(x=>x[0]<z);if(!n)return cfgStr(cfgOf(z));const base=cfgOf(n[0]),c=cfgOf(z),d={};Object.keys(c).forEach(k=>{const v=c[k]-(base[k]||0);if(v>0)d[k]=v});return '['+n[1]+'] '+cfgStr(d)};
E.config=(el,cfg,ctx)=>{const ZL=cfg.zs||ELEM.map(e=>e.z);const S={z:ZL[0],c:{},k:0,ok:0,done:{}};SUBS.forEach(s=>S.c[s[0]]=0);
 const wrong=(c,i)=>{const d=Object.assign({},c),ks=ORD.filter(k=>c[k]>0),last=ks[ks.length-1],cap=Object.fromEntries(SUBS.map(s=>[s[0],s[1]]));
  if(i===0){d[last]-=1;const nx=ORD[ORD.indexOf(last)+1];if(nx)d[nx]=(d[nx]||0)+1;else d[last]+=1}
  if(i===1){const ps=ks.length>1?ks[ks.length-2]:last;d[ps]=Math.min(cap[ps]+1,d[ps]+1);d[last]=Math.max(0,d[last]-1)}
  if(i===2){const k2=ks.find(k=>k==='4s')?'4s':last;d[k2]=Math.max(0,d[k2]-1);d['3d']=(d['3d']||0)+1}return cfgStr(d)};
 const RT=(cfg.retos||[]).map((r,i)=>{if(!r.z)return r;const c=cfgOf(r.z),good=cfgStr(c),sym=EL=>0;const o=[good];for(let k=0;k<6&&o.length<4;k++){const w=wrong(c,k%3);if(!o.includes(w)&&w!==good)o.push(w);else{const d=Object.assign({},c),ks=ORD.filter(q=>c[q]>0),l=ks[ks.length-1];d[l]=d[l]+1+k;const w2=cfgStr(d);if(!o.includes(w2))o.push(w2)}}
  const lst=shuf(o.slice(0,4),i+11);return{q:`¿Cuál es la configuración electrónica del <b>${ELEM.find(e=>e.z===r.z).n}</b> (Z = ${r.z})?`,o:lst,ok:lst.indexOf(good),why:`${ELEM.find(e=>e.z===r.z).s}: ${good}${(r.z===24||r.z===29)?' (excepción: un electrón de 4s pasa a 3d porque 3d medio lleno o lleno es más estable)':''}.`}});
 el.innerHTML=grid(panel('🎛️ Construye la configuración',lab('Elemento')+sel('f_z',ZL.map(z=>[z,z+' — '+ELEM.find(e=>e.z===z).n+' ('+ELEM.find(e=>e.z===z).s+')']),S.z)+'<div id="f_sb" style="margin-top:8px"></div>'+`<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">${btn('f_v','✔️ Verificar','#0d9488')}${btn('f_a','💡 Ver la respuesta','#f59e0b')}${btn('f_r','↺ Vaciar','#64748b')}</div><div id="f_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>`+(RT.length?rhold('f2'):'<div id="f2_rt"></div><div id="f2_fb"></div>')),
  panel('📋 Resultado','<div id="f_out"></div>')+'<div id="f_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'f2');const tot=()=>Object.values(S.c).reduce((a,b)=>a+b,0);
 const boxes=c=>ORD.filter(k=>c[k]>0).map(k=>{const s=SUBS.find(x=>x[0]===k),nO=2*s[3]+1;let a=Array(nO).fill(0),e=c[k];for(let i=0;i<e&&i<nO;i++)a[i]=1;for(let i=0;i<e-nO;i++)a[i]=2;return`<span style="display:inline-block;margin:2px 8px 2px 0"><b style="font-size:12px">${k}</b> ${a.map(v=>`<span style="display:inline-block;width:22px;height:22px;border:2px solid #475569;border-radius:4px;text-align:center;font-size:13px;line-height:18px;margin-right:2px">${v===0?'':v===1?'↑':'↑↓'}</span>`).join('')}</span>`}).join('');
 const draw=()=>{const z=S.z;$(el,'#f_sb').innerHTML=SUBS.map(s=>`<div style="display:flex;align-items:center;gap:6px;margin-top:4px"><b style="width:34px">${s[0]}</b><button data-d="${s[0]}" class="sim-btn" style="background:#64748b">−</button><b style="min-width:22px;text-align:center;font-size:17px">${S.c[s[0]]}</b><button data-u="${s[0]}" class="sim-btn" style="background:#1e63e9">+</button><span style="font-size:11px;color:#64748b">máx. ${s[1]}</span></div>`).join('');
  el.querySelectorAll('#f_sb [data-d]').forEach(b=>b.onclick=()=>{const k=b.dataset.d;if(S.c[k]>0){S.c[k]--;ctx.act('agrega',{});draw()}});
  el.querySelectorAll('#f_sb [data-u]').forEach(b=>b.onclick=()=>{const k=b.dataset.u,s=SUBS.find(x=>x[0]===k);if(S.c[k]<s[1]){S.c[k]++;ctx.act('agrega',{});draw()}});
  const e=ELEM.find(x=>x.z===z);$(el,'#f_out').innerHTML=`<div style="font-size:14px">Electrones colocados: <b>${tot()}</b> de <b>${z}</b></div><div style="font-size:20px;font-weight:800;margin:6px 0;color:#1e63e9">${cfgStr(S.c)||'—'}</div><div style="font-size:12px;color:#64748b">Orden de llenado (Aufbau): 1s 2s 2p 3s 3p 4s 3d 4p. Regla de Hund: los electrones ocupan orbitales vacíos de un subnivel antes de aparearse.</div><div style="margin-top:6px">${boxes(S.c)}</div>`;
  $(el,'#f_tl').innerHTML=tiles([['Elemento',e.s+' (Z='+z+')','#2563eb'],['Configuraciones correctas',Object.keys(S.done).length,'#16a34a']])};
 const same=c=>SUBS.every(s=>(c[s[0]]||0)===(S.c[s[0]]||0));
 $(el,'#f_z').onchange=e=>{S.z=+e.target.value;SUBS.forEach(s=>S.c[s[0]]=0);$(el,'#f_fb').textContent='';draw()};
 $(el,'#f_r').onclick=()=>{SUBS.forEach(s=>S.c[s[0]]=0);draw()};
 $(el,'#f_a').onclick=()=>{const c=cfgOf(S.z),f=$(el,'#f_fb');f.style.color='#475569';f.textContent='Respuesta: '+cfgStr(c)+'   ·   Abreviada: '+cfgShort(S.z);ctx.act('ver',{})};
 $(el,'#f_v').onclick=()=>{const c=cfgOf(S.z),f=$(el,'#f_fb');if(same(c)){f.style.color='#16a34a';f.textContent='✅ Correcto. Abreviada: '+cfgShort(S.z)+'. Electrones de valencia: '+((S.z>18&&S.z<31)?'ver 4s y 3d':(cfgOf(S.z)['4s']||0)+(cfgOf(S.z)['4p']||0)||'—');S.done[S.z]=1;ctx.act('config_ok',{});ctx.obs('Configuración de '+ELEM.find(e=>e.z===S.z).s+': '+cfgStr(c))}else{f.style.color='#dc2626';f.textContent=tot()!==S.z?'❌ Tienes '+tot()+' electrones y el elemento tiene '+S.z+'.':'❌ Revisa el orden de llenado: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.'}draw()};
 draw();U.draw();return{reset(){S.done={};SUBS.forEach(s=>S.c[s[0]]=0);draw();U.reset()}}};

/* ========== CUANTICO: números cuánticos ========== */
E.cuantico=(el,cfg,ctx)=>{const S={n:1,l:0,ml:0,ms:1,seen:{}};const LN='spdf';const RT=cfg.retos||[];
 el.innerHTML=grid(panel('🎛️ Números cuánticos',rng('q_n','n (nivel principal)',1,4,1,1)+'<div id="q_lw"></div><div id="q_mw"></div>'+lab('ms (espín)')+sel('q_s',[[1,'+½ (↑)'],[-1,'−½ (↓)']],1)+(RT.length?rhold('q'):'<div id="q_rt"></div><div id="q_fb"></div>')),panel('📋 Qué describe este conjunto','<div id="q_out"></div>')+'<div id="q_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'q');
 const mk=()=>{S.l=Math.min(S.l,S.n-1);$(el,'#q_lw').innerHTML=rng('q_l','l (subnivel) — de 0 a n−1',0,S.n-1,S.l,1);S.ml=Math.max(-S.l,Math.min(S.l,S.ml));$(el,'#q_mw').innerHTML=rng('q_m','ml (orbital) — de −l a +l',-S.l,S.l,S.ml,1);
  $(el,'#q_l').oninput=e=>{S.l=+e.target.value;$(el,'#q_lv').textContent=S.l;mk();ctx.act('cambia',{});out()};$(el,'#q_m').oninput=e=>{S.ml=+e.target.value;$(el,'#q_mv').textContent=S.ml;ctx.act('cambia',{});out()}};
 const out=()=>{const nm=S.n+LN[S.l];if(!S.seen[nm]){S.seen[nm]=1;ctx.act('subnivel_nuevo',{})}
  $(el,'#q_out').innerHTML=`<div style="font-size:15px;line-height:1.8">Conjunto: <b>(n, l, ml, ms) = (${S.n}, ${S.l}, ${S.ml}, ${S.ms>0?'+½':'−½'})</b><br>Subnivel: <b style="font-size:20px;color:#1e63e9">${nm}</b> (l = ${S.l} → ${LN[S.l]})<br>Orbitales en el subnivel: <b>${2*S.l+1}</b> (ml = ${Array.from({length:2*S.l+1},(_,i)=>i-S.l).join(', ')})<br>Electrones máximos en el subnivel: <b>${2*(2*S.l+1)}</b><br>Electrones máximos en el nivel n = ${S.n}: <b>${2*S.n*S.n}</b> (2n²)<br>Subniveles del nivel: ${Array.from({length:S.n},(_,i)=>S.n+LN[i]).join(', ')}</div><div style="font-size:12px;color:#64748b;margin-top:6px">Principio de exclusión de Pauli: dos electrones no pueden tener los cuatro números cuánticos iguales; en un mismo orbital tienen espines opuestos.</div>`;
  $(el,'#q_tl').innerHTML=tiles([['Subniveles vistos',Object.keys(S.seen).length,'#2563eb'],['Máx. electrones (nivel)',2*S.n*S.n,'#16a34a']])};
 $(el,'#q_n').oninput=e=>{S.n=+e.target.value;$(el,'#q_nv').textContent=S.n;mk();ctx.act('cambia',{});out()};
 $(el,'#q_s').onchange=e=>{S.ms=+e.target.value;ctx.act('cambia',{});out()};
 mk();out();U.draw();return{reset(){S.seen={};out();U.reset()}}};

/* ========== ORBITAL: formas de orbitales ========== */
E.orbital=(el,cfg,ctx)=>{const OR=[['1s','s',1],['2s','s',2],['2px','px',2],['2py','py',2],['2pz','pz',2],['3dxy','dxy',3],['3dx²−y²','dx2',3],['3dz²','dz2',3]];const S={i:0,seen:{},a:0};const RT=cfg.retos||[];
 el.innerHTML=grid(panel('🎛️ Orbital',lab('Elige un orbital')+sel('o_o',OR.map((o,i)=>[i,o[0]]),0)+'<div id="o_in" style="margin-top:8px;font-size:13px"></div>'+(RT.length?rhold('o'):'<div id="o_rt"></div><div id="o_fb"></div>')),panel('🔬 Forma (corte esquemático, gira solo)','<canvas id="o_cv" width="420" height="320" style="width:100%;max-width:480px;display:block;margin:auto;border-radius:10px;background:#0f172a"></canvas>')+'<div id="o_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'o');
 const lobe=(x,cx,cy,ang,len,wd,col)=>{x.save();x.translate(cx,cy);x.rotate(ang);const g=x.createRadialGradient(len/2,0,2,len/2,0,len);g.addColorStop(0,col+'ee');g.addColorStop(1,col+'11');x.fillStyle=g;x.beginPath();x.ellipse(len/2,0,len/2,wd,0,0,7);x.fill();x.restore()};
 const draw=()=>{const x=$(el,'#o_cv').getContext('2d'),t=OR[S.i][1],n=OR[S.i][2],cx=210,cy=160;x.fillStyle='#0f172a';x.fillRect(0,0,420,320);const R1='#38bdf8',R2='#f472b6';
  x.strokeStyle='#334155';x.lineWidth=1;x.beginPath();x.moveTo(20,cy);x.lineTo(400,cy);x.moveTo(cx,20);x.lineTo(cx,300);x.stroke();
  if(t==='s'){const g=x.createRadialGradient(cx,cy,2,cx,cy,100);g.addColorStop(0,R1+'ff');g.addColorStop(1,R1+'11');x.fillStyle=g;x.beginPath();x.arc(cx,cy,100,0,7);x.fill();if(n===2){x.strokeStyle='#0f172a';x.lineWidth=5;x.beginPath();x.arc(cx,cy,48,0,7);x.stroke();x.fillStyle='#e2e8f0';x.font='12px sans-serif';x.fillText('nodo radial',cx+52,cy-40)}}
  if(t==='px'){lobe(x,cx,cy,0,110,38,R1);lobe(x,cx,cy,Math.PI,110,38,R2)}
  if(t==='py'){lobe(x,cx,cy,-Math.PI/2,110,38,R1);lobe(x,cx,cy,Math.PI/2,110,38,R2)}
  if(t==='pz'){x.fillStyle='#e2e8f0';x.font='12px sans-serif';x.fillText('El eje z sale de la pantalla: se ve el corte de los dos lóbulos',20,30);x.fillStyle=R1+'99';x.beginPath();x.arc(cx-30,cy,34,0,7);x.fill();x.fillStyle=R2+'99';x.beginPath();x.arc(cx+30,cy,34,0,7);x.fill()}
  if(t==='dxy'){[Math.PI/4,3*Math.PI/4,5*Math.PI/4,7*Math.PI/4].forEach((a,i)=>lobe(x,cx,cy,a,105,28,i%2?R2:R1))}
  if(t==='dx2'){[0,Math.PI/2,Math.PI,3*Math.PI/2].forEach((a,i)=>lobe(x,cx,cy,a,105,28,i%2?R2:R1))}
  if(t==='dz2'){lobe(x,cx,cy,-Math.PI/2,115,26,R1);lobe(x,cx,cy,Math.PI/2,115,26,R1);x.fillStyle=R2+'88';x.beginPath();x.ellipse(cx,cy,62,14,0,0,7);x.fill()}
  x.fillStyle='#e2e8f0';x.font='bold 13px sans-serif';x.fillText('Colores = signo de la función de onda (fase)',20,308);S.a+=0};
 const info=()=>{const o=OR[S.i],n=o[2],l=o[1][0]==='s'?0:o[1][0]==='p'?1:2;$(el,'#o_in').innerHTML=`Orbital <b>${o[0]}</b>: n = ${n}, l = ${l}<br>Nodos radiales: <b>${n-l-1}</b> · Nodos angulares: <b>${l}</b> · Nodos totales: <b>${n-1}</b><br>Orden de energía (llenado): 1s &lt; 2s &lt; 2p &lt; 3s &lt; 3p &lt; 4s &lt; 3d &lt; 4p`;
  $(el,'#o_tl').innerHTML=tiles([['Orbitales vistos',Object.keys(S.seen).length,'#2563eb'],['Nodos totales (n−1)',n-1,'#7c3aed']])};
 $(el,'#o_o').onchange=e=>{S.i=+e.target.value;S.seen[S.i]=1;ctx.act('ver',{});ctx.obs('Orbital '+OR[S.i][0]);info();draw()};
 S.seen[0]=1;info();draw();U.draw();return{reset(){S.seen={0:1};info();U.reset()}}};

/* ========== PROPIEDAD: tendencias periódicas ========== */
const IE1={1:1312,2:2372,3:520,4:900,5:801,6:1086,7:1402,8:1314,9:1681,10:2081,11:496,12:738,13:578,14:787,15:1012,16:1000,17:1251,18:1521,19:419,20:590,21:633,22:659,23:651,24:653,25:717,26:763,27:760,28:737,29:746,30:906,31:579,32:762,33:947,34:941,35:1140,36:1351};
E.propiedad=(el,cfg,ctx)=>{const RT=cfg.retos||[];const PR={r:{n:'Radio atómico (pm)',v:e=>e.r,c:'#2563eb'},ie:{n:'Energía de ionización (kJ/mol)',v:e=>IE1[e.z],c:'#dc2626'},en:{n:'Electronegatividad (Pauling)',v:e=>e.en,c:'#16a34a'}};
 const S={p:'r',a:'Na',b:'Cl'};const EZ=ELEM.filter(e=>e.z<=36);
 el.innerHTML=grid(panel('🎛️ Propiedad',lab('Propiedad')+sel('y_p',Object.keys(PR).map(k=>[k,PR[k].n]),S.p)+lab('Compara el elemento A')+sel('y_a',EZ.map(e=>[e.s,e.z+' '+e.n]),S.a)+lab('con el elemento B')+sel('y_b',EZ.map(e=>[e.s,e.z+' '+e.n]),S.b)+'<div id="y_cm" style="margin-top:8px;font-size:13.5px;font-weight:700"></div>'+(RT.length?rhold('y'):'<div id="y_rt"></div><div id="y_fb"></div>')),panel('📈 Propiedad según el número atómico (Z = 1 a 36)','<canvas id="y_cv" style="width:100%;display:block"></canvas>')+'<div id="y_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'y');
 const draw=()=>{const P=PR[S.p],pts=EZ.filter(e=>P.v(e)!=null).map(e=>({x:e.z,y:P.v(e),r:3.5,fill:P.c,color:P.c,label:(e.s===S.a||e.s===S.b)?e.s:''})),ys=pts.map(q=>q.y),mn=Math.min(...ys),mx=Math.max(...ys);
  SIM.plot($(el,'#y_cv'),{h:290,xmin:0,xmax:37,ymin:Math.floor(mn*0.9),ymax:Math.ceil(mx*1.08),xl:'Número atómico Z',yl:P.n,series:[{pts:pts.map(q=>[q.x,q.y]),color:P.c+'55'}],pts});
  const A=EL(S.a),B=EL(S.b),va=P.v(A),vb=P.v(B);$(el,'#y_cm').textContent=(va==null||vb==null)?'Sin dato para uno de los elementos (gas noble sin valor de referencia).':`${A.s}: ${fm(va,S.p==='en'?2:0)}  ·  ${B.s}: ${fm(vb,S.p==='en'?2:0)}  →  mayor: ${va>vb?A.s:vb>va?B.s:'igual'}`;
  $(el,'#y_tl').innerHTML=tiles([['Propiedad',P.n.split(' (')[0],P.c],['Z de A y B',A.z+' y '+B.z,'#64748b']])};
 $(el,'#y_p').onchange=e=>{S.p=e.target.value;ctx.act('cambia',{});draw()};
 $(el,'#y_a').onchange=e=>{S.a=e.target.value;ctx.act('compara',{});draw()};$(el,'#y_b').onchange=e=>{S.b=e.target.value;ctx.act('compara',{});draw()};
 draw();U.draw();return{reset(){draw();U.reset()}}};

/* ========== LEWIS: estructuras de Lewis paso a paso ========== */
const VE={H:1,C:4,N:5,O:6,F:7,Cl:7,B:3,S:6};
const LW={H2O:{n:'Agua',a:[['O',0,0],['H',-62,46],['H',62,46]],b:[[0,1,1],[0,2,1]],lp:{0:2,1:0,2:0},ang:{0:[90,135]}},
 CO2:{n:'Dióxido de carbono',a:[['O',-100,0],['C',0,0],['O',100,0]],b:[[0,1,2],[1,2,2]],lp:{0:2,1:0,2:2}},
 NH3:{n:'Amoníaco',a:[['N',0,0],['H',-65,50],['H',0,65],['H',65,50]],b:[[0,1,1],[0,2,1],[0,3,1]],lp:{0:1}},
 CH4:{n:'Metano',a:[['C',0,0],['H',-65,-50],['H',65,-50],['H',-65,50],['H',65,50]],b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],lp:{}},
 HCl:{n:'Cloruro de hidrógeno',a:[['H',-60,0],['Cl',40,0]],b:[[0,1,1]],lp:{1:3}},
 O2:{n:'Oxígeno',a:[['O',-45,0],['O',45,0]],b:[[0,1,2]],lp:{0:2,1:2}},
 N2:{n:'Nitrógeno',a:[['N',-45,0],['N',45,0]],b:[[0,1,3]],lp:{0:1,1:1}},
 BF3:{n:'Trifluoruro de boro',a:[['B',0,0],['F',0,-75],['F',-68,45],['F',68,45]],b:[[0,1,1],[0,2,1],[0,3,1]],lp:{1:3,2:3,3:3}},
 HCN:{n:'Cianuro de hidrógeno',a:[['H',-110,0],['C',0,0],['N',100,0]],b:[[0,1,1],[1,2,3]],lp:{2:1}}};
Object.keys(LW).forEach(k=>{const m=LW[k];m.f=k;m.ve=m.a.reduce((s,x)=>s+VE[x[0]],0);m.usados=m.b.reduce((s,x)=>s+2*x[2],0)+Object.values(m.lp).reduce((s,v)=>s+2*v,0)});
E.lewis=(el,cfg,ctx)=>{const L=cfg.mols.map(f=>LW[f]);const S={i:0,st:0,seen:{}};
 const RT=genR(cfg.retos||[],(r,i)=>{const m=LW[r.f];if(r.t==='ve')return numReto(`¿Cuántos electrones de valencia tiene en total la molécula <b>${r.f}</b>?`,m.ve,[m.ve+2,m.ve-2,m.ve/2,m.ve+4],'e⁻',0,`Suma los de cada átomo: ${m.a.map(x=>x[0]+' = '+VE[x[0]]).join(', ')} → ${m.ve}.`,i+1);
  if(r.t==='lp'){const c=m.lp[r.at]||0;return numReto(`En la estructura de Lewis de <b>${r.f}</b>, ¿cuántos pares libres tiene el átomo de <b>${m.a[r.at][0]}</b>?`,c,[c+1,c+2,Math.max(0,c-1)],'pares',0,`Ese átomo completa su octeto con ${c} par(es) libre(s).`,i+2)}
  if(r.t==='bo'){const bb=m.b.find(x=>x[2]>=r.o);return numReto(`¿Cuántos pares de electrones se comparten en el enlace entre ${m.a[r.i1][0]} y ${m.a[r.i2][0]} en <b>${r.f}</b>?`,r.o,[r.o+1,Math.max(1,r.o-1),r.o+2],'pares',0,`Enlace ${r.o===1?'sencillo':r.o===2?'doble':'triple'}: ${r.o} par(es) compartido(s).`,i+3)}return r});
 el.innerHTML=grid(panel('🎛️ Molécula',lab('Molécula')+sel('l_m',L.map((m,i)=>[i,m.f+' — '+m.n]),0)+`<div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">${btn('l_n','➡️ Siguiente paso','#0d9488')}${btn('l_r','↺ Empezar de nuevo','#64748b')}</div><div id="l_st" style="margin-top:8px;font-size:13.5px;line-height:1.6"></div>`+(RT.length?rhold('l'):'<div id="l_rt"></div><div id="l_fb"></div>')),panel('🔬 Estructura de Lewis','<canvas id="l_cv" width="420" height="260" style="width:100%;max-width:480px;display:block;margin:auto;border-radius:10px;background:#0f172a"></canvas>')+'<div id="l_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'l');
 const STEP=m=>[`<b>1) Cuenta los electrones de valencia:</b> ${m.a.map(x=>x[0]+' ('+VE[x[0]]+')').join(' + ')} = <b>${m.ve}</b> e⁻ = ${m.ve/2} pares.`,'<b>2) Arma el esqueleto:</b> el átomo central suele ser el menos electronegativo (nunca el H); los demás se unen a él.',`<b>3) Coloca los enlaces:</b> cada enlace sencillo usa 1 par; enlaces dobles o triples usan 2 o 3 pares.`,`<b>4) Completa los octetos</b> (dueto para H) con pares libres sobre los átomos externos y luego el central.`,`<b>5) Verifica:</b> electrones usados = ${m.usados} de ${m.ve} ${m.usados===m.ve?'✅':'❌'}${m.f==='BF3'?'. El B queda con 6 electrones: es una excepción al octeto (octeto incompleto).':''}`];
 const draw=()=>{const m=L[S.i],x=$(el,'#l_cv').getContext('2d');x.fillStyle='#0f172a';x.fillRect(0,0,420,260);const cx=210,cy=130,P=a=>[cx+a[1]*1.3,cy+a[2]*1.3];
  if(S.st>=2)m.b.forEach(([i,j,o])=>{const p=P(m.a[i]),q=P(m.a[j]),dx=q[0]-p[0],dy=q[1]-p[1],d=Math.hypot(dx,dy),nx=-dy/d*5,ny=dx/d*5;x.strokeStyle=S.st>=3?'#38bdf8':'#475569';x.lineWidth=3;for(let k=0;k<o;k++){const off=k-(o-1)/2;x.beginPath();x.moveTo(p[0]+nx*off*1.4,p[1]+ny*off*1.4);x.lineTo(q[0]+nx*off*1.4,q[1]+ny*off*1.4);x.stroke()}});
  m.a.forEach((a,i)=>{const p=P(a);x.fillStyle=catColor(a[0]);x.beginPath();x.arc(p[0],p[1],17,0,7);x.fill();x.fillStyle='#0f172a';x.font='bold 15px sans-serif';x.textAlign='center';x.fillText(a[0],p[0],p[1]+5);
   if(S.st>=4){const n=m.lp[i]||0,bonded=m.b.filter(b=>b[0]===i||b[1]===i).map(b=>{const o=m.a[b[0]===i?b[1]:b[0]],q=P(o);return Math.atan2(q[1]-p[1],q[0]-p[0])});const free=[];for(let k=0;k<12;k++){const a2=k*Math.PI/6;if(bonded.every(b=>Math.abs(Math.atan2(Math.sin(a2-b),Math.cos(a2-b)))>0.7))free.push(a2)}
    for(let k=0;k<n;k++){const a2=free.length?free[Math.floor((k+0.5)*free.length/n)%free.length]:k*2;const c=[p[0]+Math.cos(a2)*30,p[1]+Math.sin(a2)*30],pe=[-Math.sin(a2)*4,Math.cos(a2)*4];x.fillStyle='#fde047';[-1,1].forEach(s=>{x.beginPath();x.arc(c[0]+pe[0]*s,c[1]+pe[1]*s,2.6,0,7);x.fill()})}}});
  x.fillStyle='#e2e8f0';x.font='13px sans-serif';x.textAlign='left';x.fillText('Paso '+Math.max(1,S.st)+' de 5',12,20);
  $(el,'#l_st').innerHTML=STEP(m).slice(0,Math.max(1,S.st)).join('<br>');$(el,'#l_tl').innerHTML=tiles([['Electrones de valencia',m.ve,'#2563eb'],['Moléculas vistas',Object.keys(S.seen).length,'#16a34a']])};
 $(el,'#l_m').onchange=e=>{S.i=+e.target.value;S.st=0;S.seen[S.i]=1;ctx.act('molecula',{});draw()};
 $(el,'#l_n').onclick=()=>{if(S.st<5){S.st++;ctx.act('paso',{});if(S.st===5)ctx.obs('Estructura de Lewis de '+L[S.i].f+' completa')}draw()};
 $(el,'#l_r').onclick=()=>{S.st=0;draw()};
 S.seen[0]=1;draw();U.draw();return{reset(){S.st=0;S.seen={0:1};draw();U.reset()}}};

/* ========== GEOM: geometría molecular avanzada (RPECV con 2 a 6 dominios) ========== */
const GEO={'2-0':['Lineal','180°','CO₂'],'3-0':['Trigonal plana','120°','BF₃'],'3-1':['Angular','≈ 118°','SO₂'],'4-0':['Tetraédrica','109,5°','CH₄'],'4-1':['Piramidal trigonal','≈ 107°','NH₃'],'4-2':['Angular','104,5°','H₂O'],'5-0':['Bipirámide trigonal','90° y 120°','PCl₅'],'5-1':['Balancín','< 90° y < 120°','SF₄'],'5-2':['Forma de T','< 90°','ClF₃'],'5-3':['Lineal','180°','XeF₂'],'6-0':['Octaédrica','90°','SF₆'],'6-1':['Pirámide de base cuadrada','< 90°','BrF₅'],'6-2':['Plana cuadrada','90°','XeF₄']};
const DIRS=t=>t===2?[[1,0,0],[-1,0,0]]:t===3?[0,1,2].map(i=>[Math.cos(i*2.0944),Math.sin(i*2.0944),0]):t===4?TET:t===5?[[0,0,1],[0,0,-1],[1,0,0],[Math.cos(2.0944),Math.sin(2.0944),0],[Math.cos(4.1888),Math.sin(4.1888),0]]:[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
E.geom=(el,cfg,ctx)=>{const RT=cfg.retos||[];const S={bp:4,lp:0,k:0,ok:0,a:0,seen:{}};
 const stp=(id,t)=>`<div style="display:flex;align-items:center;gap:6px;margin-top:6px"><b style="width:150px;font-size:12px">${t}</b><button data-s="${id}-" class="sim-btn" style="background:#64748b">−</button><b id="g_${id}" style="min-width:24px;text-align:center;font-size:18px">0</b><button data-s="${id}+" class="sim-btn" style="background:#1e63e9">+</button></div>`;
 el.innerHTML=grid(panel('🎛️ Pares de electrones',stp('bp','Pares enlazantes')+stp('lp','Pares libres')+'<div id="g_tb" style="margin-top:8px;font-size:13px"></div><div id="g_rt" style="margin-top:10px;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:8px;font-size:13px"></div><div id="g_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'),panel('🔬 Modelo 3D (gira solo)','<canvas id="g_cv" width="420" height="300" style="width:100%;max-width:520px;display:block;margin:auto;border-radius:10px;background:#0f172a"></canvas>')+'<div id="g_tl"></div>');
 const key=()=>(S.bp+S.lp)+'-'+S.lp;
 const draw=()=>{$(el,'#g_bp').textContent=S.bp;$(el,'#g_lp').textContent=S.lp;const k=key(),g=GEO[k],t=S.bp+S.lp;
  $(el,'#g_tb').innerHTML=g?`<div style="background:#f8fafc;border-radius:10px;padding:8px"><b>Dominios totales:</b> ${t} · <b>Forma de la molécula:</b> <span style="color:#1e63e9;font-weight:900">${g[0]}</span><br><b>Ángulos:</b> ${g[1]} · <b>Ejemplo:</b> ${g[2]}</div>`:'<div style="color:#b45309;font-weight:700">Combinación no incluida en este modelo.</div>';
  const x=$(el,'#g_cv').getContext('2d');x.fillStyle='#0f172a';x.fillRect(0,0,420,300);const D=DIRS(Math.min(6,Math.max(2,t))),sc=88,c0=pj([0,0,0],420,300,sc);
  const lpIdx=t===5?[4,3,2].slice(0,S.lp):t===6?[5,4].slice(0,S.lp):D.map((_,i)=>i).slice(D.length-S.lp);
  const items=D.map((d,i)=>({d:rot3(d,S.a,.45),lp:lpIdx.includes(i)})).sort((a,b)=>a.d[2]-b.d[2]);
  items.forEach(it=>{const q=pj(it.d,420,300,sc);if(it.lp){x.fillStyle='#fde04788';x.beginPath();x.ellipse((c0[0]+q[0])/2,(c0[1]+q[1])/2,24,13,Math.atan2(q[1]-c0[1],q[0]-c0[0]),0,7);x.fill()}else{x.strokeStyle='#e2e8f0';x.lineWidth=3;x.beginPath();x.moveTo(c0[0],c0[1]);x.lineTo(q[0],q[1]);x.stroke();x.fillStyle='#38bdf8';x.beginPath();x.arc(q[0],q[1],12,0,7);x.fill()}});
  x.fillStyle='#f97316';x.beginPath();x.arc(c0[0],c0[1],17,0,7);x.fill();x.fillStyle='#0f172a';x.font='bold 12px sans-serif';x.textAlign='center';x.fillText('A',c0[0],c0[1]+4);
  $(el,'#g_tl').innerHTML=tiles([['Geometría',g?g[0]:'—','#2563eb'],['Formas vistas',Object.keys(S.seen).length,'#16a34a']])};
 const fr=frame(el,()=>{S.a+=0.012;draw()});
 const chg=()=>{const k=key();if(GEO[k]&&!S.seen[k]){S.seen[k]=1;ctx.act('geom_nueva',{})}ctx.act('cambia',{})};
 el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const k=b.dataset.s,id=k.slice(0,-1),d=k.slice(-1)==='+'?1:-1;if(id==='bp')S.bp=Math.max(1,Math.min(6,S.bp+d));else S.lp=Math.max(0,Math.min(3,S.lp+d));while(S.bp+S.lp>6){if(id==='bp')S.lp--;else S.bp--}if(S.bp+S.lp<2)S.bp=2-S.lp;chg()});
 const rt=()=>{const d=$(el,'#g_rt'),r=RT[S.k];d.innerHTML=r?`<b>Reto ${S.k+1}/${RT.length}:</b> ${r.q} <button id="g_ck" class="sim-btn" style="background:#16a34a;margin-left:6px">✔ Comprobar</button>`:'🏁 <b>¡Retos completados!</b> '+S.ok+' de '+RT.length;
  const b=$(el,'#g_ck');if(b)b.onclick=()=>{const f=$(el,'#g_fb'),ok=S.bp===r.bp&&S.lp===r.lp;if(ok){S.ok++;ctx.act('reto_ok',{});f.style.color='#16a34a';f.textContent='✅ Correcto. '+(r.why||'')}else{f.style.color='#dc2626';f.textContent='❌ Cuenta los pares alrededor del átomo central. '+(r.why||'')}ctx.obs('Reto '+(S.k+1)+': '+(ok?'acierto':'error'));if(ok){S.k++;if(S.k>=RT.length)ctx.act('todo_ok',{});rt()}}};
 draw();rt();return{reset(){S.bp=4;S.lp=0;S.k=0;S.ok=0;S.seen={};rt();draw()}}};


/* ========== etapa 5b: nomenclatura inorgánica, redox, termoquímica, calorimetría, gases, sustancias incógnitas ========== */
E.nombra=(el,cfg,ctx)=>{const IT=cfg.items,GR=Array.from(new Set(IT.map(x=>x.g)));const S={i:0,g:'',seen:{}};
 const RT=genR(cfg.retos||[],(r,i)=>{const it=IT[r.i];
  if(r.t==='f2n'){const sis=r.s||it.nombres[0][0],nm=(it.nombres.find(n=>n[0]===sis)||it.nombres[0])[1],o=[nm];IT.filter(x=>x.g===it.g&&x!==it).forEach(x=>{const n2=(x.nombres.find(n=>n[0]===sis)||x.nombres[0])[1];if(!o.includes(n2)&&o.length<4)o.push(n2)});const lst=shuf(o,i+7);return{q:`¿Cómo se llama <b>${dsub(it.f)}</b> en nomenclatura ${sis.toLowerCase()}?`,o:lst,ok:lst.indexOf(nm),why:`${dsub(it.f)}: ${nm}. ${it.nota||''}`}}
  if(r.t==='n2f'){const sis=r.s||it.nombres[0][0],nm=(it.nombres.find(n=>n[0]===sis)||it.nombres[0])[1],o=[it.f];IT.filter(x=>x.g===it.g&&x!==it).forEach(x=>{if(!o.includes(x.f)&&o.length<4)o.push(x.f)});const lst=shuf(o,i+5);return{q:`¿Cuál es la fórmula de <b>${nm}</b>?`,o:lst,ok:lst.indexOf(it.f),why:`${nm} = ${dsub(it.f)}. ${it.nota||''}`}}return r});
 el.innerHTML=grid(panel('🎛️ Compuesto',(GR.length>1?lab('Familia')+sel('n_g',[['','Todas']].concat(GR.map(g=>[g,g])),''):'')+lab('Compuesto')+'<div id="n_sw"></div>'+(RT.length?rhold('n'):'<div id="n_rt"></div><div id="n_fb"></div>')),panel('📋 Fórmula y nombres','<div id="n_out"></div>')+'<div id="n_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'n');
 const list=()=>IT.map((x,i)=>[i,x]).filter(x=>!S.g||x[1].g===S.g);
 const mk=()=>{const L_=list();if(!L_.some(x=>x[0]===S.i))S.i=L_[0][0];$(el,'#n_sw').innerHTML=sel('n_i',L_.map(x=>[x[0],dsub(x[1].f)+' — '+x[1].g]),S.i);$(el,'#n_i').onchange=e=>{S.i=+e.target.value;S.seen[S.i]=1;ctx.act('ver',{});out()}};
 const out=()=>{const it=IT[S.i];$(el,'#n_out').innerHTML=`<div style="font-size:26px;font-weight:900;color:#1e63e9">${dsub(it.f)}</div><div style="font-size:12px;color:#64748b;margin-bottom:6px">${esc(it.g)}</div><table style="width:100%;border-collapse:collapse;font-size:14px">${it.nombres.map(n=>`<tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;font-weight:700;width:38%">${esc(n[0])}</td><td>${esc(n[1])}</td></tr>`).join('')}</table>${it.nota?`<div style="margin-top:8px;font-size:13px;background:#f8fafc;border-radius:10px;padding:8px">${it.nota}</div>`:''}`;
  $(el,'#n_tl').innerHTML=tiles([['Compuestos vistos',Object.keys(S.seen).length,'#2563eb'],['En esta lista',IT.length,'#64748b']])};
 const sg=$(el,'#n_g');if(sg)sg.onchange=e=>{S.g=e.target.value;mk();out()};
 S.seen[0]=1;mk();out();U.draw();return{reset(){S.seen={0:1};out();U.reset()}}};

/* ========== REDOX: números de oxidación y transferencia de electrones ========== */
const oxs=n=>(n>0?'+':n<0?'−':'')+Math.abs(n);
E.redox=(el,cfg,ctx)=>{const RX_=cfg.rx;const S={i:0,asked:{},ok:{},done:{},esRedox:null};
 const cam=r=>{const a={},b={};r.R.forEach(s=>Object.keys(s[1]).forEach(e=>{if(a[e]==null)a[e]={n:s[1][e],f:s[0]}}));r.P.forEach(s=>Object.keys(s[1]).forEach(e=>{if(b[e]==null)b[e]={n:s[1][e],f:s[0]}}));return Object.keys(a).filter(e=>b[e]&&a[e].n!==b[e].n).map(e=>({e,de:a[e].n,a:b[e].n,fr:a[e].f,fp:b[e].f}))};
 const RT=cfg.retos||[];
 el.innerHTML=grid(panel('🎛️ Reacción',lab('Elige una reacción')+sel('x_r',RX_.map((r,i)=>[i,r.n]),0)+'<div id="x_q" style="margin-top:10px"></div><div id="x_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'+(RT.length?rhold('x2'):'<div id="x2_rt"></div><div id="x2_fb"></div>')),panel('🔬 Números de oxidación','<div id="x_out"></div>')+'<div id="x_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'x2');
 const spc=(s)=>`<span style="display:inline-block;padding:3px 8px;margin:2px;border:2px solid #e2e8f0;border-radius:10px;background:#f8fafc"><b>${dsub(s[0])}</b><div style="font-size:11px;color:#1e63e9;font-weight:800">${Object.keys(s[1]).map(e=>e+' '+oxs(s[1][e])).join(' · ')}</div></span>`;
 const draw=()=>{const r=RX_[S.i],c=cam(r),k=S.i;
  $(el,'#x_out').innerHTML=`<div style="font-size:14px;font-weight:800;margin-bottom:4px">${dsub(r.eq)}</div><div>${r.R.map(spc).join('<b> + </b>')}<b> → </b>${r.P.map(spc).join('<b> + </b>')}</div>`+(S.done[k]?`<div style="margin-top:8px;font-size:13.5px;background:#f0fdf4;border-radius:10px;padding:8px">${c.length?c.map(x=>`<b>${x.e}</b>: ${oxs(x.de)} → ${oxs(x.a)} (${x.a>x.de?'se oxida: pierde '+(x.a-x.de)+' e⁻':'se reduce: gana '+(x.de-x.a)+' e⁻'})`).join('<br>')+`<br><b>Agente reductor:</b> ${c.filter(x=>x.a>x.de).map(x=>dsub(x.fr)).join(', ')} · <b>Agente oxidante:</b> ${c.filter(x=>x.a<x.de).map(x=>dsub(x.fr)).join(', ')}`:'No cambia ningún número de oxidación: <b>no es una reacción redox</b>.'}</div>`:'');
  const q=$(el,'#x_q');if(S.esRedox!==k+':'+1&&!S.asked[k]){q.innerHTML=`<b>¿Es una reacción redox?</b><div style="display:flex;gap:6px;margin-top:6px">${btn('x_y','Sí','#16a34a')}${btn('x_n','No','#dc2626')}</div>`;$(el,'#x_y').onclick=()=>ans(true);$(el,'#x_n').onclick=()=>ans(false)}
  else if(c.length&&!S.done[k]){const todo=c.filter(x=>!S.ok[k+x.e]);q.innerHTML=`<b>Clasifica cada elemento que cambia:</b>`+todo.map(x=>`<div style="margin-top:6px"><b>${x.e}</b> (${oxs(x.de)} → ${oxs(x.a)}) <button data-e="${x.e}" data-v="ox" class="sim-btn" style="background:#f59e0b">Se oxida</button> <button data-e="${x.e}" data-v="re" class="sim-btn" style="background:#2563eb">Se reduce</button></div>`).join('');
   q.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{const x=c.find(y=>y.e===b.dataset.e),real=x.a>x.de?'ox':'re',f=$(el,'#x_fb');if(b.dataset.v===real){S.ok[k+x.e]=1;ctx.act('clasifica_ok',{});f.style.color='#16a34a';f.textContent='✅ '+x.e+(real==='ox'?' pierde electrones: se oxida.':' gana electrones: se reduce.');if(c.every(y=>S.ok[k+y.e])){S.done[k]=1;ctx.act('reaccion_ok',{});ctx.obs(r.n+': análisis redox completo');if(Object.keys(S.done).length>=RX_.length)ctx.act('todo_ok',{})}}else{f.style.color='#dc2626';f.textContent='❌ Si el número de oxidación '+(x.a>x.de?'aumenta':'disminuye')+', el elemento '+(x.a>x.de?'pierde':'gana')+' electrones.'}draw()})}
  else q.innerHTML=S.done[k]?'':'';
  $(el,'#x_tl').innerHTML=tiles([['Reacciones resueltas',Object.keys(S.done).length+' / '+RX_.length,'#16a34a']])};
 const ans=v=>{const k=S.i,c=cam(RX_[k]),f=$(el,'#x_fb');S.asked[k]=1;const real=c.length>0;if(v===real){f.style.color='#16a34a';f.textContent=real?'✅ Sí: cambian números de oxidación.':'✅ No: ningún número de oxidación cambia.';if(!real){S.done[k]=1;ctx.act('clasifica_ok',{});ctx.act('reaccion_ok',{});if(Object.keys(S.done).length>=RX_.length)ctx.act('todo_ok',{})}}else{f.style.color='#dc2626';f.textContent='❌ Compara los números de oxidación antes y después.';S.asked[k]=0}draw()};
 $(el,'#x_r').onchange=e=>{S.i=+e.target.value;$(el,'#x_fb').textContent='';ctx.act('cambia',{});draw()};
 draw();U.draw();return{reset(){S.asked={};S.ok={};S.done={};draw();U.reset()}}};

/* ========== TERMO: entalpía de reacción a partir de entalpías de formación ========== */
E.termo=(el,cfg,ctx)=>{const RX_=cfg.rxs;const S={i:0,m:16};
 const eqT=r=>dsub(r.R.map(x=>(x[0]>1?x[0]+' ':'')+x[1]).join(' + ')+' → '+r.P.map(x=>(x[0]>1?x[0]+' ':'')+x[1]+(x[3]?'('+x[3]+')':'')).join(' + '));
 const dH=r=>r.P.reduce((s,x)=>s+x[0]*x[2],0)-r.R.reduce((s,x)=>s+x[0]*x[2],0);
 const RT=genR(cfg.retos||[],(r,i)=>{const R=RX_[r.i],h=dH(R);
  if(r.t==='dH')return numReto(`¿Cuál es la variación de entalpía (ΔH) de: <b>${eqT(R)}</b>? (kJ por cada vez que ocurre la ecuación)`,h,[-h,h+R.P[0][2],Math.abs(h)*(h<0?1:-1)*0.5,R.P.reduce((s,x)=>s+x[0]*x[2],0)],'kJ',1,`ΔH = Σ ΔHf(productos) − Σ ΔHf(reactivos) = ${fm(h,1)} kJ.`,i+1);
  if(r.t==='tipo')return{q:`La reacción <b>${eqT(R)}</b> tiene ΔH = ${fm(h,1)} kJ. ¿Es exotérmica o endotérmica?`,o:['Exotérmica (libera calor)','Endotérmica (absorbe calor)'],ok:h<0?0:1,why:h<0?'ΔH negativo: libera energía.':'ΔH positivo: absorbe energía.'};
  if(r.t==='q'){const a=R.R[0],n=r.m/mmF(a[1])/a[0],q=n*h;return numReto(`Reaccionan ${r.m} g de ${a[1]} en: <b>${eqT(R)}</b>. ¿Cuánto calor se libera o absorbe?`,q,[h,r.m*h,-q],'kJ',1,`n(${a[1]}) = ${fm(r.m/mmF(a[1]),3)} mol; ÷ coef. ${a[0]} × ΔH (${fm(h,1)}) = ${fm(q,1)} kJ (negativo = libera).`,i+3)}return r});
 el.innerHTML=grid(panel('🎛️ Reacción',lab('Reacción')+sel('t_r',RX_.map((r,i)=>[i,r.n]),0)+'<div id="t_eq" style="font-weight:800;margin-top:6px"></div>'+'<div id="t_mw"></div>'+(RT.length?rhold('t'):'<div id="t_rt"></div><div id="t_fb"></div>')),panel('⚡ Cálculo y diagrama de energía','<div id="t_out"></div><svg id="t_sv" viewBox="0 0 320 170" style="width:100%;max-width:380px;display:block;margin:8px auto"></svg>')+'<div id="t_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'t');
 const draw=()=>{const r=RX_[S.i],h=dH(r),a=r.R[0],n=S.m/mmF(a[1])/a[0],q=n*h,sr=r.R.reduce((s,x)=>s+x[0]*x[2],0),sp=r.P.reduce((s,x)=>s+x[0]*x[2],0);
  $(el,'#t_eq').innerHTML=eqT(r);$(el,'#t_mw').innerHTML=rng('t_m','Masa de '+dsub(a[1])+' que reacciona (g)',1,100,S.m,1);$(el,'#t_m').oninput=e=>{S.m=+e.target.value;$(el,'#t_mv').textContent=S.m;ctx.act('cambia',{});draw()};
  $(el,'#t_out').innerHTML=`<div style="font-size:13.5px;line-height:1.7">ΔH = Σ ΔHf(productos) − Σ ΔHf(reactivos)<br>Productos: ${r.P.map(x=>x[0]+' × ('+fm(x[2],1)+')').join(' + ')} = ${fm(sp,1)} kJ<br>Reactivos: ${r.R.map(x=>x[0]+' × ('+fm(x[2],1)+')').join(' + ')} = ${fm(sr,1)} kJ<br><b>ΔH = ${fm(h,1)} kJ</b> → <b style="color:${h<0?'#dc2626':'#2563eb'}">${h<0?'EXOTÉRMICA (libera calor)':'ENDOTÉRMICA (absorbe calor)'}</b><br>Con ${S.m} g de ${dsub(a[1])} (${fm(n*a[0],3)} mol): calor = <b>${fm(q,1)} kJ</b></div>`;
  const mn=Math.min(sr,sp),mx=Math.max(sr,sp),sc=v=>mx===mn?85:150-(v-mn)/(mx-mn)*110,yr=sc(sr),yp=sc(sp);
  $(el,'#t_sv').innerHTML=`<line x1="20" y1="${yr}" x2="130" y2="${yr}" stroke="#2563eb" stroke-width="5"/><text x="20" y="${yr-6}" font-size="11" fill="#1e3a8a">Reactivos</text><line x1="190" y1="${yp}" x2="300" y2="${yp}" stroke="#16a34a" stroke-width="5"/><text x="190" y="${yp-6}" font-size="11" fill="#166534">Productos</text><line x1="160" y1="${yr}" x2="160" y2="${yp}" stroke="${h<0?'#dc2626':'#2563eb'}" stroke-width="3"/><text x="166" y="${(yr+yp)/2}" font-size="12" font-weight="800" fill="${h<0?'#dc2626':'#2563eb'}">ΔH = ${fm(h,1)} kJ</text><text x="10" y="14" font-size="10" fill="#64748b">Entalpía (relativa)</text>`;
  $(el,'#t_tl').innerHTML=tiles([['ΔH',fm(h,1)+' kJ',h<0?'#dc2626':'#2563eb'],['Calor con '+S.m+' g',fm(q,1)+' kJ','#7c3aed']])};
 $(el,'#t_r').onchange=e=>{S.i=+e.target.value;ctx.act('reaccion',{});ctx.obs(RX_[S.i].n+': ΔH = '+fm(dH(RX_[S.i]),1)+' kJ');draw()};
 draw();U.draw();return{reset(){draw();U.reset()}}};

/* ========== CALOR: calorimetría (calor específico) ========== */
const CMET={Cu:{n:'Cobre',c:0.385},Al:{n:'Aluminio',c:0.897},Fe:{n:'Hierro',c:0.449},Pb:{n:'Plomo',c:0.129}};const CW=4.184;
const tFin=(mw,Tw,mm,Tm,cm)=>(mw*CW*Tw+mm*cm*Tm)/(mw*CW+mm*cm);
E.calor=(el,cfg,ctx)=>{const MIS=cfg.misterios||[];const S={sel:'Cu',mm:50,Tm:100,mw:100,Tw:20,res:null,log:[],idOk:{}};
 const RT=genR(cfg.retos||[],(r,i)=>{if(r.t==='tf'){const c=CMET[r.me].c,t=tFin(r.mw,r.Tw,r.mm,r.Tm,c);return numReto(`Se sumergen ${r.mm} g de ${CMET[r.me].n.toLowerCase()} (c = ${fm(c,3)} J/g·°C) a ${r.Tm} °C en ${r.mw} g de agua a ${r.Tw} °C. ¿Cuál es la temperatura final?`,t,[(r.Tm+r.Tw)/2,r.Tm,r.Tw+5],'°C',1,`Calor perdido por el metal = calor ganado por el agua → T final = ${fm(t,1)} °C.`,i+1)}
  if(r.t==='id'){const c=CMET[r.me].c,t=tFin(r.mw,r.Tw,r.mm,r.Tm,c),cc=r.mw*CW*(t-r.Tw)/(r.mm*(r.Tm-t)),ks=Object.keys(CMET),o=ks.map(k=>CMET[k].n);return{q:`Una muestra metálica de ${r.mm} g a ${r.Tm} °C se sumerge en ${r.mw} g de agua a ${r.Tw} °C y la temperatura final es ${fm(t,1)} °C. ¿Qué metal es? (calcula su calor específico)`,o,ok:ks.indexOf(r.me),why:`c = m(agua)·c(agua)·ΔT(agua) / [m(metal)·ΔT(metal)] = ${fm(cc,3)} J/g·°C → ${CMET[r.me].n}.`}}return r});
 el.innerHTML=grid(panel('🎛️ Montaje',lab('Muestra metálica')+sel('c_k',Object.keys(CMET).map(k=>[k,CMET[k].n+' (conocido)']).concat(MIS.map((m,i)=>['?'+i,m.n+' (desconocida)'])),S.sel)+rng('c_mm','Masa del metal (g)',20,200,S.mm,5)+rng('c_tm','Temperatura inicial del metal (°C)',60,100,S.Tm,5)+rng('c_mw','Masa de agua (g)',50,250,S.mw,10)+rng('c_tw','Temperatura inicial del agua (°C)',15,30,S.Tw,1)+`<div style="margin-top:10px">${btn('c_go','🌡️ Mezclar y medir','#0d9488')}</div>`+(RT.length?rhold('c'):'<div id="c_rt"></div><div id="c_fb"></div>')),panel('📈 Temperatura en el calorímetro','<canvas id="c_cv" style="width:100%;display:block"></canvas>')+panel('📋 Registro','<div id="c_tb"></div>')+'<div id="c_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'c');
 const hk=(id,k)=>{$(el,'#'+id).oninput=e=>{S[k]=+e.target.value;$(el,'#'+id+'v').textContent=S[k]}};hk('c_mm','mm');hk('c_tm','Tm');hk('c_mw','mw');hk('c_tw','Tw');
 $(el,'#c_k').onchange=e=>{S.sel=e.target.value};
 const metal=()=>S.sel[0]==='?'?MIS[+S.sel.slice(1)].m:S.sel;
 const draw=()=>{const r=S.res;if(!r){SIM.plot($(el,'#c_cv'),{h:240,xmin:0,xmax:60,ymin:0,ymax:100,xl:'Tiempo (s)',yl:'T (°C)',series:[]});}else{const tau=12;SIM.plot($(el,'#c_cv'),{h:260,xmin:0,xmax:60,ymin:Math.max(0,Math.min(r.Tw,r.Tf)-5),ymax:r.Tm+5,xl:'Tiempo (s) — forma de la curva ilustrativa',yl:'T (°C)',series:[{f:t=>r.Tf+(r.Tw-r.Tf)*Math.exp(-t/tau),x0:0,x1:60,color:'#2563eb',name:'Agua'},{f:t=>r.Tf+(r.Tm-r.Tf)*Math.exp(-t/tau),x0:0,x1:60,color:'#dc2626',name:'Metal'}],hlines:[{y:r.Tf,color:'#16a34a',label:'T final = '+fm(r.Tf,1)+' °C'}]})}
  $(el,'#c_tb').innerHTML=S.log.length?`<table style="width:100%;border-collapse:collapse;font-size:12.5px"><tr style="background:#f1f5f9"><th style="padding:4px;text-align:left">Muestra</th><th>T final (°C)</th><th>Calor ganado por el agua (J)</th><th>c calculado (J/g·°C)</th></tr>${S.log.map(x=>`<tr style="border-top:1px solid #e2e8f0"><td style="padding:4px">${esc(x.n)}</td><td style="text-align:center">${fm(x.Tf,1)}</td><td style="text-align:center">${fm(x.q,0)}</td><td style="text-align:center"><b>${fm(x.c,3)}</b></td></tr>`).join('')}</table><div style="font-size:12px;color:#64748b;margin-top:4px">c = m(agua) · 4,184 · ΔT(agua) / [m(metal) · ΔT(metal)]. Valores de referencia: Cu 0,385 · Al 0,897 · Fe 0,449 · Pb 0,129.</div>`:'<div style="color:#64748b;font-size:13px">Pulsa «Mezclar y medir».</div>';
  const idb=S.res&&S.sel[0]==='?'?`<div style="margin-top:8px;font-size:13px"><b>¿Qué metal es la muestra?</b> ${Object.keys(CMET).map(k=>`<button data-k="${k}" class="sim-btn" style="background:#7c3aed">${CMET[k].n}</button>`).join(' ')}<div id="c_idf" style="margin-top:6px;font-weight:700"></div></div>`:'';
  $(el,'#c_tl').innerHTML=tiles([['Mezclas',S.log.length,'#2563eb']])+idb;
  el.querySelectorAll('#c_tl [data-k]').forEach(b=>b.onclick=()=>{const real=MIS[+S.sel.slice(1)].m,f=$(el,'#c_idf'),ok=b.dataset.k===real;if(ok){S.idOk[S.sel]=1;ctx.act('identifica_ok',{});f.style.color='#16a34a';f.textContent='✅ Correcto: '+CMET[real].n+'.'}else{f.style.color='#dc2626';f.textContent='❌ Compara tu c calculado con los valores de referencia.'}})};
 $(el,'#c_go').onclick=()=>{const m=metal(),cm=CMET[m].c,Tf=tFin(S.mw,S.Tw,S.mm,S.Tm,cm),q=S.mw*CW*(Tf-S.Tw),c=q/(S.mm*(S.Tm-Tf));S.res={Tf,Tw:S.Tw,Tm:S.Tm};S.log.push({n:S.sel[0]==='?'?MIS[+S.sel.slice(1)].n:CMET[m].n,Tf,q,c});ctx.act('mezcla',{});ctx.obs((S.sel[0]==='?'?'Muestra desconocida':CMET[m].n)+': T final '+fm(Tf,1)+' °C; c = '+fm(c,3)+' J/g·°C');draw()};
 draw();U.draw();return{reset(){S.res=null;S.log=[];S.idOk={};draw();U.reset()}}};

/* ========== GASES: leyes de los gases ========== */
const RG=0.08206;
E.gases=(el,cfg,ctx)=>{const S={ley:'boyle',n:1,T:300,V:10,Pf:1,seen:{boyle:1},a:0};const RT=genR(cfg.retos||[],(r,i)=>{
  if(r.t==='boyle'){const v=r.P1*r.V1/r.P2;return numReto(`Un gas ocupa ${r.V1} L a ${r.P1} atm. Si la presión cambia a ${r.P2} atm a temperatura constante, ¿qué volumen ocupa?`,v,[r.V1*r.P2/r.P1,r.V1+r.P2-r.P1,r.V1],'L',2,`Ley de Boyle: P₁V₁ = P₂V₂ → V₂ = ${fm(r.P1,1)} × ${r.V1} / ${fm(r.P2,1)} = ${fm(v,2)} L.`,i+1)}
  if(r.t==='charles'){const v=r.V1*(r.T2+273.15)/(r.T1+273.15);return numReto(`Un gas ocupa ${r.V1} L a ${r.T1} °C. Si se calienta a ${r.T2} °C a presión constante, ¿qué volumen ocupa?`,v,[r.V1*r.T2/r.T1,r.V1*(r.T1+273.15)/(r.T2+273.15),r.V1+r.T2-r.T1],'L',2,`Ley de Charles con temperatura en kelvin: V₂ = V₁ × T₂/T₁ = ${r.V1} × ${fm(r.T2+273.15,2)} / ${fm(r.T1+273.15,2)} = ${fm(v,2)} L.`,i+2)}
  if(r.t==='gay'){const p=r.P1*(r.T2+273.15)/(r.T1+273.15);return numReto(`Un gas en un recipiente rígido está a ${r.P1} atm y ${r.T1} °C. Si se calienta a ${r.T2} °C, ¿cuál es la presión?`,p,[r.P1*r.T2/r.T1,r.P1*(r.T1+273.15)/(r.T2+273.15),r.P1+r.T2-r.T1],'atm',2,`Ley de Gay-Lussac (volumen constante, T en K): P₂ = ${r.P1} × ${fm(r.T2+273.15,2)} / ${fm(r.T1+273.15,2)} = ${fm(p,2)} atm.`,i+3)}
  if(r.t==='n'){const n=r.P*r.V/(RG*r.T);return numReto(`¿Cuántos mol de gas hay en ${r.V} L a ${r.P} atm y ${r.T} K? (R = 0,08206 L·atm/mol·K)`,n,[r.P*r.V*RG*r.T,r.P*r.V/(RG*(r.T-273.15)),n*2],'mol',3,`PV = nRT → n = PV/RT = ${r.P} × ${r.V} / (0,08206 × ${r.T}) = ${fm(n,3)} mol.`,i+4)}
  return r});
 el.innerHTML=grid(panel('🎛️ Controles',lab('Ley')+sel('g_l',[['boyle','Boyle (P y V, T constante)'],['charles','Charles (V y T, P constante)'],['gay','Gay-Lussac (P y T, V constante)'],['ideal','Gas ideal PV = nRT']],S.ley)+'<div id="g_ct"></div>'+(RT.length?rhold('g'):'<div id="g_rt"></div><div id="g_fb"></div>')),panel('🔬 Partículas (más T = más rápidas; más V = recipiente más grande)','<canvas id="g_cv" width="440" height="200" style="width:100%;border-radius:10px;background:#0f172a;display:block"></canvas>')+panel('📈 Gráfica','<canvas id="g_pl" style="width:100%;display:block"></canvas>')+'<div id="g_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'g');
 const calc=()=>{const l=S.ley;if(l==='boyle')return{V:S.V,T:300,n:1,P:1*RG*300/S.V};if(l==='charles')return{V:1*RG*S.T/S.Pf,T:S.T,n:1,P:S.Pf};if(l==='gay')return{V:10,T:S.T,n:1,P:1*RG*S.T/10};return{V:S.V,T:S.T,n:S.n,P:S.n*RG*S.T/S.V}};
 const ctl=()=>{const l=S.ley;$(el,'#g_ct').innerHTML=(l==='boyle'?rng('g_v','Volumen (L)',2,20,S.V,0.5)+'<div style="font-size:12px;color:#64748b">n = 1 mol y T = 300 K constantes.</div>':l==='charles'?rng('g_t','Temperatura (K)',150,500,S.T,10)+'<div style="font-size:12px;color:#64748b">n = 1 mol y P = 1 atm constantes.</div>':l==='gay'?rng('g_t','Temperatura (K)',150,500,S.T,10)+'<div style="font-size:12px;color:#64748b">n = 1 mol y V = 10 L constantes.</div>':rng('g_n','Cantidad de gas (mol)',0.2,3,S.n,0.1)+rng('g_t','Temperatura (K)',150,500,S.T,10)+rng('g_v','Volumen (L)',2,30,S.V,0.5));
  [['g_v','V'],['g_t','T'],['g_n','n']].forEach(([id,k])=>{const x=$(el,'#'+id);if(x)x.oninput=e=>{S[k]=+e.target.value;$(el,'#'+id+'v').textContent=S[k];ctx.act('cambia',{});plot()}})};
 const plot=()=>{const c=calc(),l=S.ley;let o;
  if(l==='boyle')o={xmin:0,xmax:20,ymin:0,ymax:13,xl:'Volumen (L)',yl:'Presión (atm)',series:[{f:v=>RG*300/Math.max(v,.2),x0:1.5,x1:20,color:'#2563eb'}],pts:[{x:c.V,y:c.P,r:6,fill:'#f59e0b',color:'#b45309'}]};
  if(l==='charles')o={xmin:0,xmax:500,ymin:0,ymax:45,xl:'Temperatura (K)',yl:'Volumen (L)',series:[{f:t=>RG*t/S.Pf,x0:0,x1:500,color:'#2563eb'}],pts:[{x:c.T,y:c.V,r:6,fill:'#f59e0b',color:'#b45309'}]};
  if(l==='gay')o={xmin:0,xmax:500,ymin:0,ymax:5,xl:'Temperatura (K)',yl:'Presión (atm)',series:[{f:t=>RG*t/10,x0:0,x1:500,color:'#2563eb'}],pts:[{x:c.T,y:c.P,r:6,fill:'#f59e0b',color:'#b45309'}]};
  if(l==='ideal')o={xmin:0,xmax:30,ymin:0,ymax:Math.max(8,c.P*1.3),xl:'Volumen (L)',yl:'Presión (atm)',series:[{f:v=>S.n*RG*S.T/Math.max(v,.3),x0:1.5,x1:30,color:'#2563eb'}],pts:[{x:c.V,y:c.P,r:6,fill:'#f59e0b',color:'#b45309'}]};
  SIM.plot($(el,'#g_pl'),Object.assign({h:230},o));
  $(el,'#g_tl').innerHTML=tiles([['P',fm(c.P,2)+' atm','#2563eb'],['V',fm(c.V,2)+' L','#16a34a'],['T',fm(c.T,0)+' K','#dc2626'],['n',fm(c.n,2)+' mol','#7c3aed']])};
 const P_=[];for(let i=0;i<40;i++){const r=rnd(i+7);P_.push({x:r(),y:r(),a:r()*6.28})}
 const fr=frame(el,()=>{const cv=$(el,'#g_cv');if(!cv)return;const c=calc(),x=cv.getContext('2d'),W=Math.max(60,Math.min(420,c.V/30*420)),sp=Math.sqrt(c.T/300)*2.2,N=Math.max(4,Math.round(c.n*14));x.fillStyle='#0f172a';x.fillRect(0,0,440,200);x.strokeStyle='#94a3b8';x.lineWidth=3;x.strokeRect(10,10,W,180);
  for(let i=0;i<N;i++){const p=P_[i%40];p.x+=Math.cos(p.a)*sp/W*3;p.y+=Math.sin(p.a)*sp/180*3;if(p.x<0){p.x=0;p.a=Math.PI-p.a}if(p.x>1){p.x=1;p.a=Math.PI-p.a}if(p.y<0){p.y=0;p.a=-p.a}if(p.y>1){p.y=1;p.a=-p.a}x.fillStyle='#38bdf8';x.beginPath();x.arc(10+4+p.x*(W-8),14+p.y*172,4,0,7);x.fill()}});
 $(el,'#g_l').onchange=e=>{S.ley=e.target.value;S.seen[S.ley]=1;ctx.act('ley',{});ctx.obs('Ley: '+S.ley);ctl();plot()};
 ctl();plot();U.draw();return{reset(){S.seen={boyle:1};plot();U.reset()}}};

/* ========== INCOGNITA: identificación de sustancias desconocidas ========== */
const INC={HCl:{n:'Ácido clorhídrico (HCl)',a:'Incolora',i:'Rojo (pH ≈ 1)',ag:'Sólido blanco (precipitado)',mg:'Burbujas de gas (H₂)',oh:'Se calienta un poco; sin sólido'},NaOH:{n:'Hidróxido de sodio (NaOH)',a:'Incolora',i:'Violeta (pH ≈ 13)',ag:'Sólido pardo oscuro (precipitado)',mg:'Sin cambio apreciable',oh:'Sin cambio apreciable'},NaCl:{n:'Cloruro de sodio (NaCl)',a:'Incolora',i:'Verde (pH ≈ 7)',ag:'Sólido blanco (precipitado)',mg:'Sin cambio apreciable',oh:'Sin cambio apreciable'},CuSO4:{n:'Sulfato de cobre (CuSO₄)',a:'Azul',i:'Naranja-amarillo (pH ≈ 4)',ag:'Sin cambio apreciable',mg:'Depósito rojizo (cobre metálico)',oh:'Sólido azul gelatinoso (precipitado)'},Na2CO3:{n:'Carbonato de sodio (Na₂CO₃)',a:'Incolora',i:'Azul-violeta (pH ≈ 11)',ag:'Sólido blanco-amarillento (precipitado)',mg:'Sin cambio apreciable',oh:'Sin cambio apreciable'}};
const INT=[['a','👁️ Mirar'],['i','🌈 Indicador universal'],['ag','⚪ Agregar AgNO₃'],['mg','🔩 Agregar Mg'],['oh','🧴 Agregar NaOH']];
E.incognita=(el,cfg,ctx)=>{const CS=cfg.casos;const S={c:0,obs:{},id:{},ok:{},solved:{}};const V=['A','B','C','D'];
 el.innerHTML=grid(panel('🎛️ Caso',lab('Caso')+sel('z_c',CS.map((c,i)=>[i,'Caso '+(i+1)]),0)+'<div style="font-size:12.5px;color:#475569;margin-top:6px">Cada frasco contiene una de estas sustancias: HCl, NaOH, NaCl, CuSO₄ o Na₂CO₃ (en solución diluida). Usa las pruebas para identificarlas.</div>'+`<div style="margin-top:10px">${btn('z_ok','✔️ Comprobar mi caso','#0d9488')}</div><div id="z_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>`),panel('🧪 Frascos','<div id="z_vs"></div>')+'<div id="z_tl"></div>');
 const draw=()=>{const cs=CS[S.c];$(el,'#z_vs').innerHTML=cs.map((f,j)=>`<div style="border:2px solid #e2e8f0;border-radius:12px;padding:8px;margin-bottom:8px"><b>Frasco ${V[j]}</b><div style="display:flex;flex-wrap:wrap;gap:5px;margin:6px 0">${INT.map(t=>`<button data-j="${j}" data-t="${t[0]}" class="sim-btn" style="background:#0d9488;font-size:12px">${t[1]}</button>`).join('')}</div><div style="font-size:12.5px">${INT.filter(t=>S.obs[S.c+'-'+j+t[0]]).map(t=>`<div><b>${t[1]}:</b> ${esc(INC[f][t[0]])}</div>`).join('')||'<span style="color:#64748b">Sin pruebas aún.</span>'}</div><div style="margin-top:6px">${sel('z_s'+j,[['','¿Qué es?']].concat(Object.keys(INC).map(k=>[k,INC[k].n])),S.id[S.c+'-'+j]||'')}</div></div>`).join('');
  el.querySelectorAll('#z_vs [data-t]').forEach(b=>b.onclick=()=>{S.obs[S.c+'-'+b.dataset.j+b.dataset.t]=1;ctx.act('prueba',{});ctx.obs('Frasco '+V[+b.dataset.j]+' — '+INT.find(t=>t[0]===b.dataset.t)[1]+': '+INC[CS[S.c][+b.dataset.j]][b.dataset.t]);draw()});
  cs.forEach((f,j)=>{$(el,'#z_s'+j).onchange=e=>{S.id[S.c+'-'+j]=e.target.value}});
  $(el,'#z_tl').innerHTML=tiles([['Casos resueltos',Object.keys(S.solved).length+' / '+CS.length,'#16a34a'],['Pruebas hechas',Object.keys(S.obs).length,'#2563eb']])};
 $(el,'#z_c').onchange=e=>{S.c=+e.target.value;$(el,'#z_fb').textContent='';draw()};
 $(el,'#z_ok').onclick=()=>{const cs=CS[S.c],f=$(el,'#z_fb');let n=0;cs.forEach((s,j)=>{const ok=S.id[S.c+'-'+j]===s;if(ok){n++;if(!S.ok[S.c+'-'+j]){S.ok[S.c+'-'+j]=1;ctx.act('identifica_ok',{})}}});
  if(n===cs.length){S.solved[S.c]=1;ctx.act('caso_ok',{});f.style.color='#16a34a';f.textContent='✅ ¡Caso resuelto! Identificaste los 4 frascos.';if(Object.keys(S.solved).length>=CS.length)ctx.act('todo_ok',{})}else{f.style.color='#dc2626';f.textContent='❌ '+n+' de 4 correctos. Haz más pruebas: el indicador separa ácidos, bases y neutros; AgNO₃ detecta cloruros y carbonatos.'}draw()};
 draw();return{reset(){S.obs={};S.id={};S.ok={};S.solved={};draw()}}};

/* ========== etapa 6a: cinética, colisiones, energía de activación y equilibrio químico ========== */
const RGJ=8.314,COLS=['#2563eb','#dc2626','#16a34a','#f59e0b','#7c3aed','#0d9488'];
const kU=n=>n===0?'M·s⁻¹':n===1?'s⁻¹':'M⁻'+SUPD[n-1]+'·s⁻¹';
const lnA=x=>Math.log(Math.max(x,1e-300));
/* VELOCIDAD: método de las velocidades iniciales */
E.velocidad=(el,cfg,ctx)=>{const SS=cfg.sist;const S={i:0,a:0,b:0,ok:{},A:0.2,B:0.2};
 const rate=(s,A,B)=>s.k*Math.pow(A,s.ord.a)*Math.pow(B,s.ord.b);
 const RT=genR(cfg.retos||[],(r,i)=>{const s=SS[r.i];
  if(r.t==='dup'){const o=s.ord[r.sp.toLowerCase()],f=Math.pow(r.f,o);return numReto(`En el sistema «${s.n}», si se multiplica por ${r.f} la concentración de <b>${r.sp}</b> (la otra no cambia), ¿por cuántas veces se multiplica la velocidad?`,f,[r.f,r.f*r.f*r.f,r.f*2,1],'veces',0,`Velocidad ∝ [${r.sp}]^${o}: ${r.f}^${o} = ${f}.`,i+2)}
  if(r.t==='v'){const v=rate(s,r.A,r.B);return numReto(`En «${s.n}» (v = k·[A]${SUPD[s.ord.a]}·[B]${SUPD[s.ord.b]}, k = ${fm(s.k,2)} ${kU(s.ord.a+s.ord.b)}), ¿cuál es la velocidad (M/s) con [A] = ${fm(r.A,2)} M y [B] = ${fm(r.B,2)} M?`,v,[v*2,v/2,s.k*(r.A+r.B),s.k*r.A*r.B],'sci',0,`v = ${fm(s.k,2)} × ${fm(r.A,2)}^${s.ord.a} × ${fm(r.B,2)}^${s.ord.b} = ${sciU(v)} M/s.`,i+3)}
  if(r.t==='ord'){const n=s.ord.a+s.ord.b;return numReto(`¿Cuál es el orden total de la reacción «${s.n}»?`,n,[n+1,Math.max(0,n-1),n+2,0],'',0,`Orden total = suma de los órdenes: ${s.ord.a} + ${s.ord.b} = ${n}.`,i+4)}
  return r});
 el.innerHTML=grid(panel('🎛️ Sistema de estudio',lab('Reacción (datos de un modelo didáctico)')+sel('vl_s',SS.map((s,i)=>[i,s.n]),0)+'<div id="vl_eq" style="margin-top:6px;font-size:13px"></div>'+lab('Orden respecto a A')+sel('vl_a',[[0,'0'],[1,'1'],[2,'2']],0)+lab('Orden respecto a B')+sel('vl_b',[[0,'0'],[1,'1'],[2,'2']],0)+btn('vl_ok','✔️ Comprobar órdenes','#0d9488')+'<div id="vl_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'+rng('vl_A','[A] para tu experimento (M)',0.1,0.5,S.A,0.1)+rng('vl_B','[B] para tu experimento (M)',0.1,0.5,S.B,0.1)+btn('vl_x','🧪 Hacer mi experimento','#1e63e9')+(RT.length?rhold('vl2'):'<div id="vl2_rt"></div><div id="vl2_fb"></div>')),
  panel('📋 Experimentos (velocidad inicial)','<div id="vl_tb" style="overflow:auto"></div>')+'<div id="vl_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'vl2');S.mine=[];
 const draw=()=>{const s=SS[S.i];$(el,'#vl_eq').innerHTML='<b>'+dsub(esc(s.eq))+'</b><br><span style="color:#64748b">Compara experimentos en los que solo cambia una concentración.</span>';
  const rows=s.exps.map((e,j)=>({n:j+1,A:e[0],B:e[1],v:rate(s,e[0],e[1])})).concat(S.mine.filter(m=>m.s===S.i).map((m,j)=>({n:'★'+(j+1),A:m.A,B:m.B,v:rate(s,m.A,m.B)})));
  $(el,'#vl_tb').innerHTML=`<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#f1f5f9"><th style="padding:5px">Exp.</th><th>[A] (M)</th><th>[B] (M)</th><th>Velocidad inicial (M/s)</th></tr>${rows.map(r=>`<tr style="border-top:1px solid #e2e8f0;text-align:center"><td style="padding:5px">${r.n}</td><td>${fm(r.A,2)}</td><td>${fm(r.B,2)}</td><td>${sciU(r.v)}</td></tr>`).join('')}</table>`+(S.ok[S.i]?`<div style="margin-top:8px;background:#f0fdf4;border-radius:10px;padding:8px;font-size:13.5px"><b>Ley de velocidad:</b> v = k·[A]${SUPD[s.ord.a]}·[B]${SUPD[s.ord.b]}<br><b>k</b> = v ÷ ([A]${SUPD[s.ord.a]}[B]${SUPD[s.ord.b]}) = ${fm(rate(s,s.exps[0][0],s.exps[0][1])/(Math.pow(s.exps[0][0],s.ord.a)*Math.pow(s.exps[0][1],s.ord.b)),2)} ${kU(s.ord.a+s.ord.b)}<br>Orden total = ${s.ord.a+s.ord.b}</div>`:'');
  $(el,'#vl_tl').innerHTML=tiles([['Sistemas resueltos',Object.keys(S.ok).length+' / '+SS.length,'#16a34a'],['Mis experimentos',S.mine.length,'#2563eb']])};
 $(el,'#vl_s').onchange=e=>{S.i=+e.target.value;$(el,'#vl_fb').textContent='';draw()};
 $(el,'#vl_A').oninput=e=>{S.A=+e.target.value;$(el,'#vl_Av').textContent=fm(S.A,1)};$(el,'#vl_B').oninput=e=>{S.B=+e.target.value;$(el,'#vl_Bv').textContent=fm(S.B,1)};
 $(el,'#vl_x').onclick=()=>{S.mine.push({s:S.i,A:S.A,B:S.B});ctx.act('experimento',{});ctx.obs('Experimento propio: [A]='+fm(S.A,1)+', [B]='+fm(S.B,1));draw()};
 $(el,'#vl_ok').onclick=()=>{const s=SS[S.i],f=$(el,'#vl_fb'),a=+$(el,'#vl_a').value,b=+$(el,'#vl_b').value;
  if(a===s.ord.a&&b===s.ord.b){f.style.color='#16a34a';f.textContent='✅ Correcto: orden '+a+' en A y orden '+b+' en B.';S.ok[S.i]=1;ctx.act('orden_ok',{});ctx.obs(s.n+': órdenes '+a+' y '+b);if(Object.keys(S.ok).length>=SS.length)ctx.act('todo_orden',{})}
  else{f.style.color='#dc2626';f.textContent='❌ Compara dos experimentos donde solo cambie '+(a!==s.ord.a?'[A]':'[B]')+': si al duplicarla la velocidad se duplica, el orden es 1; si se cuadruplica, es 2; si no cambia, es 0.'}draw()};
 draw();U.draw();return{reset(){S.ok={};S.mine=[];draw();U.reset()}}};

/* COLISIÓN: frecuencia de choques y fracción con energía suficiente */
E.colision=(el,cfg,ctx)=>{const S={T:300,n:20,Ea:50,rows:[],a:0};const N=40,r=rnd(77),P=Array.from({length:N},()=>({x:r()*400+10,y:r()*230+10,a:r()*6.283}));
 const frac=(T,Ea)=>Math.exp(-Ea*1000/(RGJ*T));const rel=(T,n,Ea)=>Math.pow(n/20,2)*Math.sqrt(T/300)*Math.exp(-Ea*1000/RGJ*(1/T-1/300));
 const RT=genR(cfg.retos||[],(q,i)=>{
  if(q.t==='frac'){const c=frac(q.T,q.Ea);return numReto(`Si la energía de activación es ${q.Ea} kJ/mol y T = ${q.T} K, ¿qué fracción de los choques tiene energía suficiente? (e^(−Ea/RT))`,c,[frac(q.T+100,q.Ea),c*1000,frac(q.T,q.Ea/2),Math.exp(-q.Ea/(RGJ*q.T))],'sci',0,`e^(−${q.Ea*1000}/(8,314 × ${q.T})) = ${sciU(c)}.`,i+2)}
  if(q.t==='tr'){const c=Math.exp(q.Ea*1000/RGJ*(1/q.T1-1/q.T2));return numReto(`Con Ea = ${q.Ea} kJ/mol, ¿cuántas veces aumenta la fracción de choques efectivos al subir de ${q.T1} K a ${q.T2} K?`,c,[q.T2/q.T1,Math.pow(q.T2/q.T1,2),c*2,1/c],'veces',2,`Razón = e^[(Ea/R)(1/T₁ − 1/T₂)] = ${fm(c,2)}.`,i+3)}
  if(q.t==='conc'){const c=q.f*q.f;return numReto(`En una reacción entre dos moléculas distintas A + B, si se multiplica por ${q.f} la concentración de ambas, ¿por cuántas veces aumenta la frecuencia de choques?`,c,[q.f,q.f*q.f*q.f,q.f*2,1],'veces',0,`Los choques A–B dependen de [A]·[B]: ${q.f} × ${q.f} = ${c}.`,i+4)}return q});
 el.innerHTML=grid(panel('🎛️ Condiciones',rng('co_T','Temperatura (K)',250,600,S.T,10)+rng('co_n','Partículas en la caja (concentración)',10,40,S.n,2)+rng('co_E','Energía de activación (kJ/mol)',20,100,S.Ea,5)+btn('co_r','📌 Registrar estas condiciones','#0d9488')+'<div id="co_o" style="margin-top:8px;font-size:13.5px;line-height:1.6"></div>'+(RT.length?rhold('co2'):'<div id="co2_rt"></div><div id="co2_fb"></div>')),
  panel('⚛️ Caja de partículas (ilustrativa)','<canvas id="co_cv" width="420" height="250" style="width:100%;background:#0f172a;border-radius:10px"></canvas>')+panel('📋 Registro','<div id="co_tb" style="overflow:auto"></div>')+'<div id="co_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'co2');
 const out=()=>{const f=frac(S.T,S.Ea),rl=rel(S.T,S.n,S.Ea);$(el,'#co_o').innerHTML=`Fracción con energía ≥ Ea: <b>${sciU(f)}</b><br>De cada mil millones de choques, unos <b>${fm(f*1e9,f*1e9<10?2:0)}</b> son efectivos.<br>Velocidad relativa (vs 300 K y 20 partículas): <b>${fm(rl,rl<10?2:1)} ×</b>`;
  $(el,'#co_tb').innerHTML=S.rows.length?`<table style="width:100%;border-collapse:collapse;font-size:12.5px"><tr style="background:#f1f5f9"><th style="padding:4px">T (K)</th><th>Partículas</th><th>Ea</th><th>Fracción</th><th>Vel. rel.</th></tr>${S.rows.map(x=>`<tr style="border-top:1px solid #e2e8f0;text-align:center"><td style="padding:4px">${x.T}</td><td>${x.n}</td><td>${x.Ea}</td><td>${sciU(frac(x.T,x.Ea))}</td><td>${fm(rel(x.T,x.n,x.Ea),2)}</td></tr>`).join('')}</table>`:'<div style="font-size:13px;color:#64748b">Aún no has registrado condiciones.</div>';
  $(el,'#co_tl').innerHTML=tiles([['Registros',S.rows.length,'#2563eb'],['Fracción efectiva',sciU(f),'#dc2626']])};
 const fr=frame(el,()=>{const x=$(el,'#co_cv').getContext('2d');x.fillStyle='#0f172a';x.fillRect(0,0,420,250);const sp=0.6+Math.sqrt(S.T/300)*1.6;
  for(let i=0;i<S.n;i++){const p=P[i];p.x+=Math.cos(p.a)*sp;p.y+=Math.sin(p.a)*sp;if(p.x<8||p.x>412){p.a=Math.PI-p.a;p.x=Math.max(8,Math.min(412,p.x))}if(p.y<8||p.y>242){p.a=-p.a;p.y=Math.max(8,Math.min(242,p.y))}
   x.fillStyle=i%2?'#38bdf8':'#fb923c';x.beginPath();x.arc(p.x,p.y,7,0,7);x.fill()}
  x.fillStyle='#e2e8f0';x.font='12px sans-serif';x.fillText('Más T → más rápido; más partículas → más choques',8,244)});
 [['co_T','T'],['co_n','n'],['co_E','Ea']].forEach(([id,k])=>$(el,'#'+id).oninput=e=>{S[k]=+e.target.value;$(el,'#'+id+'v').textContent=S[k];ctx.act('cambia',{});out()});
 $(el,'#co_r').onclick=()=>{S.rows.push({T:S.T,n:S.n,Ea:S.Ea});ctx.act('registro',{});ctx.obs('Registro: T='+S.T+' K, n='+S.n+', Ea='+S.Ea+' kJ/mol');out()};
 out();U.draw();return{reset(){S.rows=[];out();U.reset()},pause(){fr.stop()},start(){fr.run()}}};

/* ARRHENIUS: perfil de energía, catalizador y temperatura */
E.arrhenius=(el,cfg,ctx)=>{const RX_=cfg.rxs;const S={i:0,T:298,cat:0,rows:[]};
 const eaOf=()=>S.cat&&RX_[S.i].eac!=null?RX_[S.i].eac:RX_[S.i].ea;
 const rel=()=>Math.exp(-eaOf()*1000/(RGJ*S.T)+RX_[S.i].ea*1000/(RGJ*298));
 const RT=genR(cfg.retos||[],(q,i)=>{
  if(q.t==='ea2'){const e=RGJ*Math.log(q.k2/q.k1)/(1/q.T1-1/q.T2)/1000;return numReto(`La constante de velocidad pasa de ${fm(q.k1,3)} s⁻¹ a ${fm(q.k2,3)} s⁻¹ al subir de ${q.T1} K a ${q.T2} K. ¿Cuál es la energía de activación (kJ/mol)?`,e,[e*2,e/2,RGJ*Math.log(q.k2/q.k1)/1000,e*1.5],'kJ/mol',1,`ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂) → Ea = ${fm(e,1)} kJ/mol.`,i+2)}
  if(q.t==='cat'){const c=Math.exp((q.ea-q.eac)*1000/(RGJ*q.T));return numReto(`A ${q.T} K un catalizador baja la energía de activación de ${q.ea} a ${q.eac} kJ/mol. ¿Cuántas veces aumenta la velocidad?`,c,[(q.ea/q.eac),Math.exp((q.ea-q.eac)/(RGJ*q.T)),c/10,c*10],'veces',0,`Razón = e^[(Ea − Ea')/(RT)] = ${fm(c,0)}.`,i+3)}
  if(q.t==='rev'){const e=q.ea-q.dh;return numReto(`Una reacción tiene Ea = ${q.ea} kJ/mol y ΔH = ${q.dh} kJ/mol. ¿Cuál es la energía de activación de la reacción inversa (kJ/mol)?`,e,[q.ea+q.dh,q.ea,Math.abs(q.dh),e+q.ea],'kJ/mol',0,`Ea(inversa) = Ea(directa) − ΔH = ${q.ea} − (${q.dh}) = ${e}.`,i+4)}return q});
 el.innerHTML=grid(panel('🎛️ Reacción',lab('Reacción modelo')+sel('ar_r',RX_.map((r,i)=>[i,r.n]),0)+rng('ar_T','Temperatura (K)',250,500,S.T,10)+'<label style="display:flex;align-items:center;gap:6px;margin-top:8px;font-weight:800;font-size:13px"><input id="ar_k" type="checkbox"> Añadir catalizador</label>'+btn('ar_g','📌 Registrar','#0d9488')+'<div id="ar_o" style="margin-top:8px;font-size:13.5px;line-height:1.6"></div>'+(RT.length?rhold('ar2'):'<div id="ar2_rt"></div><div id="ar2_fb"></div>')),
  panel('📈 Perfil de energía (ilustrativo)','<canvas id="ar_cv" style="width:100%;display:block"></canvas>')+'<div id="ar_tb" style="overflow:auto"></div><div id="ar_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'ar2');
 const draw=()=>{const r=RX_[S.i],ea=eaOf(),dh=r.dh,sm=t=>t*t*(3-2*t),st=x=>sm(Math.max(0,Math.min(1,(x-0.55)/0.4))),prof=(x,E_)=>dh*st(x)+(E_-dh*st(0.4))*Math.exp(-Math.pow((x-0.4)/0.14,2));
  $(el,'#ar_k').disabled=r.eac==null;
  SIM.plot($(el,'#ar_cv'),{h:290,xmin:0,xmax:1,ymin:Math.min(0,dh)-10,ymax:r.ea+20,xl:'Avance de la reacción',yl:'Energía (kJ/mol)',series:[{f:x=>prof(x,r.ea),color:'#94a3b8',name:'Sin catalizador',dash:r.eac!=null&&S.cat?[6,4]:[]}].concat(S.cat&&r.eac!=null?[{f:x=>prof(x,r.eac),color:'#16a34a',name:'Con catalizador'}]:[]),hlines:[{y:ea,color:'#dc2626',label:'Ea = '+ea+' kJ/mol'},{y:dh,color:'#2563eb',label:'ΔH = '+dh+' kJ/mol'}]});
  $(el,'#ar_o').innerHTML=`Energía de activación usada: <b>${ea} kJ/mol</b><br>ΔH: <b>${dh} kJ/mol</b> (${dh<0?'exotérmica':'endotérmica'})<br>Ea de la reacción inversa: <b>${fm(ea-dh,0)} kJ/mol</b><br>Velocidad relativa (vs sin catalizador a 298 K): <b>${rel()<1000?fm(rel(),rel()<10?2:1):sciU(rel())} ×</b>`;
  $(el,'#ar_tb').innerHTML=S.rows.length?`<table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-top:6px"><tr style="background:#f1f5f9"><th style="padding:4px;text-align:left">Reacción</th><th>T (K)</th><th>Ea</th><th>Vel. rel.</th></tr>${S.rows.map(x=>`<tr style="border-top:1px solid #e2e8f0;text-align:center"><td style="padding:4px;text-align:left">${esc(x.n)}${x.c?' + cat.':''}</td><td>${x.T}</td><td>${x.ea}</td><td>${x.rel<1000?fm(x.rel,2):sciU(x.rel)}</td></tr>`).join('')}</table>`:'';
  $(el,'#ar_tl').innerHTML=tiles([['Registros',S.rows.length,'#2563eb']])};
 $(el,'#ar_r').onchange=e=>{S.i=+e.target.value;S.cat=0;$(el,'#ar_k').checked=false;ctx.act('cambia',{});draw()};
 $(el,'#ar_T').oninput=e=>{S.T=+e.target.value;$(el,'#ar_Tv').textContent=S.T;ctx.act('cambia',{});draw()};
 $(el,'#ar_k').onchange=e=>{S.cat=e.target.checked?1:0;if(S.cat)ctx.act('catalizador',{});ctx.act('cambia',{});draw()};
 $(el,'#ar_g').onclick=()=>{S.rows.push({n:RX_[S.i].n,T:S.T,ea:eaOf(),rel:rel(),c:S.cat&&RX_[S.i].eac!=null});ctx.act('registro',{});ctx.obs('Registro: '+RX_[S.i].n+' a '+S.T+' K, Ea '+eaOf());draw()};
 draw();U.draw();return{reset(){S.rows=[];S.cat=0;$(el,'#ar_k').checked=false;draw();U.reset()}}};

/* EQUILIBRIO: dinámico, Le Châtelier y constante (ICE) */
const eqSolve=(sp,c0,K)=>{let lo=-Infinity,hi=Infinity;sp.forEach((s,i)=>{if(s.nu>0)lo=Math.max(lo,-c0[i]/s.nu);else if(s.nu<0)hi=Math.min(hi,c0[i]/(-s.nu))});
 const lq=x=>sp.reduce((a,s,i)=>a+s.nu*lnA(c0[i]+s.nu*x),0),lk=Math.log(K);let a=lo,b=hi;for(let it=0;it<300;it++){const m=(a+b)/2;if(lq(m)<lk)a=m;else b=m}
 const x=(a+b)/2;return{x,c:sp.map((s,i)=>Math.max(0,c0[i]+s.nu*x))}};
const eqQ=(sp,c)=>Math.exp(sp.reduce((a,s,i)=>a+s.nu*lnA(c[i]),0));
const eqTxt=(sp)=>{const L=sp.filter(s=>s.nu<0).map(s=>(s.nu<-1?-s.nu+' ':'')+s.f).join(' + '),Rr=sp.filter(s=>s.nu>0).map(s=>(s.nu>1?s.nu+' ':'')+s.f).join(' + ');return dsub(L+' ⇌ '+Rr)};
const kexpr=(sp)=>{const nu=sp.filter(s=>s.nu>0).map(s=>'['+s.f+']'+(s.nu>1?SUPD[s.nu]:'')).join('·'),de=sp.filter(s=>s.nu<0).map(s=>'['+s.f+']'+(-s.nu>1?SUPD[-s.nu]:'')).join('·');return dsub(nu+' ÷ ('+de+')')};
E.equil=(el,cfg,ctx)=>{const SS=cfg.sist,M_=cfg.modo;const S={i:0};const fc=x=>x>=0.01?fm(x,3):sciU(x);
 const RTs=(cfg.retos||[]).map((q,i)=>{if(!q.t)return q;const s=SS[q.i||0];
  if(q.t==='K'){const K=eqQ(s.sp,q.c);return numReto(`Para ${eqTxt(s.sp)}, en equilibrio: ${s.sp.map((x,j)=>'['+x.f+'] = '+fm(q.c[j],2)+' M').join(', ')}. ¿Cuánto vale Kc?`,K,[1/K,K*2,K/2,K*K],'',3,`Kc = ${kexpr(s.sp)} = ${fm(K,3)}.`,i+2)}
  if(q.t==='Q'){const Q=eqQ(s.sp,q.c),d=Q<s.K?'Q < K: la reacción avanza hacia los productos':Q>s.K?'Q > K: la reacción retrocede hacia los reactivos':'Q = K: ya está en equilibrio',o=['Q < K: la reacción avanza hacia los productos','Q > K: la reacción retrocede hacia los reactivos','Q = K: ya está en equilibrio'];
   return{q:dsub(`Para ${eqTxt(s.sp)} (K = ${fm(s.K,3)}), la mezcla tiene ${s.sp.map((x,j)=>'['+x.f+'] = '+fm(q.c[j],2)+' M').join(', ')}. Calculas Q = ${fm(Q,3)}. ¿Qué ocurre?`),o,ok:o.indexOf(d),why:`Q = ${fm(Q,3)} frente a K = ${fm(s.K,3)}: ${d}.`}}
  if(q.t==='ice'){const c0=q.c0,r=eqSolve(s.sp,c0,s.K),j=q.sp;return numReto(`${eqTxt(s.sp)} con Kc = ${fm(s.K,s.K<0.1?4:2)}. Inicialmente ${s.sp.map((x,k)=>'['+x.f+'] = '+fm(c0[k],2)+' M').join(', ')}. ¿Cuál es [${s.sp[j].f}] en el equilibrio (M)?`,r.c[j],[c0[j],r.c[j]*2,r.c[j]/2,Math.abs(c0[j]-r.c[j])],'M',3,`Se plantea la tabla ICE y se resuelve Kc = ${kexpr(s.sp)}: [${s.sp[j].f}] = ${fm(r.c[j],3)} M.`,i+3)}return q});
 const RT=RTs;
 if(M_==='dinamico'){const T_=()=>SS[S.i];const NP=200;S.st=0;S.t=0;S.run={};S.starts={};
  el.innerHTML=grid(panel('🎛️ Sistema',lab('Reacción reversible (modelo)')+sel('eq_s',SS.map((s,i)=>[i,s.n]),0)+lab('Empezar con')+sel('eq_c',[[0,'Solo reactivos'],[1,'Solo productos']],0)+btn('eq_go','▶️ Simular','#0d9488')+rng('eq_t','Tiempo (s del modelo)',0,NP,0,1)+'<div id="eq_o" style="margin-top:8px;font-size:13.5px;line-height:1.6"></div>'+(RT.length?rhold('eq2'):'<div id="eq2_rt"></div><div id="eq2_fb"></div>')),
   panel('📈 Concentraciones','<canvas id="eq_p1" style="width:100%;display:block"></canvas>')+panel('⚖️ Velocidades directa e inversa','<canvas id="eq_p2" style="width:100%;display:block"></canvas>')+'<div id="eq_tl"></div>');
  const U=mkRetoUI(el,RT,ctx,'eq2');let TR=null;
  const sim=()=>{const s=T_(),sp=s.sp,kf=s.kf,kr=kf/s.K,c0=sp.map(x=>S.st?x.cp:x.c0),tm=s.tmax,h=tm/NP/10,rows=[];let xi=0;
   const cc=x=>sp.map((q,j)=>Math.max(0,c0[j]+q.nu*x)),fw=c=>kf*sp.reduce((a,q,j)=>q.nu<0?a*Math.pow(c[j],-q.nu):a,1),rv=c=>kr*sp.reduce((a,q,j)=>q.nu>0?a*Math.pow(c[j],q.nu):a,1),g=x=>{const c=cc(x);return fw(c)-rv(c)};
   for(let k=0;k<=NP;k++){const c=cc(xi);rows.push({t:k*tm/NP,c,f:fw(c),r:rv(c)});for(let m=0;m<10;m++){const k1=g(xi),k2=g(xi+h/2*k1),k3=g(xi+h/2*k2),k4=g(xi+h*k3);xi+=h/6*(k1+2*k2+2*k3+k4)}}return rows};
  const draw=()=>{const s=T_(),sp=s.sp;if(!TR)TR=sim();const k=+$(el,'#eq_t').value,row=TR[k],tm=s.tmax;
   const ymax=Math.max(...TR.map(r=>Math.max(...r.c)))*1.1,fmx=Math.max(...TR.map(r=>Math.max(r.f,r.r)))*1.1;
   SIM.plot($(el,'#eq_p1'),{h:240,xmin:0,xmax:tm,ymin:0,ymax,xl:'Tiempo (s)',yl:'Concentración (M)',series:sp.map((q,j)=>({pts:TR.map(r=>[r.t,r.c[j]]),color:COLS[j],name:q.f.replace(/(\d+)/g,m=>'₀₁₂₃₄₅₆₇₈₉'[+m]||m)})),vlines:[{x:row.t,color:'#94a3b8'}],pts:sp.map((q,j)=>({x:row.t,y:row.c[j],color:COLS[j],r:5}))});
   SIM.plot($(el,'#eq_p2'),{h:200,xmin:0,xmax:tm,ymin:0,ymax:fmx,xl:'Tiempo (s)',yl:'Velocidad (M/s)',series:[{pts:TR.map(r=>[r.t,r.f]),color:'#2563eb',name:'Directa'},{pts:TR.map(r=>[r.t,r.r]),color:'#dc2626',name:'Inversa'}],vlines:[{x:row.t,color:'#94a3b8'}]});
   const Q=eqQ(sp,row.c),eqn=Math.abs(Math.log(Q/s.K))<0.02;
   $(el,'#eq_o').innerHTML=`<b>${eqTxt(sp)}</b><br>t = ${fm(row.t,2)} s · Q = ${fc(Q)} · K = ${fc(s.K)}<br>${sp.map(q=>q.f).map((f,j)=>'['+dsub(f)+'] = '+fc(row.c[j])+' M').join('<br>')}<br><span style="color:${eqn?'#16a34a':'#b45309'};font-weight:800">${eqn?'✅ Equilibrio: las dos velocidades son iguales y las concentraciones ya no cambian.':'Todavía no hay equilibrio: Q ≠ K.'}</span>`;
   if(eqn&&!S.run[S.i+'-'+S.st]){S.run[S.i+'-'+S.st]=1;ctx.act('equilibrio',{});S.starts[S.st]=1;if(S.starts[0]&&S.starts[1])ctx.act('inicio_dos',{});ctx.obs(s.n+': equilibrio alcanzado desde '+(S.st?'productos':'reactivos'))}
   $(el,'#eq_tl').innerHTML=tiles([['Tiempo',fm(row.t,2)+' s','#2563eb'],['Q / K',fm(Q/s.K,2),eqn?'#16a34a':'#f59e0b']])};
  $(el,'#eq_s').onchange=e=>{S.i=+e.target.value;TR=null;$(el,'#eq_t').value=0;$(el,'#eq_tv').textContent=0;draw()};
  $(el,'#eq_c').onchange=e=>{S.st=+e.target.value;TR=null;$(el,'#eq_t').value=0;$(el,'#eq_tv').textContent=0;draw()};
  $(el,'#eq_go').onclick=()=>{TR=null;$(el,'#eq_t').value=0;$(el,'#eq_tv').textContent=0;ctx.act('corre',{});let k=0;const step=()=>{if(!el.isConnected)return;k=Math.min(NP,k+4);$(el,'#eq_t').value=k;$(el,'#eq_tv').textContent=k;draw();if(k<NP)requestAnimationFrame(step)};step()};
  $(el,'#eq_t').oninput=e=>{$(el,'#eq_tv').textContent=e.target.value;draw()};
  draw();U.draw();return{reset(){S.run={};S.starts={};TR=null;draw();U.reset()}}}
 if(M_==='lechat'){const s0=()=>SS[S.i];S.pert=0;S.n=0;
  el.innerHTML=grid(panel('🎛️ Sistema en equilibrio',lab('Reacción')+sel('lc_s',SS.map((s,i)=>[i,s.n]),0)+'<div id="lc_eq" style="margin:6px 0;font-size:13.5px;font-weight:700"></div><div id="lc_bt"></div><div id="lc_q" style="margin-top:10px"></div><div id="lc_fb" style="margin-top:8px;font-size:13px;font-weight:700"></div>'+(RT.length?rhold('eq2'):'<div id="eq2_rt"></div><div id="eq2_fb"></div>')),
   panel('📊 Concentraciones (M)','<div id="lc_bars"></div>')+'<div id="lc_tl"></div>');
  const U=mkRetoUI(el,RT,ctx,'eq2');
  const init=()=>{const s=s0();S.T=s.T0||298;S.K=s.K;S.c=eqSolve(s.sp,s.sp.map(x=>x.c0),S.K).c;S.pre=null;S.pend=null;S.after=null;S.V=1};
  init();S.cnt={n:0,ok:0};
  const bars=()=>{const s=s0(),sp=s.sp,a=S.pre||S.c,b=S.after||null,mx=Math.max(...a,...(b||[0]))*1.15||1;
   $(el,'#lc_bars').innerHTML=sp.map((q,j)=>`<div style="margin-bottom:8px"><b style="font-size:13px">${dsub(q.f)}</b><div style="display:flex;align-items:center;gap:6px;margin-top:2px"><div style="width:${Math.max(1,a[j]/mx*100)}%;height:16px;background:#94a3b8;border-radius:4px"></div><span style="font-size:12px">${fc(a[j])} ${b?'(antes)':''}</span></div>${b?`<div style="display:flex;align-items:center;gap:6px;margin-top:2px"><div style="width:${Math.max(1,b[j]/mx*100)}%;height:16px;background:${COLS[j]};border-radius:4px"></div><span style="font-size:12px">${fc(b[j])} (nuevo equilibrio)</span></div>`:''}</div>`).join('');
   $(el,'#lc_tl').innerHTML=tiles([['Perturbaciones',S.cnt.n,'#2563eb'],['Predicciones correctas',S.cnt.ok,'#16a34a'],['T actual',S.T+' K','#f59e0b']])};
  const draw=()=>{const s=s0(),sp=s.sp;$(el,'#lc_eq').innerHTML=eqTxt(sp)+(s.dH!=null?` · ΔH = ${s.dH} kJ (${s.dH>0?'endotérmica':'exotérmica'})`:'');
   const dn=sp.reduce((a,x)=>a+x.nu,0);
   $(el,'#lc_bt').innerHTML=sp.map((q,j)=>`<button class="sim-btn" data-p="add${j}" style="background:#0d9488">➕ Agregar ${dsub(q.f)}</button><button class="sim-btn" data-p="del${j}" style="background:#64748b">➖ Quitar ${dsub(q.f)}</button>`).join('')+(s.dH!=null?'<button class="sim-btn" data-p="hot" style="background:#dc2626">🔥 Calentar (+50 K)</button><button class="sim-btn" data-p="cold" style="background:#2563eb">❄️ Enfriar (−50 K)</button>':'')+'<button class="sim-btn" data-p="comp" style="background:#7c3aed">⬇️ Comprimir (V ÷ 2)</button><button class="sim-btn" data-p="exp" style="background:#7c3aed">⬆️ Expandir (V × 2)</button><button class="sim-btn" data-p="rst" style="background:#64748b">↺ Volver al inicio</button>';
   el.querySelectorAll('#lc_bt [data-p]').forEach(b=>b.onclick=()=>pert(b.dataset.p));bars()};
  const pert=p=>{const s=s0(),sp=s.sp;if(S.pend)return;const fbk=$(el,'#lc_fb');fbk.textContent='';$(el,'#lc_q').innerHTML='';
   if(p==='rst'){init();S.cnt.n=S.cnt.n;draw();return}
   let c=S.c.slice(),K2=S.K,T2=S.T,txt='';
   if(p.startsWith('add')){const j=+p.slice(3);c[j]+=Math.max(0.05,0.5*c[j]);txt='Agregaste '+sp[j].f}
   else if(p.startsWith('del')){const j=+p.slice(3);c[j]=c[j]*0.6;txt='Quitaste parte de '+sp[j].f}
   else if(p==='hot'||p==='cold'){T2=S.T+(p==='hot'?50:-50);K2=S.K*Math.exp(-s.dH*1000/RGJ*(1/T2-1/S.T));txt=p==='hot'?'Calentaste el sistema':'Enfriaste el sistema'}
   else if(p==='comp'){c=c.map(x=>x*2);txt='Comprimiste el recipiente (el volumen se reduce a la mitad)'}
   else if(p==='exp'){c=c.map(x=>x/2);txt='Expandiste el recipiente (el volumen se duplica)'}
   const Q=eqQ(sp,c),d=Math.abs(Math.log(Q/K2))<1e-9?'none':Q<K2?'right':'left';S.pre=c;S.pend={c,K2,T2,d,txt,Q};S.cnt.n++;ctx.act('perturba',{});
   $(el,'#lc_q').innerHTML=`<div style="background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:8px"><b>${txt}.</b> ¿Hacia dónde se desplaza el equilibrio?<div style="margin-top:6px"><button class="sim-btn" data-a="right" style="background:#7c3aed">→ Hacia los productos</button><button class="sim-btn" data-a="left" style="background:#7c3aed">← Hacia los reactivos</button><button class="sim-btn" data-a="none" style="background:#7c3aed">No se desplaza</button></div></div>`;
   el.querySelectorAll('#lc_q [data-a]').forEach(b=>b.onclick=()=>{const ok=b.dataset.a===d,pd=S.pend;if(ok){S.cnt.ok++;ctx.act('predice_ok',{})}
    const r=eqSolve(sp,pd.c,pd.K2);S.after=r.c;S.c=r.c;S.K=pd.K2;S.T=pd.T2;S.pend=null;const nm={right:'hacia los productos →',left:'hacia los reactivos ←',none:'no se desplaza'}[d];
    fbk.style.color=ok?'#16a34a':'#dc2626';fbk.textContent=(ok?'✅ ':'❌ ')+'El equilibrio se desplaza '+nm+(d==='none'?'':' (Q '+(d==='right'?'<':'>')+' K). ')+(d==='none'?' Al comprimir o expandir con igual número de moles de gas a cada lado, Q no cambia.':'');
    ctx.obs(pd.txt+' → '+nm+(ok?' (acierto)':' (error)'));$(el,'#lc_q').innerHTML='';bars();
    const dn2=sp.reduce((a,x)=>a+x.nu,0);if(dn2===0&&(p==='comp'||p==='exp'))fbk.textContent+=' (aquí Δn de gases = 0)'})};
  $(el,'#lc_s').onchange=e=>{S.i=+e.target.value;init();$(el,'#lc_fb').textContent='';$(el,'#lc_q').innerHTML='';draw()};
  draw();U.draw();return{reset(){S.cnt={n:0,ok:0};init();draw();U.reset()}}}
 if(M_==='k'){const s0=()=>SS[S.i];S.c0=SS[0].sp.map(x=>x.c0);S.seen={};
  el.innerHTML=grid(panel('🎛️ Condiciones iniciales',lab('Reacción')+sel('ek_s',SS.map((s,i)=>[i,s.n]),0)+'<div id="ek_sl"></div>'+(RT.length?rhold('eq2'):'<div id="eq2_rt"></div><div id="eq2_fb"></div>')),panel('🧮 Tabla ICE','<div id="ek_tb" style="overflow:auto"></div>')+'<div id="ek_tl"></div>');
  const U=mkRetoUI(el,RT,ctx,'eq2');
  const sl=()=>{const s=s0();$(el,'#ek_sl').innerHTML=s.sp.map((q,j)=>rng('ek_'+j,'Inicial de '+dsub(q.f)+' (M)',0,2,S.c0[j],0.05)).join('');s.sp.forEach((q,j)=>$(el,'#ek_'+j).oninput=e=>{S.c0[j]=+e.target.value;$(el,'#ek_'+j+'v').textContent=fm(S.c0[j],2);ctx.act('cambia',{});draw()})};
  const draw=()=>{const s=s0(),sp=s.sp;if(!sp.some(q=>q.nu<0&&S.c0[sp.indexOf(q)]>0)&&!sp.some(q=>q.nu>0&&S.c0[sp.indexOf(q)]>0)){$(el,'#ek_tb').innerHTML='<div style="color:#b45309;font-weight:700">Pon alguna concentración inicial mayor que cero.</div>';return}
   const r=eqSolve(sp,S.c0,s.K),zp=sp.some((q,j)=>q.nu>0&&S.c0[j]===0),zr=sp.some((q,j)=>q.nu<0&&S.c0[j]===0),Q0=eqQ(sp,S.c0.map(x=>Math.max(x,1e-12)));S.seen[S.i]=1;
   $(el,'#ek_tb').innerHTML=`<div style="font-size:14px;font-weight:800;margin-bottom:6px">${eqTxt(sp)}</div><table style="width:100%;border-collapse:collapse;font-size:13px;text-align:center"><tr style="background:#f1f5f9"><th style="padding:5px"></th>${sp.map(q=>`<th>${dsub(q.f)}</th>`).join('')}</tr><tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;font-weight:800">Inicial</td>${S.c0.map(x=>`<td>${fm(x,3)}</td>`).join('')}</tr><tr style="border-top:1px solid #e2e8f0"><td style="padding:5px;font-weight:800">Cambio</td>${sp.map(q=>`<td>${q.nu>0?'+':'−'}${Math.abs(q.nu)==1?'':Math.abs(q.nu)}x</td>`).join('')}</tr><tr style="border-top:1px solid #e2e8f0;background:#f0fdf4"><td style="padding:5px;font-weight:800">Equilibrio</td>${r.c.map(x=>`<td><b>${fm(x,3)}</b></td>`).join('')}</tr></table><div style="margin-top:8px;font-size:13.5px;line-height:1.6">x = <b>${fm(r.x,4)}</b> M<br>Kc = ${kexpr(sp)} = <b>${fc(s.K)}</b><br>Q inicial = <b>${zp&&!zr?'0 (todavía no hay algún producto)':zr&&!zp?'muy grande (falta algún reactivo)':fc(Q0)}</b> → ${zp&&!zr?'avanza hacia los productos':zr&&!zp?'retrocede hacia los reactivos':Q0<s.K?'avanza hacia los productos':Q0>s.K?'retrocede hacia los reactivos':'ya está en equilibrio'}<br>Comprobación: Q en el equilibrio = ${fc(eqQ(sp,r.c))}</div>`;
   if(Object.keys(S.seen).length>=2)ctx.act('sistema_nuevo',{});$(el,'#ek_tl').innerHTML=tiles([['Sistemas vistos',Object.keys(S.seen).length,'#2563eb'],['Kc',fc(s.K),'#16a34a']])};
  $(el,'#ek_s').onchange=e=>{S.i=+e.target.value;S.c0=SS[S.i].sp.map(x=>x.c0);sl();ctx.act('cambia',{});draw()};
  sl();draw();U.draw();return{reset(){S.seen={};S.c0=s0().sp.map(x=>x.c0);sl();draw();U.reset()}}}
 throw new Error('modo de equilibrio desconocido')};

/* ========== etapa 6b: ácido-base, buffer, valoración, electroquímica, integrador ========== */
const lg=Math.log10,KW=1e-14,FAR=96485;
const phW=(x)=>x===0?7:x>0?-lg(x/100):14+lg(-x/100);
/* ACIDOB: equilibrio de un ácido o base débil */
E.acidob=(el,cfg,ctx)=>{const AS=cfg.sust;const S={i:2,pc:1,seen:{}};
 const calc=(a,C)=>{const K=a.Ka||a.Kb,x=(-K+Math.sqrt(K*K+4*K*C))/2,pH=a.Ka?-lg(x):14+lg(x);return{x,pH,pct:x/C*100,pOH:14-pH}};
 const RT=genR(cfg.retos||[],(q,i)=>{const a=AS[q.i||0],C=Math.pow(10,-(q.pc||0)),r=q.t==='Ka'?null:calc(a,C);
  if(q.t==='pH')return numReto(`¿Cuál es el pH de una solución ${fm(C,C<0.01?3:2)} M de ${a.n} (${a.Ka?'Ka':'Kb'} = ${sciU(a.Ka||a.Kb)})?`,r.pH,[a.Ka?-lg(C):14+lg(C),r.pH+1,r.pH-1,7],'',2,`x = (−K + √(K² + 4KC))/2 = ${sciU(r.x)} M → pH = ${fm(r.pH,2)}.`,i+2)
  if(q.t==='pct')return numReto(`¿Qué porcentaje de ${a.n} está ionizado en una solución ${fm(C,C<0.01?3:2)} M?`,r.pct,[r.pct*10,r.pct/10,100,r.pct*2],'%',2,`% = x/C × 100 = ${sciU(r.x)} / ${fm(C,C<0.01?3:2)} × 100 = ${fm(r.pct,2)} %.`,i+3)
  if(q.t==='Ka'){const x=Math.pow(10,-q.pH),K=x*x/(q.C-x);return numReto(`Una solución ${fm(q.C,2)} M de un ácido débil HA tiene pH = ${fm(q.pH,2)}. ¿Cuánto vale Ka?`,K,[x*x/q.C*10,x/q.C,K*10,K/10],'sci',0,`[H⁺] = 10^(−${fm(q.pH,2)}) = ${sciU(x)} M; Ka = x²/(C − x) = ${sciU(K)}.`,i+4)}return q});
 el.innerHTML=grid(panel('🎛️ Ácido o base débil',lab('Sustancia')+sel('ab_s',AS.map((a,i)=>[i,a.n+' ('+(a.Ka?'Ka':'Kb')+' = '+sciU(a.Ka||a.Kb)+')']),S.i)+rng('ab_c','Concentración: 10^(−x) M, con x =',0,3,S.pc,0.25)+'<div id="ab_o" style="margin-top:8px;font-size:13.5px;line-height:1.6"></div>'+(RT.length?rhold('ab2'):'<div id="ab2_rt"></div><div id="ab2_fb"></div>')),
  panel('🔬 100 moléculas disueltas (ilustrativo)','<div id="ab_g"></div>')+'<div id="ab_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'ab2');
 const draw=()=>{const a=AS[S.i],C=Math.pow(10,-S.pc),r=calc(a,C),n=Math.max(r.pct>0?1:0,Math.round(r.pct));S.seen[S.i]=1;
  $(el,'#ab_o').innerHTML=`C = <b>${fm(C,C<0.01?4:3)} M</b><br>[${a.Ka?'H⁺':'OH⁻'}] = <b>${sciU(r.x)} M</b><br>pH = <b>${fm(r.pH,2)}</b> · pOH = ${fm(r.pOH,2)}<br>Ionización: <b>${fm(r.pct,r.pct<1?3:1)} %</b><br><span style="font-size:12px;color:#64748b">Si fuera un ${a.Ka?'ácido':'base'} fuerte de la misma concentración, el pH sería ${fm(a.Ka?-lg(C):14+lg(C),2)}.</span>`;
  $(el,'#ab_g').innerHTML=`<div style="display:grid;grid-template-columns:repeat(10,1fr);gap:4px;max-width:340px">${Array.from({length:100},(_,k)=>`<div style="aspect-ratio:1;border-radius:50%;background:${k<n?'#f59e0b':'#cbd5e1'}"></div>`).join('')}</div><div style="font-size:12px;margin-top:6px"><span style="color:#f59e0b">●</span> ionizadas (${n} de 100) · <span style="color:#94a3b8">●</span> sin ionizar</div>`;
  $(el,'#ab_tl').innerHTML=tiles([['pH',fm(r.pH,2),'#2563eb'],['% ionizado',fm(r.pct,r.pct<1?2:1),'#f59e0b'],['Sustancias vistas',Object.keys(S.seen).length,'#16a34a']])};
 $(el,'#ab_s').onchange=e=>{S.i=+e.target.value;ctx.act('cambia',{});if(Object.keys(S.seen).length>=2)ctx.act('compara',{});draw()};
 $(el,'#ab_c').oninput=e=>{S.pc=+e.target.value;$(el,'#ab_cv').textContent=fm(S.pc,2);ctx.act('cambia',{});draw()};
 draw();U.draw();return{reset(){S.seen={};draw();U.reset()}}};

/* BUFFER: Henderson–Hasselbalch y capacidad amortiguadora */
E.buffer=(el,cfg,ctx)=>{const SS=cfg.sist;const S={i:0,ha:20,a:20,add:0,seen:{}};
 const phB=(s,ha,a,add)=>{if(add>=0){const A=a-add,H=ha+add;if(A>0)return{pH:s.pKa+lg(A/H),ex:0};return{pH:-lg((add-a)/100),ex:1}}const b=-add,H=ha-b,A=a+b;if(H>0)return{pH:s.pKa+lg(A/H),ex:0};return{pH:14+lg((b-ha)/100),ex:1}};
 const RT=genR(cfg.retos||[],(q,i)=>{const s=SS[q.i];
  if(q.t==='hh'){const p=s.pKa+lg(q.a/q.ha);return numReto(`Un buffer de ${s.n} tiene ${q.ha} mmol de ${s.ha} y ${q.a} mmol de ${s.a}. ¿Cuál es su pH? (pKa = ${fm(s.pKa,2)})`,p,[s.pKa,p+1,p-1,s.pKa+lg(q.ha/q.a)],'',2,`pH = pKa + log([base]/[ácido]) = ${fm(s.pKa,2)} + log(${q.a}/${q.ha}) = ${fm(p,2)}.`,i+2)}
  if(q.t==='add'){const r=phB(s,q.ha,q.a,q.add),w=phW(q.add);return numReto(`Al buffer de ${s.n} (${q.ha} mmol de ${s.ha} y ${q.a} mmol de ${s.a}, 100 mL) se le agregan ${Math.abs(q.add)} mmol de ${q.add>0?'ácido fuerte (HCl)':'base fuerte (NaOH)'}. ¿Cuál es el nuevo pH?`,r.pH,[w,s.pKa,r.pH+(q.add>0?-1:1),s.pKa+lg(q.a/q.ha)],'',2,`${q.add>0?'El ácido consume base':'La base consume ácido'}: ácido = ${q.ha+q.add} mmol, base = ${q.a-q.add} mmol → pH = ${fm(r.pH,2)}.`,i+3)}
  if(q.t==='ratio'){const r=Math.pow(10,q.pH-s.pKa);return numReto(`Para tener un buffer de ${s.n} con pH = ${fm(q.pH,2)} (pKa = ${fm(s.pKa,2)}), ¿qué relación [${s.a}]/[${s.ha}] se necesita?`,r,[1/r,r*10,q.pH/s.pKa,r/10],'',2,`[base]/[ácido] = 10^(pH − pKa) = 10^(${fm(q.pH-s.pKa,2)}) = ${fm(r,2)}.`,i+4)}return q});
 el.innerHTML=grid(panel('🎛️ Buffer (100 mL)',lab('Sistema amortiguador')+sel('bf_s',SS.map((s,i)=>[i,s.n]),0)+rng('bf_h','Ácido débil (mmol)',5,50,S.ha,1)+rng('bf_a','Base conjugada (mmol)',5,50,S.a,1)+rng('bf_d','Agregado (mmol): negativo = NaOH, positivo = HCl',-40,40,0,1)+'<div id="bf_o" style="margin-top:8px;font-size:13.5px;line-height:1.6"></div>'+(RT.length?rhold('bf2'):'<div id="bf2_rt"></div><div id="bf2_fb"></div>')),
  panel('📈 pH al agregar ácido o base','<canvas id="bf_cv" style="width:100%;display:block"></canvas>')+'<div id="bf_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'bf2');
 const draw=()=>{const s=SS[S.i],r=phB(s,S.ha,S.a,S.add),w=phW(S.add);S.seen[S.i]=1;
  SIM.plot($(el,'#bf_cv'),{h:290,xmin:-40,xmax:40,ymin:0,ymax:14,xl:'Agregado (mmol): ← NaOH · HCl →',yl:'pH',series:[{f:x=>phB(s,S.ha,S.a,x).pH,color:'#16a34a',name:'Buffer'},{f:x=>phW(x),color:'#dc2626',name:'Agua pura'}],hlines:[{y:s.pKa,color:'#94a3b8',label:'pKa = '+fm(s.pKa,2)}],pts:[{x:S.add,y:Math.max(0,Math.min(14,r.pH)),color:'#16a34a',fill:'#16a34a',label:'buffer '+fm(r.pH,2)},{x:S.add,y:Math.max(0,Math.min(14,w)),color:'#dc2626',fill:'#dc2626',label:'agua '+fm(w,2),below:1}]});
  $(el,'#bf_o').innerHTML=`pH del buffer: <b>${fm(r.pH,2)}</b>${r.ex?' <span style="color:#dc2626">(¡el buffer se agotó!)</span>':''}<br>pH del agua con lo mismo: <b>${fm(w,2)}</b><br>Relación base/ácido: ${r.ex?'—':fm((S.a-S.add)/(S.ha+S.add),2)}<br><span style="font-size:12px;color:#64748b">El buffer resiste cambios mientras queden ácido y base en cantidad suficiente.</span>`;
  $(el,'#bf_tl').innerHTML=tiles([['pH buffer',fm(r.pH,2),'#16a34a'],['pH agua',fm(w,2),'#dc2626'],['Sistemas vistos',Object.keys(S.seen).length,'#2563eb']])};
 $(el,'#bf_s').onchange=e=>{S.i=+e.target.value;ctx.act('cambia',{});draw()};
 [['bf_h','ha'],['bf_a','a']].forEach(([id,k])=>$(el,'#'+id).oninput=e=>{S[k]=+e.target.value;$(el,'#'+id+'v').textContent=S[k];ctx.act('cambia',{});draw()});
 $(el,'#bf_d').oninput=e=>{S.add=+e.target.value;$(el,'#bf_dv').textContent=S.add;ctx.act('agrega',{});if(S.add!==0){const r=phB(SS[S.i],S.ha,S.a,S.add);if(!r.ex)ctx.act('resiste',{});else ctx.act('agota',{})}draw()};
 draw();U.draw();return{reset(){S.seen={};draw();U.reset()}}};

/* VALORA: valoración ácido-base con curva exacta */
const INDS=[['Fenolftaleína',8.2,10.0],['Azul de bromotimol',6.0,7.6],['Rojo de metilo',4.4,6.2],['Naranja de metilo',3.1,4.4]];
const phTit=(s,Vb)=>{const Vt=s.Va+Vb,CA=s.Ca*s.Va/Vt,Na=s.Cb*Vb/Vt,f=h=>h+Na-KW/h-(s.Ka?CA*s.Ka/(s.Ka+h):CA);let a=-14,b=0;for(let i=0;i<100;i++){const m=(a+b)/2;if(f(Math.pow(10,m))>0)b=m;else a=m}return-(a+b)/2};
E.valora=(el,cfg,ctx)=>{const SS=cfg.sist;const S={i:0,Vb:0,ind:0,ok:{},eq:{}};
 const veq=s=>s.Ca*s.Va/s.Cb;
 const RT=genR(cfg.retos||[],(q,i)=>{const s=SS[q.i],v=veq(s);
  if(q.t==='veq')return numReto(`Se valoran ${s.Va} mL de ácido ${fm(s.Ca,2)} M con NaOH ${fm(s.Cb,2)} M. ¿Qué volumen de base (mL) se necesita para llegar al punto de equivalencia?`,v,[v*2,v/2,s.Va*s.Cb/s.Ca+s.Va,s.Va],'mL',1,`n(ácido) = ${fm(s.Ca,2)} × ${s.Va} mL = ${fm(s.Ca*s.Va,2)} mmol → V(base) = ${fm(s.Ca*s.Va,2)} ÷ ${fm(s.Cb,2)} = ${fm(v,1)} mL.`,i+2)
  if(q.t==='ph0'){const p=phTit(s,0);return numReto(`¿Cuál es el pH inicial (antes de agregar base) de ${s.n}?`,p,[7,p+2,p-1,14-p],'',2,`${s.Ka?'Ácido débil: x = √(Ka·C) aprox. → pH = '+fm(p,2):'Ácido fuerte: pH = −log('+fm(s.Ca,2)+') = '+fm(p,2)}.`,i+3)}
  if(q.t==='pheq'){const p=phTit(s,v);return numReto(`¿Cuál es el pH en el punto de equivalencia de ${s.n}?`,p,[7,p-2,p+2,s.pKa||3],'',2,`${s.Ka?'En el equivalente solo queda la base conjugada del ácido débil (A⁻), que es básica: pH = '+fm(p,2):'Sal neutra de ácido y base fuertes: pH = 7,00'}.`,i+4)}
  if(q.t==='half'){const p=phTit(s,v/2);return numReto(`En ${s.n}, ¿cuánto vale el pH cuando se ha agregado la mitad del volumen de equivalencia? (pKa = ${fm(s.pKa,2)})`,p,[7,p+2,p-2,s.pKa+1],'',2,`A la mitad de la valoración [HA] = [A⁻] → pH = pKa = ${fm(s.pKa,2)}.`,i+5)}return q});
 el.innerHTML=grid(panel('🎛️ Valoración',lab('Sistema')+sel('va_s',SS.map((s,i)=>[i,s.n]),0)+'<div id="va_i" style="font-size:12.5px;color:#475569;margin:6px 0"></div><div id="va_sl"></div>'+lab('Indicador')+sel('va_n',INDS.map((x,i)=>[i,x[0]+' (viraje '+fm(x[1],1)+'–'+fm(x[2],1)+')']),0)+'<div id="va_o" style="margin-top:8px;font-size:13.5px;line-height:1.6"></div>'+(RT.length?rhold('va2'):'<div id="va2_rt"></div><div id="va2_fb"></div>')),
  panel('📈 Curva de valoración','<canvas id="va_cv" style="width:100%;display:block"></canvas>')+'<div id="va_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'va2');
 const sl=()=>{const s=SS[S.i],v=veq(s);$(el,'#va_sl').innerHTML=rng('va_v','Volumen de NaOH agregado (mL)',0,2*v,S.Vb,0.1);$(el,'#va_v').oninput=e=>{S.Vb=+e.target.value;$(el,'#va_vv').textContent=fm(S.Vb,1);ctx.act('agrega',{});draw()}};
 const good=(s)=>{const v=veq(s),a=phTit(s,v-0.05),b=phTit(s,v+0.05);return x=>x[1]>=a-0.05&&x[2]<=b+0.1};
 const draw=()=>{const s=SS[S.i],v=veq(s),p=phTit(s,S.Vb),pe=phTit(s,v),g=good(s)(INDS[S.ind]),near=Math.abs(S.Vb-v)<=0.05;
  $(el,'#va_i').innerHTML=dsub(esc(s.n))+': '+s.Va+' mL de ácido '+fm(s.Ca,2)+' M, base '+fm(s.Cb,2)+' M. '+(s.Ka?'Ka = '+sciU(s.Ka)+' (pKa '+fm(s.pKa,2)+').':'Ácido fuerte.');
  SIM.plot($(el,'#va_cv'),{h:290,xmin:0,xmax:2*v,ymin:0,ymax:14,xl:'Volumen de base (mL)',yl:'pH',series:[{f:x=>phTit(s,x),color:'#2563eb'}],vlines:[{x:v,color:'#16a34a',label:'equivalencia'}],hlines:[{y:INDS[S.ind][1],color:'#f59e0b'},{y:INDS[S.ind][2],color:'#f59e0b'}],pts:[{x:S.Vb,y:p,color:'#dc2626',fill:'#dc2626',label:'pH '+fm(p,2)}]});
  $(el,'#va_o').innerHTML=`Volumen: <b>${fm(S.Vb,1)} mL</b> · pH = <b>${fm(p,2)}</b><br>Estado: <b>${near?'punto de equivalencia ✅':S.Vb<v?'antes de la equivalencia':'después de la equivalencia'}</b><br>V(equivalencia) = ${fm(v,1)} mL · pH de equivalencia = ${fm(pe,2)}<br>Indicador elegido: <b style="color:${g?'#16a34a':'#dc2626'}">${g?'adecuado (cambia de color justo en el salto de pH)':'poco adecuado (su viraje cae fuera del salto vertical)'}</b>`;
  if(near&&!S.eq[S.i]){S.eq[S.i]=1;ctx.act('equivalencia',{});ctx.obs(s.n+': equivalencia en '+fm(S.Vb,1)+' mL, pH '+fm(p,2))}
  if(g&&!S.ok[S.i+'-'+S.ind]){S.ok[S.i+'-'+S.ind]=1;ctx.act('indicador_ok',{});ctx.obs(s.n+': indicador '+INDS[S.ind][0]+' adecuado')}
  $(el,'#va_tl').innerHTML=tiles([['pH',fm(p,2),'#2563eb'],['Equivalencias halladas',Object.keys(S.eq).length+' / '+SS.length,'#16a34a']])};
 $(el,'#va_s').onchange=e=>{S.i=+e.target.value;S.Vb=0;sl();draw()};
 $(el,'#va_n').onchange=e=>{S.ind=+e.target.value;ctx.act('cambia',{});draw()};
 sl();draw();U.draw();return{reset(){S.eq={};S.ok={};S.Vb=0;sl();draw();U.reset()}}};

/* GALV: celdas galvánicas con potenciales estándar y ecuación de Nernst */
const EO={Li:{ion:'Li⁺',ic:1,ne:1,pr:'Li',pc:1,E:-3.04,n:'Litio'},Mg:{ion:'Mg²⁺',ic:1,ne:2,pr:'Mg',pc:1,E:-2.37,n:'Magnesio'},Al:{ion:'Al³⁺',ic:1,ne:3,pr:'Al',pc:1,E:-1.66,n:'Aluminio'},Zn:{ion:'Zn²⁺',ic:1,ne:2,pr:'Zn',pc:1,E:-0.76,n:'Zinc'},Fe:{ion:'Fe²⁺',ic:1,ne:2,pr:'Fe',pc:1,E:-0.44,n:'Hierro'},Ni:{ion:'Ni²⁺',ic:1,ne:2,pr:'Ni',pc:1,E:-0.26,n:'Níquel'},Pb:{ion:'Pb²⁺',ic:1,ne:2,pr:'Pb',pc:1,E:-0.13,n:'Plomo'},H:{ion:'H⁺',ic:2,ne:2,pr:'H₂',pc:1,E:0.00,n:'Hidrógeno'},Cu:{ion:'Cu²⁺',ic:1,ne:2,pr:'Cu',pc:1,E:0.34,n:'Cobre'},Ag:{ion:'Ag⁺',ic:1,ne:1,pr:'Ag',pc:1,E:0.80,n:'Plata'}};
const lcm=(a,b)=>a*b/gcd(a,b);
const celda=(x,y,cx,cy)=>{const A=EO[x],B=EO[y],an=A.E<B.E?x:y,ca=an===x?y:x,a=EO[an],c=EO[ca],n=lcm(a.ne,c.ne),ka=n/a.ne,kc=n/c.ne,E0=c.E-a.E,ca_=an===x?cx:cy,cc=an===x?cy:cx,Q=Math.pow(ca_,ka*a.ic)/Math.pow(cc,kc*c.ic),En=E0-0.0592/n*lg(Q),co=k=>k===1?'':k;
 return{an,ca,a,c,n,ka,kc,E0,Q,E:En,rx:`${co(kc*c.ic)}${c.ion} + ${co(ka*a.pc)}${a.pr} → ${co(kc*c.pc)}${c.pr} + ${co(ka*a.ic)}${a.ion}`,not:`${a.pr}|${a.ion} ‖ ${c.ion}|${c.pr}`}};
E.galv=(el,cfg,ctx)=>{const L=cfg.metales;const S={a:L[0],b:L[1],ca:1,cb:1,seen:{}};const CS=[[0.01,'0,01 M'],[0.1,'0,1 M'],[1,'1 M']];
 const RT=genR(cfg.retos||[],(q,i)=>{const r=celda(q.a,q.b,q.ca||1,q.cb||1),A=EO[q.a].n,B=EO[q.b].n;
  if(q.t==='E0')return numReto(`Una pila une ${A} (${EO[q.a].E.toFixed(2).replace('.',',')} V) y ${B} (${EO[q.b].E.toFixed(2).replace('.',',')} V), ambos con potencial de reducción estándar. ¿Cuál es el potencial estándar de la celda?`,r.E0,[EO[q.a].E+EO[q.b].E,r.E0/2,r.E0*2,-r.E0],'V',2,`E°celda = E°cátodo − E°ánodo = ${fm(EO[r.ca].E,2)} − (${fm(EO[r.an].E,2)}) = ${fm(r.E0,2)} V.`,i+2)
  if(q.t==='cat'){const o=[EO[q.a].n,EO[q.b].n,'Ninguno: no se produce reacción'];return{q:`En una pila de ${A} y ${B}, ¿cuál metal funciona como cátodo (donde ocurre la reducción)?`,o,ok:o.indexOf(EO[r.ca].n),why:`El cátodo es el de mayor potencial de reducción: ${EO[r.ca].n} (${fm(EO[r.ca].E,2)} V). El ánodo, ${EO[r.an].n}, se oxida y pierde masa.`}}
  if(q.t==='nern')return numReto(`Pila ${A}–${B} con [${EO[q.a].ion}] = ${fm(q.ca,2)} M y [${EO[q.b].ion}] = ${fm(q.cb,2)} M a 25 °C. ¿Cuánto vale el potencial de la celda? (E = E° − (0,0592/n)·log Q)`,r.E,[r.E0,r.E0+(r.E0-r.E),r.E0-0.0592*lg(r.Q),r.E0*1.1],'V',3,`n = ${r.n}; Q = ${sciU(r.Q)}; E = ${fm(r.E0,2)} − (0,0592/${r.n}) × log(${sciU(r.Q)}) = ${fm(r.E,3)} V.`,i+3)
  if(q.t==='n')return numReto(`En la pila ${A}–${B}, ¿cuántos electrones se transfieren en la reacción global balanceada?`,r.n,[r.n+1,r.n*2,1,r.a.ne+r.c.ne],'',0,`Se busca el mínimo común múltiplo de los electrones de cada semirreacción: ${r.a.ne} y ${r.c.ne} → ${r.n}.`,i+4)
  return q});
 el.innerHTML=grid(panel('🎛️ Semiceldas',lab('Electrodo 1')+sel('gv_a',L.map(k=>[k,EO[k].n+' ('+EO[k].ion+'/'+EO[k].pr+')']),S.a)+lab('Concentración del ion 1')+sel('gv_ca',CS,1)+lab('Electrodo 2')+sel('gv_b',L.map(k=>[k,EO[k].n+' ('+EO[k].ion+'/'+EO[k].pr+')']),S.b)+lab('Concentración del ion 2')+sel('gv_cb',CS,1)+'<div id="gv_o" style="margin-top:8px;font-size:13.5px;line-height:1.6"></div>'+(RT.length?rhold('gv2'):'<div id="gv2_rt"></div><div id="gv2_fb"></div>')),
  panel('🔋 Pila','<canvas id="gv_cv" width="440" height="250" style="width:100%;background:#f8fafc;border-radius:10px"></canvas>')+'<div id="gv_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'gv2');
 const draw=()=>{const x=$(el,'#gv_cv').getContext('2d');x.clearRect(0,0,440,250);
  if(S.a===S.b){x.fillStyle='#b45309';x.font='bold 14px sans-serif';x.textAlign='center';x.fillText('Elige dos metales distintos',220,125);$(el,'#gv_o').innerHTML='<b style="color:#b45309">Elige dos electrodos distintos.</b>';$(el,'#gv_tl').innerHTML='';return}
  const r=celda(S.a,S.b,S.ca,S.cb),left=r.an===S.a;S.seen[[S.a,S.b].sort().join('')]=1;
  const bk=(X,col,lbl,met,ion,role,cnc)=>{x.fillStyle='#e0f2fe';x.fillRect(X,110,150,110);x.strokeStyle='#475569';x.lineWidth=3;x.strokeRect(X,100,150,120);x.fillStyle=col;x.fillRect(X+62,60,26,120);x.fillStyle='#0f172a';x.font='bold 12px sans-serif';x.textAlign='center';x.fillText(met,X+75,52);x.font='11px sans-serif';x.fillText(ion+' ('+cnc+')',X+75,205);x.fillStyle=role==='ánodo'?'#dc2626':'#2563eb';x.font='bold 12px sans-serif';x.fillText(role==='ánodo'?'ÁNODO (−) oxidación':'CÁTODO (+) reducción',X+75,236)};
  const A=EO[r.an],C=EO[r.ca],xa=left?30:260,xc=left?260:30;bk(xa,'#94a3b8',A.pr,A.pr,A.ion,'ánodo',fm(r.an===S.a?S.ca:S.cb,2)+' M');bk(xc,'#c2410c',C.pr,C.pr,C.ion,'cátodo',fm(r.ca===S.a?S.ca:S.cb,2)+' M');
  x.strokeStyle='#0f172a';x.lineWidth=2;x.beginPath();x.moveTo(xa+75,60);x.lineTo(xa+75,22);x.lineTo(xc+75,22);x.lineTo(xc+75,60);x.stroke();
  x.fillStyle='#16a34a';x.font='bold 12px sans-serif';x.textAlign='center';x.fillText('e⁻ '+(left?'→':'←')+' (del ánodo al cátodo)',220,16);
  x.strokeStyle='#a16207';x.lineWidth=6;x.beginPath();x.moveTo(xa+120,120);x.lineTo(xa+120,92);x.lineTo(xc+30,92);x.lineTo(xc+30,120);x.stroke();x.fillStyle='#a16207';x.font='11px sans-serif';x.fillText('puente salino',220,86);
  $(el,'#gv_o').innerHTML=`<b>Ánodo:</b> ${EO[r.an].n} (se oxida, pierde masa)<br><b>Cátodo:</b> ${EO[r.ca].n} (se reduce, gana masa)<br><b>Reacción:</b> ${esc(r.rx)}<br><b>Notación:</b> ${esc(r.not)}<br>n = ${r.n} e⁻ · E° = <b>${fm(r.E0,2)} V</b> · Q = ${sciU(r.Q)}<br>E (Nernst) = <b style="color:${r.E>0?'#16a34a':'#dc2626'}">${fm(r.E,3)} V</b> ${r.E>0?'→ espontánea':'→ no espontánea con estas concentraciones'}`;
  $(el,'#gv_tl').innerHTML=tiles([['E° celda',fm(r.E0,2)+' V','#2563eb'],['E (Nernst)',fm(r.E,3)+' V','#16a34a'],['Pilas armadas',Object.keys(S.seen).length,'#f59e0b']]);
  if(Object.keys(S.seen).length>=3)ctx.act('celda_nueva',{})};
 [['gv_a','a'],['gv_b','b']].forEach(([id,k])=>$(el,'#'+id).onchange=e=>{S[k]=e.target.value;ctx.act('cambia',{});draw()});
 [['gv_ca','ca'],['gv_cb','cb']].forEach(([id,k])=>$(el,'#'+id).onchange=e=>{S[k]=+e.target.value;ctx.act('cambia',{});if(S.ca!==S.cb||S.ca!==1)ctx.act('nernst',{});draw()});
 $(el,'#gv_b').value=S.b;draw();U.draw();return{reset(){S.seen={};draw();U.reset()}}};

/* ELECTRO: electrólisis y leyes de Faraday */
E.electro=(el,cfg,ctx)=>{const SS=cfg.sust;const S={i:0,I:2,t:30,seen:{}};const VM=24.47;
 const calc=(s,I,t)=>{const ne=I*t*60/FAR,nc=ne/s.cat.ne,na=ne/s.an.ne;return{ne,nc,na,mc:nc*s.cat.M,vc:nc*VM*1000,va:na*VM*1000,ma:na*s.an.M}};
 const RT=genR(cfg.retos||[],(q,i)=>{const s=SS[q.i],r=calc(s,q.I,q.t);
  if(q.t2==='masa'||q.t==='masa'){}
  if(q.t==='masa')return numReto(`Se electroliza ${s.n} con ${fm(q.I,1)} A durante ${q.min} min. ¿Qué masa de ${s.cat.prod} se deposita en el cátodo? (F = 96 485 C/mol)`,calc(s,q.I,q.min).mc,[calc(s,q.I,q.min).mc*2,calc(s,q.I,q.min).mc/2,calc(s,q.I,q.min).nc,calc(s,q.I,q.min).ne*s.cat.M],'g',3,`n(e⁻) = I·t/F = ${fm(q.I,1)} × ${q.min*60} / 96 485 = ${fm(calc(s,q.I,q.min).ne,4)} mol → n(${s.cat.prod}) = n(e⁻)/${s.cat.ne} → masa = ${fm(calc(s,q.I,q.min).mc,3)} g.`,i+2)
  if(q.t==='tiempo'){const t=q.m*s.cat.ne*FAR/(q.I*s.cat.M)/60;return numReto(`¿Cuánto tiempo (minutos) hay que electrolizar ${s.n} con ${fm(q.I,1)} A para depositar ${fm(q.m,2)} g de ${s.cat.prod}?`,t,[t*2,t/2,t*60,t/s.cat.ne],'min',1,`n(${s.cat.prod}) = ${fm(q.m/s.cat.M,4)} mol → n(e⁻) = ${fm(q.m/s.cat.M*s.cat.ne,4)} mol → t = n·F/I = ${fm(t*60,0)} s = ${fm(t,1)} min.`,i+3)}
  if(q.t==='mol'){const ne=q.I*q.min*60/FAR;return numReto(`Una corriente de ${fm(q.I,1)} A circula durante ${q.min} min. ¿Cuántos moles de electrones pasan? (F = 96 485 C/mol)`,ne,[ne*60,ne/60,q.I*q.min/FAR*2,ne*2],'mol',4,`Q = I·t = ${fm(q.I,1)} × ${q.min*60} s = ${fm(q.I*q.min*60,0)} C → n = Q/F = ${fm(ne,4)} mol.`,i+4)}
  if(q.t==='vol'){const r2=calc(s,q.I,q.min);return numReto(`En ${s.n}, con ${fm(q.I,1)} A durante ${q.min} min, ¿qué volumen (mL, a 25 °C y 1 atm) de ${s.an.prod} se desprende en el ánodo?`,r2.va,[r2.va*2,r2.va/2,r2.vc,r2.va*4],'mL',0,`n(e⁻) = ${fm(r2.ne,4)} mol → n(${s.an.prod}) = n(e⁻)/${s.an.ne} = ${fm(r2.na,5)} mol → V = n × 24,47 L/mol = ${fm(r2.va,0)} mL.`,i+5)}return q});
 el.innerHTML=grid(panel('🎛️ Celda electrolítica',lab('Sustancia')+sel('el_s',SS.map((s,i)=>[i,s.n]),0)+rng('el_I','Corriente (A)',0.5,5,S.I,0.5)+rng('el_t','Tiempo (min)',1,120,S.t,1)+'<div id="el_o" style="margin-top:8px;font-size:13.5px;line-height:1.6"></div>'+(RT.length?rhold('el2'):'<div id="el2_rt"></div><div id="el2_fb"></div>')),
  panel('📈 Producto en el cátodo','<canvas id="el_cv" style="width:100%;display:block"></canvas>')+'<div id="el_tl"></div>');
 const U=mkRetoUI(el,RT,ctx,'el2');
 const draw=()=>{const s=SS[S.i],r=calc(s,S.I,S.t),gas=s.cat.gas,fy=t=>{const q=calc(s,S.I,t);return gas?q.vc:q.mc},ymax=Math.max(fy(120),1e-6);S.seen[S.i]=1;
  SIM.plot($(el,'#el_cv'),{h:260,xmin:0,xmax:120,ymin:0,ymax:ymax*1.05,xl:'Tiempo (min)',yl:gas?'Volumen de '+s.cat.prod+' (mL)':'Masa de '+s.cat.prod+' (g)',series:[{f:fy,color:'#2563eb'}],pts:[{x:S.t,y:fy(S.t),color:'#dc2626',fill:'#dc2626',label:fm(fy(S.t),gas?0:3)+(gas?' mL':' g')}]});
  $(el,'#el_o').innerHTML=`${esc(s.n)}<br>Carga: Q = I·t = <b>${fm(S.I*S.t*60,0)} C</b><br>Electrones: <b>${fm(r.ne,4)} mol</b><br><b>Cátodo (−):</b> ${esc(s.cat.rx)}<br>→ ${gas?fm(r.vc,0)+' mL de '+s.cat.prod:fm(r.mc,3)+' g de '+s.cat.prod}<br><b>Ánodo (+):</b> ${esc(s.an.rx)}<br>→ ${fm(r.va,0)} mL de ${s.an.prod}`;
  $(el,'#el_tl').innerHTML=tiles([['Carga',fm(S.I*S.t*60,0)+' C','#2563eb'],['n(e⁻)',fm(r.ne,4)+' mol','#16a34a'],['Sustancias vistas',Object.keys(S.seen).length,'#f59e0b']])};
 $(el,'#el_s').onchange=e=>{S.i=+e.target.value;ctx.act('cambia',{});if(Object.keys(S.seen).length>=2)ctx.act('sustancia_nueva',{});draw()};
 [['el_I','I'],['el_t','t']].forEach(([id,k])=>$(el,'#'+id).oninput=e=>{S[k]=+e.target.value;$(el,'#'+id+'v').textContent=S[k];ctx.act('cambia',{});draw()});
 draw();U.draw();return{reset(){S.seen={};draw();U.reset()}}};

/* INTEGRA: casos aplicados que combinan varios temas */
E.integra=(el,cfg,ctx)=>{const CS=cfg.casos;const S={i:0,done:{}};
 el.innerHTML=grid(panel('🎛️ Caso aplicado',lab('Elige un caso')+sel('in_s',CS.map((c,i)=>[i,c.n]),0)+'<div id="in_t" style="margin-top:8px;font-size:13.5px;line-height:1.6"></div>'),panel('🧩 Retos del caso',rhold('in2'))+'<div id="in_tl"></div>');
 let U=null;const ctx2={act:(n,d)=>{if(n==='todo_ok'){if(!S.done[S.i]){S.done[S.i]=1;ctx.act('caso_ok',{});if(Object.keys(S.done).length>=CS.length)ctx.act('todo_ok',{})}}else ctx.act(n,d)},obs:ctx.obs};
 const mk=()=>{const c=CS[S.i];$(el,'#in_t').innerHTML='<b>'+esc(c.n)+'</b><br>'+c.texto;U=mkRetoUI(el,c.retos,ctx2,'in2');el.__rt=c.retos;U.draw();$(el,'#in_tl').innerHTML=tiles([['Casos resueltos',Object.keys(S.done).length+' / '+CS.length,'#16a34a']])};
 $(el,'#in_s').onchange=e=>{S.i=+e.target.value;$(el,'#in2_fb').textContent='';mk();ctx.act('caso_visto',{})};
 mk();return{reset(){S.done={};$(el,'#in2_fb').textContent='';mk()}}};

E._ELEM=ELEM;E._shells=shells;
return E;})();
