<script lang="ts">
	import {
		Button
	} from '$lib/components/ui/button/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { ProjectForm } from './index';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { ProjectFormSchema } from './[code]/schema';
	import { tick } from 'svelte';

	let { open = $bindable(), form= $bindable()}= $props();

	let submit: (()=>void)|undefined = $state();
	let action = $state('createProject');

	async function handleSubmit(actionValue: string) {
		action =  actionValue;
		await tick();
		if(submit)
			submit();
	}
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
			<ProjectForm data={form}
									 bind:submit={submit}
									 bind:open={open}
									 bind:action="{action}"
			></ProjectForm>
		</div>
		<Dialog.Footer>
			<div class={`flex flex-row w-full ${form.data.id?'justify-between':'justify-end'}`}>
				{#if form.data.id }
					<Button
						variant="destructive"
						onclick={()=>{
							handleSubmit('/project/[code]?/deleteProject')
							}}>
						Rimuovi
					</Button>
				{/if}
				<Button onclick={()=>{
					if(form.data.id){
						handleSubmit('/project/[code]?/updateProject')
					}else{
						handleSubmit('project?/createProject')
					}
				}}>Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

