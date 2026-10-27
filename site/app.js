/* Off-Template, Part 1: install block and the agent window. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var EASE = 'cubic-bezier(.2, .7, .2, 1)';
  var DEVELOP_FROM = { opacity: 0, filter: 'grayscale(1) brightness(1.7) contrast(.45)' };
  var DEVELOP_TO = { opacity: 1, filter: 'none' };

  /* ---------- Install tabs and copy (each tab list works on its own) ---------- */
  function initTabs(wrap) {
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll('.tab'));
    var items = Array.prototype.slice.call(wrap.querySelectorAll('.cmd-item'));
    if (!tabs.length || tabs.length !== items.length) return;

    function selectTab(i, focus) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        items[n].hidden = !on;
      });
      if (focus) tabs[i].focus();
    }

    items.forEach(function (it, n) {
      it.setAttribute('role', 'tabpanel');
      it.setAttribute('aria-labelledby', tabs[n].id);
    });
    tabs.forEach(function (t, n) {
      t.addEventListener('click', function () { selectTab(n, false); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, to = -1;
        if (k === 'ArrowRight' || k === 'ArrowDown') to = (n + 1) % tabs.length;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') to = (n - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') to = 0;
        else if (k === 'End') to = tabs.length - 1;
        if (to > -1) { e.preventDefault(); selectTab(to, true); }
      });
    });
    selectTab(0, false);
  }
  Array.prototype.forEach.call(document.querySelectorAll('.install, .inst'), initTabs);

  Array.prototype.forEach.call(document.querySelectorAll('.copy-btn'), function (btn) {
    var code = btn.parentNode.querySelector('code');
    var timer = 0;
    btn.addEventListener('click', function () {
      var text = code.textContent;
      var done = function () {
        btn.textContent = 'Copied';
        clearTimeout(timer);
        timer = setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
      };
      var fail = function () {
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(code);
        sel.removeAllRanges();
        sel.addRange(range);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fail);
      } else {
        fail();
      }
    });
  });

  /* ---------- The agent window and the print ---------- */
  var DIRS = {
    a: { letter: 'A', name: 'Editor at Night', skel: 'img/skel-a.webp', mock: 'img/dir-a.webp', h: 1090 },
    b: { letter: 'B', name: 'The Output Leads', skel: 'img/skel-b.webp', mock: 'img/dir-b.webp', h: 1170 },
    c: { letter: 'C', name: 'Darkroom Develop', skel: 'img/skel-c.webp', mock: 'img/dir-c.webp', h: 1058 }
  };

  var skel = document.querySelector('.print-skel');
  var mock = document.querySelector('.print-mock');
  var ripple = document.querySelector('.ripple');
  var caption = document.querySelector('.caption');
  var status = document.getElementById('agent-status');
  var picks = Array.prototype.slice.call(document.querySelectorAll('.pick'));
  var current = 'c';
  var busy = false;

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function setStage(name) {
    if (!caption) return;
    caption.setAttribute('data-stage', name);
    Array.prototype.forEach.call(caption.querySelectorAll('[data-s]'), function (s) {
      s.classList.toggle('on', s.getAttribute('data-s') === name);
    });
  }

  function setImages(key) {
    var d = DIRS[key];
    skel.src = d.skel;
    mock.src = d.mock;
    mock.setAttribute('height', d.h);
    mock.alt = 'Mockup of direction ' + d.letter + ', ' + d.name + ', as the skill generated it';
  }

  /* Runs the develop. Resolves when the mockup is fully shown. */
  function develop(key, opts) {
    opts = opts || {};
    var delay = opts.delay || 0;
    return new Promise(function (resolve) {
      if (!mock.animate) { setImages(key); setStage('page'); resolve(); return; }
      var rm = reduce.matches;
      var dur = rm ? 200 : 1400;
      var from = rm ? { opacity: 0 } : DEVELOP_FROM;
      var to = rm ? { opacity: 1 } : DEVELOP_TO;
      mock.getAnimations().forEach(function (a) { a.cancel(); });
      var anim = mock.animate([from, to], { duration: dur, delay: delay, easing: rm ? 'linear' : EASE, fill: 'both' });
      setImages(key);
      if (!rm) {
        setStage('skeleton');
        setTimeout(function () { setStage('mockup'); }, delay + 450);
        if (opts.ripple && ripple && ripple.animate) {
          ripple.animate(
            [{ transform: 'scale(0)', opacity: 0.5 }, { transform: 'scale(2.4)', opacity: 0 }],
            { duration: 900, delay: delay, easing: 'ease-out', fill: 'backwards' }
          );
        }
      }
      anim.finished.then(function () {
        anim.cancel();
        resolve();
      }, function () { resolve(); });
    });
  }

  /* Faces of looks A and B. Chrome only fetches a face that is used, so this starts at parse,
     not on the click. The click waits only for faces that are still missing. */
  var FACES = ['800 1em "Mona Sans"', '400 1em "Mona Sans"', '800 1em "Bricolage Grotesque"', '400 1em "Instrument Sans"', '600 1em "Instrument Sans"'];
  function loadFaces() {
    if (!document.fonts || !document.fonts.load) return;
    FACES.forEach(function (f) { document.fonts.load(f).catch(function () {}); });
  }
  function facesReady() {
    if (!document.fonts || !document.fonts.load || !document.fonts.check) return Promise.resolve();
    var pending = FACES.filter(function (f) { return !document.fonts.check(f); });
    if (!pending.length) return Promise.resolve();
    return Promise.race([
      Promise.all(pending.map(function (f) { return document.fonts.load(f).catch(function () {}); })),
      wait(900)
    ]);
  }
  loadFaces();

  function setPressed(key) {
    picks.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-dir') === key ? 'true' : 'false');
    });
  }

  /* The new look grows as a circle from the picked prompt, over the whole page at once.
     Without View Transitions (or with reduced motion) the sections rebuild one by one instead. */
  function swapLook(key, from) {
    function apply() {
      current = key;
      root.dataset.look = key;
      window.dispatchEvent(new CustomEvent('look', { detail: key }));
    }
    if (reduce.matches || typeof document.startViewTransition !== 'function') {
      apply();
      return Promise.resolve();
    }
    var r = from ? from.getBoundingClientRect() : null;
    var x = r ? r.left + r.width / 2 : innerWidth / 2;
    var y = r ? r.top + r.height / 2 : innerHeight / 2;
    root.style.setProperty('--vt-x', x + 'px');
    root.style.setProperty('--vt-y', y + 'px');
    var R = Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)));
    root.style.setProperty('--vt-r', R + 'px');
    root.classList.add('vt', 'vt-shape');
    var t = document.startViewTransition(apply);
    t.ready.then(function () {
      root.animate({ clipPath: liquid(x, y, R) }, {
        duration: 1100, easing: 'linear', fill: 'both', pseudoElement: '::view-transition-new(root)'
      });
    }).catch(function () { root.classList.remove('vt-shape'); });
    return t.finished.catch(function () {}).then(function () { root.classList.remove('vt', 'vt-shape'); });
  }

  /* The edge of the new look is a liquid rim: polygon() keyframes with the same point count, so the
     browser can blend them. If the browser can't animate the pseudo-element, the CSS circle runs. */
  function ease(p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function liquid(cx, cy, R) {
    var out = [], N = 96, F = 44;
    for (var f = 0; f <= F; f++) {
      var p = f / F, e = ease(p), t = p * 6;
      // Ripples on the rim, strongest mid-way, gone by the end so the edge settles off-screen.
      var amp = Math.sin(Math.PI * p) * .14 + .02;
      var r = e * R * 1.25, pts = [];
      for (var i = 0; i < N; i++) {
        var th = i / N * Math.PI * 2;
        var w = Math.sin(3 * th + t * 2.1) * .5 + Math.sin(5 * th - t * 3.3) * .3 + Math.sin(8 * th + t * 4.7) * .2;
        var rr = Math.max(0, r * (1 + amp * w));
        pts.push((cx + Math.cos(th) * rr).toFixed(1) + 'px ' + (cy + Math.sin(th) * rr).toFixed(1) + 'px');
      }
      out.push('polygon(' + pts.join(',') + ')');
    }
    return out;
  }

  function pick(key, from) {
    if (busy || key === current || !DIRS[key]) return;
    busy = true;
    root.classList.add('ready');
    var d = DIRS[key];
    // The proof behind the window comes into focus while it develops, then settles back.
    var stageEl = document.querySelector('.stage');
    if (stageEl) { clearTimeout(stageEl._unfocus); stageEl.classList.add('focus'); }
    // The buttons stay enabled (busy ignores clicks), so focus never drops and is never moved:
    // moving focus back scrolled the page up to the hero after a visitor had scrolled away.
    picks.forEach(function (b) { b.setAttribute('aria-disabled', 'true'); });

    setPressed(key);
    status.textContent = '> Building the sections below in ' + d.name + '…';
    var rebuilt = facesReady().then(function () {
      return swapLook(key, from);
    });
    Promise.all([
      develop(key, { ripple: true }),
      rebuilt
    ]).then(function () {
      status.textContent = 'Done. The page below is now ' + d.name + '.';
      setStage('page');
      setPressed(key);
      picks.forEach(function (b) { b.removeAttribute('aria-disabled'); });
      busy = false;
      if (stageEl) stageEl._unfocus = setTimeout(function () { stageEl.classList.remove('focus'); }, 2600);
    });
  }

  picks.forEach(function (b) {
    b.addEventListener('click', function () { pick(b.getAttribute('data-dir'), b); });
  });

  /* ---------- Load: the print develops once ---------- */
  if (reduce.matches) {
    root.classList.add('ready');
  } else if (!root.classList.contains('ready')) {
    setStage('skeleton');
    develop('c', { delay: 600 }).then(function () {
      root.classList.add('ready');
      setStage('page');
    });
  }

  /* ---------- Preload the other directions on idle ---------- */
  function preload() {
    loadFaces();
    ['skel-a', 'dir-a', 'skel-b', 'dir-b'].forEach(function (n) {
      var im = new Image();
      im.src = 'img/' + n + '.webp';
    });
  }
  window.addEventListener('load', function () {
    if ('requestIdleCallback' in window) requestIdleCallback(preload);
    else setTimeout(preload, 200);
  });

  /* ---------- Part 2: sections ---------- */
  var secs = Array.prototype.slice.call(document.querySelectorAll('#built .sec'));
  var foot = document.querySelector('.foot');
  var rebuildList = foot ? secs.concat([foot]) : secs;
  var hasIO = 'IntersectionObserver' in window;

  /* Calls cb(el) once per element, the first time it enters (or is above) the viewport. */
  function watch(els, cb) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          io.unobserve(e.target);
          cb(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function countUp(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    if (reduce.matches || !end) return;
    var t0 = null;
    var run = (el._run = (el._run || 0) + 1);
    el.textContent = '0';
    function step(t) {
      if (run !== el._run) return;
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / 900);
      el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Terminal in look A: the command types itself once, by revealing the letters already in the HTML. */
  var termTyped = false;
  function typeTerm(sec) {
    if (termTyped || reduce.matches || sec.id !== 'install') return;
    var code = sec.querySelector('.term-win .cmd-item:not([hidden]) code');
    if (!code) return;
    termTyped = true;
    var html = code.innerHTML;
    var chars = [];
    (function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.nodeValue.split('').forEach(function (ch) {
            var sp = document.createElement('span');
            sp.className = 'ty';
            sp.textContent = ch;
            frag.appendChild(sp);
            chars.push(sp);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) {
          wrap(n);
        }
      });
    })(code);
    var i = 0;
    (function step() {
      if (i < chars.length) {
        chars[i].classList.add('ty-on');
        i += 1;
        setTimeout(step, 24);
      } else {
        code.innerHTML = html;
      }
    })();
  }

  /* What a section does each time its look is shown: count the numbers, type the terminal. */
  function showLook(el) {
    Array.prototype.forEach.call(el.querySelectorAll('[data-count]'), countUp);
    if (el.getAttribute('data-look') === 'a') typeTerm(el);
  }

  function enterSection(sec) {
    sec.classList.remove('pre');
    sec.classList.add('in');
    /* Entrance motion plays once. A later look change must not restart it. */
    sec.classList.add('arrive');
    clearTimeout(sec._arrive);
    sec._arrive = setTimeout(function () { sec.classList.remove('arrive'); }, 1400);
    showLook(sec);
  }

  /* Each section and the footer carry their own data-look so the rebuild can swap them one by one. */
  function setLook(el, key) { el.setAttribute('data-look', key); }
  rebuildList.forEach(function (el) { setLook(el, root.dataset.look || 'c'); });

  /* The rebuild: a soft develop, top to bottom. The look flips at each section's start so the colours morph. */
  var rbTimers = [];
  function rebuild(key) {
    rbTimers.forEach(clearTimeout);
    rbTimers = [];
    rebuildList.forEach(function (el) {
      el.classList.remove('rb');
      el.classList.remove('arrive');
      clearTimeout(el._arrive);
    });
    root.classList.remove('switching');
    if (reduce.matches) {
      rebuildList.forEach(function (el) { setLook(el, key); });
      return;
    }
    /* Inside the circle: every section flips at once, and the ones already seen count again. */
    if (root.classList.contains('vt')) {
      rebuildList.forEach(function (el) {
        setLook(el, key);
        if (!el.classList.contains('pre')) showLook(el);
      });
      return;
    }
    /* Read every height before any write, so the switch is one layout, not one per section. */
    var jobs = [];
    rebuildList.forEach(function (el, i) {
      if (el.classList.contains('pre')) return;
      jobs.push({ el: el, at: i * 110, h: el.offsetHeight });
    });
    root.classList.add('switching');
    rebuildList.forEach(function (el) {
      if (el.classList.contains('pre')) setLook(el, key);
    });
    var last = 0;
    jobs.forEach(function (job) {
      job.el.style.setProperty('--h', Math.max(0, job.h - 2) + 'px');
      last = Math.max(last, job.at + 520);
      rbTimers.push(setTimeout(function () {
        setLook(job.el, key);
        job.el.classList.add('rb');
        showLook(job.el);
        rbTimers.push(setTimeout(function () { job.el.classList.remove('rb'); }, 520));
      }, job.at));
    });
    rbTimers.push(setTimeout(function () { root.classList.remove('switching'); }, last));
  }
  window.addEventListener('look', function (e) { rebuild(e.detail); });

  if (hasIO && !reduce.matches) {
    secs.forEach(function (s) { s.classList.add('pre'); });
    watch(secs, enterSection);

    var tells = document.querySelector('.tells');
    if (tells) {
      Array.prototype.forEach.call(tells.querySelectorAll('li'), function (li, i) {
        li.style.setProperty('--i', i);
      });
      tells.classList.add('arm');
      watch([tells], function (el) {
        el.classList.add('go');
        el.classList.remove('arm');
      });
    }
  }
})();

