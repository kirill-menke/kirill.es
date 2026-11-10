<script>
	import { ArrowUpRight, ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { byCode, imageUrl, flags } from '#lib/flags/index.js';
	import ColourBar from './ColourBar.svelte';

	// variant 'centre' fills the middle of the wreath, its lead cut to the sentences that fit;
	// 'panel' sits below the wreath on narrow screens, with the whole lead.
	let { code, variant = 'centre', onselect = () => {} } = $props();

	let flag = $derived(byCode[code]);
	let before = $derived(flags[(flag.index - 1 + flags.length) % flags.length]);
	let after = $derived(flags[(flag.index + 1) % flags.length]);
	let farthest = $derived(byCode[flag.farthest[0]]);
	let neighbour = $derived(flag.borderMatch && byCode[flag.borderMatch[0]]);

	// The lead in the middle ends at the last whole sentence that fits its room, never
	// mid-sentence; if not even the first one fits, only the link to the article shows.
	// Whitespace folded first: some leads break lines mid-sentence, which would end a sentence.
	const sentencesOf = (text) =>
		[
			...new Intl.Segmenter('en', { granularity: 'sentence' }).segment(
				text.replace(/\s+/g, ' ').trim()
			)
		].map((part) => part.segment);
	let sentences = $derived(sentencesOf(flag.wiki.lead));
	let room = $state(null); // the lead and its link: as big as the rest of the details leave
	let source = $state(null); // the link, which shares the room
	let roomWidth = $state(0);
	let roomHeight = $state(0);
	let fit = $state({ code: null, text: '' });

	$effect(() => {
		if (variant !== 'centre' || !room || !roomWidth) return;
		const space = roomHeight - source.offsetHeight - 4;
		// Try the sentences in a hidden copy of the paragraph, outside the page's own markup
		const style = getComputedStyle(room);
		const probe = document.createElement('p');
		Object.assign(probe.style, {
			position: 'absolute',
			top: '0',
			left: '-10000px',
			visibility: 'hidden',
			margin: '0',
			width: `${roomWidth}px`,
			font: style.font,
			letterSpacing: style.letterSpacing,
			textAlign: style.textAlign
		});
		document.body.append(probe);
		const text = (k) => sentences.slice(0, k).join('').trim();
		let k = sentences.length;
		for (; k > 0; k--) {
			probe.textContent = text(k);
			if (probe.offsetHeight <= space + 1) break;
		}
		probe.remove();
		fit = { code, text: text(k) };
	});

	let lead = $derived(variant !== 'centre' ? flag.wiki.lead : fit.code === code ? fit.text : '');
</script>

<article class="details {variant}">
	{#snippet adjacent(other, similarity, side)}
		<button
			class="neighbour"
			onclick={() => onselect(other.code)}
			title="{side === 'before'
				? 'Before'
				: 'After'} it in the circle: {other.name}, {similarity}% alike"
			aria-label="{side === 'before' ? 'Previous' : 'Next'} in the circle: {other.name}"
		>
			<span class="thumb">
				{#if side === 'before'}<ChevronLeft size="12" />{/if}
				<img src={imageUrl(other.code)} alt="" />
				{#if side === 'after'}<ChevronRight size="12" />{/if}
			</span>
			<span class="alike">{similarity}%</span>
		</button>
	{/snippet}

	<div class="hero">
		{@render adjacent(before, flag.prev, 'before')}
		<img class="main" src={imageUrl(code)} alt="Flag of {flag.name}" />
		{@render adjacent(after, flag.next, 'after')}
	</div>

	<h2>{flag.name}</h2>
	<p class="where">
		{flag.region}{#if flag.capital}<span class="dot">·</span>{flag.capital}{/if}
	</p>

	<ColourBar colors={flag.colors} />

	<div class="matches">
		<span class="label">Closest colours</span>
		<div class="chips">
			{#each flag.matches as [other, similarity] (other)}
				<button
					class="chip"
					onclick={() => onselect(other)}
					title="{byCode[other].name}: {similarity}% similar"
				>
					<img src={imageUrl(other)} alt={byCode[other].name} />
					<span>{similarity}%</span>
				</button>
			{/each}
		</div>
	</div>

	<div class="lead" bind:this={room} bind:clientWidth={roomWidth} bind:clientHeight={roomHeight}>
		{#if lead}
			<p class="text">{lead}</p>
		{/if}
		<a
			class="source"
			href={flag.wiki.url}
			target="_blank"
			rel="noopener noreferrer"
			title="{flag.wiki.title} on Wikipedia"
			bind:this={source}
		>
			Wikipedia <ArrowUpRight size="12" />
		</a>
	</div>

	<dl class="facts">
		<div>
			<dt>In the circle</dt>
			<dd>{flag.index + 1} of {flags.length}</dd>
		</div>
		<div>
			<dt>Most different</dt>
			<dd>{farthest.name}, {flag.farthest[1]}%</dd>
		</div>
		<div>
			<dt>Most similar neighbour</dt>
			<dd>{neighbour ? `${neighbour.name}, ${flag.borderMatch[1]}%` : 'no land borders'}</dd>
		</div>
		<div>
			<dt>Uniqueness</dt>
			<dd>
				{flag.uniqueness === 1
					? 'the most unique'
					: `rank ${flag.uniqueness} of ${flags.length}`}
			</dd>
		</div>
	</dl>
</article>

<style>
	.details {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		width: 100%;
		max-width: 30rem;
		color: var(--color-font-dark);
	}

	/* In the wreath: exactly the square in its middle, scaled to it, the lead taking what is left */
	.details.centre {
		height: 100%;
		max-width: none;
	}

	.hero {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.hero .main {
		display: block;
		height: 7.5rem;
		max-width: 12rem;
		object-fit: contain;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12)) drop-shadow(0 0 0.5px rgba(0, 0, 0, 0.4));
	}

	.centre .hero .main {
		height: clamp(2.5rem, 15cqh, 8rem);
	}

	.neighbour {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		padding: 0.3rem;
		border: 0.5px solid transparent;
		border-radius: 0.4rem;
		background: none;
		font: inherit;
		font-size: 0.7rem;
		color: var(--color-font-light);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	/* Opaque, so they hide the wreath's lines without the text's halo */
	.neighbour:hover {
		border-color: var(--color-background-dark);
		background: white;
		color: var(--color-font-dark);
		text-shadow: none;
	}

	.thumb {
		display: flex;
		align-items: center;
		gap: 0.15rem;
	}

	.thumb img {
		height: 1.6rem;
		max-width: 2.6rem;
		object-fit: contain;
		filter: var(--flag-outline);
	}

	h2 {
		margin: 0.6rem 0 0;
		font-family: var(--font-secondary);
		font-size: 2rem;
		font-weight: 400;
		line-height: 1.1;
	}

	.centre h2 {
		margin-top: 0.3rem;
		font-size: clamp(1.25rem, 6.5cqh, 2rem);
	}

	.centre .where {
		margin-bottom: 0.5rem;
	}

	.centre .matches {
		margin-top: 0.5rem;
	}

	.where {
		margin: 0.2rem 0 0.8rem;
		font-size: 0.85rem;
		color: var(--color-font-light);
	}

	.dot {
		padding: 0 0.35rem;
	}

	.matches {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		margin-top: 0.8rem;
	}

	.label,
	dt {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-font-light);
	}

	.chips {
		display: flex;
		gap: 0.4rem;
	}

	.chip {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		padding: 0.3rem;
		border: 0.5px solid transparent;
		border-radius: 0.35rem;
		background: none;
		font: inherit;
		font-size: 0.75rem;
		color: var(--color-font-light);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.chip:hover {
		border-color: var(--color-background-dark);
		background: white;
		color: var(--color-font-dark);
		text-shadow: none;
	}

	.chip img {
		height: 1.4rem;
		max-width: 2.4rem;
		object-fit: contain;
		filter: var(--flag-outline);
	}

	.lead {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0.6rem 0 0;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--color-font-light);
	}

	/* The room the lead and its link may fill: whatever the rest leaves, whatever the text.
	   3/8 of the room they leave goes above them and 5/8 below, so with the margin the gap
	   above is 3/4 of what centring them would give. */
	.centre .lead {
		flex: 1 1 0;
		min-height: 0;
		width: 100%;
		margin: 0.3rem 0 0.1rem;
		overflow: hidden;
	}

	.centre .lead::before,
	.centre .lead::after {
		content: '';
		flex: 3 0 0;
	}

	.centre .lead::after {
		flex-grow: 5;
	}

	.text {
		margin: 0 0 0.2rem;
	}

	.source {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		font-size: 0.75rem;
		color: var(--color-font-light);
		text-decoration: none;
	}

	.source:hover {
		color: var(--color-font-dark);
		text-decoration: underline;
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem 1.5rem;
		width: 100%;
		margin: 0.9rem 0 0;
	}

	.centre .facts {
		gap: 0.3rem 1rem;
		width: 88%;
		margin-top: 0.4rem;
	}

	.centre dd {
		font-size: 0.8rem;
	}

	.facts div {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	dd {
		margin: 0;
		font-size: 0.85rem;
	}
</style>
