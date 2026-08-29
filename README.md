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

## Technical Documentation

For detailed architecture, build scripts, and directory structures, see [TECH.md](TECH.md).
