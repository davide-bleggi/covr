import type { PageServerLoad, Actions } from './$types.js';
import { fail, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import prisma from '$lib/prisma';


export const load: PageServerLoad = async () => {
	try{
		return {
			projects: await prisma.project.findMany(),
			form: await superValidate(zod(formSchema))
		};
	}catch(err){
		error(404, {
			message: 'Database not found',
		});
	}
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		if(!form.data.id) {
			await prisma.project.create({ data: form.data });
		}
		return {
			form
		};
	},
};
