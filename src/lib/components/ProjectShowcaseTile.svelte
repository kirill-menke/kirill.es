<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { ArrowUpRight } from '@lucide/svelte';

	let { project, duration, delay, useHyperLink = false } = $props();
</script>

<!-- Wide 2:1 tile: a TV cycling through screenshots with a phone beside it -->
<div
	role="presentation"
	class="tile"
	in:fly={{ y: -15, opacity: 0, duration, delay, easing: backInOut }}
>
	<a class="tile-link" href={project.link} aria-label="Open the {project.name} project page"></a>

	<div class="project-tile-content">
		<span class="tile-header-text">
			{#if useHyperLink}
				<a href="/projects">
					Projects
					<span class="tooltip">Browse projects</span>
				</a>
			{:else}
				Projects
			{/if}
			· {project.name}
		</span>
		<a href={project.link} class="tile-anchor" aria-label="View project">
			<span class="tooltip">View Project</span>
			<ArrowUpRight strokeWidth="2" size="16" />
		</a>
	</div>

	<div class="stage" aria-hidden="true">
		<div class="glow"></div>
		<div class="tv">
			{#each project.screens.tv as src, i (src)}
				<img {src} alt="" class="tv-screen" style="--i: {i}" loading="lazy" />
			{/each}
		</div>
		<div class="phone">
			<img src={project.screens.phone} alt="" loading="lazy" />
		</div>
		<div class="tile-title">{project.title}</div>
	</div>
</div>

<style>
	.tile {
		aspect-ratio: 2;
		overflow: hidden;
		container-type: size;
	}

	.tile-link {
		position: absolute;
		inset: 0;
		z-index: 3;
		border-radius: inherit;
	}

	.project-tile-content {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.5rem 0 1.25rem;
		z-index: 4;
		pointer-events: none;
	}

	.project-tile-content a {
		pointer-events: auto;
	}

	.stage {
		position: absolute;
		inset: 0;
	}

	.glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse 60% 70% at 70% 75%,
			oklch(0.8 0.13 80 / 0.22),
			transparent 70%
		);
		opacity: 0.5;
		transition: opacity 0.2s ease;
	}

	.tile:hover .glow {
		opacity: 1;
	}

	/* 16:9 TV, sized in container units so the composition scales with the tile */
	.tv {
		position: absolute;
		left: 6cqw;
		top: max(9cqw, 2.4rem);
		width: 56cqw;
		aspect-ratio: 16 / 9;
		background: #0b0b0d;
		border: 0.5cqw solid #18181b;
		border-radius: 1cqw;
		overflow: hidden;
		box-shadow: 0 1.5cqw 3cqw -1cqw rgb(0 0 0 / 0.35);
		transition: transform 0.2s ease;
	}

	.tv-screen {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		/* Each screen is visible for a third of the cycle; negative delays start mid-cycle */
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

	/* Portrait phone, deliberately cut off by the tile's bottom edge */
	.phone {
		position: absolute;
		right: 10cqw;
		top: max(12cqw, 3rem);
		width: 20cqw;
		aspect-ratio: 1179 / 2556;
		border: 0.7cqw solid #18181b;
		border-radius: 3cqw;
		overflow: hidden;
		background: #0b0b0d;
		box-shadow: 0 1.5cqw 3cqw -1cqw rgb(0 0 0 / 0.4);
		transition: transform 0.2s ease;
	}

	.phone img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.tile:hover .tv {
		transform: translateY(-0.6cqw);
	}

	.tile:hover .phone {
		transform: translateY(-3cqw);
	}

	/* Bottom-left like the other tiles' titles; dark because it sits on the light tile */
	.tile-title {
		position: absolute;
		left: 0;
		bottom: 0;
		margin: 0.6rem;
		padding: 0.3rem 0.5rem;
		font-family: var(--font-primary);
		color: white;
		font-size: 0.9rem;
		border-radius: 0.5rem;
		background-color: var(--color-font-dark);
		opacity: 0.9;
		z-index: 2;
	}

	/* Leave room for the title below the TV on narrow tiles */
	@media (max-width: 480px) {
		.tv {
			width: 46cqw;
		}

		.tile-title {
			font-size: 0.75rem;
			margin: 0.4rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tv-screen {
			animation: none;
		}

		.tv-screen:first-child {
			opacity: 1;
		}
	}
</style>
