<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { ArrowUpRight } from '@lucide/svelte';
	import { Github } from '@lucide/svelte';

	export let project;

	export let duration;
	export let delay;

	const aspect = project.layout === 'square' ? 1 : 2;

	export let showArrowLink = false;
	export let useHyperLink = false;
</script>

<div
	role="presentation"
	class="tile"
	style="aspect-ratio: {aspect};"
	in:fly={{
		y: -15,
		opacity: 0,
		duration,
		delay,
		easing: backInOut
	}}
>
	<div class="bg-wrapper">
		<div class="project-tile-bg" style="background-image: url('{project.preview}')"></div>
	</div>
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
		<a
			href={project.link}
			target="_blank"
			rel="noopener noreferrer"
			class="tile-anchor"
			style="visibility: {showArrowLink ? 'visible' : 'hidden'}"
			aria-label="View on Goodreads"
		>
			<span class="tooltip">View Project</span>
			<ArrowUpRight strokeWidth="2" size="16" /></a
		>
	</div>
</div>

<style>
	.project-tile-bg {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		transition: transform 0.1s linear;
	}

	.bg-wrapper {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border-radius: inherit;
	}

	.tile:hover .project-tile-bg {
		transform: scale(1.05);
	}

	.project-tile-content {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.5rem 0 1.25rem;
	}
</style>
