<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { ArrowUpRight } from '@lucide/svelte';

	export let hobby;
	export let duration;
	export let delay;

	export let showArrowLink = false;
	export let useHyperLink = false;

	const aspect = hobby.layout === 'square' ? 1 : 2;
</script>

<div
	role="presentation"
	class="tile"
	style="aspect-ratio: {aspect}"
	in:fly={{ y: -20, opacity: 0, duration, delay, easing: backInOut }}
>
	<div class="hobby-tile-bg" style="background-image: url('{hobby.preview}')"></div>
	<div class="hobby-tile-content">
		<span class="tile-header-text">
			{#if useHyperLink}
				<a href="/hobbies">
					Hobbies
					<span class="tooltip">Browse hobbies</span>
				</a>
			{:else}
				Hobbies
			{/if}
			· {hobby.name}</span
		>
		<a
			href={hobby.link}
			target="_blank"
			rel="noopener noreferrer"
			class="tile-anchor"
			style="visibility: {showArrowLink ? 'visible' : 'hidden'}"
			aria-label="View on Goodreads"
		>
			<span class="tooltip">View Hobbies</span>
			<ArrowUpRight strokeWidth="2" size="16" /></a
		>
	</div>

	<div class="tile-title">{hobby.title}</div>
</div>

<style>
	.tile {
		aspect-ratio: 1;
		justify-content: space-between;
	}

	.hobby-tile-bg {
		border-radius: 0.5rem;
		position: absolute;
		inset: 0;
		background-size: cover;
		transition:
			z-index 0s linear 0s,
			margin-top 0.1s linear;
		z-index: 1;
	}

	.tile:hover .hobby-tile-bg {
		margin-top: 3rem;
		z-index: 0;
		transition:
			margin-top 0.1s linear,
			z-index 0s linear 0.1s;
	}

	.hobby-tile-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.5rem 0 1.25rem;
		z-index: 0;
	}

	.tile-title {
		width: fit-content;
		padding: 0.3rem 0.5rem;
		margin: 0.6rem;
		background-color: transparent;
		font-family: var(--font-primary);
		color: white;
		font-size: 0.9rem;
		border-radius: 0.5rem;
		z-index: 2;
		transition: background-color 0.1s linear;
		backdrop-filter: blur(1px) brightness(0.7);
	}

	.tile:hover .tile-title {
		background-color: var(--color-font-dark);
		opacity: 0.9;
	}
</style>
