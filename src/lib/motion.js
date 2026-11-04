// Svelte transitions that respect prefers-reduced-motion. Svelte runs transitions through
// element.animate(), which a CSS media query cannot reach, so they check the setting here.
// Import fly/fade from this module instead of 'svelte/transition'.
import { fly as svelteFly, fade as svelteFade } from 'svelte/transition';
import { prefersReducedMotion } from 'svelte/motion';

const still = (params = {}) =>
	prefersReducedMotion.current ? { ...params, duration: 0, delay: 0 } : params;

export const fly = (node, params) => svelteFly(node, still(params));
export const fade = (node, params) => svelteFade(node, still(params));

/** `behavior` for scrollIntoView/scrollTo: instant when the visitor asks for reduced motion. */
export const scrollBehavior = () => (prefersReducedMotion.current ? 'auto' : 'smooth');
