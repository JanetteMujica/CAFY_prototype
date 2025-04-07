import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TrackingPage.css';

const TrackingPage = ({ onComplete }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const [selectedPriorities, setSelectedPriorities] = useState([]);
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [showForm, setShowForm] = useState(true);

	// Initialize responses state
	const [responses, setResponses] = useState([]);

	// Set up selected priorities from location state
	useEffect(() => {
		if (location.state && location.state.selectedPriorities) {
			setSelectedPriorities(location.state.selectedPriorities);

			// Initialize responses for each priority
			setResponses(
				location.state.selectedPriorities.map((priority) => ({
					priorityId: priority.id,
					rating: null,
					comment: '',
				}))
			);
		} else {
			// Redirect back to home if no priorities were passed
			navigate('/');
		}
	}, [location, navigate]);

	// Emoji options for rating
	const emojiOptions = [
		{ value: 5, emoji: '😊', description: 'Very good' },
		{ value: 4, emoji: '🙂', description: 'Good' },
		{ value: 3, emoji: '😐', description: 'Neutral' },
		{ value: 2, emoji: '🙁', description: 'Poor' },
		{ value: 1, emoji: '😣', description: 'Very poor' },
	];

	// Handle emoji selection
	const handleRatingSelect = (priorityIndex, rating) => {
		const updatedResponses = [...responses];
		updatedResponses[priorityIndex].rating = rating;
		setResponses(updatedResponses);
	};

	// Handle comment changes
	const handleCommentChange = (priorityIndex, comment) => {
		const updatedResponses = [...responses];
		updatedResponses[priorityIndex].comment = comment;
		setResponses(updatedResponses);
	};

	// Check if the form is valid for submission
	const isFormValid = () => {
		// Check if at least one rating is selected
		return responses.some((response) => response.rating !== null);
	};

	// Handle form submission
	const handleSubmit = () => {
		if (!isFormValid()) return;

		setSubmitting(true);

		// Simulate API call with timeout for people with Parkinson's
		// (giving them time to see that their action is being processed)
		setTimeout(() => {
			// Create journal entries from the responses
			const journalEntries = responses.map((response, index) => ({
				priorityId: response.priorityId,
				priorityTitle: selectedPriorities[index].title,
				rating: response.rating,
				comment: response.comment,
				date: new Date().toISOString(),
			}));

			// Call the completion handler with the entries
			if (onComplete) {
				onComplete(journalEntries);
			}

			// Update states
			setSubmitting(false);
			setSubmitted(true);
			setShowForm(false); // Hide the form and show only the success message
		}, 1500);
	};

	// Handle returning to home page
	const handleReturnHome = () => {
		navigate('/');
	};

	// If no priorities are loaded yet, show a loading state
	if (selectedPriorities.length === 0) {
		return <div className='tracking-page'>Loading...</div>;
	}

	return (
		<div className='tracking-page'>
			<h1 className='page-title'>Tracking Care Priorities</h1>

			{/* Success message shown after submission */}
			{submitted && (
				<div className='success-message-container'>
					<div className='success-message' role='status' aria-live='polite'>
						Your tracking has been submitted successfully!
					</div>

					<div className='tracking-actions success-actions'>
						<button
							className='button primary-button return-home-button'
							onClick={handleReturnHome}
							aria-label='Return to home page'
						>
							Return to Home
						</button>
					</div>
				</div>
			)}

			{/* Form only shown before submission */}
			{showForm && (
				<>
					<div className='tracking-cards-container'>
						{selectedPriorities.map((priority, priorityIndex) => (
							<div className='tracking-card' key={priority.id}>
								<div className='card-header'>
									<div className='title-container'>
										<h2 className='priority-name'>{priority.title}</h2>
										<p
											className='rating-instruction'
											id={`rating-instruction-${priority.id}`}
										>
											How are you feeling about your{' '}
											{priority.title.toLowerCase()} today?
										</p>
									</div>

									<div
										className='emoji-options'
										role='radiogroup'
										aria-labelledby={`rating-instruction-${priority.id}`}
									>
										{emojiOptions.map((option) => (
											<div
												className={`emoji-option ${
													responses[priorityIndex]?.rating === option.value
														? 'selected'
														: ''
												}`}
												key={option.value}
											>
												<button
													type='button'
													className='emoji-button'
													onClick={() =>
														handleRatingSelect(priorityIndex, option.value)
													}
													aria-label={option.description}
													aria-checked={
														responses[priorityIndex]?.rating === option.value
													}
													role='radio'
												>
													<span className='emoji'>{option.emoji}</span>
												</button>
												<span className='emoji-description'>
													{option.description}
												</span>
											</div>
										))}
									</div>
								</div>

								<div className='comment-container'>
									<label
										htmlFor={`comment-${priority.id}`}
										className='comment-label'
									>
										Add a personal note (optional):
									</label>
									<textarea
										id={`comment-${priority.id}`}
										className='comment-input'
										placeholder='Your thoughts, observations, or questions...'
										value={responses[priorityIndex]?.comment || ''}
										onChange={(e) =>
											handleCommentChange(priorityIndex, e.target.value)
										}
										rows={3}
									/>
								</div>
							</div>
						))}
					</div>

					<div className='tracking-actions'>
						<button
							className='button primary-button confirm-button'
							onClick={handleSubmit}
							disabled={submitting || !isFormValid()}
							aria-busy={submitting}
							aria-label='Save all tracking information'
						>
							{submitting ? 'Saving...' : 'Save'}
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default TrackingPage;
