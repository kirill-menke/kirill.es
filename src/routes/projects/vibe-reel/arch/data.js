/*
 * The architecture drawing (ArchDiagram.svelte), as data: what it says, and where each of its two
 * layouts puts it. `landscape` is the drawing of a wide page, its machines side by side: the
 * TV, the NAS, then the phone and browser over the internet. `portrait` is a phone's: the same
 * machines one under another, in a drawing as wide as a phone's column, so that it need not
 * scroll sideways.
 *
 * A layout has its `view` (the SVG's viewBox), the `frames` round the machines, the `boxes` in
 * them (`at` places a box's words: their x, then the baselines of the title and each line of
 * small print, all from the box's corner), the `pills`, the `lists` and the `edges`, in groups
 * with the labels written along them. A straight edge runs `from` → `to`, a curve follows `d`;
 * each stops a head (13) short of its target, and its head (the drawing's chevron) carries it
 * on to the tip. `optional` and `faint` mark the dashed ones.
 */

// The machines
const FRAME = {
	tv: 'LIVING-ROOM TV · LG WEBOS',
	nas: 'NAS · NIXOS',
	clients: 'PHONE & BROWSER',
	internet: 'INTERNET'
};

// The boxes: a title and its small print
const BOX = {
	tv: {
		title: 'TV app',
		sub: ['Svelte 5 · webOS IPK · Chromium 120', '<video> on the hardware video plane']
	},
	companion: {
		title: 'Companion service',
		sub: ['root · Node · port 8791', 'Luna → settingsservice'],
		optional: true
	},
	soundbar: { title: 'Soundbar', sub: ['AV receiver'], device: true },
	jellyfin: {
		title: 'Jellyfin 12.1',
		sub: ['library · PlaybackInfo · trickplay', 'Intro Skipper plugin → media segments']
	},
	reelApi: {
		title: 'reel-api',
		sub: ['FastAPI · Python 3.12 · one worker', 'search & add · downloads · trailers · push'],
		optional: true
	},
	iphone: { title: 'iPhone PWA', sub: ['Safari · offline · push'], optional: true },
	web: { title: 'Web client', sub: ['Chrome · Firefox · MSE'], optional: true }
};

// What reel-api reaches on the internet
const INTERNET = [
	'IMDb trending & charts',
	'IntroDB skip markers',
	'YouTube trailers (yt-dlp)',
	'Radarr collections',
	'Web Push to the iPhone'
];

// The words written along the edges
const SAY = {
	play: 'Direct Play',
	rest: 'REST API',
	earc: ['DD+ · Atmos · DTS', 'bitstream over eARC'],
	loopback: 'loopback HTTP',
	api: '/api · streams',
	token: 'checks the Jellyfin token',
	download: 'download',
	hls: 'HLS remux'
};

