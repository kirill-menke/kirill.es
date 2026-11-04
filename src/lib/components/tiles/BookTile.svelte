<script>
	import TileHeader from './TileHeader.svelte';

	let { item: book, linkSection = false } = $props();

	const statusLabels = { 'to-read': 'To read', reading: 'Reading', read: 'Read' };
</script>

<div role="presentation" class="tile">
	<div class="tile-header">
		<TileHeader
			section="Reading"
			name="Books"
			{linkSection}
			href={book.link}
			label="View on Goodreads"
			ariaLabel="View {book.title} on Goodreads"
		/>
	</div>
	<div class="book-tile-content">
		<img src={book.coverUrl} alt="" class="book-cover" loading="lazy" decoding="async" />
		<div class="book-info">
			<span class="tile-pill" data-status={book.status}>{statusLabels[book.status]}</span>
			<h2 class="book-title">{book.title}</h2>
			<p class="book-author">{book.author}</p>
		</div>
	</div>
</div>

<style>
	.tile {
		aspect-ratio: 1;
		justify-content: space-between;
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
		min-width: 0;
		overflow-wrap: break-word;
	}

	/* Phones show one tile per row: a square would be mostly empty, so the tile only grows as
	   tall as its content and the smaller cover leaves the title room to breathe */
	@media (width < 640px) {
		.tile {
			aspect-ratio: auto;
		}

		.book-tile-content {
			gap: 1.25rem;
			padding: 1rem 1.25rem 1.5rem;
		}

		.book-cover {
			width: 110px;
			height: 165px;
		}
	}

	.tile-pill {
		margin-bottom: 0.7rem;
		box-shadow:
			1px 1px 0px rgba(0, 0, 0, 0.1),
			1px 1px 2px rgba(0, 0, 0, 0.1);
	}

	.tile-pill[data-status='reading'] {
		background-color: oklch(93% 0.05 80);
		color: oklch(62% 0.06 108);
	}

	.tile-pill[data-status='read'] {
		background-color: oklch(93% 0.05 124);
		color: oklch(62% 0.06 125);
	}

	.tile-pill[data-status='to-read'] {
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
