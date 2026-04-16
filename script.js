const sizeOptions = ['30ml', '50ml', '100ml'];

const products = [
  { id: 1, name: 'Black XS', brand: 'Paco Rabanne', category: 'Men / Unisex', image_url: 'https://69e170f2922d70dc1fa0c31b.imgix.net/Gemini_Generated_Image_r4bpjgr4bpjgr4bp.png', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6, volume: '100ml' },
  { id: 2, name: 'Black XS L’Exces', brand: 'Paco Rabanne', category: 'Men / Unisex', image_url: 'https://69e170f2922d70dc1fa0c31b.imgix.net/Gemini_Generated_Image_r4bpjgr4bpjgr4bp.png', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.5, volume: '100ml' },
  { id: 3, name: 'Chrome', brand: 'Azzaro', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/chrome-azzaro/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 5, rating: 4.4, volume: '100ml' },
  { id: 4, name: 'Asad', brand: 'Lattafa', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/asad-lattafa/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 350, '50ml': 450, '100ml': 650 }, discount: 0, rating: 4.7, volume: '100ml' },
  { id: 5, name: 'Sauvage', brand: 'Dior', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/sauvage-dior/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.8, volume: '100ml' },
  { id: 6, name: 'Bleu de Chanel', brand: 'Chanel', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/bleu-de-chanel/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.7, volume: '100ml' },
  { id: 7, name: 'Acqua di Giò', brand: 'Giorgio Armani', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/acqua-di-gio/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6, volume: '100ml' },
  { id: 8, name: 'Hawas', brand: 'Rasasi', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/hawas-rasasi/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.5, volume: '100ml' },
  { id: 9, name: 'One Million', brand: 'Paco Rabanne', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/one-million/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 5, rating: 4.6, volume: '100ml' },
  { id: 10, name: '212', brand: 'Carolina Herrera', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/212-carolina/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.5, volume: '100ml' },
  { id: 11, name: 'Bad Boy', brand: 'Carolina Herrera', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/bad-boy/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.5, volume: '100ml' },
  { id: 12, name: 'Jean Paul Gaultier', brand: 'Le Male', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/le-male/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6, volume: '100ml' },
  { id: 13, name: 'Silver Scent', brand: 'Jacques Bogart', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/silver-scent/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.3, volume: '100ml' },
  { id: 14, name: 'Kenzo', brand: 'Kenzo Homme', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/kenzo-homme/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.4, volume: '100ml' },
  { id: 15, name: 'Stronger with You', brand: 'Emporio Armani', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/stronger-with-you/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 350, '50ml': 450, '100ml': 650 }, discount: 0, rating: 4.6, volume: '100ml' },
  { id: 16, name: 'Baccarat Rouge 540', brand: 'Maison Francis Kurkdjian', category: 'Women', image_url: 'https://images.unsplash.com/seed/baccarat-rouge-540/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.9, volume: '100ml' },
  { id: 17, name: 'Black Opium', brand: 'Yves Saint Laurent', category: 'Women', image_url: 'https://images.unsplash.com/seed/black-opium/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.7, volume: '100ml' },
  { id: 18, name: 'Libre', brand: 'Yves Saint Laurent', category: 'Women', image_url: 'https://images.unsplash.com/seed/libre-ysl/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6, volume: '100ml' },
  { id: 19, name: 'La Vie Est Belle', brand: 'Lancôme', category: 'Women', image_url: 'https://images.unsplash.com/seed/la-vie-est-belle/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 10, rating: 4.8, volume: '100ml' },
  { id: 20, name: 'Good Girl', brand: 'Carolina Herrera', category: 'Women', image_url: 'https://images.unsplash.com/seed/good-girl/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6, volume: '100ml' },
  { id: 21, name: 'Miss Dior', brand: 'Dior', category: 'Women', image_url: 'https://images.unsplash.com/seed/miss-dior/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.7, volume: '100ml' },
  { id: 22, name: 'Valentino Donna', brand: 'Valentino', category: 'Women', image_url: 'https://images.unsplash.com/seed/valentino-donna/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 10, rating: 4.8, volume: '100ml' },
  { id: 23, name: 'Valentino Born in Roma', brand: 'Valentino', category: 'Women', image_url: 'https://images.unsplash.com/seed/born-in-roma/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6, volume: '100ml' },
  { id: 24, name: 'Chanel No.5', brand: 'Chanel', category: 'Women', image_url: 'https://images.unsplash.com/seed/chanel-no5/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.8, volume: '100ml' },
  { id: 25, name: 'Yara Pink Perfume', brand: 'Yara', category: 'Women', image_url: 'https://images.unsplash.com/seed/yara-pink-perfume/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.5, volume: '100ml' },
  { id: 26, name: 'Dior Jadore', brand: 'Dior', category: 'Women', image_url: 'https://images.unsplash.com/seed/dior-jadore/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.7, volume: '100ml' },
  { id: 27, name: 'Chanel Coco Mademoiselle', brand: 'Chanel', category: 'Women', image_url: 'https://images.unsplash.com/seed/coco-mademoiselle/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 350, '50ml': 450, '100ml': 650 }, discount: 0, rating: 4.8, volume: '100ml' },
  { id: 28, name: 'Gucci Bloom', brand: 'Gucci', category: 'Women', image_url: 'https://images.unsplash.com/seed/gucci-bloom/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6, volume: '100ml' },
  { id: 29, name: 'Armani Si', brand: 'Giorgio Armani', category: 'Women', image_url: 'https://images.unsplash.com/seed/armani-si/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.7, volume: '100ml' },
  { id: 30, name: 'Lancome Tresor Midnight Rose', brand: 'Lancôme', category: 'Women', image_url: 'https://images.unsplash.com/seed/tresor-midnight-rose/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6, volume: '100ml' },
  { id: 31, name: 'Kayali', brand: 'Kayali', category: 'Women', image_url: 'https://images.unsplash.com/seed/kayali/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 10, rating: 4.6, volume: '100ml' },
  { id: 32, name: '212 NYC Women', brand: 'Carolina Herrera', category: 'Women', image_url: 'https://images.unsplash.com/seed/212-nyc-women/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.7, volume: '100ml' },
  { id: 33, name: '212 Sexy Women', brand: 'Carolina Herrera', category: 'Women', image_url: 'https://images.unsplash.com/seed/212-sexy-women/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.7, volume: '100ml' },
  { id: 34, name: '212 VIP Women', brand: 'Carolina Herrera', category: 'Women', image_url: 'https://images.unsplash.com/seed/212-vip-women/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.6, volume: '100ml' },
  { id: 35, name: '212 VIP Rosé', brand: 'Carolina Herrera', category: 'Women', image_url: 'https://images.unsplash.com/seed/212-vip-rose/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.7, volume: '100ml' },
  { id: 36, name: '212 VIP Rosé Elixir', brand: 'Carolina Herrera', category: 'Women', image_url: 'https://images.unsplash.com/seed/212-vip-rose-elixir/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.7, volume: '100ml' },
  { id: 37, name: 'White Musk', brand: 'Special', category: 'Musk / Oud / Special', image_url: 'https://images.unsplash.com/seed/white-musk/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5, volume: '100ml' },
  { id: 38, name: 'Pomegranate Musk', brand: 'Special', category: 'Musk / Oud / Special', image_url: 'https://images.unsplash.com/seed/pomegranate-musk/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5, volume: '100ml' },
  { id: 39, name: 'Choco Musk', brand: 'Al Rehab', category: 'Musk / Oud / Special', image_url: 'https://images.unsplash.com/seed/choco-musk/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.4, volume: '100ml' },
  { id: 40, name: 'Oud Al Zahra', brand: 'Special', category: 'Musk / Oud / Special', image_url: 'https://images.unsplash.com/seed/oud-al-zahra/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5, volume: '100ml' },
  { id: 41, name: 'Musk Tahara', brand: 'Special', category: 'Musk / Oud / Special', image_url: 'https://images.unsplash.com/seed/musk-tahara/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5, volume: '100ml' },
  { id: 42, name: 'Amber Musk', brand: 'Special', category: 'Musk / Oud / Special', image_url: 'https://images.unsplash.com/seed/amber-musk/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5, volume: '100ml' },
  { id: 43, name: 'Oud Wood Style', brand: 'Special', category: 'Musk / Oud / Special', image_url: 'https://images.unsplash.com/seed/oud-wood-style/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5, volume: '100ml' },
  { id: 44, name: 'Oud Vanilla', brand: 'Special', category: 'Musk / Oud / Special', image_url: 'https://images.unsplash.com/seed/oud-vanilla/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5, volume: '100ml' },
  { id: 45, name: 'Oud Rose', brand: 'Special', category: 'Musk / Oud / Special', image_url: 'https://images.unsplash.com/seed/oud-rose/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.5, volume: '100ml' },
  { id: 46, name: 'Bad Boy EDT', brand: 'Original', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/bad-boy-edt/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 300, '50ml': 400, '100ml': 600 }, discount: 0, rating: 4.6, volume: '100ml' },
  { id: 47, name: 'Bad Boy Cobalt', brand: 'Carolina Herrera', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/bad-boy-cobalt/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 350, '50ml': 450, '100ml': 550 }, discount: 0, rating: 4.5, volume: '100ml' },
  { id: 48, name: 'Bad Boy Extreme', brand: 'Carolina Herrera', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/bad-boy-extreme/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 500, '50ml': 600, '100ml': 850 }, discount: 0, rating: 4.7, volume: '100ml' },
  { id: 49, name: 'Bad Boy Le Parfum', brand: 'Carolina Herrera', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/bad-boy-le-parfum/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 600, '50ml': 700, '100ml': 800 }, discount: 0, rating: 4.8, volume: '100ml' },
  { id: 50, name: 'Bad Boy Elixir', brand: 'Carolina Herrera', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/bad-boy-elixir/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 500, '50ml': 600, '100ml': 700 }, discount: 0, rating: 4.7, volume: '100ml' },
  { id: 51, name: '212 Men NYC', brand: 'Carolina Herrera', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/212-men-nyc/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.6, volume: '100ml' },
  { id: 52, name: '212 VIP Men', brand: 'Carolina Herrera', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/212-vip-men/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.6, volume: '100ml' },
  { id: 53, name: '212 VIP Black', brand: 'Carolina Herrera', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/212-vip-black/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.6, volume: '100ml' },
  { id: 54, name: '212 Sexy Men', brand: 'Carolina Herrera', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/212-sexy-men/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.6, volume: '100ml' },
  { id: 55, name: '212 Heroes', brand: 'Carolina Herrera', category: 'Men / Unisex', image_url: 'https://images.unsplash.com/seed/212-heroes/600x600?auto=format&fit=crop&w=600&q=80', prices: { '30ml': 400, '50ml': 500, '100ml': 700 }, discount: 0, rating: 4.6, volume: '100ml' },
];

let productGrid;
let orderSection;
let orderBrand;
let orderName;
let orderProductImage;
let sizeSelect;
let bottleSelect;
let quantityInput;
let promoInput;
let subtotalValue;
let discountValue;
let totalValue;
let submitOrder;
let orderStatus;
let customerName;
let customerEmail;
let customerPhone;
let cartCountElement;
let selectOffer;
let offerOptions;
let perfumeSelector;
let addToCartOffer;
let customDescription;
let submitCustom;
let languageToggle;

let selectedProductId = null;
let currentDiscount = 0;
let currentPromoCode = '';
let cart = [];

function formatPrice(value) {
  return `${value.toLocaleString('en-US')} EGP`;
}

function getProductById(id) {
  return products.find((product) => product.id === id);
}

function renderProducts() {
  productGrid.innerHTML = products
    .map((product) => {
      const price = product.prices['100ml'];
      const oldPrice = product.discount ? Math.round(price / (1 - product.discount / 100)) : price + 150;
      const imageUrl = product.image_url || `https://via.placeholder.com/320x240.png?text=${encodeURIComponent(product.name)}`;
      return `
        <article class="product-card">
          <div class="product-image">
            <img src="${imageUrl}" alt="${product.name}" loading="lazy" />
            <span class="volume-label">${product.volume || '100ml'}</span>
            <span class="product-discount">${product.discount || 0}% خصم</span>
          </div>
          <div class="product-content">
            <div class="product-meta">
              <p class="product-subtitle">${product.brand}</p>
              <div class="product-rating">${'★'.repeat(Math.round(product.rating))}<span>${product.rating}</span></div>
            </div>
            <h3 class="product-title">${product.name}</h3>
            <div class="price-row">
              <span class="price-old">${formatPrice(oldPrice)}</span>
              <span class="price-current">${formatPrice(price)}</span>
            </div>
          </div>
          <div class="product-footer">
            <button type="button" onclick="selectProduct(${product.id})">اطلب الآن</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderPerfumeSelector() {
  perfumeSelector.innerHTML = products
    .map((product) => `
      <div class="perfume-item">
        <label>
          <input type="checkbox" class="perfume-checkbox" value="${product.id}" onchange="updateSelectedCount()">
          ${product.brand} ${product.name} (${product.category})
        </label>
        <span>${formatPrice(product.prices['30ml'])}</span>
      </div>
    `)
    .join('');
  updateSelectedCount();
}

function updateSelectedCount() {
  const selected = document.querySelectorAll('.perfume-checkbox:checked');
  addToCartOffer.disabled = selected.length !== 10;
  addToCartOffer.textContent = selected.length === 10 ? 'أضف إلى السلة' : `اختر ${10 - selected.length} عطور أخرى`;
}

function toggleOfferOptions() {
  offerOptions.style.display = offerOptions.style.display === 'none' ? 'block' : 'none';
}

function addOfferToCart() {
  const selected = Array.from(document.querySelectorAll('.perfume-checkbox:checked')).map((cb) => parseInt(cb.value));
  if (selected.length !== 10) return;
  const selectedPerfumes = selected.map((id) => getProductById(id));
  cart.push({
    type: 'box',
    items: selectedPerfumes,
    price: 1500,
    name: 'بوكس 10 عطور مختارة',
  });
  updateCartCount(cart.length);
  alert('تم إضافة البوكس إلى السلة!');
  toggleOfferOptions();
}

function showSelectedProduct(product) {
  orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  orderBrand.textContent = product.brand;
  orderName.textContent = `${product.brand} ${product.name}`;
  const imageUrl = product.image_url || `https://via.placeholder.com/84x84.png?text=${encodeURIComponent(product.name)}`;
  orderProductImage.innerHTML = `<img src="${imageUrl}" alt="${product.name}" loading="lazy" />`;
  sizeSelect.innerHTML = sizeOptions.map((size) => `<option value="${size}">${size}</option>`).join('');
  sizeSelect.value = '100ml';
  quantityInput.value = 1;
  promoInput.value = '';
  currentDiscount = 0;
  currentPromoCode = '';
  updateSummary();
}

function selectProduct(id) {
  selectedProductId = id;
  const product = getProductById(id);
  if (!product) return;
  showSelectedProduct(product);
  cart.push({
    type: 'single',
    product,
    price: product.prices['100ml'],
    name: `${product.brand} ${product.name}`,
  });
  updateCartCount(cart.length);
  orderStatus.textContent = `تم اختيار ${product.brand} ${product.name}`;
  orderStatus.className = 'order-status success';
}

function updateSummary() {
  if (!selectedProductId) {
    subtotalValue.textContent = '0 EGP';
    discountValue.textContent = '0 EGP';
    totalValue.textContent = '0 EGP';
    return;
  }
  const product = getProductById(selectedProductId);
  const size = sizeSelect.value;
  const quantity = Math.max(1, Number(quantityInput.value));
  const unitPrice = product.prices[size] || product.prices['100ml'];
  const subtotal = unitPrice * quantity;
  const discountAmount = Math.round((subtotal * currentDiscount) / 100);
  const total = subtotal - discountAmount;
  subtotalValue.textContent = formatPrice(subtotal);
  discountValue.textContent = formatPrice(discountAmount);
  totalValue.textContent = formatPrice(total);
}

function updateCartCount(value) {
  cartCountElement.textContent = value;
}

function submitCustomOrder() {
  const description = customDescription.value.trim();
  if (!description) {
    alert('يرجى وصف العطر المطلوب.');
    return;
  }
  alert('شكراً! تم استلام طلبك المخصص. سنتواصل معك قريباً.');
  customDescription.value = '';
}

function submitOrderHandler() {
  if (!selectedProductId) {
    orderStatus.textContent = 'اختر منتجاً أولاً.';
    orderStatus.className = 'order-status error';
    return;
  }

  const product = getProductById(selectedProductId);
  const size = sizeSelect.value;
  const quantity = Math.max(1, Number(quantityInput.value));
  const unitPrice = product.prices[size] || product.prices['100ml'];
  const subtotal = unitPrice * quantity;
  const promoCode = promoInput.value.trim().toUpperCase();
  const discountAmount = promoCode === 'SAVE10' ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discountAmount;
  const customer = {
    name: customerName.value.trim(),
    email: customerEmail.value.trim(),
    phone: customerPhone.value.trim(),
  };

  if (!customer.name || !customer.email) {
    orderStatus.textContent = 'ادخل الاسم والبريد الإلكتروني لإتمام الطلب.';
    orderStatus.className = 'order-status error';
    return;
  }

  orderStatus.textContent = `تم تقديم الطلب لـ ${product.brand} ${product.name}. المبلغ الكلي ${formatPrice(total)}.`;
  orderStatus.className = 'order-status success';
  customerName.value = '';
  customerEmail.value = '';
  customerPhone.value = '';
  promoInput.value = '';
  currentDiscount = 0;
  currentPromoCode = '';
  updateSummary();
}

function toggleLanguage() {
  const htmlRoot = document.getElementById('htmlRoot');
  if (htmlRoot.lang === 'ar') {
    htmlRoot.lang = 'en';
    htmlRoot.dir = 'ltr';
    languageToggle.textContent = 'AR';
  } else {
    htmlRoot.lang = 'ar';
    htmlRoot.dir = 'rtl';
    languageToggle.textContent = 'EN';
  }
  document.querySelectorAll('[data-ar][data-en]').forEach((element) => {
    if (htmlRoot.lang === 'en') {
      element.textContent = element.getAttribute('data-en');
    } else {
      element.textContent = element.getAttribute('data-ar');
    }
  });
  document.querySelectorAll('[data-placeholder-en]').forEach((element) => {
    if (htmlRoot.lang === 'en') {
      element.placeholder = element.getAttribute('data-placeholder-en');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  productGrid = document.getElementById('productGrid');
  orderSection = document.getElementById('orderSection');
  orderBrand = document.getElementById('orderBrand');
  orderName = document.getElementById('orderName');
  orderProductImage = document.getElementById('orderProductImage');
  sizeSelect = document.getElementById('sizeSelect');
  bottleSelect = document.getElementById('bottleSelect');
  quantityInput = document.getElementById('quantityInput');
  promoInput = document.getElementById('promoInput');
  subtotalValue = document.getElementById('subtotalValue');
  discountValue = document.getElementById('discountValue');
  totalValue = document.getElementById('totalValue');
  submitOrder = document.getElementById('submitOrder');
  orderStatus = document.getElementById('orderStatus');
  customerName = document.getElementById('customerName');
  customerEmail = document.getElementById('customerEmail');
  customerPhone = document.getElementById('customerPhone');
  cartCountElement = document.getElementById('cartCount');
  selectOffer = document.getElementById('selectOffer');
  offerOptions = document.getElementById('offerOptions');
  perfumeSelector = document.getElementById('perfumeSelector');
  addToCartOffer = document.getElementById('addToCartOffer');
  customDescription = document.getElementById('customDescription');
  submitCustom = document.getElementById('submitCustom');
  languageToggle = document.getElementById('languageToggle');

  renderProducts();
  renderPerfumeSelector();
  updateCartCount(0);

  if (sizeSelect) sizeSelect.addEventListener('change', updateSummary);
  if (quantityInput) quantityInput.addEventListener('input', updateSummary);
  if (submitOrder) submitOrder.addEventListener('click', submitOrderHandler);
  if (selectOffer) selectOffer.addEventListener('click', toggleOfferOptions);
  if (addToCartOffer) addToCartOffer.addEventListener('click', addOfferToCart);
  if (submitCustom) submitCustom.addEventListener('click', submitCustomOrder);
  if (languageToggle) languageToggle.addEventListener('click', toggleLanguage);

  window.selectProduct = selectProduct;
  window.updateSelectedCount = updateSelectedCount;
});
