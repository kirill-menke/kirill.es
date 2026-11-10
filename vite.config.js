import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const FLAGS_JSON = fileURLToPath(new URL('src/lib/flags/flags.json', import.meta.url));

/**
 * `virtual:flags-tile`: the few flags the home-page Flags tiles show, picked from flags.json at
 * build time, so the page ships those instead of the whole file. Each sample spreads its flags
 * evenly round the /flags circle in ring order, which keeps the colour gradient.
 */
function flagsTile() {
	const id = 'virtual:flags-tile';
	return {
		name: 'flags-tile',
		resolveId: (source) => (source === id ? `\0${id}` : undefined),
		load(resolved) {
			if (resolved !== `\0${id}`) return;
			this.addWatchFile(FLAGS_JSON);
			const { flags } = JSON.parse(readFileSync(FLAGS_JSON, 'utf8'));
			const spread = (n) =>
				Array.from({ length: n }, (_, k) => Math.floor((k * flags.length) / n));
			const swatch = (index) => {
				const { code, name, colors } = flags[index];
				// `no` is the flag's place in the circle, counting from 1
				const top = colors.slice(0, 4).map((c) => ({ hex: c.hex, name: c.name }));
				return { code, name, no: index + 1, colors: top };
			};
			return [
				`export const count = ${flags.length};`,
				// Flag codes for the badges tile
				`export const badges = ${JSON.stringify(spread(55).map((i) => flags[i].code))};`,
				// Flags with up to four colours each, for the paint-chip tiles
				`export const swatches = ${JSON.stringify(spread(24).map(swatch))};`
			].join('\n');
		}
	};
}

export default defineConfig({
	plugins: [
		flagsTile(),
		sveltekit({
			adapter: adapter(),
			// Runes everywhere: a legacy `export let` or `<slot>` is a compile error, not a silent mode switch.
			// Dependencies in node_modules keep the mode they were written in.
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Set by the Nix build so the output is reproducible; unset, Kit falls back to Date.now().
			version: { name: process.env.KIRILL_ES_VERSION }
		})
	]
});
