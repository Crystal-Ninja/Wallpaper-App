import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "../config/api.js";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Load user if token exists
  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (err) {
          console.error("Error parsing saved user:", err);
          localStorage.removeItem("user");
        }
      }
    }
  }, [token]);

  // Register new user
  const register = useCallback(async (email, password, name) => {
    const res = await fetch(API_ENDPOINTS.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username: name }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
  }, []);

  // Login user
  const login = useCallback(async (email, password) => {
    const res = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  // Logout user
  const logout = useCallback(async () => {
    try {
      // Call backend logout if token exists
      if (token) {
        await fetch(API_ENDPOINTS.LOGOUT, { 
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear local state regardless of backend response
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  }, [token]);

  // Fetch with token automatically
  const authFetch = useCallback(
    async (url, options = {}) => {
      if (!token) throw new Error("Not authenticated");

      const fullUrl = url.startsWith('http') ? url : `${API_ENDPOINTS.API_BASE_URL}${url}`;
      
      const res = await fetch(fullUrl, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        logout(); // auto-logout if token expired
        throw new Error("Unauthorized");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      return res.json();
    },
    [token, logout]
  );

  return { user, token, register, login, logout, authFetch };
}