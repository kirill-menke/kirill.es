<script>
	/** A left-to-right chain of stages that wraps on narrow screens */
	let { stages } = $props();
</script>

<ol class="pipeline">
	{#each stages as stage, i (stage.title)}
		<li>
			<strong>{stage.title}</strong>
			<span>{stage.text}</span>
		</li>
		{#if i < stages.length - 1}
			<li class="arrow" aria-hidden="true">→</li>
		{/if}
	{/each}
</ol>

<style>
	.pipeline {
		list-style: none;
		margin: 0;
		padding: 1.25rem;
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		gap: 0.5rem;
		background: var(--color-background-tile);
		border-radius: 0.5rem;
	}

	@media (min-width: 640px) {
		.pipeline {
			padding: 2rem;
		}
	}

	li:not(.arrow) {
		flex: 1 1 9rem;
		background: var(--color-background);
		border-radius: 0.5rem;
		border-top: 3px solid var(--vr-gold-fill);
		padding: 0.75rem 0.9rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	strong {
		font-weight: 500;
		color: var(--color-font-dark);
		font-size: 0.95rem;
	}

	span {
		font-size: 0.82rem;
		line-height: 1.45;
		color: var(--vr-muted);
	}

	.arrow {
		align-self: center;
		color: var(--vr-gold);
		font-size: 1.1rem;
	}
</style>
