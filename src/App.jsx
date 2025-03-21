import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import HomePage from './pages/HomePage/HomePage';

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
							<Route path='*' element={<HomePage />} />
						</Routes>
					</main>
				</div>
			</div>
		</Router>
	);
}

export default App;
