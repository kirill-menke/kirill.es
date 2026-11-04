<script>
	/** A 16:9 TV bezel; several sources cross-fade in a loop */
	let { srcs, alt, eager = false } = $props();
</script>

<div class="tv" class:cycling={srcs.length > 1}>
	{#each srcs as src, i (src)}
		<img
			{src}
			alt={i === 0 ? alt : ''}
			width="1280"
			height="720"
			loading={eager ? 'eager' : 'lazy'}
			decoding="async"
			style="--i: {i}; --n: {srcs.length}"
		/>
	{/each}
</div>

<style>
	.tv {
		position: relative;
		aspect-ratio: 16 / 9;
		background: #0b0b0d;
		border: 0.4rem solid #18181b;
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

	/* Each screen holds for 4s; negative delays start the loop mid-cycle */
	.cycling img {
		opacity: 0;
		animation: cycle calc(var(--n) * 4s) infinite;
		animation-delay: calc(-1s - var(--i) * (var(--n) - 1) * 4s);
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
