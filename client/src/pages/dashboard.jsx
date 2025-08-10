import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExperienceCard from './experiencecard.jsx'; 
import { UserIcon } from '../components/icons/usericon.jsx'; 
import { ArrowRightIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };

            try {
                // Fetch user profile and all experiences in parallel
                const [profileRes, experiencesRes] = await Promise.all([
                    axios.get('http://localhost:5050/api/users/profile', config),
                    axios.get('http://localhost:5050/api/experiences')
                ]);
                
                setUser(profileRes.data);
                setExperiences(experiencesRes.data);

            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Could not load dashboard data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (isLoading) {
        // A simple loader that fits the new background better
        return (
            <div className="min-h-screen w-full flex items-center justify-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2670&auto=format&fit=crop')"}}>
                <div className="text-white text-xl font-semibold">Loading Dashboard...</div>
            </div>
        );
    }

    if (error || !user) {
        return <div className="text-center text-red-500 pt-10">{error || 'Could not load user data.'}</div>;
    }

    return (
        // --- THIS IS THE MAIN CHANGE ---
        // Applying the exact same background style as the authentication page
        <div 
            className="min-h-screen w-full p-4 sm:p-6 lg:p-8 bg-cover bg-center" 
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2670&auto=format&fit=crop')"}}
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:space-x-8">
                
                {/* --- Left Column (70%) - Experience Feed --- */}
                <div className="w-full md:w-8/12 lg:w-9/12">
                    {/* Restyled header to have the glass effect */}
                    <header className="mb-6 p-4 backdrop-blur-md bg-white/20 rounded-2xl border border-white/30">
                        <h1 className="text-4xl font-bold text-gray-800">Experience Feed</h1>
                        <p className="text-lg text-gray-700 mt-1">Discover insights from the community.</p>
                    </header>
                    <div className="space-y-6">
                        {experiences.length > 0 ? (
                            experiences.map(exp => <ExperienceCard key={exp._id} {...exp} />)
                        ) : (
                            // The "No experiences" card already has the right style
                            <div className="text-center p-10 backdrop-blur-lg bg-white/40 rounded-2xl border border-white/50">
                                <p className="text-gray-700 font-semibold">No experiences have been shared yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Right Column (30%) - Profile & Actions --- */}
                <div className="w-full md:w-4/12 lg:w-3/12 mt-8 md:mt-0">
                    <div className="sticky top-28 space-y-6">
                        
                        {/* Profile Card - This already has the correct styling */}
                        <div className="backdrop-blur-lg bg-white/40 p-6 rounded-2xl shadow-lg border border-white/50 text-center">
                            <div className="mx-auto h-24 w-24 bg-indigo-200 rounded-full flex items-center justify-center border-4 border-white">
                                <UserIcon className="h-14 w-14 text-indigo-600" />
                            </div>
                            <h2 className="mt-4 text-2xl font-bold text-gray-800">@{user.username}</h2>
                            <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
                            <button 
                                onClick={() => navigate('/profile')} 
                                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-white/80 text-indigo-700 font-semibold rounded-lg hover:bg-white transition-colors"
                            >
                                View Full Profile <ArrowRightIcon className="h-4 w-4 ml-2" />
                            </button>
                        </div>

                        {/* Actions Card - This also has the correct styling */}
                        <div className="backdrop-blur-lg bg-white/40 p-6 rounded-2xl shadow-lg border border-white/50 space-y-3">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3 border-gray-900/10">Quick Actions</h3>
                            <ActionButton onClick={() => navigate('/submitexperience')} label="Share an Experience" />
                            <ActionButton onClick={() => navigate('/myexperience')} label="My Contributions" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Reusable ActionButton for consistency
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