// Frontend/src/config/api.js
const isProduction = import.meta.env.MODE === 'production';

const config = {
  development: {
    // For local development, backend runs on different port
    API_BASE_URL: 'wallpaper-app-backend-nu.vercel.app',
    NODE_ENV: 'development'
  },
  production: {
    // For production monorepo, both are on same domain with /api prefix
    API_BASE_URL: '/api',
    NODE_ENV: 'production'
  }
};

const currentConfig = config[isProduction ? 'production' : 'development'];

export const API_BASE_URL = currentConfig.API_BASE_URL;
export const NODE_ENV = currentConfig.NODE_ENV;

// Debug logging
console.log('API Configuration:', {
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: isProduction,
  API_BASE_URL
});

// Enhanced helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  // Construct full URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    },
    // Add credentials for CORS
    credentials: 'include',
    ...options
  };

  try {
    console.log('Making API call to:', url);
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', { url, error: error.message });
    throw error;
  }
};

// API endpoints - all properly configured
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Profile endpoint
  PROFILE: `${API_BASE_URL}/profile`,
  
  // Image endpoints
  EXTERNAL_IMAGES: `${API_BASE_URL}/external`,
  ALL_FAVORITES: `${API_BASE_URL}/images/all-favorites`,
  EXTERNAL_FAVORITE: `${API_BASE_URL}/images/external-favorite`,
  EXTERNAL_FAVORITE_CHECK: (id) => `${API_BASE_URL}/images/external/${id}/is-favorite`,
  EXTERNAL_FAVORITE_REMOVE: (id) => `${API_BASE_URL}/images/external/${id}/favorite`,
  
  // Internal image favorites
  INTERNAL_FAVORITE_ADD: (id) => `${API_BASE_URL}/images/${id}/favorite`,
  INTERNAL_FAVORITE_REMOVE: (id) => `${API_BASE_URL}/images/${id}/favorite`,
  
  // Health check (direct route, not under /api)
  HEALTH: isProduction ? '/health' : 'http://localhost:5000/health'
};

// Export for debugging
export const debugInfo = {
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: isProduction,
  API_BASE_URL,
  endpoints: API_ENDPOINTS
};

export default currentConfig;