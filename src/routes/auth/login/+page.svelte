<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, { type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginFormSchema, type LoginFormSchema } from './schema.js';
	import * as Form from '$lib/components/ui/form';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data } = $props();

	const form = superForm<Infer<LoginFormSchema>>(data.loginForm, {
		validators: zodClient(loginFormSchema),
		onResult: async ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				return;
			}
			console.log('redirectTo: ', page.url.searchParams.get('redirectTo'));
			await goto(page.url.searchParams.get('redirectTo') || '/');
		},
		onUpdate: ({ form }) => {
			$errors = form.errors;
		}
	});

	const { form: formData, enhance, errors } = form;

	function parseSqlServerConnectionString(connectionString: string) {
		const obj: Record<string, string | number | boolean> = {};

		// Handle both URI-style and key-value style connection strings
		const regex = /^sqlserver:\/\/([^:]+):?(\d+)?;?/;
		const match = connectionString.match(regex);

		if (match) {
			obj['host'] = match[1];
			obj['port'] = match[2] ? parseInt(match[2], 10) : 1433;
			connectionString = connectionString.replace(match[0], '');
		}

		// Parse remaining key-value pairs
		const params = connectionString.split(';');
		params.forEach((param) => {
			const [key, value] = param.split('=');
			if (key && value) {
				const normalizedKey = key.trim().toLowerCase();
				obj[normalizedKey] = isNaN(Number(value)) ? value.trim() : Number(value);
			}
		});

		return obj;
	}

</script>
	<div class="flex flex-col w-80 h-full justify-center">
		<div class="pb-8 w-full flex justify-center">
			<h1 class="font-bold text-[32px] font-bold ">COVR</h1>
<!--			<SuperDebug data={parseSqlServerConnectionString(data.databaseUrl)} />-->
		</div>
		<form method="POST" use:enhance
					action="?/login">
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input type="email" {...props} bind:value={$formData.email} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input type="password" {...props} bind:value={$formData.password} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex flex-col">
				{#if $errors._errors}
					{#each $errors._errors as error}
						<span class="text-red-500 font-bold">{error}</span>
					{/each}
				{/if}
				<Form.Button type="submit" class="mt-5">Login</Form.Button>
			</div>
		</form>
	</div>
