import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import * as sea from 'node:sea';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const versionId = url.searchParams.get('versionId') || '';

	const limit = url.searchParams.get('limit') || '100';

	try {
		// Example: fetch from your database
		console.log('searching for versions: ', search);
		const versions = await prisma.version.findMany({
			where: {
				AND: [
					{
						name: {
							contains: search
						}
					},
					{
						id: {
							equals: Number(versionId)
						}
					}
				]
			},
			select: {
				name: true,
				id: true
			},
			take: Number(limit)
		});

		return json(versions.map(({ name, id }) => ({ label: name, value: id })));
	} catch (error) {
		return new Response('Failed to fetch versions', { status: 500 });
	}
};
