import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default defineConfig(
	includeIgnoreFile(fileURLToPath(new URL('.gitignore', import.meta.url))),
	js.configs.recommended,
	svelte.configs.recommended,
	{
		files: ['src/**'],
		languageOptions: { globals: globals.browser }
	},
	{
		files: ['*.js'],
		languageOptions: { globals: globals.node }
	},
	{
		rules: {
			// No paths.base to resolve against, and NavBar builds absolute URLs on flags.kirill.es.
			'svelte/no-navigation-without-resolve': 'off',
			// Browser globals at the top level break prerendering, which runs in Node.
			'svelte/no-top-level-browser-globals': 'error'
		}
	}
);
