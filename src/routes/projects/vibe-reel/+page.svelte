<script>
	import Section from './Section.svelte';
	import Hero from './Hero.svelte';
	import TvScreens from './TvScreens.svelte';
	import Morph from './engine/Morph.svelte';
	import ArchDiagram from './ArchDiagram.svelte';
	import DownloadBar from './DownloadBar.svelte';
	import Pipeline from './Pipeline.svelte';

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

<article class="vr">
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

	<!-- The page's last line, like an end title -->
	<div class="vr-end"><p>Thanks for watching.</p></div>
</article>

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
		   capitals), which the drawings under it take up: the download bar's empty pieces and
		   its two frames, the trailer timeline's rail */
		--vr-pencil: #5c5446;
		--vr-pencil-frame: rgb(76 69 56 / 0.45);
		--vr-pencil-faint: #8b8171;
		/* The power light of the sets the page draws (TvSketch), lit: the sketchbook's gold at
		   full strength */
		--vr-light: rgb(230 180 80);
		/* The page's last line (.vr-end) is placed from the article's foot */
		position: relative;
	}

	/* The panel shared by the page's widgets. :where() keeps it at one class of specificity,
	   so each widget's scoped styles still override it.

	   Panels are tickets in sepia browns on parchment: a stock of the background tinted with
	   their gold (also the tile colour, --color-background-tile, for what they hold), or the
	   sheet a widget lays in them (--panel-color, --panel-image), with scooped corners, a
	   shadow that follows the scoops and a dashed perforation inside the edge.

	   That is the look of border-radius: 1rem with corner-shape: scoop, two box-shadows and a
	   dashed outline 0.55rem in. Only Chromium has corner-shape, so the ticket is drawn
	   instead, the same in every browser. The panel paints nothing itself: its ::before and
	   ::after draw the ticket behind its content (z-index -1, held inside the panel by
	   isolation), so the mask that cuts the scoops cuts only the sheet, never the content or
	   the shadow. ::after is the sheet, the panel's paper with the scoops masked out and the
	   perforation over it; ::before is the shadow. Both draw with border images, which keep
	   their corners at one size on a panel of any size, repeat their edges ('round' fits a
	   whole number of dashes to a side) and paint beyond the panel (the shadow) without
	   changing its box. An SVG image cannot read custom properties, so theirs spell out the
	   colours: the panel gold, #94704b, at 55% for the dashes and rgb(70 50 20) for the
	   shadows. */
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
		position: relative;
		isolation: isolate;
		margin: 0;
		padding: 1.25rem;
	}

	@media (min-width: 640px) {
		:where(.vr) :global(.vr-panel) {
			padding: 2rem;
		}
	}

	:where(.vr) :global(.vr-panel::before),
	:where(.vr) :global(.vr-panel::after) {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
	}

	/* The shadow. Its SVG blurs the scooped outline as the two box-shadows would (0 1px 2px
	   at 12% and 0 8px 20px -10px at 30%), the second shrunk by its spread, which makes its
	   scoops 10px wider, as Chrome draws it. The blur sits in an SVG pattern because Chrome
	   keeps a pattern as a picture: it would otherwise draw the corners again, blur and all,
	   whenever something over them repaints, as the download bar does on every frame. A 136px
	   ticket in the middle of a 200px SVG, cut 96px in from each side, so that a corner holds
	   2rem of shadow outside the panel and 4rem inside, where the blur settles. */
	:where(.vr) :global(.vr-panel::before) {
		border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23463214' color-interpolation-filters='sRGB'%3E%3Cpattern id='s' patternUnits='userSpaceOnUse' width='200' height='200'%3E%3Cfilter id='a' filterUnits='userSpaceOnUse'%3E%3CfeGaussianBlur stdDeviation='10'/%3E%3CfeOffset dy='8'/%3E%3C/filter%3E%3Cfilter id='b' filterUnits='userSpaceOnUse'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3CfeOffset dy='1'/%3E%3C/filter%3E%3Cpath filter='url(%23a)' fill-opacity='.3' d='M56 42H144A26 26 0 0 0 158 56V144A26 26 0 0 0 144 158H56A26 26 0 0 0 42 144V56A26 26 0 0 0 56 42Z'/%3E%3Cpath filter='url(%23b)' fill-opacity='.12' d='M48 32H152A16 16 0 0 0 168 48V152A16 16 0 0 0 152 168H48A16 16 0 0 0 32 152V48A16 16 0 0 0 48 32Z'/%3E%3C/pattern%3E%3Crect width='200' height='200' fill='url(%23s)'/%3E%3C/svg%3E")
			96 / 6rem / 2rem round;
	}

	/* The sheet. Each scoop's edge is soft over 1px. Unclipped, the mask leaves the sheet's
	   edges to the sheet: clipped to its box, it would soften one between device pixels. The
	   perforation is the dashed outline as Chrome draws it, which rounds 1.5px and -0.55rem to
	   whole pixels: a 1px line 7px to 8px in, 3px dashes and 2px gaps, round each scoop at
	   that distance; but every corner alike, with a dash on the middle of the arc and one
	   across each bend. Its SVG is cut 24px in: a corner holds an arc and its five dashes, an
	   edge one dash between two half gaps. */
	:where(.vr) :global(.vr-panel::after) {
		--scoop: transparent calc(1rem - 0.5px), #000 calc(1rem + 0.5px);
		background: var(--panel-image, none) var(--panel-color, var(--stock));
		mask:
			radial-gradient(circle at 0 0, var(--scoop)),
			radial-gradient(circle at 100% 0, var(--scoop)),
			radial-gradient(circle at 0 100%, var(--scoop)),
			radial-gradient(circle at 100% 100%, var(--scoop));
		mask-composite: intersect;
		mask-clip: no-clip;
		border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='53' height='53' fill='none' stroke='%2394704b' stroke-opacity='.55'%3E%3Cg stroke-dasharray='3 2' stroke-dashoffset='4'%3E%3Cpath id='c' pathLength='25' d='M24 7.5H22.27A23.5 23.5 0 0 1 7.5 22.27V24'/%3E%3Cuse href='%23c' transform='matrix(-1 0 0 1 53 0)'/%3E%3Cuse href='%23c' transform='matrix(1 0 0 -1 0 53)'/%3E%3Cuse href='%23c' transform='rotate(180 26.5 26.5)'/%3E%3C/g%3E%3Cpath d='M25 7.5h3M25 45.5h3M7.5 25v3M45.5 25v3'/%3E%3C/svg%3E")
			24 / 1.5rem round;
	}

	/* The page's short texts in lines of even length */
	.vr
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

	/* The page's last line, in the notes' italic like an end title, halfway between the last
	   ticket and Rosie in the footer. The room between them is the last section's margin, 8rem
	   (it runs out through the article, which so ends at the ticket's edge), then the footer's
	   padding, 6rem on a phone and 10rem from 640px, and the 1rem Rosie stands inside her box
	   (Footer.svelte): 15rem, or 19rem. The line lies over the middle of it and takes none of
	   it, so the page ends where it would without one. It comes into focus as the sections
	   do. */
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
