<script module>
	import { random, rough } from '#lib/components/sketch/sketch.js';
	import { SIDES } from '#lib/components/sketch/TvSketch.svelte';

	/*
	 * The drawing, in px of each part as it is measured. The line runs 1.5 in from the bar's
	 * edges and is gone over once more a little inside it, round a cream wash slipped to the
	 * right and down; the display's edge runs 1 in from its box; each grille is a patch hatched
	 * both ways inside a light edge. The hand's wobble is seeded (see sketch.js).
	 */
	const f = (v) => v.toFixed(1);
	// Rounder corners on a taller bar
	const corner = (h) => Math.min(12, h / 3.2);

	function drawBody(w, h) {
		const r = corner(h);
		const line = { x: 1.5, y: 1.5, w: w - 3, h: h - 3, r };
		const length = 2 * (line.w + line.h - 4 * r) + 2 * Math.PI * r;
		return {
			wash: { x: 4, y: 3.5, w: w - 3, h: h - 3, r },
			body: rough(line, 7, { wobble: 1, from: 30, over: 26, step: 9, digits: 1 }),
			again: rough({ x: 2, y: 2.2, w: w - 3.8, h: h - 4, r }, 23, {
				wobble: 1.4,
				from: length * 0.62,
				over: 44,
				step: 9,
				digits: 1
			}),
			shade: shading(w, h, r, 11)
		};
	}

	// Short strokes inside the line along the base, from under the display on, and on up the
	// right end: the side in shade, as on the sketched TV
	function shading(w, h, r, seed) {
		const rand = random(seed);
		const strokes = [];
		for (let x = w * 0.45; x < w - r - 1; x += 4.4) {
			const y = h - 2.7 + rand() * 0.3;
			strokes.push(`M${f(x)} ${f(y)}l${f(3.2 + rand() * 0.4)} ${f(-3.3 - rand() * 0.3)}`);
		}
		for (let y = h - r - 1; y > h * 0.3; y -= 4.4) {
			const x = w - 6.1 + rand() * 0.3;
			strokes.push(`M${f(x)} ${f(y)}l${f(3.3 + rand() * 0.3)} ${f(-3.2 - rand() * 0.4)}`);
		}
		return strokes;
	}

	const drawDisplay = (w, h) =>
		rough({ x: 1, y: 1, w: w - 2, h: h - 2, r: 6 }, 5, {
			wobble: 0.6,
			from: 24,
			over: 12,
			step: 7,
			digits: 1
		});

	const drawGrille = (w, h, side) => ({
		edge: rough({ x: 1, y: 1, w: w - 2, h: h - 2, r: 5 }, 31 + side, {
			wobble: 0.5,
			from: 12,
			over: 8,
			step: 6,
			digits: 1
		}),
		mesh: crosshatch(w, h, 41 + side)
	});

	/* Lines both ways across a patch `gap` apart, up to the right (x + y = c) and then down to
	   the right (x - y = c), each stopping a little short of the patch's edge or running a
	   little past it, as a quick hand does */
	function crosshatch(w, h, seed, gap = 7) {
		const rand = random(seed);
		const [x0, y0, x1, y1] = [3, 3, w - 3, h - 3];
		const lines = [];
		for (const up of [true, false]) {
			const [from, to] = up ? [x0 + y0, x1 + y1] : [x0 - y1, x1 - y0];
			for (let c = from + gap / 2; c < to; c += gap) {
				const at = (x) => [x, up ? c - x : x - c];
				const a = at(up ? Math.max(x0, c - y1) : Math.max(x0, c + y0));
				const b = at(up ? Math.min(x1, c - y0) : Math.min(x1, c + y1));
				const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
				if (length < 4) continue;
				const [ux, uy] = [(b[0] - a[0]) / length, (b[1] - a[1]) / length];
				const [early, late] = [rand() * 1.4, rand() * 1.4];
				lines.push(
					`M${f(a[0] - ux * early)} ${f(a[1] - uy * early)}L${f(b[0] + ux * late)} ${f(b[1] + uy * late)}`
				);
			}
		}
		return lines;
	}
</script>

