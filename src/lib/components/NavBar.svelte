<script>
	import { page } from '$app/stores';

	const navItems = [
		{ label: 'Kirill', href: '/' },
		{ label: 'Projects', href: '/projects' },
		// { label: 'Gallery', href: '/gallery' },
		{ label: 'Reading', href: '/reading' },
		{ label: 'Hobbies', href: '/hobbies' }
	];

	let currentPath = $derived($page.url.pathname);

	let hoveredIndex = $state(null);
	let highlightStyle = $state('');
	let navMenuElement = $state(null);

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

<nav class="navbar">
	<div class="nav-container" role="presentation" onmouseleave={handleMouseLeave}>
		<ul class="nav-menu" bind:this={navMenuElement}>
			<div class="hover-highlight" style={highlightStyle}></div>
			{#each navItems as item, index}
				<li class="nav-item" onmouseenter={() => handleMouseEnter(index)}>
					<a
						href={item.href}
						class="nav-link"
						class:active={currentPath === item.href}
						data-svelte-preload-data
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>

<style>
	.navbar {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;

		background-color: transparent;
		z-index: 1000;
		padding: 0 2rem;
		height: 80px;
		max-width: 1500px;
		margin: 0 auto;
		align-items: center;
	}

	.nav-container {
		height: 35px;
		display: inline-flex;
		border: 1px solid #e5e5e5;
		border-radius: 0.5rem;
		align-items: center;
		padding: 0 5px;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
		background-color: #f5f5f5bf;
		backdrop-filter: blur(12px);
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
		color: #9c9c9c;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 400;
		transition: color 0.3s ease;
		position: relative;
		padding: 0.5rem 0.5rem;
		z-index: 1;
	}

	.nav-link:hover {
		color: #000000;
	}

	.nav-link.active {
		color: #000000;
	}

	.hover-highlight {
		position: absolute;
		transform: translateY(-10%);
		height: 125%;
		background-color: #e9e9e9;
		border-radius: 0.25rem;
		transition: all 0.15s ease;
		pointer-events: none;
		z-index: 0;
		opacity: 0;
	}
</style>
