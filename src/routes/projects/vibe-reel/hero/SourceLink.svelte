<script>
	/*
	 * The link to the source, as an aside in the notes' hand: italic serif, with the "try it
	 * out" note's gold brush arrow under it, rising from beside the TV to the first letter.
	 */
	import BrushArrow from '../phone-note/BrushArrow.svelte';

	let { href } = $props();

	// From beside the TV, low on the left, curving up to just under the "S"
	const ARROW = 'M2 30C28 34 62 28 76 5';
</script>

<a {href} target="_blank" rel="noopener noreferrer">
	<svg viewBox="0 0 80 36" aria-hidden="true" focusable="false"
		><BrushArrow d={ARROW} max={4.6} head={10} spread={0.55} seed={11} /></svg
	><span class="words">Source on GitHub</span>
</a>

<style>
	/* The arrow hangs out to the left and below, so the link keeps room for it on a narrow
	   stage, where it stands above the TV */
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

	/* The words sit a little right of the arrow's tip and a size up, about their bottom-left
	   corner; the arrow stays where it is */
	.words {
		display: inline-block;
		translate: 5px -1px;
		scale: 1.05;
		transform-origin: 0 100%;
		color: var(--color-font-dark);
		transition: color 400ms ease;
	}

	@container (width < 880px) {
		a {
			margin: 0 0 2.25rem 4.75rem;
		}
	}

	svg {
		position: absolute;
		top: 100%;
		left: -4.6rem;
		width: 5rem;
		height: 2.25rem;
		overflow: visible;
	}

	/* Pointed at, the words fade to the gold of the page's marks; no underline */
	a:is(:hover, :focus-visible) .words {
		color: var(--vr-gold);
	}
</style>
