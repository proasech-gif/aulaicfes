/* AULA360 — Suscripciones: activar colegio (rector), PIN, docente individual, recibo, bienvenida, cuentas del personal, cambio obligatorio y vencimiento. */
window.SUB=(function(){
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cop=n=>'$ '+Math.round(+n||0).toLocaleString('es-CO'),usd=n=>'US$ '+(+n||0).toLocaleString('es-CO',{minimumFractionDigits:2,maximumFractionDigits:2});
const fl=d=>{if(!d)return'—';const[y,m,x]=String(d).slice(0,10).split('-').map(Number);return new Date(y,m-1,x).toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'})};
let Z={sub:'menu',cat:null,q:'',cols:[],col:null,otro:false,otroTxt:'',nm:'',tel:'',em:'',promo:'',cot:null,mon:'COP',pin:'',res:null,busy:false,msg:'',other:false,per:'',lista:null,txt:''};
async function call(accion,body){
  const r=await sb.functions.invoke('pagos',{body:{accion,origen:location.origin+location.pathname,...(body||{})}});
  if(r.error){let m=r.error.message;try{const j=await r.error.context.json();m=j.error||m}catch(x){}throw new Error(m)}
  if(r.data&&r.data.error)throw new Error(r.data.error);return r.data}
const KIND={rector:{plan:'rector_anual',acc:'iniciar_institucion',tit:'Activar AULA360 en mi colegio',per:'1 año'},doc:{plan:'docente_mensual',acc:'iniciar_docente',tit:'Suscribirme como docente',per:'1 mes'}};
async function init(){if(!Z.cat){try{Z.cat=await call('catalogo')}catch(x){Z.cat={planes:[],trm:4000,simulado:true}}}}
function precio(k){const p=(Z.cat?.planes||[]).find(x=>x.clave===KIND[k].plan);return p?p.valor_cop:0}
function importe(k){const c=Z.cot;const tot=c?c.total_cop:precio(k);const tu=c?c.total_usd:Math.round(tot/(Z.cat?.trm||4000)*100)/100;return{tot,tu,desc:c?c.descuento_cop:0}}
function monedaHtml(k){const i=importe(k);
  return`<div class="rounded-xl p-3" style="background:#eff6ff;border:1px solid #bfdbfe"><div class="flex gap-2 mb-2">${['COP','USD'].map(m=>`<button onclick="SUB.mon('${m}')" class="px-3 py-1 rounded-lg text-sm ${Z.mon===m?'on':'bg-slate-200'}">${m==='COP'?'Pesos (COP)':'Dólares (USD)'}</button>`).join('')}</div>
  ${i.desc?`<div class="text-sm text-slate-500"><s>${cop(precio(k))}</s> · descuento ${cop(i.desc)}</div>`:''}
  <div class="text-2xl font-extrabold" style="color:#0f2c66">${Z.mon==='USD'?usd(i.tu):cop(i.tot)} <span class="text-sm font-semibold text-slate-500">${KIND[k].per==='1 año'?'por 1 año':'por 1 mes'}</span></div>
  <div class="text-xs text-slate-500 mt-1">${Z.mon==='USD'?`Dólar de hoy: ${cop(Z.cat?.trm)} · equivale a ${cop(i.tot)}. `:`Equivale a ${usd(i.tu)} (dólar de hoy: ${cop(Z.cat?.trm)}). `}El cobro se hace en pesos colombianos por Wompi.</div></div>`}
function promoHtml(k){return`<div class="flex gap-2 items-end"><label class="text-sm" style="flex:1">¿Tienes un código de promoción?<input id="sub_promo" class="w-full border rounded-lg p-2 mt-1" value="${e(Z.promo)}" placeholder="Opcional" oninput="SUB.set('promo',this.value)"></label><button onclick="SUB.aplicar('${k}')" class="px-3 py-2 rounded-lg bg-slate-200 text-sm">Aplicar</button></div>${Z.cot&&Z.cot.promo_msg?`<div class="text-sm ${Z.cot.promo?'text-emerald-700':'text-red-600'}">${e(Z.cot.promo_msg)}</div>`:''}`}
function head2(h){return h}
function vMenu(h){return`<div class="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow p-6 space-y-3">${h}<h2 class="text-lg font-bold text-center">Suscripciones</h2>
  <button onclick="SUB.ir('rector')" class="w-full text-left rounded-xl p-4 border-2 border-blue-200 bg-blue-50"><b>🏫 Soy rector: activar mi colegio</b><div class="text-xs text-slate-600">Paga la suscripción anual y recibe tu acceso al instante.</div></button>
  <button onclick="SUB.ir('pin')" class="w-full text-left rounded-xl p-4 border-2 border-amber-200 bg-amber-50"><b>🔑 Tengo un PIN</b><div class="text-xs text-slate-600">Si pagaste en efectivo, el auditor te dio un PIN.</div></button>
  <button onclick="SUB.ir('doc')" class="w-full text-left rounded-xl p-4 border-2 border-emerald-200 bg-emerald-50"><b>👩‍🏫 Soy docente: suscribirme yo solo</b><div class="text-xs text-slate-600">${cop(precio('doc'))} al mes.</div></button></div>`}
function colHtml(){
  if(Z.otro)return`<label class="text-sm block">Nombre de tu colegio<input class="w-full border rounded-lg p-2 mt-1" value="${e(Z.otroTxt)}" oninput="SUB.set('otroTxt',this.value)"></label>`;
  return`<label class="text-sm block">Busca tu colegio<input class="w-full border rounded-lg p-2 mt-1" placeholder="Escribe parte del nombre…" value="${e(Z.q)}" oninput="SUB.buscar(this.value)"></label>
  ${Z.col?`<div class="text-sm rounded-lg p-2 bg-emerald-50 border border-emerald-200">✅ ${e(Z.col.nombre)} <button class="text-xs underline" onclick="SUB.quitarCol()">cambiar</button></div>`:(Z.cols.length?`<div class="border rounded-lg" style="max-height:170px;overflow:auto">${Z.cols.map(c=>`<button class="block w-full text-left px-3 py-2 text-sm hover:bg-slate-100" onclick="SUB.elegir(${c.id})">${e(c.nombre)}</button>`).join('')}</div>`:'')}`}
function vForm(h,k){
  const rect=k==='rector';
  return`<div class="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow p-6 space-y-3">${h}<button onclick="SUB.ir('menu')" class="text-sm underline">← Volver</button><h2 class="text-lg font-bold">${KIND[k].tit}</h2>
  ${rect?colHtml()+`<label class="text-sm flex items-center gap-2"><input type="checkbox" ${Z.otro?'checked':''} onchange="SUB.set('otro',this.checked,true)"> Mi colegio no aparece en la lista</label>`
  :`<div class="rounded-lg p-2 bg-emerald-50 border border-emerald-200 text-sm">Te suscribes a: <b>${e(Z.cat?.individual?.nombre||'AULA360')}</b></div>
  <label class="text-sm flex items-center gap-2"><input type="checkbox" ${Z.other?'checked':''} onchange="SUB.set('other',this.checked,true)"> Quiero suscribirme a otra institución <span class="text-xs text-slate-500">(requiere permiso del auditor)</span></label>${Z.other?colHtml():''}`}
  <input class="w-full border rounded-lg p-2" placeholder="${rect?'Nombre del rector':'Tu nombre completo'}" value="${e(Z.nm)}" oninput="SUB.set('nm',this.value)">
  <input class="w-full border rounded-lg p-2" type="tel" placeholder="Celular" value="${e(Z.tel)}" oninput="SUB.set('tel',this.value)">
  <input class="w-full border rounded-lg p-2" type="email" placeholder="Tu correo real (aquí te llega el recibo)" value="${e(Z.em)}" oninput="SUB.set('em',this.value)">
  ${promoHtml(k)}${monedaHtml(k)}
  ${Z.msg?`<div class="rounded-lg p-3 text-sm bg-amber-50 border border-amber-300">${e(Z.msg)}</div>`:''}
  <button onclick="SUB.pagar('${k}')" ${Z.busy?'disabled':''} class="w-full py-3 rounded-xl text-white font-bold" style="background:#1456c4">${Z.busy?'Procesando…':Z.cat?.simulado?'💳 Pagar (MODO DE PRUEBA, no cobra)':'💳 Pagar con Wompi'}</button>
  <p class="text-xs text-slate-500">Al pagar recibirás un recibo, un correo y una contraseña provisionales, que podrás cambiar. Después de la suscripción no se devuelve dinero.</p></div>`}
function vPin(h){return`<div class="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow p-6 space-y-3">${h}<button onclick="SUB.ir('menu')" class="text-sm underline">← Volver</button><h2 class="text-lg font-bold">🔑 Activar con PIN</h2><p class="text-sm text-slate-600">Escribe el PIN que te dio el auditor al recibir tu pago.</p>
  <input class="w-full border rounded-lg p-3 text-center text-xl font-extrabold tracking-widest" placeholder="XXXX-XXXX" value="${e(Z.pin)}" oninput="SUB.set('pin',this.value.toUpperCase())">
  <input class="w-full border rounded-lg p-2" type="tel" placeholder="Tu celular" value="${e(Z.tel)}" oninput="SUB.set('tel',this.value)">
  <input class="w-full border rounded-lg p-2" type="email" placeholder="Tu correo real (opcional, para el recibo)" value="${e(Z.em)}" oninput="SUB.set('em',this.value)">
  ${Z.msg?`<div class="rounded-lg p-3 text-sm bg-red-50 border border-red-200">${e(Z.msg)}</div>`:''}
  <button onclick="SUB.canjear()" ${Z.busy?'disabled':''} class="w-full py-3 rounded-xl text-white font-bold" style="background:#12a874">${Z.busy?'Activando…':'Activar mi colegio'}</button></div>`}
const LEY='El valor que aparece aquí se mantendrá fijo durante un año e incluye soporte, mantenimiento de la plataforma y todas las mejoras que se le hagan a la misma. No se devuelve dinero luego de la suscripción.';
function reciboHtml(s,cred){
  const per=s.tipo==='docente'?'Suscripción mensual de docente':'Suscripción anual del colegio';
  return`<div class="rec" style="border:2px dashed #94a3b8;border-radius:12px;padding:16px;background:#fff"><h3 style="margin:0;font-size:20px;font-weight:800">RECIBO DE PAGO</h3><div style="font-size:12px;color:#64748b">Código: ${e(s.recibo)} · Versión 01</div>
  <table style="width:100%;font-size:14px;margin-top:8px"><tr><td style="color:#64748b;width:140px">${s.tipo==='docente'?'Docente':'Rector'}</td><td><b>${e(s.nombre)}</b></td></tr><tr><td style="color:#64748b">${s.tipo==='docente'?'Institución':'Colegio'}</td><td><b>${e(s.colegio)}</b></td></tr><tr><td style="color:#64748b">Concepto</td><td>${per}</td></tr>
  <tr><td style="color:#64748b">Vigencia</td><td><b>Del ${fl(s.inicia)} al ${fl(s.vence)}</b></td></tr>${s.descuento?`<tr><td style="color:#64748b">Promoción</td><td>${e(s.promo||'')} (− ${cop(s.descuento)})</td></tr>`:''}
  <tr><td style="color:#64748b">Valor pagado</td><td><b>${cop(s.valor_cop)} COP</b> <span style="color:#64748b">(${usd(s.valor_usd)} al dólar de ${cop(s.trm)})</span></td></tr><tr><td style="color:#64748b">Forma de pago</td><td>${s.forma==='wompi'?'Wompi':s.forma==='efectivo'?'Efectivo (PIN)':'Prueba'}</td></tr><tr><td style="color:#64748b">Referencia</td><td>${e(s.referencia)}</td></tr><tr><td style="color:#64748b">Fecha</td><td>${new Date(s.fecha).toLocaleString('es-CO')}</td></tr></table>
  <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:10px;border-radius:8px;font-size:13px;margin-top:10px">${LEY}</div>
  ${cred?`<div style="background:#f0fdf4;border:2px solid #86efac;border-radius:12px;padding:12px;margin-top:10px"><b>Tu acceso provisional</b><br>Correo: <b>${e(cred.email)}</b><br>Contraseña: <b>${e(cred.password)}</b><div style="font-size:12px;color:#166534;margin-top:4px">Guárdalos ahora: se muestran una sola vez. Al entrar, la plataforma te pedirá cambiar el correo y la contraseña.</div></div>`:''}</div>`}
function imprimir(s,cred){const w=window.open('','_blank');if(!w)return toast('⚠️','Ventana bloqueada','Permite ventanas emergentes para imprimir.');
  w.document.write('<html><head><meta charset="utf-8"><title>Recibo '+e(s.recibo)+'</title><style>body{font-family:Arial,sans-serif;max-width:720px;margin:24px auto;color:#10244d}td{padding:4px 6px}</style></head><body><img src="'+location.origin+'/aula360-logo-horizontal.png" style="height:56px"><br><br>'+reciboHtml(s,cred)+'<script>setTimeout(function(){print()},400)<\/script></body></html>');w.document.close()}
function vResultado(h){const s=Z.res;if(!s)return'';
  if(s.estado!=='pagado')return`<div class="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow p-6 space-y-3">${h}<h2 class="text-lg font-bold">${s.estado==='rechazado'?'❌ El pago no fue aprobado':'⏳ Esperando la confirmación del pago…'}</h2><p class="text-sm text-slate-600">${s.estado==='rechazado'?'Puedes intentar de nuevo.':'Esto puede tardar unos segundos. No cierres esta página.'}</p><button onclick="SUB.fin()" class="px-4 py-2 rounded-lg bg-slate-200">Volver</button></div>`;
  return`<div class="max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow p-6 space-y-3">${h}<div style="display:inline-block;background:#dcfce7;color:#166534;border-radius:999px;padding:2px 12px;font-weight:800;font-size:13px">PAGO APROBADO</div>${reciboHtml(s,s.cred)}
  <div class="flex flex-wrap gap-2"><button onclick="SUB.imp()" class="px-4 py-2 rounded-lg font-bold" style="background:#f5b82e">🖨 Imprimir / guardar recibo (PDF)</button><button onclick="SUB.fin()" class="px-4 py-2 rounded-lg text-white font-bold" style="background:#1456c4">Entrar a AULA360</button></div></div>`}
function vista(h){const m=authMode;const sb2=m.replace('sub_','');
  if(sb2==='res')return vResultado(h);if(sb2==='rector')return vForm(h,'rector');if(sb2==='doc')return vForm(h,'doc');if(sb2==='pin')return vPin(h);return vMenu(h)}
let tq=null;
const api={vista,init,
  async ir(k){Z.msg='';Z.cot=null;await init();await setMode('sub_'+k)},
  set(k,v,r){Z[k]=v;if(r)render()},
  mon(m){Z.mon=m;render()},
  buscar(v){Z.q=v;clearTimeout(tq);tq=setTimeout(async()=>{if(v.trim().length<3){Z.cols=[];return render()}const r=await sb.from('colegios').select('id,nombre,codinst').ilike('nombre','%'+v.trim()+'%').limit(15);Z.cols=r.data||[];render();const i=document.querySelector('input[placeholder^="Escribe parte"]');if(i){i.focus();i.setSelectionRange(v.length,v.length)}},300)},
  elegir(id){Z.col=Z.cols.find(c=>c.id===id)||null;Z.cols=[];render()},quitarCol(){Z.col=null;render()},
  async aplicar(k){try{Z.cot=await call('cotizar',{plan:KIND[k].plan,promo:Z.promo});render()}catch(x){err(x)}},
  async pagar(k){
    Z.msg='';const body={nombre:Z.nm,telefono:Z.tel,email_contacto:Z.em,promo:Z.cot&&Z.cot.promo?Z.promo:'',moneda:Z.mon};
    if(k==='rector'){if(Z.otro)body.colegio_nombre=Z.otroTxt;else if(Z.col)body.colegio_id=Z.col.id;else return toast('⚠️','Falta el colegio','Busca y elige tu colegio, o marca que no aparece.')}
    else if(Z.other){if(!Z.col)return toast('⚠️','Falta la institución','Busca y elige la institución.');body.colegio_id=Z.col.id}
    Z.busy=true;render();
    try{const r=await call(KIND[k].acc,body);Z.busy=false;
      if(r.permiso){Z.msg=r.mensaje;return render()}
      if(r.checkout){sessionStorage.setItem('aula_pago',r.ref);location.href=r.checkout;return}
      if(r.simulado){await call('simular_pago',{id:r.id})}
      await api.abrirPago(r.ref)}
    catch(x){Z.busy=false;Z.msg=x.message;render()}},
  async canjear(){Z.busy=true;Z.msg='';render();try{const r=await call('canjear_pin',{pin:Z.pin,telefono:Z.tel,email_contacto:Z.em});Z.busy=false;Z.res=r;await setMode('sub_res')}catch(x){Z.busy=false;Z.msg=x.message;render()}},
  async abrirPago(ref,tx){let r;try{if(tx)await call('verificar',{ref,tx});for(let i=0;i<8;i++){r=await call('estado_pago',{ref});if(r.estado!=='pendiente')break;await new Promise(o=>setTimeout(o,1500))}}catch(x){return err(x)}
    Z.res=r;await init();authMode='sub_res';render()},
  imp(){imprimir(Z.res,Z.res.cred)},
  fin(){Z.res=null;history.replaceState(null,'',location.pathname);authMode='login';location.reload()},
  /* ----- con sesión iniciada ----- */
  async alIngresar(){
    let ac=null;try{ac=(await sb.rpc('acceso_vigente')).data}catch(x){}
    try{D.susc=(await sb.rpc('mi_suscripcion')).data||null}catch(x){D.susc=null}
    M.sus=!!D.susc;
    if(ac&&ac.controlado&&!ac.ok){bloqueo(ac);return false}
    return true},
  tarjeta(){const s=D.susc;if(!s)return'';const dias=s.dias;
    return`<div class="aic-card" style="padding:16px;margin:12px 0;border-left:5px solid ${dias<=30?'#f59e0b':'#12a874'}"><b>🎓 Suscripción activa</b> · válida del ${fl(s.inicia)} al ${fl(s.vence)} <span class="text-sm text-slate-500">(${dias} días)</span>${dias<=30?'<div class="text-sm" style="color:#b45309">Tu suscripción vence pronto. Renueva desde «Mi suscripción».</div>':''}<div style="margin-top:6px"><button onclick="go('msus')" class="aic-link">Ver mi suscripción, manuales y recibo →</button></div></div>`},
  async recargar(){try{D.susc=(await sb.rpc('mi_suscripcion')).data||null}catch(x){}},
  panel(){const s=D.susc;if(!s)return'<div class="aic-card" style="padding:16px">Tu cuenta no tiene una suscripción registrada.</div>';
    const nom=(M.full_name||'').split(' ')[0];const dias=s.dias;
    const man=(f,ic,t)=>`<a href="manuales/${f}" download class="px-4 py-3 rounded-xl text-white font-bold text-center" style="background:#1456c4;color:#fff!important;text-decoration:none">${ic} ${t}</a>`;
    const puedeRen=M.role==='rector'||(s.tipo==='docente');
    return`<div class="space-y-4"><div style="background:linear-gradient(110deg,#0b2a6b,#1456c4);color:#fff;border-radius:18px;padding:22px"><div style="font-size:12px;letter-spacing:2px;opacity:.8">BIENVENIDO</div><h2 style="font-size:26px;font-weight:800;margin:4px 0">¡Bienvenido/a a AULA360, ${e(nom)}!</h2><div>${e(s.colegio)}</div>
    <p style="margin-top:8px">Tu suscripción es válida <b>desde el ${fl(s.inicia)} hasta el ${fl(s.vence)}</b>.</p><div style="background:#ffffff22;border-radius:10px;padding:6px 12px;display:inline-block;font-size:13px">⏳ ${dias>=0?'Te quedan '+dias+' días':'Venció hace '+(-dias)+' días'}</div></div>
    <div class="aic-card" style="padding:16px"><h3 style="font-weight:800;margin-bottom:10px">Tus documentos</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px">
    ${man('manual_rector.pdf','📘','Manual del rector (PDF)')}${man('manual_docente.pdf','📗','Manual del docente (PDF)')}${man('manual_estudiante.pdf','📙','Manual del estudiante (PDF)')}
    <button onclick="SUB.impMi()" class="px-4 py-3 rounded-xl font-bold" style="background:#f5b82e">🧾 Descargar recibo de pago (PDF)</button><button onclick="go('sop')" class="px-4 py-3 rounded-xl font-bold bg-slate-200">🛠️ Enviar a soporte</button>${puedeRen?`<button onclick="SUB.renovar()" class="px-4 py-3 rounded-xl text-white font-bold" style="background:#12a874">🔄 Renovar suscripción</button>`:''}</div>
    <p class="text-xs text-slate-500 mt-2">${LEY}</p></div></div>`},
  impMi(){const s=D.susc;if(!s)return;imprimir({...s,recibo:s.recibo,valor_cop:s.valor_cop,descuento:s.descuento,fecha:s.fecha,referencia:s.referencia},null)},
  async renovar(){await init();Z.mon='COP';try{const k=M.role==='rector'?'rector':'doc';const r=await call(KIND[k].acc,{renovar:true,nombre:M.full_name,email_contacto:M.email||'renovacion@aula360.app',telefono:M.phone||'',moneda:'COP'});
    if(r.checkout){sessionStorage.setItem('aula_pago',r.ref);location.href=r.checkout;return}
    if(r.simulado){await call('simular_pago',{id:r.id});toast('✅','Suscripción renovada','Se sumó un nuevo periodo.');await api.recargar();render()}}catch(x){err(x)}},
  /* cambio obligatorio de correo y contraseña */
  forzarCambio(){if(document.getElementById('sub_force'))return;const d=document.createElement('div');d.id='sub_force';d.style.cssText='position:fixed;inset:0;background:#0b1b3acc;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px';
    d.innerHTML=`<div style="background:#fff;border-radius:18px;max-width:420px;width:100%;padding:22px"><h2 style="font-size:20px;font-weight:800">🔐 Cambia tu correo y tu contraseña</h2><p style="font-size:13px;color:#475569;margin:6px 0 10px">Tu acceso es provisional. Escribe tu correo real y una contraseña nueva (mínimo 8 caracteres). Con ellos entrarás desde ahora.</p>
    <input id="fc_em" type="email" placeholder="Tu correo real" style="width:100%;border:1px solid #cbd5e1;border-radius:10px;padding:10px;margin-bottom:8px"><input id="fc_p1" type="password" placeholder="Contraseña nueva" style="width:100%;border:1px solid #cbd5e1;border-radius:10px;padding:10px;margin-bottom:8px"><input id="fc_p2" type="password" placeholder="Repite la contraseña" style="width:100%;border:1px solid #cbd5e1;border-radius:10px;padding:10px;margin-bottom:10px">
    <div id="fc_err" style="color:#b91c1c;font-size:13px;margin-bottom:6px"></div><button id="fc_go" style="width:100%;background:#1456c4;color:#fff;border-radius:12px;padding:12px;font-weight:800">Guardar y continuar</button></div>`;
    document.body.appendChild(d);
    document.getElementById('fc_go').onclick=async()=>{const em=document.getElementById('fc_em').value.trim().toLowerCase(),p1=document.getElementById('fc_p1').value,p2=document.getElementById('fc_p2').value,er=document.getElementById('fc_err');
      if(!/^\S+@\S+\.\S+$/.test(em))return er.textContent='Escribe un correo válido.';if(/@aula360\.app$/.test(em))return er.textContent='Escribe tu correo real, no el provisional.';if(p1.length<8)return er.textContent='La contraseña debe tener mínimo 8 caracteres.';if(p1!==p2)return er.textContent='Las contraseñas no coinciden.';
      er.textContent='Guardando…';try{await call('cambiar_credenciales',{email:em,password:p1});const r=await sb.auth.signInWithPassword({email:em,password:p1});if(r.error)throw r.error;d.remove();M.cambio_obligatorio=false;toast('✅','Listo','Ya puedes entrar con tu nuevo correo y contraseña.');boot()}catch(x){er.textContent=x.message}}},
  /* cuentas del personal (rector) */
  cuentasView(){const L=Z.lista;
    return`<div class="space-y-4"><div class="aic-card" style="padding:16px"><h3 style="font-weight:800;font-size:17px">🔑 Cuentas de docentes y coordinadores</h3><p class="text-sm text-slate-600">Escribe o pega una persona por línea: <b>Nombre ; Documento ; Celular ; Cargo</b> (cargo: docente o coordinador). También puedes subir un Excel o CSV con esas columnas. La plataforma crea cada cuenta con un correo y una contraseña provisionales.</p>
    <textarea id="sub_txt" rows="7" class="w-full border rounded-lg p-2 mt-2" placeholder="Ana Palacios ; 1075000001 ; 3001234567 ; docente&#10;Luis Mosquera ; 1075000002 ; 3109876543 ; coordinador" oninput="SUB.set('txt',this.value)">${e(Z.txt)}</textarea>
    <div class="flex flex-wrap gap-2 mt-2"><label class="px-3 py-2 rounded-lg bg-slate-200 text-sm cursor-pointer">📎 Subir Excel o CSV<input type="file" hidden accept=".xlsx,.xls,.csv" onchange="SUB.archivo(this.files[0])"></label><button onclick="SUB.crear()" ${Z.busy?'disabled':''} class="px-4 py-2 rounded-lg text-white font-bold" style="background:#12a874">${Z.busy?'Creando…':'Crear cuentas y generar archivo'}</button></div></div>
    ${L?`<div class="aic-card" style="padding:16px"><h3 style="font-weight:800">${L.filter(x=>!x.error).length} cuenta(s) creada(s)${L.some(x=>x.error)?' · '+L.filter(x=>x.error).length+' con error':''}</h3>
    <div class="aic-table-wrap"><table><thead><tr><th>NOMBRE</th><th>CARGO</th><th>CORREO PROVISIONAL</th><th>CONTRASEÑA</th></tr></thead><tbody>${L.map(x=>x.error?`<tr><td>${e(x.nombre)}</td><td colspan="3" style="color:#b91c1c">${e(x.error)}</td></tr>`:`<tr><td>${e(x.nombre)}</td><td>${x.cargo}</td><td>${e(x.email)}</td><td><b>${e(x.password)}</b></td></tr>`).join('')}</tbody></table></div>
    <div class="flex flex-wrap gap-2 mt-3"><button onclick="SUB.excel()" class="px-4 py-2 rounded-lg text-white font-bold" style="background:#1456c4">⬇ Descargar Excel</button><button onclick="SUB.tarjetas()" class="px-4 py-2 rounded-lg font-bold" style="background:#f5b82e">🖨 Imprimir tarjetas</button></div>
    <p class="text-xs text-slate-500 mt-2">⚠️ Las contraseñas se muestran solo ahora. Cada persona debe cambiar su correo y contraseña al entrar la primera vez.</p></div>`:''}</div>`},
  async archivo(f){if(!f)return;try{await loadScript(LIB.xlsx);const isCsv=/\.csv$/i.test(f.name);const wb=isCsv?XLSX.read(await f.text(),{type:'string'}):XLSX.read(await f.arrayBuffer(),{type:'array'});const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,raw:false,defval:''});
    Z.txt=rows.filter(r=>r.some(x=>String(x).trim())&&!/^nombre/i.test(String(r[0]).trim())).map(r=>r.slice(0,4).map(x=>String(x).trim()).join(' ; ')).join('\n');render()}catch(x){err(x)}},
  async crear(){const personas=Z.txt.split('\n').map(l=>l.split(/[;\t]/).map(x=>x.trim())).filter(a=>a[0]).map(a=>({nombre:a[0],documento:a[1]||'',celular:a[2]||'',cargo:a[3]||'docente'}));
    if(!personas.length)return toast('⚠️','Lista vacía','Escribe al menos una persona.');if(personas.length>300)return toast('⚠️','Muchas personas','Máximo 300 por vez.');
    Z.busy=true;render();try{const r=await call('crear_cuentas',{personas});Z.lista=r.cuentas;Z.busy=false;render();toast('✅','Cuentas creadas',r.cuentas.filter(x=>!x.error).length+' en total.')}catch(x){Z.busy=false;render();err(x)}},
  async excel(){await loadScript(LIB.xlsx);const rows=[['Nombre','Cargo','Documento','Celular','Correo provisional','Contraseña provisional','Colegio'],...Z.lista.filter(x=>!x.error).map(x=>[x.nombre,x.cargo,x.documento,x.celular,x.email,x.password,M.school_name||''])];
    const ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:30},{wch:14},{wch:14},{wch:14},{wch:42},{wch:20},{wch:34}];const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Cuentas');XLSX.writeFile(wb,'cuentas_provisionales_AULA360.xlsx')},
  tarjetas(){const w=window.open('','_blank');if(!w)return;const L=Z.lista.filter(x=>!x.error);
    w.document.write('<html><head><meta charset="utf-8"><title>Tarjetas de acceso</title><style>body{font-family:Arial;margin:14px}.t{display:inline-block;width:48%;box-sizing:border-box;border:2px dashed #94a3b8;border-radius:10px;padding:10px;margin:0 1% 10px 0;vertical-align:top;font-size:13px;page-break-inside:avoid}</style></head><body>'+L.map(x=>`<div class="t"><b>AULA360 · ${e(M.school_name||'')}</b><br>${e(x.nombre)} · ${x.cargo}<br>Entra a: <b>${location.origin}</b><br>Correo: <b>${e(x.email)}</b><br>Contraseña: <b>${e(x.password)}</b><br><small>Al entrar, cambia tu correo y tu contraseña.</small></div>`).join('')+'<script>setTimeout(function(){print()},400)<\/script></body></html>');w.document.close()}
};
function bloqueo(ac){
  document.getElementById('app').innerHTML=`<div class="max-w-md mx-auto mt-16 bg-white rounded-2xl shadow p-6 space-y-3 text-center"><div style="font-size:44px">⏰</div><h2 class="text-xl font-bold">Tu suscripción venció</h2><p class="text-sm text-slate-600">${ac.vence?'Venció el '+fl(ac.vence)+'.':''} Para seguir usando AULA360 hay que renovarla.</p>
  ${M.role==='rector'||(M.role==='prof'&&D.susc&&D.susc.tipo==='docente')?`<button onclick="SUB.renovar()" class="w-full py-3 rounded-xl text-white font-bold" style="background:#12a874">🔄 Renovar ahora</button>`:'<p class="text-sm">Pídele al rector de tu colegio que la renueve.</p>'}<button onclick="logout()" class="w-full py-2 rounded-xl bg-slate-200">Cerrar sesión</button></div>`}
return api})();
