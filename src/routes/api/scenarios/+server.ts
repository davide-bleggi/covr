import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import * as sea from 'node:sea';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') || '';

	try {
		// Example: fetch from your database
		console.log('searching for scenarios: ', search);

		const scenarios = await prisma.scenario.findMany({
			where: {
				OR: search && !isNaN(Number(search)) ? [
					{
						name: {
							contains: search
						}
					},
					{
						id: {
							equals: Number(search)
						}
					}
				] : [
					{
						name: {
							contains: search
						}
					}
				]
			},
			select: {
				name: true,
				id: true
			}
		});

		console.log(scenarios);

		return json(scenarios.map(({ name, id }) => ({ label: name, value: id })));
	} catch (error) {
		return new Response('Failed to fetch frameworks', { status: 500 });
	}
};
