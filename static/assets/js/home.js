/* home page: boot sequence, matrix rain, typewriter code window */
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function seenBoot() {
    try { return sessionStorage.getItem('booted') === '1'; } catch (e) { return false; }
  }
  function markBooted() {
    try { sessionStorage.setItem('booted', '1'); } catch (e) {}
  }

  /* ---------- matrix rain (click after boot) ---------- */
  var canvas = document.getElementById('matrix-bg');
  var hint = document.getElementById('matrix-hint');
  var ctx = canvas && canvas.getContext('2d');
  var chars = 'tanisha01{}<>/_*&^%$#@!devrel0xabcdef♪✈❀⌘hitlbolna';
  var fontSize = 16;
  var drops = [];

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var cols = Math.floor(window.innerWidth / fontSize);
    for (var i = drops.length; i < cols; i++) drops[i] = Math.random() * -100;
  }

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px "JetBrains Mono", monospace';
    for (var i = 0; i < drops.length; i++) {
      ctx.fillStyle = i % 3 === 0 ? 'rgba(244, 114, 182, 0.85)' : 'rgba(56, 189, 248, 0.85)';
      ctx.fillText(chars.charAt(Math.floor(Math.random() * chars.length)), i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  var rain = null;
  function startRain() {
    if (!ctx || rain || reduceMotion) return;
    resize();
    window.addEventListener('resize', resize);
    canvas.classList.add('active');
    rain = setInterval(draw, 55);
  }

  /* ---------- boot sequence ---------- */
  var bootBox = document.getElementById('boot');
  var bootCmd = document.getElementById('boot-cmd');
  var bootCursor = document.getElementById('boot-cursor');
  var bootOut = document.getElementById('boot-out');
  var bootSkip = document.getElementById('boot-skip');
  var heroContent = document.getElementById('hero-content');

  var spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  var lines = [
    { text: './init.sh tanisha', kind: 'cmd' },
    { text: '', kind: 'blank', wait: 200 },
    { text: '<span class="head">[boot]</span> initialising tanisha v2026…', wait: 350 },
    { text: '<span class="head">[mnt]</span>  mounting /me, /work, /talks, /writing, /play  <span class="ok">[ok]</span>', wait: 280 },
    { task: 'loading identities', ok: 'devrel · pilot · dj (learning) · crocheter · founder', spin: 700 },
    { task: 'connecting to mcp.bolna.ai', ok: '90+ tools loaded · voice agents online', spin: 750 },
    { task: 'counting talks', ok: '53+ and counting', spin: 650 },
    { task: 'checking flight log', ok: 'clear skies · ppl · garg aviation', spin: 600 },
    { text: '', kind: 'blank', wait: 200 },
    { text: '<span class="warn">[!] warning:</span> too many side quests detected. proceeding anyway.', wait: 500 },
    { text: '<span class="ok">▸ system ready. welcome.</span>', wait: 400 }
  ];

  var revealed = false;
  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function reveal() {
    if (revealed) return;
    revealed = true;
    timers.forEach(clearTimeout);
    markBooted();
    bootBox.classList.add('collapsed');
    bootCursor.style.display = 'none';
    setTimeout(function () {
      bootBox.classList.add('gone');
      heroContent.classList.add('revealed');
      setTimeout(function () { if (hint) hint.classList.add('visible'); }, 800);
    }, 300);
  }

  function append(html) { bootOut.insertAdjacentHTML('beforeend', html + '\n'); }

  function spinTask(task, okText, ms, done) {
    var row = document.createElement('div');
    var spin = document.createElement('span');
    spin.className = 'spin';
    row.innerHTML = '<span class="head">[~~]</span> ';
    row.appendChild(spin);
    row.appendChild(document.createTextNode(' ' + task + '...'));
    bootOut.appendChild(row);
    var i = 0;
    var iv = setInterval(function () { spin.textContent = spinner[i++ % spinner.length]; }, 80);
    later(function () {
      clearInterval(iv);
      row.innerHTML = '<span class="head">[ok]</span> ' + task + ' <span class="dim">…</span> <span class="ok">' + okText + '</span>';
      done();
    }, ms);
  }

  function type(target, text, speed, done) {
    var i = 0;
    (function step() {
      if (i >= text.length) return done();
      target.textContent += text.charAt(i++);
      later(step, speed);
    })();
  }

  function run(idx) {
    if (revealed) return;
    if (idx >= lines.length) return later(reveal, 700);
    var line = lines[idx];
    var next = function () { run(idx + 1); };
    if (line.kind === 'cmd') return type(bootCmd, line.text, 55, function () { later(next, 280); });
    if (line.task) return spinTask(line.task, line.ok, line.spin, function () { later(next, 120); });
    append(line.text);
    later(next, line.wait || 250);
  }

  if (bootBox && heroContent) {
    if (reduceMotion || seenBoot()) {
      bootBox.classList.add('gone');
      heroContent.classList.add('revealed');
      revealed = true;
    } else {
      setTimeout(function () { if (bootSkip) bootSkip.classList.add('visible'); }, 1200);
      later(function () { run(0); }, 350);
    }
  }

  // first click skips the boot; the next one starts the matrix rain
  document.addEventListener('click', function onClick(e) {
    if (e.target.closest('a, button, input')) return;
    if (!revealed) return reveal();
    startRain();
    if (hint) hint.classList.remove('visible');
    document.removeEventListener('click', onClick);
  });

  /* ---------- typewriter code window ---------- */
  var body = document.getElementById('cw-body');
  var cursor = document.getElementById('cw-cursor');
  if (!body) return;

  var snippet =
    '__COM__// can you guess what gets logged?__/COM__\n' +
    '__KW__const__/KW__ tanisha = {\n' +
    "  role: __STR__'devrel @ bolna (yc f25)'__/STR__,\n" +
    "  side_quests: [__STR__'pilot'__/STR__, __STR__'dj (learning)'__/STR__, __STR__'crocheter'__/STR__, __STR__'matcha'__/STR__],\n" +
    '  shipped: { mcp_tools: __NUM__90__/NUM__, assets: __NUM__300__/NUM__, talks: __NUM__53__/NUM__ },\n' +
    "  building: __STR__'projecthumansintheloop.com'__/STR__,\n" +
    "  reachable_at: __STR__'reachtanishasharma@gmail.com'__/STR__,\n" +
    '};\n\n' +
    '__KW__function__/KW__ __FN__hire__/FN__(person) {\n' +
    "  __KW__if__/KW__ (person.shipped.talks > __NUM__50__/NUM__) __KW__return__/KW__ __STR__'yes'__/STR__;\n" +
    "  __KW__return__/KW__ __STR__'still yes'__/STR__;\n" +
    '}\n\n' +
    'console.log(__FN__hire__/FN__(tanisha));\n' +
    '__COM__// > "yes"__/COM__';

  var CLASSES = { COM: 'ck-com', KW: 'ck-kw', STR: 'ck-str', FN: 'ck-fn', NUM: 'ck-num' };

  // split the marked-up snippet into {text, cls} chunks
  var tokens = [];
  snippet.split(/(__\/?[A-Z]+__)/).reduce(function (cls, part) {
    var m = part.match(/^__(\/?)([A-Z]+)__$/);
    if (m && CLASSES[m[2]]) return m[1] ? null : CLASSES[m[2]];
    if (part) tokens.push({ text: part, cls: cls });
    return cls;
  }, null);

  function node(tok) {
    var el = tok.cls ? document.createElement('span') : document.createTextNode('');
    if (tok.cls) el.className = tok.cls;
    body.appendChild(el);
    return el;
  }

  if (reduceMotion) {
    tokens.forEach(function (t) { node(t).textContent = t.text; });
    return;
  }

  var t = 0;
  function typeToken() {
    if (t >= tokens.length) { cursor.style.opacity = '1'; return; }
    var tok = tokens[t++];
    var el = node(tok);
    var c = 0;
    (function typeChar() {
      if (c >= tok.text.length) return typeToken();
      var ch = tok.text.charAt(c++);
      el.textContent += ch;
      setTimeout(typeChar, /\s/.test(ch) ? 8 : 16 + Math.random() * 22);
    })();
  }

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { obs.disconnect(); typeToken(); }
    }, { threshold: 0.25 });
    obs.observe(body.parentElement);
  } else {
    typeToken();
  }
})();
