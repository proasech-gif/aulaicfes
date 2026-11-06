/* AulaICFES — Dashboard docente profesional
   Consume exclusivamente los intentos y perfiles ya cargados por la aplicación.
   No genera resultados ficticios ni altera el esquema de Supabase. */
(function(){
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
  const fmt=n=>Number(n||0).toLocaleString('es-CO',{maximumFractionDigits:1});
  const date=s=>s?new Date(s).toLocaleDateString('es-CO',{day:'2-digit',month:'short'}):'—';
  const nav=[
    ['prof','▦','Dashboard'],['cur','♙','Cursos y estudiantes'],['simp','▤','Simulacros y tareas'],
    ['imp','▣','Imprimir pruebas'],['cal','✓','Calificar respuestas'],['preg','▧','Banco de preguntas'],
    ['banco','▤','Paquetes de preguntas'],['clase','▣','Aula virtual'],['mhor','▦','Mi horario']
  ];
  function stats(data){
    const all=data||[],students=new Set(all.map(x=>x.profiles?.id||x.profiles?.full_name).filter(Boolean));
    const subjects={}; all.forEach(x=>{const k=x.subject||'Sin materia';(subjects[k]||(subjects[k]=[])).push(Number(x.score)||0)});
    const recent=[...all].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    const daily={}; [...all].sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)).forEach(x=>{
      const k=x.created_at?new Date(x.created_at).toLocaleDateString('es-CO',{day:'2-digit',month:'short'}):'';
      if(k)(daily[k]||(daily[k]=[])).push(Number(x.score)||0);
    });
    const scores=all.map(x=>Number(x.score)||0);
    const bands=[0,0,0,0];scores.forEach(s=>{if(s<40)bands[0]++;else if(s<60)bands[1]++;else if(s<80)bands[2]++;else bands[3]++});
    return {all,students:students.size,subjects,recent,trend:Object.entries(daily).slice(-10),avg:mean(scores),best:scores.length?Math.max(...scores):0,bands};
  }
  function view(D,M){
    const s=stats(D.all||[]),name=(M?.full_name||'Docente').trim().split(/\s+/)[0],school=M?.school_other||'Tu espacio docente';
    const has=s.all.length;
    const navHtml=nav.filter(([k])=>k!=='banco'||M?.is_admin).map(([k,ic,l])=>`<button class="aic-nav ${k==='prof'?'active':''}" onclick="go('${k}')"><span>${ic}</span>${l}</button>`).join('');
    const subjectRows=Object.entries(s.subjects).sort((a,b)=>mean(b[1])-mean(a[1]));
    const recent=s.recent.slice(0,7);
    return `<div class="aic-shell">
      <aside class="aic-sidebar"><div class="aic-brand"><div class="aic-logo">🎓</div><div><b>Aula<span>ICFES</span></b><small>Analiza · Mejora · Avanza</small></div></div>
        <div class="aic-side-label">MENÚ PRINCIPAL</div><nav>${navHtml}</nav>
        <div class="aic-side-bottom"><div class="aic-avatar">${esc((M?.full_name||'D').slice(0,1).toUpperCase())}</div><div><b>${esc(M?.full_name||'Docente')}</b><small>Cuenta docente</small></div><button onclick="logout()" title="Cerrar sesión">↗</button></div>
      </aside>
      <main class="aic-main">
        <header class="aic-top"><div><div class="aic-eyebrow">ESPACIO DE TRABAJO</div><h1>Dashboard académico</h1><p>${esc(school)} · Resumen de actividad y desempeño</p></div>
          <div class="aic-top-actions"><span class="aic-status"><i></i> Datos de tu cuenta</span><button class="aic-icon-btn" onclick="passModal()" title="Cambiar contraseña">⚙</button><button class="aic-user" onclick="logout()"><span class="aic-avatar">${esc((M?.full_name||'D').slice(0,1).toUpperCase())}</span><span>${esc(M?.full_name||'Docente')}<small>Cerrar sesión</small></span>⌄</button></div>
        </header>
        <section class="aic-hero"><div class="aic-hero-copy"><span class="aic-kicker">TU CENTRO DE ANÁLISIS</span><h2>¡Hola, ${esc(name)}! 👋</h2><p>Convierte los resultados de tus estudiantes en decisiones pedagógicas.</p><div class="aic-hero-actions"><button onclick="go(\'simp\')">＋ Crear simulacro</button><button class="ghost" onclick="go('cur')">Ver mis cursos <b>→</b></button></div></div><div class="aic-hero-art"><div class="aic-orbit orbit1"></div><div class="aic-orbit orbit2"></div><div class="aic-book">📘</div><div class="aic-cap">🎓</div></div></section>
        <div class="aic-section-head"><div><h2>Indicadores generales</h2><p>Información calculada a partir de los intentos registrados</p></div><span class="aic-period">Todos los periodos disponibles</span></div>
        <section class="aic-kpis">
          <article class="aic-kpi"><div class="aic-kpi-icon blue">▤</div><div><small>Intentos registrados</small><strong>${fmt(s.all.length)}</strong><span>En tus cursos</span></div><div class="aic-kpi-mark">↗</div></article>
          <article class="aic-kpi"><div class="aic-kpi-icon green">♙</div><div><small>Estudiantes con actividad</small><strong>${fmt(s.students)}</strong><span>Con al menos un intento</span></div><div class="aic-kpi-mark">◎</div></article>
          <article class="aic-kpi"><div class="aic-kpi-icon violet">◉</div><div><small>Promedio de resultados</small><strong>${has?fmt(s.avg):'—'}${has?'<em>/100</em>':''}</strong><span>Escala de calificación registrada</span></div><div class="aic-kpi-mark">⌁</div></article>
          <article class="aic-kpi"><div class="aic-kpi-icon orange">★</div><div><small>Mejor resultado</small><strong>${has?fmt(s.best):'—'}${has?'<em>/100</em>':''}</strong><span>Mayor puntaje registrado</span></div><div class="aic-kpi-mark">✦</div></article>
        </section>
        <section class="aic-chart-grid"><article class="aic-card aic-wide"><div class="aic-card-head"><div><h3>Desempeño por asignatura</h3><p>Promedio de puntajes registrados · escala 0 a 100</p></div><span class="aic-chip">Por materia</span></div>${has?'<div class="aic-chart"><canvas id="aic-subject-chart"></canvas></div>':'<div class="aic-empty"><span>▥</span><b>Aún no hay resultados para analizar</b><p>Cuando tus estudiantes presenten simulacros o tareas, aquí verás el promedio por asignatura.</p><button onclick="go(\'simp\')">Crear primer simulacro</button></div>'}</article>
          <article class="aic-card"><div class="aic-card-head"><div><h3>Evolución de resultados</h3><p>Promedio por fecha de actividad</p></div><span class="aic-mini-legend"><i></i> Puntaje</span></div>${has?'<div class="aic-chart aic-chart-tall"><canvas id="aic-trend-chart"></canvas></div>':'<div class="aic-empty compact">La evolución aparecerá cuando existan intentos.</div>'}</article></section>
        <section class="aic-lower-grid"><article class="aic-card"><div class="aic-card-head"><div><h3>Distribución de resultados</h3><p>Rangos de puntaje de los intentos</p></div></div>${has?`<div class="aic-dist">${[['0–39',s.bands[0],'low'],['40–59',s.bands[1],'mid'],['60–79',s.bands[2],'good'],['80–100',s.bands[3],'high']].map(([l,n,c])=>`<div class="aic-dist-row"><div><span>${l} puntos</span><b>${n}</b></div><div class="aic-track"><i class="${c}" style="width:${s.all.length?n/s.all.length*100:0}%"></i></div></div>`).join('')}</div>`:'<div class="aic-empty compact">Sin datos suficientes.</div>'}</article>
          <article class="aic-card"><div class="aic-card-head"><div><h3>Promedios por asignatura</h3><p>Ordenados de mayor a menor</p></div><button class="aic-link" onclick="go('prof')">Actualizar ↗</button></div>${has?`<div class="aic-subject-list">${subjectRows.map(([k,v],i)=>`<div class="aic-subject-row"><span class="aic-subject-dot dot${i%5}"></span><span>${esc(k)}</span><b>${fmt(mean(v))}</b><small>${v.length} ${v.length===1?'intento':'intentos'}</small></div>`).join('')}</div>`:'<div class="aic-empty compact">Los promedios aparecerán al registrar resultados.</div>'}</article></section>
        <section class="aic-card aic-recent"><div class="aic-card-head"><div><h3>Actividad reciente</h3><p>Últimos resultados registrados en tus cursos</p></div><button class="aic-link" onclick="exportCSV()">↓ Exportar CSV</button></div>${recent.length?`<div class="aic-table-wrap"><table><thead><tr><th>ESTUDIANTE</th><th>CURSO</th><th>ASIGNATURA</th><th>SIMULACRO / TAREA</th><th>PUNTAJE</th><th>FECHA</th></tr></thead><tbody>${recent.map(a=>`<tr><td><b>${esc(a.profiles?.full_name||'Estudiante')}</b></td><td>${esc(a.profiles?.courses?.name||'—')}</td><td>${esc(a.subject||'—')}</td><td>${esc(a.simulacros?.title||'Actividad')}</td><td><span class="aic-score ${Number(a.score)>=80?'score-high':Number(a.score)>=60?'score-mid':'score-low'}">${fmt(a.score)}</span></td><td>${date(a.created_at)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="aic-empty compact">Todavía no hay actividad registrada. Crea un simulacro y asígnalo a uno de tus cursos.</div>'}</section>
        <footer class="aic-footer"><span>🎓 <b>AulaICFES</b> · Herramientas para mejorar el aprendizaje</span><span>Los indicadores se actualizan con los datos disponibles en la plataforma.</span></footer>
      </main></div>`;
  }
  function mount(D,M,charts){
    if(!window.Chart)return;
    const s=stats(D.all||[]); if(!s.all.length)return;
    const subjects=Object.entries(s.subjects).sort((a,b)=>mean(b[1])-mean(a[1]));
    const c1=document.getElementById('aic-subject-chart');
    if(c1)charts.push(new Chart(c1,{type:'bar',data:{labels:subjects.map(x=>x[0]),datasets:[{label:'Promedio',data:subjects.map(x=>mean(x[1])),backgroundColor:['#2864e8','#19a879','#8758df','#f59b32','#22a6b5'],borderRadius:8,maxBarThickness:42}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>` ${fmt(c.raw)} / 100`}}},scales:{y:{min:0,max:100,grid:{color:'#edf1f7'},ticks:{stepSize:20}},x:{grid:{display:false}}}}}));
    const c2=document.getElementById('aic-trend-chart');
    if(c2)charts.push(new Chart(c2,{type:'line',data:{labels:s.trend.map(x=>x[0]),datasets:[{label:'Promedio',data:s.trend.map(x=>mean(x[1])),borderColor:'#2864e8',backgroundColor:'rgba(40,100,232,.10)',fill:true,tension:.35,pointRadius:3,pointBackgroundColor:'#fff',pointBorderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>` ${fmt(c.raw)} / 100`}}},scales:{y:{min:0,max:100,grid:{color:'#edf1f7'},ticks:{stepSize:20}},x:{grid:{display:false}}}}}));
  }
  window.AulaDashboard={view,mount};
})();