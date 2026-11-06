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
  bridge.textContent = 'window.AppStore = AppStore; window.renderAdminOrders = renderAdminOrders; window.renderCartDrawer = renderCartDrawer; window.renderAdminProducts = renderAdminProducts; window.renderAdminOrders = renderAdminOrders; window.renderAdminInventory = renderAdminInventory; window.adminListState = adminListState; window.renderProductPage = renderProductPage; window.getFilteredProducts = getFilteredProducts; window.renderAdminCustomers = renderAdminCustomers; window.renderAdminDiscounts = renderAdminDiscounts; window.restorePagerFocus = restorePagerFocus;';
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
    // "All" is paged: page one shows the first 10 of 14, and the pager says so.
    assert.equal(document.querySelectorAll('#adminProductBody tr').length, 10, 'first page holds one page of rows');
    assert.match(document.getElementById('adminProductPager').textContent, /Showing 1.10 of 14 products/);
    assert.match(document.getElementById('adminProductPager').textContent, /Page 1 of 2/);
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

test('admin product search narrows results and resets to the first page', () => {
  const page = loadPage();
  try {
    const { window, document } = page;
    window.renderAdminProducts();
    // Walk to page two, then search: the search must come back to page one.
    document.querySelector('[data-page-target="products"][data-page-delta="1"]').click();
    assert.match(document.getElementById('adminProductPager').textContent, /Page 2 of 2/);
    const search = document.getElementById('adminProductSearch');
    search.value = 'aura';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    assert.match(document.getElementById('adminProductPager').textContent, /Page 1 of 1/);
    const titles = [...document.querySelectorAll('#adminProductBody tr td[data-label="Product"] strong')].map(node => node.textContent);
    assert.ok(titles.length > 0, 'search returns matches');
    assert.ok(titles.every(title => /aura/i.test(title)), `unexpected matches: ${titles.join(', ')}`);

    // A query with no matches shows the message, not an empty table.
    search.value = 'zzzz';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    assert.match(document.getElementById('adminProductBody').textContent, /No products match/);
    assert.equal(document.getElementById('adminProductPager').hidden, true);
  } finally {
    page.close();
  }
});

test('admin order filters and paging work on a list long enough to page', () => {
  const page = loadPage();
  try {
    const { window, document } = page;
    const store = window.AppStore;
    // 23 orders: enough for three pages. Raise stock so the loop is not bounded
    // by the seed quantity.
    store.updateStock('aura-01', 100);
    for (let index = 0; index < 23; index++) {
      store.addToCart('aura-01');
      const order = store.placeOrder({ name: `Buyer ${index}`, address: `${index} Main St`, city: 'Ibadan', email: `buyer${index}@example.com`, paymentMethod: 'Apple Pay' });
      if (index % 5 === 0) { store.updateOrderStatus(order.reference, 'processing'); }
    }
    window.renderAdminOrders();
    assert.match(document.getElementById('adminOrderPager').textContent, /Showing 1.10 of 23 orders/);
    assert.match(document.getElementById('adminOrderPager').textContent, /Page 1 of 3/);
    document.querySelector('[data-page-target="orders"][data-page-delta="1"]').click();
    assert.match(document.getElementById('adminOrderPager').textContent, /Showing 11.20 of 23 orders/);
    document.querySelector('[data-page-target="orders"][data-page-delta="1"]').click();
    assert.match(document.getElementById('adminOrderPager').textContent, /Showing 21.23 of 23 orders/);
    assert.equal(document.querySelector('[data-page-target="orders"][data-page-delta="1"]').disabled, true, 'Next is disabled on the last page');

    // Status filter narrows the list and returns to page one.
    document.querySelector('[data-order-filter="processing"]').click();
    assert.match(document.getElementById('adminOrderPager').textContent, /of 5 orders/);
    assert.match(document.getElementById('adminOrderPager').textContent, /Page 1 of 1/);
    assert.equal(document.querySelectorAll('#adminOrderBody tr').length, 5);

    // Filters compose, so clear the status filter before searching across all orders.
    document.querySelector('[data-order-filter="all"]').click();
    const search = document.getElementById('adminOrderSearch');
    search.value = 'buyer7@example.com';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    assert.match(document.getElementById('adminOrderPager').textContent, /of 1 order/);
    assert.match(document.getElementById('adminOrderBody').textContent, /Buyer 7/);
  } finally {
    page.close();
  }
});

