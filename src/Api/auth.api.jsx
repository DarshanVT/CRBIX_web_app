const API_BASE = "https://cdaxx-backend.onrender.com/api/auth";

/**
 * Register a new user (UPDATED for JWT)
 */
export const registerUser = async (userData) => {
  try {
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNo,  // CHANGED: "mobile" → "phoneNumber"
      password: userData.password,
      // REMOVED: cpassword - backend doesn't have this field
    };

    const response = await fetch(`${API_BASE}/jwt/register`, {  // CHANGED: /register → /jwt/register
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    // Store token if registration successful
    if (data.success && data.token) {
      localStorage.setItem('auth_token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
    }
    
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
 * Login user (UPDATED for JWT)
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE}/jwt/login`, {
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
    
    if (data.success && data.token) {
      localStorage.setItem('auth_token', data.token);
      
      // ✅ CRITICAL: Store user ID
      if (data.user && data.user.id) {
        localStorage.setItem('user_id', data.user.id.toString());
        localStorage.setItem('user_info', JSON.stringify(data.user));
        console.log('✅ User ID stored:', data.user.id);
      } else if (data.userId) {
        // Some APIs return userId directly
        localStorage.setItem('user_id', data.userId.toString());
        console.log('✅ User ID stored:', data.userId);
      }
      
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
    }
    
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
 * Get current user profile (NEW - using JWT)
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE}/jwt/me`, {  // NEW endpoint
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      message: 'Failed to get user data'
    };
  }
};

/**
 * Get user profile (NEW - uses the profile endpoint)
 */
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE}/profile/me`, {  // Use this endpoint
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      message: 'Failed to get profile'
    };
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE}/profile/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      message: 'Failed to update profile'
    };
  }
};

/**
 * Validate JWT token
 */
export const validateToken = async (token) => {
  try {
    const response = await fetch(`${API_BASE}/jwt/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Token validation error:', error);
    return {
      success: false,
      valid: false,
      message: 'Token validation failed'
    };
  }
};

// KEEP THESE OLD FUNCTIONS (they might still work)
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

export const checkServerStatus = async () => {
  try {
    const response = await fetch(`${API_BASE}/test`);
    return response.ok;
  } catch (error) {
    console.error('Server check error:', error);
    return false;
  }
};