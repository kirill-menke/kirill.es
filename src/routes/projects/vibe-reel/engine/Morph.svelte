<script>
	/*
	 * "Shape-shifter": one playback screen that turns into each of the three apps' devices: an
	 * iPhone, a TV, a browser window. The frame stretches from one shape to the next while the
	 * picture cross-fades. The iPhone is the live one (../LivePhone.svelte: the real phone app,
	 * its "try it out" note beside it): the frame shrinks onto the phone's screen (measured)
	 * and the phone fades in over it; for the TV and the browser it fades out again, the app
	 * running on behind it, so it never reloads.
	 *
	 * The TV is the hero's sketched set (#lib/components/sketch/TvSketch) and the browser is
	 * drawn in the same hand (BrowserSketch): the frame becomes the drawing's screen, and the
	 * set draws itself round it as it arrives.
	 *
	 * Hovering a name, focusing it from the keyboard, or clicking or tapping it picks that
	 * device for good, and a change picked so runs 1.5 times as fast as one it makes by itself,
	 * a drawn set's lines and all. Until a device is picked, and while on screen, it moves on by
	 * itself every few seconds, unless the pointer rests on the stage; but once the live app is
	 * up it rests on the iPhone and stays there, so that the phone is never taken from under a
	 * finger trying it (a tap gives no hover to pause it). Under prefers-reduced-motion it never
	 * moves on by itself, and every change is instant.
	 *
	 * Beside it is the paragraph about the device on show, the other two hidden in its place,
	 * so that the column keeps its height as they cross-fade.
	 */
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from '#lib/motion.js';
	import LivePhone from '../LivePhone.svelte';
	import TvSketch, { PLACE as TV_PLACE } from '#lib/components/sketch/TvSketch.svelte';
	import WebClient from './WebClient.svelte';
	import BrowserSketch, { PLACE as WEB_PLACE } from './BrowserSketch.svelte';
	import { copy, shots } from './shared.js';

	const DEVICES = [
		{ key: 'phone', name: 'iPhone', sub: 'home-screen PWA', copy: copy.iphone },
		{ key: 'tv', name: 'TV', sub: 'webOS', copy: copy.tv },
		{ key: 'web', name: 'Browser', sub: 'Chrome · Firefox', copy: copy.web }
	];
	// How much faster a change the visitor asks for runs than one it makes by itself
	const QUICK = 1.5;

	/* A drawn set `width` of the stage's 100 wide and centred in it, and the screen its drawing
	   places (`place`: TvSketch's or BrowserSketch's), which the frame lands on; all in the
	   stage's units, as the frame's shapes are */
	function drawn(place, width) {
		const k = width / 100;
		const bottom = (94 - place.height * k) / 2;
		return {
			width,
			bottom,
			screen: {
				x: 50 - width / 2 + (place.x + place.w / 2) * k,
				w: place.w * k,
				h: place.h * k,
				r: place.r * k,
				lift: bottom + (place.height - place.y - place.h) * k
			}
		};
	}
	const SETS = { tv: drawn(TV_PLACE, 100), web: drawn(WEB_PLACE, 94) };
	// The frame's iPhone shape until the live phone's screen is measured
	const PHONE = { x: 33.5, w: 37.8, h: 82, r: 4.3, lift: 6 };

	let turn = $state(0);
	// Whether the visitor has picked a device; from then on it only changes when asked
	let picked = $state(false);
	let seen = $state(false);
	let stage = $state();
	let running = $state(false);
	let screen = $state();
	// The live phone's screen in the stage's units, which the frame's iPhone shape ends on
	let fit = $state();
	const shown = $derived(DEVICES[turn].key);
	const quick = $derived(picked ? QUICK : 1);
	// The shape the frame moves to: the live phone's screen, or a drawn set's
	const target = $derived(shown === 'phone' ? (fit ?? PHONE) : SETS[shown].screen);

	// The mouse over a name, the keyboard's focus on it, a click or a tap pick its device, for
	// good. A finger landing on a name (to scroll, maybe) picks nothing, and neither does the
	// focus a click gives: the click does.
	function pick(i) {
		turn = i;
		picked = true;
	}
	const hovered = (i) => (e) => {
		if (e.pointerType === 'mouse') pick(i);
	};
	const focused = (i) => (e) => {
		if (e.currentTarget.matches(':focus-visible')) pick(i);
	};

	// A drawn set draws itself (its CSS animations: TvSketchPen's lines, the TV's nameplate and
	// stripes, the browser's address) at the pace of the change that brings it
	function paced(set) {
		for (const a of set.getAnimations({ subtree: true }))
			if (a instanceof CSSAnimation) a.playbackRate = quick;
	}

	// The next device every few seconds until one is picked, unless the pointer rests on the
	// stage or the live app is up on the iPhone
	$effect(() => {
		if (prefersReducedMotion.current || picked || !seen) return;
		if (running && shown === 'phone') return;
		const id = setInterval(() => {
			if (!stage.matches(':hover')) turn = (turn + 1) % DEVICES.length;
		}, 3400);
		return () => clearInterval(id);
	});

	// Measured again whenever the stage or the phone's screen changes size
	$effect(() => {
		if (!screen) return;
		const measure = () => {
			const s = stage.getBoundingClientRect();
			const r = screen.getBoundingClientRect();
			const u = s.width / 100;
			fit = {
				x: (r.left + r.width / 2 - s.left) / u,
				w: r.width / u,
				h: r.height / u,
				r: parseFloat(getComputedStyle(screen).borderTopRightRadius) / u,
				lift: (s.bottom - r.bottom) / u
			};
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(stage);
		ro.observe(screen);
		return () => ro.disconnect();
	});

	onMount(() => {
		const io = new IntersectionObserver(([e]) => (seen = e.isIntersecting), {
			threshold: 0.3
		});
		io.observe(stage);
		return () => io.disconnect();
	});
</script>

<div class="morph" style:--quick={quick}>
	<div class="layout">
		<div class="picker" role="group" aria-label="Show the player on">
			{#each DEVICES as d, i (d.key)}
				<button
					class="pick"
					class:on={shown === d.key}
					aria-pressed={shown === d.key}
					onpointerenter={hovered(i)}
					onfocus={focused(i)}
					onclick={() => pick(i)}
				>
					<span class="name">{d.name}</span>
					<span class="sub">{d.sub}</span>
				</button>
			{/each}
		</div>

		<div class="stage" bind:this={stage}>
			{#if shown === 'tv'}
				<div
					class="set"
					style:--set-w={SETS.tv.width}
					style:--set-bottom={SETS.tv.bottom}
					in:fade={{ duration: 250 / quick }}
					out:fade={{ duration: 200 / quick }}
					{@attach paced}
				>
					<TvSketch />
					<div class="glass"></div>
				</div>
			{:else if shown === 'web'}
				<div
					class="set"
					style:--set-w={SETS.web.width}
					style:--set-bottom={SETS.web.bottom}
					in:fade={{ duration: 250 / quick }}
					out:fade={{ duration: 200 / quick }}
					{@attach paced}
				>
					<BrowserSketch />
					<div class="glass"></div>
				</div>
			{/if}
			<div
				class="frame"
				data-shape={shown}
				style:--x={target.x}
				style:--w={target.w}
				style:--h={target.h}
				style:--r={target.r}
				style:--lift={target.lift}
			>
				<img
					class="layer"
					class:on={shown === 'tv'}
					src={shots.tv.src}
					alt={shots.tv.alt}
					width="1280"
					height="720"
					loading="lazy"
					decoding="async"
				/>
				<div class="layer" class:on={shown === 'web'}>
					<WebClient />
				</div>
			</div>
			<div class="phone" class:on={shown === 'phone'} inert={shown !== 'phone'}>
				<LivePhone
					src={shots.demo.src}
					alt={shots.demo.alt}
					shown={shown === 'phone'}
					bind:running
					bind:screen
				/>
			</div>
		</div>

		<div class="text">
			{#each DEVICES as d (d.key)}
				<p class:on={shown === d.key} aria-hidden={shown !== d.key}>
					<strong>{d.copy.lead}</strong>
					{d.copy.rest}
				</p>
			{/each}
		</div>
	</div>
</div>

<style>
	.morph {
		container: morph / inline-size;
		/* A little past the target and back, like something elastic */
		--stretch: cubic-bezier(0.34, 1.25, 0.64, 1);
		/* How long a change takes: one the visitor asks for is --quick times as fast */
		--t: calc(750ms / var(--quick));
	}

	.layout {
		display: grid;
		grid-template-areas: 'picker' 'stage' 'text';
		gap: 1.5rem;
	}

	/* Beside the stage, the names and the paragraphs are centred on its height */
	@container morph (width >= 860px) {
		.layout {
			grid-template-areas: 'stage .' 'stage picker' 'stage text' 'stage .';
			grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
			grid-template-rows: 1fr auto auto 1fr;
			gap: 1.75rem 3rem;
			align-items: start;
		}
	}

	/* In a narrow row (a window under 1280px wide) the stage takes more of it, so that the live
	   phone stays close to its full size */
	@container morph (860px <= width < 1100px) {
		.layout {
			grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		}
	}

	.picker {
		grid-area: picker;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.75rem;
	}

	/* The devices not on show in the grey of the running text, so that they read as things to
	   pick; the one on show, or pointed at, in ink */
	.pick {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 0.2rem 0;
		border: 0;
		background: none;
		font: inherit;
		text-align: left;
		cursor: pointer;
		color: var(--vr-muted);
		transition: color 200ms;
	}

	.pick:hover,
	.pick.on {
		color: var(--color-font-dark);
	}

	.pick:focus-visible {
		outline: 2px solid var(--vr-gold);
		outline-offset: 4px;
		border-radius: 0.25rem;
	}

	.name {
		position: relative;
		isolation: isolate;
		font-family: var(--font-secondary);
		font-style: italic;
		font-size: 1.45rem;
		line-height: 1.1;
	}

	/* The name on show highlighted as the sketchbook would: a band of its gold (--vr-wash)
	   behind the lower part of the letters, a little crooked, swept on from the left */
	.name::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: auto -0.2em 0.06em -0.12em;
		height: 0.55em;
		border-radius: 0.1em 0.3em 0.18em 0.35em / 0.25em;
		background: var(--vr-wash);
		rotate: -1.5deg;
		clip-path: inset(0 100% 0 0);
		transition: clip-path calc(450ms / var(--quick)) ease-out;
	}

	.on .name::before {
		clip-path: inset(0);
	}

	/* The small print of a device not on show a step lighter than its name */
	.sub {
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--vr-muted);
	}

	.pick:not(.on) .sub {
		color: color-mix(in srgb, var(--vr-muted) 62%, transparent);
	}

	/* The stage is as tall as the live phone needs (94 of its 100 wide), so that every shape
	   keeps the same height on the page; the drawn TV and browser are centred in it. The stage
	   is held to a TV of a sensible size and centred in its column. */
	.stage {
		grid-area: stage;
		container-type: inline-size;
		position: relative;
		justify-self: center;
		width: 100%;
		max-width: 46rem;
		aspect-ratio: 100 / 94;
	}

	/* The frame is only a screen: the drawn set's lines are round it, and the live phone's own
	   bezel. Its shape (`target`) sets its middle, size, corner and how high its bottom
	   stands, all in the stage's units. */
	.frame {
		position: absolute;
		left: calc(var(--x) * 1cqw);
		bottom: calc(var(--lift) * 1cqw);
		translate: -50% 0;
		width: calc(var(--w) * 1cqw);
		height: calc(var(--h) * 1cqw);
		overflow: hidden;
		border-radius: calc(var(--r) * 1cqw);
		background: var(--color-device-screen);
		transition-property: left, width, height, border-radius, bottom, opacity;
		transition-duration: var(--t), var(--t), var(--t), var(--t), var(--t), 0s;
		transition-timing-function: var(--stretch);
	}

	/* Once on the live phone's screen, the frame gives way to the phone over it */
	.frame[data-shape='phone'] {
		opacity: 0;
		transition-delay: 0s, 0s, 0s, 0s, 0s, var(--t);
	}

	/* A drawn set, under the frame, round the screen the frame lands on: its stand-in for that
	   screen (.glass, which the drawing places) gives the set its height. It is only a
	   drawing, so the pointer goes through it to the stage and the phone. */
	.set {
		position: absolute;
		left: 50%;
		bottom: calc(var(--set-bottom) * 1cqw);
		width: calc(var(--set-w) * 1cqw);
		translate: -50% 0;
		container-type: inline-size;
		pointer-events: none;
	}

	.set .glass {
		aspect-ratio: 16 / 9;
	}

	.layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity calc(var(--t) * 0.55) ease;
	}

	img.layer {
		object-fit: cover;
	}

	.layer.on {
		opacity: 1;
	}

	/* The live phone, standing where the frame's iPhone shape ends: left of the middle, with
	   room for its note on the right, and centred in the stage's height. It fades in over the
	   frame as that arrives, and out as soon as the frame sets off again. */
	.phone {
		position: absolute;
		left: 12cqw;
		top: 50%;
		width: 43cqw;
		translate: 0 -50%;
		opacity: 0;
		transition: opacity calc(var(--t) * 0.4) ease;
	}

	.phone.on {
		opacity: 1;
		transition-duration: calc(var(--t) * 0.5);
		transition-delay: calc(var(--t) * 0.45);
	}

	/* All three paragraphs in one place, so that the column is always as tall as the longest:
	   the one about the device on show fades in as the last one fades out (hidden once out) */
	.text {
		grid-area: text;
		display: grid;
	}

	.text p {
		grid-area: 1 / 1;
		margin: 0;
		opacity: 0;
		visibility: hidden;
		transition-property: opacity, visibility;
		transition-duration: calc(var(--t) * 0.3);
		transition-timing-function: ease-in;
	}

	.text p.on {
		opacity: 1;
		visibility: visible;
		transition-duration: calc(var(--t) * 0.45), 0s;
		transition-delay: calc(var(--t) * 0.25), 0s;
		transition-timing-function: ease-out;
	}

	@media (prefers-reduced-motion: reduce) {
		.frame,
		.layer,
		.phone,
		.name::before,
		.text p {
			transition: none;
		}
	}
</style>
