import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	console.log("logout")

	event.cookies.delete('jwt', {
		path: '/'
	});

	return new Response('Logout successed', { status: 200 });
}
