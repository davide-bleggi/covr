<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, { type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginFormSchema, type LoginFormSchema } from './schema.js';
	import * as Form from '$lib/components/ui/form';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data} = $props();

	const form = superForm<Infer<LoginFormSchema>>(data.loginForm, {
		validators: zodClient(loginFormSchema),
		onResult: async ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				return;
			}
			console.log('redirectTo: ',  page.url.searchParams.get('redirectTo') )
			await goto(page.url.searchParams.get('redirectTo') || '/');
		},
		onUpdate: ({ form }) => {
			$errors = form.errors;
		}
	});

	const { form: formData, enhance, errors } = form;


</script>

<div class="flex flex-col">
	<SuperDebug data={$formData} />

	<form method="POST" use:enhance
				action="?/login">
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Username</Form.Label>
					<Input {...props} bind:value={$formData.email} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<Input {...props} bind:value={$formData.password} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<div class="flex flex-col">
			{#if $errors._errors}
				{#each $errors._errors as error}
					<span class="text-red-500 font-bold">{error}</span>
				{/each}
			{/if}
			<Form.Button type="submit">Login</Form.Button>
		</div>
	</form>
</div>
