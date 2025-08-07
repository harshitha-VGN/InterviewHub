import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navbar from './components/navbar.jsx'
import Profile from './pages/profile.jsx'

import Dashboard from './pages/dashboard.jsx'
import EditProfileModel from './components/editprofile.jsx'
import MyExperiences from './pages/explore.jsx'
import SubmitExperience from './pages/submitexperience.jsx'
import './App.css'

function App() {

  return (
    <Router>
    <Navbar/>
    <Routes>
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/editprofile" element={<EditProfileModel />} />
      <Route path="/explore" element={<MyExperiences />} />
      <Route path="/submitexperience" element={<SubmitExperience />} />
    </Routes>
    </Router>
    
  )
}

export default App
