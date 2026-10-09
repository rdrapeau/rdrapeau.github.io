# Changelog

All notable changes to this project will be documented in this file.

## [2026-10-08] - CI/CD Deployment Concurrency & GitHub Actions Modernization

### Fixed
- **Serialized `gh-pages` Deployment Concurrency**:
  - Configured shared `gh-pages-write` concurrency group with `cancel-in-progress: false` across `.github/workflows/static.yml` and `.github/workflows/preview.yml`.
  - Eliminates the race condition where simultaneous pushes to `gh-pages` (e.g. master deploy vs. PR preview cleanup on merge) caused git non-fast-forward rejection (`[rejected] gh-pages -> gh-pages (fetch first)`).
- **GitHub Actions Modernization & Deprecation Fixes**:
  - Upgraded `actions/setup-node` from deprecated `@v4` (targeting Node 20) to SHA-pinned `v7.1.0` (`actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1`) across `static.yml`, `preview.yml`, and `test.yml`, supporting native Node 24 runtime without runner warnings.
  - Upgraded `peaceiris/actions-gh-pages` from `v4.0.0` to SHA-pinned `v4.1.0` (`peaceiris/actions-gh-pages@84c30a85c19949d7eee79c4ff27748b70285e453`).
- **Automated Workflow Integrity Tests**:
  - Added `test/ci-workflows.test.mjs` with 4 automated structural tests verifying existence of all workflow configurations, concurrency groups, and action pin versions.

## [2026-10-08] - Machine-Readable AI Standards: llms.txt & llms-full.txt

