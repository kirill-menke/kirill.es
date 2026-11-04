<script>
	import TileGrid from '#lib/components/tiles/TileGrid.svelte';
	import { books } from '#lib/tile-data.js';

	const subtitle = [
		"The books I'm reading, what I've read, and what I hope to read next.",
		'Recommendations are always welcome!'
	];
</script>

<svelte:head>
	<title>reading. · Kirill's Garden</title>
	<meta name="description" content={subtitle.join(' ')} />
</svelte:head>

<h1 class="page-heading">reading.</h1>
<p class="page-subtitle">{subtitle[0]}<br />{subtitle[1]}</p>

<TileGrid items={Object.values(books)} />
