<script>
	/*
	 * A 16:9 TV drawn in ink (#lib/components/sketch/TvSketch, which draws itself round the
	 * glass and places it), showing one source, or cycling through three in a loop
	 * (devices/TvPicture). What it is given to show (`children`, the hero's power-on) goes in
	 * the glass over the picture, so it covers the screen and nothing else.
	 */
	import TvSketch from '#lib/components/sketch/TvSketch.svelte';
	import TvPicture from './devices/TvPicture.svelte';

	let { srcs, alt, eager = false, children } = $props();
</script>

<div class="tv">
	<TvSketch />
	<div class="glass">
		<TvPicture {srcs} {alt} {eager} />
		{@render children?.()}
	</div>
</div>

<style>
	/* The TV is the drawing's container, so 1cqw there is a hundredth of the TV's width */
	.tv {
		position: relative;
		container-type: inline-size;
	}

	.glass {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--color-device-screen);
	}
</style>
