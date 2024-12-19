import type { PageServerLoad, Actions } from './$types.js';
import { fail, error } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import prisma from '$lib/prisma';
import { projectFormSchema } from './[code]/schema';


export const load: PageServerLoad = async () => {
	try{
		return {
			projects: await prisma.project.findMany(),
			form: await superValidate(zod(projectFormSchema))
		};
	}catch(err){
		console.log(err)
		error(404, {
			message: 'Database not found',
		});
	}
};

export const actions: Actions = {
	createProject: async (event) => {
		const form = await superValidate(event, zod(projectFormSchema));
		console.log('createProject');
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		if (!form.data.id) {
			try {
				await prisma.project.create({ data: form.data });
			} catch {
				return setError(form, 'code', 'codice già esitente');
			}
		}
		return {
			form
		};
	},
};
