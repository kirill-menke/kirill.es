/*
 * Grease pencil: the yellow wax pencil editors mark up film with, circling the spot in one quick
 * loop. Its line boils as hand-drawn animation does, drawn a little differently a few times a
 * second. A touch tightens the circle and scribbles it in, and a drag doodles a line behind it.
 */
import { TAU, TRAIL, rgba, inked, ribbon, random } from './layer.js';

// ms each drawing holds, of the three the line boils through (animation "on threes")
const BOIL = 125;
// ms a scribble takes to draw
const SCRIBBLE = 160;

export default function pencil() {
	return {
		draw(ctx, p, o, now) {
			const drawing = o.still ? 0 : Math.floor(now / BOIL) % 3;
			if (p.show) {
				if (!o.still) doodle(ctx, p, o, now, drawing);
				const R = (11.5 - 3 * p.press) * o.u;
				const press = Math.min(Math.max(p.press, 0), 1);
				if (press > 0.02) {
					const drawn = o.still ? 1 : Math.min(Math.max(now - p.downAt, 0) / SCRIBBLE, 1);
					scribble(ctx, o, p.x, p.y, R, drawing, press * p.show, drawn);
				}
				loop(ctx, o, p.x, p.y, R, drawing, p.show);
			}
			return p.show > 0 && !o.still;
		}
	};
}

/* The circle: one quick loop of the pencil, a little squashed and tilted, starting thin, wavering
   and opening out as it goes round so it overshoots where it began, and lifting off */
function loop(ctx, o, x, y, r, drawing, alpha) {
	const seed = 3 + 7.31 * drawing;
	const start = -2.3 + 0.5 * random(seed);
	const sweep = TAU + 0.5 + 0.3 * random(seed + 1);
	const tilt = -0.35 + 0.2 * random(seed + 2);
	const ph1 = TAU * random(seed + 3);
	const ph2 = TAU * random(seed + 4);
	const N = 40;
	const pts = [];
	for (let i = 0; i <= N; i++) {
		const f = i / N;
		const t = start - sweep * f;
		const k = r * (1 + 0.05 * Math.sin(2 * t + ph1) + 0.035 * Math.sin(3 * t + ph2) + 0.08 * f);
		const ex = 1.06 * k * Math.cos(t);
		const ey = 0.94 * k * Math.sin(t);
		pts.push({
			x: x + ex * Math.cos(tilt) - ey * Math.sin(tilt),
			y: y + ex * Math.sin(tilt) + ey * Math.cos(tilt)
		});
	}
	// Thin where the pencil lands and where it lifts off
	const width = (f) => 0.85 * o.u * Math.max(0.2, Math.min(1, f / 0.12, (1 - f) / 0.25));
	ribbon(ctx, pts, (i) => width(i / N));
	ctx.lineWidth = 1.7 * o.u;
	ctx.strokeStyle = rgba(o.c.shade, 0.5 * alpha);
	ctx.stroke();
	ctx.fillStyle = rgba(o.c.gold, alpha);
	ctx.fill();
}

/* What a touch scribbles in: a zigzag of hatching across the circle, drawn as fast as a hand
   would (`drawn` of it so far) */
function scribble(ctx, o, x, y, r, drawing, alpha, drawn) {
	const seed = 1 + 5.17 * drawing;
	const turns = 9;
	const tilt = -0.85;
	const pts = [];
	for (let j = 0; j <= turns; j++) {
		// Along the hatching's run, from one side of the circle to the other, each turn on the
		// circle's edge (a little short of it)
		const along = (j / turns - 0.5) * 1.3 * r;
		const chord = Math.sqrt(Math.max(r * r - along * along, 0)) * 0.78;
		const across = (j % 2 ? 1 : -1) * chord + (random(seed + j) - 0.5) * 0.2 * r;
		pts.push([
			x + along * Math.cos(tilt) - across * Math.sin(tilt),
			y + along * Math.sin(tilt) + across * Math.cos(tilt)
		]);
	}
	const lengths = pts.slice(1).map(([px, py], j) => Math.hypot(px - pts[j][0], py - pts[j][1]));
	let rest = drawn * lengths.reduce((sum, l) => sum + l, 0);
	ctx.beginPath();
	ctx.moveTo(...pts[0]);
	for (let j = 1; j < pts.length && rest > 0; j++) {
		const f = Math.min(rest / lengths[j - 1], 1);
		const [px, py] = pts[j - 1];
		ctx.lineTo(px + (pts[j][0] - px) * f, py + (pts[j][1] - py) * f);
		rest -= lengths[j - 1];
	}
	inked(ctx, o, o.c.gold, 1.1 * o.u, 0.85 * alpha);
}

/* What a drag doodles: the pencil's line behind it, wavering with the drawing, tapering off as it
   fades. Each drag still on the trail is a line of its own. */
function doodle(ctx, p, o, now, drawing) {
	let run = [];
	const runs = [run];
	for (const q of p.trail) {
		if (!q.down || now - q.t >= TRAIL) {
			if (run.length) runs.push((run = []));
			continue;
		}
		const jx = random(q.t * 0.37 + 13.1 * drawing) - 0.5;
		const jy = random(q.t * 0.53 + 7.7 * drawing) - 0.5;
		run.push({ x: q.x + 1.4 * o.u * jx, y: q.y + 1.4 * o.u * jy, t: q.t });
	}
	if (p.down && run.length) run.push({ x: p.x, y: p.y, t: now });
	for (const pts of runs) {
		if (pts.length < 3) continue;
		ribbon(ctx, pts, (i) => 0.75 * o.u * Math.min(1, 2.5 * (1 - (now - pts[i].t) / TRAIL)));
		ctx.lineWidth = 1.7 * o.u;
		ctx.strokeStyle = rgba(o.c.shade, 0.45 * p.show);
		ctx.stroke();
		ctx.fillStyle = rgba(o.c.gold, 0.9 * p.show);
		ctx.fill();
	}
}
