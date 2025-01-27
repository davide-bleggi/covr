import { PrismaClient } from '@prisma/client';
import { type Handle, redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import prisma from '$lib/prisma';
import { WebSocketServer } from 'ws';

let wss: WebSocketServer;

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

	if (!wss) {
		wss = new WebSocketServer({ port: 8080 });

		wss.on('connection', (ws) => {
			console.log('Client connected');

			// Send a message to the client when connected
			ws.send(JSON.stringify({ message: 'Connected to WebSocket server!' }));

			// Handle messages from the client
			ws.on('message', (message) => {
				console.log('Received:', message);
			});

			// Notify the client of a database update
			setInterval(() => {
				// ws.send(JSON.stringify({ update: true }));

			}, 10000); // Replace with real DB notification
		});
	}

	return resolve(event);
};
