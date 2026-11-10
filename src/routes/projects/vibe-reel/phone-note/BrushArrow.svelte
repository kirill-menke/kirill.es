<svelte:options namespace="svg" />

<script module>
	/* The arrowhead's two barbs: `len` back from the end of `d` (a path ending in a cubic),
	   `spread` either side of its tangent there (the last control point → the end point) */
	function barbs(d, len, spread) {
		const [cx, cy, x, y] = numbers(d).slice(-4);
		const a = Math.atan2(cy - y, cx - x);
		const at = (t) => [x + len * Math.cos(t), y + len * Math.sin(t)];
		return [at(a + spread), [x, y], at(a - spread)];
	}

	/* A straight line from a to b, as a cubic for brush() */
	const line = ([ax, ay], [bx, by]) =>
		`M${ax} ${ay}C${ax + (bx - ax) / 3} ${ay + (by - ay) / 3} ${ax + ((bx - ax) * 2) / 3} ${ay + ((by - ay) * 2) / 3} ${bx} ${by}`;

	/* A brush stroke along `d` (cubics only: M, then C): its outline, `width(u)` wide at u of the
	   way along, with round ends and a slight, seeded unevenness of the hand */
	function brush(d, width, seed) {
		const pts = sample(d);
		const rnd = random(seed);
		const [f1, f2, p1, p2] = [9 + rnd() * 6, 23 + rnd() * 9, rnd() * 6.3, rnd() * 6.3];
		const side = (sign) =>
			pts.map((p) => {
				const m = Math.hypot(p.dx, p.dy) || 1;
				const w =
					width(p.u) *
					(1 + 0.06 * Math.sin(p.u * f1 + p1) + 0.04 * Math.sin(p.u * f2 + p2));
				return [p.x - (sign * p.dy * w) / 2 / m, p.y + (sign * p.dx * w) / 2 / m, w / 2];
			});
		const left = side(1);
		const right = side(-1).reverse();
		const pt = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`;
		const cap = (r, to) => `A${r.toFixed(2)} ${r.toFixed(2)} 0 0 0 ${pt(to)}`;
		return (
			`M${pt(left[0])}L${left.slice(1).map(pt).join(' ')}` +
			cap(left.at(-1)[2], right[0]) +
			`L${right.slice(1).map(pt).join(' ')}` +
			cap(right.at(-1)[2], left[0]) +
			'Z'
		);
	}

	/* A line beside the middle of `d`, `by(u)` to one side of it (the other side if negative),
	   from u `from` to `to` of the way along: the track of one bristle, for a brush running dry */
	function beside(d, by, from, to) {
		const pts = sample(d).filter((p) => p.u >= from && p.u <= to);
		const at = (p) => {
			const m = Math.hypot(p.dx, p.dy) || 1;
			const o = by(p.u);
			return `${(p.x - (p.dy * o) / m).toFixed(1)} ${(p.y + (p.dx * o) / m).toFixed(1)}`;
		};
		return `M${pts.map(at).join('L')}`;
	}

	/* Pressed down quickly, then lifted slowly: widest a sixth of the way along, a hair at the
	   end */
	const press = (max) => (u) =>
		max *
		(0.25 + 0.75 * Math.sin((Math.min(u / 0.17, 1) * Math.PI) / 2)) *
		(1 - 0.9 * u ** 1.15);
	// A flick: touched down, pressed, then drawn off to a point at the tip
	const flick = (max) => (u) =>
		max * Math.sin((Math.min(u / 0.3, 1) * Math.PI) / 2) * (1 - 0.85 * u);
	/* Where it runs dry: bristles (a share of the half-width, to one side or the other) that leave
	   no ink, broken, from u `from` until the hairline at the end */
	const DRY = [
		{ side: -0.55, from: 0.42, dash: '7 2 11 3 5 2' },
		{ side: 0.1, from: 0.58, dash: '4 3 9 2' },
		{ side: 0.6, from: 0.3, dash: '10 2 6 3' }
	];

	/* The arrow along `d`: the stroke's outline, `max` wide at its widest, the bristle tracks it
	   leaves dry, a flick either side of its end for the head (`head` long, `spread` apart), and
	   the path that reveals the head */
	function brushArrow(d, { max, head, spread, seed }) {
		const width = press(max);
		const [a, tip, b] = barbs(d, head, spread);
		const pt = (p) => p.map((n) => n.toFixed(1)).join(' ');
		return {
			line: brush(d, width, seed),
			dry: DRY.map((s) => ({
				...s,
				d: beside(d, (u) => (s.side * width(u)) / 2, s.from, 0.86)
			})),
			head: [
				brush(line(a, tip), flick(max * 0.68), seed + 1),
				brush(line(b, tip), flick(max * 0.6), seed + 2)
			],
			reveal: `M${pt(a)}L${pt(tip)} ${pt(b)}`
		};
	}

	/* Points along a path of cubics, with their tangents and how far along they are (u, 0–1) */
	function sample(d, steps = 28) {
		const v = numbers(d);
		const pts = [];
		let [x0, y0] = v;
		for (let i = 2; i + 5 < v.length; i += 6) {
			const [x1, y1, x2, y2, x3, y3] = v.slice(i, i + 6);
			for (let j = pts.length ? 1 : 0; j <= steps; j++) {
				const t = j / steps;
				const s = 1 - t;
				pts.push({
					x: s * s * s * x0 + 3 * s * s * t * x1 + 3 * s * t * t * x2 + t * t * t * x3,
					y: s * s * s * y0 + 3 * s * s * t * y1 + 3 * s * t * t * y2 + t * t * t * y3,
					dx: 3 * s * s * (x1 - x0) + 6 * s * t * (x2 - x1) + 3 * t * t * (x3 - x2),
					dy: 3 * s * s * (y1 - y0) + 6 * s * t * (y2 - y1) + 3 * t * t * (y3 - y2)
				});
			}
			[x0, y0] = [x3, y3];
		}
		let len = 0;
		pts[0].u = 0;
		for (let i = 1; i < pts.length; i++) {
			len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
			pts[i].u = len;
		}
		for (const p of pts) p.u /= len;
		return pts;
	}

	const numbers = (d) => d.match(/-?\d*\.?\d+/g).map(Number);

	/* A small seeded random source (mulberry32), so the hand's unevenness is the same
	   everywhere */
	function random(seed) {
		return () => {
			seed = (seed + 0x6d2b79f5) | 0;
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}
</script>

<script>
	/*
	 * The gold brush arrow of the "try it out" note, along any cubic path `d` (M, then C): one
	 * brush stroke pressed down, then lifted off to a hair at its end, running dry on the way
	 * (bristle tracks left unpainted), and a flick either side for the head. Its edges are softly
	 * ragged. Drawn inside an <svg>; `max` is the stroke's width at its widest, in the svg's
	 * units.
	 *
	 * Each part is revealed by a mask path drawn along its middle, `.stroke` for the line and
	 * `.head` for the head (both `pathLength="1"`): animate their stroke-dashoffset from 1 to draw
	 * the arrow on. Left alone, it is simply there.
	 */
	let { d, max = 6.2, head = 15, spread = 0.52, seed = 3 } = $props();
	const uid = $props.id();

	const at = $derived(brushArrow(d, { max, head, spread, seed }));
</script>

<defs>
	<filter id="{uid}-ragged" x="-10%" y="-10%" width="120%" height="120%">
		<feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" seed="7" />
		<feDisplacementMap
			in="SourceGraphic"
			scale={(max * 0.26).toFixed(2)}
			xChannelSelector="R"
			yChannelSelector="G"
		/>
	</filter>
	<mask id="{uid}-line" maskUnits="userSpaceOnUse" x="-1000" y="-1000" width="3000" height="3000">
		<path class="stroke reveal" pathLength="1" {d} style:stroke-width={max * 2.3} />
		{#each at.dry as s (s.side)}
			<path class="dry" d={s.d} stroke-dasharray={s.dash} style:stroke-width={max * 0.09} />
		{/each}
	</mask>
	<mask id="{uid}-head" maskUnits="userSpaceOnUse" x="-1000" y="-1000" width="3000" height="3000">
		<path class="head reveal" pathLength="1" d={at.reveal} style:stroke-width={max * 2.3} />
	</mask>
</defs>

<g class="ink" filter="url(#{uid}-ragged)">
	<path d={at.line} mask="url(#{uid}-line)" />
	<g mask="url(#{uid}-head)">
		{#each at.head as h, i (i)}
			<path d={h} />
		{/each}
	</g>
</g>

<style>
	/* The brush's ink a shade lighter than the words', darker where its strokes overlap */
	.ink {
		color: var(--vr-gold);
		fill: currentColor;
		mix-blend-mode: multiply;
	}

	.reveal {
		fill: none;
		stroke: white;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.dry {
		fill: none;
		stroke: black;
		stroke-linecap: round;
	}
</style>
