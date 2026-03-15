const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        filePath: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
        },
        extractedText: {
            type: String,
            default: '',
        },
        extractedSkills: {
            type: [String],
            default: [],
        },
        resumeScore: {
            type: Number,
            min: 0,
            max: 100,
            default: null,
        },
        scoreBreakdown: {
            skills: { type: Number, default: 0 },
            experience: { type: Number, default: 0 },
            education: { type: Number, default: 0 },
            formatting: { type: Number, default: 0 },
            keywords: { type: Number, default: 0 },
        },
        improvements: {
            type: [String],
            default: [],
        },
        jobSuggestions: [
            {
                title: String,
                description: String,
                matchScore: Number,
                requiredSkills: [String],
                salary: String,
            },
        ],
        isAnalyzed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);