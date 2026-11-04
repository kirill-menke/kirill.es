<script>
	import TileGrid from '#lib/components/tiles/TileGrid.svelte';
	import { projects, hobbies, books } from '#lib/tile-data.js';

	const homeTiles = [
		projects.vibeReel,
		projects.flags,
		hobbies.boulderingRegensburg,
		books.algorithmsToLiveBy,
		hobbies.skiingOppdal,
		books.aLittlePrincess,
		hobbies.animeFrieren,
		hobbies.vietnamNinhBinh,
		hobbies.animeDandadan,
		hobbies.vietnamSaPhin
	];

	// The intro drops in first, then the tiles one after another
	const homeEntrance = (index) => ({ duration: 500, delay: 200 * (index + 1) });
</script>

<svelte:head>
	<title>Kirill's Garden</title>
	<meta name="description" content="Kirill's personal website" />
</svelte:head>

<h1 class="visually-hidden">Kirill's Garden</h1>

<TileGrid items={homeTiles} timing={homeEntrance} linkSections squareCells>
	{#snippet lead()}
		<p class="grid-item span-2-rows span-2-cols enter" style:--enter-y="-20px">
			Hi there, I'm <span class="dark-font">Kirill</span> 👋 Welcome to my digital garden 🌱 I
			like
			<span class="dark-font">AI</span>
			and currently building this website you're on.
			<br /> <br />
			When I'm not coding, you'll find me lifting at the
			<span class="dark-font">gym</span>, watching
			<span class="dark-font">anime</span>, or buried in a good
			<span class="dark-font">book</span>.
			<br /> <br />
			This space is a random <span class="dark-font">collection</span> of my ideas,
			<span class="dark-font">projects</span>, and whatever's caught my attention lately.
		</p>
	{/snippet}
</TileGrid>

<style>
	/* Styles for introduction text */
	p {
		font-size: 1.4rem;
		font-weight: 400;
		margin: 1rem 1rem;
		color: var(--color-font-light);
		font-family: var(--font-secondary);
	}

	@media (min-width: 480px) {
		p {
			font-size: 1.4rem;
		}
	}

	@media (min-width: 640px) {
		p {
			font-size: 1.75rem;
			margin: 2rem 2rem;
		}
	}

	@media (min-width: 1024px) {
		p {
			font-size: 2.1rem;
		}
	}

	@media (min-width: 1280px) {
		p {
			font-size: 2.1rem;
		}
	}

	.dark-font {
		color: var(--color-font-dark);
	}
</style>
