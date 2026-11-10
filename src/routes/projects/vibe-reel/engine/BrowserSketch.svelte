<script module>
	import { rough, path } from '#lib/components/sketch/sketch.js';
	import TvSketchPen, {
		HAND,
		outline,
		opening,
		shade
	} from '#lib/components/sketch/TvSketchPen.svelte';

	/*
	 * The drawing, in the window's units: 100 wide, the line 1 in from its edges. A title bar
	 * 6.4 deep with the window's three lights and the address in it, then the page's 16:9
	 * opening, 1.6 in from the sides and the foot; the corners as tight as the sketched TV's.
	 * Worked out once (see #lib/components/sketch/sketch.js).
	 */
	const SCREEN = { x: 2.6, y: 7.4, w: 94.8, h: (94.8 * 9) / 16, r: 0.73 };
	const BOTTOM = SCREEN.y + SCREEN.h + 1.6;
	const BODY = { x: 1, y: 1, w: 98, h: BOTTOM - 1, r: 1.4 };
	const RIGHT = BODY.x + BODY.w;
	const H = BOTTOM + 1;
	// The title bar's middle, the address in it and the padlock before the address's words
	const BAR = 4.2;
	const ADDRESS = { x: 31, y: BAR - 1.5, w: 38, h: 3, r: 1.5 };
	const LOCK = 45.2;

	/** Where the page is in the drawing, and how tall the drawing is, in its units */
	export const PLACE = { ...SCREEN, height: H };

	const light = (x) => path`M${x - 0.6} ${BAR}a0.6 0.6 0 1 0 1.2 0a0.6 0.6 0 1 0 -1.2 0`;

	const LINES = [
		...outline(BODY),
		opening(SCREEN),
		{ pen: 'edge', d: rough(ADDRESS, 9, HAND.edge) },
		{
			// The three lights, and the padlock: its shackle, then its body
			pen: 'parts',
			d: [
				light(3.9),
				light(6.2),
				light(8.5),
				path`M${LOCK - 0.33} ${BAR - 0.15}v-0.35a0.33 0.33 0 0 1 0.66 0v0.35`,
				path`M${LOCK - 0.55} ${BAR - 0.15}h1.1v0.9h-1.1z`
			].join('')
		}
	];

	/* The soundbar's shading, as on the sketched TV: ticks at the line along the foot from
	   under the middle to the corner, and round it a little way up the right side */
	const CORNER = BOTTOM - BODY.r - 0.12;
	const SHADING = shade([
		{ from: [45, BOTTOM - 0.05], to: [RIGHT - BODY.r - 0.12, BOTTOM - 0.05], seed: 17 },
		{ from: [RIGHT - 0.05, CORNER], to: [RIGHT - 0.05, CORNER - 5], seed: 19 }
	]);
</script>

<script>
	/*
	 * A browser window drawn by the hand that drew the sketched TV (#lib/components/sketch), as it
	 * comes on: a wobbly outline round tight corners gone over once more on its own, the title
	 * bar's three lights and the address with its padlock in fine ink, the address then
	 * written in, the page's opening drawn round, and short ticks of shading along its foot and
	 * round the corner, over a flat cream wash that has slipped a little off the lines. Like
	 * the sketched TV it is drawn round a page given after it, `.glass`, which it places.
	 */
</script>

<span class="wash" aria-hidden="true"></span>
<TvSketchPen h={H} lines={LINES} shading={SHADING} />
<span class="address" aria-hidden="true">vibereel</span>

<style>
	/* 1.6 round the page inside the line, the title bar over it */
	.wash ~ :global(.glass) {
		margin: 7.4cqw 2.6cqw 2.6cqw;
		border-radius: 0.73cqw;
	}

	/* The body's place, slipped right and down as the soundbar's is */
	.wash {
		position: absolute;
		inset: 1.25cqw 0.7cqw 0.75cqw 1.3cqw;
		border-radius: 1.4cqw;
		background: color-mix(in srgb, var(--vr-cream) 92%, transparent);
	}

	/* Written in the notes' italic once the lines are down, after the padlock */
	.address {
		position: absolute;
		left: 51cqw;
		top: 4.2cqw;
		translate: -50% -55%;
		font: italic 2.3cqw / 1 var(--font-secondary);
		color: var(--vr-ink);
		white-space: nowrap;
		animation: write 400ms 880ms ease-out both;
	}

	/* Swept on from the left; the clip reaches 0.3em past the box all round, so that the
	   italic's overhang (the last l leans out of it) is never cut */
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
		.address {
			animation: none;
		}
	}
</style>