/* The vault section's Obsidian logo in characters, spelled with the starter vault's note
   names (built by scripts/obsidian-art.mjs). It resolves row by row from noise
   once, when it comes into view; the pointer leaves a trail of scrambled, lit
   cells that settle back to the names in about 0.6 s. Reduced motion: drawn once, still. No JS: the <pre> stays. */
/* obsidian-art:data */ var OBSIDIAN_ART = {"cols":108,"cell":1.85,"text":"AI design patterns to avoid · Design brief · Design rules · Research real sites · Skeletons before code · Styles of burger food trucks · Styles · Halfway · Off-Template site · Agent rules · Capabilities · Ideas · Mistakes · Tool usage · Wins · INDEX Design · INDEX · ","tones":["000000000000000000000000000000000000000000000000000000555555500000000000000000000000000000000000000000000000","000000000000000000000000000000000000000000000000000555555555554000000000000000000000000000000000000000000000","000000000000000000000000000000000000000000000000055555555555555300000000000000000000000000000000000000000000","000000000000000000000000000000000000000000000005555555555555555433000000000000000000000000000000000000000000","000000000000000000000000000000000000000000000555555555555555555433300000000000000000000000000000000000000000","000000000000000000000000000000000000000000055555555555555555555433333000000000000000000000000000000000000000","000000000000000000000000000000000000000006666666666555555555555433333300000000000000000000000000000000000000","000000000000000000000000000000000000000666666666666666665555555333333333000000000000000000000000000000000000","000000000000000000000000000000000000066666666666666666666665554333333334400000000000000000000000000000000000","000000000000000000000000000000000006666666666666666666666666653334444444440000000000000000000000000000000000","000000000000000000000000000000000666666666666666666666666666544444444444444400000000000000000000000000000000","000000000000000000000000000000066666666666666666666666666665444444444444444440000000000000000000000000000000","000000000000000000000000000006666666666666666666666666666654444444444444444444400000000000000000000000000000","000000000000000000000000000066666666666666666666666666666644444444444444444444440000000000000000000000000000","000000000000000000000000000066666666666666666666666666666444444444444444444444444400000000000000000000000000","000000000000000000000000000666666666666666666666666666664444444444444444444444444440000000000000000000000000","000000000000000000000000000666666666666666666666666666654444444444444444444444444440000000000000000000000000","000000000000000000000000000666666666666666666666666666644444444444444444444444444440000000000000000000000000","000000000000000000000000000666666666666666666666666666544444444444444444444444444440000000000000000000000000","000000000000000000000000006666666677777777777766666666444444444444444444444444444440000000000000000000000000","000000000000000000000000006666677777777777777777766666444444444444444444455555555550000000000000000000000000","000000000000000000000000006677777777777777777777777676444444444444445555555555555555000000000000000000000000","000000000000000000000000077777777777777777777777777776444444444455555555555555555555000000000000000000000000","000000000000000000000000077777777777777777777777777776444444445555555555555555555555000000000000000000000000","000000000000000000000000035777777777777777777777777776444444555555555555555555555555000000000000000000000000","000000000000000000000000222246777777777777777777777777444455555555555555555555555555500000000000000000000000","000000000000000000000002222222467777777777777777777777545555555555555555555555555555500000000000000000000000","000000000000000000000022222222224777777777777777777777655555555555555555555555555555550000000000000000000000","000000000000000000000222222222222257777777777777777777755555555555555555555555555555555000000000000000000000","000000000000000000000222222222222223777777777777777777755555555555555555555555555555555500000000000000000000","000000000000000000002222222222222222277777777777777777775555555555555555555555555555555550000000000000000000","000000000000000000022222222222222222226877777777777777776555555555555555555555555555555555000000000000000000","000000000000000000222222222222222222222787777777777777777555555555555555555666655555555555500000000000000000","000000000000000002222222222222222222222388777777777777777655555555555556666666666665555555550000000000000000","000000000000000022222222222222222222222248777777777777777766555555556666666666666666655555555500000000000000","000000000000000022222222222222222222222227766544332221111122233456666666666666666666666555555550000000000000","000000000000000222222222222222222222222222211111111111111111111111234666666666666666666655555555000000000000","000000000000002222222222222222222222222222211111111111111111111111111135666666666666666665555555000000000000","000000000000022222222222222222222222222222311111111111111111111111111111246666666666666665555550000000000000","000000000000222222222222222222222222222222311111111111111111111111111111222466666666666666555500000000000000","000000000000222222222222222233333322222222311111111111111111111222222222222225666666666666550000000000000000","000000000000222222222222333333333333332222311111111111111122222222222222222222366666666666500000000000000000","000000000000022222222233333333333333333332311111111111222222222222222222222222226666666666000000000000000000","000000000000002222223333333333333333333333211111111222222222222222222222222222222566666660000000000000000000","000000000000000022233333333333333333333333211111122222222222222222222222222222222256666600000000000000000000","000000000000000000333333333333333333333333111112222222222222222222222222222222222225660000000000000000000000","000000000000000000003333333333333333333332111222222222222222222222222222333222222222500000000000000000000000","000000000000000000000033333334444444333331122222222222222222222233333333333333333332000000000000000000000000","000000000000000000000003333444444444443321222222222222222222333333333333333333333330000000000000000000000000","000000000000000000000000034444444444444222222222222222222333333333333333333333333330000000000000000000000000","000000000000000000000000000444444444443222222222222222233333333333333333333333333300000000000000000000000000","000000000000000000000000000004444444442222222222222223333333333333333333333333333300000000000000000000000000","000000000000000000000000000000045555422222222222222233333333333333333333333333333000000000000000000000000000","000000000000000000000000000000005554222222222222222333333333333333333333333333333000000000000000000000000000","000000000000000000000000000000000002222222222222223333333333333333444444444444333000000000000000000000000000","000000000000000000000000000000000000000000000000003333333333333344444444444444430000000000000000000000000000","000000000000000000000000000000000000000000000000000000000003334444444444444444400000000000000000000000000000","000000000000000000000000000000000000000000000000000000000000000004444444444440000000000000000000000000000000"]};
(function () {
  'use strict';
  var fig = document.querySelector('.vault-art');
  var canvas = fig && fig.querySelector('canvas');
  if (!canvas || !OBSIDIAN_ART || !canvas.getContext) return;
  var A = OBSIDIAN_ART, ctx = canvas.getContext('2d');
  var sec = fig.closest('.sec');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var rows = A.tones.length, cols = A.cols;
  var noise = '·:;[]#=+-_/|{}<>~^%&$@abcdefghijklmnopqrstuvwxyz';
  var cw = 0, ch = 0, palette = [], settle = [], started = 0, raf = 0, waiting = false;
  // the trail: each cell's heat (1 when the pointer passes, back to 0 in TRAIL ms) and its scrambled character
  var TRAIL = 650, heat = new Float32Array(rows * cols), scramble = [], last = 0, prev = null;
  fig.classList.add('live');

  function rgb(s) { var m = s.match(/[\d.]+/g) || [0, 0, 0]; return [+m[0], +m[1], +m[2]]; }
  function mix(a, b, t) { return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); }).join(',') + ')'; }
  function readPalette() {
    // the look's own accent (red, teal or coral), read live so it follows the look switch
    var cs = getComputedStyle(sec);
    var bg = rgb(cs.getPropertyValue('--s-bg')), head = rgb(cs.getPropertyValue('--s-head')), accent = rgb(cs.getPropertyValue('--s-accent'));
    // 1..8 follow the logo's facets: the darkest ones still read as the accent, the lit ones the full accent, the brightest toward the headline colour
    palette = [null].concat([0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (k) { return mix(bg, accent, k); }), [mix(accent, head, 0.22), mix(accent, head, 0.5)]);
  }
  function size() {
    var w = fig.clientWidth, dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = w / cols; ch = cw * A.cell;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(rows * ch * dpr);
    canvas.style.height = rows * ch + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  }
  function draw(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    raf = 0;
    if (waiting) return;
    var big = ch * 0.78, small = big * 0.7, font = getComputedStyle(document.documentElement).getPropertyValue('--font-mono');
    var cool = last ? (now - last) / TRAIL : 0, busy = false;
    last = now;
    for (var r = 0; r < rows; r++) {
      var line = A.tones[r], resolved = !started || now - started >= settle[r];
      if (started && !resolved) busy = true;
      for (var c = 0; c < cols; c++) {
        var t = +line[c];
        if (!t) continue;
        var chr = A.text[(r * cols + c) % A.text.length];
        if (!resolved) { if (Math.random() < 0.5) continue; chr = noise[(Math.random() * noise.length) | 0]; t = 2; }
        var i = r * cols + c, h = heat[i];
        if (h > 0) {
          busy = true;
          heat[i] = Math.max(0, h - cool);
          // hot: a scrambled character that changes now and then; cooling: the name, still lit
          if (h > 0.45) {
            if (!scramble[i] || Math.random() < 0.18) scramble[i] = noise[(Math.random() * noise.length) | 0];
            chr = scramble[i];
          }
          t = Math.min(8, t + Math.ceil(h * 4));
        }
        ctx.font = (t >= 7 || h > 0.45 ? '500 ' : '400 ') + (t <= 1 ? small : big) + 'px ' + font;
        ctx.fillStyle = palette[t];
        ctx.fillText(chr, (c + 0.5) * cw, (r + 0.5) * ch);
      }
    }
    if (!busy) last = 0;
    if (busy) raf = requestAnimationFrame(draw);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(draw); }
  function render() { readPalette(); size(); kick(); }

  function start() {
    if (reduce.matches) { render(); return; }
    for (var r = 0; r < rows; r++) settle[r] = (r / rows) * 1100 + Math.random() * 300;
    started = performance.now();
    waiting = false;
    render();
  }
  // Heat the cells around one point of the pointer's path.
  function warm(x, y) {
    var c0 = Math.floor(x / cw), r0 = Math.floor(y / ch);
    for (var r = r0 - 2; r <= r0 + 2; r++) for (var c = c0 - 4; c <= c0 + 4; c++) {
      if (r < 0 || r >= rows || c < 0 || c >= cols || A.tones[r][c] === '0') continue;
      var d = Math.hypot((c - c0) / 4.5, (r - r0) / 2.5);
      if (d < 1) { var i = r * cols + c; heat[i] = Math.max(heat[i], 1 - d * 0.5); scramble[i] = ''; }
    }
  }
  var live = !reduce.matches && 'IntersectionObserver' in window;
  waiting = live;
  render();
  if (live) {
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      var go = function () { if (!started) start(); };
      Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(function (ok) { setTimeout(ok, 800); })]).then(go);
    }, { threshold: 0.3 });
    io.observe(fig);
    canvas.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || waiting) return;
      var b = canvas.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      // fill the gap since the last event, so a fast sweep leaves an unbroken trail
      var steps = prev ? Math.max(1, Math.ceil(Math.hypot(x - prev.x, y - prev.y) / cw)) : 1;
      for (var k = 1; k <= steps; k++) warm(prev ? prev.x + (x - prev.x) * k / steps : x, prev ? prev.y + (y - prev.y) * k / steps : y);
      prev = { x: x, y: y }; kick();
    });
    canvas.addEventListener('pointerleave', function () { prev = null; });
  }
  // The look switch changes the section's colours over 700 ms: follow them.
  new MutationObserver(function () { render(); setTimeout(render, 760); }).observe(sec, { attributes: true, attributeFilter: ['data-look'] });
  if ('ResizeObserver' in window) new ResizeObserver(function () { size(); kick(); }).observe(fig);
  // Closing the vault graph brings the logo back the way it first came in.
  fig.addEventListener('replay', function () { heat.fill(0); prev = null; start(); });
})();

