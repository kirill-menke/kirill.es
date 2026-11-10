/*
 * The layer the grease pencil (pencil.js) paints on: a canvas over the demo's screen, inside the
 * demo's own document (it is same-origin). There the screen's scale, any turn of the phone and
 * the screen's rounded corners apply to it as to the app, and it sits above the status bar and
 * the Dynamic Island, where iOS draws touches in a screen recording. It never takes the pointer,
 * so taps and drags still reach the app, and the demo's own cursor is hidden while it is up.
 * `layer` puts it all in and returns what takes it all out again.
 *
 * The cursor is a painter: { draw(ctx, p, o, now, dt) }, which paints a frame on the cleared
 * canvas, in the demo's px, and returns whether anything of it is still moving. `p` is the
 * pointer:
 *   x, y     where it is
 *   over     over the screen
 *   down     pressed: the left button, or the demo's long-press (a right-click)
 *   downAt   when it last touched
 *   trail    where it has been in the last TRAIL ms, oldest first: { x, y, t, down }
 *   show     0–1, eased: how much of the cursor to draw (none once it leaves the screen)
 *   press    0–1, a spring with a little give: how pressed it looks
 * and `o` the frame's settings:
 *   u        the demo's px per px on screen: a cursor drawn in u is the same size on screen
 *            however large the phone is
 *   still    reduced motion: no trails or wobble
 *   c        the page's colours, as #rrggbb: gold and shade
 * Times are the demo's (its rAF and event timestamps), in ms.
 */
import { prefersReducedMotion } from 'svelte/motion';

export const TAU = 2 * Math.PI;

// How long the pointer's trail lasts, in ms
export const TRAIL = 100;

// On the demo's <html> while the layer is up. `:root.vr-cursor *` (0,2,0) outranks the demo's
// own `html.demo-press *` (0,1,1).
const HIDE = 'vr-cursor';

// The cursor's colours, from the page's tokens while they hold a #rrggbb (alpha is mixed into
// them)
const COLOURS = {
	gold: ['--vr-gold-fill', '#e6b450'],
	shade: ['--color-device-screen', '#0b0b0d']
};

/**
 * @param {HTMLIFrameElement} frame the demo's iframe
 * @param {() => object} cursor returns the painter
 */
export function layer(frame, cursor) {
	const win = frame.contentWindow;
	const doc = frame.contentDocument;
	if (!win || !doc?.body) return () => {};

	const tokens = getComputedStyle(frame);
	const c = {};
	for (const [name, [token, fallback]] of Object.entries(COLOURS)) {
		const value = tokens.getPropertyValue(token).trim();
		c[name] = /^#[\da-f]{6}$/i.test(value) ? value : fallback;
	}

	const style = doc.createElement('style');
	style.textContent = `:root.${HIDE}, :root.${HIDE} * { cursor: none !important; }`;
	doc.head.append(style);
	doc.documentElement.classList.add(HIDE);

	const canvas = doc.createElement('canvas');
	canvas.setAttribute('aria-hidden', 'true');
	canvas.style.cssText =
		'position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2147483647';
	doc.body.append(canvas);
	const ctx = canvas.getContext('2d');
	const paint = cursor();

	const p = {
		x: 0,
		y: 0,
		over: false,
		down: false,
		downAt: -Infinity,
		trail: [],
		show: 0,
		press: 0
	};
	// The press spring's velocity, per second
	let give = 0;
	// Screen px per demo px, read afresh for each frame
	let k = 1;
	let raf = 0;
	let last = 0;
	const kick = () => (raf ||= win.requestAnimationFrame(tick));

	/* Screen px per demo px. The frame's box is W × H, its rect on screen w × h; if the phone is
	   turned by θ as well as scaled by s, then w = s(W|cos θ| + H|sin θ|) and
	   h = s(W|sin θ| + H|cos θ|), which give s|cos θ| and s|sin θ|, and so s. */
	function scale() {
		const W = frame.offsetWidth;
		const H = frame.offsetHeight;
		const { width: w, height: h } = frame.getBoundingClientRect();
		if (!W || !H || W === H) return w / W || 1;
		const cos = (w * W - h * H) / (W * W - H * H);
		const sin = (h * W - w * H) / (W * W - H * H);
		return cos > 0 && sin >= -0.01 ? Math.hypot(cos, Math.max(sin, 0)) : w / W || 1;
	}

	function at(e) {
		const x = e.clientX;
		const y = e.clientY;
		p.x = x;
		p.y = y;
		const end = p.trail.at(-1);
		if (!end || Math.hypot(x - end.x, y - end.y) >= 0.5)
			p.trail.push({ x, y, t: e.timeStamp, down: p.down });
	}

	function enter(e) {
		if (p.over) return;
		// Back on the screen somewhere else: no trail from where it left
		p.over = true;
		p.trail.length = 0;
		p.x = e.clientX;
		p.y = e.clientY;
	}

	function moved(e) {
		enter(e);
		const events = e.getCoalescedEvents?.();
		for (const m of events?.length ? events : [e]) at(m);
		kick();
	}

	function touched(e) {
		// The right button is the demo's long-press, which then touches by itself
		if (e.button !== 0) return;
		enter(e);
		at(e);
		p.down = true;
		p.downAt = e.timeStamp;
		kick();
	}

	function lifted(e) {
		if (!p.down || (e.type === 'pointerup' && e.button !== 0)) return;
		p.down = false;
		kick();
	}

	function left(e) {
		if (e.relatedTarget) return;
		p.over = false;
		kick();
	}

	function tick(now) {
		raf = 0;
		const dt = last ? Math.min(now - last, 50) : 16;
		last = now;
		k = scale();
		const o = { u: 1 / k, still: prefersReducedMotion.current, c };

		// The canvas in device pixels, drawn on in the demo's px
		const w = win.innerWidth;
		const h = win.innerHeight;
		const cw = Math.round(w * win.devicePixelRatio * k);
		const ch = Math.round(h * win.devicePixelRatio * k);
		if (canvas.width !== cw || canvas.height !== ch) {
			canvas.width = cw;
			canvas.height = ch;
		}
		ctx.setTransform(cw / w, 0, 0, ch / h, 0, 0);
		ctx.clearRect(0, 0, w, h);
		ctx.globalAlpha = 1;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		while (p.trail.length && now - p.trail[0].t > TRAIL) p.trail.shift();

		const show = p.over ? 1 : 0;
		const press = p.down ? 1 : 0;
		if (o.still) {
			p.show = show;
			p.press = press;
			give = 0;
		} else {
			p.show += (show - p.show) * (1 - Math.exp(-dt / (show ? 40 : 110)));
			if (Math.abs(show - p.show) < 0.005) p.show = show;
			// ω² = 1500, damping 42: about 13% overshoot, settled in a quarter of a second
			for (let rest = dt; rest > 0; rest -= 4) {
				const step = Math.min(rest, 4) / 1000;
				give += ((press - p.press) * 1500 - give * 42) * step;
				p.press += give * step;
			}
			if (Math.abs(press - p.press) < 0.002 && Math.abs(give) < 0.05) {
				p.press = press;
				give = 0;
			}
		}

		const moving = paint.draw(ctx, p, o, now, dt);
		if (moving || p.trail.length || p.show !== show || p.press !== press) kick();
		else last = 0;
	}

	const listeners = [
		['pointermove', moved, true],
		['pointerdown', touched, true],
		['pointerup', lifted, true],
		['pointercancel', lifted, true],
		['pointerout', left, true],
		// The window's own blur only: an element's blur passes the window on capture
		['blur', lifted, false]
	];
	for (const [type, fn, capture] of listeners) win.addEventListener(type, fn, capture);

	return () => {
		win.cancelAnimationFrame(raf);
		for (const [type, fn, capture] of listeners) win.removeEventListener(type, fn, capture);
		canvas.remove();
		style.remove();
		doc.documentElement.classList.remove(HIDE);
	};
}

