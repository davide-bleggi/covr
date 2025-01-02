<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();

</script>
<div class="h-screen flex flex-col">
	<div class="w-full flex flex-row justify-center p-4 border-b">
		<div class="flex w-full flex-row justify-between max-w-[1200px] px-5">
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
	<div class="flex h-full justify-center">
		<div class="flex flex-1 h-full w-full justify-center max-w-[1200px]">
			{@render children()}
		</div>
	</div>

	<Toaster />
</div>

