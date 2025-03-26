<script lang="ts">

	import { format } from 'date-fns';
	import { Pencil } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { testStatusLabels } from '../schema';
	import { ManualTestDialog } from '../index';
	import type { ManualTest, User } from '@prisma/client';
	import { marked } from 'marked';

	let { manualTest }: {
		manualTest: ManualTest & { owner: User };
	} = $props();

	const colorClasses = {
		FAIL: {
			text: 'text-fail',
			bg: 'bg-fail/20'
		},
		PASS: {
			text: 'text-success',
			bg: 'bg-success/20'
		},
		TO_TEST: {
			text: '',
			bg: ''
		}
	};

	let openManualTestDialog = $state(false);

</script>

<ManualTestDialog
	bind:open={openManualTestDialog}
	propFormData={{...manualTest, owner: undefined}}
/>

<div class={`rounded ${colorClasses[manualTest.status].bg} p-4 flex flex-col gap-2`}>
	<div class="flex flex-row items-stretch">
		<div class="flex flex-col flex-1">
			<span class="text-sm opacity-60">Assegnatario</span>
			{manualTest.owner.name}
		</div>
		<div class="flex flex-col flex-1">
			<span class="text-sm opacity-60">Data</span>
			{format(manualTest.executionDate, 'dd/MM/yyyy')}
		</div>
		<div class={`flex flex-col text-lg font-bold flex-1 h-full items-center justify-center
								${colorClasses[manualTest.status].text}`
							}>
								<span class="">
								{testStatusLabels.find((item) => item.value === manualTest.status)?.label}
									</span>
		</div>
		<Button size="icon" variant="outline" class=""
						onclick={(e)=>{
													openManualTestDialog=true
											}}>
			<Pencil></Pencil>
		</Button>
	</div>
	{#if manualTest.notes?.length && manualTest.notes?.length > 0 }
		<div class="flex flex-col flex-1">
			<span class="text-sm opacity-60">Note</span>
			<span class="markdown">{@html marked(manualTest.notes)}</span>
		</div>
	{/if}
	{#if manualTest.testData?.length && manualTest.testData?.length > 0}
		<div class="flex flex-col flex-1">
			<span class="text-sm opacity-60">Test Data</span>
			<span class="markdown">{@html marked(manualTest.testData)}</span>
		</div>
	{/if}
</div>
