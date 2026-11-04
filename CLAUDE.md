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

There are no git hooks and no CI. Run `npm run lint && npm run format:check` before pushing, and `nix flake check` to build the Nix package when a change touches dependencies or the build.

## Architecture

- **Fully static at runtime.** `src/routes/+layout.js` sets `prerender = true`, so the Node server only serves prerendered HTML and `static/`. There is no API, no database, no env config and no secrets. The production systemd unit (`nix/module.nix`) blocks all network access except loopback. Anything that needs request-time code or outbound calls breaks these assumptions.
- **SvelteKit 3 specifics.** Kit config lives in the `sveltekit()` plugin in `vite.config.js` (there is no `svelte.config.js`). `$lib` no longer exists: import shared code via `#lib/...`, defined in `package.json` `"imports"`. Read page state from `$app/state`; `$app/stores` is gone.
- **Content is data.** `src/lib/tile-data.js` holds the `projects`, `hobbies` and `books` entries (preview image, tags, `tileType`, `layout`). Pages pick the tile component and grid span from those fields. The home page (`src/routes/+page.svelte`) places each tile by hand with increasing `delay`s for a staggered entrance.
- **Entrance animations gate rendering.** Pages render their content only after a `visible` flag flips in `onMount` or `afterNavigate`, so the prerendered HTML is mostly empty and the transitions play on the client. Some pages use `afterNavigate`'s `from` to animate differently when the visitor came from `/`.
- **`/flags` uses generated data.** `src/lib/flags/flags.json` and `static/flag-images/*.svg` come from an external flag-circle pipeline (`export_web.py`, not in this repo). Do not edit them by hand. `flags.json` is excluded from Prettier. The home-page tile uses the hard-coded `ring` list in `tile-data.js` so it does not bundle `flags.json`. `flags.kirill.es` serves `/flags` at its root via a Cloudflare rewrite, so `NavBar` points its links at `https://kirill.es` on that host.
- **Global styles.** Colour and font variables (`--color-*`, `--font-primary`, `--font-secondary`) are in `src/app.css`. Components use scoped `<style>` blocks.

## Conventions

- **Svelte syntax is mixed.** Newer components use runes (`$props`, `$state`, `$derived`). Older ones (`BookTile`, `HobbyTile*`, `ProjectTile`, `WIPTile*`, several pages, `+layout.svelte`) still use legacy `export let` and `<slot>`. Svelte 5 treats each file as either runes or legacy mode, so do not mix the two in one component. Use runes in new code.
- **New build inputs need adding to the Nix allowlist.** `nix/package.nix` builds from an explicit fileset (`package.json`, `package-lock.json`, `vite.config.js`, `src`, `static`). Add any new top-level file the build needs there, or the Nix build fails. Runtime imports must be in `dependencies`: devDependencies are pruned from the package.
- **Branches and releases.** Work directly on `main`; there is no `dev` branch. Pushing deploys nothing: production is deployed by hand from a separate config repo that pins a commit of `main`, so only commit finished work there. There is no staging.
- **Commits.** Use Conventional Commits, with `!` for breaking changes (`feat!:`, `build!:`).
