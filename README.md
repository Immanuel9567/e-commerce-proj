# V8's storefront

A static storefront with a locally persisted admin preview. Run it from the project directory:

```sh
npm start
```

Open `http://localhost:8000` and use **Admin** in the main navigation. Products, bag contents, saved items, promotions, customers, order references, inventory and order statuses are stored in this browser's local storage. Existing `aura_cart` and `aura_wishlist` data are imported on first use.

All product images are served from `assets/images/` in this repository, so the storefront does not depend on a third-party image host. `tests/store.test.js` fails if a built-in product points at a remote URL or a missing file.

Product images and titles open a full details page at a reloadable URL such as `/?product=aura-01`. The built-in products can be opened from those links in another browser, but locally added or edited products do not sync: a link to a locally added product may show “Product not found” elsewhere, and edits to built-in products remain local.

## Hosted demo

The public demo is at **https://e-commerce-proj-umber.vercel.app/**. The Vercel project is linked to this GitHub repository and lists `main` as its production branch. Changes on a session branch do not appear on the public site until they are merged or explicitly deployed to production. See the [changelog](CHANGELOG.md) for deployment history and status.

Hosting does not synchronize browser-local data or process payments. The public URL is an unauthenticated demo; do not enter real customer or payment information.

Promotions can be percentage or fixed-amount codes, or automatic sales with optional start and end dates. Discounts apply to the subtotal, not shipping; a manually applied code takes precedence over automatic sales, which do not stack.

## Important limitations

- This is not a production admin system: anyone using the page can open Admin, data is not shared between devices, and clearing browser storage removes it. Do not enter real customer or payment information.
- Checkout does not collect payment or submit a real order. Refunds only record a local status; no money is returned. Stock is reduced when a local order is placed; cancellations restock items, refunds do not.
- Products are retired by **archiving**, not deleting. Archiving removes a product from the storefront, search, inventory and low-stock counts, and from bags and saved items, but keeps it in Admin under the **Archived** filter with every past order intact, and it can be restored. Permanent deletion is a two-step action available only on archived products, and it is refused outright for any product that appears in a past order.
- The earlier checkout generated reference codes without saving orders. Those past codes cannot be recovered from the old application; new orders retain the same reference in Account and Admin.
- A production deployment needs authenticated, role-restricted server/database access, shared storage, a payment provider and verified payment/refund events. Client-side access controls and local storage are not a security boundary.

## Tests

```sh
npm install
npm test
npx playwright install chromium
npm run test:e2e
```

The end-to-end tests start a local static server automatically. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can be set to use an existing Chromium binary.

When Playwright's own browser download is blocked but Node packages are reachable, a sandbox can still run the suite with a Chromium build plus its shared libraries shipped on npm: `@sparticuz/chromium` (not a project dependency). Decompress `bin/chromium.br` to an executable and `bin/al2023.tar.br` to a directory, then run:

```sh
LD_LIBRARY_PATH=/path/to/al2023/lib PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/path/to/chromium npm run test:e2e
```

This was verified with Chromium 153 in a Debian 12 sandbox; it does not replace a normal Playwright browser install for day-to-day use.

A CI workflow is prepared in [`ci/tests.yml`](ci/tests.yml) but is **not active yet**: the repository connection cannot write to `.github/workflows/`. See [`ci/README.md`](ci/README.md) to switch it on. Until then, run both suites locally before opening a pull request.

`npm test` runs two suites and needs no browser:

- `tests/store.test.js` — business logic (stock, promotions, checkout, order status flow, refunds).
- `tests/ui.test.js` — DOM smoke tests that load the real `index.html` in [jsdom](https://github.com/jsdom/jsdom) and check that products, admin order controls and the bag render correctly. jsdom does not apply layout or CSS, so use `npm run test:e2e` for visual and input behavior.

## Project documentation

- [Roadmap](ROADMAP.md) and [mind map](MINDMAP.md) — proposed future work and approval gates. No roadmap implementation phase has started.
- [Agent and contributor instructions](agent.md) — relevant skills, guardrails, verification and mandatory changelog rules. [AGENTS.md](AGENTS.md) is the discovery pointer.
- [Changelog](CHANGELOG.md) — completed changes, verification and known limitations.
- [Original planning materials](.for%20agent/) — the source roadmap and skill catalogue.
