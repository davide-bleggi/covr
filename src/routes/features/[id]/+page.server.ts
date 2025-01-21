import prisma from '$lib/prisma';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { automaticTestFormSchema, manualTestFormSchema, requirementFormSchema, scenarioFormSchema } from './schema';
import { type Actions, error, fail, type RequestEvent } from '@sveltejs/kit';
import { featureFormSchema } from '../../project/[code]/schema';

export async function load({ params, url }) {

	const { id } = params;
	const page = Number(url.searchParams.get('page') || '1');
	const limit = 5;
	const skip = (page - 1) * limit;

	const feature = await prisma.feature.findUnique({
		where: {
			id: Number(id)
		},
		include: {
			version: {
				include: {
					project: true
				}
			},
			requirements: {
				skip,
				take: limit,
				include: {
					scenarios: {
						include: {
							automaticTests: {
								include: {
									scenarios: true
								}
							},
							manualTest: {
								include: {
									owner: true
								}
							}
						}
					}
				}
			}
		}
	});

	const totalRequirements = await prisma.requirement.count({
		where: {
			featureId: Number(id)
		}
	});

	const users = await prisma.user.findMany();

	if (!feature) {
		// Throw an error with a custom status and message
		throw error(404, `La feature: '${id}' non esiste`);
	}

	const requirementFormData = {
		featureId: feature.id
	};

	return {
		requirementForm: await superValidate(requirementFormData, zod(requirementFormSchema), { errors: false }),
		scenarioForm: await superValidate(zod(scenarioFormSchema), { errors: false }),
		manualTestForm: await superValidate(zod(manualTestFormSchema), { errors: false }),
		automaticTestForm: await superValidate(zod(automaticTestFormSchema), { errors: false }),
		featureForm:await superValidate(feature, zod(featureFormSchema), { errors: false }),
		feature: feature,
		users,
		pagination: {
			page,
			total: totalRequirements
		}
	};
}
export const actions: Actions = {
	saveFeature: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(featureFormSchema));
		if(!form.data.id) {
			try {
				await prisma.feature.create({ data: { ...form.data, id: undefined } });
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
				await prisma.feature.update({
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

	deleteFeature: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		try {
			await prisma.feature.delete({ where: { id: id ?? null } });
		} catch {
			return fail(400);
		}
	},

	saveRequirement: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(requirementFormSchema));
		if (!form.data.id) {
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
		} else {
			try {
				await prisma.requirement.update({
					data: { ...form.data, id: undefined },
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
		console.log('key to delete: ', id);
		try {
			await prisma.requirement.delete({ where: { id: id ?? null } });
		} catch (error) {
			console.log(error);
			return fail(400);
		}
	},
	saveScenario: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(scenarioFormSchema));
		if (!form.data.id) {
			try {
				await prisma.scenario.create({
					data: {
						requirementId: form.data.requirementId,
						name: form.data.name,
						scenario: form.data.scenario,
						id: undefined
					}
				});
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
				await prisma.scenario.update({
					data: {
						requirementId: form.data.requirementId,
						name: form.data.name,
						scenario: form.data.scenario,
						id: undefined
					},
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
			form,
			actionType: 'create'
		};
	},
	deleteScenario: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(scenarioFormSchema));
		try {
			await prisma.scenario.delete({ where: { id: form.data.id ?? null } });
		} catch (error) {
			console.log(error);
			return fail(400, { form });
		}

		return { form, actionType: 'delete' };
	},

	saveManualTest: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(manualTestFormSchema));

		if (!form.data.id) {
			console.log('Making new manual test');
			try {
				await prisma.manualTest.create({
					data: {
						...form.data,
						id: undefined
					}
				});
			} catch (err: any) {
				console.log(err);
				return fail(400, { form });
			}
		} else {
			try {
				await prisma.manualTest.update({
					data: {
						...form.data,
						id: undefined
					},
					where: { id: form.data.id }
				});
			} catch (err: any) {
				console.log(err);
				return fail(400, { form });
			}
		}

		return {
			form,
			actionType: 'create'
		};
	},
	deleteManualTest: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(manualTestFormSchema));
		try {
			await prisma.manualTest.delete({ where: { id: form.data.id ?? null } });
		} catch (error) {
			console.log(error);
			return fail(400, { form });
		}

		return { form, actionType: 'delete' };
	},

	saveAutomaticTest: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(automaticTestFormSchema));

		if (!form.data.id) {
			try {
				console.log(form.data)
				await prisma.automaticTest.create({
					data: {
						...form.data,
						id: undefined,
						scenarios: {
							connect: form.data.scenarioIds.map((id) => ({ id })),
						},
						scenarioIds: undefined
					}
				});
			} catch (err: any) {
				console.log(err);
				return fail(400, { form });
			}
		} else {
			try {
				console.log("Trying to update automaticTest: ", form.data )
				await prisma.automaticTest.update({
					data: {
						...form.data,
						id: undefined,
						scenarios: {
							set: form.data.scenarioIds.map((id) => ({ id })),
						},
						scenarioIds: undefined
					},
					where: { id: form.data.id }
				});
			} catch (err: any) {
				console.log(err);
				return fail(400, { form });
			}
		}

		return {
			form,
			actionType: 'create'
		};
	},
	deleteAutomaticTest: async (event: RequestEvent) => {
		const form = await superValidate(event, zod(automaticTestFormSchema));
		try {
			await prisma.automaticTest.delete({ where: { id: form.data.id ?? null } });
		} catch (error) {
			console.log(error);
			return fail(400, { form });
		}

		return { form, actionType: 'delete' };
	}
};

