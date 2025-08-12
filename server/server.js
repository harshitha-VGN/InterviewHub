const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5050;
const jwt=require('jsonwebtoken');
const User=require('./databases/User');
const resumeRoutes = require('./routes/resumeRoutes');
// Connect to database
connectDB();

const app = express();
const JWT_SECRET=process.env.JWT_SECRET;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // or the frontend port you're using
  credentials: true
}));

// Configure Multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Initialize the Google client using your new key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- THE ANALYSIS FUNCTION (can be in a separate file or here) ---
// NEW, MORE POWERFUL anaylzeResume FUNCTION

async function analyzeResume(text) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Fast and powerful
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert career coach and professional resume writer with a keen eye for modern, clean design. Your task is to completely rewrite and reformat the provided resume text.

      Instructions:
      1.  **Rewrite for Impact:** Correct all grammar and spelling. Rephrase sentences to be more impactful, using strong action verbs and the STAR method (Situation, Task, Action, Result) where possible. Ensure all content is professional and concise.
      2.  **Extract Key Information:** Parse the text to identify the main sections: Name, Contact Info (Email, Phone, LinkedIn, GitHub), Summary, Experience, Education, Projects, and Skills.
      3.  **Structure the Output:** Return a single, valid JSON object. Do NOT include any text outside of the JSON object. The JSON object must have the following structure:
          {
            "name": "Full Name",
            "contact": {
              "email": "email@example.com",
              "phone": "123-456-7890",
              "linkedin": "linkedin.com/in/username",
              "github": "github.com/username"
            },
            "summary": "A rewritten, impactful professional summary of 2-3 sentences.",
            "experience": [
              {
                "role": "Job Title",
                "company": "Company Name",
                "duration": "Month Year - Month Year",
                "description": "A rewritten, bulleted list of 3-4 achievements, starting with action verbs. Use markdown for bullets (e.g., '- Bullet 1\\n- Bullet 2')."
              }
            ],
            "education": [
              {
                "degree": "Degree and Major",
                "institution": "University Name",
                "duration": "Month Year - Month Year"
              }
            ],
            "projects": [
              {
                "name": "Project Name",
                "description": "A rewritten, concise description of the project, focusing on the tech used and the outcome. Use markdown for bullets."
              }
            ],
            "skills": {
              "languages": ["JavaScript", "Python", "SQL"],
              "frameworks": ["React", "Node.js", "Express"],
              "tools": ["Git", "Docker", "Webpack"]
            }
          }

      Analyze and transform the following resume text:
      ---
      ${text}
      ---
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Error calling Google Gemini API:", error);
    throw new Error("Failed to get response from Google Gemini API.");
  }
}

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded bodies


// --- ADD THIS NEW ENDPOINT TO YOUR EXISTING ROUTES ---
// This is the core part you're adding.

// --- API Routes ---
// This tells the server to use the experienceRoutes for any URL starting with /api/experiences
app.use('/api/experiences', require('./routes/experienceRoute'));
// Add your user routes here when you create them

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/resume', resumeRoutes);
// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});



// we will create a SIGNUP route 
app.post('/api/auth/signup',async(req,res)=>{
try{
    const {username,email,password}=req.body;
    let user=await User.findOne({email});
    if(user){
        return res.status(400).json({message:'User with this email already exists.'});
    }
    user=new User({username,email,password});
    await user.save();
    res.status(201).json({message:'User created successfully!!'});
}catch(error){
    console.error('Signup error:',error);
    res.status(500).json({message:'Server error during signip',error:error.message});
}

});
app.post('/api/auth/login',async(req,res)=>{
try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'Invalid credentials.'});
        }
        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid credentials.'});
        }
        const payload={user:{id:user.id,username:user.username}};
        jwt.sign(payload,JWT_SECRET,{expiresIn:'1h'},(err,token)=>{
            if(err) throw err;
            res.json({
                token:token,
                username:user.username
                //we will send the username as seperate as we wnat that to be shown in our frontend
            });
        });
}catch(error){
     console.error('Login error:',error);
    res.status(500).json({message:'Server error during login',error:error.message});
}
});
const startServer=async()=>{
    try{
        await connectDB();
        app.listen(PORT,()=>{
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }catch(error){
        console.error("Failed to start the server:",error);
        process.exit(1);
    }
};
startServer();