test('admin inventory filters by stock level and keeps the summary accurate', () => {
  const page = loadPage();
  try {
    const { window, document } = page;
    const store = window.AppStore;
    store.updateStock('aura-01', 0);   // out of stock
    store.updateStock('aura-02', 2);   // low stock
    store.updateStock('aura-03', 40);  // healthy
    window.renderAdminInventory();

    document.querySelector('[data-inventory-filter="out"]').click();
    let rows = [...document.querySelectorAll('#adminInventoryBody tr')].map(row => row.textContent).join(' ');
    assert.match(rows, /AURA ANC Over-Ear/);
    assert.doesNotMatch(rows, /Bauhaus Chronograph Mono/);

    document.querySelector('[data-inventory-filter="low"]').click();
    rows = [...document.querySelectorAll('#adminInventoryBody tr')].map(row => row.textContent).join(' ');
    assert.match(rows, /Bauhaus Chronograph Mono/);
    assert.doesNotMatch(rows, /AURA ANC Over-Ear/, 'out of stock is not counted as merely low');

    document.querySelector('[data-inventory-filter="all"]').click();
    const search = document.getElementById('adminInventorySearch');
    search.value = 'chronograph';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    rows = [...document.querySelectorAll('#adminInventoryBody tr')].map(row => row.textContent).join(' ');
    assert.match(rows, /Bauhaus Chronograph Mono/);
    assert.doesNotMatch(rows, /CloudPure Seamless Runner/);
  } finally {
    page.close();
  }
});

test('admin customer search and paging work on a long customer list', () => {
  const page = loadPage();
  try {
    const { window, document } = page;
    const store = window.AppStore;
    store.updateStock('aura-01', 100);
    for (let index = 0; index < 12; index++) {
      store.addToCart('aura-01');
      store.placeOrder({ name: `Shopper ${index}`, address: `${index} Market Rd`, city: index % 2 ? 'Lagos' : 'Abuja', email: `shopper${index}@example.com`, paymentMethod: 'Card' });
    }
    window.renderAdminCustomers();

    assert.match(document.getElementById('adminCustomerPager').textContent, /Showing 1.10 of 12 customers/);
    assert.match(document.getElementById('adminCustomerPager').textContent, /Page 1 of 2/);
    assert.equal(document.querySelectorAll('#adminCustomerBody tr').length, 10);

    document.querySelector('[data-page-target="customers"][data-page-delta="1"]').click();
    assert.match(document.getElementById('adminCustomerPager').textContent, /Showing 11.12 of 12 customers/);

    // Search matches name, email and city, and resets to page one.
    const search = document.getElementById('adminCustomerSearch');
    search.value = 'shopper3@';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    assert.equal(document.querySelectorAll('#adminCustomerBody tr').length, 1);
    assert.match(document.getElementById('adminCustomerBody').textContent, /Shopper 3/);
    assert.match(document.getElementById('adminCustomerPager').textContent, /Page 1 of 1/);

    // Name alone, with a space that the email cannot match, so this fails if
    // name drops out of the searchable fields.
    search.value = 'shopper 7';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    assert.equal(document.querySelectorAll('#adminCustomerBody tr').length, 1);
    assert.match(document.getElementById('adminCustomerBody').textContent, /Shopper 7/);

    // City is searchable too.
    search.value = 'abuja';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    assert.match(document.getElementById('adminCustomerBody').textContent, /Shopper 0/);

    // A miss says so instead of leaving an empty table.
    search.value = 'nobody-here';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    assert.match(document.getElementById('adminCustomerBody').textContent, /No customers match/);
    assert.equal(document.getElementById('adminCustomerPager').hidden, true, 'no pager when nothing matches');
  } finally {
    page.close();
  }
});

test('admin promotion status filters and paging work together', () => {
  const page = loadPage();
  try {
    const { window, document } = page;
    const store = window.AppStore;
    const base = store.promotions.length;
    // Enough promotions to fill more than one page, across several statuses.
    for (let index = 0; index < 12; index++) {
      store.addPromotion({ code: `BULK${index}`, type: 'percent', percent: 10 + index });
    }
    store.addPromotion({ code: 'OFFLINE', type: 'percent', percent: 15 });
    window.renderAdminDiscounts();
    const offline = store.promotions.find(promo => promo.code === 'OFFLINE');
    store.togglePromotion('OFFLINE');
    window.renderAdminDiscounts();

    assert.match(document.getElementById('adminPromoPager').textContent, new RegExp(`of ${base + 13} promotions`));
    assert.match(document.getElementById('adminPromoPager').textContent, /Page 1 of 2/);

    // Filtering by status narrows the list and returns to page one.
    document.querySelector('[data-promo-filter="disabled"]').click();
    assert.equal(document.querySelector('[data-promo-filter="disabled"]').getAttribute('aria-pressed'), 'true');
    assert.match(document.getElementById('adminPromoBody').textContent, /OFFLINE/);
    assert.doesNotMatch(document.getElementById('adminPromoBody').textContent, /BULK1\b/);
    assert.match(document.getElementById('adminPromoPager').textContent, /Page 1 of 1/);

    // A status with nothing in it explains itself.
    document.querySelector('[data-promo-filter="expired"]').click();
    assert.match(document.getElementById('adminPromoBody').textContent, /No expired promotions/);
    assert.equal(document.getElementById('adminPromoPager').hidden, true);

    // Search on top of "all" matches the code.
    document.querySelector('[data-promo-filter="all"]').click();
    const search = document.getElementById('adminPromoSearch');
    search.value = 'bulk7';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    assert.equal(document.querySelectorAll('#adminPromoBody tr').length, 1);
    assert.match(document.getElementById('adminPromoBody').textContent, /BULK7/);
    assert.ok(offline);
  } finally {
    page.close();
  }
});

