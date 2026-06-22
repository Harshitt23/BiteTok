import axios from 'axios';

// Base URL precedence: explicit env var > same-origin in prod > localhost in dev.
const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === 'production' ? window.location.origin : 'http://localhost:3000');

export const endpoints = {
    // Auth
    userLogin: '/api/auth/user/login',
    userRegister: '/api/auth/user/register',
    userLogout: '/api/auth/user/logout',
    partnerLogin: '/api/auth/food-partner/login',
    partnerRegister: '/api/auth/food-partner/register',
    partnerLogout: '/api/auth/food-partner/logout',
    allPartners: '/api/auth/food-partner/all',
    me: '/api/auth/me',

    // Food
    feed: '/api/food',
    myFood: '/api/food/mine',
    savedFood: '/api/food/saved',
    foodById: (id) => `/api/food/${id}`,
    foodDelete: (id) => `/api/food/${id}`,
    like: (id) => `/api/food/${id}/like`,
    save: (id) => `/api/food/${id}/save`,
    comments: (id) => `/api/food/${id}/comments`,
    deleteComment: (id) => `/api/food/comments/${id}`,
};

// Shared axios instance: cookies sent on every request, errors normalized.
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.message ||
            'Something went wrong. Please try again.';
        return Promise.reject(Object.assign(error, { uiMessage: message }));
    }
);

// Backwards-compatible default export (baseURL + endpoints) used by older pages.
const api = { baseURL: API_BASE_URL, endpoints };
export default api;
