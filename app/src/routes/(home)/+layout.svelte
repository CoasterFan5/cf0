<script>
	import Navbar from '$lib/components/Navbar.svelte';
	let { children } = $props();
</script>

<div class="wrap">
	<Navbar />
	{@render children?.()}
</div>
