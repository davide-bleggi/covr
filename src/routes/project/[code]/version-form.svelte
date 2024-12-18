<script lang="ts">
import { Input } from '$lib/components/ui/input/index';
import type { SuperValidated } from 'sveltekit-superforms';
import type { Infer } from 'sveltekit-superforms';
import * as Form from '$lib/components/ui/form';

import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import { createEventDispatcher } from 'svelte';
import { versionFormSchema, type VersionFormSchema } from './schema';

const dispatch = createEventDispatcher();

export let data: SuperValidated<Infer<VersionFormSchema>>;
let formElement: HTMLFormElement;
export const form = superForm<Infer<VersionFormSchema>>(data, {
	validators: zodClient(versionFormSchema),
	onResult: ({ result }) => {
		if (result.type === 'failure' || result.type === 'error') {
			dispatch('error', result);
			return;
		}
		dispatch('success', {result});
	}
});

export function setAction(action:string){
	formElement.action=action;
}


const { form: formData, enhance} = form;
</script>

<form method="POST" bind:this={formElement} use:enhance>
	<input type="hidden" name="id" bind:value={$formData.id} />
	<input type="hidden" name="projectId" bind:value={$formData.projectId} />

	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Nome Versione</Form.Label>
			<Input bind:value={$formData.name} {...attrs} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</form>
