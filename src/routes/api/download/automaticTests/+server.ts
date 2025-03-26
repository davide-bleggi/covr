import type { RequestHandler } from '../../../../../.svelte-kit/types/src/routes/api/activityLog/$types';
import prisma from '$lib/prisma';
import { format } from 'date-fns';

export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code') || '';
	const from = url.searchParams.get('from') || '';
	let searchQuery = {};
	if(from === 'project'){
		searchQuery = {
			scenarios: {
				some: {
					requirement: {
						feature: {
							version: {
								project: {
									code: code
								}
							}
						}
					}
				}
			}
		}
	} else if (from === 'feature'){
		searchQuery = {
			scenarios: {
				some: {
					requirement: {
						feature: {
							id: Number(code)
						}
					}
				}
			}
		}
	}

	try {
		const tests = await prisma.automaticTest.findMany({
			where: searchQuery,
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
				`"${test.name.replace(/"/g, '""')}"`,
				`"${test.status.replace(/"/g, '""')}"`,
				`"${format(test.executionDate, 'yyyy-MM-dd')}"`,
				`"${(test.notes || '').replace(/"/g, '""')}"`,
				`"${(test.errorLog || '').replace(/"/g, '""')}"`,
				`"${test.scenarios.map(s => s.name.replace(/"/g, '""')).join(';')}"`,
				`"${test.scenarios.map(s => s.requirement.name.replace(/"/g, '""')).join(';')}"`,
				`"${test.scenarios.map(s => s.requirement.feature.name.replace(/"/g, '""')).join(';')}"`,
				`"${test.scenarios.map(s => s.requirement.feature.version.name.replace(/"/g, '""')).join(';')}"`,
			].join(','))
		];
		const csvContent = csvRows.join('\n');

		return new Response(csvContent, {
			status: 200,
			headers: {
				'Content-Type': 'text/csv',
				'Content-Disposition': `attachment; filename="automatic-tests-${code}.csv"`
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