/* "Explore the starter vault": the section turns into the vault's graph, drawn in
   characters like the logo (data from scripts/vault-graph.mjs, loaded on open).
   Notes are discs spelled with their names, links are lines spelled with the note
   they leave from, and every note has a label. Hover or focus lights a note and
   its links; a click opens the note beside the graph; a drag moves it and its
   neighbours follow on springs, then everything rests. Each note is a real
   button, so Tab, Enter and Esc work without the pointer. */
(function () {
  'use strict';
  var sec = document.getElementById('vault');
  var openBtn = sec && sec.querySelector('.vault-explore');
  var stage = document.getElementById('vault-stage');
  if (!openBtn || !stage || !window.fetch) return;
  var graphBox = stage.querySelector('.vstage-graph'), canvas = graphBox.querySelector('canvas'), ctx = canvas.getContext('2d');
  var list = stage.querySelector('.vstage-nodes'), panel = stage.querySelector('.vnote');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var noise = '·:;[]#=+-_/|{}<>~^%&$@abcdefghijklmnopqrstuvwxyz';
  var data = null, nodes = [], edges = [], adj = [], buttons = [];
  var W = 0, H = 0, cw = 0, ch = 0, cols = 0, rows = 0, tall = false, palette = [];
  var tone, chars, owner, focusNode = -1, selected = -1, drag = null;
  var raf = 0, revealAt = 0, settle = [], lastT = 0, quietFrom = 0, litNow = -1, litAt = 0;
  openBtn.hidden = false;

  function rgb(s) { var m = s.match(/[\d.]+/g) || [0, 0, 0]; return [+m[0], +m[1], +m[2]]; }
  function mix(a, b, t) { return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); }).join(',') + ')'; }
  function readPalette() {
    var cs = getComputedStyle(sec);
    var bg = rgb(cs.getPropertyValue('--s-bg')), head = rgb(cs.getPropertyValue('--s-head')), accent = rgb(cs.getPropertyValue('--s-accent'));
    // 0 = dimmed (another note is lit), 1..8 as on the logo
    palette = [mix(bg, accent, 0.28)].concat([0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (k) { return mix(bg, accent, k); }), [mix(accent, head, 0.3), mix(accent, head, 0.65)]);
    ground = 'rgb(' + bg.join(',') + ')';
    line = { rest: mix(bg, accent, 0.42), dim: mix(bg, accent, 0.18), lit: mix(accent, head, 0.2) };
  }
  var ground = '', line = {};

  /* ---- layout: the saved positions are home; springs pull back to them ---- */
  // n.g: 0..1, how much the note has grown under the pointer
  function radius(n) { return Math.max(14, Math.min(W, H) * (0.024 + 0.0095 * Math.sqrt(n.deg))) * (1 + 0.32 * (n.g || 0)); }
  // glide: only move the homes, so the springs carry the notes there (used when the note panel opens or closes)
  function place(keepMoved, glide) {
    var pad = tall ? 24 : 70, padTop = tall ? 28 : 36, aw = W, ah = H;
    if (!panel.hidden) { if (W < 720) ah = H - panel.offsetHeight; else aw = W - panel.offsetWidth - 16; } // the free part beside the note
    nodes.forEach(function (n) {
      var u = tall ? n.tx : n.x, v = tall ? n.ty : n.y; // tall screens get their own layout
      var hx = pad + u * (aw - pad * 2), hy = padTop + v * (ah - padTop - pad);
      if (n.moved) { n.hx = Math.min(n.hx, aw - 24); n.hy = Math.min(n.hy, ah - 24); if (!glide && !keepMoved) { n.px = n.hx; n.py = n.hy; } return; }
      n.hx = hx; n.hy = hy;
      if (!glide) { n.px = hx; n.py = hy; n.vx = n.vy = 0; }
    });
    edges.forEach(function (e) { e.rest = Math.hypot(nodes[e.a].hx - nodes[e.b].hx, nodes[e.a].hy - nodes[e.b].hy); });
  }
  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = graphBox.clientWidth; H = graphBox.clientHeight;
    tall = H > W * 1.1;
    cw = W < 720 ? 8 : 7.4; cols = Math.floor(W / cw); cw = W / cols; ch = cw * 1.85; rows = Math.floor(H / ch);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    tone = new Int8Array(rows * cols); chars = new Array(rows * cols); owner = new Int16Array(rows * cols);
  }

  /* ---- physics: home springs, link springs at their home length, a push when notes crowd ---- */
  function step(dt) {
    var k = Math.min(dt, 32) / 16, max = 0;
    nodes.forEach(function (n) { n.fx = (n.hx - n.px) * 0.02; n.fy = (n.hy - n.py) * 0.02; });
    edges.forEach(function (e) {
      var a = nodes[e.a], b = nodes[e.b], dx = b.px - a.px, dy = b.py - a.py, d = Math.hypot(dx, dy) || 1, f = (d - e.rest) * 0.012;
      a.fx += dx / d * f; a.fy += dy / d * f; b.fx -= dx / d * f; b.fy -= dy / d * f;
    });
    for (var i = 0; i < nodes.length; i++) for (var j = i + 1; j < nodes.length; j++) {
      var a = nodes[i], b = nodes[j], dx = b.px - a.px, dy = b.py - a.py, d = Math.hypot(dx, dy) || 1, min = radius(a) + radius(b) + (tall ? 20 : 56);
      if (d < min) { var f = (min - d) * 0.05; a.fx -= dx / d * f; a.fy -= dy / d * f; b.fx += dx / d * f; b.fy += dy / d * f; }
    }
    nodes.forEach(function (n, i) {
      if (drag && drag.i === i) { n.vx = n.vy = 0; return; }
      n.vx = (n.vx + n.fx * k) * 0.84; n.vy = (n.vy + n.fy * k) * 0.84;
      n.px = Math.max(20, Math.min(W - 20, n.px + n.vx * k)); n.py = Math.max(20, Math.min(H - 20, n.py + n.vy * k));
      max = Math.max(max, Math.abs(n.vx) + Math.abs(n.vy));
    });
    return max;
  }

  /* ---- raster: what each cell shows, and which note it belongs to ---- */
  function put(r, c, t, chr, who) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    var i = r * cols + c;
    if (t < tone[i]) return;
    tone[i] = t; chars[i] = chr; owner[i] = who;
  }
  function raster() {
    tone.fill(0); owner.fill(-1);
    nodes.forEach(function (n, i) {
      // a classic ASCII sphere, lit from the top left: dense glyphs where the light hits, sparse at the rim
      var R = radius(n), r0 = Math.floor((n.py - R) / ch), r1 = Math.ceil((n.py + R) / ch);
      for (var r = r0; r <= r1; r++) for (var c = Math.floor((n.px - R) / cw); c <= Math.ceil((n.px + R) / cw); c++) {
        var x = (c + 0.5) * cw - n.px, y = (r + 0.5) * ch - n.py, d = Math.hypot(x, y) / R;
        if (d >= 1) continue;
        var l = Math.hypot(x + R * 0.35, y + R * 0.35) / (R * 1.35); // distance from the highlight
        put(r, c, l < 0.3 ? 7 : l < 0.6 ? 6 : 5, l < 0.22 ? '@' : l < 0.4 ? '%' : l < 0.58 ? '#' : l < 0.74 ? '*' : l < 0.88 ? '+' : ':', i);
      }
    });
    // labels last, the most linked notes first: under the note, else above it, else to its right or left
    nodes.map(function (n, i) { return i; }).sort(function (a, b) { return nodes[b].deg - nodes[a].deg; }).forEach(function (i) {
      var n = nodes[i], L = n.name.length, R = radius(n);
      var below = Math.round((n.py + R) / ch + 0.6), above = Math.floor((n.py - R) / ch) - 1, mid = Math.round(n.py / ch - 0.5);
      var centre = Math.round(n.px / cw - L / 2);
      var spots = [[below, centre], [above, centre], [mid, Math.ceil((n.px + R) / cw) + 1], [mid, Math.floor((n.px - R) / cw) - L - 1]];
      for (var s = 0; s < spots.length; s++) {
        var r = spots[s][0], c0 = Math.max(1, Math.min(cols - L - 1, spots[s][1])), ok = r >= 0 && r < rows, k;
        for (k = -1; ok && k <= L; k++) { var j = r * cols + c0 + k; if (tone[j] === 9 || (owner[j] >= 0 && owner[j] !== i)) ok = false; }
        if (!ok) continue;
        for (k = -1; k <= L; k++) { var j2 = r * cols + c0 + k; if (c0 + k < 0 || c0 + k >= cols) continue; tone[j2] = 9; chars[j2] = k < 0 || k === L ? ' ' : n.name[k]; owner[j2] = i; }
        return;
      }
    });
  }

  function draw(now) {
    raf = 0;
    var dt = lastT ? now - lastT : 16; lastT = now;
    // the hover: the note grows, its glyphs shuffle for a moment, its links draw out to the
    // neighbours at a steady speed, and each neighbour lights up when its line arrives
    var lit = selected >= 0 ? selected : focusNode, still = reduce.matches, animating = false;
    if (lit !== litNow) { litNow = lit; litAt = now; }
    nodes.forEach(function (n, i) {
      var to = i === lit ? 1 : 0;
      n.g = still ? to : (n.g || 0) + (to - (n.g || 0)) * Math.min(1, dt / 70);
      if (Math.abs(to - n.g) < 0.01) n.g = to; else animating = true;
    });
    var reach = {}, since = now - litAt, shuffle = !still && lit >= 0 && since < 260;
    if (lit >= 0) edges.forEach(function (e) {
      if (e.a !== lit && e.b !== lit) return;
      var other = e.a === lit ? e.b : e.a, len = Math.hypot(nodes[other].px - nodes[lit].px, nodes[other].py - nodes[lit].py);
      var p = still ? 1 : Math.min(1, since * 1.3 / Math.max(len, 1));
      e.p = 1 - (1 - p) * (1 - p); if (p < 1) animating = true; else reach[other] = true;
    });
    if (shuffle) animating = true;
    var moving = step(dt) > 0.04 || !!drag || animating;
    raster();
    ctx.clearRect(0, 0, W, H);
    var font = getComputedStyle(document.documentElement).getPropertyValue('--font-mono'), big = ch * 0.78, small = big * 0.72;
    var revealing = false, shown = !revealAt || now - revealAt > 500;
    // links are plain lines under the notes; they fade in once the reveal is half way
    if (shown) {
      ctx.lineCap = 'round';
      edges.forEach(function (e) {
        var on = lit >= 0 && (e.a === lit || e.b === lit), a = nodes[e.a], b = nodes[e.b];
        ctx.strokeStyle = lit >= 0 ? line.dim : line.rest; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke();
        if (!on) return;
        var from = e.a === lit ? a : b, to = e.a === lit ? b : a;
        ctx.strokeStyle = line.lit; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(from.px, from.py); ctx.lineTo(from.px + (to.px - from.px) * e.p, from.py + (to.py - from.py) * e.p); ctx.stroke();
      });
    }
    for (var r = 0; r < rows; r++) {
      var resolved = !revealAt || now - revealAt >= settle[r];
      if (!resolved) revealing = true;
      for (var c = 0; c < cols; c++) {
        var i = r * cols + c, t = tone[i];
        if (!t) continue;
        var chr = chars[i], label = t === 9, o = owner[i];
        if (!resolved) { if (Math.random() < 0.5) continue; chr = noise[(Math.random() * noise.length) | 0]; t = 2; label = false; }
        else if (label) t = 8;
        if (resolved && lit >= 0) {
          var mine = o === lit || (o >= 0 && reach[o]);
          t = mine ? Math.min(8, t + 2) : (label ? 3 : 0);
          if (shuffle && o === lit && !label) chr = '@%#*+:'[(Math.random() * 6) | 0];
        }
        if (label) { ctx.fillStyle = ground; ctx.fillRect(c * cw, r * ch + 1, cw, ch - 2); if (chr === ' ') continue; }
        ctx.font = (label || t >= 7 ? '500 ' : '400 ') + (t <= 2 && !label ? small : big) + 'px ' + font;
        ctx.fillStyle = palette[t];
        ctx.fillText(chr, (c + 0.5) * cw, (r + 0.5) * ch);
      }
    }
    buttons.forEach(function (b, i) { b.style.transform = 'translate(' + nodes[i].px + 'px,' + nodes[i].py + 'px)'; });
    // rest after 4 s without a drag, even if two notes still nudge each other
    if (drag || !quietFrom) quietFrom = now;
    if ((moving && now - quietFrom < 4000) || revealing) raf = requestAnimationFrame(draw); else lastT = 0;
  }
  function kick() { quietFrom = 0; if (!raf && !stage.hidden) raf = requestAnimationFrame(draw); }

  /* ---- the note beside the graph ---- */
  function openNote(i, fromKeyboard) {
    var n = nodes[i];
    selected = i;
    panel.querySelector('.vnote-path').textContent = 'vault/' + n.path;
    panel.querySelector('#vnote-h').textContent = n.name;
    panel.querySelector('.vnote-body').innerHTML = n.html; // built from our own vault/ by scripts/vault-graph.mjs, escaped there
    panel.querySelector('.vnote-body').scrollTop = 0;
    panel.hidden = false;
    panel.classList.remove('opening'); void panel.offsetWidth; panel.classList.add('opening');
    if (fromKeyboard) panel.querySelector('#vnote-h').focus();
    place(true, !reduce.matches); kick();
  }
  function closeNote() {
    if (panel.hidden) return;
    var back = selected, inside = panel.contains(document.activeElement);
    panel.hidden = true; selected = -1; place(true, !reduce.matches); kick();
    if (back >= 0 && inside) buttons[back].focus();
  }
  panel.addEventListener('click', function (e) {
    var l = e.target.closest('.vlink');
    if (!l) return;
    var j = nodes.findIndex(function (n) { return n.name === l.getAttribute('data-note'); });
    if (j >= 0) openNote(j, true);
  });
  panel.querySelector('.vnote-close').addEventListener('click', closeNote);

  /* ---- the note buttons: hover, focus, click, drag ---- */
  function buildButtons() {
    list.textContent = '';
    buttons = nodes.map(function (n, i) {
      var li = document.createElement('li'), b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', n.name + ', ' + n.deg + ' links. Open the note');
      b.addEventListener('pointerenter', function () { focusNode = i; kick(); });
      b.addEventListener('pointerleave', function () { if (focusNode === i) focusNode = -1; kick(); });
      b.addEventListener('focus', function () { focusNode = i; kick(); });
      b.addEventListener('blur', function () { if (focusNode === i) focusNode = -1; kick(); });
      b.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        var box = graphBox.getBoundingClientRect();
        drag = { i: i, id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: n.px - (e.clientX - box.left), dy: n.py - (e.clientY - box.top), moved: false };
        b.setPointerCapture(e.pointerId);
      });
      b.addEventListener('pointermove', function (e) {
        if (!drag || drag.i !== i || drag.id !== e.pointerId) return;
        if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 5) return;
        drag.moved = true; b.classList.add('dragging');
        var box = graphBox.getBoundingClientRect();
        n.px = Math.max(20, Math.min(W - 20, e.clientX - box.left + drag.dx)); n.py = Math.max(20, Math.min(H - 20, e.clientY - box.top + drag.dy));
        kick();
      });
      function end() {
        if (!drag || drag.i !== i) return;
        if (drag.moved) { n.hx = n.px; n.hy = n.py; n.moved = true; b.dataset.dragged = '1'; } // it stays where it was dropped
        b.classList.remove('dragging'); drag = null; kick();
      }
      b.addEventListener('pointerup', end);
      b.addEventListener('pointercancel', end);
      b.addEventListener('click', function (e) {
        if (b.dataset.dragged) { delete b.dataset.dragged; return; }
        if (selected === i && !panel.hidden) closeNote(); else openNote(i, e.detail === 0);
      });
      li.appendChild(b); list.appendChild(li);
      return b;
    });
  }

  /* ---- open and close the explorer ---- */
  function start() {
    nodes = data.nodes.map(function (n) { return Object.assign({}, n); });
    edges = data.edges.map(function (e) { return { a: e[0], b: e[1] }; });
    adj = nodes.map(function (_, i) { return edges.filter(function (e) { return e.a === i || e.b === i; }).map(function (e) { return e.a === i ? e.b : e.a; }); });
    stage.querySelector('.vstage-hint').textContent = nodes.length + ' notes, ' + edges.length + ' links: the folder the skill copies for you. Click a note to read it, drag it to move it.';
    buildButtons();
  }
  function open() {
    sec.classList.add('exploring'); stage.hidden = false; openBtn.setAttribute('aria-expanded', 'true');
    size(); readPalette(); place(false);
    revealAt = reduce.matches ? 0 : performance.now();
    for (var r = 0; r < rows; r++) settle[r] = (r / rows) * 900 + Math.random() * 250;
    stage.scrollIntoView({ block: 'start', behavior: reduce.matches ? 'auto' : 'smooth' });
    stage.querySelector('#vstage-h').focus({ preventScroll: true });
    lastT = 0; kick();
  }
  function close() {
    closeNote();
    sec.classList.remove('exploring'); stage.hidden = true; openBtn.setAttribute('aria-expanded', 'false');
    cancelAnimationFrame(raf); raf = 0;
    sec.scrollIntoView({ block: 'start', behavior: 'auto' });
    openBtn.focus({ preventScroll: true });
    var art = sec.querySelector('.vault-art');
    if (art) art.dispatchEvent(new CustomEvent('replay'));
  }
  openBtn.addEventListener('click', function () {
    if (data) { open(); return; }
    openBtn.setAttribute('aria-busy', 'true');
    fetch('vault-graph.json').then(function (r) { return r.json(); }).then(function (d) {
      data = d; start(); open();
    }).catch(function () {
      location.href = 'https://github.com/JouberthAlves/off-template-skills/tree/main/vault';
    }).then(function () { openBtn.removeAttribute('aria-busy'); });
  });
  stage.querySelector('.vstage-close').addEventListener('click', close);
  stage.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!panel.hidden) closeNote(); else close();
  });
  new MutationObserver(function () { if (!stage.hidden) { readPalette(); kick(); setTimeout(function () { readPalette(); kick(); }, 760); } }).observe(sec, { attributes: true, attributeFilter: ['data-look'] });
  if ('ResizeObserver' in window) new ResizeObserver(function () { if (stage.hidden || !data) return; size(); place(true); kick(); }).observe(graphBox);
})();
