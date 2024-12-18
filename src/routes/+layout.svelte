<script lang="ts">
    import '../app.css';
    import {Button} from "$lib/components/ui/button";
    import { Toaster } from "$lib/components/ui/sonner";

    let {children} = $props();

</script>
<div class="h-screen flex flex-col">
    <div class="w-full flex flex-row justify-between p-4 border-b">
        <Button href="/">
            COVR
        </Button>
        <div>
            <Button variant="ghost" href="/project">
                Projects
            </Button>
            <Button variant="ghost" href="/test">
                Tests
            </Button>
        </div>
    </div>
    <div class="flex flex-1 h-full">
        {@render children()}
    </div>

    <Toaster />
</div>

