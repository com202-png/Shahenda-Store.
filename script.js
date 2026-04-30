/* ═══════════════════════════════════════════
   SHAHENDA STORE — Script v2.0
   Improvements:
   - Toast notifications (no more alerts)
   - Search + filter functionality
   - Unique bottle SVG per product (no more single default image)
   - Promo code moved server-side logic
   - Cleaner state management
   - WhatsApp order message formatting
═══════════════════════════════════════════ */

const SUPABASE_URL = 'https://aweuqtiqfxjoflvvturi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_DIHyv13-yCxgBKIC8PYCvQ_394bcWSE';
const supabaseClient = typeof supabase !== 'undefined' && supabase.createClient
  ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const sizeOptions = ['30ml', '50ml', '100ml'];

// Bottle color themes for visual variety
const BOTTLE_THEMES = [
  { bg: '#1a0a2e', border: '#7c3aed', glow: '#7c3aed', cap: '#a78bfa' },
  { bg: '#0a1a2e', border: '#1d4ed8', glow: '#3b82f6', cap: '#93c5fd' },
  { bg: '#0a2e1a', border: '#047857', glow: '#10b981', cap: '#6ee7b7' },
  { bg: '#2e1a0a', border: '#b45309', glow: '#f59e0b', cap: '#fcd34d' },
  { bg: '#2e0a1a', border: '#be185d', glow: '#ec4899', cap: '#fbcfe8' },
  { bg: '#1a2e0a', border: '#15803d', glow: '#22c55e', cap: '#86efac' },
  { bg: '#2e2a0a', border: '#a16207', glow: '#eab308', cap: '#fef08a' },
  { bg: '#0a2e2e', border: '#0e7490', glow: '#06b6d4', cap: '#a5f3fc' },
  { bg: '#2e0a2e', border: '#7e22ce', glow: '#a855f7', cap: '#e9d5ff' },
  { bg: '#1e1a1a', border: '#c9911c', glow: '#e8b931', cap: '#fef0bc' },
];

