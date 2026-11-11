<script>
	/*
	 * The link to the source, as an aside in the notes' hand: italic serif. Where it stands
	 * beside the set or over its corner (a stage from 880 px, Hero), the "try it out" note's
	 * brush arrow hangs under it, rising from beside the TV to the first letter.
	 *
	 * Where the set stands under it and the features under that (a narrower stage: a phone, a
	 * tablet), there is nothing beside it for an arrow to come from. There the words are marked
	 * instead, lying on the band of the sketchbook's gold that a pointer otherwise sweeps on
	 * behind them, and a short flick of the same brush after them points out of the page.
	 */
	import BrushArrow from '../phone-note/BrushArrow.svelte';

	let { href } = $props();

	// From beside the TV, low on the left, curving up to just under the "S"
	const ARROW = 'M2 30C28 34 62 28 76 5';
	// After the words: up and out to the right
	const OUT = 'M2.5 16.5C8 15.5 13 11 16.5 3.5';
</script>

<a {href} target="_blank" rel="noopener noreferrer">
	<svg class="lead" viewBox="0 0 80 36" aria-hidden="true" focusable="false"
		><BrushArrow d={ARROW} max={4.6} head={10} spread={0.55} seed={11} /></svg
	><span class="words">Source on GitHub</span><svg
		class="out"
		viewBox="0 0 20 20"
		aria-hidden="true"
		focusable="false"><BrushArrow d={OUT} max={3.2} head={7} spread={0.6} seed={4} /></svg
	>
</a>

<style>
	/* The arrow hangs out to the left and below, so the link keeps room for it wherever it has
	   a row of its own above the TV: on a stage under 1000 px (Hero) */
	a {
		position: relative;
		display: inline-block;
		margin-top: 1.5rem;
		font-family: var(--font-secondary);
		font-style: italic;
		font-size: 1.15rem;
		text-decoration: none;
		color: var(--color-font-dark);
	}

	/* Under a finger the link takes a tap on about 44px of height, not only on its line of
	   words */
	@media (pointer: coarse) {
		a::after {
			content: '';
			position: absolute;
			inset: -0.7rem -0.5rem;
		}
	}

	/* The words sit a little right of the arrow's tip and a size up, about their bottom-left
	   corner; the arrow stays where it is. Their own stacking context, for the band behind
	   them. */
	.words {
		position: relative;
		isolation: isolate;
		display: inline-block;
		translate: 5px -1px;
		scale: 1.05;
		transform-origin: 0 100%;
		color: var(--color-font-dark);
	}

	@container (width < 1000px) {
		a {
			margin: 0 0 2.25rem 4.75rem;
		}
	}

	.lead {
		position: absolute;
		top: 100%;
		left: -4.6rem;
		width: 5rem;
		height: 2.25rem;
		overflow: visible;
	}

	.out {
		display: none;
	}

	/* Pointed at, the words stay in ink and a band of the sketchbook's gold is swept on behind
	   them from the left, as behind the device on show in the Shape-shifter. No underline. */
	.words::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: auto -0.2em 0.06em -0.12em;
		height: 0.55em;
		border-radius: 0.1em 0.3em 0.18em 0.35em / 0.25em;
		background: var(--vr-wash);
		rotate: -1.5deg;
		clip-path: inset(0 100% 0 0);
		transition: clip-path 450ms ease-out;
	}

	a:is(:hover, :focus-visible) .words::before {
		clip-path: inset(0);
	}

	/* Over the set (the stacked stage): at the column's edge, the words at their size without
	   the nudge that set them by the arrow's tip, the band behind them there to stay, and the
	   flick after them in place of the arrow */
	@container (width < 880px) {
		a {
			margin: 0 0 2.5rem;
			font-size: 1.2rem;
		}

		.lead {
			display: none;
		}

		.words {
			translate: none;
			scale: none;
		}

		.words::before {
			clip-path: inset(0);
		}

		.out {
			display: inline-block;
			width: 1.05em;
			height: 1.05em;
			margin-left: 0.45em;
			vertical-align: -0.08em;
			overflow: visible;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.words::before {
			transition: none;
		}
	}
</style>
