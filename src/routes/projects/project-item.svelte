<script>
	export let project;
</script>

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
		<div class="bg-red-500 px-2 py-1 font-semibold text-white rounded-lg">
			{project.status.toLowerCase()}
		</div>
	</div>
	<div class="w-full">
		{project.description}
	</div>
</div>
