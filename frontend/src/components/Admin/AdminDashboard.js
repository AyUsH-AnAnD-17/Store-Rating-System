import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import UserManagement from './UserManagement';
import StoreManagement from './StoreManagement';
import CreateUserForm from './CreateUserForm';
import Modal from '../Common/Modal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [loading, setLoading] = useState(true);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);

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

  const handleUserCreated = () => {
    setShowCreateUserModal(false);
    setShowCreateAdminModal(false);
    fetchStats(); // Refresh stats after user creation
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-stats">
            <div className="dashboard-header">
              <h2>System Statistics</h2>
              <div className="dashboard-actions">
                <button 
                  onClick={() => setShowCreateUserModal(true)}
                  className="btn btn-primary"
                >
                  <span className="btn-icon">👤</span>
                  Add User
                </button>
                <button 
                  onClick={() => setShowCreateAdminModal(true)}
                  className="btn btn-secondary"
                >
                  <span className="btn-icon">👨‍💼</span>
                  Add Admin
                </button>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-card users">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Total Users</h3>
                  <p className="stat-number">{stats.totalUsers}</p>
                  <small>Registered users on platform</small>
                </div>
              </div>
              <div className="stat-card stores">
                <div className="stat-icon">🏪</div>
                <div className="stat-content">
                  <h3>Total Stores</h3>
                  <p className="stat-number">{stats.totalStores}</p>
                  <small>Active stores in system</small>
                </div>
              </div>
              <div className="stat-card ratings">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>Total Ratings</h3>
                  <p className="stat-number">{stats.totalRatings}</p>
                  <small>Reviews submitted by users</small>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement onRefresh={fetchStats} />;
      case 'stores':
        return <StoreManagement onRefresh={fetchStats} />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="tab-icon">📊</span>
          Dashboard
        </button>
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <span className="tab-icon">👥</span>
          User Management
        </button>
        <button 
          className={`admin-tab ${activeTab === 'stores' ? 'active' : ''}`}
          onClick={() => setActiveTab('stores')}
        >
          <span className="tab-icon">🏪</span>
          Store Management
        </button>
      </div>
      
      <div className="admin-content">
        {renderContent()}
      </div>

      {/* Create User Modal */}
      <Modal show={showCreateUserModal} onClose={() => setShowCreateUserModal(false)}>
        <CreateUserForm 
          role="user"
          onUserCreated={handleUserCreated}
          title="Create New User"
        />
      </Modal>

      {/* Create Admin Modal */}
      <Modal show={showCreateAdminModal} onClose={() => setShowCreateAdminModal(false)}>
        <CreateUserForm 
          role="admin"
          onUserCreated={handleUserCreated}
          title="Create New Administrator"
        />
      </Modal>
    </div>
  );
};

export default AdminDashboard;