export const landscape = {
	// The drawing reaches from 20 to 980 across and from 40 to 510 down: the view leaves 20
	// round it on every side
	view: [0, 20, 1000, 510],
	frames: [
		{ label: FRAME.tv, x: 20, y: 40, w: 300, h: 290 },
		{ label: FRAME.nas, x: 380, y: 40, w: 340, h: 470 },
		{ label: FRAME.clients, x: 780, y: 40, w: 200, h: 216 },
		{ label: FRAME.internet, x: 780, y: 300, w: 200, h: 190, faint: true }
	],
	boxes: [
		{ ...BOX.tv, x: 40, y: 90, w: 260, h: 86, at: [18, 28, 50, 70] },
		{ ...BOX.companion, x: 40, y: 226, w: 180, h: 84, at: [18, 28, 49, 68] },
		{ ...BOX.soundbar, x: 200, y: 408, w: 120, h: 56, at: [18, 26, 44] },
		{ ...BOX.jellyfin, x: 400, y: 90, w: 300, h: 86, at: [18, 28, 50, 70] },
		{ ...BOX.reelApi, x: 400, y: 246, w: 300, h: 86, at: [18, 28, 50, 70] },
		{ ...BOX.iphone, x: 800, y: 92, w: 160, h: 60, at: [16, 25, 45] },
		{ ...BOX.web, x: 800, y: 176, w: 160, h: 60, at: [16, 25, 45] }
	],
	// Sonarr and Radarr under reel-api's arrows, Prowlarr a row down between them
	pills: [
		{ text: 'Sonarr', x: 400, y: 384, w: 68 },
		{ text: 'Radarr', x: 496, y: 384, w: 68 },
		{ text: 'Prowlarr', x: 446, y: 456, w: 72, muted: true },
		{ text: 'qBittorrent', x: 626, y: 384, w: 74 }
	],
	lists: [{ x: 800, y: 362, step: 26, items: INTERNET }],
	edges: [
		{
			edges: [{ id: 'direct-play', from: [300, 110], to: [387, 110] }],
			labels: [{ x: 348, y: 98, anchor: 'middle', text: SAY.play }]
		},
		{
			edges: [{ id: 'rest', from: [300, 156], to: [387, 156] }],
			labels: [{ x: 348, y: 144, anchor: 'middle', text: SAY.rest }]
		},
		{
			edges: [{ id: 'earc', from: [260, 176], to: [260, 395] }],
			labels: [
				{ x: 250, y: 362, anchor: 'end', text: SAY.earc[0] },
				{ x: 250, y: 378, anchor: 'end', text: SAY.earc[1] }
			]
		},
		{
			edges: [{ id: 'loopback', from: [100, 176], to: [100, 213] }],
			labels: [{ x: 110, y: 204, text: SAY.loopback }]
		},
		{
			edges: [{ id: 'api', d: 'M300,166 C350,166 345,290 387,290', optional: true }],
			labels: [{ x: 356, y: 232, text: SAY.api }]
		},
		{
			edges: [{ id: 'token', from: [550, 246], to: [550, 189] }],
			labels: [{ x: 560, y: 218, text: SAY.token }]
		},
		{
			edges: [
				{ id: 'sonarr', from: [434, 332], to: [434, 371] },
				{ id: 'radarr', from: [530, 332], to: [530, 371] },
				{ id: 'qbittorrent', from: [663, 332], to: [663, 371] }
			],
			labels: [{ x: 653, y: 360, anchor: 'end', text: SAY.download }]
		},
		{
			// Sonarr and Radarr search through Prowlarr, under and between them
			edges: [
				{ id: 'sonarr-prowlarr', from: [434, 418], to: [462.8, 446.8] },
				{ id: 'radarr-prowlarr', from: [530, 418], to: [501.2, 446.8] }
			]
		},
		{
			edges: [{ id: 'internet', d: 'M700,310 C745,310 740,400 767,400', faint: true }]
		},
		{
			edges: [
				{ id: 'hls', from: [800, 122], to: [713, 122], optional: true },
				{ id: 'web', d: 'M800,206 C750,206 745,276 713,276', optional: true }
			],
			labels: [{ x: 752, y: 112, anchor: 'middle', text: SAY.hls }]
		}
	]
};

/*
 * A phone's drawing, 360 wide: the machines in a column, the TV first with its soundbar over
 * it, then the NAS, the phone and browser, and the internet last. Its edges all run up or
 * down. Jellyfin and reel-api are set a little apart sideways, like two bricks, which leaves a
 * channel beside each: down the right one, past Jellyfin, runs the TV app's line to reel-api,
 * and under reel-api the web client's comes up it; up the left one, past reel-api, runs the
 * iPhone's line to Jellyfin. reel-api's line to the internet threads between the pills and
 * then between the phone and the browser. A frame's `lx` sets its label in from the corner,
 * where a line comes down through the frame's first row.
 */
