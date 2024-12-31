<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar, Pencil } from 'lucide-svelte';
	import { InstallationDialog } from './index';
	import type { Customer, Installation } from '@prisma/client';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { InstallationFormSchema } from './schema';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';

	let { installation, customers, installationForm }: {
		installation: Installation & { customer: Customer },
		customers: Customer[],
		installationForm: any
	} = $props();

	let openInstallationDialog = $state(false);


</script>

<InstallationDialog
	bind:open={openInstallationDialog}
	bind:formToValidate={installationForm}
	customers={customers}
	formId={`edit-installation-form-${installation.id}`}
>
</InstallationDialog>

<div class="flex flex-row w-full gap-4 justify-between items-center">
	<div class="flex items-center gap-2">
		<Button size="icon" variant="outline" onclick={()=>{
		installationForm = {
			versionId: installation.versionId,
			customerId: installation.customerId,
			installationDate: installation.installationDate,
			id: installation.id
		};
								openInstallationDialog=true
							}}>
			<Pencil></Pencil>
		</Button>
		{installation.customer.name}
	</div>
	<div class="flex flex-row items-center gap-2 opacity-50">
		<Calendar size="20px  "></Calendar>
		{format(installation.installationDate, 'yyyy-MM-dd')}
	</div>
</div>
