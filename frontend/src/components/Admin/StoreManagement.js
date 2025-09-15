import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Common/Modal';
import CreateStoreForm from './CreateStoreForm';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
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
        limit: 10
      };
      
      const response = await api.get('/admin/stores', { params });
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

  const handleViewStore = async (storeId) => {
    try {
      const response = await api.get(`/admin/stores/${storeId}`);
      setSelectedStore(response.data.store);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching store details:', error);
    }
  };

  const getSortIcon = (field) => {
    if (filters.sortBy !== field) return '↕️';
    return filters.sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleStoreCreated = () => {
    setShowCreateForm(false);
    fetchStores();
  };

  if (loading && stores.length === 0) {
    return <div className="loading">Loading stores...</div>;
  }

  return (
    <div className="store-management">
      <div className="header-actions">
        <h2>Store Management</h2>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          Add New Store
        </button>
      </div>
      
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search by store name, email, or address..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />
      </div>

      {/* Stores Table */}
      <div className="table-container">
        <table className="stores-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Store Name {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('email')}>
                Email {getSortIcon('email')}
              </th>
              <th onClick={() => handleSort('address')}>
                Address {getSortIcon('address')}
              </th>
              <th onClick={() => handleSort('averageRating')}>
                Rating {getSortIcon('averageRating')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store._id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address.substring(0, 50)}...</td>
                <td>
                  <div className="rating-display">
                    {store.averageRating}/5 
                    <small>({store.totalRatings} ratings)</small>
                  </div>
                </td>
                <td>
                  <button 
                    onClick={() => handleViewStore(store._id)}
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

      {/* Store Details Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        {selectedStore && (
          <div className="store-details">
            <h3>Store Details</h3>
            <div className="detail-row">
              <strong>Store Name:</strong> {selectedStore.name}
            </div>
            <div className="detail-row">
              <strong>Email:</strong> {selectedStore.email}
            </div>
            <div className="detail-row">
              <strong>Address:</strong> {selectedStore.address}
            </div>
            <div className="detail-row">
              <strong>Owner:</strong> {selectedStore.ownerId.name} ({selectedStore.ownerId.email})
            </div>
            <div className="detail-row">
              <strong>Average Rating:</strong> 
              <span className="rating">{selectedStore.averageRating}/5</span>
            </div>
            <div className="detail-row">
              <strong>Total Ratings:</strong> {selectedStore.totalRatings}
            </div>
            <div className="detail-row">
              <strong>Created:</strong> 
              {new Date(selectedStore.createdAt).toLocaleDateString()}
            </div>
            {selectedStore.recentRatings && selectedStore.recentRatings.length > 0 && (
              <div className="recent-ratings">
                <strong>Recent Ratings:</strong>
                {selectedStore.recentRatings.map(rating => (
                  <div key={rating._id} className="rating-item">
                    <span>{rating.userId.name}: {rating.rating}/5</span>
                    {rating.comment && <p>"{rating.comment}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Store Modal */}
      <Modal show={showCreateForm} onClose={() => setShowCreateForm(false)}>
        <CreateStoreForm onStoreCreated={handleStoreCreated} />
      </Modal>
    </div>
  );
};

export default StoreManagement;