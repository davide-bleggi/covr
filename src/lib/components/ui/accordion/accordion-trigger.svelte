<script lang="ts">
	import { Accordion as AccordionPrimitive, type WithoutChild } from "bits-ui";
	import ChevronDown from "lucide-svelte/icons/chevron-down";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		level = 3,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.TriggerProps> & {
		level?: AccordionPrimitive.HeaderProps["level"];
	} = $props();

</script>

<AccordionPrimitive.Header {level} class="flex w-full gap-2 group">
	<div class={cn(`h-full flex items-center`)}>
		<ChevronDown class={cn(`size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180`)} />
	</div>
	<AccordionPrimitive.Trigger
		bind:ref
		class={cn(
			`flex flex-1 w-full items-center justify-between py-4 font-medium transition-all hover:underline`,
			className
		)}
		{...restProps}
	>
		{@render children?.()}

	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
