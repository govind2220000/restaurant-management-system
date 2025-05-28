


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminLayout from './components/AdminLayout';
import ClientLayout from './components/ClientLayout';
import DashboardPage from './pages/DashboardPage';
import SeatsPage from './pages/SeatsPage';
import OrderLinePage from './pages/OrderLinePage';
import AnalyticsPage from './pages/AnalyticsPage';
import ClientOrderMenuPage from './pages/ClientOrderMenuPage';
import ClientCartPage from './pages/ClientCartPage';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Restaurant Management System</h1>
      </header>
      <main>
        <Router>
          <Routes>
            {/* Root route redirects to client order menu */}
            <Route path="/" element={<Navigate to="/client/order-menu" replace />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="seats" element={<SeatsPage />} />
              <Route path="order-line" element={<OrderLinePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>

            {/* Client routes */}
            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<Navigate to="order-menu" replace />} />
              <Route path="order-menu" element={<ClientOrderMenuPage />} />
              <Route path="cart" element={<ClientCartPage />} />
            </Route>
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;

