// DOM-level smoke tests. These boot the real index.html with jsdom so that the
// rendered storefront, admin tables and checkout wiring are verified without a
// browser. Playwright still covers layout, CSS and real input in tests/e2e.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function loadPage() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  virtualConsole.on('error', (...args) => errors.push(args.join(' ')));
  // jsdom does not fetch remote images or fonts; keep CSS/script loading local only.
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'http://127.0.0.1/',
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) {
      window.HTMLCanvasElement.prototype.getContext = () => null;
    }
  });
  const { window } = dom;
  const inject = file => {
    const script = window.document.createElement('script');
    script.textContent = fs.readFileSync(path.join(root, file), 'utf8');
    window.document.body.appendChild(script);
  };
  inject('js/products.js');
  inject('js/store.js');
  inject('js/app.js');
  // Top-level `const` bindings are not placed on `window`, so expose the public
  // handles the tests need through a small bridge.
  const bridge = window.document.createElement('script');
  bridge.textContent = 'window.AppStore = AppStore; window.renderAdminOrders = renderAdminOrders; window.renderCartDrawer = renderCartDrawer; window.renderAdminProducts = renderAdminProducts; window.renderProductPage = renderProductPage; window.getFilteredProducts = getFilteredProducts;';
  window.document.body.appendChild(bridge);
  return { window, document: window.document, errors, close: () => window.close() };
}

test('the storefront renders products, categories and empty account state', () => {
  const page = loadPage();
  try {
    const { document, errors } = page;
    assert.deepEqual(errors, [], `expected no script errors, got: ${errors.join(' | ')}`);
    // Each card links the image and the title, so count distinct products instead.
    const ids = new Set([...document.querySelectorAll('#productGrid a[data-product-link]')].map(link => link.dataset.productLink));
    assert.equal(ids.size, 14, 'one card per built-in product');
    assert.equal(document.querySelectorAll('.cat-pill').length, 6);
    assert.match(document.getElementById('resultsCount').textContent, /Showing 14 objects/);
    assert.equal(document.getElementById('navCartBadge').textContent, '0');
    assert.match(document.getElementById('featuredPrice').textContent, /\$299/);
  } finally {
    page.close();
  }
});

test('admin order controls only offer legal next statuses and refunds', () => {
  const page = loadPage();
  try {
    const { window, document } = page;
    const store = window.AppStore;
    store.addToCart('aura-01');
    const order = store.placeOrder({ name: 'Ada Customer', address: '1 Main Street', city: 'Ibadan', email: 'ada@example.com', paymentMethod: 'Credit Card' });
    window.renderAdminOrders();

    const selectFor = reference => document.querySelector(`[data-admin-action="order-status"][data-reference="${reference}"]`);
    const refundFor = reference => document.querySelector(`[data-admin-action="refund"][data-reference="${reference}"]`);

    // Pending: only Processing and Cancelled, and no refund yet.
    const options = [...selectFor(order.reference).querySelectorAll('option')].map(option => option.value);
    assert.deepEqual(options, ['pending', 'processing', 'cancelled']);
    assert.equal(refundFor(order.reference), null, 'a pending order must not offer a refund');

    store.updateOrderStatus(order.reference, 'processing');
    store.updateOrderStatus(order.reference, 'shipped');
    window.renderAdminOrders();
    assert.deepEqual([...selectFor(order.reference).querySelectorAll('option')].map(option => option.value), ['shipped', 'delivered', 'cancelled']);
    assert.ok(refundFor(order.reference), 'a shipped order can be refunded');

    // Cancelled is terminal: a badge replaces the dropdown and no refund is offered.
    store.updateOrderStatus(order.reference, 'cancelled');
    window.renderAdminOrders();
    assert.equal(selectFor(order.reference), null);
    assert.equal(refundFor(order.reference), null);
    assert.match(document.getElementById('adminOrderBody').textContent, /Cancelled/);

    // Refunded is terminal too.
    store.addToCart('aura-01');
    const second = store.placeOrder({ name: 'Ada Customer', address: '1 Main Street', city: 'Ibadan', email: 'ada@example.com', paymentMethod: 'Credit Card' });
    store.updateOrderStatus(second.reference, 'processing');
    store.updateOrderStatus(second.reference, 'shipped');
    store.refundOrder(second.reference);
    window.renderAdminOrders();
    assert.equal(selectFor(second.reference), null);
    assert.match(document.getElementById('adminOrderBody').textContent, /Refunded/);
  } finally {
    page.close();
  }
});

