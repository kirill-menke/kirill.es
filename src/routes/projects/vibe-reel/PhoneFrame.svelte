<script module>
	import { random, rough } from '#lib/components/sketch/sketch.js';

	/*
	 * The drawing, in the phone's units: 100 wide and, with 6 round a screen of the iPhone's
	 * shape, 12 + 88 × 2556 / 1179 tall. Worked out once (see sketch.js).
	 */
	const H = 12 + (88 * 2556) / 1179;

	const BODY = { x: 1.4, y: 1.2, w: 97.2, h: H - 2.4, r: 16 };
	const SCREEN = { x: 6, y: 6, w: 88, h: H - 12, r: 10 };

	// Short strokes along the right side and the bottom, between the screen and the edge
	function hatching(seed) {
		const rand = random(seed);
		const strokes = [];
		for (let y = 30; y < H - 22; y += 3.4) {
			const x = 95.4 + rand() * 0.3;
			strokes.push(
				`M${x.toFixed(1)} ${(y + 1.6).toFixed(1)}l${(2.4 + rand() * 0.4).toFixed(1)} -2.6`
			);
		}
		for (let x = 22; x < 84; x += 3.4) {
			const y = H - 2.6 + rand() * 0.3;
			strokes.push(
				`M${x.toFixed(1)} ${y.toFixed(1)}l2.6 ${(-2.4 - rand() * 0.4).toFixed(1)}`
			);
		}
		return strokes.join('');
	}

	const LINES = {
		body: rough(BODY, 7, { wobble: 0.7, from: 30, over: 10 }),
		again: rough({ ...BODY, x: 1.9, y: 1.7, w: 96.4, h: H - 3.2 }, 23, {
			wobble: 1,
			from: 260,
			over: 16
		}),
		edge: rough(SCREEN, 5, { wobble: 0.35, from: 120, over: 6 }),
		keys: [
			'M1.5 34L0.3 34.8L0.2 42L1.5 42.8',
			'M1.5 49.5L0.2 50.3L0.1 63.2L1.5 64',
			'M1.5 67.5L0.2 68.3L0.2 81.1L1.5 81.9',
			'M98.5 55.5L99.8 56.3L99.9 78.6L98.5 79.4'
		].join(''),
		hatching: hatching(11)
	};
</script>

<script>
	/**
	 * An iPhone drawn in ink as the page loads round what it is given to show (`children`: the
	 * live app and its poster): a wobbly outline gone over twice, the screen's edge, the
	 * buttons, hatching down its shaded side, over a cream wash that has slipped a little off
	 * the lines. `screen` binds the screen inside it, for measuring it.
	 */
	let { screen = $bindable(), children } = $props();
</script>

<div class="phone">
	<span class="wash" aria-hidden="true"></span>
	<svg
		viewBox="0 0 100 {H.toFixed(2)}"
		preserveAspectRatio="none"
		aria-hidden="true"
		focusable="false"
	>
		<path class="body" d={LINES.body} pathLength="1" />
		<path class="again" d={LINES.again} pathLength="1" />
		<path class="edge" d={LINES.edge} pathLength="1" />
		<path class="keys" d={LINES.keys} pathLength="1" />
		<path class="hatching" d={LINES.hatching} pathLength="1" />
	</svg>
	<div class="screen" bind:this={screen}>
		{@render children()}
	</div>
</div>

<style>
	/* The phone is the drawing's container, so 1cqw there is a hundredth of its width */
	.phone {
		position: relative;
		container-type: inline-size;
	}

	/* 6 round the screen, inside the line, its corners clipping the app's */
	.screen {
		position: relative;
		margin: 6cqw;
		aspect-ratio: 1179 / 2556;
		overflow: hidden;
		border-radius: 10cqw;
		background: var(--color-device-screen);
	}

	.wash,
	svg {
		position: absolute;
	}

	.wash {
		inset: 2.6cqw 0.6cqw 0.4cqw 2.4cqw;
		border-radius: 15cqw;
		background: color-mix(in srgb, var(--vr-cream) 92%, transparent);
		box-shadow: inset 0 0 1.4cqw color-mix(in srgb, var(--vr-gold) 12%, transparent);
	}

	/* Over the screen too (its edge is drawn on it), so it lets the pointer through */
	svg {
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		overflow: visible;
		pointer-events: none;
		fill: none;
		stroke: var(--vr-ink);
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* Drawn in order: the outline, again, the screen's edge, the buttons, the hatching */
	path {
		stroke-width: 0.75;
		stroke-dasharray: 1;
		animation: draw 900ms cubic-bezier(0.55, 0.1, 0.35, 1) both;
	}

	.again {
		stroke-width: 0.4;
		opacity: 0.55;
		animation-delay: 350ms;
	}

	.edge {
		stroke-width: 0.6;
		animation-delay: 550ms;
	}

	.keys {
		animation-duration: 400ms;
		animation-delay: 1000ms;
	}

	.hatching {
		stroke-width: 0.35;
		opacity: 0.7;
		animation-duration: 1100ms;
		animation-delay: 1200ms;
		animation-timing-function: linear;
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

	@media (prefers-reduced-motion: reduce) {
		path {
			animation: none;
		}
	}
</style>
