import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // ✅ Load user if token exists
  useEffect(() => {
    if (token) {
      // You can also call /me endpoint if your backend supports it
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) setUser(savedUser);
    }
  }, [token]);

  // ✅ Register new user
  const register = useCallback(async (email, password, name) => {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
  }, []);

  // ✅ Login user
  const login = useCallback(async (email, password) => {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  // ✅ Logout user
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    // Optional: call backend logout
    fetch("http://localhost:5000/auth/logout", { method: "POST" });
  }, []);

  // ✅ Fetch with token automatically
  const authFetch = useCallback(
    async (url, options = {}) => {
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        logout(); // auto-logout if token expired
        throw new Error("Unauthorized");
      }

      return res.json();
    },
    [token, logout]
  );

  return { user, token, register, login, logout, authFetch };
}
