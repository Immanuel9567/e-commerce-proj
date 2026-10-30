const { test, expect } = require('@playwright/test');

async function load(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://images.unsplash.com/**', route => route.abort());
  await page.goto('/');
}

async function addFirstProduct(page) {
  await page.locator('.product-card').first().getByRole('button', { name: 'Add to bag' }).click();
}

async function openBag(page) {
  await page.locator('[data-tab="cart"]').click();
  await expect(page.locator('#cartDrawer')).toHaveClass(/open/);
}

test('sort menu follows each theme, sorts correctly and has keyboard support', async ({ page }) => {
  await load(page);
  await expect(page.locator('.bottom-pill-nav')).toHaveCount(0);
  await expect(page.locator('.site-header svg')).toHaveCount(0);
  await page.locator('#sortTrigger').click();
  await expect(page.locator('#sortMenu')).toBeVisible();
  const lightMenu = await page.locator('#sortMenu').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(lightMenu).not.toBe('rgb(255, 255, 255)');
  await page.getByRole('option', { name: 'Price: low to high' }).click();
  await expect(page.locator('.product-card').first().locator('.price-current')).toHaveText('$48.00');
  await page.locator('#themeToggleBtn').click();
  await expect(page.locator('.toast').last()).toHaveText('Dark mode enabled');
  await page.locator('#sortTrigger').click();
  const darkMenu = await page.locator('#sortMenu').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(darkMenu).not.toBe(lightMenu);
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(page.locator('#sortLabel')).toHaveText('Top rated');
  await expect(page.locator('#sortMenu')).toBeHidden();
  await page.reload();
  await expect(page.locator('body')).toHaveClass(/dark-mode/);
  await expect(page.locator('#themeToggleLabel')).toHaveText('Light mode');
});

test('only the bag scrolls while open and the page position is restored', async ({ page }) => {
  await load(page);
  for (let index = 0; index < 8; index++) {
    await page.locator('.product-card').nth(index).getByRole('button', { name: 'Add to bag' }).click();
  }
  const scrollBefore = await page.evaluate(() => window.scrollY);
  expect(scrollBefore).toBeGreaterThan(0);
  await openBag(page);
  await expect(page.locator('body')).toHaveClass(/scroll-locked/);
  const backgroundTop = await page.locator('#catalogSection').evaluate(el => el.getBoundingClientRect().top);
  await page.mouse.move(100, 500);
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(100);
  expect(await page.locator('#catalogSection').evaluate(el => el.getBoundingClientRect().top)).toBe(backgroundTop);
  const items = page.locator('#cartItemsList');
  await items.hover();
  await page.mouse.wheel(0, 600);
  await expect.poll(() => items.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  await page.locator('#cartCloseBtn').click();
  await expect(page.locator('body')).not.toHaveClass(/scroll-locked/);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrollBefore)).toBeLessThanOrEqual(1);
});

