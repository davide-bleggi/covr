<script lang="ts" generics="T">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { type Infer, superForm } from 'sveltekit-superforms';
	import { searchFormSchema, type SearchFormSchema } from '../../../routes/project/[code]/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Search from 'lucide-svelte/icons/search';
	import { debounce } from './utils';

	let { items = $bindable(), filteredItems = $bindable(), searchApiString}: {
		items: T[],
		filteredItems: T[],
		searchApiString: string
	} = $props();

	let previousItems: T[] = $state([]);
	let previousSearch = $state('');

	const searchForm = $state(superForm<Infer<SearchFormSchema>>({ searchValue: '' }, {
		validators: zodClient(searchFormSchema),
		applyAction: false, // Add this to prevent automatic page updates
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				console.log('Form submission failed:', result);
				filteredItems = [];
			}

			if (result.type === 'success') {
				filteredItems = result.data ? result.data.items : [];
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
			filteredItems = items;
			previousSearch = '';
			previousItems = items;
		}
	});

	$effect(() => {
		const itemsChanged = JSON.stringify(items) !== JSON.stringify(previousItems);

		if ($formData.searchValue &&
			$formData.searchValue.length > 0 &&
			items &&
			($formData.searchValue !== previousSearch || itemsChanged)) {
			console.log('ricerca attiva');
			previousSearch = $formData.searchValue;
			previousItems = items;
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
