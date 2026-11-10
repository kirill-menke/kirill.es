<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { scrollBehavior } from '#lib/motion.js';
	import { byCode, flags, meta } from '#lib/flags/index.js';
	import FlagDetails from './FlagDetails.svelte';
	import FlagSearch from './FlagSearch.svelte';
	import FlagStats from './FlagStats.svelte';
	import FlagWreath from './FlagWreath.svelte';

	let selected = $state(null); // pinned flag
	let hovered = $state(null); // flag under the mouse
	let shown = $derived(hovered ?? selected);
	let size = $state(0); // wreath width, 0 until measured (and while prerendering)
	let compact = $derived(size > 0 && size < 620); // middle too small: details go below the wreath
	let circleTile = $state(null);

	onMount(() => {
		const code = location.hash.slice(1);
		if (byCode[code]) selected = code;
	});

	function select(code) {
		selected = code;
		hovered = null;
		// Shallow and replacing: the pinned flag lives in the hash, with no navigation or history entry.
		goto(code ? `#${code}` : location.pathname, { shallow: true, replace: true });
	}

	const toggle = (code) => select(selected === code ? null : code);

	function step(delta) {
		const from = byCode[selected ?? shown];
		if (from) select(flags[(from.index + delta + flags.length) % flags.length].code);
	}

	function selectAndShow(code) {
		select(code);
		circleTile.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
	}

	function onkeydown(event) {
		if (event.target instanceof HTMLInputElement) return;
		if (event.key === 'ArrowRight' && shown) step(1);
		else if (event.key === 'ArrowLeft' && shown) step(-1);
		else if (event.key === 'Escape' && selected) select(null);
		else return;
		event.preventDefault();
	}
</script>

<svelte:head>
	<title>flags. · Kirill's Garden</title>
	<meta
		name="description"
		content="The flags of all {flags.length} UN member states in one circle, each next to the flags with the most similar colours."
	/>
</svelte:head>

<svelte:window {onkeydown} />

<h1 class="page-heading">flags.</h1>
<p class="page-subtitle">
	All {flags.length} UN member states in one circle, each flag beside the ones with the most similar
	colours.
	<span class="hint-touch"><br />Tap the wreath or search for a country to pin its flag.</span>
</p>

{#snippet details(variant)}
	<FlagDetails code={shown} {variant} onselect={select} />
{/snippet}

<section class="tile circle-tile enter" bind:this={circleTile}>
	<!-- The wreath and the stats are prerendered; what goes in the middle depends on the measured
	     size, so it waits for the client rather than show the wrong layout first. -->
	<FlagWreath {selected} onhover={(code) => (hovered = code)} onselect={toggle} bind:size>
		{#if compact}
			<p class="ring-label">{shown ? byCode[shown].name : `${flags.length} flags`}</p>
		{:else if size && shown}
			{@render details('centre')}
		{:else if size}
			<div class="intro">
				<p class="count">{flags.length}</p>
				<p class="tagline">flags, one circle</p>
				<p class="hint">
					Neighbours are {meta.mean_similarity}% alike on average. Use ← → to walk around
					the circle.
				</p>
				<FlagSearch onselect={select} />
			</div>
		{/if}
	</FlagWreath>

	{#if compact}
		<div class="below">
			<FlagSearch onselect={select} />
			{#if shown}
				{@render details('panel')}
			{/if}
		</div>
	{/if}
</section>

<FlagStats onselect={selectAndShow} delay={250} />

<style>
	/* Touch screens cannot hover the wreath, so they get a hint */
	.hint-touch {
		display: none;
	}

	@media (hover: none) {
		.hint-touch {
			display: inline;
		}
	}

	/* --halo: the text in the middle of the wreath sits on it, so it follows the tile's colour */
	.circle-tile {
		--halo: var(--color-background-tile);
		padding: 1.5rem 1rem;
	}

	.circle-tile:hover {
		--halo: var(--color-background-tile-hover);
	}

	.intro {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: 22rem;
	}

	.count {
		margin: 0;
		font-family: var(--font-secondary);
		font-size: clamp(3rem, 22cqw, 7rem);
		line-height: 1;
		color: var(--color-font-dark);
	}

	.tagline {
		margin: 0.25rem 0 0;
		font-family: var(--font-secondary);
		font-size: clamp(1.2rem, 6cqw, 1.75rem);
		color: var(--color-font-light);
	}

	.hint {
		margin: 1rem 0 1.25rem;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--color-font-light);
	}

	.ring-label {
		margin: 0;
		font-family: var(--font-secondary);
		font-size: 1.25rem;
		text-align: center;
		color: var(--color-font-dark);
	}

	.below {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		margin-top: 1rem;
	}
</style>
