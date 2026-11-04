<script>
	import TileHeader from './TileHeader.svelte';

	let { item: hobby, linkSection = false } = $props();

	const aspect = $derived(hobby.layout === 'square' ? 1 : 2);
</script>

<div role="presentation" class="tile" style="aspect-ratio: {aspect}">
	<div class="tile-image-container">
		<div class="hobby-tile-bg" style="background-image: url('{hobby.preview}')"></div>
	</div>
	<div class="tile-header">
		<TileHeader section="Hobbies" name={hobby.name} {linkSection} />
	</div>

	<h2 class="tile-title">{hobby.title}</h2>
</div>

<style>
	.tile {
		justify-content: space-between;
	}

	.hobby-tile-bg {
		border-radius: 0.5rem;
		position: absolute;
		inset: 0;
		background-size: cover;
		transition:
			z-index 0s linear 0s,
			transform 0.1s linear;
		z-index: 1;
	}

	/* The image covers the header until it slides down */
	.tile:hover .hobby-tile-bg,
	.tile:focus-within .hobby-tile-bg {
		transform: translateY(3rem);
		z-index: 0;
		transition:
			transform 0.1s linear,
			z-index 0s linear 0.1s;
	}

	.tile-header {
		/* Height of the arrow link the other tiles' headers hold, so the text sits at the same height */
		min-height: 29px;
		z-index: 0;
	}

	.tile-title {
		width: fit-content;
		padding: 0.3rem 0.5rem;
		margin: 0.6rem;
		background-color: transparent;
		font-family: var(--font-primary);
		color: white;
		font-size: 0.9rem;
		font-weight: 400;
		border-radius: 0.5rem;
		z-index: 2;
		transition: background-color 0.1s linear;
		backdrop-filter: blur(1px) brightness(0.7);
	}

	.tile:hover .tile-title,
	.tile:focus-within .tile-title {
		background-color: var(--color-font-dark);
		opacity: 0.9;
	}
</style>
