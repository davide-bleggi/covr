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
	saveCustomer: async (event) => {
		const form = await superValidate(event, zod(customerFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			let customer;
			if(!form.data.id) {
				 customer = await prisma.customer.create({
					data: form.data
				});
			}else{
				 customer = await prisma.customer.update({
					where:
						{ id: form.data.id },
					data: form.data
				});
			}

			// Return the created customer for client-side updates
			return { form, customer };
		} catch (err) {
			console.error('Create error:', err);
			return setError(form, 'name', 'Nome già esistente');
		}
	},

	deleteCustomer: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		try {
			 await prisma.customer.delete({
				where:
					{ id: Number(id) },
			});

			// Return the created customer for client-side updates
			return;
		} catch (err) {
			console.error('Delete error:', err);
		}
	}
};
