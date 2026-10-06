<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	// import ProjectTile from '$lib/components/ProjectTile.svelte';
	import HobbyTileSlide from '$lib/components/HobbyTileSlide.svelte';
	import HobbyTileFade from '$lib/components/HobbyTileFade.svelte';
	import BookTile from '$lib/components/BookTile.svelte';
	import WIPTileImages from '$lib/components/WIPTileImages.svelte';
	import { projects, hobbies, books } from '$lib/tile-data.js';

	// To prevent server-side rendering and play animation
	let visible = $state(false);
	onMount(() => {
		visible = true;
	});
</script>

<svelte:head>
	<title>Kirill's Garden</title>
	<meta name="description" content="Kirill's personal website" />
</svelte:head>

{#if visible}
	<div class="grid-container">
		<p
			class="grid-item span-2-rows span-2-cols"
			in:fly={{ y: -20, opacity: 0, duration: 500, easing: backInOut }}
		>
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
		<div
			class="grid-item aspect-square"
			class:span-2-cols={projects.tile_by_tile.layout === 'wide'}
			class:aspect-wide={projects.tile_by_tile.layout === 'wide'}
		>
			<WIPTileImages
				project={projects.tile_by_tile}
				duration={500}
				delay={200}
				useHyperLink
			/>
		</div>

		<div
			class="grid-item"
			class:span-2-cols={projects.word_by_word.layout === 'wide'}
			class:aspect-wide={projects.word_by_word.layout === 'wide'}
		>
			<WIPTileImages
				project={projects.word_by_word}
				duration={500}
				delay={400}
				useHyperLink
			/>
		</div>
		<div class="grid-item aspect-square">
			<HobbyTileSlide
				hobby={hobbies.bouldering_regensburg}
				duration={500}
				delay={600}
				useHyperLink
			/>
		</div>
		<div class="grid-item aspect-square">
			<BookTile book={books.algorithms_to_live_by} duration={500} delay={800} useHyperLink />
		</div>
		<div
			class="grid-item"
			class:span-2-cols={hobbies.skiing_oppdal.layout === 'wide'}
			class:aspect-wide={hobbies.skiing_oppdal.layout === 'wide'}
		>
			<HobbyTileSlide
				hobby={hobbies.skiing_oppdal}
				duration={500}
				delay={1000}
				useHyperLink
			/>
		</div>
		<div class="grid-item aspect-square">
			<BookTile book={books.a_little_princess} duration={500} delay={1200} useHyperLink />
		</div>
		<div class="grid-item aspect-square">
			<HobbyTileFade hobby={hobbies.anime_frieren} duration={500} delay={1400} useHyperLink />
		</div>
		<div class="grid-item aspect-square">
			<HobbyTileSlide
				hobby={hobbies.vietnam_ninh_binh}
				duration={500}
				delay={1600}
				useHyperLink
			/>
		</div>
		<div class="grid-item aspect-square">
			<HobbyTileFade
				hobby={hobbies.anime_dandadan}
				duration={500}
				delay={1800}
				useHyperLink
			/>
		</div>
		<div class="grid-item aspect-square">
			<HobbyTileSlide
				hobby={hobbies.vietnam_sa_phin}
				duration={500}
				delay={2000}
				useHyperLink
			/>
		</div>
	</div>
{/if}

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
