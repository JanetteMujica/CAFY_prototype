import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import HomePage from './pages/HomePage/HomePage';
import TrackingPage from './pages/TrackingPage/TrackingPage';

function App() {
	return (
		<Router>
			<div className='app'>
				<a href='#main-content' className='skip-link'>
					Skip to main content
				</a>
				<Header />
				<div className='app-container'>
					<Sidebar />
					<main className='main-content' id='main-content' tabIndex='-1'>
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route
								path='/tracking'
								element={
									<TrackingPage
										onComplete={(journalEntries) => {
											// Add logic to save journal entries
											console.log('Journal entries:', journalEntries);
											// Navigate back to home
											window.history.back();
										}}
									/>
								}
							/>
							<Route path='*' element={<HomePage />} />
						</Routes>
					</main>
				</div>
			</div>
		</Router>
	);
}

export default App;
