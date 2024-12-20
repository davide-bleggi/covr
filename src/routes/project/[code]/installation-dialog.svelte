<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button } from '$lib/components/ui/button';
	import { type Infer, superForm } from 'sveltekit-superforms';
	import { installationFormSchema, type InstallationFormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { onMount } from 'svelte';

	let { open = $bindable(false), formToValidate = $bindable() } = $props();

	let action = $state('?/createVersion');

	export const form = superForm<Infer<InstallationFormSchema>>(formToValidate, {
		validators: zodClient(installationFormSchema),
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

	onMount(() => {

	});

	async function handleSubmit(actionValue: string) {
		action = actionValue;
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
		<div class="grid gap-4 py-4">
			<form method="POST" action={action} use:enhance>
				<input type="hidden" name="id" bind:value={$formData.id} />
				<input type="hidden" name="versionId" bind:value={$formData.versionId} />


				<Form.Field {form} name="customerId">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Cliente</Form.Label>
							{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
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
