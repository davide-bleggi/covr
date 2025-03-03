<script lang="ts" generics="T">
	import type { Version } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { type Infer, superForm } from 'sveltekit-superforms';
	import { searchFormSchema, type SearchFormSchema } from '../../../routes/project/[code]/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Search from 'lucide-svelte/icons/search';
	import { debounce } from './utils';

	let { versions = $bindable(), filteredVersions = $bindable(), searchApiString}: {
		versions: T[],
		filteredVersions: T[],
		searchApiString: string
	} = $props();

	let previousVersions: T[] = $state([]);
	let previousSearch = $state('');

	const searchForm = $state(superForm<Infer<SearchFormSchema>>({ searchValue: '' }, {
		validators: zodClient(searchFormSchema),
		applyAction: false, // Add this to prevent automatic page updates
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				console.log('Form submission failed:', result);
				filteredVersions = [];
			}

			if (result.type === 'success') {
				filteredVersions = result.data ? result.data.versions : [];
			}
		},
		onUpdate: ({ form }) => {
			$errors = form.errors;
		},
		resetForm: false
	}));

	const { form: formData, enhance, errors, formId, submit } = searchForm;

	const debouncedSubmit = debounce(() => {
		submit();
	}, 3000);

	$effect(() => {
		if (!$formData.searchValue || $formData.searchValue.length === 0) {
			filteredVersions = versions;
			previousSearch = '';
			previousVersions = versions;
		}
	});

	$effect(() => {
		const versionsChanged = JSON.stringify(versions) !== JSON.stringify(previousVersions);

		if ($formData.searchValue &&
			$formData.searchValue.length > 0 &&
			versions &&
			($formData.searchValue !== previousSearch || versionsChanged)) {
			console.log('ricerca attiva');
			previousSearch = $formData.searchValue;
			previousVersions = versions;
			debouncedSubmit();
		}
	});
</script>

<form method="POST" class="flex flex-col gap-3" use:enhance action={searchApiString}>
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
