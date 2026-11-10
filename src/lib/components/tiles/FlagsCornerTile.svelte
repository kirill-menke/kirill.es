<script>
	import { count, swatches } from 'virtual:flags-tile';
	import { textOn } from '#lib/flags/colour.js';
	import { imageUrl } from '#lib/flags/ring.js';
	import TileHeader from './TileHeader.svelte';

	let { item: project, linkSection = false } = $props();

	// A paint fan deck held from the bottom-left corner: 12 flag strips, every chip labelled with
	// its colour name like a real paint strip. On hover it opens to the full quarter.
	const picked = swatches.filter((_, k) => k % 2 === 0);
	const strips = picked.map((s, k) => ({
		...s,
		label: `${s.code.toUpperCase()} · ${String(s.no).padStart(3, '0')}`,
		chips: s.colors.map((c) => ({ ...c, ink: textOn(c.hex) })),
		style: `--t: ${(k / (picked.length - 1)).toFixed(4)}; --i: ${k}`
	}));
</script>

<!-- Square tile: flag paint strips fanned from the corner, the count in the open space -->
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
				{#each s.chips as c (c.hex)}
					<span class="chip" style:background={c.hex} style:color={c.ink}>{c.name}</span>
				{/each}
				<span class="label">{s.label}</span>
			</div>
		{/each}
		<span class="screw" aria-hidden="true"></span>
	</div>
	<h2 class="legend">
		<span class="count">{count}</span>
		<span class="caption">{project.title}</span>
	</h2>
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
		left: 10cqw;
		top: 90cqw;
		width: 0;
		height: 0;
		z-index: 0;
		--from: 3deg;
		--spread: 50deg;
	}

	.tile:hover .deck {
		--from: 0deg;
		--spread: 88deg;
	}

	.strip {
		position: absolute;
		left: -6cqw;
		bottom: -5cqw;
		width: 12cqw;
		height: 76cqw;
		box-sizing: border-box;
		/* Room below the label for the screw hole the strips turn on */
		padding: 1.2cqw 1.2cqw 10cqw;
		display: flex;
		flex-direction: column;
		gap: 0.6cqw;
		background: white;
		border-radius: 1.2cqw;
		box-shadow:
			0 0 0 0.5px rgba(0, 0, 0, 0.12),
			0 0.4cqw 1.2cqw rgba(0, 0, 0, 0.12);
		transform-origin: 50% calc(100% - 5cqw);
		transform: rotate(calc(var(--from) + var(--t) * var(--spread)));
		transition: transform 0.8s var(--ease-back-in-out);
		transition-delay: calc(var(--i) * 20ms);
	}

	.strip img {
		width: 100%;
		height: 7cqw;
		object-fit: cover;
		border-radius: 0.6cqw;
		filter: var(--flag-outline);
	}

	.chip {
		flex: 1;
		display: flex;
		align-items: flex-end;
		padding: 0 0.8cqw 0.6cqw;
		border-radius: 0.5cqw;
		box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.1);
		font-size: 1.9cqw;
		line-height: 1;
		white-space: nowrap;
		overflow: hidden;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 1.9cqw;
		letter-spacing: 0.04em;
		color: var(--color-font-light);
		white-space: nowrap;
	}

	.screw {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 30;
		width: 3.2cqw;
		aspect-ratio: 1;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		background: radial-gradient(circle at 35% 35%, #fafafa, #a3a3a3 55%, #6b6b6b);
		box-shadow: 0 0.3cqw 0.6cqw rgba(0, 0, 0, 0.25);
	}

	.legend {
		position: absolute;
		right: 7%;
		top: 16%;
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		text-align: right;
		font-weight: 400;
		font-family: var(--font-secondary);
	}

	.count {
		font-size: 17cqw;
		line-height: 1;
		color: var(--color-font-dark);
	}

	.caption {
		font-size: max(0.8rem, 4.6cqw);
		color: var(--color-font-light);
	}

	@media (prefers-reduced-motion: reduce) {
		.strip {
			transition: none;
		}
	}
</style>
