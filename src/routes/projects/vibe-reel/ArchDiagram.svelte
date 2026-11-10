<script>
	/*
	 * How VibeReel fits together, sketched in pencil on the page's sketchbook paper: the TV, the
	 * NAS, the phone and browser and the internet, the boxes in each and the edges between them
	 * (arch/data.js). Every part tags itself with the flows that run through it (data-flow); the
	 * chips over the drawing pick one, which dims everything outside it, the frames round the
	 * machines included, and circles the chip by hand (arch/ChipMark.svelte). Narrower than its
	 * 760px, the drawing scrolls sideways under a hint.
	 */
	import { flows, edgeGroups } from './arch/data.js';
	import ChipMark from './arch/ChipMark.svelte';

	let active = $state(null);
	let pinned = $state(null);
	const shown = $derived(active ?? pinned);

	// A hover or keyboard focus previews a flow; a click pins it. Touch fires no hover, and a click
	// clears the preview, so a tap or Enter always shows the new pinned state. Leaving a chip
	// clears only its own preview: clicking another chip blurs this one after the new one's
	// hover has started, and clearing then would flash the old pinned flow.
	const preview = (key) => (e) => {
		if (e.pointerType === 'mouse' || e.currentTarget.matches(':focus-visible')) active = key;
	};
	const unpreview = (key) => () => {
		if (active === key) active = null;
	};

	// A chip's part in that: pinned, previewed (on show over the pinned flow) or neither. The
	// pinned chip keeps its mark while another is previewed.
	const pick = (key) => (pinned === key ? 'pinned' : shown === key ? 'preview' : undefined);
</script>

