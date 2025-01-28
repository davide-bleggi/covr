<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { Button } from '$lib/components/ui/button/index';
	import { Link } from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import { ImagePlus, Code } from 'lucide-svelte';

	let { content = $bindable() } = $props();

	let element;
	let editor = $state();

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Link.configure({
					openOnClick: true
				}),
				Image
			],
			editorProps: {
				attributes: {
					class: 'focus:outline-none tiptap ProseMirror'
				}
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
		}
	});

	async function uploadImage(file: File) {
		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to upload image');
			}

			const { path } = await response.json();
			editor.chain().focus().setImage({ src: path }).run();
		} catch (err) {
			console.error(err);
			alert('Image upload failed');
		}
	}

	function handleFileInput(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			uploadImage(file);
		}
	}


</script>

{#if editor}
	<div class="flex flex-row gap-2 ">
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
		<input type="file" accept="image/*" onchange={handleFileInput} style="display: none" id="fileInput" />
		<Button variant="outline" size="sm" onclick={() => document.getElementById('fileInput')?.click()}>
			<div>
				<ImagePlus />
			</div>
		</Button>
		<Button variant="outline" size="sm" onclick={() => editor.chain().focus().toggleCodeBlock().run()}>
			<div><Code /></div>
		</Button>
	</div>
{/if}

<div bind:this={element} class="resize-y overflow-auto h-[450px] border p-2 text-md rounded" />

<style>
    :global(.tiptap.ProseMirror p) {
        margin-bottom: 20px !important;
    }
</style>
