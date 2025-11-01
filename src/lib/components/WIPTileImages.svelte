<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { ArrowUpRight } from '@lucide/svelte';

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
			<ArrowUpRight strokeWidth="2" size="16" />
		</a>
	</div>

	<div class="revealing-container">
		<div class="hiding-animation">
			<img
				class="rosie-working-gif"
				src="/wip-previews/frame_000_alpha.png"
				alt="rosie-animation"
			/>
			<span class="text-content">
				<strong class="hiding-animation-title">Working on it!</strong>
				Excuse the dust...
			</span>
		</div>

		<div class="wood-plank-wrapper">
			<div class="wood-plank-element left-element-container">
				<div class="wood-plank-float left-element-wrapper">
					<img
						src="/wip-previews/plank-horizontal-shovel-desat.webp"
						alt="Wood plank illustration with a shovel"
						class="wood-plank-image left-element"
						loading="lazy"
					/>
				</div>
			</div>

			<div class="wood-plank-element right-element-container">
				<div class="wood-plank-float right-element-wrapper">
					<img
						src="/wip-previews/plank-vertical-axe-desat.webp"
						alt="Wood plank illustration with an axe leaning on it"
						class="wood-plank-image right-element"
						loading="lazy"
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.project-tile-content {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.5rem 0 1.25rem;
		z-index: 10;
	}

	.tile {
		position: relative;
		overflow: hidden;
	}

	.revealing-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.hiding-animation {
		display: flex;
		flex-direction: column;
		opacity: 0;
		transition: opacity 0.1s ease-out;
	}

	.tile:hover .hiding-animation {
		opacity: 1;
	}

	.rosie-working-gif {
		width: 80px;
	}

	.hiding-animation-title {
		color: var(--color-font-dark);
		font-size: 0.9rem;
		display: block;
		margin-bottom: 0.15rem;
		font-weight: 500;
	}

	.text-content {
		text-align: center;
		font-size: 0.6rem;
		color: var(--color-font-light);
	}

	.wood-plank-wrapper {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0;
		z-index: 5;
	}

	.wood-plank-element {
		transition: transform 0.1s ease-out;
	}

	.wood-plank-float {
		animation: float 3s ease-in-out infinite;
	}

	.left-element-wrapper {
		animation-delay: 0.2s;
	}

	.right-element-wrapper {
		animation-delay: 0.5s;
	}

	.tile:hover .left-element-container {
		transform: translate(-6.5rem, 2rem);
	}

	.tile:hover .right-element-container {
		transform: translate(5.5rem, 2rem);
	}

	.wood-plank-image {
		display: block;
		object-fit: contain;
		width: 100%;
		height: auto;
	}

	.left-element {
		width: 260px;
		transform: rotate(-12deg) translate(5rem, 1rem);
	}

	.right-element {
		width: 280px;
		transform: rotate(8deg) translate(-5rem, 1rem);
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-5px);
		}
	}
</style>
