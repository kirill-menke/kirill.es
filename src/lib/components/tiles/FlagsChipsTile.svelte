<script>
	import { count, swatches } from 'virtual:flags-tile';
	import { ink } from '#lib/flags/colour.js';
	import { imageUrl } from '#lib/flags/ring.js';
	import TileHeader from './TileHeader.svelte';

	let { item: project, linkSection = false } = $props();

	// Loose paint chips: eight flag cards in a messy pile under a title card. On hover they
	// slide out into a circle round it, in ring order. The pile is fixed [x, y, rotation], so
	// the server and the browser draw the same one.
	const PILE = [
		[-8, 5, -18],
		[9, -4, 11],
		[-3, -7, 5],
		[6, 7, -9],
		[-10, 0, 15],
		[8, 3, -4],
		[1, -5, 20],
		[-6, 8, -13]
	];
	const picked = swatches.filter((_, k) => k % 3 === 0);
	const cards = picked.map((s, k) => {
		const [dx, dy, rot] = PILE[k % PILE.length];
		const angle = (2 * Math.PI * k) / picked.length;
		// Spot on an ellipse round the title card, the first at 12 o'clock
		const ox = (30 * Math.sin(angle)).toFixed(2);
		const oy = (-20 * Math.cos(angle)).toFixed(2);
		return {
			...s,
			label: `No. ${String(s.no).padStart(3, '0')} · ${ink(s.colors).slice(1).toUpperCase()}`,
			style: [
				`--dx: ${dx}cqw; --dy: ${dy}cqw; --rot: ${rot}deg`,
				`--ox: ${ox}cqw; --oy: ${oy}cqw; --i: ${k}`
			].join('; ')
		};
	});
</script>

<!-- Square tile: a pile of flag paint chips that spreads into a circle on hover -->
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

	<div class="table">
		{#each cards as c (c.code)}
			<div class="card" style={c.style} aria-hidden="true">
				<img src={imageUrl(c.code)} alt="" decoding="async" draggable="false" />
				<span class="name">{c.name}</span>
				<span class="code">{c.label}</span>
			</div>
		{/each}
		<h2 class="card cover">
			<span class="count">{count}</span>
			<span class="caption">{project.title}</span>
		</h2>
	</div>
</div>

<style>
	.tile {
		aspect-ratio: 1;
		overflow: hidden;
		container-type: size;
	}

	/* The pile's centre. Its own stacking context keeps the cards under the full-tile link. */
	.table {
		position: absolute;
		left: 50%;
		top: 58%;
		width: 0;
		height: 0;
		z-index: 0;
		--out: 0;
	}

	.tile:hover .table {
		--out: 1;
	}

	.card {
		position: absolute;
		left: -16cqw;
		top: -21cqw;
		width: 32cqw;
		height: 42cqw;
		box-sizing: border-box;
		margin: 0;
		padding: 1.4cqw;
		display: flex;
		flex-direction: column;
		background: white;
		border-radius: 1.2cqw;
		box-shadow:
			0 0 0 0.5px rgba(0, 0, 0, 0.12),
			0 0.6cqw 1.8cqw rgba(0, 0, 0, 0.14);
		/* Piled up by PILE; spread out to the ellipse, half straightened and a little smaller */
		transform: translate(
				calc(var(--dx) + var(--out) * (var(--ox) - var(--dx))),
				calc(var(--dy) + var(--out) * (var(--oy) - var(--dy)))
			)
			rotate(calc(var(--rot) * (1 - var(--out) * 0.6))) scale(calc(1 - var(--out) * 0.22));
		transition: transform 0.75s var(--ease-back-in-out);
		transition-delay: calc(var(--i) * 25ms);
	}

	.card img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border-radius: 0.6cqw;
		filter: var(--flag-outline);
	}

	.name {
		margin-top: 1.6cqw;
		font-size: 3.1cqw;
		font-weight: 600;
		color: var(--color-font-dark);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.code {
		margin-top: 0.4cqw;
		font-family: var(--font-mono);
		font-size: 2.4cqw;
		color: var(--color-font-light);
		white-space: nowrap;
	}

	.cover {
		z-index: 1;
		transform: rotate(-2deg);
		align-items: center;
		justify-content: center;
		text-align: center;
		font-weight: 400;
		font-family: var(--font-secondary);
	}

	.count {
		font-size: 13cqw;
		line-height: 1;
		color: var(--color-font-dark);
	}

	.caption {
		margin-top: 1cqw;
		font-size: 4cqw;
		color: var(--color-font-light);
	}

	@media (prefers-reduced-motion: reduce) {
		.card {
			transition: none;
		}
	}
</style>
