

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import SeatsPage from './pages/SeatsPage';
import OrderLinePage from './pages/OrderLinePage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Restaurant Management System</h1>
      </header>
      <main>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="seats" element={<SeatsPage />} />
              <Route path="order-line" element={<OrderLinePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;

