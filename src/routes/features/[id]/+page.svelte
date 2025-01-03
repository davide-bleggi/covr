<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';

	import type { Feature, Project, Requirement, Scenario, Version } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { RequirementDialog, RequirementItem } from './index.js';
	import type { RequirementFormSchema } from './schema';
	import SuperDebug, { type SuperValidated } from 'sveltekit-superforms';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

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

	const selectedScenario = writable(undefined);
	setContext('sidePanelStore', selectedScenario);

	let feature: FeatureWithDetails = $derived<typeof data.feature>(data.feature);
</script>
<RequirementDialog
	bind:open={openRequirementDialog}
	propFormData={data.requirementForm.data}
	formId={`new-requirement-form-${feature.id}`}
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
		<div class="p-2 h-full">
			<div class="flex h-full items-center justify-center p-6 rounded-md border">
				{#if !$selectedScenario}
					<span class="text-sm opacity-80">Seleziona uno scenario</span>
				{:else }
					<SuperDebug data={$selectedScenario} />
				{/if}
			</div>
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>
