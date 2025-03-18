import prisma from '$lib/prisma';
import { error, fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from '../../../../.svelte-kit/types/src/routes/project/$types';
import {
	featureFormSchema,
	installationFormSchema,
	projectFormSchema,
	searchFormSchema,
	versionFormSchema
} from './schema';
import { logActivity } from '$lib/dbUtils';

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
					},
					prevVersion: {
						include: true
					},
					project: true
				},
				orderBy: {
					createdAt: 'desc'
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
		featureForm: await superValidate(zod(featureFormSchema)),
		customers
	};
}

export const actions: Actions = {
	saveProject: async (event) => {
		const form = await superValidate(event, zod(projectFormSchema));
		console.log('saving Project');
		if (!form.data.id) {
			try {
				await prisma.project.create({
					data: {
						...form.data,
						id: undefined
					}
				});
				logActivity(event.locals.user?.id, 'CREATE PROJECT', form.data);
			} catch (err: any) {
				console.error(err);
				if (err.code === 'P2002') {
					return setError(form, 'name', 'nome già utilizzato');
				}
				// Make sure to return the form with the error
				return fail(400, { form });
			}
		} else {
			try {
				await prisma.project.update({
					data: {
						...form.data,
						id: undefined
					},
					where: { id: form.data.id }
				});
				logActivity(event.locals.user?.id, 'UPDATE PROJECT', form.data);
			} catch (err: any) {
				console.log(err.code);
				if (err.code === 'P2002') {
					return setError(form, 'name', 'nome già assegnato');
				}
				console.error(err);
				// Make sure to return the form with the error
				return fail(400, { form });
			}
		}

		return {
			form
		};

	},

	deleteProject: async (event) => {
		const form = await superValidate(event, zod(projectFormSchema));
		logActivity(event.locals.user?.id, 'DELETE PROJECT', form.data);
		await prisma.project.delete({
			where: {
				id: form.data.id
			}
		});
		throw redirect(301, `/project`);
	},

	saveVersion: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(versionFormSchema));
		console.log('Testing saveVersion');
		if (!form.data.id) {
			try {
				await prisma.version.create({
					data: {
						...form.data,
						id: undefined,
						prevVersionId: form.data.prevVersion ? Number(form.data.prevVersion) : null,
						prevVersion: undefined // explicitly remove it
					}
				});
				logActivity(event.locals.user?.id, 'CRETE VERSION', form.data);
			} catch (err: any) {
				console.log(err);
				if (err.code === 'P2002') {
					return setError(form, 'name', 'nome già utilizzato');
				}
				// Make sure to return the form with the error
				return fail(400, { form });
			}
		} else {
			try {
				await prisma.version.update({
					data: {
						...form.data,
						id: undefined,
						prevVersionId: form.data.prevVersion ? Number(form.data.prevVersion) : null,
						prevVersion: undefined // explicitly remove it
					},
					where: { id: form.data.id }
				});
				logActivity(event.locals.user?.id, 'UPDATE VERSION', form.data);
			} catch (err: any) {
				console.log(err.code);
				if (err.code === 'P2002') {
					return setError(form, 'name', 'nome già assegnato');
				}
				// Make sure to return the form with the error
				return fail(400, { form });
			}
		}

		return {
			form
		};
	},

	deleteVersion: async (event) => {
		const id = Number((await event.request.formData()).get('id'));

		try {
			// 1. Find all versions that reference this version as prevVersion
			const referencingVersions = await prisma.version.findMany({
				where: { prevVersionId: id }
			});

			// 2. Update those versions to set prevVersionId to null
			if (referencingVersions.length > 0) {
				await prisma.version.updateMany({
					where: { prevVersionId: id },
					data: { prevVersionId: null }
				});
			}
			await prisma.version.delete({ where: { id: id ?? null } });
			logActivity(event.locals.user?.id, 'DELETE VERSION', { id });
		} catch (err) {
			console.error(err);
			return fail(400);
		}
	},


	saveInstallation: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(installationFormSchema));
		if (!form.data.id) {
			try {
				await prisma.installation.create({ data: { ...form.data, id: undefined } });
				logActivity(event.locals.user?.id, 'CREATE INSTALLATION', form.data);
			} catch (err: any) {
				console.log(err);
				if (err.code === 'P2002') {
					return setError(form, 'customerId', 'cliente già assegnato');
				}
				// Make sure to return the form with the error
				return fail(400, { form });
			}
		} else {
			try {
				await prisma.installation.update({
					data: { ...form.data, id: undefined },
					where: { id: form.data.id }
				});
				logActivity(event.locals.user?.id, 'UPDATE INSTALLATION', form.data);
			} catch (err: any) {
				console.log(err.code);
				if (err.code === 'P2002') {
					return setError(form, 'customerId', 'cliente già assegnato');
				}
				// Make sure to return the form with the error
				return fail(400, { form });
			}
		}

		return {
			form
		};
	},

	deleteInstallation: async (event) => {
		const id = Number((await event.request.formData()).get('id'));
		try {
			await prisma.installation.delete({ where: { id: id ?? null } });
			logActivity(event.locals.user?.id, 'DELETE INSTALLATION', { id });
		} catch {
			return fail(400);
		}
	},

	saveFeature: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(featureFormSchema));
		if (!form.data.id) {
			try {
				await prisma.feature.create({ data: { ...form.data, id: undefined } });
				logActivity(event.locals.user?.id, 'CREATE FEATURE', form.data);
			} catch (err: any) {
				console.log(err);
				// Make sure to return the form with the error
				if (err.code === 'P2002') {
					return setError(form, 'name', 'nome già in uso');
				}
				return fail(400, { form });
			}
		} else {
			try {
				await prisma.feature.update({
					data: { ...form.data, id: undefined },
					where: { id: form.data.id }
				});
				logActivity(event.locals.user?.id, 'UPDATE FEATURE', form.data);
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

	deleteFeature: async (event) => {
		const id = Number((await event.request.formData()).get('id'));
		try {
			await prisma.feature.delete({ where: { id: id ?? null } });
			logActivity(event.locals.user?.id, 'DELETE FEATURE', { id });
		} catch {
			return fail(400);
		}
	},

	searchVersion: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(searchFormSchema));
		const searchValue = form.data.searchValue;
		const { code } = event.params;

		try {
			const versions = await prisma.version.findMany({
				where: {
					project: {
						code: code
					},
					OR: [
						{
							features: {
								some: {
									OR: [
										{ name: { contains: searchValue } },
										{ id: { equals: Number.parseInt(searchValue) ? Number.parseInt(searchValue) : 0 } },
										{
											requirements: {
												some: {
													OR: [
														{ name: { contains: searchValue } },
														{ id: { equals: Number.parseInt(searchValue) ? Number.parseInt(searchValue) : 0 } }]
												}
											}
										}
									]
								}
							}
						},
						{
							name: {
								contains: searchValue
							}
						},
						{
							installations: {
								some: {
									customer: {
										name: {
											contains: searchValue
										}
									}
								}
							}
						}
					]
				},
				include: {
					features: true,
					project: true,
					installations: {
						include: {
							customer: true
						}
					}
				},
				orderBy: {
					createdAt: 'desc'
				}
			});

			console.log('versions has been found: ', versions);
			return {
				form,
				items: versions
			};
		} catch (err) {
			console.error(err);
			return fail(400, { form });
		}
	}
};
