<script>
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index';
</script>
<div class="w-full h-full flex flex-row justify-center items-center">
{#if $page.status === 404}
	<!-- Display an error message -->
	<div class=" flex flex-col gap-3">
		<h1 class="font-bold text-xl">{$page.status}</h1>
		<p>{$page.error?.message || 'An unexpected error occurred.'}</p>
		<Button class="self-end" variant="secondary" href="/projects">
			Torna ai progetti
		</Button>
	</div>
{:else}
	<!-- Render the child page -->
	<slot />
{/if}
</div>
