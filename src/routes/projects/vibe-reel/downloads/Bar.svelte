<script>
	/*
	 * The torrent as a bar of its pieces, a line for the playhead and a dashed one for the
	 * download frontier, labelled by hand: small italic serif notes standing a little above their
	 * lines' upper ends, and notes with drawn arrows on the bar's two ends.
	 *
	 * Live, the lines move with the download and the loading piece fills up. A note that would
	 * run off an end of the bar turns to the other side of its line. The playhead's note ends at
	 * its line and the frontier's starts at its own, so the two never meet while both keep their
	 * side; once one has turned towards the other and would run into it, it goes up a row and its
	 * line rises with it, clear of the other note.
	 */
	import { PIECES, pieceStates, progress, complete, summary, liveSummary } from './model.js';
	import { headFor } from './ink.js';

	let { dl, live = false } = $props();

	const pieces = $derived(pieceStates(dl));
	const at = (x) => (x / PIECES) * 100;

	// The bar's width and each note's, in px: 0 until measured, as when prerendering
	let width = $state(0);
	let playingWidth = $state(0);
	let frontierWidth = $state(0);
	const px = (x) => (x / PIECES) * width;

	/** The side of its line a note goes when the line is `x` pieces in and the note needs
	 *  `room` px: `preferred` if it fits there, else the side with more room */
	function side(x, room, preferred) {
		const spare = { left: px(x) - room, right: width - px(x) - room };
		const other = preferred === 'left' ? 'right' : 'left';
		if (!width || spare[preferred] >= 0) return preferred;
		return spare[other] > spare[preferred] ? other : preferred;
	}

	const playingSide = $derived(side(dl.playhead, playingWidth, 'left'));
	const frontierSide = $derived(side(dl.frontier, frontierWidth, 'right'));

	/** The px a note spans when its line is `x` pieces in and the note is `room` px wide */
	const span = (x, room, s) => (s === 'left' ? [px(x) - room, px(x)] : [px(x), px(x) + room]);
	// Turned notes keep this far apart, in px
	const APART = 12;
	/* The note that goes up a row when the two would meet: the one turned towards the other,
	   whose line then passes the other note by instead of crossing it */
	const raised = $derived.by(() => {
		// Unturned, the playhead's note ends where the frontier's starts
		if (!width || (playingSide === 'left' && frontierSide === 'right')) return null;
		const [a0, a1] = span(dl.playhead, playingWidth, playingSide);
		const [b0, b1] = span(dl.frontier, frontierWidth, frontierSide);
		if (a0 >= b1 + APART || b0 >= a1 + APART) return null;
		return frontierSide === 'left' ? 'frontier' : 'playhead';
	});

	// The loop starting over takes the lines back to the start: their notes jump there too
	const jump = $derived(live && dl.playhead === 0);

	// The end notes' arrows, from beside their text up to the first and the last piece
	const FIRST = 'M17 9C8 9 4 2 4 -10';
	const LAST = 'M-17 9C-8 9 -4 2 -4 -10';
</script>

