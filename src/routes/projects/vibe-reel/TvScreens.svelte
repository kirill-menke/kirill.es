<script>
	/*
	 * "Feels native, runs on web tech": the TV app's four main screens as frames on a strip of
	 * 35 mm film drawn by hand in graphite (StripSketch), sprocket holes along both edges and edge
	 * print between them, and under the strip the caption of the frame in the gate, in one
	 * place: pulling the strip on to the next frame fades its caption in where the last one fades
	 * out. After the last screen comes an ending frame with no picture, only its border drawn and
	 * "More to come ..." in it. The strip's lead hangs into the page's margins, so the frames line
	 * up with the section's words. It scrolls sideways and snaps a frame to the left edge, the
	 * gate, where it is in full colour, each screen in turn, the last too: the strip ends with
	 * that in the gate and the ending frame beside it, which is no stop and has no caption. The
	 * film is cut in the frame line before the first frame and after the ending one, as far out
	 * as the page's narrowest margin, but on all but the widest pages the ending frame still runs
	 * on past the reel's edge at the end, so the film goes on out of sight, as its words say, and
	 * they sit in what shows of it. The others fade as they leave the gate. A note over the strip
	 * (PullNote) says to pull it: swipe it, drag it with the mouse, use the arrow keys once it
	 * has the focus, click or tap a frame to bring it into the gate, or the chevrons on its ends,
	 * each there only while the strip can go that way. The chevrons are in the pencil's hand,
	 * bare until pointed at or focused.
	 */
	import { tick } from 'svelte';
	import { scrollBehavior } from '#lib/motion.js';
	import Screen from './tv-screens/Screen.svelte';
	import PullNote from './tv-screens/PullNote.svelte';
	import StripSketch from './tv-screens/StripSketch.svelte';
	import { chevron } from './tv-screens/strip.js';
	import { screens } from './tv-screens/screens.js';

	// The chevrons on the strip's ends: the way each moves it, in frames
	const TURNS = [
		{ name: 'back', way: -1, label: 'Previous screen' },
		{ name: 'on', way: 1, label: 'Next screen' }
	];
	const chevrons = TURNS.map(({ way }) => chevron(way));

	// The fades at the reel's edges come in over this much of a scroll (px)
	const FADE = 24;

	let reel = $state();
	let track = $state();
	let frames = $state([]);
	let gates = $state([]);
	// The ending frame, after the last screen
	let ending = $state();
	// The chevrons' buttons, as TURNS
	let turns = $state([]);
	// Where the strip has got to, in frames: 0 with the first in the gate, 1.5 halfway from the
	// second to the third
	let pos = $state(0);
	// The frame in the gate, the nearest, whose caption shows; and the one before it, whose
	// caption is fading out. Only that one: pulled across several frames at once, the strip
	// drops any other caption at once rather than leave them fading out over each other.
	let current = $state(0);
	let leaving = $state(-1);
	// How much of the fade (0 to 1) each edge of the reel shows: the film runs on past it
	let behind = $state(0);
	let ahead = $state(1);
	// The strip as laid out, in px, for its drawing; unset until measured
	let size = $state();
	let dragging = $state(false);
	// A mouse drag in progress: where it started, and the frame then in the gate
	let drag = null;
	// Whether the mouse dragged the strip since it was last pressed, so that the click its
	// release may send pulls nothing
	let dragged = false;
	let settle = 0;
	$effect(() => () => clearTimeout(settle));

	// How far a frame is from the gate, in frames, up to 1
	const away = (i) => +Math.min(1, Math.abs(i - pos)).toFixed(3);

	// The scroll position with each frame in the gate (its stretch of film from the reel's left
	// edge), or the strip's end for a frame that cannot get there; and the one with the film's
	// own end at the reel's right edge (`tail`), past the strip's end on all but the widest
	// pages, where the ending frame runs on out of sight. Measured with the layout (the
	// ResizeObserver below), so a scroll only reads scrollLeft.
	let x = [];
	let end = 0;
	let tail = 0;
	function measureStops() {
		end = reel.scrollWidth - reel.clientWidth;
		tail = ending.offsetLeft + ending.offsetWidth + frames[0].offsetLeft - reel.clientWidth;
		x = frames.map((frame) => Math.min(frame.offsetLeft - frames[0].offsetLeft, end));
	}

	function locate() {
		const left = reel.scrollLeft;
		let i = 0;
		while (i < x.length - 1 && x[i + 1] > x[i] && left >= x[i + 1]) i++;
		const span = (x[i + 1] ?? x[i]) - x[i];
		pos = span > 0 ? i + Math.min(1, Math.max(0, left - x[i]) / span) : i;
		if (Math.round(pos) !== current) {
			leaving = current;
			current = Math.round(pos);
		}
		behind = Math.min(1, left / FADE);
		ahead = Math.min(1, Math.max(0, tail - left) / FADE);
	}

	// At most once a frame, however many scroll events arrive in it
	let queued = 0;
	function onscroll() {
		if (!queued) queued = requestAnimationFrame(() => ((queued = 0), locate()));
	}
	$effect(() => () => cancelAnimationFrame(queued));

	// Measured again whenever the page, the frames or the spacing change size
	$effect(() => {
		const observer = new ResizeObserver(() => {
			const [first, second] = frames;
			const height = gates[0].offsetHeight;
			if (second && height)
				size = {
					// From cut to cut: the leads, the screens' frames and the ending one
					width: ending.offsetLeft + ending.offsetWidth + first.offsetLeft,
					height,
					frame: first.offsetWidth,
					pitch: second.offsetLeft - first.offsetLeft,
					lead: first.offsetLeft,
					inset: parseFloat(getComputedStyle(gates[0]).paddingTop)
				};
			measureStops();
			locate();
		});
		observer.observe(reel);
		observer.observe(track);
		observer.observe(gates[0]);
		return () => observer.disconnect();
	});

	function show(i) {
		reel.scrollTo({
			left: x[Math.max(0, Math.min(x.length - 1, i))],
			behavior: scrollBehavior()
		});
	}

	// Whether the strip can go that way from the frame in the gate
	const can = (way) => (way < 0 ? current > 0 : current < screens.length - 1);

	// A chevron that goes while it has the focus (the strip has run to that end) hands it to the
	// other one, or failing that to the reel, rather than let it drop to the page
	$effect.pre(() => {
		const going = turns.find((button, w) => button && !can(TURNS[w].way));
		if (going && going === document.activeElement) {
			const other = turns.find((button) => button !== going);
			tick().then(() => (other.inert ? reel : other).focus({ preventScroll: true }));
		}
	});

	// The mouse is only captured once it drags: until then a press can still be a click, which
	// goes to the frame under it
	function onpointerdown(event) {
		dragged = false;
		if (event.pointerType !== 'mouse' || event.button !== 0) return;
		drag = { x: event.clientX, left: reel.scrollLeft, from: current, moved: false };
	}

	function onpointermove(event) {
		if (!drag) return;
		// Let go off the strip before it moved: no drag after all
		if (!(event.buttons & 1)) {
			drag = null;
			return;
		}
		const dx = event.clientX - drag.x;
		if (!drag.moved) {
			if (Math.abs(dx) < 4) return;
			// A drag, not a click: from here on the strip follows the mouse wherever it goes
			drag.moved = dragged = true;
			reel.setPointerCapture(event.pointerId);
		}
		// Snapping would fight the hand, so it is off until the strip has settled
		clearTimeout(settle);
		dragging = true;
		reel.scrollLeft = drag.left - dx;
	}

	function onpointerup(event) {
		if (!drag) return;
		const { x, from, moved } = drag;
		drag = null;
		if (!moved) return;
		// A pull of a sixth of a frame moves on a frame, as a flick would; a longer one goes to
		// the frame then nearest the gate
		locate();
		const pulled = (x - event.clientX) / frames[0].offsetWidth;
		show(current === from && Math.abs(pulled) >= 1 / 6 ? from + Math.sign(pulled) : current);
		settle = window.setTimeout(() => (dragging = false), 700);
	}

	// A click or a tap on a frame out of the gate pulls the strip to it; a drag or a swipe
	// sends none (a swipe is the browser's own scroll), and the gate's frame and the ending
	// one stay put
	function onclick(event) {
		if (dragged) return;
		const i = frames.indexOf(event.target.closest('.frame'));
		if (i >= 0 && i !== current) show(i);
	}
