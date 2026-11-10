/* The TV app's four main screens, in the section's order, for TvScreens' film strip */
import { img } from '../media.js';

export const screens = [
	{
		src: img('tv-home'),
		title: 'Home',
		text: 'A hero for the title you are in the middle of, then Continue Watching, Next Up and what is trending on IMDb.'
	},
	{
		src: img('tv-detail'),
		title: 'Detail',
		text: 'Resume, start over, mark watched, and a trailer that plays in the app’s own player.'
	},
	{
		src: img('tv-player'),
		title: 'Player',
		text: 'Chapter ticks on the scrubber, trickplay previews, Skip Intro, and audio, subtitle and picture-mode panels.'
	},
	{
		src: img('tv-search'),
		title: 'Search',
		text: 'Titles you don’t have can be added, and a download in progress shows up right in the results.'
	}
].map((s) => ({ ...s, alt: `VibeReel TV ${s.title} screen` }));
