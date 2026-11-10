<script>
	import Shell from './Shell.svelte';
	import { spread, imageUrl } from './palette.js';

	let { item: project, linkSection = false } = $props();

	// A paint fan deck: ten flags as colour strips held by one screw, the title card in front.
	// The strips sit in ring order, so the fan runs through the circle's gradient.
	const COVER = 5;
	const strips = spread(10).map((f, k) => {
		const pos = k < COVER ? k : k + 1;
		return { ...f, t: (pos - COVER) / COVER, z: 10 - Math.abs(pos - COVER), no: f.index + 1 };
	});
</script>

<!-- Fan deck: flags as paint-chip strips that fan open on hover -->
<Shell {project} {linkSection}>
	<div class="deck">
		{#each strips as s (s.code)}
			<div class="strip" style:--t={s.t} style:z-index={s.z} aria-hidden="true">
				<img src={imageUrl(s.code)} alt="" decoding="async" draggable="false" />
				{#each s.colors.slice(0, 5) as c (c.hex)}
					<span class="chip" style:background={c.hex}></span>
				{/each}
				<span class="label">{s.code.toUpperCase()} · {String(s.no).padStart(3, '0')}</span>
			</div>
		{/each}
		<h2 class="strip cover">
			<span class="count">{project.count}</span>
			{#each project.title.split(/(?<=,) /) as line (line)}
				<span class="caption">{line}</span>
			{/each}
		</h2>
		<span class="screw" aria-hidden="true"></span>
	</div>
</Shell>

<style>
	/* Own stacking context, so the strips' z-index stays under the full-tile link */
	.deck {
		position: absolute;
		inset: 0;
		z-index: 0;
		--fan: 40deg;
	}

	:global(.tile:hover) .deck {
		--fan: 64deg;
	}

	.strip {
		position: absolute;
		left: calc(50% - 9cqw);
		bottom: -6cqw;
		width: 18cqw;
		height: 74cqw;
		box-sizing: border-box;
		/* Room below the label for the screw hole the strips turn on */
		padding: 1.4cqw 1.4cqw 12cqw;
		display: flex;
		flex-direction: column;
		gap: 0.7cqw;
		background: white;
		border-radius: 1.4cqw;
		box-shadow:
			0 0 0 0.5px rgba(0, 0, 0, 0.12),
			0 0.6cqw 1.6cqw rgba(0, 0, 0, 0.12);
		transform-origin: 50% calc(100% - 9cqw);
		transform: rotate(calc(var(--t) * var(--fan)));
		transition: transform 0.7s var(--ease-back-in-out);
	}

	.strip img {
		width: 100%;
		height: 10cqw;
		object-fit: cover;
		border-radius: 0.7cqw;
		filter: var(--flag-outline);
	}

	.chip {
		flex: 1;
		border-radius: 0.5cqw;
		box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.1);
	}

	.label {
		font-family: var(--font-mono);
		font-size: 2.3cqw;
		letter-spacing: 0.04em;
		color: var(--color-font-light);
		white-space: nowrap;
	}

	.cover {
		margin: 0;
		transform: none;
		z-index: 20;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-weight: 400;
		font-family: var(--font-secondary);
		gap: 0.4cqw;
		padding-bottom: 16cqw;
	}

	.count {
		font-size: 9cqw;
		line-height: 1;
		margin-bottom: 1cqw;
		color: var(--color-font-dark);
	}

	.caption {
		font-size: 3.3cqw;
		white-space: nowrap;
		line-height: 1.3;
		color: var(--color-font-light);
	}

	.screw {
		position: absolute;
		left: 50%;
		bottom: 3cqw;
		z-index: 30;
		width: 3.2cqw;
		aspect-ratio: 1;
		border-radius: 50%;
		transform: translate(-50%, 50%);
		background: radial-gradient(circle at 35% 35%, #fafafa, #a3a3a3 55%, #6b6b6b);
		box-shadow: 0 0.3cqw 0.6cqw rgba(0, 0, 0, 0.25);
	}
</style>
