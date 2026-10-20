// Super-Webdesigner showcase. GSAP 3 + ScrollTrigger + DrawSVG, all from the CDN.
// Everything that moves is off when the visitor asks for reduced motion.
(() => {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- the comparison line ---------- */
  const compare = $('[data-compare]');
  const range = $('[data-range]');
  const state = { x: 50 };
  let dragging = false;
  let hint = null;

  const paint = () => compare.style.setProperty('--x', `${state.x}%`);
  const setX = (v) => { state.x = v; range.value = v; paint(); };

  range.addEventListener('pointerdown', () => { dragging = true; if (hint) hint.kill(); });
  window.addEventListener('pointerup', () => { dragging = false; });

  // Clicks and arrow keys ease to the target instead of jumping.
  range.addEventListener('input', () => {
    if (dragging) { setX(+range.value); return; }
    const target = +range.value;
    range.value = state.x;
    gsap.to(state, {
      x: target, duration: 0.55, ease: 'power3.out', overwrite: true,
      onUpdate: () => { range.value = state.x; paint(); },
    });
  });
  paint();

  /* ---------- desktop / phone toggle ---------- */
  const views = {
    desktop: { good: 'img/steno-desktop.webp', bad: 'img/other-desktop.webp' },
    phone: { good: 'img/steno-mobile.webp', bad: 'img/other-mobile.webp' },
  };
  const segButtons = $$('[data-view]');
  segButtons.forEach((btn) => btn.addEventListener('click', () => {
    const v = btn.dataset.view;
    compare.classList.toggle('phone', v === 'phone');
    $('[data-good]').src = views[v].good;
    $('[data-bad]').src = views[v].bad;
    // SVG elements have no .hidden property, so the attribute is toggled directly
    $('[data-markup-desktop]').toggleAttribute('hidden', v === 'phone');
    $('[data-markup-phone]').toggleAttribute('hidden', v !== 'phone');
    segButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
  }));

  // narrow screens open on the phone view
  if (matchMedia('(max-width: 600px)').matches) segButtons.find((b) => b.dataset.view === 'phone').click();

  /* ---------- in-page links ---------- */
  // Smooth scrolling is done here, not with CSS scroll-behavior: ScrollTrigger measures
  // during a refresh, and a smooth scroll still in flight makes every step read wrong.
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    const target = href.length > 1 && document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.pushState(null, '', href);
  }));

  /* ---------- copy buttons ---------- */
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); } catch (e) { /* no clipboard: the text is still on screen */ }
    const old = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => { btn.textContent = old; }, 1600);
  }));

  /* ---------- motion ---------- */
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // hero: title lines rise out of their clip, the caret and the underline draw in
    gsap.from('.title .line > span', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.12 });
    gsap.from('[data-caret]', { drawSVG: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 });
    // the underline is revealed left to right with a clip: DrawSVG and dashes both measure a
    // non-scaling-stroke path in the wrong space, so its far end showed before the middle drew
    gsap.fromTo('.underline', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power2.out', delay: 1 });
    gsap.from('.crop', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2)', delay: 0.2 });
    gsap.from('.slug span', { opacity: 0, y: 6, duration: 0.5, stagger: 0.06, delay: 0.3 });

    // the Steno card: each line is typed in, one after the other, once the comparison is on screen.
    // Lines start empty; with reduced motion they stay as written in the HTML.
    const typeCard = (sheet) => {
      const lines = $$('.typed-line', sheet);
      const tl = gsap.timeline({ paused: true });
      lines.forEach((el, i) => {
        const text = el.textContent;
        const count = { n: 0 };
        el.textContent = '';
        tl.add(() => {
          el.classList.add('typing');
          if (i > 0) lines[i - 1].classList.remove('typing');
        });
        tl.to(count, { n: text.length, duration: text.length * 0.03, ease: 'none', onUpdate: () => { el.textContent = text.slice(0, Math.round(count.n)); } });
        tl.to({}, { duration: 0.2 });
      });
      return tl;
    };
    const cardTyping = $$('.typed').map(typeCard);

    // comparison: when it's on screen, the line sweeps once to show it moves, then the pencil draws in
    ScrollTrigger.create({
      trigger: compare, start: 'top 75%', once: true,
      onEnter: () => {
        hint = gsap.timeline()
          .to(state, { x: 30, duration: 0.7, ease: 'power2.inOut', onUpdate: () => { range.value = state.x; paint(); } })
          .to(state, { x: 70, duration: 0.9, ease: 'power2.inOut', onUpdate: () => { range.value = state.x; paint(); } })
          .to(state, { x: 50, duration: 0.6, ease: 'power2.inOut', onUpdate: () => { range.value = state.x; paint(); } });
        gsap.from($$('.markup [data-pencil]'), { drawSVG: 0, duration: 0.9, stagger: 0.14, ease: 'power2.out', delay: 0.5 });
        gsap.from($$('.markup .note'), { opacity: 0, duration: 0.6, stagger: 0.1, delay: 1.1 });
        gsap.delayedCall(0.4, () => cardTyping.forEach((tl) => tl.play()));
      },
    });
    gsap.from('.wall-label', { opacity: 0, y: 12, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.wall-label', start: 'top 92%', once: true } });

    // the ten tells: each one gets struck through in red as it comes in
    $$('.tell-list li').forEach((li) => {
      gsap.from(li, { opacity: 0, x: -14, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: li, start: 'top 88%', once: true } });
      gsap.to(li, { '--strike': 1, duration: 0.5, ease: 'power2.inOut', scrollTrigger: { trigger: li, start: 'top 80%', once: true } });
    });

    // the flow: each check lights up as you reach it, and the track to the next one
    // fills in red while you scroll through that step. The last check lights when you
    // reach it, so the line ends where the steps end.
    const steps = $$('.steps > li');
    steps.forEach((li, i) => {
      if (i < steps.length - 1) {
        const seg = document.createElement('span');
        seg.className = 'track-fill';
        li.append(seg);
        gsap.fromTo(seg, { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: li, start: 'top 65%', end: 'bottom 65%', scrub: true },
        });
      }
      ScrollTrigger.create({
        trigger: li, start: 'top 65%',
        onEnter: () => li.classList.add('done'),
        onLeaveBack: () => li.classList.remove('done'),
      });
      gsap.from(li, { opacity: 0.35, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: li, start: 'top 90%', once: true } });
    });
    $$('.stamp').forEach((s) => {
      gsap.from(s, { scale: 1.6, opacity: 0, rotation: -12, duration: 0.45, ease: 'back.out(2)', scrollTrigger: { trigger: s, start: 'top 88%', once: true } });
    });

    // proof sheet and install
    gsap.utils.toArray('.proof figure, .install-grid > div').forEach((el) => {
      gsap.from(el, { opacity: 0, y: 18, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
  });

  // Refresh once the page has loaded. Not on image load: the lazy images have width and height,
  // so nothing moves when they arrive, and a refresh while the page is scrolled would miscount.
  window.addEventListener('load', () => ScrollTrigger.refresh());

  // Reduced motion: nothing above runs, and the page is already in its final state.
})();
