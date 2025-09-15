import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationItems = () => {
    if (user.role === 'admin') {
      return [
        { path: '/dashboard', label: 'Dashboard' },
      ];
    } else if (user.role === 'user') {
      return [
        { path: '/stores', label: 'Stores' },
      ];
    } else if (user.role === 'store_owner') {
      return [
        { path: '/store-owner', label: 'My Store' },
      ];
    }
    return [];
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Store Rating System</h2>
        </div>
        <div className="navbar-nav">
          {getNavigationItems().map(item => (
            <Link key={item.path} to={item.path} className="nav-link">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="navbar-user">
          <span className="user-info">
            Welcome, {user.name} ({user.role})
          </span>
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;