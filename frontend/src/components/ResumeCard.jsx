import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiTrash2, FiCpu, FiBarChart2, FiCheckCircle, FiClock } from 'react-icons/fi';
import { deleteResume, analyzeResume } from '../services/api';
import { formatFileSize, getScoreColor, getScoreLabel } from '../utils/auth';

const ResumeCard = ({ resume, onDelete, onAnalyzed }) => {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await analyzeResume(resume._id);
      onAnalyzed(resume._id, res.data.analysis);
    } catch (err) {
      alert(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this resume? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteResume(resume._id);
      onDelete(resume._id);
    } catch (err) {
      alert('Failed to delete resume');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="resume-card">
      <div className="resume-card-header">
        <div className="resume-file-icon"><FiFileText /></div>
        <div className="resume-meta">
          <h4 className="resume-name">{resume.originalName || resume.fileName}</h4>
          <span className="resume-date">
            {new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          {resume.fileSize && <span className="resume-size"> · {formatFileSize(resume.fileSize)}</span>}
        </div>
        <div className={`status-badge ${resume.isAnalyzed ? 'analyzed' : 'pending'}`}>
          {resume.isAnalyzed ? <><FiCheckCircle size={11} /> Analyzed</> : <><FiClock size={11} /> Pending</>}
        </div>
      </div>

      {resume.isAnalyzed && resume.resumeScore != null && (
        <div className="resume-card-stats">
          <div className="score-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path
                className="circle"
                strokeDasharray={`${resume.resumeScore}, 100`}
                style={{ stroke: getScoreColor(resume.resumeScore) }}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="score-text">
              <span className="score-num" style={{ color: getScoreColor(resume.resumeScore) }}>{resume.resumeScore}</span>
              <span className="score-label">{getScoreLabel(resume.resumeScore)}</span>
            </div>
          </div>
          <div className="skills-preview">
            <p className="skills-label">Top Skills</p>
            <div className="skills-tags">
              {(resume.extractedSkills || []).slice(0, 4).map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
              {(resume.extractedSkills?.length || 0) > 4 && (
                <span className="skill-tag more">+{resume.extractedSkills.length - 4}</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="resume-card-actions">
        {resume.isAnalyzed ? (
          <button className="btn btn-primary" onClick={() => navigate(`/resume/${resume._id}`)}>
            <FiBarChart2 /> View Analysis
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? <><span className="spinner-sm"></span> Analyzing...</> : <><FiCpu /> Analyze with AI</>}
          </button>
        )}
        <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? <span className="spinner-sm" style={{ borderTopColor: 'var(--danger)' }}></span> : <FiTrash2 size={16} />}
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;