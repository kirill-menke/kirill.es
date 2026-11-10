<script>
	/*
	 * The TV's picture: one screenshot, or the hero's three in a loop, each held for a shot of
	 * 12 s (--shot). Towards the end of each shot the picture gives way to snow for half a
	 * second, as on a set that has lost its channel, then cuts to the next.
	 *
	 * Each source plays the whole loop of three shots. The delays start it a quarter of a shot
	 * into the first when the set is switched on, --power-at in (the hero's, once its frame is
	 * drawn; any other set is on from the start); -2 shots per source equal +1 modulo three, so
	 * each follows the one before. The snow comes once a shot, on the same clock.
	 */
	let { srcs, alt, eager = false } = $props();

	// The loop gives each screen a third of it, so only three sources cycle; with any other
	// count only the first is shown
	const cycling = $derived(srcs.length === 3);
	const shown = $derived(cycling ? srcs : srcs.slice(0, 1));
</script>

{#each shown as src, i (src)}
	<img
		class:cycle={cycling}
		{src}
		alt={i === 0 ? alt : ''}
		width="1280"
		height="720"
		loading={eager ? 'eager' : 'lazy'}
		decoding="async"
		style="--i: {i}"
	/>
{/each}
{#if cycling}
	<span class="snow" aria-hidden="true"></span>
{/if}

<style>
	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.cycle,
	.snow {
		--shot: 12s;
	}

	/* On the loop's clock: three shots long, a quarter shot in as the set is switched on
	   (--power-at), two shots back per source. Until then each is held at its start, so that
	   the first is the one on (for hero/BiasLight, which goes by the pictures' animations).
	   Each shot is held to the end and cut, under the snow. */
	.cycle {
		opacity: 0;
		animation-name: cut;
		animation-duration: calc(var(--shot) * 3);
		animation-delay: calc(var(--shot) * (-0.25 - 2 * var(--i)) + var(--power-at, 0s));
		animation-iteration-count: infinite;
		animation-fill-mode: backwards;
	}

	@keyframes cut {
		0%,
		33.333% {
			opacity: 1;
		}
		33.334%,
		100% {
			opacity: 0;
		}
	}

	/* Grey grain, jumping about (keyframes snow), over the end of each shot: from 500 ms before
	   the cut over the old picture with a flicker (0.75 at 460 ms, 0.45 at 432 ms), then
	   nothing but snow from 392 ms until the cut, where it is gone at once. Its animation runs
	   over the shot, opacity 0 to 1, and the timing function puts those times in as fractions
	   of the shot. */
	.snow {
		--snowfall: linear(0, 0 95.833%, 0.75 96.167%, 0.45 96.4%, 1 96.733%, 1);
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0;
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='3.2 0 0 0 -1.05 3.2 0 0 0 -1.05 3.2 0 0 0 -1.05 0 0 0 0 1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")
			0 0 / 180px 180px #6b6b6b;
		animation-name: snowfall, snow;
		animation-duration: var(--shot), 0.25s;
		animation-delay: calc(var(--shot) * -0.25 + var(--power-at, 0s)), 0s;
		animation-timing-function: var(--snowfall), steps(1);
		animation-iteration-count: infinite;
	}

	@keyframes snowfall {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes snow {
		0% {
			background-position: 0 0;
		}
		20% {
			background-position: -61px 37px;
		}
		40% {
			background-position: 43px -82px;
		}
		60% {
			background-position: -97px -29px;
		}
		80% {
			background-position: 71px 113px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cycle {
			animation: none;
		}

		.cycle:first-child {
			opacity: 1;
		}

		.snow {
			display: none;
		}
	}
</style>
