<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button } from '$lib/components/ui/button';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { type VersionFormSchema, versionFormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Form from '$lib/components/ui/form';
	import type { Version } from '@prisma/client';
	import { onMount } from 'svelte';

	let { open = $bindable(false), formToValidate = $bindable(), versions, formId }: {
		open: boolean,
		formToValidate: SuperValidated<Infer<VersionFormSchema>> | Infer<VersionFormSchema>,
		versions: Version[],
		formId: string
	} = $props();

	export const form = superForm<Infer<VersionFormSchema>>(formToValidate, {
		validators: zodClient(versionFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				console.log('Form submission failed:', result);
			} else {
				open = false;
				openConfirmDeletionDialog = false;
			}
		},
		onUpdate: ({ form }) => {
			$errors = form.errors;
		},
		id: formId
	});

	const { form: formData, enhance, errors } = form;

	$formData.prevVersion = $formData.prevVersion ?? null;
	// let localVersions: Version[] = $state([]);

	let localVersions: Version[] = $derived(versions.filter(ver => ver.id !== $formData.id));

	$effect(() => {
		// controlla che non sia un nuovo superform vuoto (con info schema) ma un oggetto con dati del form
		if (formToValidate && !('data' in formToValidate)) {
			// Update form data
			$formData = {
				id: Number(formToValidate.id) ?? null,
				name: formToValidate.name ?? '',
				projectId: formToValidate.projectId ?? null,
				prevVersion: formToValidate.prevVersion ?? null
			};
		}
	});


	const prevVersionName = $derived(versions.find((ver) => $formData.prevVersion === ver.id)?.name);

	let openConfirmDeletionDialog = $state(false);
</script>
<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Aggiungi nuova versione</Dialog.Title>
			<Dialog.Description>
				Crea una nuova versione
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<form method="POST" action="?/saveVersion" use:enhance id="saveVersionForm">
				<input type="hidden" name="id" bind:value={$formData.id} />
				<input type="hidden" name="projectId" bind:value={$formData.projectId} />

				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Nome Versione</Form.Label>
							<Input {...props} bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<input type="hidden" name="prevVersion" bind:value={$formData.prevVersion} />
				<Form.Field {form} name="prevVersion">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Versione precedente</Form.Label>
							<Select.Root
								allowDeselect={true}
								type="single"
								bind:value={$formData.prevVersion}
								name={props.name}
							>
								<Select.Trigger {...props}>
									{prevVersionName
										? prevVersionName
										: "Seleziona una versione"}
								</Select.Trigger>
								<Select.Content>
									{#each localVersions as version }
										<Select.Item value={version.id} label={version.name} />
									{/each}
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.Description>Selezionare una versione precedente come madre della versione corrente.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</form>

		</div>
		<Dialog.Footer>
			<div class={`flex flex-row w-full ${$formData.id?'justify-between':'justify-end'}`}>
				{#if $formData.id }
					<Button
						variant="destructive"
						onclick={()=>openConfirmDeletionDialog=true}
					>
						Rimuovi
					</Button>
				{/if}
				<Button form="saveVersionForm" type="submit">Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>

</Dialog.Root>

<Dialog.Root bind:open={openConfirmDeletionDialog}>
	<Dialog.Content class="">
		<Dialog.Header>
			<Dialog.Title>Eliminazione versione {$formData.name }</Dialog.Title>
			<Dialog.Description>Sei sicuro di vole procedere all'eliminazione?</Dialog.Description>
		</Dialog.Header>
		L'eliminazione della versione provvederà all'eliminazione di tutte le feature e dipendenze ad essi associate.
		<Dialog.Footer>
			<div class="w-full flex flex-row justify-between">
				<Button
					variant="secondary"
					onclick={()=>openConfirmDeletionDialog = false}
				>
					Annulla
				</Button>
				<form action="?/deleteVersion" method="POST" use:enhance>
					<input type="hidden" name="id" value={$formData.id } />
					<Button
						variant="destructive"
						type="submit"
					>
						Conferma
					</Button>
				</form>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

