import React, { useState } from 'react';
import './CareSection.css';
import cafyLogo from '../../assets/CAFY_Online.png';
import CafyConversation from '../CafyConversation/CafyConversation';

const CareSection = () => {
	const [showConversation, setShowConversation] = useState(false);
	const [priorities, setPriorities] = useState([]);

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
		}));

		setPriorities(formattedPriorities);
		setShowConversation(false);
	};

	// Helper function to generate descriptions based on the priority title
	const generateDescription = (title) => {
		// Generate a personalized description based on the priority title
		return `Your goal for the next few weeks will be to focus on ${title.toLowerCase()}. Track your ${title.toLowerCase()} so I can provide you with care tips and ressources.`;
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
							Let's start! Update my care priorities
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
								<button className='button primary-button priority-button'>
									Track your {priority.title.toLowerCase()}
								</button>
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
