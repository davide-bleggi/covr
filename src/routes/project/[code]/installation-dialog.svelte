<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button } from '$lib/components/ui/button';
	import SuperDebug, { type Infer, superForm } from 'sveltekit-superforms';
	import { installationFormSchema, type InstallationFormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { onMount } from 'svelte';
	import * as Select from '$lib/components/ui/select/index';
	import type { Customer } from '@prisma/client';
	import { FormField } from '$lib/components/ui/form/index.js';
	import { DatePicker } from '$lib/components/wrapper';
	import { format } from 'date-fns';

	let {
		open = $bindable(false),
		formToValidate = $bindable(),
		customers = $bindable()
	} = $props();

	let action = $state('?/createInstallation');

	const form = superForm<Infer<InstallationFormSchema>>(formToValidate, {
		validators: zodClient(installationFormSchema),
		id: `installation-form-${formToValidate.data.versionId}`,
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
	});

	const { form: formData, enhance, submit, errors } = form;

	async function handleSubmit(actionValue: string) {
		action = actionValue;
		console.log($formData);
		console.log(await form.validateForm());
		submit();
	}

</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[425px]">

		<Dialog.Header>
			<Dialog.Title>Aggiungi installazione</Dialog.Title>
			<Dialog.Description>

			</Dialog.Description>
		</Dialog.Header>
		<SuperDebug data={$formData}></SuperDebug>
		<div class="grid gap-4 py-4">
			<form method="POST" action={action} use:enhance>
				<input hidden name="id" bind:value={$formData.id} />
				<input hidden name="versionId" bind:value={$formData.versionId} />
				<!--				<input type="number" name="customerId" bind:value={$formData.customerId} />-->

				<Form.Field {form} name="customerId">
					<Form.Control>
						{#snippet children({ props })}
							<input hidden value={$formData.customerId} name={props.name} />
							<Form.Label>Cliente</Form.Label>
							<Select.Root type="single"
													 bind:value={$formData.customerId}>
								<Select.Trigger {...props}>
									{$formData.customerId ? customers.find((customer: Customer) => customer.id === $formData.customerId).name : 'Seleziona un opzione'}
								</Select.Trigger>
								<Select.Content>
									{#each customers as customer}
										<Select.Item value={customer.id}>{customer.name}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<FormField {form} name="installationDate">
					<Form.Control>
						{#snippet children({ props })}
							<input hidden value={$formData.installationDate} name={props.name} />
							<Form.Label>Data di installazione</Form.Label>
							<DatePicker bind:date={$formData.installationDate}></DatePicker>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</FormField>
			</form>

		</div>
		<Dialog.Footer>
			<div class={`flex flex-row w-full ${formToValidate.data.id?'justify-between':'justify-end'}`}>
				{#if formToValidate.data.id }
					<Button
						variant="destructive"
						onclick={()=>{
							handleSubmit('?/deleteInstallation')
							}}>
						Rimuovi
					</Button>
				{/if}
				<Button onclick={()=>{
					if(formToValidate.data.id){
						handleSubmit('?/updateInstallation')
					}else{
						handleSubmit('?/createInstallation')
					}
				}}>Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
