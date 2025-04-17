import React, { useState, useEffect } from 'react';
import './CafyConversation.css';
import { IoClose, IoTrashOutline } from 'react-icons/io5';
import { IoIosArrowBack } from 'react-icons/io';
import cafyLogo from '../../assets/CAFY_Online.png';
import taxonomyData from '../../taxonomy.json';
import InfoButton from '../InfoButton/InfoButton';

const CafyConversation = ({ onClose, onSavePriorities }) => {
	// State for managing conversation flow
	const [currentPage, setCurrentPage] = useState(1);
	const [conversationState, setConversationState] = useState('intro');
	const [currentCategory, setCurrentCategory] = useState(null);
	const [currentSubcategory, setCurrentSubcategory] = useState(null);

	// State for storing user selections
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedSubcategories, setSelectedSubcategories] = useState({});
	const [selectedItems, setSelectedItems] = useState({});
	const [finalSelections, setFinalSelections] = useState([]);

	// Determine the total number of pages dynamically
	const [totalPages, setTotalPages] = useState(1);

	// Calculate the number of pages based on user selections
	useEffect(() => {
		// Start with intro page
		let pages = 1;

		// Add a page for category selection
		if (conversationState !== 'intro') pages++;

		// Add pages for each selected category (subcategory selection)
		if (selectedCategories.length > 0) pages++;

		// Add a page for each subcategory with items
		Object.keys(selectedSubcategories).forEach((categoryId) => {
			if (selectedSubcategories[categoryId].length > 0) pages++;
		});

		// Add final confirmation page if we have any selections
		if (Object.keys(selectedItems).length > 0) pages++;

		setTotalPages(pages);
	}, [
		conversationState,
		selectedCategories,
		selectedSubcategories,
		selectedItems,
	]);

	// Helper function to get definition for a category, subcategory, or item
	const getDefinitionById = (id, type) => {
		if (type === 'category') {
			const category = taxonomyData.categories.find((cat) => cat.id === id);
			return category?.definition || 'Definition to formulate';
		} else if (type === 'subcategory') {
			const category = taxonomyData.categories.find(
				(cat) => cat.id === currentCategory
			);
			if (category) {
				const subcategory = category.subcategories.find((sub) => sub.id === id);
				return subcategory?.definition || 'Definition to formulate';
			}
		} else if (type === 'item') {
			const category = taxonomyData.categories.find(
				(cat) => cat.id === currentCategory
			);
			if (category) {
				const subcategory = category.subcategories.find(
					(sub) => sub.id === currentSubcategory
				);
				if (subcategory) {
					const item = subcategory.items.find((item) => item.id === id);
					return item?.definition || 'Definition to formulate';
				}
			}
		}
		return 'Definition to formulate';
	};

	const handleOptionChange = (id, type, isMultiple = true) => {
		if (type === 'category') {
			// Handle category selection
			setSelectedCategories((prev) => {
				if (prev.includes(id)) {
					// Remove the category if already selected
					const newCategories = prev.filter((catId) => catId !== id);

					// Also remove any subcategories and items from this category
					const newSubcategories = { ...selectedSubcategories };
					delete newSubcategories[id];
					setSelectedSubcategories(newSubcategories);

					const newItems = { ...selectedItems };
					Object.keys(newItems).forEach((key) => {
						if (key.startsWith(id)) {
							delete newItems[key];
						}
					});
					setSelectedItems(newItems);

					return newCategories;
				} else {
					// Add the category if not already selected
					return [...prev, id];
				}
			});
		} else if (type === 'subcategory') {
			// Handle subcategory selection
			const categoryId = currentCategory;

			setSelectedSubcategories((prev) => {
				const currentCategorySubcategories = prev[categoryId] || [];

				if (currentCategorySubcategories.includes(id)) {
					// Remove the subcategory if already selected
					const newSubcategories = {
						...prev,
						[categoryId]: currentCategorySubcategories.filter(
							(subId) => subId !== id
						),
					};

					// Also remove any items from this subcategory
					const newItems = { ...selectedItems };
					Object.keys(newItems).forEach((key) => {
						if (key.startsWith(`${categoryId}_${id}`)) {
							delete newItems[key];
						}
					});
					setSelectedItems(newItems);

					return newSubcategories;
				} else {
					// Add the subcategory if not already selected
					return {
						...prev,
						[categoryId]: [...currentCategorySubcategories, id],
					};
				}
			});
		} else if (type === 'item') {
			// Handle item selection
			const categoryId = currentCategory;
			const subcategoryId = currentSubcategory;
			const itemKey = `${categoryId}_${subcategoryId}_${id}`;

			setSelectedItems((prev) => {
				if (prev[itemKey]) {
					// Remove the item if already selected
					const newItems = { ...prev };
					delete newItems[itemKey];
					return newItems;
				} else {
					// Add the item if not already selected
					return {
						...prev,
						[itemKey]: {
							categoryId,
							subcategoryId,
							itemId: id,
						},
					};
				}
			});
		}
	};

	const isOptionSelected = (id, type) => {
		if (type === 'category') {
			return selectedCategories.includes(id);
		} else if (type === 'subcategory') {
			const categorySubcategories =
				selectedSubcategories[currentCategory] || [];
			return categorySubcategories.includes(id);
		} else if (type === 'item') {
			const itemKey = `${currentCategory}_${currentSubcategory}_${id}`;
			return !!selectedItems[itemKey];
		}
		return false;
	};

	const handleNext = () => {
		// Transition logic based on current state
		if (conversationState === 'intro') {
			setConversationState('categories');
			setCurrentPage(2);
		} else if (conversationState === 'categories') {
			if (selectedCategories.length > 0) {
				setConversationState('subcategories');
				setCurrentCategory(selectedCategories[0]);
				setCurrentPage(3);
			}
		} else if (conversationState === 'subcategories') {
			const currentCategoryIndex = selectedCategories.indexOf(currentCategory);
			const currentCategorySubcategories =
				selectedSubcategories[currentCategory] || [];

			if (currentCategorySubcategories.length > 0) {
				setConversationState('items');
				setCurrentSubcategory(currentCategorySubcategories[0]);
				setCurrentPage(4);
			} else if (currentCategoryIndex < selectedCategories.length - 1) {
				// Move to the next category
				setCurrentCategory(selectedCategories[currentCategoryIndex + 1]);
			} else {
				// Prepare final selections if we have any items selected
				if (Object.keys(selectedItems).length > 0) {
					prepareFinalSelections();
					setConversationState('confirmation');
					setCurrentPage(currentPage + 1);
				}
			}
		} else if (conversationState === 'items') {
			const currentCategoryIndex = selectedCategories.indexOf(currentCategory);
			const currentCategorySubcategories =
				selectedSubcategories[currentCategory] || [];
			const currentSubcategoryIndex =
				currentCategorySubcategories.indexOf(currentSubcategory);

			if (currentSubcategoryIndex < currentCategorySubcategories.length - 1) {
				// Move to the next subcategory
				setCurrentSubcategory(
					currentCategorySubcategories[currentSubcategoryIndex + 1]
				);
			} else if (currentCategoryIndex < selectedCategories.length - 1) {
				// Move to the next category
				setCurrentCategory(selectedCategories[currentCategoryIndex + 1]);
				setConversationState('subcategories');
			} else {
				// Prepare final selections
				prepareFinalSelections();
				setConversationState('confirmation');
				setCurrentPage(currentPage + 1);
			}
		} else if (conversationState === 'confirmation') {
			// Save priorities and close conversation
			onSavePriorities(finalSelections);
		}
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			if (conversationState === 'categories') {
				setConversationState('intro');
			} else if (conversationState === 'subcategories') {
				setConversationState('categories');
			} else if (conversationState === 'items') {
				const currentCategorySubcategories =
					selectedSubcategories[currentCategory] || [];
				const currentSubcategoryIndex =
					currentCategorySubcategories.indexOf(currentSubcategory);

				if (currentSubcategoryIndex > 0) {
					// Go to previous subcategory
					setCurrentSubcategory(
						currentCategorySubcategories[currentSubcategoryIndex - 1]
					);
				} else {
					// Go back to subcategories for this category
					setConversationState('subcategories');
				}
			} else if (conversationState === 'confirmation') {
				// Go back to the last item selection page
				const lastCategory = selectedCategories[selectedCategories.length - 1];
				const lastCategorySubcategories =
					selectedSubcategories[lastCategory] || [];

				if (lastCategorySubcategories.length > 0) {
					setCurrentCategory(lastCategory);
					setCurrentSubcategory(
						lastCategorySubcategories[lastCategorySubcategories.length - 1]
					);
					setConversationState('items');
				} else {
					setCurrentCategory(lastCategory);
					setConversationState('subcategories');
				}
			}

			setCurrentPage(currentPage - 1);
			// Scroll to the top when navigating
			document.querySelector('.cafy-conversation-content')?.scrollTo(0, 0);
		}
	};

	// Helper function to get category, subcategory or item name by ID
	const getNameById = (id, type) => {
		if (type === 'category') {
			const category = taxonomyData.categories.find((cat) => cat.id === id);
			return category ? category.name : '';
		} else if (type === 'subcategory') {
			const category = taxonomyData.categories.find(
				(cat) => cat.id === currentCategory
			);
			if (category) {
				const subcategory = category.subcategories.find((sub) => sub.id === id);
				return subcategory ? subcategory.name : '';
			}
			return '';
		} else if (type === 'item') {
			const category = taxonomyData.categories.find(
				(cat) => cat.id === currentCategory
			);
			if (category) {
				const subcategory = category.subcategories.find(
					(sub) => sub.id === currentSubcategory
				);
				if (subcategory) {
					const item = subcategory.items.find((item) => item.id === id);
					return item ? item.name : '';
				}
			}
			return '';
		}
		return '';
	};

	// Prepare the list of final selections for the confirmation page
	const prepareFinalSelections = () => {
		const selections = [];

		Object.entries(selectedItems).forEach(([key, item]) => {
			const { categoryId, subcategoryId, itemId } = item;

			// Find the category, subcategory, and item in the taxonomy
			const category = taxonomyData.categories.find(
				(cat) => cat.id === categoryId
			);
			if (category) {
				const subcategory = category.subcategories.find(
					(sub) => sub.id === subcategoryId
				);
				if (subcategory) {
					const itemObj = subcategory.items.find((i) => i.id === itemId);
					if (itemObj) {
						selections.push({
							id: key, // Use the composite key format: categoryId_subcategoryId_itemId
							category: category.name,
							subcategory: subcategory.name,
							item: itemObj.name,
							categoryId,
							subcategoryId,
							itemId,
						});
					}
				}
			}
		});

		console.log('Prepared final selections:', selections);
		setFinalSelections(selections);
	};

	// Remove a selected item from the confirmation page
	const handleRemoveSelection = (selectionId) => {
		// Remove the item from selectedItems
		setSelectedItems((prev) => {
			const newItems = { ...prev };
			delete newItems[selectionId];
			return newItems;
		});

		// Update finalSelections
		setFinalSelections((prev) =>
			prev.filter((item) => item.id !== selectionId)
		);
	};

	// Get the current category's question if available
	const getCurrentQuestion = () => {
		if (conversationState === 'categories') {
			return "Select the areas you'd like to focus on for your care priorities:";
		} else if (conversationState === 'subcategories' && currentCategory) {
			const category = taxonomyData.categories.find(
				(cat) => cat.id === currentCategory
			);
			return (
				category?.question ||
				`What specific aspects of ${category?.name} would you like to address?`
			);
		} else if (
			conversationState === 'items' &&
			currentCategory &&
			currentSubcategory
		) {
			return `Select the specific concerns you'd like to address:`;
		}
		return '';
	};

	// Handle adding more options after review
	const handleAddMore = () => {
		setConversationState('categories');
		setCurrentPage(2);
	};

	return (
		<div className='cafy-conversation-overlay'>
			<div
				className='cafy-conversation-modal'
				role='dialog'
				aria-labelledby='cafy-conversation-title'
			>
				<div className='cafy-conversation-header'>
					<div className='cafy-controls'>
						{currentPage > 1 ? (
							<button
								className='cafy-back-button'
								onClick={handlePrevious}
								aria-label='Go back to previous question'
							>
								<IoIosArrowBack aria-hidden='true' />
								<span>Previous</span>
							</button>
						) : (
							<div className='cafy-spacer'></div>
						)}
						<button
							className='cafy-close-button'
							onClick={onClose}
							aria-label='Close conversation'
						>
							<IoClose aria-hidden='true' size={24} color='white' />
						</button>
					</div>
				</div>

				<div className='cafy-progress-container'>
					<div
						className='cafy-progress-bar'
						style={{ width: `${(currentPage / totalPages) * 100}%` }}
						aria-valuemin='1'
						aria-valuemax={totalPages}
						aria-valuenow={currentPage}
						role='progressbar'
						aria-label={`Step ${currentPage} of ${totalPages}`}
					></div>
				</div>

				<div className='cafy-conversation-content'>
					{/* Introduction Page */}
					{conversationState === 'intro' && (
						<div className='cafy-page'>
							<div className='cafy-message-container'>
								<div className='cafy-message cafy-dark-box'>
									<div className='cafy-message-header'>
										<img
											src={cafyLogo}
											alt='CAFY Logo'
											className='cafy-conv-logo'
										/>
										<h2
											id='cafy-conversation-title'
											className='cafy-page-title'
										>
											Hello! My name is CAFY.
										</h2>
									</div>
									<p>
										I'm here to help you set your care priorities so that
										eCare-PD can provide you with care tips and resources for
										you. Let's start!
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Category Selection Page */}
					{conversationState === 'categories' && (
						<div className='cafy-page'>
							<div className='cafy-message-container'>
								<div className='cafy-message cafy-dark-box'>
									<div className='cafy-message-header'>
										<img
											src={cafyLogo}
											alt='CAFY Logo'
											className='cafy-conv-logo'
										/>
										<h2 className='cafy-page-title'>
											Let's identify your care priorities
										</h2>
									</div>
									<p>{getCurrentQuestion()}</p>
									<p>
										You can select multiple options that are important to you
										today.
									</p>
								</div>
							</div>

							<div className='cafy-options'>
								{taxonomyData.categories.map((category) => (
									<label
										key={category.id}
										className={`cafy-option ${
											isOptionSelected(category.id, 'category')
												? 'selected'
												: ''
										}`}
									>
										<input
											type='checkbox'
											checked={isOptionSelected(category.id, 'category')}
											onChange={() =>
												handleOptionChange(category.id, 'category')
											}
											name='category'
											value={category.id}
										/>
										<span className='cafy-checkbox'></span>
										<div className='cafy-option-content'>
											<span className='cafy-option-text'>{category.name}</span>
											<InfoButton
												definition={getDefinitionById(category.id, 'category')}
												ariaLabel={`Show definition for ${category.name}`}
											/>
										</div>
									</label>
								))}
							</div>
						</div>
					)}

					{/* Subcategory Selection Page */}
					{conversationState === 'subcategories' && currentCategory && (
						<div className='cafy-page'>
							<div className='cafy-message-container'>
								<div className='cafy-message cafy-dark-box'>
									<div className='cafy-message-header'>
										<img
											src={cafyLogo}
											alt='CAFY Logo'
											className='cafy-conv-logo'
										/>
										<h2 className='cafy-page-title'>
											{getNameById(currentCategory, 'category')}
										</h2>
									</div>
									<p>{getCurrentQuestion()}</p>
									<p>
										You can select multiple options that are important to you.
									</p>
								</div>
							</div>

							<div className='cafy-options'>
								{taxonomyData.categories
									.find((cat) => cat.id === currentCategory)
									?.subcategories.map((subcategory) => (
										<label
											key={subcategory.id}
											className={`cafy-option ${
												isOptionSelected(subcategory.id, 'subcategory')
													? 'selected'
													: ''
											}`}
										>
											<input
												type='checkbox'
												checked={isOptionSelected(
													subcategory.id,
													'subcategory'
												)}
												onChange={() =>
													handleOptionChange(subcategory.id, 'subcategory')
												}
												name='subcategory'
												value={subcategory.id}
											/>
											<span className='cafy-checkbox'></span>
											<div className='cafy-option-content'>
												<span className='cafy-option-text'>
													{subcategory.name}
												</span>
												<InfoButton
													definition={getDefinitionById(
														subcategory.id,
														'subcategory'
													)}
													ariaLabel={`Show definition for ${subcategory.name}`}
												/>
											</div>
										</label>
									))}
							</div>
						</div>
					)}

					{/* Item Selection Page */}
					{conversationState === 'items' &&
						currentCategory &&
						currentSubcategory && (
							<div className='cafy-page'>
								<div className='cafy-message-container'>
									<div className='cafy-message cafy-dark-box'>
										<div className='cafy-message-header'>
											<img
												src={cafyLogo}
												alt='CAFY Logo'
												className='cafy-conv-logo'
											/>
											<h2 className='cafy-page-title'>
												{getNameById(currentSubcategory, 'subcategory')}
											</h2>
										</div>
										<p>{getCurrentQuestion()}</p>
										<p>Select all that apply to your situation.</p>
									</div>
								</div>

								<div className='cafy-options'>
									{taxonomyData.categories
										.find((cat) => cat.id === currentCategory)
										?.subcategories.find((sub) => sub.id === currentSubcategory)
										?.items.map((item) => (
											<label
												key={item.id}
												className={`cafy-option ${
													isOptionSelected(item.id, 'item') ? 'selected' : ''
												}`}
											>
												<input
													type='checkbox'
													checked={isOptionSelected(item.id, 'item')}
													onChange={() => handleOptionChange(item.id, 'item')}
													name='item'
													value={item.id}
												/>
												<span className='cafy-checkbox'></span>
												<div className='cafy-option-content'>
													<span className='cafy-option-text'>{item.name}</span>
													<InfoButton
														definition={getDefinitionById(item.id, 'item')}
														ariaLabel={`Show definition for ${item.name}`}
													/>
												</div>
											</label>
										))}
								</div>
							</div>
						)}

					{/* Confirmation Page */}
					{conversationState === 'confirmation' && (
						<div className='cafy-page'>
							<div className='cafy-message-container'>
								<div className='cafy-message cafy-dark-box'>
									<div className='cafy-message-header'>
										<img
											src={cafyLogo}
											alt='CAFY Logo'
											className='cafy-conv-logo'
										/>
										<h2 className='cafy-page-title'>You have chosen:</h2>
									</div>
									{finalSelections.length > 0 ? (
										<ul className='cafy-summary-list'>
											{finalSelections.map((selection) => (
												<li key={selection.id} className='cafy-summary-item'>
													{selection.item}
													<button
														className='cafy-remove-button'
														onClick={() => handleRemoveSelection(selection.id)}
														aria-label={`Remove ${selection.item}`}
													>
														<IoTrashOutline />
													</button>
												</li>
											))}
										</ul>
									) : (
										<p>
											No selections made. Please go back and select your care
											priorities.
										</p>
									)}
								</div>
							</div>

							<div className='cafy-confirmation-options'>
								<div className='cafy-radio-group'>
									<button
										className='button secondary-button cafy-add-more-button'
										onClick={handleAddMore}
										aria-label='No, I want to add something'
									>
										No, I want to add something
									</button>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className='cafy-conversation-footer'>
					<button
						className='button primary-button cafy-next-button'
						onClick={handleNext}
						aria-label={
							conversationState === 'confirmation'
								? 'Confirm and save your care priorities'
								: 'Continue to next question'
						}
						disabled={
							(conversationState === 'categories' &&
								selectedCategories.length === 0) ||
							(conversationState === 'confirmation' &&
								finalSelections.length === 0)
						}
					>
						{conversationState === 'confirmation' ? 'Yes, confirm' : 'Next'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CafyConversation;
