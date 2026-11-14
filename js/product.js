/* So Valencia — product page */
(function () {
  'use strict';
  var data = window.SV;
  if (!data) return;

  var params = new URLSearchParams(window.location.search);
  var product = data.products.filter(function (p) { return p.id === params.get('p'); })[0] || data.products[0];
  var shop = window.SVShop;
  var state = { fit: shop.getFit(), style: null, size: null, shake: 0 };

  function $(id) { return document.getElementById(id); }
  function F() { return product.fits[state.fit]; }
  function noun() { return state.fit === 'women' ? 'crop top' : 'tee'; }

  /* ---------- Fixed text ---------- */
  $('p-title').textContent = product.name;
  $('p-desc').textContent = product.desc;
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
    photo.alt = product.name + ' ' + noun() + ', ' + st.label.toLowerCase() + ' style in ' + st.shirtLabel.toLowerCase();
    $('style-name').textContent = st.label + ' · ' + st.shirtLabel + ' ' + noun();
  }

  /* ---------- Style picker ---------- */
  var box = $('styles');
  function renderStyles(keepId) {
    var list = F().styles;
    var chosen = list.filter(function (st) { return st.id === keepId; })[0] || list[0];
    box.innerHTML = '';
    list.forEach(function (st) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'style-btn';
      b.setAttribute('aria-pressed', st === chosen ? 'true' : 'false');
      var img = document.createElement('img');
      img.src = st.img; img.alt = ''; img.width = 896; img.height = 1120; img.loading = 'lazy';
      var n = document.createElement('span'); n.className = 'style-name'; n.textContent = st.label;
      var c = document.createElement('span'); c.className = 'style-shirt'; c.textContent = st.shirtLabel + ' ' + noun();
      b.appendChild(img); b.appendChild(n); b.appendChild(c);
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(box.children, function (el) { el.setAttribute('aria-pressed', el === b ? 'true' : 'false'); });
        showStyle(st);
      });
      box.appendChild(b);
    });
    showStyle(chosen);
  }

  /* ---------- Sizes ---------- */
  var sizeBox = $('sizes');
  function renderSizes() {
    var sizes = F().sizes;
    if (sizes.indexOf(state.size) === -1) state.size = null;
    sizeBox.innerHTML = '';
    sizeBox.style.gridTemplateColumns = 'repeat(' + sizes.length + ',minmax(0,1fr))';
    sizes.forEach(function (z) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'size-btn';
      b.textContent = z;
      b.setAttribute('aria-pressed', z === state.size ? 'true' : 'false');
      b.addEventListener('click', function () {
        state.size = z;
        Array.prototype.forEach.call(sizeBox.children, function (el) { el.setAttribute('aria-pressed', el === b ? 'true' : 'false'); });
        $('size-name').textContent = z;
        $('size-err').classList.add('hidden');
      });
      sizeBox.appendChild(b);
    });
    $('size-name').textContent = state.size || 'choose one';
  }

  /* ---------- Render one fit ---------- */
  var addBtn = $('add-btn');
  function render() {
    var f = F();
    document.title = product.name + ' ' + noun() + ' — So Valencia';
    $('p-kicker').textContent = f.kicker;
    $('p-price').textContent = f.price || data.price;
    $('fit-note').textContent = f.fitNote;
    addBtn.textContent = f.paymentLink ? 'Buy now' : 'Add to bag';
    renderStyles(state.style && state.style.id);
    renderSizes();
    renderRelated();
  }

  document.addEventListener('sv:fit', function (ev) {
    state.fit = ev.detail === 'women' ? 'women' : 'men';
    try {
      var u = new URL(window.location.href);
      if (state.fit === 'women') u.searchParams.set('fit', 'women'); else u.searchParams.delete('fit');
      history.replaceState(null, '', u.toString());
    } catch (err) { /* old browser: URL stays as is */ }
    render();
  });

  /* ---------- Add to bag / Buy now ---------- */
  addBtn.addEventListener('click', function () {
    if (!state.size) {
      var block = $('size-block');
      $('size-err').classList.remove('hidden');
      state.shake += 1;
      block.classList.remove('sv-shakeA', 'sv-shakeB');
      block.classList.add(state.shake % 2 ? 'sv-shakeA' : 'sv-shakeB');
      return;
    }
    var f = F();
    if (f.paymentLink) {
      var ref = (product.id + '_' + state.fit + '_' + state.style.id + '_' + state.style.shirt + '_' + state.size).replace(/[^A-Za-z0-9_-]/g, '');
      var sep = f.paymentLink.indexOf('?') === -1 ? '?' : '&';
      window.location.href = f.paymentLink + sep + 'client_reference_id=' + encodeURIComponent(ref);
      return;
    }
    shop.addToBag({ id: product.id, fit: state.fit, style: state.style.id, size: state.size });
    shop.toast('Added to bag: ' + product.name + ' ' + noun() + ', ' + state.style.label.toLowerCase() + ', ' + state.size);
  });

  /* ---------- Related ---------- */
  var related = $('related');
  function renderRelated() {
    related.innerHTML = '';
    data.products.filter(function (p) { return p.id !== product.id; }).slice(0, 4).forEach(function (p) {
      var f = p.fits[state.fit];
      var st = f.styles[0];
      var a = document.createElement('a');
      a.href = 'product.html?p=' + encodeURIComponent(p.id) + (state.fit === 'women' ? '&fit=women' : '');
      a.className = 'sv-card';
      a.setAttribute('style', 'display:flex;flex-direction:column;gap:10px;padding:10px;background:#FFFFFF;border:1px solid #E5DCC8;border-radius:4px;text-decoration:none;color:#0F1B33');
      var img = document.createElement('img');
      img.src = st.img; img.alt = p.name + ' ' + noun(); img.loading = 'lazy'; img.width = 896; img.height = 1120;
      img.setAttribute('style', 'display:block;width:100%;height:auto;aspect-ratio:4 / 5;object-fit:cover;border-radius:2px');
      var name = document.createElement('p'); name.className = 'serif'; name.setAttribute('style', 'margin:0;font-size:18px;line-height:1.25'); name.textContent = p.name;
      var price = document.createElement('p'); price.setAttribute('style', 'margin:0;font-weight:600'); price.textContent = f.price || data.price;
      a.appendChild(img); a.appendChild(name); a.appendChild(price);
      related.appendChild(a);
    });
  }

  render();
})();
