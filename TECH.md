# rdrapeau.github.io Technical Documentation

## Overview
This is a static GitHub Pages site that hosts personal project showcases.

## Architecture

### Main Site (`index.html`)
- Static HTML with inline CSS and JavaScript
- Displays project cards with dynamically-fetched build dates
- Uses JavaScript `fetch()` to load `build-info.json` from each project directory

### Build Date System
Each project generates a `build-info.json` file during its build process containing:
```json
{
  "buildDate": "Jan 2026",
  "timestamp": "2026-01-30T06:11:21.889Z"
}
```

The main `index.html` fetches these files and updates the project cards dynamically. This replaced a brittle sed-based approach that required regex matching.

### Projects
- **org_planning** - Vite + React app for Monte Carlo org planning simulations
- **stitch_by_number** - Vite + React + TypeScript app for needlepoint design
- **connections** - Next.js app (static export to `out/` directory)

### Deployment
Each project has a `deploy` script in its `package.json` that:
1. Runs the build (which generates `build-info.json`)
2. Copies the dist/out folder to this repository

The GitHub Actions workflow (`.github/workflows/static.yml`) deploys on push to master.

## Directory Structure
```
rdrapeau.github.io/
├── index.html           # Main landing page
├── drapeau.jpg          # Profile image
├── org_planning/        # Vite build output
│   ├── build-info.json  # Build metadata
│   └── assets/          # JS/CSS bundles
├── stitch_by_number/    # Vite build output
│   ├── build-info.json  # Build metadata
│   └── assets/          # JS/CSS bundles
└── connections/         # Next.js static export
    ├── build-info.json  # Build metadata
    └── _next/           # Next.js assets
```
