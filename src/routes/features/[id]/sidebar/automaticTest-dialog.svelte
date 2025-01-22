<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import type { AutomaticTest, User } from '@prisma/client';
	import SuperDebug, { type Infer, superForm } from 'sveltekit-superforms';
	import { automaticTestFormSchema, type AutomaticTestFormSchema, testStatusLabels } from '../schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select/index';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { ComboSelector, DatePicker } from '$lib/components/wrapper';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/form';

	let {
		open = $bindable(false),
		propFormData = $bindable()
	}: {
		open: boolean,
		propFormData: Infer<AutomaticTestFormSchema>
	} = $props();

	const form = $state(superForm<Infer<AutomaticTestFormSchema>>(propFormData, {
		validators: zodClient(automaticTestFormSchema),
		dataType: 'json',
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
			$formId = propFormData.id ? `edit-automaticTest-form-${propFormData.id}` : 'new-automaticTest-form';
		}
		$formData = propFormData;
	});

</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[600px]  ">

		<Dialog.Header>
			<Dialog.Title>Aggiungi Test Automatico</Dialog.Title>
			<Dialog.Description>
				inserire i dati di esecuzione del test
			</Dialog.Description>
		</Dialog.Header>
		<!--		<SuperDebug data={$formData} />-->
		<div class="grid gap-4 py-4">
			<form method="POST" action='?/saveAutomaticTest' use:enhance id="saveAutomaticTestForm">
				<input hidden name="id" bind:value={$formData.id} />
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<input hidden value={$formData.name} name={props.name} />
							<Form.Label>Nome</Form.Label>
							<Input bind:value={$formData.name}></Input>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="executionDate">
					<Form.Control>
						{#snippet children({ props })}
							<input hidden value={$formData.executionDate} name={props.name} />
							<Form.Label>Data di esecuzione</Form.Label>
							<DatePicker bind:date={$formData.executionDate}></DatePicker>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
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
				<Form.Field {form} name="notes">
					<Form.Control>
						{#snippet children({ props })}
							<input hidden value={$formData.notes} name={props.name} />
							<Form.Label>Note</Form.Label>
							<Textarea class="min-h-[250px]" bind:value={$formData.notes}></Textarea>
							<Form.Description>Aggiungi descrizione dei problemi riscontrati</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="scenarioIds">
					<div class="flex flex-col w-full gap-3">
						<Form.Control>
							{#snippet children({ props })}
								<input hidden name="scenarioIds" value={$formData.scenarioIds} />
								<ComboSelector
									path="/api/scenarios"
									bind:values={$formData.scenarioIds}
									placeholder="Seleziona scenari collegati..."
								>
									{#snippet optionFormat(option)}
										{`SCN - ${option.value} - ${option.label}`}
									{/snippet}

								</ComboSelector>
							{/snippet}
						</Form.Control>

						<Form.Description>
							Seleziona scenari collegati
						</Form.Description>
					</div>
				</Form.Field>
			</form>

		</div>
		<Dialog.Footer>
			<div class={`flex flex-row w-full ${$formData.id?'justify-between':'justify-end'}`}>
				{#if $formData.id }
					<form action="?/deleteAutomaticTest" method="POST" use:enhance>
						<Button
							variant="destructive"
							type="submit"
						>
							<input type="hidden" name="id" value={$formData.id } />
							Rimuovi
						</Button>
					</form>
				{/if}
				<Button form="saveAutomaticTestForm" type="submit">
					Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
