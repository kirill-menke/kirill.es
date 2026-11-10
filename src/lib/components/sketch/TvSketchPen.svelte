<script module>
	import { rough, hatch, path } from './sketch.js';

	/*
	 * The hand of the sketched soundbar under the hero's TV (Soundbar.svelte on the VibeReel
	 * page) at a TV's scale, for the sketched sets (TvSketch, and the Shape-shifter's browser)
	 * to draw with sketch.js. On a hero-sized set (about 800px wide, 8.2px to its unit) it is
	 * the soundbar's in px: the outline wobbles by up to 1, through a point every 9, and runs
	 * on 26 past where it began; gone over again by 1.4, on 44 past; the screen's edge, drawn
	 * as the soundbar draws its display's, by 0.6, a point every 7, on 12 past.
	 */
	export const HAND = {
		body: { wobble: 0.12, from: 3.7, over: 3.2, step: 1.1, digits: 2 },
		again: { wobble: 0.17, over: 5.4, step: 1.1, digits: 2 },
		edge: { wobble: 0.07, from: 2.9, over: 1.5, step: 0.86, digits: 2 }
	};

	/* When each pen comes down and how long it takes over its line (ms), in the order of the
	   sketched soundbar, as quick as it is: the outline, gone over, the screen's edge and then
	   the parts. A line's own `at` and `each` (ms) replace its pen's. */
	const PENS = {
		body: { at: 0, each: 720 },
		again: { at: 280, each: 720 },
		edge: { at: 440, each: 720 },
		parts: { at: 800, each: 320 }
	};

	/** When a set's lines drawn at their pens' times are all down (ms): the sketched TV's
	 *  outline, gone over, its screen's edge and its light, the hatching still sweeping on.
	 *  For what follows the drawing. */
	export const DRAWN = Math.max(...Object.values(PENS).map(({ at, each }) => at + each));

	/* A rounded rectangle drawn as the soundbar draws its body: the line, then gone over once
	   more a hair inside it from 62% of the way round, wobbling on its own */
	export function outline(rect) {
		const round = 2 * (rect.w + rect.h - 4 * rect.r) + 2 * Math.PI * rect.r;
		const again = {
			...rect,
			x: rect.x + 0.06,
			y: rect.y + 0.09,
			w: rect.w - 0.1,
			h: rect.h - 0.12
		};
		return [
			{ pen: 'body', d: rough(rect, 7, HAND.body) },
			{ pen: 'again', d: rough(again, 23, { ...HAND.again, from: 0.62 * round }) }
		];
	}

	/* The screen's opening drawn as the soundbar draws its display, a line of its own round
	   the glass, just outside it so that all of the line is on the set */
	export function opening({ x, y, w, h, r }) {
		const rect = { x: x - 0.06, y: y - 0.06, w: w + 0.12, h: h + 0.12, r: r + 0.06 };
		return { pen: 'edge', d: rough(rect, 5, HAND.edge) };
	}

	// The sizes of set it draws for, as --weight below: on a smaller one the lines are heavier
	// in its units and the hatching's strokes longer and wider apart, by as much, so that on
	// the page they stay the same
	const WEIGHTS = [1, 1.3, 1.8, 2.6];

	/* The soundbar's shading at a set's scale: on a hero-sized one strokes 3.4px across and as
	   far up, 4.4px apart and up to 0.3px off their line; and the time it takes per unit along
	   a run, its 5.6ms a stroke */
	const [STROKE, GAP, JITTER, PACE] = [0.41, 0.54, 0.04, 10.4];

	/* Hatching in shade, drawn for each size of set: strokes up to the right along each run
	   (`{ from, to, seed }`), the runs in turn from `start` (ms), each swept on from its `from`
	   as the soundbar's strokes are drawn one after another. A run along the foot of a part has
	   its strokes rise from it, one up a right side has them reach it. A run across a side of
	   the set in shade gives `across`, how far its strokes go to span it, at any size. Each run
	   comes with the broad line along it that reveals it. */
	export function shade(runs, start = 960) {
		let at = start;
		return runs.map(({ from, to, seed, across }) => {
			const [dx, dy] = [to[0] - from[0], to[1] - from[1]];
			const length = Math.hypot(dx, dy);
			const side = Math.abs(dy) > Math.abs(dx);
			const tiers = WEIGHTS.map((w) => {
				const s = across ?? STROKE * w;
				const [ox, oy] = side ? [-s, s] : [0, 0];
				return hatch([from[0] + ox, from[1] + oy], [to[0] + ox, to[1] + oy], seed, {
					gap: GAP * w,
					stroke: [s, -s],
					jitter: JITTER * w
				});
			});
			// Down the middle of the strokes at their longest, and on past both ends
			const s = across ?? STROKE * WEIGHTS.at(-1);
			const [mx, my] = side ? [-s / 2, s / 2] : [s / 2, -s / 2];
			const [ex, ey] = [(dx / length) * (s + 0.5), (dy / length) * (s + 0.5)];
			const [a, b] = [
				[from[0] + mx - ex, from[1] + my - ey],
				[to[0] + mx + ex, to[1] + my + ey]
			];
			const each = length * PACE;
			const run = {
				tiers,
				reveal: path`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`,
				width: s + 1,
				at,
				each
			};
			at += each;
			return run;
		});
	}
