<script lang="ts">
import { Input } from '$lib/components/ui/input/index.js';
import SuperDebug, { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import { loginFormSchema, type LoginFormSchema } from './schema.js';
import * as Form from '$lib/components/ui/form';


let {data} = $props();

const form = superForm<Infer<LoginFormSchema>>(data.loginForm, {
	validators: zodClient(loginFormSchema),
	onResult: ({ result }) => {
		if (result.type === 'failure' || result.type === 'error') {
			return;
		}
		open = false;
	},
	onUpdate: ({ form }) => {
		$errors = form.errors;
	}
});

const { form: formData, enhance, submit, allErrors, errors } = form;


</script>

<div class="flex flex-col">
<SuperDebug data={$formData} />
	<SuperDebug data={allErrors} />

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
	<Form.Button type="submit">Login</Form.Button>
</form>
</div>
