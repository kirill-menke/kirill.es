<script>
	import { prefersReducedMotion } from 'svelte/motion';
	import { byCode, flags, imageUrl } from '#lib/flags/index.js';
	import { wreath } from './wreath.js';

	// The circle of flags as a wreath three deep, turning slowly. The flags under the mouse grow;
	// a pinned flag grows too, with curves to its closest matches. What goes in the middle
	// (`children`) is up to the page.
	let {
		selected = null, // code of the pinned flag, or null
		onhover = () => {},
		onselect = () => {},
		size = $bindable(0), // width in px, 0 until measured (and while prerendering)
		children
	} = $props();

	const count = flags.length;
	const { places, mid } = wreath(count, 3);
	const LENS = 1.1; // extra scale right under the mouse
	const REACH = 6; // how far the magnifier reaches, % of the square
	const PIN = 1.7; // scale of the pinned flag
	const MATCH = 1.3; // and of its matches
	const SPIN = 2.5; // degrees per second

	// The middle: a square whose corners just reach the inner lane
	const hole = Math.min(...places.map((p) => Math.hypot(p.x - 50, p.y - 50) - p.size / 2));
	const inset = 50 - (hole * 1.14) / Math.SQRT2;

	const buttons = {}; // code -> button
	let pointer = $state(null); // { x, y } under the mouse, % of the square, before the turn
	let inside = $state(false); // the mouse is over the wreath, flags or middle
	let hovered = null; // last code sent to onhover
	let turn = $state(0); // degrees
	let tabStop = $derived(selected ?? flags[0].code);
	let matches = $derived(new Set(selected ? byCode[selected].matches.map(([code]) => code) : []));

	// The arrow keys move the selection (see the page); keyboard focus follows it around.
	$effect(() => {
		const button = selected && buttons[selected];
		if (button && Object.values(buttons).includes(document.activeElement)) button.focus();
	});

	// It turns while nobody is looking closer: not under the mouse, not with a flag pinned.
	$effect(() => {
		if (prefersReducedMotion.current) return;
		let last = performance.now();
		let frame = requestAnimationFrame(function tick(now) {
			// Read outside the effect's tracking: the loop keeps running, it just holds still.
			if (!inside && !selected) turn = (turn + ((now - last) / 1000) * SPIN) % 360;
			last = now;
			frame = requestAnimationFrame(tick);
		});
		return () => cancelAnimationFrame(frame);
	});

	// The point under the event in % of the square, turned back by the wreath's turn.
	function pointAt(event) {
		const box = event.currentTarget.getBoundingClientRect();
		const dx = ((event.clientX - box.left) / box.width) * 100 - 50;
		const dy = ((event.clientY - box.top) / box.height) * 100 - 50;
		const t = (-turn * Math.PI) / 180;
		return {
			x: 50 + dx * Math.cos(t) - dy * Math.sin(t),
			y: 50 + dx * Math.sin(t) + dy * Math.cos(t)
		};
	}

	// The flag nearest the point, if it is within `reach` badges of it.
	function nearest(point, reach) {
		let best = -1;
		let distance = Infinity;
		places.forEach((p, i) => {
			const d = Math.hypot(p.x - point.x, p.y - point.y);
			if (d < distance) [best, distance] = [i, d];
		});
		return distance < places[best].size * reach ? flags[best].code : null;
	}

	function hover(code) {
		if (code === hovered) return;
		hovered = code;
		onhover(code);
	}

	function onpointermove(event) {
		if (event.pointerType !== 'mouse') return;
		inside = true;
		// The middle's own controls (search results, buttons, links) are not flags.
		if (event.target.closest('.centre :is([role="listbox"], button, a)')) {
			pointer = null;
			return hover(null);
		}
		pointer = pointAt(event);
		hover(nearest(pointer, 1.1));
	}

	function onpointerleave() {
		inside = false;
		pointer = null;
		hover(null);
	}

	// On a phone each badge is a few pixels wide, too small to hit: a tap near one pins it.
	// Taps on a flag's own button, or on a control in the middle, are theirs.
	function onclick(event) {
		if (event.target.closest('button, input, a')) return;
		const code = nearest(pointAt(event), 2.5);
		if (code) onselect(code);
	}

	function scaleOf(i, code) {
		let scale = code === selected ? PIN : matches.has(code) ? MATCH : 1;
		if (pointer) {
			const d = Math.hypot(places[i].x - pointer.x, places[i].y - pointer.y);
			scale = Math.max(scale, 1 + LENS * Math.exp(-((d / REACH) ** 2)));
		}
		return scale;
	}

	// A curve from one flag to another that dips towards the centre: short petals for near matches.
	function curve(from, to) {
		const a = places[byCode[from].index];
		const b = places[byCode[to].index];
		const cx = 50 + ((a.x + b.x) / 2 - 50) * 0.55;
		const cy = 50 + ((a.y + b.y) / 2 - 50) * 0.55;
		return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
	}
