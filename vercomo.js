/* AULA360 — "Entrar al entorno" de un docente o coordinador (rector / coordinador): se ve TODO lo suyo, solo para consultar.
   Usa una sesión temporal que vive solo en esta pestaña (no se guarda) y bloquea cualquier cambio. */
window.VC=(function(){
const URL_='https://pmigzkhhqxzhspqmkbvf.supabase.co',KEY='sb_publishable_GZT40D67S2ICeD1LWOxbEQ_mimJCWlu';
const MSG='Estás en modo consulta: desde aquí no se puede cambiar nada.';
const READ_RPC=new Set(['asistencia_docentes','asistencia_estado','asistencia_listar','asistencia_mi_doc','avail_counts','banco_saber_cobertura','clase_abiertas','clase_lista','clase_reporte','directorio_colegio','get_leaderboard','lista_colegio_curso','mensajes_pendientes','periodo_banco','periodo_preguntas','planeador_recibidos','saber_disponibilidad','saber_imp_contenido','saber_imp_estudiantes','saber_imp_resultados']);
let V=null; // {real, nombre, rol, volver}
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function negado(){
  const r={data:null,error:{message:MSG},count:null};
  const p=new Proxy(function(){},{get(_,k){if(k==='then')return(ok,no)=>Promise.resolve(r).then(ok,no);return()=>p},apply(){return p}});
  return p}
function candado(c){
  const W=['insert','update','upsert','delete'];
  return new Proxy(c,{get(t,k){
    if(k==='from')return tb=>new Proxy(t.from(tb),{get(b,m){if(W.includes(m))return()=>negado();const v=b[m];return typeof v==='function'?v.bind(b):v}});
    if(k==='rpc')return(n,a,o)=>READ_RPC.has(n)?t.rpc(n,a,o):negado();
    if(k==='functions')return{invoke:()=>negado()};
    if(k==='storage')return{from:bk=>{const s=t.storage.from(bk);return{download:s.download.bind(s),createSignedUrl:s.createSignedUrl.bind(s),createSignedUrls:s.createSignedUrls.bind(s),getPublicUrl:s.getPublicUrl.bind(s),list:s.list.bind(s),upload:()=>negado(),remove:()=>negado(),update:()=>negado(),move:()=>negado()}}};
    if(k==='auth')return{getSession:()=>t.auth.getSession(),getUser:()=>t.auth.getUser(),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),signOut:()=>api.salir(),updateUser:()=>negado(),signInWithPassword:()=>negado()};
    const v=t[k];return typeof v==='function'?v.bind(t):v}})}
function banner(){
  if(!V)return'';
  return`<div id="vc-banner" style="position:sticky;top:0;z-index:50;background:#b45309;color:#fff;padding:10px 14px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;border-radius:0 0 12px 12px;box-shadow:0 2px 8px #0003"><div style="font-weight:800;font-size:14px">👁 Estás viendo el entorno de ${e(V.nombre)} <span style="font-weight:400">· ${e(V.rol)} · solo consulta, no se puede cambiar nada</span></div><button onclick="VC.salir()" style="background:#fff;color:#92400e;padding:8px 14px;border-radius:10px;font-weight:800">↩ Volver a mi entorno</button></div>`}

/* ---------- Pantalla en solo consulta: todo desactivado, menos el menú y los botones que solo sirven para MIRAR ---------- */
const OK_MENU='.aic-sidebar,.aic-tabs,#vc-banner,.aic-hamb,.aic-back';
const OK_VER=/^\s*([\w$]+\.p(\+\+|--);|go\(|[\w$.]+\.(go|sub|tab|ver|det|open|view|pag|pg|next|prev|tog\w*|mostrar\w*|ocultar\w*)\()/i;
const permitido=el=>{
  if(el.closest(OK_MENU))return true;
  if(el.tagName==='A')return true;
  if(el.tagName==='BUTTON'||el.hasAttribute('onclick')){const h=el.getAttribute('onclick')||'';return OK_VER.test(h)&&!/(guardar|enviar|borrar|eliminar|crear|publicar|subir|calific|aprob|cerrar|marcar|quitar|agregar|nuevo|save|del|set\w*\()/i.test(h)}
  return false};
function bloquear(root){
  if(!V||!root)return;
  root.querySelectorAll('input,select,textarea,button,[contenteditable],[onclick]').forEach(el=>{
    if(el.dataset.vcOk)return;
    if(el.matches('input,select,textarea')){if(el.closest(OK_MENU))return;el.disabled=true;el.readOnly=true}
    else if(el.hasAttribute('contenteditable')){el.setAttribute('contenteditable','false')}
    else if(!permitido(el)){if(el.tagName==='BUTTON')el.disabled=true;el.style.opacity='.5';el.style.cursor='not-allowed';el.style.pointerEvents=el.tagName==='BUTTON'?'':'none'}
    el.title=el.disabled||el.style.cursor==='not-allowed'?'Solo consulta: no se puede cambiar nada':el.title;
  })}
let obs=null,fr=0;
function guardia(ev){
  if(!V)return;const t=ev.target;if(!t||!t.closest)return;
  const el=t.closest('button,input,select,textarea,label,[onclick],a');if(!el)return;
  if(el.tagName==='A'||permitido(el)&&!el.matches('input,select,textarea'))return;
  if(el.closest&&el.closest(OK_MENU)&&!el.matches('input,select,textarea'))return;
  ev.preventDefault();ev.stopImmediatePropagation();toast('👁','Solo consulta','Desde aquí no se puede cambiar nada.')}
function activarLock(){
  const root=document.getElementById('app');if(!root)return;
  bloquear(root);
  obs=new MutationObserver(()=>{if(fr)return;fr=requestAnimationFrame(()=>{fr=0;bloquear(root)})});
  obs.observe(root,{childList:true,subtree:true});
  ['click','change','input','keydown','submit'].forEach(k=>document.addEventListener(k,guardia,true))}
function quitarLock(){
  if(obs){obs.disconnect();obs=null}
  ['click','change','input','keydown','submit'].forEach(k=>document.removeEventListener(k,guardia,true))}
const api={_t:{bloquear,guardia,set:v=>{V=v}},on:()=>!!V,banner,
  async entrar(id,nombre,rol){
    if(V)return;
    try{
      toast('⏳','Entrando al entorno…','Un momento.');
      const r=await sb.functions.invoke('ver-como',{body:{target:id}});
      if(r.error){let m=r.error.message;try{const j=await r.error.context.json();if(j&&j.error)m=j.error}catch(x){}throw new Error(m)}
      if(!r.data||!r.data.access_token)throw new Error((r.data&&r.data.error)||'No se pudo entrar');
      const mem={};const vsb=supabase.createClient(URL_,KEY,{auth:{persistSession:false,autoRefreshToken:true,detectSessionInUrl:false,storageKey:'aic-ver-como',storage:{getItem:k=>mem[k]??null,setItem:(k,v)=>{mem[k]=v},removeItem:k=>{delete mem[k]}}}});
      const o=await vsb.auth.setSession({access_token:r.data.access_token,refresh_token:r.data.refresh_token});
      if(o.error)throw o.error;
      const volver=tab;
      V={real:sb,vsb,nombre,rol:rol==='coordinador'?'Coordinador':'Docente',volver};
      try{leaveChat();if(liveChan){sb.removeChannel(liveChan);liveChan=null}}catch(x){}
      sb=candado(vsb);D={};tab=rol==='coordinador'?'dcol':'prof';
      await boot();
      if(M&&M.id!==id){await api.salir();throw new Error('No se pudo abrir ese entorno')}
      activarLock();window.scrollTo(0,0);
    }catch(x){err(x)}
  },
  async salir(){
    if(!V)return;
    const volver=V.volver,real=V.real;
    try{leaveChat();if(liveChan){sb.removeChannel(liveChan);liveChan=null}}catch(x){}
    try{await V.vsb.auth.signOut({scope:'local'})}catch(x){}
    quitarLock();sb=real;V=null;D={};M=null;
    await boot();
    if(M)go(['ddoc','dcoo'].includes(volver)?volver:'ddoc');
  }
};
return api})();
