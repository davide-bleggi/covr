<script lang="ts">
	import {
		Button
	} from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { ProjectForm } from './index';
	import type { FormSchema } from './schema';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';

	export let open = true;
	export let form: SuperValidated<Infer<FormSchema>>;

	let submit: any;
	let projectForm: ProjectForm;

	async function handleSubmit() {
		// const result = await projectForm.submit();
		// if (result.type === 'success') {
		// 	open = false
		// }
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
			<ProjectForm data={form} on:success={()=>open=false} bind:this={projectForm}></ProjectForm>
		</div>
		<Dialog.Footer>
			<div class={`flex flex-row w-full ${form.data.id?'justify-between':'justify-end'}`}>
				{#if form.data.id }
					<Button
						variant="destructive"
						on:click={()=>{
							projectForm.setAction('?/delete');
							projectForm.submit()
							}}>
						Rimuovi
					</Button>
				{/if}
				<Button on:click={()=>{
					if(form.data.id){
						projectForm.setAction('?/update')
						projectForm.submit()
					}else{
						projectForm.setAction('?/create')
						projectForm.submit()
					}
				}}>Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