</script>

<div
	class="wreath"
	bind:clientWidth={size}
	role="presentation"
	{onpointermove}
	{onpointerleave}
	{onclick}
>
	<div class="layer" style="transform: rotate({turn}deg)">
		<svg class="lines" viewBox="0 0 100 100" aria-hidden="true">
			<circle class="wire" cx="50" cy="50" r={mid} />
			{#if selected}
				{#each byCode[selected].matches as [code], m (selected + code)}
					<!-- Dashes can't also draw the line in, so a solid copy in a mask does -->
					<mask
						id="match-{code}"
						maskUnits="userSpaceOnUse"
						x="-10"
						y="-10"
						width="120"
						height="120"
					>
						<path
							class="reveal"
							d={curve(selected, code)}
							pathLength="1"
							style="animation-delay: {m * 70}ms"
						/>
					</mask>
					<path class="match" d={curve(selected, code)} mask="url(#match-{code})" />
				{/each}
			{/if}
		</svg>

		{#each flags as flag, i (flag.code)}
			{@const p = places[i]}
			{@const scale = scaleOf(i, flag.code)}
			<button
				class="flag"
				class:faded={selected &&
					pointer === null &&
					flag.code !== selected &&
					!matches.has(flag.code)}
				style="left: {p.x}%; top: {p.y}%; width: {p.size}%; z-index: {Math.round(
					scale * 10
				)};
					--angle: {p.angle}deg; --scale: {scale}; --i: {i}"
				aria-label={flag.name}
				aria-pressed={flag.code === selected}
				tabindex={flag.code === tabStop ? 0 : -1}
				bind:this={buttons[flag.code]}
				onclick={() => onselect(flag.code)}
				onfocus={() => hover(flag.code)}
				onblur={() => hover(null)}
			>
				<img src={imageUrl(flag.code)} alt="" decoding="async" draggable="false" />
			</button>
		{/each}
	</div>

	<div class="centre" style="inset: {inset}%">{@render children?.()}</div>
</div>

<style>
	.wreath {
		position: relative;
		width: min(100%, calc(100svh - 6rem));
		/* Stays readable on a short landscape screen, but never wider than its tile */
		min-width: min(100%, 18rem);
		aspect-ratio: 1;
		margin: 0 auto;
	}

	.layer,
	.lines {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.lines {
		overflow: visible;
		pointer-events: none;
	}

	.wire {
		fill: none;
		stroke: oklch(0.55 0.04 120);
		stroke-width: 0.35;
		stroke-dasharray: 0.2 0.9;
		stroke-linecap: round;
		opacity: 0.6;
	}

	.match {
		fill: none;
		stroke: var(--color-font-dark);
		stroke-width: 0.15;
		stroke-dasharray: 0.6 0.5;
		opacity: 0.55;
	}

	.reveal {
		fill: none;
		stroke: white;
		stroke-width: 1;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 0.6s ease-out forwards;
	}

	.flag {
		position: absolute;
		aspect-ratio: 1;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		transform: translate(-50%, -50%) rotate(var(--angle)) scale(var(--scale));
		transition:
			transform 0.2s ease-out,
			opacity 0.3s ease;
		animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
		animation-delay: calc(250ms + var(--i) * 5ms);
	}

	.flag img {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
		filter: var(--flag-outline);
		pointer-events: none;
	}

	.flag.faded {
		opacity: 0.25;
	}

	.flag:focus-visible {
		outline: 1px solid var(--color-font-dark);
		outline-offset: 1px;
		border-radius: 50%;
	}

	/* The text sits on a halo of the tile's colour (--halo), so the lines pass behind it */
	.centre {
		position: absolute;
		display: grid;
		place-items: center;
		container-type: size;
		text-shadow:
			0 0 2px var(--halo),
			0 0 2px var(--halo),
			0 0 3px var(--halo),
			0 0 4px var(--halo);
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) rotate(var(--angle)) scale(0);
		}
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.flag,
		.reveal {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
