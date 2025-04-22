import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './WikiPDPage.css';
import WikiPDTree from '../../components/WikiPDTree/WikiPDTree';
import WikiPDService from '../../services/WikiPDService';

const WikiPDPage = () => {
	const { categoryId, subcategoryId, itemId } = useParams();
	const navigate = useNavigate();
	const [taxonomy, setTaxonomy] = useState(WikiPDService.getTaxonomy());
	const [editMode, setEditMode] = useState(false);
	const [editingField, setEditingField] = useState(null);
	const [editValue, setEditValue] = useState('');
	const [zoomLevel, setZoomLevel] = useState(1);
	const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'list'
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState({
		show: false,
		message: '',
		type: '',
	});
	const taxonomyRef = useRef(null);

	// Refresh taxonomy data when parameters change
	useEffect(() => {
		setTaxonomy(WikiPDService.getTaxonomy());
	}, [categoryId, subcategoryId, itemId]);

	// Auto-hide notification after 3 seconds
	useEffect(() => {
		if (notification.show) {
			const timer = setTimeout(() => {
				setNotification({ ...notification, show: false });
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [notification]);

	// Function to handle zoom in/out
	const handleZoom = (zoomIn) => {
		if (zoomIn) {
			setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Max zoom 2x
		} else {
			setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Min zoom 0.5x
		}
	};

	// Reset zoom to 1
	const resetZoom = () => {
		setZoomLevel(1);
	};

	// Toggle view mode between tree and list
	const toggleViewMode = () => {
		setViewMode((prevMode) => (prevMode === 'tree' ? 'list' : 'tree'));
	};

	// Find current item/subcategory/category from taxonomy
	const getCurrentContent = () => {
		if (!categoryId) return null;

		const category = taxonomy.categories.find((cat) => cat.id === categoryId);
		if (!category) return null;

		if (!subcategoryId) return { type: 'category', data: category };

		const subcategory = category.subcategories.find(
			(sub) => sub.id === subcategoryId
		);
		if (!subcategory) return { type: 'category', data: category };

		if (!itemId) return { type: 'subcategory', data: subcategory, category };

		const item = subcategory.items.find((i) => i.id === itemId);
		if (!item) return { type: 'subcategory', data: subcategory, category };

		return { type: 'item', data: item, subcategory, category };
	};

	// Handle starting edit mode
	const handleEdit = (field, initialValue) => {
		setEditMode(true);
		setEditingField(field);
		setEditValue(initialValue || '');
	};

	// Handle saving changes
	const handleSave = () => {
		setLoading(true);
		const currentContent = getCurrentContent();

		if (currentContent?.type !== 'item') {
			setLoading(false);
			setEditMode(false);
			return;
		}

		const { category, subcategory, data: item } = currentContent;

		let success = false;

		// Determine which field to update
		if (editingField === 'definition') {
			success = WikiPDService.updateItemDefinition(
				category.id,
				subcategory.id,
				item.id,
				editValue
			);
		} else if (editingField === 'subgoal') {
			success = WikiPDService.updateItemSubgoal(
				category.id,
				subcategory.id,
				item.id,
				0, // First part of subgoal (goal)
				editValue
			);
		} else if (editingField === 'trackingInstructions') {
			success = WikiPDService.updateItemSubgoal(
				category.id,
				subcategory.id,
				item.id,
				1, // Second part of subgoal (tracking instructions)
				editValue
			);
		}

		// Refresh the taxonomy and exit edit mode
		if (success) {
			setNotification({
				show: true,
				message: 'Changes saved successfully!',
				type: 'success',
			});

			// Refresh the taxonomy data
			setTaxonomy(WikiPDService.getTaxonomy());
		} else {
			setNotification({
				show: true,
				message: 'Failed to save changes. Please try again.',
				type: 'error',
			});
		}

		setLoading(false);
		setEditMode(false);
		setEditingField(null);
	};

	// Handle canceling edit
	const handleCancel = () => {
		setEditMode(false);
		setEditingField(null);
	};

	// Handle resetting the taxonomy to original state
	const handleResetTaxonomy = () => {
		if (
			window.confirm(
				'Are you sure you want to reset all definitions and goals to their original state? This action cannot be undone.'
			)
		) {
			WikiPDService.resetTaxonomy();
			setTaxonomy(WikiPDService.getTaxonomy());

			setNotification({
				show: true,
				message: 'Taxonomy has been reset to default values',
				type: 'success',
			});
		}
	};

	// Breadcrumb navigation
	const renderBreadcrumbs = () => {
		const currentContent = getCurrentContent();

		return (
			<div className='wikipd-breadcrumbs'>
				<Link to='/wikipd'>WikiPD</Link>
				{currentContent && (
					<>
						<span className='breadcrumb-separator'>&gt;</span>
						<Link
							to={`/wikipd/${
								currentContent.category?.id || currentContent.data?.id
							}`}
						>
							{currentContent.category?.name || currentContent.data?.name}
						</Link>
					</>
				)}

				{currentContent?.type === 'subcategory' && (
					<>
						<span className='breadcrumb-separator'>&gt;</span>
						<Link
							to={`/wikipd/${currentContent.category.id}/${currentContent.data.id}`}
						>
							{currentContent.data.name}
						</Link>
					</>
				)}

				{currentContent?.type === 'item' && (
					<>
						<span className='breadcrumb-separator'>&gt;</span>
						<Link
							to={`/wikipd/${currentContent.category.id}/${currentContent.subcategory.id}`}
						>
							{currentContent.subcategory.name}
						</Link>
						<span className='breadcrumb-separator'>&gt;</span>
						<span className='current-page'>{currentContent.data.name}</span>
					</>
				)}
			</div>
		);
	};

	// Render taxonomy list for overview page
	const renderTaxonomyList = () => {
		return (
			<div className='taxonomy-list-container'>
				<div className='taxonomy-categories'>
					{taxonomy.categories.map((category) => (
						<div className='taxonomy-category' key={category.id}>
							<h2 className='category-title'>
								<Link to={`/wikipd/${category.id}`}>{category.name}</Link>
							</h2>
							<div className='taxonomy-subcategories'>
								{category.subcategories.map((subcategory) => (
									<div className='taxonomy-subcategory' key={subcategory.id}>
										<h3 className='subcategory-title'>
											<Link to={`/wikipd/${category.id}/${subcategory.id}`}>
												{subcategory.name}
											</Link>
										</h3>
										<ul className='taxonomy-items'>
											{subcategory.items.map((item) => (
												<li className='taxonomy-item' key={item.id}>
													<Link
														to={`/wikipd/${category.id}/${subcategory.id}/${item.id}`}
													>
														{item.name}
													</Link>
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	// Render content based on current route
	const renderContent = () => {
		const currentContent = getCurrentContent();

		// If no params, show the full taxonomy tree or list
		if (!categoryId) {
			return (
				<div className='wikipd-overview'>
					<h1 className='wikipd-title'>WikiPD: Parkinson's Knowledge Base</h1>
					<p className='wikipd-description'>
						Welcome to the WikiPD knowledge base. This resource provides
						information about various aspects of life with Parkinson's,
						organized by categories, subcategories, and specific topics.
					</p>
					<div className='wikipd-view-controls'>
						{viewMode === 'tree' && (
							<div className='wikipd-zoom-controls'>
								<button
									onClick={() => handleZoom(false)}
									className='zoom-button'
									aria-label='Zoom out'
								>
									<span aria-hidden='true'>−</span>
								</button>
								<button
									onClick={resetZoom}
									className='zoom-button reset-zoom'
									aria-label='Reset zoom'
								>
									<span aria-hidden='true'>100%</span>
								</button>
								<button
									onClick={() => handleZoom(true)}
									className='zoom-button'
									aria-label='Zoom in'
								>
									<span aria-hidden='true'>+</span>
								</button>
							</div>
						)}
						<div className='wikipd-admin-controls'>
							<button
								onClick={toggleViewMode}
								className='view-toggle-button'
								aria-label={
									viewMode === 'tree'
										? 'Switch to list view'
										: 'Switch to tree view'
								}
							>
								{viewMode === 'tree' ? 'List View' : 'Tree View'}
							</button>
							<button
								onClick={handleResetTaxonomy}
								className='reset-button'
								aria-label='Reset all definitions to original state'
							>
								Reset All Definitions
							</button>
						</div>
					</div>

					{viewMode === 'tree' ? (
						<WikiPDTree taxonomy={taxonomy} zoomLevel={zoomLevel} />
					) : (
						renderTaxonomyList()
					)}
				</div>
			);
		}

		if (!currentContent) {
			return <div className='wikipd-error'>Content not found</div>;
		}

		// Render category content
		if (currentContent.type === 'category') {
			return (
				<div className='wikipd-category'>
					<h1 className='wikipd-title'>{currentContent.data.name}</h1>
					<div className='wikipd-section'>
						<h2 className='wikipd-section-title'>Goal</h2>
						<p className='wikipd-section-content'>{currentContent.data.goal}</p>
					</div>
					<div className='wikipd-section'>
						<h2 className='wikipd-section-title'>Subcategories</h2>
						<div className='wikipd-subcategories'>
							{currentContent.data.subcategories.map((subcategory) => (
								<div key={subcategory.id} className='wikipd-card'>
									<h3 className='wikipd-card-title'>
										<Link
											to={`/wikipd/${currentContent.data.id}/${subcategory.id}`}
										>
											{subcategory.name}
										</Link>
									</h3>
								</div>
							))}
						</div>
					</div>
				</div>
			);
		}

		// Render subcategory content
		if (currentContent.type === 'subcategory') {
			return (
				<div className='wikipd-subcategory'>
					<h1 className='wikipd-title'>{currentContent.data.name}</h1>
					<div className='wikipd-section'>
						<h2 className='wikipd-section-title'>Items</h2>
						<div className='wikipd-items'>
							{currentContent.data.items.map((item) => (
								<div key={item.id} className='wikipd-card'>
									<h3 className='wikipd-card-title'>
										<Link
											to={`/wikipd/${currentContent.category.id}/${currentContent.data.id}/${item.id}`}
										>
											{item.name}
										</Link>
									</h3>
									{item.definition && (
										<p className='wikipd-card-preview'>
											{item.definition.length > 100
												? `${item.definition.substring(0, 100)}...`
												: item.definition}
										</p>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			);
		}

		// Render item content
		if (currentContent.type === 'item') {
			const item = currentContent.data;
			return (
				<div className='wikipd-item'>
					<h1 className='wikipd-title'>{item.name}</h1>

					<div className='wikipd-section'>
						<div className='wikipd-section-header'>
							<h2 className='wikipd-section-title'>Definition</h2>
							{!editMode && (
								<button
									className='wikipd-edit-button'
									onClick={() => handleEdit('definition', item.definition)}
									aria-label='Edit definition'
									disabled={loading}
								>
									Edit
								</button>
							)}
						</div>

						{editMode && editingField === 'definition' ? (
							<div className='wikipd-edit-container'>
								<textarea
									className='wikipd-edit-textarea'
									value={editValue}
									onChange={(e) => setEditValue(e.target.value)}
									placeholder='Enter definition...'
									rows={5}
									disabled={loading}
								/>
								<div className='wikipd-edit-actions'>
									<button
										className='wikipd-save-button'
										onClick={handleSave}
										disabled={loading}
									>
										{loading ? 'Saving...' : 'Save'}
									</button>
									<button
										className='wikipd-cancel-button'
										onClick={handleCancel}
										disabled={loading}
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
							<div className='wikipd-section-content'>
								{item.definition || 'Definition to formulate'}
							</div>
						)}
					</div>

					<div className='wikipd-section'>
						<div className='wikipd-section-header'>
							<h2 className='wikipd-section-title'>Goal</h2>
							{!editMode && (
								<button
									className='wikipd-edit-button'
									onClick={() => handleEdit('subgoal', item.subgoal?.[0])}
									aria-label='Edit goal'
									disabled={loading}
								>
									Edit
								</button>
							)}
						</div>

						{editMode && editingField === 'subgoal' ? (
							<div className='wikipd-edit-container'>
								<textarea
									className='wikipd-edit-textarea'
									value={editValue}
									onChange={(e) => setEditValue(e.target.value)}
									placeholder='Enter goal...'
									rows={3}
									disabled={loading}
								/>
								<div className='wikipd-edit-actions'>
									<button
										className='wikipd-save-button'
										onClick={handleSave}
										disabled={loading}
									>
										{loading ? 'Saving...' : 'Save'}
									</button>
									<button
										className='wikipd-cancel-button'
										onClick={handleCancel}
										disabled={loading}
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
							<div className='wikipd-section-content'>
								{item.subgoal?.[0] || 'Goal to formulate'}
							</div>
						)}
					</div>

					<div className='wikipd-section'>
						<div className='wikipd-section-header'>
							<h2 className='wikipd-section-title'>Tracking Instructions</h2>
							{!editMode && (
								<button
									className='wikipd-edit-button'
									onClick={() =>
										handleEdit('trackingInstructions', item.subgoal?.[1])
									}
									aria-label='Edit tracking instructions'
									disabled={loading}
								>
									Edit
								</button>
							)}
						</div>

						{editMode && editingField === 'trackingInstructions' ? (
							<div className='wikipd-edit-container'>
								<textarea
									className='wikipd-edit-textarea'
									value={editValue}
									onChange={(e) => setEditValue(e.target.value)}
									placeholder='Enter tracking instructions...'
									rows={5}
									disabled={loading}
								/>
								<div className='wikipd-edit-actions'>
									<button
										className='wikipd-save-button'
										onClick={handleSave}
										disabled={loading}
									>
										{loading ? 'Saving...' : 'Save'}
									</button>
									<button
										className='wikipd-cancel-button'
										onClick={handleCancel}
										disabled={loading}
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
							<div className='wikipd-section-content'>
								{item.subgoal?.[1] || 'Tracking instructions to formulate'}
							</div>
						)}
					</div>
				</div>
			);
		}

		return <div className='wikipd-error'>Content not found</div>;
	};

	return (
		<div className='wikipd-page'>
			{notification.show && (
				<div className={`wikipd-notification ${notification.type}`}>
					{notification.message}
				</div>
			)}

			<div className='wikipd-top-navigation'>{renderBreadcrumbs()}</div>
			<div className='wikipd-content'>{renderContent()}</div>
		</div>
	);
};

export default WikiPDPage;
