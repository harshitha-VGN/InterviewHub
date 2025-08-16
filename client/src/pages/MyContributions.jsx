import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ExperienceCard from './experiencecard.jsx';
const API_URL = import.meta.env.CLIENT_URL || 'http://localhost:5050';
function MyContributions() {
    const [myExperiences, setMyExperiences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyExperiences = async () => {
            
            const username = localStorage.getItem('username');

            if (!username) {
                setError('You must be logged in to see your contributions.');
                setIsLoading(false);
              
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            try {
               
                const response = await axios.get(`${API_URL}/api/experiences/my`, {
                    params: {
                        username: username 
                    }
                });
                
                setMyExperiences(response.data);

            } catch (err) {
                console.error('Error fetching your experiences:', err);
                setError('Could not fetch your experiences. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyExperiences();
    }, [navigate]);

    if (isLoading) {
        return <div className="text-center mt-10"><h1>Loading your contributions...</h1></div>;
    }

    if (error) {
        return <div className="text-center mt-10"><h1 className="text-red-500">{error}</h1></div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">My Contributions</h1>
                <Link to="/submitexperience" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-700">
                    Share your experience
                </Link>
            </div>

            {myExperiences.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-lg">
                    <h3 className="text-xl text-gray-600">You haven't shared any experiences yet.</h3>
                    <p className="text-gray-500 mt-2">Your contributions will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {myExperiences.map((exp) => (
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

export default MyContributions;
