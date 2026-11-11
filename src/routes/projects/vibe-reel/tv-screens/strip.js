/*
 * The film strip drawn by hand in graphite (StripSketch.svelte), in px of the strip as TvScreens
 * lays it out: `width` long and `height` deep (the frames' row), `count` frames `pitch` apart,
 * each picture `frame` wide and `inset` in from the strip's edges, and the first `lead` in from
 * the cut. The last frame is the ending one, with no picture: the pencil draws its border. A
 * frame's stretch of film runs from the middle of the frame line before it to the middle of the
 * one after, with as many whole sprocket holes along each edge as fit it, so that every frame
 * sits the same way between them. Each part comes with its share of the drawing-on (`a` to `b`,
 * 0 to 1). The hand's wobble is seeded (sketch/sketch.js), so the server and the browser draw
 * the same lines.
 */
import { random, rough, line } from '#lib/components/sketch/sketch.js';

/* The strip of a wide page, for the first render, before TvScreens has measured its own */
export const WIDE = { width: 3920, height: 504, frame: 736, pitch: 786, lead: 20, inset: 36 };

// A sprocket hole every 1.5rem or so, its rows' middles 14px in from the edges (the film's)
const HOLE_PITCH = 24;
const ROW = 14;
// The holes are a few drawn once each, used again and again in no order you could follow
const SHAPES = 7;
// The hatching on the frame lines keeps this far in from the edges, clear of the holes
const CLEAR = 25;

const f = (n) => n.toFixed(1);
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

/* Strokes in order, sharing out a to b of the drawing-on between them */
const spread = (paths, a, b, kind) =>
	paths.map((d, i) => ({
		d,
		kind,
		a: a + ((b - a) * i) / paths.length,
		b: a + ((b - a) * (i + 1)) / paths.length
	}));

/* The strip's ends are torn, its corners bitten off, as on a print that has been handled. The
   profile of one end, as [in from the cut, down]: a bite out of the top corner, the cut ragged
   on its way down, a smaller bite out of the bottom corner. The edges stop where the bites
   start (BITE); TvScreens' clip-path cuts its focus ring the same way. */
const BITE = { top: 14, bottom: 12 };
function torn(side, { width, height }, seed, inset = 0) {
	const rand = random(seed);
	const j = (n) => n + (rand() - 0.5) * 1.2;
	const profile = [
		[BITE.top, 1.5],
		[9, 5],
		[3, 8],
		[5, 13],
		[1.5, 18]
	];
	for (let y = 18 + 30 * (0.6 + 0.4 * rand()); y < height - 20; y += 26 + 18 * rand()) {
		profile.push([1.5 + rand() * 2.2, y]);
	}
	profile.push(
		[1.5, height - 15],
		[10, height - 9],
		[7, height - 5],
		[BITE.bottom, height - 1.5]
	);
	const x = (u) => (side === 'left' ? u + inset : width - u - inset);
	return `M${profile.map(([u, y], k) => pt([x(k ? j(u) : u), k ? j(y) : y])).join('L')}`;
}

/* A long line at height `y` from x0 to x1 as strokes about `reach` long, a little uneven, each
   put down a little back along the one before (`overlap`) and turned by up to `tilt` */
function along([x0, x1], y, seed, { reach, overlap, wobble, tilt, step = 28 }) {
	const rand = random(seed);
	const n = Math.min(64, Math.max(1, Math.round((x1 - x0) / reach) || 1));
	const ends = Array.from({ length: n + 1 }, (_, k) =>
		k === 0 ? x0 : k === n ? x1 : x0 + ((x1 - x0) * (k + 0.25 * rand())) / n
	);
	return ends.slice(1).map((end, k) => {
		const start = k ? ends[k] - overlap * (0.75 + 0.25 * rand()) : x0;
		return line([start, y + rand() * tilt], [end, y + rand() * tilt], seed + 13 * (k + 1), {
			wobble,
			step
		});
	});
}

/* A sprocket hole as a wobbly loop of the pencil round 0, 0, closed a little past where it
   started */
