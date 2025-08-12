import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChatBubbleBottomCenterTextIcon, ShareIcon, WrenchScrewdriverIcon, ArrowRightIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const Home = ({ isDashboardView = false }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location]);

    return (
        <div className="w-full">
            
            <section className="relative flex items-center justify-center text-center p-4 min-h-[60vh]">
                <div className="z-10 max-w-4xl mx-auto backdrop-blur-xl bg-white/20 rounded-2xl shadow-2xl p-8 md:p-12 border border-white/30">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-indigo-800">
                        Unlock the Code to Your Career
                    </h1>
                    <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-700">
                        A community-driven platform for real interview experiences. Learn from others who have been there, and share your own journey to help the next generation of talent.
                    </p>
                    <div className="mt-8 flex justify-center gap-4 flex-wrap">
                        <Link
                            to="/explore"
                            className="flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
                        >
                            Explore Experiences <ArrowRightIcon className="h-5 w-5 ml-2" />
                        </Link>
                        
                       
                        {isLoggedIn ? (
                            !isDashboardView && (
                                <Link
                                    to="/dashboard"
                                    className="flex items-center justify-center px-8 py-3 bg-white/50 text-indigo-700 font-semibold rounded-lg shadow-lg hover:bg-white/80 transition-all transform hover:scale-105"
                                >
                                    <UserCircleIcon className="h-5 w-5 mr-2" /> Go to Dashboard
                                </Link>
                             )
                        ) : (
                             <Link
                                to="/register"
                                className="flex items-center justify-center px-8 py-3 bg-white/50 text-indigo-700 font-semibold rounded-lg shadow-lg hover:bg-white/80 transition-all transform hover:scale-105"
                            >
                                Join the Community
                            </Link>
                        )}
                    </div>
                </div>
            </section>

           
            <section className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
               
            </section>

            {!isLoggedIn && (
                <section className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-12 mb-16">
                     <div className="text-center backdrop-blur-xl bg-white/20 rounded-2xl shadow-2xl p-8 md:p-12 border border-white/30">
                        <h2 className="text-4xl font-bold text-gray-800">Ready to Get Started?</h2>
                        <p className="mt-4 text-lg text-gray-600">Join thousands of professionals and students preparing for their next big opportunity.</p>
                         <Link
                            to="/register"
                            className="mt-6 inline-block px-10 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
                        >
                            Sign Up for Free
                        </Link>
                     </div>
                </section>
            )}
        </div>
    );
};

export default Home;