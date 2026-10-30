# Changelog

This file records meaningful repository changes and the checks that support them. See [agent.md](agent.md) for the required entry and handoff rules. Dates use the owner's local date; `Unreleased` means the work is not yet part of a named release.

## Unreleased — 2026-10-30

### Added and changed — product details and hero

- Replaced the product quick-view modal with a responsive, full details page at a reloadable `?product=<id>` URL. Product images and titles in the collection, featured hero, saved items and bag now link to it, with normal keyboard, new-tab and browser-history behavior.
- Added product descriptions, prices, ratings and available specifications alongside finish, size, quantity, saved-item and bag controls. Availability reflects local inventory and bag changes; missing products have a clear return-to-collection state. Search, Home and Shop continue to work from a product page.
- Selected variants now use checkout's inverse theme colors: black with white text in light mode, and white with black text in dark mode. Removed the everyday-collection badge, headline, description and Explore CTA while retaining the featured image and metadata in a simplified hero.
- Updated the contributor guardrails and README. The URL does not synchronize local data: products created or edited in Admin still exist only in that browser. These changes have not been deployed to the public Vercel site.

### Verification — product details and hero

- The initial focused tests failed against the old hero and modal as expected. A later link test's ambiguous locator was corrected, and a 320px hero-metadata overlap was fixed.
- Headless Chromium intermittently failed to create a new tab after an unprevented trusted Ctrl/middle click. The stable test verifies the modified click is not intercepted and opens the actual link in another page; it passed 20 repeated runs. Native new-tab clicks also succeeded in individual runs but were unreliable in this sandbox.
- `npm test` passed **8/8** business-logic tests. `LD_LIBRARY_PATH=/tmp/al2023/lib:$LD_LIBRARY_PATH PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/tmp/chromium npm run test:e2e` passed **37/37** browser tests in sandbox Chromium, including all 14 built-in product links, variant checkout, search, history, new tabs, keyboard focus, stock, missing products, local-product links and cross-tab updates.
- Reviewed light/dark desktop and mobile screenshots and checked layout geometry from 320px to 1365px. JavaScript syntax, documentation links, duplicate DOM IDs and `git diff --check` passed. No physical-device or public-deployment test was performed.

### Fixed — blue tap highlight

- Disabled the browser's default tap-highlight overlay across the storefront and admin, including nested and dynamically rendered controls. The existing visible keyboard-focus indicator and subtle UI glow remain available.
- Updated the contributor guardrail so future changes preserve this behavior. This follow-up has not been deployed to the public Vercel site.

### Verification — blue tap highlight

- Before the fix, mobile Chromium emulation reported the browser's default blue `rgba(51, 181, 229, 0.4)` tap highlight and the new regression test failed as expected. After the fix, nested storefront/admin controls use a transparent tap highlight; simulated taps and keyboard focus were verified.
- `npm test` passed **8/8** business-logic tests. `LD_LIBRARY_PATH=/tmp/al2023/lib:$LD_LIBRARY_PATH PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/tmp/chromium npm run test:e2e` passed **22/22** browser tests using sandbox Chromium. No physical-device test was performed.
- JavaScript syntax checks and `git diff --check` passed.

### Changed — mobile navigation pill

- Changed the mobile bottom navigation from a full-width bar to a floating, rounded pill, with a pressed-style active tab and space for device safe areas. Desktop navigation remains unchanged.
- Reserved space below the page and raised other notifications so the pill does not obstruct the footer or overlap toast messages. Updated the agent guardrail to preserve the pill shape.
- This follow-up has not been deployed to the public Vercel site.

### Verification — mobile navigation pill

- The new pill-geometry check failed against the original full-width bar as expected. A theme-color check initially sampled too early and was corrected to wait for the style update.
- `npm test` passed **8/8** business-logic tests. `LD_LIBRARY_PATH=/tmp/al2023/lib:$LD_LIBRARY_PATH PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/tmp/chromium npm run test:e2e` passed **20/20** browser tests using sandbox Chromium.
- Checked the pill, touch targets, footer spacing, keyboard navigation and panel interactions from 320px to 680px; reviewed screenshots in light and dark themes. JavaScript syntax and `git diff --check` also passed.

### Changed — mobile UI follow-up

