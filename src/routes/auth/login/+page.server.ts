import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/customers/$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginFormSchema } from './schema';
import { customerFormSchema } from '../../customers/schema';


const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'mysecret';

export const load = async (req: Request, res: Response) => {
	const loginForm = await superValidate(zod(loginFormSchema), { errors: false })

	return {loginForm}
}


export const actions = {
	login: async (event) => {
		console.log('validating access')
		const form = await superValidate(event, zod(loginFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// 1. Find the user by email
		const user = await prisma.user.findUnique({ where: { email: form.data.email } });
		if (!user) {
			form.errors._errors = ['user not found']
			return fail(400, { form });
		}

		// 2. Compare passwords
		// const valid = await bcrypt.compare(password, user.password);
		const valid = form.data.password === user.password;

		if (!valid) {
			form.errors._errors = ['password not correct']
			return fail(400, { form });
		}

		// 3. Create a JWT and set it in a cookie
		const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: '1h' });
		event.cookies.set('jwt', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: false // set true in production
		});

		return { form };
	}
};
