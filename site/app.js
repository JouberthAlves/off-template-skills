/* Super-Webdesigner, Part 1: install block and the agent window. */
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

  function pick(key) {
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
      current = key;
      root.dataset.look = key;
      window.dispatchEvent(new CustomEvent('look', { detail: key }));
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
    b.addEventListener('click', function () { pick(b.getAttribute('data-dir')); });
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
