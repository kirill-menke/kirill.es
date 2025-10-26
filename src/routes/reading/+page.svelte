<script>
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import BookTile from '$lib/components/BookTile.svelte';
	import { books } from '$lib/tile-data.js';

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

<h1 class="page-heading">reading.</h1>
<p class="page-subtitle">
	The books I'm reading, what I've read, and what I hope to read next.<br />
	Recommendations are always welcome!
</p>

<div class="grid-container">
	{#each Object.values(books) as book, index}
		{#if visible}
			<BookTile
				{book}
				duration={fromHomePage ? 600 : 300}
				delay={fromHomePage ? index * 125 : 0}
			/>
		{/if}
	{/each}
</div>
