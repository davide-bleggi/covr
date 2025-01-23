import { z } from 'zod';

export const loginFormSchema = z.object({
	password: z.string().min(8),
	email: z.string().min(4)
});

export type LoginFormSchema = typeof loginFormSchema;
