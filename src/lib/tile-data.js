export const projects = {
	vibeReel: {
		name: 'VibeReel',
		link: '/projects/vibe-reel',
		// Exactly three: the tile cross-fades them in a loop
		screens: [
			'/project-previews/vibe-reel/tv-home.webp',
			'/project-previews/vibe-reel/tv-detail.webp',
			'/project-previews/vibe-reel/tv-player.webp'
		],
		// The tile's headline, from the project page
		fact: { value: '147', unit: 'KB', caption: 'a whole Jellyfin app for the TV' },
		// Three looks read `screens` and `fact`; switch by changing this one word:
		// 'glow'      the TV at the left, glowing onto the light tile, the fact on the right
		// 'stencil'   the screens playing inside the fact's giant digits, on a dark wall
		// 'scrapbook' a taped-in print with the fact handwritten beside it
		tileType: 'glow',
		layout: 'wide'
	},
	flags: {
		name: 'Flags',
		title: 'flags, one circle',
		link: '/flags',
		count: 193,
		// Every sixth flag of the /flags circle, in ring order, so the colour gradient survives.
		// Listed here so the home page does not pull in all of flags.json.
		ring: (
			'kz bb ga ng sd iq hu in it tm qa mc ca vn cy de ' +
			'sn gw kn et td am bz py lu ws gb th er uy ni bw'
		).split(' '),
		tileType: 'flags',
		layout: 'square'
	}
};

export const hobbies = {
	animeDandadan: {
		name: 'Anime',
		title: 'Dandadan',
		preview: '/hobby-previews/dandadan.webp',
		tags: ['Comedy', 'Shōnen'],
		tileType: 'fade',
		layout: 'square'
	},
	skiingOppdal: {
		name: 'Skiing',
		title: '2023-09-23 @ Oppdal',
		preview: '/hobby-previews/skiing-oppdal.webp',
		tileType: 'slide',
		layout: 'wide'
	},
	animeFrieren: {
		name: 'Anime',
		title: 'Frieren',
		preview: '/hobby-previews/frieren.webp',
		tags: ['Iyashikei'],
		tileType: 'fade',
		layout: 'square'
	},
	boulderingRegensburg: {
		name: 'Bouldering',
		title: '2025-08-30 @ Boulderwelt Regensburg',
		preview: '/hobby-previews/bouldering.webp',
		tileType: 'slide',
		layout: 'square'
	},
	animeAot: {
		name: 'Anime',
		title: 'Attack on Titan',
		preview: '/hobby-previews/aot-scarf.webp',
		tags: ['Action', 'Horror'],
		tileType: 'fade',
		layout: 'square'
	},
	animeHxh: {
		name: 'Anime',
		title: 'Hunter x Hunter',
		preview: '/hobby-previews/hxh-fishing.webp',
		tags: ['Shōnen'],
		tileType: 'fade',
		layout: 'square'
	},
	vietnamChildren: {
		name: 'Traveling',
		title: '2024-11-25 @ Hà Giang',
		preview: '/hobby-previews/vietnam-children.webp',
		tileType: 'slide',
		layout: 'square'
	},
	vietnamNinhBinh: {
		name: 'Traveling',
		title: '2024-11-27 @ Ninh Bình',
		preview: '/hobby-previews/vietnam-ninh-binh.webp',
		tileType: 'slide',
		layout: 'square'
	},
	vietnamSaPhin: {
		name: 'Traveling',
		title: '2024-11-25 @ Sà Phìn',
		preview: '/hobby-previews/vietnam-sa-phin.webp',
		tileType: 'slide',
		layout: 'square'
	}

	// Running, Chess, Gym, League of Legends
	// Naruto, Chainsaw Man, Spy x Family, Demon Slayer, Death Note
};

