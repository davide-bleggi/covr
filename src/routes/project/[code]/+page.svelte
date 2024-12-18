<script lang="ts">
	import type { Project } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { PencilIcon, Plus } from 'lucide-svelte';
	import { ProjectDialog } from '../index';
	import type { PageData } from './$types.js';
	import { VersionDialog } from './index';
	import * as Accordion from '$lib/components/ui/accordion/index';

	export let data: PageData;
	let openProjectDialog = false;
	let openVersionDialog = false;

</script>
<ProjectDialog bind:open={openProjectDialog} form={data.projectForm}>
</ProjectDialog>
<VersionDialog bind:open={openVersionDialog} form={data.versionForm}>
</VersionDialog>

<div class="flex w-full flex-col">
	<div class="flex flex-row justify-between w-full p-4  h-fit items-center">
		<div class="flex flex-row items-center gap-4">
			<Button variant="outline" class="p-2" on:click={()=>openProjectDialog=true}>
				<PencilIcon size={16} />
			</Button>
			<h1 class="font-bold text-lg">
				{data.project.name.toUpperCase()}
			</h1>
		</div>
		<div>
			<Button class="p-4" on:click={()=>openVersionDialog=true}>
				Aggiungi Versione
			</Button>
		</div>
	</div>
	<div class="flex flex-col w-full justify-center items-center">
		{#each data.versions as version}
			<div class="w-full max-w-[700px] p-4">
				<h4 class="text-xl font-bold w-full">{version.name}</h4>
				<Accordion.Root class="w-full">
					<Accordion.Item value="installation">
						<div class="flex flex-row w-full justify-between items-center">
							<div class="flex flex-grow w-full">
							<Accordion.Trigger class="w-full">Installazioni</Accordion.Trigger>
							</div>
							<Button variant="outline" size="icon">
								<Plus></Plus>
							</Button>
						</div>
						<Accordion.Content>
							{#each version.installations as installation}
								{installation.customer.name}
							{/each}
						</Accordion.Content>
					</Accordion.Item>

					<Accordion.Item value="feature">
						<Accordion.Trigger>Features</Accordion.Trigger>
						<Accordion.Content>
							{#each version.features as feature}
								{feature.name}
							{/each}
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			</div>
		{/each}
	</div>
</div>
