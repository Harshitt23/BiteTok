import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import UserRegister from '../pages/UserRegister';
import UserLogin from '../pages/UserLogin';
import PartnerRegister from '../pages/PartnerRegister';
import PartnerLogin from '../pages/PartnerLogin';
import Home from '../pages/general/home';
import CreateFoodPartner from '../pages/food-partner/createfoodpartner';
import FoodPartnerHome from '../pages/food-partner/foodpartnerhome';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/user/login" replace />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/food-partner/register" element={<PartnerRegister />} />
      <Route path="/food-partner/login" element={<PartnerLogin />} />
      <Route path="/food-partner/create" element={<CreateFoodPartner />} />
      <Route path="/food-partner/home" element={<FoodPartnerHome />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/user/login" replace />} />
    </Routes>
  )
}

export default AppRoutes