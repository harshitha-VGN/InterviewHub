const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const port = process.env.PORT || 5050;

// Connect to database
connectDB();

const app = express();

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

// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});


app.listen(port, () => console.log(`Server started on port ${port}`));

