/* ═══════════════════════════════════════
   SHAHENDA STORE — store.js
   Handles: products display, drawer, cart, orders
═══════════════════════════════════════ */
const SB_URL = 'https://hxjvrsqywrnqkmanmifj.supabase.co';
const SB_KEY = 'sb_publishable_fiU1vnioMqPRF1yRTBdBmg_etysUeLc';
const sb = typeof supabase !== 'undefined' ? supabase.createClient(SB_URL, SB_KEY) : null;

const WA_NUMBER = '201131356642';

/* ── State ── */
let allProducts = [];
let activeFilter = 'all';
let cart = [];
let currentProduct = null;
let currentSize = null;
let currentQty = 1;
let promoDiscount = 0;
let promoCode = '';
let allPromos = [];

/* ── Toast ── */
function toast(msg, type='', dur=3200) {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast' + (type ? ' '+type : '');
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('hiding'); t.addEventListener('animationend', ()=>t.remove(),{once:true}); }, dur);
}

/* ── Format ── */
const EGP = v => `${Number(v).toLocaleString('ar-EG')} جنيه`;

/* ══════════════════════════
   LOAD & RENDER OFFERS
══════════════════════════ */
function loadOffers() {
  const saved = localStorage.getItem('shahenda_offers');
  let offers = [];
  try { offers = saved ? JSON.parse(saved) : []; } catch(e) {}
  const activeOffers = offers.filter(o => o.active);
  const section = document.getElementById('offersSection');
  const grid    = document.getElementById('offersGrid');

  if (!activeOffers.length) { section.style.display = 'none'; return; }

  section.style.display = 'block';
  grid.innerHTML = activeOffers.map(o => {
    const saving = o.oldPrice ? o.oldPrice - o.price : 0;
    return `
      <div class="offer-card" onclick="orderOffer(${JSON.stringify(o).replace(/"/g,'&quot;')})">
        <span class="offer-badge-tag">🔥 عرض خاص</span>
        <h3>${o.name}</h3>
        <p>${o.desc || ''}</p>
        <div class="offer-prices">
          <span class="offer-price-new">${EGP(o.price)}</span>
          ${o.oldPrice ? `<span class="offer-price-old">${EGP(o.oldPrice)}</span>` : ''}
          ${saving > 0 ? `<span class="offer-saving">وفّر ${EGP(saving)}</span>` : ''}
        </div>
        <button class="offer-btn">اطلب العرض دلوقتي</button>
      </div>`;
  }).join('');
}

window.orderOffer = function(offer) {
  // Open WhatsApp directly for offers
  const msg = encodeURIComponent(
    `🎁 طلب عرض خاص - Shahenda Store\n\n` +
    `العرض: ${offer.name}\n` +
    `السعر: ${offer.price} جنيه\n` +
    `${offer.desc ? `التفاصيل: ${offer.desc}\n` : ''}` +
    `💵 الدفع: كاش عند الاستلام\n\n` +
    `من فضلك أرسل:\n- اسمك\n- رقم هاتفك\n- عنوانك`
  );
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
};

/* ══════════════════════════
   LOAD PRODUCTS
══════════════════════════ */
async function loadProducts() {
  if (!sb) { renderFallback(); return; }
  try {
    const { data, error } = await sb.from('products').select('*').eq('active', true).order('id');
    if (error) throw error;
    allProducts = data || [];
    renderProducts();
  } catch(e) {
    console.error(e);
    document.getElementById('productsGrid').innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-3)">
        <div style="font-size:2rem;margin-bottom:8px">❌</div>
        تعذر تحميل المنتجات. تأكد من إعداد Supabase.
      </div>`;
  }
}

async function loadPromos() {
  if (!sb) return;
  try {
    const { data } = await sb.from('promo_codes').select('*').eq('active', true);
    allPromos = data || [];
  } catch(e) {}
}

function renderFallback() {
  document.getElementById('productsGrid').innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:64px;color:var(--text-3)">
      <div style="font-size:2.5rem;margin-bottom:12px">⚙️</div>
      <h3 style="color:var(--text-2);margin-bottom:8px">ابدأ بإعداد Supabase</h3>
      <p style="font-size:.9rem">اتبع ملف supabase-setup.sql لإنشاء الجداول، ثم أضف منتجاتك من لوحة التحكم.</p>
    </div>`;
}

