import prisma from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
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
	update: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		if (form.data.id) {
			let project;
			try {
				project = await prisma.project.update({
					where: {
						id: form.data.id
					},
					data: { ...form.data, id: undefined }
				});
			} catch (err) {
				console.log(err);
				return setError(form, 'code', 'codice già in uso');
			}

			if (project) {
				console.log(project)
				throw redirect(303, `/projects/${project.code}`);
			}
		}

		return {
			form
		};

	},
	delete: async (event) => {
		const form = await superValidate(event, zod(formSchema));

		await prisma.project.delete({
			where: {
				id: form.data.id
			}
		})
		return { success: true, message: 'Item deleted successfully' };
	}
};
