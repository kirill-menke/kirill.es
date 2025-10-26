<script>
	import NavBar from '$lib/components/NavBar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';
</script>

<main>
	<NavBar />
	<slot />
	<Footer />
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	@media (min-width: 480px) {
		main {
			max-width: 600px;
		}
	}

	@media (min-width: 640px) {
		main {
			max-width: 700px;
		}
	}

	@media (min-width: 1024px) {
		main {
			max-width: 950px;
		}
	}

	@media (min-width: 1280px) {
		main {
			max-width: 1450px;
		}
	}
</style>
