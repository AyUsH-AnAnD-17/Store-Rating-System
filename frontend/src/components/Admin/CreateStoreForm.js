import React, { useState } from 'react';
import api from '../../services/api';

const CreateStoreForm = ({ onStoreCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerName: '',
    ownerEmail: '',
    ownerAddress: '',
    ownerPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Store name validation
    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Store name must be between 20 and 60 characters';
    }

    // Store email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid store email address';
    }

    // Store address validation
    if (formData.address.length > 400 || formData.address.length < 1) {
      newErrors.address = 'Store address is required and must not exceed 400 characters';
    }

    // Owner name validation
    if (formData.ownerName.length < 20 || formData.ownerName.length > 60) {
      newErrors.ownerName = 'Owner name must be between 20 and 60 characters';
    }

    // Owner email validation
    if (!emailRegex.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Please enter a valid owner email address';
    }

    // Owner address validation
    if (formData.ownerAddress.length > 400 || formData.ownerAddress.length < 1) {
      newErrors.ownerAddress = 'Owner address is required and must not exceed 400 characters';
    }

    // Owner password validation
    if (formData.ownerPassword.length < 8 || formData.ownerPassword.length > 16) {
      newErrors.ownerPassword = 'Password must be between 8 and 16 characters';
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.ownerPassword)) {
      newErrors.ownerPassword = 'Password must contain at least one uppercase letter and one special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await api.post('/admin/stores', formData);
      onStoreCreated();
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || 'Failed to create store' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-store-form">
      <h3>Create New Store</h3>
      {errors.submit && <div className="error-message">{errors.submit}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h4>Store Information</h4>
          <div className="form-group">
            <label htmlFor="name">Store Name (20-60 characters)</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              required
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Store Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Store Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              rows="3"
              required
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
        </div>

        <div className="form-section">
          <h4>Store Owner Information</h4>
          <div className="form-group">
            <label htmlFor="ownerName">Owner Name (20-60 characters)</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className={errors.ownerName ? 'error' : ''}
              required
            />
            {errors.ownerName && <span className="field-error">{errors.ownerName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ownerEmail">Owner Email</label>
            <input
              type="email"
              id="ownerEmail"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleChange}
              className={errors.ownerEmail ? 'error' : ''}
              required
            />
            {errors.ownerEmail && <span className="field-error">{errors.ownerEmail}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ownerAddress">Owner Address</label>
            <textarea
              id="ownerAddress"
              name="ownerAddress"
              value={formData.ownerAddress}
              onChange={handleChange}
              className={errors.ownerAddress ? 'error' : ''}
              rows="3"
              required
            />
            {errors.ownerAddress && <span className="field-error">{errors.ownerAddress}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ownerPassword">Owner Password (8-16 characters, with uppercase & special character)</label>
            <input
              type="password"
              id="ownerPassword"
              name="ownerPassword"
              value={formData.ownerPassword}
              onChange={handleChange}
              className={errors.ownerPassword ? 'error' : ''}
              required
            />
            {errors.ownerPassword && <span className="field-error">{errors.ownerPassword}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Store...' : 'Create Store'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStoreForm;