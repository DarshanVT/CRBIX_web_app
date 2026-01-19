// In your api.jsx or axios configuration file
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.9:8080/api',
  timeout: 10000,
});

// ✅ ADD THIS INTERCEPTOR TO INCLUDE TOKEN IN ALL REQUESTS
api.interceptors.request.use(
  (config) => {
    console.log('🔐 Axios Request Interceptor:');
    console.log('   URL:', config.url);
    console.log('   Method:', config.method);
    
    const token = localStorage.getItem('auth_token');
    console.log('   Token in localStorage:', token ? 'Yes (' + token.substring(0, 20) + '...)' : 'No');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('   ✅ Authorization header added');
    } else {
      console.log('   ❌ No token found');
    }
    
    console.log('   Headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Also add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Axios Response:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method
    });
    return response;
  },
  (error) => {
    console.error('❌ Axios Response Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      hasAuthHeader: error.config?.headers?.Authorization ? 'Yes' : 'No'
    });
    
    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized - Clearing tokens');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;