<script>
	import { format } from 'date-fns';
	import { Pencil } from 'lucide-svelte';
	import SuperDebug from 'sveltekit-superforms';
	import { Button } from '$lib/components/ui/button/index';
	import { ScenarioDialog } from '../index';
	import { marked } from 'marked';
	let { currentScenario } = $props();
	let openScenarioDialog = $state(false);

</script>

<ScenarioDialog
	bind:open={openScenarioDialog}
	propFormData={currentScenario??{}}
/>


<div class="flex flex-row w-full items-center justify-center">
<div class="flex flex-col flex-1">
	<span class="text-sm">{`SCN-${currentScenario.id}`}</span>
	<h2 class="font-bold ">
		{currentScenario.name}
	</h2>
</div>
	<Button size="icon" variant="outline" class=""
					onclick={(e)=>{
						openScenarioDialog=true
					}}>
		<Pencil></Pencil>
	</Button>
</div>
<div class="flex flex-col gap-2 py-4 markdown">
	<div class="w-full max-h-[500px] overflow-auto p-4 rounded bg-gray-100">
		{@html marked(currentScenario.scenario??'')}
	</div>
</div>
