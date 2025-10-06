<script>
	import { onMount } from 'svelte';
	import { ArrowUpRight } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { navigating } from '$app/stores';

	export let data;
	let { books } = data;

	let visible = false;
	let fromHomePage = false;
	let previousRoute = null;

	// Subscribe to navigation changes to track the previous route
	navigating.subscribe((nav) => {
		if (nav && nav.from) {
			previousRoute = nav.from.url.pathname;
		}
	});

	onMount(() => {
		// Check if we came from home page or it's a direct access/reload
		fromHomePage = previousRoute === '/' || previousRoute === null;
		visible = true;
	});
</script>

<div class="container">
	<h1>reading.</h1>
	<p class="subtitle">
		All the books I'm reading, what I've read, and what I hope to read next.<br />
		Recommendations are always welcome!
	</p>

	<div class="books-grid">
		{#each books as book, index}
			{#if visible}
				<div
					role="presentation"
					class="book-tile-wrap"
					in:fly={{
						y: -15,
						opacity: 0,
						duration: fromHomePage ? 600 : 300,
						delay: fromHomePage ? index * 125 : 0,
						easing: backInOut
					}}
				>
					<div class="book-tile-header">
						<span class="book-tile-header-text">Reading · Books</span>
						<a
							href={book.link}
							target="_blank"
							rel="noopener noreferrer"
							class="book-tile-anchor"
							aria-label="View on Goodreads"
						>
							<span class="tooltip">View on Goodreads</span>
							<ArrowUpRight strokeWidth="2" size="16" /></a
						>
					</div>
					<div class="book-tile">
						<img src={book.coverUrl} alt="{book.title} cover" class="book-cover" />
						<div class="book-info">
							<span
								class="book-status"
								data-status={book.status.toLowerCase().replace(' ', '-')}
								>{book.status.replace('-', ' ')}</span
							>
							<h3 class="book-title">{book.title}</h3>
							<p class="book-author">{book.author}</p>
						</div>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 1600px;
	}

	h1 {
		font-size: 5.5rem;
		font-weight: 400;
		margin: 0.5rem 0;
		color: var(--color-font-dark);
		font-family: var(--font-secondary);
	}

	.subtitle {
		font-size: 1.1rem;
		color: var(--color-font-light);
		margin-bottom: 2.5rem;
	}

	.books-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		width: 100%;
	}

	@media (max-width: 1199px) {
		.books-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 899px) {
		.books-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 599px) {
		.books-grid {
			grid-template-columns: 1fr;
		}
	}

	.book-tile-wrap {
		display: flex;
		background-color: #f5f5f5;
		border-radius: 6px;
		box-sizing: border-box;
		flex-direction: column;
	}

	.book-tile-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.5rem 0 1.25rem;
		margin-bottom: 2.5rem;
	}

	.book-tile-header-text {
		font-size: 0.9rem;
		color: var(--color-font-light);
	}

	.book-tile-anchor {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100%;
		background-color: transparent;
		border: 0.5px solid transparent;
		padding: 6px;
		transition: all 0.2s ease;
		color: var(--color-font-light);
		position: relative;
	}

	.tooltip {
		position: absolute;
		right: calc(100% + 8px);
		top: 50%;
		transform: translateX(5%) translateY(-50%);
		background-color: var(--color-font-dark);
		color: white;
		padding: 6px 10px;
		border-radius: 6px;
		font-size: 0.85rem;
		white-space: nowrap;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.2s ease,
			visibility 0.2s ease,
			transform 0.2s ease;
		pointer-events: none;
	}

	.book-tile-anchor:hover .tooltip {
		opacity: 1;
		visibility: visible;
		transform: translateX(0%) translateY(-50%);
	}

	.book-tile-wrap:hover .book-tile-anchor {
		background-color: white;
		border: 0.5px solid lightgrey;
		box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);
		color: var(--color-font-dark);
	}

	.book-tile-wrap:hover .book-tile-anchor :global(svg) {
		color: var(--color-font-dark);
	}

	.book-tile {
		display: flex;
		gap: 2rem;
		padding: 0rem 2rem 2.5rem 2rem;
		align-items: flex-end;
	}

	.book-tile-wrap:hover {
		background-color: #f0f0f0;
	}

	.book-cover {
		width: 140px;
		height: 210px;
		border-radius: 4px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
		flex-shrink: 0;
		transition: transform 0.1s linear;
	}

	.book-tile-wrap:hover .book-cover {
		transform: rotate(-5deg) scale(1.1);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
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
		box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);
	}

	.book-status[data-status='reading'] {
		background-color: #ffffba;
		color: #878759;
	}

	.book-status[data-status='read'] {
		background-color: #e2f0cb;
		color: #7e8c67;
	}

	.book-status[data-status='to-read'] {
		background-color: #ffb3ba;
		color: #976266;
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
