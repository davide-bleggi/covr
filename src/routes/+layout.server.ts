import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	if (!locals.user && url.pathname !== '/auth/login') {
		console.log('not logged in user')
		throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
	}
};
