<script>
	import { ArrowUpRight, ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { byCode, imageUrl, flags } from '#lib/flags/index.js';
	import ColourBar from './ColourBar.svelte';

	// variant 'centre' fits inside the ring (lead cut to three lines), 'panel' sits below it.
	let {
		code,
		pinned = false,
		variant = 'centre',
		onselect = () => {},
		onstep = () => {}
	} = $props();

	let flag = $derived(byCode[code]);
	let farthest = $derived(byCode[flag.farthest[0]]);
	let neighbour = $derived(flag.borderMatch && byCode[flag.borderMatch[0]]);
</script>

<article class="details {variant}">
	<div class="hero">
		{#if pinned}
			<button
				class="step"
				onclick={() => onstep(-1)}
				aria-label="Previous flag in the circle"
			>
				<ChevronLeft size="18" />
			</button>
		{/if}
		<img src={imageUrl(code)} alt="Flag of {flag.name}" />
		{#if pinned}
			<button class="step" onclick={() => onstep(1)} aria-label="Next flag in the circle">
				<ChevronRight size="18" />
			</button>
		{/if}
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

	<p class="lead">{flag.wiki.lead}</p>
	<a class="source" href={flag.wiki.url} target="_blank" rel="noopener noreferrer">
		{flag.wiki.title} on Wikipedia <ArrowUpRight size="12" />
	</a>

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

	.hero {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.hero img {
		display: block;
		height: 7.5rem;
		max-width: 12rem;
		object-fit: contain;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12)) drop-shadow(0 0 0.5px rgba(0, 0, 0, 0.4));
	}

	.centre .hero img {
		height: clamp(4rem, 22cqh, 8rem);
	}

	.step {
		display: flex;
		padding: 0.35rem;
		border: 0.5px solid var(--color-background-dark);
		border-radius: 100%;
		background: white;
		color: var(--color-font-light);
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.step:hover {
		color: var(--color-font-dark);
	}

	h2 {
		margin: 0.6rem 0 0;
		font-family: var(--font-secondary);
		font-size: 2rem;
		font-weight: 400;
		line-height: 1.1;
	}

	.where {
		margin: 0.2rem 0 0.8rem;
		font-size: 0.85rem;
		color: var(--color-font-light);
	}

	.dot {
		padding: 0 0.35rem;
	}

	.details :global(.bar),
	.details :global(.legend) {
		width: 100%;
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
	}

	.chip img {
		height: 1.4rem;
		max-width: 2.4rem;
		object-fit: contain;
		filter: drop-shadow(0 0 0.5px rgba(0, 0, 0, 0.5));
	}

	.lead {
		margin: 0.8rem 0 0.2rem;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--color-font-light);
	}

	.centre .lead {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
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
