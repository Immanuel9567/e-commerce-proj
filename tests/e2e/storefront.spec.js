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
  await expect(page.locator('.site-nav')).not.toHaveCSS('position', 'fixed');
  await expect(page.locator('.site-header svg')).toHaveCount(0);
  await page.locator('#sortTrigger').click();
  await expect(page.locator('#sortMenu')).toBeVisible();
  const lightMenu = await page.locator('#sortMenu').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(lightMenu).not.toBe('rgb(255, 255, 255)');
  await page.getByRole('option', { name: 'Price: low to high' }).click();
  await expect(page.locator('.product-card').first().locator('.price-current')).toHaveText('$48.00');
  await page.locator('#themeToggleBtn').click();
  await expect(page.locator('#themeNotice')).toHaveText('Dark mode enabled');
  await expect(page.locator('#themeNotice')).toHaveClass(/visible/);
  await expect(page.locator('#themeNotice')).toHaveCSS('opacity', '1');
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

test('search has an accessible label without a visible leading label', async ({ page }) => {
  await load(page);
  const search = page.getByRole('searchbox', { name: 'Search' });
  await expect(search).toBeVisible();
  await expect(page.locator('label[for="searchInput"]')).toHaveClass(/visually-hidden/);
  await search.fill('chronograph');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.locator('#searchClearBtn').click();
  await expect(search).toHaveValue('');
  await expect(page.locator('.product-card')).toHaveCount(14);
});

for (const width of [320, 390, 420, 421, 480, 680]) {
  test(`mobile navigation and two-column products fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await load(page);
    const nav = page.locator('.site-nav');
    await expect(nav).toHaveCSS('position', 'fixed');
    const navBox = await nav.boundingBox();
    expect(navBox.x).toBeGreaterThanOrEqual(10);
    expect(width - navBox.x - navBox.width).toBeGreaterThanOrEqual(10);
    expect(navBox.y).toBeGreaterThan(700);
    expect(844 - navBox.y - navBox.height).toBeGreaterThanOrEqual(10);
    expect(844 - navBox.y - navBox.height).toBeLessThanOrEqual(32);
    const radius = await nav.evaluate(element => parseFloat(getComputedStyle(element).borderTopLeftRadius));
    expect(radius).toBeGreaterThanOrEqual(navBox.height / 2);
    for (const name of ['Home', 'Shop', 'Saved', 'Bag', 'Account', 'Admin']) {
      const button = nav.getByRole('button', { name: new RegExp(`^${name}\\b`) });
      await expect(button).toBeVisible();
      const box = await button.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(navBox.x);
      expect(box.x + box.width).toBeLessThanOrEqual(navBox.x + navBox.width + 0.5);
      const dimensions = await button.evaluate(element => ({ width: element.clientWidth, scroll: element.scrollWidth }));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width + 1);
    }
    const cards = await page.locator('.product-card').evaluateAll(elements => elements.slice(0, 4).map(element => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, right: rect.right, width: rect.width };
    }));
    expect(cards).toHaveLength(4);
    expect(cards[0].y).toBeCloseTo(cards[1].y, 0);
    expect(cards[1].x).toBeGreaterThan(cards[0].x);
    expect(cards[2].y).toBeGreaterThan(cards[0].y);
    expect(cards[2].y).toBeCloseTo(cards[3].y, 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const overflow = await page.locator('.product-card').evaluateAll(elements => elements.flatMap(card => {
      const outer = card.getBoundingClientRect();
      return Array.from(card.querySelectorAll('.wishlist-btn, .product-title, .stars, .rating-count, .card-bottom, .add-cart-btn'))
        .filter(element => {
          const box = element.getBoundingClientRect();
          return box.left < outer.left - 1 || box.right > outer.right + 1 || element.scrollWidth > element.clientWidth + 1;
        }).map(element => element.className);
    }));
    expect(overflow).toEqual([]);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    const footer = await page.locator('.footer-content').boundingBox();
    expect(footer.y + footer.height).toBeLessThan(navBox.y);
  });
}

test('mobile navigation pill follows both themes and supports keyboard navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await load(page);
  const nav = page.locator('.site-nav');
  const home = nav.getByRole('button', { name: 'Home' });
  await expect(home).toHaveAttribute('aria-current', 'page');
  expect(await home.evaluate(element => getComputedStyle(element).boxShadow)).not.toBe('none');
  const lightBackground = await nav.evaluate(element => getComputedStyle(element).backgroundColor);
  await home.focus();
  await page.keyboard.press('Tab');
  await expect(nav.getByRole('button', { name: 'Shop' })).toBeFocused();
  await page.locator('#themeToggleBtn').click();
  await expect(page.locator('body')).toHaveClass(/dark-mode/);
  await expect.poll(() => nav.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(lightBackground);
  expect(await nav.evaluate(element => parseFloat(getComputedStyle(element).borderTopLeftRadius))).toBeGreaterThanOrEqual((await nav.boundingBox()).height / 2);
});

test('mobile bottom navigation opens all storefront panels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await load(page);
  const nav = page.locator('.site-nav');
  await nav.getByRole('button', { name: 'Shop' }).click();
  await expect(nav.getByRole('button', { name: 'Shop' })).toHaveAttribute('aria-current', 'page');
  for (const [button, panel, close] of [
    ['Saved', '#wishlistModal', '#wishlistCloseBtn'],
    [/^Bag\b/, '#cartDrawer', '#cartCloseBtn'],
    ['Account', '#profileModal', '#profileCloseBtn'],
    ['Admin', '#adminModal', '#adminCloseBtn']
  ]) {
    await nav.getByRole('button', { name: button }).click();
    await expect(page.locator(panel)).toHaveClass(/open/);
    await page.locator(close).click();
    await expect(page.locator(panel)).not.toHaveClass(/open/);
  }
});

for (const [layout, width, height] of [['desktop', 1280, 800], ['mobile', 390, 844]]) {
  test(`theme changes show a fading borderless gradient at the top right on ${layout}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await load(page);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const notice = page.locator('#themeNotice');
    await page.locator('#themeToggleBtn').click();
    await expect(notice).toHaveText('Dark mode enabled');
    await expect(notice).toHaveClass(/visible/);
    await expect.poll(() => notice.evaluate(element => Number(getComputedStyle(element).opacity))).toBeGreaterThan(0.95);
    const dark = await notice.evaluate(element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return { background: style.backgroundImage, border: style.borderTopWidth, transition: style.transitionProperty, top: rect.top, right: rect.right };
    });
    expect(dark.background).toContain('linear-gradient');
    expect(dark.border).toBe('0px');
    expect(dark.transition).toContain('opacity');
    expect(dark.top).toBeGreaterThanOrEqual(0);
    expect(dark.top).toBeLessThan(50);
    expect(dark.right).toBeCloseTo(width, 0);
    await page.locator('#themeToggleBtn').click();
    await expect(notice).toHaveText('Light mode enabled');
    expect(await notice.evaluate(element => getComputedStyle(element).backgroundImage)).not.toBe(dark.background);
    await expect(notice).not.toHaveClass(/visible/, { timeout: 5000 });
    await expect.poll(() => notice.evaluate(element => Number(getComputedStyle(element).opacity))).toBeLessThan(0.05);
  });
}
