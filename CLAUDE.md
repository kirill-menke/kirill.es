# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website built with SvelteKit 5 (using Svelte 5 runes) and adapter-node. Features an interactive landscape grid powered by Google Gemini AI for generating pixel art tiles stored in SQLite.

## Development Commands

```bash
npm run dev         # Start dev server on http://localhost:5173
npm run build       # Production build to build/ directory
npm run preview     # Preview production build locally
npm start           # Run production build (node build/index.js)
node server.js      # HTTP production server on port 3000

# Code quality
npm run lint        # Run ESLint with max-warnings 0
npm run lint:fix    # Auto-fix ESLint issues
npm run format      # Format code with Prettier
npm run format:check # Check formatting without changes
```

## Architecture

### Core Components

- **SvelteKit app**: ESM + Svelte 5 with file-based routing
- **Database**: `src/lib/db.js` wraps better-sqlite3, creates `landscape.db` in repo root with tiles table (position, image_url, prompt)
- **Request logging**: `src/hooks.server.js` logs all requests to console and `logs/access.log`
- **Build output**: `build/` directory created by adapter-node (generates `build/index.js` and `build/handler.js`)

### API Endpoints

- `GET /api/tiles` - Fetch all tiles from database
- `POST /api/tiles` - Upsert tile (position 0-79, image_url, prompt required)
- `DELETE /api/tiles?position=N` - Delete tile at position N
- `POST /api/generate-image` - Generate pixel art with Gemini AI (accepts prompt and neighbors object)

### Deployment Configuration

- **PM2**: `ecosystem.config.cjs` configures two apps (kirill.es for prod, dev.kirill.es for dev) with environment-specific `.env.prod` and `.env.dev` files
- **Production server**: `server.js` wraps `build/handler.js` with HTTP server, listens on PORT env var (default 3000)
- **CI/CD**: `.github/workflows/ci-cd.yml` runs quality checks (format, lint, build), AI code review on PRs to master, and auto-deploys dev/master branches via SSH

## Important Notes

- Use Conventional Commits format (`feat:`, `fix:`, `chore:`, etc.)
- Svelte 5 uses runes syntax - no `$:` reactive statements, use `$derived` and `$effect` instead
- Database is single-file SQLite at repo root, prepared statements in `src/lib/db.js`
- PM2 requires `.env.prod` and `.env.dev` files (see `.env.example`)
- Logs directory (`logs/`) must exist locally but is gitignored
- Husky + lint-staged runs pre-commit hooks for ESLint and Prettier
- Main branch is `master` (not main), development happens on `dev` branch
