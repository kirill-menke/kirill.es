import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter(),
			// Set by the Nix build so the output is reproducible; unset, Kit falls back to Date.now().
			version: { name: process.env.KIRILL_ES_VERSION }
		})
	]
});
