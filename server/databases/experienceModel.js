const mongoose = require('mongoose');

const experienceSchema = mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: [true, 'Role is required']
        },
        company: {
            type: String,
            required: [true, 'Company name is required']
        },
        experience: { 
            type: String,
            required: [true, 'Experience details are required']
        }
    },
    {
        timestamps: true
    }
);

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;