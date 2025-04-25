<script lang="ts">
	const {
		label,
		type
	}: {
		label?: string;
		type: 'text' | 'password';
	} = $props();

	const id = $props.id();
</script>

<div>
	{#if label}
		<label for={id}>{label} </label>
	{/if}
	{#if type == 'text'}
		<input {id} />
	{/if}
	{#if type == 'password'}
		<input {id} />
	{/if}
</div>

<style lang="scss">
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
