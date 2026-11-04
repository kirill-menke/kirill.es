<script>
	import TileHeader from './TileHeader.svelte';

	let { item: hobby, linkSection = false } = $props();

	const aspect = $derived(hobby.layout === 'square' ? 1 : 2);
</script>

<div role="presentation" class="tile" style="aspect-ratio: {aspect}">
	<div class="tile-image-container">
		<img class="hobby-tile-bg" src={hobby.preview} alt="" loading="lazy" decoding="async" />
	</div>
	<div class="hobby-tile-content">
		<TileHeader section="Hobbies" name={hobby.name} {linkSection} />
	</div>

	<div class="tile-footer">
		<div class="tags">
			{#each hobby.tags ?? [] as tag (tag)}
				<div class="tile-pill" data-tag={tag}>{tag}</div>
			{/each}
		</div>
		<h2 class="tile-title">{hobby.title}</h2>
	</div>
</div>

<style>
	.hobby-tile-bg {
		position: absolute;
		width: 100%;
		transition: transform 0.3s ease;
	}

	.tile:hover .hobby-tile-bg {
		z-index: 1;
		transform: scale(1.05);
	}

	.hobby-tile-content {
		padding: 1rem 1.25rem 0.45rem 1.25rem;
		z-index: 2;
	}

	.tile-footer {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		flex-grow: 1;
		z-index: 0;
		padding: 1rem 1.25rem 0.45rem 1.25rem;
		gap: 10px;
		background: linear-gradient(to top, #fafafa, transparent 60%);
		transition: opacity 0.1s linear;
	}

	.tile:hover .tile-footer,
	.tile:focus-within .tile-footer {
		opacity: 0.3;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
	}

	.tile-pill {
		box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);
		opacity: 0.85;
	}

	.tile-pill[data-tag='Horror'] {
		background-color: oklch(0.7 0.1 18);
		color: oklch(0.45 0.1 18);
	}

	.tile-pill[data-tag='Comedy'] {
		background-color: oklch(0.8 0.1 85);
		color: oklch(0.5 0.1 85);
	}

	.tile-pill[data-tag='Shōnen'] {
		background-color: oklch(0.7 0.1 25);
		color: oklch(0.45 0.1 25);
	}

	.tile-pill[data-tag='Iyashikei'] {
		background-color: oklch(0.85 0.04 310);
		color: oklch(0.5 0.04 310);
	}

	.tile-pill[data-tag='Action'] {
		background-color: oklch(0.8 0.1 54);
		color: oklch(0.55 0.1 54);
	}

	.tile-title {
		font-family: var(--font-secondary);
		color: black;
		font-size: 2.25rem;
		font-weight: 400;
		margin: 0;
	}
</style>
