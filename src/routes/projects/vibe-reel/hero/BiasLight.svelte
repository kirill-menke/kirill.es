<script module>
	/*
	 * Sampling a shot: drawn small into a canvas, the strip along each edge (a sixth of the
	 * picture deep) gives that side of the light its colour and strength.
	 *
	 * The colour is the strip's light averaged in linear RGB, each pixel counted by how colourful
	 * it is, so that the dark and grey UI hardly counts against a poster or a sky. It is kept as
	 * a hue and a saturation (OKLCH chroma over lightness), as the light is drawn at a lightness
	 * of its own; a strip with too little colour in it takes the whole picture's. The strength is
	 * the strip's brightness, from a quarter (a black bar still lets a little light past) to 1.
	 */
	const W = 160;
	const H = 90;
	const EDGE = 1 / 6;
	// Less colour than this, per pixel, and a strip takes the whole picture's
	const COLOURLESS = 0.01;
	// The brightness (mean relative luminance) from which a strip lights its side fully
	const BRIGHT = 0.12;

	const LINEAR = Array.from({ length: 256 }, (_, i) => {
		const c = i / 255;
		return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});

	// Linear sRGB to OKLCH's hue and saturation (chroma over lightness, which, unlike chroma,
	// stays the same as the colour is made brighter or darker)
	function hueOf(r, g, b) {
		const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
		const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
		const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
		const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
		const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
		const z = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
		return {
			saturation: lightness > 0 ? Math.hypot(a, z) / lightness : 0,
			hue: ((Math.atan2(z, a) * 180) / Math.PI + 360) % 360
		};
	}

	// An OKLCH colour in sRGB, its chroma lowered as far as it must be to fit
	function rgbOf(lightness, chroma, hue, alpha) {
		const h = (hue * Math.PI) / 180;
		const linear = (c) => {
			const a = c * Math.cos(h);
			const z = c * Math.sin(h);
			const l = (lightness + 0.3963377774 * a + 0.2158037573 * z) ** 3;
			const m = (lightness - 0.1055613458 * a - 0.0638541728 * z) ** 3;
			const s = (lightness - 0.0894841775 * a - 1.291485548 * z) ** 3;
			return [
				4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
				-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
				-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
			];
		};
		const fits = (c) => linear(c).every((v) => v >= 0 && v <= 1);
		let fitted = chroma;
		if (!fits(fitted)) {
			let low = 0;
			let high = chroma;
			for (let i = 0; i < 12; i++) {
				fitted = (low + high) / 2;
				if (fits(fitted)) low = fitted;
				else high = fitted;
			}
			fitted = low;
		}
		const [r, g, b] = linear(fitted).map((v) => {
			const c = Math.min(1, Math.max(0, v));
			return Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055));
		});
		return `rgb(${r} ${g} ${b} / ${alpha.toFixed(2)})`;
	}

	function measure(data) {
		const sides = ['top', 'right', 'bottom', 'left'];
		const sums = Object.fromEntries(
			[...sides, 'all'].map((zone) => [zone, { r: 0, g: 0, b: 0, w: 0, y: 0, n: 0 }])
		);
		for (let y = 0; y < H; y++) {
			for (let x = 0; x < W; x++) {
				const i = (y * W + x) * 4;
				const r = LINEAR[data[i]];
				const g = LINEAR[data[i + 1]];
				const b = LINEAR[data[i + 2]];
				const w = Math.max(r, g, b) - Math.min(r, g, b);
				const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
				const add = (sum) => {
					sum.r += w * r;
					sum.g += w * g;
					sum.b += w * b;
					sum.w += w;
					sum.y += lum;
					sum.n++;
				};
				add(sums.all);
				if (y < H * EDGE) add(sums.top);
				if (y >= H * (1 - EDGE)) add(sums.bottom);
				if (x < W * EDGE) add(sums.left);
				if (x >= W * (1 - EDGE)) add(sums.right);
			}
		}
		const colourOf = (sum) => hueOf(sum.r / sum.w, sum.g / sum.w, sum.b / sum.w);
		const all = sums.all.w > 0 ? colourOf(sums.all) : { saturation: 0, hue: 0 };
		return Object.fromEntries(
			sides.map((zone) => {
				const sum = sums[zone];
				const strength = 0.25 + 0.75 * Math.min(1, Math.sqrt(sum.y / sum.n / BRIGHT));
				return [zone, { ...(sum.w / sum.n > COLOURLESS ? colourOf(sum) : all), strength }];
			})
		);
	}

	// Each source sampled once, for every bias light that shows it (a plain cache, not state)
	const sampled = {};
	function sample(src) {
		if (!(src in sampled)) {
			const image = new Image();
			image.src = src;
			const palette = image.decode().then(() => {
				const canvas = document.createElement('canvas');
				canvas.width = W;
				canvas.height = H;
				const context = canvas.getContext('2d', { willReadFrequently: true });
				context.imageSmoothingQuality = 'high';
				context.drawImage(image, 0, 0, W, H);
				return measure(context.getImageData(0, 0, W, H).data);
			});
			// A shot that fails to load keeps the gold, and may be tried again
			palette.catch(() => delete sampled[src]);
			sampled[src] = palette;
		}
		return sampled[src];
	}
</script>

