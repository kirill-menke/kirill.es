<script>
	import { count, badges } from 'virtual:flags-tile';
	import { imageUrl } from '#lib/flags/ring.js';
	import TileHeader from './TileHeader.svelte';

	let { item: project, linkSection = false } = $props();

	// A sunflower head of round flags: Vogel's spiral (seed k at radius √k, a golden angle on
	// from the one before), skipping the first spots to leave the middle for the count. The flags
	// are dealt out by angle in ring order, so the circle's gradient runs round it like a colour
	// wheel. 55 badges, a Fibonacci number like the spirals of a real head.
	const HOLE = 14;
	const GOLDEN = 1 - 2 / (1 + Math.sqrt(5)); // the golden angle, in turns
	const total = badges.length + HOLE;
	const seeds = Array.from({ length: badges.length }, (_, i) => {
		const k = i + HOLE;
		return { order: i, r: Math.sqrt(k / total), turn: (k * GOLDEN) % 1 };
	})
		.sort((a, b) => a.turn - b.turn)
		.map((spot, i) => ({
			code: badges[i],
			order: spot.order,
			style: [
				`--r: ${(41 * spot.r).toFixed(2)}`,
				`--turn: ${spot.turn.toFixed(4)}turn`,
				`--size: ${(5.6 + 3.4 * spot.r * spot.r).toFixed(2)}cqw`,
				`--i: ${spot.order}`
			].join('; ')
		}));
</script>

<!-- Square tile: a still sunflower of upright flag badges with the flag count in the middle -->
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

	<div class="head" aria-hidden="true">
		{#each seeds as s (s.code)}
			<img
				class="seed"
				src={imageUrl(s.code)}
				alt=""
				decoding="async"
				draggable="false"
				style={s.style}
			/>
		{/each}
	</div>
	<h2 class="centre">
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

	/* The head's centre; seeds are placed from here in cqw, so they scale with the tile */
	.head {
		position: absolute;
		left: 50%;
		top: 55%;
		width: 0;
		height: 0;
		--bloom: 1;
	}

	.tile:hover .head {
		--bloom: 1.08;
	}

	.seed {
		position: absolute;
		width: var(--size);
		aspect-ratio: 1;
		border-radius: 50%;
		object-fit: cover;
		box-shadow:
			0 0 0 0.5px rgba(0, 0, 0, 0.25),
			0 0.3cqw 0.8cqw rgba(0, 0, 0, 0.12);
		/* Out along its angle, then turned back so the flag sits upright on the head */
		transform: translate(-50%, -50%) rotate(var(--turn))
			translateY(calc(var(--r) * var(--bloom) * -1cqw)) rotate(calc(var(--turn) * -1));
		transition: transform 0.6s var(--ease-cubic-out);
		transition-delay: calc(var(--i) * 2ms);
	}

	.centre {
		position: absolute;
		left: 50%;
		top: 55%;
		transform: translate(-50%, -50%);
		margin: 0;
		font-weight: 400;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		font-family: var(--font-secondary);
	}

	.count {
		font-size: 12cqw;
		line-height: 1;
		color: var(--color-font-dark);
	}

	.caption {
		font-size: max(0.7rem, 3.6cqw);
		color: var(--color-font-light);
	}
</style>
