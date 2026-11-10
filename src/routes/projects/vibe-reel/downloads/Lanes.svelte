<script>
	/*
	 * The two ways the growing file is watched, as cards under the download bar: side by side,
	 * stacked on a phone.
	 */
	import { useTweaks } from '../tweaks.js';

	const tweak = useTweaks();

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

<!-- On trial (downloads.lanes: 'frames', 'notes'): drawn on the sheet instead of white cards -->
<div class={['lanes', tweak('downloads.lanes')]}>
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

	/* On trial (downloads.lanes): no white cards on the sheet, the page's last app-style boxes.
	   Both letter the two as the architecture diagram letters its machines, in the notes'
	   italic, spaced small capitals in its faint pencil. 'frames' draws its frame round each;
	   'notes' leaves them bare under a rule of that pencil. */
	.frames,
	.notes {
		gap: 1rem;
	}

	:is(.frames, .notes) .vr-card {
		background: none;
	}

	:is(.frames, .notes) .vr-eyebrow {
		font-family: var(--font-secondary);
		font-style: italic;
		font-weight: 400;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		color: var(--vr-pencil-faint);
	}

	.frames .vr-card {
		padding: 0.8rem 1.1rem 0.9rem;
		border: 1.3px solid var(--vr-pencil-frame);
		border-radius: 0.75rem;
	}

	.notes {
		column-gap: 2rem;
	}

	.notes .vr-card {
		padding: 0.7rem 0 0;
		border-top: 1.3px solid var(--vr-pencil-frame);
		border-radius: 0;
	}
</style>
