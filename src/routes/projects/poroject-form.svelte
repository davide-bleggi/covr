<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import SuperDebug, {
		type SuperValidated,
		type Infer,
		superForm
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import { ProjectStatus } from '$lib/db/types';
	import { projectStatusOptions } from '$lib/db/enums';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
	export const { validateForm, submit } = form;

	$: status = $formData.status
		? projectStatusOptions.find(option => option.value === $formData.status)
		: undefined;
</script>

<SuperDebug data={$formData}></SuperDebug>

<form method="POST" use:enhance>
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
					{#each projectStatusOptions as {value, label}}
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
