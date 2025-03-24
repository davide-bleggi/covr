import type { RequestHandler } from '../../../../../.svelte-kit/types/src/routes/api/activityLog/$types';
import prisma from '$lib/prisma';
import { format } from 'date-fns';

export const GET: RequestHandler = async ({ url }) => {
	const projectCode = url.searchParams.get('projectCode') || '';
	try {
		const tests = await prisma.automaticTest.findMany({
			where: {
				scenarios: {
					some: {
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
				}
			},
			include: {
				scenarios: {
					include: {
						requirement:{
							include: {
								feature:{
									include:{
										version: true
									}
								}
							}
						}
					}
				}
			}
		});

		const headers = ['Test Name', 'Status', 'Execution Date', 'Notes', 'Error Log', 'Scenario', 'Requirement', 'Feature', 'Version'];
		const csvRows = [
			headers.join(','),
			...tests.map(test => [
				`"${test.name}"`,
				`"${test.status}"`,
				`"${format(test.executionDate,  'yyyy-MM-dd')}"`,
				`"${test.notes || ''}"`,
				`"${test.errorLog || ''}"`,
				`"${test.scenarios.map(s => s.name).join(';')}"`,
				`"${test.scenarios.map(s => s.requirement.name).join(';')}"`,
				`"${test.scenarios.map(s => s.requirement.feature.name).join(';')}"`,
				`"${test.scenarios.map(s => s.requirement.feature.version.name).join(';')}"`,
			].join(','))
		];
		const csvContent = csvRows.join('\n');

		return new Response(csvContent, {
			status: 200,
			headers: {
				'Content-Type': 'text/csv',
				'Content-Disposition': `attachment; filename="automatic-tests-${projectCode}.csv"`
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
