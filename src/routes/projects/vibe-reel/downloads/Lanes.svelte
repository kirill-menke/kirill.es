<script>
	/*
	 * The two ways the growing file is watched, as cards under the download bar: side by side,
	 * stacked on a phone.
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
		<div class="vr-card">
			<span class="vr-eyebrow">{lane.eyebrow}</span>
			<p>{lane.text}</p>
		</div>
	{/each}
</div>

<style>
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
</style>
