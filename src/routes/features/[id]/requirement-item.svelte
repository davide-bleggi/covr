<script lang="ts">
	import type { Requirement, Scenario } from '@prisma/client';
	import { Pencil, Plus } from 'lucide-svelte';
	import { InstallationItem } from '../../project/[code]';
	import { Button } from '$lib/components/ui/button';
	import * as Accordion from '$lib/components/ui/accordion/index';
	import { priorityLabels, statusLabels } from './schema.js';
	import { AccordionTrigger } from '$lib/components/ui/accordion/index.js';
	import { RequirementDialog } from './index';

	let { requirement = $bindable(), requirementForm  }: {
		requirementForm: any,
		requirement: (Requirement & { scenarios: Scenario[] })
	} = $props();

	let openScenarios = $state(requirement.scenarios.length > 0 ? ['scenarios'] : undefined);

	let currentRequirementStatus = $derived(statusLabels.find((item)=>requirement.status === item.value))
	let currentRequirementPriority = $derived(priorityLabels.find((item)=>requirement.priority === item.value))

	let openRequirementDialog = $state(false)
</script>

<RequirementDialog
	bind:open={openRequirementDialog}
	bind:propFormData={requirementForm}
	formId={`edit-requirement-form-${requirement.id}`}
/>

<div class="border rounded-lg p-4 shadow-sm">
	<div class="flex flex-row items-stretch w-full gap-3">
		<div class="flex flex-col">
			<span class="opacity-70 text-sm">ID Requisito</span>
			<span>REQ-{requirement.id}</span>
		</div>
		<div class="flex flex-col flex-1">
			<span class="opacity-70 text-sm">Nome requisito</span>
			<span>{requirement.name}</span>
		</div>
		<div class="flex flex-col">
			<span class="opacity-70 text-sm">Copertura</span>
			<span>---</span>
		</div>
		<div class="flex flex-col">
			<span class="opacity-70 text-sm">Stato</span>
			<span class={`bg-${currentRequirementStatus?.color??''} rounded-sm px-2 text-white`}>
				{currentRequirementStatus?.label}
			</span>
		</div>
		<div class="flex flex-col">
			<span class="opacity-70 text-sm">Priorità</span>
			<span>{currentRequirementPriority?.label}</span>
		</div>
		<div class="flex items-center">
			<Button size="icon" variant="outline" class="h-full"
							onclick={(e)=>{
						requirementForm = {...requirement}
						openRequirementDialog=true
					}}>
				<Pencil></Pencil>
			</Button>
		</div>
	</div>

	<Accordion.Root class="w-full" bind:value={openScenarios}>
		<Accordion.Item value="scenarios" class="w-full">
			<div class="flex flex-row w-full justify-between items-center gap-2">
				<div class="flex flex-grow w-full">
					<Accordion.Trigger class="flex border-b-0">Scenari</Accordion.Trigger>
				</div>
				<Button variant="outline" size="icon" onclick={()=>{}}>
					<Plus></Plus>
				</Button>
			</div>

			<Accordion.Content>
				<ul class="gap-2 flex flex-col">
					{#each requirement.scenarios as scenario}
						<li>
							{scenario.name}
						</li>
					{/each}
				</ul>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>

