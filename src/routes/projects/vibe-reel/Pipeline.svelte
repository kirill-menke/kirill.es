<script>
	/*
	 * The trailer pipeline as a timeline, read left to right from pressing play to the first
	 * frame: a node per stage on a level rail, the stage's words above it and a note pencilled
	 * under it (a timing or an aside, in the italic of the page's other notes). In a panel too
	 * narrow for a column per stage (a phone) the rail stands up along the left edge and each
	 * note follows its stage's words.
	 *
	 * Each stage draws the rail from its node to the next one's, so the stages can be as wide or
	 * tall as their words make them.
	 */
	let { stages } = $props();

	const last = $derived(stages.length - 1);
	// The notes, a stage each: `time` is written large, the note after it. A number stays with
	// its unit where a line ends (no-break spaces), as in the stages' words.
	const NOTES = [
		{ time: '0\u00a0s', note: 'you press play, and both streams set off' },
		{ note: 'a straight copy, so nothing is lost' },
		{ note: 'the TV starts long before it ends' },
		{ time: '~4–5\u00a0s', note: 'to the first frame, under 1\u00a0s once cached' }
	];
</script>

<figure class="timeline vr-panel">
	<ol style:--stages={stages.length}>
		{#each stages as stage, i (stage.title)}
			{@const n = NOTES[i]}
			<li>
				<div class="what">
					<strong>{stage.title}</strong>
					<span class="text">{stage.text}</span>
				</div>
				{#if n}
					<p class="aside">
						{#if n.time}<span class="time">{n.time}</span>{/if}
						<span class="note">{n.note}</span>
					</p>
				{/if}
				{#if i < last}
					<span class="rail" aria-hidden="true"></span>
				{/if}
				<span class="node" class:last={i === last} aria-hidden="true"></span>
			</li>
		{/each}
	</ol>
</figure>

<style>
	/* A phone first: the rail along the left edge, notes under the words. --rx is the rail's
	   x, --ny a node's middle below the top of its row (the title's first line). On the
	   sketchbook's sheet, as the architecture diagram is (the page's --vr-paper and
	   --vr-paper-grain), in the panel's frame. */
	.timeline {
		--color-background-tile: var(--vr-paper);
		--panel-color: var(--vr-paper);
		--panel-image: var(--vr-paper-grain);
		container: timeline / inline-size;
	}

	ol {
		--rx: 0.45rem;
		--ny: 0.68rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.timeline ol li {
		position: relative;
		max-width: none;
		padding: 0 0 1.6rem 1.9rem;
	}

	.timeline ol li:last-child {
		padding-bottom: 0;
	}

	.what {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.timeline li strong {
		font-weight: 500;
		font-size: 0.95rem;
		line-height: 1.4;
		color: var(--color-font-dark);
	}

	.text {
		font-size: 0.82rem;
		line-height: 1.45;
		color: var(--vr-muted);
	}

	/* No short last line under a note that wraps (a phone): evened out where `pretty` is not
	   known (Firefox) */
	.timeline li p.aside {
		max-width: none;
		margin: 0.45rem 0 0;
		font-family: var(--font-secondary);
		font-style: italic;
		font-size: 0.92rem;
		line-height: 1.3;
		color: var(--vr-gold-ink);
		text-wrap: balance;
		text-wrap: pretty;
	}

	.time {
		font-size: 1.15em;
		color: var(--color-font-dark);
	}

	.time::after {
		content: ' · ';
		color: var(--vr-gold-ink);
	}

	/* The rail and its dots in the architecture diagram's pencil, on the bare sheet: the dots
	   drawn as its boxes' edges are, the rail as its frames */
	.node {
		position: absolute;
		z-index: 1;
		left: var(--rx);
		top: var(--ny);
		width: 0.8rem;
		height: 0.8rem;
		translate: -50% -50%;
		border-radius: 50%;
		background: var(--vr-paper);
		box-shadow: inset 0 0 0 1.3px var(--vr-pencil);
	}

	.node.last {
		width: 1rem;
		height: 1rem;
		background: radial-gradient(circle, var(--vr-pencil) 0 0.17rem, var(--vr-paper) 0.2rem);
	}

	/* This stage's stretch of the rail: from its node down to the next stage's */
	.rail {
		position: absolute;
		left: calc(var(--rx) - 0.75px);
		top: var(--ny);
		width: 1.5px;
		height: 100%;
		background: var(--vr-pencil-frame);
	}

	/* A column per stage, all of one width, so that the dots are a steady beat apart: three
	   rows shared by all of them (a subgrid), the words on top, the rail in the middle, the
	   notes under it. Each node sits under the start of its words and its stretch of the rail
	   reaches across the gap to the next one's. */
	@container timeline (min-width: 38rem) {
		ol {
			--gap: clamp(1.25rem, 3cqi, 2rem);
			--rx: 0.4rem;
			display: grid;
			grid-template-columns: repeat(var(--stages), minmax(0, 1fr));
			grid-template-rows: auto 2.4rem auto;
			column-gap: var(--gap);
		}

		.timeline ol li,
		.timeline ol li:last-child {
			display: grid;
			grid-row: span 3;
			grid-template-rows: subgrid;
			padding: 0;
		}

		.what {
			grid-row: 1;
		}

		.text {
			text-wrap: balance;
		}

		.timeline li p.aside {
			grid-row: 3;
			margin: 0.15rem 0 0;
			display: flex;
			flex-direction: column;
			gap: 0.1rem;
			rotate: -1.5deg;
			transform-origin: left top;
		}

		.time {
			font-size: 1.6rem;
			line-height: 1;
		}

		.time::after {
			content: none;
		}

		.note {
			text-wrap: balance;
		}

		.node {
			grid-area: 2 / 1;
			position: relative;
			left: var(--rx);
			top: auto;
			align-self: center;
			justify-self: start;
			translate: -50% 0;
		}

		.rail {
			grid-area: 2 / 1;
			position: relative;
			left: var(--rx);
			top: auto;
			align-self: center;
			justify-self: start;
			width: calc(100% + var(--gap));
			height: 1.5px;
		}
	}
</style>
