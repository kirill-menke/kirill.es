<script>
	/* 40 pieces of a torrent: done in order up to the frontier, plus the last piece fetched first */
	const PIECES = 40;
	const FRONTIER = 17;
	const PLAYHEAD = 12;
	const pieces = Array.from({ length: PIECES }, (_, i) =>
		i < FRONTIER || i === PIECES - 1 ? 'done' : i === FRONTIER ? 'loading' : 'missing'
	);
</script>

<figure class="dl">
	<div class="bar-wrap">
		<div class="playhead" style="left: {((PLAYHEAD + 0.5) / PIECES) * 100}%">
			<span>playing</span>
		</div>
		<div class="frontier" style="left: {((FRONTIER + 0.5) / PIECES) * 100}%">
			<span>download frontier</span>
		</div>
		<ol class="pieces" aria-label="Torrent pieces">
			{#each pieces as state, i (i)}
				<li class={state} title="Piece {i + 1}: {state}"></li>
			{/each}
		</ol>
		<div class="ends">
			<span>first piece</span>
			<span>last piece, fetched early so the container index is readable</span>
		</div>
	</div>

	<div class="lanes">
		<div class="lane">
			<span class="lane-name">TV</span>
			<p>
				<code>&lt;video&gt;</code> sends Range requests to reel-api. Finished pieces are
				served at once; a request past the frontier <strong>waits for the piece</strong> instead
				of failing, for up to 120 s without progress.
			</p>
		</div>
		<div class="lane">
			<span class="lane-name">iPhone &amp; web</span>
			<p>
				The same frontier-aware reader feeds ffmpeg, which writes a growing HLS playlist of
				6 s fMP4 segments. The client appends them to a MediaSource itself, because Safari
				treats a growing playlist as a live stream.
			</p>
		</div>
	</div>
</figure>

<style>
	.dl {
		margin: 0;
		background: var(--color-background-tile);
		border-radius: 0.5rem;
		padding: 1.25rem;
	}

	@media (min-width: 640px) {
		.dl {
			padding: 2rem;
		}
	}

	.bar-wrap {
		position: relative;
		padding-top: 2.4rem;
	}

	.pieces {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(40, 1fr);
		gap: 2px;
		height: 2.25rem;
	}

	.pieces li {
		border-radius: 3px;
		background: oklch(0.92 0 0);
	}

	.pieces li.done {
		background: var(--vr-gold-fill);
	}

	.pieces li.loading {
		background: var(--vr-gold-fill);
		animation: pulse 1.6s ease-in-out infinite;
	}

	@keyframes pulse {
		50% {
			opacity: 0.3;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pieces li.loading {
			animation: none;
			opacity: 0.6;
		}
	}

	.playhead,
	.frontier {
		position: absolute;
		top: 0;
		bottom: 1.6rem;
		width: 0;
		border-left: 2px solid var(--vr-ink);
	}

	.frontier {
		border-left: 2px dashed var(--vr-gold-ink);
	}

	.playhead span,
	.frontier span {
		position: absolute;
		top: 0;
		white-space: nowrap;
		font-size: 0.75rem;
		transform: translateX(-50%);
		color: var(--vr-ink);
	}

	.frontier span {
		color: var(--vr-gold-ink);
		transform: translateX(0.4rem) translateY(1rem);
	}

	.playhead span {
		transform: translateX(calc(-100% - 0.4rem));
	}

	.ends {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 0.4rem;
		font-size: 0.75rem;
		color: var(--color-font-light);
	}

	.ends span:last-child {
		text-align: right;
	}

	.lanes {
		display: grid;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}

	@media (min-width: 640px) {
		.lanes {
			grid-template-columns: 1fr 1fr;
		}
	}

	.lane {
		background: var(--color-background);
		border-radius: 0.5rem;
		padding: 0.9rem 1rem;
	}

	.lane-name {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--vr-gold-ink);
		font-weight: 600;
	}

	.lane p {
		margin: 0.4rem 0 0;
		font-size: 0.9rem;
	}
</style>
