<script>
	import Switcher from './Switcher.svelte';

	/** A live copy of VibeReel's score() from src/lib/tracks.js, run on example files */
	function score(track, want) {
		const parts = [];
		if (want && track.lang === want) parts.push(['language', 10]);
		if (track.codec === 'eac3') parts.push(['E-AC3', 3]);
		if (track.atmos) parts.push(['Atmos', 2]);
		if (track.codec === 'ac3') parts.push(['AC3', 1]);
		if (track.commentary) parts.push(['commentary', -16]);
		return { parts, total: parts.reduce((sum, [, v]) => sum + v, 0) };
	}

	const files = [
		{
			name: 'Blu-ray remux',
			want: 'eng',
			note: 'TrueHD is the container default, but a TV app can only send it to the soundbar as PCM. The DD+ track keeps Atmos as a bitstream.',
			tracks: [
				{
					label: 'English · TrueHD Atmos 7.1',
					lang: 'eng',
					codec: 'truehd',
					atmos: true,
					isDefault: true
				},
				{ label: 'English · E-AC3 Atmos 5.1', lang: 'eng', codec: 'eac3', atmos: true },
				{
					label: 'English · AC3 2.0 commentary',
					lang: 'eng',
					codec: 'ac3',
					commentary: true
				}
			]
		},
		{
			name: 'Anime episode',
			want: 'jpn',
			note: 'The genre is Animation and the file’s default track is Japanese, so Japanese becomes the wanted language. Genre alone would also catch Western cartoons with a Japanese dub.',
			tracks: [
				{ label: 'Japanese · FLAC 2.0', lang: 'jpn', codec: 'flac', isDefault: true },
				{ label: 'English · E-AC3 5.1 (dub)', lang: 'eng', codec: 'eac3' }
			]
		},
		{
			name: 'Series with commentaries',
			want: 'eng',
			note: 'Before the −16, the AC3 commentary (10 + 1) beat the DTS-HD main track (10) for a whole series.',
			tracks: [
				{ label: 'English · DTS-HD MA 5.1', lang: 'eng', codec: 'dts', isDefault: true },
				{
					label: 'English · AC3 2.0 commentary',
					lang: 'eng',
					codec: 'ac3',
					commentary: true
				}
			]
		}
	];

	const options = files.map((f, i) => ({ value: i, label: f.name }));

	let selected = $state(0);
	const file = $derived(files[selected]);
	const scored = $derived(file.tracks.map((t) => ({ ...t, ...score(t, file.want) })));
	const best = $derived(Math.max(...scored.map((t) => t.total)));
</script>

<div class="vr-panel">
	<Switcher {options} bind:value={selected} label="Example file" variant="pills" />

	<ul class="tracks">
		{#each scored as t (t.label)}
			<li class:winner={t.total === best}>
				<div class="label">
					{t.label}
					{#if t.isDefault}<span class="tag">container default</span>{/if}
				</div>
				<div class="parts">
					{#each t.parts as [name, value] (name)}
						<span class="part" class:negative={value < 0}>
							{value > 0 ? '+' : '−'}{Math.abs(value)}
							{name}
						</span>
					{:else}
						<span class="part none">no bonus</span>
					{/each}
				</div>
				<div class="total">
					{t.total}
					{#if t.total === best}<span class="plays">plays</span>{/if}
				</div>
			</li>
		{/each}
	</ul>

	<p class="note">{file.note}</p>
</div>

<style>
	.tracks {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.4rem;
	}

	li {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-areas:
			'label total'
			'parts total';
		gap: 0.4rem 1rem;
		align-items: center;
		background: var(--color-background);
		border: 1.5px solid transparent;
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
	}

	@media (min-width: 900px) {
		li {
			grid-template-columns: minmax(16rem, 1fr) 2fr 5.5rem;
			grid-template-areas: 'label parts total';
		}
	}

	li.winner {
		border-color: var(--vr-gold);
	}

	.label {
		grid-area: label;
		color: var(--color-font-dark);
		font-size: 0.95rem;
	}

	.tag {
		display: inline-block;
		margin-left: 0.4rem;
		font-size: 0.7rem;
		color: var(--color-font-light);
		border: 0.5px solid var(--color-border);
		border-radius: 0.3rem;
		padding: 0 0.3rem;
	}

	.parts {
		grid-area: parts;
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.part {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		padding: 0.15rem 0.45rem;
		border-radius: 0.3rem;
		background: var(--vr-cream);
		color: var(--vr-gold-ink);
	}

	.part.negative {
		background: oklch(0.95 0.03 25);
		color: oklch(0.45 0.13 25);
	}

	.part.none {
		background: transparent;
		color: var(--color-font-light);
	}

	.total {
		grid-area: total;
		text-align: right;
		font-family: var(--font-secondary);
		font-size: 1.6rem;
		color: var(--color-font-dark);
		line-height: 1;
	}

	.plays {
		display: block;
		font-family: var(--font-primary);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--vr-gold-ink);
		margin-top: 0.25rem;
	}

	.note {
		margin: 1rem 0 0;
		font-size: 0.9rem;
	}
</style>
