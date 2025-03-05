import prisma from '$lib/prisma';

export async function logActivity(userId: number|undefined, action: string, details?: object ) {
	console.log('activity logging')
	if (userId) {
		debugger
		try {
			await prisma.activity.create({ data: { userId, action, details: JSON.stringify(details) } });
		} catch (err) {
			console.error(err);
		}
	}
}
