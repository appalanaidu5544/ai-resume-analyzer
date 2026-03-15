import React from 'react';
import { FiCode, FiDatabase, FiSettings, FiPenTool, FiTrendingUp, FiDollarSign, FiBriefcase, FiDollarSign as FiSalary, FiAward } from 'react-icons/fi';

const categoryIcons = {
  'Software Development': <FiCode />,
  'Data Science': <FiDatabase />,
  'DevOps': <FiSettings />,
  'Design': <FiPenTool />,
  'Marketing': <FiTrendingUp />,
  'Finance': <FiDollarSign />,
  'Other': <FiBriefcase />,
};

const JobSuggestions = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="empty-state">
        <p>No job suggestions available. Analyze your resume first.</p>
      </div>
    );
  }

  return (
    <div className="jobs-grid">
      {jobs.map((job, index) => (
        <div key={index} className="job-card">
          <div className="job-card-header">
            <div className="job-category-icon">
              {categoryIcons[job.category] || <FiBriefcase />}
            </div>
            <div className="job-title-area">
              <h4 className="job-title">{job.title}</h4>
              <span className="job-category">{job.category || 'General'}</span>
            </div>
            <div
              className="match-badge"
              style={{
                backgroundColor: job.matchScore >= 80 ? 'rgba(16,185,129,0.15)' : job.matchScore >= 60 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                color: job.matchScore >= 80 ? '#34d399' : job.matchScore >= 60 ? '#fbbf24' : '#f87171',
                border: `1px solid ${job.matchScore >= 80 ? 'rgba(16,185,129,0.25)' : job.matchScore >= 60 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}
            >
              {job.matchScore}% match
            </div>
          </div>

          <p className="job-description">{job.description}</p>

          <div className="job-details">
            {job.salary && (
              <div className="job-detail">
                <FiSalary size={12} className="detail-icon" />
                <span>{job.salary}</span>
              </div>
            )}
            {job.experienceLevel && (
              <div className="job-detail">
                <FiAward size={12} className="detail-icon" />
                <span>{job.experienceLevel}</span>
              </div>
            )}
          </div>

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="job-skills">
              <p className="skills-label">Required Skills</p>
              <div className="skills-tags">
                {job.requiredSkills.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          <div className="match-bar">
            <div
              className="match-bar-fill"
              style={{
                width: `${job.matchScore}%`,
                backgroundColor: job.matchScore >= 80 ? '#10b981' : job.matchScore >= 60 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobSuggestions;