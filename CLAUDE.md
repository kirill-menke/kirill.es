# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal website (kirill.es): SvelteKit 3, Svelte 5, Vite 8, adapter-node. Plain ESM JavaScript, no TypeScript.

## Commands

```bash
npm ci                 # install
npm run dev            # dev server, http://localhost:5173
npm run build          # vite build: adapter-node output + every page prerendered, into build/
npm run preview        # serve the production build
npm run lint           # ESLint with --max-warnings 0: any warning counts as a failure
npm run format         # Prettier --write (format:check only checks)
nix build              # build the Nix package (nix/package.nix); `nix run` serves it on :3000
```

There is no test runner. To verify a change, run `npm run dev` or `npm run build && npm run preview` and open the affected routes.

`jsconfig.json` only helps editors resolve `$app/*` and `#lib` (it extends Kit's generated `node_modules/$app/tsconfig.json`, present after the first dev or build run); it is not a build input. Prettier (`.prettierrc.json`) and ESLint both read `.gitignore`; `.prettierignore` only lists the extra files to skip.

There are no git hooks and no CI. Run `npm run lint && npm run format:check` before pushing, and `nix flake check` to build the Nix package when a change touches dependencies or the build.

## Architecture

- **Fully static at runtime.** `src/routes/+layout.js` sets `prerender = true`, so the Node server only serves prerendered HTML and `static/` (plus the request-time `+error.svelte` page for unknown URLs). There is no API, no database, no env config and no secrets. The production systemd unit (`nix/module.nix`) blocks all network access except loopback. Anything that needs request-time code or outbound calls breaks these assumptions. `services.kirill-es.origin` is ignored (adapter-node 6 dropped `ORIGIN`) and only triggers a warning.
- **SvelteKit 3 specifics.** Kit config lives in the `sveltekit()` plugin in `vite.config.js` (there is no `svelte.config.js`), including `compilerOptions.runes: true` for every file outside `node_modules` and `version.name` from `KIRILL_ES_VERSION`, which `nix/package.nix` sets to the flake revision so builds are reproducible (local builds fall back to `Date.now()`). `$lib` no longer exists: import shared code via `#lib/...`, defined in `package.json` `"imports"`. Read page state from `$app/state`; `$app/stores` is gone.
- **Content is data.** `src/lib/tile-data.js` holds the `projects`, `hobbies` and `books` entries (root-relative image paths, tags, `tileType`, `layout`). `src/lib/components/tiles/TileGrid.svelte` renders any list of them: `tiles/index.js` maps `tileType` to the tile component, `layout: 'wide'` spans two columns. The home page passes an ordered `homeTiles` list; the list pages pass a whole collection. Shared tile CSS (grid, header row, tooltips, arrow anchor, pills) is global in `tiles/tiles.css`; the "Section · Name" header is `tiles/TileHeader.svelte`.
- **Entrances are CSS, so content ships in the prerendered HTML.** Do not gate rendering on a client-side `visible` flag. Give the element the global `.enter` class (`src/app.css`) and tune it with `--enter-duration`, `--enter-delay`, `--enter-y` and `--enter-ease` (custom properties inherit, so setting them on a wrapper works). The animation plays on first paint and on client navigation, never on hydration, and is off under `prefers-reduced-motion`. List pages take their timing from `listEntrance()` in `src/lib/entrance.js` (slow stagger when coming from `/` or on a direct visit, quick otherwise; the root layout calls `trackEntrance()`). For the few Svelte transitions left, import `fly`/`fade` from `#lib/motion.js`, which respects reduced motion. Only the `/flags` centre content, which depends on a measured size, renders client-side.
- **`/flags` uses generated data.** `src/lib/flags/flags.json` and `static/flag-images/*.svg` come from an external flag-circle pipeline (`export_web.py`, not in this repo). Do not edit them by hand. `flags.json` is excluded from Prettier. The home-page tile uses the hard-coded `ring` list in `tile-data.js` and the JSON-free `src/lib/flags/ring.js` (`imageUrl`, `placeOnRing`), so it does not bundle `flags.json`; never import `#lib/flags/index.js` from a tile. `flags.kirill.es` serves `/flags` at its root via a Cloudflare rewrite, so `NavBar` points its links at `https://kirill.es` on that host.
- **Global styles.** Tokens are in `src/app.css`: colours (`--color-*`, including `--color-border` and the `--color-device-*` mock-up colours), fonts (`--font-primary`, `--font-secondary`, `--font-mono`), `--shadow-float`, `--flag-outline`, easings, plus `.enter` and `.visually-hidden`. Use a token when the value matches. Components use scoped `<style>` blocks. Fonts are WOFF2 in `static/fonts`, preloaded in `src/app.html`; NanumMyeongjo is subset to U+0000-2FFF (no Hangul).
- **Page-only components live next to their route.** `src/routes/flags/` and `src/routes/projects/vibe-reel/` hold their own components (Kit ignores files without a `+` prefix); `src/lib/components` keeps only shared pieces (`NavBar`, `Footer`, `tiles/`). VibeReel's shared panel classes (`vr-panel`, `vr-card`, ...) are defined once in its `+page.svelte`.

## Conventions

- **Runes only.** The compiler runs every component in runes mode (`$props`, `$state`, `$derived`, snippets and `{@render}`), so legacy `export let`, `<slot>` or `$:` fail to compile. A plain `let` that markup reads after it changes must be `$state`. Key every `{#each}` block (`svelte/require-each-key`). ESLint also enforces `svelte/no-top-level-browser-globals`, because prerendering runs components in Node.
- **New build inputs need adding to the Nix allowlist.** `nix/package.nix` builds from an explicit fileset (`package.json`, `package-lock.json`, `vite.config.js`, `src`, `static`). Add any new top-level file the build needs there, or the Nix build fails. Keep every npm package in `devDependencies` and leave `dependencies` absent: the adapter-node bundle inlines all imports and the Nix package ships no `node_modules` (anything in `dependencies` would stay external). The Nix install check imports the server bundle, so a missing module fails the build, not the deploy.
- **Branches and releases.** Work directly on `main`; there is no `dev` branch. Pushing deploys nothing: production is deployed by hand from a separate config repo that pins a commit of `main`, so only commit finished work there. There is no staging.
- **Commits.** Use Conventional Commits, with `!` for breaking changes (`feat!:`, `build!:`).
