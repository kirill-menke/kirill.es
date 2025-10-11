<script>
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import HobbyTile from '$lib/components/HobbyTileFade.svelte';
	import { hobbies } from '$lib/tile-data.js';

	let visible = false;
	let fromHomePage = false;
	let previousRoute = null;

	navigating.subscribe((nav) => {
		if (nav && nav.from) {
			previousRoute = nav.from.url.pathname;
		}
	});

	onMount(() => {
		fromHomePage = previousRoute === '/' || previousRoute === null;
		visible = true;
	});
</script>

<h1 class="page-heading">hobbies.</h1>
<p class="page-subtitle">
	When I'm not working, you'll find me doing these things.<br />
	Some I've loved for years, others are newer adventures.
</p>

<div class="grid-container">
	{#each Object.entries(hobbies) as [_, hobby], index}
		{#if visible}
			<HobbyTile
				{hobby}
				duration={fromHomePage ? 600 : 300}
				delay={fromHomePage ? index * 125 : 0}
			/>
		{/if}
	{/each}
</div>
