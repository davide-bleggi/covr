<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Pencil } from 'lucide-svelte';
	import type { Feature } from '@prisma/client';

	let { feature }: {
		feature: Feature,
	} = $props();

</script>
<a class="w-full" href={`/features/${feature.id}`}>
	<div class="flex flex-row w-full gap-4 justify-between items-center">
		<div class="flex items-center  w-full">
			<Button variant="ghost" class="w-full py-6 px-4">
				<div class="flex justify-start w-full gap-2">
					<span>FEAT<br />{feature.id}</span>
					<div class="flex flex-1 flex-col w-full items-start font-normal overflow-hidden">
						<h2 class="font-bold">{feature.name}</h2>
						<div
							class="truncate w-full text-left">{feature.description}</div>
					</div>
				</div>
			</Button>
		</div>
	</div>
</a>
