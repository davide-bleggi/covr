import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import * as sea from 'node:sea';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const limit = url.searchParams.get('limit') || '100';


	try {
		// Example: fetch from your database
		console.log('searching for projects: ', search )
		const projects = await prisma.project.findMany({
			where: {
				name: {
					contains: search,
				}
			},
			select: {
				name: true,
				id: true
			},
			take: Number(limit)
		});

		console.log(projects);

		return json(projects.map(({name, id})=>({label: name, value: id })));
	} catch (error) {
		return new Response('Failed to fetch projects', { status: 500 });
	}
};
