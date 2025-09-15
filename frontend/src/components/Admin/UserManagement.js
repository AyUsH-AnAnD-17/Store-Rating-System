import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Common/Modal';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: 10
      };
      
      const response = await api.get('/admin/users', { params });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleSort = (field) => {
    setFilters({
      ...filters,
      sortBy: field,
      sortOrder: filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setSelectedUser(response.data.user);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const getSortIcon = (field) => {
    if (filters.sortBy !== field) return '↕️';
    return filters.sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading && users.length === 0) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <h2>User Management</h2>
      
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search by name, email, or address..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />
        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Name {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('email')}>
                Email {getSortIcon('email')}
              </th>
              <th onClick={() => handleSort('role')}>
                Role {getSortIcon('role')}
              </th>
              <th onClick={() => handleSort('address')}>
                Address {getSortIcon('address')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className={`role-badge ${user.role}`}>{user.role}</td>
                <td>{user.address.substring(0, 50)}...</td>
                <td>
                  <button 
                    onClick={() => handleViewUser(user._id)}
                    className="btn btn-sm btn-outline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => setPagination({...pagination, currentPage: pagination.currentPage - 1})}
          disabled={!pagination.hasPrev}
          className="btn btn-outline"
        >
          Previous
        </button>
        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        <button 
          onClick={() => setPagination({...pagination, currentPage: pagination.currentPage + 1})}
          disabled={!pagination.hasNext}
          className="btn btn-outline"
        >
          Next
        </button>
      </div>

      {/* User Details Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        {selectedUser && (
          <div className="user-details">
            <h3>User Details</h3>
            <div className="detail-row">
              <strong>Name:</strong> {selectedUser.name}
            </div>
            <div className="detail-row">
              <strong>Email:</strong> {selectedUser.email}
            </div>
            <div className="detail-row">
              <strong>Role:</strong> 
              <span className={`role-badge ${selectedUser.role}`}>
                {selectedUser.role}
              </span>
            </div>
            <div className="detail-row">
              <strong>Address:</strong> {selectedUser.address}
            </div>
            {selectedUser.role === 'store_owner' && selectedUser.storeId && (
              <div className="detail-row">
                <strong>Store Rating:</strong> 
                {selectedUser.storeId.averageRating}/5 
                ({selectedUser.storeId.totalRatings} ratings)
              </div>
            )}
            <div className="detail-row">
              <strong>Joined:</strong> 
              {new Date(selectedUser.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;