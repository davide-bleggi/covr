<script lang="ts">

	import { format } from 'date-fns';
	import { Copy, CopyCheck, CopyIcon, Pencil } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { testStatusLabels, type TestStatusType } from '../schema';
	import { ManualTestDialog } from '../index';
	import type { AutomaticTest, ManualTest, Scenario, User } from '@prisma/client';
	import { AutomaticTestDialog } from './index';
	import { toast } from 'svelte-sonner';

	let { automaticTest }: {
		automaticTest: (AutomaticTest & { scenarios: Scenario[], status: TestStatusType });
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

	async function copyToClipboard(text: string) {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(text);
			} else {
				const textarea = document.createElement('textarea');
				textarea.value = text;
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
			}
			toast('Testo copiato');
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	}

	const errorLog:{
		errorType: string,
		received: string,
		expected: string
	} | null= $derived(automaticTest.errorLog?JSON.parse(automaticTest.errorLog):null)
</script>

<AutomaticTestDialog
	bind:open={openManualTestDialog}
	propFormData={{...{...automaticTest, scenarios: undefined}, scenarioIds: automaticTest.scenarios.map((scenario)=>scenario.id)}}
/>

<div class={`rounded ${colorClasses[automaticTest.status].bg} p-4 flex flex-col gap-2`}>
	<div class="flex flex-row items-stretch">
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
	<div class="flex flex-row items-stretch">
		<div class="flex flex-col flex-1">
			<span class="text-sm opacity-60">Nome</span>
			{`E2E-${automaticTest.id}-${automaticTest.name}`}
		</div>
		<Button variant="outline" size="icon"
						onclick={()=>{copyToClipboard(`E2E-${automaticTest.id}-${automaticTest.name}`)}}>
			<CopyCheck></CopyCheck>
		</Button>
	</div>

	{#if (automaticTest.notes && automaticTest.notes?.length > 0)}
		<div>
			<div class="flex flex-col flex-1">
				<span class="text-sm opacity-60">Note</span>
				{automaticTest.notes}
			</div>
		</div>
	{/if}
	{#if errorLog}
		<div class="flex flex-col flex-1">
			<span class="text-sm opacity-60">Errore</span>
			<div class="flex flex-col">
				<span>{errorLog.errorType}</span>
				<span>{errorLog.expected}</span>
				<span>{errorLog.received}</span>
			</div>
		</div>
	{/if}
</div>
