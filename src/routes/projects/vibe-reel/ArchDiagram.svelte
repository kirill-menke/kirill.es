<script>
	/*
	 * How VibeReel fits together, sketched in pencil on the page's sketchbook paper: the TV, the
	 * NAS, the phone and browser and the internet, the boxes in each and the edges between them
	 * (arch/data.js), the optional parts dashed. A still drawing: nothing in it is picked or
	 * pointed at. Narrower than its 760px, it scrolls sideways under a hint.
	 */
	import { edgeGroups } from './arch/data.js';
</script>

<figure class="arch vr-panel">
	<p class="hint" aria-hidden="true">scroll sideways →</p>
	<div class="scroll">
		<!-- The drawing reaches from 20 to 980 across and from 40 to 510 down: the view leaves
		     20 round it on every side -->
		<svg viewBox="0 20 1000 510" role="img" aria-labelledby="arch-title arch-desc">
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

			<!-- The machines' frames -->
			<rect class="group" x="20" y="40" width="300" height="290" rx="16" />
			<text class="group-label" x="40" y="68">LIVING-ROOM TV · LG WEBOS</text>

			<rect class="group" x="380" y="40" width="340" height="470" rx="16" />
			<text class="group-label" x="400" y="68">NAS · NIXOS</text>

			<rect class="group" x="780" y="40" width="200" height="216" rx="16" />
			<text class="group-label" x="800" y="68">PHONE &amp; BROWSER</text>

			<rect class="group faint" x="780" y="300" width="200" height="190" rx="16" />
			<text class="group-label" x="800" y="328">INTERNET</text>

			<!-- Edges (arch/data.js), each group with its labels -->
			{#each edgeGroups as group (group.edges[0].id)}
				<g>
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
			<rect class="node" x="40" y="90" width="260" height="86" rx="12" />
			<text class="node-title" x="58" y="118">TV app</text>
			<text class="node-sub" x="58" y="140">Svelte 5 · webOS IPK · Chromium 120</text>
			<text class="node-sub" x="58" y="160">&lt;video&gt; on the hardware video plane</text>

			<rect class="node optional" x="40" y="226" width="180" height="84" rx="12" />
			<text class="node-title" x="58" y="254">Companion service</text>
			<text class="node-sub" x="58" y="275">root · Node · port 8791</text>
			<text class="node-sub" x="58" y="294">Luna → settingsservice</text>

			<rect class="node device" x="200" y="408" width="120" height="56" rx="12" />
			<text class="node-title" x="218" y="434">Soundbar</text>
			<text class="node-sub" x="218" y="452">AV receiver</text>

			<!-- NAS -->
			<rect class="node" x="400" y="90" width="300" height="86" rx="12" />
			<text class="node-title" x="418" y="118">Jellyfin 12.1</text>
			<text class="node-sub" x="418" y="140">library · PlaybackInfo · trickplay</text>
			<text class="node-sub" x="418" y="160">Intro Skipper plugin → media segments</text>

			<rect class="node optional" x="400" y="246" width="300" height="86" rx="12" />
			<text class="node-title" x="418" y="274">reel-api</text>
			<text class="node-sub" x="418" y="296">FastAPI · Python 3.12 · one worker</text>
			<text class="node-sub" x="418" y="316"
				>search &amp; add · downloads · trailers · push</text
			>

			<!-- Sonarr and Radarr under reel-api's arrows, Prowlarr a row down between them -->
			<rect class="pill" x="400" y="384" width="68" height="34" rx="17" />
			<text class="pill-text" x="434" y="406" text-anchor="middle">Sonarr</text>
			<rect class="pill" x="496" y="384" width="68" height="34" rx="17" />
			<text class="pill-text" x="530" y="406" text-anchor="middle">Radarr</text>
			<rect class="pill muted-pill" x="446" y="456" width="72" height="34" rx="17" />
			<text class="pill-text" x="482" y="478" text-anchor="middle">Prowlarr</text>
			<rect class="pill" x="626" y="384" width="74" height="34" rx="17" />
			<text class="pill-text" x="663" y="406" text-anchor="middle">qBittorrent</text>

			<!-- Phone & browser -->
			<rect class="node optional" x="800" y="92" width="160" height="60" rx="12" />
			<text class="node-title" x="816" y="117">iPhone PWA</text>
			<text class="node-sub" x="816" y="137">Safari · offline · push</text>
			<rect class="node optional" x="800" y="176" width="160" height="60" rx="12" />
			<text class="node-title" x="816" y="201">Web client</text>
			<text class="node-sub" x="816" y="221">Chrome · Firefox · MSE</text>

			<!-- Internet -->
			<text class="list" x="800" y="362">IMDb trending &amp; charts</text>
			<text class="list" x="800" y="388">IntroDB skip markers</text>
			<text class="list" x="800" y="414">YouTube trailers (yt-dlp)</text>
			<text class="list" x="800" y="440">Radarr collections</text>
			<text class="list" x="800" y="466">Web Push to the iPhone</text>
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
		--panel-color: var(--vr-paper);
		--panel-image: var(--vr-paper-grain);
		container-type: inline-size;
		color: var(--vr-muted);
	}

	/* The drawing's darker gold, set on what the panel holds, so the ticket's perforation round
	   it stays in the panel palette's gold */
	.arch > * {
		--vr-gold: #4c4538;
	}

	/* A drawing with a min-width scrolls sideways inside its panel, under a hint that shows
	   once the panel is narrower than that (the svg's min-width below). The hint is in the
	   notes' hand, italic and in lower case, as the film strip's own hint is. */
	.scroll {
		overflow-x: auto;
	}

	.arch .hint {
		display: none;
		margin: 0 0 0.5rem;
		font-family: var(--font-secondary);
		font-size: 0.95rem;
		font-style: italic;
		color: var(--color-font-light);
	}

	@container (width < 760px) {
		.arch .hint {
			display: block;
		}
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
</style>
