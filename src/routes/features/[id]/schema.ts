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


export const requirementStatusLabels = [{
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

export const testStatusLabels = [
	{
		value: 'PASS',
		label: 'PASS',
	},
	{
		value: 'NOT_PASS',
		label: 'NOT PASS',
	},
	{
		value: 'TO_TEST',
		label: 'TO TEST'
	}
] as const;

export const requirementFormSchema = z.object({
	featureId: z.number(),
	id: z.number().optional(),
	name: z.string().min(2).max(100),
	description: z.string().max(500).optional(),
	priority: z.enum([priorityLabels[0].value, priorityLabels[1].value, priorityLabels[2].value]),
	status: z.enum([requirementStatusLabels[0].value, requirementStatusLabels[1].value, requirementStatusLabels[2].value])
});

export const scenarioFormSchema = z.object({
	requirementId: z.number(),
	id: z.number().optional(),
	name: z.string().min(2).max(100),
	scenario: z.object({
		given: z.string().max(1000).optional(),
		when: z.string().max(1000).optional(),
		then: z.string().max(1000).optional()
	})
});

export const manualTestFormSchema = z.object({
	scenarioId: z.number(),
	id: z.number().optional(),
	ownerId: z.number(),
	executionDate: z.date(),
	status: z.enum([testStatusLabels[0].value, testStatusLabels[1].value, testStatusLabels[2].value]),
	notes: z.string().max(5000).optional()
});

export type ManualTestFormSchema = typeof manualTestFormSchema

export type RequirementFormSchema = typeof requirementFormSchema;
export type ScenarioFormSchema = typeof scenarioFormSchema;
export type ScenarioFormData = z.infer<typeof scenarioFormSchema>;
