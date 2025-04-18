<script lang="ts">
	import { ArrowLeft, Calendar, Pencil, Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index';
	import { FeatureDialog, FeatureItem, InstallationDialog, InstallationItem, VersionDialog } from './index';
	import * as Accordion from '$lib/components/ui/accordion/index';
	import SuperDebug, { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { InstallationFormSchema, VersionFormSchema } from './schema';
	import { type Customer, type Feature, type Installation, Prisma, type Project, type Version } from '@prisma/client';


	let { version, customers, versionForm, versions }: {
		version: Version & { installations: (Installation & { customer: Customer })[] } & { features: Feature[] } & {
			project: Project
		} & { prevVersion: Version },
		customers: Customer[],
		versionForm: SuperValidated<Infer<VersionFormSchema>>,
		versions: Version[]
	} = $props();

	let openInstallationDialog = $state(false);
	let openFeatureDialog = $state(false);
	let openVersionDialog = $state(false);

	let installationForm = { versionId: version.id };
	let featureForm = { versionId: version.id };

	let openItems: string[] = $state([version.features?.length > 0 ? 'features' : '', version.installations?.length > 0 ? 'installations' : '']);

	function scrollToSection(anchor: string) {
		document.getElementById(anchor).scrollIntoView({ behavior: 'smooth' });
	}
</script>

<InstallationDialog
	bind:open={openInstallationDialog}
	formToValidate={installationForm}
	customers={customers}
	formId={`new-installation-form-${version.id}`}
>
</InstallationDialog>

<FeatureDialog
	bind:open={openFeatureDialog}
	propFormData={featureForm}
	version={version}>
</FeatureDialog>

<VersionDialog
	bind:open={openVersionDialog}
	formToValidate={versionForm}
	formId={`edit-version-form-${version.id}`}
	versions={versions}>
</VersionDialog>

<div id={version.name} class="w-full gap-2 items-center justify-between p-5  border-b">
	<div class="flex flex-row items-center gap-2 sticky bg-background z-20 w-full py-2 top-0">
		<div class="flex flex-row justify-between w-full">
			<div class="flex flex-row items-center gap-2 ">
				<h4 class="text-xl font-bold">{version.name}</h4>
				{#if version.prevVersion}
					<Button variant="outline" onclick={()=>scrollToSection(version.prevVersion.name)}>
						<div class="flex flex-row items-center gap-2">
							<ArrowLeft />
							{version.prevVersion.name}
						</div>
					</Button>
				{/if}
			</div>
			<Button variant="outline" size="icon" onclick={()=>{
				versionForm = {
						name: version.name,
						prevVersion: version.prevVersion?.id,
						id: version.id.toString(),
						projectId: version.projectId,
					};
								openVersionDialog=true}
							}>
				<Pencil></Pencil>
			</Button>
		</div>

	</div>

	<Accordion.Root class="w-full" bind:value={openItems}>
		<Accordion.Item value="installations" class="w-full">
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
				{#if version.installations?.length === 0 }
					<Button
						class="w-full"
						variant="outline"
						size="icon" onclick={()=>{
					console.log(installationForm)
								openInstallationDialog=true}
							}>
						<Plus />
						Aggiungi installazione
					</Button>
				{/if}
				<ul class="gap-2 flex flex-col">
					{#each version.installations as installation}
						<li>
							<InstallationItem {installationForm} {installation} {customers}></InstallationItem>
						</li>
					{/each}
				</ul>
			</Accordion.Content>
		</Accordion.Item>

		<Accordion.Item value="features">
			<div class="flex flex-row w-full justify-between items-center gap-2">
				<div class="flex flex-grow w-full">
					<Accordion.Trigger class="flex border-b-0">Features</Accordion.Trigger>
				</div>
				<Button variant="outline" size="icon" onclick={()=>{
								openFeatureDialog=true}
							}>
					<Plus></Plus>
				</Button>
			</div>
			<Accordion.Content>
				{#if version.features.length === 0 }
					<Button
						class="w-full"
						variant="outline"
						size="icon" onclick={()=>{
					console.log(installationForm)
								openFeatureDialog=true}
							}>
						<Plus />
						Aggiungi Feature
					</Button>
				{/if}
				<ul class="gap-2 flex flex-col">
					{#each version.features as feature}
						<li>
							<FeatureItem {feature}></FeatureItem>
						</li>
					{/each}
				</ul>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
