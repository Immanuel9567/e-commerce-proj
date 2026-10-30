# Storefront and admin roadmap

**Status: planning only.** This roadmap is based on [the original plan](.for%20agent/implementation%20roadmap.md) and the applicable guidance in [the skill catalogue](.for%20agent/Agent%20skills.txt). All future phases below are **not started**. Review and approve the scope and design of a phase before implementing it. The [mind map](MINDMAP.md) gives a visual overview.

## Where we are

The current site is a static HTML/CSS/JavaScript storefront with a browser-local admin demo. Catalog edits, cart and saved items, promotions, customers, stock, orders and order references live in the current browser's storage. The admin is not access-controlled; data does not sync across browsers or devices. Checkout, payment and refunds are simulations. Supabase is proposed in the source plan but is **not configured or integrated** here. A Vercel deployment makes the demo available online; it does not make its data shared or secure.

The source plan's schema → security → APIs → admin lists → forms → analytics sequence is retained below. The current local UI is a prototype to preserve and adapt, not proof that the future backend phases are complete.

## Decisions and approval gates

Before starting a phase, agree on its design, acceptance criteria, dependencies and rollout/rollback. Do not create a Supabase project, apply migrations, connect payment services or migrate customer data without the owner's approval.

- Confirm the Supabase project, region, environments, budget and who can access them. Decide how development, staging and production are isolated.
- Confirm whether products are physical, digital or both; the currencies, markets, taxes, delivery methods and refund/return policies. Do not infer these from the owner's location.
- Choose the payment provider and order/payment/refund state model; approve the fulfillment and customer-support workflows.
- Define team roles, invitations, account recovery, who can see customer information, and who may issue refunds or change roles.
- Decide what, if any, browser-local products or demo orders should be imported, with consent, a backup and a duplicate-handling plan. Previously generated but unsaved order references cannot be reconstructed.
- Review privacy, retention, deletion, audit-log, backup and incident-response requirements; decide whether historical orders are archived or retained immutably instead of deleted.

## Phase 0 — design and delivery plan

**Status: not started** · Depends on owner decisions above.

- [ ] Inventory the current data model and UX; identify which demo behavior must be retained, replaced or explicitly retired.
- [ ] Agree on architecture: Supabase Postgres, Auth and RLS for data access; server-side functions/endpoints for privileged or payment-related operations. Select any other services deliberately.
- [ ] Define entity relationships, role permissions, order/payment state transitions, error handling and a safe local-demo-to-backend migration plan.
- [ ] Break the approved design into small testable changes and document any dependencies, costs and operational risks.

**Acceptance:** the owner has approved an actionable design and phase order, with unresolved decisions recorded rather than guessed.

## Phase 1 — database, identity and authorization

**Status: not started** · Depends on Phase 0 approval.

- [ ] Create versioned, reviewable Postgres migrations and a rollback/restore procedure for profiles and roles, products, product variants, stock, orders and order-item snapshots. Plan customer, promotion and audit records as needed. Variants need stable SKUs, attributes such as size/color, prices and stock quantities.
- [ ] Define appropriate constraints, indexes and archival/soft-delete behavior. Keep historical order items and financial records auditable; do not hide or delete them merely because a product is archived.
- [ ] Configure Supabase Auth and server-controlled role assignments. Proposed roles are **admin**, **fulfillment** and **viewer**, alongside ordinary customers. A customer must never be able to grant themselves a staff role.
- [ ] Enable RLS and least-privilege policies on every exposed table. Anonymous users may read only published catalog information; customers may read only their own appropriately limited order information; staff receive only their approved permissions. Ordinary customers must not read other customers' orders or private inventory. Exact inventory counts, customer PII and audit logs are not public.
- [ ] Keep service-role keys and payment secrets on trusted servers only; never ship them in HTML, JavaScript, Git, logs or a public Vercel environment variable. Protect storage uploads as well as database rows.
- [ ] Write automated positive and negative tests for anonymous users, customers, each staff role and attempted role escalation.

**Acceptance:** migrations are reproducible in an approved non-production environment, authorization/RLS tests pass, and a security review confirms there is no client-side privilege boundary or exposed secret.

## Phase 2 — secure admin and commerce actions

**Status: not started** · Depends on Phase 1.

