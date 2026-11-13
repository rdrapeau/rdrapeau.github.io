# drapeau.dev (rdrapeau.github.io)

Personal website and showcase for side projects, hosted on GitHub Pages with custom domain [drapeau.dev](https://drapeau.dev).

## Architecture

- **Landing Page (`index.html`)**: Lightweight static HTML with vanilla CSS (including automatic dark mode and scroll animations), vanilla JavaScript, and interactive "Show, Don't Tell" Canvas micro-widgets embedded on project cards.
- **Dynamic Project Sorting**: `index.html` dynamically fetches `build-info.json` from each project subfolder and sorts project cards by last build date.
- **Portability**: All asset, image, and project links use relative paths (`./`) so the site functions identically at the root domain or inside subdirectories.

## Hosted Projects

- **[fi_sim](./fi_sim/)** - Client-side privacy-first financial simulator & scenario modeler (Vue 3 + Vite).
- **[org_planning](./org_planning/)** - Monte Carlo simulation tool for engineering leaders to model organizational growth and promotions (React + Vite).
- **[connections](./connections/)** - Wedding word puzzle game (Next.js static export).
- **[stitch_by_number](./stitch_by_number/)** - Image to needlepoint design converter with thread color mapping and PDF export (React + TypeScript + Vite).
- **[photo_stacker](./photo_stacker/)** - HDR exposure fusion in the browser (React + TypeScript + Vite).
- **[rowing_performance](./rowing_performance/)** - Concept2 rowing analytics and VO₂ Max estimator (React + Tailwind + Vite).

---

## Deployment & Staging Workflows

GitHub Pages is configured to deploy from the **`gh-pages`** branch.

### 1. Production Deployment (`master`)
Pushing to the `master` branch triggers [`.github/workflows/static.yml`](.github/workflows/static.yml), which:
- Syncs the latest `master` files to the root of the `gh-pages` branch.
- Preserves existing PR preview directories (`keep_files: true`).

### 2. Pull Request Previews (Staging)
Opening or updating any Pull Request triggers [`.github/workflows/preview.yml`](.github/workflows/preview.yml), which:
- Deploys the PR build to `https://drapeau.dev/preview/pr-<number>/` on the `gh-pages` branch.
- Posts/updates an automated comment on the PR with the live preview link.
- Automatically cleans up and deletes `preview/pr-<number>/` when the PR is closed or merged.

---

## Testing

The repository includes both a zero-dependency native Node.js structural test suite and an end-to-end browser test suite powered by [Playwright](https://playwright.dev/):

```bash
# Run fast native unit & repository integrity tests (<120ms, zero dependencies)
npm test

# Run cross-browser Playwright E2E tests (Chromium, Firefox, WebKit, Mobile Safari, Mobile Chrome)
npm run test:e2e

# Run Playwright E2E tests in Chromium only
npm run test:e2e:chromium

# Run everything
npm run test:all
```

### 1. Repository Integrity & Structural Tests (`test/`)
- **Path & Asset Relativity (`test/paths.test.mjs`)**: Enforces `AGENTS.md` Rule #2 — verifies all internal assets, images, and `fetch()` calls use relative paths (`./`) and exist on disk.
- **Subproject Integrity (`test/subprojects.test.mjs`)**: Enforces `AGENTS.md` Rule #3 — verifies all subprojects have `index.html` and `build-info.json` with valid timestamps.
- **HTML & Document Structure (`test/html-structure.test.mjs`)**: Verifies semantic HTML5 standards, responsive viewports, tab badge count synchronization, filter button counts, and accessibility (`target="_blank"` rel safety, img alt tags, reduced motion).
- **Easter Eggs & Interactive Hooks (`test/easter-eggs.test.mjs`)**: Verifies the "Le Drapeau" French flag emoji hover interaction, accessible button roles, and JavaScript initializers.

### 2. Cross-Browser E2E Tests (`e2e/`)
- **Navigation & Tabs (`e2e/navigation.spec.mjs`)**: Tests tab switching, deep-link hash routing, and keyboard shortcuts (`1`, `2`, `3`, `4`).
- **Filter Bar (`e2e/filter.spec.mjs`)**: Tests project filtering by status (`Live Projects (5)`, `In Development (2)`, `All (7)`).
- **Interactive Visualizers (`e2e/interactive-visualizers.spec.mjs`)**: Tests canvas rendering, scrubber pointer telemetry tracking, and ensures zero uncaught runtime exceptions.
- **Le Drapeau Easter Egg (`e2e/drapeau-easter-egg.spec.mjs`)**: Tests surname hover morphing, tap toggling, and keyboard accessibility (`Enter`/`Space`).
- **Responsive Layout & Accessibility (`e2e/accessibility-responsive.spec.mjs`)**: Tests mobile 2x2 tab grid without horizontal overflow, dark/light theme color scheme switching, and asset load response codes.

---

## Technical Documentation

For detailed architecture, build scripts, and directory structures, see [TECH.md](TECH.md).
