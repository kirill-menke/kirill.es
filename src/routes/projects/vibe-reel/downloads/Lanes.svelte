<script>
	/*
	 * The two ways the growing file is watched, under the download bar: side by side, stacked
	 * on a phone. Drawn on the sheet as the architecture diagram draws its machines: each in a
	 * frame of its pencil, lettered in the notes' italic, spaced small capitals in its faint
	 * pencil.
	 */
	const lanes = [
		{
			eyebrow: 'TV',
			text: 'Plays the growing file; a read past the frontier waits for the piece.'
		},
		{
			eyebrow: 'iPhone & web',
			text: 'ffmpeg streams it as HLS while it is still downloading.'
		}
	];
</script>

<div class="lanes">
	{#each lanes as lane (lane.eyebrow)}
		<div class="lane">
			<span class="eyebrow">{lane.eyebrow}</span>
			<p>{lane.text}</p>
		</div>
	{/each}
</div>

<style>
	.lanes {
		display: grid;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	@media (min-width: 640px) {
		.lanes {
			grid-template-columns: 1fr 1fr;
		}
	}

	.lane {
		padding: 0.8rem 1.1rem 0.9rem;
		border: 1.3px solid var(--vr-pencil-frame);
		border-radius: 0.75rem;
	}

	.lane p {
		margin: 0.4rem 0 0;
		font-size: 0.9rem;
	}

	.eyebrow {
		font-family: var(--font-secondary);
		font-style: italic;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--vr-pencil-faint);
	}
</style>
