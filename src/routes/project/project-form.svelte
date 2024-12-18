<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import SuperDebug, {
		type SuperValidated,
		type Infer,
		superForm
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import { ProjectStatusOptions } from '$lib/db/types';
	import { createEventDispatcher } from 'svelte';
	import { projectFormSchema, type ProjectFormSchema } from './[code]/schema';

	const dispatch = createEventDispatcher();

	export let data: SuperValidated<Infer<ProjectFormSchema>>;
	export const form = superForm<Infer<ProjectFormSchema>>(data, {
		validators: zodClient(projectFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				dispatch('error', result);
				return;
			}
			dispatch('success', {result});
		}
	});
	const { form: formData, enhance} = form;

	let formElement: HTMLFormElement;

	export function setAction(action:string){
		formElement.action=action;
	}

	$: status = $formData.status
		? ProjectStatusOptions.find(option => option.value === $formData.status)
		: undefined;
	$: $formData.code = $formData.code.toUpperCase();

</script>

<SuperDebug data={$formData}></SuperDebug>
<form method="POST" bind:this={formElement} use:enhance>
	<input type="hidden" name="id" bind:value={$formData.id} />
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Nome Progetto</Form.Label>
			<Input bind:value={$formData.name} {...attrs} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="code">
		<Form.Control let:attrs>
			<Form.Label>Codice Progetto</Form.Label>
			<Input bind:value={$formData.code} {...attrs} placeholder="COD" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Descrizione</Form.Label>
			<Textarea {...attrs} bind:value={$formData.description} placeholder="Descrizione progetto"></Textarea>
		</Form.Control>
		<Form.FieldErrors />
		<Form.Description>Descrivi brevemente di cosa si occupa il progetto.</Form.Description>

	</Form.Field>

	<Form.Field {form} name="status">
		<Form.Control let:attrs>
			<Select.Root portal={null}
									 selected={status}
									 onSelectedChange={(v)=>{v && ($formData.status = v.value)}}>
				<Select.Trigger class="w-full">
					<Select.Value placeholder="Stato attuale" />
				</Select.Trigger>
				<Select.Content>
					{#each ProjectStatusOptions as { value, label }}
						<Select.Item value={value} label={label}>
							{label}
						</Select.Item>
					{/each}
				</Select.Content>
				<Select.Input {...attrs} bind:value={$formData.status} name="status" />
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

</form>
