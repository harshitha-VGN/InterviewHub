
import { useState,useEffect } from 'react';
import ExperienceCard from './experiencecard.jsx';
import axios from 'axios';
function MyExperiences() {
    const [experiences, setExperiences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
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
    },[])

if(isLoading){
    return <h1>Loading...</h1>
}

return (
    <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My experiences</h1>
        {experiences.length === 0? (
            <h3> No Experiences Found</h3>
        ):(
            experiences.map((exp)=>(
                <ExperienceCard
                    key={exp._id} 
                    username={exp.username}
                    role={exp.role}
                    company={exp.company}
                    experience={exp.experience}
                    createdAt={exp.createdAt}
                    />
            ))
        )    
        }
    </div>
);
}

export default MyExperiences;