test('paging keeps keyboard focus on the pager instead of dropping it to the body', () => {
  const page = loadPage();
  try {
    const { window, document } = page;
    // jsdom refuses to focus an element inside a hidden section, so the admin
    // panel has to be open for these assertions to mean anything.
    document.querySelector('[data-tab="admin"]').click();
    document.querySelector('[data-admin="products"]').click();
    window.renderAdminProducts();
    document.querySelector('[data-product-filter="all"]').click();

    const next = () => document.querySelector('[data-page-target="products"][data-page-delta="1"]');
    const prev = () => document.querySelector('[data-page-target="products"][data-page-delta="-1"]');
    assert.equal(next().disabled, false, '14 products means a second page exists');

    // Enter on Next moves to the last page; Next is then disabled, so focus
    // must fall back to Previous rather than to <body>.
    next().focus();
    assert.equal(document.activeElement, next(), 'focus is on Next before activating');
    next().click();
    assert.match(document.getElementById('adminProductPager').textContent, /Page 2 of 2/);
    assert.equal(next().disabled, true);
    assert.notEqual(document.activeElement, document.body, 'focus is not dropped to the body');
    assert.equal(document.activeElement, prev(), 'focus falls back to Previous, which is still usable');

    // Going back the other way falls forward to Next.
    prev().focus();
    prev().click();
    assert.match(document.getElementById('adminProductPager').textContent, /Page 1 of 2/);
    assert.equal(prev().disabled, true);
    assert.equal(document.activeElement, next(), 'focus falls forward to Next');

    // A click that did not have focus must not steal it.
    const elsewhere = document.getElementById('adminProductSearch');
    elsewhere.focus();
    next().click();
    assert.equal(document.activeElement, elsewhere, 'focus stays where the user left it');
    assert.match(document.getElementById('adminProductPager').textContent, /Page 2 of 2/, 'but the page still changed');
  } finally {
    page.close();
  }
});

test('focus fallback reaches the status line when both arrows are unavailable', () => {
  const page = loadPage();
  try {
    const { window, document } = page;
    document.querySelector('[data-tab="admin"]').click();
    document.querySelector('[data-admin="products"]').click();
    // Narrow to a single page so neither arrow can be used after paging.
    const search = document.getElementById('adminProductSearch');
    search.value = 'flask';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));

    const pager = document.getElementById('adminProductPager');
    assert.match(pager.textContent, /Page 1 of 1/);
    assert.equal(pager.querySelector('[data-page-delta="1"]').disabled, true);
    assert.equal(pager.querySelector('[data-page-delta="-1"]').disabled, true);
    const status = pager.querySelector('.admin-pager-status');
    assert.equal(status.getAttribute('tabindex'), '-1', 'the status line is focusable programmatically only');
    window.restorePagerFocus(pager, '1');
    assert.equal(document.activeElement, status, 'focus parks on the live status line when both arrows are unusable');
  } finally {
    page.close();
  }
});

test('focus survives a re-render caused by an action other than paging', () => {
  const page = loadPage();
  try {
    const { window, document } = page;
    document.querySelector('[data-tab="admin"]').click();
    document.querySelector('[data-admin="products"]').click();
    window.renderAdminProducts();

    // Sit on the last page, then shrink the list from elsewhere, exactly as
    // archiving several products would. The page clamps back to 1 and both
    // arrows become unusable, so focus must land on the live status line
    // rather than falling to <body>.
    const next = () => document.querySelector('[data-page-target="products"][data-page-delta="1"]');
    next().focus();
    next().click();
    assert.match(document.getElementById('adminProductPager').textContent, /Page 2 of 2/);
    assert.equal(document.activeElement, document.querySelector('[data-page-target="products"][data-page-delta="-1"]'));

    ['aura-01', 'aura-02', 'aura-03', 'aura-04', 'aura-05'].forEach(id => window.AppStore.archiveProduct(id));
    window.renderAdminProducts();
    const pager = document.getElementById('adminProductPager');
    assert.match(pager.textContent, /of 9 products/);
    assert.match(pager.textContent, /Page 1 of 1/);
    assert.notEqual(document.activeElement, document.body, 'focus did not fall to the body');
    assert.equal(document.activeElement.className, 'admin-pager-status');
  } finally {
    page.close();
  }
});
