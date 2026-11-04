<script>
	/* Paired bars, each pair on its own scale: the units differ, so they never share an axis */
	const rows = [
		{
			metric: 'Dropped frames while moving focus in Search',
			before: 21.5,
			after: 0.6,
			fmt: (v) => (v === 21.5 ? '19–24%' : '0.5–0.7%'),
			fix: 'Focus rings as permanent compositor layers'
		},
		{
			metric: 'Worst key press to frame',
			before: 231,
			after: 35,
			fmt: (v) => (v === 231 ? '222–241 ms' : '33–37 ms'),
			fix: 'Same change'
		},
		{
			metric: 'Cold-start module evaluation',
			before: 64,
			after: 48,
			fmt: (v) => `~${v} ms`,
			fix: 'libpgs turned into a lazy factory at build time'
		}
	];
</script>

<figure class="ba">
	<div class="legend">
		<span><i class="sw before"></i>Before</span>
		<span><i class="sw after"></i>After</span>
	</div>
	{#each rows as r (r.metric)}
		<div class="row">
			<div class="metric">
				<strong>{r.metric}</strong>
				<span>{r.fix}</span>
			</div>
			<div class="bars">
				{#each [['before', r.before], ['after', r.after]] as [kind, v] (kind)}
					<div class="bar-line">
						<div
							class="bar {kind}"
							style="width: {Math.max((v / r.before) * 100, 1.5)}%"
							title="{kind === 'before' ? 'Before' : 'After'}: {r.fmt(v)}"
						></div>
						<span class="value">{r.fmt(v)}</span>
					</div>
				{/each}
			</div>
		</div>
	{/each}
	<figcaption>Measured on the LG C4 over the DevTools protocol, median of five runs.</figcaption>
</figure>

<style>
	.ba {
		margin: 0;
		background: var(--color-background-tile);
		border-radius: 0.5rem;
		padding: 1.25rem;
	}

	@media (min-width: 640px) {
		.ba {
			padding: 2rem;
		}
	}

	.legend {
		display: flex;
		gap: 1.25rem;
		font-size: 0.8rem;
		color: var(--vr-muted);
		margin-bottom: 1rem;
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.sw {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 3px;
	}

	.row {
		display: grid;
		gap: 0.6rem;
		padding: 0.9rem 0;
		border-top: 1px solid oklch(0.93 0 0);
	}

	@media (min-width: 640px) {
		.row {
			grid-template-columns: 16rem 1fr;
			gap: 1.5rem;
			align-items: center;
		}
	}

	.metric strong {
		display: block;
		font-weight: 500;
		font-size: 0.9rem;
		color: var(--color-font-dark);
	}

	.metric span {
		font-size: 0.8rem;
		color: var(--color-font-light);
	}

	.bars {
		display: grid;
		gap: 4px;
	}

	.bar-line {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.bar {
		height: 0.9rem;
		border-radius: 0 4px 4px 0;
	}

	.before,
	.sw.before {
		background: oklch(0.8 0 0);
	}

	.after,
	.sw.after {
		background: var(--vr-gold);
	}

	.value {
		font-size: 0.8rem;
		color: var(--vr-muted);
		white-space: nowrap;
	}

	figcaption {
		margin-top: 0.75rem;
		font-size: 0.8rem;
		color: var(--color-font-light);
	}
</style>