const hole = (seed) =>
	rough({ x: -5.5, y: -4, w: 11, h: 8, r: 2.6 }, seed, {
		wobble: 0.7,
		from: 3 + 9 * Math.abs(random(seed)()),
		over: 5,
		step: 3,
		digits: 1
	});

/* The rows of holes: `shapes` (a few holes, each drawn by `hole`) and, for each row, where its
   holes go and which shape each is ([x, y, shape]). Along a row each frame's holes are spaced
   evenly over its stretch; those the cut at either end would go through are left out. */
function holes({ width, height, count, frame, pitch, lead }, seed) {
	const n = Math.max(1, Math.round(pitch / HOLE_PITCH));
	const step = pitch / n;
	const start = lead - (pitch - frame) / 2;
	const xs = Array.from({ length: count * n }, (_, k) => start + (k + 0.5) * step).filter(
		(x) => x > 22 && x < width - 22
	);
	const rand = random(seed);
	return {
		shapes: Array.from({ length: SHAPES }, (_, j) => hole(seed + j)),
		rows: [ROW, height - ROW].map((y) =>
			xs.map((x) => [+f(x), y, Math.floor(Math.abs(rand()) * SHAPES)])
		)
	};
}

/* The frame lines' stretches of film, as [x0, x1]: one before each frame and one after the
   last, the half ones at the cut ends too */
function frameLines({ width, count, frame, pitch, lead }) {
	const gap = pitch - frame;
	const lines = [];
	for (let k = 0; k <= count; k++) {
		const x0 = Math.max(2, lead + k * pitch - gap + 2.5);
		const x1 = Math.min(width - 2, lead + k * pitch - 2.5);
		if (x1 - x0 >= 2) lines.push([x0, x1]);
	}
	return lines;
}

/* Pencil hatching over every frame line between the rows of holes: strokes rising to the
   right, a little uneven in spacing and slope */
function hatching(size, seed) {
	const rand = random(seed);
	const { height } = size;
	const strokes = [];
	for (const [x0, x1] of frameLines(size)) {
		const rise = (x1 - x0) * 0.85;
		for (let y = CLEAR + rise; y < height - CLEAR; y += 4.2 + rand() * 0.7) {
			const a = [x0 + rand() * 0.6, y + rand() * 0.8];
			const b = [x1 + rand() * 0.6, y - rise + rand() * 1.2];
			strokes.push(`M${pt(a)}L${pt(b)}`);
		}
	}
	return strokes.join('');
}

/* The ending frame's border: round where the other frames have their pictures */
const blank = ({ height, count, frame, pitch, lead, inset }) => ({
	x: lead + (count - 1) * pitch,
	y: inset,
	w: frame,
	h: height - 2 * inset
});

/* The same box `d` further in all round */
const within = ({ x, y, w, h }, d) => ({ x: x + d, y: y + d, w: w - 2 * d, h: h - 2 * d });

/* On trial (tweaks.js: strip.lines, strip.ending): what a wash of the sketchbook's gold would
   cover, as paths: the frame lines under their hatching, and the ending frame in its box. Each
   has slipped a little right and down off the pencil, as the washes of the page's sets have. */
function washes(size) {
	const plot = ({ x, y, w, h }) => `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}z`;
	const ending = blank(size);
	return {
		lines: frameLines(size)
			.map(([x0, x1]) =>
				plot({ x: x0 + 1.5, y: CLEAR + 1.5, w: x1 - x0, h: size.height - 2 * CLEAR })
			)
			.join(''),
		ending: plot({ ...ending, x: ending.x + 3, y: ending.y + 2.5 })
	};
}

/* A box as a hand draws one, a stroke along each side in turn, clockwise from the top left:
   each starts and ends up to `nudge` off the corners and runs on past them by up to `over`,
   so that with any the strokes cross there, and bows by up to `wobble` */
