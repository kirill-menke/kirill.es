<script>
	/*
	 * The note over the film strip: "pull the film sideways" in the italic serif, and the "try it
	 * out" note's gold brush arrow (phone-note/BrushArrow) from the start of the words over and
	 * down onto the film. It sits in its own row above the strip, at the right, clear of the
	 * section's words and of the frames, the arrow's head just short of the film's edge: beside
	 * the lede's end on a wide page, and a row under it over a narrow strip (a phone), where
	 * the lede runs the width of the page. It is written, then drawn, as it scrolls into view
	 * (a scroll-driven animation); without one, or with reduced motion, it is simply there.
	 */
	import BrushArrow from '../phone-note/BrushArrow.svelte';

	// From just before the words, in one gentle curve down onto the film
	const ARROW = 'M64 13C46 14 33 27 29 60';
</script>

<svg class="note" viewBox="0 0 230 64" aria-hidden="true" focusable="false">
	<text x="70" y="17">pull the film sideways</text>
	<BrushArrow d={ARROW} max={4.6} head={11} spread={0.55} seed={5} />
</svg>

<style>
	/* At the right of the strip's container, further in on a wide page, a little larger than
	   drawn (--s), scaled about the arrow's tip (29, 60 of the 230 × 64 box) so that it keeps
	   pointing at the film, and lifted 34px. Moved 100px right, but at most as far as the
	   margin beside it, less what scaling it up adds on its right (the 201 past the tip), so it
	   never leaves the page on a narrow one. */
	.note {
		--margin: max(0px, 12cqw - 3rem);
		--s: 1.15;
		display: block;
		width: 230px;
		height: 64px;
		/* The film a quarter closer to the lede than the note's row alone would put it */
		margin: 0 var(--margin) -1.4rem auto;
		overflow: visible;
		color: var(--color-font-dark);
		pointer-events: none;
		translate: min(100px, var(--margin) - (var(--s) - 1) * 201px) -34px;
		scale: var(--s);
		transform-origin: 12.6% 93.75%;
	}

	/* Over a narrow strip (TvScreens' own breakpoint: a phone, or a column up to 40rem) the
	   lede's last line runs on under the words, which the lift would write over it: there the
	   note stands 1.5rem further down, the film with it, so that it has a row to itself */
	@container (max-width: 40rem) {
		.note {
			margin-top: 1.5rem;
		}
	}

	text {
		font-family: var(--font-secondary);
		font-style: italic;
		font-size: 17px;
		fill: currentColor;
	}

	/* The words, then the line, then its head, by the time the note is halfway up the view */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.note {
				view-timeline: --pull-note block;
			}

			text {
				animation: write linear both;
				animation-timeline: --pull-note;
				animation-range: entry 60% cover 30%;
			}

			.note :global(.stroke) {
				stroke-dasharray: 1;
				animation: draw linear both;
				animation-timeline: --pull-note;
				animation-range: cover 28% cover 45%;
			}

			.note :global(.head) {
				stroke-dasharray: 1;
				animation: draw linear both;
				animation-timeline: --pull-note;
				animation-range: cover 45% cover 49%;
			}
		}
	}

	@keyframes write {
		from {
			opacity: 0;
			translate: 0 4px;
		}
	}

	@keyframes draw {
		from {
			stroke-dashoffset: 1;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
