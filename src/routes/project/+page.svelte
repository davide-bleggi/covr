<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { ProjectDialog } from './index';
	import type { PageData } from './$types.js';
	import { ProjectItem } from './index.js';
	import { VersionGraph } from './version-graph/index';

	let open = $state(false);
	let {data} = $props();
</script>

<div class="flex flex-col w-full">
	<div class="flex flex-row p-4 w-full justify-end">
		<ProjectDialog bind:open bind:formToValidate={data.form}>
		</ProjectDialog>
		<Button onclick={()=>{open=true}}>
			Crea Progetto
		</Button>
	</div>
	<ul class="flex flex-wrap justify-center items-start  gap-5 p-5">
		{#each data.projects as project}
			<li>
				<ProjectItem project={project}>
				</ProjectItem>
			</li>
		{/each}
	</ul>
</div>
