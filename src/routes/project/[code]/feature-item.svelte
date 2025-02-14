<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Pencil } from 'lucide-svelte';
	import type { Feature } from '@prisma/client';
	import { Progress } from "$lib/components/ui/progress/index.js";

	let { feature }: {
		feature: Feature,
	} = $props();

</script>
<a class="w-full" href={`/features/${feature.id}`}>
	<div class="flex flex-row w-full gap-4 justify-between items-center">

		<div class="w-full flex flex-col py-2 px-4 hover:bg-secondary/80 rounded">
				<div class="w-full mb-2 flex flex-row gap-2 items-center">
					<span>{feature.coverage}%</span>
					<Progress value={feature.coverage} class="h-[10px]"></Progress>
				</div>

				<div class="flex justify-start w-full gap-2">
					<span>FEAT<br />{feature.id}</span>
					<div class="flex flex-1 flex-col w-full items-start font-normal overflow-hidden">
						<h2 class="font-bold">{feature.name}</h2>
						<div
							class="truncate w-full text-left">{feature.description}</div>
					</div>
				</div>
			</div>

	</div>
</a>
