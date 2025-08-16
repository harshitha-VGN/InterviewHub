import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast'; 
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
const API_URL = import.meta.env.CLIENT_URL || 'http://localhost:5050';
const SubmitExperience = () => {
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        experience: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const handleNotification = (message, type) => {
        setNotification({ message, type });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');

        if (!username || !token) {
            handleNotification('You must be logged in to submit an experience.', 'error');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = { ...formData, username };
            await axios.post(`${API_URL}/api/experiences/new`, payload);

            handleNotification('Experience submitted successfully! Redirecting...', 'success');
            setTimeout(() => navigate("/explore"), 2000); 
            
        } catch (error) {
            console.error('Error submitting experience:', error);
            handleNotification('Failed to submit experience. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Toast 
                message={notification.message} 
                type={notification.type}
                onDismiss={() => setNotification({ message: '', type: '' })}
            />
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
               
                <div className="backdrop-blur-xl bg-white/30 rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/40">
                    
                    
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800">Share Your Experience</h1>
                        <p className="text-lg text-gray-700 mt-2">Your story can help someone else land their dream job. Pay it forward!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange} 
                            placeholder="Role (e.g., Software Engineer Intern)" 
                            required 
                        />
                        <InputField 
                            name="company" 
                            value={formData.company} 
                            onChange={handleChange} 
                            placeholder="Company (e.g., Google)" 
                            required 
                        />
                        <TextareaField 
                            name="experience" 
                            value={formData.experience} 
                            onChange={handleChange} 
                            placeholder="Describe your interview process, questions asked, and any tips you have..." 
                            required 
                        />
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <PaperAirplaneIcon className="h-6 w-6 mr-2" />
                                    Submit My Experience
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}


const InputField = ({ name, value, onChange, placeholder, required }) => (
    <input 
        name={name} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        required={required}
        className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-300/50 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/50 transition-colors"
    />
);


const TextareaField = ({ name, value, onChange, placeholder, required }) => (
    <textarea 
        name={name} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        required={required}
        rows="8"
        className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-300/50 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/50 transition-colors"
    ></textarea>
);


export default SubmitExperience;
