import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../Common/Modal';

const RatingModal = ({ store, onClose, onSubmit }) => {
  const [rating, setRating] = useState(store.userRating?.rating || 0);
  const [comment, setComment] = useState(store.userRating?.comment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/ratings', {
        storeId: store._id,
        rating,
        comment
      });
      onSubmit();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={true} onClose={onClose}>
      <div className="rating-modal">
        <h3>{store.userRating ? 'Update' : 'Submit'} Rating for {store.name}</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating (1-5)</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  type="button"
                  className={`star-button ${rating >= value ? 'selected' : ''}`}
                  onClick={() => setRating(value)}
                >
                  ★
                </button>
              ))}
            </div>
            <small>Selected: {rating}/5</small>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Comment (optional)</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              maxLength="500"
              placeholder="Share your experience..."
            />
            <small>{comment.length}/500 characters</small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : (store.userRating ? 'Update Rating' : 'Submit Rating')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RatingModal;