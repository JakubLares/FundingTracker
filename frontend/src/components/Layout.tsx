import React, { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>PropFirm Tracker</h2>
        </div>
        {user && (
          <div className="nav-links">
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/challenges" className={isActive('/challenges') ? 'active' : ''}>
              Challenges
            </Link>
            <Link to="/payouts" className={isActive('/payouts') ? 'active' : ''}>
              Payouts
            </Link>
          </div>
        )}
        {user && (
          <div className="nav-user">
            <span className="user-name">{user.name}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
