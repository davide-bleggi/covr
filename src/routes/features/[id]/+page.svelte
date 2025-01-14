<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import * as Pagination from '$lib/components/ui/pagination/index.js';

	import type {
		Feature,
		ManualTest,
		Project,
		Requirement,
		Scenario,
		Version,
		User,
		AutomaticTest
	} from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { ManualTestDialog, RequirementDialog, RequirementItem, ScenarioDialog } from './index';
	import { setContext } from 'svelte';
	import { Pencil, Plus } from 'lucide-svelte';
	import { type ScenarioFormData, testStatusLabels } from './schema';
	import SuperDebug from 'sveltekit-superforms';
	import { format } from 'date-fns';
	import { AutomaticTestDialog, AutomaticTestItem, ManualTestSection, ScenarioDetails } from './sidebar';

	type FeatureWithDetails = Feature & {
		requirements: (Requirement & {
			scenarios: (Scenario & (ManualTest & { owner: User } & { automaticTests: AutomaticTest[] }))[]
		})[],
		version: Version & { project: Project }
	};

	let { data } = $props<{
		data: {
			feature: FeatureWithDetails,
			requirementForm: any,
			scenarioForm: any,
			manualTestFOrm: any,
			users: User[],
			pagination: {
				page: number,
				total: number
			}
		}
	}>();

	let openRequirementDialog = $state(false);
	let openManualTestDialog = $state(false);
	let openAutomaticTestDialog = $state(false);

	const sidePanelStore = $state<{
		scenario: ScenarioFormData & { manualTest?: ManualTest } & { automaticTests: AutomaticTest[] } | undefined
		users: User[]
	}>(
		{
			scenario: undefined,
			users: data.users
		}
	);
	setContext('sidePanelStore', sidePanelStore);

	let feature: FeatureWithDetails = $derived<typeof data.feature>(data.feature);

	// Now the effect will trigger when either scenarioId or allScenarios changes
	const currentScenario: ScenarioFormData & {
		manualTest: (ManualTest & { owner: User }),
		automaticTests: (AutomaticTest & { scenarios: Scenario[] })[],
	} | undefined = $derived.by(() => {
		const requirements = feature.requirements;
		const scenarioId = sidePanelStore.scenario?.id;
		const foundScenario = requirements.flatMap(req => req.scenarios).find(scenario => scenario.id === scenarioId);
		return foundScenario ? { ...foundScenario, scenario: JSON.parse(foundScenario.scenario) } : undefined;
	});

</script>
<RequirementDialog
	bind:open={openRequirementDialog}
	propFormData={data.requirementForm.data}
	formId={`new-requirement-form-${feature.id}`}
/>

<ManualTestDialog
	bind:open={openManualTestDialog}
	propFormData={{...data.manualTestForm.data, scenarioId: currentScenario?.id}}
/>

<AutomaticTestDialog
	bind:open={openAutomaticTestDialog}
	propFormData={{...data.automaticTestForm.data, scenarioIds: [currentScenario?.id]}}
/>


<Resizable.PaneGroup
	direction="horizontal"
	class="min-h-[200px] w-full rounded-lg flex-1 flex flex-col"
