import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import HomePage from './pages/HomePage/HomePage';
import TrackingPage from './pages/TrackingPage/TrackingPage';
import WikiPDPage from './pages/WikiPDPage/WikiPDPage';

function App() {
	return (
		<Router>
			<div className='app'>
				<a href='#main' className='skip-link'>
					Skip to main content
				</a>
				<Header />
				<div className='app-container'>
					<Sidebar />
					<main id='main' className='main-content' tabIndex='-1'>
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/tracking' element={<TrackingPage />} />
							{/* WikiPD routes */}
							<Route path='/wikipd' element={<WikiPDPage />} />
							<Route path='/wikipd/:categoryId' element={<WikiPDPage />} />
							<Route
								path='/wikipd/:categoryId/:subcategoryId'
								element={<WikiPDPage />}
							/>
							<Route
								path='/wikipd/:categoryId/:subcategoryId/:itemId'
								element={<WikiPDPage />}
							/>
							{/* Add other routes as needed */}
						</Routes>
					</main>
				</div>
			</div>
		</Router>
	);
}

export default App;
