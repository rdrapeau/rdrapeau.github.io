---
name: pages-pr-preview-workflow
description: >-
  Standard workflow for developing, testing, and deploying changes to rdrapeau.github.io (drapeau.dev).
  Enforces opening all new changes, bugfixes, and subproject deployments on feature branches as Pull Requests
  to verify in ephemeral preview environments (https://drapeau.dev/preview/pr-<number>/) before merging to master.
---

# GitHub Pages PR Preview & Deployment Workflow

This skill defines the standard development, preview, and deployment lifecycle for `rdrapeau.github.io` ([drapeau.dev](https://drapeau.dev)).

## Core Principles

1. **Never Commit Directly to `master`**: All new features, project additions, bug fixes, or documentation updates MUST go through a feature branch and Pull Request.
2. **Path Portability**: All asset URLs, favicons, project links, and `fetch()` requests in `index.html` MUST use relative paths (`./`) so they function seamlessly both at the root domain (`https://drapeau.dev/`) and within preview subdirectories (`https://drapeau.dev/preview/pr-<number>/`).
3. **Subproject Build Isolation**: When building subprojects (Vite, Next.js, etc.), configurations must output relative assets (`base: './'` in `vite.config.*`).
4. **Automated Ephemeral Staging**: Every PR automatically provisions an isolated staging environment at `https://drapeau.dev/preview/pr-<number>/` on the `gh-pages` branch, and automatically tears it down on PR merge/closure.
5. **Continuous Test Coverage**: Every new feature, UI interaction, project addition, or Easter egg MUST include automated tests in `test/` (integrity) and/or `e2e/` (Playwright). All tests must pass locally before opening a PR.

---

## Step-by-Step Workflow

### 1. Create a Feature Branch
Always start from an up-to-date `master` branch:

```bash
git checkout master
git pull origin master
git checkout -b <branch-type>/<short-description>
```

Branch naming conventions:
- `feat/...` for new features or projects
- `fix/...` for bug fixes or path corrections
- `docs/...` for documentation updates
- `chore/...` for build tooling or workflow updates

---

### 2. Implement Changes & Write Automated Tests

#### A. When editing `index.html`:
- Use `./drapeau.jpg` instead of `/drapeau.jpg`
- Use `./<project>/` instead of `/<project>/`
- Use `fetch('./' + project + '/build-info.json')` for dynamic metadata loading

#### B. When adding or updating a subproject:
1. Ensure the subproject's `vite.config.*` has `base: './'`.
2. Run the build/deploy script in the subproject directory:
   ```bash
   cd <project_dir>
   npm run deploy # or npm run build
   ```
3. Copy the distribution files into `rdrapeau.github.io/<project>/`.
4. Verify `rdrapeau.github.io/<project>/build-info.json` exists with `timestamp` and `buildDate`.
5. Add/update the project card in [`index.html`](file:///Users/drapeau/Documents/Developer/rdrapeau.github.io/index.html).
6. Document changes in [`CHANGELOG.md`](file:///Users/drapeau/Documents/Developer/rdrapeau.github.io/CHANGELOG.md), [`README.md`](file:///Users/drapeau/Documents/Developer/rdrapeau.github.io/README.md), and [`TECH.md`](file:///Users/drapeau/Documents/Developer/rdrapeau.github.io/TECH.md).

#### C. When adding a new feature, project, or interaction:
1. Add structural/integrity tests in `test/` (`paths.test.mjs`, `subprojects.test.mjs`, `html-structure.test.mjs`, `easter-eggs.test.mjs`).
2. Add cross-browser and mobile interaction tests in `e2e/` (`navigation.spec.mjs`, `filter.spec.mjs`, `interactive-visualizers.spec.mjs`, etc.).
3. Never weaken or delete existing tests unless functionality is intentionally deprecated.

---

### 3. Run Local Tests & Open a Pull Request

Run the test suite locally and verify all checks pass:

```bash
# Run unit & repository integrity tests (<120ms)
npm test

# Run Playwright E2E tests
npm run test:e2e:chromium
```

Commit changes with descriptive commit messages and push to GitHub:

```bash
git add .
git commit -m "feat/fix: <description of change>"
git push -u origin <branch-name>
```

Open a Pull Request against `master` using the GitHub CLI (`gh`):

```bash
gh pr create --base master --head <branch-name> --title "<PR Title>" --body "<Detailed description of changes>"
```

---

### 4. Verify Staging Preview & Request User Approval

1. Watch the PR preview workflow:
   ```bash
   gh run list --limit 3
   ```
2. The `.github/workflows/preview.yml` action will:
   - Deploy the branch build to `preview/pr-<number>/` on the `gh-pages` branch.
   - Leave a comment on the PR with the live preview link: `https://drapeau.dev/preview/pr-<number>/`.
3. Check the live preview URL to verify:
   - Layout, styling, and dark mode render properly.
   - Project cards and favicons load without 404s.
   - Project cards sort dynamically by build date.
   - Sub-app navigation works properly.
4. **MANDATORY STOP — Present to User & Wait for Approval**:
   - Provide the PR URL and preview URL (`https://drapeau.dev/preview/pr-<number>/`) to the user.
   - **DO NOT autonomously merge the PR**.
   - End your turn and wait for the user to review the staging environment and give explicit approval.

---

### 5. Merge and Deploy to Production (Only After Explicit User Approval)

**Only after the user has explicitly approved the PR in the conversation**:

1. Merge the PR and delete the feature branch:
   ```bash
   gh pr merge <pr-number> --merge --delete-branch
   ```
2. Pull the latest `master` locally:
   ```bash
   git checkout master
   git pull origin master
   ```
3. Monitor production deployment:
   - The `.github/workflows/preview.yml` cleanup job automatically deletes `preview/pr-<number>/` from `gh-pages`.
   - The `.github/workflows/static.yml` job deploys `master` to `gh-pages` root.
   - GitHub Pages publishes the updated site to **[https://drapeau.dev](https://drapeau.dev)**.
4. Verify the production URL `https://drapeau.dev`.

---

## Troubleshooting & Checklist

- **Broken assets or 404s on preview**: Check if any paths in `index.html` or subproject bundles start with `/` instead of `./`.
- **Preview not deploying**: Check that the repository has `Workflow permissions: Read and write` enabled in **Settings** → **Actions** → **General**.
- **`gh-pages` branch deployment**: Ensure GitHub Pages source is set to **Deploy from a branch** with branch **`gh-pages`** and folder **`/ (root)`**.
