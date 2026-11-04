<script>
	/** The path from "OK pressed" to frames, per client. Steps marked `ask` are decisions. */
	const modes = {
		tv: {
			label: 'TV',
			steps: [
				{
					title: 'OK pressed',
					text: 'playItem() picks the media source, then the audio and subtitle tracks: the pick remembered for this series, otherwise the highest-scoring track.'
				},
				{
					ask: true,
					title: 'Is the chosen subtitle a DVD or DVB bitmap?',
					text: 'Only then does Jellyfin get one HLS H.264 profile and burn the subtitle into the picture. It is the single transcode the TV ever asks for.'
				},
				{
					title: 'PlaybackInfo with zero transcoding profiles',
					text: 'The device profile lists everything the TV decodes (mkv, mp4, ts, … · H.264, HEVC, AV1, VP9 · AC3, E-AC3, DTS, TrueHD, …) and TranscodingProfiles: []. Jellyfin has no option except Direct Play.'
				},
				{
					title: 'The original file goes into <video>',
					text: 'A static=true stream URL, fetched with HTTP Range requests. The element sits on webOS’s hardware video plane, so the browser never touches a frame.'
				}
			],
			lanes: [
				{
					name: 'Video',
					text: 'H.264 / HEVC / AV1 with HDR10 and Dolby Vision metadata, straight to the panel'
				},
				{
					name: 'Audio',
					text: 'audioTracks[i].enabled switches in place; DD+ / Atmos, AC3 and DTS leave as a bitstream over eARC'
				},
				{
					name: 'Subtitles',
					text: 'SRT / ASS become a VTT blob <track>; Blu-ray PGS is decoded by libpgs onto a canvas'
				}
			]
		},
		phone: {
			label: 'iPhone',
			steps: [
				{
					title: 'Tap play',
					text: 'The same playItem() and track scoring from the shared src/lib engine, under the phone build’s __PHONE__ flag.'
				},
				{
					ask: true,
					title: 'Is it a progressive MP4 or MOV?',
					text: 'Safari plays no MKV, DTS or TrueHD, so only those containers are Direct Played.'
				},
				{
					title: 'Otherwise: HLS remux with the video copied',
					text: 'Jellyfin repackages the file as fMP4 segments (main.m3u8, play method DirectStream). The video stream is copied, not re-encoded.'
				},
				{
					title: 'Safari’s native HLS player',
					text: 'Downloads for offline viewing and AirPlay work from the same stream.'
				}
			],
			lanes: [
				{
					name: 'Video',
					text: 'Copied bit for bit; re-encoded only when you pick a lower quality cap'
				},
				{
					name: 'Audio',
					text: 'E-AC3 (Atmos intact), AC3, AAC, FLAC and ALAC are copied; DTS and TrueHD become AC3 5.1'
				},
				{
					name: 'Track switch',
					text: 'The remux carries one audio track, so switching audio restarts the stream at the same position'
				}
			]
		},
		web: {
			label: 'Web',
			steps: [
				{
					title: 'Click play',
					text: 'The phone’s screens and engine in a desktop layout, built with the __WEB__ flag.'
				},
				{
					ask: true,
					title: 'Can this browser decode the codecs?',
					text: 'Chrome has no HEVC or AC-3, so Jellyfin encodes H.264 / AAC for it. Firefox gets the HEVC stream copied.'
				},
				{
					title: 'HLS fed through Media Source Extensions',
					text: 'jfhls.js reads the playlist and segfeed.js appends the fMP4 segments to a MediaSource itself.'
				}
			],
			lanes: [
				{ name: 'Video', text: 'Copied where the browser can decode it, H.264 otherwise' },
				{
					name: 'Audio',
					text: 'AAC for Chrome; the same copy rules as the phone elsewhere'
				},
				{ name: 'Input', text: 'Mouse and keyboard instead of the TV’s D-pad focus engine' }
			]
		}
	};

	let mode = $state('tv');
	const current = $derived(modes[mode]);
</script>

<div class="flow">
	<div class="tabs" role="tablist" aria-label="Client">
		{#each Object.entries(modes) as [key, m] (key)}
			<button
				role="tab"
				aria-selected={mode === key}
				class:active={mode === key}
				onclick={() => (mode = key)}
			>
				{m.label}
			</button>
		{/each}
	</div>

	<ol class="steps">
		{#each current.steps as step, i (mode + i)}
			<li class:ask={step.ask}>
				<span class="marker" aria-hidden="true">{step.ask ? '?' : i + 1}</span>
				<div>
					<strong>{step.title}</strong>
					<p>{step.text}</p>
				</div>
			</li>
		{/each}
	</ol>

	<div class="lanes">
		{#each current.lanes as lane (mode + lane.name)}
			<div class="lane">
				<span class="lane-name">{lane.name}</span>
				<p>{lane.text}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.flow {
		background: var(--color-background-tile);
		border-radius: 0.5rem;
		padding: 1.25rem;
	}

	@media (min-width: 640px) {
		.flow {
			padding: 2rem;
		}
	}

	.tabs {
		display: inline-flex;
		gap: 0.25rem;
		padding: 0.25rem;
		background: var(--color-background);
		border: 0.5px solid lightgrey;
		border-radius: 0.6rem;
		margin-bottom: 1.75rem;
	}

	button {
		font: inherit;
		font-size: 0.9rem;
		border: 0;
		background: transparent;
		color: var(--color-font-light);
		padding: 0.4rem 1rem;
		border-radius: 0.4rem;
		cursor: pointer;
		transition: all 0.1s linear;
	}

	button:hover {
		color: var(--color-font-dark);
	}

	button.active {
		background: var(--vr-ink);
		color: white;
	}

	.steps {
		list-style: none;
		padding: 0;
		margin: 0;
		max-width: 70ch;
	}

	.steps li {
		position: relative;
		display: grid;
		grid-template-columns: 2rem 1fr;
		gap: 1rem;
		padding-bottom: 1.25rem;
	}

	/* The connector between markers */
	.steps li::before {
		content: '';
		position: absolute;
		left: calc(1rem - 1px);
		top: 2rem;
		bottom: 0;
		width: 2px;
		background: var(--vr-line);
	}

	.marker {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: var(--color-background);
		border: 1.5px solid var(--vr-line);
		font-size: 0.85rem;
		color: var(--color-font-dark);
	}

	/* Decisions get a gold square instead of a numbered circle */
	.ask .marker {
		border-radius: 0.4rem;
		border-color: var(--vr-gold);
		background: var(--vr-cream);
		color: var(--vr-gold-ink);
		font-weight: 600;
	}

	.steps strong {
		display: block;
		font-weight: 500;
		color: var(--color-font-dark);
		margin-top: 0.3rem;
	}

	.steps p {
		margin: 0.3rem 0 0;
		font-size: 0.95rem;
	}

	.lanes {
		display: grid;
		gap: 0.5rem;
		margin-left: 3rem;
	}

	@media (min-width: 640px) {
		.lanes {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.lane {
		background: var(--color-background);
		border-radius: 0.5rem;
		padding: 0.9rem 1rem;
		border-top: 3px solid var(--vr-gold-fill);
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
		line-height: 1.5;
	}
</style>
