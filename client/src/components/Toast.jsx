import React, { useEffect, useState } from 'react';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid'; // You'll need to install heroicons: npm install @heroicons/react

const Toast = ({ message, type, onDismiss }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                handleDismiss();
            }, 6000); // The pop-up will stay for 6 seconds

            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleDismiss = () => {
        setVisible(false);
        // Allow time for the fade-out animation before clearing the message
        setTimeout(() => {
            onDismiss();
        }, 300); 
    };

    if (!message) return null;

    const baseClasses = "fixed top-5 right-5 max-w-sm w-full p-4 rounded-lg shadow-2xl flex items-center space-x-4 z-50 transition-all duration-300";
    const visibleClasses = "opacity-100 translate-x-0";
    const hiddenClasses = "opacity-0 translate-x-12";

    const typeStyles = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
    };

    const Icon = type === 'success' ? CheckCircleIcon : XCircleIcon;

    return (
        <div className={`${baseClasses} ${typeStyles[type]} ${visible ? visibleClasses : hiddenClasses}`}>
            <div className="flex-shrink-0">
                <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
                <p className="font-bold">{type === 'success' ? 'Success' : 'Error'}</p>
                <p className="text-sm">{message}</p>
            </div>
            <div className="flex-shrink-0">
                <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-white/20">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Toast;