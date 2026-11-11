<script>
	import { setContext } from 'svelte';
	import TweakPanel, { defaultsOf } from '#lib/components/TweakPanel.svelte';
	import Section from './Section.svelte';
	import Hero from './Hero.svelte';
	import TvScreens from './TvScreens.svelte';
	import Morph from './engine/Morph.svelte';
	import ArchDiagram from './ArchDiagram.svelte';
	import DownloadBar from './DownloadBar.svelte';
	import Pipeline from './Pipeline.svelte';
	import { sections, END_LINES } from './tweaks.js';
	import './ticket.css';

	// The refinements on trial (tweaks.js), each at the page as it ships until the dev-only
	// panel picks a proposal; the widgets read them through context
	let tweaks = $state(defaultsOf(sections));
	setContext('tweaks', () => tweaks);

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
</script>

<svelte:head>
	<title>VibeReel · Kirill's Garden</title>
	<meta
		name="description"
		content="VibeReel: a Jellyfin client for LG webOS TVs, the iPhone and the browser. On the TV it plays the original file through the TV's own media pipeline, with HDR, Dolby Vision and Atmos passthrough."
	/>
</svelte:head>

<!-- On trial, set for the whole page: how lines break (page.wrap), the tickets' frames
     (page.ticket, ticket.css), the sketched TVs' power light (hero.light: its gold, the
     sketchbook's wash at full strength), how far a block scrolls in before it is sharp
     (page.focus) and the room over a sub-heading (page.subgap); Section reads the last two -->
<article
	class="vr"
	data-wrap={tweaks['page.wrap']}
	data-ticket={tweaks['page.ticket']}
	style:--vr-light={tweaks['hero.light'] === 'lit' ? 'rgb(230 180 80)' : null}
	style:--focus-band={tweaks['page.focus'] === 'short' ? '8rem' : null}
	style:--sub-gap={tweaks['page.subgap'] === 'roomy' ? '5rem' : null}
