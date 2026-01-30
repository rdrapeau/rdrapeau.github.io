# Changelog

All notable changes to this project will be documented in this file.

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
