const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze resume text using OpenAI
 */
const analyzeResume = async (resumeText) => {
    const prompt = `
You are an expert HR consultant and resume analyst. Analyze the following resume text and provide a comprehensive evaluation.

Resume Text:
"""
${resumeText.substring(0, 4000)}
"""

Respond ONLY with a valid JSON object (no markdown, no extra text) in this exact format:
{
  "extractedSkills": ["skill1", "skill2", "skill3"],
  "resumeScore": 75,
  "scoreBreakdown": {
    "skills": 20,
    "experience": 20,
    "education": 15,
    "formatting": 10,
    "keywords": 10
  },
  "improvements": [
    "Add quantifiable achievements to your experience section",
    "Include a professional summary at the top",
    "Add links to GitHub/LinkedIn/Portfolio"
  ],
  "summary": "Brief 2-sentence summary of the candidate profile",
  "experienceLevel": "Entry Level",
  "topStrengths": ["strength1", "strength2", "strength3"]
}`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert resume analyst. Always respond with valid JSON only.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 1500,
        });

        const content = response.choices[0].message.content.trim();
        const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        return getMockAnalysis(resumeText);
    }
};

/**
 * Get job suggestions based on skills
 */
const getJobSuggestions = async (skills) => {
    const prompt = `
You are a job placement expert. Based on these skills, suggest 5 relevant job roles.

Skills: ${skills.slice(0, 15).join(', ')}

Respond ONLY with a valid JSON array (no markdown, no extra text) in this exact format:
[
  {
    "title": "Job Title",
    "description": "Brief 1-2 sentence job description",
    "matchScore": 90,
    "requiredSkills": ["skill1", "skill2"],
    "salary": "$60,000 - $80,000",
    "experienceLevel": "Entry Level",
    "category": "Software Development"
  }
]`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a job placement expert. Always respond with valid JSON only.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.4,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content.trim();
        const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        return getMockJobSuggestions(skills);
    }
};

const getMockAnalysis = (resumeText) => {
    const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'HTML', 'CSS'];
    const foundSkills = commonSkills.filter(skill =>
        resumeText.toLowerCase().includes(skill.toLowerCase())
    );

    return {
        extractedSkills: foundSkills.length > 0 ? foundSkills : ['Communication', 'Problem Solving', 'Teamwork'],
        resumeScore: 65,
        scoreBreakdown: { skills: 15, experience: 18, education: 12, formatting: 12, keywords: 8 },
        improvements: [
            'Add more quantifiable achievements to your experience',
            'Include a compelling professional summary',
            'Add links to your portfolio and GitHub',
            'Use more industry-specific keywords',
        ],
        summary: 'Candidate shows potential with relevant technical background. Resume needs more specific achievements and metrics.',
        experienceLevel: 'Entry Level',
        topStrengths: ['Technical Skills', 'Education Background', 'Adaptability'],
    };
};

const getMockJobSuggestions = (skills) => {
    return [
        {
            title: 'Junior Full Stack Developer',
            description: 'Build and maintain web applications using modern technologies.',
            matchScore: 88,
            requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            salary: '$55,000 - $75,000',
            experienceLevel: 'Entry Level',
            category: 'Software Development',
        },
        {
            title: 'Frontend Developer',
            description: 'Create responsive and interactive user interfaces.',
            matchScore: 82,
            requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
            salary: '$50,000 - $70,000',
            experienceLevel: 'Entry Level',
            category: 'Software Development',
        },
        {
            title: 'Backend Developer',
            description: 'Design and implement server-side logic and APIs.',
            matchScore: 75,
            requiredSkills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
            salary: '$55,000 - $75,000',
            experienceLevel: 'Entry Level',
            category: 'Software Development',
        },
        {
            title: 'Data Analyst',
            description: 'Analyze data and create insights to drive business decisions.',
            matchScore: 68,
            requiredSkills: ['Python', 'SQL', 'Excel', 'Tableau'],
            salary: '$50,000 - $65,000',
            experienceLevel: 'Entry Level',
            category: 'Data Science',
        },
        {
            title: 'DevOps Engineer',
            description: 'Manage CI/CD pipelines and cloud infrastructure.',
            matchScore: 60,
            requiredSkills: ['Git', 'Docker', 'AWS', 'Linux'],
            salary: '$60,000 - $80,000',
            experienceLevel: 'Entry Level',
            category: 'DevOps',
        },
    ];
};

module.exports = { analyzeResume, getJobSuggestions };