>
	<Hero />

	<Section
		id="tv"
		heading="Feels native, runs on web tech"
		lede="Made for the couch: quick, smooth, and driven entirely by the arrow keys on the TV remote."
	>
		<TvScreens />
	</Section>

	<Section
		id="phone"
		heading="One engine, three screens"
		lede="Playback, track choice and the download feed are shared by every app."
	>
		<Morph />
	</Section>

	<Section
		id="architecture"
		heading="Small core, optional extras"
		lede="The TV app and Jellyfin are all you need. A rooted TV only adds features."
	>
		<ArchDiagram />

		<h3 id="downloads">Watch while it downloads</h3>
		<p>
			Sonarr and Radarr grab a title long before Jellyfin knows about it. reel-api has
			qBittorrent fetch it <strong>in order, first and last pieces first</strong>, and serves
			the growing file, so it plays right away.
		</p>
		<DownloadBar />

		<h3 id="trailers">YouTube trailers, own player</h3>
		<p>
			Up to 4K and in the original language, straight from YouTube. The NAS repackages each
			trailer and the TV feeds it to Media Source Extensions.
		</p>
		<Pipeline stages={trailerStages} />
	</Section>

	<!-- The page's last line, on trial (page.end) -->
	<div class="vr-end">
		{#if END_LINES[tweaks['page.end']]}
			<p>{END_LINES[tweaks['page.end']]}</p>
		{/if}
	</div>
</article>

<TweakPanel {sections} bind:values={tweaks} storage="vibe-reel-refine" />

<style>
	/* The page in black, white and greys: its gold drained to silver, its ink near black. The
	   panels (.vr-panel, below) are tinted sepia instead. */
	.vr {
		--vr-gold: #6f6f6f;
		--vr-gold-ink: #3f3f3f;
		--vr-gold-fill: #b7b7b7;
		--vr-cream: #f1f1f1;
		--vr-ink: #101010;
		--vr-muted: #565656;
		--vr-edge: #a4a4a4;
		--vr-line: oklch(0.88 0 0);
		--color-font-dark: #161616;
		/* The page behind the article, for halos and rings that keep a mark clear of a picture */
		--vr-page: var(--color-background);
		/* The sketchbook: the architecture diagram draws on this paper, with this grain, and
		   washes its boxes with rgb(230 180 80 / 0.13). --vr-wash is that wash on the paper,
		   solid, for a few highlights in the page's other drawings (sparingly; too pale for a
		   line on white). The download bar and the trailer timeline sit on the same sheet. */
		--vr-paper: #fbf8f0;
		--vr-paper-grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.42 0 0 0 0 0.36 0 0 0 0 0.26 0 0 0 0.11 0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23p)'/%3E%3C/svg%3E");
		--vr-wash: #f8efdb;
		/* The architecture diagram's pencil (its lines, the frames round its machines, its small
		   capitals), for the drawings under it that take it up on trial (tweaks.js) */
		--vr-pencil: #5c5446;
		--vr-pencil-frame: rgb(76 69 56 / 0.45);
		--vr-pencil-faint: #8b8171;
		/* The page's last line (.vr-end) is placed from the article's foot */
		position: relative;
	}

	/* Building blocks shared by the page's widgets. :where() keeps them at one class of
	   specificity, so each widget's scoped styles still override them.

	   Panels are tickets in sepia browns on parchment: a stock of the background tinted with
	   their gold (also the tile colour, --color-background-tile, for what they hold), or the
	   sheet a widget lays in them (--panel-color, --panel-image), scooped corners and a dashed
	   perforation inside the edge. corner-shape keeps the shadow on the scoops; where it is
	   missing, a mask cuts them instead and the shadow goes (ticket.css tries another way). */
	:where(.vr) :global(.vr-panel) {
		--vr-gold: #94704b;
		--vr-gold-ink: #6c5034;
		--vr-gold-fill: #cfa87c;
		--vr-cream: #f1e6d3;
		--vr-ink: #2f251b;
		--vr-muted: #6d6051;
		--vr-edge: #b0a08b;
		--vr-line: #e3d7c4;
		--color-font-dark: #3b2f24;
		--color-font-light: #a49481;
		--color-background: #fffbf4;
		--color-border: #dccfba;
		--stock: color-mix(in oklab, var(--color-background), var(--vr-gold-fill) 16%);
		--color-background-tile: var(--stock);
		margin: 0;
		padding: 1.25rem;
		background: var(--panel-image, none) var(--panel-color, var(--stock));
		border-radius: 1rem;
		corner-shape: scoop;
		box-shadow:
			0 1px 2px rgb(70 50 20 / 0.12),
			0 8px 20px -10px rgb(70 50 20 / 0.3);
		outline: 1.5px dashed color-mix(in oklab, var(--vr-gold) 55%, transparent);
		outline-offset: -0.55rem;
	}

	@media (min-width: 640px) {
		:where(.vr) :global(.vr-panel) {
			padding: 2rem;
		}
	}

	@supports not (corner-shape: scoop) {
		:where(.vr) :global(.vr-panel) {
			border-radius: 0;
			mask:
				radial-gradient(circle at 0 0, transparent 1rem, #000 calc(1rem + 0.5px)) 0 0 / 51%
					51% no-repeat,
				radial-gradient(circle at 100% 0, transparent 1rem, #000 calc(1rem + 0.5px)) 100%
					0 / 51% 51% no-repeat,
				radial-gradient(circle at 0 100%, transparent 1rem, #000 calc(1rem + 0.5px)) 0
					100% / 51% 51% no-repeat,
				radial-gradient(circle at 100% 100%, transparent 1rem, #000 calc(1rem + 0.5px)) 100%
					100% / 51% 51% no-repeat;
		}
	}

	:where(.vr) :global(.vr-card) {
		background: var(--color-background);
		border-radius: 0.5rem;
		padding: 0.9rem 1rem;
	}

	:where(.vr) :global(.vr-card > p) {
		margin: 0.4rem 0 0;
		font-size: 0.9rem;
	}

	:where(.vr) :global(.vr-eyebrow) {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--vr-gold-ink);
		font-weight: 600;
	}

	/* Diagrams with a min-width scroll inside their panel; each widget shows the hint with a
	   container query at its own min-width */
	:where(.vr) :global(.vr-hint) {
		display: none;
		margin: 0 0 0.5rem;
		font-size: 0.8rem;
	}

	:where(.vr) :global(.vr-scroll) {
		overflow-x: auto;
	}

	/* On trial (page.wrap): the page's short texts in lines of even length */
	.vr[data-wrap='balanced']
		:global(
			:is(
				.page-subtitle,
				.lede,
				.feature p,
				.caption .text,
				.morph .text p,
				.vr-section .body > p
			)
		) {
		text-wrap: balance;
	}

	/* On trial (page.end): the last line, in the notes' italic like an end title, halfway
	   between the last ticket and Rosie in the footer. The room between them is the last
	   section's margin, 8rem (it runs out through the article, which so ends at the ticket's
	   edge), then the footer's padding, 6rem on a phone and 10rem from 640px, and the 1rem
	   Rosie stands inside her box (Footer.svelte): 15rem, or 19rem. The line lies over the
	   middle of it and takes none of it, so the page ends where it would without one. It
	   comes into focus as the sections do. */
	.vr-end {
		position: absolute;
		inset: calc(100% + 7.5rem) 0 auto;
		translate: 0 -50%;
	}

	@media (min-width: 640px) {
		.vr-end {
			top: calc(100% + 9.5rem);
		}
	}

	.vr-end p {
		margin: 0;
		text-align: center;
		font: italic 1.5rem/1.3 var(--font-secondary);
		color: var(--vr-muted);
	}

	@media (max-width: 480px) {
		.vr-end p {
			font-size: 1.3rem;
		}
	}

	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.vr-end p {
				animation: focus linear backwards;
				animation-timeline: view();
				animation-range: entry 0% entry 10rem;
			}
		}
	}

	@keyframes focus {
		from {
			opacity: 0.35;
			filter: blur(10px);
			scale: 1.015;
		}
	}

	/* Film grain: a fixed layer of noise over the page, under the nav bar, that jumps a few
	   times a second like the grain of a projected print, and holds still with reduced motion */
	.vr::after {
		content: '';
		position: fixed;
		inset: -50%;
		z-index: 50;
		pointer-events: none;
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.12 0 0 0 0 0.09 0 0 0 0 0.05 2.2 0 0 0 -0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")
			0 0 / 200px 200px;
		opacity: 0.12;
		animation: grain 0.5s steps(1) infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.vr::after {
			animation: none;
		}
	}

	@keyframes grain {
		0% {
			translate: 0 0;
		}

		20% {
			translate: -7% 3%;
		}

		40% {
			translate: 4% -6%;
		}

		60% {
			translate: -3% -9%;
		}

		80% {
			translate: 8% 4%;
		}
	}
</style>
