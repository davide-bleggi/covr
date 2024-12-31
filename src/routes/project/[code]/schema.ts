import { z } from "zod";
import { ProjectStatusOptions } from '$lib/types';

export const versionFormSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2).max(50),
    projectId: z.number()
});

export const projectFormSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2).max(50),
    code: z.string().min(2).max(9).toUpperCase(),
    description: z.string().min(2),
    status: z.enum([...ProjectStatusOptions.map(item=>item.value)] as [string, ...string[]]),
});

export const installationFormSchema = z.object({
    id: z.number().optional(),
    versionId: z.number().gt(0),
    customerId: z.number().gt(0, 'Selezionare un cliente'),
    installationDate: z.coerce.date({message: 'Selezionare una data valida'}),
});

export const featureFormSchema = z.object({
    id: z.number().optional(),
    versionId: z.number().gt(0),
    name: z.string().min(2).max(100),
    description: z.string().min(2).max(300).optional(),
});


export type InstallationFormSchema = typeof installationFormSchema;
export type FeatureFormSchema = typeof featureFormSchema;
export type ProjectFormSchema = typeof projectFormSchema;
export type VersionFormSchema = typeof versionFormSchema;

