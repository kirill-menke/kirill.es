<script>
	/**
	 * A page section: a claim heading, a one-line lede in the italic serif of the page's
	 * handwritten notes, and the body. The heading and the lede come into focus as they
	 * scroll in.
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

	/* Headings stay on one line: on a phone they shrink with the column, sized for the longest
	   of them (--vr-h2, among the page's sizes) */
	h2 {
		font-family: var(--font-secondary);
		font-weight: 400;
		font-size: var(--vr-h2);
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

	/* On a phone the lede steps down with its heading, to about three quarters of it: at its
	   full size it would stand as tall as a heading shrunk to fit, and run a line longer */
	.lede {
		font-family: var(--font-secondary);
		font-style: italic;
		font-size: clamp(1.05rem, var(--vr-h2) * 0.735, 1.3rem);
		line-height: 1.4;
		color: var(--vr-muted);
		margin: 0 0 1.75rem;
		max-width: 65ch;
	}

	/* A second part folded into the section: its claim as a smaller heading, set well clear
	   of the part before it. On one line too, and on a phone a step under the section's own
	   heading (--vr-sub), which it would otherwise match or pass. */
	.body :global(h3) {
		font-family: var(--font-secondary);
		font-weight: 400;
		font-size: min(1.5rem, var(--vr-sub));
		line-height: 1.25;
		color: var(--color-font-dark);
		margin: 5rem 0 0.75rem;
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

	/* The heading and the lede come into focus as they scroll in. Scroll-driven, so nothing
	   waits on script: each runs on its own view, from entering the viewport to a fixed
	   distance later, and only the backwards fill holds, so no blur stays behind. The body is
	   simply there: blurring and fading its large blocks on every scrolled frame was what
	   Firefox painted slowest on this page, about half its time for a frame while the wheel
	   turns fast (measured 2026-11-11), and as it scrolls ahead of its painting, a block then
	   showed late, or still soft. */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			h2,
			.lede {
				animation: focus linear backwards;
				animation-timeline: view();
				animation-range: entry 0% entry 14rem;
			}
		}
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