{#snippet arrow(d)}
	<svg class="arrow" aria-hidden="true" focusable="false">
		<path class="stroke" pathLength="1" {d} />
		<path class="head" pathLength="1" d={headFor(d)} />
	</svg>
{/snippet}

<div class={['bar-wrap', jump && 'jump']} bind:clientWidth={width}>
	<div class={['playhead', raised === 'playhead' && 'raised']} style="left: {at(dl.playhead)}%">
		<!-- Both words, the one not meant hidden, so that the note keeps its width -->
		<i class="note {playingSide}" bind:clientWidth={playingWidth}>
			<span class:off={dl.waiting}>playing</span>
			<span class:off={!dl.waiting}>waiting</span>
		</i>
	</div>
	<div
		class={['frontier', raised === 'frontier' && 'raised', live && complete(dl) && 'gone']}
		style="left: {at(dl.frontier)}%"
	>
		<i class="note {frontierSide}" bind:clientWidth={frontierWidth}>download frontier</i>
	</div>
	<div
		class={['pieces', live && 'live']}
		role="img"
		aria-label={live ? liveSummary : summary}
		style="--n: {PIECES}"
	>
		{#each pieces as state, i (i)}
			<span
				class={state}
				title="Piece {i + 1}: {state}"
				style={live && state === 'loading' ? `--p: ${progress(dl)}` : undefined}
			></span>
		{/each}
	</div>
	<div class="ends">
		<span>first piece{@render arrow(FIRST)}</span>
		<span
			>last piece, fetched early so the container index is readable{@render arrow(LAST)}</span
		>
	</div>
</div>

<style>
	/* The lines stand a little above the bar and below it, each with its note right on its upper
	   end; a raised note's line reaches a row higher. A note going up rises before it turns, one
	   coming down turns first, so that it never brushes the other note on the way. */
	.bar-wrap {
		--row: 1.15rem;
		--reach: 0.4rem;
		position: relative;
		padding-top: calc(2 * var(--row) + var(--reach) + 0.2rem);
	}

	.pieces {
		display: grid;
		grid-template-columns: repeat(var(--n), 1fr);
		gap: 2px;
		height: 2.25rem;
	}

	.pieces span {
		border-radius: 3px;
	}

	/* A piece not yet in: an empty box in the architecture diagram's pencil */
	.pieces span:not(.done) {
		box-shadow: inset 0 0 0 1px var(--vr-pencil-frame);
	}

	.pieces .done {
		background: var(--vr-gold-fill);
	}

	/* Still (under reduced motion), the loading piece is half there */
	.pieces .loading {
		background: var(--vr-gold-fill);
		opacity: 0.6;
	}

	/* Live, it fills up from the bottom inside its box as it comes in */
	.pieces.live .loading {
		opacity: 1;
		background: linear-gradient(
			to top,
			var(--vr-gold-fill) calc(var(--p) * 100%),
			transparent 0
		);
	}

	.playhead,
	.frontier {
		position: absolute;
		top: calc(2 * var(--row) + 0.2rem);
		width: 0;
		height: calc(2.25rem + 2 * var(--reach));
		border-left: 2px solid var(--vr-ink);
		transition:
			top 0.25s ease 0.2s,
			height 0.25s ease 0.2s;
	}

	.frontier {
		border-left: 2px dashed var(--vr-gold-ink);
		transition:
			opacity 0.3s,
			top 0.25s ease 0.2s,
			height 0.25s ease 0.2s;
	}

	.frontier.gone {
		opacity: 0;
	}

	.raised {
		top: calc(var(--row) + 0.2rem);
		height: calc(2.25rem + 2 * var(--reach) + var(--row));
		transition-delay: 0s;
	}

	/* A note's baseline a little above its line's top, the note ending (on the left) or starting
	   (on the right) at the line */
	.note {
		position: absolute;
		bottom: 100%;
		left: 0;
		margin-bottom: calc(7px - 0.2em);
		font-family: var(--font-secondary);
		font-style: italic;
		font-size: 0.85rem;
		line-height: 1;
		white-space: nowrap;
		color: var(--color-font-dark);
		transition: transform 0.3s ease;
	}

	.raised .note {
		transition-delay: 0.2s;
	}

	.note.left {
		transform: translateX(calc(-100% - 4px));
	}

	.frontier .note {
		color: var(--vr-gold-ink);
	}

	.playhead .note {
		display: grid;
	}

	.playhead .note span {
		grid-area: 1 / 1;
	}

	.note.left span {
		justify-self: end;
	}

	.off {
		visibility: hidden;
	}

	/* The loop starting over: the notes go back to the start with their lines */
	.jump .playhead,
	.jump .note {
		transition: none;
	}

	.jump .frontier {
		transition: opacity 0.3s;
	}

	.ends {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 0.8rem;
		font-family: var(--font-secondary);
		font-style: italic;
		font-size: 1.05rem;
		line-height: 1.3;
		color: var(--vr-muted);
	}

	.ends span {
		position: relative;
		flex-shrink: 0;
		padding-left: 1.5rem;
	}

	/* Where it has to wrap (a phone), in lines of even length, no word left over on the last */
	.ends span:last-child {
		flex-shrink: 1;
		max-width: 26rem;
		padding: 0 1.5rem 0 0;
		text-align: right;
		text-wrap: balance;
	}

	.arrow {
		position: absolute;
		top: 0;
		left: 0;
		width: 1px;
		height: 1px;
		overflow: visible;
		pointer-events: none;
	}

	.ends span:last-child .arrow {
		left: auto;
		right: 0;
	}

	.arrow path {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* Written in when the page comes up: the text, then the end notes' arrows */
	.note,
	.ends span {
		animation: write 500ms 200ms ease-out backwards;
	}

	.stroke {
		stroke-dasharray: 1;
		animation: draw 500ms 550ms cubic-bezier(0.55, 0.1, 0.35, 1) backwards;
	}

	.head {
		stroke-dasharray: 1;
		animation: draw 180ms 1050ms ease-out backwards;
	}

	@keyframes write {
		from {
			opacity: 0;
			translate: 0 4px;
		}
	}

	@keyframes draw {
		from {
			stroke-dashoffset: 1;
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	@media (max-width: 639px) {
		.ends {
			font-size: 0.95rem;
		}

		.note {
			font-size: 0.8rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.note,
		.ends span,
		.stroke,
		.head {
			animation: none;
		}

		.playhead,
		.frontier,
		.note {
			transition: none;
		}
	}
</style>
