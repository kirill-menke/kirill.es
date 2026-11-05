<script>
	import TileHeader from './TileHeader.svelte';

	let { item: project, linkSection = false } = $props();

	const { value, unit, caption } = $derived(project.fact);
</script>

<!-- Wide 2:1 tile: the TV turned away on the left, cut off by the edge, its picture casting a
     coloured glow onto the tile; the project's fact in big serif type on the right -->
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

	<div class="stage" aria-hidden="true">
		<!-- The same screens, blurred: the glow changes colour with the picture -->
		<div class="glow">
			{#each project.screens as src, i (src)}
				<img {src} alt="" class="tile-cycle" style="--i: {i}" loading="lazy" />
			{/each}
		</div>
		<div class="tv">
			{#each project.screens as src, i (src)}
				<img {src} alt="" class="tile-cycle" style="--i: {i}" loading="lazy" />
			{/each}
		</div>
	</div>

	<h2 class="fact">
		<span class="value" class:long={value.length > 3}
			>{value}{#if unit}<small>{` ${unit}`}</small>{/if}</span
		>
		<span class="caption">{caption}</span>
	</h2>
</div>

<style>
	.tile {
		aspect-ratio: 2;
		overflow: hidden;
		container-type: size;
	}

	.stage {
		position: absolute;
		inset: 0;
	}

	/* The TV and its glow share one box, turned to face the fact */
	.tv,
	.glow {
		position: absolute;
		left: -5cqw;
		top: max(10cqw, 2.6rem);
		width: 60cqw;
		aspect-ratio: 16 / 9;
		transform: perspective(90cqw) rotateY(16deg) rotateX(3deg);
		transform-origin: right center;
		transition: transform 0.4s var(--ease-cubic-out);
	}

	.tv {
		background: var(--color-device-screen);
		border: 0.4cqw solid var(--color-device-bezel);
		border-radius: 0.8cqw;
		overflow: hidden;
	}

	/* Brightened and saturated, so on the light tile it reads as coloured light, not grey */
	.glow {
		filter: blur(4cqw) saturate(2.2) brightness(1.6);
		opacity: 0.55;
		scale: 1.15;
		transition:
			transform 0.4s var(--ease-cubic-out),
			opacity 0.4s ease,
			scale 0.4s ease;
	}

	.stage img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.tile:hover .tv,
	.tile:hover .glow {
		transform: perspective(90cqw) rotateY(7deg) rotateX(1deg) translateX(2cqw);
	}

	.tile:hover .glow {
		opacity: 0.7;
		scale: 1.28;
	}

	/* Right-aligned, centred in the space under the header */
	.fact {
		position: absolute;
		right: 1.25rem;
		top: 2.6rem;
		bottom: 0.6rem;
		width: 40cqw;
		margin: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
		text-align: right;
		font-family: var(--font-secondary);
		font-weight: 400;
		z-index: 1;
	}

	.value {
		font-size: 15cqw;
		line-height: 0.95;
		color: var(--color-font-dark);
		white-space: nowrap;
	}

	/* Four or more characters would run into the TV */
	.value.long {
		font-size: 11cqw;
	}

	.value small {
		font-size: 0.32em;
		color: var(--color-font-light);
	}

	.caption {
		margin-top: 0.5rem;
		font-size: max(0.85rem, 2.5cqw);
		line-height: 1.3;
		color: var(--color-font-light);
		text-wrap: balance;
	}

	@media (max-width: 480px) {
		.fact {
			right: 0.9rem;
			width: 38cqw;
		}

		.value {
			font-size: 13cqw;
		}

		.value.long {
			font-size: 10cqw;
		}

		.caption {
			font-size: 0.75rem;
			margin-top: 0.25rem;
		}
	}
</style>
