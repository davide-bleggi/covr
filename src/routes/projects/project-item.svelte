<script lang="ts">
	import { PlayCircle } from 'lucide-svelte';
	import { format } from 'date-fns';
	import type { Project } from '@prisma/client';
	import { ProjectStatusOptions } from '$lib/db/types';

	export let project: Project;
	const status = ProjectStatusOptions.find((status)=> project.status===status.value);


</script>
<a href="{`projects/${project.code}`}">
	<div class="flex flex-col p-4 rounded-xl shadow-md border gap-2">
		<div class="flex flex-row justify-between">
			<div class="flex flex-row gap-1 items-center">
				<h2 class="font-bold">
					{project.name.toUpperCase()}
				</h2>
				<h2 class="font-bold opacity-50">
					{project.code.toUpperCase()}
				</h2>
			</div>
			<div class="{`px-2 py-1 font-semibold text-white rounded-lg ${status?.labelClass}`}">
				{status?.label}
			</div>
		</div>
		<div class="w-full">
			{project.description}
		</div>
		<div class="w-full flex flex-row gap-2 opacity-60">
			<PlayCircle></PlayCircle>
			<span class="font-semibold">
				{format(project.createdAt, 'dd-MM-yyyy')}
			</span>
		</div>
	</div>
</a>
