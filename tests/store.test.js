const test = require('node:test');
const assert = require('node:assert/strict');
const { Store, STORE_STATE_KEY } = require('../js/store.js');

class MemoryStorage {
  constructor(values = {}) { this.values = { ...values }; }
  getItem(key) { return this.values[key] ?? null; }
  setItem(key, value) { this.values[key] = String(value); }
}

const seed = [
  { id: 'one', title: 'Object One', category: 'audio', price: 100, stock: 3, description: 'A first object', colors: ['#111111', '#ffffff'], sizes: ['Small', 'Large'], badge: 'New' },
  { id: 'two', title: 'Object Two', category: 'living', price: 50, stock: 8, description: 'A second object', colors: ['#111111'], sizes: ['Standard'] }
];
const fixedDate = () => new Date('2026-10-30T12:00:00Z');
const makeStore = (storage = new MemoryStorage()) => new Store(seed, storage, fixedDate);
const details = { name: 'Ada Customer', address: '1 Main Street', city: 'Ibadan', email: 'ADA@example.com', paymentMethod: 'Credit Card' };

test('migrates old bag and wishlist and reconciles quantities with stock', () => {
  const storage = new MemoryStorage({
    aura_cart: JSON.stringify([{ id: 'one', quantity: 99, selectedColor: '#111111', selectedSize: 'Small' }, { id: 'missing', quantity: 2 }]),
    aura_wishlist: JSON.stringify(['one', 'missing'])
  });
  const store = makeStore(storage);
  assert.equal(store.getCartCount(), 3);
  assert.deepEqual([...store.wishlist], ['one']);
  store.toggleWishlist('two');
  assert.ok(storage.getItem(STORE_STATE_KEY));
  assert.deepEqual([...makeStore(storage).wishlist], ['one', 'two']);
});

test('product changes persist, and deleting a product removes it from bags and saved items', () => {
  const storage = new MemoryStorage();
  const store = makeStore(storage);
  const product = store.saveProduct({ title: 'Desk lamp', category: 'living', price: '42.50', stock: '2', description: 'A lamp', tags: ['New', 'Desk'], image: '' });
  store.addToCart(product.id);
  store.toggleWishlist(product.id);
  store.saveProduct({ ...product, title: 'Desk light', price: '45', stock: '1', tags: ['Updated'] });
  const reloaded = makeStore(storage);
  assert.equal(reloaded.products.find(item => item.id === product.id).title, 'Desk light');
  assert.equal(reloaded.getCartTotals().subtotal, 45);
  reloaded.deleteProduct(product.id);
  assert.equal(reloaded.cart.length, 0);
  assert.equal(reloaded.wishlist.size, 0);
  assert.equal(makeStore(storage).products.some(item => item.id === product.id), false);
});

test('stock is shared across variants and inventory edits reconcile the bag', () => {
  const store = makeStore();
  store.addToCart('one', 2, { color: '#111111', size: 'Small' });
  store.addToCart('one', 1, { color: '#ffffff', size: 'Large' });
  assert.throws(() => store.addToCart('one'), /available/);
  assert.throws(() => store.updateCartQty(0, 1), /available/);
  store.updateStock('one', 2);
  assert.equal(store.getCartCount(), 2);
  assert.equal(store.cart.length, 1);
  store.updateStock('one', 0);
  assert.equal(store.cart.length, 0);
  assert.equal(store.products[0].inStock, false);
  assert.throws(() => store.updateStock('one', -1), /whole number/);
});

test('promotions respect their schedule and active state in cart totals', () => {
  const store = makeStore();
  store.addPromotion({ code: 'save20', percent: '20', start: '2026-10-29', end: '2026-10-31' });
  store.addPromotion({ code: 'future', percent: '10', start: '2026-11-01', end: '' });
  store.addToCart('one');
  store.applyPromo('save20');
  assert.equal(store.getCartTotals().discount, 20);
  assert.equal(store.getCartTotals().total, 95);
  assert.throws(() => store.applyPromo('future'), /not active/);
  store.togglePromotion('SAVE20');
  assert.equal(store.getCartTotals().discount, 0);
  assert.throws(() => store.applyPromo('SAVE20'), /not active/);
  store.deletePromotion('SAVE20');
  assert.equal(store.state.appliedPromo, '');
  assert.throws(() => store.addPromotion({ code: 'bad', percent: 10, start: '2026-11-02', end: '2026-11-01' }), /date range/);
});

