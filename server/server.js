const multer = require('multer');
const pdf = require('pdf-parse');
const { OpenAI } = require('openai');
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5050;
const jwt=require('jsonwebtoken');
const User=require('./databases/User');
// Connect to database
connectDB();

const app = express();
const JWT_SECRET=process.env.JWT_SECRET || 'buzNsUTtJVvLviJHQ/KGAsK1zdwk4U61bS0oWOvbfB4=';

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // or the frontend port you're using
  credentials: true
}));

// Configure Multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize OpenAI client (you likely have this already)
const openai = new OpenAI(); 

// --- THE ANALYSIS FUNCTION (can be in a separate file or here) ---
async function analyzeResume(text) {
  // ... (The exact same analyzeResume function from the previous answer)
  // It takes text and returns the AI's JSON string analysis.
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach... (etc)"
        },
        {
          role: "user",
          content: `Please analyze the following resume... (etc) \n\n Resume Text: --- \n${text}\n ---`
        }
      ],
      response_format: { type: "json_object" }
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error("Failed to get response from OpenAI.");
  }
}

// --- ADD THIS NEW ENDPOINT TO YOUR EXISTING ROUTES ---
// This is the core part you're adding.
app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
  console.log("Received a request to /api/analyze-resume");
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded. Please upload a PDF." });
  }
  try {
    const data = await pdf(req.file.buffer);
    if (!data.text) {
        return res.status(400).json({ error: "Could not extract text from the PDF." });
    }
    const analysisResultJson = await analyzeResume(data.text);
    const analysisResultObject = JSON.parse(analysisResultJson);
    res.json(analysisResultObject);
  } catch (error) {
    console.error("An error occurred during processing:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded bodies

// --- API Routes ---
// This tells the server to use the experienceRoutes for any URL starting with /api/experiences
app.use('/api/experiences', require('./routes/experienceRoute'));
// Add your user routes here when you create them

app.use('/api/users', require('./routes/userRoutes'));
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
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));