>
	<Resizable.Pane defaultSize={70}>
		<div class="p-5 flex flex-col h-full overflow-hidden">
			<div class="flex flex-row">
				<div class="flex flex-col w-full ">
					<h4>{feature.version.project.name.toUpperCase()} - {feature.version.name}</h4>
					<h1 class="text-2xl font-bold">{feature.name}</h1>
					<span class="opacity-80">{feature.description}</span>
				</div>
				<div class=" flex flex-1 items-center">
					<Button onclick={()=>openRequirementDialog = true}>
						Crea Requisito
					</Button>
				</div>
			</div>
			<ul class="flex h-full flex-col gap-2 py-5 overflow-y-auto">
				{#each feature.requirements as requirement }
					<li>
						<RequirementItem {requirement} requirementForm={data.requirementForm}
														 scenarioForm={data.scenarioForm.data} />
					</li>
				{/each}
			</ul>

			<Pagination.Root count={data.pagination.total} perPage={5}>
				{#snippet children({ pages, currentPage })}
					<Pagination.Content>
						<Pagination.Item>
							<a href={`?page=${currentPage}`}>
								<Pagination.PrevButton />
							</a>
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === "ellipsis"}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item isVisible={currentPage === page.value}>
									<a href={`?page=${page.value}`}>
										<Pagination.Link {page} isActive={currentPage === page.value}
										>
											{page.value}
										</Pagination.Link>
									</a>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<a href={`?page=${currentPage}`}>
								<Pagination.NextButton />
							</a>
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>

		</div>
	</Resizable.Pane>
	<Resizable.Handle />
	<Resizable.Pane defaultSize={30}>
		<div class="h-full p-4 ">
			<div class="h-full p-4 rounded-md border overflow-y-auto">
				{#if !currentScenario}
					<div class="flex h-full items-center justify-center ">
						<span class="text-sm opacity-80">Seleziona uno scenario</span>
					</div>
				{:else }
					<ScenarioDetails {currentScenario} />
					<div class="px-4">
						<h2 class="font-bold py-4">Test Manuale</h2>
						{#if !currentScenario.manualTest}
							<div class="flex flex-row justify-between items-center w-full">
								<span>Nessun test manuale</span>
								<Button size="icon" variant="outline" class=""
												onclick={(e)=>{
																			openManualTestDialog=true
																	}}>
									<Pencil></Pencil>
								</Button>

							</div>
						{:else}
							<ManualTestSection manualTest={currentScenario.manualTest} />
						{/if}
					</div>
					<div class="px-4">
						<div class="flex flex-row justify-center items-center py-4">
							<h2 class="font-bold flex-1">Test Automatici</h2>
							<Button size="icon" variant="outline" class=""
											onclick={(e)=>{
																				openAutomaticTestDialog=true
																		}}>
								<Plus></Plus>
							</Button>
						</div>
						{#if !(currentScenario.automaticTests.length > 0)}
							<span>Nessun test automatico presente per lo scenario corrente</span>
						{:else}
							<ul class="flex flex-col gap-3">
								{#each currentScenario.automaticTests as test}
									<li>
										<AutomaticTestItem automaticTest={test} />
										<!--						<SuperDebug data={test}></SuperDebug>-->
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/if}
			</div>
		</div>
		<!--					<div class="flex flex-row w-full items-stretch">-->
		<!--						<h2 class="font-bold flex-1">-->
		<!--							{currentScenario.name}-->
		<!--						</h2>-->
		<!--						<Button size="icon" variant="outline" class=""-->
		<!--										onclick={(e)=>{-->
		<!--						openScenarioDialog=true-->
		<!--					}}>-->
		<!--							<Pencil></Pencil>-->
		<!--						</Button>-->
		<!--					</div>-->
		<!--					<div class="flex flex-col gap-2 py-4">-->
		<!--						<div class="w-full p-4 rounded bg-gray-100">-->
		<!--							<h2 class="font-bold text-sm opacity-50">GIVEN</h2>-->
		<!--							{currentScenario.scenario?.given}-->
		<!--						</div>-->
		<!--						<div class="w-full p-4 rounded bg-gray-100">-->
		<!--							<h2 class="font-bold text-sm opacity-50">WHEN</h2>-->
		<!--							{currentScenario.scenario?.when}-->
		<!--						</div>-->
		<!--						<div class="w-full p-4 rounded bg-gray-100">-->
		<!--							<h2 class="font-bold text-sm opacity-50">THEN</h2>-->
		<!--							{currentScenario.scenario?.then}-->
		<!--						</div>-->
		<!--					</div>-->
		<!--					<h2 class="font-bold pb-2">Test manuale</h2>-->

		<!--					{#if !(currentScenario && currentScenario.manualTest)}-->
		<!--						<div class="flex flex-row justify-between items-center w-full">-->
		<!--							<span>Nessun test manuale</span>-->
		<!--							<Button size="icon" variant="outline" class=""-->
		<!--											onclick={(e)=>{-->
		<!--													openNewManualTestDialog=true-->
		<!--											}}>-->
		<!--								<Pencil></Pencil>-->
		<!--							</Button>-->

		<!--						</div>-->

		<!--					{:else if (currentScenario)}-->

		<!--						<div class={`rounded ${colorClasses[currentScenario.manualTest.status].bg} p-4`}>-->
		<!--						<div class="flex flex-row items-stretch">-->
		<!--							<div class="flex flex-col flex-1">-->
		<!--								<span class="text-sm opacity-60">Assegnatario</span>-->
		<!--								{currentScenario.manualTest.owner.name}-->
		<!--							</div>-->
		<!--							<div class="flex flex-col flex-1">-->
		<!--								<span class="text-sm opacity-60">Data</span>-->
		<!--								{format(currentScenario.manualTest.executionDate, 'dd/MM/yyyy')}-->
		<!--							</div>-->
		<!--							<div class={`flex flex-col text-lg font-bold flex-1 h-full items-center justify-center-->
		<!--								${colorClasses[currentScenario.manualTest.status].text}`-->
		<!--							}>-->
		<!--								<span class="">-->
		<!--								{testStatusLabels.find((item)=>item.value===currentScenario?.manualTest.status).label}-->
		<!--									</span>-->
		<!--							</div>-->
		<!--							<Button size="icon" variant="outline" class=""-->
		<!--											onclick={(e)=>{-->
		<!--													openEditManualTestDialog=true-->
		<!--											}}>-->
		<!--								<Pencil></Pencil>-->
		<!--							</Button>-->
		<!--						</div>-->
		<!--							<div class="flex flex-col flex-1">-->
		<!--								<span class="text-sm opacity-60">Note</span>-->
		<!--								{currentScenario.manualTest.notes}-->
		<!--							</div>-->
		<!--						</div>-->

		<!--					{/if}-->
		<!--					<h2 class="font-bold py-4">Test automatici</h2>-->
		<!--					{#if currentScenario.automaticTests.length > 0}-->

		<!--						{:else}-->
		<!--							<span>Nessun test automatico abbinato</span>-->
		<!--					{/if}-->
		<!--					<SuperDebug data={currentScenario} />-->
		<!--				{/if}-->
		<!--			</div>-->
		<!--		</div>-->
	</Resizable.Pane>
</Resizable.PaneGroup>
