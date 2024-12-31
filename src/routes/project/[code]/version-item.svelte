<script lang="ts">
	import { Calendar, Pencil, Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index';
	import { InstallationDialog, InstallationItem } from './index';
	import * as Accordion from '$lib/components/ui/accordion/index';
	import SuperDebug, { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { InstallationFormSchema } from './schema';
	import { type Customer, type Feature, type Installation, Prisma, type Version } from '@prisma/client';
	import { format } from 'date-fns';


	let { version, customers }: {
		version: Version & { installations: (Installation & {customer: Customer})[] } & {features: Feature[]},
		customers: Customer[],
	} = $props();

	let openInstallationDialog = $state(false);
	let installationForm = {versionId: version.id};

</script>

<InstallationDialog
	bind:open={openInstallationDialog}
	formToValidate={installationForm}
	customers={customers}
	formId={`new-installation-form-${version.id}`}
>
</InstallationDialog>

<div class="w-full max-w-[700px] p-4">
	<h4 class="text-xl font-bold w-full">{version.name}</h4>
	<Accordion.Root class="w-full">
		<Accordion.Item value="installation" class="w-full">
			<div class="flex flex-row w-full justify-between items-center gap-2">
				<div class="flex flex-grow w-full">
					<Accordion.Trigger class="flex border-b-0">Installazioni</Accordion.Trigger>
				</div>
				<Button variant="outline" size="icon" onclick={()=>{
					console.log(installationForm)
								openInstallationDialog=true}
							}>
					<Plus></Plus>
				</Button>
			</div>

			<Accordion.Content>
				<ul class="gap-2 flex flex-col">
				{#each version.installations as installation}
					<li><InstallationItem {installationForm} {installation} {customers}></InstallationItem></li>
				{/each}
				</ul>
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
