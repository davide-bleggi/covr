import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import * as sea from 'node:sea';

export const GET: RequestHandler = async ({ url }) => {
	const scenarioId = url.searchParams.get('scenarioId') || '';
	const limit = 5;
	try {
		// Example: fetch from your database
		console.log('searching for scenario: ', scenarioId);
		const activityLog = await prisma.activity.findMany({
			where: {
				OR: [
					{
						AND: [
							{ action: { contains: 'MANUALTEST' } },
							{
								details: {
									contains: `"scenarioId":${scenarioId}`
								}
							}
						]
					},
					{
						AND: [
							{ action: { contains: 'AUTOMATICTEST' } },
							{
								OR: [
									{
										details: {
											contains: `"scenarioIds":[[]${scenarioId}`
										}
									},
									{
										details: {
											contains: `,${scenarioId},`
										}
									},
									{
										details: {
											contains: `${scenarioId}[]]`
										}
									}
								]

							}
						]
					},
					{
						AND: [
							{ action: { contains: 'SCENARIO' } },
							{
								details: {
									contains: `"id":${scenarioId}`
								}
							}
						]
					},
				]
			},
			orderBy: {
				createdAt: 'desc'
			},
			select: {
				user: {
					select:{
						name: true
					}
				},
				createdAt: true,
				action: true,
			},
			take: Number(limit)
		});
		console.log(activityLog);
		return json(activityLog.map((activity)=>({...activity, userName: activity.user.name })));
	} catch (error) {
		return new Response('Failed to fetch activityLogs', { status: 500 });
	}
};
