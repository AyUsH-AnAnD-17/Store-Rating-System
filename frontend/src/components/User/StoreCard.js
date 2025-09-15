import React from 'react';
import './StoreCard.css';

const StoreCard = ({ store, onRate }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="store-card">
      <div className="store-header">
        <h3 className="store-name">{store.name}</h3>
        <div className="store-rating">
          <div className="stars">
            {renderStars(store.averageRating)}
          </div>
          <span className="rating-text">
            {store.averageRating}/5 ({store.totalRatings} reviews)
          </span>
        </div>
      </div>
      
      <div className="store-info">
        <p className="store-address">{store.address}</p>
      </div>

      <div className="user-rating-section">
        {store.userRating ? (
          <div className="user-rating">
            <span>Your rating: {store.userRating.rating}/5</span>
            <button 
              onClick={onRate}
              className="btn btn-sm btn-outline"
            >
              Update Rating
            </button>
          </div>
        ) : (
          <div className="no-rating">
            <button 
              onClick={onRate}
              className="btn btn-sm btn-primary"
            >
              Rate This Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreCard;