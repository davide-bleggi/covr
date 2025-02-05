import { PrismaClient } from '@prisma/client';
import { type Handle, redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import prisma from '$lib/prisma';
import { WebSocketServer } from 'ws';
import { DATABASE_URL } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';

let wss: WebSocketServer;

const SECRET = process.env.JWT_SECRET || 'mysecret';

// INIT WEBSOCKET (non serve all'hook vero e proprio è solo un posto neutrale dove poter inizializzare la websocket)
function initWss() {
	if (!wss) {
		let lastChecked = new Date();
		try {
			wss = new WebSocketServer({ port: 8080 });

			wss.on('connection', (ws) => {
				console.log('Client connected');

				// Send a message to the client when connected
				ws.send(JSON.stringify({ message: 'Connected to WebSocket server!' }));

				// Notify the client of a database update
				setInterval(async () => {
					// ws.send(JSON.stringify({ update: true }));
					const changes = await prisma.automaticTest.findMany({
						where: {
							executionDate: {
								gt: lastChecked
							}
						}
					});

					if (changes.length > 0) {
						ws.send('change deteced');
					}

				}, 30000); // Replace with real DB notification
			});
		}catch(err){
			console.log(err)
		}
	}
}

initWss();

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
			event.locals.user = undefined;
		}
	}

	return resolve(event);
};
