<script>
	import { ArrowUpRight } from '@lucide/svelte';

	// Contents of a tile's header row; the tile renders the row itself because its box differs
	// per tile. `href` adds the arrow link, `label` is its tooltip and accessible name.
	// `duplicate` marks an arrow that repeats the tile's full-tile link: it stays visible but out
	// of the tab order and the accessibility tree, so the link is announced once.
	let {
		section,
		name,
		linkSection = false,
		href,
		label,
		ariaLabel = label,
		duplicate = false
	} = $props();

	const external = $derived(/^https?:\/\//.test(href));
</script>

<span class="tile-header-text">
	{#if linkSection}
		<a href="/{section.toLowerCase()}">
			{section}
			<span class="tooltip">Browse {section.toLowerCase()}</span>
		</a>
	{:else}
		{section}
	{/if}
	· {name}
</span>
{#if href}
	<a
		{href}
		class="tile-anchor"
		aria-label={external ? `${ariaLabel} (opens in a new tab)` : ariaLabel}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		tabindex={duplicate ? -1 : undefined}
		aria-hidden={duplicate ? 'true' : undefined}
	>
		<span class="tooltip">{label}</span>
		<ArrowUpRight strokeWidth="2" size="16" />
	</a>
{/if}
