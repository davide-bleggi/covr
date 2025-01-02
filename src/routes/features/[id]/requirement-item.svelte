<script lang="ts">
	import type { Requirement, Scenario } from '@prisma/client';
	import { Plus } from 'lucide-svelte';
	import { InstallationItem } from '../../project/[code]';
	import { Button } from '$lib/components/ui/button';
	import * as Accordion from '$lib/components/ui/accordion/index';

	let { requirement = $bindable() }: {
		requirement: (Requirement & { scenarios: Scenario[] })
	} = $props();

	let openScenarios = $state(requirement.scenarios.length > 0 ? ['scenarios'] : undefined);
</script>



<div class="border rounded p-3">
	{JSON.stringify(requirement)}
	<Accordion.Root class="w-full" bind:value={openScenarios}>
		<Accordion.Item value="scenarios" class="w-full">
			<div class="flex flex-row w-full justify-between items-center gap-2">
				<div class="flex flex-grow w-full">
					<Accordion.Trigger class="flex border-b-0">Scenari</Accordion.Trigger>
				</div>
				<Button variant="outline" size="icon" onclick={()=>{}}>
					<Plus></Plus>
				</Button>
			</div>

			<Accordion.Content>
				<ul class="gap-2 flex flex-col">
					{#each requirement.scenarios as scenario}
						<li>
							{scenario.name}
						</li>
					{/each}
				</ul>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>

