/*
 * Makes the `<name>-bleed.webp` that the VibeReel film strip's frames show
 * (src/routes/projects/vibe-reel/tv-screens/Screen.svelte): the TV shot carried on PAD px past
 * every edge, so that the frame's border is the picture itself. Out there each pixel is the
 * shot's nearest edge pixel, blurred by a Gaussian of σ its distance from the shot (the clamped
 * image blurred at σ 0.7 × 1.4ⁿ, and the two levels either side of each σ mixed), so the first
 * pixels out are the edge's own. The shot itself is copied in untouched.
 *
 *   node scripts/bleed-shots.mjs                all four shots
 *   node scripts/bleed-shots.mjs tv-home ...    only these
 *
 * Run it again whenever a shot changes (they come from vibe-reel's demo/tv-shots.mjs). Needs
 * ImageMagick 7 (`magick`) on the PATH.
 */
import { execFileSync } from 'node:child_process';

const DIR = new URL('../static/project-previews/vibe-reel/', import.meta.url).pathname;
const SHOTS = ['tv-home', 'tv-detail', 'tv-player', 'tv-search'];
// Screen.svelte lays the bleed out by this margin: 160 of 1600 × 1040 round a 1280 × 720 shot
const PAD = 160;
const QUALITY = '88';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

function bleed(input, output) {
	const [w, h] = execFileSync('magick', ['identify', '-format', '%w %h', input])
		.toString()
		.split(' ')
		.map(Number);
	const src = execFileSync('magick', [input, '-depth', '8', 'rgb:-'], { maxBuffer: 1 << 28 });
	const W = w + 2 * PAD;
	const H = h + 2 * PAD;

	// The shot clamped out to the full size, as float planes
	const planes = [0, 1, 2].map(() => new Float32Array(W * H));
	for (let Y = 0; Y < H; Y++) {
		const y = clamp(Y - PAD, 0, h - 1);
		for (let X = 0; X < W; X++) {
			const s = (y * w + clamp(X - PAD, 0, w - 1)) * 3;
			for (let c = 0; c < 3; c++) planes[c][Y * W + X] = src[s + c];
		}
	}

	// A box blur of radius r along the rows, from a into b, its edges clamped
	function boxRows(a, b, r) {
		for (let y = 0; y < H; y++) {
			const row = y * W;
			let sum = 0;
			for (let i = -r - 1; i < r; i++) sum += a[row + clamp(i, 0, W - 1)];
			for (let x = 0; x < W; x++) {
				sum += a[row + clamp(x + r, 0, W - 1)] - a[row + clamp(x - r - 1, 0, W - 1)];
				b[row + x] = sum / (2 * r + 1);
			}
		}
	}

	// The same down the columns
	function boxColumns(a, b, r) {
		for (let x = 0; x < W; x++) {
			let sum = 0;
			for (let i = -r - 1; i < r; i++) sum += a[clamp(i, 0, H - 1) * W + x];
			for (let y = 0; y < H; y++) {
				sum += a[clamp(y + r, 0, H - 1) * W + x] - a[clamp(y - r - 1, 0, H - 1) * W + x];
				b[y * W + x] = sum / (2 * r + 1);
			}
		}
	}

	// A Gaussian of σ, as three box blurs (Kovesi's widths)
	function gauss(plane, sigma) {
		let narrow = Math.floor(Math.sqrt(4 * sigma * sigma + 1));
		if (narrow % 2 === 0) narrow--;
		const m = Math.round(
			(12 * sigma * sigma - 3 * narrow * narrow - 12 * narrow - 9) / (-4 * narrow - 4)
		);
		let a = Float32Array.from(plane);
		let b = new Float32Array(W * H);
		for (let i = 0; i < 3; i++) {
			const r = ((i < m ? narrow : narrow + 2) - 1) / 2;
			boxRows(a, b, r);
			boxColumns(b, a, r);
		}
		return a;
	}

	// The levels: σ 0 (the clamped image itself), then up by 1.4 at a time past the largest σ
	const sigmas = [0];
	for (let s = 0.7; s < Math.hypot(PAD, PAD) * 1.4; s *= 1.4) sigmas.push(s);
	const levels = sigmas.map((s) => (s === 0 ? planes : planes.map((p) => gauss(p, s))));

	const out = Buffer.alloc(W * H * 3);
	for (let Y = 0; Y < H; Y++) {
		const y = Y - PAD;
		const dy = y < 0 ? -y : Math.max(0, y - (h - 1));
		for (let X = 0; X < W; X++) {
			const x = X - PAD;
			const dx = x < 0 ? -x : Math.max(0, x - (w - 1));
			const sigma = Math.hypot(dx, dy);
			let j = 0;
			while (j < sigmas.length - 2 && sigmas[j + 1] <= sigma) j++;
			const t = clamp((sigma - sigmas[j]) / (sigmas[j + 1] - sigmas[j]), 0, 1);
			const o = Y * W + X;
			for (let c = 0; c < 3; c++) {
				const v = levels[j][c][o] * (1 - t) + levels[j + 1][c][o] * t;
				out[o * 3 + c] = clamp(Math.round(v), 0, 255);
			}
		}
	}
	// The shot itself, untouched
	for (let y = 0; y < h; y++)
		src.copy(out, ((y + PAD) * W + PAD) * 3, y * w * 3, (y + 1) * w * 3);

	execFileSync(
		'magick',
		[
			'-size',
			`${W}x${H}`,
			'-depth',
			'8',
			'rgb:-',
			'-quality',
			QUALITY,
			'-define',
			'webp:method=6',
			output
		],
		{ input: out, maxBuffer: 1 << 28 }
	);
}

const names = process.argv.length > 2 ? process.argv.slice(2) : SHOTS;
for (const name of names) {
	bleed(`${DIR}${name}.webp`, `${DIR}${name}-bleed.webp`);
	console.log(`${name}-bleed.webp`);
}
