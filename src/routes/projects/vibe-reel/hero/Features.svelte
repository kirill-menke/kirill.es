<script module>
	import { around, spline, line as pencil } from '#lib/components/sketch/sketch.js';

	/*
	 * On trial (tweaks.js: hero.numerals): the pencil's part in two of the ways the features
	 * are numbered, drawn in the numeral's cell, 44 wide and 32 tall. The hand's wobble is
	 * seeded (sketch.js), so the server and the browser draw the same marks.
	 */

	/* 'circled': a loop round the numeral, a little wider than tall, begun somewhere along its
	   top, run on past where it began and creeping outwards on the way, so that its two ends
	   never meet */
	function loop(seed) {
		const points = around({ x: 8.5, y: 3, w: 27, h: 26, r: 13 }, seed, {
			wobble: 0.8,
			from: (seed * 7) % 20,
			over: 12,
			step: 4
		});
		const length = points.at(-1)[4];
		return spline(
			points.map(([x, y, nx, ny, s]) => {
				const out = (1.5 * s) / length;
				return [x + nx * out, y + ny * out];
			})
		);
	}

	/* 'tally': a stroke for each, leaning a little and none quite like the next, each gone over
	   once more, lighter and shorter. As { d, kind }: 'line' the first pass, 'again' the second. */
	function tally(count, seed) {
		const strokes = [];
		for (let k = 0; k < count; k++) {
			const x = 22 + (k - (count - 1) / 2) * 7;
			const hand = { wobble: 0.6, step: 6 };
			strokes.push(
				{
					kind: 'line',
					d: pencil([x + 2.2, 4], [x - 2.2, 28], seed + 3 * k, {
						...hand,
						over: [0.8, 1.2]
					})
				},
				{
					kind: 'again',
					d: pencil([x + 2.5, 6], [x - 1.4, 25.5], seed + 3 * k + 1, hand)
				}
			);
		}
		return strokes;
	}
</script>

<script>
	/*
	 * The hero's three features, like a magazine's contents: a large outlined gold numeral
	 * beside each name in serif, a muted line under it.
	 *
	 * Sized in em, so that the stage can scale them all. The stage is the container their
	 * queries ask about: three abreast from 600 px, and from 880 px beside the set, one under
	 * the other again. Each comes in with the page's .enter once the TV has powered on (after
	 * Hero's --power-at), --i of them apart.
	 */
	import { useTweaks } from '../tweaks.js';

	let { features } = $props();

	const tweak = useTweaks();
	// On trial (hero.numerals): how the features are numbered; 'outline' is the numeral above
	const kind = $derived(tweak('hero.numerals'));
</script>

