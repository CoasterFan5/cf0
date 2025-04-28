<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children
	}: {
		children?: Snippet;
	} = $props();
</script>

<button>{@render children?.()}</button>

<style lang="scss">
	button {
		width: 100%;
		background: #393a3f;
		color: white;
		border: 0px;
		outline: 0px;
		border-radius: 0.25rem;
		padding: 0.25rem;
		cursor: pointer;
	}
</style>