export const portrait = {
	view: [0, 0, 360, 1086],
	frames: [
		{ label: FRAME.tv, x: 4, y: 74, w: 352, h: 258 },
		{ label: FRAME.nas, x: 4, y: 390, w: 352, h: 396 },
		{ label: FRAME.clients, x: 4, y: 828, w: 352, h: 110, lx: 37 },
		{ label: FRAME.internet, x: 4, y: 958, w: 352, h: 122, faint: true }
	],
	boxes: [
		{ ...BOX.soundbar, x: 226, y: 6, w: 120, h: 52, at: [18, 24, 41] },
		{ ...BOX.tv, x: 14, y: 112, w: 332, h: 82, at: [18, 27, 48, 67] },
		{ ...BOX.companion, x: 14, y: 240, w: 176, h: 78, at: [16, 26, 46, 64] },
		{ ...BOX.jellyfin, x: 14, y: 428, w: 288, h: 82, at: [18, 27, 48, 67] },
		{ ...BOX.reelApi, x: 58, y: 560, w: 288, h: 82, at: [18, 27, 48, 67] },
		{ ...BOX.iphone, x: 14, y: 866, w: 143, h: 58, at: [14, 24, 43] },
		{ ...BOX.web, x: 189, y: 866, w: 157, h: 58, at: [13, 24, 43] }
	],
	pills: [
		{ text: 'Sonarr', x: 58, y: 680, w: 58 },
		{ text: 'Radarr', x: 126, y: 680, w: 58 },
		{ text: 'Prowlarr', x: 85, y: 738, w: 72, muted: true },
		{ text: 'qBittorrent', x: 240, y: 680, w: 76 }
	],
	lists: [
		{ x: 24, y: 1014, step: 24, items: INTERNET.slice(0, 3) },
		{ x: 194, y: 1014, step: 24, items: INTERNET.slice(3) }
	],
	edges: [
		{
			edges: [{ id: 'earc', from: [286, 112], to: [286, 71] }],
			labels: [
				{ x: 216, y: 27, anchor: 'end', text: SAY.earc[0] },
				{ x: 216, y: 43, anchor: 'end', text: SAY.earc[1] }
			]
		},
		{
			edges: [{ id: 'loopback', from: [74, 194], to: [74, 227] }],
			labels: [{ x: 84, y: 220, text: SAY.loopback }]
		},
		{
			// The two lines of the core, side by side, their names beside them
			edges: [
				{ id: 'direct-play', from: [208, 194], to: [208, 415] },
				{ id: 'rest', from: [224, 194], to: [224, 415] }
			],
			labels: [
				{ x: 198, y: 356, anchor: 'end', text: SAY.play },
				{ x: 198, y: 372, anchor: 'end', text: SAY.rest }
			]
		},
		{
			edges: [{ id: 'api', from: [329, 194], to: [329, 547], optional: true }],
			labels: [{ x: 318, y: 364, anchor: 'end', text: SAY.api }]
		},
		{
			edges: [{ id: 'token', from: [150, 560], to: [150, 523] }],
			labels: [{ x: 160, y: 545, text: SAY.token }]
		},
		{
			edges: [
				{ id: 'sonarr', from: [87, 642], to: [87, 667] },
				{ id: 'radarr', from: [155, 642], to: [155, 667] },
				{ id: 'qbittorrent', from: [278, 642], to: [278, 667] }
			],
			labels: [{ x: 268, y: 666, anchor: 'end', text: SAY.download }]
		},
		{
			edges: [
				{ id: 'sonarr-prowlarr', from: [87, 714], to: [99.4, 728.2] },
				{ id: 'radarr-prowlarr', from: [155, 714], to: [142.6, 728.2] }
			]
		},
		{
			edges: [
				{ id: 'internet', d: 'M197,642 V772 C197,810 173,796 173,834 V945', faint: true }
			]
		},
		{
			edges: [
				{ id: 'hls', from: [31, 866], to: [31, 523], optional: true },
				{ id: 'web', from: [329, 866], to: [329, 655], optional: true }
			],
			labels: [{ x: 41, y: 812, text: SAY.hls }]
		}
	]
};
