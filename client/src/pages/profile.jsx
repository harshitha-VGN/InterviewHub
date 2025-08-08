import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserIcon } from '/src/components/icons/usericon.jsx';
import EditProfileModel from '/src/components/editprofile.jsx';

const Profile = () => {
    const navigate = useNavigate();
    
    // State to hold user data, loading status, and errors
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModelOpen, setIsModelOpen] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            // Get the token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found, please log in.');
                setIsLoading(false);
                navigate('/register'); // Redirect to login if no token
                return;
            }

            try {
                // Set up the authorization header
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                
                // Fetch profile data from the protected endpoint
                const { data } = await axios.get('http://localhost:5050/api/users/profile', config);
                setUser(data);
                
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
                setError('Failed to fetch profile. Your session might have expired.');
                // Optional: Clear token and log out if it's invalid
                localStorage.removeItem('token');
                localStorage.removeItem('username');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]); // Add navigate to dependency array

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        console.log("User logged out");
        navigate('/home');
    };

    // const handleSaveChanges = (updatedData) => {
    //     // Here you would typically make an API call to save changes to the backend
    //     setUser({
    //         ...user,
    //         ...updatedData
    //     });
    //     setIsModelOpen(false);
    //     console.log("Profile updated on frontend", updatedData);
    // };
const handleSaveChanges = async (updatedData) => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Your session has expired. Please log in again.');
            navigate('/login');
            return;
        }

        try {
            // Set up the authorization header and request body
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            
            // Make the PUT request to our new endpoint
            const { data } = await axios.put(
                'http://localhost:5050/api/users/profile',
                updatedData, // The data from the modal form
                config
            );

            // Update the local state with the confirmed data from the server
            setUser(data);
            
            // If the username was changed, update it in localStorage as well
            if (localStorage.getItem('username') !== data.username) {
                localStorage.setItem('username', data.username);
            }

            setIsModelOpen(false); // Close the modal on success
            alert('Profile updated successfully!');

        } catch (error) {
            console.error('Failed to update profile:', error);
            // Show a more specific error if the server provides one
            const message = error.response?.data?.message || 'Failed to update profile. Please try again.';
            alert(message);
        }
    };
    // --- Conditional Rendering ---
    if (isLoading) {
        return <div className="text-center mt-20"><h1>Loading Profile...</h1></div>;
    }

    if (error || !user) {
        return (
            <div className="text-center mt-20">
                <h1 className="text-red-500">{error || 'Could not load profile.'}</h1>
                <Link to="/login" className="text-blue-500 hover:underline">Please Login Again</Link>
            </div>
        );
    }

    // --- Main JSX when data is loaded ---
    return (
        <>
            <div className="bg-gray-100 min-h-screen font-sans">
                <div className="container mx-auto p-4 md:p-8 max-w-4xl">
                    <div className="bg-white rounded-lg shadow-md p-6 m-6">
                        <div className="flex items-center space-x-6">
                            <div className="flex-shrink-0">
                                <div className="h-20 w-20 md:h-24 md:w-24 bg-indigo-200 rounded-full flex items-center justify-center">
                                    <UserIcon className="h-12 w-12 md:h-14 md:w-14 text-indigo-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">@{user.username}</h1>
                                <p className="text-gray-600 mt-1">{user.bio}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* --- Left Column (Goals & Stats) --- */}
                        <div className="md:col-span-2 space-y-6">
                        {/* Career Goals Card */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">Career Goals</h2>
                                <blockquote className="border-l-4 border-indigo-500 pl-4">
                                <p className="text-gray-700 italic">{user.goals}</p>
                                </blockquote>
                            </div>
                        
                        {/* Experience Stats Card */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">My Contributions</h2>
                                <Link to="/myexperience" className="block group">
                                <div className="bg-gray-50 p-4 rounded-lg text-center transition-transform transform group-hover:scale-105 group-hover:shadow-lg">
                                    <p className="text-4xl font-bold text-indigo-600">{user.experiencesShared}</p>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Experiences Shared</p>
                                </div>
                                </Link>
                            </div>
                        </div>
                        {/* Account Settings */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
                                <div className="space-y-3">
                                        <button onClick={() => setIsModelOpen(true)}
                                            className="w-full text-left p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            ✏️ Edit Profile
                                        </button>
                                        <button
                                            onClick={handleLogOut}
                                            className="w-full text-left p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            🚪 Log Out
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
                />
            )}
        </>
    )
}

export default Profile;