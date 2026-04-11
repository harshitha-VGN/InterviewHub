const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const resumeRoutes = require('./routes/resumeRoutes');
app.use('/api/resume', resumeRoutes);
app.listen(5051, () => "Test server up");
