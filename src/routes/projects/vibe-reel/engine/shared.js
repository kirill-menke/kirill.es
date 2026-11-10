/*
 * What the Shape-shifter (Morph.svelte) and the web client's page in it (WebClient.svelte)
 * share: the section's paragraphs, the screenshot each device shows, and the length of a drawn
 * line.
 */
import { img } from '../media.js';

/** The paragraphs, each a bold lead and the rest: the iPhone app's, the TV app's and the web
 *  client's */
export const copy = {
	iphone: {
		lead: 'The iPhone app',
		rest: 'is a home-screen PWA: offline downloads, AirPlay, and push notifications when a new season or a requested movie is ready.'
	},
	tv: {
		lead: 'The TV app',
		rest: "is a webOS app for LG TVs: Direct Play through the TV's own media pipeline, with HDR, Dolby Vision and Atmos passed straight through, plus Skip Intro, Up Next and trickplay."
	},
	web: {
		lead: 'The web client',
		rest: "puts the phone's screens in a desktop layout for Chrome and Firefox, with mouse and keyboard, and streams through Media Source Extensions."
	}
};

export const shots = {
	home: { src: img('iphone-home'), alt: 'iPhone home screen' },
	player: { src: img('iphone-player'), alt: 'iPhone player' },
	tv: { src: img('tv-player'), alt: 'VibeReel TV player screen' },
	// The live phone's poster (LivePhone), the demo's Home until the app is up
	demo: { src: img('iphone-demo'), alt: 'VibeReel on the iPhone: home screen' }
};

/** The length of a path of absolute M, L, H, V and C commands, for dashes measured in the
 *  path's own units, so that a line drawn in with them doesn't rely on pathLength (which
 *  Chromium has ignored under a container query) */
export function pathLength(d) {
	let length = 0;
	let x = 0;
	let y = 0;
	const to = (nx, ny) => {
		length += Math.hypot(nx - x, ny - y);
		[x, y] = [nx, ny];
	};
	for (const [, cmd, args] of d.matchAll(/([MLHVC])([^MLHVC]*)/g)) {
		const n = args.match(/-?\d*\.?\d+/g).map(Number);
		if (cmd === 'M') [x, y] = n;
		else if (cmd === 'H') to(n[0], y);
		else if (cmd === 'V') to(x, n[0]);
		else if (cmd === 'L') for (let i = 0; i < n.length; i += 2) to(n[i], n[i + 1]);
		else {
			for (let k = 0; k < n.length; k += 6) {
				const [x0, y0] = [x, y];
				const [x1, y1, x2, y2, x3, y3] = n.slice(k, k + 6);
				for (let i = 1; i <= 24; i++) {
					const t = i / 24;
					const u = 1 - t;
					to(
						u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
						u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
					);
				}
			}
		}
	}
	return Math.round(length * 10) / 10;
}
