<script>
	import NavBar from '$lib/components/NavBar.svelte';
	import '../app.css';
</script>

<NavBar />

<main>
	<slot />
</main>

<style>
	main {
		max-width: 1500px;
		margin: 0 auto;
		padding: 80px 2rem 2rem 2rem;
	}
</style>