test('a checkout with a half-cent promotion discount shows the rounded total', () => {
  const page = loadPage();
  try {
    const { window, document } = page;
    const store = window.AppStore;
    // Force a 4.10 subtotal so 15% lands exactly on half a cent (0.615 -> 0.62).
    store.saveProduct({ id: 'aura-14', title: 'Minimalist Matte Thermal Flask', category: 'living', price: 4.10, stock: 5, description: 'Rounding probe' });
    store.addToCart('aura-14');
    store.applyPromo('AURA15');
    window.renderCartDrawer();
    assert.match(document.getElementById('cartDiscount').textContent.trim(), /^−\$0\.62/);
    const totals = store.getCartTotals();
    assert.equal(totals.discount, 0.62);
    assert.equal(totals.shipping, 15, 'shipping is unchanged by the rounding fix');
    assert.equal(totals.total, 18.48);
  } finally {
    page.close();
  }
});

test('built-in products still expose reloadable detail links', () => {
  const page = loadPage();
  try {
    const { document } = page;
    const links = [...document.querySelectorAll('#productGrid a[data-product-link]')].map(anchor => anchor.getAttribute('href'));
    assert.ok(links.every(href => /^\?product=aura-\d{2}$/.test(href)), `unexpected hrefs: ${links.join(', ')}`);
    assert.ok(links.includes('?product=aura-01'));
    assert.ok(links.includes('?product=aura-14'));
  } finally {
    page.close();
  }
});

test('admin lists archived products separately and only offers legal actions', () => {
  const page = loadPage();
  try {
    const { window, document } = page;
    const store = window.AppStore;
    const rowFor = title => Array.from(document.querySelectorAll('#adminProductBody tr')).find(row => row.textContent.includes(title));

    window.renderAdminProducts();
    // Active filter is the default: archived products are hidden from it.
    assert.match(document.getElementById('adminProductBody').textContent, /AURA ANC Over-Ear/);
    assert.equal(document.querySelectorAll('[data-product-filter="active"].active').length, 1);
    assert.ok(document.querySelector('[data-admin-action="archive-product"]'), 'active rows offer Archive');
    assert.equal(document.querySelector('[data-admin-action="delete-product"]'), null, 'active rows must not offer permanent delete');

    store.archiveProduct('aura-01');
    window.renderAdminProducts();
    assert.equal(rowFor('AURA ANC Over-Ear'), undefined, 'archived is hidden under the Active filter');

    document.querySelector('[data-product-filter="archived"]').click();
    assert.match(document.getElementById('adminProductBody').textContent, /AURA ANC Over-Ear/);
    assert.match(document.getElementById('adminProductBody').textContent, /Archived/);
    assert.ok(document.querySelector('[data-admin-action="restore-product"]'), 'archived rows offer Restore');
    assert.ok(document.querySelector('[data-admin-action="delete-product"]'), 'archived rows offer permanent delete');
    assert.equal(document.querySelector('[data-admin-action="archive-product"]'), null);

    document.querySelector('[data-product-filter="all"]').click();
    assert.equal(document.querySelectorAll('#adminProductBody tr').length, 14, 'all shows every product');
  } finally {
    page.close();
  }
});

test('an archived product leaves the storefront and shows a retired detail page', () => {
  const page = loadPage();
  try {
    const { window, document } = page;
    const store = window.AppStore;
    // aura-01 is the featured hero product, so this exercises the fallback too.
    store.archiveProduct('aura-01');

    const ids = window.getFilteredProducts().map(product => product.id);
    assert.equal(ids.includes('aura-01'), false, 'archived product is not in the catalogue');
    assert.equal(ids.length, 13);

    window.renderProductPage('aura-01');
    const text = document.getElementById('productPageContent').textContent;
    assert.match(text, /No longer available/);
    assert.match(text, /AURA ANC Over-Ear/);
    assert.doesNotMatch(text, /Product not found/, 'a retired item is not the same as a missing one');

    // Restoring puts it back.
    store.restoreProduct('aura-01');
    assert.equal(window.getFilteredProducts().map(product => product.id).includes('aura-01'), true);
  } finally {
    page.close();
  }
});
