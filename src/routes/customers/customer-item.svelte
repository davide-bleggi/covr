<script lang="ts">
	import type { Customer } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { PencilIcon } from 'lucide-svelte';

	let { edit, customer } = $props()

</script>
<div class="flex gap-2 items-center">
	<div>
	{customer.name}
	</div>
	<Button size="icon" variant="outline" on:click={()=>edit({ customer })}>
		<PencilIcon size={16} />
	</Button>
</div>
