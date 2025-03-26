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
		AutomaticTest, Activity
	} from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { ManualTestDialog, RequirementDialog, RequirementItem, ScenarioDialog } from './index';
	import { onMount, setContext } from 'svelte';
	import { BotIcon, Download, HandIcon, Pencil, Plus } from 'lucide-svelte';
	import { type ScenarioFormData, testStatusLabels } from './schema';
	import SuperDebug from 'sveltekit-superforms';
	import { format } from 'date-fns';
	import { AutomaticTestDialog, AutomaticTestItem, ManualTestSection, ScenarioDetails } from './sidebar';
	import { FeatureDialog } from '../../project/[code]';
	import { marked } from 'marked';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { Progress } from '$lib/components/ui/progress';
	import { toast } from 'svelte-sonner';
	import { SmartSearch } from '$lib/components/smart-search';
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	type FeatureWithDetails = Feature & {
		requirements: (Requirement & {
			scenarios: (Scenario & (ManualTest & { owner: User } & { automaticTests: AutomaticTest[] }))[]
		})[],
		version: Version & { project: Project },
	};

	let { data } = $props<{
		data: {
			feature: FeatureWithDetails,
			requirementForm: any,
			scenarioForm: any,
			manualTestForm: any,
			featureForm: any,
			users: User[],
			pagination: {
				page: number,
				total: number
			}
		},
	}>();

	let openRequirementDialog = $state(false);
	let openManualTestDialog = $state(false);
	let openAutomaticTestDialog = $state(false);
	let openFeatureDialog = $state(false);
	let requirements = $state([]);

	const sidePanelStore = $state<{
		scenario: ScenarioFormData & { manualTest?: ManualTest } & { automaticTests: AutomaticTest[] } | undefined
		users: User[],
		activities?: { userName: string, action: string, createdAt: Date }[]
	}>(
		{
			scenario: undefined,
			users: data.users
		}
	);
	setContext('sidePanelStore', sidePanelStore);

	let feature: FeatureWithDetails = $derived<typeof data.feature>(data.feature);

	async function loadActivityLogs(scenarioId: number) {
		try {
			if (scenarioId) {
				const response = await fetch(`/api/activityLog?scenarioId=${scenarioId}`);
				if (!response.ok) {
					throw new Error('Failed to fetch activity log');
				}
				const activityLog: {
					userName: string,
					action: string,
					createdAt: Date,
				}[] = await response?.json();
				sidePanelStore.activities = activityLog;

				console.log('Activity Log:', activityLog);
			}
		} catch (error) {

			console.error('Error fetching activity log:', error);
		}
	}

	$effect(() => {
		if (currentScenario?.id) {
			loadActivityLogs(currentScenario.id);
		}
	});


	// Now the effect will trigger when either scenarioId or allScenarios changes
	const currentScenario: ScenarioFormData & {
		manualTest: (ManualTest & { owner: User }),
		automaticTests: (AutomaticTest & { scenarios: Scenario[] })[],
	} | undefined = $derived.by(() => {
		const requirements = feature.requirements;
		const scenarioId = sidePanelStore.scenario?.id;
		const foundScenario = requirements.flatMap(req => req.scenarios).find(scenario => scenario.id === scenarioId);
		return foundScenario ? { ...foundScenario } : undefined;
	});


	// aggiornamento in tempo reale
	let socket: WebSocket;

	async function downloadTests(testType: string) {
		return fetch(`/api/download/${testType}?from=feature&code=${data.feature.id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.blob())
			.then(blob => {
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `${testType==='automaticTests'?'automatic-tests-feature':'manual-tests-feature'}-${data.feature.id}`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			})
			.catch(error => {
				console.error('Error downloading file:', error);
			});
	}

	onMount(() => {
		const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
		const hostname = window.location.hostname; // Gets the correct domain
		console.log(hostname);
		const socket = new WebSocket(`${protocol}://${hostname}:8080`);


		socket.onmessage = async (event) => {
			console.log('socket message: ', event);
			if (event.data === 'change detected') {
				toast.success('Aggiornamento Test', {
					description: 'Sono stati aggiornati i test'
				});
			}
			await invalidateAll();
		};

		return () => {
			socket.close();
		};
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

<FeatureDialog
	bind:open={openFeatureDialog}
	propFormData={{
		id: feature.id,
		name: feature.name,
		description: feature.description,
		versionId: feature.versionId
	}}
	version={feature.version}
>
</FeatureDialog>

<Resizable.PaneGroup
	direction="horizontal"
	class="min-h-[200px] w-full rounded-lg flex-1 flex flex-col"
>
	<Resizable.Pane defaultSize={70}>
		<div class="p-5 flex flex-col h-full overflow-hidden">
			<div class="w-full">
				<div class="flex flex-row">
					<div class="flex flex-col w-full ">
						<div class="w-full flex flex-row justify-between items-center">
							<div class="flex-1">
								<h4><a href={`/project/${feature.version.project.code}`}>
									<Button variant="outline">{feature.version.project.name.toUpperCase()}</Button>
								</a> - {feature.version.name}</h4>
							</div>
							<div class="px-2 flex flex-row items-center gap-4">
								<div>
									<span class="opacity-70 text-sm">Copertura requisiti</span>
									<div class="flex flex-row w-[200px] items-center gap-2">
										<Progress value={feature.coverage} class="h-2" />
										<span>{feature.coverage}%</span>
									</div>
								</div>
								<Button size="icon" variant="outline" class=""
												onclick={(e)=>{openFeatureDialog=true}}>
									<Pencil></Pencil>
								</Button>
								<Tooltip.Provider delayDuration="{0}">
									<Tooltip.Root>
										<Tooltip.Trigger>
											<DropdownMenu.Root>
												<DropdownMenu.Trigger>
													<Button variant="outline">
														<Download />
													</Button>
												</DropdownMenu.Trigger>
												<DropdownMenu.Content>
													<DropdownMenu.Item class="p-4 cursor-pointer" onclick={()=>{downloadTests('manualTests')}}><HandIcon/> Test Manuali</DropdownMenu.Item>
													<DropdownMenu.Item class="p-4 cursor-pointer" onclick={()=>{downloadTests('automaticTests')}}><BotIcon/>Test Automatici</DropdownMenu.Item>
												</DropdownMenu.Content>
											</DropdownMenu.Root>

										</Tooltip.Trigger>
										<Tooltip.Content>
											<p>Scarica tutti i test di progetto</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</Tooltip.Provider>
							</div>
						</div>
						<h1 class="text-2xl font-bold">{feature.name}</h1>
						<span class="opacity-80 markdown">{@html marked(feature.description)}</span>
					</div>
				</div>
				<div class=" flex flex-1 items-center w-full pt-3">
					<div class="flex flex-col w-full">
						<SmartSearch let:T={Requirement}
												 bind:items={data.feature.requirements}
												 bind:filteredItems={requirements}
												 searchApiString="?/searchRequirements" />
						<Button variant="outline" onclick={()=>openRequirementDialog = true} class="w-full">
							Crea Requisito
						</Button>
					</div>
				</div>
			</div>
			<ScrollArea class="h-full my-5">
				<ul class="flex  flex-col gap-2">
					{#each requirements as requirement }
						<li>
							<RequirementItem {requirement} requirementForm={data.requirementForm}
															 scenarioForm={data.scenarioForm.data} />
						</li>
					{/each}
				</ul>
			</ScrollArea>
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
			<ScrollArea class="h-full p-4 rounded-md border ">
				{#if !currentScenario}
					<div class="flex h-full items-center justify-center ">
						<span class="text-sm opacity-80">Seleziona uno scenario</span>
					</div>
				{:else }
					<ScenarioDetails {currentScenario} />
					<div class="px-0">
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
					<div class="px-0">
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
						<div class="p-2 bg-secondary/50 mt-2 rounded">
							<h5 class="font-bold my-2">Attività</h5>
							<ul class="flex flex-col gap-1 text-sm">
								{#if sidePanelStore.activities}
									{#each sidePanelStore.activities as activity}
										<li>{activity.userName} <span
											class="font-semibold">{activity.action}</span> {format(activity.createdAt, 'dd-MM-yyyy HH:mm')}
										</li>
									{/each}
								{/if}
							</ul>
						</div>
					</div>
				{/if}
			</ScrollArea>
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>