/* ══════════════════════════
   RENDER PRODUCTS
══════════════════════════ */
function getFiltered() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  return allProducts.filter(p => {
    const mc = activeFilter === 'all' || p.category === activeFilter;
    const ms = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    return mc && ms;
  });
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const list = getFiltered();

  if (!list.length) {
    grid.innerHTML = `<div class="no-products"><div class="np-icon">🔍</div><h3>لا توجد منتجات</h3><p>جرب بحثاً مختلفاً</p></div>`;
    return;
  }

  const catLabel = { 'Men / Unisex':'رجالي', 'Women':'نسائي', 'Musk / Oud / Special':'مسك/عود' };
  grid.innerHTML = list.map(p => {
    const sizes = Array.isArray(p.sizes) ? p.sizes : JSON.parse(p.sizes || '[]');
    const minPrice = sizes.length ? Math.min(...sizes.map(s => s.price)) : 0;
    const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');
    const sizeLabels = sizes.slice(0,4).map(s => `<span class="size-tag">${s.ml}ml</span>`).join('');
    return `
      <div class="product-card" onclick="openProduct(${p.id})">
        <div class="card-img">
          ${p.image_url
            ? `<img src="${p.image_url}" alt="${p.name}" loading="lazy"/>`
            : `<div class="card-img-placeholder"><span style="font-size:3rem">🧴</span><span style="font-size:.78rem;color:var(--text-3)">${p.brand}</span></div>`
          }
          ${p.discount > 0 ? `<span class="card-discount">${p.discount}% خصم</span>` : ''}
          <span class="card-cat">${catLabel[p.category] || p.category}</span>
        </div>
        <div class="card-body">
          <div class="card-brand">${p.brand}</div>
          <div class="card-name">${p.name}</div>
          ${p.description ? `<div class="card-desc">${p.description}</div>` : ''}
          <div class="card-rating">${stars}<span>${p.rating}</span></div>
          <div class="card-sizes">${sizeLabels}${sizes.length > 4 ? `<span class="size-tag">+${sizes.length-4}</span>` : ''}</div>
          <div class="card-price-row">
            <div>
              <div class="card-price-from">يبدأ من</div>
              <div class="card-price">${EGP(minPrice)}</div>
            </div>
            <button class="card-btn" onclick="event.stopPropagation();openProduct(${p.id})">اطلب الآن</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ══════════════════════════
   FILTERS & SEARCH
══════════════════════════ */
document.getElementById('filterRow').addEventListener('click', e => {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  activeFilter = chip.dataset.cat;
  renderProducts();
});
document.getElementById('searchInput').addEventListener('input', renderProducts);

/* ══════════════════════════
   PRODUCT DRAWER
══════════════════════════ */
function openProduct(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  currentProduct = p;
  currentSize = null;
  currentQty = 1;
  promoDiscount = 0;
  promoCode = '';

  const sizes = Array.isArray(p.sizes) ? p.sizes : JSON.parse(p.sizes || '[]');

  document.getElementById('drawerBrand').textContent = p.brand;
  document.getElementById('drawerName').textContent  = p.name;
  document.getElementById('drawerDesc').textContent  = p.description || '';
  document.getElementById('qtyVal').textContent = '1';

  const imgEl = document.getElementById('drawerImg');
  imgEl.innerHTML = p.image_url
    ? `<img src="${p.image_url}" alt="${p.name}"/>`
    : '<span style="font-size:2rem">🧴</span>';

  document.getElementById('sizeOptions').innerHTML = sizes.map(s => {
    const finalPrice = p.discount > 0 ? Math.round(s.price * (1 - p.discount/100)) : s.price;
    return `
      <button class="size-opt" data-ml="${s.ml}" data-price="${finalPrice}" onclick="selectSize(this,${s.ml},${finalPrice})">
        <span class="ml">${s.ml}ml</span>
        <span class="price">${EGP(finalPrice)}</span>
      </button>`;
  }).join('');

  // Auto-select first size
  const firstBtn = document.querySelector('#sizeOptions .size-opt');
  if (firstBtn) firstBtn.click();

  document.getElementById('promoInput').value = '';
  document.getElementById('promoMsg').style.display = 'none';
  document.getElementById('orderNotes').value = '';
  document.getElementById('custName').value = '';
  document.getElementById('custPhone').value = '';
  document.getElementById('custAddress').value = '';
  document.getElementById('orderStatusMsg').style.display = 'none';
  document.getElementById('sumProduct').textContent = `${p.brand} ${p.name}`;

  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

window.openProduct = openProduct;

window.selectSize = function(btn, ml, price) {
  document.querySelectorAll('.size-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentSize = { ml, price };
  document.getElementById('sumSize').textContent = `${ml}ml`;
  updateDrawerSummary();
};

window.closeDrawer = function() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
  document.body.style.overflow = '';
};

function updateDrawerSummary() {
  if (!currentSize) return;
  const subtotal = currentSize.price * currentQty;
  const discAmt  = Math.round(subtotal * promoDiscount / 100);
  const total    = subtotal - discAmt;

  document.getElementById('qtyTotal').textContent   = EGP(total);
  document.getElementById('sumSubtotal').textContent = EGP(subtotal);
  document.getElementById('sumTotal').textContent    = EGP(total);

  if (discAmt > 0) {
    document.getElementById('sumDiscountRow').style.display = '';
    document.getElementById('sumDiscount').textContent = `− ${EGP(discAmt)}`;
  } else {
    document.getElementById('sumDiscountRow').style.display = 'none';
  }
}

/* qty buttons */
document.getElementById('qtyMinus').addEventListener('click', () => {
  if (currentQty > 1) { currentQty--; document.getElementById('qtyVal').textContent = currentQty; updateDrawerSummary(); }
});
document.getElementById('qtyPlus').addEventListener('click', () => {
  currentQty++; document.getElementById('qtyVal').textContent = currentQty; updateDrawerSummary();
});

/* promo */
document.getElementById('applyPromo').addEventListener('click', () => {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  const msg  = document.getElementById('promoMsg');
  if (!code) return;
  const promo = allPromos.find(p => p.code === code && p.active);
  if (promo) {
    promoDiscount = promo.discount;
    promoCode = code;
    msg.textContent = `✓ تم تطبيق خصم ${promo.discount}%`;
    msg.className = 'promo-msg ok';
    msg.style.display = 'block';
    toast(`خصم ${promo.discount}% تم تطبيقه ✓`, 'ok');
  } else {
    promoDiscount = 0;
    promoCode = '';
    msg.textContent = '✕ كود غير صحيح أو منتهي';
    msg.className = 'promo-msg err';
    msg.style.display = 'block';
  }
  updateDrawerSummary();
});

/* SUBMIT ORDER */
document.getElementById('submitOrder').addEventListener('click', async () => {
  if (!currentSize) { toast('اختر حجماً أولاً', 'err'); return; }
  const name    = document.getElementById('custName').value.trim();
  const phone   = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const notes   = document.getElementById('orderNotes').value.trim();

  if (!name)    { toast('ادخل اسمك', 'err'); document.getElementById('custName').focus();    return; }
  if (!phone)   { toast('ادخل رقم هاتفك', 'err'); document.getElementById('custPhone').focus(); return; }
  if (!address) { toast('ادخل عنوانك', 'err'); document.getElementById('custAddress').focus();  return; }

  const subtotal  = currentSize.price * currentQty;
  const discAmt   = Math.round(subtotal * promoDiscount / 100);
  const total     = subtotal - discAmt;

  const btn = document.getElementById('submitOrder');
  btn.disabled = true;
  btn.textContent = '⏳ جاري الإرسال...';

  const orderData = {
    product_id:      currentProduct.id,
    product_name:    currentProduct.name,
    brand:           currentProduct.brand,
    size_ml:         currentSize.ml,
    price_per_ml:    currentSize.price / currentSize.ml,
    quantity:        currentQty,
    unit_price:      currentSize.price,
    subtotal,
    discount_amount: discAmt,
    promo_code:      promoCode || null,
    total,
    customer_name:   name,
    customer_phone:  phone,
    customer_address:address,
    notes:           notes || null,
    status:          'new',
  };

  let saved = false;
  if (sb) {
    try {
      const { error } = await sb.from('orders').insert([orderData]);
      if (!error) saved = true;
    } catch(e) { console.error(e); }
  }

  // WhatsApp message
  const waMsg = encodeURIComponent(
    `🛍️ طلب جديد - Shahenda Store\n\n` +
    `المنتج: ${currentProduct.brand} ${currentProduct.name}\n` +
    `الحجم: ${currentSize.ml}ml\n` +
    `الكمية: ${currentQty}\n` +
    `الإجمالي: ${total} جنيه\n` +
    `${promoCode ? `الكود: ${promoCode} (خصم ${discAmt} جنيه)\n` : ''}` +
    `\n👤 بيانات العميل:\n` +
    `الاسم: ${name}\n` +
    `الهاتف: ${phone}\n` +
    `العنوان: ${address}\n` +
    `${notes ? `ملاحظات: ${notes}\n` : ''}💵 الدفع: كاش عند الاستلام`
  );

  // Add to local cart
  cart.push({ ...orderData, id: Date.now() });
  updateCartBadge();

  const statusEl = document.getElementById('orderStatusMsg');
  statusEl.textContent = `✓ تم استلام طلبك! ${saved ? 'تم الحفظ في قاعدة البيانات.' : 'يمكنك التأكيد عبر واتساب.'}`;
  statusEl.className = 'order-status-msg ok';
  statusEl.style.display = 'block';
  toast('تم تقديم الطلب بنجاح ✓', 'ok', 4000);

  // Open WhatsApp
  setTimeout(() => window.open(`https://wa.me/${WA_NUMBER}?text=${waMsg}`, '_blank'), 800);

  btn.disabled = false;
  btn.textContent = '✓ تأكيد الطلب';

  // Reset
  setTimeout(() => {
    closeDrawer();
    statusEl.style.display = 'none';
  }, 3000);
});

