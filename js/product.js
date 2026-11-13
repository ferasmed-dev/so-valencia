/* So Valencia — product page */
(function () {
  'use strict';
  var data = window.SV;
  if (!data) return;

  var params = new URLSearchParams(window.location.search);
  var product = data.products.filter(function (p) { return p.id === params.get('p'); })[0] || data.products[0];
  var state = { style: product.styles[0], size: null, shake: 0 };

  function $(id) { return document.getElementById(id); }

  /* ---------- Text ---------- */
  document.title = product.name + ' tee — So Valencia';
  $('p-title').textContent = product.name;
  $('p-desc').textContent = product.desc;
  $('p-price').textContent = product.price || data.price;
  $('crumb-name').textContent = product.name;
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', product.desc);
  if (product.story) {
    $('story-block').classList.remove('hidden');
    $('story-q').textContent = product.story[0];
    $('story-a').textContent = product.story[1];
  } else {
    $('story-block').classList.add('hidden');
  }

  /* ---------- Main photo ---------- */
  var photo = $('main-photo');
  function showStyle(st) {
    state.style = st;
    if (photo.getAttribute('src') !== st.img) {
      photo.classList.remove('sv-fade');
      void photo.offsetWidth; // restart the fade
      photo.classList.add('sv-fade');
      photo.src = st.img;
    }
    photo.alt = product.name + ' tee, ' + st.label.toLowerCase() + ' style on a ' + st.shirtLabel.toLowerCase() + ' shirt';
    $('style-name').textContent = st.label + ' · ' + st.shirtLabel + ' tee';
  }

  /* ---------- Style picker ---------- */
  var box = $('styles');
  box.innerHTML = '';
  product.styles.forEach(function (st, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'style-btn';
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    var img = document.createElement('img');
    img.src = st.img; img.alt = ''; img.width = 896; img.height = 1120; img.loading = 'lazy';
    var n = document.createElement('span'); n.className = 'style-name'; n.textContent = st.label;
    var c = document.createElement('span'); c.className = 'style-shirt'; c.textContent = st.shirtLabel + ' tee';
    b.appendChild(img); b.appendChild(n); b.appendChild(c);
    b.addEventListener('click', function () {
      Array.prototype.forEach.call(box.children, function (el) { el.setAttribute('aria-pressed', el === b ? 'true' : 'false'); });
      showStyle(st);
    });
    box.appendChild(b);
  });
  showStyle(product.styles[0]);

  /* ---------- Sizes ---------- */
  var sizeBtns = document.querySelectorAll('.size-btn');
  Array.prototype.forEach.call(sizeBtns, function (b) {
    b.addEventListener('click', function () {
      state.size = b.getAttribute('data-size');
      Array.prototype.forEach.call(sizeBtns, function (el) { el.setAttribute('aria-pressed', el === b ? 'true' : 'false'); });
      $('size-name').textContent = state.size;
      $('size-err').classList.add('hidden');
    });
  });

  /* ---------- Add to bag / Buy now ---------- */
  var addBtn = $('add-btn');
  if (product.paymentLink) addBtn.textContent = 'Buy now';
  addBtn.addEventListener('click', function () {
    if (!state.size) {
      var block = $('size-block');
      $('size-err').classList.remove('hidden');
      state.shake += 1;
      block.classList.remove('sv-shakeA', 'sv-shakeB');
      block.classList.add(state.shake % 2 ? 'sv-shakeA' : 'sv-shakeB');
      return;
    }
    if (product.paymentLink) {
      var ref = (product.id + '_' + state.style.id + '_' + state.style.shirt + '_' + state.size).replace(/[^A-Za-z0-9_-]/g, '');
      var sep = product.paymentLink.indexOf('?') === -1 ? '?' : '&';
      window.location.href = product.paymentLink + sep + 'client_reference_id=' + encodeURIComponent(ref);
      return;
    }
    window.SVShop.addToBag({ id: product.id, style: state.style.id, size: state.size });
    window.SVShop.toast('Added to bag: ' + product.name + ', ' + state.style.label.toLowerCase() + ', ' + state.size);
  });

  /* ---------- Related ---------- */
  var related = $('related');
  data.products.filter(function (p) { return p.id !== product.id; }).slice(0, 4).forEach(function (p) {
    var st = p.styles[0];
    var a = document.createElement('a');
    a.href = 'product.html?p=' + encodeURIComponent(p.id);
    a.className = 'sv-card';
    a.setAttribute('style', 'display:flex;flex-direction:column;gap:10px;padding:10px;background:#FFFFFF;border:1px solid #E5DCC8;border-radius:4px;text-decoration:none;color:#0F1B33');
    var img = document.createElement('img');
    img.src = st.img; img.alt = p.name + ' tee'; img.loading = 'lazy'; img.width = 896; img.height = 1120;
    img.setAttribute('style', 'display:block;width:100%;height:auto;aspect-ratio:4 / 5;object-fit:cover;border-radius:2px');
    var name = document.createElement('p'); name.className = 'serif'; name.setAttribute('style', 'margin:0;font-size:18px;line-height:1.25'); name.textContent = p.name;
    var price = document.createElement('p'); price.setAttribute('style', 'margin:0;font-weight:600'); price.textContent = p.price || data.price;
    a.appendChild(img); a.appendChild(name); a.appendChild(price);
    related.appendChild(a);
  });
})();
