<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button } from '$lib/components/ui/button';
	import SuperDebug, { type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select/index';
	import { FormField } from '$lib/components/ui/form/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { priorityLabels, type RequirementFormSchema, requirementFormSchema, statusLabels } from './schema';
	import type { Customer } from '@prisma/client';

	let {
		open = $bindable(false),
		propFormData = $bindable(),
		formId
	}: {
		open: boolean,
		propFormData: any;
		formId: string
	} = $props();

	const form = $state(superForm<Infer<RequirementFormSchema>>(propFormData, {
		validators: zodClient(requirementFormSchema),
		id: formId,
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				console.log('Form submission failed:', result);
			} else {
				open = false;
			}
		},
		onUpdate: ({ form }) => {
			$errors = form.errors;
		}
	}));

	const { form: formData, enhance, errors } = form;

	$effect(()=>{
		$formData = propFormData
	})

</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[425px]  ">

		<Dialog.Header>
			<Dialog.Title>Aggiungi Requisito</Dialog.Title>
			<Dialog.Description>
			</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<form method="POST" action='?/saveRequirement' use:enhance id="saveRequirementForm">
				<input hidden name="id" bind:value={$formData.id} />
				<input hidden name="featureId" bind:value={$formData.featureId} />
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Titolo requisito</Form.Label>
							<Input {...props} type="text" bind:value={$formData.name}/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<FormField {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Descrizione</Form.Label>
							<Textarea {...props} bind:value={$formData.description}/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</FormField>
				<Form.Field {form} name="priority">
					<Form.Control>
						{#snippet children({ props })}
							<input hidden value={$formData.priority} name={props.name} />
							<Form.Label>Priorità</Form.Label>
							<Select.Root type="single"
													bind:value={$formData.priority}>
								<Select.Trigger {...props}>
									{priorityLabels.find((item)=>$formData.priority===item.value)?.label?? 'Seleziona un opzione'}
								</Select.Trigger>
								<Select.Content>
									{#each priorityLabels as option}
										<Select.Item value={option.value}>{option.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="status">
					<Form.Control>
						{#snippet children({ props })}
							<input hidden value={$formData.status} name={props.name} />
							<Form.Label>Stato</Form.Label>
							<Select.Root type="single"
													 bind:value={$formData.status}>
								<Select.Trigger {...props}>
									{statusLabels.find((item)=>$formData.status===item.value)?.label?? 'Seleziona un opzione'}
								</Select.Trigger>
								<Select.Content>
									{#each statusLabels as option}
										<Select.Item value={option.value}>{option.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</form>

		</div>
		<Dialog.Footer>
			<div class={`flex flex-row w-full ${$formData.id?'justify-between':'justify-end'}`}>
				{#if $formData.id }
					<form action="?/deleteRequirement" method="POST" use:enhance>
						<Button
							variant="destructive"
							type="submit"
						>
							<input type="hidden" name="id" value={$formData.id } />
							Rimuovi
						</Button>
					</form>
				{/if}
				<Button form="saveRequirementForm" type="submit">Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
