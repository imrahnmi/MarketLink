import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';

// Placeholder components
const Home = () => <div>Home Page</div>;
const Markets = () => <div>Markets Page</div>;
const Compare = () => <div>Compare Page</div>;
const CommodityDetail = () => <div>Commodity Detail Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const Profile = () => <div>Profile Page</div>;
const PriceSubmission = () => <div>Price Submission Page</div>;
const NotFound = () => <div>404 Not Found</div>;

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="markets" element={<Markets />} />
            <Route path="compare" element={<Compare />} />
            <Route path="commodity/:id" element={<CommodityDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="submit-price" element={<PriceSubmissionForm />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;