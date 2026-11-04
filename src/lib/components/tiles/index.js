import BookTile from './BookTile.svelte';
import FlagsTile from './FlagsTile.svelte';
import HobbyFadeTile from './HobbyFadeTile.svelte';
import HobbySlideTile from './HobbySlideTile.svelte';
import ProjectShowcaseTile from './ProjectShowcaseTile.svelte';

/** Tile component and entrance offset (px, see .enter) for each `tileType` in tile-data.js. */
export const tiles = {
	book: { component: BookTile, enterY: -15 },
	flags: { component: FlagsTile, enterY: -15 },
	showcase: { component: ProjectShowcaseTile, enterY: -15 },
	fade: { component: HobbyFadeTile, enterY: -20 },
	slide: { component: HobbySlideTile, enterY: -20 }
};
