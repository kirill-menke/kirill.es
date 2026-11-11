<script>
	/*
	 * The film strip drawn by hand in graphite round its screenshots (strip.js has the lines):
	 * its edges, torn ends and sprocket holes, the frame lines hatched and the ending frame, the
	 * last of `count`, boxed in. It covers the whole strip, behind the frames, in px of the strip
	 * as laid out (`size`, which TvScreens measures; until then a wide page's, stretched to fit).
	 * The holes are a few shapes drawn once and used along both rows. As the strip scrolls into
	 * view (the reel's --strip timeline) the pencil runs along it: each stroke drawn in turn, the
	 * rows of holes and the hatching wiped on behind it. Without scroll-driven animations, or
	 * with reduced motion, it is simply drawn.
	 */
	import { drawStrip, WIDE } from './strip.js';
	import { useTweaks } from '../tweaks.js';

	let { count, size = WIDE } = $props();
	const uid = $props.id();

	const tweak = useTweaks();
	const drawing = $derived(drawStrip(count, size));
</script>

<svg
	viewBox="0 0 {size.width} {size.height}"
	preserveAspectRatio="none"
	aria-hidden="true"
	focusable="false"
>
	<defs>
		{#each drawing.holes.shapes as d, j (j)}
			<path id="{uid}-hole-{j}" {d} />
		{/each}
	</defs>
	<!-- On trial: details of the strip in the sketchbook's gold. Washes under the frame lines'
	     hatching (strip.lines) and in the ending frame (strip.ending), which come on with the
	     pencil that draws over them, and the sprocket holes filled in (strip.holes). -->
	{#if tweak('strip.lines')}
		<path
			class="gold wipe"
			d={drawing.gold.lines}
			style:--a={drawing.hatching.a}
			style:--b={drawing.hatching.b}
		/>
	{/if}
	{#if tweak('strip.ending')}
		<path class="gold wipe" d={drawing.gold.ending} style:--a={0.45} style:--b={0.75} />
	{/if}
	{#each drawing.holes.rows as row, r (r)}
		<g
			class={['holes', 'wipe', tweak('strip.holes') && 'filled']}
			style:--a={drawing.wipes[r][0]}
			style:--b={drawing.wipes[r][1]}
		>
			{#each row as [x, y, shape], k (k)}
				<use href="#{uid}-hole-{shape}" {x} {y} />
			{/each}
		</g>
	{/each}
	<path
		class="hatching wipe"
		d={drawing.hatching.d}
		style:--a={drawing.hatching.a}
		style:--b={drawing.hatching.b}
	/>
	{#each drawing.strokes as stroke, i (i)}
		<path
			class="{stroke.kind} drawn"
			d={stroke.d}
			pathLength="1"
			style:--a={stroke.a}
			style:--b={stroke.b}
		/>
	{/each}
</svg>

<style>
	/* Graphite, light on the page */
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		fill: none;
		stroke: var(--vr-muted);
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* The edges and the ending frame's box firmest, gone over again lighter, the torn ends and
	   the holes finer */
	.edge,
	.blank {
		stroke-width: 1.1;
		opacity: 0.85;
	}

	.again {
		stroke-width: 0.8;
		opacity: 0.45;
	}

	.end,
	.holes {
		stroke-width: 0.9;
		opacity: 0.8;
	}

	.hatching {
		stroke-width: 0.7;
		opacity: 0.55;
	}

	/* On trial (strip.lines, strip.ending, strip.holes): the gold. A filled hole keeps its
	   pencil as light as it was and its wash at full strength. */
	.gold {
		fill: var(--vr-wash);
		stroke: none;
	}

	.holes.filled {
		fill: var(--vr-wash);
		opacity: 1;
		stroke-opacity: 0.8;
	}

	/* Each part takes its share (--a to --b) of the drawing-on, from the reel's top showing a
	   little way up the view until about half of it is in */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.drawn,
			.wipe {
				animation: draw linear both;
				animation-timeline: --strip;
				animation-range: cover calc(4% + var(--a) * 30%) cover calc(4% + var(--b) * 30%);
			}

			.drawn {
				stroke-dasharray: 1;
			}

			.wipe {
				animation-name: wipe;
			}
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

	@keyframes wipe {
		from {
			clip-path: inset(-4px 100% -4px -4px);
		}
		to {
			clip-path: inset(-4px);
		}
	}
</style>
