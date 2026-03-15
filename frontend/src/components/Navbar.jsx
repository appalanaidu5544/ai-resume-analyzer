import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
                    <img src={logo} alt="ResumeAI Logo" className="brand-icon-img" />
                    <span className="brand-text">Resume Analyzer</span>
                </Link>

                <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    {user ? (
                        <>
                            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                                <FiGrid size={14} style={{ marginRight: '4px' }} /> Dashboard
                            </Link>
                            <div className="nav-user">
                                <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                                <span className="nav-name">{user.name}</span>
                                <button className="btn-outline-sm" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FiLogOut size={13} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/register" className="btn-primary-sm" onClick={() => setMenuOpen(false)}>Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;