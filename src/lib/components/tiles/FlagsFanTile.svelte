<script>
	import { count, swatches } from 'virtual:flags-tile';
	import { imageUrl } from '#lib/flags/ring.js';
	import TileHeader from './TileHeader.svelte';

	let { item: project, linkSection = false } = $props();

	// A paint fan deck that opens into one circle: 24 flag strips held half open low in the
	// tile; on hover the deck rises to the middle and swings all the way round.
	const strips = swatches.map((s, k) => ({
		...s,
		style: `--t: ${(k / (swatches.length - 1) - 0.5).toFixed(4)}; --i: ${k}`
	}));
</script>

<!-- Square tile: a half-open fan of flag paint strips that closes the circle on hover -->
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

	<div class="deck">
		{#each strips as s (s.code)}
			<div class="strip" style={s.style} aria-hidden="true">
				<img src={imageUrl(s.code)} alt="" decoding="async" draggable="false" />
				{#each s.colors as c (c.hex)}
					<span class="chip" style:background={c.hex}></span>
				{/each}
			</div>
		{/each}
		<h2 class="hub">
			<span class="count">{count}</span>
			<span class="caption">flags</span>
		</h2>
	</div>
</div>

<style>
	.tile {
		aspect-ratio: 1;
		overflow: hidden;
		container-type: size;
	}

	/* The pivot. Its own stacking context keeps the strips under the full-tile link. */
	.deck {
		position: absolute;
		left: 50%;
		top: 71%;
		width: 0;
		height: 0;
		z-index: 0;
		--spread: 190deg;
		transition: top 0.9s var(--ease-back-in-out);
	}

	.tile:hover .deck {
		top: 56%;
		/* 23/24 of a turn: the last strip lands one step short of the first */
		--spread: 345deg;
	}

	.strip {
		position: absolute;
		left: -4.5cqw;
		bottom: 0;
		width: 9cqw;
		height: 42cqw;
		box-sizing: border-box;
		/* The inner end hides under the hub */
		padding: 1cqw 1cqw 12cqw;
		display: flex;
		flex-direction: column;
		gap: 0.6cqw;
		background: white;
		border-radius: 1cqw;
		box-shadow:
			0 0 0 0.5px rgba(0, 0, 0, 0.12),
			0 0.4cqw 1.2cqw rgba(0, 0, 0, 0.12);
		transform-origin: 50% 100%;
		transform: rotate(calc(var(--t) * var(--spread)));
		transition: transform 0.9s var(--ease-back-in-out);
		transition-delay: calc(var(--i) * 12ms);
	}

	.strip img {
		width: 100%;
		height: 6cqw;
		object-fit: cover;
		border-radius: 0.5cqw;
		filter: var(--flag-outline);
	}

	.chip {
		flex: 1;
		border-radius: 0.4cqw;
		box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.1);
	}

	.hub {
		position: absolute;
		left: 0;
		top: 0;
		width: 22cqw;
		aspect-ratio: 1;
		margin: 0;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: radial-gradient(circle at 35% 30%, #fff, #f1f1f1 60%, #e2e2e2);
		box-shadow:
			0 0 0 0.5px rgba(0, 0, 0, 0.15),
			0 0.6cqw 1.6cqw rgba(0, 0, 0, 0.18);
		font-weight: 400;
		font-family: var(--font-secondary);
	}

	.count {
		font-size: 8cqw;
		line-height: 1;
		color: var(--color-font-dark);
	}

	.caption {
		font-size: max(0.65rem, 2.8cqw);
		color: var(--color-font-light);
	}

	@media (prefers-reduced-motion: reduce) {
		.deck,
		.strip {
			transition: none;
		}
	}
</style>
