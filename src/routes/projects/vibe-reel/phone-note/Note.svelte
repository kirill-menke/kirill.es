<script>
	/*
	 * The note by the live phone: "try it out" and "it's the real app" in the italic serif, and
	 * a gold brush arrow (BrushArrow) from under them out to the right, down and back left onto
	 * the phone's edge, pressed down, then lifted off to a hair at the phone. It stands beside the
	 * phone, its box (224 × 180) with (30, 20) on the phone's top-right corner, the phone's right
	 * edge running down from there at x 30 and the words 40 clear of it. It is sized from the
	 * phone's width (LivePhone is its container), up to a limit past which a larger phone keeps
	 * the same note. `go` draws it, once the app is up: the words fade in, the arrow runs to the
	 * phone, the head lands.
	 */
	import BrushArrow from './BrushArrow.svelte';

	let { go } = $props();
</script>

<svg class={['note', { go }]} viewBox="0 0 224 180" aria-hidden="true" focusable="false">
	<text class="label" x="70" y="58" style:font-size="31px">try it out</text>
	<text class="label sub" x="74" y="80" style:font-size="15px">it’s the real app</text>
	<BrushArrow
		d="M142 92C180 108 168 140 122 142C92 143 62 140 37 134"
		max={6.2}
		head={15}
		spread={0.52}
		seed={3}
	/>
</svg>

<style>
	/* Beside the phone: the box's (30, 20) on its top-right corner, a unit a 190th of the
	   phone's width (100cqw, LivePhone being the container) but never more than 1.2px, so that
	   a large phone does not get large words */
	.note {
		--u: min(1.2px, 100cqw / 190);
		position: absolute;
		left: calc(100% - 30 * var(--u));
		top: calc(20 * var(--u) * -1);
		width: calc(224 * var(--u));
		height: calc(180 * var(--u));
		overflow: visible;
		pointer-events: none;
		visibility: hidden;
		color: var(--vr-gold-ink);
	}

	.note.go {
		visibility: visible;
	}

	.label {
		font-family: var(--font-secondary);
		font-style: italic;
		fill: currentColor;
	}

	.sub {
		color: var(--vr-gold);
	}

	@media (prefers-reduced-motion: no-preference) {
		.go .label {
			animation: write 500ms ease-out both;
		}

		.go .sub {
			animation-delay: 150ms;
		}

		/* BrushArrow's mask paths: the line, then its head */
		.go :global(.stroke) {
			stroke-dasharray: 1;
			animation: draw 900ms 250ms cubic-bezier(0.55, 0.1, 0.35, 1) both;
		}

		.go :global(.head) {
			stroke-dasharray: 1;
			animation: draw 220ms 1100ms ease-out both;
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
