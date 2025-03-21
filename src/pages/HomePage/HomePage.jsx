import React from 'react';
import './HomePage.css';
import CareSection from '../../components/CareSection/CareSection';
import JournalSection from '../../components/JournalSection/JournalSection';

const HomePage = () => {
	return (
		<div className='home-page'>
			<div className='sections-container'>
				<CareSection />
				<JournalSection />
			</div>
		</div>
	);
};

export default HomePage;
