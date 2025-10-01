// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://bite-tok.vercel.app' 
    : 'http://localhost:3000');

export const api = {
  baseURL: API_BASE_URL,
  endpoints: {
    // Auth endpoints
    userLogin: '/api/auth/user/login',
    userRegister: '/api/auth/user/register',
    partnerLogin: '/api/auth/food-partner/login',
    partnerRegister: '/api/auth/food-partner/register',
    allPartners: '/api/auth/food-partner/all',
    
    // Food endpoints
    foodItems: '/api/food/',
    foodCleanup: '/api/food/cleanup',
    foodDelete: (id) => `/api/food/${id}`,
  }
};

export default api;
