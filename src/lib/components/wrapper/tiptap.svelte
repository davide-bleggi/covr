<script>
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { Button } from '$lib/components/ui/button/index';
	import { Link } from '@tiptap/extension-link';

	let { content = $bindable() } = $props();

	let element;
	let editor = $state();

	onMount(() => {
		editor = new Editor({
			element: element,
			focus: false,
			extensions: [
				StarterKit,
				Link.configure({
					openOnClick: true
				})
			],
			editorProps: {
				attributes: {
					class: 'focus:outline-none',
				},
			},
			content: content,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
				content = editor.getHTML();
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
			editor.destroy();
		}
	});


</script>

{#if editor}
	<div>
		<Button variant="outline" size="sm"
						onclick={() => editor.chain().focus().insertContent('<strong>GIVEN</strong> ').run()}>
			<strong>GIVEN</strong>
		</Button>
		<Button variant="outline" size="sm"
						onclick={() => editor.chain().focus().insertContent('<strong>WHEN</strong> ').run()}>
			<strong>WHEN</strong>
		</Button>
		<Button variant="outline" size="sm"
						onclick={() => editor.chain().focus().insertContent('<strong>AND</strong> ').run()}>
			<strong>AND</strong>
		</Button>
		<Button variant="outline" size="sm"
						onclick={() => editor.chain().focus().insertContent('<strong>THEN</strong> ').run()}>
			<strong>THEN</strong>
		</Button>
		<Button variant="outline" size="sm"
						onclick={() => editor.chain().focus().insertContent('<strong>BUT</strong> ').run()}>
			<strong>BUT</strong>
		</Button>
	</div>
{/if}

<div bind:this={element} class="resize-y overflow-auto h-32 border p-2 text-md rounded" />

<style global>
    .ProseMirror:focus {
        outline: none;
    }

    .ProseMirror p.is-editor-empty:first-child::before {
        outline: none;
    }
</style>
