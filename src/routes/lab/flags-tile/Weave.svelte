<script>
	import Shell from './Shell.svelte';
	import { flags } from './palette.js';

	let { item: project, linkSection = false } = $props();

	// One thread per flag in ring order, its colours mirrored about the middle: the dominant colour
	// forms the ribbon's core, the smaller ones fray out towards both edges. Each colour sits at the
	// middle of its share and blends into the next, so the threads read as dyed silk.
	const blend = (colors, from, to) => {
		let at = from;
		return colors.map((c) => {
			const mid = at + (c.share * (to - from)) / 2;
			at += c.share * (to - from);
			return `${c.hex} ${mid.toFixed(2)}%`;
		});
	};
	const threads = flags.map((f, i) => {
		const top = blend([...f.colors].reverse(), 0, 50);
		const bottom = blend(f.colors, 50, 100);
		return { code: f.code, i, bg: `linear-gradient(${[...top, ...bottom].join(', ')})` };
	});
</script>

<!-- Weave: all 193 flags as threads of a silk ribbon that ripples -->
<Shell {project} {linkSection}>
	<div class="ribbon" aria-hidden="true">
		{#each threads as t (t.code)}
			<span class="thread" style:background={t.bg} style:--i={t.i}></span>
		{/each}
	</div>
	<h2 class="legend">
		<span class="count">{project.count}</span>
		<span class="caption">{project.title}</span>
	</h2>
</Shell>

<style>
	@property --amp {
		syntax: '<length>';
		inherits: true;
		initial-value: 0px;
	}

	.ribbon {
		position: absolute;
		left: 6%;
		right: 6%;
		top: 26%;
		height: 40%;
		display: flex;
		--amp: 3.5cqh;
		transition: --amp 0.8s ease;
	}

	:global(.tile:hover) .ribbon {
		--amp: 7cqh;
	}

	.thread {
		flex: 1 1 0;
		/* Overlap by a hair so sub-pixel threads never leave seams */
		margin-right: -0.4px;
		border-radius: 1px;
		/* Offsets along the row turn the sway into one travelling wave across the ribbon */
		animation: sway 5s ease-in-out infinite alternate;
		animation-delay: calc(var(--i) * -52ms);
	}

	@keyframes sway {
		from {
			transform: translateY(calc(var(--amp) * -1));
		}
		to {
			transform: translateY(var(--amp));
		}
	}

	.legend {
		position: absolute;
		left: 6%;
		right: 6%;
		bottom: 6%;
		margin: 0;
		display: flex;
		align-items: baseline;
		gap: 3cqw;
		font-weight: 400;
		font-family: var(--font-secondary);
	}

	.count {
		font-size: 17cqw;
		line-height: 1;
		color: var(--color-font-dark);
	}

	.caption {
		font-size: max(0.85rem, 6cqw);
		color: var(--color-font-light);
	}

	@media (prefers-reduced-motion: reduce) {
		.thread {
			animation: none;
		}
	}
</style>
