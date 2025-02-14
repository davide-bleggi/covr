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
	import { marked } from 'marked';
	import { Progress } from '$lib/components/ui/progress';

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
			<span class="opacity-70 text-sm">Copertura scenari</span>
			<div class="flex flex-row w-[200px] items-center gap-2">
				<Progress value={requirement.coverage} class="h-2" />
				<span>{requirement.coverage}%</span>
			</div>
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
		<span class="markdown">{@html marked(requirement.description ?? '')}</span>
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
									sidePanelStore.scenario = {...scenario}
									console.log(	sidePanelStore.scenario)
								}}
													 class={cn(`cursor-pointer ${sidePanelStore.scenario?.id === scenario?.id?'bg-secondary/50':""}`)}>
									<Table.Cell>SCN-{scenario.id}</Table.Cell>
									<Table.Cell>{scenario.name}</Table.Cell>
									<Table.Cell class="flex"><span class={cn(`border rounded-md p-2 w-full flex justify-center font-semibold
										${scenario.testStatus==='PASS'?"border-green-500 text-green-500":scenario.testStatus==='FAIL'?"border-red-500 text-red-500":'border-none'}`)}>{scenario.testStatus}</span>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
