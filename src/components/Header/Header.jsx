import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
	return (
		<header className='header' role='banner'>
			<div className='logo'>
				<Link to='/' className='logo-link' aria-label='eCarePD Home'>
					<h1>
						<span className='logo-primary'>eCare</span>
						<span className='logo-secondary'>PD</span>
					</h1>
				</Link>
			</div>
		</header>
	);
};

export default Header;
