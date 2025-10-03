<script>
	let books = [
		{
			status: 'TO-READ',
			title: 'Thinking in Systems',
			author: 'Donella H. Meadows',
			coverUrl: 'book-covers/thinking-in-systems.jpg'
		},
		{
			status: 'TO-READ',
			title: 'Why Greatness Cannot Be Planned',
			author: 'Kenneth O. Stanley, Joel Lehman',
			coverUrl: 'book-covers/why-greatness-cannot-be-planned.jpg'
		},
		{
			status: 'READING',
			title: 'Algorithms to Live by',
			author: 'Brian Christian, Tom Griffiths',
			coverUrl: 'book-covers/algorithms-to-live-by.jpg'
		},
		{
			status: 'READING',
			title: 'A Little Princess',
			author: 'Frances Hodgson Burnett',
			coverUrl: 'book-covers/a-little-princess.jpg'
		},
		{
			status: 'READ',
			title: 'Thinking, Fast and Slow',
			author: 'Daniel Kahneman',
			coverUrl: 'book-covers/thinking-fast-and-slow.jpg'
		},
		{
			status: 'READ',
			title: 'How to Win Friends & Influence People',
			author: 'Dale Carnegie',
			coverUrl: 'book-covers/how-to-win-friends.jpg'
		},
		{
			status: 'READ',
			title: 'Norwegian Wood',
			author: 'Haruki Murakami',
			coverUrl: 'book-covers/norwegian-wood.jpg'
		},
		{
			status: 'READ',
			title: 'Hard-Boiled Wonderland and the End of the World',
			author: 'Haruki Murakami',
			coverUrl: 'book-covers/hard-boiled-wonderland.jpg'
		},
		{
			status: 'READ',
			title: "I'm Glad My Mom Died",
			author: 'Jennette McCurdy',
			coverUrl: 'book-covers/im-glad-my-mom-died.jpg'
		},
		{
			status: 'READ',
			title: 'Zen and the Art of Motorcycle Maintenance',
			author: 'Robert Pirsig',
			coverUrl: 'book-covers/zen.jpg'
		},
		{
			status: 'READ',
			title: 'What You Are Looking For Is in the Library',
			author: 'Michiko Aoyama',
			coverUrl: 'book-covers/what-you-are-looking-for.jpg'
		},
		{
			status: 'READ',
			title: 'Ikigai',
			author: 'Ken Mogi',
			coverUrl: 'book-covers/ikigai.jpg'
		},
		{
			status: 'READ',
			title: 'Atomic Habits',
			author: 'James Clear',
			coverUrl: 'book-covers/atomic-habits.jpg'
		},
		{
			status: 'READ',
			title: "Can't Hurt Me",
			author: 'David Goggins',
			coverUrl: 'book-covers/cant-hurt-me.jpg'
		},
		{
			status: 'READ',
			title: 'The Things We Leave Unfinished ',
			author: 'Rebecca Yarros',
			coverUrl: 'book-covers/the-things-we-leave-unfinished.jpg'
		},
		{
			status: 'READ',
			title: 'A Brief History of Time',
			author: 'Stephen Hawking',
			coverUrl: 'book-covers/a-brief-history-of-time.jpg'
		}
	];
</script>

<div class="container">
	<header>
		<h1>reading.</h1>
		<p class="subtitle">The books I'm reading, what I've read, and what I hope to read next.</p>
	</header>

	<div class="books-grid">
		{#each books as book}
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
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 1600px;
	}

	header {
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 5.5rem;
		font-weight: 400;
		margin: 0 0 0.5rem 0;
		color: #333;
		font-family: 'NanumMyeongjo', serif;
	}

	.subtitle {
		font-size: 1.1rem;
		color: #888;
		margin: 0;
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

	.book-tile {
		display: flex;
		gap: 2rem;
		background-color: #f5f5f5;
		border-radius: 6px;
		padding: 3rem 2rem 3rem 3rem;
		box-sizing: border-box;
	}

	.book-tile:hover {
		background-color: #f0f0f0;
	}

	.book-cover {
		width: 140px;
		height: 210px;
		object-fit: cover;
		border-radius: 4px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
		flex-shrink: 0;
		transition: transform 0.1s linear;
	}

	.book-tile:hover .book-cover {
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
		font-size: 0.8rem;
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
		box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
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
		font-weight: 600;
		margin: 0 0 0.25rem 0;
		color: #333;
		line-height: 1.3;
	}

	.book-author {
		font-size: 0.95rem;
		color: #666;
		margin: 0;
	}
</style>
