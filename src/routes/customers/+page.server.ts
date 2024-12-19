import prisma from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { customerFormSchema } from './schema';
import type { PageServerLoad, Actions } from './$types';
import type { Customer } from '@prisma/client';

export const load: PageServerLoad = async () => {
	try {
		const [customerForm, customers] = await Promise.all([
			superValidate(zod(customerFormSchema), { errors: false }),
			prisma.customer.findMany(),
		]);

		return {
			customerForm,
			customers
		};
	} catch (err) {
		console.error('Load error:', err);
		throw error(500, 'Failed to load customers');
	}
};

export const actions: Actions = {
	createCustomer: async (event) => {
		const form = await superValidate(event, zod(customerFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { id, ...customerData } = form.data;
			const customer = await prisma.customer.create({
				data: customerData
			});

			// Return the created customer for client-side updates
			return { form, customer };
		} catch (err) {
			console.error('Create error:', err);
			return setError(form, 'name', 'Nome già esistente');
		}
	},
	updateCustomer: async (event) => {
		const form = await superValidate(event, zod(customerFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { id, ...customerData } = form.data;
			const customer = await prisma.customer.update({
				where:
					{ id },
				data: customerData
			});

			// Return the created customer for client-side updates
			return { form, customer };
		} catch (err) {
			console.error('Create error:', err);
			return setError(form, 'name', 'Nome già esistente');
		}
	},

	deleteCustomer: async (event) => {
		const form = await superValidate(event, zod(customerFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { id, ...customerData } = form.data;
			const customer = await prisma.customer.delete({
				where:
					{ id },
			});

			// Return the created customer for client-side updates
			return { form, customer };
		} catch (err) {
			console.error('Create error:', err);
			return setError(form, 'name', 'Nome già esistente');
		}
	}
};
