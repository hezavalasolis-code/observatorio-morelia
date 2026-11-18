/* ══════════════════════════════════════════════════════════════════════════
   Navegación y acceso comunes del Observatorio Forestal de Morelia (D18, D21)
   Un solo menú y un solo inicio de sesión para todas las páginas.
   - <div data-ofm-barra="Sección"></div>: barra superior con ☰, título (lleva al
     inicio), enlaces de sección en escritorio y botón «Entrar».
   - En el mapa, el ☰ va dentro del buscador (#bForm).
   - window.ofmAuth: cliente de Supabase compartido y sesión, para las páginas.
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
  // Aviso de D9, en un solo lugar para todas las páginas (A6 · 12-11-2026). Las páginas lo piden con
  // <div data-ofm-aviso></div>; el mapa lo lee de window.OFM_AVISO para la ficha y el panel.
  const AVISO='<b>Ejercicio de investigación científica, no documento legal.</b> Los límites provienen del Programa Municipal de Desarrollo Urbano (PMDU) de Morelia 2022-2041, simplificados para el mapa. La pérdida detectada describe un cambio en la vegetación, no quién lo hizo ni si fue legal.';
  window.OFM_AVISO=AVISO;
  // Cliente compartido: se crea al cargar el script (va en <head>, después de supabase-js
  // y sb-config.js), para que los scripts de cada página lo encuentren listo.
  const oyentes=[]; let sesion=null, perfil=null, listo=false;
  // Llegada desde el correo «Olvidé mi contraseña»: se anota antes de que el cliente lea la dirección.
  window.ofmRecuperacion=/type=recovery/.test(location.hash);
  const sb=(window.supabase&&window.SB_CONFIG)?window.supabase.createClient(SB_CONFIG.url,SB_CONFIG.key):null;
  async function cargarPerfil(){ perfil=null; if(!sb||!sesion)return;
    const {data}=await sb.from('profiles').select('role,aprobado,aprobado_por,motivo,acepta_aviso_at,display_name,rechazado_at,motivo_rechazo').eq('id',sesion.user.id).maybeSingle();
    perfil=data||null; }
  async function avisar(){ await cargarPerfil(); listo=true; oyentes.forEach(f=>{try{f(sesion,perfil);}catch(e){}}); pintarSesion(); }
  if(sb){ sb.auth.getSession().then(({data})=>{sesion=data.session; avisar();});
          sb.auth.onAuthStateChange((_e,s)=>{ const cambio=(s&&s.user&&s.user.id)!==(sesion&&sesion.user&&sesion.user.id); sesion=s; if(cambio||!listo) avisar(); }); }
  window.ofmAuth={sb, get sesion(){return sesion;}, get perfil(){return perfil;},
    onSesion(f){oyentes.push(f); if(listo){try{f(sesion,perfil);}catch(e){}}},
    abrirAcceso(){abrirAcceso();}, salir(){ if(sb) sb.auth.signOut(); }};

  const ITEMS=[
    {t:'Inicio',        d:'Qué es el observatorio y qué encontrarás', href:'./index.html'},
    {t:'Mapa',          d:'Consultar un lugar y ver la pérdida de bosque', href:'./mapa.html'},
    {t:'Datos',         d:'Cuánto bosque se perdió, cuándo y dónde', href:'./datos.html'},
    {t:'Participación', d:'Tu historial: verificaciones, aportes y territorios', href:'./participacion.html'},
    {t:'Acerca de',     d:'Quién lo hace, qué se puede afirmar y cómo citar', href:'./acerca.html'},
    {t:'Aviso de privacidad', d:'Qué datos se guardan y para qué', href:'./privacidad.html'},
    {t:'Moderación',    d:'Solicitudes, participantes y aportes', href:'./moderacion.html', admin:true}
  ];
  const css=`
  .ofm-burger{display:inline-flex;align-items:center;justify-content:center;width:44px;min-width:44px;height:44px;background:transparent;border:none;color:#e8eef4;font-size:22px;cursor:pointer;border-radius:8px;padding:0}
  .ofm-burger:hover,.ofm-burger:focus-visible{background:rgba(255,255,255,.08);outline:none}
  .ofm-barra{display:flex;align-items:center;gap:8px;padding:8px 14px;background:#16212e;border-bottom:1px solid #2b3d4f;position:sticky;top:0;z-index:50;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
  .ofm-barra a.ofm-titulo{color:#e8eef4;text-decoration:none;font-weight:700;font-size:15px;white-space:nowrap}
  .ofm-barra .ofm-secs{display:flex;gap:2px;margin-left:14px}
  .ofm-barra .ofm-secs a{color:#9fb2c4;text-decoration:none;font-size:14px;padding:8px 11px;border-radius:7px}
  .ofm-barra .ofm-secs a:hover{color:#e8eef4;background:rgba(255,255,255,.06)}
  .ofm-barra .ofm-secs a[aria-current="page"]{color:#e8eef4;background:rgba(63,178,127,.14)}
  .ofm-barra .ofm-entrar{margin-left:auto}
  .ofm-entrar{background:#3fb27f;color:#06231a;border:none;border-radius:8px;padding:9px 14px;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap;text-decoration:none;font-family:inherit}
  .ofm-entrar.sec{background:transparent;color:#e8eef4;border:1px solid #2b3d4f;font-weight:500}
  @media(max-width:820px){.ofm-barra .ofm-secs{display:none}.ofm-barra a.ofm-titulo{font-size:14px;white-space:normal;line-height:1.2}}
  .ofm-velo{position:fixed;inset:0;background:rgba(5,9,14,.55);z-index:4000;opacity:0;pointer-events:none;transition:opacity .2s}
  .ofm-velo.abierto{opacity:1;pointer-events:auto}
  .ofm-cajon{position:fixed;top:0;left:0;bottom:0;width:min(320px,86vw);background:#16212e;border-right:1px solid #2b3d4f;z-index:4001;transform:translateX(-102%);transition:transform .22s ease;display:flex;flex-direction:column;box-shadow:8px 0 28px rgba(0,0,0,.5);font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
  .ofm-cajon.abierto{transform:none}
  .ofm-cajon header{display:flex;align-items:center;gap:6px;padding:10px 10px 10px 16px;border-bottom:1px solid #2b3d4f}
  .ofm-cajon header b{flex:1;font-size:15px;color:#e8eef4}
  .ofm-cajon nav{padding:8px 0;overflow-y:auto}
  .ofm-cajon nav a{display:block;padding:11px 18px;color:#e8eef4;text-decoration:none;border-left:3px solid transparent}
  .ofm-cajon nav a[hidden]{display:none}
  .ofm-cajon nav a:hover,.ofm-cajon nav a:focus-visible{background:#1e2c3c;outline:none}
  .ofm-cajon nav a[aria-current="page"]{border-left-color:#3fb27f;background:rgba(63,178,127,.08)}
  .ofm-cajon nav a span{display:block;font-size:14.5px}
  .ofm-cajon nav a small{display:block;font-size:12px;color:#9fb2c4;margin-top:1px}
  .ofm-cajon nav a.ofm-admin{border-top:1px solid #2b3d4f;margin-top:6px}
  .ofm-pend{display:inline-block;min-width:18px;padding:1px 6px;margin-left:6px;border-radius:9px;background:#f0a020;color:#1a1200;font-size:11.5px;font-weight:700;text-align:center;vertical-align:1px}
  .ofm-burger{position:relative}
  .ofm-burger[data-pend]::after{content:"";position:absolute;top:8px;right:8px;width:8px;height:8px;border-radius:50%;background:#f0a020}
  .ofm-cajon .ofm-cuenta{padding:12px 16px;border-top:1px solid #2b3d4f;display:flex;flex-direction:column;gap:8px;font-size:12.5px;color:#9fb2c4}
  .ofm-cajon footer{margin-top:auto;padding:12px 16px;border-top:1px solid #2b3d4f;font-size:12px;color:#9fb2c4;line-height:1.5}
  .ofm-modal{position:fixed;inset:0;z-index:4100;display:none;align-items:center;justify-content:center;background:rgba(5,9,14,.65);padding:16px;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
  .ofm-modal.abierto{display:flex}
  .ofm-modal .caja{background:#16212e;border:1px solid #2b3d4f;border-radius:14px;padding:20px 22px;width:min(400px,100%);color:#e8eef4;box-shadow:0 12px 40px rgba(0,0,0,.6)}
  .ofm-modal h2{margin:0 0 4px;font-size:18px}
  .ofm-modal p{margin:0 0 12px;font-size:13px;color:#9fb2c4;line-height:1.5}
  .ofm-modal label{display:block;font-size:12px;color:#9fb2c4;margin:10px 0 4px}
  .ofm-modal input{width:100%;box-sizing:border-box;background:#1e2c3c;color:#e8eef4;border:1px solid #2b3d4f;border-radius:8px;padding:10px 12px;font-size:15px}
  .ofm-modal .fila{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}
  .ofm-modal .fila button{flex:1}
  .ofm-modal .msg{font-size:12.5px;margin-top:10px;min-height:1em;line-height:1.4}
  .ofm-modal a{color:#f0a020}
  .ofm-modal .cerrar{float:right;background:none;border:none;color:#9fb2c4;font-size:22px;cursor:pointer;line-height:1}
  .ofm-barra a:focus-visible,.ofm-barra button:focus-visible,.ofm-cajon a:focus-visible,.ofm-modal :focus-visible{outline:2px solid #3fb27f;outline-offset:2px}
  @media (prefers-reduced-motion:reduce){.ofm-velo,.ofm-cajon{transition:none}}`;
  const el=(tag,attrs,html)=>{const e=document.createElement(tag);Object.entries(attrs||{}).forEach(([k,v])=>e.setAttribute(k,v));if(html!=null)e.innerHTML=html;return e;};
  const pagina=()=>location.pathname.split('/').pop()||'index.html';
  const esActual=it=>it.href.replace('./','')===pagina();

  let caj, velo, modal;
  function construir(){
    const st=el('style'); st.textContent=css; document.head.appendChild(st);
    velo=el('div',{class:'ofm-velo'});
    caj=el('aside',{class:'ofm-cajon',id:'ofmMenu','aria-label':'Menú del sitio','aria-hidden':'true'});
    caj.innerHTML='<header><b>Observatorio Forestal de Morelia</b><button class="ofm-burger" type="button" aria-label="Cerrar el menú">✕</button></header><nav></nav>'+
      '<div class="ofm-cuenta" data-ofm-cuenta></div>'+
      '<footer>Posgrado en Geografía · CIGA-UNAM<br>H. E. Zavala Solís · CC BY-NC-ND 4.0</footer>';
    const nav=caj.querySelector('nav');
    ITEMS.forEach(it=>{const a=el('a',{href:it.href},'<span>'+it.t+'</span><small>'+it.d+'</small>');
      if(it.admin){a.className='ofm-admin';a.hidden=true;a.dataset.admin='1';}
      if(esActual(it))a.setAttribute('aria-current','page');
      nav.appendChild(a);});
    document.body.appendChild(velo); document.body.appendChild(caj);
    velo.addEventListener('click',cerrar); caj.querySelector('header .ofm-burger').addEventListener('click',cerrar);
    document.addEventListener('keydown',e=>{
      if(modal&&modal.classList.contains('abierto')&&e.key==='Escape'){cerrarAcceso();return;}
      if(!caj.classList.contains('abierto'))return;
      if(e.key==='Escape'){cerrar();return;}
      if(e.key==='Tab'){const f=[...caj.querySelectorAll('a:not([hidden]),button')]; const i=f.indexOf(document.activeElement);
        if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus();} else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus();}}});
    // Barra superior en páginas con data-ofm-barra
    document.querySelectorAll('[data-ofm-barra]').forEach(c=>{
      c.className='ofm-barra'; c.appendChild(boton());
      c.appendChild(el('a',{class:'ofm-titulo',href:'./index.html'},'Observatorio Forestal de Morelia'));
      const secs=el('nav',{class:'ofm-secs','aria-label':'Secciones'});
      ITEMS.slice(1,5).forEach(it=>{const a=el('a',{href:it.href},it.t); if(esActual(it))a.setAttribute('aria-current','page'); secs.appendChild(a);});
      c.appendChild(secs);
      c.appendChild(el('span',{class:'ofm-entrar-sitio','data-ofm-entrar':'1',style:'margin-left:auto'}));});
    // En el mapa, el ☰ va dentro del buscador
    const bf=document.getElementById('bForm'); if(bf) bf.insertBefore(boton(),bf.firstChild);
    document.querySelectorAll('[data-ofm-aviso]').forEach(e=>{e.innerHTML=AVISO;});
    construirAcceso();
    pintarSesion();
  }
  let previo=null;
  function abrir(){previo=document.activeElement; caj.classList.add('abierto'); velo.classList.add('abierto'); caj.setAttribute('aria-hidden','false');
    document.querySelectorAll('[data-ofm-abre]').forEach(b=>b.setAttribute('aria-expanded','true')); caj.querySelector('nav a:not([hidden])').focus();}
  function cerrar(){if(!caj)return; caj.classList.remove('abierto'); velo.classList.remove('abierto'); caj.setAttribute('aria-hidden','true');
    document.querySelectorAll('[data-ofm-abre]').forEach(b=>b.setAttribute('aria-expanded','false')); if(previo&&previo.focus)previo.focus();}
  window.ofmMenu={abrir,cerrar};
  function boton(){const b=el('button',{class:'ofm-burger',type:'button','aria-label':'Abrir el menú','aria-controls':'ofmMenu','aria-expanded':'false','data-ofm-abre':'1'},'☰');
    b.addEventListener('click',abrir); return b;}

  // ── Acceso: correo y contraseña (por defecto) o enlace por correo (D37 · 16-11-2026) ──
  // La contraseña va primero porque el envío de correos de Supabase está limitado (2 por hora
  // y solo al equipo) mientras no haya un servidor de correo propio; el enlace queda como opción.
  const CONTACTO='hezavalasolis@pmip.unam.mx';
  function traducir(m){ m=String(m||'');
    if(/invalid login credentials/i.test(m)) return 'Correo o contraseña incorrectos. Si no recuerdas la contraseña, usa «Olvidé mi contraseña».';
    if(/already registered|already been registered/i.test(m)) return 'Ya existe una cuenta con ese correo: entra con tu contraseña o usa «Olvidé mi contraseña».';
    if(/rate limit|too many|security purposes/i.test(m)) return 'Se alcanzó el límite de correos por ahora. Intenta más tarde o escribe a '+CONTACTO+'.';
    if(/not authorized/i.test(m)) return 'Por ahora el sitio no puede enviar correos a esa dirección. Entra o crea tu cuenta con contraseña, o escribe a '+CONTACTO+'.';
    if(/email not confirmed/i.test(m)) return 'Falta confirmar tu correo. Si no te llegó el mensaje, escribe a '+CONTACTO+'.';
    if(/password/i.test(m)&&/(6|8|characters|short)/i.test(m)) return 'La contraseña debe tener al menos 8 caracteres.';
    return m; }
  function construirAcceso(){
    modal=el('div',{class:'ofm-modal',role:'dialog','aria-modal':'true','aria-labelledby':'ofmAccTit'});
    modal.innerHTML='<div class="caja"><button class="cerrar" type="button" aria-label="Cerrar">×</button>'+
      '<h2 id="ofmAccTit">Entrar</h2><p data-intro>Entra con tu correo y tu contraseña. Si es tu primera vez, crea tu cuenta.</p>'+
      '<label for="ofmAccMail">Correo</label><input id="ofmAccMail" type="email" autocomplete="email" />'+
      '<div data-pass><label for="ofmAccPass">Contraseña</label><input id="ofmAccPass" type="password" autocomplete="current-password" minlength="8" /></div>'+
      '<div class="fila"><button type="button" class="ofm-entrar" data-con-pass>Entrar</button><button type="button" class="ofm-entrar sec" data-crear>Crear cuenta</button>'+
      '<button type="button" class="ofm-entrar" data-magia hidden>Enviarme el enlace</button></div>'+
      '<p style="margin:10px 0 0;font-size:12px"><a href="#" data-olvido>Olvidé mi contraseña</a> · <a href="#" data-alterna>Prefiero recibir un enlace por correo</a> · <a href="./privacidad.html">Aviso de privacidad</a></p>'+
      '<div class="msg" role="status"></div></div>';
    document.body.appendChild(modal);
    const q=s=>modal.querySelector(s), msg=(t,ok)=>{const m=q('.msg'); m.textContent=t; m.style.color=ok?'#3fb27f':'#ff8a95';};
    const correo=()=>q('#ofmAccMail').value.trim(), clave=()=>q('#ofmAccPass').value;
    q('.cerrar').onclick=cerrarAcceso; modal.addEventListener('click',e=>{if(e.target===modal)cerrarAcceso();});
    q('[data-alterna]').onclick=e=>{e.preventDefault(); const p=q('[data-pass]'); const aEnlace=!p.hidden; p.hidden=aEnlace;
      q('[data-con-pass]').hidden=aEnlace; q('[data-crear]').hidden=aEnlace; q('[data-olvido]').hidden=aEnlace; q('[data-magia]').hidden=!aEnlace;
      q('[data-intro]').textContent=aEnlace?'Escribe tu correo y te enviamos un enlace para entrar, sin contraseña.':'Entra con tu correo y tu contraseña. Si es tu primera vez, crea tu cuenta.';
      e.target.textContent=aEnlace?'Prefiero usar contraseña':'Prefiero recibir un enlace por correo'; msg('',true);};
    q('[data-magia]').onclick=async()=>{ if(!sb){msg('El acceso no está disponible en esta copia.',false);return;}
      if(!correo()){msg('Escribe tu correo.',false);return;}
      const {error}=await sb.auth.signInWithOtp({email:correo(),options:{emailRedirectTo:location.href.split('#')[0]}});
      msg(error?traducir(error.message):'Listo: revisa tu correo y abre el enlace (puede tardar un par de minutos o caer en no deseado).',!error);};
    q('[data-con-pass]').onclick=async()=>{ if(!sb)return;
      if(!correo()||!clave()){msg('Escribe tu correo y tu contraseña.',false);return;}
      const {error}=await sb.auth.signInWithPassword({email:correo(),password:clave()});
      if(error)msg(traducir(error.message),false); else cerrarAcceso();};
    q('[data-crear]').onclick=async()=>{ if(!sb)return;
      if(!correo()){msg('Escribe tu correo.',false);return;}
      if(clave().length<8){msg('Elige una contraseña de al menos 8 caracteres.',false);return;}
      const {data,error}=await sb.auth.signUp({email:correo(),password:clave(),options:{emailRedirectTo:location.href.split('#')[0]}});
      if(error){msg(traducir(error.message),false);return;}
      if(data&&data.session){cerrarAcceso();return;}
      msg('Cuenta creada. Te enviamos un correo para confirmarla; abre el enlace y después entra con tu contraseña.',true);};
    q('[data-olvido]').onclick=async e=>{e.preventDefault(); if(!sb)return;
      if(!correo()){msg('Escribe tu correo y vuelve a tocar «Olvidé mi contraseña».',false);return;}
      const destino=location.origin+location.pathname.replace(/[^/]*$/,'')+'participacion.html';
      const {error}=await sb.auth.resetPasswordForEmail(correo(),{redirectTo:destino});
      msg(error?traducir(error.message):'Si hay una cuenta con ese correo, te llegará un enlace para poner una contraseña nueva. Si no llega en unos minutos, escribe a '+CONTACTO+'.',!error);};
  }
  function abrirAcceso(){ cerrar(); modal.classList.add('abierto'); setTimeout(()=>modal.querySelector('#ofmAccMail').focus(),30); modal.querySelector('.msg').textContent=''; }
  function cerrarAcceso(){ modal.classList.remove('abierto'); }

  // Pendientes de moderación (M10 · 12-11-2026): un número junto a «Moderación» y un punto en el ☰.
  // La función de la base solo cuenta lo que a cada rol le toca revisar.
  async function pintarPendientes(admin){ if(!caj) return;
    let n=0;
    if(admin&&sb){ const {data}=await sb.rpc('pendientes_moderacion');
      const r=data&&data[0]; if(r) n=(+r.solicitudes||0)+(+r.aportes||0)+(+r.territorios||0); }
    caj.querySelectorAll('[data-admin] span').forEach(sp=>{ const b=sp.querySelector('.ofm-pend'); if(b)b.remove();
      if(n){ const e=el('b',{class:'ofm-pend','aria-label':n+' pendientes'},String(n)); sp.appendChild(e);} });
    document.querySelectorAll('[data-ofm-abre]').forEach(b=>{ if(n)b.setAttribute('data-pend','1'); else b.removeAttribute('data-pend');
      b.setAttribute('aria-label', n?'Abrir el menú ('+n+' pendientes de moderación)':'Abrir el menú'); });
  }
  window.ofmAuth.refrescarPendientes=()=>pintarPendientes(perfil&&(perfil.role==='admin'||perfil.role==='moderator'));
  function pintarSesion(){ if(!caj)return;
    const admin=perfil&&(perfil.role==='admin'||perfil.role==='moderator');
    caj.querySelectorAll('[data-admin]').forEach(a=>a.hidden=!admin);
    pintarPendientes(admin);
    const c=caj.querySelector('[data-ofm-cuenta]');
    if(!sb){c.innerHTML='';}
    else if(sesion){ c.innerHTML='<span>Sesión: <b style="color:#e8eef4">'+(sesion.user.email||'')+'</b></span>';
      const b=el('button',{class:'ofm-entrar sec',type:'button'},'Salir'); b.onclick=()=>{sb.auth.signOut();cerrar();}; c.appendChild(b); }
    else { const b=el('button',{class:'ofm-entrar',type:'button'},'Entrar'); b.onclick=abrirAcceso; c.innerHTML=''; c.appendChild(b); }
    document.querySelectorAll('[data-ofm-entrar]').forEach(s=>{ s.innerHTML='';
      if(!sb) return;
      if(sesion){ s.appendChild(el('a',{class:'ofm-entrar sec',href:'./participacion.html'},'Mi participación')); }
      else { const b=el('button',{class:'ofm-entrar',type:'button'},'Entrar'); b.onclick=abrirAcceso; s.appendChild(b); } });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',construir); else construir();
})();
