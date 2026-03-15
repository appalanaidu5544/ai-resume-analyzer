import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFileText, FiGrid, FiTool, FiZap, FiBriefcase, FiCpu } from 'react-icons/fi';
import { getResumeById, analyzeResume } from '../services/api';
import JobSuggestions from '../components/JobSuggestions.jsx';
import { getScoreColor, getScoreLabel } from '../utils/auth';

const ScoreBar = ({ label, value, max }) => (
    <div className="score-bar-row">
        <div className="score-bar-label">
            <span>{label}</span>
            <span>{value}/{max}</span>
        </div>
        <div className="score-bar-track">
            <div className="score-bar-fill" style={{ width: `${(value / max) * 100}%`, backgroundColor: getScoreColor((value / max) * 100) }} />
        </div>
    </div>
);

const ResumeAnalysis = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => { fetchResume(); }, [id]);

    const fetchResume = async () => {
        try {
            const res = await getResumeById(id);
            setResume(res.data);
        } catch (err) {
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async () => {
        setAnalyzing(true);
        try {
            const res = await analyzeResume(id);
            const analysis = res.data.analysis;
            setResume({ ...resume, isAnalyzed: true, resumeScore: analysis.resumeScore, scoreBreakdown: analysis.scoreBreakdown, extractedSkills: analysis.extractedSkills, improvements: analysis.improvements, jobSuggestions: analysis.jobSuggestions });
            setActiveTab('overview');
        } catch (err) {
            alert(err.response?.data?.message || 'Analysis failed');
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
    if (!resume) return null;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <FiGrid size={14} /> },
        { id: 'skills', label: `Skills (${resume.extractedSkills?.length || 0})`, icon: <FiTool size={14} /> },
        { id: 'improvements', label: 'Improvements', icon: <FiZap size={14} /> },
        { id: 'jobs', label: `Jobs (${resume.jobSuggestions?.length || 0})`, icon: <FiBriefcase size={14} /> },
    ];

    return (
        <div className="analysis-page">
            <div className="container">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    <FiArrowLeft /> Back to Dashboard
                </button>

                <div className="analysis-header">
                    <div className="file-badge">
                        <div className="file-badge-icon"><FiFileText /></div>
                        <div>
                            <h1>{resume.originalName}</h1>
                            <p>Uploaded on {new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    {!resume.isAnalyzed && (
                        <button className="btn btn-primary" onClick={handleAnalyze} disabled={analyzing}>
                            {analyzing ? <><span className="spinner-sm"></span> Analyzing...</> : <><FiCpu /> Analyze with AI</>}
                        </button>
                    )}
                </div>

                {analyzing && (
                    <div className="analyzing-banner">
                        <span className="spinner-sm" style={{ borderTopColor: '#818cf8', borderColor: 'rgba(99,102,241,0.2)' }}></span>
                        <span>AI is reading your resume... This may take 15–30 seconds.</span>
                    </div>
                )}

                {resume.isAnalyzed ? (
                    <>
                        {/* Score Hero */}
                        <div className="score-hero">
                            <div className="score-ring-container">
                                <svg viewBox="0 0 120 120" className="score-ring">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--surface-3)" strokeWidth="10" />
                                    <circle
                                        cx="60" cy="60" r="50" fill="none"
                                        stroke={getScoreColor(resume.resumeScore)}
                                        strokeWidth="10"
                                        strokeDasharray={`${(resume.resumeScore / 100) * 314.16} 314.16`}
                                        strokeLinecap="round"
                                        transform="rotate(-90 60 60)"
                                        style={{ transition: 'stroke-dasharray 1.2s ease' }}
                                    />
                                </svg>
                                <div className="score-ring-text">
                                    <span className="score-big" style={{ color: getScoreColor(resume.resumeScore) }}>{resume.resumeScore}</span>
                                    <span className="score-outof">/100</span>
                                    <span className="score-grade" style={{ color: getScoreColor(resume.resumeScore) }}>{getScoreLabel(resume.resumeScore)}</span>
                                </div>
                            </div>
                            <div className="score-breakdown">
                                <h3>Score Breakdown</h3>
                                <ScoreBar label="Skills" value={resume.scoreBreakdown?.skills || 0} max={25} />
                                <ScoreBar label="Experience" value={resume.scoreBreakdown?.experience || 0} max={30} />
                                <ScoreBar label="Education" value={resume.scoreBreakdown?.education || 0} max={20} />
                                <ScoreBar label="Formatting" value={resume.scoreBreakdown?.formatting || 0} max={15} />
                                <ScoreBar label="Keywords" value={resume.scoreBreakdown?.keywords || 0} max={10} />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="tabs">
                            {tabs.map(tab => (
                                <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="tab-content">
                            {activeTab === 'overview' && (
                                <div className="overview-grid">
                                    <div className="info-card">
                                        <h3><FiFileText /> Resume Details</h3>
                                        <div className="info-rows">
                                            <div className="info-row"><span>File Name</span><strong>{resume.originalName}</strong></div>
                                            <div className="info-row"><span>Resume Score</span><strong style={{ color: getScoreColor(resume.resumeScore) }}>{resume.resumeScore}/100</strong></div>
                                            <div className="info-row"><span>Skills Found</span><strong>{resume.extractedSkills?.length || 0}</strong></div>
                                            <div className="info-row"><span>Job Matches</span><strong>{resume.jobSuggestions?.length || 0}</strong></div>
                                            <div className="info-row"><span>Suggestions</span><strong>{resume.improvements?.length || 0} items</strong></div>
                                        </div>
                                    </div>
                                    <div className="info-card">
                                        <h3><FiZap /> Quick Improvements</h3>
                                        <ul className="improvement-list preview">
                                            {(resume.improvements || []).slice(0, 3).map((imp, i) => (
                                                <li key={i} className="improvement-item">
                                                    <span className="imp-num">{i + 1}</span>
                                                    <span>{imp}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {(resume.improvements?.length || 0) > 3 && (
                                            <button className="btn-link" onClick={() => setActiveTab('improvements')}>
                                                See all {resume.improvements.length} suggestions →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'skills' && (
                                <div className="skills-section">
                                    <h3><FiTool /> Extracted Skills ({resume.extractedSkills?.length || 0})</h3>
                                    <div className="skills-cloud">
                                        {(resume.extractedSkills || []).map((skill, i) => (
                                            <span key={i} className="skill-pill">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'improvements' && (
                                <div className="improvements-section">
                                    <h3><FiZap /> AI-Suggested Improvements</h3>
                                    <div className="improvements-list">
                                        {(resume.improvements || []).map((imp, i) => (
                                            <div key={i} className="improvement-card">
                                                <div className="imp-badge">{i + 1}</div>
                                                <p>{imp}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'jobs' && (
                                <div className="jobs-section">
                                    <h3><FiBriefcase /> Recommended Jobs Based on Your Skills</h3>
                                    <JobSuggestions jobs={resume.jobSuggestions} />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="not-analyzed">
                        <div className="not-analyzed-icon"><FiCpu /></div>
                        <h2>Ready for AI Analysis</h2>
                        <p>Click the "Analyze with AI" button above to get your resume score, skill extraction, and personalized job recommendations.</p>
                        <ul className="feature-list">
                            <li><FiBarChart2 size={15} style={{ color: 'var(--primary)' }} /> Resume scoring (0–100)</li>
                            <li><FiTool size={15} style={{ color: 'var(--secondary)' }} /> Skill extraction</li>
                            <li><FiZap size={15} style={{ color: 'var(--warning)' }} /> Improvement suggestions</li>
                            <li><FiBriefcase size={15} style={{ color: 'var(--accent)' }} /> Job role recommendations</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeAnalysis;