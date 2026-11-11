/*
 * What the Shape-shifter (Morph.svelte) and the web client's page in it (WebClient.svelte)
 * share: the section's paragraphs and the screenshot each device shows.
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
