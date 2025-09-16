// Frontend/src/config/api.js
const config = {
  development: {
    // For local development, backend runs on different port
    API_BASE_URL: 'http://localhost:5000/api',
    NODE_ENV: 'development'
  },
  production: {
    // For production monorepo, both are on same domain with /api prefix
    API_BASE_URL: '/api',
    NODE_ENV: 'production'
  }
};

const currentConfig = config[import.meta.env.MODE] || config.development;

export const API_BASE_URL = currentConfig.API_BASE_URL;
export const NODE_ENV = currentConfig.NODE_ENV;

// Helper function for API calls
export const apiCall = async (url, options = {}) => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(fullUrl, defaultOptions);
    
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

// API endpoints - all with /api prefix for consistency
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
  HEALTH: '/health' // Direct route, not under /api
};

export default currentConfig;