<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button } from '$lib/components/ui/button';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { installationFormSchema, type InstallationFormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select/index';
	import type { Customer } from '@prisma/client';
	import { FormField } from '$lib/components/ui/form/index.js';
	import { DatePicker } from '$lib/components/wrapper';

	let {
		open = $bindable(false),
		formToValidate = $bindable(),
		customers,
		formId
	}: {
		open: boolean,
		formToValidate: any;
		customers: Customer[],
		formId: string
	} = $props();

	const form = $state(superForm<Infer<InstallationFormSchema>>(formToValidate, {
		validators: zodClient(installationFormSchema),
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
		$formData = formToValidate
	})

</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[425px]  ">

		<Dialog.Header>
			<Dialog.Title>Aggiungi installazione</Dialog.Title>
			<Dialog.Description>
				Inserire dati installazione
			</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<form method="POST" action='?/saveInstallation' use:enhance id="saveInstallationForm">
				<input hidden name="id" bind:value={$formData.id} />
				<input hidden name="versionId" bind:value={$formData.versionId} />
				<Form.Field {form} name="customerId">
					<Form.Control>
						{#snippet children({ props })}
							<input hidden value={$formData.customerId} name={props.name} />
							<Form.Label>Cliente</Form.Label>
							<Select.Root type="single"
													 onValueChange={(value) => $formData.customerId = parseInt(value)}>
								<Select.Trigger {...props}>
									{$formData.customerId ? customers.find((customer: Customer) => customer.id === $formData.customerId)?.name : 'Seleziona un opzione'}
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
			<div class={`flex flex-row w-full ${$formData.id?'justify-between':'justify-end'}`}>
				{#if $formData.id }
					<form action="?/deleteInstallation" method="POST" use:enhance>
						<Button
							variant="destructive"
							type="submit"
						>
							<input type="hidden" name="id" value={$formData.id } />
							Rimuovi
						</Button>
					</form>
				{/if}
				<Button form="saveInstallationForm" type="submit">Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
