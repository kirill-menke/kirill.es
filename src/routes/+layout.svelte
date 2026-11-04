<script>
	import NavBar from '#lib/components/NavBar.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import { trackEntrance } from '#lib/entrance.js';
	import '../app.css';
	import '#lib/components/tiles/tiles.css';

	let { children } = $props();

	trackEntrance();
</script>

<div class="page">
	<a class="skip-link" href="#content">Skip to content</a>
	<NavBar />
	<main id="content">
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	.page {
		max-width: 600px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	@media (min-width: 640px) {
		.page {
			max-width: 700px;
		}
	}

	@media (min-width: 1024px) {
		.page {
			max-width: 950px;
		}
	}

	@media (min-width: 1280px) {
		.page {
			max-width: 1450px;
		}
	}

	/* Keeps the skip-link target clear of the sticky nav bar */
	main {
		scroll-margin-top: 70px;
	}

	.skip-link {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 1001;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		background-color: var(--color-background);
		box-shadow: var(--shadow-float);
		color: var(--color-font-dark);
		font-size: 0.9rem;
		text-decoration: none;
	}

	/* Clipped (invisible and unclickable) until a keyboard user tabs to it */
	.skip-link:not(:focus-visible) {
		clip-path: inset(50%);
	}
</style>
