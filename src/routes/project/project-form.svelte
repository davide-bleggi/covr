<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import SuperDebug, {
		type Infer,
		superForm
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import { ProjectStatusOptions } from '$lib/db/types';
	import { projectFormSchema, type ProjectFormSchema } from './[code]/schema';

	let { data = $bindable(), open = $bindable(), action = $bindable(), submit = $bindable() } = $props();

	const form = superForm<Infer<ProjectFormSchema>>(data, {
		validators: zodClient(projectFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				return;
			}
			open = false;
		},
		onUpdate: ({ form }) => {
			$errors = form.errors;
		},
	});
	const { form: formData, enhance, errors } = form;
	submit = form.submit;

	$effect(() => {
		if ($formData.code !== $formData.code.toUpperCase())
			$formData.code = $formData.code.toUpperCase();
	});

</script>

<form method="POST" use:enhance action={action}>
	<input type="hidden" name="id" bind:value={$formData.id} />
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Nome</Form.Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="code">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Codice Progetto</Form.Label>
				<Input bind:value={$formData.code} {...props} placeholder="COD" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Descrizione</Form.Label>
				<Textarea {...props} bind:value={$formData.description} placeholder="Descrizione progetto"></Textarea>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
		<Form.Description>Descrivi brevemente di cosa si occupa il progetto.</Form.Description>
	</Form.Field>

	<Form.Field {form} name="status">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Stato</Form.Label>
				<Select.Root type="single"
										 bind:value={$formData.status}
										 name={props.name}>
					<Select.Trigger {...props} class="w-full">
						{$formData.status
							? ProjectStatusOptions.find((opt)=>opt.value ===$formData.status)?.label??''
							: "Stato attuale"}
					</Select.Trigger>
					<Select.Content>
						{#each ProjectStatusOptions as { value, label }}
							<Select.Item value={value} label={label}>
								{label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

</form>
