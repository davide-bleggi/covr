<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button } from '$lib/components/ui/button';
	import SuperDebug, { type Infer, superForm } from 'sveltekit-superforms';
	import {
		type FeatureFormSchema,
		featureFormSchema
	} from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select/index';
	import { FormField } from '$lib/components/ui/form/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { Customer, Project, Version } from '@prisma/client';
	import { ComboSelector, DynamicSelector } from '$lib/components/wrapper';

	let {
		open = $bindable(false),
		propFormData = $bindable(),
		version
	}: {
		open: boolean,
		propFormData: any;
		version: Version & { project: Project } | undefined;
	} = $props();

	let projectId = $state(version ? version.project.id : null);
	let versionsParams = $state(version ? { projectId: projectId } : {});


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

	const { form: formData, enhance, errors, formId } = form;

	$effect(() => {
		if ($formId) {
			$formId = propFormData.id ? `edit-feature-dialog-${propFormData.id}` : 'new-feature-dialog';
		}
		$formData = { ...propFormData };
	});

	$effect(() => {
		versionsParams = { projectId: projectId };
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
			<form method="POST" class="flex flex-col gap-3" action='?/saveFeature' use:enhance id="saveFeatureForm">
				<input hidden name="id" bind:value={$formData.id} />
				<input hidden name="versionId" bind:value={$formData.versionId} />

				<div class="grid grid-cols-3 flex-row gap-2 w-full">
					<div class="grid col-span-2 flex- w-full gap-3">
						<label class="font-medium text-sm leading-none ">Progetto</label>
						<DynamicSelector
							path="/api/projects"
							bind:value={projectId}
							placeholder="Seleziona progetto..."
						>
							{#snippet optionFormat(option)}
								{`${option.label}`}
							{/snippet}
						</DynamicSelector>
					</div>

					<Form.Field  {form} name="versionId">
						<div class="grid col-span-1 w-full gap-3">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Versione</Form.Label>

									<DynamicSelector
										path='/api/versions'
										bind:params={versionsParams}
										bind:value={$formData.versionId}
										placeholder="Seleziona versione..."
									>
										{#snippet optionFormat(option)}
											{`${option.label} - ${option.value}`}
										{/snippet}
									</DynamicSelector>
								{/snippet}
							</Form.Control>
						</div>
					</Form.Field>
				</div>

				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Nome Feature</Form.Label>
							<Input {...props} type="text" bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<FormField {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Descrizione</Form.Label>
							<Textarea class="min-h-[350px]" {...props} bind:value={$formData.description} />
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
