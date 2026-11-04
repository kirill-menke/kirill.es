<script>
	import TileGrid from '#lib/components/tiles/TileGrid.svelte';
	import { hobbies } from '#lib/tile-data.js';

	const subtitle = [
		"When I'm not working, you'll find me doing these things.",
		"Some I've loved for years, others are newer adventures."
	];
</script>

<svelte:head>
	<title>hobbies. · Kirill's Garden</title>
	<meta name="description" content={subtitle.join(' ')} />
</svelte:head>

<h1 class="page-heading">hobbies.</h1>
<p class="page-subtitle">{subtitle[0]}<br />{subtitle[1]}</p>

<TileGrid items={Object.values(hobbies)} />
