/* /play: a tiny fake shell */
(function () {
  var out = document.getElementById('term-output');
  var input = document.getElementById('term-input');
  var term = document.getElementById('term');
  if (!out || !input) return;

  function print(html, cls) {
    var d = document.createElement('div');
    d.className = 'line' + (cls ? ' ' + cls : '');
    d.innerHTML = html;
    out.appendChild(d);
    term.scrollTop = term.scrollHeight;
  }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  var files = {
    'about.txt': function () {
      print('2+ years turning complex apis into developer-loved products. built the bolna mcp server + cli, 300+ assets shipped, 53+ talks, 2 communities on the rise.');
    },
    'hobbies.txt': function () {
      print('flying ✈ · dj (learning) ♪ · crochet ❀ · matcha 🍵 · ai safety ⚙ · community ⌥ · travel ⌖ · writing ✎');
    },
    'hitl.txt': function () {
      print('<span class="ok">project hitl (humans in the loop) - a community for people working on the human side of ai. → <a href="https://projecthumansintheloop.com">projecthumansintheloop.com</a></span>');
    },
    'talks.txt': function () {
      print('53+ talks. latest: mcp dev summit seoul (×2), scale 23x, tais manila. full list → <a href="/talks">/talks</a>');
    },
    'links.txt': function () {
      print([
        'bolna: <a href="https://www.bolna.ai/builders">bolna builders</a> · <a href="https://mcp.bolna.ai">mcp.bolna.ai</a>',
        'youtube: <a href="https://www.youtube.com/@BolnaVoiceAI">@BolnaVoiceAI</a> · <a href="https://youtube.com/@suprsend">@suprsend</a>',
        'hashnode: <a href="https://hashnode.com/@tansgrid">@tansgrid</a> (technical)',
        'substack: <a href="https://tansgrid.substack.com">tansgrid.substack.com</a> (personal)',
        'community: <a href="https://projecthumansintheloop.com">projecthumansintheloop.com</a>',
        'linkedin: <a href="https://linkedin.com/in/tanisha-sharma07">in/tanisha-sharma07</a>',
        'x: <a href="https://twitter.com/tanishasharmax">@tanishasharmax</a>',
        'github: <a href="https://github.com/tanisha-byte">tanisha-byte</a> / <a href="https://github.com/tanishaio">tanishaio</a>'
      ].join('<br>'));
    },
    'flight-log.enc': function () { print('<span class="err">permission denied: ask me about it in person.</span>'); },
    'setlist.mp3': function () { print('<span class="err">your terminal cannot play mp3s. but the bass would have hit.</span>'); },
    '.bashrc': function () { print('<span class="dim">PS1="tanisha@earth:~$ "\nalias ll="ls -lah"\nexport SHIPPING=true</span>'); }
  };

  var commands = {
    help: function () {
      print('<span class="dim">commands:</span> <span class="ok">help · whoami · ls · cat &lt;file&gt; · contact · fly · mix · call · fortune · sudo · clear · exit</span>');
      print('<span class="dim">files (cat them, or just type the name):</span> <span class="ok">' + Object.keys(files).join(' · ') + '</span>');
    },
    whoami: function () {
      print('tanisha sharma · devrel @ bolna (yc f25) · ex-suprsend · ex-microsoft azure · founder, project hitl · co-founder, chae · pilot · dj · crocheter');
    },
    ls: function () { print(Object.keys(files).join('  ')); },
    contact: function () { print('email: <a href="mailto:reachtanishasharma@gmail.com">reachtanishasharma@gmail.com</a>'); },
    fly: function () { print('<span class="ok">clear skies. tower clears you for takeoff. ✈ (ppl, garg aviation, 2021)</span>'); },
    mix: function () {
      print('<span class="ok">cueing track... ' + pick([122, 124, 126, 128]) + ' bpm · the drop arrives in 16 bars (give or take, still learning). ♪</span>');
    },
    call: function () {
      print('<span class="ok">☎ dialing a bolna voice agent... "hi! this is nova from smile dental, how can i help?"</span>');
    },
    fortune: function () {
      print('<span class="dim">' + pick([
        'documentation is a love letter you write to your future self.',
        'ship the demo. nobody reads the slides.',
        'the prompt is the product.',
        'flight planning > flight execution. (also true of releases.)',
        'good devrel is product feedback wearing a friendly hat.',
        'every model deserves a human in the loop.',
        'if your mcp server works in one client, test it in five.'
      ]) + '</span>');
    },
    sudo: function () { print('<span class="err">tanisha is not in the sudoers file. this incident will be reported.</span>'); },
    clear: function () { out.innerHTML = ''; },
    exit: function () { print('connection to <span class="ok">tanisha-byte.github.io</span> closed.'); }
  };

  function resolve(cmd) {
    if (commands[cmd]) return commands[cmd];
    if (files[cmd]) return files[cmd];
    if (cmd.indexOf('cat ') === 0) {
      var arg = cmd.slice(4).trim();
      return files[arg] || function () { print('<span class="err">cat: ' + arg + ': no such file or directory</span>'); };
    }
    if (cmd.indexOf('sudo ') === 0) return commands.sudo;
    return null;
  }

  print('<span class="dim">// welcome to /play. it\'s a toy.</span>');
  print('type <span class="ok">help</span> to begin.');

  input.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var cmd = input.value.trim();
    input.value = '';
    print('<span class="you">tanisha@earth:~$</span> ' + cmd.replace(/</g, '&lt;'));
    if (!cmd) return;
    var fn = resolve(cmd);
    if (fn) fn();
    else print('<span class="err">' + cmd.split(' ')[0].replace(/</g, '&lt;') + ': command not found. try <span class="ok">help</span>.</span>');
  });

  term.addEventListener('click', function () { input.focus(); });
})();
