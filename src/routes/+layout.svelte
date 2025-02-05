<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Moon, Sun } from 'lucide-svelte';

	let { children } = $props();

</script>
<ModeWatcher />

<div class="h-screen flex flex-col overflow-hidden">
	<div class="w-full flex flex-row justify-center p-4 border-b ">
		<div class="flex w-full flex-row justify-between max-w-[1600px] px-5">
			<Button href="/">
				COVR
			</Button>
			<div class="flex justify-center gap-2 ">
				<Button variant="ghost" href="/project">
					Projects
				</Button>
				<!--            <Button variant="ghost" href="/test">-->
				<!--                Tests-->
				<!--            </Button>-->
				<Button variant="ghost" href="/customers">
					Customers
				</Button>
				<Button onclick={toggleMode} variant="outline" size="icon">
					<Sun
						class=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
				<Button variant="secondary"
								onclick={async () => { fetch('/api/auth/logout', { method: 'POST' }).then((result)=>{
									if(result.status===200){
										window.location.href='/'}
								})}}>
					Logout
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

