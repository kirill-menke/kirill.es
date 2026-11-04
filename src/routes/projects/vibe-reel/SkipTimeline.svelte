<script>
	/* One episode, as percentages of its runtime */
	const spans = [
		{
			from: 0,
			to: 6,
			kind: 'keep',
			label: 'Cold open',
			note: 'kept: Jellyfin’s detector called it a recap'
		},
		{ from: 6, to: 9.5, kind: 'skip', label: 'Intro', note: 'Skip Intro chip' },
		{ from: 9.5, to: 93, kind: 'episode', label: 'Episode', note: '' },
		{ from: 93, to: 100, kind: 'credits', label: 'Credits', note: 'Up Next, 10 s countdown' }
	];

	const sources = [
		{
			name: 'Jellyfin media segments',
			text: 'From the Intro Skipper plugin. Intro, preview and credits only, never recaps.'
		},
		{
			name: 'Named chapters',
			text: 'Anchored patterns like ^intro$ or ^previously on. Unnamed chapter breaks are ignored.'
		},
		{
			name: 'IntroDB',
			text: 'Crowdsourced markers through reel-api, filling whatever is still empty.'
		}
	];
</script>

<figure class="vr-panel">
	<div
		class="strip"
		role="img"
		aria-label="Episode timeline: cold open kept, intro skipped, credits trigger Up Next"
	>
		{#each spans as s (s.label)}
			<div class="span {s.kind}" style="left: {s.from}%; width: {s.to - s.from}%"></div>
		{/each}
	</div>
	<ul class="notes">
		{#each spans.filter((s) => s.note) as s (s.label)}
			<li class={s.kind}><span class="dot"></span><strong>{s.label}</strong> {s.note}</li>
		{/each}
	</ul>

	<ol class="sources">
		{#each sources as src, i (src.name)}
			<li class="vr-card">
				<span class="rank">{i + 1}</span>
				<div>
					<strong>{src.name}</strong>
					<p>{src.text}</p>
				</div>
			</li>
		{/each}
	</ol>
</figure>

<style>
	.strip {
		position: relative;
		height: 2.25rem;
	}

	.span {
		position: absolute;
		top: 0;
		bottom: 0;
		border-radius: 4px;
		border: 1px solid var(--color-background-tile);
		box-sizing: border-box;
	}

	.keep {
		--c: oklch(0.88 0 0);
	}

	.span.skip,
	.notes .skip {
		--c: var(--vr-gold-fill);
	}

	.episode {
		--c: oklch(0.95 0 0);
	}

	.credits {
		--c: var(--vr-gold);
	}

	.span {
		background: var(--c);
	}

	.notes {
		list-style: none;
		padding: 0;
		margin: 0.9rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.5rem;
		font-size: 0.85rem;
	}

	.notes li {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--vr-muted);
	}

	.dot {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 3px;
		background: var(--c);
	}

	.notes strong {
		color: var(--color-font-dark);
		font-weight: 500;
	}

	.sources {
		list-style: none;
		padding: 0;
		margin: 1.5rem 0 0;
		display: grid;
		gap: 0.5rem;
	}

	@media (min-width: 640px) {
		.sources {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.sources li {
		display: flex;
		gap: 0.75rem;
	}

	.rank {
		flex: none;
		display: grid;
		place-items: center;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		background: var(--vr-cream);
		color: var(--vr-gold-ink);
		font-size: 0.8rem;
		font-weight: 600;
	}

	.sources strong {
		font-weight: 500;
		color: var(--color-font-dark);
		font-size: 0.95rem;
	}

	.sources p {
		margin: 0.25rem 0 0;
		font-size: 0.85rem;
		line-height: 1.5;
	}
</style>
