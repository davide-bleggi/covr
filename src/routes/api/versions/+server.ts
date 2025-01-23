import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import * as sea from 'node:sea';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const projectId = url.searchParams.get('projectId') || '';

	const limit = url.searchParams.get('limit') || '100';

	try {
		// Example: fetch from your database
		console.log(`searching for versions '${search}' with project id: ${projectId}` );
		const versions = await prisma.version.findMany({
			where: {
				AND: [
					{
						name: {
							contains: search
						}
					},
					{
						projectId: {
							equals: Number(projectId)
						}
					}
				]
			},
			select: {
				name: true,
				id: true,
				projectId: true
			},
			take: Number(limit)
		});

		console.log(versions)

		return json(versions.map(({ name, id }) => ({ label: name, value: id })));
	} catch (error) {
		return new Response('Failed to fetch versions', { status: 500 });
	}
};
