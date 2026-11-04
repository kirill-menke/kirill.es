<script>
	import { listEntrance } from '#lib/entrance.js';
	import { tiles } from './index.js';

	/**
	 * items: tile-data.js entries, each drawn by the tile its `tileType` names.
	 * linkSections: link each tile's section name to its list page.
	 * timing(index): entrance { duration, delay } in ms for the index-th tile.
	 * lead: snippet rendered as the grid's first cell(s), before the tiles.
	 * squareCells: give square cells aspect-ratio 1 as well (the home page). Next to a wide tile
	 *   such a cell widens its 1fr column by a few px, so list pages leave sizing to the tile.
	 */
	let {
		items,
		linkSections = false,
		timing = listEntrance,
		lead,
		squareCells = false
	} = $props();
</script>

<div class="grid-container">
	{@render lead?.()}
	{#each items as item, index (item)}
		{@const { component: Tile, enterY } = tiles[item.tileType]}
		{@const { duration, delay } = timing(index)}
		{@const size =
			item.layout === 'wide' ? 'span-2-cols aspect-wide' : squareCells ? 'aspect-square' : ''}
		<div
			class="grid-item enter {size}"
			style:--enter-duration="{duration}ms"
			style:--enter-delay="{delay}ms"
			style:--enter-y="{enterY}px"
		>
			<Tile {item} linkSection={linkSections} />
		</div>
	{/each}
</div>
