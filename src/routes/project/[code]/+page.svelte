<script lang="ts">
	import type { Project } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { PencilIcon, Plus } from 'lucide-svelte';
	import { ProjectDialog } from '../index';
	import type { PageData } from './$types.js';
	import { VersionDialog, VersionItem } from './index';
	import { Progress } from '$lib/components/ui/progress';


	let { data } = $props();
	let openProjectDialog = $state(false);
	let openVersionDialog = $state(false);

</script>
<ProjectDialog bind:open={openProjectDialog} form={data.projectForm}>
</ProjectDialog>
<VersionDialog bind:open={openVersionDialog} formToValidate={data.versionForm} versions={data.versions}>
</VersionDialog>

<div class="flex w-full flex-col">
	<div class="flex flex-row justify-between w-full p-4  h-fit items-center gap-4">
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
	<div class="flex flex-col w-full max-w-[700px] mx-auto gap-2 justify-center items-center">
		<Button class="p-4 w-full" variant="outline" onclick={()=>openVersionDialog=true}>
			Aggiungi Versione
		</Button>
		{#each data.versions as version}
			<VersionItem {version} customers={data.customers}></VersionItem>
		{/each}
	</div>
</div>
