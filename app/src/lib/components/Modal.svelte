<script lang="ts">
	import type { Snippet } from 'svelte';
	import ModalBackground from './ModalBackground.svelte';

	let {
		children,
		open = $bindable(false),
		closeEvent
	}: {
		children?: Snippet;
		open?: boolean;
		closeEvent?: () => void;
	} = $props();
</script>

{#if open}
	<ModalBackground
		clickEvent={() => {
			open = false;
			closeEvent?.();
		}}
	>
		<div class="modal">
			{@render children?.()}
		</div>
	</ModalBackground>
{/if}

<style lang="scss">
	.modal {
		background: var(--background);
		padding: 1rem 2rem;
		border-radius: 0.25rem;
	}
</style>
