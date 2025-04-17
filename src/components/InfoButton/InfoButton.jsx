import React, { useState, useRef, useEffect } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import './InfoButton.css';

const InfoButton = ({ definition, ariaLabel }) => {
	const [showDefinition, setShowDefinition] = useState(false);
	const popupRef = useRef(null);
	const buttonRef = useRef(null);

	// Function to toggle the definition popup
	const toggleDefinition = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setShowDefinition(!showDefinition);
	};

	// Close the popup when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				showDefinition &&
				popupRef.current &&
				!popupRef.current.contains(event.target) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target)
			) {
				setShowDefinition(false);
			}
		};

		// Add event listener
		document.addEventListener('mousedown', handleClickOutside);

		// Remove event listener on cleanup
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showDefinition]);

	// Close on ESC key
	useEffect(() => {
		const handleEscKey = (event) => {
			if (event.key === 'Escape' && showDefinition) {
				setShowDefinition(false);
			}
		};

		document.addEventListener('keydown', handleEscKey);

		return () => {
			document.removeEventListener('keydown', handleEscKey);
		};
	}, [showDefinition]);

	// Focus handling
	useEffect(() => {
		if (showDefinition && popupRef.current) {
			// Set focus to the popup for accessibility
			popupRef.current.focus();
		}
	}, [showDefinition]);

	return (
		<div className='info-button-container'>
			<button
				ref={buttonRef}
				className='info-button'
				onClick={toggleDefinition}
				aria-label={ariaLabel || 'Show definition'}
				aria-expanded={showDefinition}
				aria-controls='definition-popup'
			>
				<IoInformationCircleOutline aria-hidden='true' />
			</button>

			{showDefinition && (
				<div
					ref={popupRef}
					id='definition-popup'
					className='definition-popup'
					role='dialog'
					aria-modal='true'
					tabIndex='-1'
				>
					<div className='definition-content'>
						<p>{definition || 'Definition to formulate'}</p>
						<button
							className='close-definition-button'
							onClick={() => setShowDefinition(false)}
							aria-label='Close definition'
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default InfoButton;
