import React, { useState, useEffect } from 'react';
import { FiFileText, FiCpu, FiStar, FiBriefcase, FiPlus, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { getResumes } from '../services/api';
import ResumeUpload from '../components/ResumeUpload.jsx';
import ResumeCard from '../components/ResumeCard.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const res = await getResumes();
      setResumes(res.data);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newResume) => {
    setResumes([newResume, ...resumes]);
    setShowUpload(false);
  };

  const handleDelete = (id) => setResumes(resumes.filter(r => r._id !== id));

  const handleAnalyzed = (id, analysis) => {
    setResumes(resumes.map(r =>
      r._id === id
        ? { ...r, isAnalyzed: true, resumeScore: analysis.resumeScore, extractedSkills: analysis.extractedSkills, jobSuggestions: analysis.jobSuggestions }
        : r
    ));
  };

  const analyzedCount = resumes.filter(r => r.isAnalyzed).length;
  const avgScore = resumes.filter(r => r.resumeScore).length
    ? Math.round(resumes.filter(r => r.resumeScore).reduce((acc, r) => acc + r.resumeScore, 0) / resumes.filter(r => r.resumeScore).length)
    : null;
  const totalJobs = resumes.reduce((acc, r) => acc + (r.jobSuggestions?.length || 0), 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard-page">
      <div className="container">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>{greeting}, {user?.name?.split(' ')[0]}!</h1>
            <p>Manage and analyze your resumes with AI-powered insights</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowUpload(!showUpload)}>
            {showUpload ? <><FiX /> Cancel</> : <><FiPlus /> Upload Resume</>}
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card card-blue">
            <div className="stat-icon-wrap"><FiFileText /></div>
            <div className="stat-info">
              <span className="stat-value">{resumes.length}</span>
              <span className="stat-label">Total Resumes</span>
            </div>
          </div>
          <div className="stat-card card-green">
            <div className="stat-icon-wrap"><FiCpu /></div>
            <div className="stat-info">
              <span className="stat-value">{analyzedCount}</span>
              <span className="stat-label">Analyzed</span>
            </div>
          </div>
          <div className="stat-card card-amber">
            <div className="stat-icon-wrap"><FiStar /></div>
            <div className="stat-info">
              <span className="stat-value">{avgScore !== null ? `${avgScore}` : '—'}</span>
              <span className="stat-label">Avg. Score</span>
            </div>
          </div>
          <div className="stat-card card-cyan">
            <div className="stat-icon-wrap"><FiBriefcase /></div>
            <div className="stat-info">
              <span className="stat-value">{totalJobs}</span>
              <span className="stat-label">Job Matches</span>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <div className="upload-section">
            <ResumeUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* Resumes */}
        <div className="section">
          <h2 className="section-title"><FiFileText /> Your Resumes</h2>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><FiFileText /></div>
              <h3>No resumes yet</h3>
              <p>Upload your first resume to get started with AI analysis</p>
              <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
                <FiPlus /> Upload Resume
              </button>
            </div>
          ) : (
            <div className="resume-grid">
              {resumes.map(resume => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  onDelete={handleDelete}
                  onAnalyzed={handleAnalyzed}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;