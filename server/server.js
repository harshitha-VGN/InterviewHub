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