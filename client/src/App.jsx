import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Profile from './pages/profile.jsx';
import Dashboard from './pages/dashboard.jsx';
import EditProfileModel from './components/editprofile.jsx';
import MyExperiences from './pages/explore.jsx';
import SubmitExperience from './pages/submitexperience.jsx';
import './App.css';
import AuthForm from './pages/authentication.jsx';
import Home from './pages/Home.jsx';
import MyContributions from './pages/MyContributions';

/**
 * A helper component to manage which pages show the Navbar
 * and to apply the main content padding.
 */
const AppLayout = () => {
    const location = useLocation();
    
    // CHANGE: Define the paths where you do NOT want the navbar to appear.
    // The home page ('/') should now show the navbar.
    const noNavbarPaths = ['/login', '/register']; // <-- CHANGE
    
    // Check if the current path is in the no-navbar list
    const showNavbar = !noNavbarPaths.includes(location.pathname);

    return (
        <>
            {showNavbar && <Navbar />}
            <main className={showNavbar ? "pt-28" : ""}>
                <Routes>
                    {/* The Home page is now the default entry point */}
                    <Route path="/" element={<Home />} /> {/* <-- CHANGE */}
                    
                    {/* The Authentication form now lives at /login */}
                    <Route path="/login" element={<AuthForm />} /> {/* <-- NEW */}
                    
                    {/* The /register path still correctly points to the AuthForm */}
                    <Route path="/register" element={<AuthForm />} />
                    
                    {/* All your other routes remain the same */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/editprofile" element={<EditProfileModel />} />
                    <Route path="/explore" element={<MyExperiences />} />
                    <Route path="/submitexperience" element={<SubmitExperience />} />
                    <Route path="/myexperience" element={<MyContributions />} />

                    {/* The old /home route is no longer needed, as "/" is the new home */}
                </Routes>
            </main>
        </>
    );
};

function App() {
    return (
        <Router>
            <AppLayout />
        </Router>
    );
}

export default App;