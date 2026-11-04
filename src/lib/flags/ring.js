// Ring geometry and image paths shared by the /flags circle and the home-page flags tile.
// Deliberately free of flags.json, so the tile can import it without bundling the data.

export const imageUrl = (code) => `/flag-images/${code}.svg`;

/**
 * Where the index-th of `count` items sits on a ring of `radius` (% of the square box):
 * first item at 12 o'clock, going clockwise. `angle` is in degrees, x/y in % of the box.
 */
export function placeOnRing(index, count, radius) {
	const angle = -90 + (index * 360) / count;
	const rad = (angle * Math.PI) / 180;
	return { angle, x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
}
