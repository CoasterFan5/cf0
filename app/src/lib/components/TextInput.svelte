<script lang="ts">
	let {
		label,
		type,
		name,
		value = $bindable('')
	}: {
		label?: string;
		type: 'text' | 'password';
		name?: string;
		value?: string;
	} = $props();

	const id = $props.id();
</script>

<div>
	{#if label}
		<label for={id}>{label} </label>
	{/if}
	{#if type == 'text'}
		<input {name} {id} bind:value />
	{/if}
	{#if type == 'password'}
		<input {name} {id} type="password" bind:value />
	{/if}
</div>

<style lang="scss">
	div {
		display: flex;
		flex-direction: column;
		align-items: start;
	}

	label {
		width: 100%;
		text-align: left;
		font-size: 0.8rem;
	}
	input {
		width: 100%;
		border-radius: 0.25rem;
		outline: 0px;
		border: 0px;
		border: 1px solid lightgray;
		padding: 0.25rem;
	}
</style>
