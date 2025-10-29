<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { ArrowUpRight } from '@lucide/svelte';

	export let book;
	export let duration;
	export let delay;

	export let showArrowLink = true;
	export let useHyperLink = false;
</script>

<div
	role="presentation"
	class="tile"
	in:fly={{
		y: -15,
		opacity: 0,
		duration,
		delay,
		easing: backInOut
	}}
>
	<div class="book-tile-header">
		<span class="tile-header-text">
			{#if useHyperLink}
				<a href="/projects">
					Reading
					<span class="tooltip">Browse reading</span>
				</a>
			{:else}
				Reading
			{/if}
			· Books
		</span>
		<a
			href={book.link}
			target="_blank"
			rel="noopener noreferrer"
			class="tile-anchor"
			style="visibility: {showArrowLink ? 'visible' : 'hidden'}"
			aria-label="View on Goodreads"
		>
			<span class="tooltip">View on Goodreads</span>
			<ArrowUpRight strokeWidth="2" size="16" /></a
		>
	</div>
	<div class="book-tile-content">
		<img src={book.coverUrl} alt="{book.title} cover" class="book-cover" />
		<div class="book-info">
			<span class="book-status" data-status={book.status.toLowerCase().replace(' ', '-')}
				>{book.status.replace('-', ' ')}</span
			>
			<h3 class="book-title">{book.title}</h3>
			<p class="book-author">{book.author}</p>
		</div>
	</div>
</div>

<style>
	.tile {
		aspect-ratio: 1;
		justify-content: space-between;
	}

	.book-tile-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.5rem 0 1.25rem;
	}

	.book-tile-content {
		display: flex;
		gap: 2rem;
		padding: 0rem 2rem 2.5rem 2rem;
		align-items: flex-end;
	}

	.book-cover {
		width: 140px;
		height: 210px;
		border-radius: 4px;
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.1),
			0 4px 8px rgba(0, 0, 0, 0.1);
		flex-shrink: 0;
		transition: transform 0.1s linear;
	}

	.tile:hover .book-cover {
		transform: rotate(-5deg) scale(1.1);
		box-shadow:
			0 4px 8px rgba(0, 0, 0, 0.1),
			0 8px 16px rgba(0, 0, 0, 0.1);
	}

	.book-info {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		flex: 1;
	}

	.book-status {
		font-size: 0.7rem;
		font-weight: 600;
		border-radius: 5px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.7rem;
		padding: 0.3rem 0.4rem;
		display: inline-block;
		text-align: center;
		width: fit-content;
		border: 1px solid currentColor;
		box-shadow:
			1px 1px 0px rgba(0, 0, 0, 0.1),
			1px 1px 2px rgba(0, 0, 0, 0.1);
	}

	.book-status[data-status='reading'] {
		background-color: oklch(93% 0.05 80);
		color: oklch(62% 0.06 108);
	}

	.book-status[data-status='read'] {
		background-color: oklch(93% 0.05 124);
		color: oklch(62% 0.06 125);
	}

	.book-status[data-status='to-read'] {
		background-color: oklch(93% 0.05 13);
		color: oklch(63% 0.06 15);
	}

	.book-title {
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.5;
		color: var(--color-font-dark);
		margin: 0 0 0.25rem 0;
	}

	.book-author {
		font-size: 1rem;
		line-height: 1.5;
		color: var(--color-font-light);
		margin: 0;
	}
</style>
