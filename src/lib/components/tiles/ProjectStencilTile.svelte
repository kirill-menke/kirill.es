<script>
	import TileHeader from './TileHeader.svelte';

	let { item: project, linkSection = false } = $props();

	const { value, unit, caption } = $derived(project.fact);
	// Digit size in cqw: as large as the tile allows, smaller for long values
	const size = $derived(Math.min(31, 70 / (value.length * 0.62)));
</script>

<!-- Wide 2:1 dark tile: the screens play inside the fact's giant cut-out digits, which glow onto
     the wall; the unit and caption sit beside them -->
<div role="presentation" class="tile tile-dark">
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

	<h2 class="fact" style:--size="{size}cqw">
		<span class="number" aria-hidden="true">
			<span class="layer glow">
				{#each project.screens as src, i (src)}
					<span class="digits tile-cycle" style="--i: {i}; background-image: url('{src}')"
						>{value}</span
					>
				{/each}
			</span>
			<span class="layer">
				{#each project.screens as src, i (src)}
					<span class="digits tile-cycle" style="--i: {i}; background-image: url('{src}')"
						>{value}</span
					>
				{/each}
			</span>
		</span>
		<span class="visually-hidden">{value}</span>
		<span class="side">
			{#if unit}<span class="unit">{unit}</span>{/if}
			<span class="caption">{caption}</span>
		</span>
	</h2>
</div>

<style>
	.tile {
		aspect-ratio: 2;
		overflow: hidden;
		container-type: size;
	}

	.fact {
		position: absolute;
		left: 1.25rem;
		right: 1.25rem;
		top: 2.6rem;
		bottom: 0.6rem;
		margin: 0;
		font-weight: 400;
		display: flex;
		align-items: center;
		gap: 2.5cqw;
	}

	.number,
	.layer {
		display: grid;
	}

	.number,
	.layer,
	.digits {
		grid-area: 1 / 1;
	}

	/* Heavy sans digits make wide windows; each copy shows one screen through its letters */
	.digits {
		font-family: var(--font-primary);
		font-weight: 850;
		font-size: var(--size);
		line-height: 0.82;
		letter-spacing: -0.05em;
		padding-right: 0.05em;
		color: transparent;
		background-size: cover;
		background-position: center 35%;
		background-clip: text;
		-webkit-background-clip: text;
		/* A hairline keeps each glyph's edge where the screen is dark */
		-webkit-text-stroke: 0.12cqw rgb(255 255 255 / 0.28);
	}

	.layer:not(.glow) .digits {
		filter: brightness(1.15) saturate(1.1);
	}

	/* A blurred copy behind the digits lights the wall in the screen's colours */
	.glow {
		filter: blur(5cqw) saturate(1.8) brightness(1.2);
		opacity: 0.45;
		transition: opacity 0.4s ease;
	}

	.tile:hover .glow {
		opacity: 0.75;
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		min-width: 0;
		font-family: var(--font-secondary);
	}

	.unit {
		font-size: 5cqw;
		line-height: 1;
		color: var(--color-font-on-dark);
	}

	.caption {
		font-size: max(0.8rem, 2.3cqw);
		line-height: 1.3;
		color: var(--color-font-light);
		text-wrap: balance;
	}

	@media (max-width: 480px) {
		.fact {
			left: 0.9rem;
			right: 0.9rem;
		}

		.caption {
			font-size: 0.72rem;
		}
	}
</style>
