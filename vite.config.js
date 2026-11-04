import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
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
