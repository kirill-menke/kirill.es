// Where each flag sits in the /flags wreath: the circle made `lanes` flags deep. Flag i keeps its
// place on the clock (the first at 12 o'clock, then clockwise), and consecutive flags step outward
// lane by lane, so the band reads as one braid. Pure, so the prerendered HTML and the browser agree.

/**
 * Places in % of the square: { x, y, size, angle } for each flag in circle order, where size is
 * the badge diameter and angle turns the badge's top outward. Also the middle radius (`mid`).
 */
export function wreath(count, lanes) {
	// Solve for the middle radius that lets the outermost lane just fit the square.
	let mid = 40;
	let width = 0; // the room each flag has along its lane
	let gap = 0; // between lanes
	for (let k = 0; k < 8; k++) {
		width = ((2 * Math.PI * mid * lanes) / count) * 0.95;
		gap = width * 0.6;
		mid = 48.5 - ((lanes - 1) / 2) * gap - width * 0.45;
	}
	const places = Array.from({ length: count }, (_, i) => {
		const theta = -Math.PI / 2 + (2 * Math.PI * i) / count;
		const r = mid + ((i % lanes) - (lanes - 1) / 2) * gap;
		return {
			x: 50 + r * Math.cos(theta),
			y: 50 + r * Math.sin(theta),
			size: width * 0.7,
			angle: (theta * 180) / Math.PI + 90
		};
	});
	return { places, mid };
}