<script>
	/*
	 * The soundbar under the hero's TV, drawn in ink by the hand that drew the TV as the page
	 * loads: a wobbly outline gone over twice round a cream wash slightly off it, the display's
	 * edge, a speaker grille either side hatched both ways and hatching along its shaded side.
	 * Then the display's readout and legends are written in by hand, one by one: what reaches
	 * the TV untouched, in four columns (video, HDR, audio, subtitles), Direct Play over a
	 * highlighter's band of the sketchbook's gold. The last legend, TRANSCODE, stays faint,
	 * never gone over in ink, and a hand-written note points at it (soundbar/Note.svelte).
	 *
	 * The bar is given the TV's width and keeps as far in from its left and right as the TV's
	 * outline runs (TvSketch's SIDES), so that its outline runs under the TV's. Each part is
	 * drawn once it is measured, in an SVG of its size that lets the pointer through and may
	 * draw past its edges; until then (as when prerendering) the readout and legends are there
	 * undrawn. On a narrow stage the display takes the whole bar, the legends spread across it
	 * under the readout, TRANSCODE at the right end.
	 */
	import Note from './soundbar/Note.svelte';
	import { useTweaks } from './tweaks.js';

	const tweak = useTweaks();

	const lit = ['HEVC', 'AV1', 'HDR10', 'Dolby Vision', 'DD+', 'Atmos', 'PGS'];

	let bodyW = $state(0);
	let bodyH = $state(0);
	let displayW = $state(0);
	let displayH = $state(0);
	const grilles = $state([
		{ w: 0, h: 0 },
		{ w: 0, h: 0 }
	]);
</script>

