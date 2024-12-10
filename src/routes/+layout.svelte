<script lang="ts">
    import '../app.css';
    import {Button} from "$lib/components/ui/button";

    let {children} = $props();

</script>
<div class="h-screen flex flex-col">
    <div class="w-full flex flex-row justify-between p-4">
        <Button href="/">
            COVR
        </Button>
        <div>
            <Button variant="ghost" href="/projects">
                Projects
            </Button>
            <Button variant="ghost" href="/tests">
                Tests
            </Button>
        </div>
    </div>
    <div class="flex flex-1 h-full">
        {@render children()}
    </div>
</div>
