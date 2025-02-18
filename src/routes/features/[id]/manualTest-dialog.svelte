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
	import type { Customer, User } from '@prisma/client';
	import {
		manualTestFormSchema,
		type ManualTestFormSchema, priorityLabels, testStatusLabels
	} from './schema';
	import { DatePicker, Tiptap } from '$lib/components/wrapper';
	import { getContext } from 'svelte';
	import * as Accordion from "$lib/components/ui/accordion/index.js";
	let {
		open = $bindable(false),
		propFormData = $bindable(),
	}: {
		open: boolean,
		propFormData: any,
	} = $props();

	const form = $state(superForm<Infer<ManualTestFormSchema>>(propFormData, {
		validators: zodClient(manualTestFormSchema),
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

	const { form: formData, enhance, errors, formId } = form;

	const sidePanelStore : {users: User[]} = getContext('sidePanelStore');


	$effect(() => {
		if ($formId) {
			$formId = propFormData.id ? `edit-manualTest-form-${propFormData.id}` : 'new-manualTest-form';
		}
		$formData = propFormData;
	});

</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[600px] ">

		<Dialog.Header>
			<Dialog.Title>Aggiungi Test Manuale</Dialog.Title>
			<Dialog.Description>
				inserire i dati di esecuzione del test
			</Dialog.Description>
		</Dialog.Header>
<!--		<SuperDebug data={$formData} />-->
		<div class="grid gap-4 py-4 max-h-[80vh] overflow-y-auto">
			<form method="POST" action='?/saveManualTest' use:enhance id="saveManualTestForm">
				<input hidden name="id" bind:value={$formData.id} />
				<input hidden name="scenarioId" bind:value={$formData.scenarioId} />
				<Form.Field {form} name="ownerId">
					<Form.Control>
						{#snippet children({ props })}
							<input hidden value={$formData.ownerId} name={props.name} />
							<Form.Label>Responsabile</Form.Label>
							<Select.Root type="single"
													 onValueChange={(value) => $formData.ownerId = parseInt(value)}>
								<Select.Trigger {...props}>
									{$formData.ownerId ? sidePanelStore.users.find((user: User) => user.id === $formData.ownerId)?.name : 'Seleziona un opzione'}
								</Select.Trigger>
								<Select.Content>
									{#each sidePanelStore.users as user}
										<Select.Item value={user.id}>{user.name}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<FormField {form} name="executionDate">
					<Form.Control>
						{#snippet children({ props })}
							<input hidden value={$formData.executionDate} name={props.name} />
							<Form.Label>Data di esecuzione</Form.Label>
							<DatePicker bind:date={$formData.executionDate}></DatePicker>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</FormField>
				<Form.Field {form} name="status">
					<Form.Control>
						{#snippet children({ props })}
							<input hidden value={$formData.status} name={props.name} />
							<Form.Label>Priorità</Form.Label>
							<Select.Root type="single"
													 bind:value={$formData.status}>
								<Select.Trigger {...props}>
									{testStatusLabels.find((item) => $formData.status === item.value)?.label ?? 'Seleziona un opzione'}
								</Select.Trigger>
								<Select.Content>
									{#each testStatusLabels as option}
										<Select.Item value={option.value}>{option.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Accordion.Root type="multiple" class="w-full" value="test-data">
					<Accordion.Item value="test-data">
						<div class="flex flex-grow w-full">
						<Accordion.Trigger class="flex flex-row items-center">Dati usati</Accordion.Trigger>
						</div>
						<Accordion.Content>
						<FormField {form} name="testData">
							<Form.Control>
								{#snippet children({ props })}
									<input hidden value={$formData.testData} name={props.name}/>
									<Tiptap class="h-[100px] w-full" {...props}  bind:content={$formData.testData} params={{imageButton: false, gerkinsButtons: false, height: 500}}></Tiptap>
									<Form.Description>Dati utilizzati per l'esecuzione del test</Form.Description>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</FormField>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="notes">
						<div class="flex flex-grow w-full">
						<Accordion.Trigger class="flex flex-row items-center">Note</Accordion.Trigger>
						</div>
						<Accordion.Content>
							<FormField {form} name="notes">
								<Form.Control>
									{#snippet children({ props })}
										<input hidden value={$formData.notes} name={props.name}/>
										<Tiptap class="h-[200px]" {...props}  bind:content={$formData.notes} params={{imageButton: true, gerkinsButtons: true, height: 1000}}></Tiptap>
										<Form.Description>Descrizione dei problemi riscontrati</Form.Description>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</FormField>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>

			</form>

		</div>
		<Dialog.Footer>
			<div class={`flex flex-row w-full ${$formData.id?'justify-between':'justify-end'}`}>
				{#if $formData.id }
					<form action="?/deleteManualTest" method="POST" use:enhance>
						<Button
							variant="destructive"
							type="submit"
						>
							<input type="hidden" name="id" value={$formData.id } />
							Rimuovi
						</Button>
					</form>
				{/if}
				<Button form="saveManualTestForm" type="submit">Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
