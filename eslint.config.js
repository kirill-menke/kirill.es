import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { defineConfig, globalIgnores, includeIgnoreFile } from 'eslint/config';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default defineConfig(
	includeIgnoreFile(fileURLToPath(new URL('.gitignore', import.meta.url))),
	// Built by vibe-reel's demo/: minified bundles and its service worker
	globalIgnores(['static/vibe-reel-demo/']),
	js.configs.recommended,
	svelte.configs.recommended,
	{
		files: ['src/**'],
		languageOptions: { globals: globals.browser }
	},
	{
		files: ['*.js', 'scripts/**'],
		languageOptions: { globals: globals.node }
	},
	{
		rules: {
			// No paths.base to resolve against.
			'svelte/no-navigation-without-resolve': 'off',
			// Browser globals at the top level break prerendering, which runs in Node.
			'svelte/no-top-level-browser-globals': 'error'
		}
	}
);