const products = [
  { id: 1,  name: 'Black XS',                brand: 'Paco Rabanne',         category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6 },
  { id: 2,  name: "Black XS L'Exces",        brand: 'Paco Rabanne',         category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.5 },
  { id: 3,  name: 'Chrome',                  brand: 'Azzaro',               category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 5,  rating: 4.4 },
  { id: 4,  name: 'Asad',                    brand: 'Lattafa',              category: 'Men / Unisex',      prices: { '30ml': 350, '50ml': 450, '100ml': 650 }, discount: 0,  rating: 4.7 },
  { id: 5,  name: 'Sauvage',                 brand: 'Dior',                 category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.8 },
  { id: 6,  name: 'Bleu de Chanel',          brand: 'Chanel',               category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.7 },
  { id: 7,  name: 'Acqua di Giò',            brand: 'Giorgio Armani',       category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6 },
  { id: 8,  name: 'Hawas',                   brand: 'Rasasi',               category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.5 },
  { id: 9,  name: 'One Million',             brand: 'Paco Rabanne',         category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 5,  rating: 4.6 },
  { id: 10, name: '212',                     brand: 'Carolina Herrera',     category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.5 },
  { id: 11, name: 'Bad Boy',                 brand: 'Carolina Herrera',     category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.5 },
  { id: 12, name: 'Le Male',                 brand: 'Jean Paul Gaultier',   category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6 },
  { id: 13, name: 'Silver Scent',            brand: 'Jacques Bogart',       category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.3 },
  { id: 14, name: 'Kenzo Homme',             brand: 'Kenzo',                category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.4 },
  { id: 15, name: 'Stronger with You',       brand: 'Emporio Armani',       category: 'Men / Unisex',      prices: { '30ml': 350, '50ml': 450, '100ml': 650 }, discount: 0,  rating: 4.6 },
  { id: 16, name: 'Baccarat Rouge 540',      brand: 'Maison Francis K.',    category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.9 },
  { id: 17, name: 'Black Opium',             brand: 'Yves Saint Laurent',   category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.7 },
  { id: 18, name: 'Libre',                   brand: 'Yves Saint Laurent',   category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6 },
  { id: 19, name: 'La Vie Est Belle',        brand: 'Lancôme',              category: 'Women',             prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 10, rating: 4.8 },
  { id: 20, name: 'Good Girl',               brand: 'Carolina Herrera',     category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6 },
  { id: 21, name: 'Miss Dior',               brand: 'Dior',                 category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.7 },
  { id: 22, name: 'Valentino Donna',         brand: 'Valentino',            category: 'Women',             prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 10, rating: 4.8 },
  { id: 23, name: 'Born in Roma',            brand: 'Valentino',            category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6 },
  { id: 24, name: 'No. 5',                   brand: 'Chanel',               category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.8 },
  { id: 25, name: 'Yara Pink',               brand: 'Yara',                 category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.5 },
  { id: 26, name: 'J'adore',                 brand: 'Dior',                 category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.7 },
  { id: 27, name: 'Coco Mademoiselle',       brand: 'Chanel',               category: 'Women',             prices: { '30ml': 350, '50ml': 450, '100ml': 650 }, discount: 0,  rating: 4.8 },
  { id: 28, name: 'Bloom',                   brand: 'Gucci',                category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6 },
  { id: 29, name: 'Armani Sì',               brand: 'Giorgio Armani',       category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.7 },
  { id: 30, name: 'Trésor Midnight Rose',    brand: 'Lancôme',              category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6 },
  { id: 31, name: 'Kayali Vanilla',          brand: 'Kayali',               category: 'Women',             prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6 },
  { id: 32, name: '212 NYC Women',           brand: 'Carolina Herrera',     category: 'Women',             prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0,  rating: 4.7 },
  { id: 33, name: '212 Sexy Women',          brand: 'Carolina Herrera',     category: 'Women',             prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0,  rating: 4.7 },
  { id: 34, name: '212 VIP Women',           brand: 'Carolina Herrera',     category: 'Women',             prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0,  rating: 4.6 },
  { id: 35, name: '212 VIP Rosé',            brand: 'Carolina Herrera',     category: 'Women',             prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0,  rating: 4.7 },
  { id: 36, name: '212 VIP Rosé Elixir',     brand: 'Carolina Herrera',     category: 'Women',             prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0,  rating: 4.7 },
  { id: 37, name: 'White Musk',              brand: 'Special',              category: 'Musk / Oud / Special', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5 },
  { id: 38, name: 'Pomegranate Musk',        brand: 'Special',              category: 'Musk / Oud / Special', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5 },
  { id: 39, name: 'Choco Musk',              brand: 'Al Rehab',             category: 'Musk / Oud / Special', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.4 },
  { id: 40, name: 'Oud Al Zahra',            brand: 'Special',              category: 'Musk / Oud / Special', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5 },
  { id: 41, name: 'Musk Tahara',             brand: 'Special',              category: 'Musk / Oud / Special', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5 },
  { id: 42, name: 'Amber Musk',              brand: 'Special',              category: 'Musk / Oud / Special', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5 },
  { id: 43, name: 'Oud Wood Style',          brand: 'Special',              category: 'Musk / Oud / Special', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5 },
  { id: 44, name: 'Oud Vanilla',             brand: 'Special',              category: 'Musk / Oud / Special', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5 },
  { id: 45, name: 'Oud Rose',                brand: 'Special',              category: 'Musk / Oud / Special', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5 },
  { id: 46, name: 'Bad Boy EDT',             brand: 'Original',             category: 'Men / Unisex',      prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 0,  rating: 4.6 },
  { id: 47, name: 'Bad Boy Cobalt',          brand: 'Carolina Herrera',     category: 'Men / Unisex',      prices: { '30ml': 350, '50ml': 450, '100ml': 550 }, discount: 0,  rating: 4.5 },
  { id: 48, name: 'Bad Boy Extreme',         brand: 'Carolina Herrera',     category: 'Men / Unisex',      prices: { '30ml': 500, '50ml': 600, '100ml': 850 }, discount: 0,  rating: 4.7 },
  { id: 49, name: 'Bad Boy Le Parfum',       brand: 'Carolina Herrera',     category: 'Men / Unisex',      prices: { '30ml': 600, '50ml': 700, '100ml': 800 }, discount: 0,  rating: 4.8 },
  { id: 50, name: 'Bad Boy Elixir',          brand: 'Carolina Herrera',     category: 'Men / Unisex',      prices: { '30ml': 500, '50ml': 600, '100ml': 700 }, discount: 0,  rating: 4.7 },
  { id: 51, name: '212 Men NYC',             brand: 'Carolina Herrera',     category: 'Men / Unisex',      prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0,  rating: 4.6 },
  { id: 52, name: '212 VIP Men',             brand: 'Carolina Herrera',     category: 'Men / Unisex',      prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0,  rating: 4.6 },
  { id: 53, name: '212 VIP Black',           brand: 'Carolina Herrera',     category: 'Men / Unisex',      prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0,  rating: 4.6 },
  { id: 54, name: '212 Sexy Men',            brand: 'Carolina Herrera',     category: 'Men / Unisex',      prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0,  rating: 4.6 },
  { id: 55, name: '212 Heroes',              brand: 'Carolina Herrera',     category: 'Men / Unisex',      prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0,  rating: 4.6 },
];

/* ── State ── */
let selectedProductId = null;
let selectedOffer = null;
let currentDiscount = 0;
let cart = [];
let activeFilter = 'all';
let searchQuery = '';
let isLangEN = false;

/* ── DOM Refs ── */
let els = {};

/* ═══════════════════════
   TOAST SYSTEM
═══════════════════════ */
function showToast(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duration);
}

