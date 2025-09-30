<!-- NavBar.svelte -->
<script>
	import { page } from '$app/stores';

	const navItems = [
		{ label: 'Kirill', href: '/' },
		{ label: 'Projects', href: '/projects' },
		{ label: 'Gallery', href: '/gallery' },
		{ label: 'Reading', href: '/reading' },
		{ label: 'Hobbies', href: '/hobbies' }
	];

	$: currentPath = $page.url.pathname;

	let hoverIndex = -1;
	let indicatorStyle = '';
	let navMenuElement;

	function handleMouseEnter(index, event) {
		hoverIndex = index;
		updateIndicatorPosition(event.target);
	}

	function handleMouseLeave() {
		hoverIndex = -1;
	}

	function updateIndicatorPosition(element) {
		if (!navMenuElement || !element) return;

		const menuRect = navMenuElement.getBoundingClientRect();
		const itemRect = element.getBoundingClientRect();

		const left = itemRect.left - menuRect.left;
		const width = itemRect.width;

		indicatorStyle = `transform: translateX(${left}px); width: ${width}px; opacity: 1;`;
	}
</script>

<nav class="navbar">
	<div class="nav-container">
		<ul class="nav-menu" bind:this={navMenuElement} on:mouseleave={handleMouseLeave}>
			<div
				class="hover-indicator"
				style={hoverIndex >= 0 ? indicatorStyle : 'opacity: 0;'}
			></div>
			{#each navItems as item, index}
				<li class="nav-item" on:mouseenter={(e) => handleMouseEnter(index, e)}>
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
	}

	.nav-menu {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		position: relative;
	}

	.hover-indicator {
		position: absolute;
		top: -4px;
		bottom: -4px;
		left: 0;
		background-color: rgba(220, 220, 220, 0.5);
		border-radius: 6px;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		pointer-events: none;
		z-index: -1;
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
</style>
