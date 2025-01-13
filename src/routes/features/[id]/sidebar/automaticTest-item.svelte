<script lang="ts">

	import { format } from 'date-fns';
	import { Pencil } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { testStatusLabels } from '../schema';
	import { ManualTestDialog } from '../index';
	import type { AutomaticTest, ManualTest, Scenario, User } from '@prisma/client';
	import { AutomaticTestDialog } from './index';

	let { automaticTest }: {
		automaticTest: AutomaticTest & {scenarios: Scenario[]};
	} = $props();

	const colorClasses = {
		NOT_PASS: {
			text: 'text-red-500',
			bg: 'bg-red-100'
		},
		PASS: {
			text: 'text-green-500',
			bg: 'bg-green-100'
		},
		TO_TEST: {
			text: '',
			bg: ''
		}
	};

	let openManualTestDialog = $state(false);

</script>

<AutomaticTestDialog
	bind:open={openManualTestDialog}
	propFormData={{...automaticTest, scenarioIds: automaticTest.scenarios.map((scenario)=>scenario.id)}}
/>

<div class={`rounded ${colorClasses[automaticTest.status].bg} p-4`}>
	<div class="flex flex-row items-stretch">
		<div class="flex flex-col flex-1">
			<span class="text-sm opacity-60">Nome</span>
			{automaticTest.name}
		</div>
		<div class="flex flex-col flex-1">
			<span class="text-sm opacity-60">Data</span>
			{format(automaticTest.executionDate, 'dd/MM/yyyy')}
		</div>
		<div class={`flex flex-col text-lg font-bold flex-1 h-full items-center justify-center
								${colorClasses[automaticTest.status].text}`
							}>
								<span class="">
								{testStatusLabels.find((item) => item.value === automaticTest.status)?.label}
									</span>
		</div>
		<Button size="icon" variant="outline" class=""
						onclick={(e)=>{
													openManualTestDialog=true
											}}>
			<Pencil></Pencil>
		</Button>
	</div>
	<div>
		<div class="flex flex-col flex-1">
			<span class="text-sm opacity-60">Note</span>
			{automaticTest.notes}
		</div>
	</div>
</div>