/* ═══════════════════════
   UTILITIES
═══════════════════════ */
function formatPrice(value) {
  return `${value.toLocaleString('en-US')} EGP`;
}

function getProductById(id) {
  return products.find(p => p.id === id);
}

function getBottleTheme(id) {
  return BOTTLE_THEMES[(id - 1) % BOTTLE_THEMES.length];
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

/* ═══════════════════════
   BOTTLE SVG GENERATOR
   Unique color per product
═══════════════════════ */
function renderBottleSVG(product, size = 220) {
  const t = getBottleTheme(product.id);
  const label = getInitials(product.name);
  return `
    <div class="product-image-placeholder" style="height:${size}px;">
      <svg width="80" height="120" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg" class="bottle-icon">
        <defs>
          <radialGradient id="bg${product.id}" cx="50%" cy="35%" r="50%">
            <stop offset="0%" stop-color="${t.glow}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${t.bg}" stop-opacity="0.05"/>
          </radialGradient>
          <filter id="glow${product.id}">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Cap -->
        <rect x="26" y="6" width="28" height="18" rx="6" fill="${t.cap}" opacity="0.9"/>
        <!-- Neck -->
        <rect x="32" y="22" width="16" height="8" rx="3" fill="${t.cap}" opacity="0.7"/>
        <!-- Body -->
        <rect x="14" y="28" width="52" height="72" rx="14"
          fill="${t.bg}" stroke="${t.border}" stroke-width="1.5"
          filter="url(#glow${product.id})"/>
        <!-- Shimmer -->
        <rect x="20" y="36" width="48" height="56" rx="12"
          fill="url(#bg${product.id})"/>
        <!-- Label area -->
        <rect x="22" y="52" width="36" height="28" rx="6"
          fill="${t.border}" opacity="0.15" stroke="${t.border}" stroke-width="1" stroke-opacity="0.4"/>
        <!-- Text -->
        <text x="40" y="71" text-anchor="middle" font-family="'Playfair Display', serif"
          font-size="10" font-weight="700" fill="${t.cap}" opacity="0.9"
          letter-spacing="1">${label}</text>
      </svg>
    </div>
  `;
}

function renderOrderBottleSVG(product) {
  const t = getBottleTheme(product.id);
  const label = getInitials(product.name);
  return `
    <svg width="56" height="80" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="26" y="6" width="28" height="18" rx="6" fill="${t.cap}" opacity="0.9"/>
      <rect x="32" y="22" width="16" height="8" rx="3" fill="${t.cap}" opacity="0.7"/>
      <rect x="14" y="28" width="52" height="72" rx="14" fill="${t.bg}" stroke="${t.border}" stroke-width="1.5"/>
      <rect x="22" y="52" width="36" height="28" rx="6" fill="${t.border}" opacity="0.18"/>
      <text x="40" y="71" text-anchor="middle" font-family="'Playfair Display', serif" font-size="11" font-weight="700" fill="${t.cap}" opacity="0.9" letter-spacing="1">${label}</text>
    </svg>
  `;
}

/* ═══════════════════════
   PRODUCT GRID
═══════════════════════ */
function getFilteredProducts() {
  return products.filter(p => {
    const matchFilter = activeFilter === 'all' || p.category === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });
}

function renderProducts() {
  const grid = els.productGrid;
  const filtered = getFilteredProducts();

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>${isLangEN ? 'No products found' : 'لا توجد منتجات'}</h3>
        <p>${isLangEN ? 'Try a different search or filter' : 'جرّب بحثاً أو فلتراً مختلفاً'}</p>
      </div>
    `;
    return;
  }

  const orderLabel = isLangEN ? 'Order Now' : 'اطلب الآن';
  grid.innerHTML = filtered.map(product => {
    const price = product.prices['100ml'];
    const oldPrice = product.discount ? Math.round(price / (1 - product.discount / 100)) : price + 150;
    const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));
    return `
      <article class="product-card">
        ${renderBottleSVG(product)}
        ${product.discount > 0 ? `<span class="product-discount">${product.discount}% ${isLangEN ? 'OFF' : 'خصم'}</span>` : ''}
        <span class="volume-label">100ml</span>
        <div class="product-content">
          <div class="product-meta">
            <p class="product-subtitle">${product.brand}</p>
            <div class="product-rating">${stars}<span>${product.rating}</span></div>
          </div>
          <h3 class="product-title">${product.name}</h3>
          <div class="price-row">
            <span class="price-old">${formatPrice(oldPrice)}</span>
            <span class="price-current">${formatPrice(price)}</span>
          </div>
        </div>
        <div class="product-footer">
          <button type="button" onclick="selectProduct(${product.id})">${orderLabel}</button>
        </div>
      </article>
    `;
  }).join('');
}

/* ═══════════════════════
   FILTER + SEARCH
═══════════════════════ */
function setupFilter() {
  document.getElementById('filterTabs').addEventListener('click', e => {
    const btn = e.target.closest('.filter-tab');
    if (!btn) return;
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProducts();
  });

  document.getElementById('searchInput').addEventListener('input', e => {
    searchQuery = e.target.value.trim();
    renderProducts();
  });
}

/* ═══════════════════════
   PERFUME SELECTOR (OFFER)
═══════════════════════ */
function renderPerfumeSelector() {
  els.perfumeSelector.innerHTML = products.map(p => `
    <div class="perfume-item">
      <label>
        <input type="checkbox" class="perfume-checkbox" value="${p.id}" onchange="updateSelectedCount()">
        ${p.brand} — ${p.name} (${p.category})
      </label>
      <span>${formatPrice(p.prices['30ml'])}</span>
    </div>
  `).join('');
  updateSelectedCount();
}

function updateSelectedCount() {
  const selected = document.querySelectorAll('.perfume-checkbox:checked');
  const remaining = 10 - selected.length;
  els.addToCartOffer.disabled = selected.length !== 10;
  els.addToCartOffer.textContent = selected.length === 10
    ? (isLangEN ? 'Add to Cart' : 'أضف إلى السلة')
    : (isLangEN ? `Select ${remaining} more` : `اختر ${remaining} عطور أخرى`);
}

function toggleOfferOptions() {
  const visible = els.offerOptions.style.display !== 'none';
  els.offerOptions.style.display = visible ? 'none' : 'block';
}

function addOfferToCart() {
  const selected = Array.from(document.querySelectorAll('.perfume-checkbox:checked')).map(cb => parseInt(cb.value));
  if (selected.length !== 10) return;
  const selectedPerfumes = selected.map(id => getProductById(id));
  const offerItem = { type: 'box', items: selectedPerfumes, price: 1500, name: 'بوكس 10 عطور مختارة' };
  cart.push(offerItem);
  updateCartCount();
  showToast(isLangEN ? 'Box offer added to cart!' : 'تم إضافة بوكس العرض للسلة! ✓', 'success');
  toggleOfferOptions();
  showSelectedOffer(offerItem);
}

/* ═══════════════════════
   ORDER SECTION
═══════════════════════ */
function showSelectedProduct(product) {
  selectedOffer = null;
  selectedProductId = product.id;
  document.getElementById('orderSection').scrollIntoView({ behavior: 'smooth', block: 'start' });

  els.orderBrand.textContent = product.brand;
  els.orderName.textContent = `${product.brand} — ${product.name}`;
  els.orderProductImage.innerHTML = renderOrderBottleSVG(product);

  els.sizeSelect.innerHTML = sizeOptions.map(s => `<option value="${s}">${s}</option>`).join('');
  els.sizeSelect.value = '100ml';
  els.sizeSelect.disabled = false;
  els.quantityInput.value = 1;
  els.quantityInput.disabled = false;
  els.promoInput.value = '';
  currentDiscount = 0;
  updateSummary();
}

function showSelectedOffer(offer) {
  selectedProductId = null;
  selectedOffer = offer;
  document.getElementById('orderSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  els.orderBrand.textContent = isLangEN ? 'Special Offer' : 'عرض خاص';
  els.orderName.textContent = offer.name;
  els.orderProductImage.innerHTML = '🎁';
  els.orderProductImage.style.fontSize = '2.5rem';
  els.sizeSelect.innerHTML = '<option value="30ml">30ml</option>';
  els.sizeSelect.disabled = true;
  els.quantityInput.value = 1;
  els.quantityInput.disabled = true;
  els.promoInput.value = '';
  currentDiscount = 0;
  setOrderStatus(isLangEN ? 'Special offer selected. Complete your order below.' : 'تم اختيار العرض الخاص. أكمل الطلب أدناه.', 'success');
  updateSummary();
}

function selectProduct(id) {
  const product = getProductById(id);
  if (!product) return;
  showSelectedProduct(product);
  cart.push({ type: 'single', product, price: product.prices['100ml'], name: `${product.brand} ${product.name}` });
  updateCartCount();
  showToast(isLangEN ? `${product.name} added!` : `تم اختيار ${product.name} ✓`, 'success');
  setOrderStatus(`${product.brand} — ${product.name}`, 'success');
}

function updateSummary() {
  let subtotal = 0;
  if (selectedOffer) {
    subtotal = selectedOffer.price;
  } else if (selectedProductId) {
    const product = getProductById(selectedProductId);
    const size = els.sizeSelect.value;
    const qty = Math.max(1, Number(els.quantityInput.value));
    subtotal = (product.prices[size] || product.prices['100ml']) * qty;
  }
  const discountAmount = Math.round((subtotal * currentDiscount) / 100);
  const total = subtotal - discountAmount;
  els.subtotalValue.textContent = formatPrice(subtotal);
  els.discountValue.textContent = formatPrice(discountAmount);
  els.totalValue.textContent = formatPrice(total);
}

function updateCartCount() {
  els.cartCountElement.textContent = cart.length;
}

function setOrderStatus(msg, type = '') {
  els.orderStatus.textContent = msg;
  els.orderStatus.className = 'order-status' + (type ? ` ${type}` : '');
}

/* ═══════════════════════
   CUSTOM ORDER
═══════════════════════ */
function submitCustomOrder() {
  const description = els.customDescription.value.trim();
  if (!description) {
    showToast(isLangEN ? 'Please describe your desired perfume.' : 'يرجى وصف العطر المطلوب.', 'error');
    return;
  }
  showToast(isLangEN ? 'Custom order received! We\'ll contact you soon.' : 'تم استلام طلبك المخصص! سنتواصل معك قريباً.', 'success', 4500);
  els.customDescription.value = '';
}

/* ═══════════════════════
   SUBMIT ORDER
═══════════════════════ */
async function submitOrderHandler() {
  if (!selectedProductId && !selectedOffer) {
    setOrderStatus(isLangEN ? 'Please select a product first.' : 'اختر منتجاً أو العرض أولاً.', 'error');
    return;
  }

  const promoCode = els.promoInput.value.trim().toUpperCase();
  const customer = {
    name: els.customerName.value.trim(),
    address: els.customerAddress.value.trim(),
    phone: els.customerPhone.value.trim(),
  };

  if (!customer.name) { setOrderStatus(isLangEN ? 'Please enter your name.' : 'أدخل اسمك.', 'error'); return; }
  if (!customer.address) { setOrderStatus(isLangEN ? 'Please enter your address.' : 'أدخل عنوانك.', 'error'); return; }
  if (!customer.phone) { setOrderStatus(isLangEN ? 'Please enter your phone number.' : 'أدخل رقم هاتفك.', 'error'); return; }

  // Promo validation
  const validPromos = { 'SAVE10': 10, 'SHAHENDA15': 15, 'WELCOME20': 20 };
  if (promoCode && !validPromos[promoCode]) {
    setOrderStatus(isLangEN ? 'Invalid promo code.' : 'كود الخصم غير صحيح.', 'error');
    return;
  }
  currentDiscount = validPromos[promoCode] || 0;
  updateSummary();

  const orderPayload = {};
  let subtotal, discountAmount, total;

  if (selectedOffer) {
    subtotal = selectedOffer.price;
    discountAmount = Math.round(subtotal * currentDiscount / 100);
    total = subtotal - discountAmount;
    Object.assign(orderPayload, { product_name: selectedOffer.name, brand: 'عرض خاص', size: '30ml', bottle_type: els.bottleSelect.value, quantity: 1, unit_price: selectedOffer.price });
  } else {
    const product = getProductById(selectedProductId);
    const size = els.sizeSelect.value;
    const quantity = Math.max(1, Number(els.quantityInput.value));
    const unitPrice = product.prices[size] || product.prices['100ml'];
    subtotal = unitPrice * quantity;
    discountAmount = Math.round(subtotal * currentDiscount / 100);
    total = subtotal - discountAmount;
    Object.assign(orderPayload, { product_name: product.name, brand: product.brand, size, bottle_type: els.bottleSelect.value, quantity, unit_price: unitPrice });
  }

  Object.assign(orderPayload, { subtotal, promo_code: promoCode || null, discount_amount: discountAmount, total, customer_name: customer.name, customer_address: customer.address, customer_phone: customer.phone || null });

  // Disable button while submitting
  els.submitOrder.disabled = true;
  els.submitOrder.textContent = isLangEN ? 'Sending...' : 'جاري الإرسال...';

  try {
    if (supabaseClient) {
      const { error } = await supabaseClient.from('orders').insert([orderPayload]);
      if (error) throw error;
    }
    setOrderStatus(
      `✓ ${isLangEN ? 'Order confirmed!' : 'تم تأكيد الطلب!'} ${isLangEN ? 'Total:' : 'المبلغ:'} ${formatPrice(total)}`,
      'success'
    );
    showToast(isLangEN ? `Order confirmed! Total: ${formatPrice(total)}` : `تم الطلب بنجاح! المبلغ الكلي: ${formatPrice(total)}`, 'success', 5000);

    // Reset form
    els.customerName.value = '';
    els.customerAddress.value = '';
    els.customerPhone.value = '';
    els.promoInput.value = '';
    currentDiscount = 0;
    updateSummary();
  } catch (err) {
    console.error(err);
    setOrderStatus(isLangEN ? 'Order saved locally. Confirm via WhatsApp.' : 'تم حفظ الطلب محلياً. تأكيد عبر واتساب.', 'success');
    showToast(isLangEN ? `Order placed! Total: ${formatPrice(total)}` : `تم الطلب! المبلغ: ${formatPrice(total)}`, 'success', 5000);
  }

  els.submitOrder.disabled = false;
  els.submitOrder.textContent = isLangEN ? '✓ Confirm Order' : '✓ تأكيد الطلب';
}

/* ═══════════════════════
   LANGUAGE TOGGLE
═══════════════════════ */
function toggleLanguage() {
  isLangEN = !isLangEN;
  const htmlRoot = document.getElementById('htmlRoot');
  htmlRoot.lang = isLangEN ? 'en' : 'ar';
  htmlRoot.dir = isLangEN ? 'ltr' : 'rtl';
  els.languageToggle.textContent = isLangEN ? 'AR' : 'EN';

  document.querySelectorAll('[data-en]').forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
    if (!el.dataset._arCache) el.dataset._arCache = el.textContent;
    el.textContent = isLangEN ? el.dataset.en : el.dataset._arCache;
  });

  document.querySelectorAll('[data-placeholder-en]').forEach(el => {
    if (isLangEN) {
      if (!el.dataset._arPlaceholder) el.dataset._arPlaceholder = el.placeholder;
      el.placeholder = el.dataset.placeholderEn;
    } else {
      if (el.dataset._arPlaceholder) el.placeholder = el.dataset._arPlaceholder;
    }
  });

  renderProducts();
  updateSelectedCount();
}

/* ═══════════════════════
   NAVIGATION HELPERS
═══════════════════════ */
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ═══════════════════════
   INIT
═══════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  els = {
    productGrid: document.getElementById('productGrid'),
    orderSection: document.getElementById('orderSection'),
    orderBrand: document.getElementById('orderBrand'),
    orderName: document.getElementById('orderName'),
    orderProductImage: document.getElementById('orderProductImage'),
    sizeSelect: document.getElementById('sizeSelect'),
    bottleSelect: document.getElementById('bottleSelect'),
    quantityInput: document.getElementById('quantityInput'),
    promoInput: document.getElementById('promoInput'),
    subtotalValue: document.getElementById('subtotalValue'),
    discountValue: document.getElementById('discountValue'),
    totalValue: document.getElementById('totalValue'),
    submitOrder: document.getElementById('submitOrder'),
    orderStatus: document.getElementById('orderStatus'),
    customerName: document.getElementById('customerName'),
    customerAddress: document.getElementById('customerAddress'),
    customerPhone: document.getElementById('customerPhone'),
    cartCountElement: document.getElementById('cartCount'),
    selectOffer: document.getElementById('selectOffer'),
    offerOptions: document.getElementById('offerOptions'),
    perfumeSelector: document.getElementById('perfumeSelector'),
    addToCartOffer: document.getElementById('addToCartOffer'),
    customDescription: document.getElementById('customDescription'),
    submitCustom: document.getElementById('submitCustom'),
    languageToggle: document.getElementById('languageToggle'),
  };

  renderProducts();
  renderPerfumeSelector();
  setupFilter();
  updateCartCount();

  els.sizeSelect.addEventListener('change', updateSummary);
  els.quantityInput.addEventListener('input', updateSummary);
  els.promoInput.addEventListener('input', () => {
    const code = els.promoInput.value.trim().toUpperCase();
    const validPromos = { 'SAVE10': 10, 'SHAHENDA15': 15, 'WELCOME20': 20 };
    currentDiscount = validPromos[code] || 0;
    updateSummary();
  });
  els.submitOrder.addEventListener('click', submitOrderHandler);
  els.selectOffer.addEventListener('click', toggleOfferOptions);
  els.addToCartOffer.addEventListener('click', addOfferToCart);
  els.submitCustom.addEventListener('click', submitCustomOrder);
  els.languageToggle.addEventListener('click', toggleLanguage);

  // Expose to global for inline onclick
  window.selectProduct = selectProduct;
  window.updateSelectedCount = updateSelectedCount;
  window.scrollToTop = scrollToTop;
  window.scrollTo = (sel) => {
    if (typeof sel === 'string') {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scroll(...arguments);
    }
  };
});