/* ══════════════════════════
   CART
══════════════════════════ */
function updateCartBadge() {
  document.getElementById('cartBadge').textContent = cart.length;
}

function openCart() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCart();
}

window.closeCart = function() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
};

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const footEl  = document.getElementById('cartFoot');

  if (!cart.length) {
    itemsEl.innerHTML = `<div class="cart-empty"><span class="ce-icon">🛒</span><span>السلة فارغة</span></div>`;
    footEl.style.display = 'none';
    return;
  }

  const p = allProducts.find(x => x.id === cart[cart.length-1]?.product_id);
  itemsEl.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="ci-img">
        ${p && p.image_url ? `<img src="${p.image_url}" alt="${item.product_name}"/>` : '<span style="font-size:1.5rem">🧴</span>'}
      </div>
      <div class="ci-info">
        <div class="ci-name">${item.brand} ${item.product_name}</div>
        <div class="ci-sub">${item.size_ml}ml × ${item.quantity}</div>
        <div class="ci-price">${EGP(item.total)}</div>
      </div>
      <button class="ci-remove" onclick="removeCartItem(${i})">✕ حذف</button>
    </div>
  `).join('');

  const total = cart.reduce((s,c) => s + c.total, 0);
  document.getElementById('cartTotal').textContent = EGP(total);
  footEl.style.display = 'block';
}

window.removeCartItem = function(i) {
  cart.splice(i, 1);
  updateCartBadge();
  renderCart();
};

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('checkoutBtn').addEventListener('click', () => {
  const total = cart.reduce((s,c) => s + c.total, 0);
  const lines = cart.map(c => `• ${c.brand} ${c.product_name} ${c.size_ml}ml ×${c.quantity} = ${EGP(c.total)}`).join('\n');
  const msg = encodeURIComponent(`🛒 طلب من Shahenda Store\n\n${lines}\n\nالإجمالي: ${EGP(total)}`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
});

/* ══════════════════════════
   INIT
══════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadOffers();
  loadProducts();
  loadPromos();
  updateCartBadge();

  // Close drawer on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDrawer(); closeCart(); }
  });
});
