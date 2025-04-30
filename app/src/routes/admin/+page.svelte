<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
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

	$effect(() => {
		const fuse = new Fuse(ogData, {
			threshold: 0.6,
			keys: ['key', 'url'],
			findAllMatches: true
		});
		if (searchTerm) {
			displayedData = fuse.search(searchTerm).map((i) => i.item);
		} else {
			displayedData = [...ogData];
		}
	});

	let editingKey = $state('');
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
			{@const oldKey = url.key}
			<Modal
				open={editingKey == oldKey}
				closeEvent={() => {
					editingKey = '';
				}}
			>
				<form class="form" method="post" action="?/edit">
					<h2>Edit</h2>
					<input hidden name="oldKey" value={oldKey} />
					<TextInput label="key" name="newKey" type="text" value={url.key} />
					<TextInput label="Url" name="url" type="text" value={url.url} />
					<Button>Save</Button>
				</form>
			</Modal>

			<button
				class="url"
				onclick={() => {
					editingKey = url.key;
				}}
			>
				<span class="name">{url.key}</span>
				<span>{url.url} </span>
			</button>
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
		border: 0px;
		outline: 0px;
		cursor: pointer;
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

	.form {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		gap: 0.5rem;
	}
</style>
