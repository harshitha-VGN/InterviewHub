import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from './Home.jsx';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

const ProfileSidebar = () => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5050/api/users/profile', config);
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch profile sidebar data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfile();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="backdrop-blur-lg bg-white/40 p-6 rounded-2xl shadow-lg border border-white/50 text-center">
                <p className="text-gray-600">Loading Profile...</p>
            </div>
        );
    }
    
    if (!user) {
        return null; 
    }

    return (
        <div className="sticky top-28 space-y-6">
            <div className="backdrop-blur-lg bg-white/40 p-6 rounded-2xl shadow-lg border border-white/50 text-center">
                <div className="mx-auto h-24 w-24 rounded-full flex items-center justify-center border-4 border-white/50 bg-indigo-700 shadow-lg">
                    <span className="text-5xl font-bold text-white text-shadow">
                        {user.username.charAt(0).toUpperCase()}
                    </span>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-800">@{user.username}</h2>
                <p className="text-sm text-gray-600 mt-1">{user.bio || "No bio yet."}</p>
                <button 
                    onClick={() => navigate('/profile')} 
                    className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-white/80 text-indigo-700 font-semibold rounded-lg hover:bg-white transition-colors"
                >
                    View Full Profile <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
            </div>
            <div className="backdrop-blur-lg bg-white/40 p-6 rounded-2xl shadow-lg border border-white/50 space-y-3">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3 border-gray-900/10">Quick Actions</h3>
                <ActionButton onClick={() => navigate('/submitexperience')} label="Share an Experience" />
                <ActionButton onClick={() => navigate('/myexperience')} label="My Contributions" />
            </div>
        </div>
    );
};

const Dashboard = () => {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row md:space-x-8">
            
            <div className="w-full md:w-8/12 lg:w-9/12">
              
                <Home isDashboardView={true} />
            </div>

            <div className="w-full md:w-4/12 lg:w-3/12 mt-8 md:mt-0">
                <ProfileSidebar />
            </div>

        </div>
    );
};

const ActionButton = ({ onClick, label }) => (
    <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 bg-gray-50/50 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
    >
        <span>{label}</span>
        <ArrowRightIcon className="h-5 w-5" />
    </button>
);


export default Dashboard;