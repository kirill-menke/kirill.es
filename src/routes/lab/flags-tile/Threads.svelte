<script>
	import Shell from './Shell.svelte';
	import { flags, N, ink, polar, fmt } from './palette.js';

	let { item: project, linkSection = false } = $props();

	// String art from the data: every flag threaded to its five closest look-alikes. Neighbours
	// make the dense petals at the rim, the few long-distance twins cross the middle.
	const R = 43;
	const at = Object.fromEntries(flags.map((f, i) => [f.code, i]));
	const links = flags.flatMap((f, i) =>
		f.matches.flatMap(([code]) => {
			const j = at[code];
			// Each pair once: skip j's link back to i when i is also among j's matches
			if (j < i && flags[j].matches.some(([c]) => c === f.code)) return [];
			const key = `${i}-${j}`;
			const [x1, y1] = polar(R, i / N);
			const [x2, y2] = polar(R, j / N);
			// Control point pulled towards the centre: short links bow inwards like petals
			const d = `M${fmt(x1)} ${fmt(y1)}Q${fmt((x1 + x2) * 0.27)} ${fmt((y1 + y2) * 0.27)} ${fmt(x2)} ${fmt(y2)}`;
			return [{ key, d, stroke: ink(f) }];
		})
	);
	const pins = flags.map((f, i) => {
		const [x, y] = polar(R + 2.4, i / N);
		return { code: f.code, x: fmt(x), y: fmt(y), fill: ink(f) };
	});
</script>

<!-- Threads: a string-art mandala of which flags look alike -->
<Shell {project} {linkSection}>
	<svg class="art" viewBox="-50 -50 100 100" aria-hidden="true">
		<g class="links">
			{#each links as l, k (l.key)}
				<path d={l.d} stroke={l.stroke} pathLength="1" style:--k={k} />
			{/each}
		</g>
		{#each pins as p (p.code)}
			<circle cx={p.x} cy={p.y} r="0.75" fill={p.fill} />
		{/each}
	</svg>
	<h2 class="centre">
		<span class="count">{project.count}</span>
		<span class="caption">{project.title}</span>
	</h2>
</Shell>

<style>
	.art {
		position: absolute;
		left: 8%;
		top: 13%;
		width: 84%;
		animation: spin 200s linear infinite;
	}

	.links path {
		fill: none;
		stroke-width: 0.28;
		stroke-opacity: 0.45;
		mix-blend-mode: multiply;
		stroke-dasharray: 1;
		animation: draw 1.4s var(--ease-cubic-out) backwards;
		animation-delay: calc(var(--enter-delay, 0ms) + 200ms + var(--k) * 1.2ms);
		transition:
			stroke-opacity 0.4s ease,
			stroke-width 0.4s ease;
	}

	:global(.tile:hover) .links path {
		stroke-opacity: 0.8;
		stroke-width: 0.36;
	}

	@keyframes draw {
		from {
			stroke-dashoffset: 1;
		}
	}

	.centre {
		position: absolute;
		left: 50%;
		top: 55%;
		transform: translate(-50%, -50%);
		margin: 0;
		padding: 3cqw 5cqw;
		font-weight: 400;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		font-family: var(--font-secondary);
		background: radial-gradient(closest-side, var(--color-background-tile) 55%, transparent);
	}

	.count {
		font-size: 16cqw;
		line-height: 1;
		color: var(--color-font-dark);
	}

	.caption {
		font-size: max(0.8rem, 5cqw);
		color: var(--color-font-light);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.art,
		.links path {
			animation: none;
		}
	}
</style>
