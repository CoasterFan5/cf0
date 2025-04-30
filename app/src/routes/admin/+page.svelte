<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { PageServerData } from './$types';
	import Fuse from 'fuse.js';

	export const {
		data
	}: {
		data: PageServerData;
	} = $props();

	let ogData = data.authUrls;
	let displayedData = $state([...ogData]);
	let searchTerm = $state('');
	const fuse = new Fuse(ogData, {
		threshold: 0.6,
		keys: ['key', 'url'],
		findAllMatches: true
	});

	$effect(() => {
		if (searchTerm) {
			displayedData = fuse.search(searchTerm).map((i) => i.item);
		} else {
			displayedData = [...ogData];
		}
	});
</script>

<div class="wrap">
	<h1>Admin</h1>
	<div class="toolbar">
		<div class="searchWrap">
			<input placeholder="search" class="search" bind:value={searchTerm} />
		</div>
		<div>
			<form method="post" action="?/new">
				<Button>Create New Url</Button>
			</form>
		</div>
	</div>
	<div class="urls">
		{#each displayedData as url}
			<div class="url">
				<span class="name">{url.key}</span>
				<span>{url.url} </span>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 5rem;
	}
	.toolbar {
		width: 100%;
		max-width: 50rem;
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		justify-content: end;
	}
	.searchWrap {
		flex-grow: 1;
		padding-right: 1rem;
		.search {
			border: 0px;
			outline: 0px;
			border: 1px solid var(--accent);
			border-radius: 0.25rem;
			width: 100%;
			padding: 0.5rem;
			font-size: 1rems;
		}
	}
	.urls {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		width: 100%;
		align-items: center;
		padding-bottom: 2rem;
	}

	.url {
		background: rgba(0, 0, 0, 0.1);
		padding: 0.75rem;
		max-width: 50rem;
		width: 100%;
		flex-grow: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-radius: 0.5rem;

		.name {
			font-weight: 500;
		}
	}
</style>
