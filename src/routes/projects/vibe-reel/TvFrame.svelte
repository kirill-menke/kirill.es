<script>
	/** A 16:9 TV bezel showing one source, or cross-fading three in a loop */
	let { srcs, alt, eager = false } = $props();

	// The cycle keyframes give each screen a third of the loop, so only three sources cycle;
	// with any other count only the first is shown.
	const cycling = $derived(srcs.length === 3);
	const shown = $derived(cycling ? srcs : srcs.slice(0, 1));
</script>

<div class="tv" class:cycling>
	{#each shown as src, i (src)}
		<img
			{src}
			alt={i === 0 ? alt : ''}
			width="1280"
			height="720"
			loading={eager ? 'eager' : 'lazy'}
			decoding="async"
			style="--i: {i}"
		/>
	{/each}
</div>

<style>
	.tv {
		position: relative;
		aspect-ratio: 16 / 9;
		background: var(--color-device-screen);
		border: 0.4rem solid var(--color-device-bezel);
		border-radius: 0.6rem;
		overflow: hidden;
		box-shadow: 0 1rem 2rem -1rem rgb(0 0 0 / 0.35);
	}

	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* Each of the three screens holds for 4s of a 12s loop. The negative delays start the loop
	   mid-cycle; -8s per screen equals +4s modulo 12s, so each screen follows the one before. */
	.cycling img {
		opacity: 0;
		animation: cycle 12s infinite;
		animation-delay: calc(-1s - var(--i) * 8s);
	}

	@keyframes cycle {
		0% {
			opacity: 0;
		}
		5%,
		33% {
			opacity: 1;
		}
		38%,
		100% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cycling img {
			animation: none;
		}

		.cycling img:first-child {
			opacity: 1;
		}
	}
</style>