test('checkout saves reference and status to account, inventory, analytics and customers', async ({ page }) => {
  await load(page);
  await addFirstProduct(page);
  await openBag(page);
  await page.locator('#checkoutTriggerBtn').click();
  for (const id of ['checkoutName', 'checkoutAddress', 'checkoutCity', 'checkoutEmail']) {
    await expect(page.locator(`#${id}`)).toHaveValue('');
    await expect(page.locator(`#${id}`)).not.toHaveAttribute('placeholder');
  }
  const apple = page.getByRole('radio', { name: 'Apple Pay' });
  await expect(apple).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await expect(apple).toHaveCSS('color', 'rgb(255, 255, 255)');
  await page.getByRole('radio', { name: 'Credit card' }).click();
  await expect(page.getByRole('radio', { name: 'Credit card' })).toHaveAttribute('aria-checked', 'true');
  await page.locator('#checkoutName').fill('Ada Customer');
  await page.locator('#checkoutAddress').fill('1 Main Street');
  await page.locator('#checkoutCity').fill('Ibadan');
  await page.locator('#checkoutEmail').fill('ada@example.com');
  await page.locator('#confirmPayBtn').click();
  await expect(page.locator('#orderSuccessScreen')).toBeVisible();
  const reference = (await page.locator('#orderTrackingNum').textContent()).trim();
  expect(reference).toMatch(/^AURA-\d{4}-/);
  await expect(page.locator('#continueShoppingBtn')).toHaveText('Return to Home');
  await page.locator('#continueShoppingBtn').click();
  await page.locator('[data-tab="profile"]').click();
  await expect(page.locator('#profileOrders')).toContainText(reference);
  await expect(page.locator('#profileOrders')).toContainText('Pending');
  await page.locator('#profileCloseBtn').click();
  await page.reload();
  await page.locator('[data-tab="profile"]').click();
  await expect(page.locator('#profileOrders')).toContainText(reference);
  await page.locator('#profileCloseBtn').click();
  await page.locator('[data-tab="admin"]').click();
  await expect(page.locator('#analyticsRevenue')).toHaveText('$299.00');
  await expect(page.locator('#analyticsOrders')).toHaveText('1');
  await expect(page.locator('#analyticsTopProducts')).toContainText('AURA ANC Over-Ear');
  await page.locator('[data-admin="inventory"]').click();
  await expect(page.locator('[data-stock-id="aura-01"]')).toHaveValue('17');
  await page.locator('[data-admin="orders"]').click();
  await expect(page.locator('#adminOrderBody')).toContainText(reference);
  await page.getByRole('button', { name: 'View details' }).click();
  await expect(page.locator('#orderDetails')).toContainText('1 Main Street');
  await expect(page.locator('#orderDetails')).toContainText('Credit Card');
  await page.locator('[data-admin-action="order-status"]').selectOption('shipped');
  await expect(page.locator('#orderDetails')).toContainText('Shipped');
  await page.locator('[data-admin="customers"]').click();
  await expect(page.locator('#adminCustomerBody')).toContainText('ada@example.com');
  await page.getByRole('button', { name: 'View history' }).click();
  await expect(page.locator('#customerHistory')).toContainText(reference);
  await expect(page.locator('#customerHistory')).toContainText('1 Main Street');
  await expect(page.locator('#customerHistory')).toContainText('Shipped');
  await page.locator('[data-admin="orders"]').click();
  await page.getByRole('button', { name: 'Record refund' }).click();
  await expect(page.locator('#confirmMessage')).toContainText('No payment will be returned');
  await page.locator('#confirmAccept').click();
  await expect(page.locator('#adminOrderBody')).toContainText('Refunded');
  await page.locator('[data-admin="analytics"]').click();
  await expect(page.locator('#analyticsRevenue')).toHaveText('$0.00');
  await page.locator('#adminCloseBtn').click();
  await page.locator('[data-tab="profile"]').click();
  await expect(page.locator('#profileOrders')).toContainText(reference);
  await expect(page.locator('#profileOrders')).toContainText('Refunded');
});

test('dark checkout selection is white with black text', async ({ page }) => {
  await load(page);
  await page.locator('#themeToggleBtn').click();
  await addFirstProduct(page);
  await openBag(page);
  await page.locator('#checkoutTriggerBtn').click();
  const selected = page.getByRole('radio', { name: 'Apple Pay' });
  await expect(selected).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(selected).toHaveCSS('color', 'rgb(0, 0, 0)');
  await selected.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Credit card' })).toHaveAttribute('aria-checked', 'true');
});

