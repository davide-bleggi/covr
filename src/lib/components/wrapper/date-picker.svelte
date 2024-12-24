<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import {
		Button,
		buttonVariants
	} from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { format } from 'date-fns';

	let {date = $bindable()} = $props();

	let value = $state<DateValue | undefined>();

	$effect(() => {
		value = date ? parseDate(format(date, 'yyyy-MM-dd')) : undefined;
	});

	let placeholder = $state<DateValue>(today(getLocalTimeZone()));
</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start pl-4 text-left font-normal",
              !value && "text-muted-foreground"
            )}
	>
		{value
			? format(value.toDate(getLocalTimeZone()), 'yyyy-MM-dd')
			: "Pick a date"}
		<CalendarIcon class="ml-auto size-4 opacity-50" />
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" side="top">
		<Calendar
			type="single"
			value={value}
			bind:placeholder
			minValue={new CalendarDate(1900, 1, 1)}
			maxValue={today(getLocalTimeZone())}
			calendarLabel="Seleziona una data"
			onValueChange={(v) => {
                if (v) {
                  date = v;
                } else {
                  date = "";
                }
              }}
		/>
	</Popover.Content>
</Popover.Root>
