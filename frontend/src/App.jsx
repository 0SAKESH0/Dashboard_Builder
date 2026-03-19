// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import OrdersPage from './pages/OrdersPage';
import DashboardPage from './pages/DashboardPage';
import DashboardBuilderPage from './pages/DashboardBuilderPage';

/**
 * Root application component
 * Sets up routing between Orders and Dashboard pages
 */
const App = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/orders" replace />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard/configure" element={<DashboardBuilderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
