const AppStore = new Store(window.STORE_DATA.products, window.localStorage);
const $ = id => document.getElementById(id);
const DOM = {
  productGrid: $('productGrid'), resultsCount: $('resultsCount'), searchInput: $('searchInput'), searchClearBtn: $('searchClearBtn'),
  navTabs: document.querySelectorAll('.site-nav-link'), navCartBadge: $('navCartBadge'), categoryPills: document.querySelectorAll('.cat-pill'),
  overlay: $('overlay'), cartDrawer: $('cartDrawer'), cartItemsList: $('cartItemsList'), drawerCount: $('drawerCount'),
  cartSubtotal: $('cartSubtotal'), cartDiscount: $('cartDiscount'), cartDiscountRow: $('cartDiscountRow'), cartShipping: $('cartShipping'), cartTotal: $('cartTotal'),
  promoInput: $('promoInput'), checkoutTriggerBtn: $('checkoutTriggerBtn'), quickViewModal: $('quickViewModal'), quickViewContent: $('quickViewContent'),
  wishlistModal: $('wishlistModal'), wishlistItemsList: $('wishlistItemsList'), checkoutModal: $('checkoutModal'), checkoutForm: $('checkoutForm'),
  orderSuccessScreen: $('orderSuccessScreen'), orderTrackingNum: $('orderTrackingNum'), profileModal: $('profileModal'), profileOrders: $('profileOrders'),
  adminModal: $('adminModal'), toastContainer: $('toastContainer'), themeNotice: $('themeNotice'), themeToggleBtn: $('themeToggleBtn'), themeToggleLabel: $('themeToggleLabel')
};

const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
const escapeHtml = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const titleCase = value => String(value || '').replace(/\b\w/g, char => char.toUpperCase());
const formatDate = value => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

function safeColor(color) {
  return /^#[0-9a-f]{3,8}$/i.test(String(color)) ? color : '#111215';
}

function validImageSource(value) {
  if (!value) return true;
  if (/^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value)) return true;
  if (/^https?:\/\//i.test(value)) {
    try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch (_) { return false; }
  }
  return !/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value) && !/[<>\s]/.test(value);
}

