import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cdaxx-backend.onrender.com/api',
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// ADD THIS INTERCEPTOR TO INCLUDE TOKEN IN ALL REQUESTS
api.interceptors.request.use(
  (config) => {
    console.log('   Axios Request Interceptor:');
    console.log('   URL:', config.baseURL + config.url);
    console.log('   Method:', config.method);
    console.log('   Full URL:', config.url);
    
    const token = localStorage.getItem('auth_token');
    console.log('   Token in localStorage:', token ? 'Yes (' + token.substring(0, 20) + '...)' : 'No');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header added');
    } else {
      console.log('No token found');
    }
 
    if (config.method === 'get' && config.params) {
      console.log('   Params:', config.params);
    }
    
    console.log('   Headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Axios Response Success:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Axios Response Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      fullUrl: error.config?.baseURL + error.config?.url,
      hasAuthHeader: error.config?.headers?.Authorization ? 'Yes' : 'No',
      params: error.config?.params,
      responseData: error.response?.data
    });
    
    return Promise.reject(error);
  }
);

export default api;