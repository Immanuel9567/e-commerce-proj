const { test, expect } = require('@playwright/test');

// These tests cover what the store's own defaults do. Other spec files pin USD
// because they assert cent-level arithmetic; the shipped default is naira, and
// that is asserted here rather than assumed anywhere else.

test('the store opens in naira and switches to dollars and back', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://images.unsplash.com/**', route => route.abort());
  await page.goto('/');

  const toggle = page.locator('#currencyToggleBtn');
  await expect(toggle).toContainText('NGN');
  await expect(page.locator('#featuredPrice')).toHaveText('₦403,058');
  await expect(page.locator('.product-card').first().locator('.price-current')).toHaveText('₦403,058');

  await toggle.click();
  await expect(toggle).toContainText('USD');
  await expect(page.locator('#featuredPrice')).toHaveText('$299.00');
  await expect(page.locator('.product-card').first().locator('.price-current')).toHaveText('$299.00');

  await toggle.click();
  await expect(toggle).toContainText('NGN');
  await expect(page.locator('#featuredPrice')).toHaveText('₦403,058');
});

test('the currency choice survives a reload and repaints the bag', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://images.unsplash.com/**', route => route.abort());
  await page.goto('/');
  await page.locator('#currencyToggleBtn').click(); // -> USD
  await page.reload();
  await expect(page.locator('#currencyToggleBtn')).toContainText('USD');

  await page.locator('.product-card').first().getByRole('button', { name: 'Add to bag' }).click();
  await page.locator('[data-tab="cart"]').click();
  await expect(page.locator('#cartTotal')).toHaveText('$299.00');

  // The bag is a modal, so the header is not clickable while it is open. Close
  // it, switch currency, and confirm the bag repaints in the new currency.
  await page.locator('#cartCloseBtn').click();
  await page.locator('#currencyToggleBtn').click(); // -> NGN
  await page.locator('[data-tab="cart"]').click();
  await expect(page.locator('#cartTotal')).toHaveText('₦403,058');
});

test('switching currency never changes what an order is worth', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://images.unsplash.com/**', route => route.abort());
  await page.addInitScript(() => {
    window.GREENCART_CONFIG = {
      payments: { publicKey: 'pk_test_e2e' }
    };
    window.PaystackPop = {
      setup(options) {
        return {
          openIframe() {
            window.__amount = options.amount;
            window.__currency = options.currency;
            Promise.resolve().then(() => options.callback({ reference: 'PSK-CUR' }));
          }
        };
      }
    };
  });
  await page.route('**/api/initialize-payment', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true, reference: 'PSK-CUR', amount: 40305798, currency: 'NGN' })
  }));
  await page.route('**/api/verify-payment', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true, reference: 'PSK-CUR', amountKobo: 40305798 })
  }));

  await page.goto('/');
  await page.locator('.product-card').first().getByRole('button', { name: 'Add to bag' }).click();
  await page.locator('[data-tab="cart"]').click();
  await page.locator('#checkoutTriggerBtn').click();
  await page.locator('#checkoutName').fill('Ada Customer');
  await page.locator('#checkoutAddress').fill('1 Main Street');
  await page.locator('#checkoutCity').fill('Port Harcourt');
  await page.locator('#checkoutEmail').fill('ada@example.com');
  await page.locator('#confirmPayBtn').click();
  await expect(page.locator('#orderSuccessScreen')).toBeVisible();

  // The charge was requested in the viewed currency, in its minor unit:
  // $299 at the pinned rate is ₦403,057.98, i.e. 40,305,798 kobo.
  expect(await page.evaluate(() => window.__currency)).toBe('NGN');
  expect(await page.evaluate(() => window.__amount)).toBe(40305798);

  // The order itself is still recorded against the same dollar value, so a
  // later rate change cannot rewrite what the customer bought.
  const totals = await page.evaluate(() => {
    const raw = JSON.parse(window.localStorage.getItem('greencart_store_v1'));
    return { total: raw.orders[0].total, subtotal: raw.orders[0].subtotal };
  });
  expect(totals.subtotal).toBe(299);
  expect(totals.total).toBe(299);
});
