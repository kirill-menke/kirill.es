<script>
	/*
	 * "Watch while it downloads": a torrent's pieces, done in order up to the download frontier
	 * plus the last one, fetched first, and playback some way behind the frontier, drawn as a
	 * hand-labelled bar (downloads/Bar.svelte) from the model in downloads/model.js, with the two
	 * ways the growing file is watched as cards under it.
	 *
	 * Live, the download runs as a loop at 2.5× speed: the frontier moves on, playback chases it
	 * and waits whenever it catches up. It pauses while the figure is off screen, and never runs
	 * with reduced motion, which keeps the still picture.
	 */
	import { prefersReducedMotion } from 'svelte/motion';
	import { still, download } from './downloads/model.js';
	import Bar from './downloads/Bar.svelte';
	import Lanes from './downloads/Lanes.svelte';

	const SPEED = 2.5;
	const live = $derived(!prefersReducedMotion.current);

	let running = $state(null);
	let figure = $state();
	let onscreen = $state(false);
	const dl = $derived(running ?? still);

	$effect(() => {
		const io = new IntersectionObserver(([e]) => (onscreen = e.isIntersecting));
		io.observe(figure);
		return () => io.disconnect();
	});

	// One download per live run; leaving the screen only stops its clock
	const step = $derived(live ? download() : null);

	$effect(() => {
		if (!step) {
			running = null;
			return;
		}
		if (!onscreen) return;
		let frame;
		let last;
		const tick = (time) => {
			// A backgrounded tab gets no frames: carry on from where it stopped instead of jumping
			const dt = Math.min(0.1, (time - (last ?? time)) / 1000);
			last = time;
			running = step(dt * SPEED);
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	});
</script>

<figure class="vr-panel" bind:this={figure}>
	<Bar {dl} {live} />
	<Lanes />
</figure>

<style>
	/* On the sketchbook's sheet, as the architecture diagram above it is (the page's --vr-paper
	   and --vr-paper-grain), in the panel's frame; the cards on it stay a shade lighter than the
	   sheet */
	figure {
		--color-background-tile: var(--vr-paper);
		--color-background: #fff;
		background-color: var(--vr-paper);
		background-image: var(--vr-paper-grain);
	}
</style>
