import React from 'react';
import { UserCircleIcon, BuildingOffice2Icon, CalendarDaysIcon } from '@heroicons/react/24/solid';

const ExperienceCard = ({ username, role, company, experience, createdAt }) => {
    
    const formattedDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (error) {
            console.error("Could not format date:", dateString);
            return "Invalid Date";
        }
    };

    return (
        <article className="backdrop-blur-lg bg-white/40 p-6 rounded-2xl shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:bg-white/60">
           
            <header className="mb-4">
                <h2 className="text-2xl font-bold text-indigo-700 tracking-tight">{role}</h2>
                <div className="flex items-center text-gray-600 mt-1">
                    <BuildingOffice2Icon className="h-5 w-5 mr-2" />
                    <p className="text-lg font-medium">{company}</p>
                </div>
            </header>

            
            <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                <p>{experience}</p>
            </div>

        
            <footer className="border-t border-gray-900/10 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
                <div className="flex items-center">
                    <UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span>Shared by <strong className="text-gray-700">{username}</strong></span>
                </div>
                <div className="flex items-center">
                    <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{formattedDate(createdAt)}</span>
                </div>
            </footer>
        </article>
    );
};

export default ExperienceCard;


