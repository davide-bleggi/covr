<script lang="ts">
	import { Calendar, Pencil, Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index';
	import { InstallationDialog } from './index';
	import * as Accordion from '$lib/components/ui/accordion/index';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { InstallationFormSchema } from './schema';
	import type { Version } from '@prisma/client';
	import { format } from 'date-fns';

	let { version, customers, installationForm }: {
		version: Version,
		customers: Customer[],
		installationForm: SuperValidated<Infer<InstallationFormSchema>>
	} = $props();

	let openInstallationDialog = $state(false);
	let localInstallationForm = $state<typeof installationForm>(structuredClone(installationForm));
	localInstallationForm.data.versionId = version.id;

</script>

<InstallationDialog
	bind:open={openInstallationDialog}
	bind:formToValidate={localInstallationForm}
	customers={customers}
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
								openInstallationDialog=true}
							}>
					<Plus></Plus>
				</Button>
			</div>

			<Accordion.Content>
				{#each version.installations as installation}
					<div class="flex flex-row w-full gap-4 justify-between items-center">
						<div class="flex items-center gap-2">
							<Button size="icon" variant="outline" onclick={()=>{

								openInstallationDialog=true
							}}>
								<Pencil></Pencil>
							</Button>
							{installation.customer.name}
						</div>
						<div class="flex flex-row items-center gap-2 opacity-50">
							<Calendar></Calendar>
							{format(installation.installationDate, 'yyyy-MM-dd')}
						</div>
					</div>
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
