/*
 * Lines drawn by hand, for the sketched devices of the VibeReel page (TvSketch and the sets
 * drawn with its pen, PhoneFrame, the soundbar) and its other drawings, mostly in the device's
 * units: 100 to its width. The hand's wobble is seeded, so the server and the browser draw the
 * same lines.
 */

// Random numbers in -1…1 from a seed (Park–Miller)
export function random(seed) {
	let s = seed;
	return () => {
		s = (s * 16807) % 2147483647;
		return (s / 2147483647) * 2 - 1;
	};
}

/* A path written out with its numbers to two decimals: path`M${x} ${y}…` */
export const path = (strings, ...values) =>
	String.raw({ raw: strings }, ...values.map((v) => +v.toFixed(2)));

// A slow drift of up to `wobble` either way at each of n + 1 points: offsets chosen every
// fourth point and eased in between
function drift(rand, n, wobble) {
	const knots = Array.from({ length: Math.ceil(n / 4) + 2 }, () => rand() * wobble);
	return (k) => {
		const i = Math.floor(k / 4);
		const e = ((k % 4) / 4) ** 2 * (3 - (2 * (k % 4)) / 4);
		return knots[i] * (1 - e) + knots[i + 1] * e;
	};
}

// A rounded rectangle's outline, clockwise from its top left: the point and outward normal
// at a distance along it
function outline({ x, y, w, h, r }) {
	const arc = (cx, cy, a0) => (t) => {
		const a = a0 + t / r;
		return [cx + r * Math.cos(a), cy + r * Math.sin(a), Math.cos(a), Math.sin(a)];
	};
	const parts = [
		[w - 2 * r, (t) => [x + r + t, y, 0, -1]],
		[(Math.PI * r) / 2, arc(x + w - r, y + r, -Math.PI / 2)],
		[h - 2 * r, (t) => [x + w, y + r + t, 1, 0]],
		[(Math.PI * r) / 2, arc(x + w - r, y + h - r, 0)],
		[w - 2 * r, (t) => [x + w - r - t, y + h, 0, 1]],
		[(Math.PI * r) / 2, arc(x + r, y + h - r, Math.PI / 2)],
		[h - 2 * r, (t) => [x, y + h - r - t, -1, 0]],
		[(Math.PI * r) / 2, arc(x + r, y + r, Math.PI)]
	];
	const total = parts.reduce((sum, [length]) => sum + length, 0);
	return (d) => {
		let rest = ((d % total) + total) % total;
		for (const [length, at] of parts) {
			if (rest <= length) return at(rest);
			rest -= length;
		}
		return parts[0][1](0);
	};
}

// Catmull–Rom through the points ([x, y, …]), as the cubic Béziers that follow the first
function curve(points, digits) {
	const f = (v) => v.toFixed(digits);
	let d = '';
	for (let i = 0; i < points.length - 1; i++) {
		const [p0, p1, p2, p3] = [i - 1, i, i + 1, i + 2].map(
			(j) => points[Math.min(points.length - 1, Math.max(0, j))]
		);
		d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
	}
	return d;
}

/* A smooth path through the points, to `digits` decimals: a TV, four times the phone's width,
   needs finer ones */
export function spline(points, digits = 1) {
	const f = (v) => v.toFixed(digits);
	return `M${f(points[0][0])} ${f(points[0][1])}${curve(points, digits)}`;
}

/* Points round a rounded rectangle as drawn by hand, `step` apart: from `from` along its
   outline and on past the start by `over`, drifting in and out by up to `wobble`. Each is
   [x, y, nx, ny, s]: with the outward normal there and how far along the line it is. */
export function around(rect, seed, { wobble, from, over, step = 5 }) {
	const at = outline(rect);
	const rand = random(seed);
	const perimeter = 2 * (rect.w + rect.h - 4 * rect.r) + 2 * Math.PI * rect.r;
	const n = Math.ceil((perimeter + over) / step);
	const offset = drift(rand, n, wobble);
	return Array.from({ length: n + 1 }, (_, k) => {
		const [x, y, nx, ny] = at(from + k * step);
		const o = offset(k);
		return [x + nx * o, y + ny * o, nx, ny, k * step];
	});
}

/* A rounded rectangle as drawn by hand (see around), as a path */
export const rough = (rect, seed, { digits, ...options }) =>
	spline(around(rect, seed, options), digits);

/* A straight line from a to b as drawn by hand: run on past a and b by `over` ([at a, at b])
   and bowing by up to `wobble` */
export function line([ax, ay], [bx, by], seed, { wobble = 0, over = [0, 0], step = 3 } = {}) {
	const rand = random(seed);
	const length = Math.hypot(bx - ax, by - ay);
	const [ux, uy] = [(bx - ax) / length, (by - ay) / length];
	const total = over[0] + length + over[1];
	const n = Math.max(2, Math.ceil(total / step));
	const offset = drift(rand, n, wobble);
	const points = Array.from({ length: n + 1 }, (_, k) => {
		const t = (k / n) * total - over[0];
		const o = offset(k);
		return [ax + ux * t - uy * o, ay + uy * t + ux * o];
	});
	return spline(points, 2);
}

/* Hatching as drawn by hand: short parallel strokes `stroke` ([dx, dy]) long, set off every
   `gap` from a to b, each up to `jitter` off the line and a little longer or shorter */
export function hatch([ax, ay], [bx, by], seed, { gap, stroke: [dx, dy], jitter }) {
	const rand = random(seed);
	const length = Math.hypot(bx - ax, by - ay);
	const [nx, ny] = [(ay - by) / length, (bx - ax) / length];
	const f = (v) => v.toFixed(2);
	let d = '';
	for (let t = 0; t <= length; t += gap) {
		const off = rand() * jitter;
		const s = 1 + rand() * 0.1;
		const x = ax + ((bx - ax) * t) / length + nx * off;
		const y = ay + ((by - ay) * t) / length + ny * off;
		d += `M${f(x)} ${f(y)}l${f(dx * s)} ${f(dy * s)}`;
	}
	return d;
}
