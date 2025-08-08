import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home(){
    const navigate=useNavigate();
    return (
        <h1>Welcome to Home page!!</h1>
    );
}
export default Home;