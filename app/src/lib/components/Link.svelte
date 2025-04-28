<script lang="ts">
	import { type Snippet } from 'svelte';

	const { children, href }: { children: Snippet; href: string } = $props();
</script>

<a {href}>
	{@render children?.()}
</a>

<style lang="scss">
	a {
		color: var(--accent);
	}
</style>
