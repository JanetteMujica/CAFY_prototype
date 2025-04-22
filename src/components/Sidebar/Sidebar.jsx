import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	// Updated navigation items - Added WikiPD as active
	const navItems = [
		{ name: 'Home', path: '/', active: true },
		{ name: 'Tracking', path: '/tracking', active: true },
		{ name: 'WikiPD', path: '/wikipd', active: true }, // Added WikiPD
		{ name: 'History', path: '/history', active: false },
		{ name: 'Journal', path: '/journal', active: false },
		{ name: 'Care Team', path: '/care-team', active: false },
		{ name: 'Care Finder', path: '/care-finder', active: false },
		{ name: 'Resources', path: '/resources', active: false },
	];

	const toggleMobileNav = () => {
		setMobileNavOpen(!mobileNavOpen);
	};

	// Close mobile nav when clicking outside
	const closeMobileNav = () => {
		if (mobileNavOpen) {
			setMobileNavOpen(false);
		}
	};

	return (
		<>
			{/* Mobile nav toggle button - only visible on small screens */}
			<button
				className='mobile-nav-toggle'
				onClick={toggleMobileNav}
				aria-label='Toggle navigation menu'
				aria-expanded={mobileNavOpen}
				aria-controls='sidebar-nav'
			>
				{mobileNavOpen ? 'Close Menu' : 'Open Menu'}
				<span className='hamburger-icon'>
					<span className={`bar ${mobileNavOpen ? 'open' : ''}`}></span>
				</span>
			</button>

			{/* Overlay for closing mobile nav */}
			{mobileNavOpen && (
				<div
					className='nav-overlay'
					onClick={closeMobileNav}
					aria-hidden='true'
				></div>
			)}

			{/* Sidebar navigation */}
			<nav
				className={`sidebar ${mobileNavOpen ? 'open' : ''}`}
				id='sidebar-nav'
			>
				<ul className='nav-list' role='menu'>
					{navItems.map((item, index) => (
						<li key={index} className='nav-item' role='none'>
							<NavLink
								to={item.path}
								className={({ isActive }) =>
									isActive ? 'nav-link active' : 'nav-link'
								}
								onClick={closeMobileNav}
								style={{
									pointerEvents: item.active ? 'auto' : 'none',
									opacity: item.active ? 1 : 0.5, // Visual indicator of disabled state
									cursor: item.active ? 'pointer' : 'not-allowed',
								}}
								role='menuitem'
								tabIndex={item.active ? 0 : -1}
								aria-disabled={!item.active}
								aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
							>
								{item.name}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
};

export default Sidebar;