/** `hex` (#rrggbb) at `alpha` */
export function rgba(hex, alpha) {
	const n = parseInt(hex.slice(1), 16);
	return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/* A repeatable pseudo-random number in [0, 1) for `seed`, so a hand-drawn shape can be drawn the
   same again */
export function random(seed) {
	const s = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
	return s - Math.floor(s);
}

/* Strokes the current path in `colour` over a dark halo 1.9 px wider (`halo` of its alpha), as
   the demo's ensō is drawn, so it reads on the app's light screens as well as its dark ones */
export function inked(ctx, o, colour, width, alpha = 1, halo = 0.5) {
	ctx.lineWidth = width + 1.9 * o.u;
	ctx.strokeStyle = rgba(o.c.shade, halo * alpha);
	ctx.stroke();
	ctx.lineWidth = width;
	ctx.strokeStyle = rgba(colour, alpha);
	ctx.stroke();
}

/* The outline of a stroke through `pts` (oldest first) that is `half(i)` either side of point i,
   as one shape, so filled it has no overlaps to darken where it crosses itself. Each side is
   smoothed through its midpoints. */
export function ribbon(ctx, pts, half) {
	const n = pts.length;
	const side = new Float64Array(n * 4);
	for (let i = 0; i < n; i++) {
		const a = pts[Math.max(i - 1, 0)];
		const b = pts[Math.min(i + 1, n - 1)];
		const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
		const w = half(i);
		const nx = ((a.y - b.y) / len) * w;
		const ny = ((b.x - a.x) / len) * w;
		side[i * 4] = pts[i].x + nx;
		side[i * 4 + 1] = pts[i].y + ny;
		side[i * 4 + 2] = pts[i].x - nx;
		side[i * 4 + 3] = pts[i].y - ny;
	}
	ctx.beginPath();
	ctx.moveTo(side[0], side[1]);
	along(ctx, side, n, 0, false);
	along(ctx, side, n, 2, true);
	ctx.closePath();
}

// One side of a ribbon (`at` 0 the left, 2 the right), forwards or back
function along(ctx, side, n, at, back) {
	const x = (i) => side[(back ? n - 1 - i : i) * 4 + at];
	const y = (i) => side[(back ? n - 1 - i : i) * 4 + at + 1];
	ctx.lineTo(x(0), y(0));
	for (let i = 1; i < n - 1; i++)
		ctx.quadraticCurveTo(x(i), y(i), (x(i) + x(i + 1)) / 2, (y(i) + y(i + 1)) / 2);
	ctx.lineTo(x(n - 1), y(n - 1));
}
