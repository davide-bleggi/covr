import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	if (!locals.user && url.pathname !== '/auth/login') {
		throw redirect(303, '/auth/login');
	}
};
