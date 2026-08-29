# Changelog

All notable changes to this project will be documented in this file.

## [2026-08-28] - Staging Environments & PR Previews

### Added
- Pull Request preview environments workflow (`.github/workflows/preview.yml`) using `rossjrw/pr-preview-action`
- Automated PR comments with direct preview URLs (`https://drapeau.dev/preview/pr-<number>/`) and automatic cleanup on PR close
- `README.md` documenting the site, projects, and deployment architectures

### Changed
- Converted all asset links, image sources, and `fetch()` calls in `index.html` from absolute (`/`) to relative (`./`) paths
- Updated subproject Vite configurations (`org_planning`, `fi_sim`, `photo_stacker`, `stitch_by_number`, `rowing_performance`) to use relative base paths (`base: './'`)
- Migrated GitHub Pages deployment workflow (`.github/workflows/static.yml`) to deploy to the `gh-pages` branch while preserving preview directories
- Updated `TECH.md` architecture and directory structure documentation

## [2026-03-19] - Added Rowing Performance Analyzer

### Added
- New project card for the Rowing Performance Analyzer (Concept2 rowing analytics)
- Built and deployed the app to `/rowing_performance/` subdirectory
- Created `generate-build-info.js`, favicon.svg, and deploy script for the rowing_performance project
- Added 6th `.fade-in.visible:nth-child(6)` animation delay

## [2026-02-21] - Added 1Password Extension Project

### Added
- New project card for the 1Password OPVault Firefox Extension linking to https://github.com/rdrapeau/1password_extension
- Added official project icon SVG and "In Development" tag to the card
- Added `.fade-in.visible:nth-child(5)` animation delay for the new card

## [2026-02-10] - Dark Mode, Animations & In Development Tag

### Added
- Automatic dark mode via `prefers-color-scheme: dark` media query (follows browser/OS setting)
- Subtle fade-in-on-scroll animations for header and project cards using `IntersectionObserver`
- Hover lift effect (`translateY(-2px)`) on project cards
- `prefers-reduced-motion` accessibility support — animations disabled when user prefers reduced motion
- "In Development" badge/tag for the Photo Stacker project card
- Reusable `.tag` and `.tag-in-development` CSS classes for project status badges

## [2026-01-30] - Build Date Automation

### Changed
- Replaced brittle sed-based build date updates with automatic detection system
- Each project now generates `build-info.json` during build with timestamp metadata
- Main `index.html` fetches build dates dynamically via JavaScript
- Removed macOS-specific sed commands from all project deploy scripts

### Added
- `generate-build-info.js` to org_planning, stitch_by_number, and connections projects
- JavaScript in `index.html` to fetch and display build dates from `build-info.json`
- TECH.md documentation for the site architecture

### Technical Details
- Build dates now display as "Jan 2026" format (month + year)
- Falls back to "--" if `build-info.json` doesn't exist
- Cross-platform compatible (no sed dependency)
