<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { ArrowUpRight } from '@lucide/svelte';
	import Section from '#lib/components/vibe-reel/Section.svelte';
	import TvFrame from '#lib/components/vibe-reel/TvFrame.svelte';
	import PhoneFrame from '#lib/components/vibe-reel/PhoneFrame.svelte';
	import PlaybackFlow from '#lib/components/vibe-reel/PlaybackFlow.svelte';
	import AudioScore from '#lib/components/vibe-reel/AudioScore.svelte';
	import ArchDiagram from '#lib/components/vibe-reel/ArchDiagram.svelte';
	import DownloadBar from '#lib/components/vibe-reel/DownloadBar.svelte';
	import PictureSequence from '#lib/components/vibe-reel/PictureSequence.svelte';
	import SkipTimeline from '#lib/components/vibe-reel/SkipTimeline.svelte';
	import Pipeline from '#lib/components/vibe-reel/Pipeline.svelte';
	import BeforeAfter from '#lib/components/vibe-reel/BeforeAfter.svelte';
	import ThreeBuilds from '#lib/components/vibe-reel/ThreeBuilds.svelte';

	const REPO = 'https://github.com/kirill-menke/vibe-reel';
	const img = (name) => `/project-previews/vibe-reel/${name}.webp`;

	const specs = [
		'HEVC · AV1 Direct Play',
		'HDR10 · Dolby Vision',
		'DD+ Atmos passthrough',
		'PGS subtitles'
	];

	const screens = [
		{
			src: img('tv-home'),
			title: 'Home',
			text: 'A hero for the title you are in the middle of, then Continue Watching, Next Up and what is trending on IMDb.'
		},
		{
			src: img('tv-detail'),
			title: 'Detail',
			text: 'Resume, start over, mark watched, and a trailer that plays in the app’s own player. Badges show what is really in the file.'
		},
		{
			src: img('tv-player'),
			title: 'Player',
			text: 'Chapter ticks on the scrubber, trickplay previews, Skip Intro, and audio, subtitle and picture-mode panels.'
		},
		{
			src: img('tv-search'),
			title: 'Search',
			text: 'Its own on-screen keyboard. Titles you don’t have can be added, and a download in progress shows up right in the results.'
		}
	];

	const trailerStages = [
		{
			title: 'YouTube DASH',
			text: 'best video up to 2160p (AV1 > VP9 > H.264) and the original-language audio, fetched in parallel'
		},
		{
			title: 'yt-dlp → ffmpeg',
			text: 'copied into fMP4 segments on the NAS, never re-encoded'
		},
		{
			title: 'Event playlist',
			text: 'a growing HLS playlist with an RFC 6381 codec string the TV accepts'
		},
		{
			title: 'MSE on the TV',
			text: '45 s buffered ahead, 15 s behind; gaps under 1 s are jumped'
		}
	];

	const refreshStages = [
		{ title: 'UI at 60 Hz', text: 'smooth focus movement' },
		{ title: '24p film plays', text: 'the panel switches to 48 Hz to match' },
		{
			title: 'Back to the UI',
			text: 'webOS leaves the panel at 48 Hz: 17–20% of frames “drop”'
		},
		{ title: '1 s 60p clip', text: 'played under the page, invisible to the user' },
		{ title: '60 Hz again', text: 'also run at launch and on resume' }
	];

	const stats = [
		{ value: '2,400', label: 'Vitest cases across TV, phone and web' },
		{ value: '1,210', label: 'pytest tests, network blocked, random order' },
		{ value: '202', label: 'end-to-end tests against fake servers' },
		{ value: '0', label: 'type errors in strict JSDoc checking' },
		{ value: '89–99%', label: 'mutation scores on the player engine' },
		{ value: '71.6%', label: 'top-1 search accuracy, up from 38%' }
	];

	let visible = $state(false);
	onMount(() => {
		visible = true;
	});
</script>

<svelte:head>
	<title>VibeReel · Kirill's Garden</title>
	<meta
		name="description"
		content="VibeReel: a Jellyfin client for LG webOS TVs, the iPhone and the browser. On the TV it plays the original file through the TV's own media pipeline, with HDR, Dolby Vision and Atmos passthrough."
	/>
</svelte:head>

