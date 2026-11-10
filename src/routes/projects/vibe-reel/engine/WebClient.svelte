<script>
	/*
	 * The web client's page, for the browser window drawn round it (BrowserSketch): the app's
	 * bar over the phone's Home and player screens (from below the status bar), side by side.
	 * It fills the box it is given, and everything inside is sized in its own container units.
	 */
	import { shots } from './shared.js';
</script>

<div class="page">
	<div class="appbar" aria-hidden="true">
		<span class="mark">Vibe<b>Reel</b></span>
		<span class="avatar">A</span>
	</div>
	<div class="panes">
		<div class="pane">
			<img
				src={shots.home.src}
				alt="The web client: the phone's Home and player screens side by side in a desktop window"
				width="590"
				height="1279"
				loading="lazy"
				decoding="async"
			/>
		</div>
		<div class="pane">
			<img
				src={shots.player.src}
				alt=""
				width="590"
				height="1279"
				loading="lazy"
				decoding="async"
			/>
		</div>
	</div>
</div>

<style>
	.page {
		container-type: inline-size;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		border-radius: 0.6rem;
		background: var(--color-device-screen);
	}

	.appbar {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 5.4cqw;
		padding: 0 2.6cqw;
		font: 600 1.9cqw / 1 var(--font-primary);
		color: #ededed;
	}

	.mark b {
		font-weight: inherit;
		color: var(--vr-gold-fill);
	}

	.avatar {
		display: grid;
		place-items: center;
		width: 2.8cqw;
		aspect-ratio: 1;
		border-radius: 50%;
		background: #a6d4a0;
		color: #13250f;
		font-size: 1.4cqw;
	}

	.panes {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: minmax(0, 1fr);
		gap: 1.6cqw;
		padding: 0 2.6cqw 2.6cqw;
	}

	.pane {
		overflow: hidden;
		border-radius: 1.2cqw;
		background: #101012;
	}

	/* The status bar is the screenshots' top 90 of 590 px: cut it off (a margin's percentage
	   is of the pane's width) */
	.pane img {
		display: block;
		width: 100%;
		height: auto;
		margin-top: -15.3%;
	}
</style>
