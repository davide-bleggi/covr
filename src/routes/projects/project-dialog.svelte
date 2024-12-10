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
</script>

<Dialog.Root bind:open={open}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>
                Make changes to your profile here. Click save when you're done.
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <ProjectForm data={form}></ProjectForm>
        </div>
        <Dialog.Footer>
            <Button type="submit">Save changes</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
