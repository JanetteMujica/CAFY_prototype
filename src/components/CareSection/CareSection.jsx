import React, { useState } from 'react';
import './CareSection.css';
// Import the PNG file
import cafyLogo from '../../assets/CAFY_online.png';
// Import the conversation component
import CafyConversation from '../CafyConversation/CafyConversation';

const CareSection = () => {
	const [showConversation, setShowConversation] = useState(false);
	const [prioritiesSet, setPrioritiesSet] = useState(false);

	const handleOpenConversation = () => {
		setShowConversation(true);
	};

	const handleCloseConversation = () => {
		setShowConversation(false);
	};

	const handleSavePriorities = () => {
		setPrioritiesSet(true);
		setShowConversation(false);
	};

	return (
		<section className='care-section' aria-labelledby='care-section-title'>
			<h2 className='section-title' id='care-section-title'>
				My Care Priorities
			</h2>

			{!prioritiesSet ? (
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
							Update my care priorities with CAFY
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
				// After priorities are set - show the three priority cards
				<div className='priorities-container'>
					{/* Pain Card */}
					<div className='priority-card'>
						<h3 className='priority-title'>Pain</h3>
						<p className='priority-description'>
							Your goal for next few weeks will be to find ways to manage pain
							and stay as comfortable as possible. I will suggest simple
							techniques to help you. Complete this short survey so I can better
							guide you.
						</p>
						<button className='button primary-button priority-button'>
							See tips now
						</button>
					</div>

					{/* Fatigue Card */}
					<div className='priority-card'>
						<h3 className='priority-title'>Fatigue</h3>
						<p className='priority-description'>
							Your goal for next few weeks will be to improve your energy levels
							by making small adjustments to your daily routine. I will provide
							personalized advice to help you feel less tired. Answer a few
							quick questions so I can guide you better.
						</p>
						<button className='button primary-button priority-button'>
							See tips now
						</button>
					</div>

					{/* Exercise Card */}
					<div className='priority-card'>
						<h3 className='priority-title'>Exercise</h3>
						<p className='priority-description'>
							Your goal for next few weeks will be to stay active by trying
							different ways to move that feel right for you. I will share
							simple exercises and movement tips to help you. Answer a few
							questions so I can personalize my advice.
						</p>
						<button className='button primary-button priority-button'>
							See tips now
						</button>
					</div>
				</div>
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
