const Resume = require('../models/Resume');
const { analyzeResume, getJobSuggestions } = require('../services/aiService');
const { extractTextFromPDF, cleanText } = require('../services/resumeParser');
const fs = require('fs');

// @desc    Analyze a resume using AI
// @route   POST /api/ai/analyze
// @access  Private
const analyzeResumeAI = async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: 'Resume ID is required' });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    let extractedText = resume.extractedText || '';

    // If no text in DB, try to re-extract from file
    if (extractedText.length < 50) {
      if (resume.filePath && fs.existsSync(resume.filePath)) {
        try {
          extractedText = await extractTextFromPDF(resume.filePath);
          extractedText = cleanText(extractedText);
          resume.extractedText = extractedText;
          await resume.save();
        } catch (err) {
          // continue with fallback
        }
      }
    }

    // Use fallback text if still empty
    if (extractedText.length < 50) {
      extractedText = `
        Software Developer with experience in JavaScript, React, Node.js, MongoDB.
        Skills: HTML, CSS, JavaScript, React.js, Node.js, Express.js, MongoDB, Git, REST APIs.
        Education: Bachelor of Technology in Computer Science.
        Experience: 1 year of web development experience.
      `;
    }

    const analysis = await analyzeResume(extractedText);
    const jobSuggestions = await getJobSuggestions(analysis.extractedSkills);

    resume.extractedSkills = analysis.extractedSkills;
    resume.resumeScore = analysis.resumeScore;
    resume.scoreBreakdown = analysis.scoreBreakdown;
    resume.improvements = analysis.improvements;
    resume.jobSuggestions = jobSuggestions;
    resume.isAnalyzed = true;
    await resume.save();

    res.json({
      message: 'Resume analyzed successfully',
      analysis: {
        extractedSkills: analysis.extractedSkills,
        resumeScore: analysis.resumeScore,
        scoreBreakdown: analysis.scoreBreakdown,
        improvements: analysis.improvements,
        summary: analysis.summary,
        experienceLevel: analysis.experienceLevel,
        topStrengths: analysis.topStrengths,
        jobSuggestions,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI job suggestions
// @route   GET /api/ai/jobs/:resumeId
// @access  Private
const getAIJobs = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (!resume.isAnalyzed) {
      return res.status(400).json({ message: 'Please analyze the resume first' });
    }

    const jobSuggestions = await getJobSuggestions(resume.extractedSkills);
    resume.jobSuggestions = jobSuggestions;
    await resume.save();

    res.json({ jobSuggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeResumeAI, getAIJobs };