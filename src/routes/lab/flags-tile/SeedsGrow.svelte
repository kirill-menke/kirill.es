<script>
	import Shell from './Shell.svelte';
	import { flags, N, GOLDEN, stops } from './palette.js';

	let { item: project, linkSection = false } = $props();

	// A sunflower that keeps growing: seeds sprout at the rim of the hole and drift outwards, each
	// on its own fixed angle, so the spiral pattern stays while everything flows. Flags are dealt
	// out by angle, so the colour wheel holds still while the seeds move through it.
	const PERIOD = 60; // seconds a seed takes from the middle to the rim
	const R0 = 19; // cqw, where seeds sprout
	const R1 = 43; // cqw, where they fade out
	// Radius along the way, even in area like a real head: r² grows linearly with time
	const radiusAt = (p) => Math.sqrt(R0 * R0 + p * (R1 * R1 - R0 * R0));

	const order = Array.from({ length: N }, (_, i) => i).sort(
		(a, b) => ((a * GOLDEN) % 1) - ((b * GOLDEN) % 1)
	);
	const seeds = order.map((i, rank) => {
		const f = flags[rank];
		// Seed i sprouts i/N of a period after seed 0, so neighbours in time sit a golden angle apart
		const phase = ((N - i) % N) / N;
		return {
			code: f.code,
			turn: ((i * GOLDEN) % 1).toFixed(4),
			delay: (-phase * PERIOD).toFixed(2),
			// Where the seed sits when motion is reduced
			r: radiusAt(phase).toFixed(2),
			bg: `conic-gradient(${stops(f.colors, 0, 360, 'deg').join(', ')})`
		};
	});
</script>

<!-- Seeds · growing: a living sunflower of flag colours -->
<Shell {project} {linkSection}>
	<div class="head" aria-hidden="true">
		{#each seeds as s (s.code)}
			<span
				class="seed"
				style:--turn="{s.turn}turn"
				style:--r={s.r}
				style:animation-delay="{s.delay}s"
				style:animation-duration="{PERIOD}s"
				style:background={s.bg}
			></span>
		{/each}
	</div>
	<h2 class="centre">
		<span class="count">{project.count}</span>
		<span class="caption">{project.title}</span>
	</h2>
</Shell>

<style>
	@property --r {
		syntax: '<number>';
		inherits: false;
		initial-value: 30;
	}

	.head {
		position: absolute;
		left: 50%;
		top: 55%;
		width: 0;
		height: 0;
		transition: transform 0.8s var(--ease-back-in-out);
	}

	:global(.tile:hover) .head {
		transform: scale(1.07);
	}

	/* Size follows the radius (3 cqw at the middle, 5.2 at the rim), so it needs no keyframes */
	.seed {
		position: absolute;
		width: 5.2cqw;
		aspect-ratio: 1;
		border-radius: 50%;
		box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.25);
		transform: translate(-50%, -50%) rotate(var(--turn)) translateY(calc(var(--r) * -1cqw))
			scale(calc(0.58 + 0.42 * var(--r) * var(--r) / 1849));
		animation-name: grow;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}

	/* --r follows radiusAt(p) above, sampled every eighth of the way */
	@keyframes grow {
		0% {
			--r: 19;
			opacity: 0;
		}
		6% {
			opacity: 1;
		}
		12.5% {
			--r: 23.3;
		}
		25% {
			--r: 27;
		}
		37.5% {
			--r: 30.3;
		}
		50% {
			--r: 33.2;
		}
		62.5% {
			--r: 35.9;
		}
		75% {
			--r: 38.4;
		}
		87.5% {
			--r: 40.8;
		}
		92% {
			opacity: 1;
		}
		100% {
			--r: 43;
			opacity: 0;
		}
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

	@media (prefers-reduced-motion: reduce) {
		.seed {
			animation: none;
		}
	}
</style>
