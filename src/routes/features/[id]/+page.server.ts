import prisma from '$lib/prisma';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { requirementFormSchema } from './schema';
import { type Actions, error, fail, type RequestEvent } from '@sveltejs/kit';
import { featureFormSchema } from '../../project/[code]/schema';


export async function load({ params }) {
	const { id } = params;
	const feature = await prisma.feature.findUnique({
		where: {
			id: Number(id)
		},
		include: {
			version:{
				include: {
					project: true
				}
			},
			requirements: {
				include: {
					scenarios: true
				}
			}
		}
	});

	if (!feature) {
		// Throw an error with a custom status and message
		throw error(404, `La feature: '${id}' non esiste`);
	}


	const requirementFormData = {
		featureId: feature.id
	};

	return {
		requirementForm: await superValidate(requirementFormData, zod(requirementFormSchema), {errors: false}),
		feature: feature
	}
}

export const actions: Actions={
	saveRequirement: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(requirementFormSchema));
		if(!form.data.id) {
			try {
				await prisma.requirement.create({ data: { ...form.data, id: undefined } });
			} catch (err: any) {
				console.log(err);
				// Make sure to return the form with the error
				if (err.code === 'P2002') {
					return setError(form, 'name', 'nome già in uso');
				}
				return fail(400, { form });
			}
		}else{
			try {
				await prisma.requirement.update({
					data: { ...form.data, id: undefined},
					where: { id: form.data.id }
				});
			} catch (err: any) {
				console.log(err);
				// Make sure to return the form with the error
				if (err.code === 'P2002') {
					return setError(form, 'name', 'nome già in uso');
				}
				return fail(400, { form });
			}
		}

		return {
			form
		};
	},
	deleteRequirement: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		try {
			await prisma.requirement.delete({ where: { id: id ?? null } });
		} catch {
			return fail(400);
		}
	},
}

