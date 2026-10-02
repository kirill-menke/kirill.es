# AGENTS.md

Guidance for coding agents (Codex, Claude Code, etc.) working in this repository. `CLAUDE.md` just imports this file.

## Project Overview

Personal website built with SvelteKit 2 + Svelte 5 (runes) and adapter-node. Features an interactive landscape grid where Google Gemini generates pixel-art tiles, stored in SQLite.

- `src/routes` — file-based routing (`+page.svelte`, `api/*/+server.js`). All routes are prerendered via `src/routes/+layout.js`, except `/landscape` (dynamic, password-protected).
- `src/lib` — shared modules: `db.js` (better-sqlite3), `prompts.yaml` (Gemini prompt templates), components.
- `src/hooks.server.js` — logs every request to console and `logs/access.log`.
- `static` — public assets; `static/landscape-references/` holds style reference images for the tile generator.
- `build/` — adapter-node output (`build/index.js`), generated, never edit or commit.

## Commands

```bash
npm ci               # Install deps (reproducible)
npm run dev          # Dev server on http://localhost:5173 (reads .env)
npm run build        # Production build to build/
npm run preview      # Preview production build locally
npm start            # Run production build (node build/index.js)

npm run lint         # ESLint, --max-warnings 0
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Prettier --write
npm run format:check # Prettier --check
```

No test runner. Verify via `npm run dev` / `npm run build && npm run preview` and exercising routes, e.g. `curl -u x:$ADMIN_PASSWORD http://localhost:5173/api/tiles`.

## API Endpoints

All `/api/*` routes (and `/landscape`) require HTTP Basic auth, see Configuration.

- `GET /api/tiles` — all tiles
- `POST /api/tiles` — upsert tile (`position` 0-79, `image_url`, `prompt` required)
- `DELETE /api/tiles?position=N` — delete tile at position N
- `POST /api/generate-image` — generate a tile from `prompt` + `neighbors` (`{top,bottom,left,right}` data URLs). Rate-limited per IP (in-memory, ~20/hour, 429 when exceeded).

### Tile generation pipeline (`src/routes/api/generate-image/+server.js`)

1. Pick a template from `src/lib/prompts.yaml` by neighbor count (`no-neighbors` … `four-neighbors`).
2. Input image: existing neighbors stitched around a marked empty center; with no neighbors, a random image from `static/landscape-references/` as style reference.
3. Gemini (`gemini-3-pro-image-preview`) generates; output is downscaled to the grid size.
4. Stability AI inpaints the seams between the new tile and its neighbors (skipped without `STABILITY_API_KEY`).
5. The center 256px tile is extracted and returned.

## Configuration

Secrets are read via `$env/dynamic/private`. Sources: `.env` in `npm run dev`; `.env.prod` / `.env.dev` loaded by PM2 (`ecosystem.config.cjs`) in production. See `.env.example`. All `.env*` files except the example are gitignored.

- `GEMINI_API_KEY` — required for `/api/generate-image`.
- `STABILITY_API_KEY` — optional, enables seam inpainting.
- `ADMIN_PASSWORD` — Basic auth (any username) for `/landscape` and `/api/*`. If unset: allowed in dev, 503 in production (fail closed).
- `DATABASE_PATH` — optional; defaults to `<cwd>/landscape.db` (repo root under PM2 and vite dev).
- `DEBUG_PIPELINE=true` — writes pipeline debug images to `<cwd>/debug/`.
- `PORT`, `HOST`, `NODE_ENV`, `ORIGIN`, `ADDRESS_HEADER` — adapter-node settings. Set `ADDRESS_HEADER` (e.g. `X-Forwarded-For`) behind a reverse proxy so rate limiting and the access log see real client IPs.

`landscape.db`, `debug/`, `logs/`, `build/`, `.svelte-kit/` and `.claude/settings.local.json` are gitignored; never commit them, secrets, or generated binaries.

## Deployment

- **PM2**: `ecosystem.config.cjs` runs `build/index.js` directly as two apps — `kirill.es` (prod, `.env.prod`) and `dev.kirill.es` (dev, `.env.dev`). adapter-node handles PORT/HOST and graceful shutdown; there is no custom server wrapper.
- **CI/CD** (`.github/workflows/ci-cd.yml`, Node 22): format check, lint, build; AI code review (`claude-sonnet-5`) on PRs to `master`; pushes to `dev`/`master` auto-deploy via SSH (scripts use `set -e`).
- The production DB used to live in `build/landscape.db` (wiped on every build); the deploy step migrates it once to the repo root. Don't put persistent state under `build/`.

## Code Style

- ESM JavaScript + Svelte 5. Prettier (`.prettierrc`): tabs (width 4), single quotes, no trailing commas, print width 100; YAML uses 2 spaces.
- ESLint with `--max-warnings 0`. Husky pre-commit runs lint-staged (ESLint + Prettier on staged files); pre-push runs `npm run lint && npm run format:check`.
- Svelte 5 runes only: `$state`, `$derived`, `$effect`, `$props` — no `$:` reactive statements or `export let`.
- Import shared code via `$lib` (e.g. `import { getTiles } from '$lib/db.js'`); prepared statements live in `src/lib/db.js`.
- Kebab-case route folders; keep changes focused, no reformatting of unrelated files.

## Git & PRs

- Conventional Commits: `feat: ...`, `fix(api): ...`, `chore: ...`.
- `master` is the main branch (not `main`); development happens on `dev`.
- PRs: what/why, affected routes/modules, DB impact, screenshots for UI changes, and local verification steps.

## Local Setup Notes

- `logs/` must exist locally (gitignored) for the access log.
- PM2 requires `.env.prod` and `.env.dev` (copy `.env.example`).
