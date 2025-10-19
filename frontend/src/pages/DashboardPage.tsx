
// src/pages/DashboardPage.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Dashboard from '../components/dashboard/Dashboard';
import { Navigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Dashboard />;
};