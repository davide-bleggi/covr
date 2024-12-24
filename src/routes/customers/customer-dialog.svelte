<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Form from '$lib/components/ui/form';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { type CustomerFormSchema, customerFormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { tick } from 'svelte';

	let { data = $bindable(), open = $bindable() } = $props();

	const form = superForm<Infer<CustomerFormSchema>>(data, {
		validators: zodClient(customerFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				return;
			}
			open = false;
		},
		onUpdate: ({ form }) => {
			$errors = form.errors;
		}
	});

	let action = $state('?/createCustomer');

	const { form: formData, enhance, submit, errors } = form;

	$effect(() => {
		if (data) {
			$formData = data;
		}
	});

	async function handleSubmit(actionName: string) {
		action = '?/' + actionName;
		await tick();
		submit();
	}

</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Aggiungi nuovo cliente</Dialog.Title>
			<Dialog.Description>
				Crea un nuovo cliente.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<form method="POST" use:enhance
						onsubmit={()=>
							handleSubmit($formData.id? 'updateCustomer': 'createCustomer')
						}
						action={action}>
				<input type="hidden" name="id" bind:value={$formData.id} />
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Nome Cliente</Form.Label>
							<Input {...props} bind:value={$formData.name} />
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
						onclick={()=>{
							handleSubmit('deleteCustomer')}}
						variant="destructive">
						Rimuovi
					</Button>
				{/if}
				<Button
					onclick={()=>{
							handleSubmit($formData.id? 'updateCustomer': 'createCustomer')}}>
					Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
