<script lang="ts">
	import { Button } from '$lib/components/ui/form/index';
	import { CustomerDialog, CustomerItem } from './index';
	import type { Customer } from '@prisma/client';
	import * as Table from "$lib/components/ui/table/index.js";

	let {data} = $props();
	let open = $state(false);
	let newFormData = data.customerForm.data;
	let selectedFormData = $state(newFormData);
</script>


<CustomerDialog bind:open bind:data={selectedFormData}>
</CustomerDialog>
<div class="flex flex-col w-full">
	<div class="flex mx-auto flex-col justify-center w-[700px] py-5">
		<Button variant="outline" class="w-full mb-2" onclick={()=>{
			selectedFormData = newFormData;
			open=true
		}}>
			Crea Cliente
		</Button>
	<ul class="flex flex-col gap-5">
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
</div>
