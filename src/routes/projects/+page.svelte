<script lang="ts">
    import {Button} from "$lib/components/ui/button/index";
    import {ProjectDialog} from "./index";
    import type { PageData } from "./$types.js";

    let open = false;
    export let data: PageData;
</script>

<div class="flex flex-row p-4 w-full justify-end">
    <ProjectDialog bind:open form="{data.form}">
    </ProjectDialog>
    <Button on:click={()=>{open=true}}>
        Crea Progetto
    </Button>
</div>
