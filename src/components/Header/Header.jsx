import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
	return (
		<header className='header' role='banner'>
			<div className='logo'>
				<Link to='/' className='logo-link' aria-label='eCarePD Home'>
					<h1>eCarePD</h1>
				</Link>
			</div>
			{/* The mobile navigation toggle button is in the Sidebar component */}
		</header>
	);
};

export default Header;
