import { PrismaClient } from '@prisma/client';
import { type Handle, redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import prisma from '$lib/prisma';

const SECRET = process.env.JWT_SECRET || 'mysecret';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('hook handle');
	// Attempt to read the JWT from cookies
	const jwtCookie = event.cookies.get('jwt');
	console.log('jwt: ', jwtCookie);

	if (jwtCookie) {
		try {
			// Decode token
			const { userId, email, name } = jwt.verify(jwtCookie, SECRET) as { userId: string, email: string, name: string };

			event.locals.user = {
				id: Number(userId),
				email,
				name
			};
			console.log('user saved');
		} catch (e) {
			event.locals.user = undefined
		}
	}

	return resolve(event);
};
