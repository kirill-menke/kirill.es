<script>
	/*
	 * The page's header: title, subtitle, and the stage, with the link to the source at its top,
	 * over the features (hero/SourceLink.svelte). On the stage stand the set, the sketched TV
	 * with the bias light on the wall behind it (hero/BiasLight.svelte) and the soundbar under
	 * it, and beside it (under it on a narrow stage) the three things VibeReel does that a
	 * Jellyfin client usually doesn't, numbered (hero/Features.svelte).
	 *
	 * The set is the container its parts are sized against (cqw, the set being 100 wide) and the
	 * one the soundbar's container queries ask about; the stage, which lays out the set and the
	 * features, puts them side by side from 880 px.
	 */
	import TvFrame from './TvFrame.svelte';
	import Soundbar from './Soundbar.svelte';
	import { DRAWN } from '#lib/components/sketch/TvSketchPen.svelte';
	import SourceLink from './hero/SourceLink.svelte';
	import BiasLight from './hero/BiasLight.svelte';
	import Features from './hero/Features.svelte';
	import { REPO, img } from './media.js';

	const TV = [img('tv-home'), img('tv-detail'), img('tv-player')];
	const BLURB =
		'A Jellyfin client for the TV, the iPhone and the browser, with an optional backend for Sonarr and Radarr. On LG webOS TVs it plays the original file, untouched.';
	// What sets it apart, each in a line from the section that tells more
	const FEATURES = [
		{
			name: 'Play while downloading',
			line: 'reel-api has qBittorrent fetch a title in order, first and last pieces first, so it plays right away.'
		},
		{
			name: 'In-app YouTube trailers',
			line: 'Up to 4K and in the original language, straight from YouTube into its own player.'
		},
		{
			name: 'One backend for all devices',
			line: 'The TV, the iPhone and the browser share one engine and one reel-api.'
		}
	];
</script>

<header class="hero">
	<h1 class="page-heading">VibeReel.</h1>
	<p class="page-subtitle">{BLURB}</p>

	<!-- The TV's screen powers on once its frame is drawn (TvSketchPen's DRAWN) -->
	<div class="stage" style:--power-at="{DRAWN}ms">
		<div class="meta">
			<SourceLink href={REPO} />
		</div>
		<div class="set">
			<div class="tv-box">
				<BiasLight srcs={TV} />
				<TvFrame
					srcs={TV}
					alt="VibeReel on the TV: home screen with Continue Watching"
					eager
				>
					<div class="crt" aria-hidden="true"><i></i></div>
				</TvFrame>
			</div>
			<div class="soundbar">
				<Soundbar />
			</div>
		</div>
		<div class="features">
			<Features features={FEATURES} />
		</div>
	</div>
</header>

