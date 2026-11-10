<script>
	import Shell from './Shell.svelte';
	import { flags, spread, sunflower, stops, imageUrl } from './palette.js';

	let { item: project, linkSection = false } = $props();

	// A sunflower: a dark head of 193 colour seeds dealt out like a colour wheel, ringed by 21
	// petals that are real flags, again in ring order.
	const DISC = 23; // cqw, radius of the head
	const seeds = sunflower(flags.length, 44).map((spot, i) => ({
		code: flags[i].code,
		r: (DISC * 0.94 * spot.r).toFixed(2),
		turn: spot.turn.toFixed(4),
		size: (1.6 + 0.9 * spot.r).toFixed(2),
		bg: `conic-gradient(${stops(flags[i].colors, 0, 360, 'deg').join(', ')})`
	}));
	const petals = spread(21).map((f, k, all) => ({
		code: f.code,
		turn: (k / all.length).toFixed(4),
		i: k
	}));
</script>

<!-- Seeds · sunflower: flags as petals around a head of colour seeds -->
<Shell {project} {linkSection}>
	<div class="flower" aria-hidden="true">
		{#each petals as p (p.code)}
			<span class="petal" style:--turn="{p.turn}turn" style:--i={p.i}>
				<img src={imageUrl(p.code)} alt="" decoding="async" draggable="false" />
			</span>
		{/each}
		<span class="disc"></span>
		{#each seeds as s (s.code)}
			<span
				class="seed"
				style:--r={s.r}
				style:--turn="{s.turn}turn"
				style:--size="{s.size}cqw"
				style:background={s.bg}
			></span>
		{/each}
	</div>
	<h2 class="centre">
		<span class="count">{project.count}</span>
		<span class="caption">flags</span>
	</h2>
</Shell>

<style>
	.flower {
		position: absolute;
		left: 50%;
		top: 56%;
		width: 0;
		height: 0;
		--open: 0cqw;
		animation: spin 150s linear infinite;
	}

	:global(.tile:hover) .flower {
		--open: 2.5cqw;
	}

	.petal {
		position: absolute;
		width: 9cqw;
		height: 18cqw;
		border-radius: 50%;
		overflow: hidden;
		box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.2);
		transform: translate(-50%, -50%) rotate(var(--turn))
			translateY(calc(-30.5cqw - var(--open)));
		transition: transform 0.6s var(--ease-back-in-out);
		transition-delay: calc(var(--i) * 15ms);
	}

	/* The flag runs along the petal */
	.petal img {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 18cqw;
		height: 12cqw;
		object-fit: cover;
		transform: translate(-50%, -50%) rotate(90deg);
	}

	.disc {
		position: absolute;
		width: 47cqw;
		aspect-ratio: 1;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		background: radial-gradient(circle, #2a1d12 40%, #3d2a18 75%, #4a3420);
		box-shadow: 0 0 0 0.6cqw rgba(74, 52, 32, 0.25);
	}

	.seed {
		position: absolute;
		width: var(--size);
		aspect-ratio: 1;
		border-radius: 50%;
		transform: translate(-50%, -50%) rotate(var(--turn)) translateY(calc(var(--r) * -1cqw));
	}

	.centre {
		position: absolute;
		left: 50%;
		top: 56%;
		transform: translate(-50%, -50%);
		margin: 0;
		font-weight: 400;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: var(--font-secondary);
		color: #f6efe3;
	}

	.count {
		font-size: 8cqw;
		line-height: 1;
	}

	.caption {
		font-size: max(0.65rem, 2.8cqw);
		opacity: 0.7;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.flower {
			animation: none;
		}
	}
</style>
