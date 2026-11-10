<script>
	// Throwaway comparison page for the home-page Flags tile. Not linked; delete when done.
	import TileGrid from '#lib/components/tiles/TileGrid.svelte';
	import { count } from 'virtual:flags-tile';
	import { tiles } from '#lib/components/tiles/index.js';
	import { projects, hobbies, books } from '#lib/tile-data.js';
	import Weave from './Weave.svelte';
	import Aura from './Aura.svelte';
	import Iris from './Iris.svelte';
	import Threads from './Threads.svelte';
	import FanDeck from './FanDeck.svelte';
	import RoseWindow from './RoseWindow.svelte';
	import Seeds from './Seeds.svelte';
	import SeedsGrow from './SeedsGrow.svelte';
	import SeedsSunflower from './SeedsSunflower.svelte';
	import SeedsDots from './SeedsDots.svelte';

	const variants = [
		{ group: 'Seeds', key: 'seeds', label: 'G · Seeds', component: Seeds },
		{ group: 'Seeds', key: 'seeds-grow', label: 'G1 · Growing', component: SeedsGrow },
		{
			group: 'Seeds',
			key: 'seeds-sunflower',
			label: 'G2 · Sunflower',
			component: SeedsSunflower
		},
		{ group: 'Seeds', key: 'seeds-dots', label: 'G3 · Pointillism', component: SeedsDots },
		{
			group: 'Seeds',
			key: 'seeds-badges',
			label: 'G4 · Flag badges (default)',
			component: tiles.badges.component
		},
		{ group: 'Fan deck', key: 'fan', label: 'E · Fan deck', component: FanDeck },
		{
			group: 'Fan deck',
			key: 'fan-circle',
			label: 'E1 · One circle',
			component: tiles.fan.component
		},
		{
			group: 'Fan deck',
			key: 'fan-corner',
			label: 'E2 · Corner',
			component: tiles.corner.component
		},
		{
			group: 'Fan deck',
			key: 'fan-chips',
			label: 'E3 · Chip pile',
			component: tiles.chips.component
		},
		{ group: 'Earlier ideas', key: 'weave', label: 'A · Weave', component: Weave },
		{ group: 'Earlier ideas', key: 'aura', label: 'B · Aura', component: Aura },
		{ group: 'Earlier ideas', key: 'iris', label: 'C · Iris', component: Iris },
		{ group: 'Earlier ideas', key: 'threads', label: 'D · Threads', component: Threads },
		{ group: 'Earlier ideas', key: 'rose', label: 'F · Rose window', component: RoseWindow }
	];
	const groups = [...new Set(variants.map((v) => v.group))].map((name) => ({
		name,
		slug: name.split(' ')[0].toLowerCase(),
		variants: variants.filter((v) => v.group === name)
	}));

	// #<key> shows one variant in the home grid, #all every variant side by side
	// #all/<group> (seeds, fan, earlier) shows just that group
	let selected = $state('all');
	let only = $state('');
	const all = $derived(selected === 'all');
	const Variant = $derived((variants.find((v) => v.key === selected) ?? variants[0]).component);

	const readHash = () => {
		const [key, group = ''] = window.location.hash.slice(1).split('/');
		if (key === 'all' || variants.some((v) => v.key === key)) selected = key;
		only = group;
	};

	$effect(readHash);

	// Buttons rather than #links: prerendering checks every #link for a matching id
	const go = (hash) => (window.location.hash = hash);

	const rest = [
		hobbies.boulderingRegensburg,
		books.algorithmsToLiveBy,
		hobbies.skiingOppdal,
		books.aLittlePrincess,
		hobbies.animeFrieren,
		hobbies.vietnamNinhBinh
	];

	// The lab looks read the count from the item, as the old tile did
	const flagsItem = { ...projects.flags, count };

	// Whatever tile the home page currently uses for VibeReel
	const VibeReelTile = tiles[projects.vibeReel.tileType].component;

	const quick = () => ({ duration: 0, delay: 0 });
</script>

<svelte:head>
	<title>Lab · Flags tile</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<svelte:window onhashchange={readHash} />

<nav class="switcher">
	<button type="button" onclick={() => go('all')} class:active={all}>All side by side</button>
	{#each groups as g (g.name)}
		<span class="sep"></span>
		{#each g.variants as v (v.key)}
			<button type="button" onclick={() => go(v.key)} class:active={selected === v.key}>
				{v.label}
			</button>
		{/each}
	{/each}
</nav>

{#if all}
	{#each groups.filter((g) => !only || g.slug === only) as g (g.name)}
		<h2 class="group">
			<button type="button" onclick={() => go(`all/${g.slug}`)}>{g.name}</button>
		</h2>
		<div class="grid-container">
			{#each g.variants as v (v.key)}
				{@const Tile = v.component}
				<figure>
					<figcaption>
						<button type="button" onclick={() => go(v.key)}>{v.label}</button>
					</figcaption>
					<div class="grid-item aspect-square">
						<Tile item={flagsItem} linkSection />
					</div>
				</figure>
			{/each}
		</div>
	{/each}
{:else}
	{#key selected}
		<TileGrid items={rest} timing={quick} linkSections squareCells>
			{#snippet lead()}
				<p class="grid-item span-2-rows span-2-cols intro">
					Hi there, I'm <span class="dark-font">Kirill</span> 👋 Welcome to my digital
					garden 🌱 I like <span class="dark-font">AI</span> and currently building this
					website you're on.
					<br /> <br />
					When I'm not coding, you'll find me lifting at the
					<span class="dark-font">gym</span>, watching
					<span class="dark-font">anime</span>, or buried in a good
					<span class="dark-font">book</span>.
				</p>
				<div class="grid-item span-2-cols aspect-wide">
					<VibeReelTile item={projects.vibeReel} linkSection />
				</div>
				<div class="grid-item aspect-square">
					<Variant item={flagsItem} linkSection />
				</div>
			{/snippet}
		</TileGrid>
	{/key}
{/if}

<style>
	.switcher {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0 0 1rem;
		font-size: 0.85rem;
	}

	.switcher button {
		font: inherit;
		background: none;
		cursor: pointer;
		padding: 0.35rem 0.7rem;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		color: var(--color-font-dark);
		text-decoration: none;
	}

	.sep {
		width: 0.6rem;
	}

	.group {
		margin: 1.5rem 0 0.75rem 0.2rem;
		font-size: 1rem;
		font-weight: 500;
	}

	.group button,
	figcaption button {
		padding: 0;
		border: 0;
		background: none;
		font: inherit;
		color: var(--color-font-dark);
		cursor: pointer;
	}

	.switcher button.active {
		background: var(--color-font-dark);
		border-color: var(--color-font-dark);
		color: white;
	}

	figure {
		margin: 0 0 1rem;
	}

	figcaption {
		font-size: 0.85rem;
		margin: 0 0 0.4rem 0.2rem;
	}

	figcaption button {
		color: var(--color-font-light);
		text-decoration: underline;
	}

	.intro {
		font-size: 1.75rem;
		font-weight: 400;
		margin: 2rem;
		color: var(--color-font-light);
		font-family: var(--font-secondary);
	}

	@media (max-width: 1023px) {
		.intro {
			font-size: 1.4rem;
			margin: 1rem;
		}
	}

	.dark-font {
		color: var(--color-font-dark);
	}
</style>
