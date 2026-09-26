import axios from 'axios';

const normalizeApiBase = (value) => {
  const cleanedValue = (value || 'https://pocketpay-ejdi.onrender.com/api/v1').trim().replace(/\s+/g, '');

  if (/\/api\/v1$/i.test(cleanedValue)) {
    return cleanedValue.replace(/\/+$/, '');
  }

  return `${cleanedValue.replace(/\/+$/, '')}/api/v1`;
};

const apiClient = axios.create({
  baseURL: normalizeApiBase(import.meta.env.VITE_API_URL || 'https://pocketpay-ejdi.onrender.com/api/v1'),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('worknear_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract data and handle 401
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('worknear_token');
      localStorage.removeItem('worknear_user');
      // If unauthorized and not already on login, redirect
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login?expired=true';
      }
    }
    const message = error.response?.data?.error?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
