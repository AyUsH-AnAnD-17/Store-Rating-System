import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PasswordUpdateModal from '../User/PasswordUpdateModal';
import './StoreOwnerDashboard.css';

const StoreOwnerDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRatings: 0
  });

  useEffect(() => {
    fetchStoreRatings();
  }, [pagination.currentPage]);

  const fetchStoreRatings = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      
      const response = await api.get('/ratings/store-ratings', { params });
      setStoreData(response.data.store);
      setRatings(response.data.ratings);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching store ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading && !storeData) {
    return <div className="loading">Loading store dashboard...</div>;
  }

  if (!storeData) {
    return <div className="error">No store found for this owner.</div>;
  }

  return (
    <div className="store-owner-dashboard">
      <div className="dashboard-header">
        <h2>Store Owner Dashboard</h2>
        <button 
          onClick={() => setShowPasswordModal(true)}
          className="btn btn-outline"
        >
          Update Password
        </button>
      </div>

      {/* Store Info Card */}
      <div className="store-info-card">
        <h3>{storeData.name}</h3>
        <p className="store-address">{storeData.address}</p>
        <div className="store-stats">
          <div className="stat">
            <h4>Average Rating</h4>
            <div className="rating-display">
              <div className="stars">
                {renderStars(Math.round(storeData.averageRating))}
              </div>
              <span className="rating-number">{storeData.averageRating}/5</span>
            </div>
          </div>
          <div className="stat">
            <h4>Total Reviews</h4>
            <span className="stat-number">{storeData.totalRatings}</span>
          </div>
        </div>
      </div>

      {/* Ratings List */}
      <div className="ratings-section">
        <h3>Customer Ratings & Reviews</h3>
        
        {ratings.length === 0 ? (
          <div className="no-ratings">
            <p>No ratings yet for your store.</p>
          </div>
        ) : (
          <>
            <div className="ratings-list">
              {ratings.map(rating => (
                <div key={rating._id} className="rating-item">
                  <div className="rating-header">
                    <div className="customer-info">
                      <strong>{rating.userId.name}</strong>
                      <span className="customer-email">{rating.userId.email}</span>
                    </div>
                    <div className="rating-info">
                      <div className="stars">
                        {renderStars(rating.rating)}
                      </div>
                      <span className="rating-date">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {rating.comment && (
                    <div className="rating-comment">
                      <p>"{rating.comment}"</p>
                    </div>
                  )}
                </div>
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
          </>
        )}
      </div>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <PasswordUpdateModal 
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default StoreOwnerDashboard;