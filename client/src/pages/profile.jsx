import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast'; 
import EditProfileModel from '../components/editprofile.jsx';
import { ArrowRightIcon, PencilSquareIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [toast, setToast] = useState({ message: null, type: '' });
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
                console.error('Failed to fetch user profile:', err);
                if (err.response && err.response.status === 401) {
                    setError('Your session has expired. Please log in again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                     setTimeout(() => navigate('/login'), 3000);
                } else {
                    setError('Failed to fetch profile. Please try again later.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfile();
    }, [navigate]);

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToast({ message: 'You have been logged out.', type: 'success' });
        setTimeout(() => navigate('/login'), 1500); 
    };

    const handleDismissToast = () => {
        setToast({ message: null, type: '' });
    };

    const handleSaveChanges = async (updatedData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
            const { data } = await axios.put('http://localhost:5050/api/users/profile', updatedData, config);
            setUser(data);
            if (localStorage.getItem('username') !== data.username) {
                localStorage.setItem('username', data.username);
            }
            setIsModelOpen(false);
            setToast({ message: 'Profile updated successfully!', type: 'success' });
        } catch (error) {
            console.error('Failed to update profile:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update profile.';
           setToast({ message: errorMessage, type: 'error' });
        }
    };
    
    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2670&auto=format&fit=crop')" }}>
                <div className="text-white text-xl font-semibold backdrop-blur-sm bg-black/20 px-6 py-3 rounded-xl">Loading Profile...</div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="text-center mt-20">
                <h1 className="text-red-500">{error || 'Could not load profile.'}</h1>
                <Link to="/login" className="text-blue-500 hover:underline">Please Login Again</Link>
            </div>
        );
    }


    return (
        <>
            <Toast 
                message={toast.message}
                type={toast.type}
                onDismiss={handleDismissToast}
            />
            <div className="min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2670&auto=format&fit=crop')" }}>
                <div className="container mx-auto p-4 md:p-8 max-w-5xl">

                   <div className="backdrop-blur-xl bg-white/30 rounded-2xl shadow-lg p-6 mb-6 border border-white/40">
                        <div className="flex items-center space-x-6">
                            <div className="flex-shrink-0">
                                <div className="h-24 w-24 rounded-full flex items-center justify-center border-4 border-white/50 bg-indigo-700 shadow-lg">
                                    <span className="text-5xl font-bold text-white text-shadow">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">@{user.username}</h1>
                                <p className="text-gray-700 mt-1">{user.bio}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <div className="backdrop-blur-xl bg-white/30 rounded-2xl shadow-lg p-6 border border-white/40">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Career Goals</h2>
                                <blockquote className="border-l-4 border-indigo-500 pl-4">
                                    <p className="text-gray-700 italic text-lg">{user.goals}</p>
                                </blockquote>
                            </div>

                            <div className="backdrop-blur-xl bg-white/30 rounded-2xl shadow-lg p-6 border border-white/40">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-3">My Contributions</h2>
                                <Link to="/myexperience" className="block group">
                                    <div className="bg-white/50 p-6 rounded-xl text-center transition-all transform group-hover:scale-105 group-hover:shadow-xl">
                                        <p className="text-5xl font-bold text-indigo-600">{user.experiencesShared}</p>
                                        <p className="text-md font-medium text-gray-600 mt-1">Experiences Shared</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            <div className="backdrop-blur-xl bg-white/30 rounded-2xl shadow-lg p-6 border border-white/40">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Settings</h2>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setIsModelOpen(true)}
                                        className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 bg-white/40 rounded-lg hover:bg-white/80 transition-colors"
                                    >
                                        <span className="flex items-center">
                                            <PencilSquareIcon className="h-5 w-5 mr-3 text-gray-600" />
                                            Edit Profile
                                        </span>
                                        <ArrowRightIcon className="h-5 w-5 text-gray-500" />
                                    </button>

                                    <button
                                        onClick={handleLogOut}
                                        className="w-full flex justify-between items-center p-3 text-left font-medium text-red-600 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                                    >
                                        <span className="flex items-center">
                                            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                                            Log Out
                                        </span>
                                        <ArrowRightIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {isModelOpen && (
                <EditProfileModel
                    currentUser={user}
                    onClose={() => setIsModelOpen(false)}
                    onSave={handleSaveChanges}
                    notification={toast}
                    onClearNotification={() => setToast({ message: null, type: '' })}
                />
            )}
        </>
    )
}

export default Profile;