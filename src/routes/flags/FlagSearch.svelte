<script>
	import { Search, Shuffle } from '@lucide/svelte';
	import { flags, imageUrl, searchFlags } from '#lib/flags/index.js';

	let { onselect = () => {} } = $props();

	const id = $props.id();
	const listbox = `${id}-results`;
	let query = $state('');
	let open = $state(false);
	let active = $state(-1); // option chosen with the arrow keys; Enter falls back to the first
	let results = $derived(searchFlags(query));
	let expanded = $derived(open && results.length > 0);

	function choose(code) {
		onselect(code);
		query = '';
	}

	function onkeydown(event) {
		const last = results.length - 1;
		if (event.key === 'ArrowDown' && expanded) active = active < last ? active + 1 : 0;
		else if (event.key === 'ArrowUp' && expanded) active = active > 0 ? active - 1 : last;
		else if (event.key === 'Enter' && results.length)
			choose((results[active] ?? results[0]).code);
		else if (event.key === 'Escape') query = '';
		else return;
		event.preventDefault();
	}

	// Close the results once focus leaves the search, e.g. in the compact layout where it stays.
	function onfocusout(event) {
		if (!event.currentTarget.contains(event.relatedTarget)) open = false;
	}
</script>

<div class="search" {onfocusout}>
	<div class="row">
		<label class="field">
			<Search size="14" />
			<input
				type="search"
				role="combobox"
				placeholder="Find a country"
				aria-label="Find a country"
				aria-autocomplete="list"
				aria-expanded={expanded}
				aria-controls={expanded ? listbox : undefined}
				aria-activedescendant={expanded && active >= 0 ? `${listbox}-${active}` : undefined}
				autocomplete="off"
				bind:value={query}
				onfocus={() => (open = true)}
				oninput={() => (active = -1)}
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
	{#if expanded}
		<!-- Options are not focusable: focus and the keyboard stay in the input (aria-activedescendant),
		     and mousedown must not move focus, which would close the list before the click lands. -->
		<ul class="results" id={listbox} role="listbox" aria-label="Countries">
			{#each results as flag, i (flag.code)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					id="{listbox}-{i}"
					role="option"
					aria-selected={i === active}
					class:active={i === active}
					onmousedown={(event) => event.preventDefault()}
					onclick={() => choose(flag.code)}
				>
					<img src={imageUrl(flag.code)} alt="" />{flag.name}
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
		min-width: 0;
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
		box-shadow: var(--shadow-float);
	}

	[role='option'] {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		box-sizing: border-box;
		width: 100%;
		padding: 0.4rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.9rem;
		text-align: left;
		color: var(--color-font-dark);
		cursor: pointer;
	}

	[role='option']:hover,
	.active {
		background: var(--color-background-dark);
	}

	.results img {
		width: 1.6rem;
		height: 1.1rem;
		object-fit: contain;
		filter: var(--flag-outline);
	}
</style>
