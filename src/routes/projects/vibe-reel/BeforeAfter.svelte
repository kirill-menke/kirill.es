<script>
	/* Paired bars, each pair on its own scale: the units differ, so they never share an axis */
	const rows = [
		{
			metric: 'Dropped frames while moving focus in Search',
			before: { value: 21.5, label: '19–24%' },
			after: { value: 0.6, label: '0.5–0.7%' },
			fix: 'Focus rings as permanent compositor layers'
		},
		{
			metric: 'Worst key press to frame',
			before: { value: 231, label: '222–241 ms' },
			after: { value: 35, label: '33–37 ms' },
			fix: 'Same change'
		},
		{
			metric: 'Cold-start module evaluation',
			before: { value: 64, label: '~64 ms' },
			after: { value: 48, label: '~48 ms' },
			fix: 'libpgs turned into a lazy factory at build time'
		}
	];

	const bars = [
		['before', 'Before'],
		['after', 'After']
	];
</script>

<figure class="vr-panel">
	<div class="legend">
		{#each bars as [kind, name] (kind)}
			<span><i class="sw {kind}"></i>{name}</span>
		{/each}
	</div>
	{#each rows as r (r.metric)}
		<div class="row">
			<div class="metric">
				<strong>{r.metric}</strong>
				<span>{r.fix}</span>
			</div>
			<div class="bars">
				{#each bars as [kind, name] (kind)}
					<div class="bar-line">
						<div
							class="bar {kind}"
							style="width: {Math.max((r[kind].value / r.before.value) * 100, 1.5)}%"
							title="{name}: {r[kind].label}"
						></div>
						<span class="value">{r[kind].label}</span>
					</div>
				{/each}
			</div>
		</div>
	{/each}
	<figcaption>Measured on the LG C4 over the DevTools protocol, median of five runs.</figcaption>
</figure>

<style>
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
		border-top: 1px solid var(--color-background-dark);
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

	.before {
		background: oklch(0.8 0 0);
	}

	.after {
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
