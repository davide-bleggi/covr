<script lang="ts">
	import type { Requirement, Scenario } from '@prisma/client';
	import { Pencil, Plus } from 'lucide-svelte';
	import { InstallationItem } from '../../project/[code]';
	import { Button } from '$lib/components/ui/button';
	import * as Accordion from '$lib/components/ui/accordion/index';
	import { priorityLabels, requirementStatusLabels } from './schema.js';
	import { RequirementDialog } from './index';
	import { ScenarioDialog } from './index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { getContext } from 'svelte';
	import { cn } from '$lib/utils';

	const sidePanelStore: any = getContext('sidePanelStore');

	let { requirement = $bindable(), requirementForm, scenarioForm }: {
		requirementForm: any,
		scenarioForm: any,
		requirement: (Requirement & { scenarios: Scenario[] })
	} = $props();

	let openScenarios = $derived(requirement.scenarios.length > 0 ? ['scenarios'] : ['']);

	let currentRequirementStatus = $derived(requirementStatusLabels.find((item) => requirement.status === item.value));
	let currentRequirementPriority = $derived(priorityLabels.find((item) => requirement.priority === item.value));

	let openRequirementDialog = $state(false);
	let openScenarioDialog = $state(false);

	let newScenarioForm = $state({ ...scenarioForm, requirementId: requirement.id });

</script>

<RequirementDialog
	bind:open={openRequirementDialog}
	bind:propFormData={requirementForm}
	formId={`edit-requirement-form-${requirement.id}`}
/>
<ScenarioDialog
	bind:open={openScenarioDialog}
	propFormData={newScenarioForm} />

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
			<span>{requirement.coverage}%</span>
		</div>
		<div class="flex flex-col">
			<span class="opacity-70 text-sm">Stato</span>
			<span class={`${currentRequirementStatus?.color??''} rounded-sm px-2 text-white`}>
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
	<div class="flex flex-col py-2">
		<span class="opacity-70 text-sm">Descrizione</span>
		<span>{requirement.description}</span>
	</div>
	<Accordion.Root class="w-full" value={openScenarios}>
		<Accordion.Item value="scenarios" class="w-full">
			<div class="flex flex-row w-full justify-between items-center gap-2">
				<div class="flex flex-grow w-full">
					<Accordion.Trigger class="flex border-b-0">Scenari</Accordion.Trigger>
				</div>
				<Button variant="outline" size="icon" onclick={()=>{
					openScenarioDialog=true
				}}>
					<Plus></Plus>
				</Button>
			</div>

			<Accordion.Content>
				<div class="border rounded-lg">
					<Table.Root>
						<!--					<Table.Caption>A list of your recent invoices.</Table.Caption>-->
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-[110px]">ID Scenario</Table.Head>
								<Table.Head class="">Nome scenario</Table.Head>
								<Table.Head class="w-[110px]">Covered</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each requirement.scenarios as scenario}
								<Table.Row on:click={()=>{
									console.log(scenario)
									sidePanelStore.scenario = {...scenario, scenario: JSON.parse(scenario.scenario)}
									console.log(	sidePanelStore.scenario)
								}}
													 class={`cursor-pointer ${sidePanelStore.scenario.id === scenario.id?'bg-gray-100':""}`}>
									<Table.Cell>SCN-{scenario.id}</Table.Cell>
									<Table.Cell>{scenario.name}</Table.Cell>
									<Table.Cell>{scenario.testStatus}</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
