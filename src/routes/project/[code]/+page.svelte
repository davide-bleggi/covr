<script lang="ts">
	import type { Project, Version } from '@prisma/client';
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
	import { FormField } from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import Search from 'lucide-svelte/icons/search';
	import { type Infer, superForm } from 'sveltekit-superforms';
	import { featureFormSchema, type FeatureFormSchema, searchFormSchema, type SearchFormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';


	let { data } = $props();
	let openProjectDialog = $state(false);
	let openVersionDialog = $state(false);
	let previousSearch = $state('');
	let previousVersions = $state([]);

	const versionNodes = $derived(data.versions.map(v => ({ id: v.name, prev: v.prevVersion?.name ?? null })));

	let selectedVersion: string | null = $state(null);
	let versions: Version[] = $state(data.versions);

	const searchForm = $state(superForm<Infer<SearchFormSchema>>({ searchValue: '' }, {
		validators: zodClient(searchFormSchema),
		applyAction: false, // Add this to prevent automatic page updates
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				console.log('Form submission failed:', result);
				versions = [];
			}

			if (result.type === 'success') {
				versions = result.data ? result.data.versions : [];
			}
		},
		onUpdate: ({ form }) => {
			$errors = form.errors;
		},
		resetForm: false
	}));

	const { form: formData, enhance, errors, formId, submit } = searchForm;

	let tempSearch: string;

	const debouncedSubmit = debounce(() => {
		submit();
		tempSearch = $formData.searchValue;
	}, 3000);

	function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
		let timer: NodeJS.Timeout;
		return function(this: any, ...args: Parameters<T>): void {
			clearTimeout(timer);
			timer = setTimeout(() => func.apply(this, args), delay);
		};
	}

	$effect(() => {
		if (!$formData.searchValue || $formData.searchValue.length === 0) {
			versions = data.versions;
			previousSearch = '';
			previousVersions = data.versions;
		}
	});

	$effect(()=>{
		const versionsChanged = JSON.stringify(data.versions) !== JSON.stringify(previousVersions);

		if ($formData.searchValue &&
			$formData.searchValue.length > 0 &&
			data.versions &&
			($formData.searchValue !== previousSearch || versionsChanged)) {
			console.log('ricerca attiva')
			previousSearch = $formData.searchValue;
			previousVersions = data.versions;
			debouncedSubmit();
		}
	})
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
			</div>

			<div class="flex flex-col flex-1 h-0 min-h-0 px-4 w-full  mx-auto gap-2">
				<form method="POST" class="flex flex-col gap-3" use:enhance action='?/searchVersion'>
					<Form.Field form={searchForm} name="searchValue">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Ricerca</Form.Label>
								<div class="flex flex-row gap-2">
									<Input {...props} type="text" bind:value={$formData.searchValue} />
									<Button type="submit">
										<Search />
									</Button>
								</div>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</form>
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
