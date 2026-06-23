import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient, endpoints } from '../config/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // the user OR food partner document
  const [role, setRole] = useState(null);   // 'user' | 'foodPartner' | null
  const [loading, setLoading] = useState(true);

  // Hydrate session from the httpOnly cookie on first load.
  const refresh = useCallback(async () => {
    try {
      const { data } = await apiClient.get(endpoints.me);
      setRole(data.role);
      setUser(data.role === 'foodPartner' ? data.foodPartner : data.user);
    } catch {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (asPartner, credentials) => {
    const endpoint = asPartner ? endpoints.partnerLogin : endpoints.userLogin;
    const { data } = await apiClient.post(endpoint, credentials);
    setRole(data.role);
    setUser(data.role === 'foodPartner' ? data.foodPartner : data.user);
    return data;
  }, []);

  const register = useCallback(async (asPartner, payload) => {
    const endpoint = asPartner ? endpoints.partnerRegister : endpoints.userRegister;
    const { data } = await apiClient.post(endpoint, payload);
    setRole(data.role);
    setUser(data.role === 'foodPartner' ? data.foodPartner : data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    const endpoint = role === 'foodPartner' ? endpoints.partnerLogout : endpoints.userLogout;
    try {
      await apiClient.post(endpoint);
    } catch {
      /* clear client state regardless of network result */
    }
    setUser(null);
    setRole(null);
  }, [role]);

  const value = {
    user,
    role,
    loading,
    isAuthenticated: !!user,
    isUser: role === 'user',
    isPartner: role === 'foodPartner',
    login,
    register,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
