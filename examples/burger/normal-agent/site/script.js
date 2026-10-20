(function () {
  "use strict";

  /* ---------- Menu data ---------- */
  var MENU = [
    { id: "classic", cat: "burgers", emoji: "🍔", name: "The Classic", price: 9.5,
      desc: "Single smashed patty, American cheese, pickles, onion, Ember sauce.", tags: ["Bestseller"] },
    { id: "double", cat: "burgers", emoji: "🔥", name: "Double Ember", price: 12.5,
      desc: "Two lacy-edged patties, double cheese, caramelized onions, Ember sauce.", tags: ["Signature"] },
    { id: "jalapeno", cat: "burgers", emoji: "🌶️", name: "Hellfire", price: 13,
      desc: "Double patty, pepper jack, charred jalapeños, chipotle mayo, crispy shallots.", tags: ["Spicy"] },
    { id: "bacon", cat: "burgers", emoji: "🥓", name: "Smokehouse", price: 14,
      desc: "Double patty, aged cheddar, thick-cut bacon, bourbon BBQ, onion ring.", tags: [] },
    { id: "mushroom", cat: "burgers", emoji: "🍄", name: "Shroom Smash", price: 11.5,
      desc: "Crispy smashed portobello patty, Swiss, garlic aioli, arugula.", tags: ["Vegetarian"] },
    { id: "chicken", cat: "burgers", emoji: "🍗", name: "Hot Cluck", price: 12,
      desc: "Buttermilk fried thigh, hot honey, slaw, pickles on a potato bun.", tags: ["Spicy"] },
    { id: "fries", cat: "sides", emoji: "🍟", name: "Hand-Cut Fries", price: 4.5,
      desc: "Double-fried, sea salt, with Ember sauce for dipping.", tags: ["Vegetarian"] },
    { id: "loaded", cat: "sides", emoji: "🧀", name: "Loaded Fries", price: 7.5,
      desc: "Fries, cheese sauce, bacon bits, scallions, pickled jalapeños.", tags: [] },
    { id: "rings", cat: "sides", emoji: "🧅", name: "Beer-Batter Rings", price: 5.5,
      desc: "Thick-cut sweet onion, crispy lager batter, smoked ketchup.", tags: ["Vegetarian"] },
    { id: "vanilla", cat: "shakes", emoji: "🥤", name: "Brown-Butter Shake", price: 6.5,
      desc: "Vanilla custard, brown butter, flaky salt. Our cult favorite.", tags: ["Signature"] },
    { id: "choc", cat: "shakes", emoji: "🍫", name: "Midnight Chocolate", price: 6.5,
      desc: "Dark chocolate custard, malt, cocoa nibs.", tags: [] },
    { id: "lemonade", cat: "shakes", emoji: "🍋", name: "House Lemonade", price: 3.5,
      desc: "Fresh-squeezed, lightly sweet. Free refills when dining in.", tags: [] }
  ];
  var EXTRAS = { combo: { id: "combo", name: "Ember Combo", price: 14 } };

  var money = function (n) { return "$" + n.toFixed(2); };
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ---------- Storage (optional) ---------- */
  var STORE_KEY = "emberbun-cart";
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveCart() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) { /* ignore */ }
  }
  var cart = loadCart(); // { id: qty }

  function findItem(id) {
    return MENU.filter(function (m) { return m.id === id; })[0] || EXTRAS[id];
  }

  /* ---------- Render menu ---------- */
  var grid = $("#menu-grid");
  function tagClass(t) {
    if (t === "Spicy") return "tag hot";
    if (t === "Vegetarian") return "tag veg";
    return "tag";
  }
  function renderMenu(filter) {
    var items = MENU.filter(function (m) { return filter === "all" || m.cat === filter; });
    grid.innerHTML = items.map(function (m, i) {
      return '<article class="item" style="animation-delay:' + (i * 40) + 'ms">' +
        '<div class="item-emoji" aria-hidden="true">' + m.emoji + "</div>" +
        '<div class="item-top"><h3>' + m.name + '</h3><span class="price">' + money(m.price) + "</span></div>" +
        (m.tags.length ? '<div class="tags">' + m.tags.map(function (t) { return '<span class="' + tagClass(t) + '">' + t + "</span>"; }).join("") + "</div>" : "") +
        "<p>" + m.desc + "</p>" +
        '<button class="add-btn" type="button" data-add="' + m.id + '" aria-label="Add ' + m.name + ' to order">+ Add to order</button>' +
        "</article>";
    }).join("");
  }
  renderMenu("all");

  $$(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      $$(".tab").forEach(function (t) { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      renderMenu(tab.dataset.filter);
    });
  });

  /* ---------- Cart ---------- */
  var countEl = $(".cart-count");
  var listEl = $(".cart-list");
  var emptyEl = $(".cart-empty");
  var totalEl = $("#cart-total");
  var checkoutBtn = $("#checkout");

  function renderCart() {
    var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0 && findItem(id); });
    var count = 0, total = 0;
    listEl.innerHTML = ids.map(function (id) {
      var it = findItem(id), q = cart[id];
      count += q; total += it.price * q;
      return "<li>" +
        '<span class="name">' + it.name + "</span>" +
        '<span class="line-price">' + money(it.price * q) + "</span>" +
        '<span class="qty"><button type="button" data-dec="' + id + '" aria-label="Remove one ' + it.name + '">&minus;</button>' +
        "<span>" + q + "</span>" +
        '<button type="button" data-inc="' + id + '" aria-label="Add one ' + it.name + '">+</button></span>' +
        "</li>";
    }).join("");
    countEl.textContent = count;
    totalEl.textContent = money(total);
    emptyEl.hidden = ids.length > 0;
    checkoutBtn.disabled = ids.length === 0;
    saveCart();
  }

  function add(id) {
    cart[id] = (cart[id] || 0) + 1;
    renderCart();
    countEl.classList.remove("bump");
    void countEl.offsetWidth;
    countEl.classList.add("bump");
    toast(findItem(id).name + " added to your order");
  }

  document.addEventListener("click", function (e) {
    var addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      add(addBtn.dataset.add);
      if (addBtn.classList.contains("add-btn")) {
        addBtn.classList.add("added");
        addBtn.textContent = "✓ Added";
        setTimeout(function () { addBtn.classList.remove("added"); addBtn.textContent = "+ Add to order"; }, 1200);
      }
      return;
    }
    var inc = e.target.closest("[data-inc]");
    if (inc) { cart[inc.dataset.inc]++; renderCart(); return; }
    var dec = e.target.closest("[data-dec]");
    if (dec) {
      var id = dec.dataset.dec;
      cart[id]--;
      if (cart[id] <= 0) delete cart[id];
      renderCart();
    }
  });

  /* ---------- Drawer ---------- */
  var drawer = $(".drawer");
  var backdrop = $(".drawer-backdrop");
  var lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    backdrop.hidden = false;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    drawer.focus();
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $(".cart-btn").addEventListener("click", function () { closeNav(); openDrawer(); });
  $(".drawer-close").addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
  });

  checkoutBtn.addEventListener("click", function () {
    var orderNo = Math.floor(100 + Math.random() * 900);
    cart = {};
    renderCart();
    closeDrawer();
    toast("Order #" + orderNo + " received! Ready for pickup in about 12 minutes.", 4000);
  });

  /* ---------- Toast ---------- */
  var toastEl = $(".toast"), toastTimer;
  function toast(msg, ms) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, ms || 2200);
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = $(".nav-toggle"), nav = $("#site-nav");
  function closeNav() {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  $$("#site-nav a").forEach(function (a) { a.addEventListener("click", closeNav); });

  /* ---------- Header shadow on scroll ---------- */
  var header = $(".site-header");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Opening hours / open now ---------- */
  var HOURS = { 0: [12, 21], 1: [11, 22], 2: [11, 22], 3: [11, 22], 4: [11, 22], 5: [11, 24], 6: [11, 24] };
  (function () {
    var now = new Date(), day = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
    var row = $('.hours tr[data-day="' + day + '"]');
    if (row) row.classList.add("today");
    var range = HOURS[day], status = $("#open-status");
    if (h >= range[0] && h < range[1]) {
      var closes = range[1] === 24 ? "midnight" : range[1] + ":00";
      status.textContent = "Open now · closes " + closes;
    } else {
      status.textContent = "Closed now · opens " + (h < range[0] ? "today" : "tomorrow") + " at " + HOURS[h < range[0] ? day : (day + 1) % 7][0] + ":00";
      status.classList.add("closed");
    }
  })();

  /* ---------- Reservation form ---------- */
  var form = $("#reserve-form");
  var dateInput = form.elements.date;
  var today = new Date();
  var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = iso;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $(".form-msg", form);
    var bad = [];
    ["name", "date", "time", "size"].forEach(function (n) {
      var el = form.elements[n];
      var ok = el.value.trim() !== "" && el.checkValidity();
      el.classList.toggle("invalid", !ok);
      if (!ok) bad.push(el);
    });
    if (bad.length) {
      msg.className = "form-msg err";
      msg.textContent = "Please fill in all fields (we seat from 11:00 to 22:00).";
      bad[0].focus();
      return;
    }
    var d = new Date(dateInput.value + "T00:00");
    var pretty = d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
    msg.className = "form-msg ok";
    msg.textContent = "Thanks, " + form.elements.name.value.trim().split(" ")[0] + "! Table for " + form.elements.size.value + " requested on " + pretty + " at " + form.elements.time.value + ". We'll confirm by phone.";
    form.reset();
    dateInput.min = iso;
  });
  $$("input, select", form).forEach(function (el) {
    el.addEventListener("input", function () { el.classList.remove("invalid"); });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$(".section-head, .story-copy, .story-art, .review, .visit-info, .reserve");
  if ("IntersectionObserver" in window) {
    revealEls.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  $("#year").textContent = new Date().getFullYear();
  renderCart();
})();