test('checkout persists the same reference, order snapshots and inventory atomically', () => {
  const storage = new MemoryStorage();
  const store = makeStore(storage);
  store.addToCart('one', 2);
  store.applyPromo('AURA15');
  const order = store.placeOrder(details);
  assert.match(order.reference, /^AURA-2026-/);
  assert.equal(order.customer.email, 'ada@example.com');
  assert.equal(order.total, 170);
  assert.equal(store.products[0].stock, 1);
  assert.equal(store.cart.length, 0);
  const reloaded = makeStore(storage);
  assert.equal(reloaded.orders[0].reference, order.reference);
  assert.equal(reloaded.orders[0].items[0].title, 'Object One');
  assert.equal(reloaded.getAnalytics().revenue, 170);
  assert.equal(reloaded.getAnalytics().topProducts[0].quantity, 2);
  assert.equal(reloaded.getCustomers()[0].orders[0].reference, order.reference);
  reloaded.deleteProduct('one');
  assert.equal(reloaded.orders[0].items[0].title, 'Object One');
});

test('status, customer history and recorded refunds feed analytics consistently', () => {
  const store = makeStore();
  store.addToCart('one');
  const order = store.placeOrder(details);
  store.updateOrderStatus(order.reference, 'shipped');
  assert.equal(store.orders[0].status, 'shipped');
  store.setCustomerStatus('ada@example.com', 'blocked');
  store.addToCart('two');
  assert.throws(() => store.placeOrder(details), /blocked/);
  store.refundOrder(order.reference);
  assert.equal(store.orders[0].status, 'refunded');
  assert.equal(store.getAnalytics().revenue, 0);
  assert.equal(store.getAnalytics().orderCount, 0);
  assert.equal(store.getCustomers()[0].spent, 0);
  assert.throws(() => store.refundOrder(order.reference), /cannot be refunded/);
  assert.throws(() => store.updateOrderStatus(order.reference, 'delivered'), /cannot be updated/);
});

test('a storage failure does not partially change the order, bag or stock', () => {
  const storage = new MemoryStorage();
  const store = makeStore(storage);
  store.addToCart('one');
  storage.setItem = () => { throw new Error('quota'); };
  assert.throws(() => store.placeOrder(details), /could not be saved/);
  assert.equal(store.orders.length, 0);
  assert.equal(store.cart.length, 1);
  assert.equal(store.products[0].stock, 3);
});

test('fixed vouchers and automatic sales choose the best active sale unless a code is applied', () => {
  const store = makeStore();
  store.addPromotion({ code: 'TENPERCENT', type: 'percent', value: 10, automatic: true });
  store.addPromotion({ code: 'AUTOSALE', type: 'amount', value: 25, automatic: true, start: '2026-10-01', end: '2026-10-31' });
  store.addPromotion({ code: 'FUTURESALE', type: 'amount', value: 90, automatic: true, start: '2026-11-01' });
  store.addToCart('one');
  assert.equal(store.getCartTotals().promotion.code, 'AUTOSALE');
  assert.equal(store.getCartTotals().discount, 25);
  assert.equal(store.getCartTotals().total, 90);
  store.applyPromo('AURA15');
  assert.equal(store.getCartTotals().promotion.code, 'AURA15');
  assert.equal(store.getCartTotals().discount, 15);
  store.togglePromotion('AURA15');
  assert.equal(store.getCartTotals().promotion.code, 'AUTOSALE');
  store.addPromotion({ code: 'VOUCHER', type: 'amount', value: 150 });
  store.applyPromo('VOUCHER');
  assert.equal(store.getCartTotals().discount, 100);
  assert.equal(store.getCartTotals().total, 15);
});
