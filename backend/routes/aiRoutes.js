const express = require('express');
const router = express.Router();
const { analyzeResumeAI, getAIJobs } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, analyzeResumeAI);
router.get('/jobs/:resumeId', protect, getAIJobs);

module.exports = router;