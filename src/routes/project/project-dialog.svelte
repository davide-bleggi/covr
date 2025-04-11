<script lang="ts">
	import {
		Button
	} from '$lib/components/ui/button/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { ProjectForm } from './index';
	import { projectFormSchema, type ProjectFormSchema } from './[code]/schema';
	import { tick } from 'svelte';
	import { ProjectStatusOptions } from '$lib/types';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Form from '$lib/components/ui/form';
	import SuperDebug, {
		type Infer,
		type SuperValidated,
		superForm
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from '$lib/components/ui/select';

	let openConfirmDeletionDialog = $state(false);

	let { formToValidate = $bindable(), open = $bindable() }:{
		open: boolean,
		formToValidate: SuperValidated<Infer<ProjectFormSchema>> | Infer<ProjectFormSchema>
	} = $props();

	const form = superForm<Infer<ProjectFormSchema>>(formToValidate, {
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

	$effect(() => {
		if (open && formToValidate?.data) {
			$formData = {
				...formToValidate.data
			};
		}
	});
</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Crea Progetto</Dialog.Title>
			<Dialog.Description>
				Crea un nuovo progetto.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<form method="POST" use:enhance action='?/createProject' id="saveProjectForm">
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
				<Button form="saveProjectForm" type="submit">Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>

</Dialog.Root>

<Dialog.Root bind:open={openConfirmDeletionDialog}>
	<Dialog.Content class="">
		<Dialog.Header>
			<Dialog.Title>Eliminazione progetto {$formData.name }</Dialog.Title>
			<Dialog.Description>Sei sicuro di vole procedere all'eliminazione del progetto?</Dialog.Description>
		</Dialog.Header>
		L'eliminazione del progetto provvederà all'eliminazione di tutte le versioni e dipendenze ad essi associate.
		<Dialog.Footer>
			<div class="w-full flex flex-row justify-between">
				<Button
					variant="secondary"
					onclick={()=>openConfirmDeletionDialog = false}
				>
					Annulla
				</Button>
				<form action="?/deleteProject" method="POST" use:enhance>
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

