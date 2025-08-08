// import {useState} from 'react';
// import {useNavigate} from 'react-router-dom';
// import axios from 'axios';

// function SubmitExperience(){
//     const [formData,setFormData]=useState({ 
        
//         role:'',
//         company:'',
//         experience:'',
//     })
//     const handleChange=(e)=>{
//         setFormData({
//             ...formData,
//             [e.target.name]:e.target.value,
//         })
//     }
//     const navigate = useNavigate();
//     const handleSubmit=async(e)=>{
//         e.preventDefault();
//         try{
//             await axios.post('http://localhost:5050/api/experiences/new', formData);
//             alert('Experience submitted successfully'); 
//             navigate("/");    
//         }catch(error){
//             console.error('Error submitting experience:', error);
//             alert('Failed to submit experience');
//         }
//     }
//     return(
//         <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
//             <input name="username" onChange={handleChange} placeholder="Username" required className="block mb-2"/>
//             <input name="role" onChange={handleChange} placeholder="Role" required className="block mb-2"/>
//             <input name="company" onChange={handleChange} placeholder="Company" required className="block mb-2"/>
//             <textarea name="experience" onChange={handleChange} placeholder="Experience" required className="block mb-2"/>
//             <button type="submit">Submit</button>
//         </form>
//     )
// }
// export default SubmitExperience;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SubmitExperience() {
    const [formData, setFormData] = useState({
        // No username here! We will get it from localStorage.
        role: '',
        company: '',
        experience: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Get username and token from storage
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');

        if (!username || !token) {
            alert('You must be logged in to submit an experience.');
            navigate('/login');
            return;
        }

        try {
            // Include username in the payload sent to the backend
            const payload = { ...formData, username };
            
            // Note: If you wanted to make this a protected route on the backend,
            // you would also pass the token in the headers here.
            await axios.post('http://localhost:5050/api/experiences/new', payload);

            alert('Experience submitted successfully!');
            navigate("/explore"); // Navigate to explore to see the new post
        } catch (error) {
            console.error('Error submitting experience:', error);
            alert('Failed to submit experience. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Share Your Experience</h2>
            
            {/* The username input is removed */}
            
            <input name="role" value={formData.role} onChange={handleChange} placeholder="Role (e.g., Software Engineer Intern)" required className="block w-full p-2 border rounded mb-4" />
            <input name="company" value={formData.company} onChange={handleChange} placeholder="Company (e.g., Google)" required className="block w-full p-2 border rounded mb-4" />
            <textarea name="experience" value={formData.experience} onChange={handleChange} placeholder="Describe your interview experience..." required className="block w-full p-2 border rounded mb-4" rows="6" />
            <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded font-semibold hover:bg-indigo-700">Submit</button>
        </form>
    );
}

export default SubmitExperience;