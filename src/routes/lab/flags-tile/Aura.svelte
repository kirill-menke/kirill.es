<script>
	import Shell from './Shell.svelte';
	import { flags, N, stops } from './palette.js';

	let { item: project, linkSection = false } = $props();

	// Every flag's colours, by share, around one turn in ring order
	const conic = `conic-gradient(${flags
		.flatMap((f, i) => stops(f.colors, (i * 360) / N, ((i + 1) * 360) / N, 'deg'))
		.join(', ')})`;
</script>

<!-- Aura: the circle as a halo of light, every flag a sliver of it -->
<Shell {project} {linkSection}>
	<div class="aura" aria-hidden="true">
		<div class="glow"><div class="band wide" style:background={conic}></div></div>
		<div class="band thin" style:background={conic}></div>
	</div>
	<h2 class="centre">
		<span class="count">{project.count}</span>
		<span class="caption">{project.title}</span>
	</h2>
</Shell>

<style>
	.aura {
		position: absolute;
		left: 13%;
		top: 18%;
		width: 74%;
		aspect-ratio: 1;
		animation: spin 120s linear infinite;
	}

	.band {
		position: absolute;
		inset: 0;
		border-radius: 50%;
	}

	.thin {
		mask: radial-gradient(closest-side, transparent 84%, #000 85% 99%, transparent 100%);
	}

	.wide {
		mask: radial-gradient(closest-side, transparent 50%, #000 68% 92%, transparent 100%);
	}

	/* Blurred on a wrapper: on one element the blur would run before the mask and stay crisp */
	.glow {
		position: absolute;
		inset: 0;
		filter: blur(5cqw) saturate(1.6);
		opacity: 0.75;
		transform: scale(1.02);
		transition:
			transform 0.8s var(--ease-cubic-out),
			opacity 0.8s ease,
			filter 0.8s ease;
	}

	:global(.tile:hover) .glow {
		transform: scale(1.14);
		opacity: 1;
		filter: blur(7cqw) saturate(1.9);
	}

	.centre {
		position: absolute;
		left: 50%;
		top: 55%;
		transform: translate(-50%, -50%);
		margin: 0;
		font-weight: 400;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		font-family: var(--font-secondary);
	}

	.count {
		font-size: 18cqw;
		line-height: 1;
		color: var(--color-font-dark);
	}

	.caption {
		margin-top: 0.25rem;
		font-size: max(0.85rem, 5.5cqw);
		color: var(--color-font-light);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.aura {
			animation: none;
		}
	}
</style>
