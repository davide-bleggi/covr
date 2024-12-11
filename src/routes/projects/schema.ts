import { z } from "zod";
import { ProjectStatus } from '$lib/db/types';
import { projectStatusOptions } from '$lib/db/enums';

export const formSchema = z.object({
    name: z.string().min(2).max(50),
    code: z.string().min(2).max(6),
    description: z.string().min(2),
    status: z.enum([...projectStatusOptions.map(item=>item.value)] as [string, ...string[]]),
});

export type FormSchema = typeof formSchema;
