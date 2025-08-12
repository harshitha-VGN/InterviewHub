import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon, ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, DocumentChartBarIcon } from '@heroicons/react/24/solid';

import Toast from './Toast';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [toast, setToast] = useState({ message: null, type: 'error' });

    const navigate = useNavigate();
    const location = useLocation(); 
    const dropdownRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); 
        if (token) {
            setUsername(localStorage.getItem('username') || '');
        }
    }, [location]); 

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false); 
        setUsername('');
        setIsDropdownOpen(false);
        setToast({ message: 'You have been logged out successfully.', type: 'success' });
        setTimeout(() => navigate('/login'), 1500);
    };

    const handleProtectedClick = (e) => {
        e.preventDefault();
        setToast({ 
            message: 'Please log in or sign up to use this feature.', 
            type: 'error' 
        });
    };

    const handleDismissToast = () => {
        setToast({ message: null, type: 'error' });
    };

    return (
        <>
            <Toast
                message={toast.message}
                type={toast.type}
                onDismiss={handleDismissToast}
            />

            <header className="fixed top-0 left-0 right-0 z-30 p-4">
                <nav className="max-w-5xl mx-auto backdrop-blur-lg bg-white/30 rounded-full shadow-lg border border-white/40 flex items-center justify-between px-6 py-3">
                    
                    <div className="text-xl font-extrabold text-indigo-700 tracking-wider">
                        Interview<span className="text-gray-800">Hub</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-2 bg-gray-200/50 rounded-full p-1">
                        <NavItem 
                            to="/" 
                            icon={<HomeIcon className="h-5 w-5" />} 
                            label="Home" 
                        />
                        <NavItem 
                            to="/explore" 
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />} 
                            label="Explore" 
                            isProtected 
                            isLoggedIn={isLoggedIn}
                            onProtectedClick={handleProtectedClick}
                        />
                        <NavItem 
                            to="/resume-analyzer" 
                            icon={<DocumentChartBarIcon className="h-5 w-5" />}
                            label="Resume Editor" 
                            isProtected
                            isLoggedIn={isLoggedIn}
                            onProtectedClick={handleProtectedClick}
                        />
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        {isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="h-10 w-10 rounded-full flex items-center justify-center bg-indigo-700 text-white font-bold text-lg hover:ring-2 hover:ring-white/80 focus:outline-none focus:ring-2 focus:ring-white transition-all text-shadow"
                                >
                                    {username ? username.charAt(0).toUpperCase() : '?'}
                                </button>

                                <div 
                                    className={`absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 transition-all duration-200 ease-in-out z-50
                                                ${isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
                                >
                                    <div className="px-3 py-2 text-sm text-gray-500 border-b mb-1">
                                        Signed in as <br />
                                        <span className="font-bold text-gray-800">{username || 'User'}</span>
                                    </div>
                                    <DropdownItem to="/profile" label="My Profile" onClick={() => setIsDropdownOpen(false)} />
                                    <DropdownItem to="/myexperience" label="My Contributions" onClick={() => setIsDropdownOpen(false)} />
                                    <div className="h-px bg-gray-200 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                                    >
                                        <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                                        Log Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <NavLink 
                                to="/login"
                                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                            >
                                <span>Login / Sign Up</span>
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            </NavLink>
                        )}
                    </div>
                </nav>
            </header>
        </>
    );
};


const NavItem = ({ to, icon, label, isProtected = false, isLoggedIn, onProtectedClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    const classes = `flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
        isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-white/70'
    }`;

    if (isProtected && !isLoggedIn) {
        return (
            <button onClick={onProtectedClick} className={classes}>
                {icon}
                <span>{label}</span>
            </button>
        );
    }

    return (
        <NavLink to={to} className={classes}>
            {icon}
            <span>{label}</span>
        </NavLink>
    );
};


const DropdownItem = ({ to, label, onClick }) => (
    <NavLink
        to={to} 
        onClick={onClick}
        className={({ isActive }) => `block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors 
                                     ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
    >
        {label}
    </NavLink>
);

export default Navbar;