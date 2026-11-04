<script>
	import { flags, byCode, imageUrl } from '#lib/flags/index.js';

	// selected: code of the pinned flag (its closest matches get curves), or null.
	let {
		selected = null,
		onhover = () => {},
		onselect = () => {},
		size = $bindable(0),
		children
	} = $props();

	const count = flags.length;
	const RADIUS = 45.5; // % of the square, ring centre line
	const WIDTH = ((2 * Math.PI * RADIUS) / count) * 0.95; // % of the square, along the ring
	const LENS = 3.4; // extra scale right under the mouse
	const LENS_SPREAD = 2.6; // flags either side that grow with it

	// Flags stand on the ring with their top edge facing outward, first one at 12 o'clock.
	const placed = flags.map((flag) => {
		const angle = -90 + (flag.index * 360) / count;
		const rad = (angle * Math.PI) / 180;
		return { flag, angle, x: 50 + RADIUS * Math.cos(rad), y: 50 + RADIUS * Math.sin(rad) };
	});
	const position = Object.fromEntries(placed.map((p) => [p.flag.code, p]));

	let pointer = $state(null); // fractional place in the circle under the mouse
	let matches = $derived(new Set(selected ? byCode[selected].matches.map(([code]) => code) : []));

	function onpointermove(event) {
		if (event.pointerType !== 'mouse') return;
		const box = event.currentTarget.getBoundingClientRect();
		const dx = event.clientX - box.left - box.width / 2;
		const dy = event.clientY - box.top - box.height / 2;
		const distance = (Math.hypot(dx, dy) / box.width) * 100;
		if (distance < RADIUS - 8 || distance > RADIUS + 5) {
			leave();
			return;
		}
		const turn = ((Math.atan2(dy, dx) * 180) / Math.PI + 450) % 360; // 0 at 12 o'clock
		pointer = (turn / 360) * count;
		onhover(flags[Math.round(pointer) % count].code);
	}

	function leave() {
		if (pointer === null) return;
		pointer = null;
		onhover(null);
	}

	function scaleOf(flag) {
		let scale = flag.code === selected ? 2.4 : matches.has(flag.code) ? 1.6 : 1;
		if (pointer !== null) {
			const d = Math.abs(flag.index - pointer);
			const lens = 1 + LENS * Math.exp(-((Math.min(d, count - d) / LENS_SPREAD) ** 2));
			scale = Math.max(scale, lens);
		}
		return scale;
	}

	// A curve from one flag to another that dips towards the centre: short petals for near matches.
	function chord(from, to) {
		const a = position[from];
		const b = position[to];
		const cx = 50 + ((a.x + b.x) / 2 - 50) * 0.55;
		const cy = 50 + ((a.y + b.y) / 2 - 50) * 0.55;
		return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
	}
</script>

<div
	class="ring"
	bind:clientWidth={size}
	role="presentation"
	{onpointermove}
	onpointerleave={leave}
>
	<svg class="chords" viewBox="0 0 100 100" aria-hidden="true">
		{#if selected}
			{#each byCode[selected].matches as [code], m (selected + code)}
				<path
					d={chord(selected, code)}
					pathLength="1"
					style="animation-delay: {m * 70}ms"
				/>
			{/each}
		{/if}
	</svg>

	{#each placed as { flag, angle, x, y } (flag.code)}
		{@const scale = scaleOf(flag)}
		<button
			class="flag"
			class:faded={selected &&
				pointer === null &&
				flag.code !== selected &&
				!matches.has(flag.code)}
			style="left: {x}%; top: {y}%; width: {WIDTH}%; z-index: {Math.round(scale * 10)};
				--angle: {angle + 90}deg; --scale: {scale}; --i: {flag.index}"
			aria-label={flag.name}
			aria-pressed={flag.code === selected}
			onclick={() => onselect(flag.code)}
			onfocus={() => onhover(flag.code)}
			onblur={() => onhover(null)}
		>
			<img src={imageUrl(flag.code)} alt="" decoding="async" draggable="false" />
		</button>
	{/each}

	<div class="centre">{@render children?.()}</div>
</div>

<style>
	.ring {
		position: relative;
		width: min(100%, calc(100svh - 6rem));
		min-width: 18rem;
		aspect-ratio: 1;
		margin: 0 auto;
	}

	.chords {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.chords path {
		fill: none;
		stroke: var(--color-font-dark);
		stroke-width: 0.16;
		stroke-linecap: round;
		opacity: 0.5;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 0.6s ease-out forwards;
	}

	.flag {
		position: absolute;
		aspect-ratio: 3 / 2;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		transform: translate(-50%, -50%) rotate(var(--angle)) scale(var(--scale));
		transition:
			transform 0.18s ease-out,
			opacity 0.3s ease;
		animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
		animation-delay: calc(250ms + var(--i) * 5ms);
	}

	.flag img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 0 0.5px rgba(0, 0, 0, 0.5));
		pointer-events: none;
	}

	.flag.faded {
		opacity: 0.3;
	}

	.flag:focus-visible {
		outline: 1px solid var(--color-font-dark);
		outline-offset: 1px;
	}

	.centre {
		position: absolute;
		inset: 15%;
		display: grid;
		place-items: center;
		container-type: size;
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
		.chords path {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
