<footer>
	<div class="footer-content">
		<!-- Decorative pixel art of Josie: still image, animated on hover -->
		<div class="image-container">
			<img src="/footer/rosie-static.png" alt="" class="static" />
			<img src="/footer/footer-animation.gif" alt="" class="gif" />
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
		transition: opacity 0.3s ease;
		position: absolute;
	}

	.static {
		height: 3rem;
	}

	.gif {
		height: 5rem;
	}

	.image-container:hover .static,
	.image-container:not(:hover) .gif {
		opacity: 0;
	}

	p {
		margin: 0;
		font-size: 0.9rem;
		color: var(--color-font-light);
	}
</style>
