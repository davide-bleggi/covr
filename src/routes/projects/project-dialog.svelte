<script lang="ts">
    import {
        Button,
        buttonVariants
    } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import {ProjectForm} from "./index";
    import type {FormSchema} from "./schema";
    import type {Infer, SuperValidated} from "sveltekit-superforms";

     export let open=false;
    export let form: SuperValidated<Infer<FormSchema>>;

    let projectForm;

    async function handleSubmit(){
       await projectForm.submit()
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
            <ProjectForm bind:data={form} bind:formEl={projectForm}></ProjectForm>
        </div>
        <Dialog.Footer>
            <Button on:click={handleSubmit}>Salva</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
