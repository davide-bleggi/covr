<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Pencil } from 'lucide-svelte';
	import { FeatureDialog } from './index';
	import type { Feature } from '@prisma/client';

	let { feature, featureForm }: {
		feature: Feature,
		featureForm: any
	} = $props();

	let openFeatureDialog = $state(false);

</script>

<FeatureDialog
	bind:open={openFeatureDialog}
	bind:propFormData={featureForm}
	formId={`edit-feature-form-${feature.id}`}
>
</FeatureDialog>

<a href={`/features/${feature.id}`}>
<div class="flex flex-row w-full gap-4 justify-between items-center">
	<div class="flex items-center gap-2">
		<Button size="icon" variant="outline"
						onclick={(e)=>{
						e.stopPropagation();
						e.preventDefault();
						featureForm = {...feature}
						openFeatureDialog=true
					}}>
			<Pencil></Pencil>
		</Button>

			{feature.name}

	</div>
</div>
</a>
