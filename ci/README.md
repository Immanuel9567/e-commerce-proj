# Continuous integration

> **Action needed from a maintainer:** this workflow is ready but switched off. You can enable it in about a minute from the GitHub website — see [Activating it](#activating-it). No local setup, token or command line is required.

`tests.yml` in this directory is ready to use, but it is **not active**. GitHub only runs workflows from `.github/workflows/`, and the GitHub App connection used to push this repository is not permitted to create or update workflow files:

```
refusing to allow a GitHub App to create or update workflow
`.github/workflows/tests.yml` without `workflows` permission
```

Until that permission is granted, checks are run locally before opening a pull request.

## Activating it

**Easiest, works in the browser with no setup:**

1. Open [`ci/tests.yml`](tests.yml) in this repository on GitHub and press **Copy raw file** (or select all and copy).
2. In the repository, choose **Add file → Create new file**.
3. Type `.github/workflows/tests.yml` as the filename (the slashes create the folders).
4. Paste the contents and commit straight to `main`, or open a pull request with it.

Commits made in the browser are not subject to the App restriction that blocked the automated push. The workflow then runs on every pull request and on pushes to `main`.

**Alternative, from a terminal with your own GitHub account:**

```sh
git clone https://github.com/Immanuel9567/e-commerce-proj
cd e-commerce-proj
mkdir -p .github/workflows
git mv ci/tests.yml .github/workflows/tests.yml
git commit -m "Activate CI workflow"
git push
```

A personal token or `gh auth login` session with the `workflow` scope is required.

Once `.github/workflows/tests.yml` exists on `main`, delete this note and `ci/tests.yml` so there is only one copy to maintain.

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