</script>

<script>
	/*
	 * The ink of a sketched set, drawn on as the page loads in the order of the sketched
	 * soundbar under the hero's TV and in a finer pen, so that set and bar read as one
	 * drawing. `h` is the drawing's height in the TV's units (100 to its width), and each of
	 * `lines` is `{ d, pen }`, `pen` one of 'body' (the outline) and 'again' (gone over), from
	 * outline(); 'edge' (the screen's), from opening(); or 'parts' (what else the set has: a
	 * light); `at` and `each` (ms) time a line otherwise than its pen (PENS). `shading` is from
	 * shade(): of each run only the hatching drawn for the set's size shows, swept on by a
	 * mask. A set renders it after its wash and before the glass, over which it draws; what is
	 * drawn onto a set renders its own after it.
	 */
	let { h, lines, shading = [] } = $props();

	const uid = $props.id();
</script>

<svg
	viewBox="0 0 100 {h.toFixed(2)}"
	preserveAspectRatio="none"
	aria-hidden="true"
	focusable="false"
>
	{#each lines as line (line.d)}
		<path
			class={line.pen}
			d={line.d}
			pathLength="1"
			style:animation-delay="{line.at ?? PENS[line.pen].at}ms"
			style:animation-duration="{line.each ?? PENS[line.pen].each}ms"
		/>
	{/each}
	{#each shading as run, i (run.reveal)}
		<mask
			id="{uid}-shade-{i}"
			maskUnits="userSpaceOnUse"
			x="-5"
			y="-5"
			width="110"
			height={h + 10}
		>
			<path
				class="reveal"
				d={run.reveal}
				pathLength="1"
				style:stroke-width="{run.width}px"
				style:animation-delay="{run.at}ms"
				style:animation-duration="{run.each}ms"
			/>
		</mask>
		{#each run.tiers as d, tier (tier)}
			<path class="hatching" data-tier={tier} {d} mask="url(#{uid}-shade-{i})" />
		{/each}
	{/each}
</svg>

<style>
	/* Over the glass too (the screen's edge is drawn on it), so it lets the pointer through.
	   The widths are in the TV's units, finer than the soundbar's pen (on a hero-sized set,
	   about 800px: 1.1px the outline, 0.7 again, 0.9 the screen's edge and the parts, 0.5 the
	   hatching), heavier on a smaller set so that they stay that pen on any; and of the
	   hatching, only that drawn for the set's size shows. */
	svg {
		--weight: 1;
		position: absolute;
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

	.hatching {
		display: none;
	}

	[data-tier='0'] {
		display: inline;
	}

	@container (width < 46rem) {
		svg {
			--weight: 1.3;
		}

		[data-tier='0'] {
			display: none;
		}

		[data-tier='1'] {
			display: inline;
		}
	}

	@container (width < 38rem) {
		svg {
			--weight: 1.8;
		}

		[data-tier='1'] {
			display: none;
		}

		[data-tier='2'] {
			display: inline;
		}
	}

	@container (width < 26rem) {
		svg {
			--weight: 2.6;
		}

		[data-tier='2'] {
			display: none;
		}

		[data-tier='3'] {
			display: inline;
		}
	}

	/* Each line drawn on at its pen's time or its own, each run of hatching swept on at
	   shade()'s pace: given in the markup */
	path {
		stroke-width: calc(0.135px * var(--weight));
		stroke-dasharray: 1;
		animation: draw cubic-bezier(0.55, 0.1, 0.35, 1) both;
	}

	.again {
		stroke-width: calc(0.086px * var(--weight));
		opacity: 0.55;
	}

	.edge,
	.parts {
		stroke-width: calc(0.11px * var(--weight));
	}

	.hatching {
		stroke-width: calc(0.061px * var(--weight));
		stroke-dasharray: none;
		opacity: 0.7;
		animation: none;
	}

	.reveal {
		stroke: white;
		stroke-linecap: butt;
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
