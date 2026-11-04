<script>
	import { page } from '$app/state';

	const navItems = [
		{ label: 'Kirill', href: '/' },
		{ label: 'Projects', href: '/projects' },
		{ label: 'Reading', href: '/reading' },
		{ label: 'Hobbies', href: '/hobbies' }
	];

	let currentPath = $derived(page.url.pathname);
	// flags.kirill.es serves /flags at its root (Cloudflare rewrite); its links lead back to kirill.es.
	// Prerendering sees no such host, so the HTML has relative links and hydration fixes them up.
	let siteOrigin = $derived(page.url.hostname.startsWith('flags.') ? 'https://kirill.es' : '');

	let scrollY = $state(0);
	let isFaded = $derived(scrollY >= 35);

	/** @type {{ left: number, width: number, instant: boolean } | null} */
	let highlight = $state(null);
	let highlightStyle = $derived(
		highlight
			? `transform: translateX(${highlight.left}px) translateY(-10%); width: ${highlight.width}px; opacity: 1;${highlight.instant ? 'transition: none' : ''}`
			: 'opacity: 0;'
	);

	function current(href) {
		if (siteOrigin) return undefined;
		if (currentPath === href) return 'page';
		// Sub-pages (/projects/vibe-reel) mark their section; '/' would match everything
		if (href !== '/' && currentPath.startsWith(href + '/')) return 'true';
	}

	function showHighlight(item) {
		const rect = item.getBoundingClientRect();
		const menuRect = item.parentElement.getBoundingClientRect();
		// Coming from outside the menu it appears in place instead of sliding in from the left
		highlight = { left: rect.left - menuRect.left, width: rect.width, instant: !highlight };
	}

	function hideHighlight() {
		highlight = null;
	}

	// Keyboard focus moves the highlight like hover does. Mouse clicks also focus links (and
	// navigating blurs them), so only :focus-visible counts and a hovered menu keeps its highlight.
	function handleFocusIn(event) {
		if (event.target.matches(':focus-visible')) showHighlight(event.currentTarget);
	}

	function handleFocusOut(event) {
		const menu = event.currentTarget;
		if (!menu.contains(event.relatedTarget) && !menu.matches(':hover')) hideHighlight();
	}
</script>

<svelte:window bind:scrollY />

<nav class="navbar">
	<div
		class="nav-container enter"
		role="presentation"
		onmouseleave={hideHighlight}
		onfocusout={handleFocusOut}
	>
		<ul class="nav-menu">
			<li class="hover-highlight" aria-hidden="true" style={highlightStyle}></li>
			{#each navItems as item (item.href)}
				{@const ariaCurrent = current(item.href)}
				<li
					class="nav-item"
					onmouseenter={(event) => showHighlight(event.currentTarget)}
					onfocusin={handleFocusIn}
				>
					<a
						href={siteOrigin + item.href}
						class="nav-link"
						class:active={ariaCurrent}
						aria-current={ariaCurrent}
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="personal-links enter" class:faded={isFaded}>
		<a href="https://github.com/kirill-menke" target="_blank" rel="noopener noreferrer"
			>GitHub</a
		>
		<a href="https://github.com/kirill-menke" target="_blank" rel="noopener noreferrer">CV</a>
	</div>
</nav>

<style>
	.navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: sticky;
		inset: 0;

		background-color: transparent;
		z-index: 1000;
		height: 70px;
		margin: 0 auto;
	}

	.nav-container {
		--enter-y: -50px;
		--enter-delay: 300ms;
		--enter-ease: var(--ease-cubic-out);

		display: inline-flex;
		align-items: center;
		height: 35px;
		border: 1px solid var(--color-background-dark);
		border-radius: 0.5rem;
		padding: 0 5px;
		margin: 0 auto;
		box-shadow: var(--shadow-float);
		background: rgba(255, 255, 255, 0.75);
		backdrop-filter: blur(30px);
	}

	.nav-menu {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		position: relative;
	}

	.nav-item {
		position: relative;
	}

	.nav-link {
		color: var(--color-font-light);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 400;
		transition: color 0.3s ease;
		position: relative;
		padding: 0.5rem 0.5rem;
		z-index: 1;
	}

	.nav-link:hover,
	.nav-link:focus-visible,
	.nav-link.active {
		color: var(--color-font-dark);
	}

	.hover-highlight {
		position: absolute;
		transform: translateY(-10%);
		height: 125%;
		background-color: var(--color-background-dark);
		border-radius: 0.25rem;
		transition: all 0.15s ease;
		pointer-events: none;
		z-index: 0;
		opacity: 0;
	}

	.personal-links {
		--enter-duration: 200ms;
		--enter-delay: 600ms;
		--enter-y: 0;
		--enter-ease: linear;

		display: none;
		font-size: 0.9rem;
		transition: opacity 0.1s linear;
	}

	/* Hidden once the page scrolls, but still reachable by keyboard */
	.personal-links.faded:not(:focus-within) {
		opacity: 0;
		pointer-events: none;
	}

	@media (min-width: 640px) {
		.personal-links {
			display: flex;
		}
		.nav-container {
			margin: 0;
		}
	}

	.personal-links a {
		color: var(--color-font-light);
		padding: 0 0.5rem;
		text-decoration: none;
		transition: color 0.05s linear;
	}

	.personal-links a:hover,
	.personal-links a:focus-visible {
		color: var(--color-font-dark);
	}
</style>
