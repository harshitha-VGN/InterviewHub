const express = require('express');
const router = express.Router();
const { getAllExperiences, getMyExperiences, createExperience } = require('../controllers/experienceController')


router.get('/', getAllExperiences);
router.get('/my', getMyExperiences);
router.post('/new', createExperience);

module.exports = router;