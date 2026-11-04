<script>
	import TileGrid from '#lib/components/tiles/TileGrid.svelte';
	import { projects } from '#lib/tile-data.js';

	const subtitle = [
		'I build things — Sometimes to solve problems, mostly because I enjoy the process.',
		'Here you can find a mix of experiments and explorations.'
	];
</script>

<svelte:head>
	<title>projects. · Kirill's Garden</title>
	<meta name="description" content={subtitle.join(' ')} />
</svelte:head>

<h1 class="page-heading">projects.</h1>
<p class="page-subtitle">{subtitle[0]}<br />{subtitle[1]}</p>

<TileGrid items={Object.values(projects)} />
