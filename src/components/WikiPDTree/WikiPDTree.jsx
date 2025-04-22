import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
	Background,
	Controls,
	MarkerType,
	addEdge,
	Handle,
	Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './WikiPDTree.css';

const WikiPDTree = ({ taxonomy, zoomLevel }) => {
	const navigate = useNavigate();
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);

	// Custom node component with handles
	const CustomNode = ({ data }) => {
		return (
			<div
				className={`wikipd-flow-node ${data.type}`}
				onClick={() => data.path && navigate(data.path)}
				style={{ cursor: data.path ? 'pointer' : 'default' }}
			>
				<Handle
					type='target'
					position={Position.Left}
					style={{ background: '#555' }}
					isConnectable={false}
				/>
				<div className='node-content'>
					<div className='node-label'>{data.label}</div>
				</div>
				<Handle
					type='source'
					position={Position.Right}
					style={{ background: '#555' }}
					isConnectable={false}
				/>
			</div>
		);
	};

	const nodeTypes = {
		custom: CustomNode,
	};

	useEffect(() => {
		if (!taxonomy) return;

		const newNodes = [];
		const newEdges = [];

		// Layout constants
		const horizontalSpacing = 350;
		const categoryVerticalSpacing = 250;
		const subcategoryVerticalSpacing = 120;
		const itemVerticalSpacing = 60;

		// First, calculate the height needed for each category
		const categoryHeights = taxonomy.categories.map((category) => {
			let height = 0;
			category.subcategories.forEach((subcategory) => {
				height += Math.max(
					subcategoryVerticalSpacing,
					subcategory.items.length * itemVerticalSpacing
				);
			});
			return height;
		});

		// Calculate total height
		const totalHeight =
			categoryHeights.reduce((sum, height) => sum + height, 0) +
			(taxonomy.categories.length - 1) * categoryVerticalSpacing;

		// Root node - center it vertically
		const rootY = totalHeight / 2;
		newNodes.push({
			id: 'root',
			type: 'custom',
			position: { x: 50, y: rootY },
			data: {
				label: 'WikiPD',
				type: 'root',
				path: '/wikipd',
			},
		});

		// Process categories
		let categoryY = 0;

		taxonomy.categories.forEach((category, catIndex) => {
			const categoryId = `category-${category.id}`;

			// Position category
			const currentCategoryY = categoryY + categoryHeights[catIndex] / 2;

			newNodes.push({
				id: categoryId,
				type: 'custom',
				position: { x: 50 + horizontalSpacing, y: currentCategoryY },
				data: {
					label: category.name,
					type: 'category',
					path: `/wikipd/${category.id}`,
				},
			});

			// Connect root to category
			newEdges.push({
				id: `edge-root-${categoryId}`,
				source: 'root',
				target: categoryId,
				type: 'default',
				style: { stroke: '#666', strokeWidth: 2 },
				markerEnd: { type: MarkerType.ArrowClosed },
			});

			// Process subcategories
			let subcategoryY = categoryY;

			category.subcategories.forEach((subcategory, subIndex) => {
				const subcategoryId = `subcategory-${category.id}-${subcategory.id}`;

				// Calculate subcategory height
				const subcategoryHeight = Math.max(
					subcategoryVerticalSpacing,
					subcategory.items.length * itemVerticalSpacing
				);

				// Position subcategory
				const currentSubcategoryY = subcategoryY + subcategoryHeight / 2;

				newNodes.push({
					id: subcategoryId,
					type: 'custom',
					position: {
						x: 50 + horizontalSpacing * 2,
						y: currentSubcategoryY,
					},
					data: {
						label: subcategory.name,
						type: 'subcategory',
						path: `/wikipd/${category.id}/${subcategory.id}`,
					},
				});

				// Connect category to subcategory
				newEdges.push({
					id: `edge-${categoryId}-${subcategoryId}`,
					source: categoryId,
					target: subcategoryId,
					type: 'default',
					style: { stroke: '#666', strokeWidth: 2 },
					markerEnd: { type: MarkerType.ArrowClosed },
				});

				// Process items
				const itemsCount = subcategory.items.length;
				let itemY =
					currentSubcategoryY - ((itemsCount - 1) * itemVerticalSpacing) / 2;

				subcategory.items.forEach((item, itemIndex) => {
					const itemId = `item-${category.id}-${subcategory.id}-${item.id}`;

					newNodes.push({
						id: itemId,
						type: 'custom',
						position: {
							x: 50 + horizontalSpacing * 3,
							y: itemY,
						},
						data: {
							label: item.name,
							type: 'item',
							path: `/wikipd/${category.id}/${subcategory.id}/${item.id}`,
						},
					});

					// Connect subcategory to item
					newEdges.push({
						id: `edge-${subcategoryId}-${itemId}`,
						source: subcategoryId,
						target: itemId,
						type: 'default',
						style: { stroke: '#666', strokeWidth: 2 },
						markerEnd: { type: MarkerType.ArrowClosed },
					});

					itemY += itemVerticalSpacing;
				});

				subcategoryY += subcategoryHeight;
			});

			categoryY += categoryHeights[catIndex] + categoryVerticalSpacing;
		});

		// Log the edges to see if they're being created
		console.log('Created edges:', newEdges);

		setNodes(newNodes);
		setEdges(newEdges);
	}, [taxonomy, navigate]);

	// Apply zoom level after the flow is initialized
	useEffect(() => {
		if (reactFlowInstance && zoomLevel) {
			reactFlowInstance.zoomTo(zoomLevel);
		}
	}, [reactFlowInstance, zoomLevel]);

	const onNodeClick = useCallback(
		(event, node) => {
			if (node.data.path) {
				navigate(node.data.path);
			}
		},
		[navigate]
	);

	const onInit = useCallback((instance) => {
		setReactFlowInstance(instance);
		// Fit view with some padding
		instance.fitView({ padding: 0.1 });
	}, []);

	return (
		<div className='wikipd-tree-visualization'>
			<div className='tree-container'>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					onNodeClick={onNodeClick}
					onInit={onInit}
					fitView
					minZoom={0.1}
					maxZoom={2}
					nodesDraggable={false}
					nodesConnectable={false}
					elementsSelectable={false}
					attributionPosition='bottom-left'
					fitViewOptions={{ padding: 0.1 }}
				>
					<Background color='#e0e0e0' gap={16} />
					<Controls showInteractive={false} position='bottom-right' />
				</ReactFlow>
			</div>
		</div>
	);
};

export default WikiPDTree;
