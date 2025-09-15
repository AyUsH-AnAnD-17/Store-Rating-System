import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import UserManagement from './UserManagement';
import StoreManagement from './StoreManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-stats">
            <h2>System Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Total Stores</h3>
                <p className="stat-number">{stats.totalStores}</p>
              </div>
              <div className="stat-card">
                <h3>Total Ratings</h3>
                <p className="stat-number">{stats.totalRatings}</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'stores':
        return <StoreManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={activeTab === 'stores' ? 'active' : ''}
          onClick={() => setActiveTab('stores')}
        >
          Store Management
        </button>
      </div>
      
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;