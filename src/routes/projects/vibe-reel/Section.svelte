<script>
	/**
	 * A page section: a claim heading, a one-line lede in the italic serif of the page's
	 * handwritten notes, and the body. Each block comes into focus as it scrolls in.
	 */
	let { id, heading, lede = '', children } = $props();
</script>

<section {id} class="vr-section">
	<h2>{heading}</h2>
	{#if lede}
		<p class="lede">{lede}</p>
	{/if}
	<div class="body">
		{@render children()}
	</div>
</section>

<style>
	.vr-section {
		margin: 8rem 0;
		scroll-margin-top: 2rem;
	}

	/* Headings stay on one line: on a phone they shrink with the column (3.5rem of page
	   padding), sized for the longest, about 14 em wide */
	h2 {
		font-family: var(--font-secondary);
		font-weight: 400;
		font-size: min(2rem, (100vw - 3.5rem) / 14);
		line-height: 1.2;
		color: var(--color-font-dark);
		margin: 0 0 0.5rem;
		max-width: 34ch;
	}

	@media (min-width: 640px) {
		h2 {
			font-size: 2.4rem;
		}
	}

	.lede {
		font-family: var(--font-secondary);
		font-style: italic;
		font-size: 1.3rem;
		line-height: 1.4;
		color: var(--vr-muted);
		margin: 0 0 1.75rem;
		max-width: 65ch;
	}

	/* A second part folded into the section: its claim as a smaller heading. On trial
	   (tweaks.js: page.subgap): the page may give the room over it, as --sub-gap. */
	.body :global(h3) {
		font-family: var(--font-secondary);
		font-weight: 400;
		font-size: min(1.5rem, (100vw - 3.5rem) / 13.5);
		line-height: 1.25;
		color: var(--color-font-dark);
		margin: var(--sub-gap, 3.5rem) 0 0.75rem;
		max-width: 34ch;
		scroll-margin-top: 2rem;
	}

	@media (min-width: 640px) {
		.body :global(h3) {
			font-size: 1.75rem;
		}
	}

	.body :global(p),
	.body :global(li) {
		color: var(--vr-muted);
		line-height: 1.65;
		max-width: 70ch;
	}

	.body :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		background: var(--vr-cream);
		color: var(--vr-gold-ink);
		padding: 0.1em 0.35em;
		border-radius: 0.3rem;
	}

	.body :global(strong) {
		color: var(--color-font-dark);
		font-weight: 500;
	}

	/* The entrance is scroll-driven, so nothing waits on script. Each block runs on its own
	   view, from entering the viewport to a fixed distance later, so tall blocks finish as soon
	   as short ones, and only the backwards fill holds, so no blur stays behind. The body's
	   blocks belong to the widgets: :where() keeps their rule at no specificity, so any
	   animation of their own wins. On trial (tweaks.js: page.focus): the page may give that
	   distance, as --focus-band, and say which blocks pull focus at all (below). */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			h2,
			.lede,
			:where(.body) > :global(*) {
				animation: focus linear backwards;
				animation-timeline: view();
				animation-range: entry 0% entry var(--focus-band, 14rem);
			}
		}
	}

	/* On trial (page.focus), by the article's data-focus. 'words': only the heading and the
	   lede pull focus; what stands under them, the drawings and the tickets, is simply there.
	   'off': nothing does. Blurring and fading a large drawing on every scrolled frame is what
	   Firefox paints slowest on this page (about half its time for a frame while the wheel
	   turns fast, by the measurements of 2026-11-11), and it scrolls ahead of its painting, so
	   whatever it has not painted yet shows late, or soft. */
	:global(.vr:is([data-focus='words'], [data-focus='off'])) .body > :global(*),
	:global(.vr[data-focus='off']) :is(h2, .lede) {
		animation: none;
	}

	/* From soft to sharp, the picture breathing a little as the lens moves */
	@keyframes focus {
		from {
			opacity: 0.35;
			filter: blur(10px);
			scale: 1.015;
		}
	}
</style>
