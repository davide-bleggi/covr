<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button } from '$lib/components/ui/button';
	import SuperDebug, { type Infer, superForm } from 'sveltekit-superforms';
	import {
		type FeatureFormSchema,
		featureFormSchema,
	} from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select/index';
	import { FormField } from '$lib/components/ui/form/index.js';
	import { Textarea } from '$lib/components/ui/textarea';

	let {
		open = $bindable(false),
		propFormData = $bindable(),
	}: {
		open: boolean,
		propFormData: any;
	} = $props();

	const form = $state(superForm<Infer<FeatureFormSchema>>(propFormData, {
		validators: zodClient(featureFormSchema),
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

	const { form: formData, enhance, errors, formId} = form;

	$effect(() => {
		if ($formId) {
			$formId = propFormData.id ? `edit-feature-dialog-${propFormData.id}` : 'new-feature-dialog';
		}
		$formData = { ...propFormData };
	});


</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[600px]  ">

		<Dialog.Header>
			<Dialog.Title>Aggiungi Feature</Dialog.Title>
			<Dialog.Description>
				Inserire i dati della feature
			</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<form method="POST" action='?/saveFeature' use:enhance id="saveFeatureForm">
				<input hidden name="id" bind:value={$formData.id} />
				<input hidden name="versionId" bind:value={$formData.versionId} />
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Nome Feature</Form.Label>
							<Input {...props} type="text" bind:value={$formData.name}/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<FormField {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Descrizione</Form.Label>
							<Textarea class="min-h-[350px]" {...props} bind:value={$formData.description}/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</FormField>
			</form>

		</div>
		<Dialog.Footer>
			<div class={`flex flex-row w-full ${$formData.id?'justify-between':'justify-end'}`}>
				{#if $formData.id }
					<form action="?/deleteFeature" method="POST" use:enhance>
						<Button
							variant="destructive"
							type="submit"
						>
							<input type="hidden" name="id" value={$formData.id } />
							Rimuovi
						</Button>
					</form>
				{/if}
				<Button form="saveFeatureForm" type="submit">Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
