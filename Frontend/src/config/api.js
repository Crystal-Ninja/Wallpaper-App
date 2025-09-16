// src/config/api.js
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
    NODE_ENV: 'development'
  },
  production: {
    // Replace with your actual Vercel backend URL
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://your-backend-app.vercel.app',
    NODE_ENV: 'production'
  }
};

const currentConfig = config[import.meta.env.MODE] || config.development;

export const API_BASE_URL = currentConfig.API_BASE_URL;
export const NODE_ENV = currentConfig.NODE_ENV;

// Helper function to make API calls with better error handling
export const apiCall = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Profile
  PROFILE: `${API_BASE_URL}/profile`,
  
  // Images
  EXTERNAL_IMAGES: `${API_BASE_URL}/external`,
  ALL_FAVORITES: `${API_BASE_URL}/images/all-favorites`,
  EXTERNAL_FAVORITE: `${API_BASE_URL}/images/external-favorite`,
  EXTERNAL_FAVORITE_CHECK: (id) => `${API_BASE_URL}/images/external/${id}/is-favorite`,
  EXTERNAL_FAVORITE_REMOVE: (id) => `${API_BASE_URL}/images/external/${id}/favorite`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`
};

export default currentConfig;