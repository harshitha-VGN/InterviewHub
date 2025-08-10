import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navbar from './components/navbar.jsx'
import Profile from './pages/profile.jsx'

import Dashboard from './pages/dashboard.jsx'
import EditProfileModel from './components/editprofile.jsx'
import MyExperiences from './pages/explore.jsx'
import SubmitExperience from './pages/submitexperience.jsx'
import './App.css'
import AuthForm from './pages/authentication.jsx' // Assuming this is the correct path
import Home from './pages/Home.jsx' // Assuming this is the correct path
import MyContributions from './pages/MyContributions';
import ResumeUploader from './pages/ResumeUploader';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
function App() {

  return (
    <Router>
    <Navbar/>
    <Routes>
       <Route path="/" element={<AuthForm />} />
        <Route path="/register" element={<AuthForm />} />
        <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/editprofile" element={<EditProfileModel />} />
      <Route path="/explore" element={<MyExperiences />} />
      <Route path="/submitexperience" element={<SubmitExperience />} />
       <Route path="/myexperience" element={<MyContributions />} />
      <Route path="/resume-uploader" element={<ResumeUploader />} />
      <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
    </Routes>
    </Router>
    
  )
}

export default App
