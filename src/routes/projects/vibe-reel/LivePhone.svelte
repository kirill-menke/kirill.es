<script>
	/*
	 * The iPhone of "One engine, three screens" (engine/Morph.svelte), running the real
	 * VibeReel phone app: static/vibe-reel-demo is vibe-reel's demo build (demo/ in that repo),
	 * the app on a snapshot of my library, with each title's trailer in place of the film. The
	 * prerendered page shows `src`, a screenshot of the same screen; the app loads after the
	 * page and replaces it once its Home is up.
	 *
	 * The app takes the mouse as soon as it is over the phone: PhoneCursor draws a grease pencil
	 * in place of the pointer, and dragging scrolls as a finger would. A frame too small to use
	 * (a phone's layout) opens the demo full screen instead. `running` (bindable) says the app
	 * is up and usable in place. `shown` says whether the phone is on show: Morph fades it out
	 * for the TV and the browser with the app running on behind it, so that it never reloads,
	 * and out of sight whatever the app is playing is paused. `screen` binds the screen inside
	 * the bezel, as PhoneFrame's does.
	 *
	 * The note (phone-note/Note.svelte: "try it out", "it's the real app" and an arrow) stands
	 * beside the phone, well clear of it, the words at the top and the arrow running from under
	 * them onto the phone's edge, and is sized from the phone's width: this is its container. It
	 * draws itself the first time the phone is half on screen and shown with the app up, and
	 * from then on comes and goes with the phone.
	 */
	import { onMount } from 'svelte';
	import PhoneFrame from './PhoneFrame.svelte';
	import PhoneCursor from './PhoneCursor.svelte';
	import Note from './phone-note/Note.svelte';

	let { src, alt, shown = true, running = $bindable(false), screen = $bindable() } = $props();

	const DEMO = '/vibe-reel-demo/index.html';
	// The iPhone 15's viewport, which the demo lays out for
	const W = 393;
	const MIN_LIVE = 150;

	let live = $state();
	let frame = $state();
	let scale = $state(1);
	let small = $state(false);
	let settled = $state(false);
	let failed = $state(false);
	let load = $state(false);
	let ready = $state(false);
	let onScreen = $state(false);
	let drawn = $state(false);

	// Once loaded the app stays, also when the window narrows; a widened one gets it then
	$effect(() => {
		if (settled && !small && !failed) load = true;
	});

	$effect(() => {
		running = ready && !small;
	});

	$effect(() => {
		if (ready && shown && onScreen) drawn = true;
	});

	// Out of sight, the trailer playing in the app stops where it is
	$effect(() => {
		if (shown || !ready) return;
		for (const media of frame?.contentDocument?.querySelectorAll('video, audio') ?? [])
			media.pause();
	});

	onMount(() => {
		const measure = () => {
			scale = screen.clientWidth / W;
			small = screen.clientWidth < MIN_LIVE;
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(screen);
		const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), {
			threshold: 0.5
		});
		io.observe(live);

		// After the page, so the demo's data never competes with the article's images
		let timer = 0;
		const start = () => (timer = window.setTimeout(() => (settled = true), 400));
		if (document.readyState === 'complete') start();
		else window.addEventListener('load', start, { once: true });

		const onMessage = (e) => {
			if (e.origin !== location.origin || !frame || e.source !== frame.contentWindow) return;
			if (e.data?.vibereel === 'ready') ready = true;
			else if (e.data?.vibereel === 'failed') {
				failed = true;
				load = false;
			}
		};
		window.addEventListener('message', onMessage);
		return () => {
			ro.disconnect();
			io.disconnect();
			clearTimeout(timer);
			window.removeEventListener('load', start);
			window.removeEventListener('message', onMessage);
		};
	});
</script>

<div class="live" bind:this={live}>
	<PhoneFrame bind:screen>
		<img
			class="poster"
			class:hidden={ready}
			{src}
			{alt}
			width="393"
			height="852"
			loading="lazy"
			decoding="async"
		/>
		{#if load}
			<iframe
				bind:this={frame}
				class:ready
				src="{DEMO}?frame"
				title="VibeReel, the phone app, running on a copy of my library"
				style:transform="scale({scale})"
			></iframe>
		{/if}
		{#if small}
			<a class="open" href={DEMO} target="_blank" rel="noopener">
				<span class="visually-hidden">Open the VibeReel phone app demo</span>
			</a>
		{/if}
	</PhoneFrame>
	{#if ready && frame}
		<PhoneCursor {frame} />
	{/if}

	<Note go={drawn && !small} />
</div>

<style>
	/* The container the note is sized against */
	.live {
		position: relative;
		container-type: inline-size;
	}

	.poster {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: opacity 300ms;
	}

	.poster.hidden {
		opacity: 0;
	}

	iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 393px;
		height: 852px;
		border: 0;
		transform-origin: 0 0;
		opacity: 0;
		transition: opacity 300ms;
		pointer-events: none;
	}

	iframe.ready {
		opacity: 1;
		pointer-events: auto;
	}

	.open {
		position: absolute;
		inset: 0;
	}
</style>
