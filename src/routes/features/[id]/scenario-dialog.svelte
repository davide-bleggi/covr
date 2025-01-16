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
	import {
		type ScenarioFormData, scenarioFormSchema,
		type ScenarioFormSchema
	} from './schema';

	let {
		open = $bindable(false),
		propFormData
	}: {
		open: boolean,
		propFormData: ScenarioFormData;
	} = $props();

	const form = superForm<Infer<ScenarioFormSchema>>(propFormData, {
		validators: zodClient(scenarioFormSchema),
		dataType: 'json',
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				console.log('Form submission failed:', result);
			} else {
				if (result.type !== 'redirect' && result.data?.actionType === 'create') {
					reset();
				}
				open = false;
			}
		},
		onUpdate: ({ form }) => {
			$errors = form.errors;
		}
	});

	const { form: formData, enhance, errors, reset, formId } = form;

	$effect(() => {
		if ($formId) {
			$formId = propFormData.id ? `edit-scenario-dialog-${propFormData.id}` : 'new-scenario-dialog';
		}
		$formData = { ...propFormData };
	});

</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[425px]  ">
		{$formId}
		<Dialog.Header>
			<Dialog.Title>Gestione Scenario</Dialog.Title>
			<Dialog.Description>
			</Dialog.Description>
		</Dialog.Header>
<!--		<SuperDebug data={$formData}></SuperDebug>-->
		<div class="grid gap-4 py-4">
			<form method="POST" action='?/saveScenario' use:enhance id="saveScenarioForm">
				<input hidden name="id" bind:value={$formData.id} />
				<input hidden name="requirementId" bind:value={$formData.requirementId} />
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Nome scenario</Form.Label>
							<Input {...props} type="text" bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				{#if $formData.scenario}
					<FormField {form} name="scenario.given">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Given</Form.Label>
								<Textarea {...props} bind:value={$formData.scenario.given} data-markdown />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</FormField>
					<FormField {form} name="scenario.when">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>When</Form.Label>
								<Textarea {...props} bind:value={$formData.scenario.when} data-markdown />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</FormField>
					<FormField {form} name="scenario.then">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Then</Form.Label>
								<Textarea {...props} bind:value={$formData.scenario.then} data-markdown />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</FormField>
				{/if}
			</form>

		</div>
		<Dialog.Footer>
			<div class={`flex flex-row w-full ${$formData.id?'justify-between':'justify-end'}`}>
				{#if $formData.id }
					<form action="?/deleteScenario" method="POST" use:enhance>
						<Button
							variant="destructive"
							type="submit"
						>
							<input type="hidden" name="id" value={$formData.id } />
							{$formData.id}
							Rimuovi
						</Button>
					</form>
				{/if}
				<Button form="saveScenarioForm" type="submit">Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
