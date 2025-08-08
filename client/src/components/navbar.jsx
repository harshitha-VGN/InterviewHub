import React from 'react';
import {useNavigate} from 'react-router-dom';

const Navbar=()=>{
    const navigate=useNavigate();

    const handleProfileClick=()=>{
        if(window.innerwidth>=768){
            navigate('/dashboard')
        }else{
            navigate('/profile')
        }
    }
    return (
        <nav className="flex space-x-4">
            <button
                id="home-button"
                aria-label='Home'
                data-role='nav-home'
                onClick={() => navigate('/home')}
                className="text-lg font-semibold"
                >
                    Home
            </button>
            <button
                id="explore-button"
                aria-label='Explore'
                data-role='nav-explore'
                onClick={() => navigate('/explore')}
                className="text-lg font-semibold"
                >
                    Explore
            </button>
            <button
                id="ResumeUploader-button"
                aria-label='Resume Uploader'
                data-role='nav-resume-uploader'
                onClick={() => navigate('/resume-uploader')}
                className="text-lg font-semibold"
                >
                    Resume Uploader
            </button>

            <button
            id="profile-button"
            aria-label='Profile'
            data-role='nav-profile'
            onClick={handleProfileClick}
            >
                <img src='/profile-icon.png' alt='Profile Icon' className='w-8 h-8 rounded-full' />
            </button>

        </nav>
    )
}

export default Navbar;