</script>

<div class="filmstrip">
	<PullNote />

	<!-- The reel and the chevrons on its ends, centred on its frames -->
	<div class="stage">
		<!-- A scrolling region with nothing focusable in it takes the focus itself, so that the
		     arrow keys can scroll it. A click on a frame only does with the pointer what the keys
		     and the chevrons do. -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_click_events_have_key_events,
		     a11y_no_noninteractive_element_interactions -->
		<div
			class="reel"
			class:dragging
			bind:this={reel}
			tabindex="0"
			role="region"
			aria-label="The TV app’s screens on a film strip"
			style:--behind={behind}
			style:--ahead={ahead}
			{onscroll}
			{onpointerdown}
			{onpointermove}
			{onpointerup}
			onpointercancel={onpointerup}
			ondragstart={(event) => event.preventDefault()}
			{onclick}
		>
			<ol
				class="track"
				bind:this={track}
				style:--screens={screens.length}
				style:--count={screens.length + 1}
			>
				<!-- The whole strip's drawing, behind every frame. Not inside a frame: the frames'
				     custom properties change on every scrolled frame, and each change would
				     restyle all of its thousands of lines. -->
				<li class="drawing" aria-hidden="true">
					<StripSketch count={screens.length + 1} {size} />
				</li>
				{#each screens as s, i (s.title)}
					<li
						class="frame"
						class:out={i !== current}
						bind:this={frames[i]}
						style:--col={i + 1}
						style:--away={away(i)}
					>
						<div class="gate" bind:this={gates[i]}>
							<span class="edge top" aria-hidden="true"
								>VIBEREEL <b>▸</b> {i + 1}</span
							>
							<Screen src={s.src} alt={s.alt} />
							<span class="edge bottom" aria-hidden="true"
								>{i + 1}A <b>◂</b> 2160p</span
							>
						</div>
					</li>
				{/each}
				<!-- The ending frame: the border of one more, empty, and a promise -->
				<li class="ending" bind:this={ending} style:--col={screens.length + 1}>
					<span class="edge top" aria-hidden="true"
						>VIBEREEL <b>▸</b> {screens.length + 1}</span
					>
					<span class="more">More to come&nbsp;...</span>
					<span class="edge bottom" aria-hidden="true"
						>{screens.length + 1}A <b>◂</b> 2160p</span
					>
				</li>
			</ol>
		</div>

		{#each TURNS as { name, way, label }, w (name)}
			<button
				class="turn {name}"
				bind:this={turns[w]}
				aria-label={label}
				inert={!can(way)}
				style:--way={way}
				onclick={() => show(current + way)}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					{#each chevrons[w] as stroke, i (i)}
						<path class={stroke.kind} d={stroke.d} />
					{/each}
				</svg>
			</button>
		{/each}
	</div>

	<!-- All the captions in one place, so the tallest holds the room for each -->
	<div class="captions">
		{#each screens as s, i (s.title)}
			<div class="caption" class:shown={i === current} class:leaving={i === leaving}>
				<!-- Its number, and of how many, so that it says how much film there is to pull -->
				<span class="count" aria-hidden="true">0{i + 1}&nbsp;/&nbsp;0{screens.length}</span>
				<strong>{s.title}</strong>
				<span class="text">{s.text}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.filmstrip {
		container-type: inline-size;
	}

	/* A frame takes most of the strip, and the captions under it as much */
	.stage,
	.captions {
		--frame: min(60cqw, 46rem);
	}

	@container (max-width: 40rem) {
		.stage,
		.captions {
			--frame: 76cqw;
		}
	}

	.stage {
		position: relative;
	}

	/* The reel reaches into the page's margins by the film's lead, as far as the narrowest
	   margin goes (1.25rem), and its edges fade where the film runs on past them (--behind,
	   --ahead). Its view timeline draws the strip on. */
	.reel {
		--gap: 3.125rem;
		--lead: 1.25rem;
		position: relative;
		margin: 0 calc(var(--lead) * -1);
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		mask-image: linear-gradient(
			90deg,
			transparent,
			#000 calc(var(--behind) * var(--lead)),
			#000 calc(100% - var(--ahead) * 5%),
			transparent
		);
		view-timeline: --strip block;
		cursor: grab;
		outline: none;
	}

	.reel::-webkit-scrollbar {
		display: none;
	}

	.reel.dragging {
		scroll-snap-type: none;
		cursor: grabbing;
		user-select: none;
	}

	/* A click brings a frame out of the gate into it */
	.reel:not(.dragging) .frame.out {
		cursor: pointer;
	}

	/* The frames, a lead in from each end of the film, the ending frame's too. The track is
	   longer than the reel by as much as the last screen's stretch of film is from the first's,
	   so that the strip scrolls until the last screen is in the gate. What runs on past that (on
	   all but the widest pages part of the ending frame) is cut off there and adds no scroll. */
	.track {
		position: relative;
		display: grid;
		grid-template-columns: repeat(var(--count), var(--frame));
		column-gap: var(--gap);
		width: calc(100% + (var(--screens) - 1) * (var(--frame) + var(--gap)) - 2 * var(--lead));
		margin: 0;
		padding: 0 var(--lead);
		overflow: clip;
		list-style: none;
	}

	/* The film's band behind the frames' row, from end to end, its ends torn and its corners
	   bitten off as strip.js draws them (BITE: 14 in at the top, 12 at the bottom). Bare, it
	   only shows the reel's focus ring. */
	.track::before {
		content: '';
		grid-row: 1;
		grid-column: 1 / -1;
		margin: 0 calc(var(--lead) * -1);
		clip-path: polygon(
			14px 0,
			calc(100% - 14px) 0,
			calc(100% - 9px) 5px,
			calc(100% - 3px) 8px,
			calc(100% - 5px) 13px,
			100% 18px,
			calc(100% - 2px) 35%,
			100% 52%,
			calc(100% - 3px) 71%,
			100% calc(100% - 15px),
			calc(100% - 10px) calc(100% - 9px),
			calc(100% - 7px) calc(100% - 5px),
			calc(100% - 12px) 100%,
			12px 100%,
			7px calc(100% - 5px),
			10px calc(100% - 9px),
			0 calc(100% - 15px),
			3px 68%,
			0 49%,
			2px 31%,
			0 18px,
			5px 13px,
			3px 8px,
			9px 5px
		);
	}

	.reel:focus-visible .track::before {
		box-shadow: inset 0 0 0 2px var(--vr-gold-fill);
	}

	/* Snapped with its stretch of film from the reel's left edge */
	.frame {
		position: relative;
		grid-column: var(--col);
		grid-row: 1;
		scroll-snap-align: start;
		scroll-margin-inline-start: var(--lead);
	}

	/* The ending frame is no stop: not snapped */
	.ending {
		position: relative;
		grid-column: var(--col);
		grid-row: 1;
	}

	/* Wider than the section lets its list items be (70ch) */
	.track > :is(.frame, .ending, .drawing) {
		max-width: none;
	}

	/* "More to come ..." in the notes' italic, in graphite. It sits in the middle of what shows
	   of the ending frame once the strip has run to its end (--seen): from the frame's left edge,
	   a frame and a gap past the gate, to the reel's right edge short of its fade (5% of the
	   reel), or the whole frame on the widest pages. On a narrow strip that is a sliver, so
	   there it runs up beside the frame's edge. */
	.more {
		--seen: calc(
			100cqw + var(--lead) - var(--frame) - var(--gap) - 0.05 * (100cqw + 2 * var(--lead))
		);
		position: absolute;
		top: 50%;
		left: calc(min(100%, var(--seen)) / 2);
		translate: -50% -50%;
		font: italic 1.3rem/1.2 var(--font-secondary);
		white-space: nowrap;
		color: var(--vr-muted);
	}

	@container (max-width: 40rem) {
		.more {
			rotate: -90deg;
			font-size: 1.05rem;
		}
	}

	/* Lettered as the pencil reaches it */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.more {
				animation: write linear both;
				animation-timeline: --strip;
				animation-range: cover 28% cover 34%;
			}
		}
	}

	@keyframes write {
		from {
			opacity: 0;
		}
	}

	/* The strip's drawing, over the whole strip (the track) from the first frame's row: placed
	   in the first frame's cell of that row, and run on from there over every frame */
	.drawing {
		position: absolute;
		grid-row: 1 / 2;
		grid-column: 1 / 2;
		inset: 0 auto 0 calc(var(--lead) * -1);
		width: calc(var(--count) * (var(--frame) + var(--gap)) + 2 * var(--lead) - var(--gap));
		pointer-events: none;
	}

	/* The frame in the gate is in full colour; the rest fade, greying, as they leave it, as far
	   off as the next frame along */
	.gate {
		position: relative;
		padding: 2.25rem 0;
		filter: grayscale(calc(0.8 * var(--away)));
		opacity: calc(1 - 0.5 * var(--away));
	}

	/* Edge print, as on a film's edge, in the pencil's grey */
	.edge {
		position: absolute;
		font: 600 0.56rem/1 var(--font-mono);
		letter-spacing: 0.2em;
		color: color-mix(in srgb, var(--vr-muted) 75%, transparent);
		white-space: nowrap;
	}

	.edge b {
		font-weight: 400;
	}

	.edge.top {
		top: 1.5rem;
		left: 0.2rem;
	}

	.edge.bottom {
		bottom: 1.5rem;
		right: 0.2rem;
	}

	/* The captions on top of each other in one cell, so the tallest sets its height and nothing
	   moves. The frame in the gate has its caption shown; as the strip is pulled on to the next
	   frame, the one going fades out, a little quicker, where the one coming fades in, so the
	   two only briefly overlap. The others are hidden at once, however far the strip is pulled
	   in one go. With reduced motion they simply swap. */
	.captions {
		display: grid;
		max-width: var(--frame);
		padding: 1rem 0.2rem 0 0;
	}

	.caption {
		grid-area: 1 / 1;
		display: grid;
		align-content: start;
		gap: 0.3rem;
		opacity: 0;
		pointer-events: none;
		user-select: none;
	}

	.caption.shown {
		opacity: 1;
		pointer-events: auto;
		user-select: auto;
	}

	@media (prefers-reduced-motion: no-preference) {
		.caption.shown {
			transition: opacity 320ms var(--ease-cubic-out);
		}

		.caption.leaving {
			transition: opacity 240ms var(--ease-cubic-out);
		}
	}

	/* The number on a stroke of highlighter in the sketchbook's wash */
	.count {
		justify-self: start;
		margin-left: -0.3em;
		padding: 0.1em 0.18em 0.05em 0.3em;
		font: 0.72rem var(--font-mono);
		letter-spacing: 0.12em;
		color: var(--vr-gold-ink);
		background: var(--vr-wash);
		border-radius: 0.2em 0.45em 0.35em 0.25em;
	}

	.caption strong {
		font-family: var(--font-secondary);
		font-weight: 400;
		font-size: 1.35rem;
		line-height: 1.2;
		color: var(--color-font-dark);
	}

	.text {
		font-size: 0.92rem;
		line-height: 1.55;
		color: var(--vr-muted);
		max-width: 48ch;
	}

	/* The chevrons, each centred on an end of the strip and on its frames, drawn in its pencil
	   (strip.js) and bare, kept clear over the pictures by a faint halo of the paper along the
	   line. Lit (--lit), pointed at or focused, a soft disc of the sketchbook's gold wash fades
	   in behind it and the pencil bears down: a darker, heavier line. Each is there only while
	   the strip can go its way; otherwise it fades out and is inert, neither focusable nor
	   clickable. */
	.turn {
		--halo: color-mix(in srgb, var(--vr-page) 90%, transparent);
		position: absolute;
		top: 50%;
		width: 2.75rem;
		height: 2.75rem;
		margin: -1.375rem;
		padding: 0.5rem;
		border: 0;
		border-radius: 50%;
		background: none;
		color: color-mix(in srgb, var(--vr-ink) calc(var(--lit, 0) * 100%), var(--vr-muted));
		cursor: pointer;
		appearance: none;
		-webkit-tap-highlight-color: transparent;
	}

	.turn::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: radial-gradient(closest-side, var(--vr-wash) 55%, transparent);
		opacity: var(--lit, 0);
	}

	.turn.back {
		left: 0;
	}

	.turn.on {
		right: 0;
	}

	/* Lit from the keyboard, in the gold ink ringed in paper, so that it shows on the paper and
	   on a picture alike; and by the mouse, though not on a touch screen, where a tapped
	   chevron would stay lit */
	.turn:focus-visible {
		--lit: 1;
		outline: 2px solid var(--vr-gold-ink);
		outline-offset: 2px;
		box-shadow: 0 0 0 2px var(--vr-page);
	}

	@media (hover: hover) {
		.turn:hover {
			--lit: 1;
		}
	}

	.turn[inert] {
		opacity: 0;
		pointer-events: none;
	}

	/* Over the disc */
	.turn svg {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		filter: drop-shadow(0 0 1px var(--halo)) drop-shadow(0 0 2px var(--halo));
	}

	.turn .line {
		stroke-width: calc(1.8px + 0.4px * var(--lit, 0));
	}

	.turn .again {
		stroke-width: 1px;
		opacity: 0.5;
	}

	/* The disc and the pen quickly, and pointed at, the chevron nudged the way it goes */
	@media (prefers-reduced-motion: no-preference) {
		.turn {
			transition:
				opacity 200ms ease,
				color 120ms ease;
		}

		.turn::before {
			transition: opacity 120ms ease;
		}

		.turn .line {
			transition: stroke-width 120ms ease;
		}

		.turn svg {
			transition: translate 150ms var(--ease-cubic-out);
		}
	}

	@media (hover: hover) and (prefers-reduced-motion: no-preference) {
		.turn:hover svg {
			translate: calc(var(--way) * 2px) 0;
		}
	}
</style>
