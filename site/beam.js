/* Safelight pillar for #hero: a tilted column of red light whose caustic strands fold, split and flow,
   one fragment shader, plus --lit / --lx on [data-lit] elements so they catch it. */
(function () {
  'use strict';

  var hero = document.getElementById('hero');
  if (!hero) return;
  var canvas = hero.querySelector('canvas.beam');
  var stage = hero.querySelector('.stage');
  var copy = hero.querySelector('.copy');
  var litEls = Array.prototype.slice.call(hero.querySelectorAll('[data-lit]'));
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqWide = window.matchMedia('(min-width: 960px)');

  var DEG = Math.PI / 180;
  var MAX_PIXELS = 1.8e6;
  var TARGET_INTENSITY = 1.0;
  var INTRO_MS = 1400;
  var TILT = 22 * DEG; // top-left to bottom-right: from above the headline down onto the tray

  // ax, ay: the point the pillar turns around; w: the half-width of its body
  var geo = { w: 0, h: 0, ax: 0, ay: 0, half: 70, int: 1 };
  var gl = null, prog = null, loc = {};
  var cTop = [0.9, 0.14, 0.1], cLow = [0.95, 0.55, 0.5], cCore = [0.96, 0.96, 0.96];
  var scale = 1;
  var running = false, visible = true, raf = 0;
  var tStart = 0, tLast = 0, ang = TILT, shift = 0, ptr = null, pulseAt = -10;
  var lastLit = [];
  var started = false;

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
  var FRAG = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 u_res;uniform float u_scale;uniform float u_time;uniform vec2 u_anchor;uniform float u_ang;',
    'uniform float u_half;uniform vec3 u_top;uniform vec3 u_low;uniform vec3 u_core;uniform float u_int;uniform float u_pulse;',
    'float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float vnoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);',
    'float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));',
    'return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}',
    'float fbm(vec2 p){float s=0.0;float a=0.5;for(int i=0;i<4;i++){s+=a*vnoise(p);p*=2.03;a*=0.5;}return s;}',
    'float soft(vec2 p){return 0.65*vnoise(p)+0.35*vnoise(p*2.1+7.3);}',
    'void main(){',
    '  vec2 p=vec2(gl_FragCoord.x,u_res.y-gl_FragCoord.y)/u_scale;',
    '  float hh=u_res.y/u_scale;float t=u_time;',
    '  vec2 d=p-u_anchor;',
    // u runs down the pillar, s across it
    '  vec2 ax=vec2(sin(u_ang),cos(u_ang));vec2 nx=vec2(ax.y,-ax.x);',
    '  float u=dot(d,ax);float s=dot(d,nx);',
    // the body bends a little along its length
    '  s+=u_half*0.45*(fbm(vec2(u*0.002,t*0.05))-0.5);',
    '  float x=s/u_half;',
    '  float body=exp(-x*x*0.5);',
    '  float env=exp(-x*x*0.85);',
    '  float bloom=exp(-abs(x)/2.6);',
    // caustics: ridged noise stretched along the pillar and folded by a warp, so many strands
    // run down it, merge, split and twist; two scales give thick sheets and thin threads
    '  vec2 q=vec2(x,u/(u_half*5.0));',
    '  q.x+=0.55*(fbm(vec2(q.x*0.9,q.y*0.8-t*0.22))-0.5);',
    '  float n1=soft(vec2(q.x*1.7,q.y*0.9-t*0.3));',
    '  float n2=soft(vec2(q.x*3.1+4.3,q.y*1.4-t*0.45));',
    '  float r1=1.0-abs(n1*2.0-1.0);float r2=1.0-abs(n2*2.0-1.0);',
    '  float n3=soft(vec2(q.x*5.8+9.1,q.y*2.3-t*0.62));float r3=1.0-abs(n3*2.0-1.0);',
    '  float caustic=pow(r1,5.0)*0.75+pow(r2,9.0)*0.55+pow(r3,18.0)*0.6;',
    '  float sheen=fbm(vec2(q.x*1.4,q.y*0.6-t*0.15));',
    '  float light=body*(0.2+0.22*sheen)+caustic*env*0.95+bloom*0.12;',
    // a pulse that runs down the pillar after a click
    '  float k=t-u_pulse;float wave=(k>0.0&&k<1.4)?exp(-pow(u-(-hh*0.6+k*hh*1.3),2.0)/(2.0*140.0*140.0))*(1.0-k/1.4):0.0;',
    '  light*=1.0+wave*0.55;',
    // fade in at the top of the page; it runs down to the hero's bottom edge
    '  light*=smoothstep(-hh*0.05,hh*0.12,p.y)*pow(1.0-smoothstep(hh*0.8,hh*0.995,p.y),1.6);',
    '  light=clamp(light,0.0,1.0);',
    // tone ramp: deep red at the edges, the logo red, a lighter red in the folds, near white on the peaks
    '  vec3 deep=u_top*0.38;',
    '  vec3 col=mix(deep,u_top,smoothstep(0.02,0.3,light));',
    '  col=mix(col,u_low,smoothstep(0.3,0.68,light));',
    '  col=mix(col,u_core,smoothstep(0.72,1.0,light)*0.7);',
    '  light=min(light,0.82);',
    '  float al=light*u_int;',
    '  gl_FragColor=vec4(col*al,al);',
    '}'
  ].join('\n');

  function parseColor(name, fallback) {
    var s = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    var probe = document.createElement('span');
    probe.style.color = s;
    probe.style.display = 'none';
    document.body.appendChild(probe);
    var rgb = getComputedStyle(probe).color;
    probe.remove();
    var m = /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(rgb);
    if (m) return [m[1] / 255, m[2] / 255, m[3] / 255];
    m = /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i.exec(rgb);
    if (m) return [+m[1], +m[2], +m[3]];
    return fallback;
  }

  function measure() {
    var r = hero.getBoundingClientRect();
    geo.w = r.width;
    geo.h = r.height;
    var wide = mqWide.matches;
    if (wide && stage && copy) {
      // Turns around the gap between the words and the tray, so it crosses the headline above and the tray below.
      var sr = stage.getBoundingClientRect(), cr = copy.getBoundingClientRect();
      geo.ax = (cr.right + sr.left) / 2 - r.left;
      geo.ay = (sr.top - r.top) + sr.height * 0.35;
      geo.half = 118;
      geo.int = 1;
    } else {
      geo.ax = geo.w * 0.5;
      geo.ay = geo.h * 0.3;
      geo.half = 46;
      geo.int = 0.62;
    }
    hero.style.setProperty('--lamp-x', geo.ax.toFixed(1) + 'px');
    hero.style.setProperty('--lamp-y', geo.ay.toFixed(1) + 'px');
    if (gl) sizeCanvas();
  }

  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var px = geo.w * geo.h * dpr * dpr;
    if (px > MAX_PIXELS) dpr *= Math.sqrt(MAX_PIXELS / px);
    scale = dpr;
    var w = Math.max(1, Math.floor(geo.w * scale));
    var h = Math.max(1, Math.floor(geo.h * scale));
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    gl.viewport(0, 0, w, h);
  }

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
    return s;
  }

  function initGL() {
    try {
      gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    } catch (e) { gl = null; }
    if (!gl) return false;
    var vs = compile(gl.VERTEX_SHADER, VERT);
    var fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var pl = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(pl);
    gl.vertexAttribPointer(pl, 2, gl.FLOAT, false, 0, 0);
    ['u_res', 'u_scale', 'u_time', 'u_anchor', 'u_ang', 'u_half', 'u_top', 'u_low', 'u_core', 'u_int', 'u_pulse'].forEach(function (n) {
      loc[n] = gl.getUniformLocation(prog, n);
    });
    readHeroColors(true);
    gl.clearColor(0, 0, 0, 0);
    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      goStatic();
    });
    return true;
  }

  /* The light's three tones come from the hero tokens for the chosen look. They glide to a new look in ~1 s. */
  var tgtTop = null, tgtLow = null, tgtCore = null;
  function readHeroColors(now) {
    tgtTop = parseColor('--hero-top', cTop);
    tgtLow = parseColor('--hero-low', cLow);
    tgtCore = parseColor('--hero-core', cCore);
    if (now) { cTop = tgtTop.slice(); cLow = tgtLow.slice(); cCore = tgtCore.slice(); }
  }
  function glideColors(dt) {
    var k = 1 - Math.exp(-dt / 0.35);
    [[cTop, tgtTop], [cLow, tgtLow], [cCore, tgtCore]].forEach(function (p) {
      if (!p[1]) return;
      for (var i = 0; i < 3; i++) p[0][i] += (p[1][i] - p[0][i]) * k;
    });
  }
  window.addEventListener('look', function () { if (gl) readHeroColors(false); });

  function draw(t, intensity) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(loc.u_res, canvas.width, canvas.height);
    gl.uniform1f(loc.u_scale, scale);
    gl.uniform1f(loc.u_time, t);
    gl.uniform2f(loc.u_anchor, geo.ax + shift, geo.ay);
    gl.uniform1f(loc.u_ang, ang);
    gl.uniform1f(loc.u_half, geo.half);
    gl.uniform3f(loc.u_top, cTop[0], cTop[1], cTop[2]);
    gl.uniform3f(loc.u_low, cLow[0], cLow[1], cLow[2]);
    gl.uniform3f(loc.u_core, cCore[0], cCore[1], cCore[2]);
    gl.uniform1f(loc.u_int, intensity);
    gl.uniform1f(loc.u_pulse, pulseAt);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  /* Sets --lit and --lx on every [data-lit] element, from where the pillar crosses it. */
  function updateLit(intro) {
    var hr = hero.getBoundingClientRect();
    var tan = Math.tan(ang), cos = Math.cos(ang);
    var reach = geo.half * 2.2;
    for (var i = 0; i < litEls.length; i++) {
      var el = litEls[i];
      var r = el.getBoundingClientRect();
      var left = r.left - hr.left, top = r.top - hr.top;
      // the pillar's x at the top edge of the box: light falls from above
      var y = top + Math.min(r.height * 0.25, 60);
      var axisAt = geo.ax + shift + (y - geo.ay) * tan;
      var gap = axisAt < left ? left - axisAt : (axisAt > left + r.width ? axisAt - left - r.width : 0);
      var lit = Math.pow(clamp(1 - (gap * cos) / reach, 0, 1), 1.3) * intro;
      var lx = r.width > 0 ? clamp((axisAt - left) / r.width * 100, 0, 100) : 50;
      var litS = lit.toFixed(3), lxS = lx.toFixed(1);
      var key = litS + '|' + lxS;
      if (lastLit[i] !== key) {
        lastLit[i] = key;
        el.style.setProperty('--lit', litS);
        el.style.setProperty('--lx', lxS);
      }
    }
  }

  function easeOut(k) { return 1 - Math.pow(1 - k, 3); }

  function frame(now) {
    raf = 0;
    if (!running) return;
    var dt = Math.min(0.1, (now - tLast) / 1000);
    tLast = now;
    var t = (now - tStart) / 1000;

    // a slow sway, and a lean toward the pointer
    var targetAng = TILT + 4 * DEG * Math.sin(Math.PI * 2 * t / 9);
    var targetShift = 0;
    if (ptr) {
      var hr = hero.getBoundingClientRect();
      var px = ptr.x - hr.left - geo.ax;
      targetShift = clamp(px * 0.08, -60, 60);
      targetAng += clamp(px / Math.max(geo.w, 1), -0.5, 0.5) * 6 * DEG;
    }
    var ease = 1 - Math.exp(-dt / 0.45);
    ang += (targetAng - ang) * ease;
    shift += (targetShift - shift) * ease;

    glideColors(dt);
    var k = easeOut(clamp((now - tStart) / INTRO_MS, 0, 1));
    draw(t, geo.int * k);
    /* Style rebuilds already thrash layout. Skip the per-frame measurements until they finish. */
    if (!document.documentElement.classList.contains('switching')) updateLit(k);
    raf = requestAnimationFrame(frame);
  }

  /* One still frame: reduced motion, and after a resize while stopped. */
  function drawStill() {
    ang = TILT;
    shift = 0;
    if (gl) draw(3.0, geo.int);
    updateLit(1);
  }

  function sync() {
    var want = visible && !document.hidden && !mqReduce.matches && !!gl;
    if (want && !running) {
      running = true;
      tLast = performance.now();
      if (!tStart) tStart = tLast;
      raf = requestAnimationFrame(frame);
    } else if (!want && running) {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
    if (!want && mqReduce.matches) drawStill();
  }

  function goStatic() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    gl = null;
    hero.classList.add('beam-static');
    ang = TILT;
    shift = 0;
    measure();
    updateLit(1);
  }

  function onResize() {
    if (!started) return;
    measure();
    if (!gl) { updateLit(1); return; }
    if (!running) drawStill();
  }

  function init() {
    if (started) return;
    started = true;
    measure();
    if (!initGL()) { goStatic(); }
    else { sizeCanvas(); }

    if ('ResizeObserver' in window) {
      new ResizeObserver(onResize).observe(hero);
    } else {
      window.addEventListener('resize', onResize);
    }
    mqWide.addEventListener && mqWide.addEventListener('change', onResize);
    mqReduce.addEventListener && mqReduce.addEventListener('change', function () {
      if (!mqReduce.matches) { tStart = 0; }
      sync();
    });

    window.addEventListener('pointermove', function (e) { ptr = { x: e.clientX, y: e.clientY }; }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { ptr = null; });
    // A click on the hero's empty ground sends one soft pulse down the pillar;
    // not on controls, and not again while the last one is still running.
    hero.addEventListener('pointerdown', function (e) {
      if (!running || e.target.closest('a, button, input, [role="tab"], .agent, .cmd-row')) return;
      var now = (performance.now() - tStart) / 1000;
      if (now - pulseAt < 1.6) return;
      pulseAt = now;
    }, { passive: true });
    document.addEventListener('visibilitychange', sync);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[entries.length - 1].isIntersecting;
        sync();
      }, { threshold: 0 }).observe(hero);
    }

    if (gl) { sync(); if (!running) drawStill(); }
  }

  if ('requestIdleCallback' in window) requestIdleCallback(init, { timeout: 400 });
  else setTimeout(init, 200);
})();
