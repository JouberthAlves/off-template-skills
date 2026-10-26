(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Safety: after 2.5 s force everything visible at its final state.
  setTimeout(function () { root.classList.add('motion-done'); }, 2500);

  // Status dot: open between 11:30 and 15:00 local time.
  var now = new Date();
  var minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes >= 11 * 60 + 30 && minutes < 15 * 60) {
    var openNow = document.querySelector('.open-now');
    var dot = document.querySelector('.dot');
    if (openNow) openNow.hidden = false;
    if (dot && !reduce) dot.classList.add('is-open');
  }

  // Pointer drift on the round photo.
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce || !fine) return;

  var hero = document.querySelector('.hero');
  var img = document.querySelector('.lens-drift img');
  if (!hero || !img) return;

  var tx = 0, ty = 0, cx = 0, cy = 0, running = false;

  function frame() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    img.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
    if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  function kick() {
    if (!running) {
      running = true;
      requestAnimationFrame(frame);
    }
  }

  function listen() {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      var ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      nx = Math.max(-1, Math.min(1, nx));
      ny = Math.max(-1, Math.min(1, ny));
      tx = nx * 10;
      ty = ny * 8;
      kick();
    });
    hero.addEventListener('pointerleave', function () {
      tx = 0;
      ty = 0;
      kick();
    });
  }

  setTimeout(listen, 900);
})();
