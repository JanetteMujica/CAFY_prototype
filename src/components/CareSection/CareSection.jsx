import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CareSection.css';
import cafyLogo from '../../assets/CAFY_Online.png';
import watchIcon from '../../assets/watch.png';
import CafyConversation from '../CafyConversation/CafyConversation';

const CareSection = () => {
	const [showConversation, setShowConversation] = useState(false);
	const [priorities, setPriorities] = useState([]);
	const navigate = useNavigate();

	// Subcategories that should display the Fitbit connection button
	const fitbitSubcategories = ['sleep_disorders', 'staying_active'];

	// Check if a priority belongs to a subcategory that should show the Fitbit button
	const shouldShowFitbitButton = (subcategoryId) => {
		return fitbitSubcategories.includes(subcategoryId);
	};

	const handleOpenConversation = () => {
		setShowConversation(true);
	};

	const handleCloseConversation = () => {
		setShowConversation(false);
	};

	const handleSavePriorities = (selectedPriorities) => {
		// Transform the selected priorities into the format needed for display
		const formattedPriorities = selectedPriorities.map((priority) => ({
			id: priority.id,
			title: priority.item,
			description: generateDescription(priority.item),
			category: priority.category,
			subcategoryId: priority.subcategoryId, // Store the subcategory ID
		}));

		setPriorities(formattedPriorities);
		setShowConversation(false);
	};

	// Helper function to generate descriptions based on the priority title
	const generateDescription = (title) => {
		// Generate a personalized description based on the priority title
		return `Your goal for the next few weeks will be to focus on ${title.toLowerCase()}. Track your ${title.toLowerCase()} so I can provide you with care tips and ressources.`;
	};

	const handleConnectFitbit = () => {
		// Function to handle Fitbit connection
		console.log('Connecting to Fitbit...');
		// Implementation would go here
	};

	// Navigate to tracking page with the selected priority
	const handleTrackPriority = (priority) => {
		navigate('/tracking', {
			state: {
				selectedPriorities: [priority],
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
							<div className='priority-card' key={priority.id}>
								<h3 className='priority-title'>{priority.title}</h3>
								<p className='priority-description'>{priority.description}</p>
								<div className='priority-buttons-container'>
									<button
										className='button primary-button priority-button'
										aria-label={`Track ${priority.title.toLowerCase()}`}
										onClick={() => handleTrackPriority(priority)}
									>
										Track {priority.title.toLowerCase()}
									</button>

									{shouldShowFitbitButton(priority.subcategoryId) && (
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
