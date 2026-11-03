<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { fly, fade } from 'svelte/transition';

	const navItems = [
		{ label: 'Kirill', href: '/' },
		{ label: 'Projects', href: '/projects' },
		// { label: 'Gallery', href: '/gallery' },
		{ label: 'Reading', href: '/reading' },
		{ label: 'Hobbies', href: '/hobbies' }
	];

	let currentPath = $derived($page.url.pathname);
	// flags.kirill.es serves /flags at its root (Cloudflare rewrite); its links lead back to kirill.es.
	let siteOrigin = $derived($page.url.hostname.startsWith('flags.') ? 'https://kirill.es' : '');

	let visible = $state(false);
	let hoveredIndex = $state(null);
	let highlightStyle = $state('');
	let navMenuElement = $state(null);
	let scrollY = $state(0);
	let isFaded = $derived(scrollY >= 35);

	onMount(() => {
		visible = true;
	});

	function handleMouseEnter(index) {
		const fromOutside = !hoveredIndex;
		hoveredIndex = index;
		updateHighlight(fromOutside);
	}

	function handleMouseLeave() {
		hoveredIndex = null;
		updateHighlight();
	}

	function updateHighlight(fromOutside) {
		if (hoveredIndex === null || !navMenuElement) {
			highlightStyle = 'opacity: 0;';
			return;
		}

		const items = navMenuElement.querySelectorAll('.nav-item');
		const hoveredItem = items[hoveredIndex];

		const rect = hoveredItem.getBoundingClientRect();
		const menuRect = navMenuElement.getBoundingClientRect();
		const left = rect.left - menuRect.left;
		const width = rect.width;

		highlightStyle = `transform: translateX(${left}px) translateY(-10%); width: ${width}px; opacity: 1;`;
		if (fromOutside) {
			highlightStyle += 'transition: none';
		}
	}
</script>

<svelte:window bind:scrollY />

<nav class="navbar">
	{#if visible}
		<div
			class="nav-container"
			role="presentation"
			onmouseleave={handleMouseLeave}
			in:fly={{
				y: -50,
				opacity: 0,
				duration: 500,
				delay: 300
			}}
		>
			<ul class="nav-menu" bind:this={navMenuElement}>
				<div class="hover-highlight" style={highlightStyle}></div>
				{#each navItems as item, index}
					<li class="nav-item" onmouseenter={() => handleMouseEnter(index)}>
						<a
							href={siteOrigin + item.href}
							class="nav-link"
							class:active={!siteOrigin && currentPath === item.href}
							data-svelte-preload-data
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="personal-links" class:faded={isFaded} in:fade={{ duration: 200, delay: 600 }}>
			<a href="https://github.com/kirill-menke" target="_blank" rel="noopener noreferrer"
				>GitHub</a
			>
			<a href="https://github.com/kirill-menke" target="_blank" rel="noopener noreferrer"
				>CV</a
			>
		</div>
	{/if}
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
		display: inline-flex;
		align-items: center;
		height: 35px;
		border: 1px solid var(--color-background-dark);
		border-radius: 0.5rem;
		padding: 0 5px;
		margin: 0 auto;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.1),
			0 3px 6px rgba(0, 0, 0, 0.1);
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

	.nav-link:hover {
		color: var(--color-font-dark);
	}

	a.active {
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
		display: none;
		font-size: 0.9rem;
		transition: opacity 0.1s linear;
	}

	.personal-links.faded {
		opacity: 0;
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

	.personal-links a:hover {
		color: var(--color-font-dark);
	}
</style>
