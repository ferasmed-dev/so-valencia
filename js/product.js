/* So Valencia — product page */
(function () {
  'use strict';
  var data = window.SV;
  if (!data) return;

  var params = new URLSearchParams(window.location.search);
  var product = data.products.filter(function (p) { return p.id === params.get('p'); })[0] || data.products[0];
  var isHoodie = product.kind === 'hoodie';
  var state = { color: product.colors[0], size: null, view: 'front', shake: 0 };

  function $(id) { return document.getElementById(id); }
  function color() { return data.colors[state.color]; }

  /* ---------- Text ---------- */
  var kindLabel = isHoodie ? 'Hoodie' : 'Tee';
  document.title = product.name + ' ' + kindLabel.toLowerCase() + ' — So Valencia';
  $('p-title').textContent = product.name;
  $('p-kind').textContent = kindLabel.toUpperCase() + ' · UNISEX';
  $('p-desc').textContent = product.desc;
  $('crumb-name').textContent = product.name;
  $('crumb-kind').textContent = isHoodie ? 'Hoodies' : 'Tees';
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', product.desc);
  Array.prototype.forEach.call(document.querySelectorAll('.line1'), function (el) { el.textContent = product.line1; });
  Array.prototype.forEach.call(document.querySelectorAll('.line2'), function (el) { el.textContent = product.line2; });
  if (product.story) {
    $('story-q').textContent = product.story[0];
    $('story-a').textContent = product.story[1];
  } else {
    $('story-block').classList.add('hidden');
  }

  /* ---------- Garment shape ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  function garmentSvg(kind, fill, label) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', kind === 'hoodie' ? '0 0 300 330' : '0 0 300 320');
    svg.setAttribute('style', 'position:absolute;inset:0;width:100%;height:100%');
    if (label) { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', label); }
    else { svg.setAttribute('aria-hidden', 'true'); }
    function path(d, attrs) {
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      Object.keys(attrs).forEach(function (k) { p.setAttribute(k, attrs[k]); });
      svg.appendChild(p);
      return p;
    }
    if (kind === 'hoodie') {
      path(data.paths.hoodie, { 'class': 'g-fill', fill: fill });
      path('M118 44 C122 22 178 22 182 44 C172 62 128 62 118 44 Z', { fill: '#000000', 'fill-opacity': '0.35' });
      path('M138 58 L136 108 M162 58 L164 108', { stroke: '#FBF8F2', 'stroke-opacity': '0.7', 'stroke-width': '3', 'stroke-linecap': 'round' });
      path('M96 236 L204 236 L222 300 L78 300 Z', { fill: 'none', stroke: '#FFFFFF', 'stroke-opacity': '0.14', 'stroke-width': '3' });
    } else {
      path(data.paths.tee, { 'class': 'g-fill', fill: fill, stroke: '#0F1B33', 'stroke-opacity': '0.12', 'stroke-width': '2', style: 'transition:fill .3s ease' });
      path(data.paths.teeCollar, { fill: 'none', stroke: '#0F1B33', 'stroke-opacity': '0.15', 'stroke-width': '5' });
    }
    return svg;
  }

  var front = $('view-front');
  if (isHoodie) {
    front.style.aspectRatio = '300 / 330';
    var print = front.querySelector('.print');
    print.style.left = '30%'; print.style.width = '40%'; print.style.top = '37%';
  }
  function renderGarment() {
    var c = color();
    var holder = $('garment-front');
    holder.innerHTML = '';
    holder.appendChild(garmentSvg(product.kind, c.hex, c.label + ' ' + kindLabel.toLowerCase() + ' printed with ' + product.line1 + ' ' + product.line2));
    Array.prototype.forEach.call(document.querySelectorAll('#view-back .g-fill'), function (el) { el.setAttribute('fill', c.hex); });
    $('view-detail').style.background = c.hex;
    $('view-detail').style.color = c.ink;
    front.querySelector('.print').style.color = c.ink;
    $('color-name').textContent = c.label;
  }

  /* ---------- Colour swatches ---------- */
  var swatchBox = $('swatches');
  swatchBox.innerHTML = '';
  product.colors.forEach(function (id) {
    var c = data.colors[id];
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch';
    b.setAttribute('aria-label', c.label);
    b.setAttribute('aria-pressed', id === state.color ? 'true' : 'false');
    b.style.background = c.hex;
    b.addEventListener('click', function () {
      state.color = id;
      Array.prototype.forEach.call(swatchBox.children, function (el) { el.setAttribute('aria-pressed', el === b ? 'true' : 'false'); });
      renderGarment();
    });
    swatchBox.appendChild(b);
  });

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

  /* ---------- Views ---------- */
  var viewBtns = document.querySelectorAll('.view-btn');
  Array.prototype.forEach.call(viewBtns, function (b) {
    b.addEventListener('click', function () {
      state.view = b.getAttribute('data-view');
      ['front', 'back', 'detail'].forEach(function (v) { $('view-' + v).classList.toggle('hidden', v !== state.view); });
      Array.prototype.forEach.call(viewBtns, function (el) { el.setAttribute('aria-pressed', el === b ? 'true' : 'false'); });
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
    var c = color();
    if (product.paymentLink) {
      var ref = (product.id + '_' + state.color + '_' + state.size).replace(/[^A-Za-z0-9_-]/g, '');
      var sep = product.paymentLink.indexOf('?') === -1 ? '?' : '&';
      window.location.href = product.paymentLink + sep + 'client_reference_id=' + encodeURIComponent(ref);
      return;
    }
    window.SVShop.addToBag({ id: product.id, color: state.color, size: state.size });
    window.SVShop.toast('Added to bag: ' + product.name + ', ' + c.label + ', ' + state.size);
  });

  /* ---------- Related ---------- */
  var related = $('related');
  data.products.filter(function (p) { return p.id !== product.id; }).slice(0, 3).forEach(function (p) {
    var c = data.colors[p.colors[0]];
    var a = document.createElement('a');
    a.href = 'product.html?p=' + encodeURIComponent(p.id);
    a.className = 'sv-card';
    a.setAttribute('style', 'display:flex;flex-direction:column;gap:12px;padding:16px;background:#FFFFFF;border:1px solid #E5DCC8;border-radius:4px;text-decoration:none;color:#0F1B33');
    var box = document.createElement('div');
    box.setAttribute('style', 'aspect-ratio:4 / 3;border-radius:2px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:16px;border:1px solid #E5DCC8');
    box.style.background = c.hex; box.style.color = c.ink;
    var l1 = document.createElement('p'); l1.className = 'serif'; l1.setAttribute('style', 'margin:0;font-style:italic;font-size:18px'); l1.textContent = p.line1;
    var l2 = document.createElement('p'); l2.className = 'serif'; l2.setAttribute('style', 'margin:0;font-size:24px'); l2.textContent = p.line2;
    box.appendChild(l1); box.appendChild(l2);
    var name = document.createElement('p'); name.className = 'serif'; name.setAttribute('style', 'margin:0;font-size:19px'); name.textContent = p.name;
    var price = document.createElement('p'); price.setAttribute('style', 'margin:0;font-weight:600'); price.textContent = data.price;
    a.appendChild(box); a.appendChild(name); a.appendChild(price);
    related.appendChild(a);
  });

  renderGarment();
})();