export const books = {
	thinkingInSystems: {
		status: 'to-read',
		title: 'Thinking in Systems',
		author: 'Donella H. Meadows',
		coverUrl: '/book-covers/thinking-in-systems.jpg',
		link: 'https://www.goodreads.com/book/show/3828902-thinking-in-systems',
		tileType: 'book'
	},
	whyGreatnessCannotBePlanned: {
		status: 'to-read',
		title: 'Why Greatness Cannot Be Planned',
		author: 'Kenneth O. Stanley, Joel Lehman',
		coverUrl: '/book-covers/why-greatness-cannot-be-planned.jpg',
		link: 'https://www.goodreads.com/book/show/25670869-why-greatness-cannot-be-planned',
		tileType: 'book'
	},
	algorithmsToLiveBy: {
		status: 'reading',
		title: 'Algorithms to Live by',
		author: 'Brian Christian, Tom Griffiths',
		coverUrl: '/book-covers/algorithms-to-live-by.jpg',
		link: 'https://www.goodreads.com/book/show/25666050-algorithms-to-live-by',
		tileType: 'book'
	},
	aLittlePrincess: {
		status: 'reading',
		title: 'A Little Princess',
		author: 'Frances Hodgson Burnett',
		coverUrl: '/book-covers/a-little-princess.jpg',
		link: 'https://www.goodreads.com/book/show/3008.A_Little_Princess',
		tileType: 'book'
	},
	thinkingFastAndSlow: {
		status: 'read',
		title: 'Thinking, Fast and Slow',
		author: 'Daniel Kahneman',
		coverUrl: '/book-covers/thinking-fast-and-slow.jpg',
		link: 'https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow',
		tileType: 'book'
	},
	howToWinFriends: {
		status: 'read',
		title: 'How to Win Friends & Influence People',
		author: 'Dale Carnegie',
		coverUrl: '/book-covers/how-to-win-friends.jpg',
		link: 'https://www.goodreads.com/book/show/4865.How_to_Win_Friends_and_Influence_People',
		tileType: 'book'
	},
	norwegianWood: {
		status: 'read',
		title: 'Norwegian Wood',
		author: 'Haruki Murakami',
		coverUrl: '/book-covers/norwegian-wood.jpg',
		link: 'https://www.goodreads.com/book/show/11297.Norwegian_Wood',
		tileType: 'book'
	},
	hardBoiledWonderland: {
		status: 'read',
		title: 'Hard-Boiled Wonderland and the End of the World',
		author: 'Haruki Murakami',
		coverUrl: '/book-covers/hard-boiled-wonderland.jpg',
		link: 'https://www.goodreads.com/book/show/10374.Hard_Boiled_Wonderland_and_the_End_of_the_World',
		tileType: 'book'
	},
	imGladMyMomDied: {
		status: 'read',
		title: "I'm Glad My Mom Died",
		author: 'Jennette McCurdy',
		coverUrl: '/book-covers/im-glad-my-mom-died.jpg',
		link: 'https://www.goodreads.com/book/show/59366244-i-m-glad-my-mom-died',
		tileType: 'book'
	},
	zenAndTheArt: {
		status: 'read',
		title: 'Zen and the Art of Motorcycle Maintenance',
		author: 'Robert Pirsig',
		coverUrl: '/book-covers/zen.jpg',
		link: 'https://www.goodreads.com/book/show/629.Zen_and_the_Art_of_Motorcycle_Maintenance',
		tileType: 'book'
	},
	whatYouAreLookingFor: {
		status: 'read',
		title: 'What You Are Looking For Is in the Library',
		author: 'Michiko Aoyama',
		coverUrl: '/book-covers/what-you-are-looking-for.jpg',
		link: 'https://www.goodreads.com/book/show/91274427-what-you-are-looking-for-is-in-the-library',
		tileType: 'book'
	},
	ikigai: {
		status: 'read',
		title: 'Ikigai',
		author: 'Ken Mogi',
		coverUrl: '/book-covers/ikigai.jpg',
		link: 'https://www.goodreads.com/book/show/36073585-ikigai',
		tileType: 'book'
	},
	atomicHabits: {
		status: 'read',
		title: 'Atomic Habits',
		author: 'James Clear',
		coverUrl: '/book-covers/atomic-habits.jpg',
		link: 'https://www.goodreads.com/book/show/40121378-atomic-habits',
		tileType: 'book'
	},
	cantHurtMe: {
		status: 'read',
		title: "Can't Hurt Me",
		author: 'David Goggins',
		coverUrl: '/book-covers/cant-hurt-me.jpg',
		link: 'https://www.goodreads.com/book/show/41721428-can-t-hurt-me',
		tileType: 'book'
	},
	theThingsWeLeaveUnfinished: {
		status: 'read',
		title: 'The Things We Leave Unfinished',
		author: 'Rebecca Yarros',
		coverUrl: '/book-covers/the-things-we-leave-unfinished.jpg',
		link: 'https://www.goodreads.com/book/show/53137938-the-things-we-leave-unfinished',
		tileType: 'book'
	},
	aBriefHistoryOfTime: {
		status: 'read',
		title: 'A Brief History of Time',
		author: 'Stephen Hawking',
		coverUrl: '/book-covers/a-brief-history-of-time.jpg',
		link: 'https://www.goodreads.com/book/show/3869.A_Brief_History_of_Time',
		tileType: 'book'
	}
};