- Restored fixed, labeled bottom navigation on mobile while retaining the desktop top navigation. This supersedes the earlier removal of the bottom navigation; all six storefront sections remain available, with room for the bottom safe area.
- Removed the visible leading “Search” label while keeping an accessible label; the placeholder and search behavior remain unchanged.
- Kept mobile product cards in two columns, including narrow screens, and adjusted their contents to fit.
- Replaced theme-change toasts with borderless, theme-aware gradient messages that fade in and out at the top right on desktop and mobile. Other notifications retain their existing style.
- Updated the contributor guardrails and hosted-demo note to reflect the current navigation and deployment workflow. These UI changes have not been deployed to the public Vercel site in this follow-up.

### Verification — mobile UI follow-up

- Before implementation, the new targeted checks failed as expected for the old visible search label, top mobile navigation and missing theme notice. An additional 421px test exposed card-footer overflow and passed after the layout adjustment.
- `npm test` passed **8/8** business-logic tests. `LD_LIBRARY_PATH=/tmp/al2023/lib:$LD_LIBRARY_PATH PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/tmp/chromium npm run test:e2e` passed **19/19** browser tests using a sandbox-specific Chromium binary.
- Checked mobile navigation and two-column cards at 320, 390, 420, 421, 480 and 680 pixels, including panel interactions and overflow; checked theme feedback on mobile and desktop. Reviewed mobile/desktop screenshots, JavaScript syntax, documentation links and `git diff --check`.

### Added

- Rebuilt the storefront's browser-local state and admin demo for products, inventory, customers, orders and references, promotions and local analytics. New order references are saved in Account and reflect local status changes.
- Added percentage and fixed-amount discount codes plus scheduled automatic sales. Manual codes take precedence and discounts do not stack.
- Added local product images and fonts, Node business-logic tests, Playwright browser tests and local run/test instructions.

### Changed

- Refined responsive navigation and accessibility, themed sorting and notifications, cart scrolling, checkout/payment selection and admin tables to match the requested storefront behavior. Checkout fields start blank and order completion offers a return home.
- Removed the requested hints, header cart/wishlist icons, bottom navigation and embossed brand text; labeled icons and replaced hover pop effects with a subtle glow.

### Documentation

- Added a planning-only [roadmap](ROADMAP.md), [mind map](MINDMAP.md), [agent/contributor instructions](agent.md), [agent discovery pointer](AGENTS.md) and this changelog, using the recoverable guidance in `.for agent`. No roadmap implementation phase has been started.

### Deployment

- Created the `e-commerce-proj` Vercel project and linked the GitHub repository. The public production demo is https://e-commerce-proj-umber.vercel.app/; Vercel reported it **READY** and **PROMOTED** from session-branch commit `88a0372abf0cb369e821debfa12418f7149ae050`. `main` was not changed. The project's configured production branch is `main`; future deployments from it can replace the demo until this work is merged.
- The first production API request was rejected because Vercel requires initial project settings that the connector could not provide. A Git-triggered deployment initialized and published the project instead. The public project domain was accessible without a login; the generated deployment-specific URL was protected by Vercel sign-in.

### Verification

- `npm test` passed **8/8** business-logic tests.
- `LD_LIBRARY_PATH=/tmp/al2023/lib:$LD_LIBRARY_PATH PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/tmp/chromium npm run test:e2e` passed **9/9** browser tests in this sandbox. Other environments can use Playwright's installed Chromium as described in the README.
- `node --check` passed for the application scripts and unit test; the documentation's relative links and `git diff --check` passed.
- An external page fetch loaded the public site with 14 rendered products, and the hosted CSS and application scripts were reachable. An external image metadata service fetched all six locally hosted JPEGs successfully. Vercel's deployment file-tree API returned 404; direct sandbox `curl` access to Vercel was blocked by network restrictions, so interactive browser tests were run locally rather than against the public domain.

### Known limitations

- This is a local-storage demo: admin access is unrestricted and data is not shared across browsers/devices. Do not enter real customer or payment information.
- Checkout and refunds do not move money; cancellation/refund does not automatically restock. References generated by the old checkout without saved orders cannot be recovered.
- Supabase, authenticated authorization, a payment provider and real fulfillment are not integrated. See the roadmap before considering production use.
