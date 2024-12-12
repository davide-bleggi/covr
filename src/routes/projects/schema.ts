import { z } from "zod";
import { ProjectStatusOptions } from '$lib/db/types';

export const formSchema = z.object({
    name: z.string().min(2).max(50),
    code: z.string().min(2).max(6),
    description: z.string().min(2),
    status: z.enum([...ProjectStatusOptions.map(item=>item.value)] as [string, ...string[]]),
});

export type FormSchema = typeof formSchema;
