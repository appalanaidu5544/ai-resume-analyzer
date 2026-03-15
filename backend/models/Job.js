const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        requiredSkills: {
            type: [String],
            default: [],
        },
        preferredSkills: {
            type: [String],
            default: [],
        },
        salary: {
            type: String,
            default: 'Not specified',
        },
        experience: {
            type: String,
            default: 'Entry level',
        },
        category: {
            type: String,
            enum: [
                'Software Development',
                'Data Science',
                'DevOps',
                'Design',
                'Marketing',
                'Finance',
                'Other',
            ],
            default: 'Other',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);