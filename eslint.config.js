import js from '@eslint/js';
import globals from 'globals';
import svelte from 'eslint-plugin-svelte';

export default [
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		ignores: ['build/**', '.svelte-kit/**', 'node_modules/**']
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		rules: {
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/require-each-key': 'off',
			'no-console': 'error',
			'no-unused-vars': 'error',
			'no-undef': 'error'
		}
	}
];
