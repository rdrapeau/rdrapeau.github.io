# Changelog

All notable changes to this project will be documented in this file.

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
