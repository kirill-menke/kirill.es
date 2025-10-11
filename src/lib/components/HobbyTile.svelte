<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { ArrowUpRight } from '@lucide/svelte';

	export let hobby;
	export let duration;
	export let delay;

	export let showArrowLink = false;
	export let useHyperLink = false;
</script>

<div
	role="presentation"
	class="tile"
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
</div>

<style>
	.tile {
		aspect-ratio: 1;
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
</style>
