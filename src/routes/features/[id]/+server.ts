import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET({ params, url }) {
	const id = params.id;
	const page = Number(url.searchParams.get('page')) || 1;
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

	return json({
		feature,
		pagination: {
			page,
			total: totalRequirements
		}
	});
}
