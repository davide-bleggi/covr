import type { RequestHandler } from '../../../../../.svelte-kit/types/src/routes/api/activityLog/$types';
import prisma from '$lib/prisma';
import { format } from 'date-fns';

export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code') || '';
	const from = url.searchParams.get('from') || '';
	let searchQuery = {};

	if (from === 'project') {
		searchQuery = {
			scenario: {
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
	} else if (from === 'feature') {
		searchQuery = {
			scenario: {
				requirement: {
					feature: {
						id: Number(code)
					}
				}
			}
		};
	}

	try {
		const tests = await prisma.manualTest.findMany({
			where: searchQuery,
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

		const headers = ['Test Id', 'Status', 'Note', 'Data di esecuzione', 'Dati di test', 'Scenario', 'Requirement', 'Feature', 'Version'];
		const csvRows = [
			headers.join(','),
			...tests.map(test => [
				test.id,
				`"${test.status}"`,
				`"${test.notes?.replace(/"/g, '""') || ''}"`,  // Escape quotes and wrap in quotes
				`"${format(test.executionDate, 'yyyy-MM-dd')}"`,
				`"${test.testData?.replace(/"/g, '""') || ''}"`,  // Escape quotes and wrap in quotes
				`"${test.scenario.name.replace(/"/g, '""')}"`,
				`"${test.scenario.requirement.name.replace(/"/g, '""')}"`,
				`"${test.scenario.requirement.feature.name.replace(/"/g, '""')}"`,
				`"${test.scenario.requirement.feature.version.name.replace(/"/g, '""')}"`
			].join(','))
		];
		const csvContent = csvRows.join('\n');

		return new Response(csvContent, {
			status: 200,
			headers: {
				'Content-Type': 'text/csv',
				'Content-Disposition': `attachment; filename="manual-tests-${code}.csv"`
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
