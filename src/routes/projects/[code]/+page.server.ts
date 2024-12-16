import prisma from '$lib/prisma';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '../schema';
import type { Actions } from '../../../../.svelte-kit/types/src/routes/projects/$types';

export async function load({ params }) {
	const { code } = params;
	const project = await prisma.project.findUnique({
		where: {
			code: code
		}
	});

	if (!project) {
		// Throw an error with a custom status and message
		throw error(404, `Il progetto codice: '${code}' non esiste`);
	}

	const formData = {
		id: project.id,
		code: project.code,
		name: project.name,
		status: project.status,
		description: project.description ?? '' // Convert null to empty string
	};

	return {
		project,
		form: await superValidate(formData, zod(formSchema))
	};
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		if (form.data.id) {
			const project = await prisma.project.update({
				where: {
					id: form.data.id
				},
				data: {...form.data, id: undefined}
			});
			console.log(project);
			return {
				project,
				form,
			};
		}

		return {
			form
		}

	}
};
