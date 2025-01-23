<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Pencil } from 'lucide-svelte';
	import type { Feature } from '@prisma/client';

	let { feature }: {
		feature: Feature,
	} = $props();

</script>

<a href={`/features/${feature.id}`}>
<div class="flex flex-row w-full gap-4 justify-between items-center">
	<div class="flex items-center gap-2 w-full">
		<Button variant="ghost" class="flex justify-start w-full overflow-ellipsis py-6">
			<div class="flex flex-col items-start font-normal ">
				<h2 class="font-bold">{feature.name}</h2>
				<span class=" flex justify-start">{feature.description}</span>
			</div>
		</Button>
	</div>
</div>
</a>
