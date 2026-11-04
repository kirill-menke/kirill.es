<script>
	import { afterNavigate } from '$app/navigation';
	import HobbyTileFade from '#lib/components/HobbyTileFade.svelte';
	import HobbyTileSlide from '#lib/components/HobbyTileSlide.svelte';
	import { hobbies } from '#lib/tile-data.js';

	let visible = false;
	let fromHomePage = false;

	// Runs once the page is shown; `from` is null on a direct visit.
	afterNavigate(({ from }) => {
		fromHomePage = !from || from.url.pathname === '/';
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
		<div
			class="grid-item"
			class:span-2-cols={hobby.layout === 'wide'}
			class:aspect-wide={hobby.layout === 'wide'}
		>
			<!-- Moved visible condition inside to make svelte animations work -->
			{#if visible && hobby.tileType === 'fade'}
				<HobbyTileFade
					{hobby}
					duration={fromHomePage ? 600 : 300}
					delay={fromHomePage ? index * 125 : 0}
				/>
			{:else if visible}
				<HobbyTileSlide
					{hobby}
					duration={fromHomePage ? 600 : 300}
					delay={fromHomePage ? index * 125 : 0}
				/>
			{/if}
		</div>
	{/each}
</div>
