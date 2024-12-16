import { z } from "zod";
import { ProjectStatusOptions } from '$lib/db/types';

export const formSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2).max(50),
    code: z.string().min(2).max(9).toUpperCase(),
    description: z.string().min(2),
    status: z.enum([...ProjectStatusOptions.map(item=>item.value)] as [string, ...string[]]),
});

export type FormSchema = typeof formSchema;