<script>
	/*
	 * The wall round the TV lit in the colours of the picture on it, as by a strip of LEDs
	 * behind the set. Each shot is sampled once (above); each side of the TV takes the colour of
	 * the picture's edge on that side, its chroma multiplied by 1.4 (BOOST), as bright as that
	 * edge.
	 *
	 * The light is four box-shadows of a box behind the TV's screen, one per side, each moved 7
	 * past its edge and blurred 20 (in hundredths of the set's width; shadows, as they never
	 * widen the page the way a larger box would), faint (an opacity of 0.065). When the TV moves
	 * on to its next shot the shadows take on its colours over 1.2 seconds.
	 *
	 * Which shot is on comes from the pictures' own animations (devices/TvPicture): each starts
	 * an iteration as it comes on, so the one furthest from the end of its iteration is the one
	 * showing, and their animation events bubble up to the TV's box, where this sits. Without
	 * the loop (one picture, or reduced motion) the first picture is the one shown. Until the
	 * script has sampled them, as in the prerendered page, the light is the page's gold.
	 */
	import { onMount } from 'svelte';

	let { srcs } = $props();

	// The lightness every colour is drawn at, the most chroma it is given (less where sRGB has
	// no such colour), and how much more colourful than the picture it is
	const LIGHTNESS = 0.75;
	const CHROMA = 0.22;
	const BOOST = 1.4;
	const GOLD = 'color-mix(in srgb, var(--vr-gold-fill) 60%, transparent)';

	let light = $state();
	// The colours of each shot sampled so far, by source, and the shot on the TV (the first
	// until the TV's pictures say otherwise)
	let palettes = $state({});
	let shown = $state();
	const on = $derived(shown ?? srcs[0]);
	// The screen's place in the TV's box, as an inset, once measured
	let screen = $state(null);

	const paint = ({ hue, saturation, strength }) =>
		rgbOf(LIGHTNESS, Math.min(CHROMA, saturation * LIGHTNESS * BOOST), hue, strength);
	const colours = $derived.by(() => {
		const palette = palettes[on];
		const side = (zone) => (palette ? paint(palette[zone]) : GOLD);
		return {
			top: side('top'),
			right: side('right'),
			bottom: side('bottom'),
			left: side('left')
		};
	});

	// The first colours go on at once, so that the gold never fades into them; the fade is
	// switched on once they are applied (read back, which applies them)
	let settled = $state(false);
	$effect(() => {
		if (settled || !palettes[on]) return;
		void getComputedStyle(light).boxShadow;
		settled = true;
	});

	onMount(() => {
		const tv = light.parentElement;
		const pictures = () =>
			[...tv.querySelectorAll('img')].filter((img) => srcs.includes(img.getAttribute('src')));

		function findShown() {
			const all = pictures();
			let on = all[0];
			let least = Infinity;
			for (const picture of all) {
				for (const animation of picture.getAnimations()) {
					const { progress } = animation.effect.getComputedTiming();
					if (progress !== null && progress < least) {
						least = progress;
						on = picture;
					}
				}
			}
			if (on) shown = on.getAttribute('src');
		}

		const onAnimation = (event) => {
			if (event.target instanceof HTMLImageElement) findShown();
		};
		const EVENTS = ['animationstart', 'animationiteration', 'animationcancel', 'animationend'];
		for (const type of EVENTS) tv.addEventListener(type, onAnimation);
		findShown();

		/* The light comes from behind the screen, the box its pictures are in: as a shadow is
		   only drawn outside its box, the room the sketched set leaves round the screen in the
		   TV's box (its frame) must not show as a hole in the light. Layout offsets, so that a
		   transformed set measures as it is laid out. */
		function fit() {
			const glass = pictures()[0]?.parentElement;
			let [x, y] = [0, 0];
			let node = glass;
			while (node && node !== tv) {
				x += node.offsetLeft;
				y += node.offsetTop;
				node = node.offsetParent;
				if (node && node !== tv) {
					x += node.clientLeft;
					y += node.clientTop;
				}
			}
			if (!glass || node !== tv) {
				screen = null;
				return;
			}
			const right = tv.clientWidth - x - glass.offsetWidth;
			const bottom = tv.clientHeight - y - glass.offsetHeight;
			screen = `${y}px ${right}px ${bottom}px ${x}px`;
		}
		fit();
		const resized = new ResizeObserver(fit);
		resized.observe(tv);
		// And again whenever the TV's contents change
		const remade = new MutationObserver(fit);
		remade.observe(tv, { childList: true, subtree: true });

		let gone = false;
		for (const src of srcs) {
			sample(src).then(
				(palette) => {
					if (!gone) palettes[src] = palette;
				},
				() => {}
			);
		}
		return () => {
			gone = true;
			resized.disconnect();
			remade.disconnect();
			for (const type of EVENTS) tv.removeEventListener(type, onAnimation);
		};
	});
</script>

<div
	class="bias"
	class:settled
	bind:this={light}
	aria-hidden="true"
	style:inset={screen}
	style:--top={colours.top}
	style:--right={colours.right}
	style:--bottom={colours.bottom}
	style:--left={colours.left}
></div>

<style>
	/* The screen's box (the TV's until measured), behind it in the stage's stacking context,
	   its shadows round it */
	.bias {
		--out: 7cqw;
		--soft: 20cqw;
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: 0.6rem;
		pointer-events: none;
		box-shadow:
			0 calc(var(--out) * -1) var(--soft) var(--top),
			var(--out) 0 var(--soft) var(--right),
			0 var(--out) var(--soft) var(--bottom),
			calc(var(--out) * -1) 0 var(--soft) var(--left);
		opacity: 0.065;
	}

	.settled {
		transition: box-shadow 1.2s ease-in-out;
	}
</style>
