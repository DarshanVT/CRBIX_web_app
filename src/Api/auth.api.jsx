const API_BASE = "https://cdaxx-backend.onrender.com/api/auth";

export const registerUser = async (userData) => {
  try {
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNo,
      password: userData.password,
    };

    const response = await fetch(`${API_BASE}/jwt/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    console.log("Register response:", {
      success: data.success,
      hasAccessToken: !!data.accessToken,
      accessTokenLength: data.accessToken?.length
    });
    
    // Store token if registration successful
    if (data.success && data.accessToken) {
      const tokenStored = safeSetItem('auth_token', data.accessToken);
      
      if (!tokenStored) {
        console.error("❌ FAILED to store auth_token during registration");
      }
      
      if (data.refreshToken) {
        safeSetItem('refresh_token', data.refreshToken);
      }
      
      // Store user data if available
      if (data.user) {
        safeSetItem('user_info', JSON.stringify(data.user));
        if (data.user.id) {
          safeSetItem('user_id', data.user.id.toString());
        }
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

const safeSetItem = (key, value) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    const storedValue = localStorage.getItem(key);
    
    if (storedValue !== stringValue) {
      console.error(` localStorage verification failed for key: ${key}`);
      console.error(`   Expected: ${stringValue.substring(0, 50)}...`);
      console.error(`   Got: ${storedValue?.substring(0, 50)}...`);

      localStorage.removeItem(key);
      localStorage.setItem(key, stringValue);
      

      const retryValue = localStorage.getItem(key);
      if (retryValue !== stringValue) {
        throw new Error(`Persistent localStorage failure for ${key}`);
      }
      console.log(` Retry successful for ${key}`);
    }
    
    return true;
  } catch (error) {
    console.error(` Error storing ${key}:`, error);
    return false;
  }
};



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
    
    console.log(" Login response:", {
      success: data.success,
      hasAccessToken: !!data.accessToken,
      accessTokenLength: data.accessToken?.length,
      hasUser: !!data.user,
      userId: data.user?.id
    });
    
    if (data.success && data.accessToken) {
  
      const tokenStored = safeSetItem('auth_token', data.accessToken);
      
      if (!tokenStored) {
        console.error(" FAILED to store auth_token");
        return {
          success: false,
          message: 'Authentication storage failed'
        };
      }
      
 
      if (data.user && data.user.id) {
        safeSetItem('user_id', data.user.id.toString());
        safeSetItem('user_info', JSON.stringify(data.user));
        console.log(' User ID stored:', data.user.id);
      }
      
      if (data.refreshToken) {
        safeSetItem('refresh_token', data.refreshToken);
      }
      

      const verifyToken = localStorage.getItem('auth_token');
      console.log(" Storage verification:", {
        tokenVerified: verifyToken === data.accessToken,
        tokenLengthMatch: verifyToken?.length === data.accessToken?.length,
        tokenPreview: verifyToken?.substring(0, 30) + '...'
      });
      
      return data;
    } else {
      console.error(" Login failed:", data);
      return {
        success: false,
        message: data.message || 'Login failed'
      };
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.'
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE}/jwt/me`, {  
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


export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE}/profile/me`, {  
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