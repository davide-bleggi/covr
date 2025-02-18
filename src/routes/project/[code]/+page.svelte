<script lang="ts">
	import type { Project } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { PencilIcon, Plus } from 'lucide-svelte';
	import { ProjectDialog } from '../index';
	import type { PageData } from './$types.js';
	import { VersionDialog, VersionItem } from './index';
	import { Progress } from '$lib/components/ui/progress';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { VersionGraph } from '../version-graph';
	import { onMount } from 'svelte';
	import { cn } from 'tailwind-variants';


	let { data } = $props();
	let openProjectDialog = $state(false);
	let openVersionDialog = $state(false);

	const versionNodes = $derived(data.versions.map(v=>({id:v.name, prev: v.prevVersion?.name??null})))

	let selectedVersion : string|null = $state(null)

</script>
<ProjectDialog bind:open={openProjectDialog} form={data.projectForm}>
</ProjectDialog>
<VersionDialog bind:open={openVersionDialog} formToValidate={data.versionForm} versions={data.versions}>
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
			</div>

			<div class="flex flex-col flex-1 h-0 min-h-0 px-4 w-full max-w-[700px] mx-auto gap-2">
				<Button class="p-4 w-full" variant="outline" onclick={()=>openVersionDialog=true}>
					Aggiungi Versione
				</Button>
				<div class="flex-1 flex h-0 min-h-0  mb-2 w-full">
					<ScrollArea class="w-full overflow-auto">
						<ul class="w-full relative">
							{#each data.versions as version}
								<li class={cn(`w-full `)}>
									<VersionItem {version} customers={data.customers}></VersionItem>
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
		<VersionGraph {versionNodes} ></VersionGraph>
	</Resizable.Pane>
</Resizable.PaneGroup>
