import React, { useState } from 'react';
import api from '../../services/api';
import Modal from '../Common/Modal';

const PasswordUpdateModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
      newErrors.newPassword = 'Password must be between 8 and 16 characters';
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter and one special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      await api.put('/users/password', formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to update password'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={true} onClose={onClose}>
      <div className="password-update-modal">
        <h3>Update Password</h3>
        
        {success ? (
          <div className="success-message">
            Password updated successfully! Closing...
          </div>
        ) : (
          <>
            {errors.submit && <div className="error-message">{errors.submit}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={errors.currentPassword ? 'error' : ''}
                  required
                />
                {errors.currentPassword && <span className="field-error">{errors.currentPassword}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={errors.newPassword ? 'error' : ''}
                  required
                />
                <small>8-16 characters, with uppercase & special character</small>
                {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
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
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PasswordUpdateModal;