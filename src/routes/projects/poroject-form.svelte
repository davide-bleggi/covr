<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { formSchema, type FormSchema } from "./schema";
    import {
        type SuperValidated,
        type Infer,
        superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { Textarea } from '$lib/components/ui/textarea';
    import * as Select from "$lib/components/ui/select";
    import { ProjectStatus } from '$lib/db/types';


    export let data: SuperValidated<Infer<FormSchema>>;

    const form = superForm(data, {
        validators: zodClient(formSchema),
    });

    const { form: formData, enhance } = form;
    let selectedEmail='aa';

    export let formEl: Form;

</script>

<form method="POST" use:enhance bind:this={formEl}>
    <Form.Field {form} name="name">
        <Form.Control let:attrs>
            <Form.Label>Nome Progetto</Form.Label>
            <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="code">
        <Form.Control let:attrs>
            <Form.Label>Codice Progetto</Form.Label>
            <Input {...attrs} bind:value={$formData.code} placeholder="COD" />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="description">
        <Form.Control let:attrs>
            <Form.Label>Descrizione</Form.Label>
            <Textarea placeholder="Descrizione progetto"></Textarea>
        </Form.Control>
        <Form.Description>Descrivi brevemente di cosa si occupa il progetto.</Form.Description>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="status">
        <Select.Root portal={null}>
            <Select.Trigger class="w-full">
                <Select.Value placeholder="Stato attuale" />
            </Select.Trigger>
            <Select.Content>
                    {#each Object.values(ProjectStatus) as key}
                        <Select.Item value={key} label={key}>
                            {key}
                        </Select.Item>
                    {/each}
            </Select.Content>
            <Select.Input name="status" />
        </Select.Root>

        <Form.FieldErrors />
    </Form.Field>

</form>
