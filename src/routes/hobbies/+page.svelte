<script>
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import HobbyTileFade from '$lib/components/HobbyTileFade.svelte';
	import HobbyTileSlide from '$lib/components/HobbyTileSlide.svelte';
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
	{#each Object.values(hobbies) as hobby, index}
		{#if visible}
			<div
				class="grid-item"
				class:span-2-cols={hobby.layout === 'wide'}
				class:aspect-wide={hobby.layout === 'wide'}
			>
				{#if hobby.tileType === 'fade'}
					<HobbyTileFade
						{hobby}
						duration={fromHomePage ? 600 : 300}
						delay={fromHomePage ? index * 125 : 0}
					/>
				{:else}
					<HobbyTileSlide
						{hobby}
						duration={fromHomePage ? 600 : 300}
						delay={fromHomePage ? index * 125 : 0}
					/>
				{/if}
			</div>
		{/if}
	{/each}
</div>
