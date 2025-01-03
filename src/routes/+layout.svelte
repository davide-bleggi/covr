<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();

</script>
<div class="h-screen flex flex-col overflow-hidden">
	<div class="w-full flex flex-row justify-center p-4 border-b">
		<div class="flex w-full flex-row justify-between max-w-[1600px] px-5">
			<Button href="/">
				COVR
			</Button>
			<div>
				<Button variant="ghost" href="/project">
					Projects
				</Button>
				<!--            <Button variant="ghost" href="/test">-->
				<!--                Tests-->
				<!--            </Button>-->
				<Button variant="ghost" href="/customers">
					Customers
				</Button>
			</div>
		</div>
	</div>
	<div class="flex flex-col flex-1 overflow-auto justify-center items-center">
		<div class="flex flex-1 w-full justify-center overflow-y-auto max-w-[1600px]">
			{@render children()}
		</div>
	</div>

	<Toaster />
</div>

