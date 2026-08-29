# Repository Guidelines for rdrapeau.github.io (drapeau.dev)

## Development & Deployment Rules

1. **Pull Request Workflow (Strict)**:
   - Never commit directly to `master`.
   - Always create a dedicated branch (`feat/...`, `fix/...`, `docs/...`) for any code, asset, or documentation changes.
   - Push the branch and open a Pull Request using `gh pr create`.
   - Verify the ephemeral preview environment at `https://drapeau.dev/preview/pr-<number>/` before merging.
   - Once approved, merge using `gh pr merge <number> --merge --delete-branch`.

2. **Path & Asset Relativity (Strict)**:
   - All internal links, images, favicons, and `fetch()` requests in `index.html` MUST use relative paths (`./`) to support nested preview paths (`/preview/pr-<number>/`).
   - All subprojects built with Vite must use `base: './'` in `vite.config.*`.

3. **Subproject Additions & Updates**:
   - When deploying subprojects, build them in their respective source folder and copy the output into `rdrapeau.github.io/<project>/`.
   - Ensure `<project>/build-info.json` exists with `timestamp` and `buildDate`.
   - Update `index.html` projects array, `CHANGELOG.md`, `README.md`, and `TECH.md`.

For the detailed procedure, consult the [`pages-pr-preview-workflow`](.agents/skills/pages-pr-preview-workflow/SKILL.md) skill.
