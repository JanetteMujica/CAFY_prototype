import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CareSection.css';
import cafyLogo from '../../assets/CAFY_Online.png';
import watchIcon from '../../assets/watch.png';
import CafyConversation from '../CafyConversation/CafyConversation';
import InfoButton from '../InfoButton/InfoButton';
import taxonomy from '../../taxonomy.json';

const CareSection = () => {
	const [showConversation, setShowConversation] = useState(false);
	const [priorities, setPriorities] = useState([]);
	const navigate = useNavigate();

	// Item IDs that should display the Fitbit connection button
	const fitbitItemIds = ['insomnia', 'fatigue', 'exercise'];

	// Create a map of all items in the taxonomy for faster lookup
	const [itemMap, setItemMap] = useState({});

	// Initialize the item map from taxonomy when component mounts
	useEffect(() => {
		const map = {};

		// Populate the map with all items from the taxonomy
		taxonomy.categories.forEach((category) => {
			category.subcategories.forEach((subcategory) => {
				subcategory.items.forEach((item) => {
					// Store the full item object keyed by ID
					map[item.id] = {
						...item,
						categoryId: category.id,
						subcategoryId: subcategory.id,
					};
				});
			});
		});

		setItemMap(map);

		// Load any existing priorities from localStorage
		const storedPriorities = localStorage.getItem('allSelectedPriorities');
		if (storedPriorities) {
			try {
				const parsedPriorities = JSON.parse(storedPriorities);
				if (parsedPriorities.length > 0) {
					setPriorities(parsedPriorities);
				}
			} catch (error) {
				console.error('Error parsing stored priorities:', error);
			}
		}
	}, []);

	// Helper function to get definition for a priority
	const getDefinitionForPriority = (priorityId) => {
		const item = itemMap[priorityId];
		return item && item.definition
			? item.definition
			: 'Definition to formulate';
	};

	// Check if a priority ID should show the Fitbit button
	const shouldShowFitbitButton = (priorityId) => {
		// If we have a composite ID, extract the item ID part
		let itemId = priorityId;
		if (priorityId && priorityId.includes('_')) {
			const parts = priorityId.split('_');
			itemId = parts[parts.length - 1]; // Get the last part
		}

		return fitbitItemIds.includes(itemId);
	};

	const handleOpenConversation = () => {
		setShowConversation(true);
	};

	const handleCloseConversation = () => {
		setShowConversation(false);
	};

	const handleSavePriorities = (selectedPriorities) => {
		console.log('Received priorities:', selectedPriorities);

		// Transform the selected priorities into the format needed for display
		const formattedPriorities = selectedPriorities.map((priority) => {
			// Extract the item ID
			let actualItemId = priority.itemId;

			// If itemId is not provided directly, extract it from the composite ID
			if (!actualItemId && priority.id && priority.id.includes('_')) {
				const parts = priority.id.split('_');
				actualItemId = parts[parts.length - 1]; // Get the last part
			} else if (!actualItemId) {
				actualItemId = priority.id;
			}

			console.log(
				`Processing priority "${priority.item}" with ID: ${actualItemId}`
			);

			// Look up item in our map
			const item = itemMap[actualItemId];

			// Default values if item not found
			let goalTitle = 'Your goal is to focus on this priority.';
			let goalDescription =
				'Track this priority so I can provide you with care tips and resources.';

			// Use the item's subgoal if available
			if (item && item.subgoal && item.subgoal.length >= 2) {
				console.log(`Found matching item: ${item.name}`);
				goalTitle = item.subgoal[0];
				goalDescription = item.subgoal[1];
			} else {
				console.log(`No matching item found for ID: ${actualItemId}`);
			}

			return {
				// Store the actual item ID for consistent retrieval
				id: actualItemId,
				// Keep the original ID for reference
				originalId: priority.id,
				title: priority.item,
				goalTitle: goalTitle,
				goalDescription: goalDescription,
				category: priority.category,
				subcategoryId: priority.subcategoryId,
			};
		});

		console.log('Formatted priorities:', formattedPriorities);

		// Store all selected priorities in localStorage for tracking page
		localStorage.setItem(
			'allSelectedPriorities',
			JSON.stringify(formattedPriorities)
		);

		setPriorities(formattedPriorities);
		setShowConversation(false);
	};

	const handleConnectFitbit = () => {
		// Function to handle Fitbit connection
		console.log('Connecting to Fitbit...');
		// Implementation would go here
	};

	// Navigate to tracking page with ALL selected priorities
	const handleTrackPriority = (priority) => {
		// Even though we're navigating with just one priority,
		// the tracking page will show all priorities from localStorage
		navigate('/tracking', {
			state: {
				selectedPriorities: priorities,
			},
		});
	};

	return (
		<section className='care-section' aria-labelledby='care-section-title'>
			<h2 className='section-title' id='care-section-title'>
				My Care Priorities
			</h2>

			{priorities.length === 0 ? (
				// Initial state - show CAFY intro and button
				<div className='cafy-container'>
					<div className='cafy-header'>
						<img src={cafyLogo} alt='CAFY Robot Logo' className='cafy-logo' />
						<a
							href='#'
							className='link'
							aria-describedby='cafy-heading'
							onClick={(e) => {
								e.preventDefault();
								handleOpenConversation();
							}}
						>
							Select my care priorities with CAFY
						</a>
					</div>
					<div
						className='cafy-box'
						role='region'
						aria-labelledby='cafy-heading'
						id='cafy-heading'
					>
						<p>
							<strong>CAFY</strong> is your care assistant. It helps you set
							your care priorities so that eCare PD can provide the best care
							tips and resources for you.
						</p>
						<button
							className='button primary-button'
							aria-label='Update my care priorities with CAFY'
							onClick={handleOpenConversation}
						>
							Let's start! Select my care priorities
						</button>
					</div>
				</div>
			) : (
				// After priorities are set - show the priority cards
				<>
					<div className='cafy-header'>
						<img src={cafyLogo} alt='CAFY Robot Logo' className='cafy-logo' />
						<a
							href='#'
							className='link'
							aria-describedby='cafy-heading'
							onClick={(e) => {
								e.preventDefault();
								handleOpenConversation();
							}}
						>
							Update my care priorities with CAFY
						</a>
					</div>
					<div className='priorities-container'>
						{priorities.map((priority) => (
							<div
								className='priority-card'
								key={priority.originalId || priority.id}
							>
								<div className='priority-title-container'>
									<h3 className='priority-title'>{priority.title}</h3>
									<InfoButton
										definition={getDefinitionForPriority(priority.id)}
										ariaLabel={`Show definition for ${priority.title}`}
									/>
								</div>
								<section>
									<p className='priority-description'>
										<strong>{priority.goalTitle}</strong>{' '}
									</p>
									<p className='priority-description'>
										{priority.goalDescription}
									</p>
								</section>

								<div className='priority-buttons-container'>
									<button
										className='button primary-button priority-button'
										aria-label={`Track ${priority.title.toLowerCase()}`}
										onClick={() => handleTrackPriority(priority)}
									>
										Track {priority.title.toLowerCase()}
									</button>

									{shouldShowFitbitButton(priority.id) && (
										<button
											className='button secondary-button fitbit-button'
											onClick={handleConnectFitbit}
											aria-label='Connect your Fitbit device'
										>
											<img
												src={watchIcon}
												alt=''
												className='fitbit-button-icon'
												aria-hidden='true'
											/>
											<span className='fitbit-button-text'>Connect Fitbit</span>
										</button>
									)}
								</div>
								<p className='priority-description'>
									I'll share care tips and resources to help you reach your
									goal.
								</p>
							</div>
						))}
					</div>
				</>
			)}

			{/* Render the conversation component when showConversation is true */}
			{showConversation && (
				<CafyConversation
					onClose={handleCloseConversation}
					onSavePriorities={handleSavePriorities}
				/>
			)}
		</section>
	);
};

export default CareSection;
