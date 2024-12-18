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

};
