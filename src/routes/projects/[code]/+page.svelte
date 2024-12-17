<script lang="ts">
	import type { Project } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { PencilIcon } from 'lucide-svelte';
	import { ProjectDialog } from '../index';
	import type { PageData } from './$types.js';

	export let data: PageData;
	let open = false;

</script>

<div class="flex flex-row w-full p-4 gap-2 h-fit items-center">
	<ProjectDialog bind:open form={data.form}>
	</ProjectDialog>
	<Button variant="outline" class="p-2" on:click={()=>open=true}>
		<PencilIcon size={16} />
	</Button>
	<h1 class="font-bold text-lg">
		{JSON.stringify(data.project)}
	</h1>
</div>
