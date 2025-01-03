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
	label: 'WIP',
	color: 'yellow-500'
},
	{
		value: 'TODO',
		label: 'Da fare',
		color: 'gray-500'
	},
	{
		value: 'DONE',
		label: 'Fatto',
		color: 'red-500'
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

export const scenarioFormSchema = z.object({
	requirementId: z.number(),
	id: z.number().optional(),
	name: z.string().min(2).max(100),
	scenario:z.object({
		given:z.string().min(2).max(1000).optional(),
		when:z.string().min(2).max(1000).optional(),
		then:z.string().min(2).max(1000).optional(),
	}),
});


export type RequirementFormSchema = typeof requirementFormSchema;
export type ScenarioFormSchema = typeof scenarioFormSchema;
