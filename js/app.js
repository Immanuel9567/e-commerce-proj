
const PRODUCTS_DATA = [
  {
    id: 'aura-01',
    title: 'AURA Studio ANC Over-Ear',
    category: 'audio',
    categoryName: 'Audio',
    price: 299,
    originalPrice: 349,
    rating: 4.9,
    reviewsCount: 128,
    badge: 'Flagship',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
    description: 'Precision-engineered acoustic architecture with adaptive hybrid active noise cancellation, custom 40mm beryllium drivers, and aerospace-grade matte obsidian finish.',
    colors: ['#111215', '#f8fafc', '#717d91'],
    sizes: ['Standard'],
    inStock: true
  },
  {
    id: 'aura-02',
    title: 'Bauhaus Chronograph Mono',
    category: 'timepieces',
    categoryName: 'Timepieces',
    price: 380,
    originalPrice: 420,
    rating: 4.8,
    reviewsCount: 94,
    badge: 'Artisan',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
    description: 'Minimalist 38mm dial crafted from 316L bead-blasted steel. Swiss quartz movement, scratch-resistant sapphire crystal, and vegetable-tanned full-grain leather band.',
    colors: ['#111215', '#f1f5f9'],
    sizes: ['38mm', '42mm'],
    inStock: true
  },
  {
    id: 'aura-03',
    title: 'Obsidian Low-Top Sneaker',
    category: 'footwear',
    categoryName: 'Footwear',
    price: 185,
    originalPrice: 210,
    rating: 4.7,
    reviewsCount: 210,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80',
    description: 'Hand-stitched buttery calfskin leather sneaker with sculpted ergonomic cupsole. Clean monochrome silhouette for effortless everyday elevation.',
    colors: ['#111215', '#f8fafc'],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
    inStock: true
  },
  {
    id: 'aura-04',
    title: 'Monolith Wireless Capsule',
    category: 'audio',
    categoryName: 'Audio',
    price: 145,
    originalPrice: 175,
    rating: 4.9,
    reviewsCount: 76,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=700&q=80',
    description: '360-degree spatial acoustic dispersion housed within a monolithic cylindrical anodized aluminum casing. IPX7 waterproof rating with 24-hour battery reserve.',
    colors: ['#111215', '#e2e8f0'],
    sizes: ['Standard'],
    inStock: true
  },
  {
    id: 'aura-05',
    title: 'Ceramic Geometry French Press',
    category: 'living',
    categoryName: 'Living',
    price: 85,
    originalPrice: 105,
    rating: 4.8,
    reviewsCount: 142,
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    description: 'Double-walled matte ceramic body that preserves brewing temperature for 2 hours. Fine mesh dual stainless steel plunger produces velvety micro-filtered coffee.',
    colors: ['#181a1f', '#f8fafc'],
    sizes: ['800ml'],
    inStock: true
  },
  {
    id: 'aura-06',
    title: 'Anodized 75% Mechanical Board',
    category: 'tech',
    categoryName: 'Tech',
    price: 240,
    originalPrice: 270,
    rating: 5.0,
    reviewsCount: 312,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80',
    description: 'Gasket-mounted solid aluminum block chassis with lubed silent linear switches and dual-tone PBT dye-sub keycaps. Tri-mode wireless connectivity.',
    colors: ['#111215', '#f1f5f9'],
    sizes: ['Linear Switch', 'Tactile Switch'],
    inStock: true
  },
  {
    id: 'aura-07',
    title: 'Sculptural Arc Desk Luminaire',
    category: 'living',
    categoryName: 'Living',
    price: 195,
    originalPrice: 230,
    rating: 4.8,
    reviewsCount: 63,
    badge: 'Design Award',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80',
    description: 'Ultra-slim curved monolithic LED light bar with smooth touch capacitive neumorphic dimming slider. Ra95 natural sunlight spectrum reproduction.',
    colors: ['#111215', '#f8fafc'],
    sizes: ['Desk Stand', 'Clamp Base'],
    inStock: true
  },
  {
    id: 'aura-08',
    title: 'Titanium Field Automatic',
    category: 'timepieces',
    categoryName: 'Timepieces',
    price: 490,
    originalPrice: 550,
    rating: 4.9,
    reviewsCount: 88,
    badge: 'Limited',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80',
    description: 'Grade 5 lightweight titanium case with self-winding Japanese automatic mechanical movement. 100m water resistance with Super-LumiNova luminescence.',
    colors: ['#111215'],
    sizes: ['40mm'],
    inStock: true
  },
  {
    id: 'aura-09',
    title: 'CloudPure Seamless Runner',
    category: 'footwear',
    categoryName: 'Footwear',
    price: 160,
    originalPrice: 190,
    rating: 4.6,
    reviewsCount: 154,
    badge: 'Eco',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=700&q=80',
    description: 'Zero-seam recycled engineered knit upper with bio-based high rebound nitrogen-infused foam midsole. Weightless cushion for all-day velocity.',
    colors: ['#f8fafc', '#111215'],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    inStock: true
  },
  {
    id: 'aura-10',
    title: 'MagSafe Dual Charger Deck',
    category: 'tech',
    categoryName: 'Tech',
    price: 110,
    originalPrice: 130,
    rating: 4.7,
    reviewsCount: 119,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=700&q=80',
    description: 'Precision CNC weighted base with soft-touch micro-suction silicone. Simultaneous 15W high-speed wireless charging for smartphone and wireless earphones.',
    colors: ['#111215', '#f8fafc'],
    sizes: ['Standard'],
    inStock: true
  },
  {
    id: 'aura-11',
    title: 'Pro In-Ear Monitor Monolith',
    category: 'audio',
    categoryName: 'Audio',
    price: 210,
    originalPrice: 250,
    rating: 4.8,
    reviewsCount: 97,
    badge: 'Hi-Res',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80',
    description: 'Dual balanced armature plus 10mm graphene dynamic driver hybrid design. Detachable 8-core silver-plated copper MMCX braided audio cable.',
    colors: ['#111215', '#717d91'],
    sizes: ['Standard'],
    inStock: true
  },
  {
    id: 'aura-12',
    title: 'Minimalist Matte Thermal Flask',
    category: 'living',
    categoryName: 'Living',
    price: 48,
    originalPrice: 60,
    rating: 4.9,
    reviewsCount: 340,
    badge: 'Essential',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80',
    description: 'Triple-wall vacuum insulated 18/8 medical grade stainless steel. Keeps beverages cold for 24 hours or steaming hot for 12 hours without condensation.',
    colors: ['#111215', '#ffffff'],
    sizes: ['500ml', '750ml'],
    inStock: true
  }
];

