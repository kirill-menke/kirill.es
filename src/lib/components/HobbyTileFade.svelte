<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	export let hobby;
	export let duration;
	export let delay;
	export let useHyperLink = false;
</script>

<div
	role="presentation"
	class="tile-container"
	in:fly={{ y: -20, opacity: 0, duration, delay, easing: backInOut }}
>
	<div class="tile">
		<div class="tile-inner">
			<img src={hobby.preview} alt={hobby.name} class="tile-image" />

			<div class="tile-header">
				<span class="breadcrumb">
					{#if useHyperLink}
						<a href="/hobbies">Hobbies</a>
					{:else}
						Hobbies
					{/if}
					&nbsp;·&nbsp;{hobby.name}
				</span>
			</div>

			<div class="tile-footer">
				{#if hobby.category || hobby.family}
					<div class="tags">
						<div class="tag">
							<span>{hobby.category || hobby.family}</span>
						</div>
					</div>
				{/if}
				<h3 class="tile-title">{hobby.title || hobby.name}</h3>
			</div>
		</div>
	</div>
</div>

<style>
	.tile-container {
		aspect-ratio: 1 / 1;
		padding: 0 4px 8px;
	}

	.tile {
		height: 100%;
		width: 100%;
		overflow: hidden;
		border-radius: 12px;
		background: #fafafa;
		transition: background-color 0.2s;
		position: relative;
	}

	.tile:hover,
	.tile:focus-within {
		background: #f5f5f5;
	}

	.tile-inner {
		position: relative;
		isolation: isolate;
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		justify-content: space-between;
	}

	.tile-image {
		pointer-events: none;
		position: absolute;
		z-index: -1;
		height: 100%;
		width: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.tile:hover .tile-image {
		z-index: 10;
		transform: scale(1.05);
	}

	.tile-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 8px 8px 16px;
		font-size: 14px;
		letter-spacing: -0.01em;
		color: #a3a3a3;
	}

	.breadcrumb {
		padding: 6px 0;
	}

	.breadcrumb a {
		color: inherit;
		text-decoration: none;
		transition: color 0.2s;
	}

	.breadcrumb a:hover,
	.breadcrumb a:focus-visible {
		color: #737373;
		text-decoration: underline;
	}

	.breadcrumb a:focus-visible {
		outline: 4px solid #bfdbfe;
		outline-offset: 2px;
	}

	.tile-footer {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		flex-grow: 1;
		gap: 12px;
		padding: 20px;
		background: linear-gradient(to top, #fafafa, transparent);
		transition: opacity 0.2s;
	}

	.tile:hover .tile-footer,
	.tile:focus-within .tile-footer {
		opacity: 0.2;
	}

	.tags {
		display: flex;
		gap: 8px;
	}

	.tag {
		display: inline-block;
		background: rgba(56, 189, 248, 0.4);
		color: #0c4a6e;
		border-radius: 4px;
		padding: 2px 6px 4px;
		font-family: 'Courier New', monospace;
		font-size: 14px;
		letter-spacing: -0.01em;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
		text-transform: uppercase;
	}

	.tile-title {
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 36px;
		font-weight: 300;
		line-height: 1.2;
		color: #171717;
	}

	@media (min-width: 640px) {
		.tile-title {
			font-size: 40px;
		}
	}
</style>
