<script>
	import { afterNavigate } from '$app/navigation';
	import BookTile from '#lib/components/BookTile.svelte';
	import { books } from '#lib/tile-data.js';

	let visible = false;
	let fromHomePage = false;

	// Runs once the page is shown; `from` is null on a direct visit.
	afterNavigate(({ from }) => {
		fromHomePage = !from || from.url.pathname === '/';
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
