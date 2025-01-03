<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';

	import type { Feature, Project, Requirement, Scenario, Version } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { RequirementDialog, RequirementItem, ScenarioDialog } from './index.js';
	import { setContext } from 'svelte';
	import { Pencil } from 'lucide-svelte';
	import type { ScenarioFormData } from './schema';

	type FeatureWithDetails = Feature & {
		requirements: (Requirement & { scenarios: Scenario[] })[],
		version: Version & { project: Project }
	};

	let { data } = $props<{
		data: {
			feature: FeatureWithDetails,
			requirementForm: any,
			scenarioForm: any
		}
	}>();

	let openRequirementDialog = $state(false);
	let openScenarioDialog = $state(false);

	const sidePanelStore = $state<{
		scenario: ScenarioFormData | undefined
	}>(
		{
			scenario: undefined,
		}
	);
	setContext('sidePanelStore', sidePanelStore);

	let feature: FeatureWithDetails = $derived<typeof data.feature>(data.feature);

	// Now the effect will trigger when either scenarioId or allScenarios changes
	const  currentScenario = $derived(feature.requirements.flatMap(req => req.scenarios).find((scenario)=> scenario.id===sidePanelStore.scenario?.id));

	const editScenarioFormId = $derived(`edit-scenario-form-${sidePanelStore.scenario?.id ?? ''}`);

</script>
<RequirementDialog
	bind:open={openRequirementDialog}
	propFormData={data.requirementForm.data}
	formId={`new-requirement-form-${feature.id}`}
/>

<ScenarioDialog
	bind:open={openScenarioDialog}
	propFormData={sidePanelStore.scenario??{}}
	formId={editScenarioFormId}
/>

<Resizable.PaneGroup
	direction="horizontal"
	class="min-h-[200px] w-full rounded-lg"
>
	<Resizable.Pane defaultSize={70}>
		<div class="p-5">
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
			<ul class="flex flex-col gap-2 py-5">
				{#each feature.requirements as requirement }
					<li>
						<RequirementItem {requirement} requirementForm={data.requirementForm}
														 scenarioForm={data.scenarioForm.data} />
					</li>
				{/each}
			</ul>
		</div>
	</Resizable.Pane>
	<Resizable.Handle />
	<Resizable.Pane defaultSize={30}>
		<div class="h-full p-4">
			<div class="h-full p-4 rounded-md border">
				{#if !currentScenario}
					<div class="flex h-full items-center justify-center ">
						<span class="text-sm opacity-80">Seleziona uno scenario</span>
					</div>
				{:else }
					<div class="flex flex-row w-full items-stretch">
						<h2 class="font-bold flex-1">
							{currentScenario.name}
						</h2>
						<Button size="icon" variant="outline" class=""
										onclick={(e)=>{
						openScenarioDialog=true
					}}>
							<Pencil></Pencil>
						</Button>
					</div>

				{/if}
			</div>
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>