class Store {
  constructor() {
    this.products = (typeof STORE_DATA !== 'undefined' && STORE_DATA.products) ? STORE_DATA.products : PRODUCTS_DATA;
    this.cart = this.load('aura_cart', []);
    this.wishlist = new Set(this.load('aura_wishlist', []));
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.sortBy = 'featured';
    this.activeNavTab = 'home';
    this.promoDiscount = 0; 
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage quota exceeded or private mode');
    }
  }

  
  addToCart(productId, quantity = 1, options = {}) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const color = options.color || product.colors[0];
    const size = options.size || product.sizes[0];

    const existingIndex = this.cart.findIndex(
      item => item.id === productId && item.selectedColor === color && item.selectedSize === size
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: productId,
        quantity,
        selectedColor: color,
        selectedSize: size
      });
    }

    this.save('aura_cart', this.cart);
    return product;
  }

  updateCartQty(index, delta) {
    if (!this.cart[index]) return;
    this.cart[index].quantity += delta;
    if (this.cart[index].quantity <= 0) {
      this.cart.splice(index, 1);
    }
    this.save('aura_cart', this.cart);
  }

  removeFromCart(index) {
    if (!this.cart[index]) return;
    this.cart.splice(index, 1);
    this.save('aura_cart', this.cart);
  }

  clearCart() {
    this.cart = [];
    this.save('aura_cart', this.cart);
  }

  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartTotals() {
    let subtotal = 0;
    this.cart.forEach(item => {
      const prod = this.products.find(p => p.id === item.id);
      if (prod) {
        subtotal += prod.price * item.quantity;
      }
    });

    const discount = (subtotal * this.promoDiscount) / 100;
    const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
    const total = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal,
      discount,
      shipping,
      total
    };
  }

  
  toggleWishlist(productId) {
    const exists = this.wishlist.has(productId);
    if (exists) {
      this.wishlist.delete(productId);
    } else {
      this.wishlist.add(productId);
    }
    this.save('aura_wishlist', Array.from(this.wishlist));
    return !exists;
  }

  isWishlisted(productId) {
    return this.wishlist.has(productId);
  }
}

const AppStore = new Store();

