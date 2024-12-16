<script lang="ts">
	import type { Project } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';
	import { PencilIcon } from 'lucide-svelte';
	import { ProjectDialog } from '../index';

	let { data } = $props();
	let open = $state(false);

	const project: Project | null = data.project;


</script>

<div class="flex flex-row w-full p-4 gap-2 h-fit items-center">
	<ProjectDialog bind:open form={data.form}>
	</ProjectDialog>
	<Button variant="outline" class="p-2" on:click={()=>open=true}>
		<PencilIcon size={16} />
	</Button>
	<h1 class="font-bold text-lg">
		{project?.name.toUpperCase()}
	</h1>
</div>