<style>
	@media (max-width: 480px) {
		.hero .page-heading {
			font-size: 4rem;
		}
	}

	/* In the grey of the page's running text, as the feature lines beside the TV */
	.hero .page-subtitle {
		max-width: 60ch;
		color: var(--vr-muted);
	}

	/* Over the stage, whose light on the wall reaches up behind it */
	.hero :global(.page-subtitle) {
		position: relative;
		z-index: 1;
	}

	/* The set, and the features under it or, on a wide stage, beside it. Its own stacking
	   context, so that the light behind the set stays on the page behind the devices. */
	.stage {
		--note-room: 4.5rem;
		position: relative;
		isolation: isolate;
		container-type: inline-size;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-top: 3.75rem;
	}

	/* The bottom margin leaves room for the soundbar's note */
	.set {
		container-type: inline-size;
		width: 100%;
		margin-bottom: var(--note-room);
	}

	/* Positioned for the bias light behind the TV */
	.tv-box {
		position: relative;
	}

	/* Under the TV and as wide as it, the bar's outline under the TV's */
	.soundbar {
		width: 100cqw;
		margin: 1rem auto 0;
	}

	/* The features' wrapper: below the set, or beside it on a wide stage */
	.features {
		margin: 0 0 2.5rem;
	}

	/* From 880 px the set takes the left 60 of the stage, and the features the rest after a gap,
	   centred on the set (whose margin they share). The gap is 6, and half as much again, 9,
	   on a stage wide enough to spare it (from 1200px, a window of 1280px or more). */
	@container (width >= 880px) {
		.set {
			width: 60cqw;
		}

		.features {
			flex: 1;
			margin: 0 0 var(--note-room) 6cqw;
			font-size: clamp(1rem, 1.35cqw, 1.1rem);
		}
	}

	@container (width >= 1200px) {
		.features {
			margin-left: 9cqw;
		}
	}

	/* The source link, at the top of the stage: a row of its own above the set, and from
	   1000 px over the features' column (the set's 60 and the features' gap of 6, or 9, to its
	   left), moved up beside the TV's top and scaled up about its left edge, where the note's
	   arrow comes in. A stage that is side by side but narrower than that (the page's 950px
	   column, in a window 1024 to 1279px wide) keeps the row: there the features stand taller
	   than the set and would reach up into the link. */
	.meta {
		position: relative;
		z-index: 1;
		display: flex;
		width: 100%;
		margin-bottom: 1rem;
		transform-origin: 0 50%;
	}

	@container (width >= 1000px) {
		.meta {
			position: absolute;
			top: 0;
			left: 66cqw;
			width: auto;
			margin: 0;
			translate: 48px -44px;
			scale: 1.2;
		}
	}

	@container (width >= 1200px) {
		.meta {
			left: 69cqw;
		}
	}

	/* Power on, in the TV's glass (TvFrame's children), so that it covers the screen and
	   nothing else: the screen's two halves closed over the picture until a bright line opens
	   them, the picture a little washed out at first. Open, and so invisible, at rest. */
	.crt {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.crt::before,
	.crt::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 50.5%;
		background: var(--color-device-screen);
		scale: 1 0;
	}

	.crt::before {
		top: 0;
		transform-origin: 50% 0;
	}

	.crt::after {
		bottom: 0;
		transform-origin: 50% 100%;
	}

	.crt i {
		position: absolute;
		left: 2%;
		right: 2%;
		top: 50%;
		height: 2px;
		margin-top: -1px;
		border-radius: 1px;
		background: #fffaf0;
		box-shadow:
			0 0 6px 1px rgb(255 245 225 / 0.9),
			0 0 24px 4px rgb(230 180 80 / 0.5);
		opacity: 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		/* The set fades in and draws its frame; then (--power-at) the screen powers on, the bias
		   light coming up with its picture; until then the screen is off, dark and unlit */
		.set {
			animation: fade 167ms ease-out backwards;
		}

		.crt {
			animation: glare 867ms ease-out var(--power-at) backwards;
		}

		.crt::before,
		.crt::after {
			animation: shutter 867ms var(--power-at) backwards;
		}

		.crt i {
			animation: line 867ms var(--power-at) backwards;
		}

		.tv-box > :global(.bias) {
			animation: light-up 867ms ease-out var(--power-at) backwards;
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	@keyframes glare {
		0%,
		30% {
			background-color: rgb(255 250 240 / 0.5);
		}
		100% {
			background-color: transparent;
		}
	}

	@keyframes shutter {
		0%,
		30% {
			scale: 1 1;
			animation-timing-function: cubic-bezier(0.6, 0, 0.3, 1);
		}
		62%,
		100% {
			scale: 1 0;
		}
	}

	@keyframes line {
		0%,
		12% {
			opacity: 1;
			transform: scaleX(0);
			animation-timing-function: cubic-bezier(0.3, 0, 0.2, 1);
		}
		30% {
			opacity: 1;
			transform: scaleX(1);
		}
		55%,
		100% {
			opacity: 0;
			transform: scaleX(1) scaleY(6);
		}
	}

	@keyframes light-up {
		0%,
		40% {
			opacity: 0;
		}
	}
</style>
