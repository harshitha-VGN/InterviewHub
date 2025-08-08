// // import React from 'react';
// // import {useNavigate} from 'react-router-dom';

// // const Navbar=()=>{
// //     const navigate=useNavigate();

// //     const handleProfileClick=()=>{
// //         if(window.innerwidth>=768){
// //             navigate('/dashboard')
// //         }else{
// //             navigate('/profile')
// //         }
// //     }
// //     return (
// //         <nav className="flex space-x-4">
// //             <button
// //                 id="home-button"
// //                 aria-label='Home'
// //                 data-role='nav-home'
// //                 onClick={() => navigate('/home')}
// //                 className="text-lg font-semibold"
// //                 >
// //                     Home
// //             </button>
// //             <button
// //                 id="explore-button"
// //                 aria-label='Explore'
// //                 data-role='nav-explore'
// //                 onClick={() => navigate('/explore')}
// //                 className="text-lg font-semibold"
// //                 >
// //                     Explore
// //             </button>
// //             <button
// //             id="profile-button"
// //             aria-label='Profile'
// //             data-role='nav-profile'
// //             onClick={handleProfileClick}
// //             >
// //                 <img src='/profile-icon.png' alt='Profile Icon' className='w-8 h-8 rounded-full' />
// //             </button>

// //         </nav>
// //     )
// // }

// // export default Navbar;
// import React, { useState, useEffect, useRef } from 'react';
// import { NavLink, useLocation, useNavigate } from 'react-router-dom';
// import { HomeIcon, MagnifyingGlassIcon, UserCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

// const Navbar = () => {
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const navigate = useNavigate();
//     const dropdownRef = useRef(null);

//     // This hook will close the dropdown if the user clicks outside of it
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsDropdownOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('username');
//         setIsDropdownOpen(false);
//         navigate('/register'); // Navigate to login page after logout
//     };

//     return (
//         <header className="fixed top-0 left-0 right-0 z-40 p-4">
//             <nav className="max-w-5xl mx-auto backdrop-blur-lg bg-white/30 rounded-full shadow-lg border border-white/40 flex items-center justify-between px-6 py-3">

//                 {/* Logo or Brand Name */}
//                 {/* Logo or Brand Name (Not a link) */}
//                 <div className="text-xl font-extrabold text-indigo-700 tracking-wider">
//                     Interview<span className="text-gray-800">Hub</span>
//                 </div>

//                 {/* Navigation Links */}
//                 <div className="hidden md:flex items-center space-x-2 bg-gray-200/50 rounded-full p-1">
//                     <NavItem to="/explore" icon={<MagnifyingGlassIcon className="h-5 w-5" />} label="Explore" />
//                     <NavItem to="/submitexperience" icon={<HomeIcon className="h-5 w-5" />} label="Share Experience" />
//                 </div>

//                 {/* Profile Icon and Dropdown */}
//                 <div className="relative" ref={dropdownRef}>
//                     <button
//                         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                         className="h-10 w-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 hover:ring-2 hover:ring-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
//                     >
//                         <UserCircleIcon className="h-7 w-7" />
//                     </button>

//                     {/* Dropdown Menu */}
//                     <div
//                         className={`absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 transition-all duration-200 ease-in-out z-50
//                                     ${isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
//                     >
//                         <div className="px-3 py-2 text-sm text-gray-500 border-b mb-1">
//                             Signed in as <br />
//                             <span className="font-bold text-gray-800">{localStorage.getItem('username') || 'User'}</span>
//                         </div>
//                         <DropdownItem to="/profile" label="My Profile" onClick={() => setIsDropdownOpen(false)} />
//                         <DropdownItem to="/myexperience" label="My Contributions" onClick={() => setIsDropdownOpen(false)} />
//                         <div className="h-px bg-gray-200 my-1"></div>
//                         <button
//                             onClick={handleLogout}
//                             className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
//                         >
//                             <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
//                             Log Out
//                         </button>
//                     </div>
//                 </div>

//             </nav>
//         </header>
//     );
// };

// // Reusable NavItem component for the main navigation
// const NavItem = ({ to, icon, label }) => {
//     const location = useLocation();
//     const isActive = location.pathname === to;

//     return (
//         <NavLink
//             to={to}
//             className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors
//                         ${isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-white/70'}`}
//         >
//             {icon}
//             <span>{label}</span>
//         </NavLink>
//     );
// };

// // Reusable DropdownItem component
// const DropdownItem = ({ to, label, onClick }) => (
//     <NavLink
//         to={to}
//         onClick={onClick}
//         className={({ isActive }) => `block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors 
//                                      ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
//     >
//         {label}
//     </NavLink>
// );

// export default Navbar;
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon, UserCircleIcon, ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation(); // Hook to listen for route changes
    const dropdownRef = useRef(null);

    // --- NEW: Check login status on load and on route change ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Set to true if token exists, false otherwise
    }, [location]); // Re-run this check every time the user navigates to a new page

    // This hook will close the dropdown if the user clicks outside of it
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
        setIsLoggedIn(false); // Update state immediately
        setIsDropdownOpen(false);
        navigate('/login'); // Navigate to login page after logout
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-40 p-4">
            <nav className="max-w-5xl mx-auto backdrop-blur-lg bg-white/30 rounded-full shadow-lg border border-white/40 flex items-center justify-between px-6 py-3">
                
                {/* Logo or Brand Name (Not a link) */}
                <div className="text-xl font-extrabold text-indigo-700 tracking-wider">
                    Interview<span className="text-gray-800">Hub</span>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-2 bg-gray-200/50 rounded-full p-1">
                    <NavItem to="/" icon={<HomeIcon className="h-5 w-5" />} label="Home" />
                    <NavItem to="/explore" icon={<MagnifyingGlassIcon className="h-5 w-5" />} label="Explore" />
                    {/* Only show "Share Experience" if logged in */}
                    {isLoggedIn && <NavItem to="/submitexperience" label="Share Experience" />}
                </div>

                {/* --- THIS IS THE MAIN CHANGE --- */}
                {/* Conditional rendering for Profile Icon vs. Login Button */}
                <div className="relative" ref={dropdownRef}>
                    {isLoggedIn ? (
                        // --- Show Profile Icon and Dropdown if LOGGED IN ---
                        <>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="h-10 w-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 hover:ring-2 hover:ring-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            >
                                <UserCircleIcon className="h-7 w-7" />
                            </button>

                            <div 
                                className={`absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 transition-all duration-200 ease-in-out z-50
                                            ${isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
                            >
                                <div className="px-3 py-2 text-sm text-gray-500 border-b mb-1">
                                    Signed in as <br />
                                    <span className="font-bold text-gray-800">{localStorage.getItem('username') || 'User'}</span>
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
                        // --- Show Login Button if NOT LOGGED IN ---
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
    );
};

// Reusable NavItem component for the main navigation
const NavItem = ({ to, icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <NavLink
            to={to}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors
                        ${isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-white/70'}`}
        >
            {icon}
            <span>{label}</span>
        </NavLink>
    );
};

// Reusable DropdownItem component
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