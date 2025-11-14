import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CommodityDetail from './components/commodity/CommodityDetail';
import PriceComparison from './components/comparison/PriceComparison';
import MarketFinder from './components/markets/MarketFinder';
import PriceSubmissionForm from './components/reporter/PriceSubmissionForm';

// Placeholder components
const Profile = () => <div>Profile Page</div>;
const NotFound = () => <div>404 Not Found</div>;

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="markets" element={<MarketFinder />} />
            <Route path="compare" element={<PriceComparison />} />
            <Route path="commodity/:id" element={<CommodityDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="submit-price" element={<PriceSubmission />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;