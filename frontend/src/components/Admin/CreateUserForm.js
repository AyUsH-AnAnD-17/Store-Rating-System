import React, { useState } from 'react';
import api from '../../services/api';

const CreateUserForm = ({ role = 'user', onUserCreated, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters';
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Address validation
    if (formData.address.length > 400 || formData.address.length < 1) {
      newErrors.address = 'Address is required and must not exceed 400 characters';
    }

    // Password validation
    if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = 'Password must be between 8 and 16 characters';
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter and one special character';
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
      await api.post('/admin/users', {
        ...formData,
        role
      });
      onUserCreated();
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || `Failed to create ${role}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-form">
      <h3>{title || `Create New ${role.charAt(0).toUpperCase() + role.slice(1)}`}</h3>
      {errors.submit && <div className="error-message">{errors.submit}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            <span className="form-icon">👤</span>
            Full Name (20-60 characters)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter full name"
            required
          />
          <small className="char-count">{formData.name.length}/60 characters</small>
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <span className="form-icon">📧</span>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="Enter email address"
            required
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">
            <span className="form-icon">🏠</span>
            Address (max 400 characters)
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
            rows="3"
            placeholder="Enter full address"
            required
          />
          <small className="char-count">{formData.address.length}/400 characters</small>
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <span className="form-icon">🔐</span>
            Password (8-16 characters, with uppercase & special character)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            placeholder="Enter secure password"
            required
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="role-info">
          <div className={`role-indicator ${role}`}>
            <span className="role-icon">
              {role === 'admin' ? '👨‍💼' : '👤'}
            </span>
            Creating {role === 'admin' ? 'Administrator' : 'Regular User'}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Creating...
              </>
            ) : (
              <>
                <span className="btn-icon">✓</span>
                Create {role === 'admin' ? 'Administrator' : 'User'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;