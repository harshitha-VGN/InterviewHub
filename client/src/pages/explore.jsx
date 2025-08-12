import { useState, useEffect } from 'react';
import ExperienceCard from './experiencecard.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function MyExperiences() {
    const [experiences, setExperiences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleShareExperience = () => {
        navigate('/submitexperience');
    };

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get('http://localhost:5050/api/experiences');
                setExperiences(response.data);
                console.log('Fetched Experiences:', response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching experiences:', error);
                setIsLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4"> 
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Explore Experiences</h1> 
                
                <button 
                    onClick={handleShareExperience}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all duration-200"
                >
                    Share an Experience
                </button>
            </div>

            {experiences.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-lg">
                    <h3 className="text-xl text-gray-600">No Experiences Found</h3>
                    <p className="text-gray-500 mt-2">Be the first one to share your journey!</p>
                </div>
            ) : (
                <div className="space-y-4"> 
                    {experiences.map((exp) => (
                        <ExperienceCard
                            key={exp._id}
                            username={exp.username}
                            role={exp.role}
                            company={exp.company}
                            experience={exp.experience}
                            createdAt={new Date(exp.createdAt).toLocaleDateString()} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyExperiences;

