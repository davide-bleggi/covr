<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import X from 'lucide-svelte/icons/x';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import SuperDebug from 'sveltekit-superforms';

	type OptionsItem = {
		value: number;
		label: string;
	};

	let {
		noResultsText = 'Nessun risultato trovato',
		path = '/api/frameworks',
		placeholder = 'Cerca...',
		loadingText = 'Caricamento...',
		value = $bindable<number | null>(null),
		optionFormat,
		params = $bindable({})
	} = $props();

	let open = $state(false);
	let loading = $state(false);
	let options = $state<OptionsItem[]>([]);
	let searchTerm = $state('');
	let selectedValue = $state<number | null>(value);
	let debounceTimer: number;

	const selectedLabel = $derived<string | null>(
		options.find(option => option.value === selectedValue)?.label ?? null
	);

	async function fetchOptions(search: string, limit?: number) {
		const localParams = new URLSearchParams({ search, limit: limit ? limit.toString() : 100, ...params });
		const response = await fetch(`${path}?${localParams}`);
		if (!response.ok) throw new Error('Failed to fetch options');
		return response.json();
	}

	async function handleSearch(value: string) {
		searchTerm = value;

		window.clearTimeout(debounceTimer);

		debounceTimer = window.setTimeout(async () => {
			try {
				console.log(searchTerm);
				loading = true;
				options = await fetchOptions(value);
				console.log('options: ', options);
			} catch (error) {
				console.log('error');
				console.error('Error fetching options:', error);
				options = [];
			} finally {
				loading = false;
			}
		}, 300);
	}

	function toggleSelection(option: OptionItem) {
		if (selectedValue === option.value) {
			selectedValue = null;
		} else {
			selectedValue = option.value;
		}
		open = false;
	}

	// // SvelteKit 5's onMount equivalent using $effect
	$effect.root(() => {
		loadInitialSelections();
	});

	async function loadInitialSelections() {
		try {
			loading = true;
			options = await fetchOptions('', 10);
		} catch (error) {
			console.error('Error fetching initial options:', error);
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		value = selectedValue;
	});

	$effect(async () => {
		void params
		options = await fetchOptions(searchTerm);
	})
</script>

<Popover.Root bind:open>
	<Popover.Trigger class="flex-1">
		<Button
			variant="outline"
			class="w-full h-auto justify-between"
			role="combobox"
			aria-expanded={open}
		>
			<div class="flex flex-wrap gap-1">
				{#if selectedLabel}
					{selectedLabel}
				{:else}
					<span class="text-muted-foreground">{placeholder}</span>
				{/if}
			</div>
			<ChevronsUpDown class="opacity-50 shrink-0" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<Command.Root shouldFilter={false}>
			<Command.Input
				{placeholder}
				oninput={(e)=>{handleSearch(e.currentTarget.value.length>0?e.currentTarget.value:'')}}
				value={searchTerm}
			/>
			<Command.List>
				<!--{#if loading}-->
				<!--	isLoading-->
				<!--	<div class="flex items-center justify-center py-6 text-sm text-muted-foreground gap-2">-->
				<!--		<Loader2 class="size-4 animate-spin" />-->
				<!--		{loadingText}-->
				<!--	</div>-->
				<!--{:else if options.length === 0}-->
				<!--	empty list-->
				<!--	<Command.Empty>{noResultsText}</Command.Empty>-->
				<!--{:else}-->
				<!--				<div class="max-w-[400px] overflow-auto">-->
				<!--				{JSON.stringify(options)}-->
				<!--				</div>-->
				{#each options as option}
					<div class="w-full">
						<Command.Item class="w-full flex justify-start cursor-pointer p-4 font-normal"
													value={option.label}
													onclick={() => {
						                  toggleSelection(option);
						                }}>
							<Check class={cn("size-3", !(selectedValue === option.value) && "invisible")} />
							{@render optionFormat(option)}
						</Command.Item>
					</div>
					<!--							<Command.Item-->
					<!--								value={option.label}-->
					<!--								onSelect={() => {-->
					<!--                  toggleSelection(option);-->
					<!--                }}-->
					<!--							>-->
					<!--								<div class="flex items-center gap-2">-->
					<!--									<div class={cn(-->
					<!--                    "rounded-sm border border-primary size-4 flex items-center justify-center",-->
					<!--                    selectedValues.includes(option.value) ? "bg-primary text-primary-foreground" : "opacity-50"-->
					<!--                  )}>-->
					<!--										<Check class={cn("size-3", !selectedValues.includes(option.value) && "invisible")} />-->
					<!--									</div>-->
					<!--									{option.label}-->
					<!--								</div>-->
					<!--							</Command.Item>-->
				{/each}


			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
