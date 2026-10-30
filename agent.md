# Agent and contributor instructions

These rules apply to work in this repository. Follow higher-priority instructions and the owner's explicit requests; do not treat a generic skill catalogue as permission to change the approved scope. [AGENTS.md](AGENTS.md) points tools here. The original material is in [`.for agent`](.for%20agent/); its skill catalogue is partially corrupted and duplicated, so use its recoverable guidance rather than assuming it is valid JSON or that every named tool exists.

## Before changing anything

1. Read the owner's request, `README.md`, `ROADMAP.md`, this file, `CHANGELOG.md`, the relevant source/tests and `git status`. Inspect the current diff/history before drawing conclusions; preserve unrelated changes.
2. Separate existing behavior from planned work. The present storefront/admin is a **browser-local demo**, not an authenticated or shared production store. Payments and refunds are not processed.
3. For a new feature, architecture or substantial UI change, brainstorm options, write a small design and acceptance criteria, and get owner approval before implementation. Ask focused questions for decisions that cannot safely be inferred. Do not implement roadmap phases merely because they are listed.
4. Make a small, reviewable plan and identify the tests and risks before editing. Respect the current branch and repository workflow; do not reset, overwrite or remove work without permission.

## Relevant skills and how to use them

Use a named skill if it is actually available in the current environment; otherwise follow the equivalent practice manually. Do not claim to have run an unavailable skill.

| Situation | Relevant catalogue guidance | Expected practice |
| --- | --- | --- |
| New or unclear work | `brainstorming`, `writing-plans` | Clarify the problem, explore tradeoffs, obtain design approval, then plan incremental steps. |
| Feature or behavior change | `test-driven-development`, `feat-dev` | Add a focused failing test when practical, implement the smallest safe change, then refactor and run regression tests. |
| Bug or unexpected behavior | `systematic-debugging`, `structured-debugging`, `bugfix` | Reproduce, isolate the root cause, fix it and add a regression test; avoid speculative patches. |
| UI and accessibility | `design-an-interface`, `design-taste-frontend`, `ui-ux-pro-max`, `e2e-testing` | Preserve the approved design; test keyboard, responsive layouts, focus, labels and user flows. Treat generic design preferences as guidance for new work, not a reason to redesign existing typography without approval. |
| Security or deployment | `vercel-security-audit`, `verification-before-completion` | Review authorization, secrets, exposed data and deployment configuration; verify the actual result, not an assumed one. |
| Docs, handoff or review | `docs-update-from-d.`, `docs-audit-and-refresh`, `handoff`, `requesting-code-review` | Compare documentation with the actual diff; update the changelog, verification and outstanding risks in the same change. |

Some entries in the source catalogue are truncated, interleaved or unrelated to this project. Apply only guidance relevant to the task and compatible with the owner's instructions.

## Product and security guardrails

- Preserve explicitly requested UI behavior unless the owner changes it: no hints/example comments in the interface and no header cart or wishlist icons. Use labeled bottom navigation on mobile and top navigation on desktop. Keep visible text labels for icons on all screen sizes, subtle glow rather than hover pop, a minimal brand-badge shadow, and no embossed “studio” text.
- Keep mobile product cards in two columns, retain an accessible search label without visible leading label text, and show theme-change feedback as a borderless gradient that fades at the top right.
- Keep checkout fields blank, selected-payment styling appropriately inverted by theme, and background scrolling locked while the cart is open. New saved order references must remain visible in the profile.
- Browser storage is neither a security boundary nor a shared database. Do not describe the local admin, checkout or refunds as production-ready or imply real money has moved.
- For future backend work, design and test server-side authorization, least-privilege RLS, role isolation, safe state transitions and payment webhook verification. Never expose service-role keys, credentials or unnecessary customer data to the client, Git, logs or screenshots.
- Do not apply remote database migrations, change production settings, migrate customer data or enable real payment/refund actions without explicit owner approval. Use non-production environments and backups where appropriate.
- Keep third-party assets and dependencies licensed and minimal. Do not silently remove the existing local fonts or redesign the site to satisfy a generic style preference.

## Changelog: mandatory on every substantive change

Update [CHANGELOG.md](CHANGELOG.md) **in the same change** as code, configuration, deployment or documentation work so another collaborator can understand what happened without reconstructing the conversation.

1. Add an entry under `Unreleased` or the appropriate dated release, using the current date and concise `Added`, `Changed`, `Fixed`, `Security`, `Deployment` or `Documentation` headings as relevant.
2. Explain the user-visible behavior or operational change and why it matters. Mention important files, migrations, environment/configuration changes and compatibility impacts where useful. Keep entries readable; do not paste a raw diff or secrets.
3. Record actual verification commands and outcomes, including failures, skipped checks, environment prerequisites and known limitations. Never claim a check passed if it was not run.
4. Record rollout/rollback or migration instructions and deployment URL/source when relevant, plus decisions and follow-up work. Clearly label planned, pending and completed work.
5. Preserve prior entries; add corrections rather than silently rewriting history. If a task is documentation-only, say so and do not imply planned features were implemented.

## Verification and handoff

- For this static app, start locally with `npm start`; run `npm test` and `npm run test:e2e` for affected behavior. Install dependencies and Playwright's Chromium as described in `README.md`; disclose any environment-specific browser setup or tests you cannot run.
- Inspect relevant diffs and run `git diff --check`. For UI changes, exercise desktop/mobile, keyboard/focus, themes and affected flows; supplement screenshots with actual interactions.
- Confirm the deployed version matches the intended source and check availability and asset loading when deploying. Report protection/authentication requirements and any limitations.
- End with a concise summary, commands/results, remaining risks and how the owner or another collaborator can continue. Do not invent results. For snippets in a response, briefly explain their purpose and use fenced code blocks.
