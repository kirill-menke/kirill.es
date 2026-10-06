# AGENTS.md

Guidance for coding agents (Codex, Claude Code, etc.) working in this repository. `CLAUDE.md` just imports this file.

## Project Overview

Personal website built with SvelteKit 2 + Svelte 5 (runes) and adapter-node. Every page is prerendered (`src/routes/+layout.js`); the Node server serves them plus static assets and writes an access log. No API, database or secrets.

- `src/routes` — file-based routing (`+page.svelte`).
- `src/lib` — components and tile data (`tile-data.js`).
- `src/hooks.server.js` — logs every request to console and `logs/access.log`.
- `static` — public assets (photos, previews, fonts).
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

No test runner. Verify via `npm run dev` / `npm run build && npm run preview` and exercising routes.

## Configuration

No secrets. Optional adapter-node settings (`PORT`, `HOST`, `NODE_ENV`, `ORIGIN`, `ADDRESS_HEADER`) via the environment or a `.env` (see `.env.example`). Set `ADDRESS_HEADER` (e.g. `X-Forwarded-For`) behind a reverse proxy so the access log sees real client IPs.

`logs/`, `build/`, `.svelte-kit/`, `.env*` (except the example) and `.claude/settings.local.json` are gitignored; never commit them or generated binaries.

## Deployment

- **NAS microVMs**: production runs on the owner's NixOS NAS, one microvm.nix guest per site — `kirill.es` tracks `master`, `dev.kirill.es` tracks `dev`. Each guest runs the Nix package (`nix/package.nix`, Node 22) via the hardened `services.kirill-es` module (`nix/module.nix`) plus `cloudflared`; traffic arrives only through a Cloudflare Tunnel, and the guest cannot reach the LAN. The host side (VMs, firewall, secrets) lives in the separate nixos-config repo.
- **Deploying** is manual from the owner's PC: merge/push, then in nixos-config `nix flake update kirill-es` (or `kirill-es-dev`) and rebuild the NAS. Only the VM whose closure changed restarts.
- **CI** (`.github/workflows/ci-cd.yml`): format check, lint, build, `nix flake check` (builds the Nix package); AI code review (`claude-sonnet-5`) on PRs to `master`. CI does not deploy.
- In the guest: cwd (access log) is `/var/lib/kirill-es`, `ADDRESS_HEADER=CF-Connecting-IP`. The app has no network access beyond loopback.

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
