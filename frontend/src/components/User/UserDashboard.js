import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StoreCard from './StoreCard';
import RatingModal from './RatingModal';
import PasswordUpdateModal from './PasswordUpdateModal';
import './UserDashboard.css';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStores: 0
  });

  useEffect(() => {
    fetchStores();
  }, [filters, pagination.currentPage]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: 12
      };
      
      const response = await api.get('/stores', { params });
      setStores(response.data.stores);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching stores:', error);
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

  const handleRateStore = (store) => {
    setSelectedStore(store);
    setShowRatingModal(true);
  };

  const handleRatingSubmitted = () => {
    setShowRatingModal(false);
    fetchStores(); // Refresh to get updated ratings
  };

  if (loading && stores.length === 0) {
    return <div className="loading">Loading stores...</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h2>Stores</h2>
        <button 
          onClick={() => setShowPasswordModal(true)}
          className="btn btn-outline"
        >
          Update Password
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search stores by name or address..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="sort-select"
        >
          <option value="name">Sort by Name</option>
          <option value="averageRating">Sort by Rating</option>
          <option value="createdAt">Sort by Date Added</option>
        </select>
        <select
          name="sortOrder"
          value={filters.sortOrder}
          onChange={handleFilterChange}
          className="sort-order-select"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Stores Grid */}
      <div className="stores-grid">
        {stores.map(store => (
          <StoreCard 
            key={store._id}
            store={store}
            onRate={() => handleRateStore(store)}
          />
        ))}
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

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal 
          store={selectedStore}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmitted}
        />
      )}

      {/* Password Update Modal */}
      {showPasswordModal && (
        <PasswordUpdateModal 
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default UserDashboard;