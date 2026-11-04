<script>
	/* Elements tag themselves with data-flow; picking a flow dims everything outside it */
	const flows = [
		{ key: 'playback', label: 'Media path' },
		{ key: 'control', label: 'Library & downloads' },
		{ key: 'picture', label: 'Picture mode' },
		{ key: 'phone', label: 'Phone & web' }
	];

	let active = $state(null);
	let pinned = $state(null);
	const shown = $derived(active ?? pinned);
</script>

<figure class="arch">
	<div class="legend" role="group" aria-label="Highlight a flow">
		{#each flows as f (f.key)}
			<button
				class="chip chip-{f.key}"
				aria-pressed={pinned === f.key}
				onmouseenter={() => (active = f.key)}
				onmouseleave={() => (active = null)}
				onfocus={() => (active = f.key)}
				onblur={() => (active = null)}
				onclick={() => (pinned = pinned === f.key ? null : f.key)}
			>
				<span class="swatch" aria-hidden="true"></span>{f.label}
			</button>
		{/each}
		<span class="key"><span class="dash" aria-hidden="true"></span>dashed = optional</span>
	</div>

	<p class="hint" aria-hidden="true">Scroll sideways →</p>
	<div class="scroll">
		<svg
			viewBox="0 0 1000 530"
			role="img"
			aria-labelledby="arch-title arch-desc"
			data-active={shown}
		>
			<title id="arch-title">VibeReel architecture</title>
			<desc id="arch-desc">
				The TV app Direct Plays files from Jellyfin on the NAS and sends audio to the
				soundbar as a bitstream. An optional root companion service on the TV switches
				picture modes. The optional reel-api on the NAS sits in front of Sonarr, Radarr and
				qBittorrent. The iPhone PWA and web client reach Jellyfin and reel-api through one
				HTTPS origin.
			</desc>

			<defs>
				<marker
					id="arrow"
					viewBox="0 0 10 10"
					refX="9"
					refY="5"
					markerWidth="10"
					markerHeight="10"
					orient="auto-start-reverse"
					markerUnits="userSpaceOnUse"
				>
					<path d="M0,0 L10,5 L0,10 z" class="arrowhead" />
				</marker>
			</defs>

			<!-- Groups -->
			<rect class="group" x="20" y="40" width="300" height="290" rx="16" />
			<text class="group-label" x="40" y="68">LIVING-ROOM TV · LG WEBOS</text>

			<rect class="group" x="380" y="40" width="340" height="470" rx="16" />
			<text class="group-label" x="400" y="68">NAS · NIXOS</text>

			<rect class="group" x="780" y="40" width="200" height="232" rx="16" />
			<text class="group-label" x="800" y="68">PHONE &amp; BROWSER</text>

			<rect class="group faint" x="780" y="300" width="200" height="210" rx="16" />
			<text class="group-label" x="800" y="328">INTERNET</text>

			<!-- Edges -->
			<g data-flow="playback">
				<line
					class="edge media"
					x1="300"
					y1="118"
					x2="396"
					y2="118"
					marker-end="url(#arrow)"
				/>
				<text class="edge-label" x="348" y="106" text-anchor="middle">Direct Play</text>
			</g>
			<g data-flow="playback control">
				<line class="edge" x1="300" y1="152" x2="396" y2="152" marker-end="url(#arrow)" />
				<text class="edge-label" x="348" y="170" text-anchor="middle">REST API</text>
			</g>
			<g data-flow="playback">
				<line
					class="edge media"
					x1="260"
					y1="176"
					x2="260"
					y2="404"
					marker-end="url(#arrow)"
				/>
				<text class="edge-label" x="250" y="362" text-anchor="end">DD+ · Atmos · DTS</text>
				<text class="edge-label" x="250" y="378" text-anchor="end">bitstream over eARC</text
				>
			</g>
			<g data-flow="picture">
				<line class="edge" x1="100" y1="176" x2="100" y2="222" marker-end="url(#arrow)" />
				<text class="edge-label" x="110" y="204">loopback HTTP</text>
			</g>
			<g data-flow="control">
				<path
					class="edge optional"
					d="M300,166 C350,166 345,290 396,290"
					marker-end="url(#arrow)"
				/>
				<text class="edge-label" x="356" y="232">/api · streams</text>
			</g>
			<g data-flow="control">
				<line class="edge" x1="550" y1="246" x2="550" y2="180" marker-end="url(#arrow)" />
				<text class="edge-label" x="560" y="218">checks the Jellyfin token</text>
			</g>
			<g data-flow="control">
				<line class="edge" x1="434" y1="332" x2="434" y2="398" marker-end="url(#arrow)" />
				<line class="edge" x1="508" y1="332" x2="508" y2="398" marker-end="url(#arrow)" />
				<line class="edge" x1="663" y1="332" x2="663" y2="398" marker-end="url(#arrow)" />
			</g>
			<g data-flow="control">
				<path
					class="edge faint-edge"
					d="M700,310 C745,310 740,400 776,400"
					marker-end="url(#arrow)"
				/>
			</g>
			<g data-flow="phone">
				<line
					class="edge optional"
					x1="800"
					y1="122"
					x2="704"
					y2="122"
					marker-end="url(#arrow)"
				/>
				<text class="edge-label" x="752" y="112" text-anchor="middle">HLS remux</text>
				<path
					class="edge optional"
					d="M800,206 C750,206 745,276 704,276"
					marker-end="url(#arrow)"
				/>
			</g>

			<!-- TV -->
			<g data-flow="playback control picture">
				<rect class="node" x="40" y="90" width="260" height="86" rx="12" />
				<text class="node-title" x="58" y="118">TV app</text>
				<text class="node-sub" x="58" y="140">Svelte 5 · webOS IPK · Chromium 120</text>
				<text class="node-sub" x="58" y="160"
					>&lt;video&gt; on the hardware video plane</text
				>
			</g>
			<g data-flow="picture">
				<rect class="node optional" x="40" y="226" width="180" height="84" rx="12" />
				<text class="node-title" x="58" y="254">Companion service</text>
				<text class="node-sub" x="58" y="275">root · Node · port 8791</text>
				<text class="node-sub" x="58" y="294">Luna → settingsservice</text>
			</g>
			<g data-flow="playback">
				<rect class="node device" x="200" y="408" width="120" height="56" rx="12" />
				<text class="node-title" x="218" y="434">Soundbar</text>
				<text class="node-sub" x="218" y="452">AV receiver</text>
			</g>

			<!-- NAS -->
			<g data-flow="playback control phone">
				<rect class="node" x="400" y="90" width="300" height="86" rx="12" />
				<text class="node-title" x="418" y="118">Jellyfin 12.1</text>
				<text class="node-sub" x="418" y="140">library · PlaybackInfo · trickplay</text>
				<text class="node-sub" x="418" y="160">Intro Skipper plugin → media segments</text>
			</g>
			<g data-flow="control phone">
				<rect class="node optional" x="400" y="246" width="300" height="86" rx="12" />
				<text class="node-title" x="418" y="274">reel-api</text>
				<text class="node-sub" x="418" y="296">FastAPI · Python 3.12 · one worker</text>
				<text class="node-sub" x="418" y="316"
					>search &amp; add · downloads · trailers · push</text
				>
			</g>
			<g data-flow="control">
				<rect class="pill" x="400" y="402" width="68" height="34" rx="17" />
				<text class="pill-text" x="434" y="424" text-anchor="middle">Sonarr</text>
				<rect class="pill" x="474" y="402" width="68" height="34" rx="17" />
				<text class="pill-text" x="508" y="424" text-anchor="middle">Radarr</text>
				<rect class="pill muted-pill" x="548" y="402" width="72" height="34" rx="17" />
				<text class="pill-text" x="584" y="424" text-anchor="middle">Prowlarr</text>
				<rect class="pill" x="626" y="402" width="74" height="34" rx="17" />
				<text class="pill-text" x="663" y="424" text-anchor="middle">qBittorrent</text>
				<text class="caption" x="400" y="466"
					>Sonarr and Radarr search through Prowlarr;</text
				>
				<text class="caption" x="400" y="484"
					>reel-api makes qBittorrent download in order.</text
				>
			</g>

			<!-- Phone & browser -->
			<g data-flow="phone">
				<rect class="node optional" x="800" y="92" width="160" height="60" rx="12" />
				<text class="node-title" x="816" y="117">iPhone PWA</text>
				<text class="node-sub" x="816" y="137">Safari · offline · push</text>
				<rect class="node optional" x="800" y="176" width="160" height="60" rx="12" />
				<text class="node-title" x="816" y="201">Web client</text>
				<text class="node-sub" x="816" y="221">Chrome · Firefox · MSE</text>
				<text class="caption mono" x="800" y="258">one origin: / · /jf · /ml</text>
			</g>

			<!-- Internet -->
			<g data-flow="control">
				<text class="list" x="800" y="362">IMDb trending &amp; charts</text>
				<text class="list" x="800" y="388">IntroDB skip markers</text>
				<text class="list" x="800" y="414">YouTube trailers (yt-dlp)</text>
				<text class="list" x="800" y="440">Radarr collections</text>
				<text class="list" x="800" y="466">Web Push to the iPhone</text>
			</g>
		</svg>
	</div>
	<figcaption>
		Hover or tap a flow to highlight it. Only the TV app and Jellyfin are required.
	</figcaption>
</figure>

<style>
	.hint {
		display: none;
		margin: 0 0 0.5rem;
		font-size: 0.8rem;
		color: var(--color-font-light);
	}

	@media (max-width: 760px) {
		.hint {
			display: block;
		}
	}

	.arch {
		margin: 0;
		background: var(--color-background-tile);
		border-radius: 0.5rem;
		padding: 1.25rem;
	}

	@media (min-width: 640px) {
		.arch {
			padding: 2rem;
		}
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 1rem;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font: inherit;
		font-size: 0.85rem;
		border: 0.5px solid lightgrey;
		background: var(--color-background);
		color: var(--color-font-dark);
		padding: 0.35rem 0.8rem;
		border-radius: 2rem;
		cursor: pointer;
	}

	.chip[aria-pressed='true'] {
		border-color: var(--vr-ink);
		box-shadow: inset 0 0 0 1px var(--vr-ink);
	}

	.swatch {
		width: 0.9rem;
		height: 0.25rem;
		border-radius: 1rem;
		background: var(--vr-edge);
	}

	.chip-playback .swatch {
		background: var(--vr-gold-fill);
		height: 0.35rem;
	}

	.key {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
		color: var(--color-font-light);
		margin-left: 0.4rem;
	}

	.dash {
		width: 1.2rem;
		border-top: 2px dashed var(--vr-gold);
	}

	.scroll {
		overflow-x: auto;
	}

	svg {
		display: block;
		width: 100%;
		min-width: 760px;
		height: auto;
		font-family: var(--font-primary);
	}

	.group {
		fill: var(--color-background);
		stroke: oklch(0.9 0 0);
		stroke-width: 1;
	}

	.group.faint {
		fill: none;
		stroke-dasharray: 4 4;
	}

	.group-label {
		font-size: 11px;
		letter-spacing: 0.08em;
		fill: var(--color-font-light);
	}

	.node {
		fill: var(--vr-cream);
		stroke: var(--vr-gold);
		stroke-width: 1.5;
	}

	.node.optional {
		stroke-dasharray: 6 5;
	}

	.node.device {
		fill: var(--color-background);
		stroke: var(--vr-edge);
	}

	.node-title {
		font-size: 15px;
		font-weight: 500;
		fill: var(--vr-ink);
	}

	.node-sub {
		font-size: 11.5px;
		fill: var(--vr-muted);
	}

	.pill {
		fill: var(--color-background);
		stroke: var(--vr-edge);
	}

	.muted-pill {
		stroke-dasharray: 3 3;
	}

	.pill-text {
		font-size: 11.5px;
		fill: var(--vr-ink);
	}

	.edge {
		fill: none;
		stroke: var(--vr-edge);
		stroke-width: 1.5;
	}

	.edge.media {
		stroke: var(--vr-gold-fill);
		stroke-width: 4;
	}

	.edge.optional {
		stroke-dasharray: 6 5;
	}

	.faint-edge {
		stroke-dasharray: 3 4;
	}

	.arrowhead {
		fill: var(--vr-edge);
	}

	.edge-label,
	.caption {
		font-size: 11px;
		fill: var(--vr-muted);
	}

	/* A halo so labels stay legible where they cross group borders */
	.edge-label {
		paint-order: stroke;
		stroke: var(--color-background-tile);
		stroke-width: 4px;
		stroke-linejoin: round;
	}

	.mono {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		fill: var(--vr-gold-ink);
	}

	.list {
		font-size: 12px;
		fill: var(--vr-muted);
	}

	[data-flow] {
		transition: opacity 0.15s ease;
	}

	svg[data-active='playback'] [data-flow]:not([data-flow~='playback']),
	svg[data-active='control'] [data-flow]:not([data-flow~='control']),
	svg[data-active='picture'] [data-flow]:not([data-flow~='picture']),
	svg[data-active='phone'] [data-flow]:not([data-flow~='phone']) {
		opacity: 0.15;
	}

	figcaption {
		margin-top: 0.75rem;
		font-size: 0.85rem;
		color: var(--color-font-light);
	}
</style>
