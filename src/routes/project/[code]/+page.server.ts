import prisma from '$lib/prisma';
import { error, fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from '../../../../.svelte-kit/types/src/routes/project/$types';
import { installationFormSchema, projectFormSchema, versionFormSchema } from './schema';

export async function load({ params }) {
	const { code } = params;
	const project = await prisma.project.findUnique({
		where: {
			code: code
		},
		include: {
			versions: {
				include: {
					features: true,
					installations: {
						include: {
							customer: true
						}
					}
				}
			}
		}
	});

	const customers = await prisma.customer.findMany();

	if (!project) {
		// Throw an error with a custom status and message
		throw error(404, `Il progetto codice: '${code}' non esiste`);
	}

	const projectFormData = {
		id: project.id,
		code: project.code,
		name: project.name,
		status: project.status,
		description: project.description ?? '' // Convert null to empty string
	};

	const versionFormData = {
		projectId: project.id
	};

	return {
		project,
		versions: project.versions,
		versionForm: await superValidate(versionFormData, zod(versionFormSchema), { errors: false }),
		projectForm: await superValidate(projectFormData, zod(projectFormSchema)),
		installationForm: await superValidate(zod(installationFormSchema)),
		customers
	};
}

export const actions: Actions = {
	updateProject: async (event) => {
		const form = await superValidate(event, zod(projectFormSchema));
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
				console.log(project);
				throw redirect(303, `/project/${project.code}`);
			}
		}

		return {
			form
		};

	},

	deleteProject: async (event) => {
		const form = await superValidate(event, zod(projectFormSchema));

		await prisma.project.delete({
			where: {
				id: form.data.id
			}
		});
		throw redirect(301, `/project`);
	},

	createVersion: async (event) => {
		const form = await superValidate(event, zod(versionFormSchema));
		console.log('form: ', form);
		try {
			await prisma.version.create({ data: { ...form.data, id: undefined } });
		} catch (err) {
			console.log(err);
			setError(form, 'name', 'nome già esistente');
			// Make sure to return the form with the error
			return fail(400, { form });
		}

		return {
			form
		};
	},

	deleteInstallation: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		try {
			await prisma.installation.delete({ where: { id: id ?? null } });
		} catch {
			return fail(400);
		}
	},

	saveInstallation: async (event: RequestEvent) => {
		// console.log('EVENT DATA BEING ANALYZED:', await event.request.formData());
		const form = await superValidate(event, zod(installationFormSchema));
		if(!form.data.id) {
			try {
				await prisma.installation.create({ data: { ...form.data, id: undefined } });
			} catch (err) {
				console.log(err);
				// Make sure to return the form with the error
				return fail(400, { form });
			}
		}else{
			try {
				await prisma.installation.update({
					data: { ...form.data, id: undefined},
					where: { id: form.data.id }
				});
			} catch (err) {
				console.log(err);
				// Make sure to return the form with the error
				return fail(400, { form });
			}
		}

		return {
			form
		};
	},
};
