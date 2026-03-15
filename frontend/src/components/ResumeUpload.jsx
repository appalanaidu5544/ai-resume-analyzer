import React, { useState, useRef } from 'react';
import axios from 'axios';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const validateFile = (f) => {
    if (!f) return 'Please select a file';
    if (f.type !== 'application/pdf') return 'Only PDF files are allowed';
    if (f.size > 5 * 1024 * 1024) return 'File size must be under 5MB';
    return null;
  };

  const handleFile = (f) => {
    const err = validateFile(f);
    if (err) { setError(err); setFile(null); return; }
    setError('');
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) { setError('Please select a PDF file'); return; }
    setUploading(true);
    setError('');

    try {
      // ✅ Get token from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      if (!token) {
        setError('Not authenticated. Please login again.');
        setUploading(false);
        return;
      }

      // ✅ Build FormData with exact field name 'resume'
      const formData = new FormData();
      formData.append('resume', file);

      console.log('📤 Uploading file:', file.name, file.type, file.size);

      // ✅ Use axios directly with correct headers
      const response = await axios.post(
        'http://localhost:5000/api/resume/upload',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('✅ Upload success:', response.data);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadSuccess(response.data.resume);

    } catch (err) {
      console.error('❌ Upload error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-card">
      <div className="upload-header">
        <h3>📄 Upload Resume</h3>
        <p>Upload your PDF resume to get AI-powered analysis</p>
      </div>

      <div
        className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <div className="file-selected">
            <div className="file-icon">📋</div>
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
            <button
              className="remove-file"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
            >✕</button>
          </div>
        ) : (
          <div className="drop-placeholder">
            <div className="drop-icon">☁️</div>
            <p className="drop-text">Drag & drop your PDF here</p>
            <p className="drop-sub">or click to browse files</p>
            <span className="drop-limit">Max size: 5MB • PDF only</span>
          </div>
        )}
      </div>

      {error && <div className="error-msg">⚠️ {error}</div>}

      <button
        className="btn btn-primary full-width"
        onClick={handleSubmit}
        disabled={!file || uploading}
      >
        {uploading ? (
          <><span className="spinner-sm"></span> Uploading...</>
        ) : (
          '🚀 Upload Resume'
        )}
      </button>
    </div>
  );
};

export default ResumeUpload;