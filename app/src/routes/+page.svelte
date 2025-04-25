<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
</script>

<div class="wrap">
	<h2>Login With Zero</h2>
	<div class="loginForm">
		<h3>Credentials</h3>
		<form class="formInner">
			<TextInput label="Email" type="text" />
			<TextInput label="Password" type="password" />
			<Button>Submit</Button>
		</form>
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 5rem;
		flex-direction: column;

		h2 {
			font-weight: 400;
		}
	}

	.loginForm {
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1px solid lightgray;
		padding: 1rem;
		border-radius: 0.25rem;
		width: 20rem;

		h3 {
			font-weight: 400;
			font-size: 1rems;
			margin: 0;
			width: 100%;
			text-align: left;
			margin-bottom: 0.5rem;
		}
	}

	.formInner {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 0.5rem;
	}
</style>
