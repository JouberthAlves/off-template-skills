document.documentElement.classList.add('js');

const MENU = [
  { group: 'Burgers', items: [
    { id: 'single', name: 'Single', price: 9.5, desc: 'One smashed patty, American cheese, pickles, onions, house sauce.' },
    { id: 'double', name: 'Double', price: 12.5, desc: 'Two patties, two slices. The one most tickets say.' },
    { id: 'melt', name: 'Mushroom melt', price: 13, desc: 'Double, griddled mushrooms, Swiss, on toasted rye.' },
  ]},
  { group: 'On the side', items: [
    { id: 'fries', name: 'Fries', price: 4, desc: 'Skin-on, salted while hot.' },
    { id: 'shake', name: 'Shake', price: 6, desc: 'Vanilla or coffee, made to order.' },
    { id: 'soda', name: 'Cold soda', price: 2.5, desc: 'From the cooler by the window.' },
  ]},
];

const HOURS = { // day index (0 = Sunday): [open, close] in minutes, close may pass midnight
  0: [720, 1200], 1: [690, 1320], 2: [690, 1320], 3: [690, 1320], 4: [690, 1320], 5: [690, 1500], 6: [690, 1500],
};

const money = (n) => '$' + (Number.isInteger(n) ? n : n.toFixed(2));
const byId = Object.fromEntries(MENU.flatMap((g) => g.items).map((i) => [i.id, i]));
const ticket = new Map();

/* ---------- price list ---------- */
const list = document.querySelector('[data-menu]');
for (const g of MENU) {
  const group = document.createElement('div');
  group.className = 'group';
  group.innerHTML = `<h3>${g.group}</h3>`;
  for (const item of g.items) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'item';
    b.dataset.id = item.id;
    b.setAttribute('aria-label', `Add ${item.name}, ${money(item.price)}, to your ticket`);
    b.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-dots" aria-hidden="true"></span>
      <span class="item-price">${item.price.toFixed(2)}</span>
      <span class="item-add" aria-hidden="true">+</span>
      <span class="item-desc">${item.desc}</span>
      <span class="item-qty" data-qty></span>`;
    b.addEventListener('click', () => add(item.id));
    group.append(b);
  }
  list.append(group);
}

/* ---------- ticket ---------- */
const bar = document.querySelector('[data-bar]');
const dialog = document.querySelector('[data-ticket]');
const lines = dialog.querySelector('[data-ticket-lines]');
const nameInput = dialog.querySelector('#ticket-name');
const done = dialog.querySelector('[data-done]');
let nextNumber = 28; // 27 is on the rail already

function add(id) {
  ticket.set(id, (ticket.get(id) || 0) + 1);
  render();
}

function render() {
  let count = 0, total = 0;
  for (const [id, qty] of ticket) { count += qty; total += qty * byId[id].price; }
  document.querySelectorAll('.item').forEach((el) => {
    const q = ticket.get(el.dataset.id);
    el.querySelector('[data-qty]').textContent = q ? `${q} on your ticket` : '';
  });
  bar.hidden = count === 0;
  bar.querySelector('[data-bar-count]').textContent = `${count} item${count === 1 ? '' : 's'}`;
  bar.querySelector('[data-bar-total]').textContent = money(total);
  lines.innerHTML = [...ticket].map(([id, qty]) => `<li><span>${qty}x ${byId[id].name}</span><span>${money(qty * byId[id].price)}</span></li>`).join('');
  dialog.querySelector('[data-ticket-total]').textContent = money(total);
}

bar.querySelector('[data-open-ticket]').addEventListener('click', () => {
  dialog.classList.remove('is-done');
  done.hidden = true;
  dialog.showModal();
});

dialog.querySelector('[data-place]').addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) { nameInput.reportValidity(); nameInput.focus(); return; }
  const n = nextNumber++;
  const stamp = dialog.querySelector('.stamp-ticket');
  dialog.querySelector('[data-done-number]').textContent = `No. ${n}`;
  dialog.querySelector('[data-done-text]').textContent = `Thanks, ${name}. Your number is ${n}: ready in about 7 minutes at the window. (This is a demo, nothing was sent.)`;
  dialog.classList.add('is-done');
  done.hidden = false;
  stamp.classList.remove('is-pressed'); void stamp.offsetWidth; stamp.classList.add('is-pressed');
  ticket.clear();
  nameInput.value = '';
  render();
  done.querySelector('button').focus();
});

document.querySelector('[data-start-order]').addEventListener('click', (e) => {
  e.preventDefault();
  const first = document.querySelector('.item');
  document.getElementById('menu').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  first.classList.add('is-in');
  first.focus({ preventScroll: true });
});

/* ---------- open now ---------- */
function openState(now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = HOURS[now.getDay()];
  const yesterday = HOURS[(now.getDay() + 6) % 7];
  if (mins >= today[0] && mins < today[1]) return { open: true, until: today[1] };
  if (yesterday[1] > 1440 && mins < yesterday[1] - 1440) return { open: true, until: yesterday[1] };
  return { open: false, next: mins < today[0] ? today[0] : HOURS[(now.getDay() + 1) % 7][0] };
}
const hhmm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
function paintOpen() {
  const s = openState();
  document.querySelectorAll('[data-open]').forEach((el) => {
    el.classList.toggle('is-open', s.open);
    el.textContent = s.open ? `Open now, until ${hhmm(s.until)}` : `Closed now, opens at ${hhmm(s.next)}`;
  });
}
paintOpen();
setInterval(paintOpen, 60_000);

/* ---------- price list prints in ---------- */
const items = document.querySelectorAll('.item');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = [...items].indexOf(e.target) % 3;
      setTimeout(() => e.target.classList.add('is-in'), i * 90);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('is-in'));
}
