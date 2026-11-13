/* So Valencia — shared behaviour (menu, bag, toast, newsletter) */
(function () {
  'use strict';

  /* ---------- Storage (safe) ---------- */
  var BAG_KEY = 'sv-bag';
  function readBag() {
    try { return JSON.parse(localStorage.getItem(BAG_KEY)) || []; } catch (err) { return []; }
  }
  function writeBag(items) {
    try { localStorage.setItem(BAG_KEY, JSON.stringify(items)); } catch (err) { /* private mode: keep in memory */ }
  }

  /* ---------- Toast ---------- */
  var toast = document.querySelector('.toast');
  var toastTimer;
  function showToast(text) {
    if (!toast) return;
    toast.querySelector('.toast-text').textContent = text;
    toast.hidden = false;
    toast.classList.remove('show');
    void toast.offsetWidth; // restart the fade
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 2800);
  }

  /* ---------- Bag button ---------- */
  var bagBtn = document.querySelector('.bag-btn');
  var bump = 0;
  var memoryBag = readBag();
  function renderBag(animate) {
    var n = memoryBag.length;
    if (!bagBtn) return;
    bagBtn.querySelector('.bag-count').textContent = n;
    bagBtn.setAttribute('aria-label', 'Bag, ' + n + (n === 1 ? ' item' : ' items'));
    bagBtn.classList.toggle('has-items', n > 0);
    if (animate) {
      bump += 1;
      bagBtn.classList.remove('sv-bumpA', 'sv-bumpB');
      bagBtn.classList.add(bump % 2 ? 'sv-bumpA' : 'sv-bumpB');
    }
  }
  renderBag(false);
  if (bagBtn) {
    bagBtn.addEventListener('click', function () {
      var n = memoryBag.length;
      showToast(n ? n + (n === 1 ? ' item' : ' items') + ' in your bag. Checkout opens very soon.' : 'Your bag is empty. Time to pick a quote.');
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (ev) {
      if (ev.target.tagName === 'A') {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  /* ---------- Newsletter (Formspree) ---------- */
  var form = document.getElementById('signup');
  var msg = document.getElementById('signup-msg');
  if (form && msg) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (form.action.indexOf('FORMSPREE_ID') !== -1) {
        msg.textContent = 'Our list opens in a few days. Please check back soon!';
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          msg.textContent = "You're on the list. See you at the next drop!";
        })
        .catch(function () {
          msg.textContent = 'Something went wrong. Please try again in a moment.';
        })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---------- Product cards: cycle through every style on hover, 0.5 s apart ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.card-photo'), function (card) {
    var imgs = card.querySelectorAll('.photo-swap img.cyc');
    if (imgs.length < 2) return;
    var i = 0, timer = null;
    function show(n) {
      imgs[i].classList.remove('on');
      i = n % imgs.length;
      imgs[i].classList.add('on');
    }
    function start() {
      if (timer) return;
      show(i + 1);
      timer = setInterval(function () { show(i + 1); }, 500);
    }
    function stop() {
      clearInterval(timer); timer = null;
      show(0);
    }
    card.addEventListener('mouseenter', start);
    card.addEventListener('mouseleave', stop);
    card.addEventListener('focus', start);
    card.addEventListener('blur', stop);
    card._svStart = start;
    card._svStop = stop;
  });

  /* ---------- Touch screens (no hover): cycle while the card is on screen ---------- */
  var noHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
  if (noHover && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var card = en.target;
        if (!card._svStart) return;
        if (en.isIntersecting) card._svStart(); else card._svStop();
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(document.querySelectorAll('.card-photo'), function (card) { io.observe(card); });
  }

  /* ---------- Expose for the product page ---------- */
  window.SVShop = {
    addToBag: function (item) {
      memoryBag.push(item);
      writeBag(memoryBag);
      renderBag(true);
    },
    toast: showToast
  };
})();
