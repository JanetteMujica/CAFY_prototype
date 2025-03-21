import React, { useState } from 'react';
import './JournalSection.css';

const JournalSection = () => {
	const [journalEntry, setJournalEntry] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!journalEntry.trim()) return;

		setSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			setSubmitting(false);
			setSubmitted(true);
			setJournalEntry('');

			// Reset submission message after 3 seconds
			setTimeout(() => {
				setSubmitted(false);
			}, 3000);
		}, 1000);
	};

	return (
		<section
			className='journal-section'
			aria-labelledby='journal-section-title'
		>
			<h2 className='section-title' id='journal-section-title'>
				Daily Journal
			</h2>
			<div className='journal-form'>
				<h3 className='journal-subtitle' id='journal-guidance'>
					How are you today? What's going well? Are you having any issues or
					concerns?
				</h3>

				{submitted && (
					<div className='success-message' role='status' aria-live='polite'>
						Your journal entry has been submitted successfully!
					</div>
				)}

				<form onSubmit={handleSubmit} aria-labelledby='journal-section-title'>
					<div className='form-group'>
						<label htmlFor='journal-entry' className='form-label'>
							Your Journal Entry
						</label>
						<textarea
							id='journal-entry'
							className='journal-input'
							value={journalEntry}
							onChange={(e) => setJournalEntry(e.target.value)}
							placeholder='Share your thoughts here...'
							rows={5}
							aria-describedby='journal-guidance'
							required
						></textarea>
					</div>

					<button
						type='submit'
						className='button primary-button'
						disabled={submitting || !journalEntry.trim()}
						aria-busy={submitting}
					>
						{submitting ? 'Sending...' : 'Send to Journal'}
					</button>
				</form>
			</div>
		</section>
	);
};

export default JournalSection;
