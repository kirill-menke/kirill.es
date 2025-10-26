<script>
	let isHovered = $state(false);
</script>

<footer>
	<div class="footer-content">
		<div
			class="image-container"
			role="img"
			aria-label="Josie pixel art"
			onmouseenter={() => (isHovered = true)}
			onmouseleave={() => (isHovered = false)}
		>
			<img
				src="/footer/rosie-static.png"
				alt="Josie pixel art"
				class="static"
				class:hidden={isHovered}
			/>
			<img
				src="/footer/footer-animation.gif"
				alt="Josie pixel art animation"
				class="gif"
				class:hidden={!isHovered}
			/>
		</div>
		<p>Created by Kirill</p>
	</div>
</footer>

<style>
	footer {
		padding-top: 10rem;
		padding-bottom: 5rem;
	}

	.footer-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 5rem;
	}

	.image-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 5rem;
	}

	img {
		display: block;
		width: auto;
		transition: opacity 0.3s ease;
		position: absolute;
	}

	img.static {
		height: 3rem;
		opacity: 1;
	}

	img.gif {
		height: 5rem;
		opacity: 1;
	}

	img.hidden {
		opacity: 0;
	}

	p {
		margin: 0;
		font-size: 0.9rem;
		font-family: var(--font-primary);
		color: var(--color-font-light);
	}
</style>
