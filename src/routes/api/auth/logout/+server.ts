import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	console.log("logout")

	try {
		event.cookies.delete('jwt', {
			path: '/',
			httpOnly: true,
			secure: false // set true in production
		});
		return new Response('Logout successes', { status: 200 });
	}catch{
		return new Response('Logout failed', { status: 400 });
	}
}
