// Frontend/src/config/api.js
const isProduction = import.meta.env.MODE === "production";

// Environment-based configuration
const config = {
  development: {
    API_BASE_URL: "http://localhost:5000/api",
    NODE_ENV: "development",
  },
  production: {
    API_BASE_URL: "https://wallpaper-app-backend-rust.vercel.app/api",
    NODE_ENV: "production",
  },
};

const currentConfig = config[isProduction ? "production" : "development"];

export const API_BASE_URL = currentConfig.API_BASE_URL;
export const NODE_ENV = currentConfig.NODE_ENV;

// Debug logging
if (import.meta.env.DEV) {
  console.log("🌐 API Configuration:", {
    mode: import.meta.env.MODE,
    isDev: import.meta.env.DEV,
    isProd: isProduction,
    API_BASE_URL,
  });
}

// ✅ Centralized API call helper
export const apiCall = async (endpoint, options = {}) => {
  // Ensure no duplicate slash
  const cleanEndpoint = endpoint.replace(/^\/+/, "");
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    mode: "cors",
    credentials: "include", // allow cookies/tokens if backend supports it
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP ${response.status}` };
      }
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ API call failed:", { url, error: error.message });

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error - check your internet or backend server");
    }

    throw error;
  }
};

// ✅ API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "auth/login",
  REGISTER: "auth/register",
  LOGOUT: "auth/logout",
  ME: "auth/me", // check current user session

  // Profile
  PROFILE: "profile",

  // Images
  EXTERNAL_IMAGES: "external",
  ALL_FAVORITES: "images/all-favorites",
  EXTERNAL_FAVORITE: "images/external-favorite",
  EXTERNAL_FAVORITE_CHECK: (id) => `images/external/${id}/is-favorite`,
  EXTERNAL_FAVORITE_REMOVE: (id) => `images/external/${id}/favorite`,

  // Internal image favorites
  INTERNAL_FAVORITE_ADD: (id) => `images/${id}/favorite`,
  INTERNAL_FAVORITE_REMOVE: (id) => `images/${id}/favorite`,

  // Health
  HEALTH: isProduction
    ? "https://wallpaper-app-backend-rust.vercel.app/health"
    : "http://localhost:5000/health",
};

// Export debug info for troubleshooting
export const debugInfo = {
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: isProduction,
  API_BASE_URL,
  endpoints: API_ENDPOINTS,
};

export default currentConfig;
