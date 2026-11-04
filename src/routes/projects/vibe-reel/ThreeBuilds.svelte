<script>
	const builds = [
		{
			name: 'TV',
			out: 'app.js · style.css → IPK',
			swaps: ['__PHONE__ = false', '__WEB__ = false', 'D-pad focus engine'],
			proof: 'md5-checked on the TV after every deploy'
		},
		{
			name: 'iPhone',
			out: 'phone/dist → PWA',
			swaps: ['__PHONE__ = true', 'focus.js → no-op', 'nav → router shim'],
			proof: 'a phone change leaves the TV files byte-identical'
		},
		{
			name: 'Web',
			out: 'web/dist → desktop',
			swaps: ['__WEB__ = true', 'lifecycle → web', 'MSE playback'],
			proof: 'a web change leaves TV and phone byte-identical'
		}
	];
</script>

<figure class="vr-panel">
	<div class="shared">
		<strong>src/lib</strong>
		<span>playback engine · track scoring · Jellyfin and reel-api clients · activity feed</span>
	</div>
	<div class="cols">
		{#each builds as b (b.name)}
			<div class="col vr-card">
				<span class="vr-eyebrow">{b.name}</span>
				<ul>
					{#each b.swaps as s (s)}<li><code>{s}</code></li>{/each}
				</ul>
				<span class="out">{b.out}</span>
				<span class="proof">✓ {b.proof}</span>
			</div>
		{/each}
	</div>
</figure>

<style>
	.shared {
		background: var(--vr-cream);
		border: 1.5px solid var(--vr-gold);
		border-radius: 0.6rem;
		padding: 0.9rem 1.1rem;
		text-align: center;
		display: grid;
		gap: 0.25rem;
	}

	.shared strong {
		font-family: var(--font-mono);
		color: var(--vr-gold-ink);
	}

	.shared span {
		font-size: 0.85rem;
		color: var(--vr-muted);
	}

	.cols {
		display: grid;
		gap: 0.5rem;
		margin-top: 1.5rem;
		position: relative;
	}

	@media (min-width: 640px) {
		.cols {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.col {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	/* The build arrow down from the shared box */
	.col::before {
		content: '';
		position: absolute;
		left: 50%;
		top: -1.5rem;
		height: 1.5rem;
		border-left: 1.5px solid var(--vr-edge);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.out {
		font-size: 0.85rem;
		color: var(--color-font-dark);
	}

	.proof {
		font-size: 0.8rem;
		color: var(--vr-muted);
	}
</style>
