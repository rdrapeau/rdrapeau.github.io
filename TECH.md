# rdrapeau.github.io Technical Documentation

## Overview
This is a static GitHub Pages site hosting personal project showcases, mapped to the custom domain **[drapeau.dev](https://drapeau.dev)**.

## Architecture

### Main Site (`index.html`)
- Static HTML with inline CSS and vanilla JavaScript
- Automatic dark mode via `prefers-color-scheme: dark`
- Scroll-triggered fade-in animations with `prefers-reduced-motion` accessibility support
- **Segmented Site Navigation Tabs**: Deep-linkable tabs (`#projects` and `#research`) with sliding active pill state, keyboard shortcuts (`1` for Projects, `2` for Research), and hash history synchronization.
- **Interactive "Show, Don't Tell" Micro-Visualizers**: Zero-dependency HTML5 Canvas simulation preview widgets embedded on both project cards and research paper cards (Monte Carlo fan charts, exposure fusion scrubbers, stroke telemetry, peer argumentation lift curves, and multimodal tactile diagram scanners) with real-time pointer scrubbing and high-DPI retina scaling.
- **Academic Research & BibTeX System**: Displays 5 peer-reviewed publications with Google Scholar integration, citation badges, venue pills, DOI links, and one-click BibTeX copy with toast feedback.
- Displays project cards sorted dynamically by last updated build date
- Uses JavaScript `fetch()` to load `./<project>/build-info.json` from each project directory
- **Path-Relative Design**: All links, images, and fetch requests use relative paths (`./`) so the site functions identically at the root domain (`drapeau.dev/`) or within preview subdirectories (`drapeau.dev/preview/pr-<number>/`).

### Build Date System
Each project generates a `build-info.json` file during its build process containing:
```json
{
  "buildDate": "Jan 2026",
  "timestamp": "2026-01-30T06:11:21.889Z"
}
```

The main `index.html` fetches these files and sorts the project cards dynamically by descending timestamp.

### Projects
- **fi_sim** - Vue 3 + Vite financial projection simulator & scenario modeler (`base: './'`)
- **org_planning** - Vite + React app for Monte Carlo org planning simulations (`base: './'`)
- **connections** - Next.js app (static export to `out/` directory)
- **stitch_by_number** - Vite + React + TypeScript app for needlepoint design (`base: './'`)
- **photo_stacker** - Vite + React + TypeScript app for HDR exposure fusion (`base: './'`)
- **rowing_performance** - Vite + React + Tailwind app for Concept2 rowing analytics (`base: './'`)

### Deployment & Environments

GitHub Pages is served from the **`gh-pages`** branch.

#### 1. Production Deployment (`master`)
- Workflow: `.github/workflows/static.yml`
- Triggers on: Push to `master` branch.
- Action: Uses `peaceiris/actions-gh-pages` with `keep_files: true` to publish `master` to the root of `gh-pages` without wiping out active PR preview subdirectories.

#### 2. Staging & PR Previews
- Workflow: `.github/workflows/preview.yml`
- Triggers on: `pull_request` (`opened`, `synchronize`, `reopened`, `closed`).
- Action: Uses `rossjrw/pr-preview-action` to:
  - Deploy PR builds to `preview/pr-<number>/` on `gh-pages`.
  - Automatically comment on the PR with the live URL: `https://drapeau.dev/preview/pr-<number>/`.
  - Automatically clean up and delete `preview/pr-<number>/` when the PR is merged or closed.

## Directory Structure
```
rdrapeau.github.io/
├── .github/
│   └── workflows/
│       ├── static.yml           # Production deploy workflow
│       └── preview.yml          # PR preview staging workflow
├── index.html                   # Main landing page (relative paths)
├── drapeau.jpg                  # Profile headshot
├── CNAME                        # Custom domain configuration (drapeau.dev)
├── README.md                    # Repository documentation
├── TECH.md                      # Technical documentation
├── CHANGELOG.md                 # Project changelog
├── fi_sim/                      # Vite build output
│   ├── build-info.json
│   └── assets/
├── org_planning/                # Vite build output
│   ├── build-info.json
│   └── assets/
├── connections/                 # Next.js static export
│   ├── build-info.json
│   └── _next/
├── stitch_by_number/            # Vite build output
│   ├── build-info.json
│   └── assets/
├── photo_stacker/               # Vite build output
│   ├── build-info.json
│   └── assets/
└── rowing_performance/          # Vite build output
    ├── build-info.json
    └── assets/
```
