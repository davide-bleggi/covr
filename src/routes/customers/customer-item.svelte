<script lang="ts">
	import type { Customer } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { PencilIcon } from 'lucide-svelte';

	let { edit, customer } = $props()

</script>
<div class="flex w-full flex-row gap-2 items-center justify-between shadow-md p-5 rounded-md">
	<h4 class="text-lg font-semibold">
		{customer.name}
	</h4>
	<Button size="icon" variant="outline" onclick={()=>edit({ customer })}>
		<PencilIcon size={16} />
	</Button>
</div>
