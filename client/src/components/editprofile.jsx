import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const EditProfileModel = ({ currentUser, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        username: currentUser.username || '',
        bio: currentUser.bio || '',
        goals: currentUser.goals || '',
    });
    
    // State to handle the fade-in/out animation
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger the fade-in animation shortly after the component mounts
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleClose = () => {
        setIsVisible(false);
        // Allow time for the fade-out animation before calling onClose
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        // The parent component will handle closing the modal on success
    };

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300
                        ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Backdrop with the glassmorphism effect */}
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            {/* Modal Content */}
            <div 
                className={`relative w-full max-w-lg bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-6 transition-all duration-300
                            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-900/10">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                    <button 
                        onClick={handleClose}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-200/50 hover:text-gray-800 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <InputField 
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextareaField
                        label="Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us a little about yourself..."
                    />
                    <TextareaField
                        label="Career Goals"
                        name="goals"
                        value={formData.goals}
                        onChange={handleChange}
                        placeholder="What are you aiming for in your career?"
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-900/10">
                        <button 
                            type="button" 
                            onClick={handleClose} 
                            className="px-6 py-2 bg-gray-200/80 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Reusable InputField component for consistency
const InputField = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input 
            type="text" 
            name={name} 
            id={name}
            value={value} 
            onChange={onChange} 
            className="w-full px-4 py-2 rounded-lg bg-white/60 border border-gray-300/50 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/50 transition-colors"
        />
    </div>
);

// Reusable TextareaField component
const TextareaField = ({ label, name, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <textarea 
            name={name} 
            id={name}
            value={value} 
            onChange={onChange} 
            placeholder={placeholder}
            rows="3"
            className="w-full px-4 py-2 rounded-lg bg-white/60 border border-gray-300/50 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/50 transition-colors"
        ></textarea>
    </div>
);


export default EditProfileModel;