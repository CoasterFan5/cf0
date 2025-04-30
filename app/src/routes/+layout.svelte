<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '@fontsource-variable/quicksand';
	import '@fontsource-variable/noto-sans-hanifi-rohingya';
	let { children } = $props();
	import { Toaster } from 'svelte-french-toast';
</script>

<Toaster />

<div class="wrap">
	<Navbar />
	{@render children?.()}
</div>

<style lang="scss">
	:global(body) {
		--text: #000000;
		--textLight: #2f3e46;
		--background: #f1f1f1;
		--accent: #393a3f;
		padding: 0px;
		color: var(--text);
	}
	:global(*) {
		font-family: 'Noto Sans Hanifi Rohingya Variable', sans-serif;
		box-sizing: border-box;
	}
</style>
