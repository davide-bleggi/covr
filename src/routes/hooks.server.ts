import { PrismaClient } from '@prisma/client';
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import prisma from '$lib/prisma';

const SECRET = process.env.JWT_SECRET || 'mysecret';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('hook handle')
	// Attempt to read the JWT from cookies
	const jwtCookie = event.cookies.get('jwt');
	console.log('jwt: ', jwtCookie);

	if (jwtCookie) {
		try {
			// Decode token
			const { userId } = jwt.verify(jwtCookie, SECRET) as { userId: string };

			// Fetch user from DB
			const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
			if (user) {
				event.locals.user = user;
			}
		} catch (e) {
			// Token invalid or expired; you can choose to clear the cookie, etc.
			event.cookies.delete('jwt', {
				path: '/'
			});
		}
	}

	return resolve(event);
};
