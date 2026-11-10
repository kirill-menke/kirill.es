// Colour data for the lab variants. They read flags.json directly, which a real home tile must
// not do (CLAUDE.md): the chosen design gets a compact precomputed copy in tile-data.js.
import { flags } from '#lib/flags/index.js';

export { flags };
export { imageUrl } from '#lib/flags/ring.js';
export const N = flags.length;

/** n flags spread evenly around the circle, in ring order */
export const spread = (n) => Array.from({ length: n }, (_, k) => flags[Math.floor((k * N) / n)]);

const luminance = (hex) => {
	const n = parseInt(hex.slice(1), 16);
	return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};

/** The flag's biggest colour that still shows on the light tile */
export const ink = (flag) =>
	(flag.colors.find((c) => luminance(c.hex) < 0.85) ?? flag.colors[0]).hex;

/** Hard colour stops for a gradient: each colour gets its share of from..to (any unit) */
export function stops(colors, from, to, unit) {
	let at = from;
	return colors.map((c) => {
		const end = at + c.share * (to - from);
		const stop = `${c.hex} ${at.toFixed(3)}${unit} ${end.toFixed(3)}${unit}`;
		at = end;
		return stop;
	});
}

/** [x, y] at radius r and `turn` turns, 0 at 12 o'clock, clockwise (SVG y points down) */
export const polar = (r, turn) => [
	r * Math.sin(2 * Math.PI * turn),
	-r * Math.cos(2 * Math.PI * turn)
];

export const fmt = (n) => +n.toFixed(2);

export const GOLDEN = 1 - 2 / (1 + Math.sqrt(5)); // the golden angle, in turns

/**
 * `count` spots of a sunflower head (Vogel's spiral), skipping the first `hole` spots so the
 * middle stays free, sorted by angle. Hand items out in ring order and the circle's gradient
 * runs round the head like a colour wheel. `r` is in 0..1 of the head's radius, `turn` in turns.
 */
export function sunflower(count, hole) {
	const total = count + hole;
	return Array.from({ length: count }, (_, i) => {
		const k = i + hole;
		return { k: i, r: Math.sqrt(k / total), turn: (k * GOLDEN) % 1 };
	}).sort((a, b) => a.turn - b.turn);
}

/** Black or white, whichever reads on `hex` */
export const textOn = (hex) =>
	luminance(hex) > 0.6 ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.8)';
