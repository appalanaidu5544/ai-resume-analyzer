const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const {
  extractTextFromBuffer,
  cleanText,
} = require('../services/resumeParser');

// @desc    Upload a resume
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload a PDF.' });
    }

    // Save buffer to disk
    const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, req.file.buffer);

    // Extract text from buffer
    let extractedText = '';
    try {
      extractedText = await extractTextFromBuffer(req.file.buffer);
      extractedText = cleanText(extractedText);
    } catch (parseError) {
      // continue without text
    }

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: filename,
      filePath: filePath,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      extractedText,
      isAnalyzed: false,
    });

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: {
        _id: resume._id,
        originalName: resume.originalName,
        fileSize: resume.fileSize,
        filePath: `/uploads/resumes/${filename}`,
        isAnalyzed: resume.isAnalyzed,
        createdAt: resume.createdAt,
        hasText: extractedText.length > 0,
      },
    });

  } catch (error) {
    if (req.file?.buffer) {
      // nothing to clean for memory storage
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all resumes for a user
// @route   GET /api/resume
// @access  Private
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select('-extractedText')
      .sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single resume by ID
// @route   GET /api/resume/:id
// @access  Private
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    if (resume.filePath && fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }
    await Resume.deleteOne({ _id: resume._id });
    res.json({ message: 'Resume deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadResume, getResumes, getResumeById, deleteResume };