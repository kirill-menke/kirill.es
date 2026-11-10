<script>
	import Shell from './Shell.svelte';
	import { flags, sunflower, fmt } from './palette.js';

	let { item: project, linkSection = false } = $props();

	// Pointillism: one dot per colour of every flag (656 of them), sized by its share of the flag,
	// on a sunflower spiral and dealt out by angle, so the circle's gradient becomes a colour wheel.
	const paint = flags.flatMap((f) => f.colors.map((c) => ({ key: `${f.code}-${c.hex}`, ...c })));
	const dots = sunflower(paint.length, 100).map((spot, i) => {
		const angle = 2 * Math.PI * spot.turn;
		return {
			...paint[i],
			x: fmt(44 * spot.r * Math.sin(angle)),
			y: fmt(-44 * spot.r * Math.cos(angle)),
			r: fmt(0.7 + 1.35 * Math.sqrt(paint[i].share)),
			a: spot.turn.toFixed(3)
		};
	});
</script>

<!-- Seeds · pointillism: every colour of every flag as a dab of paint -->
<Shell {project} {linkSection}>
	<svg class="canvas" viewBox="-50 -50 100 100" aria-hidden="true">
		{#each dots as d (d.key)}
			<circle cx={d.x} cy={d.y} r={d.r} fill={d.hex} style:--a={d.a} />
		{/each}
	</svg>
	<h2 class="centre">
		<span class="count">{project.count}</span>
		<span class="caption">{project.title}</span>
	</h2>
</Shell>

<style>
	.canvas {
		position: absolute;
		left: 8%;
		top: 13%;
		width: 84%;
		overflow: visible;
		animation: spin 180s linear infinite;
	}

	circle {
		stroke: rgba(0, 0, 0, 0.12);
		stroke-width: 0.15;
		transform-box: fill-box;
		transform-origin: center;
		transition: transform 0.5s var(--ease-back-in-out);
		/* A ripple that runs once round the wheel */
		transition-delay: calc(var(--a) * 500ms);
	}

	:global(.tile:hover) circle {
		transform: scale(1.25);
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

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.canvas {
			animation: none;
		}
	}
</style>
