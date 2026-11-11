<script>
	/*
	 * How VibeReel fits together, sketched in pencil on the page's sketchbook paper: the TV, the
	 * NAS, the phone and browser and the internet, the boxes in each and the edges between them,
	 * the optional parts dashed. A still drawing: nothing in it is picked or pointed at.
	 *
	 * It is drawn twice from arch/data.js, and the window picks one. A wide page gets the
	 * landscape drawing, the machines side by side; narrower than its 760px (a tablet) it
	 * scrolls sideways under a hint, out to the ticket's edges, where it fades out. A phone
	 * (a window under 640px, the page's own breakpoint) gets the portrait drawing, the same
	 * machines one under another in the width of its column: nothing to scroll sideways.
	 */
	import { landscape, portrait } from './arch/data.js';

	const uid = $props.id();
</script>

<!-- One layout's drawing; `id` keeps its title, description and arrowhead apart from the other's -->
{#snippet drawing(layout, id)}
	<svg viewBox={layout.view.join(' ')} role="img" aria-labelledby="{id}-title {id}-desc">
		<title id="{id}-title">VibeReel architecture</title>
		<desc id="{id}-desc">
			The TV app Direct Plays files from Jellyfin on the NAS and sends audio to the soundbar
			as a bitstream. An optional root companion service on the TV switches picture modes. The
			optional reel-api on the NAS sits in front of Sonarr and Radarr, which search through
			Prowlarr, and of qBittorrent, which it has download in order. The iPhone PWA and the web
			client reach Jellyfin and reel-api.
		</desc>

		<!-- Heads drawn like the lines: open chevrons that carry the line on to their tip
		     (arch/data.js stops every line a head short of its target) -->
		<defs>
			<marker
				id="{id}-chevron"
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
		{#each layout.frames as frame (frame.label)}
			<rect
				class="group"
				class:faint={frame.faint}
				x={frame.x}
				y={frame.y}
				width={frame.w}
				height={frame.h}
				rx="16"
			/>
			<text class="group-label" x={frame.x + (frame.lx ?? 20)} y={frame.y + 28}
				>{frame.label}</text
			>
		{/each}

		<!-- The edges, each group with its labels -->
		{#each layout.edges as group (group.edges[0].id)}
			<g>
				{#each group.edges as edge (edge.id)}
					{#if edge.d}
						<path
							class="edge"
							class:optional={edge.optional}
							class:faint-edge={edge.faint}
							d={edge.d}
							marker-end="url(#{id}-chevron)"
						/>
					{:else}
						<line
							class="edge"
							class:optional={edge.optional}
							x1={edge.from[0]}
							y1={edge.from[1]}
							x2={edge.to[0]}
							y2={edge.to[1]}
							marker-end="url(#{id}-chevron)"
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

		<!-- The boxes: a title and its small print -->
		{#each layout.boxes as box (box.title)}
			<rect
				class="node"
				class:optional={box.optional}
				class:device={box.device}
				x={box.x}
				y={box.y}
				width={box.w}
				height={box.h}
				rx="12"
			/>
			<text class="node-title" x={box.x + box.at[0]} y={box.y + box.at[1]}>{box.title}</text>
			{#each box.sub as line, i (line)}
				<text class="node-sub" x={box.x + box.at[0]} y={box.y + box.at[2 + i]}>{line}</text>
			{/each}
		{/each}

		{#each layout.pills as pill (pill.text)}
			<rect
				class="pill"
				class:muted-pill={pill.muted}
				x={pill.x}
				y={pill.y}
				width={pill.w}
				height="34"
				rx="17"
			/>
			<text class="pill-text" x={pill.x + pill.w / 2} y={pill.y + 22} text-anchor="middle"
				>{pill.text}</text
			>
		{/each}

		{#each layout.lists as list (list.x)}
			{#each list.items as item, i (item)}
				<text class="list" x={list.x} y={list.y + i * list.step}>{item}</text>
			{/each}
		{/each}
	</svg>
{/snippet}

<figure class="arch vr-panel">
	<div class="tall">
		{@render drawing(portrait, `${uid}-tall`)}
	</div>
	<div class="wide">
		<p class="hint" aria-hidden="true">scroll sideways →</p>
		<div class="scroll">
			{@render drawing(landscape, `${uid}-wide`)}
		</div>
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

	svg {
		display: block;
		width: 100%;
		height: auto;
		font-family: var(--font-secondary);
		font-style: italic;
	}

	/* A phone's window gets the portrait drawing in place of the wide one: as wide as the
	   panel, though no wider than 25rem, past which its writing would outgrow the page's */
	.tall {
		display: none;
	}

	@media (width < 640px) {
		.wide {
			display: none;
		}

		.tall {
			display: block;
			max-width: 25rem;
			margin-inline: auto;
		}
	}

	/* The wide drawing has a min-width and scrolls sideways inside its panel, under a hint that
	   shows once the panel is narrower than that. The hint is in the notes' hand, italic and
	   in lower case, as the film strip's own hint is. */
	.scroll {
		overflow-x: auto;
	}

	/* (.arch keeps it over the section's rules for a paragraph) */
	.arch .hint {
		display: none;
		margin: 0 0 0.5rem;
		font-family: var(--font-secondary);
		font-size: 0.95rem;
		font-style: italic;
		color: var(--color-font-light);
	}

	.wide svg {
		min-width: 760px;
	}

	/* Scrolling, the drawing runs out through the panel's padding (--panel-pad) to the ticket's
	   edges and fades out across it, short of the perforation: the ticket does not cut it off
	   where its padding begins, it runs on under the edge. The drawing brings that padding
	   along as its own, so at either end of the scroll the padding is empty again and the
	   drawing whole. A pan past an end stays in the drawing (no swipe back through the
	   history). */
	@container (width < 760px) {
		.arch .hint {
			display: block;
		}

		.scroll {
			margin-inline: calc(var(--panel-pad) * -1);
			overscroll-behavior-x: contain;
			mask-image: linear-gradient(
				90deg,
				transparent 0.6rem,
				#000 var(--panel-pad),
				#000 calc(100% - var(--panel-pad)),
				transparent calc(100% - 0.6rem)
			);
		}

		.wide svg {
			box-sizing: content-box;
			width: 760px;
			min-width: 0;
			padding-inline: var(--panel-pad);
		}
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

	/* In the column a frame's name is written a little smaller and closer: the longest of them
	   has to stand between two lines that come down through its row */
	.tall .group-label {
		font-size: 10.5px;
		letter-spacing: 0.1em;
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

	/* Each edge ends in its drawing's chevron (its marker-end) */
	.edge {
		fill: none;
		stroke: var(--vr-edge);
		stroke-width: 1.3;
		stroke-linecap: round;
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