<ul class={['features', kind]}>
	{#each features as { name, line }, i (name)}
		<li class="feature enter" style:--i={i}>
			<span class="numeral" aria-hidden="true" data-n={i + 1}>
				{#if kind === 'circled'}
					<svg viewBox="0 0 44 32" focusable="false"><path d={loop(17 + 12 * i)} /></svg
					><span class="digit">{i + 1}</span>
				{:else if kind === 'tally'}
					<svg viewBox="0 0 44 32" focusable="false">
						{#each tally(i + 1, 31 + 20 * i) as stroke, k (k)}
							<path class={stroke.kind} d={stroke.d} />
						{/each}
					</svg>
				{:else if kind === 'marker'}
					0{i + 1}
				{:else if kind === 'hand'}
					<span class="digit">{i + 1}.</span>
				{:else}
					{i + 1}
				{/if}
			</span>
			<div class="text">
				<span class="name">{name}</span>
				<p>{line}</p>
			</div>
		</li>
	{/each}
</ul>

<style>
	/* --cell: the numeral's column as the outlined numerals have it (1.1em of their own 3.4em),
	   which the other ways of numbering keep, so that the words stay where they are */
	.features {
		--cell: 3.74em;
		list-style: none;
		display: grid;
		gap: 1.5em;
		margin: 0;
		padding: 0;
	}

	.feature {
		--name: 1.35em;
		--enter-duration: 333ms;
		--enter-delay: calc(var(--power-at) + 567ms + var(--i) * 73ms);
		--enter-y: 0.75rem;
		--enter-ease: var(--ease-cubic-out);
		display: flex;
		align-items: flex-start;
		gap: 0.8em;
	}

	.text {
		min-width: 0;
	}

	.name {
		font-family: var(--font-secondary);
		font-size: var(--name);
		line-height: 1.25;
		color: var(--color-font-dark);
	}

	.feature p {
		max-width: 38ch;
		margin: 0.35em 0 0;
		font-size: 0.95em;
		line-height: 1.55;
		color: var(--vr-muted);
	}

	/* Outlined, standing as tall as the name and the line's first two rows */
	.numeral {
		flex: none;
		width: 1.1em;
		font-family: var(--font-secondary);
		font-size: 3.4em;
		line-height: 0.85;
		color: transparent;
		-webkit-text-stroke: 1.25px var(--vr-gold);
		text-align: center;
	}

	/* On trial (hero.numerals: 'washed'): the outlines over a wash of the sketchbook's gold
	   that has slipped a little off them, as the wash under the TV's nameplate has */
	.washed .numeral {
		position: relative;
		isolation: isolate;
	}

	.washed .numeral::before {
		content: attr(data-n);
		position: absolute;
		inset: 0;
		z-index: -1;
		color: var(--vr-wash);
		-webkit-text-stroke: 0;
		translate: 0.04em 0.03em;
	}

	/* On trial ('circled', 'tally', 'hand'): the numeral's cell, for the pencil to draw in and
	   the digit to stand in the middle of */
	:is(.circled, .tally, .hand) .numeral {
		position: relative;
		display: grid;
		place-items: center;
		width: var(--cell);
		height: calc(var(--cell) * 32 / 44);
		font-size: 1em;
		line-height: 1;
		color: var(--color-font-dark);
		-webkit-text-stroke: 0;
	}

	/* The pencil of the page's other drawings, the same weight at any size */
	.numeral svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		fill: none;
		stroke: var(--vr-muted);
		stroke-width: 1.2px;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.numeral path {
		vector-effect: non-scaling-stroke;
	}

	.numeral .again {
		stroke-width: 0.8px;
		opacity: 0.5;
	}

	/* 'tally': a firmer pencil, as the strokes are all there is */
	.tally .numeral svg {
		stroke-width: 1.5px;
	}

	.tally .numeral .again {
		stroke-width: 0.9px;
	}

	/* 'circled': a small numeral in ink inside its loop */
	.circled .digit {
		font-size: calc(var(--cell) * 0.4);
	}

	/* 'hand': in the notes' italic, a little crooked, as the Source note over them is written */
	.hand .digit {
		font-size: calc(var(--cell) * 0.62);
		font-style: italic;
		rotate: -4deg;
	}

	/* 'marker': the number as the film strip's captions have theirs (TvScreens' .count), in
	   the edge print's mono on a stroke of highlighter, on the name's first line */
	.marker .feature {
		align-items: baseline;
	}

	.marker .numeral {
		width: auto;
		margin-left: -0.3em;
		padding: 0.1em 0.18em 0.05em 0.3em;
		font: 0.9em var(--font-mono);
		letter-spacing: 0.12em;
		color: var(--vr-gold-ink);
		-webkit-text-stroke: 0;
		background: var(--vr-wash);
		border-radius: 0.2em 0.45em 0.35em 0.25em;
	}

	/* Three abreast under the set while there is room for them */
	@container (600px <= width < 880px) {
		.features {
			--cell: 2.86em;
			grid-template-columns: repeat(3, 1fr);
			gap: 1.25rem;
		}

		.feature {
			--name: 1.2em;
		}

		.feature p {
			font-size: 0.9em;
		}

		.numeral {
			font-size: 2.6em;
		}
	}

	@container (width >= 880px) {
		.features {
			gap: 2em;
		}

		.feature {
			--name: 1.45em;
		}
	}
</style>
