import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState('');
    // this is => if there are any errors from the backend
    const navigate = useNavigate();
    // this is for navigatig from authform page to Home page in our website 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // if user starts typing we have to clear all eroors 
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
            setServerErrors('');
    }

    const validateFormDetails = () => {
        let newerrors = {};
        if (!isLogin && !formData.username) {
            newerrors.username = "Username is required";
        }
        if (!formData.email) {
            newerrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newerrors.email = "Email is invalid";
        }
        if (formData.password.length < 8) {
            newerrors.password = "Password must be atleast 8 characters";
        }
        if (!isLogin && formData.password != formData.confirmPassword) {
            newerrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newerrors)
        return Object.keys(newerrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setIsSubmitting(true);
       if(!validateFormDetails()){
        console.log("Form validation failed");
        return;
       }
       const endpoint=isLogin ? '/api/auth/login':'/api/auth/signup';
       const payload=isLogin ? {email:formData.email,password:formData.password} : {username:formData.username,email:formData.email,password:formData.password};
       try{
            // now i have to sned this data to the backend 
            const response=await axios.post(`http://localhost:5050${endpoint}`,payload);

            if(isLogin){
                // we wuill handle the login success
                // we will get the token from the response
                const {token,username}=response.data;
                // we will store the token in the browsers local storage
                localStorage.setItem('token',token);
                 localStorage.setItem('username',username);
                // we will redirect to the home page
                navigate('/home');
            }else{
                // we will handle signup success
                alert("Signup successful! Please login");
                setIsLogin(true); //after sucess of signup we will move to login view
                setFormData({username:'',email:'',password:'',confirmPassword:''});//we have to clear the form when successful
            }
       }catch(error){
        // handling errors form teh server 
        console.error('API Error:',error.response ? error.response.data : error.message);
        setServerErrors(error.response?.data?.message || 'An error occurred. Please try again.');
       }
    };

     const switchForm = (toLogin) => {
        setIsLogin(toLogin);
        setErrors({});
        setServerErrors('');
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    };

    return (
        <div className="container">
            <div className="form-container">
                <button className={isLogin ? 'activeClass' : ''} onClick={() => {
                    switchForm(true);
                }}>Login</button>
                <button className={!isLogin ? 'activeClass' : ''} onClick={() => {
                    switchForm(false);
                }}>Sign Up</button>
                {/* active class is to show that we are in the login part this will add a background color to the login button  */}
            </div>
            <form onSubmit={handleSubmit}>
                <h2>{isLogin ? 'Login' : 'Create An Account'}</h2>

                
                {serverErrors && <p className="error">{serverErrors}</p>}

                
                {!isLogin && (
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
                        {errors.username && <p className="error">{errors.username}</p>}
                    </div>
                )}
                
                
                <div className='form-group'>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>

                
                <div className='form-group'>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>
                
                
                {!isLogin && (
                    <div className='form-group'>
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                    </div>
                )}
                
                <button type="submit" className="submit-btn">{isLogin ? 'Login' : 'Sign Up'}</button>

                <p>
                    {isLogin ? "Don't have an account? " : "Already a member? "}
                    <span onClick={() => switchForm(!isLogin)} style={{ cursor: 'pointer', color: 'blue' }}>
                        {isLogin ? 'Sign up now' : 'Login now'}
                    </span>
                </p>
            </form>
         
        </div>
    );
}
export default AuthForm;