const DOM = {
  
  bottomNavTabs: document.querySelectorAll('.pill-tab'),
  navCartBadge: document.getElementById('navCartBadge'),
  headerCartBadge: document.getElementById('headerCartBadge'),
  headerWishlistBadge: document.getElementById('headerWishlistBadge'),
  headerCartBtn: document.getElementById('headerCartBtn'),
  headerWishlistBtn: document.getElementById('headerWishlistBtn'),
  adminModal: document.getElementById('adminModal'),
  adminCloseBtn: document.getElementById('adminCloseBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  searchInput: document.getElementById('searchInput'),
  searchClearBtn: document.getElementById('searchClearBtn'),

  
  categoryPills: document.querySelectorAll('.cat-pill'),
  sortSelect: document.getElementById('sortSelect'),
  resultsCount: document.getElementById('resultsCount'),
  productGrid: document.getElementById('productGrid'),

  
  overlay: document.getElementById('overlay'),
  cartDrawer: document.getElementById('cartDrawer'),
  cartCloseBtn: document.getElementById('cartCloseBtn'),
  cartItemsList: document.getElementById('cartItemsList'),
  cartSubtotal: document.getElementById('cartSubtotal'),
  cartShipping: document.getElementById('cartShipping'),
  cartDiscount: document.getElementById('cartDiscount'),
  cartDiscountRow: document.getElementById('cartDiscountRow'),
  cartTotal: document.getElementById('cartTotal'),
  drawerCount: document.getElementById('drawerCount'),
  promoInput: document.getElementById('promoInput'),
  promoApplyBtn: document.getElementById('promoApplyBtn'),
  checkoutTriggerBtn: document.getElementById('checkoutTriggerBtn'),

  
  quickViewModal: document.getElementById('quickViewModal'),
  quickViewCloseBtn: document.getElementById('quickViewCloseBtn'),
  quickViewContent: document.getElementById('quickViewContent'),

  
  checkoutModal: document.getElementById('checkoutModal'),
  checkoutCloseBtn: document.getElementById('checkoutCloseBtn'),
  checkoutForm: document.getElementById('checkoutForm'),
  confirmPayBtn: document.getElementById('confirmPayBtn'),
  orderSuccessScreen: document.getElementById('orderSuccessScreen'),
  orderTrackingNum: document.getElementById('orderTrackingNum'),
  continueShoppingBtn: document.getElementById('continueShoppingBtn'),

  
  wishlistModal: document.getElementById('wishlistModal'),
  wishlistCloseBtn: document.getElementById('wishlistCloseBtn'),
  wishlistItemsList: document.getElementById('wishlistItemsList'),

  
  profileModal: document.getElementById('profileModal'),
  profileCloseBtn: document.getElementById('profileCloseBtn'),

  
  toastContainer: document.getElementById('toastContainer')
};

function getFilteredProducts() {
  let list = [...AppStore.products];

  
  if (AppStore.activeCategory !== 'all') {
    list = list.filter(item => item.category === AppStore.activeCategory);
  }

  
  if (AppStore.searchQuery.trim() !== '') {
    const q = AppStore.searchQuery.toLowerCase().trim();
    list = list.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) ||
      item.categoryName.toLowerCase().includes(q)
    );
  }

  
  if (AppStore.sortBy === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (AppStore.sortBy === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (AppStore.sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

function getCategorySvg(category) {
  const svgs = {
    audio: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="30" fill="%23e6ecf4"/><path d="M60 110 A40 40 0 0 1 140 110 V140 A10 10 0 0 1 130 150 H120 A10 10 0 0 1 110 140 V120 A10 10 0 0 1 120 110 H135 A35 35 0 0 0 65 110 H80 A10 10 0 0 1 90 120 V140 A10 10 0 0 1 80 150 H70 A10 10 0 0 1 60 140 Z" fill="%23111215"/></svg>',
    timepieces: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="30" fill="%23e6ecf4"/><rect x="85" y="25" width="30" height="150" rx="6" fill="%2322252a"/><circle cx="100" cy="100" r="48" fill="%23111215"/><circle cx="100" cy="100" r="40" fill="%23e6ecf4"/><line x1="100" y1="100" x2="100" y2="75" stroke="%23111215" stroke-width="3" stroke-linecap="round"/><line x1="100" y1="100" x2="120" y2="100" stroke="%23111215" stroke-width="2.5" stroke-linecap="round"/><circle cx="100" cy="100" r="4" fill="%23111215"/></svg>',
    footwear: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="30" fill="%23e6ecf4"/><path d="M40 135 C55 135 70 130 90 115 C115 95 135 90 160 110 C165 115 168 125 165 135 Z" fill="%23111215"/><rect x="35" y="135" width="135" height="14" rx="7" fill="%2322252a"/></svg>',
    living: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="30" fill="%23e6ecf4"/><path d="M70 70 H130 V145 A10 10 0 0 1 120 155 H80 A10 10 0 0 1 70 145 Z" fill="%23111215"/><circle cx="100" cy="45" r="8" fill="%23111215"/></svg>',
    tech: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="30" fill="%23e6ecf4"/><rect x="40" y="65" width="120" height="70" rx="10" fill="%23111215"/><rect x="50" y="75" width="20" height="14" rx="3" fill="%233a3f47"/><rect x="75" y="75" width="20" height="14" rx="3" fill="%233a3f47"/><rect x="100" y="75" width="20" height="14" rx="3" fill="%233a3f47"/><rect x="125" y="75" width="20" height="14" rx="3" fill="%233a3f47"/></svg>'
  };
  return svgs[category] || svgs.audio;
}

function renderProductGrid() {
  const products = getFilteredProducts();

  if (DOM.resultsCount) {
    DOM.resultsCount.textContent = `Showing ${products.length} monochrome objects`;
  }

  if (products.length === 0) {
    DOM.productGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <h3 style="font-size: 1.3rem; margin-bottom: 8px; font-weight: 800;">No Objects Found</h3>
        <p style="color: var(--gray-muted); max-width: 360px; margin: 0 auto 20px;">
          We couldn't find any products matching "${AppStore.searchQuery}". Try selecting another category or resetting filters.
        </p>
        <button class="nm-btn" id="resetFilterBtn">Reset Search & Filters</button>
      </div>
    `;
    const resetBtn = document.getElementById('resetFilterBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        AppStore.searchQuery = '';
        AppStore.activeCategory = 'all';
        if (DOM.searchInput) DOM.searchInput.value = '';
        DOM.categoryPills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
        renderProductGrid();
      });
    }
    return;
  }

  DOM.productGrid.innerHTML = products.map(product => {
    const isSaved = AppStore.isWishlisted(product.id);
    return `
      <article class="product-card" data-id="${product.id}">
        <div class="card-top">
          <span class="card-tag">${product.badge}</span>
          <button class="wishlist-btn ${isSaved ? 'active' : ''}" 
                  data-action="wishlist" 
                  data-id="${product.id}" 
                  aria-label="Save to Wishlist"
                  title="${isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}">
            <svg viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <div class="product-img-frame" data-action="quickview" data-id="${product.id}">
          <img src="${product.image}" 
               alt="${product.title}" 
               class="product-thumb" 
               loading="lazy" 
               onerror="this.onerror=null; this.src=getCategorySvg('${product.category}');" />
          <div class="quick-view-overlay">Quick Inspect</div>
        </div>

        <div class="product-category">${product.categoryName}</div>
        <h3 class="product-title" data-action="quickview" data-id="${product.id}">${product.title}</h3>

        <div class="product-rating">
          <span class="stars">★★★★★</span>
          <span><strong>${product.rating}</strong></span>
          <span class="rating-count">(${product.reviewsCount})</span>
        </div>

        <div class="card-bottom">
          <div class="product-price">
            ${product.originalPrice ? `<span class="price-original">$${product.originalPrice}</span>` : ''}
            <span class="price-current">$${product.price}</span>
          </div>

          <button class="add-cart-btn" 
                  data-action="add-cart" 
                  data-id="${product.id}" 
                  aria-label="Add ${product.title} to Cart" 
                  title="Add to Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function updateBadges() {
  const cartCount = AppStore.getCartCount();
  const wishCount = AppStore.wishlist.size;

  if (DOM.navCartBadge) {
    DOM.navCartBadge.textContent = cartCount;
    DOM.navCartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
  }

  if (DOM.headerCartBadge) {
    DOM.headerCartBadge.textContent = cartCount;
    DOM.headerCartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
  }

  if (DOM.headerWishlistBadge) {
    DOM.headerWishlistBadge.textContent = wishCount;
    DOM.headerWishlistBadge.style.display = wishCount > 0 ? 'flex' : 'none';
  }

  if (DOM.drawerCount) {
    DOM.drawerCount.textContent = `${cartCount} Items`;
  }
}

function renderCartDrawer() {
  updateBadges();

  if (AppStore.cart.length === 0) {
    DOM.cartItemsList.innerHTML = `
      <div style="text-align: center; padding: 48px 0; color: var(--gray-muted);">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--bg-primary); box-shadow: var(--nm-shadow-pressed); margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h4 style="font-weight: 700; color: var(--black-primary); margin-bottom: 6px;">Your Bag is Empty</h4>
        <p style="font-size: 0.85rem; max-width: 220px; margin: 0 auto;">Discover the minimalist collection and elevate your daily carry.</p>
      </div>
    `;
    DOM.checkoutTriggerBtn.disabled = true;
    DOM.checkoutTriggerBtn.style.opacity = '0.5';
    DOM.checkoutTriggerBtn.style.pointerEvents = 'none';
  } else {
    DOM.checkoutTriggerBtn.disabled = false;
    DOM.checkoutTriggerBtn.style.opacity = '1';
    DOM.checkoutTriggerBtn.style.pointerEvents = 'auto';

    DOM.cartItemsList.innerHTML = AppStore.cart.map((item, index) => {
      const product = AppStore.products.find(p => p.id === item.id);
      if (!product) return '';

      return `
        <div class="cart-item">
          <div class="cart-item-img-well">
            <img src="${product.image}" alt="${product.title}" class="cart-item-img" onerror="this.onerror=null; this.src=getCategorySvg('${product.category}');" />
          </div>
          
          <div class="cart-item-details">
            <h4 class="cart-item-title">${product.title}</h4>
            <div class="cart-item-meta">
              <span>${item.selectedSize || 'Standard'}</span> • 
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${item.selectedColor}; vertical-align:middle; border:1px solid #ccc;"></span>
            </div>
            <div class="cart-item-price">$${product.price}</div>
          </div>

          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
            <button class="cart-item-remove" data-action="remove-cart" data-index="${index}" aria-label="Remove item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>

            <div class="qty-stepper">
              <button class="qty-btn" data-action="qty-minus" data-index="${index}" aria-label="Decrease quantity">-</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" data-action="qty-plus" data-index="${index}" aria-label="Increase quantity">+</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  
  const totals = AppStore.getCartTotals();
  if (DOM.cartSubtotal) DOM.cartSubtotal.textContent = `$${totals.subtotal.toFixed(2)}`;
  if (DOM.cartShipping) DOM.cartShipping.textContent = totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`;
  if (DOM.cartTotal) DOM.cartTotal.textContent = `$${totals.total.toFixed(2)}`;

  if (DOM.cartDiscountRow) {
    if (totals.discount > 0) {
      DOM.cartDiscountRow.style.display = 'flex';
      DOM.cartDiscount.textContent = `-$${totals.discount.toFixed(2)} (${AppStore.promoDiscount}%)`;
    } else {
      DOM.cartDiscountRow.style.display = 'none';
    }
  }
}

function renderQuickViewModal(productId) {
  const product = AppStore.products.find(p => p.id === productId);
  if (!product) return;

  const isSaved = AppStore.isWishlisted(product.id);

  DOM.quickViewContent.innerHTML = `
    <div class="modal-content-grid">
      <div class="modal-img-well">
        <img src="${product.image}" alt="${product.title}" class="modal-img" onerror="this.onerror=null; this.src=getCategorySvg('${product.category}');" />
      </div>

      <div class="modal-details">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span class="card-tag">${product.badge}</span>
          <span style="font-size: 0.8rem; font-weight: 700; color: ${product.inStock ? 'var(--black-primary)' : 'var(--danger)'};">
            ${product.inStock ? '● In Stock • Ready to dispatch' : '○ Temporarily Reserved'}
          </span>
        </div>

        <h2 class="modal-title">${product.title}</h2>

        <div class="modal-price-row">
          <span class="modal-price">$${product.price}</span>
          ${product.originalPrice ? `<span class="price-original" style="font-size: 1.1rem;">$${product.originalPrice}</span>` : ''}
          <div class="product-rating" style="margin: 0 0 0 12px;">
            <span class="stars">★★★★★</span>
            <span><strong>${product.rating}</strong></span>
          </div>
        </div>

        <p class="modal-desc">${product.description}</p>

        <!-- Color Swatches -->
        <div>
          <div class="modal-option-label">Finish / Shade</div>
          <div class="swatch-group" id="quickColorSwatches">
            ${product.colors.map((c, i) => `
              <div class="color-swatch ${i === 0 ? 'active' : ''}" 
                   data-color="${c}" 
                   style="background: ${c}; border: 2px solid #ccc;" 
                   title="${c}"></div>
            `).join('')}
          </div>
        </div>

        <!-- Size / Variant -->
        <div>
          <div class="modal-option-label">Specification / Size</div>
          <div class="swatch-group" id="quickSizePills">
            ${product.sizes.map((s, i) => `
              <div class="size-pill ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</div>
            `).join('')}
          </div>
        </div>

        <!-- Action Row -->
        <div style="display: flex; align-items: center; gap: 14px; margin-top: 14px;">
          <div class="qty-stepper" style="padding: 6px 14px;">
            <button class="qty-btn" id="modalQtyMinus">-</button>
            <span class="qty-value" id="modalQtyVal" style="font-size: 1rem; min-width: 24px;">1</span>
            <button class="qty-btn" id="modalQtyPlus">+</button>
          </div>

          <button class="nm-btn-black" id="modalAddToCartBtn" style="flex: 1; padding: 14px 24px;">
            Add to Bag • $${product.price}
          </button>

          <button class="wishlist-btn ${isSaved ? 'active' : ''}" 
                  id="modalWishlistBtn" 
                  style="width: 48px; height: 48px;" 
                  aria-label="Save to Wishlist">
            <svg viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  
  let currentQty = 1;
  let selectedColor = product.colors[0];
  let selectedSize = product.sizes[0];

  const qtyMinus = document.getElementById('modalQtyMinus');
  const qtyPlus = document.getElementById('modalQtyPlus');
  const qtyVal = document.getElementById('modalQtyVal');
  const addBtn = document.getElementById('modalAddToCartBtn');
  const wishBtn = document.getElementById('modalWishlistBtn');

  const swatches = document.querySelectorAll('#quickColorSwatches .color-swatch');
  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      selectedColor = sw.dataset.color;
    });
  });

  const sizes = document.querySelectorAll('#quickSizePills .size-pill');
  sizes.forEach(sp => {
    sp.addEventListener('click', () => {
      sizes.forEach(s => s.classList.remove('active'));
      sp.classList.add('active');
      selectedSize = sp.dataset.size;
    });
  });

  qtyMinus.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty--;
      qtyVal.textContent = currentQty;
      addBtn.textContent = `Add to Bag • $${(product.price * currentQty).toFixed(2)}`;
    }
  });

  qtyPlus.addEventListener('click', () => {
    currentQty++;
    qtyVal.textContent = currentQty;
    addBtn.textContent = `Add to Bag • $${(product.price * currentQty).toFixed(2)}`;
  });

  addBtn.addEventListener('click', () => {
    AppStore.addToCart(product.id, currentQty, { color: selectedColor, size: selectedSize });
    renderCartDrawer();
    closeAllModals();
    showToast(`Added ${currentQty} × ${product.title} to your bag`);
    openCartDrawer();
  });

  wishBtn.addEventListener('click', () => {
    const isNowSaved = AppStore.toggleWishlist(product.id);
    wishBtn.classList.toggle('active', isNowSaved);
    const svg = wishBtn.querySelector('svg');
    svg.setAttribute('fill', isNowSaved ? 'currentColor' : 'none');
    renderProductGrid();
    updateBadges();
    showToast(isNowSaved ? `Added to your wishlist` : `Removed from wishlist`);
  });

  openModal(DOM.quickViewModal);
}

function renderWishlistModal() {
  const items = Array.from(AppStore.wishlist).map(id => AppStore.products.find(p => p.id === id)).filter(Boolean);

  if (items.length === 0) {
    DOM.wishlistItemsList.innerHTML = `
      <div style="text-align: center; padding: 40px 0; color: var(--gray-muted);">
        <p style="font-size: 1.1rem; font-weight: 700; color: var(--black-primary); margin-bottom: 8px;">No Saved Items</p>
        <p style="font-size: 0.85rem;">Click the heart icon on any monochrome design to pin it to your wishlist.</p>
      </div>
    `;
  } else {
    DOM.wishlistItemsList.innerHTML = items.map(item => `
      <div class="cart-item">
        <div class="cart-item-img-well">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <span class="cart-item-price">$${item.price}</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="nm-btn" style="padding: 8px 14px; font-size: 0.8rem;" data-action="wishlist-to-cart" data-id="${item.id}">
            Add to Bag
          </button>
          <button class="cart-item-remove" data-action="remove-wishlist" data-id="${item.id}" aria-label="Remove">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  openModal(DOM.wishlistModal);
}

function showToast(message, type = 'info') {
  if (!DOM.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3200);
}

function openCartDrawer() {
  renderCartDrawer();
  DOM.overlay.classList.add('open');
  DOM.cartDrawer.classList.add('open');
  document.body.classList.add('cart-open');
  setActiveNavPill('cart');
}

function closeCartDrawer() {
  DOM.cartDrawer.classList.remove('open');
  DOM.overlay.classList.remove('open');
  document.body.classList.remove('cart-open');
  setActiveNavPill('home');
}

function openModal(modalEl) {
  DOM.overlay.classList.add('open');
  modalEl.classList.add('open');
}

function closeAllModals() {
  DOM.overlay.classList.remove('open');
  document.body.classList.remove('cart-open');
  if (DOM.cartDrawer) DOM.cartDrawer.classList.remove('open');
  if (DOM.quickViewModal) DOM.quickViewModal.classList.remove('open');
  if (DOM.checkoutModal) DOM.checkoutModal.classList.remove('open');
  if (DOM.wishlistModal) DOM.wishlistModal.classList.remove('open');
  if (DOM.profileModal) DOM.profileModal.classList.remove('open');
  setActiveNavPill('home');
}

function setActiveNavPill(tabId) {
  AppStore.activeNavTab = tabId;
  DOM.bottomNavTabs.forEach(tab => {
    const isTarget = tab.dataset.tab === tabId;
    tab.classList.toggle('active', isTarget);
  });
}

function initEventListeners() {
  
  DOM.bottomNavTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      setActiveNavPill(target);

      if (target === 'home') {
        closeAllModals();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (target === 'shop') {
        closeAllModals();
        const gridSection = document.getElementById('catalogSection');
        if (gridSection) {
          gridSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (target === 'wishlist') {
        closeAllModals();
        renderWishlistModal();
      } else if (target === 'cart') {
        closeAllModals();
        openCartDrawer();
      } else if (target === 'profile') {
        closeAllModals();
        openModal(DOM.profileModal);
      } else if (target === 'admin') {
        closeAllModals();
        openModal(DOM.adminModal);
        renderAdminPanel();
      }
    });
  });

  
  if (DOM.headerCartBtn) DOM.headerCartBtn.addEventListener('click', openCartDrawer);
  if (DOM.cartCloseBtn) DOM.cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (DOM.headerWishlistBtn) DOM.headerWishlistBtn.addEventListener('click', renderWishlistModal);
  if (DOM.overlay) DOM.overlay.addEventListener('click', closeAllModals);

  
  if (DOM.quickViewCloseBtn) DOM.quickViewCloseBtn.addEventListener('click', closeAllModals);
  if (DOM.checkoutCloseBtn) DOM.checkoutCloseBtn.addEventListener('click', closeAllModals);
  if (DOM.wishlistCloseBtn) DOM.wishlistCloseBtn.addEventListener('click', closeAllModals);
  if (DOM.profileCloseBtn) DOM.profileCloseBtn.addEventListener('click', closeAllModals);
  if (DOM.adminCloseBtn) DOM.adminCloseBtn.addEventListener('click', closeAllModals);

  
  DOM.categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      DOM.categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppStore.activeCategory = pill.dataset.category;
      renderProductGrid();
    });
  });

  
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', (e) => {
      AppStore.searchQuery = e.target.value;
      if (DOM.searchClearBtn) {
        DOM.searchClearBtn.classList.toggle('visible', e.target.value.length > 0);
      }
      renderProductGrid();
    });
  }

  if (DOM.searchClearBtn) {
    DOM.searchClearBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      AppStore.searchQuery = '';
      DOM.searchClearBtn.classList.remove('visible');
      renderProductGrid();
      DOM.searchInput.focus();
    });
  }


  DOM.productGrid.addEventListener('click', (e) => {
    const target = e.target;

    
    const wishBtn = target.closest('[data-action="wishlist"]');
    if (wishBtn) {
      const id = wishBtn.dataset.id;
      const isNowSaved = AppStore.toggleWishlist(id);
      wishBtn.classList.toggle('active', isNowSaved);
      const svg = wishBtn.querySelector('svg');
      svg.setAttribute('fill', isNowSaved ? 'currentColor' : 'none');
      updateBadges();
      showToast(isNowSaved ? 'Added to your wishlist' : 'Removed from wishlist');
      return;
    }

    
    const addBtn = target.closest('[data-action="add-cart"]');
    if (addBtn) {
      const id = addBtn.dataset.id;
      const product = AppStore.addToCart(id, 1);
      
      
      addBtn.classList.add('added');
      setTimeout(() => addBtn.classList.remove('added'), 700);

      renderCartDrawer();
      showToast(`Added ${product.title} to your bag`);
      return;
    }

    
    const quickEl = target.closest('[data-action="quickview"]');
    if (quickEl) {
      const id = quickEl.dataset.id;
      renderQuickViewModal(id);
    }
  });

  
  DOM.cartItemsList.addEventListener('click', (e) => {
    const target = e.target;

    const plusBtn = target.closest('[data-action="qty-plus"]');
    if (plusBtn) {
      const index = parseInt(plusBtn.dataset.index, 10);
      AppStore.updateCartQty(index, 1);
      renderCartDrawer();
      return;
    }

    const minusBtn = target.closest('[data-action="qty-minus"]');
    if (minusBtn) {
      const index = parseInt(minusBtn.dataset.index, 10);
      AppStore.updateCartQty(index, -1);
      renderCartDrawer();
      return;
    }

    const removeBtn = target.closest('[data-action="remove-cart"]');
    if (removeBtn) {
      const index = parseInt(removeBtn.dataset.index, 10);
      AppStore.removeFromCart(index);
      renderCartDrawer();
      showToast('Item removed from bag');
    }
  });

  
  if (DOM.wishlistItemsList) {
    DOM.wishlistItemsList.addEventListener('click', (e) => {
      const target = e.target;

      const addToCartBtn = target.closest('[data-action="wishlist-to-cart"]');
      if (addToCartBtn) {
        const id = addToCartBtn.dataset.id;
        AppStore.addToCart(id, 1);
        renderCartDrawer();
        showToast('Moved item to bag');
        return;
      }

      const removeBtn = target.closest('[data-action="remove-wishlist"]');
      if (removeBtn) {
        const id = removeBtn.dataset.id;
        AppStore.toggleWishlist(id);
        renderWishlistModal();
        renderProductGrid();
        updateBadges();
      }
    });
  }

  
  if (DOM.promoApplyBtn && DOM.promoInput) {
    DOM.promoApplyBtn.addEventListener('click', () => {
      const code = DOM.promoInput.value.trim().toUpperCase();
      if (code === 'AURA15' || code === 'MONO15') {
        AppStore.promoDiscount = 15;
        renderCartDrawer();
        showToast('Promo code AURA15 applied: 15% Off!');
      } else if (code === 'VIP25') {
        AppStore.promoDiscount = 25;
        renderCartDrawer();
        showToast('VIP Promo applied: 25% Off entire order!');
      } else if (code === '') {
        showToast('Please enter a promo code');
      } else {
        showToast('Invalid promo code');
      }
    });
  }

  
  if (DOM.checkoutTriggerBtn) {
    DOM.checkoutTriggerBtn.addEventListener('click', () => {
      closeCartDrawer();
      openModal(DOM.checkoutModal);
    });
  }

  
  const payPills = document.querySelectorAll('.pay-card-pill');
  payPills.forEach(pill => {
    pill.addEventListener('click', () => {
      payPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  
  if (DOM.checkoutForm) {
    DOM.checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = DOM.confirmPayBtn;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Processing Order...</span>`;
      submitBtn.style.opacity = '0.7';
      submitBtn.disabled = true;

      setTimeout(() => {
        
        DOM.checkoutForm.style.display = 'none';
        DOM.orderSuccessScreen.style.display = 'block';
        if (DOM.orderTrackingNum) {
          DOM.orderTrackingNum.textContent = `AURA-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`;
        }
        AppStore.clearCart();
        renderCartDrawer();
        submitBtn.innerHTML = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
        showToast('Payment successful! Your order has been placed.');
      }, 1200);
    });
  }

  if (DOM.continueShoppingBtn) {
    DOM.continueShoppingBtn.addEventListener('click', () => {
      closeAllModals();
      if (DOM.checkoutForm) DOM.checkoutForm.style.display = 'flex';
      if (DOM.orderSuccessScreen) DOM.orderSuccessScreen.style.display = 'none';
    });
  }

  
  if (DOM.themeToggleBtn) {
    DOM.themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      DOM.themeToggleBtn.classList.toggle('active', isDark);
      localStorage.setItem('aura_theme', isDark ? 'dark' : 'light');
      showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
    });

    
    const savedTheme = localStorage.getItem('aura_theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      DOM.themeToggleBtn.classList.add('active');
    }
  }

  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProductGrid();
  renderCartDrawer();
  initEventListeners();
  console.log('⚡ AURA Monochrome Neumorphic Store loaded successfully.');
});

function renderAdminPanel() {
  renderAdminProducts();
  renderAdminOrders();
  renderAdminInventory();
  renderAdminCustomers();
  renderAdminAnalytics();
  renderAdminDiscounts();

  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('admin-' + tab.dataset.admin);
      if (panel) panel.classList.add('active');
    });
  });
}

function renderAdminProducts() {
  const tbody = document.getElementById('adminProductBody');
  if (!tbody) return;
  const products = (window.STORE_DATA && window.STORE_DATA.products) || AppStore.products || [];
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>#${p.id}</td>
      <td>${p.name || p.title}</td>
      <td>${p.category}</td>
      <td>$${Number(p.price).toFixed(2)}</td>
      <td>${p.stock !== undefined ? p.stock : 'N/A'}</td>
      <td>
        <button class="admin-action-btn" onclick="alert('Edit product - connect to your backend')">Edit</button>
        <button class="admin-action-btn danger" onclick="alert('Delete product - connect to your backend')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderAdminOrders() {
  const tbody = document.getElementById('adminOrderBody');
  if (!tbody) return;
  const mockOrders = [
    { id: 'AURA-2026-0047', customer: 'Alexander Vance', items: 2, total: 598, status: 'shipped' },
    { id: 'AURA-2026-0031', customer: 'Jordan Blake', items: 1, total: 299, status: 'delivered' },
    { id: 'AURA-2026-0058', customer: 'Morgan Lee', items: 3, total: 874, status: 'pending' },
    { id: 'AURA-2026-0063', customer: 'Casey Quinn', items: 1, total: 199, status: 'pending' },
  ];
  tbody.innerHTML = mockOrders.map(o => `
    <tr>
      <td>#${o.id}</td>
      <td>${o.customer}</td>
      <td>${o.items}</td>
      <td>$${o.total.toFixed(2)}</td>
      <td><span class="admin-status-badge status-${o.status}">${o.status}</span></td>
      <td>
        <select class="admin-status-select" onchange="alert('Status updated - connect to your backend')">
          <option ${o.status === 'pending' ? 'selected' : ''}>pending</option>
          <option ${o.status === 'shipped' ? 'selected' : ''}>shipped</option>
          <option ${o.status === 'delivered' ? 'selected' : ''}>delivered</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function renderAdminInventory() {
  const tbody = document.getElementById('adminInventoryBody');
  if (!tbody) return;
  const products = (window.STORE_DATA && window.STORE_DATA.products) || AppStore.products || [];
  tbody.innerHTML = products.map(p => {
    const stock = p.stock !== undefined ? p.stock : 10;
    const low = stock < 5;
    return `
      <tr>
        <td>${p.name || p.title}</td>
        <td>${p.category}</td>
        <td>${stock}</td>
        <td><span class="admin-status-badge ${low ? 'status-low' : 'status-ok'}">${low ? 'Low Stock' : 'In Stock'}</span></td>
      </tr>`;
  }).join('');
}

function renderAdminCustomers() {
  const tbody = document.getElementById('adminCustomerBody');
  if (!tbody) return;
  const mockCustomers = [
    { name: 'Alexander Vance', email: 'alexander@aura-mono.com', orders: 2, tier: 'Black', joined: 'Jan 2025' },
    { name: 'Jordan Blake', email: 'jordan@email.com', orders: 1, tier: 'Silver', joined: 'Mar 2025' },
    { name: 'Morgan Lee', email: 'morgan@email.com', orders: 3, tier: 'Gold', joined: 'Jun 2024' },
    { name: 'Casey Quinn', email: 'casey@email.com', orders: 1, tier: 'Silver', joined: 'Sep 2025' },
  ];
  tbody.innerHTML = mockCustomers.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.orders}</td>
      <td>${c.tier}</td>
      <td>${c.joined}</td>
    </tr>
  `).join('');
}

function renderAdminAnalytics() {
  const products = (window.STORE_DATA && window.STORE_DATA.products) || AppStore.products || [];
  const mockRevenue = 2469.00;
  const mockOrders = 4;
  if (document.getElementById('analyticsRevenue')) document.getElementById('analyticsRevenue').textContent = '$' + mockRevenue.toFixed(2);
  if (document.getElementById('analyticsOrders')) document.getElementById('analyticsOrders').textContent = mockOrders;
  if (document.getElementById('analyticsAvg')) document.getElementById('analyticsAvg').textContent = '$' + (mockRevenue / mockOrders).toFixed(2);
  if (document.getElementById('analyticsProducts')) document.getElementById('analyticsProducts').textContent = products.length;

  const topEl = document.getElementById('analyticsTopProducts');
  if (!topEl) return;
  const top = products.slice(0, 5);
  const maxPrice = Math.max(...top.map(p => p.price));
  topEl.innerHTML = top.map(p => `
    <div class="analytics-bar-row">
      <div class="analytics-bar-label">${p.name || p.title}</div>
      <div class="analytics-bar-track"><div class="analytics-bar-fill" style="width:${Math.round((p.price / maxPrice) * 100)}%"></div></div>
      <div class="analytics-bar-val">$${Number(p.price).toFixed(0)}</div>
    </div>
  `).join('');
}

function renderAdminDiscounts() {
  const tbody = document.getElementById('adminPromoBody');
  if (!tbody) return;
  const codes = AppStore.promoCodes || { AURA15: 0.15, VIP25: 0.25, MONO15: 0.15 };
  tbody.innerHTML = Object.entries(codes).map(([code, disc]) => `
    <tr>
      <td><strong>${code}</strong></td>
      <td>${Math.round(disc * 100)}% off</td>
      <td><span class="admin-status-badge status-ok">Active</span></td>
      <td>
        <button class="admin-action-btn danger" onclick="alert('Remove code - connect to your backend')">Remove</button>
      </td>
    </tr>
  `).join('');
}

(function initSortDropdown() {
  const trigger = document.getElementById('sortTrigger');
  const menu = document.getElementById('sortMenu');
  const label = document.getElementById('sortLabel');
  if (!trigger || !menu) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('.sort-option').forEach(opt => {
    opt.addEventListener('click', () => {
      menu.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      label.textContent = opt.textContent;
      AppStore.sortOrder = opt.dataset.value;
      menu.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      if (typeof renderProductGrid === 'function') renderProductGrid();
    });
  });

  document.addEventListener('click', () => {
    menu.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  });
})();
