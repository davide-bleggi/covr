<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { VersionFormSchema } from './schema';
	import { VersionForm } from './index';
	import { Button } from '$lib/components/ui/button';

	export let open = true;
	export let form: SuperValidated<Infer<VersionFormSchema>>;

	let versionForm: VersionForm;

	async function handleSubmit(action: string) {
		versionForm.setAction('?/' + action);
		versionForm.form.submit();
	}
</script>
<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Aggiungi nuova versione</Dialog.Title>
			<Dialog.Description>
				Crea un nuovo progetto.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<VersionForm data={form} on:success={(event: CustomEvent)=>{
				open=false;
			}
			} bind:this={versionForm}></VersionForm>
		</div>
		<Dialog.Footer>
			<div class={`flex flex-row w-full ${form.data.id?'justify-between':'justify-end'}`}>
				{#if form.data.id }
					<Button
						variant="destructive"
						on:click={()=>{
							handleSubmit('deleteVersion')
							}}>
						Rimuovi
					</Button>
				{/if}
				<Button on:click={()=>{
					if(form.data.id){
						handleSubmit('updateVersion')
					}else{
						handleSubmit('createVersion')
					}
				}}>Salva
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
