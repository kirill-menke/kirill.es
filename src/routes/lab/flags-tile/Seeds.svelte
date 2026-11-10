<script>
	import Shell from './Shell.svelte';
	import { flags, N, stops } from './palette.js';

	let { item: project, linkSection = false } = $props();

	// A sunflower head: seeds on the golden angle, each a pie of one flag's colours. The flags are
	// dealt out by angle in ring order, so the circle's gradient runs round it like a colour wheel.
	const HOLE = 46; // seeds skipped in the middle, which leaves room for the count
	const TOTAL = N + HOLE;
	const GOLDEN = 1 - 2 / (1 + Math.sqrt(5)); // the golden angle, in turns
	const spots = flags
		.map((_, i) => {
			const k = i + HOLE;
			return { k, turn: (k * GOLDEN) % 1 };
		})
		.sort((a, b) => a.turn - b.turn);
	const seeds = flags.map((f, i) => {
		const { k, turn } = spots[i];
		return {
			code: f.code,
			// Pop in from the middle outwards
			order: k - HOLE,
			r: (43 * Math.sqrt(k / TOTAL)).toFixed(2),
			turn: turn.toFixed(4),
			size: (3 + 2.2 * (k / TOTAL)).toFixed(2),
			bg: `conic-gradient(${stops(f.colors, 0, 360, 'deg').join(', ')})`
		};
	});
</script>

<!-- Seeds: a sunflower of flags that blooms open on hover -->
<Shell {project} {linkSection}>
	<div class="head" aria-hidden="true">
		{#each seeds as s (s.code)}
			<span
				class="seed"
				style:--r={s.r}
				style:--turn="{s.turn}turn"
				style:--size="{s.size}cqw"
				style:--i={s.order}
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
	.head {
		position: absolute;
		left: 50%;
		top: 55%;
		width: 0;
		height: 0;
		--bloom: 1;
		animation: spin 180s linear infinite;
	}

	:global(.tile:hover) .head {
		--bloom: 1.07;
	}

	.seed {
		position: absolute;
		width: var(--size);
		aspect-ratio: 1;
		border-radius: 50%;
		box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.25);
		transform: translate(-50%, -50%) rotate(var(--turn))
			translateY(calc(var(--r) * var(--bloom) * -1cqw));
		transition: transform 0.6s var(--ease-back-in-out);
		transition-delay: calc(var(--i) * 1.5ms);
		animation: sprout 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
		animation-delay: calc(var(--enter-delay, 0ms) + 200ms + var(--i) * 5ms);
	}

	@keyframes sprout {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) rotate(var(--turn)) translateY(0) scale(0);
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

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.head,
		.seed {
			animation: none;
		}
	}
</style>
