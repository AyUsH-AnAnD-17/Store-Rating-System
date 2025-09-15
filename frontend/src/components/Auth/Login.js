import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();

  if (user) {
    // Redirect based on user role
    if (user.role === 'admin') return <Navigate to="/dashboard" replace />;
    if (user.role === 'user') return <Navigate to="/stores" replace />;
    if (user.role === 'store_owner') return <Navigate to="/store-owner" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Store Rating System</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
        </div>

        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p><strong>Admin:</strong> admin@storerating.com / Admin123!</p>
          <p><strong>User:</strong> alice.johnson@email.com / User123!</p>
          <p><strong>Store Owner:</strong> michael.owner@pizzapalace.com / Owner123!</p>
        </div>
      </div>
    </div>
  );
};

export default Login;