<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { byCode, flags, imageUrl, meta, stats } from '$lib/flags/index.js';

	let { onselect = () => {}, delay = 0 } = $props();

	const enter = (k) => ({
		y: -15,
		opacity: 0,
		duration: 500,
		delay: delay + k * 125,
		easing: backInOut
	});
	const count = flags.length;
	const top = stats.census[0];
	const loner = byCode[stats.loners[0][0]];
	const widest = byCode[stats.widest];
	const tallest = byCode[stats.tallest];
	const square = stats.square.map((code) => byCode[code]);
	const colourful = stats.mostColours.map((code) => byCode[code]);

	// Height:width as flags are usually given, e.g. 2:3 (aspect = width / height).
	function ratio(aspect) {
		for (let height = 1; height <= 30; height++) {
			const width = Math.round(aspect * height);
			if (Math.abs(aspect - width / height) < 0.003) return `${height}:${width}`;
		}
		return `1:${aspect.toFixed(2)}`;
	}

	const join = (names) =>
		names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
</script>

{#snippet mini(code, size = 'small')}
	<button class="mini {size}" onclick={() => onselect(code)} title={byCode[code].name}>
		<img src={imageUrl(code)} alt={byCode[code].name} />
	</button>
{/snippet}

<div class="grid-container stats">
	<section class="tile grid-item span-2-cols" in:fly={enter(0)}>
		<header><span class="tile-header-text">Flags · Colour census</span></header>
		<div class="body">
			<h3>
				{top.family[0].toUpperCase() + top.family.slice(1)} flies on {top.flags} of {count} flags.
			</h3>
			<ul class="census">
				{#each stats.census as row (row.family)}
					<li>
						<span class="family">{row.family}</span>
						<span class="track">
							<span
								class="fill"
								style="width: {(row.flags / count) * 100}%; background: {row.hex}"
							></span>
						</span>
						<span class="number">{row.flags}</span>
					</li>
				{/each}
			</ul>
			<p class="note">A flag counts when the colour covers at least 2% of it.</p>
		</div>
	</section>

	<section class="tile" in:fly={enter(1)}>
		<header><span class="tile-header-text">Flags · Colour twins</span></header>
		<div class="body">
			<h3>Same colours, different flags.</h3>
			<ul class="groups">
				{#each stats.twins as group (group.join())}
					<li>
						<span class="row">
							{#each group as code (code)}{@render mini(code)}{/each}
						</span>
						<span class="caption">{join(group.map((code) => byCode[code].name))}</span>
					</li>
				{/each}
			</ul>
			<p class="note">Their palettes match exactly; only the layout tells them apart.</p>
		</div>
	</section>

	<section class="tile" in:fly={enter(2)}>
		<header><span class="tile-header-text">Flags · Lone wolves</span></header>
		<div class="body">
			<h3>{loner.name} has no close match.</h3>
			<ul class="list">
				{#each stats.loners.slice(0, 4) as [code, similarity] (code)}
					<li>
						{@render mini(code)}
						<span>
							<span class="strong">{byCode[code].name}</span>: closest is
							{byCode[byCode[code].matches[0][0]].name}, {similarity}%
						</span>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="tile" in:fly={enter(3)}>
		<header><span class="tile-header-text">Flags · Odd shapes</span></header>
		<div class="body">
			<h3>Only one flag isn't a rectangle.</h3>
			<ul class="list">
				<li>
					{@render mini(tallest.code, 'tall')}
					<span><span class="strong">{tallest.name}</span>: a concave pentagon</span>
				</li>
				<li>
					{@render mini(widest.code)}
					<span
						><span class="strong">{widest.name}</span>: the widest, {ratio(
							widest.aspect
						)}</span
					>
				</li>
				{#each square as flag (flag.code)}
					<li>
						{@render mini(flag.code, 'square')}
						<span
							><span class="strong">{flag.name}</span>: the only square one, 1:1</span
						>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="tile" in:fly={enter(4)}>
		<header><span class="tile-header-text">Flags · Palettes</span></header>
		<div class="body">
			<h3>
				{join(colourful.map((flag) => flag.name))} use {stats.colourCounts[
					colourful[0].code
				]} colours.
			</h3>
			<span class="row">
				{#each colourful as flag (flag.code)}{@render mini(flag.code, 'large')}{/each}
			</span>
			<p class="note">
				{stats.twoColour} flags make do with just two. Colours under 1% of a flag are not counted.
			</p>
		</div>
	</section>

	<section class="tile grid-item span-2-cols" in:fly={enter(5)}>
		<header><span class="tile-header-text">Flags · How the circle was made</span></header>
		<ol class="steps body">
			<li>
				<p>
					<span class="strong">Download.</span> All {count} flags of the UN member states,
					as SVG from flagcdn.com.
				</p>
			</li>
			<li>
				<p>
					<span class="strong">Count.</span> Draw each flag at 1,500 px and count every pixel's
					colour, merging shades the eye can't tell apart.
				</p>
			</li>
			<li>
				<p>
					<span class="strong">Compare.</span> Two flags are as different as the least colour
					you must change to repaint one palette into the other. Hue counts twice as much as
					saturation and brightness, and any colour covering a tenth of a flag counts in full,
					so shape barely matters.
				</p>
			</li>
			<li>
				<p>
					<span class="strong">Arrange.</span> Find the circle with the smallest
					difference between neighbours, plus a pull of {meta.pull} per place towards each
					flag's {meta.matches} closest matches, so whole colour families end up together.
					Neighbours are now {meta.mean_similarity}% alike on average.
				</p>
			</li>
		</ol>
		<p class="note body credits">
			Sources: flags from <a
				href="https://flagcdn.com"
				target="_blank"
				rel="noopener noreferrer">flagcdn.com</a
			>; capitals and borders from
			<a href="https://github.com/mledoze/countries" target="_blank" rel="noopener noreferrer"
				>mledoze/countries</a
			>
			(ODbL); flag descriptions quote the first sentences of each flag's English Wikipedia article
			(<a
				href="https://creativecommons.org/licenses/by-sa/4.0/"
				target="_blank"
				rel="noopener noreferrer">CC BY-SA 4.0</a
			>).
		</p>
	</section>

	<section class="tile grid-item full" in:fly={enter(6)}>
		<header><span class="tile-header-text">Flags · The circle, unrolled</span></header>
		<div class="strip body">
			{#each flags as flag (flag.code)}{@render mini(flag.code)}{/each}
		</div>
	</section>
</div>

<style>
	.stats {
		margin-top: 0.5rem;
	}

	.tile {
		padding-bottom: 1.25rem;
	}

	.tile:hover .mini img {
		filter: drop-shadow(0 0 0.5px rgba(0, 0, 0, 0.5));
	}

	.full {
		grid-column: 1 / -1;
	}

	header {
		padding: 0.75rem 1.25rem 0;
	}

	.body {
		padding: 0 1.25rem;
	}

	h3 {
		margin: 1.25rem 0 1rem;
		font-family: var(--font-secondary);
		font-size: 1.5rem;
		font-weight: 400;
		line-height: 1.25;
		color: var(--color-font-dark);
	}

	.note {
		margin: 0.8rem 0 0;
		font-size: 0.8rem;
		color: var(--color-font-light);
	}

	.credits {
		margin-top: 1.25rem;
		line-height: 1.5;
	}

	.credits a {
		color: var(--color-font-light);
	}

	.credits a:hover {
		color: var(--color-font-dark);
	}

	.strong {
		color: var(--color-font-dark);
	}

	ul,
	ol {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.census li {
		display: grid;
		grid-template-columns: 4rem 1fr 2rem;
		align-items: center;
		gap: 0.75rem;
		padding: 0.2rem 0;
		font-size: 0.85rem;
		color: var(--color-font-light);
	}

	.track {
		height: 0.6rem;
		border-radius: 0.3rem;
		background: var(--color-background-dark);
		overflow: hidden;
	}

	.fill {
		display: block;
		height: 100%;
		border-radius: 0.3rem;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
	}

	.number {
		text-align: right;
		color: var(--color-font-dark);
	}

	.groups li {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 0.35rem 0;
	}

	.caption,
	.list li {
		font-size: 0.85rem;
		color: var(--color-font-light);
	}

	.list li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.3rem 0;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.mini {
		display: flex;
		flex-shrink: 0;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		transition: transform 0.1s linear;
	}

	.mini:hover {
		transform: rotate(-5deg) scale(1.15);
	}

	.mini img {
		width: 2.1rem;
		height: 1.4rem;
		object-fit: contain;
		filter: drop-shadow(0 0 0.5px rgba(0, 0, 0, 0.5));
	}

	.mini.large img {
		width: 4.5rem;
		height: 3rem;
	}

	.mini.tall img,
	.mini.square img {
		width: 1.4rem;
	}

	.steps {
		display: grid;
		gap: 0.8rem;
		margin-top: 1.25rem;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--color-font-light);
		counter-reset: step;
	}

	.steps li {
		counter-increment: step;
		display: grid;
		grid-template-columns: 1.5rem 1fr;
	}

	.steps p {
		margin: 0;
	}

	.steps li::before {
		content: counter(step);
		font-family: var(--font-secondary);
		color: var(--color-font-dark);
	}

	.strip {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: 1rem;
	}
</style>