{#snippet art(draw, w, h, side)}
	{#if w && h}
		<svg
			class="art"
			viewBox="0 0 {w} {h}"
			preserveAspectRatio="none"
			aria-hidden="true"
			focusable="false"
		>
			{@render draw(w, h, side)}
		</svg>
	{/if}
{/snippet}

{#snippet body(w, h)}
	{@const lines = drawBody(w, h)}
	<rect
		class="wash"
		x={lines.wash.x}
		y={lines.wash.y}
		width={lines.wash.w}
		height={lines.wash.h}
		rx={lines.wash.r}
	/>
	<path class="line" d={lines.body} pathLength="1" />
	<path class="line again" d={lines.again} pathLength="1" />
	{#each lines.shade as d, i (i)}
		<path class="shade" {d} pathLength="1" style:--i={i} />
	{/each}
{/snippet}

{#snippet display(w, h)}
	<path class="edge" d={drawDisplay(w, h)} pathLength="1" />
{/snippet}

{#snippet grille(w, h, side)}
	{@const lines = drawGrille(w, h, side)}
	<path class="edge grille-edge" d={lines.edge} pathLength="1" />
	{#each lines.mesh as d, i (i)}
		<path class="mesh" {d} pathLength="1" style:--i={i} />
	{/each}
{/snippet}

{#snippet speaker(side)}
	<span
		class="grille"
		aria-hidden="true"
		bind:clientWidth={grilles[side].w}
		bind:clientHeight={grilles[side].h}
	>
		{@render art(grille, grilles[side].w, grilles[side].h, side)}
	</span>
{/snippet}

<!-- On trial (hero.pen): 'medium' and 'fine' lighten the bar's pen -->
<div
	class={['body', tweak('hero.pen')]}
	style:margin-inline="calc({SIDES[0]}% - 1.5px) calc({SIDES[1]}% - 1.5px)"
	bind:clientWidth={bodyW}
	bind:clientHeight={bodyH}
>
	{@render art(body, bodyW, bodyH)}
	{@render speaker(0)}
	<div class="display" bind:clientWidth={displayW} bind:clientHeight={displayH}>
		{@render art(display, displayW, displayH)}
		<p class="readout" style="--i: 0">
			<span class="play" aria-hidden="true"></span><span class="name">Direct Play</span>
		</p>
		<ul aria-label="Played as is">
			{#each lit as name, i (name)}
				<li style="--i: {i + 1}">
					<span class="name">{name}</span>
				</li>
			{/each}
			<li class="off" style="--i: {lit.length + 1}">
				<span class="name">Transcode</span><span class="visually-hidden">: never on</span>
				<Note />
			</li>
		</ul>
	</div>
	{@render speaker(1)}
</div>

<style>
	/* The line runs 1.5 px inside the bar's box (drawBody), which reaches out past the bar by
	   as much (its inline margin), so that the line runs along the bar's edges. Written in the
	   notes' italic serif. */
	.body {
		position: relative;
		display: flex;
		align-items: stretch;
		gap: 0.6rem;
		padding: 0.4rem;
		color: var(--vr-ink);
		font-family: var(--font-secondary);
		font-style: italic;
	}

	.art {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.grille {
		position: relative;
		flex: 1;
		min-width: 1.5rem;
	}

	.display {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1.25rem;
		padding: 0.55rem 0.9rem;
	}

	/* Over the drawing, which comes first; bigger than a display's type, as handwriting is,
	   and a little uneven */
	.readout {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin: 0;
		font-size: 1.3rem;
		line-height: 1.1;
		letter-spacing: 0.01em;
		white-space: nowrap;
	}

	.play {
		width: 0;
		height: 0;
		border-left: 0.5rem solid currentColor;
		border-block: 0.3rem solid transparent;
	}

	ul {
		position: relative;
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-rows: auto auto;
		grid-auto-flow: column;
		gap: 0.1rem 1rem;
		font-size: 0.82rem;
		line-height: 1.15;
		letter-spacing: 0.01em;
		white-space: nowrap;
	}

	/* Boxes for the words to be written into */
	.name {
		display: inline-block;
	}

	.readout .name,
	li:nth-child(odd) .name {
		rotate: -2deg;
	}

	li:nth-child(3n) .name {
		rotate: 1.5deg;
		translate: 0 1px;
	}

	/* The bar's one touch of the sketchbook's gold (--vr-wash): a highlighter's band behind
	   Direct Play, written in with it, inside its box so that the pen's mask never cuts it */
	.readout .name {
		position: relative;
		isolation: isolate;
	}

	.readout .name::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: auto 0 0.08em -0.08em;
		height: 0.5em;
		border-radius: 0.1em 0.3em 0.18em 0.35em / 0.25em;
		background: var(--vr-wash);
	}

	/* The note hangs from TRANSCODE */
	li.off {
		position: relative;
		color: color-mix(in srgb, var(--vr-ink) 30%, transparent);
	}

	/* On a narrow stage the display takes the whole bar, its writing a little smaller, and
	   the legends a line of their own, spread across it */
	@container (max-width: 640px) {
		.grille {
			display: none;
		}

		.display {
			flex: 1;
			gap: 0.35rem 1rem;
			padding: 0.5rem 0.7rem;
		}

		.readout {
			font-size: 1.1rem;
		}

		ul {
			flex: 1 0 100%;
			justify-content: space-between;
			gap: 0.05rem 0.6rem;
			font-size: 0.74rem;
		}
	}

	.wash {
		fill: color-mix(in srgb, var(--vr-cream) 92%, transparent);
	}

	/* The sketched TV's pen, about as heavy in px as it draws the set */
	path {
		fill: none;
		stroke: var(--vr-ink);
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.line {
		stroke-width: 1.8;
	}

	.again {
		stroke-width: 1;
		opacity: 0.55;
	}

	.edge {
		stroke-width: 1.3;
	}

	.grille-edge {
		stroke-width: 0.8;
		opacity: 0.6;
	}

	.mesh {
		stroke-width: 0.6;
		opacity: 0.5;
	}

	.shade {
		stroke-width: 0.8;
		opacity: 0.7;
	}

	/* On trial (hero.pen): the bar in the sketched TV's pen, which on a hero-sized set is about
	   1.1px the outline, 0.7 gone over, 0.9 the screen's edge and 0.5 the hatching
	   (TvSketchPen), so that set and bar read as one drawing; or halfway there */
	.medium .line {
		stroke-width: 1.45;
	}

	.medium .again {
		stroke-width: 0.85;
	}

	.medium .edge {
		stroke-width: 1.1;
	}

	.medium .grille-edge {
		stroke-width: 0.7;
	}

	.medium .mesh {
		stroke-width: 0.55;
	}

	.medium .shade {
		stroke-width: 0.65;
	}

	.fine .line {
		stroke-width: 1.1;
	}

	.fine .again {
		stroke-width: 0.7;
	}

	.fine .edge {
		stroke-width: 0.9;
	}

	.fine .grille-edge {
		stroke-width: 0.6;
	}

	.fine .mesh,
	.fine .shade {
		stroke-width: 0.5;
	}

	@media (prefers-reduced-motion: no-preference) {
		/* Drawn in order, as the sketched TV is: the outline, again, the display's edge, the
		   grilles' edges and their hatching one way then the other, the shading */
		path {
			stroke-dasharray: 1;
			animation: draw 720ms var(--at, 0ms) cubic-bezier(0.55, 0.1, 0.35, 1) both;
		}

		.again {
			--at: 280ms;
		}

		.edge {
			--at: 440ms;
			animation-duration: 560ms;
		}

		.grille-edge {
			--at: 600ms;
			animation-duration: 320ms;
		}

		/* Stroke after stroke, the grilles' 9.6ms apart and the shading's 5.6ms */
		.mesh,
		.shade {
			animation-duration: 48ms;
			animation-timing-function: linear;
		}

		.mesh {
			--at: calc(760ms + var(--i) * 9.6ms);
		}

		.shade {
			--at: calc(960ms + var(--i) * 5.6ms);
		}

		/* Then the pen writes in the readout and the legends, one by one, TRANSCODE last, as
		   quickly as the lines are drawn */
		.readout,
		li .name {
			animation: write 304ms calc(0.56s + var(--i) * 88ms) ease-out backwards;
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

	/* Left to right behind a soft edge, as the ink runs from the pen */
	@keyframes write {
		from {
			mask: linear-gradient(90deg, #000 40%, transparent 60%) 100% 0 / 250% 100% no-repeat;
		}
		to {
			mask: linear-gradient(90deg, #000 40%, transparent 60%) 0 0 / 250% 100% no-repeat;
		}
	}
</style>
