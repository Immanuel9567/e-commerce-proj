# Continuous integration

`tests.yml` in this directory is ready to use, but it is **not active**. GitHub only runs workflows from `.github/workflows/`, and the GitHub App connection used to push this repository is not permitted to create or update workflow files:

```
refusing to allow a GitHub App to create or update workflow
`.github/workflows/tests.yml` without `workflows` permission
```

Until that permission is granted, checks are run locally before opening a pull request.

## Activating it

Either of these works:

1. **Move the file in the GitHub web UI.** Create `.github/workflows/tests.yml` through the repo's "Add file" editor and paste in the contents of `ci/tests.yml`. Commits made in the browser are not subject to the App's workflow restriction.
2. **Push with a credentialed human account or token that has the `workflow` scope**, for example `gh auth login` locally, then `git mv ci/tests.yml .github/workflows/tests.yml` and push.

After the file is on the default branch, it runs on every pull request and on pushes to `main`. Keep `ci/tests.yml` in sync if the steps change, or delete it once the real workflow is live.

## What it runs

- `npm ci`
- `npm test` — business-logic and jsdom tests, no browser needed
- `npx playwright install --with-deps chromium`
- `npm run test:e2e` — the config starts its own static server on port 8000
- Uploads `playwright-report/` and `test-results/` only when a step fails

Runner: GitHub-hosted `ubuntu-latest`, Node 22, npm caching, 15-minute timeout, read-only `contents` permission. Actions are pinned at `v7`.

## Local equivalent

```sh
npm ci
npm test
npx playwright install chromium   # once
npm run test:e2e
```
