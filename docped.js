/* AULA360 — Documentos pedagógicos reglamentarios (docente): planeador, observador/ficha de seguimiento y plan de área en un solo lugar */
window.DPD=(function(){
let sub='planeador';
const MODS={planeador:['planeador.js?v=6','PLN','planeador','📒 Planeador'],obsv:['observador.js?v=2','OBS','obsv','📘 Observador y ficha de seguimiento'],plan:['docente.js?v=9','DOCP','plan','🗂️ Plan de área']};
async function load(s){if(s&&MODS[s])sub=s;const m=MODS[sub];await loadScript(m[0]);await window[m[1]].load(m[2])}
function tabs(){return`<div class="aic-card" style="padding:14px"><h2 style="font-weight:800;font-size:19px">📚 Documentos pedagógicos reglamentarios</h2><p style="font-size:13px;color:#64748b;margin:3px 0 10px">Todos tus documentos obligatorios en un solo lugar.</p><div style="display:flex;flex-wrap:wrap;gap:8px">${Object.keys(MODS).map(k=>`<button onclick="DPD.tab('${k}')" style="padding:9px 14px;border-radius:10px;font-weight:800;border:1.5px solid ${sub===k?'#1e63e9':'#cbd5e1'};background:${sub===k?'#e8f1ff':'#fff'};color:${sub===k?'#1e3a8a':'#334155'}">${MODS[k][3]}</button>`).join('')}</div></div>`}
function view(){const m=MODS[sub];return`<div style="display:grid;gap:14px">${tabs()}${window[m[1]]?window[m[1]].view(m[2]==='plan'?'plan':undefined):''}</div>`}
return{load,view,async tab(s){try{await load(s);render()}catch(x){err(x)}}}})();
