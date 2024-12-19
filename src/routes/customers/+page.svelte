<script lang="ts">
	import { Button } from '$lib/components/ui/form/index';
	import { CustomerDialog, CustomerItem } from './index';
	import type { Customer } from '@prisma/client';

	let {data} = $props();
	let open = $state(false);
	let newFormData = data.customerForm.data;
	let selectedFormData = $state(newFormData);
</script>


<CustomerDialog bind:open bind:data={selectedFormData}>
</CustomerDialog>
<div class="flex flex-col w-full">
	<div class="flex flex-row p-4 w-full justify-end">
		<Button on:click={()=>{
			selectedFormData = newFormData;
			open=true
		}}>
			Crea Cliente
		</Button>
	</div>
	<ul class="grid grid-cols-5 gap-5 px-5">
		{#each data.customers as customer}
			<li>
				<CustomerItem edit={(event: {customer: Customer})=>{
					console.log(event.customer);
					selectedFormData = event.customer;
					open=true;
				}} customer={customer}>

				</CustomerItem>
			</li>
		{/each}
	</ul>
</div>
