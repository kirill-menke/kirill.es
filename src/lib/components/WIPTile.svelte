<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { ArrowUpRight } from '@lucide/svelte';

	export let project;
	export let duration;
	export let delay;

	const aspect = project.layout === 'square' ? 1 : 2;

	export let showArrowLink = false;
	export let useHyperLink = false;
</script>

<div
	role="presentation"
	class="tile"
	style="aspect-ratio: {aspect};"
	in:fly={{
		y: -15,
		opacity: 0,
		duration,
		delay,
		easing: backInOut
	}}
>
	<div class="project-tile-content">
		<span class="tile-header-text">
			{#if useHyperLink}
				<a href="/projects">
					Projects
					<span class="tooltip">Browse projects</span>
				</a>
			{:else}
				Projects
			{/if}
			· {project.name}
		</span>
		<a
			href={project.link}
			target="_blank"
			rel="noopener noreferrer"
			class="tile-anchor"
			style="visibility: {showArrowLink ? 'visible' : 'hidden'}"
			aria-label="View on Goodreads"
		>
			<span class="tooltip">View Project</span>
			<ArrowUpRight strokeWidth="2" size="16" />
		</a>
	</div>

	<div class="books-container">
		<div class="coming-soon-content">
			<span class="emoji">🚀</span>
			<span class="text-content">
				<strong class="coming-soon-title">Working on it!</strong>
				Excuse the dust :)
			</span>
		</div>

		<div class="books-wrapper">
			<div class="book-element left-element-container">
				<div class="book-float left-element-wrapper">
					<div class="book left-element"></div>
				</div>
			</div>

			<div class="book-element right-element-container">
				<div class="book-float right-element-wrapper">
					<div class="book right-element"></div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.project-tile-content {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.5rem 0 1.25rem;
		z-index: 10;
	}

	.tile {
		position: relative;
		overflow: hidden;
	}

	.books-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: calc(100% - 3rem);
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	/* Coming Soon Content */
	.coming-soon-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		text-align: center;
		color: #cbd5e1;
		position: relative;
		z-index: 1;
		opacity: 0;
		transition: opacity 0.1s ease-out;
	}

	.tile:hover .coming-soon-content {
		opacity: 1;
	}

	.emoji {
		font-size: 2rem;
		display: inline-block;
		transition: transform 0.1s ease-out;
	}

	.tile:hover .emoji {
		animation: spin-once 0.3s ease-out;
		animation-delay: 0.3s;
	}

	.coming-soon-title {
		color: var(--color-font-dark);
		display: block;
		margin-bottom: 0.25rem;
		font-weight: 500;
	}

	.text-content {
		font-size: 0.8rem;
		color: var(--color-font-light);
	}

	/* Books Wrapper */
	.books-wrapper {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0;
		z-index: 5;
	}

	.book-element {
		transition: transform 0.1s ease-out;
	}

	.book-float {
		animation: float 3s ease-in-out infinite;
	}

	.left-element-wrapper {
		animation-delay: 0.2s;
	}

	.right-element-wrapper {
		margin-left: -2rem;
		margin-top: -2.25rem;
		animation-delay: 0.5s;
	}

	.tile:hover .left-element-container {
		transform: translate(-8rem, 2rem);
	}

	.tile:hover .right-element-container {
		transform: translate(3rem, 2rem);
	}

	/* Book Styles */
	.book {
		border-radius: 0.5rem;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
		position: relative;
	}

	.left-element {
		width: 200px;
		height: 150px;
		background: linear-gradient(
			135deg,
			oklch(75% 0.08 67) 0%,
			oklch(70% 0.08 64) 50%,
			oklch(65% 0.08 59) 100%
		);
		transform: rotate(-12deg);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 4rem;
		color: rgba(255, 255, 255, 0.9);
		font-weight: bold;
		border-radius: 8px;
		position: relative;
		overflow: hidden;
	}

	.left-element::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			repeating-linear-gradient(
				90deg,
				transparent,
				transparent 40px,
				rgba(139, 69, 19, 0.1) 40px,
				rgba(139, 69, 19, 0.1) 42px
			),
			repeating-linear-gradient(
				0deg,
				rgba(101, 67, 33, 0.03) 0px,
				rgba(101, 67, 33, 0.03) 2px,
				transparent 2px,
				transparent 4px
			);
		border-radius: 8px;
	}

	.left-element::after {
		content: '🪵';
		font-size: 3rem;
		position: absolute;
		opacity: 0.3;
	}

	.right-element {
		width: 130px;
		height: 170px;
		background: linear-gradient(
			135deg,
			oklch(51% 0.06 51) 0%,
			oklch(45% 0.03 39) 50%,
			oklab(40% 0.01 0.03) 100%
		);
		transform: rotate(8deg);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 4rem;
		color: rgba(255, 255, 255, 0.9);
		font-weight: bold;
		border-radius: 8px;
		position: relative;
		overflow: hidden;
	}

	.right-element::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			repeating-linear-gradient(
				90deg,
				transparent,
				transparent 35px,
				rgba(62, 39, 35, 0.15) 35px,
				rgba(62, 39, 35, 0.15) 37px
			),
			repeating-linear-gradient(
				0deg,
				rgba(33, 21, 18, 0.05) 0px,
				rgba(33, 21, 18, 0.05) 2px,
				transparent 2px,
				transparent 4px
			);
		border-radius: 8px;
	}

	.right-element::after {
		content: '🪵';
		font-size: 2.5rem;
		position: absolute;
		opacity: 0.3;
	}

	/* Animations */
	@keyframes spin-once {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-15px);
		}
	}
</style>
