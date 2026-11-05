import BookTile from './BookTile.svelte';
import FlagsTile from './FlagsTile.svelte';
import HobbyFadeTile from './HobbyFadeTile.svelte';
import HobbySlideTile from './HobbySlideTile.svelte';
import ProjectGlowTile from './ProjectGlowTile.svelte';
import ProjectScrapbookTile from './ProjectScrapbookTile.svelte';
import ProjectStencilTile from './ProjectStencilTile.svelte';

/** Tile component and entrance offset (px, see .enter) for each `tileType` in tile-data.js. */
export const tiles = {
	book: { component: BookTile, enterY: -15 },
	flags: { component: FlagsTile, enterY: -15 },
	glow: { component: ProjectGlowTile, enterY: -15 },
	stencil: { component: ProjectStencilTile, enterY: -15 },
	scrapbook: { component: ProjectScrapbookTile, enterY: -15 },
	fade: { component: HobbyFadeTile, enterY: -20 },
	slide: { component: HobbySlideTile, enterY: -20 }
};
