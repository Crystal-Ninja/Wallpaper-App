import React, { useState } from "react";
import { useAuth } from "./src/hooks/useAuth.js";

export default function Spp() {
  const { user, login, register, logout, authFetch } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleLogin = async () => {
    try {
      await login(form.email, form.password);
      alert("Logged in!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      await register(form.email, form.password, form.name);
      alert("Registered! Now login.");
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchProtected = async () => {
    try {
      const data = await authFetch("http://localhost:5000/protected");
      console.log(data);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>{user ? `Welcome, ${user.name}` : "Please login"}</h1>

      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={fetchProtected}>Fetch Protected Data</button>
    </div>
  );
}
