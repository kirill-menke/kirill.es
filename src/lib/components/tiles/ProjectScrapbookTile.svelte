<script>
	import TileHeader from './TileHeader.svelte';

	let { item: project, linkSection = false } = $props();

	const { value, unit, caption } = $derived(project.fact);
</script>

<!-- Wide 2:1 tile: a taped-in print of the screens, tilted, with the project's fact handwritten
     beside it and an arrow drawn on after the entrance -->
<div role="presentation" class="tile">
	<a class="tile-link" href={project.link} aria-label="Open the {project.name} project page"></a>

	<div class="tile-header">
		<TileHeader
			section="Projects"
			name={project.name}
			{linkSection}
			href={project.link}
			label="View project"
			duplicate
		/>
	</div>

	<div class="print" aria-hidden="true">
		<div class="photo">
			{#each project.screens as src, i (src)}
				<img {src} alt="" class="tile-cycle" style="--i: {i}" loading="lazy" />
			{/each}
		</div>
		<span class="tape left"></span>
		<span class="tape right"></span>
	</div>

	<h2 class="note">
		<span class="value">{value}{unit ? ` ${unit}` : ''}</span>
		<span class="caption">{caption}</span>
	</h2>

	<svg class="arrow" viewBox="0 0 180 120" aria-hidden="true">
		<path pathLength="1" d="M20 10 C 20 90, 100 110, 168 78" />
		<path pathLength="1" class="head" d="M146 76 L168 78 L155 96" />
	</svg>
</div>

<style>
	@font-face {
		font-family: 'Caveat';
		/* Basic Latin only (Google Fonts' `text=` subset, SIL OFL). Fetched only while a tile
		   using it is on screen. The VibeReel page's LivePhone declares the same face. */
		src: url('/fonts/Caveat-SemiBold-subset.woff2') format('woff2');
		font-weight: 600;
		font-display: swap;
	}

	.tile {
		aspect-ratio: 2;
		overflow: hidden;
		container-type: size;
		--pen: oklch(0.35 0.02 260);
	}

	/* A print with a white border, tilted, held by two strips of tape */
	.print {
		position: absolute;
		left: 46cqw;
		top: max(10cqw, 2.6rem);
		width: 47cqw;
		padding: 1cqw;
		background: white;
		box-shadow:
			0 0.3cqw 0.6cqw rgb(0 0 0 / 0.12),
			0 1.6cqw 2.4cqw -1.2cqw rgb(0 0 0 / 0.3);
		rotate: 3deg;
		transition: rotate 0.4s var(--ease-cubic-out);
	}

	.tile:hover .print {
		rotate: 1deg;
	}

	.photo {
		position: relative;
		aspect-ratio: 16 / 9;
		background: var(--color-device-screen);
		overflow: hidden;
	}

	.photo img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.tape {
		position: absolute;
		top: -1.2cqw;
		width: 9cqw;
		height: 2.6cqw;
		background: oklch(0.9 0.08 90 / 0.75);
		/* Torn ends */
		clip-path: polygon(
			0 8%,
			4% 0,
			96% 6%,
			100% 0,
			97% 50%,
			100% 100%,
			94% 92%,
			3% 100%,
			0 92%,
			3% 50%
		);
	}

	.tape.left {
		left: -3cqw;
		rotate: -32deg;
	}

	.tape.right {
		right: -3cqw;
		rotate: 28deg;
	}

	.note {
		position: absolute;
		left: 1.25rem;
		top: max(10cqw, 2.6rem);
		width: 36cqw;
		margin: 0;
		display: flex;
		flex-direction: column;
		font-family: 'Caveat', var(--font-secondary);
		font-weight: 600;
		color: var(--pen);
		rotate: -4deg;
		transform-origin: left top;
	}

	.value {
		font-size: 11cqw;
		line-height: 1;
		white-space: nowrap;
	}

	.caption {
		margin-top: 0.4cqw;
		font-size: max(0.95rem, 3cqw);
		line-height: 1.1;
		color: oklch(0.5 0.02 260);
		text-wrap: balance;
	}

	/* From the end of the caption to the print */
	.arrow {
		position: absolute;
		left: 36cqw;
		top: 20.5cqw;
		width: 12cqw;
		fill: none;
		stroke: var(--pen);
		stroke-width: 4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* Drawn on after the tile's entrance, which TileGrid delays through --enter-delay */
	.arrow path {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 0.7s var(--ease-cubic-out) forwards;
		animation-delay: calc(var(--enter-delay, 0ms) + 400ms);
	}

	.arrow .head {
		animation-duration: 0.25s;
		animation-delay: calc(var(--enter-delay, 0ms) + 1000ms);
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@media (max-width: 480px) {
		.note {
			left: 0.9rem;
			top: 2.6rem;
		}

		.caption {
			font-size: 0.85rem;
		}

		.arrow {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.arrow path {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
