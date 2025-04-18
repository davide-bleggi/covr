<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	type VersionNode = {
		id: string;
		connections?: number;
		prev?: string;
		order?: number
	}

	let { versionNodes }: { versionNodes: VersionNode[] } = $props();

	let svg;
	let selectedCommit = null;

	console.log(versionNodes);

	function addConnections(versionNodes: VersionNode[]): VersionNode[] {
		const nodes = versionNodes;
		const connectionMap = new Map();
		const branchOrderMap = new Map();
		let currentBranchCount = 0;

		// Reset any existing orders
		nodes.forEach(node => {
			delete node.order;
		});

		// First pass: count connections and assign initial branch orders
		for (const node of nodes) {
			if (node.prev) {
				connectionMap.set(node.prev, (connectionMap.get(node.prev) || 0) + 1);
			}
		}

		// Second pass: assign branch orders
		nodes.forEach(node => {
			// For the root node
			if (!node.prev) {
				node.order = 0;
				branchOrderMap.set(node.id, 0);
				return;
			}

			const parentNode = nodes.find(n => n.id === node.prev);
			const parentBranchOrder = branchOrderMap.get(node.prev);

			if (connectionMap.get(node.prev) > 1) {
				// This is a branch point
				if (!branchOrderMap.has(node.id)) {
					currentBranchCount++;
					branchOrderMap.set(node.id, currentBranchCount);
				}
				node.order = branchOrderMap.get(node.id);
			} else {
				// Continue parent's branch
				node.order = parentBranchOrder || 0;
				branchOrderMap.set(node.id, node.order);
			}
		});

		return versionNodes;
	}

	addConnections(versionNodes);

	onMount(() => {
		const width = 600;
		const height = 600;
		const nodeSpacing = 100;
		const branchSpacing = 80;
		const margin = 50;

		// Clear any existing content
		d3.select(svg).selectAll('*').remove();

		const svgElement = d3.select(svg)
			.attr('viewBox', [0, 0, width, height]);

		// Create a container group for all elements
		const container = svgElement.append('g');

		// Add zoom behavior
		const zoom = d3.zoom()
			.scaleExtent([0.1, 4])
			.on('zoom', (event) => {
				container.attr('transform', event.transform);
			});

		svgElement.call(zoom);

		// Calculate positions - root node at top
		versionNodes.forEach((node, i) => {
			// Place first node at top and subsequent nodes moving down
			node.y = margin + (i * nodeSpacing);
			// Center the main branch and offset others
			node.x = (width / 2) + ((node.order || 1) * branchSpacing);
		});

		// Create arrow marker (pointing down)
		svgElement.append('defs').append('marker')
			.attr('id', 'arrowhead')
			.attr('markerWidth', 10)
			.attr('markerHeight', 7)
			.attr('refX', 9)
			.attr('refY', 3.5)
			.attr('orient', 'auto')
			.append('polygon')
			.attr('points', '10 0, 0 3.5, 10 7')  // Points for downward arrow
			.attr('fill', '#999');

		// Draw links with curves
		const links = container
			.append('g')
			.selectAll('path')
			.data(versionNodes.filter(d => d.prev))
			.join('path')
			.attr('stroke', '#999')
			.attr('stroke-width', 2)
			.attr('fill', 'none')
			.attr('d', d => {
				const sourceNode = d;
				const targetNode = versionNodes.find(n => n.id === d.prev);
				if (targetNode) {
					const midY = (sourceNode.y + targetNode.y) / 2;

					if (sourceNode.order === targetNode.order) {
						// Straight line for same branch
						return `M ${sourceNode.x},${sourceNode.y} L ${targetNode.x},${targetNode.y}`;
					} else {
						// Curved line for branch changes
						return `M ${sourceNode.x},${sourceNode.y}
        C ${sourceNode.x},${midY}
          ${targetNode.x},${midY}
          ${targetNode.x},${targetNode.y}`;
					}
				}
			});

		// Draw nodes
		const nodes = container
			.append('g')
			.selectAll('a')
			.data(versionNodes)
			.join('a')
			.append('g')
			.attr('transform', d => `translate(${d.x},${d.y})`)
			.attr('class', 'node')
			.style('cursor', 'pointer')
			.on('click', (event, d) => {
				event.preventDefault();
				scrollToSection(d.id);
			});

		// Add commit circles
		nodes.append('circle')
			.attr('r', 8)
			.attr('fill', '#000')
			.attr('stroke', '#fff')
			.attr('stroke-width', 2)
			.attr('class', 'commit-circle');

		// Add hover effect
		nodes.append('circle')
			.attr('r', 16)
			.attr('fill', 'transparent')
			.attr('class', 'hover-circle');

		// Add commit messages
		nodes.append('text')
			.attr('x', 15)
			.attr('y', 0)
			.attr('dy', '0.35em')
			.attr('text-anchor', 'start')
			.attr('font-size', '12px')
			.attr('fill', '#666')
			.text(d => d.id);

		// Add double-click to reset zoom
		svgElement.on('dblclick', () => {
			svgElement.transition()
				.duration(750)
				.call(zoom.transform, d3.zoomIdentity);
		});
	});

	function scrollToSection(anchor: string) {
		document.getElementById(anchor).scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div class="h-full m-auto ">
	<div class="flex flex-col h-full lg:flex-row gap-8">
		<div class="flex-1 h-full bg-background p-6">
			<svg bind:this={svg} class="w-full h-full"></svg>
		</div>
	</div>
</div>

<style>
    :global(.node:hover .commit-circle) {
        filter: brightness(1.1);
    }

    :global(.hover-circle:hover) {
        fill: rgba(0, 0, 0, 0.05);
    }
</style>
