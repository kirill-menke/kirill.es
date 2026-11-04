import { onNavigate } from '$app/navigation';

// List pages stagger their tiles in slowly when the visitor arrives from the home page or loads
// the page directly, and show them quickly when moving between list pages. The flag is written
// before the next page renders and read while it renders, so it is a plain variable, not state.
// It stays true during prerendering and hydration, so server and client agree.
let slow = true;

/** Call once from the root layout. */
export function trackEntrance() {
	onNavigate(({ from }) => {
		slow = !from || from.url.pathname === '/';
	});
}

/** Entrance timing (ms) for the index-th tile of a list page. */
export function listEntrance(index) {
	return slow ? { duration: 600, delay: index * 125 } : { duration: 300, delay: 0 };
}
