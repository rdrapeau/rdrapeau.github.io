# Repository Guidelines for rdrapeau.github.io (drapeau.dev)

## Development & Deployment Rules

1. **Pull Request Workflow (Strict)**:
   - Never commit directly to `master`.
   - Always create a dedicated branch (`feat/...`, `fix/...`, `docs/...`) for any code, asset, or documentation changes.
   - Run tests locally (`npm test` and `npm run test:e2e`) and ensure they pass before opening a PR.
   - Push the branch and open a Pull Request using `gh pr create`.
   - Verify the ephemeral preview environment at `https://drapeau.dev/preview/pr-<number>/` and share the link with the user.
   - **Require User Approval**: STOP and wait for explicit user approval. Never merge autonomously.
   - Once explicitly approved by the user, merge using `gh pr merge <number> --merge --delete-branch`.

2. **Automated Testing & Continuous Verification (Strict)**:
   - **Always Run Tests**: Always execute `npm test` (unit/integrity) and relevant E2E tests (`npm run test:e2e` / `npm run test:e2e:chromium`) locally before committing.
   - **Add Tests for New Features**: Whenever adding any new feature, project, UI interaction, tab, filter, canvas visualizer, Easter egg, or metadata:
     - Add structural/integrity tests in `test/` (e.g., `test/html-structure.test.mjs`, `test/paths.test.mjs`, `test/subprojects.test.mjs`, `test/easter-eggs.test.mjs`).
     - Add end-to-end browser interaction tests in `e2e/` (e.g., `e2e/navigation.spec.mjs`, `e2e/filter.spec.mjs`, `e2e/interactive-visualizers.spec.mjs`, `e2e/drapeau-easter-egg.spec.mjs`, `e2e/accessibility-responsive.spec.mjs`).
   - Never remove or weaken existing tests unless the corresponding functionality is intentionally deprecated or changed.
   - Ensure all CI tests pass in GitHub Actions (`Test Suite` workflow) on every pull request.

3. **Path & Asset Relativity (Strict)**:
   - All internal links, images, favicons, and `fetch()` requests in `index.html` MUST use relative paths (`./`) to support nested preview paths (`/preview/pr-<number>/`).
   - All subprojects built with Vite must use `base: './'` in `vite.config.*`.

4. **Subproject Additions & Updates**:
   - When deploying subprojects, build them in their respective source folder and copy the output into `rdrapeau.github.io/<project>/`.
   - Ensure `<project>/build-info.json` exists with `timestamp` and `buildDate`.
   - Update `index.html` projects array, `CHANGELOG.md`, `README.md`, and `TECH.md`.

For the detailed procedure, consult the [`pages-pr-preview-workflow`](.agents/skills/pages-pr-preview-workflow/SKILL.md) skill.
