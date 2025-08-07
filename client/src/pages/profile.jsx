import React,{useState,useEffect} from 'react';
import {Link,useNavigate} from 'react-router-dom'
import { UserIcon } from '/src/components/icons/usericon.jsx';
import EditProfileModel from '/src/components/editprofile.jsx';
const Profile= ()=>{
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate= useNavigate();
    
    
    
    const [user, setUser] = useState({
        username:'',
        bio:'',
        goals:'',
        experiencesShared:0,
    })

    const handleLogOut=()=>{
        setIsLoggedIn(false);
        console.log("User logged out");
        navigate('./login');
    }
    const [isModelOpen, setIsModelOpen] = useState(false);
    const handleSaveChanges=(updatedData)=>{
        setUser({
            ...user,
            ...updatedData
        });
        setIsModelOpen(false);
        console.log("Profile updated", user);
    }

    return (
        <>
            <div className="bg-gray min-h-screen font-sans">
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
