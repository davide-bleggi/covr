import { z } from 'zod';

export const customerFormSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(2).max(50),
});

export type CustomerFormSchema = typeof customerFormSchema;
