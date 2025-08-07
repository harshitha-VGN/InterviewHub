import React from 'react';
//import Home from './home.jsx';
import Profile from './profile.jsx';

const Dashboard=()=>{
    return (
        <div className="flex flex-col md:flex-row h-screen">
            <div className="w-full md:w-[30%]">
                <Profile />
            </div>
        </div>
    )
}

export default Dashboard;