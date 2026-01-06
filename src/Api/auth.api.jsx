// src/Api/auth.api.js

const API_BASE = "https://cdaxx-app-yz51.onrender.com/api/auth";

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Response object
 */
export const registerUser = async (userData) => {
  try {
    // Map frontend fields to backend fields
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      mobile: userData.phoneNo,  // Note: frontend uses phoneNo, backend expects mobile
      password: userData.password,
      cpassword: userData.cPass  // Note: frontend uses cPass, backend expects cpassword
    };

    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.'
    };
  }
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} Response object
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.'
    };
  }
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object>} User data
 */
export const getUserByEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE}/getUserByEmail?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

/**
 * Get first name by email
 * @param {string} email - User email
 * @returns {Promise<string>} First name
 */
export const getFirstName = async (email) => {
  try {
    const response = await fetch(`${API_BASE}/firstName?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return data.firstName;
  } catch (error) {
    console.error('Get first name error:', error);
    return null;
  }
};

/**
 * Check if server is running
 * @returns {Promise<boolean>} Server status
 */
export const checkServerStatus = async () => {
  try {
    const response = await fetch(`${API_BASE}/test`);
    return response.ok;
  } catch (error) {
    console.error('Server check error:', error);
    return false;
  }
};