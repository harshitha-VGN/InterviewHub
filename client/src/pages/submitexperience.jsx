import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

function SubmitExperience(){
    const [formData,setFormData]=useState({ 
        username:'',
        role:'',
        company:'',
        experience:'',
    })
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        })
    }
    const navigate = useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            await axios.post('http://localhost:5050/api/experiences/new', formData);
            alert('Experience submitted successfully'); 
            navigate("/");    
        }catch(error){
            console.error('Error submitting experience:', error);
            alert('Failed to submit experience');
        }
    }
    return(
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
            <input name="username" onChange={handleChange} placeholder="Username" required className="block mb-2"/>
            <input name="role" onChange={handleChange} placeholder="Role" required className="block mb-2"/>
            <input name="company" onChange={handleChange} placeholder="Company" required className="block mb-2"/>
            <textarea name="experience" onChange={handleChange} placeholder="Experience" required className="block mb-2"/>
            <button type="submit">Submit</button>
        </form>
    )
}
export default SubmitExperience;