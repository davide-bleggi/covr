import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema, type FormSchema } from "./schema";
import { Project } from '$lib/db/schemas';


export const load: PageServerLoad = async () => {
    return {
        projects: (await Project.findAll()).map((project) => project.toJSON()),
        form: await superValidate(zod(formSchema)),
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }
        await Project.create(form.data);
        return {
            form,
        };
    },
};
