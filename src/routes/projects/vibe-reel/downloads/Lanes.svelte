<script>
	/*
	 * The two ways the growing file is watched, under the download bar. Side by side they are
	 * drawn on the sheet as the architecture diagram draws its machines: each in a frame of its
	 * pencil, lettered in the notes' italic, spaced small capitals in its faint pencil. On a
	 * phone, where they would stack as two more boxes under the bar, they are notes on the
	 * same sheet instead: no frames, each a line or two of running text after its name, so
	 * that the ticket is one figure with its captions.
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
	}

	.lane p {
		font-size: 0.9rem;
	}

	@media (width < 640px) {
		.lanes {
			gap: 0.7rem;
			margin-top: 1.75rem;
		}

		.lane {
			text-wrap: balance;
		}

		.lane p {
			display: inline;
			margin: 0;
		}

		.eyebrow {
			margin-right: 0.45em;
		}
	}

	@media (min-width: 640px) {
		.lanes {
			grid-template-columns: 1fr 1fr;
			gap: 1rem;
			margin-top: 1.5rem;
		}

		.lane {
			padding: 0.8rem 1.1rem 0.9rem;
			border: 1.3px solid var(--vr-pencil-frame);
			border-radius: 0.75rem;
		}

		.lane p {
			margin: 0.4rem 0 0;
		}
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
