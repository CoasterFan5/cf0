<script lang="ts">
	import type { PageServerData } from './$types';

	const {
		data
	}: {
		data: PageServerData;
	} = $props();
</script>

<h1>CF0</h1>
<p>Front</p>
<p>Back: {data.r}</p>
