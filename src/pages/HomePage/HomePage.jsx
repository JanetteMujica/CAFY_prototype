import React from 'react';
import './HomePage.css';
// You can temporarily remove these imports until you create those components
// import CareSection from '../../components/CareSection/CareSection'
// import JournalSection from '../../components/JournalSection/JournalSection'

const HomePage = () => {
	return (
		<div className='home-page'>
			{/* Temporary placeholders until you create the actual components */}
			<section className='care-section'>
				<h2>My Care Priorities</h2>
				<p>Care priorities section will go here</p>
			</section>

			<section className='journal-section'>
				<h2>Daily Journal</h2>
				<p>Journal section will go here</p>
			</section>

			{/* Once you've created the components, you can uncomment these */}
			{/* <CareSection />
      <JournalSection /> */}
		</div>
	);
};

export default HomePage;
