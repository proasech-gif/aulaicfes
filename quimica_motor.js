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


E._ELEM=ELEM;E._shells=shells;
return E;})();
