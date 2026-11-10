<script>
	import TileHeader from '#lib/components/tiles/TileHeader.svelte';

	// The square tile frame every lab variant shares: full-tile link, header row, then the art.
	let { project, linkSection = false, children } = $props();
</script>

<div role="presentation" class="tile">
	<a class="tile-link" href={project.link} aria-label="Open the {project.name} project page"></a>
	<div class="tile-header">
		<TileHeader
			section="Projects"
			name={project.name}
			{linkSection}
			href={project.link}
			label="View project"
			duplicate
		/>
	</div>
	{@render children()}
</div>

<style>
	.tile {
		aspect-ratio: 1;
		overflow: hidden;
		container-type: size;
	}
</style>