<article class="vr">
	<header class="hero">
		<h1 class="page-heading">VibeReel.</h1>
		<p class="page-subtitle">
			A Jellyfin client for the TV, the iPhone and the browser, with an optional backend for
			Sonarr and Radarr. On LG webOS TVs it plays the original file, untouched.
		</p>

		<div class="stage">
			{#if visible}
				<div
					class="stage-tv"
					in:fly={{ y: -15, opacity: 0, duration: 600, easing: backInOut }}
				>
					<TvFrame
						srcs={[img('tv-home'), img('tv-detail'), img('tv-player')]}
						alt="VibeReel on the TV: home screen with Continue Watching"
						eager
					/>
				</div>
				<div
					class="stage-phone"
					in:fly={{ y: 20, opacity: 0, duration: 600, easing: backInOut }}
				>
					<PhoneFrame
						src={img('iphone-home')}
						alt="VibeReel on the iPhone: home screen"
					/>
				</div>
			{/if}
		</div>

		<ul class="specs">
			{#each specs as s (s)}<li>{s}</li>{/each}
		</ul>
		<div class="meta">
			<span>Svelte 5 · webOS · FastAPI · Nix · 2026</span>
			<a href={REPO} target="_blank" rel="noopener noreferrer">
				Source on GitHub <ArrowUpRight size="14" strokeWidth="2" />
			</a>
		</div>
	</header>

	<Section
		id="tv"
		heading="It feels like a native TV app, built entirely on web tech"
		lede="Svelte 5 in the TV's Chromium 120, driven by the remote's D-pad, packaged as a 147 KB webOS app."
	>
		<div class="screens">
			{#each screens as s (s.title)}
				<div class="screen">
					<TvFrame srcs={[s.src]} alt="VibeReel TV {s.title} screen" />
					<div class="screen-caption">
						<strong>{s.title}</strong>
						<span>{s.text}</span>
					</div>
				</div>
			{/each}
		</div>
	</Section>

	<Section
		id="phone"
		heading="The phone and the browser get the same engine"
		lede="Playback, track choice and the download feed live in one shared src/lib folder."
	>
		<div class="phone-row">
			<div class="phones">
				<PhoneFrame src={img('iphone-home')} alt="iPhone home screen" />
				<PhoneFrame src={img('iphone-player')} alt="iPhone player" />
			</div>
			<div class="phone-text">
				<p>
					<strong>The iPhone app</strong> is a home-screen PWA with its own touch UI on top
					of the TV's engine: offline downloads, AirPlay, and push notifications when a new
					season or a requested movie is ready.
				</p>
				<p>
					<strong>The web client</strong> puts the phone's screens in a desktop layout for Chrome
					and Firefox, with mouse and keyboard, and streams through Media Source Extensions.
				</p>
				<p>
					Both reach Jellyfin and reel-api through <strong>one HTTPS origin</strong>: the
					app at
					<code>/</code>, Jellyfin at <code>/jf</code>, reel-api at <code>/ml</code>. No
					CORS, and one service-worker scope.
				</p>
			</div>
		</div>
	</Section>

	<Section
		id="playback"
		heading="Nothing gets transcoded on the way to the TV's screen"
		lede="Most clients let the server transcode when unsure, and lose HDR or Atmos on the way. VibeReel leaves Jellyfin no such option."
	>
		<PlaybackFlow />
		{#snippet code()}
			<ul>
				<li>
					<code>deviceProfile(burn)</code> in <code>src/lib/tracks.js</code> builds the
					profile;
					<code>TranscodingProfiles</code> is empty unless a DVD subtitle needs burning in.
				</li>
				<li>
					An end-to-end “oracle mutant” adds a transcoding profile back on purpose, to
					prove the tests catch it.
				</li>
				<li>
					Audio switches in place through <code>video.audioTracks[i].enabled</code>,
					without restarting the stream. Crossing into or out of burn-in restarts at the
					same position and stops the old session, so the ffmpeg job on the NAS ends.
				</li>
			</ul>
		{/snippet}
	</Section>

	<Section
		id="audio"
		heading="The best audio a TV app can send is DD+, not TrueHD"
		lede="webOS passes lossless audio only from an HDMI input. Audio from an app leaves as PCM or Dolby Digital (Plus)."
	>
		<p>
			So when a file has both TrueHD and a DD+ Atmos track, and most do, VibeReel picks DD+:
			lossy Atmos, but the best the platform allows. Every audio track gets a score. Pick a
			file to see how the rules play out:
		</p>
		<AudioScore />
		{#snippet code()}
			<ul>
				<li>
					<code>score()</code> and <code>describeTracks()</code> in
					<code>src/lib/tracks.js</code>; this widget runs the same rules.
				</li>
				<li>
					A pick you make is remembered per series by meaning (language, forced, SDH), not
					by track index, so it carries over to episodes whose track order differs.
				</li>
				<li>
					The detail page still describes the file honestly: “TrueHD Atmos”, plus “plays
					as DD+ Atmos”.
				</li>
			</ul>
		{/snippet}
	</Section>

	<Section
		id="architecture"
		heading="Two required parts, four optional ones, and one of them runs as root"
		lede="The TV app and Jellyfin are all you need. Everything else adds features."
	>
		<ArchDiagram />
	</Section>

	<div class="divider">
		<span>Under the hood</span>
	</div>

	<Section
		id="downloads"
		heading="You can start watching a download before it finishes"
		lede="A title shows up in Sonarr or Radarr long before Jellyfin knows about it. reel-api makes it playable right away."
	>
		<p>
			Torrents normally fetch pieces in random order. reel-api makes qBittorrent download
			every grab
			<strong>in order, with the first and last pieces first</strong>, and serves the growing
			file with HTTP Range. An ffprobe of the first few MiB becomes a
			<strong>Jellyfin-shaped media source</strong> on the client, so the audio menu, track scoring
			and OSD work unchanged.
		</p>
		<DownloadBar />
		{#snippet code()}
			<ul>
				<li>
					<code>backend/…/streaming.py</code> maps byte ranges to piece indexes and waits
					at the frontier; <code>sourceFromProbe()</code> in
					<code>src/lib/pendingplay.js</code> builds the synthetic source.
				</li>
				<li>
					Reads go through 1 MiB chunks in a thread: an aborted stream draining into a
					dead socket once froze the event loop for about 30 s.
				</li>
				<li>
					The open file survives qBittorrent's move from incomplete/ to complete/, because
					the move is a rename on the same filesystem.
				</li>
				<li>
					webOS keeps the old media socket open after Back, so a per-download generation
					counter kills the superseded stream.
				</li>
			</ul>
		{/snippet}
	</Section>

	<Section
		id="picture"
		heading="A borrowed identity unlocks the TV's picture settings"
		lede="A webOS app may not change the picture mode. On rooted TVs, a 208-line companion service can."
	>
		<p>
			The service runs as root, outside the app jail, and registers on the system bus under a
			name the hub matches to LG's own Multi-View Settings app. That grants it that app's
			settings permission. Picture modes are stored per signal type (SDR, HDR10, Dolby
			Vision), so every change first reads the live one and echoes it back. On stock firmware
			nothing answers on the port, and the Picture button never appears.
		</p>
		<PictureSequence />
		{#snippet code()}
			<ul>
				<li>
					<code>service/service.js</code>: loopback HTTP on <code>127.0.0.1:8791</code>
					with
					<code>/health</code>, <code>/modes</code> and <code>/picture?mode=</code>.
				</li>
				<li>
					Every bus call has a 2.5 s deadline, under the app's 6 s timeout. Sets are
					serialized, and a newer one replaces a waiting one, so the queue is never longer
					than two.
				</li>
				<li>
					You pick the mode from the player's OSD, filtered to the modes valid for the
					current signal. It doesn't switch on its own.
				</li>
			</ul>
		{/snippet}
	</Section>

	<Section
		id="subtitles"
		heading="Bitmap subtitles are drawn on a canvas, and DVD ones are burned in"
		lede="Browsers render text cues. Blu-ray and DVD subtitles are pictures."
	>
		<div class="table-wrap">
			<table>
				<thead>
					<tr><th>Format</th><th>Path</th><th>Rendered by</th><th>Timing offset</th></tr>
				</thead>
				<tbody>
					<tr>
						<td>SRT · ASS · VTT</td>
						<td>fetched as VTT, wrapped in a same-origin Blob</td>
						<td><code>&lt;track&gt;</code></td>
						<td>±0.25 s steps, up to ±30 s</td>
					</tr>
					<tr>
						<td>PGS (Blu-ray)</td>
						<td>decoded in the client by libpgs</td>
						<td><code>&lt;canvas&gt;</code> over the video</td>
						<td>—</td>
					</tr>
					<tr>
						<td>VobSub · DVB</td>
						<td>burned into the picture by Jellyfin</td>
						<td>the video itself</td>
						<td>—</td>
					</tr>
				</tbody>
			</table>
		</div>
		{#snippet code()}
			<ul>
				<li>
					libpgs always runs in main-thread mode: its worker mode leaked one Worker per
					subtitle attach on this Chromium.
				</li>
				<li>
					A Vite plugin turns libpgs into a lazy factory at build time, cutting cold-start
					module evaluation from about 64 to 48 ms. It stays inside <code>app.js</code>,
					so the deploy's md5 check still covers it.
				</li>
				<li>
					Each cue keeps its original times, so repeated offset nudges never accumulate
					rounding error.
				</li>
			</ul>
		{/snippet}
	</Section>

	<Section
		id="skip"
		heading="Skip Intro trusts three sources, and distrusts one of them"
		lede="Jellyfin's recap detector marked cold opens, so recaps never come from it."
	>
		<SkipTimeline />
		{#snippet code()}
			<ul>
				<li>
					<code>findMarkers()</code> in <code>src/lib/segments.js</code>. Sanity bounds:
					an intro is 5–300 s and starts in the first 20 minutes; credits are at least 10
					s and in the second half.
				</li>
				<li>
					After a skip the chip stays hidden, because the seek lands on a keyframe about 3
					s short of the intro's end.
				</li>
				<li>
					A server upgrade once silently disabled the plugin, so a health check on the NAS
					now tests for it.
				</li>
			</ul>
		{/snippet}
	</Section>

	<Section
		id="trailers"
		heading="Trailers come from YouTube but play in the app's own player"
		lede="A YouTube embed fails inside a packaged webOS app, and the TV's HLS player treats a growing playlist as live."
	>
		<Pipeline stages={trailerStages} />
		<p>
			So the NAS repackages the trailer and the TV feeds Media Source Extensions itself. Cold,
			the first frame appears after about 4–5 s; a cached trailer starts in under a second. If
			anything fails, the app opens the YouTube app instead.
		</p>
	</Section>

	<Section
		id="performance"
		heading="Smooth at 60 fps on a TV's browser, by measuring every frame"
		lede="Three Cortex-A76 cores, Chromium 120 and a remote that auto-repeats."
	>
		<BeforeAfter />
		<p>
			<strong>The refresh-rate trap.</strong> Not every dropped frame was the app's fault:
		</p>
		<Pipeline stages={refreshStages} />
		{#snippet code()}
			<ul>
				<li>
					Large backdrops are decoded before they are shown: an undecoded 1920 px image
					blocked a frame for 60–220 ms, and <code>decoding="async"</code> does nothing on this
					TV.
				</li>
				<li>
					The D-pad engine (<code>src/lib/focus.js</code>) scores candidates geometrically
					with a 3× penalty off-axis, coalesces moves to one per frame, and glides
					scrolling toward a moving target instead of restarting it.
				</li>
				<li>
					Looping animations run three cycles and settle: one that never stopped cost
					16–25% of a core.
				</li>
			</ul>
		{/snippet}
	</Section>

	<Section
		id="builds"
		heading="One codebase ships three apps without touching each other's bytes"
		lede="The phone and web builds redirect a few modules and flip compile-time flags. The TV bundle never changes."
	>
		<ThreeBuilds />
		<p>
			Builds are deterministic, so an <strong>md5 match of a scratch build</strong> proves that
			a test- or docs-only change shipped nothing. Svelte doesn't fold constants in templates, so
			a small custom Vite plugin does it before compilation.
		</p>
	</Section>

	<Section
		id="testing"
		heading="About 3,800 tests, checked by mutation, run without the TV or the server"
		lede="Every test runs against fakes that follow Jellyfin's and reel-api's real API specs."
	>
		<div class="stats">
			{#each stats as s (s.label)}
				<div class="stat">
					<span class="stat-value">{s.value}</span>
					<span class="stat-label">{s.label}</span>
				</div>
			{/each}
		</div>
		<ul class="practices">
			<li>
				<strong>End-to-end</strong>: headless Chrome over the DevTools protocol, a stateful
				fake Jellyfin 12.1 and a fake reel-api. A test fails on any request outside the API
				spec, any request without a token, or any console error.
			</li>
			<li>
				<strong>Mutation testing</strong>: Stryker on the client, mutmut on the backend, and
				eight known past bugs re-introduced on purpose to prove the end-to-end tests catch
				each one.
			</li>
			<li>
				<strong>Ratchets</strong>: coverage floors (98.8% statements in
				<code>src/lib</code>) and strict type-check lists can only go up.
			</li>
			<li>
				<strong>Deploys</strong>: atomic swaps with md5 checks on the device; Nix provides
				the dev shell and a hardened NixOS module for reel-api.
			</li>
		</ul>
	</Section>

	<Section
		id="limits"
		heading="What it can't do"
		lede="Built for one setup: an LG C4 on webOS 10.3.1, Jellyfin 12.1 on a NixOS NAS, and an iPhone."
	>
		<ul class="limits">
			<li>
				Lossless TrueHD can't reach a soundbar from any TV app. DD+ Atmos is the ceiling.
			</li>
			<li>
				Picture-mode switching needs a rooted TV; everything else works on stock firmware.
			</li>
			<li>DVD and DVB subtitles are burned in, which is the one transcode on the TV.</li>
			<li>
				The phone and web clients remux every MKV and re-encode DTS and TrueHD audio; only
				the TV plays files untouched.
			</li>
			<li>Other TVs, webOS versions and servers will probably need adjusting.</li>
		</ul>
		<a class="repo-link" href={REPO} target="_blank" rel="noopener noreferrer">
			Read the code and the README on GitHub <ArrowUpRight size="16" strokeWidth="2" />
		</a>
	</Section>
</article>

<style>
	.vr {
		--vr-gold: #b08530;
		--vr-gold-ink: #8a6420;
		--vr-gold-fill: #e6b450;
		--vr-cream: #f8f5ee;
		--vr-ink: #16140f;
		--vr-muted: #5f594d;
		--vr-edge: #a8a29e;
		--vr-line: oklch(0.88 0 0);
	}

	@media (max-width: 480px) {
		.hero .page-heading {
			font-size: 4rem;
		}
	}

	.hero .page-subtitle {
		max-width: 60ch;
	}

	/* TV with the phone overlapping its right edge, sized in container units */
	.stage {
		position: relative;
		container-type: inline-size;
		aspect-ratio: 100 / 56;
		margin: 2rem 0 1.5rem;
	}

	.stage-tv {
		position: absolute;
		left: 0;
		top: 0;
		width: 80cqw;
	}

	.stage-phone {
		position: absolute;
		right: 1cqw;
		top: 8cqw;
		width: 21cqw;
	}

	.specs {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.specs li {
		font-size: 0.85rem;
		padding: 0.35rem 0.8rem;
		border-radius: 2rem;
		background: var(--vr-cream);
		color: var(--vr-gold-ink);
		border: 1px solid oklch(0.88 0.04 85);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5rem 1rem;
		margin-top: 1rem;
		font-size: 0.9rem;
		color: var(--color-font-light);
	}

	.meta a,
	.repo-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--color-font-dark);
		text-decoration: none;
	}

	.meta a:hover,
	.repo-link:hover {
		text-decoration: underline;
	}

	.screens {
		display: grid;
		gap: 1.5rem 1rem;
	}

	@media (min-width: 640px) {
		.screens {
			grid-template-columns: 1fr 1fr;
		}
	}

	.screen-caption {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.75rem 0.25rem 0;
	}

	.screen-caption strong {
		font-weight: 500;
		color: var(--color-font-dark);
	}

	.screen-caption span {
		font-size: 0.9rem;
		color: var(--vr-muted);
		line-height: 1.5;
	}

	.phone-row {
		display: grid;
		gap: 2rem;
		align-items: center;
	}

	@media (min-width: 1024px) {
		.phone-row {
			grid-template-columns: auto 1fr;
			gap: 3rem;
		}
	}

	.phones {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 15rem));
		gap: 1rem;
	}

	.phone-text p:first-child {
		margin-top: 0;
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: 6rem 0 -1rem;
		color: var(--color-font-light);
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		border-top: 1px solid oklch(0.9 0 0);
	}

	.table-wrap {
		overflow-x: auto;
		background: var(--color-background-tile);
		border-radius: 0.5rem;
		padding: 0.5rem 1.25rem;
	}

	table {
		width: 100%;
		min-width: 560px;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	th {
		text-align: left;
		font-weight: 500;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--vr-gold-ink);
		padding: 0.75rem 0.75rem 0.75rem 0;
	}

	td {
		padding: 0.75rem 0.75rem 0.75rem 0;
		border-top: 1px solid oklch(0.92 0 0);
		color: var(--vr-muted);
		vertical-align: top;
	}

	td:first-child {
		color: var(--color-font-dark);
		white-space: nowrap;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
	}

	@media (min-width: 1024px) {
		.stats {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.stat {
		background: var(--color-background-tile);
		border-radius: 0.5rem;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.stat-value {
		font-family: var(--font-secondary);
		font-size: 2.4rem;
		line-height: 1;
		color: var(--color-font-dark);
	}

	.stat-label {
		font-size: 0.85rem;
		color: var(--vr-muted);
	}

	.practices,
	.limits {
		padding-left: 1.1rem;
		margin: 1.5rem 0 0;
		display: grid;
		gap: 0.5rem;
	}

	.repo-link {
		margin-top: 1.5rem;
	}
</style>
