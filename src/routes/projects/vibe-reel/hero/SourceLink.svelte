<script>
	/*
	 * The link to the source, as an aside in the notes' hand: italic serif, with the "try it
	 * out" note's gold brush arrow under it, rising from beside the TV to the first letter.
	 */
	import BrushArrow from '../phone-note/BrushArrow.svelte';
	import { useTweaks } from '../tweaks.js';

	const tweak = useTweaks();

	let { href } = $props();

	// From beside the TV, low on the left, curving up to just under the "S"
	const ARROW = 'M2 30C28 34 62 28 76 5';
</script>

<!-- On trial: what pointing at it does (hero.source: 'marker', 'sepia') and its place on a narrow
     side-by-side stage (hero.laptop: 'above') -->
<a
	{href}
	class={[tweak('hero.source'), tweak('hero.laptop')]}
	target="_blank"
	rel="noopener noreferrer"
>
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

	/* On trial (hero.laptop): with the link in its row above the set on a narrow side-by-side
	   stage too (Hero), it keeps the narrow stage's room for its arrow there */
	@container (880px <= width < 1000px) {
		a.above {
			margin: 0 0 2.25rem 4.75rem;
		}
	}

	/* On trial (hero.source: 'marker'): pointed at, the words stay in ink and a band of the
	   sketchbook's gold is swept on behind them from the left, as behind the device on show in
	   the Shape-shifter. No underline. */
	.marker .words {
		position: relative;
		isolation: isolate;
	}

	.marker .words::before {
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

	a.marker:is(:hover, :focus-visible) .words {
		color: var(--color-font-dark);
	}

	a.marker:is(:hover, :focus-visible) .words::before {
		clip-path: inset(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.marker .words::before {
			transition: none;
		}
	}

	/* On trial (hero.source: 'sepia'): the words fade to the tickets' sepia (their --vr-gold) */
	a.sepia:is(:hover, :focus-visible) .words {
		color: #94704b;
	}
</style>
