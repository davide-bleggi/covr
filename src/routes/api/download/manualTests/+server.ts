import type { RequestHandler } from '../../../../../.svelte-kit/types/src/routes/api/activityLog/$types';
import prisma from '$lib/prisma';
import { format } from 'date-fns';

export const GET: RequestHandler = async ({ url }) => {
	const projectCode = url.searchParams.get('projectCode') || '';
	try {
		const tests = await prisma.manualTest.findMany({
			where: {
				scenario: {
					requirement: {
						feature: {
							version: {
								project: {
									code: projectCode
								}
							}
						}
					}
				}
			},
			include: {
				scenario: {
					include: {
						requirement: {
							include: {
								feature: {
									include: {
										version: true
									}
								}
							}
						}
					}
				}
			}
		});

		const headers = ['Test Id', 'Status', 'Note', 'Data di esecuzione', 'Dati di test' , 'Scenario', 'Requirement', 'Feature', 'Version'];
		const csvRows = [
			headers.join(','),
			...tests.map(test => [
				test.id,
				test.status,
				test.notes || '',
				`"${format(test.executionDate, 'yyyy-MM-dd')}"`,
				test.testData || '',
				test.scenario.name,
				test.scenario.requirement.name,
				test.scenario.requirement.feature.name,
				test.scenario.requirement.feature.version.name
			].join(','))
		];
		const csvContent = csvRows.join('\n');

		return new Response(csvContent, {
			status: 200,
			headers: {
				'Content-Type': 'text/csv',
				'Content-Disposition': `attachment; filename="manual-tests-${projectCode}.csv"`
			}
		});
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Failed to fetch tests' }), {
			status: 500,
			headers: {
				'Content-Type': 'text/csv'
			}
		});
	}
};