function box({ x, y, w, h }, seed, { wobble, over, nudge, step = 32 }) {
	const rand = random(seed);
	const corners = [
		[x, y],
		[x + w, y],
		[x + w, y + h],
		[x, y + h]
	];
	const near = ([u, v]) => [u + rand() * nudge, v + rand() * nudge];
	const run = () => over * (0.6 + 0.4 * rand());
	return corners.map((corner, k) =>
		line(near(corner), near(corners[(k + 1) % 4]), seed + 7 * (k + 1), {
			wobble,
			over: [run(), run()],
			step
		})
	);
}

/* How far in from the cut an edge starts, past its corner's bite (0 the top, 1 the bottom) */
const bitten = (i, width, inset = 0) => {
	const b = (i ? BITE.bottom : BITE.top) + inset;
	return [b, width - b];
};

/* The drawing for a strip of `count` frames laid out as `layout`, the last the ending one:
   each edge quick strokes that cross where they meet, gone over once more and lighter, the torn
   ends gone over twice, the holes pencilled in, the frame lines hatched and the ending frame
   boxed in the same quick strokes, gone over once more. As `strokes`, each drawn on along its
   length; `holes`, each row wiped on from the left over its share in `wipes`; and the
   `hatching`, wiped on likewise. */
export function drawStrip(count, layout) {
	const size = { ...layout, count };
	const { width, height } = size;
	const edges = [1.5, height - 1.5];
	const [top, bottom] = edges.map((y, i) =>
		along(bitten(i, width), y, 11 + 100 * i, {
			reach: size.pitch * 0.9,
			overlap: 9,
			wobble: 0.6,
			tilt: 0.9
		})
	);
	const light = edges.flatMap((y, i) =>
		along(bitten(i, width, 2), y + (i ? -0.7 : 0.7), 37 + 100 * i, {
			reach: size.pitch * 1.4,
			overlap: 16,
			wobble: 0.8,
			tilt: 1.2
		})
	);
	const ends = [torn('left', size, 71), torn('right', size, 73)];
	const again = [torn('left', size, 75, 1.2), torn('right', size, 77, 1.2)];
	const ending = blank(size);
	const boxed = box(ending, 531, { wobble: 0.7, over: 6, nudge: 1.5 });
	const boxedAgain = box(within(ending, 1.2), 541, { wobble: 1, over: 3, nudge: 1 });
	return {
		strokes: [
			...spread(top, 0, 0.45, 'edge'),
			...spread(bottom, 0.1, 0.55, 'edge'),
			...spread(ends, 0.4, 0.55, 'end'),
			...spread(boxed, 0.45, 0.6, 'blank'),
			...spread([...light, ...again], 0.45, 0.75, 'again'),
			...spread(boxedAgain, 0.6, 0.75, 'again')
		],
		holes: holes(size, 301),
		wipes: [
			[0.05, 0.5],
			[0.15, 0.6]
		],
		hatching: { d: hatching(size, 401), a: 0.6, b: 1 },
		gold: washes(size)
	};
}

/* The chevron on a button at either end of the strip (TvScreens), in the pencil's hand,
   pointing on (`way` 1) or back (-1), in a 24 × 24 box rather than the strip's px. As the
   strip's edges are, each arm is a quick stroke of its own, the two crossing at the tip, and
   the pair is gone over once more, lighter. Its strokes, as { d, kind }: 'line' for the first
   pass, 'again' for the second. */
export function chevron(way) {
	const at = ([u, y]) => [12 + way * u, y];
	const [top, tip, bottom] = [
		[-4, 4.5],
		[4, 12],
		[-4, 19.5]
	].map(at);
	const hand = { wobble: 0.3, step: 2 };
	const seed = 81 + (way > 0 ? 0 : 50);
	const arms = ([a, t, b], s) => [
		line(a, t, s, { ...hand, over: [0, 0.8] }),
		line(t, b, s + 1, { ...hand, over: [0.8, 0] })
	];
	// The second pass a touch behind the first and shorter, so the two read as one line gone over
	const again = [
		[-3.4, 5.4],
		[3.3, 12.1],
		[-3.5, 18.8]
	].map(at);
	return [
		...arms([top, tip, bottom], seed).map((d) => ({ d, kind: 'line' })),
		...arms(again, seed + 2).map((d) => ({ d, kind: 'again' }))
	];
}
