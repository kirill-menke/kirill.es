export const prerender = true;

export function load() {
	const books = [
		{
			status: 'TO-READ',
			title: 'Thinking in Systems',
			author: 'Donella H. Meadows',
			coverUrl: 'book-covers/thinking-in-systems.jpg',
			link: 'https://www.goodreads.com/book/show/3828902-thinking-in-systems'
		},
		{
			status: 'TO-READ',
			title: 'Why Greatness Cannot Be Planned',
			author: 'Kenneth O. Stanley, Joel Lehman',
			coverUrl: 'book-covers/why-greatness-cannot-be-planned.jpg',
			link: 'https://www.goodreads.com/book/show/25670869-why-greatness-cannot-be-planned'
		},
		{
			status: 'READING',
			title: 'Algorithms to Live by',
			author: 'Brian Christian, Tom Griffiths',
			coverUrl: 'book-covers/algorithms-to-live-by.jpg',
			link: 'https://www.goodreads.com/book/show/25666050-algorithms-to-live-by'
		},
		{
			status: 'READING',
			title: 'A Little Princess',
			author: 'Frances Hodgson Burnett',
			coverUrl: 'book-covers/a-little-princess.jpg',
			link: 'https://www.goodreads.com/book/show/3008.A_Little_Princess'
		},
		{
			status: 'READ',
			title: 'Thinking, Fast and Slow',
			author: 'Daniel Kahneman',
			coverUrl: 'book-covers/thinking-fast-and-slow.jpg',
			link: 'https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow'
		},
		{
			status: 'READ',
			title: 'How to Win Friends & Influence People',
			author: 'Dale Carnegie',
			coverUrl: 'book-covers/how-to-win-friends.jpg',
			link: 'https://www.goodreads.com/book/show/4865.How_to_Win_Friends_and_Influence_People'
		},
		{
			status: 'READ',
			title: 'Norwegian Wood',
			author: 'Haruki Murakami',
			coverUrl: 'book-covers/norwegian-wood.jpg',
			link: 'https://www.goodreads.com/book/show/11297.Norwegian_Wood'
		},
		{
			status: 'READ',
			title: 'Hard-Boiled Wonderland and the End of the World',
			author: 'Haruki Murakami',
			coverUrl: 'book-covers/hard-boiled-wonderland.jpg',
			link: 'https://www.goodreads.com/book/show/10374.Hard_Boiled_Wonderland_and_the_End_of_the_World'
		},
		{
			status: 'READ',
			title: "I'm Glad My Mom Died",
			author: 'Jennette McCurdy',
			coverUrl: 'book-covers/im-glad-my-mom-died.jpg',
			link: 'https://www.goodreads.com/book/show/59366244-i-m-glad-my-mom-died'
		},
		{
			status: 'READ',
			title: 'Zen and the Art of Motorcycle Maintenance',
			author: 'Robert Pirsig',
			coverUrl: 'book-covers/zen.jpg',
			link: 'https://www.goodreads.com/book/show/629.Zen_and_the_Art_of_Motorcycle_Maintenance'
		},
		{
			status: 'READ',
			title: 'What You Are Looking For Is in the Library',
			author: 'Michiko Aoyama',
			coverUrl: 'book-covers/what-you-are-looking-for.jpg',
			link: 'https://www.goodreads.com/book/show/91274427-what-you-are-looking-for-is-in-the-library'
		},
		{
			status: 'READ',
			title: 'Ikigai',
			author: 'Ken Mogi',
			coverUrl: 'book-covers/ikigai.jpg',
			link: 'https://www.goodreads.com/book/show/36073585-ikigai'
		},
		{
			status: 'READ',
			title: 'Atomic Habits',
			author: 'James Clear',
			coverUrl: 'book-covers/atomic-habits.jpg',
			link: 'https://www.goodreads.com/book/show/40121378-atomic-habits'
		},
		{
			status: 'READ',
			title: "Can't Hurt Me",
			author: 'David Goggins',
			coverUrl: 'book-covers/cant-hurt-me.jpg',
			link: 'https://www.goodreads.com/book/show/41721428-can-t-hurt-me'
		},
		{
			status: 'READ',
			title: 'The Things We Leave Unfinished ',
			author: 'Rebecca Yarros',
			coverUrl: 'book-covers/the-things-we-leave-unfinished.jpg',
			link: 'https://www.goodreads.com/book/show/53137938-the-things-we-leave-unfinished'
		},
		{
			status: 'READ',
			title: 'A Brief History of Time',
			author: 'Stephen Hawking',
			coverUrl: 'book-covers/a-brief-history-of-time.jpg',
			link: 'https://www.goodreads.com/book/show/3869.A_Brief_History_of_Time'
		}
	];

	return {
		books
	};
}
