<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { ArrowUpRight } from '@lucide/svelte';

	let { project, duration, delay, useHyperLink = false } = $props();

	// Same layout as the /flags circle (top edge facing outward, first flag at 12 o'clock), fewer flags.
	const RADIUS = 37; // % of the ring box, ring centre line
	let width = $derived(((2 * Math.PI * RADIUS) / project.ring.length) * 0.9);
	let placed = $derived(
		project.ring.map((code, i) => {
			const angle = -90 + (i * 360) / project.ring.length;
			const rad = (angle * Math.PI) / 180;
			const x = 50 + RADIUS * Math.cos(rad);
			const y = 50 + RADIUS * Math.sin(rad);
			const style = `left: ${x}%; top: ${y}%; width: ${width}%; --angle: ${angle + 90}deg; --i: ${i}`;
			return { code, style };
		})
	);
</script>

<!-- Square tile: a slowly turning ring of flags with the flag count in the middle -->
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

	<div class="stage" aria-hidden="true" style="--pop-delay: {delay}ms">
		<div class="ring">
			{#each placed as { code, style } (code)}
				<div class="flag" {style}>
					<img src="/flag-images/{code}.svg" alt="" decoding="async" draggable="false" />
				</div>
			{/each}
		</div>
		<div class="centre">
			<span class="count">{project.count}</span>
			<span class="caption">{project.title}</span>
		</div>
	</div>
</div>

<style>
	.tile {
		aspect-ratio: 1;
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

	/* Square box nudged down so the top of the ring clears the header */
	.ring {
		position: absolute;
		top: 4%;
		left: 0;
		width: 100%;
		aspect-ratio: 1;
		animation: spin 120s linear infinite;
	}

	.flag {
		position: absolute;
		aspect-ratio: 3 / 2;
		transform: translate(-50%, -50%) rotate(var(--angle)) scale(var(--scale, 1));
		transition: transform 0.25s ease-out;
		transition-delay: calc(var(--i) * 8ms);
		animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
		animation-delay: calc(var(--pop-delay) + 200ms + var(--i) * 20ms);
	}

	.flag img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 0 0.5px rgba(0, 0, 0, 0.5));
	}

	.tile:hover .flag {
		--scale: 1.3;
	}

	.centre {
		position: absolute;
		left: 50%;
		top: 54%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.count {
		font-family: var(--font-secondary);
		font-size: 20cqw;
		line-height: 1;
		color: var(--color-font-dark);
	}

	.caption {
		margin-top: 0.25rem;
		font-family: var(--font-secondary);
		font-size: max(0.85rem, 6cqw);
		color: var(--color-font-light);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) rotate(var(--angle)) scale(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ring,
		.flag {
			animation: none;
		}
	}
</style>
