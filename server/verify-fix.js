delete global.DOMMatrix;
const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();
const resumeRoutes = require('./routes/resumeRoutes');
app.use('/api/resume', resumeRoutes);
const server = app.listen(5052, () => {
  console.log('Test server running on 5052');
});
