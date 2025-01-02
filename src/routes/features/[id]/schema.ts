import { z } from 'zod';

export const priorityLabels = [{
	value: 'HIGH',
	label: 'Alta'
},
	{
		value: 'MID',
		label: 'Media'
	},
	{
		value: 'LOW',
		label: 'Bassa'
	}
] as const;


export const statusLabels = [{
	value: 'WIP',
	label: 'WIP'
},
	{
		value: 'TODO',
		label: 'Da fare'
	},
	{
		value: 'DONE',
		label: 'Fatto'
	}
] as const;

export const requirementFormSchema = z.object({
	featureId: z.number(),
	id: z.number().optional(),
	name: z.string().min(2).max(100),
	description: z.string().min(2).max(500).optional(),
	priority: z.enum([priorityLabels[0].value, priorityLabels[1].value,priorityLabels[2].value]),
	status: z.enum([statusLabels[0].value, statusLabels[1].value, statusLabels[2].value])
});


export type RequirementFormSchema = typeof requirementFormSchema;
