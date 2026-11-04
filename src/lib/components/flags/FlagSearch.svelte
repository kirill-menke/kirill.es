<script>
	import { Search, Shuffle } from '@lucide/svelte';
	import { flags, imageUrl, searchFlags } from '#lib/flags/index.js';

	let { onselect = () => {} } = $props();

	let query = $state('');
	let results = $derived(searchFlags(query));

	function choose(code) {
		onselect(code);
		query = '';
	}

	function onkeydown(event) {
		if (event.key === 'Enter' && results.length) choose(results[0].code);
		if (event.key === 'Escape') query = '';
	}
</script>

<div class="search">
	<div class="row">
		<label class="field">
			<Search size="14" />
			<input
				type="search"
				placeholder="Find a country"
				aria-label="Find a country"
				autocomplete="off"
				bind:value={query}
				{onkeydown}
			/>
		</label>
		<button
			class="surprise"
			onclick={() => choose(flags[Math.floor(Math.random() * flags.length)].code)}
			aria-label="Show a random flag"
			title="Show a random flag"
		>
			<Shuffle size="14" />
		</button>
	</div>
	{#if results.length}
		<ul class="results">
			{#each results as flag (flag.code)}
				<li>
					<button onclick={() => choose(flag.code)}>
						<img src={imageUrl(flag.code)} alt="" />{flag.name}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.search {
		position: relative;
		width: 100%;
		max-width: 18rem;
	}

	.row {
		display: flex;
		gap: 0.4rem;
	}

	.field,
	.surprise {
		display: flex;
		align-items: center;
		height: 2.2rem;
		border: 1px solid var(--color-background-dark);
		border-radius: 0.5rem;
		background: rgba(255, 255, 255, 0.75);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
		color: var(--color-font-light);
	}

	.field {
		flex: 1;
		gap: 0.45rem;
		padding: 0 0.7rem;
	}

	.field:focus-within {
		border-color: oklch(0.85 0 0);
		color: var(--color-font-dark);
	}

	input {
		flex: 1;
		min-width: 0;
		border: 0;
		outline: 0;
		background: none;
		font: inherit;
		font-size: 0.9rem;
		color: var(--color-font-dark);
	}

	.surprise {
		justify-content: center;
		width: 2.2rem;
		padding: 0;
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.surprise:hover {
		color: var(--color-font-dark);
	}

	.results {
		position: absolute;
		z-index: 30;
		top: calc(100% + 0.3rem);
		left: 0;
		right: 0;
		margin: 0;
		padding: 0.25rem;
		list-style: none;
		border: 1px solid var(--color-background-dark);
		border-radius: 0.5rem;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(30px);
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.1),
			0 3px 6px rgba(0, 0, 0, 0.1);
	}

	.results button {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		padding: 0.4rem 0.5rem;
		border: 0;
		border-radius: 0.25rem;
		background: none;
		font: inherit;
		font-size: 0.9rem;
		text-align: left;
		color: var(--color-font-dark);
		cursor: pointer;
	}

	.results button:hover {
		background: var(--color-background-dark);
	}

	.results img {
		width: 1.6rem;
		height: 1.1rem;
		object-fit: contain;
		filter: drop-shadow(0 0 0.5px rgba(0, 0, 0, 0.5));
	}
</style>
