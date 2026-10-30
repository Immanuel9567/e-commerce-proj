# V8's storefront

A static storefront with a locally persisted admin preview. Run it from the project directory:

```sh
npm start
```

Open `http://localhost:8000` and use **Admin** in the main navigation. Products, bag contents, saved items, promotions, customers, order references, inventory and order statuses are stored in this browser's local storage. Existing `aura_cart` and `aura_wishlist` data are imported on first use.

## Hosted demo

The public demo is at **https://e-commerce-proj-umber.vercel.app/**. The Vercel project is linked to this GitHub repository and lists `main` as its production branch. Changes on a session branch do not appear on the public site until they are merged or explicitly deployed to production. See the [changelog](CHANGELOG.md) for deployment history and status.

Hosting does not synchronize browser-local data or process payments. The public URL is an unauthenticated demo; do not enter real customer or payment information.

Promotions can be percentage or fixed-amount codes, or automatic sales with optional start and end dates. Discounts apply to the subtotal, not shipping; a manually applied code takes precedence over automatic sales, which do not stack.

## Important limitations

- This is not a production admin system: anyone using the page can open Admin, data is not shared between devices, and clearing browser storage removes it. Do not enter real customer or payment information.
- Checkout does not collect payment or submit a real order. Refunds only record a local status; no money is returned. Stock is reduced when a local order is placed; cancellations and refunds do not automatically restock items.
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

## Project documentation

- [Roadmap](ROADMAP.md) and [mind map](MINDMAP.md) — proposed future work and approval gates. No roadmap implementation phase has started.
- [Agent and contributor instructions](agent.md) — relevant skills, guardrails, verification and mandatory changelog rules. [AGENTS.md](AGENTS.md) is the discovery pointer.
- [Changelog](CHANGELOG.md) — completed changes, verification and known limitations.
- [Original planning materials](.for%20agent/) — the source roadmap and skill catalogue.
