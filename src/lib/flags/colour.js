// Colour helpers for the home-page Flags tiles. JSON-free like ring.js, so a tile can use them.

const luminance = (hex) => {
	const n = parseInt(hex.slice(1), 16);
	return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};

/** The biggest of a flag's colours (largest share first) that still shows on the light tile */
export const ink = (colors) => (colors.find((c) => luminance(c.hex) < 0.85) ?? colors[0]).hex;

/** Dark or light text, whichever reads on `hex` */
export const textOn = (hex) =>
	luminance(hex) > 0.6 ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.8)';
