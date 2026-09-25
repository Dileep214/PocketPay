import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('worknear_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('worknear_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('worknear_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('worknear_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.data?.user) {
            setUser(res.data.user);
            setProfile(res.data.profile);
            localStorage.setItem('worknear_user', JSON.stringify(res.data.user));
            if (res.data.profile) {
              localStorage.setItem('worknear_profile', JSON.stringify(res.data.profile));
            }
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (phone, password) => {
    const res = await authService.login({ phone, password });
    const { user: userData, profile: profileData, token: authToken } = res.data;

    setUser(userData);
    setProfile(profileData);
    setToken(authToken);

    localStorage.setItem('worknear_token', authToken);
    localStorage.setItem('worknear_user', JSON.stringify(userData));
    if (profileData) {
      localStorage.setItem('worknear_profile', JSON.stringify(profileData));
    }

    return userData;
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    const { user: userData, profile: profileData, token: authToken } = res.data;

    setUser(userData);
    setProfile(profileData);
    setToken(authToken);

    localStorage.setItem('worknear_token', authToken);
    localStorage.setItem('worknear_user', JSON.stringify(userData));
    if (profileData) {
      localStorage.setItem('worknear_profile', JSON.stringify(profileData));
    }

    return userData;
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setToken(null);
    localStorage.removeItem('worknear_token');
    localStorage.removeItem('worknear_user');
    localStorage.removeItem('worknear_profile');
  };

  const isWorker = user?.role === 'worker';
  const isEmployer = user?.role === 'employer';
  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated,
        isWorker,
        isEmployer,
        isAdmin,
        login,
        register,
        logout,
        setProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
