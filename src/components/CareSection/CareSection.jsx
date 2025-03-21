import React from 'react';
import './CareSection.css';
// Import the SVG directly if you're using a bundler like Vite that supports it
import smileyRoboLogo from '../../assets/smileyRobo_color.svg';

const CareSection = () => {
	return (
		<section className='care-section' aria-labelledby='care-section-title'>
			<h2 className='section-title' id='care-section-title'>
				My Care Priorities
			</h2>
			<div className='cafy-container'>
				<div className='cafy-header'>
					<div className='cafy-logo-container' id='cafy-heading'>
						<img
							src={smileyRoboLogo}
							alt='CAFY Robot Logo'
							className='cafy-logo'
						/>
					</div>
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
