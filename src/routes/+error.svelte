<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} · Kirill's Garden</title>
</svelte:head>

<h1 class="page-heading">{page.status}</h1>
<p class="page-subtitle">
	{page.status === 404 ? "This page doesn't exist." : page.error?.message}
	<a href="/">Back home</a>
</p>

<style>
	a {
		color: var(--color-font-dark);
	}
</style>
