<script lang="ts">
	import type { Project } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { PencilIcon, Plus } from 'lucide-svelte';
	import { ProjectDialog } from '../index';
	import type { PageData } from './$types.js';
	import { VersionDialog, VersionItem } from './index';
	import { tick } from 'svelte';

	let { data } = $props();
	let openProjectDialog = $state(false);
	let openVersionDialog = $state(false);

</script>
<ProjectDialog bind:open={openProjectDialog} form={data.projectForm}>
</ProjectDialog>
<VersionDialog bind:open={openVersionDialog} formToValidate={data.versionForm}>
</VersionDialog>

<div class="flex w-full flex-col">
	<div class="flex flex-row justify-between w-full p-4  h-fit items-center">
		<div class="flex flex-row items-center gap-4">
			<Button variant="outline" class="p-2" onclick={()=>openProjectDialog=true}>
				<PencilIcon size={16} />
			</Button>
			<h1 class="font-bold text-lg">
				{data.project.name.toUpperCase()}
			</h1>
		</div>
		<div>
			<Button class="p-4" onclick={()=>openVersionDialog=true}>
				Aggiungi Versione
			</Button>
		</div>
	</div>
	<div class="flex flex-col w-full justify-center items-center">
		{#each data.versions as version}
			<VersionItem {version} customers={data.customers} ></VersionItem>
		{/each}
	</div>
</div>
