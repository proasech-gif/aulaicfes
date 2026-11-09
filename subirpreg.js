/* AulaICFES — El docente sube preguntas para alimentar el banco (una por una o pegando varias). */
window.SUBP=(function(){
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const R=()=>render();
const inp='style="width:100%;border:1px solid #cbd5e1;border-radius:8px;padding:9px"';
let Z={subs:[],f:null,m:'uno',txt:'',prev:[],mis:0};
const nuevo=()=>({subject:Z.f?Z.f.subject:'',grade:Z.f?Z.f.grade:'',competency:'',stimulus_title:'',stimulus_content:'',body:'',options:['','','',''],correct:0,explanation:''});
async function load(){
  const s=await sb.from('asignaturas').select('nombre,banco_subject').order('nombre');
  const seen=new Set();Z.subs=(s.data||[]).filter(x=>x.banco_subject&&!seen.has(x.banco_subject)&&seen.add(x.banco_subject));
  if(!Z.f)Z.f=nuevo();
  const c=await sb.from('questions').select('id',{count:'exact',head:true}).eq('autor_id',M.id);Z.mis=c.count||0;
}
function parse(t){
  const bloques=t.replace(/\r/g,'').split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean),out=[],mal=[];
  bloques.forEach((b,i)=>{
    const ls=b.split('\n').map(x=>x.trim()).filter(Boolean),opts=[];let enun=[],resp=null,expl='';
    ls.forEach(l=>{
      let m;
      if((m=l.match(/^([A-Ea-e])[\)\.\-]\s*(.+)$/)))opts[m[1].toUpperCase().charCodeAt(0)-65]=m[2];
      else if((m=l.match(/^(respuesta|correcta|clave)\s*[:\-]?\s*([A-Ea-e])/i)))resp=m[2].toUpperCase().charCodeAt(0)-65;
      else if((m=l.match(/^(explicaci[oó]n|justificaci[oó]n)\s*[:\-]\s*(.+)$/i)))expl=m[2];
      else if(!opts.length)enun.push(l);
    });
    const o=opts.filter(x=>x!==undefined);
    if(enun.join(' ').length<10||o.length<2||resp===null||resp>=opts.length||opts[resp]===undefined)mal.push(i+1);
    else out.push({body:enun.join(' '),options:opts.map(x=>x||'').filter((x,k)=>x!==''||k<opts.length),correct:resp,explanation:expl});
  });
  return{out,mal};
}
function form(){
  const f=Z.f;
  const comun=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px"><label style="font-size:13px">Asignatura<select ${inp} onchange="SUBP.set('subject',this.value)"><option value="">Elige…</option>${Z.subs.map(s=>`<option value="${e(s.banco_subject)}" ${f.subject===s.banco_subject?'selected':''}>${e(s.nombre)}</option>`).join('')}</select></label>
   <label style="font-size:13px">Grado<select ${inp} onchange="SUBP.set('grade',this.value)"><option value="">Elige…</option>${[0,1,2,3,4,5,6,7,8,9,10,11].map(g=>`<option value="${g}" ${String(f.grade)===String(g)?'selected':''}>${g===0?'Transición':g+'°'}</option>`).join('')}</select></label>
   <label style="font-size:13px">Competencia (opcional)<input ${inp} value="${e(f.competency)}" oninput="SUBP.set('competency',this.value,1)" placeholder="Ej: Razonamiento"></label></div>`;
  if(Z.m==='uno')return`${comun}
   <label style="font-size:13px;display:block;margin-top:10px">Texto o contexto (opcional, si la pregunta lleva lectura)<textarea rows="4" ${inp} oninput="SUBP.set('stimulus_content',this.value,1)">${e(f.stimulus_content)}</textarea></label>
   <label style="font-size:13px;display:block;margin-top:10px">Pregunta<textarea rows="3" ${inp} oninput="SUBP.set('body',this.value,1)">${e(f.body)}</textarea></label>
   <div style="margin-top:10px;display:grid;gap:6px">${f.options.map((o,i)=>`<label style="display:flex;gap:8px;align-items:center"><input type="radio" name="sp_c" ${f.correct===i?'checked':''} onchange="SUBP.set('correct',${i},1)" title="Respuesta correcta"><b>${'ABCDE'[i]}</b><input ${inp} value="${e(o)}" oninput="SUBP.op(${i},this.value)"></label>`).join('')}</div>
   <p style="font-size:12px;color:#64748b;margin:4px 0">Marca con el círculo la respuesta correcta. ${f.options.length<5?`<button class="aic-link" onclick="SUBP.mas()">+ Agregar opción E</button>`:''}</p>
   <label style="font-size:13px;display:block;margin-top:6px">¿Por qué es correcta? (opcional)<input ${inp} value="${e(f.explanation)}" oninput="SUBP.set('explanation',this.value,1)"></label>
   <button onclick="SUBP.enviarUno()" style="margin-top:12px;background:#16a34a;color:#fff;padding:12px 18px;border-radius:10px;font-weight:800">➕ Agregar al banco</button>`;
  return`${comun}<p style="font-size:13px;margin:10px 0 4px">Pega varias preguntas. Separa cada pregunta con una <b>línea en blanco</b> y escríbelas así:</p>
   <pre style="background:#f1f5f9;border-radius:8px;padding:8px;font-size:12px;white-space:pre-wrap">¿Cuál es la capital de Colombia?
A) Medellín
B) Bogotá
C) Cali
D) Cartagena
Respuesta: B
Explicación: Bogotá es la capital.</pre>
   <textarea rows="12" ${inp} oninput="SUBP.txt=this.value" placeholder="Pega aquí tus preguntas…">${e(Z.txt)}</textarea>
   <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button onclick="SUBP.revisar()" style="background:#246be0;color:#fff;padding:10px 16px;border-radius:10px;font-weight:700">🔎 Revisar</button>${Z.prev.length?`<button onclick="SUBP.enviarVarias()" style="background:#16a34a;color:#fff;padding:10px 16px;border-radius:10px;font-weight:800">➕ Agregar ${Z.prev.length} al banco</button>`:''}</div>
   ${Z.msg?`<p style="font-size:13px;margin-top:8px">${Z.msg}</p>`:''}`;
}
const api={
  load,
  view:()=>`<div class="aic-card" style="padding:18px"><h2 style="font-weight:800;font-size:20px">📥 Subir preguntas al banco</h2><p style="font-size:13px;color:#64748b;margin:4px 0 10px">Tus preguntas quedan en el banco de la asignatura y las puedes usar en tus pruebas para imprimir. Llevas <b>${Z.mis}</b> subidas.</p>
   <div style="display:flex;gap:8px;margin-bottom:12px"><button onclick="SUBP.modo('uno')" style="padding:8px 14px;border-radius:8px;font-weight:700;${Z.m==='uno'?'background:#246be0;color:#fff':'background:#e2e8f0'}">Una por una</button><button onclick="SUBP.modo('varias')" style="padding:8px 14px;border-radius:8px;font-weight:700;${Z.m==='varias'?'background:#246be0;color:#fff':'background:#e2e8f0'}">Pegar varias</button></div>${form()}</div>`,
  set(k,v,q){Z.f[k]=k==='correct'?+v:v;if(!q)R()},
  op(i,v){Z.f.options[i]=v},
  mas(){Z.f.options.push('');R()},
  modo(m){Z.m=m;R()},
  set txt(v){Z.txt=v},
  revisar(){
    const t=document.querySelector('textarea[placeholder^="Pega"]');if(t)Z.txt=t.value;
    const r=parse(Z.txt);Z.prev=r.out;
    Z.msg=`✅ ${r.out.length} pregunta(s) bien escrita(s).${r.mal.length?` ⚠️ Revisa la(s) pregunta(s) n.° ${r.mal.join(', ')}: falta el enunciado, las opciones o la línea “Respuesta: X”.`:''}`;R();
  },
  async enviar(items){
    const f=Z.f;if(!f.subject)return toast('⚠️','Elige la asignatura','');if(f.grade==='')return toast('⚠️','Elige el grado','');
    items=items.map(x=>({...x,subject:f.subject,grade:+f.grade,competency:f.competency}));
    const r=await sb.rpc('docente_subir_preguntas',{p_items:items});
    if(r.error)return toast('⚠️','No se agregó',r.error.message);
    toast('✅','Agregadas al banco',r.data+' pregunta(s).');return r.data;
  },
  async enviarUno(){
    const f=Z.f,o=f.options.map(x=>x.trim());
    if(!o[f.correct])return toast('⚠️','Respuesta correcta','La opción marcada como correcta está vacía.');
    const n=await api.enviar([{body:f.body,options:o.filter(x=>x),correct:f.correct-o.slice(0,f.correct).filter(x=>!x).length,explanation:f.explanation,stimulus_title:f.stimulus_title,stimulus_content:f.stimulus_content}]);
    if(n){Z.f={...nuevo(),subject:f.subject,grade:f.grade,competency:f.competency};await load();R()}
  },
  async enviarVarias(){const n=await api.enviar(Z.prev);if(n){Z.txt='';Z.prev=[];Z.msg='';await load();R()}}
};
return api;
})();
