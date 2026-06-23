import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import UserRegister from '../pages/UserRegister';
import UserLogin from '../pages/UserLogin';
import PartnerRegister from '../pages/PartnerRegister';
import PartnerLogin from '../pages/PartnerLogin';
import Home from '../pages/general/home';
import Saved from '../pages/general/Saved';
import CreateFoodPartner from '../pages/food-partner/createfoodpartner';
import Dashboard from '../pages/food-partner/Dashboard';
import AllPartners from '../pages/food-partner/AllPartners';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/food-partner/register" element={<PartnerRegister />} />
      <Route path="/food-partner/login" element={<PartnerLogin />} />
      <Route path="/food-partner/all" element={<AllPartners />} />

      {/* User-only */}
      <Route
        path="/saved"
        element={
          <ProtectedRoute role="user">
            <Saved />
          </ProtectedRoute>
        }
      />

      {/* Food-partner-only */}
      <Route
        path="/food-partner/home"
        element={
          <ProtectedRoute role="foodPartner">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/food-partner/create"
        element={
          <ProtectedRoute role="foodPartner">
            <CreateFoodPartner />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
