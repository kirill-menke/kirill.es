<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';

	export let hobby;
	export let duration;
	export let delay;

	export let useHyperLink = false;

	const aspect = hobby.layout === 'square' ? 1 : 2;
</script>

<div
	role="presentation"
	class="tile"
	style="aspect-ratio: {aspect}"
	in:fly={{ y: -20, opacity: 0, duration, delay, easing: backInOut }}
>
	<div class="image-container">
		<img class="hobby-tile-bg" src={hobby.preview} alt={hobby.name} />
	</div>
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
			· {hobby.name}
		</span>
	</div>

	<div class="tile-footer">
		<div class="tags">
			{#each hobby.tags as tag}
				<div class="tag" {tag}>
					<span>{tag}</span>
				</div>
			{/each}
		</div>
		<h3 class="tile-title">{hobby.title}</h3>
	</div>
</div>

<style>
	.image-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border-radius: inherit;
	}

	.hobby-tile-bg {
		position: absolute;
		width: 100%;
		transition: transform 0.3s ease;
	}

	.tile:hover .hobby-tile-bg {
		z-index: 1;
		transform: scale(1.05);
	}

	.hobby-tile-content {
		padding: 1rem 1.25rem 0.45rem 1.25rem;
		z-index: 2;
	}

	.tile-footer {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		flex-grow: 1;
		z-index: 0;
		padding: 1rem 1.25rem 0.45rem 1.25rem;
		gap: 10px;
		background: linear-gradient(to top, #fafafa, transparent 60%);
		transition: opacity 0.1s linear;
	}

	.tile:hover .tile-footer,
	.tile:focus-within .tile-footer {
		opacity: 0.3;
	}

	/* Tag styles */
	.tags {
		display: flex;
		gap: 0.5rem;
	}

	.tag {
		font-size: 0.7rem;
		font-weight: 600;
		border-radius: 5px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.3rem 0.4rem;
		display: inline-block;
		text-align: center;
		width: fit-content;
		border: 1px solid currentColor;
		box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);
		opacity: 0.85;
	}

	.tag[tag='Horror'] {
		background-color: oklch(0.7 0.1 18);
		color: oklch(0.45 0.1 18);
	}

	.tag[tag='Comedy'] {
		background-color: oklch(0.8 0.1 85);
		color: oklch(0.5 0.1 85);
	}

	.tag[tag='Shōnen'] {
		background-color: oklch(0.7 0.1 25);
		color: oklch(0.45 0.1 25);
	}

	.tag[tag='Iyashikei'] {
		background-color: oklch(0.85 0.04 310);
		color: oklch(0.5 0.04 310);
	}

	.tag[tag='Action'] {
		background-color: oklch(0.8 0.1 54);
		color: oklch(0.55 0.1 54);
	}

	.tile-title {
		font-family: var(--font-secondary);
		color: black;
		font-size: 2.25rem;
		font-weight: 400;
		margin: 0;
	}
</style>
