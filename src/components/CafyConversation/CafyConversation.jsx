import React, { useState } from 'react';
import './CafyConversation.css';
import { IoClose } from 'react-icons/io5';
import { IoIosArrowBack } from 'react-icons/io';
import cafyLogo from '../../assets/CAFY_online.png';

// Add onSavePriorities prop to handle saving from parent component
const CafyConversation = ({ onClose, onSavePriorities }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedOptions, setSelectedOptions] = useState({
		page2: ['control', 'active'],
		page3: ['body-reactions', 'fatigue'],
		page4: ['pain', 'fatigue'],
		page5: ['staying-active'],
		page6: ['exercise-routine'],
		page7: ['yes'],
	});

	const totalPages = 7;

	// Note: In this prototype, the selections are pre-determined and not interactive
	const handleOptionChange = (page, option, isMultiple = true) => {
		// This function is kept for future implementation but doesn't change state
		// in the current prototype as selections are fixed
		console.log(`Selected ${option} on page ${page}`);
	};

	const isOptionSelected = (page, option) => {
		return selectedOptions[page]?.includes(option) || false;
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		} else {
			// If we're on the last page and the user clicks Next/Save
			// Call the onSavePriorities function passed from the parent
			if (onSavePriorities) {
				onSavePriorities();
			} else {
				onClose();
			}
		}
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
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
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='white'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<line x1='18' y1='6' x2='6' y2='18'></line>
								<line x1='6' y1='6' x2='18' y2='18'></line>
							</svg>
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
					{currentPage === 1 && (
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
										I'm here to help you set your care priorities so eCare PD
										can offer you the best care tips and resources. Let's get
										started.
									</p>
								</div>
							</div>
						</div>
					)}

					{currentPage === 2 && (
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
											Living with Parkinson's can affect your life in many ways.
											Everyone's experience is different.
										</h2>
									</div>
									<p>
										What are the biggest challenges for you right now? Select
										all options most important for you today.
									</p>
								</div>
							</div>

							<div className='cafy-options'>
								<label
									className={`cafy-option ${
										isOptionSelected('page2', 'control') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page2', 'control')}
										onChange={() => handleOptionChange('page2', 'control')}
										name='challenge'
										value='control'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>
										I want to feel more in control of my body
									</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page2', 'understand') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page2', 'understand')}
										onChange={() => handleOptionChange('page2', 'understand')}
										name='challenge'
										value='understand'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>
										I want to understand my physical symptoms
									</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page2', 'emotions') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page2', 'emotions')}
										onChange={() => handleOptionChange('page2', 'emotions')}
										name='challenge'
										value='emotions'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>
										I want to manage my emotions
									</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page2', 'think') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page2', 'think')}
										onChange={() => handleOptionChange('page2', 'think')}
										name='challenge'
										value='think'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>
										I want to think more clearly
									</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page2', 'active') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page2', 'active')}
										onChange={() => handleOptionChange('page2', 'active')}
										name='challenge'
										value='active'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>
										I want to stay active
									</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page2', 'tasks') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page2', 'tasks')}
										onChange={() => handleOptionChange('page2', 'tasks')}
										name='challenge'
										value='tasks'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>
										I want to manage my daily tasks
									</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page2', 'help') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page2', 'help')}
										onChange={() => handleOptionChange('page2', 'help')}
										name='challenge'
										value='help'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>
										I need help figuring it out
									</span>
								</label>
							</div>
						</div>
					)}

					{currentPage === 3 && (
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
											Are you experiencing challenges with movement, body
											control or physical sensations?
										</h2>
									</div>
									<p>Select all options most important for you today.</p>
								</div>
							</div>

							<div className='cafy-options'>
								<label
									className={`cafy-option ${
										isOptionSelected('page3', 'moving') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page3', 'moving')}
										onChange={() => handleOptionChange('page3', 'moving')}
										name='physical'
										value='moving'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>Moving and walking</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page3', 'body-reactions')
											? 'selected'
											: ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page3', 'body-reactions')}
										onChange={() =>
											handleOptionChange('page3', 'body-reactions')
										}
										name='physical'
										value='body-reactions'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>
										Body reactions and sensations
									</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page3', 'bladder') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page3', 'bladder')}
										onChange={() => handleOptionChange('page3', 'bladder')}
										name='physical'
										value='bladder'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>Bladder control</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page3', 'digestion') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page3', 'digestion')}
										onChange={() => handleOptionChange('page3', 'digestion')}
										name='physical'
										value='digestion'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>
										Digestion and swallowing
									</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page3', 'fatigue') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page3', 'fatigue')}
										onChange={() => handleOptionChange('page3', 'fatigue')}
										name='physical'
										value='fatigue'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>
										Fatigue and sleep disorders
									</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page3', 'sensory') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page3', 'sensory')}
										onChange={() => handleOptionChange('page3', 'sensory')}
										name='physical'
										value='sensory'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>Sensory changes</span>
								</label>
							</div>
						</div>
					)}

					{currentPage === 4 && (
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
											Be more specific about where you want to focus your care
											priorities.
										</h2>
									</div>
									<p>Select all options most important for you today.</p>
								</div>
							</div>

							<div className='cafy-options-group'>
								<h3 className='cafy-group-title'>
									Body Reactions and Sensations
								</h3>
								<div className='cafy-options'>
									<label
										className={`cafy-option ${
											isOptionSelected('page4', 'pain') ? 'selected' : ''
										}`}
									>
										<input
											type='checkbox'
											checked={isOptionSelected('page4', 'pain')}
											onChange={() => handleOptionChange('page4', 'pain')}
											name='specific'
											value='pain'
										/>
										<span className='cafy-checkbox'></span>
										<span className='cafy-option-text'>Pain</span>
									</label>

									<label
										className={`cafy-option ${
											isOptionSelected('page4', 'hypotension') ? 'selected' : ''
										}`}
									>
										<input
											type='checkbox'
											checked={isOptionSelected('page4', 'hypotension')}
											onChange={() =>
												handleOptionChange('page4', 'hypotension')
											}
											name='specific'
											value='hypotension'
										/>
										<span className='cafy-checkbox'></span>
										<span className='cafy-option-text'>
											Orthostatic hypotension
										</span>
									</label>

									<label
										className={`cafy-option ${
											isOptionSelected('page4', 'sweating') ? 'selected' : ''
										}`}
									>
										<input
											type='checkbox'
											checked={isOptionSelected('page4', 'sweating')}
											onChange={() => handleOptionChange('page4', 'sweating')}
											name='specific'
											value='sweating'
										/>
										<span className='cafy-checkbox'></span>
										<span className='cafy-option-text'>Sweating</span>
									</label>

									<label
										className={`cafy-option ${
											isOptionSelected('page4', 'skin') ? 'selected' : ''
										}`}
									>
										<input
											type='checkbox'
											checked={isOptionSelected('page4', 'skin')}
											onChange={() => handleOptionChange('page4', 'skin')}
											name='specific'
											value='skin'
										/>
										<span className='cafy-checkbox'></span>
										<span className='cafy-option-text'>Skin</span>
									</label>
								</div>
							</div>

							<div className='cafy-options-group'>
								<h3 className='cafy-group-title'>
									Fatigue and Sleep Disorders
								</h3>
								<div className='cafy-options'>
									<label
										className={`cafy-option ${
											isOptionSelected('page4', 'insomnia') ? 'selected' : ''
										}`}
									>
										<input
											type='checkbox'
											checked={isOptionSelected('page4', 'insomnia')}
											onChange={() => handleOptionChange('page4', 'insomnia')}
											name='specific'
											value='insomnia'
										/>
										<span className='cafy-checkbox'></span>
										<span className='cafy-option-text'>Insomnia</span>
									</label>

									<label
										className={`cafy-option ${
											isOptionSelected('page4', 'fatigue') ? 'selected' : ''
										}`}
									>
										<input
											type='checkbox'
											checked={isOptionSelected('page4', 'fatigue')}
											onChange={() => handleOptionChange('page4', 'fatigue')}
											name='specific'
											value='fatigue'
										/>
										<span className='cafy-checkbox'></span>
										<span className='cafy-option-text'>Fatigue</span>
									</label>

									<label
										className={`cafy-option ${
											isOptionSelected('page4', 'daytime-sleepiness')
												? 'selected'
												: ''
										}`}
									>
										<input
											type='checkbox'
											checked={isOptionSelected('page4', 'daytime-sleepiness')}
											onChange={() =>
												handleOptionChange('page4', 'daytime-sleepiness')
											}
											name='specific'
											value='daytime-sleepiness'
										/>
										<span className='cafy-checkbox'></span>
										<span className='cafy-option-text'>Daytime sleepiness</span>
									</label>

									<label
										className={`cafy-option ${
											isOptionSelected('page4', 'restless-legs')
												? 'selected'
												: ''
										}`}
									>
										<input
											type='checkbox'
											checked={isOptionSelected('page4', 'restless-legs')}
											onChange={() =>
												handleOptionChange('page4', 'restless-legs')
											}
											name='specific'
											value='restless-legs'
										/>
										<span className='cafy-checkbox'></span>
										<span className='cafy-option-text'>Restless legs</span>
									</label>
								</div>
							</div>
						</div>
					)}

					{currentPage === 5 && (
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
											Would you like to find ways to stay active, exercise and
											enjoy your hobbies?
										</h2>
									</div>
									<p>Select all options most important for you today.</p>
								</div>
							</div>

							<div className='cafy-options'>
								<label
									className={`cafy-option ${
										isOptionSelected('page5', 'staying-active')
											? 'selected'
											: ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page5', 'staying-active')}
										onChange={() =>
											handleOptionChange('page5', 'staying-active')
										}
										name='active'
										value='staying-active'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>Staying active</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page5', 'social') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page5', 'social')}
										onChange={() => handleOptionChange('page5', 'social')}
										name='active'
										value='social'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>
										Social life and relationships
									</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page5', 'diet') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page5', 'diet')}
										onChange={() => handleOptionChange('page5', 'diet')}
										name='active'
										value='diet'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>Diet and nutrition</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page5', 'tasks') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page5', 'tasks')}
										onChange={() => handleOptionChange('page5', 'tasks')}
										name='active'
										value='tasks'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>Managing daily tasks</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page5', 'medication') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page5', 'medication')}
										onChange={() => handleOptionChange('page5', 'medication')}
										name='active'
										value='medication'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>
										Medication and treatment options
									</span>
								</label>
							</div>
						</div>
					)}

					{currentPage === 6 && (
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
											Be more specific about where you want to manage your care
											priorities.
										</h2>
									</div>
									<p>Select all options most important for you today.</p>
								</div>
							</div>

							<div className='cafy-options'>
								<label
									className={`cafy-option ${
										isOptionSelected('page6', 'exercise-routine')
											? 'selected'
											: ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page6', 'exercise-routine')}
										onChange={() =>
											handleOptionChange('page6', 'exercise-routine')
										}
										name='specific-active'
										value='exercise-routine'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>Exercise routine</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page6', 'physical-activity')
											? 'selected'
											: ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page6', 'physical-activity')}
										onChange={() =>
											handleOptionChange('page6', 'physical-activity')
										}
										name='specific-active'
										value='physical-activity'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>Physical activity</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page6', 'hobbies') ? 'selected' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={isOptionSelected('page6', 'hobbies')}
										onChange={() => handleOptionChange('page6', 'hobbies')}
										name='specific-active'
										value='hobbies'
									/>
									<span className='cafy-checkbox'></span>
									<span className='cafy-option-text'>Hobbies</span>
								</label>
							</div>
						</div>
					)}

					{currentPage === 7 && (
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
									<ul className='cafy-summary-list'>
										<li>Pain</li>
										<li>Fatigue</li>
										<li>Exercise routine</li>
									</ul>
									<p>Does this look right?</p>
								</div>
							</div>

							<div className='cafy-options'>
								<label
									className={`cafy-option ${
										isOptionSelected('page7', 'yes') ? 'selected' : ''
									}`}
								>
									<input
										type='radio'
										checked={isOptionSelected('page7', 'yes')}
										onChange={() => handleOptionChange('page7', 'yes', false)}
										name='confirm'
										value='yes'
									/>
									<span className='cafy-radio'></span>
									<span className='cafy-option-text'>Yes</span>
								</label>

								<label
									className={`cafy-option ${
										isOptionSelected('page7', 'no') ? 'selected' : ''
									}`}
								>
									<input
										type='radio'
										checked={isOptionSelected('page7', 'no')}
										onChange={() => handleOptionChange('page7', 'no', false)}
										name='confirm'
										value='no'
									/>
									<span className='cafy-radio'></span>
									<span className='cafy-option-text'>
										No, I want to change something
									</span>
								</label>
							</div>
						</div>
					)}
				</div>

				<div className='cafy-conversation-footer'>
					<button
						className='button primary-button cafy-next-button'
						onClick={handleNext}
						aria-label={
							currentPage === totalPages
								? 'Finish and save your care priorities'
								: 'Continue to next question'
						}
					>
						{currentPage === totalPages ? 'Save my priorities' : 'Next'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CafyConversation;
