<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { replaceState } from '$app/navigation';
	import FlagCircle from '#lib/components/flags/FlagCircle.svelte';
	import FlagDetails from '#lib/components/flags/FlagDetails.svelte';
	import FlagSearch from '#lib/components/flags/FlagSearch.svelte';
	import FlagStats from '#lib/components/flags/FlagStats.svelte';
	import { byCode, flags, meta } from '#lib/flags/index.js';

	let visible = $state(false);
	let selected = $state(null); // pinned flag
	let hovered = $state(null); // flag under the mouse
	let shown = $derived(hovered ?? selected);
	let size = $state(0);
	let compact = $derived(size > 0 && size < 620); // centre too small: details go below the ring
	let circleTile = $state(null);

	onMount(() => {
		const code = location.hash.slice(1);
		if (byCode[code]) selected = code;
		visible = true;
	});

	function select(code) {
		selected = code;
		hovered = null;
		replaceState(code ? `#${code}` : location.pathname, {});
	}

	const toggle = (code) => select(selected === code ? null : code);

	function step(delta) {
		const from = byCode[selected ?? shown];
		if (from) select(flags[(from.index + delta + flags.length) % flags.length].code);
	}

	function selectAndShow(code) {
		select(code);
		circleTile?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
	colours.<br />
	Hover the ring to look closer, click a flag to pin it.
</p>

{#if visible}
	<section
		class="tile circle-tile"
		bind:this={circleTile}
		in:fly={{ y: -15, opacity: 0, duration: 500, easing: backInOut }}
	>
		<FlagCircle {selected} onhover={(code) => (hovered = code)} onselect={toggle} bind:size>
			{#if compact}
				<p class="ring-label">{shown ? byCode[shown].name : `${flags.length} flags`}</p>
			{:else if shown}
				<FlagDetails
					code={shown}
					pinned={shown === selected}
					onselect={select}
					onstep={step}
				/>
			{:else}
				<div class="intro">
					<p class="count">{flags.length}</p>
					<p class="tagline">flags, one circle</p>
					<p class="hint">
						Neighbours are {meta.mean_similarity}% alike on average. Use ← → to walk
						around the ring.
					</p>
					<FlagSearch onselect={select} />
				</div>
			{/if}
		</FlagCircle>

		{#if compact}
			<div class="below">
				<FlagSearch onselect={select} />
				{#if shown}
					<FlagDetails
						code={shown}
						pinned={shown === selected}
						variant="panel"
						onselect={select}
						onstep={step}
					/>
				{/if}
			</div>
		{/if}
	</section>

	<FlagStats onselect={selectAndShow} delay={250} />
{/if}

<style>
	.circle-tile {
		padding: 1.5rem 1rem;
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
