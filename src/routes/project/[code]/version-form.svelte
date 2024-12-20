<script lang="ts">
	import { Input } from '$lib/components/ui/input/index';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { Infer } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { versionFormSchema, type VersionFormSchema } from './schema';

	let { data = $bindable(), action = $bindable(), submit = $bindable(), open = $bindable()} = $props();

	export const form = superForm<Infer<VersionFormSchema>>(data, {
		validators: zodClient(versionFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				return;
			}
			open=false;
		}
	});


	const { form: formData, enhance } = form;
	submit = form.submit;

</script>

<form method="POST" action={action} use:enhance>
	<input type="hidden" name="id" bind:value={$formData.id} />
	<input type="hidden" name="projectId" bind:value={$formData.projectId} />

	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({props})}
				<Form.Label>Nome Versione</Form.Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</form>