function getCategorySvg(category) {
  const shape = {
    audio: '<path d="M54 110a46 46 0 0 1 92 0v32a12 12 0 0 1-12 12h-10a12 12 0 0 1-12-12v-20a12 12 0 0 1 12-12h10a34 34 0 0 0-68 0h10a12 12 0 0 1 12 12v20a12 12 0 0 1-12 12H66a12 12 0 0 1-12-12z"/>',
    timepieces: '<rect x="84" y="20" width="32" height="160" rx="9"/><circle cx="100" cy="100" r="48"/><circle cx="100" cy="100" r="35" fill="#e6ecf4"/><path d="M100 76v24l18 10" stroke="#111215" stroke-width="5" fill="none"/>',
    footwear: '<path d="M35 130c28 0 40-13 58-26 22-15 44-13 69 9 6 5 7 13 5 19v10H35z"/>',
    living: '<path d="M66 60h68v85a14 14 0 0 1-14 14H80a14 14 0 0 1-14-14z"/><circle cx="100" cy="40" r="8"/>',
    tech: '<rect x="38" y="61" width="124" height="78" rx="12"/><path d="M55 80h90M55 98h90M70 117h60" stroke="#e6ecf4" stroke-width="7" stroke-linecap="round"/>'
  }[category] || '';
  return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="26" fill="#e6ecf4"/><g fill="#22252a">${shape}</g></svg>`);
}

function imageSource(product) {
  const source = String(product.image || '').trim();
  return source && validImageSource(source) ? source : getCategorySvg(product.category);
}

function productImage(product, className) {
  return `<img src="${escapeHtml(imageSource(product))}" alt="${escapeHtml(product.title)}" class="${className}" data-fallback-category="${escapeHtml(product.category || 'audio')}" loading="lazy">`;
}

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = `toast${isError ? ' toast-error' : ''}`;
  toast.textContent = message;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

let themeNoticeTimer;

function showThemeNotice(isDark) {
  clearTimeout(themeNoticeTimer);
  DOM.themeNotice.textContent = isDark ? 'Dark mode enabled' : 'Light mode enabled';
  DOM.themeNotice.classList.add('visible');
  themeNoticeTimer = setTimeout(() => DOM.themeNotice.classList.remove('visible'), 2600);
}

function attempt(action) {
  try { return action(); } catch (error) { showToast(error.message || 'Something went wrong.', true); return null; }
}

function getFilteredProducts() {
  let products = [...AppStore.products];
  if (AppStore.activeCategory !== 'all') products = products.filter(product => product.category === AppStore.activeCategory);
  const query = AppStore.searchQuery.trim().toLowerCase();
  if (query) products = products.filter(product => [product.title, product.description, product.categoryName, ...(product.tags || [])].some(value => String(value).toLowerCase().includes(query)));
  if (AppStore.sortBy === 'price-low') products.sort((a, b) => a.price - b.price);
  if (AppStore.sortBy === 'price-high') products.sort((a, b) => b.price - a.price);
  if (AppStore.sortBy === 'rating') products.sort((a, b) => b.rating - a.rating);
  return products;
}

function renderProductGrid() {
  const featured = AppStore.products.find(product => product.id === 'aura-01');
  $('featuredPriceChip').hidden = !featured;
  if (featured) $('featuredPrice').textContent = money(featured.price);
  const products = getFilteredProducts();
  DOM.resultsCount.textContent = `Showing ${products.length} ${products.length === 1 ? 'object' : 'objects'}`;
  if (!products.length) {
    DOM.productGrid.innerHTML = `<div class="empty-state"><div class="section-kicker">THE COLLECTION</div><h3>No objects found.</h3><p>There are no products matching your search.</p><button type="button" class="nm-btn" id="resetFilterBtn">Reset filters</button></div>`;
    $('resetFilterBtn').addEventListener('click', () => {
      AppStore.searchQuery = '';
      AppStore.activeCategory = 'all';
      DOM.searchInput.value = '';
      DOM.searchClearBtn.classList.remove('visible');
      updateCategories();
      renderProductGrid();
    });
    return;
  }
  DOM.productGrid.innerHTML = products.map(product => {
    const saved = AppStore.isWishlisted(product.id);
    const remaining = product.stock - AppStore.quantityInCart(product.id);
    const unavailable = product.stock === 0;
    const id = escapeHtml(product.id);
    return `<article class="product-card" data-id="${id}">
      <div class="card-top"><span class="card-tag">${escapeHtml(unavailable ? 'Out of stock' : (product.badge || 'Collection'))}</span>
        <button type="button" class="wishlist-btn${saved ? ' active' : ''}" data-action="wishlist" data-id="${id}" aria-pressed="${saved}" aria-label="${saved ? 'Remove' : 'Save'} ${escapeHtml(product.title)} ${saved ? 'from' : 'to'} wishlist"><span aria-hidden="true">${saved ? '♥' : '♡'}</span> ${saved ? 'Saved' : 'Save'}</button></div>
      <button type="button" class="product-img-frame" data-action="quickview" data-id="${id}" aria-label="View ${escapeHtml(product.title)}">${productImage(product, 'product-thumb')}</button>
      <div class="product-category">${escapeHtml(product.categoryName)}</div>
      <h3><button type="button" class="product-title" data-action="quickview" data-id="${id}">${escapeHtml(product.title)}</button></h3>
      <div class="product-rating">${product.rating ? `<span class="stars" aria-hidden="true">★★★★★</span><span><strong>${escapeHtml(product.rating)}</strong></span><span class="rating-count">(${escapeHtml(product.reviewsCount)})</span>` : '<span class="rating-count">New arrival</span>'}</div>
      <div class="card-bottom"><div class="product-price">${product.originalPrice && product.originalPrice > product.price ? `<span class="price-original">${money(product.originalPrice)}</span>` : ''}<span class="price-current">${money(product.price)}</span></div>
        <button type="button" class="add-cart-btn" data-action="add-cart" data-id="${id}" ${remaining <= 0 ? 'disabled' : ''}>${unavailable ? 'Out of stock' : remaining <= 0 ? 'In your bag' : 'Add to bag'}</button></div>
    </article>`;
  }).join('');
}

function updateCategories() {
  DOM.categoryPills.forEach(pill => {
    const active = pill.dataset.category === AppStore.activeCategory;
    pill.classList.toggle('active', active);
    pill.setAttribute('aria-pressed', String(active));
  });
}

function updateBadges() {
  const count = AppStore.getCartCount();
  DOM.navCartBadge.textContent = count;
  const bag = document.querySelector('[data-tab="cart"]');
  bag.setAttribute('aria-label', `Bag, ${count} ${count === 1 ? 'item' : 'items'}`);
  DOM.drawerCount.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
}

function renderCartDrawer() {
  updateBadges();
  if (!AppStore.cart.length) {
    DOM.cartItemsList.innerHTML = `<div class="cart-empty"><div class="empty-circle" aria-hidden="true">○</div><h3>Your bag is empty.</h3><p>Find something made for your everyday.</p></div>`;
  } else {
    DOM.cartItemsList.innerHTML = AppStore.cart.map((item, index) => {
      const product = AppStore.products.find(p => p.id === item.id);
      if (!product) return '';
      return `<div class="cart-item">
        <div class="cart-item-img-well">${productImage(product, 'cart-item-img')}</div>
        <div class="cart-item-details"><h3 class="cart-item-title">${escapeHtml(product.title)}</h3><div class="cart-item-meta">${escapeHtml(item.selectedSize)} <span aria-hidden="true">·</span> <span class="color-dot" style="background:${safeColor(item.selectedColor)}" aria-hidden="true"></span> ${escapeHtml(item.selectedColor)}</div><div class="cart-item-price">${money(product.price)}</div></div>
        <div class="cart-item-actions"><div class="qty-stepper" aria-label="Quantity"><button type="button" class="qty-btn" data-action="qty-minus" data-index="${index}" aria-label="Decrease quantity of ${escapeHtml(product.title)}">Decrease</button><span class="qty-value">${item.quantity}</span><button type="button" class="qty-btn" data-action="qty-plus" data-index="${index}" aria-label="Increase quantity of ${escapeHtml(product.title)}">Increase</button></div><button type="button" class="text-action danger-text" data-action="remove-cart" data-index="${index}" aria-label="Remove ${escapeHtml(product.title)} from bag">Remove</button></div>
      </div>`;
    }).join('');
  }
  DOM.checkoutTriggerBtn.disabled = !AppStore.cart.length;
  const totals = AppStore.getCartTotals();
  DOM.cartSubtotal.textContent = money(totals.subtotal);
  DOM.cartShipping.textContent = totals.shipping ? money(totals.shipping) : 'Free';
  DOM.cartTotal.textContent = money(totals.total);
  DOM.cartDiscountRow.hidden = !totals.promotion;
  $('promoRemoveBtn').hidden = !totals.promotion || totals.promotion.code !== AppStore.state.appliedPromo;
  if (totals.promotion) DOM.cartDiscount.textContent = `−${money(totals.discount)} (${totals.promotion.code})`;
  DOM.promoInput.value = totals.promotion && totals.promotion.code === AppStore.state.appliedPromo ? totals.promotion.code : '';
}

function renderQuickViewModal(productId) {
  const product = AppStore.products.find(p => p.id === productId);
  if (!product) return;
  const saved = AppStore.isWishlisted(product.id);
  let selectedColor = product.colors[0];
  let selectedSize = product.sizes[0];
  let quantity = 1;
  const available = Math.max(0, product.stock - AppStore.quantityInCart(product.id));
  DOM.quickViewContent.innerHTML = `<div class="modal-content-grid">
    <div class="modal-img-well">${productImage(product, 'modal-img')}</div>
    <div class="modal-details"><div class="section-kicker">${escapeHtml(product.categoryName)}</div><h2 class="modal-title">${escapeHtml(product.title)}</h2>
      <div class="modal-price-row"><span class="modal-price">${money(product.price)}</span>${product.originalPrice && product.originalPrice > product.price ? `<span class="price-original">${money(product.originalPrice)}</span>` : ''}</div>
      <p class="modal-desc">${escapeHtml(product.description)}</p>
      <div><div class="modal-option-label">Finish</div><div class="swatch-group" id="quickColorSwatches">${product.colors.map((color, index) => `<button type="button" class="color-swatch${index === 0 ? ' active' : ''}" data-color="${escapeHtml(color)}" aria-pressed="${index === 0}"><span class="color-dot" style="background:${safeColor(color)}" aria-hidden="true"></span>${escapeHtml(color)}</button>`).join('')}</div></div>
      <div><div class="modal-option-label">Size / specification</div><div class="swatch-group" id="quickSizePills">${product.sizes.map((size, index) => `<button type="button" class="size-pill${index === 0 ? ' active' : ''}" data-size="${escapeHtml(size)}" aria-pressed="${index === 0}">${escapeHtml(size)}</button>`).join('')}</div></div>
      <div class="quick-actions"><div class="qty-stepper"><button type="button" class="qty-btn" id="modalQtyMinus">Decrease</button><span class="qty-value" id="modalQtyVal">1</span><button type="button" class="qty-btn" id="modalQtyPlus">Increase</button></div><button type="button" class="wishlist-btn${saved ? ' active' : ''}" id="modalWishlistBtn" aria-pressed="${saved}"><span aria-hidden="true">${saved ? '♥' : '♡'}</span> ${saved ? 'Saved' : 'Save'}</button></div>
      <button type="button" class="checkout-btn" id="modalAddToCartBtn" ${available ? '' : 'disabled'}>${available ? `Add to bag · ${money(product.price)}` : product.stock ? 'In your bag' : 'Out of stock'}</button>
    </div></div>`;
  const addButton = $('modalAddToCartBtn');
  const updateAmount = () => { $('modalQtyVal').textContent = quantity; if (available) addButton.textContent = `Add to bag · ${money(product.price * quantity)}`; };
  $('modalQtyMinus').addEventListener('click', () => { quantity = Math.max(1, quantity - 1); updateAmount(); });
  $('modalQtyPlus').addEventListener('click', () => { if (quantity < available) quantity++; else showToast('No more of this item are available.', true); updateAmount(); });
  document.querySelectorAll('#quickColorSwatches .color-swatch').forEach(button => button.addEventListener('click', () => {
    selectedColor = button.dataset.color;
    document.querySelectorAll('#quickColorSwatches .color-swatch').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  }));
  document.querySelectorAll('#quickSizePills .size-pill').forEach(button => button.addEventListener('click', () => {
    selectedSize = button.dataset.size;
    document.querySelectorAll('#quickSizePills .size-pill').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  }));
  $('modalWishlistBtn').addEventListener('click', () => {
    const result = attempt(() => AppStore.toggleWishlist(product.id));
    if (result === null) return;
    const button = $('modalWishlistBtn');
    button.classList.toggle('active', result);
    button.setAttribute('aria-pressed', String(result));
    button.innerHTML = `<span aria-hidden="true">${result ? '♥' : '♡'}</span> ${result ? 'Saved' : 'Save'}`;
    renderProductGrid();
    showToast(result ? 'Saved to your wishlist' : 'Removed from your wishlist');
  });
  addButton.addEventListener('click', () => {
    const added = attempt(() => AppStore.addToCart(product.id, quantity, { color: selectedColor, size: selectedSize }));
    if (!added) return;
    renderProductGrid();
    renderCartDrawer();
    openLayer(DOM.cartDrawer);
    showToast(`${product.title} added to your bag`);
  });
  openLayer(DOM.quickViewModal);
}

function renderWishlistModal() {
  const items = AppStore.state.wishlist.map(id => AppStore.products.find(product => product.id === id)).filter(Boolean);
  DOM.wishlistItemsList.innerHTML = items.length ? items.map(product => `<div class="saved-item"><div class="cart-item-img-well">${productImage(product, 'cart-item-img')}</div><div class="cart-item-details"><h3 class="cart-item-title">${escapeHtml(product.title)}</h3><div class="cart-item-price">${money(product.price)}</div></div><div class="saved-actions"><button type="button" class="nm-btn compact" data-action="wishlist-to-cart" data-id="${escapeHtml(product.id)}" ${product.stock - AppStore.quantityInCart(product.id) <= 0 ? 'disabled' : ''}>Add to bag</button><button type="button" class="text-action danger-text" data-action="remove-wishlist" data-id="${escapeHtml(product.id)}">Remove</button></div></div>`).join('') : `<div class="list-empty"><h3>Nothing saved yet.</h3><p>Your saved objects will appear here.</p></div>`;
}

function renderProfile() {
  DOM.profileOrders.innerHTML = AppStore.orders.length ? AppStore.orders.map(order => {
    const count = (order.items || []).reduce((sum, item) => sum + item.quantity, 0);
    const names = (order.items || []).map(item => item.title).join(', ');
    return `<article class="profile-order"><div class="profile-order-top"><div><span class="profile-reference">${escapeHtml(order.reference)}</span><div class="profile-order-meta">${escapeHtml(formatDate(order.createdAt))} · ${count} ${count === 1 ? 'item' : 'items'}</div></div><span class="admin-status-badge status-${escapeHtml(order.status)}">${escapeHtml(titleCase(order.status))}</span></div><div class="profile-order-bottom"><span>${escapeHtml(names)}</span><strong>${money(order.total)}</strong></div></article>`;
  }).join('') : `<div class="list-empty"><h3>No orders yet.</h3><p>Your order references will appear here.</p></div>`;
}

let activeLayer = null;
let previousFocus = null;
let pageScrollY = 0;

function lockPage() {
  if (document.body.classList.contains('scroll-locked')) return;
  pageScrollY = window.scrollY;
  document.body.style.top = `-${pageScrollY}px`;
  document.body.classList.add('scroll-locked');
}

function unlockPage() {
  if (!document.body.classList.contains('scroll-locked')) return;
  document.body.classList.remove('scroll-locked');
  document.body.style.top = '';
  const previousBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, pageScrollY);
  document.documentElement.style.scrollBehavior = previousBehavior;
}

function setActiveNav(tabId) {
  DOM.navTabs.forEach(tab => {
    const active = tab.dataset.tab === tabId;
    tab.classList.toggle('active', active);
    if (active) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  });
}

function openLayer(layer) {
  DOM.toastContainer.replaceChildren();
  if (!activeLayer) previousFocus = document.activeElement;
  if (activeLayer) { activeLayer.classList.remove('open'); activeLayer.setAttribute('aria-hidden', 'true'); }
  activeLayer = layer;
  lockPage();
  DOM.overlay.classList.add('open');
  layer.classList.add('open');
  layer.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => layer.focus({ preventScroll: true }));
}

function closeAllModals() {
  if (!activeLayer) return;
  activeLayer.classList.remove('open');
  activeLayer.setAttribute('aria-hidden', 'true');
  activeLayer = null;
  DOM.overlay.classList.remove('open');
  unlockPage();
  setActiveNav('home');
  if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
  previousFocus = null;
}

function selectPayment(button) {
  document.querySelectorAll('.pay-card-pill').forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-checked', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
}

function renderAdminPanel() {
  renderAdminAnalytics();
  renderAdminProducts();
  renderAdminOrders();
  renderAdminInventory();
  renderAdminCustomers();
  renderAdminDiscounts();
}

function renderAdminProducts() {
  $('adminProductBody').innerHTML = AppStore.products.length ? AppStore.products.map(product => `<tr>
    <td data-label="Product"><div><strong>${escapeHtml(product.title)}</strong><span class="admin-subline">${escapeHtml((product.tags || []).join(' · ') || product.id)}</span></div></td>
    <td data-label="Category">${escapeHtml(product.categoryName)}</td><td data-label="Price">${money(product.price)}</td><td data-label="Stock">${product.stock}</td>
    <td data-label="Actions"><div class="admin-actions"><button type="button" class="admin-action-btn" data-admin-action="edit-product" data-id="${escapeHtml(product.id)}">Edit</button><button type="button" class="admin-action-btn danger" data-admin-action="delete-product" data-id="${escapeHtml(product.id)}">Delete</button></div></td>
  </tr>`).join('') : '<tr><td colspan="5" class="table-empty">No products yet.</td></tr>';
}

function renderAdminOrders() {
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  $('adminOrderBody').innerHTML = AppStore.orders.length ? AppStore.orders.map(order => {
    const count = order.items.reduce((sum, item) => sum + item.quantity, 0);
    return `<tr>
      <td data-label="Reference"><div><strong>${escapeHtml(order.reference)}</strong><span class="admin-subline">${escapeHtml(formatDate(order.createdAt))}</span></div></td>
      <td data-label="Customer"><div><strong>${escapeHtml(order.customer.name)}</strong><span class="admin-subline">${escapeHtml(order.customer.email)}</span></div></td>
      <td data-label="Items"><details class="order-items-details"><summary>${count} ${count === 1 ? 'item' : 'items'}</summary>${order.items.map(item => `<span>${escapeHtml(item.title)} × ${item.quantity}</span>`).join('')}</details></td>
      <td data-label="Total">${money(order.total)}</td>
      <td data-label="Status">${order.status === 'refunded' ? '<span class="admin-status-badge status-refunded">Refunded</span>' : `<select class="admin-status-select" data-admin-action="order-status" data-reference="${escapeHtml(order.reference)}" aria-label="Status for ${escapeHtml(order.reference)}">${statuses.map(status => `<option value="${status}" ${status === order.status ? 'selected' : ''}>${titleCase(status)}</option>`).join('')}</select>`}</td>
      <td data-label="Actions"><div class="admin-actions"><button type="button" class="admin-action-btn" data-admin-action="order-details" data-reference="${escapeHtml(order.reference)}">View details</button>${!['refunded', 'cancelled'].includes(order.status) ? `<button type="button" class="admin-action-btn danger" data-admin-action="refund" data-reference="${escapeHtml(order.reference)}">Record refund</button>` : ''}</div></td>
    </tr>`;
  }).join('') : '<tr><td colspan="6" class="table-empty">No orders yet.</td></tr>';
  const details = $('orderDetails');
  if (!details.hidden && details.dataset.reference) renderOrderDetails(details.dataset.reference);
}

function renderOrderDetails(reference) {
  const order = AppStore.orders.find(item => item.reference === reference);
  const details = $('orderDetails');
  if (!order) { details.hidden = true; return; }
  details.dataset.reference = reference;
  details.hidden = false;
  details.innerHTML = `<div class="editor-heading"><h4>${escapeHtml(order.reference)}</h4><button type="button" class="text-action" data-admin-action="close-order-details">Close</button></div>
    <div class="customer-profile-grid"><div><span>Customer</span><strong>${escapeHtml(order.customer.name)}</strong><small>${escapeHtml(order.customer.email)}</small></div><div><span>Delivery address</span><strong>${escapeHtml(order.customer.address)}</strong><small>${escapeHtml(order.customer.city)}</small></div><div><span>Payment method</span><strong>${escapeHtml(order.paymentMethod)}</strong></div><div><span>Status</span><strong>${escapeHtml(titleCase(order.status))}</strong></div></div>
    ${order.items.map(item => `<div class="history-row"><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.selectedSize)} · ${item.quantity} × ${money(item.price)}</small></span><strong>${money(item.price * item.quantity)}</strong></div>`).join('')}
    <div class="history-row"><span>Subtotal</span><strong>${money(order.subtotal)}</strong></div>${order.discount ? `<div class="history-row"><span>Discount${order.promotionCode ? ` · ${escapeHtml(order.promotionCode)}` : ''}</span><strong>−${money(order.discount)}</strong></div>` : ''}<div class="history-row"><span>Shipping</span><strong>${order.shipping ? money(order.shipping) : 'Free'}</strong></div><div class="history-row"><strong>Total</strong><strong>${money(order.total)}</strong></div>`;
}

function renderAdminInventory() {
  const low = AppStore.products.filter(product => product.stock > 0 && product.stock < 5).length;
  const out = AppStore.products.filter(product => product.stock === 0).length;
  $('inventorySummary').innerHTML = `<strong>${low + out}</strong><span>${low + out === 1 ? 'product needs' : 'products need'} attention</span><span class="inventory-summary-detail">${low} low stock · ${out} out of stock</span>`;
  $('adminInventoryBody').innerHTML = AppStore.products.length ? AppStore.products.map(product => {
    const status = product.stock === 0 ? 'out' : product.stock < 5 ? 'low' : 'ok';
    const label = status === 'out' ? 'Out of stock' : status === 'low' ? 'Low stock' : 'In stock';
    return `<tr><td data-label="Product"><strong>${escapeHtml(product.title)}</strong></td><td data-label="Category">${escapeHtml(product.categoryName)}</td><td data-label="Stock quantity"><input class="stock-input" type="number" min="0" step="1" value="${product.stock}" data-stock-id="${escapeHtml(product.id)}" aria-label="Stock for ${escapeHtml(product.title)}"></td><td data-label="Status"><span class="admin-status-badge status-${status}">${label}</span></td><td data-label="Update"><button type="button" class="admin-action-btn" data-admin-action="save-stock" data-id="${escapeHtml(product.id)}">Save stock</button></td></tr>`;
  }).join('') : '<tr><td colspan="5" class="table-empty">No products yet.</td></tr>';
}

function renderAdminCustomers() {
  const customers = AppStore.getCustomers();
  $('adminCustomerBody').innerHTML = customers.length ? customers.map(customer => `<tr>
    <td data-label="Customer"><div><strong>${escapeHtml(customer.name)}</strong><span class="admin-subline">${escapeHtml(customer.email)}</span></div></td><td data-label="Orders">${customer.orders.length}</td><td data-label="Spent">${money(customer.spent)}</td>
    <td data-label="Account status"><select class="admin-status-select" data-admin-action="customer-status" data-email="${escapeHtml(customer.email)}" aria-label="Account status for ${escapeHtml(customer.name)}"><option value="active" ${customer.status === 'active' ? 'selected' : ''}>Active</option><option value="blocked" ${customer.status === 'blocked' ? 'selected' : ''}>Blocked</option></select></td>
    <td data-label="History"><button type="button" class="admin-action-btn" data-admin-action="customer-history" data-email="${escapeHtml(customer.email)}">View history</button></td></tr>`).join('') : '<tr><td colspan="5" class="table-empty">No customers yet.</td></tr>';
  const history = $('customerHistory');
  if (!history.hidden && history.dataset.email) renderCustomerHistory(history.dataset.email);
}

function renderCustomerHistory(email) {
  const customer = AppStore.getCustomers().find(item => item.email === email);
  const history = $('customerHistory');
  if (!customer) { history.hidden = true; return; }
  history.dataset.email = email;
  history.hidden = false;
  const latest = customer.orders[0].customer;
  history.innerHTML = `<div class="editor-heading"><h4>${escapeHtml(customer.name)} · Customer profile</h4><button type="button" class="text-action" data-admin-action="close-history">Close</button></div>
    <div class="customer-profile-grid"><div><span>Email</span><strong>${escapeHtml(customer.email)}</strong></div><div><span>Account status</span><strong>${escapeHtml(titleCase(customer.status))}</strong></div><div><span>Latest delivery address</span><strong>${escapeHtml(latest.address)}</strong><small>${escapeHtml(latest.city)}</small></div><div><span>Order history</span><strong>${customer.orders.length} ${customer.orders.length === 1 ? 'order' : 'orders'}</strong></div></div>
    ${customer.orders.map(order => `<div class="history-row"><span><strong>${escapeHtml(order.reference)}</strong><small>${escapeHtml(formatDate(order.createdAt))} · ${escapeHtml(titleCase(order.status))}</small></span><strong>${money(order.total)}</strong></div>`).join('')}`;
}

function renderAdminAnalytics() {
  const analytics = AppStore.getAnalytics();
  $('analyticsRevenue').textContent = money(analytics.revenue);
  $('analyticsOrders').textContent = analytics.orderCount;
  $('analyticsAvg').textContent = money(analytics.average);
  $('analyticsLowStock').textContent = analytics.lowStock;
  const max = Math.max(1, ...analytics.days.map(day => day.value));
  $('analyticsRevenueChart').innerHTML = analytics.days.map(day => `<div class="chart-column" aria-label="${escapeHtml(day.key)}: ${money(day.value)}"><div class="chart-value">${day.value ? money(day.value) : ''}</div><div class="chart-track"><div class="chart-bar" style="height:${day.value ? Math.max(6, (day.value / max) * 100) : 2}%"></div></div><span>${escapeHtml(day.label)}</span></div>`).join('');
  const top = analytics.topProducts;
  const maxUnits = Math.max(1, ...top.map(item => item.quantity));
  $('analyticsTopProducts').innerHTML = top.length ? top.map(item => `<div class="analytics-bar-row"><div class="analytics-bar-heading"><span>${escapeHtml(item.title)}</span><strong>${item.quantity} sold</strong></div><div class="analytics-bar-track"><div class="analytics-bar-fill" style="width:${Math.round(item.quantity / maxUnits * 100)}%"></div></div></div>`).join('') : '<div class="analytics-empty">Sales will appear here when orders are placed.</div>';
}

function renderAdminDiscounts() {
  $('adminPromoBody').innerHTML = AppStore.promotions.length ? AppStore.promotions.map(promo => {
    const status = AppStore.promotionStatus(promo);
    const schedule = promo.start || promo.end ? `${promo.start || 'Any time'} – ${promo.end || 'No end date'}` : 'Always';
    const discount = promo.type === 'amount' ? `${money(promo.amount)} off` : `${promo.percent}% off`;
    return `<tr><td data-label="Code"><div><strong>${escapeHtml(promo.code)}</strong>${promo.automatic ? '<span class="admin-subline">Automatic sale</span>' : ''}</div></td><td data-label="Discount">${escapeHtml(discount)}</td><td data-label="Schedule">${escapeHtml(schedule)}</td><td data-label="Status"><span class="admin-status-badge status-${status === 'active' ? 'ok' : status}">${escapeHtml(titleCase(status))}</span></td><td data-label="Actions"><div class="admin-actions"><button type="button" class="admin-action-btn" data-admin-action="toggle-promo" data-code="${escapeHtml(promo.code)}">${promo.active ? 'Disable' : 'Enable'}</button><button type="button" class="admin-action-btn danger" data-admin-action="delete-promo" data-code="${escapeHtml(promo.code)}">Delete</button></div></td></tr>`;
  }).join('') : '<tr><td colspan="5" class="table-empty">No promotions yet.</td></tr>';
}

function openProductEditor(product) {
  $('adminProductForm').reset();
  $('productEditorTitle').textContent = product ? 'Edit product' : 'Add product';
  $('productId').value = product ? product.id : '';
  $('productName').value = product ? product.title : '';
  $('productCategory').value = product ? product.category : 'audio';
  $('productPrice').value = product ? product.price : '';
  $('productStock').value = product ? product.stock : '';
  $('productTags').value = product ? (product.tags || []).join(', ') : '';
  $('productDescription').value = product ? product.description : '';
  $('productImage').value = product && !product.image.startsWith('data:image/') ? product.image : '';
  $('productRemoveImage').checked = false;
  $('productRemoveImageLabel').hidden = !product || !product.image;
  $('adminProductEditor').hidden = false;
  $('productName').focus();
}

let confirmAction = null;
let confirmFocus = null;
function requestConfirmation(title, message, buttonText, action) {
  confirmAction = action;
  confirmFocus = document.activeElement;
  $('confirmTitle').textContent = title;
  $('confirmMessage').textContent = message;
  $('confirmAccept').textContent = buttonText;
  $('confirmLayer').hidden = false;
  $('confirmCancel').focus();
}
function closeConfirmation() {
  $('confirmLayer').hidden = true;
  confirmAction = null;
  if (confirmFocus && confirmFocus.isConnected) confirmFocus.focus({ preventScroll: true });
  confirmFocus = null;
}

function refreshStorefront() {
  renderProductGrid();
  renderCartDrawer();
  renderProfile();
  if (activeLayer === DOM.wishlistModal) renderWishlistModal();
}

function initSortDropdown() {
  const trigger = $('sortTrigger');
  const menu = $('sortMenu');
  const options = Array.from(menu.querySelectorAll('.sort-option'));
  const close = (focus = false) => { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); if (focus) trigger.focus(); };
  const open = () => {
    menu.hidden = false;
    menu.classList.remove('opens-up');
    const rect = trigger.getBoundingClientRect();
    if (rect.bottom + menu.offsetHeight + 12 > window.innerHeight && rect.top > menu.offsetHeight + 12) menu.classList.add('opens-up');
    trigger.setAttribute('aria-expanded', 'true');
    (options.find(option => option.classList.contains('active')) || options[0]).focus();
  };
  trigger.addEventListener('click', event => { event.stopPropagation(); menu.hidden ? open() : close(); });
  trigger.addEventListener('keydown', event => { if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); if (menu.hidden) open(); } });
  options.forEach((option, index) => {
    option.addEventListener('click', () => {
      AppStore.sortBy = option.dataset.value;
      options.forEach(item => { const active = item === option; item.classList.toggle('active', active); item.setAttribute('aria-selected', String(active)); });
      $('sortLabel').textContent = option.textContent;
      close(true);
      renderProductGrid();
    });
    option.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(true); return; }
      let next = index;
      if (event.key === 'ArrowDown') next = (index + 1) % options.length;
      else if (event.key === 'ArrowUp') next = (index - 1 + options.length) % options.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = options.length - 1;
      else if (event.key === 'Tab') { close(); return; }
      else return;
      event.preventDefault();
      options[next].focus();
    });
  });
  document.addEventListener('click', event => { if (!$('sortCustom').contains(event.target)) close(); });
}

function updatePromotionFields() {
  const isAmount = $('promoType').value === 'amount';
  const input = $('promoPercent');
  $('promoValueLabel').textContent = isAmount ? 'Discount (USD)' : 'Discount (%)';
  input.min = isAmount ? '0.01' : '1';
  input.step = isAmount ? '0.01' : '1';
  if (isAmount) input.removeAttribute('max');
  else input.max = '100';
}

function initEventListeners() {
  DOM.navTabs.forEach(tab => tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    if (target === 'home' || target === 'shop') {
      closeAllModals();
      setActiveNav(target);
      if (target === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      else $('catalogSection').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setActiveNav(target);
    if (target === 'cart') { renderCartDrawer(); openLayer(DOM.cartDrawer); }
    if (target === 'wishlist') { renderWishlistModal(); openLayer(DOM.wishlistModal); }
    if (target === 'profile') { renderProfile(); openLayer(DOM.profileModal); }
    if (target === 'admin') { renderAdminPanel(); openLayer(DOM.adminModal); }
  }));
  $('brandLogo').addEventListener('click', () => { closeAllModals(); setActiveNav('home'); });
  ['cartCloseBtn', 'quickViewCloseBtn', 'wishlistCloseBtn', 'checkoutCloseBtn', 'profileCloseBtn', 'adminCloseBtn'].forEach(id => $(id).addEventListener('click', closeAllModals));
  DOM.overlay.addEventListener('click', closeAllModals);
  DOM.categoryPills.forEach(pill => pill.addEventListener('click', () => { AppStore.activeCategory = pill.dataset.category; updateCategories(); renderProductGrid(); }));
  DOM.searchInput.addEventListener('input', event => { AppStore.searchQuery = event.target.value; DOM.searchClearBtn.classList.toggle('visible', !!event.target.value); renderProductGrid(); });
  DOM.searchClearBtn.addEventListener('click', () => { DOM.searchInput.value = ''; AppStore.searchQuery = ''; DOM.searchClearBtn.classList.remove('visible'); renderProductGrid(); DOM.searchInput.focus(); });
  DOM.productGrid.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const id = button.dataset.id;
    if (button.dataset.action === 'wishlist') {
      const result = attempt(() => AppStore.toggleWishlist(id));
      if (result !== null) { renderProductGrid(); showToast(result ? 'Saved to your wishlist' : 'Removed from your wishlist'); }
    } else if (button.dataset.action === 'add-cart') {
      const product = attempt(() => AppStore.addToCart(id));
      if (product) { renderProductGrid(); renderCartDrawer(); showToast(`${product.title} added to your bag`); }
    } else if (button.dataset.action === 'quickview') renderQuickViewModal(id);
  });
  DOM.cartItemsList.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const index = Number(button.dataset.index);
    const result = attempt(() => {
      if (button.dataset.action === 'qty-plus') AppStore.updateCartQty(index, 1);
      if (button.dataset.action === 'qty-minus') AppStore.updateCartQty(index, -1);
      if (button.dataset.action === 'remove-cart') AppStore.removeFromCart(index);
      return true;
    });
    if (result) { renderCartDrawer(); renderProductGrid(); }
  });
  DOM.wishlistItemsList.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    if (button.dataset.action === 'wishlist-to-cart') {
      const product = attempt(() => AppStore.addToCart(button.dataset.id));
      if (product) { refreshStorefront(); showToast(`${product.title} added to your bag`); }
    }
    if (button.dataset.action === 'remove-wishlist') {
      const result = attempt(() => AppStore.toggleWishlist(button.dataset.id));
      if (result !== null) { renderWishlistModal(); renderProductGrid(); showToast('Removed from your wishlist'); }
    }
  });
  $('promoApplyBtn').addEventListener('click', () => {
    if (!DOM.promoInput.value.trim()) { showToast('Enter a promotion code.', true); return; }
    const promo = attempt(() => AppStore.applyPromo(DOM.promoInput.value));
    if (promo) { renderCartDrawer(); showToast(`${promo.code} applied`); }
  });
  $('promoRemoveBtn').addEventListener('click', () => {
    const removed = attempt(() => { AppStore.removePromo(); return true; });
    if (removed) { renderCartDrawer(); showToast('Promotion removed'); }
  });
  DOM.checkoutTriggerBtn.addEventListener('click', () => {
    if (!AppStore.cart.length) return;
    DOM.checkoutForm.reset();
    DOM.checkoutForm.hidden = false;
    DOM.orderSuccessScreen.hidden = true;
    DOM.checkoutModal.setAttribute('aria-labelledby', 'checkoutTitle');
    selectPayment(document.querySelector('.pay-card-pill'));
    openLayer(DOM.checkoutModal);
  });
  const paymentButtons = Array.from(document.querySelectorAll('.pay-card-pill'));
  paymentButtons.forEach((button, index) => {
    button.addEventListener('click', () => selectPayment(button));
    button.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
      const next = paymentButtons[(index + direction + paymentButtons.length) % paymentButtons.length];
      selectPayment(next); next.focus();
    });
  });
  DOM.checkoutForm.addEventListener('submit', event => {
    event.preventDefault();
    const order = attempt(() => AppStore.placeOrder({ name: $('checkoutName').value, address: $('checkoutAddress').value, city: $('checkoutCity').value, email: $('checkoutEmail').value, paymentMethod: document.querySelector('.pay-card-pill.active').dataset.payment }));
    if (!order) return;
    DOM.orderTrackingNum.textContent = order.reference;
    DOM.checkoutForm.hidden = true;
    DOM.orderSuccessScreen.hidden = false;
    DOM.checkoutModal.setAttribute('aria-labelledby', 'orderSuccessTitle');
    refreshStorefront();
    $('continueShoppingBtn').focus();
    showToast('Order saved');
  });
  $('continueShoppingBtn').addEventListener('click', () => { closeAllModals(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  DOM.themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    updateThemeControl(isDark);
    try { localStorage.setItem('aura_theme', isDark ? 'dark' : 'light'); } catch (_) { }
    showThemeNotice(isDark);
  });
  document.querySelectorAll('.admin-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(item => { item.classList.toggle('active', item === tab); if (item === tab) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current'); });
    document.querySelectorAll('.admin-panel').forEach(panel => { const active = panel.id === `admin-${tab.dataset.admin}`; panel.classList.toggle('active', active); panel.hidden = !active; });
  }));
  $('addProductBtn').addEventListener('click', () => openProductEditor(null));
  $('cancelProductEdit').addEventListener('click', () => { $('adminProductEditor').hidden = true; });
  $('adminProductForm').addEventListener('submit', async event => {
    event.preventDefault();
    const submit = event.target.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const file = $('productImageFile').files[0];
      const existing = AppStore.products.find(product => product.id === $('productId').value);
      let image = $('productImage').value.trim();
      if (!image && existing && existing.image.startsWith('data:image/') && !$('productRemoveImage').checked) image = existing.image;
      if ($('productRemoveImage').checked && !file) image = '';
      if (file) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) throw new Error('Choose a JPG, PNG, or WebP image under 1 MB.');
        image = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('The image could not be read.')); reader.readAsDataURL(file); });
      }
      if (!validImageSource(image)) throw new Error('Enter a valid image URL or path.');
      AppStore.saveProduct({ id: $('productId').value, title: $('productName').value, category: $('productCategory').value, price: $('productPrice').value, stock: $('productStock').value, tags: $('productTags').value.split(','), description: $('productDescription').value, image });
      $('adminProductEditor').hidden = true;
      refreshStorefront(); renderAdminPanel(); showToast('Product saved');
    } catch (error) { showToast(error.message || 'Product could not be saved.', true); }
    finally { submit.disabled = false; }
  });
  $('addPromoBtn').addEventListener('click', () => { $('adminPromoForm').reset(); updatePromotionFields(); $('adminPromoEditor').hidden = false; $('promoCode').focus(); });
  $('promoType').addEventListener('change', updatePromotionFields);
  $('cancelPromoEdit').addEventListener('click', () => { $('adminPromoEditor').hidden = true; });
  $('adminPromoForm').addEventListener('submit', event => {
    event.preventDefault();
    const saved = attempt(() => { AppStore.addPromotion({ code: $('promoCode').value, type: $('promoType').value, value: $('promoPercent').value, automatic: $('promoAutomatic').checked, start: $('promoStart').value, end: $('promoEnd').value }); return true; });
    if (saved) { $('adminPromoEditor').hidden = true; renderAdminDiscounts(); renderCartDrawer(); showToast('Promotion saved'); }
  });
  DOM.adminModal.addEventListener('click', event => {
    const button = event.target.closest('[data-admin-action]');
    if (!button || button.tagName === 'SELECT') return;
    const action = button.dataset.adminAction;
    const id = button.dataset.id;
    if (action === 'edit-product') openProductEditor(AppStore.products.find(product => product.id === id));
    if (action === 'delete-product') {
      const product = AppStore.products.find(item => item.id === id);
      if (product) requestConfirmation('Delete product?', `Delete ${product.title}? It will also be removed from saved items and bags on this device.`, 'Delete product', () => { AppStore.deleteProduct(id); refreshStorefront(); renderAdminPanel(); showToast('Product deleted'); });
    }
    if (action === 'save-stock') {
      const input = Array.from(document.querySelectorAll('[data-stock-id]')).find(item => item.dataset.stockId === id);
      const saved = attempt(() => { AppStore.updateStock(id, input.value); return true; });
      if (saved) { refreshStorefront(); renderAdminPanel(); showToast('Stock updated'); }
    }
    if (action === 'refund') {
      const reference = button.dataset.reference;
      requestConfirmation('Record refund?', `Record a full refund for ${reference}? No payment will be returned.`, 'Record refund', () => { AppStore.refundOrder(reference); renderAdminPanel(); renderProfile(); showToast('Refund recorded'); });
    }
    if (action === 'order-details') renderOrderDetails(button.dataset.reference);
    if (action === 'close-order-details') $('orderDetails').hidden = true;
    if (action === 'customer-history') renderCustomerHistory(button.dataset.email);
    if (action === 'close-history') $('customerHistory').hidden = true;
    if (action === 'toggle-promo') { const saved = attempt(() => { AppStore.togglePromotion(button.dataset.code); return true; }); if (saved) { renderAdminDiscounts(); renderCartDrawer(); showToast('Promotion updated'); } }
    if (action === 'delete-promo') {
      const code = button.dataset.code;
      requestConfirmation('Delete promotion?', `Delete ${code}? It will no longer be available in the bag.`, 'Delete promotion', () => { AppStore.deletePromotion(code); renderAdminDiscounts(); renderCartDrawer(); showToast('Promotion deleted'); });
    }
  });
  DOM.adminModal.addEventListener('change', event => {
    const select = event.target;
    if (select.dataset.adminAction === 'order-status') {
      const saved = attempt(() => { AppStore.updateOrderStatus(select.dataset.reference, select.value); return true; });
      if (saved) { renderAdminPanel(); renderProfile(); showToast('Order status updated'); } else renderAdminOrders();
    }
    if (select.dataset.adminAction === 'customer-status') {
      const saved = attempt(() => { AppStore.setCustomerStatus(select.dataset.email, select.value); return true; });
      if (saved) { renderAdminCustomers(); showToast('Customer status updated'); } else renderAdminCustomers();
    }
  });
  $('confirmCancel').addEventListener('click', closeConfirmation);
  $('confirmLayer').querySelector('.confirm-backdrop').addEventListener('click', closeConfirmation);
  $('confirmAccept').addEventListener('click', () => { const action = confirmAction; closeConfirmation(); if (action) attempt(action); });
  document.addEventListener('error', event => {
    const img = event.target;
    if (img.tagName === 'IMG' && img.dataset.fallbackCategory && !img.dataset.fallbackUsed) { img.dataset.fallbackUsed = 'true'; img.src = getCategorySvg(img.dataset.fallbackCategory); }
  }, true);
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!$('confirmLayer').hidden) { closeConfirmation(); return; }
      closeAllModals();
      return;
    }
    if (event.key !== 'Tab' || !activeLayer) return;
    const root = !$('confirmLayer').hidden ? $('confirmLayer') : activeLayer;
    const focusable = Array.from(root.querySelectorAll('button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]')).filter(element => element.getClientRects().length && !element.closest('[hidden]'));
    if (!focusable.length) { event.preventDefault(); root.focus(); return; }
    const first = focusable[0]; const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !root.contains(document.activeElement) || document.activeElement === root)) { event.preventDefault(); first.focus(); }
  });
  window.addEventListener('storage', event => {
    if (event.key !== STORE_STATE_KEY) return;
    const refreshed = new Store(window.STORE_DATA.products, window.localStorage);
    AppStore.state = refreshed.state;
    refreshStorefront();
    if (activeLayer === DOM.adminModal) renderAdminPanel();
  });
}

function updateThemeControl(isDark) {
  DOM.themeToggleBtn.setAttribute('aria-pressed', String(isDark));
  DOM.themeToggleLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
}

let savedTheme = 'light';
try { savedTheme = localStorage.getItem('aura_theme') || 'light'; } catch (_) { }
document.body.classList.toggle('dark-mode', savedTheme === 'dark');
updateThemeControl(savedTheme === 'dark');
renderProductGrid();
renderCartDrawer();
initSortDropdown();
initEventListeners();