<figure class="arch vr-panel">
	<div class="key">
		<div class="legend" role="group" aria-label="Highlight a flow">
			{#each flows as f, i (f.key)}
				{@const picked = pick(f.key)}
				<button
					class="chip chip-{f.key}"
					aria-pressed={pinned === f.key}
					onpointerenter={preview(f.key)}
					onpointerleave={unpreview(f.key)}
					onfocus={preview(f.key)}
					onblur={unpreview(f.key)}
					onclick={() => {
						pinned = pinned === f.key ? null : f.key;
						active = null;
					}}
				>
					<span class="swatch" aria-hidden="true"></span>{f.label}
					{#if picked}
						<ChipMark pinned={picked === 'pinned'} seed={i + 1} />
					{/if}
				</button>
			{/each}
		</div>
		<span class="optional"><span class="dash" aria-hidden="true"></span>optional</span>
	</div>

	<p class="vr-hint" aria-hidden="true">Scroll sideways →</p>
	<div class="vr-scroll">
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
				picture modes. The optional reel-api on the NAS sits in front of Sonarr and Radarr,
				which search through Prowlarr, and of qBittorrent, which it has download in order.
				The iPhone PWA and the web client reach Jellyfin and reel-api.
			</desc>

			<!-- Heads drawn like the lines: open chevrons that carry the line on to their tip
			     (arch/data.js stops every line a head short of its target) -->
			<defs>
				<marker
					id="arch-chevron"
					viewBox="0 0 10 10"
					refX="0"
					refY="5"
					markerWidth="10"
					markerHeight="10"
					orient="auto-start-reverse"
					markerUnits="userSpaceOnUse"
				>
					<path d="M0,5 L9,5 M3.5,1.5 L9,5 L3.5,8.5" class="chevron" />
				</marker>
			</defs>

			<!-- Groups, each as part of the flows that run through it, so that a picked flow
			     fades the frames it leaves out with the rest -->
			<g data-flow="playback control picture">
				<rect class="group" x="20" y="40" width="300" height="290" rx="16" />
				<text class="group-label" x="40" y="68">LIVING-ROOM TV · LG WEBOS</text>
			</g>

			<g data-flow="playback control phone">
				<rect class="group" x="380" y="40" width="340" height="470" rx="16" />
				<text class="group-label" x="400" y="68">NAS · NIXOS</text>
			</g>

			<g data-flow="phone">
				<rect class="group" x="780" y="40" width="200" height="216" rx="16" />
				<text class="group-label" x="800" y="68">PHONE &amp; BROWSER</text>
			</g>

			<g data-flow="control">
				<rect class="group faint" x="780" y="300" width="200" height="190" rx="16" />
				<text class="group-label" x="800" y="328">INTERNET</text>
			</g>

			<!-- Edges (arch/data.js) -->
			{#each edgeGroups as group (group.edges[0].id)}
				<g data-flow={group.flow}>
					{#each group.edges as edge (edge.id)}
						{#if edge.d}
							<path
								class="edge"
								class:optional={edge.optional}
								class:faint-edge={edge.faint}
								d={edge.d}
							/>
						{:else}
							<line
								class="edge"
								class:optional={edge.optional}
								x1={edge.from[0]}
								y1={edge.from[1]}
								x2={edge.to[0]}
								y2={edge.to[1]}
							/>
						{/if}
					{/each}
					{#each group.labels ?? [] as label (label.text)}
						<text class="edge-label" x={label.x} y={label.y} text-anchor={label.anchor}
							>{label.text}</text
						>
					{/each}
				</g>
			{/each}

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
			<!-- Sonarr and Radarr under reel-api's arrows, Prowlarr a row down between them -->
			<g data-flow="control">
				<rect class="pill" x="400" y="384" width="68" height="34" rx="17" />
				<text class="pill-text" x="434" y="406" text-anchor="middle">Sonarr</text>
				<rect class="pill" x="496" y="384" width="68" height="34" rx="17" />
				<text class="pill-text" x="530" y="406" text-anchor="middle">Radarr</text>
				<rect class="pill muted-pill" x="446" y="456" width="72" height="34" rx="17" />
				<text class="pill-text" x="482" y="478" text-anchor="middle">Prowlarr</text>
				<rect class="pill" x="626" y="384" width="74" height="34" rx="17" />
				<text class="pill-text" x="663" y="406" text-anchor="middle">qBittorrent</text>
			</g>

			<!-- Phone & browser -->
			<g data-flow="phone">
				<rect class="node optional" x="800" y="92" width="160" height="60" rx="12" />
				<text class="node-title" x="816" y="117">iPhone PWA</text>
				<text class="node-sub" x="816" y="137">Safari · offline · push</text>
				<rect class="node optional" x="800" y="176" width="160" height="60" rx="12" />
				<text class="node-title" x="816" y="201">Web client</text>
				<text class="node-sub" x="816" y="221">Chrome · Firefox · MSE</text>
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
</figure>

<style>
	/* Pencil on the page's sketchbook paper (--vr-paper, --vr-paper-grain), in the panel's frame
	   like the download bar and the trailer timeline under it. Its inks re-point the colour
	   tokens the rules below paint with: labels handwritten, the boxes washed with gold, and
	   every line, the media path's too, in the same pen. */
	.arch {
		--color-background-tile: var(--vr-paper);
		--color-background: transparent;
		--color-font-dark: #3a342b;
		--color-font-light: #8b8171;
		--color-border: #6f675a;
		--vr-ink: #2f2a23;
		--vr-muted: #5f5748;
		--vr-cream: rgb(230 180 80 / 0.13);
		--vr-edge: #5c5446;
		container-type: inline-size;
		color: var(--vr-muted);
		background-color: var(--vr-paper);
		background-image: var(--vr-paper-grain);
	}

	/* The drawing's darker gold, set on what the panel holds, so the ticket's perforation round
	   it stays in the panel palette's gold */
	.arch > * {
		--vr-gold: #4c4538;
	}

	/* The svg's min-width below */
	@container (width < 760px) {
		.vr-hint {
			display: block;
		}
	}

	/* The key: the flow chips, and at the end of their row (under them, once they wrap) what a
	   dashed line means */
	.key {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1.5rem;
		margin-bottom: 1rem;
	}

	/* Room round each chip for its loop, two side by side (one pinned, one previewed) */
	.legend {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}

	.optional {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-left: auto;
		font-family: var(--font-secondary);
		font-size: 0.95rem;
		font-style: italic;
		color: var(--color-font-light);
	}

	.dash {
		width: 1.2rem;
		border-top: 2px dashed var(--vr-gold);
	}

	/* Hand-drawn, each corner its own ellipse, and positioned for its mark (ChipMark); pinned,
	   its outline is inked over */
	.chip {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font: inherit;
		font-family: var(--font-secondary);
		font-size: 0.95rem;
		font-style: italic;
		border: 1.3px solid var(--color-border);
		background: transparent;
		color: var(--color-font-dark);
		padding: 0.35rem 0.8rem;
		border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
		cursor: pointer;
	}

	.chip[aria-pressed='true'] {
		border-color: var(--vr-ink);
	}

	.swatch {
		width: 0.9rem;
		height: 0.15rem;
		border-radius: 1rem;
		background: var(--vr-edge);
	}

	/* The media path's swatch in the chip's own ink, a shade darker than the others */
	.chip-playback .swatch {
		background: currentColor;
	}

	svg {
		display: block;
		width: 100%;
		min-width: 760px;
		height: auto;
		font-family: var(--font-secondary);
		font-style: italic;
	}

	.group {
		fill: var(--color-background);
		stroke: rgb(76 69 56 / 0.45);
		stroke-width: 1.3;
		stroke-linejoin: round;
	}

	.group.faint {
		fill: none;
		stroke-dasharray: 4 4;
	}

	.group-label {
		font-size: 11.5px;
		letter-spacing: 0.14em;
		fill: var(--color-font-light);
	}

	.node {
		fill: var(--vr-cream);
		stroke: var(--vr-gold);
		stroke-width: 1.3;
		stroke-linejoin: round;
	}

	.node.optional {
		stroke-dasharray: 6 5;
	}

	.node.device {
		fill: var(--color-background);
		stroke: var(--vr-edge);
	}

	.node-title {
		font-size: 17px;
		fill: var(--vr-ink);
	}

	.node-sub {
		font-size: 12.5px;
		fill: var(--vr-muted);
	}

	.pill {
		fill: var(--color-background);
		stroke: var(--vr-edge);
		stroke-width: 1.3;
		stroke-linejoin: round;
	}

	.muted-pill {
		stroke-dasharray: 3 3;
	}

	.pill-text {
		font-size: 12.5px;
		fill: var(--vr-ink);
	}

	.edge {
		fill: none;
		stroke: var(--vr-edge);
		stroke-width: 1.3;
		stroke-linecap: round;
		marker-end: url(#arch-chevron);
	}

	.edge.optional {
		stroke-dasharray: 6 5;
	}

	.faint-edge {
		stroke-dasharray: 3 4;
	}

	.chevron {
		fill: none;
		stroke: var(--vr-edge);
		stroke-width: 1.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* A halo so labels stay legible where they cross group borders */
	.edge-label {
		font-size: 12.5px;
		fill: var(--vr-muted);
		paint-order: stroke;
		stroke: var(--color-background-tile);
		stroke-width: 4px;
		stroke-linejoin: round;
	}

	.list {
		font-size: 13px;
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
</style>
