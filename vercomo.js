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
  return`<div style="position:sticky;top:0;z-index:50;background:#b45309;color:#fff;padding:10px 14px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;border-radius:0 0 12px 12px;box-shadow:0 2px 8px #0003"><div style="font-weight:800;font-size:14px">👁 Estás viendo el entorno de ${e(V.nombre)} <span style="font-weight:400">· ${e(V.rol)} · solo consulta, no se puede cambiar nada</span></div><button onclick="VC.salir()" style="background:#fff;color:#92400e;padding:8px 14px;border-radius:10px;font-weight:800">↩ Volver a mi entorno</button></div>`}
const api={on:()=>!!V,banner,
  async entrar(id,nombre,rol){
    if(V)return;
    try{
      toast('⏳','Entrando al entorno…','Un momento.');
      const r=await sb.functions.invoke('ver-como',{body:{target:id}});
      if(r.error){let m=r.error.message;try{const j=await r.error.context.json();if(j&&j.error)m=j.error}catch(x){}throw new Error(m)}
      if(!r.data||!r.data.token_hash)throw new Error((r.data&&r.data.error)||'No se pudo entrar');
      const mem={};const vsb=supabase.createClient(URL_,KEY,{auth:{persistSession:false,autoRefreshToken:true,detectSessionInUrl:false,storageKey:'aic-ver-como',storage:{getItem:k=>mem[k]??null,setItem:(k,v)=>{mem[k]=v},removeItem:k=>{delete mem[k]}}}});
      let o=await vsb.auth.verifyOtp({token_hash:r.data.token_hash,type:'magiclink'});
      if(o.error)o=await vsb.auth.verifyOtp({token_hash:r.data.token_hash,type:'email'});
      if(o.error)throw o.error;
      const volver=tab;
      V={real:sb,nombre,rol:rol==='coordinador'?'Coordinador':'Docente',volver};
      try{leaveChat();if(liveChan){sb.removeChannel(liveChan);liveChan=null}}catch(x){}
      sb=candado(vsb);D={};tab=rol==='coordinador'?'dcol':'prof';
      await boot();
      if(M&&M.id!==id){await api.salir();throw new Error('No se pudo abrir ese entorno')}
      window.scrollTo(0,0);
    }catch(x){err(x)}
  },
  async salir(){
    if(!V)return;
    const volver=V.volver,real=V.real;
    try{leaveChat();if(liveChan){sb.removeChannel(liveChan);liveChan=null}}catch(x){}
    try{await sb.auth.getSession()}catch(x){}
    sb=real;V=null;D={};M=null;
    await boot();
    if(M)go(['ddoc','dcoo'].includes(volver)?volver:'ddoc');
  }
};
return api})();
