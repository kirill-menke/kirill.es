/*
 * The arrowheads of the download bar's hand-drawn end notes: a stroke that ends in a cubic gets a
 * two-stroke head along the tangent at its end (the last control point → the end point), as on
 * the hero's "try it out" note.
 */
export function headFor(d, len = 7, spread = 0.5) {
	const [cx, cy, x, y] = d
		.match(/-?\d*\.?\d+/g)
		.map(Number)
		.slice(-4);
	const a = Math.atan2(cy - y, cx - x);
	const at = (t) => `${(x + len * Math.cos(t)).toFixed(1)} ${(y + len * Math.sin(t)).toFixed(1)}`;
	return `M${at(a + spread)}L${x} ${y} ${at(a - spread)}`;
}
