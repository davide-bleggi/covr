<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button } from '$lib/components/ui/button';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { type VersionFormSchema, versionFormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import * as Select from "$lib/components/ui/select/index.js";
	import * as Form from '$lib/components/ui/form';
	import type { Version } from '@prisma/client';

	let {open = $bindable(false), formToValidate = $bindable(), versions}:{
		open: boolean,
		formToValidate: SuperValidated<Infer<VersionFormSchema>>,
		versions: Version[]
	} = $props();

	let action = $state('?/createVersion');

	export const form = superForm<Infer<VersionFormSchema>>(formToValidate, {
		validators: zodClient(versionFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				console.log('Form submission failed:', result);
			}else{
				open=false;
			}
		},
		onUpdate: ({ form }) => {
			$errors = form.errors;
		},
	});

	const { form: formData, enhance, submit, errors } = form;

	async function handleSubmit(actionValue: string) {
		action = actionValue;
		submit();
	}

	const prevVersionName = $derived(versions.find((ver)=>$formData.prevVersion===ver.id)?.name)

</script>
<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[425px]">
		<SuperDebug data={$formData}/>
		<Dialog.Header>
			<Dialog.Title>Aggiungi nuova versione</Dialog.Title>
			<Dialog.Description>
				Crea una nuova versione
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<form method="POST" action={action} use:enhance>
				<input type="hidden" name="id" bind:value={$formData.id} />
				<input type="hidden" name="projectId" bind:value={$formData.projectId} />

				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({props})}
							<Form.Label>Nome Versione</Form.Label>
							<Input {...props} bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<input type="hidden" name="prevVersion" bind:value={$formData.prevVersion} />
				<Form.Field {form} name="prevVersion">
					<Form.Control>
						{#snippet children({props})}
							<Form.Label>Nome Versione</Form.Label>
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
									{#each versions as version }
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
			<div class={`flex flex-row w-full ${formToValidate.data.id?'justify-between':'justify-end'}`}>
				{#if formToValidate.data.id }
					<Button
						variant="destructive"
						onclick={()=>{
							handleSubmit('?/deleteVersion')
							}}>
						Rimuovi
					</Button>
				{/if}
				<Button onclick={()=>{
					if(formToValidate.data.id){
						handleSubmit('?/updateVersion')
					}else{
						handleSubmit('?/createVersion')
					}
				}}>Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