test('admin products, low stock and scheduled promotions work in the storefront', async ({ page }) => {
  await load(page);
  await page.locator('[data-tab="admin"]').click();
  await page.locator('[data-admin="products"]').click();
  await page.locator('#addProductBtn').click();
  await page.locator('#productName').fill('Desk lamp <special>');
  await page.locator('#productCategory').selectOption('living');
  await page.locator('#productPrice').fill('80');
  await page.locator('#productStock').fill('2');
  await page.locator('#productTags').fill('Desk, New');
  await page.locator('#productDescription').fill('A small desk lamp.');
  await page.locator('#adminProductForm button[type="submit"]').click();
  const row = page.locator('#adminProductBody tr').filter({ hasText: 'Desk lamp <special>' });
  await expect(row).toBeVisible();
  await expect(row.locator('special')).toHaveCount(0);
  await row.getByRole('button', { name: 'Edit' }).click();
  await page.locator('#productPrice').fill('85');
  await page.locator('#adminProductForm button[type="submit"]').click();
  await expect(row).toContainText('$85.00');
  await page.locator('[data-admin="inventory"]').click();
  const inventoryRow = page.locator('#adminInventoryBody tr').filter({ hasText: 'Desk lamp <special>' });
  await expect(inventoryRow).toContainText('Low stock');
  await page.locator('[data-admin="discounts"]').click();
  await page.locator('#addPromoBtn').click();
  await page.locator('#promoCode').fill('SAVE20');
  await page.locator('#promoPercent').fill('20');
  await page.locator('#adminPromoForm button[type="submit"]').click();
  await expect(page.locator('#adminPromoBody')).toContainText('SAVE20');
  await page.locator('#adminCloseBtn').click();
  await page.locator('#searchInput').fill('Desk lamp <special>');
  const card = page.locator('.product-card').filter({ hasText: 'Desk lamp <special>' });
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: /Save Desk lamp/ }).click();
  await card.getByRole('button', { name: 'Add to bag' }).click();
  await openBag(page);
  await page.locator('#promoInput').fill('save20');
  await page.locator('#promoApplyBtn').click();
  await expect(page.locator('#cartDiscount')).toContainText('$17.00');
  await expect(page.locator('#cartTotal')).toHaveText('$83.00');
  await page.locator('#promoRemoveBtn').click();
  await expect(page.locator('#cartDiscountRow')).toBeHidden();
  await expect(page.locator('#cartTotal')).toHaveText('$100.00');
  await page.locator('#cartCloseBtn').click();
  await page.locator('[data-tab="admin"]').click();
  await page.locator('[data-admin="products"]').click();
  await page.locator('#adminProductBody tr').filter({ hasText: 'Desk lamp <special>' }).getByRole('button', { name: 'Delete' }).click();
  await page.locator('#confirmAccept').click();
  await expect(page.locator('#adminProductBody')).not.toContainText('Desk lamp <special>');
  await page.locator('#adminCloseBtn').click();
  await expect(page.locator('#navCartBadge')).toHaveText('0');
  await page.locator('[data-tab="wishlist"]').click();
  await expect(page.locator('#wishlistItemsList')).toContainText('Nothing saved yet');
  await page.reload();
  await page.locator('[data-tab="admin"]').click();
  await page.locator('[data-admin="discounts"]').click();
  await expect(page.locator('#adminPromoBody')).toContainText('SAVE20');
});

test('mobile navigation, admin and checkout remain usable without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await load(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.locator('[data-tab="admin"]').click();
  await expect(page.locator('#adminModal')).toBeVisible();
  await page.locator('[data-admin="discounts"]').click();
  await expect(page.locator('#admin-discounts')).toBeVisible();
  await page.locator('#adminCloseBtn').click();
  await addFirstProduct(page);
  await openBag(page);
  await page.locator('#checkoutTriggerBtn').click();
  await expect(page.locator('#checkoutForm')).toBeVisible();
  const bounds = await page.locator('#checkoutModal').boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  const reference = await completeCheckoutFromOpenForm(page);
  await expect(page.locator('#orderTrackingNum')).toHaveText(reference);
});

async function completeCheckoutFromOpenForm(page) {
  await page.locator('#checkoutName').fill('Mobile Customer');
  await page.locator('#checkoutAddress').fill('2 Main Street');
  await page.locator('#checkoutCity').fill('Ibadan');
  await page.locator('#checkoutEmail').fill('mobile@example.com');
  await page.locator('#confirmPayBtn').click();
  await expect(page.locator('#orderSuccessScreen')).toBeVisible();
  return (await page.locator('#orderTrackingNum').textContent()).trim();
}
