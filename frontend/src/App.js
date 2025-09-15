import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserDashboard from './components/User/UserDashboard';
import StoreOwnerDashboard from './components/StoreOwner/StoreOwnerDashboard';
import ProtectedRoute from './components/Common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="stores" element={
                <ProtectedRoute roles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="store-owner" element={
                <ProtectedRoute roles={['store_owner']}>
                  <StoreOwnerDashboard />
                </ProtectedRoute>
              } />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;