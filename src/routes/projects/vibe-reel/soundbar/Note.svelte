<script>
	/*
	 * The hand-written note under the soundbar, pointing at TRANSCODE: the words, then the "try
	 * it out" note's gold brush arrow up to the legend (phone-note/BrushArrow). It sits inside
	 * that legend, so it follows it wherever the display puts it: the arrow ends under the
	 * legend's middle and the note hangs 1.1rem less 2 px below it, the drawn lines running a
	 * little inside the bar's box. It is written once the legends are in.
	 */
	import BrushArrow from '../phone-note/BrushArrow.svelte';

	// From the note's end up to just under the bar, below TRANSCODE (x 232 of the 240 box)
	const ARROW = 'M204 36C222 35 230 24 232 6';
</script>

<svg class="note" viewBox="0 0 240 50" aria-hidden="true" focusable="false">
	<text x="0" y="41">the one that never lights up</text>
	<BrushArrow d={ARROW} max={4.6} head={10} spread={0.55} seed={7} />
</svg>

<style>
	/* Below the bar, its arrow ending just under TRANSCODE */
	.note {
		position: absolute;
		right: calc(50% - 8px);
		top: calc(100% + 1.1rem - 2px);
		width: 240px;
		height: 50px;
		overflow: visible;
		pointer-events: none;
		color: var(--color-font-dark);
		letter-spacing: 0;
	}

	text {
		font-family: var(--font-secondary);
		font-style: italic;
		font-size: 17px;
		fill: currentColor;
	}

	/* The words at 1.6 s, once the legends are written in, then the arrow drawn up to the
	   legend and its head */
	@media (prefers-reduced-motion: no-preference) {
		text {
			animation: write 500ms 1.6s ease-out backwards;
		}

		.note :global(.stroke) {
			stroke-dasharray: 1;
			animation: draw 600ms 1.9s cubic-bezier(0.55, 0.1, 0.35, 1) backwards;
		}

		.note :global(.head) {
			stroke-dasharray: 1;
			animation: draw 200ms 2.5s ease-out backwards;
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
			/* Not even a round cap's dot before the pen comes down */
			visibility: hidden;
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	/* 5/6 scale, so the note's start stays on screen */
	@container (max-width: 640px) {
		.note {
			right: calc(50% - 6.7px);
			width: 200px;
			height: 42px;
		}
	}
</style>
