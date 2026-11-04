<script>
	import { imageUrl, placeOnRing } from '#lib/flags/ring.js';
	import TileHeader from './TileHeader.svelte';

	let { item: project, linkSection = false } = $props();

	// Same layout as the /flags circle (top edge facing outward, first flag at 12 o'clock), fewer flags.
	const RADIUS = 37; // % of the ring box, ring centre line
	const width = $derived(((2 * Math.PI * RADIUS) / project.ring.length) * 0.9);
	const placed = $derived(
		project.ring.map((code, i) => {
			const { angle, x, y } = placeOnRing(i, project.ring.length, RADIUS);
			const style = `left: ${x}%; top: ${y}%; width: ${width}%; --angle: ${angle + 90}deg; --i: ${i}`;
			return { code, style };
		})
	);
</script>

<!-- Square tile: a slowly turning ring of flags with the flag count in the middle -->
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
		<div class="ring">
			{#each placed as { code, style } (code)}
				<div class="flag" {style}>
					<img src={imageUrl(code)} alt="" decoding="async" draggable="false" />
				</div>
			{/each}
		</div>
	</div>
	<h2 class="centre">
		<span class="count">{project.count}</span>
		<span class="caption">{project.title}</span>
	</h2>
</div>

<style>
	.tile {
		aspect-ratio: 1;
		overflow: hidden;
		container-type: size;
	}

	.stage {
		position: absolute;
		inset: 0;
	}

	/* Square box nudged down so the top of the ring clears the header */
	.ring {
		position: absolute;
		top: 4%;
		left: 0;
		width: 100%;
		aspect-ratio: 1;
		animation: spin 120s linear infinite;
	}

	.flag {
		position: absolute;
		aspect-ratio: 3 / 2;
		transform: translate(-50%, -50%) rotate(var(--angle)) scale(var(--scale, 1));
		transition: transform 0.25s ease-out;
		transition-delay: calc(var(--i) * 8ms);
		animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
		/* Pops in after the tile's own entrance delay, which TileGrid sets on the grid item */
		animation-delay: calc(var(--enter-delay, 0ms) + 200ms + var(--i) * 20ms);
	}

	.flag img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: var(--flag-outline);
	}

	.tile:hover .flag {
		--scale: 1.3;
	}

	.centre {
		position: absolute;
		left: 50%;
		top: 54%;
		transform: translate(-50%, -50%);
		margin: 0;
		font-weight: 400;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.count {
		font-family: var(--font-secondary);
		font-size: 20cqw;
		line-height: 1;
		color: var(--color-font-dark);
	}

	.caption {
		margin-top: 0.25rem;
		font-family: var(--font-secondary);
		font-size: max(0.85rem, 6cqw);
		color: var(--color-font-light);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) rotate(var(--angle)) scale(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ring,
		.flag {
			animation: none;
		}
	}
</style>
