/**
 * WikiPDService.js - Service for handling WikiPD data operations
 *
 * This service provides methods for retrieving and updating taxonomy data.
 * In a real application, this would connect to a backend API.
 * For demo purposes, it simulates API calls with localStorage.
 */

import taxonomyData from '../taxonomy.json';

// Initialize taxonomy in localStorage if not already present
const initTaxonomy = () => {
	if (!localStorage.getItem('taxonomy')) {
		localStorage.setItem('taxonomy', JSON.stringify(taxonomyData));
	}
	return JSON.parse(localStorage.getItem('taxonomy'));
};

// Get the current taxonomy (either from localStorage or original JSON)
const getTaxonomy = () => {
	try {
		return JSON.parse(localStorage.getItem('taxonomy')) || taxonomyData;
	} catch (error) {
		console.error('Error retrieving taxonomy:', error);
		return taxonomyData;
	}
};

// Get a specific item from the taxonomy
const getItem = (categoryId, subcategoryId, itemId) => {
	const taxonomy = getTaxonomy();

	const category = taxonomy.categories.find((cat) => cat.id === categoryId);
	if (!category) return null;

	const subcategory = category.subcategories.find(
		(sub) => sub.id === subcategoryId
	);
	if (!subcategory) return null;

	return subcategory.items.find((item) => item.id === itemId) || null;
};

// Update an item's definition
const updateItemDefinition = (
	categoryId,
	subcategoryId,
	itemId,
	definition
) => {
	const taxonomy = getTaxonomy();

	// Find the right category, subcategory, and item
	const categoryIndex = taxonomy.categories.findIndex(
		(cat) => cat.id === categoryId
	);
	if (categoryIndex === -1) return false;

	const subcategoryIndex = taxonomy.categories[
		categoryIndex
	].subcategories.findIndex((sub) => sub.id === subcategoryId);
	if (subcategoryIndex === -1) return false;

	const itemIndex = taxonomy.categories[categoryIndex].subcategories[
		subcategoryIndex
	].items.findIndex((item) => item.id === itemId);
	if (itemIndex === -1) return false;

	// Update the definition
	taxonomy.categories[categoryIndex].subcategories[subcategoryIndex].items[
		itemIndex
	].definition = definition;

	// Save the updated taxonomy
	localStorage.setItem('taxonomy', JSON.stringify(taxonomy));
	return true;
};

// Update an item's subgoal
const updateItemSubgoal = (categoryId, subcategoryId, itemId, index, value) => {
	const taxonomy = getTaxonomy();

	// Find the right category, subcategory, and item
	const categoryIndex = taxonomy.categories.findIndex(
		(cat) => cat.id === categoryId
	);
	if (categoryIndex === -1) return false;

	const subcategoryIndex = taxonomy.categories[
		categoryIndex
	].subcategories.findIndex((sub) => sub.id === subcategoryId);
	if (subcategoryIndex === -1) return false;

	const itemIndex = taxonomy.categories[categoryIndex].subcategories[
		subcategoryIndex
	].items.findIndex((item) => item.id === itemId);
	if (itemIndex === -1) return false;

	// Ensure the subgoal array exists
	const item =
		taxonomy.categories[categoryIndex].subcategories[subcategoryIndex].items[
			itemIndex
		];
	if (!item.subgoal) {
		item.subgoal = [];
	}

	// Update the subgoal
	item.subgoal[index] = value;

	// Save the updated taxonomy
	localStorage.setItem('taxonomy', JSON.stringify(taxonomy));
	return true;
};

// Export a method to reset the taxonomy to original state
const resetTaxonomy = () => {
	localStorage.setItem('taxonomy', JSON.stringify(taxonomyData));
	return true;
};

// Initialize the taxonomy when this module is imported
initTaxonomy();

export default {
	getTaxonomy,
	getItem,
	updateItemDefinition,
	updateItemSubgoal,
	resetTaxonomy,
};
