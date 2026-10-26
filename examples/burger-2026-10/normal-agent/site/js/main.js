(function () {
  "use strict";

  /* ---------- Data ---------- */
  var MENU = [
    { id: "classic", cat: "burgers", name: "The Classic", price: 9.5, desc: "Single smashed patty, American cheese, pickles, onion, house sauce.", art: { patties: 1, cheese: true, lettuce: false, tomato: false }, bg: "#f6d9a3" },
    { id: "ember-double", cat: "burgers", name: "Ember Double", price: 13.5, badge: "Best seller", desc: "Two patties, double cheese, grilled onions, burnt-honey mustard.", art: { patties: 2, cheese: true, lettuce: false, tomato: false }, bg: "#f4c27a" },
    { id: "garden", cat: "burgers", name: "Garden Stack", price: 11, desc: "Single patty, cheddar, crisp lettuce, beefsteak tomato, mayo.", art: { patties: 1, cheese: true, lettuce: true, tomato: true }, bg: "#cfe3b0" },
    { id: "inferno", cat: "burgers", name: "Inferno 🌶", price: 13, desc: "Two patties, pepper jack, charred jalapeños, ghost-pepper aioli.", art: { patties: 2, cheese: true, lettuce: true, tomato: false, spicy: true }, bg: "#f3b29e" },
    { id: "mushroom", cat: "burgers", name: "Mushroom Melt 🌱", price: 12, desc: "Roasted portobello, Swiss, caramelised onion, truffle mayo.", art: { patties: 1, cheese: true, lettuce: true, tomato: false, veg: true }, bg: "#e2d4c0" },
    { id: "triple", cat: "burgers", name: "The Foundry", price: 16, badge: "Big appetite", desc: "Three patties, three cheeses, bacon jam, the works.", art: { patties: 3, cheese: true, lettuce: true, tomato: true }, bg: "#f2c88f" },
    { id: "fries", cat: "sides", name: "Hand-cut Fries 🌱", price: 4.5, desc: "Twice-fried russets, sea salt. Ask for garlic-herb.", art: { type: "fries" }, bg: "#f8dc8f" },
    { id: "loaded", cat: "sides", name: "Loaded Fries", price: 7.5, desc: "Cheese sauce, crispy shallots, chopped pickles, house sauce.", art: { type: "fries", loaded: true }, bg: "#f5cf7a" },
    { id: "rings", cat: "sides", name: "Onion Rings 🌱", price: 5.5, desc: "Beer-battered sweet onion, smoky ketchup.", art: { type: "rings" }, bg: "#f1d7a9" },
    { id: "vanilla", cat: "shakes", name: "Vanilla Bean Shake", price: 6.5, desc: "Greenfield Creamery soft serve, real vanilla bean.", art: { type: "shake", color: "#fff1d6" }, bg: "#f3e6cf" },
    { id: "burnt-honey", cat: "shakes", name: "Burnt-Honey Shake", price: 7, badge: "Fan favourite", desc: "Caramelised honey, sea salt, crushed honeycomb.", art: { type: "shake", color: "#e9b25a" }, bg: "#f6d49a" },
    { id: "lemonade", cat: "shakes", name: "Fresh Lemonade", price: 3.5, desc: "Squeezed daily. Free refills when you dine in.", art: { type: "cup", color: "#ffe46b" }, bg: "#f7eeb2" }
  ];

  // 0 = Sunday. Times in 24h decimal.
  var HOURS = [
    { day: "Sunday", open: 12, close: 21 },
    { day: "Monday", open: null, close: null },
    { day: "Tuesday", open: 11, close: 22 },
    { day: "Wednesday", open: 11, close: 22 },
    { day: "Thursday", open: 11, close: 22 },
    { day: "Friday", open: 11, close: 24 },
    { day: "Saturday", open: 11, close: 24 }
  ];

  var TAX = 0.08;
  var STORAGE_KEY = "emberbun-cart";

  /* ---------- Helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return "$" + n.toFixed(2); };
  var fmtHour = function (h) {
    if (h === 24) return "Midnight";
    var hr = Math.floor(h), m = Math.round((h - hr) * 60);
    var suffix = hr >= 12 ? "pm" : "am";
    var h12 = hr % 12 || 12;
    return h12 + (m ? ":" + String(m).padStart(2, "0") : "") + suffix;
  };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- Illustrations ---------- */
  function burgerSVG(a) {
    var y = 150, parts = [];
    // bottom bun
    parts.push('<path d="M30 ' + y + 'h140v8c0 12-10 22-22 22H52c-12 0-22-10-22-22z" fill="#d98a2b"/>');
    for (var i = 0; i < a.patties; i++) {
      y -= 18;
      var pattyColor = a.veg ? "#7a5a3c" : "#4a2414";
      parts.push('<rect x="26" y="' + y + '" width="148" height="20" rx="10" fill="' + pattyColor + '"/>');
      if (a.cheese) {
        var c = a.spicy ? "#ffb02e" : "#ffcf3a";
        parts.push('<path d="M24 ' + (y - 2) + 'h152l-10 8-10 12-10-12-16 10-12-10-18 14-14-14-18 12-12-12-14 10-10-10z" fill="' + c + '"/>');
        y -= 4;
      }
    }
    if (a.tomato) {
      y -= 12;
      parts.push('<rect x="36" y="' + y + '" width="60" height="12" rx="6" fill="#e2412b"/><rect x="102" y="' + y + '" width="62" height="12" rx="6" fill="#d23722"/>');
    }
    if (a.spicy) {
      y -= 8;
      parts.push('<g fill="#3f8a2a"><circle cx="60" cy="' + (y + 4) + '" r="6"/><circle cx="100" cy="' + (y + 2) + '" r="6"/><circle cx="140" cy="' + (y + 4) + '" r="6"/></g>');
    }
    if (a.lettuce) {
      y -= 8;
      parts.push('<path d="M22 ' + (y + 10) + 'c6-10 12 4 20-4s12 6 20-2 14 6 20-2 14 6 20-2 14 6 20-2 14 6 20-2 12 6 18 12z" fill="#7cc04a"/>');
    }
    // top bun
    var top = y - 2;
    parts.push('<path d="M26 ' + top + 'C26 ' + (top - 50) + ' 60 ' + (top - 78) + ' 100 ' + (top - 78) + 'S174 ' + (top - 50) + ' 174 ' + top + 'c0 4-3 6-7 6H33c-4 0-7-2-7-6z" fill="#eea445"/>');
    parts.push('<g fill="#fff3d6"><ellipse cx="78" cy="' + (top - 52) + '" rx="4" ry="2.4"/><ellipse cx="102" cy="' + (top - 62) + '" rx="4" ry="2.4"/><ellipse cx="126" cy="' + (top - 50) + '" rx="4" ry="2.4"/><ellipse cx="92" cy="' + (top - 34) + '" rx="4" ry="2.4"/><ellipse cx="140" cy="' + (top - 30) + '" rx="4" ry="2.4"/><ellipse cx="62" cy="' + (top - 28) + '" rx="4" ry="2.4"/></g>');
    return '<svg viewBox="0 0 200 190" aria-hidden="true">' + parts.join("") + "</svg>";
  }

  function friesSVG(a) {
    var sticks = "";
    var xs = [56, 70, 84, 98, 112, 126, 140];
    xs.forEach(function (x, i) {
      var h = 70 + ((i * 37) % 30);
      var rot = (i - 3) * 4;
      sticks += '<rect x="' + x + '" y="' + (110 - h) + '" width="12" height="' + (h + 30) + '" rx="3" fill="#ffd25e" stroke="#e0a52a" stroke-width="2" transform="rotate(' + rot + ' ' + (x + 6) + ' 120)"/>';
    });
    var loaded = a.loaded ? '<path d="M50 98c20-14 40 6 50-4s30 10 50-2v16H50z" fill="#ffb52e"/><g fill="#7a3b1a"><circle cx="70" cy="96" r="3"/><circle cx="104" cy="92" r="3"/><circle cx="132" cy="98" r="3"/></g><g fill="#5a9a2e"><rect x="84" y="94" width="6" height="4" rx="1"/><rect x="118" y="90" width="6" height="4" rx="1"/></g>' : "";
    return '<svg viewBox="0 0 200 190" aria-hidden="true">' + sticks + loaded +
      '<path d="M44 104h112l-12 76H56z" fill="#d63a22"/><path d="M44 104h112l-2 12H46z" fill="#b52d18"/>' +
      '<text x="100" y="152" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="22" fill="#fbe9c8">E&amp;B</text></svg>';
  }

  function ringsSVG() {
    var r = "";
    [[70, 120], [120, 110], [95, 80], [140, 150], [60, 160]].forEach(function (p) {
      r += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="28" fill="none" stroke="#d98a2b" stroke-width="16"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="28" fill="none" stroke="#f2b453" stroke-width="8" stroke-dasharray="6 5"/>';
    });
    return '<svg viewBox="0 0 200 190" aria-hidden="true">' + r + "</svg>";
  }

  function shakeSVG(a) {
    return '<svg viewBox="0 0 200 190" aria-hidden="true">' +
      '<rect x="112" y="10" width="8" height="70" rx="3" fill="#d63a22" transform="rotate(14 116 45)"/>' +
      '<path d="M58 60c0-18 18-30 42-30s42 12 42 30z" fill="#fffaf0"/>' +
      '<circle cx="100" cy="28" r="9" fill="#d63a22"/>' +
      '<path d="M54 60h92l-12 120H66z" fill="' + a.color + '" stroke="#1c1512" stroke-width="3"/>' +
      '<path d="M58 92h84" stroke="#1c1512" stroke-width="3"/>' +
      '<path d="M50 56h100v8H50z" fill="#1c1512"/></svg>';
  }

  function cupSVG(a) {
    return '<svg viewBox="0 0 200 190" aria-hidden="true">' +
      '<rect x="104" y="14" width="8" height="70" rx="3" fill="#5a9a2e" transform="rotate(10 108 50)"/>' +
      '<path d="M58 50h84l-10 130H68z" fill="' + a.color + '" stroke="#1c1512" stroke-width="3"/>' +
      '<circle cx="86" cy="100" r="16" fill="#fff6b0" stroke="#e8c12a" stroke-width="3"/><path d="M86 84v32M70 100h32" stroke="#e8c12a" stroke-width="2"/>' +
      '<rect x="110" y="120" width="14" height="14" rx="3" fill="#fff" opacity=".7"/><rect x="92" y="140" width="12" height="12" rx="3" fill="#fff" opacity=".7"/>' +
      '<path d="M52 44h96v8H52z" fill="#1c1512"/></svg>';
  }

  function artFor(item) {
    var a = item.art;
    if (a.type === "fries") return friesSVG(a);
    if (a.type === "rings") return ringsSVG(a);
    if (a.type === "shake") return shakeSVG(a);
    if (a.type === "cup") return cupSVG(a);
    return burgerSVG(a);
  }

  /* ---------- Menu ---------- */
  var grid = $("#menu-grid");
  function renderMenu(filter) {
    var items = MENU.filter(function (m) { return filter === "all" || m.cat === filter; });
    grid.innerHTML = items.map(function (m, i) {
      return '<article class="card" style="animation-delay:' + i * 40 + 'ms">' +
        '<div class="card-art" style="background:' + m.bg + '">' + (m.badge ? '<span class="badge">' + esc(m.badge) + "</span>" : "") + artFor(m) + "</div>" +
        '<div class="card-body"><div class="card-title"><h3>' + esc(m.name) + '</h3><span class="price">' + money(m.price) + "</span></div>" +
        "<p>" + esc(m.desc) + "</p>" +
        '<button class="btn btn-small add-btn" type="button" data-id="' + m.id + '" aria-label="Add ' + esc(m.name) + ' to order">Add +</button></div></article>';
    }).join("");
  }

  $$(".tabs [role=tab]").forEach(function (tab) {
    tab.addEventListener("click", function () {
      $$(".tabs [role=tab]").forEach(function (t) { t.setAttribute("aria-selected", t === tab ? "true" : "false"); });
      renderMenu(tab.dataset.filter);
    });
  });

  grid.addEventListener("click", function (e) {
    var btn = e.target.closest(".add-btn");
    if (!btn) return;
    addToCart(btn.dataset.id);
  });

  /* ---------- Cart ---------- */
  var cart = {};
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    Object.keys(saved).forEach(function (id) { if (byId(id) && saved[id] > 0) cart[id] = Math.min(saved[id], 20); });
  } catch (err) { cart = {}; }

  function byId(id) { for (var i = 0; i < MENU.length; i++) if (MENU[i].id === id) return MENU[i]; return null; }
  function persist() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (err) { /* storage unavailable */ } }

  function addToCart(id) {
    cart[id] = Math.min((cart[id] || 0) + 1, 20);
    persist(); renderCart();
    var c = $(".cart-count");
    c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
    toast(byId(id).name.replace(/ [🌱🌶]/gu, "") + " added to your order");
  }

  function changeQty(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    if (cart[id] > 20) cart[id] = 20;
    persist(); renderCart();
  }

  function renderCart() {
    var ids = Object.keys(cart);
    var count = 0, subtotal = 0;
    $("#cart-list").innerHTML = ids.map(function (id) {
      var m = byId(id), q = cart[id];
      count += q; subtotal += m.price * q;
      return '<li class="cart-item"><span class="name">' + esc(m.name) + '</span><span class="line-price">' + money(m.price * q) + "</span>" +
        '<span class="qty"><button type="button" data-id="' + id + '" data-d="-1" aria-label="Remove one ' + esc(m.name) + '">−</button>' +
        "<output>" + q + "</output>" +
        '<button type="button" data-id="' + id + '" data-d="1" aria-label="Add one ' + esc(m.name) + '">+</button></span></li>';
    }).join("");
    $("#cart-empty").hidden = ids.length > 0;
    $(".cart-count").textContent = count;
    var tax = subtotal * TAX;
    $("#subtotal").textContent = money(subtotal);
    $("#tax").textContent = money(tax);
    $("#total").textContent = money(subtotal + tax);
  }

  $("#cart-list").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-id]");
    if (b) changeQty(b.dataset.id, Number(b.dataset.d));
  });

  /* ---------- Drawer ---------- */
  var drawer = $("#drawer"), backdrop = $(".drawer-backdrop"), lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    fillPickupTimes();
    backdrop.hidden = false;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(function () { $(".drawer-close").focus(); }, 50);
    closeNav();
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $(".cart-open").addEventListener("click", openDrawer);
  $(".drawer-close").addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
  });

  /* ---------- Hours & status ---------- */
  function isOpenAt(date) {
    var h = HOURS[date.getDay()];
    var t = date.getHours() + date.getMinutes() / 60;
    return h.open !== null && t >= h.open && t < h.close;
  }

  function renderHours() {
    var today = new Date().getDay();
    // Start the table on Monday for readability
    var order = [1, 2, 3, 4, 5, 6, 0];
    $("#hours-body").innerHTML = order.map(function (d) {
      var h = HOURS[d];
      var txt = h.open === null ? "Closed" : fmtHour(h.open) + " – " + fmtHour(h.close);
      return '<tr class="' + (d === today ? "today" : "") + '"><th scope="row">' + h.day + "</th><td>" + txt + "</td></tr>";
    }).join("");

    var now = new Date(), dot = $("#status-dot"), label = $("#open-status");
    if (isOpenAt(now)) {
      dot.className = "status-dot open";
      label.textContent = "Open now · until " + fmtHour(HOURS[now.getDay()].close);
    } else {
      dot.className = "status-dot closed";
      // find next opening
      for (var i = 0; i < 8; i++) {
        var d = (now.getDay() + i) % 7, h = HOURS[d];
        if (h.open === null) continue;
        var t = now.getHours() + now.getMinutes() / 60;
        if (i === 0 && t >= h.open) continue;
        label.textContent = "Closed · opens " + (i === 0 ? "today" : i === 1 ? "tomorrow" : h.day) + " at " + fmtHour(h.open);
        break;
      }
    }
  }

  function fillPickupTimes() {
    var sel = $("#pickup-time");
    var now = new Date();
    var opts = [];
    var slot = new Date(now.getTime() + 15 * 60000);
    slot.setMinutes(Math.ceil(slot.getMinutes() / 15) * 15, 0, 0);
    // Look ahead up to 3 days for the next 12 open 15-minute slots
    for (var i = 0; i < 4 * 24 * 3 && opts.length < 12; i++) {
      var s = new Date(slot.getTime() + i * 15 * 60000);
      if (!isOpenAt(s)) continue;
      var time = s.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      var dayDiff = Math.round((new Date(s).setHours(0, 0, 0, 0) - new Date(now).setHours(0, 0, 0, 0)) / 86400000);
      var day = dayDiff === 0 ? "Today" : dayDiff === 1 ? "Tomorrow" : HOURS[s.getDay()].day;
      var label = day + " " + time;
      opts.push('<option value="' + label + '">' + (opts.length === 0 && dayDiff === 0 ? "ASAP · " : "") + label + "</option>");
    }
    sel.innerHTML = opts.length ? opts.join("") : '<option value="">No pickup slots available</option>';
    sel.disabled = !opts.length;
  }

  /* ---------- Forms ---------- */
  $("#checkout").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target, msg = $(".form-msg", form), name = form.elements.name;
    msg.style.color = "var(--red)";
    if (!Object.keys(cart).length) { msg.textContent = "Add at least one item first."; return; }
    if (!name.value.trim()) { name.setAttribute("aria-invalid", "true"); name.focus(); msg.textContent = "Please enter a name for pickup."; return; }
    name.removeAttribute("aria-invalid");
    if (!form.elements.time.value) { msg.textContent = "No pickup slots are available right now."; return; }
    var orderNo = Math.floor(1000 + Math.random() * 9000);
    msg.style.color = "var(--green)";
    msg.textContent = "Thanks " + name.value.trim() + "! Order #" + orderNo + " will be ready " + form.elements.time.value.replace(/^(Today|Tomorrow)/, function (d) { return d.toLowerCase(); }) + ". (Demo only, no payment taken.)";
    cart = {}; persist(); renderCart();
    form.reset();
  });

  $("#newsletter").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("#nl-email"), msg = $(".form-msg", e.target);
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    msg.textContent = ok ? "You're on the list. Check your inbox for a welcome treat." : "That email doesn't look right. Mind checking it?";
    if (ok) input.value = "";
  });

  /* ---------- Mobile nav ---------- */
  var toggle = $(".nav-toggle"), nav = $("#site-nav");
  function closeNav() { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); }
  toggle.addEventListener("click", function () {
    var open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  $$("#site-nav a").forEach(function (a) { a.addEventListener("click", closeNav); });

  /* ---------- Init ---------- */
  $("#year").textContent = new Date().getFullYear();
  renderMenu("all");
  renderCart();
  renderHours();
  setInterval(renderHours, 60000);
})();
