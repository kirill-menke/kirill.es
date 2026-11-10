<script module>
	import { line, path, rough } from './sketch.js';
	import TvSketchPen, { HAND, outline, opening, shade } from './TvSketchPen.svelte';

	/*
	 * The drawing, in the TV's units: 100 wide, the line 1 in from its edges. 2.4 of bezel
	 * round a 16:9 screen and a chin of 4 under it; the corners as tight as the soundbar's
	 * (12px on a hero-sized set) and the screen's as its display's (6px). Worked out once (see
	 * sketch.js).
	 */
	const SCREEN = { x: 3.4, y: 3.4, w: 93.2, h: (93.2 * 9) / 16, r: 0.73 };
	const BOTTOM = SCREEN.y + SCREEN.h + 4;
	const BODY = { x: 1, y: 1, w: 98, h: BOTTOM - 1, r: 1.4 };
	const RIGHT = BODY.x + BODY.w;
	const H = BOTTOM + 1;
	// The chin's middle
	const CHIN = (SCREEN.y + SCREEN.h + BOTTOM) / 2;

	/** Where the screen is in the drawing, and how tall the drawing is, in its units: for a
	 *  set drawn round a screen of its own (the Shape-shifter's) */
	export const PLACE = { ...SCREEN, height: H };

	/** How far in from the drawing's left and right the outline runs, in its units: where the
	 *  soundbar under the VibeReel page's hero TV runs its own */
	export const SIDES = [BODY.x, 100 - RIGHT];

	const LINES = [
		...outline(BODY),
		opening(SCREEN),
		// A little power light on the chin
		{
			pen: 'parts',
			d: path`M${RIGHT - 6.22} ${BOTTOM - 2}a0.22 0.22 0 1 0 0.44 0a0.22 0.22 0 1 0 -0.44 0`
		}
	];

	/* The soundbar's shading: ticks at the line along the foot from under the middle to the
	   corner, and round it a little way up the right side */
	const CORNER = BOTTOM - BODY.r - 0.12;
	const SHADING = shade([
		{ from: [45, BOTTOM - 0.05], to: [RIGHT - BODY.r - 0.12, BOTTOM - 0.05], seed: 13 },
		{ from: [RIGHT - 0.05, CORNER], to: [RIGHT - 0.05, CORNER - 5], seed: 11 }
	]);

	/* Drawn onto the set after its own lines: a nameplate on the chin's middle, as long as its
	   screws and LG between them need, drawn round as the screen's edge is from 760ms and gone
	   over once more a hair inside it, from 60% of the way through and 62% of the way round, as
	   the outline is; then its screws, each with its slot, and the shade inside its foot, right
	   of the lettering. On the top rail three grooves in the lighter pen, the higher the longer,
	   joined over the middle. */
	const PLATE = { x: 46.5, y: CHIN - 1.25, w: 7, h: 2.5, r: 0.6 };
	const [PLATE_AT, PLATE_EACH] = [760, 480];
	const SCREWS = [PLATE.x + 0.9, PLATE.x + PLATE.w - 0.9];
	const RAIL = [1.75, 2.25, 2.75].map((y, i) => ({ y, length: 9 - 2.5 * i }));

	// A circle round [x, y], exact, as the set's light is
	const dot = ([x, y], r) =>
		path`M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

	const ROUND = 2 * (PLATE.w + PLATE.h - 4 * PLATE.r) + 2 * Math.PI * PLATE.r;
	const INSIDE = {
		...PLATE,
		x: PLATE.x + 0.04,
		y: PLATE.y + 0.06,
		w: PLATE.w - 0.07,
		h: PLATE.h - 0.1
	};

	const NAMEPLATE = [
		{ pen: 'edge', d: rough(PLATE, 37, HAND.edge), at: PLATE_AT, each: PLATE_EACH },
		{
			pen: 'again',
			d: rough(INSIDE, 38, { ...HAND.edge, wobble: 0.09, from: 0.62 * ROUND, over: 2.4 }),
			at: PLATE_AT + 0.6 * PLATE_EACH,
			each: PLATE_EACH
		},
		{
			pen: 'parts',
			d: SCREWS.map(
				(x) => dot([x, CHIN], 0.2) + path`M${x - 0.12} ${CHIN + 0.12}l0.24 -0.24`
			).join(''),
			at: 1240,
			each: 240
		},
		{
			pen: 'again',
			d: RAIL.map(({ y, length }, i) =>
				line([50 - length, y], [50 + length, y], 91 + i, { wobble: 0.03 })
			).join(''),
			at: 920,
			each: 400
		}
	];

	const NAMEPLATE_SHADING = shade(
		[
			{
				from: [51.3, PLATE.y + PLATE.h - 0.07],
				to: [PLATE.x + PLATE.w - PLATE.r - 0.1, PLATE.y + PLATE.h - 0.07],
				seed: 43,
				across: 0.42
			}
		],
		1280
	);
</script>

<script>
	/*
	 * The TV drawn by the hand that drew the soundbar under it, as the page loads and in a
	 * finer pen: a wobbly outline round tight corners gone over once more on its own, the
	 * screen's opening drawn round as the soundbar's display is, a little light on the chin,
	 * and short ticks of shading along its foot and round the corner, over a flat cream wash
	 * that has slipped a little off the lines. Then, drawn over it, a nameplate screwed onto
	 * the chin, washed in the sketchbook's gold (--vr-wash) and lettered LG in the notes'
	 * italic, and three grooves along the top rail. It is drawn round a glass given after it
	 * (`.glass`), which it places, in a container as wide as the set (its cqw).
	 */
</script>

<span class="wash" aria-hidden="true"></span>
<TvSketchPen h={H} lines={LINES} shading={SHADING} />
<TvSketchPen h={H} lines={NAMEPLATE} shading={NAMEPLATE_SHADING} />
<span
	class="plate"
	aria-hidden="true"
	style:left="{PLATE.x + 0.2}cqw"
	style:top="{PLATE.y + 0.15}cqw"
	style:width="{PLATE.w}cqw"
	style:height="{PLATE.h}cqw"
	style:border-radius="{PLATE.r}cqw"
></span>
<span class="name" aria-hidden="true" style:top="{CHIN}cqw">LG</span>

<style>
	/* 2.4 round the screen inside the line, the chin under it */
	.wash ~ :global(.glass) {
		margin: 3.4cqw 3.4cqw 5cqw;
		border-radius: 0.73cqw;
	}

	/* The body's place, slipped right and down as the soundbar's is */
	.wash {
		position: absolute;
		inset: 1.25cqw 0.7cqw 0.75cqw 1.3cqw;
		border-radius: 1.4cqw;
		background: color-mix(in srgb, var(--vr-cream) 92%, transparent);
	}

	/* The plate's one touch of the sketchbook's gold, washed in once it is drawn, slipped a
	   little off its lines as the set's wash is */
	.plate {
		position: absolute;
		background: var(--vr-wash);
		pointer-events: none;
		animation: wash 480ms 760ms ease-out both;
	}

	/* Lettered in the notes' italic once the plate is screwed on */
	.name {
		position: absolute;
		left: 50cqw;
		translate: -50% -55%;
		font: italic 1.55cqw / 1 var(--font-secondary);
		color: var(--vr-ink);
		white-space: nowrap;
		pointer-events: none;
		animation: write 400ms 1360ms ease-out both;
	}

	@keyframes wash {
		from {
			opacity: 0;
		}
	}

	/* Swept on from the left; the clip reaches 0.3em past the box all round, so that the
	   italic's overhang is never cut */
	@keyframes write {
		from {
			opacity: 0;
			clip-path: inset(-0.3em calc(100% + 0.3em) -0.3em -0.3em);
		}
		to {
			opacity: 1;
			clip-path: inset(-0.3em);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.plate,
		.name {
			animation: none;
		}
	}
</style>
