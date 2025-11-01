<script>
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import WIPTileImages from '$lib/components/WIPTileImages.svelte';
	import { projects } from '$lib/tile-data.js';

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

<h1 class="page-heading">projects.</h1>
<p class="page-subtitle">
	I build things — Sometimes to solve problems, mostly because I enjoy the process.<br />
	Here you can find a mix of experiments and explorations.
</p>

<div class="grid-container">
	{#each Object.values(projects) as project, index}
		{#if visible}
			{@const square = project.layout === 'square'}
			<div class="grid-item" class:span-2-cols={!square} class:aspect-wide={!square}>
				<WIPTileImages
					{project}
					duration={fromHomePage ? 600 : 300}
					delay={fromHomePage ? index * 125 : 0}
				/>
			</div>
		{/if}
	{/each}
</div>
