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
	import { Tiptap } from '$lib/components/wrapper';

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

	let cursorPosition = 0;
	let descriptionTextArea: HTMLTextAreaElement | null = $state(null);
	let openConfirmDeletionDialog = $state(false);

	function handleInput(event: Event) {

		const target = event.target as HTMLTextAreaElement;
		cursorPosition = target.selectionStart;
		// console.log(event);
		// if (event instanceof InputEvent && event.inputType === 'insertLineBreak') {
		// 	const text = target.value;
		// 	const beforeCursor = text.slice(0, cursorPosition);
		// 	const afterCursor = text.slice(cursorPosition);
		// 	target.value = beforeCursor + '  \n' + afterCursor;
		// 	target.selectionStart = target.selectionEnd = cursorPosition + 3;
		// }
	}

	function insertAtCursor(insertText: string) {
		console.log(descriptionTextArea);
		let text = $formData.scenario ?? '';
		// Insert text at the cursor position
		$formData.scenario = `${text.slice(0, cursorPosition)}**${insertText}** ${text.slice(cursorPosition)}`;
		// Set cursor position after the inserted text

		if (descriptionTextArea) {
			setTimeout(() => {
				descriptionTextArea?.focus();
				if (descriptionTextArea instanceof HTMLTextAreaElement) {
					const newPosition = (cursorPosition ?? 0) + insertText.length + 5;
					descriptionTextArea.setSelectionRange(newPosition, newPosition);
				}
			}, 0);
		}
	}
</script>

<Dialog.Root bind:open={open}>

	<Dialog.Content class="sm:max-w-[600px]  ">
		<!--{$formId}-->
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

				<FormField {form} name="scenario">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Description</Form.Label>
							<Tiptap bind:content={$formData.scenario} params={{imageButton: true, gerkinsButtons: true}} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</FormField>

			</form>

		</div>
		<Dialog.Footer>
			<div class={`flex flex-row w-full ${$formData.id?'justify-between':'justify-end'}`}>
				{#if $formData.id }
					<Button
						variant="destructive"
						type="submit"
						onclick={()=>openConfirmDeletionDialog=true}
					>
						Rimuovi
					</Button>
				{/if}
				<Button form="saveScenarioForm" type="submit">Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={openConfirmDeletionDialog}>
	<Dialog.Content class="">
		<Dialog.Header>
			<Dialog.Title> Sei sicuro?</Dialog.Title>
		</Dialog.Header>
		L'eliminazione dello scenario provvederà all'eliminazione dei test manuali ad esso associato.
		<Dialog.Footer>
			<form action="?/deleteScenario" method="POST" use:enhance>
				<input type="hidden" name="id" value={$formData.id } />
				<Button
					variant="destructive"
					type="submit"
				>
					Rimuovi
				</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
