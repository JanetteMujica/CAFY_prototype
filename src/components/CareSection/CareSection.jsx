import React from 'react';
import './CareSection.css';

const CareSection = () => {
	return (
		<section className='care-section' aria-labelledby='care-section-title'>
			<h2 className='section-title' id='care-section-title'>
				My Care Priorities
			</h2>
			<div className='cafy-container'>
				<div className='cafy-header'>
					<h3 id='cafy-heading'>CAFY</h3>
					<a
						href='#update-priorities'
						className='link'
						aria-describedby='cafy-heading'
					>
						Update my care priorities with CAFY
					</a>
				</div>
				<div className='cafy-box' role='region' aria-labelledby='cafy-heading'>
					<p>
						<strong>CAFY</strong> is your care assistant. It helps you set your
						care priorities so that eCare PD can provide the best care tips and
						resources for you.
					</p>
					<button
						className='button primary-button'
						aria-label='Update my care priorities with CAFY'
					>
						Let's start! Update my care priorities
					</button>
				</div>
			</div>
		</section>
	);
};

export default CareSection;
