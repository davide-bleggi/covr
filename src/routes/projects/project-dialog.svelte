<script lang="ts">
	import {
		Button
	} from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { ProjectForm } from './index';
	import type { FormSchema } from './schema';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';

    export let open=true;
    export let form: SuperValidated<Infer<FormSchema>>;

    let submit: any;

    async function handleSubmit() {
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
            <ProjectForm data={form} on:success={()=>open=false} bind:submit={submit}></ProjectForm>
        </div>
        <Dialog.Footer>
            <Button on:click={handleSubmit}>Salva</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
