<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { createPromiseToast, handleToastPromiseWithFormAction } from '$lib/utils/toastManager';
	import type { PageServerData } from './$types';
	import Fuse from 'fuse.js';

	import Edit from '~icons/ph/pencil';
	import Trash from '~icons/ph/trash-simple';
	import Reroll from '~icons/ph/arrows-clockwise';

	export const {
		data
	}: {
		data: PageServerData;
	} = $props();

	let displayedData = $state([...data.authUrls]);
	let searchTerm = $state('');

	$effect(() => {
		const fuse = new Fuse(data.authUrls, {
			threshold: 0.6,
			keys: ['key', 'url'],
			findAllMatches: true
		});
		if (searchTerm) {
			displayedData = fuse.search(searchTerm).map((i) => i.item);
		} else {
			displayedData = [...data.authUrls];
		}
	});

	let editingKey = $state(-1);
	let editingType: 'edit' | 'delete' | 'reroll' = $state('edit');
	let tempKeyValue = $state('');
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
		{#key data.authUrls}
			{#each displayedData as url, i}
				<Modal
					open={editingKey == i}
					closeEvent={() => {
						editingKey = -1;
						tempKeyValue = '';
					}}
				>
					{#if editingType == 'edit'}
						<form
							class="form"
							method="post"
							action="?/edit"
							use:enhance={() => {
								const toastManager = createPromiseToast('Updating...');
								return async ({ result, update }) => {
									handleToastPromiseWithFormAction(result, toastManager, {
										redirectsAreSuccess: true,
										redirectMessage: 'Success'
									});
									editingKey = -1;
									await update();
								};
							}}
						>
							<h2>Edit</h2>
							<input hidden name="oldKey" value={url.key} />
							<TextInput label="key" name="newKey" type="text" value={url.key} />
							<TextInput label="Url" name="url" type="text" value={url.url} />
							<Button>Save</Button>
						</form>
					{:else if editingType == 'reroll'}
						<form
							class="form"
							method="post"
							action="?/roll"
							use:enhance={() => {
								const toastManager = createPromiseToast('Rolling token...');
								return async ({ result, update }) => {
									handleToastPromiseWithFormAction(result, toastManager);
									if (result.type == 'success') {
										tempKeyValue = result?.data?.newToken?.toString() || '';
									}
									await update();
								};
							}}
						>
							<h2>Roll Key</h2>
							<input hidden name="key" value={url.key} />
							<TextInput label="Token will show here" value={tempKeyValue} type="text" />
							<Button>Roll Key</Button>
						</form>
					{:else if editingType == 'delete'}
						<form
							class="form"
							method="post"
							action="?/delete"
							use:enhance={() => {
								const toastManager = createPromiseToast('Removing');
								return async ({ result, update }) => {
									handleToastPromiseWithFormAction(result, toastManager);
									await update();
									editingKey = -1;
								};
							}}
						>
							<h2>Delete</h2>
							<input hidden name="key" value={url.key} />
							<Button>Delete</Button>
						</form>
					{/if}
				</Modal>
				<div class="url">
					<div>
						<span class="name">{url.key}</span>
						<span class="u">{url.url} </span>
					</div>
					<div class="actions">
						<button
							class="actionButton"
							onclick={() => {
								editingType = 'edit';
								editingKey = i;
							}}
						>
							<Edit /></button
						>
						<button
							class="actionButton"
							onclick={() => {
								editingType = 'reroll';
								editingKey = i;
							}}
						>
							<Reroll /></button
						>
						<button
							class="actionButton"
							onclick={() => {
								editingType = 'delete';
								editingKey = i;
							}}
						>
							<Trash /></button
						>
					</div>
				</div>
			{/each}
		{/key}
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

		.u {
			opacity: 0.7;
		}
	}

	.form {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		gap: 0.5rem;
	}

	.actions {
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
	}

	.actionButton {
		outline: 0px;
		border: 0px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
		padding: 0.25rem;
		background: transparent;
		transition: all cubic-bezier(0.19, 1, 0.22, 1) 0.5s;

		&:hover {
			background: var(--accent);
			color: var(--background);
		}
	}
</style>
