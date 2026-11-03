<script>
	let { colors } = $props();

	const percent = (share) => Math.round(share * 100);
	let listed = $derived(colors.filter((c) => percent(c.share) >= 1));
</script>

<div
	class="bar"
	role="img"
	aria-label={listed.map((c) => `${c.name} ${percent(c.share)}%`).join(', ')}
>
	{#each colors as c}
		<span
			class="segment"
			style="flex-grow: {c.share}; background: {c.hex}"
			title="{c.name} {(c.share * 100).toFixed(1)}%"
		></span>
	{/each}
</div>
<p class="legend">
	{#each listed as c, i}
		{#if i}<span class="dot">·</span>{/if}
		<span class="entry"><i style="background: {c.hex}"></i>{c.name} {percent(c.share)}%</span>
	{/each}
</p>

<style>
	.bar {
		display: flex;
		height: 0.75rem;
		border-radius: 0.25rem;
		overflow: hidden;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
	}

	.segment {
		flex-basis: 0;
		min-width: 2px;
		box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.06);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.15rem 0.35rem;
		margin: 0.45rem 0 0;
		font-size: 0.8rem;
		color: var(--color-font-light);
	}

	.entry {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		color: var(--color-font-dark);
	}

	.entry i {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
	}
</style>
