<script module>
	import { around, spline } from '#lib/components/sketch/sketch.js';

	// How long the loop takes to draw on; going round again in ink waits it out
	const DRAW = 480;

	// A pencil loop round a w × h box, in its pixels: a rounded rectangle `gap` outside it, its
	// corners `round` (small enough to clear the box's own corners), from `from` of the way
	// along its top, round and on past the start by `over` of it, wavering in and out by up to
	// `wobble` and creeping `spiral` outwards by the end, so the two ends never meet. Seeded like
	// every drawn line on the page, so a chip is circled the same way each time.
	function loop(w, h, seed, { gap, round, wobble, from, over, spiral }) {
		const rect = { x: -gap, y: -gap, w: w + 2 * gap, h: h + 2 * gap };
		rect.r = Math.min(round, rect.h / 2);
		const straight = rect.w - 2 * rect.r;
		const points = around(rect, seed, {
			wobble,
			from: straight * from,
			over: straight * over + 12,
			step: 5
		});
		const length = points.at(-1)[4];
		return spline(
			points.map(([x, y, nx, ny, s]) => {
				const out = (spiral * s) / length;
				return [x + nx * out, y + ny * out];
			})
		);
	}

	const FIRST = { gap: 4, round: 11, wobble: 1, from: 0.15, over: 0.3, spiral: 1 };
	const AGAIN = { gap: 5, round: 12, wobble: 1.3, from: 0.6, over: 0.12, spiral: -1 };
</script>

<script>
	/*
	 * How the architecture diagram marks the flow chip on show: a loop drawn round it, lightly
	 * in pencil while it is previewed (a hover or keyboard focus), going round again in ink once
	 * it is pinned, and gone at once when it is neither. ArchDiagram puts it in the chip, whose
	 * box it fills and measures, to draw in its pixels.
	 */
	let { pinned = false, seed = 1 } = $props();

	let w = $state(0);
	let h = $state(0);

	// When the loop started drawing, so the second pass waits only as long as the first has left
	const born = performance.now();
	const after = () => `${Math.max(0, DRAW - (performance.now() - born))}ms`;
</script>

<span
	class="mark"
	class:pinned
	style:--draw="{DRAW}ms"
	bind:clientWidth={w}
	bind:clientHeight={h}
	aria-hidden="true"
>
	{#if w}
		<svg viewBox="0 0 {w} {h}">
			<path d={loop(w, h, seed, FIRST)} pathLength="1" />
			{#if pinned}
				<path
					class="again"
					d={loop(w, h, seed + 11, AGAIN)}
					pathLength="1"
					style:animation-delay={after()}
				/>
			{/if}
		</svg>
	{/if}
</span>

<style>
	.mark {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		fill: none;
		stroke: var(--vr-ink);
		stroke-width: 1.3;
		stroke-linecap: round;
		stroke-linejoin: round;
		/* Pencil for a preview, ink once pinned */
		opacity: 0.55;
	}

	.pinned svg {
		opacity: 0.9;
	}

	path {
		stroke-dasharray: 1;
	}

	.again {
		stroke-width: 0.9;
		opacity: 0.65;
	}

	/* Drawn on as it appears; with reduced motion it is simply there */
	@media (prefers-reduced-motion: no-preference) {
		svg {
			transition: opacity 200ms ease;
		}

		path {
			animation: draw var(--draw) cubic-bezier(0.55, 0.1, 0.35, 1) both;
		}

		.again {
			animation-duration: 320ms;
		}
	}

	@keyframes draw {
		from {
			stroke-dashoffset: 1;
			/* Not even a round cap's dot before the pen comes down */
			visibility: hidden;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