- [ ] Design and implement authenticated, validated server-side actions or APIs; authorize each operation by role, not just by whether the caller can open an admin page. Keep viewer access read-only and decide exact fulfillment permissions with the owner.
- [ ] Support paginated product CRUD, variants, prices, stock adjustments and product archiving; preserve order snapshots. Use concurrency-safe transactions and validation for stock and money.
- [ ] Implement allowed fulfillment transitions, initially considering Pending → Processing → Shipped → Delivered, with explicit cancellation, payment and refund rules. Reject illegal jumps on the server, not only in the UI.
- [ ] Maintain an audit trail for sensitive changes, including actor, action, time and target; avoid recording secrets or unnecessary personal information. Define failure behavior and retention.
- [ ] Introduce payment/refund actions only after a provider is approved. Calculate totals and prices server-side, use idempotency for orders/refunds, and verify signed provider webhooks. Never mark an actual payment or refund successful solely because a browser says so.

**Acceptance:** API/action tests cover authorization, invalid input, illegal state changes, audit events, stock races and payment webhook/idempotency behavior. Unauthorized or duplicate requests cannot change protected data.

## Phase 3 — shared admin shell and lists

**Status: not started** · Depends on the relevant Phase 2 APIs.

- [ ] Adapt the existing responsive admin to authenticated roles without discarding the current visual style or accessibility requirements. Evaluate a collapsible sidebar, breadcrumbs and profile controls against the approved design.
- [ ] Add reusable, accessible data tables with server-side pagination, search and filters, including loading, empty and error states.
- [ ] Connect product/inventory and order lists. Include order ID, customer, date, total and fulfillment status; identify low stock, initially using the source plan's **fewer than 5** threshold unless the owner chooses another value.
- [ ] Ensure role-restricted actions are absent or disabled as appropriate; the server remains the final authority.

**Acceptance:** approved users can work with real, paginated non-production data on desktop and mobile, while role boundaries and accessible controls are verified end to end.

## Phase 4 — product, order and customer details

**Status: not started** · Depends on Phases 2–3.

- [ ] Build validated product/variant forms, including a manageable size/color matrix, unique SKU, price, stock and image handling; show actionable validation errors.
- [ ] Provide order details, packing slip, tracking number and permitted fulfillment actions. Add explicit confirmations for archiving and any refund or other destructive operation.
- [ ] Show customers their own saved order references and current order status; allow authorized staff to access only the customer information needed for their duties.
- [ ] Replace local promotions with server-validated percentage/fixed codes and scheduled sales only after defining precedence, eligibility and audit behavior. Preserve the current non-stacking rule unless an approved design changes it.
- [ ] Handle payment, refund, inventory and network failures without suggesting money has moved when it has not.

**Acceptance:** forms and confirmations are tested against validation and authorization failures; an approved non-production order can be followed from creation through permitted fulfillment, with reliable status and reference history.

## Phase 5 — analytics and operations

**Status: not started** · Depends on trustworthy order, payment and inventory data from earlier phases.

- [ ] Agree on definitions for gross revenue, order count, average order value and low-stock count, including treatment of canceled/test orders, refunds, taxes, shipping and time zones.
- [ ] Add efficient, permission-aware database aggregations and a sales trend chart for approved ranges such as 24 hours, 7 days and 30 days; choose a library only if useful.
- [ ] Test totals against known fixtures and empty/large datasets. Explain when data is delayed or incomplete; do not label simulated sales as real revenue.
- [ ] Establish monitoring, error reporting, accessible support procedures, backup/restore tests, secret rotation and incident response.

**Acceptance:** dashboard numbers match independently checked fixtures, respect role and privacy rules, and operations owners can restore and troubleshoot the system.

## Phase 6 — production readiness and launch

**Status: not started** · Depends on acceptance of Phases 1–5 and explicit launch approval.

- [ ] Run security, accessibility, responsive, regression and end-to-end checks in a production-like environment; verify payment-provider test-mode and webhook behavior.
- [ ] Review Vercel and Supabase configuration, environment separation, domains, HTTPS, quotas, privacy disclosures and deployment protection. Never put privileged secrets in browser-exposed configuration.
- [ ] Rehearse data migration, backups and rollback; verify alerts and a named owner for operations. Obtain final sign-off before switching to real transactions.
- [ ] Launch incrementally, monitor errors and payments, and document the deployment, risks and recovery procedure in the changelog.

**Acceptance:** the owner approves a documented go/no-go checklist; real orders and payments are enabled only after security, payment and operational checks pass.

## Working agreement

Use [agent.md](agent.md) for skills, safety, test and changelog rules. Record each approved change and verification in [CHANGELOG.md](CHANGELOG.md). A completed phase requires passing its acceptance criteria and owner review; moving the checklist forward is not authorization to start the next phase.