### Added
- **`llms.txt` Standard Implementation**:
  - Added `/llms.txt` following the [llmstxt.org](https://llmstxt.org) standard, providing a clean, token-efficient Markdown index of Ryan Drapeau's background, side projects, Stripe technical writings, distributed systems patents, and academic research papers.
- **Companion `llms-full.txt` Dossier**:
  - Added `/llms-full.txt` containing the complete unabridged text and descriptions of all projects, writings, patent abstracts, and paper abstracts for instant single-fetch ingestion by LLMs and RAG agents.
- **HTML Alternate Link Discovery**:
  - Added `<link rel="alternate" type="text/markdown" href="./llms.txt" title="LLM Summary">` in `index.html` `<head>`.
- **Privacy Preservation & Location Anonymization**:
  - Maintained strict privacy preservation with `robots.txt` (`User-agent: *`, `Disallow: /`) and `index.html` (`<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">`) to block all general search crawlers, scrapers, and automated bots.
  - Omitted personal geographic location details from `llms.txt` and `llms-full.txt` for personal privacy.
  - Hosted `llms.txt` and `llms-full.txt` statically at the site root for direct URL access and targeted AI ingestion.
- **Automated Tests**:
  - Added 5 structural unit tests in `test/html-structure.test.mjs` verifying `llms.txt`, `llms-full.txt`, `meta name="robots"` noindex rules, `robots.txt` Disallow policy, and omission of personal location data.
  - Added 2 Playwright E2E tests in `e2e/accessibility-responsive.spec.mjs` verifying HTTP 200 delivery of `/llms.txt`, `/llms-full.txt`, and crawler disallowance in `/robots.txt`.

## [2026-10-08] - WCAG 2.1 & 2.2 Level AA Accessibility Improvements

### Added
- **Skip-to-Content Navigation**:
  - Implemented an accessible skip link `<a href="#main-content" class="skip-link">Skip to main content</a>` as the first focusable body element, smoothly animating into the viewport on keyboard focus and jumping directly to `#main-content`.
- **Semantic Landmark Architecture**:
  - Wrapped core portfolio tab panels in `<main id="main-content">`.
  - Wrapped portfolio navigation tabs in `<nav class="site-tabs-nav" aria-label="Portfolio Sections">` landmark.
- **WAI-ARIA Roving Tabindex & Tablist Navigation**:
  - Declared roving tabindex on tab buttons (`tabindex="0"` on the active tab, `tabindex="-1"` on inactive tabs).
  - Added keyboard navigation support for `Home` (jump to first tab) and `End` (jump to last tab) keys alongside existing arrow key cycling.
- **Filter Toolbar Semantics (`role="toolbar"` & `aria-pressed`)**:
  - Added `role="toolbar"` and `aria-label="Filter projects by status"` to `.filter-bar`.
  - Added `aria-pressed` states to Live, In Development, and All buttons, synchronized dynamically in `applyFilter()`.
- **Canvas Micro-Visualizer Semantics**:
  - Tagged all 7 interactive canvas preview widgets with `role="img"` and screen-reader accessible `aria-label` descriptions explaining their visualizations.
- **Strict Heading Hierarchy (H1 &rarr; H2 &rarr; H3)**:
  - Standardized all 26 portfolio card titles (7 projects, 4 writing pieces, 10 patents, 5 research papers) from unsemantic `div.project-name` into `h3.project-name`.
  - Updated `#drapeau-name` accessible name to `"Drapeau (French for flag 🇫🇷)"` to eliminate duplicated speech synthesis announcements in the H1 title.
- **Color Contrast & Touch Targets**:
  - Remediated light mode `.scholar-link`, inactive `.site-tab`, and `.section-subheading` colors to exceed WCAG AA 4.5:1 contrast against light backgrounds.
  - Remediated dark mode `.badge-app`, `.venue-uw`, `.venue-ec`, and `.section-subheading` colors to exceed WCAG AA 4.5:1 contrast against dark backgrounds.
  - Enhanced high-contrast `:focus-visible` rings across cards, links, tabs, and interactive elements.
  - Increased header social icon touch targets to `min-height: 36px`.
- **Automated Tests**:
  - Added 7 structural integrity tests in `test/html-structure.test.mjs` verifying skip link, main landmark, nav landmark, canvas image roles, h3 heading hierarchy, filter toolbar `aria-pressed`, and roving tabindex attributes.
  - Added 5 end-to-end browser tests in `e2e/accessibility-responsive.spec.mjs` testing keyboard skip link reveal/activation, filter `aria-pressed` state toggles, tablist arrow/Home/End keyboard navigation, canvas labels, and heading structure.

## [2026-10-07] - Modern Web Standards Suite: Speculation Rules, Searchable Hidden Tabs, Color Scheme, Web Manifest & CSS Enhancements

### Added
- **Speculation Rules API**:
  - Implemented `<script type="speculationrules">` with moderate prefetching rules for 6 internal subprojects (`fi_sim`, `org_planning`, `connections`, `stitch_by_number`, `photo_stacker`, `rowing_performance`), providing instantaneous navigations upon hover/interaction.
- **Searchable Hidden Tabs (`hidden="until-found"` & `beforematch`)**:
  - Replaced `style="display: none;"` with HTML standard `hidden="until-found"` on inactive tabs.
  - Full text across Writing, Patents, and Research is now indexed by browser Find-in-Page (Ctrl/Cmd+F).
  - Wired `beforematch` event handlers to activate and reveal tabs automatically when a search match occurs.
- **Root Color Scheme & Dual Theme Colors**:
  - Declared `color-scheme: light dark;` on `:root` to notify browser UI, form controls, and scrollbars of native dark/light rendering capability.
  - Added dual adaptive `<meta name="theme-color">` tags matching light (`#fafafa`) and dark (`#0f1117`) backgrounds for native browser address bar / mobile status bar tinting.
- **Progressive Web App (PWA) Manifest**:
  - Added `manifest.webmanifest` linked via `<link rel="manifest" href="./manifest.webmanifest">` declaring standalone display mode, application shortcuts, icons, and theme colors for home screen installation.
- **Modern CSS Typography & Layout Performance**:
  - Added `text-wrap: balance;` to section and card headings to eliminate typographic orphans.
  - Added `text-wrap: pretty;` to descriptive copy for optimal line breaking.
  - Configured project cards with `content-visibility: auto;` and `contain-intrinsic-size: auto 160px;` to skip layout and rendering work for off-screen cards until scrolled into view.
  - Added `container-type: inline-size;` to project and item card grids for future container query responsiveness.
- **Largest Contentful Paint (LCP) Prioritization**:
  - Added `fetchpriority="high"` to the hero headshot avatar image (`img.headshot`).
- **Automated Tests**:
  - Added 9 structural integrity tests in `test/html-structure.test.mjs` verifying color-scheme declarations, theme-color meta tags, webmanifest existence and validity, Speculation Rules JSON, `hidden="until-found"`, `fetchpriority="high"`, CSS properties, and `beforematch` listeners.
  - Added cross-browser E2E assertions in `e2e/navigation.spec.mjs` and `e2e/accessibility-responsive.spec.mjs` testing `beforematch` event simulation, Speculation Rules script attachment, computed color-scheme, and webmanifest HTTP 200 delivery.

## [2026-10-07] - Modern Web Standards & SEO: View Transitions API & Schema.org JSON-LD

### Added
- **Native View Transitions API**:
  - Implemented progressive-enhancement tab transitions using `document.startViewTransition()` to smoothly cross-fade and morph `.tab-content.active-panel` state when navigating between **Projects**, **Writing**, **Patents**, and **Research**.
  - Respects accessibility standards with automatic bypass and zero-animation execution under `@media (prefers-reduced-motion: reduce)`.
- **Schema.org JSON-LD Structured Data**:
  - Embedded rich semantic microdata in `<script type="application/ld+json">` covering:
    - `Person`: name, job title (Principal ML Engineer), affiliation (Stripe), education (University of Washington), sameAs profiles, and core competency entities.
    - `ProfilePage`: canonical site entity binding.
    - `ItemList` of `ScholarlyArticle`: complete metadata for all 5 peer-reviewed publications.
    - `ItemList` of `Patent`: complete metadata for all 10 Stripe inventions and patents.
- **Automated Tests**:
  - Added structural integrity tests in `test/html-structure.test.mjs` verifying Schema.org JSON-LD syntax, entity graph completeness, and View Transitions CSS/JS rules.
  - Added cross-browser E2E assertions in `e2e/navigation.spec.mjs` verifying `.active-panel` state updates during tab switches and JSON-LD DOM presence.

## [2026-10-07] - Reordered Portfolio Sections: Projects, Writing, Patents, Research

### Changed
- **Reordered Portfolio Sections & Tabs**: Updated navigation tab buttons and document sections in `index.html` to the exact order: **Projects**, **Writing**, **Patents**, **Research**.
- **Keyboard Shortcuts & Arrow Navigation**: Updated numeric keyboard shortcuts (`1` for Projects, `2` for Writing, `3` for Patents, `4` for Research) and tab button arrow-key sequence to reflect the new order.
- **Test Suite Updates**:
  - `test/html-structure.test.mjs`: Added DOM ordering integrity assertions verifying tab buttons and section panels match the Projects &rarr; Writing &rarr; Patents &rarr; Research sequence.
  - `e2e/navigation.spec.mjs`: Updated Playwright tests to verify tab switching sequence, numeric shortcuts, and arrow-key navigation in the updated order.

## [2026-09-02] - Guidance Update: Strict Test Coverage & Continuous Verification

### Added
- **Repository Guidelines & Workflow Policy**: Updated `AGENTS.md` and `pages-pr-preview-workflow` skill:
  - Enforces running automated tests locally (`npm test` and `npm run test:e2e:chromium`) before committing or opening a PR.
  - Requires writing corresponding structural/integrity tests (`test/`) and/or browser interaction tests (`e2e/`) whenever adding any new feature, project, tab, filter, canvas visualizer, Easter egg, or metadata.

## [2026-09-02] - Cross-Browser Playwright E2E Test Suite

### Added
- **Playwright End-to-End Browser Test Suite (`e2e/`)**: Configured comprehensive cross-browser and mobile device testing across Chromium, Firefox, WebKit (Safari), Mobile Chrome (Pixel 5), and Mobile Safari (iPhone 12):
  - `e2e/navigation.spec.mjs`: Tests smooth tab switching, URL hash routing, history sync, and keyboard navigation shortcuts (`1`, `2`, `3`, `4`).
  - `e2e/filter.spec.mjs`: Tests project filter buttons (`Live Projects (5)`, `In Development (2)`, `All (7)`).
  - `e2e/interactive-visualizers.spec.mjs`: Tests HTML5 canvas simulations rendering, pointer scrubbing interaction, and zero uncaught runtime errors.
  - `e2e/drapeau-easter-egg.spec.mjs`: Tests the "Le Drapeau" French flag hover morphing, tap toggling for touch devices, and keyboard accessibility (`Enter`/`Space`).
  - `e2e/accessibility-responsive.spec.mjs`: Tests mobile 2x2 grid responsiveness without overflow, dark/light mode styles, and resource HTTP status checks.
- **Lightweight Test Server (`scripts/serve.mjs`)**: Added a zero-dependency static file server with correct MIME types, caching, and range support for Playwright test executions.
- **CI Workflow Enhancement (`.github/workflows/test.yml`)**: Added parallel CI jobs for fast unit/integrity checks (`7s`) and automated Playwright E2E tests in Chromium.

## [2026-09-02] - Automated CI Test Suite & Repository Rule Validation

### Added
- **Automated Zero-Dependency Test Suite (`test/`)**: Implemented a comprehensive test suite powered by Node.js native test runner (`node:test`) and assertions (`node:assert`):
  - `test/paths.test.mjs`: Validates `AGENTS.md` Rule #2 (Path & Asset Relativity) ensuring all internal links, images, assets, and `fetch()` calls use relative paths (`./`) and exist on disk.
  - `test/subprojects.test.mjs`: Validates `AGENTS.md` Rule #3 (Subproject Integrity) ensuring all 6 hosted subprojects have `index.html` and `build-info.json` with valid timestamps.
  - `test/html-structure.test.mjs`: Validates HTML5 doctype, UTF-8 charset, responsive viewport, social OpenGraph tags, tab badge count synchronization (Projects, Research, Patents, Writing), filter button counts, and accessibility (`target="_blank"` rel safety, img alt tags, reduced motion).
  - `test/easter-eggs.test.mjs`: Validates the "Le Drapeau" French flag emoji hover Easter egg DOM structure, accessible ARIA roles, CSS transitions, and JavaScript initializers.
- **GitHub Actions Integration**: Added `.github/workflows/test.yml` running `npm test` on PRs and master pushes, and added automated test verification steps to `.github/workflows/preview.yml` and `.github/workflows/static.yml` to prevent regressions before preview or production deployment.

## [2026-09-02] - Streamlined Project Cards: Removed Technology Tags

### Removed
- **Project Technology Tags**: Removed `.project-tags` badges (e.g., Vue 3, React, TypeScript, Next.js, Monte Carlo) from all project cards on the Projects tab for a cleaner, decluttered card aesthetic focused directly on project outcomes and interactive canvas previews.
- **Unused Tag CSS**: Cleaned up obsolete `.project-tags` and `.tech-tag` stylesheet rules in both light and dark modes.

## [2026-09-02] - Le Drapeau: French Flag Emoji Hover Easter Egg

### Added
- **"Le Drapeau" French Flag Emoji Hover Interaction**: Added a subtle, delightful Easter egg honoring the French translation of *Drapeau* (*flag* 🇫🇷):
  - **Hover & Touch Swap**: When hovering over (or tapping on mobile) "Drapeau" in the header heading (`Ryan Drapeau`), the surname smoothly morphs into a French flag emoji (`Ryan 🇫🇷`) using CSS transforms and opacity transitions.
  - **Zero Jank Layout Preservation**: Uses an inline grid container (`display: inline-grid; grid-template-areas: "content"`) ensuring seamless in-place swapping without layout shift.
  - **Accessibility & Focus Support**: Provides `title="Drapeau is French for flag 🇫🇷"`, accessible `aria-label`, keyboard activation (`Enter` / `Space`), and full `prefers-reduced-motion` compliance.

## [2026-08-31] - 2x2 Grid Mobile Navigation & Balanced Filter Layout

### Changed
- **2x2 Segmented Navigation Grid**: Redesigned `.site-tabs` on mobile (`@media (max-width: 639px)`) into an intuitive 2-row, 2-column grid (`Projects (7)`, `Research (5)`, `Patents (10)`, `Writing (4)`):
  - 100% discoverability: all 4 tabs and count badges remain fully visible at a glance on mobile without horizontal scrolling.
  - Large tap targets: expanded tab buttons to `min-height: 44px` conforming to Apple Human Interface Guidelines and WCAG 2.5.5 touch target criteria.
  - Centered tile layout with full icons, labels, and badges preserved across all phone viewports down to 320px.
- **3-Column Equal Filter Bar**: Formatted `.filter-bar` into a 3-column grid (`Live (5)`, `In Dev (2)`, `All (7)`) on mobile, eliminating awkward wrapping of the "All" pill button onto a second line.
- **Accessible Touch Heights**: Increased `.social-link` and `.filter-btn` touch target heights to 42px on mobile screens.

## [2026-08-30] - Added Writing & Talks Tab

### Added
- **Writing & Talks Tab**: Added 4th navigation tab (`Writing` [4]) to `.site-tabs` with keyboard shortcut `4`, arrow key cycling, and deep-linking `#writing` URL hash synchronization.
- **4 Technical Writing & Talk Cards**:
  - **How we built it: Stripe Radar** (*Stripe Dot Dev Blog*): Deep dive on the architectural decisions, feature generation pipelines, and engineering lessons behind Stripe's ML fraud detection system evaluating 1,000+ signals in <100ms.
  - **Lessons Learned Building Stripe Radar** (*Stripe Developers / YouTube*): Video presentation covering real-time feature engineering, neural network architectures (ResNets), explainability trade-offs, and managing the ML flywheel.
  - **Ryan Drapeau: Battling Fraud with ML at Stripe** (*The Gradient Podcast, Episode 82*): In-depth conversation on global ML defense networks, extreme fraud data scarcity (<0.1%), adversarial dynamics, and model training velocity.
  - **Optimizing payments at scale: How Stripe applies AI across the payment lifecycle** (*Stripe Guides*): Comprehensive guide on deploying adaptive AI models across pre-auth risk scoring, smart network routing, adaptive 3D Secure, and intelligent retry engines.
- **Minimalist Clean Card Design**: Clean, typography-focused cards without tags, badges, or dates for maximum signal-to-noise ratio.

## [2026-08-29] - Mobile Responsiveness & Touch Interaction Optimization

### Added
- **Mobile Responsive Layout Breakpoints**: Added comprehensive `@media (max-width: 639px)` and `@media (max-width: 380px)` styles:
  - Responsive body padding adapting from 72px down to 36px on mobile viewports ($\le 639\text{px}$) and 32px on compact phones ($\le 380\text{px}$).
  - Full-width flexible segmented navigation tabs (`.site-tabs` and `.site-tab`) with centered labels, auto-scaling badges, and compact icon sizing to eliminate horizontal page overflow ($478\text{px} \to 375\text{px} / 320\text{px}$).
  - Mobile-friendly wrapping for social header links and filter pill buttons.
  - Responsive card padding and header wrapping for project, research, and patent cards.
- **Touch Gesture & Interaction Safety**:
  - Added `touch-action: pan-y` on `.preview-canvas-wrapper` to ensure seamless vertical page scrolling across interactive canvas previews without touch interception.
  - Added touch tap toggle support on *Connections* micro-visualizer so mobile users can tap to solve/shuffle without requiring desktop hover.
  - Prevented card link navigation on canvas scrubbing/dragging so interactions do not trigger accidental page changes.
- **Accessible Touch Target Sizes**:
  - Increased `.site-tab` buttons to 42px min-height.
  - Increased `.filter-btn` pills to 38px min-height.
  - Increased `.social-link` elements to 38px min-height.

## [2026-08-29] - Added Patents & Inventions Tab

### Added
- **Patents & Inventions Tab**: Added third navigation tab (`Patents` [10]) to `.site-tabs` with keyboard shortcut `3`, bidirectional arrow key cycling, and `#patents` hash synchronization.
- **10 Patent Cards**: Added cards for all 10 patents across Machine Learning Fraud Detection, Payment Orchestration, Privacy-Preserving Cryptography, and Distributed Systems at Stripe:
  - *Systems and methods for identity graph based fraud detection* (`US Patent 11,704,673`)
  - *Systems and methods for secure identifiers for electronic transactions* (`US 2025/0125969 A1`)
  - *Systems and methods for hard deletion of data across systems* (`US 2024/0126908 A1`)
  - *Systems and methods for privacy preserving fraud detection during electronic transactions* (`US 2025/0117802 A1`)
  - *Merchant specific machine learning model for fraud detection* (`US 2025/0165978 A1`)
  - *Systems and methods for enhanced transaction authentication* (`US 2024/0112192 A1`)
  - *Systems and methods for smart remediation for transactions* (`US 2024/0152924 A1`)
  - *Fraud detection using real-time and batch features* (`US 2024/0161115 A1`)
  - *Systems and methods for machine learning feature generation* (`EP 4627492 A1`)
  - *Machine learning model training and deployment pipeline* (`US 2024/0070484 A1`)
- **Interactive Card & Badge Styling**: Full-card clickable anchors linking to Google Patents with hover lift, pointer cursor, dark mode support, and status badges (`badge-granted` / `badge-app`).

### Added
- **`robots.txt`**: Added site-wide crawler disallow rule (`User-agent: *`, `Disallow: /`) to block all search engine web crawlers, indexers, and AI scrapers.
- **Privacy & Security Meta Tags**: Added `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">` in `index.html` `<head>` for defense-in-depth search prevention.

## [2026-08-29] - Added Research Tab & Interactive Academic Simulation Cards (Option A)

### Added
- **Segmented Site Navigation Tabs**: Added fluid sliding pill navigation tabs (`Projects` [7] and `Research` [5]) with keyboard shortcut navigation (`1` for Projects, `2` for Research) and deep-linking URL hash synchronization (`#projects`, `#research`).
- **Google Scholar Integration**: Added Google Scholar social icon and header link, aggregate academic telemetry badge (186 citations, 4 h-index, University of Washington), and direct links to publisher DOIs/PDFs.
- **5 Academic Research Cards & Interactive Micro-Visualizers**:
  - **Microtalk (AAAI HCOMP 2016)**: Interactive 3-stage peer argumentation lift pipeline (*Assess $\to$ Justify $\to$ Reconsider*) demonstrating +20% accuracy gain over baseline voting.
  - **Tactile Graphics with a Voice (ACM TACCESS 2016)**: Multimodal diagram scanner with interactive tactile node touch targets, acoustic sonar pulses, and localized voice audio telemetry.
  - **The Wisdom of Multiple Guesses (ACM EC 2015)**: Multi-guess probability density aggregator comparing certainty-weighted crowd distributions vs naive single-point estimates.
  - **KIMBEE (UW CSE 2015)**: Real-time speech acoustic waveform, harmonic pitch contour, and articulation score analyzer.
  - **Contributing During the Commute (UW CSE / OneBusAway 2015)**: Urban transit crowdsourcing route map with stop amenity contribution telemetry and prosocial volunteer metrics.
- **BibTeX Citation Copy System**: Instant one-click BibTeX copy button on each research card with animated toast feedback.

## [2026-08-29] - Stripe Wordmark Sizing Polish

### Changed
- Scaled Stripe wordmark logo size by 10% (height 1.025em) and adjusted optical baseline alignment.

## [2026-08-29] - Grid Column Width Layout Stabilization

### Fixed
- Fixed grid column dynamic width shifting during simulation widget scrubbing by enforcing `repeat(2, minmax(0, 1fr))` on `.projects` and strict `min-width: 0` / text truncation boundaries on project cards and preview headers.
- Optimized canvas buffer sizing to avoid redundant memory allocations and DOM reflows during pointer scrub events.

## [2026-08-28] - Interactive "Show, Don't Tell" Project Micro-Widgets (Phase 2)

### Added
- Embedded live interactive canvas visualizers and telemetry widgets on all project cards:
  - **Financial Simulator (`fi_sim`)**: Sequence of returns probability cone with interactive timeline scrubber and historical stagflation comparison.
  - **Org Planning Tool (`org_planning`)**: 35-run stochastic Monte Carlo org growth and promotion fan chart with quarterly cross-section slicing.
  - **Connections (`connections`)**: 4x4 interactive word grid with smooth category solve and shuffle animations on hover.
  - **Stitch by Number (`stitch_by_number`)**: Split-view needlepoint quantization canvas with interactive DMC embroidery palette density mapping.
  - **Photo Stacker (`photo_stacker`)**: Multi-exposure HDR fusion scrubber comparing -2 EV, Mertens-fused HDR, and +2 EV with a live luminance histogram.
  - **1Password OPVault Extension (`1password_extension`)**: Verified native messaging IPC stream and AES-256 decryption telemetry.
  - **Rowing Performance Analyzer (`rowing_performance`)**: Concept2 stroke telemetry graph tracking split power vs. cardiovascular heart rate drift with real-time VO₂ Max estimation.
- Integrated `JetBrains Mono` for tabular metrics, dates, and token badges.
- Enhanced card micro-interactions, dark mode rendering, high-DPI retina sharpness, and `prefers-reduced-motion` compliance.

## [2026-08-28] - Added Stripe Wordmark to Bio

### Added
- Replaced Stripe bio text with official Stripe wordmark SVG linking directly to `stripe.com`
- Responsive typography alignment, hover lift effect, and dark mode highlight color support

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
