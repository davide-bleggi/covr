<script lang="ts">
	import type { Project, Version } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { PencilIcon, Plus, Download, HandIcon, BotIcon } from 'lucide-svelte';
	import { ProjectDialog } from '../index';
	import type { PageData } from './$types.js';
	import { VersionDialog, VersionItem } from './index';
	import { Progress } from '$lib/components/ui/progress';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { VersionGraph } from '../version-graph';
	import { onMount } from 'svelte';
	import { cn } from 'tailwind-variants';
	import { FormField } from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { type Infer, superForm } from 'sveltekit-superforms';
	import { featureFormSchema, type FeatureFormSchema, searchFormSchema, type SearchFormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { SmartSearch } from '$lib/components/smart-search/index';
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let { data } = $props();
	let openProjectDialog = $state(false);
	let openVersionDialog = $state(false);
	let versions = $state(data.versions);

	const versionNodes = $derived(data.versions.map(v => ({ id: v.name, prev: v.prevVersion?.name ?? null })));

	let selectedVersion: string | null = $state(null);

	async function downloadTests(testType: string) {
		return fetch(`/api/download/${testType}?from=project&code=${data.project.code}`, {
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
				a.download = `${testType==='automaticTests'?'automatic-tests-project':'manual-tests-project'}-${data.project.code}`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			})
			.catch(error => {
				console.error('Error downloading file:', error);
			});
	}
</script>
<ProjectDialog bind:open={openProjectDialog} formToValidate={data.projectForm}>
</ProjectDialog>
<VersionDialog bind:open={openVersionDialog}
							 formToValidate={data.versionForm}
							 versions={data.versions}
							 formId="new-version-form"
>
</VersionDialog>

<Resizable.PaneGroup
	direction="horizontal"
	class="min-h-[200px] h-full w-full rounded-lg flex-1 flex flex-col"
>
	<Resizable.Pane class="flex flex-col" defaultSize={70} minSize={30}>
		{selectedVersion}
		<div class="flex h-full w-full flex-col">
			<div class="flex flex-row justify-between w-full p-4 h-fit items-center gap-4">
				<div class="flex flex-1 justify-between">
					<h1 class="font-bold text-lg">
						{data.project.name.toUpperCase()}
					</h1>
					<div class="flex flex-col">
						<span class="opacity-70 text-sm">Copertura features</span>
						<div class="flex flex-row w-[200px] items-center gap-2">
							<Progress value={data.project.coverage} class="h-2" />
							<span>{data.project.coverage}%</span>
						</div>
					</div>
				</div>
				<Button variant="outline" class="" onclick={()=>openProjectDialog=true}>
					<PencilIcon />
				</Button>
				<Tooltip.Provider>
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

			<div class="flex flex-col flex-1 h-0 min-h-0 px-4 w-full  mx-auto gap-2">
				<SmartSearch let:T={Version}
										 bind:items={data.versions}
										 bind:filteredItems={versions}
										 searchApiString="?/searchVersion" />
				<Button class="p-4 w-full" variant="outline" onclick={()=>openVersionDialog=true}>
					Aggiungi Versione
				</Button>
				<div class="flex-1 flex h-0 min-h-0  mb-2 w-full">
					<ScrollArea class="w-full overflow-auto">
						<ul class="w-full relative">
							{#each versions as version}
								<li class={cn(`w-full `)}>
									<VersionItem {version} customers={data.customers} versionForm={data.versionForm}
															 versions={data.versions}></VersionItem>
								</li>
							{/each}
						</ul>
					</ScrollArea>
				</div>
			</div>


		</div>
	</Resizable.Pane>
	<Resizable.Handle />
	<Resizable.Pane defaultSize={30} minSize={30}>
		{#key JSON.stringify(versionNodes)}
			<VersionGraph {versionNodes}></VersionGraph>
		{/key}
	</Resizable.Pane>
</Resizable.PaneGroup>
