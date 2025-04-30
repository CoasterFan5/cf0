<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children,
		clickEvent
	}: {
		children?: Snippet;
		clickEvent?: () => void;
	} = $props();

	const cHandler = (e: MouseEvent) => {
		if (e.target == e.currentTarget) {
			if (clickEvent) {
				clickEvent();
			}
		}
	};
</script>

<button onclick={cHandler}>
	{@render children?.()}
</button>

<style lang="scss">
	button {
		outline: 0px;
		border: 0px;
		position: fixed;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(3px);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
