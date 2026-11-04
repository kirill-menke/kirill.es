<script>
	let { src, alt } = $props();
</script>

<div class="phone">
	<img {src} {alt} width="590" height="1279" loading="lazy" decoding="async" />
</div>

<style>
	.phone {
		aspect-ratio: 1179 / 2556;
		background: var(--color-device-screen);
		border: 0.45rem solid var(--color-device-bezel);
		border-radius: 2.2rem;
		overflow: hidden;
		box-shadow: 0 1rem 2rem -1rem rgb(0 0 0 / 0.4);
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
